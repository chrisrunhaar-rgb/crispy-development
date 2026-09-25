"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Lock, RotateCcw } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
   Personal Pathway promo page. Same structure and visual system as the Team
   Pathway page (app/(app)/dashboard/TeamPreviewDashboard.tsx), classes
   prefixed .pp so the two never collide.
   ───────────────────────────────────────────────────────────────────────── */
const PERSONAL_PROMO_IMAGE = "/images/personal-promo/dashboard.jpg";
const PERSONAL_RESULT_IMAGE = "/images/personal-promo/wheel-result.jpg";
const PERSONAL_READING_IMAGE = "/images/personal-promo/module-reading.jpg";

// Module walkthrough clip: muted, looping, only loaded once scrolled near
const PERSONAL_PROMO_VIDEO = {
  webm: "/videos/personal-module-flow.webm",
  mp4: "/videos/personal-module-flow.mp4",
  poster: "/images/personal-promo/module-flow-poster.jpg",
  aspect: "720 / 716",
};

/* ── Tokens (shared with the Team page) ─────────────────────────────────── */
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

/* ── Copy (from _drafts/personal-promo-copy.md, CLEO final) ─────────────── */
const COPY = {
  en: {
    hero: {
      eyebrow: "Personal Pathway",
      title: "Know how you lead, wherever you are leading.",
      subline: "Eight assessments, 50+ short modules on cross-cultural leadership, and a personal dashboard that keeps your results, your notes and your progress together. Read on your phone between meetings, save what matters, and come back to it when you need it.",
      cta: "See pricing",
    },
    why: {
      label: "Why a personal pathway",
      title: "Growth that fits the life you already have.",
      body: "A colleague goes quiet in a meeting and you read it as agreement. Your feedback, meant kindly, lands as a public correction. A deadline you called firm turns out to be a suggestion to everyone else. Cross-cultural leadership is full of moments like these, and most of them happen far from any training room. The Personal Pathway gives you short, practical modules to read when those moments come up, assessments that show how you are wired, and space to think about how God is shaping you as a leader through it all. You set the pace, and everything you learn stays in one place.",
      points: [
        "50+ modules on cross-cultural leadership",
        "8 assessments, with every result saved to your dashboard",
        "Save modules, add your own notes, track what you have finished",
        "One payment, permanent access",
      ],
    },
    assessments: {
      label: "Know yourself",
      title: "Eight ways to see how you are wired.",
      body: "Every leader carries defaults into a new culture: how fast to decide, how directly to speak, what rest looks like, how to show someone they matter. Those defaults feel normal until they meet someone else's. The eight assessments help you name yours. Each one takes 20 to 35 minutes, and your results stay on your dashboard so you can return to them after a hard week, before a big conversation, or when a new role asks something different of you.",
      note: "Your results stay in your own account. If you later join a team, your team can see them.",
      list: [
        { name: "DISC", desc: "Your natural pace and style, and how it comes across to others" },
        { name: "Enneagram", desc: "The motivation underneath your habits, and where you tend to drift under stress" },
        { name: "5 Languages of Appreciation", desc: "How you like to receive appreciation, and how you usually give it" },
        { name: "Wheel of Life", desc: "A snapshot of your whole life right now, with room to reflect on each area" },
        { name: "Three Thinking Styles", desc: "Whether you reach decisions through analysis, ideas or practical action" },
        { name: "Spiritual Gifts", desc: "The gifts God has given you, and where they fit in your calling" },
        { name: "Big Five (OCEAN)", desc: "Five core traits, measured on the most widely researched model of personality" },
        { name: "16 Personalities", desc: "Where you draw energy from, and how you take in information and decide" },
      ],
    },
    modules: {
      label: "The library",
      title: "50+ modules, each one short enough to finish in one sitting.",
      intro: "Each module takes one idea, explains it plainly and gives you something to try this week. Read them in any order. Start with whatever you are facing right now.",
      examples: "Modules include",
      groups: [
        { title: "Working across cultures", body: "Time, hierarchy, trust and feedback, and what each looks like in a culture that is not your own.", examples: ["Cultural Intelligence (CQ)", "Power Distance", "Your Time Is Not My Time", "Giving Feedback Across Cultures", "Understanding High-Context Cultures"] },
        { title: "Leading people", body: "Setting direction, serving the people you lead, working well with those above you, and preparing the next leaders.", examples: ["Leadership Altitudes", "Servant Leadership", "Vision Casting", "Managing Up", "Raising Up the Next Generation"] },
        { title: "Thinking clearly", body: "Tools for decisions, assumptions and blind spots, especially when you are reading a situation through a cultural lens you did not grow up with.", examples: ["The Ladder of Inference", "Six Thinking Hats", "Cognitive Biases in Leadership", "Decision Making Under Uncertainty"] },
        { title: "Growing as a person", body: "Mindset, goals, emotional intelligence and the habits that keep you learning.", examples: ["Emotional Intelligence (EQ)", "Fixed vs. Growth Mindset", "The Johari Window", "SMART Goals", "Overcoming Procrastination"] },
        { title: "Staying well for the long haul", body: "Pace, rest, transitions and family life, so you are still standing in year ten.", examples: ["Sustainable Pace", "Understanding Burnout", "Healthy Transitions", "Returning Well", "Emotional Safety for Families"] },
        { title: "Faith and calling", body: "Your inner life, your identity in Christ and what it means to follow a calling when the way ahead is unclear.", examples: ["The Leader's Inner Life", "Called Without the Map", "The Discipline of Silence", "Identity Under Pressure", "The Sabbath Leader"] },
      ],
      more: "Also in the library: modules on conflict, trust and facilitation for when you lead a group.",
    },
    rhythm: {
      label: "How it works",
      title: "A rhythm you can keep in a full week.",
      intro: "No schedule to follow and no deadlines. Most modules take 15 to 25 minutes, so one quiet half hour is enough to move forward.",
      steps: [
        { label: "Discover", body: "Take an assessment. Your result is saved to your dashboard, ready to revisit whenever you need it." },
        { label: "Choose", body: "Browse the library and save the modules that fit what you are facing. They become your personal plan." },
        { label: "Read and reflect", body: "Read a module on your phone, then write a note on what you want to try. Your notes stay with the module." },
        { label: "Track", body: "Mark a module complete when you have worked through it, and watch your progress grow on your dashboard." },
      ],
    },
    cta: {
      title: "Start with one assessment and one module.",
      body: "50+ modules, all eight assessments and your own dashboard, plus new content as it launches. $15 once, with permanent access. Nothing recurring, nothing to cancel.",
      button: "Get the Personal Pathway",
      team: "Leading a team? The Team Pathway includes eight personal accounts.",
    },
    caption: {
      dashboard: "Your personal dashboard: saved modules, assessment results and progress, all in one view.",
      result: "Each result stays on your dashboard, so you can come back to it before the next hard conversation.",
      resultAlt: "A Wheel of Life result on a phone: scores for eight life areas, a focus area and a strongest area.",
      video: "Read on your computer or your phone, whichever is closer. Every module has short sections, plain language and something practical to try.",
      reading: "Inside a module: short sections that end with a few key takeaways to carry into your week.",
      readingAlt: "A module open on a phone, showing its Key Takeaways section.",
    },
  },
  id: {
    hero: {
      eyebrow: "Jalur Pribadi",
      title: "Kenali cara Anda memimpin, di mana pun Anda memimpin.",
      subline: "Delapan asesmen, 50+ modul singkat tentang kepemimpinan lintas budaya, dan dasbor pribadi yang menyimpan hasil, catatan, dan kemajuan Anda di satu tempat. Baca di ponsel di sela rapat, simpan yang penting, dan kembali kapan pun Anda membutuhkannya.",
      cta: "Lihat harga",
    },
    why: {
      label: "Mengapa jalur pribadi",
      title: "Pertumbuhan yang sesuai dengan hidup yang sudah Anda jalani.",
      body: "Seorang rekan diam dalam rapat, dan Anda mengira ia setuju. Umpan balik Anda, yang dimaksudkan baik, diterima sebagai teguran di depan umum. Tenggat waktu yang Anda anggap pasti ternyata hanya dianggap saran oleh orang lain. Kepemimpinan lintas budaya penuh dengan momen seperti ini, dan sebagian besar terjadi jauh dari ruang pelatihan. Jalur Pribadi memberi Anda modul singkat dan praktis untuk dibaca ketika momen itu datang, asesmen yang menunjukkan karakter Anda, dan ruang untuk merenungkan bagaimana Tuhan membentuk Anda sebagai pemimpin di dalam semua itu. Anda yang menentukan kecepatannya, dan semua yang Anda pelajari tersimpan di satu tempat.",
      points: [
        "50+ modul tentang kepemimpinan lintas budaya",
        "8 asesmen, dengan setiap hasil tersimpan di dasbor Anda",
        "Simpan modul, tambahkan catatan pribadi, pantau apa yang sudah selesai",
        "Sekali bayar, akses permanen",
      ],
    },
    assessments: {
      label: "Kenali diri Anda",
      title: "Delapan cara untuk melihat karakter Anda.",
      body: "Setiap pemimpin membawa kebiasaan bawaan ke dalam budaya baru: seberapa cepat mengambil keputusan, seberapa langsung berbicara, seperti apa istirahat itu, dan bagaimana menunjukkan bahwa seseorang berharga. Kebiasaan itu terasa wajar sampai bertemu dengan kebiasaan orang lain. Delapan asesmen ini membantu Anda mengenali kebiasaan Anda sendiri. Masing-masing butuh 20 sampai 35 menit, dan hasilnya tetap tersimpan di dasbor Anda, sehingga Anda bisa melihatnya lagi setelah minggu yang berat, sebelum percakapan penting, atau saat peran baru menuntut hal yang berbeda dari Anda.",
      note: "Hasil Anda tersimpan di akun Anda sendiri. Jika nanti Anda bergabung dengan sebuah tim, tim Anda dapat melihatnya.",
      list: [
        { name: "DISC", desc: "Tempo dan gaya alami Anda, serta bagaimana orang lain menangkapnya" },
        { name: "Enneagram", desc: "Motivasi di balik kebiasaan Anda, dan ke mana Anda cenderung bergeser saat tertekan" },
        { name: "5 Bahasa Penghargaan", desc: "Bagaimana Anda suka menerima penghargaan, dan bagaimana Anda biasanya memberikannya" },
        { name: "Roda Kehidupan", desc: "Gambaran seluruh hidup Anda saat ini, dengan ruang untuk merenungkan setiap area" },
        { name: "Tiga Gaya Berpikir", desc: "Apakah Anda mengambil keputusan lewat analisis, ide, atau tindakan praktis" },
        { name: "Karunia Rohani", desc: "Karunia yang Tuhan berikan kepada Anda, dan tempatnya dalam panggilan Anda" },
        { name: "Big Five (OCEAN)", desc: "Lima sifat inti, diukur dengan model kepribadian yang paling banyak diteliti" },
        { name: "16 Kepribadian", desc: "Dari mana Anda mendapat energi, dan bagaimana Anda menyerap informasi serta memutuskan" },
      ],
    },
    modules: {
      label: "Perpustakaan",
      title: "50+ modul, masing-masing cukup singkat untuk diselesaikan sekali duduk.",
      intro: "Setiap modul membahas satu gagasan, menjelaskannya dengan sederhana, dan memberi Anda sesuatu untuk dicoba minggu ini. Baca dalam urutan apa pun. Mulailah dari apa yang sedang Anda hadapi sekarang.",
      examples: "Contoh modul",
      groups: [
        { title: "Bekerja lintas budaya", body: "Waktu, hierarki, kepercayaan, dan umpan balik, serta wujudnya dalam budaya yang bukan budaya Anda sendiri.", examples: ["Kecerdasan Budaya (CQ)", "Jarak Kekuasaan", "Waktumu Bukan Waktuku", "Memberikan Umpan Balik Lintas Budaya", "Memahami Budaya Konteks Tinggi"] },
        { title: "Memimpin orang", body: "Menentukan arah, melayani orang yang Anda pimpin, bekerja baik dengan atasan, dan menyiapkan pemimpin berikutnya.", examples: ["Ketinggian Kepemimpinan", "Kepemimpinan Hamba", "Menebar Visi", "Mengelola ke Atas", "Membesarkan Generasi Berikutnya"] },
        { title: "Berpikir jernih", body: "Alat untuk keputusan, asumsi, dan titik buta, terutama saat Anda membaca situasi melalui kacamata budaya yang bukan budaya asal Anda.", examples: ["Tangga Inferensi", "Enam Topi Berpikir", "Bias Kognitif dalam Kepemimpinan", "Pengambilan Keputusan dalam Ketidakpastian"] },
        { title: "Bertumbuh sebagai pribadi", body: "Pola pikir, tujuan, kecerdasan emosional, dan kebiasaan yang membuat Anda terus belajar.", examples: ["Kecerdasan Emosional (EQ)", "Mentalitas Tetap vs. Berkembang", "Jendela Johari", "SMART Goals", "Mengatasi Penundaan"] },
        { title: "Tetap sehat untuk jangka panjang", body: "Tempo, istirahat, masa transisi, dan kehidupan keluarga, supaya Anda masih bertahan di tahun kesepuluh.", examples: ["Tempo yang Berkelanjutan", "Memahami Kelelahan", "Transisi yang Sehat", "Kembali dengan Baik", "Keamanan Emosional untuk Keluarga"] },
        { title: "Iman dan panggilan", body: "Kehidupan batin Anda, identitas Anda di dalam Kristus, dan arti mengikuti panggilan ketika jalan di depan belum jelas.", examples: ["Kehidupan Batin Pemimpin", "Dipanggil Tanpa Peta", "Disiplin Keheningan", "Identitas di Bawah Tekanan", "Pemimpin yang Beristirahat"] },
      ],
      more: "Juga di perpustakaan: modul tentang konflik, kepercayaan, dan fasilitasi untuk saat Anda memimpin kelompok.",
    },
    rhythm: {
      label: "Cara kerjanya",
      title: "Ritme yang bisa Anda jalani di minggu yang padat.",
      intro: "Tidak ada jadwal yang harus diikuti dan tidak ada tenggat waktu. Sebagian besar modul butuh 15 sampai 25 menit, jadi setengah jam yang tenang sudah cukup untuk melangkah maju.",
      steps: [
        { label: "Temukan", body: "Kerjakan sebuah asesmen. Hasilnya tersimpan di dasbor Anda, siap dilihat lagi kapan pun Anda perlu." },
        { label: "Pilih", body: "Jelajahi perpustakaan dan simpan modul yang sesuai dengan apa yang sedang Anda hadapi. Modul itu menjadi rencana pribadi Anda." },
        { label: "Baca dan renungkan", body: "Baca sebuah modul di ponsel, lalu tulis catatan tentang apa yang ingin Anda coba. Catatan Anda tetap tersimpan bersama modulnya." },
        { label: "Pantau", body: "Tandai modul sebagai selesai setelah Anda menjalaninya, dan lihat kemajuan Anda bertambah di dasbor." },
      ],
    },
    cta: {
      title: "Mulailah dengan satu asesmen dan satu modul.",
      body: "50+ modul, kedelapan asesmen, dan dasbor pribadi Anda, ditambah konten baru saat diluncurkan. $15 sekali bayar, dengan akses permanen. Tanpa biaya berulang, tanpa perlu membatalkan langganan.",
      button: "Dapatkan Jalur Pribadi",
      team: "Memimpin tim? Jalur Tim sudah termasuk delapan akun pribadi.",
    },
    caption: {
      dashboard: "Dasbor pribadi Anda: modul yang disimpan, hasil asesmen, dan kemajuan, semuanya dalam satu tampilan.",
      result: "Setiap hasil tetap ada di dasbor Anda, sehingga Anda bisa melihatnya lagi sebelum percakapan sulit berikutnya.",
      resultAlt: "Hasil Roda Kehidupan di ponsel: skor untuk delapan area kehidupan, area fokus, dan area terkuat.",
      video: "Baca di komputer atau ponsel, mana pun yang lebih dekat. Setiap modul punya bagian-bagian singkat, bahasa sederhana, dan sesuatu yang praktis untuk dicoba.",
      reading: "Di dalam modul: bagian-bagian singkat yang diakhiri beberapa poin penting untuk dibawa ke minggu Anda.",
      readingAlt: "Sebuah modul terbuka di ponsel, menampilkan bagian Poin Penting.",
    },
  },
} as const;

/* ── Scoped CSS: layout breakpoints, motion, reduced motion ─────────────── */
const CSS = `
.pp { display: flex; flex-direction: column; gap: clamp(4rem, 9vw, 7.5rem); }
.pp-hero, .pp-split, .pp-assess, .pp-modhead, .pp-cta { display: grid; grid-template-columns: minmax(0, 1fr); gap: clamp(2rem, 5vw, 4rem); }
.pp-points { display: grid; grid-template-columns: minmax(0, 1fr); gap: 0 2rem; }
.pp-dl { display: grid; grid-template-columns: minmax(0, 1fr); gap: 0 2rem; margin: 0; }
.pp-steps { position: relative; display: grid; grid-template-columns: minmax(0, 1fr); gap: 2.25rem; padding-left: 2rem; }
.pp-track { position: absolute; left: 5px; top: 8px; bottom: 8px; width: 1px; }
.pp-track-fill { position: absolute; inset: 0; background: ${T.orange}; transform-origin: top; transform: scaleY(0); transition: transform 1.6s cubic-bezier(0.22, 1, 0.36, 1); }
.pp-steps[data-in="1"] .pp-track-fill { transform: scaleY(1); }
.pp-dot { position: absolute; left: -2rem; top: 0.45rem; width: 11px; height: 11px; border-radius: 50%; background: ${T.navyDeep}; box-shadow: 0 0 0 1.5px ${T.orange}; }
.pp-loop { display: none; }
.pp-step { position: relative; opacity: 0; transform: translateY(12px); transition: opacity 0.7s ease-out, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
.pp-steps[data-in="1"] .pp-step { opacity: 1; transform: none; }
.pp-lib { display: grid; grid-template-columns: minmax(0, 1fr); gap: clamp(2.5rem, 5vw, 3.5rem); }
.pp-result { display: grid; grid-template-columns: minmax(0, 1fr); gap: 2rem; align-items: center; }
.pp-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 0; padding: 0; list-style: none; }
.pp-rise { animation: pp-rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) both; }
@keyframes pp-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
.pp-btn { transition: background-color 0.2s ease, transform 0.15s ease; }
.pp-btn:hover { background-color: ${T.navyMid} !important; }
.pp-btn:active { transform: translateY(1px); }
.pp-btn:focus-visible, .pp-acc-btn:focus-visible, .pp-link:focus-visible { outline: 2px solid ${T.orange}; outline-offset: 3px; }
.pp-acc-btn:hover .pp-acc-title { color: ${T.navyMid}; }
.pp-acc-panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.38s cubic-bezier(0.22, 1, 0.36, 1); }
.pp-acc-panel[data-open="1"] { grid-template-rows: 1fr; }
.pp-chev { transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
.pp-link { text-decoration-color: ${T.orange}; text-underline-offset: 0.3em; }
.pp-link:hover { color: ${T.navy} !important; }

@media (min-width: 560px) {
  .pp-points, .pp-dl { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (min-width: 960px) {
  .pp-hero { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); align-items: center; }
  .pp-split { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); }
  .pp-points { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .pp-assess { grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); }
  .pp-modhead { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); align-items: center; }
  .pp-modhead > :first-child { order: 2; }
  .pp-cta { grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); align-items: start; }
  .pp-steps { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 2.5rem; padding-left: 0; padding-top: 2.25rem; }
  .pp-track { left: 0; right: 2.5rem; top: 5px; bottom: auto; width: auto; height: 1px; }
  .pp-track-fill { transform-origin: left; transform: scaleX(0); }
  .pp-steps[data-in="1"] .pp-track-fill { transform: scaleX(1); }
  .pp-dot { left: 0; top: -2.25rem; }
  .pp-loop { display: block; position: absolute; right: 0; top: -4px; }
  .pp-result { grid-template-columns: 15rem minmax(0, 1fr); gap: clamp(3rem, 6vw, 5rem); }
  .pp-lib { grid-template-columns: minmax(0, 1fr) 15rem; gap: clamp(3rem, 6vw, 5rem); align-items: start; }
  .pp-lib > figure { position: sticky; top: 6rem; }
}
@media (prefers-reduced-motion: reduce) {
  .pp-rise { animation: none; }
  .pp-step, .pp-track-fill, .pp-acc-panel, .pp-chev, .pp-btn { transition: none; }
  .pp-step { opacity: 1; transform: none; }
  .pp-track-fill { transform: none !important; }
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

function Caption({ children }: { children: ReactNode }) {
  return (
    <figcaption style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "1.1rem", lineHeight: 1.45, color: T.body, maxWidth: "52ch", marginTop: "1rem" }}>
      {children}
    </figcaption>
  );
}

/* ── BrowserFrame: the same window chrome the Team page uses ────────────── */
function BrowserFrame({ aspect, children }: { aspect: string; children: ReactNode }) {
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
      <div style={{ position: "relative", aspectRatio: aspect }}>{children}</div>
    </div>
  );
}

/* ── LazyVideo: sources attach only once the clip nears the viewport ────── */
function PhoneFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div style={{
      width: "100%", maxWidth: "15rem", margin: "0 auto", padding: "0.5rem", borderRadius: "2rem",
      background: "oklch(16% 0.04 260)", boxShadow: "0 0 0 1px oklch(97% 0.005 80 / 0.14), 0 40px 70px -30px oklch(0% 0 0 / 0.55)",
    }}>
      <div style={{ position: "relative", aspectRatio: "540 / 1080", borderRadius: "1.55rem", overflow: "hidden" }}>
        <Image src={src} alt={alt} fill sizes="240px" style={{ objectFit: "cover" }} />
      </div>
    </div>
  );
}

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
      poster={PERSONAL_PROMO_VIDEO.poster}
      muted
      loop
      playsInline
      controls={still}
      preload="none"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
    >
      {load && <source src={PERSONAL_PROMO_VIDEO.webm} type="video/webm" />}
      {load && <source src={PERSONAL_PROMO_VIDEO.mp4} type="video/mp4" />}
    </video>
  );
}

/* ── Primary button ─────────────────────────────────────────────────────── */
function PrimaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="pp-btn" style={{
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
export default function PersonalPreview({ language, ctaHref = "/pricing" }: { language: string; ctaHref?: string }) {
  const lang = language === "id" ? "id" : "en";
  const c = COPY[lang];
  const [open, setOpen] = useState<boolean[]>(() => c.modules.groups.map((_, i) => i === 0));
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
    <div className="pp" lang={lang}>
      <style>{CSS}</style>

      {/* ── 1. Hero ── */}
      <section className="pp-hero" aria-labelledby="pp-hero-title">
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="pp-rise"><Eyebrow>{c.hero.eyebrow}</Eyebrow></div>
          <h1 id="pp-hero-title" className="pp-rise" style={{
            fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, margin: 0,
            fontSize: "clamp(2.4rem, 5.2vw, 3.9rem)", lineHeight: 1.04, letterSpacing: "-0.01em",
            color: T.navy, textWrap: "balance", animationDelay: "80ms",
          }}>
            {c.hero.title}
          </h1>
          <p className="pp-rise" style={{ ...bodyStyle, fontSize: "1.02rem", maxWidth: "46ch", animationDelay: "160ms" }}>{c.hero.subline}</p>
          <div className="pp-rise" style={{ animationDelay: "240ms", paddingTop: "0.25rem" }}>
            <PrimaryLink href={ctaHref}>{c.hero.cta}</PrimaryLink>
          </div>
        </div>
        <figure className="pp-rise" style={{ margin: "0 auto", width: "100%", maxWidth: "27rem", animationDelay: "200ms" }}>
          <BrowserFrame aspect="886 / 905">
            <Image src={PERSONAL_PROMO_IMAGE} alt={c.caption.dashboard} fill priority sizes="(min-width: 960px) 432px, 100vw" style={{ objectFit: "cover", objectPosition: "top" }} />
          </BrowserFrame>
          <Caption>{c.caption.dashboard}</Caption>
        </figure>
      </section>

      {/* ── 2. Why a personal pathway ── */}
      <section aria-labelledby="pp-why-title" style={{ borderTop: `1px solid ${T.rule}`, paddingTop: "clamp(2.5rem, 5vw, 3.5rem)", display: "flex", flexDirection: "column", gap: "clamp(2.5rem, 5vw, 3.5rem)" }}>
        <div className="pp-split">
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <Eyebrow>{c.why.label}</Eyebrow>
            <h2 id="pp-why-title" style={h2Style()}>{c.why.title}</h2>
          </div>
          <p style={{ ...bodyStyle, alignSelf: "end" }}>{c.why.body}</p>
        </div>
        <ul className="pp-points" style={{ listStyle: "none", margin: 0, padding: 0 }}>
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
      <section aria-labelledby="pp-assess-title" style={{ background: T.band, padding: "clamp(2rem, 5vw, 4rem) clamp(1.25rem, 4.5vw, 3.5rem)" }}>
        <div className="pp-assess">
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <Eyebrow>{c.assessments.label}</Eyebrow>
            <h2 id="pp-assess-title" style={h2Style()}>{c.assessments.title}</h2>
            <p style={bodyStyle}>{c.assessments.body}</p>
            <p style={{
              display: "flex", gap: "0.75rem", alignItems: "flex-start", margin: "0.5rem 0 0",
              padding: "1rem 1.125rem", border: `1px solid oklch(30% 0.12 260 / 0.28)`, borderRadius: 2,
              fontFamily: SANS, fontSize: "0.86rem", lineHeight: 1.6, color: T.charcoal, maxWidth: "60ch",
            }}>
              <Lock aria-hidden="true" size={18} strokeWidth={1.5} color={T.navy} style={{ flexShrink: 0, marginTop: "0.15rem" }} />
              <span>{c.assessments.note}</span>
            </p>
          </div>
          <dl className="pp-dl">
            {c.assessments.list.map(a => (
              <div key={a.name} style={{ borderTop: `1px solid ${T.ruleOnBand}`, padding: "1rem 0 1.25rem" }}>
                <dt style={{ fontFamily: SANS, fontSize: "0.92rem", fontWeight: 700, color: T.navy, marginBottom: "0.3rem" }}>{a.name}</dt>
                <dd style={{ margin: 0, fontFamily: SANS, fontSize: "0.86rem", lineHeight: 1.55, color: T.muted }}>{a.desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── 4. The library ── */}
      <section aria-labelledby="pp-mod-title" style={{ display: "flex", flexDirection: "column", gap: "clamp(2.5rem, 5vw, 3.5rem)" }}>
        <div className="pp-modhead">
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <Eyebrow>{c.modules.label}</Eyebrow>
            <h2 id="pp-mod-title" style={h2Style()}>{c.modules.title}</h2>
            <p style={bodyStyle}>{c.modules.intro}</p>
          </div>
          <figure style={{ margin: "0 auto", width: "100%", maxWidth: "27rem" }}>
            <BrowserFrame aspect={PERSONAL_PROMO_VIDEO.aspect}>
              <LazyVideo label={c.caption.video} />
            </BrowserFrame>
            <Caption>{c.caption.video}</Caption>
          </figure>
        </div>

        <div className="pp-lib">
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <ol style={{ listStyle: "none", margin: 0, padding: 0, borderBottom: `1px solid ${T.rule}` }}>
            {c.modules.groups.map((g, i) => {
              const isOpen = open[i];
              const btnId = `pp-mod-btn-${i}`;
              const panelId = `pp-mod-panel-${i}`;
              return (
                <li key={i} style={{ borderTop: `1px solid ${T.rule}` }}>
                  <h3 style={{ margin: 0 }}>
                    <button
                      id={btnId}
                      type="button"
                      className="pp-acc-btn"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(i)}
                      style={{
                        width: "100%", minHeight: 64, display: "grid",
                        gridTemplateColumns: "2.75rem minmax(0, 1fr) 1.5rem", alignItems: "center", columnGap: "0.875rem",
                        padding: "1rem 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", color: "inherit",
                      }}
                    >
                      <span aria-hidden="true" style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "1.65rem", lineHeight: 1, color: T.navyMid }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="pp-acc-title" style={{ fontFamily: SANS, fontSize: "1rem", fontWeight: 700, lineHeight: 1.35, color: T.charcoal, transition: "color 0.2s ease" }}>
                        {g.title}
                      </span>
                      <ChevronDown aria-hidden="true" className="pp-chev" size={20} strokeWidth={1.5} color={T.navy}
                        style={{ justifySelf: "end", transform: isOpen ? "rotate(180deg)" : "none" }} />
                    </button>
                  </h3>
                  <div id={panelId} role="region" aria-labelledby={btnId} className="pp-acc-panel" data-open={isOpen ? "1" : "0"} inert={!isOpen}>
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ padding: "0 0 1.5rem calc(2.75rem + 0.875rem)", display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <p style={{ ...bodyStyle, fontSize: "0.94rem" }}>{g.body}</p>
                        <p style={{ margin: 0, fontFamily: SANS, fontSize: "0.64rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: T.muted }}>
                          {c.modules.examples}
                        </p>
                        <ul className="pp-chips">
                          {g.examples.map(ex => (
                            <li key={ex} style={{
                              fontFamily: SANS, fontSize: "0.8rem", fontWeight: 600, lineHeight: 1.3, color: T.navy,
                              padding: "0.4rem 0.7rem", border: `1px solid oklch(30% 0.12 260 / 0.3)`, borderRadius: 2,
                            }}>
                              {ex}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          <p style={{ ...bodyStyle, fontSize: "0.92rem", color: T.muted }}>{c.modules.more}</p>
        </div>
        <figure style={{ margin: "0 auto", width: "100%", maxWidth: "15rem" }}>
          <PhoneFrame src={PERSONAL_READING_IMAGE} alt={c.caption.readingAlt} />
          <Caption>{c.caption.reading}</Caption>
        </figure>
        </div>
      </section>

      {/* ── 5. Rhythm (centrepiece) ── */}
      <section aria-labelledby="pp-rhythm-title" style={{ background: T.navyDeep, padding: "clamp(2.5rem, 6vw, 5rem) clamp(1.25rem, 4.5vw, 3.5rem)", display: "flex", flexDirection: "column", gap: "clamp(2.5rem, 5vw, 4rem)" }}>
        <div className="pp-split">
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <Eyebrow onDark>{c.rhythm.label}</Eyebrow>
            <h2 id="pp-rhythm-title" style={h2Style(true)}>{c.rhythm.title}</h2>
          </div>
          <p style={{ ...bodyStyle, color: T.onNavyBody, lineHeight: 1.8, alignSelf: "end" }}>{c.rhythm.intro}</p>
        </div>

        <ol ref={stepsRef} className="pp-steps" style={{ listStyle: "none", margin: 0 }}>
          <span className="pp-track" aria-hidden="true" style={{ background: "oklch(97% 0.005 80 / 0.18)" }}>
            <span className="pp-track-fill" />
          </span>
          <RotateCcw className="pp-loop" aria-hidden="true" size={14} strokeWidth={1.75} color={T.orange} />
          {c.rhythm.steps.map((s, i) => (
            <li key={i} className="pp-step" style={{ transitionDelay: `${150 + i * 180}ms` }}>
              <span className="pp-dot" aria-hidden="true" />
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

        <figure className="pp-result" style={{ margin: 0, borderTop: "1px solid oklch(97% 0.005 80 / 0.14)", paddingTop: "clamp(2rem, 4vw, 3rem)" }}>
          <PhoneFrame src={PERSONAL_RESULT_IMAGE} alt={c.caption.resultAlt} />
          <figcaption style={{
            fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(1.35rem, 2.4vw, 1.75rem)", lineHeight: 1.35, color: T.onNavy, maxWidth: "26ch",
          }}>
            {c.caption.result}
          </figcaption>
        </figure>
      </section>

      {/* ── 6. Closing CTA ── */}
      <section aria-labelledby="pp-cta-title" className="pp-cta" style={{ borderTop: `1px solid ${T.navy}`, paddingTop: "clamp(2.5rem, 5vw, 3.5rem)" }}>
        <h2 id="pp-cta-title" style={{ ...h2Style(), fontSize: "clamp(2.2rem, 4.6vw, 3.4rem)", lineHeight: 1.06 }}>{c.cta.title}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "flex-start" }}>
          <p style={bodyStyle}>{c.cta.body}</p>
          <PrimaryLink href={ctaHref}>{c.cta.button}</PrimaryLink>
          <Link href="/team" className="pp-link" style={{ fontFamily: SANS, fontSize: "0.88rem", lineHeight: 1.6, color: T.muted, textDecorationLine: "underline" }}>
            {c.cta.team}
          </Link>
        </div>
      </section>
    </div>
  );
}
