"use client";
import { useState, useTransition, useMemo, useEffect } from "react";
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
  researchFact: string;
  researchFact_id: string;
};

const CATEGORY_META: Record<BiasCategory, { en: string; id: string; color: string }> = {
  memory:   { en: "Memory",   id: "Memori",    color: "oklch(62% 0.12 220)" },
  social:   { en: "Social",   id: "Sosial",    color: "oklch(48% 0.14 260)" },
  learning: { en: "Learning", id: "Belajar",   color: "oklch(62% 0.14 80)"  },
  belief:   { en: "Belief",   id: "Keyakinan", color: "oklch(55% 0.16 25)"  },
  money:    { en: "Money",    id: "Keuangan",  color: "oklch(52% 0.14 145)" },
  politics: { en: "Politics", id: "Politik",   color: "oklch(62% 0.14 45)"  },
};

const BIASES: Bias[] = [
  // Memory
  {
    name: "Availability Heuristic",
    name_id: "Heuristik Ketersediaan",
    category: "memory",
    crossCulturalNote: "Leaders judge an entire region's potential based on one recent, high-profile story rather than representative data.",
    crossCulturalNote_id: "Pemimpin menilai potensi seluruh kawasan berdasarkan satu kisah menonjol yang baru terjadi, bukan data yang representatif.",
    researchFact: "Named by Kahneman & Tversky (1974). In their study, people judged words starting with 'K' more common than words with 'K' as the third letter — because first-letter words are easier to recall, despite third-letter words outnumbering them 3:1.",
    researchFact_id: "Dinamai oleh Kahneman & Tversky (1974). Dalam penelitian mereka, orang menilai kata berawalan 'K' lebih umum daripada kata dengan 'K' di posisi ketiga — karena kata berawalan lebih mudah diingat, meski kata berposisi ketiga jumlahnya 3 kali lebih banyak.",
  },
  {
    name: "Forer Effect (Barnum Effect)",
    name_id: "Efek Forer (Efek Barnum)",
    category: "memory",
    crossCulturalNote: "Vague cultural assessments like 'this culture is collective' feel personally accurate but are too general to guide real decisions.",
    crossCulturalNote_id: "Penilaian budaya yang kabur seperti 'budaya ini kolektif' terasa akurat secara pribadi, tetapi terlalu umum untuk memandu keputusan nyata.",
    researchFact: "In 1948, psychologist Bertram Forer gave identical horoscope-style personality profiles to every student in his class. 85% rated the description as 'accurate' or 'very accurate' for themselves — the text was copied verbatim from an astrology book.",
    researchFact_id: "Pada 1948, psikolog Bertram Forer memberikan profil kepribadian identik bergaya horoskop kepada seluruh kelasnya. 85% menilai deskripsi itu 'akurat' untuk diri mereka — teksnya disalin langsung dari buku astrologi.",
  },
  {
    name: "Google Effect (Digital Amnesia)",
    name_id: "Efek Google (Amnesia Digital)",
    category: "memory",
    crossCulturalNote: "Leaders who look up local customs on demand rather than internalising them appear detached or disrespectful to local staff.",
    crossCulturalNote_id: "Pemimpin yang mencari adat lokal sesuai kebutuhan daripada menginternalisasikannya terlihat tidak peduli atau tidak menghormati staf lokal.",
    researchFact: "Sparrow, Liu & Wegner (2011, Science): When told information would be saved online, people recalled the content less but remembered where to find it. The internet doesn't just change what we remember — it reshapes the architecture of memory itself.",
    researchFact_id: "Sparrow, Liu & Wegner (2011, Science): Ketika tahu informasi dapat disimpan online, orang lebih sedikit mengingat konten namun mengingat di mana menemukannya. Internet tidak hanya mengubah apa yang kita ingat — tetapi mengubah arsitektur memori itu sendiri.",
  },
  {
    name: "Availability Cascade",
    name_id: "Kaskade Ketersediaan",
    category: "memory",
    crossCulturalNote: "Repeated negative tropes about a culture at HQ harden into 'fact' through sheer repetition, distorting a leader's expectations before they even arrive.",
    crossCulturalNote_id: "Klise negatif yang berulang tentang suatu budaya di kantor pusat mengeras menjadi 'fakta' melalui pengulangan semata, mendistorsi ekspektasi pemimpin bahkan sebelum mereka tiba.",
    researchFact: "Sunstein & Kuran (1999): An emotional, repeatable narrative spreads through media and social networks, growing in perceived credibility with each retelling. Gulf War Syndrome — where diverse symptoms became linked through media repetition — is a documented example.",
    researchFact_id: "Sunstein & Kuran (1999): Narasi emosional yang mudah diulang menyebar melalui media dan jaringan sosial, semakin dipercaya setiap kali diceritakan ulang. Gulf War Syndrome — di mana berbagai gejala terhubung melalui pengulangan media — adalah contoh yang terdokumentasi.",
  },
  {
    name: "Tachypsychia",
    name_id: "Takipsikia",
    category: "memory",
    crossCulturalNote: "Under cross-border negotiation stress, a leader may perceive a culturally normal silence as far longer and more hostile than it actually is.",
    crossCulturalNote_id: "Di bawah tekanan negosiasi lintas batas, seorang pemimpin mungkin merasakan keheningan yang secara budaya normal jauh lebih lama dan lebih bermusuhan dari kenyataannya.",
    researchFact: "From Greek: 'swift mind.' Documented in police officers, accident survivors, and combat veterans. Adrenaline distorts time perception and narrows spatial awareness by up to 70% — which is why high-stakes moments feel both accelerated and slowed simultaneously.",
    researchFact_id: "Dari bahasa Yunani: 'pikiran cepat.' Terdokumentasi pada petugas polisi, korban kecelakaan, dan veteran tempur. Adrenalin mendistorsi persepsi waktu dan mempersempit kesadaran spasial hingga 70% — itulah mengapa momen berisiko tinggi terasa sekaligus dipercepat dan diperlambat.",
  },
  {
    name: "Zeigarnik Effect",
    name_id: "Efek Zeigarnik",
    category: "memory",
    crossCulturalNote: "Preoccupation with unfinished home-office tasks distracts a leader from building the slow, patient relationships required in relationship-oriented cultures.",
    crossCulturalNote_id: "Keasyikan dengan tugas kantor pusat yang belum selesai mengalihkan perhatian pemimpin dari membangun hubungan yang lambat dan sabar yang dibutuhkan dalam budaya berorientasi hubungan.",
    researchFact: "Soviet psychologist Bluma Zeigarnik (1927) noticed waiters remembered unpaid tabs in perfect detail but forgot completed orders the moment payment was made. Incomplete tasks create persistent mental 'loops' that actively demand resolution.",
    researchFact_id: "Psikolog Soviet Bluma Zeigarnik (1927) menemukan bahwa pelayan mengingat tagihan yang belum dibayar dengan sempurna, namun langsung melupakan pesanan begitu pembayaran selesai. Tugas yang belum tuntas menciptakan 'loop' mental yang terus meminta penyelesaian.",
  },
  {
    name: "Suggestibility",
    name_id: "Sugestibilitas",
    category: "memory",
    crossCulturalNote: "A leader may unconsciously alter their memory of a meeting to match later 'cultural insights' from a consultant, skewing future strategy.",
    crossCulturalNote_id: "Seorang pemimpin mungkin secara tidak sadar mengubah ingatan mereka tentang suatu pertemuan agar sesuai dengan 'wawasan budaya' kemudian dari seorang konsultan, menyimpangkan strategi masa depan.",
    researchFact: "Elizabeth Loftus's 'Lost in the Mall' study (1995): 25% of participants came to believe a fabricated childhood memory of being lost in a mall — simply because a family member 'confirmed' the false event in a written prompt. Memory is reconstructed, not recorded.",
    researchFact_id: "Studi 'Lost in the Mall' Elizabeth Loftus (1995): 25% peserta meyakini kenangan palsu masa kecil tentang tersesat di mal — hanya karena anggota keluarga 'mengkonfirmasi' kejadian fiktif itu dalam sebuah prompt tertulis. Memori direkonstruksi, bukan direkam.",
  },
  {
    name: "False Memory",
    name_id: "Memori Palsu",
    category: "memory",
    crossCulturalNote: "A leader might 'remember' a local partner agreeing to terms that were never explicitly stated, creating trust-breaking moments when expectations aren't met.",
    crossCulturalNote_id: "Seorang pemimpin mungkin 'mengingat' mitra lokal menyetujui syarat-syarat yang tidak pernah dinyatakan secara eksplisit, menciptakan momen penghancur kepercayaan ketika ekspektasi tidak terpenuhi.",
    researchFact: "The DRM paradigm (Deese 1959; Roediger & McDermott 1995): When shown lists of related words, people consistently 'remember' a central word that was never presented. The brain actively constructs memories — not just retrieves them — which means every recall is a potential recreation.",
    researchFact_id: "Paradigma DRM (Deese 1959; Roediger & McDermott 1995): Ketika melihat daftar kata terkait, orang secara konsisten 'mengingat' kata inti yang tidak pernah ditampilkan. Otak secara aktif mengonstruksi memori — bukan sekadar mengambilnya — artinya setiap penggalian ingatan adalah potensi rekonstruksi.",
  },
  {
    name: "Cryptomnesia",
    name_id: "Kriptomnesia",
    category: "memory",
    crossCulturalNote: "A leader may unknowingly present a local employee's culturally-specific idea as their own, damaging morale and local ownership.",
    crossCulturalNote_id: "Seorang pemimpin mungkin tanpa sadar mempresentasikan ide spesifik budaya karyawan lokal sebagai miliknya sendiri, merusak moral dan rasa kepemilikan lokal.",
    researchFact: "George Harrison was sued for his 1970 hit 'My Sweet Lord.' He had unconsciously reproduced the 1963 Chiffons song 'He's So Fine.' The court ruled it 'unconscious plagiarism' — the first major legal case of cryptomnesia in music history.",
    researchFact_id: "George Harrison dituntut atas hitsnya tahun 1970 'My Sweet Lord.' Ia tanpa sadar mereproduksi lagu The Chiffons tahun 1963 'He's So Fine.' Pengadilan menyebutnya 'plagiarisme bawah sadar' — kasus hukum kriptomnesia pertama yang terkenal dalam sejarah musik.",
  },
  // Social
  {
    name: "Fundamental Attribution Error",
    name_id: "Kesalahan Atribusi Fundamental",
    category: "social",
    crossCulturalNote: "Leaders blame a local employee's character for a missed deadline rather than considering situational factors like local infrastructure or public holidays.",
    crossCulturalNote_id: "Pemimpin menyalahkan karakter karyawan lokal atas tenggat waktu yang terlewat daripada mempertimbangkan faktor situasional seperti infrastruktur lokal atau hari libur.",
    researchFact: "Jones & Harris (1967): Even when students were told essay writers were randomly assigned a pro-Castro or anti-Castro position, readers still rated the essays as reflecting the writers' genuine beliefs. We can't help reading intention into behavior.",
    researchFact_id: "Jones & Harris (1967): Meski mahasiswa diberitahu bahwa penulis esai ditugaskan secara acak untuk membela atau menentang Castro, pembaca tetap menilai esai mencerminkan keyakinan asli penulisnya. Kita tidak bisa tidak membaca niat di balik perilaku.",
  },
  {
    name: "Self-Serving Bias",
    name_id: "Bias Melayani Diri Sendiri",
    category: "social",
    crossCulturalNote: "Leaders credit their own 'global mindset' for project success while blaming 'local cultural resistance' for failure.",
    crossCulturalNote_id: "Pemimpin mengaitkan 'pola pikir global' mereka sendiri dengan keberhasilan proyek sambil menyalahkan 'resistensi budaya lokal' atas kegagalan.",
    researchFact: "Cultural variation is significant: studies comparing US and Japanese students found Americans attributed success to personal effort and failure to external factors. Japanese students showed the reverse pattern — attributing failure to insufficient personal effort. The bias itself is culturally shaped.",
    researchFact_id: "Variasi budaya sangat signifikan: studi membandingkan mahasiswa AS dan Jepang menemukan orang Amerika mengatribusikan keberhasilan pada usaha pribadi dan kegagalan pada faktor eksternal. Mahasiswa Jepang menunjukkan pola sebaliknya — mengatribusikan kegagalan pada kurangnya usaha pribadi.",
  },
  {
    name: "In-Group Favoritism",
    name_id: "Favoritisme Dalam Kelompok",
    category: "social",
    crossCulturalNote: "Leaders unintentionally offer better assignments or mentoring to expats from their home country rather than to equally capable local talent.",
    crossCulturalNote_id: "Pemimpin tanpa sengaja menawarkan penugasan atau bimbingan yang lebih baik kepada ekspatriat dari negara asal mereka daripada kepada talenta lokal yang sama mampunya.",
    researchFact: "Tajfel's 'minimal group' experiments (1971): People allocated more resources to in-group members even when groups were assigned by coin flip and members were completely anonymous. Favouritism emerged within minutes — suggesting it's one of the most automatic biases in human psychology.",
    researchFact_id: "Eksperimen 'minimal group' Tajfel (1971): Orang mengalokasikan lebih banyak sumber daya kepada anggota kelompok dalam yang ditentukan secara acak, bahkan ketika anggotanya sepenuhnya anonim. Favoritisme muncul dalam hitungan menit — menunjukkan ini adalah salah satu bias paling otomatis dalam psikologi manusia.",
  },
  {
    name: "Halo Effect",
    name_id: "Efek Halo",
    category: "social",
    crossCulturalNote: "If a local manager speaks the leader's language fluently, the leader incorrectly assumes equal competence in all other areas.",
    crossCulturalNote_id: "Jika seorang manajer lokal berbicara bahasa pemimpin dengan lancar, pemimpin secara keliru berasumsi memiliki kompetensi yang sama di semua bidang lain.",
    researchFact: "Edward Thorndike coined the term (1920) after studying officer ratings of soldiers. Physical attractiveness research confirms: in hiring simulations, attractive candidates receive significantly higher ratings on unrelated qualities — intelligence, integrity, and leadership potential — regardless of actual credentials.",
    researchFact_id: "Edward Thorndike mencetuskan istilah ini (1920) setelah mempelajari penilaian perwira terhadap tentara. Penelitian daya tarik fisik mengkonfirmasi: dalam simulasi perekrutan, kandidat yang menarik mendapat nilai lebih tinggi pada kualitas yang tidak berkaitan — kecerdasan, integritas, dan potensi kepemimpinan — terlepas dari kredensial aktual.",
  },
  {
    name: "Moral Luck",
    name_id: "Keberuntungan Moral",
    category: "social",
    crossCulturalNote: "A leader judges a local manager's character based on outcomes shaped by local market volatility or political instability outside that manager's control.",
    crossCulturalNote_id: "Seorang pemimpin menilai karakter manajer lokal berdasarkan hasil yang dibentuk oleh volatilitas pasar lokal atau ketidakstabilan politik di luar kendali manajer tersebut.",
    researchFact: "Philosophers Nagel & Williams introduced the concept (1976). Empirically: two drivers run a red light identically. One hits a child; the other doesn't. Observers consistently judge the first driver's character far more harshly — despite the behavior being identical. Outcomes corrupt our moral judgment of intent.",
    researchFact_id: "Filsuf Nagel & Williams memperkenalkan konsep ini (1976). Secara empiris: dua pengemudi menerobos lampu merah dengan cara yang sama. Satu menabrak anak kecil; yang lain tidak. Pengamat secara konsisten menilai karakter pengemudi pertama jauh lebih buruk — meski perilaku keduanya identik. Hasil mencemari penilaian moral kita tentang niat.",
  },
  {
    name: "False Consensus",
    name_id: "Konsensus Palsu",
    category: "social",
    crossCulturalNote: "Leaders assume their 'universal' management style is desired everywhere, failing to recognise that local teams may prefer fundamentally different leadership behaviour.",
    crossCulturalNote_id: "Pemimpin berasumsi bahwa gaya manajemen 'universal' mereka diinginkan di mana-mana, gagal menyadari bahwa tim lokal mungkin lebih menyukai perilaku kepemimpinan yang secara fundamental berbeda.",
    researchFact: "Ross, Greene & House (1977): Students asked to walk campus wearing a sandwich board. Those who agreed estimated 62% of others would also agree; those who refused estimated only 33% would. We use our own choices as the default baseline for what's 'normal' — and that baseline is invisible to us.",
    researchFact_id: "Ross, Greene & House (1977): Mahasiswa diminta membawa papan sandwich keliling kampus. Yang setuju memperkirakan 62% orang lain akan setuju; yang menolak memperkirakan hanya 33%. Kita menggunakan pilihan kita sendiri sebagai tolok ukur default untuk apa yang 'normal' — dan tolok ukur itu tidak terlihat bagi kita.",
  },
  {
    name: "Spotlight Effect",
    name_id: "Efek Sorotan",
    category: "social",
    crossCulturalNote: "Expat leaders overthink their cultural gaffes, believing the local team is constantly judging them — creating unnecessary anxiety and social distance.",
    crossCulturalNote_id: "Pemimpin ekspatriat terlalu memikirkan kesalahan budaya mereka, percaya tim lokal terus-menerus menilai mereka — menciptakan kecemasan yang tidak perlu dan jarak sosial.",
    researchFact: "Gilovich & Savitsky (1999): Cornell students wearing embarrassing T-shirts estimated 46% of passersby noticed them. Reality: 23%. The spotlight we feel on ourselves is almost exactly twice as bright as it actually is — people are simply too absorbed in their own concerns to notice ours.",
    researchFact_id: "Gilovich & Savitsky (1999): Mahasiswa Cornell yang mengenakan kaus memalukan memperkirakan 46% orang yang lewat memperhatikan mereka. Kenyataan: 23%. Sorotan yang kita rasakan hampir dua kali lebih terang dari kenyataan — orang terlalu sibuk dengan urusan mereka sendiri untuk memperhatikan kita.",
  },
  {
    name: "Defensive Attribution",
    name_id: "Atribusi Defensif",
    category: "social",
    crossCulturalNote: "When accidents occur in a foreign branch, leaders may blame local teams more harshly because they feel less similar to them.",
    crossCulturalNote_id: "Ketika kecelakaan terjadi di cabang asing, pemimpin mungkin menyalahkan tim lokal lebih keras karena mereka merasa kurang serupa dengan mereka.",
    researchFact: "Shaver (1970): The more similar observers felt to a victim, the more they blamed external circumstances rather than the victim's character. When observers felt dissimilar, blame shifted to the victim — a self-protective mechanism that distorts accountability across cultural lines.",
    researchFact_id: "Shaver (1970): Semakin mirip pengamat dengan korban, semakin mereka menyalahkan keadaan eksternal. Ketika pengamat merasa tidak mirip, kesalahan dialihkan ke korban — mekanisme perlindungan diri yang mendistorsi akuntabilitas melintasi batas budaya.",
  },
  {
    name: "Just-World Hypothesis",
    name_id: "Hipotesis Dunia Adil",
    category: "social",
    crossCulturalNote: "Leaders assume a struggling local office simply isn't working hard enough, ignoring systemic inequalities or historical disadvantages in that region.",
    crossCulturalNote_id: "Pemimpin berasumsi bahwa kantor lokal yang berjuang memang tidak bekerja cukup keras, mengabaikan ketidaksetaraan sistemik atau kerugian historis di kawasan tersebut.",
    researchFact: "Melvin Lerner (1965): Subjects who watched a 'victim' receive electric shocks — and couldn't stop it — began devaluing the victim's character. Maintaining belief in a just world required making the victim deserve their fate. The need for justice can paradoxically produce victim-blaming.",
    researchFact_id: "Melvin Lerner (1965): Subjek yang menyaksikan 'korban' menerima sengatan listrik — tanpa bisa mencegahnya — mulai merendahkan karakter korban. Mempertahankan keyakinan akan dunia yang adil mengharuskan mereka membuat korban 'layak' mendapat nasib buruk itu. Kebutuhan akan keadilan justru bisa menghasilkan victim-blaming.",
  },
  {
    name: "Naïve Realism",
    name_id: "Realisme Naif",
    category: "social",
    crossCulturalNote: "Leaders believe their business perspective is objective and that local dissent reflects bias — not a legitimately different, equally valid view.",
    crossCulturalNote_id: "Pemimpin percaya perspektif bisnis mereka objektif dan bahwa ketidaksetujuan lokal mencerminkan bias — bukan pandangan yang legitimately berbeda dan sama-sama valid.",
    researchFact: "Lee Ross & Richard Ward (1996): Both Israeli and Palestinian students watching the same news clip rated the coverage as biased against their own side. Each group believed they were seeing objectively — and that the other side's perception was distorted by ideology.",
    researchFact_id: "Lee Ross & Richard Ward (1996): Mahasiswa Israel dan Palestina yang menonton klip berita yang sama sama-sama menilai liputannya bias terhadap pihak mereka. Setiap kelompok percaya mereka melihat secara objektif — dan persepsi pihak lain didistorsi oleh ideologi.",
  },
  {
    name: "Naïve Cynicism",
    name_id: "Sinisme Naif",
    category: "social",
    crossCulturalNote: "Leaders dismiss a local partner's emphasis on relationship-building as self-interest, missing the deep cultural value of concepts like guanxi or wasta.",
    crossCulturalNote_id: "Pemimpin mengabaikan penekanan mitra lokal pada pembangunan hubungan sebagai kepentingan diri sendiri, melewatkan nilai budaya mendalam dari konsep seperti guanxi atau wasta.",
    researchFact: "Kruger & Gilovich (1999): People consistently predicted others would act more selfishly than they actually did. We underestimate the genuine goodwill of those around us — especially across cultural, political, or social divides where we have less direct evidence of intent.",
    researchFact_id: "Kruger & Gilovich (1999): Orang secara konsisten memprediksi orang lain akan bertindak lebih egois dari kenyataannya. Kita meremehkan niat baik sesungguhnya dari orang di sekitar kita — terutama melintasi batas budaya, politik, atau sosial di mana kita memiliki lebih sedikit bukti langsung tentang niat.",
  },
  {
    name: "Dunning-Kruger Effect",
    name_id: "Efek Dunning-Kruger",
    category: "social",
    crossCulturalNote: "After one trip to a new country, a leader believes they are now a cultural expert — leading to overconfident and often costly decisions.",
    crossCulturalNote_id: "Setelah satu kali kunjungan ke negara baru, seorang pemimpin percaya dirinya kini ahli budaya — yang mengarah pada keputusan yang terlalu percaya diri dan seringkali mahal.",
    researchFact: "Kruger & Dunning (1999): Students scoring in the bottom quartile on logic tests estimated they scored in the 62nd percentile. The key finding: incompetence prevents the metacognitive awareness needed to recognize incompetence. You can't know what you don't know.",
    researchFact_id: "Kruger & Dunning (1999): Mahasiswa yang skor logikanya di kuartil terbawah memperkirakan diri mereka berada di persentil ke-62. Temuan kunci: ketidakmampuan mencegah kesadaran metakognitif yang diperlukan untuk mengenali ketidakmampuan itu sendiri. Anda tidak bisa mengetahui apa yang tidak Anda ketahui.",
  },
  {
    name: "Third-Person Effect",
    name_id: "Efek Orang Ketiga",
    category: "social",
    crossCulturalNote: "Leaders believe their local teams are susceptible to cultural bias while remaining convinced they themselves are immune.",
    crossCulturalNote_id: "Pemimpin percaya bahwa tim lokal mereka rentan terhadap bias budaya sementara tetap yakin bahwa mereka sendiri kebal.",
    researchFact: "Davison (1983): People consistently estimated that media messages had greater influence on others than on themselves — especially for content they found objectionable. The effect is stronger for messages perceived as propaganda: 'It affects them; I can see through it.'",
    researchFact_id: "Davison (1983): Orang secara konsisten memperkirakan pesan media lebih mempengaruhi orang lain daripada diri mereka — terutama untuk konten yang mereka anggap keberatan. Efeknya lebih kuat untuk pesan yang dipersepsikan sebagai propaganda: 'Itu mempengaruhi mereka; saya bisa melihat tembus.'",
  },
  {
    name: "Stereotyping",
    name_id: "Stereotip",
    category: "social",
    crossCulturalNote: "Leaders expect a local employee to behave like a cultural archetype, missing the individual's unique strengths and personality.",
    crossCulturalNote_id: "Pemimpin mengharapkan karyawan lokal berperilaku seperti arketipe budaya, melewatkan kekuatan dan kepribadian unik individu tersebut.",
    researchFact: "The IAT (Implicit Association Test, Banaji & Greenwald 1998): Even people who explicitly reject racial or gender stereotypes show measurable implicit associations — often within 200–400 milliseconds. Awareness of a bias does not equal immunity from it.",
    researchFact_id: "IAT (Tes Asosiasi Implisit, Banaji & Greenwald 1998): Bahkan orang yang secara eksplisit menolak stereotip rasial atau gender menunjukkan asosiasi implisit yang terukur — sering dalam 200–400 milidetik. Kesadaran tentang bias tidak berarti kekebalan darinya.",
  },
  {
    name: "Outgroup Homogeneity Bias",
    name_id: "Bias Homogenitas Luar Kelompok",
    category: "social",
    crossCulturalNote: "Leaders treat 'the Asian team' as a monolithic group, ignoring the vast cultural differences between nationalities, subcultures, and generations.",
    crossCulturalNote_id: "Pemimpin memperlakukan 'tim Asia' sebagai kelompok monolitik, mengabaikan perbedaan budaya yang sangat besar antara kebangsaan, subkultur, dan generasi.",
    researchFact: "Linville et al. (1989): People use more descriptive dimensions when characterising in-group members than out-group members. In facial recognition studies, cross-race identification accuracy is measurably lower — not because of malice, but because we process unfamiliar faces with less cognitive depth.",
    researchFact_id: "Linville dkk. (1989): Orang menggunakan lebih banyak dimensi deskriptif untuk mengkarakterisasi anggota kelompok dalam dibanding kelompok luar. Dalam studi pengenalan wajah, akurasi identifikasi lintas ras secara terukur lebih rendah — bukan karena kebencian, tapi karena kita memproses wajah yang tidak familiar dengan kedalaman kognitif yang lebih rendah.",
  },
  {
    name: "Ben Franklin Effect",
    name_id: "Efek Ben Franklin",
    category: "social",
    crossCulturalNote: "Asking a local peer for a small favour can increase their investment in the partnership — a useful tool for building cross-cultural trust.",
    crossCulturalNote_id: "Meminta rekan lokal untuk melakukan bantuan kecil dapat meningkatkan investasi mereka dalam kemitraan — alat yang berguna untuk membangun kepercayaan lintas budaya.",
    researchFact: "Franklin wrote in his autobiography (1771): 'He that has once done you a kindness will be more ready to do you another.' Jecker & Landy (1969) confirmed it experimentally: asking someone for a favour increases how much they like you — the brain resolves the dissonance by deciding you must be worth helping.",
    researchFact_id: "Franklin menulis dalam otobiografinya (1771): 'Orang yang pernah berbuat baik padamu akan lebih mudah berbuat baik lagi.' Jecker & Landy (1969) mengkonfirmasi secara eksperimental: meminta seseorang bantuan meningkatkan rasa suka mereka kepada Anda — otak menyelesaikan disonansi dengan memutuskan Anda layak untuk dibantu.",
  },
  {
    name: "Bystander Effect",
    name_id: "Efek Penonton",
    category: "social",
    crossCulturalNote: "In a multicultural HQ, leaders fail to address subtle discrimination, assuming someone in the Diversity department will handle it.",
    crossCulturalNote_id: "Di kantor pusat multikultural, pemimpin gagal menangani diskriminasi halus, berasumsi bahwa seseorang di departemen Keberagaman akan menanganinya.",
    researchFact: "Darley & Latané (1968): 85% of people helped in a staged emergency when alone — but only 31% helped when in a group of five. The more witnesses, the less any individual feels responsible. This diffusion of responsibility operates even when the need is obvious.",
    researchFact_id: "Darley & Latané (1968): 85% orang membantu dalam keadaan darurat yang direkayasa saat sendirian — tetapi hanya 31% membantu ketika dalam kelompok lima orang. Semakin banyak saksi, semakin sedikit individu yang merasa bertanggung jawab. Difusi tanggung jawab ini beroperasi bahkan ketika kebutuhannya jelas.",
  },
  {
    name: "Blind Spot Bias",
    name_id: "Bias Titik Buta",
    category: "social",
    crossCulturalNote: "Leaders readily identify cultural biases in their local staff while remaining blind to their own ethnocentrism.",
    crossCulturalNote_id: "Pemimpin dengan mudah mengidentifikasi bias budaya pada staf lokal mereka sambil tetap buta terhadap etnosentrisme mereka sendiri.",
    researchFact: "Pronin, Lin & Ross (2002): After seeing a list of common biases, subjects rated themselves as significantly less biased than 'the average person.' Even when told about a specific bias they had just demonstrated, they denied it applied to them personally — a bias about bias.",
    researchFact_id: "Pronin, Lin & Ross (2002): Setelah melihat daftar bias umum, subjek menilai diri mereka jauh lebih tidak bias dibanding 'rata-rata orang.' Bahkan ketika diberitahu tentang bias spesifik yang baru saja mereka tunjukkan, mereka menyangkal itu berlaku untuk mereka pribadi — bias tentang bias.",
  },
  // Learning
  {
    name: "Curse of Knowledge",
    name_id: "Kutukan Pengetahuan",
    category: "learning",
    crossCulturalNote: "HQ experts can't explain processes clearly to local teams because they've forgotten what it's like not to have 10 years of institutional context.",
    crossCulturalNote_id: "Para ahli kantor pusat tidak dapat menjelaskan proses dengan jelas kepada tim lokal karena mereka telah melupakan bagaimana rasanya tidak memiliki 10 tahun konteks kelembagaan.",
    researchFact: "Elizabeth Newton's 1990 Stanford study: 'Tappers' tapped famous songs on a table and estimated 50% of listeners would correctly guess the song. Reality: 2.5%. Once you know a melody, you can't unhear it in your own tapping — making you radically overestimate how much information you're transmitting.",
    researchFact_id: "Studi Stanford Elizabeth Newton (1990): 'Pengetuk' mengetuk lagu terkenal di meja dan memperkirakan 50% pendengar akan menebak dengan benar. Kenyataan: 2,5%. Begitu Anda tahu sebuah melodi, Anda tidak bisa tidak mendengarnya saat mengetuk — sehingga Anda sangat melebih-lebihkan berapa banyak informasi yang Anda sampaikan.",
  },
  {
    name: "Anchoring",
    name_id: "Penjangkaran",
    category: "learning",
    crossCulturalNote: "A leader fixates on the first cost estimate from a local vendor, failing to recalibrate even as more reliable market data becomes available.",
    crossCulturalNote_id: "Seorang pemimpin terpaku pada perkiraan biaya pertama dari vendor lokal, gagal untuk mengkalibrasi ulang meskipun data pasar yang lebih andal tersedia.",
    researchFact: "Kahneman & Tversky (1974): A spinning wheel rigged to land on 10 or 65 influenced estimates of completely unrelated questions ('What percentage of African countries are in the UN?'). High anchor group guessed 45%; low anchor group guessed 25%. Irrelevant first numbers shape real subsequent decisions.",
    researchFact_id: "Kahneman & Tversky (1974): Roda yang direkayasa berhenti di 10 atau 65 mempengaruhi perkiraan untuk pertanyaan yang tidak berkaitan ('Berapa persen negara Afrika ada di PBB?'). Kelompok jangkar tinggi menebak 45%; kelompok jangkar rendah menebak 25%. Angka pertama yang tidak relevan membentuk keputusan nyata selanjutnya.",
  },
  {
    name: "Declinism",
    name_id: "Dekilinisme",
    category: "learning",
    crossCulturalNote: "Leaders compare every foreign market to a nostalgic 'golden era' of expansion, failing to see fresh opportunities in the current landscape.",
    crossCulturalNote_id: "Pemimpin membandingkan setiap pasar asing dengan 'era emas' ekspansi yang nostalgis, gagal melihat peluang segar dalam lanskap saat ini.",
    researchFact: "Consistent polling across decades shows majorities believe 'things are getting worse' even during periods of measurable improvement. Roy Baumeister demonstrated that bad events register more strongly and persist longer in memory than equivalent good events — negativity bias actively feeds declinism.",
    researchFact_id: "Polling konsisten selama beberapa dekade menunjukkan mayoritas percaya 'hal-hal semakin memburuk' bahkan selama periode kemajuan yang terukur. Roy Baumeister membuktikan bahwa peristiwa buruk terdaftar lebih kuat dan bertahan lebih lama dalam memori dibanding peristiwa baik yang setara — bias negatif secara aktif memberi makan deklinisme.",
  },
  {
    name: "Status Quo Bias",
    name_id: "Bias Status Quo",
    category: "learning",
    crossCulturalNote: "Leaders resist adapting proven home-country strategies to local needs, preferring the familiar over the effective.",
    crossCulturalNote_id: "Pemimpin menolak mengadaptasi strategi negara asal yang terbukti untuk kebutuhan lokal, lebih memilih yang familiar daripada yang efektif.",
    researchFact: "Samuelson & Zeckhauser (1988): Harvard students given a portfolio as their 'inherited default' chose to keep it significantly more than those offered identical portfolios from scratch. The current state becomes the psychological reference point — not the best available option.",
    researchFact_id: "Samuelson & Zeckhauser (1988): Mahasiswa Harvard yang mendapat portofolio sebagai 'warisan default' jauh lebih memilih mempertahankannya dibanding mereka yang ditawari portofolio identik dari awal. Kondisi saat ini menjadi titik referensi psikologis — bukan pilihan terbaik yang tersedia.",
  },
  {
    name: "Framing Effect",
    name_id: "Efek Pembingkaian",
    category: "learning",
    crossCulturalNote: "A local team's response to the same proposal shifts entirely based on whether it's framed as a gain or a loss — cultural context amplifies this further.",
    crossCulturalNote_id: "Respons tim lokal terhadap proposal yang sama berubah sepenuhnya berdasarkan apakah proposal tersebut dibingkai sebagai keuntungan atau kerugian — konteks budaya memperkuat hal ini lebih jauh.",
    researchFact: "Kahneman & Tversky's 'Asian Disease' problem (1981): Identical outcomes described as '200 people saved' vs. '400 people will die' produced opposite choices in 78% of subjects. The frame — not the underlying fact — determined the decision. Loss frames reliably trigger risk-seeking; gain frames trigger risk-aversion.",
    researchFact_id: "Masalah 'Penyakit Asia' Kahneman & Tversky (1981): Hasil identik yang digambarkan sebagai '200 orang diselamatkan' vs. '400 orang akan mati' menghasilkan pilihan berlawanan pada 78% subjek. Bingkai — bukan fakta yang mendasarinya — yang menentukan keputusan. Bingkai kerugian secara konsisten memicu pengambilan risiko; bingkai keuntungan memicu penghindaran risiko.",
  },
  {
    name: "Survivorship Bias",
    name_id: "Bias Kelangsungan Hidup",
    category: "learning",
    crossCulturalNote: "Leaders study only the few successful multinational entries in a region, missing the majority of failures that would teach them what not to do.",
    crossCulturalNote_id: "Pemimpin hanya mempelajari sedikit entri multinasional yang berhasil di suatu kawasan, melewatkan mayoritas kegagalan yang akan mengajarkan mereka apa yang tidak harus dilakukan.",
    researchFact: "Abraham Wald (WWII statistician): Military analysts wanted to reinforce the parts of returning aircraft showing bullet holes. Wald's insight: reinforce where there are NO holes — those planes never returned. The data you can see is systematically skewed by what didn't survive to be counted.",
    researchFact_id: "Abraham Wald (ahli statistik PD II): Analis militer ingin memperkuat bagian pesawat yang kembali dengan bekas peluru. Wawasan Wald: perkuat di mana tidak ada lubang — pesawat itu tidak pernah kembali. Data yang dapat Anda lihat secara sistematis miring oleh apa yang tidak selamat untuk dihitung.",
  },
  {
    name: "Clustering Illusion",
    name_id: "Ilusi Pengelompokan",
    category: "learning",
    crossCulturalNote: "Two or three coincidental sales in a new market get interpreted as a trend, prompting premature and costly scaling.",
    crossCulturalNote_id: "Dua atau tiga penjualan kebetulan di pasar baru ditafsirkan sebagai tren, mendorong penskalaan yang prematur dan mahal.",
    researchFact: "Gilovich, Vallone & Tversky (1985): Rigorous statistical analysis of NBA shooting data found no evidence of the 'hot hand' — runs of makes and misses follow chance patterns. Our brains are wired to find patterns in randomness, especially in sequences. Signal detection requires deliberate statistical discipline.",
    researchFact_id: "Gilovich, Vallone & Tversky (1985): Analisis statistis ketat data pemotretan NBA tidak menemukan bukti 'tangan panas' — rangkaian makes dan misses mengikuti pola kebetulan. Otak kita terprogram untuk menemukan pola dalam keacakan, terutama dalam urutan. Deteksi sinyal memerlukan disiplin statistis yang disengaja.",
  },
  {
    name: "Pessimism Bias",
    name_id: "Bias Pesimisme",
    category: "learning",
    crossCulturalNote: "Leaders overestimate political or economic instability in developing markets, causing the company to miss early-mover advantages.",
    crossCulturalNote_id: "Pemimpin melebih-lebihkan ketidakstabilan politik atau ekonomi di pasar berkembang, menyebabkan perusahaan melewatkan keuntungan penggerak awal.",
    researchFact: "Research finds higher rates of pessimism bias in older adults, those with depression, and some Northern European cultures. Interestingly, mild pessimism can correlate with more accurate forecasting — and depressed individuals often show more realistic self-assessment (the 'depressive realism' effect).",
    researchFact_id: "Penelitian menemukan tingkat bias pesimisme lebih tinggi pada orang dewasa yang lebih tua, penderita depresi, dan beberapa budaya Eropa Utara. Menariknya, pesimisme ringan dapat berkorelasi dengan perkiraan yang lebih akurat — dan individu yang depresi sering menunjukkan penilaian diri yang lebih realistis (efek 'realisme depresif').",
  },
  {
    name: "Optimism Bias",
    name_id: "Bias Optimisme",
    category: "learning",
    crossCulturalNote: "Leaders underestimate the time needed to navigate local bureaucracies, leading to missed deadlines and significant budget overruns.",
    crossCulturalNote_id: "Pemimpin meremehkan waktu yang diperlukan untuk menavigasi birokrasi lokal, yang mengarah pada tenggat waktu yang terlewat dan pembengkakan anggaran yang signifikan.",
    researchFact: "Tali Sharot (2011): fMRI research shows the brain updates beliefs more strongly in response to good news than bad — a measurable neurological asymmetry. Estimated to affect around 80% of people. It fuels motivation and resilience but causes systematic underestimation of risks and timelines.",
    researchFact_id: "Tali Sharot (2011): Penelitian fMRI menunjukkan otak memperbarui keyakinan lebih kuat sebagai respons terhadap berita baik dibanding berita buruk — asimetri neurologis yang terukur. Diperkirakan mempengaruhi sekitar 80% orang. Ini mendorong motivasi namun menyebabkan perkiraan risiko dan jadwal yang sistematis terlalu rendah.",
  },
  // Belief
  {
    name: "Bandwagon Effect",
    name_id: "Efek Ikut-ikutan",
    category: "belief",
    crossCulturalNote: "A leader enters a popular 'emerging market' because competitors are doing so — without a real strategic fit for their specific mission or organisation.",
    crossCulturalNote_id: "Seorang pemimpin memasuki 'pasar berkembang' yang populer karena pesaing melakukannya — tanpa kesesuaian strategis yang nyata untuk misi atau organisasi spesifik mereka.",
    researchFact: "Solomon Asch (1951): 75% of subjects gave at least one wrong answer about line length when five confederates unanimously gave the wrong answer. Conformity emerged even when subjects privately doubted the group. Social proof overrides private judgment — even when private judgment is clearly correct.",
    researchFact_id: "Solomon Asch (1951): 75% subjek memberikan setidaknya satu jawaban salah tentang panjang garis ketika lima konfederat secara seragam memberikan jawaban salah. Konformitas muncul bahkan ketika subjek secara pribadi meragukan kelompok. Bukti sosial mengesampingkan penilaian pribadi — bahkan ketika penilaian pribadi jelas benar.",
  },
  {
    name: "Automation Bias",
    name_id: "Bias Otomasi",
    category: "belief",
    crossCulturalNote: "Over-reliance on standardised HR software causes leaders to miss high-potential local candidates who don't fit a Western-built algorithm of success.",
    crossCulturalNote_id: "Ketergantungan berlebihan pada perangkat lunak HR yang terstandarisasi menyebabkan pemimpin melewatkan kandidat lokal berpotensi tinggi yang tidak sesuai dengan algoritma keberhasilan yang dibangun oleh Barat.",
    researchFact: "Mosier & Skitka (1996): Pilots followed incorrect automated guidance even when their own instruments and training contradicted it. Errors made by automated systems go undetected significantly longer than equivalent human errors — because we extend unearned trust to machines.",
    researchFact_id: "Mosier & Skitka (1996): Pilot mengikuti panduan otomatis yang salah bahkan ketika instrumen mereka sendiri dan pelatihan mereka bertentangan. Kesalahan oleh sistem otomatis tidak terdeteksi jauh lebih lama dibanding kesalahan manusia yang setara — karena kita memberikan kepercayaan berlebihan kepada mesin.",
  },
  {
    name: "Reactance",
    name_id: "Reaktansi",
    category: "belief",
    crossCulturalNote: "If HQ rules are imposed too aggressively, local employees feel their autonomy is threatened and may intentionally undermine the new policies.",
    crossCulturalNote_id: "Jika aturan kantor pusat diberlakukan terlalu agresif, karyawan lokal merasa otonomi mereka terancam dan mungkin dengan sengaja merusak kebijakan baru.",
    researchFact: "Jack Brehm (1966): The harder a rule is pushed, the stronger the resistance. US Prohibition (1920–33) paradoxically intensified drinking culture: speakeasies multiplied, organised crime flourished, and public sympathy shifted toward drinkers. Restriction activated the forbidden fruit effect.",
    researchFact_id: "Jack Brehm (1966): Semakin keras aturan dipaksakan, semakin kuat resistensinya. Larangan Keras AS (1920–33) paradoks memperintensif budaya minum: tempat minum rahasia berkembang biak, kejahatan terorganisir berkembang, dan simpati publik beralih ke peminum. Pembatasan mengaktifkan efek buah terlarang.",
  },
  {
    name: "Confirmation Bias",
    name_id: "Bias Konfirmasi",
    category: "belief",
    crossCulturalNote: "Leaders notice only information that supports existing cultural stereotypes while filtering out evidence that would challenge them.",
    crossCulturalNote_id: "Pemimpin hanya memperhatikan informasi yang mendukung stereotip budaya yang ada sambil menyaring bukti yang akan menantang mereka.",
    researchFact: "Wason's Selection Task (1966): Given the rule 'if a card has a vowel on one side, it has an even number on the other,' only 10% of people select the cards that could actually disprove the rule. We instinctively look for confirmation. Falsification requires trained, deliberate effort.",
    researchFact_id: "Tugas Seleksi Wason (1966): Diberikan aturan 'jika kartu memiliki vokal di satu sisi, maka memiliki angka genap di sisi lain,' hanya 10% orang memilih kartu yang bisa benar-benar menyangkal aturan tersebut. Kita secara naluriah mencari konfirmasi. Penyangkalan memerlukan upaya terlatih yang disengaja.",
  },
  {
    name: "Backfire Effect",
    name_id: "Efek Bumerang",
    category: "belief",
    crossCulturalNote: "When a leader presents data to disprove a local team's long-held business practice, it can actually strengthen their resolve to keep doing it.",
    crossCulturalNote_id: "Ketika seorang pemimpin menyajikan data untuk membantah praktik bisnis tim lokal yang sudah lama dipegang, hal itu sebenarnya dapat memperkuat tekad mereka untuk terus melakukannya.",
    researchFact: "Nyhan & Reifler (2010) found that correcting political misinformation sometimes strengthened false beliefs. Later meta-analyses (Wood & Porter 2019) found the effect less universal than first claimed — but it remains real in high-identity domains where belief and self-concept are tightly fused.",
    researchFact_id: "Nyhan & Reifler (2010) menemukan bahwa koreksi misinformasi politik kadang memperkuat keyakinan palsu. Meta-analisis kemudian (Wood & Porter 2019) menemukan efeknya kurang universal dari yang pertama kali diklaim — tetapi tetap nyata dalam domain beridentitas tinggi di mana keyakinan dan konsep diri sangat menyatu.",
  },
  {
    name: "Belief Bias",
    name_id: "Bias Keyakinan",
    category: "belief",
    crossCulturalNote: "Leaders accept a weak business case from a local partner simply because the final conclusion aligns with their own cultural assumptions.",
    crossCulturalNote_id: "Pemimpin menerima kasus bisnis yang lemah dari mitra lokal hanya karena kesimpulan akhirnya selaras dengan asumsi budaya mereka sendiri.",
    researchFact: "Evans, Barston & Pollard (1983): 71% of subjects accepted logically invalid arguments when the conclusion seemed believable. We don't evaluate arguments by their structure — we evaluate whether the conclusion matches our existing beliefs, then work backward to find justifications.",
    researchFact_id: "Evans, Barston & Pollard (1983): 71% subjek menerima argumen yang tidak valid secara logis ketika kesimpulannya tampak masuk akal. Kita tidak mengevaluasi argumen berdasarkan strukturnya — kita mengevaluasi apakah kesimpulannya cocok dengan keyakinan yang ada, lalu bekerja mundur untuk mencari pembenaran.",
  },
  {
    name: "Authority Bias",
    name_id: "Bias Otoritas",
    category: "belief",
    crossCulturalNote: "In high-power-distance cultures, a leader receives only agreement — honest, necessary dissent is withheld from anyone holding a senior title.",
    crossCulturalNote_id: "Dalam budaya jarak kekuasaan tinggi, seorang pemimpin hanya menerima persetujuan — ketidaksetujuan yang jujur dan perlu ditahan dari siapa pun yang memegang jabatan senior.",
    researchFact: "Milgram (1963): 65% of ordinary people administered apparently lethal 450-volt shocks to a stranger when instructed by a man in a lab coat. Replicated across 20+ countries with similar results. A title, uniform, or institutional affiliation reliably overrides independent moral judgment.",
    researchFact_id: "Milgram (1963): 65% orang biasa mengadministrasikan sengatan listrik 450 volt yang tampaknya mematikan kepada orang asing ketika diperintahkan oleh pria berjas lab. Direplikasi di 20+ negara dengan hasil serupa. Gelar, seragam, atau afiliasi institusi secara konsisten mengesampingkan penilaian moral independen.",
  },
  {
    name: "Placebo Effect",
    name_id: "Efek Plasebo",
    category: "belief",
    crossCulturalNote: "A leader believes a new cross-cultural training program is working simply because money was spent on it, even when team behaviour is unchanged.",
    crossCulturalNote_id: "Seorang pemimpin percaya program pelatihan lintas budaya yang baru berhasil hanya karena uang dihabiskan untuk itu, bahkan ketika perilaku tim tidak berubah.",
    researchFact: "Fabrizio Benedetti's research found measurable neurochemical changes — including endorphin release — from placebo treatment. Most striking: open-label placebos (where patients are explicitly told they're receiving a placebo) still outperform no treatment in multiple controlled trials. Belief alone has biological effects.",
    researchFact_id: "Penelitian Fabrizio Benedetti menemukan perubahan neurokimia yang terukur — termasuk pelepasan endorfin — dari pengobatan plasebo. Paling mencolok: plasebo terbuka (di mana pasien secara eksplisit diberitahu bahwa mereka menerima plasebo) tetap mengungguli tanpa pengobatan dalam berbagai uji coba terkontrol. Keyakinan saja memiliki efek biologis.",
  },
  // Money
  {
    name: "Sunk Cost Fallacy",
    name_id: "Kesalahan Biaya Hangus",
    category: "money",
    crossCulturalNote: "Leaders continue pouring resources into a failing foreign subsidiary because they've invested too much ego and time to admit the strategy isn't working.",
    crossCulturalNote_id: "Pemimpin terus menuangkan sumber daya ke anak perusahaan asing yang gagal karena mereka telah menginvestasikan terlalu banyak ego dan waktu untuk mengakui bahwa strategi tidak berhasil.",
    researchFact: "Thaler (1980): People who paid for a theater ticket were significantly more likely to attend a bad play in a snowstorm than those who received the ticket free — despite identical future enjoyment. Spent resources are treated as ongoing commitments rather than irrelevant past costs.",
    researchFact_id: "Thaler (1980): Orang yang membayar tiket teater secara signifikan lebih mungkin pergi menonton pertunjukan buruk dalam badai salju dibanding mereka yang menerima tiket gratis — meski kesenangan di masa depan identik. Sumber daya yang telah dihabiskan diperlakukan sebagai komitmen yang terus berjalan, bukan biaya masa lalu yang tidak relevan.",
  },
  {
    name: "Gambler's Fallacy",
    name_id: "Kekeliruan Penjudi",
    category: "money",
    crossCulturalNote: "After several failed product launches in a new region, a leader believes they're 'due' for a win rather than addressing root causes.",
    crossCulturalNote_id: "Setelah beberapa peluncuran produk yang gagal di kawasan baru, seorang pemimpin percaya mereka 'sudah waktunya' untuk menang daripada menangani akar penyebabnya.",
    researchFact: "Monte Carlo Casino (1913): Roulette landed on black 26 consecutive times. Gamblers lost millions betting on red, convinced it was 'overdue.' The wheel has no memory. Each spin's probability is independent of all previous spins — a fact our brains consistently refuse to accept.",
    researchFact_id: "Kasino Monte Carlo (1913): Roulette mendarat di hitam 26 kali berturut-turut. Penjudi kehilangan jutaan bertaruh pada merah, yakin sudah 'waktunya.' Roda tidak memiliki memori. Probabilitas setiap putaran independen dari semua putaran sebelumnya — fakta yang otak kita secara konsisten menolak untuk menerima.",
  },
  {
    name: "Zero-Risk Bias",
    name_id: "Bias Risiko Nol",
    category: "money",
    crossCulturalNote: "Leaders waste resources eliminating minor local risks while ignoring larger, more significant threats that carry greater long-term cost.",
    crossCulturalNote_id: "Pemimpin membuang sumber daya untuk menghilangkan risiko lokal kecil sambil mengabaikan ancaman yang lebih besar dan lebih signifikan yang membawa biaya jangka panjang lebih besar.",
    researchFact: "Viscusi (1997): People consistently prefer policies that eliminate small risks entirely over policies that significantly reduce larger risks — even when the latter saves far more lives in aggregate. The word 'zero' carries psychological weight that vastly exceeds its statistical value.",
    researchFact_id: "Viscusi (1997): Orang secara konsisten lebih menyukai kebijakan yang menghilangkan risiko kecil sepenuhnya daripada kebijakan yang secara signifikan mengurangi risiko yang lebih besar — bahkan ketika yang terakhir menyelamatkan jauh lebih banyak nyawa secara keseluruhan. Kata 'nol' membawa bobot psikologis yang jauh melampaui nilainya secara statistik.",
  },
  {
    name: "IKEA Effect",
    name_id: "Efek IKEA",
    category: "money",
    crossCulturalNote: "A leader overvalues a business plan they helped create, dismissing superior, more culturally-nuanced suggestions from local managers.",
    crossCulturalNote_id: "Seorang pemimpin terlalu menghargai rencana bisnis yang mereka bantu buat, mengabaikan saran yang lebih unggul dan lebih bernuansa budaya dari manajer lokal.",
    researchFact: "Norton, Mochon & Ariely (2012): Subjects valued self-assembled IKEA furniture at 63% more than identical pre-assembled pieces. The effect held even for poorly assembled items — effort invested inflates perceived value independent of actual quality. Creation produces attachment.",
    researchFact_id: "Norton, Mochon & Ariely (2012): Subjek menghargai furnitur IKEA yang mereka rakit sendiri 63% lebih tinggi daripada potongan yang sudah jadi. Efek ini berlaku bahkan untuk item yang dirakit dengan buruk — usaha yang diinvestasikan meningkatkan nilai yang dirasakan terlepas dari kualitas aktual. Penciptaan menghasilkan keterikatan.",
  },
  // Politics
  {
    name: "Groupthink",
    name_id: "Pemikiran Kelompok",
    category: "politics",
    crossCulturalNote: "An expat leadership team isolates from local advice to maintain internal harmony, producing out-of-touch strategic decisions that locals could have prevented.",
    crossCulturalNote_id: "Tim kepemimpinan ekspatriat mengisolasi diri dari saran lokal untuk menjaga harmoni internal, menghasilkan keputusan strategis yang tidak relevan yang bisa dicegah oleh orang lokal.",
    researchFact: "Irving Janis (1972) coined the term analysing the Bay of Pigs invasion (1961). He identified eight symptoms — including 'illusion of invulnerability' and 'self-appointed mindguards.' Key finding: high group cohesion does NOT improve decision quality — it actively suppresses it. Loyalty can be a liability.",
    researchFact_id: "Irving Janis (1972) mencetuskan istilah ini saat menganalisis invasi Teluk Babi (1961). Ia mengidentifikasi delapan gejala — termasuk 'ilusi tak terkalahkan' dan 'penjaga pikiran yang ditunjuk sendiri.' Temuan kunci: kohesi kelompok yang tinggi TIDAK meningkatkan kualitas keputusan — justru secara aktif menekannya. Loyalitas bisa menjadi liabilitas.",
  },
  {
    name: "Law of Triviality",
    name_id: "Hukum Trivialitas",
    category: "politics",
    crossCulturalNote: "A cross-cultural team spends hours debating slogan translation while ignoring major flaws in the underlying distribution or go-to-market model.",
    crossCulturalNote_id: "Tim lintas budaya menghabiskan berjam-jam memperdebatkan terjemahan slogan sambil mengabaikan kelemahan besar dalam model distribusi atau go-to-market yang mendasarinya.",
    researchFact: "C. Northcote Parkinson (1957) used the example of a committee spending more time on a bicycle shed than a nuclear reactor — the shed is discussable; the reactor is too complex to engage. In software development, this is known as 'bikeshedding.' Trivial items dominate agendas because everyone can have an opinion on them.",
    researchFact_id: "C. Northcote Parkinson (1957) menggunakan contoh komite yang menghabiskan lebih banyak waktu untuk gudang sepeda daripada reaktor nuklir — gudang bisa didiskusikan; reaktor terlalu kompleks untuk diikutsertakan. Dalam pengembangan perangkat lunak, ini dikenal sebagai 'bikeshedding.' Item sepele mendominasi agenda karena semua orang bisa berpendapat tentangnya.",
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
  const [selectedBias, setSelectedBias] = useState<Bias | null>(null);
  const t = (en: string, id: string) => tFn(en, id, lang);

  useEffect(() => {
    if (!selectedBias) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelectedBias(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selectedBias]);

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
      const displayName = lang === "en" ? b.name : b.name_id;
      const displayNote = lang === "en" ? b.crossCulturalNote : b.crossCulturalNote_id;
      const matchesSearch = !q || displayName.toLowerCase().includes(q) || displayNote.toLowerCase().includes(q) || b.name.toLowerCase().includes(q);
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

      {/* Bias detail modal */}
      {selectedBias && (
        <div
          onClick={() => setSelectedBias(null)}
          style={{ position: "fixed", inset: 0, background: "oklch(0% 0 0 / 0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: offWhite, borderRadius: 16, maxWidth: 600, width: "100%", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 24px 64px oklch(0% 0 0 / 0.35)" }}
          >
            {/* Modal header */}
            <div style={{ background: navy, borderRadius: "16px 16px 0 0", padding: "28px 32px 24px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                <div>
                  <span style={{ display: "inline-block", fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: offWhite, background: CATEGORY_META[selectedBias.category].color, padding: "3px 10px", borderRadius: 4, marginBottom: 12 }}>
                    {lang === "en" ? CATEGORY_META[selectedBias.category].en : CATEGORY_META[selectedBias.category].id}
                  </span>
                  <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 600, color: offWhite, margin: 0, lineHeight: 1.2 }}>
                    {lang === "en" ? selectedBias.name : selectedBias.name_id}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedBias(null)}
                  style={{ background: "oklch(35% 0.08 260)", border: "none", color: "oklch(80% 0.04 260)", width: 36, height: 36, borderRadius: 8, cursor: "pointer", fontSize: 18, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div style={{ padding: "28px 32px 32px", display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Research fact */}
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: 10 }}>
                  {t("Research Background", "Latar Belakang Penelitian")}
                </p>
                <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                  {lang === "en" ? selectedBias.researchFact : selectedBias.researchFact_id}
                </p>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "oklch(88% 0.008 80)" }} />

              {/* Cross-cultural example */}
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: CATEGORY_META[selectedBias.category].color, marginBottom: 10 }}>
                  {t("Cross-Cultural Leadership Example", "Contoh Kepemimpinan Lintas Budaya")}
                </p>
                <div style={{ background: lightGray, borderRadius: 10, padding: "18px 20px", borderLeft: `3px solid ${CATEGORY_META[selectedBias.category].color}` }}>
                  <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                    {lang === "en" ? selectedBias.crossCulturalNote : selectedBias.crossCulturalNote_id}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <div style={{ background: navy, padding: "80px 24px 72px" }}>
        <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
          {t("Thinking Tools — Guide", "Alat Berpikir — Panduan")}
        </p>
        <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, color: offWhite, margin: "0 0 24px", lineHeight: 1.08 }}>
          {t("Cognitive Biases in Leadership", "Bias Kognitif dalam Kepemimpinan")}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(16px, 2vw, 19px)", color: "oklch(85% 0.03 80)", maxWidth: 580, margin: "0 0 32px", lineHeight: 1.65 }}>
          {t(
            '"We think we see the world as it is. We actually see the world as we are." — Anaïs Nin',
            '"Kita pikir kita melihat dunia sebagaimana adanya. Kita sebenarnya melihat dunia sebagaimana kita adanya." — Anaïs Nin'
          )}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={handleSave} disabled={saved || isPending} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: saved ? "oklch(35% 0.08 260)" : "transparent", color: "oklch(75% 0.04 260)", padding: "14px 28px", borderRadius: 12, fontWeight: 600, fontSize: 14, border: "1px solid oklch(42% 0.08 260)", cursor: saved ? "default" : "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
            {saved ? t("Saved to Dashboard", "Tersimpan di Dashboard") : t("Save to Dashboard", "Simpan ke Dashboard")}
          </button>
        </div>
      </div>

      {/* Intro */}
      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, marginBottom: 20 }}>
          {t(
            "Cognitive biases are systematic errors in thinking that affect every human being — not just the uninformed or the unintelligent. They are shortcuts the brain takes to process the overwhelming volume of information it receives each day. In ordinary life, many of them are helpful. In leadership — and especially cross-cultural leadership — they can be devastating.",
            "Bias kognitif adalah kesalahan sistematis dalam berpikir yang mempengaruhi setiap manusia — bukan hanya yang tidak terinformasi atau tidak cerdas. Mereka adalah jalan pintas yang diambil otak untuk memproses volume informasi yang luar biasa yang diterimanya setiap hari. Dalam kehidupan biasa, banyak di antaranya berguna. Dalam kepemimpinan — dan terutama kepemimpinan lintas budaya — bias ini bisa sangat merusak."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75 }}>
          {t(
            "Cross-cultural leaders are especially vulnerable because they are operating in an environment where their brain's pattern-recognition system is working with incomplete data. Cultural norms they take for granted don't apply; behaviours that seem strange may be entirely rational; silence may mean something other than what they assume.",
            "Pemimpin lintas budaya sangat rentan karena mereka beroperasi di lingkungan di mana sistem pengenalan pola otak mereka bekerja dengan data yang tidak lengkap. Norma budaya yang mereka anggap bisa diterima begitu saja tidak berlaku; perilaku yang tampak aneh mungkin sepenuhnya rasional; keheningan mungkin berarti sesuatu yang berbeda dari yang mereka asumsikan."
          )}
        </p>
      </div>

      {/* 50-BIAS SEARCHABLE LIBRARY */}
      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
              {t("Reference Library", "Perpustakaan Referensi")}
            </p>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: navy, marginBottom: 12 }}>
              {t("50 Biases — Cross-Cultural Impact", "50 Bias — Dampak Lintas Budaya")}
            </h2>
            <p style={{ color: bodyText, fontSize: 15, maxWidth: 560, margin: "0 auto" }}>
              {t(
                "Click any tile to explore the research background and a real cross-cultural leadership example.",
                "Klik tile mana saja untuk menjelajahi latar belakang penelitian dan contoh kepemimpinan lintas budaya nyata."
              )}
            </p>
          </div>

          {/* Search bar */}
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t("Search biases…", "Cari bias…")}
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
              borderRadius: 8,
            }}
          />

          {/* Category filter */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <button
              onClick={() => setActiveCategory("all")}
              style={{ padding: "0.375rem 1rem", border: "1px solid", borderColor: activeCategory === "all" ? navy : "oklch(82% 0.008 80)", background: activeCategory === "all" ? navy : "transparent", color: activeCategory === "all" ? offWhite : bodyText, fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: "0.06em", borderRadius: 6 }}
            >
              {t("All", "Semua")} ({BIASES.length})
            </button>
            {(Object.entries(CATEGORY_META) as [BiasCategory, typeof CATEGORY_META[BiasCategory]][]).map(([key, meta]) => {
              const count = BIASES.filter(b => b.category === key).length;
              const isActive = activeCategory === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  style={{ padding: "0.375rem 1rem", border: "1px solid", borderColor: isActive ? meta.color : "oklch(82% 0.008 80)", background: isActive ? meta.color : "transparent", color: isActive ? offWhite : bodyText, fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: "0.06em", borderRadius: 6 }}
                >
                  {lang === "en" ? meta.en : meta.id} ({count})
                </button>
              );
            })}
          </div>

          {/* Result count */}
          <p style={{ fontSize: 12, color: "oklch(55% 0.008 260)", marginBottom: "1.5rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {t(`Showing ${filteredBiases.length} of ${BIASES.length}`, `Menampilkan ${filteredBiases.length} dari ${BIASES.length}`)}
          </p>

          {/* Cards grid */}
          {filteredBiases.length === 0 ? (
            <p style={{ textAlign: "center", color: bodyText, padding: "3rem 0" }}>
              {t("No biases match your search.", "Tidak ada bias yang cocok.")}
            </p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
              {filteredBiases.map(bias => {
                const catMeta = CATEGORY_META[bias.category];
                const displayName = lang === "en" ? bias.name : bias.name_id;
                return (
                  <button
                    key={bias.name}
                    onClick={() => setSelectedBias(bias)}
                    style={{ background: offWhite, border: "1px solid oklch(90% 0.008 80)", padding: "1.125rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.625rem", textAlign: "left", cursor: "pointer", borderRadius: 8, transition: "box-shadow 0.15s, border-color 0.15s", fontFamily: "inherit" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px oklch(0% 0 0 / 0.10)"; (e.currentTarget as HTMLElement).style.borderColor = catMeta.color; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.borderColor = "oklch(90% 0.008 80)"; }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
                      <p style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 13, color: navy, margin: 0, lineHeight: 1.3 }}>
                        {displayName}
                      </p>
                      <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: offWhite, background: catMeta.color, padding: "2px 7px", borderRadius: 4 }}>
                        {lang === "en" ? catMeta.en : catMeta.id}
                      </span>
                    </div>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "oklch(55% 0.06 260)", lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                      {t("Tap to explore →", "Ketuk untuk jelajahi →")}
                    </p>
                  </button>
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
            {t("6 Patterns Worth Understanding Deeply", "6 Pola yang Layak Dipahami Mendalam")}
          </h2>
          <p style={{ textAlign: "center", color: bodyText, fontSize: 15, marginBottom: 48 }}>
            {t("These six show up most often — and most destructively — in cross-cultural teams.", "Enam ini paling sering muncul — dan paling destruktif — dalam tim lintas budaya.")}
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
            {t("5 Ways to Counter Bias", "5 Cara Mengatasi Bias")}
          </h2>
          <p style={{ textAlign: "center", color: bodyText, marginBottom: 40, fontSize: 15 }}>
            {t("You cannot eliminate bias — but you can interrupt it.", "Anda tidak bisa menghilangkan bias — tetapi Anda bisa menginterupsinya.")}
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
          {t("Reflection Questions", "Pertanyaan Refleksi")}
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
          {t("Keep Growing", "Terus Bertumbuh")}
        </h2>
        <p style={{ color: "oklch(80% 0.03 80)", fontSize: 16, lineHeight: 1.75, maxWidth: 540, margin: "0 0 32px" }}>
          {t("Explore more training modules to deepen your cross-cultural leadership.", "Jelajahi lebih banyak modul pelatihan untuk memperdalam kepemimpinan lintas budaya Anda.")}
        </p>
        <Link href="/resources" style={{ display: "inline-block", padding: "14px 32px", background: orange, color: offWhite, borderRadius: 12, fontFamily: "Montserrat, sans-serif", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
          {t("Training", "Pelatihan")}
        </Link>
      </div>
    </div>
  );
}
