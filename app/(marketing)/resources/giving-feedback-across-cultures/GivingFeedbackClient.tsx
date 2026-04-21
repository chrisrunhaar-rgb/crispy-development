"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const CONTRASTS = [
  {
    aspect: { en: "Communication Style", id: "Gaya Komunikasi", nl: "Communicatiestijl" },
    western: { en: "Direct, explicit — what you say is what you mean", id: "Langsung, eksplisit — apa yang Anda katakan adalah apa yang Anda maksud", nl: "Direct, expliciet — wat je zegt is wat je bedoelt" },
    sea: { en: "Indirect, contextual — meaning is carried in tone, silence, and relationship", id: "Tidak langsung, kontekstual — makna dibawa dalam nada, keheningan, dan hubungan", nl: "Indirect, contextueel — betekenis zit in toon, stilte en relatie" },
  },
  {
    aspect: { en: "Feedback Timing", id: "Waktu Umpan Balik", nl: "Feedbacktiming" },
    western: { en: "In the moment — address it when it happens, promptly and specifically", id: "Saat itu juga — tangani saat terjadi, segera dan spesifik", nl: "Op het moment — adresseer het wanneer het gebeurt, snel en specifiek" },
    sea: { en: "After relationship is established — feedback only lands safely once trust is built", id: "Setelah hubungan terjalin — umpan balik hanya mendarat dengan aman setelah kepercayaan terbangun", nl: "Nadat de relatie is opgebouwd — feedback werkt pas veilig na vertrouwen" },
  },
  {
    aspect: { en: "Public vs. Private", id: "Publik vs. Pribadi", nl: "Publiek vs. Privé" },
    western: { en: "Group feedback is normal — transparency builds accountability", id: "Umpan balik kelompok adalah normal — transparansi membangun akuntabilitas", nl: "Groepsfeedback is normaal — transparantie bouwt verantwoording op" },
    sea: { en: "Always private — public correction causes profound face loss and damages loyalty", id: "Selalu pribadi — koreksi publik menyebabkan kehilangan muka yang mendalam dan merusak loyalitas", nl: "Altijd privé — publieke correctie veroorzaakt diep gezichtsverlies en beschadigt loyaliteit" },
  },
  {
    aspect: { en: "Positive Feedback", id: "Umpan Balik Positif", nl: "Positieve Feedback" },
    western: { en: "Individual recognition is motivating — single out top performers", id: "Pengakuan individual memotivasi — pisahkan pemain terbaik", nl: "Individuele erkenning motiveert — markeer toppresteerders" },
    sea: { en: "Collective recognition first — singling one person out can create awkward imbalance", id: "Pengakuan kolektif terlebih dahulu — memilih satu orang dapat menciptakan ketidakseimbangan yang canggung", nl: "Collectieve erkenning eerst — één persoon uitlichten kan een ongemakkelijke onbalans creëren" },
  },
  {
    aspect: { en: "Response to Correction", id: "Respons terhadap Koreksi", nl: "Reactie op Correctie" },
    western: { en: "Expects direct acknowledgment — 'I understand, here's what I'll change'", id: "Mengharapkan pengakuan langsung — 'Saya mengerti, inilah yang akan saya ubah'", nl: "Verwacht directe erkenning — 'Ik begrijp het, dit zal ik veranderen'" },
    sea: { en: "May stay silent or say 'yes' to preserve harmony — silence ≠ agreement", id: "Mungkin diam atau mengatakan 'ya' untuk menjaga harmoni — keheningan ≠ persetujuan", nl: "Kan stil blijven of 'ja' zeggen om harmonie te bewaren — stilte ≠ instemming" },
  },
];

const SBI = [
  {
    letter: "S",
    en_title: "Situation",
    id_title: "Situasi",
    nl_title: "Situatie",
    en_desc: "Anchor the feedback in a specific, observable time and place. 'In our team meeting on Tuesday' — not 'you always do this' or vague generalisations.",
    id_desc: "Jangkarkan umpan balik dalam waktu dan tempat yang spesifik dan dapat diamati. 'Dalam rapat tim hari Selasa' — bukan 'kamu selalu melakukan ini' atau generalisasi yang samar.",
    nl_desc: "Verankер de feedback in een specifieke, waarneembare tijd en plaats. 'In onze teamvergadering op dinsdag' — niet 'je doet dit altijd' of vage generalisaties.",
  },
  {
    letter: "B",
    en_title: "Behaviour",
    id_title: "Perilaku",
    nl_title: "Gedrag",
    en_desc: "Describe the observable action without judgment or interpretation. 'You interrupted three times when others were speaking' — not 'you were disrespectful.'",
    id_desc: "Gambarkan tindakan yang dapat diamati tanpa penilaian atau interpretasi. 'Anda menyela tiga kali ketika orang lain berbicara' — bukan 'Anda tidak sopan.'",
    nl_desc: "Beschrijf de waarneembare actie zonder oordeel of interpretatie. 'Je onderbrak drie keer wanneer anderen spraken' — niet 'je was respectloos.'",
  },
  {
    letter: "I",
    en_title: "Impact",
    id_title: "Dampak",
    nl_title: "Impact",
    en_desc: "Explain how that behaviour affected the team, the mission, or the relationship. 'Two team members stopped contributing for the rest of the meeting.'",
    id_desc: "Jelaskan bagaimana perilaku tersebut mempengaruhi tim, misi, atau hubungan. 'Dua anggota tim berhenti berkontribusi untuk sisa rapat.'",
    nl_desc: "Leg uit hoe dat gedrag het team, de missie of de relatie beïnvloedde. 'Twee teamleden stopten met bijdragen voor de rest van de vergadering.'",
  },
];

const SCENARIOS = [
  {
    title: { en: "The Public Correction", id: "Koreksi Publik", nl: "De Publieke Correctie" },
    setup: {
      en: "A Dutch leader notices a team member consistently arriving late to team meetings. In the next meeting, he addresses it directly in front of the group: 'I've noticed your pattern of arriving late — this disrupts the team and it needs to stop.'",
      id: "Seorang pemimpin Belanda memperhatikan anggota tim secara konsisten terlambat ke rapat tim. Di rapat berikutnya, ia mengatasinya secara langsung di depan kelompok.",
      nl: "Een Nederlandse leider merkt op dat een teamlid consequent te laat komt. In de volgende vergadering adresseert hij het direct voor de groep.",
    },
    breakdown: {
      en: "The Indonesian team member is devastated by the public humiliation. The feedback itself may be accurate, but the public delivery has caused a profound loss of face. He becomes withdrawn, his performance deteriorates, and two other team members privately decide the leader is untrustworthy.",
      id: "Anggota tim Indonesia hancur oleh penghinaan publik. Umpan balik itu sendiri mungkin akurat, tetapi pengiriman publik telah menyebabkan kehilangan muka yang mendalam.",
      nl: "Het Indonesische teamlid is verpletterd door de publieke vernedering. De feedback zelf kan juist zijn, maar de publieke levering heeft een diep gezichtsverlies veroorzaakt.",
    },
    response: {
      en: "Always deliver corrective feedback privately in high-context cultures. Frame it around the mission ('I need your voice and presence to make this team effective') rather than fault ('you're failing'). Save face — don't take it.",
      id: "Selalu berikan umpan balik korektif secara pribadi dalam budaya konteks tinggi. Bingkai seputar misi ('Saya membutuhkan suara dan kehadiran Anda untuk membuat tim ini efektif') daripada kesalahan.",
      nl: "Lever altijd corrigerende feedback privé in hoge-context culturen. Kader het rond de missie ('Ik heb jouw stem en aanwezigheid nodig') in plaats van de fout.",
    },
  },
  {
    title: { en: "The Misread Silence", id: "Keheningan yang Disalahartikan", nl: "De Verkeerd Gelezen Stilte" },
    setup: {
      en: "A Malaysian supervisor has been communicating her dissatisfaction with a Western team member's work quality through indirect signals — shorter responses, fewer follow-ups, a cooler tone. She assumes he understands. He notices nothing unusual.",
      id: "Seorang supervisor Malaysia telah mengkomunikasikan ketidakpuasannya dengan kualitas kerja anggota tim Barat melalui sinyal tidak langsung — respons yang lebih singkat, tindak lanjut yang lebih sedikit, nada yang lebih dingin.",
      nl: "Een Maleisische supervisor heeft haar ontevredenheid gecommuniceerd via indirecte signalen — kortere reacties, minder follow-ups, een koelere toon. Ze gaat ervan uit dat hij het begrijpt.",
    },
    breakdown: {
      en: "The Western team member is completely unaware there's a problem. He reads normal professional distance into what is actually a significant corrective signal. When the formal review comes, he feels blindsided and ambushed.",
      id: "Anggota tim Barat sama sekali tidak menyadari ada masalah. Ia membaca jarak profesional normal ke dalam apa yang sebenarnya merupakan sinyal korektif yang signifikan.",
      nl: "Het Westerse teamlid is zich er totaal niet van bewust dat er een probleem is. Hij leest normale professionele afstand in wat eigenlijk een significant correctief signaal is.",
    },
    response: {
      en: "In cross-cultural feedback, never rely solely on indirect signals when the recipient is from a low-context culture. At some point, bridge to explicit: 'I want to share something directly, because I care about your growth.' Both parties need to learn each other's feedback language.",
      id: "Dalam umpan balik lintas budaya, jangan pernah mengandalkan sinyal tidak langsung saja ketika penerimanya dari budaya konteks rendah. Pada suatu titik, jembatani ke yang eksplisit.",
      nl: "Vertrouw in interculturele feedback nooit uitsluitend op indirecte signalen wanneer de ontvanger uit een lage-context cultuur komt. Op een gegeven moment, overbruggen naar expliciet.",
    },
  },
  {
    title: { en: "Praise That Backfires", id: "Pujian yang Berbalik", nl: "Lof dat Averechts Werkt" },
    setup: {
      en: "A Western leader wants to motivate his team and publicly singles out one Filipino team member in the weekly meeting: 'I want everyone to know how exceptional Maria's work has been this week. She is exactly the standard we should all be aiming for.'",
      id: "Seorang pemimpin Barat ingin memotivasi timnya dan secara publik memilih satu anggota tim Filipina dalam rapat mingguan.",
      nl: "Een Westerse leider wil zijn team motiveren en wijst publiekelijk één Filipijns teamlid aan in de wekelijkse vergadering.",
    },
    breakdown: {
      en: "Maria feels acutely uncomfortable. Her peers feel implicitly criticised. The team's harmony is disrupted rather than enhanced. The leader doesn't understand why the meeting feels flat afterwards.",
      id: "Maria merasa sangat tidak nyaman. Rekan-rekannya merasa dikritik secara implisit. Harmoni tim terganggu daripada ditingkatkan.",
      nl: "Maria voelt zich acuut ongemakkelijk. Haar collega's voelen zich impliciet gekritiseerd. De teamharmonie is verstoord in plaats van versterkt.",
    },
    response: {
      en: "In collectivist cultures, lead praise with 'the team' before individuals: 'This team has produced something exceptional this week.' Then privately affirm individuals: 'I wanted you to know personally how much your contribution meant.'",
      id: "Dalam budaya kolektivis, pimpin pujian dengan 'tim' sebelum individu: 'Tim ini telah menghasilkan sesuatu yang luar biasa minggu ini.' Kemudian tegaskan secara pribadi individu.",
      nl: "Leid in collectivistische culturen lof met 'het team' voor individuen. Bevestig dan privé individuen: 'Ik wilde je persoonlijk laten weten hoeveel jouw bijdrage betekende.'",
    },
  },
];

const STRATEGIES = [
  {
    en: "Always deliver corrective feedback privately in high-context cultures. Public correction causes face loss that damages the relationship and often the team.",
    id: "Selalu berikan umpan balik korektif secara pribadi dalam budaya konteks tinggi. Koreksi publik menyebabkan kehilangan muka yang merusak hubungan dan sering tim.",
    nl: "Lever altijd corrigerende feedback privé in hoge-context culturen. Publieke correctie veroorzaakt gezichtsverlies dat de relatie en vaak het team beschadigt.",
  },
  {
    en: "Build relational capital before corrective feedback. In Southeast Asian cultures, feedback only lands safely once genuine trust exists.",
    id: "Bangun modal relasional sebelum umpan balik korektif. Dalam budaya Asia Tenggara, umpan balik hanya mendarat dengan aman setelah kepercayaan sejati ada.",
    nl: "Bouw relationeel kapitaal op voor corrigerende feedback. In Zuidoost-Aziatische culturen werkt feedback pas veilig wanneer er echte vertrouwen bestaat.",
  },
  {
    en: "Use the SBI model (Situation-Behaviour-Impact) to keep feedback specific and objective — reducing room for face-threatening interpretation.",
    id: "Gunakan model SBI (Situasi-Perilaku-Dampak) untuk menjaga umpan balik tetap spesifik dan objektif — mengurangi ruang untuk interpretasi yang mengancam muka.",
    nl: "Gebruik het SBI-model (Situatie-Gedrag-Impact) om feedback specifiek en objectief te houden — minder ruimte voor gezichtsbedreigende interpretatie.",
  },
  {
    en: "When giving feedback cross-culturally, frame it around mission and shared goals rather than personal failing: 'For our team to achieve X, I need you to…'",
    id: "Saat memberikan umpan balik lintas budaya, bingkailah seputar misi dan tujuan bersama daripada kegagalan pribadi: 'Agar tim kita mencapai X, saya butuh Anda untuk…'",
    nl: "Kader bij het geven van interculturele feedback het rond missie en gedeelde doelen, niet persoonlijk falen: 'Om als team X te bereiken, heb ik van jou nodig...'",
  },
  {
    en: "Learn to read indirect feedback signals — a shorter reply, a cooler tone, an avoided question — and create a safe channel to make implicit feedback explicit.",
    id: "Belajar membaca sinyal umpan balik tidak langsung — balasan yang lebih singkat, nada yang lebih dingin, pertanyaan yang dihindari — dan ciptakan saluran yang aman untuk membuat umpan balik implisit menjadi eksplisit.",
    nl: "Leer indirecte feedbacksignalen te lezen — een kortere reactie, een koelere toon, een vermeden vraag — en creëer een veilig kanaal om impliciete feedback expliciet te maken.",
  },
];

const REFLECTION = [
  {
    roman: "I",
    en: "In your current cultural context, what is the expected way to give corrective feedback — and are you honouring or overriding that expectation?",
    id: "Dalam konteks budaya Anda saat ini, apa cara yang diharapkan untuk memberikan umpan balik korektif — dan apakah Anda menghormati atau mengabaikan harapan itu?",
    nl: "In jouw huidige culturele context, wat is de verwachte manier om corrigerende feedback te geven — en respecteer je die verwachting of sla je haar over?",
  },
  {
    roman: "II",
    en: "Think of feedback you've given that landed badly. In retrospect, was the content wrong — or the delivery?",
    id: "Pikirkan umpan balik yang Anda berikan yang tidak mendarat dengan baik. Melihat ke belakang, apakah kontennya salah — atau penyampaiannya?",
    nl: "Denk aan feedback die je hebt gegeven die slecht landde. Achteraf gezien, was de inhoud fout — of de levering?",
  },
  {
    roman: "III",
    en: "How do you know when you've been given indirect feedback? What signals do you miss — and what might you be missing right now?",
    id: "Bagaimana Anda tahu ketika Anda telah diberikan umpan balik tidak langsung? Sinyal apa yang Anda lewatkan — dan apa yang mungkin Anda lewatkan sekarang?",
    nl: "Hoe weet je wanneer je indirecte feedback hebt gekregen? Welke signalen mis je — en wat mis je mogelijk op dit moment?",
  },
  {
    roman: "IV",
    en: "Proverbs 27:6 says 'faithful are the wounds of a friend.' Who in your life is willing to wound you faithfully — and are you willing to receive it?",
    id: "Amsal 27:6 berkata 'Lebih dapat dipercaya luka yang disebabkan oleh seorang sahabat.' Siapa dalam hidup Anda yang mau melukai Anda dengan setia — dan apakah Anda mau menerimanya?",
    nl: "Spreuken 27:6 zegt 'Betrouwbaar zijn de wonden van een vriend.' Wie in je leven is bereid je trouw te kwetsen — en ben jij bereid het te ontvangen?",
  },
  {
    roman: "V",
    en: "Ephesians 4:15 says 'speaking the truth in love.' In your last difficult feedback conversation, how well did you balance truth with love?",
    id: "Efesus 4:15 berkata 'dengan penuh kasih'. Dalam percakapan umpan balik sulit terakhir Anda, seberapa baik Anda menyeimbangkan kebenaran dengan kasih?",
    nl: "Efeziërs 4:15 zegt 'de waarheid doen in liefde.' In je laatste moeilijke feedbackgesprek, hoe goed heb je waarheid met liefde in balans gebracht?",
  },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function GivingFeedbackClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [openScenario, setOpenScenario] = useState<number | null>(null);
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
          <button key={l} onClick={() => setLang(l)} style={{ padding: "4px 14px", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, background: lang === l ? navy : "transparent", color: lang === l ? offWhite : bodyText }}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ background: navy, padding: "80px 24px 72px", textAlign: "center" }}>
        <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
          {t("Cross-Cultural Practice", "Praktik Lintas Budaya", "Interculturele Praktijk")}
        </p>
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: offWhite, margin: "0 auto 20px", maxWidth: 760, lineHeight: 1.15 }}>
          {t("Giving Feedback Across Cultures", "Memberikan Umpan Balik Lintas Budaya", "Feedback Geven over Culturen Heen")}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(85% 0.03 80)", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.6, fontStyle: "italic" }}>
          {t(
            '"Faithful are the wounds of a friend; profuse are the kisses of an enemy." — Proverbs 27:6',
            '"Lebih dapat dipercaya luka yang disebabkan oleh seorang sahabat daripada ciuman yang berlebihan dari seorang musuh." — Amsal 27:6',
            '"Betrouwbaar zijn de wonden van een vriend; maar de kussen van een vijand zijn veeltallig." — Spreuken 27:6'
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
            "Feedback is perhaps the most culture-sensitive leadership practice. What feels like honest, respectful feedback in Rotterdam can feel like a personal attack in Jakarta. What reads as caring, indirect guidance in Kuala Lumpur reads as evasion in Amsterdam. The mechanics of feedback don't change — truth, specificity, care. But the form must adapt radically to the cultural context.",
            "Umpan balik mungkin adalah praktik kepemimpinan yang paling sensitif budaya. Apa yang terasa seperti umpan balik yang jujur dan hormat di Rotterdam dapat terasa seperti serangan pribadi di Jakarta.",
            "Feedback is misschien wel de meest cultuur-gevoelige leiderschapspraktijk. Wat als eerlijke, respectvolle feedback aanvoelt in Rotterdam, kan als een persoonlijke aanval aanvoelen in Jakarta."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75 }}>
          {t(
            "This module gives you the frameworks, the scenarios, and the specific techniques to give feedback that actually works — feedback that is received, processed, and acted on, not just delivered.",
            "Modul ini memberi Anda kerangka, skenario, dan teknik spesifik untuk memberikan umpan balik yang benar-benar berhasil — umpan balik yang diterima, diproses, dan ditindaklanjuti, bukan sekadar disampaikan.",
            "Deze module geeft je de raamwerken, scenario's en specifieke technieken om feedback te geven die echt werkt — feedback die ontvangen, verwerkt en opgevolgd wordt, niet alleen geleverd."
          )}
        </p>
      </div>

      {/* Comparison table */}
      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 48, textAlign: "center" }}>
            {t("Western vs. Southeast Asian Feedback Norms", "Norma Umpan Balik Barat vs. Asia Tenggara", "Westerse vs. Zuidoost-Aziatische Feedbacknormen")}
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr>
                  <th style={{ background: navy, color: offWhite, padding: "14px 20px", textAlign: "left", fontFamily: "Montserrat, sans-serif", fontWeight: 700, width: "22%" }}>{t("Aspect", "Aspek", "Aspect")}</th>
                  <th style={{ background: navy, color: offWhite, padding: "14px 20px", textAlign: "left", fontFamily: "Montserrat, sans-serif", fontWeight: 700, width: "39%" }}>{t("Western / Dutch", "Barat / Belanda", "Westers / Nederlands")}</th>
                  <th style={{ background: navy, color: offWhite, padding: "14px 20px", textAlign: "left", fontFamily: "Montserrat, sans-serif", fontWeight: 700, width: "39%" }}>{t("Southeast Asian", "Asia Tenggara", "Zuidoost-Aziatisch")}</th>
                </tr>
              </thead>
              <tbody>
                {CONTRASTS.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? offWhite : lightGray }}>
                    <td style={{ padding: "16px 20px", color: navy, fontWeight: 700, verticalAlign: "top" }}>{row.aspect[lang]}</td>
                    <td style={{ padding: "16px 20px", color: bodyText, lineHeight: 1.65, verticalAlign: "top" }}>{row.western[lang]}</td>
                    <td style={{ padding: "16px 20px", color: bodyText, lineHeight: 1.65, verticalAlign: "top" }}>{row.sea[lang]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SBI model */}
      <div style={{ padding: "72px 24px", maxWidth: 800, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 12, textAlign: "center" }}>
          {t("The SBI Model", "Model SBI", "Het SBI-model")}
        </h2>
        <p style={{ textAlign: "center", color: bodyText, fontSize: 15, marginBottom: 40 }}>
          {t("Situation — Behaviour — Impact: keeping feedback specific and objective across cultures", "Situasi — Perilaku — Dampak: menjaga umpan balik spesifik dan objektif lintas budaya", "Situatie — Gedrag — Impact: feedback specifiek en objectief houden over culturen heen")}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {SBI.map((item) => (
            <div key={item.letter} style={{ background: lightGray, padding: "28px 24px" }}>
              <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 72, fontWeight: 700, color: orange, lineHeight: 0.9, marginBottom: 16 }}>{item.letter}</div>
              <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 16, fontWeight: 700, color: navy, marginBottom: 12 }}>
                {lang === "en" ? item.en_title : lang === "id" ? item.id_title : item.nl_title}
              </h3>
              <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                {lang === "en" ? item.en_desc : lang === "id" ? item.id_desc : item.nl_desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scenarios */}
      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 12, textAlign: "center" }}>
            {t("When Feedback Goes Wrong", "Ketika Umpan Balik Salah", "Wanneer Feedback Fout Gaat")}
          </h2>
          <p style={{ textAlign: "center", color: bodyText, fontSize: 15, marginBottom: 40 }}>
            {t("Three cross-cultural feedback failures — and the better approach", "Tiga kegagalan umpan balik lintas budaya — dan pendekatan yang lebih baik", "Drie interculturele feedbackmislukkingen — en de betere benadering")}
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
                      <p style={{ fontSize: 13, fontWeight: 700, color: "oklch(40% 0.12 160)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{t("The Better Approach", "Pendekatan yang Lebih Baik", "De Betere Benadering")}</p>
                      <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>{s.response[lang]}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Biblical anchor */}
      <div style={{ background: navy, padding: "72px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
            {t("Faith Anchor", "Jangkar Iman", "Geloofsanker")}
          </p>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: offWhite, marginBottom: 48 }}>
            {t("Truth and Love in Scripture", "Kebenaran dan Kasih dalam Kitab Suci", "Waarheid en Liefde in de Schrift")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {[
              {
                ref: "Proverbs 27:6",
                verse: {
                  en: '"Faithful are the wounds of a friend; profuse are the kisses of an enemy."',
                  id: '"Lebih dapat dipercaya luka yang disebabkan oleh seorang sahabat daripada ciuman yang berlebihan dari seorang musuh."',
                  nl: '"Betrouwbaar zijn de wonden van een vriend; maar de kussen van een vijand zijn veeltallig."',
                },
                comment: {
                  en: "Corrective feedback is an act of love, not aggression. The person who tells you the truth when it is difficult is the faithful friend — not the one who flatters you to avoid discomfort. This is the theological grounding for honest, cross-cultural feedback.",
                  id: "Umpan balik korektif adalah tindakan kasih, bukan agresi. Orang yang memberi tahu Anda kebenaran ketika itu sulit adalah teman setia — bukan yang memuji Anda untuk menghindari ketidaknyamanan.",
                  nl: "Corrigerende feedback is een daad van liefde, niet agressie. De persoon die je de waarheid vertelt wanneer het moeilijk is, is de trouwe vriend — niet degene die je vleit om ongemak te vermijden.",
                },
              },
              {
                ref: "Ephesians 4:15",
                verse: {
                  en: '"Instead, speaking the truth in love, we will grow to become in every respect the mature body of him who is the head."',
                  id: '"Tetapi dengan berbicara kebenaran di dalam kasih kita bertumbuh di dalam segala hal ke arah Dia, Kristus, yang adalah Kepala."',
                  nl: '"Maar dan, de waarheid doende in liefde, zullen wij in alle opzichten toenemen naar Hem toe, die het hoofd is, Christus."',
                },
                comment: {
                  en: "The perfect cross-cultural feedback principle. Truth alone, without love, is the Western failure mode — technically accurate but relationally destructive. Love alone, without truth, is the high-context failure mode — relationally safe but developmentally hollow. Truth in love navigates both.",
                  id: "Prinsip umpan balik lintas budaya yang sempurna. Kebenaran saja, tanpa kasih, adalah mode kegagalan Barat — akurat secara teknis tetapi merusak secara relasional. Kasih saja, tanpa kebenaran, adalah mode kegagalan konteks tinggi.",
                  nl: "Het perfecte interculturele feedbackprincipe. Waarheid alleen, zonder liefde, is de Westerse faalmode — technisch accuraat maar relationeel destructief. Liefde alleen, zonder waarheid, is de hoge-context faalmode. Waarheid in liefde navigeert beide.",
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

      {/* Strategies */}
      <div style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 48, textAlign: "center" }}>
            {t("5 Strategies", "5 Strategi", "5 Strategieën")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {STRATEGIES.map((s, i) => (
              <div key={i} style={{ background: lightGray, padding: "24px 28px", display: "flex", gap: 24, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 44, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 36, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</div>
                <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0, paddingTop: 6 }}>{lang === "en" ? s.en : lang === "id" ? s.id : s.nl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reflection */}
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
