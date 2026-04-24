"use client";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import Image from "next/image";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

// ─── Communication Dimensions (accordion) ────────────────────────────────────
const dimensions = [
  {
    number: "01",
    en_title: "High-Context vs. Low-Context",
    id_title: "Konteks Tinggi vs. Konteks Rendah",
    nl_title: "Hoge-Context vs. Lage-Context",
    en_tagline: "Some cultures say it. Others imply it.",
    id_tagline: "Beberapa budaya mengatakannya. Yang lain menyiratkannya.",
    nl_tagline: "Sommige culturen zeggen het. Anderen impliceren het.",
    en_body: "High-context cultures (Indonesia, Japan, most of Southeast Asia, the Arab world) communicate meaning through relationship, tone, timing, and what is NOT said. The message lives between the words. Low-context cultures (Netherlands, Germany, USA, Australia) trust explicit, direct verbal communication — the message is in the words themselves.\n\nNeither is more honest. They are different languages of meaning. When a low-context communicator hears 'We'll think about it,' they take it at face value. When a high-context communicator says 'We'll think about it,' they often mean no — and they expect you to understand that.",
    id_body: "Budaya konteks tinggi (Indonesia, Jepang, sebagian besar Asia Tenggara, dunia Arab) menyampaikan makna melalui hubungan, nada, waktu, dan apa yang TIDAK dikatakan. Pesan hidup di antara kata-kata. Budaya konteks rendah (Belanda, Jerman, AS, Australia) mengandalkan komunikasi verbal yang eksplisit dan langsung.\n\nKetika komunikator konteks rendah mendengar 'Kami akan pikirkan,' mereka mengambilnya secara harfiah. Ketika komunikator konteks tinggi mengatakan 'Kami akan pikirkan,' mereka sering berarti tidak — dan mereka mengharapkan Anda untuk memahami itu.",
    nl_body: "Hoge-contextculturen (Indonesië, Japan, het grootste deel van Zuidoost-Azië, de Arabische wereld) communiceren betekenis via relatie, toon, timing en wat NIET gezegd wordt. De boodschap leeft tussen de woorden. Lage-contextculturen (Nederland, Duitsland, VS, Australië) vertrouwen op expliciete, directe verbale communicatie.\n\nAls een lage-context communicator 'We denken erover na' hoort, neemt hij dat letterlijk. Als een hoge-context communicator 'We denken erover na' zegt, bedoelen ze vaak nee — en ze verwachten dat je dat begrijpt.",
    en_practice: "In high-context conversations, listen for what is NOT said. Notice hesitations, indirect questions, and changes of subject — these often carry the real message. In low-context settings, be explicit: say what you mean, confirm what you heard, and don't assume implication.",
    id_practice: "Dalam percakapan konteks tinggi, dengarkan apa yang TIDAK dikatakan. Perhatikan keraguan, pertanyaan tidak langsung, dan perubahan topik — ini sering membawa pesan nyata. Dalam pengaturan konteks rendah, jadilah eksplisit: katakan apa yang Anda maksud, konfirmasikan apa yang Anda dengar.",
    nl_practice: "In hoge-context gesprekken: luister naar wat NIET gezegd wordt. Let op aarzelingen, indirecte vragen en onderwerpwisselingen — die bevatten vaak de echte boodschap. In lage-context omgevingen: wees expliciet, zeg wat je bedoelt, bevestig wat je hoorde.",
  },
  {
    number: "02",
    en_title: "Direct vs. Indirect Communication",
    id_title: "Komunikasi Langsung vs. Tidak Langsung",
    nl_title: "Directe vs. Indirecte Communicatie",
    en_tagline: "Direct is not always honest. Indirect is not always evasive.",
    id_tagline: "Langsung tidak selalu jujur. Tidak langsung tidak selalu menghindar.",
    nl_tagline: "Direct is niet altijd eerlijk. Indirect is niet altijd ontwijkend.",
    en_body: "Direct communicators say what they mean — clearly, efficiently, without much softening. It feels honest and respectful to them. Indirect communicators convey difficult truths through story, metaphor, questions, or a trusted go-between. It feels caring and respectful to them.\n\nThe problem: direct communicators read indirectness as dishonesty or weakness. Indirect communicators read directness as aggression or disrespect. Both are wrong. They are not different ethics — they are different grammars for delivering the same truth.",
    id_body: "Komunikator langsung mengatakan apa yang mereka maksud — dengan jelas, efisien, tanpa banyak pelunakan. Itu terasa jujur dan penuh hormat bagi mereka. Komunikator tidak langsung menyampaikan kebenaran sulit melalui cerita, metafora, pertanyaan, atau perantara yang dipercaya.\n\nMasalahnya: komunikator langsung membaca ketidaklangsungan sebagai ketidakjujuran. Komunikator tidak langsung membaca ketegasan sebagai agresi. Keduanya salah — itu bukan etika yang berbeda, melainkan tata bahasa yang berbeda untuk menyampaikan kebenaran yang sama.",
    nl_body: "Directe communicatoren zeggen wat ze bedoelen — duidelijk, efficiënt, zonder veel verzachting. Dat voelt voor hen eerlijk en respectvol. Indirecte communicatoren brengen moeilijke waarheden over via verhaal, metafoor, vragen of een vertrouwde tussenpersoon.\n\nHet probleem: directe communicatoren lezen indirectheid als oneerlijkheid. Indirecte communicatoren lezen directheid als agressie. Beiden hebben het mis — het zijn geen verschillende ethieken maar verschillende grammatica's voor dezelfde waarheid.",
    en_practice: "If you are a direct communicator working with indirect communicators: soften the delivery, use private settings for hard feedback, and create space for the indirect response to surface (it may come hours or days later). If you are indirect, practise naming hard things clearly with people who expect directness — it is a skill, not a betrayal of your culture.",
    id_practice: "Jika Anda komunikator langsung yang bekerja dengan komunikator tidak langsung: lembutkan penyampaian, gunakan pengaturan pribadi untuk umpan balik keras, dan ciptakan ruang untuk respons tidak langsung muncul (mungkin datang berjam-jam atau berhari-hari kemudian). Jika Anda tidak langsung, berlatihlah menyebutkan hal-hal sulit dengan jelas dengan orang yang mengharapkan ketegasan.",
    nl_practice: "Als je een directe communicator bent die samenwerkt met indirecte communicatoren: verzacht de boodschap, gebruik privéomgevingen voor harde feedback, en maak ruimte voor de indirecte reactie (die kan uren of dagen later komen). Als je indirect bent, oefen dan moeilijke dingen duidelijk te benoemen met mensen die directheid verwachten.",
  },
  {
    number: "03",
    en_title: "Formal vs. Informal",
    id_title: "Formal vs. Informal",
    nl_title: "Formeel vs. Informeel",
    en_tagline: "Titles, greetings, and seating — the rituals that build or break trust.",
    id_tagline: "Gelar, salam, dan tempat duduk — ritual yang membangun atau menghancurkan kepercayaan.",
    nl_tagline: "Titels, begroetingen en zitplaatsen — de rituelen die vertrouwen opbouwen of afbreken.",
    en_body: "In many Asian and African cultures, formality is not bureaucracy — it is how respect is expressed. Getting someone's title right, greeting the senior person first, and following meeting protocols communicates that you take the relationship seriously.\n\nIn Dutch, Scandinavian, and Australian cultures, formality can feel like distance. First names signal trust. Casual is warm. But using someone's first name before they have offered it — or skipping formal greetings — can read as presumptuousness in cultures where those rituals matter.",
    id_body: "Dalam banyak budaya Asia dan Afrika, formalitas bukan birokrasi — itu adalah cara rasa hormat diekspresikan. Mendapatkan gelar seseorang dengan benar, menyapa orang senior pertama, dan mengikuti protokol rapat mengomunikasikan bahwa Anda menganggap hubungan itu serius.\n\nDalam budaya Belanda, Skandinavia, dan Australia, formalitas bisa terasa seperti jarak. Nama depan menandakan kepercayaan. Dalam budaya di mana ritual itu penting, menggunakan nama depan seseorang sebelum mereka menawarkannya bisa dibaca sebagai kesombongan.",
    nl_body: "In veel Aziatische en Afrikaanse culturen is formaliteit geen bureaucratie — het is hoe respect wordt uitgedrukt. Iemands titel goed gebruiken, de senior persoon eerst begroeten, en vergaderprotocollen volgen communiceert dat je de relatie serieus neemt.\n\nIn Nederlandse, Scandinavische en Australische culturen kan formaliteit aanvoelen als afstand. Voornamen signaleren vertrouwen. Maar iemands voornaam gebruiken voordat ze die hebben aangeboden, kan in culturen waar die rituelen belangrijk zijn als aanmatigend worden ervaren.",
    en_practice: "When entering a new cultural context, follow their formality level before assuming your own. Observe how people greet each other. Ask a trusted local: 'What would be respectful here?' It takes one hour to learn and saves months of confusion.",
    id_practice: "Saat memasuki konteks budaya baru, ikuti tingkat formalitas mereka sebelum mengasumsikan milik Anda sendiri. Amati bagaimana orang saling menyapa. Tanya orang lokal yang dipercaya: 'Apa yang akan sopan di sini?' Butuh satu jam untuk belajar dan menghemat berbulan-bulan kebingungan.",
    nl_practice: "Wanneer je een nieuwe culturele context betreedt, volg dan hun formaliteitsniveau voordat je het jouwe aanneemt. Observeer hoe mensen elkaar begroeten. Vraag een vertrouwde lokale persoon: 'Wat zou hier respectvol zijn?' Het kost één uur om te leren en bespaart maanden verwarring.",
  },
  {
    number: "04",
    en_title: "Expressive vs. Reserved",
    id_title: "Ekspresif vs. Tertahan",
    nl_title: "Expressief vs. Gereserveerd",
    en_tagline: "What reads as passion in one culture reads as instability in another.",
    id_tagline: "Apa yang dibaca sebagai semangat dalam satu budaya dibaca sebagai ketidakstabilan dalam budaya lain.",
    nl_tagline: "Wat als passie wordt gelezen in de ene cultuur wordt als instabiliteit gelezen in de andere.",
    en_body: "Expressive cultures (Latin America, the Middle East, much of Africa, and parts of Indonesia) openly show emotion in professional contexts — warmth, frustration, enthusiasm, grief. It signals authenticity and engagement. Reserved cultures (Nordic countries, East Asia, Northern Europe) value emotional control in professional settings — calm signals competence and trustworthiness.\n\nThe danger: a reserved leader in an expressive culture reads as cold, uninterested, or arrogant. An expressive leader in a reserved culture reads as unprofessional, unstable, or untrustworthy. Neither is accurate — but both are real perceptions with real consequences.",
    id_body: "Budaya ekspresif (Amerika Latin, Timur Tengah, banyak Afrika, dan sebagian Indonesia) secara terbuka menunjukkan emosi dalam konteks profesional — kehangatan, frustrasi, antusiasme. Itu menandakan keaslian dan keterlibatan. Budaya tertahan (negara-negara Nordik, Asia Timur, Eropa Utara) menghargai kendali emosional dalam pengaturan profesional.\n\nBahayanya: pemimpin yang tertahan dalam budaya ekspresif dibaca sebagai dingin atau arogan. Pemimpin ekspresif dalam budaya tertahan dibaca sebagai tidak profesional atau tidak dapat dipercaya.",
    nl_body: "Expressieve culturen (Latijns-Amerika, het Midden-Oosten, een groot deel van Afrika) tonen openlijk emotie in professionele contexten — warmte, frustratie, enthousiasme. Dat signaleert authenticiteit. Gereserveerde culturen (Scandinavische landen, Oost-Azië, Noord-Europa) waarderen emotionele controle in professionele omgevingen.\n\nHet gevaar: een gereserveerde leider in een expressieve cultuur wordt gelezen als koud of arrogant. Een expressieve leider in een gereserveerde cultuur wordt gelezen als onprofessioneel of onbetrouwbaar.",
    en_practice: "Expand your range in both directions. If you are reserved: practise visible warmth — a genuine smile, a personal question at the start of a meeting — it signals you are present, not just performing. If you are expressive: practise measured composure in reserved settings — it is not repression, it is adaptation.",
    id_practice: "Perluas jangkauan Anda di kedua arah. Jika Anda tertahan: berlatihlah kehangatan yang terlihat — senyum tulus, pertanyaan pribadi di awal rapat. Jika Anda ekspresif: berlatihlah ketenangan terukur dalam pengaturan tertahan — itu bukan represi, itu adaptasi.",
    nl_practice: "Vergroot je bereik in beide richtingen. Als je gereserveerd bent: oefen zichtbare warmte — een echte glimlach, een persoonlijke vraag aan het begin van een vergadering. Als je expressief bent: oefen gemeten kalmte in gereserveerde omgevingen — het is geen onderdrukking, het is aanpassing.",
  },
];

// ─── Development Levels ───────────────────────────────────────────────────────
const developmentLevels = [
  {
    level: "01",
    en_label: "Beginner",
    id_label: "Pemula",
    nl_label: "Beginner",
    en_subtitle: "Map yourself before you map others",
    id_subtitle: "Petakan diri Anda sebelum memetakan orang lain",
    nl_subtitle: "Breng jezelf eerst in kaart",
    color: "#4A90D9",
    actions: [
      {
        en: "Answer these four questions about yourself, honestly: (1) Are you direct or indirect when delivering hard news? (2) Do you prefer explicit or implied communication? (3) How quickly do you use someone's first name? (4) How much emotion do you show at work? Your answers reveal your communication default — and where your assumptions live.",
        id: "Jawab empat pertanyaan ini tentang diri Anda dengan jujur: (1) Apakah Anda langsung atau tidak langsung saat menyampaikan berita buruk? (2) Apakah Anda lebih suka komunikasi eksplisit atau tersirat? (3) Seberapa cepat Anda menggunakan nama depan seseorang? (4) Berapa banyak emosi yang Anda tunjukkan di tempat kerja?",
        nl: "Beantwoord deze vier vragen over jezelf eerlijk: (1) Ben je direct of indirect bij het brengen van slecht nieuws? (2) Geef je de voorkeur aan expliciete of impliciete communicatie? (3) Hoe snel gebruik je iemands voornaam? (4) Hoeveel emotie toon je op het werk? Je antwoorden onthullen je communicatiestandaard.",
      },
      {
        en: "Pick one conversation this week where you were not sure if you were understood — or where you were not sure you understood the other person. Write down: what was said, what you assumed it meant, and what it might have actually meant. One honest reflection compounds over time into real skill.",
        id: "Pilih satu percakapan minggu ini di mana Anda tidak yakin apakah Anda dipahami — atau di mana Anda tidak yakin Anda memahami orang lain. Tulis: apa yang dikatakan, apa yang Anda asumsikan artinya, dan apa yang mungkin sebenarnya dimaksud.",
        nl: "Kies één gesprek deze week waarbij je niet zeker wist of je begrepen werd — of waarbij je de ander niet zeker begreep. Schrijf op: wat gezegd werd, wat je aannam dat het betekende, en wat het eigenlijk kon hebben betekend.",
      },
    ],
  },
  {
    level: "02",
    en_label: "Practitioner",
    id_label: "Praktisi",
    nl_label: "Practitioner",
    en_subtitle: "Build habits that work across styles",
    id_subtitle: "Bangun kebiasaan yang bekerja di berbagai gaya",
    nl_subtitle: "Bouw gewoonten die over stijlen heen werken",
    color: "#E07540",
    actions: [
      {
        en: "End every team meeting with one question: 'Is there anything you wanted to say that we didn't get to?' This is a communication lifeline for indirect communicators who needed the group pressure to lift before they could speak. Do it consistently — the first few times nothing may surface, but the habit trains your team to trust that space.",
        id: "Akhiri setiap rapat tim dengan satu pertanyaan: 'Apakah ada sesuatu yang ingin Anda katakan yang tidak sempat kita bahas?' Ini adalah jalur komunikasi bagi komunikator tidak langsung yang membutuhkan tekanan kelompok untuk terangkat sebelum mereka dapat berbicara.",
        nl: "Sluit elke teamvergadering af met één vraag: 'Is er iets wat je wilde zeggen maar niet aan bod is gekomen?' Dit is een communicatieredlijn voor indirecte communicatoren. Doe het consequent — de eerste paar keer komt er misschien niets naar boven, maar de gewoonte traint je team om die ruimte te vertrouwen.",
      },
      {
        en: "Practise 'looping back.' When you think you have received an indirect message, say it back: 'It sounds like you might be saying that... is that right?' This validates their communication style while making sure you actually understood. It builds trust with high-context communicators who often feel their signals go unnoticed.",
        id: "Berlatihlah 'kembali melingkar.' Saat Anda pikir Anda telah menerima pesan tidak langsung, katakan kembali: 'Sepertinya Anda mungkin ingin mengatakan bahwa... apakah itu benar?' Ini memvalidasi gaya komunikasi mereka sambil memastikan Anda benar-benar memahami.",
        nl: "Oefen 'terugkoppelen.' Als je denkt dat je een indirecte boodschap hebt ontvangen, zeg het terug: 'Het klinkt alsof je misschien wilt zeggen dat... klopt dat?' Dit valideert hun communicatiestijl terwijl je ervoor zorgt dat je het echt begrepen hebt.",
      },
    ],
  },
  {
    level: "03",
    en_label: "Advanced",
    id_label: "Lanjutan",
    nl_label: "Gevorderd",
    en_subtitle: "Build communication culture into your team",
    id_subtitle: "Bangun budaya komunikasi ke dalam tim Anda",
    nl_subtitle: "Bouw communicatiecultuur in je team",
    color: "#1B3A6B",
    actions: [
      {
        en: "Write a team communication agreement together. Not a policy — a conversation: 'In this team, here is how we will handle hard feedback. Here is how we will disagree. Here is what silence means in our meetings.' Name both direct and indirect approaches as valid. Make the invisible visible. Teams that name their communication norms can hold each other to them — and repair faster when they break down.",
        id: "Tulis perjanjian komunikasi tim bersama. Bukan kebijakan — sebuah percakapan: 'Dalam tim ini, begini cara kami menangani umpan balik yang sulit. Begini cara kami tidak setuju. Begini arti keheningan dalam rapat kami.' Sebutkan pendekatan langsung dan tidak langsung sebagai valid.",
        nl: "Schrijf samen een teamcommunicatieovereenkomst. Niet een beleid — een gesprek: 'In dit team, zo gaan we om met harde feedback. Zo zijn we het oneens. Dit betekent stilte in onze vergaderingen.' Noem zowel directe als indirecte benaderingen als geldig.",
      },
      {
        en: "Create multiple communication channels — not just group meetings. Some people speak best in one-on-ones. Some communicate better in writing. Some need time to process before responding. A team that only uses one channel is structurally excluding communicators who work differently. Vary the modes deliberately: announce in meetings, discuss in pairs, decide in writing.",
        id: "Ciptakan berbagai saluran komunikasi — bukan hanya rapat kelompok. Beberapa orang berbicara paling baik dalam satu-satu. Beberapa berkomunikasi lebih baik secara tertulis. Beberapa membutuhkan waktu untuk memproses sebelum merespons. Tim yang hanya menggunakan satu saluran secara struktural mengecualikan komunikator yang bekerja secara berbeda.",
        nl: "Creëer meerdere communicatiekanalen — niet alleen groepsvergaderingen. Sommige mensen spreken het best in één-op-één. Sommigen communiceren beter schriftelijk. Sommigen hebben tijd nodig om te verwerken. Een team dat maar één kanaal gebruikt, sluit structureel communicatoren uit die anders werken.",
      },
    ],
  },
];

// ─── Reflection Questions ─────────────────────────────────────────────────────
const reflectionQuestions = [
  {
    roman: "I",
    en: "Are you a high-context or low-context communicator? What has that cost you in cross-cultural relationships?",
    id: "Apakah Anda komunikator konteks tinggi atau rendah? Apa yang telah itu biayai Anda dalam hubungan lintas budaya?",
    nl: "Ben jij een hoge-context of lage-context communicator? Wat heeft dat je gekost in interculturele relaties?",
  },
  {
    roman: "II",
    en: "Think of a cross-cultural miscommunication that made sense only in hindsight. What dimension was at play?",
    id: "Pikirkan miskomunikasi lintas budaya yang hanya masuk akal dalam retrospeksi. Dimensi apa yang berperan?",
    nl: "Denk aan een interculturele miscommunicatie die pas achteraf logisch was. Welke dimensie speelde een rol?",
  },
  {
    roman: "III",
    en: "What does silence mean in your culture? What does it mean in your team's culture? When have those meanings clashed?",
    id: "Apa arti keheningan dalam budaya Anda? Apa artinya dalam budaya tim Anda? Kapan makna-makna itu bertabrakan?",
    nl: "Wat betekent stilte in jouw cultuur? Wat betekent het in de cultuur van je team? Wanneer zijn die betekenissen gebotst?",
  },
  {
    roman: "IV",
    en: "Paul says 'speak truth in love' (Eph 4:15). What does that look like when the other person's culture receives truth very differently than yours?",
    id: "Paulus berkata 'berkata benar dengan kasih' (Ef 4:15). Seperti apa itu ketika budaya orang lain menerima kebenaran sangat berbeda dari budaya Anda?",
    nl: "Paulus zegt 'waarheid spreken in liefde' (Ef 4:15). Hoe ziet dat eruit wanneer de cultuur van de ander waarheid heel anders ontvangt dan de jouwe?",
  },
  {
    roman: "V",
    en: "What communication change could you make this month that would most help one specific person on your team feel genuinely heard?",
    id: "Perubahan komunikasi apa yang bisa Anda lakukan bulan ini yang paling membantu satu orang tertentu di tim Anda merasa benar-benar didengar?",
    nl: "Welke communicatieverandering kun je deze maand maken die één specifieke persoon in je team het meest zou helpen zich echt gehoord te voelen?",
  },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function InterculturalCommunicationClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [openDim, setOpenDim] = useState<number | null>(null);
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("intercultural-communication");
      setSaved(true);
    });
  }

  const navy = "oklch(22% 0.10 260)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const orange = "oklch(65% 0.15 45)";
  const bodyText = "oklch(38% 0.05 260)";

  return (
    <div style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>
      <LangToggle />

      {/* ─── LANG SWITCHER ──────────────────────────────────────────────────── */}

      {/* ─── HERO ───────────────────────────────────────────────────────────── */}
      <div style={{ background: navy, padding: "80px 24px 72px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: orange }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 70% 50%, oklch(30% 0.12 260) 0%, transparent 60%)", opacity: 0.5 }} />
        <div style={{ position: "relative", maxWidth: 780, margin: "0 auto" }}>
          <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>
            {t("Cross-Cultural · Guide", "Lintas Budaya · Panduan", "Cross-Cultureel · Gids")}
          </p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, color: offWhite, margin: "0 0 24px", lineHeight: 1.08 }}>
            {t("Intercultural Communication", "Komunikasi Antarbudaya", "Interculturele Communicatie")}
          </h1>
          <p style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: "clamp(16px, 2vw, 19px)", color: "oklch(85% 0.03 80)", maxWidth: 580, margin: "0 0 16px", lineHeight: 1.65 }}>
            {t(
              '"The biggest problem in communication is the illusion that it has taken place."',
              '"Masalah terbesar dalam komunikasi adalah ilusi bahwa komunikasi telah terjadi."',
              '"Het grootste probleem in communicatie is de illusie dat het heeft plaatsgevonden."'
            )}
          </p>
          <p style={{ color: "oklch(65% 0.05 260)", fontSize: 13, marginBottom: 36, fontStyle: "italic" }}>— George Bernard Shaw</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={handleSave} disabled={saved || isPending} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: saved ? "oklch(35% 0.08 260)" : "transparent", color: "oklch(75% 0.04 260)", padding: "14px 28px", borderRadius: 6, fontWeight: 600, fontSize: 14, border: "1px solid oklch(42% 0.08 260)", cursor: saved ? "default" : "pointer" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
              {saved ? t("✓ Saved to Dashboard", "✓ Tersimpan di Dashboard", "✓ Opgeslagen in Dashboard") : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
            </button>
          </div>
        </div>
      </div>

      {/* ─── SECTION 1: OPENING STORY ───────────────────────────────────────── */}
      <div style={{ padding: "80px 24px 0", maxWidth: 780, margin: "0 auto" }}>
        <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 24 }}>
          {t("A Story", "Sebuah Kisah", "Een Verhaal")}
        </p>
        <div style={{ borderLeft: `4px solid ${orange}`, paddingLeft: 28, marginBottom: 40 }}>
          <p style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: "clamp(20px, 2.8vw, 26px)", color: navy, lineHeight: 1.55, marginBottom: 20, fontStyle: "italic" }}>
            {t(
              "Anna was a German development worker in Manila. She was known for her clarity. When she had feedback, she gave it — directly, in writing, with specific points. It felt professional to her. Respectful, even.",
              "Anna adalah pekerja pembangunan Jerman di Manila. Dia dikenal karena kejelasannya. Ketika dia memiliki umpan balik, dia memberikannya — langsung, secara tertulis, dengan poin-poin spesifik. Itu terasa profesional baginya. Bahkan penuh hormat.",
              "Anna was een Duitse ontwikkelingswerker in Manila. Ze stond bekend om haar duidelijkheid. Als ze feedback had, gaf ze die — direct, schriftelijk, met specifieke punten. Dat voelde professioneel voor haar. Zelfs respectvol."
            )}
          </p>
          <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.8, marginBottom: 16 }}>
            {t(
              "One day she sent a detailed written critique of a report to her Filipino team member, Ramon. Bullet points. What was missing. What needed to change. She expected a response. She got silence.",
              "Suatu hari dia mengirimkan kritik tertulis terperinci atas sebuah laporan kepada anggota tim Filipinanya, Ramon. Poin-poin. Apa yang kurang. Apa yang perlu diubah. Dia mengharapkan respons. Dia mendapat keheningan.",
              "Op een dag stuurde ze een gedetailleerde schriftelijke kritiek op een rapport naar haar Filipijns teamlid, Ramon. Bulletpoints. Wat ontbrak. Wat moest veranderen. Ze verwachtte een reactie. Ze kreeg stilte."
            )}
          </p>
          <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.8, marginBottom: 16 }}>
            {t(
              "Ramon became quiet in team meetings. He stopped volunteering ideas. Three weeks later, Anna learned through a colleague that Ramon had been asking around whether she was building a case to have him let go.",
              "Ramon menjadi pendiam dalam rapat tim. Dia berhenti menawarkan ide. Tiga minggu kemudian, Anna mengetahui melalui seorang rekan bahwa Ramon telah bertanya-tanya apakah Anna sedang membangun kasus untuk memecatnya.",
              "Ramon werd stil in teamvergaderingen. Hij stopte met het aandragen van ideeën. Drie weken later hoorde Anna via een collega dat Ramon had rondgevraagd of zij een zaak aan het opbouwen was om hem te ontslaan."
            )}
          </p>
          <p style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: "clamp(19px, 2.5vw, 23px)", color: navy, lineHeight: 1.6, fontStyle: "italic" }}>
            {t(
              "Anna had not been trying to shame him. She had been trying to help him. But in Ramon's culture, written direct critique from a superior — especially on work he had put his name to — was not feedback. It was a formal record of failure.",
              "Anna tidak mencoba mempermalukannya. Dia mencoba membantunya. Tapi dalam budaya Ramon, kritik langsung tertulis dari atasan — terutama pada pekerjaan yang telah dia beri namanya — bukan umpan balik. Itu adalah catatan formal kegagalan.",
              "Anna probeerde hem niet te beschamen. Ze probeerde hem te helpen. Maar in Ramons cultuur was schriftelijke directe kritiek van een meerdere — zeker op werk waar hij zijn naam aan had gegeven — geen feedback. Het was een formeel record van falen."
            )}
          </p>
        </div>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.8, marginBottom: 16 }}>
          {t(
            "Communication is never just the transfer of information. It is a cultural act — shaped by history, value systems, and how a culture defines dignity. What feels clear and honest in one context can feel threatening and humiliating in another.",
            "Komunikasi bukan sekadar transfer informasi. Ini adalah tindakan budaya — dibentuk oleh sejarah, sistem nilai, dan bagaimana suatu budaya mendefinisikan martabat. Apa yang terasa jelas dan jujur dalam satu konteks bisa terasa mengancam dan merendahkan di konteks lain.",
            "Communicatie is nooit alleen de overdracht van informatie. Het is een culturele daad — gevormd door geschiedenis, waardensystemen en hoe een cultuur waardigheid definieert. Wat in één context duidelijk en eerlijk aanvoelt, kan in een andere dreigend en vernederend aanvoelen."
          )}
        </p>
        <p style={{ fontSize: 17, fontWeight: 700, color: navy, lineHeight: 1.7 }}>
          {t(
            "Anna was not wrong to give feedback. She was wrong about how to give it. That is an intercultural communication problem — and it is one of the most common on cross-cultural teams.",
            "Anna tidak salah memberikan umpan balik. Dia salah tentang cara memberikannya. Itulah masalah komunikasi antarbudaya — dan ini adalah salah satu yang paling umum dalam tim lintas budaya.",
            "Anna had het niet mis om feedback te geven. Ze had het mis over hoe dat te doen. Dat is een intercultureel communicatieprobleem — en het is een van de meest voorkomende in interculturele teams."
          )}
        </p>
      </div>

      {/* ─── IMAGE 1 ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 900, margin: "48px auto 0", padding: "0 24px" }}>
        <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 40px oklch(20% 0.08 260 / 0.15)" }}>
          <Image src="/resources/intercultural-communication-1.jpg" alt="Two people in cross-cultural conversation" width={1312} height={736} style={{ width: "100%", height: "auto", display: "block" }} priority />
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: "oklch(60% 0.04 260)", marginTop: 10, fontStyle: "italic" }}>
          {t(
            "Communication is not just what is said — it is what the other person receives.",
            "Komunikasi bukan hanya apa yang dikatakan — melainkan apa yang diterima orang lain.",
            "Communicatie is niet alleen wat gezegd wordt — het is wat de ander ontvangt."
          )}
        </p>
      </div>

      {/* ─── SECTION 2: THE FOUR DIMENSIONS — ACCORDION ────────────────────── */}
      <div style={{ background: lightGray, padding: "80px 24px", marginTop: 48 }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
            {t("The Framework", "Kerangka Kerja", "Het Kader")}
          </p>
          <h2 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: navy, marginBottom: 12, lineHeight: 1.2 }}>
            {t("4 Communication Dimensions", "4 Dimensi Komunikasi", "4 Communicatiedimensies")}
          </h2>
          <p style={{ color: bodyText, fontSize: 16, lineHeight: 1.75, marginBottom: 48 }}>
            {t(
              "Every cross-cultural communication breakdown can usually be traced to one of these four dimensions. Click each to go deeper.",
              "Setiap kerusakan komunikasi lintas budaya biasanya dapat ditelusuri ke salah satu dari empat dimensi ini. Klik masing-masing untuk lebih dalam.",
              "Elke interculturele communicatiebreuk is meestal terug te voeren op een van deze vier dimensies. Klik op elk voor meer diepgang."
            )}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {dimensions.map((d, i) => {
              const isOpen = openDim === i;
              return (
                <div key={d.number} style={{ background: offWhite, borderRadius: 10, overflow: "hidden", boxShadow: isOpen ? "0 4px 24px oklch(20% 0.08 260 / 0.12)" : "none", transition: "box-shadow 0.2s ease" }}>
                  <button
                    onClick={() => setOpenDim(isOpen ? null : i)}
                    style={{ width: "100%", background: "none", border: "none", padding: "24px 28px", display: "flex", alignItems: "center", gap: 20, cursor: "pointer", textAlign: "left" }}
                  >
                    <span style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: 36, fontWeight: 700, color: isOpen ? orange : "oklch(75% 0.04 260)", lineHeight: 1, minWidth: 44, flexShrink: 0, transition: "color 0.15s ease" }}>{d.number}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 17, fontWeight: 700, color: navy, margin: "0 0 4px" }}>
                        {lang === "en" ? d.en_title : lang === "id" ? d.id_title : d.nl_title}
                      </p>
                      <p style={{ fontSize: 13, color: bodyText, margin: 0, fontStyle: "italic" }}>
                        {lang === "en" ? d.en_tagline : lang === "id" ? d.id_tagline : d.nl_tagline}
                      </p>
                    </div>
                    <span style={{ color: isOpen ? orange : "oklch(65% 0.04 260)", fontSize: 22, fontWeight: 300, transform: isOpen ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s ease, color 0.15s ease", flexShrink: 0 }}>+</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: "0 28px 28px", borderTop: "1px solid oklch(92% 0.01 80)" }}>
                      <div style={{ paddingTop: 24, display: "flex", flexDirection: "column", gap: 20 }}>
                        {(lang === "en" ? d.en_body : lang === "id" ? d.id_body : d.nl_body).split("\n\n").map((para, pi) => (
                          <p key={pi} style={{ fontSize: 15, color: bodyText, lineHeight: 1.85, margin: 0 }}>{para}</p>
                        ))}
                        <div style={{ borderLeft: `3px solid ${orange}`, paddingLeft: 20 }}>
                          <p style={{ fontSize: 12, fontWeight: 700, color: orange, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                            {t("What to do", "Apa yang harus dilakukan", "Wat te doen")}
                          </p>
                          <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.8, margin: 0 }}>
                            {lang === "en" ? d.en_practice : lang === "id" ? d.id_practice : d.nl_practice}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── SECTION 3: FAITH ANCHOR ────────────────────────────────────────── */}
      <div style={{ padding: "80px 24px", maxWidth: 780, margin: "0 auto" }}>
        <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
          {t("Faith Anchor", "Jangkar Iman", "Geloofsanker")}
        </p>
        <h2 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: navy, marginBottom: 32, lineHeight: 1.2 }}>
          {t("Truth Spoken in Love", "Kebenaran yang Diucapkan dengan Kasih", "Waarheid Gesproken in Liefde")}
        </h2>

        <div style={{ background: navy, borderRadius: 12, padding: "40px 44px", marginBottom: 40, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, left: -20, width: 120, height: 120, borderRadius: "50%", background: "oklch(30% 0.12 260)", opacity: 0.4 }} />
          <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20, position: "relative" }}>
            {t("Scripture", "Kitab Suci", "Schriftuur")}
          </p>
          <blockquote style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: "clamp(20px, 3vw, 28px)", color: offWhite, lineHeight: 1.65, fontStyle: "italic", margin: "0 0 20px", position: "relative" }}>
            {t(
              '"Instead, speaking the truth in love, we will grow to become in every respect the mature body of him who is the head, that is, Christ."',
              '"Tetapi dengan teguh berpegang kepada kebenaran di dalam kasih kita bertumbuh di dalam segala hal ke arah Dia, Kristus, yang adalah Kepala."',
              '"Maar door de waarheid te spreken in liefde zullen we in alles groeien naar hem die het hoofd is, Christus."'
            )}
          </blockquote>
          <p style={{ color: orange, fontSize: 14, fontWeight: 600, margin: 0, position: "relative" }}>
            {t("Ephesians 4:15 (NIV)", "Efesus 4:15", "Efeziërs 4:15")}
          </p>
        </div>

        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 20 }}>
          {t(
            "Paul's phrase 'speaking the truth in love' is often read as a balance between honesty and kindness. But in cross-cultural communication, it asks a deeper question: what does it mean to speak truth in a way that can actually be received by the person you are speaking to?",
            "Frasa Paulus 'berkata benar dengan kasih' sering dibaca sebagai keseimbangan antara kejujuran dan kebaikan. Tetapi dalam komunikasi lintas budaya, ini mengajukan pertanyaan yang lebih dalam: apa artinya berkata benar dengan cara yang benar-benar dapat diterima oleh orang yang Anda ajak bicara?",
            "Paulus' zinsnede 'waarheid spreken in liefde' wordt vaak gelezen als een balans tussen eerlijkheid en vriendelijkheid. Maar in interculturele communicatie stelt het een diepere vraag: wat betekent het om waarheid te spreken op een manier die daadwerkelijk kan worden ontvangen door de persoon tot wie je spreekt?"
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 20 }}>
          {t(
            "Watch how Jesus communicates with the Samaritan woman at the well (John 4). He does not open with theology. He asks for water. He starts on her terms, in her space, respecting her dignity before moving toward truth. He does not abandon truth — but he earns the right to speak it by the way he listens first.",
            "Perhatikan bagaimana Yesus berkomunikasi dengan perempuan Samaria di sumur (Yohanes 4). Dia tidak membuka dengan teologi. Dia meminta air. Dia mulai dengan syaratnya, di ruangnya, menghormati martabatnya sebelum bergerak menuju kebenaran. Dia tidak meninggalkan kebenaran — tetapi dia mendapatkan hak untuk mengatakannya dengan cara dia mendengarkan terlebih dahulu.",
            "Let op hoe Jezus communiceert met de Samaritaanse vrouw bij de put (Johannes 4). Hij opent niet met theologie. Hij vraagt om water. Hij begint op haar voorwaarden, in haar ruimte, haar waardigheid respecterend voordat hij richting de waarheid beweegt. Hij verlaat de waarheid niet — maar hij verdient het recht om haar te spreken door de manier waarop hij eerst luistert."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85 }}>
          {t(
            "Truth spoken in love is not just honest — it is received. And what it takes to be received varies by culture. This is not compromise. This is communication that actually works.",
            "Kebenaran yang diucapkan dengan kasih bukan sekadar jujur — melainkan diterima. Dan apa yang diperlukan untuk diterima bervariasi menurut budaya. Ini bukan kompromi. Ini adalah komunikasi yang benar-benar berhasil.",
            "Waarheid gesproken in liefde is niet alleen eerlijk — ze wordt ontvangen. En wat nodig is om ontvangen te worden, verschilt per cultuur. Dit is geen compromis. Dit is communicatie die echt werkt."
          )}
        </p>
      </div>

      {/* ─── IMAGE 2 ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 64px" }}>
        <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 40px oklch(20% 0.08 260 / 0.15)" }}>
          <Image src="/resources/intercultural-communication-2.jpg" alt="Diverse team in genuine cross-cultural dialogue" width={1312} height={736} style={{ width: "100%", height: "auto", display: "block" }} />
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: "oklch(60% 0.04 260)", marginTop: 10, fontStyle: "italic" }}>
          {t(
            "Real understanding crosses more than language — it crosses cultural assumptions about what communication even is.",
            "Pemahaman nyata melampaui lebih dari sekadar bahasa — melintasi asumsi budaya tentang apa komunikasi itu.",
            "Echt begrip overschrijdt meer dan taal — het overschrijdt culturele aannames over wat communicatie überhaupt is."
          )}
        </p>
      </div>

      {/* ─── SECTION 4: DEVELOPMENT PATH ────────────────────────────────────── */}
      <div style={{ background: lightGray, padding: "80px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
            {t("Development Path", "Jalur Pengembangan", "Ontwikkelingspad")}
          </p>
          <h2 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: navy, marginBottom: 12, lineHeight: 1.2 }}>
            {t("How to Grow as a Communicator", "Cara Bertumbuh sebagai Komunikator", "Hoe Te Groeien als Communicator")}
          </h2>
          <p style={{ color: bodyText, fontSize: 16, lineHeight: 1.75, marginBottom: 48 }}>
            {t(
              "Communication skills develop through deliberate practice — not just exposure. Start with yourself, then build habits, then shape your team's culture.",
              "Keterampilan komunikasi berkembang melalui latihan yang disengaja — bukan sekadar paparan. Mulailah dengan diri sendiri, lalu bangun kebiasaan, lalu bentuk budaya tim Anda.",
              "Communicatievaardigheden ontwikkelen zich door bewuste oefening — niet alleen door blootstelling. Begin met jezelf, bouw dan gewoonten op, en vorm dan de cultuur van je team."
            )}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 48, overflow: "hidden", borderRadius: 8 }}>
            {developmentLevels.map((level, i) => (
              <div key={level.level} style={{ flex: 1, background: level.color, padding: "12px 16px", textAlign: "center", position: "relative" }}>
                <p style={{ color: "white", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 2px", opacity: 0.8 }}>
                  {t("Level", "Tingkat", "Niveau")} {level.level}
                </p>
                <p style={{ color: "white", fontSize: 14, fontWeight: 700, margin: 0 }}>
                  {lang === "en" ? level.en_label : lang === "id" ? level.id_label : level.nl_label}
                </p>
                {i < developmentLevels.length - 1 && (
                  <div style={{ position: "absolute", right: -12, top: "50%", transform: "translateY(-50%)", width: 24, height: 24, background: level.color, clipPath: "polygon(0 0, 100% 50%, 0 100%)", zIndex: 1 }} />
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {developmentLevels.map((level) => (
              <div key={level.level} style={{ background: offWhite, borderRadius: 12, overflow: "hidden", borderTop: `4px solid ${level.color}` }}>
                <div style={{ padding: "28px 32px 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
                    <span style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: 40, fontWeight: 700, color: level.color, lineHeight: 1 }}>{level.level}</span>
                    <div>
                      <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 18, fontWeight: 800, color: navy, margin: 0 }}>
                        {lang === "en" ? level.en_label : lang === "id" ? level.id_label : level.nl_label}
                      </p>
                      <p style={{ fontSize: 13, color: bodyText, margin: 0, fontStyle: "italic" }}>
                        {lang === "en" ? level.en_subtitle : lang === "id" ? level.id_subtitle : level.nl_subtitle}
                      </p>
                    </div>
                  </div>
                </div>
                <div style={{ padding: "20px 32px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
                  {level.actions.map((action, ai) => (
                    <div key={ai} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: level.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                        <span style={{ color: "white", fontSize: 13, fontWeight: 700 }}>{ai + 1}</span>
                      </div>
                      <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.8, margin: 0 }}>
                        {lang === "en" ? action.en : lang === "id" ? action.id : action.nl}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── SECTION 5: REFLECTION QUESTIONS ───────────────────────────────── */}
      <div style={{ padding: "80px 24px", maxWidth: 780, margin: "0 auto" }}>
        <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
          {t("Reflection Questions", "Pertanyaan Refleksi", "Reflectievragen")}
        </p>
        <h2 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: navy, marginBottom: 12, lineHeight: 1.2 }}>
          {t("Sit With These", "Renungkan Ini", "Neem de Tijd Hiervoor")}
        </h2>
        <p style={{ color: bodyText, fontSize: 15, lineHeight: 1.7, marginBottom: 40 }}>
          {t(
            "For personal reflection and team conversation.",
            "Untuk refleksi pribadi dan percakapan tim.",
            "Voor persoonlijke reflectie en teamgesprek."
          )}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {reflectionQuestions.map((q) => (
            <div key={q.roman} style={{ background: lightGray, borderRadius: 10, padding: "24px 24px 24px 20px", display: "flex", gap: 16, alignItems: "flex-start", borderLeft: `3px solid ${orange}` }}>
              <span style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: 24, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 24, flexShrink: 0, paddingTop: 2 }}>{q.roman}</span>
              <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.8, margin: 0 }}>
                {lang === "en" ? q.en : lang === "id" ? q.id : q.nl}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── CTA FOOTER ─────────────────────────────────────────────────────── */}
      <div style={{ background: navy, padding: "72px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: orange }} />
        <div style={{ position: "relative", maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 800, color: offWhite, marginBottom: 16, lineHeight: 1.2 }}>
            {t("Keep Growing", "Terus Bertumbuh", "Blijf Groeien")}
          </h2>
          <p style={{ color: "oklch(75% 0.04 260)", fontSize: 16, lineHeight: 1.75, marginBottom: 32 }}>
            {t("Explore more resources to deepen your cross-cultural leadership.", "Jelajahi lebih banyak sumber untuk memperdalam kepemimpinan lintas budaya Anda.", "Verken meer bronnen om je intercultureel leiderschap te verdiepen.")}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/resources" style={{ display: "inline-block", padding: "14px 32px", background: orange, color: offWhite, borderRadius: 6, fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
              {t("← Content Library", "← Perpustakaan Konten", "← Contentbibliotheek")}
            </Link>
            <Link href="/resources/time-and-culture" style={{ display: "inline-block", padding: "14px 32px", border: "1px solid oklch(45% 0.05 260)", color: offWhite, borderRadius: 6, fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
              {t("Time & Culture →", "Waktu & Budaya →", "Tijd & Cultuur →")}
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
