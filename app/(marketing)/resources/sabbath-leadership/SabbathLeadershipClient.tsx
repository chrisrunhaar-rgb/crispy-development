"use client";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id";
const tFn = (en: string, id: string, lang: Lang) =>
  lang === "id" ? id : en;

const VERSES = {
  "gen-2-2-3": {
    en_ref: "Genesis 2:2—3", id_ref: "Kejadian 2:2—3",
    en: "By the seventh day God had finished the work he had been doing; so on the seventh day he rested from all his work. Then God blessed the seventh day and made it holy, because on it he rested from all the work of creating that he had done.",
    id: "Ketika Allah pada hari ketujuh telah menyelesaikan pekerjaan yang dibuat-Nya itu, berhentilah Ia pada hari ketujuh dari segala pekerjaan yang telah dibuat-Nya itu. Lalu Allah memberkati hari ketujuh itu dan menguduskannya, karena pada hari itulah Ia berhenti dari segala pekerjaan penciptaan yang telah dibuat-Nya itu.",
  },
  "matt-11-28-30": {
    en_ref: "Matthew 11:28—30", id_ref: "Matius 11:28—30",
    en: "Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls. For my yoke is easy and my burden is light.",
    id: "Marilah kepada-Ku, semua yang letih lesu dan berbeban berat, Aku akan memberi kelegaan kepadamu. Pikullah kuk yang Kupasang dan belajarlah pada-Ku, karena Aku lemah lembut dan rendah hati dan jiwamu akan mendapat ketenangan. Sebab kuk yang Kupasang itu enak dan beban-Ku pun ringan.",
  },
  "ps-23-2-3": {
    en_ref: "Psalm 23:2—3", id_ref: "Mazmur 23:2—3",
    en: "He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul. He guides me along the right paths for his name's sake.",
    id: "Ia membaringkan aku di padang yang berumput hijau, Ia membimbing aku ke air yang tenang; Ia menyegarkan jiwaku. Ia menuntun aku di jalan yang benar oleh karena nama-Nya.",
  },
  "mark-6-31": {
    en_ref: "Mark 6:31", id_ref: "Markus 6:31",
    en: "Then, because so many people were coming and going that they did not even have a chance to eat, he said to them, \"Come with me by yourselves to a quiet place and get some rest.\"",
    id: "Lalu Ia berkata kepada mereka: \"Marilah ke tempat yang sunyi, supaya kita sendirian, dan beristirahatlah sebentar!\" Sebab memang begitu banyaknya orang yang datang dan yang pergi, sehingga makan pun mereka tidak sempat.",
  },
  "exod-20-8": {
    en_ref: "Exodus 20:8—10", id_ref: "Keluaran 20:8—10",
    en: "Remember the Sabbath day by keeping it holy. Six days you shall labor and do all your work, but the seventh day is a sabbath to the Lord your God. On it you shall not do any work.",
    id: "Ingatlah dan kuduskanlah hari Sabat: enam hari lamanya engkau akan bekerja dan melakukan segala pekerjaanmu, tetapi hari ketujuh adalah hari Sabat TUHAN, Allahmu; maka jangan melakukan sesuatu pekerjaan.",
  },
};

const PORTRAITS = [
  {
    en_title: "The Always-Available Leader",
    id_title: "Pemimpin yang Selalu Siap",
    en_body: `He manages teams across three time zones. WhatsApp notifications stay on through the night. He prides himself on never missing a message. Eighteen months in, his creative thinking has dulled. He's short with his family. He can attend any meeting but can't fully be present in any of them. He doesn't recognise it as burnout — he calls it the cost of the mission. The cost, quietly, is his whole self.`,
    id_body: `Ia mengelola tim di tiga zona waktu. Notifikasi WhatsApp menyala sepanjang malam. Ia bangga tidak pernah melewatkan satu pesan pun. Delapan belas bulan kemudian, pemikiran kreatifnya telah tumpul. Ia mudah marah dengan keluarganya. Ia bisa menghadiri rapat apa saja tapi tidak bisa sepenuhnya hadir di satupun. Ia tidak mengenalinya sebagai kelelahan — ia menyebutnya sebagai biaya misi. Biayanya, diam-diam, adalah dirinya sendiri.`,
  },
  {
    en_title: "The Leader Who Earns Rest",
    id_title: "Pemimpin yang Menghasilkan Istirahat",
    en_body: `She leads a mission organisation and has not taken a full week of holiday in five years. Her team admires her commitment. She measures her faithfulness by her output — and rest, to her, feels indistinguishable from neglect. The team mirrors her. No one admits fatigue. Output per person is declining, quietly, each year. The culture has confused sacrifice with depletion. They are not becoming more faithful — they are becoming less effective.`,
    id_body: `Ia memimpin sebuah organisasi misi dan belum mengambil liburan penuh dalam lima tahun. Timnya mengagumi komitmennya. Ia mengukur kesetiaannya dengan hasilnya — dan istirahat, baginya, terasa tidak dapat dibedakan dari kelalaian. Tim mencerminkan pola yang sama. Tidak ada yang mengakui kelelahan. Output per orang menurun setiap tahun. Budaya telah mencampuradukkan pengorbanan dengan penipisan.`,
  },
  {
    en_title: "The Leader in the Wrong Rhythm",
    id_title: "Pemimpin dalam Ritme yang Salah",
    en_body: `A Western leader arrives in a Southeast Asian context and imposes a structured 40-hour workweek, Western-style productivity frameworks, and rigid separation of work and personal time. The local team's rest is woven into festivals, extended family, and seasonal rhythms — it doesn't fit his framework. He burns out trying to enforce a system that doesn't fit. He misses that rest was already present in the culture — only in a form he didn't recognise.`,
    id_body: `Seorang pemimpin Barat tiba di konteks Asia Tenggara dan menerapkan minggu kerja 40 jam yang terstruktur, kerangka produktivitas gaya Barat, dan pemisahan kaku antara waktu kerja dan pribadi. Istirahat tim lokal terjalin dalam festival, keluarga besar, dan ritme musiman — tidak cocok dengan kerangkanya. Ia kelelahan mencoba menerapkan sistem yang tidak cocok. Ia melewatkan bahwa istirahat sudah ada dalam budaya — hanya dalam bentuk yang tidak ia kenali.`,
  },
];

const PRACTICES = [
  {
    en: "Establish one full day each week with no digital engagement — no email, no messages, no screens. Not as a rule to follow, but as an act of trust that God holds what you step away from.",
    id: "Tetapkan satu hari penuh setiap minggu tanpa keterlibatan digital — tidak ada email, tidak ada pesan, tidak ada layar. Bukan sebagai aturan untuk diikuti, tetapi sebagai tindakan kepercayaan bahwa Allah menjaga apa yang Anda tinggalkan.",
  },
  {
    en: "Create a physical ritual that ends your workday — a brief prayer, a short walk, closing your laptop with intention. Something your body recognises as: this is where work stops.",
    id: "Ciptakan ritual fisik yang mengakhiri hari kerja Anda — doa singkat, jalan kaki singkat, menutup laptop dengan niat. Sesuatu yang dikenali tubuh Anda sebagai: di sinilah pekerjaan berhenti.",
  },
  {
    en: "Identify the communal rest rhythms already present in your cultural context — festivals, family gatherings, religious assemblies — and build your personal rhythm around them rather than against them.",
    id: "Identifikasi ritme istirahat komunal yang sudah ada dalam konteks budaya Anda — festival, pertemuan keluarga, ibadah bersama — dan bangun ritme pribadi Anda di sekitarnya, bukan melawannya.",
  },
  {
    en: "Take the full annual leave you are entitled to. Rest is not a reward for enough output — it is a built-in feature of sustainable leadership. Your team will not rest unless you model it.",
    id: "Ambil cuti tahunan penuh yang menjadi hak Anda. Istirahat bukan hadiah untuk output yang cukup — itu adalah fitur bawaan kepemimpinan yang berkelanjutan. Tim Anda tidak akan beristirahat kecuali Anda memodelkannya.",
  },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function SabbathLeadershipClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  const [commitment, setCommitment] = useState("");
  const [committed, setCommitted] = useState(false);
  const t = (en: string, id: string) => tFn(en, id, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("sabbath-leadership");
      setSaved(true);
    });
  }

  function VerseRef({ id, children }: { id: string; children: React.ReactNode }) {
    return (
      <button
        onClick={() => setActiveVerse(id)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: orange, fontWeight: 700, fontFamily: "Montserrat, sans-serif",
          fontSize: "inherit", padding: 0, textDecoration: "underline dotted",
          textUnderlineOffset: 3,
        }}
      >
        {children}
      </button>
    );
  }

  const navy = "oklch(22% 0.10 260)";
  const orange = "oklch(65% 0.15 45)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const bodyText = "oklch(38% 0.05 260)";
  const serif = "var(--font-cormorant, Cormorant Garamond, Georgia, serif)";

  const verseData = activeVerse ? VERSES[activeVerse as keyof typeof VERSES] : null;

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>
      <LangToggle />

      {/* Language bar */}

      {/* Hero */}
      <div style={{ background: navy, padding: "88px 24px 80px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {t("Faith & Calling — Guide", "Iman & Panggilan — Panduan")}
          </p>
          <h1 style={{ fontFamily: serif, fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, color: offWhite, margin: "0 0 24px", lineHeight: 1.08 }}>
            {t("Sabbath & Sustainable Leadership", "Sabat & Kepemimpinan Berkelanjutan")}
          </h1>
          <div style={{ width: 48, height: 1, background: orange, margin: "0 auto 32px" }} />
          <p style={{ fontFamily: serif, fontSize: "clamp(19px, 2.5vw, 23px)", color: "oklch(82% 0.025 80)", lineHeight: 1.75, marginBottom: 40, fontStyle: "italic" }}>
            {t(
              "Then God blessed the seventh day and made it holy, because on it he rested from all the work of creating.",
              "Lalu Allah memberkati hari ketujuh itu dan menguduskannya, karena pada hari itulah Ia berhenti dari segala pekerjaan penciptaan."
            )}
          </p>
          <p style={{ fontSize: 13, color: orange, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 48 }}>
            — <VerseRef id="gen-2-2-3">{t("Genesis 2:3", "Kejadian 2:3")}</VerseRef> (NIV)
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={handleSave} disabled={saved || isPending} style={{ padding: "12px 28px", border: "none", cursor: saved ? "default" : "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, background: saved ? "oklch(35% 0.05 260)" : orange, color: offWhite, letterSpacing: "0.04em", borderRadius: 4 }}>
              {saved ? t("Saved to Dashboard", "Tersimpan di Dashboard") : t("Save to Dashboard", "Simpan ke Dashboard")}
            </button>
          </div>
        </div>
      </div>

      {/* Section 1: God Rested First */}
      <div style={{ padding: "96px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
          {t("I. The Original Pattern", "I. Pola Asli")}
        </p>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 40, lineHeight: 1.2, fontStyle: "italic" }}>
          {t("God Rested First", "Allah Beristirahat Lebih Dulu")}
        </h2>
        <div style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9 }}>
          <p style={{ marginBottom: 28 }}>
            {t(
              "The Hebrew word shabbat comes from a root meaning to cease, to desist — not to slow down temporarily, but to genuinely stop. On the seventh day, after the work of creation was complete, God stopped. Not because he was exhausted. Not because something had gone wrong. He stopped because the work was finished and stopping was the right, holy thing to do.",
              "Kata Ibrani shabbat berasal dari akar yang berarti berhenti, melepaskan — bukan untuk memperlambat sementara, tetapi untuk benar-benar berhenti. Pada hari ketujuh, setelah pekerjaan penciptaan selesai, Allah berhenti. Bukan karena Ia kelelahan. Bukan karena ada yang salah. Ia berhenti karena pekerjaan itu selesai dan berhenti adalah hal yang benar dan kudus untuk dilakukan."
            )}
          </p>
          <p style={{ marginBottom: 28 }}>
            {t(
              "This is not a minor detail in the creation story. The seventh day is the only day that God blesses and sets apart as holy. The six days of making are remarkable — but it is the day of rest that God crowns with holiness. He is not just tolerating rest. He is honouring it.",
              "Ini bukan detail kecil dalam kisah penciptaan. Hari ketujuh adalah satu-satunya hari yang diberkati dan dikuduskan Allah. Enam hari penciptaan itu luar biasa — tetapi hari istirahat itulah yang dimahkotai Allah dengan kekudusan. Ia tidak sekadar mentoleransi istirahat. Ia menghormatinya."
            )}
          </p>
          <p style={{ marginBottom: 28 }}>
            {t(
              "What does this tell us about God? That rest is not weakness. That stepping away from work is not abandonment. That there is something sacred in the rhythm of doing and ceasing. He built this rhythm into the fabric of creation before he commanded it of his people. He modelled it first.",
              "Apa yang ini katakan tentang Allah? Bahwa istirahat bukan kelemahan. Bahwa meninggalkan pekerjaan bukan pengabaian. Bahwa ada sesuatu yang kudus dalam ritme melakukan dan berhenti. Ia membangun ritme ini ke dalam kain ciptaan sebelum Ia memerintahkannya kepada umat-Nya. Ia memodelkannya lebih dulu."
            )}
          </p>
          <p style={{ fontFamily: serif, fontSize: "clamp(19px, 2.2vw, 24px)", fontStyle: "italic", color: navy, lineHeight: 1.75, padding: "8px 0 8px 28px", borderLeft: `3px solid ${orange}` }}>
            {t(
              "The Sabbath is not an external constraint placed on humans by a demanding God. It is a built-in feature of reality, designed by someone who understood rest deeply enough to practise it himself.",
              "Sabat bukan batasan eksternal yang ditempatkan pada manusia oleh Allah yang menuntut. Ini adalah fitur bawaan dari kenyataan, yang dirancang oleh seseorang yang cukup memahami istirahat untuk mempraktikkannya sendiri."
            )}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: "oklch(90% 0.008 80)" }} />
      </div>

      {/* Section 2: He Knows You Need Rest */}
      <div style={{ padding: "96px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
          {t("II. The Invitation", "II. Undangan")}
        </p>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 40, lineHeight: 1.2, fontStyle: "italic" }}>
          {t("He Knows You Need Rest", "Ia Tahu Anda Butuh Istirahat")}
        </h2>
        <div style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9 }}>
          <p style={{ marginBottom: 36 }}>
            {t(
              "Jesus did not say: come to me when you have finished everything. He said come to me when you are weary. The invitation in Matthew 11:28 is not conditional on your output. It is issued precisely because he sees your exhaustion.",
              "Yesus tidak berkata: datanglah kepada-Ku ketika kamu telah menyelesaikan segalanya. Ia berkata datanglah kepada-Ku ketika kamu kelelahan. Undangan dalam Matius 11:28 tidak bersyarat pada output Anda. Itu diberikan tepat karena Ia melihat kelelahan Anda."
            )}
          </p>

          {/* Matthew 11:28-30 displayed as a full pull-quote */}
          <div style={{ background: lightGray, padding: "36px 40px", marginBottom: 36, borderRadius: 4 }}>
            <p style={{ fontFamily: serif, fontSize: "clamp(19px, 2.2vw, 24px)", fontStyle: "italic", color: navy, lineHeight: 1.75, marginBottom: 16 }}>
              {t(
                "\"Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls.\"",
                "\"Marilah kepada-Ku, semua yang letih lesu dan berbeban berat, Aku akan memberi kelegaan kepadamu. Pikullah kuk yang Kupasang dan belajarlah pada-Ku, karena Aku lemah lembut dan rendah hati dan jiwamu akan mendapat ketenangan.\""
              )}
            </p>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em" }}>
              — <VerseRef id="matt-11-28-30">{t("Matthew 11:28—30", "Matius 11:28—30")}</VerseRef> (NIV)
            </p>
          </div>

          <p style={{ marginBottom: 28 }}>
            {t(
              "In Mark 6:31, we see Jesus watching his disciples burn out in real time. So many people were coming and going that they didn't even have time to eat. His response was not: push through, the mission requires it. It was: come away with me to a quiet place and rest. This is Jesus — the most missionally urgent person in human history — telling his team to stop.",
              "Dalam Markus 6:31, kita melihat Yesus menyaksikan murid-murid-Nya kelelahan secara langsung. Begitu banyak orang datang dan pergi sehingga mereka tidak sempat makan. Responsnya bukan: dorong terus, misi membutuhkannya. Melainkan: marilah bersama-Ku ke tempat yang sunyi dan beristirahatlah. Ini adalah Yesus — orang dengan urgensi misi terbesar dalam sejarah manusia — yang menyuruh timnya untuk berhenti."
            )}
          </p>
          <p style={{ marginBottom: 28 }}>
            {t(
              "He is not indifferent to your exhaustion. He is not waiting for you to push through and prove yourself. He is actively inviting you to rest — and promising to meet you there. The soul-rest Jesus describes in Matthew 11 is not simply the absence of activity. It is rest in his presence.",
              "Ia tidak acuh terhadap kelelahan Anda. Ia tidak menunggu Anda untuk bertahan dan membuktikan diri. Ia secara aktif mengundang Anda untuk beristirahat — dan berjanji untuk bertemu dengan Anda di sana. Ketenangan jiwa yang Yesus gambarkan dalam Matius 11 bukan sekadar ketiadaan aktivitas. Ini adalah istirahat dalam kehadiran-Nya."
            )}
          </p>
          <p style={{ marginBottom: 28 }}>
            {t(
              "Psalm 23 depicts God not as a supervisor checking your output, but as a shepherd who leads you to still water and makes you lie down — not asks you, but makes you. Sometimes, rest is something God has to guide us into because we have forgotten how to receive it.",
              "Mazmur 23 menggambarkan Allah bukan sebagai atasan yang memeriksa output Anda, tetapi sebagai gembala yang memimpin Anda ke air yang tenang dan membaringkan Anda — bukan meminta Anda, tetapi membaringkan Anda. Terkadang, istirahat adalah sesuatu yang harus Allah pimpin kita masuki karena kita telah lupa bagaimana menerimanya."
            )}
          </p>
          <p style={{ fontFamily: serif, fontSize: "clamp(18px, 2vw, 22px)", fontStyle: "italic", color: navy, lineHeight: 1.75, padding: "8px 0 8px 28px", borderLeft: `3px solid ${orange}`, marginBottom: 16 }}>
            {t(
              "\"He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.\"",
              "\"Ia membaringkan aku di padang yang berumput hijau, Ia membimbing aku ke air yang tenang; Ia menyegarkan jiwaku.\""
            )}
          </p>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em" }}>
            — <VerseRef id="ps-23-2-3">{t("Psalm 23:2—3", "Mazmur 23:2—3")}</VerseRef> (NIV)
          </p>
        </div>
      </div>

      {/* Section 3: Three Portraits */}
      <div style={{ background: lightGray, padding: "96px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
            {t("III. Three Portraits", "III. Tiga Potret")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 20, lineHeight: 1.2, fontStyle: "italic" }}>
            {t("What Collapse Looks Like", "Seperti Apa Keruntuhan Itu")}
          </h2>
          <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)", color: bodyText, lineHeight: 1.85, marginBottom: 64 }}>
            {t(
              "Burnout rarely arrives as a crisis. It builds slowly through patterns we mistake for faithfulness.",
              "Kelelahan jarang datang sebagai krisis. Ia berkembang perlahan melalui pola-pola yang kita salah kira sebagai kesetiaan."
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

      {/* Section 4: The Cross-Cultural Dimension */}
      <div style={{ padding: "96px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
          {t("IV. Across Cultures", "IV. Lintas Budaya")}
        </p>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 40, lineHeight: 1.2, fontStyle: "italic" }}>
          {t("Rest Is Not a Western Invention", "Istirahat Bukan Penemuan Barat")}
        </h2>
        <div style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9 }}>
          <p style={{ marginBottom: 28 }}>
            {t(
              "The Western framework for rest tends to be individual, structured, and time-bound — a scheduled block on a calendar, a clearly delineated weekend. This is one way to practise Sabbath. It is not the only way.",
              "Kerangka Barat untuk istirahat cenderung bersifat individual, terstruktur, dan terikat waktu — blok terjadwal dalam kalender, akhir pekan yang dibatasi dengan jelas. Ini adalah satu cara untuk mempraktikkan Sabat. Ini bukan satu-satunya cara."
            )}
          </p>
          <p style={{ marginBottom: 28 }}>
            {t(
              "In many Asian, African, and Latin American contexts, rest is woven into the communal fabric — into festivals, extended family gatherings, religious assemblies, and seasonal rhythms. The rest is real; it simply does not look like a Western personal day off. The leader who arrives with a foreign framework and tries to enforce it against the existing culture will find both himself and his team burning out.",
              "Dalam banyak konteks Asia, Afrika, dan Amerika Latin, istirahat terjalin ke dalam kain komunal — ke dalam festival, pertemuan keluarga besar, ibadah bersama, dan ritme musiman. Istirahatnya nyata; hanya saja tidak terlihat seperti hari libur pribadi ala Barat. Pemimpin yang datang dengan kerangka asing dan mencoba menerapkannya melawan budaya yang ada akan mendapati dirinya dan timnya kelelahan."
            )}
          </p>
          <p style={{ marginBottom: 28 }}>
            {t(
              "The principle of Sabbath is universal. Its form is contextual. Before you impose your own rest rhythms on a new context, ask: where is rest already present here? What forms does it take? How can I build my personal rhythm around the life of this community rather than against it?",
              "Prinsip Sabat bersifat universal. Bentuknya kontekstual. Sebelum Anda menerapkan ritme istirahat Anda sendiri pada konteks baru, tanyakan: di mana istirahat sudah hadir di sini? Bentuk apa yang diambilnya? Bagaimana saya bisa membangun ritme pribadi saya di sekitar kehidupan komunitas ini dan bukan melawannya?"
            )}
          </p>
          <p style={{ fontFamily: serif, fontSize: "clamp(19px, 2.2vw, 24px)", fontStyle: "italic", color: navy, lineHeight: 1.75, padding: "8px 0 8px 28px", borderLeft: `3px solid ${orange}` }}>
            {t(
              "Your personal Sabbath practice may look different in Surabaya than it did in Rotterdam — and that is not a failure of discipline. It is the work of contextualisation.",
              "Praktik Sabat pribadi Anda mungkin terlihat berbeda di Surabaya dari pada di Rotterdam — dan itu bukan kegagalan disiplin. Itu adalah pekerjaan kontekstualisasi."
            )}
          </p>
        </div>
      </div>

      {/* Section 5: Biblical Foundation */}
      <div style={{ background: navy, padding: "96px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
            {t("V. Biblical Foundation", "V. Dasar Alkitab")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: offWhite, marginBottom: 20, lineHeight: 1.2, fontStyle: "italic" }}>
            {t("The Theology of Rest", "Teologi Istirahat")}
          </h2>
          <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: "oklch(76% 0.03 80)", lineHeight: 1.85, marginBottom: 72 }}>
            {t(
              "Sabbath is not a productivity tool dressed in religious language. It is a theological statement about who God is, who we are, and what the world requires to flourish.",
              "Sabat bukan alat produktivitas yang berpakaian bahasa religius. Ini adalah pernyataan teologis tentang siapa Allah, siapa kita, dan apa yang dibutuhkan dunia untuk berkembang."
            )}
          </p>

          {[
            {
              id: "exod-20-8",
              en_ref: "Exodus 20:8—10", id_ref: "Keluaran 20:8—10",
              en_quote: "\"Remember the Sabbath day by keeping it holy. Six days you shall labor and do all your work, but the seventh day is a sabbath to the Lord your God.\"",
              id_quote: "\"Ingatlah dan kuduskanlah hari Sabat: enam hari lamanya engkau akan bekerja dan melakukan segala pekerjaanmu, tetapi hari ketujuh adalah hari Sabat TUHAN, Allahmu.\"",
              en_body: "The Sabbath commandment is built into the same list as do not murder and do not steal. This is not a lifestyle preference. It is a moral imperative. But notice what the commandment says: remember. Not invent. The Sabbath was already there, built into the creation week. God is asking Israel to align with a rhythm that predates them.",
              id_body: "Perintah Sabat dibangun ke dalam daftar yang sama dengan jangan membunuh dan jangan mencuri. Ini bukan preferensi gaya hidup. Ini adalah imperatif moral. Tetapi perhatikan apa yang perintah itu katakan: ingatlah. Bukan menciptakan. Sabat sudah ada, dibangun ke dalam minggu penciptaan. Allah meminta Israel untuk menyelaraskan diri dengan ritme yang mendahului mereka.",
            },
            {
              id: "mark-6-31",
              en_ref: "Mark 6:31", id_ref: "Markus 6:31",
              en_quote: "\"Come with me by yourselves to a quiet place and get some rest.\"",
              id_quote: "\"Marilah ke tempat yang sunyi, supaya kita sendirian, dan beristirahatlah sebentar!\"",
              en_body: "Jesus spoke these words to his disciples in the middle of an active ministry season — not at the end, not as a reward. He interrupted the work to restore the workers. This is the Jesus who raised the dead and healed the sick — and he still saw the disciples' need for rest as urgent enough to pull them out of the crowd. He was not annoyed by their exhaustion. He made room for it.",
              id_body: "Yesus mengucapkan kata-kata ini kepada murid-murid-Nya di tengah musim pelayanan yang aktif — bukan di akhir, bukan sebagai hadiah. Ia menyela pekerjaan untuk memulihkan para pekerja. Ini adalah Yesus yang membangkitkan orang mati dan menyembuhkan orang sakit — dan Ia masih melihat kebutuhan murid-murid akan istirahat cukup mendesak untuk menarik mereka keluar dari keramaian.",
            },
          ].map((item) => (
            <div key={item.id} style={{ marginBottom: 64 }}>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.1em", marginBottom: 20 }}>
                <VerseRef id={item.id}>{lang === "id" ? item.id_ref : item.en_ref}</VerseRef>
              </p>
              <p style={{ fontFamily: serif, fontSize: "clamp(18px, 2vw, 22px)", fontStyle: "italic", color: offWhite, lineHeight: 1.75, marginBottom: 24 }}>
                {lang === "id" ? item.id_quote : item.en_quote}
              </p>
              <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: "oklch(76% 0.03 80)", lineHeight: 1.85, margin: 0 }}>
                {lang === "id" ? item.id_body : item.en_body}
              </p>
            </div>
          ))}

          {/* Summary theological statement */}
          <div style={{ padding: "40px 40px", background: "oklch(18% 0.09 260)", borderRadius: 4 }}>
            <p style={{ fontFamily: serif, fontSize: "clamp(18px, 2.2vw, 23px)", fontStyle: "italic", color: offWhite, lineHeight: 1.8, marginBottom: 16 }}>
              {t(
                "God cares about your capacity. He is not asking you to give more than you have. He is asking you to trust him enough to stop — and to discover that he is still at work when you are not.",
                "Allah peduli dengan kapasitas Anda. Ia tidak meminta Anda memberi lebih dari yang Anda miliki. Ia meminta Anda mempercayai-Nya cukup untuk berhenti — dan menemukan bahwa Ia masih bekerja ketika Anda tidak bekerja."
              )}
            </p>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: orange, fontWeight: 700, letterSpacing: "0.08em", margin: 0 }}>
              {t("He cares. He invites. He meets you there.", "Ia peduli. Ia mengundang. Ia bertemu Anda di sana.")}
            </p>
          </div>
        </div>
      </div>

      {/* Section 6: Four Practices */}
      <div style={{ padding: "96px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
          {t("VI. Four Practices", "VI. Empat Praktik")}
        </p>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 20, lineHeight: 1.2, fontStyle: "italic" }}>
          {t("Building a Sustainable Rhythm", "Membangun Ritme yang Berkelanjutan")}
        </h2>
        <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: bodyText, lineHeight: 1.85, marginBottom: 56 }}>
          {t(
            "These are not rules for the disciplined. They are invitations for the willing.",
            "Ini bukan aturan bagi yang disiplin. Ini adalah undangan bagi yang mau."
          )}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {PRACTICES.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
              <div style={{ fontFamily: serif, fontSize: "clamp(44px, 5vw, 56px)", fontWeight: 700, color: orange, lineHeight: 1, minWidth: 44, flexShrink: 0, marginTop: -6 }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: bodyText, lineHeight: 1.9, margin: 0 }}>
                {lang === "id" ? p.id : p.en}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 7: One Commitment */}
      <div style={{ background: lightGray, padding: "96px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
            {t("VII. Your Response", "VII. Respons Anda")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 700, color: navy, marginBottom: 20, lineHeight: 1.2, fontStyle: "italic" }}>
            {t("One Practice This Week", "Satu Praktik Minggu Ini")}
          </h2>
          <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: bodyText, lineHeight: 1.85, marginBottom: 16 }}>
            {t(
              "Rest is not something we achieve. It is something we receive.",
              "Istirahat bukan sesuatu yang kita capai. Ini adalah sesuatu yang kita terima."
            )}
          </p>
          <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: bodyText, lineHeight: 1.85, marginBottom: 48 }}>
            {t(
              "What is one practice you will protect this week — not as a discipline to prove, but as an act of trust in God?",
              "Praktik apa yang akan Anda lindungi minggu ini — bukan sebagai disiplin untuk dibuktikan, tetapi sebagai tindakan kepercayaan kepada Allah?"
            )}
          </p>
          {!committed ? (
            <div>
              <textarea
                value={commitment}
                onChange={(e) => setCommitment(e.target.value)}
                placeholder={t(
                  "Write your one practice here...",
                  "Tulis satu praktik Anda di sini..."
                )}
                rows={4}
                style={{ width: "100%", padding: "18px 20px", fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)", color: bodyText, background: offWhite, border: `1px solid oklch(88% 0.01 80)`, borderRadius: 4, resize: "vertical", lineHeight: 1.75, marginBottom: 20, boxSizing: "border-box" }}
              />
              <button
                onClick={() => { if (commitment.trim()) setCommitted(true); }}
                disabled={!commitment.trim()}
                style={{ padding: "14px 36px", border: "none", cursor: commitment.trim() ? "pointer" : "default", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, background: commitment.trim() ? orange : "oklch(88% 0.01 80)", color: commitment.trim() ? offWhite : "oklch(65% 0.01 80)", letterSpacing: "0.06em", borderRadius: 4 }}
              >
                {t("I Commit to This", "Saya Berkomitmen untuk Ini")}
              </button>
            </div>
          ) : (
            <div style={{ background: offWhite, padding: "36px 40px", borderRadius: 4, textAlign: "left" }}>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
                {t("Your commitment", "Komitmen Anda")}
              </p>
              <p style={{ fontFamily: serif, fontSize: "clamp(17px, 1.9vw, 20px)", color: navy, lineHeight: 1.85, fontStyle: "italic", marginBottom: 24 }}>
                "{commitment}"
              </p>
              <p style={{ fontFamily: serif, fontSize: "clamp(15px, 1.6vw, 17px)", color: bodyText, lineHeight: 1.75 }}>
                {t(
                  "He is with you in it. Hold it lightly — as a gift to give, not a standard to maintain.",
                  "Ia bersamamu di dalamnya. Pegang itu dengan ringan — sebagai hadiah untuk diberikan, bukan standar yang harus dipertahankan."
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: navy, padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 700, color: offWhite, marginBottom: 16, fontStyle: "italic" }}>
          {t("Keep Growing", "Terus Bertumbuh")}
        </h2>
        <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: "oklch(76% 0.03 80)", lineHeight: 1.75, maxWidth: 520, margin: "0 auto 40px" }}>
          {t("Explore more training modules to deepen your cross-cultural leadership.", "Jelajahi lebih banyak modul pelatihan untuk memperdalam kepemimpinan lintas budaya Anda.")}
        </p>
        <Link href="/resources" style={{ display: "inline-block", padding: "14px 36px", background: orange, color: offWhite, fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, textDecoration: "none", borderRadius: 4, letterSpacing: "0.04em" }}>
          {t("Training", "Pelatihan")}
        </Link>
      </div>

      {/* Verse Popup */}
      {activeVerse && verseData && (
        <div
          onClick={() => setActiveVerse(null)}
          style={{ position: "fixed", inset: 0, background: "oklch(10% 0.05 260 / 0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: offWhite, borderRadius: 12, padding: "44px 40px", maxWidth: 540, width: "100%" }}
          >
            <p style={{ fontFamily: serif, fontSize: 22, lineHeight: 1.7, color: navy, fontStyle: "italic", marginBottom: 20 }}>
              "{lang === "id" ? verseData.id : verseData.en}"
            </p>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em", marginBottom: 28 }}>
              — {lang === "id" ? verseData.id_ref : verseData.en_ref}{" "}
              {lang === "id" ? "(TB)" : "(NIV)"}
            </p>
            <button
              onClick={() => setActiveVerse(null)}
              style={{ padding: "10px 24px", background: navy, color: offWhite, border: "none", borderRadius: 12, fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
            >
              {t("Close", "Tutup")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
