"use client";
import { useState, useTransition, useMemo } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id";
const tFn = (en: string, id: string, lang: Lang) =>
  lang === "en" ? en : id;

type BiasCategory = "memory" | "social" | "learning" | "belief" | "money" | "politics";

type Bias = {
  name: string;
  name_id: string;
  category: BiasCategory;
  crossCulturalNote: string;
  crossCulturalNote_id: string;
};

const CATEGORY_META: Record<BiasCategory, { en: string; id: string; color: string }> = {
  memory:   { en: "Memory",   id: "Memori",  color: "oklch(62% 0.12 220)" },
  social:   { en: "Social",   id: "Sosial",   color: "oklch(48% 0.14 260)" },
  learning: { en: "Learning", id: "Belajar",     color: "oklch(62% 0.14 80)"  },
  belief:   { en: "Belief",   id: "Keyakinan",color: "oklch(55% 0.16 25)"  },
  money:    { en: "Money",    id: "Keuangan",       color: "oklch(52% 0.14 145)" },
  politics: { en: "Politics", id: "Politik",  color: "oklch(62% 0.14 45)"  },
};

const BIASES: Bias[] = [
  // Memory
  {
    name: "Availability Heuristic",
    name_id: "Heuristik Ketersediaan",
    category: "memory",
    crossCulturalNote: "Leaders judge an entire region's potential based on one recent, high-profile story rather than representative data.",
    crossCulturalNote_id: "Pemimpin menilai potensi seluruh kawasan berdasarkan satu kisah menonjol yang baru terjadi, bukan data yang representatif.",
  },
  {
    name: "Forer Effect (Barnum Effect)",
    name_id: "Efek Forer (Efek Barnum)",
    category: "memory",
    crossCulturalNote: "Vague cultural assessments like 'this culture is collective' feel personally accurate but are too general to guide real decisions.",
    crossCulturalNote_id: "Penilaian budaya yang kabur seperti 'budaya ini kolektif' terasa akurat secara pribadi, tetapi terlalu umum untuk memandu keputusan nyata.",
  },
  {
    name: "Google Effect (Digital Amnesia)",
    name_id: "Efek Google (Amnesia Digital)",
    category: "memory",
    crossCulturalNote: "Leaders who look up local customs on demand rather than internalising them appear detached or disrespectful to local staff.",
    crossCulturalNote_id: "Pemimpin yang mencari adat lokal sesuai kebutuhan daripada menginternalisasikannya terlihat tidak peduli atau tidak menghormati staf lokal.",
  },
  {
    name: "Availability Cascade",
    name_id: "Kaskade Ketersediaan",
    category: "memory",
    crossCulturalNote: "Repeated negative tropes about a culture at HQ harden into 'fact' through sheer repetition, distorting a leader's expectations before they even arrive.",
    crossCulturalNote_id: "Klise negatif yang berulang tentang suatu budaya di kantor pusat mengeras menjadi 'fakta' melalui pengulangan semata, mendistorsi ekspektasi pemimpin bahkan sebelum mereka tiba.",
  },
  {
    name: "Tachypsychia",
    name_id: "Takipsikia",
    category: "memory",
    crossCulturalNote: "Under cross-border negotiation stress, a leader may perceive a culturally normal silence as far longer and more hostile than it actually is.",
    crossCulturalNote_id: "Di bawah tekanan negosiasi lintas batas, seorang pemimpin mungkin merasakan keheningan yang secara budaya normal jauh lebih lama dan lebih bermusuhan dari kenyataannya.",
  },
  {
    name: "Zeigarnik Effect",
    name_id: "Efek Zeigarnik",
    category: "memory",
    crossCulturalNote: "Preoccupation with unfinished home-office tasks distracts a leader from building the slow, patient relationships required in relationship-oriented cultures.",
    crossCulturalNote_id: "Keasyikan dengan tugas kantor pusat yang belum selesai mengalihkan perhatian pemimpin dari membangun hubungan yang lambat dan sabar yang dibutuhkan dalam budaya berorientasi hubungan.",
  },
  {
    name: "Suggestibility",
    name_id: "Sugestibilitas",
    category: "memory",
    crossCulturalNote: "A leader may unconsciously alter their memory of a meeting to match later 'cultural insights' from a consultant, skewing future strategy.",
    crossCulturalNote_id: "Seorang pemimpin mungkin secara tidak sadar mengubah ingatan mereka tentang suatu pertemuan agar sesuai dengan 'wawasan budaya' kemudian dari seorang konsultan, menyimpangkan strategi masa depan.",
  },
  {
    name: "False Memory",
    name_id: "Memori Palsu",
    category: "memory",
    crossCulturalNote: "A leader might 'remember' a local partner agreeing to terms that were never explicitly stated, creating trust-breaking moments when expectations aren't met.",
    crossCulturalNote_id: "Seorang pemimpin mungkin 'mengingat' mitra lokal menyetujui syarat-syarat yang tidak pernah dinyatakan secara eksplisit, menciptakan momen penghancur kepercayaan ketika ekspektasi tidak terpenuhi.",
  },
  {
    name: "Cryptomnesia",
    name_id: "Kriptomnesia",
    category: "memory",
    crossCulturalNote: "A leader may unknowingly present a local employee's culturally-specific idea as their own, damaging morale and local ownership.",
    crossCulturalNote_id: "Seorang pemimpin mungkin tanpa sadar mempresentasikan ide spesifik budaya karyawan lokal sebagai miliknya sendiri, merusak moral dan rasa kepemilikan lokal.",
  },
  // Social
  {
    name: "Fundamental Attribution Error",
    name_id: "Kesalahan Atribusi Fundamental",
    category: "social",
    crossCulturalNote: "Leaders blame a local employee's character for a missed deadline rather than considering situational factors like local infrastructure or public holidays.",
    crossCulturalNote_id: "Pemimpin menyalahkan karakter karyawan lokal atas tenggat waktu yang terlewat daripada mempertimbangkan faktor situasional seperti infrastruktur lokal atau hari libur.",
  },
  {
    name: "Self-Serving Bias",
    name_id: "Bias Melayani Diri Sendiri",
    category: "social",
    crossCulturalNote: "Leaders credit their own 'global mindset' for project success while blaming 'local cultural resistance' for failure.",
    crossCulturalNote_id: "Pemimpin mengaitkan 'pola pikir global' mereka sendiri dengan keberhasilan proyek sambil menyalahkan 'resistensi budaya lokal' atas kegagalan.",
  },
  {
    name: "In-Group Favoritism",
    name_id: "Favoritisme Dalam Kelompok",
    category: "social",
    crossCulturalNote: "Leaders unintentionally offer better assignments or mentoring to expats from their home country rather than to equally capable local talent.",
    crossCulturalNote_id: "Pemimpin tanpa sengaja menawarkan penugasan atau bimbingan yang lebih baik kepada ekspatriat dari negara asal mereka daripada kepada talenta lokal yang sama mampunya.",
  },
  {
    name: "Halo Effect",
    name_id: "Efek Halo",
    category: "social",
    crossCulturalNote: "If a local manager speaks the leader's language fluently, the leader incorrectly assumes equal competence in all other areas.",
    crossCulturalNote_id: "Jika seorang manajer lokal berbicara bahasa pemimpin dengan lancar, pemimpin secara keliru berasumsi memiliki kompetensi yang sama di semua bidang lain.",
  },
  {
    name: "Moral Luck",
    name_id: "Keberuntungan Moral",
    category: "social",
    crossCulturalNote: "A leader judges a local manager's character based on outcomes shaped by local market volatility or political instability outside that manager's control.",
    crossCulturalNote_id: "Seorang pemimpin menilai karakter manajer lokal berdasarkan hasil yang dibentuk oleh volatilitas pasar lokal atau ketidakstabilan politik di luar kendali manajer tersebut.",
  },
  {
    name: "False Consensus",
    name_id: "Konsensus Palsu",
    category: "social",
    crossCulturalNote: "Leaders assume their 'universal' management style is desired everywhere, failing to recognise that local teams may prefer fundamentally different leadership behaviour.",
    crossCulturalNote_id: "Pemimpin berasumsi bahwa gaya manajemen 'universal' mereka diinginkan di mana-mana, gagal menyadari bahwa tim lokal mungkin lebih menyukai perilaku kepemimpinan yang secara fundamental berbeda.",
  },
  {
    name: "Spotlight Effect",
    name_id: "Efek Sorotan",
    category: "social",
    crossCulturalNote: "Expat leaders overthink their cultural gaffes, believing the local team is constantly judging them — creating unnecessary anxiety and social distance.",
    crossCulturalNote_id: "Pemimpin ekspatriat terlalu memikirkan kesalahan budaya mereka, percaya tim lokal terus-menerus menilai mereka — menciptakan kecemasan yang tidak perlu dan jarak sosial.",
  },
  {
    name: "Defensive Attribution",
    name_id: "Atribusi Defensif",
    category: "social",
    crossCulturalNote: "When accidents occur in a foreign branch, leaders may blame local teams more harshly because they feel less similar to them.",
    crossCulturalNote_id: "Ketika kecelakaan terjadi di cabang asing, pemimpin mungkin menyalahkan tim lokal lebih keras karena mereka merasa kurang serupa dengan mereka.",
  },
  {
    name: "Just-World Hypothesis",
    name_id: "Hipotesis Dunia Adil",
    category: "social",
    crossCulturalNote: "Leaders assume a struggling local office simply isn't working hard enough, ignoring systemic inequalities or historical disadvantages in that region.",
    crossCulturalNote_id: "Pemimpin berasumsi bahwa kantor lokal yang berjuang memang tidak bekerja cukup keras, mengabaikan ketidaksetaraan sistemik atau kerugian historis di kawasan tersebut.",
  },
  {
    name: "Na—ve Realism",
    name_id: "Realisme Naif",
    category: "social",
    crossCulturalNote: "Leaders believe their business perspective is objective and that local dissent reflects bias — not a legitimately different, equally valid view.",
    crossCulturalNote_id: "Pemimpin percaya perspektif bisnis mereka objektif dan bahwa ketidaksetujuan lokal mencerminkan bias — bukan pandangan yang legitimately berbeda dan sama-sama valid.",
  },
  {
    name: "Na—ve Cynicism",
    name_id: "Sinisme Naif",
    category: "social",
    crossCulturalNote: "Leaders dismiss a local partner's emphasis on relationship-building as self-interest, missing the deep cultural value of concepts like guanxi or wasta.",
    crossCulturalNote_id: "Pemimpin mengabaikan penekanan mitra lokal pada pembangunan hubungan sebagai kepentingan diri sendiri, melewatkan nilai budaya mendalam dari konsep seperti guanxi atau wasta.",
  },
  {
    name: "Dunning-Kruger Effect",
    name_id: "Efek Dunning-Kruger",
    category: "social",
    crossCulturalNote: "After one trip to a new country, a leader believes they are now a cultural expert — leading to overconfident and often costly decisions.",
    crossCulturalNote_id: "Setelah satu kali kunjungan ke negara baru, seorang pemimpin percaya dirinya kini ahli budaya — yang mengarah pada keputusan yang terlalu percaya diri dan seringkali mahal.",
  },
  {
    name: "Third-Person Effect",
    name_id: "Efek Orang Ketiga",
    category: "social",
    crossCulturalNote: "Leaders believe their local teams are susceptible to cultural bias while remaining convinced they themselves are immune.",
    crossCulturalNote_id: "Pemimpin percaya bahwa tim lokal mereka rentan terhadap bias budaya sementara tetap yakin bahwa mereka sendiri kebal.",
  },
  {
    name: "Stereotyping",
    name_id: "Stereotip",
    category: "social",
    crossCulturalNote: "Leaders expect a local employee to behave like a cultural archetype, missing the individual's unique strengths and personality.",
    crossCulturalNote_id: "Pemimpin mengharapkan karyawan lokal berperilaku seperti arketipe budaya, melewatkan kekuatan dan kepribadian unik individu tersebut.",
  },
  {
    name: "Outgroup Homogeneity Bias",
    name_id: "Bias Homogenitas Luar Kelompok",
    category: "social",
    crossCulturalNote: "Leaders treat 'the Asian team' as a monolithic group, ignoring the vast cultural differences between nationalities, subcultures, and generations.",
    crossCulturalNote_id: "Pemimpin memperlakukan 'tim Asia' sebagai kelompok monolitik, mengabaikan perbedaan budaya yang sangat besar antara kebangsaan, subkultur, dan generasi.",
  },
  {
    name: "Ben Franklin Effect",
    name_id: "Efek Ben Franklin",
    category: "social",
    crossCulturalNote: "Asking a local peer for a small favour can increase their investment in the partnership — a useful tool for building cross-cultural trust.",
    crossCulturalNote_id: "Meminta rekan lokal untuk melakukan bantuan kecil dapat meningkatkan investasi mereka dalam kemitraan — alat yang berguna untuk membangun kepercayaan lintas budaya.",
  },
  {
    name: "Bystander Effect",
    name_id: "Efek Penonton",
    category: "social",
    crossCulturalNote: "In a multicultural HQ, leaders fail to address subtle discrimination, assuming someone in the Diversity department will handle it.",
    crossCulturalNote_id: "Di kantor pusat multikultural, pemimpin gagal menangani diskriminasi halus, berasumsi bahwa seseorang di departemen Keberagaman akan menanganinya.",
  },
  {
    name: "Blind Spot Bias",
    name_id: "Bias Titik Buta",
    category: "social",
    crossCulturalNote: "Leaders readily identify cultural biases in their local staff while remaining blind to their own ethnocentrism.",
    crossCulturalNote_id: "Pemimpin dengan mudah mengidentifikasi bias budaya pada staf lokal mereka sambil tetap buta terhadap etnosentrisme mereka sendiri.",
  },
  // Learning
  {
    name: "Curse of Knowledge",
    name_id: "Kutukan Pengetahuan",
    category: "learning",
    crossCulturalNote: "HQ experts can't explain processes clearly to local teams because they've forgotten what it's like not to have 10 years of institutional context.",
    crossCulturalNote_id: "Para ahli kantor pusat tidak dapat menjelaskan proses dengan jelas kepada tim lokal karena mereka telah melupakan bagaimana rasanya tidak memiliki 10 tahun konteks kelembagaan.",
  },
  {
    name: "Anchoring",
    name_id: "Penjangkaran",
    category: "learning",
    crossCulturalNote: "A leader fixates on the first cost estimate from a local vendor, failing to recalibrate even as more reliable market data becomes available.",
    crossCulturalNote_id: "Seorang pemimpin terpaku pada perkiraan biaya pertama dari vendor lokal, gagal untuk mengkalibrasi ulang meskipun data pasar yang lebih andal tersedia.",
  },
  {
    name: "Declinism",
    name_id: "Dekilinisme",
    category: "learning",
    crossCulturalNote: "Leaders compare every foreign market to a nostalgic 'golden era' of expansion, failing to see fresh opportunities in the current landscape.",
    crossCulturalNote_id: "Pemimpin membandingkan setiap pasar asing dengan 'era emas' ekspansi yang nostalgis, gagal melihat peluang segar dalam lanskap saat ini.",
  },
  {
    name: "Status Quo Bias",
    name_id: "Bias Status Quo",
    category: "learning",
    crossCulturalNote: "Leaders resist adapting proven home-country strategies to local needs, preferring the familiar over the effective.",
    crossCulturalNote_id: "Pemimpin menolak mengadaptasi strategi negara asal yang terbukti untuk kebutuhan lokal, lebih memilih yang familiar daripada yang efektif.",
  },
  {
    name: "Framing Effect",
    name_id: "Efek Pembingkaian",
    category: "learning",
    crossCulturalNote: "A local team's response to the same proposal shifts entirely based on whether it's framed as a gain or a loss — cultural context amplifies this further.",
    crossCulturalNote_id: "Respons tim lokal terhadap proposal yang sama berubah sepenuhnya berdasarkan apakah proposal tersebut dibingkai sebagai keuntungan atau kerugian — konteks budaya memperkuat hal ini lebih jauh.",
  },
  {
    name: "Survivorship Bias",
    name_id: "Bias Kelangsungan Hidup",
    category: "learning",
    crossCulturalNote: "Leaders study only the few successful multinational entries in a region, missing the majority of failures that would teach them what not to do.",
    crossCulturalNote_id: "Pemimpin hanya mempelajari sedikit entri multinasional yang berhasil di suatu kawasan, melewatkan mayoritas kegagalan yang akan mengajarkan mereka apa yang tidak harus dilakukan.",
  },
  {
    name: "Clustering Illusion",
    name_id: "Ilusi Pengelompokan",
    category: "learning",
    crossCulturalNote: "Two or three coincidental sales in a new market get interpreted as a trend, prompting premature and costly scaling.",
    crossCulturalNote_id: "Dua atau tiga penjualan kebetulan di pasar baru ditafsirkan sebagai tren, mendorong penskalaan yang prematur dan mahal.",
  },
  {
    name: "Pessimism Bias",
    name_id: "Bias Pesimisme",
    category: "learning",
    crossCulturalNote: "Leaders overestimate political or economic instability in developing markets, causing the company to miss early-mover advantages.",
    crossCulturalNote_id: "Pemimpin melebih-lebihkan ketidakstabilan politik atau ekonomi di pasar berkembang, menyebabkan perusahaan melewatkan keuntungan penggerak awal.",
  },
  {
    name: "Optimism Bias",
    name_id: "Bias Optimisme",
    category: "learning",
    crossCulturalNote: "Leaders underestimate the time needed to navigate local bureaucracies, leading to missed deadlines and significant budget overruns.",
    crossCulturalNote_id: "Pemimpin meremehkan waktu yang diperlukan untuk menavigasi birokrasi lokal, yang mengarah pada tenggat waktu yang terlewat dan pembengkakan anggaran yang signifikan.",
  },
  // Belief
  {
    name: "Bandwagon Effect",
    name_id: "Efek Ikut-ikutan",
    category: "belief",
    crossCulturalNote: "A leader enters a popular 'emerging market' because competitors are doing so — without a real strategic fit for their specific mission or organisation.",
    crossCulturalNote_id: "Seorang pemimpin memasuki 'pasar berkembang' yang populer karena pesaing melakukannya — tanpa kesesuaian strategis yang nyata untuk misi atau organisasi spesifik mereka.",
  },
  {
    name: "Automation Bias",
    name_id: "Bias Otomasi",
    category: "belief",
    crossCulturalNote: "Over-reliance on standardised HR software causes leaders to miss high-potential local candidates who don't fit a Western-built algorithm of success.",
    crossCulturalNote_id: "Ketergantungan berlebihan pada perangkat lunak HR yang terstandarisasi menyebabkan pemimpin melewatkan kandidat lokal berpotensi tinggi yang tidak sesuai dengan algoritma keberhasilan yang dibangun oleh Barat.",
  },
  {
    name: "Reactance",
    name_id: "Reaktansi",
    category: "belief",
    crossCulturalNote: "If HQ rules are imposed too aggressively, local employees feel their autonomy is threatened and may intentionally undermine the new policies.",
    crossCulturalNote_id: "Jika aturan kantor pusat diberlakukan terlalu agresif, karyawan lokal merasa otonomi mereka terancam dan mungkin dengan sengaja merusak kebijakan baru.",
  },
  {
    name: "Confirmation Bias",
    name_id: "Bias Konfirmasi",
    category: "belief",
    crossCulturalNote: "Leaders notice only information that supports existing cultural stereotypes while filtering out evidence that would challenge them.",
    crossCulturalNote_id: "Pemimpin hanya memperhatikan informasi yang mendukung stereotip budaya yang ada sambil menyaring bukti yang akan menantang mereka.",
  },
  {
    name: "Backfire Effect",
    name_id: "Efek Bumerang",
    category: "belief",
    crossCulturalNote: "When a leader presents data to disprove a local team's long-held business practice, it can actually strengthen their resolve to keep doing it.",
    crossCulturalNote_id: "Ketika seorang pemimpin menyajikan data untuk membantah praktik bisnis tim lokal yang sudah lama dipegang, hal itu sebenarnya dapat memperkuat tekad mereka untuk terus melakukannya.",
  },
  {
    name: "Belief Bias",
    name_id: "Bias Keyakinan",
    category: "belief",
    crossCulturalNote: "Leaders accept a weak business case from a local partner simply because the final conclusion aligns with their own cultural assumptions.",
    crossCulturalNote_id: "Pemimpin menerima kasus bisnis yang lemah dari mitra lokal hanya karena kesimpulan akhirnya selaras dengan asumsi budaya mereka sendiri.",
  },
  {
    name: "Authority Bias",
    name_id: "Bias Otoritas",
    category: "belief",
    crossCulturalNote: "In high-power-distance cultures, a leader receives only agreement — honest, necessary dissent is withheld from anyone holding a senior title.",
    crossCulturalNote_id: "Dalam budaya jarak kekuasaan tinggi, seorang pemimpin hanya menerima persetujuan — ketidaksetujuan yang jujur dan perlu ditahan dari siapa pun yang memegang jabatan senior.",
  },
  {
    name: "Placebo Effect",
    name_id: "Efek Plasebo",
    category: "belief",
    crossCulturalNote: "A leader believes a new cross-cultural training program is working simply because money was spent on it, even when team behaviour is unchanged.",
    crossCulturalNote_id: "Seorang pemimpin percaya program pelatihan lintas budaya yang baru berhasil hanya karena uang dihabiskan untuk itu, bahkan ketika perilaku tim tidak berubah.",
  },
  // Money
  {
    name: "Sunk Cost Fallacy",
    name_id: "Kesalahan Biaya Hangus",
    category: "money",
    crossCulturalNote: "Leaders continue pouring resources into a failing foreign subsidiary because they've invested too much ego and time to admit the strategy isn't working.",
    crossCulturalNote_id: "Pemimpin terus menuangkan sumber daya ke anak perusahaan asing yang gagal karena mereka telah menginvestasikan terlalu banyak ego dan waktu untuk mengakui bahwa strategi tidak berhasil.",
  },
  {
    name: "Gambler's Fallacy",
    name_id: "Kekeliruan Penjudi",
    category: "money",
    crossCulturalNote: "After several failed product launches in a new region, a leader believes they're 'due' for a win rather than addressing root causes.",
    crossCulturalNote_id: "Setelah beberapa peluncuran produk yang gagal di kawasan baru, seorang pemimpin percaya mereka 'sudah waktunya' untuk menang daripada menangani akar penyebabnya.",
  },
  {
    name: "Zero-Risk Bias",
    name_id: "Bias Risiko Nol",
    category: "money",
    crossCulturalNote: "Leaders waste resources eliminating minor local risks while ignoring larger, more significant threats that carry greater long-term cost.",
    crossCulturalNote_id: "Pemimpin membuang sumber daya untuk menghilangkan risiko lokal kecil sambil mengabaikan ancaman yang lebih besar dan lebih signifikan yang membawa biaya jangka panjang lebih besar.",
  },
  {
    name: "IKEA Effect",
    name_id: "Efek IKEA",
    category: "money",
    crossCulturalNote: "A leader overvalues a business plan they helped create, dismissing superior, more culturally-nuanced suggestions from local managers.",
    crossCulturalNote_id: "Seorang pemimpin terlalu menghargai rencana bisnis yang mereka bantu buat, mengabaikan saran yang lebih unggul dan lebih bernuansa budaya dari manajer lokal.",
  },
  // Politics
  {
    name: "Groupthink",
    name_id: "Pemikiran Kelompok",
    category: "politics",
    crossCulturalNote: "An expat leadership team isolates from local advice to maintain internal harmony, producing out-of-touch strategic decisions that locals could have prevented.",
    crossCulturalNote_id: "Tim kepemimpinan ekspatriat mengisolasi diri dari saran lokal untuk menjaga harmoni internal, menghasilkan keputusan strategis yang tidak relevan yang bisa dicegah oleh orang lokal.",
  },
  {
    name: "Law of Triviality",
    name_id: "Hukum Trivialitas",
    category: "politics",
    crossCulturalNote: "A cross-cultural team spends hours debating slogan translation while ignoring major flaws in the underlying distribution or go-to-market model.",
    crossCulturalNote_id: "Tim lintas budaya menghabiskan berjam-jam memperdebatkan terjemahan slogan sambil mengabaikan kelemahan besar dalam model distribusi atau go-to-market yang mendasarinya.",
  },
];

const biasCategories = [
  { number: "1", en_title: "Attribution Biases", id_title: "Bias Atribusi", en_example: "Fundamental Attribution Error: attributing others' poor behaviour to their character while attributing your own to circumstances. In cross-cultural settings, this means assuming a team member is lazy when they are actually navigating a cultural expectation you don't understand.", id_example: "Kesalahan Atribusi Fundamental: mengatribusikan perilaku buruk orang lain pada karakter mereka sementara mengatribusikan milik Anda sendiri pada keadaan. Dalam konteks lintas budaya, ini berarti mengasumsikan anggota tim malas ketika mereka sebenarnya menavigasi harapan budaya yang tidak Anda pahami." },
  { number: "2", en_title: "Confirmation Bias", id_title: "Bias Konfirmasi", en_example: "Seeking and favouring information that confirms your existing beliefs. In cross-cultural leadership, this creates a dangerous feedback loop: you believe local leaders are not ready for authority, you only notice evidence that supports this, and you never actually give them the chance that would disprove it.", id_example: "Mencari dan mendukung informasi yang mengkonfirmasi keyakinan Anda yang ada. Dalam kepemimpinan lintas budaya, ini menciptakan lingkaran umpan balik yang berbahaya: Anda percaya pemimpin lokal tidak siap untuk otoritas, Anda hanya memperhatikan bukti yang mendukung ini." },
  { number: "3", en_title: "In-Group / Out-Group Bias", id_title: "Bias Dalam Kelompok / Luar Kelompok", en_example: "Favouring people who are culturally similar to you — in hiring, delegation, and trust. This bias operates below conscious awareness and is one of the most damaging in multicultural teams. Leaders consistently give more opportunities, grace, and benefit of the doubt to people who look, speak, and think like them.", id_example: "Menyukai orang yang secara budaya mirip dengan Anda — dalam perekrutan, delegasi, dan kepercayaan. Bias ini beroperasi di bawah kesadaran dan merupakan salah satu yang paling merusak dalam tim multikultural." },
  { number: "4", en_title: "Availability Bias", id_title: "Bias Ketersediaan", en_example: "Overweighting information that is easily recalled. The last thing that went wrong becomes disproportionately influential. In cross-cultural leadership: one bad experience with a team from a particular culture colours all future interactions with people from that background.", id_example: "Memberi bobot berlebihan pada informasi yang mudah diingat. Hal terakhir yang berjalan salah menjadi sangat berpengaruh. Dalam kepemimpinan lintas budaya: satu pengalaman buruk dengan tim dari budaya tertentu mewarnai semua interaksi masa depan dengan orang-orang dari latar belakang itu." },
  { number: "5", en_title: "Anchoring Bias", id_title: "Bias Penjangkaran", en_example: "Relying too heavily on the first piece of information encountered. If your first impression of a culture is negative (perhaps from a difficult entry experience), that anchor shapes all subsequent interpretations even when circumstances improve.", id_example: "Terlalu mengandalkan informasi pertama yang ditemui. Jika kesan pertama Anda tentang budaya negatif (mungkin dari pengalaman masuk yang sulit), jangkar itu membentuk semua interpretasi selanjutnya bahkan ketika keadaan membaik." },
  { number: "6", en_title: "Halo / Horn Effect", id_title: "Efek Halo / Tanduk", en_example: "Letting one positive quality (halo) or one negative quality (horns) define your entire perception of a person. Common in cross-cultural settings when a person's language proficiency — or accent — colours your assessment of their intelligence, leadership capacity, or trustworthiness.", id_example: "Membiarkan satu kualitas positif (halo) atau satu kualitas negatif (tanduk) mendefinisikan seluruh persepsi Anda tentang seseorang. Umum dalam konteks lintas budaya ketika kemampuan bahasa seseorang mewarnai penilaian Anda." },
];

const counterStrategies = [
  { number: "1", en: "Name your biases before high-stakes decisions — literally write down: 'What bias might be shaping my thinking here?'", id: "Sebutkan bias Anda sebelum keputusan berisiko tinggi — secara harfiah tuliskan: 'Bias apa yang mungkin membentuk pemikiran saya di sini?'" },
  { number: "2", en: "Build cross-cultural accountability — have someone from a different background review significant decisions with you.", id: "Bangun akuntabilitas lintas budaya — minta seseorang dari latar belakang yang berbeda untuk meninjau keputusan penting bersama Anda." },
  { number: "3", en: "Delay judgment — resist the urge to categorise quickly. The longer you suspend interpretation, the more accurate it becomes.", id: "Tunda penilaian — tahan dorongan untuk mengkategorikan dengan cepat. Semakin lama Anda menangguhkan interpretasi, semakin akurat itu." },
  { number: "4", en: "Actively seek disconfirming information — ask: 'What would have to be true for me to be wrong about this?'", id: "Secara aktif cari informasi yang menyangkal — tanyakan: 'Apa yang harus benar agar saya salah tentang ini?'" },
  { number: "5", en: "Practice cultural humility as a spiritual discipline — remember that you see through a glass darkly (1 Corinthians 13:12). Your perception is partial.", id: "Praktikkan kerendahan hati budaya sebagai disiplin rohani — ingat bahwa Anda melihat melalui kaca yang gelap (1 Korintus 13:12). Persepsi Anda hanya sebagian." },
];

const reflectionQuestions = [
  { roman: "I", en: "Which of the six bias categories resonates most with patterns you notice in yourself?", id: "Kategori bias mana dari enam yang paling beresonansi dengan pola yang Anda perhatikan dalam diri Anda?" },
  { roman: "II", en: "Have you ever made a significant judgment about a team member that you later discovered was culturally misread?", id: "Pernahkah Anda membuat penilaian signifikan tentang anggota tim yang kemudian Anda temukan disalahbaca secara budaya?" },
  { roman: "III", en: "Who in your life gives you the most honest feedback on your blind spots? Is that enough?", id: "Siapa dalam hidup Anda yang memberi Anda umpan balik paling jujur tentang titik buta Anda? Apakah itu cukup?" },
  { roman: "IV", en: "How might your own cultural background be a source of systematic bias that you have never questioned?", id: "Bagaimana latar belakang budaya Anda sendiri bisa menjadi sumber bias sistematis yang belum pernah Anda pertanyakan?" },
  { roman: "V", en: "What would humble, learner-posture leadership look like in your specific cultural and ministry context?", id: "Seperti apa kepemimpinan yang rendah hati dan berpostur pelajar dalam konteks budaya dan pelayanan spesifik Anda?" },
  { roman: "VI", en: "How does the biblical imperative to 'think of others as more significant than yourselves' (Phil 2:3) serve as an antidote to bias?", id: "Bagaimana imperatif alkitabiah untuk 'menganggap orang lain lebih penting dari diri Anda sendiri' (Fil 2:3) berfungsi sebagai penawar bias?" },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function CognitiveBiasesClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<BiasCategory | "all">("all");
  const t = (en: string, id: string) => tFn(en, id, lang);

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
      <LangToggle />
      {/* Lang bar */}

      {/* Hero */}
      <div style={{ background: navy, padding: "80px 24px 72px" }}>
        <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
          {t("Thinking Tools — Guide", "Alat Berpikir — Panduan", "Denktools — Gids")}
        </p>
        <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, color: offWhite, margin: "0 0 24px", lineHeight: 1.08 }}>
          {t("Cognitive Biases in Leadership", "Bias Kognitif dalam Kepemimpinan", "Cognitieve Biases in Leiderschap")}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(16px, 2vw, 19px)", color: "oklch(85% 0.03 80)", maxWidth: 580, margin: "0 0 32px", lineHeight: 1.65 }}>
          {t(
            '"We think we see the world as it is. We actually see the world as we are." — Ana—s Nin',
            '"Kita pikir kita melihat dunia sebagaimana adanya. Kita sebenarnya melihat dunia sebagaimana kita adanya." — Ana—s Nin',
            '"We denken dat we de wereld zien zoals ze is. We zien de wereld eigenlijk zoals wij zijn." — Ana—s Nin'
          )}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={handleSave} disabled={saved || isPending} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: saved ? "oklch(35% 0.08 260)" : "transparent", color: "oklch(75% 0.04 260)", padding: "14px 28px", borderRadius: 12, fontWeight: 600, fontSize: 14, border: "1px solid oklch(42% 0.08 260)", cursor: saved ? "default" : "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
            {saved ? t("Saved to Dashboard", "Tersimpan di Dashboard", "Opgeslagen in Dashboard") : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
          </button>
        </div>
      </div>

      {/* Intro */}
      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, marginBottom: 20 }}>
          {t(
            "Cognitive biases are systematic errors in thinking that affect every human being — not just the uninformed or the unintelligent. They are shortcuts the brain takes to process the overwhelming volume of information it receives each day. In ordinary life, many of them are helpful. In leadership — and especially cross-cultural leadership — they can be devastating.",
            "Bias kognitif adalah kesalahan sistematis dalam berpikir yang mempengaruhi setiap manusia — bukan hanya yang tidak terinformasi atau tidak cerdas. Mereka adalah jalan pintas yang diambil otak untuk memproses volume informasi yang luar biasa yang diterimanya setiap hari. Dalam kehidupan biasa, banyak di antaranya berguna. Dalam kepemimpinan — dan terutama kepemimpinan lintas budaya — bias ini bisa sangat merusak.",
            "Cognitieve biases zijn systematische denkfouten die elke mens treffen — niet alleen de onge—nformeerde of onintelligente. Het zijn snelkoppelingen die het brein neemt om het overweldigende volume informatie te verwerken dat het elke dag ontvangt. In het dagelijks leven zijn veel ervan nuttig. In leiderschap — en zeker in intercultureel leiderschap — kunnen ze verwoestend zijn."
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

      {/* -- 50-BIAS SEARCHABLE LIBRARY -- */}
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
            placeholder={t("Search biases—", "Cari bias—", "Zoek biases—")}
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
                  {lang === "en" ? meta.en : meta.id} ({count})
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
                const displayName = lang === "en" ? bias.name : bias.name_id;
                const displayNote = lang === "en" ? bias.crossCulturalNote : bias.crossCulturalNote_id;
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
                        {lang === "en" ? catMeta.en : lang === "id" ? catMeta.id : catMeta.id}
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
                    {lang === "en" ? b.en_title : b.id_title}
                  </h3>
                  <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                    {lang === "en" ? b.en_example : b.id_example}
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
                  {lang === "en" ? s.en : s.id}
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
                {lang === "en" ? q.en : q.id}
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
          {t("Explore more training modules to deepen your cross-cultural leadership.", "Jelajahi lebih banyak modul pelatihan untuk memperdalam kepemimpinan lintas budaya Anda.", "Verken meer bronnen om je intercultureel leiderschap te verdiepen.")}
        </p>
        <Link href="/resources" style={{ display: "inline-block", padding: "14px 32px", background: orange, color: offWhite, borderRadius: 12, fontFamily: "Montserrat, sans-serif", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
          {t("Training", "Pelatihan", "Contentbibliotheek")}
        </Link>
      </div>
    </div>
  );
}
