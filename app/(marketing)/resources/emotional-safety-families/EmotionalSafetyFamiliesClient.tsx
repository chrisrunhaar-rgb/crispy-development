"use client";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id";
const tFn = (en: string, id: string, lang: Lang) =>
  lang === "en" ? en : id;

// -- VERSE DATA ----------------------------------------------------------------

const VERSES = {
  "deut-6-6-7": {
    en_ref: "Deuteronomy 6:6—7",
    id_ref: "Ulangan 6:6—7",
    en: "These commandments that I give you today are to be on your hearts. Impress them on your children. Talk about them when you sit at home and when you walk along the road, when you lie down and when you get up.",
    id: "Apa yang kuperintahkan kepadamu pada hari ini haruslah engkau perhatikan, haruslah engkau mengajarkannya berulang-ulang kepada anak-anakmu dan membicarakannya apabila engkau duduk di rumahmu, apabila engkau sedang dalam perjalanan, apabila engkau berbaring dan apabila engkau bangun.",
  },
  "mark-10-14": {
    en_ref: "Mark 10:14",
    id_ref: "Markus 10:14",
    en: "Let the little children come to me, and do not hinder them, for the kingdom of God belongs to such as these.",
    id: "Biarkanlah anak-anak itu datang kepada-Ku, jangan menghalang-halangi mereka, sebab orang-orang yang seperti itulah yang empunya Kerajaan Allah.",
  },
  "prov-22-6": {
    en_ref: "Proverbs 22:6",
    id_ref: "Amsal 22:6",
    en: "Start children off on the way they should go, and even when they are old they will not turn from it.",
    id: "Didiklah orang muda menurut jalan yang patut baginya, maka pada masa tuanya pun ia tidak akan menyimpang dari pada jalan itu.",
  },
};

// -- SAFETY MARKERS ------------------------------------------------------------

const SAFETY_MARKERS = [
  {
    en_label: "Predictability",
    id_label: "Kemampuan Diprediksi",
    en_desc:
      "Children feel safe when they know what to expect from the adults in their lives. Consistent routines, reliable responses, and emotional steadiness signal: this home is trustworthy.",
    id_desc:
      "Anak-anak merasa aman ketika mereka tahu apa yang bisa diharapkan dari orang dewasa di sekitar mereka. Rutinitas yang konsisten, respons yang dapat diandalkan, dan kestabilan emosional memberi sinyal: rumah ini dapat dipercaya.",
    en_practice:
      "In practice: dinner at roughly the same time. A bedtime ritual that doesn't change when ministry is busy. A phrase you reliably say when leaving and returning.",
    id_practice:
      "Dalam praktik: makan malam pada waktu yang kurang lebih sama. Ritual tidur yang tidak berubah saat pelayanan sedang sibuk. Ungkapan yang selalu Anda ucapkan saat pergi dan kembali.",
    icon: "?",
  },
  {
    en_label: "Responsiveness",
    id_label: "Ketanggapan",
    en_desc:
      "When a child reaches out — through words, behaviour, tears, or silence — the question they are asking is: do you notice me? A responsive parent doesn't fix everything; they turn toward the child first.",
    id_desc:
      "Ketika seorang anak menjangkau — melalui kata-kata, perilaku, air mata, atau diam — pertanyaan yang mereka ajukan adalah: apakah kamu memperhatikanku? Orang tua yang tanggap tidak memperbaiki segalanya; mereka berpaling kepada anak terlebih dahulu.",
    en_practice:
      "In practice: put the phone face-down. Ask one more question before moving on. When a child is upset, name the feeling before explaining why they shouldn't have it.",
    id_practice:
      "Dalam praktik: letakkan telepon dengan layar menghadap ke bawah. Ajukan satu pertanyaan lagi sebelum melanjutkan. Ketika anak sedang kesal, namai perasaannya sebelum menjelaskan mengapa mereka seharusnya tidak memilikinya.",
    icon: "?",
  },
  {
    en_label: "Repair",
    id_label: "Pemulihan",
    en_desc:
      "No family is without rupture. The question is not whether conflict, harshness, or disconnection happen — it's whether they get repaired. A repaired rupture actually deepens trust more than if the rupture never happened.",
    id_desc:
      "Tidak ada keluarga yang tanpa konflik. Pertanyaannya bukan apakah konflik, ketidakramahan, atau pemutusan hubungan terjadi — melainkan apakah hal-hal itu diperbaiki. Hubungan yang dipulihkan justru memperdalam kepercayaan lebih dari seandainya keretakan itu tidak pernah terjadi.",
    en_practice:
      "In practice: go back after the difficult moment and name it. \"I was too sharp earlier. That wasn't fair. I'm sorry.\" This is not weakness — it is the most powerful thing a parent can model.",
    id_practice:
      "Dalam praktik: kembali setelah momen yang sulit dan sebutkan. \"Tadi aku terlalu keras. Itu tidak adil. Aku minta maaf.\" Ini bukan kelemahan — ini adalah hal paling kuat yang bisa dicontohkan orang tua.",
    icon: "?",
  },
  {
    en_label: "Permission to Feel",
    id_label: "Izin untuk Merasakan",
    en_desc:
      "Children in ministry families often learn quickly which emotions are acceptable and which ones create anxiety in the adults around them. Emotional safety means every feeling has permission to exist — even the inconvenient ones.",
    id_desc:
      "Anak-anak dalam keluarga pelayanan sering belajar dengan cepat emosi mana yang dapat diterima dan mana yang menciptakan kegelisahan pada orang dewasa di sekitar mereka. Keamanan emosional berarti setiap perasaan memiliki izin untuk ada — bahkan yang tidak nyaman.",
    en_practice:
      "In practice: replace \"Don't be upset about that\" with \"It makes sense you feel that way.\" Your child's emotions don't need to be managed away — they need to be witnessed.",
    id_practice:
      "Dalam praktik: ganti \"Jangan kesal tentang hal itu\" dengan \"Masuk akal kamu merasakan itu.\" Emosi anak Anda tidak perlu dikelola menjadi hilang — mereka perlu disaksikan.",
    icon: "?",
  },
];

// -- REPAIR CONVERSATION -------------------------------------------------------

const REPAIR_STEPS = [
  {
    en_label: "Acknowledge",
    id_label: "Pengakuan",
    en_desc:
      "Name specifically what happened — not a vague apology, but an honest account of what the child experienced.",
    id_desc:
      "Sebutkan secara spesifik apa yang terjadi — bukan permintaan maaf yang samar, tetapi penggambaran jujur tentang apa yang dialami anak.",
    en_example:
      "\"Earlier tonight I raised my voice when you were trying to tell me something. That was wrong of me. You were talking and I cut you off.\"",
    id_example:
      "\"Tadi malam aku meninggikan suara ketika kamu sedang mencoba menceritakan sesuatu. Itu salah dariku. Kamu sedang berbicara dan aku memotongmu.\"",
  },
  {
    en_label: "Apologise",
    id_label: "Maaf",
    en_desc:
      "A clean apology — no \"I'm sorry, but.\" No explanation that shifts the blame back. Just the apology itself.",
    id_desc:
      "Permintaan maaf yang bersih — tidak ada \"Aku minta maaf, tapi.\" Tidak ada penjelasan yang mengalihkan kesalahan kembali. Hanya permintaan maaf itu sendiri.",
    en_example:
      "\"I'm sorry. You didn't deserve that. I was stressed and I took it out on you, and that wasn't okay.\"",
    id_example:
      "\"Aku minta maaf. Kamu tidak layak mendapatkan itu. Aku sedang stres dan melampiaskannya kepadamu, dan itu tidak baik.\"",
  },
  {
    en_label: "Reconnect",
    id_label: "Pemulihan Hubungan",
    en_desc:
      "Close the gap with something warm — physical or relational. The repair isn't complete until connection is restored.",
    id_desc:
      "Tutup kesenjangan dengan sesuatu yang hangat — fisik atau relasional. Pemulihan tidak selesai sampai koneksi dipulihkan.",
    en_example:
      "\"Can I have a hug? I love you. And I want to hear what you were trying to tell me — I'm listening now.\"",
    id_example:
      "\"Boleh aku peluk? Aku menyayangimu. Dan aku ingin mendengar apa yang ingin kamu ceritakan — aku mendengarkan sekarang.\"",
  },
];

// -- TCK NEEDS -----------------------------------------------------------------

const TCK_NEEDS = [
  {
    en_title: "Stability in a Person, Not a Place",
    id_title: "Stabilitas dalam Seseorang, Bukan Tempat",
    en_body:
      "TCKs rarely have one stable home, neighbourhood, or school. What they can have is a stable parent. The most consistent thing in their world needs to be you — your warmth, your availability, your emotional steadiness across every transition.",
    id_body:
      "Anak-anak lintas budaya jarang memiliki satu rumah, lingkungan, atau sekolah yang stabil. Yang bisa mereka miliki adalah orang tua yang stabil. Hal paling konsisten di dunia mereka perlu menjadi kamu — kehangatan, ketersediaan, dan kestabilan emosionalmu di setiap transisi.",
  },
  {
    en_title: "A Shared Language for Loss",
    id_title: "Bahasa Bersama untuk Kehilangan",
    en_body:
      "Every international move carries accumulated losses — friends left behind, the school that finally felt familiar, a language that's fading, a version of themselves that fit somewhere and no longer does. These losses are real but often unspoken. Families who name them together grieve together. Families who don't carry the weight separately.",
    id_body:
      "Setiap perpindahan internasional membawa kehilangan yang menumpuk — teman-teman yang ditinggalkan, sekolah yang akhirnya terasa familiar, bahasa yang memudar, versi diri yang cocok di suatu tempat dan tidak lagi demikian. Kehilangan-kehilangan ini nyata tetapi sering tidak diucapkan. Keluarga yang menamai mereka bersama berduka bersama. Keluarga yang tidak menanggung beban secara terpisah.",
  },
  {
    en_title: "Bridges Between Worlds",
    id_title: "Jembatan Antar Dunia",
    en_body:
      "A TCK lives in multiple cultural worlds simultaneously and often belongs fully to none of them. What they need is a parent who helps them hold multiple identities with pride rather than confusion — someone who says: all of who you are is valid, and we will figure out where you belong together.",
    id_body:
      "Seorang anak lintas budaya hidup dalam beberapa dunia budaya secara bersamaan dan sering tidak sepenuhnya termasuk dalam satupun. Yang mereka butuhkan adalah orang tua yang membantu mereka memegang berbagai identitas dengan bangga daripada kebingungan — seseorang yang berkata: semua yang kamu miliki itu valid, dan kita akan mencari tahu di mana kamu termasuk bersama-sama.",
  },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function EmotionalSafetyFamiliesClient({
  userPathway,
  isSaved: initialSaved,
}: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  const [commitment, setCommitment] = useState("");
  const [committed, setCommitted] = useState(false);
  const [expandedRepair, setExpandedRepair] = useState<number | null>(null);

  const t = (en: string, id: string) => tFn(en, id, lang);

  const navy = "oklch(22% 0.10 260)";
  const orange = "oklch(65% 0.15 45)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const bodyText = "oklch(38% 0.05 260)";
  const serif = "var(--font-cormorant, Cormorant Garamond, Georgia, serif)";

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("emotional-safety-families");
      setSaved(true);
    });
  }

  function VerseRef({
    id,
    children,
  }: {
    id: string;
    children: React.ReactNode;
  }) {
    return (
      <button
        onClick={() => setActiveVerse(id)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: orange,
          fontWeight: 700,
          fontFamily: "Montserrat, sans-serif",
          fontSize: "inherit",
          padding: 0,
          textDecoration: "underline dotted",
          textUnderlineOffset: 3,
        }}
      >
        {children}
      </button>
    );
  }

  const verseData = activeVerse
    ? VERSES[activeVerse as keyof typeof VERSES]
    : null;

  return (
    <div
      style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}
    >
      <LangToggle />
      {/* Language bar */}

      {/* Hero */}
      <div style={{ background: navy, padding: "96px 24px 88px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p
            style={{
              color: orange,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            {t(
              "Resilience & Family — Guide",
            )}
          </p>
          <h1
            style={{
              fontFamily: serif,
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 600,
              color: offWhite,
              margin: "0 0 24px",
              lineHeight: 1.08,
            }}
          >
            {t(
              "Emotional Safety for Families",
            )}
          </h1>
          <div
            style={{ width: 48, height: 1, background: orange, margin: "0 auto 36px" }}
          />
          <p
            style={{
              fontFamily: serif,
              fontSize: "clamp(16px, 2vw, 19px)",
              color: "oklch(82% 0.025 80)",
              lineHeight: 1.65,
              maxWidth: 580,
              margin: "0 0 16px",
            }}
          >
            {t(
              "Your children don't need a perfect family.",
            )}
          </p>
          <p
            style={{
              fontFamily: serif,
              fontSize: "clamp(16px, 2vw, 19px)",
              color: offWhite,
              lineHeight: 1.65,
              maxWidth: 580,
              margin: "0 0 48px",
              fontWeight: 700,
            }}
          >
            {t(
              "They need an emotionally safe one.",
            )}
          </p>
          <div
            style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
          >
            <button
              onClick={handleSave}
              disabled={saved || isPending}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: saved ? "oklch(35% 0.08 260)" : "transparent",
                color: "oklch(75% 0.04 260)",
                padding: "14px 28px", borderRadius: 12, fontWeight: 600, fontSize: 14,
                border: "1px solid oklch(42% 0.08 260)", cursor: saved ? "default" : "pointer",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
              {saved
                ? t("Saved to Dashboard", "Tersimpan di Dashboard", "Opgeslagen in Dashboard")
                : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
            </button>
          </div>
        </div>
      </div>

      {/* Section I — The Honest Gap */}
      <div style={{ padding: "96px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: serif,
            fontSize: 11,
            fontWeight: 400,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: orange,
            marginBottom: 32,
          }}
        >
          {t("I. The Honest Starting Point", "I. Titik Awal yang Jujur", "I. Het Eerlijke Vertrekpunt")}
        </p>
        <h2
          style={{
            fontFamily: serif,
            fontSize: "clamp(28px, 3.5vw, 40px)",
            fontWeight: 700,
            color: navy,
            marginBottom: 40,
            lineHeight: 1.2,
            fontStyle: "italic",
          }}
        >
          {t(
            "The Gap Between the Image and the Reality",
          )}
        </h2>
        <div
          style={{
            fontFamily: serif,
            fontSize: "clamp(17px, 2vw, 20px)",
            color: bodyText,
            lineHeight: 1.9,
          }}
        >
          <p style={{ marginBottom: 28 }}>
            {t(
              "There is an image many ministry families carry — consciously or not — of what a godly home looks like. Calm. Spiritually ordered. Children who are resilient and grateful because they've been given a life of purpose. A family that proves, by its togetherness, that the work is worth it.",
            )}
          </p>
          <p style={{ marginBottom: 28 }}>
            {t(
              "Then there is the reality. The parent who snaps after a long day of caring for others. The child who has moved four times and quietly stopped attaching to new friends. The family dinner that gets cancelled again for an urgent prayer request. The child who knows their parent's phone buzzes more than they get eye contact.",
            )}
          </p>
          <p style={{ marginBottom: 28 }}>
            {t(
              "This module is not about guilt. It is about the gap — and what fills it. Research on missionary kids (MKs) and third culture kids (TCKs) is clear: children raised in cross-cultural ministry contexts carry unique strengths, and unique vulnerabilities. MKs are twice as likely as non-TCK peers to report growing up with a parent struggling with mental health. Parental stress doesn't stay with the parent. It travels.",
            )}
          </p>
          <div
            style={{
              fontFamily: serif,
              fontSize: "clamp(19px, 2.2vw, 24px)",
              fontStyle: "italic",
              color: navy,
              lineHeight: 1.75,
              padding: "8px 0 8px 28px",
              borderLeft: `3px solid ${orange}`,
              marginBottom: 28,
            }}
          >
            {t(
              "Emotional safety is not the absence of hard things. It is the presence of someone who stays steady through them — and who comes back after they don't.",
            )}
          </div>
          <p style={{ marginBottom: 0 }}>
            {t(
              "The good news is this: you don't need to be perfect to give your children emotional safety. You need to be present, honest, and willing to repair. That is something every parent — no matter how demanding the mission — can choose.",
            )}
          </p>
        </div>
      </div>

      {/* Section II — Four Markers */}
      <div style={{ background: lightGray, padding: "96px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: serif,
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: orange,
              marginBottom: 32,
            }}
          >
            {t(
              "II. What Emotional Safety Actually Means",
            )}
          </p>
          <h2
            style={{
              fontFamily: serif,
              fontSize: "clamp(28px, 3.5vw, 40px)",
              fontWeight: 700,
              color: navy,
              marginBottom: 20,
              lineHeight: 1.2,
              fontStyle: "italic",
            }}
          >
            {t("Four Markers", "Empat Penanda", "Vier Kenmerken")}
          </h2>
          <p
            style={{
              fontFamily: serif,
              fontSize: "clamp(16px, 1.8vw, 19px)",
              color: bodyText,
              lineHeight: 1.85,
              marginBottom: 64,
            }}
          >
            {t(
              "Emotional safety is not a feeling you create by trying harder. It is built through specific, repeatable behaviours. These four markers define what it looks like — and what you can actually practise.",
            )}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
            {SAFETY_MARKERS.map((marker, i) => (
              <div
                key={i}
                style={{
                  background: offWhite,
                  borderRadius: 8,
                  padding: "40px 40px 36px",
                  borderLeft: `4px solid ${orange}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 20,
                    marginBottom: 20,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: 28,
                      color: orange,
                      lineHeight: 1,
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {marker.icon}
                  </span>
                  <div>
                    <p
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: orange,
                        marginBottom: 8,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3
                      style={{
                        fontFamily: serif,
                        fontSize: "clamp(20px, 2.5vw, 26px)",
                        fontWeight: 700,
                        color: navy,
                        fontStyle: "italic",
                        lineHeight: 1.2,
                        margin: 0,
                      }}
                    >
                      {lang === "en"
                        ? marker.en_label
                        : lang === "id"
                        ? marker.id_label
                        : marker.id_label}
                    </h3>
                  </div>
                </div>
                <p
                  style={{
                    fontFamily: serif,
                    fontSize: "clamp(16px, 1.8vw, 19px)",
                    color: bodyText,
                    lineHeight: 1.85,
                    marginBottom: 20,
                  }}
                >
                  {lang === "en"
                    ? marker.en_desc
                    : lang === "id"
                    ? marker.id_desc
                    : marker.id_desc}
                </p>
                <div
                  style={{
                    background: lightGray,
                    borderRadius: 4,
                    padding: "16px 20px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: 12,
                      fontWeight: 700,
                      color: orange,
                      letterSpacing: "0.08em",
                      marginBottom: 8,
                      textTransform: "uppercase",
                    }}
                  >
                    {t("In Practice", "Dalam Praktik", "In de Praktijk")}
                  </p>
                  <p
                    style={{
                      fontFamily: serif,
                      fontSize: "clamp(15px, 1.6vw, 17px)",
                      color: bodyText,
                      lineHeight: 1.8,
                      margin: 0,
                      fontStyle: "italic",
                    }}
                  >
                    {lang === "en"
                      ? marker.en_practice
                      : lang === "id"
                      ? marker.id_practice
                      : marker.id_practice}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section III — The Stress Transfer */}
      <div style={{ padding: "96px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: serif,
            fontSize: 11,
            fontWeight: 400,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: orange,
            marginBottom: 32,
          }}
        >
          {t("III. The Stress Transfer", "III. Transfer Stres", "III. De Stresoverdracht")}
        </p>
        <h2
          style={{
            fontFamily: serif,
            fontSize: "clamp(28px, 3.5vw, 40px)",
            fontWeight: 700,
            color: navy,
            marginBottom: 40,
            lineHeight: 1.2,
            fontStyle: "italic",
          }}
        >
          {t(
            "How Parental Stress Reaches Children",
          )}
        </h2>
        <div
          style={{
            fontFamily: serif,
            fontSize: "clamp(17px, 2vw, 20px)",
            color: bodyText,
            lineHeight: 1.9,
          }}
        >
          <p style={{ marginBottom: 28 }}>
            {t(
              "Children do not absorb parental stress through lectures or explanations. They absorb it through atmosphere. Through the tension in a voice. Through the quality of attention they receive — or don't. Through whether the person who loves them most seems present or somewhere else entirely.",
            )}
          </p>
          <p style={{ marginBottom: 28 }}>
            {t(
              "This is not a failure of willpower. It is physiology. The human nervous system is wired for co-regulation — children literally borrow calm from the adults around them. When the adults are dysregulated, children feel it before they understand it. They may not be able to name the feeling, but their bodies register it as a signal about the safety of their environment.",
            )}
          </p>

          {/* Research callout */}
          <div
            style={{
              background: "oklch(94% 0.012 260)",
              border: `1px solid oklch(86% 0.02 260)`,
              borderRadius: 8,
              padding: "32px 36px",
              marginBottom: 36,
            }}
          >
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                color: navy,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              {t("Research Finding", "Temuan Penelitian", "Onderzoeksresultaat")}
            </p>
            <p
              style={{
                fontFamily: serif,
                fontSize: "clamp(18px, 2.2vw, 22px)",
                fontStyle: "italic",
                color: navy,
                lineHeight: 1.75,
                marginBottom: 12,
              }}
            >
              {t(
                "MKs — missionary kids and third culture kids raised in cross-cultural ministry — are twice as likely as non-TCK peers to report growing up with a parent struggling with mental health.",
              )}
            </p>
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 12,
                color: bodyText,
                letterSpacing: "0.04em",
                margin: 0,
              }}
            >
              {t(
                "Source: Missionary Kid Research — Interaction International / TCK Research",
              )}
            </p>
          </div>

          <p style={{ marginBottom: 28 }}>
            {t(
              "Then there is the grief tower — the accumulated, often unacknowledged losses that stack up for families in cross-cultural ministry. Every move adds to the tower: friends left behind, schools that finally felt familiar, languages fading, communities that had to be rebuilt from scratch. The grief is real. And in families where there is no shared language for loss, each person carries their tower alone.",
            )}
          </p>
          <p
            style={{
              fontFamily: serif,
              fontSize: "clamp(19px, 2.2vw, 24px)",
              fontStyle: "italic",
              color: navy,
              lineHeight: 1.75,
              padding: "8px 0 8px 28px",
              borderLeft: `3px solid ${orange}`,
            }}
          >
            {t(
              "The most important protective factor for a TCK is not stability of place — it is stability of relationship. The question children are asking is not: where are we? It is: are you still with me?",
            )}
          </p>
        </div>
      </div>

      {/* Section IV — Relational Repair */}
      <div style={{ background: navy, padding: "96px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: serif,
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: orange,
              marginBottom: 32,
            }}
          >
            {t("IV. Relational Repair", "IV. Pemulihan Relasional", "IV. Relationeel Herstel")}
          </p>
          <h2
            style={{
              fontFamily: serif,
              fontSize: "clamp(28px, 3.5vw, 40px)",
              fontWeight: 700,
              color: offWhite,
              marginBottom: 20,
              lineHeight: 1.2,
              fontStyle: "italic",
            }}
          >
            {t(
              "The Most Powerful Thing a Parent Can Do",
            )}
          </h2>
          <p
            style={{
              fontFamily: serif,
              fontSize: "clamp(16px, 1.8vw, 19px)",
              color: "oklch(76% 0.03 80)",
              lineHeight: 1.85,
              marginBottom: 64,
            }}
          >
            {t(
              "You will have bad days. You will snap, disconnect, or be absent in ways you didn't intend. This is not the problem. The problem is when nothing follows. Relational repair — the deliberate act of going back and closing the gap — is what transforms ruptures into deeper trust. Here is a simple, realistic three-part conversation.",
            )}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {REPAIR_STEPS.map((step, i) => {
              const isOpen = expandedRepair === i;
              return (
                <div
                  key={i}
                  style={{
                    background: isOpen
                      ? "oklch(28% 0.09 260)"
                      : "oklch(26% 0.09 260)",
                    borderRadius: 12,
                    overflow: "hidden",
                    transition: "background 0.15s",
                  }}
                >
                  <button
                    onClick={() => setExpandedRepair(isOpen ? null : i)}
                    style={{
                      width: "100%",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "28px 32px",
                      display: "flex",
                      alignItems: "center",
                      gap: 24,
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: serif,
                        fontSize: "clamp(36px, 4vw, 48px)",
                        fontWeight: 700,
                        color: orange,
                        lineHeight: 1,
                        minWidth: 40,
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          fontSize: 11,
                          fontWeight: 700,
                          color: orange,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          marginBottom: 6,
                        }}
                      >
                        {lang === "en"
                          ? step.en_label
                          : lang === "id"
                          ? step.id_label
                          : step.id_label}
                      </p>
                      <p
                        style={{
                          fontFamily: serif,
                          fontSize: "clamp(15px, 1.7vw, 17px)",
                          color: "oklch(82% 0.025 80)",
                          lineHeight: 1.6,
                          margin: 0,
                        }}
                      >
                        {lang === "en"
                          ? step.en_desc
                          : lang === "id"
                          ? step.id_desc
                          : step.id_desc}
                      </p>
                    </div>
                    <span
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: 18,
                        color: orange,
                        flexShrink: 0,
                        transform: isOpen ? "rotate(180deg)" : "none",
                        transition: "transform 0.2s",
                        display: "block",
                      }}
                    >
                      ?
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      style={{
                        padding: "0 32px 32px 96px",
                        borderTop: "1px solid oklch(32% 0.08 260)",
                        paddingTop: 24,
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          fontSize: 11,
                          fontWeight: 700,
                          color: orange,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          marginBottom: 12,
                        }}
                      >
                        {t("Example", "Contoh", "Voorbeeld")}
                      </p>
                      <p
                        style={{
                          fontFamily: serif,
                          fontSize: "clamp(16px, 1.9vw, 20px)",
                          fontStyle: "italic",
                          color: offWhite,
                          lineHeight: 1.8,
                          margin: 0,
                        }}
                      >
                        {lang === "en"
                          ? step.en_example
                          : lang === "id"
                          ? step.id_example
                          : step.id_example}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 56,
              padding: "36px 40px",
              background: "oklch(18% 0.09 260)",
              borderRadius: 12,
            }}
          >
            <p
              style={{
                fontFamily: serif,
                fontSize: "clamp(17px, 2vw, 21px)",
                fontStyle: "italic",
                color: offWhite,
                lineHeight: 1.8,
                marginBottom: 16,
              }}
            >
              {t(
                "When a parent repairs — especially when the parent was clearly in the wrong — it models something extraordinary: that in this family, humility is real, love is unconditional, and the relationship matters more than being right.",
              )}
            </p>
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 12,
                color: orange,
                fontWeight: 700,
                letterSpacing: "0.08em",
                margin: 0,
              }}
            >
              {t(
                "This is not failure modelling. This is faith in action.",
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Section V — TCK Awareness */}
      <div style={{ padding: "96px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: serif,
            fontSize: 11,
            fontWeight: 400,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: orange,
            marginBottom: 32,
          }}
        >
          {t(
            "V. TCK Awareness",
          )}
        </p>
        <h2
          style={{
            fontFamily: serif,
            fontSize: "clamp(28px, 3.5vw, 40px)",
            fontWeight: 700,
            color: navy,
            marginBottom: 20,
            lineHeight: 1.2,
            fontStyle: "italic",
          }}
        >
          {t(
            "What Third Culture Kids Uniquely Need",
          )}
        </h2>
        <p
          style={{
            fontFamily: serif,
            fontSize: "clamp(16px, 1.8vw, 19px)",
            color: bodyText,
            lineHeight: 1.85,
            marginBottom: 64,
          }}
        >
          {t(
            "A third culture kid doesn't fully belong to their passport country, or to any country they've lived in. They belong, most naturally, to a culture of fellow TCKs — and to whatever their parents make of home.",
          )}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {TCK_NEEDS.map((need, i) => (
            <div key={i}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 24,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    fontFamily: serif,
                    fontSize: "clamp(44px, 5vw, 56px)",
                    fontWeight: 700,
                    color: orange,
                    lineHeight: 1,
                    minWidth: 44,
                    flexShrink: 0,
                    marginTop: -4,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: serif,
                      fontSize: "clamp(20px, 2.5vw, 26px)",
                      fontWeight: 700,
                      color: navy,
                      fontStyle: "italic",
                      lineHeight: 1.2,
                      margin: "0 0 16px",
                    }}
                  >
                    {lang === "en"
                      ? need.en_title
                      : lang === "id"
                      ? need.id_title
                      : need.id_title}
                  </h3>
                  <p
                    style={{
                      fontFamily: serif,
                      fontSize: "clamp(16px, 1.8vw, 19px)",
                      color: bodyText,
                      lineHeight: 1.9,
                      margin: 0,
                    }}
                  >
                    {lang === "en"
                      ? need.en_body
                      : lang === "id"
                      ? need.id_body
                      : need.id_body}
                  </p>
                </div>
              </div>
              {i < TCK_NEEDS.length - 1 && (
                <div
                  style={{
                    height: 1,
                    background: "oklch(90% 0.008 80)",
                    marginTop: 48,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section VI — Biblical Foundation */}
      <div style={{ background: lightGray, padding: "96px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: serif,
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: orange,
              marginBottom: 32,
            }}
          >
            {t("VI. Biblical Foundation", "VI. Dasar Alkitab", "VI. Bijbelse Basis")}
          </p>
          <h2
            style={{
              fontFamily: serif,
              fontSize: "clamp(28px, 3.5vw, 40px)",
              fontWeight: 700,
              color: navy,
              marginBottom: 20,
              lineHeight: 1.2,
              fontStyle: "italic",
            }}
          >
            {t(
              "Parenting as a Walk, Not a Performance",
            )}
          </h2>
          <p
            style={{
              fontFamily: serif,
              fontSize: "clamp(16px, 1.8vw, 19px)",
              color: bodyText,
              lineHeight: 1.85,
              marginBottom: 72,
            }}
          >
            {t(
              "The Bible does not present family as a project to optimise or an image to maintain. It presents it as a relationship to inhabit — as you walk, as you sit, as you lie down, as you rise. The ordinary moments are where faith is formed.",
            )}
          </p>

          {/* Deuteronomy 6:6-7 */}
          <div style={{ marginBottom: 64 }}>
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: orange,
                letterSpacing: "0.1em",
                marginBottom: 20,
              }}
            >
              <VerseRef id="deut-6-6-7">
                {t("Deuteronomy 6:6—7", "Ulangan 6:6—7", "Deuteronomium 6:6—7")}
              </VerseRef>
            </p>
            <div
              style={{
                background: offWhite,
                borderRadius: 4,
                padding: "32px 36px",
                marginBottom: 24,
              }}
            >
              <p
                style={{
                  fontFamily: serif,
                  fontSize: "clamp(18px, 2vw, 22px)",
                  fontStyle: "italic",
                  color: navy,
                  lineHeight: 1.75,
                  margin: 0,
                }}
              >
                {t(
                  "\"These commandments that I give you today are to be on your hearts. Impress them on your children. Talk about them when you sit at home and when you walk along the road, when you lie down and when you get up.\"",
                )}
              </p>
            </div>
            <p
              style={{
                fontFamily: serif,
                fontSize: "clamp(16px, 1.8vw, 19px)",
                color: bodyText,
                lineHeight: 1.85,
              }}
            >
              {t(
                "This is not a curriculum. It is a lifestyle. Moses is not describing a devotional programme — he is describing the texture of a home where faith is woven into the ordinary. Sitting together. Walking side by side. The quiet conversations at the end of the day. Faith formation in the Bible happens not primarily in formal teaching moments, but in relational presence. This requires a parent to be there — mentally, emotionally, not just physically.",
              )}
            </p>
          </div>

          {/* Proverbs 22:6 */}
          <div style={{ marginBottom: 64 }}>
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: orange,
                letterSpacing: "0.1em",
                marginBottom: 20,
              }}
            >
              <VerseRef id="prov-22-6">
                {t("Proverbs 22:6", "Amsal 22:6", "Spreuken 22:6")}
              </VerseRef>
            </p>
            <div
              style={{
                background: offWhite,
                borderRadius: 4,
                padding: "32px 36px",
                marginBottom: 24,
              }}
            >
              <p
                style={{
                  fontFamily: serif,
                  fontSize: "clamp(18px, 2vw, 22px)",
                  fontStyle: "italic",
                  color: navy,
                  lineHeight: 1.75,
                  margin: 0,
                }}
              >
                {t(
                  "\"Start children off on the way they should go, and even when they are old they will not turn from it.\"",
                )}
              </p>
            </div>
            <p
              style={{
                fontFamily: serif,
                fontSize: "clamp(16px, 1.8vw, 19px)",
                color: bodyText,
                lineHeight: 1.85,
              }}
            >
              {t(
                "The Hebrew behind \"start children off\" carries the idea of initiating, dedicating — not forcing a path but awakening a child to the path that is theirs. This is not a formula for producing compliant children. It is a call to know your child — their wiring, their way, their particular personhood — and to companion them on it. Emotional safety is the soil in which this knowing grows.",
              )}
            </p>
          </div>

          {/* Mark 10:14 — Jesus and the children */}
          <div style={{ marginBottom: 0 }}>
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: orange,
                letterSpacing: "0.1em",
                marginBottom: 20,
              }}
            >
              <VerseRef id="mark-10-14">
                {t("Mark 10:14", "Markus 10:14", "Marcus 10:14")}
              </VerseRef>
            </p>
            <div
              style={{
                background: offWhite,
                borderRadius: 4,
                padding: "32px 36px",
                marginBottom: 24,
              }}
            >
              <p
                style={{
                  fontFamily: serif,
                  fontSize: "clamp(18px, 2vw, 22px)",
                  fontStyle: "italic",
                  color: navy,
                  lineHeight: 1.75,
                  margin: 0,
                }}
              >
                {t(
                  "\"Let the little children come to me, and do not hinder them, for the kingdom of God belongs to such as these.\"",
                )}
              </p>
            </div>
            <p
              style={{
                fontFamily: serif,
                fontSize: "clamp(16px, 1.8vw, 19px)",
                color: bodyText,
                lineHeight: 1.85,
              }}
            >
              {t(
                "The disciples thought the children were an interruption. Jesus corrected them sharply. In a culture where children had very little social standing, Jesus made room for them — and not merely tolerated their presence but declared them to be the model for entering the Kingdom. Children are not a distraction from ministry. They are not obstacles to the mission. In Jesus's vision, they are the closest thing to what Kingdom life actually looks like.",
              )}
            </p>
          </div>

          {/* Theological summary */}
          <div
            style={{
              marginTop: 56,
              padding: "40px 40px",
              background: navy,
              borderRadius: 12,
            }}
          >
            <p
              style={{
                fontFamily: serif,
                fontSize: "clamp(18px, 2.2vw, 23px)",
                fontStyle: "italic",
                color: offWhite,
                lineHeight: 1.8,
                marginBottom: 16,
              }}
            >
              {t(
                "The family is not a side project of the mission. For many of the people your children will become — the friends they will carry, the leaders they will influence, the faith they will embody — your home is the mission.",
              )}
            </p>
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 12,
                color: orange,
                fontWeight: 700,
                letterSpacing: "0.08em",
                margin: 0,
              }}
            >
              {t(
                "Jesus made room for children. So can you.",
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Section VII — One Commitment */}
      <div style={{ background: navy, padding: "96px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              fontFamily: serif,
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: orange,
              marginBottom: 32,
            }}
          >
            {t("VII. Your Response", "VII. Respons Anda", "VII. Jouw Reactie")}
          </p>
          <h2
            style={{
              fontFamily: serif,
              fontSize: "clamp(26px, 3.5vw, 38px)",
              fontWeight: 700,
              color: offWhite,
              marginBottom: 20,
              lineHeight: 1.2,
              fontStyle: "italic",
            }}
          >
            {t(
              "One Thing This Week",
            )}
          </h2>
          <p
            style={{
              fontFamily: serif,
              fontSize: "clamp(16px, 1.8vw, 19px)",
              color: "oklch(76% 0.03 80)",
              lineHeight: 1.85,
              marginBottom: 16,
            }}
          >
            {t(
              "You don't need to overhaul everything. You need one thing — one concrete, doable act — that moves toward greater emotional safety in your home.",
            )}
          </p>
          <p
            style={{
              fontFamily: serif,
              fontSize: "clamp(16px, 1.8vw, 19px)",
              color: "oklch(76% 0.03 80)",
              lineHeight: 1.85,
              marginBottom: 48,
              fontStyle: "italic",
            }}
          >
            {t(
              "What is one thing you will do this week for emotional safety in your home?",
            )}
          </p>
          {!committed ? (
            <div>
              <textarea
                value={commitment}
                onChange={(e) => setCommitment(e.target.value)}
                placeholder={t(
                  "Write one specific thing here — a repair conversation, a phone-down moment, a question to ask your child tonight...",
                )}
                rows={4}
                style={{
                  width: "100%",
                  padding: "18px 20px",
                  fontFamily: serif,
                  fontSize: "clamp(16px, 1.8vw, 18px)",
                  color: bodyText,
                  background: offWhite,
                  border: `1px solid oklch(88% 0.01 80)`,
                  borderRadius: 4,
                  resize: "vertical",
                  lineHeight: 1.75,
                  marginBottom: 20,
                  boxSizing: "border-box",
                }}
              />
              <button
                onClick={() => {
                  if (commitment.trim()) setCommitted(true);
                }}
                disabled={!commitment.trim()}
                style={{
                  padding: "14px 36px",
                  border: "none",
                  cursor: commitment.trim() ? "pointer" : "default",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  background: commitment.trim() ? orange : "oklch(35% 0.05 260)",
                  color: commitment.trim() ? offWhite : "oklch(55% 0.03 260)",
                  letterSpacing: "0.06em",
                  borderRadius: 4,
                }}
              >
                {t(
                  "I Will Do This",
                )}
              </button>
            </div>
          ) : (
            <div
              style={{
                background: "oklch(26% 0.09 260)",
                padding: "36px 40px",
                borderRadius: 12,
                textAlign: "left",
              }}
            >
              <p
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  color: orange,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                {t("Your commitment", "Komitmen Anda", "Jouw toezegging")}
              </p>
              <p
                style={{
                  fontFamily: serif,
                  fontSize: "clamp(17px, 1.9vw, 20px)",
                  color: offWhite,
                  lineHeight: 1.85,
                  fontStyle: "italic",
                  marginBottom: 24,
                }}
              >
                "{commitment}"
              </p>
              <p
                style={{
                  fontFamily: serif,
                  fontSize: "clamp(15px, 1.6vw, 17px)",
                  color: "oklch(76% 0.03 80)",
                  lineHeight: 1.75,
                }}
              >
                {t(
                  "Your children don't need you to be perfect. They need you to be present — and to come back when you haven't been. That's what you're choosing today.",
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          background: "oklch(19% 0.09 260)",
          padding: "72px 24px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: serif,
            fontSize: "clamp(26px, 3vw, 36px)",
            fontWeight: 700,
            color: offWhite,
            marginBottom: 16,
            fontStyle: "italic",
          }}
        >
          {t("Keep Growing", "Terus Bertumbuh", "Blijf Groeien")}
        </h2>
        <p
          style={{
            fontFamily: serif,
            fontSize: "clamp(16px, 1.8vw, 19px)",
            color: "oklch(76% 0.03 80)",
            lineHeight: 1.75,
            maxWidth: 520,
            margin: "0 auto 40px",
          }}
        >
          {t(
            "Explore more training modules to deepen your cross-cultural leadership.",
          )}
        </p>
        <Link
          href="/resources"
          style={{
            display: "inline-block",
            padding: "14px 36px",
            background: orange,
            color: offWhite,
            fontFamily: "Montserrat, sans-serif",
            fontSize: 14,
            fontWeight: 700,
            textDecoration: "none",
            borderRadius: 4,
            letterSpacing: "0.04em",
          }}
        >
          {t("Training", "Pelatihan", "Contentbibliotheek")}
        </Link>
      </div>

      {/* Verse Popup */}
      {activeVerse && verseData && (
        <div
          onClick={() => setActiveVerse(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "oklch(10% 0.05 260 / 0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: offWhite,
              borderRadius: 12,
              padding: "44px 40px",
              maxWidth: 540,
              width: "100%",
            }}
          >
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                color: orange,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              {lang === "en"
                ? verseData.en_ref
                : lang === "id"
                ? verseData.id_ref
                : verseData.id_ref}{" "}
              {lang === "en" ? "(NIV)" : "(TB)"}
            </p>
            <p
              style={{
                fontFamily: serif,
                fontSize: 20,
                lineHeight: 1.75,
                color: navy,
                fontStyle: "italic",
                marginBottom: 28,
              }}
            >
              "
              {lang === "en"
                ? verseData.en
                : lang === "id"
                ? verseData.id
                : verseData.id}
              "
            </p>
            <button
              onClick={() => setActiveVerse(null)}
              style={{
                padding: "10px 24px",
                background: navy,
                color: offWhite,
                border: "none",
                borderRadius: 12,
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {t("Close", "Tutup", "Sluiten")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
