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

// ─── Country PD Scores ────────────────────────────────────────────────────────
const pdScores = [
  { country_en: "Malaysia", country_id: "Malaysia", country_nl: "Maleisië", score: 104, level: "high" },
  { country_en: "Philippines", country_id: "Filipina", country_nl: "Filipijnen", score: 94, level: "high" },
  { country_en: "Indonesia", country_id: "Indonesia", country_nl: "Indonesië", score: 78, level: "high" },
  { country_en: "South Korea", country_id: "Korea Selatan", country_nl: "Zuid-Korea", score: 60, level: "medium" },
  { country_en: "United States", country_id: "Amerika Serikat", country_nl: "Verenigde Staten", score: 40, level: "low" },
  { country_en: "Netherlands", country_id: "Belanda", country_nl: "Nederland", score: 38, level: "low" },
  { country_en: "Australia", country_id: "Australia", country_nl: "Australië", score: 36, level: "low" },
  { country_en: "Denmark", country_id: "Denmark", country_nl: "Denemarken", score: 18, level: "low" },
];

// ─── Friction Points (accordion) ─────────────────────────────────────────────
const frictionPoints = [
  {
    number: "01",
    en_title: "Silence in meetings is not agreement",
    id_title: "Diam dalam rapat bukan berarti setuju",
    nl_title: "Stilte in vergaderingen is geen instemming",
    en_tagline: "What you read as consensus may be compliance.",
    id_tagline: "Apa yang Anda baca sebagai konsensus mungkin hanyalah kepatuhan.",
    nl_tagline: "Wat jij als consensus leest, kan gewoon gehoorzaamheid zijn.",
    en_body: "In high PD cultures, team members rarely challenge a leader publicly — especially in a group setting. Silence and nodding do not mean 'I agree.' They often mean 'I respect you too much to contradict you here.' The real feedback, if it comes at all, will arrive privately, indirectly, and much later.",
    id_body: "Dalam budaya PD tinggi, anggota tim jarang menantang pemimpin secara publik — terutama dalam kelompok. Diam dan anggukan tidak berarti 'Saya setuju.' Seringkali itu berarti 'Saya terlalu menghormati Anda untuk membantah di sini.' Umpan balik nyata, jika ada, akan datang secara pribadi, tidak langsung, dan jauh kemudian.",
    nl_body: "In hoge PD-culturen daagt een teamlid een leider zelden publiekelijk uit — zeker niet in een groep. Stilte en knikken betekenen niet 'Ik ben het eens.' Ze betekenen vaak 'Ik respecteer je te veel om je hier te tegenspreken.' Echte feedback, als die al komt, komt privé, indirect, en veel later.",
    en_practice: "Create private channels for honest input — a one-on-one after the meeting, a written form, or a trusted go-between. Make it safe to disagree without it being a public act.",
    id_practice: "Buat saluran pribadi untuk masukan yang jujur — percakapan satu-satu setelah rapat, formulir tertulis, atau perantara yang dipercaya. Jadikan tidak setuju sebagai hal yang aman tanpa harus menjadi tindakan publik.",
    nl_practice: "Creëer privékanalen voor eerlijke feedback — een één-op-één na de vergadering, een schriftelijk formulier, of een vertrouwde tussenpersoon. Maak het veilig om het oneens te zijn zonder dat het een publieke daad is.",
  },
  {
    number: "02",
    en_title: "Your informality may read as incompetence",
    id_title: "Informalitas Anda mungkin terlihat sebagai ketidakmampuan",
    nl_title: "Jouw informaliteit kan als onbekwaamheid worden gezien",
    en_tagline: "Wanting to be called by your first name can undermine your authority.",
    id_tagline: "Ingin dipanggil dengan nama depan Anda bisa melemahkan otoritas Anda.",
    nl_tagline: "Willen dat mensen je bij je voornaam noemen kan je gezag ondermijnen.",
    en_body: "A leader from a low PD culture who drops titles, sits with the team rather than at the head of the table, and says 'I don't have all the answers — let's figure it out together' may genuinely intend this as humility. In a high PD context, it can land as weakness. The team may start wondering: does this person actually know what they are doing? Who is in charge here? Uncertainty about leadership creates anxiety — not empowerment.",
    id_body: "Pemimpin dari budaya PD rendah yang melepas gelar, duduk bersama tim daripada di kepala meja, dan berkata 'Saya tidak punya semua jawaban — mari kita cari tahu bersama' mungkin sungguh-sungguh bermaksud ini sebagai kerendahan hati. Dalam konteks PD tinggi, ini bisa terlihat sebagai kelemahan. Tim mungkin mulai bertanya-tanya: apakah orang ini benar-benar tahu apa yang mereka lakukan?",
    nl_body: "Een leider uit een lage PD-cultuur die titels weglaat, naast het team zit in plaats van aan het hoofd van de tafel, en zegt 'Ik heb niet alle antwoorden — laten we het samen uitzoeken' bedoelt dit misschien oprecht als bescheidenheid. In een hoge PD-context kan dit als zwakte overkomen. Het team vraagt zich misschien af: weet deze persoon wel wat ze doen?",
    en_practice: "Maintain visible, calm authority — make clear decisions, communicate them clearly, and create structure. You can still be warm and relational without creating confusion about who leads.",
    id_practice: "Pertahankan otoritas yang terlihat dan tenang — buat keputusan yang jelas, komunikasikan dengan jelas, dan ciptakan struktur. Anda masih bisa hangat dan relasional tanpa menciptakan kebingungan tentang siapa yang memimpin.",
    nl_practice: "Behoud zichtbaar, rustig gezag — neem duidelijke beslissingen, communiceer ze helder, en creëer structuur. Je kunt nog steeds warm en relationeel zijn zonder verwarring te creëren over wie er leidt.",
  },
  {
    number: "03",
    en_title: "The leader's opinion closes the room",
    id_title: "Pendapat pemimpin menutup ruangan",
    nl_title: "De mening van de leider sluit de discussie",
    en_tagline: "If you speak first, you may be the only one speaking.",
    id_tagline: "Jika Anda berbicara pertama, Anda mungkin satu-satunya yang berbicara.",
    nl_tagline: "Als jij als eerste spreekt, ben jij misschien de enige die spreekt.",
    en_body: "In high PD settings, once the leader has shared their view, the conversation is often over. Not because people agree — but because disagreeing with the leader feels disrespectful or even risky. If you open a discussion by saying 'Here is what I think we should do,' your team will almost certainly say yes. This is not consensus. It is deference.",
    id_body: "Dalam kondisi PD tinggi, begitu pemimpin berbagi pandangannya, percakapan sering berakhir. Bukan karena orang setuju — tetapi karena tidak setuju dengan pemimpin terasa tidak hormat atau bahkan berisiko. Jika Anda membuka diskusi dengan mengatakan 'Ini yang menurut saya harus kita lakukan,' tim Anda hampir pasti akan mengatakan ya. Ini bukan konsensus. Ini adalah kepatuhan.",
    nl_body: "In hoge PD-omgevingen is het gesprek vaak voorbij zodra de leider zijn mening heeft gegeven. Niet omdat mensen het eens zijn — maar omdat het oneens zijn met de leider onfatsoenlijk of zelfs riskant aanvoelt. Als je een discussie opent met 'Dit is wat ik denk dat we moeten doen,' zal je team bijna zeker ja zeggen. Dit is geen consensus. Het is ontzag.",
    en_practice: "Ask before you tell. Share your perspective last, not first. Or ask a specific, narrow question: 'What is one risk we have not considered?' rather than 'What do you all think?'",
    id_practice: "Tanya sebelum memberi tahu. Bagikan perspektif Anda terakhir, bukan pertama. Atau ajukan pertanyaan yang spesifik dan terbatas: 'Apa satu risiko yang belum kita pertimbangkan?' daripada 'Apa pendapat semua orang?'",
    nl_practice: "Vraag voordat je vertelt. Deel je perspectief als laatste, niet als eerste. Of stel een specifieke, gerichte vraag: 'Wat is één risico dat we nog niet hebben overwogen?' in plaats van 'Wat denken jullie allemaal?'",
  },
  {
    number: "04",
    en_title: "Authority must be earned relationally before it works formally",
    id_title: "Otoritas harus diperoleh secara relasional sebelum bekerja secara formal",
    nl_title: "Gezag moet relationeel verdiend worden voordat het formeel werkt",
    en_tagline: "Your title alone is not enough — here, the person behind the title matters more.",
    id_tagline: "Gelar Anda saja tidak cukup — di sini, orang di balik gelar itu lebih penting.",
    nl_tagline: "Jouw titel alleen is niet genoeg — hier telt de persoon achter de titel meer.",
    en_body: "In many high PD cultures, formal authority is respected — but it only goes so far. Real influence, the kind where people go the extra mile for you, requires relational trust. If you have not invested time in knowing your team personally — their families, their concerns, their background — you may have their compliance but not their commitment. The time you spend on relationships is not wasted. It is the foundation your formal authority stands on.",
    id_body: "Dalam banyak budaya PD tinggi, otoritas formal dihormati — tetapi hanya sejauh ini. Pengaruh nyata, di mana orang melakukan lebih dari yang diharapkan untuk Anda, membutuhkan kepercayaan relasional. Jika Anda belum menginvestasikan waktu untuk mengenal tim Anda secara pribadi — keluarga, kekhawatiran, latar belakang mereka — Anda mungkin memiliki kepatuhan mereka tetapi bukan komitmen mereka.",
    nl_body: "In veel hoge PD-culturen wordt formeel gezag gerespecteerd — maar het gaat slechts zo ver. Echte invloed, waarbij mensen het extra voor je doen, vereist relationeel vertrouwen. Als je geen tijd hebt geïnvesteerd in je team persoonlijk kennen — hun families, zorgen, achtergrond — heb je misschien hun gehoorzaamheid maar niet hun toewijding.",
    en_practice: "Invest in one-on-one time with each team member — not about work, about them. Learn names, families, stories. In most high PD cultures, the leader who knows their people is the leader people will follow.",
    id_practice: "Investasikan waktu satu-satu dengan setiap anggota tim — bukan tentang pekerjaan, tentang mereka. Pelajari nama, keluarga, cerita mereka. Dalam sebagian besar budaya PD tinggi, pemimpin yang mengenal orang-orangnya adalah pemimpin yang akan diikuti orang.",
    nl_practice: "Investeer in één-op-één tijd met elk teamlid — niet over werk, maar over hen. Leer namen, families, verhalen kennen. In de meeste hoge PD-culturen is de leider die zijn mensen kent de leider die mensen zullen volgen.",
  },
];

// ─── Development Levels ───────────────────────────────────────────────────────
const developmentLevels = [
  {
    level: "01",
    en_label: "Beginner",
    id_label: "Pemula",
    nl_label: "Beginner",
    en_subtitle: "Know your own default first",
    id_subtitle: "Kenali default Anda sendiri terlebih dahulu",
    nl_subtitle: "Ken eerst je eigen standaard",
    color: "#4A90D9",
    actions: [
      {
        en: "Reflect honestly: on a scale of 1–10, how comfortable are you being challenged by someone who reports to you? How do you react when a junior team member disagrees with you publicly? Your gut reaction reveals your PD default.",
        id: "Renungkan dengan jujur: pada skala 1–10, seberapa nyaman Anda ditantang oleh seseorang yang melapor kepada Anda? Bagaimana reaksi Anda ketika anggota tim junior tidak setuju dengan Anda di depan umum? Reaksi naluri Anda mengungkapkan default PD Anda.",
        nl: "Reflecteer eerlijk: op een schaal van 1–10, hoe comfortabel voel je je als iemand die aan jou rapporteert jou uitdaagt? Hoe reageer je als een junior teamlid het publiekelijk oneens is met jou? Je instinctieve reactie onthult je PD-standaard.",
      },
      {
        en: "Look up Hofstede's Power Distance Index for your own country and the countries of your team members. Compare the gaps. A 40-point gap (say, Dutch leader with an Indonesian team) is not just cultural flavour — it is a structural communication challenge that needs deliberate bridging.",
        id: "Cari Indeks Jarak Kekuasaan Hofstede untuk negara Anda sendiri dan negara-negara anggota tim Anda. Bandingkan kesenjangan. Kesenjangan 40 poin (misalnya, pemimpin Belanda dengan tim Indonesia) bukan hanya cita rasa budaya — ini adalah tantangan komunikasi struktural yang membutuhkan jembatan yang disengaja.",
        nl: "Zoek de Power Distance Index van Hofstede op voor jouw eigen land en de landen van je teamleden. Vergelijk de verschillen. Een kloof van 40 punten (bijv. Nederlandse leider met een Indonesisch team) is niet alleen culturele kleur — het is een structurele communicatie-uitdaging die bewuste overbrugging vereist.",
      },
    ],
  },
  {
    level: "02",
    en_label: "Practitioner",
    id_label: "Praktisi",
    nl_label: "Practitioner",
    en_subtitle: "Adjust two specific behaviors this month",
    id_subtitle: "Sesuaikan dua perilaku spesifik bulan ini",
    nl_subtitle: "Pas deze maand twee specifieke gedragingen aan",
    color: "#E07540",
    actions: [
      {
        en: "Change how you open meetings. Stop starting with your own view. Instead, open with a question — narrow enough to answer: 'What is one thing that worried you about this project this week?' Narrower questions in high PD contexts get more honest answers than open invitations.",
        id: "Ubah cara Anda membuka rapat. Berhenti memulai dengan pandangan Anda sendiri. Sebaliknya, buka dengan pertanyaan — cukup sempit untuk dijawab: 'Apa satu hal yang membuat Anda khawatir tentang proyek ini minggu ini?' Pertanyaan yang lebih sempit dalam konteks PD tinggi mendapat jawaban yang lebih jujur daripada undangan terbuka.",
        nl: "Verander hoe je vergaderingen opent. Stop met beginnen met je eigen mening. Open in plaats daarvan met een vraag — specifiek genoeg om te beantwoorden: 'Wat is één ding dat je deze week zorgen baarde over dit project?' Specifieke vragen in hoge PD-contexten krijgen eerlijkere antwoorden dan open uitnodigingen.",
      },
      {
        en: "Build in a private feedback step after every major group decision. A simple message the day after: 'Now that we've decided X — is there anything you wanted to say but didn't get the chance?' You will be surprised what surfaces when the group pressure is gone.",
        id: "Bangun langkah umpan balik pribadi setelah setiap keputusan kelompok besar. Pesan sederhana keesokan harinya: 'Sekarang setelah kita memutuskan X — apakah ada sesuatu yang ingin Anda katakan tetapi tidak mendapat kesempatan?' Anda akan terkejut dengan apa yang muncul ketika tekanan kelompok hilang.",
        nl: "Bouw een privé-feedbackstap in na elke grote groepsbeslissing. Een eenvoudig bericht de dag erna: 'Nu we X hebben besloten — is er iets wat je wilde zeggen maar niet de kans had?' Je zult verrast zijn wat er naar boven komt als de groepsdruk weg is.",
      },
    ],
  },
  {
    level: "03",
    en_label: "Advanced",
    id_label: "Lanjutan",
    nl_label: "Gevorderd",
    en_subtitle: "Build team culture that bridges the gap",
    id_subtitle: "Bangun budaya tim yang menjembatani kesenjangan",
    nl_subtitle: "Bouw een teamcultuur die de kloof overbrugt",
    color: "#1B3A6B",
    actions: [
      {
        en: "Name the tension explicitly with your team. Say it out loud: 'I know some of you come from cultures where the leader decides and everyone follows. I know some of you come from cultures where everyone's opinion is expected. In this team, we are trying to build something in between — where the leader leads clearly and every voice still counts. That takes practice from all of us.' Naming it takes away much of its power to divide.",
        id: "Sebutkan ketegangan ini secara eksplisit dengan tim Anda. Katakan dengan lantang: 'Saya tahu beberapa dari Anda berasal dari budaya di mana pemimpin memutuskan dan semua orang mengikuti. Saya tahu beberapa dari Anda berasal dari budaya di mana pendapat semua orang diharapkan. Dalam tim ini, kita mencoba membangun sesuatu di tengah-tengah.' Menyebutkannya menghilangkan banyak kekuatannya untuk memecah belah.",
        nl: "Benoem de spanning expliciet met je team. Zeg het hardop: 'Ik weet dat sommigen van jullie komen uit culturen waar de leider beslist en iedereen volgt. Ik weet dat sommigen komen uit culturen waar ieders mening wordt verwacht. In dit team proberen we iets daartussenin te bouwen.' Het benoemen neemt veel van zijn vermogen weg om te verdelen.",
      },
      {
        en: "Give your team members from high PD cultures a specific, honoured role in shaping decisions — not just implementing them. This is not about reducing your authority; it is about creating a pathway for their wisdom to reach you. A senior local leader who is asked for their input before a decision is made will carry that decision very differently than one who is told after the fact.",
        id: "Berikan anggota tim Anda dari budaya PD tinggi peran yang spesifik dan dihormati dalam membentuk keputusan — bukan hanya melaksanakannya. Ini bukan tentang mengurangi otoritas Anda; ini tentang menciptakan jalur bagi kebijaksanaan mereka untuk mencapai Anda. Pemimpin lokal senior yang dimintai masukan sebelum keputusan dibuat akan membawa keputusan itu dengan sangat berbeda daripada yang diberi tahu setelah kenyataan.",
        nl: "Geef je teamleden uit hoge PD-culturen een specifieke, geëerde rol in het vormgeven van beslissingen — niet alleen in het uitvoeren ervan. Dit gaat niet over het verminderen van je gezag; het gaat over het creëren van een pad voor hun wijsheid om jou te bereiken. Een senior lokale leider die om input wordt gevraagd vóór een beslissing wordt genomen, zal die beslissing heel anders dragen dan iemand die achteraf wordt verteld.",
      },
    ],
  },
];

// ─── Reflection Questions ─────────────────────────────────────────────────────
const reflectionQuestions = [
  {
    roman: "I",
    en: "What is your home culture's power-distance default? How has it shaped the way you lead — or follow?",
    id: "Apa default jarak kekuasaan budaya asal Anda? Bagaimana hal itu membentuk cara Anda memimpin — atau mengikuti?",
    nl: "Wat is de machtafstandsstandaard van jouw thuiscultuur? Hoe heeft het de manier waarop jij leidt — of volgt — gevormd?",
  },
  {
    roman: "II",
    en: "Think of a moment when silence from your team turned out to mean something different than you thought. What were they actually communicating?",
    id: "Pikirkan saat ketika diam dari tim Anda ternyata berarti sesuatu yang berbeda dari yang Anda kira. Apa yang sebenarnya mereka sampaikan?",
    nl: "Denk aan een moment waarop stilte van je team iets anders bleek te betekenen dan je dacht. Wat communiceerden ze eigenlijk?",
  },
  {
    roman: "III",
    en: "Jesus held full authority and chose radical servanthood. What does that model mean for how you hold and use power in your specific context?",
    id: "Yesus memegang otoritas penuh dan memilih kerendahan hati radikal. Apa artinya model itu bagi cara Anda memegang dan menggunakan kekuasaan dalam konteks spesifik Anda?",
    nl: "Jezus had volledig gezag en koos voor radicale dienstbaarheid. Wat betekent dat model voor hoe jij macht vasthoudt en gebruikt in jouw specifieke context?",
  },
  {
    roman: "IV",
    en: "Who on your team is doing the most cultural adaptation work right now? Is that weight distributed fairly — or is one person carrying most of it?",
    id: "Siapa di tim Anda yang sedang melakukan paling banyak pekerjaan adaptasi budaya sekarang? Apakah beban itu didistribusikan secara adil — atau apakah satu orang menanggung sebagian besar?",
    nl: "Wie in je team doet momenteel het meeste culturele aanpassingswerk? Is die last eerlijk verdeeld — of draagt één persoon het grootste deel?",
  },
  {
    roman: "V",
    en: "In what ways might your current leadership style be creating confusion or anxiety in your team — without you realising it?",
    id: "Dengan cara apa gaya kepemimpinan Anda saat ini mungkin menciptakan kebingungan atau kecemasan dalam tim Anda — tanpa Anda sadari?",
    nl: "Op welke manieren kan je huidige leiderschapsstijl verwarring of angst in je team creëren — zonder dat je het beseft?",
  },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function PowerDistanceClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [openPoint, setOpenPoint] = useState<number | null>(null);
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("power-distance");
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
        <div style={{ position: "relative", maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>
            {t("Cross-Cultural · Guide", "Lintas Budaya · Panduan", "Cross-Cultureel · Gids")}
          </p>
          <h1 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(34px, 5.5vw, 58px)", fontWeight: 800, color: offWhite, margin: "0 auto 20px", maxWidth: 780, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
            {t("Power Distance", "Jarak Kekuasaan", "Machtafstand")}
          </h1>
          <p style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: "clamp(19px, 2.5vw, 26px)", color: "oklch(85% 0.03 80)", maxWidth: 620, margin: "0 auto 16px", lineHeight: 1.6, fontStyle: "italic" }}>
            {t(
              '"Power distance is the extent to which less powerful members of institutions accept and expect that power is distributed unequally."',
              '"Jarak kekuasaan adalah sejauh mana anggota institusi yang kurang berkuasa menerima dan mengharapkan bahwa kekuasaan didistribusikan secara tidak setara."',
              '"Machtafstand is de mate waarin minder machtige leden van instellingen ongelijke verdeling van macht accepteren en verwachten."'
            )}
          </p>
          <p style={{ color: "oklch(65% 0.05 260)", fontSize: 13, marginBottom: 36, fontStyle: "italic" }}>— Geert Hofstede</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={handleSave}
              disabled={saved || isPending}
              style={{ padding: "13px 30px", borderRadius: 6, border: "none", cursor: saved ? "default" : "pointer", fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 14, fontWeight: 700, background: saved ? "oklch(45% 0.08 260)" : orange, color: offWhite }}
            >
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
              "Sarah had led teams in the Netherlands for eight years. Flat structures. First names. Everyone's opinion matters. She arrived in Surabaya to lead a national team of twelve.",
              "Sarah telah memimpin tim di Belanda selama delapan tahun. Struktur datar. Nama depan. Pendapat semua orang penting. Dia tiba di Surabaya untuk memimpin tim nasional beranggotakan dua belas orang.",
              "Sarah had acht jaar lang teams geleid in Nederland. Platte structuren. Voornamen. Ieders mening telt. Ze arriveerde in Surabaya om een nationaal team van twaalf mensen te leiden."
            )}
          </p>
          <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.8, marginBottom: 16 }}>
            {t(
              "In her first team meeting, she laid out three options and said: 'I want to hear from everyone. What do you think we should do?' Silence. A few polite nods. One man said, 'Whatever you decide, we will support.' She pushed harder for input. More silence.",
              "Dalam rapat tim pertamanya, dia memaparkan tiga opsi dan berkata: 'Saya ingin mendengar dari semua orang. Apa yang menurut kalian harus kita lakukan?' Keheningan. Beberapa anggukan sopan. Satu pria berkata, 'Apapun yang Anda putuskan, kami akan mendukung.' Dia mendorong lebih keras untuk masukan. Lebih banyak keheningan.",
              "In haar eerste teamvergadering legde ze drie opties voor en zei: 'Ik wil van iedereen horen. Wat denken jullie dat we moeten doen?' Stilte. Een paar beleefde knikjes. Eén man zei: 'Wat u ook beslist, wij steunen u.' Ze drong harder aan op input. Meer stilte."
            )}
          </p>
          <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.8, marginBottom: 16 }}>
            {t(
              "That evening she wrote in her journal: 'This team has no initiative. They just wait to be told what to do.'",
              "Malam itu dia menulis di jurnalnya: 'Tim ini tidak punya inisiatif. Mereka hanya menunggu untuk diberi tahu apa yang harus dilakukan.'",
              "Die avond schreef ze in haar dagboek: 'Dit team heeft geen initiatief. Ze wachten gewoon tot ze verteld worden wat ze moeten doen.'"
            )}
          </p>
          <p style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: "clamp(19px, 2.5vw, 23px)", color: navy, lineHeight: 1.6, fontStyle: "italic" }}>
            {t(
              "She was wrong. The team had plenty of opinions. They were waiting for her to lead — because in their experience, that is what a good team does for a good leader.",
              "Dia salah. Tim memiliki banyak pendapat. Mereka menunggu dia untuk memimpin — karena dalam pengalaman mereka, itulah yang dilakukan tim yang baik untuk pemimpin yang baik.",
              "Ze had het mis. Het team had volop meningen. Ze wachtten op haar leiding — omdat in hun ervaring dat is wat een goed team doet voor een goede leider."
            )}
          </p>
        </div>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.8, marginBottom: 16 }}>
          {t(
            "This is a power distance problem. Not a people problem. And it plays out in every cross-cultural team where the leader and the team sit on different ends of the PD spectrum.",
            "Ini adalah masalah jarak kekuasaan. Bukan masalah orang. Dan ini terjadi di setiap tim lintas budaya di mana pemimpin dan tim berada di ujung berbeda spektrum PD.",
            "Dit is een machtafstandsprobleem. Geen mensenprobleem. En het speelt zich af in elk intercultureel team waar de leider en het team aan verschillende uiteinden van het PD-spectrum zitten."
          )}
        </p>
        <p style={{ fontSize: 17, fontWeight: 700, color: navy, lineHeight: 1.7 }}>
          {t(
            "Understanding power distance does not fix the gap. But it stops you from misreading your team — and that is where everything starts.",
            "Memahami jarak kekuasaan tidak memperbaiki kesenjangan. Tapi itu menghentikan Anda dari salah membaca tim Anda — dan di situlah segalanya dimulai.",
            "Machtafstand begrijpen dicht de kloof niet. Maar het voorkomt dat je je team verkeerd leest — en dat is waar alles begint."
          )}
        </p>
      </div>

      {/* ─── IMAGE 1 ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 900, margin: "48px auto 0", padding: "0 24px" }}>
        <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 40px oklch(20% 0.08 260 / 0.15)" }}>
          <Image
            src="/resources/power-distance-1.jpg"
            alt="Cross-cultural team meeting showing power distance dynamics"
            width={1312}
            height={736}
            style={{ width: "100%", height: "auto", display: "block" }}
            priority
          />
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: "oklch(60% 0.04 260)", marginTop: 10, fontStyle: "italic" }}>
          {t(
            "What looks like passivity is often deference — a form of respect the leader may not recognize.",
            "Yang terlihat seperti kepasifan sering kali adalah penghormatan — bentuk rasa hormat yang mungkin tidak dikenali pemimpin.",
            "Wat eruitziet als passiviteit is vaak ontzag — een vorm van respect die de leider misschien niet herkent."
          )}
        </p>
      </div>

      {/* ─── SECTION 2: WHAT IT IS ───────────────────────────────────────────── */}
      <div style={{ padding: "80px 24px", maxWidth: 780, margin: "0 auto" }}>
        <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
          {t("The Framework", "Kerangka Kerja", "Het Kader")}
        </p>
        <h2 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: navy, marginBottom: 32, lineHeight: 1.2 }}>
          {t("What Power Distance Actually Measures", "Apa yang Sebenarnya Diukur Jarak Kekuasaan", "Wat Machtafstand Eigenlijk Meet")}
        </h2>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 20 }}>
          {t(
            "Power distance is not about whether hierarchy is good or bad. Every culture has hierarchy. The difference is in how people feel about it — how much psychological distance they expect between themselves and those in authority above them.",
            "Jarak kekuasaan bukan tentang apakah hierarki itu baik atau buruk. Setiap budaya memiliki hierarki. Perbedaannya ada pada bagaimana orang merasa tentang hal itu — seberapa besar jarak psikologis yang mereka harapkan antara diri mereka dan mereka yang berkuasa di atas mereka.",
            "Machtafstand gaat er niet over of hiërarchie goed of slecht is. Elke cultuur heeft hiërarchie. Het verschil zit in hoe mensen erover voelen — hoeveel psychologische afstand ze verwachten tussen zichzelf en degenen in autoriteit boven hen."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 20 }}>
          {t(
            "In high power-distance cultures, inequality is seen as natural — even healthy. The leader is supposed to lead. Decisions flow from the top. Challenging authority publicly is not just uncomfortable; it is wrong. The hierarchy gives the team a sense of order and security.",
            "Dalam budaya jarak kekuasaan tinggi, ketidaksetaraan dilihat sebagai hal yang alami — bahkan sehat. Pemimpin seharusnya memimpin. Keputusan mengalir dari atas. Menantang otoritas secara publik bukan hanya tidak nyaman; itu salah. Hierarki memberi tim rasa ketertiban dan keamanan.",
            "In hoge machtafstandsculturen wordt ongelijkheid als natuurlijk — zelfs gezond — beschouwd. De leider zou moeten leiden. Beslissingen komen van bovenaf. Autoriteit publiekelijk uitdagen is niet alleen ongemakkelijk; het is verkeerd. De hiërarchie geeft het team een gevoel van orde en veiligheid."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 36 }}>
          {t(
            "In low power-distance cultures, hierarchy is tolerated but questioned. Everyone's voice counts. Titles don't make you right. A good leader earns respect by listening, not by rank. Challenging the boss is not disrespect — it's engagement.",
            "Dalam budaya jarak kekuasaan rendah, hierarki ditoleransi tetapi dipertanyakan. Setiap suara dihitung. Gelar tidak membuat Anda benar. Pemimpin yang baik mendapatkan rasa hormat dengan mendengarkan, bukan dengan pangkat. Menantang atasan bukan ketidakhormatan — itu adalah keterlibatan.",
            "In lage machtafstandsculturen wordt hiërarchie getolereerd maar bevraagd. Ieders stem telt. Titels maken je niet gelijk. Een goede leider verdient respect door te luisteren, niet door rang. De baas uitdagen is geen gebrek aan respect — het is betrokkenheid."
          )}
        </p>

        {/* Pull-quote */}
        <div style={{ background: navy, borderRadius: 10, padding: "32px 36px", marginBottom: 40, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, borderRadius: "0 10px 0 120px", background: "oklch(30% 0.12 260)", opacity: 0.5 }} />
          <p style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: "clamp(20px, 3vw, 28px)", color: offWhite, lineHeight: 1.5, fontStyle: "italic", margin: "0 0 16px", position: "relative" }}>
            {t(
              '"In high power-distance cultures, hierarchy is not a problem to solve — it is a framework that provides order, clarity, and security. The mistake is importing your PD assumptions and calling them leadership."',
              '"Dalam budaya jarak kekuasaan tinggi, hierarki bukan masalah yang harus dipecahkan — itu adalah kerangka yang memberikan ketertiban, kejelasan, dan keamanan. Kesalahannya adalah mengimpor asumsi PD Anda dan menyebutnya kepemimpinan."',
              '"In hoge machtafstandsculturen is hiërarchie geen probleem om op te lossen — het is een kader dat orde, duidelijkheid en veiligheid biedt. De fout is je PD-aannames importeren en het leiderschap noemen."'
            )}
          </p>
          <p style={{ color: orange, fontSize: 13, fontWeight: 600, margin: 0, position: "relative" }}>— Geert Hofstede</p>
        </div>

        {/* PD Score bar chart */}
        <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20 }}>
          {t("Power Distance Index by Country", "Indeks Jarak Kekuasaan per Negara", "Machtafstandsindex per Land")}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 8 }}>
          {pdScores.map((c) => (
            <div key={c.country_en} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 120, fontSize: 13, fontWeight: 600, color: navy, flexShrink: 0 }}>
                {lang === "en" ? c.country_en : lang === "id" ? c.country_id : c.country_nl}
              </div>
              <div style={{ flex: 1, background: "oklch(92% 0.01 80)", borderRadius: 4, overflow: "hidden", height: 22 }}>
                <div style={{
                  width: `${c.score}%`,
                  maxWidth: "100%",
                  height: "100%",
                  background: c.level === "high" ? orange : c.level === "medium" ? "oklch(55% 0.12 45)" : "oklch(50% 0.10 260)",
                  borderRadius: 4,
                  transition: "width 0.3s ease",
                }} />
              </div>
              <div style={{ width: 36, fontSize: 13, fontWeight: 700, color: bodyText, textAlign: "right", flexShrink: 0 }}>{c.score}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "oklch(60% 0.04 260)", fontStyle: "italic", marginBottom: 0 }}>
          {t("Source: Hofstede Insights. Scale 0–104.", "Sumber: Hofstede Insights. Skala 0–104.", "Bron: Hofstede Insights. Schaal 0–104.")}
        </p>
      </div>

      {/* ─── SECTION 3: FRICTION POINTS — ACCORDION ────────────────────────── */}
      <div style={{ background: lightGray, padding: "80px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
            {t("Where It Goes Wrong", "Di Mana Ini Salah", "Waar Het Misgaat")}
          </p>
          <h2 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: navy, marginBottom: 12, lineHeight: 1.2 }}>
            {t("4 Friction Points in Cross-Cultural Teams", "4 Titik Gesekan dalam Tim Lintas Budaya", "4 Wrijvingspunten in Interculturele Teams")}
          </h2>
          <p style={{ color: bodyText, fontSize: 16, lineHeight: 1.75, marginBottom: 48 }}>
            {t(
              "These are the moments where power distance gaps cause real damage — and where understanding changes everything. Click each to go deeper.",
              "Inilah saat-saat di mana kesenjangan jarak kekuasaan menyebabkan kerusakan nyata — dan di mana pemahaman mengubah segalanya. Klik masing-masing untuk lebih dalam.",
              "Dit zijn de momenten waarop machtafstandskloven echte schade aanrichten — en waar begrip alles verandert. Klik op elk voor meer diepgang."
            )}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {frictionPoints.map((fp, i) => {
              const isOpen = openPoint === i;
              return (
                <div
                  key={fp.number}
                  style={{ background: offWhite, borderRadius: 10, overflow: "hidden", boxShadow: isOpen ? "0 4px 24px oklch(20% 0.08 260 / 0.12)" : "none", transition: "box-shadow 0.2s ease" }}
                >
                  <button
                    onClick={() => setOpenPoint(isOpen ? null : i)}
                    style={{ width: "100%", background: "none", border: "none", padding: "24px 28px", display: "flex", alignItems: "center", gap: 20, cursor: "pointer", textAlign: "left" }}
                  >
                    <span style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: 36, fontWeight: 700, color: isOpen ? orange : "oklch(75% 0.04 260)", lineHeight: 1, minWidth: 44, flexShrink: 0, transition: "color 0.15s ease" }}>
                      {fp.number}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 17, fontWeight: 700, color: navy, margin: "0 0 4px" }}>
                        {lang === "en" ? fp.en_title : lang === "id" ? fp.id_title : fp.nl_title}
                      </p>
                      <p style={{ fontSize: 13, color: bodyText, margin: 0, fontStyle: "italic" }}>
                        {lang === "en" ? fp.en_tagline : lang === "id" ? fp.id_tagline : fp.nl_tagline}
                      </p>
                    </div>
                    <span style={{ color: isOpen ? orange : "oklch(65% 0.04 260)", fontSize: 22, fontWeight: 300, transform: isOpen ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s ease, color 0.15s ease", flexShrink: 0 }}>+</span>
                  </button>

                  {isOpen && (
                    <div style={{ padding: "0 28px 28px", borderTop: "1px solid oklch(92% 0.01 80)" }}>
                      <div style={{ paddingTop: 24, display: "flex", flexDirection: "column", gap: 20 }}>
                        <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.85, margin: 0 }}>
                          {lang === "en" ? fp.en_body : lang === "id" ? fp.id_body : fp.nl_body}
                        </p>
                        <div style={{ borderLeft: `3px solid ${orange}`, paddingLeft: 20 }}>
                          <p style={{ fontSize: 12, fontWeight: 700, color: orange, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                            {t("What to do", "Apa yang harus dilakukan", "Wat te doen")}
                          </p>
                          <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.8, margin: 0 }}>
                            {lang === "en" ? fp.en_practice : lang === "id" ? fp.id_practice : fp.nl_practice}
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

      {/* ─── SECTION 4: FAITH ANCHOR ────────────────────────────────────────── */}
      <div style={{ padding: "80px 24px", maxWidth: 780, margin: "0 auto" }}>
        <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
          {t("Faith Anchor", "Jangkar Iman", "Geloofsanker")}
        </p>
        <h2 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: navy, marginBottom: 32, lineHeight: 1.2 }}>
          {t("Jesus and the Question of Power", "Yesus dan Pertanyaan tentang Kekuasaan", "Jezus en de Vraag naar Macht")}
        </h2>

        <div style={{ background: navy, borderRadius: 12, padding: "40px 44px", marginBottom: 40, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, left: -20, width: 120, height: 120, borderRadius: "50%", background: "oklch(30% 0.12 260)", opacity: 0.4 }} />
          <div style={{ position: "absolute", bottom: -30, right: -10, width: 160, height: 160, borderRadius: "50%", background: "oklch(30% 0.12 260)", opacity: 0.3 }} />
          <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20, position: "relative" }}>
            {t("Scripture", "Kitab Suci", "Schriftuur")}
          </p>
          <blockquote style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: "clamp(20px, 3vw, 28px)", color: offWhite, lineHeight: 1.65, fontStyle: "italic", margin: "0 0 20px", position: "relative" }}>
            {t(
              '"Whoever wants to become great among you must be your servant, and whoever wants to be first must be your slave — just as the Son of Man did not come to be served, but to serve, and to give his life as a ransom for many."',
              '"Barangsiapa ingin menjadi besar di antara kamu, hendaklah ia menjadi pelayanmu, dan barangsiapa ingin menjadi terkemuka di antara kamu, hendaklah ia menjadi hambamu — sama seperti Anak Manusia datang bukan untuk dilayani, melainkan untuk melayani dan untuk memberikan nyawa-Nya menjadi tebusan bagi banyak orang."',
              '"Wie groot wil zijn onder jullie, moet jullie dienaar zijn, en wie de eerste wil zijn, moet jullie slaaf zijn — zoals de Mensenzoon niet gekomen is om gediend te worden, maar om te dienen en zijn leven te geven als losgeld voor velen."'
            )}
          </blockquote>
          <p style={{ color: orange, fontSize: 14, fontWeight: 600, margin: 0, position: "relative" }}>
            {t("Matthew 20:26–28 (NIV)", "Matius 20:26–28", "Mattheüs 20:26–28")}
          </p>
        </div>

        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 20 }}>
          {t(
            "Jesus lived in one of the highest power-distance cultures in the ancient world. Roman occupation. Religious hierarchy. Strict social order. He was not a low-PD leader in a low-PD context. He was a high-authority figure who chose to use power in a completely unexpected way.",
            "Yesus hidup dalam salah satu budaya jarak kekuasaan tertinggi di dunia kuno. Pendudukan Romawi. Hierarki keagamaan. Tatanan sosial yang ketat. Dia bukan pemimpin PD rendah dalam konteks PD rendah. Dia adalah tokoh otoritas tinggi yang memilih menggunakan kekuasaan dengan cara yang sama sekali tidak terduga.",
            "Jezus leefde in een van de hoogste machtafstandsculturen in de antieke wereld. Romeinse bezetting. Religieuze hiërarchie. Strikte sociale orde. Hij was geen lage-PD-leider in een lage-PD-context. Hij was een hoge-autoriteits figuur die ervoor koos macht op een volledig onverwachte manier te gebruiken."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 20 }}>
          {t(
            "He did not dismantle hierarchy. He filled it with something different: love, sacrifice, and service. When he washed his disciples' feet (John 13), he was not pretending power did not exist — he was demonstrating what legitimate power does when it is grounded in love rather than status.",
            "Dia tidak meruntuhkan hierarki. Dia mengisinya dengan sesuatu yang berbeda: cinta, pengorbanan, dan pelayanan. Ketika Dia membasuh kaki murid-murid-Nya (Yohanes 13), Dia tidak berpura-pura kekuasaan tidak ada — Dia menunjukkan apa yang dilakukan kekuasaan yang sah ketika berakar pada cinta daripada status.",
            "Hij ontmantelde de hiërarchie niet. Hij vulde haar met iets anders: liefde, opoffering en dienst. Toen hij de voeten van zijn discipelen waste (Johannes 13), deed hij niet alsof macht niet bestond — hij demonstreerde wat legitieme macht doet wanneer ze geworteld is in liefde in plaats van status."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85 }}>
          {t(
            "This gives cross-cultural leaders something neither high PD nor low PD culture alone can offer: a model where authority is real, visible, and secure — and where that authority is used entirely in the service of others. You do not have to choose between leading clearly and serving deeply. Jesus did both.",
            "Ini memberi pemimpin lintas budaya sesuatu yang tidak dapat ditawarkan oleh budaya PD tinggi atau rendah saja: model di mana otoritas nyata, terlihat, dan aman — dan di mana otoritas itu digunakan sepenuhnya untuk melayani orang lain. Anda tidak harus memilih antara memimpin dengan jelas dan melayani dengan sepenuh hati. Yesus melakukan keduanya.",
            "Dit geeft interculturele leiders iets wat noch hoge PD noch lage PD-cultuur alleen kan bieden: een model waar autoriteit echt, zichtbaar en veilig is — en waar die autoriteit volledig wordt ingezet ten dienste van anderen. Je hoeft niet te kiezen tussen helder leiden en diep dienen. Jezus deed beide."
          )}
        </p>
      </div>

      {/* ─── IMAGE 2 ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 64px" }}>
        <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 40px oklch(20% 0.08 260 / 0.15)" }}>
          <Image
            src="/resources/power-distance-2.jpg"
            alt="Servant leadership — authority used in service of others"
            width={1312}
            height={736}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: "oklch(60% 0.04 260)", marginTop: 10, fontStyle: "italic" }}>
          {t(
            "Real authority does not need to protect itself — it can afford to go low.",
            "Otoritas sejati tidak perlu melindungi dirinya sendiri — ia mampu untuk merendah.",
            "Echte autoriteit hoeft zichzelf niet te beschermen — ze kan het zich veroorloven om laag te gaan."
          )}
        </p>
      </div>

      {/* ─── SECTION 5: DEVELOPMENT PATH ────────────────────────────────────── */}
      <div style={{ background: lightGray, padding: "80px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
            {t("Development Path", "Jalur Pengembangan", "Ontwikkelingspad")}
          </p>
          <h2 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: navy, marginBottom: 12, lineHeight: 1.2 }}>
            {t("How to Bridge the Gap", "Cara Menjembatani Kesenjangan", "Hoe de Kloof te Overbruggen")}
          </h2>
          <p style={{ color: bodyText, fontSize: 16, lineHeight: 1.75, marginBottom: 48 }}>
            {t(
              "This is not about choosing a side. It is about building awareness, adjusting behavior, and creating team culture that works across the gap.",
              "Ini bukan tentang memilih sisi. Ini tentang membangun kesadaran, menyesuaikan perilaku, dan menciptakan budaya tim yang bekerja melampaui kesenjangan.",
              "Dit gaat niet over het kiezen van een kant. Het gaat over het opbouwen van bewustzijn, het aanpassen van gedrag, en het creëren van een teamcultuur die werkt over de kloof heen."
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

      {/* ─── SECTION 6: REFLECTION QUESTIONS ───────────────────────────────── */}
      <div style={{ padding: "80px 24px", maxWidth: 780, margin: "0 auto" }}>
        <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
          {t("Reflection Questions", "Pertanyaan Refleksi", "Reflectievragen")}
        </p>
        <h2 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: navy, marginBottom: 12, lineHeight: 1.2 }}>
          {t("Sit With These", "Renungkan Ini", "Neem de Tijd Hiervoor")}
        </h2>
        <p style={{ color: bodyText, fontSize: 15, lineHeight: 1.7, marginBottom: 40 }}>
          {t(
            "These questions are for your own reflection and for your team. The most growth often happens when you bring them to a conversation.",
            "Pertanyaan-pertanyaan ini untuk refleksi Anda sendiri dan untuk tim Anda. Pertumbuhan paling banyak sering terjadi ketika Anda membawanya ke percakapan.",
            "Deze vragen zijn voor je eigen reflectie en voor je team. De meeste groei vindt vaak plaats wanneer je ze in een gesprek inbrengt."
          )}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {reflectionQuestions.map((q) => (
            <div
              key={q.roman}
              style={{ background: lightGray, borderRadius: 10, padding: "24px 24px 24px 20px", display: "flex", gap: 16, alignItems: "flex-start", borderLeft: `3px solid ${orange}` }}
            >
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
            {t(
              "Explore more resources to deepen your cross-cultural leadership.",
              "Jelajahi lebih banyak sumber untuk memperdalam kepemimpinan lintas budaya Anda.",
              "Verken meer bronnen om je intercultureel leiderschap te verdiepen."
            )}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/resources"
              style={{ display: "inline-block", padding: "14px 32px", background: orange, color: offWhite, borderRadius: 6, fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 15, fontWeight: 700, textDecoration: "none" }}
            >
              {t("← Content Library", "← Perpustakaan Konten", "← Contentbibliotheek")}
            </Link>
            <Link
              href="/resources/intercultural-communication"
              style={{ display: "inline-block", padding: "14px 32px", border: "1px solid oklch(45% 0.05 260)", color: offWhite, borderRadius: 6, fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 15, fontWeight: 600, textDecoration: "none" }}
            >
              {t("Intercultural Communication →", "Komunikasi Antarbudaya →", "Interculturele Communicatie →")}
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
