"use client";

import { useState, useTransition, useEffect } from "react";
import { trackResourceViewed, trackResourceSaved } from "@/lib/ga-events";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";
import SourcesDropdown from "@/components/SourcesDropdown";

// ── LANGUAGE ───────────────────────────────────────────────────────────────────

type Lang = "en" | "id";

const tFn = (en: string, id: string, lang: Lang): string =>
  lang === "id" ? id : en;

// ── BRAND TOKENS ───────────────────────────────────────────────────────────────

const navy        = "oklch(22% 0.10 260)";
const navyDeep    = "oklch(18% 0.10 260)";
const amber       = "oklch(65% 0.15 45)";
const amberDim    = "oklch(65% 0.15 45 / 0.12)";
const offWhite    = "oklch(96% 0.005 80)";
const lightGray   = "oklch(95% 0.008 80)";
const mutedGray   = "oklch(93% 0.008 80)";
const bodyText    = "oklch(38% 0.05 260)";
const subText     = "oklch(52% 0.008 260)";
const dimOnNavy   = "oklch(76% 0.03 80)";
const lightOnNavy = "oklch(88% 0.02 80)";
const serif       = "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif";

// ── CONTENT DATA ───────────────────────────────────────────────────────────────

const CONTRAST_AVOIDANCE = [
  "The meeting ends but nothing is actually decided.",
  "You sense tension but no one names it.",
  "You walk on eggshells because you have learned that honesty has a cost.",
  "Frustration builds quietly over months until something breaks.",
  "Relationships feel polite but never quite close.",
];

const CONTRAST_HEALTHY = [
  "Disagreement comes to the surface before it becomes a crisis.",
  "People say what they actually think, and the team hears it.",
  "Trust deepens because people know where they actually stand.",
  "Decisions stick because everyone had a real voice in them.",
  "Relationships are honest enough to be genuinely close.",
];

const TEACHING_SECTIONS = [
  {
    title: { en: "Why we avoid it", id: "Mengapa kita menghindarinya" },
    bg: offWhite,
    paragraphs: [
      {
        en: "Conflict avoidance is not laziness. It is usually an intelligent, culturally rational response to a real social risk.",
        id: "Menghindari konflik bukan bentuk kemalasan. Biasanya itu adalah respons cerdas yang masuk akal secara budaya terhadap risiko sosial yang nyata.",
        pullQuote: false,
      },
      {
        en: "In high-context cultures, and this includes most of the contexts where cross-cultural workers operate, direct confrontation can rupture the very things a person is trying to protect: relationship, respect, belonging, face. Staying silent is not passive. It is an active strategy for preserving what matters. A team member who goes quiet in a meeting is not necessarily disengaged. They may be doing exactly what their culture has taught them to do: protect the group by not introducing a point of tension.",
        id: "Dalam budaya high-context, dan ini mencakup sebagian besar konteks di mana pekerja lintas budaya beroperasi, konfrontasi langsung dapat merusak hal-hal yang justru ingin dilindungi seseorang: hubungan, rasa hormat, rasa memiliki, dan kehormatan diri. Diam bukanlah sikap pasif. Itu adalah strategi aktif untuk menjaga apa yang penting. Anggota tim yang diam dalam rapat belum tentu tidak peduli. Mereka mungkin sedang melakukan persis apa yang diajarkan budayanya: melindungi kelompok dengan tidak memunculkan titik ketegangan.",
        pullQuote: false,
      },
      {
        en: "The problem is not the instinct. The problem is when that instinct operates in every situation, including ones where the silence is slowly poisoning the team.",
        id: "Masalahnya bukan pada instingnya. Masalahnya adalah ketika insting itu bekerja di setiap situasi, termasuk situasi di mana diam itu pelan-pelan meracuni tim.",
        pullQuote: false,
      },
    ],
  },
  {
    title: { en: "What avoidance actually costs", id: "Apa yang sebenarnya hilang dari penghindaran" },
    bg: navy,
    dark: true,
    paragraphs: [
      {
        en: "Unaddressed conflict does not disappear. It relocates.",
        id: "Konflik yang tidak ditangani tidak hilang. Ia berpindah tempat.",
        pullQuote: false,
      },
      {
        en: "It moves from the meeting room into side conversations. From side conversations into fixed positions. From fixed positions into a quiet, steady erosion of trust. The team learns that honest disagreement is not safe. So they stop offering it. They give you their public agreement and keep their real opinions private. And at that point, you lose access to the best thinking of the people you are leading.",
        id: "Ia berpindah dari ruang rapat ke percakapan di balik layar. Dari percakapan di balik layar menjadi posisi yang mengeras. Dari posisi yang mengeras menjadi erosi kepercayaan yang sunyi dan terus-menerus. Tim belajar bahwa ketidaksetujuan yang jujur itu tidak aman. Maka mereka berhenti menawarkannya. Mereka memberimu persetujuan di depan, tapi menyimpan pendapat asli mereka sendiri. Dan pada titik itu, kamu kehilangan akses ke pemikiran terbaik dari orang-orang yang kamu pimpin.",
        pullQuote: false,
      },
      {
        en: "The cost is not just relational. It is strategic. Decisions made without honest input are weaker decisions. A direction that everyone nodded at but no one believed in will not hold under pressure. And in cross-cultural ministry contexts, where the pressures are real and the stakes are high, weak alignment breaks down at exactly the worst moment.",
        id: "Kerugiannya bukan hanya soal hubungan. Ini juga soal strategi. Keputusan yang dibuat tanpa masukan yang jujur adalah keputusan yang lemah. Arah yang semua orang angguki tapi tak ada yang sungguh-sungguh percayai tidak akan bertahan di bawah tekanan. Dan dalam konteks pelayanan lintas budaya, di mana tekanan itu nyata dan taruhannya tinggi, keselarasan yang lemah akan runtuh tepat di saat yang paling buruk.",
        pullQuote: false,
      },
    ],
  },
  {
    title: { en: "The reframe", id: "Mengubah sudut pandang" },
    bg: offWhite,
    paragraphs: [
      {
        en: "Here is the shift that changes everything: conflict is not the opposite of harmony. It is often the path to it.",
        id: "Inilah pergeseran yang mengubah segalanya: konflik bukan lawan dari keharmonisan. Justru seringkali konflik adalah jalannya.",
        pullQuote: true,
      },
      {
        en: "Real unity is not the absence of disagreement. It is the result of working through disagreement in a way that leaves people feeling heard, respected, and genuinely part of a shared decision. The team that has never had an honest argument is not a close team. It is a careful team. There is a difference.",
        id: "Persatuan yang sejati bukan berarti tidak ada ketidaksetujuan. Itu adalah hasil dari melewati ketidaksetujuan dengan cara yang membuat orang merasa didengar, dihormati, dan benar-benar menjadi bagian dari keputusan bersama. Tim yang tidak pernah berselisih secara jujur bukan tim yang dekat. Itu tim yang berhati-hati. Ada bedanya.",
        pullQuote: false,
      },
      {
        en: "Peace that has not been tested is fragile. Peace that has come through honest conflict has weight to it. It can hold when the environment gets difficult, because the people involved have already proven to each other that they can handle hard conversations without the relationship falling apart.",
        id: "Damai yang belum diuji itu rapuh. Damai yang lahir melalui konflik yang jujur memiliki bobot. Ia dapat bertahan ketika situasi menjadi sulit, karena orang-orang yang terlibat sudah membuktikan satu sama lain bahwa mereka bisa menangani percakapan yang berat tanpa hubungan itu hancur.",
        pullQuote: false,
      },
    ],
  },
  {
    title: { en: "What good conflict looks like", id: "Seperti apa konflik yang sehat" },
    bg: lightGray,
    paragraphs: [
      {
        en: "Productive conflict has a texture that is different from destructive conflict, and a leader needs to be able to recognise both.",
        id: "Konflik yang produktif memiliki tekstur yang berbeda dari konflik yang destruktif, dan seorang pemimpin perlu mampu mengenali keduanya.",
        pullQuote: false,
      },
      {
        en: "Destructive conflict is personal. It attacks character rather than engaging with ideas. It escalates without resolution. It leaves people feeling unsafe, diminished, or dismissed. This is the conflict most people are trying to avoid, and rightly so.",
        id: "Konflik yang destruktif bersifat personal. Ia menyerang karakter alih-alih terlibat dengan gagasan. Ia meningkat tanpa resolusi. Ia membuat orang merasa tidak aman, direndahkan, atau diabaikan. Inilah konflik yang kebanyakan orang berusaha hindari, dan itu wajar.",
        pullQuote: false,
      },
      {
        en: "Productive conflict is about the issue, not the person.",
        id: "Konflik yang produktif membahas masalahnya, bukan orangnya.",
        pullQuote: true,
      },
      {
        en: "It is curious rather than combative. It tolerates disagreement without requiring immediate resolution. It stays in the room, meaning people do not withdraw into silence or take the argument sideways into other relationships. And it ends with both parties having a clearer picture than they started with, even if they have not fully resolved their differences.",
        id: "Ia penuh rasa ingin tahu, bukan suka bertarung. Ia mentolerir ketidaksetujuan tanpa menuntut resolusi segera. Ia tetap di dalam ruangan, artinya orang tidak mundur ke dalam diam atau membawa argumen itu ke hubungan-hubungan lain secara tidak langsung. Dan ia berakhir dengan kedua pihak memiliki gambaran yang lebih jelas dari sebelumnya, meski perbedaan mereka belum sepenuhnya terselesaikan.",
        pullQuote: false,
      },
      {
        en: "The leader's job is not to prevent conflict. It is to create the conditions where the productive kind becomes possible and the destructive kind loses its oxygen.",
        id: "Tugas pemimpin bukan mencegah konflik. Tugasnya adalah menciptakan kondisi di mana jenis yang produktif menjadi mungkin dan jenis yang destruktif kehilangan oksigennya.",
        pullQuote: false,
      },
    ],
  },
];

const CONCEPT_CARDS = [
  {
    number: 1,
    title: {
      en: "Name what is coming before it arrives",
      id: "Sebutkan apa yang akan datang sebelum ia tiba",
    },
    body: {
      en: "Before any difficult conversation, tell the people in the room that conflict is going to happen and that it is supposed to. When people are not surprised by tension, they are less likely to react to it as a threat.",
      id: "Sebelum percakapan sulit apa pun, beritahu orang-orang di ruangan bahwa konflik akan terjadi dan memang seharusnya demikian. Ketika orang tidak terkejut dengan ketegangan, mereka lebih kecil kemungkinannya bereaksi seolah itu ancaman.",
    },
    script: {
      en: "\"I want us to expect that we are going to disagree today. That is actually the goal. If we leave without having disagreed, we probably have not gone deep enough.\"",
      id: "\"Saya ingin kita semua mengharapkan bahwa kita akan berselisih pendapat hari ini. Itu sebenarnya tujuannya. Jika kita pergi tanpa berselisih, kita mungkin belum cukup dalam.\"",
    },
  },
  {
    number: 2,
    title: {
      en: "Conflict means listening, not just speaking",
      id: "Konflik berarti mendengarkan, bukan hanya berbicara",
    },
    body: {
      en: "A conflict conversation that is only about getting your position across is not conflict, it is performance. Productive conflict requires that each person genuinely tries to understand why the other person holds their view.",
      id: "Percakapan konflik yang hanya tentang menyampaikan posisimu bukan konflik, itu penampilan. Konflik yang produktif mengharuskan setiap orang sungguh-sungguh berusaha memahami mengapa orang lain memegang pandangannya.",
    },
    script: {
      en: "\"Before you respond, tell me if you understood what they were saying. Not whether you agree. Whether you understood.\"",
      id: "\"Sebelum kamu merespons, ceritakan apakah kamu memahami apa yang mereka katakan. Bukan apakah kamu setuju. Apakah kamu memahami.\"",
    },
  },
  {
    number: 3,
    title: {
      en: "The goal is a broader picture, not a winner",
      id: "Tujuannya adalah gambaran yang lebih luas, bukan pemenang",
    },
    body: {
      en: "When two people with different perspectives engage honestly, both of them usually see something they could not see alone. The goal of the conflict table is not to determine who is right. It is to build a more complete picture than either person brought in.",
      id: "Ketika dua orang dengan perspektif berbeda terlibat dengan jujur, keduanya biasanya melihat sesuatu yang tidak bisa mereka lihat sendirian. Tujuan dari meja konflik bukan untuk menentukan siapa yang benar. Tujuannya adalah membangun gambaran yang lebih lengkap dari apa yang dibawa oleh masing-masing orang.",
    },
    script: {
      en: "\"Let us hold both of these views at the same time for a moment and see what we can see from that position.\"",
      id: "\"Mari kita tahan kedua pandangan ini sekaligus sejenak dan lihat apa yang bisa kita lihat dari posisi itu.\"",
    },
  },
  {
    number: 4,
    title: {
      en: "Changing your mind is a sign of strength",
      id: "Mengubah pikiran adalah tanda kekuatan",
    },
    body: {
      en: "In many cultural contexts, publicly changing your position feels like a loss of face. A good leader names this directly and reframes it before the conversation starts.",
      id: "Dalam banyak konteks budaya, mengubah posisi secara terbuka terasa seperti kehilangan muka. Seorang pemimpin yang baik menyebutkan ini secara langsung dan membingkainya kembali sebelum percakapan dimulai.",
    },
    script: {
      en: "\"If you walk out of this conversation thinking differently than you walked in, that is exactly what is supposed to happen. That is not weakness. That is what it looks like when two people actually think together.\"",
      id: "\"Jika kamu keluar dari percakapan ini dengan berpikir berbeda dari ketika kamu masuk, itulah yang seharusnya terjadi. Itu bukan kelemahan. Itulah yang terjadi ketika dua orang sungguh-sungguh berpikir bersama.\"",
    },
  },
  {
    number: 5,
    title: {
      en: "Prepare the room before you need it",
      id: "Persiapkan ruangan sebelum kamu membutuhkannya",
    },
    body: {
      en: "A leader cannot create safety in the middle of conflict if they have not built it beforehand. Trust is the infrastructure of productive disagreement. The time to invest in relationship, shared values, and honest communication is before the hard conversation is needed, not when you are already in it.",
      id: "Seorang pemimpin tidak bisa menciptakan rasa aman di tengah konflik jika ia belum membangunnya sebelumnya. Kepercayaan adalah infrastruktur dari ketidaksetujuan yang produktif. Waktu untuk berinvestasi dalam hubungan, nilai bersama, dan komunikasi yang jujur adalah sebelum percakapan sulit itu dibutuhkan, bukan ketika kamu sudah berada di dalamnya.",
    },
    script: {
      en: "\"Part of my job as a leader is to make sure that when we hit a hard moment together, we already have enough trust in the room to handle it.\"",
      id: "\"Bagian dari tugas saya sebagai pemimpin adalah memastikan bahwa ketika kita menghadapi momen sulit bersama, kita sudah memiliki cukup kepercayaan di dalam ruangan untuk menanganinya.\"",
    },
  },
];

const FIELD_STORY_PARAGRAPHS = [
  {
    en: "Two leaders were working together in a children's home in Southeast Asia. One came from abroad, one from the local community. Both were deeply committed to the work. Both brought clear vision and strong convictions about how things should run.",
    id: "Dua pemimpin bekerja bersama di sebuah panti asuhan di Asia Tenggara. Satu datang dari luar negeri, satu dari komunitas lokal. Keduanya sangat berkomitmen pada pekerjaan itu. Keduanya membawa visi yang jelas dan keyakinan kuat tentang bagaimana seharusnya segala sesuatu berjalan.",
    climax: false,
  },
  {
    en: "And both of them knew, from the first weeks, that they saw things differently.",
    id: "Dan keduanya tahu, sejak minggu-minggu pertama, bahwa mereka melihat hal-hal dengan cara yang berbeda.",
    climax: false,
  },
  {
    en: "Their working styles were different. Their assumptions about decision-making were different. Their instincts about how to care for the children were different. None of this was hidden from them. They were intelligent people. They could see the gap clearly.",
    id: "Gaya kerja mereka berbeda. Asumsi mereka tentang pengambilan keputusan berbeda. Insting mereka tentang cara merawat anak-anak berbeda. Tidak ada dari ini yang tersembunyi bagi mereka. Mereka adalah orang-orang yang cerdas. Mereka bisa melihat perbedaannya dengan jelas.",
    climax: false,
  },
  {
    en: "What they could not do was talk about it.",
    id: "Yang tidak bisa mereka lakukan adalah membicarakannya.",
    climax: false,
  },
  {
    en: "The reason was not hostility. It was the opposite. They respected each other deeply. And that respect had become a barrier. Neither wanted to damage what they had built. Neither wanted to cause the other person discomfort. So they stayed careful. They stayed polite. And the gap stayed open.",
    id: "Alasannya bukan permusuhan. Justru sebaliknya. Mereka saling menghormati dengan dalam. Dan rasa hormat itu telah menjadi penghalang. Tidak satu pun yang ingin merusak apa yang telah mereka bangun. Tidak satu pun yang ingin membuat orang lain tidak nyaman. Maka mereka tetap berhati-hati. Mereka tetap sopan. Dan jurang itu tetap terbuka.",
    climax: false,
  },
  {
    en: "One day, a third person who knew them both well sat down with them and said something simple: \"I want to bring you to a table where conflict is going to happen. I think you need it, and I think it is safe.\"",
    id: "Suatu hari, orang ketiga yang mengenal keduanya dengan baik duduk bersama mereka dan mengatakan sesuatu yang sederhana: \"Saya ingin membawa kamu ke sebuah meja di mana konflik akan terjadi. Saya pikir kamu membutuhkannya, dan saya pikir itu aman.\"",
    climax: true,
  },
  {
    en: "He set some ground rules. Not a long list. Just enough to name what kind of conversation this was going to be.",
    id: "Ia menetapkan beberapa aturan dasar. Bukan daftar yang panjang. Cukup untuk menamai jenis percakapan apa ini yang akan terjadi.",
    climax: false,
  },
  {
    en: "Then both of them talked. Honestly. It was not comfortable. There were moments of real friction. But there were also moments where one of them said something that visibly landed for the other person, where a position they had held softened because they had actually heard a different view.",
    id: "Lalu keduanya berbicara. Dengan jujur. Itu tidak nyaman. Ada momen-momen gesekan yang nyata. Tapi ada juga momen-momen di mana salah satu dari mereka mengatakan sesuatu yang jelas-jelas mengena bagi orang lain, di mana posisi yang selama ini mereka pegang melunak karena mereka benar-benar mendengar pandangan yang berbeda.",
    climax: false,
  },
  {
    en: "They did not resolve everything. Some of their differences remained. But they left with something they had not had before: a way of talking to each other about the things that mattered. Unity grew from that table. Not because the conflict disappeared, but because it was finally allowed to exist.",
    id: "Mereka tidak menyelesaikan semuanya. Beberapa perbedaan mereka tetap ada. Tapi mereka pergi dengan sesuatu yang belum pernah mereka miliki sebelumnya: cara untuk saling berbicara tentang hal-hal yang penting. Persatuan tumbuh dari meja itu. Bukan karena konflik itu hilang, tapi karena ia akhirnya diizinkan untuk ada.",
    climax: false,
  },
];

const FAITH_ANCHOR_PARAGRAPHS = [
  {
    en: (
      <>
        <span style={{ color: amber, fontWeight: 700 }}>Ephesians 4:15</span> is often quoted in pieces: &ldquo;speaking the truth in love.&rdquo; But the full context matters. Paul is describing what it looks like for a body to grow up into maturity. Speaking truth in love is not a communication style. It is a description of how community develops towards health. Silence, in that framework, is not neutrality. It is a withdrawal from the process of growth.
      </>
    ),
    id: (
      <>
        <span style={{ color: amber, fontWeight: 700 }}>Efesus 4:15</span> sering dikutip secara sepotong: &ldquo;berkata benar dalam kasih.&rdquo; Tetapi konteks penuhnya penting. Paulus menggambarkan seperti apa ketika sebuah tubuh bertumbuh menjadi dewasa. Berkata benar dalam kasih bukan gaya komunikasi. Itu adalah deskripsi bagaimana komunitas berkembang menuju kesehatan. Diam, dalam kerangka itu, bukan netralitas. Itu adalah penarikan diri dari proses pertumbuhan.
      </>
    ),
    elevated: false,
  },
  {
    en: (
      <>
        <span style={{ color: amber, fontWeight: 700 }}>Proverbs 27:17</span> says that iron sharpens iron. That is not a comfortable image. Iron against iron produces friction, heat, and spark. It produces something better than what either piece was before the contact. The sharpening requires the friction.
      </>
    ),
    id: (
      <>
        <span style={{ color: amber, fontWeight: 700 }}>Amsal 27:17</span> berkata bahwa besi mengasah besi. Itu bukan gambaran yang nyaman. Besi melawan besi menghasilkan gesekan, panas, dan percikan. Itu menghasilkan sesuatu yang lebih baik dari apa yang masing-masing benda sebelum bersentuhan. Penajaman membutuhkan gesekan.
      </>
    ),
    elevated: false,
  },
  {
    en: (
      <>
        Confrontation, when it is rooted in genuine care for the other person and the shared work, is an act of covenant love. It says: I care about you enough to be honest with you. I care about what we are building together enough to name what is wrong.
      </>
    ),
    id: (
      <>
        Konfrontasi, ketika berakar pada kepedulian tulus terhadap orang lain dan pekerjaan bersama, adalah tindakan kasih perjanjian. Ini berkata: Saya cukup peduli pada kamu untuk jujur kepadamu. Saya cukup peduli tentang apa yang kita bangun bersama untuk menyebutkan apa yang salah.
      </>
    ),
    elevated: false,
  },
  {
    en: (
      <>
        Silence, in the face of genuine dysfunction, is not kindness. It protects your own comfort at the expense of the person, the team, and the mission you share. The leader who avoids hard conversations is not protecting anyone. They are choosing their own peace over the health of the people they lead.
      </>
    ),
    id: (
      <>
        Diam, di hadapan disfungsi yang nyata, bukanlah kebaikan. Itu melindungi kenyamanan kamu sendiri dengan mengorbankan orang, tim, dan misi yang kalian bagi. Pemimpin yang menghindari percakapan sulit tidak melindungi siapa pun. Mereka memilih kedamaian mereka sendiri di atas kesehatan orang yang mereka pimpin.
      </>
    ),
    elevated: true,
  },
];

const REFLECTION_QUESTIONS = [
  {
    en: "What conversation have you been avoiding, and what has that silence cost? Not in theory, but specifically: what has it cost the person, the relationship, the team, or the work?",
    id: "Percakapan apa yang selama ini kamu hindari, dan apa yang sudah dibayar oleh keheningan itu? Bukan secara teori, tapi secara konkret: apa yang sudah dibayarnya pada orang tersebut, hubungan, tim, atau pekerjaan?",
  },
  {
    en: "Think of a leader you have seen handle conflict well. What did they do that made it feel different from destructive conflict? What can you apply from how they handled it?",
    id: "Pikirkan seorang pemimpin yang pernah kamu lihat menangani konflik dengan baik. Apa yang mereka lakukan sehingga terasa berbeda dari konflik yang destruktif? Apa yang bisa kamu terapkan dari cara mereka menanganinya?",
  },
  {
    en: "Where in your current context is polite agreement substituting for honest engagement? What would it take to make honest disagreement feel safe there?",
    id: "Di mana dalam konteksmu saat ini persetujuan sopan sedang menggantikan keterlibatan yang jujur? Apa yang diperlukan agar ketidaksetujuan yang jujur terasa aman di sana?",
  },
];

const KEY_TAKEAWAYS = [
  {
    en: "Name the problem out loud to your team before your next difficult conversation: \"We are going to disagree in this conversation, and that is the goal.\"",
    id: "Sebutkan dengan lantang kepada timmu sebelum percakapan sulit berikutnya: \"Kita akan berselisih dalam percakapan ini, dan itulah tujuannya.\"",
  },
  {
    en: "Identify one relationship in your current team where silence has become the default, and ask for a real conversation this week, not to resolve everything, but to begin.",
    id: "Identifikasi satu hubungan dalam timmu saat ini di mana diam telah menjadi kebiasaan, dan minta percakapan yang nyata minggu ini, bukan untuk menyelesaikan segalanya, tapi untuk memulai.",
  },
  {
    en: "Build trust before you need it: invest in one relational moment this week with someone you may eventually need to have a hard conversation with.",
    id: "Bangun kepercayaan sebelum kamu membutuhkannya: investasikan satu momen relasional minggu ini dengan seseorang yang mungkin suatu saat perlu kamu ajak bicara dengan jujur.",
  },
];

const RESEARCH_CALLOUTS = [
  {
    source: "Google Project Aristotle, 2016",
    en: "After studying 180 teams over two years, Google's People Operations team found that psychological safety¹ was the single strongest predictor of team effectiveness, outranking individual talent, experience, and team composition. Psychological safety is the shared belief that it is safe to take interpersonal risks, to speak up, and to disagree.² Teams that could challenge each other openly were consistently the highest performers.",
    id: "Setelah mempelajari 180 tim selama dua tahun, tim People Operations Google menemukan bahwa keamanan psikologis¹ adalah prediktor tunggal terkuat dari efektivitas tim, mengalahkan bakat individu, pengalaman, dan komposisi tim. Keamanan psikologis adalah keyakinan bersama bahwa aman untuk mengambil risiko interpersonal, untuk berbicara, dan untuk tidak setuju.² Tim yang bisa saling menantang secara terbuka secara konsisten adalah yang berkinerja tertinggi.",
  },
  {
    source: "Hofstede — Power Distance Index",
    en: "Geert Hofstede's³ research across 90 countries found wide variation in how cultures relate to authority and disagreement. High power-distance countries such as Indonesia (78), Malaysia (100), and the Philippines (94) place a premium on hierarchy and deference. Low power-distance countries such as the Netherlands (38) and Germany (35) normalise pushback and open challenge. In high-PDI settings, silence is not disengagement. It is the culturally appropriate signal of respect.",
    id: "Penelitian Geert Hofstede³ di 90 negara menemukan variasi besar dalam cara budaya berhubungan dengan otoritas dan ketidaksetujuan. Negara dengan jarak kekuasaan tinggi seperti Indonesia (78), Malaysia (100), dan Filipina (94) mengutamakan hierarki dan kepatuhan. Negara dengan jarak kekuasaan rendah seperti Belanda (38) dan Jerman (35) menormalkan penolakan dan tantangan terbuka. Dalam konteks PDI tinggi, diam bukan berarti tidak terlibat. Itu adalah sinyal rasa hormat yang tepat secara budaya.",
  },
  {
    source: "Patrick Lencioni — The Five Dysfunctions of a Team, 2002",
    en: "Lencioni's⁴ widely read practitioner framework identifies fear of conflict as the second of five dysfunctions that commonly undermine team performance. Teams which avoid genuine debate do not eliminate tension — they redirect it into politics, passive resistance, and quiet resentment. Note: this model is a practitioner account, not a peer-reviewed finding. For empirically grounded team research, Hackman's⁵ six conditions (explaining 50–74% of variance in team effectiveness) provide the stronger evidence base. The absence of productive conflict is not peace. It is the postponement of a harder conversation.",
    id: "Kerangka praktisi Lencioni⁴ yang banyak dibaca mengidentifikasi ketakutan terhadap konflik sebagai disfungsi kedua dari lima yang umum merusak kinerja tim. Tim yang menghindari debat yang tulus tidak menghilangkan ketegangan — mereka mengalihkannya ke dalam politik, resistensi pasif, dan kebencian yang diam. Catatan: model ini adalah akun praktisi, bukan temuan peer-reviewed. Untuk penelitian tim yang berdasar secara empiris, enam kondisi Hackman⁵ (menjelaskan 50–74% varians dalam efektivitas tim) memberikan dasar bukti yang lebih kuat. Tidak adanya konflik yang produktif bukan berarti damai. Itu adalah penundaan dari percakapan yang lebih berat.",
  },
];

// ── COMPONENT ──────────────────────────────────────────────────────────────────

type Props = { userId: string | null; isSaved: boolean };

export default function HealthyConflictClient({ isSaved: initialSaved }: Props) {
  const { lang: ctxLang } = useLanguage();
  const lang = (ctxLang === "id" ? "id" : "en") as Lang;

  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});
  const [bgOpen, setBgOpen] = useState(false);
  const [reflections, setReflections] = useState<Record<number, string>>({});

  const t = (en: string, id: string) => tFn(en, id, lang);

  useEffect(() => {
    trackResourceViewed("healthy-conflict", "cross-cultural-leadership");
  }, []);

  function handleSave() {
    if (saved || isPending) return;
    startTransition(async () => {
      await saveResourceToDashboard("healthy-conflict");
      setSaved(true);
      trackResourceSaved("healthy-conflict", true);
    });
  }

  function toggleCard(index: number) {
    setExpandedCards((prev) => {
      const next = { ...prev, [index]: !prev[index] };
      if (next[index]) {
        window.gtag?.("event", "concept_card_opened", { resource: "healthy-conflict", card: index + 1 });
      }
      return next;
    });
  }

  // ── RESPONSIVE CONTRAST CARD GRID ─────────────────────────────────────────
  // We detect window width with a simple CSS media query approach via inline styles.
  // Since this is inline-only, we use a fixed 2-col grid that stacks via min-width.

  return (
    <div style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>
      <LangToggle langs={["en", "id"]} />

      {/* ── 1. HERO ──────────────────────────────────────────────────────────── */}
      <div style={{
        background: navy,
        padding: "clamp(72px, 10vw, 96px) 24px clamp(64px, 9vw, 88px)",
        position: "relative",
        overflow: "hidden",
      }}>
        <img src="/images/resources/healthy-conflict/hero.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.18, mixBlendMode: "luminosity", pointerEvents: "none" }} />
        <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 5,
          background: amber,
        }} />
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: amber,
            marginBottom: 20,
          }}>
            {t("Cross-Cultural · Leadership", "Lintas Budaya · Kepemimpinan")}
          </p>

          <h1 style={{
            fontFamily: serif,
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: 600,
            color: offWhite,
            lineHeight: 1.08,
            margin: "0 0 24px",
          }}>
            {t(
              "Creating Healthy Conflict: An Underrated Leadership Skill",
              "Menciptakan Konflik yang Sehat: Keahlian Kepemimpinan yang Diremehkan",
            )}
          </h1>

          <p style={{
            fontFamily: serif,
            fontSize: "clamp(17px, 2vw, 21px)",
            fontWeight: 400,
            color: "oklch(82% 0.025 80)",
            lineHeight: 1.75,
            fontStyle: "italic",
            maxWidth: 600,
            marginBottom: 32,
          }}>
            {t(
              "Most leaders know how to keep the peace. Fewer know how to break it in a way that builds something better.",
              "Kebanyakan pemimpin tahu cara menjaga perdamaian. Lebih sedikit yang tahu cara memecahnya dengan cara yang membangun sesuatu yang lebih baik.",
            )}
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={handleSave}
              disabled={saved || isPending}
              style={{
                padding: "12px 28px",
                background: saved ? "oklch(35% 0.05 260)" : amber,
                color: offWhite,
                border: "none",
                borderRadius: 0,
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: 13,
                fontWeight: 700,
                cursor: saved ? "default" : "pointer",
              }}
            >
              {saved
                ? t("✓ Saved to Dashboard", "✓ Tersimpan di Dashboard")
                : t("Save to Dashboard", "Simpan ke Dashboard")}
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. INTRODUCTION ──────────────────────────────────────────────────── */}
      <div style={{ background: offWhite, padding: "clamp(56px, 8vw, 80px) 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "clamp(15px, 1.6vw, 17px)",
            fontWeight: 400,
            color: bodyText,
            lineHeight: 1.85,
            marginBottom: 20,
          }}>
            {t(
              "There is a particular silence that cross-cultural leaders know well. The meeting ends. Heads nod. Everyone smiles. You walk out feeling like something was resolved. And then nothing changes.",
              "Ada keheningan tertentu yang dikenal baik oleh para pemimpin lintas budaya. Rapat berakhir. Kepala mengangguk. Semua orang tersenyum. Kamu keluar dengan perasaan seolah sesuatu telah terselesaikan. Dan kemudian tidak ada yang berubah.",
            )}
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "clamp(15px, 1.6vw, 17px)",
            fontWeight: 400,
            color: bodyText,
            lineHeight: 1.85,
            marginBottom: 20,
          }}>
            {t(
              "Underneath that silence is usually a conversation that never happened. A disagreement that no one named. A frustration that went underground instead of onto the table.",
              "Di balik keheningan itu biasanya ada percakapan yang tidak pernah terjadi. Ketidaksetujuan yang tidak pernah disebutkan siapa pun. Frustrasi yang masuk ke bawah tanah alih-alih ke atas meja.",
            )}
          </p>

          <img
            src="/images/resources/healthy-conflict/conflict-table.jpg"
            alt="A team around a conference table — the setting where honest disagreement becomes possible"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              margin: "8px 0 28px",
              borderLeft: `4px solid ${amber}`,
            }}
          />

          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "clamp(15px, 1.6vw, 17px)",
            fontWeight: 400,
            color: bodyText,
            lineHeight: 1.85,
            marginBottom: 20,
          }}>
            {t(
              "This is not a failure of character. In many of the cultures where cross-cultural leaders work, silence is the respectful response. Raising a direct objection can feel like an attack. Holding your position publicly can be heard as a refusal to submit. The instinct to protect relational harmony is not weakness, it is wisdom shaped by culture, community, and history.",
              "Ini bukan kegagalan karakter. Dalam banyak budaya di mana pemimpin lintas budaya bekerja, diam adalah respons yang penuh hormat. Mengajukan keberatan secara langsung bisa terasa seperti serangan. Mempertahankan posisi secara terbuka bisa didengar sebagai penolakan untuk tunduk. Insting untuk melindungi keharmonisan hubungan bukanlah kelemahan, melainkan kebijaksanaan yang dibentuk oleh budaya, komunitas, dan sejarah.",
            )}
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "clamp(15px, 1.6vw, 17px)",
            fontWeight: 400,
            color: "oklch(30% 0.12 260)",
            lineHeight: 1.85,
            marginBottom: 20,
            fontStyle: "italic",
            marginTop: 8,
          }}>
            {t(
              "But instincts, however culturally appropriate, have consequences.",
              "Tapi insting, betapapun tepat secara budaya, memiliki konsekuensi.",
            )}
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "clamp(15px, 1.6vw, 17px)",
            fontWeight: 400,
            color: bodyText,
            lineHeight: 1.85,
            marginBottom: 0,
          }}>
            {t(
              "This module is about what happens when healthy conflict is missing, what it actually looks like when it is present, and how a leader can create the conditions where honest disagreement becomes the thing that builds trust rather than destroys it.",
              "Modul ini membahas apa yang terjadi ketika konflik yang sehat tidak ada, seperti apa sebenarnya ketika ia hadir, dan bagaimana seorang pemimpin dapat menciptakan kondisi di mana ketidaksetujuan yang jujur menjadi hal yang membangun kepercayaan, bukan menghancurkannya.",
            )}
          </p>
        </div>
      </div>

      {/* ── 3. LEARNING OUTCOME ──────────────────────────────────────────────── */}
      <div style={{ background: navy, padding: "48px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: amber,
            marginBottom: 24,
          }}>
            {t("After This Module", "Setelah Modul Ini")}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              t(
                "Recognise when conflict avoidance is costing your team more than the conflict itself would.",
                "Mengenali ketika penghindaran konflik merugikan timmu lebih dari konflik itu sendiri.",
              ),
              t(
                "Distinguish between destructive conflict and productive conflict, and describe what makes the difference.",
                "Membedakan antara konflik yang destruktif dan konflik yang produktif, dan menjelaskan apa yang membuat perbedaan itu.",
              ),
              t(
                "Create a structured, culturally aware space where honest disagreement can happen safely.",
                "Menciptakan ruang yang terstruktur dan peka budaya di mana ketidaksetujuan yang jujur bisa terjadi dengan aman.",
              ),
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{
                  width: 3,
                  height: 20,
                  background: amber,
                  flexShrink: 0,
                  marginTop: 3,
                }} />
                <p style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: dimOnNavy,
                  lineHeight: 1.65,
                  margin: 0,
                }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. CONTRAST CARD ─────────────────────────────────────────────────── */}
      <div style={{ background: offWhite, padding: "clamp(56px, 8vw, 72px) 24px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: subText,
            marginBottom: 28,
          }}>
            {t("Avoidance vs. Healthy Conflict", "Penghindaran vs. Konflik Sehat")}
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 0,
          }}>
            {/* Left — Avoidance */}
            <div style={{
              background: mutedGray,
              padding: "36px 32px",
              borderRight: "1px solid oklch(88% 0.008 80)",
            }}>
              <p style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: subText,
                marginBottom: 20,
              }}>
                {t("Avoidance", "Penghindaran")}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {CONTRAST_AVOIDANCE.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{
                      width: 4,
                      height: 4,
                      borderRadius: 0,
                      background: subText,
                      flexShrink: 0,
                      marginTop: 7,
                    }} />
                    <p style={{
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                      fontSize: 14,
                      fontWeight: 400,
                      color: subText,
                      lineHeight: 1.65,
                      margin: 0,
                    }}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Healthy Conflict */}
            <div style={{
              background: offWhite,
              padding: "36px 32px",
              borderTop: `3px solid ${amber}`,
              borderLeft: `3px solid ${amber}`,
            }}>
              <p style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: amber,
                marginBottom: 20,
              }}>
                {t("Healthy Conflict", "Konflik Sehat")}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {CONTRAST_HEALTHY.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{
                      width: 4,
                      height: 4,
                      borderRadius: 0,
                      background: amber,
                      flexShrink: 0,
                      marginTop: 7,
                    }} />
                    <p style={{
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                      fontSize: 14,
                      fontWeight: 500,
                      color: bodyText,
                      lineHeight: 1.65,
                      margin: 0,
                    }}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. TEACHING — 4 SECTIONS ─────────────────────────────────────────── */}
      {TEACHING_SECTIONS.map((section, si) => (
        <div key={si}>
        <div style={{ background: section.bg, padding: "clamp(56px, 7vw, 80px) 24px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <h2 style={{
              fontFamily: serif,
              fontSize: "clamp(22px, 2.8vw, 30px)",
              fontWeight: 600,
              color: section.dark ? offWhite : navy,
              marginBottom: 24,
            }}>
              {lang === "id" ? section.title.id : section.title.en}
            </h2>

            {section.paragraphs.map((para, pi) =>
              para.pullQuote ? (
                <div key={pi} style={{
                  fontFamily: serif,
                  fontSize: "clamp(18px, 2vw, 22px)",
                  fontStyle: "italic",
                  color: section.dark ? lightOnNavy : navy,
                  borderLeft: `3px solid ${amber}`,
                  paddingLeft: 20,
                  margin: "28px 0",
                  lineHeight: 1.6,
                }}>
                  {lang === "id" ? para.id : para.en}
                </div>
              ) : (
                <p key={pi} style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  fontSize: "clamp(14px, 1.5vw, 16px)",
                  fontWeight: 400,
                  color: section.dark ? dimOnNavy : bodyText,
                  lineHeight: 1.85,
                  marginBottom: 20,
                }}>
                  {lang === "id" ? para.id : para.en}
                </p>
              )
            )}
          </div>
        </div>
        </div>
      ))}

      {/* ── 6. RESEARCH CALLOUTS ─────────────────────────────────────────────── */}
      <div style={{ background: lightGray, padding: "clamp(56px, 8vw, 72px) 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: amber,
            marginBottom: 28,
          }}>
            {t("What the Research Shows", "Apa yang Dikatakan Penelitian")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {RESEARCH_CALLOUTS.map((item, ri) => (
              <div key={ri} style={{
                background: offWhite,
                padding: "20px 24px",
                borderLeft: `3px solid ${amber}`,
              }}>
                <p style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  color: amber,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 10,
                }}>
                  {item.source}
                </p>
                <p style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  fontSize: 14,
                  color: bodyText,
                  lineHeight: 1.8,
                  margin: 0,
                }}>
                  {lang === "id" ? item.id : item.en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 7. CONCEPT CARDS — THE CONFLICT TABLE ────────────────────────────── */}
      <div style={{ background: navy, padding: "clamp(64px, 9vw, 88px) 24px" }}>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: amber,
            marginBottom: 12,
          }}>
            {t("The Conflict Table", "Meja Konflik")}
          </p>

          <h2 style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "clamp(20px, 2.8vw, 28px)",
            fontWeight: 800,
            color: offWhite,
            marginBottom: 40,
          }}>
            {t(
              "5 Elements of a Safe Space",
              "5 Elemen Ruang yang Aman",
            )}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {CONCEPT_CARDS.map((card, ci) => {
              const isOpen = !!expandedCards[ci];
              return (
                <div
                  key={ci}
                  style={{
                    background: "oklch(28% 0.10 260)",
                    border: `1px solid ${isOpen ? amber : "oklch(32% 0.10 260)"}`,
                    borderTop: isOpen ? `2px solid ${amber}` : undefined,
                    overflow: "hidden",
                  }}
                >
                  <button
                    onClick={() => toggleCard(ci)}
                    style={{
                      width: "100%",
                      padding: "20px 24px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      textAlign: "left",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                      <span style={{
                        fontFamily: serif,
                        fontSize: 32,
                        fontWeight: 700,
                        color: amber,
                        lineHeight: 1,
                        flexShrink: 0,
                      }}>
                        {card.number}
                      </span>
                      <span style={{
                        fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                        fontSize: 14,
                        fontWeight: 700,
                        color: offWhite,
                        lineHeight: 1.3,
                      }}>
                        {lang === "id" ? card.title.id : card.title.en}
                      </span>
                    </div>
                    <span style={{
                      color: amber,
                      fontSize: 20,
                      fontWeight: 700,
                      flexShrink: 0,
                      lineHeight: 1,
                    }}>
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div style={{ padding: "0 24px 24px" }}>
                      <p style={{
                        fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                        fontSize: 14,
                        color: dimOnNavy,
                        lineHeight: 1.8,
                        marginBottom: 20,
                      }}>
                        {lang === "id" ? card.body.id : card.body.en}
                      </p>
                      <div style={{
                        background: amberDim,
                        padding: "14px 18px",
                        borderLeft: `3px solid ${amber}`,
                      }}>
                        <p style={{
                          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                          fontSize: 11,
                          fontWeight: 700,
                          color: amber,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          marginBottom: 8,
                        }}>
                          {t("You might say:", "Anda bisa berkata:")}
                        </p>
                        <p style={{
                          fontFamily: serif,
                          fontSize: 15,
                          fontStyle: "italic",
                          color: lightOnNavy,
                          lineHeight: 1.7,
                          margin: 0,
                        }}>
                          {lang === "id" ? card.script.id : card.script.en}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 7. FIELD STORY ───────────────────────────────────────────────────── */}
      <div style={{ background: navyDeep, padding: "clamp(80px, 11vw, 112px) 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: amber,
            marginBottom: 16,
          }}>
            {t("Field Story", "Kisah Lapangan")}
          </p>

          <h2 style={{
            fontFamily: serif,
            fontSize: "clamp(26px, 3.5vw, 38px)",
            fontWeight: 600,
            color: offWhite,
            marginBottom: 40,
          }}>
            {t("Two Leaders, One Table", "Dua Pemimpin, Satu Meja")}
          </h2>

          <div style={{
            height: 1,
            background: "oklch(35% 0.08 260)",
            margin: "0 0 40px",
          }} />

          {FIELD_STORY_PARAGRAPHS.map((para, pi) =>
            para.climax ? (
              <div key={pi} style={{
                borderLeft: `3px solid ${amber}`,
                paddingLeft: 24,
                margin: "32px 0",
              }}>
                <p style={{
                  fontFamily: serif,
                  fontSize: "clamp(17px, 1.9vw, 20px)",
                  color: lightOnNavy,
                  lineHeight: 1.85,
                  fontStyle: "italic",
                  margin: 0,
                }}>
                  {lang === "id" ? para.id : para.en}
                </p>
              </div>
            ) : (
              <p key={pi} style={{
                fontFamily: serif,
                fontSize: "clamp(17px, 1.9vw, 20px)",
                color: "oklch(84% 0.02 80)",
                lineHeight: 1.85,
                marginBottom: 24,
              }}>
                {lang === "id" ? para.id : para.en}
              </p>
            )
          )}
        </div>
      </div>

      {/* ── 8. QUOTE HIGHLIGHT ───────────────────────────────────────────────── */}
      <section style={{ background: offWhite, padding: "clamp(64px, 9vw, 88px) 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {/* Navy quote container */}
          <div style={{ background: navy, padding: "clamp(40px, 6vw, 56px) 44px", marginBottom: 32 }}>
            <p style={{
              fontFamily: serif,
              fontSize: "clamp(24px, 3.2vw, 36px)",
              fontWeight: 600,
              color: offWhite,
              fontStyle: "italic",
              marginBottom: 16,
              lineHeight: 1.3,
              textAlign: "center",
            }}>
              &ldquo;{t("Faithful are the wounds of a friend.", "Setia adalah luka seorang sahabat.")}&rdquo;
            </p>
            <p style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: 12,
              fontWeight: 700,
              color: amber,
              textTransform: "uppercase",
              letterSpacing: "0.10em",
              textAlign: "center",
              marginBottom: 0,
            }}>
              {t("Proverbs 27:6", "Amsal 27:6")}
            </p>
            <div style={{ width: 48, height: 2, background: amber, margin: "20px auto 0" }} />
          </div>
          {/* Commentary paragraph — stays on offWhite below navy box */}
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 15,
            color: bodyText,
            lineHeight: 1.8,
            textAlign: "left",
          }}>
            {t(
              "A friend who only tells you what you want to hear is not actually serving you. In leadership, the most loving thing you can sometimes do for a colleague is to say the thing that is true, even when it is uncomfortable. That is what faithful wounds look like.",
              "Seorang teman yang hanya memberitahumu apa yang ingin kamu dengar sebenarnya tidak melayanimu. Dalam kepemimpinan, hal paling penuh kasih yang kadang bisa kamu lakukan untuk seorang rekan adalah mengatakan hal yang benar, bahkan ketika itu tidak nyaman. Itulah yang dimaksud dengan luka yang setia.",
            )}
          </p>
        </div>
      </section>

      {/* ── 9. FAITH ANCHOR ──────────────────────────────────────────────────── */}
      <div style={{ background: lightGray, padding: "clamp(64px, 9vw, 88px) 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: amber,
            marginBottom: 12,
          }}>
            {t("Faith Anchor", "Jangkar Iman")}
          </p>

          <h2 style={{
            fontFamily: serif,
            fontSize: "clamp(22px, 2.8vw, 32px)",
            fontWeight: 600,
            color: navy,
            marginBottom: 36,
          }}>
            {t("Sharpened by Honest Contact", "Diasah oleh Kontak yang Jujur")}
          </h2>

          {FAITH_ANCHOR_PARAGRAPHS.map((para, pi) => (
            <p key={pi} style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: 15,
              color: para.elevated ? navy : bodyText,
              lineHeight: 1.85,
              marginBottom: pi < FAITH_ANCHOR_PARAGRAPHS.length - 1 ? 20 : 0,
            }}>
              {lang === "id" ? para.id : para.en}
            </p>
          ))}
        </div>
      </div>

      {/* ── 10. REFLECTION QUESTIONS ─────────────────────────────────────────── */}
      <div style={{ background: lightGray, padding: "clamp(64px, 9vw, 88px) 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: subText,
            marginBottom: 12,
          }}>
            {t("Reflection", "Refleksi")}
          </p>

          <h2 style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "clamp(18px, 2.2vw, 24px)",
            fontWeight: 800,
            color: navy,
            marginBottom: 40,
          }}>
            {t("Questions to Sit With", "Pertanyaan untuk Direnungkan")}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {REFLECTION_QUESTIONS.map((q, qi) => (
              <div key={qi} style={{
                background: offWhite,
                padding: "28px 28px 24px",
              }}>
                <div style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "flex-start",
                  marginBottom: 16,
                }}>
                  <span style={{
                    fontFamily: serif,
                    fontSize: 36,
                    fontWeight: 700,
                    color: amber,
                    lineHeight: 1,
                    flexShrink: 0,
                  }}>
                    {qi + 1}
                  </span>
                  <p style={{
                    fontFamily: serif,
                    fontSize: "clamp(16px, 1.8vw, 18px)",
                    fontStyle: "italic",
                    color: navy,
                    lineHeight: 1.75,
                    margin: 0,
                  }}>
                    {lang === "id" ? q.id : q.en}
                  </p>
                </div>
                <textarea
                  value={reflections[qi] ?? ""}
                  onChange={(e) =>
                    setReflections((prev) => ({ ...prev, [qi]: e.target.value }))
                  }
                  placeholder={t("Your reflection...", "Refleksi Anda...")}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    fontFamily: serif,
                    fontSize: 15,
                    color: bodyText,
                    background: offWhite,
                    border: "1px solid oklch(88% 0.01 80)",
                    borderRadius: 0,
                    resize: "vertical",
                    lineHeight: 1.75,
                    boxSizing: "border-box",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 11. KEY TAKEAWAY ─────────────────────────────────────────────────── */}
      <div style={{
        background: offWhite,
        padding: "clamp(64px, 9vw, 88px) 24px",
        borderTop: `3px solid ${amber}`,
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: amber,
            marginBottom: 12,
          }}>
            {t("Key Takeaway", "Poin Utama")}
          </p>

          <h2 style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "clamp(18px, 2.2vw, 24px)",
            fontWeight: 800,
            color: navy,
            marginBottom: 36,
          }}>
            {t("Three things to do this week", "Tiga hal yang perlu dilakukan minggu ini")}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {KEY_TAKEAWAYS.map((item, ii) => (
              <div key={ii} style={{
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                padding: "20px 24px",
                background: lightGray,
              }}>
                <div style={{
                  width: 3,
                  alignSelf: "stretch",
                  background: amber,
                  flexShrink: 0,
                }} />
                <p style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: bodyText,
                  lineHeight: 1.75,
                  margin: 0,
                }}>
                  {lang === "id" ? item.id : item.en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 12. FURTHER READING ──────────────────────────────────────────────── */}
      <div style={{ background: lightGray, padding: "clamp(48px, 7vw, 64px) 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: amber,
            marginBottom: 8,
          }}>
            {t("Further Reading", "Bacaan Lebih Lanjut")}
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 13,
            color: subText,
            lineHeight: 1.6,
            marginBottom: 28,
          }}>
            {t(
              "Sources and recommended books that inform this module.",
              "Sumber dan buku yang menjadi dasar modul ini.",
            )}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              {
                author: "Patrick Lencioni",
                title: "The Five Dysfunctions of a Team",
                year: "2002",
                note: t(
                  "A widely read practitioner framework identifying fear of conflict as central to team dysfunction. Not peer-reviewed, but the most accessible entry point to why productive conflict is missing in most organisations. For empirical grounding, pair with Hackman's team effectiveness research.",
                  "Kerangka praktisi yang banyak dibaca yang mengidentifikasi ketakutan terhadap konflik sebagai inti dari disfungsi tim. Tidak peer-reviewed, tetapi titik masuk paling mudah diakses mengapa konflik produktif hilang di sebagian besar organisasi. Untuk dasar empiris, padukan dengan penelitian efektivitas tim Hackman.",
                ),
              },
              {
                author: "Erin Meyer",
                title: "The Culture Map",
                year: "2014",
                note: t(
                  "Chapter 7 maps how cultures differ on disagreeing — from direct confrontation norms (Netherlands, France, Israel) to strong avoidance cultures (Japan, Indonesia, Thailand). Essential reading for cross-cultural leaders.",
                  "Bab 7 memetakan bagaimana budaya berbeda dalam hal ketidaksetujuan — dari budaya konfrontasi langsung hingga budaya penghindaran.",
                ),
              },
              {
                author: "Peter Scazzero",
                title: "The Emotionally Healthy Leader",
                year: "2015",
                note: t(
                  "Addresses the unique dynamics of conflict avoidance in faith-based organisations, where spiritual language is often used to suppress legitimate disagreement.",
                  "Membahas dinamika unik penghindaran konflik dalam organisasi berbasis iman.",
                ),
              },
            ].map((ref, ri) => (
              <div key={ri} style={{
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                padding: "20px 20px",
                background: offWhite,
              }}>
                <div style={{
                  width: 3,
                  alignSelf: "stretch",
                  background: amber,
                  flexShrink: 0,
                }} />
                <div>
                  <p style={{
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: bodyText,
                    lineHeight: 1.5,
                    margin: "0 0 2px",
                  }}>
                    {ref.author} — <em>{ref.title}</em> ({ref.year})
                  </p>
                  <p style={{
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    fontSize: 13,
                    fontWeight: 400,
                    color: subText,
                    lineHeight: 1.65,
                    margin: 0,
                  }}>
                    {ref.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 13. LONG-FORM SEO SECTION ────────────────────────────────────────── */}
      <div style={{ background: offWhite, padding: "clamp(64px, 9vw, 88px) 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: amber, marginBottom: 12 }}>
            Background
          </p>
          <h2 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(22px, 2.8vw, 32px)", fontWeight: 800, color: navy, marginBottom: 32, lineHeight: 1.2 }}>
            Healthy Conflict in Teams: Why Avoidance Is the Real Leadership Failure
          </h2>
          <button
            onClick={() => setBgOpen(!bgOpen)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              marginTop: 20, marginBottom: 24, padding: "10px 20px",
              background: "transparent", border: "1.5px solid oklch(65% 0.15 45)",
              color: "oklch(65% 0.15 45)", borderRadius: 12,
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 13, fontWeight: 700,
              cursor: "pointer", letterSpacing: "0.04em",
            }}
          >
            {bgOpen ? "Close ↑" : "Read the research →"}
          </button>
          {bgOpen && [
            "Most leadership literature on conflict begins in the wrong place. It treats conflict as the problem to be managed, and harmony as the goal. But in cross-cultural team settings, that framing is exactly backwards. Conflict is not the threat to team health. Unresolved, underground conflict is. The leader who creates conditions where disagreement is safe has done more for their team's long-term effectiveness than the one who keeps every meeting comfortable.",
            "Healthy conflict is the productive surfacing of real differences so a team can work through them and reach genuine alignment. It is not performance, not aggression, and not the absence of care for relationships. It is a form of respect — the belief that the people around the table are capable of handling honest conversation, and that the work is important enough to do well.",
            "The challenge in multicultural and cross-cultural teams is that conflict avoidance is often not a personal weakness. It is a culturally encoded survival strategy. In many high-context cultures across Asia, the Middle East, and Africa, direct disagreement — especially upward or in a group setting — carries real social risk. To disagree publicly is to create discomfort for others, to potentially embarrass someone of higher status, and to invite the same back toward yourself. The rational response, in those cultural frameworks, is to signal concern indirectly: through silence, through delayed implementation, through vague agreement that never fully materialises. This is not dishonesty. It is social intelligence operating within a different set of rules.",
            "The problem is that a leader from a low-context culture — where directness is expected, and silence means agreement — will consistently misread these signals. They will conduct a meeting, read the room as aligned, and leave with a decision that three people in the room actually disagreed with. Those three will implement half-heartedly, or raise the concern quietly with peers, or simply wait for the decision to fail on its own. None of this is visible to the leader until the damage is already done.",
            "Sherwood Lingenfelter,⁶ writing in Teamwork Cross-Culturally, identifies the most intractable form of this dysfunction as what he calls 'wicked problems' — conflicts that cannot be solved by better processes or communication training alone. These are situations where the root issue is not the presenting disagreement but the identity beneath it: two people operating from fundamentally different assumptions about authority, belonging, fairness, and what resolution actually means. No meeting structure or feedback framework resolves that. What resolves it, Lingenfelter argues, is a shared identity that is more foundational than cultural identity: the in-Christ identity that Paul describes in Galatians 3:28, where the distinctions remain real but no longer determine the hierarchy of loyalty.",
            "The earliest church understood this from experience, not theory. Acts 6:1-7 records the first documented cross-cultural conflict in the Christian community: a complaint from Hellenistic Jewish widows that they were being overlooked in the daily food distribution, while Hebrew Jewish widows were being served. This was not a minor logistical complaint. It was a charge of ethnic discrimination inside the community that had just declared itself unified in Christ. The apostles' response is instructive. They did not dismiss the complaint. They did not handle it privately and announce a decision. They called the whole community together, presented the problem transparently, and asked the community to select their own representatives to lead the solution. The seven names chosen are all Greek names — the affected group was entrusted with the resolution.",
            "From that passage, five principles emerge that remain directly applicable to cross-cultural teams today. Discovery: the complaint is heard and taken seriously before any response is formed. Mediation: leadership facilitates rather than decides unilaterally. Participation: the affected parties are given genuine voice and agency in the solution. Agreement: the resolution is formal, shared, and clear. Reaffirmation: the community confirms its unity and continues its work. These are not abstract ideals. They are a sequence tested in a real conflict with real cultural stakes.",
            "Matthew 18:15-17 provides a complementary framework: direct private conversation first, then a witness, then broader escalation if needed. The principle is theologically grounded and practically sound. The cross-cultural application requires care. 'Direct' is not universal. In many high-context cultures, directness through a trusted intermediary — someone who can carry the concern to the other party without putting either person in a public face-loss situation — is not a workaround. It is itself a direct method. The goal of the Matthew 18 process is restoration and clarity. The path there adapts to the cultural logic of the people involved.",
            "For leaders managing multicultural teams, the practical starting point is not a new conflict resolution framework. It is an honest assessment of whether your team environment actually makes conflict safe. Do team members ever push back in meetings, or does pushback always arrive through side conversations afterward? When you ask 'any concerns?' and get silence, do you probe, or do you accept the silence? Have you ever had a team member tell you something privately that contradicted what they said in the group? If that has happened more than once, the team has a conflict safety problem — and the leader's role is to build a different kind of room.",
            "The teams that handle conflict well are not teams that fight more. They are teams where disagreement is normal enough, and safe enough, that it gets handled before it becomes fracture. That is what healthy conflict produces: not drama, but durable trust.",
          ].map((para, i) => (
            <p key={i} style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(14px, 1.5vw, 16px)", color: bodyText, lineHeight: 1.85, marginBottom: 20 }}>
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* ── 14. SOURCES ──────────────────────────────────────────────────────── */}
      <SourcesDropdown sources={[
        "Amy C. Edmondson — Psychological Safety and Learning Behavior in Work Teams (Administrative Science Quarterly, 1999)",
        "Google People Operations — Project Aristotle: Understanding Team Effectiveness (2016) — re.work/guides/understanding-team-effectiveness",
        "Geert Hofstede — Culture's Consequences: Comparing Values, Behaviors, Institutions, and Organizations Across Nations (Sage, 2nd ed., 2001); country scores via Hofstede Insights (hofstede-insights.com)",
        "Patrick Lencioni — The Five Dysfunctions of a Team (Jossey-Bass, 2002). Practitioner framework — no peer-reviewed empirical validation.",
        "J. Richard Hackman — Leading Teams: Setting the Stage for Great Performances (Harvard Business Review Press, 2002). Six conditions explaining 50–74% of variance in team effectiveness.",
        "Sherwood G. Lingenfelter — Teamwork Cross-Culturally: Christ-Centered Solutions for Multicultural Teams (Baker Academic, 2024)",
      ]} lang={lang} />

      {/* ── 15. CTA FOOTER ───────────────────────────────────────────────────── */}
      <div style={{
        background: navy,
        padding: "clamp(56px, 8vw, 80px) 24px",
        textAlign: "center",
      }}>
        <h2 style={{
          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          fontSize: "clamp(20px, 3vw, 30px)",
          fontWeight: 800,
          color: offWhite,
          marginBottom: 16,
        }}>
          {t("Keep Growing", "Terus Bertumbuh")}
        </h2>

        <p style={{
          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          fontSize: 15,
          color: dimOnNavy,
          lineHeight: 1.75,
          maxWidth: 520,
          margin: "0 auto 40px",
        }}>
          {t(
            "Explore more training modules to deepen your cross-cultural leadership.",
            "Jelajahi lebih banyak sumber untuk memperdalam kepemimpinan lintas budaya kamu.",
          )}
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/resources"
            style={{
              display: "inline-block",
              padding: "14px 36px",
              background: amber,
              color: offWhite,
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              borderRadius: 0,
            }}
          >
            {t("← Training", "← Pelatihan")}
          </Link>
          <Link
            href="/resources/cultural-intelligence"
            style={{
              display: "inline-block",
              padding: "14px 36px",
              border: `1px solid oklch(45% 0.05 260)`,
              color: offWhite,
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              borderRadius: 0,
            }}
          >
            Cultural Intelligence →
          </Link>
        </div>
      </div>
    </div>
  );
}
