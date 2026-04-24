"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

type ChoiceKey = "A" | "C" | "D";
type ProfileKey = "analyst" | "relational" | "decisive" | "adaptive";
type VerseKey = "prov-3-5-6" | "james-1-5";

const VERSES: Record<VerseKey, { en_ref: string; id_ref: string; nl_ref: string; en: string; id: string; nl: string }> = {
  "prov-3-5-6": {
    en_ref: "Proverbs 3:5–6", id_ref: "Amsal 3:5–6", nl_ref: "Spreuken 3:5–6",
    en: "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    id: "Percayalah kepada TUHAN dengan segenap hatimu, dan janganlah bersandar kepada pengertianmu sendiri. Akuilah Dia dalam segala lakumu, maka Ia akan meluruskan jalanmu.",
    nl: "Vertrouw op de HEER met heel je hart, steun niet op eigen inzicht. Erken hem in alles wat je doet, dan baant hij voor jou de weg.",
  },
  "james-1-5": {
    en_ref: "James 1:5", id_ref: "Yakobus 1:5", nl_ref: "Jakobus 1:5",
    en: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.",
    id: "Tetapi apabila di antara kamu ada yang kekurangan hikmat, hendaklah ia memintakannya kepada Allah, yang memberikan kepada semua orang dengan murah hati dan dengan tidak membangkit-bangkit, maka hal itu akan diberikan kepadanya.",
    nl: "Komt iemand van u wijsheid tekort? Vraag God erom, die aan iedereen geeft zonder voorbehoud en zonder verwijt, en hij zal u wijsheid geven.",
  },
};

const DECISIONS: {
  id: number;
  en_context: string; id_context: string; nl_context: string;
  choices: Record<ChoiceKey, { en_label: string; id_label: string; nl_label: string; en: string; id: string; nl: string }>;
}[] = [
  {
    id: 1,
    en_context: "You've noticed the partner's withdrawal for three days. What is your first move?",
    id_context: "Anda telah memperhatikan penarikan diri mitra selama tiga hari. Apa langkah pertama Anda?",
    nl_context: "Je hebt drie dagen lang de terugtrekking van de partner opgemerkt. Wat is je eerste stap?",
    choices: {
      A: {
        en_label: "The Data Move", id_label: "Langkah Data", nl_label: "De Data-Stap",
        en: "Pull the facts first — attendance records, email response times, project milestone updates. You want data before you interpret.",
        id: "Kumpulkan fakta terlebih dahulu — catatan kehadiran, waktu respons email, pembaruan tonggak proyek. Anda ingin data sebelum menafsirkan.",
        nl: "Haal eerst de feiten op — aanwezigheidsgegevens, e-mailreactietijden, projectmijlpaalupdates. Je wilt data vóór interpretatie.",
      },
      C: {
        en_label: "The Relational Move", id_label: "Langkah Relasional", nl_label: "De Relationele Stap",
        en: "Call Maya, your team member who has a long-standing relationship with the partner. She'll have a read on what's really happening.",
        id: "Hubungi Maya, anggota tim Anda yang memiliki hubungan jangka panjang dengan mitra. Ia akan memiliki pemahaman tentang apa yang sebenarnya terjadi.",
        nl: "Bel Maya, je teamlid met een langdurige relatie met de partner. Zij heeft waarschijnlijk een goed beeld van wat er echt speelt.",
      },
      D: {
        en_label: "The Direct Move", id_label: "Langkah Langsung", nl_label: "De Directe Stap",
        en: "Contact the partner's lead directly. A short, warm message: 'I'd like to connect — can we find 30 minutes this week?'",
        id: "Hubungi pemimpin mitra secara langsung. Pesan singkat dan hangat: 'Saya ingin terhubung — bisakah kita menemukan 30 menit minggu ini?'",
        nl: "Neem rechtstreeks contact op met de lead van de partner. Een kort, warm bericht: 'Ik wil even bijpraten — kunnen we 30 minuten vinden deze week?'",
      },
    },
  },
  {
    id: 2,
    en_context: "You've learned there was a misunderstanding about roles between your team and the partner's team. You still don't know how serious it is. The deadline is two weeks away. What do you do?",
    id_context: "Anda mengetahui ada kesalahpahaman tentang peran antara tim Anda dan tim mitra. Anda masih belum tahu seberapa serius itu. Tenggat waktu dua minggu lagi. Apa yang Anda lakukan?",
    nl_context: "Je hebt vernomen dat er een misverstand was over rollen tussen jouw team en het team van de partner. Je weet nog niet hoe ernstig het is. De deadline is over twee weken. Wat doe je?",
    choices: {
      A: {
        en_label: "The Data Move", id_label: "Langkah Data", nl_label: "De Data-Stap",
        en: "Ask both teams to submit written summaries of their understanding of roles before any meeting. You need the full picture first.",
        id: "Minta kedua tim untuk menyerahkan ringkasan tertulis tentang pemahaman mereka tentang peran sebelum rapat apa pun. Anda perlu gambaran penuh terlebih dahulu.",
        nl: "Vraag beide teams om schriftelijke samenvattingen in te dienen over hun begrip van de rollen vóór elke vergadering. Je hebt eerst het volledige beeld nodig.",
      },
      C: {
        en_label: "The Relational Move", id_label: "Langkah Relasional", nl_label: "De Relationele Stap",
        en: "Bring a small group together — two from each side — in an informal conversation. No agenda, no minutes. Just listening.",
        id: "Kumpulkan kelompok kecil — dua orang dari masing-masing pihak — dalam percakapan informal. Tanpa agenda, tanpa notulen. Hanya mendengarkan.",
        nl: "Breng een kleine groep samen — twee mensen van elke kant — in een informeel gesprek. Geen agenda, geen notulen. Alleen luisteren.",
      },
      D: {
        en_label: "The Direct Move", id_label: "Langkah Langsung", nl_label: "De Directe Stap",
        en: "Make a provisional role clarification now and circulate it. You can adjust later — ambiguity is already costing more than imperfection.",
        id: "Buat klarifikasi peran sementara sekarang dan sebarkan. Anda bisa menyesuaikan nanti — ambiguitas sudah merugikan lebih banyak daripada ketidaksempurnaan.",
        nl: "Maak nu een voorlopige rolverheldering en circuleer die. Je kunt later bijsturen — ambiguïteit kost al meer dan onvolmaaktheid.",
      },
    },
  },
  {
    id: 3,
    en_context: "You've proposed a path forward. Your most experienced team member — who shares the partner's cultural background — tells you privately: 'Moving this fast will damage trust. They'll feel dismissed.' What do you do?",
    id_context: "Anda telah mengusulkan jalan ke depan. Anggota tim Anda yang paling berpengalaman — yang berbagi latar belakang budaya mitra — memberi tahu Anda secara pribadi: 'Bergerak secepat ini akan merusak kepercayaan. Mereka akan merasa diabaikan.' Apa yang Anda lakukan?",
    nl_context: "Je hebt een weg voorwaarts voorgesteld. Je meest ervaren teamlid — die de culturele achtergrond van de partner deelt — vertelt je in vertrouwen: 'Als je zo snel beweegt, beschadig je het vertrouwen. Ze zullen zich genegeerd voelen.' Wat doe je?",
    choices: {
      A: {
        en_label: "The Data Move", id_label: "Langkah Data", nl_label: "De Data-Stap",
        en: "Ask for specifics. What exactly will feel dismissive? What alternative outcome does she predict? You need evidence, not instinct.",
        id: "Minta spesifik. Apa tepatnya yang akan terasa diabaikan? Hasil alternatif apa yang ia prediksi? Anda perlu bukti, bukan naluri.",
        nl: "Vraag om specificaties. Wat precies zal als neerbuigend worden ervaren? Welke alternatieve uitkomst voorspelt ze? Je hebt bewijs nodig, geen instinct.",
      },
      C: {
        en_label: "The Relational Move", id_label: "Langkah Relasional", nl_label: "De Relationele Stap",
        en: "Hold the decision for 24 hours. Create a brief listening session with representatives from the partner's team before you commit.",
        id: "Tunda keputusan selama 24 jam. Buat sesi mendengarkan singkat dengan perwakilan dari tim mitra sebelum Anda berkomitmen.",
        nl: "Houd de beslissing 24 uur aan. Creëer een korte luistersessie met vertegenwoordigers van het team van de partner voordat je je vastlegt.",
      },
      D: {
        en_label: "The Direct Move", id_label: "Langkah Langsung", nl_label: "De Directe Stap",
        en: "Thank her for the input and explain your reasoning — then hold your course. She may be right, but you can't let the fear of misread stop momentum.",
        id: "Berterima kasih atas masukannya dan jelaskan alasan Anda — lalu pertahankan arah Anda. Ia mungkin benar, tetapi Anda tidak bisa membiarkan ketakutan akan kesalahan baca menghentikan momentum.",
        nl: "Bedank haar voor de input en leg je redenering uit — houd dan je koers. Ze heeft misschien gelijk, maar de angst voor een verkeerde inschatting mag de vaart niet stoppen.",
      },
    },
  },
  {
    id: 4,
    en_context: "Decision made. Now you need to communicate it to the partner's team — who never raised the conflict directly. They signaled discomfort through withdrawal, not words. How do you communicate?",
    id_context: "Keputusan dibuat. Kini Anda perlu mengkomunikasikannya kepada tim mitra — yang tidak pernah mengangkat konflik secara langsung. Mereka menandai ketidaknyamanan melalui penarikan diri, bukan kata-kata. Bagaimana Anda berkomunikasi?",
    nl_context: "Beslissing genomen. Nu moet je die communiceren aan het team van de partner — die het conflict nooit direct aankaarte. Ze signaleerden ongemak door terugtrekking, niet met woorden. Hoe communiceer je?",
    choices: {
      A: {
        en_label: "The Data Move", id_label: "Langkah Data", nl_label: "De Data-Stap",
        en: "Send a clear written update: decision made, rationale explained, next steps listed, timeline confirmed. Clarity is respect.",
        id: "Kirim pembaruan tertulis yang jelas: keputusan dibuat, alasan dijelaskan, langkah selanjutnya dicantumkan, jadwal dikonfirmasi. Kejelasan adalah rasa hormat.",
        nl: "Stuur een duidelijke schriftelijke update: beslissing genomen, redenering uitgelegd, volgende stappen vermeld, tijdlijn bevestigd. Duidelijkheid is respect.",
      },
      C: {
        en_label: "The Relational Move", id_label: "Langkah Relasional", nl_label: "De Relationele Stap",
        en: "Ask a trusted intermediary to have an informal conversation with the partner's team first — no surprises when the formal message arrives.",
        id: "Minta perantara tepercaya untuk melakukan percakapan informal dengan tim mitra terlebih dahulu — tidak ada kejutan ketika pesan formal tiba.",
        nl: "Vraag een vertrouwde tussenpersoon om eerst een informeel gesprek te hebben met het team van de partner — geen verrassingen als het formele bericht aankomt.",
      },
      D: {
        en_label: "The Direct Move", id_label: "Langkah Langsung", nl_label: "De Directe Stap",
        en: "Call the partner's lead directly. Short conversation. Acknowledge the friction, name the path forward, thank them for their patience.",
        id: "Hubungi pemimpin mitra secara langsung. Percakapan singkat. Akui gesekan, sebutkan jalan ke depan, berterima kasih atas kesabaran mereka.",
        nl: "Bel de lead van de partner rechtstreeks. Kort gesprek. Erken de wrijving, benoem het pad vooruit, bedank hen voor hun geduld.",
      },
    },
  },
];

const PROFILES: Record<ProfileKey, {
  en_name: string; id_name: string; nl_name: string;
  en_desc: string; id_desc: string; nl_desc: string;
  en_risk: string; id_risk: string; nl_risk: string;
  en_strength: string; id_strength: string; nl_strength: string;
  color: string;
}> = {
  analyst: {
    en_name: "The Evidence Analyst",
    id_name: "Analis Bukti",
    nl_name: "De Bewijs-Analist",
    en_desc: "Under pressure, you reach for data. You distrust gut reactions and want facts before you commit. This is a real strength — you make fewer impulsive errors than most leaders. But in cross-cultural environments, the most important signals rarely live in spreadsheets. Withdrawal, silence, a changed tone in email — these are data in high-context cultures, and they don't compress into a report.",
    id_desc: "Di bawah tekanan, Anda mencari data. Anda tidak mempercayai reaksi naluriah dan ingin fakta sebelum berkomitmen. Ini adalah kekuatan nyata — Anda membuat lebih sedikit kesalahan impulsif daripada kebanyakan pemimpin. Tetapi dalam lingkungan lintas budaya, sinyal terpenting jarang ada dalam spreadsheet. Penarikan diri, keheningan, nada yang berubah dalam email — ini adalah data dalam budaya berkonteks tinggi.",
    nl_desc: "Onder druk reik je naar data. Je wantrouwt buikgevoelens en wilt feiten voordat je je vastlegt. Dit is een echte kracht — je maakt minder impulsieve fouten dan de meeste leiders. Maar in interculturele omgevingen leven de belangrijkste signalen zelden in spreadsheets. Terugtrekking, stilte, een andere toon in e-mail — dit zijn data in hoge-context culturen, en ze laten zich niet samenvatten in een rapport.",
    en_risk: "You may gather evidence while the relationship quietly erodes. Your thoroughness can read as coldness or distrust in cultures where pace signals care.",
    id_risk: "Anda mungkin mengumpulkan bukti sementara hubungan diam-diam terkikis. Ketelitian Anda dapat dibaca sebagai kedinginan atau ketidakpercayaan dalam budaya di mana kecepatan menandakan kepedulian.",
    nl_risk: "Je kunt bewijs verzamelen terwijl de relatie stilletjes eroodeert. Jouw grondigheid kan gelezen worden als koelheid of wantrouwen in culturen waar tempo zorgsaamheid uitdrukt.",
    en_strength: "You rarely act on rumor. Under pressure, your calm is contagious. In diverse teams, your systematic approach creates a sense of fairness.",
    id_strength: "Anda jarang bertindak berdasarkan rumor. Di bawah tekanan, ketenangan Anda menular. Dalam tim yang beragam, pendekatan sistematis Anda menciptakan rasa keadilan.",
    nl_strength: "Je handelt zelden op basis van roddels. Onder druk is jouw kalmte aanstekelijk. In diverse teams creëert jouw systematische aanpak een gevoel van eerlijkheid.",
    color: "oklch(45% 0.12 250)",
  },
  relational: {
    en_name: "The Relationship Anchor",
    id_name: "Jangkar Hubungan",
    nl_name: "Het Relationele Anker",
    en_desc: "Under pressure, you move through people. You expand consultation, listen widely, and wait until there is relational clarity before committing. In most of the world's cultures — where decisions are made together, not alone — this is not weakness. It is wisdom. But consultation without a moment of decisive leadership can feel like endless process, and your team eventually needs you to make the call.",
    id_desc: "Di bawah tekanan, Anda bergerak melalui orang-orang. Anda memperluas konsultasi, mendengarkan secara luas, dan menunggu hingga ada kejelasan relasional sebelum berkomitmen. Dalam sebagian besar budaya dunia — di mana keputusan dibuat bersama, bukan sendiri — ini bukan kelemahan. Ini adalah kebijaksanaan. Tetapi konsultasi tanpa momen kepemimpinan yang tegas bisa terasa seperti proses tanpa akhir.",
    nl_desc: "Onder druk beweeg je door mensen. Je breidt consultatie uit, luistert breed en wacht tot er relationele duidelijkheid is voordat je je vastlegt. In de meeste culturen wereldwijd — waar beslissingen samen worden genomen, niet alleen — is dit geen zwakte. Het is wijsheid. Maar consultatie zonder een moment van beslissend leiderschap kan aanvoelen als een eindeloos proces.",
    en_risk: "Broad consultation can become decision avoidance. Your team may feel led by committee. In urgent situations, your process can look like paralysis.",
    id_risk: "Konsultasi luas bisa menjadi penghindaran keputusan. Tim Anda mungkin merasa dipimpin oleh komite. Dalam situasi mendesak, proses Anda bisa terlihat seperti kelumpuhan.",
    nl_risk: "Brede consultatie kan beslissingsontwijking worden. Je team voelt zich misschien geleid door een commissie. In urgente situaties kan je proces eruitzien als verlamming.",
    en_strength: "You rarely alienate people with your decisions. You build buy-in before the announcement. You surface concerns that others miss entirely.",
    id_strength: "Anda jarang mengasingkan orang dengan keputusan Anda. Anda membangun dukungan sebelum pengumuman. Anda mengangkat kekhawatiran yang orang lain lewatkan.",
    nl_strength: "Je vervreemdt mensen zelden met je beslissingen. Je bouwt draagvlak op vóór de aankondiging. Je haalt zorgen naar boven die anderen volledig missen.",
    color: "oklch(45% 0.14 155)",
  },
  decisive: {
    en_name: "The Decisive Driver",
    id_name: "Penggerak Tegas",
    nl_name: "De Besliste Aanjager",
    en_desc: "Under pressure, you accelerate. You trust your read of the situation, make the call, and move forward — adjusting as you learn. In low-context, individualist cultures, this reads as strong leadership. In high-context cultures, your speed can register as arrogance before it registers as clarity. You may be entirely right about the decision and still lose the relationship because of how you made it.",
    id_desc: "Di bawah tekanan, Anda mempercepat. Anda mempercayai pemahaman Anda tentang situasi, membuat keputusan, dan melangkah maju — menyesuaikan saat Anda belajar. Dalam budaya berkonteks rendah dan individualis, ini dibaca sebagai kepemimpinan yang kuat. Dalam budaya berkonteks tinggi, kecepatan Anda bisa terdaftar sebagai kesombongan sebelum terdaftar sebagai kejelasan.",
    nl_desc: "Onder druk versnelt je. Je vertrouwt jouw lezing van de situatie, maakt de beslissing en beweegt vooruit — aanpassend naarmate je leert. In lage-context, individualistische culturen leest dit als sterk leiderschap. In hoge-context culturen kan jouw snelheid geregistreerd worden als arrogantie voordat het als duidelijkheid wordt gezien.",
    en_risk: "In cultures where process and face are part of the decision's quality, your outcome may be correct but your path costly. People may comply externally while disengaging internally.",
    id_risk: "Dalam budaya di mana proses dan menjaga muka adalah bagian dari kualitas keputusan, hasil Anda mungkin benar tetapi jalur Anda mahal. Orang mungkin mematuhi secara eksternal sambil melepaskan diri secara internal.",
    nl_risk: "In culturen waar proces en gezichtsbehoud deel uitmaken van de kwaliteit van de beslissing, kan jouw uitkomst correct zijn maar je pad kostbaar. Mensen kunnen extern gehoorzamen terwijl ze intern loslaten.",
    en_strength: "You cut through ambiguity. Your team knows where you stand. Decisive leadership reduces anxiety and drift — your clarity is a genuine gift to the people you lead.",
    id_strength: "Anda memotong ambiguitas. Tim Anda tahu di mana Anda berdiri. Kepemimpinan yang tegas mengurangi kecemasan dan penyimpangan — kejelasan Anda adalah hadiah nyata bagi orang yang Anda pimpin.",
    nl_strength: "Je doorsnijdt ambiguïteit. Je team weet waar je staat. Beslissend leiderschap vermindert angst en koersverlies — jouw duidelijkheid is een echte gave voor de mensen die je leidt.",
    color: "oklch(52% 0.18 25)",
  },
  adaptive: {
    en_name: "The Adaptive Leader",
    id_name: "Pemimpin Adaptif",
    nl_name: "De Adaptieve Leider",
    en_desc: "You don't have a single dominant pattern — you blended approaches across the four decisions. This may reflect genuine cross-cultural intelligence: reading each situation and choosing the response it calls for. Or it may reflect uncertainty about your own leadership identity. Only you know which is true. The question worth sitting with: were these choices the result of deliberate discernment, or responsive improvisation?",
    id_desc: "Anda tidak memiliki satu pola dominan — Anda memadukan pendekatan di empat keputusan. Ini mungkin mencerminkan kecerdasan lintas budaya yang tulus: membaca setiap situasi dan memilih respons yang dibutuhkan. Atau mungkin mencerminkan ketidakpastian tentang identitas kepemimpinan Anda sendiri. Pertanyaan yang layak direnungkan: apakah pilihan-pilihan ini merupakan hasil dari kebijaksanaan yang disengaja, atau improvisasi responsif?",
    nl_desc: "Je hebt geen enkel dominant patroon — je combineerde benaderingen over de vier beslissingen. Dit kan echte interculturele intelligentie weerspiegelen: elke situatie lezen en de respons kiezen die het vraagt. Of het kan onzekerheid over je eigen leiderschapsidentiteit weerspiegelen. Alleen jij weet welk van beide waar is. De vraag die de moeite waard is: waren deze keuzes het resultaat van bewuste onderscheiding, of van responsieve improvisatie?",
    en_risk: "Without a clear default, your team may be uncertain what to expect from you under pressure. Adaptability needs a stable core beneath it — or it becomes unpredictability.",
    id_risk: "Tanpa default yang jelas, tim Anda mungkin tidak yakin apa yang harus diharapkan dari Anda di bawah tekanan. Adaptabilitas membutuhkan inti yang stabil di bawahnya — atau menjadi ketidakpastian.",
    nl_risk: "Zonder een duidelijk standaard weet je team misschien niet wat ze onder druk van je kunnen verwachten. Aanpassingsvermogen heeft een stabiel fundament nodig — anders wordt het onvoorspelbaarheid.",
    en_strength: "You are not locked into one mode. In genuinely diverse contexts, you can work across a wider range of cultural expectations than leaders with a single strong default.",
    id_strength: "Anda tidak terkunci dalam satu mode. Dalam konteks yang benar-benar beragam, Anda dapat bekerja di berbagai harapan budaya yang lebih luas daripada pemimpin dengan satu default kuat.",
    nl_strength: "Je zit niet vast in één modus. In werkelijk diverse contexten kun je werken met een breder scala aan culturele verwachtingen dan leiders met één sterk standaard.",
    color: "oklch(65% 0.15 45)",
  },
};

function getProfile(answers: Record<number, ChoiceKey>): ProfileKey {
  const counts: Record<ChoiceKey, number> = { A: 0, C: 0, D: 0 };
  Object.values(answers).forEach(a => { counts[a]++; });
  const max = Math.max(counts.A, counts.C, counts.D);
  const leaders = (Object.keys(counts) as ChoiceKey[]).filter(k => counts[k] === max);
  if (leaders.length > 1) return "adaptive";
  if (leaders[0] === "A") return "analyst";
  if (leaders[0] === "C") return "relational";
  return "decisive";
}

type Props = { userPathway: string | null; isSaved: boolean };
export default function DecisionMakingClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [answers, setAnswers] = useState<Record<number, ChoiceKey>>({});
  const [activeVerse, setActiveVerse] = useState<VerseKey | null>(null);
  const [commitment, setCommitment] = useState("");
  const [committed, setCommitted] = useState(false);

  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);
  const currentStep = Object.keys(answers).length;
  const allAnswered = currentStep === 4;
  const profile = allAnswered ? PROFILES[getProfile(answers)] : null;

  const navy = "oklch(22% 0.10 260)";
  const orange = "oklch(65% 0.15 45)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const bodyText = "oklch(38% 0.05 260)";
  const serif = "var(--font-cormorant, Cormorant Garamond, Georgia, serif)";

  const progressDots = [1, 2, 3, 4].flatMap(n => {
    const isDone = !!answers[n];
    const isCurrent = !isDone && n === currentStep + 1;
    const elements = [
      <div key={`dot-${n}`} style={{
        width: 28, height: 28, borderRadius: "50%",
        background: isDone ? navy : isCurrent ? orange : "oklch(85% 0.008 80)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700,
        color: (isDone || isCurrent) ? offWhite : "oklch(60% 0.04 260)",
        transition: "all 0.2s ease",
      }}>
        {isDone ? "✓" : n}
      </div>
    ];
    if (n < 4) {
      elements.push(
        <div key={`line-${n}`} style={{
          width: 36, height: 2, borderRadius: 1,
          background: isDone ? navy : "oklch(85% 0.008 80)",
          transition: "background 0.2s ease",
        }} />
      );
    }
    return elements;
  });

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
            await saveResourceToDashboard("decision-making");
            setSaved(true);
          });
        }} disabled={saved || isPending} style={{
          padding: "8px 20px", borderRadius: 6,
          border: `1px solid ${saved ? "oklch(70% 0.04 260)" : orange}`,
          background: "transparent", color: saved ? "oklch(70% 0.04 260)" : orange,
          fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
          cursor: saved ? "default" : "pointer",
        }}>
          {saved ? t("✓ Saved to Dashboard", "✓ Tersimpan di Dashboard", "✓ Opgeslagen in Dashboard") : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
        </button>
      </div>

      {/* Hero */}
      <div style={{ background: navy, padding: "64px 24px 80px", textAlign: "center" }}>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: orange, marginBottom: 20, textTransform: "uppercase" }}>
          {t("Module 12 · Decision Making", "Modul 12 · Pengambilan Keputusan", "Module 12 · Besluitvorming")}
        </p>
        <h1 style={{ fontFamily: serif, fontSize: "clamp(40px, 6vw, 70px)", fontWeight: 600, color: offWhite, margin: "0 auto 20px", maxWidth: 700, lineHeight: 1.15 }}>
          {t("The Decision Under Pressure", "Keputusan di Bawah Tekanan", "De Beslissing onder Druk")}
        </h1>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 16, color: "oklch(78% 0.04 260)", maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }}>
          {t(
            "Four choices. One crisis. What your decisions reveal about how you actually lead.",
            "Empat pilihan. Satu krisis. Apa yang keputusan Anda ungkapkan tentang cara Anda sebenarnya memimpin.",
            "Vier keuzes. Één crisis. Wat jouw beslissingen onthullen over hoe jij werkelijk leidt."
          )}
        </p>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* How it works */}
        <div style={{ marginTop: 48, marginBottom: 52, padding: "28px 32px", background: lightGray, borderRadius: 12, borderTop: `4px solid ${orange}` }}>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: orange, marginBottom: 12, textTransform: "uppercase" }}>
            {t("How This Works", "Cara Kerja Ini", "Hoe Dit Werkt")}
          </p>
          <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
            {t(
              "You'll face a real cross-cultural leadership situation — a partnership in crisis, three weeks before a critical deadline. Make four sequential decisions. No answer is wrong. At the end, your choices reveal your default decision-making pattern and what it costs you in cross-cultural contexts.",
              "Anda akan menghadapi situasi kepemimpinan lintas budaya yang nyata — kemitraan dalam krisis, tiga minggu sebelum tenggat waktu penting. Buat empat keputusan berurutan. Tidak ada jawaban yang salah. Di akhir, pilihan Anda mengungkapkan pola pengambilan keputusan default Anda dan apa biayanya dalam konteks lintas budaya.",
              "Je staat voor een echte interculturele leiderschapssituatie — een partnerschap in crisis, drie weken voor een kritieke deadline. Neem vier opeenvolgende beslissingen. Geen antwoord is fout. Aan het einde onthullen je keuzes jouw standaard besluitvormingspatroon en wat het je kost in interculturele contexten."
            )}
          </p>
        </div>

        {/* Situation box */}
        <div style={{ marginBottom: 52, border: `2px solid ${navy}`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ background: navy, padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", color: orange, margin: 0, textTransform: "uppercase" }}>
              {t("The Situation", "Situasinya", "De Situatie")}
            </p>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "oklch(55% 0.05 260)", margin: 0, textTransform: "uppercase" }}>
              {t("Week 3 of 4", "Minggu ke-3 dari 4", "Week 3 van 4")}
            </p>
          </div>
          <div style={{ padding: "28px 32px", background: offWhite }}>
            <p style={{ fontFamily: serif, fontSize: 20, color: navy, lineHeight: 1.75, margin: "0 0 24px", fontStyle: "italic" }}>
              {t(
                "You lead a multicultural project team. Three weeks before a critical delivery, your key local partner organization in Indonesia has gone quiet. Emails are answered briefly. A team member mentions the partner's lead contact 'seems different lately.' No one has raised it directly.",
                "Anda memimpin tim proyek multikultural. Tiga minggu sebelum pengiriman penting, organisasi mitra lokal utama Anda di Indonesia menjadi diam. Email dijawab singkat. Seorang anggota tim menyebut kontak utama mitra 'tampak berbeda akhir-akhir ini.' Tidak ada yang membahasnya secara langsung.",
                "Je leidt een multicultureel projectteam. Drie weken voor een kritieke oplevering is jouw belangrijkste lokale partnerorganisatie in Indonesië stil geworden. E-mails worden kort beantwoord. Een teamlid merkt op dat de hoofdcontactpersoon 'lately anders lijkt.' Niemand heeft het direct aangekaart."
              )}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, paddingTop: 20, borderTop: "1px solid oklch(88% 0.008 80)" }}>
              {([
                { label: t("Team", "Tim", "Team"), value: t("Multicultural", "Multikultural", "Multicultureel") },
                { label: t("Time left", "Waktu tersisa", "Resterende tijd"), value: t("3 weeks", "3 minggu", "3 weken") },
                { label: t("Information", "Informasi", "Informatie"), value: t("Incomplete", "Tidak lengkap", "Onvolledig") },
              ] as { label: string; value: string }[]).map(item => (
                <div key={item.label} style={{ padding: "10px 16px", background: lightGray, borderRadius: 6 }}>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: orange, margin: "0 0 4px", textTransform: "uppercase" }}>{item.label}</p>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, color: navy, margin: 0 }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress dots */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 48, justifyContent: "center" }}>
          {progressDots}
        </div>

        {/* Decision blocks */}
        {DECISIONS.map(decision => {
          const isVisible = currentStep >= decision.id - 1;
          if (!isVisible) return null;
          const isAnswered = !!answers[decision.id];
          const myAnswer = answers[decision.id];
          return (
            <div key={decision.id} style={{ marginBottom: 48 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 14 }}>
                <span style={{ fontFamily: serif, fontSize: 52, fontWeight: 700, color: isAnswered ? "oklch(78% 0.05 260)" : orange, lineHeight: 1 }}>
                  {decision.id}
                </span>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "oklch(60% 0.04 260)", textTransform: "uppercase", margin: 0 }}>
                  {t(`Decision ${decision.id} of 4`, `Keputusan ${decision.id} dari 4`, `Beslissing ${decision.id} van 4`)}
                </p>
              </div>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 16, color: navy, fontWeight: 500, lineHeight: 1.65, marginBottom: 24 }}>
                {tFn(decision.en_context, decision.id_context, decision.nl_context, lang)}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                {(["A", "C", "D"] as ChoiceKey[]).map(key => {
                  const choice = decision.choices[key];
                  const isSelected = myAnswer === key;
                  const isDimmed = isAnswered && myAnswer !== key;
                  return (
                    <button key={key} onClick={() => { if (!isAnswered) setAnswers(prev => ({ ...prev, [decision.id]: key })); }} disabled={isAnswered}
                      style={{
                        padding: "20px", border: `2px solid ${isSelected ? orange : isDimmed ? "oklch(88% 0.008 80)" : navy}`,
                        borderRadius: 10, background: isSelected ? navy : isDimmed ? "oklch(96% 0.006 80)" : offWhite,
                        cursor: isAnswered ? "default" : "pointer", textAlign: "left",
                        opacity: isDimmed ? 0.38 : 1, transition: "all 0.15s ease",
                      }}>
                      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: isSelected ? orange : "oklch(55% 0.06 260)", textTransform: "uppercase", margin: "0 0 10px" }}>
                        {tFn(choice.en_label, choice.id_label, choice.nl_label, lang)}
                      </p>
                      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, lineHeight: 1.65, color: isSelected ? offWhite : bodyText, margin: 0 }}>
                        {tFn(choice.en, choice.id, choice.nl, lang)}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Profile reveal */}
        {allAnswered && profile && (
          <div style={{ marginTop: 20, padding: "48px 40px", background: navy, borderRadius: 16, color: offWhite }}>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", color: orange, margin: "0 0 12px", textTransform: "uppercase" }}>
              {t("Your Decision Profile", "Profil Keputusan Anda", "Jouw Beslissingsprofiel")}
            </p>
            <h2 style={{ fontFamily: serif, fontSize: "clamp(34px, 5vw, 54px)", fontWeight: 600, color: offWhite, margin: "0 0 8px", lineHeight: 1.1 }}>
              {tFn(profile.en_name, profile.id_name, profile.nl_name, lang)}
            </h2>
            <div style={{ width: 48, height: 4, background: profile.color, borderRadius: 2, margin: "0 0 28px" }} />
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 15, lineHeight: 1.8, color: "oklch(86% 0.03 260)", marginBottom: 36, maxWidth: 680 }}>
              {tFn(profile.en_desc, profile.id_desc, profile.nl_desc, lang)}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 28 }}>
              <div style={{ padding: "24px 24px", background: "oklch(17% 0.08 260)", borderRadius: 10 }}>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "oklch(65% 0.12 25)", textTransform: "uppercase", margin: "0 0 12px" }}>
                  {t("The Cultural Risk", "Risiko Budaya", "Het Culturele Risico")}
                </p>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, lineHeight: 1.75, color: "oklch(82% 0.03 260)", margin: 0 }}>
                  {tFn(profile.en_risk, profile.id_risk, profile.nl_risk, lang)}
                </p>
              </div>
              <div style={{ padding: "24px 24px", background: "oklch(17% 0.08 260)", borderRadius: 10 }}>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "oklch(58% 0.14 155)", textTransform: "uppercase", margin: "0 0 12px" }}>
                  {t("The Genuine Strength", "Kekuatan Nyata", "De Echte Kracht")}
                </p>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, lineHeight: 1.75, color: "oklch(82% 0.03 260)", margin: 0 }}>
                  {tFn(profile.en_strength, profile.id_strength, profile.nl_strength, lang)}
                </p>
              </div>
            </div>
            <div style={{ paddingTop: 20, borderTop: "1px solid oklch(35% 0.07 260)" }}>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: "oklch(58% 0.05 260)", textTransform: "uppercase", marginBottom: 12 }}>
                {t("Your Pattern", "Pola Anda", "Jouw Patroon")}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {DECISIONS.map(d => {
                  const key = answers[d.id];
                  const choice = d.choices[key];
                  return (
                    <span key={d.id} style={{ padding: "6px 14px", borderRadius: 20, background: "oklch(28% 0.08 260)", fontFamily: "Montserrat, sans-serif", fontSize: 11, color: offWhite, fontWeight: 500 }}>
                      {d.id}. {tFn(choice.en_label, choice.id_label, choice.nl_label, lang)}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Reset */}
        {allAnswered && (
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <button onClick={() => { setAnswers({}); setCommitment(""); setCommitted(false); }} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "oklch(55% 0.05 260)",
              textDecoration: "underline", padding: "8px 16px",
            }}>
              {t("Start over", "Mulai ulang", "Opnieuw beginnen")}
            </button>
          </div>
        )}

        {/* Biblical Foundation */}
        <div style={{ marginTop: 72 }}>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: orange, textTransform: "uppercase", marginBottom: 8 }}>
            {t("Biblical Foundation", "Dasar Alkitabiah", "Bijbelse Basis")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 600, color: navy, marginBottom: 24, lineHeight: 1.25 }}>
            {t("The Third Way: Asking God", "Jalan Ketiga: Bertanya kepada Allah", "De Derde Weg: God Vragen")}
          </h2>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 15, color: bodyText, lineHeight: 1.8, maxWidth: 680, marginBottom: 20 }}>
            {t(
              "Every framework for decision-making — analytical, relational, decisive — assumes that the answer exists somewhere and your job is to find it. Scripture offers a different starting point: wisdom is not found, it is given. And the posture it requires is not competence but humility — the admission that you do not have sufficient understanding on your own.",
              "Setiap kerangka pengambilan keputusan — analitis, relasional, tegas — mengasumsikan bahwa jawabannya ada di suatu tempat dan tugas Anda adalah menemukannya. Kitab Suci menawarkan titik awal yang berbeda: hikmat tidak ditemukan, melainkan diberikan. Dan sikap yang diperlukan bukan kompetensi tetapi kerendahan hati — pengakuan bahwa Anda tidak memiliki pemahaman yang cukup sendiri.",
              "Elk besluitvormingskader — analytisch, relationeel, beslissend — gaat ervan uit dat het antwoord ergens bestaat en dat het jouw taak is het te vinden. De Schrift biedt een ander vertrekpunt: wijsheid wordt niet gevonden, maar gegeven. En de houding die het vereist is niet competentie maar nederigheid — de erkenning dat je op eigen kracht niet genoeg begrip hebt."
            )}
          </p>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 15, color: bodyText, lineHeight: 1.8, maxWidth: 680, marginBottom: 36 }}>
            {t(
              "This doesn't make analysis irrelevant or relationships unimportant. It adds a prior step: before you reach for data or consult your network, bring the question to God. Not as a ritual to check off, but as a genuine admission that the pressured moment is beyond you — and that you serve a King who governs the outcome.",
              "Ini tidak membuat analisis menjadi tidak relevan atau hubungan menjadi tidak penting. Ini menambahkan langkah sebelumnya: sebelum Anda mencari data atau berkonsultasi dengan jaringan Anda, bawa pertanyaan itu kepada Allah. Bukan sebagai ritual untuk diselesaikan, tetapi sebagai pengakuan tulus bahwa momen tertekan ini melampaui kemampuan Anda — dan bahwa Anda melayani Raja yang mengatur hasil.",
              "Dit maakt analyse niet irrelevant of relaties onbelangrijk. Het voegt een voorafgaande stap toe: voordat je naar data grijpt of je netwerk raadpleegt, breng de vraag voor God. Niet als een ritueel om af te vinken, maar als een oprechte erkenning dat het drukmomenten je te boven gaan — en dat je een Koning dient die de uitkomst bestuurt."
            )}
          </p>

          {/* Verse cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {(["prov-3-5-6", "james-1-5"] as VerseKey[]).map(vKey => {
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

        {/* Reflection & commitment */}
        <div style={{ marginTop: 60, padding: "40px", background: lightGray, borderRadius: 16 }}>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: orange, textTransform: "uppercase", marginBottom: 12 }}>
            {t("Your Response", "Respons Anda", "Jouw Reactie")}
          </p>
          <p style={{ fontFamily: serif, fontSize: 22, color: navy, lineHeight: 1.6, marginBottom: 24, fontStyle: "italic" }}>
            {t(
              "Think of a high-stakes decision you're currently facing. What would it look like to bring it to God before reaching for your default pattern?",
              "Pikirkan sebuah keputusan berisiko tinggi yang sedang Anda hadapi saat ini. Seperti apa rasanya membawanya kepada Allah sebelum mencapai pola default Anda?",
              "Denk aan een beslissing met hoge inzet waarvoor je nu staat. Hoe zou het eruit zien om die bij God te brengen voordat je naar jouw standaardpatroon grijpt?"
            )}
          </p>
          {!committed ? (
            <>
              <textarea value={commitment} onChange={e => setCommitment(e.target.value)}
                placeholder={t("Write your reflection here...", "Tuliskan refleksi Anda di sini...", "Schrijf hier je reflectie...")}
                style={{
                  width: "100%", minHeight: 120, padding: "16px",
                  border: "1px solid oklch(80% 0.012 80)", borderRadius: 8,
                  fontFamily: "Montserrat, sans-serif", fontSize: 14, color: bodyText,
                  background: offWhite, resize: "vertical", lineHeight: 1.6, boxSizing: "border-box",
                }} />
              <button onClick={() => { if (commitment.trim()) setCommitted(true); }} disabled={!commitment.trim()} style={{
                marginTop: 16, padding: "12px 28px",
                background: commitment.trim() ? navy : "oklch(80% 0.01 80)",
                color: offWhite, border: "none", borderRadius: 6,
                fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.06em",
                cursor: commitment.trim() ? "pointer" : "default",
              }}>
                {t("Commit to This", "Berkomitmen pada Ini", "Hier Aan Verbinden")}
              </button>
            </>
          ) : (
            <div style={{ padding: "24px 28px", background: offWhite, borderRadius: 10, border: "1px solid oklch(88% 0.008 80)" }}>
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
        <div style={{ marginTop: 52, textAlign: "center" }}>
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
