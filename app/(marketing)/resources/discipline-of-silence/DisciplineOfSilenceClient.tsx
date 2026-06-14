"use client";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id";

const PORTRAITS = [
  {
    en_title: "The Leader Who Prays Fast",
    id_title: "Pemimpin yang Berdoa Cepat",
    en_body: "She prays every morning. Two minutes, in traffic, with one eye on her phone. She has not stopped praying. She has stopped being formed by it.",
    id_body: "Ia berdoa setiap pagi. Dua menit, di tengah kemacetan, dengan satu mata di ponselnya. Ia tidak berhenti berdoa. Ia berhenti dibentuk olehnya.",
  },
  {
    en_title: "The Leader Who Waits for a Retreat",
    id_title: "Pemimpin yang Menunggu Retret",
    en_body: "He is saving his real prayer life for when things slow down. He has been saying this for three years. Things have not slowed down. Neither has the erosion.",
    id_body: "Ia menyimpan kehidupan doa yang sesungguhnya untuk ketika segalanya melambat. Ia telah mengatakan ini selama tiga tahun. Segalanya tidak melambat. Begitu pula dengan erosi.",
  },
  {
    en_title: "The Leader Who Found a Structure",
    id_title: "Pemimpin yang Menemukan Struktur",
    en_body: "She did not have more time. She made different choices about the time she had. A fifteen-minute daily anchor. A Sunday evening review. One 48-hour retreat per year. Her leadership did not get louder. It got cleaner.",
    id_body: "Ia tidak punya lebih banyak waktu. Ia membuat pilihan berbeda tentang waktu yang ia miliki. Jangkar harian lima belas menit. Tinjauan malam Minggu. Satu retret 48 jam per tahun. Kepemimpinannya tidak semakin keras. Semakin jernih.",
  },
];

const DAILY_TIMES = [
  { en: "Early morning", id: "Pagi hari" },
  { en: "Before lunch", id: "Sebelum makan siang" },
  { en: "Evening", id: "Malam hari" },
  { en: "Other", id: "Lainnya" },
];

const DAILY_PRACTICES = [
  { en: "Silence", id: "Keheningan" },
  { en: "Scripture", id: "Alkitab" },
  { en: "Prayer", id: "Doa" },
  { en: "Examen", id: "Examen" },
  { en: "Other", id: "Lainnya" },
];

const WEEKLY_DAYS = [
  { en: "Monday", id: "Senin" },
  { en: "Tuesday", id: "Selasa" },
  { en: "Wednesday", id: "Rabu" },
  { en: "Thursday", id: "Kamis" },
  { en: "Friday", id: "Jumat" },
  { en: "Saturday", id: "Sabtu" },
  { en: "Sunday", id: "Minggu" },
];

const WEEKLY_DURATIONS = [
  { en: "15 min", id: "15 menit" },
  { en: "30 min", id: "30 menit" },
  { en: "1 hour", id: "1 jam" },
];

const WEEKLY_PROMPTS = [
  { en: "What did I notice about my interior state this week?", id: "Apa yang saya perhatikan tentang keadaan batin saya minggu ini?" },
  { en: "Where did I sense God's presence or absence?", id: "Di mana saya merasakan kehadiran atau ketidakhadiran Allah?" },
  { en: "What am I avoiding?", id: "Apa yang saya hindari?" },
];

const ANNUAL_SEASONS = [
  { en: "Spring", id: "Musim Semi" },
  { en: "Summer", id: "Musim Panas" },
  { en: "Autumn", id: "Musim Gugur" },
  { en: "Winter", id: "Musim Dingin" },
  { en: "January", id: "Januari" },
  { en: "February", id: "Februari" },
  { en: "March", id: "Maret" },
  { en: "April", id: "April" },
  { en: "May", id: "Mei" },
  { en: "June", id: "Juni" },
  { en: "July", id: "Juli" },
  { en: "August", id: "Agustus" },
  { en: "September", id: "September" },
  { en: "October", id: "Oktober" },
  { en: "November", id: "November" },
  { en: "December", id: "Desember" },
];

const ANNUAL_DURATIONS = [
  { en: "24 hours", id: "24 jam" },
  { en: "48 hours", id: "48 jam" },
  { en: "Longer", id: "Lebih lama" },
];

type Props = { isSaved: boolean };

export default function DisciplineOfSilenceClient({ isSaved: initialSaved }: Props) {
  const { lang: ctxLang } = useLanguage();
  const lang: Lang = ctxLang === "id" ? "id" : "en";

  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  // Prayer Architecture Builder state
  const [dailyTime, setDailyTime] = useState("");
  const [dailyPractice, setDailyPractice] = useState("");
  const [weeklyDay, setWeeklyDay] = useState("");
  const [weeklyDuration, setWeeklyDuration] = useState("");
  const [weeklyPrompt, setWeeklyPrompt] = useState("");
  const [annualSeason, setAnnualSeason] = useState("");
  const [annualDuration, setAnnualDuration] = useState("");
  const [accountablePerson, setAccountablePerson] = useState("");
  const [architectureComplete, setArchitectureComplete] = useState(false);
  const [copied, setCopied] = useState(false);

  const navy = "oklch(22% 0.10 260)";
  const orange = "oklch(65% 0.15 45)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const bodyText = "oklch(38% 0.05 260)";
  const serif = "var(--font-cormorant, Cormorant Garamond, Georgia, serif)";

  function t(en: string, id: string) {
    return lang === "id" ? id : en;
  }

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("discipline-of-silence");
      setSaved(true);
    });
  }

  const allFieldsFilled =
    dailyTime && dailyPractice && weeklyDay && weeklyDuration && weeklyPrompt &&
    annualSeason && annualDuration && accountablePerson.trim();

  function buildArchitectureText() {
    if (lang === "id") {
      return `ARSITEKTUR DOA SAYA\n\nJangkar Harian\nWaktu: ${dailyTime}\nPraktik: ${dailyPractice}\n\nTinjauan Mingguan\nHari: ${weeklyDay} — ${weeklyDuration}\nPertanyaan panduan: ${weeklyPrompt}\n\nRetret Tahunan\nMusim: ${annualSeason} — ${annualDuration}\nAkuntabilitas: ${accountablePerson}`;
    }
    return `MY PRAYER ARCHITECTURE\n\nDaily Anchor\nTime: ${dailyTime}\nPractice: ${dailyPractice}\n\nWeekly Review\nDay: ${weeklyDay} — ${weeklyDuration}\nGuiding prompt: ${weeklyPrompt}\n\nAnnual Retreat\nSeason: ${annualSeason} — ${annualDuration}\nAccountability: ${accountablePerson}`;
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildArchitectureText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // silently fail
    }
  }

  const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    fontFamily: serif,
    fontSize: "clamp(15px, 1.7vw, 17px)",
    color: bodyText,
    background: offWhite,
    border: "1px solid oklch(88% 0.01 80)",
    borderRadius: 4,
    appearance: "none" as const,
    cursor: "pointer",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    fontFamily: serif,
    fontSize: "clamp(15px, 1.7vw, 17px)",
    color: bodyText,
    background: offWhite,
    border: "1px solid oklch(88% 0.01 80)",
    borderRadius: 4,
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "Montserrat, sans-serif",
    fontSize: 11,
    fontWeight: 700,
    color: orange,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    display: "block",
    marginBottom: 8,
  };

  const fieldGroupStyle: React.CSSProperties = {
    marginBottom: 20,
  };

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>
      <LangToggle />

      {/* Slow reading notice */}
      <div style={{ background: "oklch(94% 0.012 65)", borderBottom: "1px solid oklch(88% 0.02 65)", padding: "12px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "oklch(42% 0.08 50)", fontStyle: "italic", margin: 0 }}>
          {t(
            "Set aside 15 minutes. Read slowly. This module is designed for reflection, not consumption.",
            "Sisihkan 15 menit. Baca dengan perlahan. Modul ini dirancang untuk refleksi, bukan konsumsi."
          )}
        </p>
      </div>

      {/* Hero */}
      <div style={{ background: navy, padding: "88px 24px 80px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {t("Faith & Calling", "Iman & Panggilan")}
          </p>
          <h1 style={{ fontFamily: serif, fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, color: offWhite, margin: "0 0 24px", lineHeight: 1.08 }}>
            {t("The Discipline of Silence", "Disiplin Keheningan")}
          </h1>
          <div style={{ width: 48, height: 1, background: orange, margin: "0 auto 32px" }} />
          <p style={{ fontFamily: serif, fontSize: "clamp(19px, 2.5vw, 23px)", color: "oklch(82% 0.025 80)", lineHeight: 1.75, marginBottom: 40, fontStyle: "italic" }}>
            {t(
              "Come with me by yourselves to a quiet place and get some rest.",
              "Marilah ke tempat yang sunyi, supaya kita sendirian, dan beristirahatlah sebentar!"
            )}
          </p>
          <p style={{ fontSize: 13, color: orange, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 48 }}>
            — {t("Mark 6:31", "Markus 6:31")} (NIV)
          </p>
          <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.9vw, 20px)", color: "oklch(76% 0.03 80)", lineHeight: 1.8, marginBottom: 48, maxWidth: 580, marginLeft: "auto", marginRight: "auto" }}>
            {t(
              "Why prayer is a leadership discipline, not a spiritual add-on, and what a sustainable prayer architecture actually looks like for cross-cultural leaders.",
              "Mengapa doa adalah disiplin kepemimpinan, bukan tambahan spiritual, dan seperti apa arsitektur doa yang berkelanjutan bagi para pemimpin lintas budaya."
            )}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={handleSave}
              disabled={saved || isPending}
              style={{ padding: "12px 28px", border: "none", cursor: saved ? "default" : "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, background: saved ? "oklch(35% 0.05 260)" : orange, color: offWhite, letterSpacing: "0.04em", borderRadius: 4 }}
            >
              {saved
                ? t("Saved to Dashboard", "Tersimpan di Dashboard")
                : t("Save to Dashboard", "Simpan ke Dashboard")}
            </button>
          </div>
        </div>
      </div>

      {/* Hook */}
      <div style={{ padding: "80px 24px 0", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: "clamp(18px, 2.2vw, 23px)", color: navy, lineHeight: 1.85, fontStyle: "italic", padding: "8px 0 8px 28px", borderLeft: `3px solid ${orange}`, marginBottom: 0 }}>
          {t(
            "You still pray. You are not the leader who abandoned faith along the way. But somewhere in the past few years, your prayer life shifted from conversation to briefing. You update God on your plans. You ask for his backing. The quiet has thinned, and you know it. This module does not add more conviction. It offers you a structure.",
            "Anda masih berdoa. Anda bukan pemimpin yang meninggalkan iman di tengah jalan. Tetapi suatu saat dalam beberapa tahun terakhir, kehidupan doa Anda bergeser dari percakapan menjadi laporan. Anda memperbarui Allah tentang rencana Anda. Anda meminta dukungan-Nya. Keheningan itu telah menipis, dan Anda tahu itu. Modul ini tidak menambah keyakinan. Ia menawarkan struktur."
          )}
        </p>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 720, margin: "48px auto 0", padding: "0 24px" }}>
        <div style={{ height: 1, background: "oklch(90% 0.008 80)" }} />
      </div>

      {/* Section 1: Always On */}
      <div style={{ padding: "80px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
          {t("I. Always On", "I. Selalu Aktif")}
        </p>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 32, lineHeight: 1.2, fontStyle: "italic" }}>
          {t("The Cost of a Constantly Running Mind", "Biaya Pikiran yang Terus Berjalan")}
        </h2>
        <div style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9 }}>
          <p style={{ marginBottom: 24 }}>
            {t(
              "The leader's internal monologue never fully stops. Processing meetings, planning responses, adapting to new information, managing competing demands. Even in rest, the mind is running scenarios.",
              "Monolog internal seorang pemimpin tidak pernah benar-benar berhenti. Memproses pertemuan, merencanakan respons, beradaptasi dengan informasi baru, mengelola tuntutan yang bersaing. Bahkan dalam istirahat, pikiran terus menjalankan skenario."
            )}
          </p>
          <p style={{ marginBottom: 24 }}>
            {t(
              "The real cost is not burnout as collapse. It is the quieter erosion of discernment, and the gradual loss of capacity to hear anything beyond your own analysis. When the internal noise is constant, the still small voice has nowhere to land.",
              "Biaya nyatanya bukan kelelahan sebagai keruntuhan. Ini adalah erosi diskernmen yang lebih halus, dan hilangnya kapasitas secara bertahap untuk mendengar apa pun di luar analisis Anda sendiri. Ketika kebisingan internal konstan, suara lembut dan tenang tidak punya tempat untuk mendarat."
            )}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: "oklch(90% 0.008 80)" }} />
      </div>

      {/* Section 2: Prayer as Formation */}
      <div style={{ padding: "80px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
          {t("II. Prayer as Formation", "II. Doa sebagai Pembentukan")}
        </p>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 32, lineHeight: 1.2, fontStyle: "italic" }}>
          {t("Whose Agenda Are You Running?", "Agenda Siapa yang Anda Jalankan?")}
        </h2>
        <div style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9 }}>
          <p style={{ marginBottom: 24 }}>
            {t(
              "Prayer shaped by high output becomes transactional. We present decisions and wait for divine endorsement. We report progress and ask for favour. The form of prayer is maintained, but the posture has changed.",
              "Doa yang dibentuk oleh output tinggi menjadi transaksional. Kita menyajikan keputusan dan menunggu persetujuan ilahi. Kita melaporkan kemajuan dan meminta berkat. Bentuk doa dipertahankan, tetapi sikapnya telah berubah."
            )}
          </p>
          <p style={{ marginBottom: 24 }}>
            {t(
              "Prayer is not the fuel leaders add to their existing agenda. It is the formative practice that determines whose agenda they are actually running.",
              "Doa bukan bahan bakar yang ditambahkan pemimpin ke agenda mereka yang sudah ada. Ini adalah praktik formatif yang menentukan agenda siapa yang sebenarnya mereka jalankan."
            )}
          </p>
          <p style={{ fontFamily: serif, fontSize: "clamp(18px, 2vw, 22px)", fontStyle: "italic", color: navy, lineHeight: 1.75, padding: "8px 0 8px 28px", borderLeft: `3px solid ${orange}`, marginBottom: 0 }}>
            {t(
              "Henri Nouwen's frame: the goal is not a leader who prays sometimes, but one who prays always, whose whole life becomes a continuous act of listening.",
              "Kerangka Henri Nouwen: tujuannya bukan pemimpin yang berdoa sesekali, tetapi yang berdoa selalu, yang seluruh hidupnya menjadi tindakan mendengarkan yang terus-menerus."
            )}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: "oklch(90% 0.008 80)" }} />
      </div>

      {/* Section 3: What This Looks Like */}
      <div style={{ padding: "80px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
          {t("III. What This Looks Like", "III. Seperti Apa Ini")}
        </p>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 32, lineHeight: 1.2, fontStyle: "italic" }}>
          {t("Three Rhythms, One Architecture", "Tiga Ritme, Satu Arsitektur")}
        </h2>
        <div style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9 }}>
          <p style={{ marginBottom: 40 }}>
            {t(
              "What this looks like differs in Malaysia versus Nairobi versus the UK. The principle is constant. The form adapts.",
              "Seperti apa ini berbeda di Malaysia versus Nairobi versus Inggris. Prinsipnya konstan. Bentuknya beradaptasi."
            )}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
            {[
              {
                num: "01",
                en_title: "Daily Anchor",
                id_title: "Jangkar Harian",
                en_body: "A fixed, brief point of intentional stillness before work begins. Not long. Not elaborate. Just present.",
                id_body: "Titik keheningan yang tetap dan singkat sebelum pekerjaan dimulai. Tidak lama. Tidak rumit. Hanya hadir.",
              },
              {
                num: "02",
                en_title: "Weekly Review",
                id_title: "Tinjauan Mingguan",
                en_body: "Reflection on your interior state, not just your outputs. What did you notice this week? Where were you present, and where were you absent?",
                id_body: "Refleksi tentang keadaan batin Anda, bukan hanya output Anda. Apa yang Anda perhatikan minggu ini? Di mana Anda hadir, dan di mana Anda tidak?",
              },
              {
                num: "03",
                en_title: "Annual Retreat",
                id_title: "Retret Tahunan",
                en_body: "Extended silence as a structural commitment, not a reward for a hard year. Built into the calendar before the year begins.",
                id_body: "Keheningan yang diperpanjang sebagai komitmen struktural, bukan hadiah untuk tahun yang berat. Dibangun ke dalam kalender sebelum tahun dimulai.",
              },
            ].map((item) => (
              <div key={item.num} style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
                <div style={{ fontFamily: serif, fontSize: "clamp(40px, 4.5vw, 52px)", fontWeight: 700, color: orange, lineHeight: 1, minWidth: 44, flexShrink: 0, marginTop: -4 }}>
                  {item.num}
                </div>
                <div>
                  <h3 style={{ fontFamily: serif, fontSize: "clamp(18px, 2.2vw, 22px)", fontWeight: 700, color: navy, marginBottom: 10, fontStyle: "italic", lineHeight: 1.3 }}>
                    {lang === "id" ? item.id_title : item.en_title}
                  </h3>
                  <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: bodyText, lineHeight: 1.9, margin: 0 }}>
                    {lang === "id" ? item.id_body : item.en_body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 4: Why 48 Hours — navy bg */}
      <div style={{ background: navy, padding: "80px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
            {t("IV. Why 48 Hours Is Not Extreme", "IV. Mengapa 48 Jam Bukan Hal Berlebihan")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: offWhite, marginBottom: 32, lineHeight: 1.2, fontStyle: "italic" }}>
            {t("The Minimum Viable Baseline", "Garis Dasar Minimum yang Layak")}
          </h2>
          <div style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: "oklch(76% 0.03 80)", lineHeight: 1.9 }}>
            <p style={{ marginBottom: 24 }}>
              {t(
                "The first 24 hours of a silent retreat are mostly decompression. The nervous system is still processing what you left behind. The to-do list is still running in the background.",
                "24 jam pertama retret hening sebagian besar adalah dekompresi. Sistem saraf masih memproses apa yang Anda tinggalkan. Daftar tugas masih berjalan di latar belakang."
              )}
            </p>
            <p style={{ marginBottom: 24 }}>
              {t(
                "The second 24 hours is where formation begins. The quiet deepens. Listening becomes possible again. Something shifts in the posture of leadership.",
                "24 jam kedua adalah tempat pembentukan dimulai. Keheningan semakin dalam. Mendengarkan menjadi mungkin lagi. Sesuatu berubah dalam postur kepemimpinan."
              )}
            </p>
            <p style={{ marginBottom: 0 }}>
              {t(
                "The case is not found in productivity research. It is found in the pattern of Jesus and the witness of those who have gone before. A 48-hour annual retreat is not exceptional for serious leaders. It is the minimum viable baseline.",
                "Alasannya tidak ditemukan dalam penelitian produktivitas. Ini ditemukan dalam pola Yesus dan kesaksian mereka yang telah mendahului. Retret tahunan 48 jam bukan hal luar biasa bagi pemimpin yang serius. Ini adalah garis dasar minimum yang layak."
              )}
            </p>
          </div>
          <div style={{ marginTop: 48, padding: "36px 40px", background: "oklch(18% 0.09 260)", borderRadius: 4 }}>
            <p style={{ fontFamily: serif, fontSize: "clamp(18px, 2.2vw, 23px)", fontStyle: "italic", color: offWhite, lineHeight: 1.8, marginBottom: 16 }}>
              {t(
                "\"Come with me by yourselves to a quiet place and get some rest.\"",
                "\"Marilah ke tempat yang sunyi, supaya kita sendirian, dan beristirahatlah sebentar!\""
              )}
            </p>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em", margin: 0 }}>
              — {t("Mark 6:31 (NIV)", "Markus 6:31 (TB)")}
            </p>
            <p style={{ fontFamily: serif, fontSize: "clamp(14px, 1.6vw, 16px)", color: "oklch(65% 0.03 80)", lineHeight: 1.75, marginTop: 16, marginBottom: 0, fontStyle: "italic" }}>
              {t(
                "Jesus spoke these words to leaders in the middle of their most effective season, crowds pressing in, miracles happening. The invitation was not a pause from leadership. It was its condition.",
                "Yesus mengucapkan kata-kata ini kepada para pemimpin di tengah musim paling efektif mereka, kerumunan menekan, mukjizat terjadi. Undangan itu bukan jeda dari kepemimpinan. Itu adalah syaratnya."
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Section 5: Three Portraits */}
      <div style={{ background: lightGray, padding: "80px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
            {t("V. Three Portraits", "V. Tiga Potret")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 20, lineHeight: 1.2, fontStyle: "italic" }}>
            {t("Where Are You in This?", "Di Mana Anda dalam Ini?")}
          </h2>
          <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)", color: bodyText, lineHeight: 1.85, marginBottom: 56 }}>
            {t(
              "Most leaders recognise themselves in one of these.",
              "Kebanyakan pemimpin mengenali diri mereka dalam salah satu dari ini."
            )}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
            {PORTRAITS.map((p, i) => (
              <div key={i} style={{ background: offWhite, padding: "36px 40px", borderRadius: 4 }}>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 style={{ fontFamily: serif, fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 700, color: navy, marginBottom: 20, fontStyle: "italic", lineHeight: 1.3 }}>
                  {lang === "id" ? p.id_title : p.en_title}
                </h3>
                <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: bodyText, lineHeight: 1.9, margin: 0 }}>
                  {lang === "id" ? p.id_body : p.en_body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 6: Prayer Architecture Builder */}
      <div style={{ padding: "80px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
          {t("VI. Build Your Prayer Architecture", "VI. Bangun Arsitektur Doa Anda")}
        </p>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 20, lineHeight: 1.2, fontStyle: "italic" }}>
          {t("One Practical Output", "Satu Hasil Praktis")}
        </h2>
        <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: bodyText, lineHeight: 1.85, marginBottom: 56 }}>
          {t(
            "This is not a journal prompt. It is a decision. What is your daily anchor? What is your weekly rhythm? When is your next extended retreat?",
            "Ini bukan pertanyaan jurnal. Ini adalah keputusan. Apa jangkar harian Anda? Apa ritme mingguan Anda? Kapan retret panjang Anda berikutnya?"
          )}
        </p>

        {!architectureComplete ? (
          <div>
            {/* Section 1: Daily Anchor */}
            <div style={{ background: lightGray, padding: "36px 40px", borderRadius: 4, marginBottom: 24 }}>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, color: navy, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 24 }}>
                {t("Section 1 — Daily Anchor", "Bagian 1 — Jangkar Harian")}
              </p>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>{t("Time window", "Jendela waktu")}</label>
                <select value={dailyTime} onChange={(e) => setDailyTime(e.target.value)} style={selectStyle}>
                  <option value="">{t("Select a time...", "Pilih waktu...")}</option>
                  {DAILY_TIMES.map((opt) => (
                    <option key={opt.en} value={lang === "id" ? opt.id : opt.en}>
                      {lang === "id" ? opt.id : opt.en}
                    </option>
                  ))}
                </select>
              </div>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>{t("One practice", "Satu praktik")}</label>
                <select value={dailyPractice} onChange={(e) => setDailyPractice(e.target.value)} style={selectStyle}>
                  <option value="">{t("Select a practice...", "Pilih praktik...")}</option>
                  {DAILY_PRACTICES.map((opt) => (
                    <option key={opt.en} value={lang === "id" ? opt.id : opt.en}>
                      {lang === "id" ? opt.id : opt.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Section 2: Weekly Review */}
            <div style={{ background: lightGray, padding: "36px 40px", borderRadius: 4, marginBottom: 24 }}>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, color: navy, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 24 }}>
                {t("Section 2 — Weekly Review", "Bagian 2 — Tinjauan Mingguan")}
              </p>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>{t("Day of the week", "Hari dalam seminggu")}</label>
                <select value={weeklyDay} onChange={(e) => setWeeklyDay(e.target.value)} style={selectStyle}>
                  <option value="">{t("Select a day...", "Pilih hari...")}</option>
                  {WEEKLY_DAYS.map((opt) => (
                    <option key={opt.en} value={lang === "id" ? opt.id : opt.en}>
                      {lang === "id" ? opt.id : opt.en}
                    </option>
                  ))}
                </select>
              </div>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>{t("Duration", "Durasi")}</label>
                <select value={weeklyDuration} onChange={(e) => setWeeklyDuration(e.target.value)} style={selectStyle}>
                  <option value="">{t("Select a duration...", "Pilih durasi...")}</option>
                  {WEEKLY_DURATIONS.map((opt) => (
                    <option key={opt.en} value={lang === "id" ? opt.id : opt.en}>
                      {lang === "id" ? opt.id : opt.en}
                    </option>
                  ))}
                </select>
              </div>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>{t("Guiding prompt", "Pertanyaan panduan")}</label>
                <select value={weeklyPrompt} onChange={(e) => setWeeklyPrompt(e.target.value)} style={selectStyle}>
                  <option value="">{t("Select a prompt...", "Pilih pertanyaan...")}</option>
                  {WEEKLY_PROMPTS.map((opt) => (
                    <option key={opt.en} value={lang === "id" ? opt.id : opt.en}>
                      {lang === "id" ? opt.id : opt.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Section 3: Annual Retreat */}
            <div style={{ background: lightGray, padding: "36px 40px", borderRadius: 4, marginBottom: 40 }}>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, color: navy, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 24 }}>
                {t("Section 3 — Annual Retreat", "Bagian 3 — Retret Tahunan")}
              </p>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>{t("Season or month", "Musim atau bulan")}</label>
                <select value={annualSeason} onChange={(e) => setAnnualSeason(e.target.value)} style={selectStyle}>
                  <option value="">{t("Select a season or month...", "Pilih musim atau bulan...")}</option>
                  {ANNUAL_SEASONS.map((opt) => (
                    <option key={opt.en} value={lang === "id" ? opt.id : opt.en}>
                      {lang === "id" ? opt.id : opt.en}
                    </option>
                  ))}
                </select>
              </div>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>{t("Duration", "Durasi")}</label>
                <select value={annualDuration} onChange={(e) => setAnnualDuration(e.target.value)} style={selectStyle}>
                  <option value="">{t("Select a duration...", "Pilih durasi...")}</option>
                  {ANNUAL_DURATIONS.map((opt) => (
                    <option key={opt.en} value={lang === "id" ? opt.id : opt.en}>
                      {lang === "id" ? opt.id : opt.en}
                    </option>
                  ))}
                </select>
              </div>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>{t("One person who will hold you accountable", "Satu orang yang akan menuntut akuntabilitas Anda")}</label>
                <input
                  type="text"
                  value={accountablePerson}
                  onChange={(e) => setAccountablePerson(e.target.value)}
                  placeholder={t("Name...", "Nama...")}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => { if (allFieldsFilled) setArchitectureComplete(true); }}
                disabled={!allFieldsFilled}
                style={{ padding: "14px 40px", border: "none", cursor: allFieldsFilled ? "pointer" : "default", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, background: allFieldsFilled ? orange : "oklch(88% 0.01 80)", color: allFieldsFilled ? offWhite : "oklch(65% 0.01 80)", letterSpacing: "0.06em", borderRadius: 4 }}
              >
                {t("Build My Prayer Architecture", "Bangun Arsitektur Doa Saya")}
              </button>
            </div>
          </div>
        ) : (
          /* Architecture Summary Card */
          <div style={{ background: navy, padding: "48px 40px", borderRadius: 4 }}>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 32 }}>
              {t("Your Prayer Architecture", "Arsitektur Doa Anda")}
            </p>

            {/* Daily Anchor */}
            <div style={{ marginBottom: 32 }}>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: "oklch(65% 0.03 80)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                {t("Daily Anchor", "Jangkar Harian")}
              </p>
              <p style={{ fontFamily: serif, fontSize: "clamp(18px, 2.2vw, 22px)", color: offWhite, lineHeight: 1.6, margin: 0 }}>
                {dailyTime} &mdash; {dailyPractice}
              </p>
            </div>

            <div style={{ height: 1, background: "oklch(35% 0.06 260)", marginBottom: 32 }} />

            {/* Weekly Review */}
            <div style={{ marginBottom: 32 }}>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: "oklch(65% 0.03 80)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                {t("Weekly Review", "Tinjauan Mingguan")}
              </p>
              <p style={{ fontFamily: serif, fontSize: "clamp(18px, 2.2vw, 22px)", color: offWhite, lineHeight: 1.6, marginBottom: 12 }}>
                {weeklyDay} &mdash; {weeklyDuration}
              </p>
              <p style={{ fontFamily: serif, fontSize: "clamp(15px, 1.7vw, 17px)", color: "oklch(76% 0.03 80)", lineHeight: 1.75, fontStyle: "italic", margin: 0 }}>
                "{weeklyPrompt}"
              </p>
            </div>

            <div style={{ height: 1, background: "oklch(35% 0.06 260)", marginBottom: 32 }} />

            {/* Annual Retreat */}
            <div style={{ marginBottom: 40 }}>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: "oklch(65% 0.03 80)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                {t("Annual Retreat", "Retret Tahunan")}
              </p>
              <p style={{ fontFamily: serif, fontSize: "clamp(18px, 2.2vw, 22px)", color: offWhite, lineHeight: 1.6, marginBottom: 12 }}>
                {annualSeason} &mdash; {annualDuration}
              </p>
              <p style={{ fontFamily: serif, fontSize: "clamp(15px, 1.7vw, 17px)", color: "oklch(76% 0.03 80)", lineHeight: 1.75, margin: 0 }}>
                {t("Accountability:", "Akuntabilitas:")} <span style={{ color: offWhite }}>{accountablePerson}</span>
              </p>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={handleCopy}
                style={{ padding: "12px 28px", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, background: copied ? "oklch(35% 0.05 260)" : orange, color: offWhite, letterSpacing: "0.04em", borderRadius: 4 }}
              >
                {copied
                  ? t("Copied!", "Tersalin!")
                  : t("Copy to Clipboard", "Salin ke Clipboard")}
              </button>
              <button
                onClick={() => setArchitectureComplete(false)}
                style={{ padding: "12px 28px", border: "1px solid oklch(45% 0.05 260)", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, background: "transparent", color: "oklch(76% 0.03 80)", letterSpacing: "0.04em", borderRadius: 4 }}
              >
                {t("Edit", "Edit")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ background: navy, padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 700, color: offWhite, marginBottom: 16, fontStyle: "italic" }}>
          {t("Keep Growing", "Terus Bertumbuh")}
        </h2>
        <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: "oklch(76% 0.03 80)", lineHeight: 1.75, maxWidth: 520, margin: "0 auto 40px" }}>
          {t(
            "Explore more training modules to deepen your cross-cultural leadership.",
            "Jelajahi lebih banyak modul pelatihan untuk memperdalam kepemimpinan lintas budaya Anda."
          )}
        </p>
        <Link
          href="/resources"
          style={{ display: "inline-block", padding: "14px 36px", background: orange, color: offWhite, fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, textDecoration: "none", borderRadius: 4, letterSpacing: "0.04em" }}
        >
          {t("Training", "Pelatihan")}
        </Link>
      </div>
    </div>
  );
}
