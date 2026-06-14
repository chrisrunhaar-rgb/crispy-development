"use client";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id";
const tFn = (en: string, id: string, lang: "en" | "id") => lang === "id" ? id : en;

// --- VERSE DATA ---------------------------------------------------------------

const VERSE = {
  en_ref: "John 15:4—5",
  id_ref: "Yohanes 15:4—5",
  en: "Abide in me, as I also abide in you. No branch can bear fruit by itself; it must remain in the vine. Neither can you bear fruit unless you remain in me.",
  id: "Tinggallah di dalam Aku dan Aku di dalam kamu. Sama seperti ranting tidak dapat berbuah dari dirinya sendiri, kalau ia tidak tinggal pada pokok anggur, demikian juga kamu tidak berbuah, jikalau kamu tidak tinggal di dalam Aku.",
};

// --- PORTRAITS (The Danger of a Hollowed Leader) ------------------------------

const PORTRAITS = [
  {
    en_title: "The High-Performer",
    id_title: "Pemimpin Berprestasi Tinggi",
    en_body: "He delivers. Every metric points up. His team respects him and his organisation trusts him. But in private moments, he notices that the work has become the whole of him. He does not know what he thinks about things that are not work-adjacent. He has confused competence with wholeness.",
    id_body: "Ia berhasil. Setiap metrik menunjukkan kemajuan. Timnya menghormatinya dan organisasinya mempercayainya. Namun di momen pribadi, ia menyadari bahwa pekerjaan telah menjadi seluruh dirinya. Ia tidak tahu apa yang ia pikirkan tentang hal-hal yang tidak berkaitan dengan pekerjaan. Ia telah mengacaukan kompetensi dengan keutuhan.",
  },
  {
    en_title: "The Faithful Servant",
    id_title: "Hamba yang Setia",
    en_body: "She leads a faith-based organisation and measures her devotion by her sacrifice. Rest feels indulgent. Solitude feels selfish. She is always available, always present, always producing. Two years in, her prayers are professional. She is faithful to the work, but she is not sure she is faithful to God. They stopped feeling like the same thing.",
    id_body: "Ia memimpin sebuah organisasi berbasis iman dan mengukur pengabdiannya dengan pengorbanannya. Istirahat terasa memanjakan diri. Kesendirian terasa egois. Ia selalu tersedia, selalu hadir, selalu menghasilkan. Dua tahun kemudian, doanya terasa profesional. Ia setia pada pekerjaan, tapi ia tidak yakin apakah ia setia kepada Tuhan. Keduanya sudah tidak terasa sama.",
  },
  {
    en_title: "The Capable Navigator",
    id_title: "Navigator yang Cakap",
    en_body: "He is gifted at reading rooms, adjusting tone, and managing up. He is so skilled at presenting the right version of himself that he has lost track of which version is real. He can tell you what his stakeholders need from him. He cannot easily tell you what he actually believes, or what is actually happening inside him.",
    id_body: "Ia berbakat membaca situasi, menyesuaikan nada, dan mengelola atasan. Ia sangat terampil menampilkan versi dirinya yang tepat sehingga ia kehilangan jejak versi mana yang nyata. Ia bisa memberi tahu apa yang dibutuhkan pemangku kepentingannya dari dirinya. Namun ia tidak bisa dengan mudah memberi tahu apa yang sebenarnya ia yakini, atau apa yang sebenarnya terjadi di dalam dirinya.",
  },
];

// --- PRACTICES ----------------------------------------------------------------

const PRACTICES = [
  {
    domain_en: "Attention",
    domain_id: "Perhatian",
    en: "Once a day, before you open your first task, notice what is already happening inside you. Name it. Not as a performance review, but as honest observation. You cannot tend what you will not see.",
    id: "Sekali sehari, sebelum Anda membuka tugas pertama, perhatikan apa yang sudah terjadi di dalam diri Anda. Sebutkan namanya. Bukan sebagai tinjauan kinerja, tapi sebagai pengamatan jujur. Anda tidak dapat merawat apa yang tidak Anda lihat.",
  },
  {
    domain_en: "Rest",
    domain_id: "Istirahat",
    en: "Identify one thing you stop doing this week, not because you ran out of time, but as a deliberate act. Stopping is not failure. It is the practice of trusting that not everything depends on you.",
    id: "Identifikasi satu hal yang Anda hentikan minggu ini, bukan karena kehabisan waktu, tapi sebagai tindakan yang disengaja. Berhenti bukan kegagalan. Itu adalah praktik mempercayai bahwa tidak segalanya bergantung pada Anda.",
  },
  {
    domain_en: "Honesty",
    domain_id: "Kejujuran",
    en: "Tell one person the real condition of your interior life, not the managed version. This does not need to be lengthy. Even a sentence is enough. The soul needs to be known, not just observed.",
    id: "Ceritakan kepada satu orang kondisi nyata kehidupan batin Anda, bukan versi yang dikelola. Ini tidak perlu panjang. Bahkan satu kalimat sudah cukup. Jiwa perlu dikenal, bukan sekadar diamati.",
  },
];

// --- VITALITY CHECK QUESTIONS -------------------------------------------------

const QUESTIONS = [
  {
    en: "When I stop working, I can actually rest, without feeling guilty or restless.",
    id: "Ketika berhenti bekerja, saya bisa benar-benar beristirahat, tanpa merasa bersalah atau gelisah.",
  },
  {
    en: "My prayer feels like conversation rather than performance or obligation.",
    id: "Doa saya terasa seperti percakapan, bukan pertunjukan atau kewajiban.",
  },
  {
    en: "I can name what I am actually feeling right now, not just what I am doing.",
    id: "Saya bisa menyebutkan apa yang saya rasakan sekarang, bukan hanya apa yang saya lakukan.",
  },
  {
    en: "I have at least one person who knows the real condition of my interior life.",
    id: "Saya punya setidaknya satu orang yang tahu kondisi nyata kehidupan batin saya.",
  },
  {
    en: "The pace I am keeping feels sustainable, not just managed.",
    id: "Kecepatan yang saya jalani terasa berkelanjutan, bukan sekadar dikelola.",
  },
  {
    en: "I can distinguish between what I believe and what I perform.",
    id: "Saya dapat membedakan antara apa yang saya yakini dan apa yang saya tampilkan.",
  },
  {
    en: "I have a regular practice that tends my interior life, not for ministry output, but for my own soul.",
    id: "Saya memiliki praktik rutin yang merawat kehidupan batin saya, bukan untuk hasil pelayanan, tapi untuk jiwa saya sendiri.",
  },
  {
    en: "When things are hard, I know what I return to, what actually holds me.",
    id: "Ketika keadaan sulit, saya tahu apa yang menjadi tempat saya kembali, apa yang benar-benar menopang saya.",
  },
];

type Answer = "yes" | "sometimes" | "no" | null;

const SCORE_BUCKETS = [
  {
    min: 6,
    label_en: "Tended",
    label_id: "Terawat",
    en: "Your interior life is being actively tended. Keep investing here — this is what sustains everything else.",
    id: "Kehidupan batin Anda sedang dirawat dengan aktif. Terus berinvestasi di sini — inilah yang menopang segalanya.",
    step_en: "Protect the practices already in place. Share what is working with someone who leads alongside you.",
    step_id: "Lindungi praktik yang sudah ada. Bagikan apa yang berhasil kepada seseorang yang memimpin bersama Anda.",
    color: "oklch(58% 0.14 160)",
  },
  {
    min: 3,
    label_en: "Thinning",
    label_id: "Menipis",
    en: "Some things are in place, but something is thinning. Name what you have been skipping. Start there.",
    id: "Beberapa hal sudah ada, tapi ada sesuatu yang menipis. Sebutkan apa yang telah Anda lewatkan. Mulailah dari sana.",
    step_en: "Choose one practice from the section above and protect it this week, not as discipline but as trust.",
    step_id: "Pilih satu praktik dari bagian di atas dan lindungi minggu ini, bukan sebagai disiplin tapi sebagai kepercayaan.",
    color: "oklch(65% 0.15 55)",
  },
  {
    min: 0,
    label_en: "Depleted",
    label_id: "Terkuras",
    en: "Your interior life needs attention now, not later. This is not failure — it is information. One small step this week.",
    id: "Kehidupan batin Anda membutuhkan perhatian sekarang, bukan nanti. Ini bukan kegagalan — ini informasi. Satu langkah kecil minggu ini.",
    step_en: "Tell one person how you actually are. Not how you are managing, but how you are. That is enough to start.",
    step_id: "Ceritakan kepada satu orang bagaimana keadaan Anda sebenarnya. Bukan bagaimana Anda mengelolanya, tapi bagaimana kondisi Anda. Itu sudah cukup untuk memulai.",
    color: "oklch(52% 0.18 25)",
  },
];

// --- COMPONENT ----------------------------------------------------------------

type Props = { userPathway?: string | null; isSaved: boolean };

export default function LeadersInnerLifeClient({ isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" ? "id" : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [answers, setAnswers] = useState<Answer[]>(Array(QUESTIONS.length).fill(null));

  const t = (en: string, id: string) => tFn(en, id, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("leaders-inner-life");
      setSaved(true);
    });
  }

  function setAnswer(index: number, value: Answer) {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  const allAnswered = answers.every((a) => a !== null);
  const yesCount = answers.filter((a) => a === "yes").length;

  const bucket = allAnswered
    ? SCORE_BUCKETS.find((b) => yesCount >= b.min) ?? SCORE_BUCKETS[2]
    : null;

  const navy = "oklch(22% 0.10 260)";
  const orange = "oklch(65% 0.15 45)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const bodyText = "oklch(38% 0.05 260)";
  const serif = "var(--font-cormorant, Cormorant Garamond, Georgia, serif)";

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>
      <LangToggle />

      {/* Hero */}
      <div style={{ background: navy, padding: "88px 24px 80px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {t("Faith & Calling — Guide", "Iman & Panggilan — Panduan")}
          </p>
          <h1 style={{ fontFamily: serif, fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, color: offWhite, margin: "0 0 24px", lineHeight: 1.08 }}>
            {t("The Leader's Inner Life", "Kehidupan Batin Pemimpin")}
          </h1>
          <div style={{ width: 48, height: 1, background: orange, margin: "0 auto 32px" }} />
          <p style={{ fontFamily: serif, fontSize: "clamp(19px, 2.5vw, 23px)", color: "oklch(82% 0.025 80)", lineHeight: 1.75, marginBottom: 40, fontStyle: "italic" }}>
            {t(
              "Why interior formation comes before outward effectiveness, and how to tend the part of you that sustains everything else.",
              "Mengapa pembentukan batin mendahului efektivitas lahiriah, dan bagaimana merawat bagian diri Anda yang menopang segalanya."
            )}
          </p>
          <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: "oklch(76% 0.03 80)", lineHeight: 1.75, marginBottom: 24, fontStyle: "italic" }}>
            {t(
              "\"Abide in me, as I also abide in you. No branch can bear fruit by itself; it must remain in the vine.\"",
              "\"Tinggallah di dalam Aku dan Aku di dalam kamu. Sama seperti ranting tidak dapat berbuah dari dirinya sendiri, kalau ia tidak tinggal pada pokok anggur.\""
            )}
          </p>
          <p style={{ fontSize: 13, color: orange, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 48 }}>
            {t("— John 15:4—5 (NIV)", "— Yohanes 15:4—5 (TB)")}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={handleSave}
              disabled={saved || isPending}
              style={{ padding: "12px 28px", border: "none", cursor: saved ? "default" : "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, background: saved ? "oklch(35% 0.05 260)" : orange, color: offWhite, letterSpacing: "0.04em", borderRadius: 4 }}
            >
              {saved ? t("Saved to Dashboard", "Tersimpan di Dashboard") : t("Save to Dashboard", "Simpan ke Dashboard")}
            </button>
          </div>
        </div>
      </div>

      {/* Section 1: The Formation Gap */}
      <div style={{ padding: "96px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
          {t("I. The Hook", "I. Pembuka")}
        </p>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 40, lineHeight: 1.2, fontStyle: "italic" }}>
          {t("Something Is Widening", "Ada Sesuatu yang Melebar")}
        </h2>
        <div style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9 }}>
          <p style={{ marginBottom: 28 }}>
            {t(
              "You are producing results. The feedback is mostly positive. People follow you. But you notice something: the gap between what you project and what you actually feel has been widening. You navigate this gap with competence. What you are less sure about is whether your interior life, the actual condition of your soul, is keeping pace with your leadership.",
              "Anda menghasilkan hasil. Umpan baliknya sebagian besar positif. Orang-orang mengikuti Anda. Tapi Anda menyadari sesuatu: kesenjangan antara apa yang Anda tampilkan dan apa yang sebenarnya Anda rasakan semakin melebar. Anda menavigasi kesenjangan ini dengan kompetensi. Namun yang kurang Anda yakini adalah apakah kehidupan batin Anda, kondisi jiwa Anda yang sebenarnya, mengikuti kepemimpinan Anda."
            )}
          </p>
          <p style={{ fontFamily: serif, fontSize: "clamp(19px, 2.2vw, 24px)", fontStyle: "italic", color: navy, lineHeight: 1.75, padding: "8px 0 8px 28px", borderLeft: `3px solid ${orange}` }}>
            {t(
              "There is a version of you that leads, and a version that is being formed. Both need attention.",
              "Ada versi diri Anda yang memimpin, dan versi yang sedang dibentuk. Keduanya membutuhkan perhatian."
            )}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: "oklch(90% 0.008 80)" }} />
      </div>

      {/* Section 2: The Formation Gap */}
      <div style={{ padding: "96px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
          {t("II. The Formation Gap", "II. Kesenjangan Pembentukan")}
        </p>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 40, lineHeight: 1.2, fontStyle: "italic" }}>
          {t("Competence Grows Faster Than Character", "Kompetensi Tumbuh Lebih Cepat dari Karakter")}
        </h2>
        <div style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9 }}>
          <p style={{ marginBottom: 28 }}>
            {t(
              "Your skills accumulate. You learn how to read a room, manage conflict, cast vision, build trust. These are good things. But your competence grows faster than your character if you let it. Skills are acquired. Character is formed, slowly, through attention and honesty and the willingness to be changed.",
              "Keterampilan Anda terakumulasi. Anda belajar cara membaca situasi, mengelola konflik, membangun visi, membangun kepercayaan. Ini hal-hal yang baik. Namun kompetensi Anda tumbuh lebih cepat dari karakter Anda jika Anda membiarkannya. Keterampilan diperoleh. Karakter dibentuk, perlahan, melalui perhatian, kejujuran, dan kesediaan untuk berubah."
            )}
          </p>
          <p style={{ marginBottom: 28 }}>
            {t(
              "The formation gap is the distance between who you lead as and who you are becoming. Most leaders are aware of it. Few make time for it.",
              "Kesenjangan pembentukan adalah jarak antara siapa Anda saat memimpin dan siapa Anda sedang menjadi. Sebagian besar pemimpin menyadarinya. Sedikit yang menyisihkan waktu untuk itu."
            )}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: "oklch(90% 0.008 80)" }} />
      </div>

      {/* Section 3: What Interior Life Actually Means */}
      <div style={{ padding: "96px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
          {t("III. What Interior Life Means", "III. Apa Artinya Kehidupan Batin")}
        </p>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 40, lineHeight: 1.2, fontStyle: "italic" }}>
          {t("Not Performance. Condition.", "Bukan Pertunjukan. Kondisi.")}
        </h2>
        <div style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9 }}>
          <p style={{ marginBottom: 28 }}>
            {t(
              "Interior life is not spiritual performance. It is not how much you pray, how consistent your devotional habits are, or how articulate you are about your faith. It is the actual condition of your soul: what you return to when no one is watching, what sustains you in seasons of difficulty, what keeps you tethered when everything is uncertain.",
              "Kehidupan batin bukan pertunjukan rohani. Bukan seberapa banyak Anda berdoa, seberapa konsisten kebiasaan devosi Anda, atau seberapa fasih Anda tentang iman Anda. Ini adalah kondisi jiwa Anda yang sebenarnya: apa yang Anda kembali ketika tidak ada yang memperhatikan, apa yang menopang Anda di musim-musim sulit, apa yang menjaga Anda tetap terhubung ketika segalanya tidak pasti."
            )}
          </p>
          <p style={{ fontFamily: serif, fontSize: "clamp(19px, 2.2vw, 24px)", fontStyle: "italic", color: navy, lineHeight: 1.75, padding: "8px 0 8px 28px", borderLeft: `3px solid ${orange}` }}>
            {t(
              "What happens inside you determines what comes through you. You can lead well from a thinning interior for a while. Not forever.",
              "Apa yang terjadi di dalam diri Anda menentukan apa yang muncul melalui Anda. Anda bisa memimpin dengan baik dari batin yang menipis untuk sementara. Tidak selamanya."
            )}
          </p>
        </div>
      </div>

      {/* Section 4: Three Portraits */}
      <div style={{ background: lightGray, padding: "96px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
            {t("IV. Three Portraits", "IV. Tiga Potret")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 20, lineHeight: 1.2, fontStyle: "italic" }}>
            {t("The Danger of a Hollowed Leader", "Bahaya Pemimpin yang Kosong")}
          </h2>
          <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)", color: bodyText, lineHeight: 1.85, marginBottom: 64 }}>
            {t(
              "Leadership without interior formation produces people who execute well and influence poorly. These are three portraits of leaders who lost the centre.",
              "Kepemimpinan tanpa pembentukan batin menghasilkan orang-orang yang melaksanakan dengan baik namun memengaruhi dengan buruk. Berikut tiga potret pemimpin yang kehilangan pusatnya."
            )}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>
            {PORTRAITS.map((p, i) => (
              <div key={i}>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 style={{ fontFamily: serif, fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 700, color: navy, marginBottom: 20, fontStyle: "italic", lineHeight: 1.3 }}>
                  {lang === "id" ? p.id_title : p.en_title}
                </h3>
                <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: bodyText, lineHeight: 1.9 }}>
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

      {/* Section 5: Tending the Inner Life */}
      <div style={{ padding: "96px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
          {t("V. Tending the Inner Life", "V. Merawat Kehidupan Batin")}
        </p>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 20, lineHeight: 1.2, fontStyle: "italic" }}>
          {t("Three Domains. Not Three Rules.", "Tiga Domain. Bukan Tiga Aturan.")}
        </h2>
        <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: bodyText, lineHeight: 1.85, marginBottom: 56 }}>
          {t(
            "These are not spiritual extras. They are leadership infrastructure.",
            "Ini bukan tambahan rohani. Ini adalah infrastruktur kepemimpinan."
          )}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {PRACTICES.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
              <div style={{ minWidth: 90, flexShrink: 0 }}>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>
                  {lang === "id" ? p.domain_id : p.domain_en}
                </p>
              </div>
              <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: bodyText, lineHeight: 1.9, margin: 0 }}>
                {lang === "id" ? p.id : p.en}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 6: Vitality Check */}
      <div style={{ background: navy, padding: "96px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
            {t("VI. Vitality Check", "VI. Pemeriksaan Vitalitas")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: offWhite, marginBottom: 20, lineHeight: 1.2, fontStyle: "italic" }}>
            {t("How Is Your Interior Life, Actually?", "Bagaimana Kehidupan Batin Anda, Sebenarnya?")}
          </h2>
          <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: "oklch(76% 0.03 80)", lineHeight: 1.85, marginBottom: 56 }}>
            {t(
              "Eight questions. No shame. Just honest assessment.",
              "Delapan pertanyaan. Tanpa rasa malu. Hanya penilaian jujur."
            )}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {QUESTIONS.map((q, i) => (
              <div key={i} style={{ background: "oklch(18% 0.09 260)", borderRadius: 8, padding: "28px 32px" }}>
                <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: offWhite, lineHeight: 1.8, marginBottom: 20 }}>
                  <span style={{ color: orange, fontWeight: 700, fontFamily: "Montserrat, sans-serif", fontSize: 11, letterSpacing: "0.1em", display: "block", marginBottom: 10 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {lang === "id" ? q.id : q.en}
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {(["yes", "sometimes", "no"] as Answer[]).map((option) => (
                    <button
                      key={option}
                      onClick={() => setAnswer(i, option)}
                      style={{
                        padding: "8px 20px",
                        border: `1px solid ${answers[i] === option ? orange : "oklch(40% 0.06 260)"}`,
                        borderRadius: 4,
                        cursor: "pointer",
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        background: answers[i] === option ? orange : "transparent",
                        color: answers[i] === option ? offWhite : "oklch(65% 0.04 260)",
                        transition: "all 0.15s",
                      }}
                    >
                      {option === "yes"
                        ? t("Yes", "Ya")
                        : option === "sometimes"
                        ? t("Sometimes", "Kadang")
                        : t("No", "Tidak")}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Result */}
          {allAnswered && bucket && (
            <div style={{ marginTop: 56, background: offWhite, borderRadius: 8, padding: "44px 40px" }}>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: "oklch(55% 0.04 260)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
                {t("Your Result", "Hasil Anda")}
              </p>
              <h3 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: bucket.color, marginBottom: 20, fontStyle: "italic", lineHeight: 1.2 }}>
                {lang === "id" ? bucket.label_id : bucket.label_en}
              </h3>
              <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.85, marginBottom: 24 }}>
                {lang === "id" ? bucket.id : bucket.en}
              </p>
              <div style={{ borderTop: "1px solid oklch(90% 0.008 80)", paddingTop: 24, marginTop: 8 }}>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
                  {t("One Next Step", "Satu Langkah Selanjutnya")}
                </p>
                <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)", color: bodyText, lineHeight: 1.8, margin: 0 }}>
                  {lang === "id" ? bucket.step_id : bucket.step_en}
                </p>
              </div>
            </div>
          )}

          {!allAnswered && (
            <p style={{ fontFamily: serif, fontSize: 15, color: "oklch(55% 0.04 260)", fontStyle: "italic", textAlign: "center", marginTop: 40 }}>
              {t(
                `${answers.filter((a) => a !== null).length} of 8 answered`,
                `${answers.filter((a) => a !== null).length} dari 8 dijawab`
              )}
            </p>
          )}
        </div>
      </div>

      {/* Section 7: This Week */}
      <div style={{ background: lightGray, padding: "96px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
            {t("VII. This Week", "VII. Minggu Ini")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 700, color: navy, marginBottom: 20, lineHeight: 1.2, fontStyle: "italic" }}>
            {t("One Question to Sit With", "Satu Pertanyaan untuk Direnungkan")}
          </h2>
          <p style={{ fontFamily: serif, fontSize: "clamp(19px, 2.2vw, 24px)", fontStyle: "italic", color: navy, lineHeight: 1.75, marginBottom: 24, padding: "8px 0 8px 28px", borderLeft: `3px solid ${orange}`, textAlign: "left" }}>
            {t(
              "\"What is the condition of my interior life right now?\"",
              "\"Apa kondisi kehidupan batin saya saat ini?\""
            )}
          </p>
          <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: bodyText, lineHeight: 1.85, textAlign: "left" }}>
            {t(
              "Not as a performance review. As an honest observation. Give yourself five minutes with this question before the week moves on. What you notice is enough to start with.",
              "Bukan sebagai tinjauan kinerja. Sebagai pengamatan jujur. Berikan diri Anda lima menit dengan pertanyaan ini sebelum minggu berlanjut. Apa yang Anda perhatikan sudah cukup untuk memulai."
            )}
          </p>
        </div>
      </div>

      {/* Faith Anchor */}
      <div style={{ background: navy, padding: "96px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
            {t("Faith Anchor", "Jangkar Iman")}
          </p>
          <p style={{ fontFamily: serif, fontSize: "clamp(22px, 3vw, 32px)", fontStyle: "italic", color: offWhite, lineHeight: 1.75, marginBottom: 24 }}>
            {t(
              "\"Abide in me, as I also abide in you. No branch can bear fruit by itself; it must remain in the vine.\"",
              "\"Tinggallah di dalam Aku dan Aku di dalam kamu. Sama seperti ranting tidak dapat berbuah dari dirinya sendiri, kalau ia tidak tinggal pada pokok anggur.\""
            )}
          </p>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em", marginBottom: 48 }}>
            {t("— John 15:4—5 (NIV)", "— Yohanes 15:4—5 (TB)")}
          </p>
          <div style={{ background: "oklch(18% 0.09 260)", borderRadius: 4, padding: "40px 40px" }}>
            <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: "oklch(76% 0.03 80)", lineHeight: 1.85, margin: 0 }}>
              {t(
                "You are not called to produce fruit by effort alone. You are called to remain. Interior formation is not preparation for ministry, something you do before the real work starts. It is the work. The branch does not strive to bear fruit. It stays connected to the vine, and the fruit comes.",
                "Anda tidak dipanggil untuk menghasilkan buah hanya dengan usaha. Anda dipanggil untuk tinggal. Pembentukan batin bukan persiapan untuk pelayanan, sesuatu yang Anda lakukan sebelum pekerjaan nyata dimulai. Itu adalah pekerjaannya. Ranting tidak berjuang untuk berbuah. Ia tetap terhubung dengan pokok anggur, dan buah itu datang."
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: offWhite, padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 700, color: navy, marginBottom: 16, fontStyle: "italic" }}>
          {t("Keep Growing", "Terus Bertumbuh")}
        </h2>
        <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: bodyText, lineHeight: 1.75, maxWidth: 520, margin: "0 auto 40px" }}>
          {t(
            "Explore more training modules to deepen your cross-cultural leadership.",
            "Jelajahi lebih banyak modul pelatihan untuk memperdalam kepemimpinan lintas budaya Anda."
          )}
        </p>
        <Link
          href="/resources"
          style={{ display: "inline-block", padding: "14px 36px", background: orange, color: offWhite, fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, textDecoration: "none", borderRadius: 4, letterSpacing: "0.04em" }}
        >
          {t("All Training Modules", "Semua Modul Pelatihan")}
        </Link>
      </div>
    </div>
  );
}
