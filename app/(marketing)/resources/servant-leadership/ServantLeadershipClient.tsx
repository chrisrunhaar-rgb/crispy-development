"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const characteristics = [
  { number: "1", en_title: "Listening", id_title: "Mendengarkan", nl_title: "Luisteren", en_desc: "Servant leaders prioritise listening deeply before speaking. They seek to understand the needs, concerns, and gifts of those they lead. In cross-cultural contexts, this means listening for what is said and what is not said.", id_desc: "Pemimpin pelayan memprioritaskan mendengarkan secara mendalam sebelum berbicara. Mereka berusaha memahami kebutuhan, kekhawatiran, dan karunia mereka yang dipimpin.", nl_desc: "Dienende leiders geven prioriteit aan diep luisteren voor ze spreken. Ze proberen de behoeften, zorgen en gaven te begrijpen van degenen die ze leiden." },
  { number: "2", en_title: "Empathy", id_title: "Empati", nl_title: "Empathie", en_desc: "Servant leaders accept and recognise people for their special and unique spirits — even when they may reject certain behaviours or performance. They assume the good intentions of those around them, even in conflict.", id_desc: "Pemimpin pelayan menerima dan mengakui orang karena semangat mereka yang khusus dan unik — bahkan ketika mereka mungkin menolak perilaku atau kinerja tertentu.", nl_desc: "Dienende leiders accepteren en erkennen mensen om hun bijzondere en unieke geest — zelfs wanneer ze bepaalde gedragingen of prestaties kunnen afwijzen." },
  { number: "3", en_title: "Healing", id_title: "Penyembuhan", nl_title: "Genezing", en_desc: "One of the great strengths of servant leadership is the potential for healing broken spirits and relationships. Many people come to organisations carrying past wounds. A servant leader creates space for restoration.", id_desc: "Salah satu kekuatan besar kepemimpinan pelayan adalah potensi untuk menyembuhkan semangat dan hubungan yang rusak. Banyak orang datang ke organisasi membawa luka masa lalu.", nl_desc: "Een van de grote krachten van dienend leiderschap is het potentieel voor genezing van gebroken geesten en relaties. Veel mensen komen naar organisaties met wonden uit het verleden." },
  { number: "4", en_title: "Awareness", id_title: "Kesadaran", nl_title: "Bewustzijn", en_desc: "General awareness — and especially self-awareness — strengthens the servant leader. It aids in understanding ethics, power, and values. It enables a leader to see situations from an integrated, holistic position.", id_desc: "Kesadaran umum — dan terutama kesadaran diri — memperkuat pemimpin pelayan. Ini membantu dalam memahami etika, kekuasaan, dan nilai-nilai.", nl_desc: "Algemeen bewustzijn — en vooral zelfbewustzijn — versterkt de dienende leider. Het helpt bij het begrijpen van ethiek, macht en waarden." },
  { number: "5", en_title: "Commitment to Growth", id_title: "Komitmen terhadap Pertumbuhan", nl_title: "Toewijding aan Groei", en_desc: "Servant leaders believe deeply that people have an intrinsic value beyond their tangible contributions as workers. They are committed to the personal, professional, and spiritual growth of every person in their care.", id_desc: "Pemimpin pelayan percaya bahwa orang memiliki nilai intrinsik di luar kontribusi nyata mereka sebagai pekerja. Mereka berkomitmen pada pertumbuhan pribadi, profesional, dan spiritual setiap orang.", nl_desc: "Dienende leiders geloven diep dat mensen intrinsieke waarde hebben buiten hun tastbare bijdragen als werkers. Ze zijn toegewijd aan de persoonlijke, professionele en spirituele groei van elke persoon." },
  { number: "6", en_title: "Building Community", id_title: "Membangun Komunitas", nl_title: "Gemeenschap Bouwen", en_desc: "Servant leaders seek to build community among those who work within institutions. They create belonging — not just performance. This is deeply resonant in most non-Western cultures where community identity precedes individual achievement.", id_desc: "Pemimpin pelayan berusaha membangun komunitas di antara mereka yang bekerja dalam institusi. Mereka menciptakan rasa memiliki — bukan hanya kinerja.", nl_desc: "Dienende leiders bouwen gemeenschap onder degenen die binnen instellingen werken. Ze creëren verbondenheid — niet alleen prestatie." },
];

const contrast = [
  { en_aspect: "Primary question", id_aspect: "Pertanyaan utama", nl_aspect: "Hoofdvraag", en_servant: "How can I help this person grow?", id_servant: "Bagaimana saya bisa membantu orang ini tumbuh?", nl_servant: "Hoe kan ik deze persoon helpen groeien?", en_trad: "How can this person help the organisation?", id_trad: "Bagaimana orang ini bisa membantu organisasi?", nl_trad: "Hoe kan deze persoon de organisatie helpen?" },
  { en_aspect: "Power is", id_aspect: "Kekuasaan adalah", nl_aspect: "Macht is", en_servant: "A responsibility to steward", id_servant: "Tanggung jawab untuk dikelola", nl_servant: "Een verantwoordelijkheid om te beheren", en_trad: "A privilege to exercise", id_trad: "Hak istimewa untuk dijalankan", nl_trad: "Een privilege om uit te oefenen" },
  { en_aspect: "Success looks like", id_aspect: "Kesuksesan terlihat seperti", nl_aspect: "Succes ziet eruit als", en_servant: "People flourishing and growing", id_servant: "Orang berkembang dan tumbuh", nl_servant: "Mensen die floreren en groeien", en_trad: "Targets hit, results delivered", id_trad: "Target tercapai, hasil diberikan", nl_trad: "Doelen gehaald, resultaten geleverd" },
];

const practices = [
  { number: "1", en: "Block time monthly for one-on-one development conversations — not performance reviews, but growth conversations.", id: "Blokir waktu setiap bulan untuk percakapan pengembangan satu-satu — bukan tinjauan kinerja, tetapi percakapan pertumbuhan.", nl: "Blokkeer maandelijks tijd voor één-op-één ontwikkelingsgesprekken — geen beoordelingen, maar groeigesprekken." },
  { number: "2", en: "Ask before assigning: 'What would you most love to contribute to this project?'", id: "Tanyakan sebelum menugaskan: 'Apa yang paling ingin Anda kontribusikan pada proyek ini?'", nl: "Vraag voordat je toewijst: 'Wat zou je het liefst willen bijdragen aan dit project?'" },
  { number: "3", en: "Take the difficult task yourself before delegating it — let your team see you serving.", id: "Ambil tugas yang sulit sendiri sebelum mendelegasikannya — biarkan tim Anda melihat Anda melayani.", nl: "Neem de moeilijke taak zelf op voordat je hem delegeert — laat je team je zien dienen." },
  { number: "4", en: "Remove obstacles for your team proactively — don't wait to be told something is blocking them.", id: "Hapus hambatan bagi tim Anda secara proaktif — jangan tunggu untuk diberitahu bahwa sesuatu menghalangi mereka.", nl: "Verwijder proactief obstakels voor je team — wacht niet tot ze je vertellen dat iets hen blokkeert." },
  { number: "5", en: "Celebrate other people's growth publicly — make their development visible and honoured.", id: "Rayakan pertumbuhan orang lain di depan umum — buat perkembangan mereka terlihat dan dihormati.", nl: "Vier de groei van anderen publiekelijk — maak hun ontwikkeling zichtbaar en geëerd." },
];

const reflectionQuestions = [
  { roman: "I", en: "Jesus washed his disciples' feet the night before his death. What does that tell you about the nature of true authority?", id: "Yesus membasuh kaki murid-muridnya malam sebelum kematiannya. Apa yang itu katakan kepada Anda tentang sifat otoritas sejati?", nl: "Jezus waste de voeten van zijn discipelen de avond voor zijn dood. Wat zegt dat je over de aard van echte autoriteit?" },
  { roman: "II", en: "Who in your team is least visible? What would serving them look like this week?", id: "Siapa dalam tim Anda yang paling tidak terlihat? Seperti apa melayani mereka minggu ini?", nl: "Wie in je team is het minst zichtbaar? Hoe zou het dienen van hen er deze week uitzien?" },
  { roman: "III", en: "In what areas does traditional leadership (power, control, results) still dominate your default responses?", id: "Di area mana kepemimpinan tradisional (kekuasaan, kontrol, hasil) masih mendominasi respons default Anda?", nl: "Op welke gebieden domineert traditioneel leiderschap (macht, controle, resultaten) nog steeds je standaardreacties?" },
  { roman: "IV", en: "How does the cultural context you lead in make servant leadership easier — or harder — to practice?", id: "Bagaimana konteks budaya yang Anda pimpin membuat kepemimpinan pelayan lebih mudah — atau lebih sulit — untuk dipraktikkan?", nl: "Hoe maakt de culturele context die je leidt dienend leiderschap gemakkelijker — of moeilijker — om te beoefenen?" },
  { roman: "V", en: "What would your team members say if asked: 'Does your leader serve you, or do you serve your leader?'", id: "Apa yang akan dikatakan anggota tim Anda jika ditanya: 'Apakah pemimpin Anda melayani Anda, atau Anda melayani pemimpin Anda?'", nl: "Wat zouden je teamleden zeggen als ze gevraagd worden: 'Dient je leider jou, of dien jij je leider?'" },
  { roman: "VI", en: "Where does your own need for recognition get in the way of genuine servant posture?", id: "Di mana kebutuhan Anda sendiri untuk pengakuan menghalangi sikap pelayan yang tulus?", nl: "Waar staat je eigen behoefte aan erkenning een echte dienende houding in de weg?" },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function ServantLeadershipClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
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
          {t("Kingdom Leadership", "Kepemimpinan Kerajaan", "Koninkrijksleiderschap")}
        </p>
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: offWhite, margin: "0 auto 20px", maxWidth: 760, lineHeight: 1.15 }}>
          {t("Servant Leadership", "Kepemimpinan Pelayan", "Dienend Leiderschap")}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(85% 0.03 80)", maxWidth: 680, margin: "0 auto 32px", lineHeight: 1.6, fontStyle: "italic" }}>
          {t(
            '"Whoever wants to become great among you must be your servant." — Mark 10:43',
            '"Barangsiapa ingin menjadi besar di antara kamu, hendaklah ia menjadi pelayanmu." — Markus 10:43',
            '"Wie groot wil worden onder u, moet uw dienaar zijn." — Marcus 10:43'
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
            "In Mark 10:42-45, Jesus redefines greatness completely. The Gentiles lord it over others — but among his followers, greatness is measured by service. The Son of Man came not to be served but to serve. This is not a metaphor for organisational culture; it is a direct command about the posture of leadership.",
            "Dalam Markus 10:42-45, Yesus mendefinisikan ulang kebesaran sepenuhnya. Orang-orang bukan Yahudi memerintah atas orang lain — tetapi di antara pengikut-Nya, kebesaran diukur dengan pelayanan.",
            "In Marcus 10:42-45 herdefiniëert Jezus grootheid volledig. De heidenen heersen over anderen — maar onder zijn volgelingen wordt grootheid gemeten door dienst."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75 }}>
          {t(
            "Robert Greenleaf coined the modern term 'servant leadership' in 1970, articulating that the best leaders are servants first — driven not by the desire to lead but by the desire to serve. His framework aligns remarkably closely with the model Jesus embodied and taught.",
            "Robert Greenleaf menciptakan istilah modern 'servant leadership' pada tahun 1970, mengartikulasikan bahwa pemimpin terbaik adalah pelayan terlebih dahulu — didorong bukan oleh keinginan untuk memimpin tetapi oleh keinginan untuk melayani.",
            "Robert Greenleaf bedacht de moderne term 'servant leadership' in 1970, en articuleerde dat de beste leiders eerst dienaren zijn — gedreven niet door de wens te leiden maar door de wens te dienen."
          )}
        </p>
      </div>

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 48, textAlign: "center" }}>
            {t("6 Key Characteristics", "6 Karakteristik Utama", "6 Kernkenmerken")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {characteristics.map((c) => (
              <div key={c.number} style={{ background: offWhite, borderRadius: 12, padding: "32px 36px", display: "flex", gap: 28, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 52, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 40, flexShrink: 0 }}>{c.number}</div>
                <div>
                  <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 18, fontWeight: 700, color: navy, marginBottom: 10 }}>
                    {lang === "en" ? c.en_title : lang === "id" ? c.id_title : c.nl_title}
                  </h3>
                  <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                    {lang === "en" ? c.en_desc : lang === "id" ? c.id_desc : c.nl_desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
            {t("Servant vs. Traditional Leadership", "Pemimpin Pelayan vs. Tradisional", "Dienend vs. Traditioneel Leiderschap")}
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: offWhite, borderRadius: 12, overflow: "hidden" }}>
              <thead>
                <tr style={{ background: navy }}>
                  <th style={{ padding: "16px 20px", textAlign: "left", color: offWhite, fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700 }}>{t("Area", "Area", "Gebied")}</th>
                  <th style={{ padding: "16px 20px", textAlign: "left", color: orange, fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700 }}>{t("Servant Leader", "Pemimpin Pelayan", "Dienende Leider")}</th>
                  <th style={{ padding: "16px 20px", textAlign: "left", color: "oklch(75% 0.12 150)", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700 }}>{t("Traditional Leader", "Pemimpin Tradisional", "Traditionele Leider")}</th>
                </tr>
              </thead>
              <tbody>
                {contrast.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid oklch(92% 0.01 80)", background: i % 2 === 0 ? offWhite : lightGray }}>
                    <td style={{ padding: "14px 20px", fontWeight: 600, color: navy, fontSize: 14 }}>{lang === "en" ? row.en_aspect : lang === "id" ? row.id_aspect : row.nl_aspect}</td>
                    <td style={{ padding: "14px 20px", color: bodyText, fontSize: 14 }}>{lang === "en" ? row.en_servant : lang === "id" ? row.id_servant : row.nl_servant}</td>
                    <td style={{ padding: "14px 20px", color: bodyText, fontSize: 14 }}>{lang === "en" ? row.en_trad : lang === "id" ? row.id_trad : row.nl_trad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
            {t("5 Practices", "5 Praktik", "5 Praktijken")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {practices.map((p) => (
              <div key={p.number} style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 44, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 36, flexShrink: 0 }}>{p.number}</div>
                <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, margin: 0, paddingTop: 6 }}>
                  {lang === "en" ? p.en : lang === "id" ? p.id : p.nl}
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
