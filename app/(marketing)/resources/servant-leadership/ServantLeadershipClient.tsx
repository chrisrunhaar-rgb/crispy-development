"use client";
import { useState, useTransition, useCallback } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";
import LangToggle from "@/components/LangToggle";
import { saveResourceToDashboard } from "../actions";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const NAVY       = "oklch(22% 0.10 260)";
const ORANGE     = "oklch(65% 0.15 45)";
const OFF_WHITE  = "oklch(96% 0.005 80)";
const LIGHT_GRAY = "oklch(88% 0.008 80)";
const BODY_TEXT  = "oklch(38% 0.05 260)";
const MUTED      = "oklch(55% 0.008 260)";

const FONT_HEAD = "'Cormorant Garamond', serif";
const FONT_BODY = "'Montserrat', sans-serif";

// ─── Pentagon math ─────────────────────────────────────────────────────────────
const ANGLES_DEG = [-90, -18, 54, 126, 198];
const ANGLES_RAD = ANGLES_DEG.map(d => d * Math.PI / 180);
const CX = 140, CY = 140, R_MAX = 100;

function ptAt(angleRad: number, value: number) {
  const r = (value / 100) * R_MAX;
  return { x: CX + r * Math.cos(angleRad), y: CY + r * Math.sin(angleRad) };
}

const OUTER_PTS = ANGLES_RAD.map(a => ({
  x: CX + R_MAX * Math.cos(a),
  y: CY + R_MAX * Math.sin(a),
}));

function polyPath(pts: { x: number; y: number }[]) {
  return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";
}

const OUTER_PATH = polyPath(OUTER_PTS);
const GRID_RINGS = [25, 50, 75, 100];

const LABEL_META = [
  { anchor: "middle", x: CX + 120 * Math.cos(ANGLES_RAD[0]),     y: CY + 120 * Math.sin(ANGLES_RAD[0]) - 4 },
  { anchor: "start",  x: CX + 115 * Math.cos(ANGLES_RAD[1]) + 4, y: CY + 115 * Math.sin(ANGLES_RAD[1])     },
  { anchor: "start",  x: CX + 115 * Math.cos(ANGLES_RAD[2]) + 4, y: CY + 115 * Math.sin(ANGLES_RAD[2])     },
  { anchor: "end",    x: CX + 115 * Math.cos(ANGLES_RAD[3]) - 4, y: CY + 115 * Math.sin(ANGLES_RAD[3])     },
  { anchor: "end",    x: CX + 115 * Math.cos(ANGLES_RAD[4]) - 4, y: CY + 115 * Math.sin(ANGLES_RAD[4])     },
] as const;

// ─── Types ─────────────────────────────────────────────────────────────────────
type Lang = "en" | "id";
type Reading = { body: Record<Lang, string>; q: Record<Lang, string> };
type TensionDef = {
  id: number;
  title: Record<Lang, string>;
  left: Record<Lang, string>;
  right: Record<Lang, string>;
  short: Record<Lang, string>;
  color: string;
  low: Reading;
  mid: Reading;
  high: Reading;
};

// ─── Tension data ──────────────────────────────────────────────────────────────
const TENSIONS: TensionDef[] = [
  {
    id: 0,
    title: { en: "Identity vs. Technique", id: "Identitas vs. Teknik" },
    left:  { en: "I practice servant behaviors", id: "Saya mempraktikkan perilaku pelayan" },
    right: { en: "Serving flows from who I am",  id: "Melayani mengalir dari siapa saya" },
    short: { en: "Identity", id: "Identitas" },
    color: "oklch(52% 0.16 260)",
    low: {
      body: {
        en: "Your serving is shaped by skill — useful, but fragile under pressure. Behavioral discipline is a start, not an arrival.",
        id: "Pelayananmu dibentuk oleh keterampilan — berguna, tapi rapuh di bawah tekanan. Disiplin perilaku adalah awal, bukan tujuan.",
      },
      q: {
        en: "What drives your serving when no one is watching?",
        id: "Apa yang mendorong pelayananmu ketika tidak ada yang melihat?",
      },
    },
    mid: {
      body: {
        en: "You're navigating both — sometimes it feels like discipline, sometimes it flows. That tension is growth, not failure.",
        id: "Kamu menavigasi keduanya — kadang terasa seperti disiplin, kadang mengalir. Ketegangan itu adalah pertumbuhan, bukan kegagalan.",
      },
      q: {
        en: "What would change if serving became less about what you do and more about who you are?",
        id: "Apa yang akan berubah jika melayani lebih tentang siapa kamu daripada apa yang kamu lakukan?",
      },
    },
    high: {
      body: {
        en: "Serving has become part of how you see yourself. Guard against identity collapse when your service is refused or goes unrecognised.",
        id: "Melayani telah menjadi bagian dari cara kamu melihat dirimu. Jaga diri dari keruntuhan identitas ketika pelayananmu ditolak.",
      },
      q: {
        en: "Where does your self-worth go when your service is rejected?",
        id: "Ke mana harga dirimu pergi ketika pelayananmu ditolak?",
      },
    },
  },
  {
    id: 1,
    title: { en: "Universal vs. Contextual", id: "Universal vs. Kontekstual" },
    left:  { en: "Humble leadership works the same everywhere",         id: "Kepemimpinan rendah hati sama di mana-mana" },
    right: { en: "I read the culture before I decide how to serve",     id: "Saya membaca budaya sebelum memutuskan cara melayani" },
    short: { en: "Universal", id: "Universal" },
    color: "oklch(50% 0.14 155)",
    low: {
      body: {
        en: "You may be applying a model that works at home but creates distance elsewhere. Humility looks different across cultures — especially how it's expressed.",
        id: "Mungkin kamu menerapkan model yang berhasil di tempat asalmu tapi menciptakan jarak di tempat lain. Kerendahan hati terlihat berbeda di berbagai budaya.",
      },
      q: {
        en: "Where have you assumed that your way of serving is the humble way?",
        id: "Di mana kamu berasumsi bahwa cara melayanimu adalah cara yang rendah hati?",
      },
    },
    mid: {
      body: {
        en: "You're learning to hold the principle while releasing the form. That adaptability is exactly what cross-cultural servant leadership requires.",
        id: "Kamu belajar memegang prinsip sambil melepaskan bentuknya. Adaptabilitas itu persis yang dibutuhkan kepemimpinan hamba lintas budaya.",
      },
      q: {
        en: "What's one expression of service you've had to unlearn in a new cultural context?",
        id: "Apa satu ekspresi pelayanan yang harus kamu lepaskan dalam konteks budaya baru?",
      },
    },
    high: {
      body: {
        en: "You're highly contextually aware. Watch that adaptability doesn't slide into endless accommodation — some things don't flex.",
        id: "Kamu sangat sadar konteks. Perhatikan agar adaptabilitas tidak bergeser menjadi akomodasi tanpa batas — beberapa hal tidak bisa dilenturkan.",
      },
      q: {
        en: "What are the non-negotiables you hold regardless of culture?",
        id: "Apa yang tidak dapat dinegosiasikan yang kamu pegang terlepas dari budaya?",
      },
    },
  },
  {
    id: 2,
    title: { en: "Deference vs. Authority", id: "Ketundukan vs. Otoritas" },
    left:  { en: "Serving means I set my authority aside",  id: "Melayani berarti mengesampingkan otoritas saya" },
    right: { en: "I hold authority and use it to serve",    id: "Saya memegang otoritas dan menggunakannya untuk melayani" },
    short: { en: "Authority", id: "Otoritas" },
    color: "oklch(56% 0.13 45)",
    low: {
      body: {
        en: "Stepping back is sometimes wisdom — but check that it isn't avoidance. Kenosis means emptying status, not authority. Jesus washed feet and then commanded Lazarus from the grave.",
        id: "Melangkah mundur kadang adalah kebijaksanaan — tapi pastikan itu bukan penghindaran. Kenosis berarti mengosongkan status, bukan otoritas.",
      },
      q: {
        en: "Is there a place where stepping back has left people without the direction they needed?",
        id: "Apakah ada tempat di mana melangkah mundur justru membuat orang tanpa arahan yang mereka butuhkan?",
      },
    },
    mid: {
      body: {
        en: "You hold the tension well — neither dominating nor disappearing. That's the hard, necessary middle ground most servant leaders struggle to find.",
        id: "Kamu memegang ketegangan dengan baik — tidak mendominasi maupun menghilang. Itu adalah titik tengah yang sulit dan perlu.",
      },
      q: {
        en: "When does your authority feel like a burden rather than a resource to give?",
        id: "Kapan otoritasmu terasa seperti beban daripada sumber daya untuk diberikan?",
      },
    },
    high: {
      body: {
        en: "You lead with confidence. The question isn't whether you hold authority — it's whether those you serve experience it as gift or weight.",
        id: "Kamu memimpin dengan keyakinan. Pertanyaannya bukan apakah kamu memegang otoritas — tapi apakah yang kamu layani merasakannya sebagai anugerah atau beban.",
      },
      q: {
        en: "How do the people you lead describe your leadership when you're not in the room?",
        id: "Bagaimana orang yang kamu pimpin menggambarkan kepemimpinanmu ketika kamu tidak ada?",
      },
    },
  },
  {
    id: 3,
    title: { en: "Grace vs. Accountability", id: "Anugerah vs. Akuntabilitas" },
    left:  { en: "Grace means I hold back from confronting", id: "Anugerah berarti menahan diri dari konfrontasi" },
    right: { en: "I confront because I care",               id: "Saya mengonfrontasi karena saya peduli" },
    short: { en: "Grace", id: "Anugerah" },
    color: "oklch(48% 0.13 300)",
    low: {
      body: {
        en: "Your instinct to protect the relationship may silence the truth the other person needs. Jesus confronted Peter (Mark 8:33) and cleared the Temple (John 2) — both were acts of care.",
        id: "Nalurimu untuk melindungi hubungan mungkin membungkam kebenaran yang dibutuhkan orang lain. Yesus mengonfrontasi Petrus dan membersihkan Bait Allah — keduanya adalah tindakan kepedulian.",
      },
      q: {
        en: "Is there a relationship where truth is waiting — held back by what you're calling grace?",
        id: "Apakah ada hubungan di mana kebenaran sedang menunggu — ditahan oleh apa yang kamu sebut anugerah?",
      },
    },
    mid: {
      body: {
        en: "You're learning that care and challenge aren't opposites. Holding both is harder than choosing either — and more faithful to what servant leadership actually demands.",
        id: "Kamu belajar bahwa kepedulian dan tantangan bukan lawan. Memegang keduanya lebih sulit dari memilih salah satu — dan lebih setia.",
      },
      q: {
        en: "What does it feel like in your body when you know you need to say something hard?",
        id: "Apa yang kamu rasakan ketika kamu tahu kamu perlu mengatakan sesuatu yang berat?",
      },
    },
    high: {
      body: {
        en: "You confront readily — a real strength when the motive is love. Check the difference between accountability that serves the relationship and accountability that serves being right.",
        id: "Kamu mudah mengonfrontasi — kekuatan nyata ketika motivasinya kasih. Periksa perbedaan antara akuntabilitas yang melayani hubungan dan yang melayani keinginan untuk benar.",
      },
      q: {
        en: "When you confront, who are you primarily thinking about — them, or the principle?",
        id: "Ketika kamu mengonfrontasi, siapa yang terutama kamu pikirkan — mereka, atau prinsipnya?",
      },
    },
  },
  {
    id: 4,
    title: { en: "Fulfilling vs. Costly", id: "Memenuhi vs. Berbiaya" },
    left:  { en: "Serving is sustainable and life-giving",   id: "Melayani itu berkelanjutan dan memberi kehidupan" },
    right: { en: "Serving genuinely costs me something",     id: "Melayani benar-benar menelan biaya dari diri saya" },
    short: { en: "Cost", id: "Biaya" },
    color: "oklch(52% 0.13 20)",
    low: {
      body: {
        en: "Sustainable serving is real and good — but watch for a theology that never bleeds. Mark 10 uses both diakonos and doulos — the second implies self-expenditure, not just helpfulness.",
        id: "Pelayanan yang berkelanjutan adalah nyata dan baik — tapi waspadai teologi yang tidak pernah berdarah. Markus 10 menyiratkan pengorbanan diri, bukan sekadar keramahan.",
      },
      q: {
        en: "What is serving costing you right now that you haven't named out loud?",
        id: "Apa yang pelayanan biayai dari kamu sekarang yang belum pernah kamu ungkapkan?",
      },
    },
    mid: {
      body: {
        en: "You hold the joy and the weight together. That honesty is exactly where most faithful servant leaders live — and it's more sustainable than pretending only one is real.",
        id: "Kamu memegang sukacita dan beban bersama. Kejujuran itu tepat di mana kebanyakan pemimpin hamba yang setia hidup.",
      },
      q: {
        en: "How do you know when the cost has become too high — and who do you tell?",
        id: "Bagaimana kamu tahu ketika biayanya sudah terlalu tinggi — dan kepada siapa kamu bercerita?",
      },
    },
    high: {
      body: {
        en: "You feel the cost clearly, and naming it is honest. Make sure it doesn't harden into a martyrdom narrative — costly serving still requires rest and replenishment.",
        id: "Kamu merasakan biayanya dengan jelas, dan menyebutkannya itu jujur. Pastikan itu tidak mengeras menjadi narasi kemartiran — pelayanan berbiaya tetap membutuhkan istirahat.",
      },
      q: {
        en: "What rhythms of replenishment are you actually practicing, not just planning?",
        id: "Ritme pemulihan apa yang benar-benar kamu praktikkan, bukan hanya rencanakan?",
      },
    },
  },
];

// ─── Copy ──────────────────────────────────────────────────────────────────────
const L: Record<Lang, {
  moduleLabel: string; title: string; subtitle: string;
  twoTitle: string; twoBody: string;
  twoLeft: string; twoLeftSub: string; twoRight: string; twoRightSub: string;
  mapTitle: string; mapIntro: string; allPlaced: string;
  profileTitle: string; sittingWith: string;
  faithTitle: string; faithBody: string;
  takeawaysTitle: string; takeaways: string[];
  bgTitle: string; bgBody: string; readMore: string; readLess: string;
  saveDashboard: string; savedDashboard: string;
}> = {
  en: {
    moduleLabel: "Servant Leadership",
    title: "The Servant Leader's Tension Map",
    subtitle: "Five tensions that reveal the shape of your leadership",
    twoTitle: "Two Sources of Servant Power",
    twoBody: "Robert Greenleaf's servant leadership model locates power in an upward movement: authority earned through service, confirmed by follower trust. Philippians 2 locates it differently — power flows downward from God, through voluntary self-emptying. Both produce humble leaders. But the source shapes everything, especially when serving gets costly.",
    twoLeft: "Phil 2 — Downward", twoLeftSub: "Power from God through kenosis",
    twoRight: "Greenleaf — Upward", twoRightSub: "Power from followers through trust",
    mapTitle: "Your Tension Map",
    mapIntro: "Click anywhere on each spectrum to place yourself. No right answers — only honest ones.",
    allPlaced: "All five tensions mapped.",
    profileTitle: "Your Profile",
    sittingWith: "Sit with this:",
    faithTitle: "Faith Anchor",
    faithBody: "Mark 10:42-45 draws a sharp contrast: rulers lord it over people; the greatest among you will be servant (diakonos) and slave (doulos) of all. John 13 reframes foot-washing through an honour-shame lens — Jesus does the work of a Gentile slave, then says the master is not greater than the servant. Philippians 2:5-11 describes a direction of movement: downward, through status relinquishment, toward receptive learning and power redistribution. This is kenosis — not self-erasure, but a chosen giving up of what one was entitled to hold.",
    takeawaysTitle: "Key Takeaways",
    takeaways: [
      "Servant leadership is not a technique — it is an identity formed by the Spirit, not sustained by willpower alone.",
      "Humility and authority are not opposites. Kenosis empties status, not the capacity to act with power on behalf of others.",
      "The cost is real. Mark 10 uses doulos — a word that means self-expenditure, not just service. Honest servant leadership names this.",
    ],
    bgTitle: "Background: Research Foundations",
    bgBody: "David Crowther's critique (2024) distinguishes moral integrity — consistent across cultures — from egalitarianism, which research consistently identifies as the weakest cross-cultural dimension of servant leadership. Greenleaf's (1970) original framework places the test in followers: do those served grow as persons? Biblical scholarship on Philippians 2 identifies four kenosis implications: status relinquishment, receptive learning, power distribution, and identity transformation. Ezekiel 34 provides the negative image — the failed shepherd — against which servant leadership is measured. The deepest challenge for cross-cultural servant leaders is not learning humility but learning whose definition of humility applies.",
    readMore: "Read the research background",
    readLess: "Read less",
    saveDashboard: "Save to Dashboard",
    savedDashboard: "Saved to Dashboard",
  },
  id: {
    moduleLabel: "Kepemimpinan Hamba",
    title: "Peta Ketegangan Pemimpin Hamba",
    subtitle: "Lima ketegangan yang mengungkap bentuk kepemimpinanmu",
    twoTitle: "Dua Sumber Kuasa Hamba",
    twoBody: "Model kepemimpinan hamba Robert Greenleaf menempatkan kuasa dalam gerakan ke atas: otoritas yang diperoleh melalui pelayanan, dikonfirmasi oleh kepercayaan pengikut. Filipi 2 menempatkannya berbeda — kuasa mengalir ke bawah dari Allah, melalui pengosongan diri secara sukarela. Keduanya menghasilkan pemimpin yang rendah hati. Tapi sumbernya membentuk segalanya, terutama ketika melayani menjadi mahal.",
    twoLeft: "Fil 2 — Ke Bawah", twoLeftSub: "Kuasa dari Allah melalui kenosis",
    twoRight: "Greenleaf — Ke Atas", twoRightSub: "Kuasa dari pengikut melalui kepercayaan",
    mapTitle: "Peta Keteganganmu",
    mapIntro: "Klik di mana saja pada setiap spektrum untuk menempatkan dirimu. Tidak ada jawaban yang benar — hanya yang jujur.",
    allPlaced: "Kelima ketegangan telah dipetakan.",
    profileTitle: "Profilmu",
    sittingWith: "Renungkan ini:",
    faithTitle: "Jangkar Iman",
    faithBody: "Markus 10:42-45 menarik kontras yang tajam: para penguasa memerintah orang; yang terbesar di antara kamu akan menjadi pelayan (diakonos) dan hamba (doulos) dari semua. Yohanes 13 membingkai ulang pembasuhan kaki melalui lensa kehormatan-malu — Yesus melakukan pekerjaan hamba kafir, lalu berkata tuan tidak lebih besar dari hambanya. Filipi 2:5-11 menggambarkan arah gerakan: ke bawah, melalui pelepasan status, menuju pembelajaran yang reseptif dan redistribusi kuasa. Inilah kenosis — bukan penghapusan diri, tetapi pelepasan yang dipilih dari apa yang berhak dipegang.",
    takeawaysTitle: "Poin Utama",
    takeaways: [
      "Kepemimpinan hamba bukan teknik — melainkan identitas yang dibentuk oleh Roh, bukan hanya dipertahankan oleh kemauan.",
      "Kerendahan hati dan otoritas bukan lawan. Kenosis mengosongkan status, bukan kapasitas untuk bertindak dengan kuasa demi orang lain.",
      "Biayanya nyata. Markus 10 menggunakan doulos — kata yang berarti pengorbanan diri, bukan sekadar pelayanan. Kepemimpinan hamba yang jujur menyebutkan ini.",
    ],
    bgTitle: "Latar Belakang: Fondasi Penelitian",
    bgBody: "Kritik David Crowther (2024) membedakan integritas moral — konsisten lintas budaya — dari egalitarianisme, yang penelitian secara konsisten mengidentifikasi sebagai dimensi lintas budaya yang paling lemah dalam kepemimpinan hamba. Kerangka asli Greenleaf (1970) menempatkan ujian pada pengikut: apakah mereka yang dilayani tumbuh sebagai pribadi? Beasiswa Alkitab tentang Filipi 2 mengidentifikasi empat implikasi kenosis: pelepasan status, pembelajaran reseptif, distribusi kuasa, dan transformasi identitas. Yehezkiel 34 memberikan gambaran negatif — gembala yang gagal — di mana kepemimpinan hamba diukur.",
    readMore: "Baca latar belakang penelitian",
    readLess: "Baca lebih sedikit",
    saveDashboard: "Simpan ke Dasbor",
    savedDashboard: "Tersimpan di Dasbor",
  },
};

// ─── Sub-components ────────────────────────────────────────────────────────────
function TwoStreamsSVG({ lang }: { lang: Lang }) {
  const t = L[lang];
  return (
    <svg viewBox="0 0 300 200" style={{ width: "100%", maxWidth: 380, display: "block", margin: "1.5rem auto 0" }} aria-hidden="true">
      {/* GOD */}
      <rect x="100" y="6" width="100" height="30" rx="3" fill={NAVY} />
      <text x="150" y="26" textAnchor="middle" fill="white" fontFamily={FONT_BODY} fontWeight="700" fontSize="11">GOD</text>

      {/* Down arrow + label */}
      <line x1="150" y1="36" x2="150" y2="76" stroke={NAVY} strokeWidth="2" />
      <polygon points="145,72 150,82 155,72" fill={NAVY} />
      <text x="158" y="52" textAnchor="start" fill={NAVY} fontFamily={FONT_BODY} fontSize="9" fontStyle="italic">{lang === "en" ? "kenosis" : "kenosis"}</text>
      <text x="158" y="64" textAnchor="start" fill={MUTED} fontFamily={FONT_BODY} fontSize="8">{t.twoLeft}</text>

      {/* SERVANT LEADER box */}
      <rect x="50" y="82" width="200" height="32" rx="3" fill={LIGHT_GRAY} stroke={NAVY} strokeWidth="1.5" />
      <text x="150" y="103" textAnchor="middle" fill={NAVY} fontFamily={FONT_BODY} fontWeight="700" fontSize="11">
        {lang === "en" ? "SERVANT LEADER" : "PEMIMPIN HAMBA"}
      </text>

      {/* Up arrow + label */}
      <line x1="150" y1="114" x2="150" y2="154" stroke={ORANGE} strokeWidth="2" />
      <polygon points="145,118 150,114 155,118" fill={ORANGE} />
      <text x="158" y="132" textAnchor="start" fill={ORANGE} fontFamily={FONT_BODY} fontSize="9" fontStyle="italic">{lang === "en" ? "trust" : "kepercayaan"}</text>
      <text x="158" y="144" textAnchor="start" fill={MUTED} fontFamily={FONT_BODY} fontSize="8">{t.twoRight}</text>

      {/* FOLLOWERS box */}
      <rect x="70" y="160" width="160" height="30" rx="3" fill="oklch(65% 0.15 45 / 0.12)" stroke={ORANGE} strokeWidth="1.5" />
      <text x="150" y="180" textAnchor="middle" fill={ORANGE} fontFamily={FONT_BODY} fontWeight="700" fontSize="11">
        {lang === "en" ? "FOLLOWERS" : "PENGIKUT"}
      </text>
    </svg>
  );
}

function PentagonRadar({ placements }: { placements: (number | null)[] }) {
  const radarPts = ANGLES_RAD.map((a, i) => ptAt(a, placements[i] ?? 50));
  const radarPath = polyPath(radarPts);

  return (
    <svg viewBox="0 0 280 280" style={{ width: "100%", maxWidth: 280, display: "block" }} aria-hidden="true">
      {/* Grid rings */}
      {GRID_RINGS.map(r => {
        const pts = ANGLES_RAD.map(a => ({
          x: CX + (r / 100) * R_MAX * Math.cos(a),
          y: CY + (r / 100) * R_MAX * Math.sin(a),
        }));
        return (
          <polygon key={r} points={pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")}
            fill="none" stroke={LIGHT_GRAY} strokeWidth="1" />
        );
      })}

      {/* Axis spokes */}
      {OUTER_PTS.map((p, i) => (
        <line key={i} x1={CX} y1={CY} x2={p.x.toFixed(1)} y2={p.y.toFixed(1)} stroke={LIGHT_GRAY} strokeWidth="1" />
      ))}

      {/* Outer boundary */}
      <path d={OUTER_PATH} fill="none" stroke={LIGHT_GRAY} strokeWidth="1.5" />

      {/* Radar fill */}
      <path d={radarPath} fill={`${NAVY}25`} stroke={NAVY} strokeWidth="2" strokeLinejoin="round" />

      {/* Vertex dots */}
      {ANGLES_RAD.map((a, i) => {
        const v = placements[i];
        const pt = ptAt(a, v ?? 50);
        return (
          <circle key={i} cx={pt.x.toFixed(1)} cy={pt.y.toFixed(1)} r="5"
            fill={v !== null ? TENSIONS[i].color : LIGHT_GRAY}
            stroke="white" strokeWidth="1.5"
            opacity={v !== null ? 1 : 0.5}
          />
        );
      })}

      {/* Tension labels */}
      {LABEL_META.map((meta, i) => (
        <text key={i}
          x={meta.x.toFixed(1)} y={meta.y.toFixed(1)}
          textAnchor={meta.anchor}
          dy="0.3em"
          fill={placements[i] !== null ? TENSIONS[i].color : MUTED}
          fontFamily={FONT_BODY} fontWeight="700" fontSize="9"
        >
          {TENSIONS[i].short["en"]}
        </text>
      ))}
    </svg>
  );
}

function TensionSlider({ tension, lang, value, onPlace }: {
  tension: TensionDef; lang: Lang; value: number | null; onPlace: (v: number) => void;
}) {
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onPlace(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)));
  }, [onPlace]);

  const handleTouch = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.changedTouches[0];
    onPlace(Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100)));
  }, [onPlace]);

  return (
    <div style={{ marginBottom: "1.875rem" }}>
      <p style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: "0.78rem", color: tension.color, margin: "0 0 0.5rem" }}>
        {tension.title[lang]}
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", gap: "0.5rem" }}>
        <span style={{ fontFamily: FONT_BODY, fontSize: "0.66rem", color: MUTED, maxWidth: "43%", lineHeight: 1.3 }}>
          {tension.left[lang]}
        </span>
        <span style={{ fontFamily: FONT_BODY, fontSize: "0.66rem", color: MUTED, maxWidth: "43%", textAlign: "right", lineHeight: 1.3 }}>
          {tension.right[lang]}
        </span>
      </div>
      <div
        role="slider" aria-valuenow={value !== null ? Math.round(value) : 50}
        aria-valuemin={0} aria-valuemax={100} aria-label={tension.title[lang]}
        onClick={handleClick} onTouchEnd={handleTouch}
        style={{ position: "relative", height: 10, background: LIGHT_GRAY, cursor: "pointer", userSelect: "none" }}
      >
        {value !== null && (
          <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${value}%`, background: tension.color, opacity: 0.3, pointerEvents: "none" }} />
        )}
        {value !== null ? (
          <div style={{
            position: "absolute", top: "50%", left: `${value}%`,
            transform: "translate(-50%, -50%)",
            width: 20, height: 20, borderRadius: "50%",
            background: tension.color, border: "2.5px solid white",
            boxShadow: "0 1px 5px oklch(0% 0 0 / 0.25)", pointerEvents: "none",
          }} />
        ) : (
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 14, height: 14, borderRadius: "50%",
            border: `2px dashed ${MUTED}`, opacity: 0.4, pointerEvents: "none",
          }} />
        )}
      </div>
    </div>
  );
}

function ProfileReading({ tension, lang, value }: { tension: TensionDef; lang: Lang; value: number }) {
  const reading = value < 34 ? tension.low : value < 67 ? tension.mid : tension.high;
  return (
    <div style={{ borderLeft: `3px solid ${tension.color}`, paddingLeft: "1rem", marginBottom: "1.625rem" }}>
      <p style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: "0.78rem", color: tension.color, margin: "0 0 0.5rem" }}>
        {tension.title[lang]}
      </p>
      <p style={{ fontFamily: FONT_BODY, fontSize: "0.88rem", lineHeight: 1.75, color: BODY_TEXT, margin: "0 0 0.625rem" }}>
        {reading.body[lang]}
      </p>
      <p style={{
        fontFamily: FONT_BODY, fontSize: "0.82rem", lineHeight: 1.6, color: NAVY,
        fontStyle: "italic", margin: 0,
        paddingLeft: "0.75rem", borderLeft: `1px solid ${LIGHT_GRAY}`,
      }}>
        &ldquo;{reading.q[lang]}&rdquo;
      </p>
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────
type Props = { isSaved?: boolean; userId?: string | null; [key: string]: unknown };

export default function ServantLeadershipClient({ isSaved = false }: Props) {
  const { lang: ctxLang } = useLanguage();
  const lang: Lang = ctxLang === "id" ? "id" : "en";
  const t = L[lang];

  const [placements, setPlacements] = useState<(number | null)[]>([null, null, null, null, null]);
  const [bgOpen, setBgOpen] = useState(false);
  const [saved, setSaved] = useState(isSaved);
  const [isPending, startTransition] = useTransition();

  const allPlaced = placements.every(p => p !== null);

  function handlePlace(idx: number, value: number) {
    setPlacements(prev => { const n = [...prev]; n[idx] = value; return n; });
  }

  function handleSave() {
    startTransition(async () => {
      await saveResourceToDashboard("servant-leadership");
      setSaved(true);
    });
  }

  return (
    <main style={{ background: OFF_WHITE, minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <section style={{ position: "relative", height: "clamp(220px, 32vw, 380px)", overflow: "hidden", background: NAVY }}>
        <Image
          src="/images/resources/servant-leadership/hero.jpg"
          alt=""
          fill
          style={{ objectFit: "cover", mixBlendMode: "luminosity", opacity: 0.22 }}
          priority
          sizes="100vw"
        />
        <div style={{
          position: "relative", zIndex: 1, height: "100%",
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
          padding: "clamp(1.5rem, 4vw, 3rem) clamp(1.25rem, 5vw, 3rem)",
          maxWidth: 860, margin: "0 auto", width: "100%",
        }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={{ fontFamily: FONT_BODY, fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, margin: "0 0 0.5rem" }}>
                {t.moduleLabel}
              </p>
              <h1 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: "clamp(1.6rem, 4vw, 2.6rem)", color: "white", margin: "0 0 0.5rem", lineHeight: 1.15 }}>
                {t.title}
              </h1>
              <p style={{ fontFamily: FONT_BODY, fontSize: "clamp(0.8rem, 1.4vw, 0.95rem)", color: "oklch(82% 0.01 260)", margin: 0, lineHeight: 1.5 }}>
                {t.subtitle}
              </p>
            </div>
            <LangToggle />
          </div>
        </div>
      </section>

      {/* ── Content wrapper ── */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "2.5rem clamp(1.25rem, 5vw, 2.5rem) 4rem" }}>

        {/* ── Two Sources ── */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)", color: NAVY, margin: "0 0 1rem", lineHeight: 1.25 }}>
            {t.twoTitle}
          </h2>
          <p style={{ fontFamily: FONT_BODY, fontSize: "clamp(0.88rem, 1.5vw, 0.98rem)", lineHeight: 1.85, color: BODY_TEXT, margin: 0, maxWidth: 640 }}>
            {t.twoBody}
          </p>
          <TwoStreamsSVG lang={lang} />
        </section>

        {/* ── Tension Map ── */}
        <section style={{ background: "white", border: `1px solid ${LIGHT_GRAY}`, padding: "2rem 1.75rem", marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: "clamp(1.25rem, 2.4vw, 1.6rem)", color: NAVY, margin: "0 0 0.375rem" }}>
            {t.mapTitle}
          </h2>
          <p style={{ fontFamily: FONT_BODY, fontSize: "0.85rem", color: MUTED, margin: "0 0 2rem", lineHeight: 1.5 }}>
            {t.mapIntro}
          </p>

          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>
            <div style={{ flex: "1 1 320px", minWidth: 260 }}>
              {TENSIONS.map((tension, i) => (
                <TensionSlider
                  key={tension.id}
                  tension={tension}
                  lang={lang}
                  value={placements[i]}
                  onPlace={v => handlePlace(i, v)}
                />
              ))}
            </div>
            <div style={{ flex: "0 0 auto", width: 240, alignSelf: "center" }}>
              <PentagonRadar placements={placements} />
              {allPlaced && (
                <p style={{ fontFamily: FONT_BODY, fontSize: "0.7rem", color: "oklch(45% 0.12 155)", textAlign: "center", margin: "0.625rem 0 0", fontWeight: 600 }}>
                  ✓ {t.allPlaced}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ── Profile (shown when all placed) ── */}
        {allPlaced && (
          <section style={{ background: "white", border: `1px solid ${LIGHT_GRAY}`, padding: "2rem 1.75rem", marginBottom: "2.5rem" }}>
            <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: "clamp(1.25rem, 2.4vw, 1.6rem)", color: NAVY, margin: "0 0 1.75rem" }}>
              {t.profileTitle}
            </h2>
            {TENSIONS.map((tension, i) => (
              <ProfileReading key={tension.id} tension={tension} lang={lang} value={placements[i] as number} />
            ))}
          </section>
        )}

        {/* ── Faith Anchor ── */}
        <section style={{ borderLeft: `4px solid ${ORANGE}`, paddingLeft: "1.5rem", marginBottom: "2.5rem" }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, margin: "0 0 0.625rem" }}>
            {t.faithTitle}
          </p>
          <p style={{ fontFamily: FONT_BODY, fontSize: "clamp(0.88rem, 1.5vw, 0.98rem)", lineHeight: 1.85, color: BODY_TEXT, margin: 0 }}>
            {t.faithBody}
          </p>
        </section>

        {/* ── Key Takeaways ── */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: "clamp(1.25rem, 2.4vw, 1.6rem)", color: NAVY, margin: "0 0 1.25rem" }}>
            {t.takeawaysTitle}
          </h2>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {t.takeaways.map((item, i) => (
              <li key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: "50%", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", marginTop: "0.1rem" }}>
                  <span style={{ fontFamily: FONT_BODY, fontWeight: 800, fontSize: "0.62rem", color: "white" }}>{i + 1}</span>
                </span>
                <p style={{ fontFamily: FONT_BODY, fontSize: "clamp(0.88rem, 1.5vw, 0.97rem)", lineHeight: 1.75, color: BODY_TEXT, margin: 0 }}>
                  {item}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Save button ── */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "2.5rem" }}>
          <button
            onClick={handleSave}
            disabled={saved || isPending}
            aria-label={saved ? t.savedDashboard : t.saveDashboard}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              minHeight: 44, padding: "10px 20px",
              background: "transparent",
              border: `1.5px solid ${saved ? ORANGE : "oklch(55% 0.04 260)"}`,
              fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600,
              color: saved ? ORANGE : "oklch(70% 0.04 260)",
              cursor: saved ? "default" : "pointer",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill={saved ? ORANGE : "none"} stroke={saved ? ORANGE : "currentColor"} strokeWidth="1.5" aria-hidden="true">
              <path d="M3 2h10a1 1 0 011 1v11l-6-3-6 3V3a1 1 0 011-1z" />
            </svg>
            {saved ? t.savedDashboard : t.saveDashboard}
          </button>
        </div>

        {/* ── Background (collapsible SEO) ── */}
        <section style={{ borderTop: `1px solid ${LIGHT_GRAY}`, paddingTop: "1.5rem" }}>
          <button
            onClick={() => setBgOpen(o => !o)}
            aria-expanded={bgOpen}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: FONT_BODY, fontWeight: 700, fontSize: "0.8rem", color: MUTED }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ transform: bgOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>
              <path d="M4 2l6 5-6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {bgOpen ? t.readLess : t.readMore}
          </button>
          {bgOpen && (
            <div style={{ marginTop: "1.25rem" }}>
              <h3 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: "1.15rem", color: NAVY, margin: "0 0 0.875rem" }}>
                {t.bgTitle}
              </h3>
              <p style={{ fontFamily: FONT_BODY, fontSize: "clamp(0.85rem, 1.4vw, 0.93rem)", lineHeight: 1.85, color: BODY_TEXT, margin: 0 }}>
                {t.bgBody}
              </p>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
