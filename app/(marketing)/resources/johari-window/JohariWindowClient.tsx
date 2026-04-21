"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const PANES = [
  {
    key: "open",
    en_title: "Open — The Arena",
    id_title: "Terbuka — Arena",
    nl_title: "Open — De Arena",
    en_desc: "What is known both to you and to others. This is the space of transparent, effective communication. The larger your Arena, the more authentic and productive your relationships become. Growing this quadrant is the entire point of the model.",
    id_desc: "Apa yang diketahui baik oleh Anda maupun orang lain. Ini adalah ruang komunikasi yang transparan dan efektif. Semakin besar Arena Anda, semakin autentik dan produktif hubungan Anda.",
    nl_desc: "Wat zowel aan jou als aan anderen bekend is. Dit is de ruimte van transparante, effectieve communicatie. Hoe groter je Arena, hoe authentieker en productiever je relaties worden.",
    en_cross: "In Dutch and Western contexts, the Arena tends to be large by default — directness and openness are cultural values. In Indonesian and Malaysian settings, the Arena builds slowly, only expanding after long-term trust is established. Professional roles often define the Arena's visible edge.",
    id_cross: "Dalam konteks Belanda dan Barat, Arena cenderung besar secara default — kejujuran dan keterbukaan adalah nilai budaya. Dalam setting Indonesia dan Malaysia, Arena berkembang perlahan, hanya meluas setelah kepercayaan jangka panjang terbangun.",
    nl_cross: "In Nederlandse en Westerse contexten is de Arena van nature groot — directheid en openheid zijn culturele waarden. In Indonesische en Maleisische settings bouwt de Arena langzaam op, pas na vertrouwen op de lange termijn.",
    color: "oklch(50% 0.14 260)",
    colorBg: "oklch(96% 0.02 260)",
  },
  {
    key: "blind",
    en_title: "Blind Spot",
    id_title: "Titik Buta",
    nl_title: "Blinde Vlek",
    en_desc: "What others know about you that you do not know about yourself — patterns, behaviours, and impacts you are unaware of. Leaders with large blind spots often derail not from incompetence but because no one has told them the truth. Feedback is the cure.",
    id_desc: "Apa yang orang lain ketahui tentang Anda yang tidak Anda ketahui tentang diri Anda sendiri — pola, perilaku, dan dampak yang tidak Anda sadari. Pemimpin dengan titik buta besar sering tergelincir bukan karena ketidakmampuan tetapi karena tidak ada yang memberi tahu mereka kebenaran.",
    nl_desc: "Wat anderen over jou weten wat jij niet over jezelf weet — patronen, gedragingen en impacts waarvan jij je niet bewust bent. Leiders met grote blinde vlekken ontsporen vaak niet door incompetentie maar omdat niemand hen de waarheid heeft verteld.",
    en_cross: "In Western settings, leaders are expected to actively solicit feedback to shrink blind spots. In Southeast Asia, high power distance means subordinates often see the leader's blind spot but stay silent — speaking would shame the leader and violate hierarchy. The blind spot grows unseen.",
    id_cross: "Dalam setting Barat, pemimpin diharapkan secara aktif meminta umpan balik untuk memperkecil titik buta. Di Asia Tenggara, jarak kekuasaan yang tinggi berarti bawahan sering melihat titik buta pemimpin tetapi tetap diam — berbicara akan mempermalukan pemimpin.",
    nl_cross: "In Westerse settings wordt van leiders verwacht dat ze actief feedback vragen om blinde vlekken te verkleinen. In Zuidoost-Azië betekent hoge machtafstand dat ondergeschikten de blinde vlek van de leider vaak zien maar zwijgen — spreken zou de leider beschamen.",
    color: "oklch(45% 0.15 20)",
    colorBg: "oklch(97% 0.02 20)",
  },
  {
    key: "hidden",
    en_title: "Hidden — The Facade",
    id_title: "Tersembunyi — Fasad",
    nl_title: "Verborgen — De Façade",
    en_desc: "What you know about yourself that others do not know — fears, struggles, motivations, and past experiences you have not shared. In cross-cultural leadership, some things legitimately stay private. But excessive concealment quietly erodes connection and trust.",
    id_desc: "Apa yang Anda ketahui tentang diri Anda yang tidak diketahui orang lain — ketakutan, perjuangan, motivasi, dan pengalaman masa lalu yang belum Anda bagikan. Dalam kepemimpinan lintas budaya, beberapa hal memang layak tetap pribadi. Namun penyembunyian berlebihan secara diam-diam mengikis koneksi.",
    nl_desc: "Wat jij over jezelf weet wat anderen niet weten — angsten, worstelingen, motivaties en vroegere ervaringen. In intercultureel leiderschap blijft sommige informatie legitiem privé. Maar overmatige verberging ondermijnt verbinding en vertrouwen.",
    en_cross: "Western leaders often use voluntary self-disclosure to build rapport — sharing struggles signals authenticity. Southeast Asian leaders are often culturally required to maintain a larger Facade to preserve dignity and hierarchy. Oversharing can actually undermine authority and cause discomfort.",
    id_cross: "Pemimpin Barat sering menggunakan pengungkapan diri sukarela untuk membangun hubungan. Pemimpin Asia Tenggara sering secara budaya diharuskan mempertahankan Fasad yang lebih besar untuk menjaga martabat dan hierarki.",
    nl_cross: "Westerse leiders gebruiken vaak vrijwillige zelfonthulling om rapport op te bouwen. Zuidoost-Aziatische leiders moeten cultureel gezien een grotere Façade bewaren om waardigheid en hiërarchie te bewaken. Te veel delen kan autoriteit ondermijnen.",
    color: "oklch(50% 0.12 45)",
    colorBg: "oklch(97% 0.02 45)",
  },
  {
    key: "unknown",
    en_title: "Unknown",
    id_title: "Tidak Diketahui",
    nl_title: "Onbekend",
    en_desc: "What neither you nor others know about you — undiscovered potential, unconscious patterns, or responses to situations you have never faced. This quadrant shrinks as you grow through new experiences, honest feedback, and deep reflection.",
    id_desc: "Apa yang tidak Anda maupun orang lain ketahui tentang Anda — potensi yang belum ditemukan, pola tidak sadar, atau respons terhadap situasi yang belum pernah Anda hadapi. Kuadran ini menyusut seiring pertumbuhan Anda.",
    nl_desc: "Wat noch jij noch anderen over jou weten — onontdekt potentieel, onbewuste patronen of reacties op situaties die je nooit hebt meegemaakt. Dit kwadrant slinkt naarmate je groeit.",
    en_cross: "Western leaders often explore the Unknown through risk-taking and individual experimentation. In Southeast Asian cultures, the Unknown is more likely to surface through collective wisdom, shared journeys, and harmony — the group reveals what the individual cannot see alone.",
    id_cross: "Pemimpin Barat sering mengeksplorasi yang Tidak Diketahui melalui pengambilan risiko. Dalam budaya Asia Tenggara, yang Tidak Diketahui lebih mungkin muncul melalui kebijaksanaan kolektif dan perjalanan bersama.",
    nl_cross: "Westerse leiders verkennen het Onbekende vaak via risico's nemen. In Zuidoost-Aziatische culturen komt het Onbekende vaker naar boven via collectieve wijsheid en gedeelde reizen — de groep onthult wat het individu alleen niet kan zien.",
    color: "oklch(40% 0.12 150)",
    colorBg: "oklch(96% 0.02 150)",
  },
];

const SCENARIOS = [
  {
    title: { en: "The Direct Feedback Clash", id: "Benturan Umpan Balik Langsung", nl: "De Directe Feedback-botsing" },
    setup: {
      en: "A Dutch leader decides to 'clear the Arena' by giving direct, corrective feedback to an Indonesian team member in front of the whole group — believing transparency and openness will build trust.",
      id: "Seorang pemimpin Belanda memutuskan untuk 'membersihkan Arena' dengan memberikan umpan balik korektif langsung kepada anggota tim Indonesia di depan seluruh kelompok — percaya bahwa transparansi akan membangun kepercayaan.",
      nl: "Een Nederlandse leider besluit de 'Arena te verhelderen' door directe, corrigerende feedback te geven aan een Indonesisch teamlid voor de hele groep — gelooft dat transparantie vertrouwen opbouwt.",
    },
    breakdown: {
      en: "The team member feels publicly shamed — a profound loss of face. Rather than opening the Arena, this closes it entirely. The team member withdraws, stops sharing, and begins filtering all communication carefully. Trust has been damaged, not built.",
      id: "Anggota tim merasa dipermalukan di depan umum — kehilangan muka yang mendalam. Alih-alih membuka Arena, ini menutupnya sepenuhnya. Anggota tim menarik diri dan mulai menyaring semua komunikasi dengan hati-hati.",
      nl: "Het teamlid voelt zich publiekelijk beschaamd — een diep gezichtsverlies. In plaats van de Arena te openen, sluit dit hem volledig. Het teamlid trekt zich terug en begint alle communicatie zorgvuldig te filteren.",
    },
    response: {
      en: "Expand the Arena through private, one-on-one conversations first. Share something from your own Hidden pane to invite reciprocity. Build enough trust that honest dialogue can eventually happen — but at the other person's pace, not yours.",
      id: "Perluas Arena melalui percakapan pribadi terlebih dahulu. Bagikan sesuatu dari panel Tersembunyi Anda sendiri untuk mengundang timbal balik. Bangun kepercayaan yang cukup sehingga dialog jujur ​​akhirnya dapat terjadi.",
      nl: "Vergroot de Arena eerst via privégesprekken, één op één. Deel iets uit je eigen Verborgen pane om wederkerigheid uit te nodigen. Bouw genoeg vertrouwen op zodat eerlijke dialoog uiteindelijk kan plaatsvinden.",
    },
  },
  {
    title: { en: "The Over-Disclosure Disconnect", id: "Ketidaksesuaian Pengungkapan Berlebihan", nl: "De Te-veel-delen Kloof" },
    setup: {
      en: "A Western leader, trying to build team intimacy, shares deep personal failures and insecurities openly in a team meeting with a Malaysian team — intending it as vulnerability and authenticity.",
      id: "Seorang pemimpin Barat, mencoba membangun keintiman tim, berbagi kegagalan dan kelemahan pribadi yang mendalam secara terbuka dalam pertemuan tim dengan tim Malaysia — bermaksud sebagai kerentanan dan keaslian.",
      nl: "Een Westerse leider, die teamintimiteit wil opbouwen, deelt diepe persoonlijke mislukkingen en onzekerheden openlijk in een teamvergadering met een Maleisisch team — bedoeld als kwetsbaarheid en authenticiteit.",
    },
    breakdown: {
      en: "The team feels profoundly uncomfortable. Rather than building trust, oversharing reads as a failure to maintain the professional dignity expected of a leader. They question his competence and begin to lose confidence in his leadership.",
      id: "Tim merasa sangat tidak nyaman. Alih-alih membangun kepercayaan, berbagi terlalu banyak dibaca sebagai kegagalan untuk mempertahankan martabat profesional yang diharapkan dari seorang pemimpin.",
      nl: "Het team voelt zich diep ongemakkelijk. In plaats van vertrouwen op te bouwen, wordt het oversharen gelezen als een mislukking om de professionele waardigheid van een leider te bewaken.",
    },
    response: {
      en: "Calibrate your Hidden pane to cultural context. In high-context, high-hierarchy cultures, share enough to be human but not so much that professional dignity is compromised. Find trusted one-on-one relationships for deeper disclosure.",
      id: "Kalibrasi panel Tersembunyi Anda ke konteks budaya. Dalam budaya konteks tinggi dan hierarki tinggi, bagikan cukup untuk menjadi manusiawi tetapi tidak sampai martabat profesional terganggu.",
      nl: "Kalibreer je Verborgen pane naar culturele context. In hoge-context, hoge-hiërarchie culturen, deel genoeg om menselijk te zijn maar niet zoveel dat professionele waardigheid in gevaar komt.",
    },
  },
  {
    title: { en: "The Silent Blind Spot", id: "Titik Buta yang Sunyi", nl: "De Stille Blinde Vlek" },
    setup: {
      en: "A Western leader presents a flawed strategy to a Filipino team. The team clearly sees the flaw but says nothing — silence from hierarchy and face-saving instincts. The leader assumes silence means the Arena is clear and implements the plan.",
      id: "Seorang pemimpin Barat mempresentasikan strategi yang cacat kepada tim Filipina. Tim dengan jelas melihat kecacatan tersebut tetapi tidak mengatakan apa-apa — keheningan dari hierarki dan naluri menyelamatkan muka.",
      nl: "Een Westerse leider presenteert een gebrekkige strategie aan een Filipijns team. Het team ziet duidelijk de fout maar zegt niets — stilte vanwege hiërarchie en gezichtsbesparingsinstincten.",
    },
    breakdown: {
      en: "The plan fails. The leader feels betrayed by the team's silence. The team feels the leader should have created a safer space to share concerns. Both sides are right — and both have partially failed each other.",
      id: "Rencana itu gagal. Pemimpin merasa dikhianati oleh keheningan tim. Tim merasa pemimpin seharusnya menciptakan ruang yang lebih aman untuk berbagi kekhawatiran.",
      nl: "Het plan mislukt. De leider voelt zich verraden door de stilte van het team. Het team vindt dat de leider een veiligere ruimte had moeten creëren. Beide kanten hebben gelijk — en hebben elkaar deels in de steek gelaten.",
    },
    response: {
      en: "Create structured channels for blind spot feedback that don't require public confrontation — anonymous input, small-group conversations, or trusted intermediaries. Assume your blind spot exists until proven otherwise, especially across cultural difference.",
      id: "Buat saluran terstruktur untuk umpan balik titik buta yang tidak memerlukan konfrontasi publik — input anonim, percakapan kelompok kecil, atau perantara terpercaya.",
      nl: "Creëer gestructureerde kanalen voor blinde-vlek-feedback die geen publieke confrontatie vereisen — anonieme input, kleine groepsgesprekken of vertrouwde tussenpersonen.",
    },
  },
];

const PRACTICES = [
  {
    en: "Regularly invite specific, structured feedback from people at multiple levels of your organisation — not just peers.",
    id: "Secara teratur undang umpan balik spesifik dan terstruktur dari orang-orang di berbagai tingkat organisasi Anda — bukan hanya rekan.",
    nl: "Nodig regelmatig specifieke, gestructureerde feedback uit van mensen op meerdere niveaus van je organisatie — niet alleen collega's.",
  },
  {
    en: "Share appropriately from your Hidden pane — purposeful vulnerability builds trust when it is calibrated to cultural context.",
    id: "Bagikan dengan tepat dari panel Tersembunyi Anda — kerentanan yang bertujuan membangun kepercayaan ketika dikalibrasi ke konteks budaya.",
    nl: "Deel passend uit je Verborgen pane — doelgerichte kwetsbaarheid bouwt vertrouwen op wanneer gekalibreerd naar culturele context.",
  },
  {
    en: "Create anonymous or private feedback channels so high-power-distance team members can point out blind spots without public risk.",
    id: "Buat saluran umpan balik anonim atau pribadi sehingga anggota tim berjarak kekuasaan tinggi dapat menunjukkan titik buta tanpa risiko publik.",
    nl: "Creëer anonieme of privé feedbackkanalen zodat teamleden met hoge machtafstand blinde vlekken kunnen aanwijzen zonder publiek risico.",
  },
  {
    en: "Use the Johari Window as a team exercise — map together what's in the Open area and what might be in each other's blind spots.",
    id: "Gunakan Jendela Johari sebagai latihan tim — petakan bersama apa yang ada di area Terbuka dan apa yang mungkin ada di titik buta satu sama lain.",
    nl: "Gebruik het Johari-venster als teamoefening — breng samen in kaart wat in het Open gebied staat en wat in elkaars blinde vlekken kan zitten.",
  },
  {
    en: "Seek out cross-cultural exposure — new environments reveal the Unknown quadrant faster than any exercise.",
    id: "Carilah paparan lintas budaya — lingkungan baru mengungkapkan kuadran Tidak Diketahui lebih cepat daripada latihan apa pun.",
    nl: "Zoek interculturele blootstelling — nieuwe omgevingen onthullen het Onbekende kwadrant sneller dan welke oefening dan ook.",
  },
  {
    en: "After any significant leadership decision, ask your team: 'What did I miss? What are you thinking that you haven't said?'",
    id: "Setelah keputusan kepemimpinan yang signifikan, tanyakan kepada tim Anda: 'Apa yang saya lewatkan? Apa yang Anda pikirkan yang belum Anda katakan?'",
    nl: "Vraag na elke significante leiderschapsbeslissing je team: 'Wat miste ik? Wat denk je dat je nog niet hebt gezegd?'",
  },
];

const REFLECTION = [
  {
    roman: "I",
    en: "Which of your four panes is currently largest? Which do you most want to shrink?",
    id: "Manakah dari empat panel Anda yang saat ini paling besar? Mana yang paling ingin Anda perkecil?",
    nl: "Welke van je vier panes is momenteel het grootst? Welke wil je het liefst verkleinen?",
  },
  {
    roman: "II",
    en: "When did you last receive feedback that genuinely surprised you — something you didn't know others could see?",
    id: "Kapan terakhir kali Anda menerima umpan balik yang benar-benar mengejutkan Anda — sesuatu yang tidak Anda tahu bisa dilihat orang lain?",
    nl: "Wanneer kreeg je voor het laatst feedback die je echt verraste — iets dat je niet wist dat anderen konden zien?",
  },
  {
    roman: "III",
    en: "In your cultural context, what is the unspoken rule about feedback — and how does that rule help or hinder growth?",
    id: "Dalam konteks budaya Anda, apa aturan tak terucapkan tentang umpan balik — dan bagaimana aturan itu membantu atau menghambat pertumbuhan?",
    nl: "In jouw culturele context, wat is de onuitgesproken regel over feedback — en hoe helpt of belemmert die regel groei?",
  },
  {
    roman: "IV",
    en: "Who in your life has the clearest view of your blind spot? When did you last actively listen to them?",
    id: "Siapa dalam hidup Anda yang memiliki pandangan paling jelas tentang titik buta Anda? Kapan terakhir kali Anda secara aktif mendengarkan mereka?",
    nl: "Wie in je leven heeft het duidelijkste beeld van jouw blinde vlek? Wanneer heb je voor het laatst actief naar ze geluisterd?",
  },
  {
    roman: "V",
    en: "What part of you is still Unknown — neither you nor your team can fully see it yet? What might unlock it?",
    id: "Bagian apa dari Anda yang masih Tidak Diketahui — baik Anda maupun tim Anda belum bisa melihatnya sepenuhnya? Apa yang mungkin membukanya?",
    nl: "Welk deel van jou is nog steeds Onbekend — noch jij noch je team kan het volledig zien? Wat zou het kunnen ontsluiten?",
  },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function JohariWindowClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [openScenario, setOpenScenario] = useState<number | null>(null);
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
      {/* Language bar */}
      <div style={{ background: lightGray, borderBottom: "1px solid oklch(90% 0.01 80)", padding: "10px 24px", display: "flex", gap: 8, justifyContent: "flex-end" }}>
        {(["en", "id", "nl"] as Lang[]).map((l) => (
          <button key={l} onClick={() => setLang(l)} style={{ padding: "4px 14px", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, background: lang === l ? navy : "transparent", color: lang === l ? offWhite : bodyText }}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Hero */}
      <div style={{ background: navy, padding: "80px 24px 72px", textAlign: "center" }}>
        <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
          {t("Self-Leadership", "Kepemimpinan Diri", "Zelfleiderschap")}
        </p>
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: offWhite, margin: "0 auto 20px", maxWidth: 760, lineHeight: 1.15 }}>
          {t("The Johari Window", "Jendela Johari", "Het Johari-venster")}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(85% 0.03 80)", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.6, fontStyle: "italic" }}>
          {t(
            "The most dangerous blind spot is the one you don't know exists — and in cross-cultural leadership, entire teams can see it while you cannot.",
            "Titik buta yang paling berbahaya adalah yang tidak Anda tahu ada — dan dalam kepemimpinan lintas budaya, seluruh tim bisa melihatnya sementara Anda tidak bisa.",
            "De gevaarlijkste blinde vlek is de vlek waarvan je niet weet dat hij bestaat — en in intercultureel leiderschap kan het hele team hem zien terwijl jij dat niet kunt."
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

      {/* Opening */}
      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, marginBottom: 20 }}>
          {t(
            "Psychologists Joseph Luft and Harrington Ingham created the Johari Window in 1955 to map the relationship between self-knowledge and interpersonal trust. They named it after themselves: Jo-hari. The model divides personal awareness into four panes — and the ratio between them shapes everything about how you lead.",
            "Psikolog Joseph Luft dan Harrington Ingham menciptakan Jendela Johari pada tahun 1955 untuk memetakan hubungan antara pengetahuan diri dan kepercayaan antarpribadi. Mereka menamakannya setelah nama mereka: Jo-hari.",
            "Psychologen Joseph Luft en Harrington Ingham creëerden het Johari-venster in 1955 om de relatie tussen zelfkennis en interpersoonlijk vertrouwen in kaart te brengen. Ze noemden het naar zichzelf: Jo-hari."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75 }}>
          {t(
            "In cross-cultural leadership, the model becomes considerably more complex. The size of each pane is not fixed — it shifts with cultural norms around self-disclosure, hierarchy, and face. What expands your Arena in Amsterdam may shut it entirely in Surabaya. Learning to work the Johari Window across cultures is one of the most sophisticated skills in cross-cultural leadership.",
            "Dalam kepemimpinan lintas budaya, model menjadi jauh lebih kompleks. Ukuran setiap panel tidak tetap — berubah dengan norma budaya seputar pengungkapan diri, hierarki, dan muka.",
            "In intercultureel leiderschap wordt het model aanzienlijk complexer. De grootte van elk paneel is niet vast — het verschuift met culturele normen rondom zelfonthulling, hiërarchie en gezicht bewaren."
          )}
        </p>
      </div>

      {/* 4 Panes */}
      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 12, textAlign: "center" }}>
            {t("The Four Panes", "Empat Panel", "De Vier Panes")}
          </h2>
          <p style={{ textAlign: "center", color: bodyText, fontSize: 15, marginBottom: 48 }}>
            {t("Each pane — with a cross-cultural lens", "Setiap panel — dengan perspektif lintas budaya", "Elk paneel — met een interculturele lens")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {PANES.map((p) => (
              <div key={p.key} style={{ background: offWhite, padding: "32px 36px" }}>
                <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 20 }}>
                  <div style={{ width: 12, height: 12, background: p.color, flexShrink: 0, marginTop: 6 }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 18, fontWeight: 700, color: navy, marginBottom: 10 }}>
                      {lang === "en" ? p.en_title : lang === "id" ? p.id_title : p.nl_title}
                    </h3>
                    <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                      {lang === "en" ? p.en_desc : lang === "id" ? p.id_desc : p.nl_desc}
                    </p>
                  </div>
                </div>
                <div style={{ background: p.colorBg, padding: "14px 18px", marginLeft: 32 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: p.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                    {t("Cross-Cultural Lens", "Perspektif Lintas Budaya", "Interculturele Lens")}
                  </p>
                  <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.7, margin: 0 }}>
                    {lang === "en" ? p.en_cross : lang === "id" ? p.id_cross : p.nl_cross}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scenarios */}
      <div style={{ padding: "72px 24px", maxWidth: 800, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 12, textAlign: "center" }}>
          {t("When the Model Breaks Down", "Ketika Model Gagal", "Wanneer het Model Faalt")}
        </h2>
        <p style={{ textAlign: "center", color: bodyText, fontSize: 15, marginBottom: 48 }}>
          {t("Three cross-cultural Johari failures — and what high-awareness leadership looks like", "Tiga kegagalan Johari lintas budaya — dan seperti apa kepemimpinan kesadaran tinggi", "Drie interculturele Johari-mislukkingen — en hoe hoog-bewust leiderschap eruitziet")}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {SCENARIOS.map((s, i) => {
            const isOpen = openScenario === i;
            return (
              <div key={i} style={{ border: `1px solid ${isOpen ? orange : "oklch(88% 0.01 80)"}`, overflow: "hidden" }}>
                <button
                  onClick={() => setOpenScenario(isOpen ? null : i)}
                  style={{ width: "100%", padding: "20px 28px", background: isOpen ? navy : offWhite, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, textAlign: "left" }}
                >
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 16, fontWeight: 700, color: isOpen ? offWhite : navy }}>
                    {s.title[lang]}
                  </span>
                  <span style={{ color: isOpen ? orange : bodyText, fontSize: 20, flexShrink: 0, lineHeight: 1 }}>{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div style={{ padding: "28px 28px 32px", background: offWhite }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: orange, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                      {t("The Situation", "Situasinya", "De Situatie")}
                    </p>
                    <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, marginBottom: 24 }}>{s.setup[lang]}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "oklch(45% 0.15 20)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                      {t("What Went Wrong", "Yang Salah", "Wat Misging")}
                    </p>
                    <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, marginBottom: 24 }}>{s.breakdown[lang]}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "oklch(40% 0.12 160)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                      {t("The High-Awareness Response", "Respons Kesadaran Tinggi", "De Hoog-Bewuste Respons")}
                    </p>
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
            {t("Self-Knowledge in Scripture", "Pengetahuan Diri dalam Kitab Suci", "Zelfkennis in de Schrift")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {[
              {
                ref: "Proverbs 27:17",
                verse: {
                  en: '"As iron sharpens iron, so one person sharpens another."',
                  id: '"Besi menajamkan besi, orang menajamkan sesamanya."',
                  nl: '"IJzer wordt scherp door ijzer, de een mens wordt door de ander gevormd."',
                },
                comment: {
                  en: "The communal necessity of feedback. We cannot see our own blind spot without others. The Johari Window is not a solo exercise — it requires a community willing to speak and a leader willing to hear.",
                  id: "Kebutuhan komunal akan umpan balik. Kita tidak dapat melihat titik buta kita sendiri tanpa orang lain. Jendela Johari bukan latihan solo — ini membutuhkan komunitas yang mau berbicara dan pemimpin yang mau mendengar.",
                  nl: "De communale noodzaak van feedback. We kunnen onze eigen blinde vlek niet zien zonder anderen. Het Johari-venster is geen solo-oefening — het vereist een gemeenschap die wil spreken en een leider die wil horen.",
                },
              },
              {
                ref: "Ephesians 4:15",
                verse: {
                  en: '"Instead, speaking the truth in love, we will grow to become in every respect the mature body of him who is the head."',
                  id: '"Tetapi dengan berbicara kebenaran di dalam kasih kita bertumbuh di dalam segala hal ke arah Dia, Kristus, yang adalah Kepala."',
                  nl: '"Maar dan, de waarheid doende in liefde, zullen wij in alle opzichten toenemen naar Hem toe, die het hoofd is, Christus."',
                },
                comment: {
                  en: "A framework that balances the Western need for truth (reducing blind spots) with the Southeast Asian concern for love (preserving relationship and dignity). Truth without love destroys the Arena. Love without truth leaves the blind spot intact.",
                  id: "Kerangka yang menyeimbangkan kebutuhan Barat akan kebenaran (mengurangi titik buta) dengan kepedulian Asia Tenggara terhadap kasih (menjaga hubungan dan martabat). Kebenaran tanpa kasih menghancurkan Arena.",
                  nl: "Een raamwerk dat de Westerse behoefte aan waarheid (blinde vlekken verkleinen) in balans brengt met de Zuidoost-Aziatische zorg voor liefde (relatie en waardigheid bewaren). Waarheid zonder liefde vernietigt de Arena.",
                },
              },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: "left" }}>
                <p style={{ color: orange, fontSize: 13, fontWeight: 700, marginBottom: 10 }}>{item.ref}</p>
                <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 20, fontStyle: "italic", color: offWhite, lineHeight: 1.6, marginBottom: 16 }}>
                  {item.verse[lang]}
                </p>
                <p style={{ fontSize: 15, color: "oklch(78% 0.03 80)", lineHeight: 1.75, margin: 0 }}>
                  {item.comment[lang]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Practices */}
      <div style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 48, textAlign: "center" }}>
            {t("6 Practices to Expand Your Arena", "6 Praktik untuk Memperluas Arena Anda", "6 Praktijken om je Arena te Vergroten")}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {PRACTICES.map((p, i) => (
              <div key={i} style={{ background: lightGray, padding: "24px 28px", display: "flex", gap: 18, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 40, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 32, flexShrink: 0 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0, paddingTop: 4 }}>
                  {lang === "en" ? p.en : lang === "id" ? p.id : p.nl}
                </p>
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
                <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                  {lang === "en" ? q.en : lang === "id" ? q.id : q.nl}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: navy, padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: offWhite, marginBottom: 16 }}>
          {t("Keep Growing", "Terus Bertumbuh", "Blijf Groeien")}
        </h2>
        <p style={{ color: "oklch(80% 0.03 80)", fontSize: 16, lineHeight: 1.75, maxWidth: 540, margin: "0 auto 32px" }}>
          {t(
            "Explore more resources to deepen your cross-cultural leadership.",
            "Jelajahi lebih banyak sumber untuk memperdalam kepemimpinan lintas budaya Anda.",
            "Verken meer bronnen om je intercultureel leiderschap te verdiepen."
          )}
        </p>
        <Link href="/resources" style={{ display: "inline-block", padding: "14px 32px", background: orange, color: offWhite, fontFamily: "Montserrat, sans-serif", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
          {t("Browse All Resources", "Jelajahi Semua Sumber", "Bekijk Alle Bronnen")}
        </Link>
      </div>
    </div>
  );
}
