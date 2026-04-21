"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const storyStructure = [
  { number: "1", en_title: "Context — Where are we?", id_title: "Konteks — Di mana kita?", nl_title: "Context — Waar zijn we?", en_desc: "Set the scene. Establish what was normal before the story begins. This grounds the listener in a world they can inhabit. Without context, conflict means nothing — there is no baseline to return to.", id_desc: "Atur latar. Tetapkan apa yang normal sebelum cerita dimulai. Ini menempatkan pendengar di dunia yang dapat mereka huni. Tanpa konteks, konflik tidak berarti apa-apa — tidak ada garis dasar untuk kembali.", nl_desc: "Stel de scène. Bepaal wat normaal was voordat het verhaal begint. Dit verankert de luisteraar in een wereld die ze kunnen bewonen. Zonder context betekent conflict niets." },
  { number: "2", en_title: "Conflict — What changed?", id_title: "Konflik — Apa yang berubah?", nl_title: "Conflict — Wat veranderde er?", en_desc: "Something disrupted the normal. A challenge arose, a failure happened, a question was forced. Without conflict, there is no story — only a report. Conflict is not negative; it is the engine of meaning. It creates the tension that makes people lean in.", id_desc: "Sesuatu mengganggu yang normal. Tantangan muncul, kegagalan terjadi, pertanyaan dipaksa. Tanpa konflik, tidak ada cerita — hanya laporan. Konflik tidak negatif; itu adalah mesin makna.", nl_desc: "Iets verstoorde het normale. Er deed zich een uitdaging voor, een mislukking gebeurde, een vraag werd gedwongen. Zonder conflict is er geen verhaal — alleen een rapport. Conflict is niet negatief; het is de motor van betekenis." },
  { number: "3", en_title: "Climax — What happened next?", id_title: "Klimaks — Apa yang terjadi selanjutnya?", nl_title: "Climax — Wat gebeurde er daarna?", en_desc: "The moment of resolution or revelation. How was the tension broken? What decision was made? What turned? The climax is the moment your listeners most need to feel — it carries the emotional weight of the story and the pivot that leads to transformation.", id_desc: "Momen resolusi atau wahyu. Bagaimana ketegangan dipecahkan? Keputusan apa yang dibuat? Apa yang berubah? Klimaks adalah momen yang paling perlu dirasakan pendengar Anda.", nl_desc: "Het moment van oplossing of openbaring. Hoe werd de spanning gebroken? Welke beslissing werd genomen? Wat keerde? Het climax is het moment dat je luisteraars het meest moeten voelen." },
  { number: "4", en_title: "Conclusion — What does it mean?", id_title: "Kesimpulan — Apa artinya?", nl_title: "Conclusie — Wat betekent het?", en_desc: "Make the meaning explicit. What did you learn? What changed because of this? What do you want your listeners to carry away? Without a conclusion, stories are merely entertaining. With one, they become formative.", id_desc: "Buat maknanya eksplisit. Apa yang Anda pelajari? Apa yang berubah karena ini? Apa yang ingin Anda bawa pergi oleh pendengar Anda? Tanpa kesimpulan, cerita hanya menghibur.", nl_desc: "Maak de betekenis expliciet. Wat heb je geleerd? Wat veranderde hierdoor? Wat wil je dat je luisteraars meenemen? Zonder conclusie zijn verhalen slechts vermakelijk." },
];

const storyTypes = [
  { number: "1", en_title: "Origin story", id_title: "Cerita asal usul", nl_title: "Herkomstverhaal", en_desc: "Why does this team, organisation, or mission exist? What was the founding moment, need, or call? This story anchors identity and reminds people why they signed up.", id_desc: "Mengapa tim, organisasi, atau misi ini ada? Apa momen pendiri, kebutuhan, atau panggilan? Cerita ini menghangat identitas dan mengingatkan orang mengapa mereka mendaftar.", nl_desc: "Waarom bestaat dit team, organisatie of missie? Wat was het oprichtingsmoment, de behoefte of de roeping? Dit verhaal verankert identiteit en herinnert mensen waarom ze zich aansloten." },
  { number: "2", en_title: "Failure story", id_title: "Cerita kegagalan", nl_title: "Mislukkingsverhaal", en_desc: "A story of something that went wrong — and what you learned. Vulnerability creates trust, and trust is the precondition for everything else. The leader who never admits failure is perceived as dishonest, not strong.", id_desc: "Sebuah cerita tentang sesuatu yang berjalan salah — dan apa yang Anda pelajari. Kerentanan menciptakan kepercayaan, dan kepercayaan adalah prasyarat untuk segala sesuatu yang lain.", nl_desc: "Een verhaal van iets dat misging — en wat je hebt geleerd. Kwetsbaarheid creëert vertrouwen, en vertrouwen is de voorwaarde voor al het andere." },
  { number: "3", en_title: "Vision story", id_title: "Cerita visi", nl_title: "Visieverhaal", en_desc: "A picture of the future that is so vivid people can feel it. Not a mission statement — a story set in the future: 'Imagine it is 2030, and here is what we see...' Vision stories create movement; mission statements create obligation.", id_desc: "Gambaran masa depan yang begitu jelas sehingga orang bisa merasakannya. Bukan pernyataan misi — sebuah cerita yang ditetapkan di masa depan: 'Bayangkan tahun 2030, dan inilah yang kita lihat...'", nl_desc: "Een beeld van de toekomst dat zo levendig is dat mensen het kunnen voelen. Geen missie-statement — een verhaal in de toekomst gezet: 'Stel je voor dat het 2030 is, en dit is wat we zien...'" },
  { number: "4", en_title: "Transformation story", id_title: "Cerita transformasi", nl_title: "Transformatieverhaal", en_desc: "A story about someone who changed — a team member, a person served, a community impacted. These stories prove that the work matters. They provide evidence that what you are doing is worth the cost.", id_desc: "Sebuah cerita tentang seseorang yang berubah — anggota tim, orang yang dilayani, komunitas yang terdampak. Cerita-cerita ini membuktikan bahwa pekerjaan itu penting.", nl_desc: "Een verhaal over iemand die veranderde — een teamlid, een gediend persoon, een beïnvloede gemeenschap. Deze verhalen bewijzen dat het werk ertoe doet." },
  { number: "5", en_title: "Teaching story", id_title: "Cerita pengajaran", nl_title: "Leerverhaal", en_desc: "A story that carries a principle. Jesus rarely taught principles without a story. Research shows people retain story-based teaching seven times better than abstract instruction. If you want people to remember your lesson, give it a plot.", id_desc: "Sebuah cerita yang membawa prinsip. Yesus jarang mengajarkan prinsip tanpa cerita. Penelitian menunjukkan orang mengingat pengajaran berbasis cerita tujuh kali lebih baik.", nl_desc: "Een verhaal dat een principe draagt. Jezus leerde zelden principes zonder een verhaal. Onderzoek toont aan dat mensen verhaalgebaseerd onderwijs zeven keer beter onthouden." },
];

const reflectionQuestions = [
  { roman: "I", en: "What is your most compelling origin story as a leader? When did you know this was what you were called to?", id: "Apa cerita asal usul Anda yang paling menarik sebagai pemimpin? Kapan Anda tahu ini adalah yang Anda dipanggil untuk lakukan?", nl: "Wat is jouw meest overtuigende herkomstverhaal als leider? Wanneer wist je dat dit was waartoe je geroepen was?" },
  { roman: "II", en: "What failure story do you carry that could build trust and teach others, if you were willing to tell it?", id: "Cerita kegagalan apa yang Anda bawa yang bisa membangun kepercayaan dan mengajar orang lain, jika Anda bersedia menceritakannya?", nl: "Welk mislukkingsverhaal draag je dat vertrouwen zou kunnen opbouwen en anderen zou kunnen leren, als je het bereid was te vertellen?" },
  { roman: "III", en: "How does your cultural context shape the stories your team needs to hear — what resonates and what falls flat?", id: "Bagaimana konteks budaya Anda membentuk cerita yang perlu didengar tim Anda — apa yang beresonansi dan apa yang gagal?", nl: "Hoe vormt jouw culturele context de verhalen die je team moet horen — wat resoneert en wat vlak valt?" },
  { roman: "IV", en: "Can you tell a compelling vision story for your team right now — not as a slide, but as a narrative?", id: "Dapatkah Anda menceritakan cerita visi yang menarik untuk tim Anda saat ini — bukan sebagai slide, tetapi sebagai narasi?", nl: "Kun je nu een overtuigend visieverhaal voor je team vertellen — niet als dia, maar als narratief?" },
  { roman: "V", en: "How often do transformation stories — evidence that the work is working — get told in your community?", id: "Seberapa sering cerita transformasi — bukti bahwa pekerjaan berhasil — diceritakan dalam komunitas Anda?", nl: "Hoe vaak worden transformatieverhalen — bewijs dat het werk werkt — verteld in jouw gemeenschap?" },
  { roman: "VI", en: "Jesus was a master storyteller. What does his use of parable tell you about how people are moved toward truth?", id: "Yesus adalah pendongeng master. Apa yang penggunaan perumpamaan-Nya katakan kepada Anda tentang bagaimana orang-orang digerakkan menuju kebenaran?", nl: "Jezus was een meester-verteller. Wat vertelt zijn gebruik van gelijkenissen je over hoe mensen naar waarheid worden bewogen?" },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function StorytellingLeadershipClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("storytelling-leadership");
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
          {t("Communication", "Komunikasi", "Communicatie")}
        </p>
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: offWhite, margin: "0 auto 20px", maxWidth: 760, lineHeight: 1.15 }}>
          {t("Storytelling in Leadership", "Bercerita dalam Kepemimpinan", "Storytelling in Leiderschap")}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(85% 0.03 80)", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.6, fontStyle: "italic" }}>
          {t(
            '"Facts tell. Stories sell. But the right story transforms."',
            '"Fakta memberitahu. Cerita menjual. Tetapi cerita yang tepat mentransformasi."',
            '"Feiten vertellen. Verhalen verkopen. Maar het juiste verhaal transformeert."'
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
            "When a brain hears a story, something neurologically different happens compared to processing data. Mirror neurons fire — the listener's brain begins to simulate the experience being described. Cortisol (stress) and oxytocin (trust) are released. People don't just understand the story — they feel it.",
            "Ketika otak mendengar sebuah cerita, sesuatu yang berbeda secara neurologis terjadi dibandingkan memproses data. Neuron cermin menyala — otak pendengar mulai mensimulasikan pengalaman yang dijelaskan. Kortisol (stres) dan oksitosin (kepercayaan) dilepaskan.",
            "Wanneer een brein een verhaal hoort, gebeurt er neurologisch iets anders dan bij het verwerken van data. Spiegelneuronen vuren — het brein van de luisteraar begint de beschreven ervaring te simuleren. Cortisol (stress) en oxytocine (vertrouwen) worden vrijgelaten."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75 }}>
          {t(
            "Story is also the most cross-culturally transferable form of communication. Every human culture has story — it predates writing, it outlasts institutions, and it crosses language barriers in ways that logical argument rarely does. Leaders who learn to tell and collect stories become exponentially more effective.",
            "Cerita juga merupakan bentuk komunikasi yang paling dapat ditransfer secara lintas budaya. Setiap budaya manusia memiliki cerita — itu mendahului tulisan, bertahan lebih lama dari institusi, dan melampaui hambatan bahasa dengan cara yang jarang dilakukan argumen logis.",
            "Verhaal is ook de meest intercultureel overdraagbare vorm van communicatie. Elke menselijke cultuur heeft verhalen — het gaat aan schrijven vooraf, overleeft instituties en overstijgt taalbarrières op manieren die logische argumentatie zelden doet."
          )}
        </p>
      </div>

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 48, textAlign: "center" }}>
            {t("The 4-Part Story Structure", "Struktur Cerita 4 Bagian", "De 4-Delige Verhaalstructuur")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {storyStructure.map((s) => (
              <div key={s.number} style={{ background: offWhite, borderRadius: 12, padding: "32px 36px", display: "flex", gap: 28, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 52, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 40, flexShrink: 0 }}>{s.number}</div>
                <div>
                  <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 18, fontWeight: 700, color: navy, marginBottom: 10 }}>
                    {lang === "en" ? s.en_title : lang === "id" ? s.id_title : s.nl_title}
                  </h3>
                  <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                    {lang === "en" ? s.en_desc : lang === "id" ? s.id_desc : s.nl_desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
          {t("5 Types of Leadership Stories", "5 Jenis Cerita Kepemimpinan", "5 Soorten Leiderschapsverhalen")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {storyTypes.map((s) => (
            <div key={s.number} style={{ background: lightGray, borderRadius: 12, padding: "28px 32px", display: "flex", gap: 24, alignItems: "flex-start" }}>
              <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 52, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 36, flexShrink: 0 }}>{s.number}</div>
              <div>
                <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 17, fontWeight: 700, color: navy, marginBottom: 8 }}>
                  {lang === "en" ? s.en_title : lang === "id" ? s.id_title : s.nl_title}
                </h3>
                <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                  {lang === "en" ? s.en_desc : lang === "id" ? s.id_desc : s.nl_desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
            {t("Reflection Questions", "Pertanyaan Refleksi", "Reflectievragen")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {reflectionQuestions.map((q) => (
              <div key={q.roman} style={{ background: offWhite, borderRadius: 10, padding: "24px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 22, fontWeight: 700, color: orange, minWidth: 28, flexShrink: 0 }}>{q.roman}</div>
                <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                  {lang === "en" ? q.en : lang === "id" ? q.id : q.nl}
                </p>
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
        <Link href="/resources" style={{ display: "inline-block", padding: "14px 32px", background: orange, color: offWhite, borderRadius: 6, fontFamily: "Montserrat, sans-serif", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
          {t("Browse All Resources", "Jelajahi Semua Sumber", "Bekijk Alle Bronnen")}
        </Link>
      </div>
    </div>
  );
}
