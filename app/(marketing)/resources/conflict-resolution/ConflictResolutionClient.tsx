"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const MODES = [
  {
    name: { en: "Competing", id: "Bersaing", nl: "Concurreren" },
    en_desc: "Win-lose. High assertiveness, low cooperation. Prioritises your own goals at the expense of others.",
    id_desc: "Menang-kalah. Asertivitas tinggi, kerja sama rendah. Memprioritaskan tujuan Anda sendiri dengan mengorbankan orang lain.",
    nl_desc: "Win-verlies. Hoge assertiviteit, lage samenwerking. Prioriteert eigen doelen ten koste van anderen.",
    en_when: "Emergencies, when a position needs defending, or when someone is taking advantage of non-competitive behaviour.",
    id_when: "Kedaruratan, saat posisi perlu dipertahankan, atau saat seseorang memanfaatkan perilaku tidak kompetitif.",
    nl_when: "Noodsituaties, wanneer een positie verdedigd moet worden, of wanneer iemand misbruik maakt van niet-competitief gedrag.",
    color: "oklch(45% 0.15 20)",
    colorBg: "oklch(97% 0.02 20)",
  },
  {
    name: { en: "Collaborating", id: "Berkolaborasi", nl: "Samenwerken" },
    en_desc: "Win-win. High assertiveness, high cooperation. Seeks solutions that fully satisfy all parties.",
    id_desc: "Menang-menang. Asertivitas tinggi, kerja sama tinggi. Mencari solusi yang sepenuhnya memuaskan semua pihak.",
    nl_desc: "Win-win. Hoge assertiviteit, hoge samenwerking. Zoekt oplossingen die alle partijen volledig tevredenstellen.",
    en_when: "Both sets of concerns are important, long-term relationship is essential, or when commitment from all parties is required.",
    id_when: "Kedua set kepedulian penting, hubungan jangka panjang sangat penting, atau ketika komitmen dari semua pihak diperlukan.",
    nl_when: "Beide belangen zijn belangrijk, langdurige relatie is essentieel, of wanneer inzet van alle partijen vereist is.",
    color: "oklch(40% 0.12 150)",
    colorBg: "oklch(96% 0.02 150)",
  },
  {
    name: { en: "Compromising", id: "Berkompromi", nl: "Compromissen Sluiten" },
    en_desc: "Partial satisfaction for everyone. Middle ground — neither fully assertive nor fully cooperative.",
    id_desc: "Kepuasan sebagian untuk semua. Jalan tengah — tidak sepenuhnya asertif maupun sepenuhnya kooperatif.",
    nl_desc: "Gedeeltelijke tevredenheid voor iedereen. Middenweg — niet volledig assertief noch volledig coöperatief.",
    en_when: "Goals are moderately important, as a temporary settlement, or when equal power requires a balanced outcome.",
    id_when: "Tujuan cukup penting, sebagai penyelesaian sementara, atau ketika kekuatan setara memerlukan hasil yang seimbang.",
    nl_when: "Doelen zijn matig belangrijk, als tijdelijke regeling, of wanneer gelijke macht een evenwichtige uitkomst vereist.",
    color: "oklch(50% 0.12 45)",
    colorBg: "oklch(97% 0.02 45)",
  },
  {
    name: { en: "Avoiding", id: "Menghindari", nl: "Vermijden" },
    en_desc: "No win-no lose. Evades or postpones the conflict. Low assertiveness, low cooperation.",
    id_desc: "Tidak menang-tidak kalah. Menghindari atau menunda konflik. Asertivitas rendah, kerja sama rendah.",
    nl_desc: "Geen win-geen verlies. Ontwijkt of stelt het conflict uit. Lage assertiviteit, lage samenwerking.",
    en_when: "Issue is trivial, more pressing matters exist, time is needed to cool down, or when direct address would worsen the situation.",
    id_when: "Masalah sepele, ada hal yang lebih mendesak, waktu dibutuhkan untuk mendinginkan diri, atau ketika alamat langsung akan memperburuk situasi.",
    nl_when: "Kwestie is triviaal, dringendere zaken bestaan, tijd nodig om te kalmeren, of wanneer directe aanpak de situatie zou verslechteren.",
    color: "oklch(50% 0.14 260)",
    colorBg: "oklch(96% 0.02 260)",
  },
  {
    name: { en: "Accommodating", id: "Mengakomodasi", nl: "Aanpassen" },
    en_desc: "Yields to others. Low assertiveness, high cooperation. Prioritises the relationship over your own position.",
    id_desc: "Menyerahkan kepada orang lain. Asertivitas rendah, kerja sama tinggi. Memprioritaskan hubungan di atas posisi Anda sendiri.",
    nl_desc: "Geeft toe aan anderen. Lage assertiviteit, hoge samenwerking. Prioriteert de relatie boven uw eigen positie.",
    en_when: "You realise you are wrong, the issue matters more to the other person, or preserving harmony serves a greater long-term purpose.",
    id_when: "Anda menyadari Anda salah, masalah lebih penting bagi orang lain, atau menjaga harmoni melayani tujuan jangka panjang yang lebih besar.",
    nl_when: "Je realiseert je dat je ongelijk hebt, de kwestie is belangrijker voor de ander, of harmonie bewaren dient een groter langetermijndoel.",
    color: "oklch(45% 0.10 100)",
    colorBg: "oklch(96% 0.01 100)",
  },
];

const SCENARIOS = [
  {
    title: { en: "The Third-Party Bridge", id: "Jembatan Pihak Ketiga", nl: "De Derdepartijbrug" },
    setup: {
      en: "A Dutch leader has a performance issue with an Indonesian staff member. He approaches the conversation directly: 'I need to discuss something concerning your performance.' The staff member grows visibly uncomfortable and gives non-committal answers.",
      id: "Seorang pemimpin Belanda memiliki masalah kinerja dengan staf Indonesia. Ia mendekati percakapan secara langsung. Staf menjadi jelas tidak nyaman dan memberikan jawaban yang tidak berkomitmen.",
      nl: "Een Nederlandse leider heeft een prestatieprobleem met een Indonesisch personeelslid. Hij benadert het gesprek direct. Het personeelslid wordt zichtbaar ongemakkelijk.",
    },
    breakdown: {
      en: "Direct confrontation activates face-saving defences. The staff member can't process the feedback in the moment and shuts down. The issue remains unresolved and the relationship is damaged.",
      id: "Konfrontasi langsung mengaktifkan pertahanan menyelamatkan muka. Staf tidak dapat memproses umpan balik saat itu dan menutup diri. Masalah tetap tidak terselesaikan.",
      nl: "Directe confrontatie activeert gezichtsbesparende verdedigingen. Het personeelslid kan de feedback niet op het moment verwerken en sluit zich af.",
    },
    response: {
      en: "Work through a respected third party — a mutual colleague, a community elder, or a trusted intermediary who can carry the message privately and without the confrontation dynamic. Indirect resolution is not evasion; in many cultures, it is the only path to genuine resolution.",
      id: "Bekerja melalui pihak ketiga yang dihormati — rekan bersama, tetua komunitas, atau perantara terpercaya yang dapat membawa pesan secara pribadi. Resolusi tidak langsung bukan penghindaran; dalam banyak budaya, itu adalah satu-satunya jalan menuju resolusi sejati.",
      nl: "Werk via een gerespecteerde derde partij — een gezamenlijke collega, een gemeenschapsoudste, of een vertrouwde tussenpersoon. Indirecte oplossing is geen ontwijking; in veel culturen is het het enige pad naar echte oplossing.",
    },
  },
  {
    title: { en: "The Face-Saving Bridge", id: "Jembatan Menyelamatkan Muka", nl: "De Gezichtsbesparende Brug" },
    setup: {
      en: "In a team meeting, a Filipino colleague presents a proposal based on outdated information. A Western team member immediately challenges the data: 'That data is from two years ago — the situation has completely changed since then.'",
      id: "Dalam rapat tim, rekan Filipina mempresentasikan proposal berdasarkan informasi yang sudah usang. Anggota tim Barat segera menantang data tersebut.",
      nl: "In een teamvergadering presenteert een Filipijnse collega een voorstel op basis van verouderde informatie. Een Westers teamlid daagt de data onmiddellijk uit.",
    },
    breakdown: {
      en: "The Filipino colleague has lost face publicly. He becomes defensive and doubles down on his position — not because he's right, but because retreating would deepen the humiliation. The conflict escalates beyond the original issue.",
      id: "Rekan Filipina telah kehilangan muka di depan umum. Ia menjadi defensif dan mempertahankan posisinya — bukan karena ia benar, tetapi karena mundur akan memperdalam penghinaan.",
      nl: "De Filipijnse collega heeft publiekelijk gezicht verloren. Hij wordt defensief en verdubbelt zijn positie — niet omdat hij gelijk heeft, maar omdat terugtrekken de vernedering zou verdiepen.",
    },
    response: {
      en: "Build a face-saving bridge by reframing the situation: 'A lot has changed since the project began — I think the landscape looks different now than when this analysis was done.' The colleague can then update their position without retreating from a public humiliation.",
      id: "Bangun jembatan menyelamatkan muka dengan membingkai ulang situasi: 'Banyak yang telah berubah sejak proyek dimulai — saya pikir lanskap terlihat berbeda sekarang.' Rekan kemudian dapat memperbarui posisinya tanpa mundur dari penghinaan publik.",
      nl: "Bouw een gezichtsbesparende brug door de situatie te herkaderen: 'Er is veel veranderd sinds het project begon — ik denk dat het landschap er nu anders uitziet.' De collega kan dan zijn positie bijwerken zonder terug te trekken van publieke vernedering.",
    },
  },
  {
    title: { en: "The Suppressed Conflict", id: "Konflik yang Ditekan", nl: "Het Onderdrukte Conflict" },
    setup: {
      en: "Two Indonesian team members have a significant disagreement over how a programme should be run. Rather than raising it, they each quietly accommodate the other in a pattern of mutual avoidance. Both are internally frustrated but maintain outward harmony.",
      id: "Dua anggota tim Indonesia memiliki ketidaksepakatan signifikan tentang bagaimana program harus dijalankan. Alih-alih mengangkatnya, mereka masing-masing diam-diam mengakomodasi yang lain.",
      nl: "Twee Indonesische teamleden hebben een significante meningsverschil. In plaats van het te uiten, accommoderen ze elkaar in een patroon van wederzijdse vermijding.",
    },
    breakdown: {
      en: "The avoidance keeps surface harmony intact but the unresolved tension slowly erodes team effectiveness. Small decisions begin to stall as neither person wants to commit to a direction. The Western leader doesn't see a conflict — because there isn't one on the surface.",
      id: "Penghindaran menjaga harmoni permukaan tetapi ketegangan yang tidak terselesaikan perlahan mengikis efektivitas tim. Keputusan kecil mulai terhenti karena tidak ada yang ingin berkomitmen.",
      nl: "De vermijding houdt oppervlakteharmonie intact maar de onopgeloste spanning erodeert langzaam de teameffectiviteit.",
    },
    response: {
      en: "Create a structured process that allows conflict to surface without direct confrontation. One-on-one conversations with each party, a facilitated joint problem-solving session framed around 'how do we best serve the mission?' rather than 'who is right?'",
      id: "Buat proses terstruktur yang memungkinkan konflik muncul tanpa konfrontasi langsung. Percakapan satu lawan satu dengan setiap pihak, sesi pemecahan masalah bersama yang difasilitasi.",
      nl: "Creëer een gestructureerd proces dat conflict laat opkomen zonder directe confrontatie. Een-op-een gesprekken met elke partij, een gefaciliteerde gezamenlijke probleemoplossingsessie.",
    },
  },
];

const STRATEGIES = [
  {
    en: "Build face-saving bridges before confronting errors — reframe the situation so both parties can adjust without public humiliation.",
    id: "Bangun jembatan menyelamatkan muka sebelum mengkonfrontasi kesalahan — bingkai ulang situasi sehingga kedua pihak dapat menyesuaikan tanpa penghinaan publik.",
    nl: "Bouw gezichtsbesparende bruggen voor je fouten confronteert — herkadering zodat beide partijen kunnen aanpassen zonder publieke vernedering.",
  },
  {
    en: "In high-context cultures, use respected third-party intermediaries to carry messages and facilitate resolution. Indirect is not evasion — it's wisdom.",
    id: "Dalam budaya konteks tinggi, gunakan perantara pihak ketiga yang dihormati untuk membawa pesan dan memfasilitasi resolusi. Tidak langsung bukan penghindaran — itu kebijaksanaan.",
    nl: "Gebruik in hoge-context culturen gerespecteerde derde partij intermediairs. Indirect is geen ontwijking — het is wijsheid.",
  },
  {
    en: "Separate people from the problem. Focus on interests (what people actually need) rather than positions (what they say they want).",
    id: "Pisahkan orang dari masalah. Fokus pada kepentingan (apa yang sebenarnya dibutuhkan orang) daripada posisi (apa yang mereka katakan mereka inginkan).",
    nl: "Scheid mensen van het probleem. Focus op belangen (wat mensen werkelijk nodig hebben) in plaats van posities.",
  },
  {
    en: "Create structured one-on-one conversations before any group resolution attempt — understand each party's position privately first.",
    id: "Buat percakapan satu lawan satu terstruktur sebelum upaya resolusi kelompok apa pun — pahami posisi setiap pihak secara pribadi terlebih dahulu.",
    nl: "Creëer gestructureerde één-op-één gesprekken voor elke groepsresolutiepoging — begrijp eerst privé de positie van elke partij.",
  },
  {
    en: "Frame conflict resolution around the shared mission: 'How do we best serve what we're here to accomplish together?' shifts the question from blame to direction.",
    id: "Bingkai resolusi konflik seputar misi bersama: 'Bagaimana kita paling baik melayani apa yang kita di sini untuk capai bersama?' mengalihkan pertanyaan dari kesalahan ke arah.",
    nl: "Kader conflictoplossing rond de gedeelde missie: 'Hoe dienen we het beste wat we hier samen moeten bereiken?' verschuift de vraag van schuld naar richting.",
  },
];

const REFLECTION = [
  {
    roman: "I",
    en: "Which Thomas-Kilmann mode do you default to under pressure — and when does that default serve you, and when does it limit you?",
    id: "Mode Thomas-Kilmann mana yang Anda gunakan secara default di bawah tekanan — dan kapan default itu melayani Anda, dan kapan membatasi Anda?",
    nl: "Welke Thomas-Kilmann modus gebruik je standaard onder druk — en wanneer dient die standaard je, en wanneer beperkt hij je?",
  },
  {
    roman: "II",
    en: "Think of a conflict you avoided for too long. What was the cost — to you, to the relationship, to the mission?",
    id: "Pikirkan konflik yang Anda hindari terlalu lama. Apa biayanya — untuk Anda, untuk hubungan, untuk misi?",
    nl: "Denk aan een conflict dat je te lang vermeed. Wat waren de kosten — voor jou, voor de relatie, voor de missie?",
  },
  {
    roman: "III",
    en: "In your cultural context, what is the accepted way to address conflict — and how can you work within that system rather than against it?",
    id: "Dalam konteks budaya Anda, apa cara yang diterima untuk mengatasi konflik — dan bagaimana Anda bisa bekerja dalam sistem itu daripada melawannya?",
    nl: "In jouw culturele context, wat is de geaccepteerde manier om conflict aan te pakken — en hoe kun je binnen dat systeem werken in plaats van ertegen?",
  },
  {
    roman: "IV",
    en: "Romans 12:18 says 'as far as it depends on you, live at peace with everyone.' What is currently within your control that you haven't yet done?",
    id: "Roma 12:18 berkata 'sedapat-dapatnya, kalau hal itu bergantung padamu, hiduplah dalam perdamaian dengan semua orang.' Apa yang saat ini dalam kendali Anda yang belum Anda lakukan?",
    nl: "Romeinen 12:18 zegt 'voor zover het van u afhangt, leef dan in vrede met alle mensen.' Wat is momenteel binnen jouw controle dat je nog niet hebt gedaan?",
  },
  {
    roman: "V",
    en: "Matthew 18:15 begins with 'go and point out their fault, just between the two of you.' Who do you need to have a private conversation with this week?",
    id: "Matius 18:15 dimulai dengan 'pergi dan tunjukkan kesalahannya kepadanya, hanya antara kamu berdua.' Dengan siapa Anda perlu melakukan percakapan pribadi minggu ini?",
    nl: "Matteüs 18:15 begint met 'ga en wijs hem zijn fout aan, maar alleen tussen jou en hem.' Met wie moet je deze week een privégesprek hebben?",
  },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function ConflictResolutionClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [openScenario, setOpenScenario] = useState<number | null>(null);
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("conflict-resolution");
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
          {t("Conflict Resolution", "Resolusi Konflik", "Conflictoplossing")}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(85% 0.03 80)", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.6, fontStyle: "italic" }}>
          {t(
            '"If it is possible, as far as it depends on you, live at peace with everyone." — Romans 12:18',
            '"Sedapat-dapatnya, kalau hal itu bergantung padamu, hiduplah dalam perdamaian dengan semua orang." — Roma 12:18',
            '"Voor zover het van u afhangt, leef dan in vrede met alle mensen." — Romeinen 12:18'
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
            "Conflict is not the problem. Conflict handled badly is. Every team — especially cross-cultural teams — will experience friction, disagreement, and misalignment. The difference between teams that grow through conflict and teams that fracture under it is not the absence of conflict but the presence of leaders who know how to navigate it.",
            "Konflik bukan masalahnya. Konflik yang ditangani dengan buruk adalah masalahnya. Setiap tim — terutama tim lintas budaya — akan mengalami gesekan, ketidaksepakatan, dan ketidakselarasan.",
            "Conflict is niet het probleem. Slecht afgehandeld conflict is het probleem. Elk team — vooral interculturele teams — zal wrijving, meningsverschillen en misalignment ervaren."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75 }}>
          {t(
            "In cross-cultural contexts, conflict resolution requires an extra layer of sophistication. Not only do people disagree — they disagree through different cultural frameworks. Direct confrontation that resolves conflict in Amsterdam can detonate it in Manila. The tools in this module will help you navigate both.",
            "Dalam konteks lintas budaya, resolusi konflik membutuhkan lapisan kecanggihan ekstra. Orang tidak hanya tidak setuju — mereka tidak setuju melalui kerangka budaya yang berbeda.",
            "In interculturele contexten vereist conflictoplossing een extra laag verfijning. Mensen zijn het niet alleen oneens — ze zijn het oneens via verschillende culturele kaders."
          )}
        </p>
      </div>

      {/* 5 modes */}
      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 12, textAlign: "center" }}>
            {t("The 5 Conflict Modes", "5 Mode Konflik", "De 5 Conflictmodi")}
          </h2>
          <p style={{ textAlign: "center", color: bodyText, fontSize: 15, marginBottom: 48 }}>
            {t("Thomas-Kilmann model — every mode has its right moment", "Model Thomas-Kilmann — setiap mode memiliki momennya yang tepat", "Thomas-Kilmann model — elke modus heeft zijn juiste moment")}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {MODES.map((m) => (
              <div key={m.name.en} style={{ background: m.colorBg, padding: "24px 24px" }}>
                <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 16, fontWeight: 700, color: m.color, marginBottom: 10 }}>
                  {m.name[lang]}
                </h3>
                <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.7, marginBottom: 14 }}>
                  {lang === "en" ? m.en_desc : lang === "id" ? m.id_desc : m.nl_desc}
                </p>
                <p style={{ fontSize: 12, fontWeight: 700, color: m.color, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                  {t("Use when:", "Gunakan ketika:", "Gebruik wanneer:")}
                </p>
                <p style={{ fontSize: 13, color: bodyText, lineHeight: 1.65, margin: 0 }}>
                  {lang === "en" ? m.en_when : lang === "id" ? m.id_when : m.nl_when}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scenarios */}
      <div style={{ padding: "72px 24px", maxWidth: 800, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 12, textAlign: "center" }}>
          {t("Three Cross-Cultural Conflict Patterns", "Tiga Pola Konflik Lintas Budaya", "Drie Interculturele Conflictpatronen")}
        </h2>
        <p style={{ textAlign: "center", color: bodyText, fontSize: 15, marginBottom: 48 }}>
          {t("What goes wrong — and how to navigate each", "Yang salah — dan cara menavigasinya", "Wat fout gaat — en hoe elk te navigeren")}
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
                    <p style={{ fontSize: 13, fontWeight: 700, color: "oklch(40% 0.12 160)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{t("The Path Forward", "Jalan ke Depan", "De Weg Vooruit")}</p>
                    <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>{s.response[lang]}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Biblical anchor */}
      <div style={{ background: navy, padding: "72px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
            {t("Faith Anchor", "Jangkar Iman", "Geloofsanker")}
          </p>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: offWhite, marginBottom: 48 }}>
            {t("Conflict and Peace in Scripture", "Konflik dan Damai dalam Kitab Suci", "Conflict en Vrede in de Schrift")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {[
              {
                ref: "Matthew 18:15",
                verse: {
                  en: '"If your brother or sister sins, go and point out their fault, just between the two of you. If they listen to you, you have won them over."',
                  id: '"Apabila saudaramu berbuat dosa, pergilah dan tegurlah dia di bawah empat mata. Jika ia mendengarkan engkau, engkau telah mendapatnya kembali."',
                  nl: '"Als uw broeder of zuster tegen u zondigt, ga dan naar hem toe en wijs hem op zijn fout, maar alleen tussen u beiden. Als hij luistert, hebt u uw broeder gewonnen."',
                },
                comment: {
                  en: "Jesus begins with privacy. The first step is not public confrontation but personal, private address. This aligns remarkably well with high-context cultures — the principle of going to someone directly and privately before any public process is both cross-culturally wise and scripturally grounded.",
                  id: "Yesus memulai dengan privasi. Langkah pertama bukan konfrontasi publik tetapi alamat pribadi dan privat. Ini selaras dengan budaya konteks tinggi — prinsip pergi ke seseorang secara langsung dan pribadi.",
                  nl: "Jezus begint met privacy. De eerste stap is niet publieke confrontatie maar persoonlijke, private aanpak. Dit sluit opvallend goed aan bij hoge-context culturen.",
                },
              },
              {
                ref: "Romans 12:18",
                verse: {
                  en: '"If it is possible, as far as it depends on you, live at peace with everyone."',
                  id: '"Sedapat-dapatnya, kalau hal itu bergantung padamu, hiduplah dalam perdamaian dengan semua orang."',
                  nl: '"Voor zover het van u afhangt, leef dan in vrede met alle mensen."',
                },
                comment: {
                  en: "Paul acknowledges that peace is not always fully achievable. 'As far as it depends on you' is an important qualifier — you can only control your contribution to the conflict. The leader's responsibility is to bring their full effort to peace, even when full resolution is not possible.",
                  id: "Paulus mengakui bahwa perdamaian tidak selalu sepenuhnya dapat dicapai. 'Sedapat-dapatnya bergantung padamu' adalah kualifikasi penting — Anda hanya dapat mengontrol kontribusi Anda pada konflik.",
                  nl: "Paulus erkent dat vrede niet altijd volledig haalbaar is. 'Voor zover het van u afhangt' is een belangrijke kwalificatie — je kunt alleen je bijdrage aan het conflict controleren.",
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
