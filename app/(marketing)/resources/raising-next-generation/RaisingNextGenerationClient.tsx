"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const paulTimothyPhases = [
  { number: "1", en_title: "Invite — 'Come with me'", id_title: "Undang — 'Ikutlah denganku'", nl_title: "Uitnodigen — 'Kom met mij'", en_desc: "Paul invited Timothy into his journey (Acts 16:3). He did not advertise a leadership programme — he identified a young person of good character and reputation, and made the invitation personal. The most powerful developmental invitation is a personal one: 'I see something in you. Come and learn alongside me.'", id_desc: "Paulus mengundang Timotius ke dalam perjalanannya (Kisah 16:3). Dia tidak mengiklankan program kepemimpinan — dia mengidentifikasi orang muda dengan karakter dan reputasi baik, dan membuat undangan itu bersifat pribadi.", nl_desc: "Paulus nodigde Timoteüs uit in zijn reis (Handelingen 16:3). Hij adverteerde geen leiderschapsprogramma — hij identificeerde een jongvolwassene met goed karakter en reputatie en maakte de uitnodiging persoonlijk." },
  { number: "2", en_title: "Invest — 'Do as I do'", id_title: "Investasi — 'Lakukan seperti yang kulakukan'", nl_title: "Investeren — 'Doe zoals ik doe'", en_desc: "Investment is not a curriculum — it is a lifestyle. Paul invested in Timothy by involving him in real ministry (Philippians 2:22), sending him on real missions (1 Corinthians 4:17), and writing him honest, formative letters. Development happens in the doing, not in the classroom.", id_desc: "Investasi bukan kurikulum — itu adalah gaya hidup. Paulus berinvestasi dalam Timotius dengan melibatkannya dalam pelayanan nyata (Filipi 2:22), mengutusnya dalam misi nyata (1 Korintus 4:17), dan menulis surat yang jujur dan formatif kepadanya.", nl_desc: "Investering is geen curriculum — het is een levensstijl. Paulus investeerde in Timoteüs door hem te betrekken bij echte bediening (Filippenzen 2:22), hem op echte missies te sturen (1 Korintiërs 4:17) en hem eerlijke, vormende brieven te schrijven." },
  { number: "3", en_title: "Release — 'You go ahead of me'", id_title: "Lepaskan — 'Kamu pergi mendahuluiku'", nl_title: "Loslaten — 'Jij gaat voor mij'", en_desc: "The goal of all investment is release. Paul sent Timothy to places he himself could not go. The truest test of a leader-developer is whether they can celebrate someone surpassing them. Release requires letting go of control, credit, and the need to remain central.", id_desc: "Tujuan dari semua investasi adalah pelepasan. Paulus mengutus Timotius ke tempat-tempat yang tidak bisa dia pergi sendiri. Ujian paling sejati dari pengembang pemimpin adalah apakah mereka bisa merayakan seseorang yang melampaui mereka.", nl_desc: "Het doel van alle investering is loslaten. Paulus stuurde Timoteüs naar plaatsen waar hij zelf niet kon gaan. De waarhachtigste test van een leiderschapsontwikkelaar is of zij iemand kunnen vieren die hen overtreft." },
];

const qualitiesToLookFor = [
  { number: "1", en: "Faithfulness in small things — character before gifting. Paul told Timothy to 'fan into flame the gift' (2 Tim 1:6) — the gift was already there, but it needed faithful stewardship.", id: "Kesetiaan dalam hal-hal kecil — karakter sebelum karunia. Paulus memberitahu Timotius untuk 'menyalakan kembali karunia' (2 Tim 1:6) — karunia itu sudah ada, tetapi memerlukan pengelolaan yang setia.", nl: "Trouw in kleine dingen — karakter voor begaafdheid. Paulus zei Timoteüs 'de gave aan te wakkeren' (2 Tim 1:6) — de gave was er al, maar het had trouw beheer nodig." },
  { number: "2", en: "Teachability — the willingness to be shaped, corrected, and stretched. A gifted person who cannot receive feedback will plateau early.", id: "Kemampuan untuk diajar — kesediaan untuk dibentuk, dikoreksi, dan diregangkan. Orang yang berbakat yang tidak dapat menerima umpan balik akan mencapai plateau lebih awal.", nl: "Leerbaarheid — de bereidheid om gevormd, gecorrigeerd en uitgerekt te worden. Een begaafd persoon die geen feedback kan ontvangen zal vroeg stagneren." },
  { number: "3", en: "Love for people — leadership that is not rooted in genuine care for others eventually becomes hollow. Look for leaders who notice people.", id: "Kecintaan terhadap orang — kepemimpinan yang tidak berakar dalam kepedulian tulus terhadap orang lain pada akhirnya menjadi hampa. Carilah pemimpin yang memperhatikan orang.", nl: "Liefde voor mensen — leiderschap dat niet geworteld is in echte zorg voor anderen wordt uiteindelijk hol. Zoek naar leiders die mensen opmerken." },
  { number: "4", en: "Responsiveness to God — the leader who is building their own kingdom eventually becomes a problem. Look for people whose primary posture is listening to God, not performing for others.", id: "Responsivitas terhadap Tuhan — pemimpin yang membangun kerajaan mereka sendiri pada akhirnya menjadi masalah. Carilah orang yang sikap utamanya mendengarkan Tuhan, bukan tampil untuk orang lain.", nl: "Responsiviteit voor God — de leider die zijn eigen koninkrijk opbouwt wordt uiteindelijk een probleem. Zoek mensen wiens primaire houding luisteren naar God is, niet presteren voor anderen." },
];

const waysToInvest = [
  { number: "1", en: "Take them with you — to meetings, ministry contexts, and conversations they are not yet entitled to. Exposure is a form of investment.", id: "Bawa mereka bersama Anda — ke rapat, konteks pelayanan, dan percakapan yang belum menjadi hak mereka. Paparan adalah bentuk investasi.", nl: "Neem ze mee — naar vergaderingen, bedieningscontexten en gesprekken waartoe ze nog niet gerechtigd zijn. Blootstelling is een vorm van investering." },
  { number: "2", en: "Debrief after experiences — ask 'What did you see? What did you notice? What would you have done differently?' Reflection is the engine of growth.", id: "Evaluasi setelah pengalaman — tanyakan 'Apa yang kamu lihat? Apa yang kamu perhatikan? Apa yang akan kamu lakukan secara berbeda?' Refleksi adalah mesin pertumbuhan.", nl: "Debrief na ervaringen — vraag 'Wat zag je? Wat viel je op? Wat zou jij anders hebben gedaan?' Reflectie is de motor van groei." },
  { number: "3", en: "Give real responsibility with real support — stretch assignments with a safety net. Not too easy (no growth) and not too hard (no survival).", id: "Berikan tanggung jawab nyata dengan dukungan nyata — penugasan yang menantang dengan jaring pengaman. Tidak terlalu mudah (tidak ada pertumbuhan) dan tidak terlalu sulit (tidak ada kelangsungan hidup).", nl: "Geef echte verantwoordelijkheid met echte ondersteuning — uitdagende opdrachten met een vangnet. Niet te gemakkelijk (geen groei) en niet te moeilijk (geen overleving)." },
  { number: "4", en: "Pray specifically for them and with them — this is ministry, not management. Their spiritual formation is part of your investment.", id: "Doakan mereka secara spesifik dan bersama mereka — ini adalah pelayanan, bukan manajemen. Pembentukan rohani mereka adalah bagian dari investasi Anda.", nl: "Bidt specifiek voor hen en met hen — dit is bediening, niet management. Hun spirituele vorming is deel van jouw investering." },
  { number: "5", en: "Speak to their destiny, not just their task — name what you see in them that they may not yet see in themselves.", id: "Berbicaralah tentang takdir mereka, bukan hanya tugas mereka — sebutkan apa yang Anda lihat dalam diri mereka yang mungkin belum mereka lihat dalam diri mereka sendiri.", nl: "Spreek over hun bestemming, niet alleen hun taak — benoem wat je in hen ziet dat ze misschien nog niet in zichzelf zien." },
];

const reflectionQuestions = [
  { roman: "I", en: "Who invested in you in a Paul-Timothy way? What did they do that shaped you most deeply?", id: "Siapa yang berinvestasi dalam diri Anda dengan cara Paul-Timotius? Apa yang mereka lakukan yang paling dalam membentuk Anda?", nl: "Wie heeft op een Paulus-Timoteüs manier in jou geïnvesteerd? Wat deden zij dat je het diepst heeft gevormd?" },
  { roman: "II", en: "Who are you currently investing in with this level of intentionality? If no one, what needs to change?", id: "Siapa yang saat ini Anda investasikan dengan tingkat kesengajaan ini? Jika tidak ada, apa yang perlu berubah?", nl: "In wie investeer je momenteel met dit niveau van intentionaliteit? Als niemand, wat moet er veranderen?" },
  { roman: "III", en: "What holds you back from releasing people — fear of losing influence, distrust, control, or simply the pace of work?", id: "Apa yang menahan Anda untuk melepaskan orang — ketakutan kehilangan pengaruh, ketidakpercayaan, kontrol, atau hanya tempo pekerjaan?", nl: "Wat houdt je tegen om mensen los te laten — angst voor verlies van invloed, wantrouwen, controle of simpelweg het tempo van werk?" },
  { roman: "IV", en: "How does your cross-cultural context change what development looks like — what expectations or timelines need adjusting?", id: "Bagaimana konteks lintas budaya Anda mengubah tampilan pengembangan — harapan atau garis waktu apa yang perlu disesuaikan?", nl: "Hoe verandert jouw interculturele context hoe ontwikkeling eruitziet — welke verwachtingen of tijdlijnen moeten worden aangepast?" },
  { roman: "V", en: "If you left tomorrow, who would lead well in your absence? If the answer is unclear, what does that tell you?", id: "Jika Anda pergi besok, siapa yang akan memimpin dengan baik tanpa kehadiran Anda? Jika jawabannya tidak jelas, apa yang itu katakan kepada Anda?", nl: "Als je morgen zou vertrekken, wie zou er goed leiding geven in jouw afwezigheid? Als het antwoord onduidelijk is, wat zegt dat dan?" },
  { roman: "VI", en: "Who in your community is currently uninvited, under-invested, and not yet released? What step can you take this week?", id: "Siapa dalam komunitas Anda yang saat ini tidak diundang, kurang diinvestasikan, dan belum dilepaskan? Langkah apa yang bisa Anda ambil minggu ini?", nl: "Wie in je gemeenschap is momenteel niet uitgenodigd, onderinvesteerd en nog niet losgelaten? Welke stap kun je deze week nemen?" },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function RaisingNextGenerationClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("raising-next-generation");
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
          {t("Multiplication", "Multiplikasi", "Multiplicatie")}
        </p>
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: offWhite, margin: "0 auto 20px", maxWidth: 760, lineHeight: 1.15 }}>
          {t("Raising the Next Generation", "Membesarkan Generasi Berikutnya", "De Volgende Generatie Optrekken")}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(85% 0.03 80)", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.6, fontStyle: "italic" }}>
          {t(
            '"The things you have heard me say… entrust to reliable people who will also be qualified to teach others." — 2 Timothy 2:2',
            '"Apa yang telah kaudengar dari padaku… percayakanlah itu kepada orang-orang yang dapat dipercayai, yang juga cakap mengajar orang lain." — 2 Timotius 2:2',
            '"Wat u van mij gehoord hebt… vertrouw dat toe aan betrouwbare mensen die bekwaam zijn ook anderen te onderwijzen." — 2 Timoteüs 2:2'
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
            "The most multiplying thing a leader can do is not build a great programme — it is raise a great person. The Paul-Timothy model is not a curriculum; it is a relationship. It requires the leader to be genuinely invested in the growth of another person, not just in their output.",
            "Hal yang paling mengalikan yang dapat dilakukan seorang pemimpin bukanlah membangun program yang hebat — melainkan membesarkan orang yang hebat. Model Paulus-Timotius bukan kurikulum; itu adalah hubungan. Ini mengharuskan pemimpin untuk benar-benar diinvestasikan dalam pertumbuhan orang lain.",
            "Het meest vermenigvuldigende wat een leider kan doen is niet een geweldig programma bouwen — het is een geweldig persoon optrekken. Het Paulus-Timoteüs model is geen curriculum; het is een relatie."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75 }}>
          {t(
            "In cross-cultural contexts, this model requires extra intentionality. Cultural dynamics around age, seniority, and authority can make it harder to identify local leaders and give them genuine ownership. The leader who overcomes those barriers invests in the most strategic work possible.",
            "Dalam konteks lintas budaya, model ini memerlukan kesengajaan ekstra. Dinamika budaya seputar usia, senioritas, dan otoritas dapat mempersulit identifikasi pemimpin lokal dan memberi mereka kepemilikan yang tulus.",
            "In interculturele contexten vereist dit model extra intentionaliteit. Culturele dynamieken rondom leeftijd, senioriteit en autoriteit kunnen het moeilijker maken lokale leiders te identificeren en hen echte eigenaarschap te geven."
          )}
        </p>
      </div>

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 48, textAlign: "center" }}>
            {t("The 3 Phases: Paul-Timothy Model", "3 Fase: Model Paulus-Timotius", "De 3 Fasen: Het Paulus-Timoteüs Model")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {paulTimothyPhases.map((p) => (
              <div key={p.number} style={{ background: offWhite, borderRadius: 12, padding: "32px 36px", display: "flex", gap: 28, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 52, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 40, flexShrink: 0 }}>{p.number}</div>
                <div>
                  <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 18, fontWeight: 700, color: navy, marginBottom: 10 }}>
                    {lang === "en" ? p.en_title : lang === "id" ? p.id_title : p.nl_title}
                  </h3>
                  <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                    {lang === "en" ? p.en_desc : lang === "id" ? p.id_desc : p.nl_desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
          {t("4 Qualities to Look For", "4 Kualitas yang Perlu Dicari", "4 Kwaliteiten om op te Letten")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {qualitiesToLookFor.map((q) => (
            <div key={q.number} style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
              <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 44, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 36, flexShrink: 0 }}>{q.number}</div>
              <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, margin: 0, paddingTop: 6 }}>
                {lang === "en" ? q.en : lang === "id" ? q.id : q.nl}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
            {t("5 Ways to Invest", "5 Cara Berinvestasi", "5 Manieren om te Investeren")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {waysToInvest.map((w) => (
              <div key={w.number} style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 44, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 36, flexShrink: 0 }}>{w.number}</div>
                <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, margin: 0, paddingTop: 6 }}>
                  {lang === "en" ? w.en : lang === "id" ? w.id : w.nl}
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
