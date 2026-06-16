"use client";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";
import SourcesDropdown from "@/components/SourcesDropdown";

type Lang = "en" | "id";
const tFn = (en: string, id: string, lang: Lang) => lang === "en" ? en : id;

const BIBLE_CARDS = [
  {
    en_label: "Israel",
    id_label: "Israel",
    en_body: "God did not call one person to be his witness among the nations. He called a whole people. Their identity as a community was part of the calling itself, not the container for it.",
    id_body: "Allah tidak memanggil satu orang untuk menjadi saksi-Nya di antara bangsa-bangsa. Ia memanggil seluruh umat. Identitas mereka sebagai komunitas adalah bagian dari panggilan itu sendiri, bukan sekadar wadahnya.",
    en_verse: "\"You are my witnesses,\" declares the Lord, \"and my servant whom I have chosen, so that you may know and believe me and understand that I am he.\"",
    id_verse: "\"Kamu adalah saksi-saksi-Ku,\" demikianlah firman Tuhan, \"dan hamba-Ku yang telah Aku pilih, supaya kamu tahu dan percaya kepada-Ku serta mengerti, bahwa Aku tetap Dia.\"",
    en_ref: "Isaiah 43:10",
    id_ref: "Yesaya 43:10",
  },
  {
    en_label: "The Twelve",
    id_label: "Dua Belas Murid",
    en_body: "Jesus did not pick one disciple and send him out alone. He chose twelve as a group, trained them together, and sent them in pairs. The mission was shaped by the team from the very beginning.",
    id_body: "Yesus tidak memilih satu murid dan mengirimnya sendirian. Ia memilih dua belas sebagai satu kelompok, melatih mereka bersama-sama, dan mengutus mereka berdua-dua. Misi itu dibentuk oleh tim sejak awal.",
    en_verse: "He appointed twelve that they might be with him and that he might send them out to preach and to have authority to drive out demons.",
    id_verse: "Ia menetapkan dua belas orang untuk menyertai Dia dan untuk diutus-Nya memberitakan Injil dan diberi-Nya kuasa untuk mengusir setan.",
    en_ref: "Mark 3:14–15",
    id_ref: "Markus 3:14–15",
  },
  {
    en_label: "Antioch",
    id_label: "Antiokhia",
    en_body: "When the Spirit said 'set apart Barnabas and Saul,' it was not a private message to two individuals. The whole church fasted, prayed, laid hands on them, and sent them. The sending was a community act.",
    id_body: "Ketika Roh berkata 'pisahkanlah Barnabas dan Saulus,' itu bukan pesan pribadi kepada dua individu. Seluruh jemaat berpuasa, berdoa, menumpangkan tangan, dan mengutus mereka. Pengutusan itu adalah tindakan bersama.",
    en_verse: "While they were worshipping the Lord and fasting, the Holy Spirit said, \"Set apart for me Barnabas and Saul for the work to which I have called them.\" So after they had fasted and prayed, they placed their hands on them and sent them off.",
    id_verse: "Pada suatu hari ketika mereka beribadah kepada Tuhan dan berpuasa, berkatalah Roh Kudus: \"Khususkanlah Barnabas dan Saulus bagi-Ku untuk tugas yang telah Kutentukan bagi mereka.\" Maka berpuasa dan berdoalah mereka, dan setelah meletakkan tangan ke atas kedua orang itu, mereka membiarkan keduanya pergi.",
    en_ref: "Acts 13:2–3",
    id_ref: "Kisah Para Rasul 13:2–3",
  },
  {
    en_label: "Nehemiah",
    id_label: "Nehemia",
    en_body: "Nehemiah received a vision. But the wall was rebuilt by families, clans, and work groups, each doing the section nearest their own home. The vision came to one person. The work required everyone.",
    id_body: "Nehemia menerima sebuah visi. Tetapi tembok itu dibangun kembali oleh keluarga, klan, dan kelompok kerja, masing-masing mengerjakan bagian terdekat dari rumah mereka. Visi itu datang kepada satu orang. Pekerjaannya membutuhkan semua orang.",
    en_verse: "Then I said to them, \"You see the trouble we are in... Come, let us rebuild the wall of Jerusalem.\" I also told them about the gracious hand of my God on me. They replied, \"Let us start rebuilding.\" So they began this good work.",
    id_verse: "Lalu aku berkata kepada mereka: \"Kamu melihat kecelakaan yang kita alami... Marilah kita membangun kembali tembok Yerusalem.\" Aku juga menceritakan kepada mereka tentang tangan Allahku yang melindungi aku. Mereka berkata: \"Kami siap untuk membangun.\" Dan mereka mulai melakukan pekerjaan yang baik itu.",
    en_ref: "Nehemiah 2:17–18",
    id_ref: "Nehemia 2:17–18",
  },
  {
    en_label: "The Early Church",
    id_label: "Gereja Mula-mula",
    en_body: "Elders were always appointed in groups, never alone. The church recognized gifts together. No leader was placed into position on their own, and no one was sent alone. It was always a shared act.",
    id_body: "Penatua selalu diangkat dalam kelompok, tidak pernah sendirian. Jemaat mengakui karunia bersama-sama. Tidak ada pemimpin yang ditetapkan sendiri, dan tidak ada yang diutus sendirian. Itu selalu merupakan tindakan bersama.",
    en_verse: "Paul and Barnabas appointed elders for them in each church and, with prayer and fasting, committed them to the Lord, in whom they had put their trust.",
    id_verse: "Di tiap-tiap jemaat rasul-rasul itu menetapkan penatua-penatua bagi jemaat itu dan setelah berdoa dan berpuasa, mereka menyerahkan penatua-penatua itu kepada Tuhan, yang adalah kepercayaan mereka.",
    en_ref: "Acts 14:23",
    id_ref: "Kisah Para Rasul 14:23",
  },
];


type Props = { isSaved: boolean };

export default function CallingIsNeverSoloClient({ isSaved: initialSaved }: Props) {
  const { lang: ctxLang } = useLanguage();
  const lang: Lang = ctxLang === "id" ? "id" : "en";
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [bgOpen, setBgOpen] = useState(false);

  const t = (en: string, id: string) => tFn(en, id, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("calling-is-never-solo");
      setSaved(true);
    });
  }

  const navy    = "oklch(22% 0.10 260)";
  const orange  = "oklch(65% 0.15 45)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const bodyText = "oklch(38% 0.05 260)";
  const serif   = "var(--font-cormorant, Cormorant Garamond, Georgia, serif)";

  const RESEARCH_BG_PARAS_EN = [
    `The pattern of communal calling runs through the whole of Scripture. Israel was called as a people, not merely as a collection of individuals. In Acts 13:1–3, the commissioning of Paul and Barnabas followed communal fasting, prayer, and confirmation: the whole church laid hands on them and sent them together. Biblical scholars have identified this Antioch pattern as the normative model for vocational commissioning. The congregation's ethnic diversity and apostolic team structure were not incidental to the commissioning; they were constitutive of it.`,
    `The Reformation tradition formalised what Scripture implied: the distinction between the internal call (one's own sense of vocation) and the external call (community recognition and confirmation). The internal call alone is considered insufficient for legitimate ministry. Not because God cannot speak to individuals, but because the human capacity for self-deception is real. The external call provides a structural check. Fuller Seminary's vocational formation framework extends this into a 'locus and focus' model: the locus of calling is the community from which it emerges; the focus is the specific work to which it points.`,
    `The individualist model of calling is largely a Western development, shaped by Enlightenment ideas about personal identity and individual moral agency. Cultural research scores Indonesia's individualism at 14 and Malaysia's at 26 (Hofstede Insights), among the most collectivist societies globally. In such contexts, identity and vocation are relational by default: calling is not primarily a private discovery but something the community sees in a person, names aloud, and sends them into. Missiologists have documented how importing Western calling frameworks into collectivist contexts creates friction, while community-first approaches aligned with Acts 16:31 are both missiologically effective and culturally coherent.`,
    `Empirical research has quantified the cost of calling without community. Among cross-cultural workers, the Lausanne Movement estimated approximately 1,500 North American ministry workers leave their positions monthly. The ReMAP II study, spanning 22 countries and 600 agencies, found that agencies with fewer than 50 workers lose approximately 33% of their field workers annually, compared to just 6% for larger organisations. Inadequate home support and peer isolation ranked consistently among the most preventable causes of attrition. The pattern holds in secular leadership too: studies of senior leaders find that 50% experience significant loneliness, with 61% reporting it hampers their effectiveness.`,
    `The New Testament never pictures isolated calling as the norm. Jesus sent the seventy-two in pairs (Luke 10:1). Paul always travelled with co-workers. Elders were appointed in groups, never individually. Henri Nouwen identified the antidote to isolated leadership as communities where "power is decentralised, shared, and rich in honesty and accountability." The accountability relationships essential for sustainable Christian workers include moral, spiritual, financial, relational, missiological, and organisational dimensions. The communal calling model is not a modern innovation or a cultural accommodation. It is the original pattern.`,
  ];

  const RESEARCH_BG_PARAS_ID = [
    `Pola panggilan komunal mengalir melalui seluruh Kitab Suci. Israel dipanggil sebagai satu umat, bukan sekadar kumpulan individu. Dalam Kisah Para Rasul 13:1–3, pengutusan Paulus dan Barnabas didahului oleh puasa, doa, dan konfirmasi bersama: seluruh jemaat menumpangkan tangan dan mengutus mereka bersama-sama. Para teolog Alkitab telah mengidentifikasi pola Antiokhia ini sebagai model normatif untuk penugasan vokasional. Keragaman etnis jemaat dan struktur tim apostolik bukan sekadar latar pengutusan, melainkan bagian konstitutifnya.`,
    `Tradisi Reformasi memformalkan apa yang tersirat dalam Kitab Suci: perbedaan antara panggilan internal (rasa panggilan seseorang) dan panggilan eksternal (pengakuan dan konfirmasi komunitas). Panggilan internal saja dianggap tidak cukup untuk pelayanan yang sah. Bukan karena Allah tidak dapat berbicara kepada individu, tetapi karena kapasitas manusia untuk menipu diri sendiri adalah nyata. Panggilan eksternal memberikan pemeriksaan struktural. Kerangka pembentukan vokasional Fuller Seminary memperluas ini menjadi model 'locus dan fokus': locus panggilan adalah komunitas dari mana ia muncul; fokusnya adalah pekerjaan spesifik yang ditunjuknya.`,
    `Model panggilan individualistis sebagian besar merupakan perkembangan Barat, dibentuk oleh gagasan-gagasan Pencerahan tentang identitas pribadi dan agen moral individual. Riset budaya memberi skor individualisme Indonesia sebesar 14 dan Malaysia sebesar 26, termasuk masyarakat yang paling kolektivistis secara global. Dalam konteks seperti itu, identitas dan panggilan secara alami bersifat relasional: panggilan bukan terutama penemuan pribadi, melainkan sesuatu yang komunitas lihat dalam seseorang, nyatakan dengan lantang, dan utus mereka ke dalamnya. Para misiolog telah mendokumentasikan bagaimana mengimpor kerangka panggilan Barat ke konteks kolektivistis menciptakan gesekan, sementara pendekatan komunitas-pertama yang selaras dengan Kisah Para Rasul 16:31 efektif secara missiologis dan koheren secara budaya.`,
    `Penelitian empiris telah mengkuantifikasi biaya panggilan tanpa komunitas. Di antara para pekerja lintas budaya, Gerakan Lausanne memperkirakan sekitar 1.500 pekerja pelayanan Amerika Utara meninggalkan posisi mereka setiap bulan. Studi ReMAP II, mencakup 22 negara dan 600 lembaga, menemukan bahwa lembaga dengan kurang dari 50 pekerja kehilangan sekitar 33% pekerja lapangan mereka setiap tahun, dibandingkan hanya 6% untuk organisasi yang lebih besar. Dukungan rumah yang tidak memadai dan isolasi sesama rekan kerja secara konsisten berada di antara penyebab gesekan yang paling bisa dicegah. Pola ini juga berlaku dalam kepemimpinan sekuler: studi terhadap pemimpin senior menemukan bahwa 50% mengalami kesepian yang signifikan, dengan 61% melaporkan hal itu menghambat efektivitas mereka.`,
    `Perjanjian Baru tidak pernah menggambarkan panggilan terisolasi sebagai norma. Yesus mengutus tujuh puluh dua orang berdua-dua (Lukas 10:1). Paulus selalu bepergian bersama rekan-rekan kerja. Penatua diangkat dalam kelompok, tidak pernah secara individual. Henri Nouwen mengidentifikasi penangkal kepemimpinan yang terisolasi sebagai komunitas di mana "kekuasaan didesentralisasi, dibagikan, dan kaya akan kejujuran dan akuntabilitas." Hubungan akuntabilitas yang esensial bagi pekerja Kristen yang berkelanjutan mencakup dimensi moral, spiritual, keuangan, relasional, missiologis, dan organisasional. Model panggilan komunal bukan inovasi modern atau akomodasi budaya. Ia adalah pola aslinya.`,
  ];

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>
      <LangToggle />

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <div style={{ background: navy, padding: "88px 24px 80px", position: "relative", overflow: "hidden" }}>
        <img src="/images/resources/calling-is-never-solo/hero.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.18, mixBlendMode: "luminosity", pointerEvents: "none" }} />
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {t("Faith & Calling — Guide", "Iman & Panggilan — Panduan")}
          </p>
          <h1 style={{ fontFamily: serif, fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, color: offWhite, margin: "0 0 24px", lineHeight: 1.08 }}>
            {t("Calling Is Never Solo", "Panggilan Tak Pernah Sendirian")}
          </h1>
          <div style={{ width: 48, height: 1, background: orange, margin: "0 auto 32px" }} />
          <p style={{ fontFamily: serif, fontSize: "clamp(19px, 2.5vw, 23px)", color: "oklch(82% 0.025 80)", lineHeight: 1.75, marginBottom: 40, fontStyle: "italic" }}>
            {t(
              "Your calling is one thread in a much larger tapestry. How God builds through communities, teams, and generations, and what it means to steward your part well.",
              "Panggilanmu adalah satu benang dalam permadani yang jauh lebih besar. Bagaimana Allah membangun melalui komunitas, tim, dan generasi, dan apa artinya mengelola bagianmu dengan baik."
            )}
          </p>
          <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: "oklch(72% 0.025 80)", lineHeight: 1.75, maxWidth: 580, margin: "0 auto 48px" }}>
            {t("If the whole body were an eye, where would the sense of hearing be?", "Kalau seluruh tubuh adalah mata, di manakah pendengaran?")}
            <span style={{ display: "block", marginTop: 10, fontSize: 13, color: orange, fontWeight: 700, letterSpacing: "0.08em", fontStyle: "normal" }}>
              {t("1 Corinthians 12:17", "1 Korintus 12:17")}
            </span>
          </p>
          <button
            onClick={handleSave}
            disabled={saved || isPending}
            style={{ padding: "12px 28px", border: "none", cursor: saved ? "default" : "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, background: saved ? "oklch(35% 0.05 260)" : orange, color: offWhite, letterSpacing: "0.04em", borderRadius: 4 }}
          >
            {saved ? t("Saved to Dashboard", "Tersimpan di Dashboard") : t("Save to Dashboard", "Simpan ke Dashboard")}
          </button>
        </div>
      </div>

      {/* ── Hook ───────────────────────────────────────────────────── */}
      <div style={{ padding: "80px 24px 48px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: "clamp(19px, 2.2vw, 24px)", fontStyle: "italic", color: navy, lineHeight: 1.8, padding: "0 0 0 28px", borderLeft: `3px solid ${orange}` }}>
          {t(
            "You have probably heard it said that God has a plan for your life. A personal plan. A specific calling, meant just for you, found in quiet moments alone. People who accepted this idea and people who quietly questioned it can end up in the same place: doing the work of God in growing isolation, wondering why it feels smaller than it should.",
            "Anda mungkin pernah mendengar bahwa Allah memiliki rencana bagi hidup Anda. Rencana pribadi. Panggilan khusus, hanya untuk Anda, ditemukan dalam momen-momen sunyi sendirian. Orang yang menerima gagasan ini dan orang yang diam-diam meragukannya bisa berakhir di tempat yang sama: melakukan pekerjaan Allah dalam kesendirian yang semakin besar, bertanya-tanya mengapa rasanya lebih kecil dari seharusnya."
          )}
        </p>

        <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: bodyText, lineHeight: 1.85, marginTop: 32 }}>
          {t(
            "The idea that calling can be received and lived in isolation runs against the grain of nearly every biblical text that describes it. Across cultures and traditions, the pattern is consistent: calling requires witnesses, senders, and community to become fully itself. Research confirms what Scripture assumed: leaders who pursue calling alone face structural fragility, not just relational loneliness. Studies show 50% of senior leaders experience significant isolation, with 61% reporting it hinders their effectiveness.¹ Among cross-cultural workers, approximately 1,500 leave ministry roles monthly in North America alone,² and agencies with fewer than 50 workers lose up to 33% of their field workers each year.³",
            "Gagasan bahwa panggilan dapat diterima dan dijalani dalam kesendirian bertentangan dengan hampir setiap teks Alkitab yang menggambarkannya. Di seluruh budaya dan tradisi, polanya konsisten: panggilan membutuhkan saksi, pengutus, dan komunitas agar menjadi sepenuhnya dirinya sendiri. Penelitian mengkonfirmasi apa yang Kitab Suci asumsikan: pemimpin yang mengejar panggilan sendirian menghadapi kerapuhan struktural. Penelitian menunjukkan 50% pemimpin senior mengalami isolasi yang signifikan, dengan 61% melaporkan hal itu menghambat efektivitas mereka.¹ Di antara pekerja lintas budaya, sekitar 1.500 meninggalkan peran pelayanan setiap bulan di Amerika Utara saja,² dan lembaga dengan kurang dari 50 pekerja kehilangan hingga 33% pekerja lapangan mereka setiap tahun.³"
          )}
        </p>

        <div style={{ marginTop: 32, borderTop: "1px solid oklch(90% 0.008 80)", paddingTop: 24 }}>
          <button
            onClick={() => setBgOpen(o => !o)}
            aria-expanded={bgOpen}
            aria-controls="cins-research-bg"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 8, fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, color: navy, letterSpacing: "0.04em" }}
          >
            <span style={{ color: orange }}>{bgOpen ? "↑" : "→"}</span>
            {bgOpen ? t("Hide the research ↑", "Sembunyikan penelitian ↑") : t("Read the research →", "Baca penelitiannya →")}
          </button>
          {bgOpen && (
            <div id="cins-research-bg" style={{ marginTop: 20, padding: "28px 32px", background: lightGray, borderRadius: 6 }}>
              {(lang === "en" ? RESEARCH_BG_PARAS_EN : RESEARCH_BG_PARAS_ID).map((para, i) => (
                <p key={i} style={{ fontFamily: serif, fontSize: "clamp(15px, 1.6vw, 17px)", color: bodyText, lineHeight: 1.85, marginBottom: i < RESEARCH_BG_PARAS_EN.length - 1 ? 20 : 0 }}>{para}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "48px auto 0", padding: "0 24px" }}>
        <div style={{ height: 1, background: "oklch(90% 0.008 80)" }} />
      </div>

      {/* ── Section 1: The Story We Were Told ─────────────────────── */}
      <div style={{ padding: "80px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 24 }}>
          {t("The Myth", "Mitos")}
        </p>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 32, lineHeight: 1.2, fontStyle: "italic" }}>
          {t("The Story We Were Told", "Cerita yang Kita Dengar")}
        </h2>
        <div style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9 }}>
          <p style={{ marginBottom: 24 }}>
            {t(
              "It is true that God speaks to individuals. Moses heard a voice from a burning bush. Paul was stopped on a road. Samuel heard his name called in the night. These are real moments of personal encounter, and they matter.",
              "Memang benar bahwa Allah berbicara kepada individu. Musa mendengar suara dari semak yang menyala. Paulus dihentikan di jalan. Samuel mendengar namanya dipanggil di malam hari. Ini adalah momen perjumpaan pribadi yang nyata, dan itu penting."
            )}
          </p>
          <p style={{ marginBottom: 24 }}>
            {t(
              "But notice what comes next in every one of those stories. Moses is immediately sent back to his people. Paul is directed into community and is shaped by Ananias, Barnabas, and the church at Antioch. Samuel's calling is tied from the start to a people, a covenant, and a generation he will serve. The personal encounter is real. But it is never the whole story. It is the beginning of one.",
              "Tetapi perhatikan apa yang terjadi selanjutnya dalam setiap cerita itu. Musa segera diutus kembali kepada bangsanya. Paulus diarahkan ke dalam komunitas dan dibentuk oleh Ananias, Barnabas, dan jemaat di Antiokhia. Panggilan Samuel sejak awal terikat kepada sebuah bangsa, sebuah perjanjian, dan sebuah generasi yang akan ia layani. Perjumpaan pribadi itu nyata. Tetapi itu tidak pernah menjadi keseluruhan cerita. Itu adalah awal dari satu cerita."
            )}
          </p>
          <p style={{ marginBottom: 0 }}>
            {t(
              "The idea that calling is a private experience, uniquely yours, lived out alone, needing no community to make it real, is not what we see in Scripture. It is more a product of Western, individualist thinking that has shaped how many of us read the Bible. Much of the world has always found this reading strange. In cultures where identity is naturally relational, the idea that God would speak your calling to you alone, and that you would carry it alone, feels foreign and small. They were right to notice.",
              "Gagasan bahwa panggilan adalah pengalaman pribadi, hanya milikmu, dijalani sendirian, tidak membutuhkan komunitas untuk membuatnya nyata, bukanlah apa yang kita lihat dalam Kitab Suci. Ini lebih merupakan produk dari pemikiran Barat dan individualistis yang telah membentuk cara banyak dari kita membaca Alkitab. Sebagian besar dunia selalu merasa bacaan ini aneh. Dalam budaya di mana identitas secara alami bersifat relasional, gagasan bahwa Allah akan berbicara panggilan Anda kepada Anda sendirian, dan bahwa Anda akan membawanya sendirian, terasa asing dan kecil. Mereka benar untuk memperhatikan hal ini."
            )}
          </p>
        </div>
      </div>

      {/* ── Section 2: How We See God Work in the Bible ───────────── */}
      <div style={{ background: lightGray, padding: "80px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 24 }}>
            {t("The Pattern", "Pola")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 16, lineHeight: 1.2, fontStyle: "italic" }}>
            {t("How We See God Work in the Bible", "Bagaimana Kita Melihat Allah Bekerja dalam Alkitab")}
          </h2>
          <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9, marginBottom: 48 }}>
            {t(
              "Again and again in Scripture, calling is not just received privately. It is shaped, sent, and sustained through community. Five examples show how consistent this pattern is.",
              "Berulang kali dalam Kitab Suci, panggilan tidak hanya diterima secara pribadi. Ia dibentuk, diutus, dan ditopang melalui komunitas. Lima contoh menunjukkan betapa konsistennya pola ini."
            )}
          </p>
          <p style={{ fontFamily: serif, fontSize: "clamp(14px, 1.5vw, 16px)", color: bodyText, lineHeight: 1.7, marginBottom: 36, fontStyle: "italic" }}>
            {t("Tap each card to see the Bible verse.", "Ketuk setiap kartu untuk melihat ayat Alkitabnya.")}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {BIBLE_CARDS.map((card, i) => {
              const isOpen = expandedCard === i;
              return (
                <div key={i} style={{ background: offWhite, borderRadius: 6, borderLeft: `4px solid ${orange}`, overflow: "hidden" }}>
                  <button
                    onClick={() => setExpandedCard(isOpen ? null : i)}
                    style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: "28px 32px", display: "flex", alignItems: "flex-start", gap: 20 }}
                  >
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.12em", textTransform: "uppercase", flexShrink: 0, marginTop: 4 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
                        {lang === "en" ? card.en_label : card.id_label}
                      </p>
                      <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: bodyText, lineHeight: 1.85, margin: 0 }}>
                        {lang === "en" ? card.en_body : card.id_body}
                      </p>
                    </div>
                    <span style={{ fontFamily: serif, fontSize: 18, color: orange, flexShrink: 0, marginTop: 2, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none" }}>▾</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: "0 32px 28px 72px", borderTop: `1px solid oklch(90% 0.008 80)` }}>
                      <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", fontStyle: "italic", color: navy, lineHeight: 1.85, margin: "24px 0 12px", paddingLeft: 16, borderLeft: `2px solid ${orange}` }}>
                        {lang === "en" ? card.en_verse : card.id_verse}
                      </p>
                      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.08em", margin: 0 }}>
                        — {lang === "en" ? card.en_ref : card.id_ref}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Section 3: A Fragment, Not the Whole ──────────────────── */}
      <div style={{ padding: "80px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 24 }}>
          {t("The Body", "Tubuh")}
        </p>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 32, lineHeight: 1.2, fontStyle: "italic" }}>
          {t("A Fragment, Not the Whole", "Sepotong, Bukan Keseluruhan")}
        </h2>
        <div style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9 }}>
          <p style={{ marginBottom: 24 }}>
            {t(
              "1 Corinthians 12 uses the body not to celebrate personal gifts, but to show how wrong it is for one part to think it can be the whole. The eye cannot say to the hand, 'I don't need you.' The foot cannot decide the body has no use for an ear. Each part is real. Each part matters. But none of them is the whole.",
              "1 Korintus 12 menggunakan tubuh bukan untuk merayakan karunia pribadi, tetapi untuk menunjukkan betapa salahnya satu bagian yang berpikir ia bisa menjadi keseluruhan. Mata tidak bisa berkata kepada tangan, 'Aku tidak membutuhkanmu.' Kaki tidak bisa memutuskan bahwa tubuh tidak memerlukan telinga. Setiap bagian itu nyata. Setiap bagian penting. Tetapi tidak satu pun dari mereka adalah keseluruhannya."
            )}
          </p>
          <p style={{ marginBottom: 24 }}>
            {t(
              "Working alongside others is not easy. In most parts of the world, human instinct pulls toward self-sufficiency, toward doing things your own way, toward protecting what you have built. This is not a character flaw. It is simply the natural pull of the human heart. That is exactly why Jesus prays: not for our individual success, but for our unity.",
              "Bekerja bersama orang lain tidaklah mudah. Di sebagian besar dunia, naluri manusia menarik ke arah kemandirian, ke arah melakukan segalanya dengan cara sendiri, ke arah melindungi apa yang sudah dibangun. Ini bukan cacat karakter. Itu hanya tarikan alami hati manusia. Itulah tepatnya mengapa Yesus berdoa: bukan untuk keberhasilan individu kita, tetapi untuk kesatuan kita."
            )}
          </p>

          {/* John 17:23 quote */}
          <div style={{ padding: "28px 32px", borderLeft: `3px solid ${orange}`, background: lightGray, borderRadius: "0 6px 6px 0", marginBottom: 24 }}>
            <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 21px)", fontStyle: "italic", color: navy, lineHeight: 1.8, margin: "0 0 12px" }}>
              {t(
                "\"May they be brought to complete unity. Then the world will know that you sent me and have loved them even as you have loved me.\"",
                "\"Supaya mereka sempurna menjadi satu, agar dunia tahu, bahwa Engkau yang telah mengutus Aku dan bahwa Engkau mengasihi mereka, sama seperti Engkau mengasihi Aku.\""
              )}
            </p>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.08em", margin: 0 }}>
              — {t("John 17:23", "Yohanes 17:23")}
            </p>
          </div>

          <p style={{ marginBottom: 24 }}>
            {t(
              "Unity among followers of Jesus is not simply a nice thing to have. It is, according to Jesus himself, the evidence that God sent him and loves the world. The way we work together, or fail to, is a witness to something beyond us.",
              "Kesatuan di antara pengikut Yesus bukan sekadar hal yang baik untuk dimiliki. Menurut Yesus sendiri, itu adalah bukti bahwa Allah mengutus-Nya dan mengasihi dunia. Cara kita bekerja bersama, atau gagal melakukannya, adalah kesaksian tentang sesuatu yang melampaui kita."
            )}
          </p>
          <p style={{ marginBottom: 0 }}>
            {t(
              "This is why the Great Commission is not a solo assignment. 'Go and make disciples of all nations' was spoken to a group, not a single person. And the pattern of how disciples are made, one life investing in another, generation after generation, requires relationship, community, and time. Your calling makes full sense inside a body. Outside one, it tends to drift, shrink, or harden. You were not designed to carry it alone.",
              "Inilah mengapa Amanat Agung bukan tugas solo. 'Pergilah dan jadikanlah semua bangsa murid-Ku' diucapkan kepada sekelompok orang, bukan satu orang. Dan pola bagaimana murid-murid dibentuk, satu kehidupan berinvestasi dalam kehidupan lain, generasi demi generasi, membutuhkan hubungan, komunitas, dan waktu. Panggilanmu sepenuhnya masuk akal di dalam tubuh. Di luarnya, ia cenderung melayang, mengecil, atau mengeras. Anda tidak dirancang untuk menanggungnya sendirian."
            )}
          </p>
        </div>
      </div>

      {/* ── Section 4: When Vision Becomes Isolation ──────────────── */}
      <div style={{ background: navy, padding: "80px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 24 }}>
            {t("The Warning", "Peringatan")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: offWhite, marginBottom: 32, lineHeight: 1.2, fontStyle: "italic" }}>
            {t("When Vision Becomes Isolation", "Ketika Visi Menjadi Isolasi")}
          </h2>
          <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: "oklch(76% 0.03 80)", lineHeight: 1.9, marginBottom: 32 }}>
            {t(
              "A calling lived without community becomes a closed system. No one to question it. No one to correct it. No one to see the parts that have quietly gone wrong.",
              "Sebuah panggilan yang dijalani tanpa komunitas menjadi sistem tertutup. Tidak ada yang mempertanyakannya. Tidak ada yang mengoreksinya. Tidak ada yang melihat bagian-bagian yang diam-diam telah salah arah."
            )}
          </p>
          <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: "oklch(76% 0.03 80)", lineHeight: 1.9, marginBottom: 40 }}>
            {t(
              "When a leader keeps their vision separate from others, three things tend to follow: the vision grows rigid around what the leader cannot see in themselves, blind spots stay hidden until they become costly, and the fruit is real but thinner than it could have been. This is not a shame diagnosis. It is a structural one. The design was always communal.",
              "Ketika seorang pemimpin memisahkan visi mereka dari orang lain, tiga hal cenderung terjadi: visi menjadi kaku di sekitar apa yang tidak bisa dilihat pemimpin dalam dirinya sendiri, titik buta tetap tersembunyi sampai menjadi mahal, dan buahnya nyata tetapi lebih tipis dari yang seharusnya. Ini bukan diagnosis rasa malu. Ini adalah diagnosis struktural. Rancangannya selalu bersifat komunal."
            )}
          </p>

          {/* Lone Wolf → Messiah Complex */}
          <div style={{ background: "oklch(18% 0.09 260)", borderRadius: 6, padding: "36px 40px", marginBottom: 40 }}>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
              {t("Lone Wolf → Messiah Complex", "Lone Wolf → Messiah Complex")}
            </p>
            <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: "oklch(76% 0.03 80)", lineHeight: 1.85, marginBottom: 20 }}>
              {t(
                "The lone wolf pattern begins quietly. A gifted leader starts to feel that others slow them down, that the community doesn't fully understand the vision, that it is faster and cleaner to work alone. So they pull back. Accountability fades. Correction stops reaching them.",
                "Pola lone wolf dimulai dengan tenang. Seorang pemimpin yang berbakat mulai merasa bahwa orang lain memperlambat mereka, bahwa komunitas tidak sepenuhnya memahami visi, bahwa lebih cepat dan lebih bersih bekerja sendiri. Jadi mereka menarik diri. Akuntabilitas memudar. Koreksi berhenti menjangkau mereka."
              )}
            </p>
            <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: "oklch(76% 0.03 80)", lineHeight: 1.85, marginBottom: 20 }}>
              {t(
                "Left unchecked, this becomes something more dangerous: the belief, not always conscious, that only they can carry the work. The burden grows. The control tightens. The circle of trust shrinks to one. This is what is often called a Messiah Complex: the leader who believes the mission depends entirely on them staying at the centre of it.",
                "Jika dibiarkan, ini menjadi sesuatu yang lebih berbahaya: keyakinan, tidak selalu disadari, bahwa hanya mereka yang bisa mengemban pekerjaan itu. Beban bertambah berat. Kontrol semakin ketat. Lingkaran kepercayaan menyusut menjadi satu orang. Inilah yang sering disebut Messiah Complex: pemimpin yang percaya bahwa misi sepenuhnya bergantung pada diri mereka tetap berada di pusatnya."
              )}
            </p>
            <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", fontStyle: "italic", color: offWhite, lineHeight: 1.85, margin: 0 }}>
              {t(
                "The antidote is not less passion. It is more community. Jesus, who actually was the Messiah, washed feet. He prayed for unity among his followers. He built a team and sent them together. If even he did not work alone, we have no good reason to.",
                "Penangkalnya bukan semangat yang lebih sedikit. Melainkan komunitas yang lebih banyak. Yesus, yang memang benar-benar adalah Mesias, membasuh kaki. Ia berdoa untuk kesatuan di antara para pengikut-Nya. Ia membangun sebuah tim dan mengutus mereka bersama-sama. Jika bahkan Dia tidak bekerja sendirian, kita tidak punya alasan yang baik untuk melakukannya."
              )}
            </p>
          </div>

          <div style={{ background: "oklch(18% 0.09 260)", borderRadius: 6, padding: "36px 40px" }}>
            <p style={{ fontFamily: serif, fontSize: "clamp(18px, 2.2vw, 23px)", fontStyle: "italic", color: offWhite, lineHeight: 1.8, margin: 0 }}>
              {t(
                "A calling that has no one to send it, pray for it, correct it, or stand beside it is not a fully formed calling. It is a seed that has not yet found soil.",
                "Panggilan yang tidak memiliki siapa pun untuk mengutusnya, mendoakannya, mengoreksinya, atau berdiri di sampingnya bukanlah panggilan yang sepenuhnya terbentuk. Itu adalah benih yang belum menemukan tanah."
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ── Section 5: A Calling That Cannot Be Held ──────────────── */}
      <div style={{ padding: "80px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 24 }}>
          {t("The Generations", "Generasi")}
        </p>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 32, lineHeight: 1.2, fontStyle: "italic" }}>
          {t("A Calling That Cannot Be Held", "Panggilan yang Tidak Bisa Digenggam Sendiri")}
        </h2>
        <div style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9 }}>
          <p style={{ marginBottom: 24 }}>
            {t(
              "The patterns are too consistent to ignore. Moses hands the staff to Joshua. Elijah throws his cloak over Elisha before he has said a word. Paul writes to Timothy with the warmth of a father who knows his time is short. In every case, the calling does not end with the person who first received it. It moves. It passes. It multiplies through relationship, trust, and deliberate letting go.",
              "Polanya terlalu konsisten untuk diabaikan. Musa menyerahkan tongkatnya kepada Yosua. Elia melemparkan jubahnya kepada Elisa bahkan sebelum mengucapkan sepatah kata. Paulus menulis kepada Timotius dengan kehangatan seorang ayah yang tahu waktunya tinggal sedikit. Dalam setiap kasus, panggilan itu tidak berakhir pada orang yang pertama menerimanya. Ia bergerak. Ia diteruskan. Ia berlipat ganda melalui hubungan, kepercayaan, dan pelepasan yang disengaja."
            )}
          </p>

          {/* 2 Timothy 2:2 */}
          <div style={{ padding: "28px 32px", borderLeft: `3px solid ${orange}`, background: lightGray, borderRadius: "0 6px 6px 0", marginBottom: 24 }}>
            <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 21px)", fontStyle: "italic", color: navy, lineHeight: 1.8, margin: "0 0 12px" }}>
              {t(
                "\"And the things you have heard me say in the presence of many witnesses entrust to reliable people who will also be qualified to teach others.\"",
                "\"Apa yang telah engkau dengar dari padaku di depan banyak saksi, percayakanlah itu kepada orang-orang yang dapat dipercayai, yang juga cakap mengajar orang lain.\""
              )}
            </p>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.08em", margin: 0 }}>
              — {t("2 Timothy 2:2", "2 Timotius 2:2")}
            </p>
          </div>

          <p style={{ marginBottom: 24 }}>
            {t(
              "In one verse, Paul describes four generations: himself, Timothy, reliable people, and others beyond them. This is what Jesus called his followers to when he said 'make disciples': not to build a crowd around yourself, but to raise leaders who will raise leaders. The multiplication pattern. If it stops at you, something has gone wrong.",
              "Dalam satu ayat, Paulus menggambarkan empat generasi: dirinya sendiri, Timotius, orang-orang yang dapat dipercaya, dan orang-orang lain di luar mereka. Inilah yang Yesus maksudkan ketika Ia berkata kepada para pengikut-Nya untuk 'membuat murid': bukan untuk membangun kerumunan di sekitar dirimu sendiri, tetapi untuk membina pemimpin yang akan membina pemimpin. Pola penggandaan. Jika berhenti pada dirimu, ada sesuatu yang salah."
            )}
          </p>
          <p style={{ marginBottom: 24 }}>
            {t(
              "A calling that is only ever received and never passed on has, at some point, quietly become a possession. The leader who cannot name who is coming behind them, who has no one they are actively preparing, is a leader whose calling has started to close in on itself.",
              "Sebuah panggilan yang hanya diterima dan tidak pernah diteruskan, pada suatu titik, diam-diam telah menjadi kepemilikan. Pemimpin yang tidak bisa menyebut siapa yang sedang datang di belakangnya, yang tidak secara aktif mempersiapkan siapa pun, adalah pemimpin yang panggilannya telah mulai menutup dirinya sendiri."
            )}
          </p>
          <p style={{ marginBottom: 0 }}>
            {t(
              "The Great Commission was not a one-generation assignment. 'Teaching them to obey everything I have commanded you': that is a chain of investment. To receive well is to receive with open hands. And open hands, by design, let things pass through. Not before the time is right. But always with someone else reaching for what you carry.",
              "Amanat Agung bukan tugas satu generasi. 'Ajarkan mereka untuk mentaati segala sesuatu yang telah Kuperintahkan kepadamu': itu adalah rantai investasi. Menerima dengan baik berarti menerima dengan tangan terbuka. Dan tangan yang terbuka, berdasarkan rancangan-Nya, membiarkan sesuatu mengalir melewatinya. Bukan sebelum waktunya tepat. Tetapi selalu ada orang lain yang meraih apa yang kamu emban."
            )}
          </p>
        </div>
      </div>

      {/* ── Section 6: The Cross-Cultural Dimension ───────────────── */}
      <div style={{ background: lightGray, padding: "80px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 24 }}>
            {t("The Cross-Cultural Dimension", "Dimensi Lintas Budaya")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 32, lineHeight: 1.2, fontStyle: "italic" }}>
            {t("The Exception That Became the Default", "Pengecualian yang Menjadi Standar")}
          </h2>
          <div style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9 }}>
            <p style={{ marginBottom: 24 }}>
              {t(
                "Western Christianity developed its understanding of calling in a specific cultural setting: one that values the individual, sees the self as separate from community, and was shaped by Enlightenment ideas about personal identity. In that setting, calling naturally became a personal question. What has God called me to do? What is my purpose? These are not bad questions, but they are not the only way to ask.",
                "Kekristenan Barat mengembangkan pemahamannya tentang panggilan dalam latar budaya tertentu: yang menghargai individu, melihat diri sebagai terpisah dari komunitas, dan dibentuk oleh gagasan-gagasan Pencerahan tentang identitas pribadi. Dalam latar itu, panggilan secara alami menjadi pertanyaan pribadi. Apa yang Tuhan panggil aku untuk lakukan? Apa tujuanku? Ini bukan pertanyaan yang buruk, tetapi bukan satu-satunya cara untuk bertanya."
              )}
            </p>
            <p style={{ marginBottom: 24 }}>
              {t(
                "For much of the world, across sub-Saharan Africa, East and Southeast Asia, the Middle East, and Latin America, identity is relational by default. In these cultures, calling is not primarily a private discovery. It is something the community sees in you, names out loud, and sends you into. The calling does not fully exist until it has been spoken by people who know you and who will carry responsibility for you. This is not a weaker theology of calling. It may be the stronger one.",
                "Bagi sebagian besar dunia, di seluruh Afrika Sub-Sahara, Asia Timur dan Tenggara, Timur Tengah, dan Amerika Latin, identitas secara alami bersifat relasional. Dalam budaya-budaya ini, panggilan bukan terutama sebuah penemuan pribadi. Itu adalah sesuatu yang komunitas lihat dalam dirimu, nyatakan dengan lantang, dan utus kamu ke dalamnya. Panggilan itu tidak sepenuhnya ada sampai diucapkan oleh orang-orang yang mengenalmu dan yang akan menanggung tanggung jawab atasmu. Ini bukan teologi panggilan yang lebih lemah. Mungkin ini adalah yang lebih kuat."
              )}
            </p>
            <p style={{ marginBottom: 0 }}>
              {t(
                "When cross-cultural workers carry an individualist model of calling into a collectivist context, the friction is real but often invisible. They may experience their calling as something between themselves and God, confirmed perhaps by a pastor or an organisation, but ultimately personal. The people they work with may find this hard to understand, not because they lack faith, but because in their experience, a person who cannot be placed within a web of relationships and responsibilities has not yet fully arrived. The gift these cultures bring to the wider church is this: they have been living the biblical pattern of communal calling all along.",
                "Ketika para pekerja lintas budaya membawa model panggilan yang individualistis ke dalam konteks kolektivistis, gesekan itu nyata tetapi sering tidak terlihat. Mereka mungkin mengalami panggilan mereka sebagai sesuatu antara diri mereka dan Allah, mungkin dikonfirmasi oleh seorang pendeta atau organisasi, tetapi pada akhirnya bersifat pribadi. Orang-orang yang mereka layani mungkin sulit memahami ini, bukan karena mereka kurang iman, tetapi karena dalam pengalaman mereka, seseorang yang tidak bisa ditempatkan dalam jaringan hubungan dan tanggung jawab belum sepenuhnya hadir. Karunia yang dibawa budaya-budaya ini kepada gereja yang lebih luas adalah ini: mereka telah hidup dalam pola alkitabiah tentang panggilan komunal sepanjang waktu."
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ── From the Field ─────────────────────────────────────────── */}
      <div style={{ background: offWhite, padding: "80px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 24 }}>
            {t("From the Field", "Dari Lapangan")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 32, lineHeight: 1.2, fontStyle: "italic" }}>
            {t("Who Sent You?", "Siapa yang Mengutusmu?")}
          </h2>
          <div style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9 }}>
            <p style={{ marginBottom: 24 }}>
              {t(
                "She arrived in Southeast Asia with a calling that felt deeply personal. She could articulate why she was there, what had drawn her, and what she believed God was asking of her. The first months were warm. People welcomed her, asked her questions, showed her around.",
                "Ia tiba di Asia Tenggara dengan panggilan yang terasa sangat pribadi. Ia bisa mengartikulasikan mengapa ia ada di sana, apa yang menariknya, dan apa yang ia percaya Tuhan minta darinya. Bulan-bulan pertama terasa hangat. Orang-orang menyambutnya, mengajukan pertanyaan, menunjukkannya berkeliling."
              )}
            </p>
            <p style={{ marginBottom: 24 }}>
              {t(
                "After two years, something shifted. She was present but not placed. The community treated her with respect, even warmth, but she began to notice that she was known as a visiting expert rather than a member. No one seemed quite sure what they would do if she left. No one was responsible for her if things went wrong. She was not woven into any web of relationship or accountability. She floated above the community rather than within it.",
                "Setelah dua tahun, sesuatu berubah. Ia hadir tetapi tidak ditempatkan. Komunitas memperlakukannya dengan hormat, bahkan kehangatan, tetapi ia mulai memperhatikan bahwa ia dikenal sebagai pakar tamu, bukan anggota. Tidak ada yang tampaknya tahu apa yang akan mereka lakukan jika ia pergi. Tidak ada yang bertanggung jawab atasnya jika sesuatu berjalan salah. Ia tidak terjalin ke dalam jaringan hubungan atau akuntabilitas mana pun. Ia melayang di atas komunitas, bukan di dalamnya."
              )}
            </p>
            <p style={{ marginBottom: 24 }}>
              {t(
                "A local elder asked her a question that stayed with her for months afterward. He was not unkind, only direct. \"Who sent you?\" he said. \"Who prays for you? Who is responsible for you when things go wrong?\"",
                "Seorang tetua lokal mengajukan pertanyaan yang membuatnya berpikir selama berbulan-bulan setelahnya. Ia tidak tidak ramah, hanya langsung saja. \"Siapa yang mengutusmu?\" katanya. \"Siapa yang mendoakanmu? Siapa yang bertanggung jawab atasmu ketika sesuatu berjalan salah?\""
              )}
            </p>
            <p style={{ marginBottom: 24 }}>
              {t(
                "She had answers to each of his questions, but as she spoke them aloud, she realised that none of them made sense to him. Her sending church was on the other side of the world. Her organisation held administrative accountability, not relational. There was no one locally responsible for her, no one who could be summoned if she struggled, no one who would be answerable to the community for how she behaved or whether she was well.",
                "Ia memiliki jawaban untuk setiap pertanyaannya, tetapi saat mengucapkannya, ia menyadari bahwa tidak ada yang masuk akal baginya. Gereja pengutusnya ada di sisi lain dunia. Organisasinya memiliki akuntabilitas administratif, bukan relasional. Tidak ada yang bertanggung jawab atasnya secara lokal, tidak ada yang bisa dipanggil jika ia kesulitan, tidak ada yang akan bertanggung jawab kepada komunitas atas cara ia berperilaku atau apakah ia baik-baik saja."
              )}
            </p>
            <p style={{ marginBottom: 24 }}>
              {t(
                "She wrote to her sending church for the first time in three years — not a ministry update, but a request. She asked for a formal recommissioning: a conversation in front of witnesses, a named person who would carry ongoing accountability for her calling, not just her budget. She said she needed to be sent in a way that the people she served could understand.",
                "Ia menulis kepada gereja pengutusnya untuk pertama kalinya dalam tiga tahun — bukan pembaruan pelayanan, tetapi sebuah permintaan. Ia meminta perutusan ulang yang formal: sebuah percakapan di hadapan saksi, seseorang yang disebutkan namanya yang akan memikul akuntabilitas berkelanjutan untuk panggilannya, bukan hanya anggarannya. Ia berkata bahwa ia perlu diutus dengan cara yang bisa dipahami oleh orang-orang yang ia layani."
              )}
            </p>
            <p style={{ marginBottom: 0 }}>
              {t(
                "The conversation that followed was not dramatic. But something settled. She described it later as the first time she felt she had fully arrived — not in the country, she had been there three years, but in the work. Her calling had not changed. It had simply been placed inside a community that could hold it.",
                "Percakapan yang menyusul tidak dramatis. Tetapi sesuatu menetap. Ia menggambarkannya kemudian sebagai pertama kalinya ia merasa telah benar-benar tiba — bukan di negara itu, ia sudah ada di sana selama tiga tahun, tetapi dalam pekerjaan. Panggilannya tidak berubah. Ia hanya ditempatkan di dalam komunitas yang bisa menahannya."
              )}
            </p>
          </div>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontStyle: "italic", color: bodyText, marginTop: 24 }}>
            {t("Composite vignette. Not attributed to a specific individual.", "Kisah majemuk. Tidak dikaitkan dengan individu tertentu.")}
          </p>
        </div>
      </div>

      {/* ── Faith Anchor ───────────────────────────────────────────── */}
      <div style={{ padding: "80px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 24, textAlign: "center" }}>
          {t("Faith Anchor", "Jangkar Iman")}
        </p>
        <div style={{ background: lightGray, borderRadius: 6, padding: "44px 48px", textAlign: "center" }}>
          <p style={{ fontFamily: serif, fontSize: "clamp(20px, 2.5vw, 28px)", fontStyle: "italic", color: navy, lineHeight: 1.75, marginBottom: 20 }}>
            {t("If the whole body were an eye, where would the sense of hearing be?", "Kalau seluruh tubuh adalah mata, di manakah pendengaran?")}
          </p>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em", marginBottom: 28 }}>
            — {t("1 Corinthians 12:17 (NIV)", "1 Korintus 12:17 (TB)")}
          </p>
          <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: bodyText, lineHeight: 1.85, margin: 0 }}>
            {t(
              "Your calling is not made smaller by being one part of many. It becomes fully itself precisely because the whole body requires it.",
              "Panggilanmu tidak menjadi lebih kecil karena menjadi satu bagian dari banyak bagian. Ia menjadi sepenuhnya dirinya sendiri justru karena seluruh tubuh membutuhkannya."
            )}
          </p>
        </div>
      </div>

      {/* ── Key Takeaways ─────────────────────────────────────────── */}
      <div style={{ background: offWhite, padding: "72px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 32, lineHeight: 1.2, fontStyle: "italic" }}>
            {t("Key Takeaways", "Poin-Poin Kunci")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {(lang === "en" ? [
              "Calling in Scripture is never purely individual. It is shaped, confirmed, and sustained through community.",
              "Both the internal call (your own sense of vocation) and the external call (community recognition) are needed. Neither is complete without the other.",
              "A calling without accountability is structurally fragile. Isolation is not devotion. It is a design flaw.",
              "In most of the world, calling has always been relational by default. The communal model may be closer to the biblical pattern than we assume.",
              "A calling that is received but never passed on has quietly become a possession. Someone should be reaching for what you carry.",
            ] : [
              "Panggilan dalam Kitab Suci tidak pernah murni individual. Ia dibentuk, dikonfirmasi, dan ditopang melalui komunitas.",
              "Baik panggilan internal (rasa panggilanmu sendiri) maupun panggilan eksternal (pengakuan komunitas) dibutuhkan. Tidak ada yang lengkap tanpa yang lain.",
              "Panggilan tanpa akuntabilitas rapuh secara struktural. Isolasi bukan pengabdian. Itu adalah cacat desain.",
              "Di sebagian besar dunia, panggilan selalu bersifat relasional secara alami. Model komunal mungkin lebih dekat dengan pola alkitabiah daripada yang kita asumsikan.",
              "Panggilan yang diterima tetapi tidak pernah diteruskan telah diam-diam menjadi kepemilikan. Seseorang seharusnya meraih apa yang kamu emban.",
            ]).map((item, i) => (
              <div key={i} style={{ background: offWhite, border: `1.5px solid oklch(90% 0.008 80)`, borderLeft: `4px solid ${orange}`, borderRadius: "0 8px 8px 0", padding: "18px 24px" }}>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(14px, 1.5vw, 15px)", fontWeight: 700, color: navy, margin: 0, lineHeight: 1.6 }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sources ────────────────────────────────────────────────── */}
      <SourcesDropdown sources={[
        "RHR International — Loneliness: An Under-Diagnosed Epidemic Among New CEOs. Inc. Magazine. https://www.inc.com/jessica-stillman/loneliness-an-under-diagnosed-epidemic-among-new-ceos.html",
        "Billy Drum — Burnout Among Cross-Cultural Workers. Lausanne Global Analysis, March 2024. https://lausanne.org/global-analysis/burnout-among-missionaries",
        "Ronald Koteskey — Attrition of Cross-Cultural Workers. CrossCulturalWorkers.com, citing ReMAP I & II (WEA, 1997 & 2007). https://crossculturalworkers.com/attrition",
        "Aaron Kuecker — Vocation in the Context of Community (Acts 13:1–3). Theology of Work Project. https://www.theologyofwork.org/new-testament/acts/a-clash-of-kingdoms-community-and-powerbrokers-acts-13-19/vocation-in-the-context-of-community-acts-131-3/",
        "Fuller Seminary — Three Dimensions of Call. Next Faithful Step Resource Series. https://fuller.edu/next-faithful-step/resources/three-dimensions-of-call/",
        "Henri J.M. Nouwen — The Wounded Healer. Doubleday, 1972. https://www.henrinouwen.org/books/the-wounded-healer",
      ]} lang={lang} />

      {/* ── Footer ─────────────────────────────────────────────────── */}
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
        <Link href="/resources" style={{ display: "inline-block", padding: "14px 36px", background: orange, color: offWhite, fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, textDecoration: "none", borderRadius: 4, letterSpacing: "0.04em" }}>
          {t("Training", "Pelatihan")}
        </Link>
      </div>
    </div>
  );
}
