"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import LangToggle from "@/components/LangToggle";
import SourcesDropdown from "@/components/SourcesDropdown";
import { saveResourceToDashboard } from "@/app/(marketing)/resources/actions";

type Lang = "en" | "id";

const navy     = "oklch(22% 0.10 260)";
const orange   = "oklch(65% 0.15 45)";
const offWhite = "oklch(97% 0.005 80)";
const lightGray = "oklch(95% 0.008 260)";
const bodyText = "oklch(38% 0.05 260)";

const t = (en: string, id: string, lang: Lang) =>
  lang === "en" ? en : id;

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
    textEn: "When God confronted Adam, his response was layered: \"The woman whom you gave to be with me, she gave me fruit of the tree, and I ate.\" He displaced blame onto Eve — and subtly implicated God. Eve blamed the serpent. Neither owned what they did. This is the oldest recorded below-the-line pattern: evasion, excuse, and deflection.",
    textId: "Ketika Allah menghadapi Adam, responsnya berlapis: \"Perempuan yang Kautempatkan di sisiku, dialah yang memberi buah pohon itu kepadaku, maka kumakan.\" Dia memindahkan kesalahan kepada Hawa — dan secara halus menyiratkan Allah. Hawa menyalahkan ular. Tidak ada yang mengakui apa yang mereka lakukan.",
  },
  {
    ref: "2 Samuel 12:13 vs 1 Samuel 15",
    refId: "2 Samuel 12:13 vs 1 Samuel 15",
    titleEn: "Two Leaders, Two Responses",
    titleId: "Dua Pemimpin, Dua Respons",
    textEn: "When Nathan confronted David, David said: \"I have sinned against the Lord.\" No deflection. No committee. Saul's pattern was different — denial, blame shifted to the people, reputation management. God removed Saul not because his sin was worse than David's, but because David owned it. Ownership, not perfection, is the leadership standard.",
    textId: "Ketika Natan menghadapi Daud, Daud berkata: 'Aku telah berdosa kepada Tuhan.' Tidak ada pengalihan. Tidak ada komite. Pola Saul berbeda — penyangkalan, menyalahkan rakyat, manajemen reputasi. Allah membuang Saul bukan karena dosanya lebih besar, tetapi karena Daud mengakuinya.",
  },
  {
    ref: "Matthew 25:14–30",
    refId: "Matius 25:14–30",
    titleEn: "Passivity Is Below the Line",
    titleId: "Pasif Adalah Di Bawah Garis",
    textEn: "The servant who buried his talent was condemned not for spectacular failure but for inaction. He had a reason — fear. But passivity itself is a below-the-line choice. The other two servants received equal commendation despite unequal results. Faithfulness proportional to capacity, not outcome, is the standard.",
    textId: "Hamba yang mengubur talentanya dikecam bukan karena kegagalan spektakuler tetapi karena ketidakaktifan. Dia punya alasan — rasa takut. Tetapi pasif sendiri adalah pilihan di bawah garis. Kesetiaan sesuai kapasitas, bukan hasil, adalah standarnya.",
  },
  {
    ref: "1 Samuel 25",
    refId: "1 Samuel 25",
    titleEn: "Above the Line Without Confrontation",
    titleId: "Di Atas Garis Tanpa Konfrontasi",
    textEn: "Abigail did not wait for someone else to solve a crisis she could see. She took ownership, acted wisely, and interrupted David's destructive plan through relational courage — not direct confrontation. A model for leaders in contexts where direct challenge closes the door it was meant to open.",
    textId: "Abigail tidak menunggu orang lain memecahkan krisis yang dia lihat. Dia mengambil kepemilikan, bertindak bijaksana, dan menghentikan rencana destruktif Daud melalui keberanian relasional — bukan konfrontasi langsung.",
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
    descEn: "Act. Take the step. Don't wait for perfect conditions or someone else's permission. Move.",
    descId: "Bertindak. Ambil langkah itu. Jangan menunggu kondisi sempurna atau izin orang lain. Bergerak.",
  },
];

const ABOVE_PHRASES = ["Ownership", "See it", "Accountable", "Seek solutions", "Take action", "Hope", "Find better ways", "Own it", "Solve", "Make choices", "Take responsibility", "Take action"];
const ABOVE_PHRASES_ID = ["Kepemilikan", "Lihat", "Bertanggung jawab", "Cari solusi", "Ambil tindakan", "Harapan", "Temukan cara lebih baik", "Miliki", "Selesaikan", "Buat pilihan", "Ambil tanggung jawab", "Bertindak"];
const BELOW_PHRASES = ["See failure", "Ignore", "No control", "Wait for others", "Deny", "Excuses", "Obstacles", "Stay stuck", "Block", "Find fault", "Do nothing", "Blame"];
const BELOW_PHRASES_ID = ["Lihat kegagalan", "Abaikan", "Tidak ada kendali", "Tunggu orang lain", "Sangkal", "Alasan", "Hambatan", "Tetap terjebak", "Blokir", "Cari kesalahan", "Tidak bertindak", "Menyalahkan"];

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
  { left: "58%", top: "34%", delay: "10s",   dur: "10s",   size: 12 },
  { left: "21%", top: "40%", delay: "11.5s", dur: "9s",    size: 13 },
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
];

const SOURCES_EN = [
  "Roger Connors, Tom Smith & Craig Hickman — The Oz Principle: Getting Results Through Individual and Organizational Accountability (1994). The foundational framework behind the above/below the line model and the four-step accountability sequence.",
  "Culture Partners — Accountability Study: 40,000 Participants Across Hundreds of Organizations (2011–2014). Source of the 80% and 84% statistics cited in this module.",
  "Jim Dethmer, Diana Chapman & Kaley Waner Klemp — The 15 Commitments of Conscious Leadership (2015). A parallel above/below framework framing accountability as openness vs. defensiveness.",
  "Geert Hofstede — Culture's Consequences (1980/2001). Power distance index and its implications for accountability in hierarchical cultures across Southeast Asia.",
  "Guo, Y. et al. — Ethical Leadership and Feedback-Seeking Behavior in High Power Distance Cultures. Frontiers in Psychology (2019). Peer-reviewed research on building psychological safety before accountability conversations.",
  "PMC / National Library of Medicine — Accountability in Indonesian Public Organizations (peer-reviewed). Study of 331 government employees; formalization and role clarity as primary drivers of accountability.",
  "Roland Muller — Honor and Shame: Unlocking the Door (2000). Framework for understanding shame-honor dynamics in cross-cultural accountability contexts.",
  "KnowledgeWorkx — Three Colors of Worldview: Guilt-Innocence, Honor-Shame, Fear-Power. Structured framework for mapping cultural contexts in cross-cultural leadership teams.",
  "Theology of Work Project — Commentary on the Parable of the Talents (Matthew 25:14–30). Faithfulness as the standard of stewardship accountability in Christian leadership.",
  "The Shiloh Project — Analysis of Genesis 3 and the blame-shifting pattern in the fall narrative. Source for the theological framing of below-the-line behavior in Scripture.",
];

const SOURCES_ID = [
  "Roger Connors, Tom Smith & Craig Hickman — The Oz Principle (1994). Kerangka dasar di balik model di atas/di bawah garis dan urutan empat langkah akuntabilitas.",
  "Culture Partners — Studi Akuntabilitas: 40.000 Peserta di Ratusan Organisasi (2011–2014). Sumber statistik 80% dan 84% yang dikutip dalam modul ini.",
  "Jim Dethmer, Diana Chapman & Kaley Waner Klemp — The 15 Commitments of Conscious Leadership (2015). Kerangka di atas/di bawah paralel yang membingkai akuntabilitas sebagai keterbukaan vs. defensif.",
  "Geert Hofstede — Culture's Consequences (1980/2001). Indeks jarak kekuasaan dan implikasinya bagi akuntabilitas dalam budaya hierarkis di Asia Tenggara.",
  "Guo, Y. et al. — Kepemimpinan Etis dan Perilaku Mencari Umpan Balik dalam Budaya Jarak Kekuasaan Tinggi. Frontiers in Psychology (2019). Penelitian tentang membangun keamanan psikologis sebelum percakapan akuntabilitas.",
  "PMC / National Library of Medicine — Akuntabilitas di Organisasi Publik Indonesia (peer-reviewed). Studi terhadap 331 pegawai pemerintah; formalisasi dan kejelasan peran sebagai pendorong utama akuntabilitas.",
  "Roland Muller — Honor and Shame: Unlocking the Door (2000). Kerangka untuk memahami dinamika kehormatan/rasa malu dalam konteks akuntabilitas lintas budaya.",
  "KnowledgeWorkx — Tiga Warna Pandangan Dunia: Rasa Bersalah-Ketidakbersalahan, Kehormatan-Rasa Malu, Ketakutan-Kekuasaan.",
  "Theology of Work Project — Komentar tentang Perumpamaan Talenta (Matius 25:14–30). Kesetiaan sebagai standar akuntabilitas penatalayanan dalam kepemimpinan Kristen.",
  "The Shiloh Project — Analisis Kejadian 3 dan pola pergeseran kesalahan dalam narasi kejatuhan.",
];

type SaveState = "idle" | "saving" | "saved" | "already" | "signin";

export default function AboveBelowClient(_props: {
  userPathway?: string | null;
  isSaved?: boolean;
  isLoggedIn?: boolean;
}) {
  const { isSaved = false, isLoggedIn = false } = _props;
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" ? _ctxLang : "en") as Lang;

  const [saveState, setSaveState] = useState<SaveState>(isSaved ? "already" : "idle");
  const [, startSaving] = useTransition();

  function handleSave() {
    if (!isLoggedIn) { setSaveState("signin"); return; }
    setSaveState("saving");
    startSaving(async () => {
      const res = await saveResourceToDashboard("above-below-the-line");
      setSaveState(res.error ? "idle" : res.already ? "already" : "saved");
    });
  }

  const abovePhrases = lang === "en" ? ABOVE_PHRASES : ABOVE_PHRASES_ID;
  const belowPhrases = lang === "en" ? BELOW_PHRASES : BELOW_PHRASES_ID;

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>
      <LangToggle />

      {/* HERO */}
      <div style={{ background: navy, padding: "80px 24px 72px", position: "relative", overflow: "hidden" }}>
        <img
          src="/images/abl-rope-header.jpg"
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.55, mixBlendMode: "soft-light", pointerEvents: "none" }}
        />
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: orange }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 70% 50%, oklch(30% 0.12 260) 0%, transparent 60%)", opacity: 0.5 }} />
        <div style={{ position: "relative", maxWidth: 780, margin: "0 auto" }}>
          <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>
            {t("Accountability & Ownership — Guide", "Akuntabilitas & Kepemilikan — Panduan", lang)}
          </p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, color: offWhite, margin: "0 0 24px", lineHeight: 1.08 }}>
            {t("Above & Below the Line", "Di Atas & Di Bawah Garis", lang)}
          </h1>
          <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(16px, 2vw, 20px)", color: "oklch(85% 0.03 80)", maxWidth: 540, margin: "0 0 28px", lineHeight: 1.65, fontStyle: "italic" }}>
            {t(
              "Are you leading as a Victor — or a Victim?",
              "Apakah Anda memimpin sebagai Pemenang — atau Korban?",
              lang
            )}
          </p>

          {saveState === "saved" && (
            <p style={{ fontSize: 13, color: "oklch(72% 0.18 145)", fontWeight: 600 }}>
              {t("Saved to your dashboard.", "Tersimpan ke dasbor Anda.", lang)}
            </p>
          )}
          {saveState === "already" && (
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
              {t("Already in your dashboard.", "Sudah ada di dasbor Anda.", lang)}
            </p>
          )}
          {saveState === "signin" && (
            <Link href="/login" style={{ display: "inline-block", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: orange, border: `1px solid ${orange}`, borderRadius: 8, padding: "10px 20px", textDecoration: "none" }}>
              {t("Sign in to save", "Masuk untuk menyimpan", lang)}
            </Link>
          )}
          {(saveState === "idle" || saveState === "saving") && (
            <button
              onClick={handleSave}
              disabled={saveState === "saving"}
              style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "white", background: orange, border: "none", borderRadius: 8, padding: "10px 20px", cursor: saveState === "saving" ? "default" : "pointer", opacity: saveState === "saving" ? 0.6 : 1 }}
            >
              {saveState === "saving" ? t("Saving…", "Menyimpan…", lang) : t("Save to Dashboard", "Simpan ke Dasbor", lang)}
            </button>
          )}
        </div>
      </div>

      {/* INTRODUCTION */}
      <div style={{ padding: "72px 24px 0", maxWidth: 780, margin: "0 auto" }}>
        <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 24 }}>
          {t("The Framework", "Kerangka Kerja", lang)}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 20 }}>
          {t(
            "In 1994, Roger Connors, Tom Smith, and Craig Hickman introduced a deceptively simple idea: there is a line. Every response you give to any situation in your life — a setback, a conflict, a failure, a difficult person — lands either above it or below it. Above the line is the territory of ownership, accountability, and agency. Below the line is the territory of blame, excuses, and waiting for rescue. The choice between them is always yours.",
            "Pada tahun 1994, Roger Connors, Tom Smith, dan Craig Hickman memperkenalkan sebuah ide yang tampak sederhana: ada sebuah garis. Setiap respons yang Anda berikan terhadap situasi apapun dalam hidup Anda — kemunduran, konflik, kegagalan, orang yang sulit — mendarat di atas atau di bawahnya. Di atas garis adalah wilayah kepemilikan, akuntabilitas, dan keagenan. Di bawah garis adalah wilayah menyalahkan, alasan, dan menunggu penyelamatan. Pilihan di antara keduanya selalu ada di tangan Anda.",
            lang
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 72 }}>
          {t(
            "Research from Culture Partners, drawing on 40,000 participants across hundreds of organizations, found that 80% of people experience accountability as punishment — something that only happens when things go wrong. And 84% cite leader behavior as the single most important factor in shaping accountability culture. The line is not just a personal concept. The pattern a leader repeats becomes the culture a team inherits.",
            "Penelitian dari Culture Partners, yang melibatkan 40.000 peserta di ratusan organisasi, menemukan bahwa 80% orang merasakan akuntabilitas sebagai hukuman — sesuatu yang hanya terjadi ketika sesuatu salah. Dan 84% menyebut perilaku pemimpin sebagai faktor terpenting dalam membentuk budaya akuntabilitas. Garis ini bukan hanya konsep pribadi. Pola yang seorang pemimpin ulangi menjadi budaya yang tim warisi.",
            lang
          )}
        </p>
      </div>

      {/* ANIMATED BLOCK — contained width */}
      <div style={{ padding: "0 24px 72px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <style>{`
            @keyframes ab-phrase {
              0%   { opacity: 0; transform: translateY(10px); }
              12%  { opacity: 1; }
              80%  { opacity: 1; transform: translateY(-6px); }
              92%  { opacity: 0; }
              100% { opacity: 0; transform: translateY(-10px); }
            }
            @media (max-width: 640px) {
              .ab-phrase { font-size: 9px !important; }
              .ab-step-arrow { display: none !important; }
            }
          `}</style>

          <div style={{ position: "relative", height: 420, borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 48px oklch(20% 0.10 260 / 0.18)" }}>
            {/* GREEN ZONE */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "50%",
              background: "radial-gradient(ellipse at 50% 80%, oklch(30% 0.20 145) 0%, oklch(17% 0.13 145) 50%, oklch(10% 0.07 145) 100%)",
              overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 18, left: 24, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(62% 0.20 145)", userSelect: "none" }}>
                {t("Above the Line", "Di Atas Garis", lang)}
              </div>
              {abovePhrases.map((phrase, i) => {
                const cfg = ABOVE_CONFIGS[i % ABOVE_CONFIGS.length];
                return (
                  <span key={i} className="ab-phrase" style={{ position: "absolute", left: cfg.left, top: cfg.top, fontSize: cfg.size, fontWeight: 600, color: "oklch(86% 0.14 145)", opacity: 0, letterSpacing: "0.03em", whiteSpace: "nowrap", animation: `ab-phrase ${cfg.dur} ${cfg.delay} ease-in-out infinite`, textShadow: "0 0 28px oklch(48% 0.24 145 / 0.7)", pointerEvents: "none", userSelect: "none" }}>
                    {phrase}
                  </span>
                );
              })}
            </div>

            {/* THE LINE + TITLE */}
            <div style={{ position: "absolute", top: "50%", left: 0, right: 0, transform: "translateY(-50%)", zIndex: 10, display: "flex", alignItems: "center", padding: "0 28px" }}>
              <div style={{ flex: 1, height: 1.5, background: "linear-gradient(to right, transparent, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.38) 50%, rgba(255,255,255,0.12) 80%, transparent)" }} />
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(18px, 3vw, 32px)", fontWeight: 600, color: "rgba(255,255,255,0.95)", margin: "0 24px", whiteSpace: "nowrap", textShadow: "0 2px 40px rgba(0,0,0,0.85)", letterSpacing: "0.01em" }}>
                {t("Above & Below the Line", "Di Atas & Di Bawah Garis", lang)}
              </h2>
              <div style={{ flex: 1, height: 1.5, background: "linear-gradient(to left, transparent, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.38) 50%, rgba(255,255,255,0.12) 80%, transparent)" }} />
            </div>

            {/* RED ZONE */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: "50%",
              background: "radial-gradient(ellipse at 50% 20%, oklch(32% 0.22 25) 0%, oklch(17% 0.14 25) 50%, oklch(10% 0.07 25) 100%)",
              overflow: "hidden",
            }}>
              {belowPhrases.map((phrase, i) => {
                const cfg = BELOW_CONFIGS[i % BELOW_CONFIGS.length];
                return (
                  <span key={i} className="ab-phrase" style={{ position: "absolute", left: cfg.left, top: cfg.top, fontSize: cfg.size, fontWeight: 600, color: "oklch(84% 0.12 25)", opacity: 0, letterSpacing: "0.03em", whiteSpace: "nowrap", animation: `ab-phrase ${cfg.dur} ${cfg.delay} ease-in-out infinite`, textShadow: "0 0 28px oklch(48% 0.24 25 / 0.7)", pointerEvents: "none", userSelect: "none" }}>
                    {phrase}
                  </span>
                );
              })}
              <div style={{ position: "absolute", bottom: 18, left: 24, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(62% 0.20 25)", userSelect: "none" }}>
                {t("Below the Line", "Di Bawah Garis", lang)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VICTOR OR VICTIM */}
      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 16px" }}>
            {t("The Impact", "Dampaknya", lang)}
          </p>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600, color: navy, margin: "0 0 16px" }}>
            {t("Victor or Victim?", "Pemenang atau Korban?", lang)}
          </h2>
          <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, maxWidth: 620, margin: "0 0 44px" }}>
            {t(
              "Every response to a situation lands above or below the line. The pattern you repeat determines the culture you create — and the leader you become.",
              "Setiap respons terhadap suatu situasi mendarat di atas atau di bawah garis. Pola yang Anda ulangi menentukan budaya yang Anda ciptakan — dan pemimpin seperti apa Anda.",
              lang
            )}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, marginBottom: 32 }}>
            {/* Victor */}
            <div style={{ borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 20px oklch(20% 0.06 260 / 0.09)" }}>
              <div style={{ background: navy, padding: "28px 28px 24px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: orange, marginBottom: 8 }}>
                  {t("Above the Line", "Di Atas Garis", lang)}
                </div>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 30, fontWeight: 600, color: offWhite, lineHeight: 1.1 }}>
                  {t("The Victor", "Pemenang", lang)}
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
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: orange, marginTop: 8, flexShrink: 0 }} />
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: bodyText, margin: 0 }}>{t(item.en, item.id, lang)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Victim */}
            <div style={{ borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 20px oklch(20% 0.06 260 / 0.09)" }}>
              <div style={{ background: "oklch(32% 0.10 260)", padding: "28px 28px 24px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(70% 0.04 260)", marginBottom: 8 }}>
                  {t("Below the Line", "Di Bawah Garis", lang)}
                </div>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 30, fontWeight: 600, color: offWhite, lineHeight: 1.1 }}>
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
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "oklch(55% 0.06 260)", marginTop: 8, flexShrink: 0 }} />
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: bodyText, margin: 0 }}>{t(item.en, item.id, lang)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stat callout */}
          <div style={{ background: navy, borderRadius: 14, padding: "36px 40px" }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: orange, margin: "0 0 28px" }}>
              {t("What the Research Found", "Apa yang Ditemukan Penelitian", lang)}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 36, marginBottom: 24 }}>
              <div>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 64, fontWeight: 600, color: orange, lineHeight: 1 }}>80%</div>
                <p style={{ fontSize: 14, color: offWhite, fontWeight: 600, lineHeight: 1.5, marginTop: 10, marginBottom: 8 }}>
                  {t(
                    "of employees experience accountability as punishment.",
                    "karyawan merasakan akuntabilitas sebagai hukuman.",
                    lang
                  )}
                </p>
                <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.58)", lineHeight: 1.72, margin: 0 }}>
                  {t(
                    "In Culture Partners' study, 4 out of 5 people said accountability only showed up after something went wrong — a missed deadline, a failed project, a conflict. It was never framed as a practice for growth, ownership, or team health. The result: people learn to hide problems and avoid being accountable, not because they are irresponsible, but because accountability has come to mean consequence, not ownership.",
                    "Dalam studi Culture Partners, 4 dari 5 orang mengatakan akuntabilitas hanya muncul setelah sesuatu berjalan salah — tenggat waktu yang terlewat, proyek yang gagal, konflik. Akuntabilitas tidak pernah diframing sebagai praktik untuk pertumbuhan, kepemilikan, atau kesehatan tim. Hasilnya: orang belajar menyembunyikan masalah dan menghindari akuntabilitas — bukan karena tidak bertanggung jawab, tetapi karena akuntabilitas berarti konsekuensi, bukan kepemilikan.",
                    lang
                  )}
                </p>
              </div>
              <div>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 64, fontWeight: 600, color: orange, lineHeight: 1 }}>84%</div>
                <p style={{ fontSize: 14, color: offWhite, fontWeight: 600, lineHeight: 1.5, marginTop: 10, marginBottom: 8 }}>
                  {t(
                    "say leader behavior — not policy — shapes accountability culture.",
                    "mengatakan perilaku pemimpin — bukan kebijakan — yang membentuk budaya akuntabilitas.",
                    lang
                  )}
                </p>
                <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.58)", lineHeight: 1.72, margin: 0 }}>
                  {t(
                    "Training programs, values statements, and performance reviews had far less impact than how the leader responded to problems in real time. When a leader deflects, blames external factors, or avoids difficult conversations, teams learn to do the same. When a leader owns their contribution — even partially, even imperfectly — it signals that ownership is safe. The line a team lives on is most often the line the leader models.",
                    "Program pelatihan, pernyataan nilai, dan tinjauan kinerja jauh kurang berdampak dibandingkan bagaimana pemimpin merespons masalah secara real-time. Ketika pemimpin mengalihkan, menyalahkan faktor eksternal, atau menghindari percakapan sulit, tim belajar melakukan hal yang sama. Ketika pemimpin mengakui kontribusi mereka — bahkan sebagian, bahkan tidak sempurna — itu memberi sinyal bahwa kepemilikan itu aman. Garis tempat tim hidup paling sering adalah garis yang dicontohkan pemimpin.",
                    lang
                  )}
                </p>
              </div>
            </div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", margin: 0, letterSpacing: "0.04em", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20 }}>
              {t(
                "Source: Culture Partners — study of 40,000 participants across hundreds of organizations (2011–2014).",
                "Sumber: Culture Partners — studi terhadap 40.000 peserta di ratusan organisasi (2011–2014).",
                lang
              )}
            </p>
          </div>
        </div>
      </div>

      {/* BIBLICAL FOUNDATIONS */}
      <div style={{ background: navy, padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 16px" }}>
            {t("Scripture & Leadership", "Kitab Suci & Kepemimpinan", lang)}
          </p>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600, color: offWhite, margin: "0 0 16px" }}>
            {t("The Oldest Pattern in the Book", "Pola Tertua dalam Kitab", lang)}
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, maxWidth: 580, margin: "0 0 48px" }}>
            {t(
              "Accountability and blame are not modern management concepts. They appear on the first pages of Scripture — and the pattern has not changed.",
              "Akuntabilitas dan menyalahkan bukanlah konsep manajemen modern. Mereka muncul di halaman pertama Kitab Suci — dan polanya belum berubah.",
              lang
            )}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 40 }}>
            {BIBLICAL_STORIES.map((story, i) => (
              <div key={i} style={{ background: "oklch(20% 0.09 260)", borderRadius: 12, padding: "28px", borderTop: `3px solid ${orange}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: 10 }}>
                  {t(story.ref, story.refId, lang)}
                </div>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 21, fontWeight: 600, color: offWhite, marginBottom: 12, lineHeight: 1.25 }}>
                  {t(story.titleEn, story.titleId, lang)}
                </div>
                <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.58)", lineHeight: 1.78, margin: 0 }}>
                  {t(story.textEn, story.textId, lang)}
                </p>
              </div>
            ))}
          </div>

          {/* Stewardship callout */}
          <div style={{ border: `1px solid ${orange}40`, borderRadius: 14, padding: "36px 40px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: orange, marginBottom: 16 }}>
              {t("The Stewardship Frame", "Kerangka Penatalayanan", lang)}
            </div>
            <blockquote style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 26, fontWeight: 600, color: offWhite, margin: "0 0 12px", lineHeight: 1.4 }}>
              {t(
                "\"It is required of stewards that they be found trustworthy.\"",
                "\"Yang dituntut dari para penatalayan ialah bahwa mereka ditemukan setia.\"",
                lang
              )}
            </blockquote>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", margin: "0 0 20px", letterSpacing: "0.04em" }}>
              {t("1 Corinthians 4:2", "1 Korintus 4:2", lang)}
            </p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.60)", lineHeight: 1.75, margin: 0 }}>
              {t(
                "This reframes accountability entirely. We are not owners — we are stewards. That shifts the question from \"who is at fault?\" to \"am I being faithful with what has been entrusted to me?\" It is a frame that works across cultures, because it relocates accountability upward rather than distributing blame horizontally.",
                "Ini mendefinisikan ulang akuntabilitas sepenuhnya. Kita bukan pemilik — kita adalah penatalayan. Itu menggeser pertanyaan dari \"siapa yang salah?\" menjadi \"apakah saya setia dengan apa yang dipercayakan kepada saya?\" Kerangka ini bekerja lintas budaya, karena ia menempatkan akuntabilitas ke atas daripada mendistribusikan kesalahan secara horizontal.",
                lang
              )}
            </p>
          </div>
        </div>
      </div>

      {/* FOUR STEPS */}
      <div style={{ background: "white", padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 16px" }}>
            {t("The Oz Principle — 1994", "The Oz Principle — 1994", lang)}
          </p>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600, color: navy, margin: "0 0 16px" }}>
            {t("Four Steps to Accountability", "Empat Langkah Menuju Akuntabilitas", lang)}
          </h2>
          <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, maxWidth: 600, margin: "0 0 48px" }}>
            {t(
              "Moving from below the line to above is not a single decision — it is a four-step sequence. Each step is a choice.",
              "Bergerak dari bawah garis ke atas bukan satu keputusan — itu adalah urutan empat langkah. Setiap langkah adalah pilihan.",
              lang
            )}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 2, borderRadius: 12, overflow: "hidden", marginBottom: 32 }}>
            {FOUR_STEPS.map((step, i) => (
              <div key={i} style={{ background: i % 2 === 0 ? lightGray : offWhite, padding: "32px 24px", position: "relative" as const }}>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 48, fontWeight: 600, color: "oklch(88% 0.04 260)", lineHeight: 1, marginBottom: 14 }}>
                  {step.num}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: navy, marginBottom: 10 }}>
                  {t(step.titleEn, step.titleId, lang)}
                </div>
                <p style={{ fontSize: 13.5, lineHeight: 1.72, color: bodyText, margin: 0 }}>
                  {t(step.descEn, step.descId, lang)}
                </p>
                {i < FOUR_STEPS.length - 1 && (
                  <div className="ab-step-arrow" style={{ position: "absolute", right: -10, top: "50%", transform: "translateY(-50%)", zIndex: 2, width: 20, height: 20, background: orange, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 10, fontWeight: 700 }}>→</div>
                )}
              </div>
            ))}
          </div>

          {/* Cross-cultural note */}
          <div style={{ background: lightGray, borderRadius: 12, padding: "28px 32px", borderLeft: `4px solid ${navy}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: navy, marginBottom: 10 }}>
              {t("Cross-Cultural Note", "Catatan Lintas Budaya", lang)}
            </div>
            <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.75, margin: 0 }}>
              {t(
                "These four steps assume an individualist, low-context starting point. In honor/shame cultures — dominant across Southeast Asia, the Middle East, and much of Africa — direct confrontation can close the door this framework is meant to open. Adapt, don't abandon: \"See It\" may need to happen privately. \"Own It\" may begin as \"we contributed\" before \"I contributed.\" Build psychological safety through relational trust first. The framework works — it just needs to enter through the culture, not against it.",
                "Empat langkah ini mengasumsikan titik awal individualis dan konteks-rendah. Dalam budaya kehormatan/rasa malu — dominan di seluruh Asia Tenggara, Timur Tengah, dan sebagian besar Afrika — konfrontasi langsung dapat menutup pintu yang dimaksudkan kerangka ini untuk dibuka. Adaptasi, jangan tinggalkan: \"Melihat\" mungkin perlu terjadi secara pribadi. \"Memiliki\" mungkin dimulai sebagai \"kami berkontribusi\" sebelum \"saya berkontribusi.\" Bangun keamanan psikologis melalui kepercayaan relasional terlebih dahulu.",
                lang
              )}
            </p>
          </div>
        </div>
      </div>

      {/* REAL STORIES */}
      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 16px" }}>
            {t("In Practice", "Dalam Praktik", lang)}
          </p>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: navy, margin: "0 0 12px" }}>
            {t("Real Stories", "Kisah Nyata", lang)}
          </h2>
          <p style={{ fontSize: 15, color: bodyText, marginBottom: 40, lineHeight: 1.65 }}>
            {t(
              "How the shift from below the line to above makes a real difference in teams and leaders.",
              "Bagaimana pergeseran dari bawah garis ke atas membuat perbedaan nyata dalam tim dan pemimpin.",
              lang
            )}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {STORIES.map((story, i) => (
              <div key={i} style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 12px oklch(20% 0.06 260 / 0.10)" }}>
                <div style={{ background: navy, color: offWhite, padding: "24px" }}>
                  <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 600, margin: 0 }}>{t(story.titleEn, story.titleId, lang)}</div>
                </div>
                <div style={{ background: "white", padding: "28px" }}>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: "oklch(50% 0.06 260)", marginBottom: 8 }}>↓ {t("Before", "Sebelum", lang)}</div>
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: bodyText, fontStyle: "italic", margin: 0 }}>{t(story.beforeEn, story.beforeId, lang)}</p>
                  </div>
                  <div style={{ marginBottom: 20, paddingLeft: 16, borderLeft: `3px solid ${orange}` }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: orange, marginBottom: 8 }}>→ {t("The Shift", "Peralihan", lang)}</div>
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: bodyText, margin: 0 }}>{t(story.shiftEn, story.shiftId, lang)}</p>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: navy, marginBottom: 8 }}>↑ {t("After", "Sesudah", lang)}</div>
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: bodyText, margin: 0 }}>{t(story.afterEn, story.afterId, lang)}</p>
                  </div>
                  <div style={{ paddingTop: 16, borderTop: "1px solid oklch(90% 0.008 260)" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: orange, marginBottom: 8 }}>✓ {t("Outcome", "Hasil", lang)}</div>
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: navy, fontWeight: 600, margin: 0 }}>{t(story.resultEn, story.resultId, lang)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* REFLECTION */}
      <div style={{ background: "white", padding: "80px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 16px" }}>
            {t("Self-Assessment", "Penilaian Diri", lang)}
          </p>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: navy, margin: "0 0 12px" }}>
            {t("Reflection Questions", "Pertanyaan Refleksi", lang)}
          </h2>
          <p style={{ fontSize: 15, color: bodyText, marginBottom: 48, lineHeight: 1.65 }}>
            {t(
              "Use these to process your own leadership patterns — alone or with a coach.",
              "Gunakan ini untuk memproses pola kepemimpinan Anda sendiri — sendiri atau bersama pelatih.",
              lang
            )}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {([
              {
                qEn: "Think of a recent situation where something went wrong. What was your first instinct — to own it or to explain it away? What drove that response?",
                qId: "Pikirkan situasi terkini di mana sesuatu berjalan salah. Apa naluri pertama Anda — untuk mengakuinya atau menjelaskannya? Apa yang mendorong respons itu?",
              },
              {
                qEn: "Where in your leadership do you notice below-the-line patterns most often — with a particular person, a type of situation, or under a specific kind of pressure?",
                qId: "Di mana dalam kepemimpinan Anda Anda paling sering memperhatikan pola di bawah garis — dengan orang tertentu, jenis situasi, atau di bawah tekanan tertentu?",
              },
              {
                qEn: "What would it look like to choose ownership in the situation you're currently facing? Walk through the four steps: See It, Own It, Solve It, Do It.",
                qId: "Seperti apa memilih kepemilikan dalam situasi yang Anda hadapi saat ini? Telusuri empat langkah: Lihat, Miliki, Selesaikan, Lakukan.",
              },
              {
                qEn: "If you reframed your current challenge as a steward rather than an owner — \"I am responsible for what has been entrusted to me\" — what would you do differently today?",
                qId: "Jika Anda mendefinisikan ulang tantangan Anda saat ini sebagai penatalayan daripada pemilik — \"Saya bertanggung jawab atas apa yang dipercayakan kepada saya\" — apa yang akan Anda lakukan secara berbeda hari ini?",
              },
            ] as { qEn: string; qId: string }[]).map((q, i, arr) => (
              <div key={i} style={{ display: "flex", gap: 32, alignItems: "flex-start", paddingTop: i === 0 ? 0 : 32, paddingBottom: i < arr.length - 1 ? 32 : 0, borderBottom: i < arr.length - 1 ? "1px solid oklch(92% 0.008 260)" : "none" }}>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 52, fontWeight: 600, color: orange, lineHeight: 1, flexShrink: 0, minWidth: 52 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p style={{ fontSize: 16, lineHeight: 1.78, color: bodyText, margin: 0, paddingTop: 8, fontStyle: "italic" }}>
                  "{t(q.qEn, q.qId, lang)}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: navy, padding: "80px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: offWhite, margin: "0 0 20px" }}>
            {t("Choose to Lead Above the Line", "Pilih untuk Memimpin Di Atas Garis", lang)}
          </h2>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" as const }}>
            <Link href="/resources" style={{ display: "inline-block", background: "transparent", color: "oklch(85% 0.04 260)", padding: "14px 32px", borderRadius: 12, fontWeight: 600, fontSize: 14, border: "1px solid oklch(42% 0.08 260)", textDecoration: "none" }}>
              {t("Training Library", "Perpustakaan Pelatihan", lang)}
            </Link>
          </div>
        </div>
      </div>

      {/* SOURCES */}
      <SourcesDropdown
        sources={lang === "id" ? SOURCES_ID : SOURCES_EN}
        lang={lang}
        markerStyle="number"
      />
    </div>
  );
}
