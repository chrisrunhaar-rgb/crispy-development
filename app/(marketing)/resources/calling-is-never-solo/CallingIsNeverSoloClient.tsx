"use client";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id";
const tFn = (en: string, id: string, lang: Lang) => lang === "en" ? en : id;

const BIBLE_CARDS = [
  {
    en_label: "Israel",
    id_label: "Israel",
    en_body: "God did not call one person to be his witness among the nations. He called a whole people. Their identity as a community was part of the calling itself — not the container for it.",
    id_body: "Allah tidak memanggil satu orang untuk menjadi saksi-Nya di antara bangsa-bangsa. Ia memanggil seluruh umat. Identitas mereka sebagai komunitas adalah bagian dari panggilan itu sendiri — bukan sekadar wadahnya.",
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
    en_body: "Nehemiah received a vision. But the wall was rebuilt by families, clans, and work groups — each doing the section nearest their own home. The vision came to one person. The work required everyone.",
    id_body: "Nehemia menerima sebuah visi. Tetapi tembok itu dibangun kembali oleh keluarga, klan, dan kelompok kerja — masing-masing mengerjakan bagian terdekat dari rumah mereka. Visi itu datang kepada satu orang. Pekerjaannya membutuhkan semua orang.",
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

const WEB_NODES = [
  { key: "sent_by",       en_label: "Sent by",          id_label: "Diutus oleh",       en_hint: "Who commissioned or released you",    id_hint: "Siapa yang mengutus atau melepaskan Anda" },
  { key: "trained_by",    en_label: "Trained by",        id_label: "Dibentuk oleh",     en_hint: "Who shaped your thinking",            id_hint: "Siapa yang membentuk pemikiran Anda" },
  { key: "praying_with",  en_label: "Praying with",      id_label: "Berdoa bersama",    en_hint: "Who intercedes for you",              id_hint: "Siapa yang mendoakan Anda" },
  { key: "working_with",  en_label: "Working alongside", id_label: "Bekerja bersama",   en_hint: "Who is in the mission with you",      id_hint: "Siapa yang ada dalam misi bersama Anda" },
  { key: "learning_from", en_label: "Learning from",     id_label: "Belajar dari",      en_hint: "Who you are still being shaped by",   id_hint: "Siapa yang masih membentuk Anda" },
  { key: "serving_with",  en_label: "Serving together",  id_label: "Melayani bersama",  en_hint: "Who you are building something with", id_hint: "Siapa yang sedang membangun sesuatu bersama Anda" },
];

// Static community web node definitions for the inspirational SVG
const COMMUNITY_NODES = [
  { en: "Church",           id: "Gereja",           x: 200, y: 58  },
  { en: "Senders",          id: "Pengutus",         x: 302, y: 97  },
  { en: "Mentor",           id: "Mentor",           x: 342, y: 200 },
  { en: "Prayer Partners",  id: "Mitra Doa",        x: 302, y: 303 },
  { en: "Co-workers",       id: "Rekan Kerja",      x: 200, y: 342 },
  { en: "Disciples",        id: "Murid",            x: 98,  y: 303 },
  { en: "Peers",            id: "Sesama",           x: 58,  y: 200 },
  { en: "Local Community",  id: "Komunitas Lokal",  x: 98,  y: 97  },
];

// Ring connections + cross-connections for the web
const COMMUNITY_CONNECTIONS: [number, number][] = [
  [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0], // ring
  [0,4],[2,6],[1,5],[3,7],                           // diagonals
];

type Props = { isSaved: boolean };

export default function CallingIsNeverSoloClient({ isSaved: initialSaved }: Props) {
  const { lang: ctxLang } = useLanguage();
  const lang: Lang = ctxLang === "id" ? "id" : "en";
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const [centerName, setCenterName] = useState("");
  const [nodeValues, setNodeValues] = useState<Record<string, string>>({
    sent_by: "", trained_by: "", praying_with: "", working_with: "", learning_from: "", serving_with: "",
  });
  const filledCount = Object.values(nodeValues).filter((v) => v.trim() !== "").length;
  const allFilled = filledCount === 6;

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
  const warmCream = "oklch(96% 0.012 60)";
  const bodyText = "oklch(38% 0.05 260)";
  const serif   = "var(--font-cormorant, Cormorant Garamond, Georgia, serif)";
  const nodeAngles = [0, 60, 120, 180, 240, 300];

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
              "Your calling is one thread in a much larger tapestry. How God builds through communities, teams, and generations — and what it means to steward your part well.",
              "Panggilanmu adalah satu benang dalam permadani yang jauh lebih besar. Bagaimana Allah membangun melalui komunitas, tim, dan generasi — dan apa artinya mengelola bagianmu dengan baik."
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
      <div style={{ padding: "80px 24px 0", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: "clamp(19px, 2.2vw, 24px)", fontStyle: "italic", color: navy, lineHeight: 1.8, padding: "0 0 0 28px", borderLeft: `3px solid ${orange}` }}>
          {t(
            "You have probably heard it said that God has a plan for your life. A personal plan. A specific calling, meant just for you, found in quiet moments alone. People who accepted this idea and people who quietly questioned it can end up in the same place — doing the work of God in growing isolation, wondering why it feels smaller than it should.",
            "Anda mungkin pernah mendengar bahwa Allah memiliki rencana bagi hidup Anda. Rencana pribadi. Panggilan khusus, hanya untuk Anda, ditemukan dalam momen-momen sunyi sendirian. Orang yang menerima gagasan ini dan orang yang diam-diam meragukannya bisa berakhir di tempat yang sama — melakukan pekerjaan Allah dalam kesendirian yang semakin besar, bertanya-tanya mengapa rasanya lebih kecil dari seharusnya."
          )}
        </p>
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
              "It is true that God speaks to individuals. Moses heard a voice from a burning bush. Paul was stopped on a road. Samuel heard his name called in the night. These are real moments of personal encounter — and they matter.",
              "Memang benar bahwa Allah berbicara kepada individu. Musa mendengar suara dari semak yang menyala. Paulus dihentikan di jalan. Samuel mendengar namanya dipanggil di malam hari. Ini adalah momen perjumpaan pribadi yang nyata — dan itu penting."
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
              "The idea that calling is a private experience — uniquely yours, lived out alone, needing no community to make it real — is not what we see in Scripture. It is more a product of Western, individualist thinking that has shaped how many of us read the Bible. Much of the world has always found this reading strange. In cultures where identity is naturally relational, the idea that God would speak your calling to you alone, and that you would carry it alone, feels foreign and small. They were right to notice.",
              "Gagasan bahwa panggilan adalah pengalaman pribadi — hanya milikmu, dijalani sendirian, tidak membutuhkan komunitas untuk membuatnya nyata — bukanlah apa yang kita lihat dalam Kitab Suci. Ini lebih merupakan produk dari pemikiran Barat dan individualistis yang telah membentuk cara banyak dari kita membaca Alkitab. Sebagian besar dunia selalu merasa bacaan ini aneh. Dalam budaya di mana identitas secara alami bersifat relasional, gagasan bahwa Allah akan berbicara panggilan Anda kepada Anda sendirian, dan bahwa Anda akan membawanya sendirian, terasa asing dan kecil. Mereka benar untuk memperhatikan hal ini."
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
              "Again and again in Scripture, calling is not just received privately — it is shaped, sent, and sustained through community. Five examples show how consistent this pattern is.",
              "Berulang kali dalam Kitab Suci, panggilan tidak hanya diterima secara pribadi — ia dibentuk, diutus, dan ditopang melalui komunitas. Lima contoh menunjukkan betapa konsistennya pola ini."
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
              "Working alongside others is not easy. In most parts of the world, human instinct pulls toward self-sufficiency, toward doing things your own way, toward protecting what you have built. This is not a character flaw. It is simply the natural pull of the human heart. That is exactly why Jesus prays — not for our individual success, but for our unity.",
              "Bekerja bersama orang lain tidaklah mudah. Di sebagian besar dunia, naluri manusia menarik ke arah kemandirian, ke arah melakukan segalanya dengan cara sendiri, ke arah melindungi apa yang sudah dibangun. Ini bukan cacat karakter. Itu hanya tarikan alami hati manusia. Itulah tepatnya mengapa Yesus berdoa — bukan untuk keberhasilan individu kita, tetapi untuk kesatuan kita."
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
              "Unity among followers of Jesus is not simply a nice thing to have. It is, according to Jesus himself, the evidence that God sent him and loves the world. The way we work together — or fail to — is a witness to something beyond us.",
              "Kesatuan di antara pengikut Yesus bukan sekadar hal yang baik untuk dimiliki. Menurut Yesus sendiri, itu adalah bukti bahwa Allah mengutus-Nya dan mengasihi dunia. Cara kita bekerja bersama — atau gagal melakukannya — adalah kesaksian tentang sesuatu yang melampaui kita."
            )}
          </p>
          <p style={{ marginBottom: 0 }}>
            {t(
              "This is why the Great Commission is not a solo assignment. 'Go and make disciples of all nations' was spoken to a group, not a single person. And the pattern of how disciples are made — one life investing in another, generation after generation — requires relationship, community, and time. Your calling makes full sense inside a body. Outside one, it tends to drift, shrink, or harden. You were not designed to carry it alone.",
              "Inilah mengapa Amanat Agung bukan tugas solo. 'Pergilah dan jadikanlah semua bangsa murid-Ku' diucapkan kepada sekelompok orang, bukan satu orang. Dan pola bagaimana murid-murid dibentuk — satu kehidupan berinvestasi dalam kehidupan lain, generasi demi generasi — membutuhkan hubungan, komunitas, dan waktu. Panggilanmu sepenuhnya masuk akal di dalam tubuh. Di luarnya, ia cenderung melayang, mengecil, atau mengeras. Anda tidak dirancang untuk menanggungnya sendirian."
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
              "Sebuah panggilan yang dijalani tanpa komunitas menjadi sistem yang tertutup. Tidak ada yang mempertanyakannya. Tidak ada yang mengoreksinya. Tidak ada yang melihat bagian-bagian yang diam-diam telah salah arah."
            )}
          </p>
          <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: "oklch(76% 0.03 80)", lineHeight: 1.9, marginBottom: 40 }}>
            {t(
              "When a leader keeps their vision separate from others, three things tend to follow: the vision grows rigid around what the leader cannot see in themselves, blind spots stay hidden until they become costly, and the fruit is real — but thinner than it could have been. This is not a shame diagnosis. It is a structural one. The design was always communal.",
              "Ketika seorang pemimpin memisahkan visi mereka dari orang lain, tiga hal cenderung terjadi: visi menjadi kaku di sekitar apa yang tidak bisa dilihat pemimpin dalam dirinya sendiri, titik buta tetap tersembunyi sampai menjadi mahal, dan buahnya nyata — tetapi lebih tipis dari yang seharusnya. Ini bukan diagnosis rasa malu. Ini adalah diagnosis struktural. Rancangannya selalu bersifat komunal."
            )}
          </p>

          {/* Lone Wolf → Messiah Complex */}
          <div style={{ background: "oklch(18% 0.09 260)", borderRadius: 6, padding: "36px 40px", marginBottom: 40 }}>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
              {t("Lone Wolf → Messiah Complex", "Lone Wolf → Messiah Complex")}
            </p>
            <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: "oklch(76% 0.03 80)", lineHeight: 1.85, marginBottom: 20 }}>
              {t(
                "The lone wolf pattern begins quietly. A gifted leader starts to feel that others slow them down — that the community doesn't fully understand the vision, that it is faster and cleaner to work alone. So they pull back. Accountability fades. Correction stops reaching them.",
                "Pola lone wolf dimulai dengan tenang. Seorang pemimpin yang berbakat mulai merasa bahwa orang lain memperlambat mereka — bahwa komunitas tidak sepenuhnya memahami visi, bahwa lebih cepat dan lebih bersih bekerja sendiri. Jadi mereka menarik diri. Akuntabilitas memudar. Koreksi berhenti menjangkau mereka."
              )}
            </p>
            <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: "oklch(76% 0.03 80)", lineHeight: 1.85, marginBottom: 20 }}>
              {t(
                "Left unchecked, this becomes something more dangerous: the belief — not always conscious — that only they can carry the work. The burden grows. The control tightens. The circle of trust shrinks to one. This is what is often called a Messiah Complex: the leader who believes the mission depends entirely on them staying at the centre of it.",
                "Jika dibiarkan, ini menjadi sesuatu yang lebih berbahaya: keyakinan — tidak selalu disadari — bahwa hanya mereka yang bisa mengemban pekerjaan itu. Beban bertambah berat. Kontrol semakin ketat. Lingkaran kepercayaan menyusut menjadi satu orang. Inilah yang sering disebut Messiah Complex: pemimpin yang percaya bahwa misi sepenuhnya bergantung pada diri mereka tetap berada di pusatnya."
              )}
            </p>
            <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", fontStyle: "italic", color: offWhite, lineHeight: 1.85, margin: 0 }}>
              {t(
                "The antidote is not less passion. It is more community. Jesus — who actually was the Messiah — washed feet. He prayed for unity among his followers. He built a team and sent them together. If even he did not work alone, we have no good reason to.",
                "Penangkalnya bukan semangat yang lebih sedikit. Melainkan komunitas yang lebih banyak. Yesus — yang memang benar-benar adalah Mesias — membasuh kaki. Ia berdoa untuk kesatuan di antara para pengikut-Nya. Ia membangun sebuah tim dan mengutus mereka bersama-sama. Jika bahkan Dia tidak bekerja sendirian, kita tidak punya alasan yang baik untuk melakukannya."
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

      {/* ── Community Web — Inspirational Image ───────────────────── */}
      <div style={{ background: warmCream, padding: "80px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 16, textAlign: "center" }}>
            {t("What It Can Look Like", "Seperti Apa Bentuknya")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 700, color: navy, marginBottom: 16, lineHeight: 1.2, fontStyle: "italic", textAlign: "center" }}>
            {t("A Healthy Calling Community", "Komunitas Panggilan yang Sehat")}
          </h2>
          <p style={{ fontFamily: serif, fontSize: "clamp(15px, 1.7vw, 18px)", color: bodyText, lineHeight: 1.75, textAlign: "center", marginBottom: 48, maxWidth: 540, margin: "0 auto 48px" }}>
            {t(
              "A calling community is not a support group. It is a web of real relationships — people who send you, form you, pray for you, work alongside you, and receive from you in return.",
              "Komunitas panggilan bukan sekadar kelompok dukungan. Ini adalah jaringan hubungan nyata — orang-orang yang mengutusmu, membentukmu, mendoakanmu, bekerja bersamamu, dan menerima darimu sebagai balasannya."
            )}
          </p>

          {/* Static SVG web */}
          <div style={{ maxWidth: 400, margin: "0 auto" }}>
            <svg viewBox="0 0 400 400" width="100%" style={{ display: "block" }} aria-label={t("Calling community web diagram", "Diagram web komunitas panggilan")}>
              {/* Cross-connections first (behind nodes) */}
              {COMMUNITY_CONNECTIONS.map(([a, b], i) => (
                <line
                  key={`conn-${i}`}
                  x1={COMMUNITY_NODES[a].x} y1={COMMUNITY_NODES[a].y}
                  x2={COMMUNITY_NODES[b].x} y2={COMMUNITY_NODES[b].y}
                  stroke="oklch(65% 0.15 45 / 0.22)"
                  strokeWidth="1.5"
                />
              ))}
              {/* Spokes from center to each node */}
              {COMMUNITY_NODES.map((n, i) => (
                <line key={`spoke-${i}`} x1="200" y1="200" x2={n.x} y2={n.y} stroke="oklch(65% 0.15 45 / 0.45)" strokeWidth="1.5" />
              ))}
              {/* Outer nodes */}
              {COMMUNITY_NODES.map((n, i) => (
                <g key={`node-${i}`}>
                  <circle cx={n.x} cy={n.y} r="28" fill="oklch(22% 0.10 260)" />
                  <text
                    x={n.x} y={n.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="8"
                    fontFamily="Montserrat, sans-serif"
                    fontWeight="700"
                    fill="oklch(97% 0.005 80)"
                    style={{ letterSpacing: "0.04em" }}
                  >
                    {(lang === "en" ? n.en : n.id).split(" ").map((word, wi, arr) => (
                      <tspan key={wi} x={n.x} dy={wi === 0 ? (arr.length > 1 ? "-0.5em" : "0") : "1.15em"}>{word}</tspan>
                    ))}
                  </text>
                </g>
              ))}
              {/* Center node */}
              <circle cx="200" cy="200" r="38" fill="oklch(65% 0.15 45)" />
              <text x="200" y="200" textAnchor="middle" dominantBaseline="middle" fontSize="13" fontFamily="Montserrat, sans-serif" fontWeight="700" fill="oklch(97% 0.005 80)">
                {t("You", "Anda")}
              </text>
            </svg>
          </div>
          <p style={{ fontFamily: serif, fontSize: "clamp(14px, 1.5vw, 16px)", color: bodyText, lineHeight: 1.75, textAlign: "center", marginTop: 32, fontStyle: "italic", maxWidth: 480, margin: "32px auto 0" }}>
            {t(
              "The connections between people in your community are as important as the connections to you. A healthy calling community is a web — not a wheel.",
              "Koneksi antara orang-orang dalam komunitasmu sama pentingnya dengan koneksi ke dirimu. Komunitas panggilan yang sehat adalah jaring — bukan roda."
            )}
          </p>
        </div>
      </div>

      {/* ── Interactive: The Calling Web ──────────────────────────── */}
      <div style={{ background: lightGray, padding: "80px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 16, textAlign: "center" }}>
            {t("Your Turn", "Giliran Anda")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 700, color: navy, marginBottom: 12, lineHeight: 1.2, fontStyle: "italic", textAlign: "center" }}>
            {t("The Calling Web", "Jaring Panggilan")}
          </h2>
          <p style={{ fontFamily: serif, fontSize: "clamp(15px, 1.7vw, 18px)", color: bodyText, lineHeight: 1.75, textAlign: "center", marginBottom: 52 }}>
            {t(
              "Put your name in the centre. Then name one person for each role around you.",
              "Tulis nama Anda di tengah. Kemudian namai satu orang untuk setiap peran di sekitar Anda."
            )}
          </p>

          {/* Web diagram */}
          <div style={{ position: "relative", width: "100%", maxWidth: 560, margin: "0 auto", aspectRatio: "1 / 1" }}>
            {nodeAngles.map((angle, i) => {
              const rad = (angle - 90) * (Math.PI / 180);
              const cx = 50, cy = 50, r = 38;
              const nx = cx + r * Math.cos(rad);
              const ny = cy + r * Math.sin(rad);
              const dx = nx - cx, dy = ny - cy;
              const length = Math.sqrt(dx * dx + dy * dy);
              const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
              const filled = nodeValues[WEB_NODES[i].key]?.trim() !== "";
              return (
                <div
                  key={i}
                  style={{ position: "absolute", left: `${cx}%`, top: `${cy}%`, width: `${length}%`, height: 2, background: filled ? orange : "oklch(82% 0.01 80)", transformOrigin: "0 50%", transform: `rotate(${angleDeg}deg)`, transition: "background 0.3s ease" }}
                />
              );
            })}

            {/* Centre */}
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: 100, height: 100, borderRadius: "50%", background: navy, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 2, boxShadow: "0 4px 20px oklch(10% 0.05 260 / 0.2)" }}>
              <input value={centerName} onChange={(e) => setCenterName(e.target.value)} placeholder={t("Your name", "Nama Anda")} maxLength={20}
                style={{ width: 80, background: "transparent", border: "none", borderBottom: `1px solid ${orange}`, color: offWhite, fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, textAlign: "center", outline: "none", padding: "2px 0", letterSpacing: "0.04em" }}
              />
              <span style={{ fontFamily: serif, fontSize: 9, color: "oklch(68% 0.025 80)", marginTop: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {t("centre", "pusat")}
              </span>
            </div>

            {/* Outer nodes */}
            {WEB_NODES.map((node, i) => {
              const angle = nodeAngles[i];
              const rad = (angle - 90) * (Math.PI / 180);
              const r = 38;
              const cx = 50 + r * Math.cos(rad);
              const cy = 50 + r * Math.sin(rad);
              const filled = nodeValues[node.key]?.trim() !== "";
              return (
                <div key={node.key} style={{ position: "absolute", left: `${cx}%`, top: `${cy}%`, transform: "translate(-50%, -50%)", width: 96, zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: filled ? orange : offWhite, border: `2px solid ${filled ? orange : "oklch(82% 0.01 80)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transition: "background 0.3s ease, border-color 0.3s ease", boxShadow: filled ? `0 2px 12px ${orange}44` : "none" }}>
                    {filled
                      ? <span style={{ fontSize: 20, color: offWhite }}>✓</span>
                      : <span style={{ fontFamily: serif, fontSize: 8, color: bodyText, letterSpacing: "0.04em", textTransform: "uppercase", textAlign: "center", padding: "0 8px", lineHeight: 1.3 }}>{lang === "en" ? node.en_label : node.id_label}</span>
                    }
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input fields */}
          <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 20 }}>
            {WEB_NODES.map((node, i) => {
              const filled = nodeValues[node.key]?.trim() !== "";
              return (
                <div key={node.key} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: filled ? orange : "oklch(88% 0.01 80)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.3s ease", marginTop: 4 }}>
                    {filled
                      ? <span style={{ color: offWhite, fontSize: 14, fontWeight: 700 }}>✓</span>
                      : <span style={{ color: "oklch(60% 0.01 80)", fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
                      {lang === "en" ? node.en_label : node.id_label}
                    </label>
                    <p style={{ fontFamily: serif, fontSize: 13, color: bodyText, marginBottom: 8, fontStyle: "italic" }}>
                      {lang === "en" ? node.en_hint : node.id_hint}
                    </p>
                    <input
                      type="text"
                      value={nodeValues[node.key]}
                      onChange={(e) => setNodeValues((prev) => ({ ...prev, [node.key]: e.target.value }))}
                      placeholder={t("Name a person...", "Namai seseorang...")}
                      style={{ width: "100%", padding: "10px 14px", fontFamily: serif, fontSize: "clamp(15px, 1.6vw, 17px)", color: bodyText, background: offWhite, border: `1px solid ${filled ? orange : "oklch(88% 0.01 80)"}`, borderRadius: 4, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s ease" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {allFilled && (
            <div style={{ marginTop: 48, background: navy, borderRadius: 6, padding: "40px", textAlign: "center" }}>
              <p style={{ fontFamily: serif, fontSize: "clamp(20px, 2.5vw, 26px)", fontStyle: "italic", color: offWhite, lineHeight: 1.75, marginBottom: 20 }}>
                {t("This is your calling — not just the part in the middle.", "Inilah panggilanmu — bukan hanya bagian di tengahnya.")}
              </p>
              <p style={{ fontFamily: serif, fontSize: "clamp(15px, 1.7vw, 18px)", color: "oklch(76% 0.03 80)", lineHeight: 1.75, margin: 0 }}>
                {t(
                  "You have named six people who are woven into the work God has called you to. Every one of them is part of the tapestry. None of it belongs to you alone.",
                  "Anda telah menamai enam orang yang terjalin dalam pekerjaan yang Allah panggil Anda untuk lakukan. Setiap satu dari mereka adalah bagian dari permadani. Tidak ada yang menjadi milik Anda sendiri."
                )}
              </p>
            </div>
          )}
          {!allFilled && filledCount > 0 && (
            <p style={{ textAlign: "center", marginTop: 32, fontFamily: "Montserrat, sans-serif", fontSize: 12, color: bodyText, letterSpacing: "0.06em" }}>
              {filledCount} / 6 {t("completed", "selesai")}
            </p>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: "oklch(90% 0.008 80)" }} />
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
              "In one verse, Paul describes four generations: himself, Timothy, reliable people, and others beyond them. This is what Jesus called his followers to when he said 'make disciples' — not to build a crowd around yourself, but to raise leaders who will raise leaders. The multiplication pattern. If it stops at you, something has gone wrong.",
              "Dalam satu ayat, Paulus menggambarkan empat generasi: dirinya sendiri, Timotius, orang-orang yang dapat dipercaya, dan orang-orang lain di luar mereka. Inilah yang Yesus maksudkan ketika Ia berkata kepada para pengikut-Nya untuk 'membuat murid' — bukan untuk membangun kerumunan di sekitar dirimu sendiri, tetapi untuk membina pemimpin yang akan membina pemimpin. Pola penggandaan. Jika berhenti pada dirimu, ada sesuatu yang salah."
            )}
          </p>
          <p style={{ marginBottom: 24 }}>
            {t(
              "A calling that is only ever received and never passed on has, at some point, quietly become a possession. The leader who cannot name who is coming behind them — who has no one they are actively preparing — is a leader whose calling has started to close in on itself.",
              "Sebuah panggilan yang hanya diterima dan tidak pernah diteruskan, pada suatu titik, diam-diam telah menjadi kepemilikan. Pemimpin yang tidak bisa menyebut siapa yang sedang datang di belakangnya — yang tidak secara aktif mempersiapkan siapa pun — adalah pemimpin yang panggilannya telah mulai menutup dirinya sendiri."
            )}
          </p>
          <p style={{ marginBottom: 0 }}>
            {t(
              "The Great Commission was not a one-generation assignment. 'Teaching them to obey everything I have commanded you' — that is a chain of investment. To receive well is to receive with open hands. And open hands, by design, let things pass through. Not before the time is right. But always with someone else reaching for what you carry.",
              "Amanat Agung bukan tugas satu generasi. 'Ajarkan mereka untuk mentaati segala sesuatu yang telah Kuperintahkan kepadamu' — itu adalah rantai investasi. Menerima dengan baik berarti menerima dengan tangan terbuka. Dan tangan yang terbuka, berdasarkan rancangan-Nya, membiarkan sesuatu mengalir melewatinya. Bukan sebelum waktunya tepat. Tetapi selalu ada orang lain yang meraih apa yang kamu emban."
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
                "Western Christianity developed its understanding of calling in a specific cultural setting: one that values the individual, sees the self as separate from community, and was shaped by Enlightenment ideas about personal identity. In that setting, calling naturally became a personal question. What has God called me to do? What is my purpose? These are not bad questions — but they are not the only way to ask.",
                "Kekristenan Barat mengembangkan pemahamannya tentang panggilan dalam latar budaya tertentu: yang menghargai individu, melihat diri sebagai terpisah dari komunitas, dan dibentuk oleh gagasan-gagasan Pencerahan tentang identitas pribadi. Dalam latar itu, panggilan secara alami menjadi pertanyaan pribadi. Apa yang Tuhan panggil aku untuk lakukan? Apa tujuanku? Ini bukan pertanyaan yang buruk — tetapi bukan satu-satunya cara untuk bertanya."
              )}
            </p>
            <p style={{ marginBottom: 24 }}>
              {t(
                "For much of the world — across sub-Saharan Africa, East and Southeast Asia, the Middle East, and Latin America — identity is relational by default. In these cultures, calling is not primarily a private discovery. It is something the community sees in you, names out loud, and sends you into. The calling does not fully exist until it has been spoken by people who know you and who will carry responsibility for you. This is not a weaker theology of calling. It may be the stronger one.",
                "Bagi sebagian besar dunia — di seluruh Afrika Sub-Sahara, Asia Timur dan Tenggara, Timur Tengah, dan Amerika Latin — identitas secara alami bersifat relasional. Dalam budaya-budaya ini, panggilan bukan terutama sebuah penemuan pribadi. Itu adalah sesuatu yang komunitas lihat dalam dirimu, nyatakan dengan lantang, dan utus kamu ke dalamnya. Panggilan itu tidak sepenuhnya ada sampai diucapkan oleh orang-orang yang mengenalmu dan yang akan menanggung tanggung jawab atasmu. Ini bukan teologi panggilan yang lebih lemah. Mungkin ini adalah yang lebih kuat."
              )}
            </p>
            <p style={{ marginBottom: 0 }}>
              {t(
                "When cross-cultural workers carry an individualist model of calling into a collectivist context, the friction is real but often invisible. They may experience their calling as something between themselves and God — confirmed perhaps by a pastor or an organisation, but ultimately personal. The people they work with may find this hard to understand, not because they lack faith, but because in their experience, a person who cannot be placed within a web of relationships and responsibilities has not yet fully arrived. The gift these cultures bring to the wider church is this: they have been living the biblical pattern of communal calling all along.",
                "Ketika para pekerja lintas budaya membawa model panggilan yang individualistis ke dalam konteks kolektivistis, gesekan itu nyata tetapi sering tidak terlihat. Mereka mungkin mengalami panggilan mereka sebagai sesuatu antara diri mereka dan Allah — mungkin dikonfirmasi oleh seorang pendeta atau organisasi, tetapi pada akhirnya bersifat pribadi. Orang-orang yang mereka layani mungkin sulit memahami ini, bukan karena mereka kurang iman, tetapi karena dalam pengalaman mereka, seseorang yang tidak bisa ditempatkan dalam jaringan hubungan dan tanggung jawab belum sepenuhnya hadir. Karunia yang dibawa budaya-budaya ini kepada gereja yang lebih luas adalah ini: mereka telah hidup dalam pola alkitabiah tentang panggilan komunal sepanjang waktu."
              )}
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: "oklch(90% 0.008 80)" }} />
      </div>

      {/* ── Section 7: Stay Here a While ──────────────────────────── */}
      <div style={{ background: navy, padding: "80px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 24, textAlign: "center" }}>
            {t("Self-Reflection", "Refleksi Diri")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: offWhite, marginBottom: 16, lineHeight: 1.2, fontStyle: "italic", textAlign: "center" }}>
            {t("Stay Here a While", "Tinggal Sejenak di Sini")}
          </h2>
          <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: "oklch(76% 0.03 80)", lineHeight: 1.75, textAlign: "center", marginBottom: 64 }}>
            {t(
              "These questions are not easy. They are worth sitting with slowly.",
              "Pertanyaan-pertanyaan ini tidak mudah. Mereka layak untuk direnungkan dengan perlahan."
            )}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {([
              {
                en_title: "Who sent you?",
                id_title: "Siapa yang mengutusmu?",
                en_body: "Not who inspired you, or who encouraged you to think about it. Who actually sent you? Who said: we see this in you, we are behind you, we will answer for you? And do those people still know where you are — not your organisation's records, but the people themselves? If you have moved so far from the community that sent you that they could not describe what you do on a Tuesday, something worth examining has happened in the distance between you and them.",
                id_body: "Bukan siapa yang menginspirasimu, atau siapa yang mendorongmu untuk memikirkannya. Siapa yang benar-benar mengutusmu? Siapa yang berkata: kami melihat ini dalam dirimu, kami mendukungmu, kami akan bertanggung jawab atasmu? Dan apakah orang-orang itu masih tahu di mana kamu berada — bukan catatan organisasimu, tetapi orangnya sendiri? Jika kamu telah bergerak begitu jauh dari komunitas yang mengutusmu sehingga mereka tidak bisa menggambarkan apa yang kamu lakukan pada hari Selasa, ada sesuatu yang layak diperiksa dalam jarak antara kamu dan mereka.",
              },
              {
                en_title: "What part of the body are you?",
                id_title: "Bagian tubuh apakah kamu?",
                en_body: "Paul's question in 1 Corinthians 12 is not just a metaphor. It is a practical one. Every part of the body has a specific function and specific limits. The eye does excellent eye work. It does not try to walk. There is something clarifying about asking honestly: what does my particular part do well, and where have I been quietly trying to do the work of a part I am not? This is not a question about personality types. It is a question about the shape of your obedience.",
                id_body: "Pertanyaan Paulus dalam 1 Korintus 12 bukan sekadar metafora. Itu adalah pertanyaan praktis. Setiap bagian tubuh memiliki fungsi spesifik dan batas spesifik. Mata melakukan pekerjaan mata dengan sangat baik. Ia tidak mencoba berjalan. Ada sesuatu yang menjernihkan ketika kita bertanya dengan jujur: apa yang bagian tubuhku ini lakukan dengan baik, dan di mana aku diam-diam mencoba melakukan pekerjaan bagian yang bukan aku? Ini bukan pertanyaan tentang tipe kepribadian. Ini pertanyaan tentang bentuk ketaatanmu.",
              },
              {
                en_title: "Who are you passing this to?",
                id_title: "Kepada siapa kamu meneruskan ini?",
                en_body: "Is there someone, right now, who is learning something from being close to you that they could not learn from a book or a course? If the answer is no, it is worth asking why. It may be that you do not yet have the capacity or the right context. But it may also be that somewhere along the way, the calling quietly stopped being something you carry for others and became something you carry for yourself. Both deserve honest attention.",
                id_body: "Apakah ada seseorang, saat ini, yang sedang belajar sesuatu karena dekat denganmu, sesuatu yang tidak bisa mereka pelajari dari buku atau kursus? Jika jawabannya tidak, ada baiknya bertanya mengapa. Mungkin kamu belum memiliki kapasitas atau konteks yang tepat. Tetapi mungkin juga karena di suatu titik dalam perjalanan ini, panggilan itu diam-diam berhenti menjadi sesuatu yang kamu emban untuk orang lain dan menjadi sesuatu yang kamu emban untuk dirimu sendiri. Keduanya layak mendapat perhatian yang jujur.",
              },
              {
                en_title: "What would it mean to hold this more loosely?",
                id_title: "Apa artinya memegang ini dengan lebih longgar?",
                en_body: "Not to abandon it. Not to be careless with it. But to hold it in a way where, if God asked you tomorrow to set it down, hand it to someone else, or pick it up in a different form, you would be able to. A calling held too tightly can look like devotion from the inside. From the outside — and in the quiet moments when you are honest with yourself — it sometimes looks more like control. The question is not whether you are committed. It is whether what you are committed to has room to breathe, to grow, and to be given away.",
                id_body: "Bukan untuk meninggalkannya. Bukan untuk tidak peduli dengannya. Tetapi memegangnya sedemikian rupa sehingga, jika Tuhan memintamu besok untuk meletakkannya, menyerahkannya kepada orang lain, atau mengangkatnya dalam bentuk yang berbeda, kamu bisa melakukannya. Panggilan yang dipegang terlalu erat bisa terlihat seperti pengabdian dari dalam. Dari luar — dan di momen-momen sunyi ketika kamu jujur dengan dirimu sendiri — kadang-kadang itu terlihat lebih seperti kontrol. Pertanyaannya bukan apakah kamu berkomitmen. Melainkan apakah hal yang kamu perjuangkan itu punya ruang untuk bernafas, untuk tumbuh, dan untuk diberikan.",
              },
            ] as const).map((q, i) => (
              <div
                key={i}
                style={{
                  borderTop: `1px solid oklch(35% 0.06 260)`,
                  paddingTop: 48,
                  paddingBottom: 48,
                }}
              >
                <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", border: `2px solid ${orange}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, color: orange }}>{i + 1}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: serif, fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 700, color: offWhite, marginBottom: 20, fontStyle: "italic", lineHeight: 1.3 }}>
                      {lang === "en" ? q.en_title : q.id_title}
                    </h3>
                    <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: "oklch(72% 0.025 80)", lineHeight: 1.9, margin: 0 }}>
                      {lang === "en" ? q.en_body : q.id_body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
