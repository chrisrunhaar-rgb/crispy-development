"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";
import SourcesDropdown from "@/components/SourcesDropdown";

type Lang = "en" | "id";
const tFn = (en: string, id: string, lang: Lang) => lang === "id" ? id : en;

const PANES = [
  {
    key: "open",
    row: 0, col: 0,
    color: "oklch(48% 0.14 145)",
    colorBg: "oklch(48% 0.14 145 / 0.08)",
    colorBorder: "oklch(48% 0.14 145)",
    en_title: "Open", en_sub: "The Arena",
    id_title: "Terbuka", id_sub: "Arena",
    en_body: "What is known both to you and to those around you. This is the space of honest, effective collaboration. The larger your Arena, the less energy people spend guessing your motives, second-guessing your decisions, or managing around your blind spots.",
    id_body: "Apa yang diketahui baik oleh Anda maupun orang-orang di sekitar Anda. Ini adalah ruang kolaborasi yang jujur dan efektif. Semakin besar Arena Anda, semakin sedikit energi yang dihabiskan orang untuk menebak motif Anda, meragukan keputusan Anda, atau mengelola sekitar titik buta Anda.",
    en_cross: "In Dutch and German contexts, the Arena tends to be large — directness and transparency are cultural defaults. In Indonesian, Filipino, and many East Asian contexts, the Arena builds slowly through relational investment. Expecting a large Arena early often creates mistrust.",
    id_cross: "Dalam konteks Belanda dan Jerman, Arena cenderung besar — kejujuran dan transparansi adalah default budaya. Dalam konteks Indonesia, Filipina, dan banyak konteks Asia Timur, Arena berkembang perlahan melalui investasi relasional. Mengharapkan Arena yang besar di awal sering menciptakan ketidakpercayaan.",
    en_question: "Where in your leadership relationships has the Arena shrunk — and what closed it?",
    id_question: "Di mana dalam hubungan kepemimpinan Anda Arena menyusut — dan apa yang menutupnya?",
    en_action: "This week: share one thing about how you process conflict or feedback that your team probably doesn't know. Not vulnerability for vulnerability's sake — but information that helps them work with you better.",
    id_action: "Minggu ini: bagikan satu hal tentang bagaimana Anda memproses konflik atau umpan balik yang mungkin tidak diketahui tim Anda. Bukan kerentanan demi kerentanan — tetapi informasi yang membantu mereka bekerja lebih baik dengan Anda.",
  },
  {
    key: "blind",
    row: 0, col: 1,
    color: "oklch(58% 0.15 15)",
    colorBg: "oklch(58% 0.15 15 / 0.08)",
    colorBorder: "oklch(58% 0.15 15)",
    en_title: "Blind Spot",  en_sub: "What others see in you",
    id_title: "Titik Buta",  id_sub: "Apa yang dilihat orang lain pada Anda",
    en_body: "What others observe in you that you cannot see yourself. This is the most dangerous quadrant for leaders: your impact on the room, the way your stress lands on your team, the patterns in how you make decisions under pressure. You are the last to know.",
    id_body: "Apa yang diamati orang lain pada diri Anda yang tidak bisa Anda lihat sendiri. Ini adalah kuadran paling berbahaya bagi pemimpin: dampak Anda di ruangan, cara stres Anda mempengaruhi tim, pola cara Anda mengambil keputusan di bawah tekanan. Anda adalah orang terakhir yang tahu.",
    en_cross: "Cross-cultural blind spots are especially common. A Western leader's 'directness' may land as aggression. An Indonesian leader's 'respect for hierarchy' may land as withholding. Neither intends the impact they create.",
    id_cross: "Titik buta lintas budaya sangat umum terjadi. 'Ketegasan' pemimpin Barat mungkin terasa seperti agresi. 'Penghormatan terhadap hierarki' pemimpin Indonesia mungkin terasa seperti menahan informasi. Tidak ada yang bermaksud menciptakan dampak yang mereka buat.",
    en_question: "If you could hear an honest conversation your team was having about your leadership style when you weren't in the room — what would you be afraid to hear?",
    id_question: "Jika Anda bisa mendengar percakapan jujur yang dilakukan tim Anda tentang gaya kepemimpinan Anda saat Anda tidak ada di ruangan — apa yang akan Anda takutkan untuk didengar?",
    en_action: "This week: ask one person who will be honest with you — 'What's one thing I do that makes your job harder?' Listen without defending. Thank them. That gap is your blind spot.",
    id_action: "Minggu ini: tanyakan kepada satu orang yang akan jujur kepada Anda — 'Apa satu hal yang saya lakukan yang membuat pekerjaan Anda lebih sulit?' Dengarkan tanpa membela diri. Ucapkan terima kasih. Celah itu adalah titik buta Anda.",
  },
  {
    key: "hidden",
    row: 1, col: 0,
    color: "oklch(65% 0.15 45)",
    colorBg: "oklch(65% 0.15 45 / 0.08)",
    colorBorder: "oklch(65% 0.15 45)",
    en_title: "Hidden", en_sub: "The Facade",
    id_title: "Tersembunyi", id_sub: "Fasad",
    en_body: "What you know about yourself but have chosen not to share. Some of this is appropriate — not everything needs to be disclosed. But when the Hidden pane grows too large, the gap between your private self and your presented self creates exhaustion.² You spend energy managing the gap.",
    id_body: "Apa yang Anda ketahui tentang diri sendiri tetapi memilih untuk tidak dibagikan. Sebagian dari ini wajar — tidak semuanya perlu diungkapkan. Tetapi ketika pane Tersembunyi tumbuh terlalu besar, celah antara diri pribadi dan diri yang ditampilkan menciptakan kelelahan. Anda menghabiskan energi mengelola celah tersebut.",
    en_cross: "In high-context cultures (Indonesia, Japan, Korea), a larger Hidden pane is not dysfunction — it is social wisdom. What you share with your team leader is different from what you share with a peer. Cross-cultural leaders must read this without pathologising it.",
    id_cross: "Dalam budaya high-context (Indonesia, Jepang, Korea), pane Tersembunyi yang lebih besar bukan disfungsi — itu adalah kebijaksanaan sosial. Apa yang Anda bagikan dengan pemimpin tim berbeda dari apa yang Anda bagikan dengan rekan. Pemimpin lintas budaya harus membaca ini tanpa menjadikannya patologis.",
    en_question: "What is something true about your leadership — a struggle, a fear, a pattern — that you have never said out loud to your team?",
    id_question: "Apa sesuatu yang benar tentang kepemimpinan Anda — sebuah perjuangan, ketakutan, pola — yang belum pernah Anda katakan dengan keras kepada tim Anda?",
    en_action: "This week: identify one thing in your Hidden pane that, if shared appropriately, would actually help your team trust you more. Consider whether it is time to move it toward the Open.",
    id_action: "Minggu ini: identifikasi satu hal dalam pane Tersembunyi Anda yang, jika dibagikan dengan tepat, sebenarnya akan membantu tim Anda mempercayai Anda lebih banyak. Pertimbangkan apakah sudah waktunya untuk memindahkannya ke arah Terbuka.",
  },
  {
    key: "unknown",
    row: 1, col: 1,
    color: "oklch(45% 0.08 260)",
    colorBg: "oklch(45% 0.08 260 / 0.08)",
    colorBorder: "oklch(45% 0.08 260)",
    en_title: "Unknown", en_sub: "Undiscovered territory",
    id_title: "Tidak Diketahui", id_sub: "Wilayah yang belum ditemukan",
    en_body: "What neither you nor others currently know about you. This is not emptiness — it is potential. It includes gifts not yet discovered, patterns not yet seen, capacities not yet tested. Cross-cultural challenge is one of the fastest ways to bring the Unknown into view.",
    id_body: "Apa yang saat ini tidak diketahui oleh Anda maupun orang lain tentang Anda. Ini bukan kekosongan — ini adalah potensi. Ini mencakup karunia yang belum ditemukan, pola yang belum terlihat, kapasitas yang belum diuji. Tantangan lintas budaya adalah salah satu cara tercepat untuk membawa yang Tidak Diketahui ke permukaan.",
    en_cross: "Every major cross-cultural posting reveals something leaders didn't know about themselves — a resilience they didn't have at home, a rigidity that only shows under unfamiliar pressure. The Unknown shrinks through challenge, not comfort.",
    id_cross: "Setiap penugasan lintas budaya utama mengungkapkan sesuatu tentang diri pemimpin yang belum mereka ketahui — ketahanan yang tidak mereka miliki di rumah, kekakuan yang hanya muncul di bawah tekanan yang tidak familiar. Yang Tidak Diketahui menyusut melalui tantangan, bukan kenyamanan.",
    en_question: "What cross-cultural experience in the past two years has shown you something about yourself you didn't previously know?",
    id_question: "Pengalaman lintas budaya apa dalam dua tahun terakhir yang telah menunjukkan sesuatu tentang diri Anda yang belum Anda ketahui sebelumnya?",
    en_action: "This week: step deliberately into one unfamiliar cross-cultural situation — a conversation, a meeting, a responsibility you usually avoid. Notice what it surfaces in you. That is the Unknown becoming visible.",
    id_action: "Minggu ini: masuki dengan sengaja satu situasi lintas budaya yang tidak familiar — percakapan, rapat, tanggung jawab yang biasanya Anda hindari. Perhatikan apa yang muncul dalam diri Anda. Itulah yang Tidak Diketahui menjadi terlihat.",
  },
];

const VERSES = {
  "ps-139-23": {
    en_ref: "Psalm 139:23–24",
    id_ref: "Mazmur 139:23–24",
    en: "Search me, God, and know my heart; test me and know my anxious thoughts. See if there is any offensive way in me, and lead me in the way everlasting.",
    id: "Selidikilah aku, ya Allah, dan kenallah hatiku, ujilah aku dan kenallah pikiran-pikiranku; lihatlah, apakah jalanku serong, dan tuntunlah aku di jalan yang kekal!",
  },
  "1cor-13-12": {
    en_ref: "1 Corinthians 13:12",
    id_ref: "1 Korintus 13:12",
    en: "For now we see only a reflection as in a mirror; then we shall see face to face. Now I know in part; then I shall know fully, even as I am fully known.",
    id: "Karena sekarang kita melihat dalam cermin suatu gambaran yang samar-samar, tetapi nanti kita akan melihat muka dengan muka. Sekarang aku hanya mengenal dengan tidak sempurna, tetapi nanti aku akan mengenal dengan sempurna, seperti aku sendiri dikenal dengan sempurna.",
  },
};


const BIBLICAL_ANCHORS: Record<string, {
  en_title: string; id_title: string;
  en_text: string; id_text: string;
}> = {
  open: {
    en_title: "Paul — the Open leader",
    id_title: "Paulus — pemimpin yang Terbuka",
    en_text: "Paul was one of the most self-disclosing leaders in the New Testament. He named his weakness openly — a 'thorn in the flesh' he could not remove. He called himself 'the chief of sinners'. He wrote about his inner conflict with unflinching honesty. This was not self-pity. It was deliberate openness — turning vulnerability into a doorway for others. His Arena was large, not because he had nothing to hide, but because he believed that honesty disarms shame and builds trust in ways that polished leadership never can.",
    id_text: "Paulus adalah salah satu pemimpin yang paling terbuka dalam Perjanjian Baru. Ia menyebutkan kelemahannya secara terbuka — 'duri dalam daging' yang tidak bisa dihilangkan. Ia menyebut dirinya 'yang paling utama di antara orang-orang berdosa'. Ia menulis tentang konflik batinnya dengan kejujuran yang tak tergoyahkan. Ini bukan ratapan diri. Ini adalah keterbukaan yang disengaja — mengubah kelemahannya menjadi pintu bagi orang lain. Arenanya besar, bukan karena tidak ada yang disembunyikan, tetapi karena ia percaya bahwa kejujuran melucuti rasa malu dan membangun kepercayaan dengan cara yang tidak bisa dilakukan kepemimpinan yang sempurna.",
  },
  blind: {
    en_title: "David & Nathan — the gift of the mirror",
    id_title: "Daud & Natan — anugerah cermin",
    en_text: "David was a king who could not see what everyone else could. His affair with Bathsheba, the arranged death of Uriah — he had rationalised it all. It took a prophet with a story about a stolen lamb to break through. When Nathan said 'You are the man,' David did not defend himself. He did not deflect, manage the narrative, or remove Nathan from his inner circle. He said simply: 'I have sinned against the Lord.' The blind spot was exposed. The response made all the difference. The leader who cannot receive the mirror is the leader who cannot grow.",
    id_text: "Daud adalah raja yang tidak dapat melihat apa yang dapat dilihat semua orang. Perselingkuhannya dengan Batsyeba, kematian Uria yang direncanakan — ia telah merasionalisasi semuanya. Diperlukan seorang nabi dengan cerita tentang seekor domba yang dicuri untuk menembus pertahanannya. Ketika Natan berkata 'Engkaulah orang itu,' Daud tidak membela diri. Ia tidak mengalihkan, mengelola narasi, atau mengeluarkan Natan dari lingkaran dalamnya. Ia berkata dengan sederhana: 'Aku telah berdosa kepada TUHAN.' Titik butanya terungkap. Responnya membuat semua perbedaan. Pemimpin yang tidak dapat menerima cermin adalah pemimpin yang tidak dapat bertumbuh.",
  },
  hidden: {
    en_title: "Peter at the fire — restored, not exposed",
    id_title: "Petrus di perapian — dipulihkan, bukan dipermalukan",
    en_text: "Peter's denial was the most public failure of the inner circle. Three times, beside a fire, he said he did not know Jesus. He hid — not just his fear, but his love, his commitment, his identity. When Jesus restored him at the lakeside, he did not do it before the crowd. He asked three quiet questions, one for each denial. Not to expose Peter, but to heal him. The pattern matters: what is Hidden should not be forced into the open. It surfaces best in safety, in genuine relationship, when the one asking truly wants your flourishing.",
    id_text: "Penyangkalan Petrus adalah kegagalan paling publik dari lingkaran dalam. Tiga kali, di samping api, ia berkata tidak mengenal Yesus. Ia menyembunyikan — bukan hanya ketakutannya, tetapi juga kasihnya, komitmennya, identitasnya. Ketika Yesus memulihkannya di tepi danau, Ia tidak melakukannya di depan orang banyak. Ia mengajukan tiga pertanyaan yang tenang, satu untuk setiap penyangkalan. Bukan untuk mempermalukan Petrus, tetapi untuk menyembuhkannya. Polanya penting: apa yang Tersembunyi tidak boleh dipaksakan ke permukaan. Ia paling baik muncul dalam keamanan, dalam hubungan yang tulus, ketika orang yang bertanya benar-benar menginginkan kemakmuran Anda.",
  },
  unknown: {
    en_title: "Abraham leaving Ur — faith into the Unknown",
    id_title: "Abraham meninggalkan Ur — iman menuju yang Tidak Diketahui",
    en_text: "Abraham left Ur without knowing where he was going. Hebrews 11 is explicit: 'He went out, not knowing where he was going.' The Unknown was not a problem to solve before departure — it was the terrain of faith itself. Every leader has a pane of self that has not yet been tested, gifts not yet summoned, strengths not yet called upon. Cross-cultural displacement is one of God's most reliable tools for shrinking the Unknown: it strips the familiar scaffolding and shows you who you are underneath. What God calls you into will always exceed what you can map in advance.",
    id_text: "Abraham meninggalkan Ur tanpa mengetahui ke mana ia pergi. Ibrani 11 dengan jelas menyatakannya: 'Ia pergi, dan ia tidak tahu ke mana ia pergi.' Yang Tidak Diketahui bukanlah masalah yang harus diselesaikan sebelum berangkat — itu adalah medan iman itu sendiri. Setiap pemimpin memiliki aspek diri yang belum pernah diuji, karunia yang belum dipanggil, kekuatan yang belum digunakan. Perpindahan lintas budaya adalah salah satu alat Allah yang paling andal untuk menyusutkan yang Tidak Diketahui: ia melepas perancah yang familiar dan menunjukkan siapa Anda sebenarnya di dalamnya. Apa yang Allah panggil Anda ke dalamnya akan selalu melampaui apa yang dapat Anda petakan sebelumnya.",
  },
};

type Props = { userPathway: string | null; isSaved: boolean };

export default function JohariWindowClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [activePane, setActivePane] = useState<string | null>(null);
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  const [bgOpen, setBgOpen] = useState(false);
  const t = (en: string, id: string) => tFn(en, id, lang);
  const showSave = userPathway !== null;
  const translation = lang === "id" ? "TB" : "NIV";

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("johari-window");
      setSaved(true);
    });
  }

  const selected = activePane ? PANES.find(p => p.key === activePane) ?? null : null;

  return (
    <>
      <LangToggle />
      {/* ── HERO ── */}
      <section style={{ background: "oklch(22% 0.10 260)", paddingTop: "clamp(2.5rem, 4vw, 4rem)", paddingBottom: "clamp(2.5rem, 4vw, 4rem)", position: "relative", overflow: "hidden" }}>
        <img src="/images/resources/johari-window/hero.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.18, mixBlendMode: "luminosity", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, oklch(97% 0.005 80 / 0.04) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div className="container-wide" style={{ position: "relative" }}>
          <p style={{ color: "oklch(65% 0.15 45)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {t("Personal Development · Guide", "Pengembangan Pribadi · Panduan")}
          </p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 600, fontSize: "clamp(40px, 6vw, 72px)", color: "oklch(97% 0.005 80)", margin: "0 0 24px", lineHeight: 1.08 }}>
            {lang === "en" ? <>The Johari<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Window.</span></> : lang === "id" ? <>Jendela<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Johari.</span></> : <>Het Johari<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Venster.</span></>}
          </h1>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "clamp(1rem, 1.5vw, 1.1rem)", color: "oklch(72% 0.04 260)", maxWidth: "50ch", marginBottom: "2rem", lineHeight: 1.65 }}>
            {t(
              "A map of what is seen, hidden, and unknown in your leadership. Click each quadrant to explore it.",
              "Peta tentang apa yang terlihat, tersembunyi, dan tidak diketahui dalam kepemimpinan Anda. Klik setiap kuadran untuk menjelajahinya.",
              "Een kaart van wat zichtbaar, verborgen en onbekend is in jouw leiderschap. Klik op elk kwadrant om het te verkennen.",
            )}
          </p>

          {showSave && (
            saved ? (
              <Link href="/dashboard" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", color: "oklch(72% 0.14 145)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
                ✓ {t("In your dashboard", "Di dashboard Anda")}
              </Link>
            ) : (
              <button onClick={handleSave} disabled={isPending} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", color: "oklch(97% 0.005 80)", background: isPending ? "oklch(40% 0.10 260)" : "oklch(30% 0.12 260)", border: "none", padding: "0.625rem 1.25rem", cursor: isPending ? "wait" : "pointer" }}>
                {isPending ? t("Saving…", "Menyimpan…") : t("Save to Dashboard", "Simpan ke Dashboard")}
              </button>
            )
          )}
        </div>
      </section>

      {/* ── LEARNING OUTCOME ─────────────────────────────────────────────────── */}
      <div style={{ background: "oklch(22% 0.10 260)", padding: "clamp(48px, 7vw, 64px) 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: 24 }}>
            {t("After This Module", "Setelah Modul Ini")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              t("Describe the four Johari Window quadrants and explain what each reveals about your leadership.", "Menjelaskan empat kuadran Jendela Johari dan apa yang masing-masing ungkapkan tentang kepemimpinan Anda."),
              t("Recognize how Blind Spot dynamics operate differently in face-saving and high-context team cultures.", "Mengenali bagaimana dinamika Titik Buta beroperasi secara berbeda dalam budaya tim yang menjaga muka dan konteks tinggi."),
              t("Identify one concrete practice for expanding your Open area through structured trust and feedback.", "Mengidentifikasi satu praktik konkret untuk memperluas area Terbuka Anda melalui kepercayaan dan umpan balik yang terstruktur."),
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 3, height: 20, background: "oklch(65% 0.15 45)", flexShrink: 0, marginTop: 3 }} />
                <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 14, fontWeight: 500, color: "oklch(72% 0.04 260)", lineHeight: 1.65, margin: 0 }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── THE WINDOW ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">

          {/* Axis labels + grid */}
          <div style={{ marginBottom: "0.5rem" }}>
            {/* Top axis labels */}
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: 0, marginBottom: "2px" }}>
              <div style={{ width: "clamp(72px, 9vw, 110px)" }} />
              <div style={{ padding: "0 1rem 0.75rem", textAlign: "center", borderBottom: "2px solid oklch(85% 0.012 260)" }}>
                <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "1rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(48% 0.18 145)" }}>
                  {t("Known", "Diketahui")}
                </div>
                <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(50% 0.06 260)" }}>
                  {t("to yourself", "diri sendiri")}
                </div>
              </div>
              <div style={{ padding: "0 1rem 0.75rem", textAlign: "center", borderBottom: "2px solid oklch(85% 0.012 260)" }}>
                <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "1rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(62% 0.17 50)" }}>
                  {t("Unknown", "Tidak diketahui")}
                </div>
                <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(50% 0.06 260)" }}>
                  {t("to yourself", "diri sendiri")}
                </div>
              </div>
            </div>

            {/* Grid rows */}
            {[0, 1].map(row => (
              <div key={row} style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: 0, marginBottom: "2px" }}>
                {/* Left axis label */}
                <div style={{ width: "clamp(72px, 9vw, 110px)", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: "0.875rem", borderRight: "2px solid oklch(85% 0.012 260)" }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", letterSpacing: "0.08em", textTransform: "uppercase", writingMode: "vertical-rl", transform: "rotate(180deg)", whiteSpace: "nowrap", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25em" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 900, color: row === 0 ? "oklch(48% 0.18 145)" : "oklch(62% 0.17 50)" }}>
                      {row === 0 ? t("Known", "Diketahui") : t("Unknown", "Tidak diketahui")}
                    </span>
                    <span style={{ fontSize: "0.56rem", fontWeight: 600, color: "oklch(50% 0.06 260)" }}>
                      {t("to others", "orang lain")}
                    </span>
                  </span>
                </div>

                {/* Two cells in this row */}
                {PANES.filter(p => p.row === row).map(pane => {
                  const isActive = activePane === pane.key;
                  const title = lang === "id" ? pane.id_title : pane.en_title;
                  const sub = lang === "id" ? pane.id_sub : pane.en_sub;
                  return (
                    <button
                      key={pane.key}
                      onClick={() => setActivePane(isActive ? null : pane.key)}
                      style={{
                        background: isActive ? pane.colorBg : "oklch(97% 0.005 80)",
                        border: `2px solid ${isActive ? pane.colorBorder : "oklch(88% 0.008 80)"}`,
                        cursor: "pointer",
                        padding: "clamp(1.5rem, 4vw, 2.5rem)",
                        textAlign: "center",
                        minHeight: "clamp(140px, 20vw, 200px)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        transition: "all 0.15s ease",
                        position: "relative",
                      }}
                    >
                      {isActive && (
                        <div style={{ position: "absolute", top: "1rem", right: "1rem", width: "8px", height: "8px", borderRadius: "50%", background: pane.color }} />
                      )}
                      <span style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)", fontWeight: 700, color: isActive ? pane.color : "oklch(75% 0.008 80)", lineHeight: 1, display: "block", marginBottom: "0.375rem" }}>
                        {title}
                      </span>
                      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: isActive ? pane.color : "oklch(65% 0.005 260)" }}>
                        {sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {!activePane && (
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.825rem", color: "oklch(60% 0.04 260)", textAlign: "center", marginTop: "1.5rem", fontStyle: "italic" }}>
              {t("Select any quadrant to explore it.", "Pilih kuadran mana pun untuk menjelajahinya.")}
            </p>
          )}
        </div>
      </section>

      {/* ── QUADRANT DETAIL ── */}
      {selected && (
        <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: selected.colorBg, borderTop: `3px solid ${selected.color}` }}>
          <div className="container-wide">
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: selected.color, marginBottom: "0.5rem" }}>
              {lang === "id" ? selected.id_sub : selected.en_sub}
            </p>
            <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(1.5rem, 3vw, 2.25rem)", color: "oklch(22% 0.10 260)", marginBottom: "2rem" }}>
              {lang === "id" ? selected.id_title : selected.en_title}
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(2rem, 5vw, 4rem)" }}>
              <div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(38% 0.05 260)", marginBottom: "1.5rem" }}>
                  {lang === "id" ? selected.id_body : selected.en_body}
                </p>
                <div style={{ background: "oklch(22% 0.10 260 / 0.06)", padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: selected.color, marginBottom: "0.5rem" }}>
                    {t("Cross-cultural dimension", "Dimensi lintas budaya")}
                  </p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.7, color: "oklch(38% 0.05 260)", margin: 0 }}>
                    {lang === "id" ? selected.id_cross : selected.en_cross}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ background: "oklch(97% 0.005 80)", padding: "1.5rem" }}>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: selected.color, marginBottom: "0.625rem" }}>
                    {t("Reflection", "Refleksi")}
                  </p>
                  <p style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "1.1rem", fontStyle: "italic", color: "oklch(28% 0.10 260)", lineHeight: 1.65, margin: 0 }}>
                    {lang === "id" ? selected.id_question : selected.en_question}
                  </p>
                </div>
                <div style={{ background: "oklch(22% 0.10 260)", padding: "1.5rem" }}>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.625rem" }}>
                    {t("This week", "Minggu ini")}
                  </p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.75, color: "oklch(78% 0.03 80)", margin: 0 }}>
                    {lang === "id" ? selected.id_action : selected.en_action}
                  </p>
                </div>
              </div>
            </div>

            {/* Biblical Anchor */}
            <div style={{ marginTop: "2.5rem", borderTop: `2px solid ${selected.color}30`, paddingTop: "2rem" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: selected.color, marginBottom: "0.5rem" }}>
                {t("Biblical Anchor", "Jangkar Alkitab")}
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 700, color: "oklch(38% 0.05 260)", marginBottom: "1rem" }}>
                {lang === "id" ? BIBLICAL_ANCHORS[selected.key].id_title : BIBLICAL_ANCHORS[selected.key].en_title}
              </p>
              <p style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "1.075rem", fontStyle: "italic", lineHeight: 1.72, color: "oklch(32% 0.08 260)", maxWidth: "72ch", margin: 0 }}>
                {lang === "id" ? BIBLICAL_ANCHORS[selected.key].id_text : BIBLICAL_ANCHORS[selected.key].en_text}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── BIBLICAL FOUNDATION ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(22% 0.10 260)" }}>
        <div className="container-wide">
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.75rem" }}>
            {t("Biblical Foundation", "Landasan Alkitab")}
          </p>
          <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: "oklch(97% 0.005 80)", marginBottom: "1.25rem", maxWidth: "36ch" }}>
            {t("Being known — and knowing yourself", "Dikenal — dan mengenal diri sendiri")}
          </h2>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(72% 0.04 260)", maxWidth: "62ch", marginBottom: "1rem" }}>
            {t(
              "Psalm 139 is one of the most radical invitations in Scripture: 'Search me, God, and know my heart.' It is a prayer that deliberately opens the Blind Spot and the Unknown to God's sight — trusting that what He sees will not destroy you, but lead you.",
              "Mazmur 139 adalah salah satu undangan paling radikal dalam Kitab Suci: 'Selidikilah aku, ya Allah, dan kenallah hatiku.' Ini adalah doa yang dengan sengaja membuka Titik Buta dan yang Tidak Diketahui kepada pandangan Allah — mempercayai bahwa apa yang Dia lihat tidak akan menghancurkan Anda, tetapi memimpin Anda.",
              "Psalm 139 is een van de meest radicale uitnodigingen in de Schrift: 'Doorgrond mij, God, en ken mijn hart.' Het is een gebed dat bewust de Blinde Vlek en het Onbekende opent voor Gods blik — vertrouwend dat wat Hij ziet je niet zal vernietigen, maar leiden.",
            )}
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(72% 0.04 260)", maxWidth: "62ch", marginBottom: "2.5rem" }}>
            {t(
              "Paul's words in 1 Corinthians 13 name the fundamental limit of every Johari Window: we see in part. Full self-knowledge is eschatological — something awaiting us in the presence of God. That is not an excuse for complacency. It is a call to humility: the leader who thinks they see themselves clearly is often the most dangerous one in the room.",
              "Kata-kata Paulus dalam 1 Korintus 13 menyebutkan batas mendasar dari setiap Jendela Johari: kita melihat sebagian. Pengetahuan diri yang penuh bersifat eskatologis — sesuatu yang menanti kita di hadirat Allah. Itu bukan alasan untuk berpuas diri. Itu adalah panggilan untuk rendah hati: pemimpin yang berpikir mereka melihat diri mereka dengan jelas seringkali adalah yang paling berbahaya di ruangan.",
              "Paulus' woorden in 1 Korintiërs 13 benoemen de fundamentele grens van elk Johari Venster: we zien ten dele. Volledige zelfkennis is eschatologisch — iets dat ons wacht in de aanwezigheid van God. Dat is geen excuus voor zelfgenoegzaamheid. Het is een oproep tot nederigheid: de leider die denkt zichzelf duidelijk te zien is vaak de gevaarlijkste in de kamer.",
            )}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", background: "oklch(35% 0.08 260)" }}>
            {(["ps-139-23", "1cor-13-12"] as const).map(key => {
              const v = VERSES[key];
              const ref = lang === "id" ? v.id_ref : v.en_ref;
              const text = lang === "id" ? v.id : v.en;
              return (
                <div key={key} style={{ background: "oklch(28% 0.11 260)", padding: "2rem" }}>
                  <button onClick={() => setActiveVerse(key)} style={{ background: "none", border: "none", cursor: "pointer", color: "oklch(65% 0.15 45)", fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "underline dotted", padding: 0, marginBottom: "0.875rem", display: "block" }}>
                    {ref} ({translation})
                  </button>
                  <p style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "1.05rem", fontStyle: "italic", color: "oklch(85% 0.03 80)", lineHeight: 1.65, margin: 0 }}>
                    "{text}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── KEY TAKEAWAY ─────────────────────────────────────────────────────── */}
      <div style={{ background: "oklch(97% 0.005 80)", padding: "clamp(64px, 9vw, 88px) 24px", borderTop: "3px solid oklch(65% 0.15 45)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: 12 }}>
            Key Takeaway
          </p>
          <h2 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(18px, 2.2vw, 24px)", fontWeight: 800, color: "oklch(22% 0.10 260)", marginBottom: 36 }}>
            Three things to act on this week
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              "Ask one trusted colleague this week for one piece of honest feedback about your leadership — something in your Blind Spot they have noticed but never said directly.",
              "Identify one thing in your Hidden quadrant that you could choose to share with your team to increase trust and connection. Name it, then decide whether you are ready to disclose it.",
              "Reflect on your Unknown quadrant: what might God be forming in you right now that has not yet become visible — to you or to others? Sit with that question rather than answering it quickly.",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "20px 24px", background: "oklch(95% 0.008 80)" }}>
                <div style={{ width: 3, alignSelf: "stretch", background: "oklch(65% 0.15 45)", flexShrink: 0 }} />
                <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 14, fontWeight: 500, color: "oklch(38% 0.05 260)", lineHeight: 1.75, margin: 0 }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── LONG-FORM SEO SECTION ─────────────────────────────────────────────── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(95% 0.008 80)" }}>
        <div className="container-wide" style={{ maxWidth: 720 }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>
            Background
          </p>
          <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(1.25rem, 2.5vw, 1.7rem)", color: "oklch(22% 0.10 260)", marginBottom: "1.5rem", lineHeight: 1.2 }}>
            The Johari Window: Self-Awareness, Blind Spots, and What Faith Adds
          </h2>
          <button
            onClick={() => setBgOpen(!bgOpen)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              marginTop: 20, marginBottom: 24, padding: "10px 20px",
              background: "transparent", border: "1.5px solid oklch(65% 0.15 45)",
              color: "oklch(65% 0.15 45)", borderRadius: 12,
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 13, fontWeight: 700,
              cursor: "pointer", letterSpacing: "0.04em",
            }}
          >
            {bgOpen ? "Close ↑" : "Read the research →"}
          </button>
          {bgOpen && [
            "Joseph Luft and Harry Ingham were psychologists at UCLA when they first presented their model at a group dynamics conference in 1955.¹ The name — Johari — is simply a combination of their first names, Joe and Harry. The framework they produced is, by the standards of its longevity and application, remarkably simple: two axes, four quadrants, one central insight. What you know about yourself and what others know about you do not always match. That gap is where much of the invisible friction in leadership lives.",
            "The Open quadrant contains what is known to both you and the people around you. This is the foundation of functional working relationships — shared context, clear communication, predictable behaviour. The larger the Open quadrant, the less energy a team spends trying to interpret each other. The Hidden quadrant contains what you know about yourself that others do not: your uncertainties, your private concerns, the parts of your inner world you have not chosen to share. The Blind Spot is what others observe about you that you do not see in yourself: patterns in your communication, emotional reactions, the way your presence changes a room. The Unknown quadrant is what neither you nor the people around you currently know — the deeper material that has not yet surfaced.",
            "For leaders, the most practically significant quadrant is the Blind Spot. This is not because blind spots are shameful — every leader has them, by definition. It is because your team is already navigating around your blind spots whether you know about them or not. They are adjusting their communication, withholding information, working around patterns that have never been named. The leader's blind spot is, in practice, a tax on the team. The work of shrinking it is not a personal improvement project. It is a service to the people you lead.",
            "The mechanism for shrinking the Blind Spot is feedback,³ and this is where the cross-cultural complexity enters. The Johari Window assumes that feedback can move between people, that self-disclosure is possible, that the Open quadrant can grow. All of this is true — but how it works varies significantly across cultures, and a model developed in mid-twentieth century California was not designed with that variation in mind.",
            "In high-context cultures across East Asia, Southeast Asia, the Middle East, and parts of Africa, the social cost of direct feedback — especially upward, and especially in any setting with witnesses — is high.⁴ Telling your leader that they have a communication problem is not just uncomfortable. It risks the relationship, and in some cultural frameworks it violates a fundamental norm about how status and deference operate. This means that in a multicultural team, the leader's Blind Spot may be both larger and more consistently reinforced than in a cultural context where honest upward feedback is more normal.",
            "This does not make the Johari Window less useful cross-culturally. It makes it more useful — because it provides a shared vocabulary for what is actually happening. A leader who can name the Johari Window framework with their team is creating permission to talk about feedback and self-disclosure as normal team practices, not as confrontational acts. Naming the framework normalises the existence of the gap before asking anyone to fill it.",
            "What counts as appropriate content for the Hidden quadrant also varies across cultures. In many Western professional contexts, there is a working assumption that leaders share a fair amount of themselves: their reasoning, their uncertainty, sometimes their personal struggles. Vulnerability, in that context, is read as authenticity and can build trust. In other contexts — particularly where professional and personal domains are kept more explicitly separate — the same level of personal disclosure can signal instability rather than authenticity.",
            "The Unknown quadrant raises a different set of questions — and this is where the Christian tradition has something genuinely distinctive to contribute. If the Unknown contains what is known to neither you nor the people around you, then from a Christian perspective it is not unknown to God. Psalm 139:23-24 is one of the most direct scriptural addresses into this space: 'Search me, God, and know my heart; test me and know my anxious thoughts. See if there is any offensive way in me, and lead me in the way everlasting.' This is not a request for general spiritual health. It is a specific invitation for God to reveal what the psalmist cannot see in themselves — the Unknown quadrant understood as the domain of divine knowledge and ongoing formation.",
            "The practical implication for Christian leaders is that self-awareness development is not solely a human process. It includes the disciplines of prayer, scripture, honest community, and spiritual direction. Expanding the Open quadrant, in Christian terms, is not a self-improvement strategy. It is participation in the kind of community that God uses to form people. The leader who builds that kind of team — where it is safe to give feedback, where self-disclosure is gradual and genuine, where the Unknown is held with humility — is building something that serves both organisational health and human flourishing.",
            "Practically: start with your Blind Spot. Identify one person in your team or close circle who you trust to tell you something you might not want to hear. Ask them a specific question — not 'what do you think of my leadership?' but 'is there one thing I do that makes it harder for you to do your best work?' That specificity lowers the social cost of honest response. Then, when the answer comes, receive it without explaining yourself. The goal is to open the quadrant, not to defend its current size.",
          ].map((para, i) => (
            <p key={i} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.8, color: "oklch(38% 0.05 260)", marginBottom: "1.1rem" }}>
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* ── SOURCES ── */}
      <SourcesDropdown sources={[
        "Joseph Luft & Harry Ingham — \"Of Human Interaction\" (National Press Books, 1969) — the published formalization of the Johari Window, building on their 1955 UCLA conference presentation",
        "Sidney M. Jourard — \"The Transparent Self\" (Van Nostrand Reinhold, 2nd ed., 1971) — foundational research on self-disclosure, authenticity, and the psychological cost of concealment",
        "Amy C. Edmondson — \"Psychological Safety and Learning Behavior in Work Teams\" (Administrative Science Quarterly, 44(2), 1999) — landmark study on team safety as the structural precondition for honest feedback",
        "Geert Hofstede — \"Cultures and Organizations: Software of the Mind\" (McGraw-Hill, 3rd ed., 2010) — power distance research documenting cross-cultural variation in upward feedback norms and deference patterns",
      ]} lang={lang} />

      {/* ── CTA ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>
              {t("More Training", "Pelatihan Lainnya")}
            </p>
            <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", color: "oklch(22% 0.10 260)", marginBottom: "1rem" }}>
              {t("Part of the full training library.", "Bagian dari perpustakaan pelatihan lengkap.")}
            </h2>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {!userPathway ? (
                <Link href="/membership" className="btn-primary">{t("Join the Community →", "Bergabung →")}</Link>
              ) : saved ? (
                <Link href="/dashboard" className="btn-primary">{t("Go to Dashboard →", "Ke Dashboard →")}</Link>
              ) : (
                <button onClick={handleSave} disabled={isPending} className="btn-primary" style={{ border: "none", cursor: isPending ? "wait" : "pointer" }}>
                  {isPending ? t("Saving…", "Menyimpan…") : t("Save to Dashboard", "Simpan ke Dashboard")}
                </button>
              )}
              <Link href="/resources" className="btn-outline-navy">{t("Browse the Library", "Jelajahi Perpustakaan")}</Link>
            </div>
          </div>
          <div style={{ background: "oklch(22% 0.10 260)", padding: "2.5rem" }}>
            <p style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "1.25rem", fontStyle: "italic", color: "oklch(80% 0.04 260)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
              {t(
                "\"The most growth-resistant leaders are not the ones with the most blind spots — they are the ones who never ask.\"",
                "\"Pemimpin yang paling resisten terhadap pertumbuhan bukan yang memiliki titik buta terbanyak — mereka yang tidak pernah bertanya.\"",
                "\"De meest groeiresistente leiders zijn niet degenen met de meeste blinde vlekken — het zijn degenen die nooit vragen.\"",
              )}
            </p>
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", color: "oklch(65% 0.15 45)", textTransform: "uppercase" }}>Crispy Development</span>
          </div>
        </div>
      </section>

      {/* ── VERSE POPUP ── */}
      {activeVerse && (
        <div onClick={() => setActiveVerse(null)} style={{ position: "fixed", inset: 0, background: "oklch(10% 0.05 260 / 0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1.5rem" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "oklch(97% 0.005 80)", borderRadius: "12px", padding: "2.5rem clamp(1.5rem, 4vw, 2.5rem)", maxWidth: "520px", width: "100%" }}>
            <p style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "1.25rem", fontStyle: "italic", color: "oklch(22% 0.10 260)", lineHeight: 1.65, marginBottom: "1rem" }}>
              "{lang === "id" ? VERSES[activeVerse as keyof typeof VERSES].id : VERSES[activeVerse as keyof typeof VERSES].en}"
            </p>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, color: "oklch(65% 0.15 45)", letterSpacing: "0.08em", marginBottom: "1.5rem" }}>
              — {lang === "id" ? VERSES[activeVerse as keyof typeof VERSES].id_ref : VERSES[activeVerse as keyof typeof VERSES].en_ref} ({translation})
            </p>
            <button onClick={() => setActiveVerse(null)} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, background: "oklch(22% 0.10 260)", color: "oklch(97% 0.005 80)", border: "none", padding: "0.625rem 1.5rem", cursor: "pointer", borderRadius: "4px" }}>
              {t("Close", "Tutup")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
