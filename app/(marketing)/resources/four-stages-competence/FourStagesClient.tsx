"use client";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import LangToggle from "@/components/LangToggle";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id";
const t = (en: string, id: string, lang: Lang) => lang === "id" ? id : en;

// â”€â”€â”€ Brand tokens â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const navy      = "oklch(22% 0.10 260)";
const offWhite  = "oklch(96% 0.005 80)";
const orange    = "oklch(65% 0.15 45)";
const bodyText  = "oklch(38% 0.05 260)";
const lightGray = "oklch(88% 0.008 80)";
const mutedBlue = "oklch(75% 0.04 260)";

// â”€â”€â”€ Stage data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const stages = [
  {
    number: 1,
    en_label: "Unconscious Incompetence",
    id_label: "Ketidakmampuan Tidak Sadar",
    en_subtitle: "You don't know what you don't know",
    id_subtitle: "Anda tidak tahu apa yang tidak Anda ketahui",
    en_desc: "At this stage, you lack a skill â€” and you don't even realise it. You might overestimate your ability, dismiss the need for learning, or simply have no frame of reference for what competence in this area looks like. This is sometimes called 'blissful ignorance.' The gap between what you think you can do and what you actually can is widest here.",
    id_desc: "Pada tahap ini, Anda tidak memiliki keterampilan â€” dan Anda bahkan tidak menyadarinya. Anda mungkin melebih-lebihkan kemampuan Anda, mengabaikan kebutuhan untuk belajar, atau sekadar tidak memiliki kerangka acuan tentang kompetensi di bidang ini. Celah antara apa yang Anda pikir bisa Anda lakukan dan apa yang sebenarnya bisa Anda lakukan paling lebar di sini.",
    en_growth: "If you are in Stage 1, your next step is not to practise harder â€” it is to seek feedback from people who are further along. Ask them what they see. The gap can only be crossed once you can first see it clearly, and that often requires someone else's eyes before it becomes visible to your own.",
    id_growth: "Jika kamu berada di Tahap 1, langkah selanjutnya bukan untuk berlatih lebih keras â€” melainkan mencari umpan balik dari orang-orang yang lebih maju. Tanyakan apa yang mereka lihat. Celah itu hanya bisa dilintasi setelah kamu bisa melihatnya dengan jelas terlebih dahulu, dan itu sering membutuhkan mata orang lain sebelum menjadi terlihat oleh mata kamu sendiri.",
    en_coaching: "A Stage 1 learner does not need more information â€” they need an experience that creates awareness. The goal is to engineer a moment of conscious realisation: an observation, a failure, or a piece of feedback that is too specific and too close to dismiss. Information alone will not move someone out of Stage 1; they will receive it, nod, and return to their default assumptions. Your job as a leader is not to convince them they have a gap â€” it is to create the conditions in which they encounter the gap themselves, in a context safe enough that they can sit with it rather than defend against it.",
    id_coaching: "Seorang pelajar Tahap 1 tidak butuh lebih banyak informasi â€” mereka butuh sebuah pengalaman yang menciptakan kesadaran. Tujuannya adalah merancang sebuah momen penyadaran: sebuah pengamatan, kegagalan, atau umpan balik yang terlalu spesifik dan terlalu dekat untuk diabaikan. Informasi saja tidak akan menggerakkan seseorang keluar dari Tahap 1; mereka akan menerimanya, mengangguk, dan kembali ke asumsi default mereka. Tugasmu sebagai pemimpin bukan untuk meyakinkan mereka bahwa ada celah â€” melainkan untuk menciptakan kondisi di mana mereka sendiri bertemu dengan celah itu, dalam konteks yang cukup aman sehingga mereka bisa duduk bersamanya daripada mempertahankan diri darinya.",
    quadrant: "bottom-left" as const,
  },
  {
    number: 2,
    en_label: "Conscious Incompetence",
    id_label: "Ketidakmampuan yang Disadari",
    en_subtitle: "You know what you don't know",
    id_subtitle: "Anda tahu apa yang tidak Anda ketahui",
    en_desc: "Something has revealed your gap â€” a failure, feedback, or watching someone else do it well. This is uncomfortable, but it is the most important transition in learning. You now know what you need to develop. The discomfort you feel at this stage is not a sign that you are behind â€” it is a sign that growth has begun. Staying here too long, however, leads to discouragement.",
    id_desc: "Sesuatu telah mengungkapkan celah Anda â€” kegagalan, umpan balik, atau melihat orang lain melakukannya dengan baik. Ini tidak nyaman, tetapi merupakan transisi paling penting dalam belajar. Anda sekarang tahu apa yang perlu Anda kembangkan. Ketidaknyamanan yang Anda rasakan di tahap ini bukan tanda bahwa Anda tertinggal â€” itu adalah tanda bahwa pertumbuhan telah dimulai.",
    en_growth: "Stage 2 is uncomfortable by design. You are not failing â€” you are progressing. The discomfort you feel is not a warning sign; it is the sensation of a gap being measured for the first time, the beginning of the awareness that makes growth possible. Keep moving.",
    id_growth: "Tahap 2 memang tidak nyaman â€” itu sudah dirancang demikian. Kamu tidak sedang gagal â€” kamu sedang berkembang. Ketidaknyamanan yang kamu rasakan bukan tanda peringatan; itu adalah sensasi dari sebuah celah yang untuk pertama kalinya diukur, awal dari kesadaran yang membuat pertumbuhan menjadi mungkin. Teruslah melangkah.",
    en_coaching: "A Stage 2 learner already knows the gap â€” and they feel it. They are vulnerable to discouragement, to the voice that says the gap is too large to cross, and to the temptation to retreat back into Stage 1 where at least things felt certain. The response they need from you is not more challenge â€” it is structure. Give them a clear pathway: what to practise, in what order, with what kind of feedback. And name their courage directly: deciding to keep moving forward when you can fully see how far you still have to go is one of the most significant acts of leadership development there is.",
    id_coaching: "Seorang pelajar Tahap 2 sudah mengetahui celah itu â€” dan merasakannya. Mereka rentan terhadap putus asa, terhadap suara yang mengatakan celahnya terlalu besar untuk dilintasi, dan terhadap godaan untuk mundur kembali ke Tahap 1 di mana setidaknya segalanya terasa pasti. Yang mereka butuhkan darimu bukan tantangan yang lebih besar â€” melainkan struktur. Beri mereka jalur yang jelas: apa yang harus dipraktikkan, dalam urutan apa, dengan jenis umpan balik seperti apa. Dan sebutkan keberanian mereka secara langsung: memutuskan untuk terus melangkah maju ketika kamu bisa melihat sepenuhnya seberapa jauh yang masih harus kamu tempuh adalah salah satu tindakan pengembangan kepemimpinan yang paling bermakna yang ada.",
    en_cross_cultural: "In high-context cultures across Southeast Asia and the Middle East, feedback rarely arrives as a direct statement. It travels through silence, through the absence of follow-up, through the quality of attention a room gives you â€” or withholds. A cross-cultural worker can remain in Stage 1 for months or years because no one will name the gap directly: politeness and face-keeping seal it shut. The move into Stage 2 in these contexts often depends on a trusted cultural interpreter â€” someone far enough inside the culture to see what you cannot, and close enough to you to say it plainly. Without that person, the awareness that begins Stage 2 may never be triggered at all.",
    id_cross_cultural: "Dalam budaya-budaya high-context di Asia Tenggara dan Timur Tengah, umpan balik jarang datang sebagai pernyataan langsung. Ia hadir lewat keheningan, lewat ketidakhadiran tindak lanjut, lewat kualitas perhatian yang diberikan atau ditahan oleh orang-orang di sekitarmu. Seorang pekerja lintas budaya bisa tinggal di Tahap 1 selama berbulan-bulan atau bertahun-tahun karena tidak ada yang akan menyebut celah itu secara langsung â€” kesopanan dan menjaga muka menutupnya rapat-rapat. Perpindahan ke Tahap 2 dalam konteks-konteks ini sering bergantung pada seorang penerjemah budaya yang dipercaya â€” seseorang yang cukup jauh di dalam budaya itu untuk melihat apa yang tidak bisa kamu lihat, dan cukup dekat denganmu untuk mengatakannya dengan jelas. Tanpa orang itu, kesadaran yang memulai Tahap 2 mungkin tidak pernah muncul sama sekali.",
    quadrant: "top-left" as const,
  },
  {
    number: 3,
    en_label: "Conscious Competence",
    id_label: "Kompetensi yang Disadari",
    en_subtitle: "You can do it â€” but it takes effort",
    id_subtitle: "Anda bisa melakukannya â€” tapi membutuhkan usaha",
    en_desc: "You have developed the skill and can perform it reliably â€” but it requires concentration, deliberate effort, and active thought. You might need to slow down, talk yourself through steps, or consciously apply what you have learned. This is where most sustained practice happens. The temptation is to stop here, since it feels like 'good enough.' But fluency requires more repetition.",
    id_desc: "Anda telah mengembangkan keterampilan dan dapat melakukannya dengan andal â€” tetapi memerlukan konsentrasi, upaya yang disengaja, dan pemikiran aktif. Anda mungkin perlu memperlambat atau secara sadar menerapkan apa yang telah Anda pelajari. Di sinilah sebagian besar latihan berkelanjutan terjadi. Godaannya adalah berhenti di sini, karena rasanya sudah 'cukup baik.'",
    en_growth: "You have proven that you can do this. Now the question is whether you can do it without thinking. Repetition at this stage is not redundant â€” it is the mechanism by which a fragile skill becomes a reliable one. The goal is not to do it perfectly once; it is to do it consistently under pressure.",
    id_growth: "Kamu telah membuktikan bahwa kamu bisa melakukan ini. Sekarang pertanyaannya adalah apakah kamu bisa melakukannya tanpa berpikir. Pengulangan di tahap ini tidak berlebihan â€” itu adalah mekanisme yang mengubah keahlian yang rapuh menjadi keahlian yang dapat diandalkan. Tujuannya bukan untuk melakukannya dengan sempurna sekali; melainkan untuk melakukannya secara konsisten di bawah tekanan.",
    en_coaching: "The danger at Stage 3 is premature mastery: learners can perform the skill, but only with their full attention engaged. The moment pressure increases, or a new variable enters the situation, the performance becomes fragile. Your role is to protect them from the temptation to stop here â€” because Stage 3 feels like arrival. What they have achieved is real and worth naming. What they need to understand is that fluency requires something further: repetition under load, practice in conditions that compete for their attention, until the skill no longer needs full concentration to hold.",
    id_coaching: "Bahaya di Tahap 3 adalah penguasaan yang prematur: pelajar sudah bisa melakukan keahliannya, tetapi hanya dengan seluruh perhatian mereka terlibat penuh. Begitu tekanan meningkat, atau variabel baru masuk ke dalam situasi, performanya menjadi rapuh. Peranmu adalah melindungi mereka dari godaan untuk berhenti di sini â€” karena Tahap 3 terasa seperti kedatangan. Apa yang telah mereka capai itu nyata dan layak untuk disebutkan. Yang perlu mereka pahami adalah bahwa kefasihan membutuhkan sesuatu yang lebih: pengulangan di bawah beban, latihan dalam kondisi yang bersaing untuk mendapatkan perhatian mereka, sampai keahlian itu tidak lagi membutuhkan konsentrasi penuh untuk dipertahankan.",
    quadrant: "bottom-right" as const,
  },
  {
    number: 4,
    en_label: "Unconscious Competence",
    id_label: "Kompetensi Tidak Sadar",
    en_subtitle: "Mastery â€” it becomes second nature",
    id_subtitle: "Penguasaan â€” menjadi sifat kedua",
    en_desc: "The skill has become automatic. You perform it effortlessly, often without thinking through each step. This is mastery â€” where deep practice has moved the skill from conscious control into intuition. The leadership challenge at this stage is different: you may struggle to teach others, because you no longer remember what it felt like not to know. Articulating what you now do instinctively requires deliberate reflection.",
    id_desc: "Keterampilan telah menjadi otomatis. Anda melakukannya dengan mudah, sering tanpa memikirkan setiap langkah. Ini adalah penguasaan â€” di mana latihan mendalam telah memindahkan keterampilan dari kontrol sadar ke intuisi. Tantangan kepemimpinan di tahap ini berbeda: Anda mungkin kesulitan mengajar orang lain, karena Anda tidak lagi ingat rasanya tidak tahu.",
    en_growth: "You have arrived at mastery in this area â€” but mastery in one area has a way of revealing how far you still have to go in another. The four stages repeat at every level of skill complexity. A leader who has achieved Stage 4 in their home culture and steps into a new cultural context begins again at Stage 1. That is not regression. That is the shape of a life spent learning.",
    id_growth: "Kamu telah mencapai penguasaan di area ini â€” tetapi penguasaan di satu area punya cara tersendiri untuk mengungkapkan seberapa jauh yang masih harus kamu tempuh di area lain. Empat tahap ini berulang di setiap tingkat kompleksitas keahlian. Seorang pemimpin yang telah mencapai Tahap 4 di budayanya sendiri dan melangkah ke konteks budaya yang baru memulai lagi dari Tahap 1. Itu bukan kemunduran. Itu adalah bentuk dari sebuah hidup yang dihabiskan untuk terus belajar.",
    en_coaching: "At Stage 4, the learning challenge is no longer about the skill itself â€” it is about articulation. A Stage 4 leader must learn to unpack what has become instinctive and make it visible to someone who does not yet have access to it. This requires a specific kind of reflective discipline: not just doing, but watching yourself do it and naming the micro-decisions that no longer feel like decisions. The most effective Stage 4 leaders become developers of others by learning to notice what they have stopped noticing â€” and then finding language for it.",
    id_coaching: "Di Tahap 4, tantangan belajar bukan lagi tentang keahlian itu sendiri â€” melainkan tentang artikulasi. Seorang pemimpin Tahap 4 harus belajar untuk membongkar apa yang telah menjadi naluriah dan membuatnya terlihat bagi seseorang yang belum memiliki akses ke sana. Ini membutuhkan jenis disiplin reflektif yang spesifik: bukan hanya melakukan, tetapi mengamati diri sendiri saat melakukannya dan menamai keputusan-keputusan mikro yang tidak lagi terasa seperti keputusan. Pemimpin Tahap 4 yang paling efektif menjadi pengembang orang lain dengan belajar untuk memperhatikan apa yang telah mereka berhenti perhatikan â€” dan kemudian menemukan bahasa untuk mengungkapkannya.",
    en_leadership: "There is a specific teaching challenge that comes with Stage 4: when a skill becomes automatic, you lose access to the memory of not knowing it. The steps that once required your full attention now happen below the level of conscious thought, which makes them nearly impossible to explain. In cross-cultural leadership, this is especially acute â€” the cues you read instinctively (the quality of a silence, the weight behind a deferential answer, the meaning of someone not being present) are invisible to someone who has never had to learn them. Stage 4 leaders who want to develop others must learn a different skill entirely: making their instincts visible again, narrating in real time what they do without thinking, so that someone at Stage 2 can begin to see what they cannot yet see.",
    id_leadership: "Ada tantangan pengajaran yang spesifik yang muncul bersama Tahap 4: ketika sebuah keahlian menjadi otomatis, kamu kehilangan akses pada ingatan tentang saat tidak mengetahuinya. Langkah-langkah yang dulu membutuhkan seluruh perhatianmu kini terjadi di bawah tingkat kesadaran, yang membuatnya hampir mustahil untuk dijelaskan. Dalam kepemimpinan lintas budaya, ini sangat terasa â€” isyarat-isyarat yang kamu baca secara naluriah (kualitas sebuah keheningan, bobot di balik jawaban yang tampak setuju, makna dari ketidakhadiran seseorang) tidak terlihat bagi seseorang yang belum pernah harus mempelajarinya. Pemimpin Tahap 4 yang ingin mengembangkan orang lain harus mempelajari keterampilan yang berbeda sepenuhnya: membuat naluri mereka terlihat kembali, menceritakan secara real time apa yang mereka lakukan tanpa berpikir, sehingga seseorang di Tahap 2 dapat mulai melihat apa yang belum bisa mereka lihat.",
    quadrant: "top-right" as const,
  },
];

// Journey arc order: S1(BL) â†’ S2(TL) â†’ S4(TR) â†’ S3(BR)
// Map stage number â†’ quadrant position in the grid
const stagePositions: Record<number, { left: number; top: number; width: number; height: number }> = {
  1: { left: 0,   top: 240, width: 280, height: 240 }, // Bottom-left
  2: { left: 0,   top: 0,   width: 280, height: 240 }, // Top-left
  4: { left: 280, top: 0,   width: 280, height: 240 }, // Top-right
  3: { left: 280, top: 240, width: 280, height: 240 }, // Bottom-right
};

// Centers of each stage quadrant (for the arc)
const stageCenters: Record<number, { x: number; y: number }> = {
  1: { x: 140, y: 360 },
  2: { x: 140, y: 120 },
  4: { x: 420, y: 120 },
  3: { x: 420, y: 360 },
};

// â”€â”€â”€ CompetenceMatrix component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function CompetenceMatrix({ selectedStage, onSelect, lang }: {
  selectedStage: number | null;
  onSelect: (n: number) => void;
  lang: Lang;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  // Stages in quadrant display order (position in grid)
  const quadrantStages = [1, 2, 3, 4];

  return (
    <div
      style={{ position: "relative", width: "100%", maxWidth: 560, margin: "0 auto", aspectRatio: "560 / 480" }}
      role="group"
      aria-label={t("Four Stages Competence Map â€” select a stage to explore", "Peta Empat Tahap Kompetensi â€” pilih tahap untuk dijelajahi", lang)}
    >
      {/* SVG axes layer â€” behind buttons */}
      <svg
        viewBox="0 0 560 480"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        aria-hidden="true"
      >
        {/* Arrow marker definition */}
        <defs>
          <marker id="fs-arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill={orange} />
          </marker>
        </defs>

        {/* Horizontal axis */}
        <line x1="40" y1="240" x2="520" y2="240" stroke={mutedBlue} strokeWidth="1.5" />
        {/* Vertical axis */}
        <line x1="280" y1="20" x2="280" y2="460" stroke={mutedBlue} strokeWidth="1.5" />

        {/* Axis labels */}
        <text x="60" y="255" fontSize="10" fill="oklch(55% 0.04 260)">Low Competence</text>
        <text x="370" y="255" fontSize="10" fill="oklch(55% 0.04 260)">High Competence</text>
        <text x="290" y="470" fontSize="10" fill="oklch(55% 0.04 260)">Low Awareness</text>
        <text x="290" y="15" fontSize="10" fill="oklch(55% 0.04 260)">High Awareness</text>

        {/* Journey arc: S1(140,360) â†’ S2(140,120) â†’ S4(420,120) â†’ S3(420,360) */}
        {/* S1 â†’ S2 (vertical left side) */}
        <path
          d="M 140,350 C 140,280 140,200 140,130"
          stroke={orange}
          strokeWidth="2.5"
          strokeDasharray="6 4"
          fill="none"
          markerEnd="url(#fs-arrowhead)"
        />
        {/* S2 â†’ S4 (horizontal top) */}
        <path
          d="M 150,120 C 230,120 330,120 410,120"
          stroke={orange}
          strokeWidth="2.5"
          strokeDasharray="6 4"
          fill="none"
          markerEnd="url(#fs-arrowhead)"
        />
        {/* S4 â†’ S3 (vertical right side) */}
        <path
          d="M 420,130 C 420,200 420,280 420,350"
          stroke={orange}
          strokeWidth="2.5"
          strokeDasharray="6 4"
          fill="none"
          markerEnd="url(#fs-arrowhead)"
        />

        {/* Orange circle milestone at S4â†’S3 midpoint (x=420, y=240) */}
        <circle cx="420" cy="240" r="6" fill={orange} />

        {/* "Start here" label near S1 */}
        <text x="50" y="395" fontSize="9" fill={orange} fontFamily="Montserrat, sans-serif">&#x2460; {t("Start here", "Mulai di sini", lang)}</text>
      </svg>

      {/* Quadrant buttons layered on top */}
      {quadrantStages.map((stageNum) => {
        const stage = stages.find(s => s.number === stageNum)!;
        const pos = stagePositions[stageNum];
        const isSelected = selectedStage === stageNum;
        const isHovered = hovered !== null && hovered !== stageNum;

        return (
          <button
            key={stageNum}
            aria-pressed={isSelected}
            aria-label={t(
              `Stage ${stageNum}: ${stage.en_label}`,
              `Tahap ${stageNum}: ${stage.id_label}`,
              lang
            )}
            onClick={() => onSelect(stageNum)}
            onMouseEnter={() => setHovered(stageNum)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: "absolute",
              left: `${(pos.left / 560) * 100}%`,
              top: `${(pos.top / 480) * 100}%`,
              width: `${(pos.width / 560) * 100}%`,
              height: `${(pos.height / 480) * 100}%`,
              background: isSelected ? navy : "oklch(93% 0.008 80)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              borderRadius: 0,
              opacity: isHovered ? 0.6 : 1,
              transition: "background 0.2s ease, opacity 0.2s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <span style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: 32,
              fontWeight: 700,
              lineHeight: 1,
              color: isSelected ? offWhite : orange,
            }}>
              {stageNum}
            </span>
            <span style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              color: isSelected ? offWhite : bodyText,
              textAlign: "center" as const,
              padding: "0 8px",
              lineHeight: 1.3,
            }}>
              {lang === "id" ? stage.id_label : stage.en_label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// â”€â”€â”€ SEO Background collapsible â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SEOBackground({ lang }: { lang: Lang }) {
  const [bgOpen, setBgOpen] = useState(false);

  const seoEN = `The Four Stages of Competence: Origins, Evidence, and Application in Cross-Cultural Leadership

Few frameworks in leadership development travel as widely and are cited as loosely as the Four Stages of Competence. Most presentations attribute the model to Noel Burch of Gordon Training International, who popularized it through their training programs in the early 1970s. That attribution is not wrong â€” but it is incomplete.

The earliest documented formulation appears in a 1960 New York University management textbook, Management of Training Programs. Martin M. Broadwell independently published the framework in February 1969 in The Gospel Guardian, applying it to teaching effectiveness. T. Earl Pardoe described a comparable learning-progression structure as far back as 1923. The attribution to Abraham Maslow, widely circulated in popular management writing, is a documented error.

Stage 2 â€” Conscious Incompetence â€” is where learning actually begins, and where most people stop. Research on cross-cultural development (Bennett, 1986; the Intercultural Development Inventory research) consistently identifies this as the highest dropout point. What allows leaders to stay in Stage 2 long enough to move through it is not intelligence or motivation â€” it is support structures and psychological safety.

Stage 4 â€” Unconscious Competence â€” carries a specific challenge: the Curse of Knowledge. When a skill becomes automatic, the practitioner loses access to the memory of not knowing it. W. Lewis Robinson identified this in 1974: only the consciously competent can effectively train those who are not yet competent. Several researchers have proposed a fifth stage â€” "reflective competence" (Baume, 2004), "re-conscious competence" (Gilbert, 2004), or "enlightened competence" (Mata, 2004) â€” to capture this teaching capacity.

William Howell's 1982 work, The Empathic Communicator, provides the canonical cross-cultural application: at Stage 1, leaders assume their cultural norms are universal; at Stage 4, they navigate between cultures with natural fluency. The cultural intelligence (CQ) research by Earley, Ang, and Livermore adds that cognitive knowledge about cultural differences (Stage 2) does not automatically produce behavioral competence (Stage 4) â€” the move requires repeated practice in real cultural settings.`;

  const seoID = `Empat Tahap Kompetensi: Asal-Usul, Bukti, dan Penerapan dalam Kepemimpinan Lintas Budaya

Sedikit kerangka kerja dalam pengembangan kepemimpinan yang beredar seluas â€” dan dikutip sebagaimana longgarnya â€” seperti Empat Tahap Kompetensi. Kebanyakan presentasi mengatribusikan model ini kepada Noel Burch dari Gordon Training International. Atribusi itu tidak salah â€” tetapi tidak lengkap.

Formulasi paling awal yang terdokumentasi muncul dalam buku teks manajemen NYU tahun 1960. Martin M. Broadwell menerbitkannya secara independen pada Februari 1969. T. Earl Pardoe mengidentifikasi struktur serupa sejak 1923. Atribusi kepada Abraham Maslow adalah kesalahan yang terdokumentasi.

Tahap 2 â€” Ketidakmampuan yang Disadari â€” adalah di mana pembelajaran benar-benar dimulai, dan di mana kebanyakan orang berhenti. Penelitian secara konsisten menunjukkan ini sebagai titik putus tertinggi. Yang memungkinkan pemimpin untuk tetap di Tahap 2 cukup lama bukan kecerdasan atau motivasi â€” melainkan struktur dukungan dan keamanan psikologis.

Tahap 4 membawa tantangan spesifik: Kutukan Pengetahuan. Ketika keahlian menjadi otomatis, praktisi kehilangan akses pada ingatan tidak mengetahuinya. Beberapa peneliti mengusulkan tahap kelima â€” "kompetensi reflektif" (Baume, 2004) atau "kompetensi tercerahkan" (Mata, 2004) â€” untuk menangkap kapasitas pengajaran ini.

Karya William Howell tahun 1982, The Empathic Communicator, memberikan penerapan lintas budaya kanonik. Penelitian kecerdasan budaya (CQ) oleh Earley, Ang, dan Livermore menambahkan bahwa pengetahuan kognitif tentang perbedaan budaya (Tahap 2) tidak secara otomatis menghasilkan kompetensi perilaku (Tahap 4) â€” perpindahan itu membutuhkan latihan berulang dalam pengaturan budaya nyata.`;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
      <button
        onClick={() => setBgOpen(v => !v)}
        aria-expanded={bgOpen}
        aria-controls="four-stages-research-panel"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: orange,
          fontSize: 14,
          fontWeight: 700,
          fontFamily: "Montserrat, sans-serif",
          letterSpacing: "0.06em",
          padding: "8px 0",
          minHeight: 44,
          display: "flex",
          alignItems: "center",
        }}
      >
        {bgOpen
          ? t("Hide the research â†‘", "Sembunyikan penelitiannya â†‘", lang)
          : t("Read the research â†’", "Baca penelitiannya â†’", lang)}
      </button>
      <div
        id="four-stages-research-panel"
        role="region"
        aria-label={t("Research background", "Latar belakang penelitian", lang)}
        style={{
          display: "grid",
          gridTemplateRows: bgOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 0.35s ease",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div style={{ paddingBottom: 24 }}>
            {(lang === "id" ? seoID : seoEN).split("\n\n").map((para, i) => (
              para.trim() ? (
                i === 0
                  ? <h3 key={i} style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 600, color: navy, margin: "0 0 12px" }}>{para}</h3>
                  : <p key={i} style={{ fontSize: 15, lineHeight: 1.8, color: bodyText, margin: "0 0 12px" }}>{para}</p>
              ) : null
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ Props and main component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type Props = { isSaved: boolean };

export default function FourStagesClient({ isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" ? "id" : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [, startTransition] = useTransition();
  const [selectedStage, setSelectedStage] = useState<number | null>(null);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("four-stages-competence");
      setSaved(true);
    });
  }

  function handleStageSelect(n: number) {
    setSelectedStage(prev => prev === n ? null : n);
  }

  const selectedData = selectedStage !== null ? stages.find(s => s.number === selectedStage) : null;

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>
      <LangToggle />

      {/* â”€â”€ 1. HERO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{ background: navy, padding: "80px 24px 72px", position: "relative", overflow: "hidden" }}>
        {/* Hero image */}
        <img
          src="/images/resources/understanding-burnout/hero-nest.jpg"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.22,
            mixBlendMode: "luminosity",
          }}
        />
        <div style={{ position: "relative", maxWidth: 720, margin: "0 auto" }}>
          <p style={{
            color: orange, fontSize: 12, fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase",
            marginBottom: 16,
          }}>
            {t("PERSONAL DEVELOPMENT â€” GUIDE", "PENGEMBANGAN DIRI â€” PANDUAN", lang)}
          </p>
          <h1 style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: 600,
            color: offWhite,
            margin: "0 0 20px",
            lineHeight: 1.08,
          }}>
            {t("Four Stages of Competence", "Empat Tahap Kompetensi", lang)}
          </h1>
          <p style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: "clamp(17px, 2.5vw, 22px)",
            color: "oklch(85% 0.03 80)",
            maxWidth: 580,
            margin: "0 0 32px",
            lineHeight: 1.6,
            fontStyle: "italic",
          }}>
            {t(
              "Growth begins the moment you realise how much you donâ€™t know.",
              "Pertumbuhan dimulai pada saat Anda menyadari betapa banyak yang tidak Anda ketahui.",
              lang
            )}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <span style={{
              background: "oklch(30% 0.10 260)", color: offWhite,
              fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
              padding: "6px 14px", borderRadius: 4,
            }}>
              {t("GUIDE", "PANDUAN", lang)}
            </span>
            <span style={{
              background: "oklch(30% 0.10 260)", color: offWhite,
              fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
              padding: "6px 14px", borderRadius: 4,
            }}>
              15 {t("MIN", "MENIT", lang)}
            </span>
            <button
              onClick={handleSave}
              aria-label={saved ? t("Saved to dashboard", "Tersimpan ke dasbor", lang) : t("Save to dashboard", "Simpan ke dasbor", lang)}
              style={{
                background: saved ? "oklch(55% 0.15 150)" : orange,
                color: offWhite,
                fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                padding: "6px 14px", borderRadius: 4,
                border: "none", cursor: saved ? "default" : "pointer",
                minHeight: 44,
              }}
            >
              {saved ? t("âœ“ SAVED", "âœ“ TERSIMPAN", lang) : t("+ SAVE", "+ SIMPAN", lang)}
            </button>
          </div>
        </div>
      </div>

      {/* â”€â”€ 2. INTRO PROSE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "56px 24px 0" }}>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: bodyText, marginBottom: 16 }}>
          {t(
            "The Four Stages of Competence â€” also known as the Conscious Competence Model â€” is a psychological framework that maps how we actually learn. It was developed in the 1970s and has since become one of the most widely used models for understanding skill acquisition, training design, and personal development.",
            "Empat Tahap Kompetensi â€” juga dikenal sebagai Model Kompetensi Sadar â€” adalah kerangka psikologis yang memetakan bagaimana kita sebenarnya belajar. Dikembangkan pada tahun 1970-an dan telah menjadi salah satu model yang paling banyak digunakan untuk memahami perolehan keterampilan, desain pelatihan, dan pengembangan pribadi.",
            lang
          )}
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: bodyText }}>
          {t(
            "The model tracks two variables â€” your ability (competence) and your awareness of it (consciousness) â€” and shows how they shift through four distinct stages as you move from ignorance to mastery. Understanding which stage you are in changes how you approach learning, how you coach others, and how you interpret the discomfort of growth.",
            "Model ini melacak dua variabel â€” kemampuan Anda (kompetensi) dan kesadaran Anda tentangnya â€” dan menunjukkan bagaimana keduanya bergeser melalui empat tahap yang berbeda saat Anda bergerak dari ketidaktahuan ke penguasaan. Memahami tahap mana yang Anda jalani mengubah cara Anda mendekati pembelajaran dan cara Anda melatih orang lain.",
            lang
          )}
        </p>
      </div>

      {/* â”€â”€ 3. SEO BACKGROUND (collapsible) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{ maxWidth: 720, margin: "32px auto 0", padding: "0 24px" }}>
        <SEOBackground lang={lang} />
      </div>

      {/* â”€â”€ 4. SELF-MAPPING CANVAS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{ maxWidth: 720, margin: "48px auto 0", padding: "0 24px" }}>
        <h2 style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: "clamp(26px, 4vw, 36px)",
          fontWeight: 600,
          color: navy,
          margin: "0 0 8px",
        }}>
          {t("Where Are You Right Now?", "Di Mana Kamu Sekarang?", lang)}
        </h2>
        <p style={{ fontSize: 14, color: bodyText, margin: "0 0 24px", lineHeight: 1.6 }}>
          {t(
            "Select a quadrant to explore each stage.",
            "Pilih kuadran untuk menjelajahi setiap tahap.",
            lang
          )}
        </p>

        <CompetenceMatrix
          selectedStage={selectedStage}
          onSelect={handleStageSelect}
          lang={lang}
        />

        {/* Content reveal panel */}
        <div
          style={{
            display: "grid",
            gridTemplateRows: selectedStage !== null ? "1fr" : "0fr",
            transition: "grid-template-rows 0.35s ease",
            marginTop: 8,
          }}
        >
          <div style={{ overflow: "hidden" }}>
            {selectedData && (
              <div style={{ padding: "28px 0 8px" }}>
                {/* Stage name */}
                <h3 style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: 24,
                  fontWeight: 600,
                  color: navy,
                  margin: "0 0 4px",
                }}>
                  {t(`Stage ${selectedData.number}: ${selectedData.en_label}`, `Tahap ${selectedData.number}: ${selectedData.id_label}`, lang)}
                </h3>
                <p style={{ fontSize: 14, fontStyle: "italic", color: bodyText, margin: "0 0 16px" }}>
                  {lang === "id" ? selectedData.id_subtitle : selectedData.en_subtitle}
                </p>

                {/* Stage description (verbatim from stages array) */}
                <p style={{ fontSize: 15, lineHeight: 1.8, color: bodyText, margin: "0 0 20px" }}>
                  {lang === "id" ? selectedData.id_desc : selectedData.en_desc}
                </p>

                {/* Stage 2 cross-cultural note */}
                {selectedData.number === 2 && (selectedData as typeof stages[1]).en_cross_cultural && (
                  <p style={{ fontSize: 15, lineHeight: 1.8, color: bodyText, margin: "0 0 20px", borderLeft: `3px solid ${orange}`, paddingLeft: 16 }}>
                    {lang === "id" ? (selectedData as typeof stages[1]).id_cross_cultural : (selectedData as typeof stages[1]).en_cross_cultural}
                  </p>
                )}

                {/* Stage 4 leadership note */}
                {selectedData.number === 4 && (selectedData as typeof stages[3]).en_leadership && (
                  <p style={{ fontSize: 15, lineHeight: 1.8, color: bodyText, margin: "0 0 20px", borderLeft: `3px solid ${orange}`, paddingLeft: 16 }}>
                    {lang === "id" ? (selectedData as typeof stages[3]).id_leadership : (selectedData as typeof stages[3]).en_leadership}
                  </p>
                )}

                {/* What this means for your growth */}
                <p style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: orange,
                  margin: "0 0 8px",
                }}>
                  {t("What this means for your growth", "Apa artinya ini bagi pertumbuhanmu", lang)}
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: bodyText, margin: "0 0 20px" }}>
                  {lang === "id" ? selectedData.id_growth : selectedData.en_growth}
                </p>

                {/* For leaders: coaching this stage */}
                <p style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: orange,
                  margin: "0 0 8px",
                }}>
                  {t("For leaders: coaching this stage", "Bagi pemimpin: membimbing di tahap ini", lang)}
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: bodyText, margin: 0 }}>
                  {lang === "id" ? selectedData.id_coaching : selectedData.en_coaching}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* â”€â”€ 5. A NOTE FOR LEADERS (verbatim from current file) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{ maxWidth: 720, margin: "48px auto 0", padding: "0 24px" }}>
        <div style={{
          background: "oklch(95% 0.01 260)",
          border: "1px solid oklch(88% 0.02 260)",
          borderRadius: 8,
          padding: "28px 32px",
        }}>
          <h3 style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: 22, fontWeight: 600,
            color: navy, margin: "0 0 12px",
          }}>
            {t("A note for leaders", "Catatan untuk pemimpin", lang)}
          </h3>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: bodyText, margin: 0 }}>
            {t(
              "Understanding these four stages is not just about your own development. It reshapes how you train your team, how you respond to struggling colleagues, and how you build organisations that learn. A team member stuck in Stage 1 doesn't need more information â€” they need an experience that creates awareness. A Stage 3 learner doesn't need more encouragement â€” they need sustained practice. The model teaches you to diagnose before you intervene.",
              "Memahami keempat tahap ini bukan hanya tentang pengembangan diri Anda sendiri. Ini membentuk ulang cara Anda melatih tim, cara Anda merespons rekan yang berjuang, dan cara Anda membangun organisasi yang belajar. Anggota tim yang terjebak di Tahap 1 tidak membutuhkan lebih banyak informasi â€” mereka membutuhkan pengalaman yang menciptakan kesadaran. Pemelajar Tahap 3 tidak membutuhkan lebih banyak dorongan â€” mereka membutuhkan latihan berkelanjutan.",
              lang
            )}
          </p>
        </div>
      </div>

      {/* â”€â”€ 6. FAITH ANCHOR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{ background: navy, marginTop: 64, padding: "64px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", color: orange,
            margin: "0 0 24px",
          }}>
            {t("FAITH ANCHOR", "JANGKAR IMAN", lang)}
          </p>
          {lang === "en" ? (
            <>
              <p style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "clamp(18px, 2.5vw, 24px)",
                fontStyle: "italic",
                color: offWhite,
                lineHeight: 1.7,
                margin: "0 0 24px",
              }}>
                &ldquo;I have learned, in whatever state I am, to be content.&rdquo;
              </p>
              <p style={{ fontSize: 13, color: "oklch(75% 0.03 80)", letterSpacing: "0.05em", margin: "0 0 24px" }}>
                Philippians 4:11 (NIV)
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: "oklch(88% 0.01 80)", margin: "0 0 16px" }}>
                The Greek word translated &ldquo;learned&rdquo; here is <em>manthano</em> â€” not book-learning but practiced initiation, the kind of knowing that comes from doing. Paul adds something sharper in verse 12: <em>memuemai</em>, a word used for being initiated into a mystery or a guild, the same root applied to skilled apprenticeship. Contentment, Paul is saying, is not a spiritual disposition you are given at conversion. It is a competence you enter through repetition, through exposure to difficulty, through each stage of experience adding depth to the last.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: "oklch(88% 0.01 80)", margin: "0 0 16px" }}>
                Read the passage again through the lens of the four stages. Paul was not always content. Before his encounter with Jesus on the road to Damascus, he was, in his own words, &ldquo;a blasphemer and a persecutor and a violent man&rdquo; (1 Timothy 1:13) â€” convinced of his rightness, unaware of the gap between his confidence and the reality he could not yet see. That is Stage 1: unconscious incompetence at its most dangerous. What followed â€” years of unlearning, exposure to opposition, suffering, and the slow discovery of what it means to walk with Christ â€” is the four stages lived out in one life. By the time he writes to the Philippians from a prison cell, he has arrived somewhere he could not have planned or forced: a practiced, reliable peace that no longer requires effort to maintain.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: "oklch(88% 0.01 80)", margin: "0 0 24px" }}>
                What stage are you in right now, in your most important leadership challenge? Not where you would like to be â€” where you actually are? The passage is not a call to skip the stages. It is a testimony that they are worth walking through.
              </p>
              <p style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: 18,
                fontStyle: "italic",
                color: "oklch(80% 0.03 80)",
                lineHeight: 1.7,
                borderLeft: `3px solid ${orange}`,
                paddingLeft: 20,
                margin: 0,
              }}>
                Where in your leadership right now do you sense the gap between where you are and where you know you need to be â€” and what would it mean to stay in that discomfort long enough to learn from it?
              </p>
            </>
          ) : (
            <>
              <p style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "clamp(18px, 2.5vw, 24px)",
                fontStyle: "italic",
                color: offWhite,
                lineHeight: 1.7,
                margin: "0 0 24px",
              }}>
                &ldquo;Aku telah belajar untuk merasa cukup dalam segala keadaan yang aku hadapi.&rdquo;
              </p>
              <p style={{ fontSize: 13, color: "oklch(75% 0.03 80)", letterSpacing: "0.05em", margin: "0 0 24px" }}>
                Filipi 4:11
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: "oklch(88% 0.01 80)", margin: "0 0 16px" }}>
                Kata Yunani yang diterjemahkan &ldquo;belajar&rdquo; di sini adalah <em>manthano</em> â€” bukan belajar dari buku, melainkan pengenalan yang lahir dari latihan, dari pengalaman yang diulang terus-menerus. Di ayat 12, Paulus menambahkan sesuatu yang lebih dalam lagi: <em>memuemai</em>, kata yang dipakai untuk inisiasi ke dalam sebuah misteri atau keahlian. Kecukupan hati, kata Paulus, bukan karunia yang langsung diberikan saat kamu percaya. Itu adalah kompetensi yang kamu masuki melalui pengulangan, melalui kesulitan, melalui setiap tahap pengalaman yang menambah kedalaman pada tahap sebelumnya.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: "oklch(88% 0.01 80)", margin: "0 0 16px" }}>
                Baca perikop ini melalui lensa empat tahap. Paulus tidak selalu hidup dalam kecukupan hati. Sebelum bertemu Yesus di jalan menuju Damaskus, ia â€” dengan kata-katanya sendiri â€” &ldquo;seorang penghujat, penganiaya, dan seorang yang ganas&rdquo; (1 Timotius 1:13): yakin akan kebenarannya sendiri, tidak sadar akan jurang antara rasa percaya dirinya dan kenyataan yang belum bisa ia lihat. Itulah Tahap 1: ketidaksadaran atas ketidakmampuan dalam bentuknya yang paling berbahaya. Yang kemudian terjadi adalah empat tahap yang dijalani dalam satu kehidupan. Saat ia menulis kepada jemaat Filipi dari balik jeruji penjara, ia telah tiba di suatu tempat yang tidak bisa ia rencanakan atau paksakan: kedamaian yang sudah terlatih.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: "oklch(88% 0.01 80)", margin: "0 0 24px" }}>
                Di tahap mana kamu sekarang, dalam tantangan kepemimpinan terpentingmu? Bukan di mana kamu ingin berada â€” di mana kamu sebenarnya berada? Perikop ini bukan ajakan untuk melompati tahap-tahap itu. Ini adalah kesaksian bahwa mereka layak untuk dijalani.
              </p>
              <p style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: 18,
                fontStyle: "italic",
                color: "oklch(80% 0.03 80)",
                lineHeight: 1.7,
                borderLeft: `3px solid ${orange}`,
                paddingLeft: 20,
                margin: 0,
              }}>
                Di mana dalam kepemimpinanmu saat ini kamu merasakan jarak antara di mana kamu berada dan di mana kamu tahu kamu perlu berada â€” dan apa artinya tinggal dalam ketidaknyamanan itu cukup lama untuk belajar darinya?
              </p>
            </>
          )}
        </div>
      </div>

      {/* â”€â”€ 7. KEY TAKEAWAYS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{ background: lightGray, padding: "64px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", color: orange, margin: "0 0 8px",
          }}>
            {t("KEY TAKEAWAYS", "POIN UTAMA", lang)}
          </p>
          <h2 style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(24px, 3.5vw, 32px)",
            fontWeight: 600, color: navy, margin: "0 0 32px",
          }}>
            {t("What to carry forward", "Yang perlu kamu bawa", lang)}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {(lang === "en" ? [
              { n: 1, bold: "Awareness of incompetence is the beginning of growth.", rest: " The most dangerous stage is not Stage 2 â€” it is Stage 1, where you have no idea what you do not know. The moment you can see the gap is the moment real learning becomes possible." },
              { n: 2, bold: "Discomfort in Stage 2 is a signal, not a warning.", rest: " The feeling of incompetence that follows genuine awareness is not evidence that something has gone wrong. It is evidence that learning has begun. The leaders who stop here never cross the gap; the ones who press through it are the ones who eventually stop needing to think about it." },
              { n: 3, bold: "Stage 4 mastery creates a teaching challenge.", rest: " When a skill becomes automatic, explaining it requires deliberate effort. You must learn to unpack what you have stopped noticing â€” to re-enter the experience of not knowing â€” in order to develop the people around you who are still back there." },
              { n: 4, bold: "The stages repeat.", rest: " Every new skill, every new culture, every new context returns a leader to Stage 1. Humility is not a virtue for beginners â€” it is the prerequisite for continued growth at every level of mastery." },
            ] : [
              { n: 1, bold: "Kesadaran akan ketidakmampuan adalah awal dari pertumbuhan.", rest: " Tahap yang paling berbahaya bukan Tahap 2 â€” melainkan Tahap 1, di mana kamu tidak tahu apa yang kamu tidak tahu. Momen ketika kamu bisa melihat celah itu adalah momen ketika pembelajaran nyata menjadi mungkin." },
              { n: 2, bold: "Ketidaknyamanan di Tahap 2 adalah sinyal, bukan peringatan.", rest: " Perasaan tidak mampu yang mengikuti kesadaran yang sesungguhnya bukan bukti bahwa sesuatu telah salah. Itu adalah bukti bahwa pembelajaran telah dimulai. Pemimpin yang berhenti di sini tidak pernah melewati celah itu; mereka yang terus maju adalah yang akhirnya tidak perlu lagi memikirkannya." },
              { n: 3, bold: "Penguasaan Tahap 4 menciptakan tantangan pengajaran.", rest: " Ketika sebuah keahlian menjadi otomatis, menjelaskannya membutuhkan upaya yang disengaja. Kamu harus belajar untuk membongkar apa yang telah kamu berhenti perhatikan â€” untuk masuk kembali ke pengalaman tidak tahu â€” agar bisa mengembangkan orang-orang di sekitarmu yang masih ada di sana." },
              { n: 4, bold: "Tahap-tahap ini berulang.", rest: " Setiap keahlian baru, setiap budaya baru, setiap konteks baru membawa seorang pemimpin kembali ke Tahap 1. Kerendahan hati bukan kebajikan untuk pemula â€” itu adalah prasyarat untuk pertumbuhan yang berkelanjutan di setiap tingkat penguasaan." },
            ]).map(item => (
              <div key={item.n} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: 28, fontWeight: 700,
                  color: orange, lineHeight: 1,
                  minWidth: 28, flexShrink: 0, paddingTop: 2,
                }}>
                  {item.n}
                </span>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: bodyText, margin: 0 }}>
                  <strong>{item.bold}</strong>{item.rest}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* â”€â”€ 8. FURTHER READING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{ background: offWhite, padding: "64px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", color: orange, margin: "0 0 8px",
          }}>
            {t("FURTHER READING", "BACAAN LANJUTAN", lang)}
          </p>
          <h2 style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(24px, 3.5vw, 32px)",
            fontWeight: 600, color: navy, margin: "0 0 32px",
          }}>
            {t("Five books worth your time", "Lima buku yang layak dibaca", lang)}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[
              {
                n: 1,
                title: "The Empathic Communicator",
                author: "William C. Howell (1982)",
                desc: lang === "en"
                  ? "The earliest and most rigorous application of the four-stage framework to intercultural learning. Howell maps each stage onto cross-cultural communication competence, making this the foundational text for anyone applying the model to cross-cultural leadership. Essential context for understanding why Stage 2 in a new cultural setting is so different from Stage 2 in skill acquisition."
                  : "Penerapan paling awal dan paling ketat dari kerangka empat tahap untuk pembelajaran antarbudaya. Howell memetakan setiap tahap ke kompetensi komunikasi lintas budaya â€” teks dasar bagi siapa pun yang menerapkan model ini pada kepemimpinan lintas budaya.",
              },
              {
                n: 2,
                title: "Peak: Secrets from the New Science of Expertise",
                author: "Anders Ericsson and Robert Pool (2016)",
                desc: lang === "en"
                  ? "Ericsson's life work on deliberate practice provides the empirical foundation for what makes Stage 3 practice effective. The key finding: not all repetition is equal. Practice that moves a leader from Stage 3 to Stage 4 requires specific goals, immediate feedback, and stretching just beyond the current comfort threshold."
                  : "Karya Ericsson tentang latihan yang disengaja memberikan dasar empiris untuk apa yang membuat latihan Tahap 3 efektif. Temuan utama: tidak semua pengulangan itu sama. Latihan yang memindahkan pemimpin dari Tahap 3 ke Tahap 4 membutuhkan tujuan spesifik, umpan balik langsung, dan peregangan melampaui ambang batas kenyamanan saat ini.",
              },
              {
                n: 3,
                title: "Coaching for Performance",
                author: "John Whitmore (1992, multiple editions)",
                desc: lang === "en"
                  ? "Whitmore explicitly builds his GROW coaching model around the four stages. Of particular value for leaders who manage others through the stages: the distinction between coaching toward conscious competence (Stage 3) and helping a leader access and articulate their Stage 4 knowing for the benefit of others."
                  : "Whitmore secara eksplisit membangun model coaching GROW-nya di sekitar empat tahap. Bernilai bagi pemimpin yang membimbing orang lain: perbedaan antara coaching menuju kompetensi sadar (Tahap 3) dan membantu pemimpin mengakses dan mengartikulasikan pengetahuan Tahap 4 mereka.",
              },
              {
                n: 4,
                title: "The Inner Game of Work",
                author: "Timothy Gallwey (2000)",
                desc: lang === "en"
                  ? "Gallwey's observation that the primary obstacle to moving from Stage 3 to Stage 4 is not lack of skill but self-interference â€” the inner voice that monitors, judges, and over-corrects â€” maps directly onto the Stage 3-to-4 transition in a way that is practically useful for cross-cultural leadership development."
                  : "Pengamatan Gallwey bahwa hambatan utama untuk berpindah dari Tahap 3 ke Tahap 4 bukan kekurangan keahlian tetapi gangguan diri â€” suara batin yang memantau, menghakimi, dan terlalu mengoreksi â€” langsung memetakan transisi Tahap 3-ke-4.",
              },
              {
                n: 5,
                title: "The Culture Map",
                author: "Erin Meyer (2014)",
                desc: lang === "en"
                  ? "Not a book about the four stages model specifically, but the most practically useful companion to applying it in cross-cultural contexts. Meyer's eight-scale framework provides the language for what Stage 4 cross-cultural leaders read instinctively â€” the feedback, persuasion, trust, and disagreement norms that differ so sharply across cultures."
                  : "Bukan buku tentang model empat tahap secara khusus, tetapi pendamping yang paling berguna secara praktis untuk menerapkannya dalam konteks lintas budaya. Kerangka delapan skala Meyer memberikan bahasa untuk apa yang dibaca secara naluriah oleh pemimpin Tahap 4 lintas budaya.",
              },
            ].map(book => (
              <div key={book.n} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: 28, fontWeight: 700,
                  color: orange, lineHeight: 1,
                  minWidth: 28, flexShrink: 0, paddingTop: 2,
                }}>
                  {book.n}
                </span>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: navy, margin: "0 0 2px" }}>
                    {book.title} <span style={{ fontWeight: 400, color: bodyText }}>â€” {book.author}</span>
                  </p>
                  <p style={{ fontSize: 14, lineHeight: 1.75, color: bodyText, margin: 0 }}>
                    {book.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* â”€â”€ 9. SOURCES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{ background: lightGray, padding: "48px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", color: orange,
            margin: "0 0 20px",
            fontVariant: "small-caps" as const,
          }}>
            {t("Sources", "Sumber", lang)}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              "Broadwell, M. M. (1969). Teaching for learning. The Gospel Guardian, February 1969.",
              "Pardoe, T. E. (1923). Learning-progression framework. Cited in historical accounts of competence model origins.",
              "Howell, W. C. (1982). The empathic communicator. Wadsworth Publishing.",
              "Burch, N. (c. 1970s). Four stages of learning a new skill. Gordon Training International.",
              "Ericsson, K. A., & Pool, R. (2016). Peak: Secrets from the new science of expertise. Houghton Mifflin Harcourt.",
              "Baume, D. (2004). Towards the end of stage theories. Learning and Teaching in Higher Education.",
              "Robinson, W. L. (1974). Conscious competency: The mark of a competent instructor. Personnel Journal, 53(7).",
              "Bennett, M. J. (1986). A developmental approach to training for intercultural sensitivity. International Journal of Intercultural Relations, 10(2), 179-196.",
              "Earley, P. C., & Ang, S. (2003). Cultural intelligence: Individual interactions across cultures. Stanford Business Books.",
              "Moore, R. (2010). Commentary on power and the four stages model. Training & Development Journal.",
            ].map((source, i) => (
              <div key={i} style={{ display: "flex", gap: 12 }}>
                <span style={{
                  fontSize: 11, color: orange, fontWeight: 700,
                  minWidth: 20, flexShrink: 0,
                }}>
                  {i + 1}.
                </span>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: bodyText, margin: 0 }}>
                  {source}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* â”€â”€ 10. FROM THE FIELD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{ background: offWhite, padding: "64px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", color: orange, margin: "0 0 8px",
          }}>
            {t("FROM THE FIELD", "DARI LAPANGAN", lang)}
          </p>
          <h2 style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(24px, 3.5vw, 32px)",
            fontWeight: 600, color: navy, margin: "0 0 24px",
          }}>
            {t("A story from practice", "Sebuah kisah dari praktik", lang)}
          </h2>
          <div style={{
            borderLeft: `3px solid ${orange}`,
            paddingLeft: 24,
            margin: "0 0 24px",
          }}>
            <p style={{ fontSize: 15, lineHeight: 1.85, color: bodyText, margin: 0 }}>
              {t(
                "A cross-cultural team leader working in West Africa had spent eighteen months building relationships with local community members. She felt confident â€” meetings were warm, agreements were reached, projects were moving. Then her local counterpart said something that stopped her: \"You know they say yes to you because they respect you, not because they agree.\" She was in Stage 1 â€” and had been for a year and a half. She had no idea. That conversation was the first moment of Stage 2: she could suddenly see a gap she had not known was there. It was uncomfortable enough that she nearly left. Instead, she stayed â€” and spent the next year learning to read agreement and disagreement in the ways they actually showed up in that cultural context. By the time she completed the assignment, she was not just competent. She was the person her organisation sent to help others make the transition she had made.",
                "Seorang pemimpin tim lintas budaya yang bekerja di Afrika Barat telah menghabiskan delapan belas bulan membangun hubungan dengan anggota komunitas lokal. Ia merasa percaya diri â€” pertemuan berjalan hangat, kesepakatan tercapai, proyek berjalan. Kemudian rekan lokalnya mengatakan sesuatu yang membuatnya terhenti: \"Kamu tahu mereka mengatakan ya kepadamu karena mereka menghormatimu, bukan karena mereka setuju.\" Ia berada di Tahap 1 â€” dan sudah selama satu setengah tahun. Ia tidak tahu sama sekali. Percakapan itu adalah momen pertama Tahap 2: ia tiba-tiba bisa melihat celah yang tidak ia tahu ada. Itu cukup tidak nyaman sehingga ia hampir pergi. Sebaliknya, ia tetap tinggal â€” dan menghabiskan setahun berikutnya belajar membaca persetujuan dan ketidaksetujuan dengan cara mereka benar-benar muncul dalam konteks budaya itu. Pada saat ia menyelesaikan tugasnya, ia bukan hanya kompeten. Ia adalah orang yang dikirim organisasinya untuk membantu orang lain melakukan transisi yang telah ia lakukan.",
                lang
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
