"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id" | "nl";

const t = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const REASONS = [
  {
    num: "01",
    titleEn: "Expanding Vision",
    titleId: "Memperluas Visi",
    titleNl: "Visie Verbreden",
    descEn: "Reading exposes leaders to diverse ideas, cultures, and perspectives. By engaging with literature, biographies, and thought-provoking articles, leaders cultivate a broader worldview — enabling them to see trends, understand complex issues, and craft solutions for immediate challenges.",
    descId: "Membaca mengekspos pemimpin pada beragam ide, budaya, dan perspektif. Dengan terlibat dalam literatur, biografi, dan artikel yang memancing pemikiran, pemimpin mengembangkan pandangan dunia yang lebih luas — memungkinkan mereka melihat tren, memahami isu kompleks, dan merancang solusi untuk tantangan saat ini.",
    descNl: "Lezen stelt leiders bloot aan diverse ideeën, culturen en perspectieven. Door boeken, biografieën en prikkelende artikelen te lezen, ontwikkelen leiders een bredere kijk op de wereld — waardoor ze trends kunnen zien, complexe vraagstukken kunnen begrijpen en oplossingen kunnen bedenken voor directe uitdagingen.",
  },
  {
    num: "02",
    titleEn: "Refining Critical Thinking",
    titleId: "Mengasah Pemikiran Kritis",
    titleNl: "Kritisch Denken Verfijnen",
    descEn: "Books challenge assumptions and encourage reflection. Leaders who read regularly develop sharper analytical skills, enabling them to evaluate options, make informed decisions, and navigate uncertainty with confidence.",
    descId: "Buku-buku menantang asumsi dan mendorong refleksi. Pemimpin yang rajin membaca mengembangkan keterampilan analitis yang lebih tajam, memungkinkan mereka mengevaluasi pilihan, mengambil keputusan berdasarkan informasi, dan menavigasi ketidakpastian dengan percaya diri.",
    descNl: "Boeken stellen aannames ter discussie en moedigen reflectie aan. Leiders die regelmatig lezen ontwikkelen scherpere analytische vaardigheden, waardoor ze opties kunnen beoordelen, weloverwogen beslissingen kunnen nemen en onzekerheid met vertrouwen kunnen navigeren.",
  },
  {
    num: "03",
    titleEn: "Building Emotional Intelligence",
    titleId: "Membangun Kecerdasan Emosional",
    titleNl: "Emotionele Intelligentie Ontwikkelen",
    descEn: "Empathy and emotional intelligence are key leadership traits. Books can enhance these qualities by offering insights into human behavior, relationships, and effective communication — enabling leaders to connect deeply with their teams and communities.",
    descId: "Empati dan kecerdasan emosional adalah sifat kepemimpinan yang utama. Buku dapat meningkatkan kualitas-kualitas ini dengan memberikan wawasan tentang perilaku manusia, hubungan, dan komunikasi efektif — memungkinkan pemimpin terhubung secara mendalam dengan tim dan komunitas mereka.",
    descNl: "Empathie en emotionele intelligentie zijn sleuteleigenschappen van leiderschap. Boeken kunnen deze kwaliteiten versterken door inzicht te bieden in menselijk gedrag, relaties en effectieve communicatie — waardoor leiders diep verbinding kunnen maken met hun teams en gemeenschappen.",
  },
  {
    num: "04",
    titleEn: "Staying Relevant",
    titleId: "Tetap Relevan",
    titleNl: "Relevant Blijven",
    descEn: "Reading helps leaders remain informed about innovations and disruptions. By engaging with research, industry reports, and case studies, leaders stay ahead of the curve and are better equipped to navigate challenges, seize opportunities, and guide their teams through transitions.",
    descId: "Membaca membantu pemimpin tetap terinformasi tentang inovasi dan gangguan. Dengan terlibat dalam penelitian, laporan industri, dan studi kasus, pemimpin tetap berada di garis terdepan dan lebih siap untuk menghadapi tantangan, memanfaatkan peluang, dan memandu tim mereka melalui transisi.",
    descNl: "Lezen helpt leiders op de hoogte te blijven van innovaties en verstoringen. Door onderzoek, brancherapporten en casestudies te lezen, blijven leiders voorop lopen en zijn ze beter uitgerust om uitdagingen het hoofd te bieden, kansen te grijpen en hun teams door transities te begeleiden.",
  },
];

const HABITS = [
  {
    num: "01",
    titleEn: "Set Clear Goals",
    titleId: "Tetapkan Tujuan yang Jelas",
    titleNl: "Stel Duidelijke Doelen",
    descEn: "Decide on a realistic reading target, such as one book per month or 15 minutes daily. Track your progress to stay motivated.",
    descId: "Tentukan target membaca yang realistis, seperti satu buku per bulan atau 15 menit setiap hari. Lacak kemajuanmu untuk tetap termotivasi.",
    descNl: "Bepaal een realistisch leesdoel, zoals één boek per maand of 15 minuten per dag. Houd je voortgang bij om gemotiveerd te blijven.",
  },
  {
    num: "02",
    titleEn: "Dedicate Time for Reading",
    titleId: "Sisihkan Waktu untuk Membaca",
    titleNl: "Reserveer Tijd voor Lezen",
    descEn: "Set aside a specific time each day or week for reading and block this time in your schedule. Treat it like any other important meeting or task to ensure consistency.",
    descId: "Sisihkan waktu khusus setiap hari atau minggu untuk membaca dan blokir waktu ini dalam jadwalmu. Perlakukan seperti rapat atau tugas penting lainnya untuk memastikan konsistensi.",
    descNl: "Zet elke dag of week een specifieke leestijd opzij en blokkeer deze tijd in je agenda. Behandel het als elke andere belangrijke vergadering of taak om consistentie te waarborgen.",
  },
  {
    num: "03",
    titleEn: "Create a Reading Culture",
    titleId: "Ciptakan Budaya Membaca",
    titleNl: "Creëer een Leescultuur",
    descEn: "Encourage your team to read and discuss insights from books. Learning together not only encourages others to read but also brings great accountability.",
    descId: "Dorong timmu untuk membaca dan mendiskusikan wawasan dari buku. Belajar bersama tidak hanya mendorong orang lain untuk membaca tetapi juga memberikan akuntabilitas yang baik.",
    descNl: "Moedig je team aan om te lezen en inzichten uit boeken te bespreken. Samen leren moedigt anderen aan om te lezen en zorgt ook voor goede verantwoording.",
  },
  {
    num: "04",
    titleEn: "Prioritize Quality Over Quantity",
    titleId: "Prioritaskan Kualitas daripada Kuantitas",
    titleNl: "Prioriteer Kwaliteit boven Kwantiteit",
    descEn: "Focus on books that align with your leadership goals and interests. A few deeply impactful reads are more valuable than skimming many shallow ones. You don't need to read every book cover to cover — review the index or table of contents and select sections most relevant to you.",
    descId: "Fokus pada buku-buku yang selaras dengan tujuan kepemimpinan dan minatmu. Beberapa bacaan yang sangat berdampak lebih berharga daripada membaca banyak buku secara dangkal. Kamu tidak perlu membaca setiap buku dari awal hingga akhir — tinjau indeks atau daftar isi dan pilih bagian yang paling relevan untukmu.",
    descNl: "Focus op boeken die aansluiten bij je leidersdoelen en interesses. Een paar diep indrukwekkende lezingen zijn waardevoller dan veel oppervlakkige. Je hoeft niet elk boek van voor tot achter te lezen — bekijk de index of inhoudsopgave en selecteer de secties die het meest relevant voor je zijn.",
  },
];

const QUOTES = [
  { text: "The book you don't read won't help.", author: "Jim Rohn" },
  { text: "Not all readers are leaders, but all leaders are readers.", author: "Harry S. Truman" },
  { text: "Reading is the gateway skill that makes all other learning possible.", author: "Barack Obama" },
  { text: "Leaders are those who can learn and adapt quickly.", author: "Tony Robbins" },
];

export default function LeadersReadersClient({
  userPathway,
  isSaved: isSavedProp,
}: {
  userPathway: string | null;
  isSaved: boolean;
}) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(isSavedProp);
  const [isPending, startTransition] = useTransition();
  const showAddToDashboard = userPathway !== null;

  function handleSave() {
    startTransition(async () => {
      const result = await saveResourceToDashboard("leaders-are-readers");
      if (!result.error) setSaved(true);
    });
  }

  return (
    <>
      <LangToggle />
      {/* ── HERO ── */}
      <section style={{
        background: "oklch(22% 0.10 260)",
        paddingTop: "clamp(2.5rem, 4vw, 4rem)",
        paddingBottom: "clamp(2.5rem, 4vw, 4rem)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
        <div className="container-wide" style={{ position: "relative" }}>
          <Link href="/resources" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(62% 0.04 260)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem", marginBottom: "1.5rem" }}>
            ← Content Library
          </Link>


          <span className="pathway-badge" style={{ background: "oklch(65% 0.15 45 / 0.15)", color: "oklch(82% 0.08 60)", marginBottom: "1.25rem", display: "inline-flex" }}>
            {t("Personal Growth", "Pertumbuhan Pribadi", "Persoonlijke Groei", lang)}
          </span>

          <p style={{ color: "oklch(65% 0.15 45)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {t("Personal Development · Guide", "Pengembangan Pribadi · Panduan", "Persoonlijke Ontwikkeling · Gids", lang)}
          </p>
          <h1 className="t-hero" style={{ color: "oklch(97% 0.005 80)", marginBottom: "1rem", maxWidth: "14ch" }}>
            {lang === "en"
              ? <>{`Leaders are`}<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Readers.</span></>
              : lang === "id"
              ? <>{`Pemimpin adalah`}<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Pembaca.</span></>
              : <>{`Leiders zijn`}<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Lezers.</span></>}
          </h1>
          <p className="t-tagline" style={{ color: "oklch(72% 0.04 260)", maxWidth: "52ch", marginBottom: "2rem" }}>
            {t(
              "Great leaders commit to continuous learning. In a rapidly changing world, the ability to adapt, innovate, and inspire is rooted in knowledge and understanding.",
              "Pemimpin yang baik berkomitmen pada pembelajaran yang berkelanjutan. Dalam dunia yang berubah dengan cepat, kemampuan untuk beradaptasi, berinovasi, dan menginspirasi berakar pada pengetahuan dan pemahaman.",
              "Grote leiders zetten zich in voor voortdurend leren. In een snel veranderende wereld is het vermogen om je aan te passen, te innoveren en te inspireren geworteld in kennis en begrip.",
              lang
            )}
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            {showAddToDashboard && (
              saved ? (
                <Link href="/dashboard" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", color: "oklch(72% 0.14 145)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
                  ✓ {t("In your dashboard", "Di dashboard Anda", "In uw dashboard", lang)}
                </Link>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={isPending}
                  style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", color: "oklch(97% 0.005 80)", background: isPending ? "oklch(40% 0.10 260)" : "oklch(30% 0.12 260)", border: "none", padding: "0.625rem 1.25rem", cursor: isPending ? "wait" : "pointer", transition: "background 0.15s" }}
                >
                  {isPending
                    ? t("Saving…", "Menyimpan…", "Opslaan…", lang)
                    : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard", lang)}
                </button>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── WHY READING MATTERS ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>
            {t("Why It Matters", "Mengapa Ini Penting", "Waarom Het Belangrijk Is", lang)}
          </p>
          <h2 className="t-section" style={{ marginBottom: "0.75rem" }}>
            {lang === "en"
              ? <>Why reading matters<br />for leaders.</>
              : lang === "id"
              ? <>Mengapa membaca penting<br />bagi pemimpin.</>
              : <>Waarom lezen belangrijk is<br />voor leiders.</>}
          </h2>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: "oklch(52% 0.008 260)", marginBottom: "3rem", maxWidth: "52ch" }}>
            {t(
              "Reading provides leaders with the tools to refine their skills, broaden their perspectives, and stay ahead of challenges.",
              "Membaca memberikan pemimpin alat-alat untuk mengasah keterampilan, memperluas perspektif, dan tetap unggul menghadapi tantangan.",
              "Lezen biedt leiders de tools om hun vaardigheden te verfijnen, hun perspectief te verbreden en uitdagingen voor te blijven.",
              lang
            )}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(88% 0.008 80)" }}>
            {REASONS.map((r) => (
              <div key={r.num} style={{ background: "white", padding: "2rem 2.5rem", display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.65rem", color: "oklch(65% 0.15 45)", letterSpacing: "0.08em", flexShrink: 0, paddingTop: "0.15rem" }}>{r.num}</span>
                <div>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "oklch(22% 0.005 260)", marginBottom: "0.5rem" }}>
                    {t(r.titleEn, r.titleId, r.titleNl, lang)}
                  </p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.75, color: "oklch(42% 0.008 260)", maxWidth: "70ch" }}>
                    {t(r.descEn, r.descId, r.descNl, lang)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HABITS ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(22% 0.10 260)" }}>
        <div className="container-wide">
          <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>
            {t("Building the Habit", "Membangun Kebiasaan", "Een Gewoonte Opbouwen", lang)}
          </p>
          <h2 className="t-section" style={{ color: "oklch(97% 0.005 80)", marginBottom: "0.75rem" }}>
            {lang === "en"
              ? <>How to make reading<br />a habit.</>
              : lang === "id"
              ? <>Cara menjadikan membaca<br />sebuah kebiasaan.</>
              : <>Hoe van lezen<br />een gewoonte te maken.</>}
          </h2>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: "oklch(65% 0.04 260)", marginBottom: "3rem", maxWidth: "52ch" }}>
            {t(
              "Habits shape our lives. Setting aside 15 minutes daily for reading can become a cornerstone habit that feeds your mind and spirit. Over time, this simple routine compounds into significant personal and professional development.",
              "Kebiasaan membentuk hidup kita. Menyisihkan 15 menit sehari untuk membaca bisa menjadi kebiasaan dasar yang memberi makanan bagi pikiran dan rohanimu. Seiring waktu, rutinitas sederhana ini berkembang menjadi pengembangan pribadi dan profesional yang signifikan.",
              "Gewoonten vormen ons leven. Dagelijks 15 minuten lezen kan een hoeksteengewoonte worden die je geest en geest voedt. Na verloop van tijd zet deze eenvoudige routine zich om in aanzienlijke persoonlijke en professionele ontwikkeling.",
              lang
            )}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", background: "oklch(42% 0.008 260 / 0.3)" }}>
            {HABITS.map((h) => (
              <div key={h.num} style={{ background: "oklch(28% 0.10 260)", padding: "1.75rem 2rem" }}>
                <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.65rem", color: "oklch(65% 0.15 45)", letterSpacing: "0.08em", display: "block", marginBottom: "0.75rem" }}>{h.num}</span>
                <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9375rem", color: "oklch(97% 0.005 80)", marginBottom: "0.625rem" }}>
                  {t(h.titleEn, h.titleId, h.titleNl, lang)}
                </p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.7, color: "oklch(65% 0.04 260)" }}>
                  {t(h.descEn, h.descId, h.descNl, lang)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTES ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "2rem" }}>
            {t("From Those Who Led", "Dari Mereka yang Pernah Memimpin", "Van Hen Die Leidden", lang)}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", background: "oklch(88% 0.008 80)" }}>
            {QUOTES.map((q) => (
              <div key={q.author} style={{ background: "white", padding: "2rem 2.5rem" }}>
                <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.125rem", fontStyle: "italic", color: "oklch(32% 0.008 260)", lineHeight: 1.55, marginBottom: "1rem" }}>
                  &ldquo;{q.text}&rdquo;
                </p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", color: "oklch(65% 0.15 45)", textTransform: "uppercase" }}>
                  — {q.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem", alignItems: "center" }}>
          <div>
            <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>
              {t("More in the Library", "Lebih Banyak di Perpustakaan", "Meer in de Bibliotheek", lang)}
            </p>
            <h2 className="t-section" style={{ marginBottom: "1rem" }}>
              {lang === "en"
                ? <>Part of the full<br />content library.</>
                : lang === "id"
                ? <>Bagian dari perpustakaan<br />konten lengkap.</>
                : <>Onderdeel van de volledige<br />contentbibliotheek.</>}
            </h2>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(42% 0.008 260)", marginBottom: "2rem", maxWidth: "48ch" }}>
              {t(
                "Leaders are Readers is one of many resources in the Crispy Development library — tools, frameworks, and reflections built for cross-cultural leaders.",
                "Pemimpin adalah Pembaca adalah salah satu dari banyak sumber daya dalam perpustakaan Crispy Development — alat, kerangka kerja, dan refleksi yang dibangun untuk pemimpin lintas budaya.",
                "Leiders zijn Lezers is een van de vele bronnen in de Crispy Development bibliotheek — tools, kaders en reflecties gebouwd voor interculturele leiders.",
                lang
              )}
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {!showAddToDashboard ? (
                <Link href="/signup" className="btn-primary">{t("Join the Community →", "Bergabung →", "Word lid →", lang)}</Link>
              ) : saved ? (
                <Link href="/dashboard" className="btn-primary">{t("Go to Dashboard →", "Ke Dashboard →", "Naar Dashboard →", lang)}</Link>
              ) : (
                <button onClick={handleSave} disabled={isPending} className="btn-primary" style={{ border: "none", cursor: isPending ? "wait" : "pointer" }}>
                  {isPending
                    ? t("Saving…", "Menyimpan…", "Opslaan…", lang)
                    : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard", lang)}
                </button>
              )}
              <Link href="/resources" className="btn-outline-navy">{t("Browse the Library", "Jelajahi Perpustakaan", "Verken de Bibliotheek", lang)}</Link>
            </div>
          </div>
          <div>
            <div style={{ background: "oklch(22% 0.10 260)", padding: "2.5rem" }}>
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.375rem", fontStyle: "italic", color: "oklch(78% 0.04 260)", lineHeight: 1.5, marginBottom: "1.25rem" }}>
                {t(
                  "\"Not all readers are leaders, but all leaders are readers.\"",
                  "\"Tidak semua pembaca adalah pemimpin, tetapi semua pemimpin adalah pembaca.\"",
                  "\"Niet alle lezers zijn leiders, maar alle leiders zijn lezers.\"",
                  lang
                )}
              </p>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "oklch(65% 0.15 45)" }} />
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", color: "oklch(65% 0.15 45)", textTransform: "uppercase" }}>Harry S. Truman</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
