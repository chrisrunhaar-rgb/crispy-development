"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id" | "nl";
const t = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

// ── BRAND TOKENS ─────────────────────────────────────────────────────────────
const navy     = "oklch(22% 0.10 260)";
const orange   = "oklch(65% 0.15 45)";
const offWhite = "oklch(97% 0.005 80)";
const bodyText = "oklch(38% 0.05 260)";

// ── VERSE DATA ────────────────────────────────────────────────────────────────
const VERSES = {
  "2cor-4-8-9": {
    ref: "2 Corinthians 4:8–9",
    ref_id: "2 Korintus 4:8–9",
    ref_nl: "2 Korintiërs 4:8–9",
    en: "We are hard pressed on every side, but not crushed; perplexed, but not in despair; persecuted, but not abandoned; struck down, but not destroyed.",
    id: "Dalam segala hal kami ditindas, namun tidak terjepit; kami habis akal, namun tidak putus asa; kami dianiaya, namun tidak ditinggalkan sendirian, kami dihempaskan, namun tidak binasa.",
    nl: "Van alle kanten worden we belaagd, maar raken we niet in het nauw; we worden door twijfel gekweld, maar wanhopen niet; we worden vervolgd, maar niet verlaten; we worden geveld, maar gaan niet ten onder.",
  },
  "1kings-19-5": {
    ref: "1 Kings 19:5",
    ref_id: "1 Raja-raja 19:5",
    ref_nl: "1 Koningen 19:5",
    en: "Then he lay down under the bush and fell asleep. All at once an angel touched him and said, 'Get up and eat.'",
    id: "Kemudian ia berbaring dan tertidur di bawah pohon aras itu. Tetapi tiba-tiba seorang malaikat menyentuh dia serta berkata kepadanya: 'Bangunlah, makanlah!'",
    nl: "Hij viel in slaap onder de bremstruik, maar plotseling raakte een engel hem aan en zei: 'Sta op en eet.'",
  },
  "luke-10-1": {
    ref: "Luke 10:1",
    ref_id: "Lukas 10:1",
    ref_nl: "Lucas 10:1",
    en: "After this the Lord appointed seventy-two others and sent them two by two ahead of him to every town and place where he was about to go.",
    id: "Kemudian dari pada itu Tuhan menunjuk tujuh puluh dua murid yang lain, lalu mengutus mereka berdua-dua mendahului-Nya ke setiap kota dan tempat yang hendak dikunjungi-Nya.",
    nl: "Daarna wees de Heer nog tweeënzeventig anderen aan en zond hen twee aan twee voor zich uit naar alle steden en plaatsen waar hij zelf zou komen.",
  },
  "phil-4-13": {
    ref: "Philippians 4:13",
    ref_id: "Filipi 4:13",
    ref_nl: "Filippenzen 4:13",
    en: "I can do all this through him who gives me strength.",
    id: "Segala perkara dapat kutanggung di dalam Dia yang memberi kekuatan kepadaku.",
    nl: "Ik kan alles aan door hem die mij kracht geeft.",
  },
};

// ── BURNOUT TYPES ─────────────────────────────────────────────────────────────
type BurnoutType = "overload" | "underchallenge" | "neglect";

const BURNOUT_TYPES: {
  key: BurnoutType;
  icon: string;
  color: string;
  en_title: string; id_title: string; nl_title: string;
  en_subtitle: string; id_subtitle: string; nl_subtitle: string;
  en_desc: string; id_desc: string; nl_desc: string;
  en_signs: string[]; id_signs: string[]; nl_signs: string[];
  en_culture: string; id_culture: string; nl_culture: string;
  en_first: string; id_first: string; nl_first: string;
}[] = [
  {
    key: "overload",
    icon: "🔥",
    color: "oklch(55% 0.18 25)",
    en_title: "Overload Burnout",
    id_title: "Kelelahan Akibat Beban Berlebih",
    nl_title: "Overbelasting",
    en_subtitle: "Running on empty at full speed",
    id_subtitle: "Berlari dengan tangki kosong",
    nl_subtitle: "Leeggereden op volle snelheid",
    en_desc: "You're working at an unsustainable pace — keeping all the balls in the air while your health, rest, and relationships quietly fall away. The work never stops. You tell yourself you'll slow down after this season. But this season never ends.",
    id_desc: "Anda bekerja dengan kecepatan yang tidak berkelanjutan — menjaga semua hal tetap berjalan sementara kesehatan, istirahat, dan hubungan Anda perlahan-lahan terkikis. Pekerjaan tidak pernah berhenti. Anda berkata akan melambat setelah musim ini selesai. Tapi musim itu tidak pernah berakhir.",
    nl_desc: "Je werkt in een tempo dat je niet kunt volhouden — je houdt alles in de lucht terwijl je gezondheid, rust en relaties stilletjes wegvallen. Het werk stopt nooit. Je zegt dat je langzamer zult gaan na dit seizoen. Maar dat seizoen eindigt nooit.",
    en_signs: ["Missing deadlines but adding more projects", "Sleep is the first thing you sacrifice", "You feel guilty resting", "Physical symptoms: headaches, illness, exhaustion"],
    id_signs: ["Melewatkan tenggat waktu tapi terus menambah proyek baru", "Tidur adalah hal pertama yang Anda korbankan", "Anda merasa bersalah saat beristirahat", "Gejala fisik: sakit kepala, penyakit, kelelahan"],
    nl_signs: ["Deadlines missen maar toch nieuwe projecten aannemen", "Slaap is het eerste dat je opoffert", "Je voelt je schuldig als je rust", "Lichamelijke klachten: hoofdpijn, ziekte, uitputting"],
    en_culture: "In high-achievement cultures, overload is often worn as a badge of honour. The leader who never stops is admired, not helped. In collectivist cultures, saying no feels like abandoning the community — so the pace becomes truly unsustainable.",
    id_culture: "Dalam budaya yang mengutamakan pencapaian tinggi, beban berlebih sering dianggap sebagai kehormatan. Pemimpin yang tidak pernah berhenti dikagumi, bukan dibantu. Dalam budaya kolektif, mengatakan tidak terasa seperti meninggalkan komunitas — sehingga kecepatan kerja menjadi benar-benar tidak berkelanjutan.",
    nl_culture: "In prestatiegerichte culturen wordt overbelasting vaak gedragen als een eersbewijs. De leider die nooit stopt wordt bewonderd, niet geholpen. In collectivistische culturen voelt nee zeggen als het verlaten van de gemeenschap — waardoor het tempo werkelijk onhoudbaar wordt.",
    en_first: "Block one non-negotiable rest hour this week — and protect it like an appointment with God. Because it is.",
    id_first: "Tetapkan satu jam istirahat yang tidak bisa diganggu gugat minggu ini — dan jaga seperti janji temu dengan Tuhan. Karena memang begitulah adanya.",
    nl_first: "Reserveer deze week één ononderhandelbaar rustuur — en bescherm het als een afspraak met God. Want dat is het.",
  },
  {
    key: "underchallenge",
    icon: "🌫️",
    color: "oklch(52% 0.12 225)",
    en_title: "Underchallenge Burnout",
    id_title: "Kelelahan Akibat Kurang Tantangan",
    nl_title: "Onderstimulering",
    en_subtitle: "Not too much — too little meaning",
    id_subtitle: "Bukan terlalu banyak — terlalu sedikit makna",
    nl_subtitle: "Niet te veel — te weinig betekenis",
    en_desc: "Your work has become monotonous, passionless, or energy-draining. You no longer feel like what you do matters. The routine continues, but the spark is gone. This kind of burnout is harder to name — there's no obvious crisis, just a slow fading.",
    id_desc: "Pekerjaan Anda telah menjadi monoton, tanpa semangat, atau menguras energi. Anda tidak lagi merasa bahwa apa yang Anda lakukan berarti. Rutinitas terus berlanjut, tapi percikan api sudah padam. Jenis kelelahan ini lebih sulit untuk dikenali — tidak ada krisis yang jelas, hanya kepudaran yang lambat.",
    nl_desc: "Je werk is eentonig, passieloos of energieslurpend geworden. Je hebt het gevoel dat wat je doet er niet meer toe doet. De routine gaat door, maar de vonk is verdwenen. Dit soort burnout is moeilijker te benoemen — er is geen duidelijke crisis, alleen een langzame vervaging.",
    en_signs: ["Going through the motions without engagement", "Feeling invisible or replaceable", "Dreading Monday mornings", "Disconnected from the original 'why' of your work"],
    id_signs: ["Menjalani rutinitas tanpa keterlibatan", "Merasa tidak terlihat atau mudah tergantikan", "Merasa takut hari Senin", "Terputus dari alasan awal mengapa Anda memilih pekerjaan ini"],
    nl_signs: ["Dingen doen zonder betrokkenheid", "Je onzichtbaar of vervangbaar voelen", "Opzien tegen maandagochtenden", "Losgeraakt van de oorspronkelijke 'waarom' van je werk"],
    en_culture: "In cultures where role and identity are tightly fused, feeling underchallenged carries shame — you're not allowed to be bored when the mission is urgent. But monotony is a real burnout pathway, not a character flaw.",
    id_culture: "Dalam budaya di mana peran dan identitas sangat terkait erat, merasa kurang tertantang membawa rasa malu — Anda tidak boleh merasa bosan ketika misi begitu mendesak. Tetapi kejenuhan adalah jalan nyata menuju kelelahan, bukan kelemahan karakter.",
    nl_culture: "In culturen waar rol en identiteit nauw verweven zijn, brengt onderuitdaging schaamte met zich mee — je mag niet verveeld zijn als de missie urgent is. Maar monotonie is een reëel burnout-pad, geen karakterfout.",
    en_first: "Name the last time you felt genuinely alive in your work. What was different? That answer is a clue toward what needs to change.",
    id_first: "Ingat kapan terakhir kali Anda benar-benar merasa hidup dalam pekerjaan Anda. Apa yang berbeda? Jawaban itu adalah petunjuk tentang apa yang perlu diubah.",
    nl_first: "Denk aan de laatste keer dat je je echt levend voelde in je werk. Wat was er anders? Dat antwoord is een aanwijzing naar wat er moet veranderen.",
  },
  {
    key: "neglect",
    icon: "🌑",
    color: "oklch(40% 0.08 260)",
    en_title: "Neglect Burnout",
    id_title: "Kelelahan Akibat Diabaikan",
    nl_title: "Verwaarlozing",
    en_subtitle: "Working unseen, unheard, unrecognised",
    id_subtitle: "Bekerja tanpa dilihat, didengar, atau diakui",
    nl_subtitle: "Werken zonder gezien, gehoord of erkend te worden",
    en_desc: "There's no feedback, no direction, no one checking in. You pour yourself out for the work, but no one notices — or if they do, it's to point out what's missing. Over time, the silence becomes a weight. You begin to question whether what you do matters at all.",
    id_desc: "Tidak ada umpan balik, tidak ada arahan, tidak ada yang peduli. Anda mencurahkan diri untuk pekerjaan, tetapi tidak ada yang memperhatikan — atau jika mereka memperhatikan, itu hanya untuk menunjukkan apa yang kurang. Seiring waktu, keheningan menjadi beban. Anda mulai mempertanyakan apakah apa yang Anda lakukan benar-benar berarti.",
    nl_desc: "Er is geen feedback, geen richting, niemand die incheckt. Je geeft alles voor het werk, maar niemand merkt het op — of als ze dat doen, is het om te wijzen op wat ontbreekt. Na verloop van tijd wordt de stilte een last. Je begint te twijfelen of wat je doet er überhaupt toe doet.",
    en_signs: ["Receiving feedback only when something goes wrong", "Feeling like your contributions go unnoticed", "Drifting without clear direction or accountability", "Withdrawing from the team or community"],
    id_signs: ["Hanya menerima umpan balik ketika ada yang salah", "Merasa kontribusi Anda tidak diperhatikan", "Terombang-ambing tanpa arah atau akuntabilitas yang jelas", "Menarik diri dari tim atau komunitas"],
    nl_signs: ["Alleen feedback ontvangen als er iets misgaat", "Het gevoel dat je bijdragen onopgemerkt blijven", "Ronddwalen zonder duidelijke richting of verantwoording", "Je terugtrekken uit het team of de gemeenschap"],
    en_culture: "In high-context cultures, direct appreciation is rarely spoken — it's assumed to be felt. But cross-cultural workers often don't have the cultural radar to pick up on unspoken affirmation, and the silence reads as indifference.",
    id_culture: "Dalam budaya konteks tinggi, penghargaan langsung jarang diucapkan — diasumsikan sudah bisa dirasakan. Namun para pekerja lintas budaya sering tidak memiliki kepekaan budaya untuk menangkap penegasan yang tidak terucap, dan keheningan itu terasa seperti ketidakpedulian.",
    nl_culture: "In hoge-context culturen wordt directe waardering zelden uitgesproken — men neemt aan dat het gevoeld wordt. Maar interculturele werkers hebben vaak niet de culturele antenne om onuitgesproken bevestiging op te pikken, en de stilte leest als onverschilligheid.",
    en_first: "Ask one person you trust this week: 'How do you think I'm doing?' The answer — and the act of asking — will break the silence.",
    id_first: "Minggu ini, tanyakan kepada satu orang yang Anda percaya: 'Menurut kamu, bagaimana saya melakukannya?' Jawaban itu — dan tindakan bertanya itu sendiri — akan memecah keheningan.",
    nl_first: "Vraag deze week aan één persoon die je vertrouwt: 'Hoe denk je dat het met me gaat?' Het antwoord — en de daad van vragen zelf — zal de stilte doorbreken.",
  },
];

// ── THREE Ps DATA ─────────────────────────────────────────────────────────────
const THREE_PS = [
  {
    key: "people",
    icon: "👥",
    en_title: "People",
    id_title: "Orang",
    nl_title: "Mensen",
    en_tagline: "You were not sent alone",
    id_tagline: "Anda tidak diutus sendirian",
    nl_tagline: "Je bent niet alleen gestuurd",
    en_desc: "Isolation is not a spiritual discipline — it's a warning sign. Research consistently shows that community of support is the single most protective factor against burnout. Jesus sent his disciples in pairs for good reason.",
    id_desc: "Isolasi bukanlah disiplin rohani — itu adalah tanda peringatan. Penelitian secara konsisten menunjukkan bahwa komunitas dukungan adalah faktor perlindungan tunggal yang paling efektif melawan kelelahan. Yesus mengutus murid-murid-Nya berdua-dua bukan tanpa alasan.",
    nl_desc: "Isolatie is geen geestelijke discipline — het is een waarschuwingsteken. Onderzoek toont consequent aan dat een gemeenschap van steun de meest beschermende factor is tegen burnout. Jezus stuurde zijn discipelen twee aan twee, niet voor niets.",
    en_q: "Who is one person who knows the real weight of your work right now — not just the highlights?",
    id_q: "Siapa satu orang yang mengetahui beban nyata pekerjaan Anda saat ini — bukan hanya sorotan positifnya?",
    nl_q: "Wie is één persoon die het echte gewicht van je werk nu kent — niet alleen de hoogtepunten?",
    en_action: "Identify your 'sent-in-pairs' person and schedule one honest conversation this week.",
    id_action: "Identifikasi 'pasangan yang diutus bersama' Anda dan jadwalkan satu percakapan jujur minggu ini.",
    nl_action: "Identificeer je 'samen-uitgezonden' persoon en plan deze week één eerlijk gesprek.",
  },
  {
    key: "practices",
    icon: "🌱",
    en_title: "Practices",
    id_title: "Kebiasaan",
    nl_title: "Gewoonten",
    en_tagline: "Your body, mind, and spirit are one system",
    id_tagline: "Tubuh, pikiran, dan roh Anda adalah satu sistem",
    nl_tagline: "Je lichaam, geest en ziel zijn één systeem",
    en_desc: "Sustainable leaders are not superhuman. They are practised. Holistic habits — physical health, continuous learning, prayer and spiritual depth — aren't optional extras. They are the infrastructure of endurance.",
    id_desc: "Pemimpin yang berkelanjutan bukanlah manusia super. Mereka adalah orang yang terlatih. Kebiasaan holistik — kesehatan fisik, pembelajaran berkelanjutan, doa dan kedalaman rohani — bukan pelengkap opsional. Mereka adalah infrastruktur ketahanan.",
    nl_desc: "Duurzame leiders zijn niet bovenmenselijk. Ze zijn geoefend. Holistische gewoonten — lichamelijke gezondheid, continu leren, gebed en geestelijke diepgang — zijn geen optionele extra's. Ze zijn de infrastructuur van uithoudingsvermogen.",
    en_q: "Which of the three — body, mind, or spirit — is the most depleted for you right now?",
    id_q: "Di antara ketiganya — tubuh, pikiran, atau roh — mana yang paling terkuras bagi Anda saat ini?",
    nl_q: "Welke van de drie — lichaam, geest of ziel — is voor jou nu het meest uitgeput?",
    en_action: "Choose one small, specific practice for the most depleted area and protect it for 7 days.",
    id_action: "Pilih satu kebiasaan kecil yang spesifik untuk area yang paling terkuras dan jaga selama 7 hari.",
    nl_action: "Kies één kleine, specifieke gewoonte voor het meest uitgeputte gebied en bescherm het 7 dagen lang.",
  },
  {
    key: "purpose",
    icon: "🧭",
    en_title: "Purpose",
    id_title: "Tujuan",
    nl_title: "Roeping",
    en_tagline: "Meaning is not a luxury — it's fuel",
    id_tagline: "Makna bukan kemewahan — itu adalah bahan bakar",
    nl_tagline: "Betekenis is geen luxe — het is brandstof",
    en_desc: "When goals that once felt vital begin to seem pointless, burnout is close. Purpose isn't just motivational fuel — it's a theological anchor. You don't serve a cause. You serve a Person. That changes everything about sustainability.",
    id_desc: "Ketika tujuan yang dulu terasa vital mulai tampak sia-sia, kelelahan sudah dekat. Tujuan bukan hanya bahan bakar motivasi — itu adalah jangkar teologis. Anda tidak melayani sebuah tujuan. Anda melayani seorang Pribadi. Itu mengubah segalanya tentang keberlanjutan.",
    nl_desc: "Wanneer doelen die ooit vitaal aanvoelden zinloos beginnen te lijken, is burnout nabij. Roeping is niet alleen motivatiebrandstof — het is een theologisch anker. Je dient geen zaak. Je dient een Persoon. Dat verandert alles aan duurzaamheid.",
    en_q: "Finish this sentence honestly: 'The reason I'm still in this work, even on hard days, is...'",
    id_q: "Lengkapi kalimat ini dengan jujur: 'Alasan saya masih dalam pekerjaan ini, bahkan di hari-hari sulit, adalah...'",
    nl_q: "Maak deze zin eerlijk af: 'De reden waarom ik nog steeds dit werk doe, ook op moeilijke dagen, is...'",
    en_action: "Write down your answer. Keep it somewhere you'll see it when the work gets hard.",
    id_action: "Tuliskan jawabanmu. Simpan di tempat yang bisa kamu lihat saat pekerjaan terasa berat.",
    nl_action: "Schrijf je antwoord op. Bewaar het ergens waar je het kunt zien als het werk zwaar wordt.",
  },
];

// ── PROPS ─────────────────────────────────────────────────────────────────────
type Props = { userPathway: string | null; isSaved: boolean };

export default function UnderstandingBurnoutClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<BurnoutType | null>(null);
  const [openP, setOpenP] = useState<string | null>(null);
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      const result = await saveResourceToDashboard("understanding-burnout");
      if (!result.error) setSaved(true);
    });
  }

  const selectedBurnout = BURNOUT_TYPES.find(b => b.key === selectedType);

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", color: bodyText, background: offWhite }}>
      <LangToggle />

      {/* LANGUAGE TOGGLE */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: navy, padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "oklch(75% 0.04 260)", textTransform: "uppercase" }}>
          {t("Resilience & Mental Health", "Ketahanan & Kesehatan Mental", "Weerbaarheid & Mentale Gezondheid", lang)}
        </span>
      </div>

      {/* HERO */}
      <section style={{ background: navy, padding: "80px 24px 64px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 60% 0%, oklch(32% 0.12 260 / 0.5) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: orange, marginBottom: 20 }}>
            {t("Personal Development · Guide", "Pengembangan Pribadi · Panduan", "Persoonlijke Ontwikkeling · Gids", lang)}
          </p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, color: offWhite, lineHeight: 1.08, margin: "0 0 24px" }}>
            {t("Understanding Burnout", "Memahami Kelelahan", "Burnout Begrijpen", lang)}
          </h1>
          <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(16px, 2vw, 19px)", color: "oklch(82% 0.03 80)", lineHeight: 1.65, maxWidth: 580, margin: "0 0 32px" }}>
            {t(
              "Not all burnout looks the same. Before you can recover, you need to know which kind of empty you are.",
              "Tidak semua kelelahan terlihat sama. Sebelum Anda dapat pulih, Anda perlu tahu jenis kekosongan yang mana yang sedang Anda alami.",
              "Niet alle burnout ziet er hetzelfde uit. Voordat je kunt herstellen, moet je weten wat voor soort leeg je bent.",
              lang
            )}
          </p>
          {/* Opening verse */}
          <div style={{ background: "oklch(30% 0.10 260 / 0.6)", borderRadius: 12, padding: "24px 28px", maxWidth: 560, margin: "0 auto" }}>
            <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 18, color: "oklch(88% 0.04 80)", lineHeight: 1.7, fontStyle: "italic", marginBottom: 10 }}>
              "{lang === "en" ? VERSES["2cor-4-8-9"].en : lang === "id" ? VERSES["2cor-4-8-9"].id : VERSES["2cor-4-8-9"].nl}"
            </p>
            <p style={{ fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.10em" }}>
              — {lang === "en" ? VERSES["2cor-4-8-9"].ref : lang === "id" ? VERSES["2cor-4-8-9"].ref_id : VERSES["2cor-4-8-9"].ref_nl}
            </p>
          </div>
        </div>
      </section>

      {/* DIAGNOSTIC — WHICH KIND? */}
      <section style={{ background: "oklch(96% 0.004 80)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: orange, marginBottom: 12, textAlign: "center" }}>
            {t("Step 1 — Identify", "Langkah 1 — Identifikasi", "Stap 1 — Identificeer", lang)}
          </p>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 800, color: navy, textAlign: "center", marginBottom: 12 }}>
            {t("Which kind of burnout is this?", "Jenis kelelahan apa ini?", "Welk soort burnout is dit?", lang)}
          </h2>
          <p style={{ textAlign: "center", fontSize: 15, color: bodyText, lineHeight: 1.65, maxWidth: 560, margin: "0 auto 48px" }}>
            {t("Select the one that resonates most with where you are right now. Honest self-diagnosis is the first act of recovery.", "Pilih yang paling sesuai dengan kondisi Anda saat ini. Diagnosis diri yang jujur adalah langkah pertama pemulihan.", "Selecteer degene die het meest aansluit bij waar je nu bent. Eerlijke zelfdiagnose is de eerste stap naar herstel.", lang)}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 40 }}>
            {BURNOUT_TYPES.map(bt => {
              const isSelected = selectedType === bt.key;
              return (
                <button
                  key={bt.key}
                  onClick={() => setSelectedType(isSelected ? null : bt.key)}
                  style={{
                    textAlign: "left", padding: "28px 24px", borderRadius: 14,
                    border: `2px solid ${isSelected ? bt.color : "oklch(88% 0.008 260)"}`,
                    background: isSelected ? `${bt.color}15` : "white",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{bt.icon}</div>
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 15, color: isSelected ? bt.color : navy, marginBottom: 6 }}>
                    {t(bt.en_title, bt.id_title, bt.nl_title, lang)}
                  </div>
                  <div style={{ fontSize: 13, color: isSelected ? bt.color : bodyText, fontStyle: "italic" }}>
                    {t(bt.en_subtitle, bt.id_subtitle, bt.nl_subtitle, lang)}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Expanded burnout detail */}
          {selectedBurnout && (
            <div style={{ background: "white", borderRadius: 16, padding: "40px 36px", border: `2px solid ${selectedBurnout.color}30`, animation: "fadeIn 0.3s ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <span style={{ fontSize: 40 }}>{selectedBurnout.icon}</span>
                <div>
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 22, color: selectedBurnout.color }}>
                    {t(selectedBurnout.en_title, selectedBurnout.id_title, selectedBurnout.nl_title, lang)}
                  </div>
                  <div style={{ fontSize: 14, color: bodyText, fontStyle: "italic" }}>
                    {t(selectedBurnout.en_subtitle, selectedBurnout.id_subtitle, selectedBurnout.nl_subtitle, lang)}
                  </div>
                </div>
              </div>

              <p style={{ fontSize: 16, lineHeight: 1.75, color: bodyText, marginBottom: 32 }}>
                {t(selectedBurnout.en_desc, selectedBurnout.id_desc, selectedBurnout.nl_desc, lang)}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: 12 }}>
                    {t("Warning Signs", "Tanda Peringatan", "Waarschuwingssignalen", lang)}
                  </p>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {(lang === "en" ? selectedBurnout.en_signs : lang === "id" ? selectedBurnout.id_signs : selectedBurnout.nl_signs).map((sign, i) => (
                      <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10, fontSize: 14, lineHeight: 1.5, color: bodyText }}>
                        <span style={{ color: selectedBurnout.color, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>→</span>
                        {sign}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: 12 }}>
                    {t("Cross-Cultural Note", "Catatan Lintas Budaya", "Interculturele Noot", lang)}
                  </p>
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: bodyText, fontStyle: "italic" }}>
                    {t(selectedBurnout.en_culture, selectedBurnout.id_culture, selectedBurnout.nl_culture, lang)}
                  </p>
                </div>
              </div>

              <div style={{ background: `${selectedBurnout.color}12`, borderRadius: 10, padding: "20px 24px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: selectedBurnout.color, marginBottom: 6 }}>
                    {t("Your First Step", "Langkah Pertama Anda", "Jouw eerste stap", lang)}
                  </p>
                  <p style={{ fontSize: 15, lineHeight: 1.65, color: bodyText, fontStyle: "italic", margin: 0 }}>
                    {t(selectedBurnout.en_first, selectedBurnout.id_first, selectedBurnout.nl_first, lang)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* THE THREE Ps */}
      <section style={{ background: offWhite, padding: "72px 24px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: orange, marginBottom: 12, textAlign: "center" }}>
            {t("Step 2 — Rebuild", "Langkah 2 — Bangun Kembali", "Stap 2 — Herbouwen", lang)}
          </p>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 800, color: navy, textAlign: "center", marginBottom: 12 }}>
            {t("The Three Ps of Resilience", "Tiga P Ketahanan", "De Drie P's van Weerbaarheid", lang)}
          </h2>
          <p style={{ textAlign: "center", fontSize: 15, color: bodyText, lineHeight: 1.65, maxWidth: 560, margin: "0 auto 48px" }}>
            {t("Resilience isn't just mental toughness. It's built through three interconnected pillars — People, Practices, and Purpose. Which one needs the most attention right now?",
              "Ketahanan bukan hanya ketangguhan mental. Ini dibangun melalui tiga pilar yang saling terhubung — Orang, Kebiasaan, dan Tujuan. Mana yang paling membutuhkan perhatian saat ini?",
              "Weerbaarheid is niet alleen mentale kracht. Het wordt opgebouwd door drie onderling verbonden pijlers — Mensen, Gewoonten en Roeping. Welke heeft nu de meeste aandacht nodig?", lang)}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {THREE_PS.map(p => {
              const isOpen = openP === p.key;
              return (
                <div key={p.key} style={{ background: "white", borderRadius: 14, overflow: "hidden", border: `1.5px solid ${isOpen ? orange : "oklch(88% 0.008 260)"}`, transition: "border-color 0.2s" }}>
                  <button
                    onClick={() => setOpenP(isOpen ? null : p.key)}
                    style={{ width: "100%", textAlign: "left", padding: "24px 28px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 16 }}
                  >
                    <span style={{ fontSize: 28, flexShrink: 0 }}>{p.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 18, color: isOpen ? orange : navy }}>
                        {t(p.en_title, p.id_title, p.nl_title, lang)}
                      </div>
                      <div style={{ fontSize: 13, color: bodyText, fontStyle: "italic", marginTop: 2 }}>
                        {t(p.en_tagline, p.id_tagline, p.nl_tagline, lang)}
                      </div>
                    </div>
                    <span style={{ fontSize: 20, color: orange, fontWeight: 300, transform: isOpen ? "rotate(45deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>+</span>
                  </button>

                  {isOpen && (
                    <div style={{ padding: "0 28px 32px" }}>
                      <p style={{ fontSize: 15, lineHeight: 1.75, color: bodyText, marginBottom: 28 }}>
                        {t(p.en_desc, p.id_desc, p.nl_desc, lang)}
                      </p>

                      {/* Reflection prompt */}
                      <div style={{ background: "oklch(97% 0.005 80)", borderRadius: 10, padding: "20px 24px", marginBottom: 20 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: orange, marginBottom: 8 }}>
                          {t("Reflection", "Refleksi", "Reflectie", lang)}
                        </p>
                        <p style={{ fontSize: 15, lineHeight: 1.65, color: navy, fontStyle: "italic", margin: 0 }}>
                          {t(p.en_q, p.id_q, p.nl_q, lang)}
                        </p>
                      </div>

                      {/* Action */}
                      <div style={{ display: "flex", gap: 14, alignItems: "flex-start", background: `${orange}12`, borderRadius: 10, padding: "16px 20px" }}>
                        <span style={{ fontSize: 18, flexShrink: 0 }}>→</span>
                        <p style={{ fontSize: 14, lineHeight: 1.6, color: bodyText, margin: 0 }}>
                          <strong style={{ color: orange }}>{t("This week:", "Minggu ini:", "Deze week:", lang)}</strong>{" "}
                          {t(p.en_action, p.id_action, p.nl_action, lang)}
                        </p>
                      </div>

                      {/* Luke 10 reference for People */}
                      {p.key === "people" && (
                        <p style={{ marginTop: 16, fontSize: 13, color: "oklch(55% 0.04 260)" }}>
                          {t("Biblical foundation: ", "Dasar Alkitab: ", "Bijbelse grondslag: ", lang)}
                          <button onClick={() => setActiveVerse("luke-10-1")} style={{ background: "none", border: "none", cursor: "pointer", color: orange, fontWeight: 700, fontSize: 13, textDecoration: "underline dotted", padding: 0 }}>
                            {lang === "id" ? "Lukas 10:1" : lang === "nl" ? "Lucas 10:1" : "Luke 10:1"}
                          </button>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ELIJAH NARRATIVE — BIBLICAL FOUNDATION */}
      <section style={{ background: navy, padding: "80px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: orange, marginBottom: 16, textAlign: "center" }}>
            {t("Biblical Foundation", "Dasar Alkitab", "Bijbelse Grondslag", lang)}
          </p>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 800, color: offWhite, textAlign: "center", marginBottom: 40 }}>
            {t("The Leader Under the Juniper Tree", "Pemimpin di Bawah Pohon Aras", "De Leider Onder de Bremstruik", lang)}
          </h2>

          {/* Narrative */}
          {[
            {
              label: t("The Victory", "Kemenangan", "De Overwinning", lang),
              en: "Elijah had just won the greatest victory of his prophetic ministry — fire from heaven on Mt. Carmel, 450 false prophets defeated, rain returning to a drought-parched land. By every measure, he was at the peak of his effectiveness.",
              id: "Elia baru saja meraih kemenangan terbesar dalam pelayanan kenabiannya — api dari surga di Gunung Karmel, 450 nabi palsu dikalahkan, hujan kembali ke tanah yang dilanda kekeringan. Dengan segala ukuran, ia berada di puncak efektivitasnya.",
              nl: "Elia had zojuist de grootste overwinning van zijn profetische bediening behaald — vuur uit de hemel op de Karmel, 450 valse profeten verslagen, regen die terugkeerde naar een door droogte geteisterd land. Naar alle maatstaven stond hij op het hoogtepunt van zijn effectiviteit.",
              icon: "⚡",
            },
            {
              label: t("The Collapse", "Keruntuhan", "De Ineenstorting", lang),
              en: "Then one threat from Jezebel was enough. Elijah ran — alone, exhausted, afraid. He sat under a juniper tree in the wilderness and asked God to take his life. 'I have had enough, LORD.' This was not weakness of faith. It was a burnt-out leader at the end of himself.",
              id: "Kemudian satu ancaman dari Izebel sudah cukup. Elia lari — sendirian, kelelahan, ketakutan. Ia duduk di bawah pohon aras di padang gurun dan meminta Tuhan untuk mengakhiri hidupnya. 'Cukup sekian, ya TUHAN.' Ini bukan kelemahan iman. Ini adalah seorang pemimpin yang kelelahan dan sudah mencapai batas dirinya.",
              nl: "Toen was één dreiging van Izebel genoeg. Elia vluchtte — alleen, uitgeput, bang. Hij zat onder een bremstruik in de woestijn en vroeg God om zijn leven te nemen. 'Het is genoeg, HEER.' Dit was geen geloofszwakte. Het was een opgebrande leider op zijn uiterste grens.",
              icon: "🌑",
            },
            {
              label: t("God's Response", "Respons Tuhan", "Gods Antwoord", lang),
              en: "God's first response to Elijah's burnout was not a sermon. It was a meal and rest. An angel touched him twice: 'Get up and eat — the journey is too great for you.' God met the physical before the spiritual. He restored before he redirected.",
              id: "Respons pertama Tuhan terhadap kelelahan Elia bukan sebuah khotbah. Melainkan makanan dan istirahat. Seorang malaikat menyentuhnya dua kali: 'Bangunlah dan makanlah — perjalanan itu terlalu jauh bagimu.' Tuhan memenuhi kebutuhan fisik sebelum kebutuhan rohani. Dia memulihkan sebelum mengarahkan kembali.",
              nl: "Gods eerste reactie op Elia's burnout was geen preek. Het was een maaltijd en rust. Een engel raakte hem tweemaal aan: 'Sta op en eet — de weg is te groot voor jou.' God ontmoette het fysieke voor het geestelijke. Hij herstelde voordat hij opnieuw richtte.",
              icon: "🌿",
            },
            {
              label: t("The Whisper", "Bisikan", "Het Gefluister", lang),
              en: "After fire, wind, and earthquake — God came in a gentle whisper. Not in the dramatic. In the quiet. 'What are you doing here, Elijah?' The same question God asks every burnt-out leader. Not to shame. To invite back to purpose.",
              id: "Setelah api, angin, dan gempa bumi — Tuhan datang dalam bisikan yang lembut. Bukan dalam hal yang dramatis. Dalam ketenangan. 'Apa yang kaulakukan di sini, Elia?' Pertanyaan yang sama yang Tuhan tanyakan kepada setiap pemimpin yang kelelahan. Bukan untuk mempermalukan. Tetapi untuk mengundang kembali ke tujuan.",
              nl: "Na vuur, wind en aardbeving — God kwam in een zacht gefluister. Niet in het dramatische. In de stilte. 'Wat doe je hier, Elia?' Dezelfde vraag die God aan elke opgebrande leider stelt. Niet om te beschamen. Maar om terug te nodigen naar roeping.",
              icon: "🌬️",
            },
          ].map((section, i) => (
            <div key={i} style={{ display: "flex", gap: 20, marginBottom: 36, alignItems: "flex-start" }}>
              <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: "50%", background: "oklch(32% 0.10 260)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                {section.icon}
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: 8 }}>{section.label}</p>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: "oklch(82% 0.03 80)", margin: 0 }}>
                  {lang === "en" ? section.en : lang === "id" ? section.id : section.nl}
                </p>
              </div>
            </div>
          ))}

          {/* Verse callout */}
          <div style={{ marginTop: 48, background: "oklch(28% 0.10 260)", borderRadius: 12, padding: "28px 32px", textAlign: "center" }}>
            <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 20, color: "oklch(88% 0.04 80)", lineHeight: 1.7, fontStyle: "italic", marginBottom: 12 }}>
              "{lang === "en" ? VERSES["1kings-19-5"].en : lang === "id" ? VERSES["1kings-19-5"].id : VERSES["1kings-19-5"].nl}"
            </p>
            <button onClick={() => setActiveVerse("1kings-19-5")} style={{ background: "none", border: "none", cursor: "pointer", color: orange, fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", textDecoration: "underline dotted" }}>
              {lang === "id" ? VERSES["1kings-19-5"].ref_id : lang === "nl" ? VERSES["1kings-19-5"].ref_nl : VERSES["1kings-19-5"].ref}
            </button>
          </div>

          {/* Theological reflection */}
          <div style={{ marginTop: 32, padding: "24px 0" }}>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "oklch(78% 0.03 80)", fontStyle: "italic", textAlign: "center" }}>
              {t(
                "Notice what God did not do: He did not rebuke Elijah for his despair. He did not tell him to push through. He fed him, let him sleep, and asked a question. The God who knows your capacity does not demand performance from empty vessels.",
                "Perhatikan apa yang tidak dilakukan Tuhan: Dia tidak menegur Elia karena keputusasaannya. Dia tidak menyuruhnya untuk terus berjuang. Dia memberinya makan, membiarkannya tidur, dan mengajukan sebuah pertanyaan. Tuhan yang mengetahui kapasitas Anda tidak menuntut performa dari bejana yang kosong.",
                "Merk op wat God niet deed: Hij berispte Elia niet om zijn wanhoop. Hij zei hem niet door te zetten. Hij voedde hem, liet hem slapen en stelde een vraag. De God die jouw capaciteit kent, eist geen prestaties van lege vaten.",
                lang
              )}
            </p>
          </div>
        </div>
      </section>

      {/* SELF-ASSESSMENT — FUEL CHECK */}
      <section style={{ background: "oklch(96% 0.004 80)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: orange, marginBottom: 12 }}>
            {t("Step 3 — Honest Check", "Langkah 3 — Pemeriksaan Jujur", "Stap 3 — Eerlijke Check", lang)}
          </p>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 800, color: navy, marginBottom: 16 }}>
            {t("Where are you on the fuel gauge?", "Di mana posisi Anda pada pengukur bahan bakar?", "Waar sta je op de brandstofmeter?", lang)}
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.65, color: bodyText, maxWidth: 540, margin: "0 auto 48px" }}>
            {t("Answer honestly. This is for you alone.", "Jawab dengan jujur. Ini hanya untuk Anda.", "Antwoord eerlijk. Dit is alleen voor jou.", lang)}
          </p>

          <div style={{ display: "grid", gap: 16, maxWidth: 560, margin: "0 auto" }}>
            {[
              { label: t("Overloaded — running on fumes", "Kelebihan beban — berjalan dengan sisa energi", "Overbelast — rijdend op de damp", lang), level: 1 },
              { label: t("Depleted but still functional", "Terkuras tapi masih bisa berfungsi", "Uitgeput maar nog functioneel", lang), level: 2 },
              { label: t("Managing, but the margin is thin", "Bisa bertahan, tapi ruang gerak sangat sempit", "Het gaat, maar de marge is dun", lang), level: 3 },
              { label: t("Mostly okay — occasional dips", "Sebagian besar baik — kadang menurun", "Grotendeels goed — af en toe een dip", lang), level: 4 },
              { label: t("Full tank — genuinely sustainable", "Tangki penuh — benar-benar berkelanjutan", "Volle tank — echt duurzaam", lang), level: 5 },
            ].map(({ label, level }) => (
              <div key={level} style={{ display: "flex", alignItems: "center", gap: 16, background: "white", borderRadius: 10, padding: "16px 20px" }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {[1,2,3,4,5].map(i => (
                    <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: i <= level ? (level <= 2 ? "oklch(55% 0.18 25)" : level === 3 ? orange : "oklch(52% 0.16 145)") : "oklch(88% 0.008 80)" }} />
                  ))}
                </div>
                <p style={{ fontSize: 14, color: bodyText, margin: 0, lineHeight: 1.4, textAlign: "left" }}>{label}</p>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 32, fontSize: 14, color: "oklch(55% 0.05 260)", fontStyle: "italic", maxWidth: 500, margin: "32px auto 0" }}>
            {t(
              "If you're below 3, what you're reading today matters. But more important than reading about burnout is taking one action this week. Don't just learn. Move.",
              "Jika Anda di bawah 3, apa yang Anda baca hari ini penting. Tetapi lebih penting dari membaca tentang kelelahan adalah mengambil satu tindakan minggu ini. Jangan hanya belajar. Bergeraklah.",
              "Als je onder de 3 zit, is wat je vandaag leest belangrijk. Maar belangrijker dan lezen over burnout is één actie ondernemen deze week. Leer niet alleen. Beweeg.",
              lang
            )}
          </p>
        </div>
      </section>

      {/* SAVE & PATHWAY CTA */}
      <section style={{ background: navy, padding: "64px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(82% 0.03 80)", lineHeight: 1.7, fontStyle: "italic", marginBottom: 32 }}>
            {t(
              "\"He who began a good work in you will carry it on to completion.\" You are not the fuel source. You are the vessel.",
              "\"Dia yang memulai pekerjaan yang baik di antara kamu, akan meneruskannya hingga selesai.\" Anda bukan sumber bahan bakarnya. Anda adalah bejananya.",
              "\"Hij die dit goede werk in je begonnen is, zal het ook voltooien.\" Jij bent niet de brandstofbron. Jij bent het vat.",
              lang
            )}
          </p>
          <p style={{ fontSize: 12, color: orange, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 48 }}>
            — {lang === "id" ? VERSES["phil-4-13"].ref_id : lang === "nl" ? VERSES["phil-4-13"].ref_nl : "Philippians 1:6"}
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {!saved ? (
              <button
                onClick={handleSave}
                disabled={isPending}
                style={{ padding: "14px 32px", background: orange, color: "white", border: "none", borderRadius: 8, fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 14, cursor: isPending ? "wait" : "pointer", letterSpacing: "0.06em" }}
              >
                {isPending ? t("Saving…", "Menyimpan…", "Opslaan…", lang) : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard", lang)}
              </button>
            ) : (
              <span style={{ padding: "14px 32px", background: "oklch(40% 0.15 145)", color: "white", borderRadius: 8, fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "0.06em" }}>
                ✓ {t("Saved to Dashboard", "Tersimpan di Dashboard", "Opgeslagen in Dashboard", lang)}
              </span>
            )}
            {userPathway && (
              <Link href={`/dashboard`} style={{ padding: "14px 32px", background: "transparent", color: offWhite, border: `1.5px solid oklch(50% 0.06 260)`, borderRadius: 8, fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 14, textDecoration: "none", letterSpacing: "0.06em" }}>
                {t("Back to Pathway", "Kembali ke Jalur", "Terug naar Pad", lang)}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* VERSE POPUP */}
      {activeVerse && VERSES[activeVerse as keyof typeof VERSES] && (() => {
        const v = VERSES[activeVerse as keyof typeof VERSES];
        return (
          <div onClick={() => setActiveVerse(null)} style={{ position: "fixed", inset: 0, background: "oklch(10% 0.05 260 / 0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }}>
            <div onClick={e => e.stopPropagation()} style={{ background: offWhite, borderRadius: 16, padding: "40px 36px", maxWidth: 520, width: "100%" }}>
              <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 22, lineHeight: 1.6, color: navy, fontStyle: "italic", marginBottom: 16 }}>
                "{lang === "en" ? v.en : lang === "id" ? v.id : v.nl}"
              </p>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, color: orange, letterSpacing: "0.08em", marginBottom: 24 }}>
                — {lang === "en" ? v.ref : lang === "id" ? v.ref_id : v.ref_nl} ({lang === "en" ? "NIV" : lang === "id" ? "TB" : "NBV"})
              </p>
              <button onClick={() => setActiveVerse(null)} style={{ padding: "10px 24px", background: navy, color: offWhite, border: "none", borderRadius: 6, fontFamily: "Montserrat, sans-serif", fontWeight: 700, cursor: "pointer" }}>
                {t("Close", "Tutup", "Sluiten", lang)}
              </button>
            </div>
          </div>
        );
      })()}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
