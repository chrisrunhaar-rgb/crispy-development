"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { PHONE_PORTRAIT_QUERY, PresentRotateNotice, enterPresentFullscreen, usePresentPhone } from "@/components/PresentPhone";
import { useLanguage } from "@/lib/LanguageContext";

type Lang = "en" | "id";
const t = (en: string, id: string, lang: Lang) => (lang === "id" ? id : en);

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const navy = "oklch(22% 0.10 260)";
const ink = "oklch(14% 0.05 260)";
const offWhite = "oklch(96% 0.005 80)";
const orange = "oklch(65% 0.15 45)";
const lightGray = "oklch(88% 0.008 80)";
const muted = "oklch(48% 0.04 260)";
const onNavy = "oklch(82% 0.025 80)";

const SLUG = "vision-casting";
const IMG = `/images/resources/${SLUG}`;
const serif = "Cormorant Garamond, Georgia, serif";
const sans = "Montserrat, sans-serif";

// Slides are designed on a fixed 16:9 canvas and scaled to fit the screen,
// so they look the same on a laptop, a projector or a TV.
const W = 1600;
const H = 900;
const MIN_WIDTH = 768;
const IDLE_MS = 2500;

// ─── Content ──────────────────────────────────────────────────────────────────
type Pair = { en: string; id: string };
type Direction = "N" | "E" | "S" | "W";

type ChannelData = {
  id: string;
  direction: Direction;
  colorAccent: string;
  label: Pair;
  tagline: Pair;
  body: Pair;
  anchorTitle: Pair;
  anchorRef: Pair;
  anchorText: Pair;
  question: Pair;
  practice: Pair;
};

const CHANNELS: ChannelData[] = [
  {
    id: "passion",
    direction: "S",
    colorAccent: "oklch(55% 0.18 20)",
    label: { en: "Passion", id: "Gairah" },
    tagline: { en: "What cannot be ignored", id: "Apa yang tidak bisa diabaikan" },
    body: {
      en: "Vision in Scripture rarely starts with a strategy. It starts with a grief, a longing, or an unease that will not let go. A passion is not a preference. A preference is what you enjoy. A passion is what you cannot put down.",
      id: "Visi dalam Kitab Suci jarang dimulai dari strategi. Ia dimulai dari kesedihan, kerinduan, atau kegelisahan yang tidak mau pergi. Gairah berbeda dari sekadar kesukaan. Kesukaan adalah apa yang Anda nikmati. Gairah adalah apa yang tidak bisa Anda tinggalkan.",
    },
    anchorTitle: { en: "Nehemiah: grief that became a mission", id: "Nehemia: kesedihan yang menjadi misi" },
    anchorRef: { en: "Nehemiah 1:1-11", id: "Nehemia 1:1-11" },
    anchorText: {
      en: "When Nehemiah heard that Jerusalem's wall lay broken, he wept, fasted and prayed for days, long before he had a plan, permission or a team. One of Scripture's most carefully led projects began with a concern he could not release.",
      id: "Ketika Nehemia mendengar tembok Yerusalem runtuh, ia menangis, berpuasa, dan berdoa selama berhari-hari, jauh sebelum ia punya rencana, izin, atau tim. Salah satu proyek kepemimpinan paling matang dalam Kitab Suci dimulai dari kekhawatiran yang tak bisa ia lepaskan.",
    },
    question: {
      en: "What concern have you been carrying for more than a year that you cannot put down?",
      id: "Kekhawatiran apa yang sudah Anda tanggung lebih dari setahun yang tidak bisa Anda tinggalkan?",
    },
    practice: {
      en: "Write down the one issue that consistently stirs or breaks your heart. Bring it to prayer for four weeks. Notice whether it grows or fades.",
      id: "Tuliskan satu masalah yang selalu menggerakkan atau mematahkan hati Anda. Bawa dalam doa selama empat minggu. Perhatikan apakah itu tumbuh atau memudar.",
    },
  },
  {
    id: "dreams",
    direction: "E",
    colorAccent: "oklch(50% 0.18 295)",
    label: { en: "Dreams", id: "Mimpi" },
    tagline: { en: "What stirs the imagination", id: "Apa yang menggerakkan imajinasi" },
    body: {
      en: "Scripture shows God speaking through dreams. Joseph dreams of sheaves bowing to his sheaf. Daniel interprets a king's dream. These are literal dreams, but also a picture of the future that stirs in a quiet mind. Scripture treats them as data, not fantasy.",
      id: "Kitab Suci menunjukkan Allah berbicara melalui mimpi. Yusuf bermimpi tentang berkas gandum yang membungkuk padanya. Daniel menafsirkan mimpi seorang raja. Ini mimpi harfiah, tetapi juga gambaran masa depan yang muncul dalam hati yang tenang. Kitab Suci memperlakukannya sebagai data, bukan khayalan.",
    },
    anchorTitle: { en: "Joseph: the dream that cost everything", id: "Yusuf: mimpi yang menuntut segalanya" },
    anchorRef: { en: "Genesis 37:5-11", id: "Kejadian 37:5-11" },
    anchorText: {
      en: "Joseph's dreams of sheaves and stars bowing to him cost him his brothers' trust, then years of slavery and prison. They were still from God, and came true in ways he could not have planned.",
      id: "Mimpi Yusuf tentang berkas dan bintang yang membungkuk padanya membuatnya kehilangan kepercayaan saudara-saudaranya, lalu bertahun-tahun sebagai budak dan tahanan. Mimpi itu tetap dari Allah, dan menjadi nyata dengan cara yang tak pernah ia rencanakan.",
    },
    question: {
      en: "What picture of the future keeps returning to you when you are quiet enough to hear it?",
      id: "Gambaran masa depan apa yang terus kembali kepada Anda ketika Anda cukup tenang untuk mendengarnya?",
    },
    practice: {
      en: "Keep a notebook by your bed for a month. Write down what stirs in you on waking. Bring it to prayer once a week and watch for a pattern.",
      id: "Simpan buku catatan di samping tempat tidur selama sebulan. Tuliskan apa yang muncul saat Anda bangun. Bawa dalam doa sekali seminggu dan perhatikan polanya.",
    },
  },
  {
    id: "revelation",
    direction: "N",
    colorAccent: "oklch(22% 0.10 260)",
    label: { en: "Revelation", id: "Wahyu" },
    tagline: { en: "What God speaks directly", id: "Apa yang Allah ucapkan langsung" },
    body: {
      en: "Paul receives a vision of a man from Macedonia begging him to come, and the gospel crosses into Europe. Peter receives a vision that opens the gospel to the Gentiles. These moments are rare, but real. A leader who leaves no room for them will miss them.",
      id: "Paulus menerima penglihatan seorang laki-laki Makedonia yang memohon kedatangannya, dan Injil menyeberang ke Eropa. Petrus menerima penglihatan yang membuka Injil bagi bangsa-bangsa lain. Saat-saat ini jarang, tetapi nyata. Pemimpin yang tidak menyediakan ruang bagi mereka akan melewatkannya.",
    },
    anchorTitle: { en: "Paul: a vision that redirected a continent", id: "Paulus: penglihatan yang mengubah arah benua" },
    anchorRef: { en: "Acts 16:6-10", id: "Kisah Para Rasul 16:6-10" },
    anchorText: {
      en: "Paul was already mid-mission, planning another route, when a night vision of a Macedonian man changed his direction entirely. He did not delay: \"We got ready at once.\" Europe's church is rooted in a vision Paul received in his sleep.",
      id: "Paulus sedang di tengah misi, merencanakan arah lain, ketika penglihatan malam tentang seorang laki-laki Makedonia sepenuhnya mengubah arahnya. Ia tidak menunda: \"kami segera bersiap berangkat.\" Gereja di Eropa berakar pada penglihatan yang Paulus terima saat tidur.",
    },
    question: {
      en: "When did you last make unhurried space for God to speak, not to confirm your plan but to surprise you?",
      id: "Kapan terakhir Anda memberi ruang tenang bagi Allah untuk berbicara, bukan untuk menegaskan rencana Anda, tetapi untuk mengejutkan Anda?",
    },
    practice: {
      en: "Set aside one hour this week with no agenda: no reading plan, no prayer list. Just silence, and one question: \"Lord, is there anything you want to show me?\"",
      id: "Sisihkan satu jam minggu ini tanpa agenda: tanpa rencana bacaan, tanpa daftar doa. Hanya keheningan, dan satu pertanyaan: \"Tuhan, adakah yang ingin Engkau tunjukkan kepadaku?\"",
    },
  },
  {
    id: "others",
    direction: "W",
    colorAccent: "oklch(38% 0.12 155)",
    label: { en: "Others", id: "Sesama" },
    tagline: { en: "What God reveals through community", id: "Apa yang Allah nyatakan melalui komunitas" },
    body: {
      en: "This is the most underestimated channel. God rarely gives one leader the whole picture. Each team member sees a part, and a leader who listens only to their own passion, dreams and revelation carries an incomplete picture.",
      id: "Ini saluran yang paling sering diremehkan. Allah jarang memberikan gambaran utuh kepada satu pemimpin saja. Setiap anggota tim melihat sebagiannya, dan pemimpin yang hanya mendengarkan gairah, mimpi, dan wahyunya sendiri membawa gambaran yang belum lengkap.",
    },
    anchorTitle: { en: "Antioch: a vision born in community", id: "Antiokhia: visi yang lahir dalam komunitas" },
    anchorRef: { en: "Acts 13:1-3", id: "Kisah Para Rasul 13:1-3" },
    anchorText: {
      en: "While the church at Antioch worshipped and fasted, the Holy Spirit said: \"Set apart for me Barnabas and Saul for the work I have called them to.\" The call came to the community first. The first cross-cultural mission in Christian history began as shared discernment, not personal ambition.",
      id: "Saat gereja di Antiokhia beribadah dan berpuasa, Roh Kudus berkata: \"Pisahkanlah Barnabas dan Saulus bagi-Ku untuk pekerjaan yang telah Kutentukan.\" Panggilan itu datang kepada komunitas lebih dulu. Perjalanan lintas budaya pertama dalam sejarah Kekristenan dimulai dari penegasan bersama, bukan ambisi pribadi.",
    },
    question: {
      en: "Who in your team have you not yet asked what they see?",
      id: "Siapa dalam tim Anda yang belum Anda tanya apa yang mereka lihat?",
    },
    practice: {
      en: "Schedule a conversation with each team member this month. Ask one question: \"What do you see when you imagine this team three years from now?\" Then just say, tell me more.",
      id: "Jadwalkan percakapan dengan setiap anggota tim bulan ini. Ajukan satu pertanyaan: \"Apa yang Anda lihat ketika membayangkan tim ini tiga tahun dari sekarang?\" Lalu cukup katakan, ceritakan lebih banyak.",
    },
  },
];

type TestData = { id: string; title: Pair; question: Pair };

const TESTS: TestData[] = [
  {
    id: "time",
    title: { en: "Time", id: "Waktu" },
    question: {
      en: "Has this vision survived at least three months of prayer and patience?",
      id: "Apakah visi ini telah bertahan setidaknya tiga bulan doa dan kesabaran?",
    },
  },
  {
    id: "scripture",
    title: { en: "Scripture", id: "Kitab Suci" },
    question: {
      en: "Does it align with God's character and the call to make disciples of every nation?",
      id: "Apakah visi ini selaras dengan karakter Allah dan panggilan untuk menjadikan semua bangsa murid?",
    },
  },
  {
    id: "community",
    title: { en: "Community", id: "Komunitas" },
    question: {
      en: "Have at least three trusted people independently confirmed it?",
      id: "Apakah setidaknya tiga orang yang dipercaya telah secara mandiri mengonfirmasi visi ini?",
    },
  },
  {
    id: "sacrifice",
    title: { en: "Sacrifice", id: "Pengorbanan" },
    question: {
      en: "Are you willing to pursue it even if it costs comfort or reputation?",
      id: "Apakah Anda bersedia mengejar visi ini meskipun mengorbankan kenyamanan atau reputasi?",
    },
  },
  {
    id: "fruit",
    title: { en: "Fruit", id: "Buah" },
    question: {
      en: "Is it producing love, joy, peace, patience, kindness, goodness, faithfulness, gentleness and self control, or the opposite?",
      id: "Apakah ini menghasilkan kasih, sukacita, damai, kesabaran, kemurahan, kebaikan, kesetiaan, kelembutan, dan penguasaan diri, atau sebaliknya?",
    },
  },
];

const KEY_TAKEAWAYS: { lead: Pair; rest: Pair }[] = [
  {
    lead: { en: "Vision is a picture, not a plan.", id: "Visi adalah gambaran, bukan rencana." },
    rest: {
      en: "It is a clear picture of what could be, fuelled by conviction that it should be. Without it, leaders manage. With it, they mobilise.",
      id: "Ini gambaran jelas tentang apa yang bisa terjadi, didorong keyakinan bahwa itu seharusnya terjadi. Tanpa itu, pemimpin hanya mengelola. Dengan itu, mereka menggerakkan.",
    },
  },
  {
    lead: { en: "Four channels, one vision.", id: "Empat saluran, satu visi." },
    rest: {
      en: "We see God speaking through passion, dreams, revelation and others. When we listen through all four, the vision grows stronger.",
      id: "Kita melihat Allah berbicara melalui gairah, mimpi, wahyu, dan sesama. Ketika kita mendengarkan melalui keempatnya, visi menjadi semakin kuat.",
    },
  },
  {
    lead: { en: "Vision sits inside a larger story.", id: "Visi berada di dalam kisah yang lebih besar." },
    rest: {
      en: "Every team vision is a small piece of the Great Commission, Jesus' call to make disciples of every nation. That is the difference between leading a project and stewarding a calling.",
      id: "Setiap visi tim adalah bagian kecil dari Amanat Agung, panggilan Yesus untuk menjadikan semua bangsa murid. Itulah perbedaan antara memimpin proyek dan menjaga panggilan.",
    },
  },
  {
    lead: { en: "Vision must be repeated, not announced.", id: "Visi perlu diulang, bukan sekadar diumumkan." },
    rest: {
      en: "It takes seven to ten retellings before it settles. Use story, not slides. Invite a team in, do not just announce to them.",
      id: "Visi perlu diulang tujuh hingga sepuluh kali sebelum benar-benar menetap. Gunakan cerita, bukan sekadar slide. Ajak tim masuk, jangan hanya umumkan kepada mereka.",
    },
  },
];

const THIS_WEEK: Pair[] = [
  {
    en: "Run a listening round: a 60 minute conversation with each team member. Ask what they see for this team in three years, then just listen.",
    id: "Lakukan Putaran Mendengarkan: percakapan 60 menit dengan setiap anggota tim. Tanyakan apa yang mereka lihat untuk tim ini tiga tahun ke depan, lalu cukup dengarkan.",
  },
  {
    en: "Walk the Vision Compass together in a 90 minute team meeting: passion, dreams, revelation and others. Ask which channel speaks loudest to each person.",
    id: "Jalani Kompas Visi bersama dalam rapat tim 90 menit: gairah, mimpi, wahyu, dan sesama. Tanyakan saluran mana yang paling kuat berbicara kepada masing-masing orang.",
  },
  {
    en: "Test your current vision against the five tests: time, Scripture, community, sacrifice and fruit. Notice which one gives you pause.",
    id: "Uji visi Anda saat ini dengan lima pengujian: waktu, Kitab Suci, komunitas, pengorbanan, dan buah. Perhatikan pengujian mana yang membuat Anda ragu.",
  },
];

const QUESTIONS: Pair[] = [
  {
    en: "What concern have you been carrying for more than a year that you cannot put down?",
    id: "Kekhawatiran apa yang sudah Anda tanggung lebih dari setahun yang tidak bisa Anda tinggalkan?",
  },
  {
    en: "Who on your team have you not yet asked what they see?",
    id: "Siapa dalam tim Anda yang belum Anda tanya apa yang mereka lihat?",
  },
  {
    en: "Of the five tests, time, Scripture, community, sacrifice, fruit, which one does your current vision struggle to pass?",
    id: "Dari lima pengujian, waktu, Kitab Suci, komunitas, pengorbanan, buah, pengujian mana yang paling sulit dilewati oleh visi Anda saat ini?",
  },
];

// ─── Slide building blocks (fixed px on the 1600×900 canvas) ─────────────────
const bigTitle: React.CSSProperties = {
  fontFamily: serif, fontWeight: 600, color: navy, lineHeight: 1.06, margin: 0, fontSize: 104, textAlign: "center",
};
const midTitle: React.CSSProperties = { ...bigTitle, fontSize: 72 };
const kicker: React.CSSProperties = {
  fontFamily: sans, fontSize: 20, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: orange, margin: 0, textAlign: "center",
};
const body: React.CSSProperties = { fontFamily: sans, fontSize: 28, lineHeight: 1.5, color: muted, margin: 0, textAlign: "center" };
const card: React.CSSProperties = {
  background: "white", borderRadius: 18, boxShadow: "0 1px 2px oklch(22% 0.10 260 / 0.06), 0 8px 24px oklch(22% 0.10 260 / 0.06)",
};
const rule = (w = 96) => <div aria-hidden="true" style={{ width: w, height: 4, background: orange, borderRadius: 2 }} />;

// Build-up reveal: hidden parts keep their space so the slide never jumps
const show = (on: boolean): React.CSSProperties => ({
  opacity: on ? 1 : 0,
  transform: on ? "none" : "translateY(14px)",
  transition: "opacity 0.5s ease, transform 0.5s ease",
});

// Each channel's arrow points towards the centre of the compass,
// so passion (bottom) points up and revelation (top) points down.
const ARROW_TURN: Record<Direction, number> = { S: 0, W: 90, N: 180, E: 270 };
function DirArrow({ dir, size, color }: { dir: Direction; size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false"
      style={{ display: "block", transform: `rotate(${ARROW_TURN[dir]}deg)` }}>
      <path d="M12 20V4M5 11l7-7 7 7" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// The compass overview, same picture as the module:
// the Crispy logo in the centre with the four channels around it.
function CompassSlide({ lang }: { lang: Lang }) {
  const posFor: Record<Direction, React.CSSProperties> = {
    N: { left: "50%", top: 0, transform: "translateX(-50%)" },
    E: { right: 0, top: "50%", transform: "translateY(-50%)" },
    S: { left: "50%", bottom: 0, transform: "translateX(-50%)" },
    W: { left: 0, top: "50%", transform: "translateY(-50%)" },
  };
  return (
    <>
      <p style={kicker}>{t("The Vision Compass", "Kompas Visi", lang)}</p>
      <h2 style={{ ...midTitle, fontSize: 60 }}>{t("Four channels, one compass", "Empat saluran, satu kompas", lang)}</h2>
      <div style={{ position: "relative", width: 620, height: 560 }}>
        <img src="/logo-icon.png" alt="" aria-hidden="true" width={300} height={300}
          style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", display: "block" }} />
        {CHANNELS.map(c => (
          <div key={c.id} style={{
            position: "absolute", ...posFor[c.direction],
            minWidth: 170, padding: "12px 26px", borderRadius: 999, background: "white",
            border: `3px solid ${c.colorAccent}`, boxShadow: "0 4px 16px oklch(22% 0.10 260 / 0.12)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
          }}>
            <DirArrow dir={c.direction} size={26} color={c.colorAccent} />
            <span style={{ fontFamily: sans, fontSize: 24, fontWeight: 700, color: navy, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {t(c.label.en, c.label.id, lang)}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

function ChannelDetailSlide({ n, lang, step }: { n: number; lang: Lang; step: number }) {
  const c = CHANNELS[n];
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <span style={{ flexShrink: 0, width: 100, height: 100, borderRadius: 999, background: c.colorAccent, color: "white", fontFamily: serif, fontSize: 40, fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><DirArrow dir={c.direction} size={52} color="white" /></span>
        <div>
          <p style={{ ...kicker, textAlign: "left", marginBottom: 8 }}>{t(`Channel ${n + 1} of 4`, `Saluran ${n + 1} dari 4`, lang)}</p>
          <h2 style={{ ...midTitle, textAlign: "left", fontSize: 52 }}>{t(c.label.en, c.label.id, lang)}</h2>
          <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: 26, color: muted, margin: "6px 0 0" }}>{t(c.tagline.en, c.tagline.id, lang)}</p>
        </div>
      </div>
      <p style={{ ...body, textAlign: "left", maxWidth: 1180, fontSize: 24 }}>{t(c.body.en, c.body.id, lang)}</p>
      <div style={{ ...card, ...show(step >= 1), borderLeft: `8px solid ${c.colorAccent}`, padding: "22px 32px" }}>
        <p style={{ fontFamily: sans, fontSize: 15, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: muted, margin: "0 0 8px" }}>
          {t(c.anchorTitle.en, c.anchorTitle.id, lang)}
          <span style={{ color: orange, marginLeft: 14 }}>{t(c.anchorRef.en, c.anchorRef.id, lang)}</span>
        </p>
        <p style={{ fontFamily: sans, fontSize: 20, lineHeight: 1.45, color: navy, margin: 0 }}>{t(c.anchorText.en, c.anchorText.id, lang)}</p>
      </div>
      <div style={{ ...card, ...show(step >= 2), borderLeft: `8px solid ${navy}`, padding: "22px 32px" }}>
        <p style={{ fontFamily: sans, fontSize: 15, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: muted, margin: "0 0 8px" }}>
          {t("Try this", "Coba ini", lang)}
        </p>
        <p style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 500, fontSize: 24, lineHeight: 1.3, color: navy, margin: "0 0 8px" }}>{t(c.question.en, c.question.id, lang)}</p>
        <p style={{ fontFamily: sans, fontSize: 18, lineHeight: 1.45, color: muted, margin: 0 }}>{t(c.practice.en, c.practice.id, lang)}</p>
      </div>
    </div>
  );
}

function FiveTestsSlide({ step, lang }: { step: number; lang: Lang }) {
  return (
    <>
      <p style={kicker}>{t("Five tests", "Lima pengujian", lang)}</p>
      <h2 style={{ ...midTitle, fontSize: 58 }}>{t("Test the vision before you cast it", "Uji visi sebelum Anda menebarkannya", lang)}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 18, width: "100%" }}>
        {TESTS.map((s, n) => (
          <div key={s.id} style={{ ...card, ...show(step >= n), padding: "28px 24px", borderTop: `6px solid ${orange}`, display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ fontFamily: sans, fontSize: 18, fontWeight: 700, color: orange, letterSpacing: "0.08em", margin: 0 }}>{n + 1}</p>
            <p style={{ fontFamily: serif, fontSize: 32, fontWeight: 600, color: navy, margin: 0, lineHeight: 1.15 }}>{t(s.title.en, s.title.id, lang)}</p>
            <p style={{ fontFamily: sans, fontSize: 21, lineHeight: 1.45, color: muted, margin: 0 }}>{t(s.question.en, s.question.id, lang)}</p>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── The slides ───────────────────────────────────────────────────────────────
// `steps` is how many clicks a slide has: each click reveals the next part.
type Slide = { key: string; dark?: boolean; steps?: number; render: (lang: Lang, step: number) => React.ReactNode };

const SLIDES: Slide[] = [
  {
    key: "title",
    dark: true,
    render: lang => (
      <>
        <p style={kicker}>{t("Leadership · Guide", "Kepemimpinan · Panduan", lang)}</p>
        <h1 style={{ ...bigTitle, fontSize: 120, color: offWhite, maxWidth: 1250 }}>{t("Vision Casting", "Menebar Visi", lang)}</h1>
        {rule(120)}
        <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: 36, lineHeight: 1.35, color: onNavy, margin: 0, textAlign: "center", maxWidth: 1100 }}>
          {t('"Where there is no revelation, people cast off restraint."', '"Bila tidak ada wahyu ilahi, bangsa itu menjadi liar."', lang)}
        </p>
        <p style={kicker}>{t("Proverbs 29:18", "Amsal 29:18", lang)}</p>
      </>
    ),
  },
  {
    key: "intro",
    steps: 2,
    render: (lang, step) => (
      <>
        <p style={kicker}>{t("The model", "Model ini", lang)}</p>
        <h2 style={midTitle}>{t("What a vision actually is", "Apa sebenarnya visi itu", lang)}</h2>
        <p style={{ ...body, maxWidth: 1200 }}>
          {t("A vision is a clear picture of what could be, held together by the conviction that it should be. It is not a goal or a strategy. It is a picture that moves a team toward a future they do not yet have.",
            "Visi adalah gambaran jelas tentang apa yang bisa terjadi, disertai keyakinan bahwa itu seharusnya terjadi. Ini bukan tujuan, bukan strategi. Ini gambaran yang menggerakkan tim menuju masa depan yang belum mereka miliki.", lang)}
        </p>
        <p style={{ ...body, ...show(step >= 1), maxWidth: 1200 }}>
          {t("In a Christian context, our vision sits inside the Great Commission: Jesus' ongoing call to make disciples of every nation.",
            "Dalam konteks Kristen, visi kita berada di dalam Amanat Agung: panggilan Yesus yang terus berlangsung untuk menjadikan semua bangsa murid-Nya.", lang)}
          <br />
          {t("Your vision is only a small piece of a larger one.", "Visi Anda hanyalah bagian kecil dari visi yang lebih besar.", lang)}
        </p>
      </>
    ),
  },
  {
    key: "compass-intro",
    dark: true,
    render: lang => (
      <>
        <p style={kicker}>{t("The Vision Compass", "Kompas Visi", lang)}</p>
        <h2 style={{ ...midTitle, color: offWhite }}>{t("Vision rarely comes from one direction", "Visi jarang datang dari satu arah", lang)}</h2>
        <p style={{ ...body, color: onNavy, maxWidth: 1100 }}>
          {t("We see God speaking through at least four channels.",
            "Kita melihat Allah berbicara melalui setidaknya empat saluran.", lang)}
          <br />
          {t("When we listen through all of them, the vision grows stronger.",
            "Ketika kita mendengarkan melalui semuanya, visi menjadi semakin kuat.", lang)}
        </p>
      </>
    ),
  },
  // The compass once, then each channel in turn
  { key: "compass", render: lang => <CompassSlide lang={lang} /> },
  ...CHANNELS.map((c, n): Slide => (
    { key: `channel-${n + 1}`, steps: 3, render: (lang, step) => <ChannelDetailSlide n={n} lang={lang} step={step} /> }
  )),
  {
    key: "five-tests-intro",
    dark: true,
    render: lang => (
      <>
        <p style={kicker}>{t("The Discernment Audit", "Audit Penegasan", lang)}</p>
        <h2 style={{ ...midTitle, color: offWhite }}>{t("Not every strong feeling is vision", "Tidak setiap perasaan kuat adalah visi", lang)}</h2>
        <p style={{ ...body, color: onNavy, maxWidth: 1150 }}>
          {t("Andy Stanley's Visioneering offers five questions that help a leader tell a God-given vision apart from a good idea, a personal ambition, or a fear reaction.",
            "Visioneering karya Andy Stanley menawarkan lima pertanyaan yang membantu pemimpin membedakan visi dari Allah dengan ide yang baik, ambisi pribadi, atau reaksi karena takut.", lang)}
        </p>
      </>
    ),
  },
  {
    key: "five-tests-overview",
    steps: 5,
    render: (lang, step) => <FiveTestsSlide step={step} lang={lang} />,
  },
  {
    key: "faith-anchor",
    dark: true,
    steps: 2,
    render: (lang, step) => (
      <>
        <p style={kicker}>{t("Faith anchor", "Jangkar iman", lang)}</p>
        <h2 style={{ ...bigTitle, color: offWhite, fontStyle: "italic", fontSize: 66, maxWidth: 1300 }}>
          {t('"Where there is no revelation, people cast off restraint."', '"Bila tidak ada wahyu ilahi, bangsa itu menjadi liar."', lang)}
        </h2>
        <p style={kicker}>{t("Proverbs 29:18", "Amsal 29:18", lang)}</p>
        <div style={show(step >= 1)}>{rule(120)}</div>
        <p style={{ ...body, ...show(step >= 1), color: onNavy, maxWidth: 1150 }}>
          {t("In a Christian context, our vision sits inside the Great Commission: Jesus' ongoing call to make disciples of every nation. Knowing this turns leading a project into stewarding a calling.",
            "Dalam konteks Kristen, visi kita berada di dalam Amanat Agung: panggilan Yesus yang terus berlangsung untuk menjadikan semua bangsa murid-Nya. Menyadari ini mengubah memimpin proyek menjadi menjaga sebuah panggilan.", lang)}
        </p>
      </>
    ),
  },
  {
    key: "key-takeaways",
    steps: 4,
    render: (lang, step) => (
      <>
        <p style={kicker}>{t("Key takeaways", "Poin utama", lang)}</p>
        <h2 style={{ ...midTitle, fontSize: 58 }}>{t("Four things to carry forward", "Empat hal untuk dibawa pulang", lang)}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26, width: "100%" }}>
          {KEY_TAKEAWAYS.map((k, n) => (
            <div key={n} style={{ ...card, ...show(step >= n), padding: "28px 30px", borderTop: `6px solid ${orange}` }}>
              <p style={{ fontFamily: sans, fontSize: 17, fontWeight: 700, color: orange, letterSpacing: "0.1em", margin: "0 0 10px" }}>{n + 1}</p>
              <p style={{ fontFamily: serif, fontSize: 25, fontWeight: 600, color: navy, margin: "0 0 10px", lineHeight: 1.25 }}>{t(k.lead.en, k.lead.id, lang)}</p>
              <p style={{ fontFamily: sans, fontSize: 17, lineHeight: 1.45, color: muted, margin: 0 }}>{t(k.rest.en, k.rest.id, lang)}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    key: "this-week",
    steps: 3,
    render: (lang, step) => (
      <>
        <p style={kicker}>{t("Put it into practice", "Terapkan minggu ini", lang)}</p>
        <h2 style={{ ...midTitle, fontSize: 58 }}>{t("Three things to do this week", "Tiga hal untuk dilakukan minggu ini", lang)}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, width: "100%" }}>
          {THIS_WEEK.map((w, n) => (
            <div key={n} style={{ ...card, ...show(step >= n), padding: "32px 30px", display: "flex", flexDirection: "column", gap: 18 }}>
              <span style={{ width: 56, height: 56, borderRadius: 999, background: orange, color: "white", fontFamily: serif, fontSize: 32, fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{n + 1}</span>
              <p style={{ fontFamily: sans, fontSize: 20, lineHeight: 1.45, fontWeight: 600, color: navy, margin: 0 }}>{t(w.en, w.id, lang)}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    key: "questions",
    steps: 3,
    render: (lang, step) => (
      <>
        <p style={kicker}>{t("Talk about it", "Diskusikan", lang)}</p>
        <h2 style={{ ...midTitle, fontSize: 62 }}>{t("Questions to sit with", "Pertanyaan untuk direnungkan", lang)}</h2>
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 20, width: 1200 }}>
          {QUESTIONS.map((q, n) => (
            <li key={n} style={{ ...card, ...show(step >= n), display: "flex", alignItems: "center", gap: 28, padding: "24px 34px" }}>
              <span style={{ flexShrink: 0, fontFamily: serif, fontSize: 56, fontWeight: 600, color: orange, lineHeight: 1, width: 42 }}>{n + 1}</span>
              <span style={{ fontFamily: serif, fontSize: 30, fontWeight: 500, color: navy, lineHeight: 1.25 }}>{t(q.en, q.id, lang)}</span>
            </li>
          ))}
        </ol>
      </>
    ),
  },
];

const stepsOf = (index: number) => SLIDES[index].steps ?? 1;

// One slide on the 1600×900 canvas, with a quiet footer
function SlideFrame({ index, lang, step }: { index: number; lang: Lang; step: number }) {
  const s = SLIDES[index];
  const isTitle = index === 0;
  const dark = !!s.dark;
  return (
    <div style={{ width: W, height: H, position: "relative", background: dark ? navy : offWhite, overflow: "hidden", fontFamily: sans }}>
      {isTitle && (
        <img src={`${IMG}/hero.jpg`} alt="" aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.18, mixBlendMode: "luminosity" }} />
      )}
      <div aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 10, background: orange }} />
      <div style={{ position: "absolute", inset: "64px 120px 110px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 34 }}>
        {s.render(lang, step)}
      </div>
      {!isTitle && (
        <div style={{ position: "absolute", left: 120, right: 120, bottom: 44, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 14, fontSize: 17, fontWeight: 600, color: dark ? onNavy : muted, letterSpacing: "0.04em" }}>
            <img src="/logo-icon.png" alt="" aria-hidden="true" width={30} height={30} style={{ display: "block" }} />
            {t("Vision Casting", "Menebar Visi", lang)}
          </span>
          <span style={{ fontSize: 17, fontWeight: 700, color: dark ? onNavy : muted }}>{index + 1} / {SLIDES.length}</span>
        </div>
      )}
      {isTitle && (
        <img src="/logo-icon.png" alt="Crispy Development" width={40} height={40} style={{ position: "absolute", right: 56, bottom: 44, display: "block" }} />
      )}
    </div>
  );
}

export default function PresentClient() {
  const { lang: ctxLang, setLang } = useLanguage();
  const lang = (ctxLang === "id" ? "id" : "en") as Lang;
  // Position = slide index plus how many builds of that slide are showing
  const [pos, setPos] = useState({ i: 0, s: 0 });
  const { i, s: step } = pos;
  const [isFull, setIsFull] = useState(false);
  const phone = usePresentPhone(setIsFull);
  const [uiVisible, setUiVisible] = useState(true);
  const [overview, setOverview] = useState(false);
  const [blank, setBlank] = useState(false);
  const [started, setStarted] = useState(false);
  const [tooSmall, setTooSmall] = useState(false);
  const [scale, setScale] = useState(0.5);
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchX = useRef<number | null>(null);
  const last = SLIDES.length - 1;

  const atEnd = i === last && step === stepsOf(last) - 1;
  const go = useCallback((n: number) => { setBlank(false); setPos({ i: Math.max(0, Math.min(last, n)), s: 0 }); }, [last]);
  const next = useCallback(() => {
    setBlank(false);
    setPos(p => p.s < stepsOf(p.i) - 1 ? { i: p.i, s: p.s + 1 } : p.i < last ? { i: p.i + 1, s: 0 } : p);
  }, [last]);
  const prev = useCallback(() => {
    setBlank(false);
    setPos(p => p.s > 0 ? { i: p.i, s: p.s - 1 } : p.i > 0 ? { i: p.i - 1, s: stepsOf(p.i - 1) - 1 } : p);
  }, []);

  const toggleFull = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    else enterPresentFullscreen(rootRef.current);
  }, []);

  const wake = useCallback(() => {
    setUiVisible(true);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setUiVisible(false), IDLE_MS);
  }, []);

  // Fit the 16:9 canvas into whatever space the screen gives us
  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setScale(Math.min(el.clientWidth / W, el.clientHeight / H));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [tooSmall]);

  useEffect(() => {
    const mq = window.matchMedia(PHONE_PORTRAIT_QUERY);
    const upd = () => setTooSmall(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      // Let a focused button handle its own Space press
      if (k === " " && (e.target as HTMLElement)?.closest?.("button, a")) return;
      if (overview) {
        if (k === "Escape" || k === "g" || k === "G") { e.preventDefault(); setOverview(false); }
        return;
      }
      setStarted(true);
      if (["ArrowRight", "ArrowDown", "PageDown", " ", "n", "N"].includes(k)) { e.preventDefault(); next(); }
      else if (["ArrowLeft", "ArrowUp", "PageUp", "Backspace", "p", "P"].includes(k)) { e.preventDefault(); prev(); }
      else if (k === "Home") { e.preventDefault(); go(0); }
      else if (k === "End") { e.preventDefault(); go(last); }
      else if (k === "f" || k === "F") { e.preventDefault(); toggleFull(); }
      else if (k === "g" || k === "G") { e.preventDefault(); setOverview(true); }
      else if (k === "b" || k === "B" || k === ".") { e.preventDefault(); setBlank(b => !b); }
      else if (k === "l" || k === "L") { e.preventDefault(); setLang(lang === "en" ? "id" : "en"); }
      else if (k === "Escape") setBlank(false);
      wake();
    };
    const onFull = () => setIsFull(!!document.fullscreenElement);
    window.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFull);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFull);
    };
  }, [overview, next, prev, go, last, toggleFull, wake, lang, setLang]);

  useEffect(() => {
    idleTimer.current = setTimeout(() => setUiVisible(false), IDLE_MS);
    return () => { if (idleTimer.current) clearTimeout(idleTimer.current); };
  }, [wake]);

  // Preload the hero image so the first slide never waits
  useEffect(() => {
    const im = new Image();
    im.src = `${IMG}/hero.jpg`;
  }, []);

  // Stop the page behind from scrolling while presenting
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prevOverflow; };
  }, []);

  const moduleHref = `/resources/${SLUG}`;
  const showUi = uiVisible || !started || overview;

  if (tooSmall) return <PresentRotateNotice lang={lang} moduleHref={moduleHref} />;

  const pill: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 44, height: 44, padding: "0 12px",
    background: "transparent", border: "none", borderRadius: 10, color: offWhite, cursor: "pointer", fontFamily: sans, fontWeight: 700, fontSize: 13,
  };
  const sep = <span aria-hidden="true" style={{ width: 1, height: 24, background: "oklch(100% 0 0 / 0.18)", margin: "0 4px" }} />;

  return (
    <div ref={rootRef} onMouseMove={wake}
      onTouchStart={e => { touchX.current = e.touches[0].clientX; wake(); }}
      onTouchEnd={e => {
        if (touchX.current === null || overview) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) { setStarted(true); if (dx < 0) next(); else prev(); }
        touchX.current = null;
      }}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: ink, fontFamily: sans, cursor: showUi ? "default" : "none", userSelect: "none" }}>
      <style>{`
        .fsc-fade { animation: fscFade 0.45s ease; }
        @keyframes fscFade { from { opacity: 0; } to { opacity: 1; } }
        .fsc-ui { transition: opacity 0.4s ease, transform 0.4s ease; }
        .fsc-pill:hover { background: oklch(100% 0 0 / 0.12) !important; }
        .fsc-pill:focus-visible, .fsc-thumb:focus-visible { outline: 2px solid ${orange}; outline-offset: 2px; }
        .fsc-thumb { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .fsc-thumb:hover { transform: translateY(-3px); }
        .fsc-bar { transform-origin: left; animation: fscGrow 0.9s ease both 0.2s; }
        @keyframes fscGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @media (prefers-reduced-motion: reduce) { .fsc-fade { animation: none; opacity: 1; } .fsc-ui, .fsc-thumb { transition: none; } }
      `}</style>

      {/* Stage: the scaled slide, click right side for next, left side for back */}
      <div ref={stageRef}
        onClick={e => {
          if (overview) return;
          setStarted(true);
          const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          if (e.clientX - r.left < r.width * 0.3) prev(); else next();
        }}
        style={{ position: "absolute", inset: isFull || phone ? 0 : 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div aria-live="polite" aria-roledescription="slide" aria-label={`${i + 1} / ${SLIDES.length}`}
          style={{ width: W * scale, height: H * scale, position: "relative", boxShadow: isFull ? "none" : "0 30px 80px oklch(0% 0 0 / 0.45)", borderRadius: isFull ? 0 : 6, overflow: "hidden" }}>
          <div key={`${i}-${lang}`} className="fsc-fade" style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "top left" }}>
            <SlideFrame index={i} lang={lang} step={step} />
          </div>
          {blank && <div style={{ position: "absolute", inset: 0, background: "black" }} />}
        </div>
      </div>

      {/* Start hint, shown until the presenter first moves on */}
      {!started && !overview && (
        <div className="fsc-ui" style={{ position: "absolute", left: "50%", bottom: 104, transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 14, whiteSpace: "nowrap" }}>
          {!isFull && (
            <button type="button" onClick={() => { setStarted(true); toggleFull(); }}
              style={{ display: "inline-flex", alignItems: "center", gap: 10, height: 48, padding: "0 24px", borderRadius: 999, border: "none", background: orange, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 10px 30px oklch(0% 0 0 / 0.35)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
              {t("Start full screen", "Mulai layar penuh", lang)}
            </button>
          )}
          <span style={{ fontSize: 13, color: "oklch(85% 0.02 80)", background: "oklch(15% 0.04 260 / 0.88)", padding: "8px 14px", borderRadius: 999 }}>
            {(phone ? t("Swipe or tap the sides to move.", "Geser atau ketuk sisi layar untuk pindah.", lang) : t("Arrow keys or clicker to move. F full screen. G all slides.", "Tombol panah atau clicker untuk pindah. F layar penuh. G semua slide.", lang))}
          </span>
        </div>
      )}

      {/* Control bar */}
      <div className="fsc-ui" role="toolbar" aria-label={t("Presentation controls", "Kontrol presentasi", lang)}
        style={{ position: "absolute", left: "50%", bottom: 28, transform: `translateX(-50%) translateY(${showUi ? 0 : 16}px)`, opacity: showUi ? 1 : 0, pointerEvents: showUi ? "auto" : "none",
          display: "flex", alignItems: "center", gap: 2, padding: 6, borderRadius: 16, background: "oklch(18% 0.05 260 / 0.88)", backdropFilter: "blur(12px)", boxShadow: "0 12px 40px oklch(0% 0 0 / 0.4)" }}>
        <button type="button" className="fsc-pill" style={{ ...pill, opacity: i === 0 ? 0.35 : 1 }} disabled={i === 0} onClick={() => { setStarted(true); prev(); }}
          aria-label={t("Previous slide", "Slide sebelumnya", lang)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <span style={{ minWidth: 64, textAlign: "center", fontSize: 14, fontWeight: 700, color: offWhite, fontVariantNumeric: "tabular-nums" }}>{i + 1} / {SLIDES.length}</span>
        <button type="button" className="fsc-pill" style={{ ...pill, opacity: atEnd ? 0.35 : 1 }} disabled={atEnd} onClick={() => { setStarted(true); next(); }}
          aria-label={t("Next slide", "Slide berikutnya", lang)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        </button>
        {sep}
        <button type="button" className="fsc-pill" style={pill} onClick={() => setOverview(o => !o)} aria-pressed={overview}
          aria-label={t("All slides", "Semua slide", lang)} title={t("All slides (G)", "Semua slide (G)", lang)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
        </button>
        <div role="group" aria-label={t("Language", "Bahasa", lang)} style={{ display: "inline-flex", gap: 2, background: "oklch(100% 0 0 / 0.08)", borderRadius: 10, padding: 2 }}>
          {(["en", "id"] as Lang[]).map(l => (
            <button key={l} type="button" className="fsc-pill" aria-pressed={lang === l} onClick={() => setLang(l)}
              style={{ ...pill, height: 40, minWidth: 44, background: lang === l ? orange : "transparent" }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button type="button" className="fsc-pill" style={pill} onClick={toggleFull}
          aria-label={isFull ? t("Exit full screen", "Keluar dari layar penuh", lang) : t("Full screen", "Layar penuh", lang)}
          title={isFull ? t("Exit full screen (F)", "Keluar dari layar penuh (F)", lang) : t("Full screen (F)", "Layar penuh (F)", lang)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {isFull ? <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /> : <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}
          </svg>
        </button>
        {sep}
        <Link href={moduleHref} className="fsc-pill" style={{ ...pill, textDecoration: "none", gap: 6 }} aria-label={t("Close presentation", "Tutup presentasi", lang)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          {t("Close", "Tutup", lang)}
        </Link>
      </div>

      {/* Progress line */}
      <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, top: 0, height: 3, background: "oklch(100% 0 0 / 0.06)" }}>
        <div style={{ height: "100%", width: `${((i + 1) / SLIDES.length) * 100}%`, background: orange, transition: "width 0.4s ease" }} />
      </div>

      {/* Overview: every slide as a thumbnail, click to jump */}
      {overview && (
        <div role="dialog" aria-label={t("All slides", "Semua slide", lang)}
          style={{ position: "absolute", inset: 0, background: "oklch(12% 0.04 260 / 0.97)", overflowY: "auto", padding: "56px 48px 120px" }}>
          <p style={{ fontFamily: serif, fontSize: 32, fontWeight: 600, color: offWhite, textAlign: "center", margin: "0 0 32px" }}>
            {t("All slides", "Semua slide", lang)}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24, maxWidth: 1280, margin: "0 auto" }}>
            {SLIDES.map((s, n) => (
              <button key={s.key} type="button" className="fsc-thumb" onClick={() => { go(n); setOverview(false); setStarted(true); }}
                aria-label={`${n + 1}`} aria-current={n === i}
                style={{ padding: 0, border: "none", background: "transparent", cursor: "pointer", textAlign: "left" }}>
                <Thumb index={n} lang={lang} active={n === i} />
                <span style={{ display: "block", marginTop: 8, fontSize: 13, fontWeight: 700, color: n === i ? orange : "oklch(80% 0.02 80)" }}>{n + 1}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Thumb({ index, lang, active }: { index: number; lang: Lang; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(0.17);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setS(el.clientWidth / W);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ width: "100%", aspectRatio: "16 / 9", position: "relative", overflow: "hidden", borderRadius: 8,
      outline: active ? `3px solid ${orange}` : "1px solid oklch(100% 0 0 / 0.12)", outlineOffset: active ? 2 : 0 }}>
      <div style={{ width: W, height: H, transform: `scale(${s})`, transformOrigin: "top left", pointerEvents: "none" }}>
        <SlideFrame index={index} lang={lang} step={stepsOf(index) - 1} />
      </div>
    </div>
  );
}
