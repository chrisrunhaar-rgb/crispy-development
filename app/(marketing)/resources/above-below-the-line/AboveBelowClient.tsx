"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id" | "nl";

const t = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const FRAMEWORK = [
  {
    title: "VICTOR",
    titleId: "VICTOR",
    titleNl: "OVERWINNAAR",
    position: "above" as const,
    descEn: "Takes ownership. Controls response. Drives change.",
    descId: "Mengambil kepemilikan. Mengendalikan respons. Mendorong perubahan.",
    descNl: "Neemt eigenaarschap. Controleert reactie. Drijft verandering.",
    icon: "victor",
  },
  {
    title: "VICTIM",
    titleId: "KORBAN",
    titleNl: "SLACHTOFFER",
    position: "below" as const,
    descEn: "Blames circumstances. Waits for rescue. Feels powerless.",
    descId: "Menyalahkan keadaan. Menunggu penyelamatan. Merasa tidak berdaya.",
    descNl: "Beschuldigt omstandigheden. Wacht op redding. Voelt zich machteloos.",
    icon: "victim",
  },
  {
    title: "OWNERSHIP",
    titleId: "KEPEMILIKAN",
    titleNl: "EIGENAARSCHAP",
    position: "above" as const,
    descEn: "Accepts responsibility. Focuses on solutions. Builds trust.",
    descId: "Menerima tanggung jawab. Fokus pada solusi. Membangun kepercayaan.",
    descNl: "Aanvaardt verantwoordelijkheid. Richt zich op oplossingen. Bouwt vertrouwen op.",
    icon: "ownership",
  },
  {
    title: "BLAME",
    titleId: "MENYALAHKAN",
    titleNl: "BESCHULDIGING",
    position: "below" as const,
    descEn: "Points outward. Avoids reflection. Erodes relationships.",
    descId: "Menunjuk ke luar. Menghindari refleksi. Mengikis hubungan.",
    descNl: "Wijst naar buiten. Vermijdt reflectie. Erodeer relaties.",
    icon: "blame",
  },
  {
    title: "ACCOUNTABILITY",
    titleId: "TANGGUNG GUGAT",
    titleNl: "AANSPREEKBAARHEID",
    position: "above" as const,
    descEn: "Keeps commitments. Shows up for team. Earns credibility.",
    descId: "Menjaga komitmen. Muncul untuk tim. Mendapatkan kredibilitas.",
    descNl: "Houdt zich aan toezeggingen. Verschijnt voor team. Wint geloofwaardigheid.",
    icon: "accountability",
  },
  {
    title: "EXCUSE",
    titleId: "ALASAN",
    titleNl: "EXCUUS",
    position: "below" as const,
    descEn: "Justifies inaction. Delays accountability. Kills momentum.",
    descId: "Membenarkan ketidakaktifan. Menunda tanggung jawab. Membunuh momentum.",
    descNl: "Rechtvaardigt inactiviteit. Vertraagt verantwoordelijkheid. Doodt momentum.",
    icon: "excuse",
  },
];

const STORIES = [
  {
    titleEn: "The Missed Deadline",
    titleId: "Batas Waktu yang Terlewat",
    titleNl: "De Gemiste Deadline",
    beforeEn: "\"The client didn't give us clear requirements. That's why we missed the deadline.\"",
    beforeId: "\"Klien tidak memberikan kami persyaratan yang jelas. Itulah mengapa kami melewatkan batas waktu.\"",
    beforeNl: "\"De klant gaf ons geen duidelijke vereisten. Daarom hebben we de deadline gemist.\"",
    shiftEn: "Then we asked: \"What could WE have done differently?\"",
    shiftId: "Kemudian kami bertanya: \"Apa yang BISA kami lakukan secara berbeda?\"",
    shiftNl: "Vervolgens vroegen we: \"Wat hadden WIJ anders kunnen doen?\"",
    afterEn: "We owned the communication gap and proposed weekly sync meetings. Next project: on time.",
    afterId: "Kami mengakui kesenjangan komunikasi dan mengusulkan pertemuan sinkron mingguan. Proyek berikutnya: tepat waktu.",
    afterNl: "We erkenden de communicatielacune en stelden wekelijkse synchronisatievergaderingen voor. Volgende project: op tijd.",
    resultEn: "Team learned to clarify scope upfront. Trust increased.",
    resultId: "Tim belajar memperjelas ruang lingkup di muka. Kepercayaan meningkat.",
    resultNl: "Team leerde om bereik vooraf te verduidelijken. Vertrouwen nam toe.",
  },
  {
    titleEn: "The Team Conflict",
    titleId: "Konflik Tim",
    titleNl: "Het Teamconflict",
    beforeEn: "\"Sarah keeps dismissing my ideas in meetings. I'm not going to contribute anymore.\"",
    beforeId: "\"Sarah terus menolak ide saya di pertemuan. Saya tidak akan berkontribusi lagi.\"",
    beforeNl: "\"Sarah blijft mijn ideeën in vergaderingen afwijzen. Ik ga niet meer bijdragen.\"",
    shiftEn: "Then we asked: \"What conversation do WE need to have?\"",
    shiftId: "Kemudian kami bertanya: \"Percakapan apa yang PERLU kami miliki?\"",
    shiftNl: "Vervolgens vroegen we: \"Welk gesprek moeten WIJ voeren?\"",
    afterEn: "We initiated a 1-on-1 with Sarah to understand her perspective. Turned out there was a misunderstanding.",
    afterId: "Kami memulai 1-on-1 dengan Sarah untuk memahami perspektifnya. Ternyata ada kesalahpahaman.",
    afterNl: "We initieerden een 1-op-1 met Sarah om haar perspectief te begrijpen. Bleek er een misverstand te zijn.",
    resultEn: "Relationship restored. Better collaboration. Team morale improved.",
    resultId: "Hubungan dipulihkan. Kolaborasi lebih baik. Moral tim meningkat.",
    resultNl: "Relatie hersteld. Betere samenwerking. Teammoraal verbeterd.",
  },
  {
    titleEn: "The Skill Gap",
    titleId: "Kesenjangan Keterampilan",
    titleNl: "De Vaardigheidskloof",
    beforeEn: "\"I don't have the training for this. I can't do it.\"",
    beforeId: "\"Saya tidak memiliki pelatihan untuk ini. Saya tidak bisa melakukannya.\"",
    beforeNl: "\"Ik heb geen training hiervoor. Ik kan het niet doen.\"",
    shiftEn: "Then we asked: \"What support do I need to learn this?\"",
    shiftId: "Kemudian kami bertanya: \"Dukungan apa yang saya butuhkan untuk mempelajari ini?\"",
    shiftNl: "Vervolgens vroegen we: \"Welke ondersteuning heb ik nodig om dit te leren?\"",
    afterEn: "We sought mentorship, took an online course, and practiced. Within 3 months: proficient.",
    afterId: "Kami mencari bimbingan, mengikuti kursus online, dan berlatih. Dalam 3 bulan: mahir.",
    afterNl: "We zochten mentorschap, volgden een online cursus en oefenden. Binnen 3 maanden: bedreven.",
    resultEn: "Expanded capability. Increased confidence. Career growth.",
    resultId: "Kemampuan diperluas. Kepercayaan diri meningkat. Pertumbuhan karir.",
    resultNl: "Uitgebreide mogelijkheden. Verhoogd vertrouwen. Carièregroei.",
  },
];

const ABOVE_PHRASES = ["When…", "Choice", "I am going to…", "I will", "I chose to", "I chose not to", "Make things happen", "Why not?", "TGIM (Thank God It's Monday)", "Day one"];
const ABOVE_PHRASES_ID = ["Ketika…", "Pilihan", "Saya akan…", "Saya mau", "Saya memilih untuk", "Saya memilih untuk tidak", "Jadikan hal itu terjadi", "Kenapa tidak?", "TGIM (Terima kasih Tuhan hari Senin)", "Hari pertama"];
const ABOVE_PHRASES_NL = ["Wanneer…", "Keuze", "Ik ga…", "Ik wil", "Ik koos voor", "Ik koos ervoor niet te", "Dingen laten gebeuren", "Waarom niet?", "TGIM (Dank God, het is maandag)", "Dag één"];

const BELOW_PHRASES = ["If…", "Had no choice", "I hope…", "Maybe…", "I try…", "It might…", "I think…", "I need to…", "Hopefully", "Every intention", "I should", "I would", "I could", "I must", "WHY?", "TGIF", "Waiting for other people", "One day"];
const BELOW_PHRASES_ID = ["Jika…", "Tidak punya pilihan", "Saya harap…", "Mungkin…", "Saya mencoba…", "Mungkin saja…", "Saya pikir…", "Saya perlu…", "Semoga", "Setiap niat", "Saya seharusnya", "Saya akan", "Saya bisa", "Saya harus", "KENAPA?", "TGIF", "Menunggu orang lain", "Suatu hari nanti"];
const BELOW_PHRASES_NL = ["Als…", "Had geen keuze", "Ik hoop…", "Misschien…", "Ik probeer…", "Het zou kunnen…", "Ik denk…", "Ik moet…", "Hopelijk", "Altijd de intentie", "Ik zou moeten", "Ik zou", "Ik kon", "Ik moet", "WAAROM?", "TGIF", "Wachten op anderen", "Op een dag"];

function getAbovePhrases(lang: Lang) {
  return lang === "en" ? ABOVE_PHRASES : lang === "id" ? ABOVE_PHRASES_ID : ABOVE_PHRASES_NL;
}
function getBelowPhrases(lang: Lang) {
  return lang === "en" ? BELOW_PHRASES : lang === "id" ? BELOW_PHRASES_ID : BELOW_PHRASES_NL;
}

export default function AboveBelowClient({
  userPathway,
  isSaved,
}: {
  userPathway: string | null;
  isSaved: boolean;
}) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(isSaved);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await saveResourceToDashboard("above-below-the-line");
      setSaved(true);
    });
  }

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: "oklch(97% 0.005 260)", minHeight: "100vh" }}>
      <LangToggle />

      {/* HERO */}
      <section style={{ background: "oklch(22% 0.10 260)", padding: "80px 24px 72px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", background: "oklch(65% 0.15 45 / 0.12)", padding: "4px 10px", borderRadius: 4 }}>Guide</span>
            
          </div>
          <p style={{ color: "oklch(65% 0.15 45)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {t("Team & Facilitation · Guide", "Tim & Fasilitasi · Panduan", "Team & Facilitatie · Gids", lang)}
          </p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 600, color: "oklch(96% 0.005 80)", margin: "0 0 20px", lineHeight: 1.1 }}>{t("Above & Below the Line", "Di Atas & Di Bawah Garis", "Boven & Onder de Lijn", lang)}</h1>
          <p style={{ fontSize: 17, color: "oklch(72% 0.05 260)", lineHeight: 1.7, maxWidth: 620, marginBottom: 40 }}>{t(
            "Are you leading as a Victor or a Victim? This framework helps you recognize reactive patterns — blame, excuse, denial — and choose ownership, accountability, and responsibility instead.",
            "Apakah Anda memimpin sebagai Victor atau Korban? Kerangka ini membantu Anda mengenali pola reaktif — menyalahkan, mencari alasan, penyangkalan — dan memilih kepemilikan, tanggung gugat, dan tanggung jawab.",
            "Leidt u als Overwinnaar of als Slachtoffer? Dit kader helpt u reactieve patronen te herkennen — beschuldiging, excuus, ontkenning — en te kiezen voor eigenaarschap, aanspreekbaarheid en verantwoordelijkheid.",
            lang
          )}</p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {!saved ? (
              <button onClick={handleSave} disabled={isPending} style={{ background: "transparent", color: "oklch(85% 0.04 260)", padding: "13px 28px", borderRadius: 6, fontWeight: 600, fontSize: 14, border: "1px solid oklch(42% 0.08 260)", cursor: "pointer" }}>{isPending ? t("Saving…", "Menyimpan…", "Opslaan…", lang) : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard", lang)}</button>
            ) : (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "oklch(65% 0.15 145)", fontSize: 14, fontWeight: 600, padding: "13px 0" }}>✓ {t("Saved to Dashboard", "Tersimpan di Dashboard", "Opgeslagen in Dashboard", lang)}</span>
            )}
          </div>
        </div>
      </section>

      {/* MAIN FRAMEWORK — SIDE-BY-SIDE */}
      <section style={{ background: "oklch(94% 0.008 260)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>{t("The Line", "Garis Tersebut", "De Lijn", lang)}</h2>
          <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", marginBottom: 40, lineHeight: 1.65 }}>{t(
            "There is a line. Every response you give to a situation is either above it or below it.",
            "Ada sebuah garis. Setiap respons yang Anda berikan terhadap suatu situasi berada di atas atau di bawahnya.",
            "Er is een lijn. Elke reactie die u geeft op een situatie bevindt zich er boven of eronder.",
            lang
          )}</p>

          {/* Side-by-side comparison */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr", gap: 32 }}>
            {/* ABOVE THE LINE */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "oklch(46% 0.16 145)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 18 }}>↑</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(46% 0.16 145)" }}>{t("ABOVE THE LINE", "DI ATAS GARIS", "BOVEN DE LIJN", lang)}</div>
                  <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 600, color: "oklch(30% 0.10 145)" }}>{t("Pro-Active Mindset", "Mentalitas Pro-Aktif", "Pro-Actieve Mentaliteit", lang)}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {FRAMEWORK.filter(f => f.position === "above").map(item => (
                  <div key={item.title} style={{ background: "white", borderRadius: 8, padding: "20px", boxShadow: "0 1px 4px oklch(20% 0.06 260 / 0.08)" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "oklch(46% 0.16 145)", letterSpacing: "0.04em", marginBottom: 6 }}>{t(item.title, item.titleId, item.titleNl, lang)}</div>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: "oklch(35% 0.06 260)", margin: 0 }}>{t(item.descEn, item.descId, item.descNl, lang)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* DIVIDER */}
            <div style={{ background: "linear-gradient(to bottom, oklch(22% 0.10 260) 0%, oklch(65% 0.15 45) 50%, oklch(22% 0.10 260) 100%)" }} />

            {/* BELOW THE LINE */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "oklch(48% 0.18 25)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 18 }}>↓</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(48% 0.18 25)" }}>{t("BELOW THE LINE", "DI BAWAH GARIS", "ONDER DE LIJN", lang)}</div>
                  <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 600, color: "oklch(30% 0.12 25)" }}>{t("Reactive Patterns", "Pola Reaktif", "Reactieve Patronen", lang)}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {FRAMEWORK.filter(f => f.position === "below").map(item => (
                  <div key={item.title} style={{ background: "white", borderRadius: 8, padding: "20px", boxShadow: "0 1px 4px oklch(20% 0.06 260 / 0.08)" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "oklch(48% 0.18 25)", letterSpacing: "0.04em", marginBottom: 6 }}>{t(item.title, item.titleId, item.titleNl, lang)}</div>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: "oklch(35% 0.06 260)", margin: 0 }}>{t(item.descEn, item.descId, item.descNl, lang)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STORIES SECTION */}
      <section style={{ padding: "72px 24px", background: "white" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>{t("Real Stories", "Kisah Nyata", "Echte Verhalen", lang)}</h2>
          <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", marginBottom: 40, lineHeight: 1.65 }}>{t(
            "How the shift from below the line to above makes a real difference in teams and leaders.",
            "Bagaimana pergeseran dari bawah garis ke atas membuat perbedaan nyata dalam tim dan pemimpin.",
            "Hoe de verschuiving van onder de lijn naar boven een echt verschil maakt in teams en leiders.",
            lang
          )}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28 }}>
            {STORIES.map((story, i) => (
              <div key={i} style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 12px oklch(20% 0.06 260 / 0.10)" }}>
                {/* Header */}
                <div style={{ background: "oklch(42% 0.14 260)", color: "white", padding: "24px" }}>
                  <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 600, margin: 0 }}>{t(story.titleEn, story.titleId, story.titleNl, lang)}</div>
                </div>
                {/* Content */}
                <div style={{ background: "white", padding: "28px" }}>
                  {/* Before */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(48% 0.18 25)", marginBottom: 8 }}>📍 {t("Before", "Sebelum", "Voor", lang)}</div>
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: "oklch(35% 0.06 260)", fontStyle: "italic", margin: 0 }}>{t(story.beforeEn, story.beforeId, story.beforeNl, lang)}</p>
                  </div>
                  {/* Shift */}
                  <div style={{ marginBottom: 24, paddingLeft: 16, borderLeft: "3px solid oklch(65% 0.15 45)" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: 8 }}>✨ {t("The Shift", "Peralihan", "De Verschuiving", lang)}</div>
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: "oklch(35% 0.06 260)", margin: 0 }}>{t(story.shiftEn, story.shiftId, story.shiftNl, lang)}</p>
                  </div>
                  {/* After */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(46% 0.16 145)", marginBottom: 8 }}>🎯 {t("After", "Sesudah", "Na", lang)}</div>
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: "oklch(35% 0.06 260)", margin: 0 }}>{t(story.afterEn, story.afterId, story.afterNl, lang)}</p>
                  </div>
                  {/* Result */}
                  <div style={{ paddingTop: 16, borderTop: "1px solid oklch(88% 0.008 260)" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(42% 0.14 260)", marginBottom: 8 }}>✓ {t("Outcome", "Hasil", "Uitkomst", lang)}</div>
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: "oklch(30% 0.06 260)", fontWeight: 600, margin: 0 }}>{t(story.resultEn, story.resultId, story.resultNl, lang)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REFLECTION */}
      <section style={{ padding: "72px 24px", background: "oklch(94% 0.008 260)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>{t("Reflection Questions", "Pertanyaan Refleksi", "Reflectievragen", lang)}</h2>
          <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", marginBottom: 40, lineHeight: 1.65 }}>{t(
            "Use these to process your own leadership patterns — alone or with a coach.",
            "Gunakan ini untuk memproses pola kepemimpinan Anda sendiri — sendiri atau bersama pelatih.",
            "Gebruik deze vragen om uw eigen leiderschapspatronen te verwerken — alleen of met een coach.",
            lang
          )}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {[
              {
                color: "oklch(46% 0.16 145)",
                qEn: "Think of a recent situation. What was your first instinct — Victor or Victim? What drove that response?",
                qId: "Pikirkan situasi terkini. Apa naluri pertama Anda — Victor atau Korban? Apa yang mendorong respons itu?",
                qNl: "Denk aan een recente situatie. Wat was uw eerste instinct — Overwinnaar of Slachtoffer? Wat dreef die reactie?",
              },
              {
                color: "oklch(42% 0.14 260)",
                qEn: "Where in your leadership do you notice below-the-line patterns most often? What triggers them?",
                qId: "Di mana dalam kepemimpinan Anda Anda paling sering memperhatikan pola di bawah garis? Apa yang memicunya?",
                qNl: "Waar in uw leiderschap ziet u het vaakst onder-de-lijn-patronen? Wat triggert die?",
              },
              {
                color: "oklch(48% 0.18 25)",
                qEn: "What would it look like to choose ownership in the situation you're currently facing? What one above-the-line action could you take today?",
                qId: "Seperti apa memilih kepemilikan dalam situasi yang Anda hadapi saat ini? Satu tindakan di atas garis apa yang bisa Anda ambil hari ini?",
                qNl: "Hoe zou eigenaarschap kiezen eruitzien in de situatie waarmee u nu te maken heeft? Welke ene boven-de-lijn-actie kunt u vandaag ondernemen?",
              },
            ].map((q, i) => (
              <div key={i} style={{ background: "white", borderRadius: 10, padding: "28px", boxShadow: "0 1px 8px oklch(20% 0.06 260 / 0.07)" }}>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 40, fontWeight: 600, color: q.color, display: "block", marginBottom: 12, lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</span>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "oklch(30% 0.06 260)", margin: 0, fontStyle: "italic" }}>"{t(q.qEn, q.qId, q.qNl, lang)}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "oklch(22% 0.10 260)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(96% 0.005 80)", margin: "0 0 20px" }}>{t("Choose to Lead Above the Line", "Pilih untuk Memimpin Di Atas Garis", "Kies om Boven de Lijn te Leiden", lang)}</h2>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/resources" style={{ display: "inline-block", background: "transparent", color: "oklch(85% 0.04 260)", padding: "14px 32px", borderRadius: 6, fontWeight: 600, fontSize: 14, border: "1px solid oklch(42% 0.08 260)", textDecoration: "none" }}>{t("← Content Library", "← Perpustakaan Konten", "← Contentbibliotheek", lang)}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
