"use client";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

// ─── TYPES ──────────────────────────────────────────────────────────────────

type Lang = "en" | "id" | "nl";
type Props = { userPathway: string | null; isSaved: boolean };

const tFn = (en: string, id: string, nl: string, lang: Lang): string =>
  lang === "en" ? en : lang === "id" ? id : nl;

// ─── VERSES ─────────────────────────────────────────────────────────────────

const VERSES = {
  "col-3-14": {
    en_ref: "Colossians 3:14",
    id_ref: "Kolose 3:14",
    nl_ref: "Kolossenzen 3:14",
    en: "And over all these virtues put on love, which binds them all together in perfect unity.",
    id: "Dan di atas semuanya itu: kenakanlah kasih, sebagai pengikat yang mempersatukan dan menyempurnakan.",
    nl: "En bovenal: draag de liefde, die alles bijeenhoudt en het geheel volmaakt.",
    en_version: "NIV",
    id_version: "TB",
    nl_version: "NBV",
  },
  "acts-15-39": {
    en_ref: "Acts 15:39",
    id_ref: "Kisah Para Rasul 15:39",
    nl_ref: "Handelingen 15:39",
    en: "They had such a sharp disagreement that they parted company.",
    id: "Hal itu menimbulkan pertentangan yang tajam, sehingga mereka berpisah.",
    nl: "Ze kregen zo'n ernstig conflict dat ze uit elkaar gingen.",
    en_version: "NIV",
    id_version: "TB",
    nl_version: "NBV",
  },
};

// ─── SKILL SECTIONS ─────────────────────────────────────────────────────────

type SkillKey = "listening" | "conflict" | "loss";

const SKILLS: {
  key: SkillKey;
  accentColor: string;
  accentBg: string;
  icon: string;
  en_label: string;
  id_label: string;
  nl_label: string;
  en_subtitle: string;
  id_subtitle: string;
  nl_subtitle: string;
  en_intro: string;
  id_intro: string;
  nl_intro: string;
  en_scenario_heading: string;
  id_scenario_heading: string;
  nl_scenario_heading: string;
  en_scenario: string;
  id_scenario: string;
  nl_scenario: string;
  en_typical_label: string;
  id_typical_label: string;
  nl_typical_label: string;
  en_typical: string;
  id_typical: string;
  nl_typical: string;
  en_better_label: string;
  id_better_label: string;
  nl_better_label: string;
  en_better: string;
  id_better: string;
  nl_better: string;
  en_technique_heading: string;
  id_technique_heading: string;
  nl_technique_heading: string;
  en_technique_steps: { label: string; body: string }[];
  id_technique_steps: { label: string; body: string }[];
  nl_technique_steps: { label: string; body: string }[];
}[] = [
  {
    key: "listening",
    accentColor: "oklch(45% 0.14 200)",
    accentBg: "oklch(45% 0.14 200 / 0.08)",
    icon: "👂",
    en_label: "Skill 1 — Loving Listening",
    id_label: "Keterampilan 1 — Mendengarkan dengan Kasih",
    nl_label: "Vaardigheid 1 — Liefdevol Luisteren",
    en_subtitle: "The shift from advice-giver to question-asker",
    id_subtitle: "Beralih dari pemberi saran menjadi penanya",
    nl_subtitle: "De verschuiving van adviesgever naar vraagsteller",
    en_intro:
      "Most of us were trained to fix, advise, and respond quickly. We bring solutions before the other person has finished speaking. But in cross-cultural teams — where context is rarely fully visible — the first and most powerful skill is simply this: stay longer in the question. Loving listening is not passive silence. It is an active choice to understand before being understood, and to ask before assuming.",
    id_intro:
      "Sebagian besar dari kita dilatih untuk memperbaiki, memberi saran, dan merespons dengan cepat. Kita membawa solusi sebelum orang lain selesai berbicara. Namun dalam tim lintas budaya — di mana konteks jarang sepenuhnya terlihat — keterampilan pertama dan paling kuat adalah ini: tinggallah lebih lama dalam pertanyaan. Mendengarkan dengan kasih bukan diam yang pasif. Ini adalah pilihan aktif untuk memahami sebelum dipahami, dan bertanya sebelum berasumsi.",
    nl_intro:
      "De meesten van ons zijn getraind om te repareren, adviseren en snel te reageren. We brengen oplossingen voordat de ander klaar is met spreken. Maar in interculturele teams — waar de context zelden volledig zichtbaar is — is de eerste en krachtigste vaardigheid simpelweg: blijf langer in de vraag. Liefdevol luisteren is geen passief stilzwijgen. Het is een actieve keuze om te begrijpen voordat je begrepen wilt worden, en te vragen voordat je aanneemt.",
    en_scenario_heading: "The scenario",
    id_scenario_heading: "Skenario",
    nl_scenario_heading: "Het scenario",
    en_scenario:
      "A colleague from a different cultural background approaches you after a team meeting. She says quietly: \"I'm not sure I can keep going like this. Everything feels so heavy.\"",
    id_scenario:
      "Seorang kolega dari latar belakang budaya yang berbeda mendekati Anda setelah rapat tim. Dia berkata pelan: \"Saya tidak yakin bisa terus seperti ini. Semuanya terasa begitu berat.\"",
    nl_scenario:
      "Een collega met een andere culturele achtergrond spreekt je aan na een teamvergadering. Ze zegt zachtjes: \"Ik weet niet of ik zo door kan gaan. Alles voelt zo zwaar.\"",
    en_typical_label: "Typical response",
    id_typical_label: "Respons umum",
    nl_typical_label: "Typische reactie",
    en_typical:
      "\"I know how you feel. Have you tried taking some time off? You probably just need rest. Things will get better — remember why you're here. Let me know if I can help with your workload.\"",
    id_typical:
      "\"Saya mengerti perasaanmu. Sudahkah kamu mencoba mengambil waktu istirahat? Kamu mungkin hanya perlu istirahat. Semuanya akan membaik — ingat kenapa kamu ada di sini. Beri tahu saya jika saya bisa membantu dengan beban kerjamu.\"",
    nl_typical:
      "\"Ik begrijp hoe je je voelt. Heb je geprobeerd wat vrij te nemen? Je hebt waarschijnlijk gewoon rust nodig. Het wordt beter — onthoud waarom je hier bent. Laat me weten als ik kan helpen met je werkdruk.\"",
    en_better_label: "Loving listening response",
    id_better_label: "Respons mendengarkan dengan kasih",
    nl_better_label: "Liefdevol luisterende reactie",
    en_better:
      "\"That sounds really hard. [Pause.] What's making it feel the heaviest right now?\" Then wait. Fully. Don't rescue, don't redirect. The pause is not awkward — it is the space where the real thing surfaces.",
    id_better:
      "\"Kedengarannya sangat berat. [Jeda.] Apa yang membuat semuanya terasa paling berat saat ini?\" Kemudian tunggu. Sepenuhnya. Jangan selamatkan, jangan alihkan. Jeda itu tidak canggung — itu adalah ruang di mana hal yang sesungguhnya muncul.",
    nl_better:
      "\"Dat klinkt heel zwaar. [Pauze.] Wat maakt het op dit moment het zwaarst?\" Wacht dan. Volledig. Red niet, leid niet af. De stilte is niet ongemakkelijk — het is de ruimte waar het echte zich openbaart.",
    en_technique_heading: "The technique: Reflect · Ask · Wait",
    id_technique_heading: "Tekniknya: Refleksikan · Tanyakan · Tunggu",
    nl_technique_heading: "De techniek: Reflecteer · Vraag · Wacht",
    en_technique_steps: [
      {
        label: "Reflect",
        body: "Mirror back what you heard — not a summary, a reflection. \"That sounds exhausting.\" \"It sounds like something shifted recently.\" This signals: I received what you said. It is not therapy-speak — it is presence.",
      },
      {
        label: "Ask",
        body: "Ask one open question — not a checklist. \"What feels hardest right now?\" or \"Where is most of the weight coming from?\" One question, then stop. Multiple questions in a row shut people down, especially in high-context cultures where being interrogated triggers silence.",
      },
      {
        label: "Wait",
        body: "Silence is not a problem to fix. In many Asian, African, and Middle Eastern cultures, a meaningful pause before responding signals respect and thoughtfulness. Western communicators are often trained to fill silence — but silence is often where the real answer forms. Give it 5 seconds. Then 10.",
      },
    ],
    id_technique_steps: [
      {
        label: "Refleksikan",
        body: "Cerminkan kembali apa yang Anda dengar — bukan ringkasan, tapi refleksi. \"Kedengarannya melelahkan.\" \"Sepertinya ada sesuatu yang berubah belakangan ini.\" Ini memberi sinyal: saya menerima apa yang Anda katakan. Ini bukan bahasa terapi — ini adalah kehadiran.",
      },
      {
        label: "Tanyakan",
        body: "Ajukan satu pertanyaan terbuka — bukan daftar periksa. \"Apa yang paling berat saat ini?\" atau \"Dari mana sebagian besar tekanan itu datang?\" Satu pertanyaan, lalu berhenti. Beberapa pertanyaan berturut-turut membuat orang diam, terutama dalam budaya high-context di mana diinterogasi memicu keheningan.",
      },
      {
        label: "Tunggu",
        body: "Keheningan bukan masalah yang harus diperbaiki. Dalam banyak budaya Asia, Afrika, dan Timur Tengah, jeda bermakna sebelum merespons menandakan rasa hormat dan kedalaman pikiran. Komunikator Barat sering dilatih untuk mengisi keheningan — tetapi keheningan sering kali adalah tempat jawaban nyata terbentuk. Berikan 5 detik. Kemudian 10.",
      },
    ],
    nl_technique_steps: [
      {
        label: "Reflecteer",
        body: "Spiegel terug wat je hoorde — geen samenvatting, maar een reflectie. \"Dat klinkt uitputtend.\" \"Het lijkt alsof er recent iets is verschoven.\" Dit geeft een signaal: ik heb ontvangen wat je zei. Het is geen therapietaal — het is aanwezigheid.",
      },
      {
        label: "Vraag",
        body: "Stel één open vraag — geen vragenlijst. \"Wat voelt op dit moment het zwaarst?\" of \"Waar komt het meeste gewicht vandaan?\" Één vraag, dan stoppen. Meerdere vragen achter elkaar sluiten mensen af, zeker in high-context culturen waar ondervraagd worden stilte oproept.",
      },
      {
        label: "Wacht",
        body: "Stilte is geen probleem om op te lossen. In veel Aziatische, Afrikaanse en Midden-Oosterse culturen signaleert een betekenisvolle pauze voor het antwoorden respect en bedachtzaamheid. Westerse communicatoren zijn vaak getraind om stilte te vullen — maar stilte is vaak de plek waar het echte antwoord zich vormt. Geef het 5 seconden. Dan 10.",
      },
    ],
  },
  {
    key: "conflict",
    accentColor: "oklch(50% 0.17 30)",
    accentBg: "oklch(50% 0.17 30 / 0.08)",
    icon: "⚡",
    en_label: "Skill 2 — Navigating Conflict",
    id_label: "Keterampilan 2 — Menavigasi Konflik",
    nl_label: "Vaardigheid 2 — Conflict Navigeren",
    en_subtitle: "Cross-cultural conflict escalation patterns",
    id_subtitle: "Pola eskalasi konflik lintas budaya",
    nl_subtitle: "Interculturele conflictescalatiepatronen",
    en_intro:
      "Conflict in cross-cultural teams doesn't announce itself clearly. It often moves in patterns that are invisible to the uninitiated — especially when cultural rules about directness, hierarchy, and face differ significantly. Understanding the three stages of escalation, and what typically goes wrong at each stage, is the difference between a team that repairs and a team that fractures.",
    id_intro:
      "Konflik dalam tim lintas budaya tidak mengumumkan dirinya dengan jelas. Sering kali bergerak dalam pola yang tidak terlihat bagi yang belum berpengalaman — terutama ketika aturan budaya tentang keterusterangan, hierarki, dan menjaga muka berbeda secara signifikan. Memahami tiga tahap eskalasi, dan apa yang biasanya salah di setiap tahap, adalah perbedaan antara tim yang memperbaiki diri dan tim yang retak.",
    nl_intro:
      "Conflict in interculturele teams kondigt zichzelf niet duidelijk aan. Het verloopt vaak in patronen die onzichtbaar zijn voor de oningewijde — vooral wanneer culturele regels over directheid, hiërarchie en gezichtsbehoud significant verschillen. Het begrijpen van de drie escalatiestadia, en wat er typisch misgaat in elk stadium, maakt het verschil tussen een team dat zich herstelt en een team dat breekt.",
    en_scenario_heading: "Three stages of escalation",
    id_scenario_heading: "Tiga tahap eskalasi",
    nl_scenario_heading: "Drie escalatiestadia",
    en_scenario:
      "A senior team member repeatedly dismisses ideas from a junior colleague in team meetings — not aggressively, but consistently. The junior colleague says nothing in the meetings, but begins withdrawing from team activities.",
    id_scenario:
      "Seorang anggota tim senior berulang kali mengabaikan ide dari kolega junior dalam rapat tim — tidak secara agresif, tetapi secara konsisten. Kolega junior tidak berkata apa-apa dalam rapat, tetapi mulai menarik diri dari kegiatan tim.",
    nl_scenario:
      "Een senior teamlid spreekt herhaaldelijk ideeën van een junior collega tegen in teamvergaderingen — niet agressief, maar consequent. De junior collega zegt niets in de vergaderingen, maar begint zich terug te trekken uit teamactiviteiten.",
    en_typical_label: "Stage 1 — Signal",
    id_typical_label: "Tahap 1 — Sinyal",
    nl_typical_label: "Fase 1 — Signaal",
    en_typical:
      "The junior colleague's silence and withdrawal IS the signal — in many Asian and African cultural contexts, this is how conflict is communicated. It is not passive; it is a message. The typical mistake: the Western team leader reads the withdrawal as disengagement or personality, rather than as a relational signal that something is wrong.",
    id_typical:
      "Keheningan dan penarikan diri kolega junior ADALAH sinyalnya — dalam banyak konteks budaya Asia dan Afrika, inilah cara konflik dikomunikasikan. Ini bukan pasif; ini adalah pesan. Kesalahan umum: pemimpin tim Barat membaca penarikan diri sebagai ketidaktertarikan atau kepribadian, bukan sebagai sinyal relasional bahwa ada sesuatu yang salah.",
    nl_typical:
      "De stilte en het terugtrekken van de junior collega IS het signaal — in veel Aziatische en Afrikaanse culturele contexten is dit de manier waarop conflict wordt gecommuniceerd. Het is niet passief; het is een boodschap. De typische fout: de Westerse teamleider leest het terugtrekken als desinteresse of persoonlijkheid, niet als een relationeel signaal dat er iets mis is.",
    en_better_label: "Stage 2 — Response",
    id_better_label: "Tahap 2 — Respons",
    nl_better_label: "Fase 2 — Reactie",
    en_better:
      "When the signal is ignored, one of two things happens: the unaddressed tension calcifies into resentment (the relationship slowly dies), or it erupts later at a higher intensity — often in the wrong context. The critical response window is between signal and escalation. A skilled leader names what they have noticed — not the conflict itself, but the pattern. Privately, gently, specifically: \"I've noticed you've been quieter recently. Is there something I should be aware of?\"",
    id_better:
      "Ketika sinyal diabaikan, salah satu dari dua hal terjadi: ketegangan yang tidak ditangani mengeras menjadi kebencian (hubungan perlahan mati), atau meledak kemudian dengan intensitas lebih tinggi — sering dalam konteks yang salah. Jendela respons kritis berada antara sinyal dan eskalasi. Seorang pemimpin terampil menyebutkan apa yang mereka perhatikan — bukan konfliknya sendiri, tapi polanya. Secara pribadi, dengan lembut, dan spesifik: \"Saya perhatikan Anda lebih pendiam belakangan ini. Apakah ada sesuatu yang harus saya ketahui?\"",
    nl_better:
      "Wanneer het signaal wordt genegeerd, gebeurt een van twee dingen: de onbehandelde spanning verstijft tot wrok (de relatie sterft langzaam), of het barst later los met hogere intensiteit — vaak in de verkeerde context. Het kritieke responsvenster ligt tussen het signaal en de escalatie. Een vaardige leider benoemt wat hij heeft opgemerkt — niet het conflict zelf, maar het patroon. Privé, vriendelijk, specifiek: \"Ik heb gemerkt dat je de laatste tijd stiller bent. Is er iets wat ik moet weten?\"",
    en_technique_heading: "Stage 3 — Resolution",
    id_technique_heading: "Tahap 3 — Resolusi",
    nl_technique_heading: "Fase 3 — Oplossing",
    en_technique_steps: [
      {
        label: "Resolution is not the same as agreement",
        body: "Cross-cultural conflict resolution rarely ends in explicit mutual acknowledgement — especially in high-context cultures where directly naming a conflict can feel more damaging than the conflict itself. Resolution may look like: the senior team member begins including the junior's ideas, the junior begins re-engaging, and neither party ever says the word 'conflict.' The relationship moves forward.",
      },
      {
        label: "Third-party facilitation",
        body: "In many cultural contexts, conflict is best resolved through a trusted intermediary — not as a sign of failure, but as the culturally appropriate path. A respected team member, a senior pastor, or an elder figure who carries weight with both parties can often unlock movement that direct confrontation cannot. Western leaders who insist on direct resolution may be applying their own cultural framework rather than serving the relationship.",
      },
      {
        label: "Don't wait for a crisis",
        body: "The most effective conflict navigation happens long before any single event — by building a team culture where small tensions are named early, where questions are safe to ask, and where leaders model the vulnerability of saying: \"I think something is off between us. Can we talk?\" Prevention is not the absence of conflict. It is a culture where conflict moves quickly to the surface rather than festering underneath.",
      },
    ],
    id_technique_steps: [
      {
        label: "Resolusi tidak sama dengan kesepakatan",
        body: "Resolusi konflik lintas budaya jarang berakhir dengan pengakuan bersama yang eksplisit — terutama dalam budaya high-context di mana secara langsung menyebut konflik bisa terasa lebih merusak daripada konflik itu sendiri. Resolusi mungkin terlihat seperti: anggota tim senior mulai memasukkan ide junior, junior mulai terlibat kembali, dan tidak ada pihak yang pernah menyebut kata 'konflik.' Hubungan bergerak maju.",
      },
      {
        label: "Fasilitasi pihak ketiga",
        body: "Dalam banyak konteks budaya, konflik paling baik diselesaikan melalui perantara yang dipercaya — bukan sebagai tanda kegagalan, tetapi sebagai jalur yang tepat secara budaya. Anggota tim yang dihormati, pendeta senior, atau tokoh penatua yang memiliki bobot bagi kedua pihak sering kali dapat membuka jalan yang tidak bisa dilakukan konfrontasi langsung. Pemimpin Barat yang bersikeras pada resolusi langsung mungkin menerapkan kerangka budaya mereka sendiri daripada melayani hubungan tersebut.",
      },
      {
        label: "Jangan menunggu krisis",
        body: "Navigasi konflik yang paling efektif terjadi jauh sebelum peristiwa tunggal apa pun — dengan membangun budaya tim di mana ketegangan kecil disebutkan lebih awal, di mana pertanyaan aman untuk diajukan, dan di mana pemimpin memodelkan kerentanan dengan mengatakan: \"Saya pikir ada sesuatu yang tidak beres di antara kita. Bisakah kita bicara?\" Pencegahan bukan ketidakhadiran konflik. Itu adalah budaya di mana konflik bergerak cepat ke permukaan daripada membusuk di bawah.",
      },
    ],
    nl_technique_steps: [
      {
        label: "Oplossing is niet hetzelfde als overeenstemming",
        body: "Interculturele conflictoplossing eindigt zelden in expliciete wederzijdse erkenning — zeker in high-context culturen waar het direct benoemen van een conflict beschadigender kan aanvoelen dan het conflict zelf. Oplossing kan er zo uitzien: het senior teamlid begint de ideeën van de junior op te nemen, de junior begint opnieuw deel te nemen, en geen van beide partijen zegt ooit het woord 'conflict.' De relatie gaat vooruit.",
      },
      {
        label: "Facilitatie door een derde partij",
        body: "In veel culturele contexten wordt conflict het beste opgelost via een vertrouwde tussenpersoon — niet als teken van falen, maar als de cultureel passende weg. Een gerespecteerd teamlid, een senior pastor of een oudstefiguur die gewicht draagt bij beide partijen kan vaak beweging ontgrendelen die directe confrontatie niet kan. Westerse leiders die aandringen op directe oplossing passen mogelijk hun eigen culturele kader toe in plaats van de relatie te dienen.",
      },
      {
        label: "Wacht niet op een crisis",
        body: "De meest effectieve conflictnavigatie vindt plaats lang voordat een enkel incident zich voordoet — door een teamcultuur te bouwen waar kleine spanningen vroeg worden benoemd, waar vragen veilig zijn om te stellen, en waar leiders de kwetsbaarheid modelleren van zeggen: \"Ik denk dat er iets niet klopt tussen ons. Kunnen we praten?\" Preventie is niet de afwezigheid van conflict. Het is een cultuur waarin conflict snel naar de oppervlakte beweegt in plaats van eronder te gisten.",
      },
    ],
  },
  {
    key: "loss",
    accentColor: "oklch(42% 0.12 290)",
    accentBg: "oklch(42% 0.12 290 / 0.08)",
    icon: "🕊",
    en_label: "Skill 3 — Processing Loss Together",
    id_label: "Keterampilan 3 — Memproses Kehilangan Bersama",
    nl_label: "Vaardigheid 3 — Verlies Samen Verwerken",
    en_subtitle: "The unique grief of cross-cultural life",
    id_subtitle: "Duka unik kehidupan lintas budaya",
    nl_subtitle: "Het unieke verdriet van intercultureel leven",
    en_intro:
      "Cross-cultural workers don't just experience losses — they accumulate them. Every departure, every transition, every goodbye is a small grief that rarely gets named, let alone processed. Missionary families and international team workers often live with compacted grief: the losses stack up faster than they can be processed, and the culture of the field can make it feel inappropriate to grieve at all. This is where relational breakdown often begins — not in conflict, but in unexpressed loss.",
    id_intro:
      "Pekerja lintas budaya tidak hanya mengalami kehilangan — mereka mengumpulkannya. Setiap kepergian, setiap transisi, setiap perpisahan adalah duka kecil yang jarang disebutkan, apalagi diproses. Keluarga misionaris dan pekerja tim internasional sering hidup dengan duka yang tertekan: kehilangan menumpuk lebih cepat dari yang bisa diproses, dan budaya lapangan dapat membuat segalanya terasa tidak pantas untuk berduka sama sekali. Di sinilah kerusakan relasional sering dimulai — bukan dalam konflik, tetapi dalam kehilangan yang tidak terungkapkan.",
    nl_intro:
      "Interculturele werkers ervaren niet alleen verlies — ze accumuleren het. Elke vertrek, elke overgang, elk afscheid is een klein verdriet dat zelden wordt benoemd, laat staan verwerkt. Zendingsfamilies en internationale teamwerkers leven vaak met samengeperst verdriet: de verliezen stapelen zich sneller op dan ze kunnen worden verwerkt, en de cultuur van het veld kan het ongepast laten aanvoelen om überhaupt te rouwen. Dit is waar relationele afbraak vaak begint — niet in conflict, maar in onuitgesproken verlies.",
    en_scenario_heading: "What accumulated loss looks like",
    id_scenario_heading: "Seperti apa akumulasi kehilangan",
    nl_scenario_heading: "Hoe geaccumuleerd verlies eruitziet",
    en_scenario:
      "A team member who has been on the field for four years. In that time: two close colleagues have left, their child changed schools twice, their home church changed leadership, they were repatriated once during a political crisis and had to leave within 48 hours, and last month their closest local friend moved cities. Each loss was brief. None was formally acknowledged. They show up to team meetings on time, carry their responsibilities, and laugh at the right moments. Inside, they are running on empty.",
    id_scenario:
      "Seorang anggota tim yang telah berada di lapangan selama empat tahun. Dalam waktu itu: dua kolega dekat telah pergi, anak mereka berganti sekolah dua kali, gereja rumah mereka berganti kepemimpinan, mereka dipulangkan sekali selama krisis politik dan harus pergi dalam 48 jam, dan bulan lalu sahabat lokal terdekat mereka pindah kota. Setiap kehilangan berlangsung singkat. Tidak ada yang secara resmi diakui. Mereka datang ke rapat tim tepat waktu, mengemban tanggung jawab mereka, dan tertawa pada saat yang tepat. Di dalam, mereka kehabisan energi.",
    nl_scenario:
      "Een teamlid dat vier jaar op het veld is. In die tijd: twee nauwe collega's zijn vertrokken, hun kind is twee keer van school veranderd, hun thuiskerk heeft van leiderschap gewisseld, ze zijn eenmaal gerepatrieerd tijdens een politieke crisis en moesten binnen 48 uur vertrekken, en vorige maand is hun naaste lokale vriend naar een andere stad verhuisd. Elk verlies was kort. Geen enkel werd formeel erkend. Ze komen op tijd naar teamvergaderingen, dragen hun verantwoordelijkheden en lachen op de juiste momenten. Van binnen draaien ze op lege tank.",
    en_typical_label: "What teams typically miss",
    id_typical_label: "Yang biasanya dilewatkan tim",
    nl_typical_label: "Wat teams typisch missen",
    en_typical:
      "Teams that function well operationally often have no language for grief. The debrief focuses on tasks, logistics, and forward planning — never: \"What have we lost this season? What do we need to grieve before we move on?\" The cost of not naming loss is high: disengagement, resentment toward leadership, compassion fatigue, and — most commonly — premature departure.",
    id_typical:
      "Tim yang berfungsi baik secara operasional sering tidak memiliki bahasa untuk kesedihan. Debriefing berfokus pada tugas, logistik, dan perencanaan ke depan — tidak pernah: \"Apa yang telah kita kehilangan musim ini? Apa yang perlu kita ratapi sebelum kita melanjutkan?\" Biaya tidak menyebutkan kehilangan itu tinggi: ketidakterlibatan, kebencian terhadap kepemimpinan, kelelahan welas asih, dan — paling umum — kepergian prematur.",
    nl_typical:
      "Teams die operationeel goed functioneren hebben vaak geen taal voor verdriet. De debriefing richt zich op taken, logistiek en vooruitplannen — nooit: \"Wat hebben we dit seizoen verloren? Wat moeten we rouwen voordat we verdergaan?\" De kosten van het niet benoemen van verlies zijn hoog: ontkoppeling, wrok jegens leiderschap, compassiemoeheid, en — het meest voorkomend — voortijdig vertrek.",
    en_better_label: "How to create space for loss",
    id_better_label: "Cara menciptakan ruang untuk kehilangan",
    nl_better_label: "Hoe ruimte te creëren voor verlies",
    en_better:
      "It starts with the leader naming their own losses first. Not as a performance of vulnerability, but as genuine modelling: \"Before we look at the quarter ahead, I want to name something we've lost. Sarah leaving took something from this team. I miss working with her. Does anyone else want to name what they've been carrying?\" This simple act — naming, inviting, and not rushing past — creates the relational safety that keeps people on the field.",
    id_better:
      "Ini dimulai dengan pemimpin yang menyebutkan kehilangan mereka sendiri terlebih dahulu. Bukan sebagai pertunjukan kerentanan, tetapi sebagai pemodelan yang tulus: \"Sebelum kita melihat kuartal ke depan, saya ingin menyebutkan sesuatu yang telah kita kehilangan. Kepergian Sarah mengambil sesuatu dari tim ini. Saya merindukan bekerja dengannya. Adakah orang lain yang ingin menyebutkan apa yang telah mereka bawa?\" Tindakan sederhana ini — menyebutkan, mengundang, dan tidak terburu-buru melewati — menciptakan keamanan relasional yang membuat orang tetap di lapangan.",
    nl_better:
      "Het begint met de leider die zijn eigen verliezen als eerste benoemt. Niet als een vertoning van kwetsbaarheid, maar als oprecht modelleren: \"Voordat we naar het komende kwartaal kijken, wil ik iets benoemen wat we hebben verloren. Sarah's vertrek heeft iets van dit team weggenomen. Ik mis het samenwerken met haar. Wil iemand anders benoemen wat ze met zich meedragen?\" Deze eenvoudige handeling — benoemen, uitnodigen, en niet snel voorbijgaan — creëert de relationele veiligheid die mensen op het veld houdt.",
    en_technique_heading: "Three practices for teams",
    id_technique_heading: "Tiga praktik untuk tim",
    nl_technique_heading: "Drie praktijken voor teams",
    en_technique_steps: [
      {
        label: "The goodbye ritual",
        body: "Every departure deserves a named farewell — not just a cake and a card, but a structured moment where the team speaks honestly about what this person contributed and what leaves with them. The goodbye ritual is not sentimental; it is a grief hygiene practice that prevents accumulated unspoken loss.",
      },
      {
        label: "The quarterly grief check",
        body: "Once per quarter, before the forward-planning session, add one question to the team meeting: \"What has this team lost — in people, in momentum, in dreams — that we haven't yet acknowledged?\" Keep a physical list visible. Naming is not the same as wallowing. It is how teams stay resilient.",
      },
      {
        label: "The personal loss inventory",
        body: "As a leader, regularly ask your team members individually: \"How is the weight of transition sitting with you right now?\" Not 'how are you doing?' (which gets a social answer) but a specific, honest invitation. Cross-cultural workers often carry losses silently because no one ever asked. You asking changes that.",
      },
    ],
    id_technique_steps: [
      {
        label: "Ritual perpisahan",
        body: "Setiap kepergian layak mendapat perpisahan yang disebutkan — bukan hanya kue dan kartu, tetapi momen terstruktur di mana tim berbicara dengan jujur tentang apa yang dikontribusikan orang ini dan apa yang pergi bersama mereka. Ritual perpisahan bukan sentimental; ini adalah praktik kebersihan duka yang mencegah akumulasi kehilangan yang tidak terucapkan.",
      },
      {
        label: "Pemeriksaan duka triwulanan",
        body: "Sekali per kuartal, sebelum sesi perencanaan ke depan, tambahkan satu pertanyaan pada rapat tim: \"Apa yang telah tim ini kehilangan — dalam orang, dalam momentum, dalam mimpi — yang belum kita akui?\" Simpan daftar fisik yang terlihat. Menyebutkan tidak sama dengan larut. Begitulah cara tim tetap tangguh.",
      },
      {
        label: "Inventaris kehilangan pribadi",
        body: "Sebagai pemimpin, secara rutin tanyakan kepada anggota tim Anda secara individual: \"Bagaimana beban transisi ini duduk denganmu saat ini?\" Bukan 'bagaimana kabarmu?' (yang mendapat jawaban sosial) tetapi undangan yang spesifik dan jujur. Pekerja lintas budaya sering membawa kehilangan dalam diam karena tidak ada yang pernah bertanya. Anda bertanya mengubah itu.",
      },
    ],
    nl_technique_steps: [
      {
        label: "Het afscheidsritueel",
        body: "Elk vertrek verdient een benoemd afscheid — niet alleen een taart en een kaart, maar een gestructureerd moment waarop het team eerlijk spreekt over wat deze persoon heeft bijgedragen en wat met hen meegaat. Het afscheidsritueel is niet sentimenteel; het is een rouwhygiënepraktijk die voorkomt dat onuitgesproken verlies zich opstapelt.",
      },
      {
        label: "De kwartaalrouwcheck",
        body: "Eén keer per kwartaal, vóór de vooruitplanningssessie, voeg je één vraag toe aan de teamvergadering: \"Wat heeft dit team verloren — in mensen, in momentum, in dromen — dat we nog niet hebben erkend?\" Houd een zichtbare fysieke lijst bij. Benoemen is niet hetzelfde als blijven hangen. Het is hoe teams veerkrachtig blijven.",
      },
      {
        label: "De persoonlijke verliesinventaris",
        body: "Als leider vraag je teamleden regelmatig individueel: \"Hoe draag je het gewicht van de overgang op dit moment?\" Niet 'hoe gaat het met je?' (wat een sociaal antwoord krijgt) maar een specifieke, eerlijke uitnodiging. Interculturele werkers dragen verliezen vaak stilletjes omdat niemand ooit vroeg. Dat je vraagt verandert dat.",
      },
    ],
  },
];

// ─── HEALTH CHECK STATEMENTS ────────────────────────────────────────────────

const HEALTH_CHECKS: {
  id: string;
  en: string;
  id_lang: string;
  nl: string;
}[] = [
  {
    id: "hc1",
    en: "When a colleague shares something difficult, my first instinct is to listen — not to fix or advise.",
    id_lang: "Ketika seorang kolega berbagi sesuatu yang sulit, insting pertama saya adalah mendengarkan — bukan memperbaiki atau memberi saran.",
    nl: "Wanneer een collega iets moeilijks deelt, is mijn eerste instinct te luisteren — niet oplossen of adviseren.",
  },
  {
    id: "hc2",
    en: "I notice early signals that something is off in a relationship — before it becomes a visible problem.",
    id_lang: "Saya memperhatikan sinyal awal bahwa ada sesuatu yang tidak beres dalam suatu hubungan — sebelum menjadi masalah yang terlihat.",
    nl: "Ik merk vroege signalen dat er iets mis is in een relatie — voordat het een zichtbaar probleem wordt.",
  },
  {
    id: "hc3",
    en: "I feel free to name tension or awkwardness directly with the people I work with.",
    id_lang: "Saya merasa bebas untuk menyebut ketegangan atau kecanggungan secara langsung dengan orang-orang yang saya ajak bekerja.",
    nl: "Ik voel me vrij om spanning of ongemak direct te benoemen bij de mensen met wie ik werk.",
  },
  {
    id: "hc4",
    en: "My team has language for grief and loss — not just for tasks and plans.",
    id_lang: "Tim saya memiliki bahasa untuk duka dan kehilangan — bukan hanya untuk tugas dan rencana.",
    nl: "Mijn team heeft taal voor verdriet en verlies — niet alleen voor taken en plannen.",
  },
  {
    id: "hc5",
    en: "When I reflect on the goodbyes and transitions of the past year, I feel they were adequately acknowledged.",
    id_lang: "Ketika saya merenungkan perpisahan dan transisi tahun lalu, saya merasa semuanya cukup diakui.",
    nl: "Als ik reflecteer op de afscheiden en overgangen van het afgelopen jaar, voel ik dat ze voldoende zijn erkend.",
  },
  {
    id: "hc6",
    en: "The relationships on my team feel strong enough to survive a real disagreement.",
    id_lang: "Hubungan dalam tim saya terasa cukup kuat untuk bertahan dari ketidaksetujuan yang nyata.",
    nl: "De relaties in mijn team voelen sterk genoeg om een echte meningsverschil te overleven.",
  },
];

// ─── COMPONENT ──────────────────────────────────────────────────────────────

export default function RelationalLongevityClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  const [openSkill, setOpenSkill] = useState<SkillKey | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("relational-longevity");
      setSaved(true);
    });
  }

  function toggleCheck(id: string) {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  // ─── BRAND TOKENS ──────────────────────────────────────────────────────────
  const navy = "oklch(22% 0.10 260)";
  const orange = "oklch(65% 0.15 45)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const bodyText = "oklch(38% 0.05 260)";
  const serif = "var(--font-cormorant, Cormorant Garamond, Georgia, serif)";

  const verseData = activeVerse ? VERSES[activeVerse as keyof typeof VERSES] : null;

  function VerseRef({ id, children }: { id: string; children: React.ReactNode }) {
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

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>
      <LangToggle />

      {/* ── Language Bar ─────────────────────────────────────────────────── */}

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{ background: navy, padding: "88px 24px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
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
              "Team & Facilitation · Personal Development",
              "Tim & Fasilitasi · Pengembangan Pribadi",
              "Team & Facilitation · Persoonlijke Ontwikkeling"
            )}
          </p>

          {/* Striking stat */}
          <div
            style={{
              display: "inline-block",
              background: "oklch(65% 0.15 45 / 0.12)",
              border: "1px solid oklch(65% 0.15 45 / 0.4)",
              borderRadius: 6,
              padding: "10px 18px",
              marginBottom: 28,
            }}
          >
            <p
              style={{
                fontFamily: serif,
                fontSize: "clamp(14px, 1.6vw, 17px)",
                color: orange,
                margin: 0,
                fontStyle: "italic",
                lineHeight: 1.5,
              }}
            >
              {t(
                "The leading cause of leaving the field isn't hardship. It's broken relationships.",
                "Penyebab utama meninggalkan lapangan bukan kesulitan. Melainkan hubungan yang rusak.",
                "De voornaamste reden om het veld te verlaten is niet zwaar werk. Het zijn gebroken relaties."
              )}
            </p>
          </div>

          <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {t("Team & Facilitation · Guide", "Tim & Fasilitasi · Panduan", "Team & Facilitatie · Gids")}
          </p>
          <h1
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(28px, 4vw, 52px)",
              fontWeight: 800,
              color: offWhite,
              margin: "0 0 24px",
              lineHeight: 1.1,
            }}
          >
            {t("Relational Longevity", "Kelanggengan Relasional", "Relationele Longeviteit")}
          </h1>

          <p
            style={{
              fontFamily: serif,
              fontSize: "clamp(17px, 2vw, 22px)",
              color: "oklch(82% 0.025 80)",
              lineHeight: 1.75,
              maxWidth: 640,
              marginBottom: 32,
              fontStyle: "italic",
            }}
          >
            {t(
              "Why relational breakdown is the #1 reason cross-cultural workers leave the field prematurely — and three skills that build the interpersonal resilience to stay.",
              "Mengapa kerusakan relasional adalah alasan #1 pekerja lintas budaya meninggalkan lapangan terlalu dini — dan tiga keterampilan yang membangun ketahanan interpersonal untuk bertahan.",
              "Waarom relationele afbraak de #1 reden is dat interculturele werkers het veld voortijdig verlaten — en drie vaardigheden die de interpersoonlijke veerkracht opbouwen om te blijven."
            )}
          </p>

          {/* Opening question */}
          <div
            style={{
              borderLeft: `3px solid ${orange}`,
              paddingLeft: 20,
              marginBottom: 40,
            }}
          >
            <p
              style={{
                fontFamily: serif,
                fontSize: "clamp(16px, 1.8vw, 20px)",
                color: "oklch(88% 0.02 80)",
                lineHeight: 1.7,
                margin: 0,
                fontStyle: "italic",
              }}
            >
              {t(
                "Think of the last person who left your team or organisation earlier than expected. What was the real reason?",
                "Pikirkan tentang orang terakhir yang meninggalkan tim atau organisasi Anda lebih awal dari yang diharapkan. Apa alasan sebenarnya?",
                "Denk aan de laatste persoon die je team of organisatie eerder dan verwacht verliet. Wat was de werkelijke reden?"
              )}
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
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

      {/* ── Context Bar ───────────────────────────────────────────────────── */}
      <div style={{ background: "oklch(28% 0.09 260)", padding: "32px 24px" }}>
        <div
          style={{
            maxWidth: 760,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 24,
          }}
        >
          {[
            {
              stat: "71%",
              en: "of cross-cultural workers who leave prematurely cite relational breakdown as the primary factor",
              id: "pekerja lintas budaya yang pergi terlalu dini menyebut kerusakan relasional sebagai faktor utama",
              nl: "van interculturele werkers die voortijdig vertrekken noemen relationele afbraak als de primaire factor",
            },
            {
              stat: "SYIS",
              en: "Sharpening Your Interpersonal Skills — the curriculum behind this module",
              id: "Mengasah Keterampilan Interpersonal Anda — kurikulum di balik modul ini",
              nl: "Je Interpersoonlijke Vaardigheden Aanscherpen — het curriculum achter deze module",
            },
            {
              stat: "3",
              en: "core skills that research identifies as most protective of long-term team health",
              id: "keterampilan inti yang diidentifikasi penelitian sebagai paling melindungi kesehatan tim jangka panjang",
              nl: "kernvaardigheden die onderzoek identificeert als meest beschermend voor langetermijn teamgezondheid",
            },
          ].map((item, i) => (
            <div key={i}>
              <div
                style={{
                  fontFamily: serif,
                  fontSize: "clamp(32px, 4vw, 44px)",
                  fontWeight: 700,
                  color: orange,
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {item.stat}
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "oklch(76% 0.03 80)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {lang === "en" ? item.en : lang === "id" ? item.id : item.nl}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Three Skills Accordion ────────────────────────────────────────── */}
      <div style={{ padding: "80px 24px", maxWidth: 860, margin: "0 auto" }}>
        <p
          style={{
            color: orange,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          {t("Three Relational Skills", "Tiga Keterampilan Relasional", "Drie Relationele Vaardigheden")}
        </p>
        <h2
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "clamp(22px, 3vw, 32px)",
            fontWeight: 800,
            color: navy,
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          {t("Build the skills that keep teams together", "Bangun keterampilan yang menjaga tim tetap bersatu", "Bouw de vaardigheden die teams bijeenhouden")}
        </h2>
        <p
          style={{
            fontSize: 15,
            color: bodyText,
            lineHeight: 1.7,
            textAlign: "center",
            maxWidth: 600,
            margin: "0 auto 52px",
          }}
        >
          {t(
            "Each section is scenario-based. Read the situation, then explore the contrast between the typical response and the skilled one.",
            "Setiap bagian berbasis skenario. Baca situasinya, lalu jelajahi kontras antara respons umum dan respons terampil.",
            "Elke sectie is scenariogebaseerd. Lees de situatie en verken het contrast tussen de typische reactie en de vaardige reactie."
          )}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {SKILLS.map((skill) => {
            const isOpen = openSkill === skill.key;
            const label =
              lang === "en" ? skill.en_label : lang === "id" ? skill.id_label : skill.nl_label;
            const subtitle =
              lang === "en"
                ? skill.en_subtitle
                : lang === "id"
                ? skill.id_subtitle
                : skill.nl_subtitle;

            return (
              <div
                key={skill.key}
                style={{
                  border: `1px solid ${isOpen ? skill.accentColor : "oklch(88% 0.01 80)"}`,
                  borderRadius: 8,
                  overflow: "hidden",
                  transition: "border-color 0.2s",
                }}
              >
                {/* Accordion header */}
                <button
                  onClick={() => setOpenSkill(isOpen ? null : skill.key)}
                  style={{
                    width: "100%",
                    background: isOpen ? skill.accentBg : offWhite,
                    border: "none",
                    cursor: "pointer",
                    padding: "24px 28px",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    textAlign: "left",
                    transition: "background 0.2s",
                  }}
                >
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{skill.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: "clamp(15px, 1.8vw, 18px)",
                        fontWeight: 800,
                        color: isOpen ? skill.accentColor : navy,
                        marginBottom: 3,
                      }}
                    >
                      {label}
                    </div>
                    <div style={{ fontSize: 13, color: bodyText }}>{subtitle}</div>
                  </div>
                  <span
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: 20,
                      color: skill.accentColor,
                      flexShrink: 0,
                      transition: "transform 0.2s",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      display: "inline-block",
                    }}
                  >
                    ↓
                  </span>
                </button>

                {/* Accordion body */}
                {isOpen && (
                  <div style={{ padding: "0 28px 36px", background: offWhite }}>
                    {/* Intro */}
                    <p
                      style={{
                        fontSize: 15,
                        color: bodyText,
                        lineHeight: 1.8,
                        marginBottom: 32,
                        paddingTop: 20,
                        borderTop: `2px solid ${skill.accentBg}`,
                      }}
                    >
                      {lang === "en"
                        ? skill.en_intro
                        : lang === "id"
                        ? skill.id_intro
                        : skill.nl_intro}
                    </p>

                    {/* Scenario */}
                    <div
                      style={{
                        background: lightGray,
                        borderRadius: 8,
                        padding: "20px 24px",
                        marginBottom: 28,
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          fontSize: 11,
                          fontWeight: 700,
                          color: skill.accentColor,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          marginBottom: 10,
                        }}
                      >
                        {lang === "en"
                          ? skill.en_scenario_heading
                          : lang === "id"
                          ? skill.id_scenario_heading
                          : skill.nl_scenario_heading}
                      </p>
                      <p
                        style={{
                          fontFamily: serif,
                          fontSize: "clamp(15px, 1.7vw, 18px)",
                          fontStyle: "italic",
                          color: navy,
                          lineHeight: 1.7,
                          margin: 0,
                        }}
                      >
                        {lang === "en"
                          ? skill.en_scenario
                          : lang === "id"
                          ? skill.id_scenario
                          : skill.nl_scenario}
                      </p>
                    </div>

                    {/* Contrast: typical vs. better */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 16,
                        marginBottom: 32,
                      }}
                    >
                      {/* Typical */}
                      <div
                        style={{
                          background: "oklch(52% 0.18 25 / 0.06)",
                          border: "1px solid oklch(52% 0.18 25 / 0.2)",
                          borderRadius: 8,
                          padding: "18px 20px",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: "Montserrat, sans-serif",
                            fontSize: 11,
                            fontWeight: 700,
                            color: "oklch(48% 0.18 25)",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            marginBottom: 10,
                          }}
                        >
                          {lang === "en"
                            ? skill.en_typical_label
                            : lang === "id"
                            ? skill.id_typical_label
                            : skill.nl_typical_label}
                        </p>
                        <p
                          style={{
                            fontSize: 14,
                            color: bodyText,
                            lineHeight: 1.7,
                            margin: 0,
                          }}
                        >
                          {lang === "en"
                            ? skill.en_typical
                            : lang === "id"
                            ? skill.id_typical
                            : skill.nl_typical}
                        </p>
                      </div>

                      {/* Better */}
                      <div
                        style={{
                          background: skill.accentBg,
                          border: `1px solid ${skill.accentColor}40`,
                          borderRadius: 8,
                          padding: "18px 20px",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: "Montserrat, sans-serif",
                            fontSize: 11,
                            fontWeight: 700,
                            color: skill.accentColor,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            marginBottom: 10,
                          }}
                        >
                          {lang === "en"
                            ? skill.en_better_label
                            : lang === "id"
                            ? skill.id_better_label
                            : skill.nl_better_label}
                        </p>
                        <p
                          style={{
                            fontSize: 14,
                            color: bodyText,
                            lineHeight: 1.7,
                            margin: 0,
                          }}
                        >
                          {lang === "en"
                            ? skill.en_better
                            : lang === "id"
                            ? skill.id_better
                            : skill.nl_better}
                        </p>
                      </div>
                    </div>

                    {/* Technique steps */}
                    <div>
                      <p
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          fontSize: 13,
                          fontWeight: 800,
                          color: navy,
                          marginBottom: 16,
                          letterSpacing: "0.04em",
                        }}
                      >
                        {lang === "en"
                          ? skill.en_technique_heading
                          : lang === "id"
                          ? skill.id_technique_heading
                          : skill.nl_technique_heading}
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {(lang === "en"
                          ? skill.en_technique_steps
                          : lang === "id"
                          ? skill.id_technique_steps
                          : skill.nl_technique_steps
                        ).map((step, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              gap: 16,
                              alignItems: "flex-start",
                            }}
                          >
                            <div
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                background: skill.accentColor,
                                color: offWhite,
                                fontFamily: "Montserrat, sans-serif",
                                fontSize: 12,
                                fontWeight: 800,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                marginTop: 2,
                              }}
                            >
                              {idx + 1}
                            </div>
                            <div>
                              <p
                                style={{
                                  fontFamily: "Montserrat, sans-serif",
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: skill.accentColor,
                                  marginBottom: 4,
                                }}
                              >
                                {step.label}
                              </p>
                              <p
                                style={{
                                  fontSize: 14,
                                  color: bodyText,
                                  lineHeight: 1.75,
                                  margin: 0,
                                }}
                              >
                                {step.body}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Relational Health Check ───────────────────────────────────────── */}
      <div style={{ background: lightGray, padding: "80px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p
            style={{
              color: orange,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            {t("Reflection", "Refleksi", "Reflectie")}
          </p>
          <h2
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(22px, 3vw, 32px)",
              fontWeight: 800,
              color: navy,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            {t("Relational Health Check", "Pemeriksaan Kesehatan Relasional", "Relationele Gezondheidscheck")}
          </h2>
          <p
            style={{
              fontSize: 15,
              color: bodyText,
              lineHeight: 1.7,
              textAlign: "center",
              marginBottom: 40,
              maxWidth: 560,
              margin: "0 auto 40px",
            }}
          >
            {t(
              "These six statements are not a scored quiz. They are honest prompts — sit with each one and notice what surfaces.",
              "Enam pernyataan ini bukan kuis dengan skor. Ini adalah pertanyaan yang jujur — duduklah dengan masing-masing dan perhatikan apa yang muncul.",
              "Deze zes uitspraken zijn geen gescoorde quiz. Het zijn eerlijke aanwijzingen — zit met elk en merk op wat er opkomt."
            )}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {HEALTH_CHECKS.map((item, idx) => {
              const isChecked = checkedItems.has(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  style={{
                    background: isChecked ? "oklch(65% 0.15 45 / 0.08)" : offWhite,
                    border: `1px solid ${isChecked ? orange : "oklch(88% 0.01 80)"}`,
                    borderRadius: 8,
                    padding: "18px 20px",
                    display: "flex",
                    gap: 16,
                    alignItems: "flex-start",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s",
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 4,
                      border: `2px solid ${isChecked ? orange : "oklch(75% 0.02 80)"}`,
                      background: isChecked ? orange : "transparent",
                      flexShrink: 0,
                      marginTop: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.15s",
                    }}
                  >
                    {isChecked && (
                      <svg
                        width="12"
                        height="9"
                        viewBox="0 0 12 9"
                        fill="none"
                        style={{ display: "block" }}
                      >
                        <path
                          d="M1 4L4.5 7.5L11 1"
                          stroke={offWhite}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: 11,
                        fontWeight: 700,
                        color: orange,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      {idx + 1}
                    </span>
                    <p
                      style={{
                        fontSize: 15,
                        color: isChecked ? navy : bodyText,
                        lineHeight: 1.7,
                        margin: 0,
                        fontWeight: isChecked ? 600 : 400,
                      }}
                    >
                      {lang === "en" ? item.en : lang === "id" ? item.id_lang : item.nl}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Reflection prompt below checklist */}
          {checkedItems.size > 0 && (
            <div
              style={{
                marginTop: 28,
                background: offWhite,
                borderRadius: 8,
                padding: "24px 28px",
                borderLeft: `4px solid ${orange}`,
              }}
            >
              <p
                style={{
                  fontFamily: serif,
                  fontSize: "clamp(15px, 1.8vw, 18px)",
                  fontStyle: "italic",
                  color: navy,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {checkedItems.size >= 5
                  ? t(
                      "These are genuine strengths. The challenge now is to protect them — especially under pressure, in busy seasons, and when the team is losing people.",
                      "Ini adalah kekuatan nyata. Tantangan sekarang adalah melindunginya — terutama di bawah tekanan, di musim sibuk, dan ketika tim kehilangan orang.",
                      "Dit zijn echte sterktes. De uitdaging nu is ze te beschermen — vooral onder druk, in drukke seizoenen, en wanneer het team mensen verliest."
                    )
                  : checkedItems.size >= 3
                  ? t(
                      "You have a foundation to build on. The statements you didn't check are the most important ones to sit with. What would need to shift for those to become true?",
                      "Anda memiliki fondasi untuk dibangun. Pernyataan yang tidak Anda centang adalah yang paling penting untuk direnungkan. Apa yang perlu berubah agar itu menjadi kenyataan?",
                      "Je hebt een fundament om op te bouwen. De uitspraken die je niet aankruiste zijn de belangrijkste om bij te zitten. Wat zou er moeten veranderen om die waar te maken?"
                    )
                  : t(
                      "Honesty is the starting point. These gaps are not failures — they are the exact places where the three skills in this module do their work.",
                      "Kejujuran adalah titik awal. Kesenjangan ini bukan kegagalan — itu adalah tempat-tempat di mana tiga keterampilan dalam modul ini bekerja.",
                      "Eerlijkheid is het beginpunt. Deze lacunes zijn geen mislukkingen — het zijn precies de plekken waar de drie vaardigheden in deze module hun werk doen."
                    )}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Biblical Foundation ───────────────────────────────────────────── */}
      <div style={{ background: navy, padding: "80px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
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
            {t("Biblical Foundation", "Dasar Alkitab", "Bijbelse Basis")}
          </p>
          <h2
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(22px, 3vw, 32px)",
              fontWeight: 800,
              color: offWhite,
              marginBottom: 48,
            }}
          >
            {t(
              "Even the best relationships fracture — and God still works",
              "Bahkan hubungan terbaik pun bisa retak — dan Allah tetap bekerja",
              "Zelfs de beste relaties breken — en God werkt nog steeds"
            )}
          </h2>

          {/* Verse 1 — Colossians 3:14 */}
          <div style={{ marginBottom: 52 }}>
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: orange,
                letterSpacing: "0.1em",
                marginBottom: 14,
              }}
            >
              <VerseRef id="col-3-14">
                {lang === "en"
                  ? VERSES["col-3-14"].en_ref
                  : lang === "id"
                  ? VERSES["col-3-14"].id_ref
                  : VERSES["col-3-14"].nl_ref}
              </VerseRef>
            </p>
            <p
              style={{
                fontFamily: serif,
                fontSize: "clamp(18px, 2vw, 23px)",
                fontStyle: "italic",
                color: offWhite,
                lineHeight: 1.7,
                marginBottom: 24,
              }}
            >
              "
              {lang === "en"
                ? VERSES["col-3-14"].en
                : lang === "id"
                ? VERSES["col-3-14"].id
                : VERSES["col-3-14"].nl}
              "
            </p>
            <p
              style={{
                fontSize: 15,
                color: "oklch(76% 0.03 80)",
                lineHeight: 1.8,
              }}
            >
              {t(
                "Paul's letter to the Colossians lists the garments of a healthy community — compassion, kindness, humility, gentleness, patience, forbearance, forgiveness. But notice the structure: love is not one item on the list. It is what binds all the others together. Without love, the other virtues remain isolated skills — good in theory, brittle in practice. The relational longevity that keeps cross-cultural teams together is not primarily a set of communication techniques. It is love expressed through them. The SYIS skills in this module — listening, navigating conflict, processing loss — are love made concrete.",
                "Surat Paulus kepada jemaat Kolose mendaftar pakaian komunitas yang sehat — belas kasihan, kebaikan hati, kerendahan hati, kelemahlembutan, kesabaran, tenggang rasa, pengampunan. Tetapi perhatikan strukturnya: kasih bukan salah satu item dalam daftar. Kasih adalah yang mengikat semua yang lain bersama. Tanpa kasih, kebajikan lainnya tetap menjadi keterampilan yang terisolasi — baik dalam teori, rapuh dalam praktik. Kelanggengan relasional yang menjaga tim lintas budaya tetap bersatu bukan terutama seperangkat teknik komunikasi. Itu adalah kasih yang diekspresikan melaluinya.",
                "Paulus' brief aan de Kolossenzen somt de kledingstukken van een gezonde gemeenschap op — medeleven, vriendelijkheid, bescheidenheid, zachtmoedigheid, geduld, verdraagzaamheid, vergeving. Maar let op de structuur: liefde is niet één item op de lijst. Het is wat alle andere samenbindt. Zonder liefde blijven de andere deugden geïsoleerde vaardigheden — goed in theorie, broos in de praktijk. De relationele longeviteit die interculturele teams bij elkaar houdt is niet primair een set communicatietechnieken. Het is liefde die daardoor tot uitdrukking komt."
              )}
            </p>
          </div>

          {/* Verse 2 — Acts 15:39 */}
          <div
            style={{
              borderTop: "1px solid oklch(35% 0.06 260)",
              paddingTop: 48,
            }}
          >
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: orange,
                letterSpacing: "0.1em",
                marginBottom: 14,
              }}
            >
              <VerseRef id="acts-15-39">
                {lang === "en"
                  ? VERSES["acts-15-39"].en_ref
                  : lang === "id"
                  ? VERSES["acts-15-39"].id_ref
                  : VERSES["acts-15-39"].nl_ref}
              </VerseRef>
            </p>
            <p
              style={{
                fontFamily: serif,
                fontSize: "clamp(18px, 2vw, 23px)",
                fontStyle: "italic",
                color: offWhite,
                lineHeight: 1.7,
                marginBottom: 24,
              }}
            >
              "
              {lang === "en"
                ? VERSES["acts-15-39"].en
                : lang === "id"
                ? VERSES["acts-15-39"].id
                : VERSES["acts-15-39"].nl}
              "
            </p>
            <p
              style={{
                fontSize: 15,
                color: "oklch(76% 0.03 80)",
                lineHeight: 1.8,
                marginBottom: 20,
              }}
            >
              {t(
                "This verse doesn't have a happy ending tied up neatly. Paul and Barnabas — two of the most effective cross-cultural missionaries in history, the very team that launched the first Gentile church at Antioch — had a conflict so sharp that they separated permanently. The Bible does not minimise this. It reports it plainly. And what follows is not a story of failure: both Paul and Barnabas continued their mission, each with a different team. God did not require the relationship to be preserved for the mission to continue.",
                "Ayat ini tidak memiliki akhir yang bahagia yang terikat dengan rapi. Paulus dan Barnabas — dua misionaris lintas budaya paling efektif dalam sejarah, tim yang meluncurkan gereja non-Yahudi pertama di Antiokhia — memiliki konflik yang begitu tajam sehingga mereka berpisah secara permanen. Alkitab tidak meminimalkan ini. Ini melaporkannya dengan jelas. Dan yang mengikutinya bukan kisah kegagalan: Paulus dan Barnabas melanjutkan misi mereka, masing-masing dengan tim yang berbeda. Allah tidak mengharuskan hubungan itu dipertahankan agar misi dapat berlanjut.",
                "Dit vers heeft geen netjes afgebonden gelukkig einde. Paulus en Barnabas — twee van de meest effectieve interculturele zendelingen in de geschiedenis, het team dat de eerste heidense kerk in Antiochië lanceerde — hadden een zo scherp conflict dat ze permanent uit elkaar gingen. De Bijbel minimaliseert dit niet. Hij rapporteert het eenvoudig. En wat volgt is geen verhaal van mislukking: zowel Paulus als Barnabas zetten hun missie voort, elk met een ander team. God vereiste niet dat de relatie bewaard bleef opdat de missie door kon gaan."
              )}
            </p>
            <p
              style={{
                fontSize: 15,
                color: "oklch(76% 0.03 80)",
                lineHeight: 1.8,
              }}
            >
              {t(
                "What this means for you: relational longevity is worth fighting for — and the three skills in this module are how you fight for it. But relational longevity is not the same as relational perfection. Some relationships will fracture despite your best efforts. The measure of your relational health is not whether all your relationships have survived intact. It is whether you brought love, honesty, and humility to them — and whether you keep doing so.",
                "Artinya bagi Anda: kelanggengan relasional layak diperjuangkan — dan tiga keterampilan dalam modul ini adalah cara Anda memperjuangkannya. Tetapi kelanggengan relasional tidak sama dengan kesempurnaan relasional. Beberapa hubungan akan retak meskipun Anda berupaya sebaik mungkin. Ukuran kesehatan relasional Anda bukan apakah semua hubungan Anda bertahan utuh. Melainkan apakah Anda membawa kasih, kejujuran, dan kerendahan hati — dan apakah Anda terus melakukannya.",
                "Wat dit voor jou betekent: relationele longeviteit is het waard om voor te vechten — en de drie vaardigheden in deze module zijn hoe je ervoor vecht. Maar relationele longeviteit is niet hetzelfde als relationele perfectie. Sommige relaties zullen breken ondanks je beste inspanningen. De maatstaf van je relationele gezondheid is niet of al je relaties intact zijn gebleven. Het is of je liefde, eerlijkheid en bescheidenheid meebracht — en of je dat blijft doen."
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ── Footer / Keep Going ───────────────────────────────────────────── */}
      <div style={{ background: lightGray, padding: "80px 24px", textAlign: "center" }}>
        <h2
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "clamp(20px, 2.5vw, 28px)",
            fontWeight: 800,
            color: navy,
            marginBottom: 16,
          }}
        >
          {t("Keep Growing", "Terus Bertumbuh", "Blijf Groeien")}
        </h2>
        <p
          style={{
            fontSize: 15,
            color: bodyText,
            lineHeight: 1.75,
            maxWidth: 520,
            margin: "0 auto 40px",
          }}
        >
          {t(
            "The skills that keep teams together take practice. Explore more resources to deepen your cross-cultural leadership.",
            "Keterampilan yang menjaga tim tetap bersatu membutuhkan latihan. Jelajahi lebih banyak sumber untuk memperdalam kepemimpinan lintas budaya Anda.",
            "De vaardigheden die teams bij elkaar houden vergen oefening. Verken meer bronnen om je intercultureel leiderschap te verdiepen."
          )}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/resources"
            style={{
              display: "inline-block",
              padding: "14px 36px",
              background: navy,
              color: offWhite,
              fontFamily: "Montserrat, sans-serif",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              borderRadius: 4,
            }}
          >
            {t("← Content Library", "← Perpustakaan Konten", "← Contentbibliotheek")}
          </Link>
          <Link
            href="/resources/conflict-resolution"
            style={{
              display: "inline-block",
              padding: "14px 36px",
              background: "transparent",
              border: `2px solid ${navy}`,
              color: navy,
              fontFamily: "Montserrat, sans-serif",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              borderRadius: 4,
            }}
          >
            {t("Conflict Resolution →", "Resolusi Konflik →", "Conflictoplossing →")}
          </Link>
        </div>
      </div>

      {/* ── Verse Popup ───────────────────────────────────────────────────── */}
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
                fontFamily: serif,
                fontSize: 22,
                lineHeight: 1.7,
                color: navy,
                fontStyle: "italic",
                marginBottom: 20,
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
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: orange,
                letterSpacing: "0.08em",
                marginBottom: 28,
              }}
            >
              —{" "}
              {lang === "en"
                ? verseData.en_ref
                : lang === "id"
                ? verseData.id_ref
                : verseData.nl_ref}{" "}
              ({lang === "en"
                ? verseData.en_version
                : lang === "id"
                ? verseData.id_version
                : verseData.nl_version})
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
