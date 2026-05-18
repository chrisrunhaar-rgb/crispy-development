"use client";

import { useState, useTransition } from "react";
import { saveResourceToDashboard, saveFiveLanguagesResult } from "../actions";
import { trackAssessmentCompletion } from "@/lib/ga-events";

// ── TYPES ─────────────────────────────────────────────────────────────────────

type ScoreKey = "A" | "B" | "C" | "D" | "E";
type Scores = { A: number; B: number; C: number; D: number; E: number };
type Pair = { a: ScoreKey; b: ScoreKey; textA: string; textB: string };

// ── LANGUAGE DATA (English) ───────────────────────────────────────────────────

const LANG_DATA: Record<ScoreKey, {
  name: string;
  color: string;
  colorLight: string;
  desc: string;
  notMeans: string;
  crossCultural: string;
  biblical: string;
  biblicalAnchor: string;
}> = {
  A: {
    name: "Words of Affirmation",
    color: "oklch(72% 0.18 85)",
    colorLight: "oklch(96% 0.03 85)",
    desc: "You feel cared for when people speak specific, genuine appreciation. A well-timed sentence can carry you through a hard season. Vague praise lands less than a specific word that shows someone truly saw your work.",
    notMeans: "This does not mean you need constant flattery. You want honesty — a word that is true, specific, and delivered at the moment it matters.",
    crossCultural: "Words of Affirmation lands well in low-context cultures but can feel performative in high-context Asian cultures where indirect communication is the norm. Learn the local vocabulary of appreciation.",
    biblical: "Barnabas means \"Son of Encouragement.\" He vouched for Saul when no one trusted him (Acts 9:27), saw potential in John Mark when Paul wrote him off (Acts 15:36–39), and built confidence in believers across the early church (Acts 11:23). His primary love language was words — spoken at the moment they were most needed, naming what others could not yet see. Words-of-Affirmation leaders learn from Barnabas: a sentence delivered well at the right moment can change a person's whole trajectory.",
    biblicalAnchor: "Barnabas — Acts 9:27",
  },
  B: {
    name: "Quality Time",
    color: "oklch(62% 0.14 235)",
    colorLight: "oklch(95% 0.02 235)",
    desc: "You feel cared for when someone gives you their full, unhurried attention. A distracted hour is worth less than thirty focused minutes. Presence is the currency — being there without checking the phone, without the next meeting already pulling you away.",
    notMeans: "This does not mean you need endless time with people. You need full attention during the time that is given — quality over quantity.",
    crossCultural: "Quality Time looks different where time itself is structured differently. Long unhurried meals are deep care in Indonesia, where the same meeting might feel inefficient in Germany. Learn what 'unhurried' means in each context.",
    biblical: "Jesus could have trained the twelve through teaching alone, but the gospels show him doing something different. He ate with them, walked with them on long roads, slept in the same boat, asked them what they were arguing about, withdrew with the inner circle to mountains and gardens. The training happened through the time. Quality-Time leaders learn from Jesus: presence is the curriculum. A team that has been with you remembers far more than a team that has only been taught by you.",
    biblicalAnchor: "Jesus with the Twelve — Mark 3:14",
  },
  C: {
    name: "Acts of Service",
    color: "oklch(52% 0.14 150)",
    colorLight: "oklch(95% 0.02 150)",
    desc: "You feel cared for when someone does something practical to help you — without being asked. A teammate who notices what you are carrying and steps in without waiting for a request speaks directly to you. The action says: I see you, and I act on it.",
    notMeans: "This does not mean you want people to do your job. You want voluntary, specific service — help that shows awareness of your actual situation, not generic task-taking.",
    crossCultural: "Service done quietly speaks loudly in many cultures but can be misread as overstepping in others. In high-autonomy cultures, ask before acting. In communal cultures, acting without asking is often the highest form of care.",
    biblical: "Acts 9 calls Tabitha a disciple full of good works and acts of charity. She made garments for the widows of Joppa — practical, repeated, unseen service that built the church through the everyday. When she died, the widows showed Peter the clothes she had made. Her gift was visible only in what she had given. Acts-of-Service leaders learn from Tabitha: the work that no one applauds is often the work that holds the church together.",
    biblicalAnchor: "Tabitha (Dorcas) — Acts 9:36",
  },
  D: {
    name: "Tangible Gifts",
    color: "oklch(68% 0.15 10)",
    colorLight: "oklch(96% 0.02 10)",
    desc: "You feel cared for when someone brings you something chosen specifically for you. The value is not the price — it is the evidence that someone thought of you when you were not there. A small token carried back from a trip can land deeper than an expensive generic gift.",
    notMeans: "This does not mean you are materialistic. You read gifts as symbols of attention. A thoughtful, inexpensive gift from someone who knows you is worth more than an expensive one from someone who does not.",
    crossCultural: "Tangible Gifts carry strong meaning in many Asian, African, and Latin American cultures and can feel transactional in Northern European contexts. In some cultures, what you give signals the relationship's value. Learn the local grammar of gift-giving.",
    biblical: "Mary of Bethany broke a jar of pure nard — worth a year's wages — and poured it on Jesus' feet (Mark 14:3–9). The disciples called it waste. Jesus called it beautiful: \"She has done a beautiful thing to me — wherever the gospel is preached in the whole world, what she has done will be told in memory of her.\" The gift was extravagant on purpose. Tangible-Gifts leaders learn from Mary: a thoughtful gift, given at the right moment, carries weight that words cannot.",
    biblicalAnchor: "Mary of Bethany — Mark 14:3",
  },
  E: {
    name: "Appropriate Touch",
    color: "oklch(70% 0.16 65)",
    colorLight: "oklch(95% 0.03 65)",
    desc: "You feel cared for when someone offers appropriate physical warmth — a firm handshake, a hand on the shoulder, a warm greeting. Physical presence communicates what words sometimes cannot: that someone is truly glad you are here.",
    notMeans: "This does not mean all physical contact is welcome. 'Appropriate' is the key word — the form must match the relationship, the gender dynamics, and the cultural context. The substance (human warmth) is constant; the form is not.",
    crossCultural: "Appropriate Touch is the most variable of all five languages across cultures. A side-hug that is normal in Filipino ministry is inappropriate in much of the Middle East. Always read the cultural context before expressing warmth physically. The intention to connect must be matched by cultural fluency.",
    biblical: "The gospels record Jesus touching people repeatedly — the leper no one would touch (Mark 1:41), the children the disciples tried to keep away (Mark 10:13–16), the bier of the widow's son (Luke 7:14), the eyes of the blind men (Matthew 9:29). In a culture with strict purity codes, the touch was scandalous and pastoral at once. Appropriate-Touch leaders learn from Jesus: physical presence is part of how God's care reaches people. In cross-cultural ministry, the form of the touch must adapt — the substance, that human warmth carries divine love, does not.",
    biblicalAnchor: "Jesus — Mark 1:41",
  },
};

// ── LANGUAGE DATA (Indonesian) ────────────────────────────────────────────────

const LANG_DATA_ID: Record<ScoreKey, {
  name: string;
  color: string;
  colorLight: string;
  desc: string;
  notMeans: string;
  crossCultural: string;
  biblical: string;
  biblicalAnchor: string;
}> = {
  A: {
    name: "Kata-Kata Penghargaan",
    color: "oklch(72% 0.18 85)",
    colorLight: "oklch(96% 0.03 85)",
    desc: "Kamu merasa dihargai ketika orang-orang mengucapkan apresiasi yang spesifik dan tulus. Sebuah kalimat yang tepat waktu bisa memampukan kamu melewati musim yang berat. Pujian yang kabur kurang bermakna dibanding kata-kata spesifik yang menunjukkan seseorang benar-benar melihat pekerjaanmu.",
    notMeans: "Ini bukan berarti kamu butuh pujian terus-menerus. Kamu menginginkan kejujuran — kata-kata yang benar, spesifik, dan disampaikan di saat yang tepat.",
    crossCultural: "Kata-Kata Penghargaan mudah diterima dalam budaya low-context, tapi bisa terasa performatif dalam budaya Asia high-context di mana komunikasi tidak langsung adalah norma. Pelajari kosakata apresiasi lokal.",
    biblical: "Barnabas artinya 'Anak Penghiburan.' Ia membela Saulus ketika tidak ada yang mempercayainya (Kisah Para Rasul 9:27), melihat potensi dalam Yohanes Markus ketika Paulus menolaknya (Kisah Para Rasul 15:36–39), dan membangun kepercayaan diri jemaat di seluruh gereja mula-mula (Kisah Para Rasul 11:23). Bahasa kasih utamanya adalah kata-kata — diucapkan di saat yang paling dibutuhkan, menyebut apa yang orang lain belum bisa lihat. Pemimpin Kata-Kata Penghargaan belajar dari Barnabas: sebuah kalimat yang disampaikan dengan baik pada saat yang tepat bisa mengubah seluruh arah hidup seseorang.",
    biblicalAnchor: "Barnabas — Kisah Para Rasul 9:27",
  },
  B: {
    name: "Waktu Berkualitas",
    color: "oklch(62% 0.14 235)",
    colorLight: "oklch(95% 0.02 235)",
    desc: "Kamu merasa dihargai ketika seseorang memberikanmu perhatian penuh yang tidak terburu-buru. Satu jam yang terganggu nilainya lebih rendah dari tiga puluh menit yang fokus. Kehadiran adalah mata uangnya — ada bersamamu tanpa mengecek ponsel, tanpa rapat berikutnya yang sudah menarik perhatian.",
    notMeans: "Ini bukan berarti kamu butuh waktu tanpa batas bersama orang-orang. Kamu butuh perhatian penuh selama waktu yang diberikan — kualitas di atas kuantitas.",
    crossCultural: "Waktu Berkualitas tampak berbeda di tempat di mana waktu itu sendiri terstruktur berbeda. Makan malam panjang yang santai adalah bentuk kasih yang dalam di Indonesia, di mana pertemuan yang sama mungkin terasa tidak efisien di Jerman. Pelajari apa arti 'tidak terburu-buru' di setiap konteks.",
    biblical: "Yesus bisa saja melatih kedua belas murid hanya melalui pengajaran, tapi Injil menunjukkan Ia melakukan sesuatu yang berbeda. Ia makan bersama mereka, berjalan bersama mereka di jalan yang panjang, tidur di perahu yang sama, bertanya apa yang sedang mereka perdebatkan, dan menyingkir bersama lingkaran dalam ke gunung-gunung dan taman-taman. Pelatihan terjadi melalui waktu bersama. Pemimpin Waktu Berkualitas belajar dari Yesus: kehadiran adalah kurikulum. Tim yang telah bersama denganmu jauh lebih banyak mengingat daripada tim yang hanya diajar olehmu.",
    biblicalAnchor: "Yesus bersama Kedua Belas — Markus 3:14",
  },
  C: {
    name: "Tindakan Pelayanan",
    color: "oklch(52% 0.14 150)",
    colorLight: "oklch(95% 0.02 150)",
    desc: "Kamu merasa dihargai ketika seseorang melakukan sesuatu yang praktis untuk membantumu — tanpa diminta. Rekan yang memperhatikan apa yang kamu tanggung dan langsung bertindak tanpa menunggu permintaan berbicara langsung kepadamu. Tindakan itu berkata: Aku melihatmu, dan aku bertindak atasnya.",
    notMeans: "Ini bukan berarti kamu ingin orang mengerjakan tugasmu. Kamu menginginkan pelayanan yang sukarela dan spesifik — bantuan yang menunjukkan kesadaran akan situasimu yang sebenarnya, bukan sekadar mengambil tugas secara umum.",
    crossCultural: "Pelayanan yang dilakukan diam-diam berbicara keras di banyak budaya, tapi bisa disalahartikan sebagai melampaui batas dalam budaya lain. Dalam budaya berorientasi otonomi, tanyakan dulu sebelum bertindak. Dalam budaya komunal, bertindak tanpa bertanya seringkali adalah bentuk kasih tertinggi.",
    biblical: "Kisah Para Rasul 9 menyebut Tabita sebagai seorang murid yang penuh dengan perbuatan baik dan sedekah. Ia membuat jubah-jubah untuk para janda Yopa — pelayanan praktis, berulang, dan tersembunyi yang membangun gereja melalui keseharian. Ketika ia meninggal, para janda menunjukkan kepada Petrus jubah-jubah yang ia buat. Karunianya terlihat hanya dari apa yang telah ia berikan. Pemimpin Tindakan Pelayanan belajar dari Tabita: pekerjaan yang tidak ada yang tepuktangani seringkali adalah pekerjaan yang menopang gereja.",
    biblicalAnchor: "Tabita (Dorkas) — Kisah Para Rasul 9:36",
  },
  D: {
    name: "Hadiah Konkret",
    color: "oklch(68% 0.15 10)",
    colorLight: "oklch(96% 0.02 10)",
    desc: "Kamu merasa dihargai ketika seseorang membawakan sesuatu yang dipilih khusus untukmu. Nilainya bukan harganya — melainkan bukti bahwa seseorang memikirkanmu ketika kamu tidak ada. Sebuah kenang-kenangan kecil yang dibawa dari perjalanan bisa lebih bermakna dari hadiah mahal yang tidak personal.",
    notMeans: "Ini bukan berarti kamu materialistis. Kamu membaca hadiah sebagai simbol perhatian. Hadiah yang penuh pertimbangan namun murah harganya dari seseorang yang mengenalmu jauh lebih berharga dari hadiah mahal dari seseorang yang tidak.",
    crossCultural: "Hadiah Konkret membawa makna kuat dalam banyak budaya Asia, Afrika, dan Amerika Latin, dan bisa terasa transaksional dalam konteks Eropa Utara. Di beberapa budaya, apa yang kamu berikan menandakan nilai hubungannya. Pelajari tata bahasa pemberian hadiah setempat.",
    biblical: "Maria dari Betani memecahkan buli-buli nard murni — senilai upah setahun — dan menuangkannya ke kaki Yesus (Markus 14:3–9). Para murid menyebutnya pemborosan. Yesus menyebutnya indah: 'Ia telah melakukan suatu perbuatan yang indah padaku — di mana pun Injil diberitakan di seluruh dunia, apa yang dilakukannya ini akan disebut-sebut juga untuk mengenang dia.' Hadiah itu dengan sengaja berlebihan. Pemimpin Hadiah Konkret belajar dari Maria: hadiah yang penuh pertimbangan, diberikan pada saat yang tepat, membawa bobot yang tidak bisa dibawa oleh kata-kata.",
    biblicalAnchor: "Maria dari Betani — Markus 14:3",
  },
  E: {
    name: "Sentuhan yang Tepat",
    color: "oklch(70% 0.16 65)",
    colorLight: "oklch(95% 0.03 65)",
    desc: "Kamu merasa dihargai ketika seseorang memberikan kehangatan fisik yang tepat — jabatan tangan yang erat, tangan di bahu, salam yang hangat. Kehadiran fisik mengomunikasikan apa yang terkadang tidak bisa diungkapkan oleh kata-kata: bahwa seseorang benar-benar senang kamu ada di sini.",
    notMeans: "Ini bukan berarti semua kontak fisik itu diterima. 'Tepat' adalah kata kuncinya — bentuknya harus sesuai dengan hubungan, dinamika gender, dan konteks budaya. Substansinya (kehangatan insani) adalah konstan; bentuknya tidak.",
    crossCultural: "Sentuhan yang Tepat adalah yang paling bervariasi dari kelima bahasa ini di berbagai budaya. Pelukan samping yang normal dalam pelayanan di Filipina tidak tepat di sebagian besar Timur Tengah. Selalu baca konteks budaya sebelum mengekspresikan kehangatan secara fisik. Niat untuk terhubung harus disertai kecerdasan budaya.",
    biblical: "Injil mencatat Yesus menyentuh banyak orang — orang kusta yang tidak ada yang mau menyentuhnya (Markus 1:41), anak-anak yang para murid coba jauhkan (Markus 10:13–16), usungan anak janda (Lukas 7:14), mata orang-orang buta (Matius 9:29). Dalam budaya dengan kode kemurnian yang ketat, sentuhan itu sekaligus mengejutkan dan pastoral. Pemimpin Sentuhan yang Tepat belajar dari Yesus: kehadiran fisik adalah bagian dari cara kasih Tuhan menjangkau manusia. Dalam pelayanan lintas budaya, bentuk sentuhannya harus beradaptasi — substansinya, bahwa kehangatan insani membawa kasih ilahi, tidak berubah.",
    biblicalAnchor: "Yesus — Markus 1:41",
  },
};

// ── RECEIVING PAIRS (Test 1 — English) ───────────────────────────────────────

const RECEIVING_PAIRS: Pair[] = [
  { a: "A", b: "B", textA: "It means a lot when my team leader publicly recognises my contribution after a long project.", textB: "It means a lot when my team leader sets aside unhurried time to hear how I am really doing." },
  { a: "A", b: "B", textA: "A handwritten thank-you note from a teammate stays with me for weeks.", textB: "An unhurried meal with a teammate stays with me for weeks." },
  { a: "A", b: "B", textA: "I feel valued when someone says specifically what they appreciate about my work.", textB: "I feel valued when someone gives me their full attention without checking their phone." },
  { a: "A", b: "B", textA: "Hearing a colleague say specifically what they appreciated about my work refreshes me.", textB: "Being given thirty unhurried minutes by a colleague refreshes me." },
  { a: "A", b: "C", textA: "Words of encouragement from a respected leader carry me through hard seasons.", textB: "Practical help with my workload carries me through hard seasons." },
  { a: "A", b: "C", textA: "I feel cared for when my pastor mentions me by name in a prayer of thanks.", textB: "I feel cared for when a teammate quietly does the task I had been dreading." },
  { a: "A", b: "C", textA: "After a difficult Sunday, I want to hear someone say, \"You did well today.\"", textB: "After a difficult Sunday, I want someone to bring me a cup of tea without my asking." },
  { a: "A", b: "C", textA: "Specific words of thanks after a difficult task land deepest.", textB: "Specific practical help after a difficult task lands deepest." },
  { a: "A", b: "D", textA: "A specific verbal commendation from my supervisor means more than a bonus.", textB: "A small thoughtful gift from my supervisor means more than a generic bonus." },
  { a: "A", b: "D", textA: "I keep encouraging emails in a folder I read on hard days.", textB: "I keep small gifts from teammates on my desk as reminders that I am loved." },
  { a: "A", b: "D", textA: "I feel valued when someone takes time to write what they appreciate about me.", textB: "I feel valued when someone brings me back a small token from their travels." },
  { a: "A", b: "D", textA: "I treasure thoughtfully written notes from teammates.", textB: "I treasure small thoughtful items teammates have given me." },
  { a: "A", b: "E", textA: "Words of affirmation from a leader stay in my mind for a long time.", textB: "A warm handshake or culturally-appropriate hand on the shoulder from a leader stays with me for a long time." },
  { a: "A", b: "E", textA: "When I have done well, I want to hear it said clearly.", textB: "When I have done well, I want a high-five or warm pat on the shoulder." },
  { a: "A", b: "E", textA: "I feel encouraged when a colleague tells me they noticed my effort.", textB: "I feel encouraged when a colleague greets me with a warm handshake or culturally-appropriate hug." },
  { a: "A", b: "E", textA: "Public verbal recognition lifts me.", textB: "A genuine handshake or culturally-appropriate hand on the shoulder lifts me." },
  { a: "B", b: "C", textA: "Time alone with a teammate to talk about life refuels me.", textB: "A teammate stepping in to cover my responsibilities refuels me." },
  { a: "B", b: "C", textA: "I feel cared for when my supervisor walks slowly with me to the next meeting.", textB: "I feel cared for when my supervisor sets up the meeting room without my asking." },
  { a: "B", b: "C", textA: "Long conversations with my mentor are what I value most.", textB: "When my mentor takes a difficult task off my plate, I feel valued most." },
  { a: "B", b: "C", textA: "An afternoon walk with a friend talking about life is the best gift.", textB: "An afternoon where a friend handles my tasks while I rest is the best gift." },
  { a: "B", b: "D", textA: "An hour of focused conversation means more to me than any gift.", textB: "A thoughtfully chosen gift means more to me than a rushed conversation." },
  { a: "B", b: "D", textA: "I feel known when my teammate remembers something I said three months ago.", textB: "I feel known when my teammate brings me something they specifically thought of for me." },
  { a: "B", b: "D", textA: "Quality time over coffee changes my week.", textB: "A small surprise on my desk changes my week." },
  { a: "B", b: "D", textA: "I feel cared for when a teammate makes time to listen carefully.", textB: "I feel cared for when a teammate gives me something they specifically chose for me." },
  { a: "B", b: "E", textA: "Sitting quietly with a friend after hard news matters more than words.", textB: "An arm around my shoulder after hard news matters more than words." },
  { a: "B", b: "E", textA: "Long unhurried conversations are how I feel close to my team.", textB: "Warm physical greetings (handshakes, side-hugs) are how I feel close to my team." },
  { a: "B", b: "E", textA: "I feel most loved when someone gives me their unrushed attention.", textB: "I feel most loved when someone offers a warm greeting or hand on the shoulder." },
  { a: "B", b: "E", textA: "Long focused conversation is how I feel close to my mentor.", textB: "A warm greeting or culturally-appropriate hug is how I feel close to my mentor." },
  { a: "C", b: "D", textA: "Acts of practical help mean more to me than most gifts.", textB: "Thoughtful gifts mean more to me than most acts of help." },
  { a: "C", b: "D", textA: "When someone helps me without being asked, I feel deeply seen.", textB: "When someone gives me something specific to my interests, I feel deeply seen." },
  { a: "C", b: "D", textA: "If I am exhausted, what I want most is someone to take a task off me.", textB: "If I am exhausted, what I want most is a small comforting gift." },
  { a: "C", b: "D", textA: "When I am sick, what helps most is a teammate covering my work.", textB: "When I am sick, what helps most is a small comforting gift (food, flowers, a card)." },
  { a: "C", b: "E", textA: "Practical help is the clearest way someone can show they care.", textB: "Appropriate physical warmth (handshake, hand on shoulder, hug) is the clearest way someone can show they care." },
  { a: "C", b: "E", textA: "I feel my pastor cares when he visits and helps with the practical preparations.", textB: "I feel my pastor cares when he greets me warmly with a hand on the shoulder." },
  { a: "C", b: "E", textA: "Service done quietly speaks louder than any other gesture.", textB: "A warm physical greeting speaks louder than most words." },
  { a: "C", b: "E", textA: "Quiet practical help shows me real love.", textB: "Warm physical greeting (handshake, side-hug, hand on shoulder) shows me real love." },
  { a: "D", b: "E", textA: "A small thoughtful gift speaks volumes about how a teammate sees me.", textB: "A warm physical greeting speaks volumes about how a teammate sees me." },
  { a: "D", b: "E", textA: "Bringing me back a small token from a trip means a lot.", textB: "Greeting me with a hug or warm handshake when you return from a trip means a lot." },
  { a: "D", b: "E", textA: "Receiving a thoughtful gift surprises me with joy.", textB: "Receiving a warm physical greeting surprises me with joy." },
  { a: "D", b: "E", textA: "A small gift remembered from a previous conversation is the deepest care.", textB: "A warm hug after a long absence is the deepest care." },
];

// ── RECEIVING PAIRS (Test 1 — Indonesian) ─────────────────────────────────────

const RECEIVING_PAIRS_ID: Pair[] = [
  { a: "A", b: "B", textA: "Sangat berarti bagiku ketika pemimpin tim secara terbuka mengakui kontribusiku setelah proyek panjang.", textB: "Sangat berarti bagiku ketika pemimpin tim menyisihkan waktu tanpa terburu-buru untuk mendengarkan bagaimana keadaanku yang sebenarnya." },
  { a: "A", b: "B", textA: "Sebuah catatan terima kasih tulisan tangan dari rekan tim bertahan lama dalam ingatanku selama berminggu-minggu.", textB: "Makan malam tanpa terburu-buru bersama rekan tim bertahan lama dalam ingatanku selama berminggu-minggu." },
  { a: "A", b: "B", textA: "Aku merasa dihargai ketika seseorang dengan spesifik mengatakan apa yang mereka apresiasi dari pekerjaanku.", textB: "Aku merasa dihargai ketika seseorang memberikanku perhatian penuh tanpa mengecek ponselnya." },
  { a: "A", b: "B", textA: "Mendengar kolega secara spesifik menyebut apa yang mereka hargai dari pekerjaanku menyegarkan aku.", textB: "Diberi tiga puluh menit tanpa terburu-buru oleh seorang kolega menyegarkan aku." },
  { a: "A", b: "C", textA: "Kata-kata dorongan dari pemimpin yang dihormati memampukan aku melewati musim-musim yang berat.", textB: "Bantuan praktis dengan beban kerjaku memampukan aku melewati musim-musim yang berat." },
  { a: "A", b: "C", textA: "Aku merasa diperhatikan ketika pastorlku menyebutku dengan nama dalam doa syukur.", textB: "Aku merasa diperhatikan ketika rekan tim dengan diam-diam mengerjakan tugas yang selama ini aku tunda." },
  { a: "A", b: "C", textA: "Setelah Minggu yang berat, aku ingin mendengar seseorang berkata, 'Kamu melakukannya dengan baik hari ini.'", textB: "Setelah Minggu yang berat, aku ingin seseorang membawakan secangkir teh tanpa aku memintanya." },
  { a: "A", b: "C", textA: "Kata-kata terima kasih yang spesifik setelah tugas yang berat paling mengena bagiku.", textB: "Bantuan praktis yang spesifik setelah tugas yang berat paling mengena bagiku." },
  { a: "A", b: "D", textA: "Pengakuan verbal yang spesifik dari atasanku lebih berarti bagiku dari sebuah bonus.", textB: "Hadiah kecil yang penuh pertimbangan dari atasanku lebih berarti dari bonus yang tidak personal." },
  { a: "A", b: "D", textA: "Aku menyimpan email-email penuh semangat dalam folder yang aku baca di hari-hari yang berat.", textB: "Aku menyimpan hadiah-hadiah kecil dari rekan tim di mejaku sebagai pengingat bahwa aku dikasihi." },
  { a: "A", b: "D", textA: "Aku merasa dihargai ketika seseorang meluangkan waktu untuk menulis apa yang mereka apresiasi tentang aku.", textB: "Aku merasa dihargai ketika seseorang membawakan oleh-oleh kecil dari perjalanan mereka." },
  { a: "A", b: "D", textA: "Aku sangat menghargai catatan-catatan penuh pemikiran dari rekan tim.", textB: "Aku sangat menghargai benda-benda kecil yang penuh pemikiran dari rekan tim." },
  { a: "A", b: "E", textA: "Kata-kata afirmasi dari seorang pemimpin bertahan lama dalam pikiranku.", textB: "Jabatan tangan yang hangat atau tangan di bahu yang tepat secara budaya dari seorang pemimpin bertahan lama dalam ingatanku." },
  { a: "A", b: "E", textA: "Ketika aku telah melakukan sesuatu dengan baik, aku ingin hal itu diungkapkan dengan jelas.", textB: "Ketika aku telah melakukan sesuatu dengan baik, aku ingin sebuah tos atau tepukan hangat di bahu." },
  { a: "A", b: "E", textA: "Aku merasa tersemangati ketika seorang kolega memberi tahu bahwa mereka memperhatikan usahaku.", textB: "Aku merasa tersemangati ketika seorang kolega menyambutku dengan jabatan tangan hangat atau pelukan yang tepat secara budaya." },
  { a: "A", b: "E", textA: "Pengakuan verbal di depan umum mengangkat semangatku.", textB: "Jabatan tangan yang tulus atau tangan di bahu yang tepat secara budaya mengangkat semangatku." },
  { a: "B", b: "C", textA: "Waktu berdua dengan rekan tim untuk membicarakan kehidupan mengisi ulang aku.", textB: "Rekan tim yang masuk untuk menanggung tanggung jawabku mengisi ulang aku." },
  { a: "B", b: "C", textA: "Aku merasa diperhatikan ketika atasanku berjalan santai bersamaku ke rapat berikutnya.", textB: "Aku merasa diperhatikan ketika atasanku mempersiapkan ruang rapat tanpa aku minta." },
  { a: "B", b: "C", textA: "Percakapan panjang bersama mentorku adalah yang paling aku hargai.", textB: "Ketika mentorku mengambil alih tugas yang berat dari bahuku, aku paling merasa dihargai." },
  { a: "B", b: "C", textA: "Sore hari berjalan kaki bersama teman sambil membicarakan kehidupan adalah hadiah terbaik.", textB: "Sore hari di mana teman menangani tugas-tugasku sementara aku beristirahat adalah hadiah terbaik." },
  { a: "B", b: "D", textA: "Satu jam percakapan yang fokus lebih berarti bagiku dari hadiah apapun.", textB: "Hadiah yang dipilih dengan penuh pertimbangan lebih berarti bagiku dari percakapan yang terburu-buru." },
  { a: "B", b: "D", textA: "Aku merasa dikenal ketika rekan timku mengingat sesuatu yang aku katakan tiga bulan lalu.", textB: "Aku merasa dikenal ketika rekan timku membawa sesuatu yang mereka pikirkan khusus untukku." },
  { a: "B", b: "D", textA: "Ngopi yang berkualitas mengubah minggu aku.", textB: "Kejutan kecil di mejaku mengubah minggu aku." },
  { a: "B", b: "D", textA: "Aku merasa diperhatikan ketika rekan tim meluangkan waktu untuk mendengarkan dengan seksama.", textB: "Aku merasa diperhatikan ketika rekan tim memberikan sesuatu yang mereka pilih khusus untukku." },
  { a: "B", b: "E", textA: "Duduk dengan tenang bersama teman setelah kabar buruk lebih berarti dari kata-kata.", textB: "Lengan di bahuku setelah kabar buruk lebih berarti dari kata-kata." },
  { a: "B", b: "E", textA: "Percakapan panjang yang santai adalah cara aku merasa dekat dengan tim.", textB: "Salam fisik yang hangat (jabatan tangan, pelukan samping) adalah cara aku merasa dekat dengan tim." },
  { a: "B", b: "E", textA: "Aku paling merasa dikasihi ketika seseorang memberiku perhatian yang tidak terburu-buru.", textB: "Aku paling merasa dikasihi ketika seseorang menawarkan salam yang hangat atau tangan di bahuku." },
  { a: "B", b: "E", textA: "Percakapan fokus yang panjang adalah cara aku merasa dekat dengan mentorku.", textB: "Salam hangat atau pelukan yang tepat secara budaya adalah cara aku merasa dekat dengan mentorku." },
  { a: "C", b: "D", textA: "Bantuan tindakan praktis lebih berarti bagiku dari kebanyakan hadiah.", textB: "Hadiah yang penuh pemikiran lebih berarti bagiku dari kebanyakan tindakan bantuan." },
  { a: "C", b: "D", textA: "Ketika seseorang membantu tanpa diminta, aku merasa benar-benar dilihat.", textB: "Ketika seseorang memberiku sesuatu yang spesifik sesuai minatku, aku merasa benar-benar dilihat." },
  { a: "C", b: "D", textA: "Jika aku kelelahan, yang paling aku inginkan adalah seseorang mengambil satu tugas dariku.", textB: "Jika aku kelelahan, yang paling aku inginkan adalah hadiah kecil yang menenangkan." },
  { a: "C", b: "D", textA: "Ketika aku sakit, yang paling membantu adalah rekan tim yang menanggung pekerjaanku.", textB: "Ketika aku sakit, yang paling membantu adalah hadiah kecil yang menenangkan (makanan, bunga, kartu)." },
  { a: "C", b: "E", textA: "Bantuan praktis adalah cara paling jelas seseorang menunjukkan kepedulian.", textB: "Kehangatan fisik yang tepat (jabatan tangan, tangan di bahu, pelukan) adalah cara paling jelas seseorang menunjukkan kepedulian." },
  { a: "C", b: "E", textA: "Aku merasa pastorlku peduli ketika ia datang berkunjung dan membantu persiapan-persiapan praktis.", textB: "Aku merasa pastorlku peduli ketika ia menyambutku dengan hangat, tangan di bahu." },
  { a: "C", b: "E", textA: "Pelayanan yang dilakukan diam-diam berbicara lebih keras dari gerak-gerik lainnya.", textB: "Salam fisik yang hangat berbicara lebih keras dari kebanyakan kata-kata." },
  { a: "C", b: "E", textA: "Bantuan praktis yang diam-diam menunjukkan kasih yang nyata kepadaku.", textB: "Salam fisik yang hangat (jabatan tangan, pelukan samping, tangan di bahu) menunjukkan kasih yang nyata kepadaku." },
  { a: "D", b: "E", textA: "Hadiah kecil yang penuh pemikiran mengatakan banyak hal tentang bagaimana rekan timku melihat aku.", textB: "Salam fisik yang hangat mengatakan banyak hal tentang bagaimana rekan timku melihat aku." },
  { a: "D", b: "E", textA: "Membawakan aku oleh-oleh kecil dari perjalanan sangat berarti.", textB: "Menyambutku dengan pelukan atau jabatan tangan hangat setelah pulang dari perjalanan sangat berarti." },
  { a: "D", b: "E", textA: "Menerima hadiah yang penuh pemikiran mengejutkanku dengan sukacita.", textB: "Menerima salam fisik yang hangat mengejutkanku dengan sukacita." },
  { a: "D", b: "E", textA: "Hadiah kecil yang diingat dari percakapan sebelumnya adalah kepedulian yang paling dalam.", textB: "Pelukan hangat setelah lama tidak bertemu adalah kepedulian yang paling dalam." },
];

// ── GIVING PAIRS (Test 2 — English) ──────────────────────────────────────────

const GIVING_PAIRS: Pair[] = [
  { a: "A", b: "B", textA: "When a teammate has done well, I send them a specific written affirmation.", textB: "When a teammate has done well, I take them out for an unhurried meal." },
  { a: "A", b: "B", textA: "My first instinct when someone is discouraged is to speak words of encouragement.", textB: "My first instinct when someone is discouraged is to sit with them and listen." },
  { a: "A", b: "B", textA: "I show appreciation by saying specifically what I value about a person.", textB: "I show appreciation by clearing my schedule to spend time with them." },
  { a: "A", b: "B", textA: "I check in with teammates by sending an encouraging message.", textB: "I check in with teammates by setting up a coffee meeting." },
  { a: "A", b: "C", textA: "When a colleague is struggling, I write them a specific note of encouragement.", textB: "When a colleague is struggling, I take a task off their plate without being asked." },
  { a: "A", b: "C", textA: "My way to thank someone is words.", textB: "My way to thank someone is action." },
  { a: "A", b: "C", textA: "When I want to encourage a junior team member, I tell them specifically what I see in them.", textB: "When I want to encourage a junior team member, I make their work easier in a practical way." },
  { a: "A", b: "C", textA: "I express my appreciation through carefully chosen words.", textB: "I express my appreciation through carefully chosen acts." },
  { a: "A", b: "D", textA: "I express care through carefully chosen words.", textB: "I express care through carefully chosen gifts." },
  { a: "A", b: "D", textA: "On a teammate's birthday, I write them a heartfelt message.", textB: "On a teammate's birthday, I bring them something I know they will love." },
  { a: "A", b: "D", textA: "When I want to bless someone, my first thought is what to say.", textB: "When I want to bless someone, my first thought is what to give." },
  { a: "A", b: "D", textA: "When I want to honour a teammate publicly, I speak about what they have contributed.", textB: "When I want to honour a teammate publicly, I give them something meaningful." },
  { a: "A", b: "E", textA: "I greet teammates with verbal warmth — naming them, asking how they are.", textB: "I greet teammates with physical warmth — handshake, hand on shoulder, culturally-appropriate hug." },
  { a: "A", b: "E", textA: "When a teammate has had a hard week, I tell them I am proud of them.", textB: "When a teammate has had a hard week, I greet them with a warm physical gesture." },
  { a: "A", b: "E", textA: "After a meaningful conversation I say what I appreciated about it.", textB: "After a meaningful conversation I express warmth physically (handshake, pat on the back)." },
  { a: "A", b: "E", textA: "My natural way to greet someone I respect is to name what I appreciate about them.", textB: "My natural way to greet someone I respect is a warm handshake or culturally-appropriate hug." },
  { a: "B", b: "C", textA: "I show care by giving someone my full unhurried attention.", textB: "I show care by quietly doing something that helps them." },
  { a: "B", b: "C", textA: "I prioritise long unhurried meetings with my team.", textB: "I prioritise removing obstacles from my team's work." },
  { a: "B", b: "C", textA: "When a teammate is struggling, I make time to be present with them.", textB: "When a teammate is struggling, I make their work easier in practical ways." },
  { a: "B", b: "C", textA: "I am the person who makes time for the team member who needs to talk.", textB: "I am the person who quietly handles what needs to be done." },
  { a: "B", b: "D", textA: "When I want to honour someone, I clear my calendar for them.", textB: "When I want to honour someone, I bring them a thoughtful gift." },
  { a: "B", b: "D", textA: "I express care through unhurried presence.", textB: "I express care through thoughtful gifts." },
  { a: "B", b: "D", textA: "On a teammate's anniversary, I take them for an extended coffee.", textB: "On a teammate's anniversary, I give them something meaningful." },
  { a: "B", b: "D", textA: "I tell teammates I love them by being present with them.", textB: "I tell teammates I love them by giving them something meaningful." },
  { a: "B", b: "E", textA: "I sit with people in their silence.", textB: "I greet people with warmth in my body — a hand on the shoulder, a hug, a firm handshake." },
  { a: "B", b: "E", textA: "When someone is grieving, I sit with them quietly.", textB: "When someone is grieving, I put my arm around them." },
  { a: "B", b: "E", textA: "I express friendship through long conversations.", textB: "I express friendship through warm physical greeting." },
  { a: "B", b: "E", textA: "I make time for slow conversations.", textB: "I make time for warm physical greeting." },
  { a: "C", b: "D", textA: "I show love by doing things for people.", textB: "I show love by giving things to people." },
  { a: "C", b: "D", textA: "When I want to bless someone, I find a practical way to help them.", textB: "When I want to bless someone, I find a meaningful gift to give them." },
  { a: "C", b: "D", textA: "After a teammate's hard week, I bring them a meal I cooked.", textB: "After a teammate's hard week, I bring them a small thoughtful gift." },
  { a: "C", b: "D", textA: "I demonstrate love by serving.", textB: "I demonstrate love by giving." },
  { a: "C", b: "E", textA: "I show care through practical action.", textB: "I show care through warm physical presence." },
  { a: "C", b: "E", textA: "When a teammate needs encouragement, I quietly help with their work.", textB: "When a teammate needs encouragement, I greet them with warm physical gesture." },
  { a: "C", b: "E", textA: "I prefer to express love by doing.", textB: "I prefer to express love by being physically warm and present." },
  { a: "C", b: "E", textA: "I show care by stepping in to help when no one asks.", textB: "I show care by warm physical presence and greeting." },
  { a: "D", b: "E", textA: "I bring small thoughtful gifts when I see teammates after time apart.", textB: "I greet teammates with warm physical gesture when I see them after time apart." },
  { a: "D", b: "E", textA: "I tend to show care by giving something tangible.", textB: "I tend to show care by warm physical greeting." },
  { a: "D", b: "E", textA: "When honouring someone, I give them something specific.", textB: "When honouring someone, I greet them with culturally-appropriate physical warmth." },
  { a: "D", b: "E", textA: "I love through giving thoughtful gifts.", textB: "I love through physical warmth and welcoming presence." },
];

// ── GIVING PAIRS (Test 2 — Indonesian) ───────────────────────────────────────

const GIVING_PAIRS_ID: Pair[] = [
  { a: "A", b: "B", textA: "Ketika rekan tim telah melakukan sesuatu dengan baik, aku mengirimkan afirmasi tertulis yang spesifik.", textB: "Ketika rekan tim telah melakukan sesuatu dengan baik, aku mengajak mereka makan tanpa terburu-buru." },
  { a: "A", b: "B", textA: "Naluri pertamaku ketika seseorang putus asa adalah mengucapkan kata-kata semangat.", textB: "Naluri pertamaku ketika seseorang putus asa adalah duduk bersama mereka dan mendengarkan." },
  { a: "A", b: "B", textA: "Aku menunjukkan apresiasi dengan mengatakan secara spesifik apa yang aku hargai dari seseorang.", textB: "Aku menunjukkan apresiasi dengan meluangkan jadwalku untuk menghabiskan waktu bersama mereka." },
  { a: "A", b: "B", textA: "Aku check-in dengan rekan tim dengan mengirimkan pesan yang menyemangati.", textB: "Aku check-in dengan rekan tim dengan membuat janji ngopi bersama." },
  { a: "A", b: "C", textA: "Ketika kolega sedang berjuang, aku menuliskan catatan dorongan yang spesifik untuknya.", textB: "Ketika kolega sedang berjuang, aku mengambil alih satu tugasnya tanpa diminta." },
  { a: "A", b: "C", textA: "Cara aku berterima kasih kepada seseorang adalah dengan kata-kata.", textB: "Cara aku berterima kasih kepada seseorang adalah dengan tindakan." },
  { a: "A", b: "C", textA: "Ketika aku ingin mendorong anggota tim junior, aku memberitahu secara spesifik apa yang aku lihat dalam diri mereka.", textB: "Ketika aku ingin mendorong anggota tim junior, aku memudahkan pekerjaan mereka secara praktis." },
  { a: "A", b: "C", textA: "Aku mengekspresikan apresiasiaku melalui kata-kata yang dipilih dengan hati-hati.", textB: "Aku mengekspresikan apresiasiaku melalui tindakan yang dipilih dengan hati-hati." },
  { a: "A", b: "D", textA: "Aku mengekspresikan kepedulian melalui kata-kata yang dipilih dengan hati-hati.", textB: "Aku mengekspresikan kepedulian melalui hadiah yang dipilih dengan hati-hati." },
  { a: "A", b: "D", textA: "Di hari ulang tahun rekan tim, aku menulis pesan yang tulus untuknya.", textB: "Di hari ulang tahun rekan tim, aku membawakan sesuatu yang aku tahu akan ia sukai." },
  { a: "A", b: "D", textA: "Ketika aku ingin memberkati seseorang, pikiran pertamaku adalah apa yang harus aku katakan.", textB: "Ketika aku ingin memberkati seseorang, pikiran pertamaku adalah apa yang harus aku berikan." },
  { a: "A", b: "D", textA: "Ketika aku ingin menghormati rekan tim di depan umum, aku berbicara tentang apa yang telah mereka kontribusikan.", textB: "Ketika aku ingin menghormati rekan tim di depan umum, aku memberikan sesuatu yang bermakna kepada mereka." },
  { a: "A", b: "E", textA: "Aku menyapa rekan tim dengan kehangatan verbal — menyebut namanya, menanyakan keadaannya.", textB: "Aku menyapa rekan tim dengan kehangatan fisik — jabatan tangan, tangan di bahu, pelukan yang tepat secara budaya." },
  { a: "A", b: "E", textA: "Ketika rekan tim melewati minggu yang berat, aku memberitahunya bahwa aku bangga padanya.", textB: "Ketika rekan tim melewati minggu yang berat, aku menyambutnya dengan gerakan fisik yang hangat." },
  { a: "A", b: "E", textA: "Setelah percakapan yang bermakna aku mengatakan apa yang aku hargai dari percakapan itu.", textB: "Setelah percakapan yang bermakna aku mengekspresikan kehangatan secara fisik (jabatan tangan, tepukan di punggung)." },
  { a: "A", b: "E", textA: "Cara alami aku menyapa seseorang yang aku hormati adalah dengan menyebutkan apa yang aku apresiasi dari mereka.", textB: "Cara alami aku menyapa seseorang yang aku hormati adalah dengan jabatan tangan yang hangat atau pelukan yang tepat secara budaya." },
  { a: "B", b: "C", textA: "Aku menunjukkan kepedulian dengan memberikan perhatian penuh yang tidak terburu-buru kepada seseorang.", textB: "Aku menunjukkan kepedulian dengan diam-diam melakukan sesuatu yang membantu mereka." },
  { a: "B", b: "C", textA: "Aku memprioritaskan pertemuan panjang yang santai bersama timku.", textB: "Aku memprioritaskan menghilangkan hambatan dari pekerjaan timku." },
  { a: "B", b: "C", textA: "Ketika rekan tim sedang berjuang, aku meluangkan waktu untuk hadir bersamanya.", textB: "Ketika rekan tim sedang berjuang, aku memudahkan pekerjaannya dengan cara-cara praktis." },
  { a: "B", b: "C", textA: "Aku adalah orang yang meluangkan waktu untuk anggota tim yang butuh didengarkan.", textB: "Aku adalah orang yang diam-diam menangani apa yang perlu dilakukan." },
  { a: "B", b: "D", textA: "Ketika aku ingin menghormati seseorang, aku mengosongkan kalenderku untuk mereka.", textB: "Ketika aku ingin menghormati seseorang, aku membawakan hadiah yang penuh pemikiran." },
  { a: "B", b: "D", textA: "Aku mengekspresikan kepedulian melalui kehadiran yang tidak terburu-buru.", textB: "Aku mengekspresikan kepedulian melalui hadiah yang penuh pemikiran." },
  { a: "B", b: "D", textA: "Di ulang tahun kerja rekan tim, aku mengajaknya ngopi yang diperpanjang.", textB: "Di ulang tahun kerja rekan tim, aku memberikan sesuatu yang bermakna." },
  { a: "B", b: "D", textA: "Aku memberitahu rekan tim bahwa aku mengasihi mereka dengan hadir bersama mereka.", textB: "Aku memberitahu rekan tim bahwa aku mengasihi mereka dengan memberikan sesuatu yang bermakna." },
  { a: "B", b: "E", textA: "Aku duduk bersama orang-orang dalam keheningan mereka.", textB: "Aku menyapa orang-orang dengan kehangatan dalam tubuhku — tangan di bahu, pelukan, jabatan tangan yang erat." },
  { a: "B", b: "E", textA: "Ketika seseorang berduka, aku duduk dengan tenang bersamanya.", textB: "Ketika seseorang berduka, aku merangkul bahunya." },
  { a: "B", b: "E", textA: "Aku mengekspresikan persahabatan melalui percakapan yang panjang.", textB: "Aku mengekspresikan persahabatan melalui salam fisik yang hangat." },
  { a: "B", b: "E", textA: "Aku meluangkan waktu untuk percakapan yang santai.", textB: "Aku meluangkan waktu untuk salam fisik yang hangat." },
  { a: "C", b: "D", textA: "Aku menunjukkan kasih dengan melakukan sesuatu untuk orang-orang.", textB: "Aku menunjukkan kasih dengan memberikan sesuatu kepada orang-orang." },
  { a: "C", b: "D", textA: "Ketika aku ingin memberkati seseorang, aku mencari cara praktis untuk membantunya.", textB: "Ketika aku ingin memberkati seseorang, aku mencari hadiah yang bermakna untuk diberikan." },
  { a: "C", b: "D", textA: "Setelah minggu yang berat bagi rekan tim, aku membawakan makanan yang sudah aku masak.", textB: "Setelah minggu yang berat bagi rekan tim, aku membawakan hadiah kecil yang penuh pemikiran." },
  { a: "C", b: "D", textA: "Aku mendemonstrasikan kasih dengan melayani.", textB: "Aku mendemonstrasikan kasih dengan memberi." },
  { a: "C", b: "E", textA: "Aku menunjukkan kepedulian melalui tindakan praktis.", textB: "Aku menunjukkan kepedulian melalui kehadiran fisik yang hangat." },
  { a: "C", b: "E", textA: "Ketika rekan tim butuh dorongan, aku diam-diam membantu pekerjaannya.", textB: "Ketika rekan tim butuh dorongan, aku menyambutnya dengan gerakan fisik yang hangat." },
  { a: "C", b: "E", textA: "Aku lebih suka mengekspresikan kasih dengan berbuat.", textB: "Aku lebih suka mengekspresikan kasih dengan hadir secara fisik yang hangat." },
  { a: "C", b: "E", textA: "Aku menunjukkan kepedulian dengan masuk membantu ketika tidak ada yang meminta.", textB: "Aku menunjukkan kepedulian dengan kehadiran fisik yang hangat dalam salam." },
  { a: "D", b: "E", textA: "Aku membawa hadiah-hadiah kecil yang penuh pemikiran ketika bertemu rekan tim setelah lama tidak bertemu.", textB: "Aku menyapa rekan tim dengan gerakan fisik yang hangat ketika bertemu setelah lama tidak bertemu." },
  { a: "D", b: "E", textA: "Aku cenderung menunjukkan kepedulian dengan memberikan sesuatu yang nyata.", textB: "Aku cenderung menunjukkan kepedulian dengan salam fisik yang hangat." },
  { a: "D", b: "E", textA: "Ketika menghormati seseorang, aku memberikan sesuatu yang spesifik.", textB: "Ketika menghormati seseorang, aku menyambutnya dengan kehangatan fisik yang tepat secara budaya." },
  { a: "D", b: "E", textA: "Aku mengasihi melalui hadiah yang penuh pemikiran.", textB: "Aku mengasihi melalui kehangatan fisik dan kehadiran yang menyambut." },
];

// ── SCORING HELPERS ───────────────────────────────────────────────────────────

function getPrimary(scores: Scores): ScoreKey {
  return (Object.entries(scores) as [ScoreKey, number][])
    .sort((a, b) => b[1] - a[1])[0][0];
}

function isFlat(scores: Scores): boolean {
  const vals = Object.values(scores).sort((a, b) => b - a);
  return vals[0] <= 10 || (vals[0] - vals[1]) <= 2;
}

function getInterpretation(
  rPrimary: ScoreKey,
  gPrimary: ScoreKey,
  rFlat: boolean,
  gFlat: boolean,
  LD: typeof LANG_DATA,
  lang: "en" | "id"
): { label: string; labelColor: string; text: string; action: string } {
  if (rFlat && gFlat) return {
    label: lang === "id" ? "Keduanya Luas" : "Both Broad",
    labelColor: "oklch(60% 0.08 200)",
    text: lang === "id"
      ? "Kamu mendapat skor merata di berbagai bahasa dalam kedua tes. Kepekaan adalah luas — tidak ada satu bahasa yang mendominasi. Ini jarang tapi sah."
      : "You scored evenly across multiple languages in both tests. Your sensitivity is broad — no single language dominates. This is rare but legitimate.",
    action: lang === "id"
      ? "Sebutkan dua bahasa teratasmu di setiap tes dan beritahu tim bahwa keduanya mendarat baik untukmu."
      : "Name your top two languages in each test and tell your team that either lands well for you.",
  };
  if (rPrimary === gPrimary) return {
    label: lang === "id" ? "Cocok" : "Match",
    labelColor: "oklch(52% 0.14 150)",
    text: lang === "id"
      ? "Bahasa menerima dan memberimu cocok. Kamu memberikan apa yang paling kamu butuhkan, dan kamu tahu cara menyampaikannya. Risikonya: kamu mungkin mengasumsikan orang lain menginginkan apa yang kamu inginkan."
      : "Your receiving and giving primaries match. You give what you most need, and you know how to deliver it. The risk: you may assume others want what you want.",
    action: lang === "id"
      ? "Tanyakan kepada setiap anggota tim bahasa menerima mereka. Catat. Jadikan referensi sebelum setiap momen kepedulian."
      : "Ask each team member their receiving language. Write it down. Refer to the list before any care moment.",
  };
  return {
    label: lang === "id" ? "Dua Bahasa" : "Two Languages",
    labelColor: "oklch(62% 0.14 235)",
    text: lang === "id"
      ? "Bahasa menerima dan memberimu berbeda — pola yang paling mengungkapkan. Kamu membawa kemampuan alami dalam dua bahasa: bagaimana kamu terhubung untuk menerima kepedulian, dan bagaimana kamu terhubung untuk memberikannya. Risikonya: timmu mungkin tidak tahu apa yang kamu butuhkan secara pribadi."
      : "Your receiving and giving languages differ — the most insightful pattern. You carry natural fluency in two languages: how you are wired to receive care, and how you are wired to give it. The risk: your team may not know what you personally need.",
    action: lang === "id"
      ? `Beritahu timmu kedua bahasa dengan lantang: "Apa yang membuat aku merasa diperhatikan adalah ${LD[rPrimary].name}. Yang paling alami aku berikan adalah ${LD[gPrimary].name}."`
      : `Tell your team both languages out loud: "What makes me feel cared for is ${LD[rPrimary].name}. What I most naturally give is ${LD[gPrimary].name}."`,
  };
}

// ── BAR CHART ─────────────────────────────────────────────────────────────────

function LanguageBar({
  langKey,
  score,
  isPrimary,
  maxScore = 16,
  LD,
}: {
  langKey: ScoreKey;
  score: number;
  isPrimary: boolean;
  maxScore?: number;
  LD: typeof LANG_DATA;
}) {
  const lang = LD[langKey];
  const pct = Math.min((score / maxScore) * 100, 100);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      padding: isPrimary ? "0.6rem 0.75rem" : "0.4rem 0",
      borderRadius: isPrimary ? "8px" : 0,
      background: isPrimary ? lang.colorLight : "transparent",
      border: isPrimary ? `2px solid ${lang.color}` : "none",
      boxShadow: isPrimary ? `0 0 12px ${lang.color}40` : "none",
      transition: "all 0.2s ease",
    }}>
      <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: lang.color, flexShrink: 0 }} />
      <div style={{ flex: "0 0 160px", minWidth: 0 }}>
        <span style={{
          fontSize: "13px",
          fontWeight: isPrimary ? 700 : 500,
          color: "oklch(22% 0.10 260)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "block",
        }}>{lang.name}</span>
      </div>
      <div style={{ flex: 1, height: "8px", background: "oklch(90% 0.01 260)", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: lang.color, borderRadius: "4px", transition: "width 0.6s ease" }} />
      </div>
      <span style={{ fontSize: "13px", fontWeight: 700, color: "oklch(22% 0.10 260)", flex: "0 0 32px", textAlign: "right" }}>{score}/16</span>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function FiveLanguagesClient({
  isSaved,
  receivingResult,
  givingResult,
  receivingScores,
  givingScores,
  lang = "en",
}: {
  isSaved: boolean;
  receivingResult: string | null;
  givingResult: string | null;
  receivingScores: { A: number; B: number; C: number; D: number; E: number } | null;
  givingScores: { A: number; B: number; C: number; D: number; E: number } | null;
  lang?: "en" | "id";
}) {
  const LD = lang === "id" ? LANG_DATA_ID : LANG_DATA;
  const RP = lang === "id" ? RECEIVING_PAIRS_ID : RECEIVING_PAIRS;
  const GP = lang === "id" ? GIVING_PAIRS_ID : GIVING_PAIRS;

  const [quizState, setQuizState] = useState<"intro" | "test1" | "transition" | "test2" | "done">("intro");
  const [currentPair, setCurrentPair] = useState(0);
  const [receivingScoresState, setReceivingScores] = useState<Scores>({ A: 0, B: 0, C: 0, D: 0, E: 0 });
  const [givingScoresState, setGivingScores] = useState<Scores>({ A: 0, B: 0, C: 0, D: 0, E: 0 });
  const [resultSaved, setResultSaved] = useState(isSaved);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const [flippedLang, setFlippedLang] = useState<ScoreKey | null>(null);
  const [openAccordion, setOpenAccordion] = useState<ScoreKey | null>(null);

  const displayReceiving: Scores = quizState === "done" && receivingResult && receivingScores
    ? receivingScores
    : receivingScoresState;
  const displayGiving: Scores = quizState === "done" && givingResult && givingScores
    ? givingScores
    : givingScoresState;

  const rPrimary = getPrimary(displayReceiving);
  const gPrimary = getPrimary(displayGiving);
  const rFlat = isFlat(displayReceiving);
  const gFlat = isFlat(displayGiving);
  const transitionPrimary = getPrimary(receivingScoresState);

  function handleAnswer(key: ScoreKey, test: "receiving" | "giving") {
    if (test === "receiving") {
      const newScores = { ...receivingScoresState, [key]: receivingScoresState[key] + 1 };
      setReceivingScores(newScores);
      if (currentPair < 39) {
        setCurrentPair(currentPair + 1);
      } else {
        setCurrentPair(0);
        setQuizState("transition");
      }
    } else {
      const newScores = { ...givingScoresState, [key]: givingScoresState[key] + 1 };
      setGivingScores(newScores);
      if (currentPair < 39) {
        setCurrentPair(currentPair + 1);
      } else {
        setQuizState("done");
      }
    }
  }

  async function handleSave() {
    startSaving(async () => {
      const rP = getPrimary(receivingScoresState);
      const gP = getPrimary(givingScoresState);
      const toPercents = (s: Scores) => ({
        A: Math.round((s.A / 40) * 100),
        B: Math.round((s.B / 40) * 100),
        C: Math.round((s.C / 40) * 100),
        D: Math.round((s.D / 40) * 100),
        E: Math.round((s.E / 40) * 100),
      });
      const rPct = toPercents(receivingScoresState);
      const gPct = toPercents(givingScoresState);
      const result = await saveFiveLanguagesResult(rP, gP, rPct, gPct);
      if (result.error) {
        setSaveError(lang === "id" ? "Tidak dapat menyimpan — silakan coba lagi." : "Could not save — please try again.");
      } else {
        await saveResourceToDashboard("5languages");
        setResultSaved(true);
        setSaveError(null);
        trackAssessmentCompletion('5languages');
      }
    });
  }

  function retake() {
    setQuizState("intro");
    setCurrentPair(0);
    setReceivingScores({ A: 0, B: 0, C: 0, D: 0, E: 0 });
    setGivingScores({ A: 0, B: 0, C: 0, D: 0, E: 0 });
    setResultSaved(false);
  }

  const overallProgress = quizState === "intro"
    ? 0
    : quizState === "test1"
    ? currentPair + 1
    : quizState === "transition"
    ? 40
    : quizState === "test2"
    ? 40 + currentPair + 1
    : 80;

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (quizState === "intro") {
    return (
      <div>
        <style>{`
          @keyframes langFlipIn {
            from { opacity: 0; transform: scaleX(0.88); }
            to { opacity: 1; transform: scaleX(1); }
          }
          .lang-flip-content { animation: langFlipIn 0.22s ease; }
        `}</style>

        {/* Hero */}
        <section style={{
          background: "oklch(22% 0.10 260)",
          paddingTop: "clamp(2.5rem, 4vw, 4rem)",
          paddingBottom: "clamp(2.5rem, 4vw, 4rem)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
          <div className="container-wide" style={{ position: "relative" }}>
            <p style={{ color: "oklch(65% 0.15 45)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
              {lang === "id" ? "Kepemimpinan · Asesmen" : "Leadership · Assessment"}
            </p>
            <h1 style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(38px, 5.5vw, 68px)",
              fontWeight: 600,
              lineHeight: 1.08,
              color: "oklch(97% 0.005 80)",
              marginBottom: "1rem",
              maxWidth: "20ch",
            }}>
              {lang === "id" ? "5 Bahasa Penghargaan" : "5 Languages of Appreciation"}
            </h1>
            <p style={{
              color: "oklch(75% 0.05 260)",
              fontSize: "clamp(15px, 1.6vw, 18px)",
              lineHeight: 1.65,
              maxWidth: "56ch",
              marginBottom: "2rem",
            }}>
              {lang === "id"
                ? <>Tes 5 Languages dua arah pertama untuk tim — temukan apakah kamu menerima kepedulian melalui{" "}
                    <span style={{ color: LD.A.color, fontWeight: 600 }}>Kata-Kata Penghargaan</span>,{" "}
                    <span style={{ color: LD.B.color, fontWeight: 600 }}>Waktu Berkualitas</span>,{" "}
                    <span style={{ color: LD.C.color, fontWeight: 600 }}>Tindakan Pelayanan</span>,{" "}
                    <span style={{ color: LD.D.color, fontWeight: 600 }}>Hadiah Konkret</span>, atau{" "}
                    <span style={{ color: LD.E.color, fontWeight: 600 }}>Sentuhan yang Tepat</span>{" "}
                    — dan apakah kamu memberikannya dalam bahasa yang sama.</>
                : <>The first two-way 5 Languages test for teams — discover whether you receive care through{" "}
                    <span style={{ color: LD.A.color, fontWeight: 600 }}>Words of Affirmation</span>,{" "}
                    <span style={{ color: LD.B.color, fontWeight: 600 }}>Quality Time</span>,{" "}
                    <span style={{ color: LD.C.color, fontWeight: 600 }}>Acts of Service</span>,{" "}
                    <span style={{ color: LD.D.color, fontWeight: 600 }}>Tangible Gifts</span>, or{" "}
                    <span style={{ color: LD.E.color, fontWeight: 600 }}>Appropriate Touch</span>{" "}
                    — and whether you give it in the same language.</>
              }
            </p>
          </div>
        </section>

        {/* About section */}
        <section style={{ background: "white", padding: "clamp(2rem, 4vw, 3.5rem) 0", borderTop: "1px solid oklch(91% 0.006 80)" }}>
          <div className="container-wide">
            <h2 style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(1.3rem, 2.5vw, 1.75rem)",
              color: "oklch(22% 0.10 260)", marginBottom: "0.5rem",
            }}>
              {lang === "id" ? "Tentang asesmen ini" : "About this assessment"}
            </h2>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(42% 0.008 260)", lineHeight: 1.7, maxWidth: 680, marginBottom: "2.5rem" }}>
              {lang === "id"
                ? "Ini adalah tes 5 Languages pertama yang dirancang untuk mengukur kedua sisi kepedulian. Versi asli Chapman hanya menangkap cara kamu menerima. Di sini, kamu menyelesaikan dua tes — satu untuk menerima, satu untuk memberi. Keduanya tidak sama. Untuk tim lintas budaya, mengetahui kesenjangan antara keduanya bukan pilihan: di situlah wawasan kepemimpinan yang nyata berada."
                : "This is the first 5 Languages test designed to measure both sides of care. Chapman’s original only captures how you receive. Here, you complete two tests — one for receiving, one for giving. They are not the same. For cross-cultural teams, knowing the gap between the two is not optional: it is where the real leadership insight lives."
              }
            </p>

            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(35% 0.008 260)", lineHeight: 1.75, maxWidth: 720, marginBottom: "2.5rem" }}>
              {lang === "id"
                ? "Kebanyakan tim menganggap kepedulian ya kepedulian — bahwa apa yang kamu berikan mendarat sesuai niatmu. Jarang sekali begitu. Aturan Emas meleset: seorang pemimpin yang terhubung untuk Kata-Kata menuangkan afirmasi kepada rekan yang membutuhkan Tindakan Pelayanan, dan keduanya tidak mengerti mengapa tidak berhasil. Hasilmu akan menunjukkan salah satu dari tiga pola — Cocok, Dua Bahasa, atau Luas. Masing-masing memiliki langkah praktis yang berbeda. Langkah paling berdampak adalah yang paling sederhana: beritahu timmu kedua bahasa dengan lantang."
                : "Most teams assume care is care — that what you give lands the way you intend it. It rarely does. The Golden Rule misfires: a leader wired for Words pours affirmation over a teammate who needs Acts of Service, and neither understands why it is not working. Your results will show one of three patterns — Match, Two Languages, or Broad. Each has a different practical move. The highest-leverage step is the simplest: tell your team both languages out loud."
              }
            </p>

            {/* 5 language flip tiles */}
            <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "oklch(22% 0.10 260)", marginBottom: "0.5rem" }}>
              {lang === "id" ? "Lima bahasa" : "The five languages"}
            </h3>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(55% 0.008 260)", marginBottom: "1rem" }}>
              {lang === "id" ? "Ketuk kartu mana saja untuk membaca kisah Alkitab." : "Tap any card to read the biblical story."}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem", marginBottom: "2.5rem" }}>
              {(["A", "B", "C", "D", "E"] as ScoreKey[]).map((k) => {
                const isFlipped = flippedLang === k;
                return (
                  <div
                    key={k}
                    onClick={() => setFlippedLang(isFlipped ? null : k)}
                    style={{
                      background: isFlipped ? LD[k].color : LD[k].colorLight,
                      border: `1.5px solid ${LD[k].color}50`,
                      borderRadius: 12,
                      padding: "1rem 1.25rem",
                      borderTop: `4px solid ${LD[k].color}`,
                      cursor: "pointer",
                      transition: "background 0.25s ease",
                    }}
                  >
                    <div className="lang-flip-content" key={isFlipped ? `${k}-back` : `${k}-front`}>
                      {isFlipped ? (
                        <>
                          <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.78rem", color: "oklch(14% 0.07 260)", marginBottom: "0.6rem" }}>
                            {LD[k].biblicalAnchor}
                          </p>
                          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", lineHeight: 1.7, color: "oklch(14% 0.07 260)" }}>
                            {LD[k].biblical}
                          </p>
                          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", color: "oklch(14% 0.07 260)", marginTop: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.65 }}>
                            {lang === "id" ? "← ketuk untuk menutup" : "← tap to close"}
                          </p>
                        </>
                      ) : (
                        <>
                          <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.85rem", color: LD[k].color, marginBottom: "0.5rem" }}>
                            {LD[k].name}
                          </p>
                          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", lineHeight: 1.65, color: "oklch(35% 0.008 260)" }}>
                            {LD[k].desc}
                          </p>
                          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", color: LD[k].color, marginTop: "0.75rem", fontStyle: "italic" }}>
                            {LD[k].biblicalAnchor}
                          </p>
                          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", color: LD[k].color, marginTop: "0.4rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                            {lang === "id" ? "Ketuk untuk kisah Alkitab →" : "Tap for biblical story →"}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cross-cultural note */}
            <div style={{ background: "oklch(96% 0.02 235)", border: "1px solid oklch(85% 0.06 235)", borderRadius: 12, padding: "1.25rem 1.5rem", marginBottom: "2.5rem" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem", color: "oklch(35% 0.10 235)", marginBottom: "0.5rem" }}>
                {lang === "id" ? "Catatan lintas budaya" : "Cross-cultural note"}
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", lineHeight: 1.7, color: "oklch(38% 0.008 260)" }}>
                {lang === "id"
                  ? "Kelima bahasa bisa melintas budaya, tapi bobot budayanya tidak. Kata-Kata Penghargaan bisa terasa performatif dalam budaya Asia high-context. Sentuhan yang Tepat adalah yang paling bervariasi — pelukan samping yang normal dalam pelayanan di Filipina tidak tepat di sebagian besar Timur Tengah. Tes ini memberimu bahasamu. Pekerjaan lintas budaya adalah belajar bagaimana bahasa itu diucapkan dengan tepat dalam budaya di sekitarmu."
                  : "The five languages travel across cultures, but their cultural weight does not. Words of Affirmation can feel performative in high-context Asian cultures. Appropriate Touch is the most variable — a side-hug normal in Filipino ministry is inappropriate in much of the Middle East. The test gives you your language. The cross-cultural work is learning how that language is properly spoken in the cultures around you."
                }
              </p>
            </div>

            {/* Want to go deeper? accordion */}
            <div style={{ marginBottom: "2.5rem" }}>
              <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "oklch(22% 0.10 260)", marginBottom: "0.4rem" }}>
                {lang === "id" ? "Ingin lebih dalam?" : "Want to go deeper?"}
              </h3>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.82rem", color: "oklch(50% 0.008 260)", marginBottom: "1rem", lineHeight: 1.6 }}>
                {lang === "id"
                  ? "Profil lengkap untuk kelima bahasa — dengan catatan lintas budaya dan landasan Alkitab."
                  : "Full profiles for all five languages — with cross-cultural notes and biblical grounding."
                }
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {(["A", "B", "C", "D", "E"] as ScoreKey[]).map((k) => {
                  const langItem = LD[k];
                  const isOpen = openAccordion === k;
                  return (
                    <div key={k} style={{ border: `1px solid ${langItem.color}35`, borderRadius: "10px", overflow: "hidden" }}>
                      <button
                        type="button"
                        onClick={() => setOpenAccordion(isOpen ? null : k)}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          background: isOpen ? langItem.color : "white",
                          border: "none",
                          padding: "0.875rem 1.25rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                      >
                        <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.875rem", color: isOpen ? "oklch(14% 0.07 260)" : langItem.color }}>
                          {langItem.name}
                        </span>
                        <span style={{ color: isOpen ? "oklch(14% 0.07 260)" : langItem.color, fontSize: "0.85rem", fontWeight: 700 }}>
                          {isOpen ? "▲" : "▼"}
                        </span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: "1.25rem 1.5rem", background: "white", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", color: "oklch(22% 0.10 260)", lineHeight: 1.7, margin: 0 }}>
                            {langItem.desc}
                          </p>
                          <div>
                            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: langItem.color, marginBottom: "0.3rem" }}>
                              {lang === "id" ? "Bukan berarti" : "What this does NOT mean"}
                            </p>
                            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(38% 0.008 260)", lineHeight: 1.65, margin: 0 }}>
                              {langItem.notMeans}
                            </p>
                          </div>
                          <div>
                            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: langItem.color, marginBottom: "0.3rem" }}>
                              {lang === "id" ? "Catatan lintas budaya" : "Cross-cultural note"}
                            </p>
                            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(38% 0.008 260)", lineHeight: 1.65, margin: 0 }}>
                              {langItem.crossCultural}
                            </p>
                          </div>
                          <div style={{ background: langItem.colorLight, borderRadius: "8px", padding: "1rem 1.1rem", borderLeft: `3px solid ${langItem.color}` }}>
                            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: langItem.color, marginBottom: "0.4rem" }}>
                              {lang === "id" ? "Jangkar Alkitab · " : "Biblical anchor · "}{langItem.biblicalAnchor}
                            </p>
                            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(25% 0.08 260)", lineHeight: 1.7, margin: 0 }}>
                              {langItem.biblical}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Begin button */}
            <div style={{ textAlign: "center" }}>
              <button
                type="button"
                onClick={() => setQuizState("test1")}
                style={{
                  background: "oklch(65% 0.15 45)",
                  color: "oklch(97% 0.005 80)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "14px 36px",
                  fontSize: "16px",
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: "0.02em",
                  transition: "opacity 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                {lang === "id" ? "Mulai Tes 1 — Menerima" : "Begin Test 1 — Receiving"}
              </button>
              <p style={{ marginTop: "0.75rem", fontSize: "13px", color: "oklch(55% 0.05 260)", fontFamily: "var(--font-montserrat)" }}>
                {lang === "id" ? "Tes 1 dari 2 · 40 pasangan · ~8 menit" : "Test 1 of 2 · 40 pairs · ~8 minutes"}
              </p>
              {receivingResult && givingResult && (
                <button
                  type="button"
                  onClick={() => setQuizState("done")}
                  style={{
                    marginTop: "1rem",
                    background: "transparent",
                    color: "oklch(45% 0.10 260)",
                    border: "1px solid oklch(80% 0.05 260)",
                    borderRadius: "8px",
                    padding: "10px 28px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "var(--font-montserrat)",
                    transition: "border-color 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "oklch(55% 0.10 260)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "oklch(80% 0.05 260)")}
                >
                  {lang === "id" ? "Lihat hasil tes sebelumnya →" : "View your previous results →"}
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ── TEST 1 ─────────────────────────────────────────────────────────────────
  if (quizState === "test1") {
    const pair = RP[currentPair];
    return (
      <div style={{ background: "oklch(97% 0.005 80)", minHeight: "100vh" }}>
        <style>{`
          .test-pair-btn {
            width: 100%;
            text-align: left;
            padding: clamp(1rem, 2vw, 1.5rem);
            background: white;
            border: 1px solid oklch(88% 0.008 80);
            border-radius: 12px;
            color: oklch(22% 0.10 260);
            font-size: clamp(14px, 1.5vw, 16px);
            line-height: 1.65;
            cursor: pointer;
            transition: border-color 0.15s ease, background 0.15s ease;
            font-family: inherit;
          }
          .test-pair-btn:focus { outline: none; }
          @media (hover: hover) {
            .test-pair-btn:hover {
              border-color: oklch(65% 0.15 45);
              background: oklch(98.5% 0.004 80);
            }
          }
        `}</style>

        {/* Progress bar */}
        <div style={{ height: "3px", background: "oklch(91% 0.006 80)" }}>
          <div style={{
            height: "100%",
            width: `${(overallProgress / 80) * 100}%`,
            background: LD[pair.a].color,
            transition: "width 0.3s ease",
          }} />
        </div>

        <div className="container-wide" style={{ maxWidth: "680px", margin: "0 auto", padding: "clamp(2rem, 4vw, 4rem) 1.5rem" }}>
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.5rem" }}>
              {lang === "id" ? "Tes 1 — Cara kamu menerima kepedulian" : "Test 1 — How you receive care"}
            </p>
            <p style={{ fontSize: "14px", color: "oklch(50% 0.008 260)" }}>
              {lang === "id"
                ? `Pasangan ${currentPair + 1} dari 40  ·  Pilih pernyataan yang paling benar untukmu`
                : `Pair ${currentPair + 1} of 40  ·  Choose the statement that feels most true for you`
              }
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { key: pair.a, text: pair.textA },
              { key: pair.b, text: pair.textB },
            ].map(({ key, text }) => (
              <button
                type="button"
                key={key}
                className="test-pair-btn"
                onClick={() => handleAnswer(key as ScoreKey, "receiving")}
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── TRANSITION ─────────────────────────────────────────────────────────────
  if (quizState === "transition") {
    return (
      <div style={{
        background: "oklch(97% 0.005 80)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{ maxWidth: "520px", padding: "2rem", textAlign: "center" }}>
          <p style={{
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "oklch(65% 0.15 45)",
            marginBottom: "1rem",
          }}>
            {lang === "id" ? "Tes 1 selesai" : "Test 1 complete"}
          </p>
          <h2 style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 600,
            color: "oklch(22% 0.10 260)",
            marginBottom: "0.5rem",
            lineHeight: 1.2,
          }}>
            {lang === "id" ? "Bahasa menerima kamu adalah:" : "Your receiving language is:"}
          </h2>
          <h2 style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 600,
            color: LD[transitionPrimary].color,
            marginBottom: "1rem",
            lineHeight: 1.2,
          }}>
            {LD[transitionPrimary].name}
          </h2>
          <p style={{
            fontSize: "16px",
            color: "oklch(48% 0.008 260)",
            lineHeight: 1.65,
            marginBottom: "2rem",
          }}>
            {lang === "id"
              ? "Sekarang Tes 2: bagaimana kamu memberi kepedulian. Jawab apa yang benar-benar kamu lakukan — bukan yang kamu harapkan."
              : "Now Test 2: how you give care. Answer what you actually do — not what you wish you did."
            }
          </p>
          <button
            type="button"
            onClick={() => setQuizState("test2")}
            style={{
              background: "oklch(65% 0.15 45)",
              color: "oklch(97% 0.005 80)",
              border: "none",
              borderRadius: "8px",
              padding: "14px 36px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.02em",
              transition: "opacity 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {lang === "id" ? "Mulai Tes 2" : "Begin Test 2"}
          </button>
        </div>
      </div>
    );
  }

  // ── TEST 2 ─────────────────────────────────────────────────────────────────
  if (quizState === "test2") {
    const pair = GP[currentPair];
    const showHonestyBanner = currentPair === 14;
    return (
      <div style={{ background: "oklch(97% 0.005 80)", minHeight: "100vh" }}>
        <style>{`
          .test-pair-btn {
            width: 100%;
            text-align: left;
            padding: clamp(1rem, 2vw, 1.5rem);
            background: white;
            border: 1px solid oklch(88% 0.008 80);
            border-radius: 12px;
            color: oklch(22% 0.10 260);
            font-size: clamp(14px, 1.5vw, 16px);
            line-height: 1.65;
            cursor: pointer;
            transition: border-color 0.15s ease, background 0.15s ease;
            font-family: inherit;
          }
          .test-pair-btn:focus { outline: none; }
          @media (hover: hover) {
            .test-pair-btn:hover {
              border-color: oklch(65% 0.15 45);
              background: oklch(98.5% 0.004 80);
            }
          }
        `}</style>

        {/* Progress bar */}
        <div style={{ height: "3px", background: "oklch(91% 0.006 80)" }}>
          <div style={{
            height: "100%",
            width: `${(overallProgress / 80) * 100}%`,
            background: LD[pair.a].color,
            transition: "width 0.3s ease",
          }} />
        </div>

        <div className="container-wide" style={{ maxWidth: "680px", margin: "0 auto", padding: "clamp(2rem, 4vw, 4rem) 1.5rem" }}>
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.5rem" }}>
              {lang === "id" ? "Tes 2 — Cara kamu memberi kepedulian" : "Test 2 — How you give care"}
            </p>
            <p style={{ fontSize: "14px", color: "oklch(50% 0.008 260)" }}>
              {lang === "id"
                ? `Pasangan ${currentPair + 41} dari 80  ·  Pilih apa yang benar-benar kamu lakukan, bukan yang kamu harapkan`
                : `Pair ${currentPair + 41} of 80  ·  Choose what you actually do, not what you wish you did`
              }
            </p>
          </div>

          {showHonestyBanner && (
            <div style={{
              background: "oklch(96% 0.02 85)",
              border: "1px solid oklch(88% 0.08 85)",
              borderRadius: "8px",
              padding: "0.875rem 1rem",
              marginBottom: "1.5rem",
              fontSize: "14px",
              color: "oklch(35% 0.08 260)",
              lineHeight: 1.55,
            }}>
              {lang === "id"
                ? <>Setengah jalan. Apakah kamu memilih apa yang benar-benar kamu lakukan — atau apa yang kamu harapkan? Sesuaikan jika perlu.</>
                : <>Halfway through. Are you choosing what you <em>actually do</em> — or what you wish you did? Adjust if needed.</>
              }
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { key: pair.a, text: pair.textA },
              { key: pair.b, text: pair.textB },
            ].map(({ key, text }) => (
              <button
                type="button"
                key={key}
                className="test-pair-btn"
                onClick={() => handleAnswer(key as ScoreKey, "giving")}
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── DONE ───────────────────────────────────────────────────────────────────
  const interpretation = getInterpretation(rPrimary, gPrimary, rFlat, gFlat, LD, lang);
  const rLang = LD[rPrimary];
  const gLang = LD[gPrimary];

  return (
    <div>
      {/* Results hero */}
      <section style={{
        background: "oklch(22% 0.10 260)",
        paddingTop: "clamp(2.5rem, 4vw, 4rem)",
        paddingBottom: "clamp(2.5rem, 4vw, 4rem)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
        <div className="container-wide" style={{ position: "relative" }}>
          <p style={{ color: "oklch(65% 0.15 45)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {lang === "id" ? "Hasil Tes Kamu · 5 Bahasa Penghargaan" : "Your Results · 5 Languages of Appreciation"}
          </p>

          <div style={{ marginBottom: "1.5rem" }}>
            <span style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: "20px",
              background: `${interpretation.labelColor}20`,
              border: `1px solid ${interpretation.labelColor}60`,
              color: interpretation.labelColor,
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}>
              {interpretation.label}
            </span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "flex-start" }}>
            <div>
              <p style={{ color: "oklch(60% 0.05 260)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                {lang === "id" ? "Menerima" : "Receiving"}
              </p>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: rLang.color, lineHeight: 1.1, marginBottom: "0.25rem" }}>
                {rLang.name}
              </h2>
              <p style={{ fontSize: "12px", color: "oklch(55% 0.05 260)" }}>{rLang.biblicalAnchor}</p>
            </div>
            <div>
              <p style={{ color: "oklch(60% 0.05 260)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                {lang === "id" ? "Memberi" : "Giving"}
              </p>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: gLang.color, lineHeight: 1.1, marginBottom: "0.25rem" }}>
                {gLang.name}
              </h2>
              <p style={{ fontSize: "12px", color: "oklch(55% 0.05 260)" }}>{gLang.biblicalAnchor}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interpretation + action */}
      <section style={{ background: "oklch(97% 0.005 80)", padding: "clamp(2rem, 3.5vw, 3rem) 0" }}>
        <div className="container-wide" style={{ maxWidth: "760px" }}>
          <p style={{ fontSize: "clamp(16px, 1.7vw, 19px)", color: "oklch(22% 0.10 260)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            {interpretation.text}
          </p>
          <div style={{ background: "oklch(22% 0.10 260)", borderRadius: "10px", padding: "1.25rem 1.5rem" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.5rem" }}>
              {lang === "id" ? "Langkah praktis" : "Practical step"}
            </p>
            <p style={{ fontSize: "15px", color: "oklch(88% 0.02 80)", lineHeight: 1.65 }}>
              {interpretation.action}
            </p>
          </div>
        </div>
      </section>

      {/* Dual bar charts */}
      <section style={{ background: "oklch(14% 0.07 260)", padding: "clamp(2rem, 4vw, 3.5rem) 0" }}>
        <div className="container-wide">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <div style={{ background: "oklch(97% 0.005 80)", borderRadius: "12px", padding: "1.5rem" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(55% 0.06 260)", marginBottom: "1.25rem" }}>
                {lang === "id" ? "Bahasa Menerima Kamu" : "Your Receiving Language"}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {(Object.entries(displayReceiving) as [ScoreKey, number][])
                  .sort((a, b) => b[1] - a[1])
                  .map(([k, v]) => (
                    <LanguageBar key={k} langKey={k} score={v} isPrimary={k === rPrimary} LD={LD} />
                  ))}
              </div>
            </div>
            <div style={{ background: "oklch(97% 0.005 80)", borderRadius: "12px", padding: "1.5rem" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(55% 0.06 260)", marginBottom: "1.25rem" }}>
                {lang === "id" ? "Bahasa Memberi Kamu" : "Your Giving Language"}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {(Object.entries(displayGiving) as [ScoreKey, number][])
                  .sort((a, b) => b[1] - a[1])
                  .map(([k, v]) => (
                    <LanguageBar key={k} langKey={k} score={v} isPrimary={k === gPrimary} LD={LD} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Language profiles — receiving + giving primaries only */}
      <section style={{ background: "oklch(97% 0.005 80)", padding: "clamp(2rem, 4vw, 3.5rem) 0" }}>
        <div className="container-wide">
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(26px, 3.5vw, 36px)", fontWeight: 600, color: "oklch(22% 0.10 260)", marginBottom: "0.5rem" }}>
            {lang === "id" ? "Dua bahasa kamu" : "Your two languages"}
          </h2>
          <p style={{ fontSize: "15px", color: "oklch(45% 0.06 260)", marginBottom: "2rem", lineHeight: 1.6 }}>
            {lang === "id" ? "Profil untuk bahasa menerima dan memberi utama kamu." : "Profiles for your receiving and giving primaries."}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {[
              { role: lang === "id" ? "Menerima" : "Receiving", key: rPrimary, langProfile: rLang },
              ...(rPrimary !== gPrimary ? [{ role: lang === "id" ? "Memberi" : "Giving", key: gPrimary, langProfile: gLang }] : []),
            ].map(({ role, key, langProfile }) => (
              <div key={`${role}-${key}`} style={{ border: `1px solid ${langProfile.color}40`, borderRadius: "14px", overflow: "hidden" }}>
                <div style={{ background: langProfile.color, padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-montserrat, sans-serif)", fontWeight: 800, fontSize: "16px", color: "oklch(14% 0.07 260)" }}>{langProfile.name}</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(14% 0.07 260)", opacity: 0.7 }}>{role}</span>
                </div>
                <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <p style={{ fontSize: "15px", color: "oklch(22% 0.10 260)", lineHeight: 1.7 }}>{langProfile.desc}</p>
                  <div>
                    <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: langProfile.color, marginBottom: "0.4rem" }}>
                      {lang === "id" ? "Bukan berarti" : "Not means"}
                    </p>
                    <p style={{ fontSize: "14px", color: "oklch(35% 0.07 260)", lineHeight: 1.65 }}>{langProfile.notMeans}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: langProfile.color, marginBottom: "0.4rem" }}>
                      {lang === "id" ? "Lintas budaya" : "Cross-cultural"}
                    </p>
                    <p style={{ fontSize: "14px", color: "oklch(35% 0.07 260)", lineHeight: 1.65 }}>{langProfile.crossCultural}</p>
                  </div>
                  <div style={{ background: langProfile.colorLight, borderRadius: "8px", padding: "1rem", borderLeft: `3px solid ${langProfile.color}` }}>
                    <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: langProfile.color, marginBottom: "0.5rem" }}>
                      {lang === "id" ? "Jangkar Alkitab · " : "Biblical anchor · "}{langProfile.biblicalAnchor}
                    </p>
                    <p style={{ fontSize: "14px", color: "oklch(25% 0.08 260)", lineHeight: 1.7 }}>{langProfile.biblical}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Save + retake */}
      <section style={{ background: "oklch(22% 0.10 260)", padding: "clamp(2rem, 3.5vw, 3rem) 0" }}>
        <div className="container-wide" style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
          {!resultSaved ? (
            <div>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                style={{
                  background: "oklch(65% 0.15 45)",
                  color: "oklch(97% 0.005 80)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 28px",
                  fontSize: "15px",
                  fontWeight: 700,
                  cursor: isSaving ? "not-allowed" : "pointer",
                  opacity: isSaving ? 0.7 : 1,
                  transition: "opacity 0.15s ease",
                }}
              >
                {isSaving
                  ? (lang === "id" ? "Menyimpan..." : "Saving...")
                  : (lang === "id" ? "Simpan hasilmu" : "Save to dashboard")
                }
              </button>
              {saveError && (
                <p style={{ color: "oklch(55% 0.20 25)", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                  {saveError}
                </p>
              )}
            </div>
          ) : (
            <span style={{ fontSize: "14px", color: "oklch(65% 0.12 150)", fontWeight: 600 }}>
              {lang === "id" ? "Hasil tersimpan" : "Saved to your dashboard"}
            </span>
          )}
          <button
            type="button"
            onClick={retake}
            style={{
              background: "transparent",
              color: "oklch(70% 0.05 260)",
              border: "1px solid oklch(40% 0.06 260)",
              borderRadius: "8px",
              padding: "12px 28px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "border-color 0.15s ease, color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "oklch(65% 0.15 45)";
              e.currentTarget.style.color = "oklch(97% 0.005 80)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "oklch(40% 0.06 260)";
              e.currentTarget.style.color = "oklch(70% 0.05 260)";
            }}
          >
            {lang === "id" ? "Ulangi tes" : "Retake"}
          </button>
        </div>
      </section>
    </div>
  );
}
