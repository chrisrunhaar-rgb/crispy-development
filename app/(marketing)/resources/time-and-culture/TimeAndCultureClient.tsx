"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

function L<T>(lang: string, en: T, id: T): T {
  return lang === "id" ? id : en;
}

// ─── Color constants (BEAU spec) ─────────────────────────────────────────────
const NAVY = "oklch(22% 0.10 260)";
const ORANGE = "oklch(65% 0.15 45)";
const OFF_WHITE = "oklch(97% 0.005 80)";
const LIGHT_GRAY = "oklch(95% 0.008 80)";
const BODY_TEXT = "oklch(38% 0.05 260)";

// ─── Concept Cards data ───────────────────────────────────────────────────────
const CONCEPT_CARDS = [
  {
    name: "THE CLOCK KEEPER",
    term: "Monochronic Time (Edward T. Hall) — also called Linear-Active Time (Richard Lewis) and Clock-Time (Richard Brislin)",
    belief: '"Time is a resource. Use it well."',
    bullets: [
      "Punctuality is a form of respect. Arriving late signals something is wrong.",
      "Tasks are completed one at a time. Switching between tasks mid-flow is disruptive.",
      "Agendas are followed. Meetings have start times, end times, and expected outcomes.",
    ],
    blindspot:
      "When someone operates from a different logic, the Clock Keeper reads it as a character flaw. Lateness looks like disrespect. Flexibility looks like disorganization. The Clock Keeper does not naturally ask: 'What does their behavior mean in their own system?' They ask: 'Why won't they just be professional?'",
  },
  {
    name: "THE RELATIONSHIP WEAVER",
    term: "Polychronic Time (Edward T. Hall) — also called Event-Oriented Culture",
    belief: '"Time belongs to the person in front of me."',
    bullets: [
      "The meeting ends when the matter is settled relationally, not when the clock reaches the agreed time.",
      "Multiple conversations and tasks can run simultaneously. This is natural, not chaotic.",
      "Relationships come before agendas. You do not start the business until you have started the connection.",
    ],
    blindspot:
      "The Relationship Weaver may genuinely not register the cost that relational flexibility places on colleagues who planned around a committed time. The warmth is real. The disruption to other people's schedules is also real.",
  },
  {
    name: "THE HARMONY FOLLOWER",
    term: "Reactive Time (Richard Lewis)",
    belief: '"Time is contextual. Read the room, not the clock."',
    bullets: [
      "Both punctuality and relational warmth are expected, but the weight shifts depending on who is present.",
      "With a senior figure or a formal context: structure and punctuality take priority.",
      "With peers or in informal settings: relationship and flow take priority.",
    ],
    blindspot:
      "This contextual flexibility can look inconsistent to both Clock Keepers (who notice the Harmony Follower is not always punctual) and Relationship Weavers (who notice the Harmony Follower is not always available for extended connection). Neither camp fully trusts them because neither sees the full logic.",
  },
  {
    name: "THE COMMUNITY KEEPER",
    term: "Sasa/Zamani Framework (John Mbiti)",
    belief: '"Time moves with the people, not the calendar."',
    bullets: [
      "Community presence constitutes the event. 'When does the meeting start?' means: 'When are the people gathered?'",
      "Past events remain present through memory and community. The community keeper carries history actively.",
      "Time is not scarce in the way a clock-keeper experiences scarcity. Presence is the currency.",
    ],
    blindspot:
      "In international or organizational teams, the Community Keeper's orientation often receives the harshest judgment, not because it is wrong, but because most organizational systems are designed around monochronic assumptions. The logic of community time is rarely explained and rarely invited into team conversations.",
  },
];

const CONCEPT_CARDS_ID = [
  {
    name: "PENJAGA JAM",
    term: "Waktu Monochronic (Edward T. Hall) — juga disebut Waktu Linear-Aktif (Richard Lewis) dan Waktu Jam (Richard Brislin)",
    belief: '"Waktu adalah sumber daya. Gunakan dengan baik."',
    bullets: [
      "Ketepatan waktu adalah bentuk penghormatan. Terlambat memberi sinyal ada yang tidak beres.",
      "Tugas diselesaikan satu per satu. Beralih antar tugas di tengah alur terasa mengganggu.",
      "Agenda diikuti. Pertemuan memiliki waktu mulai, waktu selesai, dan hasil yang diharapkan.",
    ],
    blindspot:
      "Ketika seseorang beroperasi dari logika berbeda, Penjaga Jam membacanya sebagai kelemahan karakter. Keterlambatan terlihat seperti ketidakhormatan. Fleksibilitas terlihat seperti ketidakorganisasian. Penjaga Jam tidak secara alami bertanya: 'Apa arti perilaku mereka dalam sistem mereka sendiri?' Mereka bertanya: 'Mengapa mereka tidak mau bertindak profesional?'",
  },
  {
    name: "PENENUN RELASI",
    term: "Waktu Polychronic (Edward T. Hall) — juga disebut Budaya Berorientasi Acara",
    belief: '"Waktu milik orang yang ada di hadapanku."',
    bullets: [
      "Pertemuan berakhir ketika masalah terselesaikan secara relasional, bukan ketika jam menunjukkan waktu yang disepakati.",
      "Beberapa percakapan dan tugas bisa berjalan bersamaan. Ini wajar, bukan kacau.",
      "Relasi lebih utama dari agenda. Kamu tidak memulai bisnis sebelum memulai koneksi.",
    ],
    blindspot:
      "Penenun Relasi mungkin benar-benar tidak merasakan biaya yang ditimbulkan fleksibilitas relasional kepada rekan yang sudah merencanakan waktu yang disepakati. Kehangatan itu nyata. Gangguan terhadap jadwal orang lain juga nyata.",
  },
  {
    name: "PENGIKUT HARMONI",
    term: "Waktu Reaktif (Richard Lewis)",
    belief: '"Waktu itu kontekstual. Baca suasana, bukan jam."',
    bullets: [
      "Ketepatan waktu dan kehangatan relasional sama-sama diharapkan, tetapi bobotnya bergeser tergantung pada siapa yang hadir.",
      "Dengan tokoh senior atau dalam konteks formal: struktur dan ketepatan waktu menjadi prioritas.",
      "Dengan rekan atau dalam lingkungan informal: relasi dan alur yang lebih diprioritaskan.",
    ],
    blindspot:
      "Fleksibilitas kontekstual ini bisa terlihat tidak konsisten bagi Penjaga Jam (yang melihat Pengikut Harmoni tidak selalu tepat waktu) maupun Penenun Relasi (yang melihat Pengikut Harmoni tidak selalu tersedia untuk koneksi yang lebih lama). Tidak ada pihak yang sepenuhnya mempercayai mereka karena tidak ada yang melihat logika penuhnya.",
  },
  {
    name: "PENJAGA KOMUNITAS",
    term: "Kerangka Sasa/Zamani (John Mbiti)",
    belief: '"Waktu bergerak bersama orang-orang, bukan kalender."',
    bullets: [
      "Kehadiran komunitas membentuk acara itu sendiri. 'Kapan pertemuan dimulai?' artinya: 'Kapan semua orang sudah berkumpul?'",
      "Peristiwa masa lalu tetap hadir melalui ingatan dan komunitas. Penjaga Komunitas membawa sejarah secara aktif.",
      "Waktu tidak langka seperti yang dialami penjaga jam. Kehadiran adalah mata uangnya.",
    ],
    blindspot:
      "Dalam tim internasional atau organisasi, orientasi Penjaga Komunitas sering mendapat penilaian paling keras — bukan karena salah, tetapi karena sebagian besar sistem organisasi dirancang berdasarkan asumsi monochronic. Logika waktu komunitas jarang dijelaskan dan jarang diundang ke dalam percakapan tim.",
  },
];

// ─── Scenario cards data ──────────────────────────────────────────────────────
const SCENARIO_CARDS = [
  {
    title: "The Overrun Meeting",
    situation:
      "The meeting was scheduled for one hour. The agenda was clear. Sixty minutes in, an important topic is still in progress. Three people at the table begin to check their phones. One reaches for their notebook and starts to close it. Another says quietly, 'We should probably wrap up.' But two other people around the table are leaning in, still mid-thought. They look slightly surprised that anyone is leaving.\n\nNobody is being rude. But the room has split in two.",
    question: "Which time logic is running here?",
    reveal:
      "Two logics are in conflict. The people reaching for their bags are operating from monochronic, Clock Keeper logic: the hour was agreed, the hour is up, the meeting is over. Their next commitment is not an inconvenience. It is a promise they made. The people still leaning in are operating from polychronic, Relationship Weaver logic: the matter is not yet resolved relationally, so the meeting is not yet done.\n\nNeither group is wrong. But without a shared language for this moment, the Clock Keepers will leave feeling the meeting was mismanaged, and the Relationship Weavers will feel the Clock Keepers care more about their schedule than the team. Both conclusions miss the real cause.",
  },
  {
    title: "The Missing Deadline",
    situation:
      "A team member from a different cultural background misses a project deadline by three days. When you follow up, they do not apologize. They do not seem alarmed. They respond with warmth and an update on how the work is going. They seem genuinely pleased to hear from you. The deadline itself is barely mentioned.\n\nYou feel a spike of frustration. But something underneath the frustration is confusion. Why are they not taking this seriously?",
    question: "Which time logic is running here?",
    reveal:
      "This is almost certainly event-oriented time in operation, either polychronic or Community Keeper logic. In an event-time orientation, the deadline is not a hard boundary but a rough horizon. What matters is the quality of the work and the relational process of getting there. The update they gave you was not evasion. It was their form of accountability: showing you the work is alive and the relationship is intact.\n\nThis does not mean the deadline does not matter. It does. But the conversation that needs to happen is not 'why are you irresponsible' but 'here is how this deadline connects to other people's work, and here is the cost when it moves.' That is a conversation that can only happen once you stop reading their logic through yours.",
  },
  {
    title: 'The "We\'ll Figure It Out" Agreement',
    situation:
      "At the end of a planning conversation, both sides say they are aligned. The project will move forward. Start date: 'sometime next month.' Budget discussion: 'we will sort that when we know more.' Decision about who leads: 'we can discuss as we go.' Everyone leaves the meeting feeling positive.\n\nThree weeks later, nothing has moved. Each side thought the other would initiate. Neither did.",
    question: "Which time logic is running here?",
    reveal:
      "The Harmony Follower orientation often surfaces in this scenario. For the Harmony Follower, the goal of that first conversation was relational alignment, not operational clarity. Leaving things open was not evasion. It was respect, allowing things to unfold at the right moment, in the right context, when the right people were present. Pinning down specifics too early can feel presumptuous or even disrespectful.\n\nThe Clock Keeper in the room heard the same conversation and walked away expecting operational follow-through. When nothing happened, they read it as broken commitment rather than different logic.\n\nThe fix is not for one side to abandon their orientation. It is to name, before leaving the room: 'Let us confirm one specific next step, so we both know what we are waiting for.' That one sentence bridges the logic gap.",
  },
];

const SCENARIO_CARDS_ID = [
  {
    title: "Rapat yang Melebihi Waktu",
    situation:
      "Rapat dijadwalkan satu jam. Agenda sudah jelas. Enam puluh menit berlalu, topik penting masih belum selesai. Tiga orang di meja mulai mengecek ponsel mereka. Satu orang meraih buku catatan dan mulai menutupnya. Orang lain berkata pelan, 'Mungkin kita perlu segera mengakhiri.' Tapi dua orang lain di meja masih condong ke depan, masih di tengah-tengah pemikiran. Mereka terlihat sedikit heran melihat ada yang akan pergi.\n\nTidak ada yang bersikap kasar. Tapi ruangan sudah terbagi dua.",
    question: "Logika waktu mana yang sedang berjalan di sini?",
    reveal:
      "Dua logika sedang berkonflik. Orang-orang yang meraih tas beroperasi dari logika monochronic, Penjaga Jam: satu jam sudah disepakati, satu jam sudah habis, rapat sudah selesai. Komitmen berikutnya bukan ketidaknyamanan. Itu adalah janji yang sudah mereka buat. Orang-orang yang masih condong ke depan beroperasi dari logika polychronic, Penenun Relasi: masalah belum terselesaikan secara relasional, jadi rapat belum selesai.\n\nTidak ada yang salah. Tapi tanpa bahasa bersama untuk momen ini, Penjaga Jam akan pergi dengan perasaan rapat dikelola dengan buruk, dan Penenun Relasi akan merasa Penjaga Jam lebih peduli jadwal mereka daripada tim. Kedua kesimpulan itu melewatkan penyebab sebenarnya.",
  },
  {
    title: "Tenggat Waktu yang Terlewat",
    situation:
      "Anggota tim dari latar belakang budaya berbeda melewatkan tenggat proyek tiga hari. Saat kamu menindaklanjuti, mereka tidak meminta maaf. Mereka tidak terlihat cemas. Mereka merespons dengan hangat dan memberikan kabar terbaru tentang pekerjaan. Mereka tampak benar-benar senang mendengar kabarmu. Tenggat waktu itu sendiri hampir tidak disebutkan.\n\nKamu merasakan lonjakan frustrasi. Tapi di bawah frustrasi itu ada kebingungan. Mengapa mereka tidak menganggap ini serius?",
    question: "Logika waktu mana yang sedang berjalan di sini?",
    reveal:
      "Ini hampir pasti orientasi waktu berdasarkan acara yang sedang bekerja — logika polychronic atau Penjaga Komunitas. Dalam orientasi event-time, tenggat waktu bukan batas keras melainkan cakrawala perkiraan. Yang penting adalah kualitas pekerjaan dan proses relasional untuk mencapainya. Kabar terbaru yang mereka berikan bukan penghindaran. Itu adalah bentuk akuntabilitas mereka: menunjukkan bahwa pekerjaan masih berjalan dan hubungan masih terjaga.\n\nBukan berarti tenggat waktu tidak penting. Penting. Tapi percakapan yang perlu terjadi bukan 'mengapa kamu tidak bertanggung jawab' melainkan 'inilah bagaimana tenggat ini terhubung dengan pekerjaan orang lain, dan inilah biayanya ketika bergeser.' Percakapan itu hanya bisa terjadi setelah kamu berhenti membaca logika mereka melalui logikamu sendiri.",
  },
  {
    title: '"Kita Selesaikan Nanti"',
    situation:
      "Di akhir percakapan perencanaan, kedua pihak mengatakan mereka sudah selaras. Proyek akan dilanjutkan. Tanggal mulai: 'suatu waktu bulan depan.' Diskusi anggaran: 'kita urus nanti setelah tahu lebih banyak.' Keputusan tentang siapa yang memimpin: 'kita bisa diskusikan sambil jalan.' Semua orang meninggalkan rapat dengan perasaan positif.\n\nTiga minggu kemudian, tidak ada yang bergerak. Setiap pihak mengira pihak lain yang akan memulai. Tidak ada yang melakukan itu.",
    question: "Logika waktu mana yang sedang berjalan di sini?",
    reveal:
      "Orientasi Pengikut Harmoni sering muncul dalam skenario ini. Bagi Pengikut Harmoni, tujuan percakapan pertama itu adalah keselarasan relasional, bukan kejelasan operasional. Membiarkan hal-hal terbuka bukan penghindaran. Itu adalah penghormatan — membiarkan sesuatu berkembang pada momen yang tepat, dalam konteks yang tepat, ketika orang yang tepat hadir. Menetapkan hal spesifik terlalu cepat bisa terasa terlalu lancang atau bahkan tidak sopan.\n\nPenjaga Jam di ruangan itu mendengar percakapan yang sama dan pergi dengan mengharapkan tindak lanjut operasional. Ketika tidak ada yang terjadi, mereka membacanya sebagai komitmen yang dilanggar alih-alih logika yang berbeda.\n\nSolusinya bukan agar salah satu pihak meninggalkan orientasinya. Solusinya adalah menyebutkan, sebelum meninggalkan ruangan: 'Mari kita konfirmasi satu langkah berikutnya yang spesifik, agar kita berdua tahu apa yang kita tunggu.' Satu kalimat itu menjembatani kesenjangan logika.",
  },
];

// ─── Part 1 questions ─────────────────────────────────────────────────────────
const PART1_QUESTIONS = [
  {
    q: "A teammate arrives 20 minutes late to a team meeting with no message and no explanation. You feel:",
    options: [
      "Frustrated. Twenty minutes is not a small margin. Others managed to be here on time, and this disrupts the whole group. You want to address it directly.",
      "Curious, but not particularly troubled. Maybe something came up. You will ask privately afterward to make sure they are okay.",
      "Uncomfortable, but your response depends on who is in the room. If there is a senior leader present, the lateness feels more significant. If it is a peer group, less so.",
      "Not particularly bothered. They are here now. The group is here. The meeting can proceed.",
    ],
  },
  {
    q: "Your team meeting hits the scheduled end time, but the discussion is still actively unresolved. You want to:",
    options: [
      "Wrap up on time. If the topic needs more time, schedule a follow-up. Overrunning sets a bad precedent.",
      "Keep going. The discussion is alive and the team is engaged. The clock is less important than the conversation.",
      "Read the room. Is the senior person showing signs of needing to leave? Is the energy still strong? You would stay or go based on those signals.",
      "Let it run. The right time to end is when the group has reached a natural settling point, not when a clock says so.",
    ],
  },
  {
    q: "A cross-cultural colleague misses a project deadline by three days and does not mention it. When you follow up, they respond warmly and give you an update on the work. You:",
    options: [
      "Appreciate the update but feel the need to address the missed deadline directly. It affects other parts of the project and needs to be taken seriously.",
      "Focus on the relationship first. You are glad they responded. You ask about the work and gently mention the impact of the delay, but you do not lead with the failure.",
      "Calibrate your response based on the relationship and context. With a close colleague, you might be direct. In a formal or hierarchical setting, you would be more careful about how you raise it.",
      "Accept the update at face value. They are engaged with the work. You trust the process will complete.",
    ],
  },
  {
    q: "Your team always spends 10 to 15 minutes in informal conversation before getting to business. You feel this is:",
    options: [
      "Inefficient. You value relationships, but time is limited. This pattern eats into productive time every meeting.",
      "Essential. This is how the team actually bonds. The conversation before the meeting IS the meeting, in a way.",
      "Fine when the group is informal, but you would expect the team to move faster when a senior leader is present or when stakes are high.",
      "Natural. People need to arrive not just physically but relationally. The warm-up is part of how the group gathers itself.",
    ],
  },
  {
    q: "When you agree to meet with someone \"next week,\" you mean:",
    options: [
      "A specific day and time that will be confirmed in the next 24 hours.",
      "Sometime next week, with the exact time to emerge from the conversation closer to the moment.",
      "Whatever works for the more senior person or the one with the greater logistical constraints.",
      "The week is a general window. You will know the right moment when it arrives.",
    ],
  },
  {
    q: "You are deep in focused work when a colleague stops by your desk or calls you with a personal question unrelated to your current task. You:",
    options: [
      "Finish your thought, then give them limited time. You appreciate the connection, but you are in the middle of something.",
      "Set aside the task immediately. The person in front of you takes priority over the task in front of you.",
      "Respond based on who it is. For a senior colleague or a close relationship, you give full attention. For a more peripheral contact, you manage it quickly.",
      "Welcome the interruption. Relationships do not run on schedules. You will return to the task.",
    ],
  },
  {
    q: "A meeting is called for 9:00 am. You arrive at:",
    options: [
      "8:55 am. On time means a few minutes early so the meeting can start at exactly 9:00.",
      "9:00 to 9:10 am. You intend to be there at nine, but a few minutes' flexibility is normal.",
      "Whatever time signals the right level of respect for who called the meeting. Earlier for a senior leader. More flexible with peers.",
      "When you are ready and the group is gathering. You do not monitor the precise arrival time closely.",
    ],
  },
  {
    q: "A project deadline needs to move because a key partnership relationship needs more time to develop before a decision can be made. You feel:",
    options: [
      "Uncomfortable. Relationships are important, but the deadline exists for a reason. You would push to protect the timeline and address the relationship in parallel.",
      "Completely at ease. Relationships are the foundation of every project. Getting the relationship right will make the project work.",
      "Willing to adjust if the people involved agree and if the relationship dimension is genuinely critical. You assess case by case.",
      "Unsurprised. The right time for a decision is when the people are truly ready, not when a calendar said so.",
    ],
  },
  {
    q: "Your team leader rarely sends a specific agenda before meetings. You feel:",
    options: [
      "Frustrated. Preparation is part of respect. Without an agenda, your time is at risk.",
      "Fine with it. Agendas can constrain good conversation. You trust the meeting will go where it needs to go.",
      "Neutral, unless the meeting involves senior leadership. Then you expect more structure.",
      "Fine. Meetings are living things. The group will find its direction.",
    ],
  },
  {
    q: "After a long team meeting, an important decision still has not landed. You suggest:",
    options: [
      "Naming the decision clearly, going around the table for a final position from each person, and recording the outcome before anyone leaves.",
      "Letting the conversation keep moving. Forcing a decision before the room is ready will produce a weak one.",
      "Checking whether the senior person in the room wants to move toward a decision, and following their lead.",
      "Calling the group to pause and sense together whether the time is right. Some decisions need more communal settling before they are made.",
    ],
  },
];

const PART1_QUESTIONS_ID = [
  {
    q: "Seorang rekan tiba 20 menit terlambat ke rapat tim tanpa pesan dan tanpa penjelasan. Kamu merasa:",
    options: [
      "Frustrasi. Dua puluh menit bukan margin kecil. Orang lain berhasil tiba tepat waktu, dan ini mengganggu seluruh kelompok. Kamu ingin membicarakannya secara langsung.",
      "Penasaran, tapi tidak terlalu terganggu. Mungkin ada sesuatu yang terjadi. Kamu akan menanya secara pribadi setelahnya untuk memastikan mereka baik-baik saja.",
      "Tidak nyaman, tapi responmu tergantung pada siapa yang ada di ruangan. Jika ada pemimpin senior, keterlambatan itu terasa lebih signifikan. Jika itu kelompok rekan, terasa kurang.",
      "Tidak terlalu terganggu. Mereka sudah di sini sekarang. Kelompok sudah hadir. Rapat bisa dilanjutkan.",
    ],
  },
  {
    q: "Rapat tim kamu mencapai waktu akhir yang dijadwalkan, tapi diskusi masih berlangsung dan belum terselesaikan. Kamu ingin:",
    options: [
      "Mengakhiri tepat waktu. Jika topik butuh lebih banyak waktu, jadwalkan tindak lanjut. Melebihi waktu menciptakan preseden buruk.",
      "Terus berlanjut. Diskusi masih hidup dan tim masih terlibat. Jam tidak sepenting percakapan.",
      "Membaca situasi. Apakah orang senior menunjukkan tanda-tanda perlu pergi? Apakah energi masih kuat? Kamu akan tetap atau pergi berdasarkan sinyal-sinyal itu.",
      "Biarkan berlanjut. Waktu yang tepat untuk mengakhiri adalah ketika kelompok mencapai titik alami, bukan ketika jam berkata demikian.",
    ],
  },
  {
    q: "Seorang rekan lintas budaya melewatkan tenggat proyek tiga hari dan tidak menyebutnya. Saat kamu menindaklanjuti, mereka merespons dengan hangat dan memberikan kabar terbaru. Kamu:",
    options: [
      "Menghargai kabar terbaru tapi merasa perlu membicarakan tenggat yang terlewat secara langsung. Ini memengaruhi bagian lain proyek dan perlu ditanggapi serius.",
      "Fokus pada hubungan terlebih dahulu. Kamu senang mereka merespons. Kamu menanya tentang pekerjaan dan menyebutkan dampak keterlambatan dengan lembut, tapi tidak memimpin dengan kegagalan.",
      "Menyesuaikan respons berdasarkan hubungan dan konteks. Dengan rekan dekat, kamu mungkin langsung. Dalam lingkungan formal atau hierarkis, kamu lebih berhati-hati dalam menyampaikannya.",
      "Menerima kabar terbaru apa adanya. Mereka terlibat dengan pekerjaan. Kamu mempercayai prosesnya akan selesai.",
    ],
  },
  {
    q: "Tim kamu selalu menghabiskan 10 hingga 15 menit dalam percakapan informal sebelum masuk ke bisnis. Kamu merasa ini:",
    options: [
      "Tidak efisien. Kamu menghargai hubungan, tapi waktu terbatas. Pola ini memakan waktu produktif setiap rapat.",
      "Esensial. Inilah cara tim sebenarnya terikat. Percakapan sebelum rapat ADALAH rapatnya, dalam artian tertentu.",
      "Baik-baik saja ketika kelompoknya informal, tapi kamu berharap tim bergerak lebih cepat ketika pemimpin senior hadir atau ketika taruhannya tinggi.",
      "Wajar. Orang perlu tiba tidak hanya secara fisik tapi juga secara relasional. Pemanasan adalah bagian dari cara kelompok berkumpul.",
    ],
  },
  {
    q: "Ketika kamu setuju untuk bertemu seseorang 'minggu depan', kamu maksudkan:",
    options: [
      "Hari dan waktu tertentu yang akan dikonfirmasi dalam 24 jam ke depan.",
      "Suatu waktu minggu depan, dengan waktu pastinya muncul dari percakapan lebih dekat ke momen itu.",
      "Apa pun yang cocok untuk orang yang lebih senior atau yang memiliki kendala logistik lebih besar.",
      "Minggu adalah jendela umum. Kamu akan tahu momen yang tepat ketika itu tiba.",
    ],
  },
  {
    q: "Kamu sedang fokus bekerja ketika seorang rekan berhenti di mejamu atau meneleponmu dengan pertanyaan pribadi yang tidak terkait tugas saat ini. Kamu:",
    options: [
      "Menyelesaikan pikiranmu, lalu memberikan waktu terbatas kepada mereka. Kamu menghargai koneksi, tapi kamu sedang di tengah-tengah sesuatu.",
      "Meninggalkan tugas segera. Orang di hadapanmu lebih prioritas daripada tugas di hadapanmu.",
      "Merespons berdasarkan siapa mereka. Untuk rekan senior atau hubungan dekat, kamu memberikan perhatian penuh. Untuk kontak yang lebih peripheral, kamu menanganinya dengan cepat.",
      "Menyambut gangguan itu. Hubungan tidak berjalan berdasarkan jadwal. Kamu akan kembali ke tugas.",
    ],
  },
  {
    q: "Rapat dijadwalkan jam 9:00 pagi. Kamu tiba:",
    options: [
      "Jam 8:55 pagi. Tepat waktu berarti beberapa menit lebih awal agar rapat bisa dimulai tepat jam 9:00.",
      "Jam 9:00 hingga 9:10 pagi. Kamu bermaksud hadir jam sembilan, tapi beberapa menit fleksibilitas itu normal.",
      "Waktu apa pun yang menandakan tingkat penghormatan yang tepat untuk siapa yang mengadakan rapat. Lebih awal untuk pemimpin senior. Lebih fleksibel dengan rekan.",
      "Ketika kamu sudah siap dan kelompok sedang berkumpul. Kamu tidak memantau waktu kedatangan yang tepat secara ketat.",
    ],
  },
  {
    q: "Tenggat proyek perlu digeser karena hubungan kemitraan kunci membutuhkan lebih banyak waktu untuk berkembang sebelum keputusan dapat dibuat. Kamu merasa:",
    options: [
      "Tidak nyaman. Hubungan itu penting, tapi tenggat ada alasannya. Kamu akan berupaya melindungi garis waktu dan menangani hubungan secara paralel.",
      "Sepenuhnya tenang. Hubungan adalah fondasi setiap proyek. Mendapatkan hubungan yang benar akan membuat proyek berhasil.",
      "Bersedia menyesuaikan jika orang-orang yang terlibat setuju dan jika dimensi hubungan benar-benar kritis. Kamu menilai kasus per kasus.",
      "Tidak heran. Waktu yang tepat untuk keputusan adalah ketika orang-orang benar-benar siap, bukan ketika kalender mengatakan demikian.",
    ],
  },
  {
    q: "Pemimpin tim kamu jarang mengirim agenda spesifik sebelum rapat. Kamu merasa:",
    options: [
      "Frustrasi. Persiapan adalah bagian dari penghormatan. Tanpa agenda, waktumu berisiko.",
      "Tidak masalah. Agenda bisa membatasi percakapan yang baik. Kamu mempercayai rapat akan berjalan ke mana seharusnya.",
      "Netral, kecuali rapat melibatkan kepemimpinan senior. Maka kamu mengharapkan lebih banyak struktur.",
      "Baik-baik saja. Rapat adalah sesuatu yang hidup. Kelompok akan menemukan arahnya.",
    ],
  },
  {
    q: "Setelah rapat tim yang panjang, keputusan penting masih belum tercapai. Kamu menyarankan:",
    options: [
      "Menyebutkan keputusan dengan jelas, berkeliling meja untuk posisi akhir dari setiap orang, dan mencatat hasilnya sebelum siapa pun pergi.",
      "Membiarkan percakapan terus bergerak. Memaksakan keputusan sebelum ruangan siap akan menghasilkan keputusan yang lemah.",
      "Memeriksa apakah orang senior di ruangan ingin bergerak menuju keputusan, dan mengikuti arahan mereka.",
      "Mengajak kelompok untuk berhenti sejenak dan merasakan bersama apakah waktunya sudah tepat. Beberapa keputusan membutuhkan lebih banyak waktu komunal sebelum dibuat.",
    ],
  },
];

// ─── Part 2 questions ─────────────────────────────────────────────────────────
const PART2_QUESTIONS = [
  {
    q: "Your colleague arrives 20 minutes late to a team meeting with no message. They probably:",
    options: [
      "Know they are late and feel some internal pressure about it, even if they do not show it outwardly.",
      "Did not experience the lateness as a significant event. Something came up, they are here now, and the meeting can continue.",
      "Are reading the room as they enter to understand how their arrival is being received before they respond.",
      "Simply arrived when they were ready. The meeting time was a general orientation, not a hard boundary.",
    ],
  },
  {
    q: "In the culture you work with, when a meeting runs over its scheduled time, people typically:",
    options: [
      "Feel internal pressure to wrap up. Someone will signal that time is up. Overrunning feels like a violation.",
      "Continue naturally. The conversation matters more than the schedule. Leaving mid-discussion would feel rude.",
      "Look to whoever is senior in the room. If that person shows no sign of ending, others will stay. If they move, the group moves.",
      "Follow the natural energy of the group. When the gathering feels complete, it ends.",
    ],
  },
  {
    q: "If a colleague from this culture misses a deadline and does not bring it up, it most likely means:",
    options: [
      "They feel some shame about it and are hoping it will not become a bigger issue.",
      "They do not register it as a 'miss' in the way you do. The work is still moving and the relationship is intact.",
      "They are waiting to see how important it is to you before deciding how much attention it deserves.",
      "Time-keeping around delivery was never their primary orientation for this piece of work.",
    ],
  },
  {
    q: "When your team from this culture spends extended time in informal conversation before business, it is because:",
    options: [
      "They are being social, but they probably also feel mild guilt about not getting started.",
      "The connection IS the work. Relational groundwork before the agenda is not optional for them.",
      "They are reading whether the context calls for formality or warmth, and adjusting accordingly.",
      "The group is gathering itself. Business begins when the presence feels right, not when a clock says so.",
    ],
  },
  {
    q: "In this culture, when someone agrees to meet \"next week,\" they mean:",
    options: [
      "A specific window that will be confirmed quickly. They have it loosely in mind already.",
      "Sometime next week, to be determined by what works relationally and logistically in the moment.",
      "Whatever is appropriate given who proposed the meeting and who holds the higher status.",
      "A general window. The specific moment will emerge when the time feels right for both parties.",
    ],
  },
  {
    q: "When a colleague from this culture stops what they are doing to give you time during an unexpected drop-by, this is most likely because:",
    options: [
      "They felt they could not say no, even if it cost them focus time.",
      "For them, the person present always takes priority over the task in progress. This is simply how they operate.",
      "They assessed the relationship and the context and concluded that giving you time was the appropriate response.",
      "Interruptions do not read as interruptions to them. Conversations flow. Tasks resume.",
    ],
  },
  {
    q: "When a colleague from this culture arrives at a meeting, they tend to arrive:",
    options: [
      "Close to or slightly before the agreed time. Punctuality matters to them.",
      "Somewhat flexibly. A few minutes late is not experienced as late.",
      "According to the formality of the occasion. High-stakes meeting: they are careful. Informal gathering: much more relaxed.",
      "When they are ready and when the group is forming. Clock time is a rough reference, not a commitment.",
    ],
  },
  {
    q: "If a project deadline moves because a key relationship needs more development time, your colleagues from this culture would:",
    options: [
      "Feel some discomfort. Deadlines are there for a reason, and they take that seriously even if they defer to others.",
      "Feel completely at ease. In their view, the relationship adjustment IS the right project management decision.",
      "Accept it if the senior person endorses the extension. Hierarchy mediates these decisions.",
      "Not be surprised. They expected the timeline to find its natural shape as the work developed.",
    ],
  },
  {
    q: "When your team leader from this culture sends no agenda before a meeting, it is probably because:",
    options: [
      "They forgot, or they prioritize execution over preparation. They may feel slightly uncomfortable if called out on it.",
      "They trust the conversation to find its direction. An agenda can feel like it pre-decides what matters.",
      "Agendas depend on the level of formality. They reserve them for high-stakes or formal settings.",
      "The meeting is a gathering, not a plan. What is needed will surface from the group.",
    ],
  },
  {
    q: "When an important decision has not landed after a long meeting, your colleagues from this culture tend to:",
    options: [
      "Feel some urgency to name it and close it. Leaving a decision unmade is uncomfortable.",
      "Let the conversation keep moving. Forcing a decision before the room is ready produces a weaker result.",
      "Look to the senior person for a signal. If they indicate it is time to decide, the group will move. If not, the group will wait.",
      "Sense together whether the time is right. Some decisions need more communal settling before they are made.",
    ],
  },
];

const PART2_QUESTIONS_ID = [
  {
    q: "Rekan kamu tiba 20 menit terlambat ke rapat tim tanpa pesan. Mereka mungkin:",
    options: [
      "Tahu mereka terlambat dan merasakan tekanan internal, meski tidak menunjukkannya secara lahiriah.",
      "Tidak mengalami keterlambatan itu sebagai peristiwa signifikan. Ada sesuatu yang terjadi, mereka sudah di sini, dan rapat bisa dilanjutkan.",
      "Membaca situasi saat masuk untuk memahami bagaimana kedatangan mereka diterima sebelum merespons.",
      "Hanya tiba ketika mereka siap. Waktu rapat adalah orientasi umum, bukan batas keras.",
    ],
  },
  {
    q: "Dalam budaya yang kamu jalani, ketika rapat melebihi waktu yang dijadwalkan, orang biasanya:",
    options: [
      "Merasakan tekanan internal untuk segera mengakhiri. Seseorang akan memberi sinyal bahwa waktunya habis. Melebihi waktu terasa seperti pelanggaran.",
      "Terus berlanjut secara alami. Percakapan lebih penting dari jadwal. Pergi di tengah diskusi terasa tidak sopan.",
      "Melihat ke siapa pun yang senior di ruangan. Jika orang itu tidak menunjukkan tanda-tanda mengakhiri, orang lain akan tetap. Jika mereka bergerak, kelompok bergerak.",
      "Mengikuti energi alami kelompok. Ketika pertemuan terasa selesai, itulah akhirnya.",
    ],
  },
  {
    q: "Jika seorang rekan dari budaya ini melewatkan tenggat dan tidak menyebutnya, ini kemungkinan besar berarti:",
    options: [
      "Mereka merasakan sedikit rasa malu dan berharap itu tidak menjadi masalah yang lebih besar.",
      "Mereka tidak menganggapnya sebagai 'kegagalan' seperti yang kamu lakukan. Pekerjaan masih berjalan dan hubungan masih terjaga.",
      "Mereka menunggu untuk melihat seberapa penting ini bagimu sebelum memutuskan berapa banyak perhatian yang layak diberikan.",
      "Ketepatan waktu dalam pengiriman tidak pernah menjadi orientasi utama mereka untuk pekerjaan ini.",
    ],
  },
  {
    q: "Ketika tim dari budaya ini menghabiskan waktu lama dalam percakapan informal sebelum bisnis, itu karena:",
    options: [
      "Mereka bersosial, tapi mereka mungkin juga merasakan sedikit rasa bersalah karena belum memulai.",
      "Koneksi ADALAH pekerjaannya. Landasan relasional sebelum agenda adalah hal yang tidak bisa ditawar bagi mereka.",
      "Mereka membaca apakah konteks menuntut formalitas atau kehangatan, dan menyesuaikannya.",
      "Kelompok sedang berkumpul. Bisnis dimulai ketika kehadiran terasa tepat, bukan ketika jam mengatakan demikian.",
    ],
  },
  {
    q: "Dalam budaya ini, ketika seseorang setuju untuk bertemu 'minggu depan', mereka maksudkan:",
    options: [
      "Jendela spesifik yang akan segera dikonfirmasi. Mereka sudah memikirkannya secara umum.",
      "Suatu waktu minggu depan, ditentukan oleh apa yang cocok secara relasional dan logistis pada momennya.",
      "Apa pun yang sesuai mengingat siapa yang mengusulkan pertemuan dan siapa yang memiliki status lebih tinggi.",
      "Jendela umum. Momen spesifik akan muncul ketika waktunya terasa tepat bagi kedua pihak.",
    ],
  },
  {
    q: "Ketika seorang rekan dari budaya ini berhenti dari yang sedang mereka lakukan untuk memberikanmu waktu saat kamu datang tak terduga, ini kemungkinan besar karena:",
    options: [
      "Mereka merasa tidak bisa menolak, meski itu menghabiskan waktu fokus mereka.",
      "Bagi mereka, orang yang hadir selalu lebih prioritas dari tugas yang sedang dikerjakan. Inilah cara mereka beroperasi.",
      "Mereka menilai hubungan dan konteks, dan menyimpulkan bahwa memberikanmu waktu adalah respons yang tepat.",
      "Gangguan tidak terbaca sebagai gangguan bagi mereka. Percakapan mengalir. Tugas dilanjutkan.",
    ],
  },
  {
    q: "Ketika seorang rekan dari budaya ini tiba di rapat, mereka cenderung tiba:",
    options: [
      "Mendekati atau sedikit sebelum waktu yang disepakati. Ketepatan waktu penting bagi mereka.",
      "Cukup fleksibel. Beberapa menit terlambat tidak dialami sebagai terlambat.",
      "Sesuai formalitas acara. Rapat berisiko tinggi: mereka berhati-hati. Pertemuan informal: jauh lebih santai.",
      "Ketika mereka siap dan ketika kelompok sedang terbentuk. Waktu jam adalah referensi kasar, bukan komitmen.",
    ],
  },
  {
    q: "Jika tenggat proyek bergeser karena hubungan kunci membutuhkan lebih banyak waktu pengembangan, rekan dari budaya ini akan:",
    options: [
      "Merasa sedikit tidak nyaman. Tenggat ada alasannya, dan mereka menganggapnya serius meski mereka menyerahkan keputusan kepada orang lain.",
      "Merasa sepenuhnya tenang. Dalam pandangan mereka, penyesuaian hubungan ADALAH keputusan manajemen proyek yang tepat.",
      "Menerimanya jika orang senior menyetujui perpanjangan. Hierarki memediasi keputusan-keputusan ini.",
      "Tidak heran. Mereka mengharapkan garis waktu akan menemukan bentuk alaminya seiring pekerjaan berkembang.",
    ],
  },
  {
    q: "Ketika pemimpin tim dari budaya ini tidak mengirim agenda sebelum rapat, itu mungkin karena:",
    options: [
      "Mereka lupa, atau mereka memprioritaskan eksekusi daripada persiapan. Mereka mungkin sedikit tidak nyaman jika ditegur.",
      "Mereka mempercayai percakapan untuk menemukan arahnya. Agenda bisa terasa seperti pra-memutuskan apa yang penting.",
      "Agenda tergantung pada tingkat formalitas. Mereka menyimpannya untuk lingkungan formal atau berisiko tinggi.",
      "Rapat adalah pertemuan, bukan rencana. Apa yang dibutuhkan akan muncul dari kelompok.",
    ],
  },
  {
    q: "Ketika keputusan penting belum tercapai setelah rapat panjang, rekan dari budaya ini cenderung:",
    options: [
      "Merasakan sedikit urgensi untuk menamakannya dan menutupnya. Membiarkan keputusan tidak dibuat terasa tidak nyaman.",
      "Membiarkan percakapan terus bergerak. Memaksakan keputusan sebelum ruangan siap menghasilkan hasil yang lebih lemah.",
      "Melihat kepada orang senior untuk sinyal. Jika mereka menunjukkan sudah waktunya memutuskan, kelompok akan bergerak. Jika tidak, kelompok akan menunggu.",
      "Merasakan bersama apakah waktunya sudah tepat. Beberapa keputusan membutuhkan lebih banyak waktu komunal sebelum dibuat.",
    ],
  },
];

// ─── Result blocks ────────────────────────────────────────────────────────────
const RESULT_BLOCKS: Record<string, { label: string; body: string }> = {
  A: {
    label: "YOUR ORIENTATION — THE CLOCK KEEPER",
    body: "You see time as a resource. And you manage it accordingly.\n\nFor you, punctuality is not a personality quirk. It is a form of respect. When you commit to a time, you mean it. And when someone else does not, it registers immediately, not as a minor inconvenience but as a signal about how they regard the work and the people around them.\n\nYour strength here is real. Teams with Clock Keepers deliver. Deadlines hold. Meetings end. People know what to expect from you, and over time that builds a specific kind of trust: the trust of reliability.\n\nYour blind spot is this: you will sometimes read a cultural logic through your own framework and see a character problem that is not there. Someone who operates from a different time orientation is not necessarily disorganized, disrespectful, or unreliable. They may be operating from a logic that is as internally consistent as yours, just built around different priorities. The risk is writing off capable people before you understand what they are actually offering.",
  },
  B: {
    label: "YOUR ORIENTATION — THE RELATIONSHIP WEAVER",
    body: "For you, time belongs to the person in front of you.\n\nYou are not careless about time. You care deeply. But what you care about is the person, not the schedule. When a conversation needs to keep going, it keeps going. When someone needs you, you are present. The clock is a rough guide, not a governing authority.\n\nYour strength is the quality of relational trust you build. People feel genuinely seen by you. On your best days, you create the kind of depth in a team that no agenda can manufacture. That depth is what makes hard work sustainable.\n\nYour blind spot is the cost that your flexibility places on colleagues who planned around your committed times. The colleague who rearranged their afternoon to be ready for your 2:00 pm call and you arrived at 2:30 did not experience that as warmth. They experienced it as a broken promise. Over time, this pattern, even when it comes from genuine care, can erode the very trust you are trying to build.",
  },
  C: {
    label: "YOUR ORIENTATION — THE HARMONY FOLLOWER",
    body: "You read the room before you read the clock.\n\nYour relationship with time is fluid in a specific way: it shifts based on context, relationship, and hierarchy. With a senior leader or in a high-stakes setting, you are likely to be punctual and structured. With peers or in informal settings, you allow more flow.\n\nYour strength is a social intelligence that most Clock Keepers and Relationship Weavers do not fully have. You can move between registers. You adapt. You are not locked into one mode, which makes you genuinely versatile in complex team environments.\n\nYour blind spot is that neither Clock Keepers nor Relationship Weavers can fully read your logic. Clock Keepers see inconsistency. Relationship Weavers sometimes feel you are not fully available. The unspoken rules you navigate so naturally need to be named more often than feels comfortable, because your teammates cannot see the map you are using.",
  },
  D: {
    label: "YOUR ORIENTATION — THE COMMUNITY KEEPER",
    body: "For you, time is constituted by the people, not the calendar.\n\nYou carry a deep sense that the right time for something is when the people are truly gathered, not just physically present but relationally ready. Community presence is not preparation for the event. It is the event.\n\nYour strength is something most organizational teams desperately lack: a sense of shared presence. You are not transactional about time. You bring people into the moment rather than driving them through an agenda.\n\nYour blind spot, and this is worth naming honestly, is that most organizational systems are designed around monochronic assumptions. The logistical gaps this creates are real. Missed delivery windows, unclear timelines, and decisions deferred without explanation can undermine the relational trust you are trying to build. The work here is not to abandon your logic. It is to translate it, deliberately, for colleagues whose systems depend on knowing what is coming and when.",
  },
};

const RESULT_BLOCKS_ID: Record<string, { label: string; body: string }> = {
  A: {
    label: "ORIENTASI KAMU — PENJAGA JAM",
    body: "Kamu melihat waktu sebagai sumber daya. Dan kamu mengelolanya sesuai itu.\n\nBagimu, ketepatan waktu bukan sekadar kebiasaan kepribadian. Itu adalah bentuk penghormatan. Ketika kamu berkomitmen pada waktu, kamu sungguh-sungguh. Dan ketika orang lain tidak, itu langsung teregistrasi — bukan sebagai ketidaknyamanan kecil tapi sebagai sinyal tentang bagaimana mereka menganggap pekerjaan dan orang-orang di sekitarnya.\n\nKekuatanmu di sini nyata. Tim dengan Penjaga Jam bisa menyelesaikan pekerjaan. Tenggat terjaga. Rapat berakhir. Orang tahu apa yang bisa diharapkan darimu, dan seiring waktu itu membangun kepercayaan yang spesifik: kepercayaan keandalan.\n\nTitik butamu adalah ini: kamu terkadang akan membaca logika budaya melalui kerangkamu sendiri dan melihat masalah karakter yang sebenarnya tidak ada. Seseorang yang beroperasi dari orientasi waktu berbeda tidak selalu tidak terorganisir, tidak hormat, atau tidak dapat diandalkan. Mereka mungkin beroperasi dari logika yang sama konsistensinya dengan milikmu, hanya dibangun di sekitar prioritas berbeda. Risikonya adalah mencoret orang-orang yang mampu sebelum kamu memahami apa yang sebenarnya mereka tawarkan.",
  },
  B: {
    label: "ORIENTASI KAMU — PENENUN RELASI",
    body: "Bagimu, waktu milik orang yang ada di hadapanmu.\n\nKamu tidak ceroboh soal waktu. Kamu sangat peduli. Tapi yang kamu pedulikan adalah orangnya, bukan jadwalnya. Ketika percakapan perlu terus berlanjut, ia berlanjut. Ketika seseorang membutuhkanmu, kamu hadir. Jam adalah panduan kasar, bukan otoritas yang mengatur.\n\nKekuatanmu adalah kualitas kepercayaan relasional yang kamu bangun. Orang merasa benar-benar dilihat olehmu. Pada hari-hari terbaikmu, kamu menciptakan kedalaman dalam tim yang tidak bisa dibuat oleh agenda mana pun. Kedalaman itulah yang membuat kerja keras bisa bertahan.\n\nTitik butamu adalah biaya yang fleksibilitasmu tempatkan kepada rekan yang sudah merencanakan komitmen waktu yang sudah disepakati. Rekan yang mengubah susunan sore hari mereka untuk siap mengikuti panggilan jam 2:00 sore dan kamu tiba jam 2:30 tidak mengalami itu sebagai kehangatan. Mereka mengalaminya sebagai janji yang dilanggar. Seiring waktu, pola ini — bahkan ketika berasal dari kepedulian tulus — bisa mengikis kepercayaan yang justru ingin kamu bangun.",
  },
  C: {
    label: "ORIENTASI KAMU — PENGIKUT HARMONI",
    body: "Kamu membaca suasana sebelum membaca jam.\n\nHubunganmu dengan waktu itu cair dengan cara yang spesifik: ia bergeser berdasarkan konteks, hubungan, dan hierarki. Dengan pemimpin senior atau dalam situasi berisiko tinggi, kamu cenderung tepat waktu dan terstruktur. Dengan rekan atau dalam pengaturan informal, kamu membolehkan lebih banyak alur.\n\nKekuatanmu adalah kecerdasan sosial yang sebagian besar Penjaga Jam dan Penenun Relasi tidak sepenuhnya miliki. Kamu bisa bergerak antara register. Kamu beradaptasi. Kamu tidak terkunci dalam satu mode, yang membuatmu benar-benar serbaguna dalam lingkungan tim yang kompleks.\n\nTitik butamu adalah bahwa Penjaga Jam maupun Penenun Relasi tidak bisa sepenuhnya membaca logikamu. Penjaga Jam melihat inkonsistensi. Penenun Relasi terkadang merasa kamu tidak selalu tersedia. Aturan tak terucap yang kamu navigasi begitu alami perlu lebih sering diungkapkan daripada yang terasa nyaman — karena rekan setimmu tidak bisa melihat peta yang kamu gunakan.",
  },
  D: {
    label: "ORIENTASI KAMU — PENJAGA KOMUNITAS",
    body: "Bagimu, waktu dibentuk oleh orang-orang, bukan kalender.\n\nKamu membawa rasa mendalam bahwa waktu yang tepat untuk sesuatu adalah ketika orang-orang benar-benar berkumpul — bukan hanya hadir secara fisik tapi siap secara relasional. Kehadiran komunitas bukan persiapan untuk acara. Itu adalah acaranya.\n\nKekuatanmu adalah sesuatu yang sebagian besar tim organisasi sangat kekurangan: rasa kehadiran bersama. Kamu tidak transaksional soal waktu. Kamu membawa orang ke dalam momen alih-alih mendorong mereka melalui agenda.\n\nTitik butamu — dan ini perlu diungkapkan dengan jujur — adalah bahwa sebagian besar sistem organisasi dirancang berdasarkan asumsi monochronic. Kesenjangan logistis yang ini ciptakan itu nyata. Jendela pengiriman yang terlewat, garis waktu yang tidak jelas, dan keputusan yang ditunda tanpa penjelasan bisa merusak kepercayaan relasional yang kamu coba bangun. Pekerjaan di sini bukan untuk meninggalkan logikamu. Itu adalah untuk menerjemahkannya — dengan disengaja — untuk rekan yang sistemnya bergantung pada mengetahui apa yang akan datang dan kapan.",
  },
};

// ─── Placeholder transition texts ─────────────────────────────────────────────
const PART1_TRANSITIONS: Record<string, string> = {
  A: "Your answers point consistently toward structure, punctuality, and clear commitments. In this module, we call your type the Clock Keeper.",
  B: "Your answers point consistently toward people, presence, and relational warmth. In this module, we call your type the Relationship Weaver.",
  C: "Your answers point consistently toward reading context before reading the clock. In this module, we call your type the Harmony Follower.",
  D: "Your answers point consistently toward communal readiness over calendar time. In this module, we call your type the Community Keeper.",
};

const PART2_TRANSITIONS: Record<string, string> = {
  A: "The culture you work with appears to lean toward structure, punctuality, and clear commitments. In this module we call this the Clock Keeper.",
  B: "The culture you work with appears to lean toward people, presence, and relational warmth. In this module we call this the Relationship Weaver.",
  C: "The culture you work with appears to lean toward reading context before reading the clock. In this module we call this the Harmony Follower.",
  D: "The culture you work with appears to lean toward communal readiness over calendar time. In this module we call this the Community Keeper.",
};

const PART1_TYPE_NAMES: Record<string, string> = {
  A: "You are a Clock Keeper.",
  B: "You are a Relationship Weaver.",
  C: "You are a Harmony Follower.",
  D: "You are a Community Keeper.",
};

const PART2_TYPE_NAMES: Record<string, string> = {
  A: "The culture you work with leans Clock Keeper.",
  B: "The culture you work with leans Relationship Weaver.",
  C: "The culture you work with leans Harmony Follower.",
  D: "The culture you work with leans Community Keeper.",
};

const PART1_TRANSITIONS_ID: Record<string, string> = {
  A: "Jawaban-jawabanmu secara konsisten menunjuk pada struktur, ketepatan waktu, dan komitmen yang jelas. Dalam modul ini, kami menyebut tipe kamu Penjaga Jam.",
  B: "Jawaban-jawabanmu secara konsisten menunjuk pada orang, kehadiran, dan kehangatan relasional. Dalam modul ini, kami menyebut tipe kamu Penenun Relasi.",
  C: "Jawaban-jawabanmu secara konsisten menunjuk pada membaca konteks sebelum membaca jam. Dalam modul ini, kami menyebut tipe kamu Pengikut Harmoni.",
  D: "Jawaban-jawabanmu secara konsisten menunjuk pada kesiapan komunal di atas waktu kalender. Dalam modul ini, kami menyebut tipe kamu Penjaga Komunitas.",
};

const PART2_TRANSITIONS_ID: Record<string, string> = {
  A: "Budaya yang kamu jalani tampaknya condong ke struktur, ketepatan waktu, dan komitmen yang jelas. Dalam modul ini kami menyebut ini Penjaga Jam.",
  B: "Budaya yang kamu jalani tampaknya condong ke orang, kehadiran, dan kehangatan relasional. Dalam modul ini kami menyebut ini Penenun Relasi.",
  C: "Budaya yang kamu jalani tampaknya condong ke membaca konteks sebelum membaca jam. Dalam modul ini kami menyebut ini Pengikut Harmoni.",
  D: "Budaya yang kamu jalani tampaknya condong ke kesiapan komunal di atas waktu kalender. Dalam modul ini kami menyebut ini Penjaga Komunitas.",
};

const PART1_TYPE_NAMES_ID: Record<string, string> = {
  A: "Kamu adalah Penjaga Jam.",
  B: "Kamu adalah Penenun Relasi.",
  C: "Kamu adalah Pengikut Harmoni.",
  D: "Kamu adalah Penjaga Komunitas.",
};

const PART2_TYPE_NAMES_ID: Record<string, string> = {
  A: "Budaya yang kamu jalani condong ke Penjaga Jam.",
  B: "Budaya yang kamu jalani condong ke Penenun Relasi.",
  C: "Budaya yang kamu jalani condong ke Pengikut Harmoni.",
  D: "Budaya yang kamu jalani condong ke Penjaga Komunitas.",
};

const TYPE_SHORT_ID: Record<string, string> = {
  A: "Penjaga Jam",
  B: "Penenun Relasi",
  C: "Pengikut Harmoni",
  D: "Penjaga Komunitas",
};

// ─── Gap blocks ───────────────────────────────────────────────────────────────
const GAP_BLOCKS: Record<string, { title: string; body: string }> = {
  "A-B": {
    title: "Clock Keeper meets Relationship Weaver",
    body: "Your most natural instinct is to hold the line on agreed times. The culture you work with most treats time as relational and fluid.\n\nThis is one of the most common friction points in cross-cultural teams. It shows up in missed deadlines, overrun meetings, and a growing sense that one side 'just doesn't get it.' The Clock Keeper eventually labels the Relationship Weaver as unprofessional. The Relationship Weaver eventually labels the Clock Keeper as cold.\n\nOne thing you can do: Before the next meeting or deadline, name the gap explicitly and briefly. Not as a correction, but as a question: 'In our team, I notice we have different rhythms around time. Can we spend five minutes agreeing on what a deadline means to all of us, and what we do when it needs to move?' That conversation, done once, changes the dynamic for months.",
  },
  "A-C": {
    title: "Clock Keeper meets Harmony Follower",
    body: "You prioritize structure and predictability. The culture you work with reads the room and adjusts accordingly, which looks inconsistent to you.\n\nThe Harmony Follower is not being unpredictable for its own sake. They are reading context. The problem is that their contextual logic is invisible to you. You see someone who is punctual for some meetings and not others, formal sometimes and informal others, and you cannot find the pattern.\n\nOne thing you can do: Ask. Directly and without critique: 'I notice our team tends to operate differently depending on the setting. What signals tell you when we are in structured mode versus flexible mode?' You will get an answer that unlocks months of unspoken confusion.",
  },
  "A-D": {
    title: "Clock Keeper meets Community Keeper",
    body: "You orient around schedules, specific times, and deliverable windows. The culture you work with orients around communal readiness, and 'when the people are gathered' is a legitimate answer to 'when does this start?'\n\nThis is the widest logic gap in most organizational teams, and it is where the harshest cultural judgments tend to form. The Clock Keeper reads Community Keeper logic as chronic unreliability. The Community Keeper reads Clock Keeper urgency as impersonal and trust-breaking.\n\nOne thing you can do: Build in communal gathering time before you expect anything deliverable. If your 9:00 am meeting actually needs to produce a decision by 9:45, account for 20 minutes of genuine gathering before the agenda begins. Name it as intentional, not wasted. Watch what changes in the quality of what the group produces.",
  },
  "B-C": {
    title: "Relationship Weaver meets Harmony Follower",
    body: "You prioritize people over schedules and expect relational warmth to govern how time is used. The culture you work with adjusts based on who is in the room and what the hierarchy demands.\n\nThe Harmony Follower's variability can feel like inconsistency to a Relationship Weaver. 'Why are you warm with some people and formal with others? Are you not being authentic?' But the Harmony Follower is not performing. They are reading context, and in their logic, that is the most relationally intelligent thing you can do.\n\nOne thing you can do: Before high-stakes meetings, check in with your Harmony Follower colleague about what mode the meeting calls for. Not 'how do you want to act' but 'who will be in the room, and what do you think the right register is?' You will both arrive better prepared, and they will feel respected rather than managed.",
  },
  "B-D": {
    title: "Relationship Weaver meets Community Keeper",
    body: "Both of you prioritize people over clocks, but you do it differently. The Relationship Weaver orients time around the person in front of them. The Community Keeper orients time around the whole gathered community.\n\nThis gap is often the least visible, because both sides feel aligned. But friction emerges when the Relationship Weaver treats a one-on-one relationship as the primary unit, and the Community Keeper expects wider community consensus before things can move. What feels like relationship-building to you may feel like bypassing the group to them.\n\nOne thing you can do: When moving toward a decision, ask: 'Who else needs to be part of this conversation before we can commit?' Not as a delay tactic, but as a genuine question about whose presence makes the decision real.",
  },
  "C-D": {
    title: "Harmony Follower meets Community Keeper",
    body: "You read hierarchy and context to determine how time is used. The culture you work with reads communal readiness. These two logics can align, but they can also produce significant confusion about who is setting the pace and why.\n\nThe Community Keeper is not waiting for a senior signal. They are waiting for a communal one. The Harmony Follower expects hierarchy to calibrate the room. When that calibration is not happening, both sides end up waiting for the other.\n\nOne thing you can do: Name the decision-making unit explicitly. 'In our team, who needs to be present before we can move forward on this?' Get the answer on the table. In some cultures that answer is the leader. In others it is the whole group. Making it explicit removes weeks of unspoken waiting.",
  },
};

const GAP_BLOCKS_ID: Record<string, { title: string; body: string }> = {
  "A-B": {
    title: "Penjaga Jam bertemu Penenun Relasi",
    body: "Instingtmu yang paling alami adalah memegang batas waktu yang telah disepakati. Budaya yang kamu jalani paling sering memperlakukan waktu sebagai relasional dan cair.\n\nIni adalah salah satu titik gesekan yang paling umum dalam tim lintas budaya. Ini muncul dalam tenggat yang terlewat, rapat yang melampaui waktu, dan perasaan yang semakin kuat bahwa satu pihak 'tidak mengerti.' Penjaga Jam akhirnya melabeli Penenun Relasi sebagai tidak profesional. Penenun Relasi akhirnya melabeli Penjaga Jam sebagai dingin.\n\nSatu hal yang bisa kamu lakukan: Sebelum rapat atau tenggat berikutnya, sebutkan kesenjangan itu secara eksplisit dan singkat. Bukan sebagai koreksi, tapi sebagai pertanyaan: 'Dalam tim kita, saya perhatikan kita memiliki ritme berbeda seputar waktu. Bisakah kita luangkan lima menit untuk menyepakati apa arti tenggat bagi kita semua, dan apa yang kita lakukan ketika perlu berubah?' Percakapan itu, jika dilakukan sekali, mengubah dinamika selama berbulan-bulan.",
  },
  "A-C": {
    title: "Penjaga Jam bertemu Pengikut Harmoni",
    body: "Kamu memprioritaskan struktur dan prediktabilitas. Budaya yang kamu jalani membaca situasi dan menyesuaikannya, yang terlihat tidak konsisten bagimu.\n\nPengikut Harmoni tidak bersikap tidak terduga demi kepentingannya sendiri. Mereka membaca konteks. Masalahnya adalah logika kontekstual mereka tidak terlihat olehmu. Kamu melihat seseorang yang tepat waktu untuk beberapa rapat tapi tidak yang lain, formal kadang-kadang dan informal di lain waktu, dan kamu tidak bisa menemukan polanya.\n\nSatu hal yang bisa kamu lakukan: Tanya. Secara langsung dan tanpa kritik: 'Saya perhatikan tim kita cenderung beroperasi berbeda tergantung situasi. Sinyal apa yang memberitahumu kapan kita berada dalam mode terstruktur versus mode fleksibel?' Kamu akan mendapat jawaban yang membuka berbulan-bulan kebingungan yang tidak terucap.",
  },
  "A-D": {
    title: "Penjaga Jam bertemu Penjaga Komunitas",
    body: "Kamu berorientasi pada jadwal, waktu tertentu, dan jendela pengiriman. Budaya yang kamu jalani berorientasi pada kesiapan komunal, dan 'ketika orang-orang sudah berkumpul' adalah jawaban yang sah untuk 'kapan ini dimulai?'\n\nIni adalah kesenjangan logika paling lebar dalam sebagian besar tim organisasi, dan di sinilah penilaian budaya yang paling keras cenderung terbentuk. Penjaga Jam membaca logika Penjaga Komunitas sebagai ketidakandalan kronis. Penjaga Komunitas membaca urgensi Penjaga Jam sebagai impersonal dan merusak kepercayaan.\n\nSatu hal yang bisa kamu lakukan: Bangun waktu berkumpul komunal sebelum kamu mengharapkan sesuatu yang bisa diserahkan. Jika rapat jam 9:00 pagimu sebenarnya perlu menghasilkan keputusan pada jam 9:45, sisihkan 20 menit berkumpul yang tulus sebelum agenda dimulai. Namakan itu sebagai sesuatu yang disengaja, bukan terbuang. Perhatikan apa yang berubah dalam kualitas yang dihasilkan kelompok.",
  },
  "B-C": {
    title: "Penenun Relasi bertemu Pengikut Harmoni",
    body: "Kamu memprioritaskan orang di atas jadwal dan mengharapkan kehangatan relasional mengatur bagaimana waktu digunakan. Budaya yang kamu jalani menyesuaikan diri berdasarkan siapa yang ada di ruangan dan apa yang dibutuhkan hierarki.\n\nVariabilitas Pengikut Harmoni bisa terasa seperti inkonsistensi bagi Penenun Relasi. 'Mengapa kamu hangat dengan beberapa orang dan formal dengan orang lain? Apakah kamu tidak autentik?' Tapi Pengikut Harmoni tidak berpura-pura. Mereka membaca konteks, dan dalam logika mereka, itulah hal paling cerdas secara relasional yang bisa kamu lakukan.\n\nSatu hal yang bisa kamu lakukan: Sebelum rapat berisiko tinggi, tanyakan kepada rekan Pengikut Harmoni kamu tentang mode apa yang dituntut rapat itu. Bukan 'bagaimana kamu ingin bertindak' tapi 'siapa yang akan ada di ruangan, dan menurutmu register yang tepat itu apa?' Kalian berdua akan tiba lebih siap, dan mereka akan merasa dihormati alih-alih dikelola.",
  },
  "B-D": {
    title: "Penenun Relasi bertemu Penjaga Komunitas",
    body: "Kalian berdua memprioritaskan orang di atas jam, tapi dengan cara yang berbeda. Penenun Relasi mengorientasikan waktu di sekitar orang yang ada di hadapannya. Penjaga Komunitas mengorientasikan waktu di sekitar seluruh komunitas yang berkumpul.\n\nKesenjangan ini seringkali yang paling tidak terlihat, karena kedua pihak merasa selaras. Tapi gesekan muncul ketika Penenun Relasi memperlakukan hubungan satu-satu sebagai unit utama, dan Penjaga Komunitas mengharapkan konsensus komunitas yang lebih luas sebelum hal-hal bisa bergerak. Apa yang terasa seperti membangun hubungan bagimu mungkin terasa seperti mengabaikan kelompok bagi mereka.\n\nSatu hal yang bisa kamu lakukan: Ketika bergerak menuju keputusan, tanya: 'Siapa lagi yang perlu menjadi bagian dari percakapan ini sebelum kita bisa berkomitmen?' Bukan sebagai taktik penundaan, tapi sebagai pertanyaan tulus tentang kehadiran siapa yang membuat keputusan itu nyata.",
  },
  "C-D": {
    title: "Pengikut Harmoni bertemu Penjaga Komunitas",
    body: "Kamu membaca hierarki dan konteks untuk menentukan bagaimana waktu digunakan. Budaya yang kamu jalani membaca kesiapan komunal. Dua logika ini bisa selaras, tapi juga bisa menghasilkan kebingungan yang signifikan tentang siapa yang menetapkan tempo dan mengapa.\n\nPenjaga Komunitas tidak menunggu sinyal senior. Mereka menunggu sinyal komunal. Pengikut Harmoni mengharapkan hierarki untuk mengkalibrasi ruangan. Ketika kalibrasi itu tidak terjadi, kedua belah pihak menunggu pihak lain.\n\nSatu hal yang bisa kamu lakukan: Sebutkan unit pengambilan keputusan secara eksplisit. 'Dalam tim kita, siapa yang perlu hadir sebelum kita bisa bergerak maju dengan ini?' Dapatkan jawabannya di atas meja. Dalam beberapa budaya, jawabannya adalah pemimpin. Dalam budaya lain, itu seluruh kelompok. Membuat itu eksplisit menghilangkan berminggu-minggu penantian diam-diam.",
  },
};

// ─── Type name helper ─────────────────────────────────────────────────────────
const TYPE_SHORT: Record<string, string> = {
  A: "Clock Keeper",
  B: "Relationship Weaver",
  C: "Harmony Follower",
  D: "Community Keeper",
};

// ─── Scoring helper ───────────────────────────────────────────────────────────
function getDominantOrientation(answers: Record<number, string>): string {
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  Object.values(answers).forEach((v) => {
    if (v in counts) counts[v as keyof typeof counts]++;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function getGapKey(o1: string, o2: string): string {
  const sorted = [o1, o2].sort();
  return `${sorted[0]}-${sorted[1]}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ElapsedTimer({ lang }: { lang: string }) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);
  const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
  const ss = (seconds % 60).toString().padStart(2, "0");
  return (
    <div style={{ textAlign: "center", margin: "32px 0" }}>
      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: BODY_TEXT, marginBottom: 8 }}>
        {L(lang, "Time spent in this module so far", "Waktu yang dihabiskan dalam modul ini sejauh ini")}
      </p>
      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 36, fontWeight: 800, color: ORANGE, margin: 0, letterSpacing: "0.04em" }}>
        {mm}:{ss}
      </p>
    </div>
  );
}

function ConceptCard({ card, expanded, onToggle, lang }: { card: typeof CONCEPT_CARDS[0]; expanded: boolean; onToggle: () => void; lang: string }) {
  return (
    <div
      style={{
        background: NAVY,
        border: "1px solid oklch(35% 0.10 260)",
        borderRadius: 12,
        padding: "1.5rem",
        cursor: "pointer",
        transition: "box-shadow 0.2s",
        alignSelf: "start",
        minHeight: 185,
      }}
      onClick={onToggle}
    >
      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 20, fontWeight: 800, color: ORANGE, margin: "0 0 6px" }}>
        {card.name}
      </p>
      {expanded && (
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: "oklch(65% 0.15 45)", fontStyle: "italic", margin: "0 0 12px" }}>
          {card.term}
        </p>
      )}
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontStyle: "italic", color: OFF_WHITE, margin: "0 0 12px", lineHeight: 1.5 }}>
        {card.belief}
      </p>
      {expanded && (
        <>
          <ul style={{ margin: "0 0 16px", paddingLeft: "1.25rem" }}>
            {card.bullets.map((b, i) => (
              <li key={i} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, color: "oklch(80% 0.04 260)", lineHeight: 1.75, marginBottom: 6 }}>
                {b}
              </li>
            ))}
          </ul>
          <div style={{ background: "oklch(16% 0.08 260)", borderRadius: 8, padding: "12px 16px" }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 700, color: ORANGE, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>
              {L(lang, "Blind Spot", "Titik Buta")}
            </p>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: "oklch(75% 0.04 260)", lineHeight: 1.75, margin: 0, fontStyle: "italic" }}>
              {card.blindspot}
            </p>
          </div>
        </>
      )}
      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: ORANGE, margin: "12px 0 0", fontWeight: 600 }}>
        {expanded ? L(lang, "Show less ↑", "Tampilkan lebih sedikit ↑") : L(lang, "Show more ↓", "Tampilkan lebih banyak ↓")}
      </p>
    </div>
  );
}

function ScenarioCard({ card, lang }: { card: typeof SCENARIO_CARDS[0]; lang: string }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={{ background: OFF_WHITE, borderLeft: `3px solid ${ORANGE}`, borderRadius: "0 8px 8px 0", marginBottom: 24 }}>
      <div style={{ padding: "1.5rem 1.75rem" }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 17, fontWeight: 800, color: NAVY, margin: "0 0 12px" }}>
          {card.title}
        </p>
        {card.situation.split("\n\n").map((para, i) => (
          <p key={i} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, color: BODY_TEXT, lineHeight: 1.8, marginBottom: 10 }}>
            {para}
          </p>
        ))}
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, color: ORANGE, fontStyle: "italic", fontWeight: 600, margin: "16px 0" }}>
          {card.question}
        </p>
        <button
          onClick={() => setRevealed((v) => !v)}
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 14,
            fontWeight: 700,
            color: NAVY,
            background: "none",
            border: `1px solid ${NAVY}`,
            padding: "8px 18px",
            borderRadius: 12,
            cursor: "pointer",
          }}
        >
          {revealed ? L(lang, "Hide explanation ↑", "Sembunyikan penjelasan ↑") : L(lang, "See what's happening →", "Lihat apa yang terjadi →")}
        </button>
      </div>
      {revealed && (
        <div style={{ background: LIGHT_GRAY, padding: "1.25rem 1.75rem", borderTop: `1px solid oklch(90% 0.008 80)` }}>
          {card.reveal.split("\n\n").map((para, i) => (
            <p key={i} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, color: BODY_TEXT, lineHeight: 1.8, marginBottom: 10, margin: i === 0 ? "0 0 10px" : "10px 0" }}>
              {para}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function TeamExercise({ lang }: { lang: string }) {
  const questions = L(lang,
    [
      {
        q: "When we set a meeting time, what does that time actually mean?",
        note: "Listen for the gap between what people say and what you have observed. Some will say 'it means start time' while having a track record of arriving ten minutes late. Some will say 'it is flexible' while feeling genuinely frustrated when others do not arrive on time. The question surfaces the gap between stated norms and lived practice. Do not correct anyone. Just notice what comes up and say: 'Interesting. We seem to have a few different readings of this.'",
      },
      {
        q: "When a deadline moves, what is the first thing you feel?",
        note: "Clock Keepers will tend toward frustration or concern. Relationship Weavers will tend toward pragmatism or even relief if it means more relational groundwork is possible. Community Keepers may be genuinely neutral. The answers reveal orientation without anyone needing to label themselves. If you get a range of responses, name it: 'It sounds like we feel this differently. That is worth knowing.'",
      },
      {
        q: "Think of a time when a colleague's use of time confused or frustrated you. What did you make of it at the time?",
        note: "This question surfaces the interpretive step: what people conclude about another person based on their time behavior. Clock Keepers typically conclude something about character or professionalism. Relationship Weavers conclude something about priorities. The value of the question is not in the story the person shares but in the conclusion they drew. After a few responses, you can say: 'What if that behavior made perfect sense inside a different time logic? What would change about how we are reading it?'",
      },
    ],
    [
      {
        q: "Ketika kita menetapkan waktu rapat, apa arti waktu itu sebenarnya?",
        note: "Dengarkan kesenjangan antara apa yang orang katakan dan apa yang telah kamu amati. Beberapa akan mengatakan 'itu artinya waktu mulai' sementara memiliki rekam jejak tiba sepuluh menit terlambat. Beberapa akan mengatakan 'itu fleksibel' sementara benar-benar frustrasi ketika orang lain tidak tiba tepat waktu. Pertanyaan ini memunculkan kesenjangan antara norma yang dinyatakan dan praktik yang dijalani. Jangan koreksi siapa pun. Cukup perhatikan apa yang muncul dan katakan: 'Menarik. Tampaknya kita memiliki beberapa cara membaca yang berbeda tentang ini.'",
      },
      {
        q: "Ketika tenggat bergerak, apa hal pertama yang kamu rasakan?",
        note: "Penjaga Jam cenderung ke arah frustrasi atau kekhawatiran. Penenun Relasi cenderung ke pragmatisme atau bahkan lega jika itu berarti lebih banyak landasan relasional yang mungkin dilakukan. Penjaga Komunitas mungkin benar-benar netral. Jawaban mengungkapkan orientasi tanpa siapa pun perlu melabeli diri sendiri. Jika kamu mendapat berbagai respons, namakan: 'Tampaknya kita merasakan ini secara berbeda. Itu layak untuk diketahui.'",
      },
      {
        q: "Pikirkan suatu waktu ketika cara rekan menggunakan waktu membingungkan atau membuat kamu frustrasi. Apa yang kamu simpulkan saat itu?",
        note: "Pertanyaan ini memunculkan langkah interpretatif: apa yang orang simpulkan tentang orang lain berdasarkan perilaku waktu mereka. Penjaga Jam biasanya menyimpulkan sesuatu tentang karakter atau profesionalisme. Penenun Relasi menyimpulkan sesuatu tentang prioritas. Nilai pertanyaan ini bukan pada cerita yang dibagikan orang tapi pada kesimpulan yang mereka tarik. Setelah beberapa respons, kamu bisa berkata: 'Bagaimana jika perilaku itu masuk akal sempurna dalam logika waktu yang berbeda? Apa yang akan berubah tentang cara kita membacanya?'",
      },
    ]
  );
  const [openNote, setOpenNote] = useState<number | null>(null);

  return (
    <div style={{ background: LIGHT_GRAY, borderTop: `3px solid ${NAVY}`, borderRadius: "0 0 12px 12px", padding: "2rem" }}>
      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: 8 }}>
        {L(lang, "Team Exercise", "Latihan Tim")}
      </p>
      <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 20, fontWeight: 800, color: NAVY, margin: "0 0 8px" }}>
        {L(lang, "Three Questions Your Team Has Never Asked About Time", "Tiga Pertanyaan yang Belum Pernah Ditanyakan Tim Kamu tentang Waktu")}
      </h3>
      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: BODY_TEXT, lineHeight: 1.75, marginBottom: 24 }}>
        {L(lang,
          "Format: 10 to 15 minutes at the start or end of a team meeting. How to introduce it: \"Before we close today, I want to try something short. Three quick questions about how we experience time as a team. No right answers. I am just curious what we each think.\"",
          "Format: 10 hingga 15 menit di awal atau akhir rapat tim. Cara memperkenalkannya: 'Sebelum kita tutup hari ini, saya ingin mencoba sesuatu yang singkat. Tiga pertanyaan cepat tentang bagaimana kita masing-masing merasakan waktu sebagai tim. Tidak ada jawaban yang benar. Saya hanya ingin tahu apa yang kita pikirkan masing-masing.'"
        )}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {questions.map((item, i) => (
          <div key={i} style={{ background: OFF_WHITE, borderRadius: 8, padding: "1rem 1.25rem" }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, fontWeight: 700, color: NAVY, margin: "0 0 8px" }}>
              {i + 1}. {item.q}
            </p>
            <button
              onClick={() => setOpenNote(openNote === i ? null : i)}
              style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: ORANGE, fontWeight: 700, background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              {openNote === i ? L(lang, "Hide facilitation note ↑", "Sembunyikan catatan fasilitasi ↑") : L(lang, "Facilitation note ↓", "Catatan fasilitasi ↓")}
            </button>
            {openNote === i && (
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: BODY_TEXT, lineHeight: 1.75, margin: "10px 0 0", fontStyle: "italic" }}>
                {item.note}
              </p>
            )}
          </div>
        ))}
      </div>
      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: BODY_TEXT, lineHeight: 1.75, marginTop: 20, fontStyle: "italic" }}>
        {L(lang,
          "After the three questions (optional closing line): \"This is something called time orientation. I am going to learn more about it. If you want to explore it together, I will bring it to a future meeting. But at least now we know this is a real thing we experience differently.\" That is enough. You have opened the door.",
          "Setelah tiga pertanyaan (baris penutup opsional): 'Ini disebut orientasi waktu. Saya akan belajar lebih banyak tentang itu. Jika kamu ingin menjelajahinya bersama, saya akan membawanya ke rapat mendatang. Tapi setidaknya sekarang kita tahu ini adalah sesuatu nyata yang kita alami secara berbeda.' Itu cukup. Kamu telah membuka pintu."
        )}
      </p>
    </div>
  );
}

// ─── One-at-a-time quiz component ─────────────────────────────────────────────
function OneAtATimeQuiz({
  questions,
  answers,
  onAnswer,
  onComplete,
  partLabel,
  partSubtext,
  bgColor,
  accentColor,
  lang,
}: {
  questions: typeof PART1_QUESTIONS;
  answers: Record<number, string>;
  onAnswer: (qIdx: number, val: string) => void;
  onComplete: () => void;
  partLabel: string;
  partSubtext: string;
  bgColor: string;
  accentColor: string;
  lang: string;
}) {
  const [currentQ, setCurrentQ] = useState(0);
  const [animClass, setAnimClass] = useState<string>("");
  const [displayed, setDisplayed] = useState(0);
  const keys = ["A", "B", "C", "D"];
  const autoCompleted = useRef(false);
  const allAnswered = Object.keys(answers).length === questions.length;

  useEffect(() => {
    if (allAnswered && !autoCompleted.current) {
      autoCompleted.current = true;
      const t = setTimeout(onComplete, 80);
      return () => clearTimeout(t);
    }
  }, [allAnswered, onComplete]);

  function navigate(targetQ: number, dir: "right" | "left") {
    const cls = dir === "right" ? "slide-in-right" : "slide-in-left";
    setAnimClass("");
    setTimeout(() => {
      setDisplayed(targetQ);
      setCurrentQ(targetQ);
      setAnimClass(cls);
    }, 10);
  }

  function handleSelect(val: string) {
    onAnswer(displayed, val);
    if (displayed < questions.length - 1) {
      navigate(displayed + 1, "right");
    }
  }

  function handleBack() {
    if (displayed > 0) {
      navigate(displayed - 1, "left");
    }
  }

  const progress = Math.round(((displayed + 1) / questions.length) * 100);

  return (
    <div style={{ background: bgColor, paddingBottom: 48 }}>
      {/* Header */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "48px 24px 32px" }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 800, color: OFF_WHITE, margin: "0 0 10px" }}>
          {partLabel}
        </p>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, color: "oklch(72% 0.04 260)", lineHeight: 1.65, margin: 0 }}>
          {partSubtext}
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: "oklch(65% 0.04 260)", fontWeight: 600 }}>
            {L(lang, `Question ${displayed + 1} of ${questions.length}`, `Pertanyaan ${displayed + 1} dari ${questions.length}`)}
          </span>
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: accentColor, fontWeight: 700 }}>
            {L(lang, `${Object.keys(answers).length} answered`, `${Object.keys(answers).length} dijawab`)}
          </span>
        </div>
        <div style={{ height: 3, background: "oklch(30% 0.06 260)", borderRadius: 2 }}>
          <div style={{ height: "100%", width: `${progress}%`, background: accentColor, borderRadius: 2, transition: "width 0.3s" }} />
        </div>
      </div>

      {/* Question slide area */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "28px 24px 0", overflow: "hidden" }}>
        <div className={animClass} key={displayed}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, fontWeight: 600, color: OFF_WHITE, lineHeight: 1.6, margin: "0 0 20px" }}>
            {questions[displayed].q}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {questions[displayed].options.map((opt, i) => {
              const key = keys[i];
              const isSelected = answers[displayed] === key;
              return (
                <button
                  key={key}
                  onClick={() => handleSelect(key)}
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 14,
                    color: isSelected ? OFF_WHITE : "oklch(75% 0.04 260)",
                    background: isSelected ? "oklch(35% 0.12 45)" : "oklch(28% 0.07 260)",
                    border: isSelected ? `1.5px solid ${accentColor}` : "1.5px solid oklch(35% 0.07 260)",
                    borderRadius: 8,
                    padding: "14px 18px",
                    textAlign: "left",
                    cursor: "pointer",
                    lineHeight: 1.65,
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontWeight: 700, color: accentColor, marginRight: 10 }}>{key}.</span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation row */}
      {!allAnswered && displayed > 0 && (
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "20px 24px 48px" }}>
          <button
            onClick={handleBack}
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              color: "oklch(70% 0.04 260)",
              background: "none",
              border: "1px solid oklch(38% 0.06 260)",
              padding: "10px 18px",
              borderRadius: 12,
              cursor: "pointer",
            }}
          >
            {L(lang, "← Back", "← Kembali")}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
type Props = { isSaved: boolean };

export default function TimeAndCultureClient({ isSaved: initialSaved }: Props) {
  const { lang } = useLanguage();
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  // Assessment state
  type QuizPhase = "part1" | "part1-result" | "part2" | "part2-result";
  const [quizPhase, setQuizPhase] = useState<QuizPhase>("part1");
  const [part1Answers, setPart1Answers] = useState<Record<number, string>>({});
  const [part2Answers, setPart2Answers] = useState<Record<number, string>>({});
  const [showPart1Detail, setShowPart1Detail] = useState(false);
  const [showPart2Detail, setShowPart2Detail] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [bgOpen, setBgOpen] = useState(false);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("time-and-culture");
      setSaved(true);
    });
  }

  const conceptCards = lang === "id" ? CONCEPT_CARDS_ID : CONCEPT_CARDS;
  const scenarioCards = lang === "id" ? SCENARIO_CARDS_ID : SCENARIO_CARDS;
  const part1Questions = lang === "id" ? PART1_QUESTIONS_ID : PART1_QUESTIONS;
  const part2Questions = lang === "id" ? PART2_QUESTIONS_ID : PART2_QUESTIONS;
  const resultBlocks = lang === "id" ? RESULT_BLOCKS_ID : RESULT_BLOCKS;
  const p1Transitions = lang === "id" ? PART1_TRANSITIONS_ID : PART1_TRANSITIONS;
  const p2Transitions = lang === "id" ? PART2_TRANSITIONS_ID : PART2_TRANSITIONS;
  const p1TypeNames = lang === "id" ? PART1_TYPE_NAMES_ID : PART1_TYPE_NAMES;
  const p2TypeNames = lang === "id" ? PART2_TYPE_NAMES_ID : PART2_TYPE_NAMES;
  const typeShort = lang === "id" ? TYPE_SHORT_ID : TYPE_SHORT;
  const gapBlocks = lang === "id" ? GAP_BLOCKS_ID : GAP_BLOCKS;

  const part1Dominant = Object.keys(part1Answers).length === PART1_QUESTIONS.length ? getDominantOrientation(part1Answers) : null;
  const part2Dominant = Object.keys(part2Answers).length === PART2_QUESTIONS.length ? getDominantOrientation(part2Answers) : null;
  const gapKey = part1Dominant && part2Dominant ? getGapKey(part1Dominant, part2Dominant) : null;
  const isMatched = part1Dominant === part2Dominant;

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif", background: OFF_WHITE, minHeight: "100vh" }}>
      <LangToggle />
      <style>{`
        .concept-card-grid { grid-template-columns: repeat(2, 1fr); }
        @media (max-width: 640px) { .concept-card-grid { grid-template-columns: 1fr; } }
        @keyframes slideInRight { from { transform: translateX(32px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideInLeft { from { transform: translateX(-32px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .slide-in-right { animation: slideInRight 0.22s ease-out; }
        .slide-in-left { animation: slideInLeft 0.22s ease-out; }
      `}</style>

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{ background: NAVY, padding: "clamp(64px, 8vw, 96px) 24px clamp(56px, 7vw, 80px)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: ORANGE }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 75% 50%, oklch(30% 0.12 260) 0%, transparent 60%)`, opacity: 0.5 }} />
        <div style={{ position: "relative", maxWidth: 780, margin: "0 auto" }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: 16 }}>
            {L(lang, "Cross-Cultural Module", "Modul Lintas Budaya")}
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, color: OFF_WHITE, margin: "0 0 20px", lineHeight: 1.08 }}>
            {L(lang, "Your Time Is Not My Time", "Waktumu Bukan Waktuku")}
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(16px, 2vw, 18px)", color: "oklch(75% 0.04 260)", maxWidth: 560, margin: "0 0 28px", lineHeight: 1.65 }}>
            {L(lang,
              "Every culture has a relationship with time that feels completely obvious from the inside. That relationship shapes how meetings run, how deadlines are understood, and how trust is built or broken across a team. This module gives you the language to see what's happening — in yourself and in the cultures you work across.",
              "Setiap budaya memiliki hubungan dengan waktu yang terasa sepenuhnya jelas dari dalamnya. Hubungan itu membentuk bagaimana rapat berjalan, bagaimana tenggat dipahami, dan bagaimana kepercayaan dibangun atau dihancurkan dalam sebuah tim. Modul ini memberimu bahasa untuk melihat apa yang terjadi — dalam dirimu sendiri dan dalam budaya-budaya yang kamu jalani."
            )}
          </p>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
            <span style={{ background: "oklch(30% 0.10 260)", color: "oklch(75% 0.04 260)", fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 20 }}>
              20 min
            </span>
            <button
              onClick={handleSave}
              disabled={saved || isPending}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: saved ? "oklch(35% 0.08 260)" : "transparent",
                color: "oklch(75% 0.04 260)",
                padding: "10px 22px",
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 13,
                border: "1px solid oklch(42% 0.08 260)",
                cursor: saved ? "default" : "pointer",
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {saved ? L(lang, "✓ Saved to Dashboard", "✓ Tersimpan di Dasbor") : isPending ? L(lang, "Saving…", "Menyimpan…") : L(lang, "Save to Dashboard", "Simpan ke Dasbor")}
            </button>
          </div>
        </div>
      </div>

      {/* ─── INTRODUCTION ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "64px 24px 0" }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, color: BODY_TEXT, lineHeight: 1.85, marginBottom: 32 }}>
          {L(lang,
            "Most people move through their teams, partnerships, and workdays operating on a set of assumptions about time that feel so obvious — so self-evident — that they have never once considered those assumptions might be cultural. This module changes that. You will discover your own time orientation, learn the four logics that researchers have mapped across cultures, and then compare your result with how the culture you work with most closely experiences time.",
            "Kebanyakan orang bergerak melalui tim, kemitraan, dan hari kerja mereka beroperasi pada sekumpulan asumsi tentang waktu yang terasa begitu jelas — begitu terbukti dengan sendirinya — sehingga mereka tidak pernah sekalipun mempertimbangkan bahwa asumsi tersebut mungkin bersifat budaya. Modul ini mengubah itu. Kamu akan menemukan orientasi waktumu sendiri, mempelajari empat logika yang telah dipetakan peneliti di berbagai budaya, lalu membandingkan hasilmu dengan bagaimana budaya yang paling sering kamu jalani merasakan waktu."
          )}
        </p>

        {/* Learning Outcomes */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 48, background: LIGHT_GRAY, borderRadius: 10, padding: "1.5rem 1.75rem" }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700, color: NAVY, margin: "0 0 12px" }}>
            {L(lang, "After this module you will:", "Setelah modul ini kamu akan:")}
          </p>
          {L(lang,
            [
              "Recognize your own time orientation before encountering the full framework.",
              "Identify the four cultural viewpoints on time and their academic roots.",
              "Shift from assuming one right view of time to holding multiple views with understanding.",
            ],
            [
              "Kenali orientasi waktumu sendiri sebelum menemukan kerangka penuh.",
              "Identifikasi empat sudut pandang budaya tentang waktu dan akar akademisnya.",
              "Beralih dari mengasumsikan satu pandangan waktu yang benar ke memiliki beberapa pandangan dengan pemahaman.",
            ]
          ).map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 3, height: 18, background: ORANGE, flexShrink: 0, marginTop: 4 }} />
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: BODY_TEXT, lineHeight: 1.7, margin: 0 }}>
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── UNIFIED QUIZ ARENA ───────────────────────────────────────────── */}
      <div style={{ background: NAVY }}>
        {quizPhase === "part1" && (
          <OneAtATimeQuiz
            questions={part1Questions}
            answers={part1Answers}
            onAnswer={(qIdx, val) => setPart1Answers((prev) => ({ ...prev, [qIdx]: val }))}
            onComplete={() => setQuizPhase("part1-result")}
            partLabel={L(lang, "How do YOU see time?", "Bagaimana KAMU melihat waktu?")}
            partSubtext={L(lang,
              "Read each scenario. Choose the response that feels most natural to you — not the 'right' answer. Not what you think a good leader would do. What you actually feel.",
              "Baca setiap skenario. Pilih respons yang paling natural bagimu — bukan jawaban 'yang benar'. Bukan apa yang menurutmu akan dilakukan pemimpin yang baik. Apa yang benar-benar kamu rasakan."
            )}
            bgColor={NAVY}
            accentColor={ORANGE}
            lang={lang}
          />
        )}

        {quizPhase === "part1-result" && part1Dominant && (
          <div style={{ padding: "48px 24px" }}>
            <div style={{ maxWidth: 780, margin: "0 auto" }}>
              <div style={{ background: "oklch(28% 0.10 260)", borderRadius: 12, padding: "2.5rem", borderTop: `4px solid ${ORANGE}`, marginBottom: 32 }}>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: 16 }}>
                  {L(lang, "Your Result — Part 1", "Hasil Kamu — Bagian 1")}
                </p>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: OFF_WHITE, margin: "0 0 16px", lineHeight: 1.15 }}>
                  {p1TypeNames[part1Dominant]}
                </h2>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, color: "oklch(75% 0.04 260)", lineHeight: 1.75, margin: "0 0 20px" }}>
                  {p1Transitions[part1Dominant]}
                </p>
                <button
                  onClick={() => setShowPart1Detail((v) => !v)}
                  style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700, color: ORANGE, background: "none", border: `1px solid oklch(45% 0.10 45)`, padding: "8px 16px", borderRadius: 12, cursor: "pointer" }}
                >
                  {showPart1Detail ? L(lang, "▲ Less detail", "▲ Lebih sedikit") : L(lang, "▼ Read more about your orientation", "▼ Baca lebih lanjut tentang orientasimu")}
                </button>
                {showPart1Detail && (
                  <div style={{ marginTop: 20, borderTop: "1px solid oklch(35% 0.08 260)", paddingTop: 20 }}>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 700, color: ORANGE, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>
                      {resultBlocks[part1Dominant].label}
                    </p>
                    {resultBlocks[part1Dominant].body.split("\n\n").map((para, i) => (
                      <p key={i} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: "oklch(78% 0.04 260)", lineHeight: 1.8, marginBottom: 12 }}>
                        {para}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ textAlign: "center", paddingBottom: 8 }}>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, fontWeight: 700, color: ORANGE, marginBottom: 20 }}>
                  {L(lang, "Now — what about the culture you work with?", "Sekarang — bagaimana dengan budaya yang kamu jalani?")}
                </p>
                <button
                  onClick={() => setQuizPhase("part2")}
                  style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, fontWeight: 700, color: OFF_WHITE, background: ORANGE, border: "none", padding: "14px 36px", borderRadius: 8, cursor: "pointer" }}
                >
                  {L(lang, "Test Part 2 →", "Coba Bagian 2 →")}
                </button>
              </div>
            </div>
          </div>
        )}

        {quizPhase === "part2" && (
          <OneAtATimeQuiz
            questions={part2Questions}
            answers={part2Answers}
            onAnswer={(qIdx, val) => setPart2Answers((prev) => ({ ...prev, [qIdx]: val }))}
            onComplete={() => setQuizPhase("part2-result")}
            partLabel={L(lang, "How does the culture you work with see time?", "Bagaimana budaya yang kamu jalani melihat waktu?")}
            partSubtext={L(lang,
              "Think of the culture of the team you work with most, or the colleague whose approach to time confuses or frustrates you most. Answer as you observe them — not as you wish they would behave.",
              "Pikirkan budaya dari tim yang paling sering kamu jalani, atau rekan yang pendekatannya terhadap waktu paling membingungkan atau membuatmu frustrasi. Jawab sebagaimana kamu mengamati mereka — bukan sebagaimana kamu berharap mereka berperilaku."
            )}
            bgColor={NAVY}
            accentColor={ORANGE}
            lang={lang}
          />
        )}

        {quizPhase === "part2-result" && part2Dominant && part1Dominant && (
          <div style={{ padding: "48px 24px" }}>
            <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ background: "oklch(28% 0.10 260)", borderRadius: 12, padding: "2.5rem", borderTop: `4px solid ${ORANGE}` }}>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: 16 }}>
                  {L(lang, "Your Result — Part 2", "Hasil Kamu — Bagian 2")}
                </p>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: OFF_WHITE, margin: "0 0 16px", lineHeight: 1.15 }}>
                  {p2TypeNames[part2Dominant]}
                </h2>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, color: "oklch(75% 0.04 260)", lineHeight: 1.75, margin: "0 0 20px" }}>
                  {p2Transitions[part2Dominant]}
                </p>
                <button
                  onClick={() => setShowPart2Detail((v) => !v)}
                  style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700, color: ORANGE, background: "none", border: `1px solid oklch(45% 0.10 45)`, padding: "8px 16px", borderRadius: 12, cursor: "pointer" }}
                >
                  {showPart2Detail ? L(lang, "▲ Less detail", "▲ Lebih sedikit") : L(lang, "▼ Read more about this orientation", "▼ Baca lebih lanjut tentang orientasi ini")}
                </button>
                {showPart2Detail && (
                  <div style={{ marginTop: 20, borderTop: "1px solid oklch(35% 0.08 260)", paddingTop: 20 }}>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 700, color: ORANGE, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>
                      {resultBlocks[part2Dominant].label}
                    </p>
                    {resultBlocks[part2Dominant].body.split("\n\n").map((para, i) => (
                      <p key={i} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: "oklch(78% 0.04 260)", lineHeight: 1.8, marginBottom: 12 }}>
                        {para}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ background: "oklch(28% 0.10 260)", borderRadius: 12, padding: "2.5rem", borderTop: `4px solid ${ORANGE}` }}>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: 16 }}>
                  {L(lang, "Gap Analysis — Part 1 vs Part 2", "Analisis Kesenjangan — Bagian 1 vs Bagian 2")}
                </p>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 24 }}>
                  <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700, color: OFF_WHITE, background: ORANGE, padding: "5px 14px", borderRadius: 20 }}>
                    {L(lang, "You: ", "Kamu: ")}{typeShort[part1Dominant]}
                  </span>
                  <span style={{ color: "oklch(55% 0.04 260)", fontSize: 20 }}>↔</span>
                  <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700, color: ORANGE, border: `1px solid ${ORANGE}`, padding: "5px 14px", borderRadius: 20 }}>
                    {L(lang, "Culture: ", "Budaya: ")}{typeShort[part2Dominant]}
                  </span>
                </div>
                {isMatched ? (
                  <>
                    <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 18, fontWeight: 800, color: OFF_WHITE, margin: "0 0 16px" }}>
                      {L(lang, "Your orientation and the culture you work with appear to be aligned.", "Orientasimu dan budaya yang kamu jalani tampaknya selaras.")}
                    </h3>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, color: "oklch(75% 0.04 260)", lineHeight: 1.8 }}>
                      {L(lang,
                        "Shared logic can be a real gift. When a team runs on the same orientation, coordination is faster, conflict is rarer, and trust builds quickly. That is worth acknowledging. But alignment within your team is not the same as competence across cultures. The question now is whether you can recognize the other three logics when they appear — in a partner organization, a donor, a local leader, a colleague from a different background. You know your own logic well. The next step is developing fluency in the others: not to adopt them, but to read them without judgment, engage them without friction, and lead across the difference without assuming your logic is the default.",
                        "Logika yang sama bisa menjadi anugerah nyata. Ketika tim berjalan dengan orientasi yang sama, koordinasi lebih cepat, konflik lebih jarang, dan kepercayaan dibangun dengan cepat. Itu layak untuk diakui. Tapi keselarasan di dalam tim kamu tidak sama dengan kompetensi lintas budaya. Pertanyaannya sekarang adalah apakah kamu bisa mengenali tiga logika lainnya ketika mereka muncul — dalam organisasi mitra, donor, pemimpin lokal, rekan dari latar belakang yang berbeda. Kamu mengenal logikamu sendiri dengan baik. Langkah berikutnya adalah mengembangkan kefasihan pada yang lain: bukan untuk mengadopsinya, tapi untuk membacanya tanpa penilaian, terlibat dengannya tanpa gesekan, dan memimpin melewati perbedaan tanpa menganggap logikamu adalah standar bawaan."
                      )}
                    </p>
                  </>
                ) : gapKey && gapBlocks[gapKey] ? (
                  <>
                    <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 18, fontWeight: 800, color: OFF_WHITE, margin: "0 0 16px" }}>
                      {gapBlocks[gapKey].title}
                    </h3>
                    {gapBlocks[gapKey].body.split("\n\n").map((para, i) => (
                      <p key={i} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, color: "oklch(75% 0.04 260)", lineHeight: 1.8, marginBottom: 12 }}>
                        {para}
                      </p>
                    ))}
                  </>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── THE FREEDOM ──────────────────────────────────────────────────── */}
      <div style={{ background: OFF_WHITE, padding: "96px 24px 64px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: 20 }}>
            {L(lang, "The Freedom", "Kebebasan")}
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, fontWeight: 700, color: NAVY, lineHeight: 1.85, marginBottom: 16 }}>
            {L(lang, "Leaders who understand all the dimensions of time are controlled by none of them.", "Para pemimpin yang memahami semua dimensi waktu tidak dikendalikan oleh satu pun dari mereka.")}
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, color: BODY_TEXT, lineHeight: 1.85, marginBottom: 16 }}>
            {L(lang,
              "Most leaders are controlled by time — not because they are bad at managing it, but because they only know one logic. If you only know Clock Keeper logic, you will be driven by urgency and you will read every deviation as failure. If you only know Relationship Weaver logic, you will be drained by the invisible expectations of colleagues who run on monochronic assumptions and never tell you directly.",
              "Sebagian besar pemimpin dikendalikan oleh waktu — bukan karena mereka buruk dalam mengelolanya, tapi karena mereka hanya mengenal satu logika. Jika kamu hanya mengenal logika Penjaga Jam, kamu akan digerakkan oleh urgensi dan kamu akan membaca setiap penyimpangan sebagai kegagalan. Jika kamu hanya mengenal logika Penenun Relasi, kamu akan terkuras oleh ekspektasi tak terlihat dari rekan yang beroperasi dengan asumsi monochronic dan tidak pernah memberitahumu secara langsung."
            )}
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, color: BODY_TEXT, lineHeight: 1.85, marginBottom: 16 }}>
            {L(lang,
              "Understanding multiple logics does not mean adopting them all equally. It means you can see what is happening in the room before it becomes a conflict. You can name it. You can create space for the team to navigate it together. You can stop the fracture before it forms. That is not better time management. That is situational awareness — and situational awareness is what separates a leader who reacts to their team from a leader who reads their team.",
              "Memahami beberapa logika tidak berarti mengadopsi semuanya secara setara. Artinya kamu bisa melihat apa yang terjadi di ruangan sebelum menjadi konflik. Kamu bisa menamakannya. Kamu bisa menciptakan ruang bagi tim untuk menavigasinya bersama. Kamu bisa menghentikan perpecahan sebelum terbentuk. Itu bukan manajemen waktu yang lebih baik. Itu adalah kesadaran situasional — dan kesadaran situasional itulah yang memisahkan pemimpin yang bereaksi terhadap timnya dari pemimpin yang membaca timnya."
            )}
          </p>
        </div>
      </div>

      {/* ─── THE FEELING ──────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 48px" }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, margin: "48px 0 20px" }}>
          {L(lang, "The Feeling", "Perasaan")}
        </p>

        {/* Watch image */}
        <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 32, maxHeight: 340 }}>
          <img
            src="/images/time-and-culture/feeling-watch.jpg"
            alt="A watch in warm afternoon light — time as a felt experience"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>

        <ElapsedTimer lang={lang} />

        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, color: BODY_TEXT, lineHeight: 1.85, marginBottom: 16 }}>
          {L(lang,
            "Time does not just pass. For many people, time presses. It follows them into meetings, sits with them during conversations, and creates an anxiety so familiar they mistake it for personality. But the experience of being controlled by time is not universal. It is not natural. It is cultural.",
            "Waktu tidak sekadar berlalu. Bagi banyak orang, waktu menekan. Ia mengikuti mereka ke rapat, duduk bersama mereka selama percakapan, dan menciptakan kecemasan yang begitu familiar sehingga mereka salah mengira itu sebagai kepribadian. Tapi pengalaman dikendalikan oleh waktu tidaklah universal. Ini bukan kodrat. Ini budaya."
          )}
        </p>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, color: BODY_TEXT, lineHeight: 1.85, marginBottom: 16 }}>
          {L(lang,
            "Depending on where you were shaped, time feels entirely different. For the Clock Keeper, it is a resource being spent or wasted. For the Relationship Weaver, it belongs to the person in front of them. For the Harmony Follower, it is a signal to read before moving. For the Community Keeper, it is a communal rhythm that simply is what it is. Each of these produces its own emotional register. And each one, held alone, creates its own vulnerability. The Clock Keeper chases deadlines. The Relationship Weaver is blindsided by logistics. The Harmony Follower stalls when hierarchy is absent. The Community Keeper is quietly excluded from high-stakes coordination because the team has stopped trusting their timeline.",
            "Tergantung di mana kamu dibentuk, waktu terasa sangat berbeda. Bagi Penjaga Jam, itu adalah sumber daya yang dibelanjakan atau disia-siakan. Bagi Penenun Relasi, itu milik orang yang ada di hadapannya. Bagi Pengikut Harmoni, itu adalah sinyal yang harus dibaca sebelum bergerak. Bagi Penjaga Komunitas, itu adalah ritme komunal yang memang apa adanya. Masing-masing dari ini menghasilkan register emosionalnya sendiri. Dan masing-masing, dipegang sendiri, menciptakan kerentanannya sendiri. Penjaga Jam mengejar tenggat. Penenun Relasi terkejut oleh logistik. Pengikut Harmoni terhenti ketika hierarki tidak hadir. Penjaga Komunitas secara diam-diam dikecualikan dari koordinasi berisiko tinggi karena tim telah berhenti mempercayai garis waktu mereka."
          )}
        </p>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, color: BODY_TEXT, lineHeight: 1.85, marginBottom: 16 }}>
          {L(lang,
            "The leader who understands all four perceptions of time is no longer controlled by the one they inherited. They can see what is happening in the room before it becomes a conflict. They can name it. They can hold the pace that the moment requires rather than the pace their background defaults to. That is not better time management. That is the beginning of real cultural fluency.",
            "Pemimpin yang memahami keempat persepsi waktu tidak lagi dikendalikan oleh satu yang mereka warisi. Mereka bisa melihat apa yang terjadi di ruangan sebelum menjadi konflik. Mereka bisa menamakannya. Mereka bisa memegang tempo yang dibutuhkan momen itu alih-alih tempo yang menjadi bawaan latar belakang mereka. Itu bukan manajemen waktu yang lebih baik. Itu adalah awal dari kefasihan budaya yang sesungguhnya."
          )}
        </p>
      </div>

      {/* ─── FIELD STORY ──────────────────────────────────────────────────── */}
      <div style={{ background: LIGHT_GRAY, padding: "0 0 48px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "48px 24px 0" }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: 20 }}>
            {L(lang, "Field Story", "Cerita Lapangan")}
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, color: BODY_TEXT, lineHeight: 1.85, marginBottom: 24 }}>
            {L(lang,
              "You have a time logic. Most people never discover this. They move through their days and their teams and their partnerships operating on assumptions about time that feel so obvious, so self-evident, that they have never once considered those assumptions might be cultural. The moment you step into a cross-cultural team, or lead across organizational lines, these invisible assumptions start to collide — and without the vocabulary to name what is happening, the collision reads as a character problem rather than a logic problem.",
              "Kamu memiliki logika waktu. Kebanyakan orang tidak pernah menyadari ini. Mereka bergerak melalui hari-hari, tim, dan kemitraan mereka beroperasi pada asumsi tentang waktu yang terasa begitu jelas, begitu terbukti dengan sendirinya, sehingga mereka tidak pernah sekalipun mempertimbangkan bahwa asumsi tersebut mungkin bersifat budaya. Ketika kamu masuk ke tim lintas budaya, atau memimpin melewati batas organisasi, asumsi tak terlihat ini mulai bertabrakan — dan tanpa kosakata untuk menamai apa yang terjadi, tabrakan itu terbaca sebagai masalah karakter, bukan masalah logika."
            )}
          </p>

          {/* Field story block */}
          <div style={{ borderLeft: `4px solid ${NAVY}`, background: OFF_WHITE, padding: "2rem", marginTop: 24, borderRadius: "0 8px 8px 0" }}>
            {L(lang,
              [
                "An Indonesian team leader was hosting a visiting leader from overseas. He knew the visitor valued punctuality, so the day before the meeting he made a point of addressing his team directly. 'Tomorrow,' he said, 'I need everyone here on time. This matters.'",
                "His team heard him. They took it seriously. The next morning, people began arriving early. By eight fifty, most of the group was seated and ready. At eight fifty-five, someone suggested they begin. The discussion was already underway when the visiting leader walked in at exactly nine o'clock.",
                "He stopped in the doorway. The meeting had started without him. He felt the sting of it immediately. After all his travel, after the relationship they had been building, this team had started before he arrived. It felt like a clear signal: he was not the priority.",
                "But here is what had actually happened. The Indonesian leader had honored his guest's value by rallying his team. The team had honored their leader by arriving early and being ready. The visiting leader had honored the agreed time by arriving at exactly nine. Three different expressions of respect. Three different time logics running in the same room. And no shared language to make sense of any of it. Nobody was wrong. That is the point.",
              ],
              [
                "Seorang pemimpin tim Indonesia menjamu seorang pemimpin tamu dari luar negeri. Ia tahu tamunya sangat menghargai ketepatan waktu, jadi sehari sebelum pertemuan ia secara khusus berbicara langsung kepada timnya. 'Besok,' katanya, 'saya perlu semua orang di sini tepat waktu. Ini penting.'",
                "Timnya mendengarnya. Mereka menganggapnya serius. Keesokan paginya, orang-orang mulai tiba lebih awal. Pada jam delapan lima puluh, sebagian besar kelompok sudah duduk dan siap. Pada jam delapan lima puluh lima, seseorang menyarankan mereka mulai. Diskusi sudah berlangsung ketika pemimpin tamu masuk tepat jam sembilan.",
                "Ia berhenti di depan pintu. Rapat telah dimulai tanpanya. Ia langsung merasakan kepedihan itu. Setelah semua perjalanannya, setelah hubungan yang telah mereka bangun, tim ini memulai sebelum ia tiba. Baginya ini seperti sinyal yang jelas: ia bukan prioritas.",
                "Tapi inilah yang sebenarnya terjadi. Pemimpin Indonesia menghormati nilai tamunya dengan mengerahkan timnya. Tim menghormati pemimpin mereka dengan tiba lebih awal dan siap. Pemimpin tamu menghormati waktu yang disepakati dengan tiba tepat jam sembilan. Tiga ekspresi penghormatan yang berbeda. Tiga logika waktu yang berbeda berjalan di ruangan yang sama. Dan tidak ada bahasa bersama untuk memahami semua ini. Tidak ada yang salah. Itulah intinya.",
              ]
            ).map((para, i) => (
              <p key={i} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: BODY_TEXT, lineHeight: 1.85, marginBottom: 12, fontStyle: "italic" }}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* ─── THE FOUR GRAMMARS ────────────────────────────────────────────── */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "64px 24px 48px" }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: 20 }}>
          {L(lang, "The Four Logics", "Empat Logika")}
        </p>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, color: BODY_TEXT, lineHeight: 1.85, marginBottom: 16 }}>
          {L(lang,
            "There are four ways that people around the world primarily relate to time. Researchers have mapped them across cultures, given them names, and traced their consequences through decades of cross-cultural leadership studies. Each one has internal logic. Each one has strengths. Each one has costs — and those costs matter most when it encounters a different logic and nobody names what is happening.",
            "Ada empat cara utama orang di seluruh dunia berhubungan dengan waktu. Para peneliti telah memetakannya di berbagai budaya, memberi mereka nama, dan melacak konsekuensinya melalui puluhan tahun studi kepemimpinan lintas budaya. Masing-masing memiliki logika internal. Masing-masing memiliki kekuatan. Masing-masing memiliki biaya — dan biaya-biaya itu paling penting ketika bertemu logika berbeda dan tidak ada yang menamakannya."
          )}
        </p>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, color: BODY_TEXT, lineHeight: 1.85, marginBottom: 32 }}>
          {L(lang,
            "Read each one as you would read the internal logic of a language you are learning. You are not going to read these and conclude that one is right and the others are wrong — that reflex is the exact thing this module is here to interrupt. The goal is not to adopt a new logic. The goal is to recognize which one is running in the room.",
            "Baca masing-masing seperti kamu membaca logika internal sebuah bahasa yang sedang kamu pelajari. Kamu tidak akan membaca ini dan menyimpulkan bahwa satu yang benar dan yang lainnya salah — refleks itu adalah hal yang tepat yang ingin diinterupsi modul ini. Tujuannya bukan untuk mengadopsi logika baru. Tujuannya adalah mengenali logika mana yang sedang berjalan di ruangan."
          )}
        </p>

        {/* 2×2 concept card grid */}
        <div className="concept-card-grid" style={{ display: "grid", gap: 20, marginTop: 32 }}>
          {conceptCards.map((card, i) => (
            <ConceptCard
              key={i}
              card={card}
              expanded={expandedCard === i}
              onToggle={() => setExpandedCard(expandedCard === i ? null : i)}
              lang={lang}
            />
          ))}
        </div>
      </div>

      {/* ─── QUOTE HIGHLIGHT 1 ────────────────────────────────────────────── */}
      <div style={{ background: LIGHT_GRAY, padding: "56px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontStyle: "italic", color: NAVY, lineHeight: 1.65, marginBottom: 16 }}>
            {L(lang,
              "“Cultures that organize around events and communal presence may, in their own way, be practicing a rhythm of time that productivity-oriented cultures have largely lost. The willingness to wait for the right moment, the insistence that time belongs to the people and not the schedule, echoes something that runs through the biblical tradition far more than most Western organizational models would suggest.”",
              "“Budaya yang mengatur diri di sekitar peristiwa dan kehadiran komunal mungkin, dengan cara mereka sendiri, sedang mempraktikkan ritme waktu yang sebagian besar telah hilang dari budaya berorientasi produktivitas. Kesediaan untuk menunggu momen yang tepat, desakan bahwa waktu milik orang-orang dan bukan jadwal, menggemakan sesuatu yang mengalir melalui tradisi Alkitab jauh lebih dalam daripada yang disarankan oleh sebagian besar model organisasi Barat.”"
            )}
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: BODY_TEXT }}>
            {L(lang,
              "Paraphrased from academic literature on temporal orientation and cultural hermeneutics, including scholarly work on chronos/kairos theology and cross-cultural time frameworks.",
              "Diparafrasekan dari literatur akademis tentang orientasi temporal dan hermeneutika budaya, termasuk karya ilmiah tentang teologi kronos/kairos dan kerangka waktu lintas budaya."
            )}
          </p>
        </div>
      </div>

      {/* ─── FAITH ANCHOR ─────────────────────────────────────────────────── */}
      <div style={{ background: OFF_WHITE, padding: "64px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: 20 }}>
            {L(lang, "Faith Anchor", "Jangkar Iman")}
          </p>
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 800, color: NAVY, margin: "0 0 32px", lineHeight: 1.2 }}>
            {L(lang, "Two Ways God Relates to Time", "Dua Cara Allah Berhubungan dengan Waktu")}
          </h2>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, color: BODY_TEXT, lineHeight: 1.85, marginBottom: 16 }}>
            {L(lang,
              "There is a verse in Ecclesiastes that most people know and almost nobody fully inhabits.",
              "Ada sebuah ayat dalam Pengkhotbah yang dikenal banyak orang dan hampir tidak ada yang benar-benar menghidupinya sepenuhnya."
            )}
          </p>
          <blockquote style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontStyle: "italic", color: NAVY, lineHeight: 1.65, borderLeft: `4px solid ${ORANGE}`, paddingLeft: "1.5rem", margin: "24px 0" }}>
            {L(lang,
              '"There is a time for everything, and a season for every activity under the heavens." (Ecclesiastes 3:1, NIV)',
              '"Ada waktu untuk segala sesuatu, dan ada masa untuk setiap maksud di bawah langit." (Pengkhotbah 3:1, TB)'
            )}
          </blockquote>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, color: BODY_TEXT, lineHeight: 1.85, marginBottom: 16 }}>
            {L(lang,
              "We quote it when we need patience. But the verse is doing something more structural than that. It is saying that God did not design a single rhythm for all things. Diversity of timing is built into the created order. The farmer does not plant when the builder builds. The mourner does not sing when the dancer dances. Different purposes require different times, and wisdom is knowing which time you are in. Then there is a verse in Galatians that speaks at a different level.",
              "Kita mengutipnya ketika membutuhkan kesabaran. Tapi ayat ini melakukan sesuatu yang lebih struktural dari itu. Ayat ini mengatakan bahwa Allah tidak merancang satu ritme untuk segala sesuatu. Keragaman waktu sudah ada dalam tatanan ciptaan. Petani tidak menanam saat pembangun membangun. Orang yang berduka tidak bernyanyi saat orang menari. Tujuan yang berbeda membutuhkan waktu yang berbeda, dan kebijaksanaan adalah mengetahui waktu mana yang sedang kamu jalani. Kemudian ada sebuah ayat dalam Galatia yang berbicara pada level yang berbeda."
            )}
          </p>
          <blockquote style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontStyle: "italic", color: NAVY, lineHeight: 1.65, borderLeft: `4px solid ${ORANGE}`, paddingLeft: "1.5rem", margin: "24px 0" }}>
            {L(lang,
              '"But when the time had fully come, God sent his Son." (Galatians 4:4, NIV)',
              '"Tetapi setelah genap waktunya, Allah mengutus Anak-Nya." (Galatia 4:4, TB)'
            )}
          </blockquote>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, color: BODY_TEXT, lineHeight: 1.85, marginBottom: 16 }}>
            {L(lang,
              "Theologians call this kairos. Not chronos, the sequential ticking of clock-time, but kairos, the appointed moment. It was not rushing toward its target. It was not managed into readiness. It arrived when everything that needed to be in place was in place, and not a moment before. These two dimensions of time — chronos and kairos — are not in competition. They are both real. Cross-cultural teams that only know chronos may be missing the dimension of time that is most needed for deep and lasting work.",
              "Para teolog menyebut ini kairos. Bukan chronos — ketukan berurutan dari waktu jam — tapi kairos, momen yang telah ditetapkan. Itu tidak bergegas menuju targetnya. Itu tidak dikelola menjadi kesiapan. Itu tiba ketika segala sesuatu yang perlu ada sudah ada, dan tidak sedetik sebelumnya. Dua dimensi waktu ini — chronos dan kairos — tidak bersaing. Keduanya nyata. Tim lintas budaya yang hanya mengenal chronos mungkin kehilangan dimensi waktu yang paling dibutuhkan untuk pekerjaan yang dalam dan bertahan lama."
            )}
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, color: BODY_TEXT, lineHeight: 1.85, marginBottom: 16 }}>
            {L(lang,
              "Your own time orientation is not wrong. But every orientation, taken alone, is incomplete. The Clock Keeper needs the kairos reminder that not everything that matters can be scheduled. The Community Keeper needs the chronos reminder that other people's commitments are real. The Relationship Weaver needs the Ecclesiastes reminder that seasons end and new ones must begin. The Harmony Follower needs the reminder that some things require a clear decision regardless of who is in the room. The goal is not better time management. The goal is ministry readiness. Our task is not to make things happen on our timeline. It is to stay ready for when God moves.",
              "Orientasi waktumu sendiri tidak salah. Tapi setiap orientasi, diambil sendiri, tidak lengkap. Penjaga Jam membutuhkan pengingat kairos bahwa tidak semua yang penting bisa dijadwalkan. Penjaga Komunitas membutuhkan pengingat chronos bahwa komitmen orang lain itu nyata. Penenun Relasi membutuhkan pengingat Pengkhotbah bahwa musim berakhir dan musim baru harus dimulai. Pengikut Harmoni membutuhkan pengingat bahwa beberapa hal membutuhkan keputusan yang jelas terlepas dari siapa yang ada di ruangan. Tujuannya bukan manajemen waktu yang lebih baik. Tujuannya adalah kesiapan pelayanan. Tugas kita bukan membuat sesuatu terjadi sesuai garis waktu kita. Ini adalah untuk tetap siap ketika Allah bergerak."
            )}
          </p>
        </div>
      </div>

      {/* ─── TEAM EXERCISE ────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 64px" }}>
        <TeamExercise lang={lang} />
      </div>

      {/* ─── KEY TAKEAWAY ─────────────────────────────────────────────────── */}
      <div style={{ background: OFF_WHITE, borderTop: `3px solid ${ORANGE}`, padding: "clamp(56px, 7vw, 80px) 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ORANGE, marginBottom: 12 }}>
            {L(lang, "Key Takeaway", "Poin Utama")}
          </p>
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 800, color: NAVY, marginBottom: 32 }}>
            {L(lang, "Three things to carry forward", "Tiga hal untuk dibawa maju")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {L(lang,
              [
                {
                  heading: "You have a time logic, and it shapes everything.",
                  body: "Before this module, your experience of time may have felt like common sense. Now you can see it as a cultural orientation, one with real strengths and real blind spots. Naming your own logic is the first act of cross-cultural leadership with time.",
                },
                {
                  heading: "Other people's time logics are not problems to fix.",
                  body: "Every orientation in this module has internal logic and real value. The Clock Keeper's reliability matters. The Relationship Weaver's depth matters. The Harmony Follower's contextual intelligence matters. The Community Keeper's presence-based wisdom matters. The work is not to rank these but to recognize them without flinching.",
                },
                {
                  heading: "The leader who sees the logic gap forming can stop it before it fractures.",
                  body: "This is the shift this module is building toward: not knowledge, but situational awareness. You now have the language to see the moment forming in a meeting, name what is happening, and create space for the team to navigate it together. That skill, used once, can change the culture of a team. Used consistently, it marks the difference between a team that tolerates difference and a team that draws strength from it.",
                },
              ],
              [
                {
                  heading: "Kamu memiliki logika waktu, dan itu membentuk segalanya.",
                  body: "Sebelum modul ini, pengalamanmu tentang waktu mungkin terasa seperti akal sehat. Sekarang kamu bisa melihatnya sebagai orientasi budaya — salah satu dengan kekuatan nyata dan titik buta nyata. Menamai logikamu sendiri adalah tindakan pertama kepemimpinan lintas budaya dengan waktu.",
                },
                {
                  heading: "Logika waktu orang lain bukan masalah yang harus diselesaikan.",
                  body: "Setiap orientasi dalam modul ini memiliki logika internal dan nilai nyata. Keandalan Penjaga Jam itu penting. Kedalaman Penenun Relasi itu penting. Kecerdasan kontekstual Pengikut Harmoni itu penting. Kebijaksanaan berbasis kehadiran Penjaga Komunitas itu penting. Pekerjaan bukan untuk mengurutkan ini tapi untuk mengenalinya tanpa gemetar.",
                },
                {
                  heading: "Pemimpin yang melihat kesenjangan logika yang terbentuk bisa menghentikannya sebelum retak.",
                  body: "Inilah pergeseran yang sedang dibangun modul ini: bukan pengetahuan, tapi kesadaran situasional. Kamu sekarang memiliki bahasa untuk melihat momen yang terbentuk dalam rapat, menamai apa yang terjadi, dan menciptakan ruang bagi tim untuk menavigasinya bersama. Keterampilan itu, digunakan sekali, bisa mengubah budaya tim. Digunakan secara konsisten, itu menandai perbedaan antara tim yang menoleransi perbedaan dan tim yang mengambil kekuatan darinya.",
                },
              ]
            ).map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "20px 24px", background: LIGHT_GRAY, borderLeft: `3px solid ${ORANGE}`, borderRadius: 8 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, fontWeight: 700, color: NAVY, margin: "0 0 6px" }}>
                    {item.heading}
                  </p>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: BODY_TEXT, lineHeight: 1.75, margin: 0 }}>
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── SOURCES ──────────────────────────────────────────────────────── */}
      <div style={{ background: LIGHT_GRAY, padding: "40px 24px 48px", borderTop: `1px solid oklch(88% 0.008 80)` }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: BODY_TEXT, marginBottom: 16 }}>
            {L(lang, "Academic Roots", "Akar Akademis")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              "Edward T. Hall — The Silent Language (1959); The Dance of Life (1983). Source of monochronic and polychronic time frameworks.",
              "Richard Lewis — When Cultures Collide (1996). Source of Linear-Active and Reactive time orientations.",
              "John Mbiti — African Religions and Philosophy (1969). Source of the Sasa/Zamani temporal framework.",
              "Richard Brislin — Cross-cultural psychology research (2003). Source of clock-time vs. event-time distinction.",
              "Scripture quotations from the New International Version (NIV). Holy Bible, NIV® © 1973, 1978, 1984, 2011 by Biblica, Inc.®",
            ].map((source, i) => (
              <p key={i} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: BODY_TEXT, lineHeight: 1.7, margin: 0 }}>
                {source}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* ─── LONG-FORM SEO SECTION ──────────────────────────────────────────── */}
      <div style={{ background: LIGHT_GRAY, padding: "clamp(64px, 9vw, 88px) 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ORANGE, marginBottom: 12 }}>
            {L(lang, "Background", "Latar Belakang")}
          </p>
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(22px, 2.8vw, 32px)", fontWeight: 800, color: NAVY, marginBottom: 16, lineHeight: 1.2 }}>
            {L(lang, "The Research Behind the Framework", "Penelitian di Balik Kerangka Ini")}
          </h2>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(14px, 1.5vw, 17px)", color: BODY_TEXT, lineHeight: 1.75, marginBottom: 0 }}>
            {L(lang,
              "From Edward Hall to John Mbiti — the scholarship and theology behind why the four time types are not just cultural preferences, but deeply encoded ways of experiencing reality.",
              "Dari Edward Hall hingga John Mbiti — ilmu pengetahuan dan teologi di balik mengapa empat tipe waktu bukan sekadar preferensi budaya, melainkan cara mengalami realitas yang tertanam jauh dalam."
            )}
          </p>
          <button
            onClick={() => setBgOpen(!bgOpen)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              marginTop: 24, padding: "10px 20px",
              background: "transparent", border: `1.5px solid ${ORANGE}`,
              color: ORANGE, borderRadius: 12,
              fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700,
              cursor: "pointer", letterSpacing: "0.04em",
            }}
          >
            {bgOpen
              ? L(lang, "Close ↑", "Tutup ↑")
              : L(lang, "Read the research →", "Baca penelitiannya →")}
          </button>

          {bgOpen && (
            <div style={{ marginTop: 40 }}>
              <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(15px, 1.8vw, 18px)", fontWeight: 700, color: NAVY, marginBottom: 12, marginTop: 0 }}>
                {L(lang, "Why Time Looks Like Character", "Mengapa Waktu Terlihat Seperti Karakter")}
              </h3>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(14px, 1.5vw, 16px)", color: BODY_TEXT, lineHeight: 1.85, marginBottom: 36 }}>
                {L(lang,
                  "When a meeting starts late, a deadline moves without discussion, or a colleague seems genuinely unbothered by what you consider a broken commitment, most leaders reach for one of two explanations: the person is unreliable, or the culture is disorganized. Both explanations are wrong. What is actually happening is a collision between two different time orientations - two internally coherent logics for how time works, what it is for, and who it belongs to. Until a leader has language for this, every cross-cultural friction around time gets misread as a character problem.",
                  "Ketika sebuah rapat dimulai terlambat, tenggat waktu bergeser tanpa diskusi, atau seorang kolega tampak benar-benar tidak terganggu oleh apa yang Anda anggap sebagai komitmen yang dilanggar, sebagian besar pemimpin mencapai satu dari dua penjelasan: orang itu tidak dapat diandalkan, atau budayanya tidak terorganisir. Kedua penjelasan itu salah. Yang sebenarnya terjadi adalah tabrakan antara dua orientasi waktu yang berbeda - dua logika yang secara internal koheren tentang bagaimana waktu bekerja, untuk apa waktu itu, dan kepada siapa waktu itu dimiliki. Sampai seorang pemimpin memiliki bahasa untuk ini, setiap gesekan lintas budaya seputar waktu akan dibaca sebagai masalah karakter."
                )}
              </p>

              <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(15px, 1.8vw, 18px)", fontWeight: 700, color: NAVY, marginBottom: 12, marginTop: 0 }}>
                {L(lang, "Hall: Monochronic and Polychronic Time", "Hall: Waktu Monokronik dan Polikronik")}
              </h3>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(14px, 1.5vw, 16px)", color: BODY_TEXT, lineHeight: 1.85, marginBottom: 36 }}>
                {L(lang,
                  "The academic foundation for this comes primarily from Edward T. Hall, the American anthropologist whose 1959 book The Silent Language introduced the distinction between monochronic and polychronic time. Hall observed that in monochronic cultures, time is treated as a finite, linear resource that can be allocated, scheduled, and spent. Tasks are completed sequentially. Commitments to a specific time carry the force of a promise. In polychronic cultures, time is experienced as fluid and relational. Multiple things happen simultaneously. The person in front of you takes precedence over the clock. The meeting ends when the matter is resolved relationally, not when the scheduled hour expires. Hall expanded this framework in The Dance of Life (1983), arguing that these orientations are not preferences but deeply encoded cultural grammars - absorbed through childhood, reinforced through community, and largely invisible to the people who hold them.",
                  "Dasar akademis untuk ini terutama berasal dari Edward T. Hall, antropolog Amerika yang bukunya tahun 1959 The Silent Language memperkenalkan perbedaan antara waktu monokronik dan polikronik. Hall mengamati bahwa dalam budaya monokronik, waktu diperlakukan sebagai sumber daya yang terbatas dan linier yang dapat dialokasikan, dijadwalkan, dan dihabiskan. Tugas diselesaikan secara berurutan. Komitmen pada waktu tertentu membawa kekuatan sebuah janji. Dalam budaya polikronik, waktu dialami sebagai cair dan relasional. Banyak hal terjadi secara bersamaan. Orang di depan Anda lebih diutamakan daripada jam. Rapat berakhir ketika masalah diselesaikan secara relasional, bukan ketika jam yang dijadwalkan berakhir. Hall memperluas kerangka ini dalam The Dance of Life (1983), berargumen bahwa orientasi ini bukan preferensi tetapi tata bahasa budaya yang tertanam dalam - diserap melalui masa kanak-kanak, diperkuat melalui komunitas, dan sebagian besar tidak terlihat oleh orang-orang yang memegangnya."
                )}
              </p>

              <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(15px, 1.8vw, 18px)", fontWeight: 700, color: NAVY, marginBottom: 12, marginTop: 0 }}>
                {L(lang, "Lewis: Reactive Time", "Lewis: Waktu Reaktif")}
              </h3>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(14px, 1.5vw, 16px)", color: BODY_TEXT, lineHeight: 1.85, marginBottom: 36 }}>
                {L(lang,
                  "Richard Lewis, writing in When Cultures Collide (1996), added a third category that Hall’s binary did not fully capture: what Lewis called Reactive time. In reactive cultures, particularly across much of East Asia, punctuality and relational warmth are both valued, but the weight given to each shifts depending on context, hierarchy, and who is present. This is not inconsistency. It is a contextual intelligence that reads the room before deciding which logic applies. A leader who appears punctual with senior figures but relaxed with peers is not being inconsistent. They are operating on a different set of rules, one that is as internally coherent as monochronic scheduling.",
                  "Richard Lewis, menulis dalam When Cultures Collide (1996), menambahkan kategori ketiga yang tidak sepenuhnya ditangkap oleh biner Hall: apa yang Lewis sebut sebagai waktu Reaktif. Dalam budaya reaktif, terutama di sebagian besar Asia Timur, ketepatan waktu dan kehangatan relasional keduanya dihargai, tetapi bobot yang diberikan pada masing-masing bergeser tergantung pada konteks, hierarki, dan siapa yang hadir. Ini bukan inkonsistensi. Ini adalah kecerdasan kontekstual yang membaca suasana sebelum memutuskan logika mana yang berlaku. Seorang pemimpin yang tampak tepat waktu dengan tokoh senior tetapi santai dengan rekan-rekan tidak sedang inkonsisten. Mereka beroperasi berdasarkan seperangkat aturan yang berbeda, yang sama-sama koheren secara internal seperti penjadwalan monokronik."
                )}
              </p>

              <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(15px, 1.8vw, 18px)", fontWeight: 700, color: NAVY, marginBottom: 12, marginTop: 0 }}>
                {L(lang, "Mbiti: Community Time", "Mbiti: Waktu Komunitas")}
              </h3>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(14px, 1.5vw, 16px)", color: BODY_TEXT, lineHeight: 1.85, marginBottom: 36 }}>
                {L(lang,
                  "A fourth framework comes from an entirely different intellectual tradition. John Mbiti, the Kenyan theologian and philosopher, mapped temporal experience in many African cultures through his concept of Sasa and Zamani, developed in African Religions and Philosophy (1969). Mbiti argued that in many sub-Saharan African traditions, time is not primarily experienced as a progression toward a future but as a movement from the present moment (Sasa) back into an ever-expanding past (Zamani). Events become real as they are experienced communally. A meeting begins not when the clock says so but when the community is truly gathered. This framework has direct implications for cross-cultural teams: a Community Keeper orientation is not behind schedule. It is operating on a different definition of when something has started.",
                  "Kerangka keempat berasal dari tradisi intelektual yang sama sekali berbeda. John Mbiti, teolog dan filsuf Kenya, memetakan pengalaman temporal dalam banyak budaya Afrika melalui konsepnya Sasa dan Zamani, yang dikembangkan dalam African Religions and Philosophy (1969). Mbiti berargumen bahwa dalam banyak tradisi Afrika sub-Sahara, waktu tidak terutama dialami sebagai perkembangan menuju masa depan tetapi sebagai gerakan dari momen saat ini (Sasa) kembali ke masa lalu yang terus berkembang (Zamani). Peristiwa menjadi nyata saat dialami secara komunal. Sebuah rapat dimulai bukan ketika jam mengatakan demikian tetapi ketika komunitas benar-benar berkumpul. Kerangka ini memiliki implikasi langsung bagi tim lintas budaya: orientasi Penjaga Komunitas tidak ketinggalan jadwal. Ini beroperasi berdasarkan definisi yang berbeda tentang kapan sesuatu telah dimulai."
                )}
              </p>

              <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(15px, 1.8vw, 18px)", fontWeight: 700, color: NAVY, marginBottom: 12, marginTop: 0 }}>
                {L(lang, "Brislin: Clock-Time and Event-Time", "Brislin: Waktu Jam dan Waktu Peristiwa")}
              </h3>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(14px, 1.5vw, 16px)", color: BODY_TEXT, lineHeight: 1.85, marginBottom: 36 }}>
                {L(lang,
                  "Richard Brislin’s cross-cultural psychology research introduced the practical distinction between clock-time cultures and event-time cultures. Clock-time cultures plan around fixed time points. Event-time cultures plan around when things are ready. These are not simply different habits. They produce different assumptions about what a deadline means, what it means to be late, and what counts as a completed commitment. This framework is particularly useful for teams in development, NGO, and cross-cultural ministry contexts, where event-time cultures are common and clock-time organizational structures are usually imported from Western models.",
                  "Penelitian psikologi lintas budaya Richard Brislin memperkenalkan perbedaan praktis antara budaya waktu-jam dan budaya waktu-peristiwa. Budaya waktu-jam merencanakan di sekitar titik waktu tetap. Budaya waktu-peristiwa merencanakan ketika sesuatu siap. Ini bukan sekadar kebiasaan yang berbeda. Mereka menghasilkan asumsi yang berbeda tentang apa arti tenggat waktu, apa artinya terlambat, dan apa yang dihitung sebagai komitmen yang telah selesai. Kerangka ini sangat berguna untuk tim dalam konteks pembangunan, LSM, dan pelayanan lintas budaya, di mana budaya waktu-peristiwa umum dan struktur organisasi waktu-jam biasanya diimpor dari model Barat."
                )}
              </p>

              <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(15px, 1.8vw, 18px)", fontWeight: 700, color: NAVY, marginBottom: 12, marginTop: 0 }}>
                {L(lang, "What This Means in Practice", "Apa Artinya dalam Praktik")}
              </h3>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(14px, 1.5vw, 16px)", color: BODY_TEXT, lineHeight: 1.85, marginBottom: 36 }}>
                {L(lang,
                  "For cross-cultural leaders - whether managing multicultural teams, running partner organizations across cultural lines, or serving as field workers in contexts different from their own - the practical stakes of this are high. The clock-keeper leader who reads a missed deadline as disrespect will damage relationships that event-time colleagues experienced as intact. The relationship-weaver who does not register the cost of their flexibility on monochronic colleagues will erode trust invisibly. Neither party is aware of what is happening. Both conclude, eventually, that the other is simply difficult. Understanding cultural time orientation as a framework, rather than a set of personal habits, is the first step toward stopping that pattern before it sets.",
                  "Bagi pemimpin lintas budaya - baik mengelola tim multikultural, menjalankan organisasi mitra di seluruh garis budaya, atau melayani sebagai pekerja lapangan di konteks yang berbeda dari milik mereka sendiri - taruhan praktisnya tinggi. Pemimpin Penjaga Jam yang membaca tenggat waktu yang terlewat sebagai ketidakhormatan akan merusak hubungan yang kolega waktu-peristiwa alami sebagai utuh. Penenun Relasi yang tidak menyadari biaya fleksibilitasnya terhadap kolega monokronik akan mengikis kepercayaan secara tidak terlihat. Tidak ada pihak yang menyadari apa yang terjadi. Keduanya menyimpulkan, akhirnya, bahwa pihak lain memang sulit. Memahami orientasi waktu budaya sebagai kerangka, bukan serangkaian kebiasaan pribadi, adalah langkah pertama menuju menghentikan pola itu sebelum mengeras."
                )}
              </p>

              <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(15px, 1.8vw, 18px)", fontWeight: 700, color: NAVY, marginBottom: 12, marginTop: 0 }}>
                {L(lang, "Chronos and Kairos: A Biblical Vocabulary", "Kronos dan Kairos: Kosakata Alkitab")}
              </h3>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(14px, 1.5vw, 16px)", color: BODY_TEXT, lineHeight: 1.85, marginBottom: 36 }}>
                {L(lang,
                  "The Scripture tradition carries its own vocabulary for this. Hebrew and Greek both maintain a distinction between two modes of time that modern organizational culture has largely collapsed into one. Chronos is sequential time: the ticking of minutes, the meeting on the calendar, the deadline in the project plan. Kairos is appointed time: the moment that is qualitatively different from the ones around it, the right time, the season. Ecclesiastes 3:1 operates at the kairos level: ‘There is a time for everything, and a season for every activity under the heavens.’ This is not a verse about time management. It is a structural claim about the diversity of timing built into creation. Not all things happen on the same rhythm. Wisdom is knowing which season you are in. Paul’s statement in Galatians 4:4 is kairos at its most precise: ‘But when the time had fully come, God sent his Son.’ The Incarnation was not scheduled. It arrived when everything that needed to be in place was in place. Cross-cultural leaders who carry this theological frame are not surrendering to vagueness. They are holding both logics at once - the reliability of chronos and the readiness of kairos - and learning to lead from whichever one the moment requires.",
                  "Tradisi Kitab Suci membawa kosakatanya sendiri untuk ini. Ibrani dan Yunani keduanya mempertahankan perbedaan antara dua mode waktu yang budaya organisasi modern sebagian besar telah runtuhkan menjadi satu. Kronos adalah waktu berurutan: detak menit, rapat di kalender, tenggat waktu dalam rencana proyek. Kairos adalah waktu yang ditunjuk: momen yang secara kualitatif berbeda dari yang ada di sekitarnya, waktu yang tepat, musim. Pengkhotbah 3:1 beroperasi di tingkat kairos: ‘Ada waktu untuk segala sesuatu, dan musim untuk setiap kegiatan di bawah langit.’ Ini bukan ayat tentang manajemen waktu. Ini adalah klaim struktural tentang keragaman waktu yang dibangun ke dalam ciptaan. Tidak semua hal terjadi pada irama yang sama. Kebijaksanaan adalah mengetahui musim mana yang sedang Anda jalani. Pernyataan Paulus dalam Galatia 4:4 adalah kairos pada tingkat yang paling tepat: ‘Tetapi ketika waktu telah genap, Allah mengutus Anak-Nya.’ Inkarnasi tidak dijadwalkan. Itu tiba ketika semua yang perlu ada sudah ada. Pemimpin lintas budaya yang membawa kerangka teologis ini tidak menyerah pada ketidakjelasan. Mereka memegang kedua logika sekaligus - keandalan kronos dan kesiapan kairos - dan belajar memimpin dari mana pun yang saat ini membutuhkan."
                )}
              </p>

              <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(15px, 1.8vw, 18px)", fontWeight: 700, color: NAVY, marginBottom: 12, marginTop: 0 }}>
                {L(lang, "Cultural Humility and Trust", "Kerendahan Hati Budaya dan Kepercayaan")}
              </h3>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(14px, 1.5vw, 16px)", color: BODY_TEXT, lineHeight: 1.85, marginBottom: 20 }}>
                {L(lang,
                  <>There is a cultural humility dimension here that goes beyond competency. A leader who has only ever known monochronic logic does not simply lack a skill. They carry an unexamined assumption that their logic is neutral. It does not feel cultural; it feels like professionalism. That invisibility is exactly where the damage gets done. Cultural intelligence begins with this recognition: my own relationship with time is not default, it is shaped. Understanding that your time orientation is one logic among several is closely related to the broader work of cross-cultural humility explored in the <a href="/resources/cultural-intelligence" style={{ color: ORANGE, textDecoration: "underline" }}>Cultural Intelligence module</a>, which maps how cultural assumptions operate across multiple dimensions of leadership and team behavior.</>,
                  <>Ada dimensi kerendahan hati budaya di sini yang melampaui kompetensi. Seorang pemimpin yang hanya pernah mengenal logika monokronik tidak sekadar kurang memiliki keterampilan. Mereka membawa asumsi yang tidak diperiksa bahwa logika mereka adalah netral. Itu tidak terasa budaya; itu terasa seperti profesionalisme. Ketidakterlihatan itulah tepatnya di mana kerusakan terjadi. Kecerdasan budaya dimulai dengan pengakuan ini: hubungan saya sendiri dengan waktu bukan standar, itu dibentuk. Memahami bahwa orientasi waktu Anda adalah satu logika di antara beberapa berkaitan erat dengan pekerjaan kerendahan hati lintas budaya yang lebih luas yang dieksplorasi dalam <a href="/resources/cultural-intelligence" style={{ color: ORANGE, textDecoration: "underline" }}>modul Kecerdasan Budaya</a>, yang memetakan bagaimana asumsi budaya beroperasi di berbagai dimensi kepemimpinan dan perilaku tim.</>
                )}
              </p>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(14px, 1.5vw, 16px)", color: BODY_TEXT, lineHeight: 1.85, marginBottom: 36 }}>
                {L(lang,
                  <>The trust dimension is equally important and often overlooked. The way a leader handles time sends a signal about what they value and who they respect. A Clock Keeper who insists on monochronic structures in a polychronic team context is not simply enforcing efficiency. They are communicating, usually without realizing it, that their team members&apos; relational logic does not count. The result is a team that complies on the surface and disengages underneath. The deeper dynamics of how time behavior builds or erodes trust across cultures connect directly to the patterns examined in <a href="/resources/building-trust-across-cultures" style={{ color: ORANGE, textDecoration: "underline" }}>Building Trust Across Cultures</a>, which looks at the relational infrastructure that makes cross-cultural collaboration sustainable over time.</>,
                  <>Dimensi kepercayaan sama pentingnya dan sering diabaikan. Cara seorang pemimpin menangani waktu mengirimkan sinyal tentang apa yang mereka hargai dan siapa yang mereka hormati. Seorang Penjaga Jam yang bersikeras pada struktur monokronik dalam konteks tim polikronik tidak hanya menegakkan efisiensi. Mereka berkomunikasi, biasanya tanpa menyadarinya, bahwa logika relasional anggota tim mereka tidak diperhitungkan. Hasilnya adalah tim yang patuh di permukaan dan tidak terlibat di bawahnya. Dinamika lebih dalam tentang bagaimana perilaku waktu membangun atau mengikis kepercayaan lintas budaya terhubung langsung ke pola yang diperiksa dalam <a href="/resources/building-trust-across-cultures" style={{ color: ORANGE, textDecoration: "underline" }}>Membangun Kepercayaan Lintas Budaya</a>, yang melihat infrastruktur relasional yang membuat kolaborasi lintas budaya berkelanjutan dari waktu ke waktu.</>
                )}
              </p>

              <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(15px, 1.8vw, 18px)", fontWeight: 700, color: NAVY, marginBottom: 12, marginTop: 0 }}>
                {L(lang, "Toward Temporal Bilingualism", "Menuju Dwibahasa Temporal")}
              </h3>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(14px, 1.5vw, 16px)", color: BODY_TEXT, lineHeight: 1.85, marginBottom: 0 }}>
                {L(lang,
                  "For leaders who want to build teams that actually function across cultural lines, the work is not to impose a single time logic or to abandon accountability. It is to develop what the research calls temporal bilingualism: the ability to recognize which logic is operating in a given moment, name it without judgment, and make conscious choices about how the team will navigate it together. That is not a soft skill. It is one of the most precise forms of situational awareness a cross-cultural leader can develop. And it begins with a simple, honest question: What does time mean to me, and what assumptions have I been making about what it means to everyone else?",
                  "Bagi pemimpin yang ingin membangun tim yang benar-benar berfungsi lintas garis budaya, pekerjaan ini bukan untuk memaksakan logika waktu tunggal atau meninggalkan akuntabilitas. Ini adalah mengembangkan apa yang penelitian sebut dwibahasa temporal: kemampuan untuk mengenali logika mana yang beroperasi dalam momen tertentu, menamainya tanpa penilaian, dan membuat pilihan sadar tentang bagaimana tim akan menavigasinya bersama. Itu bukan keterampilan lunak. Ini adalah salah satu bentuk kesadaran situasional yang paling tepat yang dapat dikembangkan seorang pemimpin lintas budaya. Dan itu dimulai dengan pertanyaan yang sederhana dan jujur: Apa arti waktu bagi saya, dan asumsi apa yang saya buat tentang apa artinya bagi semua orang lain?"
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ─── CTA FOOTER ───────────────────────────────────────────────────── */}
      <div style={{ background: NAVY, padding: "64px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: ORANGE }} />
        <div style={{ position: "relative", maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 800, color: OFF_WHITE, marginBottom: 14, lineHeight: 1.2 }}>
            {L(lang, "Keep Growing", "Terus Bertumbuh")}
          </h2>
          <p style={{ color: "oklch(72% 0.04 260)", fontSize: 15, lineHeight: 1.75, marginBottom: 28, fontFamily: "'Montserrat', sans-serif" }}>
            {L(lang, "Explore more training modules to deepen your cross-cultural leadership.", "Jelajahi lebih banyak sumber daya untuk memperdalam kepemimpinan lintas budaya kamu.")}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/resources"
              style={{ display: "inline-block", padding: "13px 28px", background: ORANGE, color: OFF_WHITE, borderRadius: 12, fontFamily: "'Montserrat', sans-serif", fontSize: 14, fontWeight: 700, textDecoration: "none" }}
            >
              {L(lang, "Training", "Pelatihan")}
            </Link>
            <Link
              href="/resources/cultural-intelligence"
              style={{ display: "inline-block", padding: "13px 28px", border: "1px solid oklch(45% 0.05 260)", color: OFF_WHITE, borderRadius: 12, fontFamily: "'Montserrat', sans-serif", fontSize: 14, fontWeight: 600, textDecoration: "none" }}
            >
              {L(lang, "Cultural Intelligence →", "Kecerdasan Budaya →")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
