"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const quadrants = [
  { number: "1", en_title: "Open / Arena", id_title: "Terbuka / Arena", nl_title: "Open / Arena", en_desc: "What is known both to you and to others. This is the area of transparent, effective communication. The larger your Open area, the more authentic and productive your relationships become. Growing this quadrant is the goal of the entire model.", id_desc: "Apa yang diketahui baik oleh Anda maupun orang lain. Ini adalah area komunikasi yang transparan dan efektif. Semakin besar area Terbuka Anda, semakin autentik dan produktif hubungan Anda.", nl_desc: "Wat zowel aan jou als aan anderen bekend is. Dit is het gebied van transparante, effectieve communicatie. Hoe groter je Open gebied, hoe authentieker en productiever je relaties worden." },
  { number: "2", en_title: "Blind Spot", id_title: "Titik Buta", nl_title: "Blinde Vlek", en_desc: "What others know about you that you do not know about yourself. This includes patterns, behaviours, and impacts you are unaware of. Leaders with large blind spots often derail not because of incompetence but because no one has told them the truth. Feedback is the cure.", id_desc: "Apa yang orang lain ketahui tentang Anda yang tidak Anda ketahui tentang diri Anda sendiri. Ini mencakup pola, perilaku, dan dampak yang tidak Anda sadari. Pemimpin dengan titik buta yang besar sering tergelincir bukan karena ketidakmampuan tetapi karena tidak ada yang memberi tahu mereka kebenaran.", nl_desc: "Wat anderen over jou weten wat jij niet over jezelf weet. Dit omvat patronen, gedragingen en impacts waar je je niet bewust van bent. Leiders met grote blinde vlekken ontsporen vaak niet door incompetentie maar omdat niemand hen de waarheid heeft verteld." },
  { number: "3", en_title: "Hidden / Facade", id_title: "Tersembunyi / Fasad", nl_title: "Verborgen / Façade", en_desc: "What you know about yourself that others do not know. This includes fears, struggles, motivations, and past experiences you have not shared. A large Hidden area can indicate distrust, shame, or simply a preference for privacy. In cross-cultural leadership, some things legitimately stay private — but excessive concealment erodes connection.", id_desc: "Apa yang Anda ketahui tentang diri Anda yang tidak diketahui orang lain. Ini mencakup ketakutan, perjuangan, motivasi, dan pengalaman masa lalu yang belum Anda bagikan. Area Tersembunyi yang besar dapat mengindikasikan ketidakpercayaan, rasa malu, atau sekadar preferensi untuk privasi.", nl_desc: "Wat jij over jezelf weet wat anderen niet weten. Dit omvat angsten, worstelingen, motivaties en vroegere ervaringen die je niet hebt gedeeld. Een groot Verborgen gebied kan wijzen op wantrouwen, schaamte of simpelweg een voorkeur voor privacy." },
  { number: "4", en_title: "Unknown", id_title: "Tidak Diketahui", nl_title: "Onbekend", en_desc: "What neither you nor others know about you — undiscovered potential, unconscious patterns, or responses to situations you have never faced. This quadrant shrinks as you grow. New experiences, deep reflection, and honest feedback all illuminate what was previously unknown.", id_desc: "Apa yang tidak Anda maupun orang lain ketahui tentang Anda — potensi yang belum ditemukan, pola tidak sadar, atau respons terhadap situasi yang belum pernah Anda hadapi. Kuadran ini menyusut seiring pertumbuhan Anda.", nl_desc: "Wat noch jij noch anderen over jou weten — onontdekt potentieel, onbewuste patronen of reacties op situaties die je nooit hebt meegemaakt. Dit kwadrant slinkt naarmate je groeit." },
];

const applications = [
  { number: "1", en: "Regularly invite specific, structured feedback from people at different levels of your organisation.", id: "Secara teratur undang umpan balik spesifik dan terstruktur dari orang-orang di berbagai tingkat organisasi Anda.", nl: "Nodig regelmatig specifieke, gestructureerde feedback uit van mensen op verschillende niveaus van je organisatie." },
  { number: "2", en: "Share appropriately from your Hidden quadrant — vulnerability builds trust when it is purposeful.", id: "Bagikan dengan tepat dari kuadran Tersembunyi Anda — kerentanan membangun kepercayaan ketika itu bertujuan.", nl: "Deel passend uit je Verborgen kwadrant — kwetsbaarheid bouwt vertrouwen op wanneer het doelgericht is." },
  { number: "3", en: "Use the Johari Window as a team exercise — have team members identify what they see in each other's Open area.", id: "Gunakan Jendela Johari sebagai latihan tim — minta anggota tim mengidentifikasi apa yang mereka lihat di area Terbuka satu sama lain.", nl: "Gebruik het Johari-venster als teamoefening — laat teamleden identificeren wat ze zien in elkaars Open gebied." },
  { number: "4", en: "After every major project, create space for a blind-spot conversation: 'What did I do that impacted you in ways I may not have noticed?'", id: "Setelah setiap proyek besar, ciptakan ruang untuk percakapan titik buta: 'Apa yang saya lakukan yang memengaruhi Anda dengan cara yang mungkin tidak saya perhatikan?'", nl: "Creëer na elk groot project ruimte voor een blinde-vlekgesprek: 'Wat deed ik dat jou beïnvloedde op manieren die ik misschien niet heb opgemerkt?'" },
  { number: "5", en: "Build a culture where growing your Open area is celebrated — not feared. Transparency becomes a team value, not a threat.", id: "Bangun budaya di mana memperbesar area Terbuka Anda dirayakan — bukan ditakuti. Transparansi menjadi nilai tim, bukan ancaman.", nl: "Bouw een cultuur waar het vergroten van je Open gebied wordt gevierd — niet gevreesd. Transparantie wordt een teamwaarde, geen bedreiging." },
];

const reflectionQuestions = [
  { roman: "I", en: "What do you suspect lives in your Blind Spot that no one has ever named directly to you?", id: "Apa yang Anda duga ada di Titik Buta Anda yang tidak pernah langsung disebutkan kepada Anda?", nl: "Wat vermoed je dat er in je Blinde Vlek zit dat nog nooit rechtstreeks aan jou is benoemd?" },
  { roman: "II", en: "What is in your Hidden area that, if shared, would deepen trust with your team?", id: "Apa yang ada di area Tersembunyi Anda yang, jika dibagikan, akan memperdalam kepercayaan dengan tim Anda?", nl: "Wat zit er in je Verborgen gebied dat, indien gedeeld, vertrouwen met je team zou verdiepen?" },
  { roman: "III", en: "Who in your life has permission to speak into your blind spots? Is that enough?", id: "Siapa dalam hidup Anda yang memiliki izin untuk berbicara tentang titik buta Anda? Apakah itu cukup?", nl: "Wie in je leven heeft toestemming om in je blinde vlekken te spreken? Is dat genoeg?" },
  { roman: "IV", en: "How does cross-cultural context expand your Unknown quadrant — and what does that mean for humility?", id: "Bagaimana konteks lintas budaya memperluas kuadran Tidak Diketahui Anda — dan apa artinya itu bagi kerendahan hati?", nl: "Hoe vergroot interculturele context je Onbekende kwadrant — en wat betekent dat voor bescheidenheid?" },
  { roman: "V", en: "What feedback have you received multiple times that you still haven't fully acted on?", id: "Umpan balik apa yang telah Anda terima berkali-kali yang belum sepenuhnya Anda tindak lanjuti?", nl: "Welke feedback heb je meerdere keren ontvangen waarop je nog niet volledig hebt gehandeld?" },
  { roman: "VI", en: "Describe a leader whose large Open area made them exceptionally trustworthy. What did that look like in practice?", id: "Gambarkan seorang pemimpin yang area Terbuka yang besar membuatnya sangat dapat dipercaya. Seperti apa itu dalam praktik?", nl: "Beschrijf een leider wiens grote Open gebied hem/haar uitzonderlijk betrouwbaar maakte. Hoe zag dat er in de praktijk uit?" },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function JohariWindowClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("johari-window");
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
          {t("Self-Awareness", "Kesadaran Diri", "Zelfbewustzijn")}
        </p>
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: offWhite, margin: "0 auto 20px", maxWidth: 760, lineHeight: 1.15 }}>
          {t("The Johari Window", "Jendela Johari", "Het Johari-venster")}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(85% 0.03 80)", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.6, fontStyle: "italic" }}>
          {t(
            '"To know yourself is to grow yourself — and to let others know you is to grow together."',
            '"Mengenal diri sendiri adalah untuk berkembang — dan membiarkan orang lain mengenal Anda adalah untuk berkembang bersama."',
            '"Jezelf kennen is jezelf groeien — en anderen jezelf laten kennen is samen groeien."'
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
            "Developed by psychologists Joseph Luft and Harry Ingham in 1955, the Johari Window is a simple but powerful framework for mapping self-awareness and interpersonal transparency. The name is a portmanteau of their first names — Joe and Harry.",
            "Dikembangkan oleh psikolog Joseph Luft dan Harry Ingham pada tahun 1955, Jendela Johari adalah kerangka yang sederhana tetapi kuat untuk memetakan kesadaran diri dan transparansi interpersonal.",
            "Ontwikkeld door psychologen Joseph Luft en Harry Ingham in 1955, is het Johari-venster een eenvoudig maar krachtig framework voor het in kaart brengen van zelfbewustzijn en interpersoonlijke transparantie."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75 }}>
          {t(
            "The model divides self-knowledge into four quadrants based on what is known or unknown to self and others. The goal of personal and professional development is to expand the Open area — and the tools to do that are feedback and disclosure.",
            "Model ini membagi pengetahuan diri menjadi empat kuadran berdasarkan apa yang diketahui atau tidak diketahui oleh diri sendiri dan orang lain. Tujuan pengembangan pribadi dan profesional adalah memperluas area Terbuka.",
            "Het model verdeelt zelfkennis in vier kwadranten op basis van wat wel of niet bekend is bij zichzelf en anderen. Het doel van persoonlijke en professionele ontwikkeling is het vergroten van het Open gebied."
          )}
        </p>
      </div>

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 48, textAlign: "center" }}>
            {t("The 4 Quadrants", "4 Kuadran", "De 4 Kwadranten")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {quadrants.map((q) => (
              <div key={q.number} style={{ background: offWhite, borderRadius: 12, padding: "32px 36px", display: "flex", gap: 28, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 52, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 40, flexShrink: 0 }}>{q.number}</div>
                <div>
                  <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 18, fontWeight: 700, color: navy, marginBottom: 10 }}>
                    {lang === "en" ? q.en_title : lang === "id" ? q.id_title : q.nl_title}
                  </h3>
                  <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                    {lang === "en" ? q.en_desc : lang === "id" ? q.id_desc : q.nl_desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
          {t("5 Practical Applications", "5 Aplikasi Praktis", "5 Praktische Toepassingen")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {applications.map((a) => (
            <div key={a.number} style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
              <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 44, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 36, flexShrink: 0 }}>{a.number}</div>
              <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, margin: 0, paddingTop: 6 }}>
                {lang === "en" ? a.en : lang === "id" ? a.id : a.nl}
              </p>
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
