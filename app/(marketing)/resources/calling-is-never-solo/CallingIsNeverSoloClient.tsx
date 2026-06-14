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
    en_body: "God did not call one person to be his witness among the nations. He called a people. The community was the calling.",
    id_body: "Allah tidak memanggil satu orang untuk menjadi saksi-Nya di antara bangsa-bangsa. Ia memanggil sebuah bangsa. Komunitas itu sendiri adalah panggilannya.",
  },
  {
    en_label: "The Twelve",
    id_label: "Dua Belas Murid",
    en_body: "Jesus did not pick one disciple and send him out alone. He chose twelve as a unit, trained them together, and sent them in pairs. The mission was shaped by the team.",
    id_body: "Yesus tidak memilih satu murid dan mengirimnya sendirian. Ia memilih dua belas sebagai satu kesatuan, melatih mereka bersama-sama, dan mengutus mereka berdua-dua. Misi itu dibentuk oleh tim.",
  },
  {
    en_label: "Antioch",
    id_label: "Antiokhia",
    en_body: "When the Spirit said 'set apart Barnabas and Saul for me,' it was not a private revelation to two individuals. The whole church fasted, prayed, laid hands, and sent. The sending was communal.",
    id_body: "Ketika Roh berkata 'pisahkanlah Barnabas dan Saulus untuk-Ku,' itu bukan wahyu pribadi kepada dua individu. Seluruh jemaat berpuasa, berdoa, menumpangkan tangan, dan mengutus. Pengutusan itu bersifat komunal.",
  },
];

const WEB_NODES = [
  { key: "sent_by",       en_label: "Sent by",          id_label: "Diutus oleh",       en_hint: "Who commissioned or released you",   id_hint: "Siapa yang mengutus atau melepaskan Anda" },
  { key: "trained_by",    en_label: "Trained by",        id_label: "Dibentuk oleh",     en_hint: "Who shaped your thinking",           id_hint: "Siapa yang membentuk pemikiran Anda" },
  { key: "praying_with",  en_label: "Praying with",      id_label: "Berdoa bersama",    en_hint: "Who intercedes for you",             id_hint: "Siapa yang mendoakan Anda" },
  { key: "working_with",  en_label: "Working alongside", id_label: "Bekerja bersama",   en_hint: "Who is in the mission with you",     id_hint: "Siapa yang ada dalam misi bersama Anda" },
  { key: "learning_from", en_label: "Learning from",     id_label: "Belajar dari",      en_hint: "Who you are still being shaped by",  id_hint: "Siapa yang masih membentuk Anda" },
  { key: "serving_with",  en_label: "Serving together",  id_label: "Melayani bersama",  en_hint: "Who you are building something with", id_hint: "Siapa yang sedang membangun sesuatu bersama Anda" },
];

type Props = { isSaved: boolean };

export default function CallingIsNeverSoloClient({ isSaved: initialSaved }: Props) {
  const { lang: ctxLang } = useLanguage();
  const lang: Lang = ctxLang === "id" ? "id" : "en";
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  // Calling Web state
  const [centerName, setCenterName] = useState("");
  const [nodeValues, setNodeValues] = useState<Record<string, string>>({
    sent_by: "",
    trained_by: "",
    praying_with: "",
    working_with: "",
    learning_from: "",
    serving_with: "",
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

  const navy = "oklch(22% 0.10 260)";
  const orange = "oklch(65% 0.15 45)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const bodyText = "oklch(38% 0.05 260)";
  const serif = "var(--font-cormorant, Cormorant Garamond, Georgia, serif)";

  // Radial positions for 6 nodes (in degrees, starting from top, clockwise)
  // 0=top, 60=top-right, 120=bottom-right, 180=bottom, 240=bottom-left, 300=top-left
  const nodeAngles = [0, 60, 120, 180, 240, 300];

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
            {t("Calling Is Never Solo", "Panggilan Tak Pernah Sendirian")}
          </h1>
          <div style={{ width: 48, height: 1, background: orange, margin: "0 auto 32px" }} />
          <p style={{ fontFamily: serif, fontSize: "clamp(19px, 2.5vw, 23px)", color: "oklch(82% 0.025 80)", lineHeight: 1.75, marginBottom: 40, fontStyle: "italic" }}>
            {t(
              "Your calling is one thread in a much larger tapestry. How God builds through communities, teams, and generations — and what it means to steward your piece well.",
              "Panggilanmu adalah satu benang dalam permadani yang jauh lebih besar. Bagaimana Allah membangun melalui komunitas, tim, dan generasi — dan apa artinya mengelola bagianmu dengan baik."
            )}
          </p>
          <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: "oklch(72% 0.025 80)", lineHeight: 1.75, marginBottom: 48, maxWidth: 580, margin: "0 auto 48px" }}>
            {t(
              "If the whole body were an eye, where would the sense of hearing be?",
              "Kalau seluruh tubuh adalah mata, di manakah pendengaran?"
            )}
            <span style={{ display: "block", marginTop: 10, fontSize: 13, color: orange, fontWeight: 700, letterSpacing: "0.08em", fontStyle: "normal" }}>
              {t("1 Corinthians 12:17", "1 Korintus 12:17")}
            </span>
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
        <p style={{ fontFamily: serif, fontSize: "clamp(19px, 2.2vw, 24px)", fontStyle: "italic", color: navy, lineHeight: 1.8, padding: "0 0 0 28px", borderLeft: `3px solid ${orange}`, marginBottom: 0 }}>
          {t(
            "You have probably heard it said that God has a plan for your life. A personal plan. A specific calling, uniquely yours, discovered in solitude. Both those who found that framing obvious and those who found it quietly wrong can end up in the same place: doing the work of God in increasing isolation, wondering why it feels smaller than it should.",
            "Anda mungkin pernah mendengar bahwa Allah memiliki rencana bagi hidup Anda. Rencana pribadi. Panggilan khusus, unik milik Anda, ditemukan dalam kesendirian. Mereka yang merasa hal itu jelas dan mereka yang diam-diam merasa itu salah bisa berakhir di tempat yang sama: melakukan pekerjaan Allah dalam kesendirian yang semakin besar, bertanya-tanya mengapa rasanya lebih kecil dari seharusnya."
          )}
        </p>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 720, margin: "48px auto 0", padding: "0 24px" }}>
        <div style={{ height: 1, background: "oklch(90% 0.008 80)" }} />
      </div>

      {/* Section 1 */}
      <div style={{ padding: "80px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 24 }}>
          {t("I. The Myth", "I. Mitos")}
        </p>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 32, lineHeight: 1.2, fontStyle: "italic" }}>
          {t("The Myth of the Personal Calling", "Mitos Panggilan Pribadi")}
        </h2>
        <div style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9 }}>
          <p style={{ marginBottom: 24 }}>
            {t(
              "The idea of a private, individual calling — uniquely yours, between you and God, discovered in solitude — is not a biblical pattern. It is a cultural product: Western Enlightenment thinking combined with evangelical individualism.",
              "Gagasan tentang panggilan pribadi dan individual, milik Anda sendiri, antara Anda dan Allah, ditemukan dalam kesendirian, bukan pola alkitabiah. Itu adalah produk budaya: pemikiran Pencerahan Barat yang digabungkan dengan individualisme injili."
            )}
          </p>
          <p style={{ marginBottom: 0 }}>
            {t(
              "Much of the world has always found this framing strange. In cultures where identity is relational, where self only exists in community, the idea that God would whisper your calling to you alone — and that you would then carry it alone — feels both foreign and small. They were right to notice.",
              "Sebagian besar dunia selalu menganggap kerangka ini aneh. Dalam budaya di mana identitas bersifat relasional, di mana diri hanya ada dalam komunitas, gagasan bahwa Allah akan membisikkan panggilan Anda kepada Anda sendirian, dan bahwa Anda kemudian akan membawanya sendirian, terasa asing dan kecil. Mereka benar untuk memperhatikan hal ini."
            )}
          </p>
        </div>
      </div>

      {/* Section 2 */}
      <div style={{ background: lightGray, padding: "80px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 24 }}>
            {t("II. The Pattern", "II. Pola")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 32, lineHeight: 1.2, fontStyle: "italic" }}>
            {t("How God Actually Works", "Bagaimana Allah Sebenarnya Bekerja")}
          </h2>
          <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9, marginBottom: 48 }}>
            {t(
              "Five times in Scripture, calling arrives through community, not through private encounter. The pattern is consistent enough to be intentional.",
              "Lima kali dalam Kitab Suci, panggilan datang melalui komunitas, bukan melalui perjumpaan pribadi. Polanya cukup konsisten untuk disengaja."
            )}
          </p>

          {/* Bible Pattern Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {BIBLE_CARDS.map((card, i) => (
              <div
                key={i}
                style={{
                  background: offWhite,
                  borderRadius: 6,
                  padding: "32px 36px",
                  borderLeft: `4px solid ${orange}`,
                }}
              >
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
                  {String(i + 1).padStart(2, "0")} — {lang === "en" ? card.en_label : card.id_label}
                </p>
                <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: bodyText, lineHeight: 1.85, margin: 0 }}>
                  {lang === "en" ? card.en_body : card.id_body}
                </p>
              </div>
            ))}
            {/* Nehemiah and early church as brief additional cards */}
            <div style={{ background: offWhite, borderRadius: 6, padding: "32px 36px", borderLeft: `4px solid ${orange}` }}>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
                04 — {t("Nehemiah", "Nehemia")}
              </p>
              <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: bodyText, lineHeight: 1.85, margin: 0 }}>
                {t(
                  "Nehemiah had a vision. But the wall was rebuilt by families, clans, and guilds working on the section nearest their own home. The vision was his. The work required everyone.",
                  "Nehemia punya visi. Tetapi tembok itu dibangun kembali oleh keluarga, klan, dan kelompok yang bekerja di bagian terdekat dari rumah mereka. Visinya miliknya. Pekerjaannya membutuhkan semua orang."
                )}
              </p>
            </div>
            <div style={{ background: offWhite, borderRadius: 6, padding: "32px 36px", borderLeft: `4px solid ${orange}` }}>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
                05 — {t("The Early Church", "Gereja Mula-mula")}
              </p>
              <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: bodyText, lineHeight: 1.85, margin: 0 }}>
                {t(
                  "Elders were appointed in every city, always in the plural. The church recognized gifts communally. No leader was installed alone, or sent alone.",
                  "Penatua diangkat di setiap kota, selalu dalam bentuk jamak. Jemaat mengakui karunia secara bersama. Tidak ada pemimpin yang ditetapkan sendirian, atau diutus sendirian."
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: "oklch(90% 0.008 80)" }} />
      </div>

      {/* Section 3 */}
      <div style={{ padding: "80px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 24 }}>
          {t("III. The Body", "III. Tubuh")}
        </p>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 32, lineHeight: 1.2, fontStyle: "italic" }}>
          {t("A Fragment, Not the Whole", "Sepotong, Bukan Keseluruhan")}
        </h2>
        <div style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9 }}>
          <p style={{ marginBottom: 24 }}>
            {t(
              "1 Corinthians 12 uses the body metaphor not to celebrate personal gifts, but to expose the absurdity of any one part claiming to be the whole. The eye cannot say to the hand, 'I don't need you.' The foot cannot decide the body has no use for an ear.",
              "1 Korintus 12 menggunakan metafora tubuh bukan untuk merayakan karunia pribadi, tetapi untuk mengungkap absurditas jika satu bagian mengklaim menjadi keseluruhan. Mata tidak bisa berkata kepada tangan, 'Aku tidak membutuhkanmu.' Kaki tidak bisa memutuskan bahwa tubuh tidak memerlukan telinga."
            )}
          </p>
          <p style={{ marginBottom: 0 }}>
            {t(
              "Your calling makes sense inside a body. Outside one, it tends to drift, shrink, or harden. You were not designed to carry it alone, and the fact that it feels smaller in isolation is not a motivation problem. It is a structural one.",
              "Panggilanmu masuk akal di dalam tubuh. Di luarnya, ia cenderung melayang, mengecil, atau mengeras. Anda tidak dirancang untuk menanggungnya sendirian, dan fakta bahwa itu terasa lebih kecil dalam kesendirian bukan masalah motivasi. Itu masalah struktural."
            )}
          </p>
        </div>
      </div>

      {/* Section 4 */}
      <div style={{ background: navy, padding: "80px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 24 }}>
            {t("IV. The Warning", "IV. Peringatan")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: offWhite, marginBottom: 32, lineHeight: 1.2, fontStyle: "italic" }}>
            {t("When Vision Becomes Isolation", "Ketika Visi Menjadi Isolasi")}
          </h2>
          <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: "oklch(76% 0.03 80)", lineHeight: 1.9, marginBottom: 32 }}>
            {t(
              "Individual calling without community becomes a closed system. No accountability. No correction. Often, less fruit than expected.",
              "Panggilan individual tanpa komunitas menjadi sistem yang tertutup. Tidak ada akuntabilitas. Tidak ada koreksi. Seringkali, buah yang lebih sedikit dari yang diharapkan."
            )}
          </p>
          <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: "oklch(76% 0.03 80)", lineHeight: 1.9, marginBottom: 40 }}>
            {t(
              "When a leader insulates their vision from others, three things typically follow: the vision calcifies around the leader's limitations, blind spots go unnoticed until they are expensive, and the fruit is real but thinner than it could have been. This is not a shame diagnosis. It is a structural one. The design was always communal.",
              "Ketika seorang pemimpin mengisolasi visi mereka dari orang lain, tiga hal biasanya terjadi: visi mengeras di sekitar keterbatasan pemimpin, titik buta tidak diperhatikan hingga menjadi mahal, dan buah nyata tetapi lebih tipis dari yang seharusnya. Ini bukan diagnosis rasa malu. Ini adalah diagnosis struktural. Rancangannya selalu bersifat komunal."
            )}
          </p>
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

      {/* Section 5 */}
      <div style={{ padding: "80px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 24 }}>
          {t("V. The First Act", "V. Tindakan Pertama")}
        </p>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 32, lineHeight: 1.2, fontStyle: "italic" }}>
          {t("Name Your Calling Community", "Namai Komunitas Panggilanmu")}
        </h2>
        <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9 }}>
          {t(
            "Write down the people without whom your calling would not exist, could not function, or has been shaped by. Naming them is the first act of stewardship.",
            "Tuliskan orang-orang yang tanpanya panggilan Anda tidak akan ada, tidak bisa berfungsi, atau telah dibentuk oleh mereka. Menamai mereka adalah tindakan pertama dari pengelolaan."
          )}
        </p>
      </div>

      {/* Interactive: The Calling Web */}
      <div style={{ background: lightGray, padding: "80px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 16, textAlign: "center" }}>
            {t("Interactive", "Interaktif")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 700, color: navy, marginBottom: 12, lineHeight: 1.2, fontStyle: "italic", textAlign: "center" }}>
            {t("The Calling Web", "Jaring Panggilan")}
          </h2>
          <p style={{ fontFamily: serif, fontSize: "clamp(15px, 1.7vw, 18px)", color: bodyText, lineHeight: 1.75, textAlign: "center", marginBottom: 52 }}>
            {t(
              "Fill in your name at the centre. Then name one person in each role around you.",
              "Isi nama Anda di tengah. Kemudian namai satu orang dalam setiap peran di sekitar Anda."
            )}
          </p>

          {/* Web diagram */}
          <div style={{ position: "relative", width: "100%", maxWidth: 560, margin: "0 auto", aspectRatio: "1 / 1" }}>
            {/* Connection lines — drawn as absolutely-positioned thin divs */}
            {nodeAngles.map((angle, i) => {
              const rad = (angle - 90) * (Math.PI / 180);
              // Centre is at 50%, 50%. Node centres at ~38% from centre (radius ~38% of box).
              const cx = 50;
              const cy = 50;
              const r = 38;
              const nx = cx + r * Math.cos(rad);
              const ny = cy + r * Math.sin(rad);
              // Line from centre to node centre
              const dx = nx - cx;
              const dy = ny - cy;
              const length = Math.sqrt(dx * dx + dy * dy);
              const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
              const filled = nodeValues[WEB_NODES[i].key]?.trim() !== "";
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${cx}%`,
                    top: `${cy}%`,
                    width: `${length}%`,
                    height: 2,
                    background: filled ? orange : "oklch(82% 0.01 80)",
                    transformOrigin: "0 50%",
                    transform: `rotate(${angleDeg}deg)`,
                    transition: "background 0.3s ease",
                  }}
                />
              );
            })}

            {/* Centre node */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: navy,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
                boxShadow: "0 4px 20px oklch(10% 0.05 260 / 0.2)",
              }}
            >
              <input
                value={centerName}
                onChange={(e) => setCenterName(e.target.value)}
                placeholder={t("Your name", "Nama Anda")}
                maxLength={20}
                style={{
                  width: 80,
                  background: "transparent",
                  border: "none",
                  borderBottom: `1px solid ${orange}`,
                  color: offWhite,
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  textAlign: "center",
                  outline: "none",
                  padding: "2px 0",
                  letterSpacing: "0.04em",
                }}
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
                <div
                  key={node.key}
                  style={{
                    position: "absolute",
                    left: `${cx}%`,
                    top: `${cy}%`,
                    transform: "translate(-50%, -50%)",
                    width: 96,
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      background: filled ? orange : offWhite,
                      border: `2px solid ${filled ? orange : "oklch(82% 0.01 80)"}`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.3s ease, border-color 0.3s ease",
                      boxShadow: filled ? `0 2px 12px ${orange}44` : "none",
                    }}
                  >
                    {filled ? (
                      <span style={{ fontSize: 20, color: offWhite }}>✓</span>
                    ) : (
                      <span style={{ fontFamily: serif, fontSize: 8, color: bodyText, letterSpacing: "0.04em", textTransform: "uppercase", textAlign: "center", padding: "0 8px", lineHeight: 1.3 }}>
                        {lang === "en" ? node.en_label : node.id_label}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Node input fields — below the diagram */}
          <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 20 }}>
            {WEB_NODES.map((node, i) => {
              const filled = nodeValues[node.key]?.trim() !== "";
              return (
                <div key={node.key} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: filled ? orange : "oklch(88% 0.01 80)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "background 0.3s ease",
                      marginTop: 4,
                    }}
                  >
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
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        fontFamily: serif,
                        fontSize: "clamp(15px, 1.6vw, 17px)",
                        color: bodyText,
                        background: offWhite,
                        border: `1px solid ${filled ? orange : "oklch(88% 0.01 80)"}`,
                        borderRadius: 4,
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Completion message */}
          {allFilled && (
            <div
              style={{
                marginTop: 48,
                background: navy,
                borderRadius: 6,
                padding: "40px 40px",
                textAlign: "center",
              }}
            >
              <p style={{ fontFamily: serif, fontSize: "clamp(20px, 2.5vw, 26px)", fontStyle: "italic", color: offWhite, lineHeight: 1.75, marginBottom: 20 }}>
                {t(
                  "This is your calling — not just the part in the middle.",
                  "Inilah panggilanmu — bukan hanya bagian di tengahnya."
                )}
              </p>
              <p style={{ fontFamily: serif, fontSize: "clamp(15px, 1.7vw, 18px)", color: "oklch(76% 0.03 80)", lineHeight: 1.75, margin: 0 }}>
                {t(
                  "You have named six people who are woven into the work God has called you to. Every one of them is part of the tapestry. None of it belongs to you alone.",
                  "Anda telah menamai enam orang yang terjalin dalam pekerjaan yang Allah panggil Anda untuk lakukan. Setiap satu dari mereka adalah bagian dari permadani. Tidak ada yang menjadi milik Anda sendiri."
                )}
              </p>
            </div>
          )}

          {/* Progress indicator */}
          {!allFilled && filledCount > 0 && (
            <p style={{ textAlign: "center", marginTop: 32, fontFamily: "Montserrat, sans-serif", fontSize: 12, color: bodyText, letterSpacing: "0.06em" }}>
              {filledCount} / 6 {t("completed", "selesai")}
            </p>
          )}
        </div>
      </div>

      {/* Faith Anchor */}
      <div style={{ padding: "80px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 24, textAlign: "center" }}>
          {t("Faith Anchor", "Jangkar Iman")}
        </p>
        <div style={{ background: lightGray, borderRadius: 6, padding: "44px 48px", textAlign: "center" }}>
          <p style={{ fontFamily: serif, fontSize: "clamp(20px, 2.5vw, 28px)", fontStyle: "italic", color: navy, lineHeight: 1.75, marginBottom: 20 }}>
            {t(
              "If the whole body were an eye, where would the sense of hearing be?",
              "Kalau seluruh tubuh adalah mata, di manakah pendengaran?"
            )}
          </p>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em", marginBottom: 28 }}>
            — {t("1 Corinthians 12:17 (NIV)", "1 Korintus 12:17 (TB)")}
          </p>
          <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: bodyText, lineHeight: 1.85, margin: 0 }}>
            {t(
              "Your calling is not diminished by being one part of many. It is made meaningful precisely because the whole requires it.",
              "Panggilanmu tidak berkurang karena menjadi satu bagian dari banyak bagian. Ini menjadi bermakna justru karena keseluruhannya membutuhkannya."
            )}
          </p>
        </div>
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
