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

      {/* Hero */}
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

      {/* Divider */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: "oklch(90% 0.008 80)" }} />
      </div>

      {/* Section 6 */}
      <div style={{ padding: "80px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 24 }}>
          {t("VI. The Generations", "VI. Generasi")}
        </p>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 32, lineHeight: 1.2, fontStyle: "italic" }}>
          {t("A Calling That Cannot Be Held", "Panggilan yang Tidak Bisa Digenggam Sendiri")}
        </h2>
        <div style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9 }}>
          <p style={{ marginBottom: 24 }}>
            {t(
              "The patterns are too consistent to ignore. Moses hands the staff to Joshua. Elijah throws his cloak over Elisha before he has said a word. Paul writes to Timothy with the tenderness of a father who knows his time is short. In each case, the calling does not terminate with the one who first received it. It moves. It passes. It multiplies through relationship and trust and deliberate release.",
              "Polanya terlalu konsisten untuk diabaikan. Musa menyerahkan tongkatnya kepada Yosua. Elia melemparkan jubahnya kepada Elisa bahkan sebelum mengucapkan sepatah kata. Paulus menulis kepada Timotius dengan kelembutan seorang ayah yang tahu waktunya tinggal sedikit. Dalam setiap kasus, panggilan itu tidak berakhir pada orang yang pertama menerimanya. Ia bergerak. Ia diteruskan. Ia berlipat ganda melalui hubungan, kepercayaan, dan pelepasan yang disengaja."
            )}
          </p>
          <p style={{ marginBottom: 24 }}>
            {t(
              "This is not merely about succession planning. It is about the nature of calling itself. A calling that is only ever received and never passed on has been, at some point, quietly converted into a possession. The leader who cannot name who is coming behind them, who has no one they are actively preparing to carry more of what they carry, is a leader whose calling has begun to close in on itself. The body metaphor from 1 Corinthians 12 applies across time as much as across teams: the eye cannot say to the generation that follows it, I have no need of you.",
              "Ini bukan sekadar tentang perencanaan suksesi. Ini tentang sifat panggilan itu sendiri. Sebuah panggilan yang hanya diterima dan tidak pernah diteruskan, pada suatu titik, secara diam-diam telah berubah menjadi kepemilikan pribadi. Pemimpin yang tidak bisa menyebut siapa yang sedang datang di belakangnya, yang tidak secara aktif mempersiapkan siapa pun untuk menanggung lebih banyak dari apa yang ia tanggung, adalah pemimpin yang panggilannya telah mulai menutup dirinya sendiri. Metafora tubuh dalam 1 Korintus 12 berlaku lintas generasi sama seperti lintas tim: mata tidak bisa berkata kepada generasi yang mengikutinya, aku tidak membutuhkanmu."
            )}
          </p>
          <p style={{ marginBottom: 0 }}>
            {t(
              "To receive well is to receive with open hands. And open hands, by definition, can let things pass through. This does not mean abandoning what you carry before you are finished carrying it. But it does mean holding it in a way that someone else can one day reach for it. The most dangerous version of this failure is not the leader who refuses to hand anything over. It is the leader who genuinely wants to invest in the next generation but has never examined whether what they are modelling is transferable, or whether their influence requires their physical presence to survive.",
              "Menerima dengan baik berarti menerima dengan tangan terbuka. Dan tangan yang terbuka, pada dasarnya, membiarkan sesuatu mengalir melewatinya. Ini bukan berarti melepaskan apa yang kamu emban sebelum waktunya selesai. Tetapi ini berarti memegangnya sedemikian rupa sehingga suatu hari nanti orang lain bisa meraihnya. Kegagalan yang paling berbahaya bukan pemimpin yang menolak menyerahkan apa pun. Melainkan pemimpin yang sungguh-sungguh ingin berinvestasi dalam generasi berikutnya, tetapi tidak pernah memeriksa apakah apa yang ia modelkan bisa ditransfer, atau apakah pengaruhnya membutuhkan kehadirannya secara fisik untuk bertahan."
            )}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: "oklch(90% 0.008 80)" }} />
      </div>

      {/* Section 7 */}
      <div style={{ background: lightGray, padding: "80px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 24 }}>
            {t("VII. The Cross-Cultural Dimension", "VII. Dimensi Lintas Budaya")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 32, lineHeight: 1.2, fontStyle: "italic" }}>
            {t("The Exception That Became the Default", "Pengecualian yang Menjadi Standar")}
          </h2>
          <div style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9 }}>
            <p style={{ marginBottom: 24 }}>
              {t(
                "Western Christianity developed its theology of calling in a particular cultural context: individualist, low-context, shaped by Enlightenment assumptions about the autonomous self. In that framework, the question of calling naturally became a personal question. What has God called me to do? What is my purpose? Where do I fit? These are not bad questions. But they are not the only way the question can be formed, and for much of the global church, they are not even the primary way.",
                "Kekristenan Barat mengembangkan teologi panggilannya dalam konteks budaya tertentu: individualistis, low-context, dibentuk oleh asumsi-asumsi Pencerahan tentang diri yang otonom. Dalam kerangka itu, pertanyaan tentang panggilan secara alami menjadi pertanyaan pribadi. Apa yang Tuhan panggil aku untuk lakukan? Apa tujuanku? Di mana aku cocok? Ini bukan pertanyaan yang buruk. Tetapi bukan satu-satunya cara pertanyaan itu bisa dirumuskan, dan bagi sebagian besar gereja global, itu bahkan bukan cara utama."
              )}
            </p>
            <p style={{ marginBottom: 24 }}>
              {t(
                "The majority world — sub-Saharan Africa, East and Southeast Asia, the Middle East, Latin America — operates largely within collectivist and honor-based frameworks where identity is relational by default. In these contexts, calling is not primarily a private discovery. It is a communal recognition. The community sees something in you, speaks it, and sends you. The calling does not exist until it has been named out loud by people who know you and who will bear responsibility for you. This is not a lesser theology. It may, in fact, be the closer reading of the biblical text.",
                "Dunia mayoritas — Afrika Sub-Sahara, Asia Timur dan Tenggara, Timur Tengah, Amerika Latin — sebagian besar beroperasi dalam kerangka kolektivistis dan berbasis kehormatan di mana identitas pada dasarnya bersifat relasional. Dalam konteks ini, panggilan bukan terutama sebuah penemuan pribadi. Panggilan adalah pengakuan komunal. Komunitas melihat sesuatu dalam dirimu, menyuarakannya, dan mengutusmu. Panggilan itu tidak ada sampai diucapkan dengan lantang oleh orang-orang yang mengenalmu dan yang akan menanggung tanggung jawab atasmu. Ini bukan teologi yang lebih rendah. Bahkan, mungkin ini adalah pembacaan yang lebih dekat dengan teks Alkitab."
              )}
            </p>
            <p style={{ marginBottom: 0 }}>
              {t(
                "When cross-cultural workers arrive in collectivist contexts carrying an individualist model of calling, the friction is real but often invisible. They have experienced their calling as something between themselves and God, confirmed perhaps by a pastor or a sending organisation, but ultimately personal. The people they work with may find this difficult to comprehend, not because they lack faith, but because in their understanding, a person who cannot be placed within a web of relationships and accountabilities has not yet fully arrived. The gift these cultures carry for the global church is the reminder that calling was never meant to be a solo project, and they have been living that truth all along.",
                "Ketika para pekerja lintas budaya tiba di konteks kolektivistis dengan membawa model panggilan yang individualistis, gesekan itu nyata tetapi sering tidak terlihat. Mereka mengalami panggilan mereka sebagai sesuatu antara diri mereka dan Tuhan, mungkin dikonfirmasi oleh seorang pendeta atau organisasi pengirim, tetapi pada akhirnya bersifat pribadi. Orang-orang yang mereka layani mungkin merasa ini sulit dipahami, bukan karena mereka kurang iman, tetapi karena dalam pemahaman mereka, seseorang yang tidak bisa ditempatkan dalam jaringan hubungan dan akuntabilitas belum sepenuhnya hadir. Karunia yang dibawa budaya-budaya ini bagi gereja global adalah pengingat bahwa panggilan tidak pernah dimaksudkan sebagai proyek solo, dan mereka telah hidup dalam kebenaran itu sepanjang waktu."
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: "oklch(90% 0.008 80)" }} />
      </div>

      {/* Section 8 */}
      <div style={{ padding: "80px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 24 }}>
          {t("VIII. Questions to Sit With", "VIII. Pertanyaan untuk Direnungkan")}
        </p>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 48, lineHeight: 1.2, fontStyle: "italic" }}>
          {t("Stay Here a While", "Tinggal Sejenak di Sini")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {([
            {
              en_title: "Who sent you?",
              id_title: "Siapa yang mengutusmu?",
              en_body: "Not who inspired you, or who encouraged you to explore the possibility. Who actually sent you? Who said, we see this in you, we are behind you, we will answer for you? And do those people still know where you are? Not your organisation's records, not your newsletter list — the people. If you have drifted so far from the community that sent you that they could not describe what you do on a Tuesday, something worth examining has happened in the distance between you and them.",
              id_body: "Bukan siapa yang menginspirasimu, atau siapa yang mendorongmu untuk menjelajahi kemungkinan ini. Siapa yang benar-benar mengutusmu? Siapa yang berkata, kami melihat ini dalam dirimu, kami mendukungmu, kami akan bertanggung jawab atasmu? Dan apakah orang-orang itu masih tahu di mana kamu berada? Bukan catatan organisasimu, bukan daftar newsletter-mu — orangnya. Jika kamu telah melayang begitu jauh dari komunitas yang mengutusmu sehingga mereka tidak bisa menggambarkan apa yang kamu lakukan pada hari Selasa, ada sesuatu yang layak diperiksa dalam jarak antara kamu dan mereka.",
            },
            {
              en_title: "What part of the body are you?",
              id_title: "Bagian tubuh apakah kamu?",
              en_body: "Paul's question in 1 Corinthians 12 is not rhetorical. It is diagnostic. Every part of the body has a specific function, a specific placement, a specific set of things it cannot and should not try to do. The eye does excellent eye work. It does not attempt to walk. There is something clarifying about sitting with the question: what does my particular part of the body do well, and where have I been quietly trying to do the work of a part I am not? This is not a question about personality types or strength profiles. It is a question about the shape of your obedience.",
              id_body: "Pertanyaan Paulus dalam 1 Korintus 12 bukan retorika. Itu adalah diagnosis. Setiap bagian tubuh memiliki fungsi spesifik, penempatan spesifik, serangkaian hal spesifik yang tidak bisa dan tidak seharusnya ia coba lakukan. Mata melakukan pekerjaan mata dengan sangat baik. Ia tidak mencoba berjalan. Ada sesuatu yang menjernihkan ketika kita duduk dengan pertanyaan ini: apa yang bagian tubuhku ini lakukan dengan baik, dan di mana aku diam-diam mencoba melakukan pekerjaan bagian yang bukan aku? Ini bukan pertanyaan tentang tipe kepribadian atau profil kekuatan. Ini pertanyaan tentang bentuk ketaatanmu.",
            },
            {
              en_title: "Who are you passing this to?",
              id_title: "Kepada siapa kamu meneruskan ini?",
              en_body: "This question is not about legacy in the sense of monuments or memories. It is simpler and more uncomfortable than that. Is there someone, right now, who is learning something from being close to you that they could not learn from a book or a course or a mentor they have never met? If the answer is no, it is worth asking why. It may be capacity. It may be context. But it may also be that somewhere along the way, the calling quietly stopped being something you carry for others and started being something you carry for yourself.",
              id_body: "Pertanyaan ini bukan tentang warisan dalam arti monumen atau kenangan. Ini lebih sederhana dan lebih tidak nyaman dari itu. Apakah ada seseorang, saat ini, yang sedang belajar sesuatu karena dekat denganmu, sesuatu yang tidak bisa mereka pelajari dari buku atau kursus atau mentor yang belum pernah mereka temui? Jika jawabannya tidak, ada baiknya bertanya mengapa. Mungkin karena kapasitas. Mungkin karena konteks. Tetapi mungkin juga karena di suatu titik perjalanan ini, panggilan itu diam-diam berhenti menjadi sesuatu yang kamu emban untuk orang lain dan mulai menjadi sesuatu yang kamu emban untuk dirimu sendiri.",
            },
            {
              en_title: "What would it mean to hold this more loosely?",
              id_title: "Apa artinya memegang ini dengan lebih longgar?",
              en_body: "Not to abandon it. Not to be careless with it. But to hold it in a way where, if God asked you tomorrow to set it down or hand it to someone else or pick it up in a different shape, you would be able to. Calling held too tightly looks like devotion from the inside. From the outside, and sometimes in the quiet moments when you are honest with yourself, it looks more like control. The question is not whether you are committed. It is whether the thing you are committed to has room to breathe, to grow, to be given away.",
              id_body: "Bukan untuk meninggalkannya. Bukan untuk tidak peduli dengannya. Tetapi memegangnya sedemikian rupa sehingga, jika Tuhan memintamu besok untuk meletakkannya, menyerahkannya kepada orang lain, atau mengangkatnya dalam bentuk yang berbeda, kamu bisa melakukannya. Panggilan yang dipegang terlalu erat terlihat seperti pengabdian dari dalam. Dari luar, dan kadang-kadang di momen-momen sunyi ketika kamu jujur dengan dirimu sendiri, itu terlihat lebih seperti kontrol. Pertanyaannya bukan apakah kamu berkomitmen. Melainkan apakah hal yang kamu perjuangkan itu punya ruang untuk bernafas, untuk tumbuh, untuk diberikan.",
            },
          ] as const).map((q, i) => (
            <div key={i} style={{ borderTop: `1px solid oklch(90% 0.008 80)`, paddingTop: 40, paddingBottom: 40 }}>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 style={{ fontFamily: serif, fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 700, color: navy, marginBottom: 20, fontStyle: "italic", lineHeight: 1.3 }}>
                {lang === "en" ? q.en_title : q.id_title}
              </h3>
              <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9, margin: 0 }}>
                {lang === "en" ? q.en_body : q.id_body}
              </p>
            </div>
          ))}
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
