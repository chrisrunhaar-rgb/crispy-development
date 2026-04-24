"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const SCENARIOS = [
  {
    num: 1,
    en_theme: "Listening",
    id_theme: "Mendengarkan",
    nl_theme: "Luisteren",
    en_setup: "You're leading a debrief after a project that went poorly. A junior Indonesian team member has been quiet the whole meeting. Thirty minutes in, she starts to speak — then hesitates as a senior Dutch colleague begins talking at the same time.",
    id_setup: "Anda memimpin debrief setelah proyek yang berjalan buruk. Anggota tim junior Indonesia telah diam sepanjang rapat. Tiga puluh menit kemudian, dia mulai berbicara — kemudian ragu-ragu saat rekan kerja Belanda yang senior mulai berbicara bersamaan.",
    nl_setup: "Je leidt een debrief na een project dat slecht is verlopen. Een junior Indonesisch teamlid heeft de hele vergadering gezwegen. Dertig minuten later begint ze te spreken — dan aarzelt ze als een senior Nederlandse collega tegelijkertijd begint te praten.",
    options: [
      {
        key: "a",
        en_text: "Gently interrupt your Dutch colleague: \"Sorry — I think Rini was about to say something.\"",
        id_text: "Dengan lembut menyela rekan Belanda Anda: \"Maaf — saya rasa Rini mau mengatakan sesuatu.\"",
        nl_text: "Je Nederlandse collega vriendelijk onderbreken: \"Sorry — ik denk dat Rini iets wilde zeggen.\"",
        en_reveal: "Active listening in action. You created space for a voice that the room's default power dynamics were erasing. In cross-cultural teams, this is not just courtesy — it is leadership.",
        id_reveal: "Mendengarkan aktif dalam tindakan. Anda menciptakan ruang untuk suara yang sedang dihapus oleh dinamika kekuasaan default ruangan. Dalam tim lintas budaya, ini bukan hanya kesopanan — ini kepemimpinan.",
        nl_reveal: "Actief luisteren in actie. Je creëerde ruimte voor een stem die de standaard machtsdynamiek van de kamer aan het uitwissen was. In interculturele teams is dit niet alleen hoffelijkheid — het is leiderschap.",
        en_char: "Listening",
        id_char: "Mendengarkan",
        nl_char: "Luisteren",
      },
      {
        key: "b",
        en_text: "Let your senior colleague finish, then ask Rini directly at the end of the meeting.",
        id_text: "Biarkan rekan senior selesai, kemudian tanya Rini langsung di akhir rapat.",
        nl_text: "Je senior collega laten uitspreken, dan Rini direct vragen aan het eind van de vergadering.",
        en_reveal: "Reasonable — but the moment passed. In high-power-distance cultures, asking someone individually at the end after they were already overridden often results in a more guarded answer, not an honest one.",
        id_reveal: "Masuk akal — tetapi momennya sudah berlalu. Dalam budaya berjarak kekuasaan tinggi, meminta seseorang secara individual di akhir setelah mereka sudah dilewati sering menghasilkan jawaban yang lebih terjaga, bukan yang jujur.",
        nl_reveal: "Redelijk — maar het moment is voorbij. In hoge machtafstandsculturen resulteert het individueel vragen aan iemand aan het einde nadat ze al overstemd zijn vaak in een meer terughoudend antwoord, niet een eerlijk.",
        en_char: "Delayed inclusion",
        id_char: "Inklusi tertunda",
        nl_char: "Uitgestelde inclusie",
      },
      {
        key: "c",
        en_text: "The meeting is already running long. Move to close and ask for written input from everyone afterwards.",
        id_text: "Rapat sudah berjalan terlalu lama. Bergerak untuk menutup dan minta masukan tertulis dari semua orang setelahnya.",
        nl_text: "De vergadering loopt al te lang. Afsluiten en daarna schriftelijke input vragen van iedereen.",
        en_reveal: "Efficiency over inclusion. Written input after the fact rarely surfaces what face-to-face honesty would — especially from team members who were already hesitant to speak.",
        id_reveal: "Efisiensi di atas inklusi. Masukan tertulis setelah kejadian jarang mengungkapkan apa yang kejujuran tatap muka akan ungkapkan — terutama dari anggota tim yang sudah ragu untuk berbicara.",
        nl_reveal: "Efficiëntie boven inclusie. Schriftelijke input achteraf brengt zelden op wat face-to-face eerlijkheid zou doen — zeker niet van teamleden die al aarzelden te spreken.",
        en_char: "Task over person",
        id_char: "Tugas di atas orang",
        nl_char: "Taak boven persoon",
      },
    ],
  },
  {
    num: 2,
    en_theme: "Empathy",
    id_theme: "Empati",
    nl_theme: "Empathie",
    en_setup: "A team member delivers a key report 48 hours late — the third time this month. You are frustrated. Before you address it, you discover that his father is seriously ill in his home province.",
    id_setup: "Anggota tim menyerahkan laporan penting 48 jam terlambat — ketiga kalinya bulan ini. Anda frustrasi. Sebelum Anda mengatasinya, Anda menemukan bahwa ayahnya sakit parah di provinsi asalnya.",
    nl_setup: "Een teamlid levert een belangrijk rapport 48 uur te laat in — de derde keer deze maand. Je bent gefrustreerd. Voordat je het aanpakt, ontdek je dat zijn vader ernstig ziek is in zijn thuisprovincie.",
    options: [
      {
        key: "a",
        en_text: "Address the pattern directly: \"I understand you're going through difficulty, but the team needs reliability. This can't continue.\"",
        id_text: "Tangani polanya secara langsung: \"Saya mengerti Anda sedang menghadapi kesulitan, tetapi tim membutuhkan keandalan. Ini tidak bisa dilanjutkan.\"",
        nl_text: "Het patroon direct aanpakken: \"Ik begrijp dat je het moeilijk hebt, maar het team heeft betrouwbaarheid nodig. Dit kan niet doorgaan.\"",
        en_reveal: "Accountability without empathy. The statement is fair in isolation — but given the context, it treats a human crisis as a performance issue. The relationship will likely survive, but trust will erode.",
        id_reveal: "Akuntabilitas tanpa empati. Pernyataan itu adil secara terpisah — tetapi mengingat konteksnya, itu memperlakukan krisis manusiawi sebagai masalah kinerja. Hubungan mungkin akan bertahan, tetapi kepercayaan akan terkikis.",
        nl_reveal: "Verantwoording zonder empathie. De uitspraak is op zichzelf eerlijk — maar gezien de context behandelt het een menselijke crisis als een prestatie-issue. De relatie overleeft waarschijnlijk, maar vertrouwen erodeert.",
        en_char: "Accountability without context",
        id_char: "Akuntabilitas tanpa konteks",
        nl_char: "Verantwoording zonder context",
      },
      {
        key: "b",
        en_text: "Set the pattern conversation aside entirely. Focus only on supporting him through this season.",
        id_text: "Sisihkan sepenuhnya percakapan tentang pola. Fokus hanya pada mendukungnya melalui masa ini.",
        nl_text: "Het gesprek over het patroon volledig opzij zetten. Alleen focussen op hem ondersteunen in deze periode.",
        en_reveal: "Compassion without clarity. The person feels seen — but nothing changes for the team, and the next deadline carries the same ambiguity. Full empathy also includes being honest about what the situation requires.",
        id_reveal: "Kasih sayang tanpa kejelasan. Orang itu merasa diperhatikan — tetapi tidak ada yang berubah untuk tim, dan tenggat waktu berikutnya membawa ambiguitas yang sama. Empati penuh juga mencakup kejujuran tentang apa yang dibutuhkan situasi.",
        nl_reveal: "Medeleven zonder duidelijkheid. De persoon voelt zich gezien — maar er verandert niets voor het team, en de volgende deadline draagt dezelfde ambiguïteit. Volledige empathie omvat ook eerlijk zijn over wat de situatie vereist.",
        en_char: "Compassion without clarity",
        id_char: "Kasih sayang tanpa kejelasan",
        nl_char: "Medeleven zonder duidelijkheid",
      },
      {
        key: "c",
        en_text: "Ask how he's doing first and listen fully. Then have an honest conversation: how can you both protect him and serve the team?",
        id_text: "Tanyakan dulu bagaimana keadaannya dan dengarkan sepenuhnya. Kemudian adakan percakapan jujur: bagaimana Anda bisa melindunginya sekaligus melayani tim?",
        nl_text: "Eerst vragen hoe het met hem gaat en volledig luisteren. Dan een eerlijk gesprek voeren: hoe kunnen jullie hem beschermen én het team dienen?",
        en_reveal: "Empathy with stewardship. You are fully present for the person AND honest about the real situation. This is what servant leaders do — they hold complexity without resolving it by ignoring one side.",
        id_reveal: "Empati dengan penatalayanan. Anda sepenuhnya hadir untuk orang tersebut DAN jujur tentang situasi nyata. Inilah yang dilakukan pemimpin hamba — mereka memegang kompleksitas tanpa menyelesaikannya dengan mengabaikan satu sisi.",
        nl_reveal: "Empathie met rentmeesterschap. Je bent volledig aanwezig voor de persoon EN eerlijk over de werkelijke situatie. Dit is wat dienend leiders doen — ze houden complexiteit vast zonder het op te lossen door één kant te negeren.",
        en_char: "Empathy + Stewardship",
        id_char: "Empati + Penatalayanan",
        nl_char: "Empathie + Rentmeesterschap",
      },
    ],
  },
  {
    num: 3,
    en_theme: "Stewardship",
    id_theme: "Penatalayanan",
    nl_theme: "Rentmeesterschap",
    en_setup: "Your team completes a difficult six-month project with strong results. The regional director sends you a congratulatory email and copies the CEO. You led the project. The real work was done by four people on your team.",
    id_setup: "Tim Anda menyelesaikan proyek enam bulan yang sulit dengan hasil yang kuat. Direktur regional mengirimkan email selamat kepada Anda dan menyalin CEO. Anda memimpin proyek. Pekerjaan nyata dilakukan oleh empat orang di tim Anda.",
    nl_setup: "Je team voltooit een moeilijk project van zes maanden met sterke resultaten. De regionale directeur stuurt je een felicitatiemail en cc't de CEO. Jij leidde het project. Het echte werk is gedaan door vier mensen in je team.",
    options: [
      {
        key: "a",
        en_text: "Reply thanking the director, then forward it to your team with a personal note of appreciation.",
        id_text: "Balas dengan berterima kasih kepada direktur, kemudian teruskan ke tim Anda dengan catatan apresiasi pribadi.",
        nl_text: "Antwoorden met dankbetuiging aan de directeur, dan doorsturen naar je team met een persoonlijke waarderingsnoot.",
        en_reveal: "Appreciation — but private. Your team sees the recognition internally. The director and CEO do not. In hierarchical contexts, who knows matters as much as whether you say it.",
        id_reveal: "Apresiasi — tetapi privat. Tim Anda melihat pengakuan secara internal. Direktur dan CEO tidak. Dalam konteks hierarkis, siapa yang tahu sama pentingnya dengan apakah Anda mengatakannya.",
        nl_reveal: "Waardering — maar privé. Je team ziet de erkenning intern. De directeur en CEO niet. In hiërarchische contexten maakt het uit wie het weet, niet alleen of je het zegt.",
        en_char: "Recognition (private)",
        id_char: "Pengakuan (privat)",
        nl_char: "Erkenning (privé)",
      },
      {
        key: "b",
        en_text: "Reply with gratitude and mention it was a strong team effort — without naming individuals.",
        id_text: "Balas dengan rasa syukur dan sebutkan bahwa itu adalah upaya tim yang kuat — tanpa menyebutkan nama individu.",
        nl_text: "Antwoorden met dankbaarheid en vermelden dat het een sterke teaminspanning was — zonder individuen te noemen.",
        en_reveal: "Modest — but generic. 'Team effort' is honest but invisible. No one grows professionally from being mentioned as part of a collective. Good stewardship is specific.",
        id_reveal: "Rendah hati — tetapi umum. 'Upaya tim' itu jujur tetapi tidak terlihat. Tidak ada yang tumbuh secara profesional dari disebutkan sebagai bagian dari kolektif. Penatalayanan yang baik itu spesifik.",
        nl_reveal: "Bescheiden — maar generiek. 'Teaminspanning' is eerlijk maar onzichtbaar. Niemand groeit professioneel van vermeld worden als onderdeel van een collectief. Goed rentmeesterschap is specifiek.",
        en_char: "Modest but vague",
        id_char: "Rendah hati tapi samar",
        nl_char: "Bescheiden maar vaag",
      },
      {
        key: "c",
        en_text: "Reply with specific names and contributions: 'This result belongs to Andi, Sarah, Pak Budi, and Wim — here is what each one did.'",
        id_text: "Balas dengan nama spesifik dan kontribusi: 'Hasil ini milik Andi, Sarah, Pak Budi, dan Wim — inilah apa yang masing-masing lakukan.'",
        nl_text: "Antwoorden met specifieke namen en bijdragen: 'Dit resultaat is van Andi, Sarah, Pak Budi en Wim — dit is wat elk van hen deed.'",
        en_reveal: "Stewardship. You used your position of visibility to give others what they cannot give themselves: recognition in front of leadership. Servant leaders understand that power is most useful when given away.",
        id_reveal: "Penatalayanan. Anda menggunakan posisi visibilitas Anda untuk memberi orang lain apa yang tidak bisa mereka berikan sendiri: pengakuan di depan kepemimpinan. Pemimpin hamba memahami bahwa kekuasaan paling berguna ketika diberikan.",
        nl_reveal: "Rentmeesterschap. Je hebt je positie van zichtbaarheid gebruikt om anderen te geven wat ze zichzelf niet kunnen geven: erkenning voor leiderschap. Dienend leiders begrijpen dat macht het meest nuttig is als je het weggeeft.",
        en_char: "Stewardship",
        id_char: "Penatalayanan",
        nl_char: "Rentmeesterschap",
      },
    ],
  },
  {
    num: 4,
    en_theme: "Commitment to Growth",
    id_theme: "Komitmen terhadap Pertumbuhan",
    nl_theme: "Toewijding aan groei",
    en_setup: "Your strongest team member — a Javanese leader with exceptional relational intelligence — tells you she's been offered a leadership role at another organisation. She's clearly excited. Losing her would significantly set back your team.",
    id_setup: "Anggota tim Anda yang terkuat — seorang pemimpin Jawa dengan kecerdasan relasional yang luar biasa — memberi tahu Anda bahwa dia telah ditawari peran kepemimpinan di organisasi lain. Dia jelas-jelas bersemangat. Kehilangannya akan sangat menghambat tim Anda.",
    nl_setup: "Je sterkste teamlid — een Javaanse leider met uitzonderlijke relationele intelligentie — vertelt je dat ze een leiderschapsrol aangeboden heeft gekregen bij een andere organisatie. Ze is duidelijk enthousiast. Haar verliezen zou je team aanzienlijk vertragen.",
    options: [
      {
        key: "a",
        en_text: "Tell her the timing is really difficult and ask if there's anything you could offer to make staying appealing.",
        id_text: "Katakan padanya bahwa waktunya sangat sulit dan tanya apakah ada yang bisa Anda tawarkan untuk membuat tinggal menjadi menarik.",
        nl_text: "Haar vertellen dat de timing echt moeilijk is en vragen of er iets is wat je kunt aanbieden om blijven aantrekkelijk te maken.",
        en_reveal: "Retention over development. Your honest response reveals that her growth is secondary to your need. Even if she stays, the dynamic has shifted: she now knows your support is conditional on her usefulness to you.",
        id_reveal: "Retensi di atas pengembangan. Respons jujur Anda mengungkapkan bahwa pertumbuhannya adalah sekunder dari kebutuhan Anda. Bahkan jika dia tinggal, dinamikanya telah berubah: dia sekarang tahu dukungan Anda bersyarat pada kegunaannya bagi Anda.",
        nl_reveal: "Retentie boven ontwikkeling. Je eerlijke reactie onthult dat haar groei ondergeschikt is aan jouw behoefte. Zelfs als ze blijft, is de dynamiek veranderd: ze weet nu dat jouw steun voorwaardelijk is aan haar nut voor jou.",
        en_char: "Retention over growth",
        id_char: "Retensi di atas pertumbuhan",
        nl_char: "Retentie boven groei",
      },
      {
        key: "b",
        en_text: "Share your honest reaction — that it's hard news — then ask what drew her to this opportunity and what she needs to thrive.",
        id_text: "Bagikan reaksi jujur Anda — bahwa ini berita yang berat — lalu tanya apa yang menariknya ke kesempatan ini dan apa yang dia butuhkan untuk berkembang.",
        nl_text: "Je eerlijke reactie delen — dat het moeilijk nieuws is — dan vragen wat haar naar deze kans trok en wat ze nodig heeft om te gedijen.",
        en_reveal: "Honesty with interest in her development. You're not hiding your feelings — but you're making her growth the centre of the conversation, not your loss. This is the middle path of servant leadership.",
        id_reveal: "Kejujuran dengan minat pada pengembangannya. Anda tidak menyembunyikan perasaan Anda — tetapi Anda membuat pertumbuhannya sebagai pusat percakapan, bukan kehilangan Anda. Ini adalah jalan tengah kepemimpinan hamba.",
        nl_reveal: "Eerlijkheid met interesse in haar ontwikkeling. Je verbergt je gevoelens niet — maar je maakt haar groei het middelpunt van het gesprek, niet jouw verlies. Dit is het middenpad van dienend leiderschap.",
        en_char: "Growth + Honesty",
        id_char: "Pertumbuhan + Kejujuran",
        nl_char: "Groei + Eerlijkheid",
      },
      {
        key: "c",
        en_text: "Share your genuine support and offer to write her the strongest recommendation letter you can.",
        id_text: "Bagikan dukungan tulus Anda dan tawarkan untuk menulis surat rekomendasi terkuat yang bisa Anda tulis.",
        nl_text: "Je oprechte steun delen en aanbieden haar de sterkste aanbevelingsbrief te schrijven die je kunt schrijven.",
        en_reveal: "Commitment to growth. You put her future ahead of your present need. This is the most costly form of servant leadership — and often the most remembered. She will carry that throughout her career.",
        id_reveal: "Komitmen terhadap pertumbuhan. Anda mengutamakan masa depannya di atas kebutuhan Anda saat ini. Ini adalah bentuk kepemimpinan hamba yang paling mahal — dan sering kali yang paling diingat. Dia akan membawa itu sepanjang karirnya.",
        nl_reveal: "Toewijding aan groei. Je stelt haar toekomst boven jouw huidige behoefte. Dit is de meest kostbare vorm van dienend leiderschap — en vaak de meest herinnerde. Ze zal dit door haar carrière met zich meedragen.",
        en_char: "Commitment to Growth",
        id_char: "Komitmen terhadap Pertumbuhan",
        nl_char: "Toewijding aan groei",
      },
    ],
  },
  {
    num: 5,
    en_theme: "Building Community",
    id_theme: "Membangun Komunitas",
    nl_theme: "Gemeenschapsopbouw",
    en_setup: "Your cross-cultural team functions well professionally but stays in cultural subgroups outside of work — Javanese members with Javanese, Bataknese with Bataknese. You notice that this is limiting the trust that would make the team exceptional.",
    id_setup: "Tim lintas budaya Anda berfungsi dengan baik secara profesional tetapi tetap dalam subkelompok budaya di luar pekerjaan — anggota Jawa dengan Jawa, Batak dengan Batak. Anda memperhatikan bahwa ini membatasi kepercayaan yang akan membuat tim menjadi luar biasa.",
    nl_setup: "Je interculturele team functioneert professioneel goed maar blijft in culturele subgroepen buiten het werk — Javaanse leden met Javanen, Batakkers met Batakkers. Je merkt dat dit het vertrouwen beperkt dat het team uitzonderlijk zou maken.",
    options: [
      {
        key: "a",
        en_text: "Organise a structured team-building event with activities designed to mix the cultural subgroups.",
        id_text: "Organisasi acara team-building terstruktur dengan aktivitas yang dirancang untuk mencampur subkelompok budaya.",
        nl_text: "Een gestructureerd teambuildingevenement organiseren met activiteiten ontworpen om de culturele subgroepen te mengen.",
        en_reveal: "Building community through structure. This can work — especially for teams that need a formal context to cross informal boundaries. The risk is that structured events don't always create authentic connection.",
        id_reveal: "Membangun komunitas melalui struktur. Ini bisa berhasil — terutama untuk tim yang membutuhkan konteks formal untuk melintasi batas informal. Risikonya adalah acara terstruktur tidak selalu menciptakan koneksi yang autentik.",
        nl_reveal: "Gemeenschapsopbouw via structuur. Dit kan werken — zeker voor teams die een formele context nodig hebben om informele grenzen te overschrijden. Het risico is dat gestructureerde evenementen niet altijd authentieke verbinding creëren.",
        en_char: "Building Community (structured)",
        id_char: "Membangun Komunitas (terstruktur)",
        nl_char: "Gemeenschapsopbouw (gestructureerd)",
      },
      {
        key: "b",
        en_text: "Trust that people will connect naturally over time. Forcing community rarely works.",
        id_text: "Percayai bahwa orang-orang akan terhubung secara alami seiring waktu. Memaksakan komunitas jarang berhasil.",
        nl_text: "Vertrouwen dat mensen op natuurlijke wijze zullen verbinden in de loop van de tijd. Gemeenschap forceren werkt zelden.",
        en_reveal: "Passive waiting. Cross-cultural connection rarely happens without a leader who actively models it. Teams take their relational cues from how the leader moves across cultural lines — not from being left to figure it out.",
        id_reveal: "Menunggu secara pasif. Koneksi lintas budaya jarang terjadi tanpa pemimpin yang secara aktif mencontohkannya. Tim mengambil isyarat relasional dari bagaimana pemimpin bergerak melintasi garis budaya — bukan dari dibiarkan untuk mencari tahu sendiri.",
        nl_reveal: "Passief wachten. Interculturele verbinding gebeurt zelden zonder een leider die het actief modelleert. Teams nemen hun relationele signalen van hoe de leider zich over culturele lijnen beweegt — niet van aan hun lot overgelaten worden.",
        en_char: "Passive",
        id_char: "Pasif",
        nl_char: "Passief",
      },
      {
        key: "c",
        en_text: "Start by modelling it yourself — eat lunch with different people, build cross-cultural friendships, and let the team watch you move between groups naturally.",
        id_text: "Mulailah dengan mencontohkannya sendiri — makan siang dengan orang-orang yang berbeda, bangun persahabatan lintas budaya, dan biarkan tim melihat Anda bergerak di antara kelompok secara alami.",
        nl_text: "Beginnen met het zelf te modelleren — lunchen met verschillende mensen, interculturele vriendschappen opbouwen en het team laten zien hoe je op natuurlijke wijze tussen groepen beweegt.",
        en_reveal: "Building community by modelling. The most durable cross-cultural trust is built when the leader demonstrates that cultural boundaries are crossable — not by organising events, but by living it. Teams rarely go where their leader has not gone first.",
        id_reveal: "Membangun komunitas dengan mencontohkan. Kepercayaan lintas budaya yang paling tahan lama dibangun ketika pemimpin menunjukkan bahwa batas budaya bisa dilintasi — bukan dengan mengorganisasi acara, tetapi dengan menghidupinya. Tim jarang pergi ke mana pemimpin mereka belum pergi lebih dulu.",
        nl_reveal: "Gemeenschapsopbouw door modelleren. Het meest duurzame interculturele vertrouwen wordt gebouwd wanneer de leider laat zien dat culturele grenzen overschreden kunnen worden — niet door evenementen te organiseren, maar door het te leven. Teams gaan zelden waar hun leider niet als eerste is geweest.",
        en_char: "Building Community (modelling)",
        id_char: "Membangun Komunitas (mencontohkan)",
        nl_char: "Gemeenschapsopbouw (modelleren)",
      },
    ],
  },
];

const VERSES = {
  "mark-10-45": {
    en_ref: "Mark 10:45",
    id_ref: "Markus 10:45",
    nl_ref: "Markus 10:45",
    en: "For even the Son of Man did not come to be served, but to serve, and to give his life as a ransom for many.",
    id: "Karena Anak Manusia juga datang bukan untuk dilayani, melainkan untuk melayani dan untuk memberikan nyawa-Nya menjadi tebusan bagi banyak orang.",
    nl: "Want ook de Mensenzoon is niet gekomen om gediend te worden, maar om te dienen en zijn leven te geven als losgeld voor velen.",
  },
  "phil-2-3": {
    en_ref: "Philippians 2:3–4",
    id_ref: "Filipi 2:3–4",
    nl_ref: "Filippenzen 2:3–4",
    en: "Do nothing out of selfish ambition or vain conceit. Rather, in humility value others above yourselves, not looking to your own interests but each of you to the interests of the others.",
    id: "Dengan tidak mencari kepentingan sendiri atau puji-pujian yang sia-sia. Sebaliknya hendaklah dengan rendah hati yang seorang menganggap yang lain lebih utama dari pada dirinya sendiri; dan janganlah tiap-tiap orang hanya memperhatikan kepentingannya sendiri, tetapi kepentingan orang lain juga.",
    nl: "Doe niets uit zelfzucht of eigenwaan, maar acht in ootmoed de een de ander uitnemender dan uzelf; en ieder lette niet op het zijne, maar ieder ook op dat van de ander.",
  },
};

type Props = { userPathway: string | null; isSaved: boolean };

export default function ServantLeadershipClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang, setLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [choices, setChoices] = useState<Record<number, string>>({});
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);
  const showSave = userPathway !== null;
  const allChosen = Object.keys(choices).length === 5;
  const translation = lang === "id" ? "TB" : lang === "nl" ? "NBV" : "NIV";

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("servant-leadership");
      setSaved(true);
    });
  }

  return (
    <>
      {/* ── HERO ── */}
      <section style={{ background: "oklch(22% 0.10 260)", paddingTop: "clamp(2.5rem, 4vw, 4rem)", paddingBottom: "clamp(2.5rem, 4vw, 4rem)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, oklch(97% 0.005 80 / 0.04) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div className="container-wide" style={{ position: "relative" }}>
          <Link href="/resources" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(62% 0.04 260)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem", marginBottom: "1.5rem" }}>
            ← Content Library
          </Link>

          <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.75rem" }}>
            {(["en", "id", "nl"] as Lang[]).map(l => (
              <button key={l} onClick={() => setLang(l)} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "0.3rem 0.7rem", background: lang === l ? "oklch(65% 0.15 45)" : "transparent", color: lang === l ? "oklch(14% 0.08 260)" : "oklch(60% 0.04 260)", border: "1px solid", borderColor: lang === l ? "oklch(65% 0.15 45)" : "oklch(35% 0.05 260)", cursor: "pointer" }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", background: "oklch(65% 0.15 45 / 0.15)", color: "oklch(82% 0.08 60)", padding: "0.25rem 0.75rem", display: "inline-flex", marginBottom: "1.25rem" }}>
            {t("Scenario-based", "Berbasis skenario", "Scenario-gebaseerd")}
          </span>

          <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: "oklch(97% 0.005 80)", marginBottom: "1rem", lineHeight: 1.05, maxWidth: "14ch" }}>
            {lang === "en" ? <>The Servant<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Test.</span></> : lang === "id" ? <>Ujian<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Hamba.</span></> : <>De Dienende<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Test.</span></>}
          </h1>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "clamp(1rem, 1.5vw, 1.1rem)", color: "oklch(72% 0.04 260)", maxWidth: "52ch", marginBottom: "2rem", lineHeight: 1.65 }}>
            {t(
              "Five real leadership moments. No wrong answers — just honest ones. Each choice reveals something about how you actually lead.",
              "Lima momen kepemimpinan nyata. Tidak ada jawaban yang salah — hanya yang jujur. Setiap pilihan mengungkapkan sesuatu tentang cara Anda sebenarnya memimpin.",
              "Vijf echte leiderschapsmomenten. Geen verkeerde antwoorden — alleen eerlijke. Elke keuze onthult iets over hoe je werkelijk leidt.",
            )}
          </p>

          {showSave && (
            saved ? (
              <Link href="/dashboard" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", color: "oklch(72% 0.14 145)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
                ✓ {t("In your dashboard", "Di dashboard Anda", "In uw dashboard")}
              </Link>
            ) : (
              <button onClick={handleSave} disabled={isPending} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", color: "oklch(97% 0.005 80)", background: isPending ? "oklch(40% 0.10 260)" : "oklch(30% 0.12 260)", border: "none", padding: "0.625rem 1.25rem", cursor: isPending ? "wait" : "pointer" }}>
                {isPending ? t("Saving…", "Menyimpan…", "Opslaan…") : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
              </button>
            )
          )}
        </div>
      </section>

      {/* ── SCENARIOS ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            {SCENARIOS.map(scenario => {
              const chosen = choices[scenario.num] ?? null;
              const chosenOption = chosen ? scenario.options.find(o => o.key === chosen) ?? null : null;
              const theme = lang === "en" ? scenario.en_theme : lang === "id" ? scenario.id_theme : scenario.nl_theme;
              const setup = lang === "en" ? scenario.en_setup : lang === "id" ? scenario.id_setup : scenario.nl_setup;

              return (
                <div key={scenario.num} style={{ background: chosen ? "oklch(96% 0.012 65)" : "oklch(99% 0.003 80)", padding: "2rem clamp(1.5rem, 4vw, 2.5rem)" }}>
                  <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                    <span style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "2.5rem", fontWeight: 700, color: "oklch(65% 0.15 45)", lineHeight: 1, flexShrink: 0, minWidth: "2.5rem" }}>{scenario.num}</span>
                    <div>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.375rem" }}>{theme}</p>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(38% 0.05 260)", margin: 0 }}>{setup}</p>
                    </div>
                  </div>

                  <div style={{ paddingLeft: "3.75rem", display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: chosenOption ? "1.5rem" : 0 }}>
                    {scenario.options.map(opt => {
                      const isChosen = chosen === opt.key;
                      const text = lang === "en" ? opt.en_text : lang === "id" ? opt.id_text : opt.nl_text;
                      return (
                        <button
                          key={opt.key}
                          onClick={() => setChoices(c => ({ ...c, [scenario.num]: opt.key }))}
                          style={{
                            textAlign: "left",
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.875rem",
                            lineHeight: 1.65,
                            padding: "1rem 1.25rem",
                            background: isChosen ? "oklch(22% 0.10 260)" : "oklch(97% 0.005 80)",
                            color: isChosen ? "oklch(90% 0.02 80)" : "oklch(42% 0.05 260)",
                            border: `1px solid ${isChosen ? "oklch(22% 0.10 260)" : "oklch(85% 0.008 80)"}`,
                            cursor: "pointer",
                            transition: "all 0.12s ease",
                            display: "flex",
                            gap: "0.875rem",
                            alignItems: "flex-start",
                          }}
                        >
                          <span style={{ fontWeight: 800, fontSize: "0.72rem", letterSpacing: "0.1em", flexShrink: 0, paddingTop: "0.1rem", color: isChosen ? "oklch(65% 0.15 45)" : "oklch(60% 0.04 260)" }}>
                            {opt.key.toUpperCase()}
                          </span>
                          {text}
                        </button>
                      );
                    })}
                  </div>

                  {chosenOption && (
                    <div style={{ paddingLeft: "3.75rem" }}>
                      <div style={{ background: "oklch(22% 0.10 260)", padding: "1.25rem 1.5rem" }}>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.375rem" }}>
                          {lang === "en" ? chosenOption.en_char : lang === "id" ? chosenOption.id_char : chosenOption.nl_char}
                        </p>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.7, color: "oklch(75% 0.03 80)", margin: 0 }}>
                          {lang === "en" ? chosenOption.en_reveal : lang === "id" ? chosenOption.id_reveal : chosenOption.nl_reveal}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PATTERN ── */}
      {allChosen && (
        <section style={{ paddingBlock: "clamp(3rem, 5vw, 4rem)", background: "oklch(95% 0.008 80)" }}>
          <div className="container-wide" style={{ maxWidth: "640px" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.75rem" }}>
              {t("Your Pattern", "Pola Anda", "Jouw patroon")}
            </p>
            <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", color: "oklch(22% 0.10 260)", marginBottom: "1rem" }}>
              {t("You have now seen five dimensions of servant leadership.", "Anda sekarang telah melihat lima dimensi kepemimpinan hamba.", "Je hebt nu vijf dimensies van dienend leiderschap gezien.")}
            </h2>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(42% 0.05 260)", marginBottom: "1rem" }}>
              {t(
                "Servant leadership is not a personality type — it is a set of practised choices. The scenarios you just completed reveal where you move naturally toward serving others, and where self-protection, efficiency, or comfort pull you in a different direction.",
                "Kepemimpinan hamba bukan tipe kepribadian — itu adalah serangkaian pilihan yang dipraktikkan. Skenario yang baru saja Anda selesaikan mengungkapkan di mana Anda secara alami bergerak menuju melayani orang lain, dan di mana perlindungan diri, efisiensi, atau kenyamanan menarik Anda ke arah yang berbeda.",
                "Dienend leiderschap is geen persoonlijkheidstype — het is een reeks beoefende keuzes. De scenario's die je zojuist hebt voltooid onthullen waar je van nature naar het dienen van anderen beweegt, en waar zelfbescherming, efficiëntie of comfort je een andere kant op trekken.",
              )}
            </p>
            <p style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "1.15rem", fontStyle: "italic", color: "oklch(30% 0.10 260)", lineHeight: 1.65 }}>
              {t(
                "\"The real test of servant leadership is not what you do on your best day. It's what you do when it costs you.\"",
                "\"Ujian nyata kepemimpinan hamba bukan apa yang Anda lakukan di hari terbaik Anda. Ini adalah apa yang Anda lakukan ketika ada harganya.\"",
                "\"De echte test van dienend leiderschap is niet wat je doet op je beste dag. Het is wat je doet als het je iets kost.\"",
              )}
            </p>
          </div>
        </section>
      )}

      {/* ── BIBLICAL FOUNDATION ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(22% 0.10 260)" }}>
        <div className="container-wide">
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.75rem" }}>
            {t("Biblical Foundation", "Landasan Alkitab", "Bijbelse basis")}
          </p>
          <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: "oklch(97% 0.005 80)", marginBottom: "1.25rem", maxWidth: "36ch" }}>
            {t("The leader who came to serve", "Pemimpin yang datang untuk melayani", "De leider die kwam om te dienen")}
          </h2>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(72% 0.04 260)", maxWidth: "62ch", marginBottom: "1rem" }}>
            {t(
              "Robert Greenleaf coined 'servant leadership' in 1970. But the model predates him by two thousand years. Mark 10:45 is the most concentrated statement on leadership in the New Testament — and it comes in the middle of an argument among the disciples about who is the greatest.",
              "Robert Greenleaf menciptakan 'servant leadership' pada tahun 1970. Tetapi modelnya mendahuluinya dua ribu tahun. Markus 10:45 adalah pernyataan paling ringkas tentang kepemimpinan dalam Perjanjian Baru — dan itu datang di tengah pertengkaran di antara para murid tentang siapa yang terbesar.",
              "Robert Greenleaf bedacht 'dienend leiderschap' in 1970. Maar het model gaat hem tweeduizend jaar vooraf. Markus 10:45 is de meest geconcentreerde uitspraak over leiderschap in het Nieuwe Testament — en het komt midden in een ruzie onder de discipelen over wie de grootste is.",
            )}
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(72% 0.04 260)", maxWidth: "62ch", marginBottom: "2.5rem" }}>
            {t(
              "Jesus doesn't give them a framework or a list of principles. He points to himself — not as a model to imitate from a safe distance, but as the living demonstration of what leadership that gives itself away actually looks like. Philippians 2 captures the same movement: 'consider others more significant than yourselves.' In a cross-cultural team, this is not softness. It is the most disruptive leadership posture available.",
              "Yesus tidak memberi mereka kerangka atau daftar prinsip. Dia menunjuk pada diri-Nya sendiri — bukan sebagai model yang ditiru dari jarak aman, tetapi sebagai demonstrasi hidup tentang seperti apa kepemimpinan yang memberikan dirinya sendiri. Filipi 2 menangkap gerakan yang sama: 'anggap yang lain lebih utama dari pada dirimu sendiri.' Dalam tim lintas budaya, ini bukan kelemahan. Ini adalah postur kepemimpinan yang paling mengganggu yang tersedia.",
              "Jezus geeft hen geen raamwerk of een lijst van principes. Hij wijst naar zichzelf — niet als een model om van veilige afstand na te bootsen, maar als de levende demonstratie van hoe leiderschap dat zichzelf weggeeft er werkelijk uitziet. Filippenzen 2 beschrijft dezelfde beweging: 'acht de ander uitnemender dan uzelf.' In een intercultureel team is dit geen zwakheid. Het is de meest disruptieve leiderschapshouding die beschikbaar is.",
            )}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", background: "oklch(35% 0.08 260)" }}>
            {(["mark-10-45", "phil-2-3"] as const).map(key => {
              const v = VERSES[key];
              const ref = lang === "en" ? v.en_ref : lang === "id" ? v.id_ref : v.nl_ref;
              const text = lang === "en" ? v.en : lang === "id" ? v.id : v.nl;
              return (
                <div key={key} style={{ background: "oklch(28% 0.11 260)", padding: "2rem" }}>
                  <button onClick={() => setActiveVerse(key)} style={{ background: "none", border: "none", cursor: "pointer", color: "oklch(65% 0.15 45)", fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "underline dotted", padding: 0, marginBottom: "0.875rem", display: "block" }}>
                    {ref} ({translation})
                  </button>
                  <p style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "1.05rem", fontStyle: "italic", color: "oklch(85% 0.03 80)", lineHeight: 1.65, margin: 0 }}>
                    "{text}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>
              {t("More in the Library", "Lebih Banyak di Perpustakaan", "Meer in de Bibliotheek")}
            </p>
            <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", color: "oklch(22% 0.10 260)", marginBottom: "1rem" }}>
              {t("Part of the full content library.", "Bagian dari perpustakaan konten lengkap.", "Onderdeel van de volledige contentbibliotheek.")}
            </h2>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {!userPathway ? (
                <Link href="/signup" className="btn-primary">{t("Join the Community →", "Bergabung →", "Word lid →")}</Link>
              ) : saved ? (
                <Link href="/dashboard" className="btn-primary">{t("Go to Dashboard →", "Ke Dashboard →", "Naar Dashboard →")}</Link>
              ) : (
                <button onClick={handleSave} disabled={isPending} className="btn-primary" style={{ border: "none", cursor: isPending ? "wait" : "pointer" }}>
                  {isPending ? t("Saving…", "Menyimpan…", "Opslaan…") : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
                </button>
              )}
              <Link href="/resources" className="btn-outline-navy">{t("Browse the Library", "Jelajahi Perpustakaan", "Verken de Bibliotheek")}</Link>
            </div>
          </div>
          <div style={{ background: "oklch(22% 0.10 260)", padding: "2.5rem" }}>
            <p style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "1.25rem", fontStyle: "italic", color: "oklch(80% 0.04 260)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
              {t(
                "\"Servant leadership is not about being nice. It is about being willing to put your power and position in service of another person's flourishing.\"",
                "\"Kepemimpinan hamba bukan tentang bersikap baik. Ini tentang kesediaan untuk menempatkan kekuasaan dan posisi Anda dalam pelayanan kemakmuran orang lain.\"",
                "\"Dienend leiderschap gaat niet over aardig zijn. Het gaat over bereid zijn je macht en positie in dienst te stellen van andermans bloei.\"",
              )}
            </p>
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", color: "oklch(65% 0.15 45)", textTransform: "uppercase" }}>Crispy Development</span>
          </div>
        </div>
      </section>

      {/* ── VERSE POPUP ── */}
      {activeVerse && (
        <div onClick={() => setActiveVerse(null)} style={{ position: "fixed", inset: 0, background: "oklch(10% 0.05 260 / 0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1.5rem" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "oklch(97% 0.005 80)", borderRadius: "12px", padding: "2.5rem clamp(1.5rem, 4vw, 2.5rem)", maxWidth: "520px", width: "100%" }}>
            <p style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "1.25rem", fontStyle: "italic", color: "oklch(22% 0.10 260)", lineHeight: 1.65, marginBottom: "1rem" }}>
              "{lang === "en" ? VERSES[activeVerse as keyof typeof VERSES].en : lang === "id" ? VERSES[activeVerse as keyof typeof VERSES].id : VERSES[activeVerse as keyof typeof VERSES].nl}"
            </p>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, color: "oklch(65% 0.15 45)", letterSpacing: "0.08em", marginBottom: "1.5rem" }}>
              — {lang === "en" ? VERSES[activeVerse as keyof typeof VERSES].en_ref : lang === "id" ? VERSES[activeVerse as keyof typeof VERSES].id_ref : VERSES[activeVerse as keyof typeof VERSES].nl_ref} ({translation})
            </p>
            <button onClick={() => setActiveVerse(null)} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, background: "oklch(22% 0.10 260)", color: "oklch(97% 0.005 80)", border: "none", padding: "0.625rem 1.5rem", cursor: "pointer", borderRadius: "4px" }}>
              {t("Close", "Tutup", "Sluiten")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
