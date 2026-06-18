"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";
import SourcesDropdown from "@/components/SourcesDropdown";

// -- TYPES ----------------------------------------------------------------------

type Lang = "en" | "id";

// -- HELPERS --------------------------------------------------------------------

const t = (en: string, id: string, lang: Lang) =>
  lang === "id" ? id : en;

// -- DATA -----------------------------------------------------------------------

const HATS = [
  {
    num: "01",
    colorName: "White", colorNameId: "Putih",
    emoji: "⬜",
    bg: "oklch(94% 0.00 0)",
    color: "oklch(35% 0.03 260)",
    accent: "oklch(55% 0.04 260)",
    hatImage: "/resources/hats/hat-white.png",
    focusEn: "Facts & Information", focusId: "Fakta & Informasi",
    descEn: "The White Hat focuses on objective data, facts, and figures. It asks: what do we know, what don't we know, and what do we need to find out? It sets aside interpretation and emotion, creating a shared factual baseline before analysis begins.",
    descId: "Topi Putih berfokus pada data objektif, fakta, dan angka. Pertanyaannya: apa yang kita ketahui, apa yang tidak kita ketahui, dan apa yang perlu kita cari tahu? Menyingkirkan interpretasi dan emosi, menciptakan landasan faktual bersama sebelum analisis dimulai.",
    crossCulturalEn: "What counts as 'evidence' varies across cultures. Some contexts weight personal testimony and oral precedent more heavily than statistics; others rely on community consensus over individual data points. The White Hat invites teams to surface these assumptions explicitly: whose data are we using, and who decided it counts?",
    crossCulturalId: "Apa yang dianggap 'bukti' berbeda-beda antar budaya. Beberapa konteks lebih mengutamakan kesaksian pribadi dan preseden lisan daripada statistik; yang lain mengandalkan konsensus komunitas daripada data individu. Topi Putih mengajak tim untuk mengungkap asumsi ini secara eksplisit: data siapa yang kita gunakan, dan siapa yang memutuskan bahwa itu berlaku?",
    faithNoteEn: "Proverbs 18:15 calls us to seek understanding before speaking. The White Hat creates space for that discipline — gathering before judging, listening before concluding. It resists the pressure to have an answer before the picture is clear.",
    faithNoteId: "Amsal 18:15 memanggil kita untuk mencari pemahaman sebelum berbicara. Topi Putih menciptakan ruang untuk disiplin itu — mengumpulkan sebelum menghakimi, mendengarkan sebelum menyimpulkan. Ini menolak tekanan untuk memiliki jawaban sebelum gambaran jelas.",
    benefitEn: "Creates a shared factual baseline before analysis begins, reducing disagreements rooted in different assumptions about reality.",
    benefitId: "Menciptakan landasan faktual bersama sebelum analisis dimulai, mengurangi perselisihan yang berakar dari asumsi berbeda tentang kenyataan.",
    riskEn: "Over-reliance on available data can crowd out intuition, local knowledge, and lived experience — all of which may be harder to quantify but equally valid.",
    riskId: "Ketergantungan berlebihan pada data yang tersedia dapat mengabaikan intuisi, pengetahuan lokal, dan pengalaman hidup — yang mungkin lebih sulit dikuantifikasi tetapi sama validnya.",
    questionsEn: [
      "What information do we have, and what do we need to find out?",
      "Are the sources of this information reliable and accurate?",
      "What assumptions are we currently treating as established facts?",
      "Whose knowledge or experience is missing from this picture?",
    ],
    questionsId: [
      "Informasi apa yang kita miliki, dan apa yang perlu kita cari tahu?",
      "Apakah sumber informasi ini dapat diandalkan dan akurat?",
      "Asumsi apa yang saat ini kita anggap sebagai fakta yang sudah terbukti?",
      "Pengetahuan atau pengalaman siapa yang tidak ada dalam gambaran ini?",
    ],
  },
  {
    num: "02",
    colorName: "Red", colorNameId: "Merah",
    emoji: "🔴",
    bg: "oklch(94% 0.05 25)",
    color: "oklch(42% 0.18 25)",
    accent: "oklch(55% 0.20 25)",
    hatImage: "/resources/hats/hat-red.png",
    focusEn: "Feelings & Intuition", focusId: "Perasaan & Intuisi",
    descEn: "The Red Hat gives everyone permission to share emotional responses, gut feelings, and intuitions without needing to justify them. It acknowledges that feelings are information — not noise to be filtered out, but signal worth hearing before analysis crowds it out.",
    descId: "Topi Merah memberikan izin kepada semua orang untuk berbagi respons emosional, perasaan naluriah, dan intuisi tanpa perlu membenarkannya. Ini mengakui bahwa perasaan adalah informasi — bukan gangguan yang harus disaring, tetapi sinyal yang layak didengar sebelum analisis mendominasinya.",
    crossCulturalEn: "In high-power-distance cultures, team members are significantly less likely to voice emotional concerns to a senior leader directly. The Red Hat changes this by structuring it into the process — 'I'm wearing the Red Hat' separates the feeling from the person. It's not insubordination; it's a required step. This gives lower-status voices access to the conversation without the risk of appearing disrespectful.",
    crossCulturalId: "Dalam budaya dengan jarak kekuasaan tinggi, anggota tim jauh lebih kecil kemungkinannya untuk menyuarakan kekhawatiran emosional langsung kepada pemimpin senior. Topi Merah mengubah ini dengan menyusunnya ke dalam proses — 'Saya memakai Topi Merah' memisahkan perasaan dari orangnya. Ini bukan ketidakpatuhan; ini langkah yang diperlukan. Ini memberikan akses bagi suara-suara yang lebih rendah statusnya tanpa risiko terlihat tidak hormat.",
    faithNoteEn: "For leaders rooted in faith, the Red Hat connects to Ignatian discernment⁵: consolation (a sense of rightness, peace, alignment with God's direction) and desolation (unease, resistance, a check in the spirit) are spiritual data, not just emotion. When a decision sits uneasily with your team, that unease may be worth naming before the logic takes over.",
    faithNoteId: "Bagi pemimpin yang berakar dalam iman, Topi Merah terhubung dengan discernment Ignasian⁵: konsolasi (rasa kebenaran, kedamaian, keselarasan dengan arah Tuhan) dan desolasi (kegelisahan, resistensi, pemeriksaan dalam roh) adalah data spiritual, bukan sekadar emosi. Ketika sebuah keputusan terasa tidak nyaman bagi tim Anda, perasaan tidak nyaman itu mungkin layak diungkapkan sebelum logika mengambil alih.",
    benefitEn: "Surfaces emotional data before it unconsciously distorts analysis — people's feelings influence decisions whether or not they are named.",
    benefitId: "Mengungkap data emosional sebelum secara tidak sadar mendistorsi analisis — perasaan orang mempengaruhi keputusan baik diungkapkan maupun tidak.",
    riskEn: "Without good facilitation, the Red Hat can become a space for venting rather than surfacing signal — the facilitator needs to draw out the feeling, not extend it.",
    riskId: "Tanpa fasilitasi yang baik, Topi Merah bisa menjadi ruang untuk melampiaskan daripada mengungkap sinyal — fasilitator perlu mengeluarkan perasaan, bukan memperpanjangnya.",
    questionsEn: [
      "What is my gut feeling about this situation or idea?",
      "How do emotions — mine or others' — impact this decision?",
      "What does your unease or excitement here tell you about what matters most?",
      "Is there a sense of peace, resistance, or unsettledness about this direction?",
    ],
    questionsId: [
      "Apa perasaan naluriah saya tentang situasi atau ide ini?",
      "Bagaimana emosi — saya atau orang lain — mempengaruhi keputusan ini?",
      "Apa yang diungkapkan rasa tidak nyaman atau antusias Anda tentang apa yang paling penting?",
      "Apakah ada rasa damai, resistensi, atau kegelisahan tentang arah ini?",
    ],
  },
  {
    num: "03",
    colorName: "Black", colorNameId: "Hitam",
    emoji: "⬛",
    bg: "oklch(94% 0.01 260)",
    color: "oklch(22% 0.04 260)",
    accent: "oklch(38% 0.05 260)",
    hatImage: "/resources/hats/hat-black.png",
    focusEn: "Critical Judgment", focusId: "Penilaian Kritis",
    descEn: "The Black Hat examines an idea for risks, weaknesses, and potential failure points. It is perhaps the most important hat in cross-cultural teams — because it creates a structured, role-based way to voice concern without personal confrontation. Caution is the job, not the personality.",
    descId: "Topi Hitam memeriksa ide untuk risiko, kelemahan, dan titik kegagalan potensial. Ini mungkin topi yang paling penting dalam tim lintas budaya — karena menciptakan cara terstruktur dan berbasis peran untuk menyuarakan kekhawatiran tanpa konfrontasi pribadi. Kehati-hatian adalah tugasnya, bukan kepribadiannya.",
    crossCulturalEn: "Indonesia scores 78 on Hofstede's² Power Distance Index — among the highest in the world. In such cultures, disagreeing with a senior leader publicly can feel face-threatening or professionally risky. The Black Hat reframes this entirely: 'I'm not challenging you — I'm wearing the Black Hat.' Research by Nemeth et al.³ found that formally assigning a structured dissent role — the devil's advocate — led groups to consider a significantly wider range of perspectives than unstructured discussion.",
    crossCulturalId: "Indonesia mendapat skor 78 pada Indeks Jarak Kekuasaan Hofstede² — termasuk yang tertinggi di dunia. Dalam budaya seperti itu, tidak setuju dengan pemimpin senior secara terbuka bisa terasa mengancam muka atau berisiko secara profesional. Topi Hitam membingkai ulang ini sepenuhnya: 'Saya tidak menantang Anda — saya memakai Topi Hitam.' Penelitian Nemeth dkk.³ menemukan bahwa secara formal menugaskan peran ketidaksetujuan terstruktur — devil's advocate — membuat kelompok mempertimbangkan jauh lebih banyak perspektif daripada diskusi tanpa struktur.",
    faithNoteEn: "Proverbs 15:22 is explicit: 'Plans fail for lack of counsel, but with many advisers they succeed.' The Black Hat is the institutional form of that counsel — it builds in the honest, risk-aware voice that wisdom literature consistently calls for. Using it is an act of faithfulness to the community the decision will affect.",
    faithNoteId: "Amsal 15:22 eksplisit: 'Rencana gagal karena kurangnya nasihat, tetapi dengan banyak penasihat mereka berhasil.' Topi Hitam adalah bentuk kelembagaan dari nasihat itu — membangun suara yang jujur dan sadar risiko yang secara konsisten diminta oleh literatur kebijaksanaan.",
    benefitEn: "Depersonalises dissent — concern becomes part of the process, not a challenge to authority or a sign of disloyalty.",
    benefitId: "Mendepersonalisasi ketidaksetujuan — kekhawatiran menjadi bagian dari proses, bukan tantangan terhadap otoritas atau tanda ketidaksetiaan.",
    riskEn: "If used too early or too heavily, the Black Hat can extinguish momentum and discourage creative risk-taking — sequence it thoughtfully, not reflexively.",
    riskId: "Jika digunakan terlalu awal atau terlalu berat, Topi Hitam dapat memadamkan momentum dan menghambat pengambilan risiko kreatif — gunakan dengan urutan yang bijaksana, bukan refleks.",
    questionsEn: [
      "What are the potential risks or downsides of this idea?",
      "What obstacles or challenges could prevent success?",
      "What has gone wrong in similar situations before?",
      "Who might be negatively affected, and in what ways?",
    ],
    questionsId: [
      "Apa potensi risiko atau kerugian dari ide ini?",
      "Hambatan atau tantangan apa yang dapat mencegah keberhasilan?",
      "Apa yang telah salah dalam situasi serupa sebelumnya?",
      "Siapa yang mungkin terdampak negatif, dan dengan cara apa?",
    ],
  },
  {
    num: "04",
    colorName: "Yellow", colorNameId: "Kuning",
    emoji: "🟡",
    bg: "oklch(96% 0.06 90)",
    color: "oklch(45% 0.14 85)",
    accent: "oklch(60% 0.16 85)",
    hatImage: "/resources/hats/hat-yellow.png",
    focusEn: "Optimistic Thinking", focusId: "Pemikiran Optimistis",
    descEn: "The Yellow Hat focuses on benefits, opportunities, and the logical case for why something could work. It builds the constructive argument for an idea — not wishful thinking, but grounded optimism backed by reasoning.",
    descId: "Topi Kuning berfokus pada manfaat, peluang, dan argumen logis mengapa sesuatu bisa berhasil. Ini membangun argumen konstruktif untuk sebuah ide — bukan angan-angan, tetapi optimisme yang beralasan dan didukung oleh logika.",
    crossCulturalEn: "In collectivist or shame-oriented cultures, speaking positively about your own idea can feel like self-promotion — culturally inappropriate. The Yellow Hat provides cover: articulating benefits is the hat's job, not yours. This unlocks voices that would otherwise stay silent out of cultural modesty, and ensures good ideas receive a fair hearing regardless of who proposed them.",
    crossCulturalId: "Dalam budaya kolektivis atau berorientasi malu, berbicara positif tentang ide sendiri bisa terasa seperti promosi diri — tidak sesuai secara budaya. Topi Kuning memberikan perlindungan: mengartikulasikan manfaat adalah tugas topi, bukan Anda. Ini membuka suara yang sebelumnya diam karena kesopanan budaya, dan memastikan ide-ide baik mendapat perhatian yang adil terlepas dari siapa yang mengusulkannya.",
    faithNoteEn: "The Yellow Hat reflects a biblical posture of hope — looking toward what might be possible, not only what could go wrong. It is the visionary complement to the Black Hat's realism. Together, they produce what cross-cultural leaders need: discerning optimism, grounded in faith, tested by honest scrutiny.",
    faithNoteId: "Topi Kuning mencerminkan sikap alkitabiah tentang harapan — melihat ke arah apa yang mungkin terjadi, bukan hanya apa yang bisa salah. Ini adalah pelengkap visioner dari realisme Topi Hitam. Bersama-sama, mereka menghasilkan apa yang dibutuhkan pemimpin lintas budaya: optimisme yang cerdas, berakar pada iman, diuji oleh pemeriksaan yang jujur.",
    benefitEn: "Ensures good ideas receive a full hearing before critical assessment — sequencing Yellow before Black produces stronger, more resilient thinking.",
    benefitId: "Memastikan ide-ide baik mendapatkan perhatian penuh sebelum penilaian kritis — menempatkan Kuning sebelum Hitam menghasilkan pemikiran yang lebih kuat dan tangguh.",
    riskEn: "Yellow Hat optimism requires logical grounding — 'this will work because...' rather than 'I feel good about this.' Without that discipline, it becomes cheerleading rather than analysis.",
    riskId: "Optimisme Topi Kuning membutuhkan landasan logis — 'ini akan berhasil karena...' bukan 'saya merasa baik tentang ini.' Tanpa disiplin itu, ini menjadi sorak-sorak daripada analisis.",
    questionsEn: [
      "What are the specific benefits and opportunities this idea could bring?",
      "Why might this plan succeed, and what would need to be true for it to work?",
      "What is the best realistic outcome we could hope for?",
      "What value does this create for the people we serve?",
    ],
    questionsId: [
      "Apa manfaat dan peluang spesifik yang bisa dibawa oleh ide ini?",
      "Mengapa rencana ini mungkin berhasil, dan apa yang perlu benar agar berhasil?",
      "Apa hasil terbaik yang realistis yang bisa kita harapkan?",
      "Nilai apa yang ini ciptakan bagi orang-orang yang kita layani?",
    ],
  },
  {
    num: "05",
    colorName: "Green", colorNameId: "Hijau",
    emoji: "🟢",
    bg: "oklch(94% 0.05 145)",
    color: "oklch(38% 0.14 145)",
    accent: "oklch(52% 0.16 145)",
    hatImage: "/resources/hats/hat-green.png",
    focusEn: "Creativity & Alternatives", focusId: "Kreativitas & Alternatif",
    descEn: "The Green Hat is the space for generative thinking — new ideas, alternative approaches, modifications, and creative leaps. It suspends judgment to allow possibilities to emerge before evaluation begins.",
    descId: "Topi Hijau adalah ruang untuk pemikiran generatif — ide-ide baru, pendekatan alternatif, modifikasi, dan lompatan kreatif. Ini menangguhkan penilaian untuk memungkinkan kemungkinan-kemungkinan muncul sebelum evaluasi dimulai.",
    crossCulturalEn: "Research by Zenasni et al.⁴ found that structured conditions for divergent thinking produced the most unique ideas — not just quantity, but genuine originality. Cross-cultural teams have a particular advantage here: diverse reference points and life experiences produce ideas that homogeneous groups cannot. The Green Hat is where cultural difference becomes a direct creative asset.",
    crossCulturalId: "Penelitian oleh Zenasni dkk.⁴ menemukan bahwa kondisi terstruktur untuk pemikiran divergen menghasilkan ide-ide paling unik — bukan hanya kuantitas, tetapi orisinalitas sejati. Tim lintas budaya memiliki keunggulan khusus di sini: titik referensi dan pengalaman hidup yang beragam menghasilkan ide-ide yang tidak bisa dihasilkan oleh kelompok homogen. Topi Hijau adalah di mana perbedaan budaya menjadi aset kreatif langsung.",
    faithNoteEn: "Creativity is not merely a human skill — it reflects the imago Dei. We are made in the image of a Creator. The Green Hat invites teams to bring that awareness into their work: approaching problems as stewards of a creative capacity that mirrors the One who makes all things new. 'What might God's imagination look like in this situation?' is a legitimate Green Hat question.",
    faithNoteId: "Kreativitas bukan sekadar keterampilan manusia — ini mencerminkan imago Dei. Kita diciptakan dalam gambar Sang Pencipta. Topi Hijau mengajak tim untuk membawa kesadaran itu ke dalam pekerjaan mereka: mendekati masalah sebagai penatalayan kapasitas kreatif yang mencerminkan Dia yang memperbarui segala sesuatu. 'Seperti apa imajinasi Tuhan dalam situasi ini?' adalah pertanyaan Topi Hijau yang sah.",
    benefitEn: "Separates idea generation from idea evaluation — the fastest way to kill creativity is to criticize too early. Green Hat creates the protected space where possibilities can breathe.",
    benefitId: "Memisahkan generasi ide dari evaluasi ide — cara tercepat untuk membunuh kreativitas adalah mengkritik terlalu awal. Topi Hijau menciptakan ruang yang dilindungi di mana kemungkinan-kemungkinan dapat berkembang.",
    riskEn: "Green Hat thinking requires psychological safety — if team members fear judgment, they will self-censor. The facilitator must actively protect the generative space.",
    riskId: "Pemikiran Topi Hijau membutuhkan keamanan psikologis — jika anggota tim takut penilaian, mereka akan menyensor diri sendiri. Fasilitator harus aktif melindungi ruang generatif.",
    questionsEn: [
      "What new ideas or approaches could we explore here?",
      "How might we solve this problem in a completely different way?",
      "What would we try if we knew we couldn't fail?",
      "What would someone from a different culture, field, or tradition suggest?",
    ],
    questionsId: [
      "Ide atau pendekatan baru apa yang bisa kita jelajahi di sini?",
      "Bagaimana kita bisa memecahkan masalah ini dengan cara yang sama sekali berbeda?",
      "Apa yang akan kita coba jika kita tahu kita tidak bisa gagal?",
      "Apa yang akan disarankan oleh seseorang dari budaya, bidang, atau tradisi yang berbeda?",
    ],
  },
  {
    num: "06",
    colorName: "Blue", colorNameId: "Biru",
    emoji: "🔵",
    bg: "oklch(93% 0.04 250)",
    color: "oklch(40% 0.16 250)",
    accent: "oklch(55% 0.18 250)",
    hatImage: "/resources/hats/hat-blue.png",
    focusEn: "Process Control", focusId: "Kontrol Proses",
    descEn: "The Blue Hat manages the thinking process itself — setting the agenda, sequencing the hats, monitoring progress, and ensuring the discussion stays productive. It is the conductor's baton, not an instrument. The Blue Hat begins and ends every Six Hats session.",
    descId: "Topi Biru mengelola proses berpikir itu sendiri — menetapkan agenda, mengurutkan topi, memantau kemajuan, dan memastikan diskusi tetap produktif. Ini adalah tongkat konduktor, bukan instrumen. Topi Biru membuka dan menutup setiap sesi Enam Topi.",
    crossCulturalEn: "In cultures where open disagreement is face-threatening, the Blue Hat facilitator holds unusual power: they can redirect, slow down, or re-sequence the conversation without anyone losing face. The course correction comes from the process, not from a person challenging another person. Used skillfully, the Blue Hat makes cross-cultural facilitation far more effective than unstructured discussion.",
    crossCulturalId: "Dalam budaya di mana ketidaksetujuan terbuka mengancam muka, fasilitator Topi Biru memegang kekuatan yang luar biasa: mereka dapat mengarahkan ulang, memperlambat, atau mengurutkan ulang percakapan tanpa siapapun kehilangan muka. Koreksi alur berasal dari proses, bukan dari seseorang yang menantang orang lain. Jika digunakan dengan terampil, Topi Biru membuat fasilitasi lintas budaya jauh lebih efektif daripada diskusi tanpa struktur.",
    faithNoteEn: "Acts 15 records the Jerusalem Council — perhaps the most consequential cross-cultural leadership meeting in history. Blue Hat principles are visible throughout: diverse voices were heard, the process was deliberate, and the conclusion was framed as Spirit-guided discernment. For faith communities, opening a Blue Hat session in prayer and closing it in gratitude transforms facilitation into an act of trust.",
    faithNoteId: "Kisah Para Rasul 15 mencatat Konsili Yerusalem — mungkin pertemuan kepemimpinan lintas budaya paling berpengaruh dalam sejarah. Prinsip-prinsip Topi Biru terlihat di seluruhnya: suara yang beragam didengar, prosesnya disengaja, dan kesimpulannya dibingkai sebagai discernment yang dipandu Roh. Bagi komunitas iman, membuka sesi Topi Biru dalam doa dan menutupnya dalam ucapan syukur mengubah fasilitasi menjadi tindakan kepercayaan.",
    benefitEn: "Keeps complex, multi-voice discussions from fragmenting — the Blue Hat holds the whole, so no individual voice has to carry it.",
    benefitId: "Menjaga diskusi yang kompleks dan multi-suara agar tidak terfragmentasi — Topi Biru memegang keseluruhan, sehingga tidak ada suara individu yang harus menanggungnya.",
    riskEn: "The Blue Hat facilitator must resist using process control to steer toward a predetermined conclusion — the hat is about enabling good thinking, not managing toward a preferred outcome.",
    riskId: "Fasilitator Topi Biru harus menghindari penggunaan kontrol proses untuk mengarah pada kesimpulan yang telah ditentukan — topi ini tentang memungkinkan pemikiran yang baik, bukan mengelola menuju hasil yang disukai.",
    questionsEn: [
      "What is our goal today, and which hats does this conversation need?",
      "Are we covering all the perspectives this decision requires?",
      "Where are we in the process, and what thinking haven't we done yet?",
      "What would a wise, impartial observer say about how this discussion is going?",
    ],
    questionsId: [
      "Apa tujuan kita hari ini, dan topi apa yang dibutuhkan percakapan ini?",
      "Apakah kita mencakup semua perspektif yang diperlukan keputusan ini?",
      "Di mana kita dalam proses ini, dan pemikiran apa yang belum kita lakukan?",
      "Apa yang akan dikatakan pengamat bijak yang tidak memihak tentang jalannya diskusi ini?",
    ],
  },
];

const USE_CASES = [
  {
    titleEn: "Team Meetings", titleId: "Rapat Tim",
    descEn: "Assign specific hats to team members for structured, comprehensive discussion. Each person focuses on one perspective — facts, risks, or opportunities. Reduces bias and enhances collaboration.",
    descId: "Tetapkan topi tertentu kepada anggota tim untuk diskusi yang terstruktur dan komprehensif. Setiap orang berfokus pada satu perspektif — fakta, risiko, atau peluang. Mengurangi bias dan meningkatkan kolaborasi.",
  },
  {
    titleEn: "Decision-Making", titleId: "Pengambilan Keputusan",
    descEn: "Sequentially apply the hats (White for facts, Black for risks, Yellow for opportunities) to create a logical flow. All perspectives are considered, resulting in informed and balanced decisions.",
    descId: "Terapkan topi secara berurutan (Putih untuk fakta, Hitam untuk risiko, Kuning untuk peluang) untuk menciptakan alur yang logis. Semua perspektif dipertimbangkan, menghasilkan keputusan yang terinformasi dan seimbang.",
  },
  {
    titleEn: "Problem-Solving", titleId: "Pemecahan Masalah",
    descEn: "Start with Green for creative solutions, switch to Black for challenges, then Blue to prioritize and create an action plan.",
    descId: "Mulai dengan Hijau untuk solusi kreatif, beralih ke Hitam untuk tantangan, lalu Biru untuk memprioritaskan dan membuat rencana tindakan.",
  },
  {
    titleEn: "Conflict Resolution", titleId: "Resolusi Konflik",
    descEn: "Begin with Red to allow everyone to express emotions, then White for factual points, Yellow to identify common goals and opportunities for resolution.",
    descId: "Mulai dengan Merah untuk memungkinkan semua orang mengekspresikan emosi, lalu Putih untuk poin faktual, Kuning untuk mengidentifikasi tujuan bersama dan peluang resolusi.",
  },
  {
    titleEn: "Strategic Planning", titleId: "Perencanaan Strategis",
    descEn: "White to analyze current data, Black to identify risks, Green for innovative strategies, Blue to organize all ideas into a coherent long-term plan.",
    descId: "Putih untuk menganalisis data saat ini, Hitam untuk mengidentifikasi risiko, Hijau untuk strategi inovatif, Biru untuk mengorganisir semua ide menjadi rencana jangka panjang yang koheren.",
  },
  {
    titleEn: "Self-Reflection", titleId: "Refleksi Diri",
    descEn: "Use all six hats individually to explore your thoughts, emotions, and ideas from multiple angles. Uncover blind spots and ensure a well-rounded understanding of personal challenges.",
    descId: "Gunakan keenam topi secara individual untuk mengeksplorasi pikiran, emosi, dan ide Anda dari berbagai sudut pandang. Temukan titik buta dan pastikan pemahaman yang menyeluruh tentang tantangan pribadi.",
  },
];

// -- COMPONENT -----------------------------------------------------------------

type Props = { userPathway: string | null; isSaved: boolean };

export default function SixThinkingHatsClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [activeHat, setActiveHat] = useState<number | null>(null);
  const [bgOpen, setBgOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const tr = (en: string, id: string) => t(en, id, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => { await saveResourceToDashboard("six-thinking-hats"); setSaved(true); });
  }

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: "oklch(97% 0.005 80)", minHeight: "100vh" }}>
      <LangToggle />

      {/* HERO */}
      <section style={{ background: "oklch(22% 0.10 260)", color: "white", padding: "96px 24px 80px", position: "relative", overflow: "hidden" }}>
        <img src="/images/resources/six-thinking-hats/hero.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.22, mixBlendMode: "luminosity", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "radial-gradient(circle at 80% 30%, oklch(65% 0.15 45) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative" }}>
          <p style={{ color: "oklch(65% 0.15 45)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {tr("Team & Facilitation — Guide", "Tim & Fasilitasi — Panduan", "Team & Facilitatie — Gids")}
          </p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, lineHeight: 1.08, margin: "0 0 24px", color: "oklch(96% 0.005 80)" }}>
            {tr("Six Thinking Hats", "Enam Topi Berpikir", "Zes Denkhoeden")}
          </h1>
          <p style={{ fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.65, color: "oklch(78% 0.04 260)", maxWidth: 580, margin: "0 0 40px" }}>
            {tr(
              "Edward de Bono's¹ powerful framework for better decisions. By deliberately separating six modes of thinking, teams move from confusion to clarity — and from conflict to collaboration.",
              "Kerangka kuat Edward de Bono¹ untuk keputusan yang lebih baik. Dengan sengaja memisahkan enam mode berpikir, tim bergerak dari kebingungan menuju kejelasan — dan dari konflik menuju kolaborasi.",
              "Edward de Bono's¹ krachtige kader voor betere beslissingen. Door zes denkmodi bewust te scheiden, bewegen teams van verwarring naar helderheid — en van conflict naar samenwerking."
            )}
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button onClick={handleSave} disabled={saved || isPending} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: saved ? "oklch(35% 0.08 260)" : "transparent", color: "oklch(75% 0.04 260)", padding: "14px 28px", borderRadius: 12, fontWeight: 600, fontSize: 14, border: "1px solid oklch(42% 0.08 260)", cursor: saved ? "default" : "pointer" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
              {saved ? tr("Saved to Dashboard", "Tersimpan di Dashboard", "Opgeslagen in Dashboard") : tr("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
            </button>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(20px, 2.5vw, 26px)", lineHeight: 1.6, color: "oklch(30% 0.08 260)", fontStyle: "italic", marginBottom: 28 }}>
          {tr(
            '"The Six Thinking Hats method separates thinking into different modes, making it easier for people to think about the right things at the right time."',
            '"Metode Enam Topi Berpikir memisahkan pemikiran ke dalam mode yang berbeda, sehingga lebih mudah bagi orang untuk memikirkan hal yang tepat pada waktu yang tepat."',
            '"De Zes Denkhoeden-methode scheidt denken in verschillende modi, waardoor het voor mensen gemakkelijker wordt om op het juiste moment over de juiste dingen na te denken."'
          )}
        </p>
        <p style={{ fontSize: 14, color: "oklch(55% 0.06 260)", marginBottom: 32 }}>— Edward de Bono</p>
        <p style={{ fontSize: 16, lineHeight: 1.75, color: "oklch(38% 0.05 260)" }}>
          {tr(
            "The Six Thinking Hats framework was developed by Dr. Edward de Bono¹ to improve decision-making and problem-solving. By separating emotions, logic, creativity, and judgment into six distinct 'hats', teams can have more balanced and productive discussions — without the confusion that comes when everyone thinks in all directions at once.",
            "Kerangka Enam Topi Berpikir dikembangkan oleh Dr. Edward de Bono¹ untuk meningkatkan pengambilan keputusan dan pemecahan masalah. Dengan memisahkan emosi, logika, kreativitas, dan penilaian menjadi enam 'topi' yang berbeda, tim dapat berdiskusi lebih seimbang dan produktif — tanpa kebingungan yang timbul ketika semua orang berpikir ke segala arah sekaligus.",
            "Het Zes Denkhoeden-kader werd ontwikkeld door Dr. Edward de Bono¹ om besluitvorming en probleemoplossing te verbeteren. Door emoties, logica, creativiteit en oordeel te scheiden in zes afzonderlijke 'hoeden', kunnen teams evenwichtiger en productiever discussiëren — zonder de verwarring die ontstaat wanneer iedereen tegelijk in alle richtingen denkt."
          )}
        </p>
      </section>

      {/* HAT CARDS */}
      <section style={{ background: "oklch(95% 0.008 80)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
            {tr("The Six Hats", "Enam Topi", "De Zes Hoeden")}
          </h2>
          <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", marginBottom: 40, lineHeight: 1.65 }}>
            {tr("Select a hat to explore its focus, cross-cultural context, faith connection, and key questions.", "Pilih topi untuk menjelajahi fokus, konteks lintas budaya, koneksi iman, dan pertanyaan utamanya.", "Selecteer een hoed om de focus, cross-culturele context, geloofsverbinding en sleutelvragen te verkennen.")}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 32 }}>
            {HATS.map((hat, i) => {
              const isActive = activeHat === i;
              return (
                <button
                  key={hat.num}
                  onClick={() => setActiveHat(activeHat === i ? null : i)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 16px", borderRadius: 12, cursor: "pointer",
                    background: isActive ? hat.bg : "white",
                    border: `2px solid ${isActive ? hat.color : "oklch(88% 0.02 260)"}`,
                    boxShadow: isActive ? `0 0 0 2px ${hat.color}38` : "0 1px 4px oklch(20% 0.06 260 / 0.06)",
                    textAlign: "left", fontFamily: "Montserrat, sans-serif",
                    transition: "all 0.18s ease",
                  }}
                >
                  <img src={hat.hatImage} alt="" style={{ width: 44, height: 44, objectFit: "contain", flexShrink: 0, mixBlendMode: "multiply" }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? hat.color : "oklch(25% 0.08 260)", marginBottom: 3 }}>
                      {tr(hat.colorName, hat.colorNameId)}
                    </div>
                    <div style={{ fontSize: 11, color: isActive ? hat.accent : "oklch(52% 0.05 260)", fontWeight: 500, letterSpacing: "0.02em", lineHeight: 1.4 }}>
                      {tr(hat.focusEn, hat.focusId)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {activeHat !== null && (() => {
            const hat = HATS[activeHat];
            return (
              <div style={{ background: hat.bg, borderRadius: 12, padding: "40px", border: `1px solid ${hat.color}20` }}>

                {/* Header: number + title + hat image */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 48, fontWeight: 600, color: hat.color, lineHeight: 1 }}>{hat.num}</span>
                    <div>
                      <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 600, color: hat.color, margin: 0 }}>
                        {tr(hat.colorName, hat.colorNameId)} Hat
                      </h3>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: hat.accent }}>
                        {tr(hat.focusEn, hat.focusId)}
                      </p>
                    </div>
                  </div>
                  <img
                    src={hat.hatImage}
                    alt=""
                    style={{ width: 160, height: 160, objectFit: "contain", flexShrink: 0, opacity: 0.88, mixBlendMode: "multiply" }}
                  />
                </div>

                {/* Description */}
                <p style={{ fontSize: 16, lineHeight: 1.75, color: "oklch(28% 0.06 260)", marginBottom: 24 }}>
                  {tr(hat.descEn, hat.descId)}
                </p>

                {/* Cross-cultural note */}
                <div style={{ borderLeft: `3px solid ${hat.accent}`, background: `${hat.color}0d`, borderRadius: "0 8px 8px 0", padding: "16px 20px", marginBottom: 24 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: hat.accent, marginBottom: 8, margin: "0 0 8px" }}>
                    {tr("Cross-Cultural Note", "Catatan Lintas Budaya", "Cross-Culturele Noot")}
                  </p>
                  <p style={{ fontSize: 14, lineHeight: 1.72, color: "oklch(30% 0.06 260)", margin: 0 }}>
                    {lang === "id" ? hat.crossCulturalId : hat.crossCulturalEn}
                  </p>
                </div>

                {/* Benefit / Risk */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 24 }}>
                  <div style={{ background: "white", borderRadius: 8, padding: "18px 20px" }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(45% 0.12 145)", marginBottom: 10, margin: "0 0 10px" }}>
                      {tr("Benefit", "Manfaat", "Voordeel")}
                    </p>
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: "oklch(30% 0.06 260)", margin: 0 }}>
                      {tr(hat.benefitEn, hat.benefitId)}
                    </p>
                  </div>
                  <div style={{ background: "white", borderRadius: 8, padding: "18px 20px" }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(42% 0.12 25)", marginBottom: 10, margin: "0 0 10px" }}>
                      {tr("Risk", "Risiko", "Risico")}
                    </p>
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: "oklch(30% 0.06 260)", margin: 0 }}>
                      {tr(hat.riskEn, hat.riskId)}
                    </p>
                  </div>
                </div>

                {/* Faith note */}
                <div style={{ background: `${hat.color}0a`, border: `1px solid ${hat.color}28`, borderRadius: 8, padding: "16px 20px", marginBottom: 24 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: hat.accent, margin: "0 0 8px" }}>
                    {tr("For Faith Communities", "Untuk Komunitas Iman", "Voor Geloofsgemeenschappen")}
                  </p>
                  <p style={{ fontSize: 14, lineHeight: 1.72, color: "oklch(30% 0.06 260)", margin: 0, fontStyle: "italic" }}>
                    {lang === "id" ? hat.faithNoteId : hat.faithNoteEn}
                  </p>
                </div>

                {/* Key Questions */}
                <div style={{ background: "white", borderRadius: 8, padding: "18px 20px" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: hat.accent, margin: "0 0 12px" }}>
                    {tr("Key Questions", "Pertanyaan Utama", "Sleutelvragen")}
                  </p>
                  {(lang === "id" ? hat.questionsId : hat.questionsEn).map(q => (
                    <p key={q} style={{ fontSize: 14, lineHeight: 1.65, color: "oklch(30% 0.06 260)", margin: "0 0 10px", fontStyle: "italic" }}>"{q}"</p>
                  ))}
                </div>

              </div>
            );
          })()}

          {activeHat === null && (
            <div style={{ background: "oklch(94% 0.005 260)", borderRadius: 12, padding: "32px", textAlign: "center", color: "oklch(55% 0.05 260)", fontSize: 15 }}>
              {tr("Select a hat above to explore it.", "Pilih topi di atas untuk menjelajahinya.", "Selecteer een hoed hierboven om deze te verkennen.")}
            </div>
          )}
        </div>
      </section>

      {/* USE CASES */}
      <section style={{ padding: "72px 24px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
          {tr("How to Use the Six Hats", "Cara Menggunakan Enam Topi", "Hoe de Zes Hoeden te Gebruiken")}
        </h2>
        <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", marginBottom: 40, lineHeight: 1.65 }}>
          {tr("Six contexts where the framework creates immediate value.", "Enam konteks di mana kerangka ini menciptakan nilai langsung.", "Zes contexten waar het kader direct waarde creëert.")}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {USE_CASES.map((u, i) => (
            <div key={u.titleEn} style={{ background: "white", borderRadius: 10, padding: "24px", boxShadow: "0 1px 8px oklch(20% 0.06 260 / 0.07)" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 600, color: "oklch(65% 0.15 45)", lineHeight: 1, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, color: "oklch(22% 0.10 260)", margin: "0 0 8px" }}>
                    {tr(u.titleEn, u.titleId)}
                  </h3>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: "oklch(42% 0.06 260)", margin: 0 }}>
                    {tr(u.descEn, u.descId)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          LONG-FORM SEO BACKGROUND
      ════════════════════════════════════════════════════════════ */}
      <div style={{ background: "oklch(88% 0.008 80)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ color: "oklch(65% 0.15 45)", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 12 }}>
            Background
          </p>
          <h2 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: "oklch(22% 0.10 260)", marginBottom: 32, lineHeight: 1.2 }}>
            Six Thinking Hats: What the Research Says About Parallel Thinking, Group Decisions, and Creative Problem-Solving
          </h2>
          <button
            onClick={() => setBgOpen(!bgOpen)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              marginTop: 20, marginBottom: 24, padding: "10px 20px",
              background: "transparent", border: "1.5px solid oklch(65% 0.15 45)",
              color: "oklch(65% 0.15 45)", borderRadius: 12,
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 13, fontWeight: 700,
              cursor: "pointer", letterSpacing: "0.04em",
            }}
          >
            {bgOpen ? "Close ↑" : "Read the research →"}
          </button>
          {bgOpen && [
            "Edward de Bono developed the Six Thinking Hats framework in 1985 as a tool for overcoming the fundamental inefficiency of adversarial thinking in group settings. Most meetings are implicitly structured as debates — positions are taken, defended, and attacked. De Bono's insight was that all thinking could be disaggregated into parallel streams, explored separately, and then integrated — producing better decisions with less interpersonal conflict.",
            "The six hats: White (facts and data), Red (emotions and instincts), Black (critical judgement), Yellow (optimism and value), Green (creativity and new ideas), Blue (process management). Each hat represents not a personality type but a mode of thinking that any person can inhabit deliberately. The key innovation is making the thinking mode explicit and shared.",
            "The research on group decision-making (Janis' groupthink research, Irving Janis 1972) established that cohesive groups under pressure systematically suppress dissent, overestimate consensus, and make worse decisions than structured individual analysis would produce. The Six Thinking Hats method structurally addresses this by making dissent a designated and valued mode (Black Hat) rather than an implicit challenge to group cohesion.",
            "Parallel thinking vs. adversarial thinking: de Bono argued that Western intellectual tradition is fundamentally adversarial — shaped by Socratic dialectic, where truth is pursued by attacking falsehood. Parallel thinking proposes that all thinkers explore the same direction simultaneously, then shift direction together. The research on creativity (Amabile, Osborn) supports this — generating and evaluating ideas in separate phases produces significantly more creative output than simultaneous evaluation.",
            "Cross-cultural applications: in high-context, high-power-distance cultures, adversarial debate is particularly unproductive — public disagreement violates face norms, and subordinates will not openly challenge senior perspectives regardless of the quality of their own thinking. The Six Thinking Hats method creates a structural permission for all modes of thinking to be voiced without personal attribution, which makes it more culturally inclusive than open debate.",
            "The Black Hat in cross-cultural teams: the critical thinking mode (Black Hat) is the mode most suppressed in high-context and collectivist team cultures. Providing an explicit and bounded space for critical thinking — where all team members are simultaneously in critical mode, so criticism is a shared exercise rather than an individual attack — unlocks perspectives that would otherwise remain unspoken.",
            "Creativity research and de Bono: research on divergent thinking (Guilford, Torrance) shows that creativity in groups is systematically inhibited by premature evaluation. The Green Hat creates a designated divergent phase — ideas are generated without critique — that research consistently shows increases both the quantity and quality of creative output.",
            "Decision quality research: research on structured decision processes (Heuer's structured analytic techniques, developed for intelligence analysis) shows that explicit frameworks for disaggregating thinking modes improve decision quality, particularly in complex and uncertain environments. De Bono's framework, applied to leadership decisions, produces similar benefits.",
            "Cross-cultural leadership and structured facilitation: in multicultural team settings, unstructured discussion systematically advantages members from low-context, high-verbal, low-power-distance cultures — those most comfortable speaking freely in group settings. Structured tools like Six Thinking Hats create equity by giving every thinking mode equal airtime and allowing quieter team members to contribute through designated channels.",
            "Implementing Six Thinking Hats in cross-cultural contexts: the most effective implementations adapt the hat sequence to cultural context — not every situation requires all six hats, and the sequence matters. In contexts where critical thinking (Black Hat) is culturally sensitive, positioning it after Yellow Hat (value identification) and before integration reduces the social risk. Cross-cultural facilitators who understand both the tool and the cultural dynamics of their groups use the framework as a structure for equality, not just efficiency.",
          ].map((para, i) => (
            <p key={i} style={{ fontSize: 16, color: "oklch(35% 0.08 260)", lineHeight: 1.85, marginBottom: 20 }}>
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* ── Sources ── */}
      <SourcesDropdown sources={[
        "Edward de Bono — Six Thinking Hats (Little, Brown, 1985) — The original framework; defines all six hat modes and the rationale for parallel thinking.",
        "Geert Hofstede, Gert Jan Hofstede & Michael Minkov — Cultures and Organizations: Software of the Mind (McGraw-Hill, 2010) — Source for national Power Distance Index scores, including Indonesia at 78.",
        "Charlan Nemeth, Keith Brown & John Rogers — \"Devil's Advocate Versus Authentic Dissent\" (European Journal of Social Psychology, 2001) — Demonstrates that structured dissent roles increase the range of perspectives considered in group decisions.",
        "Florian Zenasni & Todd Lubart — \"Creativity and Tolerance of Ambiguity\" and related divergent thinking research (Journal of Creative Behavior, 2008–2018) — Shows that structured conditions for divergent thinking yield higher originality, not just quantity of ideas.",
        "Ignatius of Loyola — Spiritual Exercises (c. 1524) — Source of the consolation/desolation framework used in Ignatian discernment as a tool for decision-making.",
      ]} lang={lang} />

      {/* CTA */}
      <section style={{ background: "oklch(22% 0.10 260)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(96% 0.005 80)", margin: "0 0 16px" }}>
            {tr("Try the Six Hats in Your Next Team Meeting", "Coba Enam Topi di Rapat Tim Berikutnya", "Probeer de Zes Hoeden in Je Volgende Teamvergadering")}
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "oklch(68% 0.04 260)", maxWidth: 500, margin: "0 auto 48px" }}>
            {tr(
              "You don't need a full workshop. Start with one hat, five minutes, and a real question your team is sitting with.",
              "Anda tidak perlu workshop lengkap. Mulai dengan satu topi, lima menit, dan satu pertanyaan nyata yang dihadapi tim.",
              "Je hebt geen volledige workshop nodig. Begin met één hoed, vijf minuten en een echte vraag die je team bezighoudt."
            )}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, textAlign: "left", maxWidth: 520, margin: "0 auto" }}>
            {[
              {
                en: { n: "01", title: "Name the hat out loud", body: "\"I'm putting on my Black Hat.\" That phrase does real work — it separates the concern from the person raising it, which makes honest thinking safe." },
                id: { n: "01", title: "Sebutkan topi dengan lantang", body: "\"Saya memakai Topi Hitam.\" Kalimat itu bekerja nyata — ia memisahkan kekhawatiran dari orang yang menyampaikannya, sehingga berpikir jujur menjadi aman." },
              },
              {
                en: { n: "02", title: "Switch hats when you need to", body: "You're not locked in. If new information surfaces mid-discussion, name it and move. Flexibility is part of the design." },
                id: { n: "02", title: "Ganti topi saat dibutuhkan", body: "Anda tidak terkunci. Jika informasi baru muncul di tengah diskusi, sebutkan dan lanjutkan. Fleksibilitas adalah bagian dari desainnya." },
              },
              {
                en: { n: "03", title: "Use all six — not just your favourites", body: "Teams default to one or two hats and skip the rest. The framework only works when you move through modes that feel uncomfortable too. The Green Hat is exactly as important as the Black." },
                id: { n: "03", title: "Gunakan semua enam — bukan hanya favorit", body: "Tim cenderung hanya menggunakan satu atau dua topi. Kerangka ini hanya bekerja ketika Anda melewati mode yang terasa tidak nyaman juga. Topi Hijau sama pentingnya dengan Topi Hitam." },
              },
              {
                en: { n: "04", title: "Notice your team's default hat", body: "Most people gravitate to one hat naturally — the cautious thinker goes to Black, the visionary to Green or Yellow. Once your team names this, meetings become more self-aware. The facilitator knows whose voice to draw out." },
                id: { n: "04", title: "Perhatikan topi default tim Anda", body: "Kebanyakan orang secara alami condong ke satu topi — pemikir hati-hati ke Hitam, visioner ke Hijau atau Kuning. Begitu tim Anda menamai ini, rapat menjadi lebih sadar diri. Fasilitator tahu suara siapa yang perlu dimunculkan." },
              },
            ].map((tip) => {
              const d = lang === "id" ? tip.id : tip.en;
              return (
                <div key={tip.en.n} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "oklch(28% 0.09 260)", borderRadius: 10, padding: "18px 20px" }}>
                  <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 600, color: "oklch(65% 0.15 45)", lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{d.n}</span>
                  <div>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, color: "oklch(92% 0.005 80)", margin: "0 0 5px" }}>{d.title}</p>
                    <p style={{ fontSize: 13, lineHeight: 1.65, color: "oklch(65% 0.04 260)", margin: 0 }}>{d.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
