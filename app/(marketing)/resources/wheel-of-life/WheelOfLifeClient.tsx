"use client";

import { useState, useTransition, useRef, useCallback } from "react";
import Link from "next/link";
import { saveResourceToDashboard, saveWheelScores } from "../actions";

type Lang = "en" | "id" | "nl";

const tr = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

// SVG wheel constants
const CX = 250, CY = 250, MAX_R = 155;
const LABEL_R = MAX_R + 22;
const GRID_RINGS = [2, 4, 6, 8, 10];

// Segments in clockwise order from top — matches PDF layout
const SEGMENTS = [
  { key: "family",    titleEn: "Family",           titleId: "Keluarga",     titleNl: "Familie",         color: "#3b5fa0", colorFill: "rgba(59,95,160,0.12)", colorLight: "rgba(59,95,160,0.06)" },
  { key: "finance",   titleEn: "Finance",           titleId: "Keuangan",     titleNl: "Financiën",       color: "#c4762a", colorFill: "rgba(196,118,42,0.12)", colorLight: "rgba(196,118,42,0.06)" },
  { key: "relaxation",titleEn: "Relaxation",        titleId: "Relaksasi",    titleNl: "Ontspanning",     color: "#2a8f8f", colorFill: "rgba(42,143,143,0.12)", colorLight: "rgba(42,143,143,0.06)" },
  { key: "ministry",  titleEn: "Ministry",          titleId: "Pelayanan",    titleNl: "Bediening",       color: "#b83820", colorFill: "rgba(184,56,32,0.12)",  colorLight: "rgba(184,56,32,0.06)" },
  { key: "spiritual", titleEn: "Spiritual",         titleId: "Spiritual",    titleNl: "Spiritueel",      color: "#8a6415", colorFill: "rgba(138,100,21,0.12)", colorLight: "rgba(138,100,21,0.06)" },
  { key: "community", titleEn: "Community",         titleId: "Komunitas",    titleNl: "Gemeenschap",     color: "#2a8a64", colorFill: "rgba(42,138,100,0.12)", colorLight: "rgba(42,138,100,0.06)" },
  { key: "learning",  titleEn: "Lifelong Learning", titleId: "Pembelajaran", titleNl: "Levenslang Leren",color: "#6a3a9e", colorFill: "rgba(106,58,158,0.12)", colorLight: "rgba(106,58,158,0.06)" },
  { key: "health",    titleEn: "Health",            titleId: "Kesehatan",    titleNl: "Gezondheid",      color: "#2e8a40", colorFill: "rgba(46,138,64,0.12)",  colorLight: "rgba(46,138,64,0.06)" },
];

const SEGMENT_DETAILS = [
  {
    key: "family",
    descEn: "Quality of relationships and time with family members.",
    descId: "Kualitas hubungan dan waktu bersama keluarga.",
    descNl: "Kwaliteit van relaties en tijd met familieleden.",
    expandEn: "This covers your marriage, parent-child relationships, and extended family connections. A God-honoring family life is built on intentional investment — not just presence, but quality time, emotional attunement, and shared faith.",
    expandId: "Ini mencakup pernikahan, hubungan orang tua-anak, dan koneksi keluarga besar. Kehidupan keluarga yang memuliakan Tuhan dibangun di atas investasi yang disengaja — bukan sekadar kehadiran, tetapi waktu berkualitas, kepekaan emosional, dan iman bersama.",
    expandNl: "Dit omvat uw huwelijk, ouder-kindrelaties en contacten met de bredere familie. Een God-erende familieleven is gebouwd op bewuste investering — niet alleen aanwezig zijn, maar kwaliteitstijd, emotionele afstemming en gedeeld geloof.",
    questionsEn: ["Are you present — truly present — with your family?", "Are your most important relationships growing or drifting?", "Are you modeling faith, integrity, and love at home?"],
    questionsId: ["Apakah Anda hadir — benar-benar hadir — bersama keluarga?", "Apakah hubungan terpenting Anda tumbuh atau memudar?", "Apakah Anda menjadi contoh iman, integritas, dan kasih di rumah?"],
    questionsNl: ["Bent u aanwezig — echt aanwezig — bij uw familie?", "Groeien uw belangrijkste relaties of vervagen ze?", "Bent u een voorbeeld van geloof, integriteit en liefde thuis?"],
  },
  {
    key: "finance",
    descEn: "Financial stability, budgeting, and satisfaction with your financial state.",
    descId: "Stabilitas keuangan, penganggaran, dan kepuasan kondisi keuangan.",
    descNl: "Financiële stabiliteit, budgettering en tevredenheid over uw financiële situatie.",
    expandEn: "Financial health is not about wealth — it's about stewardship. Are you living within your means, giving generously, saving wisely, and free from the anxiety of financial mismanagement? Money is a tool; this dimension asks how well you're stewarding it.",
    expandId: "Kesehatan keuangan bukan tentang kekayaan — melainkan tentang pengelolaan. Apakah Anda hidup sesuai kemampuan, memberi dengan murah hati, menabung dengan bijak, dan bebas dari kecemasan salah kelola keuangan?",
    expandNl: "Financiële gezondheid gaat niet over rijkdom — het gaat over rentmeesterschap. Leeft u binnen uw middelen, geeft u vrijgevig, spaart u verstandig en bent u vrij van de angst voor financieel wanbeheer?",
    questionsEn: ["Do you have a budget and stick to it?", "Are you free from financial anxiety?", "Are you giving generously as an act of worship?"],
    questionsId: ["Apakah Anda memiliki anggaran dan mengikutinya?", "Apakah Anda bebas dari kecemasan finansial?", "Apakah Anda memberi dengan murah hati sebagai bentuk ibadah?"],
    questionsNl: ["Heeft u een budget en houdt u zich eraan?", "Bent u vrij van financiële angst?", "Geeft u vrijgevig als een daad van aanbidding?"],
  },
  {
    key: "relaxation",
    descEn: "Your ability to rest, recharge, and enjoy leisure activities.",
    descId: "Kemampuan beristirahat, mengisi ulang energi, dan menikmati waktu santai.",
    descNl: "Uw vermogen om te rusten, op te laden en te genieten van vrije tijdsactiviteiten.",
    expandEn: "Rest is not laziness — it's obedience. God rested on the seventh day and commanded us to do the same. This dimension explores whether you are caring for your soul and body through sabbath rhythms, hobbies, play, and genuine restoration.",
    expandId: "Istirahat bukan kemalasan — ini adalah ketaatan. Tuhan beristirahat pada hari ketujuh dan memerintahkan kita melakukan hal yang sama. Dimensi ini mengeksplorasi apakah Anda merawat jiwa dan tubuh melalui ritme sabat, hobi, bermain, dan restorasi sejati.",
    expandNl: "Rust is geen luiheid — het is gehoorzaamheid. God rustte op de zevende dag en gebood ons hetzelfde te doen. Deze dimensie onderzoekt of u voor uw ziel en lichaam zorgt via sabbatritmiek, hobby's, spel en echte herstel.",
    questionsEn: ["Do you regularly take Sabbath rest?", "Do you have activities that genuinely recharge you?", "Is rest guilt-free in your life, or does it feel unproductive?"],
    questionsId: ["Apakah Anda secara teratur beristirahat pada hari Sabat?", "Apakah Anda memiliki aktivitas yang benar-benar mengisi ulang energi?", "Apakah istirahat terasa bebas bersalah, atau terasa tidak produktif?"],
    questionsNl: ["Neemt u regelmatig sabbatrust?", "Heeft u activiteiten die u echt opladen?", "Is rusten schuldvrij in uw leven, of voelt het onproductief?"],
  },
  {
    key: "ministry",
    descEn: "Involvement and satisfaction with serving others and fulfilling your calling.",
    descId: "Keterlibatan dan kepuasan melayani orang lain dan memenuhi panggilan.",
    descNl: "Betrokkenheid bij en tevredenheid over het dienen van anderen en het vervullen van uw roeping.",
    expandEn: "We are created to serve. Ministry is not only for pastors — it's for every follower of Christ. This dimension asks whether you are using your gifts, time, and platform to advance the Kingdom. Are you serving from overflow, or running on empty?",
    expandId: "Kita diciptakan untuk melayani. Pelayanan bukan hanya untuk pendeta — ini untuk setiap pengikut Kristus. Dimensi ini menanyakan apakah Anda menggunakan karunia, waktu, dan platform Anda untuk memajukan Kerajaan.",
    expandNl: "We zijn geschapen om te dienen. Bediening is niet alleen voor voorgangers — het is voor elke volgeling van Christus. Deze dimensie vraagt of u uw gaven, tijd en platform gebruikt om het Koninkrijk te bevorderen. Dient u vanuit overvloed, of werkt u op leeg?",
    questionsEn: ["Are you actively serving in your church or community?", "Does your ministry flow from calling or obligation?", "Are you investing in others' growth and discipleship?"],
    questionsId: ["Apakah Anda aktif melayani di gereja atau komunitas Anda?", "Apakah pelayanan Anda mengalir dari panggilan atau kewajiban?", "Apakah Anda berinvestasi dalam pertumbuhan dan pemuridan orang lain?"],
    questionsNl: ["Dient u actief in uw kerk of gemeenschap?", "Vloeit uw bediening voort uit roeping of verplichting?", "Investeert u in de groei en discipelschap van anderen?"],
  },
  {
    key: "spiritual",
    descEn: "Connection to your faith, spiritual practices, and relationship with God.",
    descId: "Hubungan dengan iman, praktik spiritual, dan relasi dengan Tuhan.",
    descNl: "Verbinding met uw geloof, spirituele praktijken en relatie met God.",
    expandEn: "This is the center of the wheel. How is your relationship with God? Not your theology, your title, or your church attendance — your actual, lived relationship. Are you reading Scripture? Praying? Listening? Surrendering? Everything else flows from here.",
    expandId: "Ini adalah pusat dari roda. Bagaimana hubungan Anda dengan Tuhan? Bukan teologi Anda, gelar Anda, atau kehadiran gereja — melainkan hubungan nyata yang Anda jalani. Apakah Anda membaca Kitab Suci? Berdoa? Mendengarkan? Menyerahkan diri?",
    expandNl: "Dit is het centrum van het wiel. Hoe is uw relatie met God? Niet uw theologie, uw titel, of uw kerkbezoek — uw werkelijke, geleefde relatie. Leest u de Schrift? Bidt u? Luistert u? Geeft u zich over? Alles vloeit van hieruit.",
    questionsEn: ["Is your relationship with God growing or stagnant?", "Do you have regular practices of prayer, Scripture, and worship?", "Are you surrendering control, or trying to manage life on your own terms?"],
    questionsId: ["Apakah hubungan Anda dengan Tuhan bertumbuh atau stagnan?", "Apakah Anda memiliki kebiasaan doa, Kitab Suci, dan penyembahan?", "Apakah Anda menyerahkan kendali, atau mencoba mengelola hidup sendiri?"],
    questionsNl: ["Groeit uw relatie met God of stagneert ze?", "Heeft u regelmatige gewoonten van gebed, Bijbellezen en aanbidding?", "Geeft u controle over, of probeert u het leven op eigen voorwaarden te beheren?"],
  },
  {
    key: "community",
    descEn: "Relationships outside family and contributions to the broader community.",
    descId: "Hubungan di luar keluarga dan kontribusi kepada komunitas yang lebih luas.",
    descNl: "Relaties buiten het gezin en bijdragen aan de bredere gemeenschap.",
    expandEn: "We were not designed to live in isolation. Community includes friendships, peer groups, neighbors, and the broader social fabric around you. Are you investing in meaningful relationships? Are you known and knowing? Do you contribute to something larger than yourself?",
    expandId: "Kita tidak dirancang untuk hidup terisolasi. Komunitas mencakup persahabatan, kelompok sebaya, tetangga, dan jaringan sosial yang lebih luas. Apakah Anda berinvestasi dalam hubungan yang bermakna?",
    expandNl: "We zijn niet ontworpen om in isolatie te leven. Gemeenschap omvat vriendschappen, peergroepen, buren en het bredere sociale weefsel om u heen. Investeert u in betekenisvolle relaties? Bent u gekend en kent u anderen?",
    questionsEn: ["Do you have deep, honest friendships?", "Are you known by others, and do you know others well?", "Are you contributing to community beyond your own household?"],
    questionsId: ["Apakah Anda memiliki persahabatan yang dalam dan jujur?", "Apakah Anda dikenal orang lain, dan apakah Anda mengenal mereka dengan baik?", "Apakah Anda berkontribusi kepada komunitas di luar rumah tangga Anda?"],
    questionsNl: ["Heeft u diepe, eerlijke vriendschappen?", "Bent u bekend bij anderen, en kent u anderen goed?", "Draagt u bij aan gemeenschap buiten uw eigen huishouden?"],
  },
  {
    key: "learning",
    descEn: "Commitment to personal growth through education and skill-building.",
    descId: "Komitmen terhadap pertumbuhan pribadi melalui pendidikan dan pengembangan.",
    descNl: "Betrokkenheid bij persoonlijke groei door educatie en vaardigheids­ontwikkeling.",
    expandEn: "Leaders are readers. Lifelong learners remain humble, curious, and sharp. This dimension asks whether you are growing — through books, mentors, formal study, experience, or reflection. Stagnation is dangerous; intentional learning is a discipline worth protecting.",
    expandId: "Pemimpin adalah pembaca. Pelajar sepanjang hayat tetap rendah hati, penasaran, dan tajam. Dimensi ini menanyakan apakah Anda bertumbuh — melalui buku, mentor, studi formal, pengalaman, atau refleksi.",
    expandNl: "Leiders zijn lezers. Levenslange leerders blijven bescheiden, nieuwsgierig en scherp. Deze dimensie vraagt of u groeit — door boeken, mentoren, formele studie, ervaring of reflectie. Stagnatie is gevaarlijk; bewust leren is een discipline waard om te beschermen.",
    questionsEn: ["Are you actively learning something new?", "Do you have mentors or peers who challenge you to grow?", "Is learning a scheduled priority, or something that happens by accident?"],
    questionsId: ["Apakah Anda aktif mempelajari sesuatu yang baru?", "Apakah Anda memiliki mentor atau rekan yang menantang Anda untuk bertumbuh?", "Apakah belajar merupakan prioritas terjadwal, atau sesuatu yang terjadi secara kebetulan?"],
    questionsNl: ["Leert u actief iets nieuws?", "Heeft u mentoren of collega's die u uitdagen te groeien?", "Is leren een geplande prioriteit, of iets wat toevallig gebeurt?"],
  },
  {
    key: "health",
    descEn: "Physical and mental well-being, fitness, energy levels, and emotional health.",
    descId: "Kesejahteraan fisik dan mental, kebugaran, energi, dan kesehatan emosional.",
    descNl: "Fysiek en mentaal welzijn, conditie, energieniveau en emotionele gezondheid.",
    expandEn: "Your body is a temple. Leadership requires energy, and energy requires care. This dimension covers sleep, exercise, nutrition, mental health, and emotional regulation. You cannot lead well from a depleted body or a unprocessed soul. Physical neglect is not spiritual virtue.",
    expandId: "Tubuh Anda adalah bait. Kepemimpinan membutuhkan energi, dan energi membutuhkan perawatan. Dimensi ini mencakup tidur, olahraga, nutrisi, kesehatan mental, dan regulasi emosional.",
    expandNl: "Uw lichaam is een tempel. Leiderschap vereist energie, en energie vereist zorg. Deze dimensie omvat slaap, beweging, voeding, geestelijke gezondheid en emotionele regulatie. U kunt niet goed leiden vanuit een uitgeput lichaam of een onverwerkte ziel.",
    questionsEn: ["Are you sleeping enough and exercising regularly?", "Are you managing stress, or is stress managing you?", "Are you attending to your emotional and mental health?"],
    questionsId: ["Apakah Anda tidur cukup dan berolahraga secara teratur?", "Apakah Anda mengelola stres, atau stres yang mengelola Anda?", "Apakah Anda memperhatikan kesehatan emosional dan mental Anda?"],
    questionsNl: ["Slaapt u voldoende en beweegt u regelmatig?", "Beheert u stress, of beheert stress u?", "Besteedt u aandacht aan uw emotionele en geestelijke gezondheid?"],
  },
];

const HOW_TO_STEPS = [
  {
    num: "01",
    titleEn: "Read Each Dimension", titleId: "Baca Setiap Dimensi", titleNl: "Lees Elke Dimensie",
    descEn: "Work through the 8 segments below. Read the description and reflect on your current state before you score anything.",
    descId: "Kerjakan 8 segmen di bawah ini. Baca deskripsi dan renungkan kondisi Anda saat ini sebelum memberi skor apa pun.",
    descNl: "Werk de 8 segmenten hieronder door. Lees de beschrijving en reflecteer op uw huidige situatie voordat u scoort.",
  },
  {
    num: "02",
    titleEn: "Be Brutally Honest", titleId: "Jujur Sepenuhnya", titleNl: "Wees Eerlijk",
    descEn: "Score where you actually are — not where you want to be. Accurate assessment is the beginning of real change.",
    descId: "Nilai di mana Anda sebenarnya berada — bukan di mana Anda ingin berada. Penilaian yang akurat adalah awal dari perubahan nyata.",
    descNl: "Scoor waar u werkelijk staat — niet waar u wilt staan. Nauwkeurige beoordeling is het begin van echte verandering.",
  },
  {
    num: "03",
    titleEn: "Rate 1–10", titleId: "Nilai 1–10", titleNl: "Scoor 1–10",
    descEn: "1 = completely neglected, 10 = thriving and intentional. Most dimensions will land somewhere in the middle.",
    descId: "1 = benar-benar diabaikan, 10 = berkembang dan disengaja. Kebanyakan dimensi akan berada di tengah.",
    descNl: "1 = volledig verwaarloosd, 10 = bloeiend en intentioneel. De meeste dimensies zullen ergens in het midden landen.",
  },
  {
    num: "04",
    titleEn: "Read Your Shape", titleId: "Baca Bentuk Anda", titleNl: "Lees je Vorm",
    descEn: "A balanced wheel rolls smoothly. An uneven shape reveals where energy is leaking and where to invest next.",
    descId: "Roda yang seimbang bergulir lancar. Bentuk yang tidak merata mengungkapkan di mana energi bocor dan di mana perlu investasi.",
    descNl: "Een evenwichtig wiel rolt soepel. Een ongelijkmatige vorm onthult waar energie lekt en waar u als volgende moet investeren.",
  },
  {
    num: "05",
    titleEn: "Build an Action Plan", titleId: "Bangun Rencana Aksi", titleNl: "Maak een Actieplan",
    descEn: "For each low-scoring area: What are you thankful for? What's the challenge? What one action will you take?",
    descId: "Untuk setiap area dengan skor rendah: Apa yang Anda syukuri? Apa tantangannya? Satu tindakan apa yang akan Anda ambil?",
    descNl: "Voor elk laagscorend gebied: Waar bent u dankbaar voor? Wat is de uitdaging? Welke ene actie gaat u ondernemen?",
  },
  {
    num: "06",
    titleEn: "Review Regularly", titleId: "Tinjau Secara Teratur", titleNl: "Beoordeel Regelmatig",
    descEn: "Reassess every 3 months. Save your scores to track progress over time and share with a coach or your team.",
    descId: "Nilai ulang setiap 3 bulan. Simpan skor untuk melacak kemajuan dari waktu ke waktu dan bagikan kepada pelatih atau tim Anda.",
    descNl: "Herevalueer elke 3 maanden. Sla uw scores op om voortgang bij te houden en deel ze met een coach of uw team.",
  },
];

function getAngleRad(i: number) {
  return (-90 + i * 45) * Math.PI / 180;
}

function getPoint(i: number, score: number): [number, number] {
  const r = (score / 10) * MAX_R;
  return [
    CX + r * Math.cos(getAngleRad(i)),
    CY + r * Math.sin(getAngleRad(i)),
  ];
}

function sectorPath(i: number, r: number): string {
  const a1 = (-90 + i * 45 - 22.5) * Math.PI / 180;
  const a2 = (-90 + i * 45 + 22.5) * Math.PI / 180;
  const x1 = CX + r * Math.cos(a1);
  const y1 = CY + r * Math.sin(a1);
  const x2 = CX + r * Math.cos(a2);
  const y2 = CY + r * Math.sin(a2);
  return `M ${CX} ${CY} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
}

function scorePolygonPoints(scores: number[]): string {
  return scores.map((s, i) => {
    const [x, y] = getPoint(i, s);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");
}

function getLabelPos(i: number): { x: number; y: number; anchor: "middle" | "start" | "end"; dy: number } {
  const angle = -90 + i * 45;
  const r = LABEL_R;
  const rad = angle * Math.PI / 180;
  const x = CX + r * Math.cos(rad);
  const y = CY + r * Math.sin(rad);
  let anchor: "middle" | "start" | "end" = "middle";
  let dy = 0;
  if (angle > -22.5 && angle < 22.5) { anchor = "start"; }
  else if (angle > 22.5 && angle < 67.5) { anchor = "start"; }
  else if (angle > 67.5 && angle < 112.5) { anchor = "middle"; dy = 14; }
  else if (angle > 112.5 && angle < 157.5) { anchor = "end"; }
  else if (angle > 157.5 || angle < -157.5) { anchor = "end"; }
  else if (angle < -112.5 && angle > -157.5) { anchor = "end"; }
  else if (angle < -67.5 && angle > -112.5) { anchor = "middle"; dy = -6; }
  else if (angle < -22.5 && angle > -67.5) { anchor = "start"; }
  return { x, y, anchor, dy };
}

const DEFAULT_SCORES: Record<string, number> = {
  family: 5, finance: 5, relaxation: 5, ministry: 5,
  spiritual: 5, community: 5, learning: 5, health: 5,
};

export default function WheelOfLifeClient({
  userPathway,
  isSaved,
  savedScores,
}: {
  userPathway: string | null;
  isSaved: boolean;
  savedScores?: Record<string, number> | null;
}) {
  const [lang, setLang] = useState<Lang>("en");
  const [scores, setScores] = useState<Record<string, number>>(savedScores ?? DEFAULT_SCORES);
  const [saved, setSaved] = useState(isSaved);
  const [scoresSaved, setScoresSaved] = useState(!!savedScores);
  const [expandedSegment, setExpandedSegment] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isSavingScores, startSavingScores] = useTransition();
  const svgRef = useRef<SVGSVGElement>(null);

  const t = (en: string, id: string, nl: string) => tr(en, id, nl, lang);

  function handleSave() {
    startTransition(async () => {
      await saveResourceToDashboard("wheel-of-life");
      setSaved(true);
    });
  }

  function handleSaveScores() {
    startSavingScores(async () => {
      await saveWheelScores(scores);
      setScoresSaved(true);
    });
  }

  const handleDownload = useCallback(() => {
    if (!svgRef.current) return;
    const svgEl = svgRef.current;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgEl);
    const svgWithDecl = `<?xml version="1.0" encoding="UTF-8"?>\n${svgStr}`;

    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 500;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    const blob = new Blob([svgWithDecl], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      ctx.fillStyle = "#f8f7f4";
      ctx.fillRect(0, 0, 500, 500);
      ctx.drawImage(img, 0, 0, 500, 500);
      URL.revokeObjectURL(url);
      const link = document.createElement("a");
      link.download = "wheel-of-life.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = url;
  }, []);

  const orderedScores = SEGMENTS.map(s => scores[s.key] ?? 5);
  const avg = (Object.values(scores).reduce((a, b) => a + b, 0) / 8).toFixed(1);

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: "oklch(97% 0.005 260)", minHeight: "100vh" }}>

      {/* HERO */}
      <section style={{ background: "oklch(22% 0.10 260)", padding: "80px 24px 72px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
            <Link href="/resources" style={{ fontSize: 13, color: "oklch(65% 0.08 260)", textDecoration: "none", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              ← {t("All Resources", "Semua Sumber Daya", "Alle Bronnen")}
            </Link>
            <div style={{ display: "flex", gap: 8 }}>
              {(["en", "id", "nl"] as Lang[]).map(l => (
                <button key={l} onClick={() => setLang(l)} style={{ padding: "5px 14px", borderRadius: 4, border: "1px solid", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer", background: lang === l ? "oklch(65% 0.15 45)" : "transparent", color: lang === l ? "oklch(15% 0.05 45)" : "oklch(65% 0.06 260)", borderColor: lang === l ? "oklch(65% 0.15 45)" : "oklch(42% 0.08 260)" }}>{l.toUpperCase()}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", background: "oklch(65% 0.15 45 / 0.12)", padding: "4px 10px", borderRadius: 4 }}>Worksheet</span>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(72% 0.05 260)", background: "oklch(55% 0.05 260 / 0.20)", padding: "4px 10px", borderRadius: 4 }}>EN · ID · NL</span>
          </div>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 600, color: "oklch(96% 0.005 80)", margin: "0 0 20px", lineHeight: 1.1 }}>
            {t("The Wheel of Life", "Roda Kehidupan", "Het Levenswiel")}
          </h1>
          <p style={{ fontSize: 17, color: "oklch(72% 0.05 260)", lineHeight: 1.7, maxWidth: 620, marginBottom: 40 }}>
            {t(
              "A holistic self-assessment covering 8 dimensions of a God-honoring life. Understand where you're thriving, where you're leaking energy, and what to do about it.",
              "Penilaian diri holistik yang mencakup 8 dimensi kehidupan yang memuliakan Tuhan. Pahami di mana Anda berkembang, di mana energi Anda bocor, dan apa yang harus dilakukan.",
              "Een holistische zelfevaluatie over 8 dimensies van een God-ererend leven. Begrijp waar u bloeit, waar u energie lekt en wat u eraan kunt doen."
            )}
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {!saved ? (
              <button onClick={handleSave} disabled={isPending} style={{ background: "transparent", color: "oklch(85% 0.04 260)", padding: "13px 28px", borderRadius: 6, fontWeight: 600, fontSize: 14, border: "1px solid oklch(42% 0.08 260)", cursor: "pointer" }}>
                {isPending ? t("Saving…", "Menyimpan…", "Opslaan…") : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
              </button>
            ) : (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "oklch(65% 0.15 145)", fontSize: 14, fontWeight: 600, padding: "13px 0" }}>
                ✓ {t("Saved to Dashboard", "Tersimpan di Dashboard", "Opgeslagen in Dashboard")}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* WHAT IS THE WHEEL */}
      <section style={{ background: "oklch(94% 0.008 260)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 20px" }}>
            {t("What Is the Wheel of Life?", "Apa Itu Roda Kehidupan?", "Wat Is het Levenswiel?")}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 28 }}>
            <div>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "oklch(32% 0.06 260)", margin: "0 0 20px" }}>
                {t(
                  "The Wheel of Life is a coaching tool that gives you a bird's-eye view of your life — not just your career or ministry, but the whole person God created you to be.",
                  "Roda Kehidupan adalah alat pembinaan yang memberi Anda pandangan luas tentang hidup Anda — bukan hanya karier atau pelayanan, tetapi seluruh pribadi yang Tuhan ciptakan.",
                  "Het Levenswiel is een coachingstool die u een vogelperspectief op uw leven geeft — niet alleen uw carrière of bediening, maar de hele persoon die God u heeft geschapen te zijn."
                )}
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "oklch(32% 0.06 260)", margin: "0 0 20px" }}>
                {t(
                  "It works by dividing life into 8 key dimensions. You rate each one honestly on a scale of 1 to 10. The resulting shape on the wheel reveals where you're thriving and where you're running on empty.",
                  "Cara kerjanya dengan membagi kehidupan menjadi 8 dimensi kunci. Anda menilai masing-masing dengan jujur pada skala 1 hingga 10. Bentuk yang dihasilkan pada roda mengungkapkan di mana Anda berkembang dan di mana Anda kehabisan tenaga.",
                  "Het werkt door het leven in 8 sleuteldimensies te verdelen. U beoordeelt elke dimensie eerlijk op een schaal van 1 tot 10. De resulterende vorm op het wiel onthult waar u bloeit en waar u op leeg draait."
                )}
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "oklch(32% 0.06 260)", margin: 0 }}>
                {t(
                  "A perfectly balanced wheel rolls smoothly. An uneven wheel creates friction. This tool helps you identify the friction — and choose where to invest next.",
                  "Roda yang seimbang sempurna bergulir lancar. Roda yang tidak merata menciptakan gesekan. Alat ini membantu Anda mengidentifikasi gesekan — dan memilih di mana harus berinvestasi selanjutnya.",
                  "Een perfect evenwichtig wiel rolt soepel. Een ongelijkmatig wiel creëert wrijving. Dit instrument helpt u de wrijving te identificeren — en te kiezen waar u als volgende in investeert."
                )}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                {
                  color: "#3b5fa0",
                  titleEn: "Relational", titleId: "Relasional", titleNl: "Relationeel",
                  itemsEn: "Family · Community", itemsId: "Keluarga · Komunitas", itemsNl: "Familie · Gemeenschap",
                },
                {
                  color: "#8a6415",
                  titleEn: "Spiritual", titleId: "Spiritual", titleNl: "Spiritueel",
                  itemsEn: "Spiritual · Ministry", itemsId: "Spiritual · Pelayanan", itemsNl: "Spiritueel · Bediening",
                },
                {
                  color: "#2a8a64",
                  titleEn: "Physical & Mental", titleId: "Fisik & Mental", titleNl: "Fysiek & Mentaal",
                  itemsEn: "Health · Relaxation", itemsId: "Kesehatan · Relaksasi", itemsNl: "Gezondheid · Ontspanning",
                },
                {
                  color: "#c4762a",
                  titleEn: "Developmental", titleId: "Pengembangan", titleNl: "Ontwikkeling",
                  itemsEn: "Finance · Lifelong Learning", itemsId: "Keuangan · Pembelajaran", itemsNl: "Financiën · Levenslang Leren",
                },
              ].map(cat => (
                <div key={cat.titleEn} style={{ background: "white", borderRadius: 8, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 4px oklch(20% 0.06 260 / 0.05)" }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: cat.color }}>{t(cat.titleEn, cat.titleId, cat.titleNl)}</span>
                    <span style={{ fontSize: 13, color: "oklch(44% 0.06 260)", marginLeft: 8 }}>{t(cat.itemsEn, cat.itemsId, cat.itemsNl)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* THE 8 DIMENSIONS */}
      <section style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
            {t("The 8 Dimensions", "8 Dimensi", "De 8 Dimensies")}
          </h2>
          <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", marginBottom: 40, lineHeight: 1.65 }}>
            {t(
              "Read through each dimension before you rate. Understanding what each covers leads to more honest and useful scores.",
              "Bacalah setiap dimensi sebelum memberi nilai. Memahami apa yang dicakup masing-masing menghasilkan skor yang lebih jujur dan berguna.",
              "Lees elke dimensie door voordat u beoordeelt. Begrijpen wat elke dimensie omvat, leidt tot eerlijkere en nuttigere scores."
            )}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {SEGMENT_DETAILS.map((seg, i) => {
              const match = SEGMENTS.find(s => s.key === seg.key)!;
              const isOpen = expandedSegment === seg.key;
              return (
                <div key={seg.key} style={{ background: isOpen ? "white" : "oklch(97.5% 0.005 260)", borderRadius: 10, overflow: "hidden", boxShadow: isOpen ? "0 2px 12px oklch(20% 0.06 260 / 0.08)" : "none", transition: "box-shadow 0.2s", marginBottom: isOpen ? 8 : 0 }}>
                  <button
                    onClick={() => setExpandedSegment(isOpen ? null : seg.key)}
                    style={{ width: "100%", padding: "18px 24px", background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 16, textAlign: "left" }}
                  >
                    <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 600, color: "oklch(65% 0.15 45)", lineHeight: 1, flexShrink: 0, minWidth: 32 }}>{String(i + 1).padStart(2, "0")}</span>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: match.color, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "oklch(22% 0.10 260)", letterSpacing: "0.02em" }}>
                        {t(match.titleEn, match.titleId, match.titleNl)}
                      </span>
                      <span style={{ fontSize: 13, color: "oklch(52% 0.06 260)", marginLeft: 10 }}>
                        {t(seg.descEn, seg.descId, seg.descNl)}
                      </span>
                    </div>
                    <span style={{ fontSize: 16, color: "oklch(52% 0.06 260)", flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: "0 24px 24px 80px" }}>
                      <p style={{ fontSize: 15, lineHeight: 1.8, color: "oklch(32% 0.06 260)", margin: "0 0 20px" }}>
                        {t(seg.expandEn, seg.expandId, seg.expandNl)}
                      </p>
                      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: match.color, margin: "0 0 10px" }}>
                        {t("Reflection Questions", "Pertanyaan Refleksi", "Reflectievragen")}
                      </p>
                      <ul style={{ margin: 0, padding: "0 0 0 4px", listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                        {(lang === "en" ? seg.questionsEn : lang === "id" ? seg.questionsId : seg.questionsNl).map((q, qi) => (
                          <li key={qi} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: match.color, flexShrink: 0, marginTop: 7 }} />
                            <span style={{ fontSize: 14, lineHeight: 1.6, color: "oklch(38% 0.06 260)", fontStyle: "italic" }}>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW TO USE */}
      <section style={{ background: "oklch(94% 0.008 260)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
            {t("How to Use This Tool", "Cara Menggunakan Alat Ini", "Hoe Dit Instrument te Gebruiken")}
          </h2>
          <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", marginBottom: 40, lineHeight: 1.65 }}>
            {t(
              "Six steps to get the most from your Wheel of Life assessment.",
              "Enam langkah untuk mendapatkan manfaat maksimal dari penilaian Roda Kehidupan Anda.",
              "Zes stappen om het meeste uit uw Levenswiel-beoordeling te halen."
            )}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {HOW_TO_STEPS.map(step => (
              <div key={step.num} style={{ background: "white", borderRadius: 10, padding: "24px", boxShadow: "0 1px 8px oklch(20% 0.06 260 / 0.07)" }}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 36, fontWeight: 600, color: "oklch(65% 0.15 45)", lineHeight: 1, flexShrink: 0 }}>{step.num}</span>
                  <div>
                    <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, color: "oklch(22% 0.10 260)", margin: "0 0 8px" }}>
                      {t(step.titleEn, step.titleId, step.titleNl)}
                    </h3>
                    <p style={{ fontSize: 13, lineHeight: 1.65, color: "oklch(42% 0.06 260)", margin: 0 }}>
                      {t(step.descEn, step.descId, step.descNl)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACTION PLAN FRAMEWORK */}
      <section style={{ padding: "72px 24px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
          {t("Your Action Plan Framework", "Kerangka Rencana Aksi Anda", "Uw Actieplanraamwerk")}
        </h2>
        <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", marginBottom: 40, lineHeight: 1.65 }}>
          {t(
            "For each segment, work through these three questions. Download the PDF for the full worksheet.",
            "Untuk setiap segmen, kerjakan tiga pertanyaan ini. Unduh PDF untuk lembar kerja lengkap.",
            "Werk voor elk segment deze drie vragen door. Download de PDF voor het volledige werkblad."
          )}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {[
            {
              num: "01", color: "#2e8a40",
              labelEn: "Gratitude", labelId: "Syukur", labelNl: "Dankbaarheid",
              questionEn: "What are you thankful for in this area?",
              questionId: "Apa yang Anda syukuri di area ini?",
              questionNl: "Waar bent u dankbaar voor op dit gebied?",
              hintEn: "Start with thanksgiving — it shifts your perspective before you assess.",
              hintId: "Mulailah dengan syukur — itu mengubah perspektif Anda sebelum menilai.",
              hintNl: "Begin met dankzegging — het verandert uw perspectief voordat u beoordeelt.",
            },
            {
              num: "02", color: "#b83820",
              labelEn: "Challenge", labelId: "Tantangan", labelNl: "Uitdaging",
              questionEn: "What is your challenge, frustration, or concern?",
              questionId: "Apa tantangan, frustrasi, atau kekhawatiran Anda?",
              questionNl: "Wat is uw uitdaging, frustratie of zorg?",
              hintEn: "Name what's hard — clarity about the problem is the first step.",
              hintId: "Namai apa yang sulit — kejelasan tentang masalah adalah langkah pertama.",
              hintNl: "Benoem wat moeilijk is — helderheid over het probleem is de eerste stap.",
            },
            {
              num: "03", color: "#3b5fa0",
              labelEn: "God-Honoring Action", labelId: "Tindakan Memuliakan Tuhan", labelNl: "God-Erende Actie",
              questionEn: "What one action will lead to God-honoring results?",
              questionId: "Satu tindakan apa yang akan menghasilkan hasil yang memuliakan Tuhan?",
              questionNl: "Welke ene actie zal leiden tot God-erende resultaten?",
              hintEn: "Keep it concrete — one action, not a project plan.",
              hintId: "Buatlah konkret — satu tindakan, bukan rencana proyek.",
              hintNl: "Houd het concreet — één actie, geen projectplan.",
            },
          ].map(item => (
            <div key={item.num} style={{ background: "white", borderRadius: 10, padding: "28px", boxShadow: "0 1px 8px oklch(20% 0.06 260 / 0.07)" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 16 }}>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 40, fontWeight: 600, color: item.color, lineHeight: 1, flexShrink: 0 }}>{item.num}</span>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: item.color, margin: "0 0 4px" }}>
                    {t(item.labelEn, item.labelId, item.labelNl)}
                  </p>
                  <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 600, color: "oklch(22% 0.10 260)", margin: 0, lineHeight: 1.3, fontStyle: "italic" }}>
                    &ldquo;{t(item.questionEn, item.questionId, item.questionNl)}&rdquo;
                  </h3>
                </div>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.65, color: "oklch(48% 0.06 260)", margin: 0 }}>
                {t(item.hintEn, item.hintId, item.hintNl)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE WHEEL — LAST */}
      <section style={{ background: "oklch(94% 0.008 260)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1020, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
            {t("Rate Your Wheel", "Nilai Roda Anda", "Beoordeel Uw Wiel")}
          </h2>
          <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", marginBottom: 48, lineHeight: 1.65 }}>
            {t(
              "Now that you've read through each dimension, rate your current state honestly. Select 1–10 for each segment and watch your wheel take shape.",
              "Sekarang setelah Anda membaca setiap dimensi, nilai kondisi Anda saat ini dengan jujur. Pilih 1–10 untuk setiap segmen dan lihat roda Anda terbentuk.",
              "Nu u elke dimensie heeft doorgelezen, beoordeelt u uw huidige situatie eerlijk. Selecteer 1–10 voor elk segment en zie uw wiel vorm krijgen."
            )}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 40, alignItems: "start" }}>

            {/* SVG WHEEL */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <svg
                ref={svgRef}
                viewBox="0 0 500 500"
                width="500"
                height="500"
                style={{ maxWidth: "100%", height: "auto" }}
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="500" height="500" fill="#f8f7f4" />
                {SEGMENTS.map((seg, i) => (
                  <path key={seg.key} d={sectorPath(i, MAX_R)} fill={seg.colorFill} />
                ))}
                {GRID_RINGS.map(ring => (
                  <circle key={ring} cx={CX} cy={CY} r={(ring / 10) * MAX_R} fill="none" stroke="#1b3a6b18" strokeWidth={ring === 10 ? 1.5 : 0.8} />
                ))}
                {[2, 4, 6, 8].map(ring => (
                  <text key={ring} x={CX + 3} y={CY - (ring / 10) * MAX_R + 4} fontSize="8" fill="#1b3a6b55" fontFamily="Montserrat, sans-serif">{ring}</text>
                ))}
                {SEGMENTS.map((seg, i) => {
                  const [x, y] = getPoint(i, 10);
                  return <line key={seg.key} x1={CX} y1={CY} x2={x} y2={y} stroke="#1b3a6b15" strokeWidth={0.8} />;
                })}
                <polygon
                  points={scorePolygonPoints(orderedScores)}
                  fill="rgba(27,58,107,0.20)"
                  stroke="#1b3a6b"
                  strokeWidth={1.8}
                  strokeLinejoin="round"
                />
                {SEGMENTS.map((seg, i) => {
                  const score = scores[seg.key] ?? 5;
                  const [x, y] = getPoint(i, score);
                  return (
                    <circle key={seg.key} cx={x} cy={y} r={4} fill={seg.color} stroke="white" strokeWidth={1.5} />
                  );
                })}
                {SEGMENTS.map((seg, i) => {
                  const { x, y, anchor, dy } = getLabelPos(i);
                  const title = lang === "en" ? seg.titleEn : lang === "id" ? seg.titleId : seg.titleNl;
                  const score = scores[seg.key] ?? 5;
                  const parts = title.split(" ");
                  return (
                    <g key={seg.key}>
                      {parts.length > 1 ? (
                        parts.map((part, pi) => (
                          <text key={pi} x={x} y={y + pi * 11 + dy} textAnchor={anchor} fontSize="9" fontWeight="700" fontFamily="Montserrat, sans-serif" fill={seg.color} letterSpacing="0.03em">{part}</text>
                        ))
                      ) : (
                        <text x={x} y={y + dy} textAnchor={anchor} fontSize="9" fontWeight="700" fontFamily="Montserrat, sans-serif" fill={seg.color} letterSpacing="0.03em">{title}</text>
                      )}
                      <text x={x} y={y + (parts.length > 1 ? parts.length * 11 : 0) + dy + 12} textAnchor={anchor} fontSize="11" fontWeight="800" fontFamily="Montserrat, sans-serif" fill={seg.color}>{score}</text>
                    </g>
                  );
                })}
                <circle cx={CX} cy={CY} r={28} fill="white" stroke="#1b3a6b20" strokeWidth={1} />
                <text x={CX} y={CY - 4} textAnchor="middle" fontSize="16" fontWeight="800" fontFamily="Montserrat, sans-serif" fill="#1b3a6b">{avg}</text>
                <text x={CX} y={CY + 11} textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="Montserrat, sans-serif" fill="#1b3a6b80" letterSpacing="0.06em">AVG</text>
              </svg>

              <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap", justifyContent: "center" }}>
                <button onClick={handleDownload} style={{ background: "oklch(22% 0.10 260)", color: "white", padding: "10px 22px", borderRadius: 6, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", letterSpacing: "0.04em" }}>
                  {t("Download Image", "Unduh Gambar", "Afbeelding Downloaden")}
                </button>
                {!scoresSaved ? (
                  <button onClick={handleSaveScores} disabled={isSavingScores} style={{ background: "oklch(65% 0.15 45)", color: "oklch(15% 0.05 45)", padding: "10px 22px", borderRadius: 6, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", letterSpacing: "0.04em" }}>
                    {isSavingScores ? t("Saving…", "Menyimpan…", "Opslaan…") : t("Save Scores", "Simpan Skor", "Scores Opslaan")}
                  </button>
                ) : (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "oklch(38% 0.14 145)", fontSize: 13, fontWeight: 700, padding: "10px 0" }}>
                    ✓ {t("Scores Saved", "Skor Tersimpan", "Scores Opgeslagen")}
                  </span>
                )}
              </div>
            </div>

            {/* SLIDERS */}
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {SEGMENTS.map((seg, i) => {
                  const score = scores[seg.key] ?? 5;
                  const detail = SEGMENT_DETAILS[i];
                  return (
                    <div key={seg.key} style={{ background: "white", borderRadius: 10, padding: "16px 20px", boxShadow: "0 1px 6px oklch(20% 0.06 260 / 0.06)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: seg.color }}>
                            {t(seg.titleEn, seg.titleId, seg.titleNl)}
                          </span>
                          <span style={{ fontSize: 11, color: "oklch(55% 0.05 260)", marginLeft: 8 }}>
                            {t(detail.descEn, detail.descId, detail.descNl)}
                          </span>
                        </div>
                        <span style={{ fontSize: 22, fontWeight: 800, color: seg.color, fontFamily: "Cormorant Garamond, serif", lineHeight: 1, marginLeft: 12, flexShrink: 0 }}>{score}</span>
                      </div>
                      <div style={{ position: "relative" }}>
                        <div style={{ height: 4, background: "oklch(91% 0.006 260)", borderRadius: 2, marginBottom: 4 }}>
                          <div style={{ height: 4, background: seg.color, borderRadius: 2, width: `${(score / 10) * 100}%`, transition: "width 0.1s" }} />
                        </div>
                        <input type="range" min={1} max={10} step={1} value={score} onChange={e => setScores(prev => ({ ...prev, [seg.key]: parseInt(e.target.value) }))} style={{ position: "absolute", top: -8, left: 0, width: "100%", opacity: 0, cursor: "pointer", height: 20 }} />
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          {[1,2,3,4,5,6,7,8,9,10].map(n => (
                            <button key={n} onClick={() => { setScores(prev => ({ ...prev, [seg.key]: n })); setScoresSaved(false); }} style={{ width: 22, height: 22, borderRadius: "50%", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, background: n === score ? seg.color : "oklch(91% 0.006 260)", color: n === score ? "white" : "oklch(55% 0.05 260)", transition: "all 0.12s" }}>{n}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ background: "oklch(22% 0.10 260)", borderRadius: 10, padding: "20px 24px", marginTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(65% 0.08 260)", margin: "0 0 4px" }}>
                    {t("Overall Average", "Rata-rata Keseluruhan", "Algeheel Gemiddelde")}
                  </p>
                  <p style={{ fontSize: 13, color: "oklch(75% 0.05 260)", margin: 0 }}>
                    {t("Across all 8 dimensions", "Di semua 8 dimensi", "Over alle 8 dimensies")}
                  </p>
                </div>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 48, fontWeight: 600, color: "oklch(65% 0.15 45)", lineHeight: 1 }}>{avg}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "oklch(22% 0.10 260)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(96% 0.005 80)", margin: "0 0 20px" }}>
            {t("Take Stock of Your Whole Life", "Tinjau Seluruh Hidup Anda", "Neem Uw Hele Leven Onder de Loep")}
          </h2>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/resources" style={{ display: "inline-block", background: "transparent", color: "oklch(85% 0.04 260)", padding: "14px 32px", borderRadius: 6, fontWeight: 600, fontSize: 14, border: "1px solid oklch(42% 0.08 260)", textDecoration: "none" }}>
              {t("← Content Library", "← Perpustakaan Konten", "← Contentbibliotheek")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
