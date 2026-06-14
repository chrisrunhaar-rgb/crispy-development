"use client";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id";

const PORTRAITS = [
  {
    en_title: "Abraham",
    id_title: "Abraham",
    en_body:
      "He heard: go. He did not hear: where. He packed and left anyway. The destination was revealed in the walking.",
    id_body:
      "Ia mendengar: pergi. Ia tidak mendengar: ke mana. Ia berkemas dan pergi. Tujuan diungkapkan dalam perjalanan.",
  },
  {
    en_title: "Moses",
    id_title: "Musa",
    en_body:
      "The burning bush gave him a commission, not a project plan. He asked for clarity. God gave him a next step and a companion. The rest came as he walked into it.",
    id_body:
      "Semak yang terbakar memberinya misi, bukan rencana proyek. Ia meminta kejelasan. Allah memberinya langkah berikutnya dan seorang pendamping. Sisanya datang saat ia melangkah masuk.",
  },
  {
    en_title: "Mary",
    id_title: "Maria",
    en_body:
      "The angel announced a pregnancy, not a parenting manual. She said yes without knowing the full shape of what she was agreeing to. Her yes preceded her understanding.",
    id_body:
      "Malaikat mengumumkan kehamilan, bukan panduan pengasuhan. Ia berkata ya tanpa mengetahui bentuk penuh dari apa yang ia setujui. Ya-nya mendahului pemahamannya.",
  },
];

const SECTIONS = [
  {
    num: "I",
    en_label: "Roadmap vs Compass",
    id_label: "Peta Jalan vs Kompas",
    en_heading: "God Works Directionally",
    id_heading: "Allah Bekerja Secara Terarah",
    en_body:
      "Planning cultures demand full sightlines before the first step. God does not work that way. He gives direction, not detail. He points toward something rather than mapping the entire route. This is not a design flaw in how he operates. It is the design.",
    id_body:
      "Budaya perencanaan menuntut pandangan penuh sebelum langkah pertama. Allah tidak bekerja seperti itu. Ia memberi arah, bukan detail. Ia menunjuk ke sesuatu daripada memetakan seluruh rute. Ini bukan cacat desain dalam cara Ia beroperasi. Ini adalah desainnya.",
  },
  {
    num: "II",
    en_label: "Incremental Revelation",
    id_label: "Wahyu Bertahap",
    en_heading: "Direction Before Detail",
    id_heading: "Arah Sebelum Detail",
    en_body:
      "Abraham, Moses, Mary. None received the full picture before they moved. The pattern across Scripture is consistent: God gives enough to take the next step, and the step itself opens what comes after. Direction before detail. Movement before map.",
    id_body:
      "Abraham, Musa, Maria. Tidak ada yang menerima gambaran lengkap sebelum mereka bergerak. Pola di seluruh Alkitab konsisten: Allah memberikan cukup untuk mengambil langkah berikutnya, dan langkah itu sendiri membuka apa yang datang setelahnya. Arah sebelum detail. Gerakan sebelum peta.",
  },
  {
    num: "III",
    en_label: "Moving Before Clarity",
    id_label: "Bergerak Sebelum Kejelasan",
    en_heading: "Obedience Before Understanding",
    id_heading: "Ketaatan Sebelum Pemahaman",
    en_body:
      "Exodus 24:7: \"We will do, then we will understand.\" Israel did not wait for full comprehension before committing. Obedience precedes comprehension across Scripture. Not blind obedience, but action before full visibility. The doing produces the understanding.",
    id_body:
      "Keluaran 24:7: \"Kami akan melakukan, lalu kami akan memahami.\" Israel tidak menunggu pemahaman penuh sebelum berkomitmen. Ketaatan mendahului pemahaman di seluruh Alkitab. Bukan ketaatan buta, tetapi tindakan sebelum visibilitas penuh. Melakukan menghasilkan pemahaman.",
  },
  {
    num: "IV",
    en_label: "When Fog Is a Gift",
    id_label: "Ketika Kabut Adalah Karunia",
    en_heading: "Uncertainty as Invitation",
    id_heading: "Ketidakpastian sebagai Undangan",
    en_body:
      "Uncertainty is not God's silence. It is his invitation to trust rather than manage outcomes. The fog keeps us dependent, attentive, and moving in the right posture. A God who gave you the full plan would give you far less than a God who walks with you through each unknown step.",
    id_body:
      "Ketidakpastian bukanlah keheningan Allah. Itu adalah undangan-Nya untuk percaya daripada mengelola hasil. Kabut membuat kita bergantung, waspada, dan bergerak dalam sikap yang benar. Allah yang memberimu rencana penuh akan memberimu jauh lebih sedikit daripada Allah yang berjalan bersamamu melalui setiap langkah yang tidak diketahui.",
  },
];

type Props = { userPathway?: string | null; isSaved: boolean };

export default function CalledWithoutMapClient({ isSaved: initialSaved }: Props) {
  const { lang: ctxLang } = useLanguage();
  const lang = ctxLang === "id" ? "id" : "en";

  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  // Reflection tool state
  const [whatIKnow, setWhatIKnow] = useState("");
  const [waitingFor, setWaitingFor] = useState("");
  const [nextStep, setNextStep] = useState("");
  const showThirdPrompt = whatIKnow.trim().length > 0 && waitingFor.trim().length > 0;
  const showAnchor = showThirdPrompt && nextStep.trim().length > 0;

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("called-without-the-map");
      setSaved(true);
    });
  }

  function handleClear() {
    setWhatIKnow("");
    setWaitingFor("");
    setNextStep("");
  }

  function t(en: string, id: string) {
    return lang === "id" ? id : en;
  }

  const navy = "oklch(22% 0.10 260)";
  const orange = "oklch(65% 0.15 45)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const bodyText = "oklch(38% 0.05 260)";
  const serif = "var(--font-cormorant, Cormorant Garamond, Georgia, serif)";

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>
      <LangToggle />

      {/* Slow reading notice */}
      <div style={{ background: "oklch(94% 0.012 65)", borderBottom: "1px solid oklch(88% 0.02 65)", padding: "12px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "oklch(42% 0.08 50)", fontStyle: "italic", margin: 0 }}>
          {t(
            "This module is designed to be read slowly. Set aside 15 minutes and give it your full attention.",
            "Modul ini dirancang untuk dibaca dengan perlahan. Sisihkan 15 menit dan berikan perhatian penuh Anda."
          )}
        </p>
      </div>

      {/* Hero */}
      <div style={{ background: navy, padding: "88px 24px 80px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {t("Faith & Calling — Guide", "Iman & Panggilan — Panduan")}
          </p>
          <h1 style={{ fontFamily: serif, fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, color: offWhite, margin: "0 0 24px", lineHeight: 1.08 }}>
            {t("Called Without the Map", "Dipanggil Tanpa Peta")}
          </h1>
          <div style={{ width: 48, height: 1, background: orange, margin: "0 auto 32px" }} />
          <p style={{ fontFamily: serif, fontSize: "clamp(19px, 2.5vw, 23px)", color: "oklch(82% 0.025 80)", lineHeight: 1.75, marginBottom: 40, fontStyle: "italic" }}>
            {t(
              "Go to the land that I will show you.",
              "Pergilah ke negeri yang akan Kutunjukkan kepadamu."
            )}
          </p>
          <p style={{ fontSize: 13, color: orange, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 48 }}>
            {t("Genesis 12:1 (NIV)", "Kejadian 12:1 (TB)")}
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
      <div style={{ padding: "72px 24px 56px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: "clamp(18px, 2.2vw, 22px)", color: bodyText, lineHeight: 1.9, fontStyle: "italic", borderLeft: `3px solid ${orange}`, paddingLeft: 28, marginBottom: 0 }}>
          {t(
            "You have been sitting with a decision for months. You have prayed. Scripture has not given you a full plan. It never does. This module is not about making the decision easier. It is about understanding why God works this way, and why that is actually good news.",
            "Anda telah duduk dengan sebuah keputusan selama berbulan-bulan. Anda telah berdoa. Alkitab tidak memberi Anda rencana penuh. Memang tidak pernah. Modul ini bukan tentang membuat keputusan menjadi lebih mudah. Ini tentang memahami mengapa Allah bekerja seperti ini, dan mengapa itu sebenarnya kabar baik."
          )}
        </p>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: "oklch(90% 0.008 80)" }} />
      </div>

      {/* Sections I-IV */}
      {SECTIONS.map((s, idx) => (
        <div key={s.num}>
          <div style={{ padding: "80px 24px", maxWidth: 720, margin: "0 auto" }}>
            <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 12 }}>
              {s.num}. {lang === "id" ? s.id_label : s.en_label}
            </p>
            <h2 style={{ fontFamily: serif, fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 700, color: navy, marginBottom: 32, lineHeight: 1.2, fontStyle: "italic" }}>
              {lang === "id" ? s.id_heading : s.en_heading}
            </h2>
            <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9, margin: 0 }}>
              {lang === "id" ? s.id_body : s.en_body}
            </p>
          </div>
          {idx < SECTIONS.length - 1 && (
            <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
              <div style={{ height: 1, background: "oklch(90% 0.008 80)" }} />
            </div>
          )}
        </div>
      ))}

      {/* Portrait cards */}
      <div style={{ background: lightGray, padding: "96px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
            {t("V. Three Portraits", "V. Tiga Potret")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 700, color: navy, marginBottom: 20, lineHeight: 1.2, fontStyle: "italic" }}>
            {t("They Moved Before They Knew", "Mereka Bergerak Sebelum Mereka Tahu")}
          </h2>
          <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)", color: bodyText, lineHeight: 1.85, marginBottom: 64 }}>
            {t(
              "The people God used most were not the ones with the clearest plans. They were the ones who trusted a clear enough direction.",
              "Orang-orang yang paling dipakai Allah bukan yang memiliki rencana paling jelas. Mereka adalah orang-orang yang mempercayai arah yang cukup jelas."
            )}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
            {PORTRAITS.map((p, i) => (
              <div key={i}>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 style={{ fontFamily: serif, fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 700, color: navy, marginBottom: 16, fontStyle: "italic", lineHeight: 1.3 }}>
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

      {/* Divider */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: "oklch(90% 0.008 80)" }} />
      </div>

      {/* Interactive Reflection Tool */}
      <div style={{ padding: "96px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
          {t("VI. This Week", "VI. Minggu Ini")}
        </p>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 700, color: navy, marginBottom: 20, lineHeight: 1.2, fontStyle: "italic" }}>
          {t("Name What You Already Know", "Namai Apa yang Sudah Anda Ketahui")}
        </h2>
        <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)", color: bodyText, lineHeight: 1.85, marginBottom: 56 }}>
          {t(
            "Name one decision you have been deferring while waiting for clarity. Work through the two columns below. Then name your next step.",
            "Namai satu keputusan yang telah Anda tunda sambil menunggu kejelasan. Kerjakan dua kolom di bawah ini. Kemudian namai langkah berikutnya."
          )}
        </p>

        {/* Two-column tool */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
          <div>
            <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
              {t("What I Know", "Yang Saya Ketahui")}
            </label>
            <textarea
              value={whatIKnow}
              onChange={(e) => setWhatIKnow(e.target.value)}
              placeholder={t(
                "What do you already sense is true about this decision?",
                "Apa yang sudah Anda rasakan benar tentang keputusan ini?"
              )}
              rows={6}
              style={{ width: "100%", padding: "16px 18px", fontFamily: serif, fontSize: "clamp(15px, 1.6vw, 17px)", color: bodyText, background: offWhite, border: `1px solid oklch(88% 0.01 80)`, borderRadius: 4, resize: "vertical", lineHeight: 1.75, boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
              {t("What I'm Waiting For", "Yang Saya Tunggu")}
            </label>
            <textarea
              value={waitingFor}
              onChange={(e) => setWaitingFor(e.target.value)}
              placeholder={t(
                "What are you waiting for before you act?",
                "Apa yang Anda tunggu sebelum bertindak?"
              )}
              rows={6}
              style={{ width: "100%", padding: "16px 18px", fontFamily: serif, fontSize: "clamp(15px, 1.6vw, 17px)", color: bodyText, background: offWhite, border: `1px solid oklch(88% 0.01 80)`, borderRadius: 4, resize: "vertical", lineHeight: 1.75, boxSizing: "border-box" }}
            />
          </div>
        </div>

        {/* Third prompt — appears when both columns have text */}
        {showThirdPrompt && (
          <div style={{ marginBottom: 32 }}>
            <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
              {t("One Step I Can Take This Week", "Satu Langkah yang Dapat Saya Ambil Minggu Ini")}
            </label>
            <textarea
              value={nextStep}
              onChange={(e) => setNextStep(e.target.value)}
              placeholder={t(
                "What is the next step you already know?",
                "Apa langkah berikutnya yang sudah Anda ketahui?"
              )}
              rows={4}
              style={{ width: "100%", padding: "16px 18px", fontFamily: serif, fontSize: "clamp(15px, 1.6vw, 17px)", color: bodyText, background: offWhite, border: `1px solid oklch(88% 0.01 80)`, borderRadius: 4, resize: "vertical", lineHeight: 1.75, boxSizing: "border-box" }}
            />
          </div>
        )}

        {/* Clear button */}
        {(whatIKnow || waitingFor || nextStep) && (
          <div style={{ marginBottom: 40 }}>
            <button
              onClick={handleClear}
              style={{ padding: "10px 22px", border: `1px solid oklch(88% 0.01 80)`, background: "transparent", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: bodyText, letterSpacing: "0.06em", borderRadius: 4 }}
            >
              {t("Clear", "Hapus")}
            </button>
          </div>
        )}

        {/* Faith anchor verse — appears when all three inputs have text */}
        {showAnchor && (
          <div style={{ background: navy, borderRadius: 4, padding: "44px 40px" }}>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 24 }}>
              {t("Faith Anchor", "Jangkar Iman")}
            </p>
            <p style={{ fontFamily: serif, fontSize: "clamp(20px, 2.5vw, 26px)", fontStyle: "italic", color: offWhite, lineHeight: 1.75, marginBottom: 20 }}>
              {t(
                '"Go to the land that I will show you."',
                '"Pergilah ke negeri yang akan Kutunjukkan kepadamu."'
              )}
            </p>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em", marginBottom: 28 }}>
              {t("Genesis 12:1 (NIV)", "Kejadian 12:1 (TB)")}
            </p>
            <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)", color: "oklch(76% 0.03 80)", lineHeight: 1.85, margin: 0 }}>
              {t(
                "God called Abraham to move before the destination was named. The direction was real. The map was not yet drawn. You are in good company.",
                "Allah memanggil Abraham untuk bergerak sebelum tujuan disebutkan. Arahnya nyata. Petanya belum tergambar. Anda berada dalam persekutuan yang baik."
              )}
            </p>
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
