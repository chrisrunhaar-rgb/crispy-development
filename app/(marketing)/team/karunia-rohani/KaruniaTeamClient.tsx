"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { saveKaruniaTeamResult } from "./actions";

// ── CONSTANTS ─────────────────────────────────────────────────────────────────

const PRIMARY = "oklch(65% 0.15 45)";
const BG_DARK = "oklch(22% 0.10 260)";
const BG_LIGHT = "oklch(97% 0.005 80)";
const BORDER = "oklch(88% 0.008 80)";

// ── QUIZ DATA (same as personal version) ─────────────────────────────────────

const KARUNIA_MAP: Record<string, number[]> = {
  melayani:          [1, 20, 39, 58],
  murah_hati:        [2, 21, 40, 59],
  keramahan:         [3, 22, 41, 60],
  bahasa_roh:        [4, 23, 42, 61],
  menyembuhkan:      [5, 24, 43, 62],
  menguatkan:        [6, 25, 44, 63],
  memberi:           [7, 26, 45, 64],
  hikmat:            [8, 27, 46, 65],
  pengetahuan:       [9, 28, 47, 66],
  iman:              [10, 29, 48, 67],
  kerasulan:         [11, 30, 49, 68],
  penginjilan:       [12, 31, 50, 69],
  bernubuat:         [13, 32, 51, 70],
  mengajar:          [14, 33, 52, 71],
  gembala:           [15, 34, 53, 72],
  memimpin:          [16, 35, 54, 73],
  administrasi:      [17, 36, 55, 74],
  mukjizat:          [18, 37, 56, 75],
  tafsir_bahasa_roh: [19, 38, 57, 76],
};

const GIFTS: Record<string, { label: string; desc: string }> = {
  melayani:          { label: "Melayani",           desc: "Kamu memiliki kemampuan untuk melihat dan memenuhi kebutuhan praktis orang lain dengan sukacita." },
  murah_hati:        { label: "Murah Hati",          desc: "Kamu peka terhadap penderitaan orang lain dan dipanggil untuk hadir bersama mereka dalam kesulitan." },
  keramahan:         { label: "Keramahan",           desc: "Kamu memiliki kemampuan untuk membuat orang merasa disambut, aman, dan diperhatikan." },
  bahasa_roh:        { label: "Bahasa Roh",          desc: "Kamu telah menerima karunia untuk berkomunikasi dalam bahasa rohani yang belum pernah dipelajari." },
  menyembuhkan:      { label: "Menyembuhkan",        desc: "Allah memakai doa-doamu sebagai sarana untuk kesembuhan fisik, emosi, atau rohani bagi orang lain." },
  menguatkan:        { label: "Menguatkan",          desc: "Kamu mampu mendorong, menguatkan, dan membimbing orang lain untuk bertumbuh dan tidak menyerah." },
  memberi:           { label: "Memberi",             desc: "Kamu dengan senang hati dan sukarela menggunakan sumber daya yang kamu miliki untuk kebutuhan pelayanan." },
  hikmat:            { label: "Hikmat",              desc: "Kamu mampu melihat situasi dengan sudut pandang Allah dan memberikan arah yang bijak kepada orang lain." },
  pengetahuan:       { label: "Pengetahuan",         desc: "Kamu menerima pemahaman supranatural tentang firman Allah atau situasi tertentu yang relevan bagi pelayanan." },
  iman:              { label: "Iman",                desc: "Kamu memiliki keyakinan yang kuat bahwa Allah akan bekerja bahkan dalam situasi yang tampaknya mustahil." },
  kerasulan:         { label: "Kerasulan",           desc: "Kamu dipanggil untuk merintis dan mengembangkan pelayanan di wilayah atau konteks budaya yang baru." },
  penginjilan:       { label: "Penginjilan",         desc: "Kamu memiliki kerinduan yang mendalam dan kemampuan untuk membagikan Injil kepada orang yang belum percaya." },
  bernubuat:         { label: "Bernubuat",           desc: "Kamu menerima dan menyampaikan pesan dari Allah yang menguatkan, mengingatkan, atau menantang jemaat." },
  mengajar:          { label: "Mengajar",            desc: "Kamu mampu menjelaskan kebenaran Alkitab dengan cara yang jelas, menarik, dan mudah dipahami orang lain." },
  gembala:           { label: "Gembala",             desc: "Kamu dipanggil untuk memelihara, membimbing, dan bertanggung jawab atas pertumbuhan rohani sekelompok orang." },
  memimpin:          { label: "Memimpin",            desc: "Kamu mampu menggerakkan, menginspirasi, dan membawa orang lain bersama-sama menuju tujuan yang Allah tetapkan." },
  administrasi:      { label: "Administrasi",        desc: "Kamu mampu merencanakan, mengorganisasi, dan mengkoordinasikan sumber daya untuk mencapai tujuan pelayanan." },
  mukjizat:          { label: "Mukjizat",            desc: "Allah menyatakan kuasa-Nya melalui hidupmu dalam cara-cara yang melampaui penjelasan manusia." },
  tafsir_bahasa_roh: { label: "Tafsir Bahasa Roh",  desc: "Kamu menerima kemampuan untuk menyampaikan makna dari pesan bahasa roh kepada jemaat." },
};

const QUESTIONS: string[] = [
  "Aku bisa digambarkan sebagai orang yang berbelas kasih pada orang lain.",
  "Aku sering menemukan diri berkomunikasi dengan orang yang paling sulit di dalam kelompokku.",
  "Aku selalu mengundang orang-orang ke rumahku.",
  "Aku percaya bahwa aku mempunyai kemampuan supranatural dalam berdoa.",
  "Aku pernah berdoa memohon kesembuhan seseorang, dan orang itu menjadi sembuh.",
  "Aku senang mendorong orang-orang yang putus asa agar mereka bisa melihat betapa Allah mengasihi mereka.",
  "Aku merasa terpanggil untuk memberikan sebagian besar yang kumiliki demi kebutuhan pelayanan.",
  "Aku punya kemampuan untuk melihat situasi-situasi sulit dengan sudut pandang Allah.",
  "Aku dapat mendengar firman Tuhan secara langsung yang bisa diterapkan pada situasi-situasi tertentu.",
  "Aku percaya bahwa hal-hal mustahil menjadi mungkin karena iman.",
  "Aku membaktikan diri untuk memimpin pertumbuhan pelayanan dalam komunitas yang berbeda-beda atau negara lain.",
  "Aku merasakan kerinduan untuk memberitakan Injil kepada mereka yang belum mengenal Kristus.",
  "Aku mendapat kesan-kesan dari Tuhan tentang situasi-situasi yang terjadi dalam kehidupan orang lain.",
  "Aku senang mempersiapkan dan menyampaikan pesan-pesan Alkitab.",
  "Aku merasa bertanggung jawab dan peduli terhadap pertumbuhan spiritual orang lain.",
  "Aku suka mengambil tanggung jawab dan memimpin orang-orang supaya tujuan yang ditetapkan oleh Allah bisa tercapai.",
  "Aku lebih suka merencanakan, mengorganisasi dan menargetkan sesuatu sebelum memulai sebuah proyek.",
  "Aku percaya Allah bermaksud untuk memakaiku untuk melakukan mukjizat.",
  "Aku merasa bahwa Allah telah menunjukku untuk menafsirkan pesan-pesan yang disampaikan dalam Bahasa Roh.",
  "Aku melayani orang lain melalui perbuatan-perbuatan yang sederhana dan praktis.",
  "Aku merasakan kebutuhan untuk memperhatikan orang-orang yang sakit dan yang terluka secara emosi.",
  "Aku merasa tidak nyaman ketika orang asing atau pendatang baru tidak mendapatkan sambutan yang baik.",
  "Aku percaya Allah memakaiku untuk berbicara dalam Bahasa Roh.",
  "Aku memiliki kerinduan yang mendalam untuk mendoakan orang-orang yang sakit agar mereka menjadi sembuh.",
  "Aku merasa terdorong untuk memberikan semangat kepada mereka yang kecil hati.",
  "Aku sering memberikan lebih dari persepuluhan dalam pengeluaran anggaranku.",
  "Orang sering meminta nasihatku ketika mereka menghadapi keputusan-keputusan penting.",
  "Aku percaya Tuhan memberiku pengetahuan secara supranatural tentang seseorang atau situasi tertentu.",
  "Aku percaya kepada Allah karena sering mengalami kejadian-kejadian supranatural.",
  "Aku merasa nyaman saat berada di antara orang-orang yang berbeda ras, bahasa, dan budaya.",
  "Aku sering memikirkan cara-cara kreatif untuk menceritakan tentang Yesus kepada orang yang tidak percaya.",
  "Aku percaya Allah kadang-kadang memakaiku untuk menyampaikan pesan-pesan profetis bagi komunitasku.",
  "Aku suka menjelaskan kebenaran-kebenaran alkitabiah dengan cara yang mudah dimengerti orang lain.",
  "Aku senang membimbing dan memelihara sekelompok orang dalam perjalanan iman mereka.",
  "Aku bisa menetapkan tujuan dan merencanakan cara paling efektif untuk mencapainya.",
  "Aku senang mengatur detail-detail proyek agar berjalan dengan lancar dan efisien.",
  "Aku telah menyaksikan kekuatan Allah yang ajaib dalam kehidupan seseorang sebagai jawaban atas doaku.",
  "Aku pernah menafsirkan pesan bahasa roh dalam sebuah pertemuan ibadah.",
  "Aku merasa terpanggil untuk membantu orang lain dalam pekerjaan dan kebutuhan mereka sehari-hari.",
  "Aku biasanya meluangkan waktu untuk menunjukkan kepedulian kepada orang yang sedang berduka.",
  "Aku senang membuat orang lain merasa nyaman dan diterima di rumahku atau di lingkunganku.",
  "Aku pernah berbicara dalam bahasa yang tidak kupelajari ketika sedang berdoa atau beribadah.",
  "Aku percaya Allah bermaksud untuk menggunakan doa-doaku untuk menyembuhkan orang yang sakit.",
  "Aku senang menolong orang melihat kebaikan Allah dalam situasi sulit yang mereka hadapi.",
  "Aku dengan senang hati memberikan uang atau waktuku ketika melihat kebutuhan nyata di sekelilingku.",
  "Aku biasanya dapat memberi saran yang tepat dan berwawasan jauh ketika diminta.",
  "Aku sering mendapatkan pemahaman baru tentang firman Tuhan yang terasa langsung dari Allah.",
  "Aku memiliki keyakinan teguh bahwa doa yang sungguh-sungguh dapat mengubah situasi yang tampak mustahil.",
  "Aku beradaptasi dengan mudah terhadap hal-hal baru.",
  "Aku berbagi dengan orang lain saat mereka telah menerima Kristus.",
  "Aku mendapat pesan penting dari Tuhan.",
  "Aku mau menghabiskan waktu luang untuk mempelajari prinsip-prinsip alkitabiah agar bisa menjelaskannya kepada orang lain.",
  "Aku ingin menjadi pendeta atau gembala jemaat.",
  "Aku telah mempengaruhi orang lain untuk menyelesaikan tugas atau menemukan jawaban alkitabiah yang membantu hidup mereka.",
  "Aku senang mempelajari masalah-masalah manajemen dan cara berorganisasi.",
  "Tuhan telah melakukan keajaiban dalam hidupku.",
  "Aku telah menafsirkan bahasa roh sehingga memberkati orang lain.",
  "Aku tipe orang yang suka menjangkau orang-orang yang tidak beruntung.",
  "Aku suka mengunjungi rumah peristirahatan dan panti-panti lainnya tempat orang-orang kesepian dan membutuhkan kunjungan.",
  "Aku suka menyiapkan makanan dan menyediakan tempat tinggal bagi mereka yang membutuhkan.",
  "Orang lain telah menafsirkan bahasa rohku.",
  "Allah menyembuhkan orang lain melalui aku.",
  "Aku dikenal karena sering memberi dorongan kepada orang lain.",
  "Aku senang memberikan uangku.",
  "Allah telah memberikan kemampuan kepadaku untuk memberi bimbingan dan nasihat kepada orang lain.",
  "Aku cenderung memakai wawasan alkitabiah ketika sedang berdiskusi dengan orang lain.",
  "Cukup mudah bagiku untuk berdoa dengan cara yang luar biasa.",
  "Aku memiliki kerinduan yang mendalam untuk melihat orang-orang di negara lain untuk menjadi pengikut Kristus.",
  "Aku selalu memikirkan cara-cara baru supaya aku bisa berbagi dengan teman-teman non Kristen.",
  "Aku ingin menyampaikan firman Allah yang akan menantang orang untuk berubah.",
  "Allah memakaiku untuk membantu orang lain agar lebih paham makna menjadi orang Kristen.",
  "Aku bisa melihat diriku bertanggung jawab atas perkembangan spiritual orang lain.",
  "Saat berada dalam sebuah kelompok, aku biasanya menjadi pemimpin atau mengambil alih kepemimpinan.",
  "Meskipun aku cukup mampu melakukan sesuatu sendirian, aku suka mengajak orang lain untuk membantu mengatur pekerjaan kami.",
  "Aku sudah menyaksikan kekuatan Allah yang ajaib dan dalam melalui hidupku.",
  "Allah memakai karuniaku dalam menafsirkan bahasa roh untuk menyampaikan firman kepada orang lain.",
];

const TOTAL_QUESTIONS = 76;
const PAGE_SIZE = 10;
const TOTAL_PAGES = Math.ceil(TOTAL_QUESTIONS / PAGE_SIZE);

const GIFT_ORDER = [
  "melayani", "murah_hati", "keramahan", "bahasa_roh", "menyembuhkan",
  "menguatkan", "memberi", "hikmat", "pengetahuan", "iman",
  "kerasulan", "penginjilan", "bernubuat", "mengajar", "gembala",
  "memimpin", "administrasi", "mukjizat", "tafsir_bahasa_roh",
];

function computeScores(answers: Record<number, number>): Record<string, number> {
  const sc: Record<string, number> = {};
  for (const [gift, qNums] of Object.entries(KARUNIA_MAP)) {
    sc[gift] = qNums.reduce((sum, n) => sum + (answers[n] ?? 0), 0);
  }
  return sc;
}

function getTopGifts(scores: Record<string, number>): string[] {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const top3Score = sorted[2]?.[1] ?? 0;
  return sorted.filter(([, v]) => v >= top3Score && v > 0).slice(0, 3).map(([k]) => k);
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function KaruniaTeamClient({ user }: { user: User | null }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [page, setPage] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [resultScores, setResultScores] = useState<Record<string, number> | null>(null);
  const [resultTopGifts, setResultTopGifts] = useState<string[]>([]);
  const [resultSaved, setResultSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const pageStart = page * PAGE_SIZE + 1;
  const pageEnd = Math.min(pageStart + PAGE_SIZE - 1, TOTAL_QUESTIONS);
  const pageQuestions = Array.from(
    { length: pageEnd - pageStart + 1 },
    (_, i) => pageStart + i
  );

  const allPageAnswered = pageQuestions.every((n) => answers[n] !== undefined);
  const allAnswered = Object.keys(answers).length === TOTAL_QUESTIONS;
  const isQuizStarted = Object.keys(answers).length > 0 || page > 0;
  const progressPct = Math.round(
    (Object.keys(answers).length / TOTAL_QUESTIONS) * 100
  );

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleAnswer(qNum: number, val: number) {
    setAnswers((prev) => ({ ...prev, [qNum]: val }));
  }

  function handleNext() {
    if (page < TOTAL_PAGES - 1) {
      setPage((p) => p + 1);
      scrollTop();
    } else if (allAnswered) {
      const sc = computeScores(answers);
      const top = getTopGifts(sc);
      setResultScores(sc);
      setResultTopGifts(top);
      setShowResults(true);
      scrollTop();
    }
  }

  function handleRetake() {
    setAnswers({});
    setPage(0);
    setShowResults(false);
    setResultScores(null);
    setResultTopGifts([]);
    setResultSaved(false);
    setSaveError(null);
    scrollTop();
  }

  function handleSave() {
    if (!resultScores || resultTopGifts.length === 0) return;
    startTransition(async () => {
      const { error } = await saveKaruniaTeamResult(resultTopGifts, resultScores);
      if (error) {
        setSaveError(error);
      } else {
        setResultSaved(true);
      }
    });
  }

  const ratingLabels = [
    "Sangat tidak sesuai",
    "Sedikit sesuai",
    "Agak sesuai",
    "Sangat sesuai",
  ];

  // ── RESULTS VIEW ─────────────────────────────────────────────────────────────

  if (showResults && resultScores) {
    const sortedAll = Object.entries(resultScores).sort((a, b) => b[1] - a[1]);

    return (
      <>
        {/* Hero */}
        <section
          style={{
            background: BG_DARK,
            paddingTop: "clamp(2.5rem, 5vw, 5rem)",
            paddingBottom: "clamp(2.5rem, 5vw, 5rem)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: PRIMARY,
            }}
          />
          <div className="container-wide" style={{ maxWidth: "720px" }}>
            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.72rem",
                letterSpacing: "0.1em",
                color: PRIMARY,
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              Hasil Penilaian Tim
            </p>
            <h1
              className="t-hero"
              style={{ color: "oklch(97% 0.005 80)", marginBottom: "1rem" }}
            >
              Karunia Rohani Kamu
            </h1>
            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.9375rem",
                color: "oklch(78% 0.008 80)",
                lineHeight: 1.7,
                maxWidth: "52ch",
                margin: 0,
              }}
            >
              Karunia kamu adalah milik tim. Bagikan hasilnya. Percakapan
              tentang karunia rohani adalah salah satu percakapan paling
              bermakna yang bisa dilakukan sebuah tim.
            </p>
          </div>
        </section>

        {/* Results content */}
        <section
          style={{
            paddingBlock: "clamp(3rem, 5vw, 5rem)",
            background: BG_LIGHT,
          }}
        >
          <div
            className="container-wide"
            style={{ maxWidth: "720px" }}
          >
            {/* Top 3 gifts */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
                marginBottom: "3rem",
              }}
            >
              {resultTopGifts.slice(0, 3).map((key, idx) => {
                const gift = GIFTS[key];
                const score = resultScores[key] ?? 0;
                if (!gift) return null;
                return (
                  <div
                    key={key}
                    style={{
                      background: "white",
                      border: `2px solid ${idx === 0 ? PRIMARY : BORDER}`,
                      padding: "1.5rem",
                      display: "flex",
                      gap: "1.25rem",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        flexShrink: 0,
                        width: "2.5rem",
                        height: "2.5rem",
                        background:
                          idx === 0 ? PRIMARY : "oklch(92% 0.04 45)",
                        color: idx === 0 ? "white" : PRIMARY,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.875rem",
                      }}
                    >
                      {idx + 1}.
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                          gap: "0.5rem",
                          flexWrap: "wrap",
                          marginBottom: "0.375rem",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: "var(--font-montserrat)",
                            fontWeight: 800,
                            fontSize: "1.0625rem",
                            color: "oklch(18% 0.05 260)",
                            margin: 0,
                          }}
                        >
                          {gift.label}
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            color: PRIMARY,
                            margin: 0,
                          }}
                        >
                          {score}/12
                        </p>
                      </div>
                      <p
                        style={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.875rem",
                          color: "oklch(38% 0.008 260)",
                          lineHeight: 1.7,
                          margin: 0,
                        }}
                      >
                        {gift.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* All gifts bar chart */}
            <div style={{ marginBottom: "2.5rem" }}>
              <p
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "oklch(52% 0.008 260)",
                  textTransform: "uppercase",
                  marginBottom: "1.25rem",
                }}
              >
                Semua Karunia
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
              >
                {sortedAll.map(([key, score]) => {
                  const gift = GIFTS[key];
                  if (!gift) return null;
                  const pct = Math.round((score / 12) * 100);
                  return (
                    <div key={key}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "0.25rem",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            color: "oklch(32% 0.008 260)",
                          }}
                        >
                          {gift.label}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            color: PRIMARY,
                          }}
                        >
                          {score}/12
                        </span>
                      </div>
                      <div
                        style={{
                          height: "5px",
                          background: BORDER,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${pct}%`,
                            background: PRIMARY,
                            transition: "width 0.5s ease",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Save / Retake */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
                alignItems: "center",
                marginBottom: "2rem",
              }}
            >
              {resultSaved ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    color: PRIMARY,
                  }}
                >
                  ✓ Tersimpan di Team Dashboard
                </div>
              ) : user ? (
                <button
                  onClick={handleSave}
                  disabled={isPending}
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    background: PRIMARY,
                    color: "white",
                    border: "none",
                    padding: "0.65rem 1.375rem",
                    cursor: isPending ? "not-allowed" : "pointer",
                    opacity: isPending ? 0.7 : 1,
                  }}
                >
                  {isPending ? "Menyimpan..." : "Simpan ke Team Dashboard →"}
                </button>
              ) : (
                <Link
                  href="/membership"
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    background: PRIMARY,
                    color: "white",
                    textDecoration: "none",
                    padding: "0.65rem 1.375rem",
                    display: "inline-block",
                  }}
                >
                  Masuk untuk Menyimpan →
                </Link>
              )}

              <button
                onClick={handleRetake}
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  background: "transparent",
                  color: PRIMARY,
                  border: `1px solid ${PRIMARY}`,
                  padding: "0.65rem 1.375rem",
                  cursor: "pointer",
                }}
              >
                Ulangi Tes
              </button>
            </div>

            {saveError && (
              <p
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.8rem",
                  color: "oklch(52% 0.18 25)",
                  marginBottom: "1rem",
                }}
              >
                Error: {saveError}
              </p>
            )}

            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.72rem",
                color: "oklch(62% 0.008 260)",
                lineHeight: 1.6,
                borderTop: `1px solid ${BORDER}`,
                paddingTop: "1.5rem",
              }}
            >
              Diadaptasi dari Jim Burns &amp; Doug Fields, &ldquo;The Word on
              Finding and Using Your Spiritual Gifts&rdquo;
            </p>
          </div>
        </section>

        {/* CTA */}
        <section
          style={{
            paddingBlock: "clamp(4rem, 7vw, 7rem)",
            background: "oklch(30% 0.12 260)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "clamp(1.5rem, 5vw, 4rem)",
              top: "clamp(4rem, 7vw, 7rem)",
              bottom: "clamp(4rem, 7vw, 7rem)",
              width: "3px",
              background: PRIMARY,
            }}
          />
          <div className="container-wide" style={{ paddingLeft: "2.5rem" }}>
            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: PRIMARY,
                marginBottom: "0.875rem",
              }}
            >
              Lanjutkan
            </p>
            <h2
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 800,
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                lineHeight: 1.15,
                color: "oklch(97% 0.005 80)",
                marginBottom: "1rem",
              }}
            >
              Karuniamu adalah milik tim.
            </h2>
            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.9375rem",
                lineHeight: 1.7,
                color: "oklch(72% 0.04 260)",
                maxWidth: "52ch",
                marginBottom: "2rem",
              }}
            >
              Bagikan hasilmu. Dengarkan hasil orang lain. Biarkan percakapan itu membangun tim yang saling melengkapi.
            </p>
            <Link
              href="/team"
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "0.06em",
                textDecoration: "none",
                padding: "0.75rem 1.75rem",
                background: PRIMARY,
                color: "oklch(14% 0.08 260)",
                display: "inline-block",
              }}
            >
              Kembali ke Team Pathway →
            </Link>
          </div>
        </section>
      </>
    );
  }

  // ── MAIN VIEW (hero + content + quiz) ────────────────────────────────────────

  return (
    <>
      {/* ── HERO ── */}
      <section
        style={{
          background: BG_DARK,
          paddingTop: "clamp(2.5rem, 5vw, 5rem)",
          paddingBottom: "clamp(2.5rem, 5vw, 5rem)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: PRIMARY,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 70% 50%, oklch(30% 0.12 45 / 0.25) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div className="container-wide" style={{ position: "relative" }}>
          <Link
            href="/team"
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.72rem",
              color: "oklch(62% 0.04 260)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              marginBottom: "1.5rem",
            }}
          >
            ← Team Pathway
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1.25rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 800,
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: PRIMARY,
                border: `1.5px solid ${PRIMARY}`,
                padding: "0.3rem 0.7rem",
              }}
            >
              Penilaian Tim · Karunia Rohani
            </span>
            <span
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 600,
                fontSize: "0.65rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "oklch(72% 0.04 260)",
              }}
            >
              20 menit
            </span>
          </div>

          <h1
            className="t-hero"
            style={{ color: "oklch(97% 0.005 80)", marginBottom: "1.25rem", maxWidth: "20ch" }}
          >
            Karunia Rohani{" "}
            <span style={{ color: PRIMARY }}>Tim</span>
          </h1>

          <p
            className="t-tagline"
            style={{
              color: "oklch(72% 0.04 260)",
              maxWidth: "56ch",
              marginBottom: "2.5rem",
            }}
          >
            Karunia rohani bukan hanya untuk pelayanan pribadi — tapi untuk
            membangun tubuh Kristus bersama. Ketika tim tahu karunia
            masing-masing anggota, mereka bisa saling melengkapi.
          </p>
        </div>
      </section>

      {/* ── SECTION 1: Karunia Rohani dalam Konteks Tim ── */}
      <section
        style={{
          paddingBlock: "clamp(3.5rem, 6vw, 6rem)",
          background: BG_LIGHT,
        }}
      >
        <div className="container-wide">
          <div style={{ maxWidth: "68ch" }}>
            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: PRIMARY,
                marginBottom: "0.875rem",
              }}
            >
              Bagian 1
            </p>
            <h2
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 800,
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                lineHeight: 1.15,
                color: "oklch(22% 0.08 260)",
                marginBottom: "1.5rem",
              }}
            >
              Karunia Rohani dalam Konteks Tim
            </h2>
            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "1rem",
                lineHeight: 1.8,
                color: "oklch(30% 0.008 260)",
                marginBottom: "1.25rem",
              }}
            >
              Perjanjian Baru tidak pernah berbicara tentang karunia rohani
              sebagai sesuatu yang dimiliki individu untuk kepentingan pribadi.
              Karunia selalu diberikan dalam konteks{" "}
              <em style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.0625rem" }}>
                tubuh
              </em>{" "}
              — sekelompok orang yang dipanggil untuk bersama-sama mewujudkan
              Kerajaan Allah.
            </p>
            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "1rem",
                lineHeight: 1.8,
                color: "oklch(30% 0.008 260)",
                marginBottom: "1.5rem",
              }}
            >
              Artinya: karuniamu baru sepenuhnya berfungsi ketika ia berinteraksi
              dengan karunia orang lain. Tim yang memahami hal ini tidak sekadar
              membagi tugas — mereka merancang kolaborasi berdasarkan bagaimana
              Allah telah merancang masing-masing anggotanya.
            </p>

            {/* Biblical */}
            <div
              style={{
                background: BG_DARK,
                padding: "1.5rem 2rem",
                borderLeft: `3px solid ${PRIMARY}`,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "1.125rem",
                  fontStyle: "italic",
                  lineHeight: 1.7,
                  color: "oklch(90% 0.006 80)",
                  marginBottom: "0.5rem",
                }}
              >
                &ldquo;Tetapi kepada tiap-tiap orang dikaruniakan penyataan Roh
                untuk kepentingan bersama.&rdquo;
              </p>
              <p
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: PRIMARY,
                  margin: 0,
                }}
              >
                1 Korintus 12:7
              </p>
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: "1px", background: "oklch(90% 0.006 80)" }} />

      {/* ── SECTION 2: Bagaimana Karunia Saling Melengkapi ── */}
      <section
        style={{
          paddingBlock: "clamp(3.5rem, 6vw, 6rem)",
          background: "oklch(30% 0.12 260)",
        }}
      >
        <div className="container-wide">
          <p
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: PRIMARY,
              marginBottom: "0.875rem",
            }}
          >
            Bagian 2
          </p>
          <h2
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800,
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              lineHeight: 1.15,
              color: "oklch(97% 0.005 80)",
              marginBottom: "2rem",
            }}
          >
            Bagaimana Karunia yang Berbeda Saling Melengkapi
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            {[
              {
                label: "Pemimpin + Administrasi",
                body: "Karunia memimpin menggerakkan orang menuju visi; karunia administrasi memastikan visi itu menjadi kenyataan. Tanpa administrasi, pemimpin yang visioner bisa membawa tim ke mana-mana sekaligus. Tanpa pemimpin, tim yang terorganisir bisa mengelola tanpa arah.",
              },
              {
                label: "Hikmat + Bernubuat",
                body: "Hikmat memberikan arah yang bijak dan terukur; nubuat memberikan kepekaan terhadap apa yang Tuhan katakan saat ini. Keduanya dibutuhkan: hikmat tanpa kepekaan rohani bisa menjadi pragmatis, dan nubuat tanpa hikmat bisa menjadi tidak bertanggung jawab.",
              },
              {
                label: "Gembala + Penginjilan",
                body: "Gembala memelihara dan menjaga mereka yang sudah ada; penginjil terus merindukan mereka yang belum datang. Komunitas yang sehat membutuhkan keduanya — pertumbuhan ke dalam dan keluar.",
              },
              {
                label: "Mengajar + Menguatkan",
                body: "Pengajar membawa kedalaman dan kebenaran; yang menguatkan membawa semangat dan harapan. Kebenaran tanpa dorongan bisa terasa dingin; dorongan tanpa kebenaran bisa menjadi dangkal.",
              },
              {
                label: "Melayani + Memberi",
                body: "Melayani hadir melalui tindakan nyata; memberi hadir melalui sumber daya. Keduanya adalah ekspresi cinta yang konkret — dan bersama-sama, mereka membuat pelayanan tim menjadi berkelanjutan.",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: "oklch(22% 0.10 260)",
                  padding: "1.5rem",
                  borderLeft: `3px solid ${PRIMARY}`,
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    color: PRIMARY,
                    marginBottom: "0.625rem",
                  }}
                >
                  {item.label}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.875rem",
                    lineHeight: 1.7,
                    color: "oklch(72% 0.04 260)",
                    margin: 0,
                  }}
                >
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: Ketika Karunia Tidak Dikenali ── */}
      <section
        style={{
          paddingBlock: "clamp(3.5rem, 6vw, 6rem)",
          background: BG_DARK,
        }}
      >
        <div className="container-wide">
          <div style={{ maxWidth: "68ch" }}>
            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: PRIMARY,
                marginBottom: "0.875rem",
              }}
            >
              Bagian 3
            </p>
            <h2
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 800,
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                lineHeight: 1.15,
                color: "oklch(97% 0.005 80)",
                marginBottom: "1.5rem",
              }}
            >
              Apa yang Terjadi Ketika Karunia Tidak Dikenali atau Tidak Dihargai
            </h2>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {[
                {
                  masalah: "Karunia yang tidak dikenali",
                  dampak:
                    "Anggota tim yang tidak tahu karunianya cenderung melayani dari tekanan, bukan dari panggilan. Mereka mungkin bekerja keras, tapi sering merasa kosong atau tidak tepat sasaran. Mereka belum menemukan posisi di mana mereka benar-benar bisa berbuah.",
                },
                {
                  masalah: "Karunia yang tidak dihargai",
                  dampak:
                    "Ketika karunia seseorang tidak dilihat atau tidak dihargai — misalnya karunia keramahan dianggap tidak penting, atau karunia administrasi dianggap bukan pelayanan rohani — orang itu akan mundur atau kehilangan motivasi. Karunia yang tidak dihargai adalah karunia yang tidak berkembang.",
                },
                {
                  masalah: "Karunia yang salah posisi",
                  dampak:
                    "Seorang dengan karunia gembala yang ditempatkan di peran penginjilan mungkin mampu melakukannya, tapi tidak akan berbuah maksimal. Tim yang menempatkan orang berdasarkan ketersediaan, bukan berdasarkan karunia, sering kali frustrasi dengan hasilnya.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: "oklch(28% 0.10 260)",
                    padding: "1.5rem",
                    borderLeft: `3px solid ${PRIMARY}`,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      color: "oklch(97% 0.005 80)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {item.masalah}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.875rem",
                      lineHeight: 1.7,
                      color: "oklch(72% 0.04 260)",
                      margin: 0,
                    }}
                  >
                    {item.dampak}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: Bagaimana Pemimpin Membangun Tim Berdasarkan Karunia ── */}
      <section
        style={{
          paddingBlock: "clamp(3.5rem, 6vw, 6rem)",
          background: BG_LIGHT,
        }}
      >
        <div className="container-wide">
          <p
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: PRIMARY,
              marginBottom: "0.875rem",
            }}
          >
            Bagian 4
          </p>
          <h2
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800,
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              lineHeight: 1.15,
              color: "oklch(22% 0.08 260)",
              marginBottom: "2.5rem",
            }}
          >
            Bagaimana Pemimpin Membangun Tim Berdasarkan Karunia
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1px",
              background: "oklch(90% 0.006 80 / 0.5)",
            }}
          >
            {[
              {
                num: "01",
                judul: "Buat karunia menjadi percakapan tim",
                isi: "Jangan biarkan penilaian ini menjadi dokumen yang disimpan dan dilupakan. Jadwalkan waktu di mana setiap anggota berbagi karunia utamanya dan apa artinya bagi mereka. Percakapan itu sendiri sudah membangun.",
              },
              {
                num: "02",
                judul: "Sesuaikan tanggung jawab dengan karunia",
                isi: "Tinjau siapa melakukan apa di tim kamu. Apakah ada orang yang melayani di area yang bertentangan dengan karunianya? Perubahan kecil dalam penempatan bisa menghasilkan buah yang jauh lebih besar.",
              },
              {
                num: "03",
                judul: "Hargai semua karunia, bukan hanya yang terlihat",
                isi: "Karunia melayani, keramahan, dan murah hati sering kali tidak terlihat tapi sangat menentukan kesehatan tim. Pemimpin yang baik menyebut karunia-karunia ini dengan nama dan menghargainya secara eksplisit.",
              },
              {
                num: "04",
                judul: "Identifikasi kesenjangan karunia di tim",
                isi: "Apakah tidak ada yang memiliki karunia administrasi? Apakah tidak ada yang memiliki karunia menguatkan? Kesenjangan karunia sering menjelaskan mengapa tim berjuang di area tertentu — dan membantu menetapkan prioritas rekrutmen atau pengembangan.",
              },
            ].map((item) => (
              <div
                key={item.num}
                style={{
                  background: "white",
                  padding: "2rem 1.75rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 800,
                    fontSize: "2rem",
                    color: "oklch(90% 0.006 80)",
                    lineHeight: 1,
                    marginBottom: "0.875rem",
                  }}
                >
                  {item.num}
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "0.9375rem",
                    color: "oklch(22% 0.08 260)",
                    marginBottom: "0.625rem",
                  }}
                >
                  {item.judul}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.875rem",
                    lineHeight: 1.65,
                    color: "oklch(45% 0.008 260)",
                    margin: 0,
                  }}
                >
                  {item.isi}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUIZ ── */}
      <section
        id="quiz-section"
        style={{
          paddingBlock: "clamp(4rem, 7vw, 7rem)",
          background: BG_LIGHT,
        }}
      >
        <div className="container-wide">
          <div style={{ marginBottom: "2.5rem" }}>
            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: PRIMARY,
                marginBottom: "0.875rem",
              }}
            >
              Penilaian
            </p>
            <h2
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 800,
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                lineHeight: 1.15,
                color: "oklch(22% 0.08 260)",
                marginBottom: "0.875rem",
              }}
            >
              Tes Karunia Rohani Tim
            </h2>
            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.9375rem",
                lineHeight: 1.7,
                color: "oklch(48% 0.008 260)",
                maxWidth: "56ch",
              }}
            >
              76 pernyataan. Nilai seberapa sesuai setiap pernyataan dengan
              dirimu — dari 0 (sangat tidak sesuai) hingga 3 (sangat sesuai).
            </p>
          </div>

          {/* Gift overview (only shown before quiz starts) */}
          {!isQuizStarted && (
            <div style={{ marginBottom: "3rem" }}>
              <p
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: PRIMARY,
                  textTransform: "uppercase",
                  marginBottom: "1.25rem",
                }}
              >
                19 Karunia yang Diukur
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "0.875rem",
                  marginBottom: "2rem",
                }}
              >
                {GIFT_ORDER.map((key) => {
                  const gift = GIFTS[key];
                  if (!gift) return null;
                  return (
                    <div
                      key={key}
                      style={{
                        border: `1px solid ${BORDER}`,
                        padding: "1rem 1.125rem",
                        background: "white",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "var(--font-montserrat)",
                          fontWeight: 800,
                          fontSize: "0.875rem",
                          color: "oklch(18% 0.05 260)",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {gift.label}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.8125rem",
                          color: "oklch(45% 0.008 260)",
                          lineHeight: 1.6,
                          margin: 0,
                        }}
                      >
                        {gift.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Progress bar */}
          <div style={{ maxWidth: "720px" }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "oklch(52% 0.008 260)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Pernyataan {pageStart}–{pageEnd} dari {TOTAL_QUESTIONS}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: PRIMARY,
                  }}
                >
                  {progressPct}%
                </span>
              </div>
              <div
                style={{
                  height: "4px",
                  background: BORDER,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progressPct}%`,
                    background: PRIMARY,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>

            {/* Rating legend */}
            <div
              style={{
                background: "white",
                border: `1px solid ${BORDER}`,
                padding: "0.875rem 1.25rem",
                marginBottom: "2rem",
                display: "flex",
                gap: "1.5rem",
                flexWrap: "wrap",
              }}
            >
              {ratingLabels.map((label, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.72rem",
                    color: "oklch(52% 0.008 260)",
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      fontWeight: 800,
                      color: PRIMARY,
                    }}
                  >
                    {i}
                  </span>{" "}
                  = {label}
                </span>
              ))}
            </div>

            {/* Questions */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                marginBottom: "2.5rem",
              }}
            >
              {pageQuestions.map((qNum) => {
                const selected = answers[qNum];
                const q = QUESTIONS[qNum - 1];
                return (
                  <div
                    key={qNum}
                    style={{
                      background: "white",
                      border: `1px solid ${selected !== undefined ? PRIMARY : BORDER}`,
                      padding: "1.375rem 1.5rem",
                      transition: "border-color 0.15s",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "oklch(22% 0.005 260)",
                        lineHeight: 1.6,
                        marginBottom: "1rem",
                      }}
                    >
                      <span
                        style={{
                          color: PRIMARY,
                          fontWeight: 800,
                          marginRight: "0.5rem",
                        }}
                      >
                        {qNum}.
                      </span>
                      {q}
                    </p>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {[0, 1, 2, 3].map((val) => {
                        const isSelected = selected === val;
                        return (
                          <button
                            key={val}
                            onClick={() => handleAnswer(qNum, val)}
                            style={{
                              fontFamily: "var(--font-montserrat)",
                              fontSize: "0.875rem",
                              fontWeight: 700,
                              width: "40px",
                              height: "40px",
                              flexShrink: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: isSelected
                                ? PRIMARY
                                : "transparent",
                              color: isSelected ? "white" : PRIMARY,
                              border: `1.5px solid ${PRIMARY}`,
                              cursor: "pointer",
                              transition: "all 0.12s",
                            }}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              {page > 0 ? (
                <button
                  onClick={() => {
                    setPage((p) => p - 1);
                    scrollTop();
                  }}
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    background: "transparent",
                    color: PRIMARY,
                    border: `1px solid ${PRIMARY}`,
                    padding: "0.65rem 1.375rem",
                    cursor: "pointer",
                  }}
                >
                  ← Kembali
                </button>
              ) : (
                <div />
              )}

              <button
                onClick={handleNext}
                disabled={!allPageAnswered}
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  background: allPageAnswered
                    ? PRIMARY
                    : "oklch(82% 0.04 80)",
                  color: "white",
                  border: "none",
                  padding: "0.65rem 1.5rem",
                  cursor: allPageAnswered ? "pointer" : "not-allowed",
                  transition: "background 0.15s",
                }}
              >
                {page < TOTAL_PAGES - 1 ? "Lanjut →" : "Lihat Hasil →"}
              </button>
            </div>

            {!allPageAnswered && (
              <p
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.72rem",
                  color: "oklch(62% 0.008 260)",
                  marginTop: "0.875rem",
                  textAlign: "right",
                }}
              >
                Jawab semua pernyataan di halaman ini untuk melanjutkan.
              </p>
            )}

            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.72rem",
                color: "oklch(72% 0.008 260)",
                lineHeight: 1.6,
                borderTop: `1px solid ${BORDER}`,
                paddingTop: "1.5rem",
                marginTop: "2.5rem",
              }}
            >
              Diadaptasi dari Jim Burns &amp; Doug Fields, &ldquo;The Word on
              Finding and Using Your Spiritual Gifts&rdquo;
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
