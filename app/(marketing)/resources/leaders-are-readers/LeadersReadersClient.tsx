"use client";

import React, { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import LangToggle from "@/components/LangToggle";
import { saveResourceToDashboard } from "../actions";
import SourcesDropdown from "@/components/SourcesDropdown";

type Lang = "en" | "id";

const t = (en: string, id: string, lang: Lang): string => (lang === "en" ? en : id);

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const navy      = "oklch(22% 0.10 260)";
const orange    = "oklch(65% 0.15 45)";
const offWhite  = "oklch(96% 0.005 80)";
const lightGray = "oklch(88% 0.008 80)";
const bodyText  = "oklch(38% 0.05 260)";
const FONT      = "var(--font-montserrat), Montserrat, sans-serif";
const CORMORANT = "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif";

// ─── Book data ────────────────────────────────────────────────────────────────
type BookCategory = "faith" | "leadership" | "cross-cultural" | "habit" | "coming-soon";

type Book = {
  id: string;
  title: string;
  titleId: string;
  author: string;
  coverUrl: string;
  descriptionEn: string;
  descriptionId: string;
  whyReadEn: string;
  whyReadId: string;
  category: BookCategory;
  buyUrl?: string;
};

const BOOKS: Book[] = [
  // ── Habit ─────────────────────────────────────────────────────────────────
  {
    id: "limitless",
    title: "Limitless",
    titleId: "Limitless",
    author: "Jim Kwik",
    coverUrl: "https://covers.openlibrary.org/b/isbn/1401960529-L.jpg",
    descriptionEn:
      "Jim Kwik's Limitless provides a practical system for upgrading your mental performance, showing that the real limits on learning are not innate but learned, and can be unlearned. For leaders who feel they are not natural readers, this book reframes the story.",
    descriptionId:
      "Limitless karya Jim Kwik memberikan sistem praktis untuk meningkatkan performa mentalmu, menunjukkan bahwa batasan belajar yang sesungguhnya bukan bawaan lahir, melainkan dipelajari, dan bisa diubah. Bagi pemimpin yang merasa bukan pembaca alami, buku ini membingkai ulang ceritanya.",
    whyReadEn:
      "Start here if you believe reading is something other people are better at. Kwik dismantles that story directly.",
    whyReadId:
      "Mulailah dari sini jika kamu percaya membaca adalah sesuatu yang lebih dikuasai orang lain. Kwik membongkar cerita itu secara langsung.",
    category: "habit",
    buyUrl:
      "https://www.amazon.com/dp/1401960529",
  },
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    titleId: "Atomic Habits",
    author: "James Clear",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",
    descriptionEn:
      "James Clear makes the case that tiny, consistent changes compound into remarkable results over time. Clear shows that reading is not about willpower but about building a system that makes the habit almost inevitable. One of the most practical books on behaviour change published in the last decade.",
    descriptionId:
      "James Clear berargumen bahwa perubahan kecil yang konsisten akan berlipat ganda menjadi hasil luar biasa seiring waktu. Clear menunjukkan bahwa membaca bukan soal tekad, melainkan membangun sistem yang membuat kebiasaan itu hampir tak terelakkan.",
    whyReadEn:
      "If you want to build a consistent reading habit, this is the manual. Clear's system for habit stacking and environment design is directly applicable.",
    whyReadId:
      "Jika kamu ingin membangun kebiasaan membaca yang konsisten, ini adalah panduannya. Sistem Clear untuk menumpuk kebiasaan dan merancang lingkungan bisa langsung diterapkan.",
    category: "habit",
    buyUrl: "https://www.amazon.com/dp/0735211299",
  },
  {
    id: "deep-work",
    title: "Deep Work",
    titleId: "Deep Work",
    author: "Cal Newport",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg",
    descriptionEn:
      "Cal Newport argues that the ability to focus without distraction is becoming both increasingly rare and increasingly valuable. For leaders trying to grow through reading, his rules for cultivating depth apply directly to the reading habit.",
    descriptionId:
      "Cal Newport berargumen bahwa kemampuan untuk fokus tanpa gangguan semakin langka sekaligus semakin berharga. Bagi pemimpin yang ingin bertumbuh melalui membaca, aturannya untuk menumbuhkan kedalaman langsung bisa diterapkan pada kebiasaan membaca.",
    whyReadEn:
      "Read this to understand why your environment may be working against your reading habit, and what to do about it.",
    whyReadId:
      "Bacalah ini untuk memahami mengapa lingkunganmu mungkin berjalan berlawanan dengan kebiasaan membacamu, dan apa yang bisa dilakukan.",
    category: "habit",
    buyUrl: "https://www.amazon.com/dp/1455586692",
  },
  // ── Cross-Cultural ────────────────────────────────────────────────────────
  {
    id: "culture-map",
    title: "The Culture Map",
    titleId: "The Culture Map",
    author: "Erin Meyer",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781610392501-L.jpg",
    descriptionEn:
      "Erin Meyer maps eight scales of cultural difference, from communication styles to how trust is built, giving leaders a practical framework for reading any international context. Grounded in research and filled with real examples from global teams.",
    descriptionId:
      "Erin Meyer memetakan delapan skala perbedaan budaya, mulai dari gaya komunikasi hingga cara membangun kepercayaan, memberikan pemimpin kerangka praktis untuk membaca konteks internasional apa pun. Berdasarkan penelitian dan dipenuhi contoh nyata dari tim global.",
    whyReadEn:
      "If you lead across cultures and sometimes feel like you are speaking different languages even in the same language, this book names what is actually happening.",
    whyReadId:
      "Jika kamu memimpin lintas budaya dan kadang merasa berbicara bahasa yang berbeda meskipun menggunakan bahasa yang sama, buku ini menamai apa yang sebenarnya terjadi.",
    category: "cross-cultural",
    buyUrl: "https://www.amazon.com/dp/1610392507",
  },
  {
    id: "tribe",
    title: "Tribe",
    titleId: "Tribe",
    author: "Sebastian Junger",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781455566389-L.jpg",
    descriptionEn:
      "Sebastian Junger investigates why soldiers often miss war and why so many people feel a deep longing for belonging and shared purpose. Drawing on anthropology, history, and conflict reporting, he reveals how modern life has stripped away the tight-knit community that human beings are wired for. A short, powerful read on what holds people together.",
    descriptionId:
      "Sebastian Junger menyelidiki mengapa tentara sering merindukan masa perang dan mengapa banyak orang merasakan kerinduan mendalam akan rasa memiliki dan tujuan bersama. Buku singkat dan kuat tentang apa yang menyatukan manusia.",
    whyReadEn:
      "For any leader working in community, this names the human need for belonging with striking clarity. The cross-cultural tension — between individual autonomy and tribal solidarity — is at the heart of the book.",
    whyReadId:
      "Bagi pemimpin yang bekerja dalam komunitas, buku ini menamai kebutuhan manusia akan rasa memiliki dengan kejernihan yang mencolok. Ketegangan lintas budaya antara otonomi individu dan solidaritas kelompok ada di jantung buku ini.",
    category: "cross-cultural",
    buyUrl: "https://www.amazon.com/dp/1455566381",
  },
  {
    id: "when-helping-hurts",
    title: "When Helping Hurts",
    titleId: "When Helping Hurts",
    author: "Steve Corbett & Brian Fikkert",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780802409980-L.jpg",
    descriptionEn:
      "Corbett and Fikkert challenge the assumptions behind how wealthier Christians engage with poverty and show that many well-intentioned interventions do more harm than good. A necessary correction for any leader working in international development or community transformation.",
    descriptionId:
      "Corbett dan Fikkert menantang asumsi di balik cara orang Kristen yang lebih berada berinteraksi dengan kemiskinan, dan menunjukkan bahwa banyak intervensi dengan niat baik justru lebih banyak merugikan daripada membantu. Koreksi penting bagi pemimpin di bidang pembangunan internasional atau transformasi masyarakat.",
    whyReadEn:
      "Required reading before entering any development or relief context. The title alone tells you what this book does.",
    whyReadId:
      "Bacaan wajib sebelum memasuki konteks pembangunan atau bantuan apa pun. Judulnya sendiri sudah memberi tahu apa yang dilakukan buku ini.",
    category: "cross-cultural",
    buyUrl: "https://www.amazon.com/dp/0802409989",
  },
  // ── Faith ─────────────────────────────────────────────────────────────────
  {
    id: "ruthless-elimination-of-hurry",
    title: "The Ruthless Elimination of Hurry",
    titleId: "The Ruthless Elimination of Hurry",
    author: "John Mark Comer",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780525653097-L.jpg",
    descriptionEn:
      "John Mark Comer argues that hurry is the great enemy of the spiritual life, and that the pace at which most leaders live is incompatible with the formation Jesus modelled. Drawing on Dallas Willard and the Desert Fathers, he makes a compelling case for a slower, more intentional life. Reading, by nature, requires you to slow down.",
    descriptionId:
      "John Mark Comer berargumen bahwa tergesa-gesa adalah musuh besar kehidupan rohani, dan bahwa tempo di mana sebagian besar pemimpin hidup tidak sejalan dengan pembentukan yang dicontohkan Yesus. Sebuah seruan yang meyakinkan untuk hidup yang lebih lambat dan lebih disengaja.",
    whyReadEn:
      "If you feel too busy to read, this is the first book to read. Comer diagnoses the hurry that keeps leaders from the formation they most need.",
    whyReadId:
      "Kalau kamu merasa terlalu sibuk untuk membaca, inilah buku pertama yang perlu dibaca. Comer mendiagnosis ketergesa-gesaan yang menghalangi pemimpin dari pembentukan yang paling mereka butuhkan.",
    category: "faith",
    buyUrl: "https://www.amazon.com/dp/0525653090",
  },
  {
    id: "making-of-a-leader",
    title: "The Making of a Leader",
    titleId: "The Making of a Leader",
    author: "Robert Clinton",
    coverUrl: "https://covers.openlibrary.org/b/id/688500-L.jpg",
    descriptionEn:
      "Robert Clinton spent decades studying the life patterns of Christian leaders and found that the most significant growth usually comes through trial, not success. This book gives you a map of leadership development stages and helps you locate yourself on it.",
    descriptionId:
      "Robert Clinton menghabiskan beberapa dekade mempelajari pola kehidupan para pemimpin Kristen dan menemukan bahwa pertumbuhan paling signifikan biasanya datang melalui ujian, bukan kesuksesan. Buku ini memberimu peta tahapan pengembangan kepemimpinan.",
    whyReadEn:
      "Essential for anyone navigating a difficult or uncertain season. Clinton helps you see the bigger arc of what God may be doing in your leadership journey.",
    whyReadId:
      "Penting bagi siapa pun yang menavigasi musim yang sulit atau tidak pasti. Clinton membantumu melihat busur lebih besar dari apa yang mungkin sedang Allah kerjakan dalam perjalanan kepemimpinanmu.",
    category: "faith",
    buyUrl: "https://www.amazon.com/dp/0891091831",
  },
  // ── Leadership ────────────────────────────────────────────────────────────
  {
    id: "leaders-eat-last",
    title: "Leaders Eat Last",
    titleId: "Leaders Eat Last",
    author: "Simon Sinek",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781591845324-L.jpg",
    descriptionEn:
      "Drawing on military and organizational research, Sinek shows why the best leaders create environments of safety, trust, and belonging, and what happens to teams when leaders put their own interests first. Deeply human and practically grounded.",
    descriptionId:
      "Berdasarkan penelitian militer dan organisasi, Sinek menunjukkan mengapa pemimpin terbaik menciptakan lingkungan keamanan, kepercayaan, dan rasa memiliki, serta apa yang terjadi pada tim ketika pemimpin mendahulukan kepentingan pribadi.",
    whyReadEn:
      "A leadership book that takes seriously the cost of self-serving leadership on real people. The servant leadership angle resonates deeply with faith-rooted leaders.",
    whyReadId:
      "Sebuah buku kepemimpinan yang serius memandang dampak kepemimpinan yang mementingkan diri sendiri. Sudut pandang kepemimpinan hamba sangat beresonansi dengan pemimpin yang berakar pada iman.",
    category: "leadership",
    buyUrl: "https://www.amazon.com/dp/1591845327",
  },
  {
    id: "multipliers",
    title: "Multipliers",
    titleId: "Multipliers",
    author: "Liz Wiseman",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780062663078-L.jpg",
    descriptionEn:
      "Wiseman's research shows that some leaders amplify the intelligence around them while others diminish it, often without realising it. She names the patterns of both and gives leaders practical tools to become the kind of leader who makes everyone on the team smarter.",
    descriptionId:
      "Penelitian Wiseman menunjukkan bahwa beberapa pemimpin memperkuat kecerdasan di sekitar mereka sementara yang lain justru memperlemahnya, seringkali tanpa disadari. Ia menamai pola keduanya dan memberi alat praktis untuk menjadi pemimpin yang membuat semua orang di tim lebih cerdas.",
    whyReadEn:
      "If you ever wonder whether you are unleashing or inadvertently limiting the people around you, this book gives you the language and the tools to find out.",
    whyReadId:
      "Jika kamu pernah bertanya-tanya apakah kamu sedang membebaskan atau justru tanpa sengaja membatasi orang-orang di sekitarmu, buku ini memberimu bahasa dan alat untuk mengetahuinya.",
    category: "leadership",
    buyUrl: "https://www.amazon.com/dp/006266307X",
  },
  {
    id: "good-to-great",
    title: "Good to Great",
    titleId: "Good to Great",
    author: "Jim Collins",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780066620992-L.jpg",
    descriptionEn:
      "Collins and his research team studied what separates organisations that made a leap to greatness from those that remained merely good. What they found was counterintuitive: the best leaders were humble and fiercely determined, not celebrity visionaries.",
    descriptionId:
      "Collins dan tim penelitiannya mempelajari apa yang membedakan organisasi yang melompat menuju keunggulan dari yang tetap biasa-biasa saja. Yang mereka temukan berlawanan intuisi: pemimpin terbaik adalah orang yang rendah hati dan sangat tekad, bukan visioner selebritas.",
    whyReadEn:
      "The Level 5 Leadership chapter alone is worth the read. Collins found with data what Scripture has always said about humility.",
    whyReadId:
      "Bab Level 5 Leadership saja sudah layak dibaca. Collins menemukan dengan data apa yang selalu dikatakan Alkitab tentang kerendahan hati.",
    category: "leadership",
    buyUrl: "https://www.amazon.com/dp/0066620996",
  },
  {
    id: "21-laws",
    title: "The 21 Irrefutable Laws of Leadership",
    titleId: "21 Hukum Kepemimpinan yang Tak Terbantahkan",
    author: "John Maxwell",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780785289357-L.jpg",
    descriptionEn:
      "Maxwell distils decades of leadership experience into 21 principles that hold across contexts, cultures, and sectors. More accessible than academic leadership texts, this has become one of the most widely read leadership books among global Christian leaders.",
    descriptionId:
      "Maxwell menyuling pengalaman kepemimpinan selama beberapa dekade menjadi 21 prinsip yang berlaku di berbagai konteks, budaya, dan sektor. Lebih mudah diakses daripada teks kepemimpinan akademis, ini menjadi salah satu buku kepemimpinan yang paling banyak dibaca di kalangan pemimpin Kristen global.",
    whyReadEn:
      "A useful reference to return to across different seasons of leadership. Some laws will hit harder depending on where you are right now.",
    whyReadId:
      "Referensi yang berguna untuk kembali dibaca di berbagai musim kepemimpinan. Beberapa hukum akan terasa lebih kuat tergantung di mana kamu berada saat ini.",
    category: "leadership",
    buyUrl: "https://www.amazon.com/dp/0785289356",
  },
];

// ─── Prose style helper ────────────────────────────────────────────────────────
const prose: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: "clamp(0.9rem, 1.6vw, 1rem)",
  color: bodyText,
  lineHeight: 1.8,
  marginBottom: "1.5rem",
};

const proseDark: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: "clamp(0.9rem, 1.6vw, 1rem)",
  color: "oklch(82% 0.04 260)",
  lineHeight: 1.85,
  marginBottom: "1.5rem",
};

const proseSubhead: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.1em",
  color: orange,
  textTransform: "uppercase",
  marginBottom: "0.5rem",
  marginTop: "2rem",
};


// ─── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: FONT,
        fontSize: "0.75rem",
        letterSpacing: "0.12em",
        color: orange,
        fontWeight: 700,
        marginBottom: "1.25rem",
        textTransform: "uppercase" as const,
        marginTop: 0,
      }}
    >
      {children}
    </p>
  );
}

// ─── H2 helper ────────────────────────────────────────────────────────────────
function SectionH2({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <h2
      style={{
        fontFamily: CORMORANT,
        fontWeight: 600,
        fontSize: "clamp(28px, 4vw, 48px)",
        color: dark ? "white" : navy,
        marginBottom: "1.25rem",
        lineHeight: 1.15,
        marginTop: 0,
      }}
    >
      {children}
    </h2>
  );
}

// ─── Inline pull quote ─────────────────────────────────────────────────────────
function PullQuote({
  quote,
  attribution,
  dark = false,
}: {
  quote: string;
  attribution: string;
  dark?: boolean;
}) {
  return (
    <div
      style={{
        margin: "2.5rem 0",
        paddingLeft: "1.25rem",
        borderLeft: `2px solid ${orange}`,
      }}
    >
      <p
        style={{
          fontFamily: CORMORANT,
          fontStyle: "italic",
          fontSize: "clamp(1.05rem, 2vw, 1.3rem)",
          color: dark ? "oklch(80% 0.04 260)" : "oklch(32% 0.07 260)",
          lineHeight: 1.65,
          margin: 0,
          marginBottom: "0.5rem",
        }}
      >
        &ldquo;{quote}&rdquo;
      </p>
      <cite
        style={{
          display: "block",
          fontFamily: FONT,
          fontSize: "0.68rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: orange,
          textTransform: "uppercase" as const,
          fontStyle: "normal",
        }}
      >
        — {attribution}
      </cite>
    </div>
  );
}

// ─── Book modal ────────────────────────────────────────────────────────────────
function BookModal({
  book,
  lang,
  onClose,
}: {
  book: Book;
  lang: Lang;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(4px)",
          zIndex: 60,
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-modal-title"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 61,
          background: "white",
          borderRadius: 12,
          padding: "2rem",
          width: "min(680px, calc(100vw - 2rem))",
          maxHeight: "calc(100vh - 4rem)",
          overflowY: "auto",
          display: "grid",
          gridTemplateColumns: "clamp(100px, 28%, 160px) 1fr",
          gap: "1.75rem",
          boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
        }}
      >
        <div>
          <img
            src={book.coverUrl}
            alt={book.title}
            style={{
              width: "100%",
              aspectRatio: "2/3",
              objectFit: "cover",
              borderRadius: 6,
              display: "block",
            }}
          />
        </div>
        <div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "none",
              border: "none",
              fontSize: "1.4rem",
              cursor: "pointer",
              color: "oklch(55% 0.05 260)",
              lineHeight: 1,
              padding: "4px 8px",
              minHeight: 44,
            }}
          >
            ×
          </button>
          <p
            style={{
              fontFamily: FONT,
              fontSize: "0.62rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: orange,
              textTransform: "uppercase" as const,
              marginBottom: "0.5rem",
            }}
          >
            {t("Recommended Reading", "Bacaan yang Direkomendasikan", lang)}
          </p>
          <h3
            id="book-modal-title"
            style={{
              fontFamily: CORMORANT,
              fontWeight: 600,
              fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)",
              color: navy,
              marginBottom: "0.375rem",
              lineHeight: 1.2,
            }}
          >
            {lang === "en" ? book.title : book.titleId}
          </h3>
          {book.author && (
            <p
              style={{
                fontFamily: FONT,
                fontSize: "0.8rem",
                color: "oklch(52% 0.008 260)",
                marginBottom: "1.25rem",
              }}
            >
              {book.author}
            </p>
          )}
          <p style={{ ...prose, marginBottom: "1rem" }}>
            {lang === "en" ? book.descriptionEn : book.descriptionId}
          </p>
          {(book.whyReadEn || book.whyReadId) && (
            <div
              style={{
                background: "oklch(97% 0.010 50)",
                border: `1px solid oklch(88% 0.030 50)`,
                borderRadius: 6,
                padding: "0.875rem 1rem",
                marginBottom: "1.5rem",
              }}
            >
              <p
                style={{
                  fontFamily: FONT,
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: orange,
                  textTransform: "uppercase" as const,
                  marginBottom: "0.375rem",
                }}
              >
                {t("Why read this", "Mengapa baca ini", lang)}
              </p>
              <p
                style={{
                  fontFamily: CORMORANT,
                  fontStyle: "italic",
                  fontSize: "1rem",
                  color: bodyText,
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {lang === "en" ? book.whyReadEn : book.whyReadId}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function LeadersReadersClient({
  isSaved,
  isLoggedIn,
}: {
  isSaved: boolean;
  isLoggedIn: boolean;
}) {
  const { lang: ctxLang } = useLanguage();
  const lang = (ctxLang === "id" ? "id" : "en") as Lang;

  const [saved, setSaved] = useState(isSaved);
  const [isPending, startTransition] = useTransition();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [bookCategoryFilter, setBookCategoryFilter] = useState<BookCategory | "all">("all");
  const [bgOpen, setBgOpen] = useState(false);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      const result = await saveResourceToDashboard("leaders-are-readers");
      if (!result.error) {
        setSaved(true);
        window.gtag?.("event", "resource_saved", { resource: "leaders-are-readers" });
      }
    });
  }

  return (
    <div style={{ fontFamily: FONT, background: offWhite, color: bodyText }}>
      <LangToggle />

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section
        style={{
          background: navy,
          paddingTop: "clamp(3rem, 5vw, 5rem)",
          paddingBottom: "clamp(3rem, 5vw, 5rem)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background image — luminosity overlay */}
        <img
          src="/images/resources/leaders-are-readers/hero.jpg"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.35,
            mixBlendMode: "luminosity",
            pointerEvents: "none",
          }}
        />
        <div className="container-wide" style={{ position: "relative" }}>
          <SectionLabel>
            {t(
              "PERSONAL GROWTH — GUIDE",
              "PENGEMBANGAN PRIBADI — PANDUAN",
              lang
            )}
          </SectionLabel>

          <h1
            style={{
              fontFamily: CORMORANT,
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 600,
              lineHeight: 1.08,
              color: offWhite,
              marginBottom: "1.25rem",
              maxWidth: "16ch",
            }}
          >
            {lang === "en" ? (
              <>
                Leaders Are{" "}
                <span style={{ color: orange }}>Readers.</span>
              </>
            ) : (
              <>
                Pemimpin adalah{" "}
                <span style={{ color: orange }}>Pembaca.</span>
              </>
            )}
          </h1>

          <p
            style={{
              fontFamily: CORMORANT,
              fontStyle: "italic",
              fontSize: "clamp(1.05rem, 2.2vw, 1.3rem)",
              color: "oklch(80% 0.04 260)",
              maxWidth: 580,
              marginBottom: "2rem",
              lineHeight: 1.65,
            }}
          >
            {t(
              "You don't have a reading problem. You have an identity question.",
              "Kamu tidak punya masalah membaca. Kamu punya pertanyaan tentang identitas.",
              lang
            )}
          </p>

          {/* Save / dashboard button */}
          {isLoggedIn && (
            <div style={{ marginBottom: "2rem" }}>
              {saved ? (
                <Link
                  href="/dashboard"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontFamily: FONT,
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    color: "oklch(72% 0.14 145)",
                    textDecoration: "none",
                    padding: "12px 0",
                    minHeight: 44,
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 7l3.5 3.5L12 3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {t("Saved to Dashboard", "Tersimpan di Dashboard", lang)}
                </Link>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={isPending}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "12px 28px",
                    background: "transparent",
                    border: `1.5px solid ${orange}`,
                    color: orange,
                    cursor: isPending ? "wait" : "pointer",
                    fontFamily: FONT,
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    borderRadius: 4,
                    minHeight: 44,
                  }}
                >
                  <svg
                    aria-hidden="true"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    style={{ flexShrink: 0 }}
                  >
                    <path
                      d="M7 1v8M4 6l3 3 3-3M2 11h10"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {isPending
                    ? t("Saving…", "Menyimpan…", lang)
                    : t("Save to Dashboard", "Simpan ke Dashboard", lang)}
                </button>
              )}
            </div>
          )}

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TEACHING — MOVEMENT 1: THE LEADER WHO READS
      ══════════════════════════════════════════════════════ */}
      <section
        id="lar-movement-1"
        style={{
          background: offWhite,
          paddingBlock: "clamp(4rem, 7vw, 7rem)",
        }}
      >
        <div className="container-wide" style={{ maxWidth: 760 }}>
          <SectionLabel>
            {t("MOVEMENT 1", "GERAKAN 1", lang)}
          </SectionLabel>
          <SectionH2>
            {t("The Leader Who Reads", "Pemimpin yang Membaca", lang)}
          </SectionH2>

          {lang === "en" ? (
            <>
              <p style={proseSubhead}>You want to read more</p>
              <p style={prose}>
                Most leaders want to read more than they currently do. If you opened this module, you&apos;re probably one of them. Not because you don&apos;t care — you do. It&apos;s just that the day fills up, the book stays on the shelf, and after a while it starts to feel like reading is something other people do.
              </p>
              <p style={prose}>
                There is a more useful way into this. And it does not start with discipline or a longer to-do list.
              </p>
              <p style={proseSubhead}>A better question</p>
              <p style={prose}>
                Most people ask: &ldquo;How do I read more?&rdquo; That is a question about behaviour, and behaviour follows identity.
              </p>
              <p style={prose}>
                The more useful question is: what kind of leader do I want to be? Because if reading is part of the answer to that question, it will happen. If it is only on the to-do list, it will keep getting bumped.
              </p>
              <p style={proseSubhead}>Identity beats willpower every time</p>
              <p style={prose}>
                There is a well-established principle in behavioral science: identity-based habits stick in a way that outcome-based habits don&apos;t.<span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700 }}>¹</span>
              </p>
              <p style={prose}>
                Telling yourself &ldquo;I want to read 20 books this year&rdquo; is fragile. Telling yourself &ldquo;I am the kind of leader who reads&rdquo; is load-bearing. When you are a reader, 15 minutes in the morning with a book is just what you do. It doesn&apos;t require willpower. It is who you are.
              </p>

              {/* Before / After — identity shift */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", margin: "2rem 0" }}>
                <div style={{ background: "white", borderRadius: 8, padding: "1.25rem 1.5rem", border: `1px solid ${lightGray}` }}>
                  <p style={{ fontFamily: FONT, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", color: "oklch(60% 0.008 260)", textTransform: "uppercase" as const, marginBottom: "0.75rem", marginTop: 0 }}>Before</p>
                  <p style={{ fontFamily: CORMORANT, fontStyle: "italic", fontSize: "1rem", color: bodyText, lineHeight: 1.55, margin: 0 }}>&ldquo;I&apos;m the kind of leader who never has time to read.&rdquo;</p>
                </div>
                <div style={{ background: "oklch(97% 0.012 50)", border: "1px solid oklch(82% 0.040 50)", borderRadius: 8, padding: "1.25rem 1.5rem" }}>
                  <p style={{ fontFamily: FONT, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", color: orange, textTransform: "uppercase" as const, marginBottom: "0.75rem", marginTop: 0 }}>After</p>
                  <p style={{ fontFamily: CORMORANT, fontStyle: "italic", fontSize: "1rem", color: bodyText, lineHeight: 1.55, margin: 0 }}>&ldquo;I read because it keeps me teachable, and that changes everything.&rdquo;</p>
                </div>
              </div>

              <PullQuote
                quote="In my whole life, I have known no wise people who didn't read all the time, none, zero."
                attribution="Charlie Munger — Poor Charlie's Almanack, 2005"
              />

              <p style={proseSubhead}>The reader is always a learner</p>
              <p style={{ ...prose, marginBottom: 0 }}>
                The reader, almost by definition, is always a learner. And the learner is a better leader. Not because they know more facts. But because they have practised, repeatedly, the discipline of sitting with someone else&apos;s thinking and letting it work on them. That posture, curious and open and willing to be changed, is the core posture of effective leadership.
              </p>
            </>
          ) : (
            <>
              <p style={proseSubhead}>Kamu ingin membaca lebih banyak</p>
              <p style={prose}>
                Kebanyakan pemimpin ingin membaca lebih banyak dari yang mereka lakukan sekarang. Kalau kamu membuka modul ini, kemungkinan besar kamu salah satunya. Bukan karena kamu tidak peduli — kamu peduli. Tapi hari-hari terasa penuh, buku tetap di rak, dan lama-lama rasanya seperti membaca adalah sesuatu yang dilakukan orang lain.
              </p>
              <p style={prose}>
                Ada cara yang lebih berguna untuk masuk ke dalam ini. Dan itu tidak dimulai dengan disiplin atau daftar tugas yang lebih panjang.
              </p>
              <p style={proseSubhead}>Pertanyaan yang lebih baik</p>
              <p style={prose}>
                Kebanyakan orang bertanya: &ldquo;Bagaimana aku bisa membaca lebih banyak?&rdquo; Itu pertanyaan tentang perilaku, dan perilaku mengikuti identitas.
              </p>
              <p style={prose}>
                Pertanyaan yang lebih berguna adalah: pemimpin seperti apa yang ingin aku jadi? Karena kalau membaca adalah bagian dari jawaban atas pertanyaan itu, itu akan terjadi. Kalau membaca hanya ada di daftar tugas, ia akan terus tergeser.
              </p>
              <p style={proseSubhead}>Identitas mengalahkan kemauan setiap saat</p>
              <p style={prose}>
                Ada prinsip yang sudah lama dikenal dalam ilmu perilaku: kebiasaan yang berbasis identitas bertahan dengan cara yang tidak bisa dilakukan oleh kebiasaan berbasis hasil.<span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700 }}>¹</span>
              </p>
              <p style={prose}>
                Memberi tahu dirimu &ldquo;aku ingin membaca 20 buku tahun ini&rdquo; itu rapuh. Memberi tahu dirimu &ldquo;aku adalah tipe pemimpin yang membaca&rdquo; itu menopang. Ketika kamu adalah seorang pembaca, 15 menit di pagi hari dengan sebuah buku sudah menjadi bagian dari dirimu. Tidak butuh kemauan keras. Itulah siapa kamu.
              </p>

              {/* Before / After — pergeseran identitas */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", margin: "2rem 0" }}>
                <div style={{ background: "white", borderRadius: 8, padding: "1.25rem 1.5rem", border: `1px solid ${lightGray}` }}>
                  <p style={{ fontFamily: FONT, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", color: "oklch(60% 0.008 260)", textTransform: "uppercase" as const, marginBottom: "0.75rem", marginTop: 0 }}>Sebelum</p>
                  <p style={{ fontFamily: CORMORANT, fontStyle: "italic", fontSize: "1rem", color: bodyText, lineHeight: 1.55, margin: 0 }}>&ldquo;Aku adalah tipe pemimpin yang tidak pernah punya waktu untuk membaca.&rdquo;</p>
                </div>
                <div style={{ background: "oklch(97% 0.012 50)", border: "1px solid oklch(82% 0.040 50)", borderRadius: 8, padding: "1.25rem 1.5rem" }}>
                  <p style={{ fontFamily: FONT, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", color: orange, textTransform: "uppercase" as const, marginBottom: "0.75rem", marginTop: 0 }}>Sesudah</p>
                  <p style={{ fontFamily: CORMORANT, fontStyle: "italic", fontSize: "1rem", color: bodyText, lineHeight: 1.55, margin: 0 }}>&ldquo;Aku membaca karena itu membuatku tetap bisa diajar, dan itu mengubah segalanya.&rdquo;</p>
                </div>
              </div>

              <PullQuote
                quote="Sepanjang hidupku, aku tidak pernah mengenal orang bijak yang tidak selalu membaca, tidak ada, nol."
                attribution="Charlie Munger — Poor Charlie's Almanack, 2005"
              />

              <p style={proseSubhead}>Pembaca selalu menjadi pelajar</p>
              <p style={{ ...prose, marginBottom: 0 }}>
                Pembaca, hampir secara definisi, selalu menjadi pelajar. Dan pelajar adalah pemimpin yang lebih baik. Bukan karena mereka mengetahui lebih banyak fakta. Tapi karena mereka sudah berlatih, berulang kali, disiplin duduk dengan pemikiran orang lain dan membiarkannya bekerja pada mereka. Sikap itu, penasaran, terbuka, dan mau diubah, adalah sikap inti dari kepemimpinan yang efektif.
              </p>
            </>
          )}
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          TEACHING — MOVEMENT 2: CROSS-CULTURAL DISCIPLINE
      ══════════════════════════════════════════════════════ */}
      <section
        id="lar-movement-2"
        style={{
          background: "white",
          paddingBlock: "clamp(4rem, 7vw, 7rem)",
        }}
      >
        <div className="container-wide" style={{ maxWidth: 760 }}>
          <SectionLabel>
            {t("MOVEMENT 2", "GERAKAN 2", lang)}
          </SectionLabel>
          <SectionH2>
            {t(
              "Reading as a Cross-Cultural Discipline",
              "Membaca sebagai Disiplin Lintas Budaya",
              lang
            )}
          </SectionH2>

          {lang === "en" ? (
            <>
              <p style={prose}>
                Before we go further, I want to name something directly, because it matters.
              </p>
              <p style={proseSubhead}>Reading honours your tradition</p>
              <p style={prose}>
                Many of the leaders Crispy works with grew up in cultures where wisdom was not primarily transmitted through books. It came through elders. Through proverb and story. Through apprenticeship alongside someone who knew things you didn&apos;t.
              </p>
              <p style={prose}>
                These are not primitive modes of learning. They are deep, sophisticated, and often more holistically formative than private reading. If that is your tradition, honour it. It is part of how God has preserved wisdom across generations.
              </p>
              <p style={proseSubhead}>Your distant mentors are waiting</p>
              <p style={prose}>
                Reading is not the replacement for oral learning. It is an extension of it.
              </p>
              <p style={prose}>
                There are thinkers who lived centuries before you, in countries you will never visit, with things to say to your situation that your local mentors cannot say. Reading is how you access those distant mentors. It is the most democratic form of mentorship available. The book does not care about your status, your language, or your passport. You can sit with Augustine, or Chinua Achebe, or Ada Lum, for the cost of an afternoon.
              </p>
              <p style={proseSubhead}>What you read shapes how you lead</p>
              <p style={prose}>
                Most widely available leadership books were written by North American or European authors, for North American or European contexts. That is just publishing economics. But if you read only what is most available, you will absorb a particular cultural framework for leadership without noticing it.
              </p>
              <p style={prose}>
                Cross-cultural leaders need to read diversely, deliberately. Seek out writers from your own cultural tradition. Seek out writers from the majority world. Notice whose voice you have not yet heard.
              </p>
              <p style={proseSubhead}>Reading builds empathy — and research proves it</p>
              <p style={prose}>
                Literary fiction has been shown in peer-reviewed research to measurably improve the capacity to understand what is happening inside other people&apos;s minds. Researchers Emanuele Castano and David Kidd found evidence that reading literary fiction can improve performance on validated tests of empathy and perspective-taking — a finding that has generated substantial scholarly discussion and further research.<span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700 }}>²</span>
              </p>
              <p style={{ ...prose, marginBottom: 0 }}>
                The reason? Literary fiction forces you to practise exactly what cross-cultural work demands: holding uncertainty, making inferences about people who are not like you, and staying curious rather than closing down. If you want to be better at reading rooms and reading people, one of the best tools is reading books.
              </p>

              <PullQuote
                quote="Until the lions have their own historians, the history of the hunt will always glorify the hunter."
                attribution="Chinua Achebe — The Paris Review, 1994"
              />
            </>
          ) : (
            <>
              <p style={prose}>
                Sebelum kita melanjutkan, aku ingin menamai sesuatu secara langsung, karena ini penting.
              </p>
              <p style={proseSubhead}>Membaca menghormati tradisimu</p>
              <p style={prose}>
                Banyak pemimpin yang belajar bersama Crispy tumbuh di dalam budaya di mana kebijaksanaan tidak terutama disampaikan melalui buku. Ia datang melalui para sesepuh. Melalui pepatah dan cerita. Melalui proses magang di sisi seseorang yang tahu hal-hal yang kamu belum tahu.
              </p>
              <p style={prose}>
                Ini bukan cara belajar yang primitif. Ini adalah cara yang dalam, canggih, dan sering kali lebih utuh secara formatif daripada membaca sendirian. Kalau itu adalah tradisimu, hormatilah. Itu adalah bagian dari cara Tuhan melestarikan kebijaksanaan lintas generasi.
              </p>
              <p style={proseSubhead}>Mentor jauhmu sedang menunggumu</p>
              <p style={prose}>
                Membaca bukan pengganti pembelajaran lisan. Ini adalah perluasannya.
              </p>
              <p style={prose}>
                Ada pemikir yang hidup berabad-abad sebelummu, di negara yang tidak akan pernah kamu kunjungi, dengan sesuatu untuk dikatakan kepada situasimu yang tidak bisa dikatakan oleh mentor lokalmu. Membaca adalah cara kamu mengakses para mentor yang jauh itu. Ini adalah bentuk pendampingan yang paling demokratis yang tersedia. Buku tidak peduli tentang statusmu, bahasamu, atau paspormu. Kamu bisa duduk bersama Agustinus, atau Chinua Achebe, atau Ada Lum, hanya dengan biaya satu sore hari.
              </p>
              <p style={proseSubhead}>Apa yang kamu baca membentuk cara kamu memimpin</p>
              <p style={prose}>
                Sebagian besar buku kepemimpinan yang tersedia secara luas ditulis oleh penulis Amerika Utara atau Eropa, untuk konteks Amerika Utara atau Eropa. Itu hanya soal ekonomi penerbitan. Tapi kalau kamu hanya membaca apa yang paling mudah didapat, kamu akan menyerap kerangka budaya tertentu untuk kepemimpinan tanpa menyadarinya.
              </p>
              <p style={prose}>
                Pemimpin lintas budaya perlu membaca secara beragam, dengan disengaja. Carilah penulis dari tradisi budayamu sendiri. Carilah penulis dari dunia mayoritas. Perhatikan suara siapa yang belum pernah kamu dengar.
              </p>
              <p style={proseSubhead}>Membaca membangun empati — dan riset membuktikannya</p>
              <p style={prose}>
                Fiksi sastra telah terbukti dalam penelitian yang ditinjau sejawat secara terukur meningkatkan kapasitas untuk memahami apa yang terjadi di dalam pikiran orang lain. Para peneliti Emanuele Castano dan David Kidd menemukan bukti bahwa membaca fiksi sastra dapat meningkatkan kinerja pada tes empati dan pengambilan perspektif yang tervalidasi — sebuah temuan yang telah menghasilkan diskusi ilmiah yang substansial dan penelitian lebih lanjut.<span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700 }}>²</span>
              </p>
              <p style={{ ...prose, marginBottom: 0 }}>
                Alasannya? Fiksi sastra memaksamu untuk melatih persis apa yang dituntut oleh pekerjaan lintas budaya: memegang ketidakpastian, membuat kesimpulan tentang orang yang tidak sepertimu, dan tetap penasaran daripada menutup diri. Kalau kamu ingin lebih baik dalam membaca situasi dan membaca orang, salah satu alat terbaik adalah membaca buku.
              </p>

              <PullQuote
                quote="Sampai para singa memiliki sejarawan mereka sendiri, sejarah perburuan akan selalu memuliakan pemburu."
                attribution="Chinua Achebe — The Paris Review, 1994"
              />
            </>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TEACHING — MOVEMENT 3: BUILDING THE HABIT
      ══════════════════════════════════════════════════════ */}
      <section
        id="lar-movement-3"
        style={{
          background: navy,
          paddingBlock: "clamp(4rem, 7vw, 7rem)",
        }}
      >
        <div className="container-wide" style={{ maxWidth: 860 }}>
          <SectionLabel>
            {t("MOVEMENT 3", "GERAKAN 3", lang)}
          </SectionLabel>
          <SectionH2 dark>
            {t("Building the Habit", "Membangun Kebiasaan", lang)}
          </SectionH2>

          <p style={{ ...proseDark, maxWidth: 640, marginBottom: "3rem" }}>
            {t(
              "The identity shift is real. But it has to land somewhere practical. These four steps are where most leaders find traction.",
              "Pergeseran identitas itu nyata. Tapi harus mendarat di suatu tempat yang praktis. Empat langkah ini adalah tempat sebagian besar pemimpin menemukan momentum.",
              lang
            )}
          </p>

          {/* Step cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.25rem",
              marginBottom: "3rem",
            }}
          >
            {/* Step 1 */}
            <div
              style={{
                background: "oklch(26% 0.09 260)",
                borderRadius: 8,
                padding: "1.75rem",
                borderTop: `3px solid ${orange}`,
              }}
            >
              <div style={{ marginBottom: "1rem" }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <circle cx="16" cy="16" r="14" stroke={orange} strokeWidth="1.5"/>
                  <path d="M16 10v6l4 2" stroke={orange} strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <p style={{ fontFamily: FONT, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", color: orange, textTransform: "uppercase" as const, marginBottom: "0.5rem", marginTop: 0 }}>
                {t("Step 1", "Langkah 1", lang)}
              </p>
              <p style={{ fontFamily: CORMORANT, fontSize: "1.3rem", fontWeight: 600, color: offWhite, marginBottom: "0.75rem", marginTop: 0, lineHeight: 1.2 }}>
                {t("Start Embarrassingly Small", "Mulailah dari yang Sangat Kecil", lang)}
              </p>
              <p style={{ fontFamily: FONT, fontSize: "0.875rem", color: "oklch(75% 0.04 260)", lineHeight: 1.7, margin: 0 }}>
                {t(
                  "Ten minutes a day beats two hours once a month. Frequency builds the identity. Duration follows later.",
                  "Sepuluh menit sehari mengalahkan dua jam sekali sebulan. Frekuensilah yang membangun identitas. Durasinya mengikuti kemudian.",
                  lang
                )}
              </p>
            </div>

            {/* Step 2 */}
            <div
              style={{
                background: "oklch(26% 0.09 260)",
                borderRadius: 8,
                padding: "1.75rem",
                borderTop: `3px solid ${orange}`,
              }}
            >
              <div style={{ marginBottom: "1rem" }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <rect x="4" y="6" width="24" height="20" rx="2" stroke={orange} strokeWidth="1.5"/>
                  <path d="M4 12h24" stroke={orange} strokeWidth="1.5"/>
                  <path d="M10 18h4M10 22h8" stroke={orange} strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <p style={{ fontFamily: FONT, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", color: orange, textTransform: "uppercase" as const, marginBottom: "0.5rem", marginTop: 0 }}>
                {t("Step 2", "Langkah 2", lang)}
              </p>
              <p style={{ fontFamily: CORMORANT, fontSize: "1.3rem", fontWeight: 600, color: offWhite, marginBottom: "0.75rem", marginTop: 0, lineHeight: 1.2 }}>
                {t("Guard the Time", "Jaga Waktunya", lang)}
              </p>
              <p style={{ fontFamily: FONT, fontSize: "0.875rem", color: "oklch(75% 0.04 260)", lineHeight: 1.7, margin: 0 }}>
                {t(
                  "Leaders who read 'when they have time' never read. Put it in your calendar like you would a meeting.",
                  "Pemimpin yang membaca 'kalau ada waktu' tidak pernah membaca. Masukkan ke kalender seperti jadwal pertemuan.",
                  lang
                )}
              </p>
            </div>

            {/* Step 3 */}
            <div
              style={{
                background: "oklch(26% 0.09 260)",
                borderRadius: 8,
                padding: "1.75rem",
                borderTop: `3px solid ${orange}`,
              }}
            >
              <div style={{ marginBottom: "1rem" }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <path d="M6 8h14a2 2 0 010 4H6V8z" stroke={orange} strokeWidth="1.5"/>
                  <path d="M6 12v12l4-3 4 3 4-3 4 3V8" stroke={orange} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p style={{ fontFamily: FONT, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", color: orange, textTransform: "uppercase" as const, marginBottom: "0.5rem", marginTop: 0 }}>
                {t("Step 3", "Langkah 3", lang)}
              </p>
              <p style={{ fontFamily: CORMORANT, fontSize: "1.3rem", fontWeight: 600, color: offWhite, marginBottom: "0.75rem", marginTop: 0, lineHeight: 1.2 }}>
                {t("Drop the Guilt Book", "Tinggalkan Buku Rasa Bersalah", lang)}
              </p>
              <p style={{ fontFamily: FONT, fontSize: "0.875rem", color: "oklch(75% 0.04 260)", lineHeight: 1.7, margin: 0 }}>
                {t(
                  "You don't have to finish every book. Read what feeds you now. Set aside what doesn't. The goal is formation, not completion.",
                  "Kamu tidak harus menyelesaikan setiap buku. Bacalah yang memberimu makan sekarang. Sisihkan yang tidak. Tujuannya adalah pembentukan, bukan penyelesaian.",
                  lang
                )}
              </p>
            </div>

            {/* Step 4 */}
            <div
              style={{
                background: "oklch(26% 0.09 260)",
                borderRadius: 8,
                padding: "1.75rem",
                borderTop: `3px solid ${orange}`,
              }}
            >
              <div style={{ marginBottom: "1rem" }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <circle cx="16" cy="16" r="12" stroke={orange} strokeWidth="1.5"/>
                  <path d="M10 16c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6" stroke={orange} strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="16" cy="16" r="2" fill={orange}/>
                </svg>
              </div>
              <p style={{ fontFamily: FONT, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", color: orange, textTransform: "uppercase" as const, marginBottom: "0.5rem", marginTop: 0 }}>
                {t("Step 4", "Langkah 4", lang)}
              </p>
              <p style={{ fontFamily: CORMORANT, fontSize: "1.3rem", fontWeight: 600, color: offWhite, marginBottom: "0.75rem", marginTop: 0, lineHeight: 1.2 }}>
                {t("Notice the Pattern", "Perhatikan Polanya", lang)}
              </p>
              <p style={{ fontFamily: FONT, fontSize: "0.875rem", color: "oklch(75% 0.04 260)", lineHeight: 1.7, margin: 0 }}>
                {t(
                  "Who are you reading? Check your last five books. If every voice comes from the same tradition, that's worth noticing.",
                  "Siapa yang kamu baca? Periksa lima buku terakhirmu. Kalau setiap suara berasal dari tradisi yang sama, itu layak diperhatikan.",
                  lang
                )}
              </p>
            </div>
          </div>

          {/* Try this */}
          <div
            style={{
              background: "oklch(26% 0.09 260)",
              borderTop: `2px solid ${orange}`,
              borderRadius: 4,
              padding: "1.25rem 1.5rem",
              maxWidth: 640,
            }}
          >
            <p style={{ fontFamily: FONT, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", color: orange, textTransform: "uppercase" as const, marginBottom: "0.5rem", marginTop: 0 }}>
              {t("Try this week", "Coba minggu ini", lang)}
            </p>
            <p style={{ fontFamily: FONT, fontSize: "0.9rem", color: offWhite, lineHeight: 1.7, margin: 0 }}>
              {t(
                "Pick one book you've been meaning to read. Not the one you think you should read — the one you actually want to read. Block 10 minutes tomorrow morning and start.",
                "Pilih satu buku yang sudah lama ingin kamu baca. Bukan yang kamu pikir harus dibaca — tapi yang benar-benar ingin kamu baca. Blokir 10 menit besok pagi dan mulailah.",
                lang
              )}
            </p>
          </div>

          <PullQuote
            quote={t(
              "Some books are to be tasted, others to be swallowed, and some few to be chewed and digested.",
              "Beberapa buku hanya perlu dicicipi, yang lain perlu ditelan, dan sebagian kecil perlu dikunyah dan dicerna.",
              lang
            )}
            attribution={t("Francis Bacon — Of Studies, 1625", "Francis Bacon — Of Studies, 1625", lang)}
            dark
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          BOOK LIBRARY
      ══════════════════════════════════════════════════════ */}
      <section
        id="lar-book-library"
        style={{
          background: offWhite,
          paddingBlock: "clamp(4rem, 7vw, 7rem)",
        }}
      >
        <div className="container-wide">
          <SectionLabel>
            {t("RECOMMENDED READING", "BACAAN YANG DIREKOMENDASIKAN", lang)}
          </SectionLabel>
          <SectionH2>
            {t(
              "Great Books to Start Your Reading Habit",
              "Buku-Buku Pilihan untuk Memulai Kebiasaan Membacamu",
              lang
            )}
          </SectionH2>

          <PullQuote
            quote={t(
              "You must linger among a limited number of master-thinkers, and digest their works, if you would derive ideas which shall win firm hold in your mind.",
              "Kamu harus berlama-lama bersama sejumlah kecil pemikir terbaik, dan mencerna karya-karya mereka, jika ingin mendapatkan gagasan yang benar-benar tertanam dalam pikiranmu.",
              lang
            )}
            attribution="Seneca — Letters to Lucilius, c. 65 AD"
          />

          {/* Category filter tabs */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap" as const,
              marginTop: "1.75rem",
              marginBottom: "0.25rem",
            }}
          >
            {(
              [
                { key: "all", en: "All", id: "Semua" },
                { key: "faith", en: "Faith", id: "Iman" },
                { key: "leadership", en: "Leadership", id: "Kepemimpinan" },
                { key: "cross-cultural", en: "Cross-Cultural", id: "Lintas Budaya" },
                { key: "habit", en: "Habit", id: "Kebiasaan" },
              ] as { key: BookCategory | "all"; en: string; id: string }[]
            ).map(({ key, en, id }) => {
              const active = bookCategoryFilter === key;
              return (
                <button
                  key={key}
                  onClick={() => { setBookCategoryFilter(key); window.gtag?.("event", "book_category_filter", { category: key }); }}
                  style={{
                    fontFamily: FONT,
                    fontSize: "0.72rem",
                    fontWeight: active ? 700 : 500,
                    letterSpacing: "0.04em",
                    padding: "0.4rem 0.9rem",
                    borderRadius: 20,
                    border: `1.5px solid ${active ? navy : lightGray}`,
                    background: active ? navy : "white",
                    color: active ? "white" : bodyText,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    minHeight: 44,
                  }}
                >
                  {lang === "en" ? en : id}
                </button>
              );
            })}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "1.25rem",
              marginTop: "1.5rem",
            }}
          >
            {BOOKS.filter(
              (b) => bookCategoryFilter === "all" || b.category === bookCategoryFilter
            ).map((book) => {
              const isLive = book.category !== "coming-soon";
              return (
                <div
                  key={book.id}
                  onClick={() => { if (isLive) { setSelectedBook(book); window.gtag?.("event", "book_detail_viewed", { book_id: book.id, book_title: book.title, book_category: book.category }); } }}
                  role={isLive ? "button" : undefined}
                  tabIndex={isLive ? 0 : undefined}
                  aria-label={isLive ? t(`Open details for ${book.title} by ${book.author}`, `Buka detail ${book.titleId} karya ${book.author}`, lang) : undefined}
                  onKeyDown={(e) => {
                    if (!isLive) return;
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedBook(book);
                    }
                  }}
                  style={{
                    background: isLive ? "white" : "oklch(93% 0.005 260)",
                    borderRadius: 8,
                    overflow: "hidden",
                    border: `1px solid ${lightGray}`,
                    cursor: isLive ? "pointer" : "default",
                    transition: isLive
                      ? "box-shadow 0.2s ease, transform 0.2s ease"
                      : undefined,
                    display: "flex",
                    flexDirection: "column" as const,
                  }}
                  onMouseEnter={(e) => {
                    if (!isLive) return;
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 8px 24px rgba(0,0,0,0.12)";
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isLive) return;
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "none";
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(0)";
                  }}
                >
                  {isLive ? (
                    <>
                      <div
                        style={{
                          aspectRatio: "2/3",
                          overflow: "hidden",
                          background: lightGray,
                        }}
                      >
                        <img
                          src={book.coverUrl}
                          alt={`${lang === "en" ? book.title : book.titleId} cover`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </div>
                      <div style={{ padding: "0.75rem" }}>
                        <p
                          style={{
                            fontFamily: FONT,
                            fontWeight: 700,
                            fontSize: "0.8rem",
                            color: navy,
                            margin: 0,
                            lineHeight: 1.3,
                            marginBottom: "0.25rem",
                          }}
                        >
                          {lang === "en" ? book.title : book.titleId}
                        </p>
                        <p
                          style={{
                            fontFamily: FONT,
                            fontSize: "0.72rem",
                            color: "oklch(55% 0.008 260)",
                            margin: 0,
                          }}
                        >
                          {book.author}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div
                      style={{
                        aspectRatio: "2/3",
                        display: "flex",
                        flexDirection: "column" as const,
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "1rem",
                        gap: "0.75rem",
                        textAlign: "center" as const,
                      }}
                    >
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M4 19.5A2.5 2.5 0 016.5 17H20"
                          stroke="oklch(70% 0.008 260)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
                          stroke="oklch(70% 0.008 260)"
                          strokeWidth="1.5"
                        />
                      </svg>
                      <p
                        style={{
                          fontFamily: FONT,
                          fontSize: "0.72rem",
                          color: "oklch(60% 0.008 260)",
                          margin: 0,
                          lineHeight: 1.4,
                        }}
                      >
                        {t(
                          "More recommendations coming",
                          "Rekomendasi lainnya segera hadir",
                          lang
                        )}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Book modal */}
      {selectedBook && (
        <BookModal
          book={selectedBook}
          lang={lang}
          onClose={() => setSelectedBook(null)}
        />
      )}

      {/* ══════════════════════════════════════════════════════
          REFLECTION QUESTIONS
      ══════════════════════════════════════════════════════ */}
      <section
        id="lar-reflection"
        style={{
          background: "white",
          paddingBlock: "clamp(4rem, 7vw, 7rem)",
        }}
      >
        <div className="container-wide">
          <SectionLabel>
            {t("REFLECTION QUESTIONS", "PERTANYAAN REFLEKSI", lang)}
          </SectionLabel>
          <SectionH2>
            {t("Sit with these.", "Renungkan pertanyaan-pertanyaan ini.", lang)}
          </SectionH2>

          <div
            style={{
              display: "flex",
              flexDirection: "column" as const,
              gap: "1px",
              background: lightGray,
              maxWidth: 760,
            }}
          >
            {[
              {
                en: "When did a book last genuinely change how you lead? What shifted in you, not just what you learned?",
                id: "Kapan terakhir kali sebuah buku benar-benar mengubah cara kamu memimpin? Apa yang bergeser dalam dirimu, bukan hanya apa yang kamu pelajari?",
              },
              {
                en: "Whose voices are missing from your reading list? Think about cultural background, geography, gender, tradition. What would it mean to include them?",
                id: "Suara siapa yang hilang dari daftar bacaanmu? Pikirkan tentang latar belakang budaya, geografi, gender, tradisi. Apa artinya memasukkan mereka?",
              },
              {
                en: "What does your current reading say about your posture toward learning? Are you feeding the leader you are becoming, or staying comfortable with what you already know?",
                id: "Apa yang bacaanmu saat ini katakan tentang sikapmu terhadap pembelajaran? Apakah kamu sedang memberi makan pemimpin yang sedang kamu jadikan, atau tetap nyaman dengan apa yang sudah kamu ketahui?",
              },
            ].map((q, i) => (
              <div
                key={i}
                style={{
                  background: "white",
                  padding: "1.75rem 2rem",
                  display: "flex",
                  gap: "1.5rem",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    fontFamily: CORMORANT,
                    fontWeight: 600,
                    fontSize: "2rem",
                    color: orange,
                    lineHeight: 1,
                    flexShrink: 0,
                    paddingTop: "0.05rem",
                  }}
                >
                  {i + 1}
                </span>
                <p
                  style={{
                    fontFamily: CORMORANT,
                    fontStyle: "italic",
                    fontSize: "clamp(1rem, 2vw, 1.2rem)",
                    color: navy,
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {t(q.en, q.id, lang)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FAITH ANCHOR
      ══════════════════════════════════════════════════════ */}
      <section
        id="lar-faith-anchor"
        style={{
          background: navy,
          paddingBlock: "clamp(4rem, 7vw, 7rem)",
        }}
      >
        <div className="container-wide" style={{ maxWidth: 760 }}>
          <SectionLabel>
            {t("FAITH ANCHOR", "JANGKAR IMAN", lang)}
          </SectionLabel>

          <blockquote
            style={{
              borderLeft: `3px solid ${orange}`,
              paddingLeft: "1.5rem",
              marginBottom: "2.5rem",
              marginLeft: 0,
            }}
          >
            <p
              style={{
                fontFamily: CORMORANT,
                fontStyle: "italic",
                fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
                color: offWhite,
                lineHeight: 1.55,
                margin: 0,
                marginBottom: "0.75rem",
              }}
            >
              &ldquo;
              {t(
                "Let the wise listen and add to their learning.",
                "Biarlah orang yang bijak mendengar dan menambah ilmu.",
                lang
              )}
              &rdquo;
            </p>
            <cite
              style={{
                display: "block",
                fontFamily: FONT,
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: orange,
                textTransform: "uppercase" as const,
                fontStyle: "normal",
              }}
            >
              {t("Proverbs 1:5", "Amsal 1:5", lang)}
            </cite>
          </blockquote>

          {lang === "en" ? (
            <>
              <p style={proseSubhead}>Wesley&apos;s instruction</p>
              <p style={proseDark}>
                In 1760, John Wesley wrote a letter to a young minister. The letter was brief and its instruction was direct: &ldquo;Whether you like it or no, read and pray daily. It is for your life.&rdquo;
              </p>
              <p style={proseDark}>
                What strikes me about that sentence is that Wesley named the resistance first. He did not assume the minister would be delighted to hear this. He assumed the minister would find it inconvenient, or uncomfortable, or irrelevant. And he said it anyway, with pastoral weight.
              </p>
              <p style={proseSubhead}>Still true today</p>
              <p style={proseDark}>
                Wesley was writing to a field worker in the 18th century, but he could be writing to you now. The resistance has not changed. The pace of life that crowds out reading is the same resistance, just with a different shape.
              </p>
              <p style={proseDark}>
                A leader who stops learning, who fills every quiet moment with noise, who relies only on what they already know, is a leader who is slowly stopping. Wesley was not recommending a self-improvement program. He was saying: this is survival for the leader who wants to keep growing.
              </p>
              <p style={proseSubhead}>Not mastery. Just continued posture.</p>
              <p style={proseDark}>
                Proverbs 1:5 is direct: &ldquo;Let the wise listen and add to their learning.&rdquo; The wise person is not the one who has finished learning. The wise person is the one who has not stopped.
              </p>
              <p style={proseDark}>
                That is the calling this module is pointing toward. Not an impressive reading list. Just the continued posture of someone who knows there is more to know, and who is willing to sit with someone else&apos;s thinking long enough for it to change something.
              </p>

              <PullQuote
                quote="From that moment, I understood the pathway from slavery to freedom. Knowledge unfits a child to be a slave."
                attribution="Frederick Douglass — Narrative of the Life of Frederick Douglass, 1845"
                dark
              />

              <p style={{ ...proseDark, marginBottom: 0, fontStyle: "italic" }}>
                Who are the mentors on your shelf that you haven&apos;t met yet?
              </p>
            </>
          ) : (
            <>
              <p style={proseSubhead}>Instruksi Wesley</p>
              <p style={proseDark}>
                Pada tahun 1760, John Wesley menulis surat kepada seorang pendeta muda. Suratnya singkat dan instruksinya langsung: &ldquo;Suka atau tidak suka, bacalah dan berdoalah setiap hari. Itu demi hidupmu.&rdquo;
              </p>
              <p style={proseDark}>
                Yang menarik bagiku dari kalimat itu adalah Wesley menamai perlawanannya terlebih dahulu. Ia tidak mengasumsikan sang pendeta akan senang mendengar ini. Ia mengasumsikan sang pendeta akan merasa ini merepotkan, atau tidak nyaman, atau tidak relevan. Dan ia mengatakannya juga, dengan bobot pastoral.
              </p>
              <p style={proseSubhead}>Masih berlaku hari ini</p>
              <p style={proseDark}>
                Wesley menulis kepada seorang pekerja lapangan di abad ke-18, tapi ia bisa saja menulis kepadamu sekarang. Perlawanannya belum berubah. Laju kehidupan yang menyisihkan waktu membaca adalah perlawanan yang sama, hanya dengan bentuk yang berbeda.
              </p>
              <p style={proseDark}>
                Pemimpin yang berhenti belajar, yang mengisi setiap momen tenang dengan kebisingan, yang hanya mengandalkan apa yang sudah mereka ketahui, adalah pemimpin yang perlahan-lahan berhenti. Wesley tidak merekomendasikan program pengembangan diri. Ia berkata: ini adalah kelangsungan hidup bagi pemimpin yang ingin terus bertumbuh.
              </p>
              <p style={proseSubhead}>Bukan penguasaan. Hanya sikap yang terus-menerus.</p>
              <p style={proseDark}>
                Amsal 1:5 langsung: &ldquo;Biarlah orang yang bijak mendengar dan menambah ilmu.&rdquo; Orang bijak bukan orang yang sudah selesai belajar. Orang bijak adalah orang yang tidak berhenti.
              </p>
              <p style={proseDark}>
                Itulah panggilan yang ditunjukkan modul ini. Bukan daftar bacaan yang mengesankan. Hanya sikap yang terus-menerus dari seseorang yang tahu masih ada lebih banyak lagi yang perlu diketahui, dan yang bersedia duduk dengan pemikiran orang lain cukup lama sampai sesuatu berubah.
              </p>

              <PullQuote
                quote="Sejak saat itu, aku memahami jalan dari perbudakan menuju kebebasan. Pengetahuan tidak layak bagi seorang hamba."
                attribution="Frederick Douglass — Narrative of the Life of Frederick Douglass, 1845"
                dark
              />

              <p style={{ ...proseDark, marginBottom: 0, fontStyle: "italic" }}>
                Siapa saja mentor di rakmu yang belum pernah kamu temui?
              </p>
            </>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          KEY TAKEAWAY
      ══════════════════════════════════════════════════════ */}
      <section
        id="lar-takeaway"
        style={{
          background: "oklch(94% 0.008 80)",
          paddingBlock: "clamp(4rem, 7vw, 7rem)",
        }}
      >
        <div className="container-wide" style={{ maxWidth: 760 }}>
          <SectionLabel>
            {t("KEY TAKEAWAY", "POIN UTAMA", lang)}
          </SectionLabel>
          <SectionH2>
            {t(
              "This week, take one of these steps:",
              "Minggu ini, ambillah salah satu langkah ini:",
              lang
            )}
          </SectionH2>

          <div
            style={{ display: "flex", flexDirection: "column" as const, gap: "1.5rem" }}
          >
            {[
              {
                en: "Write one sentence: \"I am a leader who reads because...\" Complete it honestly. This is your identity statement. Put it somewhere you will see it.",
                id: "Tulislah satu kalimat: \"Aku adalah seorang pemimpin yang membaca karena...\" Selesaikan dengan jujur. Ini adalah pernyataan identitasmu. Taruh di tempat yang akan kamu lihat.",
              },
              {
                en: "Name one book you have been meaning to read. Not the one you think you should read. The one you actually want to read. Start it this week, even just 10 pages.",
                id: "Sebutkan satu buku yang sudah lama ingin kamu baca. Bukan yang kamu pikir harus kamu baca. Yang benar-benar ingin kamu baca. Mulailah minggu ini, bahkan hanya 10 halaman saja.",
              },
              {
                en: "Name one author or thinker from a different cultural background than your own. Find something they have written. It does not have to be long. Start there.",
                id: "Sebutkan satu penulis atau pemikir dari latar belakang budaya yang berbeda dari milikmu. Temukan sesuatu yang mereka tulis. Tidak harus panjang. Mulailah dari sana.",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  alignItems: "flex-start",
                  background: "white",
                  borderRadius: 8,
                  padding: "1.5rem 1.75rem",
                  border: `1px solid ${lightGray}`,
                }}
              >
                <span
                  style={{
                    fontFamily: CORMORANT,
                    fontWeight: 600,
                    fontSize: "2rem",
                    color: orange,
                    lineHeight: 1,
                    flexShrink: 0,
                    paddingTop: "0.05rem",
                  }}
                >
                  {i + 1}
                </span>
                <p style={{ ...prose, margin: 0 }}>
                  {t(item.en, item.id, lang)}
                </p>
              </div>
            ))}
          </div>

          <PullQuote
            quote={t(
              "Reading a book should be a conversation between you and the author. Presumably he knows more about the subject than you do; if not, you probably should not be bothering with his book.",
              "Membaca sebuah buku seharusnya menjadi percakapan antara kamu dan penulisnya. Dia diasumsikan tahu lebih banyak tentang topik itu daripada kamu; jika tidak, kamu mungkin tidak perlu repot-repot membaca bukunya.",
              lang
            )}
            attribution="Mortimer Adler — How to Read a Book"
          />

          {/* Dashboard CTA at bottom */}
          <div
            style={{
              marginTop: "3rem",
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap" as const,
            }}
          >
            {!isLoggedIn ? (
              <Link href="/membership" className="btn-primary">
                {t("Join the Community", "Bergabung", lang)}
              </Link>
            ) : saved ? (
              <Link href="/dashboard" className="btn-primary">
                {t("Go to Dashboard", "Ke Dashboard", lang)}
              </Link>
            ) : (
              <button
                onClick={handleSave}
                disabled={isPending}
                className="btn-primary"
                style={{
                  border: "none",
                  cursor: isPending ? "wait" : "pointer",
                }}
              >
                {isPending
                  ? t("Saving…", "Menyimpan…", lang)
                  : t("Save to Dashboard", "Simpan ke Dashboard", lang)}
              </button>
            )}
            <Link href="/resources" className="btn-outline-navy">
              {t("Browse the Library", "Jelajahi Perpustakaan", lang)}
            </Link>
          </div>
        </div>
      </section>

      {/* ── SOURCES ──────────────────────────────────────────────────────────── */}
      <SourcesDropdown
        lang={lang}
        sources={[
          "James Clear — Atomic Habits (Avery, 2018). Chapter 2: How Your Habits Shape Your Identity (and Vice Versa).",
          "Kidd, D.C. & Castano, E. — \"Reading Literary Fiction Improves Theory of Mind\" (Science, 342:6156, 377–380, 2013). https://doi.org/10.1126/science.1239918",
        ]}
      />

      {/* ── LONG-FORM SEO SECTION ────────────────────────────────────────────── */}
      <section style={{ background: "oklch(95% 0.008 80)", paddingBlock: "clamp(3rem, 5vw, 5rem)" }}>
        <div className="container-wide" style={{ maxWidth: 760 }}>
          <SectionLabel>Background</SectionLabel>
          <SectionH2>The Case for Reading as a Leadership Practice</SectionH2>
          <button
            onClick={() => setBgOpen(!bgOpen)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              marginTop: 20, marginBottom: 24, padding: "10px 20px",
              background: "transparent", border: "1.5px solid oklch(65% 0.15 45)",
              color: "oklch(65% 0.15 45)", borderRadius: 12,
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: "0.04em",
            }}
          >
            {bgOpen ? "Close ↑" : lang === "id" ? "Baca penelitiannya →" : "Read the research →"}
          </button>
          {bgOpen && (
            <div style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 16, lineHeight: 1.85, color: "oklch(38% 0.05 260)" }}>
              <p style={{ marginBottom: "1.5rem" }}>
                Most cross-cultural leaders are not short on desire; they are short on time. The to-do list is real: language study, team meetings, relationship building, pastoral care, logistical demands that never quite end. Against that backdrop, sitting down with a book can feel indulgent, even irresponsible. There is always something more urgent. And so the book gets moved to the nightstand, the nightstand becomes a holding area, and somewhere along the way the reading habit quietly disappears. This is not a character failure. It is a predictable outcome of a high-demand life. But it is worth pausing to ask what gets lost when it happens.
              </p>
              <p style={{ marginBottom: "1.5rem" }}>
                The evidence connecting sustained reading to leadership effectiveness is not overwhelming in volume, but it is consistent in direction. Studies on high-performing leaders suggest that regular reading correlates with stronger analytical thinking, clearer communication, and a greater capacity to understand how other people think and feel. A 2013 series of experiments by researchers Emanuele Castano and David Kidd at the New School for Social Research explored whether reading literary fiction improved what psychologists call &ldquo;theory of mind&rdquo; (the ability to accurately infer what another person is thinking or feeling). The initial findings attracted significant interest and subsequent scrutiny, with replication studies producing more varied results, so any strong causal claim should be held loosely. What the conversation points to, though, is a plausible and intuitively credible link: spending concentrated time inhabiting another consciousness on the page does something to how we engage with other people. For leaders whose work depends precisely on that ability, that is worth taking seriously.
              </p>
              <p style={{ marginBottom: "1.5rem" }}>
                Robert Clinton&apos;s decades of research into how Christian leaders finish well adds a different kind of evidence. Clinton found that the leaders who remained fruitful and faithful to the end shared certain patterns. One of those patterns was a commitment to lifelong learning; not formal education necessarily, but a sustained posture of receiving input from outside themselves. The leaders who stopped learning, who relied on what they already knew, who led from accumulated capital rather than ongoing formation, were the ones most likely to narrow, drift, or plateau. Reading is not the only form that learning takes, but it is one of the most accessible and most portable ones available. James Clear&apos;s framework from Atomic Habits is useful here not for its mechanics but for its diagnosis: the problem with most reading habits is not motivation, it is identity. People who read consistently have come to see themselves as the kind of person who reads. The shift from &ldquo;I should read more&rdquo; to &ldquo;I am the kind of leader who reads&rdquo; is not trivial; it changes what feels natural. Developing a{" "}<a href="/resources/fixed-growth-mindset" style={{ color: "oklch(65% 0.15 45)", fontWeight: 600 }}>Fixed vs Growth Mindset</a>{" "}is foundational to this shift, because the leader who believes their capacity can grow is the one who keeps investing in it.
              </p>
              <p style={{ marginBottom: "1.5rem" }}>
                For cross-cultural workers specifically, reading carries a particular weight. The daily reality of operating across cultural distance is that your instincts are often wrong. The assumptions you formed growing up, about how meetings work, how decisions get made, what silence means, how disagreement is expressed, what counts as respect, do not automatically transfer. Experience teaches some of this, mentors teach some of it, and community teaches some of it. But books offer something the other channels cannot: concentrated access to voices you would never otherwise encounter. A leader working in Southeast Asia who reads theology written by Indonesian scholars, or fiction by Kenyan novelists, or history by Latin American historians, is building a kind of cognitive breadth that makes them less likely to misread the room and more likely to ask the right questions. This is the heart of what{" "}<a href="/resources/cultural-intelligence" style={{ color: "oklch(65% 0.15 45)", fontWeight: 600 }}>Cultural Intelligence (CQ)</a>{" "}actually looks like in practice: not a score on an assessment, but a posture of genuine curiosity about how other people see the world, sustained over years.
              </p>
              <p style={{ marginBottom: "1.5rem" }}>
                There is a tension worth naming honestly here, because it matters for this audience. In many cultures across the Global South, knowledge has always traveled through story, song, proverb, and mentorship rather than through private written texts. Oral tradition is not a lesser form of learning; it is ancient, sophisticated, and still very much alive in communities where some of your most effective leaders have been formed. A leader who comes from that tradition and is now being encouraged to build a reading habit may find the practice feels foreign, even mildly isolating. That feeling deserves respect, not dismissal. But books offer something oral tradition cannot easily replicate: access to mentors you can never meet in person, from centuries and continents you could never visit. Wesley in the eighteenth century. Keller in the twenty-first. An African theologian writing for Langham Literature. A novelist from the culture you serve in, writing from the inside. Reading is not a replacement for relational formation; it is an extension of it.
              </p>
              <p style={{ marginBottom: "1.5rem" }}>
                The Christian intellectual tradition has never been ambiguous about this. Proverbs 1:5 frames ongoing learning as a mark of wisdom, not a sign of insecurity: &ldquo;Let the wise hear and increase in learning, and the one who understands obtain guidance.&rdquo; The entire book of Proverbs is an argument that leadership is cultivated through instruction, not simply bestowed. The apostle Paul, writing to Timothy from prison and with his death approaching, included a request that might easily be overlooked: &ldquo;Bring the cloak that I left with Carpus at Troas, also the books, and above all the parchments&rdquo; (2 Timothy 4:13). At the end of his life, in those circumstances, Paul wanted his books. The intellectual tradition of Christianity, from the early church fathers to the Reformation to the modern missionary movement, has consistently held that loving God with your mind is a command, not an option. John Wesley pressed this home with characteristic directness. Writing to a minister whose preaching had stagnated, he was blunt: &ldquo;Reading only can supply this, with meditation and daily prayer. You can never be a deep preacher without it, any more than a thorough Christian. Whether you like it or no, read and pray daily. It is for your life.&rdquo;
              </p>
              <p style={{ marginBottom: "1.5rem" }}>
                What happens when leaders stop reading is less dramatic than a sudden failure and more like a slow drift. The frame of reference stops expanding. The mental vocabulary stays the same. The leader begins to rely on what they already know, which was formed in a particular time, place, and context, and applies it to situations that may have changed significantly. Groupthink becomes harder to resist when you are only in conversation with people who share your background and experience. Perspectives that challenge your assumptions stop reaching you. The leader is still working hard, still sincere, still serving faithfully, but leading from yesterday&apos;s map in today&apos;s terrain. The consequences are rarely catastrophic all at once. They accumulate quietly, over years, in decisions made without enough information and opportunities missed because the frame was too narrow to see them.
              </p>
              <p style={{ marginBottom: "1.5rem" }}>
                The practical case for building a reading habit does not require dramatic volume. Twenty pages a day, taken consistently rather than heroically, adds up to roughly eighteen to twenty books a year. That number is less important than the posture behind it. The most useful reframe is to think of reading not primarily as information intake but as formation. The question to bring to a book is not &ldquo;what can I extract from this?&rdquo; but &ldquo;what is this doing to how I see?&rdquo; That shift changes what you read, how you read it, and what you do with it afterward. It also makes it easier to read across categories without guilt: fiction, biography, theology, cultural history, even poetry, because the goal is not expertise in a subject but the kind of expanded seeing that makes you a better leader, a better listener, and a more faithful presence in the places you serve.
              </p>
              <p style={{ marginBottom: 0 }}>
                If reading has slipped in your life, you are in good company. The pressures that pushed it out are real. But so is what you lose without it. Wesley&apos;s challenge was not issued to people with plenty of leisure time; he wrote it to a minister buried in pastoral demands. The invitation stands: pick up something that stretches you. Read it slowly enough to notice what it is doing to you. Let it push back on something you assumed. That is formation. That is what the best leaders, and the most faithful ones, have always been doing.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FROM THE FIELD
      ══════════════════════════════════════════════════════ */}
      <section
        id="lar-from-the-field"
        style={{
          background: navy,
          paddingBlock: "clamp(4rem, 7vw, 7rem)",
        }}
      >
        <div className="container-wide" style={{ maxWidth: 760 }}>
          <SectionLabel>
            {t("FROM THE FIELD", "DARI LAPANGAN", lang)}
          </SectionLabel>
          <SectionH2 dark>
            {t("What leaders are saying", "Apa kata para pemimpin", lang)}
          </SectionH2>

          <div
            style={{
              display: "flex",
              flexDirection: "column" as const,
              gap: "2rem",
              marginTop: "2rem",
            }}
          >
            {[
              {
                quote: {
                  en: "I used to think I was just not a reader. This reframe changed everything. I started with 10 minutes a day and now I genuinely look forward to it.",
                  id: "Dulu aku pikir aku memang bukan tipe pembaca. Bingkai ulang ini mengubah segalanya. Aku mulai dengan 10 menit sehari dan sekarang aku benar-benar menantikan waktu itu.",
                },
                context: {
                  en: "Cross-cultural leader, Southeast Asia",
                  id: "Pemimpin lintas budaya, Asia Tenggara",
                },
              },
              {
                quote: {
                  en: "The idea of reading as access to distant mentors landed for me. I grew up in an oral culture. Now I see books as an extension of that, not a replacement.",
                  id: "Gagasan membaca sebagai akses ke mentor yang jauh menyentuhku. Aku tumbuh dalam budaya lisan. Sekarang aku melihat buku sebagai perluasan dari itu, bukan pengganti.",
                },
                context: {
                  en: "Community development leader, East Africa",
                  id: "Pemimpin pengembangan komunitas, Afrika Timur",
                },
              },
            ].map((item, i) => (
              <blockquote
                key={i}
                style={{
                  margin: 0,
                  background: "oklch(26% 0.09 260)",
                  borderRadius: 8,
                  padding: "1.75rem 2rem",
                  borderTop: `2px solid ${orange}`,
                }}
              >
                <p
                  style={{
                    fontFamily: CORMORANT,
                    fontStyle: "italic",
                    fontSize: "clamp(1rem, 2.2vw, 1.2rem)",
                    color: offWhite,
                    lineHeight: 1.65,
                    marginBottom: "1rem",
                  }}
                >
                  &ldquo;{t(item.quote.en, item.quote.id, lang)}&rdquo;
                </p>
                <cite
                  style={{
                    display: "block",
                    fontFamily: FONT,
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: orange,
                    textTransform: "uppercase" as const,
                    fontStyle: "normal",
                  }}
                >
                  {t(item.context.en, item.context.id, lang)}
                </cite>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
