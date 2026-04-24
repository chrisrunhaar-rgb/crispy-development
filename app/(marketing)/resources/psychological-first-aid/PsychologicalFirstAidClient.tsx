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
  "2cor-1-4": {
    ref:    "2 Corinthians 1:4",
    ref_id: "2 Korintus 1:4",
    ref_nl: "2 Korintiërs 1:4",
    en: "who comforts us in all our troubles, so that we can comfort those in any trouble with the comfort we ourselves receive from God.",
    id: "yang menghibur kami dalam segala penderitaan kami, sehingga kami sanggup menghibur mereka, yang berada dalam bermacam-macam penderitaan dengan penghiburan yang kami terima sendiri dari Allah.",
    nl: "Hij troost ons in al onze ellende, zodat wij anderen in al hun ellende kunnen troosten met de troost die wij zelf van God ontvangen.",
  },
  "luke-10-33": {
    ref:    "Luke 10:33–34",
    ref_id: "Lukas 10:33–34",
    ref_nl: "Lucas 10:33–34",
    en: "But a Samaritan, as he traveled, came where the man was; and when he saw him, he took pity on him. He went to him and bandaged his wounds, pouring on oil and wine.",
    id: "Tetapi seorang Samaria, yang sedang dalam perjalanan, datang ke tempat itu; dan ketika ia melihat orang itu, tergeraklah hatinya oleh belas kasihan. Ia pergi kepadanya lalu membalut luka-lukanya, sambil menyiraminya dengan minyak dan anggur.",
    nl: "Maar een Samaritaan die onderweg was, kreeg medelijden toen hij hem zag. Hij liep op hem af, goot olie en wijn op zijn wonden en verbond ze.",
  },
};

// ── RAPID MODEL DATA ──────────────────────────────────────────────────────────
type RapidKey = "R" | "A" | "P" | "I" | "D";

const RAPID_STEPS: {
  key: RapidKey;
  color: string;
  en_title: string; id_title: string; nl_title: string;
  en_meaning: string; id_meaning: string; nl_meaning: string;
  en_desc: string; id_desc: string; nl_desc: string;
  en_example: string; id_example: string; nl_example: string;
  en_avoid: string; id_avoid: string; nl_avoid: string;
}[] = [
  {
    key: "R",
    color: "oklch(48% 0.16 230)",
    en_title: "Reflective Listening",
    id_title: "Mendengarkan Reflektif",
    nl_title: "Reflectief Luisteren",
    en_meaning: "Be fully present. Hear what is being said — and what is not.",
    id_meaning: "Hadir sepenuhnya. Dengarkan apa yang dikatakan — dan yang tidak dikatakan.",
    nl_meaning: "Wees volledig aanwezig. Hoor wat er gezegd wordt — en wat niet.",
    en_desc: "Before anything else, the person in crisis needs to feel heard. Reflective listening means slowing down, making eye contact, and mirroring back what you are hearing — not to fix, but to show that you have received what they shared. This is the foundation on which everything else is built.",
    id_desc: "Sebelum hal lain apapun, orang yang berada dalam krisis perlu merasa didengar. Mendengarkan reflektif berarti melambat, melakukan kontak mata, dan memantulkan kembali apa yang Anda dengar — bukan untuk memperbaiki, tetapi untuk menunjukkan bahwa Anda telah menerima apa yang mereka bagikan. Ini adalah fondasi di mana segalanya dibangun.",
    nl_desc: "Voor alles anderen heeft de persoon in crisis het nodig om zich gehoord te voelen. Reflectief luisteren betekent vertragen, oogcontact maken, en terugspiegelen wat je hoort — niet om te repareren, maar om te tonen dat je hebt ontvangen wat ze deelden. Dit is het fundament waarop alles verder gebouwd wordt.",
    en_example: "\"I hear you. That sounds incredibly heavy. Can you tell me more about what happened?\" — then stay quiet and listen fully before responding.",
    id_example: "\"Aku mendengarmu. Itu terdengar sangat berat. Bisakah kamu ceritakan lebih lanjut tentang apa yang terjadi?\" — lalu tetap diam dan benar-benar mendengarkan sebelum merespons.",
    nl_example: "\"Ik hoor je. Dat klinkt ongelooflijk zwaar. Kun je me meer vertellen over wat er is gebeurd?\" — blijf dan stil en luister volledig voordat je reageert.",
    en_avoid: "Don't fill the silence with solutions. Don't say 'I know how you feel' — you don't yet. Don't jump to advice before the full story is out.",
    id_avoid: "Jangan mengisi keheningan dengan solusi. Jangan berkata 'Aku tahu perasaanmu' — kamu belum tahu. Jangan langsung ke saran sebelum cerita lengkap terungkap.",
    nl_avoid: "Vul de stilte niet met oplossingen. Zeg niet 'Ik weet hoe je je voelt' — dat weet je nog niet. Spring niet naar advies voordat het volledige verhaal er is.",
  },
  {
    key: "A",
    color: "oklch(50% 0.17 165)",
    en_title: "Assessment",
    id_title: "Penilaian",
    nl_title: "Beoordeling",
    en_meaning: "Understand the nature and severity of what you are dealing with.",
    id_meaning: "Pahami sifat dan tingkat keparahan dari apa yang sedang Anda hadapi.",
    nl_meaning: "Begrijp de aard en ernst van waar je mee te maken hebt.",
    en_desc: "Once the person has been heard, gently assess the situation. What kind of crisis is this — trauma, panic, grief, burnout collapse, a security incident? Are there immediate physical dangers? Are there others involved? How stable is the person right now? This is not an interrogation — it is informed presence.",
    id_desc: "Setelah orang itu didengar, nilai situasi dengan lembut. Jenis krisis apa ini — trauma, panik, duka, kolaps kelelahan, insiden keamanan? Apakah ada bahaya fisik yang segera? Apakah ada orang lain yang terlibat? Seberapa stabil orang tersebut saat ini? Ini bukan interogasi — ini adalah kehadiran yang terinformasi.",
    nl_desc: "Wanneer de persoon gehoord is, beoordeel de situatie zacht. Wat voor crisis is dit — trauma, paniek, rouw, burnout-instorting, een veiligheidsincident? Zijn er directe fysieke gevaren? Zijn er anderen betrokken? Hoe stabiel is de persoon nu? Dit is geen verhoor — het is geïnformeerde aanwezigheid.",
    en_example: "\"On a scale of 1–10, how safe do you feel right now?\" or \"Is there anyone else affected by what's happened that we need to think about?\"",
    id_example: "\"Dalam skala 1–10, seberapa aman kamu merasa saat ini?\" atau \"Apakah ada orang lain yang terpengaruh oleh apa yang terjadi yang perlu kita pikirkan?\"",
    nl_example: "\"Op een schaal van 1–10, hoe veilig voel je je nu?\" of \"Is er iemand anders die beïnvloed is door wat er is gebeurd waar we aan moeten denken?\"",
    en_avoid: "Don't diagnose or label. Don't assume you know the severity from the surface. Don't jump to action before you have assessed — a rushed response can miss the real need.",
    id_avoid: "Jangan mendiagnosis atau memberi label. Jangan berasumsi bahwa Anda tahu tingkat keparahannya dari permukaan. Jangan langsung bertindak sebelum Anda melakukan penilaian — respons yang terburu-buru dapat melewatkan kebutuhan yang sebenarnya.",
    nl_avoid: "Diagnosticeer of labeler niet. Ga er niet van uit dat je de ernst van het oppervlak kent. Spring niet naar actie voordat je hebt beoordeeld — een overhaaste reactie kan de echte behoefte missen.",
  },
  {
    key: "P",
    color: "oklch(55% 0.16 55)",
    en_title: "Prioritisation",
    id_title: "Prioritas",
    nl_title: "Prioritering",
    en_meaning: "Triage what matters most right now — safety, stability, or connection.",
    id_meaning: "Triase apa yang paling penting saat ini — keamanan, stabilitas, atau koneksi.",
    nl_meaning: "Triage wat nu het meest belangrijk is — veiligheid, stabiliteit of verbinding.",
    en_desc: "Not everything can be addressed at once. With the information from your assessment, triage the immediate needs in order: physical safety first, emotional stability second, practical next steps third. A leader who tries to address everything simultaneously often addresses nothing well. Stay focused on the most urgent need.",
    id_desc: "Tidak semuanya bisa ditangani sekaligus. Dengan informasi dari penilaian Anda, triasikan kebutuhan segera secara berurutan: keamanan fisik pertama, stabilitas emosional kedua, langkah praktis berikutnya ketiga. Seorang pemimpin yang mencoba menangani semuanya secara bersamaan sering kali tidak menangani apa pun dengan baik. Tetap fokus pada kebutuhan yang paling mendesak.",
    nl_desc: "Niet alles kan tegelijk worden aangepakt. Met de informatie uit je beoordeling, triageer de directe behoeften op volgorde: fysieke veiligheid eerst, emotionele stabiliteit tweede, praktische volgende stappen derde. Een leider die alles tegelijkertijd probeert aan te pakken, pakt vaak niets goed aan. Blijf gefocust op de meest urgente behoefte.",
    en_example: "Ask yourself: \"Is this person safe right now? Are they stable enough to talk? What is the one most important thing to address in the next 15 minutes?\"",
    id_example: "Tanyakan pada diri sendiri: \"Apakah orang ini aman sekarang? Apakah mereka cukup stabil untuk berbicara? Apa satu hal terpenting yang harus ditangani dalam 15 menit ke depan?\"",
    nl_example: "Vraag jezelf: \"Is deze persoon nu veilig? Zijn ze stabiel genoeg om te praten? Wat is het ene meest belangrijke ding om in de volgende 15 minuten aan te pakken?\"",
    en_avoid: "Don't try to solve the whole crisis in one conversation. Don't let urgency override clarity. Don't prioritise your discomfort — focus on their need.",
    id_avoid: "Jangan mencoba menyelesaikan seluruh krisis dalam satu percakapan. Jangan biarkan urgensi mengalahkan kejelasan. Jangan memprioritaskan ketidaknyamanan Anda — fokus pada kebutuhan mereka.",
    nl_avoid: "Probeer de hele crisis niet in één gesprek op te lossen. Laat urgentie de helderheid niet overstijgen. Prioriteer je eigen ongemak niet — focus op hun behoefte.",
  },
  {
    key: "I",
    color: "oklch(52% 0.17 20)",
    en_title: "Intervention",
    id_title: "Intervensi",
    nl_title: "Interventie",
    en_meaning: "Offer what is actually needed — practical help, emotional presence, or both.",
    id_meaning: "Tawarkan apa yang sebenarnya dibutuhkan — bantuan praktis, kehadiran emosional, atau keduanya.",
    nl_meaning: "Bied wat er werkelijk nodig is — praktische hulp, emotionele aanwezigheid, of beide.",
    en_desc: "Intervention is both practical and relational. Sometimes the person needs logistics: a safe place, water, food, a phone call made on their behalf. Sometimes they need you to stay and not fix anything. Sometimes both. The wise first responder does not default to one mode — they read the situation and respond to the actual need, not the need that is most comfortable to meet.",
    id_desc: "Intervensi bersifat praktis dan relasional. Kadang orang tersebut membutuhkan logistik: tempat yang aman, air, makanan, telepon yang dilakukan atas nama mereka. Kadang mereka membutuhkan Anda untuk tetap tinggal dan tidak memperbaiki apa pun. Kadang keduanya. Penolong pertama yang bijak tidak default ke satu mode — mereka membaca situasi dan merespons kebutuhan aktual, bukan kebutuhan yang paling nyaman untuk dipenuhi.",
    nl_desc: "Interventie is zowel praktisch als relationeel. Soms heeft de persoon logistiek nodig: een veilige plek, water, eten, een telefoontje namens hen. Soms hebben ze je nodig om te blijven en niets te repareren. Soms beide. De wijze eerste hulpverlener schiet niet in één modus — ze lezen de situatie en reageren op de werkelijke behoefte, niet de behoefte die het meest comfortabel is om te vervullen.",
    en_example: "Practical: \"Let me find you somewhere quiet to sit. Can I get you some water?\" Emotional: \"I'm not going anywhere. I'm here with you.\" Both matter equally.",
    id_example: "Praktis: \"Biarkan aku mencari tempat yang tenang untuk kamu duduk. Bolehkah aku ambilkan air?\" Emosional: \"Aku tidak akan pergi kemana-mana. Aku di sini bersamamu.\" Keduanya sama pentingnya.",
    nl_example: "Praktisch: \"Laat me een rustige plek voor je vinden. Kan ik water voor je halen?\" Emotioneel: \"Ik ga nergens heen. Ik ben hier bij je.\" Beide zijn even belangrijk.",
    en_avoid: "Don't overwhelm with options. Don't jump to theology or prayer before they feel safe. Don't mistake activity for support — presence is often the intervention.",
    id_avoid: "Jangan membanjiri dengan pilihan. Jangan langsung ke teologi atau doa sebelum mereka merasa aman. Jangan mengacaukan aktivitas dengan dukungan — kehadiran sering kali adalah intervensinya.",
    nl_avoid: "Overweldig niet met opties. Spring niet naar theologie of gebed voordat ze zich veilig voelen. Verwar activiteit niet met steun — aanwezigheid is vaak de interventie.",
  },
  {
    key: "D",
    color: "oklch(40% 0.12 295)",
    en_title: "Disposition",
    id_title: "Disposisi",
    nl_title: "Doorverwijzing",
    en_meaning: "Who else needs to be involved? When does your role end?",
    id_meaning: "Siapa lagi yang perlu dilibatkan? Kapan peran Anda berakhir?",
    nl_meaning: "Wie moet er verder bij betrokken worden? Wanneer eindigt jouw rol?",
    en_desc: "Disposition is the handover — the wise decision about what happens next. Does this person need professional care? Does someone else in leadership need to be informed? Does the team need to be protected, briefed, or reassigned? The first responder's job is not to manage the entire situation indefinitely — it is to stabilise, connect, and hand off appropriately. Knowing when to stop is as important as knowing how to start.",
    id_desc: "Disposisi adalah serah terima — keputusan bijak tentang apa yang terjadi selanjutnya. Apakah orang ini membutuhkan perawatan profesional? Apakah orang lain dalam kepemimpinan perlu diberi tahu? Apakah tim perlu dilindungi, dibriefing, atau dipindahtugaskan? Pekerjaan penolong pertama bukan untuk mengelola seluruh situasi tanpa batas — melainkan untuk menstabilkan, menghubungkan, dan menyerahkan dengan tepat. Mengetahui kapan harus berhenti sama pentingnya dengan mengetahui cara memulai.",
    nl_desc: "Doorverwijzing is de overdracht — de wijze beslissing over wat er daarna gebeurt. Heeft deze persoon professionele zorg nodig? Moet iemand anders in leiderschap geïnformeerd worden? Moet het team beschermd, gebrieft of herverdeeld worden? De taak van de eerste hulpverlener is niet om de hele situatie onbepaald te beheren — het is om te stabiliseren, verbinden en correct over te dragen. Weten wanneer te stoppen is even belangrijk als weten hoe te beginnen.",
    en_example: "\"I've heard you and I'm with you. I want to make sure you get the right support. Can I help connect you with [counsellor/doctor/supervisor]?\" Then follow through.",
    id_example: "\"Aku telah mendengarmu dan aku bersamamu. Aku ingin memastikan kamu mendapat dukungan yang tepat. Bolehkah aku membantu menghubungkanmu dengan [konselor/dokter/supervisor]?\" Kemudian tindak lanjuti.",
    nl_example: "\"Ik heb je gehoord en ik ben bij je. Ik wil er zeker van zijn dat je de juiste ondersteuning krijgt. Kan ik je helpen verbinding te maken met [counselor/arts/leidinggevende]?\" Volg dan op.",
    en_avoid: "Don't disappear after the initial response. Don't over-commit to ongoing care if you are not equipped for it. Don't skip the handoff — leaving someone without a next step is not care, it is abandonment.",
    id_avoid: "Jangan menghilang setelah respons awal. Jangan terlalu berkomitmen pada perawatan berkelanjutan jika Anda tidak siap untuk itu. Jangan melewatkan serah terima — meninggalkan seseorang tanpa langkah selanjutnya bukan perawatan, itu penelantaran.",
    nl_avoid: "Verdwijn niet na de eerste reactie. Verbind je niet te veel aan doorlopende zorg als je er niet voor uitgerust bent. Sla de overdracht niet over — iemand zonder volgende stap achterlaten is geen zorg, het is verwaarlozing.",
  },
];

// ── CULTURAL CONSIDERATIONS DATA ──────────────────────────────────────────────
const CULTURAL_NOTES: {
  key: string;
  icon: string;
  en_title: string; id_title: string; nl_title: string;
  en_body: string; id_body: string; nl_body: string;
  en_practical: string; id_practical: string; nl_practical: string;
}[] = [
  {
    key: "face",
    icon: "🎭",
    en_title: "High-Context: Let Them Save Face",
    id_title: "Konteks Tinggi: Biarkan Mereka Menjaga Muka",
    nl_title: "Hoge Context: Laat Gezicht Bewaren",
    en_body: "In many Asian and Middle Eastern cultures, expressing distress or need in a group setting is deeply shaming. A person in crisis may minimise what they are experiencing precisely because they are ashamed to be seen struggling. Direct questions like 'Are you okay?' in front of others can shut down disclosure entirely.",
    id_body: "Dalam banyak budaya Asia dan Timur Tengah, mengungkapkan tekanan atau kebutuhan dalam lingkungan kelompok sangat memalukan. Seseorang yang berada dalam krisis mungkin meminimalkan apa yang mereka alami justru karena mereka malu terlihat sedang berjuang. Pertanyaan langsung seperti 'Apakah kamu baik-baik saja?' di depan orang lain dapat menutup pengungkapan sepenuhnya.",
    nl_body: "In veel Aziatische en Midden-Oosterse culturen is het uitdrukken van nood of behoefte in een groepssetting diep beschamend. Iemand in crisis kan minimaliseren wat ze ervaren juist omdat ze zich schamen om gezien te worden worstelen. Directe vragen zoals 'Gaat het goed?' voor anderen kunnen openbaring volledig afsluiten.",
    en_practical: "Move to a private space first. Use indirect language: 'You seem like you're carrying something heavy today.' Allow them to define the pace of disclosure.",
    id_practical: "Pindah ke ruang pribadi terlebih dahulu. Gunakan bahasa tidak langsung: 'Kamu sepertinya sedang menanggung sesuatu yang berat hari ini.' Biarkan mereka menentukan kecepatan pengungkapan.",
    nl_practical: "Ga eerst naar een privéruimte. Gebruik indirecte taal: 'Je lijkt vandaag iets zwaar te dragen.' Laat hen het tempo van de openbaring bepalen.",
  },
  {
    key: "collective",
    icon: "🤝",
    en_title: "Collective Cultures: Involve the Community",
    id_title: "Budaya Kolektif: Libatkan Komunitas",
    nl_title: "Collectieve Culturen: Betrek de Gemeenschap",
    en_body: "In collectivist cultures — most of Sub-Saharan Africa, Southeast Asia, and Latin America — a person does not experience crisis alone. The family, the team, the community are all part of what is happening. Western-style individual crisis counselling can feel isolating or even dishonouring. Recovery often happens in and through community, not apart from it.",
    id_body: "Dalam budaya kolektivis — sebagian besar Afrika Sub-Sahara, Asia Tenggara, dan Amerika Latin — seseorang tidak mengalami krisis sendirian. Keluarga, tim, komunitas semuanya merupakan bagian dari apa yang terjadi. Konseling krisis individual gaya Barat dapat terasa mengisolasi atau bahkan tidak menghormati. Pemulihan sering terjadi di dalam dan melalui komunitas, bukan terpisah dari komunitas.",
    nl_body: "In collectivistische culturen — het grootste deel van Sub-Sahara Afrika, Zuidoost-Azië en Latijns-Amerika — ervaart iemand geen crisis alleen. De familie, het team, de gemeenschap zijn allemaal deel van wat er gebeurt. Individuele crisisbegeleiding in Westerse stijl kan isolerend of zelfs onterend aanvoelen. Herstel gebeurt vaak in en door de gemeenschap, niet los ervan.",
    en_practical: "Ask: 'Who are the people you trust most right now? Who would you want present?' Consider whether a trusted elder or community figure should be involved in the response.",
    id_practical: "Tanyakan: 'Siapa orang-orang yang paling kamu percaya saat ini? Siapa yang ingin kamu hadirkan?' Pertimbangkan apakah sesepuh atau tokoh komunitas yang dipercaya harus dilibatkan dalam respons.",
    nl_practical: "Vraag: 'Wie zijn de mensen die je nu het meest vertrouwt? Wie zou je erbij willen hebben?' Overweeg of een vertrouwde oudste of gemeenschapsfiguur betrokken moet worden bij de respons.",
  },
  {
    key: "stoic",
    icon: "🧱",
    en_title: "Stoic Cultures: Watch for Delayed Reaction",
    id_title: "Budaya Stoik: Waspadai Reaksi Tertunda",
    nl_title: "Stoïsche Culturen: Let op Vertraagde Reactie",
    en_body: "In Northern European, Germanic, and some East Asian cultures, emotional restraint under pressure is a sign of strength and competence. A person from these cultures may appear completely composed after a traumatic event — not because they are fine, but because composure is expected. The delayed reaction often comes days or weeks later, sometimes harder than the original event.",
    id_body: "Dalam budaya Eropa Utara, Jerman, dan beberapa budaya Asia Timur, menahan emosi di bawah tekanan adalah tanda kekuatan dan kompetensi. Seseorang dari budaya ini mungkin tampak sangat tenang setelah peristiwa traumatis — bukan karena mereka baik-baik saja, tetapi karena ketenangan diharapkan. Reaksi tertunda sering datang berhari-hari atau berminggu-minggu kemudian, kadang lebih keras dari peristiwa aslinya.",
    nl_body: "In Noord-Europese, Germaanse en sommige Oost-Aziatische culturen is emotionele terughoudendheid onder druk een teken van kracht en competentie. Iemand uit deze culturen kan volkomen kalm lijken na een traumatische gebeurtenis — niet omdat ze het goed stellen, maar omdat kalmte verwacht wordt. De vertraagde reactie komt vaak dagen of weken later, soms zwaarder dan de oorspronkelijke gebeurtenis.",
    en_practical: "Don't conclude that 'they're fine' because they appear calm. Check in at 48 hours and again at two weeks. Create structured moments: 'I want to check in with you about last week — not because I think something is wrong, but because I want to make sure you're supported.'",
    id_practical: "Jangan menyimpulkan bahwa 'mereka baik-baik saja' karena mereka tampak tenang. Periksa pada 48 jam dan lagi pada dua minggu. Buat momen terstruktur: 'Aku ingin memeriksa kabarmu tentang minggu lalu — bukan karena aku pikir ada yang salah, tetapi karena aku ingin memastikan kamu mendapat dukungan.'",
    nl_practical: "Concludeer niet dat 'ze het goed stellen' omdat ze kalm lijken. Check in na 48 uur en opnieuw na twee weken. Maak gestructureerde momenten: 'Ik wil je even spreken over vorige week — niet omdat ik denk dat er iets mis is, maar om zeker te zijn dat je ondersteund wordt.'",
  },
  {
    key: "spiritual",
    icon: "🙏",
    en_title: "Spiritual Frameworks: Honour Without Spiritualising",
    id_title: "Kerangka Spiritual: Menghormati Tanpa Menypiritualkan",
    nl_title: "Spirituele Kaders: Eervolle Aanwezigheid Zonder Spiritualiseren",
    en_body: "In many cultures — including much of the Global South — spiritual frameworks are central to how people make sense of crisis. The person may interpret what happened through a spiritual lens: divine punishment, spiritual attack, ancestral influence, or a testing of faith. These frameworks are not obstacles to care; they are the meaning-making system you are working within. Dismissing them, even subtly, will shut down trust.",
    id_body: "Dalam banyak budaya — termasuk sebagian besar Global Selatan — kerangka spiritual adalah pusat dari bagaimana orang memahami krisis. Orang tersebut mungkin menafsirkan apa yang terjadi melalui lensa spiritual: hukuman ilahi, serangan spiritual, pengaruh leluhur, atau ujian iman. Kerangka-kerangka ini bukan hambatan untuk perawatan; mereka adalah sistem pembuat makna yang Anda kerjakan. Mengabaikan mereka, bahkan secara halus, akan menutup kepercayaan.",
    nl_body: "In veel culturen — inclusief een groot deel van het Mondiale Zuiden — zijn spirituele kaders centraal in hoe mensen crisis begrijpen. De persoon kan interpreteren wat er is gebeurd door een spirituele lens: goddelijke straf, spirituele aanval, invloed van voorouders, of een beproeving van geloof. Deze kaders zijn geen obstakels voor zorg; ze zijn het betekenisgevingssysteem waarbinnen je werkt. Ze afwijzen, zelfs subtiel, zal vertrouwen afsluiten.",
    en_practical: "Ask: 'How are you making sense of what happened spiritually?' Listen without correcting. If prayer is appropriate, offer it — but only after they have been heard, not as a substitute for presence.",
    id_practical: "Tanyakan: 'Bagaimana kamu memahami apa yang terjadi secara spiritual?' Dengarkan tanpa mengoreksi. Jika doa sesuai, tawarkan — tetapi hanya setelah mereka didengar, bukan sebagai pengganti kehadiran.",
    nl_practical: "Vraag: 'Hoe geef je spiritueel betekenis aan wat er is gebeurd?' Luister zonder te corrigeren. Als gebed passend is, bied het aan — maar alleen nadat ze zijn gehoord, niet als vervanging voor aanwezigheid.",
  },
];

// ── "YOUR ROLE ENDS WHEN" — BOUNDARY MARKERS ─────────────────────────────────
const BOUNDARY_ITEMS: {
  key: string;
  en_signal: string; id_signal: string; nl_signal: string;
  en_action: string; id_action: string; nl_action: string;
}[] = [
  {
    key: "professional",
    en_signal: "The person shows signs of clinical trauma, depression, or suicidality.",
    id_signal: "Orang tersebut menunjukkan tanda-tanda trauma klinis, depresi, atau keinginan bunuh diri.",
    nl_signal: "De persoon toont tekenen van klinisch trauma, depressie of suïcidaliteit.",
    en_action: "Your role is to stay present and connect them — without delay — to a mental health professional. Do not attempt to counsel this yourself.",
    id_action: "Peran Anda adalah tetap hadir dan menghubungkan mereka — tanpa penundaan — ke profesional kesehatan mental. Jangan mencoba menangani ini sendiri.",
    nl_action: "Jouw rol is aanwezig te blijven en hen — zonder vertraging — te verbinden met een geestelijk gezondheidsprofessional. Probeer dit niet zelf te counselen.",
  },
  {
    key: "ongoing",
    en_signal: "The same person repeatedly returns to you with the same crisis over months.",
    id_signal: "Orang yang sama berulang kali datang kepada Anda dengan krisis yang sama selama berbulan-bulan.",
    nl_signal: "Dezelfde persoon keert herhaaldelijk terug met dezelfde crisis over meerdere maanden.",
    en_action: "This is a sign of an unmet clinical or systemic need. Escalate with compassion. Your continued availability may be preventing them from getting structured help.",
    id_action: "Ini adalah tanda kebutuhan klinis atau sistemik yang tidak terpenuhi. Eskalasi dengan belas kasihan. Ketersediaan Anda yang terus-menerus mungkin mencegah mereka mendapatkan bantuan terstruktur.",
    nl_action: "Dit is een teken van een niet-vervulde klinische of systemische behoefte. Escaleer met mededogen. Jouw voortdurende beschikbaarheid kan hen ervan weerhouden gestructureerde hulp te krijgen.",
  },
  {
    key: "yourself",
    en_signal: "You notice you are absorbing the crisis yourself — losing sleep, feeling responsible, unable to switch off.",
    id_signal: "Anda melihat bahwa Anda menyerap krisis itu sendiri — kehilangan tidur, merasa bertanggung jawab, tidak bisa berhenti memikirkannya.",
    nl_signal: "Je merkt dat je de crisis zelf absorbeert — slaap verliest, je verantwoordelijk voelt, niet kunt loskomen.",
    en_action: "This is vicarious trauma. Name it. Seek supervision or peer support. You cannot pour from an empty vessel — and a burnt-out first responder helps no one.",
    id_action: "Ini adalah trauma vikarius. Namai itu. Cari supervisi atau dukungan teman sejawat. Anda tidak bisa menuangkan dari bejana yang kosong — dan penolong pertama yang kelelahan tidak membantu siapa pun.",
    nl_action: "Dit is plaatsvervangend trauma. Benoem het. Zoek supervisie of peer-ondersteuning. Je kunt niet gieten uit een leeg vat — en een uitgebrande eerste hulpverlener helpt niemand.",
  },
  {
    key: "safety",
    en_signal: "The situation involves legal, safeguarding, or organisational risk.",
    id_signal: "Situasi melibatkan risiko hukum, perlindungan, atau organisasi.",
    nl_signal: "De situatie omvat juridisch, beschermings- of organisatorisch risico.",
    en_action: "Stop. Do not handle this alone. Report to the appropriate authority or safeguarding lead. Well-meaning first responders who over-reach can inadvertently cause harm or compromise an official process.",
    id_action: "Berhenti. Jangan tangani ini sendirian. Laporkan ke otoritas yang tepat atau pemimpin perlindungan. Penolong pertama yang bermaksud baik yang melampaui batas dapat secara tidak sengaja menyebabkan kerugian atau mengkompromikan proses resmi.",
    nl_action: "Stop. Handel dit niet alleen af. Rapporteer aan de bevoegde autoriteit of beschermingsleider. Goedbedoelende eerste hulpverleners die te ver gaan kunnen onbedoeld schade veroorzaken of een officieel proces ondermijnen.",
  },
];

// ── PROPS ─────────────────────────────────────────────────────────────────────
type Props = { userPathway: string | null; isSaved: boolean };

export default function PsychologicalFirstAidClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  const [selectedStep, setSelectedStep] = useState<RapidKey | null>(null);
  const [openCultural, setOpenCultural] = useState<string | null>(null);
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      const result = await saveResourceToDashboard("psychological-first-aid");
      if (!result.error) setSaved(true);
    });
  }

  const selectedRapid = RAPID_STEPS.find(s => s.key === selectedStep);
  const verseData = activeVerse ? VERSES[activeVerse as keyof typeof VERSES] : null;

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", color: bodyText, background: offWhite }}>
      <LangToggle />

      {/* LANGUAGE TOGGLE */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: navy, padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "oklch(75% 0.04 260)", textTransform: "uppercase" }}>
          {t("Resilience & Care", "Ketahanan & Kepedulian", "Weerbaarheid & Zorg", lang)}
        </span>
      </div>

      {/* HERO */}
      <section style={{ background: navy, padding: "80px 24px 64px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 60% 0%, oklch(32% 0.12 260 / 0.5) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: orange, marginBottom: 20 }}>
            {t("Team & Facilitation · Guide", "Tim & Fasilitasi · Panduan", "Team & Facilitatie · Gids", lang)}
          </p>
          <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, color: offWhite, lineHeight: 1.1, marginBottom: 20 }}>
            {t("When crisis hits, leaders are often first on the scene.", "Ketika krisis terjadi, pemimpin sering pertama di tempat kejadian.", "Als er een crisis is, zijn leiders vaak de eersten ter plaatse.", lang)}
          </h1>
          <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(82% 0.03 80)", lineHeight: 1.65, fontStyle: "italic", marginBottom: 32, maxWidth: 580, margin: "0 auto 32px" }}>
            {t(
              "Are you ready? Psychological First Aid is not therapy — it is the wise, present, compassionate response of a trained leader in the first moments of crisis.",
              "Apakah Anda siap? Pertolongan Pertama Psikologis bukan terapi — ini adalah respons yang bijak, hadir, dan penuh belas kasihan dari seorang pemimpin terlatih di momen-momen pertama krisis.",
              "Ben je er klaar voor? Psychologische Eerste Hulp is geen therapie — het is de wijze, aanwezige, meelevende reactie van een getrainde leider in de eerste momenten van een crisis.",
              lang
            )}
          </p>
          {/* Opening verse */}
          <div style={{ background: "oklch(30% 0.10 260 / 0.6)", borderRadius: 12, padding: "24px 28px", maxWidth: 560, margin: "0 auto" }}>
            <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 18, color: "oklch(88% 0.04 80)", lineHeight: 1.7, fontStyle: "italic", marginBottom: 10 }}>
              "{lang === "en" ? VERSES["2cor-1-4"].en : lang === "id" ? VERSES["2cor-1-4"].id : VERSES["2cor-1-4"].nl}"
            </p>
            <button
              onClick={() => setActiveVerse("2cor-1-4")}
              style={{ background: "none", border: "none", cursor: "pointer", color: orange, fontWeight: 700, fontSize: 12, letterSpacing: "0.10em", textDecoration: "underline dotted" }}
            >
              — {lang === "en" ? VERSES["2cor-1-4"].ref : lang === "id" ? VERSES["2cor-1-4"].ref_id : VERSES["2cor-1-4"].ref_nl}
            </button>
          </div>
        </div>
      </section>

      {/* WHAT PFA IS NOT */}
      <section style={{ background: "oklch(96% 0.004 80)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: orange, marginBottom: 12, textAlign: "center" }}>
            {t("First — Clarity", "Pertama — Kejelasan", "Eerst — Helderheid", lang)}
          </p>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 800, color: navy, textAlign: "center", marginBottom: 12 }}>
            {t("What PFA is NOT", "Apa yang BUKAN PFA", "Wat PEH NIET is", lang)}
          </h2>
          <p style={{ textAlign: "center", fontSize: 15, color: bodyText, lineHeight: 1.65, maxWidth: 560, margin: "0 auto 48px" }}>
            {t(
              "Clarity about what you are not doing is as important as knowing what you are doing.",
              "Kejelasan tentang apa yang tidak Anda lakukan sama pentingnya dengan mengetahui apa yang Anda lakukan.",
              "Helderheid over wat je niet doet is net zo belangrijk als weten wat je wel doet.",
              lang
            )}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {[
              {
                icon: "🚫",
                en_label: "Not Therapy",
                id_label: "Bukan Terapi",
                nl_label: "Geen Therapie",
                en_body: "PFA does not diagnose, treat, or provide ongoing psychological care. It is first contact — not long-term intervention. You are not the counsellor; you are the one who stabilises and connects.",
                id_body: "PFA tidak mendiagnosis, mengobati, atau memberikan perawatan psikologis yang berkelanjutan. Ini adalah kontak pertama — bukan intervensi jangka panjang. Anda bukan konselor; Anda adalah orang yang menstabilkan dan menghubungkan.",
                nl_body: "PEH diagnosticeert niet, behandelt niet, en biedt geen doorlopende psychologische zorg. Het is eerste contact — geen langdurige interventie. Jij bent niet de counselor; jij bent degene die stabiliseert en verbindt.",
              },
              {
                icon: "🔧",
                en_label: "Not Fixing",
                id_label: "Bukan Memperbaiki",
                nl_label: "Geen Reparatie",
                en_body: "The crisis may not be resolvable in this conversation. Your job is not to make the pain go away or solve the underlying problem. Trying to fix too quickly often invalidates what the person is experiencing.",
                id_body: "Krisis mungkin tidak dapat diselesaikan dalam percakapan ini. Tugas Anda bukan untuk menghilangkan rasa sakit atau menyelesaikan masalah mendasar. Mencoba memperbaiki terlalu cepat sering kali meremehkan apa yang dialami orang tersebut.",
                nl_body: "De crisis is misschien niet oplosbaar in dit gesprek. Jouw taak is niet om de pijn weg te laten gaan of het onderliggende probleem op te lossen. Te snel proberen te repareren invalideert vaak wat de persoon ervaart.",
              },
              {
                icon: "📉",
                en_label: "Not Minimising",
                id_label: "Bukan Meminimalkan",
                nl_label: "Geen Minimalisering",
                en_body: "Phrases like 'At least...' or 'Others have it worse...' or 'God has a plan' — even when true — shut people down rather than opening them up. PFA begins with the full weight of what someone is carrying, not a reframe.",
                id_body: "Frasa seperti 'Setidaknya...' atau 'Orang lain lebih menderita...' atau 'Tuhan punya rencana' — bahkan ketika benar — menutup orang daripada membukanya. PFA dimulai dengan beban penuh dari apa yang ditanggung seseorang, bukan dengan reframing.",
                nl_body: "Zinnen als 'Tenminste...' of 'Anderen hebben het erger...' of 'God heeft een plan' — zelfs wanneer waar — sluiten mensen af in plaats van hen te openen. PEH begint met het volle gewicht van wat iemand draagt, niet met een herkadering.",
              },
              {
                icon: "✅",
                en_label: "What It IS",
                id_label: "Apa yang ITU ADALAH",
                nl_label: "Wat het WEL is",
                en_body: "Calm, compassionate presence. Practical orientation. Immediate safety. Emotional acknowledgement. Smart referral. Leaders who can do this well are not replacing professionals — they are the difference between a crisis escalating or being contained.",
                id_body: "Kehadiran yang tenang dan penuh belas kasihan. Orientasi praktis. Keamanan segera. Pengakuan emosional. Rujukan yang cerdas. Pemimpin yang dapat melakukan ini dengan baik tidak menggantikan profesional — mereka adalah perbedaan antara krisis yang meningkat atau terkendali.",
                nl_body: "Kalme, meelevende aanwezigheid. Praktische oriëntatie. Onmiddellijke veiligheid. Emotionele erkenning. Slimme doorverwijzing. Leiders die dit goed kunnen doen vervangen geen professionals — ze zijn het verschil tussen een crisis die escaleert of ingedamd wordt.",
              },
            ].map((item, i) => (
              <div key={i} style={{ background: "white", borderRadius: 14, padding: "28px 24px", border: "1.5px solid oklch(88% 0.008 260)" }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{item.icon}</div>
                <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 16, color: navy, marginBottom: 10 }}>
                  {t(item.en_label, item.id_label, item.nl_label, lang)}
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: bodyText, margin: 0 }}>
                  {t(item.en_body, item.id_body, item.nl_body, lang)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE RAPID MODEL */}
      <section style={{ background: offWhite, padding: "72px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: orange, marginBottom: 12, textAlign: "center" }}>
            {t("The Framework", "Kerangka Kerja", "Het Kader", lang)}
          </p>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 800, color: navy, textAlign: "center", marginBottom: 12 }}>
            {t("The RAPID Model", "Model RAPID", "Het RAPID-model", lang)}
          </h2>
          <p style={{ textAlign: "center", fontSize: 15, color: bodyText, lineHeight: 1.65, maxWidth: 560, margin: "0 auto 48px" }}>
            {t(
              "Five steps for structured, compassionate crisis response. Select each step to explore it fully.",
              "Lima langkah untuk respons krisis yang terstruktur dan penuh belas kasihan. Pilih setiap langkah untuk menjelajahinya sepenuhnya.",
              "Vijf stappen voor een gestructureerde, meelevende crisisrespons. Selecteer elke stap om hem volledig te verkennen.",
              lang
            )}
          </p>

          {/* Step selector */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 40, flexWrap: "wrap" }}>
            {RAPID_STEPS.map(step => {
              const isSelected = selectedStep === step.key;
              return (
                <button
                  key={step.key}
                  onClick={() => setSelectedStep(isSelected ? null : step.key)}
                  style={{
                    width: 72, height: 72, borderRadius: "50%",
                    border: `3px solid ${step.color}`,
                    background: isSelected ? step.color : "white",
                    cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                    boxShadow: isSelected ? `0 4px 16px ${step.color}40` : "none",
                    gap: 2,
                  }}
                >
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: 22, color: isSelected ? "white" : step.color, lineHeight: 1 }}>
                    {step.key}
                  </span>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.04em", color: isSelected ? "rgba(255,255,255,0.85)" : step.color, textAlign: "center", lineHeight: 1.2, maxWidth: 60 }}>
                    {t(
                      step.en_title.split(" ")[0],
                      step.id_title.split(" ")[0],
                      step.nl_title.split(" ")[0],
                      lang
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Step detail */}
          {selectedRapid && (
            <div style={{ background: "white", borderRadius: 16, border: `2px solid ${selectedRapid.color}30`, overflow: "hidden", animation: "fadeIn 0.3s ease" }}>
              <div style={{ background: selectedRapid.color, padding: "28px 36px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: 48, color: "rgba(255,255,255,0.25)", lineHeight: 1 }}>
                    {selectedRapid.key}
                  </span>
                  <div>
                    <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 22, color: "white", marginBottom: 4 }}>
                      {t(selectedRapid.en_title, selectedRapid.id_title, selectedRapid.nl_title, lang)}
                    </h3>
                    <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 17, color: "rgba(255,255,255,0.85)", fontStyle: "italic", margin: 0 }}>
                      {t(selectedRapid.en_meaning, selectedRapid.id_meaning, selectedRapid.nl_meaning, lang)}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ padding: "36px 36px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 28 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: selectedRapid.color, marginBottom: 10 }}>
                    {t("What this means in practice", "Apa artinya dalam praktik", "Wat dit betekent in de praktijk", lang)}
                  </p>
                  <p style={{ fontSize: 15, lineHeight: 1.75, color: bodyText, margin: 0 }}>
                    {t(selectedRapid.en_desc, selectedRapid.id_desc, selectedRapid.nl_desc, lang)}
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ background: `${selectedRapid.color}10`, borderRadius: 10, padding: "20px 22px" }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: selectedRapid.color, marginBottom: 10 }}>
                      {t("Example", "Contoh", "Voorbeeld", lang)}
                    </p>
                    <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 16, lineHeight: 1.7, color: navy, fontStyle: "italic", margin: 0 }}>
                      {t(selectedRapid.en_example, selectedRapid.id_example, selectedRapid.nl_example, lang)}
                    </p>
                  </div>

                  <div style={{ background: "oklch(97% 0.004 25)", borderRadius: 10, padding: "20px 22px", border: "1px solid oklch(88% 0.008 260)" }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(52% 0.18 25)", marginBottom: 10 }}>
                      {t("Common mistake — avoid this", "Kesalahan umum — hindari ini", "Veelgemaakte fout — vermijd dit", lang)}
                    </p>
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: bodyText, margin: 0 }}>
                      {t(selectedRapid.en_avoid, selectedRapid.id_avoid, selectedRapid.nl_avoid, lang)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!selectedStep && (
            <div style={{ background: "oklch(94% 0.006 260)", borderRadius: 12, padding: "32px 36px", textAlign: "center" }}>
              <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 20, color: navy, fontStyle: "italic", lineHeight: 1.6, margin: 0 }}>
                {t(
                  "Select a step above to explore what it looks like, how to apply it, and what to avoid.",
                  "Pilih langkah di atas untuk menjelajahi seperti apa tampilannya, bagaimana menerapkannya, dan apa yang harus dihindari.",
                  "Selecteer een stap hierboven om te verkennen hoe het eruitziet, hoe je het toepast, en wat je moet vermijden.",
                  lang
                )}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CULTURAL CONSIDERATIONS */}
      <section style={{ background: "oklch(96% 0.004 80)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: orange, marginBottom: 12, textAlign: "center" }}>
            {t("Cross-Cultural Dimension", "Dimensi Lintas Budaya", "Interculturele Dimensie", lang)}
          </p>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 800, color: navy, textAlign: "center", marginBottom: 12 }}>
            {t("Crisis Looks Different Across Cultures", "Krisis Terlihat Berbeda di Berbagai Budaya", "Crisis Ziet Er Anders Uit Tussen Culturen", lang)}
          </h2>
          <p style={{ textAlign: "center", fontSize: 15, color: bodyText, lineHeight: 1.65, maxWidth: 580, margin: "0 auto 48px" }}>
            {t(
              "Your default approach to crisis support is shaped by your culture. Before you respond, understand who you are responding to.",
              "Pendekatan default Anda terhadap dukungan krisis dibentuk oleh budaya Anda. Sebelum Anda merespons, pahami siapa yang Anda respons.",
              "Jouw standaardbenadering voor crisisondersteuning wordt gevormd door je cultuur. Voordat je reageert, begrijp wie je aan het reageren bent.",
              lang
            )}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {CULTURAL_NOTES.map(note => {
              const isOpen = openCultural === note.key;
              return (
                <div key={note.key} style={{ background: "white", borderRadius: 14, overflow: "hidden", border: `1.5px solid ${isOpen ? orange : "oklch(88% 0.008 260)"}`, transition: "border-color 0.2s" }}>
                  <button
                    onClick={() => setOpenCultural(isOpen ? null : note.key)}
                    style={{ width: "100%", textAlign: "left", padding: "22px 28px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 16 }}
                  >
                    <span style={{ fontSize: 28, flexShrink: 0 }}>{note.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 17, color: isOpen ? orange : navy }}>
                        {t(note.en_title, note.id_title, note.nl_title, lang)}
                      </div>
                    </div>
                    <span style={{ fontSize: 20, color: orange, fontWeight: 300, transform: isOpen ? "rotate(45deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>+</span>
                  </button>

                  {isOpen && (
                    <div style={{ padding: "0 28px 28px" }}>
                      <p style={{ fontSize: 15, lineHeight: 1.75, color: bodyText, marginBottom: 20 }}>
                        {t(note.en_body, note.id_body, note.nl_body, lang)}
                      </p>
                      <div style={{ background: `${orange}10`, borderRadius: 10, padding: "18px 22px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                        <span style={{ fontSize: 18, flexShrink: 0 }}>→</span>
                        <div>
                          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: orange, marginBottom: 6 }}>
                            {t("In practice", "Dalam praktik", "In de praktijk", lang)}
                          </p>
                          <p style={{ fontSize: 14, lineHeight: 1.65, color: bodyText, margin: 0 }}>
                            {t(note.en_practical, note.id_practical, note.nl_practical, lang)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BIBLICAL ANCHOR */}
      <section style={{ background: navy, padding: "80px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: orange, marginBottom: 16, textAlign: "center" }}>
            {t("Biblical Foundation", "Dasar Alkitab", "Bijbelse Grondslag", lang)}
          </p>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 800, color: offWhite, textAlign: "center", marginBottom: 48 }}>
            {t("Comforted so we can comfort", "Dihibur agar kita dapat menghibur", "Getroost om te kunnen troosten", lang)}
          </h2>

          {/* 2 Corinthians 1:4 */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ background: "oklch(28% 0.10 260)", borderRadius: 12, padding: "32px 36px", marginBottom: 24 }}>
              <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 22, color: "oklch(88% 0.04 80)", lineHeight: 1.7, fontStyle: "italic", marginBottom: 14 }}>
                "{lang === "en" ? VERSES["2cor-1-4"].en : lang === "id" ? VERSES["2cor-1-4"].id : VERSES["2cor-1-4"].nl}"
              </p>
              <button
                onClick={() => setActiveVerse("2cor-1-4")}
                style={{ background: "none", border: "none", cursor: "pointer", color: orange, fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", textDecoration: "underline dotted" }}
              >
                {lang === "id" ? VERSES["2cor-1-4"].ref_id : lang === "nl" ? VERSES["2cor-1-4"].ref_nl : VERSES["2cor-1-4"].ref}
              </button>
            </div>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "oklch(78% 0.03 80)" }}>
              {t(
                "This is not a passive verse. It is a theology of transformation through suffering. The comfort God gives us does not insulate us from the pain of others — it equips us to enter it. Leaders who have walked through their own hard seasons are not disqualified from leading others through theirs. They are prepared for it. Your own story of difficulty is not a liability in crisis response — it is the source of your credibility and compassion.",
                "Ini bukan ayat yang pasif. Ini adalah teologi transformasi melalui penderitaan. Penghiburan yang Tuhan berikan kepada kita tidak mengisolasi kita dari rasa sakit orang lain — tetapi mempersiapkan kita untuk memasukinya. Pemimpin yang telah melalui musim-musim sulit mereka sendiri tidak didiskualifikasi dari memimpin orang lain melalui musim mereka. Mereka dipersiapkan untuk itu. Kisah kesulitan Anda sendiri bukan sebuah kelemahan dalam respons krisis — itu adalah sumber kredibilitas dan belas kasihan Anda.",
                "Dit is geen passief vers. Het is een theologie van transformatie door lijden. De troost die God ons geeft isoleert ons niet van de pijn van anderen — het rust ons uit om er in te gaan. Leiders die door hun eigen moeilijke seizoenen zijn gegaan, worden niet gediskwalificeerd van het leiden van anderen door de hunne. Ze zijn ervoor voorbereid. Jouw eigen verhaal van moeilijkheid is geen aansprakelijkheid in crisisrespons — het is de bron van jouw geloofwaardigheid en mededogen.",
                lang
              )}
            </p>
          </div>

          {/* Good Samaritan */}
          <div>
            <div style={{ background: "oklch(28% 0.10 260)", borderRadius: 12, padding: "32px 36px", marginBottom: 24 }}>
              <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 22, color: "oklch(88% 0.04 80)", lineHeight: 1.7, fontStyle: "italic", marginBottom: 14 }}>
                "{lang === "en" ? VERSES["luke-10-33"].en : lang === "id" ? VERSES["luke-10-33"].id : VERSES["luke-10-33"].nl}"
              </p>
              <button
                onClick={() => setActiveVerse("luke-10-33")}
                style={{ background: "none", border: "none", cursor: "pointer", color: orange, fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", textDecoration: "underline dotted" }}
              >
                {lang === "id" ? VERSES["luke-10-33"].ref_id : lang === "nl" ? VERSES["luke-10-33"].ref_nl : VERSES["luke-10-33"].ref}
              </button>
            </div>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "oklch(78% 0.03 80)" }}>
              {t(
                "The Samaritan did not stop to assess his qualifications. He saw someone in need and he moved — practically and immediately. He used what he had (oil and wine, bandages), arranged what he could not provide himself (the innkeeper), and funded what he could not stay to deliver. This is the Good Samaritan principle of Psychological First Aid: you cross the road, you tend to the wound, you make sure they are in good hands, and you follow through. You do not walk past. You do not wait for someone more qualified. You act — within your limits — and you call for help when those limits are reached.",
                "Orang Samaria itu tidak berhenti untuk menilai kualifikasinya. Dia melihat seseorang yang membutuhkan dan dia bergerak — secara praktis dan segera. Dia menggunakan apa yang dia miliki (minyak dan anggur, perban), mengatur apa yang tidak bisa dia sediakan sendiri (pemilik penginapan), dan mendanai apa yang tidak bisa dia tinggal untuk memberikan. Ini adalah prinsip Orang Samaria yang Baik dari Pertolongan Pertama Psikologis: Anda menyeberangi jalan, Anda merawat luka, Anda memastikan mereka berada di tangan yang baik, dan Anda menindaklanjuti. Anda tidak berjalan melewati. Anda tidak menunggu seseorang yang lebih berkualitas. Anda bertindak — dalam batas Anda — dan Anda meminta bantuan ketika batas-batas itu tercapai.",
                "De Samaritaan stopte niet om zijn kwalificaties te beoordelen. Hij zag iemand in nood en hij bewoog — praktisch en onmiddellijk. Hij gebruikte wat hij had (olie en wijn, verbanden), regelde wat hij zelf niet kon bieden (de herbergier), en financierde wat hij niet kon blijven leveren. Dit is het Goede Samaritaan-principe van Psychologische Eerste Hulp: je steekt de weg over, je verzorgt de wond, je zorgt ervoor dat ze in goede handen zijn, en je volgt op. Je loopt niet voorbij. Je wacht niet op iemand die meer gekwalificeerd is. Je handelt — binnen je grenzen — en je roept om hulp wanneer die grenzen zijn bereikt.",
                lang
              )}
            </p>
          </div>
        </div>
      </section>

      {/* YOUR ROLE ENDS WHEN */}
      <section style={{ background: offWhite, padding: "72px 24px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: orange, marginBottom: 12, textAlign: "center" }}>
            {t("Knowing Your Limits", "Mengetahui Batas Anda", "Jouw Grenzen Kennen", lang)}
          </p>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 800, color: navy, textAlign: "center", marginBottom: 12 }}>
            {t("Your role ends when...", "Peran Anda berakhir ketika...", "Jouw rol eindigt wanneer...", lang)}
          </h2>
          <p style={{ textAlign: "center", fontSize: 15, color: bodyText, lineHeight: 1.65, maxWidth: 580, margin: "0 auto 48px" }}>
            {t(
              "A wise first responder knows their limits. Recognising when to hand over is not a failure — it is the final act of good care.",
              "Penolong pertama yang bijak mengetahui batas mereka. Mengenali kapan harus menyerahkan bukan kegagalan — itu adalah tindakan akhir dari perawatan yang baik.",
              "Een wijze eerste hulpverlener kent zijn grenzen. Herkennen wanneer over te dragen is geen falen — het is de laatste daad van goede zorg.",
              lang
            )}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {BOUNDARY_ITEMS.map((item, i) => (
              <div key={item.key} style={{ background: "white", borderRadius: 14, padding: "28px 24px", border: "1.5px solid oklch(88% 0.008 260)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: i === 0 ? "oklch(52% 0.18 25)" : i === 1 ? "oklch(55% 0.16 55)" : i === 2 ? "oklch(50% 0.17 165)" : "oklch(40% 0.12 295)" }} />
                <div style={{ paddingLeft: 8 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: 10 }}>
                    {t("Signal", "Sinyal", "Signaal", lang)}
                  </p>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 14, color: navy, lineHeight: 1.5, marginBottom: 16 }}>
                    {t(item.en_signal, item.id_signal, item.nl_signal, lang)}
                  </p>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(52% 0.18 25)", marginBottom: 8 }}>
                    {t("What to do", "Apa yang harus dilakukan", "Wat te doen", lang)}
                  </p>
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: bodyText, margin: 0 }}>
                    {t(item.en_action, item.id_action, item.nl_action, lang)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40, background: `${navy}`, borderRadius: 14, padding: "32px 36px", textAlign: "center" }}>
            <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 20, color: "oklch(88% 0.04 80)", lineHeight: 1.7, fontStyle: "italic", marginBottom: 0 }}>
              {t(
                "You are not the answer to every crisis. You are the bridge to the answer. That is enough — and it is not a small thing.",
                "Anda bukan jawaban untuk setiap krisis. Anda adalah jembatan menuju jawaban. Itu sudah cukup — dan itu bukan hal yang kecil.",
                "Jij bent niet het antwoord op elke crisis. Jij bent de brug naar het antwoord. Dat is genoeg — en het is geen kleine zaak.",
                lang
              )}
            </p>
          </div>
        </div>
      </section>

      {/* SAVE & PATHWAY CTA */}
      <section style={{ background: navy, padding: "64px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(82% 0.03 80)", lineHeight: 1.7, fontStyle: "italic", marginBottom: 32 }}>
            {t(
              "\"He comforts us so that we can comfort others.\" You were trained through your own story. Use it.",
              "\"Dia menghibur kita sehingga kita dapat menghibur orang lain.\" Anda dilatih melalui kisah Anda sendiri. Gunakannya.",
              "\"Hij troost ons zodat wij anderen kunnen troosten.\" Je bent getraind door je eigen verhaal. Gebruik het.",
              lang
            )}
          </p>
          <p style={{ fontSize: 12, color: orange, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 48 }}>
            — {lang === "id" ? VERSES["2cor-1-4"].ref_id : lang === "nl" ? VERSES["2cor-1-4"].ref_nl : VERSES["2cor-1-4"].ref}
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {!saved ? (
              <button
                onClick={handleSave}
                disabled={isPending}
                style={{ padding: "14px 32px", background: orange, color: "white", border: "none", borderRadius: 8, fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 14, cursor: isPending ? "wait" : "pointer", letterSpacing: "0.06em" }}
              >
                {isPending
                  ? t("Saving…", "Menyimpan…", "Opslaan…", lang)
                  : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard", lang)}
              </button>
            ) : (
              <span style={{ padding: "14px 32px", background: "oklch(40% 0.15 145)", color: "white", borderRadius: 8, fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "0.06em" }}>
                ✓ {t("Saved to Dashboard", "Tersimpan di Dashboard", "Opgeslagen in Dashboard", lang)}
              </span>
            )}
            {userPathway && (
              <Link href="/dashboard" style={{ padding: "14px 32px", background: "transparent", color: offWhite, border: `1.5px solid oklch(50% 0.06 260)`, borderRadius: 8, fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 14, textDecoration: "none", letterSpacing: "0.06em" }}>
                {t("Back to Pathway", "Kembali ke Jalur", "Terug naar Pad", lang)}
              </Link>
            )}
            <Link href="/resources" style={{ padding: "14px 32px", background: "transparent", color: offWhite, border: `1.5px solid oklch(50% 0.06 260)`, borderRadius: 8, fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 14, textDecoration: "none", letterSpacing: "0.06em" }}>
              {t("All Resources", "Semua Sumber", "Alle Bronnen", lang)}
            </Link>
          </div>
        </div>
      </section>

      {/* VERSE POPUP */}
      {activeVerse && verseData && (() => {
        return (
          <div
            onClick={() => setActiveVerse(null)}
            style={{ position: "fixed", inset: 0, background: "oklch(10% 0.05 260 / 0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{ background: offWhite, borderRadius: 16, padding: "40px 36px", maxWidth: 520, width: "100%" }}
            >
              <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 22, lineHeight: 1.6, color: navy, fontStyle: "italic", marginBottom: 16 }}>
                "{lang === "en" ? verseData.en : lang === "id" ? verseData.id : verseData.nl}"
              </p>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, color: orange, letterSpacing: "0.08em", marginBottom: 24 }}>
                — {lang === "en" ? verseData.ref : lang === "id" ? verseData.ref_id : verseData.ref_nl} ({lang === "en" ? "NIV" : lang === "id" ? "TB" : "NBV"})
              </p>
              <button
                onClick={() => setActiveVerse(null)}
                style={{ padding: "10px 24px", background: navy, color: offWhite, border: "none", borderRadius: 6, fontFamily: "Montserrat, sans-serif", fontWeight: 700, cursor: "pointer" }}
              >
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
