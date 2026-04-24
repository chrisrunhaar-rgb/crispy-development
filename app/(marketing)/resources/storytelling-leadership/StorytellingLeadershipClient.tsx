"use client";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const STORY_CHAPTERS = [
  {
    number: "I",
    en_label: "Context", id_label: "Konteks", nl_label: "Context",
    en_subtitle: "Where things stood", id_subtitle: "Keadaan awal", nl_subtitle: "Hoe het ervoor stond",
    en_text: "Budi had been leading his team for six months. On paper, everything looked right — seven people from five different islands, all skilled, all committed. But Budi had noticed a pattern. In meetings, one team member — Roni, from Manado — would lean forward, challenge assumptions, push back on decisions in front of everyone. Budi said nothing. In Javanese culture, you do not embarrass someone publicly. You give space. You wait. He kept waiting.",
    id_text: "Budi sudah memimpin timnya selama enam bulan. Di atas kertas, semuanya terlihat baik — tujuh orang dari lima pulau berbeda, semua berkompeten, semua berkomitmen. Namun Budi sudah memperhatikan sebuah pola. Dalam rapat-rapat, satu anggota tim — Roni, dari Manado — selalu condong ke depan, mempertanyakan asumsi, mendorong balik keputusan di hadapan semua orang. Budi diam saja. Dalam budaya Jawa, kamu tidak mempermalukan seseorang di depan umum. Kamu memberi ruang. Kamu menunggu. Dia terus menunggu.",
    nl_text: "Budi leidde zijn team al zes maanden. Op papier zag alles er goed uit — zeven mensen van vijf verschillende eilanden, allemaal capabel, allemaal betrokken. Maar Budi had een patroon opgemerkt. In vergaderingen leunde een teamlid — Roni, uit Manado — altijd naar voren, stelde aannames ter discussie, drukte openlijk terug op beslissingen. Budi zei niets. In de Javaanse cultuur stel je iemand niet publiekelijk in verlegenheid. Je geeft ruimte. Je wacht. Hij bleef wachten.",
    en_pause: "Pause. Think of a team you have led or been part of. Who brought a different cultural communication style that you found difficult to read?",
    id_pause: "Berhenti sejenak. Pikirkan tim yang pernah Anda pimpin atau ikuti. Siapa yang membawa gaya komunikasi budaya berbeda yang sulit Anda baca?",
    nl_pause: "Pauze. Denk aan een team dat je hebt geleid of waarbij je betrokken was. Wie bracht een andere culturele communicatiestijl mee die je moeilijk kon lezen?",
  },
  {
    number: "II",
    en_label: "Conflict", id_label: "Konflik", nl_label: "Conflict",
    en_subtitle: "What changed", id_subtitle: "Apa yang berubah", nl_subtitle: "Wat er veranderde",
    en_text: "Three weeks before the project deadline, Budi quietly reassigned one of Roni's key tasks without explanation. He told himself it was a practical decision. It was not. It was avoidance. When Roni found out — through a colleague — he walked into the next team meeting with the kind of silence that is louder than anything. Halfway through, he asked: \"Why was my task given away?\" The room went still. Budi gave a careful, indirect answer that said nothing. Roni left before the meeting ended. That night, Budi drafted an email. Then deleted it. Then drafted it again.",
    id_text: "Tiga minggu sebelum tenggat proyek, Budi diam-diam memindahkan salah satu tugas utama Roni tanpa penjelasan apa pun. Ia berkata pada dirinya sendiri bahwa ini adalah keputusan praktis. Itu bukan. Itu adalah penghindaran. Ketika Roni mengetahuinya — melalui seorang rekan — ia masuk ke rapat tim berikutnya dengan keheningan yang lebih keras dari kata-kata apa pun. Di tengah rapat, ia bertanya: \"Mengapa tugas saya diberikan ke orang lain?\" Ruangan hening. Budi memberikan jawaban yang hati-hati dan tidak langsung, yang tidak mengatakan apa-apa. Roni pergi sebelum rapat selesai. Malam itu, Budi menulis email. Lalu menghapusnya. Lalu menulis lagi.",
    nl_text: "Drie weken voor de projectdeadline wees Budi stilletjes een van Roni's kerntaken toe aan iemand anders, zonder uitleg. Hij vertelde zichzelf dat het een praktische beslissing was. Dat was het niet. Het was vermijding. Toen Roni het te weten kwam — via een collega — liep hij de volgende teamvergadering in met de soort stilte die luider is dan welke woorden ook. Halverwege vroeg hij: \"Waarom is mijn taak weggegeven?\" De kamer verstomde. Budi gaf een voorzichtig, indirect antwoord dat niets zei. Roni vertrok voordat de vergadering was afgelopen. Die avond schreef Budi een e-mail. Verwijderde hem. Schreef hem opnieuw.",
    en_pause: "Pause. Have you ever avoided a difficult conversation the way Budi did? What drove the avoidance — and what did it cost?",
    id_pause: "Berhenti sejenak. Pernahkah Anda menghindari percakapan sulit seperti yang dilakukan Budi? Apa yang mendorong penghindaran itu — dan apa yang harus dibayar?",
    nl_pause: "Pauze. Heb je ooit een moeilijk gesprek vermeden zoals Budi deed? Wat dreef die vermijding — en wat kostte het?",
  },
  {
    number: "III",
    en_label: "Climax", id_label: "Klimaks", nl_label: "Climax",
    en_subtitle: "The turn", id_subtitle: "Titik balik", nl_subtitle: "Het keerpunt",
    en_text: "He remembered a story his grandfather used to tell — about two rivers coming down from different mountains. Where they met, the currents seemed to fight. But it was in that collision that the valley below became the most fertile land for miles. His grandfather had told it not as a lesson but as an observation. Budi put down the email draft. The next morning, he walked over to Roni before the team arrived. \"Can I tell you a story?\" he asked. He told the story of the two rivers. Then: \"I reassigned your task because I was afraid to tell you I had concerns about the timeline. I should have come to you directly. I'm sorry.\" Roni was quiet for a moment. Then: \"In my culture, we say what we mean because we believe the other person can handle the truth. That is how we show respect.\"",
    id_text: "Ia teringat sebuah cerita yang sering diceritakan kakeknya — tentang dua sungai yang mengalir turun dari gunung yang berbeda. Di tempat pertemuan mereka, arus-arusnya tampak saling bertentangan. Namun justru di benturan itulah lembah di bawahnya menjadi tanah yang paling subur sejauh mata memandang. Kakeknya tidak menceritakannya sebagai pelajaran, melainkan sebagai pengamatan. Budi meletakkan draf emailnya. Keesokan paginya, ia menghampiri Roni sebelum anggota tim lain datang. \"Boleh saya ceritakan sebuah kisah?\" tanyanya. Ia menceritakan kisah dua sungai itu. Lalu: \"Saya memindahkan tugasmu karena saya takut untuk mengatakan bahwa saya punya kekhawatiran soal jadwal. Seharusnya saya datang langsung kepadamu. Maafkan saya.\" Roni terdiam sejenak. Kemudian: \"Di budaya kami, kami mengatakan apa yang kami maksud karena kami percaya orang lain mampu menanggung kebenaran. Itulah cara kami menunjukkan rasa hormat.\"",
    nl_text: "Hij herinnerde zich een verhaal dat zijn grootvader altijd vertelde — over twee rivieren die van verschillende bergen afdaalden. Waar ze samenkwamen, leken de stromingen te botsen. Maar juist in die botsing werd de vallei eronder de vruchtbaarste grond voor kilometers in de omtrek. Zijn grootvader had het niet als les verteld, maar als observatie. Budi legde het e-mailconcept neer. De volgende ochtend liep hij naar Roni voordat de rest aankwam. \"Mag ik je een verhaal vertellen?\" vroeg hij. Hij vertelde het verhaal van de twee rivieren. Dan: \"Ik heb jouw taak overgeheveld omdat ik bang was om te zeggen dat ik zorgen had over de tijdlijn. Ik had direct naar jou toe moeten komen. Het spijt me.\" Roni zweeg een moment. Dan: \"In onze cultuur zeggen we wat we bedoelen omdat we geloven dat de ander de waarheid aankan. Zo tonen we respect.\"",
    en_pause: "Pause. Is there a person or situation in your leadership right now where a story might reach further than a direct explanation?",
    id_pause: "Berhenti sejenak. Apakah ada seseorang atau situasi dalam kepemimpinan Anda saat ini di mana sebuah cerita bisa menjangkau lebih jauh daripada penjelasan langsung?",
    nl_pause: "Pauze. Is er een persoon of situatie in jouw leiderschap nu waarbij een verhaal verder zou reiken dan een directe uitleg?",
  },
  {
    number: "IV",
    en_label: "Conclusion", id_label: "Kesimpulan", nl_label: "Conclusie",
    en_subtitle: "What it meant", id_subtitle: "Apa artinya", nl_subtitle: "Wat het betekende",
    en_text: "Something shifted after that conversation. Budi began opening team meetings with a short story — sometimes from Scripture, sometimes from a memory, sometimes borrowed from someone else's life. Roni started doing the same. The team that had nearly fractured became the most cohesive group in the organisation — not because they all became the same, but because they found a common medium. Stories had done what a memo, a policy, or a confrontation never could: they had made a path between two different ways of being human.",
    id_text: "Ada yang berubah setelah percakapan itu. Budi mulai membuka rapat tim dengan cerita singkat — kadang dari Alkitab, kadang dari ingatan, kadang dipinjam dari kehidupan orang lain. Roni pun mulai melakukan hal yang sama. Tim yang hampir retak itu menjadi kelompok paling solid di organisasi — bukan karena mereka semua menjadi sama, melainkan karena mereka menemukan bahasa yang sama. Cerita telah melakukan apa yang memo, kebijakan, atau konfrontasi tak pernah bisa: membuat jalan antara dua cara berbeda untuk menjadi manusia.",
    nl_text: "Er veranderde iets na dat gesprek. Budi begon teamvergaderingen te openen met een kort verhaal — soms uit de Bijbel, soms uit een herinnering, soms geleend uit iemand anders zijn leven. Roni begon hetzelfde te doen. Het team dat bijna uiteen was gevallen werd de meest hechte groep in de organisatie — niet omdat ze allemaal hetzelfde werden, maar omdat ze een gemeenschappelijk medium hadden gevonden. Verhalen hadden gedaan wat een memo, een beleid of een confrontatie nooit kon: een pad maken tussen twee verschillende manieren van mens-zijn.",
    en_pause: "", id_pause: "", nl_pause: "",
  },
];

const CRAFT_ELEMENTS = [
  { number: "01", en_title: "Context", id_title: "Konteks", nl_title: "Context", en_desc: "Set the scene. What was normal before the disruption? Without this ground, conflict means nothing — there is no baseline to return to.", id_desc: "Atur latar. Apa yang normal sebelum gangguan terjadi? Tanpa dasar ini, konflik tidak berarti apa-apa — tidak ada garis dasar untuk kembali.", nl_desc: "Stel de scène. Wat was normaal vóór de verstoring? Zonder deze basis betekent conflict niets — er is geen basislijn om naar terug te keren." },
  { number: "02", en_title: "Conflict", id_title: "Konflik", nl_title: "Conflict", en_desc: "Something disrupts the normal. Without conflict, there is no story — only a report. Conflict is not negative; it is the engine of meaning.", id_desc: "Sesuatu mengganggu yang normal. Tanpa konflik, tidak ada cerita — hanya laporan. Konflik tidak negatif; itu adalah mesin makna.", nl_desc: "Iets verstoort het normale. Zonder conflict is er geen verhaal — alleen een rapport. Conflict is niet negatief; het is de motor van betekenis." },
  { number: "03", en_title: "Climax", id_title: "Klimaks", nl_title: "Climax", en_desc: "The pivot point — a decision, revelation, or action that breaks the tension. This moment carries the emotional weight that makes people lean in.", id_desc: "Titik balik — keputusan, wahyu, atau tindakan yang memecahkan ketegangan. Momen ini membawa bobot emosional yang membuat orang tertarik.", nl_desc: "Het keerpunt — een beslissing, openbaring of actie die de spanning breekt. Dit moment draagt het emotionele gewicht dat mensen doet opletten." },
  { number: "04", en_title: "Conclusion", id_title: "Kesimpulan", nl_title: "Conclusie", en_desc: "Make meaning explicit. What changed? What was learned? Without a conclusion, a story is entertainment. With one, it forms.", id_desc: "Buat makna menjadi eksplisit. Apa yang berubah? Apa yang dipelajari? Tanpa kesimpulan, cerita hanya hiburan. Dengan kesimpulan, cerita membentuk.", nl_desc: "Maak betekenis expliciet. Wat veranderde? Wat werd geleerd? Zonder conclusie is een verhaal vermaak. Met een conclusie vormt het." },
];

const STORY_TYPES = [
  { id: "origin", en_title: "Origin", id_title: "Asal Usul", nl_title: "Herkomst", en_desc: "Why does this team, mission, or organisation exist? What was the founding moment or call? This story anchors identity and reminds people why they signed up.", id_desc: "Mengapa tim, misi, atau organisasi ini ada? Apa momen pendiri atau panggilan? Cerita ini menghangat identitas dan mengingatkan orang mengapa mereka bergabung.", nl_desc: "Waarom bestaat dit team, deze missie of organisatie? Wat was het oprichtingsmoment of de roeping? Dit verhaal verankert identiteit en herinnert mensen waarom ze zich aansloten." },
  { id: "failure", en_title: "Failure", id_title: "Kegagalan", nl_title: "Mislukking", en_desc: "A story of what went wrong — and what you learned. Vulnerability creates trust. The leader who never admits failure is perceived as dishonest, not strong.", id_desc: "Cerita tentang apa yang berjalan salah — dan apa yang Anda pelajari. Kerentanan menciptakan kepercayaan. Pemimpin yang tidak pernah mengakui kegagalan dianggap tidak jujur, bukan kuat.", nl_desc: "Een verhaal van wat misging — en wat je leerde. Kwetsbaarheid creëert vertrouwen. De leider die nooit een mislukking toegeeft wordt als oneerlijk gezien, niet als sterk." },
  { id: "vision", en_title: "Vision", id_title: "Visi", nl_title: "Visie", en_desc: "A picture of the future so vivid people can feel it. Not a mission statement — a narrative: 'Imagine it is 2030, and this is what we see...' Vision stories create movement; mission statements create obligation.", id_desc: "Gambaran masa depan yang begitu jelas sehingga orang bisa merasakannya. Bukan pernyataan misi — sebuah narasi: 'Bayangkan tahun 2030, dan inilah yang kita lihat...' Cerita visi menciptakan gerakan; pernyataan misi menciptakan kewajiban.", nl_desc: "Een beeld van de toekomst zo levendig dat mensen het kunnen voelen. Geen missie-statement — een narratief: 'Stel je voor dat het 2030 is, en dit is wat we zien...' Visieverhalen creëren beweging; mission statements creëren verplichtingen." },
  { id: "transformation", en_title: "Transformation", id_title: "Transformasi", nl_title: "Transformatie", en_desc: "A story about someone who changed — a team member, a person served, a community impacted. These stories prove the work matters and provide evidence that it is worth the cost.", id_desc: "Cerita tentang seseorang yang berubah — anggota tim, orang yang dilayani, komunitas yang terdampak. Cerita-cerita ini membuktikan bahwa pekerjaan itu penting dan memberikan bukti bahwa ini sepadan.", nl_desc: "Een verhaal over iemand die veranderde — een teamlid, een gediend persoon, een beïnvloede gemeenschap. Deze verhalen bewijzen dat het werk ertoe doet en leveren bewijs dat het de kosten waard is." },
  { id: "teaching", en_title: "Teaching", id_title: "Pengajaran", nl_title: "Onderwijzing", en_desc: "A story that carries a principle. People retain story-based teaching seven times better than abstract instruction. If you want people to remember your lesson — give it a plot.", id_desc: "Cerita yang membawa prinsip. Orang mengingat pengajaran berbasis cerita tujuh kali lebih baik daripada instruksi abstrak. Jika Anda ingin orang mengingat pelajaran Anda — berikan alur cerita.", nl_desc: "Een verhaal dat een principe draagt. Mensen onthouden verhaalgebaseerd onderwijs zeven keer beter dan abstracte instructie. Als je wilt dat mensen je les onthouden — geef het een verhaallijn." },
];

const VERSES = {
  "matt-13-34": {
    en_ref: "Matthew 13:34", id_ref: "Matius 13:34", nl_ref: "Mattheüs 13:34",
    en: "Jesus spoke all these things to the crowd in parables; he did not say anything to them without using a parable.",
    id: "Semuanya itu disampaikan Yesus kepada orang banyak dalam perumpamaan, dan tanpa perumpamaan suatupun tidak disampaikan-Nya kepada mereka.",
    nl: "Dit alles vertelde Jezus de menigte in gelijkenissen; zonder gelijkenissen vertelde hij hun niets.",
  },
  "ps-78-2": {
    en_ref: "Psalm 78:2", id_ref: "Mazmur 78:2", nl_ref: "Psalm 78:2",
    en: "I will open my mouth with a parable; I will utter hidden things, things from of old—",
    id: "aku mau membuka mulutku dengan amsal, aku mau mengucapkan teka-teki dari zaman purbakala,",
    nl: "Ik open mijn mond voor een gelijkenis, ik onthul raadsels uit het verleden.",
  },
};

const REFLECTIONS = [
  { roman: "I", en: "Which of the five story types is most absent from your leadership right now?", id: "Jenis cerita mana dari lima jenis yang paling absen dalam kepemimpinan Anda saat ini?", nl: "Welk van de vijf soorten verhalen ontbreekt momenteel het meest in jouw leiderschap?" },
  { roman: "II", en: "What failure story do you carry that could build trust with your team, if you were willing to tell it?", id: "Cerita kegagalan apa yang Anda bawa yang bisa membangun kepercayaan dengan tim Anda, jika Anda bersedia menceritakannya?", nl: "Welk mislukkingsverhaal draag je dat vertrouwen zou kunnen opbouwen met je team, als je het bereid was te vertellen?" },
  { roman: "III", en: "How does your cultural background shape which stories feel natural to tell — and which feel dangerous?", id: "Bagaimana latar belakang budaya Anda membentuk cerita apa yang terasa alami untuk diceritakan — dan mana yang terasa berbahaya?", nl: "Hoe vormt jouw culturele achtergrond welke verhalen natuurlijk aanvoelen om te vertellen — en welke gevaarlijk voelen?" },
  { roman: "IV", en: "Jesus never taught without a story. What does his deliberate method tell you about how people actually change?", id: "Yesus tidak pernah mengajar tanpa cerita. Apa yang metode sengaja-Nya katakan kepada Anda tentang bagaimana orang benar-benar berubah?", nl: "Jezus gaf nooit les zonder een verhaal. Wat vertelt zijn bewuste methode je over hoe mensen werkelijk veranderen?" },
  { roman: "V", en: "What story from your life is most worth telling — and who most needs to hear it?", id: "Cerita apa dari hidup Anda yang paling layak diceritakan — dan siapa yang paling perlu mendengarnya?", nl: "Welk verhaal uit jouw leven is het meest de moeite waard om te vertellen — en wie heeft het het meest nodig om het te horen?" },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function StorytellingLeadershipClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [activeType, setActiveType] = useState("origin");
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  const [showReflection, setShowReflection] = useState(false);
  const [commitment, setCommitment] = useState("");
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("storytelling-leadership");
      setSaved(true);
    });
  }

  const navy = "oklch(22% 0.10 260)";
  const orange = "oklch(65% 0.15 45)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const bodyText = "oklch(38% 0.05 260)";
  const warmCream = "oklch(96% 0.015 65)";

  const selectedType = STORY_TYPES.find((s) => s.id === activeType)!;

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>
      <LangToggle />

      {/* Language toggle */}

      {/* Hero */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px 56px" }}>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: orange, textTransform: "uppercase", marginBottom: 20 }}>
          {t("Leadership · Guide", "Kepemimpinan · Panduan", "Leiderschap · Gids")}
        </p>
        <h1 style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(44px, 6vw, 72px)", fontWeight: 600, color: navy, lineHeight: 1.1, margin: "0 0 28px" }}>
          {t("Every leader needs a story.", "Setiap pemimpin butuh sebuah cerita.", "Elke leider heeft een verhaal nodig.")}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 22, color: bodyText, lineHeight: 1.75, fontStyle: "italic", maxWidth: 580, margin: 0 }}>
          {t(
            "Not a framework. Not a slide. A story — told well — can do what no memo, policy, or presentation ever could.",
            "Bukan kerangka kerja. Bukan slide. Sebuah cerita — yang diceritakan dengan baik — dapat melakukan apa yang tidak bisa dilakukan memo, kebijakan, atau presentasi mana pun.",
            "Geen framework. Geen slide. Een verhaal — goed verteld — kan doen wat geen memo, beleid of presentatie ooit kon."
          )}
        </p>
      </div>

      {/* Story preface */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px 40px" }}>
        <div style={{ borderTop: "1px solid oklch(88% 0.01 80)", paddingTop: 32 }}>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: orange, textTransform: "uppercase", margin: 0 }}>
            {t("Before the lesson — the story", "Sebelum pelajaran — ceritanya", "Vóór de les — het verhaal")}
          </p>
        </div>
      </div>

      {/* Story chapters */}
      {STORY_CHAPTERS.map((chapter, i) => {
        const chapterText = lang === "en" ? chapter.en_text : lang === "id" ? chapter.id_text : chapter.nl_text;
        const chapterLabel = lang === "en" ? chapter.en_label : lang === "id" ? chapter.id_label : chapter.nl_label;
        const chapterSubtitle = lang === "en" ? chapter.en_subtitle : lang === "id" ? chapter.id_subtitle : chapter.nl_subtitle;
        const pauseText = lang === "en" ? chapter.en_pause : lang === "id" ? chapter.id_pause : chapter.nl_pause;
        return (
          <div key={i} style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginBottom: 24 }}>
              <span style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 72, fontWeight: 600, color: orange, lineHeight: 1 }}>{chapter.number}</span>
              <div>
                <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: orange, textTransform: "uppercase" }}>{chapterLabel}</div>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 20, color: bodyText, fontStyle: "italic" }}>{chapterSubtitle}</div>
              </div>
            </div>
            <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 20, lineHeight: 1.9, color: navy, marginBottom: pauseText ? 48 : 72 }}>
              {chapterText}
            </p>
            {pauseText && (
              <div style={{ background: warmCream, borderRadius: 8, padding: "28px 32px", marginBottom: 72 }}>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: orange, textTransform: "uppercase", marginBottom: 12 }}>
                  {t("✦  Pause", "✦  Berhenti sejenak", "✦  Pauze")}
                </p>
                <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 19, lineHeight: 1.75, color: bodyText, fontStyle: "italic", margin: 0 }}>
                  {pauseText}
                </p>
              </div>
            )}
          </div>
        );
      })}

      {/* The Craft — structure reveal on navy */}
      <div style={{ background: navy, padding: "72px 24px", marginTop: 16 }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: orange, textTransform: "uppercase", marginBottom: 16 }}>
            {t("The craft", "Keahliannya", "Het vakmanschap")}
          </p>
          <h2 style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: offWhite, lineHeight: 1.2, marginBottom: 56 }}>
            {t("You just experienced this structure.", "Anda baru saja mengalami struktur ini.", "Je hebt deze structuur zojuist ervaren.")}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 40 }}>
            {CRAFT_ELEMENTS.map((el) => {
              const title = lang === "en" ? el.en_title : lang === "id" ? el.id_title : el.nl_title;
              const desc = lang === "en" ? el.en_desc : lang === "id" ? el.id_desc : el.nl_desc;
              return (
                <div key={el.number}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 14 }}>
                    <span style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 44, fontWeight: 600, color: orange, lineHeight: 1 }}>{el.number}</span>
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: offWhite, letterSpacing: "0.1em", textTransform: "uppercase" }}>{title}</span>
                  </div>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, lineHeight: 1.65, color: "oklch(78% 0.04 260)", margin: 0 }}>{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Story types */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "72px 24px" }}>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: orange, textTransform: "uppercase", marginBottom: 16 }}>
          {t("Five stories every leader needs", "Lima cerita yang dibutuhkan setiap pemimpin", "Vijf verhalen die elke leider nodig heeft")}
        </p>
        <h2 style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 600, color: navy, lineHeight: 1.2, marginBottom: 40 }}>
          {t("Not every story serves the same purpose.", "Tidak setiap cerita melayani tujuan yang sama.", "Niet elk verhaal dient hetzelfde doel.")}
        </h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
          {STORY_TYPES.map((type) => {
            const label = lang === "en" ? type.en_title : lang === "id" ? type.id_title : type.nl_title;
            const isActive = activeType === type.id;
            return (
              <button key={type.id} onClick={() => setActiveType(type.id)} style={{
                padding: "8px 22px", borderRadius: 24, cursor: "pointer",
                fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600,
                border: `2px solid ${isActive ? navy : "oklch(82% 0.02 260)"}`,
                background: isActive ? navy : "transparent",
                color: isActive ? offWhite : bodyText,
              }}>{label}</button>
            );
          })}
        </div>
        <div style={{ background: lightGray, borderRadius: 12, padding: "32px 36px" }}>
          <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 24, fontWeight: 600, color: navy, marginBottom: 16 }}>
            {lang === "en" ? selectedType.en_title : lang === "id" ? selectedType.id_title : selectedType.nl_title}{" "}
            <span style={{ fontStyle: "italic", fontWeight: 400, color: bodyText }}>{t("story", "cerita", "verhaal")}</span>
          </p>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 15, lineHeight: 1.75, color: bodyText, margin: 0 }}>
            {lang === "en" ? selectedType.en_desc : lang === "id" ? selectedType.id_desc : selectedType.nl_desc}
          </p>
        </div>
      </div>

      {/* Biblical foundation */}
      <div style={{ background: lightGray, padding: "72px 24px", borderTop: `3px solid ${orange}` }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: orange, textTransform: "uppercase", marginBottom: 24 }}>
            {t("Biblical foundation", "Dasar alkitabiah", "Bijbels fundament")}
          </p>
          <h2 style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 600, color: navy, lineHeight: 1.15, marginBottom: 32 }}>
            {t("Jesus never taught without a story.", "Yesus tidak pernah mengajar tanpa cerita.", "Jezus gaf nooit les zonder een verhaal.")}
          </h2>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 15, lineHeight: 1.85, color: bodyText, marginBottom: 20 }}>
            {t(
              "Matthew 13:34 is unambiguous: he did not say anything to the crowds without using a parable. This was not a communication style — it was a method. The greatest teacher who ever lived chose story as his primary vehicle for truth. Not lectures. Not principles. Not three-point outlines. Stories.",
              "Matius 13:34 tidak ambigu: Ia tidak mengatakan apa pun kepada orang banyak tanpa menggunakan perumpamaan. Ini bukan gaya komunikasi — ini adalah metode. Guru terbesar yang pernah hidup memilih cerita sebagai kendaraan utama untuk kebenaran. Bukan kuliah. Bukan prinsip. Bukan garis besar tiga poin. Cerita.",
              "Mattheüs 13:34 is ondubbelzinnig: hij vertelde de menigten niets zonder gelijkenissen te gebruiken. Dit was geen communicatiestijl — het was een methode. De grootste leraar die ooit heeft geleefd koos verhalen als zijn primaire voertuig voor waarheid. Geen lezingen. Geen principes. Geen driedelige schema's. Verhalen."
            )}
          </p>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 15, lineHeight: 1.85, color: bodyText, marginBottom: 40 }}>
            {t(
              "The Prodigal Son doesn't argue for forgiveness — it creates a felt experience of it. The Good Samaritan doesn't define 'neighbour' — it forces you to become one. Nathan's story to David ('There was a man who had a lamb...') bypassed a king's defences and reached a conscience that direct accusation never could. Story is not a soft tool. In the right hands, it is the sharpest thing available.",
              "Anak yang Hilang tidak berargumen tentang pengampunan — ia menciptakan pengalaman yang terasa tentangnya. Orang Samaria yang Baik tidak mendefinisikan 'sesama' — ia memaksamu untuk menjadi satu. Cerita Natan kepada Daud ('Ada seorang laki-laki yang mempunyai domba...') melewati pertahanan seorang raja dan mencapai hati nurani yang tidak pernah bisa dicapai oleh tuduhan langsung. Cerita bukan alat yang lemah. Di tangan yang tepat, itu adalah hal paling tajam yang tersedia.",
              "De Verloren Zoon betoogt niet voor vergeving — het creëert een gevoelde ervaring ervan. De Barmhartige Samaritaan definieert 'naaste' niet — het dwingt je er één van te worden. Nathans verhaal aan David ('Er was een man die een lam had...') omzeilde de verdedigingen van een koning en bereikte een geweten dat directe beschuldiging nooit kon bereiken. Verhaal is geen zacht gereedschap. In de juiste handen is het het scherpste wat beschikbaar is."
            )}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {(["matt-13-34", "ps-78-2"] as const).map((key) => {
              const v = VERSES[key];
              const ref = lang === "en" ? v.en_ref : lang === "id" ? v.id_ref : v.nl_ref;
              return (
                <button key={key} onClick={() => setActiveVerse(key)} style={{
                  background: "none", border: `2px solid ${orange}`, cursor: "pointer",
                  color: orange, fontWeight: 700, fontFamily: "Montserrat, sans-serif",
                  fontSize: 13, padding: "8px 20px", borderRadius: 6,
                }}>{ref}</button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Your story */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "72px 24px" }}>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: orange, textTransform: "uppercase", marginBottom: 24 }}>
          {t("Your story", "Ceritamu", "Jouw verhaal")}
        </p>
        <h2 style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 600, color: navy, lineHeight: 1.2, marginBottom: 24 }}>
          {t("Now it is your turn.", "Sekarang giliranmu.", "Nu is het jouw beurt.")}
        </h2>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 20, color: bodyText, lineHeight: 1.8, fontStyle: "italic", marginBottom: 40 }}>
          {t(
            "Write the opening sentence of a story your team needs to hear. Not a lesson. Not a principle. One sentence — where were you, and what was happening?",
            "Tulis kalimat pembuka dari sebuah cerita yang perlu didengar oleh timmu. Bukan pelajaran. Bukan prinsip. Satu kalimat — di mana Anda, dan apa yang terjadi?",
            "Schrijf de openingszin van een verhaal dat jouw team moet horen. Geen les. Geen principe. Één zin — waar was je, en wat was er aan de hand?"
          )}
        </p>
        <textarea
          value={commitment}
          onChange={(e) => setCommitment(e.target.value)}
          placeholder={t(
            "It was the third week of the project, and...",
            "Itu adalah minggu ketiga proyek, dan...",
            "Het was de derde week van het project, en..."
          )}
          rows={4}
          style={{
            width: "100%", boxSizing: "border-box", padding: "20px 24px",
            fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 20, lineHeight: 1.7,
            color: navy, background: offWhite, border: `2px solid oklch(85% 0.02 260)`,
            borderRadius: 8, resize: "vertical", outline: "none",
          }}
        />
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "oklch(68% 0.03 260)", marginTop: 12, fontStyle: "italic" }}>
          {t("Your words stay here. This is for you alone.", "Kata-katamu tetap di sini. Ini untukmu saja.", "Jouw woorden blijven hier. Dit is voor jou alleen.")}
        </p>
      </div>

      {/* Reflection — collapsible */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px 80px" }}>
        <button onClick={() => setShowReflection(!showReflection)} style={{
          background: "none", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif",
          fontSize: 13, fontWeight: 700, color: navy, letterSpacing: "0.06em",
          display: "flex", alignItems: "center", gap: 10, padding: 0,
        }}>
          <span style={{ fontSize: 20, transform: showReflection ? "rotate(90deg)" : "none", display: "inline-block", transition: "transform 0.2s", lineHeight: 1 }}>›</span>
          {t("Dig deeper — reflection questions", "Gali lebih dalam — pertanyaan refleksi", "Dieper gaan — reflectievragen")}
        </button>
        {showReflection && (
          <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 28 }}>
            {REFLECTIONS.map((r) => {
              const q = lang === "en" ? r.en : lang === "id" ? r.id : r.nl;
              return (
                <div key={r.roman} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 24, color: orange, fontWeight: 600, minWidth: 28, lineHeight: 1 }}>{r.roman}</span>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 15, lineHeight: 1.7, color: bodyText, margin: 0 }}>{q}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Save + back */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 24px 80px", borderTop: `1px solid oklch(88% 0.01 80)`, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={handleSave} disabled={saved || isPending} style={{
          padding: "12px 32px", background: saved ? "oklch(88% 0.01 80)" : navy,
          color: saved ? bodyText : offWhite, border: "none", borderRadius: 6,
          cursor: saved ? "default" : "pointer", fontFamily: "Montserrat, sans-serif",
          fontWeight: 700, fontSize: 14,
        }}>
          {saved
            ? t("✓ Saved to Dashboard", "✓ Tersimpan di Dashboard", "✓ Opgeslagen in Dashboard")
            : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
        </button>
        <Link href="/resources" style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: bodyText, textDecoration: "none", fontWeight: 600 }}>
          ← {t("Content Library", "Perpustakaan Konten", "Contentbibliotheek")}
        </Link>
      </div>

      {/* Verse popup */}
      {activeVerse && (() => {
        const v = VERSES[activeVerse as keyof typeof VERSES];
        const ref = lang === "en" ? v.en_ref : lang === "id" ? v.id_ref : v.nl_ref;
        const text = lang === "en" ? v.en : lang === "id" ? v.id : v.nl;
        const translation = lang === "id" ? "TB" : lang === "nl" ? "NBV" : "NIV";
        return (
          <div onClick={() => setActiveVerse(null)} style={{
            position: "fixed", inset: 0, background: "oklch(10% 0.05 260 / 0.6)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24,
          }}>
            <div onClick={(e) => e.stopPropagation()} style={{
              background: offWhite, borderRadius: 16, padding: "40px 36px", maxWidth: 520, width: "100%",
            }}>
              <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 22, lineHeight: 1.65, color: navy, fontStyle: "italic", marginBottom: 16 }}>
                &ldquo;{text}&rdquo;
              </p>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, color: orange, letterSpacing: "0.08em" }}>
                — {ref} ({translation})
              </p>
              <button onClick={() => setActiveVerse(null)} style={{
                marginTop: 24, padding: "10px 24px", background: navy, color: offWhite,
                border: "none", borderRadius: 6, fontFamily: "Montserrat, sans-serif",
                fontWeight: 700, cursor: "pointer",
              }}>
                {t("Close", "Tutup", "Sluiten")}
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
