"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Eye, ImageIcon, RotateCcw } from "lucide-react";
import { type TeamLang } from "@/lib/team-i18n";

/* ─────────────────────────────────────────────────────────────────────────────
   SCREENSHOTS
   Images live in /public/images/team-promo/. A slot set to null shows a
   labelled placeholder (profileCard is hidden completely while it is null).
   ───────────────────────────────────────────────────────────────────────── */
export const TEAM_PROMO_IMAGES: Record<"leaderResults" | "phoneRead" | "phoneInput" | "profileCard", string | null> = {
  leaderResults: "/images/team-promo/leader-results.jpg",
  phoneRead: "/images/team-promo/module-phone-assessment.jpg",
  phoneInput: "/images/team-promo/module-phone-team.jpg",
  profileCard: null,     // "/images/team-promo/profile-card.png" (optional)
};

// Module walkthrough clip: muted, looping, only loaded once scrolled near
const TEAM_PROMO_VIDEO = {
  webm: "/videos/team-module-flow.webm",
  mp4: "/videos/team-module-flow.mp4",
  poster: "/images/team-promo/module-flow-poster.jpg",
  aspect: "720 / 840",
};

/* ── Tokens ─────────────────────────────────────────────────────────────── */
const T = {
  navy: "oklch(30% 0.12 260)",
  navyDeep: "oklch(22% 0.10 260)",
  navyMid: "oklch(38% 0.11 260)",
  orange: "oklch(65% 0.15 45)",
  offWhite: "oklch(97% 0.005 80)",
  band: "oklch(90.5% 0.012 80)",
  rule: "oklch(84% 0.01 80)",
  ruleOnBand: "oklch(79% 0.012 80)",
  charcoal: "oklch(22% 0.005 260)",
  body: "oklch(38% 0.007 260)",
  muted: "oklch(48% 0.04 260)",
  onNavy: "oklch(97% 0.005 80)",
  onNavyBody: "oklch(87% 0.025 260)",
  onNavyMuted: "oklch(78% 0.04 260)",
};
const SERIF = "var(--font-cormorant), Georgia, serif";
const SANS = "var(--font-montserrat), system-ui, sans-serif";

/* ── Copy (verbatim from _drafts/team-promo-copy.md, CLEO final) ────────── */
type ModuleType = "article" | "workshop";
const MODULE_TYPES: ModuleType[] = ["article", "workshop", "workshop", "article", "workshop", "article", "workshop", "article", "workshop", "workshop"];

const COPY = {
  en: {
    hero: {
      eyebrow: "Team Pathway",
      title: "Lead a team that actually knows each other.",
      subline: "Eight people, one shared pathway. Every member takes the assessments and reads each module on their own phone. You see the whole team in one place, and your weekly meeting starts where the reading left off.",
      cta: "See team pricing",
    },
    why: {
      label: "Why a team account",
      title: "Personal growth is good. Growing together changes how the team works.",
      body: "When one person reads about trust or conflict, they learn something. When the whole team reads the same module in the same week, they get a shared language. \"That was a process conflict, not a relationship one\" becomes something anyone on the team can say. In multicultural teams this matters even more, because people arrive with different defaults about silence, disagreement, hierarchy and feedback. A team account gives everyone the same starting point, and gives the leader a clear view of who is on the team.",
      points: [
        "8 team accounts, each with full personal pathway access",
        "Every member's assessment results in one leader view",
        "10 team modules built for weekly meetings",
        "One payment, permanent access",
      ],
    },
    assessments: {
      label: "See your team clearly",
      title: "Every member's results, in one place.",
      body: "Each member takes up to eight assessments. As team leader, you see all the results side by side instead of guessing from memory or a conversation two years ago. You can see why one person needs time to think before a decision while another wants to talk it through right away. You can see who feels valued by a word of thanks and who feels valued when you give them time. You can see where the team is strong and where there is nobody at all. It helps you place people well, prepare hard conversations, and stop reading difference as difficulty.",
      note: "Members know their results are shared with the team before they join. Openness is part of the agreement.",
      list: [
        { name: "Wheel of Life", desc: "Where each person is thriving or stretched right now" },
        { name: "Enneagram", desc: "What drives each person, and what they do under pressure" },
        { name: "5 Languages of Appreciation", desc: "How each person actually receives thanks at work" },
        { name: "DISC", desc: "Pace, directness and working style across the team" },
        { name: "Three Thinking Styles", desc: "How people process ideas and reach conclusions" },
        { name: "16 Personalities", desc: "Energy, attention and decision preferences" },
        { name: "Big Five (OCEAN)", desc: "A research-based picture of core personality traits" },
        { name: "Spiritual Gifts", desc: "How God has equipped each person to serve the team" },
      ],
    },
    modules: {
      label: "The team pathway",
      title: "Ten modules. One conversation each week.",
      intro: "Short readings and hands-on workshops, in order. Each one ends with something the team does together, and several save their results straight to your team dashboard.",
      type: { article: "Reading · 20 min", workshop: "Workshop · 45 min" },
      items: [
        { title: "Team Foundations", body: "A group becomes a team when three quiet questions are answered: Do I belong? Do I matter? Is it safe to be honest here? This module shows why safety comes before sharpening, and why foundations have to be built together instead of copied from one culture. Your team leaves with shared language for what it needs, and a leader who sets the floor." },
        { title: "Team Purpose & Vision", body: "Most teams assume they share a \"why\". Often they don't, and those different reasons quietly pull in different directions. In this four-stage workshop the team works through why, what, how and together, names three values it will actually keep, and writes one purpose statement: \"Our team exists to... by... so that...\". The finished statement is saved to your team dashboard." },
        { title: "Getting to Know Each Other", body: "Knowing facts about a colleague is different from knowing them. This module looks at why being known feels risky, how culture shapes what people will share, and why the leader has to go first. The team gets 24 question cards across three levels of depth, and builds a simple habit: one question at every meeting, week after week." },
        { title: "Communication Culture", body: "On a multicultural team, silence can mean agreement, disagreement or respect. This module explains high- and low-context communication and four styles: Architect, Diplomat, Connector and Analyst. Each member takes a 12-question assessment, saved to the dashboard. The team then says its norms out loud and builds feedback channels that work for every style, not only the loudest." },
        { title: "Trust & Psychological Safety", body: "Research from Google and Amy Edmondson points the same way: teams do their best work when people can admit mistakes without fear. This module covers what breaks trust, where shame gets in across cultures, and simple practices like thanking the person who brings bad news. The team completes a Trust Temperature Check across six areas, and the resulting profile is saved." },
        { title: "Roles & Contribution", body: "What someone was hired to do and what they were made to do are often two different things. Using four Contribution Zones (Pioneer, Builder, Connector, Deepener), each member finds their zone and the team maps all eight side by side. Gaps become visible. In cultures where people rarely name their own strengths, the team learns to name them for each other." },
        { title: "Navigating Conflict", body: "Conflict carries information, and avoiding it costs more than facing it. This module separates task, relationship and process conflict, shows how culture shapes each one, and gives the team a five-step PAUSE framework to use in the moment. A short quiz shows whether each person tends to protect, address or facilitate, so the team knows how the others will react." },
        { title: "Decision Making Together", body: "Trust wears down fastest when people don't know how a decision is being made. This module sets out three modes (directive, consultative and consensus) and what breaks each one, such as asking for input on a decision that was already made. The team works through six real scenarios, then commits to naming the mode, closing the loop and reviewing big decisions afterwards." },
        { title: "Accountability & Follow-Through", body: "A real commitment has three parts: what, by when, and to whom. This module looks at why people over-promise to keep the peace, how hierarchy and shame make it hard to report a slip, and why the leader must be the most accountable person in the room. The team adds a five-minute commitment round to each meeting and writes a shared Team Commitment." },
        { title: "Forward Together", body: "Before moving on, the team stops to see how far it has come. This last module is about celebrating progress and staying together over the long haul when differences have not gone away. The team writes a four-sentence Team Declaration, the kind of line that says \"we are different, and we choose each other anyway\", and asks what the next season should hold." },
      ],
    },
    rhythm: {
      label: "How it works",
      title: "A rhythm that fits a busy team.",
      intro: "No extra training days. The reading happens before the meeting, so the meeting can go deeper.",
      steps: [
        { label: "Read", body: "Each member reads the week's module on their phone, in their own time and at their own pace." },
        { label: "Respond", body: "They leave their input and comments, so quieter voices are heard before anyone is in the room." },
        { label: "Prepare", body: "The leader sees the team's input next to the module's teaching, and knows where the real conversation is." },
        { label: "Meet", body: "At the weekly meeting everyone has read the same thing. Nobody needs a summary, so the team can discuss it properly." },
      ],
    },
    cta: {
      title: "Bring your whole team along.",
      body: "Eight team accounts, every assessment, all ten team modules and a leader dashboard. $80 once, which is $10 per member, with permanent access.",
      button: "Set up your team",
      fallback: "Questions first? Apply for access and we will get back to you.",
    },
    caption: {
      results: "The team view: every member's assessment results side by side, so the whole team can see how it is wired before the next hard conversation.",
      modules: "Inside a module: read the teaching, take the team assessment, and your result lands on the team dashboard next to everyone else's.",
      phone: "Every module reads comfortably on a phone, and many come with their own team assessment. Done on the commute, between meetings, or at home in the evening.",
    },
    shot: {
      leaderResults: "Screenshot: team results view",
      phoneRead: "Screenshot: a team assessment inside a module",
      phoneInput: "Screenshot: team progress and reflections",
      profileCard: "Screenshot: member profile card",
    },
  },
  id: {
    hero: {
      eyebrow: "Jalur Tim",
      title: "Pimpin tim yang benar-benar saling mengenal.",
      subline: "Delapan orang, satu jalur bersama. Setiap anggota mengerjakan asesmen dan membaca setiap modul di ponsel masing-masing. Anda melihat gambaran seluruh tim di satu tempat, dan pertemuan mingguan Anda dimulai dari apa yang sudah mereka baca.",
      cta: "Lihat harga tim",
    },
    why: {
      label: "Mengapa akun tim",
      title: "Bertumbuh sendiri itu baik. Bertumbuh bersama mengubah cara tim bekerja.",
      body: "Ketika satu orang membaca tentang kepercayaan atau konflik, ia belajar sesuatu. Ketika seluruh tim membaca modul yang sama di minggu yang sama, mereka mendapat bahasa bersama. Kalimat seperti \"Itu konflik proses, bukan konflik hubungan\" bisa diucapkan oleh siapa saja di tim. Dalam tim multibudaya hal ini lebih penting lagi, karena setiap orang datang dengan kebiasaan berbeda soal diam, perbedaan pendapat, hierarki, dan umpan balik. Akun tim memberi semua orang titik awal yang sama, dan memberi pemimpin gambaran yang jelas tentang siapa saja yang ada di timnya.",
      points: [
        "8 akun tim, masing-masing dengan akses penuh ke jalur pribadi",
        "Hasil asesmen setiap anggota dalam satu tampilan pemimpin",
        "10 modul tim yang dirancang untuk pertemuan mingguan",
        "Sekali bayar, akses permanen",
      ],
    },
    assessments: {
      label: "Lihat tim Anda dengan jelas",
      title: "Hasil setiap anggota, dalam satu tempat.",
      body: "Setiap anggota dapat mengerjakan hingga delapan asesmen. Sebagai pemimpin tim, Anda melihat semua hasilnya berdampingan, tanpa perlu menebak dari ingatan atau dari percakapan dua tahun lalu. Anda bisa melihat mengapa seseorang butuh waktu berpikir sebelum mengambil keputusan, sementara yang lain ingin langsung membicarakannya. Anda bisa melihat siapa yang merasa dihargai lewat ucapan terima kasih dan siapa yang merasa dihargai saat Anda meluangkan waktu untuknya. Anda bisa melihat di mana tim kuat dan di mana belum ada siapa pun. Ini membantu Anda menempatkan orang dengan tepat, menyiapkan percakapan sulit, dan berhenti menganggap perbedaan sebagai masalah.",
      note: "Anggota mengetahui bahwa hasil mereka akan terlihat oleh tim sebelum mereka bergabung. Keterbukaan adalah bagian dari kesepakatan.",
      list: [
        { name: "Roda Kehidupan", desc: "Di area mana setiap orang sedang bertumbuh atau sedang terbebani" },
        { name: "Enneagram", desc: "Apa yang mendorong setiap orang, dan bagaimana ia bereaksi di bawah tekanan" },
        { name: "5 Bahasa Penghargaan", desc: "Bagaimana setiap orang benar-benar menerima penghargaan dalam pekerjaan" },
        { name: "DISC", desc: "Tempo, keterusterangan, dan gaya kerja di seluruh tim" },
        { name: "Tiga Gaya Berpikir", desc: "Bagaimana orang mengolah ide dan sampai pada kesimpulan" },
        { name: "16 Kepribadian", desc: "Sumber energi, fokus perhatian, dan cara mengambil keputusan" },
        { name: "Big Five (OCEAN)", desc: "Gambaran sifat kepribadian inti yang berbasis riset" },
        { name: "Karunia Rohani", desc: "Bagaimana Tuhan memperlengkapi setiap orang untuk melayani bersama tim" },
      ],
    },
    modules: {
      label: "Jalur tim",
      title: "Sepuluh modul. Satu percakapan setiap minggu.",
      intro: "Bacaan singkat dan lokakarya praktis, berurutan. Setiap modul diakhiri dengan sesuatu yang dikerjakan tim bersama, dan beberapa di antaranya menyimpan hasilnya langsung ke dasbor tim Anda.",
      type: { article: "Bacaan · 20 menit", workshop: "Lokakarya · 45 menit" },
      items: [
        { title: "Fondasi Tim", body: "Sebuah kelompok menjadi tim ketika tiga pertanyaan diam-diam terjawab: Apakah saya diterima? Apakah saya berarti? Apakah aman untuk jujur di sini? Modul ini menunjukkan mengapa rasa aman harus datang sebelum saling menajamkan, dan mengapa fondasi harus dibangun bersama, bukan disalin dari satu budaya. Tim Anda mendapat bahasa bersama tentang apa yang dibutuhkan, dan pemimpin yang menetapkan standar dasarnya." },
        { title: "Tujuan & Visi Tim", body: "Kebanyakan tim mengira mereka punya \"alasan\" yang sama. Sering kali tidak, dan alasan yang berbeda itu diam-diam menarik ke arah yang berbeda. Dalam lokakarya empat tahap ini, tim membahas mengapa, apa, bagaimana, dan bersama, menyebut tiga nilai yang benar-benar akan dijaga, lalu menulis satu pernyataan tujuan: \"Tim kami ada untuk... dengan cara... sehingga...\". Pernyataan itu tersimpan di dasbor tim Anda." },
        { title: "Saling Mengenal", body: "Mengetahui fakta tentang rekan kerja berbeda dengan mengenal dia. Modul ini membahas mengapa dikenal terasa berisiko, bagaimana budaya membentuk apa yang mau dibagikan seseorang, dan mengapa pemimpin harus memulai lebih dulu. Tim mendapat 24 kartu pertanyaan dalam tiga tingkat kedalaman, dan membangun kebiasaan sederhana: satu pertanyaan di setiap pertemuan, minggu demi minggu." },
        { title: "Budaya Komunikasi", body: "Dalam tim multibudaya, diam bisa berarti setuju, tidak setuju, atau menghormati. Modul ini menjelaskan komunikasi konteks tinggi dan konteks rendah, serta empat gaya: Arsitek, Diplomat, Penghubung, dan Analis. Setiap anggota mengerjakan asesmen 12 pertanyaan yang tersimpan di dasbor. Lalu tim menyebutkan norma mereka secara terbuka dan membangun jalur umpan balik yang bisa dipakai oleh setiap gaya, bukan hanya yang paling vokal." },
        { title: "Kepercayaan & Keamanan Psikologis", body: "Riset dari Google dan Amy Edmondson menunjuk ke arah yang sama: tim bekerja paling baik ketika orang bisa mengakui kesalahan tanpa takut. Modul ini membahas apa yang merusak kepercayaan, di mana rasa malu masuk dalam berbagai budaya, dan kebiasaan sederhana seperti berterima kasih kepada orang yang membawa kabar buruk. Tim mengisi Cek Suhu Kepercayaan untuk enam area, dan profilnya tersimpan." },
        { title: "Peran & Kontribusi", body: "Tugas yang diberikan kepada seseorang dan hal yang memang menjadi panggilannya sering kali berbeda. Dengan empat Zona Kontribusi (Perintis, Pembangun, Penghubung, Pendalam), setiap anggota menemukan zonanya dan tim memetakan kedelapan orang berdampingan. Kekosongan menjadi terlihat. Dalam budaya di mana orang jarang menyebut kekuatannya sendiri, tim belajar menyebutkannya untuk satu sama lain." },
        { title: "Menghadapi Konflik", body: "Konflik membawa informasi, dan menghindarinya lebih mahal daripada menghadapinya. Modul ini membedakan konflik tugas, hubungan, dan proses, menunjukkan bagaimana budaya membentuk masing-masing, dan memberi tim kerangka PAUSE lima langkah untuk dipakai saat itu juga. Kuis singkat menunjukkan apakah seseorang cenderung melindungi, menghadapi, atau menengahi, sehingga tim tahu bagaimana anggota lain akan bereaksi." },
        { title: "Mengambil Keputusan Bersama", body: "Kepercayaan paling cepat terkikis ketika orang tidak tahu bagaimana sebuah keputusan diambil. Modul ini memaparkan tiga cara (direktif, konsultatif, dan konsensus) serta apa yang merusak masing-masing, misalnya meminta masukan untuk keputusan yang sudah diambil. Tim membahas enam skenario nyata, lalu berkomitmen untuk menyebut cara yang dipakai, menutup lingkaran, dan meninjau keputusan besar sesudahnya." },
        { title: "Akuntabilitas & Tindak Lanjut", body: "Komitmen yang nyata punya tiga bagian: apa, kapan, dan kepada siapa. Modul ini membahas mengapa orang berjanji berlebihan demi menjaga suasana damai, bagaimana hierarki dan rasa malu membuat sulit melaporkan keterlambatan, dan mengapa pemimpin harus menjadi orang yang paling bertanggung jawab di ruangan. Tim menambahkan putaran komitmen lima menit di setiap pertemuan dan menulis Komitmen Tim bersama." },
        { title: "Melangkah Bersama", body: "Sebelum melangkah lebih jauh, tim berhenti untuk melihat seberapa jauh mereka sudah bertumbuh. Modul terakhir ini tentang merayakan kemajuan dan tetap bersama dalam jangka panjang, ketika perbedaan tidak hilang. Tim menulis Deklarasi Tim empat kalimat, jenis kalimat yang berkata \"kami berbeda, dan kami tetap memilih satu sama lain\", lalu bertanya apa yang perlu dikejar di musim berikutnya." },
      ],
    },
    rhythm: {
      label: "Cara kerjanya",
      title: "Ritme yang cocok untuk tim yang sibuk.",
      intro: "Tidak perlu hari pelatihan tambahan. Bacaan dilakukan sebelum pertemuan, sehingga pertemuan bisa lebih mendalam.",
      steps: [
        { label: "Baca", body: "Setiap anggota membaca modul minggu itu di ponselnya, di waktu dan dengan kecepatannya sendiri." },
        { label: "Tanggapi", body: "Mereka memberi masukan dan komentar, sehingga suara yang lebih pendiam sudah terdengar sebelum ada yang masuk ruangan." },
        { label: "Persiapkan", body: "Pemimpin melihat masukan tim di samping materi modul, dan tahu di mana percakapan yang sesungguhnya." },
        { label: "Bertemu", body: "Di pertemuan mingguan, semua orang sudah membaca hal yang sama. Tidak perlu ringkasan, sehingga tim bisa langsung berdiskusi dengan sungguh-sungguh." },
      ],
    },
    cta: {
      title: "Ajak seluruh tim Anda bertumbuh bersama.",
      body: "Delapan akun tim, semua asesmen, kesepuluh modul tim, dan dasbor pemimpin. $80 sekali bayar, atau $10 per anggota, dengan akses permanen.",
      button: "Bangun tim Anda",
      fallback: "Ada pertanyaan dulu? Ajukan akses dan kami akan menghubungi Anda.",
    },
    caption: {
      results: "Tampilan tim: hasil asesmen setiap anggota berdampingan, sehingga seluruh tim tahu karakter timnya sebelum percakapan sulit berikutnya.",
      modules: "Di dalam modul: baca materinya, kerjakan asesmen timnya, dan hasil Anda langsung muncul di dasbor tim, di samping hasil anggota lain.",
      phone: "Setiap modul nyaman dibaca di ponsel, dan banyak modul punya asesmen timnya sendiri. Dikerjakan dalam perjalanan ke kantor, di sela rapat, atau di rumah pada malam hari.",
    },
    shot: {
      leaderResults: "Tangkapan layar: tampilan hasil tim",
      phoneRead: "Tangkapan layar: asesmen tim di dalam modul",
      phoneInput: "Tangkapan layar: kemajuan dan refleksi tim",
      profileCard: "Tangkapan layar: kartu profil anggota",
    },
  },
} as const;

/* ── Scoped CSS: layout breakpoints, motion, reduced motion ─────────────── */
const CSS = `
.tp { display: flex; flex-direction: column; gap: clamp(4rem, 9vw, 7.5rem); }
.tp-hero, .tp-split, .tp-assess, .tp-modhead, .tp-cta { display: grid; grid-template-columns: minmax(0, 1fr); gap: clamp(2rem, 5vw, 4rem); }
.tp-points { display: grid; grid-template-columns: minmax(0, 1fr); gap: 0 2rem; }
.tp-dl { display: grid; grid-template-columns: minmax(0, 1fr); gap: 0 2rem; margin: 0; }
.tp-steps { position: relative; display: grid; grid-template-columns: minmax(0, 1fr); gap: 2.25rem; padding-left: 2rem; }
.tp-track { position: absolute; left: 5px; top: 8px; bottom: 8px; width: 1px; }
.tp-track-fill { position: absolute; inset: 0; background: ${T.orange}; transform-origin: top; transform: scaleY(0); transition: transform 1.6s cubic-bezier(0.22, 1, 0.36, 1); }
.tp-steps[data-in="1"] .tp-track-fill { transform: scaleY(1); }
.tp-dot { position: absolute; left: -2rem; top: 0.45rem; width: 11px; height: 11px; border-radius: 50%; background: ${T.navyDeep}; box-shadow: 0 0 0 1.5px ${T.orange}; }
.tp-loop { display: none; }
.tp-step { position: relative; opacity: 0; transform: translateY(12px); transition: opacity 0.7s ease-out, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
.tp-steps[data-in="1"] .tp-step { opacity: 1; transform: none; }
.tp-phones { display: grid; grid-template-columns: minmax(0, 1fr); gap: 2rem; align-items: end; }
.tp-phone-pair { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; max-width: 26rem; }
.tp-phone-pair > :nth-child(2) { margin-top: 2.5rem; }
.tp-mod-meta { grid-column: 2 / -1; grid-row: 2; justify-self: start; }
.tp-rise { animation: tp-rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) both; }
@keyframes tp-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
.tp-btn { transition: background-color 0.2s ease, transform 0.15s ease; }
.tp-btn:hover { background-color: ${T.navyMid} !important; }
.tp-btn:active { transform: translateY(1px); }
.tp-btn:focus-visible, .tp-acc-btn:focus-visible, .tp-link:focus-visible { outline: 2px solid ${T.orange}; outline-offset: 3px; }
.tp-acc-btn:hover .tp-acc-title { color: ${T.navyMid}; }
.tp-acc-panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.38s cubic-bezier(0.22, 1, 0.36, 1); }
.tp-acc-panel[data-open="1"] { grid-template-rows: 1fr; }
.tp-chev { transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
.tp-link:hover { color: ${T.navy} !important; }

@media (min-width: 560px) {
  .tp-points, .tp-dl { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (min-width: 720px) {
  .tp-mod-meta { grid-column: 3; grid-row: 1; justify-self: end; }
}
@media (min-width: 960px) {
  .tp-hero { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); align-items: center; }
  .tp-split { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); }
  .tp-points { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .tp-assess { grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); }
  .tp-modhead { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); align-items: center; }
  .tp-modhead > :first-child { order: 2; }
  .tp-cta { grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); align-items: start; }
  .tp-steps { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 2.5rem; padding-left: 0; padding-top: 2.25rem; }
  .tp-track { left: 0; right: 2.5rem; top: 5px; bottom: auto; width: auto; height: 1px; }
  .tp-track-fill { transform-origin: left; transform: scaleX(0); }
  .tp-steps[data-in="1"] .tp-track-fill { transform: scaleX(1); }
  .tp-dot { left: 0; top: -2.25rem; }
  .tp-loop { display: block; position: absolute; right: 0; top: -4px; }
  .tp-phones { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 2.5rem; }
}
@media (prefers-reduced-motion: reduce) {
  .tp-rise { animation: none; }
  .tp-step, .tp-track-fill, .tp-acc-panel, .tp-chev, .tp-btn { transition: none; }
  .tp-step { opacity: 1; transform: none; }
  .tp-track-fill { transform: none !important; }
}
`;

/* ── Small building blocks ──────────────────────────────────────────────── */
function Eyebrow({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) {
  return (
    <p style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: 0, fontFamily: SANS, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: onDark ? T.onNavyMuted : T.muted }}>
      <span aria-hidden="true" style={{ display: "block", width: "1.75rem", height: "2px", background: T.orange, flexShrink: 0 }} />
      {children}
    </p>
  );
}

const h2Style = (onDark = false): CSSProperties => ({
  fontFamily: SERIF, fontStyle: "italic", fontWeight: 500,
  fontSize: "clamp(1.9rem, 3.6vw, 2.75rem)", lineHeight: 1.12,
  color: onDark ? T.onNavy : T.navy, margin: 0, textWrap: "balance",
});

const bodyStyle: CSSProperties = { fontFamily: SANS, fontSize: "0.97rem", lineHeight: 1.75, color: T.body, margin: 0, maxWidth: "66ch" };

function Caption({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) {
  return (
    <figcaption style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "1.1rem", lineHeight: 1.45, color: onDark ? T.onNavyBody : T.body, maxWidth: "52ch", marginTop: "1rem" }}>
      {children}
    </figcaption>
  );
}

/* ── ScreenshotFrame: browser window or phone, image or labelled placeholder ── */
function ScreenshotFrame({ kind, src, label, alt, onDark = false, priority = false, aspect = "16 / 10", children }: {
  kind: "browser" | "phone"; src: string | null; label: string; alt: string; onDark?: boolean; priority?: boolean; aspect?: string; children?: ReactNode;
}) {
  const placeholder = (
    <div
      role="img"
      aria-label={label}
      style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: "0.625rem", padding: "1rem", textAlign: "center",
        background: `repeating-linear-gradient(135deg, oklch(94.5% 0.008 80) 0 14px, oklch(93% 0.01 80) 14px 15px)`,
      }}
    >
      <ImageIcon aria-hidden="true" size={kind === "phone" ? 18 : 22} strokeWidth={1.5} color={T.muted} />
      <span style={{ fontFamily: SANS, fontSize: kind === "phone" ? "0.6rem" : "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted, lineHeight: 1.5, maxWidth: "22ch" }}>
        {label}
      </span>
    </div>
  );

  const media = children ?? (src ? (
    <Image src={src} alt={alt} fill priority={priority} sizes={kind === "phone" ? "220px" : "(min-width: 960px) 680px, 100vw"} style={{ objectFit: "cover", objectPosition: "top" }} />
  ) : placeholder);

  if (kind === "phone") {
    return (
      <div style={{
        position: "relative", width: "100%", maxWidth: "13.5rem", padding: "7px", borderRadius: "2rem",
        background: "oklch(17% 0.04 260)",
        boxShadow: onDark
          ? `0 0 0 1px oklch(97% 0.005 80 / 0.14), 0 30px 50px -24px oklch(8% 0.05 260 / 0.8)`
          : `0 0 0 1px oklch(30% 0.12 260 / 0.2), 0 30px 50px -28px oklch(30% 0.12 260 / 0.45)`,
      }}>
        <div style={{ position: "relative", aspectRatio: "9 / 19.5", borderRadius: "1.55rem", overflow: "hidden", background: T.offWhite }}>
          {media}
          <span aria-hidden="true" style={{ position: "absolute", top: "0.5rem", left: "50%", transform: "translateX(-50%)", width: "30%", height: "0.95rem", borderRadius: "1rem", background: "oklch(17% 0.04 260)" }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      borderRadius: "10px", overflow: "hidden", background: T.offWhite,
      border: `1px solid oklch(30% 0.12 260 / 0.18)`,
      boxShadow: "0 40px 70px -40px oklch(30% 0.12 260 / 0.45), 0 2px 6px oklch(30% 0.12 260 / 0.06)",
    }}>
      <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: "0.75rem", height: "2.1rem", padding: "0 0.875rem", background: "oklch(93.5% 0.008 80)", borderBottom: "1px solid oklch(87% 0.01 80)" }}>
        <span style={{ display: "flex", gap: "0.35rem" }}>
          {[0, 1, 2].map(i => <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "oklch(79% 0.012 80)" }} />)}
        </span>
        <span style={{ flex: 1, maxWidth: "16rem", margin: "0 auto", height: "1.2rem", borderRadius: "0.6rem", background: "oklch(97% 0.005 80)", fontFamily: SANS, fontSize: "0.6rem", lineHeight: "1.2rem", color: T.muted, textAlign: "center", overflow: "hidden", whiteSpace: "nowrap" }}>
          crispyleaders.com/dashboard
        </span>
        <span style={{ width: "2.2rem" }} />
      </div>
      <div style={{ position: "relative", aspectRatio: aspect }}>{media}</div>
    </div>
  );
}

/* ── LazyVideo: sources attach only once the clip nears the viewport ────── */
function LazyVideo({ label }: { label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (typeof IntersectionObserver === "undefined") { setLoad(true); return; }
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { setLoad(true); io.disconnect(); }
    }, { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!load || !el) return;
    el.load();
    if (!still) el.play().catch(() => {});
  }, [load, still]);

  return (
    <video
      ref={ref}
      aria-label={label}
      poster={TEAM_PROMO_VIDEO.poster}
      muted
      loop
      playsInline
      controls={still}
      preload="none"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
    >
      {load && <source src={TEAM_PROMO_VIDEO.webm} type="video/webm" />}
      {load && <source src={TEAM_PROMO_VIDEO.mp4} type="video/mp4" />}
    </video>
  );
}

/* ── Primary button ─────────────────────────────────────────────────────── */
function PrimaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="tp-btn" style={{
      display: "inline-flex", alignItems: "center", gap: "0.75rem", minHeight: 48,
      padding: "0.875rem 1.5rem", background: T.navy, color: T.onNavy,
      fontFamily: SANS, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
      textDecoration: "none", borderRadius: 2,
    }}>
      {children}
      <ArrowRight aria-hidden="true" size={16} strokeWidth={2} />
    </Link>
  );
}

/* ── Main ───────────────────────────────────────────────────────────────── */
export default function TeamPreviewDashboard({ language }: { language: string }) {
  const lang: TeamLang = language === "id" ? "id" : "en";
  const c = COPY[lang];
  const [open, setOpen] = useState<boolean[]>(() => MODULE_TYPES.map((_, i) => i === 0));
  const stepsRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = stepsRef.current;
    if (!el) return;
    const reveal = () => { el.dataset.in = "1"; };
    if (typeof IntersectionObserver === "undefined") { reveal(); return; }
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { reveal(); io.disconnect(); }
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggle = (i: number) => setOpen(prev => prev.map((v, j) => (j === i ? !v : v)));

  return (
    <div className="tp" lang={lang}>
      <style>{CSS}</style>

      {/* ── 1. Hero ── */}
      <section className="tp-hero" aria-labelledby="tp-hero-title">
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="tp-rise"><Eyebrow>{c.hero.eyebrow}</Eyebrow></div>
          <h2 id="tp-hero-title" className="tp-rise" style={{
            fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, margin: 0,
            fontSize: "clamp(2.4rem, 5.2vw, 3.9rem)", lineHeight: 1.04, letterSpacing: "-0.01em",
            color: T.navy, textWrap: "balance", animationDelay: "80ms",
          }}>
            {c.hero.title}
          </h2>
          <p className="tp-rise" style={{ ...bodyStyle, fontSize: "1.02rem", maxWidth: "46ch", animationDelay: "160ms" }}>{c.hero.subline}</p>
          <div className="tp-rise" style={{ animationDelay: "240ms", paddingTop: "0.25rem" }}>
            <PrimaryLink href="/membership">{c.hero.cta}</PrimaryLink>
          </div>
        </div>
        <figure className="tp-rise" style={{ margin: "0 auto", width: "100%", maxWidth: "25rem", animationDelay: "200ms" }}>
          <ScreenshotFrame kind="browser" src={TEAM_PROMO_IMAGES.leaderResults} label={c.shot.leaderResults} alt={c.caption.results} aspect="720 / 907" priority />
          <Caption>{c.caption.results}</Caption>
        </figure>
      </section>

      {/* ── 2. Why a team account ── */}
      <section aria-labelledby="tp-why-title" style={{ borderTop: `1px solid ${T.rule}`, paddingTop: "clamp(2.5rem, 5vw, 3.5rem)", display: "flex", flexDirection: "column", gap: "clamp(2.5rem, 5vw, 3.5rem)" }}>
        <div className="tp-split">
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <Eyebrow>{c.why.label}</Eyebrow>
            <h2 id="tp-why-title" style={h2Style()}>{c.why.title}</h2>
          </div>
          <p style={{ ...bodyStyle, alignSelf: "end" }}>{c.why.body}</p>
        </div>
        <ul className="tp-points" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {c.why.points.map((pt, i) => (
            <li key={i} style={{ borderTop: `1px solid ${T.navy}`, padding: "1rem 0 1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <span aria-hidden="true" style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "1.6rem", lineHeight: 1, color: T.navyMid }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ fontFamily: SANS, fontSize: "0.92rem", fontWeight: 600, lineHeight: 1.5, color: T.charcoal }}>{pt}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 3. Assessments ── */}
      <section aria-labelledby="tp-assess-title" style={{ background: T.band, padding: "clamp(2rem, 5vw, 4rem) clamp(1.25rem, 4.5vw, 3.5rem)" }}>
        <div className="tp-assess">
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <Eyebrow>{c.assessments.label}</Eyebrow>
            <h2 id="tp-assess-title" style={h2Style()}>{c.assessments.title}</h2>
            <p style={bodyStyle}>{c.assessments.body}</p>
            <p style={{
              display: "flex", gap: "0.75rem", alignItems: "flex-start", margin: "0.5rem 0 0",
              padding: "1rem 1.125rem", border: `1px solid oklch(30% 0.12 260 / 0.28)`, borderRadius: 2,
              fontFamily: SANS, fontSize: "0.86rem", lineHeight: 1.6, color: T.charcoal, maxWidth: "60ch",
            }}>
              <Eye aria-hidden="true" size={18} strokeWidth={1.5} color={T.navy} style={{ flexShrink: 0, marginTop: "0.15rem" }} />
              <span>{c.assessments.note}</span>
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <dl className="tp-dl">
              {c.assessments.list.map(a => (
                <div key={a.name} style={{ borderTop: `1px solid ${T.ruleOnBand}`, padding: "1rem 0 1.25rem" }}>
                  <dt style={{ fontFamily: SANS, fontSize: "0.92rem", fontWeight: 700, color: T.navy, marginBottom: "0.3rem" }}>{a.name}</dt>
                  <dd style={{ margin: 0, fontFamily: SANS, fontSize: "0.86rem", lineHeight: 1.55, color: T.muted }}>{a.desc}</dd>
                </div>
              ))}
            </dl>
            {TEAM_PROMO_IMAGES.profileCard && (
              <figure style={{ margin: 0, maxWidth: "15rem" }}>
                <ScreenshotFrame kind="phone" src={TEAM_PROMO_IMAGES.profileCard} label={c.shot.profileCard} alt={c.shot.profileCard} />
              </figure>
            )}
          </div>
        </div>
      </section>

      {/* ── 4. Modules ── */}
      <section aria-labelledby="tp-mod-title" style={{ display: "flex", flexDirection: "column", gap: "clamp(2.5rem, 5vw, 3.5rem)" }}>
        <div className="tp-modhead">
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <Eyebrow>{c.modules.label}</Eyebrow>
            <h2 id="tp-mod-title" style={h2Style()}>{c.modules.title}</h2>
            <p style={bodyStyle}>{c.modules.intro}</p>
          </div>
          <figure style={{ margin: "0 auto", width: "100%", maxWidth: "23rem" }}>
            <ScreenshotFrame kind="browser" src={null} label={c.caption.modules} alt={c.caption.modules} aspect={TEAM_PROMO_VIDEO.aspect}>
              <LazyVideo label={c.caption.modules} />
            </ScreenshotFrame>
            <Caption>{c.caption.modules}</Caption>
          </figure>
        </div>

        <ol style={{ listStyle: "none", margin: 0, padding: 0, borderBottom: `1px solid ${T.rule}` }}>
          {c.modules.items.map((m, i) => {
            const type = MODULE_TYPES[i];
            const isOpen = open[i];
            const btnId = `tp-mod-btn-${i}`;
            const panelId = `tp-mod-panel-${i}`;
            return (
              <li key={i} style={{ borderTop: `1px solid ${T.rule}` }}>
                <h3 style={{ margin: 0 }}>
                  <button
                    id={btnId}
                    type="button"
                    className="tp-acc-btn"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(i)}
                    style={{
                      width: "100%", minHeight: 64, display: "grid",
                      gridTemplateColumns: "2.75rem minmax(0, 1fr) auto 1.5rem", alignItems: "center", columnGap: "0.875rem", rowGap: "0.35rem",
                      padding: "1rem 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", color: "inherit",
                    }}
                  >
                    <span aria-hidden="true" style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "1.65rem", lineHeight: 1, color: T.navyMid }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="tp-acc-title" style={{ fontFamily: SANS, fontSize: "1rem", fontWeight: 700, lineHeight: 1.35, color: T.charcoal, transition: "color 0.2s ease" }}>
                      {m.title}
                    </span>
                    <span className="tp-mod-meta" style={{
                      fontFamily: SANS, fontSize: "0.64rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap",
                      padding: "0.3rem 0.6rem", borderRadius: 2,
                      ...(type === "workshop"
                        ? { background: T.navy, color: T.onNavy, border: `1px solid ${T.navy}` }
                        : { background: "transparent", color: T.navy, border: `1px solid oklch(30% 0.12 260 / 0.4)` }),
                    }}>
                      {c.modules.type[type]}
                    </span>
                    <ChevronDown aria-hidden="true" className="tp-chev" size={20} strokeWidth={1.5} color={T.navy}
                      style={{ gridColumn: 4, gridRow: 1, justifySelf: "end", transform: isOpen ? "rotate(180deg)" : "none" }} />
                  </button>
                </h3>
                <div id={panelId} role="region" aria-labelledby={btnId} className="tp-acc-panel" data-open={isOpen ? "1" : "0"} inert={!isOpen}>
                  <div style={{ overflow: "hidden" }}>
                    <p style={{ ...bodyStyle, fontSize: "0.94rem", padding: "0 0 1.5rem calc(2.75rem + 0.875rem)", maxWidth: "calc(66ch + 3.6rem)" }}>
                      {m.body}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ── 5. Weekly rhythm (centrepiece) ── */}
      <section aria-labelledby="tp-rhythm-title" style={{ background: T.navyDeep, padding: "clamp(2.5rem, 6vw, 5rem) clamp(1.25rem, 4.5vw, 3.5rem)", display: "flex", flexDirection: "column", gap: "clamp(2.5rem, 5vw, 4rem)" }}>
        <div className="tp-split">
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <Eyebrow onDark>{c.rhythm.label}</Eyebrow>
            <h2 id="tp-rhythm-title" style={h2Style(true)}>{c.rhythm.title}</h2>
          </div>
          <p style={{ ...bodyStyle, color: T.onNavyBody, lineHeight: 1.8, alignSelf: "end" }}>{c.rhythm.intro}</p>
        </div>

        <ol ref={stepsRef} className="tp-steps" style={{ listStyle: "none", margin: 0 }}>
          <span className="tp-track" aria-hidden="true" style={{ background: "oklch(97% 0.005 80 / 0.18)" }}>
            <span className="tp-track-fill" />
          </span>
          <RotateCcw className="tp-loop" aria-hidden="true" size={14} strokeWidth={1.75} color={T.orange} />
          {c.rhythm.steps.map((s, i) => (
            <li key={i} className="tp-step" style={{ transitionDelay: `${150 + i * 180}ms` }}>
              <span className="tp-dot" aria-hidden="true" />
              <span style={{ display: "block", fontFamily: SANS, fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.18em", color: T.onNavyMuted, marginBottom: "0.5rem" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: "clamp(2.1rem, 3.4vw, 2.75rem)", lineHeight: 1, color: T.onNavy, margin: "0 0 0.875rem" }}>
                {s.label}
              </h3>
              <p style={{ fontFamily: SANS, fontSize: "0.9rem", lineHeight: 1.75, color: T.onNavyBody, margin: 0, maxWidth: "34ch" }}>{s.body}</p>
            </li>
          ))}
        </ol>

        <figure className="tp-phones" style={{ margin: 0, borderTop: "1px solid oklch(97% 0.005 80 / 0.14)", paddingTop: "clamp(2rem, 4vw, 3rem)" }}>
          <div className="tp-phone-pair">
            {([["phoneRead", 1], ["phoneInput", 2]] as const).map(([slot, step]) => (
              <div key={slot} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <ScreenshotFrame kind="phone" src={TEAM_PROMO_IMAGES[slot]} label={c.shot[slot]} alt={`${c.rhythm.steps[step].label}: ${c.rhythm.steps[step].body}`} onDark />
                <span aria-hidden="true" style={{ fontFamily: SANS, fontSize: "0.64rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: T.onNavyMuted }}>
                  {String(step + 1).padStart(2, "0")} · {c.rhythm.steps[step].label}
                </span>
              </div>
            ))}
          </div>
          <figcaption style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(1.35rem, 2.4vw, 1.75rem)", lineHeight: 1.35, color: T.onNavy, maxWidth: "26ch", alignSelf: "center" }}>
            {c.caption.phone}
          </figcaption>
        </figure>
      </section>

      {/* ── 6. Closing CTA ── */}
      <section aria-labelledby="tp-cta-title" className="tp-cta" style={{ borderTop: `1px solid ${T.navy}`, paddingTop: "clamp(2.5rem, 5vw, 3.5rem)" }}>
        <h2 id="tp-cta-title" style={{ ...h2Style(), fontSize: "clamp(2.2rem, 4.6vw, 3.4rem)", lineHeight: 1.06 }}>{c.cta.title}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "flex-start" }}>
          <p style={bodyStyle}>{c.cta.body}</p>
          <PrimaryLink href="/membership">{c.cta.button}</PrimaryLink>
          <Link href="/apply" className="tp-link" style={{ fontFamily: SANS, fontSize: "0.86rem", lineHeight: 1.6, color: T.muted, textDecoration: "underline", textUnderlineOffset: "0.25em", textDecorationThickness: "1px" }}>
            {c.cta.fallback}
          </Link>
        </div>
      </section>
    </div>
  );
}
