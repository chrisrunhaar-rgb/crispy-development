"use client";

import React, { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import LangToggle from "@/components/LangToggle";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id";

const t = (en: string, id: string, lang: Lang): string => (lang === "en" ? en : id);

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const navy      = "oklch(22% 0.10 260)";
const orange    = "oklch(65% 0.15 45)";
const offWhite  = "oklch(96% 0.005 80)";
const lightGray = "oklch(88% 0.008 80)";
const bodyText  = "oklch(35% 0.08 260)";
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
    id: "foreign-to-familiar",
    title: "Foreign to Familiar",
    titleId: "Foreign to Familiar",
    author: "Sarah Lanier",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781882655366-L.jpg",
    descriptionEn:
      "Sarah Lanier offers one of the clearest introductions to hot-climate and cold-climate cultures, high-context and low-context communication, and what it actually feels like to move between them. Short, readable, and deeply practical for cross-cultural workers.",
    descriptionId:
      "Sarah Lanier menawarkan salah satu pengantar terjelas tentang budaya iklim panas dan dingin, komunikasi konteks tinggi dan rendah, serta rasanya berpindah di antara keduanya. Singkat, mudah dibaca, dan sangat praktis bagi pekerja lintas budaya.",
    whyReadEn:
      "A short read that carries a long impact. Many cross-cultural workers say this is the first book that finally made sense of their own confusion.",
    whyReadId:
      "Bacaan singkat yang berdampak panjang. Banyak pekerja lintas budaya mengatakan ini adalah buku pertama yang akhirnya menjelaskan kebingungan mereka sendiri.",
    category: "cross-cultural",
    buyUrl: "https://www.amazon.com/dp/1882655362",
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
    id: "spiritual-leadership",
    title: "Spiritual Leadership",
    titleId: "Spiritual Leadership",
    author: "J. Oswald Sanders",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780802430175-L.jpg",
    descriptionEn:
      "First published in 1967 and never outdated, Sanders lays out what it means to lead under God's authority rather than by personal ambition. One of the most widely assigned books in leadership formation programs for Christian workers around the world.",
    descriptionId:
      "Pertama diterbitkan tahun 1967 dan tidak pernah usang, Sanders memaparkan apa artinya memimpin di bawah otoritas Allah daripada ambisi pribadi. Salah satu buku yang paling banyak ditugaskan dalam program pembentukan kepemimpinan bagi pekerja Kristen di seluruh dunia.",
    whyReadEn:
      "If you have been in leadership for years and have never read this, it will stop you in your tracks. Read it slowly.",
    whyReadId:
      "Jika kamu sudah bertahun-tahun dalam kepemimpinan dan belum pernah membaca ini, buku ini akan membuatmu berhenti sejenak. Bacalah perlahan.",
    category: "faith",
    buyUrl: "https://www.amazon.com/dp/0802430171",
  },
  {
    id: "making-of-a-leader",
    title: "The Making of a Leader",
    titleId: "The Making of a Leader",
    author: "Robert Clinton",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780891091837-L.jpg",
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

// ─── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: FONT,
        fontSize: "0.68rem",
        letterSpacing: "0.18em",
        color: orange,
        fontWeight: 700,
        marginBottom: "1.25rem",
        textTransform: "uppercase" as const,
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
        fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
        color: dark ? "white" : navy,
        marginBottom: "1.25rem",
        lineHeight: 1.15,
      }}
    >
      {children}
    </h2>
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
          {book.buyUrl && (
            <a
              href={book.buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                background: orange,
                color: "white",
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: "0.78rem",
                letterSpacing: "0.05em",
                padding: "11px 20px",
                borderRadius: 6,
                textDecoration: "none",
                minHeight: 44,
              }}
            >
              {t("Buy this book →", "Beli buku ini →", lang)}
            </a>
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

  // Reading plan state
  const [readingPlan, setReadingPlan] = useState({
    name: "",
    date: "",
    topics: ["", "", ""],
    times: { mon: "", tue: "", wed: "", thu: "", fri: "", sat: "", sun: "" },
    books: Array.from({ length: 3 }, () =>
      Array.from({ length: 4 }, () => ({ title: "", author: "" }))
    ),
    scene: [] as string[],
  });

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      const result = await saveResourceToDashboard("leaders-are-readers");
      if (!result.error) setSaved(true);
    });
  }

  const sceneItems = [
    {
      en: "Cup of Coffee or Tea",
      id: "Secangkir Kopi atau Teh",
    },
    {
      en: "Comfortable Chair",
      id: "Kursi yang Nyaman",
    },
    {
      en: "Good reading light",
      id: "Cahaya Baca yang Baik",
    },
    {
      en: "Quiet place",
      id: "Tempat yang Tenang",
    },
    {
      en: "Notebook to take notes",
      id: "Buku Catatan",
    },
    {
      en: "Comfy cushion",
      id: "Bantal yang Nyaman",
    },
    {
      en: "Reading glasses",
      id: "Kacamata Baca",
    },
    {
      en: "Music in the background",
      id: "Musik Latar",
    },
    {
      en: "Chocolate",
      id: "Coklat",
    },
    {
      en: "Motivation talk",
      id: "Obrolan Motivasi",
    },
    {
      en: "Plush rug",
      id: "Karpet Lembut",
    },
    {
      en: "Soothing candle",
      id: "Lilin Aromaterapi",
    },
  ];

  function toggleScene(label: string) {
    setReadingPlan((prev) => ({
      ...prev,
      scene: prev.scene.includes(label)
        ? prev.scene.filter((s) => s !== label)
        : [...prev.scene, label],
    }));
  }

  function updateTopic(index: number, value: string) {
    setReadingPlan((prev) => {
      const topics = [...prev.topics];
      topics[index] = value;
      return { ...prev, topics };
    });
  }

  function updateTime(day: keyof typeof readingPlan.times, value: string) {
    setReadingPlan((prev) => ({
      ...prev,
      times: { ...prev.times, [day]: value },
    }));
  }

  function updateBook(
    topicIdx: number,
    bookIdx: number,
    field: "title" | "author",
    value: string
  ) {
    setReadingPlan((prev) => {
      const books = prev.books.map((row, ri) =>
        ri === topicIdx
          ? row.map((b, bi) => (bi === bookIdx ? { ...b, [field]: value } : b))
          : row
      );
      return { ...prev, books };
    });
  }

  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"] as const;
  const dayFullLabels: Record<string, { en: string; id: string }> = {
    mon: { en: "Monday reading time", id: "Waktu membaca Senin" },
    tue: { en: "Tuesday reading time", id: "Waktu membaca Selasa" },
    wed: { en: "Wednesday reading time", id: "Waktu membaca Rabu" },
    thu: { en: "Thursday reading time", id: "Waktu membaca Kamis" },
    fri: { en: "Friday reading time", id: "Waktu membaca Jumat" },
    sat: { en: "Saturday reading time", id: "Waktu membaca Sabtu" },
    sun: { en: "Sunday reading time", id: "Waktu membaca Minggu" },
  };
  const dayKeys = [
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
    "sat",
    "sun",
  ] as (keyof typeof readingPlan.times)[];

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
        {/* Orange accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: orange,
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

          {/* Metadata pill */}
          <span
            style={{
              display: "inline-block",
              fontFamily: FONT,
              fontSize: "0.72rem",
              fontWeight: 600,
              color: "oklch(65% 0.04 260)",
              border: "1px solid oklch(38% 0.08 260)",
              borderRadius: 100,
              padding: "5px 14px",
              letterSpacing: "0.04em",
            }}
          >
            {t(
              "12 min read · Personal Growth",
              "12 menit baca · Pengembangan Pribadi",
              lang
            )}
          </span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          LEARNING OUTCOMES
      ══════════════════════════════════════════════════════ */}
      <section
        style={{
          background: offWhite,
          paddingBlock: "clamp(4rem, 7vw, 7rem)",
        }}
      >
        <div className="container-wide">
          <div
            style={{
              background: "oklch(97% 0.010 50)",
              border: `1px solid oklch(88% 0.030 50)`,
              borderRadius: 6,
              padding: "1.75rem 2rem",
              maxWidth: 760,
            }}
          >
            <SectionLabel>{t("LEARNING OUTCOMES", "TUJUAN PEMBELAJARAN", lang)}</SectionLabel>
            <p
              style={{
                fontFamily: FONT,
                fontSize: "0.875rem",
                color: "oklch(55% 0.05 260)",
                marginBottom: "0.875rem",
              }}
            >
              {t(
                "After this module, you will be able to:",
                "Setelah modul ini, kamu akan mampu:",
                lang
              )}
            </p>
            <ol style={{ paddingLeft: "1.25rem", margin: 0 }}>
              {[
                {
                  en: "Articulate why reading is a distinctly cross-cultural leadership discipline, not just a general self-improvement habit",
                  id: "Menjelaskan mengapa membaca adalah disiplin kepemimpinan lintas budaya yang khas, bukan sekadar kebiasaan pengembangan diri umum",
                },
                {
                  en: "Describe yourself as a leader who reads because of who you are becoming, not because of guilt about what you are not doing",
                  id: "Menggambarkan dirimu sebagai pemimpin yang membaca karena siapa yang sedang kamu jadikan, bukan karena rasa bersalah tentang apa yang belum kamu lakukan",
                },
                {
                  en: "Identify at least two voices from outside your own cultural background to add to your regular reading",
                  id: "Mengidentifikasi setidaknya dua suara dari luar latar belakang budayamu sendiri untuk ditambahkan ke daftar bacaanmu",
                },
              ].map((item, i) => (
                <li
                  key={i}
                  style={{
                    fontFamily: FONT,
                    fontSize: "0.875rem",
                    color: bodyText,
                    lineHeight: 1.7,
                    marginBottom: i < 2 ? "0.75rem" : 0,
                  }}
                >
                  {t(item.en, item.id, lang)}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          BEFORE / AFTER
      ══════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "white",
          paddingBlock: "clamp(4rem, 7vw, 7rem)",
        }}
      >
        <div className="container-wide">
          <SectionLabel>
            {t("THE IDENTITY SHIFT", "PERGESERAN IDENTITAS", lang)}
          </SectionLabel>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1px",
              background: lightGray,
            }}
          >
            {/* Before */}
            <div
              style={{
                background: offWhite,
                padding: "2rem 2.5rem",
              }}
            >
              <p
                style={{
                  fontFamily: FONT,
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: "oklch(52% 0.008 260)",
                  textTransform: "uppercase" as const,
                  marginBottom: "1rem",
                }}
              >
                {t("Before", "Sebelum", lang)}
              </p>
              <p
                style={{
                  fontFamily: CORMORANT,
                  fontStyle: "italic",
                  fontSize: "clamp(1.1rem, 2.2vw, 1.35rem)",
                  color: "oklch(48% 0.01 260)",
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                &ldquo;
                {t(
                  "I'm the kind of leader who never has time to read.",
                  "Aku tipe pemimpin yang tidak pernah punya waktu untuk membaca.",
                  lang
                )}
                &rdquo;
              </p>
            </div>

            {/* After */}
            <div
              style={{
                background: "oklch(97% 0.012 50)",
                padding: "2rem 2.5rem",
                border: `1px solid oklch(82% 0.040 50)`,
              }}
            >
              <p
                style={{
                  fontFamily: FONT,
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: orange,
                  textTransform: "uppercase" as const,
                  marginBottom: "1rem",
                }}
              >
                {t("After", "Sesudah", lang)}
              </p>
              <p
                style={{
                  fontFamily: CORMORANT,
                  fontStyle: "italic",
                  fontSize: "clamp(1.1rem, 2.2vw, 1.35rem)",
                  color: navy,
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                &ldquo;
                {t(
                  "I read because it keeps me teachable, and that changes everything.",
                  "Aku membaca karena itu membuat aku tetap bisa diajar, dan itu mengubah segalanya.",
                  lang
                )}
                &rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TEACHING — MOVEMENT 1: THE IDENTITY SHIFT
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
            {t("The Identity Shift", "Pergeseran Identitas", lang)}
          </SectionH2>

          {lang === "en" ? (
            <>
              <p style={prose}>
                Most of us carry a reading guilt that functions like background noise. It is not loud enough to do anything about, but it never fully goes away either. There is a book you meant to finish six months ago. There is an author someone recommended two years back that you still haven&apos;t read. There is a version of yourself, the one who reads, who always seems to be slightly ahead of where you actually are.
              </p>
              <p style={prose}>
                This guilt does not help. It has never helped. And one of the most honest things you can do as a leader is to stop treating guilt as a motivator and start asking what is actually going on.
              </p>
              <p style={prose}>
                Here is what is actually going on. The question &ldquo;how do I read more?&rdquo; is the wrong question. It is a question about behaviour, and behaviour follows identity. The more useful question is: what kind of leader do I want to be? Because if reading is part of the answer to that question, it will happen. If it is only on the to-do list, it will keep getting bumped.
              </p>
              <p style={prose}>
                There is a well-established principle in behavioral science that says identity-based habits stick in a way that outcome-based habits don&apos;t. Telling yourself &ldquo;I want to read 20 books this year&rdquo; is fragile. Telling yourself &ldquo;I am the kind of leader who reads&rdquo; is load-bearing. Not because the words are magic, but because identity shapes what you see as available to you and what you see as consistent with who you are. When you are a reader, 15 minutes in the morning with a book is just what you do. It doesn&apos;t require willpower. It is who you are.
              </p>
              <p style={{ ...prose, marginBottom: 0 }}>
                The reader, almost by definition, is always a learner. And the learner is, in my experience, a better leader. Not because they know more facts, though they often do. But because they have practiced, repeatedly, the discipline of sitting with someone else&apos;s thinking and letting it work on them. That posture, curious and open and willing to be changed, is the core posture of effective leadership. Reading builds it.
              </p>
            </>
          ) : (
            <>
              <p style={prose}>
                Kebanyakan dari kita membawa rasa bersalah soal membaca yang terasa seperti suara latar. Tidak cukup keras untuk berbuat sesuatu, tapi juga tidak pernah benar-benar hilang. Ada buku yang seharusnya kamu selesaikan enam bulan lalu. Ada penulis yang direkomendasikan seseorang dua tahun lalu yang belum juga kamu baca. Ada versi dirimu, yang suka membaca, yang selalu tampak sedikit di depan dari tempatmu benar-benar berdiri sekarang.
              </p>
              <p style={prose}>
                Rasa bersalah ini tidak membantu. Tidak pernah membantu. Dan salah satu hal paling jujur yang bisa kamu lakukan sebagai pemimpin adalah berhenti menjadikan rasa bersalah sebagai motivator, dan mulai bertanya apa yang sebenarnya sedang terjadi.
              </p>
              <p style={prose}>
                Ini yang sebenarnya terjadi. Pertanyaan &ldquo;bagaimana aku bisa membaca lebih banyak?&rdquo; adalah pertanyaan yang salah. Itu pertanyaan tentang perilaku, dan perilaku mengikuti identitas. Pertanyaan yang lebih berguna adalah: pemimpin seperti apa yang ingin aku jadi? Karena kalau membaca adalah bagian dari jawaban atas pertanyaan itu, itu akan terjadi. Kalau membaca hanya ada di daftar tugas, ia akan terus tergeser.
              </p>
              <p style={prose}>
                Ada prinsip yang sudah lama dikenal dalam ilmu perilaku: kebiasaan yang berbasis identitas bertahan dengan cara yang tidak bisa dilakukan oleh kebiasaan berbasis hasil. Memberi tahu dirimu sendiri &ldquo;aku ingin membaca 20 buku tahun ini&rdquo; itu rapuh. Memberi tahu dirimu &ldquo;aku adalah tipe pemimpin yang membaca&rdquo; itu menopang. Bukan karena kata-katanya ajaib, tapi karena identitas membentuk apa yang kamu anggap tersedia bagimu dan apa yang kamu anggap konsisten dengan siapa kamu. Ketika kamu adalah seorang pembaca, 15 menit di pagi hari dengan sebuah buku sudah menjadi bagian dari dirimu. Tidak butuh kemauan keras. Itulah siapa kamu.
              </p>
              <p style={{ ...prose, marginBottom: 0 }}>
                Pembaca, hampir secara definisi, selalu menjadi pelajar. Dan pelajar, dalam pengalamanku, adalah pemimpin yang lebih baik. Bukan karena mereka mengetahui lebih banyak fakta, meskipun sering memang begitu. Tapi karena mereka sudah berlatih, berulang kali, disiplin duduk dengan pemikiran orang lain dan membiarkannya bekerja pada mereka. Sikap itu, penasaran, terbuka, dan mau diubah, adalah sikap inti dari kepemimpinan yang efektif. Membaca membangunnya.
              </p>
            </>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STAT CALLOUT
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: navy, paddingBlock: "clamp(3rem, 5vw, 5rem)" }}>
        <div
          className="container-wide"
          style={{
            maxWidth: 680,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: CORMORANT,
              fontStyle: "italic",
              fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
              color: offWhite,
              lineHeight: 1.6,
              marginBottom: "1.25rem",
            }}
          >
            &ldquo;
            {t(
              "In my whole life, I have known no wise people who didn't read all the time, none, zero.",
              "Sepanjang hidupku, aku tidak pernah mengenal orang bijak yang tidak membaca sepanjang waktu, tidak ada satu pun.",
              lang
            )}
            &rdquo;
          </p>
          <p
            style={{
              fontFamily: FONT,
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: orange,
              textTransform: "uppercase" as const,
            }}
          >
            — Charlie Munger
          </p>
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
              <p style={prose}>
                Many of the leaders Crispy works with grew up in cultures where wisdom was not primarily transmitted through books. It came through elders. Through proverb and story. Through apprenticeship alongside someone who knew things you didn&apos;t. Through song and ceremony and gathered community. These are not primitive modes of learning that you move beyond when you become modern. They are deep, sophisticated, and often more holistically formative than private reading. If that is your tradition, honour it. It is part of how God has preserved wisdom across generations.
              </p>
              <p style={prose}>
                But here is the reframe: reading is not the replacement for oral learning. It is an extension of it. Think of it this way. There are thinkers who lived centuries before you, in countries you will never visit, in contexts that shaped them in ways completely different from your own. They have things to say to your situation that your local mentors, however wise, cannot say, because those mentors share your cultural assumptions. Reading is how you access those distant mentors. It is, in a real sense, the most democratic form of mentorship available. The book does not care about your status, your language, or your passport. You can sit with Augustine, or Chinua Achebe, or Ada Lum, for the cost of an afternoon.
              </p>
              <p style={prose}>
                There is a second layer to this that is particularly important for cross-cultural leaders. Most of the widely available leadership books, the ones recommended in training programs, shared at conferences, stacked in airport bookshops, were written by North American or European authors, for North American or European contexts. This is not a conspiracy. It is just publishing economics and English-language dominance. But it means that if you read only what is most available, you will be absorbing a particular cultural framework for leadership, one that prizes individual achievement, direct communication, and forward-planning, and you may not even notice that is what you are absorbing. Cross-cultural leaders need to read diversely, deliberately. Seek out writers from your own cultural tradition. Seek out writers from the majority world. Notice whose voice you have not yet heard.
              </p>
              <p style={prose}>
                There is one more reason reading matters specifically for the cross-cultural leader. Literary fiction, in particular, has been shown in peer-reviewed research to measurably improve the capacity to understand what is happening inside other people&apos;s minds. Researchers Emanuele Castano and David Kidd at The New School found that reading literary fiction significantly improved performance on validated tests of empathy and perspective-taking. Genre fiction and nonfiction produced no equivalent effect. The reason is that literary fiction forces you to practise exactly what cross-cultural work demands: holding uncertainty, making inferences about people who are not like you, and remaining curious rather than closing down. If you want to be better at reading rooms and reading people, one of the best tools is reading books.
              </p>
              <p style={{ ...prose, marginBottom: 0 }}>
                This reframes reading not as a Western productivity import but as a cross-cultural leadership discipline with deep biblical roots and robust practical evidence. You are not reading because you should. You are reading because it is part of how you stay formed for the work.
              </p>
            </>
          ) : (
            <>
              <p style={prose}>
                Sebelum kita melanjutkan, aku ingin menamai sesuatu secara langsung, karena ini penting.
              </p>
              <p style={prose}>
                Banyak pemimpin yang belajar bersama Crispy tumbuh di dalam budaya di mana kebijaksanaan tidak terutama disampaikan melalui buku. Ia datang melalui para sesepuh. Melalui pepatah dan cerita. Melalui proses magang di sisi seseorang yang tahu hal-hal yang kamu belum tahu. Melalui lagu, upacara, dan komunitas yang berkumpul. Ini bukan cara belajar yang primitif yang kamu tinggalkan begitu kamu menjadi modern. Ini adalah cara yang dalam, canggih, dan sering kali lebih utuh secara formatif daripada membaca sendirian. Kalau itu adalah tradisimu, hormatilah. Itu adalah bagian dari cara Tuhan melestarikan kebijaksanaan lintas generasi.
              </p>
              <p style={prose}>
                Tapi inilah bingkai ulangnya: membaca bukan pengganti pembelajaran lisan. Ini adalah perluasannya. Pikirkan seperti ini. Ada pemikir yang hidup berabad-abad sebelummu, di negara yang tidak akan pernah kamu kunjungi, dalam konteks yang membentuk mereka dengan cara yang sangat berbeda dari konteksmu. Mereka memiliki sesuatu untuk dikatakan kepada situasimu yang tidak bisa dikatakan oleh mentor lokalmu sekalipun yang paling bijak, karena para mentor itu berbagi asumsi budayamu. Membaca adalah cara kamu mengakses para mentor yang jauh itu. Ini adalah, dalam pengertian yang nyata, bentuk pendampingan yang paling demokratis yang tersedia. Buku tidak peduli tentang statusmu, bahasamu, atau paspormu. Kamu bisa duduk bersama Agustinus, atau Chinua Achebe, atau Ada Lum, hanya dengan biaya satu sore hari.
              </p>
              <p style={prose}>
                Ada lapisan kedua dari ini yang sangat penting bagi pemimpin lintas budaya. Sebagian besar buku kepemimpinan yang tersedia secara luas, yang direkomendasikan dalam program pelatihan, dibagikan di konferensi, ditumpuk di toko buku bandara, ditulis oleh penulis Amerika Utara atau Eropa, untuk konteks Amerika Utara atau Eropa. Ini bukan konspirasi. Ini hanya ekonomi penerbitan dan dominasi bahasa Inggris. Tapi artinya, kalau kamu hanya membaca apa yang paling mudah didapat, kamu akan menyerap kerangka budaya tertentu untuk kepemimpinan, salah satu yang mengutamakan pencapaian individu, komunikasi langsung, dan perencanaan ke depan, dan kamu mungkin tidak menyadari bahwa itulah yang sedang kamu serap. Pemimpin lintas budaya perlu membaca secara beragam, dengan disengaja. Carilah penulis dari tradisi budayamu sendiri. Carilah penulis dari dunia mayoritas. Perhatikan suara siapa yang belum pernah kamu dengar.
              </p>
              <p style={prose}>
                Ada satu alasan lagi mengapa membaca sangat penting bagi pemimpin lintas budaya. Fiksi sastra, khususnya, telah terbukti dalam penelitian yang ditinjau sejawat secara terukur meningkatkan kapasitas untuk memahami apa yang terjadi di dalam pikiran orang lain. Para peneliti Emanuele Castano dan David Kidd menemukan bahwa membaca fiksi sastra secara signifikan meningkatkan kinerja pada tes empati dan pengambilan perspektif yang tervalidasi. Fiksi genre dan nonfiksi tidak menghasilkan efek yang setara. Alasannya adalah fiksi sastra memaksamu untuk melatih persis apa yang dituntut oleh pekerjaan lintas budaya: memegang ketidakpastian, membuat kesimpulan tentang orang yang tidak sepertimu, dan tetap penasaran daripada menutup diri. Kalau kamu ingin lebih baik dalam membaca situasi dan membaca orang, salah satu alat terbaik adalah membaca buku.
              </p>
              <p style={{ ...prose, marginBottom: 0 }}>
                Ini membingkai ulang membaca bukan sebagai impor produktivitas Barat, melainkan sebagai disiplin kepemimpinan lintas budaya dengan akar biblis yang dalam dan bukti praktis yang kuat. Kamu tidak membaca karena kamu seharusnya. Kamu membaca karena itu adalah bagian dari cara kamu tetap terbentuk untuk pekerjaan ini.
              </p>
            </>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          QUOTE HIGHLIGHTS
      ══════════════════════════════════════════════════════ */}
      <section
        style={{
          background: offWhite,
          paddingBlock: "clamp(4rem, 7vw, 7rem)",
        }}
      >
        <div className="container-wide">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1px",
              background: lightGray,
            }}
          >
            {/* Quote 1 — Wesley */}
            <blockquote
              style={{
                background: "white",
                padding: "2rem 2.5rem",
                borderTop: `3px solid ${orange}`,
                margin: 0,
              }}
            >
              <p
                style={{
                  fontFamily: CORMORANT,
                  fontStyle: "italic",
                  fontSize: "clamp(1.05rem, 2.2vw, 1.25rem)",
                  color: navy,
                  lineHeight: 1.55,
                  marginBottom: "1rem",
                }}
              >
                &ldquo;
                {t(
                  "Whether you like it or no, read and pray daily. It is for your life.",
                  "Suka atau tidak suka, bacalah dan berdoalah setiap hari. Itu demi hidupmu.",
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
                —{" "}
                {t(
                  "John Wesley, letter to a pastor, 1760",
                  "John Wesley, surat kepada seorang pendeta, 1760",
                  lang
                )}
              </cite>
            </blockquote>

            {/* Quote 2 — Sanders */}
            <blockquote
              style={{
                background: navy,
                padding: "2rem 2.5rem",
                borderTop: `3px solid ${orange}`,
                margin: 0,
              }}
            >
              <p
                style={{
                  fontFamily: CORMORANT,
                  fontStyle: "italic",
                  fontSize: "clamp(1.05rem, 2.2vw, 1.25rem)",
                  color: offWhite,
                  lineHeight: 1.55,
                  marginBottom: "1rem",
                }}
              >
                &ldquo;
                {t(
                  "Seek knowledge from the cradle to the grave.",
                  "Tuntutlah ilmu dari buaian hingga liang lahat.",
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
                — J. Oswald Sanders, Spiritual Leadership
              </cite>
            </blockquote>
          </div>
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
        <div className="container-wide" style={{ maxWidth: 760 }}>
          <SectionLabel>
            {t("MOVEMENT 3", "GERAKAN 3", lang)}
          </SectionLabel>
          <SectionH2 dark>
            {t("Building the Habit", "Membangun Kebiasaan", lang)}
          </SectionH2>

          {lang === "en" ? (
            <>
              <p style={proseDark}>
                The shift from guilt to identity is real, and it matters. But it still has to land somewhere practical. So here is what I have found works, and what I have seen work in leaders I know.
              </p>
              <p style={proseDark}>
                <strong style={{ color: offWhite }}>Start small and stay consistent.</strong> Fifteen minutes a day is not much. But it compounds in a way that an occasional reading marathon does not. The research on habit formation consistently shows that frequency beats duration. A leader who reads 15 minutes every morning for a year has built something durable and interior. A leader who reads 3 hours every few months has a pleasant memory and not much else. The daily practice builds the muscle. The muscle is what you take into difficult conversations, confusing contexts, and decisions that don&apos;t have obvious answers.
              </p>
              <p style={proseDark}>
                <strong style={{ color: offWhite }}>Protect the time.</strong> This is not romantic advice. This is scheduling. Leaders who read &ldquo;when they have time&rdquo; never read, because there is never spare time, only scheduled time. Find where your reading sits in the day. Morning is often best, before the inbox and the urgent crowd in. But the right time is the time you will actually keep. Put it in your calendar. Treat it the way you treat a commitment to someone else.
              </p>
              <p style={proseDark}>
                <strong style={{ color: offWhite }}>Read with purpose, not guilt.</strong> You do not have to finish every book. I have started books, read what I needed, and closed them without ceremony. Some books are worth reading cover to cover, slowly. Others give you what they have in three chapters and then you are done. The goal is not to complete books. The goal is to be formed by reading. Give yourself permission to read what is feeding you right now and to set aside what isn&apos;t.
              </p>
              <p style={{ ...proseDark, marginBottom: 0 }}>
                <strong style={{ color: offWhite }}>Read across cultures deliberately.</strong> Here is a simple practice worth building: keep a rough mental count of the last five books you read and notice who wrote them. If they were all from one country or one tradition, that is worth noticing. Not as an accusation, but as information. The cross-cultural leader who only reads cross-cultural books by Western observers of other cultures is still reading through one lens. Find the thinkers who are speaking from inside the contexts you are trying to understand. They exist. They are often not in the airport bookshop, but they are findable.
              </p>
            </>
          ) : (
            <>
              <p style={proseDark}>
                Pergeseran dari rasa bersalah ke identitas itu nyata dan penting. Tapi ia tetap harus mendarat di suatu tempat yang praktis. Jadi ini yang aku temukan berhasil, dan yang aku lihat berhasil pada pemimpin yang aku kenal.
              </p>
              <p style={proseDark}>
                <strong style={{ color: offWhite }}>Mulailah kecil dan tetap konsisten.</strong> Lima belas menit sehari bukan hal yang besar. Tapi itu bertumbuh secara berganda dengan cara yang tidak bisa dilakukan oleh maraton membaca yang sesekali. Penelitian tentang pembentukan kebiasaan secara konsisten menunjukkan bahwa frekuensi mengalahkan durasi. Seorang pemimpin yang membaca 15 menit setiap pagi selama setahun telah membangun sesuatu yang tahan lama dan berakar dalam. Seorang pemimpin yang membaca 3 jam setiap beberapa bulan sekali memiliki kenangan yang menyenangkan dan tidak banyak lagi. Latihan harian membangun otot. Otot itulah yang kamu bawa ke dalam percakapan sulit, konteks yang membingungkan, dan keputusan yang tidak memiliki jawaban jelas.
              </p>
              <p style={proseDark}>
                <strong style={{ color: offWhite }}>Lindungi waktu itu.</strong> Ini bukan saran yang romantis. Ini soal penjadwalan. Pemimpin yang membaca &ldquo;kalau ada waktu&rdquo; tidak pernah membaca, karena tidak pernah ada waktu luang, hanya ada waktu yang dijadwalkan. Temukan di mana waktu membacamu berada dalam satu hari. Pagi hari sering kali paling baik, sebelum kotak masuk dan hal-hal mendesak berdatangan. Tapi waktu yang tepat adalah waktu yang benar-benar akan kamu pertahankan. Masukkan ke kalendermu. Perlakukan seperti kamu memperlakukan komitmen kepada orang lain.
              </p>
              <p style={proseDark}>
                <strong style={{ color: offWhite }}>Bacalah dengan tujuan, bukan rasa bersalah.</strong> Kamu tidak harus menyelesaikan setiap buku. Aku sudah memulai buku, membaca apa yang aku butuhkan, dan menutupnya tanpa seremonial. Beberapa buku layak dibaca dari awal hingga akhir, dengan perlahan. Yang lain memberikan apa yang mereka miliki dalam tiga bab dan selesai. Tujuannya bukan menyelesaikan buku. Tujuannya adalah dibentuk oleh membaca. Beri dirimu izin untuk membaca apa yang memberimu makan sekarang dan menyisihkan yang tidak.
              </p>
              <p style={{ ...proseDark, marginBottom: 0 }}>
                <strong style={{ color: offWhite }}>Bacalah lintas budaya dengan sengaja.</strong> Ini adalah praktik sederhana yang layak dibangun: pertahankan perhitungan kasar dalam pikiranmu tentang lima buku terakhir yang kamu baca dan perhatikan siapa yang menulisnya. Kalau semuanya dari satu negara atau satu tradisi, itu layak untuk diperhatikan. Bukan sebagai tuduhan, tapi sebagai informasi. Pemimpin lintas budaya yang hanya membaca buku lintas budaya oleh pengamat Barat tentang budaya lain masih membaca melalui satu lensa. Temukan pemikir yang berbicara dari dalam konteks yang sedang kamu coba pahami. Mereka ada. Mereka sering tidak ada di toko buku bandara, tapi mereka bisa ditemukan.
              </p>
            </>
          )}
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
                  onClick={() => setBookCategoryFilter(key)}
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
                  onClick={() => isLive && setSelectedBook(book)}
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
          READING PLAN
      ══════════════════════════════════════════════════════ */}
      <section
        id="lar-reading-plan"
        style={{
          background: "oklch(98% 0.010 50)",
          paddingBlock: "clamp(4rem, 7vw, 7rem)",
        }}
      >
        <style>{`
          @media print {
            body > *:not(#reading-plan-printable) { display: none !important; }
            #reading-plan-printable { display: block !important; }
          }
          .plan-input {
            width: 100%;
            padding: 10px 12px;
            border: 1.5px solid oklch(85% 0.008 80);
            border-radius: 6px;
            font-family: Montserrat, sans-serif;
            font-size: 0.875rem;
            color: oklch(35% 0.08 260);
            background: white;
            outline: none;
            box-sizing: border-box;
            transition: border-color 0.2s;
          }
          .plan-input:focus {
            border-color: oklch(65% 0.15 45);
          }
          .scene-chip {
            padding: 10px 14px;
            border-radius: 100px;
            border: 1.5px solid oklch(85% 0.008 80);
            background: white;
            font-family: Montserrat, sans-serif;
            font-size: 0.78rem;
            font-weight: 600;
            color: oklch(42% 0.008 260);
            cursor: pointer;
            transition: background 0.15s, border-color 0.15s, color 0.15s;
            line-height: 1;
            min-height: 44px;
            display: inline-flex;
            align-items: center;
          }
          .scene-chip.active {
            background: oklch(97% 0.030 45);
            border-color: oklch(65% 0.15 45);
            color: oklch(40% 0.12 45);
          }
          .scene-chip:hover {
            border-color: oklch(65% 0.15 45);
          }
        `}</style>

        <div className="container-wide">
          <SectionLabel>
            {t("INTERACTIVE TOOL", "ALAT INTERAKTIF", lang)}
          </SectionLabel>
          <SectionH2>
            {t("Your Reading Plan", "Rencana Membacamu", lang)}
          </SectionH2>
          <p
            style={{
              fontFamily: FONT,
              fontSize: "0.9rem",
              color: "oklch(52% 0.008 260)",
              marginBottom: "2.5rem",
              maxWidth: "52ch",
            }}
          >
            {t(
              "Use this to map your reading intention. Print it or keep it open.",
              "Gunakan ini untuk memetakan niat membacamu. Cetak atau simpan terbuka.",
              lang
            )}
          </p>

          <div
            id="reading-plan-printable"
            style={{
              background: "white",
              borderRadius: 10,
              padding: "clamp(1.5rem, 4vw, 2.5rem)",
              border: `1px solid oklch(88% 0.008 80)`,
              maxWidth: 800,
            }}
          >
            {/* A. Header row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: FONT,
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    color: navy,
                    marginBottom: "0.4rem",
                  }}
                >
                  {t("Name", "Nama", lang)}
                </label>
                <input
                  className="plan-input"
                  type="text"
                  value={readingPlan.name}
                  onChange={(e) =>
                    setReadingPlan((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder={t("Your name", "Namamu", lang)}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: FONT,
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    color: navy,
                    marginBottom: "0.4rem",
                  }}
                >
                  {t("Date", "Tanggal", lang)}
                </label>
                <input
                  className="plan-input"
                  type="text"
                  value={readingPlan.date}
                  onChange={(e) =>
                    setReadingPlan((p) => ({ ...p, date: e.target.value }))
                  }
                  placeholder={t("e.g. June 2026", "mis. Juni 2026", lang)}
                />
              </div>
            </div>

            {/* B. Topics */}
            <div style={{ marginBottom: "2rem" }}>
              <p
                style={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  color: navy,
                  marginBottom: "0.875rem",
                }}
              >
                {t(
                  "Topics I want to learn about:",
                  "Topik yang ingin aku pelajari:",
                  lang
                )}
              </p>
              {readingPlan.topics.map((topic, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: CORMORANT,
                      fontWeight: 700,
                      fontSize: "1.25rem",
                      color: orange,
                      flexShrink: 0,
                      width: "1.5rem",
                      textAlign: "center" as const,
                    }}
                  >
                    {["I", "II", "III"][i]}
                  </span>
                  <input
                    className="plan-input"
                    type="text"
                    value={topic}
                    onChange={(e) => updateTopic(i, e.target.value)}
                    placeholder={t(
                      `Topic ${i + 1}`,
                      `Topik ${i + 1}`,
                      lang
                    )}
                  />
                </div>
              ))}
            </div>

            {/* C. Dedicated reading time */}
            <div style={{ marginBottom: "2rem" }}>
              <p
                style={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  color: navy,
                  marginBottom: "0.875rem",
                }}
              >
                {t(
                  "Dedicated time for reading:",
                  "Waktu membaca yang disisihkan:",
                  lang
                )}
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: "0.5rem",
                }}
              >
                {dayKeys.map((day, i) => (
                  <div key={day} style={{ textAlign: "center" as const }}>
                    <p
                      style={{
                        fontFamily: FONT,
                        fontWeight: 700,
                        fontSize: "0.72rem",
                        color: orange,
                        marginBottom: "0.375rem",
                      }}
                    >
                      {dayLabels[i]}
                    </p>
                    <input
                      className="plan-input"
                      type="text"
                      value={readingPlan.times[day]}
                      onChange={(e) => updateTime(day, e.target.value)}
                      placeholder="—"
                      aria-label={t(dayFullLabels[day].en, dayFullLabels[day].id, lang)}
                      style={{ textAlign: "center" as const, padding: "8px 4px", minHeight: 44 }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* D. Books per topic */}
            <div style={{ marginBottom: "2rem" }}>
              <p
                style={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  color: navy,
                  marginBottom: "1.25rem",
                }}
              >
                {t(
                  "Books relating to my topics:",
                  "Buku-buku terkait topikku:",
                  lang
                )}
              </p>
              {readingPlan.books.map((topicBooks, ti) => (
                <div key={ti} style={{ marginBottom: "1.5rem" }}>
                  <p
                    style={{
                      fontFamily: CORMORANT,
                      fontWeight: 600,
                      fontSize: "1rem",
                      color: orange,
                      marginBottom: "0.75rem",
                    }}
                  >
                    {t("Topic", "Topik", lang)} {["I", "II", "III"][ti]}
                    {readingPlan.topics[ti] ? ` — ${readingPlan.topics[ti]}` : ""}
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                      gap: "0.75rem",
                    }}
                  >
                    {topicBooks.map((b, bi) => (
                      <div
                        key={bi}
                        style={{
                          background: offWhite,
                          borderRadius: 6,
                          padding: "0.875rem",
                          border: `1px solid ${lightGray}`,
                        }}
                      >
                        <input
                          className="plan-input"
                          type="text"
                          value={b.title}
                          onChange={(e) =>
                            updateBook(ti, bi, "title", e.target.value)
                          }
                          placeholder={t("Book title", "Judul buku", lang)}
                          style={{ marginBottom: "0.5rem", background: "white" }}
                        />
                        <input
                          className="plan-input"
                          type="text"
                          value={b.author}
                          onChange={(e) =>
                            updateBook(ti, bi, "author", e.target.value)
                          }
                          placeholder={t("Author", "Penulis", lang)}
                          style={{ background: "white" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* E. Scene-setting checklist */}
            <div style={{ marginBottom: "2rem" }}>
              <p
                style={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  color: navy,
                  marginBottom: "0.875rem",
                }}
              >
                {t(
                  "What do I need to set the scene?",
                  "Apa yang aku butuhkan untuk siap membaca?",
                  lang
                )}
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap" as const,
                  gap: "0.5rem",
                }}
              >
                {sceneItems.map((item) => {
                  const label = t(item.en, item.id, lang);
                  const isActive = readingPlan.scene.includes(label);
                  return (
                    <button
                      key={item.en}
                      className={`scene-chip${isActive ? " active" : ""}`}
                      onClick={() => toggleScene(label)}
                      type="button"
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* F. Print button */}
            <button
              onClick={() => window.print()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: navy,
                color: "white",
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: "0.8rem",
                letterSpacing: "0.06em",
                padding: "12px 24px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                minHeight: 44,
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              {t("Print Reading Plan", "Cetak Rencana Membaca", lang)}
            </button>
          </div>
        </div>
      </section>

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
              <p style={proseDark}>
                In 1760, John Wesley wrote a letter to a pastor named Samuel Premboth. The letter was brief and its instruction was direct: &ldquo;Whether you like it or no, read and pray daily. It is for your life.&rdquo; What strikes me about that sentence is that Wesley named the resistance first. He did not assume Premboth would be delighted to hear this. He assumed Premboth would find it inconvenient, or uncomfortable, or irrelevant. And he said it anyway, with pastoral weight. Read. Pray. This is for your life.
              </p>
              <p style={proseDark}>
                Wesley was writing to a pekerja lapangan in the 18th century, but he could be writing to you in 2025. The resistance has not changed. The pace of life that crowds out reading is the same resistance, just with a different shape. And the stakes are the same: a leader who stops learning, who fills every quiet moment with noise, who relies only on what they already know, is a leader who is slowly stopping. Wesley knew this. He was not recommending a self-improvement program. He was saying: this is survival for the leader who wants to keep growing.
              </p>
              <p style={proseDark}>
                Proverbs 1:5 is even more direct: &ldquo;Let the wise listen and add to their learning.&rdquo; The wise person is not the one who has finished learning. The wise person is the one who has not stopped. That is the calling this module is pointing toward. Not mastery. Not an impressive reading list. Just the continued posture of someone who knows there is more to know, and who is willing to sit with someone else&apos;s thinking long enough for it to change something.
              </p>
              <p style={{ ...proseDark, marginBottom: 0, fontStyle: "italic" }}>
                Who are the mentors on your shelf that you haven&apos;t met yet?
              </p>
            </>
          ) : (
            <>
              <p style={proseDark}>
                Pada tahun 1760, John Wesley menulis surat kepada seorang pendeta bernama Samuel Premboth. Suratnya singkat dan instruksinya langsung: &ldquo;Suka atau tidak suka, bacalah dan berdoalah setiap hari. Itu demi hidupmu.&rdquo; Yang menarik bagiku dari kalimat itu adalah Wesley menamai perlawanannya terlebih dahulu. Ia tidak mengasumsikan Premboth akan senang mendengar ini. Ia mengasumsikan Premboth akan merasa ini merepotkan, atau tidak nyaman, atau tidak relevan. Dan ia mengatakannya juga, dengan bobot pastoral. Membaca. Berdoa. Ini demi hidupmu.
              </p>
              <p style={proseDark}>
                Wesley menulis kepada seorang pekerja lapangan di abad ke-18, tapi ia bisa saja menulis kepadamu di tahun 2025. Perlawanannya belum berubah. Laju kehidupan yang menyisihkan waktu membaca adalah perlawanan yang sama, hanya dengan bentuk yang berbeda. Dan taruhannya sama: pemimpin yang berhenti belajar, yang mengisi setiap momen tenang dengan kebisingan, yang hanya mengandalkan apa yang sudah mereka ketahui, adalah pemimpin yang perlahan-lahan berhenti. Wesley tahu ini. Ia tidak merekomendasikan program pengembangan diri. Ia berkata: ini adalah kelangsungan hidup bagi pemimpin yang ingin terus bertumbuh.
              </p>
              <p style={proseDark}>
                Amsal 1:5 bahkan lebih langsung: &ldquo;Biarlah orang yang bijak mendengar dan menambah ilmu.&rdquo; Orang bijak bukan orang yang sudah selesai belajar. Orang bijak adalah orang yang tidak berhenti. Itulah panggilan yang ditunjukkan modul ini. Bukan penguasaan. Bukan daftar bacaan yang mengesankan. Hanya sikap yang terus-menerus dari seseorang yang tahu masih ada lebih banyak lagi yang perlu diketahui, dan yang bersedia duduk dengan pemikiran orang lain cukup lama sampai sesuatu berubah.
              </p>
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
