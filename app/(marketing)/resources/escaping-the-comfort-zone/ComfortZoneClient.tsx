"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Image from "next/image";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id";
const t = (en: string, id: string, lang: Lang) => lang === "en" ? en : id;

// -- BRAND TOKENS ---------------------------------------------------------------
const NAVY       = "oklch(22% 0.10 260)";
const ORANGE     = "oklch(65% 0.15 45)";
const OFF_WHITE  = "oklch(96% 0.005 80)";
const LIGHT_GRAY = "oklch(88% 0.008 80)";
const BODY_TEXT  = "oklch(38% 0.05 260)";

// -- SHARED STYLES --------------------------------------------------------------
const containerStyle = { maxWidth: "860px", margin: "0 auto" };
const eyebrowStyle = {
  fontFamily: "Montserrat, sans-serif",
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: ORANGE,
  marginBottom: "0.75rem",
};
const h2Style = (light?: boolean) => ({
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: "clamp(28px, 4vw, 48px)",
  fontWeight: 600,
  lineHeight: 1.15,
  color: light ? OFF_WHITE : NAVY,
  marginBottom: "1.5rem",
  marginTop: 0,
});
const bodyStyle = (light?: boolean) => ({
  fontFamily: "Montserrat, sans-serif",
  fontSize: "1rem",
  lineHeight: 1.8,
  color: light ? "oklch(85% 0.01 80)" : BODY_TEXT,
  marginBottom: "1.25rem",
});

// -- ZONE DATA ------------------------------------------------------------------
const ZONES = [
  {
    key: "comfort",
    num: "01",
    color: "oklch(42% 0.14 260)",
    colorBg: "oklch(42% 0.14 260 / 0.08)",
    colorBorder: "oklch(42% 0.14 260 / 0.25)",
    titleEn: "Comfort Zone",
    titleId: "Zona Nyaman",
    tagEn: "Feeling safe and in control",
    tagId: "Merasa aman dan terkendali",
    descEn: "The comfort zone is not just laziness. For many cross-cultural leaders, it builds slowly and looks responsible. You stay in the routines you know. You keep to the colleagues you trust. You avoid the conversations that require more language than you have or more risk than feels justified. None of that looks like fear -- it looks like wisdom. But over time, the zone contracts. The things you do well become the only things you do. And the capacity for newness quietly atrophies.",
    descId: "Zona nyaman bukan sekadar kemalasan. Bagi banyak pemimpin lintas budaya, zona ini terbentuk perlahan dan terlihat bertanggung jawab. Kamu tetap pada rutinitas yang kamu kenal. Kamu bergaul dengan rekan kerja yang kamu percaya. Kamu menghindari percakapan yang membutuhkan lebih banyak bahasa dari yang kamu miliki atau lebih banyak risiko dari yang terasa wajar. Tidak ada yang terlihat seperti ketakutan dari itu semua -- terlihat seperti kebijaksanaan. Tetapi seiring waktu, zona itu menyempit. Hal-hal yang kamu kuasai menjadi satu-satunya hal yang kamu lakukan. Dan kapasitas untuk sesuatu yang baru perlahan mengerdil.",
    listEn: ["Operating from routine", "Declining unfamiliar invitations", "Comfortable with predictability, uncomfortable with possibility"],
    listId: ["Beroperasi dari rutinitas", "Menolak undangan yang tidak dikenal", "Nyaman dengan hal yang dapat diprediksi, tidak nyaman dengan kemungkinan baru"],
  },
  {
    key: "fear",
    num: "02",
    color: "oklch(50% 0.14 25)",
    colorBg: "oklch(50% 0.14 25 / 0.08)",
    colorBorder: "oklch(50% 0.14 25 / 0.25)",
    titleEn: "Fear Zone",
    titleId: "Zona Ketakutan",
    tagEn: "Facing challenges outside your usual experience",
    tagId: "Menghadapi tantangan di luar pengalaman biasa",
    descEn: "The fear zone has a specific feeling: the exposure of not knowing. In a cross-cultural context it comes with extra weight. You may be operating in a second language. The social rules may be unfamiliar. What counts as a mistake here -- and how a mistake is seen by others -- may be different from anything you were trained for. Most leaders do not linger in the fear zone deliberately. But passing through it is unavoidable if anything new is going to be learned. The discomfort here is not a sign you have made a wrong turn. It is the cost of entry into what comes next.",
    descId: "Zona ketakutan memiliki perasaan yang khas: terekspos karena tidak tahu. Dalam konteks lintas budaya, ini datang dengan beban ekstra. Kamu mungkin beroperasi dalam bahasa kedua. Aturan sosial mungkin tidak familiar. Apa yang dianggap kesalahan di sini -- dan bagaimana kesalahan itu dilihat orang lain -- mungkin berbeda dari apa pun yang pernah kamu pelajari. Kebanyakan pemimpin tidak tinggal di zona ketakutan dengan sengaja. Tetapi melewatinya tidak bisa dihindari jika ada sesuatu yang baru yang akan dipelajari. Ketidaknyamanan di sini bukan tanda bahwa kamu telah mengambil jalan yang salah. Ini adalah biaya masuk menuju apa yang ada di depan.",
    listEn: ["Heightened awareness of what others think", "Uncertainty about the social rules", "Temptation to retreat to what is known"],
    listId: ["Sangat peka terhadap pendapat orang lain", "Tidak yakin tentang aturan sosial", "Tergoda untuk kembali ke yang sudah dikenal"],
  },
  {
    key: "learning",
    num: "03",
    color: "oklch(48% 0.14 145)",
    colorBg: "oklch(48% 0.14 145 / 0.08)",
    colorBorder: "oklch(48% 0.14 145 / 0.25)",
    titleEn: "Learning Zone",
    titleId: "Zona Pembelajaran",
    tagEn: "Growing through discomfort",
    tagId: "Bertumbuh melalui ketidaknyamanan",
    descEn: "The learning zone is the place where capacity actually increases. It is not comfortable -- but it is not the acute anxiety of the fear zone either. It is the sustained discomfort of someone building something new in themselves. In a cross-cultural context this zone often involves specific skills: navigating a different decision-making style, rebuilding trust after a cultural misstep, learning to lead through someone else's cultural framework rather than your own. The feeling of being inadequate here is temporary. The capacity being built is not.",
    descId: "Zona pembelajaran adalah tempat di mana kapasitas sebenarnya meningkat. Ini tidak nyaman -- tetapi bukan kecemasan akut dari zona ketakutan juga. Ini adalah ketidaknyamanan berkelanjutan dari seseorang yang membangun sesuatu yang baru dalam diri mereka. Dalam konteks lintas budaya, zona ini sering melibatkan keterampilan spesifik: menavigasi gaya pengambilan keputusan yang berbeda, membangun kembali kepercayaan setelah kesalahan budaya, belajar memimpin melalui kerangka budaya orang lain daripada milikmu sendiri. Perasaan tidak mampu di sini bersifat sementara. Kapasitas yang sedang dibangun tidak.",
    listEn: ["Trying approaches that feel unnatural", "Receiving feedback that challenges your assumptions", "Noticing yourself adapting rather than avoiding"],
    listId: ["Mencoba pendekatan yang terasa tidak alami", "Menerima umpan balik yang mengubah cara pandangmu", "Memperhatikan dirimu beradaptasi, bukan menghindari"],
  },
  {
    key: "growth",
    num: "04",
    color: "oklch(52% 0.14 45)",
    colorBg: "oklch(52% 0.14 45 / 0.08)",
    colorBorder: "oklch(52% 0.14 45 / 0.25)",
    titleEn: "Growth Zone",
    titleId: "Zona Pertumbuhan",
    tagEn: "Living with purpose and clear vision",
    tagId: "Hidup dengan tujuan dan visi yang jelas",
    descEn: "The growth zone is not the absence of difficulty. It is the place where the difficulty has stopped defining you. Leaders who reach this zone often describe it as a shift in what feels normal -- things that used to require courage now feel like ordinary competence. The comfort zone has expanded. What was once foreign has become familiar. In a cross-cultural setting this is not a permanent destination. New contexts, new seasons, new roles will bring you back through the other zones. But once you have done the work in a zone, you know the terrain. You know you have crossed it before. That knowledge changes how you approach the next threshold.",
    descId: "Zona pertumbuhan bukan ketiadaan kesulitan. Ini adalah tempat di mana kesulitan telah berhenti mendefinisikanmu. Para pemimpin yang mencapai zona ini sering menggambarkannya sebagai pergeseran dalam apa yang terasa normal -- hal-hal yang dulu membutuhkan keberanian kini terasa seperti kompetensi biasa. Zona nyaman telah berkembang. Yang dulu asing kini terasa familiar. Dalam konteks lintas budaya, ini bukan tujuan permanen. Konteks baru, musim baru, peran baru akan membawamu kembali melalui zona lain. Tetapi setelah kamu melakukan pekerjaan di suatu zona, kamu tahu medannya. Kamu tahu kamu pernah melewatinya sebelumnya. Pengetahuan itu mengubah cara kamu mendekati ambang berikutnya.",
    listEn: ["Operating with flexibility across cultural contexts", "Taking on challenges that were previously avoided", "Coaching others through zones you have already passed through"],
    listId: ["Beroperasi dengan fleksibilitas di berbagai konteks budaya", "Mengambil tantangan yang sebelumnya dihindari", "Melatih orang lain melewati zona yang sudah kamu lewati"],
  },
];

// -- ZONE LOCATOR STATEMENTS ----------------------------------------------------
const LOCATOR_STATEMENTS = [
  // Comfort Zone (0-5)
  { en: "I tend to stick to the same leadership approaches that have worked before.", id: "Saya cenderung menggunakan pendekatan kepemimpinan yang sama yang sudah terbukti berhasil.", zone: "comfort" },
  { en: "I keep to a circle of colleagues I know well and trust.", id: "Saya bergaul dengan lingkaran rekan kerja yang sudah saya kenal dan percaya.", zone: "comfort" },
  { en: "I find reasons to postpone conversations that might create conflict.", id: "Saya menemukan alasan untuk menunda percakapan yang mungkin menimbulkan konflik.", zone: "comfort" },
  { en: "My daily routine rarely changes.", id: "Rutinitas harian saya jarang berubah.", zone: "comfort" },
  { en: "I avoid situations where I might not know the cultural or social rules.", id: "Saya menghindari situasi di mana saya mungkin tidak tahu aturan budaya atau sosial.", zone: "comfort" },
  { en: "I know what I'm good at and mostly stay in those lanes.", id: "Saya tahu apa yang saya kuasai dan kebanyakan tetap di jalur itu.", zone: "comfort" },
  // Fear Zone (6-11)
  { en: "I'm aware of something I should do but keep finding reasons not to.", id: "Saya sadar ada sesuatu yang harus saya lakukan tetapi terus menemukan alasan untuk tidak melakukannya.", zone: "fear" },
  { en: "I'm worried about how others will judge me if I try and fail.", id: "Saya khawatir bagaimana orang lain akan menilai saya jika saya mencoba dan gagal.", zone: "fear" },
  { en: "I feel exposed when I have to operate in a language or culture that isn't my own.", id: "Saya merasa tidak aman ketika harus beroperasi dalam bahasa atau budaya yang bukan milik saya.", zone: "fear" },
  { en: "I've been avoiding a conversation, initiative, or relationship that feels risky.", id: "Saya telah menghindari percakapan, inisiatif, atau hubungan yang terasa berisiko.", zone: "fear" },
  { en: "I make excuses about why now isn't the right time to try something new.", id: "Saya membuat alasan mengapa sekarang bukan waktu yang tepat untuk mencoba sesuatu yang baru.", zone: "fear" },
  { en: "When I imagine doing the thing I've been avoiding, my first feeling is dread.", id: "Ketika saya membayangkan melakukan hal yang selama ini saya hindari, perasaan pertama saya adalah takut.", zone: "fear" },
  // Learning Zone (12-17)
  { en: "I'm currently doing something that stretches me in ways that feel uncomfortable but productive.", id: "Saya sedang melakukan sesuatu yang menantang saya dengan cara yang terasa tidak nyaman tetapi produktif.", zone: "learning" },
  { en: "I've recently tried a new approach and it hasn't fully worked yet.", id: "Saya baru-baru ini mencoba pendekatan baru dan belum sepenuhnya berhasil.", zone: "learning" },
  { en: "I'm learning to navigate a cultural context or leadership situation I don't fully understand.", id: "Saya sedang belajar menavigasi konteks budaya atau situasi kepemimpinan yang belum sepenuhnya saya pahami.", zone: "learning" },
  { en: "I'm receiving feedback that challenges how I normally do things.", id: "Saya menerima umpan balik yang menantang cara saya biasanya melakukan sesuatu.", zone: "learning" },
  { en: "I'm in a situation where I feel inadequate, but I can see I'm growing.", id: "Saya berada dalam situasi di mana saya merasa kurang mampu, tetapi saya bisa melihat bahwa saya sedang berkembang.", zone: "learning" },
  { en: "I'm building a skill or relationship that requires sustained effort across cultural lines.", id: "Saya sedang membangun keterampilan atau hubungan yang membutuhkan upaya berkelanjutan lintas budaya.", zone: "learning" },
  // Growth Zone (18-23)
  { en: "Things that used to feel risky now feel like ordinary competence.", id: "Hal-hal yang dulu terasa berisiko kini terasa seperti kompetensi biasa.", zone: "growth" },
  { en: "I regularly take on challenges that I would previously have avoided.", id: "Saya secara rutin mengambil tantangan yang sebelumnya akan saya hindari.", zone: "growth" },
  { en: "I can navigate cultural differences that used to confuse or frustrate me.", id: "Saya dapat menavigasi perbedaan budaya yang dulu membuat saya bingung atau frustrasi.", zone: "growth" },
  { en: "I find myself helping others through zones I've already passed through.", id: "Saya mendapati diri saya membantu orang lain melewati zona yang sudah saya lewati.", zone: "growth" },
  { en: "My comfort zone has genuinely expanded -- what was once foreign now feels familiar.", id: "Zona nyaman saya benar-benar telah berkembang, apa yang dulu asing kini terasa familiar.", zone: "growth" },
  { en: "I feel settled in my identity even when operating across significant cultural differences.", id: "Saya merasa mantap dalam identitas saya bahkan ketika beroperasi di tengah perbedaan budaya yang signifikan.", zone: "growth" },
];

// -- REFLECTION QUESTIONS -------------------------------------------------------
const QUESTIONS = [
  {
    num: "01",
    en: "What is one thing in your current leadership context that you keep finding reasons not to do -- a conversation you have been avoiding, an initiative you have not started, a relationship you have not invested in? What makes it feel unsafe to try?",
    id: "Apa satu hal dalam konteks kepemimpinan kamu saat ini yang terus kamu temukan alasan untuk tidak melakukannya -- percakapan yang telah kamu hindari, inisiatif yang belum kamu mulai, hubungan yang belum kamu investasikan? Apa yang membuatnya terasa tidak aman untuk dicoba?",
  },
  {
    num: "02a",
    en: "What specific fear is most active here? Is it a fear of failure, of how others will see you, of losing something you currently have, or something else?",
    id: "Ketakutan spesifik apa yang paling aktif di sini? Apakah itu ketakutan akan kegagalan, tentang bagaimana orang lain akan melihat kamu, kehilangan sesuatu yang saat ini kamu miliki, atau sesuatu yang lain?",
  },
  {
    num: "02b",
    en: "What is the worst realistic outcome if you tried this and it did not go well? How likely is that, really? And what would happen if you survived that outcome -- what would you know then that you do not know now?",
    id: "Apa hasil terburuk yang realistis jika kamu mencoba ini dan tidak berjalan dengan baik? Seberapa mungkin itu, sebenarnya? Dan apa yang akan terjadi jika kamu bertahan dari hasil itu -- apa yang akan kamu ketahui saat itu yang tidak kamu ketahui sekarang?",
  },
  {
    num: "03",
    en: "What are you missing out on by staying where you are? Consider not just experiences and skills, but also: the team members who are not being led into their growth because you are not modelling it. The relationships across cultural lines that are not forming. The impact that is not happening.",
    id: "Apa yang kamu lewatkan dengan tetap di tempat kamu sekarang? Pertimbangkan bukan hanya pengalaman dan keterampilan, tetapi juga: anggota tim yang tidak dipimpin menuju pertumbuhan mereka karena kamu tidak memodelkannya. Hubungan lintas budaya yang tidak terbentuk. Dampak yang tidak terjadi.",
  },
  {
    num: "04",
    en: "If you moved through the fear zone and spent real time in the learning zone over the next six months -- what would be different? Not just for you personally, but for the people you lead and serve. What capacity would you have that you currently lack? What would become possible for your team, your community, or your organisation?",
    id: "Jika kamu melewati zona ketakutan dan menghabiskan waktu nyata di zona pembelajaran selama enam bulan ke depan -- apa yang akan berbeda? Bukan hanya untuk kamu secara pribadi, tetapi untuk orang-orang yang kamu pimpin dan layani. Kapasitas apa yang akan kamu miliki yang saat ini tidak kamu miliki? Apa yang akan menjadi mungkin untuk tim kamu, komunitas kamu, atau organisasi kamu?",
  },
  {
    num: "05",
    en: "What is the smallest step you could take this week that would move you from the comfort zone into the learning zone? Not the full thing -- just the first step. What would that be? Who could you tell about it before this week is over?",
    id: "Apa langkah terkecil yang bisa kamu ambil minggu ini yang akan memindahkan kamu dari zona nyaman ke zona pembelajaran? Bukan keseluruhan hal -- hanya langkah pertama. Apa itu? Kepada siapa kamu bisa menceritakannya sebelum minggu ini berakhir?",
  },
  {
    num: "06",
    en: "Is there a specific prayer, Scripture, or conviction that belongs to this area of growth -- something God has already spoken to you about this, or a verse that has stayed with you? What would it mean to take that more seriously than the resistance you feel?",
    id: "Apakah ada doa, Kitab Suci, atau keyakinan tertentu yang berkaitan dengan area pertumbuhan ini -- sesuatu yang sudah Tuhan bicarakan kepadamu tentang ini, atau ayat yang tetap bersamamu? Apa artinya mengambil itu lebih serius daripada perlawanan yang kamu rasakan?",
    optional: true,
  },
];

// -- KEY TAKEAWAYS --------------------------------------------------------------
const TAKEAWAYS = [
  {
    en: "The comfort zone forms slowly and often looks like wisdom. Knowing your zone accurately is the first act of leadership.",
    id: "Zona nyaman terbentuk perlahan dan sering terlihat seperti kebijaksanaan. Mengetahui zona kamu secara akurat adalah tindakan kepemimpinan pertama.",
  },
  {
    en: "The Fear Zone is not the enemy of growth -- it is the doorway. The signal of discomfort means you are at the threshold, not that you have gone too far.",
    id: "Zona Ketakutan bukan musuh pertumbuhan, melainkan pintunya. Sinyal ketidaknyamanan berarti kamu berada di ambang, bukan bahwa kamu telah pergi terlalu jauh.",
  },
  {
    en: "For cross-cultural leaders, comfort zone disruption is layered: behavioral, relational, and identity-level simultaneously. 'Who am I here?' is the deeper question.",
    id: "Bagi pemimpin lintas budaya, gangguan zona nyaman berlapis: perilaku, relasional, dan identitas secara bersamaan. 'Siapa saya di sini?' adalah pertanyaan yang lebih dalam.",
  },
  {
    en: "Growth does not require that you never feel afraid. It requires that you act from trust rather than from the absence of fear.",
    id: "Pertumbuhan tidak mengharuskan kamu tidak pernah merasa takut. Ini mengharuskan kamu bertindak dari kepercayaan, bukan dari ketiadaan rasa takut.",
  },
];

// -- MAIN COMPONENT -------------------------------------------------------------
export default function ComfortZoneClient({
  userPathway,
  isSaved: isSavedProp,
}: {
  userPathway: string | null;
  isSaved: boolean;
}) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" ? "id" : "en") as Lang;
  const [saved, setSaved] = useState(isSavedProp);
  const [isPending, startTransition] = useTransition();
  const showAddToDashboard = userPathway !== null;

  // Zone locator state
  const [locatorAnswers, setLocatorAnswers] = useState<Record<number, boolean>>({});

  // Reflection question accordion state
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  function handleSave() {
    startTransition(async () => {
      const result = await saveResourceToDashboard("escaping-the-comfort-zone");
      if (!result.error) setSaved(true);
    });
  }

  function handleLocator(index: number, value: boolean) {
    setLocatorAnswers(prev => ({ ...prev, [index]: value }));
  }

  // Compute zone locator result
  const answered = Object.keys(locatorAnswers).length;
  const locatorResult = (() => {
    if (answered < 12) return null;
    const comfort = [0,1,2,3,4,5].filter(i => locatorAnswers[i]).length;
    const fear = [6,7,8,9,10,11].filter(i => locatorAnswers[i]).length;
    const learning = [12,13,14,15,16,17].filter(i => locatorAnswers[i]).length;
    const growth = [18,19,20,21,22,23].filter(i => locatorAnswers[i]).length;
    const max = Math.max(comfort, fear, learning, growth);
    if (max === comfort) return "comfort";
    if (max === fear) return "fear";
    if (max === learning) return "learning";
    return "growth";
  })();

  const zoneResultText = {
    comfort: {
      en: "Based on your responses, you appear to be spending most of your time in the Comfort Zone right now. The routines you rely on may be working -- but it may also be time to ask what is being kept safe at the cost of what is possible.",
      id: "Berdasarkan jawabanmu, kamu tampaknya menghabiskan sebagian besar waktumu di Zona Nyaman saat ini. Rutinitas yang kamu andalkan mungkin berhasil -- tetapi mungkin sudah waktunya untuk bertanya apa yang dijaga aman dengan mengorbankan apa yang mungkin terjadi.",
    },
    fear: {
      en: "Based on your responses, you appear to be spending most of your time in the Fear Zone right now. You are aware of something you need to do and are holding back. That awareness is important. The threshold you are standing at is real -- and so is what is on the other side.",
      id: "Berdasarkan jawabanmu, kamu tampaknya menghabiskan sebagian besar waktumu di Zona Ketakutan saat ini. Kamu sadar ada sesuatu yang perlu kamu lakukan dan kamu menahan diri. Kesadaran itu penting. Ambang yang kamu berdiri di atasnya itu nyata -- dan begitu juga apa yang ada di sisi lain.",
    },
    learning: {
      en: "Based on your responses, you appear to be spending most of your time in the Learning Zone right now. You are in the middle of growth that has not finished yet. The discomfort you feel is not a sign of failure. It is a sign you are in exactly the right place.",
      id: "Berdasarkan jawabanmu, kamu tampaknya menghabiskan sebagian besar waktumu di Zona Pembelajaran saat ini. Kamu sedang berada di tengah pertumbuhan yang belum selesai. Ketidaknyamanan yang kamu rasakan bukan tanda kegagalan. Ini adalah tanda bahwa kamu berada tepat di tempat yang benar.",
    },
    growth: {
      en: "Based on your responses, you appear to be spending most of your time in the Growth Zone right now. What once required courage now feels like ordinary competence. The question worth sitting with: what is the next threshold? Where is the next edge?",
      id: "Berdasarkan jawabanmu, kamu tampaknya menghabiskan sebagian besar waktumu di Zona Pertumbuhan saat ini. Apa yang dulu membutuhkan keberanian kini terasa seperti kompetensi biasa. Pertanyaan yang layak direnungkan: apa ambang berikutnya? Di mana tepi berikutnya?",
    },
  };

  const sectionPadding = { padding: "clamp(4rem, 7vw, 7rem) 1.5rem" };

  return (
    <>
      <LangToggle />

      {/* ── HERO ── */}
      <section style={{ position: "relative", background: NAVY, overflow: "hidden", padding: "7rem 1.5rem 6rem" }}>
        <img
          src="/images/resources/escaping-the-comfort-zone/hero-threshold.jpg"
          alt=""
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.22, mixBlendMode: "luminosity" }}
        />
        <div style={{ ...containerStyle, position: "relative", zIndex: 1 }}>
          <p style={eyebrowStyle}>
            {t("Personal Development · Worksheet", "Pengembangan Pribadi · Lembar Kerja", lang)}
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, lineHeight: 1.08, color: OFF_WHITE, marginBottom: "1.5rem", marginTop: 0, maxWidth: "16ch" }}>
            {lang === "en"
              ? <>{`Escaping the`}<br /><span style={{ color: ORANGE }}>Comfort Zone.</span></>
              : <>{`Keluar dari`}<br /><span style={{ color: ORANGE }}>Zona Nyaman.</span></>}
          </h1>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "clamp(17px, 2.2vw, 22px)", color: "oklch(82% 0.03 260)", lineHeight: 1.6, maxWidth: 580, marginBottom: "1.5rem", marginTop: 0 }}>
            {t(
              "Use this worksheet to name your zone, face your fear, and find your path forward.",
              "Gunakan lembar kerja ini untuk menamai zonamu, menghadapi ketakutanmu, dan menemukan jalan ke depan.",
              lang
            )}
          </p>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.65, color: "oklch(78% 0.04 260)", maxWidth: 580, margin: "0 0 40px" }}>
            {t(
              "Most leaders know what they should do next. They also know exactly why it feels easier not to. This module maps the space between where you are and where growth is waiting -- and helps you take the first step across.",
              "Kebanyakan pemimpin tahu apa yang harus mereka lakukan selanjutnya. Mereka juga tahu persis mengapa rasanya lebih mudah untuk tidak melakukannya. Modul ini memetakan ruang antara di mana kamu berada dan di mana pertumbuhan menunggu -- dan membantu kamu mengambil langkah pertama.",
              lang
            )}
          </p>

          {showAddToDashboard && (
            saved ? (
              <Link href="/dashboard" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.06em", color: "oklch(72% 0.14 145)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M3 2h10a1 1 0 011 1v11l-6-3-6 3V3a1 1 0 011-1z"/></svg>
                {t("In your dashboard", "Di dashboard kamu", lang)}
              </Link>
            ) : (
              <button
                onClick={handleSave}
                disabled={isPending}
                aria-label={t("Save to dashboard", "Simpan ke dasbor", lang)}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, minHeight: 44, padding: "10px 20px", background: "transparent", border: `1.5px solid oklch(55% 0.04 260)`, borderRadius: 8, fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 600, color: "oklch(70% 0.04 260)", cursor: isPending ? "wait" : "pointer" }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M3 2h10a1 1 0 011 1v11l-6-3-6 3V3a1 1 0 011-1z"/>
                </svg>
                {isPending ? t("Saving...", "Menyimpan...", lang) : t("Save to Dashboard", "Simpan ke Dashboard", lang)}
              </button>
            )
          )}
        </div>
      </section>

      {/* ── INTRO / FOUR ZONES NAV ── */}
      <section style={{ background: OFF_WHITE, ...sectionPadding }}>
        <div style={containerStyle}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(2rem, 5vw, 5rem)", alignItems: "start" }}>
            <div>
              <p style={eyebrowStyle}>{t("ABOUT THIS EXERCISE", "TENTANG LATIHAN INI", lang)}</p>
              <h2 style={h2Style()}>
                {lang === "en"
                  ? <>Four zones.<br />One honest question.</>
                  : <>Empat zona.<br />Satu pertanyaan jujur.</>}
              </h2>
              <p style={bodyStyle()}>
                {t(
                  "Most of us have a working theory about where we are stuck. This exercise asks you to test that theory. It maps the four zones between safety and growth, helps you locate where you actually are right now, and gives you questions to work through -- alone, with a coach, or in a peer group. The discomfort you feel around a particular next step is not a warning to stop. It is usually a marker that you are close to where the growth is.",
                  "Sebagian besar dari kita memiliki teori kerja tentang di mana kita terjebak. Latihan ini mengajak kamu untuk menguji teori itu. Ini memetakan empat zona antara keamanan dan pertumbuhan, membantu kamu menemukan di mana kamu sebenarnya berada sekarang, dan memberikan pertanyaan untuk dikerjakan -- sendiri, dengan pelatih, atau dalam kelompok teman sebaya. Ketidaknyamanan yang kamu rasakan tentang langkah berikutnya tertentu bukan peringatan untuk berhenti. Biasanya itu adalah penanda bahwa kamu dekat dengan tempat pertumbuhannya.",
                  lang
                )}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {ZONES.map((zone) => (
                <a key={zone.key} href={`#zone-${zone.key}`} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem", background: zone.colorBg, border: `1px solid ${zone.colorBorder}`, textDecoration: "none", transition: "transform 0.2s ease", borderRadius: 4 }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "translateX(4px)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "none")}
                >
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: "0.75rem", color: zone.color, letterSpacing: "0.1em", textTransform: "uppercase" as const, flexShrink: 0 }}>{zone.num}</span>
                  <div>
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9375rem", fontWeight: 700, color: zone.color }}>{t(zone.titleEn, zone.titleId, lang)}</div>
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem", color: BODY_TEXT, marginTop: "0.1rem" }}>{t(zone.tagEn, zone.tagId, lang)}</div>
                  </div>
                  <span style={{ marginLeft: "auto", width: 8, height: 8, borderRight: `2px solid ${zone.color}`, borderBottom: `2px solid ${zone.color}`, transform: "rotate(-45deg)", flexShrink: 0 }} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── THE CROSS-CULTURAL COMFORT ZONE ── */}
      <section style={{ background: LIGHT_GRAY, ...sectionPadding }}>
        <div style={containerStyle}>
          <p style={eyebrowStyle}>{t("THE HIDDEN VERSION", "VERSI TERSEMBUNYI", lang)}</p>
          <h2 style={h2Style()}>
            {t("The comfort zone that looks like wisdom", "Zona nyaman yang terlihat seperti kebijaksanaan", lang)}
          </h2>
          <p style={bodyStyle()}>
            {t(
              "There is a particular comfort zone that forms in long-term cross-cultural work. It does not feel like avoidance. It feels like knowing what works.",
              "Ada zona nyaman tertentu yang terbentuk dalam pekerjaan lintas budaya jangka panjang. Rasanya bukan penghindaran. Rasanya seperti mengetahui apa yang berhasil.",
              lang
            )}
          </p>
          <p style={bodyStyle()}>
            {t(
              "You have learned which situations to navigate carefully and which to avoid. You have learned who in the community will engage and who will not. You have developed functional relationships, a workable language, a reliable routine. From the outside, this looks like competence. From the inside, it can begin to feel like a lid.",
              "Kamu telah mempelajari situasi mana yang harus dinavigasi dengan hati-hati dan mana yang harus dihindari. Kamu telah belajar siapa di komunitas yang akan terlibat dan siapa yang tidak. Kamu telah mengembangkan hubungan fungsional, bahasa yang bisa digunakan, rutinitas yang dapat diandalkan. Dari luar, ini terlihat seperti kompetensi. Dari dalam, ini bisa mulai terasa seperti tutup.",
              lang
            )}
          </p>
          <p style={bodyStyle()}>
            {t(
              "The cross-cultural comfort zone often forms precisely because crossing into the fear zone carries real cost here. Getting something wrong in a high-context culture is not a small social misstep -- it can damage trust that took years to build. Stepping into an unfamiliar leadership situation when you are already navigating language and cultural complexity is genuinely harder than doing the same thing in a familiar setting. The caution is rational.",
              "Zona nyaman lintas budaya sering terbentuk justru karena memasuki zona ketakutan membawa biaya nyata di sini. Melakukan kesalahan dalam budaya konteks tinggi bukan sekadar kesalahan sosial kecil -- ini dapat merusak kepercayaan yang membutuhkan bertahun-tahun untuk dibangun. Memasuki situasi kepemimpinan yang tidak familiar ketika kamu sudah menavigasi kompleksitas bahasa dan budaya jauh lebih sulit daripada melakukan hal yang sama dalam lingkungan yang familiar. Kehati-hatian itu masuk akal.",
              lang
            )}
          </p>
          <p style={bodyStyle()}>
            {t(
              "But the zone shrinks if you never push its edges.",
              "Tetapi zona itu menyempit jika kamu tidak pernah mendorong batas-batasnya.",
              lang
            )}
          </p>
          <p style={bodyStyle()}>
            {t(
              "There is also a version of this that builds in expat communities: comfort found entirely within a circle of people who share your background, language, and assumptions. Nothing is wrong with that belonging. But if the boundary of that circle becomes the boundary of your world, something has been lost.",
              "Ada juga versi ini yang terbentuk dalam komunitas ekspatriat: kenyamanan yang ditemukan sepenuhnya dalam lingkaran orang-orang yang berbagi latar belakang, bahasa, dan asumsi kamu. Tidak ada yang salah dengan rasa memiliki itu. Tetapi jika batas lingkaran itu menjadi batas duniamu, ada sesuatu yang hilang.",
              lang
            )}
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(20px, 2.5vw, 28px)", fontStyle: "italic", color: NAVY, lineHeight: 1.5, marginBottom: 0, marginTop: "1.5rem" }}>
            {t(
              "\"This module is an invitation to look honestly at where your actual boundary currently sits -- not where you think it should be, or where it used to be. Where is it now?\"",
              "\"Modul ini adalah undangan untuk melihat dengan jujur di mana batas aktual kamu saat ini berada -- bukan di mana menurutmu seharusnya, atau di mana dulu. Di mana sekarang?\"",
              lang
            )}
          </p>
        </div>
      </section>

      {/* ── FOUR ZONES ── */}
      {ZONES.map((zone, i) => (
        <section key={zone.key} id={`zone-${zone.key}`} style={{ background: i % 2 === 0 ? OFF_WHITE : LIGHT_GRAY, ...sectionPadding }}>
          <div style={containerStyle}>
            <p style={eyebrowStyle}>{`${zone.num} / 04 — ${t("Zone", "Zona", lang)}`}</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: "clamp(24px, 3.5vw, 40px)", color: NAVY, marginBottom: "0.375rem", lineHeight: 1.15, marginTop: 0 }}>
              {t(zone.titleEn, zone.titleId, lang)}
            </h2>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(17px, 2vw, 21px)", fontStyle: "italic", color: zone.color, marginBottom: "1.5rem" }}>
              {t(zone.tagEn, zone.tagId, lang)}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2rem", alignItems: "start" }}>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1rem", lineHeight: 1.8, color: BODY_TEXT, margin: 0 }}>
                {t(zone.descEn, zone.descId, lang)}
              </p>
              <div style={{ background: zone.colorBg, padding: "1.5rem 1.75rem", border: `1px solid ${zone.colorBorder}`, borderRadius: 4 }}>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: zone.color, marginBottom: "1rem", marginTop: 0 }}>
                  {t("Characteristics", "Karakteristik", lang)}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {(lang === "en" ? zone.listEn : zone.listId).map(item => (
                    <li key={item} style={{ display: "flex", gap: "0.75rem", fontFamily: "Montserrat, sans-serif", fontSize: "0.9375rem", color: BODY_TEXT, lineHeight: 1.7 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: zone.color, flexShrink: 0, marginTop: "0.45rem" }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── CONCENTRIC CIRCLE DIAGRAM ── PURE WHITE ── */}
      <section style={{ background: "#ffffff", paddingBlock: "clamp(4rem, 7vw, 7rem)" }}>
        <div style={containerStyle}>
          <p style={{ ...eyebrowStyle, paddingInline: "1.5rem" }}>{t("KEY INSIGHT", "WAWASAN UTAMA", lang)}</p>
          <h2 style={{ ...h2Style(), paddingInline: "1.5rem" }}>
            {t("Growth doesn't replace fear -- it expands around it.", "Pertumbuhan tidak menggantikan ketakutan -- ia berkembang di sekitarnya.", lang)}
          </h2>
          <p style={{ ...bodyStyle(), paddingInline: "1.5rem" }}>
            {t(
              "Notice how the comfort and fear zones are the smallest. Staying inside keeps your future small. But the growth zone still encompasses the fear and comfort zones -- even as you grow, you will still experience fears. It's just that your comfort zone expands as you spend more time in the learning and growth zones.",
              "Perhatikan bagaimana zona nyaman dan ketakutan adalah yang terkecil. Tetap di dalamnya membuat masa depanmu menjadi kecil. Namun zona pertumbuhan masih mencakup zona ketakutan dan kenyamanan -- bahkan saat kamu bertumbuh, kamu masih akan mengalami ketakutan. Hanya saja zona nyamanmu berkembang seiring semakin banyak waktu yang kamu habiskan di zona pembelajaran dan pertumbuhan.",
              lang
            )}
          </p>
          <figure style={{ margin: "0 1.5rem" }}>
            <div style={{ width: "100%", maxWidth: "540px", margin: "0 auto", background: "#ffffff", padding: "2rem", boxShadow: "0 4px 40px oklch(22% 0.10 260 / 0.08)" }}>
              <Image
                src={lang === "id" ? "/resources/comfort-zone-diagram-id.png" : "/resources/comfort-zone-diagram-en.png"}
                alt={t("Four concentric circles showing comfort, fear, learning and growth zones", "Empat lingkaran konsentris yang menunjukkan zona nyaman, ketakutan, pembelajaran, dan pertumbuhan", lang)}
                width={540}
                height={540}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <figcaption style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", color: BODY_TEXT, textAlign: "center", marginTop: "1rem" }}>
              {t(
                "Notice how the comfort and fear zones are smallest. Your comfort zone expands as you spend time in the learning and growth zones.",
                "Perhatikan bagaimana zona nyaman dan ketakutan adalah yang terkecil. Zona nyamanmu berkembang seiring waktu yang kamu habiskan di zona pembelajaran dan pertumbuhan.",
                lang
              )}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── ZONE LOCATOR ── */}
      <section style={{ background: OFF_WHITE, ...sectionPadding }}>
        <div style={containerStyle}>
          <p style={eyebrowStyle}>{t("WHERE ARE YOU RIGHT NOW?", "DI MANA KAMU SEKARANG?", lang)}</p>
          <h2 style={h2Style()}>{t("Locate yourself on the map.", "Temukan posisimu di peta.", lang)}</h2>
          <p style={bodyStyle()}>
            {t(
              "Read each statement. Mark the ones that feel most true for you right now -- not how you'd like to be, but how you actually are.",
              "Baca setiap pernyataan. Tandai yang paling terasa benar untukmu saat ini, bukan seperti yang ingin kamu jadikan dirimu, tapi seperti yang sebenarnya.",
              lang
            )}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
            {LOCATOR_STATEMENTS.map((stmt, i) => (
              <div key={i} style={{ background: locatorAnswers[i] === true ? "oklch(42% 0.14 260 / 0.08)" : locatorAnswers[i] === false ? "oklch(88% 0.008 80 / 0.5)" : "#ffffff", border: `1px solid ${locatorAnswers[i] === true ? "oklch(42% 0.14 260 / 0.25)" : "oklch(88% 0.008 80)"}`, borderRadius: 6, padding: "1rem 1.25rem", transition: "all 0.2s ease" }}>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9375rem", lineHeight: 1.7, color: BODY_TEXT, margin: "0 0 0.75rem" }}>
                  {t(stmt.en, stmt.id, lang)}
                </p>
                <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" as const }}>
                  <button
                    onClick={() => handleLocator(i, true)}
                    aria-pressed={locatorAnswers[i] === true}
                    style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", fontWeight: 700, padding: "0.375rem 0.875rem", minHeight: 36, borderRadius: 4, border: `1.5px solid ${locatorAnswers[i] === true ? NAVY : "oklch(70% 0.04 260)"}`, background: locatorAnswers[i] === true ? NAVY : "transparent", color: locatorAnswers[i] === true ? OFF_WHITE : BODY_TEXT, cursor: "pointer", transition: "all 0.15s ease" }}
                  >
                    {t("This is me", "Ini saya", lang)}
                  </button>
                  <button
                    onClick={() => handleLocator(i, false)}
                    aria-pressed={locatorAnswers[i] === false}
                    style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", fontWeight: 700, padding: "0.375rem 0.875rem", minHeight: 36, borderRadius: 4, border: `1.5px solid ${locatorAnswers[i] === false ? "oklch(55% 0.04 260)" : "oklch(70% 0.04 260)"}`, background: "transparent", color: BODY_TEXT, cursor: "pointer", transition: "all 0.15s ease" }}
                  >
                    {t("Not right now", "Tidak saat ini", lang)}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Locator result */}
          {locatorResult && (
            <div role="region" aria-live="polite" style={{ background: NAVY, borderRadius: 8, padding: "2rem", marginTop: "1rem" }}>
              <p style={eyebrowStyle}>{t("YOUR RESULT", "HASILMU", lang)}</p>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1rem", lineHeight: 1.8, color: OFF_WHITE, margin: 0 }}>
                {t(zoneResultText[locatorResult].en, zoneResultText[locatorResult].id, lang)}
              </p>
            </div>
          )}
          {answered > 0 && answered < 12 && (
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.875rem", color: BODY_TEXT, marginTop: "1rem" }}>
              {t(`${answered} of 24 answered. Mark at least 12 to see your result.`, `${answered} dari 24 dijawab. Tandai setidaknya 12 untuk melihat hasilmu.`, lang)}
            </p>
          )}
        </div>
      </section>

      {/* ── REFLECTION QUESTIONS ── */}
      <section style={{ background: NAVY, position: "relative", ...sectionPadding }}>
        <div style={{ position: "absolute", left: "clamp(1.5rem, 5vw, 4rem)", top: "clamp(4rem, 7vw, 7rem)", bottom: "clamp(4rem, 7vw, 7rem)", width: "3px", background: ORANGE }} />
        <div style={{ ...containerStyle, paddingLeft: "2.5rem" }}>
          <p style={eyebrowStyle}>{t("REFLECTION WORKSHEET", "LEMBAR REFLEKSI", lang)}</p>
          <h2 style={h2Style(true)}>
            {t("Six questions worth sitting with.", "Enam pertanyaan yang layak direnungkan.", lang)}
          </h2>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9375rem", color: "oklch(65% 0.04 260)", marginBottom: "2.5rem", maxWidth: "52ch", lineHeight: 1.7 }}>
            {t(
              "Work through these questions in a journal, with a coach, or in your peer group. Each question has a space for you to write privately -- your notes stay on your device.",
              "Kerjakan pertanyaan-pertanyaan ini dalam jurnal, bersama pelatih, atau dalam kelompok teman sebaya. Setiap pertanyaan memiliki ruang untuk kamu menulis secara pribadi -- catatanmu tetap di perangkatmu.",
              lang
            )}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {QUESTIONS.map((q) => {
              const isOpen = openQuestion === q.num;
              return (
                <div key={q.num} style={{ background: "oklch(28% 0.10 260)", borderRadius: 6, overflow: "hidden" }}>
                  <button
                    onClick={() => setOpenQuestion(isOpen ? null : q.num)}
                    aria-expanded={isOpen}
                    aria-controls={`q-panel-${q.num}`}
                    style={{ width: "100%", display: "flex", gap: "1.5rem", alignItems: "flex-start", padding: "1.5rem 2rem", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" as const }}
                  >
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: "0.75rem", color: ORANGE, letterSpacing: "0.08em", flexShrink: 0, paddingTop: "0.15rem", minWidth: "2.25rem" }}>
                      {q.num}{q.optional ? ` (${t("optional", "opsional", lang)})` : ""}
                    </span>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9375rem", lineHeight: 1.7, color: "oklch(78% 0.04 260)", margin: 0, flex: 1 }}>
                      {t(q.en, q.id, lang)}
                    </p>
                    <span style={{ width: 8, height: 8, borderRight: `2px solid ${ORANGE}`, borderBottom: `2px solid ${ORANGE}`, transform: isOpen ? "rotate(-135deg)" : "rotate(45deg)", transition: "transform 0.2s ease", flexShrink: 0, marginTop: "0.5rem" }} />
                  </button>
                  <div
                    id={`q-panel-${q.num}`}
                    role="region"
                    style={{
                      display: "grid",
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      transition: "grid-template-rows 0.25s ease",
                    }}
                  >
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ padding: "0 2rem 1.5rem 5.25rem" }}>
                        <textarea
                          placeholder={t("Type here...", "Tulis di sini...", lang)}
                          style={{ width: "100%", minHeight: "80px", padding: "0.75rem", border: "1px solid rgba(248,247,244,0.2)", borderRadius: "6px", background: "rgba(248,247,244,0.08)", color: "#F8F7F4", fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", resize: "vertical", marginTop: "0.75rem", boxSizing: "border-box" as const }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAITH ANCHOR ── */}
      <section style={{ background: NAVY, borderTop: "1px solid oklch(35% 0.08 260)", ...sectionPadding }}>
        <div style={containerStyle}>
          <p style={eyebrowStyle}>{t("FAITH ANCHOR", "JANGKAR IMAN", lang)}</p>
          <h2 style={h2Style(true)}>
            {t("When staying put looks like faithfulness.", "Ketika tetap diam terlihat seperti kesetiaan.", lang)}
          </h2>
          <p style={bodyStyle(true)}>
            {t(
              "The comfort zone problem in cross-cultural leadership is not usually laziness. It is obedience that has become conditional.",
              "Masalah zona nyaman dalam kepemimpinan lintas budaya biasanya bukan kemalasan. Ini adalah ketaatan yang telah menjadi bersyarat.",
              lang
            )}
          </p>
          <p style={bodyStyle(true)}>
            {t(
              "A leader accepts the initial posting: that is obedience. They learn the language, navigate the culture, build relationships: that is faithfulness. But at some point, growth stops. Not because of opposition or crisis, but because the zone that was once new has become familiar, and the invitation to go further requires a new yes that the leader has not yet given.",
              "Seorang pemimpin menerima penugasan awal: itu adalah ketaatan. Mereka belajar bahasa, menavigasi budaya, membangun hubungan: itu adalah kesetiaan. Tetapi pada suatu titik, pertumbuhan berhenti. Bukan karena pertentangan atau krisis, tetapi karena zona yang dulunya baru telah menjadi familiar, dan undangan untuk melangkah lebih jauh membutuhkan ya yang baru yang belum diberikan pemimpin itu.",
              lang
            )}
          </p>
          <p style={bodyStyle(true)}>
            {t(
              "Joshua 1:9 names this directly: 'Be strong and courageous. Do not be frightened and do not be dismayed, for the Lord your God is with you wherever you go.' The instruction is not 'be strategic' or 'be comfortable with discomfort.' It is an instruction rooted in a promise. The courage required is not manufactured from within. It is borrowed from the One who goes ahead.",
              "Yosua 1:9 menyebutkan ini secara langsung: 'Kuatkan dan teguhkanlah hatimu. Janganlah kecut dan tawar hati, sebab Tuhan, Allahmu, menyertai engkau ke mana pun engkau pergi.' Instruksi itu bukan 'jadilah strategis' atau 'nyamanlah dengan ketidaknyamanan.' Ini adalah instruksi yang berakar pada sebuah janji. Keberanian yang diperlukan tidak diproduksi dari dalam. Itu dipinjam dari Dia yang berjalan di depan.",
              lang
            )}
          </p>
          <p style={bodyStyle(true)}>
            {t(
              "The comfort zone becomes a theological issue when it is maintained by a fear that we are not willing to take to God. The question worth asking is not only 'what is holding me back?' but 'what am I believing about God that makes this feel safer than moving forward?'",
              "Zona nyaman menjadi masalah teologis ketika dipertahankan oleh ketakutan yang tidak mau kita bawa kepada Tuhan. Pertanyaan yang layak ditanyakan bukan hanya 'apa yang menahan saya?' tetapi 'apa yang saya percayai tentang Tuhan yang membuat ini terasa lebih aman daripada maju?'",
              lang
            )}
          </p>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1rem", lineHeight: 1.8, color: "oklch(85% 0.01 80)", marginBottom: "2rem" }}>
            {t(
              "The answer to that question is more useful than any five-step growth plan.",
              "Jawaban atas pertanyaan itu lebih berguna daripada rencana pertumbuhan lima langkah mana pun.",
              lang
            )}
          </p>

          {/* 2 Timothy 1:7 blockquote */}
          <blockquote style={{ borderLeft: `4px solid ${ORANGE}`, paddingLeft: "1.5rem", margin: "0 0 1.5rem" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "clamp(18px, 2.5vw, 24px)", color: OFF_WHITE, lineHeight: 1.6, margin: "0 0 0.75rem" }}>
              {t(
                "\"For God has not given us a spirit of timidity, but of power, love, and sound judgement.\"",
                "\"Sebab Allah memberikan kepada kita bukan roh ketakutan, melainkan roh yang membangkitkan kekuatan, kasih dan ketertiban.\"",
                lang
              )}
            </p>
            <cite style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: ORANGE }}>
              {t("2 Timothy 1:7", "2 Timotius 1:7", lang)}
            </cite>
          </blockquote>
        </div>
      </section>

      {/* ── KEY TAKEAWAYS ── */}
      <section style={{ background: LIGHT_GRAY, ...sectionPadding }}>
        <div style={containerStyle}>
          <p style={eyebrowStyle}>{t("KEY TAKEAWAYS", "POIN-POIN UTAMA", lang)}</p>
          <h2 style={h2Style()}>{t("What to carry forward.", "Yang perlu dibawa ke depan.", lang)}</h2>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1.25rem", counterReset: "takeaway" }}>
            {TAKEAWAYS.map((item, i) => (
              <li key={i} style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: "0.75rem", color: ORANGE, letterSpacing: "0.08em", minWidth: "2rem", paddingTop: "0.2rem" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", lineHeight: 1.8, color: BODY_TEXT, margin: 0 }}>
                  {t(item.en, item.id, lang)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── ACTION CLOSE / CTA ── */}
      <section style={{ background: NAVY, ...sectionPadding }}>
        <div style={containerStyle}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem", alignItems: "start" }}>
            <div>
              <p style={eyebrowStyle}>{t("WHAT NOW", "APA SELANJUTNYA", lang)}</p>
              <h2 style={h2Style(true)}>
                {t("One step this week.", "Satu langkah minggu ini.", lang)}
              </h2>
              <p style={bodyStyle(true)}>
                {t(
                  "You have just mapped where your comfort zone sits. That is useful information. But information without action tends to fade.",
                  "Kamu baru saja memetakan di mana zona nyamanmu berada. Itu adalah informasi yang berguna. Tetapi informasi tanpa tindakan cenderung memudar.",
                  lang
                )}
              </p>
              <p style={bodyStyle(true)}>
                {t(
                  "Pick one item from your answer to Question 01 -- the thing you would like to do but have been avoiding. Not the biggest thing. Not the one that requires the most courage. The one that is closest to the edge of your current zone.",
                  "Pilih satu item dari jawabanmu untuk Pertanyaan 01 -- hal yang ingin kamu lakukan tetapi telah kamu hindari. Bukan hal terbesar. Bukan yang membutuhkan keberanian paling banyak. Yang paling dekat dengan tepi zona kamu saat ini.",
                  lang
                )}
              </p>
              <p style={bodyStyle(true)}>
                {t(
                  "Tell one person about it. Not to create accountability in the performance sense, but to give the thought a landing place outside your own head. That act of naming it -- out loud, to someone who knows you -- is itself a step into the learning zone.",
                  "Ceritakan kepada satu orang. Bukan untuk menciptakan akuntabilitas dalam pengertian kinerja, tetapi untuk memberi pikiran itu tempat mendarat di luar kepalamu sendiri. Tindakan menamakannya -- dengan lantang, kepada seseorang yang mengenalmu -- itu sendiri sudah merupakan langkah ke zona pembelajaran.",
                  lang
                )}
              </p>
              <p style={bodyStyle(true)}>
                {t(
                  "If you have a peer group, a team meeting, or a coaching session this week, bring your answer to Question 04. Ask them what they see that you might be missing. The people around you often have a clearer view of where you are stuck than you do.",
                  "Jika kamu memiliki kelompok teman sebaya, pertemuan tim, atau sesi pelatihan minggu ini, bawa jawabanmu untuk Pertanyaan 04. Tanyakan kepada mereka apa yang mereka lihat yang mungkin kamu lewatkan. Orang-orang di sekitarmu sering memiliki pandangan yang lebih jelas tentang di mana kamu terjebak daripada kamu sendiri.",
                  lang
                )}
              </p>
              <Link href="/resources" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.06em", color: "oklch(65% 0.04 260)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem", marginTop: "1rem" }}>
                {t("Browse the full library →", "Jelajahi perpustakaan lengkap →", lang)}
              </Link>
            </div>
            <div>
              <div style={{ background: "oklch(30% 0.12 260)", padding: "2.5rem", borderRadius: 8 }}>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.375rem", fontStyle: "italic", color: "oklch(78% 0.04 260)", lineHeight: 1.5, marginBottom: "1.25rem", marginTop: 0 }}>
                  {t(
                    "\"Growth does not require that you never feel afraid. It requires that you act from trust rather than from the absence of fear.\"",
                    "\"Pertumbuhan tidak mengharuskan kamu tidak pernah merasa takut. Ini mengharuskan kamu bertindak dari kepercayaan, bukan dari ketiadaan rasa takut.\"",
                    lang
                  )}
                </p>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: ORANGE }} />
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", color: ORANGE, textTransform: "uppercase" as const }}>Crispy Development</span>
                </div>
              </div>
              {showAddToDashboard && !saved && (
                <button onClick={handleSave} disabled={isPending} style={{ marginTop: "1.5rem", display: "inline-flex", alignItems: "center", gap: 8, minHeight: 44, padding: "10px 20px", background: "transparent", border: `1.5px solid ${ORANGE}`, borderRadius: 8, fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 600, color: ORANGE, cursor: isPending ? "wait" : "pointer", width: "100%" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M3 2h10a1 1 0 011 1v11l-6-3-6 3V3a1 1 0 011-1z"/>
                  </svg>
                  {isPending ? t("Saving...", "Menyimpan...", lang) : t("Save to Dashboard", "Simpan ke Dashboard", lang)}
                </button>
              )}
              {showAddToDashboard && saved && (
                <Link href="/dashboard" style={{ marginTop: "1.5rem", display: "inline-flex", alignItems: "center", gap: 8, minHeight: 44, padding: "10px 20px", background: "transparent", border: `1.5px solid ${ORANGE}`, borderRadius: 8, fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 600, color: ORANGE, textDecoration: "none", width: "100%", boxSizing: "border-box" as const }}>
                  {t("Go to Dashboard →", "Ke Dashboard →", lang)}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
