"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;
type VerseKey = "2tim-2-2" | "matt-28-19";

const VERSES: Record<VerseKey, { en_ref: string; id_ref: string; nl_ref: string; en: string; id: string; nl: string }> = {
  "2tim-2-2": {
    en_ref: "2 Timothy 2:2", id_ref: "2 Timotius 2:2", nl_ref: "2 Timotheüs 2:2",
    en: "And the things you have heard me say in the presence of many witnesses entrust to reliable people who will also be qualified to teach others.",
    id: "Apa yang telah engkau dengar dari padaku di depan banyak saksi, percayakanlah itu kepada orang-orang yang dapat dipercayai, yang juga cakap mengajar orang lain.",
    nl: "Wat je van mij gehoord hebt ten overstaan van velen, vertrouw dat toe aan betrouwbare mensen die in staat zijn ook anderen te onderwijzen.",
  },
  "matt-28-19": {
    en_ref: "Matthew 28:19", id_ref: "Matius 28:19", nl_ref: "Matteüs 28:19",
    en: "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.",
    id: "Karena itu pergilah, jadikanlah semua bangsa murid-Ku dan baptislah mereka dalam nama Bapa dan Anak dan Roh Kudus.",
    nl: "Ga dus op weg en maak alle volken tot mijn leerlingen, door hen te dopen in de naam van de Vader en de Zoon en de heilige Geest.",
  },
};

const PHASES = [
  {
    phaseId: 1,
    en_label: "Invite", id_label: "Undang", nl_label: "Uitnodigen",
    en_subtitle: "Come with me", id_subtitle: "Ikutlah denganku", nl_subtitle: "Kom met mij mee",
    en: "Paul invited Timothy into his journey (Acts 16:3). He did not advertise a leadership programme — he identified a young person of good character and reputation, and made the invitation personal. The most powerful developmental invitation is not a form to fill in. It is a specific word, spoken to a specific person: 'I see something in you. Come and learn alongside me.'",
    id: "Paulus mengundang Timotius ke dalam perjalanannya (Kisah 16:3). Dia tidak mengiklankan program kepemimpinan — dia mengidentifikasi orang muda dengan karakter dan reputasi yang baik, dan membuat undangan itu bersifat pribadi. Undangan pengembangan yang paling kuat bukan formulir untuk diisi. Ini adalah kata-kata spesifik, diucapkan kepada orang yang spesifik: 'Saya melihat sesuatu dalam dirimu. Mari belajar bersamaku.'",
    nl: "Paulus nodigde Timoteüs uit in zijn reis (Handelingen 16:3). Hij adverteerde geen leiderschapsprogramma — hij identificeerde een jongvolwassene met goed karakter en reputatie en maakte de uitnodiging persoonlijk. De krachtigste ontwikkelingsuitnodiging is geen formulier om in te vullen. Het zijn specifieke woorden, gesproken tot een specifiek persoon: 'Ik zie iets in jou. Kom en leer naast mij.'",
  },
  {
    phaseId: 2,
    en_label: "Invest", id_label: "Investasi", nl_label: "Investeren",
    en_subtitle: "Do as I do", id_subtitle: "Lakukan seperti yang kulakukan", nl_subtitle: "Doe zoals ik doe",
    en: "Investment is not a curriculum — it is a lifestyle. Paul invested in Timothy by involving him in real ministry (Philippians 2:22), sending him on real missions (1 Corinthians 4:17), and writing him honest, formative letters. Development happens in the doing, not in the classroom. You cannot develop a leader at arm's length. They need proximity — to your decisions, your failures, your way of handling pressure.",
    id: "Investasi bukan kurikulum — itu adalah gaya hidup. Paulus berinvestasi dalam Timotius dengan melibatkannya dalam pelayanan nyata (Filipi 2:22), mengutusnya dalam misi nyata (1 Korintus 4:17), dan menulis surat yang jujur dan formatif kepadanya. Pengembangan terjadi dalam perbuatan, bukan di ruang kelas. Anda tidak bisa mengembangkan seorang pemimpin dari kejauhan. Mereka membutuhkan kedekatan — dengan keputusan Anda, kegagalan Anda, cara Anda menangani tekanan.",
    nl: "Investering is geen curriculum — het is een levensstijl. Paulus investeerde in Timoteüs door hem te betrekken bij echte bediening (Filippenzen 2:22), hem op echte missies te sturen (1 Korintiërs 4:17) en hem eerlijke, vormende brieven te schrijven. Ontwikkeling gebeurt in het doen, niet in het klaslokaal. Je kunt een leider niet op afstand ontwikkelen. Ze hebben nabijheid nodig — bij jouw beslissingen, jouw mislukkingen, jouw manier van omgaan met druk.",
  },
  {
    phaseId: 3,
    en_label: "Release", id_label: "Lepaskan", nl_label: "Loslaten",
    en_subtitle: "You go ahead of me", id_subtitle: "Kamu pergi mendahuluiku", nl_subtitle: "Jij gaat voor mij",
    en: "The goal of all investment is release. Paul sent Timothy to places he himself could not go. The truest test of a leader-developer is whether they can celebrate someone surpassing them. Release requires letting go of control, credit, and the need to remain central. In many cultures, releasing someone is countercultural — it means giving away what you spent years building. But this is the logic of the Kingdom: the grain of wheat must fall into the ground.",
    id: "Tujuan dari semua investasi adalah pelepasan. Paulus mengutus Timotius ke tempat-tempat yang tidak bisa dia pergi sendiri. Ujian paling sejati dari pengembang pemimpin adalah apakah mereka bisa merayakan seseorang yang melampaui mereka. Pelepasan memerlukan melepaskan kendali, kredit, dan kebutuhan untuk tetap menjadi pusat. Dalam banyak budaya, melepaskan seseorang adalah kontra-budaya — artinya menyerahkan apa yang Anda habiskan bertahun-tahun untuk membangunnya.",
    nl: "Het doel van alle investering is loslaten. Paulus stuurde Timoteüs naar plaatsen waar hij zelf niet kon gaan. De waarhachtigste test van een leiderschapsontwikkelaar is of zij iemand kunnen vieren die hen overtreft. Loslaten vereist het loslaten van controle, krediet en de behoefte om centraal te blijven. In veel culturen is iemand loslaten tegencultureel — het betekent weggeven wat je jarenlang hebt gebouwd. Maar dit is de logica van het Koninkrijk.",
  },
];

const QUALITIES = [
  {
    en: "Faithfulness in small things — character before gifting. Look for the person who does the unseen work well, not just the person who performs when watched.",
    id: "Kesetiaan dalam hal-hal kecil — karakter sebelum karunia. Carilah orang yang melakukan pekerjaan yang tidak terlihat dengan baik, bukan hanya orang yang tampil ketika diawasi.",
    nl: "Trouw in kleine dingen — karakter voor begaafdheid. Zoek de persoon die het onzichtbare werk goed doet, niet alleen de persoon die presteert wanneer hij wordt bekeken.",
  },
  {
    en: "Teachability — the willingness to be shaped, corrected, and stretched. A gifted person who cannot receive honest feedback will plateau early and become defensive later.",
    id: "Kemampuan untuk diajar — kesediaan untuk dibentuk, dikoreksi, dan diregangkan. Orang yang berbakat yang tidak dapat menerima umpan balik yang jujur akan mencapai plateau lebih awal dan menjadi defensif kemudian.",
    nl: "Leerbaarheid — de bereidheid om gevormd, gecorrigeerd en uitgerekt te worden. Een begaafd persoon die geen eerlijke feedback kan ontvangen zal vroeg stagneren en later defensief worden.",
  },
  {
    en: "Love for people — leadership not rooted in genuine care for others eventually becomes hollow. Look for leaders who notice people who are overlooked.",
    id: "Kecintaan terhadap orang — kepemimpinan yang tidak berakar dalam kepedulian tulus terhadap orang lain pada akhirnya menjadi hampa. Carilah pemimpin yang memperhatikan orang yang diabaikan.",
    nl: "Liefde voor mensen — leiderschap dat niet geworteld is in echte zorg voor anderen wordt uiteindelijk hol. Zoek naar leiders die mensen opmerken die over het hoofd worden gezien.",
  },
  {
    en: "Responsiveness to God — the leader building their own kingdom eventually becomes a problem. Look for people whose primary posture is listening, not performing.",
    id: "Responsivitas terhadap Tuhan — pemimpin yang membangun kerajaan mereka sendiri pada akhirnya menjadi masalah. Carilah orang yang sikap utamanya mendengarkan, bukan tampil.",
    nl: "Responsiviteit voor God — de leider die zijn eigen koninkrijk opbouwt wordt uiteindelijk een probleem. Zoek mensen wiens primaire houding luisteren is, niet presteren.",
  },
];

const PRACTICES = [
  {
    en: "Take them with you — to meetings, conversations, and contexts they are not yet entitled to. Exposure is a form of investment.",
    id: "Bawa mereka bersama Anda — ke rapat, percakapan, dan konteks yang belum menjadi hak mereka. Paparan adalah bentuk investasi.",
    nl: "Neem ze mee — naar vergaderingen, gesprekken en contexten waartoe ze nog niet gerechtigd zijn. Blootstelling is een vorm van investering.",
  },
  {
    en: "Debrief after experiences — ask 'What did you see? What would you have done differently?' Reflection is the engine of growth.",
    id: "Evaluasi setelah pengalaman — tanyakan 'Apa yang kamu lihat? Apa yang akan kamu lakukan secara berbeda?' Refleksi adalah mesin pertumbuhan.",
    nl: "Debrief na ervaringen — vraag 'Wat zag je? Wat zou jij anders hebben gedaan?' Reflectie is de motor van groei.",
  },
  {
    en: "Give real responsibility with real support — stretch assignments with a safety net. Not too easy (no growth) and not too hard (no survival).",
    id: "Berikan tanggung jawab nyata dengan dukungan nyata — penugasan yang menantang dengan jaring pengaman. Tidak terlalu mudah (tidak ada pertumbuhan) dan tidak terlalu sulit (tidak ada kelangsungan hidup).",
    nl: "Geef echte verantwoordelijkheid met echte ondersteuning — uitdagende opdrachten met een vangnet. Niet te gemakkelijk (geen groei) en niet te moeilijk (geen overleving).",
  },
  {
    en: "Pray specifically for them and with them — this is ministry, not management. Their spiritual formation is part of your investment.",
    id: "Doakan mereka secara spesifik dan bersama mereka — ini adalah pelayanan, bukan manajemen. Pembentukan rohani mereka adalah bagian dari investasi Anda.",
    nl: "Bidt specifiek voor hen en met hen — dit is bediening, niet management. Hun spirituele vorming is deel van jouw investering.",
  },
  {
    en: "Speak to their destiny, not just their task — name what you see in them that they may not yet see in themselves.",
    id: "Berbicaralah tentang takdir mereka, bukan hanya tugas mereka — sebutkan apa yang Anda lihat dalam diri mereka yang mungkin belum mereka lihat.",
    nl: "Spreek over hun bestemming, niet alleen hun taak — benoem wat je in hen ziet dat ze misschien nog niet in zichzelf zien.",
  },
];

type Props = { userPathway: string | null; isSaved: boolean };
export default function RaisingNextGenerationClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [level1Names, setLevel1Names] = useState<string[]>(["", "", ""]);
  const [nameAware, setNameAware] = useState<Record<number, boolean>>({});
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);
  const [activeVerse, setActiveVerse] = useState<VerseKey | null>(null);
  const [commitment, setCommitment] = useState("");
  const [committed, setCommitted] = useState(false);

  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);
  const navy = "oklch(22% 0.10 260)";
  const orange = "oklch(65% 0.15 45)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const bodyText = "oklch(38% 0.05 260)";
  const serif = "var(--font-cormorant, Cormorant Garamond, Georgia, serif)";

  const filledNames = level1Names.filter(n => n.trim());
  const enteredCount = filledNames.length;
  const gen2 = enteredCount * 3;
  const gen3 = gen2 * 3;
  const hasTree = enteredCount > 0;
  const unawareCount = filledNames.filter((_, i) => !nameAware[i]).length;

  return (
    <div style={{ minHeight: "100vh", background: offWhite, fontFamily: "Montserrat, sans-serif" }}>

      {/* Language + Save bar */}
      <div style={{ background: navy, padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {(["en", "id", "nl"] as Lang[]).map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              padding: "6px 16px", border: "none", borderRadius: 4, cursor: "pointer",
              fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
              background: lang === l ? orange : "transparent",
              color: lang === l ? offWhite : "oklch(70% 0.04 260)",
            }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button onClick={() => {
          startTransition(async () => {
            await saveResourceToDashboard("raising-next-generation");
            setSaved(true);
          });
        }} disabled={saved || isPending} style={{
          padding: "8px 20px", borderRadius: 6,
          border: `1px solid ${saved ? "oklch(70% 0.04 260)" : orange}`,
          background: "transparent", color: saved ? "oklch(70% 0.04 260)" : orange,
          fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700,
          cursor: saved ? "default" : "pointer",
        }}>
          {saved ? t("✓ Saved to Dashboard", "✓ Tersimpan di Dashboard", "✓ Opgeslagen in Dashboard") : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
        </button>
      </div>

      {/* Hero */}
      <div style={{ background: navy, padding: "68px 24px 80px", textAlign: "center" }}>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: orange, marginBottom: 20, textTransform: "uppercase" }}>
          {t("Module 13 · Leadership Development", "Modul 13 · Pengembangan Kepemimpinan", "Module 13 · Leiderschapsontwikkeling")}
        </p>
        <h1 style={{ fontFamily: serif, fontSize: "clamp(40px, 6vw, 70px)", fontWeight: 600, color: offWhite, margin: "0 auto 20px", maxWidth: 680, lineHeight: 1.15 }}>
          {t("Every Leader is a Seed", "Setiap Pemimpin adalah Benih", "Elke Leider is een Zaad")}
        </h1>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 16, color: "oklch(78% 0.04 260)", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
          {t(
            "You will not always be here. The question is not whether you lead well — it is whether you are multiplying what you've been given.",
            "Anda tidak akan selalu ada di sini. Pertanyaannya bukan apakah Anda memimpin dengan baik — tetapi apakah Anda melipatgandakan apa yang telah diberikan kepada Anda.",
            "Je zult er niet altijd zijn. De vraag is niet of je goed leidt — maar of je vermenigvuldigt wat je is gegeven."
          )}
        </p>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* Lineage Builder */}
        <div style={{ marginTop: 52, marginBottom: 60 }}>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: orange, textTransform: "uppercase", marginBottom: 8 }}>
            {t("Your Lineage", "Garis Keturunan Anda", "Jouw Lijn")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 600, color: navy, marginBottom: 12, lineHeight: 1.25 }}>
            {t("Who are you investing in?", "Siapa yang Anda investasikan?", "In wie investeer jij?")}
          </h2>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 15, color: bodyText, lineHeight: 1.75, marginBottom: 32, maxWidth: 600 }}>
            {t(
              "Name up to three people you are currently developing as leaders. Not who you'd like to invest in someday — who you are actively investing in today.",
              "Sebutkan hingga tiga orang yang saat ini Anda kembangkan sebagai pemimpin. Bukan siapa yang ingin Anda investasikan suatu hari nanti — siapa yang saat ini Anda investasikan secara aktif.",
              "Noem maximaal drie mensen in wie jij momenteel leiders ontwikkelt. Niet wie je ooit zou willen investeren — wie je vandaag actief in investeert."
            )}
          </p>

          {/* Tree */}
          <div style={{ padding: "36px 32px", background: lightGray, borderRadius: 16 }}>

            {/* YOU node */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
              <div style={{ padding: "12px 32px", background: navy, borderRadius: 8, fontFamily: serif, fontSize: 22, fontWeight: 700, color: offWhite, letterSpacing: "0.04em" }}>
                {t("You", "Anda", "Jij")}
              </div>
            </div>

            {/* Vertical stem */}
            <div style={{ width: 2, height: 28, background: orange, margin: "0 auto 0" }} />

            {/* Horizontal spread bar */}
            <div style={{ position: "relative", height: 2, background: orange, margin: "0 15%", marginBottom: 0 }}>
              <div style={{ position: "absolute", left: "0%", top: 0, width: 2, height: 24, background: orange }} />
              <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: 0, width: 2, height: 24, background: orange }} />
              <div style={{ position: "absolute", right: "0%", top: 0, width: 2, height: 24, background: orange }} />
            </div>

            {/* L1 name inputs */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 24, marginBottom: 28 }}>
              {level1Names.map((name, i) => (
                <div key={i}>
                  <input
                    type="text"
                    value={name}
                    onChange={e => {
                      const next = [...level1Names];
                      next[i] = e.target.value;
                      setLevel1Names(next);
                      if (!e.target.value.trim()) {
                        const upd = { ...nameAware };
                        delete upd[i];
                        setNameAware(upd);
                      }
                    }}
                    placeholder={t(`Timothy ${i + 1}`, `Timotius ${i + 1}`, `Timotheüs ${i + 1}`)}
                    style={{
                      width: "100%", padding: "12px 14px", border: `2px solid ${name.trim() ? navy : "oklch(80% 0.012 80)"}`,
                      borderRadius: 8, fontFamily: "Montserrat, sans-serif", fontSize: 13,
                      fontWeight: name.trim() ? 700 : 400, color: navy, background: name.trim() ? offWhite : "oklch(96% 0.006 80)",
                      textAlign: "center", boxSizing: "border-box",
                    }}
                  />
                  {name.trim() && (
                    <label style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={!!nameAware[i]}
                        onChange={e => setNameAware(prev => ({ ...prev, [i]: e.target.checked }))}
                        style={{ width: 14, height: 14, cursor: "pointer", accentColor: orange }}
                      />
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: bodyText, lineHeight: 1.4 }}>
                        {t("knows I'm investing in them", "tahu saya berinvestasi padanya", "weet dat ik in hen investeer")}
                      </span>
                    </label>
                  )}
                </div>
              ))}
            </div>

            {/* Multiplication impact */}
            {hasTree && (
              <>
                <div style={{ width: 2, height: 24, background: "oklch(60% 0.08 260)", margin: "0 auto" }} />
                <div style={{ padding: "24px 28px", background: navy, borderRadius: 12, marginTop: 0 }}>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: orange, textTransform: "uppercase", marginBottom: 16 }}>
                    {t("The Multiplication", "Penggandaan", "De Vermenigvuldiging")}
                  </p>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "oklch(75% 0.03 260)", marginBottom: 20, lineHeight: 1.6 }}>
                    {t(
                      `If each of these ${enteredCount} leader${enteredCount > 1 ? "s" : ""} intentionally invests in 3 more:`,
                      `Jika setiap ${enteredCount} pemimpin ini dengan sengaja berinvestasi dalam 3 orang lagi:`,
                      `Als elk van deze ${enteredCount} leider${enteredCount > 1 ? "s" : ""} bewust investeert in 3 meer:`
                    )}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontFamily: serif, fontSize: 48, fontWeight: 700, color: orange, lineHeight: 1, margin: 0 }}>{enteredCount}</p>
                      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: "oklch(65% 0.04 260)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        {t("you + them", "Anda + mereka", "jij + zij")}
                      </p>
                    </div>
                    <p style={{ fontFamily: serif, fontSize: 28, color: "oklch(50% 0.06 260)", margin: 0 }}>→</p>
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontFamily: serif, fontSize: 48, fontWeight: 700, color: orange, lineHeight: 1, margin: 0 }}>{gen2}</p>
                      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: "oklch(65% 0.04 260)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        {t("gen 2", "generasi 2", "gen 2")}
                      </p>
                    </div>
                    <p style={{ fontFamily: serif, fontSize: 28, color: "oklch(50% 0.06 260)", margin: 0 }}>→</p>
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontFamily: serif, fontSize: 48, fontWeight: 700, color: orange, lineHeight: 1, margin: 0 }}>{gen3}</p>
                      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: "oklch(65% 0.04 260)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        {t("gen 3", "generasi 3", "gen 3")}
                      </p>
                    </div>
                  </div>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "oklch(65% 0.04 260)", marginTop: 20, lineHeight: 1.65, fontStyle: "italic" }}>
                    {t(
                      `This is the math Paul was doing. Not ${enteredCount} leader — ${gen3} leaders, carrying what you carry, in places you'll never reach.`,
                      `Inilah matematika yang dilakukan Paulus. Bukan ${enteredCount} pemimpin — ${gen3} pemimpin, membawa apa yang Anda bawa, di tempat yang tidak akan pernah Anda capai.`,
                      `Dit is de wiskunde die Paulus deed. Niet ${enteredCount} leider — ${gen3} leiders, dragend wat jij draagt, op plaatsen die jij nooit zult bereiken.`
                    )}
                  </p>
                </div>

                {/* Awareness nudge */}
                {unawareCount > 0 && (
                  <div style={{ marginTop: 16, padding: "18px 22px", background: "oklch(97% 0.01 50)", border: `1px solid oklch(88% 0.06 50)`, borderRadius: 10 }}>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "oklch(38% 0.08 45)", lineHeight: 1.65, margin: 0 }}>
                      {t(
                        `${unawareCount} of the people on your list may not know you're intentionally investing in them. The most powerful thing you can do this week: tell them explicitly.`,
                        `${unawareCount} orang dalam daftar Anda mungkin tidak tahu bahwa Anda secara sengaja berinvestasi pada mereka. Hal paling kuat yang dapat Anda lakukan minggu ini: beritahu mereka secara eksplisit.`,
                        `${unawareCount} van de mensen op jouw lijst weten misschien niet dat je bewust in hen investeert. Het krachtigste wat je deze week kunt doen: vertel het hen expliciet.`
                      )}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Paul-Timothy model */}
        <div style={{ marginBottom: 56 }}>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: orange, textTransform: "uppercase", marginBottom: 8 }}>
            {t("The Model", "Modelnya", "Het Model")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 600, color: navy, marginBottom: 24, lineHeight: 1.3 }}>
            {t("The Paul–Timothy Pattern", "Pola Paulus–Timotius", "Het Paulus–Timoteüs Patroon")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {PHASES.map(phase => {
              const isOpen = expandedPhase === phase.phaseId;
              return (
                <div key={phase.phaseId} style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${isOpen ? navy : "oklch(87% 0.008 80)"}`, transition: "border-color 0.15s ease" }}>
                  <button onClick={() => setExpandedPhase(isOpen ? null : phase.phaseId)} style={{
                    width: "100%", padding: "20px 24px", background: isOpen ? navy : offWhite,
                    border: "none", cursor: "pointer", textAlign: "left",
                    display: "flex", alignItems: "center", gap: 20,
                  }}>
                    <span style={{ fontFamily: serif, fontSize: 36, fontWeight: 700, color: isOpen ? orange : "oklch(75% 0.08 260)", lineHeight: 1, minWidth: 28 }}>
                      {phase.phaseId}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, color: isOpen ? offWhite : navy, margin: 0, letterSpacing: "0.04em" }}>
                        {tFn(phase.en_label, phase.id_label, phase.nl_label, lang)}
                      </p>
                      <p style={{ fontFamily: serif, fontSize: 16, fontStyle: "italic", color: isOpen ? "oklch(82% 0.04 260)" : bodyText, margin: "2px 0 0" }}>
                        "{tFn(phase.en_subtitle, phase.id_subtitle, phase.nl_subtitle, lang)}"
                      </p>
                    </div>
                    <span style={{ color: isOpen ? orange : "oklch(60% 0.05 260)", fontSize: 18, lineHeight: 1, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}>↓</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: "20px 24px 24px", background: lightGray }}>
                      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, color: bodyText, lineHeight: 1.8, margin: 0 }}>
                        {tFn(phase.en, phase.id, phase.nl, lang)}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Two-column: qualities + practices */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32, marginBottom: 64 }}>
          <div>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: orange, textTransform: "uppercase", marginBottom: 16 }}>
              {t("Who to Look For", "Siapa yang Dicari", "Wie te Zoeken")}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {QUALITIES.map((q, i) => (
                <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ fontFamily: serif, fontSize: 28, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 22, flexShrink: 0, marginTop: 2 }}>
                    {i + 1}
                  </span>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                    {tFn(q.en, q.id, q.nl, lang)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: orange, textTransform: "uppercase", marginBottom: 16 }}>
              {t("How to Invest", "Cara Berinvestasi", "Hoe te Investeren")}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {PRACTICES.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ fontFamily: serif, fontSize: 28, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 22, flexShrink: 0, marginTop: 2 }}>
                    {i + 1}
                  </span>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                    {tFn(p.en, p.id, p.nl, lang)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Biblical Foundation */}
        <div style={{ marginBottom: 64 }}>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: orange, textTransform: "uppercase", marginBottom: 8 }}>
            {t("Biblical Foundation", "Dasar Alkitabiah", "Bijbelse Basis")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 600, color: navy, marginBottom: 20, lineHeight: 1.25 }}>
            {t("The Mathematics of the Kingdom", "Matematika Kerajaan", "De Wiskunde van het Koninkrijk")}
          </h2>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 15, color: bodyText, lineHeight: 1.8, maxWidth: 680, marginBottom: 28 }}>
            {t(
              "Paul's strategy was never to build a ministry around himself. His strategy was to entrust what he had received to reliable people who would entrust it to others. This is a four-generation vision: Paul → Timothy → reliable people → others. The multiplication is built into the model. Jesus commissioned the same thing — not a congregation, but a movement of disciple-makers.",
              "Strategi Paulus tidak pernah membangun pelayanan di sekitar dirinya. Strateginya adalah mempercayakan apa yang telah ia terima kepada orang-orang yang dapat dipercaya yang akan mempercayakannya kepada orang lain. Ini adalah visi empat generasi: Paulus → Timotius → orang-orang yang dapat dipercaya → orang lain. Penggandaan sudah ada dalam modelnya. Yesus menugaskan hal yang sama — bukan jemaat, melainkan gerakan pembuat murid.",
              "Paulus' strategie was nooit een bediening rondom zichzelf te bouwen. Zijn strategie was om wat hij had ontvangen toe te vertrouwen aan betrouwbare mensen die het aan anderen zouden toevertrouwen. Dit is een vier-generaties visie: Paulus → Timoteüs → betrouwbare mensen → anderen. De vermenigvuldiging is ingebouwd in het model. Jezus gaf dezelfde opdracht — geen gemeente, maar een beweging van leerlingmakers."
            )}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {(["2tim-2-2", "matt-28-19"] as VerseKey[]).map(vKey => {
              const v = VERSES[vKey];
              return (
                <div key={vKey} style={{ padding: "28px 28px", background: lightGray, borderRadius: 10 }}>
                  <p style={{ fontFamily: serif, fontSize: 19, fontStyle: "italic", color: navy, lineHeight: 1.7, marginBottom: 16 }}>
                    "{lang === "en" ? v.en : lang === "id" ? v.id : v.nl}"
                  </p>
                  <button onClick={() => setActiveVerse(vKey)} style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700,
                    color: orange, letterSpacing: "0.08em", textDecoration: "underline dotted", padding: 0,
                  }}>
                    {lang === "en" ? v.en_ref : lang === "id" ? v.id_ref : v.nl_ref}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reflection */}
        <div style={{ marginBottom: 56 }}>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: orange, textTransform: "uppercase", marginBottom: 16 }}>
            {t("Reflection", "Refleksi", "Reflectie")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {([
              {
                roman: "I",
                en: "Who invested in you in a Paul-Timothy way? What specifically did they do that shaped you most deeply?",
                id: "Siapa yang berinvestasi dalam diri Anda dengan cara Paulus-Timotius? Apa yang secara spesifik mereka lakukan yang paling dalam membentuk Anda?",
                nl: "Wie heeft op een Paulus-Timoteüs manier in jou geïnvesteerd? Wat deden zij specifiek dat je het diepst heeft gevormd?",
              },
              {
                roman: "II",
                en: "What holds you back from releasing people — fear of losing influence, distrust, control, or simply the pace of work?",
                id: "Apa yang menahan Anda untuk melepaskan orang — ketakutan kehilangan pengaruh, ketidakpercayaan, kontrol, atau hanya tempo pekerjaan?",
                nl: "Wat houdt je tegen om mensen los te laten — angst voor verlies van invloed, wantrouwen, controle of simpelweg het tempo van werk?",
              },
              {
                roman: "III",
                en: "If you left tomorrow, who would lead well in your absence? What does the answer tell you?",
                id: "Jika Anda pergi besok, siapa yang akan memimpin dengan baik tanpa kehadiran Anda? Apa yang jawabannya katakan kepada Anda?",
                nl: "Als je morgen zou vertrekken, wie zou er goed leiding geven in jouw afwezigheid? Wat zegt het antwoord jou?",
              },
            ] as { roman: string; en: string; id: string; nl: string }[]).map(q => (
              <div key={q.roman} style={{ display: "flex", gap: 20, padding: "20px 24px", background: lightGray, borderRadius: 10, alignItems: "flex-start" }}>
                <span style={{ fontFamily: serif, fontSize: 22, fontWeight: 700, color: orange, minWidth: 28, flexShrink: 0, lineHeight: 1.2 }}>{q.roman}</span>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                  {tFn(q.en, q.id, q.nl, lang)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Commitment */}
        <div style={{ padding: "40px", background: lightGray, borderRadius: 16, marginBottom: 52 }}>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: orange, textTransform: "uppercase", marginBottom: 12 }}>
            {t("Your Next Step", "Langkah Selanjutnya", "Jouw Volgende Stap")}
          </p>
          <p style={{ fontFamily: serif, fontSize: 22, color: navy, lineHeight: 1.6, marginBottom: 24, fontStyle: "italic" }}>
            {t(
              "Name one person you will intentionally invite, invest in, or release this week — and what you'll do.",
              "Sebutkan satu orang yang akan Anda undang, investasikan, atau lepaskan minggu ini — dan apa yang akan Anda lakukan.",
              "Noem één persoon die je deze week bewust wilt uitnodigen, in wilt investeren of wilt loslaten — en wat je zult doen."
            )}
          </p>
          {!committed ? (
            <>
              <textarea value={commitment} onChange={e => setCommitment(e.target.value)}
                placeholder={t("Write here...", "Tuliskan di sini...", "Schrijf hier...")}
                style={{
                  width: "100%", minHeight: 100, padding: "16px",
                  border: "1px solid oklch(80% 0.012 80)", borderRadius: 8,
                  fontFamily: "Montserrat, sans-serif", fontSize: 14, color: bodyText,
                  background: offWhite, resize: "vertical", lineHeight: 1.6, boxSizing: "border-box",
                }} />
              <button onClick={() => { if (commitment.trim()) setCommitted(true); }} disabled={!commitment.trim()} style={{
                marginTop: 14, padding: "12px 28px",
                background: commitment.trim() ? navy : "oklch(80% 0.01 80)",
                color: offWhite, border: "none", borderRadius: 6,
                fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13,
                cursor: commitment.trim() ? "pointer" : "default",
              }}>
                {t("I'm Committing to This", "Saya Berkomitmen pada Ini", "Hier Verbind Ik Mij Aan")}
              </button>
            </>
          ) : (
            <div style={{ padding: "22px 26px", background: offWhite, borderRadius: 10, border: "1px solid oklch(88% 0.008 80)" }}>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: orange, textTransform: "uppercase", marginBottom: 8 }}>
                {t("Noted", "Tercatat", "Genoteerd")}
              </p>
              <p style={{ fontFamily: serif, fontSize: 19, color: navy, fontStyle: "italic", lineHeight: 1.65, margin: 0 }}>
                "{commitment}"
              </p>
            </div>
          )}
        </div>

        {/* Back */}
        <div style={{ textAlign: "center" }}>
          <Link href="/resources" style={{
            fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700,
            color: navy, textDecoration: "none", letterSpacing: "0.08em",
            padding: "12px 28px", border: `2px solid ${navy}`, borderRadius: 6, display: "inline-block",
          }}>
            {t("← Content Library", "← Perpustakaan Konten", "← Contentbibliotheek")}
          </Link>
        </div>
      </div>

      {/* Verse popup */}
      {activeVerse && (
        <div onClick={() => setActiveVerse(null)} style={{
          position: "fixed", inset: 0, background: "oklch(10% 0.05 260 / 0.6)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: offWhite, borderRadius: 16, padding: "40px 36px", maxWidth: 520, width: "100%",
          }}>
            <p style={{ fontFamily: serif, fontSize: 22, lineHeight: 1.65, color: navy, fontStyle: "italic", marginBottom: 16 }}>
              "{lang === "en" ? VERSES[activeVerse].en : lang === "id" ? VERSES[activeVerse].id : VERSES[activeVerse].nl}"
            </p>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, color: orange, letterSpacing: "0.08em", marginBottom: 24 }}>
              — {lang === "en" ? VERSES[activeVerse].en_ref : lang === "id" ? VERSES[activeVerse].id_ref : VERSES[activeVerse].nl_ref} {lang === "en" ? "(NIV)" : lang === "id" ? "(TB)" : "(NBV)"}
            </p>
            <button onClick={() => setActiveVerse(null)} style={{
              padding: "10px 24px", background: navy, color: offWhite, border: "none", borderRadius: 6,
              fontFamily: "Montserrat, sans-serif", fontWeight: 700, cursor: "pointer",
            }}>
              {t("Close", "Tutup", "Sluiten")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
