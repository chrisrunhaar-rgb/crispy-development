"use client";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

// ── VERSE DATA ────────────────────────────────────────────────────────────────

const VERSES = {
  "deut-6-6-7": {
    en_ref: "Deuteronomy 6:6–7",
    id_ref: "Ulangan 6:6–7",
    nl_ref: "Deuteronomium 6:6–7",
    en: "These commandments that I give you today are to be on your hearts. Impress them on your children. Talk about them when you sit at home and when you walk along the road, when you lie down and when you get up.",
    id: "Apa yang kuperintahkan kepadamu pada hari ini haruslah engkau perhatikan, haruslah engkau mengajarkannya berulang-ulang kepada anak-anakmu dan membicarakannya apabila engkau duduk di rumahmu, apabila engkau sedang dalam perjalanan, apabila engkau berbaring dan apabila engkau bangun.",
    nl: "Houd deze geboden, die ik u vandaag opleg, steeds in gedachten. Prent ze uw kinderen in en spreek er steeds over, thuis en onderweg, als u naar bed gaat en als u opstaat.",
  },
  "mark-10-14": {
    en_ref: "Mark 10:14",
    id_ref: "Markus 10:14",
    nl_ref: "Marcus 10:14",
    en: "Let the little children come to me, and do not hinder them, for the kingdom of God belongs to such as these.",
    id: "Biarkanlah anak-anak itu datang kepada-Ku, jangan menghalang-halangi mereka, sebab orang-orang yang seperti itulah yang empunya Kerajaan Allah.",
    nl: "Laat de kinderen bij me komen, houd ze niet tegen, want het koninkrijk van God behoort toe aan wie is zoals zij.",
  },
  "prov-22-6": {
    en_ref: "Proverbs 22:6",
    id_ref: "Amsal 22:6",
    nl_ref: "Spreuken 22:6",
    en: "Start children off on the way they should go, and even when they are old they will not turn from it.",
    id: "Didiklah orang muda menurut jalan yang patut baginya, maka pada masa tuanya pun ia tidak akan menyimpang dari pada jalan itu.",
    nl: "Leer een kind de weg die het moet gaan, ook als het oud is zal het die weg niet verlaten.",
  },
};

// ── SAFETY MARKERS ────────────────────────────────────────────────────────────

const SAFETY_MARKERS = [
  {
    en_label: "Predictability",
    id_label: "Kemampuan Diprediksi",
    nl_label: "Voorspelbaarheid",
    en_desc:
      "Children feel safe when they know what to expect from the adults in their lives. Consistent routines, reliable responses, and emotional steadiness signal: this home is trustworthy.",
    id_desc:
      "Anak-anak merasa aman ketika mereka tahu apa yang bisa diharapkan dari orang dewasa di sekitar mereka. Rutinitas yang konsisten, respons yang dapat diandalkan, dan kestabilan emosional memberi sinyal: rumah ini dapat dipercaya.",
    nl_desc:
      "Kinderen voelen zich veilig als ze weten wat ze van de volwassenen in hun leven kunnen verwachten. Consistente routines, betrouwbare reacties en emotionele stabiliteit geven het signaal: dit thuis is betrouwbaar.",
    en_practice:
      "In practice: dinner at roughly the same time. A bedtime ritual that doesn't change when ministry is busy. A phrase you reliably say when leaving and returning.",
    id_practice:
      "Dalam praktik: makan malam pada waktu yang kurang lebih sama. Ritual tidur yang tidak berubah saat pelayanan sedang sibuk. Ungkapan yang selalu Anda ucapkan saat pergi dan kembali.",
    nl_practice:
      "In de praktijk: avondeten op ongeveer hetzelfde tijdstip. Een slaapritueel dat niet verandert als het bediening druk is. Een zin die je betrouwbaar zegt bij vertrek en terugkomst.",
    icon: "◉",
  },
  {
    en_label: "Responsiveness",
    id_label: "Ketanggapan",
    nl_label: "Responsiviteit",
    en_desc:
      "When a child reaches out — through words, behaviour, tears, or silence — the question they are asking is: do you notice me? A responsive parent doesn't fix everything; they turn toward the child first.",
    id_desc:
      "Ketika seorang anak menjangkau — melalui kata-kata, perilaku, air mata, atau diam — pertanyaan yang mereka ajukan adalah: apakah kamu memperhatikanku? Orang tua yang tanggap tidak memperbaiki segalanya; mereka berpaling kepada anak terlebih dahulu.",
    nl_desc:
      "Wanneer een kind reikt — via woorden, gedrag, tranen of stilte — is de vraag die ze stellen: merk je me op? Een responsieve ouder lost niet alles op; ze draaien zich eerst naar het kind toe.",
    en_practice:
      "In practice: put the phone face-down. Ask one more question before moving on. When a child is upset, name the feeling before explaining why they shouldn't have it.",
    id_practice:
      "Dalam praktik: letakkan telepon dengan layar menghadap ke bawah. Ajukan satu pertanyaan lagi sebelum melanjutkan. Ketika anak sedang kesal, namai perasaannya sebelum menjelaskan mengapa mereka seharusnya tidak memilikinya.",
    nl_practice:
      "In de praktijk: leg de telefoon met het scherm naar beneden. Stel nog één vraag voor je verdergaat. Als een kind overstuur is, benoem het gevoel voor je uitlegt waarom ze het niet zouden moeten hebben.",
    icon: "◎",
  },
  {
    en_label: "Repair",
    id_label: "Pemulihan",
    nl_label: "Herstel",
    en_desc:
      "No family is without rupture. The question is not whether conflict, harshness, or disconnection happen — it's whether they get repaired. A repaired rupture actually deepens trust more than if the rupture never happened.",
    id_desc:
      "Tidak ada keluarga yang tanpa konflik. Pertanyaannya bukan apakah konflik, ketidakramahan, atau pemutusan hubungan terjadi — melainkan apakah hal-hal itu diperbaiki. Hubungan yang dipulihkan justru memperdalam kepercayaan lebih dari seandainya keretakan itu tidak pernah terjadi.",
    nl_desc:
      "Geen enkel gezin is zonder breuk. De vraag is niet of conflict, hardheid of verwijdering plaatsvindt — het is of ze worden hersteld. Een herstelde breuk verdiept het vertrouwen juist meer dan wanneer de breuk nooit was voorgevallen.",
    en_practice:
      "In practice: go back after the difficult moment and name it. \"I was too sharp earlier. That wasn't fair. I'm sorry.\" This is not weakness — it is the most powerful thing a parent can model.",
    id_practice:
      "Dalam praktik: kembali setelah momen yang sulit dan sebutkan. \"Tadi aku terlalu keras. Itu tidak adil. Aku minta maaf.\" Ini bukan kelemahan — ini adalah hal paling kuat yang bisa dicontohkan orang tua.",
    nl_practice:
      "In de praktijk: ga terug na het moeilijke moment en benoem het. \"Ik was net te scherp. Dat was niet eerlijk. Het spijt me.\" Dit is geen zwakte — het is het krachtigste wat een ouder kan voordoen.",
    icon: "◈",
  },
  {
    en_label: "Permission to Feel",
    id_label: "Izin untuk Merasakan",
    nl_label: "Toestemming om te Voelen",
    en_desc:
      "Children in ministry families often learn quickly which emotions are acceptable and which ones create anxiety in the adults around them. Emotional safety means every feeling has permission to exist — even the inconvenient ones.",
    id_desc:
      "Anak-anak dalam keluarga pelayanan sering belajar dengan cepat emosi mana yang dapat diterima dan mana yang menciptakan kegelisahan pada orang dewasa di sekitar mereka. Keamanan emosional berarti setiap perasaan memiliki izin untuk ada — bahkan yang tidak nyaman.",
    nl_desc:
      "Kinderen in bedieningsgezinnen leren vaak snel welke emoties aanvaardbaar zijn en welke angst oproepen bij de volwassenen om hen heen. Emotionele veiligheid betekent dat elk gevoel toestemming heeft om te bestaan — ook de ongemakkelijke.",
    en_practice:
      "In practice: replace \"Don't be upset about that\" with \"It makes sense you feel that way.\" Your child's emotions don't need to be managed away — they need to be witnessed.",
    id_practice:
      "Dalam praktik: ganti \"Jangan kesal tentang hal itu\" dengan \"Masuk akal kamu merasakan itu.\" Emosi anak Anda tidak perlu dikelola menjadi hilang — mereka perlu disaksikan.",
    nl_practice:
      "In de praktijk: vervang 'Wees daar niet boos om' door 'Het is logisch dat je je zo voelt.' De emoties van je kind hoeven niet weggemanaged te worden — ze moeten worden gezien.",
    icon: "◇",
  },
];

// ── REPAIR CONVERSATION ───────────────────────────────────────────────────────

const REPAIR_STEPS = [
  {
    en_label: "Acknowledge",
    id_label: "Pengakuan",
    nl_label: "Erkenning",
    en_desc:
      "Name specifically what happened — not a vague apology, but an honest account of what the child experienced.",
    id_desc:
      "Sebutkan secara spesifik apa yang terjadi — bukan permintaan maaf yang samar, tetapi penggambaran jujur tentang apa yang dialami anak.",
    nl_desc:
      "Benoem specifiek wat er is gebeurd — geen vage verontschuldiging, maar een eerlijk relaas van wat het kind heeft ervaren.",
    en_example:
      "\"Earlier tonight I raised my voice when you were trying to tell me something. That was wrong of me. You were talking and I cut you off.\"",
    id_example:
      "\"Tadi malam aku meninggikan suara ketika kamu sedang mencoba menceritakan sesuatu. Itu salah dariku. Kamu sedang berbicara dan aku memotongmu.\"",
    nl_example:
      "\"Vanvond verhief ik mijn stem terwijl jij me iets probeerde te vertellen. Dat was verkeerd van me. Je was aan het praten en ik onderbrak je.\"",
  },
  {
    en_label: "Apologise",
    id_label: "Maaf",
    nl_label: "Verontschuldiging",
    en_desc:
      "A clean apology — no \"I'm sorry, but.\" No explanation that shifts the blame back. Just the apology itself.",
    id_desc:
      "Permintaan maaf yang bersih — tidak ada \"Aku minta maaf, tapi.\" Tidak ada penjelasan yang mengalihkan kesalahan kembali. Hanya permintaan maaf itu sendiri.",
    nl_desc:
      "Een schone verontschuldiging — geen 'het spijt me, maar.' Geen uitleg die de schuld terugschuift. Alleen de verontschuldiging zelf.",
    en_example:
      "\"I'm sorry. You didn't deserve that. I was stressed and I took it out on you, and that wasn't okay.\"",
    id_example:
      "\"Aku minta maaf. Kamu tidak layak mendapatkan itu. Aku sedang stres dan melampiaskannya kepadamu, dan itu tidak baik.\"",
    nl_example:
      "\"Het spijt me. Je verdiende dat niet. Ik was gestresst en ik reageerde me op jou af, en dat was niet goed.\"",
  },
  {
    en_label: "Reconnect",
    id_label: "Pemulihan Hubungan",
    nl_label: "Herverbinding",
    en_desc:
      "Close the gap with something warm — physical or relational. The repair isn't complete until connection is restored.",
    id_desc:
      "Tutup kesenjangan dengan sesuatu yang hangat — fisik atau relasional. Pemulihan tidak selesai sampai koneksi dipulihkan.",
    nl_desc:
      "Sluit de kloof met iets warms — fysiek of relationeel. Het herstel is niet compleet totdat de verbinding is hersteld.",
    en_example:
      "\"Can I have a hug? I love you. And I want to hear what you were trying to tell me — I'm listening now.\"",
    id_example:
      "\"Boleh aku peluk? Aku menyayangimu. Dan aku ingin mendengar apa yang ingin kamu ceritakan — aku mendengarkan sekarang.\"",
    nl_example:
      "\"Mag ik je omhelzen? Ik hou van je. En ik wil horen wat je me probeerde te vertellen — ik luister nu.\"",
  },
];

// ── TCK NEEDS ─────────────────────────────────────────────────────────────────

const TCK_NEEDS = [
  {
    en_title: "Stability in a Person, Not a Place",
    id_title: "Stabilitas dalam Seseorang, Bukan Tempat",
    nl_title: "Stabiliteit in een Persoon, Niet een Plek",
    en_body:
      "TCKs rarely have one stable home, neighbourhood, or school. What they can have is a stable parent. The most consistent thing in their world needs to be you — your warmth, your availability, your emotional steadiness across every transition.",
    id_body:
      "Anak-anak lintas budaya jarang memiliki satu rumah, lingkungan, atau sekolah yang stabil. Yang bisa mereka miliki adalah orang tua yang stabil. Hal paling konsisten di dunia mereka perlu menjadi kamu — kehangatan, ketersediaan, dan kestabilan emosionalmu di setiap transisi.",
    nl_body:
      "Derdecultuurkinderen hebben zelden één stabiel thuis, buurt of school. Wat ze kunnen hebben is een stabiele ouder. Het meest consistente in hun wereld moet jij zijn — jouw warmte, beschikbaarheid en emotionele stabiliteit door elke overgang heen.",
  },
  {
    en_title: "A Shared Language for Loss",
    id_title: "Bahasa Bersama untuk Kehilangan",
    nl_title: "Een Gedeelde Taal voor Verlies",
    en_body:
      "Every international move carries accumulated losses — friends left behind, the school that finally felt familiar, a language that's fading, a version of themselves that fit somewhere and no longer does. These losses are real but often unspoken. Families who name them together grieve together. Families who don't carry the weight separately.",
    id_body:
      "Setiap perpindahan internasional membawa kehilangan yang menumpuk — teman-teman yang ditinggalkan, sekolah yang akhirnya terasa familiar, bahasa yang memudar, versi diri yang cocok di suatu tempat dan tidak lagi demikian. Kehilangan-kehilangan ini nyata tetapi sering tidak diucapkan. Keluarga yang menamai mereka bersama berduka bersama. Keluarga yang tidak menanggung beban secara terpisah.",
    nl_body:
      "Elke internationale verhuizing draagt opgestapelde verliezen met zich mee — vrienden die achterblijven, de school die eindelijk vertrouwd aanvoelde, een taal die vervaagt, een versie van zichzelf die ergens paste en dat niet meer doet. Deze verliezen zijn echt maar vaak onuitgesproken. Gezinnen die ze samen benoemen, rouwen samen. Gezinnen die dat niet doen, dragen het gewicht apart.",
  },
  {
    en_title: "Bridges Between Worlds",
    id_title: "Jembatan Antar Dunia",
    nl_title: "Bruggen Tussen Werelden",
    en_body:
      "A TCK lives in multiple cultural worlds simultaneously and often belongs fully to none of them. What they need is a parent who helps them hold multiple identities with pride rather than confusion — someone who says: all of who you are is valid, and we will figure out where you belong together.",
    id_body:
      "Seorang anak lintas budaya hidup dalam beberapa dunia budaya secara bersamaan dan sering tidak sepenuhnya termasuk dalam satupun. Yang mereka butuhkan adalah orang tua yang membantu mereka memegang berbagai identitas dengan bangga daripada kebingungan — seseorang yang berkata: semua yang kamu miliki itu valid, dan kita akan mencari tahu di mana kamu termasuk bersama-sama.",
    nl_body:
      "Een derdecultuurkind leeft tegelijkertijd in meerdere culturele werelden en behoort vaak aan geen ervan volledig toe. Wat ze nodig hebben is een ouder die hen helpt meerdere identiteiten met trots in plaats van verwarring vast te houden — iemand die zegt: alles wat je bent is geldig, en we zoeken samen uit waar je thuishoort.",
  },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function EmotionalSafetyFamiliesClient({
  userPathway,
  isSaved: initialSaved,
}: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  const [commitment, setCommitment] = useState("");
  const [committed, setCommitted] = useState(false);
  const [expandedRepair, setExpandedRepair] = useState<number | null>(null);

  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  const navy = "oklch(22% 0.10 260)";
  const orange = "oklch(65% 0.15 45)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const bodyText = "oklch(38% 0.05 260)";
  const serif = "var(--font-cormorant, Cormorant Garamond, Georgia, serif)";

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("emotional-safety-families");
      setSaved(true);
    });
  }

  function VerseRef({
    id,
    children,
  }: {
    id: string;
    children: React.ReactNode;
  }) {
    return (
      <button
        onClick={() => setActiveVerse(id)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: orange,
          fontWeight: 700,
          fontFamily: "Montserrat, sans-serif",
          fontSize: "inherit",
          padding: 0,
          textDecoration: "underline dotted",
          textUnderlineOffset: 3,
        }}
      >
        {children}
      </button>
    );
  }

  const verseData = activeVerse
    ? VERSES[activeVerse as keyof typeof VERSES]
    : null;

  return (
    <div
      style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}
    >
      <LangToggle />
      {/* Language bar */}

      {/* Hero */}
      <div style={{ background: navy, padding: "96px 24px 88px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              color: orange,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            {t(
              "Resilience & Family · Guide",
              "Ketahanan & Keluarga · Panduan",
              "Veerkracht & Gezin · Gids"
            )}
          </p>
          <h1
            style={{
              fontFamily: serif,
              fontSize: "clamp(36px, 5.5vw, 62px)",
              fontWeight: 700,
              color: offWhite,
              margin: "0 auto 32px",
              lineHeight: 1.15,
              fontStyle: "italic",
            }}
          >
            {t(
              "Emotional Safety for Families",
              "Keamanan Emosional untuk Keluarga",
              "Emotionele Veiligheid voor Gezinnen"
            )}
          </h1>
          <div
            style={{ width: 48, height: 1, background: orange, margin: "0 auto 36px" }}
          />
          <p
            style={{
              fontFamily: serif,
              fontSize: "clamp(19px, 2.4vw, 24px)",
              color: "oklch(82% 0.025 80)",
              lineHeight: 1.8,
              marginBottom: 16,
              fontStyle: "italic",
              maxWidth: 600,
              margin: "0 auto 16px",
            }}
          >
            {t(
              "Your children don't need a perfect family.",
              "Anak-anakmu tidak membutuhkan keluarga yang sempurna.",
              "Je kinderen hebben geen perfect gezin nodig."
            )}
          </p>
          <p
            style={{
              fontFamily: serif,
              fontSize: "clamp(22px, 2.8vw, 30px)",
              color: offWhite,
              lineHeight: 1.6,
              marginBottom: 48,
              fontStyle: "italic",
              maxWidth: 600,
              margin: "0 auto 48px",
              fontWeight: 700,
            }}
          >
            {t(
              "They need an emotionally safe one.",
              "Mereka membutuhkan yang aman secara emosional.",
              "Ze hebben er een nodig dat emotioneel veilig is."
            )}
          </p>
          <div
            style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
          >
            <button
              onClick={handleSave}
              disabled={saved || isPending}
              style={{
                padding: "12px 28px",
                border: "none",
                cursor: saved ? "default" : "pointer",
                fontFamily: "Montserrat, sans-serif",
                fontSize: 13,
                fontWeight: 700,
                background: saved ? "oklch(35% 0.05 260)" : orange,
                color: offWhite,
                letterSpacing: "0.04em",
                borderRadius: 4,
              }}
            >
              {saved
                ? t("✓ Saved to Dashboard", "✓ Tersimpan di Dashboard", "✓ Opgeslagen in Dashboard")
                : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
            </button>
          </div>
        </div>
      </div>

      {/* Section I — The Honest Gap */}
      <div style={{ padding: "96px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: serif,
            fontSize: 11,
            fontWeight: 400,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: orange,
            marginBottom: 32,
          }}
        >
          {t("I. The Honest Starting Point", "I. Titik Awal yang Jujur", "I. Het Eerlijke Vertrekpunt")}
        </p>
        <h2
          style={{
            fontFamily: serif,
            fontSize: "clamp(28px, 3.5vw, 40px)",
            fontWeight: 700,
            color: navy,
            marginBottom: 40,
            lineHeight: 1.2,
            fontStyle: "italic",
          }}
        >
          {t(
            "The Gap Between the Image and the Reality",
            "Kesenjangan Antara Citra dan Kenyataan",
            "De Kloof Tussen Beeld en Werkelijkheid"
          )}
        </h2>
        <div
          style={{
            fontFamily: serif,
            fontSize: "clamp(17px, 2vw, 20px)",
            color: bodyText,
            lineHeight: 1.9,
          }}
        >
          <p style={{ marginBottom: 28 }}>
            {t(
              "There is an image many ministry families carry — consciously or not — of what a godly home looks like. Calm. Spiritually ordered. Children who are resilient and grateful because they've been given a life of purpose. A family that proves, by its togetherness, that the work is worth it.",
              "Ada citra yang dibawa banyak keluarga pelayanan — sadar atau tidak — tentang seperti apa rumah tangga yang saleh itu. Tenang. Teratur secara rohani. Anak-anak yang tangguh dan bersyukur karena mereka diberi kehidupan yang penuh tujuan. Sebuah keluarga yang membuktikan, melalui kebersamaannya, bahwa pekerjaan itu sepadan.",
              "Er is een beeld dat veel bedieningsgezinnen dragen — bewust of niet — van hoe een godvruchtig thuis eruitziet. Rustig. Spiritueel geordend. Kinderen die veerkrachtig en dankbaar zijn omdat ze een doelgericht leven hebben gekregen. Een gezin dat, door zijn saamhorigheid, bewijst dat het werk de moeite waard is."
            )}
          </p>
          <p style={{ marginBottom: 28 }}>
            {t(
              "Then there is the reality. The parent who snaps after a long day of caring for others. The child who has moved four times and quietly stopped attaching to new friends. The family dinner that gets cancelled again for an urgent prayer request. The child who knows their parent's phone buzzes more than they get eye contact.",
              "Lalu ada kenyataannya. Orang tua yang meledak setelah seharian merawat orang lain. Anak yang sudah pindah empat kali dan secara diam-diam berhenti mendekat kepada teman-teman baru. Makan malam keluarga yang dibatalkan lagi karena permintaan doa yang mendesak. Anak yang tahu telepon orang tua mereka bergetar lebih sering dari mereka mendapat kontak mata.",
              "Dan dan is er de werkelijkheid. De ouder die uitbarst na een lange dag van zorgen voor anderen. Het kind dat vier keer is verhuisd en stilletjes is gestopt met hechten aan nieuwe vrienden. Het familiediner dat opnieuw wordt geannuleerd voor een dringend gebedsverzoek. Het kind dat weet dat de telefoon van hun ouder vaker trilt dan dat ze oogcontact krijgen."
            )}
          </p>
          <p style={{ marginBottom: 28 }}>
            {t(
              "This module is not about guilt. It is about the gap — and what fills it. Research on missionary kids (MKs) and third culture kids (TCKs) is clear: children raised in cross-cultural ministry contexts carry unique strengths, and unique vulnerabilities. MKs are twice as likely as non-TCK peers to report growing up with a parent struggling with mental health. Parental stress doesn't stay with the parent. It travels.",
              "Modul ini bukan tentang rasa bersalah. Ini tentang kesenjangan — dan apa yang mengisinya. Penelitian tentang anak-anak misionaris (MKs) dan anak-anak lintas budaya (TCKs) jelas: anak-anak yang dibesarkan dalam konteks pelayanan lintas budaya membawa kekuatan unik, dan kerentanan unik. MKs dua kali lebih mungkin dibandingkan teman sebaya non-TCK melaporkan tumbuh dengan orang tua yang berjuang dengan kesehatan mental. Stres orang tua tidak tinggal pada orang tua. Ia merambat.",
              "Deze module gaat niet over schuld. Het gaat over de kloof — en wat die vult. Onderzoek naar zendelingenkinderen (MKs) en derdecultuurkinderen (TCKs) is duidelijk: kinderen die opgroeien in interculturele bedieningscontexten dragen unieke sterktes, en unieke kwetsbaarheden. MKs zijn twee keer zo waarschijnlijk als niet-TCK-leeftijdsgenoten om te rapporteren dat ze opgroeiden met een ouder die worstelde met geestelijke gezondheid. Stress van ouders blijft niet bij de ouder. Het reist mee."
            )}
          </p>
          <div
            style={{
              fontFamily: serif,
              fontSize: "clamp(19px, 2.2vw, 24px)",
              fontStyle: "italic",
              color: navy,
              lineHeight: 1.75,
              padding: "8px 0 8px 28px",
              borderLeft: `3px solid ${orange}`,
              marginBottom: 28,
            }}
          >
            {t(
              "Emotional safety is not the absence of hard things. It is the presence of someone who stays steady through them — and who comes back after they don't.",
              "Keamanan emosional bukan ketiadaan hal-hal yang sulit. Ini adalah kehadiran seseorang yang tetap stabil melaluinya — dan yang kembali setelah mereka tidak demikian.",
              "Emotionele veiligheid is niet de afwezigheid van moeilijke dingen. Het is de aanwezigheid van iemand die er doorheen stabiel blijft — en die terugkomt nadat ze dat niet waren."
            )}
          </div>
          <p style={{ marginBottom: 0 }}>
            {t(
              "The good news is this: you don't need to be perfect to give your children emotional safety. You need to be present, honest, and willing to repair. That is something every parent — no matter how demanding the mission — can choose.",
              "Kabar baiknya adalah ini: kamu tidak perlu sempurna untuk memberikan keamanan emosional kepada anak-anakmu. Kamu perlu hadir, jujur, dan bersedia untuk memulihkan. Itu adalah sesuatu yang bisa dipilih setiap orang tua — tidak peduli seberapa menuntutnya misi itu.",
              "Het goede nieuws is dit: je hoeft niet perfect te zijn om je kinderen emotionele veiligheid te geven. Je moet aanwezig, eerlijk en bereid zijn om te herstellen. Dat is iets wat elke ouder — hoe veeleisend de zending ook is — kan kiezen."
            )}
          </p>
        </div>
      </div>

      {/* Section II — Four Markers */}
      <div style={{ background: lightGray, padding: "96px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: serif,
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: orange,
              marginBottom: 32,
            }}
          >
            {t(
              "II. What Emotional Safety Actually Means",
              "II. Apa Sebenarnya Keamanan Emosional",
              "II. Wat Emotionele Veiligheid Werkelijk Betekent"
            )}
          </p>
          <h2
            style={{
              fontFamily: serif,
              fontSize: "clamp(28px, 3.5vw, 40px)",
              fontWeight: 700,
              color: navy,
              marginBottom: 20,
              lineHeight: 1.2,
              fontStyle: "italic",
            }}
          >
            {t("Four Markers", "Empat Penanda", "Vier Kenmerken")}
          </h2>
          <p
            style={{
              fontFamily: serif,
              fontSize: "clamp(16px, 1.8vw, 19px)",
              color: bodyText,
              lineHeight: 1.85,
              marginBottom: 64,
            }}
          >
            {t(
              "Emotional safety is not a feeling you create by trying harder. It is built through specific, repeatable behaviours. These four markers define what it looks like — and what you can actually practise.",
              "Keamanan emosional bukan perasaan yang kamu ciptakan dengan berusaha lebih keras. Ini dibangun melalui perilaku-perilaku yang spesifik dan dapat diulang. Empat penanda ini menentukan seperti apa tampilannya — dan apa yang sebenarnya bisa kamu praktikkan.",
              "Emotionele veiligheid is geen gevoel dat je creëert door harder te proberen. Het wordt gebouwd door specifieke, herhaalbare gedragingen. Deze vier kenmerken bepalen hoe het eruitziet — en wat je daadwerkelijk kunt oefenen."
            )}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
            {SAFETY_MARKERS.map((marker, i) => (
              <div
                key={i}
                style={{
                  background: offWhite,
                  borderRadius: 8,
                  padding: "40px 40px 36px",
                  borderLeft: `4px solid ${orange}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 20,
                    marginBottom: 20,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: 28,
                      color: orange,
                      lineHeight: 1,
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {marker.icon}
                  </span>
                  <div>
                    <p
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: orange,
                        marginBottom: 8,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3
                      style={{
                        fontFamily: serif,
                        fontSize: "clamp(20px, 2.5vw, 26px)",
                        fontWeight: 700,
                        color: navy,
                        fontStyle: "italic",
                        lineHeight: 1.2,
                        margin: 0,
                      }}
                    >
                      {lang === "en"
                        ? marker.en_label
                        : lang === "id"
                        ? marker.id_label
                        : marker.nl_label}
                    </h3>
                  </div>
                </div>
                <p
                  style={{
                    fontFamily: serif,
                    fontSize: "clamp(16px, 1.8vw, 19px)",
                    color: bodyText,
                    lineHeight: 1.85,
                    marginBottom: 20,
                  }}
                >
                  {lang === "en"
                    ? marker.en_desc
                    : lang === "id"
                    ? marker.id_desc
                    : marker.nl_desc}
                </p>
                <div
                  style={{
                    background: lightGray,
                    borderRadius: 4,
                    padding: "16px 20px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: 12,
                      fontWeight: 700,
                      color: orange,
                      letterSpacing: "0.08em",
                      marginBottom: 8,
                      textTransform: "uppercase",
                    }}
                  >
                    {t("In Practice", "Dalam Praktik", "In de Praktijk")}
                  </p>
                  <p
                    style={{
                      fontFamily: serif,
                      fontSize: "clamp(15px, 1.6vw, 17px)",
                      color: bodyText,
                      lineHeight: 1.8,
                      margin: 0,
                      fontStyle: "italic",
                    }}
                  >
                    {lang === "en"
                      ? marker.en_practice
                      : lang === "id"
                      ? marker.id_practice
                      : marker.nl_practice}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section III — The Stress Transfer */}
      <div style={{ padding: "96px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: serif,
            fontSize: 11,
            fontWeight: 400,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: orange,
            marginBottom: 32,
          }}
        >
          {t("III. The Stress Transfer", "III. Transfer Stres", "III. De Stresoverdracht")}
        </p>
        <h2
          style={{
            fontFamily: serif,
            fontSize: "clamp(28px, 3.5vw, 40px)",
            fontWeight: 700,
            color: navy,
            marginBottom: 40,
            lineHeight: 1.2,
            fontStyle: "italic",
          }}
        >
          {t(
            "How Parental Stress Reaches Children",
            "Bagaimana Stres Orang Tua Menjangkau Anak-anak",
            "Hoe Ouderstress Kinderen Bereikt"
          )}
        </h2>
        <div
          style={{
            fontFamily: serif,
            fontSize: "clamp(17px, 2vw, 20px)",
            color: bodyText,
            lineHeight: 1.9,
          }}
        >
          <p style={{ marginBottom: 28 }}>
            {t(
              "Children do not absorb parental stress through lectures or explanations. They absorb it through atmosphere. Through the tension in a voice. Through the quality of attention they receive — or don't. Through whether the person who loves them most seems present or somewhere else entirely.",
              "Anak-anak tidak menyerap stres orang tua melalui ceramah atau penjelasan. Mereka menyerapnya melalui atmosfer. Melalui ketegangan dalam suara. Melalui kualitas perhatian yang mereka terima — atau tidak. Melalui apakah orang yang paling mencintai mereka tampak hadir atau berada di tempat lain sepenuhnya.",
              "Kinderen absorberen ouderstress niet via lezingen of uitleg. Ze absorberen het via atmosfeer. Via de spanning in een stem. Via de kwaliteit van de aandacht die ze krijgen — of niet krijgen. Via of de persoon die het meest van hen houdt aanwezig lijkt of ergens anders helemaal."
            )}
          </p>
          <p style={{ marginBottom: 28 }}>
            {t(
              "This is not a failure of willpower. It is physiology. The human nervous system is wired for co-regulation — children literally borrow calm from the adults around them. When the adults are dysregulated, children feel it before they understand it. They may not be able to name the feeling, but their bodies register it as a signal about the safety of their environment.",
              "Ini bukan kegagalan kemauan. Ini adalah fisiologi. Sistem saraf manusia dirancang untuk ko-regulasi — anak-anak secara harfiah meminjam ketenangan dari orang dewasa di sekitar mereka. Ketika orang dewasa tidak teratur, anak-anak merasakannya sebelum mereka memahaminya. Mereka mungkin tidak bisa menamai perasaan itu, tetapi tubuh mereka mencatatnya sebagai sinyal tentang keamanan lingkungan mereka.",
              "Dit is geen falen van wilskracht. Het is fysiologie. Het menselijk zenuwstelsel is bedraad voor co-regulatie — kinderen lenen letterlijk rust van de volwassenen om hen heen. Wanneer de volwassenen ontregeld zijn, voelen kinderen het voordat ze het begrijpen. Ze kunnen het gevoel misschien niet benoemen, maar hun lichamen registreren het als een signaal over de veiligheid van hun omgeving."
            )}
          </p>

          {/* Research callout */}
          <div
            style={{
              background: "oklch(94% 0.012 260)",
              border: `1px solid oklch(86% 0.02 260)`,
              borderRadius: 8,
              padding: "32px 36px",
              marginBottom: 36,
            }}
          >
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                color: navy,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              {t("Research Finding", "Temuan Penelitian", "Onderzoeksresultaat")}
            </p>
            <p
              style={{
                fontFamily: serif,
                fontSize: "clamp(18px, 2.2vw, 22px)",
                fontStyle: "italic",
                color: navy,
                lineHeight: 1.75,
                marginBottom: 12,
              }}
            >
              {t(
                "MKs — missionary kids and third culture kids raised in cross-cultural ministry — are twice as likely as non-TCK peers to report growing up with a parent struggling with mental health.",
                "MKs — anak-anak misionaris dan anak-anak lintas budaya yang dibesarkan dalam pelayanan lintas budaya — dua kali lebih mungkin dibandingkan teman sebaya non-TCK untuk melaporkan tumbuh dengan orang tua yang berjuang dengan kesehatan mental.",
                "MKs — zendelingenkinderen en derdecultuurkinderen die opgroeien in interculturele bediening — zijn twee keer zo waarschijnlijk als niet-TCK-leeftijdsgenoten om te rapporteren dat ze opgroeiden met een ouder die worstelde met geestelijke gezondheid."
              )}
            </p>
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 12,
                color: bodyText,
                letterSpacing: "0.04em",
                margin: 0,
              }}
            >
              {t(
                "Source: Missionary Kid Research — Interaction International / TCK Research",
                "Sumber: Penelitian Missionary Kid — Interaction International / TCK Research",
                "Bron: Missionary Kid Research — Interaction International / TCK Research"
              )}
            </p>
          </div>

          <p style={{ marginBottom: 28 }}>
            {t(
              "Then there is the grief tower — the accumulated, often unacknowledged losses that stack up for families in cross-cultural ministry. Every move adds to the tower: friends left behind, schools that finally felt familiar, languages fading, communities that had to be rebuilt from scratch. The grief is real. And in families where there is no shared language for loss, each person carries their tower alone.",
              "Lalu ada menara kesedihan — kehilangan-kehilangan yang terakumulasi, sering tidak diakui, yang menumpuk bagi keluarga dalam pelayanan lintas budaya. Setiap perpindahan menambah menara: teman-teman yang ditinggalkan, sekolah-sekolah yang akhirnya terasa familiar, bahasa yang memudar, komunitas yang harus dibangun kembali dari awal. Kesedihan itu nyata. Dan dalam keluarga di mana tidak ada bahasa bersama untuk kehilangan, setiap orang menanggung menara mereka sendiri.",
              "Dan dan is er de verliestoren — de opgestapelde, vaak niet-erkende verliezen die zich ophopen voor gezinnen in interculturele bediening. Elke verhuizing voegt toe aan de toren: vrienden die achterblijven, scholen die eindelijk vertrouwd aanvoelden, talen die vervagen, gemeenschappen die van nul af aan opgebouwd moesten worden. Het verdriet is echt. En in gezinnen waar er geen gedeelde taal voor verlies is, draagt elk persoon zijn toren alleen."
            )}
          </p>
          <p
            style={{
              fontFamily: serif,
              fontSize: "clamp(19px, 2.2vw, 24px)",
              fontStyle: "italic",
              color: navy,
              lineHeight: 1.75,
              padding: "8px 0 8px 28px",
              borderLeft: `3px solid ${orange}`,
            }}
          >
            {t(
              "The most important protective factor for a TCK is not stability of place — it is stability of relationship. The question children are asking is not: where are we? It is: are you still with me?",
              "Faktor pelindung terpenting bagi seorang anak lintas budaya bukan stabilitas tempat — melainkan stabilitas hubungan. Pertanyaan yang diajukan anak-anak bukan: di mana kita? Melainkan: apakah kamu masih bersamaku?",
              "De belangrijkste beschermende factor voor een TCK is niet stabiliteit van plek — het is stabiliteit van relatie. De vraag die kinderen stellen is niet: waar zijn we? Het is: ben je nog bij mij?"
            )}
          </p>
        </div>
      </div>

      {/* Section IV — Relational Repair */}
      <div style={{ background: navy, padding: "96px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: serif,
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: orange,
              marginBottom: 32,
            }}
          >
            {t("IV. Relational Repair", "IV. Pemulihan Relasional", "IV. Relationeel Herstel")}
          </p>
          <h2
            style={{
              fontFamily: serif,
              fontSize: "clamp(28px, 3.5vw, 40px)",
              fontWeight: 700,
              color: offWhite,
              marginBottom: 20,
              lineHeight: 1.2,
              fontStyle: "italic",
            }}
          >
            {t(
              "The Most Powerful Thing a Parent Can Do",
              "Hal Paling Kuat yang Bisa Dilakukan Orang Tua",
              "Het Krachtigste Wat een Ouder Kan Doen"
            )}
          </h2>
          <p
            style={{
              fontFamily: serif,
              fontSize: "clamp(16px, 1.8vw, 19px)",
              color: "oklch(76% 0.03 80)",
              lineHeight: 1.85,
              marginBottom: 64,
            }}
          >
            {t(
              "You will have bad days. You will snap, disconnect, or be absent in ways you didn't intend. This is not the problem. The problem is when nothing follows. Relational repair — the deliberate act of going back and closing the gap — is what transforms ruptures into deeper trust. Here is a simple, realistic three-part conversation.",
              "Kamu akan memiliki hari-hari yang buruk. Kamu akan meledak, memutus hubungan, atau tidak hadir dengan cara yang tidak kamu maksudkan. Ini bukan masalahnya. Masalahnya adalah ketika tidak ada yang mengikuti. Pemulihan relasional — tindakan disengaja untuk kembali dan menutup kesenjangan — adalah yang mengubah keretakan menjadi kepercayaan yang lebih dalam. Berikut adalah percakapan tiga bagian yang sederhana dan realistis.",
              "Je zult slechte dagen hebben. Je zult uitbarsten, je verbreken of afwezig zijn op manieren die je niet bedoeld had. Dit is niet het probleem. Het probleem is wanneer er niets op volgt. Relationeel herstel — de bewuste daad van terugkeren en de kloof sluiten — is wat breuken omzet in dieper vertrouwen. Hier is een eenvoudig, realistisch driedelig gesprek."
            )}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {REPAIR_STEPS.map((step, i) => {
              const isOpen = expandedRepair === i;
              return (
                <div
                  key={i}
                  style={{
                    background: isOpen
                      ? "oklch(28% 0.09 260)"
                      : "oklch(26% 0.09 260)",
                    borderRadius: 6,
                    overflow: "hidden",
                    transition: "background 0.15s",
                  }}
                >
                  <button
                    onClick={() => setExpandedRepair(isOpen ? null : i)}
                    style={{
                      width: "100%",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "28px 32px",
                      display: "flex",
                      alignItems: "center",
                      gap: 24,
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: serif,
                        fontSize: "clamp(36px, 4vw, 48px)",
                        fontWeight: 700,
                        color: orange,
                        lineHeight: 1,
                        minWidth: 40,
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          fontSize: 11,
                          fontWeight: 700,
                          color: orange,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          marginBottom: 6,
                        }}
                      >
                        {lang === "en"
                          ? step.en_label
                          : lang === "id"
                          ? step.id_label
                          : step.nl_label}
                      </p>
                      <p
                        style={{
                          fontFamily: serif,
                          fontSize: "clamp(15px, 1.7vw, 17px)",
                          color: "oklch(82% 0.025 80)",
                          lineHeight: 1.6,
                          margin: 0,
                        }}
                      >
                        {lang === "en"
                          ? step.en_desc
                          : lang === "id"
                          ? step.id_desc
                          : step.nl_desc}
                      </p>
                    </div>
                    <span
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: 18,
                        color: orange,
                        flexShrink: 0,
                        transform: isOpen ? "rotate(180deg)" : "none",
                        transition: "transform 0.2s",
                        display: "block",
                      }}
                    >
                      ↓
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      style={{
                        padding: "0 32px 32px 96px",
                        borderTop: "1px solid oklch(32% 0.08 260)",
                        paddingTop: 24,
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          fontSize: 11,
                          fontWeight: 700,
                          color: orange,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          marginBottom: 12,
                        }}
                      >
                        {t("Example", "Contoh", "Voorbeeld")}
                      </p>
                      <p
                        style={{
                          fontFamily: serif,
                          fontSize: "clamp(16px, 1.9vw, 20px)",
                          fontStyle: "italic",
                          color: offWhite,
                          lineHeight: 1.8,
                          margin: 0,
                        }}
                      >
                        {lang === "en"
                          ? step.en_example
                          : lang === "id"
                          ? step.id_example
                          : step.nl_example}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 56,
              padding: "36px 40px",
              background: "oklch(18% 0.09 260)",
              borderRadius: 6,
            }}
          >
            <p
              style={{
                fontFamily: serif,
                fontSize: "clamp(17px, 2vw, 21px)",
                fontStyle: "italic",
                color: offWhite,
                lineHeight: 1.8,
                marginBottom: 16,
              }}
            >
              {t(
                "When a parent repairs — especially when the parent was clearly in the wrong — it models something extraordinary: that in this family, humility is real, love is unconditional, and the relationship matters more than being right.",
                "Ketika seorang orang tua memulihkan — terutama ketika orang tua jelas-jelas salah — ini memodelkan sesuatu yang luar biasa: bahwa dalam keluarga ini, kerendahan hati itu nyata, cinta itu tanpa syarat, dan hubungan lebih penting dari pada benar.",
                "Wanneer een ouder herstelt — vooral wanneer de ouder duidelijk ongelijk had — modelleert dit iets buitengewoons: dat in dit gezin, nederigheid echt is, liefde onvoorwaardelijk is, en de relatie belangrijker is dan gelijk hebben."
              )}
            </p>
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 12,
                color: orange,
                fontWeight: 700,
                letterSpacing: "0.08em",
                margin: 0,
              }}
            >
              {t(
                "This is not failure modelling. This is faith in action.",
                "Ini bukan pemodelan kegagalan. Ini adalah iman dalam tindakan.",
                "Dit is geen faalmodellering. Dit is geloof in actie."
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Section V — TCK Awareness */}
      <div style={{ padding: "96px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: serif,
            fontSize: 11,
            fontWeight: 400,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: orange,
            marginBottom: 32,
          }}
        >
          {t(
            "V. TCK Awareness",
            "V. Kesadaran tentang Anak Lintas Budaya",
            "V. TCK-Bewustzijn"
          )}
        </p>
        <h2
          style={{
            fontFamily: serif,
            fontSize: "clamp(28px, 3.5vw, 40px)",
            fontWeight: 700,
            color: navy,
            marginBottom: 20,
            lineHeight: 1.2,
            fontStyle: "italic",
          }}
        >
          {t(
            "What Third Culture Kids Uniquely Need",
            "Apa yang Secara Unik Dibutuhkan Anak-anak Lintas Budaya",
            "Wat Derdecultuurkinderen Uniek Nodig Hebben"
          )}
        </h2>
        <p
          style={{
            fontFamily: serif,
            fontSize: "clamp(16px, 1.8vw, 19px)",
            color: bodyText,
            lineHeight: 1.85,
            marginBottom: 64,
          }}
        >
          {t(
            "A third culture kid doesn't fully belong to their passport country, or to any country they've lived in. They belong, most naturally, to a culture of fellow TCKs — and to whatever their parents make of home.",
            "Seorang anak lintas budaya tidak sepenuhnya termasuk dalam negara paspor mereka, atau di negara mana pun yang pernah mereka tinggali. Mereka paling alami termasuk dalam budaya sesama TCK — dan pada apapun yang orang tua mereka jadikan rumah.",
            "Een derdecultuurkind behoort niet volledig tot hun paspoortland, of tot welk land ze ook in hebben gewoond. Ze horen het meest natuurlijk bij een cultuur van mede-TCKs — en bij wat hun ouders van thuis maken."
          )}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {TCK_NEEDS.map((need, i) => (
            <div key={i}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 24,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    fontFamily: serif,
                    fontSize: "clamp(44px, 5vw, 56px)",
                    fontWeight: 700,
                    color: orange,
                    lineHeight: 1,
                    minWidth: 44,
                    flexShrink: 0,
                    marginTop: -4,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: serif,
                      fontSize: "clamp(20px, 2.5vw, 26px)",
                      fontWeight: 700,
                      color: navy,
                      fontStyle: "italic",
                      lineHeight: 1.2,
                      margin: "0 0 16px",
                    }}
                  >
                    {lang === "en"
                      ? need.en_title
                      : lang === "id"
                      ? need.id_title
                      : need.nl_title}
                  </h3>
                  <p
                    style={{
                      fontFamily: serif,
                      fontSize: "clamp(16px, 1.8vw, 19px)",
                      color: bodyText,
                      lineHeight: 1.9,
                      margin: 0,
                    }}
                  >
                    {lang === "en"
                      ? need.en_body
                      : lang === "id"
                      ? need.id_body
                      : need.nl_body}
                  </p>
                </div>
              </div>
              {i < TCK_NEEDS.length - 1 && (
                <div
                  style={{
                    height: 1,
                    background: "oklch(90% 0.008 80)",
                    marginTop: 48,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section VI — Biblical Foundation */}
      <div style={{ background: lightGray, padding: "96px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: serif,
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: orange,
              marginBottom: 32,
            }}
          >
            {t("VI. Biblical Foundation", "VI. Dasar Alkitab", "VI. Bijbelse Basis")}
          </p>
          <h2
            style={{
              fontFamily: serif,
              fontSize: "clamp(28px, 3.5vw, 40px)",
              fontWeight: 700,
              color: navy,
              marginBottom: 20,
              lineHeight: 1.2,
              fontStyle: "italic",
            }}
          >
            {t(
              "Parenting as a Walk, Not a Performance",
              "Pengasuhan sebagai Perjalanan, Bukan Penampilan",
              "Ouderschap als Wandeling, Niet als Prestatie"
            )}
          </h2>
          <p
            style={{
              fontFamily: serif,
              fontSize: "clamp(16px, 1.8vw, 19px)",
              color: bodyText,
              lineHeight: 1.85,
              marginBottom: 72,
            }}
          >
            {t(
              "The Bible does not present family as a project to optimise or an image to maintain. It presents it as a relationship to inhabit — as you walk, as you sit, as you lie down, as you rise. The ordinary moments are where faith is formed.",
              "Alkitab tidak menyajikan keluarga sebagai proyek yang perlu dioptimalkan atau citra yang perlu dipertahankan. Alkitab menyajikannya sebagai hubungan untuk dihidupi — saat kamu berjalan, duduk, berbaring, dan bangun. Momen-momen biasa adalah di mana iman terbentuk.",
              "De Bijbel presenteert gezin niet als een project dat geoptimaliseerd moet worden of een beeld dat gehandhaafd moet worden. Het presenteert het als een relatie om in te wonen — terwijl je loopt, zit, ligt neer, opstaat. De gewone momenten zijn waar geloof gevormd wordt."
            )}
          </p>

          {/* Deuteronomy 6:6-7 */}
          <div style={{ marginBottom: 64 }}>
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: orange,
                letterSpacing: "0.1em",
                marginBottom: 20,
              }}
            >
              <VerseRef id="deut-6-6-7">
                {t("Deuteronomy 6:6–7", "Ulangan 6:6–7", "Deuteronomium 6:6–7")}
              </VerseRef>
            </p>
            <div
              style={{
                background: offWhite,
                borderRadius: 4,
                padding: "32px 36px",
                marginBottom: 24,
              }}
            >
              <p
                style={{
                  fontFamily: serif,
                  fontSize: "clamp(18px, 2vw, 22px)",
                  fontStyle: "italic",
                  color: navy,
                  lineHeight: 1.75,
                  margin: 0,
                }}
              >
                {t(
                  "\"These commandments that I give you today are to be on your hearts. Impress them on your children. Talk about them when you sit at home and when you walk along the road, when you lie down and when you get up.\"",
                  "\"Apa yang kuperintahkan kepadamu pada hari ini haruslah engkau perhatikan, haruslah engkau mengajarkannya berulang-ulang kepada anak-anakmu dan membicarakannya apabila engkau duduk di rumahmu, apabila engkau sedang dalam perjalanan, apabila engkau berbaring dan apabila engkau bangun.\"",
                  "\"Houd deze geboden, die ik u vandaag opleg, steeds in gedachten. Prent ze uw kinderen in en spreek er steeds over, thuis en onderweg, als u naar bed gaat en als u opstaat.\""
                )}
              </p>
            </div>
            <p
              style={{
                fontFamily: serif,
                fontSize: "clamp(16px, 1.8vw, 19px)",
                color: bodyText,
                lineHeight: 1.85,
              }}
            >
              {t(
                "This is not a curriculum. It is a lifestyle. Moses is not describing a devotional programme — he is describing the texture of a home where faith is woven into the ordinary. Sitting together. Walking side by side. The quiet conversations at the end of the day. Faith formation in the Bible happens not primarily in formal teaching moments, but in relational presence. This requires a parent to be there — mentally, emotionally, not just physically.",
                "Ini bukan kurikulum. Ini adalah gaya hidup. Musa tidak menggambarkan program renungan — ia menggambarkan tekstur sebuah rumah di mana iman terjalin ke dalam hal-hal biasa. Duduk bersama. Berjalan berdampingan. Percakapan tenang di akhir hari. Pembentukan iman dalam Alkitab tidak terutama terjadi dalam momen pengajaran formal, tetapi dalam kehadiran relasional. Ini membutuhkan orang tua untuk hadir — secara mental, emosional, tidak hanya secara fisik.",
                "Dit is geen curriculum. Het is een levensstijl. Mozes beschrijft geen devotioneel programma — hij beschrijft de textuur van een thuis waar geloof verweven is in het gewone. Samen zitten. Zij aan zij lopen. De stille gesprekken aan het einde van de dag. Geloofsvorming in de Bijbel gebeurt niet primair in formele leermomenten, maar in relationele aanwezigheid. Dit vereist een ouder om er te zijn — mentaal, emotioneel, niet alleen fysiek."
              )}
            </p>
          </div>

          {/* Proverbs 22:6 */}
          <div style={{ marginBottom: 64 }}>
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: orange,
                letterSpacing: "0.1em",
                marginBottom: 20,
              }}
            >
              <VerseRef id="prov-22-6">
                {t("Proverbs 22:6", "Amsal 22:6", "Spreuken 22:6")}
              </VerseRef>
            </p>
            <div
              style={{
                background: offWhite,
                borderRadius: 4,
                padding: "32px 36px",
                marginBottom: 24,
              }}
            >
              <p
                style={{
                  fontFamily: serif,
                  fontSize: "clamp(18px, 2vw, 22px)",
                  fontStyle: "italic",
                  color: navy,
                  lineHeight: 1.75,
                  margin: 0,
                }}
              >
                {t(
                  "\"Start children off on the way they should go, and even when they are old they will not turn from it.\"",
                  "\"Didiklah orang muda menurut jalan yang patut baginya, maka pada masa tuanya pun ia tidak akan menyimpang dari pada jalan itu.\"",
                  "\"Leer een kind de weg die het moet gaan, ook als het oud is zal het die weg niet verlaten.\""
                )}
              </p>
            </div>
            <p
              style={{
                fontFamily: serif,
                fontSize: "clamp(16px, 1.8vw, 19px)",
                color: bodyText,
                lineHeight: 1.85,
              }}
            >
              {t(
                "The Hebrew behind \"start children off\" carries the idea of initiating, dedicating — not forcing a path but awakening a child to the path that is theirs. This is not a formula for producing compliant children. It is a call to know your child — their wiring, their way, their particular personhood — and to companion them on it. Emotional safety is the soil in which this knowing grows.",
                "Kata Ibrani di balik 'didiklah' membawa gagasan memulai, mendedikasikan — bukan memaksakan jalan tetapi membangunkan anak pada jalan yang menjadi milik mereka. Ini bukan formula untuk menghasilkan anak yang patuh. Ini adalah panggilan untuk mengenal anakmu — cara kerjanya, jalannya, kepribadiannya yang unik — dan menemaninya di sana. Keamanan emosional adalah tanah tempat pengenalan ini bertumbuh.",
                "Het Hebreeuws achter 'leer een kind' draagt het idee van initiëren, toewijden — niet een pad forceren maar een kind wakker maken voor het pad dat het zijne is. Dit is geen formule voor het produceren van gehoorzame kinderen. Het is een oproep om je kind te kennen — zijn bedrading, zijn weg, zijn bijzondere persoonsheid — en hem daarin te begeleiden. Emotionele veiligheid is de bodem waarin dit kennen groeit."
              )}
            </p>
          </div>

          {/* Mark 10:14 — Jesus and the children */}
          <div style={{ marginBottom: 0 }}>
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: orange,
                letterSpacing: "0.1em",
                marginBottom: 20,
              }}
            >
              <VerseRef id="mark-10-14">
                {t("Mark 10:14", "Markus 10:14", "Marcus 10:14")}
              </VerseRef>
            </p>
            <div
              style={{
                background: offWhite,
                borderRadius: 4,
                padding: "32px 36px",
                marginBottom: 24,
              }}
            >
              <p
                style={{
                  fontFamily: serif,
                  fontSize: "clamp(18px, 2vw, 22px)",
                  fontStyle: "italic",
                  color: navy,
                  lineHeight: 1.75,
                  margin: 0,
                }}
              >
                {t(
                  "\"Let the little children come to me, and do not hinder them, for the kingdom of God belongs to such as these.\"",
                  "\"Biarkanlah anak-anak itu datang kepada-Ku, jangan menghalang-halangi mereka, sebab orang-orang yang seperti itulah yang empunya Kerajaan Allah.\"",
                  "\"Laat de kinderen bij me komen, houd ze niet tegen, want het koninkrijk van God behoort toe aan wie is zoals zij.\""
                )}
              </p>
            </div>
            <p
              style={{
                fontFamily: serif,
                fontSize: "clamp(16px, 1.8vw, 19px)",
                color: bodyText,
                lineHeight: 1.85,
              }}
            >
              {t(
                "The disciples thought the children were an interruption. Jesus corrected them sharply. In a culture where children had very little social standing, Jesus made room for them — and not merely tolerated their presence but declared them to be the model for entering the Kingdom. Children are not a distraction from ministry. They are not obstacles to the mission. In Jesus's vision, they are the closest thing to what Kingdom life actually looks like.",
                "Para murid mengira anak-anak itu adalah gangguan. Yesus mengoreksi mereka dengan tegas. Dalam budaya di mana anak-anak memiliki status sosial yang sangat rendah, Yesus membuat ruang bagi mereka — dan tidak sekadar mentoleransi kehadiran mereka tetapi menyatakan mereka sebagai model untuk memasuki Kerajaan. Anak-anak bukan gangguan dari pelayanan. Mereka bukan hambatan bagi misi. Dalam visi Yesus, mereka adalah hal yang paling mendekati seperti apa kehidupan Kerajaan sebenarnya.",
                "De discipelen dachten dat de kinderen een onderbreking waren. Jezus corrigeerde hen scherp. In een cultuur waar kinderen zeer weinig sociale status hadden, maakte Jezus ruimte voor hen — en tolereerde niet alleen hun aanwezigheid maar verklaarde hen tot het model voor het binnengaan van het Koninkrijk. Kinderen zijn geen afleiding van bediening. Ze zijn geen obstakels voor de missie. In Jezus' visie zijn zij het dichtst bij hoe het Koninkrijksleven er werkelijk uitziet."
              )}
            </p>
          </div>

          {/* Theological summary */}
          <div
            style={{
              marginTop: 56,
              padding: "40px 40px",
              background: navy,
              borderRadius: 6,
            }}
          >
            <p
              style={{
                fontFamily: serif,
                fontSize: "clamp(18px, 2.2vw, 23px)",
                fontStyle: "italic",
                color: offWhite,
                lineHeight: 1.8,
                marginBottom: 16,
              }}
            >
              {t(
                "The family is not a side project of the mission. For many of the people your children will become — the friends they will carry, the leaders they will influence, the faith they will embody — your home is the mission.",
                "Keluarga bukan proyek sampingan dari misi. Bagi banyak orang yang akan menjadi anak-anakmu — teman-teman yang akan mereka bawa, pemimpin yang akan mereka pengaruhi, iman yang akan mereka wujudkan — rumahmu adalah misinya.",
                "Het gezin is geen nevenprojekt van de missie. Voor veel mensen die je kinderen zullen worden — de vrienden die ze zullen dragen, de leiders die ze zullen beïnvloeden, het geloof dat ze zullen belichamen — is jouw thuis de missie."
              )}
            </p>
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 12,
                color: orange,
                fontWeight: 700,
                letterSpacing: "0.08em",
                margin: 0,
              }}
            >
              {t(
                "Jesus made room for children. So can you.",
                "Yesus membuat ruang bagi anak-anak. Begitu pula kamu.",
                "Jezus maakte ruimte voor kinderen. Jij ook."
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Section VII — One Commitment */}
      <div style={{ background: navy, padding: "96px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              fontFamily: serif,
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: orange,
              marginBottom: 32,
            }}
          >
            {t("VII. Your Response", "VII. Respons Anda", "VII. Jouw Reactie")}
          </p>
          <h2
            style={{
              fontFamily: serif,
              fontSize: "clamp(26px, 3.5vw, 38px)",
              fontWeight: 700,
              color: offWhite,
              marginBottom: 20,
              lineHeight: 1.2,
              fontStyle: "italic",
            }}
          >
            {t(
              "One Thing This Week",
              "Satu Hal Minggu Ini",
              "Één Ding Deze Week"
            )}
          </h2>
          <p
            style={{
              fontFamily: serif,
              fontSize: "clamp(16px, 1.8vw, 19px)",
              color: "oklch(76% 0.03 80)",
              lineHeight: 1.85,
              marginBottom: 16,
            }}
          >
            {t(
              "You don't need to overhaul everything. You need one thing — one concrete, doable act — that moves toward greater emotional safety in your home.",
              "Kamu tidak perlu merombak segalanya. Kamu membutuhkan satu hal — satu tindakan konkret yang bisa dilakukan — yang bergerak menuju keamanan emosional yang lebih besar di rumahmu.",
              "Je hoeft niet alles te herzien. Je hebt één ding nodig — één concreet, uitvoerbaar daad — dat beweegt naar meer emotionele veiligheid in je thuis."
            )}
          </p>
          <p
            style={{
              fontFamily: serif,
              fontSize: "clamp(16px, 1.8vw, 19px)",
              color: "oklch(76% 0.03 80)",
              lineHeight: 1.85,
              marginBottom: 48,
              fontStyle: "italic",
            }}
          >
            {t(
              "What is one thing you will do this week for emotional safety in your home?",
              "Apa satu hal yang akan Anda lakukan minggu ini untuk keamanan emosional di rumah Anda?",
              "Wat is één ding dat je deze week zult doen voor emotionele veiligheid in je thuis?"
            )}
          </p>
          {!committed ? (
            <div>
              <textarea
                value={commitment}
                onChange={(e) => setCommitment(e.target.value)}
                placeholder={t(
                  "Write one specific thing here — a repair conversation, a phone-down moment, a question to ask your child tonight...",
                  "Tuliskan satu hal spesifik di sini — percakapan pemulihan, momen meletakkan telepon, pertanyaan untuk diajukan kepada anakmu malam ini...",
                  "Schrijf hier één specifiek ding — een herstalgesprek, een telefoon-neerlegmoment, een vraag om je kind vanavond te stellen..."
                )}
                rows={4}
                style={{
                  width: "100%",
                  padding: "18px 20px",
                  fontFamily: serif,
                  fontSize: "clamp(16px, 1.8vw, 18px)",
                  color: bodyText,
                  background: offWhite,
                  border: `1px solid oklch(88% 0.01 80)`,
                  borderRadius: 4,
                  resize: "vertical",
                  lineHeight: 1.75,
                  marginBottom: 20,
                  boxSizing: "border-box",
                }}
              />
              <button
                onClick={() => {
                  if (commitment.trim()) setCommitted(true);
                }}
                disabled={!commitment.trim()}
                style={{
                  padding: "14px 36px",
                  border: "none",
                  cursor: commitment.trim() ? "pointer" : "default",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  background: commitment.trim() ? orange : "oklch(35% 0.05 260)",
                  color: commitment.trim() ? offWhite : "oklch(55% 0.03 260)",
                  letterSpacing: "0.06em",
                  borderRadius: 4,
                }}
              >
                {t(
                  "I Will Do This",
                  "Saya Akan Melakukan Ini",
                  "Ik Zal Dit Doen"
                )}
              </button>
            </div>
          ) : (
            <div
              style={{
                background: "oklch(26% 0.09 260)",
                padding: "36px 40px",
                borderRadius: 6,
                textAlign: "left",
              }}
            >
              <p
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  color: orange,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                {t("Your commitment", "Komitmen Anda", "Jouw toezegging")}
              </p>
              <p
                style={{
                  fontFamily: serif,
                  fontSize: "clamp(17px, 1.9vw, 20px)",
                  color: offWhite,
                  lineHeight: 1.85,
                  fontStyle: "italic",
                  marginBottom: 24,
                }}
              >
                "{commitment}"
              </p>
              <p
                style={{
                  fontFamily: serif,
                  fontSize: "clamp(15px, 1.6vw, 17px)",
                  color: "oklch(76% 0.03 80)",
                  lineHeight: 1.75,
                }}
              >
                {t(
                  "Your children don't need you to be perfect. They need you to be present — and to come back when you haven't been. That's what you're choosing today.",
                  "Anak-anakmu tidak membutuhkanmu untuk sempurna. Mereka membutuhkanmu untuk hadir — dan untuk kembali ketika kamu tidak hadir. Itulah yang kamu pilih hari ini.",
                  "Je kinderen hebben je niet nodig om perfect te zijn. Ze hebben je nodig om aanwezig te zijn — en om terug te komen wanneer je dat niet was geweest. Dat is wat je vandaag kiest."
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          background: "oklch(19% 0.09 260)",
          padding: "72px 24px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: serif,
            fontSize: "clamp(26px, 3vw, 36px)",
            fontWeight: 700,
            color: offWhite,
            marginBottom: 16,
            fontStyle: "italic",
          }}
        >
          {t("Keep Growing", "Terus Bertumbuh", "Blijf Groeien")}
        </h2>
        <p
          style={{
            fontFamily: serif,
            fontSize: "clamp(16px, 1.8vw, 19px)",
            color: "oklch(76% 0.03 80)",
            lineHeight: 1.75,
            maxWidth: 520,
            margin: "0 auto 40px",
          }}
        >
          {t(
            "Explore more resources to deepen your cross-cultural leadership.",
            "Jelajahi lebih banyak sumber untuk memperdalam kepemimpinan lintas budaya Anda.",
            "Verken meer bronnen om je intercultureel leiderschap te verdiepen."
          )}
        </p>
        <Link
          href="/resources"
          style={{
            display: "inline-block",
            padding: "14px 36px",
            background: orange,
            color: offWhite,
            fontFamily: "Montserrat, sans-serif",
            fontSize: 14,
            fontWeight: 700,
            textDecoration: "none",
            borderRadius: 4,
            letterSpacing: "0.04em",
          }}
        >
          {t("← Content Library", "← Perpustakaan Konten", "← Contentbibliotheek")}
        </Link>
      </div>

      {/* Verse Popup */}
      {activeVerse && verseData && (
        <div
          onClick={() => setActiveVerse(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "oklch(10% 0.05 260 / 0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: offWhite,
              borderRadius: 12,
              padding: "44px 40px",
              maxWidth: 540,
              width: "100%",
            }}
          >
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                color: orange,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              {lang === "en"
                ? verseData.en_ref
                : lang === "id"
                ? verseData.id_ref
                : verseData.nl_ref}{" "}
              {lang === "en" ? "(NIV)" : lang === "id" ? "(TB)" : "(NBV)"}
            </p>
            <p
              style={{
                fontFamily: serif,
                fontSize: 20,
                lineHeight: 1.75,
                color: navy,
                fontStyle: "italic",
                marginBottom: 28,
              }}
            >
              "
              {lang === "en"
                ? verseData.en
                : lang === "id"
                ? verseData.id
                : verseData.nl}
              "
            </p>
            <button
              onClick={() => setActiveVerse(null)}
              style={{
                padding: "10px 24px",
                background: navy,
                color: offWhite,
                border: "none",
                borderRadius: 6,
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {t("Close", "Tutup", "Sluiten")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
