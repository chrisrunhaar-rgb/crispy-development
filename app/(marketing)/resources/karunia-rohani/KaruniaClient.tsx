"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { saveKaruniaResult } from "../actions";

type Lang = "en" | "id";

const PRIMARY = "oklch(65% 0.15 45)";
const PRIMARY_DARK = "oklch(42% 0.14 45)";
const BG_DARK = "oklch(22% 0.10 260)";
const BG_LIGHT = "oklch(97% 0.005 80)";
const BORDER = "oklch(88% 0.008 80)";

const KARUNIA_MAP: Record<string, number[]> = {
  melayani:          [1, 20, 39, 58],
  murah_hati:        [2, 21, 40, 59],
  keramahan:         [3, 22, 41, 60],
  bahasa_roh:        [4, 23, 42, 61],
  menyembuhkan:      [5, 24, 43, 62],
  menguatkan:        [6, 25, 44, 63],
  memberi:           [7, 26, 45, 64],
  hikmat:            [8, 27, 46, 65],
  pengetahuan:       [9, 28, 47, 66],
  iman:              [10, 29, 48, 67],
  kerasulan:         [11, 30, 49, 68],
  penginjilan:       [12, 31, 50, 69],
  bernubuat:         [13, 32, 51, 70],
  mengajar:          [14, 33, 52, 71],
  gembala:           [15, 34, 53, 72],
  memimpin:          [16, 35, 54, 73],
  administrasi:      [17, 36, 55, 74],
  mukjizat:          [18, 37, 56, 75],
  tafsir_bahasa_roh: [19, 38, 57, 76],
};

const GIFTS: Record<string, { label: string; en: string; desc: string; descEn: string }> = {
  melayani:          { label: "Melayani",           en: "Serving",                   desc: "Kamu memiliki kemampuan untuk melihat dan memenuhi kebutuhan praktis orang lain dengan sukacita.",                                               descEn: "The ability to see and joyfully meet the practical needs of others." },
  murah_hati:        { label: "Murah Hati",          en: "Mercy",                     desc: "Kamu peka terhadap penderitaan orang lain dan dipanggil untuk hadir bersama mereka dalam kesulitan.",                                            descEn: "Deep sensitivity to the suffering of others, with a calling to be present in their pain." },
  keramahan:         { label: "Keramahan",           en: "Hospitality",               desc: "Kamu memiliki kemampuan untuk membuat orang merasa disambut, aman, dan diperhatikan.",                                                           descEn: "The ability to create environments where people feel genuinely welcomed and safe." },
  bahasa_roh:        { label: "Bahasa Roh",          en: "Tongues",                   desc: "Kamu telah menerima karunia untuk berkomunikasi dalam bahasa rohani yang belum pernah dipelajari.",                                               descEn: "The Spirit-given ability to communicate in a spiritual language not previously learned." },
  menyembuhkan:      { label: "Menyembuhkan",        en: "Healing",                   desc: "Allah memakai doa-doamu sebagai sarana untuk kesembuhan fisik, emosi, atau rohani bagi orang lain.",                                              descEn: "God uses your prayers as a channel for physical, emotional, or spiritual healing." },
  menguatkan:        { label: "Menguatkan",          en: "Exhortation",               desc: "Kamu mampu mendorong, menguatkan, dan membimbing orang lain untuk bertumbuh dan tidak menyerah.",                                                descEn: "The ability to encourage, strengthen, and guide others to grow and not give up." },
  memberi:           { label: "Memberi",             en: "Giving",                    desc: "Kamu dengan senang hati dan sukarela menggunakan sumber daya yang kamu miliki untuk kebutuhan pelayanan.",                                        descEn: "A wholehearted willingness to use personal resources generously for ministry needs." },
  hikmat:            { label: "Hikmat",              en: "Wisdom",                    desc: "Kamu mampu melihat situasi dengan sudut pandang Allah dan memberikan arah yang bijak kepada orang lain.",                                         descEn: "The ability to see situations from God's perspective and give wise, God-centred direction." },
  pengetahuan:       { label: "Pengetahuan",         en: "Knowledge",                 desc: "Kamu menerima pemahaman supranatural tentang firman Allah atau situasi tertentu yang relevan bagi pelayanan.",                                    descEn: "Supernatural understanding of God's word or specific situations relevant to ministry." },
  iman:              { label: "Iman",                en: "Faith",                     desc: "Kamu memiliki keyakinan yang kuat bahwa Allah akan bekerja bahkan dalam situasi yang tampaknya mustahil.",                                        descEn: "An extraordinary conviction that God will act even when circumstances seem impossible." },
  kerasulan:         { label: "Kerasulan",           en: "Apostleship",               desc: "Kamu dipanggil untuk merintis dan mengembangkan pelayanan di wilayah atau konteks budaya yang baru.",                                            descEn: "A calling to pioneer and develop ministry in new regions or cross-cultural contexts." },
  penginjilan:       { label: "Penginjilan",         en: "Evangelism",                desc: "Kamu memiliki kerinduan yang mendalam dan kemampuan untuk membagikan Injil kepada orang yang belum percaya.",                                     descEn: "A deep longing and Spirit-empowered ability to share the Gospel with unbelievers." },
  bernubuat:         { label: "Bernubuat",           en: "Prophecy",                  desc: "Kamu menerima dan menyampaikan pesan dari Allah yang menguatkan, mengingatkan, atau menantang jemaat.",                                           descEn: "Receiving and delivering messages from God that strengthen, warn, or challenge the community." },
  mengajar:          { label: "Mengajar",            en: "Teaching",                  desc: "Kamu mampu menjelaskan kebenaran Alkitab dengan cara yang jelas, menarik, dan mudah dipahami orang lain.",                                        descEn: "The ability to explain biblical truth in a clear, engaging, and understandable way." },
  gembala:           { label: "Gembala",             en: "Shepherding",               desc: "Kamu dipanggil untuk memelihara, membimbing, dan bertanggung jawab atas pertumbuhan rohani sekelompok orang.",                                    descEn: "A calling to nurture, guide, and take responsibility for the spiritual growth of a group." },
  memimpin:          { label: "Memimpin",            en: "Leadership",                desc: "Kamu mampu menggerakkan, menginspirasi, dan membawa orang lain bersama-sama menuju tujuan yang Allah tetapkan.",                                  descEn: "The ability to mobilize, inspire, and unite people toward God-appointed goals." },
  administrasi:      { label: "Administrasi",        en: "Administration",            desc: "Kamu mampu merencanakan, mengorganisasi, dan mengkoordinasikan sumber daya untuk mencapai tujuan pelayanan.",                                     descEn: "The ability to plan, organize, and coordinate resources to achieve ministry goals effectively." },
  mukjizat:          { label: "Mukjizat",            en: "Miracles",                  desc: "Allah menyatakan kuasa-Nya melalui hidupmu dalam cara-cara yang melampaui penjelasan manusia.",                                                   descEn: "God reveals His power through your life in ways that surpass natural explanation." },
  tafsir_bahasa_roh: { label: "Tafsir Bahasa Roh",  en: "Interpretation of Tongues", desc: "Kamu menerima kemampuan untuk menyampaikan makna dari pesan bahasa roh kepada jemaat.",                                                         descEn: "The ability to convey the meaning of tongue messages to the gathered community." },
};

const QUESTIONS: { id: string; en: string }[] = [
  { id: "Aku bisa digambarkan sebagai orang yang berbelas kasih pada orang lain.", en: "I can be described as a compassionate person toward others." },
  { id: "Aku sering menemukan diri berkomunikasi dengan orang yang paling sulit di dalam kelompokku.", en: "I often find myself communicating with the most difficult people in my group." },
  { id: "Aku selalu mengundang orang-orang ke rumahku.", en: "I always invite people to my home." },
  { id: "Aku percaya bahwa aku mempunyai kemampuan supranatural dalam berdoa.", en: "I believe I have a supernatural ability in prayer." },
  { id: "Aku pernah berdoa memohon kesembuhan seseorang, dan orang itu menjadi sembuh.", en: "I have prayed for someone's healing, and that person was healed." },
  { id: "Aku senang mendorong orang-orang yang putus asa agar mereka bisa melihat betapa Allah mengasihi mereka.", en: "I enjoy encouraging discouraged people so they can see how much God loves them." },
  { id: "Aku merasa terpanggil untuk memberikan sebagian besar yang kumiliki demi kebutuhan pelayanan.", en: "I feel called to give most of what I have to ministry needs." },
  { id: "Aku punya kemampuan untuk melihat situasi-situasi sulit dengan sudut pandang Allah.", en: "I have the ability to view difficult situations from God's perspective." },
  { id: "Aku dapat mendengar firman Tuhan secara langsung yang bisa diterapkan pada situasi-situasi tertentu.", en: "I can hear God's word directly and apply it to specific situations." },
  { id: "Aku percaya bahwa hal-hal mustahil menjadi mungkin karena iman.", en: "I believe impossible things become possible through faith." },
  { id: "Aku membaktikan diri untuk memimpin pertumbuhan pelayanan dalam komunitas yang berbeda-beda atau negara lain.", en: "I dedicate myself to leading ministry growth in different communities or other countries." },
  { id: "Aku merasakan kerinduan untuk memberitakan Injil kepada mereka yang belum mengenal Kristus.", en: "I feel a longing to share the Gospel with those who don't know Christ." },
  { id: "Aku mendapat kesan-kesan dari Tuhan tentang situasi-situasi yang terjadi dalam kehidupan orang lain.", en: "I receive impressions from God about situations in other people's lives." },
  { id: "Aku senang mempersiapkan dan menyampaikan pesan-pesan Alkitab.", en: "I enjoy preparing and delivering biblical messages." },
  { id: "Aku merasa bertanggung jawab dan peduli terhadap pertumbuhan spiritual orang lain.", en: "I feel responsible and care about the spiritual growth of others." },
  { id: "Aku suka mengambil tanggung jawab dan memimpin orang-orang supaya tujuan yang ditetapkan oleh Allah bisa tercapai.", en: "I like to take responsibility and lead people so that God's purpose can be achieved." },
  { id: "Aku lebih suka merencanakan, mengorganisasi dan menargetkan sesuatu sebelum memulai sebuah proyek.", en: "I prefer to plan, organise, and set targets before starting a project." },
  { id: "Aku percaya Allah bermaksud untuk memakaiku untuk melakukan mukjizat.", en: "I believe God intends to use me to perform miracles." },
  { id: "Aku merasa bahwa Allah telah menunjukku untuk menafsirkan pesan-pesan yang disampaikan dalam Bahasa Roh.", en: "I feel that God has appointed me to interpret messages spoken in Tongues." },
  { id: "Aku melayani orang lain melalui perbuatan-perbuatan yang sederhana dan praktis.", en: "I serve others through simple and practical deeds." },
  { id: "Aku merasakan kebutuhan untuk memperhatikan orang-orang yang sakit dan yang terluka secara emosi.", en: "I feel the need to care for people who are sick or emotionally wounded." },
  { id: "Aku merasa tidak nyaman ketika orang asing atau pendatang baru tidak mendapatkan sambutan yang baik.", en: "I feel uncomfortable when strangers or newcomers don't receive a warm welcome." },
  { id: "Aku percaya Allah memakaiku untuk berbicara dalam Bahasa Roh.", en: "I believe God uses me to speak in Tongues." },
  { id: "Aku memiliki kerinduan yang mendalam untuk mendoakan orang-orang yang sakit agar mereka menjadi sembuh.", en: "I have a deep longing to pray for sick people so they will be healed." },
  { id: "Aku merasa terdorong untuk memberikan semangat kepada mereka yang kecil hati.", en: "I feel compelled to give encouragement to those who are discouraged." },
  { id: "Aku sering memberikan lebih dari persepuluhan dalam pengeluaran anggaranku.", en: "I often give more than a tithe in my financial budget." },
  { id: "Orang sering meminta nasihatku ketika mereka menghadapi keputusan-keputusan penting.", en: "People often ask for my advice when facing important decisions." },
  { id: "Aku percaya Tuhan memberiku pengetahuan secara supranatural tentang seseorang atau situasi tertentu.", en: "I believe God gives me supernatural knowledge about a person or specific situation." },
  { id: "Aku percaya kepada Allah karena sering mengalami kejadian-kejadian supranatural.", en: "I believe in God because I often experience supernatural events." },
  { id: "Aku merasa nyaman saat berada di antara orang-orang yang berbeda ras, bahasa, dan budaya.", en: "I feel comfortable among people of different races, languages, and cultures." },
  { id: "Aku sering memikirkan cara-cara kreatif untuk menceritakan tentang Yesus kepada orang yang tidak percaya.", en: "I often think of creative ways to tell others about Jesus." },
  { id: "Aku percaya Allah kadang-kadang memakaiku untuk menyampaikan pesan-pesan profetis bagi komunitasku.", en: "I believe God sometimes uses me to deliver prophetic messages to my community." },
  { id: "Aku suka menjelaskan kebenaran-kebenaran alkitabiah dengan cara yang mudah dimengerti orang lain.", en: "I enjoy explaining biblical truths in ways that others can easily understand." },
  { id: "Aku senang membimbing dan memelihara sekelompok orang dalam perjalanan iman mereka.", en: "I enjoy guiding and nurturing a group of people in their faith journey." },
  { id: "Aku bisa menetapkan tujuan dan merencanakan cara paling efektif untuk mencapainya.", en: "I can set goals and plan the most effective way to achieve them." },
  { id: "Aku senang mengatur detail-detail proyek agar berjalan dengan lancar dan efisien.", en: "I enjoy organising project details so they run smoothly and efficiently." },
  { id: "Aku telah menyaksikan kekuatan Allah yang ajaib dalam kehidupan seseorang sebagai jawaban atas doaku.", en: "I have witnessed God's amazing power in someone's life as an answer to my prayer." },
  { id: "Aku pernah menafsirkan pesan bahasa roh dalam sebuah pertemuan ibadah.", en: "I have interpreted a tongue message in a worship gathering." },
  { id: "Aku merasa terpanggil untuk membantu orang lain dalam pekerjaan dan kebutuhan mereka sehari-hari.", en: "I feel called to help others in their work and daily needs." },
  { id: "Aku biasanya meluangkan waktu untuk menunjukkan kepedulian kepada orang yang sedang berduka.", en: "I usually take time to show care to someone who is grieving." },
  { id: "Aku senang membuat orang lain merasa nyaman dan diterima di rumahku atau di lingkunganku.", en: "I enjoy making others feel comfortable and accepted in my home or environment." },
  { id: "Aku pernah berbicara dalam bahasa yang tidak kupelajari ketika sedang berdoa atau beribadah.", en: "I have spoken in a language I did not learn while praying or worshipping." },
  { id: "Aku percaya Allah bermaksud untuk menggunakan doa-doaku untuk menyembuhkan orang yang sakit.", en: "I believe God intends to use my prayers to heal the sick." },
  { id: "Aku senang menolong orang melihat kebaikan Allah dalam situasi sulit yang mereka hadapi.", en: "I enjoy helping people see God's goodness in difficult situations." },
  { id: "Aku dengan senang hati memberikan uang atau waktuku ketika melihat kebutuhan nyata di sekelilingku.", en: "I willingly give my money or time when I see a real need around me." },
  { id: "Aku biasanya dapat memberi saran yang tepat dan berwawasan jauh ketika diminta.", en: "I can usually give accurate and insightful advice when asked." },
  { id: "Aku sering mendapatkan pemahaman baru tentang firman Tuhan yang terasa langsung dari Allah.", en: "I often receive new understanding of God's word that feels directly from Him." },
  { id: "Aku memiliki keyakinan teguh bahwa doa yang sungguh-sungguh dapat mengubah situasi yang tampak mustahil.", en: "I have a firm conviction that sincere prayer can change seemingly impossible situations." },
  { id: "Aku beradaptasi dengan mudah terhadap hal-hal baru.", en: "I adapt easily to new things." },
  { id: "Aku berbagi dengan orang lain saat mereka telah menerima Kristus.", en: "I share with others when they have received Christ." },
  { id: "Aku mendapat pesan penting dari Tuhan.", en: "I receive important messages from God." },
  { id: "Aku mau menghabiskan waktu luang untuk mempelajari prinsip-prinsip alkitabiah agar bisa menjelaskannya kepada orang lain.", en: "I am willing to spend free time studying biblical principles so I can explain them to others." },
  { id: "Aku ingin menjadi pendeta atau gembala jemaat.", en: "I want to become a pastor or shepherd of a congregation." },
  { id: "Aku telah mempengaruhi orang lain untuk menyelesaikan tugas atau menemukan jawaban alkitabiah yang membantu hidup mereka.", en: "I have influenced others to complete tasks or find biblical answers that helped their lives." },
  { id: "Aku senang mempelajari masalah-masalah manajemen dan cara berorganisasi.", en: "I enjoy studying management problems and organisational methods." },
  { id: "Tuhan telah melakukan keajaiban dalam hidupku.", en: "God has performed miracles in my life." },
  { id: "Aku telah menafsirkan bahasa roh sehingga memberkati orang lain.", en: "I have interpreted tongues in a way that blessed others." },
  { id: "Aku tipe orang yang suka menjangkau orang-orang yang tidak beruntung.", en: "I am the type of person who likes to reach out to the less fortunate." },
  { id: "Aku suka mengunjungi rumah peristirahatan dan panti-panti lainnya tempat orang-orang kesepian dan membutuhkan kunjungan.", en: "I like to visit rest homes and other places where lonely people need a visit." },
  { id: "Aku suka menyiapkan makanan dan menyediakan tempat tinggal bagi mereka yang membutuhkan.", en: "I enjoy preparing food and providing shelter for those in need." },
  { id: "Orang lain telah menafsirkan bahasa rohku.", en: "Others have interpreted my tongue message." },
  { id: "Allah menyembuhkan orang lain melalui aku.", en: "God heals others through me." },
  { id: "Aku dikenal karena sering memberi dorongan kepada orang lain.", en: "I am known for often encouraging others." },
  { id: "Aku senang memberikan uangku.", en: "I enjoy giving my money." },
  { id: "Allah telah memberikan kemampuan kepadaku untuk memberi bimbingan dan nasihat kepada orang lain.", en: "God has given me the ability to guide and counsel others." },
  { id: "Aku cenderung memakai wawasan alkitabiah ketika sedang berdiskusi dengan orang lain.", en: "I tend to use biblical insights when discussing with others." },
  { id: "Cukup mudah bagiku untuk berdoa dengan cara yang luar biasa.", en: "It is fairly easy for me to pray in an extraordinary way." },
  { id: "Aku memiliki kerinduan yang mendalam untuk melihat orang-orang di negara lain untuk menjadi pengikut Kristus.", en: "I have a deep longing to see people in other countries become followers of Christ." },
  { id: "Aku selalu memikirkan cara-cara baru supaya aku bisa berbagi dengan teman-teman non Kristen.", en: "I am always thinking of new ways I can share with my non-Christian friends." },
  { id: "Aku ingin menyampaikan firman Allah yang akan menantang orang untuk berubah.", en: "I want to deliver God's word that will challenge people to change." },
  { id: "Allah memakaiku untuk membantu orang lain agar lebih paham makna menjadi orang Kristen.", en: "God uses me to help others better understand what it means to be a Christian." },
  { id: "Aku bisa melihat diriku bertanggung jawab atas perkembangan spiritual orang lain.", en: "I can see myself being responsible for the spiritual development of others." },
  { id: "Saat berada dalam sebuah kelompok, aku biasanya menjadi pemimpin atau mengambil alih kepemimpinan.", en: "When in a group, I usually become the leader or take over leadership." },
  { id: "Meskipun aku cukup mampu melakukan sesuatu sendirian, aku suka mengajak orang lain untuk membantu mengatur pekerjaan kami.", en: "Although capable alone, I prefer to involve others in organising our work." },
  { id: "Aku sudah menyaksikan kekuatan Allah yang ajaib dan dalam melalui hidupku.", en: "I have witnessed the deep and amazing power of God through my life." },
  { id: "Allah memakai karuniaku dalam menafsirkan bahasa roh untuk menyampaikan firman kepada orang lain.", en: "God uses my gift of interpretation of tongues to deliver His word to others." },
];

const TOTAL_QUESTIONS = 76;
const PAGE_SIZE = 10;
const TOTAL_PAGES = Math.ceil(TOTAL_QUESTIONS / PAGE_SIZE);

function computeScores(answers: Record<number, number>): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const [gift, qNums] of Object.entries(KARUNIA_MAP)) {
    scores[gift] = qNums.reduce((sum, n) => sum + (answers[n] ?? 0), 0);
  }
  return scores;
}

function getTopGifts(scores: Record<string, number>): string[] {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const top3Score = sorted[2]?.[1] ?? 0;
  return sorted.filter(([, v]) => v >= top3Score && v > 0).slice(0, 3).map(([k]) => k);
}

interface Props {
  isSaved: boolean;
  karuniaTopGifts: string[] | null;
  karuniaScores: Record<string, number> | null;
}

const GIFT_OVERVIEW_ORDER = [
  "melayani", "murah_hati", "keramahan", "bahasa_roh", "menyembuhkan",
  "menguatkan", "memberi", "hikmat", "pengetahuan", "iman",
  "kerasulan", "penginjilan", "bernubuat", "mengajar", "gembala",
  "memimpin", "administrasi", "mukjizat", "tafsir_bahasa_roh",
];

export default function KaruniaClient({ isSaved, karuniaTopGifts, karuniaScores }: Props) {
  const [lang, setLang] = useState<Lang>("id");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [page, setPage] = useState(0);
  const [showResults, setShowResults] = useState(karuniaTopGifts !== null);
  const [resultScores, setResultScores] = useState<Record<string, number> | null>(karuniaScores);
  const [resultTopGifts, setResultTopGifts] = useState<string[]>(karuniaTopGifts ?? []);
  const [saved, setSaved] = useState(isSaved);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const pageStart = page * PAGE_SIZE + 1;
  const pageEnd = Math.min(pageStart + PAGE_SIZE - 1, TOTAL_QUESTIONS);
  const pageQuestions = Array.from({ length: pageEnd - pageStart + 1 }, (_, i) => pageStart + i);

  const allPageAnswered = pageQuestions.every(n => answers[n] !== undefined);
  const allAnswered = Object.keys(answers).length === TOTAL_QUESTIONS;

  function scrollTop() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  function handleAnswer(qNum: number, val: number) {
    setAnswers(prev => ({ ...prev, [qNum]: val }));
  }

  function handleNext() {
    if (page < TOTAL_PAGES - 1) {
      setPage(p => p + 1);
      scrollTop();
    } else if (allAnswered) {
      const scores = computeScores(answers);
      const topGifts = getTopGifts(scores);
      setResultScores(scores);
      setResultTopGifts(topGifts);
      setShowResults(true);
      scrollTop();
    }
  }

  function handleRetake() {
    setAnswers({});
    setPage(0);
    setShowResults(false);
    setResultScores(null);
    setResultTopGifts([]);
    setSaved(false);
    setSaveError(null);
    scrollTop();
  }

  function handleSave() {
    if (!resultScores || resultTopGifts.length === 0) return;
    startTransition(async () => {
      const { error } = await saveKaruniaResult(resultTopGifts, resultScores);
      if (error) {
        setSaveError(error);
      } else {
        setSaved(true);
      }
    });
  }

  const ratingLabels = lang === "id"
    ? ["Sangat tidak sesuai", "Sedikit sesuai", "Agak sesuai", "Sangat sesuai"]
    : ["Not at all", "Rarely", "Sometimes", "Often"];

  const LangToggle = () => (
    <div style={{ display: "flex", gap: "0", border: `1px solid ${BORDER}`, overflow: "hidden", flexShrink: 0 }}>
      {(["id", "en"] as Lang[]).map(l => (
        <button
          key={l}
          onClick={() => setLang(l)}
          style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "0.4rem 0.75rem",
            background: lang === l ? PRIMARY : "transparent",
            color: lang === l ? "white" : PRIMARY,
            border: "none",
            cursor: "pointer",
            transition: "all 0.12s",
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );

  if (showResults && resultScores) {
    const sortedAll = Object.entries(resultScores).sort((a, b) => b[1] - a[1]);
    const ordinals = ["1.", "2.", "3."];

    return (
      <div style={{ fontFamily: "var(--font-montserrat)" }}>
        <div style={{ background: BG_DARK, padding: "4rem 1.5rem 3rem" }}>
          <div style={{ maxWidth: "720px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "1.5rem" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", color: PRIMARY, textTransform: "uppercase", margin: 0 }}>
                {lang === "id" ? "Hasil Tes" : "Test Results"}
              </p>
              <LangToggle />
            </div>
            <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: "1rem" }}>
              {lang === "id" ? "Karunia Rohani Kamu" : "Your Spiritual Gifts"}
            </h1>
            <p style={{ fontSize: "0.9375rem", color: "oklch(78% 0.008 80)", lineHeight: 1.7, margin: 0 }}>
              {lang === "id"
                ? "Berdasarkan jawabanmu, berikut adalah karunia rohani utama yang Allah berikan kepadamu."
                : "Based on your answers, here are the primary spiritual gifts God has given you."}
            </p>
          </div>
        </div>

        <div style={{ background: BG_LIGHT, padding: "3rem 1.5rem" }}>
          <div style={{ maxWidth: "720px", margin: "0 auto" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "3rem" }}>
              {resultTopGifts.slice(0, 3).map((key, idx) => {
                const gift = GIFTS[key];
                const score = resultScores[key] ?? 0;
                if (!gift) return null;
                return (
                  <div key={key} style={{
                    background: "white",
                    border: `2px solid ${idx === 0 ? PRIMARY : BORDER}`,
                    padding: "1.5rem",
                    display: "flex",
                    gap: "1.25rem",
                    alignItems: "flex-start",
                  }}>
                    <div style={{
                      flexShrink: 0,
                      width: "2.5rem",
                      height: "2.5rem",
                      background: idx === 0 ? PRIMARY : "oklch(92% 0.04 45)",
                      color: idx === 0 ? "white" : PRIMARY,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "1rem",
                    }}>
                      {ordinals[idx]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.375rem" }}>
                        <p style={{ fontWeight: 800, fontSize: "1.0625rem", color: "oklch(18% 0.05 260)", margin: 0 }}>
                          {lang === "id" ? gift.label : gift.en}
                        </p>
                        <p style={{ fontSize: "0.72rem", fontWeight: 700, color: PRIMARY, margin: 0 }}>
                          {score}/12
                        </p>
                      </div>
                      <p style={{ fontSize: "0.8rem", fontWeight: 500, color: "oklch(52% 0.008 260)", marginBottom: "0.5rem" }}>
                        {lang === "id" ? gift.en : gift.label}
                      </p>
                      <p style={{ fontSize: "0.875rem", color: "oklch(38% 0.008 260)", lineHeight: 1.7, margin: 0 }}>
                        {lang === "id" ? gift.desc : gift.descEn}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginBottom: "2.5rem" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", color: "oklch(52% 0.008 260)", textTransform: "uppercase", marginBottom: "1.25rem" }}>
                {lang === "id" ? "Semua Karunia" : "All Gifts"}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {sortedAll.map(([key, score]) => {
                  const gift = GIFTS[key];
                  if (!gift) return null;
                  const pct = Math.round((score / 12) * 100);
                  return (
                    <div key={key}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                        <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "oklch(32% 0.008 260)" }}>
                          {lang === "id" ? gift.label : gift.en}
                        </span>
                        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: PRIMARY }}>{score}/12</span>
                      </div>
                      <div style={{ height: "5px", background: BORDER, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: PRIMARY, transition: "width 0.5s ease" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", marginBottom: "2rem" }}>
              {saved ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", fontWeight: 700, color: PRIMARY }}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {lang === "id" ? "Tersimpan di Dashboard" : "Saved to Dashboard"}
                </div>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={isPending}
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    background: PRIMARY,
                    color: "white",
                    border: "none",
                    padding: "0.65rem 1.375rem",
                    cursor: isPending ? "not-allowed" : "pointer",
                    opacity: isPending ? 0.7 : 1,
                  }}
                >
                  {isPending
                    ? (lang === "id" ? "Menyimpan..." : "Saving...")
                    : (lang === "id" ? "Simpan ke Dashboard →" : "Save to Dashboard →")}
                </button>
              )}
              <button
                onClick={handleRetake}
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  background: "transparent",
                  color: PRIMARY,
                  border: `1px solid ${PRIMARY}`,
                  padding: "0.65rem 1.375rem",
                  cursor: "pointer",
                }}
              >
                {lang === "id" ? "Ulangi Tes" : "Retake Test"}
              </button>
            </div>

            {saveError && (
              <p style={{ fontSize: "0.8rem", color: "oklch(52% 0.18 25)", marginBottom: "1rem" }}>
                Error: {saveError}
              </p>
            )}

            <p style={{ fontSize: "0.72rem", color: "oklch(62% 0.008 260)", lineHeight: 1.6, borderTop: `1px solid ${BORDER}`, paddingTop: "1.5rem" }}>
              {lang === "id"
                ? <>Diadaptasi dari Jim Burns &amp; Doug Fields, &ldquo;The Word on Finding and Using Your Spiritual Gifts&rdquo;</>
                : <>Adapted from Jim Burns &amp; Doug Fields, &ldquo;The Word on Finding and Using Your Spiritual Gifts&rdquo;</>}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const progressPct = Math.round((Object.keys(answers).length / TOTAL_QUESTIONS) * 100);
  const isQuizStarted = Object.keys(answers).length > 0 || page > 0;

  return (
    <div style={{ fontFamily: "var(--font-montserrat)" }}>
      <div style={{ background: BG_DARK, padding: "4rem 1.5rem 3rem" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", color: PRIMARY, textTransform: "uppercase", margin: 0 }}>
              {lang === "id" ? "Assessment · 20 menit" : "Assessment · 20 minutes"}
            </p>
            <LangToggle />
          </div>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: "1rem" }}>
            {lang === "id" ? "Tes Karunia Rohani" : "Spiritual Gifts Test"}
          </h1>
          <p style={{ fontSize: "0.9375rem", color: "oklch(78% 0.008 80)", lineHeight: 1.7, margin: 0 }}>
            {lang === "id"
              ? "Temukan karunia rohani yang Allah berikan kepadamu — dan bagaimana karunia itu bisa dimaksimalkan dalam pelayanan dan kepemimpinan."
              : "Discover the spiritual gifts God has given you — and how they can be maximised in service and leadership."}
          </p>
        </div>
      </div>

      {!isQuizStarted && (
        <div style={{ background: "white", padding: "4rem 1.5rem" }}>
          <div style={{ maxWidth: "720px", margin: "0 auto" }}>
            <div style={{ marginBottom: "3.5rem" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", color: PRIMARY, textTransform: "uppercase", marginBottom: "0.75rem" }}>
                {lang === "id" ? "Mengapa Karunia Rohani?" : "Why Spiritual Gifts?"}
              </p>
              <h2 style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)", fontWeight: 800, color: "oklch(18% 0.05 260)", lineHeight: 1.2, marginBottom: "1.25rem" }}>
                {lang === "id"
                  ? "Setiap orang percaya memiliki karunia. Kebanyakan belum pernah menemukannya."
                  : "Every believer has a gift. Most have never discovered it."}
              </h2>
              <p style={{ fontSize: "0.9375rem", color: "oklch(38% 0.008 260)", lineHeight: 1.8, margin: 0 }}>
                {lang === "id"
                  ? "Perjanjian Baru mengajarkan bahwa setiap pengikut Kristus telah diberikan setidaknya satu karunia rohani — kemampuan yang diberdayakan oleh Roh, dirancang bukan untuk keuntungan pribadi, tetapi untuk membangun Tubuh Kristus dan memajukan Kerajaan-Nya. Namun kebanyakan orang percaya melayani dari kebiasaan atau kewajiban, bukan dari kesadaran mendalam tentang bagaimana Allah secara unik merancang mereka. Penilaian ini membantumu mengidentifikasi bagaimana Allah telah merancangmu untuk melayani — sehingga kamu bisa memimpin dan memberi dengan lebih jelas, sukacita, dan berbuah."
                  : "The New Testament teaches that every follower of Christ has been given at least one spiritual gift — a Spirit-empowered ability designed not for personal gain, but to build up the Body of Christ and advance His Kingdom. Yet most believers serve from habit or obligation rather than from a deep awareness of how God has uniquely wired them. This assessment helps you identify how God has designed you to serve — so you can lead and give with greater clarity, joy, and fruitfulness."}
              </p>
            </div>

            <div>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", color: PRIMARY, textTransform: "uppercase", marginBottom: "1.5rem" }}>
                {lang === "id" ? "19 Karunia yang Diukur" : "19 Gifts Assessed"}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                {GIFT_OVERVIEW_ORDER.map(key => {
                  const gift = GIFTS[key];
                  if (!gift) return null;
                  return (
                    <div key={key} style={{ border: `1px solid ${BORDER}`, padding: "1.125rem 1.25rem", background: BG_LIGHT }}>
                      <p style={{ fontWeight: 800, fontSize: "0.875rem", color: "oklch(18% 0.05 260)", marginBottom: "0.25rem" }}>
                        {lang === "id" ? gift.label : gift.en}
                        <span style={{ fontWeight: 500, color: "oklch(58% 0.008 260)", marginLeft: "0.5rem", fontSize: "0.78rem" }}>
                          {lang === "id" ? gift.en : gift.label}
                        </span>
                      </p>
                      <p style={{ fontSize: "0.8125rem", color: "oklch(45% 0.008 260)", lineHeight: 1.65, margin: 0 }}>
                        {lang === "id" ? gift.desc : gift.descEn}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: BG_LIGHT, padding: "3rem 1.5rem" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "oklch(52% 0.008 260)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {lang === "id" ? `Pernyataan ${pageStart}–${pageEnd} dari ${TOTAL_QUESTIONS}` : `Statements ${pageStart}–${pageEnd} of ${TOTAL_QUESTIONS}`}
              </span>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: PRIMARY }}>
                {progressPct}%
              </span>
            </div>
            <div style={{ height: "4px", background: BORDER, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progressPct}%`, background: PRIMARY, transition: "width 0.3s ease" }} />
            </div>
          </div>

          <div style={{ background: "white", border: `1px solid ${BORDER}`, padding: "0.875rem 1.25rem", marginBottom: "2rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {ratingLabels.map((label, i) => (
              <span key={i} style={{ fontSize: "0.72rem", color: "oklch(52% 0.008 260)", fontWeight: 600 }}>
                <span style={{ fontWeight: 800, color: PRIMARY }}>{i}</span> = {label}
              </span>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2.5rem" }}>
            {pageQuestions.map(qNum => {
              const selected = answers[qNum];
              const q = QUESTIONS[qNum - 1];
              return (
                <div key={qNum} style={{ background: "white", border: `1px solid ${BORDER}`, padding: "1.375rem 1.5rem" }}>
                  <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "oklch(22% 0.005 260)", lineHeight: 1.6, marginBottom: "1rem" }}>
                    <span style={{ color: PRIMARY, fontWeight: 800, marginRight: "0.5rem" }}>{qNum}.</span>
                    {lang === "id" ? q.id : q.en}
                  </p>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {[0, 1, 2, 3].map(val => {
                      const isSelected = selected === val;
                      return (
                        <button
                          key={val}
                          onClick={() => handleAnswer(qNum, val)}
                          style={{
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.875rem",
                            fontWeight: 700,
                            width: "40px",
                            height: "40px",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: isSelected ? PRIMARY : "transparent",
                            color: isSelected ? "white" : PRIMARY,
                            border: `1.5px solid ${isSelected ? PRIMARY : PRIMARY}`,
                            cursor: "pointer",
                            transition: "all 0.12s",
                          }}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
            {page > 0 ? (
              <button
                onClick={() => { setPage(p => p - 1); scrollTop(); }}
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  background: "transparent",
                  color: PRIMARY,
                  border: `1px solid ${PRIMARY}`,
                  padding: "0.65rem 1.375rem",
                  cursor: "pointer",
                }}
              >
                {lang === "id" ? "← Kembali" : "← Back"}
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={handleNext}
              disabled={!allPageAnswered}
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                background: allPageAnswered ? PRIMARY : "oklch(82% 0.04 80)",
                color: "white",
                border: "none",
                padding: "0.65rem 1.5rem",
                cursor: allPageAnswered ? "pointer" : "not-allowed",
                transition: "background 0.15s",
              }}
            >
              {page < TOTAL_PAGES - 1
                ? (lang === "id" ? "Lanjut →" : "Next →")
                : (lang === "id" ? "Lihat Hasil →" : "See Results →")}
            </button>
          </div>

          {!allPageAnswered && (
            <p style={{ fontSize: "0.72rem", color: "oklch(62% 0.008 260)", marginTop: "0.875rem", textAlign: "right" }}>
              {lang === "id"
                ? "Jawab semua pernyataan di halaman ini untuk melanjutkan."
                : "Answer all statements on this page to continue."}
            </p>
          )}

          <p style={{ fontSize: "0.72rem", color: "oklch(72% 0.008 260)", lineHeight: 1.6, borderTop: `1px solid ${BORDER}`, paddingTop: "1.5rem", marginTop: "2.5rem" }}>
            {lang === "id"
              ? <>Diadaptasi dari Jim Burns &amp; Doug Fields, &ldquo;The Word on Finding and Using Your Spiritual Gifts&rdquo;</>
              : <>Adapted from Jim Burns &amp; Doug Fields, &ldquo;The Word on Finding and Using Your Spiritual Gifts&rdquo;</>}
          </p>
        </div>
      </div>
    </div>
  );
}
