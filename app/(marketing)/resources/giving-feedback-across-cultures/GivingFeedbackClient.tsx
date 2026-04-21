"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const whyDifferent = [
  { number: "1", en_title: "Face-saving cultures", id_title: "Budaya menjaga muka", nl_title: "Gezichtsbesparende culturen", en_desc: "In many Asian and Middle Eastern cultures, public criticism — however gentle — can cause significant loss of face. Feedback that would land as 'direct and helpful' in a Dutch context may land as deeply shaming in an Indonesian or Chinese context. The relationship damage can outlast the feedback session.", id_desc: "Dalam banyak budaya Asia dan Timur Tengah, kritik publik — betapapun lembutnya — dapat menyebabkan kehilangan muka yang signifikan. Umpan balik yang dianggap 'langsung dan membantu' dalam konteks Belanda mungkin dianggap sangat memalukan dalam konteks Indonesia atau Cina.", nl_desc: "In veel Aziatische en Midden-Oosterse culturen kan publieke kritiek — hoe zacht ook — significant gezichtsverlies veroorzaken. Feedback die in een Nederlandse context als 'direct en behulpzaam' landt, kan in een Indonesische of Chinese context als diep beschamend overkomen." },
  { number: "2", en_title: "Directness norms vary widely", id_title: "Norma keterusterangan sangat bervariasi", nl_title: "Directheidsnormen variëren sterk", en_desc: "In low-context, direct cultures (Germany, Netherlands, Israel), straightforward feedback is a sign of respect. In high-context, indirect cultures (Japan, Thailand, many African contexts), feedback is embedded in story, metaphor, or private conversation — rarely given bluntly.", id_desc: "Dalam budaya langsung, konteks rendah (Jerman, Belanda, Israel), umpan balik langsung adalah tanda hormat. Dalam budaya tidak langsung, konteks tinggi (Jepang, Thailand, banyak konteks Afrika), umpan balik tertanam dalam cerita, metafora, atau percakapan pribadi.", nl_desc: "In directe, lage-contextculturen (Duitsland, Nederland, Israël) is rechtstreekse feedback een teken van respect. In indirecte, hoge-contextculturen (Japan, Thailand, veel Afrikaanse contexten) wordt feedback ingebed in verhaal, metafoor of privégesprek." },
  { number: "3", en_title: "Hierarchy shapes who can say what", id_title: "Hierarki membentuk siapa yang bisa mengatakan apa", nl_title: "Hiërarchie bepaalt wie wat kan zeggen", en_desc: "In high power-distance cultures, feedback flows primarily downward. Giving feedback upward — or receiving feedback from someone junior — carries different weight and risk. Leaders need to design feedback systems that account for this rather than ignoring it.", id_desc: "Dalam budaya jarak kekuasaan tinggi, umpan balik mengalir terutama ke bawah. Memberikan umpan balik ke atas — atau menerima umpan balik dari seseorang yang lebih junior — membawa bobot dan risiko yang berbeda.", nl_desc: "In hoge machtafstandsculturen stroomt feedback primair neerwaarts. Feedback geven naar boven — of ontvangen van iemand die junior is — heeft een andere betekenis en risico." },
];

const principles = [
  { number: "1", en: "Always give corrective feedback privately — public praise, private correction. This protects face and relationships in virtually every culture.", id: "Selalu berikan umpan balik korektif secara pribadi — pujian publik, koreksi pribadi. Ini melindungi muka dan hubungan di hampir setiap budaya.", nl: "Geef altijd corrigerende feedback privé — publiek lof, privé correctie. Dit beschermt gezicht en relaties in vrijwel elke cultuur." },
  { number: "2", en: "Lead with curiosity before conclusion — ask what was happening from their perspective before naming your observation.", id: "Pimpin dengan rasa ingin tahu sebelum kesimpulan — tanyakan apa yang terjadi dari perspektif mereka sebelum menyebutkan pengamatan Anda.", nl: "Leid met nieuwsgierigheid voor conclusie — vraag wat er vanuit hun perspectief speelde voor je je observatie benoemt." },
  { number: "3", en: "Separate the person from the behaviour — 'That approach missed the mark' lands very differently from 'You got that wrong.'", id: "Pisahkan orang dari perilaku — 'Pendekatan itu meleset' terdengar sangat berbeda dari 'Kamu salah.'", nl: "Scheid de persoon van het gedrag — 'Die aanpak miste het doel' landt heel anders dan 'Jij deed het fout.'" },
  { number: "4", en: "Be specific, not sweeping — feedback grounded in one concrete situation is easier to act on and less likely to feel like an attack.", id: "Jadilah spesifik, bukan luas — umpan balik yang didasarkan pada satu situasi konkret lebih mudah ditindaklanjuti dan lebih kecil kemungkinannya terasa seperti serangan.", nl: "Wees specifiek, niet breed — feedback gebaseerd op één concrete situatie is gemakkelijker op te handelen en voelt minder snel als een aanval." },
  { number: "5", en: "Ask for permission and create forward motion — 'Can I share an observation? What would help you most going forward?'", id: "Minta izin dan ciptakan gerak maju — 'Bolehkah saya berbagi pengamatan? Apa yang paling membantu Anda ke depan?'", nl: "Vraag toestemming en creëer voorwaartse beweging — 'Mag ik een observatie delen? Wat zou je het meest helpen in de toekomst?'" },
];

const commonMistakes = [
  { en: "Giving feedback in front of others — even subtly, this causes shame.", id: "Memberikan umpan balik di depan orang lain — bahkan secara halus, ini menyebabkan rasa malu.", nl: "Feedback geven in het bijzijn van anderen — zelfs subtiel veroorzaakt dit schaamte." },
  { en: "Using humour or sarcasm — it almost always lands badly cross-culturally.", id: "Menggunakan humor atau sarkasme — ini hampir selalu berdampak buruk secara lintas budaya.", nl: "Humor of sarcasme gebruiken — dit landt bijna altijd slecht intercultureel." },
  { en: "Assuming 'I understand' means they accept the feedback — agreement may be cultural courtesy.", id: "Mengasumsikan 'Saya mengerti' berarti mereka menerima umpan balik — persetujuan mungkin merupakan kesopanan budaya.", nl: "Aannemen dat 'Ik begrijp het' betekent dat ze de feedback accepteren — instemming kan culturele beleefdheid zijn." },
  { en: "Waiting too long — feedback loses its developmental value when it comes months after the event.", id: "Menunggu terlalu lama — umpan balik kehilangan nilai pengembangannya ketika datang berbulan-bulan setelah peristiwa.", nl: "Te lang wachten — feedback verliest zijn ontwikkelingswaarde wanneer het maanden na het evenement komt." },
];

const reflectionQuestions = [
  { roman: "I", en: "What is your natural feedback style — direct or indirect? Where did you learn it?", id: "Apa gaya umpan balik alami Anda — langsung atau tidak langsung? Di mana Anda mempelajarinya?", nl: "Wat is jouw natuurlijke feedbackstijl — direct of indirect? Waar heb je het geleerd?" },
  { roman: "II", en: "Think of a time your feedback damaged rather than helped. What did you miss about the cultural context?", id: "Pikirkan saat umpan balik Anda merusak daripada membantu. Apa yang Anda lewatkan tentang konteks budaya?", nl: "Denk aan een moment waarop je feedback schaadde in plaats van hielp. Wat heb je gemist over de culturele context?" },
  { roman: "III", en: "How does the biblical call to 'speak truth in love' guide your approach to corrective feedback?", id: "Bagaimana panggilan alkitabiah untuk 'berkata benar dengan kasih' memandu pendekatan Anda terhadap umpan balik korektif?", nl: "Hoe begeleidt de bijbelse roeping tot 'waarheid spreken in liefde' je benadering van corrigerende feedback?" },
  { roman: "IV", en: "Do the people on your team feel genuinely safe to receive feedback from you? How do you know?", id: "Apakah orang-orang dalam tim Anda merasa benar-benar aman untuk menerima umpan balik dari Anda? Bagaimana Anda tahu?", nl: "Voelen de mensen in je team zich echt veilig om feedback van jou te ontvangen? Hoe weet je dat?" },
  { roman: "V", en: "What feedback have you been holding back from someone on your team? What is stopping you?", id: "Umpan balik apa yang telah Anda tahan dari seseorang dalam tim Anda? Apa yang menghalangi Anda?", nl: "Welke feedback heb je ingehouden van iemand in je team? Wat houdt je tegen?" },
  { roman: "VI", en: "How do you receive feedback yourself? What does your reaction model for your team?", id: "Bagaimana Anda menerima umpan balik sendiri? Apa yang reaksi Anda contohkan untuk tim Anda?", nl: "Hoe ontvang je zelf feedback? Wat modelleert jouw reactie voor je team?" },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function GivingFeedbackClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("giving-feedback-across-cultures");
      setSaved(true);
    });
  }

  const navy = "oklch(22% 0.10 260)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const orange = "oklch(65% 0.15 45)";
  const bodyText = "oklch(38% 0.05 260)";

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>
      <div style={{ background: lightGray, borderBottom: "1px solid oklch(90% 0.01 80)", padding: "10px 24px", display: "flex", gap: 8, justifyContent: "flex-end" }}>
        {(["en", "id", "nl"] as Lang[]).map((l) => (
          <button key={l} onClick={() => setLang(l)} style={{ padding: "4px 14px", borderRadius: 4, border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, background: lang === l ? navy : "transparent", color: lang === l ? offWhite : bodyText }}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ background: navy, padding: "80px 24px 72px", textAlign: "center" }}>
        <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
          {t("Team Development", "Pengembangan Tim", "Teamontwikkeling")}
        </p>
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: offWhite, margin: "0 auto 20px", maxWidth: 760, lineHeight: 1.15 }}>
          {t("Giving Feedback Across Cultures", "Memberikan Umpan Balik Lintas Budaya", "Feedback Geven Across Culturen")}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(85% 0.03 80)", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.6, fontStyle: "italic" }}>
          {t(
            '"Feedback is not what you say — it is what the other person hears, in their cultural grammar."',
            '"Umpan balik bukan apa yang Anda katakan — itu adalah apa yang orang lain dengar, dalam tata bahasa budaya mereka."',
            '"Feedback is niet wat je zegt — het is wat de ander hoort, in hun culturele grammatica."'
          )}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={handleSave} disabled={saved || isPending} style={{ padding: "12px 28px", borderRadius: 6, border: "none", cursor: saved ? "default" : "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, background: saved ? "oklch(55% 0.08 260)" : orange, color: offWhite }}>
            {saved ? t("Saved", "Tersimpan", "Opgeslagen") : t("Save to Dashboard", "Simpan ke Dasbor", "Opslaan in Dashboard")}
          </button>
          <Link href="/resources" style={{ padding: "12px 28px", borderRadius: 6, border: "1px solid oklch(50% 0.05 260)", fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 600, color: offWhite, textDecoration: "none" }}>
            {t("All Resources", "Semua Sumber", "Alle Bronnen")}
          </Link>
        </div>
      </div>

      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, marginBottom: 20 }}>
          {t(
            "Giving feedback is one of the most essential — and most frequently mishandled — acts of leadership. In monocultural settings, it is already difficult. In cross-cultural contexts, the stakes are higher because the same words can land in completely different ways depending on cultural programming around face, directness, and hierarchy.",
            "Memberikan umpan balik adalah salah satu tindakan kepemimpinan yang paling penting — dan paling sering ditangani dengan buruk. Dalam konteks monokultural, itu sudah sulit. Dalam konteks lintas budaya, taruhannya lebih tinggi karena kata-kata yang sama dapat berdampak dengan cara yang sangat berbeda.",
            "Feedback geven is een van de meest essentiële — en meest verkeerd aangepakte — daden van leiderschap. In monoculturele settings is het al moeilijk. In interculturele contexten staan er meer op het spel omdat dezelfde woorden volkomen anders kunnen landen."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75 }}>
          {t(
            "Understanding why feedback lands differently is not about lowering standards or avoiding hard conversations — it is about delivering truth with cultural intelligence so it is actually heard and acted upon.",
            "Memahami mengapa umpan balik berdampak berbeda bukan tentang menurunkan standar atau menghindari percakapan sulit — itu tentang menyampaikan kebenaran dengan kecerdasan budaya sehingga benar-benar didengar dan ditindaklanjuti.",
            "Begrijpen waarom feedback anders landt, gaat niet over het verlagen van normen of het vermijden van moeilijke gesprekken — het gaat over het leveren van waarheid met culturele intelligentie zodat het werkelijk gehoord en benut wordt."
          )}
        </p>
      </div>

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 48, textAlign: "center" }}>
            {t("Why Feedback Lands Differently", "Mengapa Umpan Balik Berdampak Berbeda", "Waarom Feedback Anders Landt")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {whyDifferent.map((item) => (
              <div key={item.number} style={{ background: offWhite, borderRadius: 12, padding: "32px 36px", display: "flex", gap: 28, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 52, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 40, flexShrink: 0 }}>{item.number}</div>
                <div>
                  <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 18, fontWeight: 700, color: navy, marginBottom: 10 }}>
                    {lang === "en" ? item.en_title : lang === "id" ? item.id_title : item.nl_title}
                  </h3>
                  <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                    {lang === "en" ? item.en_desc : lang === "id" ? item.id_desc : item.nl_desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
          {t("5 Principles for Cross-Cultural Feedback", "5 Prinsip Umpan Balik Lintas Budaya", "5 Principes voor Interculturele Feedback")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {principles.map((p) => (
            <div key={p.number} style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
              <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 44, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 36, flexShrink: 0 }}>{p.number}</div>
              <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, margin: 0, paddingTop: 6 }}>
                {lang === "en" ? p.en : lang === "id" ? p.id : p.nl}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 24, fontWeight: 800, color: navy, marginBottom: 24, textAlign: "center" }}>
            {t("Common Mistakes", "Kesalahan Umum", "Veelgemaakte Fouten")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {commonMistakes.map((m, i) => (
              <div key={i} style={{ background: offWhite, borderRadius: 8, padding: "16px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ color: orange, fontSize: 18, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✗</div>
                <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.7, margin: 0 }}>
                  {lang === "en" ? m.en : lang === "id" ? m.id : m.nl}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
          {t("Reflection Questions", "Pertanyaan Refleksi", "Reflectievragen")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {reflectionQuestions.map((q) => (
            <div key={q.roman} style={{ background: lightGray, borderRadius: 10, padding: "24px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 22, fontWeight: 700, color: orange, minWidth: 28, flexShrink: 0 }}>{q.roman}</div>
              <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                {lang === "en" ? q.en : lang === "id" ? q.id : q.nl}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: navy, padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: offWhite, marginBottom: 16 }}>
          {t("Keep Growing", "Terus Bertumbuh", "Blijf Groeien")}
        </h2>
        <p style={{ color: "oklch(80% 0.03 80)", fontSize: 16, lineHeight: 1.75, maxWidth: 540, margin: "0 auto 32px" }}>
          {t("Explore more resources to deepen your cross-cultural leadership.", "Jelajahi lebih banyak sumber untuk memperdalam kepemimpinan lintas budaya Anda.", "Verken meer bronnen om je intercultureel leiderschap te verdiepen.")}
        </p>
        <Link href="/resources" style={{ display: "inline-block", padding: "14px 32px", background: orange, color: offWhite, borderRadius: 6, fontFamily: "Montserrat, sans-serif", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
          {t("Browse All Resources", "Jelajahi Semua Sumber", "Bekijk Alle Bronnen")}
        </Link>
      </div>
    </div>
  );
}
