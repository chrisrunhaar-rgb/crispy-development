"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
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

const SLUG = "healthy-conflict";
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

const PROTECTS: Pair[] = [
  { en: "Relationship", id: "Hubungan" },
  { en: "Respect", id: "Rasa hormat" },
  { en: "Belonging", id: "Rasa memiliki" },
  { en: "Face", id: "Kehormatan diri" },
];

const DRIFT: Pair[] = [
  { en: "The meeting room", id: "Ruang rapat" },
  { en: "Side conversations", id: "Percakapan di balik layar" },
  { en: "Hardened positions", id: "Posisi yang mengeras" },
  { en: "Lost trust", id: "Kepercayaan yang terkikis" },
];

const CONTRAST: { a: Pair; h: Pair }[] = [
  { a: { en: "The meeting ends but nothing is decided.", id: "Rapat berakhir tapi tidak ada yang diputuskan." },
    h: { en: "Disagreement surfaces before it becomes a crisis.", id: "Ketidaksetujuan muncul sebelum menjadi krisis." } },
  { a: { en: "You sense tension but no one names it.", id: "Ada ketegangan tapi tak ada yang menyebutnya." },
    h: { en: "People say what they actually think.", id: "Orang mengatakan apa yang sebenarnya mereka pikirkan." } },
  { a: { en: "Honesty has a cost, so you walk on eggshells.", id: "Kejujuran ada harganya, jadi semua serba hati-hati." },
    h: { en: "Trust grows because people know where they stand.", id: "Kepercayaan tumbuh karena orang tahu posisi mereka." } },
  { a: { en: "Frustration builds quietly until something breaks.", id: "Frustrasi menumpuk diam-diam sampai sesuatu pecah." },
    h: { en: "Decisions stick because everyone had a real voice.", id: "Keputusan bertahan karena semua orang benar-benar didengar." } },
  { a: { en: "Relationships feel polite but never close.", id: "Hubungan terasa sopan tapi tidak pernah dekat." },
    h: { en: "Relationships are honest enough to be close.", id: "Hubungan cukup jujur untuk menjadi dekat." } },
];

const PDI = [
  { en: "Malaysia", id: "Malaysia", v: 100 },
  { en: "Philippines", id: "Filipina", v: 94 },
  { en: "Indonesia", id: "Indonesia", v: 78 },
  { en: "Netherlands", id: "Belanda", v: 38 },
  { en: "Germany", id: "Jerman", v: 35 },
];

const ELEMENTS: { title: Pair; body: Pair; say: Pair }[] = [
  {
    title: { en: "Name what is coming before it arrives", id: "Sebutkan apa yang akan datang sebelum ia tiba" },
    body: { en: "When people are not surprised by tension, they are less likely to treat it as a threat.", id: "Ketika orang tidak terkejut dengan ketegangan, mereka lebih kecil kemungkinannya menganggapnya ancaman." },
    say: { en: "I want us to expect that we are going to disagree today. That is actually the goal.", id: "Saya ingin kita semua mengharapkan bahwa kita akan berselisih pendapat hari ini. Itu sebenarnya tujuannya." },
  },
  {
    title: { en: "Conflict means listening, not just speaking", id: "Konflik berarti mendengarkan, bukan hanya berbicara" },
    body: { en: "Each person genuinely tries to understand why the other holds their view.", id: "Setiap orang sungguh-sungguh berusaha memahami mengapa orang lain memegang pandangannya." },
    say: { en: "Before you respond, tell me if you understood what they were saying. Not whether you agree. Whether you understood.", id: "Sebelum kamu merespons, ceritakan apakah kamu memahami apa yang mereka katakan. Bukan apakah kamu setuju. Apakah kamu memahami." },
  },
  {
    title: { en: "The goal is a broader picture, not a winner", id: "Tujuannya gambaran yang lebih luas, bukan pemenang" },
    body: { en: "Two honest perspectives usually see something neither could see alone.", id: "Dua perspektif yang jujur biasanya melihat sesuatu yang tidak bisa dilihat masing-masing sendirian." },
    say: { en: "Let us hold both of these views at the same time for a moment and see what we can see from there.", id: "Mari kita tahan kedua pandangan ini sekaligus sejenak dan lihat apa yang bisa kita lihat dari situ." },
  },
  {
    title: { en: "Changing your mind is a sign of strength", id: "Mengubah pikiran adalah tanda kekuatan" },
    body: { en: "In many cultures changing position feels like losing face. Name it and reframe it before you start.", id: "Dalam banyak budaya, mengubah posisi terasa seperti kehilangan muka. Sebutkan dan bingkai ulang sebelum mulai." },
    say: { en: "If you walk out thinking differently than you walked in, that is exactly what is supposed to happen.", id: "Jika kamu keluar dengan berpikir berbeda dari ketika kamu masuk, itulah yang seharusnya terjadi." },
  },
  {
    title: { en: "Prepare the room before you need it", id: "Persiapkan ruangan sebelum kamu membutuhkannya" },
    body: { en: "Trust is the infrastructure of honest disagreement. Build it before the hard conversation.", id: "Kepercayaan adalah fondasi ketidaksetujuan yang jujur. Bangun itu sebelum percakapan sulit." },
    say: { en: "Part of my job is to make sure that when we hit a hard moment, we already have enough trust in the room.", id: "Bagian dari tugas saya adalah memastikan bahwa ketika kita menghadapi momen sulit, sudah ada cukup kepercayaan di ruangan ini." },
  },
];

const QUESTIONS: Pair[] = [
  { en: "What conversation have you been avoiding, and what has that silence cost?", id: "Percakapan apa yang selama ini kamu hindari, dan apa yang sudah dibayar oleh keheningan itu?" },
  { en: "Think of a leader who handled conflict well. What did they do that made it feel safe?", id: "Pikirkan seorang pemimpin yang menangani konflik dengan baik. Apa yang mereka lakukan sehingga terasa aman?" },
  { en: "Where in your team is polite agreement standing in for honest engagement?", id: "Di mana dalam timmu persetujuan sopan menggantikan keterlibatan yang jujur?" },
];

const THIS_WEEK: Pair[] = [
  { en: "Before your next hard conversation, tell the team: we are going to disagree, and that is the goal.", id: "Sebelum percakapan sulit berikutnya, katakan kepada tim: kita akan berselisih, dan itulah tujuannya." },
  { en: "Pick one relationship where silence has become normal. Ask for a real conversation, just to begin.", id: "Pilih satu hubungan di mana diam sudah menjadi kebiasaan. Minta percakapan yang nyata, sekadar untuk memulai." },
  { en: "Build trust before you need it: one relational moment with someone you may need to challenge later.", id: "Bangun kepercayaan sebelum kamu membutuhkannya: satu momen relasional dengan seseorang yang mungkin nanti perlu kamu tegur." },
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

function Check({ good }: { good: boolean }) {
  return (
    <span aria-hidden="true" style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 999, background: good ? orange : lightGray, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={good ? "white" : muted} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {good ? <path d="M5 12l5 5 9-10" /> : <path d="M7 7l10 10M17 7L7 17" />}
      </svg>
    </span>
  );
}

function ElementSlide({ n, lang }: { n: number; lang: Lang }) {
  const e = ELEMENTS[n];
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 30 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <span style={{ flexShrink: 0, width: 110, height: 110, borderRadius: 999, background: navy, color: offWhite, fontFamily: serif, fontSize: 68, fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{n + 1}</span>
        <div>
          <p style={{ ...kicker, textAlign: "left", marginBottom: 8 }}>{t(`The Conflict Table · ${n + 1} of 5`, `Meja Konflik · ${n + 1} dari 5`, lang)}</p>
          <h2 style={{ ...midTitle, textAlign: "left", fontSize: 64 }}>{t(e.title.en, e.title.id, lang)}</h2>
        </div>
      </div>
      <p style={{ ...body, textAlign: "left", maxWidth: 1180 }}>{t(e.body.en, e.body.id, lang)}</p>
      <div style={{ ...card, borderLeft: `8px solid ${orange}`, padding: "36px 48px" }}>
        <p style={{ fontFamily: sans, fontSize: 18, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: muted, margin: "0 0 14px" }}>
          {t("You might say", "Kamu bisa berkata", lang)}
        </p>
        <p style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 500, fontSize: 46, lineHeight: 1.25, color: navy, margin: 0 }}>
          &ldquo;{t(e.say.en, e.say.id, lang)}&rdquo;
        </p>
      </div>
    </div>
  );
}

// ─── The slides ───────────────────────────────────────────────────────────────
type Slide = { key: string; dark?: boolean; render: (lang: Lang) => React.ReactNode };

const SLIDES: Slide[] = [
  {
    key: "title",
    dark: true,
    render: lang => (
      <>
        <p style={kicker}>{t("Cross-Cultural Leadership", "Kepemimpinan Lintas Budaya", lang)}</p>
        <h1 style={{ ...bigTitle, fontSize: 128, color: offWhite, maxWidth: 1250 }}>{t("Creating Healthy Conflict", "Menciptakan Konflik yang Sehat", lang)}</h1>
        {rule(120)}
        <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: 40, lineHeight: 1.35, color: onNavy, margin: 0, textAlign: "center", maxWidth: 1100 }}>
          {t("Most leaders know how to keep the peace. Fewer know how to break it in a way that builds something better.",
            "Kebanyakan pemimpin tahu cara menjaga perdamaian. Lebih sedikit yang tahu cara memecahnya dengan cara yang membangun sesuatu yang lebih baik.", lang)}
        </p>
      </>
    ),
  },
  {
    key: "silence",
    render: lang => (
      <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", alignItems: "center", gap: 72, width: "100%" }}>
        <img src={`${IMG}/conflict-table.jpg`} alt={t("A team around a table.", "Sebuah tim di sekitar meja.", lang)}
          style={{ width: "100%", height: 560, objectFit: "cover", borderRadius: 20, display: "block", boxShadow: "0 24px 60px oklch(14% 0.05 260 / 0.22)" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {[t("The meeting ends.", "Rapat berakhir.", lang), t("Heads nod.", "Kepala mengangguk.", lang), t("Everyone smiles.", "Semua orang tersenyum.", lang)].map(line => (
            <p key={line} style={{ fontFamily: serif, fontSize: 62, fontWeight: 600, color: navy, margin: 0, lineHeight: 1.1 }}>{line}</p>
          ))}
          {rule()}
          <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: 62, fontWeight: 600, color: orange, margin: 0, lineHeight: 1.1 }}>
            {t("And then nothing changes.", "Lalu tidak ada yang berubah.", lang)}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "why",
    render: lang => (
      <>
        <p style={kicker}>{t("Why we avoid it", "Mengapa kita menghindarinya", lang)}</p>
        <h2 style={midTitle}>{t("Silence protects something real", "Diam melindungi sesuatu yang nyata", lang)}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28, width: "100%" }}>
          {PROTECTS.map(p => (
            <div key={p.en} style={{ ...card, padding: "40px 20px", textAlign: "center", borderTop: `6px solid ${orange}` }}>
              <p style={{ fontFamily: serif, fontSize: 46, fontWeight: 600, color: navy, margin: 0 }}>{t(p.en, p.id, lang)}</p>
            </div>
          ))}
        </div>
        <p style={{ ...body, maxWidth: 1200 }}>
          {t("Avoidance is not laziness. The problem is not the instinct. It is using it everywhere, even when the silence is hurting the team.",
            "Menghindar bukan kemalasan. Masalahnya bukan instingnya, tapi ketika insting itu dipakai di mana saja, bahkan ketika diam itu melukai tim.", lang)}
        </p>
      </>
    ),
  },
  {
    key: "cost",
    dark: true,
    render: lang => (
      <>
        <h2 style={{ ...midTitle, color: offWhite }}>{t("Conflict doesn't disappear. It moves.", "Konflik tidak hilang. Ia berpindah.", lang)}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 18, width: "100%", justifyContent: "center" }}>
          {DRIFT.map((d, n) => (
            <div key={d.en} className="hc-step" style={{ display: "flex", alignItems: "center", gap: 18, animationDelay: `${0.35 + n * 0.55}s` }}>
              <div style={{ width: 270, height: 170, borderRadius: 18, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center",
                background: n === DRIFT.length - 1 ? orange : `oklch(${30 + n * 5}% 0.09 260)`, border: "1px solid oklch(100% 0 0 / 0.12)" }}>
                <span style={{ fontFamily: sans, fontSize: 18, fontWeight: 700, color: n === DRIFT.length - 1 ? "white" : orange, letterSpacing: "0.1em", marginBottom: 10 }}>{n + 1}</span>
                <span style={{ fontFamily: sans, fontSize: 27, fontWeight: 700, color: "white", lineHeight: 1.25 }}>{t(d.en, d.id, lang)}</span>
              </div>
              {n < DRIFT.length - 1 && (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={orange} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              )}
            </div>
          ))}
        </div>
        <p className="hc-step" style={{ ...body, color: onNavy, maxWidth: 1150, animationDelay: "2.6s" }}>
          {t("The team stops offering honest disagreement. You lose the best thinking of the people you lead.",
            "Tim berhenti menyampaikan ketidaksetujuan yang jujur. Kamu kehilangan pemikiran terbaik dari orang-orang yang kamu pimpin.", lang)}
        </p>
      </>
    ),
  },
  {
    key: "contrast",
    render: lang => (
      <>
        <h2 style={{ ...midTitle, fontSize: 64 }}>{t("Avoidance vs. healthy conflict", "Penghindaran vs. konflik yang sehat", lang)}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, width: "100%" }}>
          {[false, true].map(good => (
            <div key={String(good)} style={{ ...card, padding: "30px 36px", background: good ? "white" : "oklch(93% 0.008 80)", boxShadow: good ? card.boxShadow : "none" }}>
              <p style={{ ...kicker, textAlign: "left", color: good ? orange : muted, marginBottom: 18 }}>{good ? t("Healthy conflict", "Konflik yang sehat", lang) : t("Avoidance", "Penghindaran", lang)}</p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                {CONTRAST.map(c => {
                  const p = good ? c.h : c.a;
                  return (
                    <li key={p.en} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <Check good={good} />
                      <span style={{ fontFamily: sans, fontSize: 23, fontWeight: good ? 600 : 500, color: good ? navy : muted, lineHeight: 1.35 }}>{t(p.en, p.id, lang)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    key: "research",
    render: lang => (
      <>
        <p style={kicker}>{t("What the research shows", "Apa kata penelitian", lang)}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: 64, width: "100%", alignItems: "stretch" }}>
          <div style={{ ...card, padding: "40px 44px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
            <p style={{ fontFamily: serif, fontSize: 120, fontWeight: 600, color: navy, margin: 0, lineHeight: 0.9 }}>180</p>
            <p style={{ fontFamily: sans, fontSize: 24, fontWeight: 700, color: navy, margin: 0 }}>{t("teams studied by Google", "tim diteliti oleh Google", lang)}</p>
            <p style={{ fontFamily: sans, fontSize: 23, lineHeight: 1.5, color: muted, margin: 0 }}>
              {t("The strongest predictor of a team that works: psychological safety. People feel safe to speak up and to disagree.",
                "Prediktor terkuat tim yang efektif: keamanan psikologis. Orang merasa aman untuk bersuara dan tidak setuju.", lang)}
            </p>
          </div>
          <div style={{ ...card, padding: "36px 44px" }}>
            <p style={{ fontFamily: sans, fontSize: 24, fontWeight: 700, color: navy, margin: "0 0 22px" }}>{t("Power distance (Hofstede)", "Jarak kekuasaan (Hofstede)", lang)}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {PDI.map(c => (
                <div key={c.en} style={{ display: "grid", gridTemplateColumns: "190px 1fr 56px", alignItems: "center", gap: 16 }}>
                  <span style={{ fontFamily: sans, fontSize: 21, fontWeight: 600, color: navy }}>{t(c.en, c.id, lang)}</span>
                  <div style={{ height: 26, background: "oklch(93% 0.008 80)", borderRadius: 6, overflow: "hidden" }}>
                    <div className="hc-bar" style={{ width: `${c.v}%`, height: "100%", background: c.v > 50 ? navy : orange, borderRadius: 6 }} />
                  </div>
                  <span style={{ fontFamily: sans, fontSize: 21, fontWeight: 700, color: muted, textAlign: "right" }}>{c.v}</span>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: sans, fontSize: 20, lineHeight: 1.45, color: muted, margin: "22px 0 0" }}>
              {t("Where power distance is high, silence is often a sign of respect, not disengagement.",
                "Di mana jarak kekuasaan tinggi, diam sering merupakan tanda hormat, bukan ketidakpedulian.", lang)}
            </p>
          </div>
        </div>
        <p style={{ fontFamily: sans, fontSize: 15, color: muted, margin: 0 }}>
          {t("Sources: Google Project Aristotle (2016); Hofstede, Culture's Consequences.", "Sumber: Google Project Aristotle (2016); Hofstede, Culture's Consequences.", lang)}
        </p>
      </>
    ),
  },
  {
    key: "reframe",
    dark: true,
    render: lang => (
      <>
        <p style={kicker}>{t("The reframe", "Mengubah sudut pandang", lang)}</p>
        <h2 style={{ ...bigTitle, color: offWhite, fontSize: 92, maxWidth: 1300 }}>
          {t("Conflict is not the opposite of harmony.", "Konflik bukan lawan dari keharmonisan.", lang)}
          <br />
          <span style={{ color: orange, fontStyle: "italic" }}>{t("It is often the path to it.", "Justru sering menjadi jalannya.", lang)}</span>
        </h2>
        {rule(120)}
        <p style={{ ...body, color: onNavy, maxWidth: 1100 }}>
          {t("Peace that has not been tested is fragile. Peace that came through honest conflict can hold under pressure.",
            "Damai yang belum diuji itu rapuh. Damai yang lahir dari konflik yang jujur dapat bertahan di bawah tekanan.", lang)}
        </p>
      </>
    ),
  },
  {
    key: "kinds",
    render: lang => {
      const cols: { good: boolean; head: Pair; items: Pair[] }[] = [
        { good: false, head: { en: "Destructive", id: "Destruktif" }, items: [
          { en: "Attacks the person", id: "Menyerang orangnya" },
          { en: "Escalates without resolution", id: "Memanas tanpa penyelesaian" },
          { en: "Leaves people unsafe or dismissed", id: "Membuat orang merasa tidak aman atau diabaikan" },
        ] },
        { good: true, head: { en: "Productive", id: "Produktif" }, items: [
          { en: "Works on the issue, not the person", id: "Membahas masalahnya, bukan orangnya" },
          { en: "Curious, not combative", id: "Penuh rasa ingin tahu, bukan suka bertarung" },
          { en: "Stays in the room", id: "Tetap di dalam ruangan" },
          { en: "Ends with a clearer picture", id: "Berakhir dengan gambaran yang lebih jelas" },
        ] },
      ];
      return (
        <>
          <h2 style={{ ...midTitle, fontSize: 64 }}>{t("Two kinds of conflict", "Dua jenis konflik", lang)}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, width: "100%" }}>
            {cols.map(c => (
              <div key={c.head.en} style={{ ...card, padding: "34px 40px", background: c.good ? "white" : "oklch(93% 0.008 80)", boxShadow: c.good ? card.boxShadow : "none" }}>
                <p style={{ fontFamily: serif, fontSize: 52, fontWeight: 600, color: c.good ? orange : muted, margin: "0 0 20px" }}>{t(c.head.en, c.head.id, lang)}</p>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 18 }}>
                  {c.items.map(it => (
                    <li key={it.en} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <Check good={c.good} />
                      <span style={{ fontFamily: sans, fontSize: 25, fontWeight: 600, color: c.good ? navy : muted }}>{t(it.en, it.id, lang)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p style={{ ...body, fontSize: 25, maxWidth: 1250 }}>
            {t("The leader's job is not to prevent conflict. It is to create the conditions where the productive kind can happen.",
              "Tugas pemimpin bukan mencegah konflik, tapi menciptakan kondisi di mana konflik yang produktif bisa terjadi.", lang)}
          </p>
        </>
      );
    },
  },
  {
    key: "table",
    render: lang => (
      <>
        <p style={kicker}>{t("The Conflict Table", "Meja Konflik", lang)}</p>
        <h2 style={{ ...midTitle, fontSize: 68 }}>{t("5 elements of a safe space", "5 elemen ruang yang aman", lang)}</h2>
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14, width: 1100 }}>
          {ELEMENTS.map((e, n) => (
            <li key={e.title.en} style={{ ...card, display: "flex", alignItems: "center", gap: 24, padding: "16px 28px" }}>
              <span style={{ flexShrink: 0, width: 52, height: 52, borderRadius: 999, background: navy, color: offWhite, fontFamily: serif, fontSize: 32, fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{n + 1}</span>
              <span style={{ fontFamily: sans, fontSize: 28, fontWeight: 600, color: navy }}>{t(e.title.en, e.title.id, lang)}</span>
            </li>
          ))}
        </ol>
      </>
    ),
  },
  ...ELEMENTS.map((e, n): Slide => ({ key: `element-${n + 1}`, render: lang => <ElementSlide n={n} lang={lang} /> })),
  {
    key: "story",
    render: lang => (
      <>
        <p style={kicker}>{t("Field story", "Kisah lapangan", lang)}</p>
        <h2 style={{ ...midTitle, fontSize: 68 }}>{t("Two leaders, one table", "Dua pemimpin, satu meja", lang)}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, width: "100%" }}>
          {[
            { en: "They respected each other deeply. So they never talked about the gap between them.", id: "Mereka saling menghormati dengan dalam. Karena itu mereka tidak pernah membicarakan perbedaan di antara mereka." },
            { en: "A friend said: \"I want to bring you to a table where conflict is going to happen. I think you need it, and I think it is safe.\"", id: "Seorang sahabat berkata: \"Saya ingin membawa kamu ke sebuah meja di mana konflik akan terjadi. Saya pikir kamu membutuhkannya, dan saya pikir itu aman.\"" },
            { en: "Unity grew from that table. Not because the conflict disappeared, but because it was finally allowed to exist.", id: "Persatuan tumbuh dari meja itu. Bukan karena konflik itu hilang, tapi karena ia akhirnya diizinkan untuk ada." },
          ].map((b, n) => (
            <div key={n} style={{ ...card, padding: "34px 34px", borderTop: `6px solid ${n === 2 ? orange : navy}` }}>
              <p style={{ fontFamily: sans, fontSize: 18, fontWeight: 700, color: orange, letterSpacing: "0.12em", margin: "0 0 14px" }}>{n + 1}</p>
              <p style={{ fontFamily: n === 1 ? serif : sans, fontStyle: n === 1 ? "italic" : "normal", fontSize: n === 1 ? 34 : 25, lineHeight: 1.4, fontWeight: n === 1 ? 500 : 500, color: navy, margin: 0 }}>{t(b.en, b.id, lang)}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    key: "wounds",
    dark: true,
    render: lang => (
      <>
        <h2 style={{ ...bigTitle, color: offWhite, fontStyle: "italic", fontSize: 108, maxWidth: 1300 }}>
          &ldquo;{t("Faithful are the wounds of a friend.", "Setia adalah luka seorang sahabat.", lang)}&rdquo;
        </h2>
        <p style={kicker}>{t("Proverbs 27:6", "Amsal 27:6", lang)}</p>
        {rule(120)}
        <p style={{ ...body, color: onNavy, maxWidth: 1100 }}>
          {t("A friend who only tells you what you want to hear is not actually serving you.",
            "Seorang teman yang hanya memberitahumu apa yang ingin kamu dengar sebenarnya tidak melayanimu.", lang)}
        </p>
      </>
    ),
  },
  {
    key: "iron",
    render: lang => (
      <>
        <h2 style={{ ...midTitle, fontSize: 68 }}>{t("Sharpened by honest contact", "Diasah oleh perjumpaan yang jujur", lang)}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, width: "100%" }}>
          {[
            { ref: { en: "Proverbs 27:17", id: "Amsal 27:17" }, head: { en: "Iron sharpens iron", id: "Besi menajamkan besi" },
              text: { en: "Iron against iron makes friction, heat and sparks. The sharpening needs the friction.", id: "Besi melawan besi menghasilkan gesekan, panas, dan percikan. Penajaman membutuhkan gesekan." } },
            { ref: { en: "Ephesians 4:15", id: "Efesus 4:15" }, head: { en: "Speaking the truth in love", id: "Berkata benar dalam kasih" },
              text: { en: "This is how a body grows up into maturity. Silence is not neutral. It steps out of that growth.", id: "Beginilah tubuh bertumbuh menjadi dewasa. Diam bukan netral. Diam berarti mundur dari pertumbuhan itu." } },
          ].map(v => (
            <div key={v.ref.en} style={{ ...card, padding: "40px 44px", borderLeft: `8px solid ${orange}` }}>
              <p style={{ ...kicker, textAlign: "left", marginBottom: 14 }}>{t(v.ref.en, v.ref.id, lang)}</p>
              <p style={{ fontFamily: serif, fontSize: 54, fontWeight: 600, color: navy, margin: "0 0 18px", lineHeight: 1.1 }}>{t(v.head.en, v.head.id, lang)}</p>
              <p style={{ fontFamily: sans, fontSize: 24, lineHeight: 1.5, color: muted, margin: 0 }}>{t(v.text.en, v.text.id, lang)}</p>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: 38, color: navy, margin: 0, textAlign: "center", maxWidth: 1250, lineHeight: 1.3 }}>
          {t("Honest confrontation, rooted in care, is an act of covenant love.", "Konfrontasi yang jujur, berakar pada kepedulian, adalah tindakan kasih perjanjian.", lang)}
        </p>
      </>
    ),
  },
  {
    key: "questions",
    render: lang => (
      <>
        <p style={kicker}>{t("Talk about it", "Diskusikan", lang)}</p>
        <h2 style={{ ...midTitle, fontSize: 68 }}>{t("Questions to sit with", "Pertanyaan untuk direnungkan", lang)}</h2>
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 20, width: 1200 }}>
          {QUESTIONS.map((q, n) => (
            <li key={q.en} style={{ ...card, display: "flex", alignItems: "center", gap: 28, padding: "26px 36px" }}>
              <span style={{ flexShrink: 0, fontFamily: serif, fontSize: 64, fontWeight: 600, color: orange, lineHeight: 1, width: 44 }}>{n + 1}</span>
              <span style={{ fontFamily: serif, fontSize: 38, fontWeight: 500, color: navy, lineHeight: 1.25 }}>{t(q.en, q.id, lang)}</span>
            </li>
          ))}
        </ol>
      </>
    ),
  },
  {
    key: "this-week",
    render: lang => (
      <>
        <p style={kicker}>{t("Key takeaway", "Poin utama", lang)}</p>
        <h2 style={{ ...midTitle, fontSize: 68 }}>{t("Three things to do this week", "Tiga hal untuk dilakukan minggu ini", lang)}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, width: "100%" }}>
          {THIS_WEEK.map((w, n) => (
            <div key={w.en} style={{ ...card, padding: "36px 34px", display: "flex", flexDirection: "column", gap: 18 }}>
              <span style={{ width: 64, height: 64, borderRadius: 999, background: orange, color: "white", fontFamily: serif, fontSize: 40, fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{n + 1}</span>
              <p style={{ fontFamily: sans, fontSize: 25, lineHeight: 1.45, fontWeight: 600, color: navy, margin: 0 }}>{t(w.en, w.id, lang)}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
];

// One slide on the 1600×900 canvas, with a quiet footer
function SlideFrame({ index, lang }: { index: number; lang: Lang }) {
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
      <div style={{ position: "absolute", inset: "64px 120px 110px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 36 }}>
        {s.render(lang)}
      </div>
      {!isTitle && (
        <div style={{ position: "absolute", left: 120, right: 120, bottom: 44, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 14, fontSize: 17, fontWeight: 600, color: dark ? onNavy : muted, letterSpacing: "0.04em" }}>
            <img src="/logo-icon.png" alt="" aria-hidden="true" width={30} height={30} style={{ display: "block" }} />
            {t("Creating Healthy Conflict", "Menciptakan Konflik yang Sehat", lang)}
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
  const [i, setI] = useState(0);
  const [isFull, setIsFull] = useState(false);
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

  const go = useCallback((n: number) => { setBlank(false); setI(Math.max(0, Math.min(last, n))); }, [last]);
  const next = useCallback(() => { setBlank(false); setI(n => Math.min(last, n + 1)); }, [last]);
  const prev = useCallback(() => { setBlank(false); setI(n => Math.max(0, n - 1)); }, []);

  const toggleFull = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    else rootRef.current?.requestFullscreen?.().catch(() => {});
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
    const mq = window.matchMedia(`(max-width: ${MIN_WIDTH - 1}px)`);
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

  // Preload every slide image so clicking through never waits
  useEffect(() => {
    ["hero", "conflict-table"].forEach(s => { const im = new Image(); im.src = `${IMG}/${s}.jpg`; });
  }, []);

  // Stop the page behind from scrolling while presenting
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prevOverflow; };
  }, []);

  const moduleHref = `/resources/${SLUG}`;
  const showUi = uiVisible || !started || overview;

  if (tooSmall) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: navy, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: sans }}>
        <div style={{ maxWidth: 360, textAlign: "center" }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={orange} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ margin: "0 auto 20px", display: "block" }}>
            <rect x="3" y="4" width="18" height="12" rx="2" /><path d="M12 16v4M8 20h8" />
          </svg>
          <p style={{ fontFamily: serif, fontSize: 30, fontWeight: 600, color: offWhite, margin: "0 0 12px", lineHeight: 1.2 }}>
            {t("Presenting needs a bigger screen", "Presentasi butuh layar yang lebih besar", lang)}
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: "oklch(82% 0.03 80)", margin: "0 0 28px" }}>
            {t("Open this module on a tablet or computer to show the slides to your team.",
              "Buka modul ini di tablet atau komputer untuk menampilkan slide kepada tim Anda.", lang)}
          </p>
          <Link href={moduleHref} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 44, padding: "0 22px", borderRadius: 8, background: orange, color: "white", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
            {t("Back to the module", "Kembali ke modul", lang)}
          </Link>
        </div>
      </div>
    );
  }

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
        .hc-fade { animation: hcFade 0.45s ease; }
        @keyframes hcFade { from { opacity: 0; } to { opacity: 1; } }
        .hc-ui { transition: opacity 0.4s ease, transform 0.4s ease; }
        .hc-pill:hover { background: oklch(100% 0 0 / 0.12) !important; }
        .hc-pill:focus-visible, .hc-thumb:focus-visible { outline: 2px solid ${orange}; outline-offset: 2px; }
        .hc-thumb { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hc-thumb:hover { transform: translateY(-3px); }
        .hc-step { opacity: 0; animation: hcRise 0.6s ease forwards; }
        @keyframes hcRise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        .hc-bar { transform-origin: left; animation: hcGrow 0.9s ease both 0.2s; }
        @keyframes hcGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @media (prefers-reduced-motion: reduce) { .hc-fade, .hc-step, .hc-bar { animation: none; opacity: 1; } .hc-ui, .hc-thumb { transition: none; } }
      `}</style>

      {/* Stage: the scaled slide, click right side for next, left side for back */}
      <div ref={stageRef}
        onClick={e => {
          if (overview) return;
          setStarted(true);
          const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          if (e.clientX - r.left < r.width * 0.3) prev(); else next();
        }}
        style={{ position: "absolute", inset: isFull ? 0 : 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div aria-live="polite" aria-roledescription="slide" aria-label={`${i + 1} / ${SLIDES.length}`}
          style={{ width: W * scale, height: H * scale, position: "relative", boxShadow: isFull ? "none" : "0 30px 80px oklch(0% 0 0 / 0.45)", borderRadius: isFull ? 0 : 6, overflow: "hidden" }}>
          <div key={`${i}-${lang}`} className="hc-fade" style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "top left" }}>
            <SlideFrame index={i} lang={lang} />
          </div>
          {blank && <div style={{ position: "absolute", inset: 0, background: "black" }} />}
        </div>
      </div>

      {/* Start hint, shown until the presenter first moves on */}
      {!started && !overview && (
        <div className="hc-ui" style={{ position: "absolute", left: "50%", bottom: 104, transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 14 }}>
          {!isFull && (
            <button type="button" onClick={() => { setStarted(true); toggleFull(); }}
              style={{ display: "inline-flex", alignItems: "center", gap: 10, height: 48, padding: "0 24px", borderRadius: 999, border: "none", background: orange, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 10px 30px oklch(0% 0 0 / 0.35)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
              {t("Start full screen", "Mulai layar penuh", lang)}
            </button>
          )}
          <span style={{ fontSize: 13, color: "oklch(85% 0.02 80)", background: "oklch(0% 0 0 / 0.45)", padding: "8px 14px", borderRadius: 999 }}>
            {t("Arrow keys or clicker to move. F full screen. G all slides.", "Tombol panah atau clicker untuk pindah. F layar penuh. G semua slide.", lang)}
          </span>
        </div>
      )}

      {/* Control bar */}
      <div className="hc-ui" role="toolbar" aria-label={t("Presentation controls", "Kontrol presentasi", lang)}
        style={{ position: "absolute", left: "50%", bottom: 28, transform: `translateX(-50%) translateY(${showUi ? 0 : 16}px)`, opacity: showUi ? 1 : 0, pointerEvents: showUi ? "auto" : "none",
          display: "flex", alignItems: "center", gap: 2, padding: 6, borderRadius: 16, background: "oklch(18% 0.05 260 / 0.88)", backdropFilter: "blur(12px)", boxShadow: "0 12px 40px oklch(0% 0 0 / 0.4)" }}>
        <button type="button" className="hc-pill" style={{ ...pill, opacity: i === 0 ? 0.35 : 1 }} disabled={i === 0} onClick={() => { setStarted(true); prev(); }}
          aria-label={t("Previous slide", "Slide sebelumnya", lang)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <span style={{ minWidth: 64, textAlign: "center", fontSize: 14, fontWeight: 700, color: offWhite, fontVariantNumeric: "tabular-nums" }}>{i + 1} / {SLIDES.length}</span>
        <button type="button" className="hc-pill" style={{ ...pill, opacity: i === last ? 0.35 : 1 }} disabled={i === last} onClick={() => { setStarted(true); next(); }}
          aria-label={t("Next slide", "Slide berikutnya", lang)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        </button>
        {sep}
        <button type="button" className="hc-pill" style={pill} onClick={() => setOverview(o => !o)} aria-pressed={overview}
          aria-label={t("All slides", "Semua slide", lang)} title={t("All slides (G)", "Semua slide (G)", lang)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
        </button>
        <div role="group" aria-label={t("Language", "Bahasa", lang)} style={{ display: "inline-flex", gap: 2, background: "oklch(100% 0 0 / 0.08)", borderRadius: 10, padding: 2 }}>
          {(["en", "id"] as Lang[]).map(l => (
            <button key={l} type="button" className="hc-pill" aria-pressed={lang === l} onClick={() => setLang(l)}
              style={{ ...pill, height: 40, minWidth: 44, background: lang === l ? orange : "transparent" }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button type="button" className="hc-pill" style={pill} onClick={toggleFull}
          aria-label={isFull ? t("Exit full screen", "Keluar dari layar penuh", lang) : t("Full screen", "Layar penuh", lang)}
          title={isFull ? t("Exit full screen (F)", "Keluar dari layar penuh (F)", lang) : t("Full screen (F)", "Layar penuh (F)", lang)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {isFull ? <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /> : <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}
          </svg>
        </button>
        {sep}
        <Link href={moduleHref} className="hc-pill" style={{ ...pill, textDecoration: "none", gap: 6 }} aria-label={t("Close presentation", "Tutup presentasi", lang)}>
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
              <button key={s.key} type="button" className="hc-thumb" onClick={() => { go(n); setOverview(false); setStarted(true); }}
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
        <SlideFrame index={index} lang={lang} />
      </div>
    </div>
  );
}
