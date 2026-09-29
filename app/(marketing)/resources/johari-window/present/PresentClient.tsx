"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

type Lang = "en" | "id";
type Pair = { en: string; id: string };

const navy = "oklch(22% 0.10 260)";
const ink = "oklch(14% 0.05 260)";
const offWhite = "oklch(96% 0.005 80)";
const orange = "oklch(65% 0.15 45)";
const lightGray = "oklch(88% 0.008 80)";
const muted = "oklch(48% 0.04 260)";
const onNavy = "oklch(82% 0.025 80)";

const SLUG = "johari-window";
const IMG = `/images/resources/${SLUG}`;
const serif = "Cormorant Garamond, Georgia, serif";
const sans = "Montserrat, sans-serif";

const W = 1600;
const H = 900;
const MIN_WIDTH = 768;
const IDLE_MS = 2500;

const tp = (p: Pair, lang: Lang) => (lang === "id" ? p.id : p.en);

// ── Content, pulled from the module ─────────────────────────────────────────

const PANES = [
  {
    key: "open",
    row: 0, col: 0,
    color: "oklch(48% 0.14 145)",
    colorBg: "oklch(48% 0.14 145 / 0.1)",
    title: { en: "Open", id: "Terbuka" } as Pair,
    sub: { en: "The Arena", id: "Arena" } as Pair,
    body: {
      en: "What is known both to you and to those around you. This is the space of honest, effective collaboration. The larger your Arena, the less energy people spend guessing your motives or managing around your blind spots.",
      id: "Apa yang diketahui baik oleh Anda maupun orang-orang di sekitar Anda. Ini adalah ruang kolaborasi yang jujur dan efektif. Semakin besar Arena Anda, semakin sedikit energi yang dihabiskan orang untuk menebak motif Anda atau mengelola sekitar titik buta Anda.",
    } as Pair,
    cross: {
      en: "In Dutch and German contexts, the Arena tends to be large: directness and transparency are cultural defaults. In Indonesian, Filipino and many East Asian contexts, the Arena builds slowly through relational investment. Expecting a large Arena early often creates mistrust.",
      id: "Dalam konteks Belanda dan Jerman, Arena cenderung besar: kejujuran dan transparansi adalah default budaya. Dalam konteks Indonesia, Filipina dan banyak konteks Asia Timur, Arena berkembang perlahan melalui investasi relasional. Mengharapkan Arena yang besar di awal sering menciptakan ketidakpercayaan.",
    } as Pair,
  },
  {
    key: "blind",
    row: 0, col: 1,
    color: "oklch(58% 0.15 15)",
    colorBg: "oklch(58% 0.15 15 / 0.1)",
    title: { en: "Blind Spot", id: "Titik Buta" } as Pair,
    sub: { en: "What others see in you", id: "Apa yang dilihat orang lain" } as Pair,
    body: {
      en: "What others observe in you that you cannot see yourself. This is the most dangerous quadrant for leaders: your impact on the room, the way your stress lands on your team, the patterns in how you decide under pressure. You are the last to know.",
      id: "Apa yang diamati orang lain pada diri Anda yang tidak bisa Anda lihat sendiri. Ini adalah kuadran paling berbahaya bagi pemimpin: dampak Anda di ruangan, cara stres Anda memengaruhi tim, pola cara Anda mengambil keputusan di bawah tekanan. Anda adalah orang terakhir yang tahu.",
    } as Pair,
    cross: {
      en: "Cross-cultural blind spots are especially common. A Western leader's directness may land as aggression. An Indonesian leader's respect for hierarchy may land as withholding. Neither intends the impact they create.",
      id: "Titik buta lintas budaya sangat umum terjadi. Ketegasan pemimpin Barat mungkin terasa seperti agresi. Penghormatan pemimpin Indonesia terhadap hierarki mungkin terasa seperti menahan informasi. Tidak ada yang bermaksud menciptakan dampak yang mereka buat.",
    } as Pair,
  },
  {
    key: "hidden",
    row: 1, col: 0,
    color: "oklch(65% 0.15 45)",
    colorBg: "oklch(65% 0.15 45 / 0.1)",
    title: { en: "Hidden", id: "Tersembunyi" } as Pair,
    sub: { en: "The Facade", id: "Fasad" } as Pair,
    body: {
      en: "What you know about yourself but have chosen not to share. Some of this is appropriate: not everything needs to be disclosed. But when the Hidden pane grows too large, the gap between your private self and your presented self creates exhaustion. You spend energy managing the gap.",
      id: "Apa yang Anda ketahui tentang diri sendiri tetapi memilih untuk tidak dibagikan. Sebagian dari ini wajar: tidak semuanya perlu diungkapkan. Tetapi ketika pane Tersembunyi tumbuh terlalu besar, celah antara diri pribadi dan diri yang ditampilkan menciptakan kelelahan. Anda menghabiskan energi mengelola celah tersebut.",
    } as Pair,
    cross: {
      en: "In high-context cultures such as Indonesia, Japan and Korea, a larger Hidden pane is not dysfunction, it is social wisdom. What you share with your team leader is different from what you share with a peer. Cross-cultural leaders must read this without pathologising it.",
      id: "Dalam budaya high-context seperti Indonesia, Jepang dan Korea, pane Tersembunyi yang lebih besar bukan disfungsi, melainkan kebijaksanaan sosial. Apa yang Anda bagikan dengan pemimpin tim berbeda dari apa yang Anda bagikan dengan rekan. Pemimpin lintas budaya harus membaca ini tanpa menjadikannya patologis.",
    } as Pair,
  },
  {
    key: "unknown",
    row: 1, col: 1,
    color: "oklch(45% 0.08 260)",
    colorBg: "oklch(45% 0.08 260 / 0.1)",
    title: { en: "Unknown", id: "Tidak Diketahui" } as Pair,
    sub: { en: "Undiscovered territory", id: "Wilayah belum ditemukan" } as Pair,
    body: {
      en: "What neither you nor others currently know about you. This is not emptiness, it is potential. It includes gifts not yet discovered, patterns not yet seen, capacities not yet tested. Cross-cultural challenge is one of the fastest ways to bring the Unknown into view.",
      id: "Apa yang saat ini tidak diketahui oleh Anda maupun orang lain tentang Anda. Ini bukan kekosongan, ini adalah potensi. Ini mencakup karunia yang belum ditemukan, pola yang belum terlihat, kapasitas yang belum diuji. Tantangan lintas budaya adalah salah satu cara tercepat untuk membawa yang Tidak Diketahui ke permukaan.",
    } as Pair,
    cross: {
      en: "Every major cross-cultural posting reveals something leaders did not know about themselves: a resilience they did not have at home, a rigidity that only shows under unfamiliar pressure. The Unknown shrinks through challenge, not comfort.",
      id: "Setiap penugasan lintas budaya utama mengungkapkan sesuatu tentang diri pemimpin yang belum mereka ketahui: ketahanan yang tidak mereka miliki di rumah, kekakuan yang hanya muncul di bawah tekanan yang tidak familiar. Yang Tidak Diketahui menyusut melalui tantangan, bukan kenyamanan.",
    } as Pair,
  },
];

const QUESTIONS: Pair[] = [
  {
    en: "If you could hear an honest conversation your team was having about your leadership style when you weren't in the room, what would you be afraid to hear?",
    id: "Jika Anda bisa mendengar percakapan jujur yang dilakukan tim Anda tentang gaya kepemimpinan Anda saat Anda tidak ada di ruangan, apa yang akan Anda takutkan untuk didengar?",
  },
  {
    en: "What is something true about your leadership, a struggle, a fear, a pattern, that you have never said out loud to your team?",
    id: "Apa sesuatu yang benar tentang kepemimpinan Anda, sebuah perjuangan, ketakutan, atau pola, yang belum pernah Anda katakan dengan keras kepada tim Anda?",
  },
  {
    en: "What cross-cultural experience in the past two years has shown you something about yourself you didn't previously know?",
    id: "Pengalaman lintas budaya apa dalam dua tahun terakhir yang telah menunjukkan sesuatu tentang diri Anda yang belum Anda ketahui sebelumnya?",
  },
];

const ACTIONS: Pair[] = [
  {
    en: "Open: share one thing about how you process conflict or feedback that your team probably doesn't know.",
    id: "Terbuka: bagikan satu hal tentang bagaimana Anda memproses konflik atau umpan balik yang mungkin tidak diketahui tim Anda.",
  },
  {
    en: "Blind Spot: ask one person who will be honest with you: ‘What's one thing I do that makes your job harder?’ Listen without defending.",
    id: "Titik Buta: tanyakan kepada satu orang yang akan jujur kepada Anda: ‘Apa satu hal yang saya lakukan yang membuat pekerjaan Anda lebih sulit?’ Dengarkan tanpa membela diri.",
  },
  {
    en: "Hidden: identify one thing in your Hidden pane that, shared appropriately, would help your team trust you more.",
    id: "Tersembunyi: identifikasi satu hal dalam pane Tersembunyi Anda yang, jika dibagikan dengan tepat, akan membantu tim Anda mempercayai Anda lebih banyak.",
  },
  {
    en: "Unknown: step deliberately into one unfamiliar cross-cultural situation: a conversation, a meeting, a responsibility you usually avoid.",
    id: "Tidak Diketahui: masuki dengan sengaja satu situasi lintas budaya yang tidak familiar: percakapan, rapat, tanggung jawab yang biasanya Anda hindari.",
  },
];

const VERSES = [
  {
    ref: { en: "Psalm 139:23-24", id: "Mazmur 139:23-24" } as Pair,
    text: {
      en: "Search me, God, and know my heart; test me and know my anxious thoughts. See if there is any offensive way in me, and lead me in the way everlasting.",
      id: "Selidikilah aku, ya Allah, dan kenallah hatiku, ujilah aku dan kenallah pikiran-pikiranku; lihatlah, apakah jalanku serong, dan tuntunlah aku di jalan yang kekal!",
    } as Pair,
  },
  {
    ref: { en: "1 Corinthians 13:12", id: "1 Korintus 13:12" } as Pair,
    text: {
      en: "For now we see only a reflection as in a mirror; then we shall see face to face. Now I know in part; then I shall know fully, even as I am fully known.",
      id: "Karena sekarang kita melihat dalam cermin suatu gambaran yang samar-samar, tetapi nanti kita akan melihat muka dengan muka. Sekarang aku hanya mengenal dengan tidak sempurna, tetapi nanti aku akan mengenal dengan sempurna, seperti aku sendiri dikenal dengan sempurna.",
    } as Pair,
  },
];

// ── Shared style helpers ─────────────────────────────────────────────────────

const bigTitle: React.CSSProperties = {
  fontFamily: serif, fontWeight: 600, fontSize: 104, color: navy,
  textAlign: "center", lineHeight: 1.05, margin: 0,
};
const midTitle: React.CSSProperties = { ...bigTitle, fontSize: 72 };
const kickerStyle: React.CSSProperties = {
  fontFamily: sans, fontSize: 22, fontWeight: 700, letterSpacing: "0.14em",
  textTransform: "uppercase", color: orange, textAlign: "center", margin: "0 0 20px",
};
const bodyStyle: React.CSSProperties = {
  fontFamily: sans, fontSize: 28, color: muted, textAlign: "center",
  lineHeight: 1.6, maxWidth: 1100, margin: "0 auto",
};
const cardStyle: React.CSSProperties = {
  background: offWhite, borderRadius: 16, boxShadow: "0 20px 60px oklch(0% 0 0 / 0.12)",
};

function rule(w = 96) {
  return <div style={{ width: w, height: 4, background: orange, margin: "24px auto", borderRadius: 2 }} />;
}

function show(on: boolean): React.CSSProperties {
  return {
    opacity: on ? 1 : 0,
    transform: on ? "none" : "translateY(14px)",
    transition: "opacity 0.5s ease, transform 0.5s ease",
  };
}

// ── Slide components ─────────────────────────────────────────────────────────

function TitleSlide({ lang }: { lang: Lang }) {
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ ...kickerStyle, color: orange }}>
        {tp({ en: "Personal Development", id: "Pengembangan Pribadi" }, lang)}
      </p>
      <h1 style={{ fontFamily: serif, fontWeight: 600, fontSize: 128, color: offWhite, margin: 0, lineHeight: 1.05 }}>
        {tp({ en: "The Johari", id: "Jendela" }, lang)}<br />
        <span style={{ color: orange }}>{tp({ en: "Window", id: "Johari" }, lang)}</span>
      </h1>
      <p style={{ fontFamily: sans, fontSize: 30, color: onNavy, maxWidth: 900, margin: "32px auto 0", lineHeight: 1.5 }}>
        {tp({
          en: "A map of what you know, and don't, about yourself as a leader.",
          id: "Peta tentang apa yang Anda ketahui, dan tidak, tentang diri Anda sebagai pemimpin.",
        }, lang)}
      </p>
    </div>
  );
}

function GapSlide({ lang, step }: { lang: Lang; step: number }) {
  return (
    <div style={{ textAlign: "center", maxWidth: 1200 }}>
      <p style={kickerStyle}>{tp({ en: "The Core Idea", id: "Gagasan Inti" }, lang)}</p>
      <p style={{ ...midTitle, fontSize: 56 }}>
        {tp({
          en: "What you know about yourself and what others know about you do not always match.",
          id: "Apa yang Anda ketahui tentang diri sendiri dan apa yang diketahui orang lain tentang Anda tidak selalu sama.",
        }, lang)}
      </p>
      <div style={{ ...show(step >= 1), marginTop: 40 }}>
        {rule()}
        <p style={bodyStyle}>
          {tp({
            en: "That gap is where much of the invisible friction in leadership lives.",
            id: "Celah itulah tempat sebagian besar gesekan tak terlihat dalam kepemimpinan berada.",
          }, lang)}
        </p>
      </div>
    </div>
  );
}

function AxisCross({ step }: { step: number }) {
  return (
    <svg aria-hidden="true" width="520" height="360" viewBox="0 0 520 360" style={{ display: "block", margin: "0 auto" }}>
      <line x1="60" y1="300" x2="460" y2="300" stroke={lightGray} strokeWidth="3" />
      <line x1="60" y1="300" x2="60" y2="40" stroke={lightGray} strokeWidth="3" />
      <g style={show(step >= 0)}>
        <text x="260" y="340" textAnchor="middle" fontFamily={sans} fontSize="20" fontWeight="700" fill={navy}>KNOWN / UNKNOWN</text>
        <text x="260" y="360" textAnchor="middle" fontFamily={sans} fontSize="14" fill={muted}>to yourself</text>
      </g>
      <g style={show(step >= 1)}>
        <text x="30" y="170" textAnchor="middle" fontFamily={sans} fontSize="20" fontWeight="700" fill={navy} transform="rotate(-90 30 170)">KNOWN / UNKNOWN</text>
        <text x="10" y="170" textAnchor="middle" fontFamily={sans} fontSize="14" fill={muted} transform="rotate(-90 10 170)">to others</text>
      </g>
    </svg>
  );
}

function AxesSlide({ lang, step }: { lang: Lang; step: number }) {
  return (
    <div style={{ textAlign: "center" }}>
      <p style={kickerStyle}>{tp({ en: "Two Questions", id: "Dua Pertanyaan" }, lang)}</p>
      <h2 style={midTitle}>{tp({ en: "Two questions build the window", id: "Dua pertanyaan membangun jendela" }, lang)}</h2>
      {rule()}
      <AxisCross step={step} />
      <div style={{ display: "flex", justifyContent: "center", gap: 60, marginTop: 8 }}>
        <p style={{ ...bodyStyle, ...show(step >= 0), fontSize: 24, maxWidth: 420 }}>
          {tp({ en: "Known or unknown to yourself?", id: "Diketahui atau tidak diketahui oleh diri sendiri?" }, lang)}
        </p>
        <p style={{ ...bodyStyle, ...show(step >= 1), fontSize: 24, maxWidth: 420 }}>
          {tp({ en: "Known or unknown to others?", id: "Diketahui atau tidak diketahui oleh orang lain?" }, lang)}
        </p>
      </div>
    </div>
  );
}

function WindowSlide({ upTo, lang }: { upTo: number; lang: Lang }) {
  return (
    <div style={{ textAlign: "center" }}>
      <p style={kickerStyle}>{tp({ en: "The Window", id: "Jendela" }, lang)}</p>
      <h2 style={midTitle}>{tp({ en: "Four panes of self-awareness", id: "Empat pane kesadaran diri" }, lang)}</h2>
      {rule()}
      <figure style={{ margin: "36px auto 0", maxWidth: 900 }}>
        <div style={{ display: "grid", gridTemplateColumns: "140px 1fr 1fr", gridTemplateRows: "60px 1fr 1fr" }}>
          <div />
          <div style={{ fontFamily: sans, fontSize: 18, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(48% 0.14 145)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 8 }}>
            {tp({ en: "Known to self", id: "Diketahui diri" }, lang)}
          </div>
          <div style={{ fontFamily: sans, fontSize: 18, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(58% 0.15 15)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 8 }}>
            {tp({ en: "Unknown to self", id: "Tidak diketahui diri" }, lang)}
          </div>
          {[0, 1].map(row => (
            <>
              <div key={`label-${row}`} style={{ fontFamily: sans, fontSize: 16, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: row === 0 ? "oklch(48% 0.14 145)" : "oklch(45% 0.08 260)", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 16, textAlign: "right" }}>
                {row === 0
                  ? tp({ en: "Known to others", id: "Diketahui orang lain" }, lang)
                  : tp({ en: "Unknown to others", id: "Tidak diketahui orang lain" }, lang)}
              </div>
              {PANES.filter(p => p.row === row).map(pane => {
                const n = PANES.indexOf(pane);
                const revealed = n <= upTo;
                const current = n === upTo;
                return (
                  <div key={pane.key} style={{
                    border: `3px solid ${current ? pane.color : revealed ? lightGray : lightGray}`,
                    background: revealed ? pane.colorBg : offWhite,
                    borderStyle: revealed ? "solid" : "dashed",
                    minHeight: 130,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    margin: 3,
                    transition: "all 0.4s ease",
                  }}>
                    {revealed ? (
                      <>
                        <span style={{ fontFamily: serif, fontSize: 34, fontWeight: 700, color: pane.color }}>{tp(pane.title, lang)}</span>
                        <span style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: muted, marginTop: 4 }}>{tp(pane.sub, lang)}</span>
                      </>
                    ) : (
                      <span style={{ fontFamily: sans, fontSize: 22, color: lightGray }}>?</span>
                    )}
                  </div>
                );
              })}
            </>
          ))}
        </div>
        <figcaption style={{ fontFamily: sans, fontSize: 14, color: muted, marginTop: 14 }}>
          {tp({ en: "The Johari Window, four quadrants of self-awareness", id: "Jendela Johari, empat kuadran kesadaran diri" }, lang)}
        </figcaption>
      </figure>
    </div>
  );
}

function PaneSlide({ n, lang, step }: { n: number; lang: Lang; step: number }) {
  const pane = PANES[n];
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: pane.color, color: offWhite, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontSize: 30, fontWeight: 700, flexShrink: 0 }}>
          {n + 1}
        </div>
        <div>
          <p style={{ fontFamily: sans, fontSize: 15, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: pane.color, margin: 0 }}>{tp(pane.sub, lang)}</p>
          <h2 style={{ fontFamily: serif, fontWeight: 600, fontSize: 60, color: navy, margin: 0, lineHeight: 1.05 }}>{tp(pane.title, lang)}</h2>
        </div>
      </div>
      <p style={{ fontFamily: sans, fontSize: 26, color: muted, lineHeight: 1.55, maxWidth: 1100 }}>{tp(pane.body, lang)}</p>
      <div style={{ ...show(step >= 1), ...cardStyle, background: pane.colorBg, border: `2px solid ${pane.color}`, padding: "28px 32px", marginTop: 28, maxWidth: 1100 }}>
        <p style={{ fontFamily: sans, fontSize: 14, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: pane.color, margin: "0 0 10px" }}>
          {tp({ en: "Cross-cultural dimension", id: "Dimensi lintas budaya" }, lang)}
        </p>
        <p style={{ fontFamily: sans, fontSize: 22, color: ink, lineHeight: 1.55, margin: 0 }}>{tp(pane.cross, lang)}</p>
      </div>
    </div>
  );
}

function BiblicalSlide({ lang, step }: { lang: Lang; step: number }) {
  return (
    <div style={{ textAlign: "center", maxWidth: 1200, margin: "0 auto" }}>
      <p style={{ ...kickerStyle, color: orange }}>{tp({ en: "Biblical Foundation", id: "Landasan Alkitab" }, lang)}</p>
      <h2 style={{ ...midTitle, color: offWhite }}>{tp({ en: "Known fully", id: "Dikenal secara penuh" }, lang)}</h2>
      {rule()}
      <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 28 }}>
        {VERSES.map((v, i) => (
          <div key={i} style={{ ...show(step >= i), background: "oklch(28% 0.11 260)", borderRadius: 16, padding: "28px 40px" }}>
            <p style={{ fontFamily: serif, fontSize: 26, fontStyle: "italic", color: "oklch(85% 0.03 80)", lineHeight: 1.55, margin: "0 0 10px" }}>
              &ldquo;{tp(v.text, lang)}&rdquo;
            </p>
            <p style={{ fontFamily: sans, fontSize: 15, fontWeight: 700, letterSpacing: "0.06em", color: orange, margin: 0 }}>{tp(v.ref, lang)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuestionsSlide({ lang, step }: { lang: Lang; step: number }) {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <p style={{ ...kickerStyle, textAlign: "center" }}>{tp({ en: "Discuss As A Team", id: "Diskusikan Sebagai Tim" }, lang)}</p>
      <h2 style={{ ...midTitle }}>{tp({ en: "Three questions for your team", id: "Tiga pertanyaan untuk tim Anda" }, lang)}</h2>
      {rule()}
      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 24 }}>
        {QUESTIONS.map((q, i) => (
          <div key={i} style={{ ...show(step >= i), ...cardStyle, border: `2px solid ${i === step ? orange : lightGray}`, padding: "26px 32px", display: "flex", gap: 20, alignItems: "flex-start" }}>
            <span style={{ fontFamily: serif, fontSize: 34, fontWeight: 700, color: orange, flexShrink: 0 }}>{i + 1}</span>
            <p style={{ fontFamily: serif, fontSize: 26, fontStyle: "italic", color: navy, lineHeight: 1.5, margin: 0 }}>{tp(q, lang)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThisWeekSlide({ lang, step }: { lang: Lang; step: number }) {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <p style={{ ...kickerStyle, textAlign: "center" }}>{tp({ en: "This Week", id: "Minggu Ini" }, lang)}</p>
      <h2 style={{ ...midTitle, color: offWhite }}>{tp({ en: "Pick one pane. Take one step.", id: "Pilih satu pane. Ambil satu langkah." }, lang)}</h2>
      {rule()}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 20 }}>
        {ACTIONS.map((a, i) => (
          <div key={i} style={{ ...show(step >= i), display: "flex", gap: 18, alignItems: "flex-start", background: "oklch(28% 0.11 260)", borderRadius: 12, padding: "22px 28px" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: PANES[i].color, marginTop: 10, flexShrink: 0 }} />
            <p style={{ fontFamily: sans, fontSize: 22, color: onNavy, lineHeight: 1.55, margin: 0 }}>{tp(a, lang)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClosingSlide({ lang }: { lang: Lang }) {
  return (
    <div style={{ textAlign: "center", maxWidth: 1000, margin: "0 auto" }}>
      <p style={{ ...kickerStyle, color: orange }}>{tp({ en: "Close", id: "Penutup" }, lang)}</p>
      <h2 style={{ ...midTitle, color: offWhite, fontSize: 60 }}>
        {tp({ en: "The goal is not a perfect window.", id: "Tujuannya bukan jendela yang sempurna." }, lang)}
      </h2>
      <p style={{ fontFamily: sans, fontSize: 28, color: onNavy, marginTop: 28, lineHeight: 1.6 }}>
        {tp({
          en: "It is a team that trusts you enough to tell you the truth.",
          id: "Melainkan tim yang cukup mempercayai Anda untuk menyampaikan kebenaran.",
        }, lang)}
      </p>
    </div>
  );
}

// ── Slide deck ────────────────────────────────────────────────────────────

type Slide = { key: string; dark?: boolean; steps?: number; render: (lang: Lang, step: number) => React.ReactNode };

const SLIDES: Slide[] = [
  { key: "title", dark: true, render: lang => <TitleSlide lang={lang} /> },
  { key: "the-gap", steps: 2, render: (lang, step) => <GapSlide lang={lang} step={step} /> },
  { key: "axes", steps: 2, render: (lang, step) => <AxesSlide lang={lang} step={step} /> },
  ...PANES.flatMap((_, n): Slide[] => [
    { key: `window-${n + 1}`, render: lang => <WindowSlide upTo={n} lang={lang} /> },
    { key: `pane-${n + 1}`, steps: 2, render: (lang, step) => <PaneSlide n={n} lang={lang} step={step} /> },
  ]),
  { key: "biblical", dark: true, steps: 2, render: (lang, step) => <BiblicalSlide lang={lang} step={step} /> },
  { key: "questions", steps: 3, render: (lang, step) => <QuestionsSlide lang={lang} step={step} /> },
  { key: "this-week", dark: true, steps: 4, render: (lang, step) => <ThisWeekSlide lang={lang} step={step} /> },
  { key: "closing", dark: true, render: lang => <ClosingSlide lang={lang} /> },
];

const stepsOf = (index: number) => SLIDES[index].steps ?? 1;

function SlideFrame({ index, lang, step }: { index: number; lang: Lang; step: number }) {
  const s = SLIDES[index];
  const dark = !!s.dark;
  return (
    <div style={{
      width: W, height: H, background: dark ? navy : offWhite, position: "relative",
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      {s.key === "title" && (
        <img src={`${IMG}/hero.jpg`} alt="" aria-hidden="true" style={{
          position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
          objectPosition: "center", opacity: 0.18, mixBlendMode: "luminosity", pointerEvents: "none",
        }} />
      )}
      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 10, background: orange }} />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 96px", position: "relative" }}>
        {s.render(lang, step)}
      </div>
      {s.key !== "title" && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 48px 28px", fontFamily: sans, fontSize: 16,
          color: dark ? "oklch(60% 0.03 260)" : muted,
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/images/logo-icon.png" alt="" aria-hidden="true" style={{ width: 22, height: 22, opacity: 0.8 }} />
            {tp({ en: "The Johari Window", id: "Jendela Johari" }, lang)}
          </span>
          <span>{index + 1} / {SLIDES.length}</span>
        </div>
      )}
    </div>
  );
}

function Thumb({ index, lang, active, onClick }: { index: number; lang: Lang; active: boolean; onClick: () => void }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.1);

  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setScale(Math.min(el.clientWidth / W, el.clientHeight / H));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <button
      onClick={onClick}
      aria-label={`${tp({ en: "Slide", id: "Slide" }, lang)} ${index + 1}`}
      style={{
        border: `3px solid ${active ? orange : "oklch(100% 0 0 / 0.15)"}`,
        borderRadius: 10, overflow: "hidden", padding: 0, cursor: "pointer",
        background: navy, aspectRatio: `${W} / ${H}`, width: "100%",
      }}
    >
      <div ref={boxRef} style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative" }}>
        <div style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "top left", position: "absolute", top: 0, left: 0 }}>
          <SlideFrame index={index} lang={lang} step={stepsOf(index) - 1} />
        </div>
      </div>
    </button>
  );
}

export default function PresentClient() {
  const { lang: ctxLang, setLang } = useLanguage();
  const lang: Lang = ctxLang === "id" ? "id" : "en";

  const [pos, setPos] = useState({ i: 0, s: 0 });
  const [isFull, setIsFull] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);
  const [overview, setOverview] = useState(false);
  const [started, setStarted] = useState(false);
  const [tooSmall, setTooSmall] = useState(false);
  const [scale, setScale] = useState(1);

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchX = useRef<number | null>(null);

  const last = SLIDES.length - 1;
  const atEnd = pos.i === last && pos.s === stepsOf(last) - 1;

  function go(n: number) {
    setPos({ i: Math.max(0, Math.min(last, n)), s: 0 });
    setStarted(true);
  }

  function next() {
    setStarted(true);
    setPos(p => {
      if (p.s < stepsOf(p.i) - 1) return { i: p.i, s: p.s + 1 };
      if (p.i < last) return { i: p.i + 1, s: 0 };
      return p;
    });
  }

  function prev() {
    setStarted(true);
    setPos(p => {
      if (p.s > 0) return { i: p.i, s: p.s - 1 };
      if (p.i > 0) return { i: p.i - 1, s: stepsOf(p.i - 1) - 1 };
      return p;
    });
  }

  function toggleFull() {
    if (!document.fullscreenElement) {
      rootRef.current?.requestFullscreen?.().catch(() => {});
      setIsFull(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFull(false);
    }
  }

  function wake() {
    setUiVisible(true);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setUiVisible(false), IDLE_MS);
  }

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setScale(Math.min(el.clientWidth / W, el.clientHeight / H));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MIN_WIDTH - 1}px)`);
    const update = () => setTooSmall(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      // Let a focused button handle its own Space press
      if (e.key === " " && (e.target as HTMLElement)?.closest?.("button, a")) return;
      if (overview) {
        if (e.key === "Escape") setOverview(false);
        if (e.key === "g" || e.key === "G") setOverview(false);
        return;
      }
      switch (e.key) {
        case "ArrowRight": case "ArrowDown": case " ": case "PageDown": case "n": case "N":
          e.preventDefault(); next(); wake(); break;
        case "ArrowLeft": case "ArrowUp": case "Backspace": case "PageUp": case "p": case "P":
          e.preventDefault(); prev(); wake(); break;
        case "Home": go(0); wake(); break;
        case "End": go(last); wake(); break;
        case "f": case "F": toggleFull(); wake(); break;
        case "g": case "G": setOverview(true); break;
        case "l": case "L": setLang(lang === "id" ? "en" : "id"); break;
        case "Escape": if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {}); break;
        default: break;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overview, lang]);

  useEffect(() => {
    idleTimer.current = setTimeout(() => setUiVisible(false), IDLE_MS);
    return () => { if (idleTimer.current) clearTimeout(idleTimer.current); };
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = `${IMG}/hero.jpg`;
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const moduleHref = `/resources/${SLUG}`;
  const showUi = uiVisible || !started || overview;

  if (tooSmall) {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 1000, background: navy, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center", fontFamily: sans,
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={orange} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginBottom: 20 }}>
          <rect x="3" y="4" width="18" height="12" rx="2" /><path d="M12 16v4M8 20h8" />
        </svg>
        <p style={{ fontFamily: serif, fontSize: 30, fontWeight: 600, color: offWhite, margin: "0 0 12px" }}>
          {lang === "id" ? "Presentasi membutuhkan layar yang lebih besar" : "Presenting needs a bigger screen"}
        </p>
        <p style={{ fontSize: 16, color: onNavy, maxWidth: 420, lineHeight: 1.6, margin: "0 0 28px" }}>
          {lang === "id"
            ? "Buka modul ini di tablet atau komputer untuk menampilkan slide."
            : "Open this module on a tablet or computer to show the slides."}
        </p>
        <Link href={moduleHref} style={{ color: orange, fontWeight: 700, textDecoration: "underline" }}>
          {lang === "id" ? "Kembali ke modul" : "Back to the module"}
        </Link>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      onMouseMove={wake}
      onTouchStart={e => { touchX.current = e.touches[0].clientX; wake(); }}
      onTouchEnd={e => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) { if (dx < 0) next(); else prev(); }
        touchX.current = null;
      }}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: ink, fontFamily: sans }}
    >
      <style>{`
        .jw-fade { animation: jw-fade-in 0.4s ease; }
        @keyframes jw-fade-in { from { opacity: 0; } to { opacity: 1; } }
        .jw-ui { transition: opacity 0.3s ease; }
        .jw-pill { background: oklch(100% 0 0 / 0.08); border: 1px solid oklch(100% 0 0 / 0.18); color: ${offWhite}; border-radius: 10px; cursor: pointer; font-family: ${sans}; }
        .jw-pill:hover { background: oklch(100% 0 0 / 0.16); }
        .jw-pill:focus-visible, .jw-tb:focus-visible { outline: 2px solid ${orange}; outline-offset: 2px; }
        .jw-tb { display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-width: 44px; height: 44px; padding: 0 12px; background: transparent; border: none; border-radius: 10px; color: ${offWhite}; cursor: pointer; font-family: ${sans}; font-weight: 700; font-size: 13px; text-decoration: none; }
        .jw-tb:hover:not(:disabled) { background: oklch(100% 0 0 / 0.12); }
        .jw-tb:disabled { opacity: 0.35; cursor: default; }
        .jw-bar { position: fixed; top: 0; left: 0; height: 3px; background: ${orange}; transition: width 0.3s ease; z-index: 5; }
        @media (prefers-reduced-motion: reduce) { .jw-fade, .jw-ui { animation: none !important; transition: none !important; } }
      `}</style>

      <div className="jw-bar" style={{ width: `${((pos.i + (pos.s + 1) / stepsOf(pos.i)) / SLIDES.length) * 100}%` }} />

      <div
        ref={stageRef}
        onClick={e => {
          const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          const x = e.clientX - rect.left;
          if (x < rect.width * 0.3) prev(); else next();
        }}
        style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
      >
        <div key={`${pos.i}-${pos.s}`} className="jw-fade" style={{ width: W, height: H, transform: `scale(${scale})`, boxShadow: "0 30px 90px oklch(0% 0 0 / 0.5)" }}>
          <SlideFrame index={pos.i} lang={lang} step={pos.s} />
        </div>
      </div>

      {/* Start hint, shown until the presenter first moves on */}
      {!started && !overview && (
        <div style={{ position: "fixed", left: "50%", bottom: 104, transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 14, zIndex: 6 }}>
          {!isFull && (
            <button type="button" className="jw-pill" onClick={() => { setStarted(true); toggleFull(); }}
              style={{ display: "inline-flex", alignItems: "center", gap: 10, height: 48, padding: "0 24px", borderRadius: 999, border: "none", background: orange, color: "white", fontWeight: 700, fontSize: 15, boxShadow: "0 10px 30px oklch(0% 0 0 / 0.35)", whiteSpace: "nowrap" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
              {lang === "id" ? "Mulai layar penuh" : "Start full screen"}
            </button>
          )}
          <span style={{ fontSize: 13, color: onNavy, background: "oklch(0% 0 0 / 0.45)", padding: "8px 14px", borderRadius: 999, whiteSpace: "nowrap" }}>
            {lang === "id" ? "Tombol panah atau clicker untuk pindah. F layar penuh. G semua slide." : "Arrow keys or clicker to move. F full screen. G all slides."}
          </span>
        </div>
      )}

      {/* Control bar */}
      <div className="jw-ui" role="toolbar" aria-label={lang === "id" ? "Kontrol presentasi" : "Presentation controls"}
        style={{ position: "fixed", left: "50%", bottom: 28, zIndex: 6, transform: "translateX(-50%)", opacity: showUi ? 1 : 0, pointerEvents: showUi ? "auto" : "none",
          display: "flex", alignItems: "center", gap: 2, padding: 6, borderRadius: 16, background: "oklch(18% 0.05 260 / 0.88)", backdropFilter: "blur(12px)", boxShadow: "0 12px 40px oklch(0% 0 0 / 0.4)" }}>
        <button type="button" className="jw-tb" disabled={pos.i === 0 && pos.s === 0} onClick={() => { prev(); wake(); }}
          aria-label={lang === "id" ? "Slide sebelumnya" : "Previous slide"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <span style={{ minWidth: 64, textAlign: "center", fontSize: 14, fontWeight: 700, color: offWhite, fontVariantNumeric: "tabular-nums" }}>{pos.i + 1} / {SLIDES.length}</span>
        <button type="button" className="jw-tb" disabled={atEnd} onClick={() => { next(); wake(); }}
          aria-label={lang === "id" ? "Slide berikutnya" : "Next slide"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        </button>
        <span aria-hidden="true" style={{ width: 1, height: 24, background: "oklch(100% 0 0 / 0.18)", margin: "0 4px" }} />
        <button type="button" className="jw-tb" onClick={() => setOverview(o => !o)} aria-pressed={overview}
          aria-label={lang === "id" ? "Semua slide" : "All slides"} title={lang === "id" ? "Semua slide (G)" : "All slides (G)"}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
        </button>
        <div role="group" aria-label={lang === "id" ? "Bahasa" : "Language"} style={{ display: "inline-flex", gap: 2, background: "oklch(100% 0 0 / 0.08)", borderRadius: 10, padding: 2 }}>
          {(["en", "id"] as Lang[]).map(l => (
            <button key={l} type="button" className="jw-tb" aria-pressed={lang === l} onClick={() => setLang(l)}
              style={{ height: 40, background: lang === l ? orange : "transparent" }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button type="button" className="jw-tb" onClick={toggleFull}
          aria-label={isFull ? (lang === "id" ? "Keluar dari layar penuh" : "Exit full screen") : (lang === "id" ? "Layar penuh" : "Full screen")}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {isFull ? <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /> : <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}
          </svg>
        </button>
        <span aria-hidden="true" style={{ width: 1, height: 24, background: "oklch(100% 0 0 / 0.18)", margin: "0 4px" }} />
        <Link href={moduleHref} className="jw-tb" aria-label={lang === "id" ? "Tutup presentasi" : "Close presentation"}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          {lang === "id" ? "Tutup" : "Close"}
        </Link>
      </div>

      {overview && (
        <div role="dialog" aria-modal="true" style={{ position: "fixed", inset: 0, background: "oklch(12% 0.03 260 / 0.97)", zIndex: 20, padding: "48px 5vw", overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <p style={{ color: offWhite, fontFamily: serif, fontSize: 28, margin: 0 }}>{lang === "id" ? "Ringkasan Slide" : "Slide Overview"}</p>
            <button className="jw-pill" onClick={() => setOverview(false)} style={{ padding: "10px 18px" }}>{lang === "id" ? "Tutup" : "Close"}</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
            {SLIDES.map((s, i) => (
              <Thumb key={s.key} index={i} lang={lang} active={i === pos.i} onClick={() => { go(i); setOverview(false); }} />
            ))}
          </div>
        </div>
      )}

      {atEnd && showUi && !overview && (
        <div style={{ position: "fixed", bottom: 96, left: "50%", transform: "translateX(-50%)", color: onNavy, fontSize: 13 }}>
          {lang === "id" ? "Akhir presentasi" : "End of presentation"}
        </div>
      )}
    </div>
  );
}
