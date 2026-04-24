"use client";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const VERSES = {
  "prov-15-1": {
    en_ref: "Proverbs 15:1", id_ref: "Amsal 15:1", nl_ref: "Spreuken 15:1",
    en: "A gentle answer turns away wrath, but a harsh word stirs up anger.",
    id: "Jawaban yang lemah lembut meredakan kegeraman, tetapi perkataan yang pedas membangkitkan marah.",
    nl: "Een zachte reactie sust een uitbarsting, maar een krenkend woord prikkelt tot woede.",
  },
  "prov-27-5-6": {
    en_ref: "Proverbs 27:5–6", id_ref: "Amsal 27:5–6", nl_ref: "Spreuken 27:5–6",
    en: "Better is open rebuke than hidden love. Wounds from a friend can be trusted, but an enemy multiplies kisses.",
    id: "Teguran yang terang-terangan lebih baik dari pada kasih yang tersembunyi. Dapat dipercaya tikaman seorang sahabat, tetapi ciuman seorang musuh sangat banyak.",
    nl: "Een openlijk verwijt is beter dan onbetuigde liefde; een vriend die kwetst, is te vertrouwen, een vijand die kust, niet.",
  },
};

// 4 cultural contexts used across all scenarios — not ranked, not "Western = default"
const CONTEXTS = [
  {
    key: "honor",
    color: "oklch(65% 0.15 45)",
    colorBg: "oklch(65% 0.15 45 / 0.09)",
    en_label: "Honor & Face",
    id_label: "Kehormatan & Muka",
    nl_label: "Eer & Gezicht",
    en_region: "East Asia · Southeast Asia · Middle East · North Africa",
    id_region: "Asia Timur · Asia Tenggara · Timur Tengah · Afrika Utara",
    nl_region: "Oost-Azië · Zuidoost-Azië · Midden-Oosten · Noord-Afrika",
    en_key: "Relationship is the delivery mechanism. Face preservation is non-negotiable.",
    id_key: "Hubungan adalah mekanisme penyampaian. Menjaga muka adalah tidak dapat dinegosiasikan.",
    nl_key: "Relatie is het bezorgmechanisme. Gezichtsbehoud is niet onderhandelbaar.",
  },
  {
    key: "ubuntu",
    color: "oklch(52% 0.14 150)",
    colorBg: "oklch(52% 0.14 150 / 0.09)",
    en_label: "Ubuntu & Community",
    id_label: "Ubuntu & Komunitas",
    nl_label: "Ubuntu & Gemeenschap",
    en_region: "Sub-Saharan Africa · Pacific Islands · Indigenous contexts",
    id_region: "Afrika Sub-Sahara · Kepulauan Pasifik · Konteks adat",
    nl_region: "Sub-Sahara Afrika · Pacifische eilanden · Inheemse contexten",
    en_key: "Community is the reference point. Feedback strengthens belonging, not just performance.",
    id_key: "Komunitas adalah titik referensi. Umpan balik memperkuat rasa memiliki, bukan hanya kinerja.",
    nl_key: "Gemeenschap is het referentiepunt. Feedback versterkt verbondenheid, niet alleen prestaties.",
  },
  {
    key: "personalismo",
    color: "oklch(52% 0.14 290)",
    colorBg: "oklch(52% 0.14 290 / 0.09)",
    en_label: "Personalismo",
    id_label: "Personalismo",
    nl_label: "Personalismo",
    en_region: "Latin America · Southern Europe · Arab cultures",
    id_region: "Amerika Latin · Eropa Selatan · Budaya Arab",
    nl_region: "Latijns-Amerika · Zuid-Europa · Arabische culturen",
    en_key: "The person before the task. Warmth and loyalty come first; the message follows.",
    id_key: "Orangnya sebelum tugasnya. Kehangatan dan kesetiaan dahulu; pesannya menyusul.",
    nl_key: "De persoon voor de taak. Warmte en loyaliteit komen eerst; de boodschap volgt.",
  },
  {
    key: "direct",
    color: "oklch(45% 0.10 240)",
    colorBg: "oklch(45% 0.10 240 / 0.09)",
    en_label: "Low-Context Direct",
    id_label: "Langsung Low-Context",
    nl_label: "Laagcontext Direct",
    en_region: "Northern Europe · North America · Australia",
    id_region: "Eropa Utara · Amerika Utara · Australia",
    nl_region: "Noord-Europa · Noord-Amerika · Australië",
    en_key: "Clarity is respect. Say what you mean, specifically and soon.",
    id_key: "Kejelasan adalah rasa hormat. Katakan apa yang Anda maksud, dengan spesifik dan segera.",
    nl_key: "Duidelijkheid is respect. Zeg wat je bedoelt, specifiek en snel.",
  },
];

const SCENARIOS = [
  {
    num: "01",
    en_title: "The Repeated Missed Deadline",
    id_title: "Tenggat Waktu yang Berulang Terlewat",
    nl_title: "De Herhaald Gemiste Deadline",
    en_situation: "A team member has missed a deliverable deadline for the second time in two months. The work quality is good. But the delay is affecting two other colleagues who depend on this output to do their own work.",
    id_situation: "Seorang anggota tim telah melewatkan tenggat waktu untuk kedua kalinya dalam dua bulan. Kualitas pekerjaannya baik. Tetapi keterlambatan itu mempengaruhi dua rekan lain yang bergantung pada output ini untuk melakukan pekerjaan mereka sendiri.",
    nl_situation: "Een teamlid heeft voor de tweede keer in twee maanden een deadline gemist. De werkkwaliteit is goed. Maar de vertraging beïnvloedt twee andere collega's die op deze output vertrouwen om hun eigen werk te doen.",
    approaches: [
      {
        key: "honor",
        en_approach: "Request a private conversation. Begin by acknowledging the quality of the work genuinely: \"I want to talk with you because I respect your work and I want to see you succeed here.\" Then introduce the issue as a shared problem, not a personal failure: \"I notice we've had two situations where timing created difficulty. I want to understand what's been happening — and I want us to solve this together.\" Give them room to save face by offering reasons, and only move to expectations once the relationship is secure.",
        id_approach: "Minta percakapan pribadi. Mulailah dengan mengakui kualitas pekerjaan secara tulus: \"Saya ingin berbicara dengan Anda karena saya menghargai pekerjaan Anda dan ingin melihat Anda berhasil di sini.\" Kemudian perkenalkan masalah sebagai masalah bersama: \"Saya melihat kita punya dua situasi di mana waktu menciptakan kesulitan. Saya ingin memahami apa yang terjadi — dan saya ingin kita menyelesaikan ini bersama.\"",
        nl_approach: "Vraag een privégesprek aan. Begin met het oprecht erkennen van de kwaliteit van het werk: \"Ik wil met je praten omdat ik je werk waardeer en jou wil zien slagen.\" Introduceer het probleem dan als een gezamenlijk probleem, geen persoonlijk falen: \"Ik merk dat we twee situaties hebben gehad waarbij timing moeilijkheden veroorzaakte. Ik wil begrijpen wat er is gebeurd — en ik wil dit samen oplossen.\"",
        en_principle: "Face-saving framing. The feedback is real — but it arrives wrapped in relationship and shared ownership, so it can be received without triggering shame.",
        id_principle: "Pembingkaian penyelamat muka. Umpan baliknya nyata — tetapi datang terbungkus dalam hubungan dan kepemilikan bersama, sehingga dapat diterima tanpa memicu rasa malu.",
        nl_principle: "Gezichtsbesparende framing. De feedback is echt — maar ze aankomt gewikkeld in relatie en gedeeld eigenaarschap, zodat ze ontvangen kan worden zonder schaamte te activeren.",
      },
      {
        key: "ubuntu",
        en_approach: "Before addressing it directly, consult a respected peer or elder on the team — not to gossip, but to understand whether there's something going on in the person's wider life that's affecting their work. In many African contexts, a leader who approaches a problem without first seeking wisdom from the community is seen as rash. Once you have context, approach the team member warmly and frame the conversation around the team's shared goal: \"We need each other. What can I do to make this easier for you?\"",
        id_approach: "Sebelum mengatasinya secara langsung, konsultasikan dengan rekan atau sesepuh yang dihormati dalam tim — bukan untuk bergosip, tetapi untuk memahami apakah ada sesuatu yang terjadi dalam kehidupan orang tersebut. Setelah Anda memiliki konteks, dekati anggota tim dengan hangat dan bingkai percakapan di sekitar tujuan bersama tim: \"Kita membutuhkan satu sama lain. Apa yang bisa saya lakukan untuk memudahkan ini bagi Anda?\"",
        nl_approach: "Raadpleeg voor je het direct aanpakt een gerespecteerde collega of oudere in het team — niet om te roddelen, maar om te begrijpen of er iets speelt in het bredere leven van de persoon. Eenmaal met context, benader het teamlid warm en frame het gesprek rond het gedeelde doel van het team: \"We hebben elkaar nodig. Wat kan ik doen om dit makkelijker te maken voor jou?\"",
        en_principle: "Community consultation before confrontation. The leader doesn't act alone — they seek wisdom first, which shows both care and humility.",
        id_principle: "Konsultasi komunitas sebelum konfrontasi. Pemimpin tidak bertindak sendiri — mereka mencari hikmat terlebih dahulu, yang menunjukkan kepedulian dan kerendahan hati.",
        nl_principle: "Gemeenschapsoverleg voor confrontatie. De leider handelt niet alleen — ze zoeken eerst wijsheid, wat zowel zorg als bescheidenheid toont.",
      },
      {
        key: "personalismo",
        en_approach: "The feedback conversation happens in the context of a relationship that already exists. You don't address it in a formal meeting — you have coffee first, ask about family, show genuine interest. Then, in that warm space, you raise it: \"I need to be honest with you because I care about you and your success here. Something came up twice now that I want us to talk about together.\" The warmth makes the directness safe. Without the warmth, the same directness would land as cold judgment.",
        id_approach: "Percakapan umpan balik terjadi dalam konteks hubungan yang sudah ada. Anda tidak mengatasinya dalam rapat formal — Anda minum kopi terlebih dahulu, tanya tentang keluarga, tunjukkan minat yang tulus. Kemudian, dalam ruang hangat itu, Anda mengangkatnya: \"Saya perlu jujur dengan Anda karena saya peduli pada Anda dan kesuksesan Anda di sini.\"",
        nl_approach: "Het feedbackgesprek vindt plaats in de context van een bestaande relatie. Je adresseert het niet in een formele vergadering — je drinkt eerst koffie, vraagt naar de familie, toont echte interesse. Dan, in die warme ruimte, breng je het ter sprake: \"Ik moet eerlijk zijn omdat ik om je geef en om je succes hier.\" De warmte maakt de directheid veilig.",
        en_principle: "Warmth as the delivery mechanism. The feedback itself is direct — but the relationship context makes it safe to receive and act on.",
        id_principle: "Kehangatan sebagai mekanisme penyampaian. Umpan balik itu sendiri langsung — tetapi konteks hubungan membuatnya aman untuk diterima dan ditindaklanjuti.",
        nl_principle: "Warmte als bezorgmechanisme. De feedback zelf is direct — maar de relatiecontext maakt het veilig om te ontvangen en erop te handelen.",
      },
      {
        key: "direct",
        en_approach: "Address it soon after the second occurrence — not weeks later. Keep it specific and factual: \"I want to raise something with you directly. This is the second time a deadline has slipped. The impact is that Mei and Kofi can't start their work until yours is done. I'd like to understand what's getting in the way and work out a plan to fix it.\" No softening, no preamble, no excessive context — but also no judgment of the person's character. The problem is the pattern, not the person.",
        id_approach: "Segera tangani setelah kejadian kedua. Jadikan spesifik dan faktual: \"Saya ingin membicarakan sesuatu dengan Anda secara langsung. Ini adalah kedua kalinya tenggat waktu terlewat. Dampaknya adalah Mei dan Kofi tidak dapat memulai pekerjaan mereka sampai pekerjaan Anda selesai. Saya ingin memahami apa yang menghalangi dan merancang rencana untuk memperbaikinya.\"",
        nl_approach: "Adresseer het snel na de tweede keer. Houd het specifiek en feitelijk: \"Ik wil dit direct met je bespreken. Dit is de tweede keer dat een deadline is overschreden. De impact is dat Mei en Kofi hun werk niet kunnen starten totdat het jouwe klaar is. Ik wil begrijpen wat er in de weg staat en een plan maken om het op te lossen.\" Geen overmatige inleiding — maar ook geen oordeel over iemands karakter.",
        en_principle: "Specificity and timing. Naming the impact on others (not just on performance targets) keeps it human while remaining clear.",
        id_principle: "Kekhususan dan waktu. Menyebutkan dampak pada orang lain (bukan hanya target kinerja) menjaganya tetap manusiawi sambil tetap jelas.",
        nl_principle: "Specificiteit en timing. Het benoemen van de impact op anderen (niet alleen op prestatiedoelen) houdt het menselijk terwijl het helder blijft.",
      },
    ],
    en_question: "What is your natural default in a situation like this? And which of these approaches would expand your range?",
    id_question: "Apa default alami Anda dalam situasi seperti ini? Dan pendekatan mana yang akan memperluas jangkauan Anda?",
    nl_question: "Wat is jouw natuurlijke standaard in een situatie als deze? En welke van deze aanpakken zou jouw bereik uitbreiden?",
  },
  {
    num: "02",
    en_title: "Recognising Exceptional Work",
    id_title: "Mengakui Pekerjaan Luar Biasa",
    nl_title: "Uitzonderlijk Werk Erkennen",
    en_situation: "During a difficult week, one team member — Amara — went well beyond her role. She stayed late, helped two colleagues who were struggling, and delivered her own work flawlessly. You want to recognise this in a way that actually lands.",
    id_situation: "Selama minggu yang sulit, satu anggota tim — Amara — pergi jauh melampaui perannya. Ia bekerja keras, membantu dua rekan yang kesulitan, dan mengirimkan pekerjaan sendiri dengan sempurna. Anda ingin mengakui ini dengan cara yang benar-benar bermakna.",
    nl_situation: "Tijdens een moeilijke week ging één teamlid — Amara — ver boven haar rol uit. Ze bleef laat, hielp twee collega's die het moeilijk hadden, en leverde haar eigen werk feilloos. Je wilt dit erkennen op een manier die echt aankomt.",
    approaches: [
      {
        key: "honor",
        en_approach: "Recognise her privately first and with genuine warmth. Express personal appreciation rather than formal evaluation: \"I want you to know — what you did this week was remarkable. I saw it. I noticed how you showed up for the team.\" Then, if you do acknowledge it publicly, do so in a way that honours the whole team's effort and mentions her contribution as part of that — not as an individual singled out from the group, which can create awkwardness.",
        id_approach: "Akui dia secara pribadi terlebih dahulu dan dengan kehangatan yang tulus. Ekspresikan apresiasi pribadi daripada evaluasi formal: \"Saya ingin Anda tahu — apa yang Anda lakukan minggu ini luar biasa. Saya melihatnya.\" Kemudian, jika Anda mengakuinya di depan umum, lakukan dengan cara yang menghormati upaya seluruh tim.",
        nl_approach: "Erken haar eerst privé en met echte warmte. Druk persoonlijke waardering uit in plaats van formele beoordeling: \"Ik wil dat je weet — wat je deze week hebt gedaan was opmerkelijk. Ik heb het gezien.\" Als je het dan publiekelijk erkent, doe het dan op een manier die de inzet van het hele team eert.",
        en_principle: "Private first, collective framing in public. Singling someone out in a group setting can backfire — private recognition often carries more weight.",
        id_principle: "Pribadi terlebih dahulu, pembingkaian kolektif di depan umum. Memilih seseorang dalam pengaturan kelompok dapat menjadi bumerang.",
        nl_principle: "Privé eerst, collectieve framing in het openbaar. Iemand uitlichten in een groepsomgeving kan averechts werken.",
      },
      {
        key: "ubuntu",
        en_approach: "Frame the recognition in terms of what her contribution meant for the community, not just for the output. \"Amara, the way you showed up for your teammates this week — that's the kind of spirit that makes us who we are as a team.\" In Ubuntu-oriented cultures, the highest recognition connects individual action to communal identity. She will feel most honoured knowing her contribution made the people around her stronger.",
        id_approach: "Bingkai pengakuan dalam hal apa kontribusinya berarti bagi komunitas, bukan hanya output. \"Amara, cara Anda hadir untuk rekan tim Anda minggu ini — itulah semangat yang membuat kita menjadi siapa kita sebagai tim.\" Pengakuan tertinggi menghubungkan tindakan individu dengan identitas komunal.",
        nl_approach: "Frame de erkenning in termen van wat haar bijdrage betekende voor de gemeenschap. \"Amara, de manier waarop je er was voor je teamgenoten deze week — dat is de geest die ons maakt wie we zijn als team.\" De hoogste erkenning verbindt individuele actie aan communale identiteit.",
        en_principle: "Communal framing of individual excellence. The person's contribution is valued for what it gave to the group — the deepest possible affirmation.",
        id_principle: "Pembingkaian komunal dari keunggulan individu. Kontribusi seseorang dihargai karena apa yang diberikannya kepada kelompok.",
        nl_principle: "Communale framing van individuele uitmuntendheid. De bijdrage wordt gewaardeerd voor wat het aan de groep heeft gegeven.",
      },
      {
        key: "personalismo",
        en_approach: "The most powerful recognition happens in person, with undivided attention, and it's personal — not professional. You're not just noting her performance. You're telling her something about who she is: \"I want to take a moment to tell you personally — I'm proud of you. Not just for what you produced, but for the kind of person you showed yourself to be this week. That means something to me.\" She will remember this long after a written commendation is forgotten.",
        id_approach: "Pengakuan paling kuat terjadi secara langsung, dengan perhatian penuh, dan bersifat personal: \"Saya ingin mengambil waktu untuk memberi tahu Anda secara pribadi — saya bangga pada Anda. Bukan hanya untuk apa yang Anda hasilkan, tetapi untuk jenis orang yang Anda tunjukkan menjadi minggu ini.\"",
        nl_approach: "De krachtigste erkenning vindt persoonlijk plaats, met onverdeelde aandacht: \"Ik wil even de tijd nemen om je persoonlijk te zeggen — ik ben trots op je. Niet alleen voor wat je hebt geproduceerd, maar voor de persoon die je hebt laten zien te zijn deze week.\" Ze zal dit herinneren lang nadat een schriftelijke aanbeveling vergeten is.",
        en_principle: "Personal, not positional recognition. The deepest motivation in personalismo cultures is that the leader sees and values you as a person — not just as a performer.",
        id_principle: "Pengakuan personal, bukan posisional. Motivasi terdalam adalah bahwa pemimpin melihat dan menghargai Anda sebagai pribadi.",
        nl_principle: "Persoonlijke, niet positionele erkenning. De diepste motivatie is dat de leider je ziet en waardeert als persoon — niet alleen als presteerder.",
      },
      {
        key: "direct",
        en_approach: "Name it specifically and promptly: \"Amara, I want to call out what you did this week. You stayed late, you helped Marcus with his section and Priya with her data, and you delivered your own work on time. That is exactly the kind of teammate we need here. Thank you.\" In low-context cultures, vague appreciation feels hollow — specific, prompt recognition lands far better than general praise delivered later.",
        id_approach: "Sebutkan secara spesifik dan segera: \"Amara, saya ingin menyebut apa yang Anda lakukan minggu ini. Anda bekerja keras, membantu Marcus dengan bagiannya dan Priya dengan datanya, dan mengirimkan pekerjaan Anda sendiri tepat waktu. Itu adalah jenis rekan tim yang kita butuhkan di sini. Terima kasih.\"",
        nl_approach: "Benoem het specifiek en snel: \"Amara, ik wil benoemen wat je deze week hebt gedaan. Je bleef laat, je hielp Marcus met zijn gedeelte en Priya met haar data, en je leverde je eigen werk op tijd. Dat is precies het soort teamlid dat we hier nodig hebben. Dank je.\"",
        en_principle: "Specific and named. Vague appreciation ('great job') often fails to land. Naming exactly what was done and why it mattered is the most credible form of recognition.",
        id_principle: "Spesifik dan disebutkan namanya. Apresiasi yang samar sering gagal bermakna. Menyebutkan dengan tepat apa yang dilakukan dan mengapa itu penting.",
        nl_principle: "Specifiek en benoemd. Vage waardering ('goed gedaan') slaagt er vaak niet in te landen. Precies benoemen wat gedaan werd en waarom het van belang was.",
      },
    ],
    en_question: "Which of these would feel most meaningful to you personally if you were Amara? What does that tell you about your own culture?",
    id_question: "Mana dari ini yang paling bermakna bagi Anda secara pribadi jika Anda adalah Amara? Apa yang itu katakan tentang budaya Anda sendiri?",
    nl_question: "Welke van deze zou het meest betekenisvol aanvoelen voor jou persoonlijk als je Amara was? Wat zegt dat over je eigen cultuur?",
  },
  {
    num: "03",
    en_title: "A Visible Disagreement in the Team",
    id_title: "Ketidaksepakatan yang Terlihat dalam Tim",
    nl_title: "Een Zichtbare Onenigheid in het Team",
    en_situation: "Two team members — let's call them Samuel and David — had a visible, tense exchange in a team meeting that clearly made others uncomfortable. It was not hostile, but the tension is now sitting in the room. As the leader, you need to address it.",
    id_situation: "Dua anggota tim — sebut saja Samuel dan David — memiliki pertukaran yang terlihat dan tegang dalam rapat tim yang jelas membuat orang lain tidak nyaman. Itu bukan permusuhan, tetapi ketegangannya kini ada di ruangan. Sebagai pemimpin, Anda perlu mengatasinya.",
    nl_situation: "Twee teamleden — noem ze Samuel en David — hadden een zichtbare, gespannen uitwisseling in een teamvergadering die duidelijk anderen ongemakkelijk maakte. Het was niet vijandig, maar de spanning hangt nu in de kamer. Als leider moet je dit aanpakken.",
    approaches: [
      {
        key: "honor",
        en_approach: "Never address it in the group. Meet Samuel and David separately, one at a time. With each: acknowledge their perspective first, affirm the relationship, then raise the concern — \"I noticed some tension in the meeting. I want to understand what's going on for you, because I care about your relationship with David and the health of the team.\" Only convene a joint conversation if both are willing and if the private conversations suggest it would help rather than escalate.",
        id_approach: "Jangan pernah mengatasinya dalam kelompok. Temui Samuel dan David secara terpisah, satu per satu. Dengan masing-masing: akui perspektif mereka terlebih dahulu, tegaskan hubungan, kemudian angkat kekhawatiran: \"Saya melihat beberapa ketegangan dalam rapat. Saya ingin memahami apa yang sedang terjadi untuk Anda, karena saya peduli tentang hubungan Anda dengan David dan kesehatan tim.\"",
        nl_approach: "Adresseer het nooit in de groep. Spreek Samuel en David afzonderlijk, één voor één. Met ieder: erken eerst hun perspectief, bevestig de relatie, breng dan de zorg ter sprake: \"Ik merkte enige spanning in de vergadering. Ik wil begrijpen wat er voor jou speelt, omdat ik geef om jouw relatie met David en de gezondheid van het team.\"",
        en_principle: "Separate before convening. Face cultures require private processing before any group resolution — attempting group repair without this often makes things worse.",
        id_principle: "Pisahkan sebelum mengumpulkan. Budaya muka membutuhkan pemrosesan pribadi sebelum resolusi kelompok apa pun.",
        nl_principle: "Afzonderlijk voor je samenbrengt. Eer-culturen vereisen privéverwerking voor elke groepsoplossing.",
      },
      {
        key: "ubuntu",
        en_approach: "Call a time of intentional pause for the whole team — not to confront the two individuals, but to re-centre on shared purpose. \"We've had a hard week and some difficult moments. Before we move on, I want us to pause and remember why we're doing this together.\" Then later, invite Samuel and David into a circle conversation with a trusted elder or senior colleague present — someone who can hold the relational space. The goal is restored community, not assigned blame.",
        id_approach: "Panggil waktu jeda yang disengaja untuk seluruh tim — bukan untuk menghadapi dua individu, tetapi untuk memusatkan kembali pada tujuan bersama. Kemudian undang Samuel dan David ke percakapan lingkaran dengan sesepuh atau kolega senior yang dipercaya hadir. Tujuannya adalah komunitas yang dipulihkan, bukan menetapkan kesalahan.",
        nl_approach: "Roep een intentionele pauze op voor het hele team — niet om de twee individuen te confronteren, maar om opnieuw te centreren op gezamenlijk doel. Nodig later Samuel en David uit voor een kringgesprek met een vertrouwde oudere aanwezig. Het doel is herstelde gemeenschap, geen toegewezen schuld.",
        en_principle: "Community repair over individual correction. The conflict affected the whole body — restoring the whole body is the priority.",
        id_principle: "Pemulihan komunitas atas koreksi individu. Konflik mempengaruhi seluruh tubuh — memulihkan seluruh tubuh adalah prioritas.",
        nl_principle: "Gemeenschapsherstel boven individuele correctie. Het conflict raakte het hele lichaam — het herstel van het hele lichaam is de prioriteit.",
      },
      {
        key: "personalismo",
        en_approach: "Talk to Samuel first (as the one who appeared more agitated), because the relationship you have with him is the asset. \"I noticed what happened. I'm not here to take sides — I'm here because I care about you and because this team matters to me. Tell me what happened from your side.\" After hearing him, you connect with David in the same way. Your personal investment in both of them is what makes the mediation possible. You're not a neutral referee — you're a trusted person who cares.",
        id_approach: "Bicara dengan Samuel terlebih dahulu, karena hubungan yang Anda miliki dengannya adalah asetnya. \"Saya melihat apa yang terjadi. Saya tidak di sini untuk memihak — saya di sini karena saya peduli pada Anda dan karena tim ini penting bagi saya. Ceritakan apa yang terjadi dari sisi Anda.\"",
        nl_approach: "Praat eerst met Samuel (degene die het meest opgewonden leek), omdat de relatie die je met hem hebt het actief is. \"Ik merkte wat er is gebeurd. Ik ben er niet om partij te kiezen — ik ben er omdat ik om je geef. Vertel me wat er is gebeurd vanuit jouw kant.\" Je persoonlijke investering in beiden is wat de bemiddeling mogelijk maakt.",
        en_principle: "Relationship as mediation capital. Your personal investment in both parties is the resource you bring to the repair — not your authority.",
        id_principle: "Hubungan sebagai modal mediasi. Investasi pribadi Anda di kedua pihak adalah sumber daya yang Anda bawa untuk pemulihan.",
        nl_principle: "Relatie als mediationekapitaal. Jouw persoonlijke investering in beide partijen is het middel dat je inbrengt voor herstel.",
      },
      {
        key: "direct",
        en_approach: "Address it the same day, before the team leaves. Not in front of everyone — but a brief moment after the meeting: \"Samuel, David — can I have 5 minutes?\" Name it clearly: \"There was tension in there that I don't want to leave unaddressed. What happened?\" Listen to both, reflect back what you heard, and agree on a next step. Then check in with the wider team briefly to acknowledge the moment without dramatising it: \"We had a tense session — that happens. We're going to be fine.\"",
        id_approach: "Tangani di hari yang sama, sebelum tim pergi. Bukan di depan semua orang — tetapi momen singkat setelah rapat: \"Samuel, David — boleh saya minta 5 menit?\" Sebutkan dengan jelas: \"Ada ketegangan yang tidak ingin saya biarkan tidak ditangani. Apa yang terjadi?\" Dengarkan keduanya dan setujui langkah selanjutnya.",
        nl_approach: "Adresseer het dezelfde dag, voordat het team vertrekt. Niet voor iedereen — maar een kort moment na de vergadering: \"Samuel, David — mag ik 5 minuten?\" Benoem het duidelijk: \"Er was spanning die ik niet onbehandeld wil laten. Wat is er gebeurd?\" Luister naar beiden, reflecteer terug wat je hoorde, en spreek een volgende stap af.",
        en_principle: "Speed and naming. Letting conflict sit overnight allows it to harden. A quick, clear acknowledgment and a plan to resolve prevents the tension from becoming a team story.",
        id_principle: "Kecepatan dan penamaan. Membiarkan konflik bermalam memungkinkannya mengeras. Pengakuan cepat dan jelas mencegah ketegangan menjadi cerita tim.",
        nl_principle: "Snelheid en benoemen. Conflict 's nachts laten liggen laat het verharden. Snelle, duidelijke erkenning voorkomt dat de spanning een teamverhaal wordt.",
      },
    ],
    en_question: "Which approach would you naturally reach for? Is there one here you've never tried — and what would it take to try it?",
    id_question: "Pendekatan mana yang secara alami Anda pilih? Apakah ada satu di sini yang belum pernah Anda coba — dan apa yang diperlukan untuk mencobanya?",
    nl_question: "Welke aanpak zou je van nature kiezen? Is er een die je nooit hebt geprobeerd — en wat zou het kosten om het te proberen?",
  },
];

const PRINCIPLES = [
  {
    num: "01",
    en_title: "There is no neutral feedback style.",
    id_title: "Tidak ada gaya umpan balik yang netral.",
    nl_title: "Er is geen neutrale feedbackstijl.",
    en_body: "What feels 'normal' or 'professional' to you is your own cultural training. Your instinct is not more correct than someone else's — it's just more familiar. The cross-cultural leader's job is to expand their range, not to impose their default.",
    id_body: "Apa yang terasa 'normal' atau 'profesional' bagi Anda adalah pelatihan budaya Anda sendiri. Naluri Anda tidak lebih benar dari orang lain — itu hanya lebih akrab. Tugas pemimpin lintas budaya adalah memperluas jangkauan mereka, bukan memaksakan default mereka.",
    nl_body: "Wat voor jou 'normaal' of 'professioneel' voelt is je eigen culturele training. Jouw instinct is niet juister dan dat van iemand anders — het is alleen vertrouwder. De taak van de interculturele leider is hun bereik uit te breiden, niet hun standaard op te leggen.",
  },
  {
    num: "02",
    en_title: "The receiver defines whether feedback works.",
    id_title: "Penerima menentukan apakah umpan balik berhasil.",
    nl_title: "De ontvanger bepaalt of feedback werkt.",
    en_body: "Feedback that the receiver cannot hear is not feedback — it is noise. Your intention is irrelevant if the delivery makes it unreceivable. The burden is on the giver to adapt.",
    id_body: "Umpan balik yang tidak bisa didengar penerima bukanlah umpan balik — itu kebisingan. Niat Anda tidak relevan jika penyampaiannya membuatnya tidak dapat diterima. Beban ada pada pemberi untuk beradaptasi.",
    nl_body: "Feedback die de ontvanger niet kan horen is geen feedback — het is ruis. Jouw intentie is irrelevant als de levering het ontvangbaar maakt. De last ligt bij de gever om zich aan te passen.",
  },
  {
    num: "03",
    en_title: "Avoidance is not kindness.",
    id_title: "Penghindaran bukan kebaikan.",
    nl_title: "Vermijding is geen vriendelijkheid.",
    en_body: "Withholding honest feedback to avoid discomfort is not cross-cultural sensitivity — it is a failure to lead. Every cultural context values clarity when it's delivered with care. The question is always how, not whether.",
    id_body: "Menahan umpan balik yang jujur untuk menghindari ketidaknyamanan bukan kepekaan lintas budaya — itu adalah kegagalan untuk memimpin. Setiap konteks budaya menghargai kejelasan ketika disampaikan dengan kepedulian. Pertanyaannya selalu bagaimana, bukan apakah.",
    nl_body: "Eerlijke feedback achterhouden om ongemak te vermijden is geen interculturele sensitiviteit — het is een falen om te leiden. Elke culturele context waardeert duidelijkheid wanneer ze met zorg wordt geleverd. De vraag is altijd hoe, nooit of.",
  },
  {
    num: "04",
    en_title: "Know your own defaults.",
    id_title: "Kenali default Anda sendiri.",
    nl_title: "Ken je eigen standaarden.",
    en_body: "The most effective cross-cultural communicators are not the ones who have abandoned their own style. They are the ones who know their own default clearly enough to choose a different approach when the situation calls for it.",
    id_body: "Komunikator lintas budaya yang paling efektif bukan mereka yang telah meninggalkan gaya mereka sendiri. Mereka adalah yang mengetahui default mereka sendiri dengan cukup jelas untuk memilih pendekatan berbeda ketika situasi menuntutnya.",
    nl_body: "De meest effectieve interculturele communicatoren zijn niet degenen die hun eigen stijl hebben opgegeven. Het zijn degenen die hun eigen standaard duidelijk genoeg kennen om een andere aanpak te kiezen wanneer de situatie dat vraagt.",
  },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function GivingFeedbackClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang, setLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [reflections, setReflections] = useState<Record<number, string>>({});
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("giving-feedback-across-cultures");
      setSaved(true);
    });
  }

  function toggleCard(key: string) {
    setExpandedCards((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const navy = "oklch(22% 0.10 260)";
  const orange = "oklch(65% 0.15 45)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const bodyText = "oklch(38% 0.05 260)";
  const serif = "var(--font-cormorant, Cormorant Garamond, Georgia, serif)";

  const verseData = activeVerse ? VERSES[activeVerse as keyof typeof VERSES] : null;

  function VerseRef({ id, children }: { id: string; children: React.ReactNode }) {
    return (
      <button onClick={() => setActiveVerse(id)} style={{ background: "none", border: "none", cursor: "pointer", color: orange, fontWeight: 700, fontFamily: "Montserrat, sans-serif", fontSize: "inherit", padding: 0, textDecoration: "underline dotted", textUnderlineOffset: 3 }}>
        {children}
      </button>
    );
  }

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>

      {/* Language bar */}
      <div style={{ background: lightGray, borderBottom: "1px solid oklch(90% 0.01 80)", padding: "10px 24px", display: "flex", gap: 8, justifyContent: "flex-end" }}>
        {(["en", "id", "nl"] as Lang[]).map((l) => (
          <button key={l} onClick={() => setLang(l)} style={{ padding: "4px 14px", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, background: lang === l ? navy : "transparent", color: lang === l ? offWhite : bodyText, borderRadius: 3 }}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Hero */}
      <div style={{ background: navy, padding: "88px 24px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {t("Module 10 · Communication", "Modul 10 · Komunikasi", "Module 10 · Communicatie")}
          </p>
          <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, color: offWhite, margin: "0 0 24px", lineHeight: 1.15 }}>
            {t("Giving Feedback Across Cultures", "Memberikan Umpan Balik Lintas Budaya", "Feedback Geven over Culturen Heen")}
          </h1>
          <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 21px)", color: "oklch(82% 0.025 80)", lineHeight: 1.75, maxWidth: 640, marginBottom: 16, fontStyle: "italic" }}>
            {t(
              "There is no neutral feedback style. This lab shows you the same situation handled four ways — and invites you to expand your range.",
              "Tidak ada gaya umpan balik yang netral. Lab ini menunjukkan situasi yang sama ditangani dengan empat cara — dan mengundang Anda untuk memperluas jangkauan.",
              "Er is geen neutrale feedbackstijl. Dit lab laat je dezelfde situatie op vier manieren zien — en nodigt je uit om je bereik uit te breiden."
            )}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 32 }}>
            <button onClick={handleSave} disabled={saved || isPending} style={{ padding: "12px 28px", border: "none", cursor: saved ? "default" : "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, background: saved ? "oklch(35% 0.05 260)" : orange, color: offWhite, borderRadius: 4 }}>
              {saved ? t("✓ Saved to Dashboard", "✓ Tersimpan di Dashboard", "✓ Opgeslagen in Dashboard") : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
            </button>
            <Link href="/resources" style={{ padding: "12px 28px", border: "1px solid oklch(45% 0.05 260)", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, color: "oklch(78% 0.03 80)", textDecoration: "none", borderRadius: 4 }}>
              {t("All Resources", "Semua Sumber", "Alle Bronnen")}
            </Link>
          </div>
        </div>
      </div>

      {/* Context legend */}
      <div style={{ padding: "48px 24px", background: lightGray }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: bodyText, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20, textAlign: "center" }}>
            {t("Four cultural contexts you'll encounter in this lab", "Empat konteks budaya yang akan Anda temui dalam lab ini", "Vier culturele contexten die je in dit lab tegenkomt")}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))", gap: 12 }}>
            {CONTEXTS.map((c) => (
              <div key={c.key} style={{ background: offWhite, padding: "18px 20px" }}>
                <div style={{ width: 28, height: 3, background: c.color, marginBottom: 12 }} />
                <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 800, color: navy, marginBottom: 6 }}>
                  {lang === "en" ? c.en_label : lang === "id" ? c.id_label : c.nl_label}
                </div>
                <div style={{ fontSize: 11, color: bodyText, lineHeight: 1.5, marginBottom: 8 }}>
                  {lang === "en" ? c.en_region : lang === "id" ? c.id_region : c.nl_region}
                </div>
                <div style={{ fontSize: 12, color: c.color, fontWeight: 600, lineHeight: 1.5, fontStyle: "italic" }}>
                  {lang === "en" ? c.en_key : lang === "id" ? c.id_key : c.nl_key}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Three scenarios */}
      {SCENARIOS.map((scenario, si) => (
        <div key={si} style={{ padding: "80px 24px", background: si % 2 === 0 ? offWhite : "oklch(96% 0.006 80)" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginBottom: 12 }}>
              <span style={{ fontFamily: serif, fontSize: 44, fontWeight: 700, color: orange, lineHeight: 1 }}>{scenario.num}</span>
              <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: 800, color: navy, lineHeight: 1.2 }}>
                {lang === "en" ? scenario.en_title : lang === "id" ? scenario.id_title : scenario.nl_title}
              </h2>
            </div>

            {/* Situation */}
            <div style={{ background: navy, padding: "20px 24px", marginBottom: 32 }}>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                {t("The Situation", "Situasinya", "De Situatie")}
              </p>
              <p style={{ fontSize: 15, color: "oklch(88% 0.02 80)", lineHeight: 1.7, margin: 0 }}>
                {lang === "en" ? scenario.en_situation : lang === "id" ? scenario.id_situation : scenario.nl_situation}
              </p>
            </div>

            {/* 4 approach cards */}
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: bodyText, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
              {t("Click each approach to read it in full", "Klik setiap pendekatan untuk membacanya secara lengkap", "Klik elke aanpak om hem volledig te lezen")}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 36 }}>
              {scenario.approaches.map((approach) => {
                const ctx = CONTEXTS.find((c) => c.key === approach.key)!;
                const cardKey = `${si}-${approach.key}`;
                const isOpen = expandedCards[cardKey];
                return (
                  <div key={approach.key} style={{ border: `1px solid ${isOpen ? ctx.color : "oklch(88% 0.01 80)"}`, overflow: "hidden", borderRadius: 4 }}>
                    <button
                      onClick={() => toggleCard(cardKey)}
                      style={{ width: "100%", padding: "16px 20px", background: isOpen ? ctx.colorBg : offWhite, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, textAlign: "left" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 4, height: 28, background: ctx.color, flexShrink: 0, borderRadius: 2 }} />
                        <div>
                          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, color: navy }}>
                            {lang === "en" ? ctx.en_label : lang === "id" ? ctx.id_label : ctx.nl_label}
                          </div>
                          <div style={{ fontSize: 11, color: bodyText }}>
                            {lang === "en" ? ctx.en_region : lang === "id" ? ctx.id_region : ctx.nl_region}
                          </div>
                        </div>
                      </div>
                      <span style={{ color: ctx.color, fontSize: 18, flexShrink: 0 }}>{isOpen ? "−" : "+"}</span>
                    </button>
                    {isOpen && (
                      <div style={{ padding: "20px 24px 24px", background: offWhite }}>
                        <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.8, marginBottom: 20 }}>
                          {lang === "en" ? approach.en_approach : lang === "id" ? approach.id_approach : approach.nl_approach}
                        </p>
                        <div style={{ background: ctx.colorBg, padding: "12px 16px", borderRadius: 4 }}>
                          <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: ctx.color, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                            {t("Key principle: ", "Prinsip kunci: ", "Kernprincipe: ")}
                          </span>
                          <span style={{ fontSize: 13, color: bodyText }}>
                            {lang === "en" ? approach.en_principle : lang === "id" ? approach.id_principle : approach.nl_principle}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Reflection */}
            <div style={{ background: lightGray, padding: "24px 28px" }}>
              <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)", color: navy, lineHeight: 1.75, fontStyle: "italic", marginBottom: 14 }}>
                {lang === "en" ? scenario.en_question : lang === "id" ? scenario.id_question : scenario.nl_question}
              </p>
              <textarea
                value={reflections[si] ?? ""}
                onChange={(e) => setReflections((prev) => ({ ...prev, [si]: e.target.value }))}
                placeholder={t("Your reflection...", "Refleksi Anda...", "Jouw reflectie...")}
                rows={3}
                style={{ width: "100%", padding: "14px 16px", fontFamily: serif, fontSize: 16, color: bodyText, background: offWhite, border: "1px solid oklch(88% 0.01 80)", borderRadius: 4, resize: "vertical", lineHeight: 1.75, boxSizing: "border-box" }}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Biblical Foundation */}
      <div style={{ background: navy, padding: "80px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {t("Biblical Foundation", "Dasar Alkitab", "Bijbelse Basis")}
          </p>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(20px, 3vw, 30px)", fontWeight: 800, color: offWhite, marginBottom: 40 }}>
            {t("Feedback in Scripture", "Umpan Balik dalam Kitab Suci", "Feedback in de Schrift")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {[
              {
                id: "prov-15-1",
                en_body: "Proverbs 15:1 is not simply advice to be polite. It is a recognition that the method of delivery determines whether the message is received at all. A harsh word 'stirs up anger' — meaning it triggers defensiveness that closes the listener. The same message, delivered gently, reaches them. The cross-cultural leader understands that the same is true across cultures: the method shapes the reception.",
                id_body: "Amsal 15:1 bukan sekadar saran untuk bersikap sopan. Ini adalah pengakuan bahwa metode penyampaian menentukan apakah pesan diterima sama sekali. Kata yang pedas 'membangkitkan marah' — artinya memicu defensivitas yang menutup pendengar. Pemimpin lintas budaya memahami bahwa hal yang sama berlaku di berbagai budaya.",
                nl_body: "Spreuken 15:1 is niet simpelweg advies om beleefd te zijn. Het is een erkenning dat de bezorgmethode bepaalt of de boodschap überhaupt wordt ontvangen. Een krenkend woord 'prikkelt tot woede' — het activeert verdediging die de luisteraar sluit. De interculturele leider begrijpt dat hetzelfde geldt voor culturen.",
              },
              {
                id: "prov-27-5-6",
                en_body: "Proverbs 27:5–6 pushes back against the leader who avoids hard conversations in the name of cultural sensitivity. Withholding honest feedback is not a form of care — the proverb calls it 'hidden love', which is no love at all. Every cultural context values clarity delivered with genuine care. The question is always how, not whether. A leader who never gives honest feedback because they fear cross-cultural discomfort is failing their team — in any culture.",
                id_body: "Amsal 27:5–6 mendorong kembali pemimpin yang menghindari percakapan sulit atas nama kepekaan budaya. Menahan umpan balik yang jujur bukanlah bentuk kepedulian — amsal menyebutnya 'kasih yang tersembunyi', yang sama sekali bukan kasih. Setiap konteks budaya menghargai kejelasan yang disampaikan dengan kepedulian yang tulus.",
                nl_body: "Spreuken 27:5–6 weerlegt de leider die moeilijke gesprekken vermijdt in naam van culturele sensitiviteit. Eerlijke feedback achterhouden is geen vorm van zorg — het spreekwoord noemt het 'verborgen liefde', wat helemaal geen liefde is. Elke culturele context waardeert duidelijkheid geleverd met echte zorg.",
              },
            ].map((item) => {
              const vd = VERSES[item.id as keyof typeof VERSES];
              return (
                <div key={item.id}>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.1em", marginBottom: 14 }}>
                    <VerseRef id={item.id}>{lang === "en" ? vd.en_ref : lang === "id" ? vd.id_ref : vd.nl_ref}</VerseRef>
                  </p>
                  <p style={{ fontFamily: serif, fontSize: "clamp(17px, 1.9vw, 21px)", fontStyle: "italic", color: offWhite, lineHeight: 1.7, marginBottom: 20 }}>
                    "{lang === "en" ? vd.en : lang === "id" ? vd.id : vd.nl}"
                  </p>
                  <p style={{ fontSize: 15, color: "oklch(76% 0.03 80)", lineHeight: 1.75, margin: 0 }}>
                    {lang === "en" ? item.en_body : lang === "id" ? item.id_body : item.nl_body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Four Principles */}
      <div style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(20px, 3vw, 30px)", fontWeight: 800, color: navy, marginBottom: 48, textAlign: "center" }}>
            {t("Four Principles to Keep", "Empat Prinsip untuk Dipegang", "Vier Principes om te Onthouden")}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 24 }}>
            {PRINCIPLES.map((p) => (
              <div key={p.num} style={{ background: lightGray, padding: "28px 28px" }}>
                <div style={{ fontFamily: serif, fontSize: 44, fontWeight: 700, color: orange, lineHeight: 1, marginBottom: 16 }}>{p.num}</div>
                <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 15, fontWeight: 800, color: navy, marginBottom: 12, lineHeight: 1.3 }}>
                  {lang === "en" ? p.en_title : lang === "id" ? p.id_title : p.nl_title}
                </h3>
                <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                  {lang === "en" ? p.en_body : lang === "id" ? p.id_body : p.nl_body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: navy, padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(20px, 3vw, 30px)", fontWeight: 800, color: offWhite, marginBottom: 16 }}>
          {t("Keep Growing", "Terus Bertumbuh", "Blijf Groeien")}
        </h2>
        <p style={{ fontSize: 15, color: "oklch(76% 0.03 80)", lineHeight: 1.75, maxWidth: 520, margin: "0 auto 40px" }}>
          {t("Explore more resources to deepen your cross-cultural leadership.", "Jelajahi lebih banyak sumber untuk memperdalam kepemimpinan lintas budaya Anda.", "Verken meer bronnen om je intercultureel leiderschap te verdiepen.")}
        </p>
        <Link href="/resources" style={{ display: "inline-block", padding: "14px 36px", background: orange, color: offWhite, fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, textDecoration: "none", borderRadius: 4 }}>
          {t("← Content Library", "← Perpustakaan Konten", "← Contentbibliotheek")}
        </Link>
      </div>

      {/* Verse Popup */}
      {activeVerse && verseData && (
        <div onClick={() => setActiveVerse(null)} style={{ position: "fixed", inset: 0, background: "oklch(10% 0.05 260 / 0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: offWhite, borderRadius: 12, padding: "44px 40px", maxWidth: 540, width: "100%" }}>
            <p style={{ fontFamily: serif, fontSize: 22, lineHeight: 1.7, color: navy, fontStyle: "italic", marginBottom: 20 }}>
              "{lang === "en" ? verseData.en : lang === "id" ? verseData.id : verseData.nl}"
            </p>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em", marginBottom: 28 }}>
              — {lang === "en" ? verseData.en_ref : lang === "id" ? verseData.id_ref : verseData.nl_ref}{" "}
              {lang === "en" ? "(NIV)" : lang === "id" ? "(TB)" : "(NBV)"}
            </p>
            <button onClick={() => setActiveVerse(null)} style={{ padding: "10px 24px", background: navy, color: offWhite, border: "none", borderRadius: 6, fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              {t("Close", "Tutup", "Sluiten")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
