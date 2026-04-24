"use client";
import { useState, useTransition, useMemo } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

type BiasCategory = "memory" | "social" | "learning" | "belief" | "money" | "politics";

type Bias = {
  name: string;
  name_id: string;
  name_nl: string;
  category: BiasCategory;
  crossCulturalNote: string;
  crossCulturalNote_id: string;
  crossCulturalNote_nl: string;
};

const CATEGORY_META: Record<BiasCategory, { en: string; id: string; nl: string; color: string }> = {
  memory:   { en: "Memory",   id: "Memori",   nl: "Geheugen",  color: "oklch(62% 0.12 220)" },
  social:   { en: "Social",   id: "Sosial",   nl: "Sociaal",   color: "oklch(48% 0.14 260)" },
  learning: { en: "Learning", id: "Belajar",  nl: "Leren",     color: "oklch(62% 0.14 80)"  },
  belief:   { en: "Belief",   id: "Keyakinan",nl: "Overtuiging",color: "oklch(55% 0.16 25)"  },
  money:    { en: "Money",    id: "Keuangan", nl: "Geld",       color: "oklch(52% 0.14 145)" },
  politics: { en: "Politics", id: "Politik",  nl: "Politiek",  color: "oklch(62% 0.14 45)"  },
};

const BIASES: Bias[] = [
  // Memory
  {
    name: "Availability Heuristic",
    name_id: "Heuristik Ketersediaan",
    name_nl: "Beschikbaarheidsheuristiek",
    category: "memory",
    crossCulturalNote: "Leaders judge an entire region's potential based on one recent, high-profile story rather than representative data.",
    crossCulturalNote_id: "Pemimpin menilai potensi seluruh kawasan berdasarkan satu kisah menonjol yang baru terjadi, bukan data yang representatif.",
    crossCulturalNote_nl: "Leiders beoordelen het potentieel van een hele regio op basis van één recente, opvallende gebeurtenis in plaats van representatieve data.",
  },
  {
    name: "Forer Effect (Barnum Effect)",
    name_id: "Efek Forer (Efek Barnum)",
    name_nl: "Forer-effect (Barnum-effect)",
    category: "memory",
    crossCulturalNote: "Vague cultural assessments like 'this culture is collective' feel personally accurate but are too general to guide real decisions.",
    crossCulturalNote_id: "Penilaian budaya yang kabur seperti 'budaya ini kolektif' terasa akurat secara pribadi, tetapi terlalu umum untuk memandu keputusan nyata.",
    crossCulturalNote_nl: "Vage culturele beoordelingen zoals 'deze cultuur is collectief' voelen persoonlijk correct aan, maar zijn te algemeen om echte beslissingen te sturen.",
  },
  {
    name: "Google Effect (Digital Amnesia)",
    name_id: "Efek Google (Amnesia Digital)",
    name_nl: "Google-effect (Digitale Amnesie)",
    category: "memory",
    crossCulturalNote: "Leaders who look up local customs on demand rather than internalising them appear detached or disrespectful to local staff.",
    crossCulturalNote_id: "Pemimpin yang mencari adat lokal sesuai kebutuhan daripada menginternalisasikannya terlihat tidak peduli atau tidak menghormati staf lokal.",
    crossCulturalNote_nl: "Leiders die lokale gebruiken opzoeken in plaats van ze te internaliseren, komen afstandelijk of respectloos over bij lokale medewerkers.",
  },
  {
    name: "Availability Cascade",
    name_id: "Kaskade Ketersediaan",
    name_nl: "Beschikbaarheidscascade",
    category: "memory",
    crossCulturalNote: "Repeated negative tropes about a culture at HQ harden into 'fact' through sheer repetition, distorting a leader's expectations before they even arrive.",
    crossCulturalNote_id: "Klise negatif yang berulang tentang suatu budaya di kantor pusat mengeras menjadi 'fakta' melalui pengulangan semata, mendistorsi ekspektasi pemimpin bahkan sebelum mereka tiba.",
    crossCulturalNote_nl: "Herhaalde negatieve clichés over een cultuur op het hoofdkantoor worden door pure herhaling 'feiten', waardoor de verwachtingen van een leider al zijn vertekend voordat ze er aankomen.",
  },
  {
    name: "Tachypsychia",
    name_id: "Takipsikia",
    name_nl: "Tachypsychie",
    category: "memory",
    crossCulturalNote: "Under cross-border negotiation stress, a leader may perceive a culturally normal silence as far longer and more hostile than it actually is.",
    crossCulturalNote_id: "Di bawah tekanan negosiasi lintas batas, seorang pemimpin mungkin merasakan keheningan yang secara budaya normal jauh lebih lama dan lebih bermusuhan dari kenyataannya.",
    crossCulturalNote_nl: "Onder de stress van een grensoverschrijdende onderhandeling kan een leider een cultureel normale stilte als veel langer en vijandiger ervaren dan ze werkelijk is.",
  },
  {
    name: "Zeigarnik Effect",
    name_id: "Efek Zeigarnik",
    name_nl: "Zeigarnik-effect",
    category: "memory",
    crossCulturalNote: "Preoccupation with unfinished home-office tasks distracts a leader from building the slow, patient relationships required in relationship-oriented cultures.",
    crossCulturalNote_id: "Keasyikan dengan tugas kantor pusat yang belum selesai mengalihkan perhatian pemimpin dari membangun hubungan yang lambat dan sabar yang dibutuhkan dalam budaya berorientasi hubungan.",
    crossCulturalNote_nl: "Bezorgdheid over onafgemaakte taken op het hoofdkantoor leidt een leider af van het opbouwen van de trage, geduldige relaties die in relatiegericht culturen vereist zijn.",
  },
  {
    name: "Suggestibility",
    name_id: "Sugestibilitas",
    name_nl: "Suggestibiliteit",
    category: "memory",
    crossCulturalNote: "A leader may unconsciously alter their memory of a meeting to match later 'cultural insights' from a consultant, skewing future strategy.",
    crossCulturalNote_id: "Seorang pemimpin mungkin secara tidak sadar mengubah ingatan mereka tentang suatu pertemuan agar sesuai dengan 'wawasan budaya' kemudian dari seorang konsultan, menyimpangkan strategi masa depan.",
    crossCulturalNote_nl: "Een leider kan zijn herinnering aan een vergadering onbewust aanpassen om later aangeleverde 'culturele inzichten' van een consultant te volgen, wat de toekomstige strategie vertekent.",
  },
  {
    name: "False Memory",
    name_id: "Memori Palsu",
    name_nl: "Vals Geheugen",
    category: "memory",
    crossCulturalNote: "A leader might 'remember' a local partner agreeing to terms that were never explicitly stated, creating trust-breaking moments when expectations aren't met.",
    crossCulturalNote_id: "Seorang pemimpin mungkin 'mengingat' mitra lokal menyetujui syarat-syarat yang tidak pernah dinyatakan secara eksplisit, menciptakan momen penghancur kepercayaan ketika ekspektasi tidak terpenuhi.",
    crossCulturalNote_nl: "Een leider kan zich 'herinneren' dat een lokale partner instemde met voorwaarden die nooit expliciet zijn uitgesproken, wat vertrouwensbreuk veroorzaakt als verwachtingen niet worden ingelost.",
  },
  {
    name: "Cryptomnesia",
    name_id: "Kriptomnesia",
    name_nl: "Cryptomnesie",
    category: "memory",
    crossCulturalNote: "A leader may unknowingly present a local employee's culturally-specific idea as their own, damaging morale and local ownership.",
    crossCulturalNote_id: "Seorang pemimpin mungkin tanpa sadar mempresentasikan ide spesifik budaya karyawan lokal sebagai miliknya sendiri, merusak moral dan rasa kepemilikan lokal.",
    crossCulturalNote_nl: "Een leider kan onbewust het cultuurspecifieke idee van een lokale medewerker als zijn eigen idee presenteren, wat het moreel en de lokale eigenaarschap schaadt.",
  },
  // Social
  {
    name: "Fundamental Attribution Error",
    name_id: "Kesalahan Atribusi Fundamental",
    name_nl: "Fundamentele Attributiefout",
    category: "social",
    crossCulturalNote: "Leaders blame a local employee's character for a missed deadline rather than considering situational factors like local infrastructure or public holidays.",
    crossCulturalNote_id: "Pemimpin menyalahkan karakter karyawan lokal atas tenggat waktu yang terlewat daripada mempertimbangkan faktor situasional seperti infrastruktur lokal atau hari libur.",
    crossCulturalNote_nl: "Leiders geven de karaktereigenschappen van een lokale medewerker de schuld voor een gemiste deadline, in plaats van situationele factoren zoals lokale infrastructuur of nationale feestdagen te overwegen.",
  },
  {
    name: "Self-Serving Bias",
    name_id: "Bias Melayani Diri Sendiri",
    name_nl: "Zelfbevestigingsbias",
    category: "social",
    crossCulturalNote: "Leaders credit their own 'global mindset' for project success while blaming 'local cultural resistance' for failure.",
    crossCulturalNote_id: "Pemimpin mengaitkan 'pola pikir global' mereka sendiri dengan keberhasilan proyek sambil menyalahkan 'resistensi budaya lokal' atas kegagalan.",
    crossCulturalNote_nl: "Leiders schrijven de successen van een project toe aan hun eigen 'globale mindset', terwijl ze mislukkingen wijten aan 'lokale culturele weerstand'.",
  },
  {
    name: "In-Group Favoritism",
    name_id: "Favoritisme Dalam Kelompok",
    name_nl: "In-groep Favoritisme",
    category: "social",
    crossCulturalNote: "Leaders unintentionally offer better assignments or mentoring to expats from their home country rather than to equally capable local talent.",
    crossCulturalNote_id: "Pemimpin tanpa sengaja menawarkan penugasan atau bimbingan yang lebih baik kepada ekspatriat dari negara asal mereka daripada kepada talenta lokal yang sama mampunya.",
    crossCulturalNote_nl: "Leiders bieden onbedoeld betere opdrachten of mentoring aan expats uit hun thuisland aan in plaats van aan even capabele lokale talenten.",
  },
  {
    name: "Halo Effect",
    name_id: "Efek Halo",
    name_nl: "Halo-effect",
    category: "social",
    crossCulturalNote: "If a local manager speaks the leader's language fluently, the leader incorrectly assumes equal competence in all other areas.",
    crossCulturalNote_id: "Jika seorang manajer lokal berbicara bahasa pemimpin dengan lancar, pemimpin secara keliru berasumsi memiliki kompetensi yang sama di semua bidang lain.",
    crossCulturalNote_nl: "Als een lokale manager de taal van de leider vloeiend spreekt, neemt de leider ten onrechte aan dat die persoon ook op alle andere gebieden even competent is.",
  },
  {
    name: "Moral Luck",
    name_id: "Keberuntungan Moral",
    name_nl: "Moreel Geluk",
    category: "social",
    crossCulturalNote: "A leader judges a local manager's character based on outcomes shaped by local market volatility or political instability outside that manager's control.",
    crossCulturalNote_id: "Seorang pemimpin menilai karakter manajer lokal berdasarkan hasil yang dibentuk oleh volatilitas pasar lokal atau ketidakstabilan politik di luar kendali manajer tersebut.",
    crossCulturalNote_nl: "Een leider beoordeelt het karakter van een lokale manager op basis van uitkomsten die worden bepaald door lokale marktvolatiliteit of politieke instabiliteit buiten de controle van die manager.",
  },
  {
    name: "False Consensus",
    name_id: "Konsensus Palsu",
    name_nl: "Vals Consensus",
    category: "social",
    crossCulturalNote: "Leaders assume their 'universal' management style is desired everywhere, failing to recognise that local teams may prefer fundamentally different leadership behaviour.",
    crossCulturalNote_id: "Pemimpin berasumsi bahwa gaya manajemen 'universal' mereka diinginkan di mana-mana, gagal menyadari bahwa tim lokal mungkin lebih menyukai perilaku kepemimpinan yang secara fundamental berbeda.",
    crossCulturalNote_nl: "Leiders nemen aan dat hun 'universele' managementstijl overal gewenst is, zonder te erkennen dat lokale teams fundamenteel ander leiderschapsgedrag kunnen verkiezen.",
  },
  {
    name: "Spotlight Effect",
    name_id: "Efek Sorotan",
    name_nl: "Spotlicht-effect",
    category: "social",
    crossCulturalNote: "Expat leaders overthink their cultural gaffes, believing the local team is constantly judging them — creating unnecessary anxiety and social distance.",
    crossCulturalNote_id: "Pemimpin ekspatriat terlalu memikirkan kesalahan budaya mereka, percaya tim lokal terus-menerus menilai mereka — menciptakan kecemasan yang tidak perlu dan jarak sosial.",
    crossCulturalNote_nl: "Expat-leiders denken te veel na over hun culturele blunders en geloven dat het lokale team hen constant beoordeelt — wat onnodige angst en sociale afstand creëert.",
  },
  {
    name: "Defensive Attribution",
    name_id: "Atribusi Defensif",
    name_nl: "Defensieve Attributie",
    category: "social",
    crossCulturalNote: "When accidents occur in a foreign branch, leaders may blame local teams more harshly because they feel less similar to them.",
    crossCulturalNote_id: "Ketika kecelakaan terjadi di cabang asing, pemimpin mungkin menyalahkan tim lokal lebih keras karena mereka merasa kurang serupa dengan mereka.",
    crossCulturalNote_nl: "Wanneer er ongelukken plaatsvinden in een buitenlandse vestiging, geven leiders de lokale teams harder de schuld omdat ze zich minder met hen identificeren.",
  },
  {
    name: "Just-World Hypothesis",
    name_id: "Hipotesis Dunia Adil",
    name_nl: "Rechtvaardige-Wereld Hypothese",
    category: "social",
    crossCulturalNote: "Leaders assume a struggling local office simply isn't working hard enough, ignoring systemic inequalities or historical disadvantages in that region.",
    crossCulturalNote_id: "Pemimpin berasumsi bahwa kantor lokal yang berjuang memang tidak bekerja cukup keras, mengabaikan ketidaksetaraan sistemik atau kerugian historis di kawasan tersebut.",
    crossCulturalNote_nl: "Leiders nemen aan dat een moeizaam draaiend lokaal kantoor simpelweg niet hard genoeg werkt, en negeren daarmee systemische ongelijkheden of historische nadelen in die regio.",
  },
  {
    name: "Naïve Realism",
    name_id: "Realisme Naif",
    name_nl: "Naïef Realisme",
    category: "social",
    crossCulturalNote: "Leaders believe their business perspective is objective and that local dissent reflects bias — not a legitimately different, equally valid view.",
    crossCulturalNote_id: "Pemimpin percaya perspektif bisnis mereka objektif dan bahwa ketidaksetujuan lokal mencerminkan bias — bukan pandangan yang legitimately berbeda dan sama-sama valid.",
    crossCulturalNote_nl: "Leiders geloven dat hun zakelijk perspectief objectief is en dat lokale weerstand op bias duidt — niet op een legitiem ander, even geldig standpunt.",
  },
  {
    name: "Naïve Cynicism",
    name_id: "Sinisme Naif",
    name_nl: "Naïef Cynisme",
    category: "social",
    crossCulturalNote: "Leaders dismiss a local partner's emphasis on relationship-building as self-interest, missing the deep cultural value of concepts like guanxi or wasta.",
    crossCulturalNote_id: "Pemimpin mengabaikan penekanan mitra lokal pada pembangunan hubungan sebagai kepentingan diri sendiri, melewatkan nilai budaya mendalam dari konsep seperti guanxi atau wasta.",
    crossCulturalNote_nl: "Leiders zien de nadruk die een lokale partner legt op het opbouwen van relaties als eigenbelang en missen daarmee de diepe culturele waarde van concepten als guanxi of wasta.",
  },
  {
    name: "Dunning-Kruger Effect",
    name_id: "Efek Dunning-Kruger",
    name_nl: "Dunning-Kruger-effect",
    category: "social",
    crossCulturalNote: "After one trip to a new country, a leader believes they are now a cultural expert — leading to overconfident and often costly decisions.",
    crossCulturalNote_id: "Setelah satu kali kunjungan ke negara baru, seorang pemimpin percaya dirinya kini ahli budaya — yang mengarah pada keputusan yang terlalu percaya diri dan seringkali mahal.",
    crossCulturalNote_nl: "Na één bezoek aan een nieuw land gelooft een leider dat ze nu een cultuurexpert zijn — wat leidt tot te zelfverzekerde en vaak kostbare beslissingen.",
  },
  {
    name: "Third-Person Effect",
    name_id: "Efek Orang Ketiga",
    name_nl: "Derde-persoons-effect",
    category: "social",
    crossCulturalNote: "Leaders believe their local teams are susceptible to cultural bias while remaining convinced they themselves are immune.",
    crossCulturalNote_id: "Pemimpin percaya bahwa tim lokal mereka rentan terhadap bias budaya sementara tetap yakin bahwa mereka sendiri kebal.",
    crossCulturalNote_nl: "Leiders geloven dat hun lokale teams gevoelig zijn voor culturele bias, terwijl ze ervan overtuigd zijn dat ze zelf immuun zijn.",
  },
  {
    name: "Stereotyping",
    name_id: "Stereotip",
    name_nl: "Stereotypering",
    category: "social",
    crossCulturalNote: "Leaders expect a local employee to behave like a cultural archetype, missing the individual's unique strengths and personality.",
    crossCulturalNote_id: "Pemimpin mengharapkan karyawan lokal berperilaku seperti arketipe budaya, melewatkan kekuatan dan kepribadian unik individu tersebut.",
    crossCulturalNote_nl: "Leiders verwachten dat een lokale medewerker zich gedraagt als een cultureel archetype en missen daardoor de unieke krachten en persoonlijkheid van die persoon.",
  },
  {
    name: "Outgroup Homogeneity Bias",
    name_id: "Bias Homogenitas Luar Kelompok",
    name_nl: "Uitgroep Homogeniteitsbias",
    category: "social",
    crossCulturalNote: "Leaders treat 'the Asian team' as a monolithic group, ignoring the vast cultural differences between nationalities, subcultures, and generations.",
    crossCulturalNote_id: "Pemimpin memperlakukan 'tim Asia' sebagai kelompok monolitik, mengabaikan perbedaan budaya yang sangat besar antara kebangsaan, subkultur, dan generasi.",
    crossCulturalNote_nl: "Leiders behandelen 'het Aziatische team' als een monolithische groep en negeren de enorme culturele verschillen tussen nationaliteiten, subculturen en generaties.",
  },
  {
    name: "Ben Franklin Effect",
    name_id: "Efek Ben Franklin",
    name_nl: "Ben Franklin-effect",
    category: "social",
    crossCulturalNote: "Asking a local peer for a small favour can increase their investment in the partnership — a useful tool for building cross-cultural trust.",
    crossCulturalNote_id: "Meminta rekan lokal untuk melakukan bantuan kecil dapat meningkatkan investasi mereka dalam kemitraan — alat yang berguna untuk membangun kepercayaan lintas budaya.",
    crossCulturalNote_nl: "Een lokale collega om een kleine gunst vragen kan hun betrokkenheid bij het partnerschap vergroten — een nuttig middel om intercultureel vertrouwen op te bouwen.",
  },
  {
    name: "Bystander Effect",
    name_id: "Efek Penonton",
    name_nl: "Omstanderseffect",
    category: "social",
    crossCulturalNote: "In a multicultural HQ, leaders fail to address subtle discrimination, assuming someone in the Diversity department will handle it.",
    crossCulturalNote_id: "Di kantor pusat multikultural, pemimpin gagal menangani diskriminasi halus, berasumsi bahwa seseorang di departemen Keberagaman akan menanganinya.",
    crossCulturalNote_nl: "Op een multicultureel hoofdkantoor pakken leiders subtiele discriminatie niet aan, in de veronderstelling dat iemand op de afdeling Diversiteit dit wel zal oppakken.",
  },
  {
    name: "Blind Spot Bias",
    name_id: "Bias Titik Buta",
    name_nl: "Blinde Vlek Bias",
    category: "social",
    crossCulturalNote: "Leaders readily identify cultural biases in their local staff while remaining blind to their own ethnocentrism.",
    crossCulturalNote_id: "Pemimpin dengan mudah mengidentifikasi bias budaya pada staf lokal mereka sambil tetap buta terhadap etnosentrisme mereka sendiri.",
    crossCulturalNote_nl: "Leiders herkennen gemakkelijk culturele biases bij hun lokale medewerkers, terwijl ze blind blijven voor hun eigen etnocentrisme.",
  },
  // Learning
  {
    name: "Curse of Knowledge",
    name_id: "Kutukan Pengetahuan",
    name_nl: "Vloek van Kennis",
    category: "learning",
    crossCulturalNote: "HQ experts can't explain processes clearly to local teams because they've forgotten what it's like not to have 10 years of institutional context.",
    crossCulturalNote_id: "Para ahli kantor pusat tidak dapat menjelaskan proses dengan jelas kepada tim lokal karena mereka telah melupakan bagaimana rasanya tidak memiliki 10 tahun konteks kelembagaan.",
    crossCulturalNote_nl: "Experts op het hoofdkantoor kunnen processen niet duidelijk uitleggen aan lokale teams omdat ze zijn vergeten hoe het is om geen 10 jaar institutionele context te hebben.",
  },
  {
    name: "Anchoring",
    name_id: "Penjangkaran",
    name_nl: "Verankering",
    category: "learning",
    crossCulturalNote: "A leader fixates on the first cost estimate from a local vendor, failing to recalibrate even as more reliable market data becomes available.",
    crossCulturalNote_id: "Seorang pemimpin terpaku pada perkiraan biaya pertama dari vendor lokal, gagal untuk mengkalibrasi ulang meskipun data pasar yang lebih andal tersedia.",
    crossCulturalNote_nl: "Een leider fixeert zich op de eerste kostenraming van een lokale leverancier en hercalibreeert niet, zelfs niet wanneer betrouwbaardere marktdata beschikbaar komen.",
  },
  {
    name: "Declinism",
    name_id: "Dekilinisme",
    name_nl: "Declinisme",
    category: "learning",
    crossCulturalNote: "Leaders compare every foreign market to a nostalgic 'golden era' of expansion, failing to see fresh opportunities in the current landscape.",
    crossCulturalNote_id: "Pemimpin membandingkan setiap pasar asing dengan 'era emas' ekspansi yang nostalgis, gagal melihat peluang segar dalam lanskap saat ini.",
    crossCulturalNote_nl: "Leiders vergelijken elke buitenlandse markt met een nostalgisch 'gouden tijdperk' van expansie en zien daardoor kansen in het huidige landschap over het hoofd.",
  },
  {
    name: "Status Quo Bias",
    name_id: "Bias Status Quo",
    name_nl: "Status-quo-bias",
    category: "learning",
    crossCulturalNote: "Leaders resist adapting proven home-country strategies to local needs, preferring the familiar over the effective.",
    crossCulturalNote_id: "Pemimpin menolak mengadaptasi strategi negara asal yang terbukti untuk kebutuhan lokal, lebih memilih yang familiar daripada yang efektif.",
    crossCulturalNote_nl: "Leiders verzetten zich tegen het aanpassen van bewezen thuislandstrategieën aan lokale behoeften en geven de voorkeur aan het bekende boven het effectieve.",
  },
  {
    name: "Framing Effect",
    name_id: "Efek Pembingkaian",
    name_nl: "Framing-effect",
    category: "learning",
    crossCulturalNote: "A local team's response to the same proposal shifts entirely based on whether it's framed as a gain or a loss — cultural context amplifies this further.",
    crossCulturalNote_id: "Respons tim lokal terhadap proposal yang sama berubah sepenuhnya berdasarkan apakah proposal tersebut dibingkai sebagai keuntungan atau kerugian — konteks budaya memperkuat hal ini lebih jauh.",
    crossCulturalNote_nl: "De reactie van een lokaal team op hetzelfde voorstel verandert volledig afhankelijk van of het als winst of verlies wordt gepresenteerd — culturele context versterkt dit effect verder.",
  },
  {
    name: "Survivorship Bias",
    name_id: "Bias Kelangsungan Hidup",
    name_nl: "Overlevingsbias",
    category: "learning",
    crossCulturalNote: "Leaders study only the few successful multinational entries in a region, missing the majority of failures that would teach them what not to do.",
    crossCulturalNote_id: "Pemimpin hanya mempelajari sedikit entri multinasional yang berhasil di suatu kawasan, melewatkan mayoritas kegagalan yang akan mengajarkan mereka apa yang tidak harus dilakukan.",
    crossCulturalNote_nl: "Leiders bestuderen alleen de weinige succesvolle multinationale markttoetreden in een regio en missen daarmee de meerderheid van mislukkingen die hen zouden leren wat ze niet moeten doen.",
  },
  {
    name: "Clustering Illusion",
    name_id: "Ilusi Pengelompokan",
    name_nl: "Clusterillusie",
    category: "learning",
    crossCulturalNote: "Two or three coincidental sales in a new market get interpreted as a trend, prompting premature and costly scaling.",
    crossCulturalNote_id: "Dua atau tiga penjualan kebetulan di pasar baru ditafsirkan sebagai tren, mendorong penskalaan yang prematur dan mahal.",
    crossCulturalNote_nl: "Twee of drie toevallige verkopen in een nieuwe markt worden geïnterpreteerd als een trend, wat leidt tot voortijdige en kostbare schaalvergroting.",
  },
  {
    name: "Pessimism Bias",
    name_id: "Bias Pesimisme",
    name_nl: "Pessimismebias",
    category: "learning",
    crossCulturalNote: "Leaders overestimate political or economic instability in developing markets, causing the company to miss early-mover advantages.",
    crossCulturalNote_id: "Pemimpin melebih-lebihkan ketidakstabilan politik atau ekonomi di pasar berkembang, menyebabkan perusahaan melewatkan keuntungan penggerak awal.",
    crossCulturalNote_nl: "Leiders overschatten de politieke of economische instabiliteit in opkomende markten, waardoor het bedrijf first-mover voordelen misloopt.",
  },
  {
    name: "Optimism Bias",
    name_id: "Bias Optimisme",
    name_nl: "Optimismebias",
    category: "learning",
    crossCulturalNote: "Leaders underestimate the time needed to navigate local bureaucracies, leading to missed deadlines and significant budget overruns.",
    crossCulturalNote_id: "Pemimpin meremehkan waktu yang diperlukan untuk menavigasi birokrasi lokal, yang mengarah pada tenggat waktu yang terlewat dan pembengkakan anggaran yang signifikan.",
    crossCulturalNote_nl: "Leiders onderschatten de tijd die nodig is om lokale bureaucratieën te doorlopen, wat leidt tot gemiste deadlines en aanzienlijke budgetoverschrijdingen.",
  },
  // Belief
  {
    name: "Bandwagon Effect",
    name_id: "Efek Ikut-ikutan",
    name_nl: "Meelopereffect",
    category: "belief",
    crossCulturalNote: "A leader enters a popular 'emerging market' because competitors are doing so — without a real strategic fit for their specific mission or organisation.",
    crossCulturalNote_id: "Seorang pemimpin memasuki 'pasar berkembang' yang populer karena pesaing melakukannya — tanpa kesesuaian strategis yang nyata untuk misi atau organisasi spesifik mereka.",
    crossCulturalNote_nl: "Een leider betreedt een populaire 'opkomende markt' omdat concurrenten dat ook doen — zonder een echte strategische fit voor hun specifieke missie of organisatie.",
  },
  {
    name: "Automation Bias",
    name_id: "Bias Otomasi",
    name_nl: "Automatiseringsbias",
    category: "belief",
    crossCulturalNote: "Over-reliance on standardised HR software causes leaders to miss high-potential local candidates who don't fit a Western-built algorithm of success.",
    crossCulturalNote_id: "Ketergantungan berlebihan pada perangkat lunak HR yang terstandarisasi menyebabkan pemimpin melewatkan kandidat lokal berpotensi tinggi yang tidak sesuai dengan algoritma keberhasilan yang dibangun oleh Barat.",
    crossCulturalNote_nl: "Overmatige afhankelijkheid van gestandaardiseerde HR-software zorgt ervoor dat leiders lokale kandidaten met hoog potentieel missen die niet passen in een Westers succes-algoritme.",
  },
  {
    name: "Reactance",
    name_id: "Reaktansi",
    name_nl: "Reactantie",
    category: "belief",
    crossCulturalNote: "If HQ rules are imposed too aggressively, local employees feel their autonomy is threatened and may intentionally undermine the new policies.",
    crossCulturalNote_id: "Jika aturan kantor pusat diberlakukan terlalu agresif, karyawan lokal merasa otonomi mereka terancam dan mungkin dengan sengaja merusak kebijakan baru.",
    crossCulturalNote_nl: "Als de regels van het hoofdkantoor te agressief worden opgelegd, voelen lokale medewerkers zich bedreigd in hun autonomie en kunnen ze de nieuwe beleidsmaatregelen opzettelijk ondermijnen.",
  },
  {
    name: "Confirmation Bias",
    name_id: "Bias Konfirmasi",
    name_nl: "Bevestigingsbias",
    category: "belief",
    crossCulturalNote: "Leaders notice only information that supports existing cultural stereotypes while filtering out evidence that would challenge them.",
    crossCulturalNote_id: "Pemimpin hanya memperhatikan informasi yang mendukung stereotip budaya yang ada sambil menyaring bukti yang akan menantang mereka.",
    crossCulturalNote_nl: "Leiders merken alleen informatie op die bestaande culturele stereotypen ondersteunt en filteren bewijs weg dat die stereotypen zou uitdagen.",
  },
  {
    name: "Backfire Effect",
    name_id: "Efek Bumerang",
    name_nl: "Bumerangeffect",
    category: "belief",
    crossCulturalNote: "When a leader presents data to disprove a local team's long-held business practice, it can actually strengthen their resolve to keep doing it.",
    crossCulturalNote_id: "Ketika seorang pemimpin menyajikan data untuk membantah praktik bisnis tim lokal yang sudah lama dipegang, hal itu sebenarnya dapat memperkuat tekad mereka untuk terus melakukannya.",
    crossCulturalNote_nl: "Wanneer een leider data presenteert om de langgekoesterde bedrijfspraktijk van een lokaal team te weerleggen, kan dat hun vastberadenheid om ermee door te gaan juist versterken.",
  },
  {
    name: "Belief Bias",
    name_id: "Bias Keyakinan",
    name_nl: "Overtuigingsbias",
    category: "belief",
    crossCulturalNote: "Leaders accept a weak business case from a local partner simply because the final conclusion aligns with their own cultural assumptions.",
    crossCulturalNote_id: "Pemimpin menerima kasus bisnis yang lemah dari mitra lokal hanya karena kesimpulan akhirnya selaras dengan asumsi budaya mereka sendiri.",
    crossCulturalNote_nl: "Leiders accepteren een zwak businessplan van een lokale partner simpelweg omdat de uiteindelijke conclusie aansluit bij hun eigen culturele aannames.",
  },
  {
    name: "Authority Bias",
    name_id: "Bias Otoritas",
    name_nl: "Autoriteitsbias",
    category: "belief",
    crossCulturalNote: "In high-power-distance cultures, a leader receives only agreement — honest, necessary dissent is withheld from anyone holding a senior title.",
    crossCulturalNote_id: "Dalam budaya jarak kekuasaan tinggi, seorang pemimpin hanya menerima persetujuan — ketidaksetujuan yang jujur dan perlu ditahan dari siapa pun yang memegang jabatan senior.",
    crossCulturalNote_nl: "In culturen met een grote machtsafstand krijgt een leider alleen instemming — eerlijk, noodzakelijk tegengeluid wordt onthouden aan iedereen met een hogere titel.",
  },
  {
    name: "Placebo Effect",
    name_id: "Efek Plasebo",
    name_nl: "Placebo-effect",
    category: "belief",
    crossCulturalNote: "A leader believes a new cross-cultural training program is working simply because money was spent on it, even when team behaviour is unchanged.",
    crossCulturalNote_id: "Seorang pemimpin percaya program pelatihan lintas budaya yang baru berhasil hanya karena uang dihabiskan untuk itu, bahkan ketika perilaku tim tidak berubah.",
    crossCulturalNote_nl: "Een leider gelooft dat een nieuw intercultureel trainingsprogramma werkt simpelweg omdat er geld aan is besteed, ook al is het teamgedrag onveranderd.",
  },
  // Money
  {
    name: "Sunk Cost Fallacy",
    name_id: "Kesalahan Biaya Hangus",
    name_nl: "Sunken-cost-fout",
    category: "money",
    crossCulturalNote: "Leaders continue pouring resources into a failing foreign subsidiary because they've invested too much ego and time to admit the strategy isn't working.",
    crossCulturalNote_id: "Pemimpin terus menuangkan sumber daya ke anak perusahaan asing yang gagal karena mereka telah menginvestasikan terlalu banyak ego dan waktu untuk mengakui bahwa strategi tidak berhasil.",
    crossCulturalNote_nl: "Leiders blijven middelen steken in een falende buitenlandse dochteronderneming omdat ze te veel ego en tijd hebben geïnvesteerd om toe te geven dat de strategie niet werkt.",
  },
  {
    name: "Gambler's Fallacy",
    name_id: "Kekeliruan Penjudi",
    name_nl: "Gokkersdwaling",
    category: "money",
    crossCulturalNote: "After several failed product launches in a new region, a leader believes they're 'due' for a win rather than addressing root causes.",
    crossCulturalNote_id: "Setelah beberapa peluncuran produk yang gagal di kawasan baru, seorang pemimpin percaya mereka 'sudah waktunya' untuk menang daripada menangani akar penyebabnya.",
    crossCulturalNote_nl: "Na een aantal mislukte productlanceringen in een nieuwe regio gelooft een leider dat ze 'toe zijn' aan een succes, in plaats van de grondoorzaken aan te pakken.",
  },
  {
    name: "Zero-Risk Bias",
    name_id: "Bias Risiko Nol",
    name_nl: "Nulrisicosbias",
    category: "money",
    crossCulturalNote: "Leaders waste resources eliminating minor local risks while ignoring larger, more significant threats that carry greater long-term cost.",
    crossCulturalNote_id: "Pemimpin membuang sumber daya untuk menghilangkan risiko lokal kecil sambil mengabaikan ancaman yang lebih besar dan lebih signifikan yang membawa biaya jangka panjang lebih besar.",
    crossCulturalNote_nl: "Leiders verspillen middelen aan het elimineren van kleine lokale risico's terwijl ze grotere, meer significante bedreigingen negeren die op de lange termijn meer kosten.",
  },
  {
    name: "IKEA Effect",
    name_id: "Efek IKEA",
    name_nl: "IKEA-effect",
    category: "money",
    crossCulturalNote: "A leader overvalues a business plan they helped create, dismissing superior, more culturally-nuanced suggestions from local managers.",
    crossCulturalNote_id: "Seorang pemimpin terlalu menghargai rencana bisnis yang mereka bantu buat, mengabaikan saran yang lebih unggul dan lebih bernuansa budaya dari manajer lokal.",
    crossCulturalNote_nl: "Een leider overschat een businessplan dat ze zelf hebben helpen maken en wijst superieure, meer cultuurspecifieke suggesties van lokale managers van de hand.",
  },
  // Politics
  {
    name: "Groupthink",
    name_id: "Pemikiran Kelompok",
    name_nl: "Groepsdenken",
    category: "politics",
    crossCulturalNote: "An expat leadership team isolates from local advice to maintain internal harmony, producing out-of-touch strategic decisions that locals could have prevented.",
    crossCulturalNote_id: "Tim kepemimpinan ekspatriat mengisolasi diri dari saran lokal untuk menjaga harmoni internal, menghasilkan keputusan strategis yang tidak relevan yang bisa dicegah oleh orang lokal.",
    crossCulturalNote_nl: "Een expatriate leiderschapsteam isoleert zich van lokaal advies om interne harmonie te bewaren, wat leidt tot strategische beslissingen die los staan van de realiteit en die locals hadden kunnen voorkomen.",
  },
  {
    name: "Law of Triviality",
    name_id: "Hukum Trivialitas",
    name_nl: "Wet van Trivialiteit",
    category: "politics",
    crossCulturalNote: "A cross-cultural team spends hours debating slogan translation while ignoring major flaws in the underlying distribution or go-to-market model.",
    crossCulturalNote_id: "Tim lintas budaya menghabiskan berjam-jam memperdebatkan terjemahan slogan sambil mengabaikan kelemahan besar dalam model distribusi atau go-to-market yang mendasarinya.",
    crossCulturalNote_nl: "Een intercultureel team besteedt uren aan het debatteren over de vertaling van een slogan, terwijl grote gebreken in het onderliggende distributie- of go-to-market-model worden genegeerd.",
  },
];

const biasCategories = [
  { number: "1", en_title: "Attribution Biases", id_title: "Bias Atribusi", nl_title: "Attributiebiases", en_example: "Fundamental Attribution Error: attributing others' poor behaviour to their character while attributing your own to circumstances. In cross-cultural settings, this means assuming a team member is lazy when they are actually navigating a cultural expectation you don't understand.", id_example: "Kesalahan Atribusi Fundamental: mengatribusikan perilaku buruk orang lain pada karakter mereka sementara mengatribusikan milik Anda sendiri pada keadaan. Dalam konteks lintas budaya, ini berarti mengasumsikan anggota tim malas ketika mereka sebenarnya menavigasi harapan budaya yang tidak Anda pahami.", nl_example: "Fundamentele Attributiefout: het gedrag van anderen toeschrijven aan hun karakter terwijl je het jouwe aan omstandigheden toeschrijft. In interculturele omgevingen betekent dit aannemen dat een teamlid lui is terwijl ze eigenlijk navigeren door een culturele verwachting die jij niet begrijpt." },
  { number: "2", en_title: "Confirmation Bias", id_title: "Bias Konfirmasi", nl_title: "Bevestigingsbias", en_example: "Seeking and favouring information that confirms your existing beliefs. In cross-cultural leadership, this creates a dangerous feedback loop: you believe local leaders are not ready for authority, you only notice evidence that supports this, and you never actually give them the chance that would disprove it.", id_example: "Mencari dan mendukung informasi yang mengkonfirmasi keyakinan Anda yang ada. Dalam kepemimpinan lintas budaya, ini menciptakan lingkaran umpan balik yang berbahaya: Anda percaya pemimpin lokal tidak siap untuk otoritas, Anda hanya memperhatikan bukti yang mendukung ini.", nl_example: "Informatie zoeken en begunstigen die je bestaande overtuigingen bevestigt. In intercultureel leiderschap creëert dit een gevaarlijke feedbacklus: je gelooft dat lokale leiders niet klaar zijn voor autoriteit, je merkt alleen bewijs op dat dit ondersteunt." },
  { number: "3", en_title: "In-Group / Out-Group Bias", id_title: "Bias Dalam Kelompok / Luar Kelompok", nl_title: "In-groep / Uit-groep Bias", en_example: "Favouring people who are culturally similar to you — in hiring, delegation, and trust. This bias operates below conscious awareness and is one of the most damaging in multicultural teams. Leaders consistently give more opportunities, grace, and benefit of the doubt to people who look, speak, and think like them.", id_example: "Menyukai orang yang secara budaya mirip dengan Anda — dalam perekrutan, delegasi, dan kepercayaan. Bias ini beroperasi di bawah kesadaran dan merupakan salah satu yang paling merusak dalam tim multikultural.", nl_example: "De voorkeur geven aan mensen die cultureel op jou lijken — bij aanwerving, delegatie en vertrouwen. Deze bias werkt onder bewust bewustzijn en is een van de meest schadelijke in multiculturele teams." },
  { number: "4", en_title: "Availability Bias", id_title: "Bias Ketersediaan", nl_title: "Beschikbaarheidsbias", en_example: "Overweighting information that is easily recalled. The last thing that went wrong becomes disproportionately influential. In cross-cultural leadership: one bad experience with a team from a particular culture colours all future interactions with people from that background.", id_example: "Memberi bobot berlebihan pada informasi yang mudah diingat. Hal terakhir yang berjalan salah menjadi sangat berpengaruh. Dalam kepemimpinan lintas budaya: satu pengalaman buruk dengan tim dari budaya tertentu mewarnai semua interaksi masa depan dengan orang-orang dari latar belakang itu.", nl_example: "Te veel gewicht geven aan gemakkelijk herinnerde informatie. Het laatste dat misging wordt onevenredig invloedrijk. In intercultureel leiderschap: één slechte ervaring met een team uit een bepaalde cultuur kleurt alle toekomstige interacties met mensen uit die achtergrond." },
  { number: "5", en_title: "Anchoring Bias", id_title: "Bias Penjangkaran", nl_title: "Verankerbias", en_example: "Relying too heavily on the first piece of information encountered. If your first impression of a culture is negative (perhaps from a difficult entry experience), that anchor shapes all subsequent interpretations even when circumstances improve.", id_example: "Terlalu mengandalkan informasi pertama yang ditemui. Jika kesan pertama Anda tentang budaya negatif (mungkin dari pengalaman masuk yang sulit), jangkar itu membentuk semua interpretasi selanjutnya bahkan ketika keadaan membaik.", nl_example: "Te veel vertrouwen op het eerste stuk informatie dat wordt tegengekomen. Als je eerste indruk van een cultuur negatief is (misschien door een moeilijke beginervaring), vormt dat anker alle volgende interpretaties zelfs wanneer omstandigheden verbeteren." },
  { number: "6", en_title: "Halo / Horn Effect", id_title: "Efek Halo / Tanduk", nl_title: "Halo / Hoorns Effect", en_example: "Letting one positive quality (halo) or one negative quality (horns) define your entire perception of a person. Common in cross-cultural settings when a person's language proficiency — or accent — colours your assessment of their intelligence, leadership capacity, or trustworthiness.", id_example: "Membiarkan satu kualitas positif (halo) atau satu kualitas negatif (tanduk) mendefinisikan seluruh persepsi Anda tentang seseorang. Umum dalam konteks lintas budaya ketika kemampuan bahasa seseorang mewarnai penilaian Anda.", nl_example: "Een positieve kwaliteit (halo) of negatieve kwaliteit (hoorns) je volledige perceptie van een persoon laten bepalen. Gangbaar in interculturele omgevingen wanneer de taalvaardigheid van een persoon jouw beoordeling van hun intelligentie kleurt." },
];

const counterStrategies = [
  { number: "1", en: "Name your biases before high-stakes decisions — literally write down: 'What bias might be shaping my thinking here?'", id: "Sebutkan bias Anda sebelum keputusan berisiko tinggi — secara harfiah tuliskan: 'Bias apa yang mungkin membentuk pemikiran saya di sini?'", nl: "Benoem je biases voor beslissingen met hoge inzet — schrijf letterlijk op: 'Welke bias kan mijn denken hier beïnvloeden?'" },
  { number: "2", en: "Build cross-cultural accountability — have someone from a different background review significant decisions with you.", id: "Bangun akuntabilitas lintas budaya — minta seseorang dari latar belakang yang berbeda untuk meninjau keputusan penting bersama Anda.", nl: "Bouw interculturele verantwoording op — laat iemand uit een andere achtergrond significante beslissingen met je beoordelen." },
  { number: "3", en: "Delay judgment — resist the urge to categorise quickly. The longer you suspend interpretation, the more accurate it becomes.", id: "Tunda penilaian — tahan dorongan untuk mengkategorikan dengan cepat. Semakin lama Anda menangguhkan interpretasi, semakin akurat itu.", nl: "Stel oordeel uit — weersta de drang om snel te categoriseren. Hoe langer je interpretatie uitstelt, hoe accurater het wordt." },
  { number: "4", en: "Actively seek disconfirming information — ask: 'What would have to be true for me to be wrong about this?'", id: "Secara aktif cari informasi yang menyangkal — tanyakan: 'Apa yang harus benar agar saya salah tentang ini?'", nl: "Zoek actief naar weerleggende informatie — vraag: 'Wat zou waar moeten zijn om me in dit geval fout te laten zijn?'" },
  { number: "5", en: "Practice cultural humility as a spiritual discipline — remember that you see through a glass darkly (1 Corinthians 13:12). Your perception is partial.", id: "Praktikkan kerendahan hati budaya sebagai disiplin rohani — ingat bahwa Anda melihat melalui kaca yang gelap (1 Korintus 13:12). Persepsi Anda hanya sebagian.", nl: "Beoefen culturele bescheidenheid als geestelijke discipline — onthoud dat je door een glas onduidelijk ziet (1 Korintiërs 13:12). Je perceptie is gedeeltelijk." },
];

const reflectionQuestions = [
  { roman: "I", en: "Which of the six bias categories resonates most with patterns you notice in yourself?", id: "Kategori bias mana dari enam yang paling beresonansi dengan pola yang Anda perhatikan dalam diri Anda?", nl: "Welke van de zes biascategorieën resoneert het meest met patronen die je in jezelf opmerkt?" },
  { roman: "II", en: "Have you ever made a significant judgment about a team member that you later discovered was culturally misread?", id: "Pernahkah Anda membuat penilaian signifikan tentang anggota tim yang kemudian Anda temukan disalahbaca secara budaya?", nl: "Heb je ooit een significant oordeel geveld over een teamlid waarvan je later ontdekte dat het cultureel verkeerd was gelezen?" },
  { roman: "III", en: "Who in your life gives you the most honest feedback on your blind spots? Is that enough?", id: "Siapa dalam hidup Anda yang memberi Anda umpan balik paling jujur tentang titik buta Anda? Apakah itu cukup?", nl: "Wie in je leven geeft je de eerlijkste feedback op je blinde vlekken? Is dat genoeg?" },
  { roman: "IV", en: "How might your own cultural background be a source of systematic bias that you have never questioned?", id: "Bagaimana latar belakang budaya Anda sendiri bisa menjadi sumber bias sistematis yang belum pernah Anda pertanyakan?", nl: "Hoe kan jouw eigen culturele achtergrond een bron van systematische bias zijn die je nooit hebt bevraagd?" },
  { roman: "V", en: "What would humble, learner-posture leadership look like in your specific cultural and ministry context?", id: "Seperti apa kepemimpinan yang rendah hati dan berpostur pelajar dalam konteks budaya dan pelayanan spesifik Anda?", nl: "Hoe zou bescheiden, lerenden-houding-leiderschap eruitzien in jouw specifieke culturele en bedieningscontext?" },
  { roman: "VI", en: "How does the biblical imperative to 'think of others as more significant than yourselves' (Phil 2:3) serve as an antidote to bias?", id: "Bagaimana imperatif alkitabiah untuk 'menganggap orang lain lebih penting dari diri Anda sendiri' (Fil 2:3) berfungsi sebagai penawar bias?", nl: "Hoe dient het bijbelse gebod om 'anderen belangrijker te achten dan uzelf' (Fil 2:3) als tegengif voor bias?" },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function CognitiveBiasesClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang, setLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<BiasCategory | "all">("all");
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("cognitive-biases");
      setSaved(true);
    });
  }

  const filteredBiases = useMemo(() => {
    return BIASES.filter(b => {
      const matchesCat = activeCategory === "all" || b.category === activeCategory;
      const q = search.toLowerCase();
      const nameTranslated = lang === "en" ? b.name : lang === "id" ? b.name_id : b.name_nl;
      const noteTranslated = lang === "en" ? b.crossCulturalNote : lang === "id" ? b.crossCulturalNote_id : b.crossCulturalNote_nl;
      const matchesSearch = !q || nameTranslated.toLowerCase().includes(q) || noteTranslated.toLowerCase().includes(q) || b.name.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [search, activeCategory, lang]);

  const navy = "oklch(22% 0.10 260)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const orange = "oklch(65% 0.15 45)";
  const bodyText = "oklch(38% 0.05 260)";

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>
      {/* Lang bar */}
      <div style={{ background: lightGray, borderBottom: "1px solid oklch(90% 0.01 80)", padding: "10px 24px", display: "flex", gap: 8, justifyContent: "flex-end" }}>
        {(["en", "id", "nl"] as Lang[]).map((l) => (
          <button key={l} onClick={() => setLang(l)} style={{ padding: "4px 14px", borderRadius: 4, border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, background: lang === l ? navy : "transparent", color: lang === l ? offWhite : bodyText }}>
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
          {t("Cognitive Biases in Leadership", "Bias Kognitif dalam Kepemimpinan", "Cognitieve Biases in Leiderschap")}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(85% 0.03 80)", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.6, fontStyle: "italic" }}>
          {t(
            '"We think we see the world as it is. We actually see the world as we are." — Anaïs Nin',
            '"Kita pikir kita melihat dunia sebagaimana adanya. Kita sebenarnya melihat dunia sebagaimana kita adanya." — Anaïs Nin',
            '"We denken dat we de wereld zien zoals ze is. We zien de wereld eigenlijk zoals wij zijn." — Anaïs Nin'
          )}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={handleSave} disabled={saved || isPending} style={{ padding: "12px 28px", borderRadius: 6, border: "none", cursor: saved ? "default" : "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, background: saved ? "oklch(55% 0.08 260)" : orange, color: offWhite }}>
            {saved ? t("✓ Saved to Dashboard", "✓ Tersimpan di Dashboard", "✓ Opgeslagen in Dashboard") : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
          </button>
          <Link href="/resources" style={{ padding: "12px 28px", borderRadius: 6, border: "1px solid oklch(50% 0.05 260)", fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 600, color: offWhite, textDecoration: "none" }}>
            {t("All Resources", "Semua Sumber", "Alle Bronnen")}
          </Link>
        </div>
      </div>

      {/* Intro */}
      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, marginBottom: 20 }}>
          {t(
            "Cognitive biases are systematic errors in thinking that affect every human being — not just the uninformed or the unintelligent. They are shortcuts the brain takes to process the overwhelming volume of information it receives each day. In ordinary life, many of them are helpful. In leadership — and especially cross-cultural leadership — they can be devastating.",
            "Bias kognitif adalah kesalahan sistematis dalam berpikir yang mempengaruhi setiap manusia — bukan hanya yang tidak terinformasi atau tidak cerdas. Mereka adalah jalan pintas yang diambil otak untuk memproses volume informasi yang luar biasa yang diterimanya setiap hari. Dalam kehidupan biasa, banyak di antaranya berguna. Dalam kepemimpinan — dan terutama kepemimpinan lintas budaya — bias ini bisa sangat merusak.",
            "Cognitieve biases zijn systematische denkfouten die elke mens treffen — niet alleen de ongeïnformeerde of onintelligente. Het zijn snelkoppelingen die het brein neemt om het overweldigende volume informatie te verwerken dat het elke dag ontvangt. In het dagelijks leven zijn veel ervan nuttig. In leiderschap — en zeker in intercultureel leiderschap — kunnen ze verwoestend zijn."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75 }}>
          {t(
            "Cross-cultural leaders are especially vulnerable because they are operating in an environment where their brain's pattern-recognition system is working with incomplete data. Cultural norms they take for granted don't apply; behaviours that seem strange may be entirely rational; silence may mean something other than what they assume.",
            "Pemimpin lintas budaya sangat rentan karena mereka beroperasi di lingkungan di mana sistem pengenalan pola otak mereka bekerja dengan data yang tidak lengkap. Norma budaya yang mereka anggap bisa diterima begitu saja tidak berlaku; perilaku yang tampak aneh mungkin sepenuhnya rasional; keheningan mungkin berarti sesuatu yang berbeda dari yang mereka asumsikan.",
            "Interculturele leiders zijn bijzonder kwetsbaar omdat ze opereren in een omgeving waar het patroonherkenningssysteem van hun brein werkt met onvolledige gegevens. Culturele normen die ze als vanzelfsprekend beschouwen gelden niet; gedrag dat vreemd lijkt kan volkomen rationeel zijn; stilte kan iets anders betekenen dan ze veronderstellen."
          )}
        </p>
      </div>

      {/* ── 50-BIAS SEARCHABLE LIBRARY ── */}
      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>

          {/* Section header */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
              {t("Reference Library", "Perpustakaan Referensi", "Naslagbibliotheek")}
            </p>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: navy, marginBottom: 12 }}>
              {t("50 Biases — Cross-Cultural Impact", "50 Bias — Dampak Lintas Budaya", "50 Biases — Interculturele Impact")}
            </h2>
            <p style={{ color: bodyText, fontSize: 15, maxWidth: 560, margin: "0 auto" }}>
              {t(
                "Each bias below includes a specific note on how it shows up in cross-cultural leadership contexts.",
                "Setiap bias di bawah ini mencakup catatan khusus tentang bagaimana ia muncul dalam konteks kepemimpinan lintas budaya.",
                "Elke bias bevat een specifieke noot over hoe het zich manifesteert in interculturele leiderschapscontexten."
              )}
            </p>
          </div>

          {/* Search bar */}
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t("Search biases…", "Cari bias…", "Zoek biases…")}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "0.75rem 1rem",
              border: "1px solid oklch(82% 0.008 80)",
              background: offWhite,
              fontFamily: "Montserrat, sans-serif",
              fontSize: 14,
              color: navy,
              marginBottom: "1.25rem",
              outline: "none",
            }}
          />

          {/* Category filter */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <button
              onClick={() => setActiveCategory("all")}
              style={{ padding: "0.375rem 1rem", border: "1px solid", borderColor: activeCategory === "all" ? navy : "oklch(82% 0.008 80)", background: activeCategory === "all" ? navy : "transparent", color: activeCategory === "all" ? offWhite : bodyText, fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: "0.06em" }}
            >
              {t("All", "Semua", "Alle")} ({BIASES.length})
            </button>
            {(Object.entries(CATEGORY_META) as [BiasCategory, typeof CATEGORY_META[BiasCategory]][]).map(([key, meta]) => {
              const count = BIASES.filter(b => b.category === key).length;
              const isActive = activeCategory === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  style={{ padding: "0.375rem 1rem", border: "1px solid", borderColor: isActive ? meta.color : "oklch(82% 0.008 80)", background: isActive ? meta.color : "transparent", color: isActive ? offWhite : bodyText, fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: "0.06em" }}
                >
                  {lang === "en" ? meta.en : lang === "id" ? meta.id : meta.nl} ({count})
                </button>
              );
            })}
          </div>

          {/* Result count */}
          <p style={{ fontSize: 12, color: "oklch(55% 0.008 260)", marginBottom: "1.5rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {t(`Showing ${filteredBiases.length} of ${BIASES.length}`, `Menampilkan ${filteredBiases.length} dari ${BIASES.length}`, `Toont ${filteredBiases.length} van ${BIASES.length}`)}
          </p>

          {/* Cards grid */}
          {filteredBiases.length === 0 ? (
            <p style={{ textAlign: "center", color: bodyText, padding: "3rem 0" }}>
              {t("No biases match your search.", "Tidak ada bias yang cocok.", "Geen biases gevonden.")}
            </p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
              {filteredBiases.map(bias => {
                const catMeta = CATEGORY_META[bias.category];
                const displayName = lang === "en" ? bias.name : lang === "id" ? bias.name_id : bias.name_nl;
                const displayNote = lang === "en" ? bias.crossCulturalNote : lang === "id" ? bias.crossCulturalNote_id : bias.crossCulturalNote_nl;
                return (
                  <div
                    key={bias.name}
                    style={{ background: offWhite, border: "1px solid oklch(90% 0.008 80)", padding: "1.125rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                      <p style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 13, color: navy, margin: 0, lineHeight: 1.3 }}>
                        {displayName}
                      </p>
                      <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: offWhite, background: catMeta.color, padding: "2px 7px" }}>
                        {lang === "en" ? catMeta.en : lang === "id" ? catMeta.id : catMeta.nl}
                      </span>
                    </div>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12.5, color: bodyText, lineHeight: 1.65, margin: 0 }}>
                      {displayNote}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 6 Editorial deep-dives */}
      <div style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 12, textAlign: "center" }}>
            {t("6 Patterns Worth Understanding Deeply", "6 Pola yang Layak Dipahami Mendalam", "6 Patronen die Diep Begrip Verdienen")}
          </h2>
          <p style={{ textAlign: "center", color: bodyText, fontSize: 15, marginBottom: 48 }}>
            {t("These six show up most often — and most destructively — in cross-cultural teams.", "Enam ini paling sering muncul — dan paling destruktif — dalam tim lintas budaya.", "Deze zes komen het vaakst voor — en het meest destructief — in interculturele teams.")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {biasCategories.map((b) => (
              <div key={b.number} style={{ background: lightGray, borderRadius: 12, padding: "32px 36px", display: "flex", gap: 28, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 52, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 40, flexShrink: 0 }}>{b.number}</div>
                <div>
                  <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 18, fontWeight: 700, color: navy, marginBottom: 10 }}>
                    {lang === "en" ? b.en_title : lang === "id" ? b.id_title : b.nl_title}
                  </h3>
                  <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                    {lang === "en" ? b.en_example : lang === "id" ? b.id_example : b.nl_example}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Counter strategies */}
      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 12, textAlign: "center" }}>
            {t("5 Ways to Counter Bias", "5 Cara Mengatasi Bias", "5 Manieren om Bias te Tegengaan")}
          </h2>
          <p style={{ textAlign: "center", color: bodyText, marginBottom: 40, fontSize: 15 }}>
            {t("You cannot eliminate bias — but you can interrupt it.", "Anda tidak bisa menghilangkan bias — tetapi Anda bisa menginterupsinya.", "Je kunt bias niet elimineren — maar je kunt het wel onderbreken.")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {counterStrategies.map((s) => (
              <div key={s.number} style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 44, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 36, flexShrink: 0 }}>{s.number}</div>
                <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, margin: 0, paddingTop: 6 }}>
                  {lang === "en" ? s.en : lang === "id" ? s.id : s.nl}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reflection questions */}
      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
          {t("Reflection Questions", "Pertanyaan Refleksi", "Reflectievragen")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {reflectionQuestions.map((q) => (
            <div key={q.roman} style={{ background: lightGray, borderRadius: 10, padding: "24px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 22, fontWeight: 700, color: orange, minWidth: 28, flexShrink: 0 }}>{q.roman}</div>
              <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                {lang === "en" ? q.en : lang === "id" ? q.id : q.nl}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div style={{ background: navy, padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: offWhite, marginBottom: 16 }}>
          {t("Keep Growing", "Terus Bertumbuh", "Blijf Groeien")}
        </h2>
        <p style={{ color: "oklch(80% 0.03 80)", fontSize: 16, lineHeight: 1.75, maxWidth: 540, margin: "0 auto 32px" }}>
          {t("Explore more resources to deepen your cross-cultural leadership.", "Jelajahi lebih banyak sumber untuk memperdalam kepemimpinan lintas budaya Anda.", "Verken meer bronnen om je intercultureel leiderschap te verdiepen.")}
        </p>
        <Link href="/resources" style={{ display: "inline-block", padding: "14px 32px", background: orange, color: offWhite, borderRadius: 6, fontFamily: "Montserrat, sans-serif", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
          {t("← Content Library", "← Perpustakaan Konten", "← Contentbibliotheek")}
        </Link>
      </div>
    </div>
  );
}
