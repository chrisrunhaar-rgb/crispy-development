"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const CHARACTERISTICS = [
  {
    num: "01",
    en_title: "Listening",
    id_title: "Mendengarkan",
    nl_title: "Luisteren",
    en_desc: "A deep commitment to truly listening to others — not to respond, but to understand. Servant leaders identify the will of the group through careful, attentive listening.",
    id_desc: "Komitmen mendalam untuk benar-benar mendengarkan orang lain — bukan untuk merespons, tetapi untuk memahami. Pemimpin pelayan mengidentifikasi kehendak kelompok melalui mendengarkan dengan cermat.",
    nl_desc: "Een diepe toewijding aan het echt luisteren naar anderen — niet om te antwoorden, maar om te begrijpen. Dienstleiders identificeren de wil van de groep door zorgvuldig te luisteren.",
  },
  {
    num: "02",
    en_title: "Empathy",
    id_title: "Empati",
    nl_title: "Empathie",
    en_desc: "Striving to understand and accept others for their unique spirits and experiences — especially in moments of failure or struggle.",
    id_desc: "Berusaha untuk memahami dan menerima orang lain atas semangat dan pengalaman unik mereka — terutama dalam momen kegagalan atau perjuangan.",
    nl_desc: "Streven naar begrip en acceptatie van anderen voor hun unieke geest en ervaringen — vooral in momenten van mislukking of strijd.",
  },
  {
    num: "03",
    en_title: "Healing",
    id_title: "Pemulihan",
    nl_title: "Genezing",
    en_desc: "Recognising the opportunity to help heal people and relationships. Servant leaders create environments where brokenness — personal and relational — can be restored.",
    id_desc: "Mengenali kesempatan untuk membantu menyembuhkan orang dan hubungan. Pemimpin pelayan menciptakan lingkungan di mana kerusakan dapat dipulihkan.",
    nl_desc: "De kans herkennen om mensen en relaties te helpen genezen. Dienstleiders creëren omgevingen waar gebrokenheid hersteld kan worden.",
  },
  {
    num: "04",
    en_title: "Awareness",
    id_title: "Kesadaran",
    nl_title: "Bewustzijn",
    en_desc: "High self-awareness and situational awareness — the ability to view situations from an integrated, holistic perspective rather than reacting to the surface.",
    id_desc: "Kesadaran diri dan situasional yang tinggi — kemampuan untuk melihat situasi dari perspektif yang terintegrasi dan holistik.",
    nl_desc: "Hoge zelfbewustzijn en situationeel bewustzijn — het vermogen om situaties vanuit een geïntegreerd, holistisch perspectief te zien.",
  },
  {
    num: "05",
    en_title: "Persuasion",
    id_title: "Persuasi",
    nl_title: "Overtuiging",
    en_desc: "Relying on persuasion rather than positional authority to build consensus. Servant leaders influence through compelling vision and relationship — not rank or coercion.",
    id_desc: "Mengandalkan persuasi daripada otoritas posisional untuk membangun konsensus. Pemimpin pelayan memengaruhi melalui visi yang menarik dan hubungan.",
    nl_desc: "Vertrouwen op overtuiging in plaats van positionele autoriteit om consensus te bouwen.",
  },
  {
    num: "06",
    en_title: "Conceptualisation",
    id_title: "Konseptualisasi",
    nl_title: "Conceptualisering",
    en_desc: "Thinking beyond day-to-day realities to nurture the ability to dream great dreams — and help others see a future worth working toward.",
    id_desc: "Berpikir melampaui realitas sehari-hari untuk memupuk kemampuan bermimpi besar.",
    nl_desc: "Denken voorbij dagelijkse realiteiten om het vermogen te koesteren grote dromen te dromen.",
  },
  {
    num: "07",
    en_title: "Foresight",
    id_title: "Pandangan ke Depan",
    nl_title: "Vooruitziendheid",
    en_desc: "Understanding lessons from the past, realities of the present, and likely consequences of decisions — before a crisis makes the lesson obvious.",
    id_desc: "Memahami pelajaran dari masa lalu, realitas masa kini, dan kemungkinan konsekuensi keputusan.",
    nl_desc: "Lessen uit het verleden begrijpen, realiteiten van het heden, en waarschijnlijke gevolgen van beslissingen.",
  },
  {
    num: "08",
    en_title: "Stewardship",
    id_title: "Pengelolaan",
    nl_title: "Rentmeesterschap",
    en_desc: "Holding the organisation in trust for the greater good — not for personal gain or legacy. Servant leaders see themselves as custodians, not owners.",
    id_desc: "Memegang organisasi dengan amanah untuk kebaikan yang lebih besar. Pemimpin pelayan melihat diri mereka sebagai penjaga, bukan pemilik.",
    nl_desc: "De organisatie in vertrouwen houden voor het grotere goed. Dienstleiders zien zichzelf als beheerders, niet als eigenaren.",
  },
  {
    num: "09",
    en_title: "Commitment to Growth",
    id_title: "Komitmen terhadap Pertumbuhan",
    nl_title: "Toewijding aan Groei",
    en_desc: "A deep commitment to the personal, professional, and spiritual growth of every individual in the organisation — not just those who perform well.",
    id_desc: "Komitmen mendalam pada pertumbuhan pribadi, profesional, dan rohani setiap individu dalam organisasi — bukan hanya yang berkinerja baik.",
    nl_desc: "Een diepe toewijding aan de persoonlijke, professionele en spirituele groei van elk individu — niet alleen degenen die goed presteren.",
  },
  {
    num: "10",
    en_title: "Building Community",
    id_title: "Membangun Komunitas",
    nl_title: "Gemeenschap Bouwen",
    en_desc: "Actively building community within the organisation — creating belonging, shared purpose, and relational bonds that make the work meaningful beyond the task.",
    id_desc: "Secara aktif membangun komunitas dalam organisasi — menciptakan rasa memiliki, tujuan bersama, dan ikatan relasional yang membuat pekerjaan bermakna.",
    nl_desc: "Actief gemeenschap bouwen binnen de organisatie — verbondenheid, gedeeld doel en relationele banden creëren die het werk betekenisvol maken.",
  },
];

const SCENARIOS = [
  {
    title: { en: "The Persuasion Paradox", id: "Paradoks Persuasi", nl: "Het Overtuigingsparadox" },
    setup: {
      en: "A Western manager in Southeast Asia adopts a servant leadership approach — relying on persuasion and consensus-building rather than direct authority. He avoids giving direct orders, preferring to invite input before moving forward.",
      id: "Seorang manajer Barat di Asia Tenggara mengadopsi pendekatan kepemimpinan pelayan — mengandalkan persuasi dan pembangunan konsensus daripada otoritas langsung. Ia menghindari memberi perintah langsung.",
      nl: "Een Westerse manager in Zuidoost-Azië adopteert een dienstleiderschapsbenadering — vertrouwend op overtuiging en consensusvorming in plaats van directe autoriteit.",
    },
    breakdown: {
      en: "His team, accustomed to a nurturant-task leader who acts like a protective family head, interprets this as weakness. Confidence drops. Team members feel anxious — they want clear direction, not consensus-seeking.",
      id: "Timnya, yang terbiasa dengan pemimpin yang bertindak seperti kepala keluarga pelindung, menafsirkan ini sebagai kelemahan. Kepercayaan turun.",
      nl: "Zijn team, gewend aan een leider die als een beschermend familiehoofd optreedt, interpreteert dit als zwakte. Vertrouwen daalt.",
    },
    response: {
      en: "Servant leadership isn't the absence of direction — it's servant-directed clarity. Give clear, confident direction while privately asking: 'What do you need from me to succeed?' Service is in how you lead, not whether you lead.",
      id: "Kepemimpinan pelayan bukan ketidakhadiran arahan. Berikan arahan yang jelas sambil secara pribadi bertanya: 'Apa yang Anda butuhkan dari saya untuk berhasil?'",
      nl: "Dienstleiderschap is niet de afwezigheid van richting. Geef duidelijke richting terwijl je privé vraagt: 'Wat heb je van mij nodig om te slagen?'",
    },
  },
  {
    title: { en: "The Growth Test Backfires", id: "Uji Pertumbuhan yang Berbalik", nl: "De Groeitest Mislukt" },
    setup: {
      en: "A servant leader applies Greenleaf's 'best test' — whether people are becoming more autonomous and self-directed. He delegates heavily and steps back from oversight to give his team freedom.",
      id: "Seorang pemimpin pelayan menerapkan 'uji terbaik' Greenleaf — apakah orang-orangnya menjadi lebih otonom. Ia mendelegasikan secara besar-besaran.",
      nl: "Een dienstleider past Greenleafs 'beste test' toe — of mensen autonomer worden. Hij delegeert zwaar en trekt zich terug uit toezicht.",
    },
    breakdown: {
      en: "In a collectivist culture, employees don't want autonomy — they want to belong. The team feels abandoned and unsupported. 'He doesn't care about us' is the whisper that spreads. Autonomy is not a universal good.",
      id: "Dalam budaya kolektivis, karyawan tidak menginginkan otonomi — mereka ingin memiliki. Tim merasa ditinggalkan. 'Dia tidak peduli dengan kami' adalah bisikan yang menyebar.",
      nl: "In een collectivistische cultuur willen medewerkers geen autonomie — ze willen erbij horen. Het team voelt zich verlaten. 'Hij geeft niet om ons' verspreidt zich.",
    },
    response: {
      en: "Adapt Greenleaf's test: in collectivist cultures, ask 'Are those I serve becoming more connected, more valued, and more confident in the community?' Service that produces belonging may look very different from service that produces independence.",
      id: "Adaptasi uji Greenleaf: dalam budaya kolektivis, tanyakan 'Apakah mereka menjadi lebih terhubung dan lebih dihargai dalam komunitas?'",
      nl: "Pas Greenleafs test aan: vraag in collectivistische culturen 'Worden degenen die ik dien meer verbonden en gewaardeerd in de gemeenschap?'",
    },
  },
  {
    title: { en: "Stewardship Across Borders", id: "Pengelolaan Lintas Batas", nl: "Rentmeesterschap over Grenzen" },
    setup: {
      en: "A Dutch leader takes over a Malaysian organisation with strong stewardship values. He introduces Western performance frameworks: KPIs, individual goals, and annual reviews to ensure accountability.",
      id: "Seorang pemimpin Belanda mengambil alih organisasi Malaysia. Ia memperkenalkan kerangka kinerja Barat: KPI, tujuan individu, dan tinjauan tahunan.",
      nl: "Een Nederlandse leider neemt een Maleisische organisatie over. Hij introduceert Westerse prestatieframeworks: KPI's, individuele doelen en jaarlijkse beoordelingen.",
    },
    breakdown: {
      en: "The team experiences the new structure as punitive rather than developmental. 'Being held accountable' feels like being watched and judged, not served. The stewardship value is real — but the cultural expression has misfired.",
      id: "Tim mengalami struktur baru sebagai hukuman daripada pengembangan. 'Dimintai pertanggungjawaban' terasa seperti diawasi dan dihakimi.",
      nl: "Het team ervaart de nieuwe structuur als bestraffend. 'Verantwoording worden gehouden' voelt als bewaakt en beoordeeld worden, niet gediend.",
    },
    response: {
      en: "Stewardship means holding the whole person in trust. Embed accountability in relational conversations: 'How are you? What do you need? How can I help you succeed?' The framework serves the person, not the other way around.",
      id: "Pengelolaan berarti memegang seluruh orang dengan amanah. Sematkan akuntabilitas dalam percakapan relasional: 'Bagaimana kabar Anda? Apa yang Anda butuhkan?'",
      nl: "Rentmeesterschap betekent de hele persoon in vertrouwen houden. Verwerk verantwoording in relationele gesprekken: 'Hoe gaat het? Wat heb je nodig?'",
    },
  },
];

const PRACTICES = [
  {
    en: "Ask your team regularly: 'What do you need from me right now?' — and act on what they tell you.",
    id: "Tanyakan kepada tim Anda secara teratur: 'Apa yang Anda butuhkan dari saya sekarang?' — dan bertindak berdasarkan apa yang mereka katakan.",
    nl: "Vraag je team regelmatig: 'Wat heb je nu van mij nodig?' — en handel naar wat ze vertellen.",
  },
  {
    en: "Apply Greenleaf's 'best test' quarterly: Are those you lead becoming healthier, wiser, and more capable?",
    id: "Terapkan 'uji terbaik' Greenleaf setiap kuartal: Apakah mereka yang Anda pimpin menjadi lebih sehat, lebih bijaksana, dan lebih mampu?",
    nl: "Pas Greenleafs 'beste test' elk kwartaal toe: Worden degenen die je leidt gezonder, wijzer en bekwamer?",
  },
  {
    en: "Take on one task your team normally handles — not to micromanage, but to understand their reality from the inside.",
    id: "Ambil alih satu tugas yang biasanya ditangani tim — bukan untuk mengontrol berlebihan, tetapi untuk memahami realitas mereka dari dalam.",
    nl: "Neem één taak over die je team normaal uitvoert — niet om te micromanagen, maar om hun realiteit van binnenuit te begrijpen.",
  },
  {
    en: "Adapt the 'autonomy' goal to cultural context — in collectivist settings, serve through belonging and community, not independence.",
    id: "Adaptasi tujuan 'otonomi' ke konteks budaya — dalam setting kolektivis, layani melalui rasa memiliki dan komunitas.",
    nl: "Pas het 'autonomie'-doel aan naar culturele context — in collectivistische settings, dien via verbondenheid en gemeenschap.",
  },
  {
    en: "Create structured forgiveness — when team members fail, name it clearly and restore quickly rather than carrying the weight forward.",
    id: "Ciptakan pengampunan yang terstruktur — ketika anggota tim gagal, nyatakan dengan jelas dan pulihkan dengan cepat.",
    nl: "Creëer gestructureerde vergeving — wanneer teamleden falen, benoem het duidelijk en herstel snel.",
  },
  {
    en: "Invest deliberately in the growth of your weakest team member — not just your highest performer.",
    id: "Investasikan secara sengaja dalam pertumbuhan anggota tim Anda yang paling lemah — bukan hanya yang berkinerja tertinggi.",
    nl: "Investeer bewust in de groei van je zwakste teamlid — niet alleen je beste presteerder.",
  },
];

const REFLECTION = [
  {
    roman: "I",
    en: "Who in your team is genuinely growing under your leadership? Who is not — and what does that tell you?",
    id: "Siapa dalam tim Anda yang benar-benar bertumbuh di bawah kepemimpinan Anda? Siapa yang tidak — dan apa yang itu katakan kepada Anda?",
    nl: "Wie in je team groeit oprecht onder jouw leiderschap? Wie niet — en wat zegt dat je?",
  },
  {
    roman: "II",
    en: "In your cultural context, what does 'serving your team' actually look like — and how might it differ from what you assumed?",
    id: "Dalam konteks budaya Anda, seperti apa 'melayani tim Anda' sebenarnya — dan bagaimana mungkin berbeda dari yang Anda asumsikan?",
    nl: "In jouw culturele context, hoe ziet 'je team dienen' er eigenlijk uit — en hoe kan het verschillen van wat je aannam?",
  },
  {
    roman: "III",
    en: "When did you last use your authority to protect someone rather than accomplish a task? What happened?",
    id: "Kapan terakhir kali Anda menggunakan otoritas Anda untuk melindungi seseorang daripada menyelesaikan tugas?",
    nl: "Wanneer gebruikte je voor het laatst je autoriteit om iemand te beschermen in plaats van een taak te volbrengen?",
  },
  {
    roman: "IV",
    en: "If Greenleaf's 'best test' were applied to your team today — are those you lead becoming healthier, wiser, and more free?",
    id: "Jika 'uji terbaik' Greenleaf diterapkan pada tim Anda hari ini — apakah mereka yang Anda pimpin menjadi lebih sehat, lebih bijaksana, dan lebih bebas?",
    nl: "Als Greenleafs 'beste test' vandaag op je team werd toegepast — worden degenen die je leidt gezonder, wijzer en vrijer?",
  },
  {
    roman: "V",
    en: "Jesus washed feet. What is the 'foot washing' equivalent in your specific leadership context right now?",
    id: "Yesus membasuh kaki. Apa yang setara dengan 'membasuh kaki' dalam konteks kepemimpinan spesifik Anda saat ini?",
    nl: "Jezus waste voeten. Wat is het equivalent van 'voeten wassen' in jouw specifieke leiderschapscontext op dit moment?",
  },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function ServantLeadershipClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [openScenario, setOpenScenario] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("servant-leadership");
      setSaved(true);
    });
  }

  const navy = "oklch(22% 0.10 260)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const orange = "oklch(65% 0.15 45)";
  const bodyText = "oklch(38% 0.05 260)";
  const visibleChars = showAll ? CHARACTERISTICS : CHARACTERISTICS.slice(0, 5);

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>
      <div style={{ background: lightGray, borderBottom: "1px solid oklch(90% 0.01 80)", padding: "10px 24px", display: "flex", gap: 8, justifyContent: "flex-end" }}>
        {(["en", "id", "nl"] as Lang[]).map((l) => (
          <button key={l} onClick={() => setLang(l)} style={{ padding: "4px 14px", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, background: lang === l ? navy : "transparent", color: lang === l ? offWhite : bodyText }}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ background: navy, padding: "80px 24px 72px", textAlign: "center" }}>
        <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
          {t("Leadership Style", "Gaya Kepemimpinan", "Leiderschapsstijl")}
        </p>
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: offWhite, margin: "0 auto 20px", maxWidth: 760, lineHeight: 1.15 }}>
          {t("Servant Leadership", "Kepemimpinan Pelayan", "Dienend Leiderschap")}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(85% 0.03 80)", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.6, fontStyle: "italic" }}>
          {t(
            '"The servant-leader is servant first. It begins with the natural feeling that one wants to serve." — Robert Greenleaf',
            '"Pemimpin-pelayan adalah pelayan terlebih dahulu. Ini dimulai dengan perasaan alami bahwa seseorang ingin melayani." — Robert Greenleaf',
            '"De dienstleider is eerst dienaar. Het begint met het natuurlijke gevoel dat men wil dienen." — Robert Greenleaf'
          )}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={handleSave} disabled={saved || isPending} style={{ padding: "12px 28px", border: "none", cursor: saved ? "default" : "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, background: saved ? "oklch(55% 0.08 260)" : orange, color: offWhite }}>
            {saved ? t("Saved", "Tersimpan", "Opgeslagen") : t("Save to Dashboard", "Simpan ke Dasbor", "Opslaan in Dashboard")}
          </button>
          <Link href="/resources" style={{ padding: "12px 28px", border: "1px solid oklch(50% 0.05 260)", fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 600, color: offWhite, textDecoration: "none" }}>
            {t("All Resources", "Semua Sumber", "Alle Bronnen")}
          </Link>
        </div>
      </div>

      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, marginBottom: 20 }}>
          {t(
            "In 1970, Robert Greenleaf introduced a challenge that still unsettles leadership culture: what if the primary question of leadership is not 'what do I want to achieve?' but 'who do I want to serve?' Servant leadership begins not with ambition but with a disposition — the natural desire to put others first.",
            "Pada tahun 1970, Robert Greenleaf memperkenalkan tantangan yang masih mengguncang budaya kepemimpinan: bagaimana jika pertanyaan utama kepemimpinan bukan 'apa yang ingin saya capai?' tetapi 'siapa yang ingin saya layani?'",
            "In 1970 introduceerde Robert Greenleaf een uitdaging die de leiderschapscultuur nog steeds ontwricht: wat als de primaire vraag van leiderschap niet is 'wat wil ik bereiken?' maar 'wie wil ik dienen?'"
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75 }}>
          {t(
            "For cross-cultural leaders, servant leadership takes a complex turn. 'Service' is not universal. What looks like humility in one culture reads as weakness in another. The servant leader must hold both the model and the cultural context — learning to serve in ways that actually feel like service to the people being served.",
            "Bagi pemimpin lintas budaya, kepemimpinan pelayan mengambil giliran yang kompleks. 'Pelayanan' tidak universal. Apa yang terlihat seperti kerendahan hati dalam satu budaya dibaca sebagai kelemahan di budaya lain.",
            "Voor interculturele leiders neemt dienend leiderschap een complexe wending. 'Service' is niet universeel. Wat er in de ene cultuur uitziet als bescheidenheid, wordt in de andere gelezen als zwakte."
          )}
        </p>
      </div>

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 12, textAlign: "center" }}>
            {t("10 Characteristics", "10 Karakteristik", "10 Kenmerken")}
          </h2>
          <p style={{ textAlign: "center", color: bodyText, fontSize: 15, marginBottom: 48 }}>
            {t("Distilled by Larry Spears from Greenleaf's writing", "Didistilasi oleh Larry Spears dari tulisan Greenleaf", "Gedistilleerd door Larry Spears uit Greenleafs schrijven")}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
            {visibleChars.map((c) => (
              <div key={c.num} style={{ background: offWhite, padding: "24px 28px", display: "flex", gap: 18, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 36, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 32, flexShrink: 0 }}>{c.num}</div>
                <div>
                  <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 15, fontWeight: 700, color: navy, marginBottom: 8 }}>
                    {lang === "en" ? c.en_title : lang === "id" ? c.id_title : c.nl_title}
                  </h3>
                  <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.7, margin: 0 }}>
                    {lang === "en" ? c.en_desc : lang === "id" ? c.id_desc : c.nl_desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {!showAll && (
            <div style={{ textAlign: "center", marginTop: 28 }}>
              <button onClick={() => setShowAll(true)} style={{ padding: "10px 28px", background: "transparent", border: `1px solid ${navy}`, cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 600, color: navy }}>
                {t("Show All 10", "Tampilkan Semua 10", "Toon Alle 10")}
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: "72px 24px", maxWidth: 800, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 12, textAlign: "center" }}>
          {t("When Servant Leadership is Misread", "Ketika Kepemimpinan Pelayan Disalahartikan", "Wanneer Dienend Leiderschap Verkeerd Wordt Gelezen")}
        </h2>
        <p style={{ textAlign: "center", color: bodyText, fontSize: 15, marginBottom: 48 }}>
          {t("Three cross-cultural scenarios — and what serving well looks like", "Tiga skenario lintas budaya — dan seperti apa melayani dengan baik", "Drie interculturele scenario's — en hoe goed dienen eruitziet")}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {SCENARIOS.map((s, i) => {
            const isOpen = openScenario === i;
            return (
              <div key={i} style={{ border: `1px solid ${isOpen ? orange : "oklch(88% 0.01 80)"}`, overflow: "hidden" }}>
                <button onClick={() => setOpenScenario(isOpen ? null : i)} style={{ width: "100%", padding: "20px 28px", background: isOpen ? navy : offWhite, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, textAlign: "left" }}>
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 16, fontWeight: 700, color: isOpen ? offWhite : navy }}>{s.title[lang]}</span>
                  <span style={{ color: isOpen ? orange : bodyText, fontSize: 20, flexShrink: 0, lineHeight: 1 }}>{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div style={{ padding: "28px 28px 32px", background: offWhite }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: orange, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{t("The Situation", "Situasinya", "De Situatie")}</p>
                    <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, marginBottom: 24 }}>{s.setup[lang]}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "oklch(45% 0.15 20)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{t("What Went Wrong", "Yang Salah", "Wat Misging")}</p>
                    <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, marginBottom: 24 }}>{s.breakdown[lang]}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "oklch(40% 0.12 160)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{t("Serving Well", "Melayani dengan Baik", "Goed Dienen")}</p>
                    <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>{s.response[lang]}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ background: navy, padding: "72px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
            {t("Faith Anchor", "Jangkar Iman", "Geloofsanker")}
          </p>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: offWhite, marginBottom: 48 }}>
            {t("The Original Servant Leader", "Pemimpin Pelayan Asali", "De Originele Dienstleider")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {[
              {
                ref: "Mark 10:42–45",
                verse: {
                  en: '"Whoever wants to become great among you must be your servant, and whoever wants to be first must be slave of all. For even the Son of Man did not come to be served, but to serve."',
                  id: '"Barangsiapa ingin menjadi besar di antara kamu, hendaklah ia menjadi pelayanmu... Karena Anak Manusia juga datang bukan untuk dilayani, melainkan untuk melayani."',
                  nl: '"Wie groot wil worden onder u, zal uw dienaar zijn... Want ook de Mensenzoon is niet gekomen om gediend te worden, maar om te dienen."',
                },
                comment: {
                  en: "The model that overturned the entire understanding of authority. Jesus did not abolish leadership — he redefined greatness. This is not a call to passivity but to a radical reorientation of why and how leaders use power.",
                  id: "Model yang membalikkan seluruh pemahaman tentang otoritas. Yesus tidak menghapuskan kepemimpinan — Ia mendefinisikan ulang kebesaran.",
                  nl: "Het model dat het hele begrip van autoriteit omverwerp. Jezus schafte leiderschap niet af — hij herdefinieerde grootheid.",
                },
              },
              {
                ref: "John 13:14–15",
                verse: {
                  en: '"Now that I, your Lord and Teacher, have washed your feet, you also should wash one another\'s feet. I have set you an example that you should do as I have done for you."',
                  id: '"Jadi jikalau Aku membasuh kakimu, Aku yang adalah Tuhan dan Gurumu, maka kamupun wajib saling membasuh kakimu; sebab Aku telah memberikan suatu teladan kepada kamu."',
                  nl: '"Als dan Ik, uw Here en Meester, uw voeten gewassen heb, behoort ook gij elkanders voeten te wassen; want Ik heb u een voorbeeld gegeven."',
                },
                comment: {
                  en: "Jesus didn't theorise servant leadership — he demonstrated it with a towel and a basin. The question for every leader in every culture: what is the 'foot washing' of my context? What act of service communicates 'I am here for you, not above you'?",
                  id: "Yesus tidak meneorikan kepemimpinan pelayan — Ia mendemonstrasikannya dengan handuk dan bak. Pertanyaan untuk setiap pemimpin: apa 'membasuh kaki' dalam konteks saya?",
                  nl: "Jezus theoretiseerde dienend leiderschap niet — hij demonstreerde het met een handdoek en een bekken. De vraag voor elke leider: wat is het 'voeten wassen' van mijn context?",
                },
              },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: "left" }}>
                <p style={{ color: orange, fontSize: 13, fontWeight: 700, marginBottom: 10 }}>{item.ref}</p>
                <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 20, fontStyle: "italic", color: offWhite, lineHeight: 1.6, marginBottom: 16 }}>{item.verse[lang]}</p>
                <p style={{ fontSize: 15, color: "oklch(78% 0.03 80)", lineHeight: 1.75, margin: 0 }}>{item.comment[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 48, textAlign: "center" }}>
            {t("6 Practices", "6 Praktik", "6 Praktijken")}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {PRACTICES.map((p, i) => (
              <div key={i} style={{ background: lightGray, padding: "24px 28px", display: "flex", gap: 18, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 40, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 32, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</div>
                <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0, paddingTop: 4 }}>{lang === "en" ? p.en : lang === "id" ? p.id : p.nl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
            {t("Reflection Questions", "Pertanyaan Refleksi", "Reflectievragen")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {REFLECTION.map((q) => (
              <div key={q.roman} style={{ background: offWhite, padding: "24px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 22, fontWeight: 700, color: orange, minWidth: 28, flexShrink: 0 }}>{q.roman}</div>
                <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>{lang === "en" ? q.en : lang === "id" ? q.id : q.nl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: navy, padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: offWhite, marginBottom: 16 }}>
          {t("Keep Growing", "Terus Bertumbuh", "Blijf Groeien")}
        </h2>
        <p style={{ color: "oklch(80% 0.03 80)", fontSize: 16, lineHeight: 1.75, maxWidth: 540, margin: "0 auto 32px" }}>
          {t("Explore more resources to deepen your cross-cultural leadership.", "Jelajahi lebih banyak sumber untuk memperdalam kepemimpinan lintas budaya Anda.", "Verken meer bronnen om je intercultureel leiderschap te verdiepen.")}
        </p>
        <Link href="/resources" style={{ display: "inline-block", padding: "14px 32px", background: orange, color: offWhite, fontFamily: "Montserrat, sans-serif", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
          {t("Browse All Resources", "Jelajahi Semua Sumber", "Bekijk Alle Bronnen")}
        </Link>
      </div>
    </div>
  );
}
