"use client";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import LangToggle from "@/components/LangToggle";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id";
const t = (en: string, id: string, lang: Lang) => lang === "id" ? id : en;

const stages = [
  {
    number: "1",
    en_label: "Unconscious Incompetence",
    id_label: "Ketidakmampuan Tidak Sadar",
    en_subtitle: "You don't know what you don't know",
    id_subtitle: "Anda tidak tahu apa yang tidak Anda ketahui",
    en_desc: "At this stage, you lack a skill — and you don't even realise it. You might overestimate your ability, dismiss the need for learning, or simply have no frame of reference for what competence in this area looks like. This is sometimes called 'blissful ignorance.' The gap between what you think you can do and what you actually can is widest here.",
    id_desc: "Pada tahap ini, Anda tidak memiliki keterampilan — dan Anda bahkan tidak menyadarinya. Anda mungkin melebih-lebihkan kemampuan Anda, mengabaikan kebutuhan untuk belajar, atau sekadar tidak memiliki kerangka acuan tentang kompetensi di bidang ini. Celah antara apa yang Anda pikir bisa Anda lakukan dan apa yang sebenarnya bisa Anda lakukan paling lebar di sini.",
    color: "oklch(72% 0.12 25)",
    bgColor: "oklch(97% 0.015 25)",
  },
  {
    number: "2",
    en_label: "Conscious Incompetence",
    id_label: "Ketidakmampuan yang Disadari",
    en_subtitle: "You know what you don't know",
    id_subtitle: "Anda tahu apa yang tidak Anda ketahui",
    en_desc: "Something has revealed your gap — a failure, feedback, or watching someone else do it well. This is uncomfortable, but it is the most important transition in learning. You now know what you need to develop. The discomfort you feel at this stage is not a sign that you are behind — it is a sign that growth has begun. Staying here too long, however, leads to discouragement.",
    id_desc: "Sesuatu telah mengungkapkan celah Anda — kegagalan, umpan balik, atau melihat orang lain melakukannya dengan baik. Ini tidak nyaman, tetapi merupakan transisi paling penting dalam belajar. Anda sekarang tahu apa yang perlu Anda kembangkan. Ketidaknyamanan yang Anda rasakan di tahap ini bukan tanda bahwa Anda tertinggal — itu adalah tanda bahwa pertumbuhan telah dimulai.",
    color: "oklch(65% 0.14 50)",
    bgColor: "oklch(97% 0.015 50)",
  },
  {
    number: "3",
    en_label: "Conscious Competence",
    id_label: "Kompetensi yang Disadari",
    en_subtitle: "You can do it — but it takes effort",
    id_subtitle: "Anda bisa melakukannya — tapi membutuhkan usaha",
    en_desc: "You have developed the skill and can perform it reliably — but it requires concentration, deliberate effort, and active thought. You might need to slow down, talk yourself through steps, or consciously apply what you have learned. This is where most sustained practice happens. The temptation is to stop here, since it feels like 'good enough.' But fluency requires more repetition.",
    id_desc: "Anda telah mengembangkan keterampilan dan dapat melakukannya dengan andal — tetapi memerlukan konsentrasi, upaya yang disengaja, dan pemikiran aktif. Anda mungkin perlu memperlambat atau secara sadar menerapkan apa yang telah Anda pelajari. Di sinilah sebagian besar latihan berkelanjutan terjadi. Godaannya adalah berhenti di sini, karena rasanya sudah 'cukup baik.'",
    color: "oklch(58% 0.15 150)",
    bgColor: "oklch(97% 0.015 150)",
  },
  {
    number: "4",
    en_label: "Unconscious Competence",
    id_label: "Kompetensi Tidak Sadar",
    en_subtitle: "Mastery — it becomes second nature",
    id_subtitle: "Penguasaan — menjadi sifat kedua",
    en_desc: "The skill has become automatic. You perform it effortlessly, often without thinking through each step. This is mastery — where deep practice has moved the skill from conscious control into intuition. The leadership challenge at this stage is different: you may struggle to teach others, because you no longer remember what it felt like not to know. Articulating what you now do instinctively requires deliberate reflection.",
    id_desc: "Keterampilan telah menjadi otomatis. Anda melakukannya dengan mudah, sering tanpa memikirkan setiap langkah. Ini adalah penguasaan — di mana latihan mendalam telah memindahkan keterampilan dari kontrol sadar ke intuisi. Tantangan kepemimpinan di tahap ini berbeda: Anda mungkin kesulitan mengajar orang lain, karena Anda tidak lagi ingat rasanya tidak tahu.",
    color: "oklch(40% 0.12 260)",
    bgColor: "oklch(97% 0.01 260)",
  },
];

type Props = { isSaved: boolean };

export default function FourStagesClient({ isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" ? "id" : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [, startTransition] = useTransition();

  const navy = "oklch(22% 0.10 260)";
  const offWhite = "oklch(97% 0.005 80)";
  const orange = "oklch(65% 0.15 45)";
  const bodyText = "oklch(38% 0.05 260)";

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("four-stages-competence");
      setSaved(true);
    });
  }

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>
      <LangToggle />

      {/* Hero */}
      <div style={{ background: navy, padding: "80px 24px 72px" }}>
        <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
          {t("Personal Development — Guide", "Pengembangan Diri — Panduan", lang)}
        </p>
        <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(36px, 6vw, 68px)", fontWeight: 600, color: offWhite, margin: "0 0 24px", lineHeight: 1.08 }}>
          {t("Four Stages of Competence", "Empat Tahap Kompetensi", lang)}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(17px, 2.5vw, 22px)", color: "oklch(85% 0.03 80)", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.6, fontStyle: "italic" }}>
          {t(
            '"Growth begins the moment you realise how much you don\'t know."',
            '"Pertumbuhan dimulai pada saat Anda menyadari betapa banyak yang tidak Anda ketahui."',
            lang
          )}
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <span style={{ background: "oklch(30% 0.10 260)", color: offWhite, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", padding: "6px 14px", borderRadius: 4 }}>
            {t("GUIDE", "PANDUAN", lang)}
          </span>
          <span style={{ background: "oklch(30% 0.10 260)", color: offWhite, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", padding: "6px 14px", borderRadius: 4 }}>
            15 {t("MIN", "MENIT", lang)}
          </span>
          <button
            onClick={handleSave}
            style={{
              background: saved ? "oklch(55% 0.15 150)" : orange,
              color: offWhite,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              padding: "6px 14px",
              borderRadius: 4,
              border: "none",
              cursor: saved ? "default" : "pointer",
            }}
          >
            {saved ? t("✓ SAVED", "✓ TERSIMPAN", lang) : t("+ SAVE", "+ SIMPAN", lang)}
          </button>
        </div>
      </div>

      {/* Intro */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "56px 24px 0" }}>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: bodyText, marginBottom: 16 }}>
          {t(
            "The Four Stages of Competence — also known as the Conscious Competence Model — is a psychological framework that maps how we actually learn. It was developed in the 1970s and has since become one of the most widely used models for understanding skill acquisition, training design, and personal development.",
            "Empat Tahap Kompetensi — juga dikenal sebagai Model Kompetensi Sadar — adalah kerangka psikologis yang memetakan bagaimana kita sebenarnya belajar. Dikembangkan pada tahun 1970-an dan telah menjadi salah satu model yang paling banyak digunakan untuk memahami perolehan keterampilan, desain pelatihan, dan pengembangan pribadi.",
            lang
          )}
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: bodyText }}>
          {t(
            "The model tracks two variables — your ability (competence) and your awareness of it (consciousness) — and shows how they shift through four distinct stages as you move from ignorance to mastery. Understanding which stage you are in changes how you approach learning, how you coach others, and how you interpret the discomfort of growth.",
            "Model ini melacak dua variabel — kemampuan Anda (kompetensi) dan kesadaran Anda tentangnya — dan menunjukkan bagaimana keduanya bergeser melalui empat tahap yang berbeda saat Anda bergerak dari ketidaktahuan ke penguasaan. Memahami tahap mana yang Anda jalani mengubah cara Anda mendekati pembelajaran dan cara Anda melatih orang lain.",
            lang
          )}
        </p>
      </div>

      {/* Stages */}
      <div style={{ maxWidth: 720, margin: "48px auto 0", padding: "0 24px" }}>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 600, color: navy, marginBottom: 32 }}>
          {t("The Four Stages", "Empat Tahap", lang)}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {stages.map((stage) => (
            <div
              key={stage.number}
              style={{
                border: `2px solid ${stage.color}`,
                borderRadius: 8,
                overflow: "hidden",
                background: stage.bgColor,
              }}
            >
              <div style={{ background: stage.color, padding: "12px 24px", display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 700, color: "white", lineHeight: 1 }}>
                  {stage.number}
                </span>
                <div>
                  <p style={{ color: "white", fontWeight: 700, fontSize: 15, margin: 0, letterSpacing: "0.02em" }}>
                    {lang === "id" ? stage.id_label : stage.en_label}
                  </p>
                  <p style={{ color: "oklch(95% 0.005 80)", fontSize: 12, margin: 0, fontStyle: "italic", marginTop: 2 }}>
                    {lang === "id" ? stage.id_subtitle : stage.en_subtitle}
                  </p>
                </div>
              </div>
              <div style={{ padding: "20px 24px" }}>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: bodyText, margin: 0 }}>
                  {lang === "id" ? stage.id_desc : stage.en_desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* For Leaders note */}
      <div style={{ maxWidth: 720, margin: "48px auto", padding: "0 24px 80px" }}>
        <div style={{ background: "oklch(95% 0.01 260)", border: "1px solid oklch(88% 0.02 260)", borderRadius: 8, padding: "28px 32px" }}>
          <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 600, color: navy, margin: "0 0 12px" }}>
            {t("A note for leaders", "Catatan untuk pemimpin", lang)}
          </h3>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: bodyText, margin: 0 }}>
            {t(
              "Understanding these four stages is not just about your own development. It reshapes how you train your team, how you respond to struggling colleagues, and how you build organisations that learn. A team member stuck in Stage 1 doesn't need more information — they need an experience that creates awareness. A Stage 3 learner doesn't need more encouragement — they need sustained practice. The model teaches you to diagnose before you intervene.",
              "Memahami keempat tahap ini bukan hanya tentang pengembangan diri Anda sendiri. Ini membentuk ulang cara Anda melatih tim, cara Anda merespons rekan yang berjuang, dan cara Anda membangun organisasi yang belajar. Anggota tim yang terjebak di Tahap 1 tidak membutuhkan lebih banyak informasi — mereka membutuhkan pengalaman yang menciptakan kesadaran. Pemelajar Tahap 3 tidak membutuhkan lebih banyak dorongan — mereka membutuhkan latihan berkelanjutan.",
              lang
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
