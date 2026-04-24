"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id" | "nl";

function t(en: string, id: string, nl: string, lang: Lang): string {
  if (lang === "id") return id;
  if (lang === "nl") return nl;
  return en;
}

// Rungs in bottom-to-top order (index 0 = ground floor, index 6 = top)
const RUNGS = [
  {
    num: "01",
    label: { en: "I Make Observations", id: "Saya Membuat Pengamatan", nl: "Ik Doe Waarnemingen" },
    shortLabel: { en: "Observations", id: "Pengamatan", nl: "Waarnemingen" },
    desc: {
      en: "First I observe the world. This is the raw, unfiltered data — everything that is actually happening around me right now.",
      id: "Pertama saya mengamati dunia. Ini adalah data mentah, tidak terfilter — semua yang sebenarnya terjadi di sekitar saya sekarang.",
      nl: "Eerst observeer ik de wereld. Dit zijn de ruwe, ongefilterde data — alles wat er op dit moment daadwerkelijk om me heen gebeurt.",
    },
    detail: {
      en: "At the ground level, we have access to reality itself: what was said, what happened, what was done. These are the facts, observable by any reasonable person present in the situation. No interpretation, no meaning — just data.",
      id: "Di lantai dasar, kita memiliki akses ke realitas itu sendiri: apa yang dikatakan, apa yang terjadi, apa yang dilakukan. Ini adalah fakta-fakta, dapat diamati oleh siapapun yang wajar hadir dalam situasi tersebut. Tanpa interpretasi, tanpa makna — hanya data.",
      nl: "Op de begane grond hebben we toegang tot de werkelijkheid zelf: wat er gezegd werd, wat er gebeurde, wat er gedaan werd. Dit zijn de feiten, waarneembaar door elke redelijke persoon die aanwezig was. Geen interpretatie, geen betekenis — alleen data.",
    },
    reflection: {
      en: "What did I actually observe? Strip away any interpretation — what are the raw facts?",
      id: "Apa yang sebenarnya saya amati? Singkirkan interpretasi apapun — apa fakta mentahnya?",
      nl: "Wat heb ik daadwerkelijk waargenomen? Verwijder alle interpretaties — wat zijn de ruwe feiten?",
    },
    color: "#c4762a",
    colorOklch: "oklch(52% 0.14 55)",
  },
  {
    num: "02",
    label: { en: "I Select Data", id: "Saya Memilih Data", nl: "Ik Selecteer Data" },
    shortLabel: { en: "Select Data", id: "Pilih Data", nl: "Data Selectie" },
    desc: {
      en: "Then I make a selection among the observations, based on what seems relevant — ignoring the rest.",
      id: "Kemudian saya membuat pilihan di antara pengamatan, berdasarkan apa yang tampaknya relevan — mengabaikan sisanya.",
      nl: "Dan maak ik een selectie uit de waarnemingen, gebaseerd op wat relevant lijkt — en negeer de rest.",
    },
    detail: {
      en: "The human brain cannot process everything. So we filter. We pay attention to certain things and tune out others — shaped by past experiences, cultural background, current concerns, and existing beliefs. This filtering is often invisible to us.",
      id: "Otak manusia tidak dapat memproses segalanya. Jadi kita menyaring. Kita memperhatikan hal-hal tertentu dan mengabaikan yang lain — dibentuk oleh pengalaman masa lalu, latar belakang budaya, kekhawatiran saat ini, dan keyakinan yang ada. Penyaringan ini seringkali tidak terlihat oleh kita.",
      nl: "Het menselijk brein kan niet alles verwerken. Dus filteren we. We letten op bepaalde dingen en negeren andere — gevormd door eerdere ervaringen, culturele achtergrond, huidige zorgen en bestaande overtuigingen. Dit filteren is ons vaak onzichtbaar.",
    },
    reflection: {
      en: "What did I ignore? Are there data points I left out because they didn't fit my picture?",
      id: "Apa yang saya abaikan? Apakah ada poin data yang saya tinggalkan karena tidak sesuai dengan gambaran saya?",
      nl: "Wat heb ik genegeerd? Zijn er datapunten die ik wegliet omdat ze niet in mijn beeld pasten?",
    },
    color: "#b06020",
    colorOklch: "oklch(50% 0.13 40)",
  },
  {
    num: "03",
    label: { en: "I Add a Meaning", id: "Saya Menambahkan Makna", nl: "Ik Ken Betekenis Toe" },
    shortLabel: { en: "Add Meaning", id: "Tambahkan Makna", nl: "Betekenis Toekennen" },
    desc: {
      en: "Then I add meaning to the selected observations based on previous experience, culture, and personal filters.",
      id: "Kemudian saya menambahkan makna pada pengamatan yang dipilih berdasarkan pengalaman sebelumnya, budaya, dan filter pribadi.",
      nl: "Dan voeg ik betekenis toe aan de geselecteerde waarnemingen op basis van eerdere ervaringen, cultuur en persoonlijke filters.",
    },
    detail: {
      en: "Now we begin to interpret. The same behavior can mean completely different things across cultures, relationships, and contexts. What reads as 'respect' in one setting reads as 'evasion' in another. We rarely notice we're doing it.",
      id: "Sekarang kita mulai menafsirkan. Perilaku yang sama dapat berarti hal yang sangat berbeda di berbagai budaya, hubungan, dan konteks. Apa yang dibaca sebagai 'hormat' dalam satu setting dibaca sebagai 'penghindaran' dalam setting lain. Kita jarang menyadarinya.",
      nl: "Nu beginnen we te interpreteren. Hetzelfde gedrag kan in verschillende culturen, relaties en contexten compleet andere dingen betekenen. Wat in de ene omgeving als 'respect' wordt gelezen, wordt in een andere omgeving als 'ontwijken' gezien. We merken zelden dat we het doen.",
    },
    reflection: {
      en: "What meaning did I attach to this data? Are there other ways to interpret it?",
      id: "Makna apa yang saya lekatkan pada data ini? Apakah ada cara lain untuk menafsirkannya?",
      nl: "Welke betekenis heb ik aan deze data gehecht? Zijn er andere manieren om dit te interpreteren?",
    },
    color: "#8a5015",
    colorOklch: "oklch(46% 0.12 35)",
  },
  {
    num: "04",
    label: { en: "I Make Assumptions", id: "Saya Membuat Asumsi", nl: "Ik Maak Aannames" },
    shortLabel: { en: "Assumptions", id: "Asumsi", nl: "Aannames" },
    desc: {
      en: "I assume that I've selected the right data and the meanings are accurate — without questioning those assumptions.",
      id: "Saya berasumsi bahwa saya telah memilih data yang benar dan makna-makna itu akurat — tanpa mempertanyakan asumsi-asumsi tersebut.",
      nl: "Ik ga ervan uit dat ik de juiste data heb geselecteerd en dat de betekenissen kloppen — zonder die aannames te bevragen.",
    },
    detail: {
      en: "Once meaning is attached, it quickly solidifies into assumptions. We treat our interpretation as if it were fact. This is where the runaway logic loop begins: our assumptions feed our next data selections, which reinforce our assumptions further.",
      id: "Setelah makna dilekatkan, dengan cepat mengeras menjadi asumsi. Kita memperlakukan interpretasi kita seolah-olah itu adalah fakta. Di sinilah loop logika tak terkendali dimulai: asumsi kita memberi makan pemilihan data berikutnya, yang semakin memperkuat asumsi kita.",
      nl: "Zodra betekenis is toegewezen, stolt het snel tot aannames. We behandelen onze interpretatie alsof het een feit is. Hier begint de zichzelf versterkende logicaloop: onze aannames voeden onze volgende dataselecties, die onze aannames verder bevestigen.",
    },
    reflection: {
      en: "Am I treating my assumptions as facts? What would I need to believe for this assumption to be wrong?",
      id: "Apakah saya memperlakukan asumsi saya sebagai fakta? Apa yang perlu saya percaya agar asumsi ini salah?",
      nl: "Behandel ik mijn aannames als feiten? Wat zou ik moeten geloven om deze aanname verkeerd te laten zijn?",
    },
    color: "#6e4a8a",
    colorOklch: "oklch(44% 0.14 300)",
  },
  {
    num: "05",
    label: { en: "I Draw Conclusions", id: "Saya Menarik Kesimpulan", nl: "Ik Trek Conclusies" },
    shortLabel: { en: "Conclusions", id: "Kesimpulan", nl: "Conclusies" },
    desc: {
      en: "I draw conclusions based on what seems to be best for myself and those around me.",
      id: "Saya menarik kesimpulan berdasarkan apa yang tampaknya terbaik bagi saya dan orang-orang di sekitar saya.",
      nl: "Ik trek conclusies op basis van wat het beste lijkt voor mijzelf en de mensen om me heen.",
    },
    detail: {
      en: "From unexamined assumptions, we leap to conclusions — often fast, confident, and felt as obvious. These conclusions feel logical, but they're built on layers of filtered data and interpreted meaning that we've never questioned.",
      id: "Dari asumsi yang tidak diperiksa, kita melompat ke kesimpulan — seringkali cepat, percaya diri, dan terasa jelas. Kesimpulan ini terasa logis, tetapi dibangun di atas lapisan data yang disaring dan makna yang ditafsirkan yang tidak pernah kita pertanyakan.",
      nl: "Van ongekritiseerde aannames springen we naar conclusies — vaak snel, zelfverzekerd en als vanzelfsprekend. Deze conclusies voelen logisch, maar zijn opgebouwd op lagen gefilterde data en geïnterpreteerde betekenis die we nooit hebben bevraagd.",
    },
    reflection: {
      en: "What conclusions am I drawing? If my assumptions were wrong, would these conclusions still hold?",
      id: "Kesimpulan apa yang saya tarik? Jika asumsi saya salah, apakah kesimpulan ini masih berlaku?",
      nl: "Welke conclusies trek ik? Als mijn aannames onjuist waren, zouden deze conclusies dan nog standhouden?",
    },
    color: "#4a4a8a",
    colorOklch: "oklch(42% 0.12 270)",
  },
  {
    num: "06",
    label: { en: "I Adopt Beliefs", id: "Saya Mengadopsi Keyakinan", nl: "Ik Neem Overtuigingen Over" },
    shortLabel: { en: "Beliefs", id: "Keyakinan", nl: "Overtuigingen" },
    desc: {
      en: "I adopt beliefs based on these conclusions and assume that people around me have the same beliefs.",
      id: "Saya mengadopsi keyakinan berdasarkan kesimpulan-kesimpulan ini dan berasumsi bahwa orang-orang di sekitar saya memiliki keyakinan yang sama.",
      nl: "Ik neem overtuigingen over op basis van deze conclusies en ga ervan uit dat de mensen om me heen dezelfde overtuigingen hebben.",
    },
    detail: {
      en: "Conclusions, repeated over time, harden into beliefs. They feel like truth — not opinion. And since we assume others see things the same way, we stop questioning them entirely. Our beliefs then directly shape what data we pay attention to next — completing the loop.",
      id: "Kesimpulan, diulang dari waktu ke waktu, mengeras menjadi keyakinan. Mereka terasa seperti kebenaran — bukan pendapat. Dan karena kita berasumsi orang lain melihat hal-hal dengan cara yang sama, kita berhenti mempertanyakannya sama sekali. Keyakinan kita kemudian langsung membentuk data apa yang kita perhatikan berikutnya — melengkapi lingkaran.",
      nl: "Conclusies, herhaald over de tijd, verharden tot overtuigingen. Ze voelen als waarheid — niet als mening. En omdat we aannemen dat anderen de dingen op dezelfde manier zien, houden we helemaal op ze te bevragen. Onze overtuigingen bepalen vervolgens direct welke data we de volgende keer opmerken — de lus sluit zich.",
    },
    reflection: {
      en: "What beliefs are operating here? Are these beliefs I chose, or conclusions I never questioned?",
      id: "Keyakinan apa yang beroperasi di sini? Apakah ini keyakinan yang saya pilih, atau kesimpulan yang tidak pernah saya pertanyakan?",
      nl: "Welke overtuigingen zijn hier actief? Zijn dit overtuigingen die ik bewust koos, of conclusies die ik nooit heb bevraagd?",
    },
    color: "#3a3a7a",
    colorOklch: "oklch(38% 0.12 265)",
  },
  {
    num: "07",
    label: { en: "I Take Actions", id: "Saya Mengambil Tindakan", nl: "Ik Onderneem Actie" },
    shortLabel: { en: "Actions", id: "Tindakan", nl: "Actie" },
    desc: {
      en: "I take action based on these beliefs and assume they represent reality.",
      id: "Saya mengambil tindakan berdasarkan keyakinan-keyakinan ini dan berasumsi bahwa mereka mewakili kenyataan.",
      nl: "Ik onderneem actie op basis van deze overtuigingen en ga ervan uit dat ze de werkelijkheid weerspiegelen.",
    },
    detail: {
      en: "At the top of the ladder, we act. But here's the danger: actions taken at the top of the ladder look completely rational from the inside — because they're built on beliefs that feel like facts. Others may not understand our actions because they're operating on different ladders.",
      id: "Di puncak tangga, kita bertindak. Tapi inilah bahayanya: tindakan yang diambil di puncak tangga terlihat sangat rasional dari dalam — karena dibangun di atas keyakinan yang terasa seperti fakta. Orang lain mungkin tidak memahami tindakan kita karena mereka beroperasi di tangga yang berbeda.",
      nl: "Aan de top van de ladder handelen we. Maar hier schuilt het gevaar: acties boven aan de ladder zien er van binnenuit volkomen rationeel uit — omdat ze zijn opgebouwd op overtuigingen die als feiten aanvoelen. Anderen begrijpen onze acties misschien niet omdat ze op andere ladders opereren.",
    },
    reflection: {
      en: "If my beliefs were different, how would my actions look? Am I acting on reality — or on my ladder?",
      id: "Jika keyakinan saya berbeda, bagaimana tindakan saya akan terlihat? Apakah saya bertindak berdasarkan kenyataan — atau berdasarkan tangga saya?",
      nl: "Als mijn overtuigingen anders waren, hoe zouden mijn acties er dan uitzien? Handel ik op basis van de werkelijkheid — of op basis van mijn ladder?",
    },
    color: "#1b3a6b",
    colorOklch: "oklch(28% 0.12 255)",
  },
];

const CLIMB_DOWN_STEPS = [
  {
    num: "01",
    title: { en: "Stop at the Top", id: "Berhenti di Puncak", nl: "Stop aan de Top" },
    desc: {
      en: "When you notice a strong reaction — frustration, conflict, confusion — recognize you may be at the top of a ladder built on unexamined rungs.",
      id: "Ketika Anda merasakan reaksi yang kuat — frustrasi, konflik, kebingungan — kenali bahwa Anda mungkin berada di puncak tangga yang dibangun di atas anak tangga yang tidak diperiksa.",
      nl: "Wanneer je een sterke reactie voelt — frustratie, conflict, verwarring — erken dat je mogelijk boven aan een ladder staat die is gebouwd op ongekritiseerde sporten.",
    },
  },
  {
    num: "02",
    title: { en: "Name Your Action/Belief", id: "Sebutkan Tindakan/Keyakinan Anda", nl: "Benoem Uw Actie/Overtuiging" },
    desc: {
      en: "What are you about to do or what do you believe? State it plainly. This makes it visible and examinable.",
      id: "Apa yang akan Anda lakukan atau apa yang Anda percaya? Nyatakan dengan jelas. Ini membuatnya terlihat dan dapat diperiksa.",
      nl: "Wat gaat u doen of wat gelooft u? Zeg het ronduit. Dit maakt het zichtbaar en bespreekbaar.",
    },
  },
  {
    num: "03",
    title: { en: "Trace Your Reasoning", id: "Lacak Penalaran Anda", nl: "Traceer Uw Redenering" },
    desc: {
      en: "Work backwards: What conclusions led here? What assumptions underpinned those? What meaning did you assign — and to which data?",
      id: "Bekerja mundur: Kesimpulan apa yang membawa ke sini? Asumsi apa yang mendasari kesimpulan itu? Makna apa yang Anda tetapkan — dan pada data apa?",
      nl: "Werk achterwaarts: Welke conclusies hebben hiertoe geleid? Welke aannames lagen daaraan ten grondslag? Welke betekenis kende u toe — en aan welke data?",
    },
  },
  {
    num: "04",
    title: { en: "Return to the Ground Floor", id: "Kembali ke Lantai Dasar", nl: "Keer Terug naar de Begane Grond" },
    desc: {
      en: "Get back to the observable facts. What can you verify? What did you filter out? Ask others what they observed. Reality is on the bottom rung.",
      id: "Kembali ke fakta yang dapat diamati. Apa yang dapat Anda verifikasi? Apa yang Anda saring? Tanya orang lain apa yang mereka amati. Realitas ada di anak tangga paling bawah.",
      nl: "Ga terug naar de observeerbare feiten. Wat kunt u verifiëren? Wat heeft u gefilterd? Vraag anderen wat zij hebben waargenomen. De werkelijkheid bevindt zich op de onderste sport.",
    },
  },
];

// SVG ladder constants
const SVG_W = 200;
const SVG_H = 560;
const RAIL_X_L = 46;
const RAIL_X_R = 154;
const RUNG_TOP_Y = 60;
const RUNG_BOTTOM_Y = 504;
const RUNG_STEP = (RUNG_BOTTOM_Y - RUNG_TOP_Y) / 6; // 74

function getRungY(rungIdx: number): number {
  // rungIdx: 0 = bottom (Observations), 6 = top (Actions)
  return RUNG_BOTTOM_Y - rungIdx * RUNG_STEP;
}

function ClimbingPerson({ personY, color }: { personY: number; color: string }) {
  const cx = SVG_W / 2;

  // Key body points
  const headR = 9;
  const headCY = personY - 56;
  const lShoulder = { x: cx - 12, y: personY - 40 };
  const rShoulder = { x: cx + 12, y: personY - 40 };
  const lHip = { x: cx - 7, y: personY - 15 };
  const rHip = { x: cx + 7, y: personY - 15 };

  // Hands grip the rails, slightly above current rung (mid-climb gesture)
  const lHandY = personY - RUNG_STEP * 0.72;
  const rHandY = personY - RUNG_STEP * 0.45;

  // Feet: one raised (stepping), one on current rung
  const lKneeX = cx - 26;
  const lKneeY = personY - RUNG_STEP * 0.28;
  const rFootY = personY - 2;

  return (
    <g>
      {/* Head */}
      <circle cx={cx} cy={headCY} r={headR} fill={color} />

      {/* Neck */}
      <line x1={cx} y1={headCY + headR} x2={cx - 1} y2={lShoulder.y + 2} stroke={color} strokeWidth={5} strokeLinecap="round" />

      {/* Torso */}
      <path
        d={`M ${lShoulder.x + 2} ${lShoulder.y + 2}
            C ${lShoulder.x - 1} ${lHip.y - 10} ${lHip.x - 2} ${lHip.y - 4} ${lHip.x} ${lHip.y}
            L ${rHip.x} ${rHip.y}
            C ${rHip.x + 2} ${rHip.y - 4} ${rShoulder.x + 1} ${lShoulder.y - 6} ${rShoulder.x - 2} ${rShoulder.y + 2} Z`}
        fill={color}
      />

      {/* Left arm — reaches up-left to grip left rail */}
      <path
        d={`M ${lShoulder.x} ${lShoulder.y + 3} Q ${lShoulder.x - 12} ${lShoulder.y - 14} ${RAIL_X_L + 2} ${lHandY}`}
        stroke={color} strokeWidth="5.5" fill="none" strokeLinecap="round"
      />

      {/* Right arm — reaches up-right to grip right rail */}
      <path
        d={`M ${rShoulder.x} ${rShoulder.y + 3} Q ${rShoulder.x + 10} ${rShoulder.y - 8} ${RAIL_X_R - 2} ${rHandY}`}
        stroke={color} strokeWidth="5.5" fill="none" strokeLinecap="round"
      />

      {/* Left leg — raised, stepping up toward left */}
      <path
        d={`M ${lHip.x} ${lHip.y} Q ${lKneeX} ${lKneeY - 6} ${lKneeX + 4} ${lKneeY} Q ${lKneeX + 2} ${lKneeY + 10} ${RAIL_X_L + 9} ${lKneeY + 6}`}
        stroke={color} strokeWidth="5.5" fill="none" strokeLinecap="round"
      />

      {/* Right leg — down, foot resting on rung */}
      <path
        d={`M ${rHip.x} ${rHip.y} Q ${cx + 20} ${personY - 16} ${cx + 18} ${rFootY}`}
        stroke={color} strokeWidth="5.5" fill="none" strokeLinecap="round"
      />
    </g>
  );
}

export default function LadderOfInferenceClient({
  userPathway,
  isSaved,
}: {
  userPathway: string | null;
  isSaved: boolean;
}) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  // Start at bottom (Observations = rung 0), climb up to Actions (rung 6)
  const [activeRung, setActiveRung] = useState<number>(0);
  const [saved, setSaved] = useState(isSaved);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await saveResourceToDashboard("ladder-of-inference");
      setSaved(true);
    });
  }

  function moveUp() { setActiveRung(r => Math.min(r + 1, 6)); }
  function moveDown() { setActiveRung(r => Math.max(r - 1, 0)); }

  const rung = RUNGS[activeRung];
  const personY = getRungY(activeRung);

  const langBtnBase: React.CSSProperties = {
    padding: "5px 12px", borderRadius: 4, fontSize: 11, fontWeight: 700,
    letterSpacing: "0.08em", cursor: "pointer", border: "none",
  };

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: "oklch(97% 0.005 260)", minHeight: "100vh" }}>
      <LangToggle />

      {/* HERO */}
      <section style={{ background: "oklch(22% 0.10 260)", padding: "80px 24px 72px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>

          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", background: "oklch(65% 0.15 45 / 0.12)", padding: "4px 10px", borderRadius: 4 }}>
              {t("Guide", "Panduan", "Gids", lang)}
            </span>
            
          </div>
          <p style={{ color: "oklch(65% 0.15 45)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {t("Thinking Tools · Guide", "Alat Berpikir · Panduan", "Denktools · Gids", lang)}
          </p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 600, color: "oklch(96% 0.005 80)", margin: "0 0 20px", lineHeight: 1.1 }}>
            {t("The Ladder of Inference", "Tangga Inferensi", "De Inferentieladder", lang)}
          </h1>
          <p style={{ fontSize: 17, color: "oklch(72% 0.05 260)", lineHeight: 1.7, maxWidth: 620, marginBottom: 32 }}>
            {t(
              "Most conflicts and misunderstandings start at the top — where we act on beliefs formed from incomplete data. Learn to trace your thinking back to the ground floor.",
              "Kebanyakan konflik dan kesalahpahaman dimulai di puncak — di mana kita bertindak berdasarkan keyakinan yang dibentuk dari data yang tidak lengkap. Pelajari cara menelusuri pemikiran Anda kembali ke lantai dasar.",
              "De meeste conflicten en misverstanden beginnen bovenaan — waar we handelen op basis van overtuigingen die zijn gevormd uit onvolledige data. Leer uw denken terug te traceren naar de begane grond.",
              lang
            )}
          </p>

          {/* Language selector */}

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {!saved ? (
              <button onClick={handleSave} disabled={isPending} style={{ background: "oklch(65% 0.15 45)", color: "oklch(15% 0.05 45)", padding: "13px 28px", borderRadius: 6, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>
                {isPending ? t("Saving…", "Menyimpan…", "Opslaan…", lang) : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard", lang)}
              </button>
            ) : (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "oklch(65% 0.15 145)", fontSize: 14, fontWeight: 600, padding: "13px 0" }}>
                ✓ {t("Saved to Dashboard", "Tersimpan di Dashboard", "Opgeslagen in Dashboard", lang)}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* INTERACTIVE LADDER */}
      <section style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
            {t("Explore the Ladder", "Jelajahi Tangga", "Verken de Ladder", lang)}
          </h2>
          <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", marginBottom: 48, lineHeight: 1.65 }}>
            {t(
              "Start at the ground floor — Observations. Click any rung or use the arrows to climb up, rung by rung, from reality to action.",
              "Mulai dari lantai dasar — Pengamatan. Klik anak tangga manapun atau gunakan panah untuk naik, satu per satu, dari realitas ke tindakan.",
              "Begin op de begane grond — Waarnemingen. Klik op een sport of gebruik de pijlen om omhoog te klimmen, sport voor sport, van realiteit naar actie.",
              lang
            )}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 40, alignItems: "start" }}>

            {/* LADDER SVG */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, flexShrink: 0, width: SVG_W }}>

              {/* Up button */}
              <button
                onClick={moveUp}
                disabled={activeRung === 6}
                style={{
                  padding: "8px 20px", borderRadius: 6,
                  background: activeRung < 6 ? "oklch(22% 0.10 260)" : "oklch(92% 0.005 260)",
                  color: activeRung < 6 ? "white" : "oklch(68% 0.04 260)",
                  border: "none", cursor: activeRung < 6 ? "pointer" : "not-allowed",
                  fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", fontFamily: "Montserrat, sans-serif",
                }}
              >↑ {t("Up", "Naik", "Omhoog", lang)}</button>

              <svg
                viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                width={SVG_W}
                height={SVG_H}
                style={{ display: "block" }}
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Wall surface — subtle background suggesting ladder leans against wall */}
                <rect x={RAIL_X_R - 4} y={RUNG_TOP_Y - 30} width={SVG_W - RAIL_X_R + 12} height={RUNG_BOTTOM_Y - RUNG_TOP_Y + 60} rx={0} fill="#1b3a6b" opacity={0.04} />
                <line x1={RAIL_X_R + 8} y1={RUNG_TOP_Y - 30} x2={RAIL_X_R + 8} y2={RUNG_BOTTOM_Y + 30} stroke="#1b3a6b" strokeWidth={1.5} opacity={0.12} />

                {/* Rail depth shadows */}
                <line x1={RAIL_X_L + 3} y1={RUNG_TOP_Y - 22} x2={RAIL_X_L + 3} y2={RUNG_BOTTOM_Y + 22} stroke="#00000018" strokeWidth={7} strokeLinecap="round" />
                <line x1={RAIL_X_R + 3} y1={RUNG_TOP_Y - 22} x2={RAIL_X_R + 3} y2={RUNG_BOTTOM_Y + 22} stroke="#00000018" strokeWidth={7} strokeLinecap="round" />

                {/* Rails */}
                <line x1={RAIL_X_L} y1={RUNG_TOP_Y - 22} x2={RAIL_X_L} y2={RUNG_BOTTOM_Y + 22} stroke="#1b3a6b" strokeWidth={6} strokeLinecap="round" />
                <line x1={RAIL_X_R} y1={RUNG_TOP_Y - 22} x2={RAIL_X_R} y2={RUNG_BOTTOM_Y + 22} stroke="#1b3a6b" strokeWidth={6} strokeLinecap="round" />

                {/* Ground platform */}
                <rect x={RAIL_X_L - 16} y={RUNG_BOTTOM_Y + 24} width={RAIL_X_R - RAIL_X_L + 32} height={8} rx={4} fill="#1b3a6b" />

                {/* Top cap */}
                <rect x={RAIL_X_L - 8} y={RUNG_TOP_Y - 28} width={RAIL_X_R - RAIL_X_L + 16} height={6} rx={3} fill="#1b3a6b" />

                {/* Rung highlight band */}
                {RUNGS.map((r, i) => {
                  if (i !== activeRung) return null;
                  const y = getRungY(i);
                  return (
                    <rect key={`band-${r.num}`} x={RAIL_X_L - 3} y={y - 16} width={RAIL_X_R - RAIL_X_L + 6} height={32} rx={3} fill={r.color} opacity={0.15} />
                  );
                })}

                {/* Rungs */}
                {RUNGS.map((r, i) => {
                  const y = getRungY(i);
                  const isActive = i === activeRung;
                  return (
                    <g key={r.num} style={{ cursor: "pointer" }} onClick={() => setActiveRung(i)}>
                      <rect x={RAIL_X_L - 8} y={y - 18} width={RAIL_X_R - RAIL_X_L + 16} height={36} fill="transparent" />
                      <line x1={RAIL_X_L} y1={y} x2={RAIL_X_R} y2={y} stroke={isActive ? r.color : "#1b3a6b"} strokeWidth={isActive ? 5 : 2.5} strokeLinecap="round" opacity={isActive ? 1 : 0.55} />
                      <text x={RAIL_X_L - 10} y={y + 4} textAnchor="end" fontSize="8.5" fontWeight={isActive ? "800" : "500"} fontFamily="Montserrat, sans-serif" fill={isActive ? r.color : "#1b3a6b"} opacity={isActive ? 1 : 0.45}>{r.num}</text>
                    </g>
                  );
                })}

                {/* Climbing person */}
                <ClimbingPerson personY={personY} color={rung.color} />
              </svg>

              {/* Down button */}
              <button
                onClick={moveDown}
                disabled={activeRung === 0}
                style={{
                  padding: "8px 20px", borderRadius: 6,
                  background: activeRung > 0 ? "oklch(22% 0.10 260)" : "oklch(92% 0.005 260)",
                  color: activeRung > 0 ? "white" : "oklch(68% 0.04 260)",
                  border: "none", cursor: activeRung > 0 ? "pointer" : "not-allowed",
                  fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", fontFamily: "Montserrat, sans-serif",
                }}
              >↓ {t("Down", "Turun", "Omlaag", lang)}</button>
            </div>

            {/* CONTENT PANEL */}
            <div style={{ flex: 1, minWidth: 280 }}>
              {/* Rung selector pills — bottom to top */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
                {[...RUNGS].reverse().map((r, revIdx) => {
                  const idx = 6 - revIdx;
                  const isActive = idx === activeRung;
                  return (
                    <button
                      key={r.num}
                      onClick={() => setActiveRung(idx)}
                      style={{
                        padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer",
                        border: `2px solid ${isActive ? r.color : "oklch(88% 0.008 260)"}`,
                        background: isActive ? r.color : "white",
                        color: isActive ? "white" : "oklch(40% 0.06 260)",
                        transition: "all 0.15s",
                      }}
                    >
                      {r.num} {r.shortLabel[lang]}
                    </button>
                  );
                })}
              </div>

              {/* Active rung detail */}
              <div style={{ background: "white", borderRadius: 12, padding: "36px", boxShadow: "0 2px 16px oklch(20% 0.06 260 / 0.08)" }}>
                <div style={{ marginBottom: 20 }}>
                  <span style={{ display: "inline-block", fontFamily: "Cormorant Garamond, serif", fontSize: 13, fontWeight: 600, color: "oklch(65% 0.15 45)", letterSpacing: "0.04em", marginBottom: 6 }}>
                    {t("Rung", "Anak Tangga", "Sport", lang)} {rung.num}
                  </span>
                  <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 600, color: rung.colorOklch, margin: "0 0 6px", lineHeight: 1.2 }}>{rung.label[lang]}</h3>
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: "oklch(38% 0.06 260)", margin: "0 0 20px", fontWeight: 500 }}>{rung.desc[lang]}</p>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: "oklch(44% 0.06 260)", margin: "0 0 28px" }}>{rung.detail[lang]}</p>
                <div style={{ background: `${rung.color}10`, borderRadius: 8, padding: "16px 20px" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: rung.colorOklch, margin: "0 0 8px" }}>
                    {t("Reflection Question", "Pertanyaan Refleksi", "Reflectievraag", lang)}
                  </p>
                  <p style={{ fontSize: 15, lineHeight: 1.65, color: "oklch(30% 0.06 260)", margin: 0, fontStyle: "italic" }}>&ldquo;{rung.reflection[lang]}&rdquo;</p>
                </div>
              </div>

              {/* Navigation within content panel */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
                <button
                  onClick={moveDown}
                  disabled={activeRung === 0}
                  style={{ padding: "10px 20px", borderRadius: 6, fontSize: 13, fontWeight: 600, border: "1px solid oklch(86% 0.008 260)", background: "white", color: activeRung > 0 ? "oklch(30% 0.06 260)" : "oklch(70% 0.04 260)", cursor: activeRung > 0 ? "pointer" : "not-allowed" }}
                >
                  ← {activeRung > 0 ? `${RUNGS[activeRung - 1].num}: ${RUNGS[activeRung - 1].shortLabel[lang]}` : t("Bottom", "Dasar", "Onderste", lang)}
                </button>
                <button
                  onClick={moveUp}
                  disabled={activeRung === 6}
                  style={{ padding: "10px 20px", borderRadius: 6, fontSize: 13, fontWeight: 600, border: "1px solid oklch(86% 0.008 260)", background: "white", color: activeRung < 6 ? "oklch(30% 0.06 260)" : "oklch(70% 0.04 260)", cursor: activeRung < 6 ? "pointer" : "not-allowed" }}
                >
                  {activeRung < 6 ? `${RUNGS[activeRung + 1].num}: ${RUNGS[activeRung + 1].shortLabel[lang]}` : t("Top", "Puncak", "Top", lang)} →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE REFLEXIVE LOOP */}
      <section style={{ background: "oklch(94% 0.008 260)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
            {t("The Reflexive Loop", "Lingkaran Refleksif", "De Reflexieve Lus", lang)}
          </h2>
          <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", marginBottom: 32, lineHeight: 1.65, maxWidth: 680 }}>
            {t(
              "The most dangerous part of the Ladder isn't the climb — it's the loop. Our beliefs directly influence what data we pay attention to next. This means our ladder can become self-sealing: we unconsciously select data that confirms what we already believe.",
              "Bagian paling berbahaya dari Tangga bukan pendakiannya — melainkan lingkarannya. Keyakinan kita langsung mempengaruhi data apa yang kita perhatikan selanjutnya. Ini berarti tangga kita bisa menjadi mandiri: kita secara tidak sadar memilih data yang mengkonfirmasi apa yang sudah kita percayai.",
              "Het gevaarlijkste deel van de Ladder is niet de klim — het is de lus. Onze overtuigingen beïnvloeden direct welke data we de volgende keer opmerken. Dit betekent dat onze ladder zelfdichtend kan worden: we selecteren onbewust data die bevestigt wat we al geloven.",
              lang
            )}
          </p>
          <div style={{ background: "white", borderRadius: 12, padding: "32px 36px", display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap", boxShadow: "0 1px 8px oklch(20% 0.06 260 / 0.07)" }}>
            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 60, fontWeight: 600, color: "oklch(65% 0.15 45)", lineHeight: 1, flexShrink: 0 }}>↻</div>
            <div>
              <h4 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 10px" }}>
                {t("Beliefs shape perception", "Keyakinan membentuk persepsi", "Overtuigingen vormen perceptie", lang)}
              </h4>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "oklch(38% 0.06 260)", margin: 0 }}>
                {t(
                  "Once you believe something — about a colleague, a culture, a situation — you will naturally select and interpret new data to confirm it. The ladder runs on autopilot. The only escape is deliberate reflection: getting back down to the ground floor and questioning what you selected and why.",
                  "Begitu Anda mempercayai sesuatu — tentang seorang rekan, budaya, situasi — Anda secara alami akan memilih dan menafsirkan data baru untuk mengkonfirmasinya. Tangga berjalan dengan autopilot. Satu-satunya jalan keluarnya adalah refleksi yang disengaja: kembali ke lantai dasar dan mempertanyakan apa yang Anda pilih dan mengapa.",
                  "Zodra je iets gelooft — over een collega, een cultuur, een situatie — zul je van nature nieuwe data selecteren en interpreteren om het te bevestigen. De ladder draait op automatische piloot. De enige uitweg is bewuste reflectie: terugkeren naar de begane grond en bevragen wat je selecteerde en waarom.",
                  lang
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO CLIMB DOWN */}
      <section style={{ padding: "72px 24px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
          {t("How to Climb Back Down", "Cara Turun Kembali", "Hoe Terug te Dalen", lang)}
        </h2>
        <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", marginBottom: 40, lineHeight: 1.65 }}>
          {t(
            "When you notice conflict, confusion, or a strong reaction — use these four steps to trace your way back to reality.",
            "Ketika Anda memperhatikan konflik, kebingungan, atau reaksi yang kuat — gunakan empat langkah ini untuk menelusuri jalan kembali ke realitas.",
            "Wanneer u conflict, verwarring of een sterke reactie opmerkt — gebruik deze vier stappen om uw weg terug naar de werkelijkheid te traceren.",
            lang
          )}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {CLIMB_DOWN_STEPS.map(step => (
            <div key={step.num} style={{ background: "white", borderRadius: 10, padding: "24px", boxShadow: "0 1px 8px oklch(20% 0.06 260 / 0.07)" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 36, fontWeight: 600, color: "oklch(65% 0.15 45)", lineHeight: 1, flexShrink: 0 }}>{step.num}</span>
                <div>
                  <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, color: "oklch(22% 0.10 260)", margin: "0 0 8px" }}>{step.title[lang]}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: "oklch(42% 0.06 260)", margin: 0 }}>{step.desc[lang]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "oklch(22% 0.10 260)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(96% 0.005 80)", margin: "0 0 20px" }}>
            {t("Most Conflicts Live at the Top", "Kebanyakan Konflik Ada di Puncak", "De Meeste Conflicten Leven aan de Top", lang)}
          </h2>
          <p style={{ fontSize: 16, color: "oklch(72% 0.05 260)", lineHeight: 1.7, marginBottom: 40 }}>
            {t(
              "The next time you feel certain about someone's motives or ready to act on a conclusion — stop. What rung are you on? What's actually observable?",
              "Lain kali Anda merasa yakin tentang motif seseorang atau siap bertindak berdasarkan kesimpulan — berhenti. Di anak tangga mana Anda berada? Apa yang sebenarnya dapat diamati?",
              "De volgende keer dat u zeker bent over iemands motieven of klaar bent om op een conclusie te handelen — stop. Op welke sport staat u? Wat is er daadwerkelijk waarneembaar?",
              lang
            )}
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setActiveRung(0)} style={{ display: "inline-block", background: "oklch(65% 0.15 45)", color: "oklch(15% 0.05 45)", padding: "14px 32px", borderRadius: 6, fontWeight: 700, fontSize: 14, letterSpacing: "0.04em", border: "none", cursor: "pointer" }}>
              {t("Start at the Ground Floor", "Mulai dari Lantai Dasar", "Begin op de Begane Grond", lang)}
            </button>
            <Link href="/resources" style={{ display: "inline-block", background: "transparent", color: "oklch(85% 0.04 260)", padding: "14px 32px", borderRadius: 6, fontWeight: 600, fontSize: 14, border: "1px solid oklch(42% 0.08 260)", textDecoration: "none" }}>
              {t("← Content Library", "← Perpustakaan Konten", "← Contentbibliotheek", lang)}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
