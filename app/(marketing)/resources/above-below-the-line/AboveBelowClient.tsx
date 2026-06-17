"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id";

const t = (en: string, id: string, lang: Lang) =>
  lang === "en" ? en : id;

const FRAMEWORK = [
  {
    title: "VICTOR",
    titleId: "VICTOR",
    position: "above" as const,
    descEn: "Takes ownership. Controls response. Drives change.",
    descId: "Mengambil kepemilikan. Mengendalikan respons. Mendorong perubahan.",
  },
  {
    title: "VICTIM",
    titleId: "KORBAN",
    position: "below" as const,
    descEn: "Blames circumstances. Waits for rescue. Feels powerless.",
    descId: "Menyalahkan keadaan. Menunggu penyelamatan. Merasa tidak berdaya.",
  },
  {
    title: "OWNERSHIP",
    titleId: "KEPEMILIKAN",
    position: "above" as const,
    descEn: "Accepts responsibility. Focuses on solutions. Builds trust.",
    descId: "Menerima tanggung jawab. Fokus pada solusi. Membangun kepercayaan.",
  },
  {
    title: "BLAME",
    titleId: "MENYALAHKAN",
    position: "below" as const,
    descEn: "Points outward. Avoids reflection. Erodes relationships.",
    descId: "Menunjuk ke luar. Menghindari refleksi. Mengikis hubungan.",
  },
  {
    title: "ACCOUNTABILITY",
    titleId: "TANGGUNG GUGAT",
    position: "above" as const,
    descEn: "Keeps commitments. Shows up for team. Earns credibility.",
    descId: "Menjaga komitmen. Muncul untuk tim. Mendapatkan kredibilitas.",
  },
  {
    title: "EXCUSE",
    titleId: "ALASAN",
    position: "below" as const,
    descEn: "Justifies inaction. Delays accountability. Kills momentum.",
    descId: "Membenarkan ketidakaktifan. Menunda tanggung jawab. Membunuh momentum.",
  },
];

const STORIES = [
  {
    titleEn: "The Missed Deadline",
    titleId: "Batas Waktu yang Terlewat",
    beforeEn: "\"The client didn't give us clear requirements. That's why we missed the deadline.\"",
    beforeId: "\"Klien tidak memberikan kami persyaratan yang jelas. Itulah mengapa kami melewatkan batas waktu.\"",
    shiftEn: "Then we asked: \"What could WE have done differently?\"",
    shiftId: "Kemudian kami bertanya: \"Apa yang BISA kami lakukan secara berbeda?\"",
    afterEn: "We owned the communication gap and proposed weekly sync meetings. Next project: on time.",
    afterId: "Kami mengakui kesenjangan komunikasi dan mengusulkan pertemuan sinkron mingguan. Proyek berikutnya: tepat waktu.",
    resultEn: "Team learned to clarify scope upfront. Trust increased.",
    resultId: "Tim belajar memperjelas ruang lingkup di muka. Kepercayaan meningkat.",
  },
  {
    titleEn: "The Team Conflict",
    titleId: "Konflik Tim",
    beforeEn: "\"Sarah keeps dismissing my ideas in meetings. I'm not going to contribute anymore.\"",
    beforeId: "\"Sarah terus menolak ide saya di pertemuan. Saya tidak akan berkontribusi lagi.\"",
    shiftEn: "Then we asked: \"What conversation do WE need to have?\"",
    shiftId: "Kemudian kami bertanya: \"Percakapan apa yang PERLU kami miliki?\"",
    afterEn: "We initiated a 1-on-1 with Sarah to understand her perspective. Turned out there was a misunderstanding.",
    afterId: "Kami memulai 1-on-1 dengan Sarah untuk memahami perspektifnya. Ternyata ada kesalahpahaman.",
    resultEn: "Relationship restored. Better collaboration. Team morale improved.",
    resultId: "Hubungan dipulihkan. Kolaborasi lebih baik. Moral tim meningkat.",
  },
  {
    titleEn: "The Skill Gap",
    titleId: "Kesenjangan Keterampilan",
    beforeEn: "\"I don't have the training for this. I can't do it.\"",
    beforeId: "\"Saya tidak memiliki pelatihan untuk ini. Saya tidak bisa melakukannya.\"",
    shiftEn: "Then we asked: \"What support do I need to learn this?\"",
    shiftId: "Kemudian kami bertanya: \"Dukungan apa yang saya butuhkan untuk mempelajari ini?\"",
    afterEn: "We sought mentorship, took an online course, and practiced. Within 3 months: proficient.",
    afterId: "Kami mencari bimbingan, mengikuti kursus online, dan berlatih. Dalam 3 bulan: mahir.",
    resultEn: "Expanded capability. Increased confidence. Career growth.",
    resultId: "Kemampuan diperluas. Kepercayaan diri meningkat. Pertumbuhan karir.",
  },
];

const BIBLICAL_STORIES = [
  {
    ref: "Genesis 3:12",
    refId: "Kejadian 3:12",
    titleEn: "The Original Blame Shift",
    titleId: "Pergeseran Kesalahan Pertama",
    textEn: "When God confronted Adam, his response was layered: \"The woman whom you gave to be with me, she gave me fruit of the tree, and I ate.\" He displaced blame onto Eve — and subtly implicated God. Eve blamed the serpent. Neither owned what they did. This is the oldest recorded below-the-line pattern: evasion, excuse, and deflection, appearing on the first pages of Scripture.",
    textId: "Ketika Allah menghadapi Adam, responsnya berlapis: \"Perempuan yang Kautempatkan di sisiku, dialah yang memberi buah pohon itu kepadaku, maka kumakan.\" Dia memindahkan kesalahan kepada Hawa — dan secara halus menyiratkan Allah. Hawa menyalahkan ular. Tidak ada yang mengakui apa yang mereka lakukan. Ini adalah pola di bawah garis yang tertua dicatat: pengelakan, alasan, dan pengalihan.",
    type: "below",
  },
  {
    ref: "2 Samuel 12:13 vs 1 Samuel 15",
    refId: "2 Samuel 12:13 vs 1 Samuel 15",
    titleEn: "Two Leaders, Two Responses",
    titleId: "Dua Pemimpin, Dua Respons",
    textEn: "When Nathan confronted David, David said: \"I have sinned against the Lord.\" No deflection. No committee. No counter-accusation. Saul's pattern was different — denial, blame shifted to the people, and reputation management. God removed Saul not because his sin was worse than David's, but because David owned it and Saul didn't. Ownership, not perfection, is the leadership standard.",
    textId: "Ketika Natan menghadapi Daud, Daud berkata: 'Aku telah berdosa kepada Tuhan.' Tidak ada pengalihan. Tidak ada komite. Tidak ada tuduhan balik. Pola Saul berbeda — penyangkalan, kesalahan dibebankan kepada rakyat, dan manajemen reputasi. Allah membuang Saul bukan karena dosanya lebih besar dari Daud, tetapi karena Daud mengakuinya dan Saul tidak. Kepemilikan, bukan kesempurnaan, adalah standar kepemimpinan.",
    type: "contrast",
  },
  {
    ref: "Matthew 25:14–30",
    refId: "Matius 25:14–30",
    titleEn: "Passivity Is Below the Line",
    titleId: "Pasif Adalah Di Bawah Garis",
    textEn: "The servant who buried his talent was condemned not for spectacular failure but for inaction. He had a reason — fear. But passivity itself is a below-the-line choice. The other two servants received equal commendation despite unequal results. What mattered was faithfulness proportional to capacity. Waiting and doing nothing is not neutral — it is a choice.",
    textId: "Hamba yang mengubur talentanya dikecam bukan karena kegagalan spektakuler tetapi karena ketidakaktifan. Dia punya alasan — rasa takut. Tetapi pasif sendiri adalah pilihan di bawah garis. Dua hamba lainnya mendapat pujian yang sama meskipun hasilnya berbeda. Yang penting adalah kesetiaan sesuai kapasitas. Menunggu dan tidak melakukan apa-apa bukan netral — itu adalah pilihan.",
    type: "below",
  },
  {
    ref: "1 Samuel 25",
    refId: "1 Samuel 25",
    titleEn: "Above the Line Without Confrontation",
    titleId: "Di Atas Garis Tanpa Konfrontasi",
    textEn: "Abigail did not wait for someone else to solve a crisis she could see. She took ownership, acted wisely, and interrupted David's destructive plan through relational courage — not direct confrontation. She spoke truth, but through the grain of the culture rather than against it. A model for leaders in contexts where direct challenge shuts down the very conversation it is meant to open.",
    textId: "Abigail tidak menunggu orang lain memecahkan krisis yang dia lihat. Dia mengambil kepemilikan, bertindak bijaksana, dan menghentikan rencana destruktif Daud melalui keberanian relasional — bukan konfrontasi langsung. Dia berbicara kebenaran, tetapi mengikuti arus budaya bukan melawannya. Sebuah model bagi pemimpin dalam konteks di mana tantangan langsung menutup percakapan yang dimaksudkan untuk dibuka.",
    type: "above",
  },
];

const FOUR_STEPS = [
  {
    num: "01",
    titleEn: "See It",
    titleId: "Lihat",
    descEn: "Acknowledge reality honestly. Stop minimizing, denying, or explaining away what is actually happening. Name it clearly.",
    descId: "Akui kenyataan dengan jujur. Berhenti meminimalkan, menyangkal, atau menjelaskan apa yang sebenarnya terjadi. Namai dengan jelas.",
  },
  {
    num: "02",
    titleEn: "Own It",
    titleId: "Miliki",
    descEn: "Accept your contribution to the situation. No excuses. No deflection. Even if others share responsibility, own your part.",
    descId: "Terima kontribusi Anda pada situasi tersebut. Tanpa alasan. Tanpa pengalihan. Bahkan jika orang lain berbagi tanggung jawab, miliki bagian Anda.",
  },
  {
    num: "03",
    titleEn: "Solve It",
    titleId: "Selesaikan",
    descEn: "Shift your focus from the problem to the solution. Ask: what can I actually do here? Work within your circle of influence.",
    descId: "Alihkan fokus Anda dari masalah ke solusi. Tanyakan: apa yang sebenarnya bisa saya lakukan di sini? Bekerja dalam lingkaran pengaruh Anda.",
  },
  {
    num: "04",
    titleEn: "Do It",
    titleId: "Lakukan",
    descEn: "Act. Take the step. Don't wait for perfect conditions, ideal timing, or someone else's permission. Move.",
    descId: "Bertindak. Ambil langkah itu. Jangan menunggu kondisi sempurna, waktu yang ideal, atau izin orang lain. Bergerak.",
  },
];

const ABOVE_PHRASES = ["When—", "Choice", "I am going to—", "I will", "I chose to", "I chose not to", "Make things happen", "Why not?", "TGIM", "Day one"];
const ABOVE_PHRASES_ID = ["Ketika—", "Pilihan", "Saya akan—", "Saya mau", "Saya memilih untuk", "Saya memilih untuk tidak", "Jadikan hal itu terjadi", "Kenapa tidak?", "TGIM", "Hari pertama"];

const BELOW_PHRASES = ["If—", "Had no choice", "I hope—", "Maybe—", "I try—", "It might—", "I think—", "I need to—", "Hopefully", "Every intention", "I should", "I would", "I could", "I must", "WHY?", "TGIF", "Waiting for other people", "One day"];
const BELOW_PHRASES_ID = ["Jika—", "Tidak punya pilihan", "Saya harap—", "Mungkin—", "Saya mencoba—", "Mungkin saja—", "Saya pikir—", "Saya perlu—", "Semoga", "Setiap niat", "Saya seharusnya", "Saya akan", "Saya bisa", "Saya harus", "KENAPA?", "TGIF", "Menunggu orang lain", "Suatu hari nanti"];

function getAbovePhrases(lang: Lang) {
  return lang === "en" ? ABOVE_PHRASES : ABOVE_PHRASES_ID;
}
function getBelowPhrases(lang: Lang) {
  return lang === "en" ? BELOW_PHRASES : BELOW_PHRASES_ID;
}

type PhraseConfig = { left: string; top: string; delay: string; dur: string; size: number };

const ABOVE_CONFIGS: PhraseConfig[] = [
  { left: "7%",  top: "16%", delay: "0s",    dur: "9s",    size: 13 },
  { left: "27%", top: "58%", delay: "2.5s",  dur: "11s",   size: 11 },
  { left: "48%", top: "22%", delay: "5s",    dur: "8.5s",  size: 15 },
  { left: "66%", top: "64%", delay: "1.2s",  dur: "10s",   size: 12 },
  { left: "81%", top: "28%", delay: "3.8s",  dur: "12s",   size: 14 },
  { left: "14%", top: "74%", delay: "7s",    dur: "9s",    size: 11 },
  { left: "54%", top: "46%", delay: "4.2s",  dur: "10.5s", size: 13 },
  { left: "88%", top: "68%", delay: "6s",    dur: "8s",    size: 12 },
  { left: "37%", top: "82%", delay: "2s",    dur: "11s",   size: 11 },
  { left: "73%", top: "12%", delay: "8.5s",  dur: "9.5s",  size: 14 },
];

const BELOW_CONFIGS: PhraseConfig[] = [
  { left: "6%",  top: "18%", delay: "0s",    dur: "10s",   size: 12 },
  { left: "22%", top: "56%", delay: "1.5s",  dur: "8.5s",  size: 11 },
  { left: "40%", top: "14%", delay: "3s",    dur: "11s",   size: 13 },
  { left: "58%", top: "66%", delay: "0.8s",  dur: "9s",    size: 11 },
  { left: "76%", top: "24%", delay: "4.5s",  dur: "10.5s", size: 14 },
  { left: "89%", top: "72%", delay: "2.2s",  dur: "8s",    size: 12 },
  { left: "12%", top: "82%", delay: "6s",    dur: "12s",   size: 11 },
  { left: "50%", top: "42%", delay: "5s",    dur: "9.5s",  size: 13 },
  { left: "32%", top: "76%", delay: "7s",    dur: "10s",   size: 11 },
  { left: "67%", top: "50%", delay: "1s",    dur: "11.5s", size: 12 },
  { left: "83%", top: "14%", delay: "8s",    dur: "9s",    size: 14 },
  { left: "17%", top: "34%", delay: "3.5s",  dur: "10s",   size: 12 },
  { left: "44%", top: "86%", delay: "2.8s",  dur: "8.5s",  size: 11 },
  { left: "62%", top: "22%", delay: "6.5s",  dur: "9.5s",  size: 13 },
  { left: "28%", top: "10%", delay: "4s",    dur: "11s",   size: 12 },
  { left: "78%", top: "86%", delay: "1.8s",  dur: "10.5s", size: 11 },
  { left: "8%",  top: "54%", delay: "7.5s",  dur: "8s",    size: 14 },
  { left: "92%", top: "44%", delay: "5.5s",  dur: "9s",    size: 12 },
];

export default function AboveBelowClient({
  isSaved,
}: {
  userPathway: string | null;
  isSaved: boolean;
}) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(isSaved);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await saveResourceToDashboard("above-below-the-line");
      setSaved(true);
    });
  }

  const abovePhrases = getAbovePhrases(lang);
  const belowPhrases = getBelowPhrases(lang);

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: "oklch(97% 0.005 260)", minHeight: "100vh" }}>
      <LangToggle />

      {/* ANIMATED HERO */}
      <section style={{ position: "relative", height: "clamp(480px, 85vh, 720px)", overflow: "hidden" }}>
        <style>{`
          @keyframes ab-phrase {
            0%   { opacity: 0; transform: translateY(10px); }
            12%  { opacity: 1; }
            80%  { opacity: 1; transform: translateY(-6px); }
            92%  { opacity: 0; }
            100% { opacity: 0; transform: translateY(-10px); }
          }
        `}</style>

        {/* GREEN ZONE — top half */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, height: "50%",
          background: "radial-gradient(ellipse at 50% 80%, oklch(30% 0.20 145) 0%, oklch(17% 0.13 145) 50%, oklch(10% 0.07 145) 100%)",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: 20, left: 28,
            fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
            textTransform: "uppercase", color: "oklch(62% 0.20 145)",
            userSelect: "none",
          }}>
            {t("Above the Line", "Di Atas Garis", lang)}
          </div>

          {abovePhrases.map((phrase, i) => {
            const cfg = ABOVE_CONFIGS[i % ABOVE_CONFIGS.length];
            return (
              <span
                key={i}
                style={{
                  position: "absolute",
                  left: cfg.left,
                  top: cfg.top,
                  fontSize: cfg.size,
                  fontWeight: 600,
                  color: "oklch(86% 0.14 145)",
                  opacity: 0,
                  letterSpacing: "0.03em",
                  whiteSpace: "nowrap",
                  animation: `ab-phrase ${cfg.dur} ${cfg.delay} ease-in-out infinite`,
                  textShadow: "0 0 28px oklch(48% 0.24 145 / 0.7)",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                {phrase}
              </span>
            );
          })}
        </div>

        {/* THE LINE with title */}
        <div style={{
          position: "absolute",
          top: "50%", left: 0, right: 0,
          transform: "translateY(-50%)",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          padding: "0 32px",
        }}>
          <div style={{ flex: 1, height: 1.5, background: "linear-gradient(to right, transparent, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.38) 50%, rgba(255,255,255,0.12) 80%, transparent)" }} />
          <h1 style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(20px, 3.5vw, 38px)",
            fontWeight: 600,
            color: "rgba(255,255,255,0.95)",
            margin: "0 28px",
            whiteSpace: "nowrap",
            textShadow: "0 2px 40px rgba(0,0,0,0.85)",
            letterSpacing: "0.01em",
          }}>
            {t("Above & Below the Line", "Di Atas & Di Bawah Garis", lang)}
          </h1>
          <div style={{ flex: 1, height: 1.5, background: "linear-gradient(to left, transparent, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.38) 50%, rgba(255,255,255,0.12) 80%, transparent)" }} />
        </div>

        {/* RED ZONE — bottom half */}
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0, height: "50%",
          background: "radial-gradient(ellipse at 50% 20%, oklch(32% 0.22 25) 0%, oklch(17% 0.14 25) 50%, oklch(10% 0.07 25) 100%)",
          overflow: "hidden",
        }}>
          {belowPhrases.map((phrase, i) => {
            const cfg = BELOW_CONFIGS[i % BELOW_CONFIGS.length];
            return (
              <span
                key={i}
                style={{
                  position: "absolute",
                  left: cfg.left,
                  top: cfg.top,
                  fontSize: cfg.size,
                  fontWeight: 600,
                  color: "oklch(84% 0.12 25)",
                  opacity: 0,
                  letterSpacing: "0.03em",
                  whiteSpace: "nowrap",
                  animation: `ab-phrase ${cfg.dur} ${cfg.delay} ease-in-out infinite`,
                  textShadow: "0 0 28px oklch(48% 0.24 25 / 0.7)",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                {phrase}
              </span>
            );
          })}

          <div style={{
            position: "absolute", bottom: 20, left: 28,
            fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
            textTransform: "uppercase", color: "oklch(62% 0.20 25)",
            userSelect: "none",
          }}>
            {t("Below the Line", "Di Bawah Garis", lang)}
          </div>
        </div>
      </section>

      {/* IMPACT SECTION */}
      <section style={{ background: "oklch(97% 0.005 260)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", margin: "0 0 16px" }}>
            {t("Team & Facilitation — Guide", "Tim & Fasilitasi — Panduan", lang)}
          </p>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 16px" }}>
            {t("Victor or Victim?", "Victor atau Korban?", lang)}
          </h2>
          <p style={{ fontSize: 16, color: "oklch(44% 0.06 260)", lineHeight: 1.75, maxWidth: 660, margin: "0 0 52px" }}>
            {t(
              "Every response to a situation is either above or below the line. The pattern you repeat determines the culture you create — and the leader you become.",
              "Setiap respons terhadap suatu situasi berada di atas atau di bawah garis. Pola yang Anda ulangi menentukan budaya yang Anda ciptakan — dan pemimpin seperti apa Anda.",
              lang
            )}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, marginBottom: 40 }}>
            {/* Victor */}
            <div style={{ borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 20px oklch(20% 0.06 260 / 0.09)" }}>
              <div style={{ background: "oklch(19% 0.14 145)", padding: "28px 28px 24px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(62% 0.20 145)", marginBottom: 8 }}>
                  {t("Above the Line", "Di Atas Garis", lang)}
                </div>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 30, fontWeight: 600, color: "white", lineHeight: 1.1 }}>
                  {t("The Victor", "Victor", lang)}
                </div>
              </div>
              <div style={{ background: "white", padding: "28px" }}>
                {([
                  { en: "Takes ownership — even when it's uncomfortable", id: "Mengambil kepemilikan — bahkan ketika tidak nyaman" },
                  { en: "Controls their response to any situation", id: "Mengendalikan respons mereka terhadap situasi apapun" },
                  { en: "Drives change rather than waiting for rescue", id: "Mendorong perubahan daripada menunggu penyelamatan" },
                  { en: "Builds credibility through consistent accountability", id: "Membangun kredibilitas melalui akuntabilitas yang konsisten" },
                  { en: "Creates a culture others want to work in", id: "Menciptakan budaya yang ingin dimasuki orang lain" },
                ] as { en: string; id: string }[]).map((item, i, arr) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: i < arr.length - 1 ? 14 : 0 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "oklch(46% 0.16 145)", marginTop: 8, flexShrink: 0 }} />
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: "oklch(35% 0.06 260)", margin: 0 }}>{t(item.en, item.id, lang)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Victim */}
            <div style={{ borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 20px oklch(20% 0.06 260 / 0.09)" }}>
              <div style={{ background: "oklch(19% 0.14 25)", padding: "28px 28px 24px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(62% 0.20 25)", marginBottom: 8 }}>
                  {t("Below the Line", "Di Bawah Garis", lang)}
                </div>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 30, fontWeight: 600, color: "white", lineHeight: 1.1 }}>
                  {t("The Victim", "Korban", lang)}
                </div>
              </div>
              <div style={{ background: "white", padding: "28px" }}>
                {([
                  { en: "Blames circumstances — finds reasons why it's not their fault", id: "Menyalahkan keadaan — mencari alasan mengapa bukan kesalahan mereka" },
                  { en: "Feels powerless, waiting for others to solve the problem", id: "Merasa tidak berdaya, menunggu orang lain memecahkan masalah" },
                  { en: "Points outward rather than reflecting inward", id: "Menunjuk ke luar daripada merefleksikan ke dalam" },
                  { en: "Erodes trust through excuses and denial", id: "Mengikis kepercayaan melalui alasan dan penolakan" },
                  { en: "Creates a culture of stagnation and resentment", id: "Menciptakan budaya stagnasi dan kebencian" },
                ] as { en: string; id: string }[]).map((item, i, arr) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: i < arr.length - 1 ? 14 : 0 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "oklch(48% 0.18 25)", marginTop: 8, flexShrink: 0 }} />
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: "oklch(35% 0.06 260)", margin: 0 }}>{t(item.en, item.id, lang)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stat callout */}
          <div style={{ background: "oklch(22% 0.10 260)", borderRadius: 14, padding: "40px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 36, marginBottom: 24 }}>
              <div>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 56, fontWeight: 600, color: "oklch(65% 0.15 45)", lineHeight: 1 }}>80%</div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.65, marginTop: 10, marginBottom: 0 }}>
                  {t(
                    "of people experience accountability as punishment — something that only happens when things go wrong.",
                    "orang merasakan akuntabilitas sebagai hukuman — sesuatu yang hanya terjadi ketika sesuatu salah.",
                    lang
                  )}
                </p>
              </div>
              <div>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 56, fontWeight: 600, color: "oklch(65% 0.15 45)", lineHeight: 1 }}>84%</div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.65, marginTop: 10, marginBottom: 0 }}>
                  {t(
                    "cite leader behavior as the single most important factor in shaping accountability culture in their organization.",
                    "menyebut perilaku pemimpin sebagai faktor terpenting dalam membentuk budaya akuntabilitas di organisasi mereka.",
                    lang
                  )}
                </p>
              </div>
            </div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.30)", margin: 0, letterSpacing: "0.04em" }}>
              {t(
                "Culture Partners — study of 40,000 participants across hundreds of organizations (2011–2014).",
                "Culture Partners — studi terhadap 40.000 peserta di ratusan organisasi (2011–2014).",
                lang
              )}
            </p>
          </div>

          {/* Save button */}
          <div style={{ marginTop: 36 }}>
            {!saved ? (
              <button
                onClick={handleSave}
                disabled={isPending}
                style={{ background: "oklch(65% 0.15 45)", color: "white", padding: "13px 28px", borderRadius: 10, fontWeight: 700, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", border: "none", cursor: isPending ? "default" : "pointer", opacity: isPending ? 0.6 : 1 }}
              >
                {isPending ? t("Saving—", "Menyimpan—", lang) : t("Save to Dashboard", "Simpan ke Dashboard", lang)}
              </button>
            ) : (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "oklch(46% 0.16 145)", fontSize: 14, fontWeight: 600 }}>
                ✓ {t("Saved to Dashboard", "Tersimpan di Dashboard", lang)}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* BIBLICAL FOUNDATIONS */}
      <section style={{ background: "oklch(14% 0.08 260)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", margin: "0 0 16px" }}>
            {t("Scripture & Leadership", "Kitab Suci & Kepemimpinan", lang)}
          </p>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600, color: "oklch(96% 0.005 80)", margin: "0 0 16px" }}>
            {t("The Oldest Pattern in the Book", "Pola Tertua dalam Kitab", lang)}
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, maxWidth: 620, margin: "0 0 52px" }}>
            {t(
              "Accountability and blame are not modern management concepts. They appear on the first pages of Scripture — and the pattern has not changed.",
              "Akuntabilitas dan menyalahkan bukanlah konsep manajemen modern. Mereka muncul di halaman pertama Kitab Suci — dan polanya belum berubah.",
              lang
            )}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 40 }}>
            {BIBLICAL_STORIES.map((story, i) => {
              const borderColor = story.type === "above"
                ? "oklch(46% 0.16 145)"
                : story.type === "below"
                ? "oklch(48% 0.18 25)"
                : "oklch(65% 0.15 45)";
              return (
                <div key={i} style={{
                  background: "oklch(20% 0.09 260)",
                  borderRadius: 12,
                  padding: "28px",
                  borderTop: `3px solid ${borderColor}`,
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: borderColor, marginBottom: 10 }}>
                    {t(story.ref, story.refId, lang)}
                  </div>
                  <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 600, color: "oklch(96% 0.005 80)", marginBottom: 14, lineHeight: 1.2 }}>
                    {t(story.titleEn, story.titleId, lang)}
                  </div>
                  <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.60)", lineHeight: 1.75, margin: 0 }}>
                    {t(story.textEn, story.textId, lang)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Stewardship callout */}
          <div style={{
            background: "oklch(22% 0.10 260)",
            border: "1px solid oklch(65% 0.15 45 / 0.25)",
            borderRadius: 14,
            padding: "36px 40px",
            display: "flex",
            flexDirection: "column" as const,
            gap: 12,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)" }}>
              {t("The Stewardship Frame", "Kerangka Penatalayanan", lang)}
            </div>
            <blockquote style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 26, fontWeight: 600, color: "oklch(96% 0.005 80)", margin: 0, lineHeight: 1.4 }}>
              {t(
                "\"It is required of stewards that they be found trustworthy.\"",
                "\"Yang dituntut dari para penatalayan ialah bahwa mereka ditemukan setia.\"",
                lang
              )}
            </blockquote>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.40)", margin: 0, letterSpacing: "0.04em" }}>
              {t("1 Corinthians 4:2", "1 Korintus 4:2", lang)}
            </p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.60)", lineHeight: 1.70, margin: "4px 0 0" }}>
              {t(
                "This verse reframes accountability entirely. We are not owners — we are stewards. That shifts the question from \"who is at fault?\" to \"am I being faithful with what has been entrusted to me?\" It is a frame that works across cultures, because it relocates accountability upward rather than distributing blame horizontally.",
                "Ayat ini mendefinisikan ulang akuntabilitas sepenuhnya. Kita bukan pemilik — kita adalah penatalayan. Itu menggeser pertanyaan dari \"siapa yang salah?\" menjadi \"apakah saya setia dengan apa yang dipercayakan kepada saya?\" Ini adalah kerangka yang bekerja lintas budaya, karena ia menempatkan akuntabilitas ke atas daripada mendistribusikan kesalahan secara horizontal.",
                lang
              )}
            </p>
          </div>
        </div>
      </section>

      {/* FRAMEWORK — SIDE-BY-SIDE */}
      <section style={{ background: "oklch(94% 0.008 260)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
            {t("The Line", "Garis Tersebut", lang)}
          </h2>
          <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", marginBottom: 40, lineHeight: 1.65 }}>
            {t(
              "There is a line. Every response you give to a situation is either above it or below it.",
              "Ada sebuah garis. Setiap respons yang Anda berikan terhadap suatu situasi berada di atas atau di bawahnya.",
              lang
            )}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr", gap: 32 }}>
            {/* ABOVE */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "oklch(46% 0.16 145)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 18 }}>↑</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(46% 0.16 145)" }}>{t("ABOVE THE LINE", "DI ATAS GARIS", lang)}</div>
                  <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 600, color: "oklch(30% 0.10 145)" }}>{t("Pro-Active Mindset", "Mentalitas Pro-Aktif", lang)}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {FRAMEWORK.filter(f => f.position === "above").map(item => (
                  <div key={item.title} style={{ background: "white", borderRadius: 8, padding: "20px", boxShadow: "0 1px 4px oklch(20% 0.06 260 / 0.08)" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "oklch(46% 0.16 145)", letterSpacing: "0.04em", marginBottom: 6 }}>{t(item.title, item.titleId, lang)}</div>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: "oklch(35% 0.06 260)", margin: 0 }}>{t(item.descEn, item.descId, lang)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* DIVIDER */}
            <div style={{ background: "linear-gradient(to bottom, oklch(22% 0.10 260) 0%, oklch(65% 0.15 45) 50%, oklch(22% 0.10 260) 100%)" }} />

            {/* BELOW */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "oklch(48% 0.18 25)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 18 }}>↓</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(48% 0.18 25)" }}>{t("BELOW THE LINE", "DI BAWAH GARIS", lang)}</div>
                  <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 600, color: "oklch(30% 0.12 25)" }}>{t("Reactive Patterns", "Pola Reaktif", lang)}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {FRAMEWORK.filter(f => f.position === "below").map(item => (
                  <div key={item.title} style={{ background: "white", borderRadius: 8, padding: "20px", boxShadow: "0 1px 4px oklch(20% 0.06 260 / 0.08)" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "oklch(48% 0.18 25)", letterSpacing: "0.04em", marginBottom: 6 }}>{t(item.title, item.titleId, lang)}</div>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: "oklch(35% 0.06 260)", margin: 0 }}>{t(item.descEn, item.descId, lang)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOUR STEPS */}
      <section style={{ background: "white", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", margin: "0 0 16px" }}>
            {t("The Oz Principle — 1994", "The Oz Principle — 1994", lang)}
          </p>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 16px" }}>
            {t("Four Steps to Accountability", "Empat Langkah Menuju Akuntabilitas", lang)}
          </h2>
          <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", lineHeight: 1.75, maxWidth: 620, margin: "0 0 52px" }}>
            {t(
              "The framework behind this module comes from The Oz Principle (Connors, Smith & Hickman, 1994). Its core insight: moving from below the line to above is a four-step sequence, not a single decision.",
              "Kerangka di balik modul ini berasal dari The Oz Principle (Connors, Smith & Hickman, 1994). Wawasan intinya: bergerak dari bawah garis ke atas adalah urutan empat langkah, bukan satu keputusan.",
              lang
            )}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 2, marginBottom: 40, borderRadius: 12, overflow: "hidden" }}>
            {FOUR_STEPS.map((step, i) => (
              <div key={i} style={{
                background: i % 2 === 0 ? "oklch(96% 0.006 260)" : "oklch(98% 0.003 260)",
                padding: "32px 28px",
                position: "relative" as const,
              }}>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 48, fontWeight: 600, color: "oklch(88% 0.04 260)", lineHeight: 1, marginBottom: 16 }}>
                  {step.num}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "oklch(42% 0.14 260)", marginBottom: 10 }}>
                  {t(step.titleEn, step.titleId, lang)}
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "oklch(38% 0.06 260)", margin: 0 }}>
                  {t(step.descEn, step.descId, lang)}
                </p>
                {i < FOUR_STEPS.length - 1 && (
                  <div style={{
                    position: "absolute",
                    right: -10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 2,
                    width: 20,
                    height: 20,
                    background: "oklch(65% 0.15 45)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: 10,
                    fontWeight: 700,
                  }}>→</div>
                )}
              </div>
            ))}
          </div>

          {/* Victim cycle */}
          <div style={{ background: "oklch(28% 0.12 25 / 0.07)", borderRadius: 12, padding: "28px 32px", borderLeft: "4px solid oklch(48% 0.18 25)", marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(48% 0.18 25)", marginBottom: 10 }}>
              {t("The Victim Cycle", "Siklus Korban", lang)}
            </div>
            <p style={{ fontSize: 14, color: "oklch(38% 0.06 260)", lineHeight: 1.7, margin: 0 }}>
              {t(
                "Below the line: blame → excuse-making → denial → confusion → waiting to be told. Each step is not a passive state — it is an active choice not to move. The victim cycle has its own momentum. Breaking it requires a deliberate decision to See It.",
                "Di bawah garis: menyalahkan → membuat alasan → penyangkalan → kebingungan → menunggu diperintah. Setiap langkah bukan keadaan pasif — itu adalah pilihan aktif untuk tidak bergerak. Siklus korban memiliki momentumnya sendiri. Memutusnya memerlukan keputusan yang disengaja untuk Melihatnya.",
                lang
              )}
            </p>
          </div>

          {/* Cross-cultural note */}
          <div style={{ background: "oklch(96% 0.006 260)", borderRadius: 12, padding: "28px 32px", borderLeft: "4px solid oklch(42% 0.14 260)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(42% 0.14 260)", marginBottom: 10 }}>
              {t("Cross-Cultural Note", "Catatan Lintas Budaya", lang)}
            </div>
            <p style={{ fontSize: 14, color: "oklch(38% 0.06 260)", lineHeight: 1.7, margin: "0 0 12px" }}>
              {t(
                "These four steps assume a low-context, individualist starting point. In honor/shame cultures — dominant across Southeast Asia, the Middle East, and much of Africa — direct confrontation can close the door this framework is meant to open.",
                "Empat langkah ini mengasumsikan titik awal konteks-rendah dan individualis. Dalam budaya kehormatan/rasa malu — dominan di seluruh Asia Tenggara, Timur Tengah, dan sebagian besar Afrika — konfrontasi langsung dapat menutup pintu yang dimaksudkan oleh kerangka ini untuk dibuka.",
                lang
              )}
            </p>
            <p style={{ fontSize: 14, color: "oklch(38% 0.06 260)", lineHeight: 1.7, margin: 0 }}>
              {t(
                "Adapt — don't abandon — the framework. \"See It\" may need to happen privately. \"Own It\" may begin as \"we contributed\" before becoming \"I contributed.\" Building psychological safety through relational trust must come before accountability conversations can be effective. The framework works — it just needs to enter through the culture, not against it.",
                "Adaptasi — jangan tinggalkan — kerangka tersebut. \"Melihat\" mungkin perlu terjadi secara pribadi. \"Memiliki\" mungkin dimulai sebagai \"kami berkontribusi\" sebelum menjadi \"saya berkontribusi.\" Membangun keamanan psikologis melalui kepercayaan relasional harus datang sebelum percakapan akuntabilitas dapat efektif. Kerangka ini berhasil — hanya perlu masuk melalui budaya, bukan melawannya.",
                lang
              )}
            </p>
          </div>
        </div>
      </section>

      {/* STORIES */}
      <section style={{ padding: "72px 24px", background: "oklch(94% 0.008 260)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
            {t("Real Stories", "Kisah Nyata", lang)}
          </h2>
          <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", marginBottom: 40, lineHeight: 1.65 }}>
            {t(
              "How the shift from below the line to above makes a real difference in teams and leaders.",
              "Bagaimana pergeseran dari bawah garis ke atas membuat perbedaan nyata dalam tim dan pemimpin.",
              lang
            )}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28 }}>
            {STORIES.map((story, i) => (
              <div key={i} style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 12px oklch(20% 0.06 260 / 0.10)" }}>
                <div style={{ background: "oklch(42% 0.14 260)", color: "white", padding: "24px" }}>
                  <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 600, margin: 0 }}>{t(story.titleEn, story.titleId, lang)}</div>
                </div>
                <div style={{ background: "white", padding: "28px" }}>
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(48% 0.18 25)", marginBottom: 8 }}>↓ {t("Before", "Sebelum", lang)}</div>
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: "oklch(35% 0.06 260)", fontStyle: "italic", margin: 0 }}>{t(story.beforeEn, story.beforeId, lang)}</p>
                  </div>
                  <div style={{ marginBottom: 24, paddingLeft: 16, borderLeft: "3px solid oklch(65% 0.15 45)" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: 8 }}>→ {t("The Shift", "Peralihan", lang)}</div>
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: "oklch(35% 0.06 260)", margin: 0 }}>{t(story.shiftEn, story.shiftId, lang)}</p>
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(46% 0.16 145)", marginBottom: 8 }}>↑ {t("After", "Sesudah", lang)}</div>
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: "oklch(35% 0.06 260)", margin: 0 }}>{t(story.afterEn, story.afterId, lang)}</p>
                  </div>
                  <div style={{ paddingTop: 16, borderTop: "1px solid oklch(88% 0.008 260)" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(42% 0.14 260)", marginBottom: 8 }}>✓ {t("Outcome", "Hasil", lang)}</div>
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: "oklch(30% 0.06 260)", fontWeight: 600, margin: 0 }}>{t(story.resultEn, story.resultId, lang)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REFLECTION */}
      <section style={{ padding: "72px 24px", background: "white" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
            {t("Reflection Questions", "Pertanyaan Refleksi", lang)}
          </h2>
          <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", marginBottom: 40, lineHeight: 1.65 }}>
            {t(
              "Use these to process your own leadership patterns — alone or with a coach.",
              "Gunakan ini untuk memproses pola kepemimpinan Anda sendiri — sendiri atau bersama pelatih.",
              lang
            )}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {([
              {
                color: "oklch(46% 0.16 145)",
                qEn: "Think of a recent situation. What was your first instinct — Victor or Victim? What drove that response?",
                qId: "Pikirkan situasi terkini. Apa naluri pertama Anda — Victor atau Korban? Apa yang mendorong respons itu?",
              },
              {
                color: "oklch(42% 0.14 260)",
                qEn: "Where in your leadership do you notice below-the-line patterns most often? What triggers them?",
                qId: "Di mana dalam kepemimpinan Anda Anda paling sering memperhatikan pola di bawah garis? Apa yang memicunya?",
              },
              {
                color: "oklch(48% 0.18 25)",
                qEn: "What would it look like to choose ownership in the situation you're currently facing? What one above-the-line action could you take today?",
                qId: "Seperti apa memilih kepemilikan dalam situasi yang Anda hadapi saat ini? Satu tindakan di atas garis apa yang bisa Anda ambil hari ini?",
              },
              {
                color: "oklch(55% 0.10 80)",
                qEn: "If you reframed your current challenge as a steward rather than an owner — \"I am responsible for what I've been entrusted with\" — what would you do differently?",
                qId: "Jika Anda mendefinisikan ulang tantangan Anda saat ini sebagai penatalayan daripada pemilik — \"Saya bertanggung jawab atas apa yang dipercayakan kepada saya\" — apa yang akan Anda lakukan secara berbeda?",
              },
            ] as { color: string; qEn: string; qId: string }[]).map((q, i) => (
              <div key={i} style={{ background: "oklch(96% 0.006 260)", borderRadius: 10, padding: "28px", boxShadow: "0 1px 8px oklch(20% 0.06 260 / 0.07)" }}>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 40, fontWeight: 600, color: q.color, display: "block", marginBottom: 12, lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</span>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "oklch(30% 0.06 260)", margin: 0, fontStyle: "italic" }}>"{t(q.qEn, q.qId, lang)}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESOURCES / DOWNLOADS */}
      <section style={{ background: "oklch(96% 0.006 260)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", margin: "0 0 16px" }}>
            {t("Downloads", "Unduhan", lang)}
          </p>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
            {t("Take This With You", "Bawa Ini Bersama Anda", lang)}
          </h2>
          <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", lineHeight: 1.7, maxWidth: 560, margin: "0 0 40px" }}>
            {t(
              "Download the full resource guide — including the framework overview, four steps, reflection questions, and facilitation notes.",
              "Unduh panduan sumber daya lengkap — termasuk ikhtisar kerangka, empat langkah, pertanyaan refleksi, dan catatan fasilitasi.",
              lang
            )}
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" as const }}>
            <a
              href="/resources/above-below-the-line-en.pdf"
              download
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "oklch(22% 0.10 260)",
                color: "white",
                padding: "14px 28px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: "0.06em",
                textTransform: "uppercase" as const,
                textDecoration: "none",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {t("English PDF", "PDF Bahasa Inggris", lang)}
            </a>
            <a
              href="/resources/above-below-the-line-id.pdf"
              download
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "transparent",
                color: "oklch(22% 0.10 260)",
                padding: "14px 28px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: "0.06em",
                textTransform: "uppercase" as const,
                textDecoration: "none",
                border: "2px solid oklch(22% 0.10 260)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {t("Indonesian PDF", "PDF Bahasa Indonesia", lang)}
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "oklch(22% 0.10 260)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(96% 0.005 80)", margin: "0 0 20px" }}>
            {t("Choose to Lead Above the Line", "Pilih untuk Memimpin Di Atas Garis", lang)}
          </h2>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/resources" style={{ display: "inline-block", background: "transparent", color: "oklch(85% 0.04 260)", padding: "14px 32px", borderRadius: 12, fontWeight: 600, fontSize: 14, border: "1px solid oklch(42% 0.08 260)", textDecoration: "none" }}>
              {t("Training Library", "Perpustakaan Pelatihan", lang)}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
