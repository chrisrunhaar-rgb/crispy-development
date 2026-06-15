"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id";
const tFn = (en: string, id: string, lang: Lang) =>
  lang === "id" ? id : en;

// --- VERSE DATA --------------------------------------------------------------

const VERSES: Record<string, { ref: string; en: string; id: string }> = {
  "mark-10-42-45": {
    ref: "Mark 10:42—45",
    en: "Jesus called them together and said, 'You know that those who are regarded as rulers of the Gentiles lord it over them, and their high officials exercise authority over them. Not so with you. Instead, whoever wants to become great among you must be your servant, and whoever wants to be first must be slave of all. For even the Son of Man did not come to be served, but to serve, and to give his life as a ransom for many.'",
    id: "Yesus memanggil mereka dan berkata: 'Kamu tahu, bahwa mereka yang disebut pemerintah bangsa-bangsa memerintah rakyatnya dengan tangan besi, dan pembesar-pembesarnya menjalankan kuasanya dengan keras atas mereka. Tidaklah demikian di antara kamu. Barangsiapa ingin menjadi besar di antara kamu, hendaklah ia menjadi pelayanmu, dan barangsiapa ingin menjadi yang terkemuka di antara kamu, hendaklah ia menjadi hamba untuk semuanya. Karena Anak Manusia juga datang bukan untuk dilayani, melainkan untuk melayani dan untuk memberikan nyawa-Nya menjadi tebusan bagi banyak orang.'",
  },
  "luke-16-10": {
    ref: "Luke 16:10",
    en: "Whoever can be trusted with very little can also be trusted with much, and whoever is dishonest with very little will also be dishonest with much.",
    id: "Barangsiapa setia dalam perkara-perkara kecil, ia setia juga dalam perkara-perkara besar. Dan barangsiapa tidak benar dalam perkara-perkara kecil, ia tidak benar juga dalam perkara-perkara besar.",
  },
};

// --- PILLAR DATA -------------------------------------------------------------

type Pillar = {
  num: number;
  en_title: string;
  id_title: string;
  en_desc: string;
  id_desc: string;
  en_strong: string[];
  id_strong: string[];
  en_depletes: string[];
  id_depletes: string[];
  en_nextstep: string;
  id_nextstep: string;
};

const PILLARS: Pillar[] = [
  {
    num: 1,
    en_title: "Credibility",
    id_title: "Kredibilitas",
    en_desc:
      "Credibility is the foundation of all influence. It is built from the intersection of expertise, integrity, and track record — and it cannot be declared, only earned. In cross-cultural contexts, credibility must be re-established in each new setting, because what signals trustworthiness in one culture may be invisible or even counterproductive in another.",
    id_desc:
      "Kredibilitas adalah fondasi dari semua pengaruh. Kredibilitas dibangun dari perpaduan keahlian, integritas, dan rekam jejak — dan tidak dapat dinyatakan, hanya dapat diraih. Dalam konteks lintas budaya, kredibilitas harus dibangun kembali di setiap lingkungan baru, karena apa yang menandakan kepercayaan dalam satu budaya mungkin tidak terlihat atau bahkan kontraproduktif di budaya lain.",
    en_strong: [
      "You follow through on every commitment, no matter how small — and people have noticed.",
      "You acknowledge mistakes openly and correct course without defensiveness.",
      "Your expertise is visible not through title but through the quality of your thinking and questions.",
    ],
    id_strong: [
      "Anda menindaklanjuti setiap komitmen, sekecil apapun — dan orang-orang telah memperhatikannya.",
      "Anda mengakui kesalahan secara terbuka dan mengoreksi arah tanpa bersikap defensif.",
      "Keahlian Anda terlihat bukan melalui jabatan tetapi melalui kualitas pemikiran dan pertanyaan Anda.",
    ],
    en_depletes: [
      "Over-promising to seem capable — then under-delivering. Every gap between word and action erodes the account.",
      "Hiding uncertainty behind authority. In cross-cultural teams, people can tell when a leader is bluffing — they just may not say so to your face.",
    ],
    id_depletes: [
      "Berjanji terlalu banyak untuk terlihat mampu — kemudian tidak memenuhi janji. Setiap kesenjangan antara kata dan tindakan menguras rekening.",
      "Menyembunyikan ketidakpastian di balik otoritas. Dalam tim lintas budaya, orang dapat mengetahui ketika seorang pemimpin menggertak — mereka mungkin hanya tidak mengatakannya langsung kepada Anda.",
    ],
    en_nextstep:
      "Identify one commitment you made this week that you haven't yet completed. Complete it — or renegotiate it honestly before the deadline passes.",
    id_nextstep:
      "Identifikasi satu komitmen yang Anda buat minggu ini yang belum Anda selesaikan. Selesaikan — atau negosiasikan ulang dengan jujur sebelum batas waktu berlalu.",
  },
  {
    num: 2,
    en_title: "Connection",
    id_title: "Koneksi",
    en_desc:
      "People follow leaders who know them — not just their job titles, but their stories, pressures, and hopes. Connection is the willingness to see a person as a person, not merely as a function. In high-context cultures especially, influence is impossible without relationship first. You cannot lead a person you don't know.",
    id_desc:
      "Orang mengikuti pemimpin yang mengenal mereka — bukan hanya jabatan mereka, tetapi cerita, tekanan, dan harapan mereka. Koneksi adalah kesediaan untuk melihat seseorang sebagai pribadi, bukan sekadar fungsi. Terutama dalam budaya konteks tinggi, pengaruh tidak mungkin terjadi tanpa hubungan terlebih dahulu. Anda tidak dapat memimpin seseorang yang tidak Anda kenal.",
    en_strong: [
      "You remember personal details people have shared and refer back to them — not as a technique, but because you genuinely care.",
      "People on your team feel safe enough to bring you the real news, not just the polished version.",
      "You invest time in relationship outside the agenda — meals, informal conversation, genuine interest.",
    ],
    id_strong: [
      "Anda mengingat detail pribadi yang telah dibagikan orang dan merujuknya kembali — bukan sebagai teknik, tetapi karena Anda benar-benar peduli.",
      "Orang-orang dalam tim Anda merasa cukup aman untuk membawa Anda berita yang sebenarnya, bukan hanya versi yang dipoles.",
      "Anda menginvestasikan waktu dalam hubungan di luar agenda — makan bersama, percakapan informal, ketertarikan tulus.",
    ],
    en_depletes: [
      "Treating relational investment as inefficient. Leaders who are 'too busy for people' discover that people become too indifferent to follow.",
      "Connecting only with people who are similar to you — same background, same language, same style. This leaves most of a cross-cultural team relationally outside.",
    ],
    id_depletes: [
      "Memperlakukan investasi relasional sebagai tidak efisien. Pemimpin yang 'terlalu sibuk untuk orang' menemukan bahwa orang menjadi terlalu acuh untuk mengikuti.",
      "Terhubung hanya dengan orang yang mirip dengan Anda — latar belakang, bahasa, gaya yang sama. Ini membuat sebagian besar tim lintas budaya berada di luar secara relasional.",
    ],
    en_nextstep:
      "Choose one team member you know the least about as a person. Ask them one genuine question this week — not about work.",
    id_nextstep:
      "Pilih satu anggota tim yang paling sedikit Anda kenal sebagai pribadi. Ajukan satu pertanyaan tulus kepada mereka minggu ini — bukan tentang pekerjaan.",
  },
  {
    num: 3,
    en_title: "Communication",
    id_title: "Komunikasi",
    en_desc:
      "Influence depends entirely on whether your message lands. Communication across cultures is not just translation — it is understanding how directness, tone, silence, hierarchy, and context shape whether people hear what you actually mean. The most technically correct message can fail completely if the delivery misreads the room.",
    id_desc:
      "Pengaruh sepenuhnya bergantung pada apakah pesan Anda diterima dengan baik. Komunikasi lintas budaya bukan sekadar terjemahan — ini adalah memahami bagaimana kejujuran, nada, keheningan, hierarki, dan konteks membentuk apakah orang mendengar apa yang Anda maksud. Pesan yang paling tepat secara teknis bisa gagal total jika penyampaiannya salah membaca situasi.",
    en_strong: [
      "You adapt your register — when to be direct, when to be indirect — depending on what the person and culture can receive.",
      "You ask for comprehension without shame: 'What did you understand from what I just said?' rather than 'Did you understand?'",
      "You leave space for silence and don't rush to fill it — especially with team members from high-context cultures where silence carries meaning.",
    ],
    id_strong: [
      "Anda menyesuaikan register Anda — kapan harus langsung, kapan tidak langsung — tergantung pada apa yang dapat diterima oleh orang dan budaya tersebut.",
      "Anda meminta pemahaman tanpa rasa malu: 'Apa yang Anda pahami dari apa yang baru saya katakan?' daripada 'Apakah Anda mengerti?'",
      "Anda memberi ruang untuk keheningan dan tidak terburu-buru mengisinya — terutama dengan anggota tim dari budaya konteks tinggi di mana keheningan membawa makna.",
    ],
    en_depletes: [
      "Assuming shared meaning. Words like 'soon', 'flexible', 'respect', 'honest', and 'efficient' carry very different weights across cultures.",
      "Communicating primarily in the style that works for you — because it's comfortable — rather than in the style that lands for them.",
    ],
    id_depletes: [
      "Mengasumsikan makna yang sama. Kata-kata seperti 'segera', 'fleksibel', 'hormat', 'jujur', dan 'efisien' membawa bobot yang sangat berbeda di berbagai budaya.",
      "Berkomunikasi terutama dalam gaya yang berhasil untuk Anda — karena nyaman — daripada dalam gaya yang efektif bagi mereka.",
    ],
    en_nextstep:
      "In your next key conversation, check understanding explicitly by asking: 'What did you hear me say?' Note any gap between what you said and what they received.",
    id_nextstep:
      "Dalam percakapan penting berikutnya, periksa pemahaman secara eksplisit dengan bertanya: 'Apa yang Anda dengar saya katakan?' Catat setiap kesenjangan antara apa yang Anda katakan dan apa yang mereka terima.",
  },
  {
    num: 4,
    en_title: "Consistency",
    id_title: "Konsistensi",
    en_desc:
      "Influence is not built in one great moment — it is built in ten thousand small ones. Consistency is showing up the same way over time: the same values under pressure, the same respect across power levels, the same standards whether observed or not. In cross-cultural contexts, consistency is especially powerful because it communicates safety — people can predict you, and that trust is the soil of influence.",
    id_desc:
      "Pengaruh tidak dibangun dalam satu momen besar — melainkan dalam sepuluh ribu momen kecil. Konsistensi adalah menampilkan diri dengan cara yang sama dari waktu ke waktu: nilai-nilai yang sama di bawah tekanan, rasa hormat yang sama di semua tingkat kekuasaan, standar yang sama baik diamati maupun tidak. Dalam konteks lintas budaya, konsistensi sangat kuat karena mengkomunikasikan keamanan — orang dapat memprediksi Anda, dan kepercayaan itu adalah tanah subur pengaruh.",
    en_strong: [
      "Your team members know how you will respond before you respond — not because you're predictable in a boring way, but because you're trustworthy.",
      "You treat the cleaner with the same warmth you give the director.",
      "Your private behaviour and public behaviour are the same. What you say in the meeting is what you say outside it.",
    ],
    id_strong: [
      "Anggota tim Anda tahu bagaimana Anda akan merespons sebelum Anda merespons — bukan karena Anda dapat diprediksi dengan cara yang membosankan, tetapi karena Anda dapat dipercaya.",
      "Anda memperlakukan petugas kebersihan dengan kehangatan yang sama yang Anda berikan kepada direktur.",
      "Perilaku pribadi dan perilaku publik Anda sama. Apa yang Anda katakan dalam rapat adalah apa yang Anda katakan di luar rapat.",
    ],
    en_depletes: [
      "Changing your standards based on who is watching. This is immediately sensed — and it destroys trust faster than almost anything else.",
      "Being consistent in vision but inconsistent in tone. How you say things under pressure matters as much as what you say when calm.",
    ],
    id_depletes: [
      "Mengubah standar Anda berdasarkan siapa yang sedang mengamati. Ini segera dirasakan — dan menghancurkan kepercayaan lebih cepat dari hampir semua hal lainnya.",
      "Konsisten dalam visi tetapi tidak konsisten dalam nada. Bagaimana Anda mengatakan sesuatu di bawah tekanan sama pentingnya dengan apa yang Anda katakan saat tenang.",
    ],
    en_nextstep:
      "Ask yourself: Is there anyone on my team I treat differently depending on their status or their proximity to me? Name them — and change that this week.",
    id_nextstep:
      "Tanyakan pada diri sendiri: Apakah ada seseorang dalam tim saya yang saya perlakukan berbeda tergantung pada status atau kedekatan mereka dengan saya? Sebutkan mereka — dan ubah itu minggu ini.",
  },
  {
    num: 5,
    en_title: "Cultural Intelligence",
    id_title: "Kecerdasan Budaya",
    en_desc:
      "Cultural Intelligence (CQ) is the ability to adapt effectively to new cultural settings without losing your own grounded identity. It is the difference between a leader who is genuinely cross-cultural and one who simply exports their home-culture style wherever they go. High CQ does not mean becoming all things to all people — it means being secure enough in who you are to flex how you show up.",
    id_desc:
      "Kecerdasan Budaya (CQ) adalah kemampuan untuk beradaptasi secara efektif dengan pengaturan budaya baru tanpa kehilangan identitas dasar Anda sendiri. Ini adalah perbedaan antara pemimpin yang benar-benar lintas budaya dan yang hanya mengekspor gaya budaya asalnya ke mana pun mereka pergi. CQ tinggi tidak berarti menjadi semua hal bagi semua orang — itu berarti cukup aman dalam diri Anda untuk bisa fleksibel dalam cara Anda tampil.",
    en_strong: [
      "You adjust your approach in different cultural settings — not because you are performing, but because you have genuinely learned what each setting requires.",
      "You can sit with ambiguity and cultural confusion without defaulting to judgement or withdrawal.",
      "You actively seek to understand before you seek to be understood — especially in new cross-cultural contexts.",
    ],
    id_strong: [
      "Anda menyesuaikan pendekatan Anda dalam pengaturan budaya yang berbeda — bukan karena Anda sedang berpura-pura, tetapi karena Anda benar-benar telah belajar apa yang dibutuhkan setiap pengaturan.",
      "Anda dapat duduk dengan ambiguitas dan kebingungan budaya tanpa langsung melakukan penilaian atau penarikan diri.",
      "Anda secara aktif berusaha memahami sebelum berusaha untuk dipahami — terutama dalam konteks lintas budaya yang baru.",
    ],
    en_depletes: [
      "Interpreting difference as deficiency. When another culture's approach feels wrong rather than different, CQ collapses into cultural imperialism.",
      "Adapting your style but not your assumptions. You can speak slowly and make eye contact while still operating from entirely Western frameworks of time, hierarchy, and decision-making.",
    ],
    id_depletes: [
      "Menafsirkan perbedaan sebagai kekurangan. Ketika pendekatan budaya lain terasa salah daripada berbeda, CQ runtuh menjadi imperialisme budaya.",
      "Mengadaptasi gaya Anda tetapi tidak asumsi Anda. Anda dapat berbicara perlahan dan melakukan kontak mata sambil tetap beroperasi dari kerangka Barat yang sepenuhnya tentang waktu, hierarki, dan pengambilan keputusan.",
    ],
    en_nextstep:
      "Identify one assumption you are currently making about how your team works best. Ask yourself: Is this a universal principle or a cultural preference? Then check it.",
    id_nextstep:
      "Identifikasi satu asumsi yang saat ini Anda buat tentang bagaimana tim Anda bekerja paling baik. Tanyakan pada diri sendiri: Apakah ini prinsip universal atau preferensi budaya? Kemudian periksalah.",
  },
];

// --- KINGDOM LENS CONTENT ----------------------------------------------------

const KINGDOM_CONTENT = {
  en_heading: "The Kingdom Lens",
  id_heading: "Lensa Kerajaan",
  en_intro:
    "In most organisational systems, influence is a means to an end — you build it so you can get things done, move faster, or secure your own position. The Kingdom turns this upside down. Influence is not a strategy; it is the inevitable fruit of a life poured out for others. The most influential leaders in Scripture were not influential because they sought it — they were influential because they served faithfully, suffered honestly, and held their identity in God rather than in their role.",
  id_intro:
    "Dalam kebanyakan sistem organisasi, pengaruh adalah sarana untuk mencapai tujuan — Anda membangunnya agar dapat menyelesaikan sesuatu, bergerak lebih cepat, atau mengamankan posisi Anda sendiri. Kerajaan membalikkan ini. Pengaruh bukan strategi; itu adalah buah yang tak terhindarkan dari hidup yang dicurahkan untuk orang lain. Pemimpin yang paling berpengaruh dalam Kitab Suci tidak berpengaruh karena mereka mencarinya — mereka berpengaruh karena mereka melayani dengan setia, menderita dengan jujur, dan memegang identitas mereka dalam Allah daripada dalam peran mereka.",
  en_body:
    "Joseph rose to influence not through political maneuvering but through consistent faithfulness in obscure, difficult assignments. Esther's influence at a Persian court came not from position alone but from the courage to sacrifice that position for her people. Daniel maintained influence across multiple empires not by adapting his convictions but by holding them with extraordinary grace. Paul's influence in Athens came from understanding the culture deeply enough to find the connecting point — not abandoning the gospel, but presenting it in a language the audience could hear.\n\nThe five pillars of this framework — Credibility, Connection, Communication, Consistency, and Cultural Intelligence — are not techniques for accumulating power. They are the natural characteristics of a person shaped by the Spirit: someone who tells the truth, sees people, speaks clearly, shows up reliably, and genuinely loves across difference. Influence built this way is durable. It does not depend on your title, your budget, or your charisma. It depends on your character — and character is formed in the small, unseen moments.",
  id_body:
    "Yusuf naik ke posisi berpengaruh bukan melalui manuver politik tetapi melalui kesetiaan yang konsisten dalam tugas-tugas yang samar dan sulit. Pengaruh Ester di istana Persia datang bukan dari posisi semata tetapi dari keberanian untuk mengorbankan posisi itu bagi bangsanya. Daniel mempertahankan pengaruh di berbagai kekaisaran bukan dengan mengadaptasi keyakinannya tetapi dengan memegang keyakinan itu dengan kasih karunia yang luar biasa. Pengaruh Paulus di Athena datang dari memahami budaya secara mendalam hingga cukup untuk menemukan titik penghubung — bukan meninggalkan Injil, tetapi menyajikannya dalam bahasa yang dapat didengar oleh pendengarnya.\n\nLima pilar kerangka ini — Kredibilitas, Koneksi, Komunikasi, Konsistensi, dan Kecerdasan Budaya — bukanlah teknik untuk mengumpulkan kekuasaan. Itu adalah karakteristik alami dari seseorang yang dibentuk oleh Roh: seseorang yang mengatakan kebenaran, melihat orang, berbicara dengan jelas, muncul dengan andal, dan sungguh-sungguh mengasihi melewati perbedaan. Pengaruh yang dibangun dengan cara ini tahan lama. Itu tidak bergantung pada jabatan, anggaran, atau karisma Anda. Itu bergantung pada karakter Anda — dan karakter dibentuk dalam momen-momen kecil yang tidak terlihat.",
  en_prayer:
    "Lord, I want to lead with influence, not control. Shape in me the credibility that comes from faithfulness, not self-promotion. Deepen my connection to the people I lead. Give me words that land. Make me consistent — the same leader in the hard moments as in the easy ones. And grow in me the cultural intelligence to meet people where they actually are, not where I expect them to be. May my influence always serve Your purposes, not my own. Amen.",
  id_prayer:
    "Tuhan, saya ingin memimpin dengan pengaruh, bukan kendali. Bentuklah dalam diri saya kredibilitas yang datang dari kesetiaan, bukan promosi diri. Perdalam koneksi saya dengan orang-orang yang saya pimpin. Berikan saya kata-kata yang tepat sasaran. Jadikan saya konsisten — pemimpin yang sama dalam momen-momen sulit seperti dalam momen yang mudah. Dan tumbuhkanlah dalam diri saya kecerdasan budaya untuk menemui orang-orang di mana mereka sebenarnya berada, bukan di mana saya harapkan mereka berada. Semoga pengaruh saya selalu melayani tujuan-Mu, bukan tujuan saya sendiri. Amin.",
};

// --- PROPS -------------------------------------------------------------------

type Props = { userPathway: string | null; isSaved: boolean };

// --- COMPONENT ---------------------------------------------------------------

export default function InfluentialLeadershipClient({
  userPathway,
  isSaved: initialSaved,
}: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [ratings, setRatings] = useState<number[]>([3, 3, 3, 3, 3]);
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  const [showPrayer, setShowPrayer] = useState(false);

  const t = (en: string, id: string) => tFn(en, id, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("influential-leadership-framework");
      setSaved(true);
    });
  }

  function handleRating(pillarIndex: number, value: number) {
    setRatings((prev) => {
      const next = [...prev];
      next[pillarIndex] = value;
      return next;
    });
  }

  const navy = "oklch(22% 0.10 260)";
  const orange = "oklch(65% 0.15 45)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const bodyText = "oklch(38% 0.05 260)";

  const pillarLabels = [
    t("Credibility", "Kredibilitas"),
    t("Connection", "Koneksi"),
    t("Communication", "Komunikasi"),
    t("Consistency", "Konsistensi"),
    t("Cultural Intelligence", "Kecerdasan Budaya"),
  ];

  const totalScore = ratings.reduce((a, b) => a + b, 0);
  const maxScore = 25;

  function profileLabel(total: number): { en: string; id: string } {
    if (total <= 10) return { en: "Early Stage", id: "Tahap Awal" };
    if (total <= 15) return { en: "Developing", id: "Berkembang" };
    if (total <= 20) return { en: "Established", id: "Mapan" };
    return { en: "Influential", id: "Berpengaruh" };
  }

  const label = profileLabel(totalScore);
  const profileLabelText = lang === "id" ? label.id : label.en;

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>
      <LangToggle />

      {/* -- LANGUAGE TOGGLE ------------------------------------------------ */}

      {/* -- HERO ----------------------------------------------------------- */}
      <div style={{ background: navy, padding: "80px 24px 72px" }}>
        <p
          style={{
            color: orange,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          {t("Leadership — Guide", "Kepemimpinan — Panduan")}
        </p>
        <h1
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: 600,
            color: offWhite,
            margin: "0 0 24px",
            lineHeight: 1.08,
          }}
        >
          {t(
            "The Influential Leadership Framework",
            "Kerangka Kepemimpinan Berpengaruh"
          )}
        </h1>
        <p
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: "clamp(17px, 2.5vw, 22px)",
            color: "oklch(85% 0.03 80)",
            maxWidth: 640,
            margin: "0 auto 12px",
            lineHeight: 1.65,
            fontStyle: "italic",
          }}
        >
          {t(
            "Authority is a position. Influence is a relationship. One is given; the other is grown.",
            "Otoritas adalah posisi. Pengaruh adalah hubungan. Satu diberikan; yang lain ditumbuhkan."
          )}
        </p>
        <p
          style={{
            color: "oklch(72% 0.04 80)",
            fontSize: 14,
            maxWidth: 580,
            margin: "0 auto 36px",
            lineHeight: 1.7,
          }}
        >
          {t(
            "Five pillars that determine whether people follow you because they have to — or because they choose to. Assess where you stand, identify what to strengthen, and build influence that outlasts any title.",
            "Lima pilar yang menentukan apakah orang mengikuti Anda karena harus — atau karena mereka memilih. Nilai posisi Anda, identifikasi apa yang perlu diperkuat, dan bangun pengaruh yang melampaui jabatan apapun."
          )}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={handleSave}
            disabled={saved || isPending}
            style={{
              padding: "12px 28px",
              borderRadius: 12,
              border: "none",
              cursor: saved ? "default" : "pointer",
              fontFamily: "Montserrat, sans-serif",
              fontSize: 14,
              fontWeight: 700,
              background: saved ? "oklch(55% 0.08 260)" : orange,
              color: offWhite,
            }}
          >
            {saved
              ? t("Saved to Dashboard", "Tersimpan di Dashboard")
              : t("Save to Dashboard", "Simpan ke Dashboard")}
          </button>
        </div>
      </div>

      {/* -- INTRO: INFLUENCE VS AUTHORITY ---------------------------------- */}
      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 26,
            fontWeight: 800,
            color: navy,
            marginBottom: 24,
          }}
        >
          {t("Influence is not authority.", "Pengaruh bukan otoritas.")}
        </h2>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.8, marginBottom: 20 }}>
          {t(
            "Positional authority tells people what to do. Influence moves people to want to do it. Authority is assigned by an organisation chart. Influence is built in the daily texture of how you treat people, whether you do what you say, whether you understand their world, and whether they trust that you have their interests at heart — not just your own agenda.",
            "Otoritas posisional memberi tahu orang apa yang harus dilakukan. Pengaruh menggerakkan orang untuk ingin melakukannya. Otoritas ditugaskan oleh bagan organisasi. Pengaruh dibangun dalam tekstur keseharian tentang bagaimana Anda memperlakukan orang, apakah Anda melakukan apa yang Anda katakan, apakah Anda memahami dunia mereka, dan apakah mereka percaya bahwa Anda memiliki kepentingan mereka di hati — bukan hanya agenda Anda sendiri."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.8, marginBottom: 20 }}>
          {t(
            "In cross-cultural contexts, this distinction is even sharper. Authority can cross a border in a document. Influence cannot. You have to build it from scratch in every cultural context — and the five pillars below are what that building looks like.",
            "Dalam konteks lintas budaya, perbedaan ini bahkan lebih tajam. Otoritas dapat melewati batas dalam sebuah dokumen. Pengaruh tidak bisa. Anda harus membangunnya dari awal dalam setiap konteks budaya — dan lima pilar di bawah ini adalah seperti apa pembangunan itu."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.8 }}>
          {t(
            "Use this framework as a self-assessment tool. For each pillar, read the description, review what strong looks like, note what depletes it — then rate yourself honestly on a scale of 1 to 5. At the end, your Influence Profile will show you where to focus your growth.",
            "Gunakan kerangka ini sebagai alat penilaian diri. Untuk setiap pilar, baca deskripsinya, tinjau seperti apa tampilannya ketika kuat, catat apa yang menguras — kemudian nilai diri Anda dengan jujur pada skala 1 hingga 5. Di akhir, Profil Pengaruh Anda akan menunjukkan di mana harus memfokuskan pertumbuhan Anda."
          )}
        </p>
      </div>

      {/* -- FIVE PILLARS --------------------------------------------------- */}
      {PILLARS.map((pillar, idx) => {
        const isEven = idx % 2 === 0;
        const bg = isEven ? lightGray : offWhite;
        const title = lang === "id" ? pillar.id_title : pillar.en_title;
        const desc = lang === "id" ? pillar.id_desc : pillar.en_desc;
        const strong = lang === "id" ? pillar.id_strong : pillar.en_strong;
        const depletes = lang === "id" ? pillar.id_depletes : pillar.en_depletes;
        const nextstep = lang === "id" ? pillar.id_nextstep : pillar.en_nextstep;
        const currentRating = ratings[idx];

        return (
          <div key={pillar.num} style={{ background: bg, padding: "72px 24px" }}>
            <div style={{ maxWidth: 760, margin: "0 auto" }}>

              {/* Pillar header */}
              <div style={{ display: "flex", gap: 24, alignItems: "flex-start", marginBottom: 28 }}>
                <div
                  style={{
                    fontFamily: "Cormorant Garamond, Georgia, serif",
                    fontSize: "clamp(44px, 8vw, 60px)",
                    fontWeight: 700,
                    color: orange,
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  {pillar.num}
                </div>
                <div style={{ paddingTop: 8 }}>
                  <p
                    style={{
                      color: orange,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    {t(
                      `Pillar ${pillar.num} of 5`,
                      `Pilar ${pillar.num} dari 5`
                    )}
                  </p>
                  <h2
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "clamp(22px, 4vw, 32px)",
                      fontWeight: 800,
                      color: navy,
                      margin: 0,
                    }}
                  >
                    {title}
                  </h2>
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.8, marginBottom: 36 }}>
                {desc}
              </p>

              {/* When it's strong */}
              <div
                style={{
                  background: navy,
                  borderRadius: 12,
                  padding: "28px 32px",
                  marginBottom: 24,
                }}
              >
                <h3
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: orange,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 16,
                  }}
                >
                  {t("When it's strong", "Ketika kuat")}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {strong.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span
                        style={{
                          color: orange,
                          fontWeight: 700,
                          fontSize: 16,
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        ?
                      </span>
                      <p style={{ fontSize: 15, color: "oklch(88% 0.03 80)", lineHeight: 1.7, margin: 0 }}>
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* What depletes it */}
              <div
                style={{
                  border: `2px solid oklch(88% 0.01 80)`,
                  borderRadius: 12,
                  padding: "28px 32px",
                  marginBottom: 32,
                }}
              >
                <h3
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: bodyText,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 16,
                  }}
                >
                  {t("What depletes it", "Apa yang menguras")}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {depletes.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span
                        style={{
                          color: "oklch(55% 0.12 20)",
                          fontWeight: 700,
                          fontSize: 16,
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        ?
                      </span>
                      <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.7, margin: 0 }}>
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Self-rating slider */}
              <div
                style={{
                  background: offWhite,
                  borderRadius: 12,
                  padding: "28px 32px",
                  marginBottom: 24,
                  border: isEven ? "1px solid oklch(90% 0.01 80)" : "none",
                  boxShadow: "0 2px 12px oklch(22% 0.10 260 / 0.06)",
                }}
              >
                <h3
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 15,
                    fontWeight: 700,
                    color: navy,
                    marginBottom: 8,
                  }}
                >
                  {t("Rate yourself on", "Nilai diri Anda pada")}{" "}
                  <span style={{ color: orange }}>{title}</span>
                </h3>
                <p style={{ fontSize: 13, color: bodyText, marginBottom: 20 }}>
                  {t(
                    "1 = Not yet developed — 5 = Consistently strong",
                    "1 = Belum berkembang — 5 = Konsisten kuat"
                  )}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={currentRating}
                    onChange={(e) => handleRating(idx, Number(e.target.value))}
                    style={{
                      flex: 1,
                      height: 6,
                      accentColor: orange,
                      cursor: "pointer",
                    }}
                  />
                  <div
                    style={{
                      fontFamily: "Cormorant Garamond, Georgia, serif",
                      fontSize: 36,
                      fontWeight: 700,
                      color: orange,
                      minWidth: 32,
                      textAlign: "center",
                      lineHeight: 1,
                    }}
                  >
                    {currentRating}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 6,
                  }}
                >
                  <span style={{ fontSize: 11, color: bodyText, fontWeight: 600 }}>
                    1
                  </span>
                  <span style={{ fontSize: 11, color: bodyText, fontWeight: 600 }}>
                    2
                  </span>
                  <span style={{ fontSize: 11, color: bodyText, fontWeight: 600 }}>
                    3
                  </span>
                  <span style={{ fontSize: 11, color: bodyText, fontWeight: 600 }}>
                    4
                  </span>
                  <span style={{ fontSize: 11, color: bodyText, fontWeight: 600 }}>
                    5
                  </span>
                </div>
              </div>

              {/* One next step */}
              <div
                style={{
                  background: `oklch(65% 0.15 45 / 0.08)`,
                  borderLeft: `4px solid ${orange}`,
                  borderRadius: "0 8px 8px 0",
                  padding: "20px 24px",
                }}
              >
                <p
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    color: orange,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  {t("One next step", "Satu langkah berikutnya")}
                </p>
                <p style={{ fontSize: 15, color: navy, lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
                  {nextstep}
                </p>
              </div>

            </div>
          </div>
        );
      })}

      {/* -- INFLUENCE PROFILE ---------------------------------------------- */}
      <div style={{ background: navy, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p
            style={{
              color: orange,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            {t("Your Results", "Hasil Anda")}
          </p>
          <h2
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 800,
              color: offWhite,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            {t("Your Influence Profile", "Profil Pengaruh Anda")}
          </h2>
          <p
            style={{
              color: "oklch(80% 0.03 80)",
              fontSize: 15,
              textAlign: "center",
              maxWidth: 520,
              margin: "0 auto 48px",
              lineHeight: 1.7,
            }}
          >
            {t(
              "Based on your self-assessment across the five pillars.",
              "Berdasarkan penilaian diri Anda di lima pilar."
            )}
          </p>

          {/* Bar chart */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 48 }}>
            {PILLARS.map((pillar, idx) => {
              const label = lang === "id" ? pillar.id_title : pillar.en_title;
              const score = ratings[idx];
              const pct = (score / 5) * 100;
              return (
                <div key={pillar.num}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: 14,
                        fontWeight: 600,
                        color: offWhite,
                      }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        fontFamily: "Cormorant Garamond, Georgia, serif",
                        fontSize: 22,
                        fontWeight: 700,
                        color: orange,
                      }}
                    >
                      {score}/5
                    </span>
                  </div>
                  <div
                    style={{
                      height: 10,
                      background: "oklch(35% 0.08 260)",
                      borderRadius: 5,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: score >= 4 ? orange : score >= 3 ? "oklch(70% 0.12 60)" : "oklch(60% 0.10 240)",
                        borderRadius: 5,
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary score */}
          <div
            style={{
              background: "oklch(28% 0.08 260)",
              borderRadius: 16,
              padding: "32px 36px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "oklch(72% 0.04 80)",
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              {t("Total Score", "Skor Total")}
            </p>
            <div
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontSize: 64,
                fontWeight: 700,
                color: orange,
                lineHeight: 1,
                marginBottom: 8,
              }}
            >
              {totalScore}
              <span
                style={{
                  fontSize: 28,
                  color: "oklch(60% 0.05 260)",
                }}
              >
                /{maxScore}
              </span>
            </div>
            <div
              style={{
                display: "inline-block",
                background: orange,
                color: offWhite,
                fontFamily: "Montserrat, sans-serif",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "6px 18px",
                borderRadius: 20,
                marginBottom: 20,
              }}
            >
              {profileLabelText}
            </div>
            <p
              style={{
                color: "oklch(75% 0.04 80)",
                fontSize: 14,
                lineHeight: 1.7,
                maxWidth: 500,
                margin: "0 auto",
              }}
            >
              {totalScore <= 10 &&
                t(
                  "You're at the beginning of building your influence toolkit. Pick the lowest-scoring pillar and focus there first — one deliberate practice at a time.",
                  "Anda berada di awal membangun perangkat pengaruh Anda. Pilih pilar dengan skor terendah dan fokus di sana terlebih dahulu — satu praktik yang disengaja pada satu waktu."
                )}
              {totalScore > 10 &&
                totalScore <= 15 &&
                t(
                  "You have real foundations in some pillars but visible gaps in others. The bars above show you exactly where to direct your energy.",
                  "Anda memiliki fondasi nyata di beberapa pilar tetapi kesenjangan yang terlihat di pilar lainnya. Batang-batang di atas menunjukkan kepada Anda dengan tepat di mana harus mengarahkan energi Anda."
                )}
              {totalScore > 15 &&
                totalScore <= 20 &&
                t(
                  "You're an established influence-builder. The next level is not doing more of what's already strong — it's elevating your weakest pillar to match.",
                  "Anda adalah pembangun pengaruh yang mapan. Level berikutnya bukan melakukan lebih banyak dari yang sudah kuat — melainkan meningkatkan pilar terlemah Anda untuk menyeimbangi."
                )}
              {totalScore > 20 &&
                t(
                  "You're operating with mature, consistent influence. The question now is: who are you developing to build the same kind of influence in the next generation?",
                  "Anda beroperasi dengan pengaruh yang matang dan konsisten. Pertanyaan sekarang adalah: siapa yang Anda kembangkan untuk membangun jenis pengaruh yang sama di generasi berikutnya?"
                )}
            </p>
          </div>
        </div>
      </div>

      {/* -- KINGDOM LENS --------------------------------------------------- */}
      <div style={{ padding: "80px 24px", maxWidth: 760, margin: "0 auto" }}>
        <p
          style={{
            color: orange,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          {t("Faith & Leadership", "Iman & Kepemimpinan")}
        </p>
        <h2
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "clamp(24px, 4vw, 34px)",
            fontWeight: 800,
            color: navy,
            marginBottom: 32,
            textAlign: "center",
          }}
        >
          {lang === "id" ? KINGDOM_CONTENT.id_heading : KINGDOM_CONTENT.en_heading}
        </h2>

        {/* Verse 1 */}
        <div
          style={{
            background: lightGray,
            borderRadius: 12,
            padding: "28px 32px",
            marginBottom: 28,
          }}
        >
          <p
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontSize: 20,
              lineHeight: 1.7,
              color: navy,
              fontStyle: "italic",
              marginBottom: 12,
            }}
          >
            {lang === "id"
              ? `"${VERSES["mark-10-42-45"].id.slice(0, 220)}—"`
              : `"${VERSES["mark-10-42-45"].en.slice(0, 200)}—"`}
          </p>
          <button
            onClick={() => setActiveVerse("mark-10-42-45")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: orange,
              fontWeight: 700,
              fontSize: 14,
              fontFamily: "Montserrat, sans-serif",
              textDecoration: "underline dotted",
              padding: 0,
            }}
          >
            {t("Mark 10:42—45 (NIV)", "Markus 10:42—45 (TB)")}
          </button>
        </div>

        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.8, marginBottom: 24 }}>
          {lang === "id" ? KINGDOM_CONTENT.id_intro : KINGDOM_CONTENT.en_intro}
        </p>

        {/* Body — split on \n\n */}
        {(lang === "id" ? KINGDOM_CONTENT.id_body : KINGDOM_CONTENT.en_body)
          .split("\n\n")
          .map((para, i) => (
            <p key={i} style={{ fontSize: 16, color: bodyText, lineHeight: 1.8, marginBottom: 20 }}>
              {para}
            </p>
          ))}

        {/* Verse 2 */}
        <div
          style={{
            background: lightGray,
            borderRadius: 12,
            padding: "28px 32px",
            marginBottom: 36,
          }}
        >
          <p
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontSize: 20,
              lineHeight: 1.7,
              color: navy,
              fontStyle: "italic",
              marginBottom: 12,
            }}
          >
            {lang === "id"
              ? `"${VERSES["luke-16-10"].id}"`
              : `"${VERSES["luke-16-10"].en}"`}
          </p>
          <button
            onClick={() => setActiveVerse("luke-16-10")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: orange,
              fontWeight: 700,
              fontSize: 14,
              fontFamily: "Montserrat, sans-serif",
              textDecoration: "underline dotted",
              padding: 0,
            }}
          >
            {t("Luke 16:10 (NIV)", "Lukas 16:10 (TB)")}
          </button>
        </div>

        {/* Prayer prompt */}
        <div
          style={{
            border: `2px solid ${orange}`,
            borderRadius: 12,
            padding: "32px 36px",
          }}
        >
          <button
            onClick={() => setShowPrayer(!showPrayer)}
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <span
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 16,
                fontWeight: 700,
                color: navy,
              }}
            >
              {t("A prayer for influential leadership", "Sebuah doa untuk kepemimpinan berpengaruh")}
            </span>
            <span
              style={{
                color: orange,
                fontSize: 20,
                fontWeight: 700,
                transition: "transform 0.2s",
                transform: showPrayer ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              ?
            </span>
          </button>
          {showPrayer && (
            <p
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontSize: 18,
                lineHeight: 1.8,
                color: bodyText,
                fontStyle: "italic",
                marginTop: 24,
                marginBottom: 0,
              }}
            >
              {lang === "id" ? KINGDOM_CONTENT.id_prayer : KINGDOM_CONTENT.en_prayer}
            </p>
          )}
        </div>
      </div>

      {/* -- FOOTER CTA ----------------------------------------------------- */}
      <div
        style={{
          background: navy,
          padding: "72px 24px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 28,
            fontWeight: 800,
            color: offWhite,
            marginBottom: 16,
          }}
        >
          {t("Keep Growing", "Terus Bertumbuh")}
        </h2>
        <p
          style={{
            color: "oklch(80% 0.03 80)",
            fontSize: 16,
            lineHeight: 1.75,
            maxWidth: 540,
            margin: "0 auto 32px",
          }}
        >
          {t(
            "Explore more training modules for leading with depth across cultural boundaries.",
            "Jelajahi lebih banyak kerangka untuk memimpin dengan kedalaman melintasi batas budaya."
          )}
        </p>
        <Link
          href="/resources"
          style={{
            display: "inline-block",
            padding: "14px 32px",
            background: orange,
            color: offWhite,
            borderRadius: 12,
            fontFamily: "Montserrat, sans-serif",
            fontSize: 15,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          {t("Training", "Pelatihan")}
        </Link>
      </div>

      {/* -- VERSE POPUP ---------------------------------------------------- */}
      {activeVerse && VERSES[activeVerse] && (
        <div
          onClick={() => setActiveVerse(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "oklch(10% 0.05 260 / 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: offWhite,
              borderRadius: 16,
              padding: "40px 36px",
              maxWidth: 560,
              width: "100%",
            }}
          >
            <p
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontSize: 20,
                lineHeight: 1.7,
                color: navy,
                fontStyle: "italic",
                marginBottom: 16,
              }}
            >
              "
              {lang === "id" ? VERSES[activeVerse].id : VERSES[activeVerse].en}
              "
            </p>
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 13,
                fontWeight: 700,
                color: orange,
                letterSpacing: "0.08em",
                marginBottom: 24,
              }}
            >
              — {VERSES[activeVerse].ref}{" "}
              {lang === "id" ? "(TB)" : "(NIV)"}
            </p>
            <button
              onClick={() => setActiveVerse(null)}
              style={{
                padding: "10px 24px",
                background: navy,
                color: offWhite,
                border: "none",
                borderRadius: 12,
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              {t("Close", "Tutup")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
