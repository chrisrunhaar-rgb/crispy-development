"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

// ─── VERSE DATA ──────────────────────────────────────────────────────────────

const VERSES = {
  "1-kings-11-4": {
    en_ref: "1 Kings 11:4", id_ref: "1 Raja-raja 11:4", nl_ref: "1 Koningen 11:4",
    en: "As Solomon grew old, his wives turned his heart after other gods, and his heart was not fully devoted to the LORD his God, as the heart of David his father had been.",
    id: "Sebab pada waktu Salomo sudah tua, isteri-isterinya itu mencondongkan hatinya kepada allah-allah lain, sehingga ia tidak dengan sepenuh hati bersama dengan TUHAN, Allahnya, seperti halnya Daud, ayahnya.",
    nl: "Maar toen Salomo oud was geworden, verleidden zijn vrouwen zijn hart tot de verering van andere goden. Zijn hart was niet langer onverdeeld trouw aan de HEER, zijn God, zoals het hart van zijn vader David dat wel was geweest.",
  },
  "1-sam-15-17": {
    en_ref: "1 Samuel 15:17", id_ref: "1 Samuel 15:17", nl_ref: "1 Samuël 15:17",
    en: "Samuel said, \"Although you were once small in your own eyes, did you not become the head of the tribes of Israel? The LORD anointed you king over Israel.\"",
    id: "Samuel berkata: \"Bukankah engkau, meskipun engkau kecil pada pemandanganmu sendiri, menjadi kepala suku-suku Israel? Dan TUHAN telah mengurapi engkau menjadi raja atas Israel.\"",
    nl: "Samuël zei: 'Was u niet ooit klein in uw eigen ogen en hoofd geworden van de stammen van Israël? De HEER heeft u tot koning van Israël gezalfd.'",
  },
  "dan-6-10": {
    en_ref: "Daniel 6:10", id_ref: "Daniel 6:10", nl_ref: "Daniël 6:10",
    en: "Now when Daniel learned that the decree had been published, he went home to his upstairs room where the windows opened toward Jerusalem. Three times a day he got down on his knees and prayed, giving thanks to his God, just as he had done before.",
    id: "Demi diketahui Daniel, bahwa surat perintah itu telah dibuat, pergilah ia ke rumahnya. Dalam kamar atasnya ada jendela-jendela yang terbuka ke arah Yerusalem; tiga kali sehari ia berlutut, berdoa serta memuji Allahnya, seperti yang biasa dilakukannya.",
    nl: "Zodra Daniël hoorde dat het besluit was uitgevaardigd, ging hij naar huis. Op de bovenverdieping had hij een kamer met vensters die uitkeken over Jeruzalem. Zoals hij gewoon was deed hij ook nu drie keer per dag zijn knieen en bad hij tot zijn God en loofde hem.",
  },
  "2-tim-4-7": {
    en_ref: "2 Timothy 4:7", id_ref: "2 Timotius 4:7", nl_ref: "2 Timotheüs 4:7",
    en: "I have fought the good fight, I have finished the race, I have kept the faith.",
    id: "Aku telah mengakhiri pertandingan yang baik, aku telah mencapai garis akhir dan aku telah memelihara iman.",
    nl: "Ik heb de goede strijd gestreden, ik heb de wedloop volbracht, ik heb het geloof bewaard.",
  },
  "john-15-4-5": {
    en_ref: "John 15:4–5", id_ref: "Yohanes 15:4–5", nl_ref: "Johannes 15:4–5",
    en: "Abide in me, as I also abide in you. No branch can bear fruit by itself; it must remain in the vine. Neither can you bear fruit unless you remain in me. I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing.",
    id: "Tinggallah di dalam Aku dan Aku di dalam kamu. Sama seperti ranting tidak dapat berbuah dari dirinya sendiri, kalau ia tidak tinggal pada pokok anggur, demikian juga kamu tidak berbuah, jikalau kamu tidak tinggal di dalam Aku. Akulah pokok anggur dan kamulah ranting-rantingnya. Barangsiapa tinggal di dalam Aku dan Aku di dalam dia, ia berbuah banyak, sebab di luar Aku kamu tidak dapat berbuat apa-apa.",
    nl: "Blijf in mij, dan blijf ik in u. Een rank kan geen vrucht dragen als hij niet aan de wijnstok blijft; zo kunnen jullie geen vrucht dragen als jullie niet in mij blijven. Ik ben de wijnstok en jullie zijn de ranken. Als iemand in mij blijft en ik in hem, zal hij veel vrucht dragen. Maar zonder mij kun je niets doen.",
  },
  "ps-46-10": {
    en_ref: "Psalm 46:10", id_ref: "Mazmur 46:10", nl_ref: "Psalm 46:10",
    en: "He says, \"Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth.\"",
    id: "\"Diamlah dan ketahuilah, bahwa Akulah Allah! Aku ditinggikan di antara bangsa-bangsa, ditinggikan di bumi.\"",
    nl: "\"Staak uw strijd, en weet dat ik God ben, verheven boven de volken, verheven boven de aarde.\"",
  },
  "1-kings-19-4": {
    en_ref: "1 Kings 19:4", id_ref: "1 Raja-raja 19:4", nl_ref: "1 Koningen 19:4",
    en: "He came to a broom bush, sat down under it and prayed that he might die. \"I have had enough, LORD,\" he said. \"Take my life; I am no better than my ancestors.\"",
    id: "Tetapi ia sendiri masuk ke padang gurun sehari perjalanan jauhnya, lalu duduk di bawah sebuah pohon arar. Kemudian ia ingin mati, katanya: \"Cukuplah itu! Sekarang, ya TUHAN, ambillah nyawaku, sebab aku ini tidak lebih baik dari pada nenek moyangku.\"",
    nl: "Zelf trok hij de woestijn in, een dagreis ver, en ging onder een bremstruik zitten. Hij wenste te sterven. 'Het is genoeg, HEER,' zei hij. 'Neem mijn leven, want ik ben niet beter dan mijn voorouders.'",
  },
  "col-2-8": {
    en_ref: "Colossians 2:8", id_ref: "Kolose 2:8", nl_ref: "Kolossenzen 2:8",
    en: "See to it that no one takes you captive through hollow and deceptive philosophy, which depends on human tradition and the elemental spiritual forces of this world rather than on Christ.",
    id: "Hati-hatilah, supaya jangan ada yang menawan kamu dengan filsafatnya yang kosong dan palsu menurut ajaran turun-temurun dan roh-roh dunia, tetapi tidak menurut Kristus.",
    nl: "Pas op dat niemand u meesleurt door zijn filosofie en door bedrieglijke leugens die op menselijke tradities zijn gebaseerd, op de machten die de wereld beheersen, en niet op Christus.",
  },
};

// ─── DRIFT THREATS DATA ───────────────────────────────────────────────────────

const DRIFTS = [
  {
    number: "01",
    en_title: "The Drift of Busyness",
    id_title: "Hanyut karena Kesibukan",
    nl_title: "De Afdrijving van Drukte",
    en_subtitle: "When the work becomes the worship",
    id_subtitle: "Ketika pekerjaan menjadi ibadah",
    nl_subtitle: "Wanneer het werk de aanbidding wordt",
    en_narrative: `He was a church planter who never stopped. Every week held a new vision meeting, a new outreach, a new crisis to manage. He told himself prayer could come later — once the groundwork was laid. Eighteen months in, he couldn't remember the last time he'd prayed and meant it. The work was still running. He was not. The ministry had become his identity, his proof, his offering — and somewhere along the way, the One he was serving had become background noise.`,
    id_narrative: `Ia adalah seorang perintis jemaat yang tidak pernah berhenti. Setiap minggu ada rapat visi baru, penjangkauan baru, krisis baru yang harus dikelola. Ia berkata pada dirinya sendiri bahwa doa bisa datang kemudian — setelah fondasi diletakkan. Delapan belas bulan kemudian, ia tidak bisa mengingat kapan terakhir kali ia berdoa dengan sungguh-sungguh. Pelayanan masih berjalan. Dirinya tidak. Kementerian telah menjadi identitasnya, buktinya, persembahannya — dan di suatu tempat dalam perjalanan itu, Dia yang ia layani telah menjadi kebisingan latar belakang.`,
    nl_narrative: `Hij was een kerkplanter die nooit stopte. Elke week had een nieuwe visievergadering, een nieuwe outreach, een nieuwe crisis te managen. Hij zei zichzelf dat gebed later kon komen — zodra het fundament was gelegd. Achttien maanden later kon hij zich niet meer herinneren wanneer hij voor het laatste had gebeden en het meende. Het werk liep nog steeds. Hij niet meer. Het ministerie was zijn identiteit geworden, zijn bewijs, zijn offer — en ergens onderweg was Hij die hij diende achtergrondgeluid geworden.`,
    en_signs: [
      "You haven't had a slow, listening prayer in weeks — only fast, functional ones",
      "Scripture has become source material for sermons rather than nourishment for your soul",
      "You feel closer to God in platform moments than in private ones",
    ],
    id_signs: [
      "Anda belum berdoa dengan lambat dan mendengarkan dalam beberapa minggu — hanya doa yang cepat dan fungsional",
      "Kitab Suci telah menjadi bahan sumber khotbah daripada makanan bagi jiwa Anda",
      "Anda merasa lebih dekat dengan Tuhan di momen publik daripada di momen pribadi",
    ],
    nl_signs: [
      "Je hebt al weken geen langzaam, luisterend gebed gehad — alleen snelle, functionele",
      "De Bijbel is bronmateriaal voor preken geworden in plaats van voeding voor je ziel",
      "Je voelt je dichter bij God in publieke momenten dan in privé-momenten",
    ],
    verse_key: "1-kings-11-4",
    en_biblical: "Solomon",
    id_biblical: "Salomo",
    nl_biblical: "Salomo",
    en_biblical_body: `Solomon began with a prayer so humble and right that God appeared to him twice. But as his kingdom expanded — trade routes, alliances, a magnificent temple — the administrative demands multiplied. Gradually, the worship became institutional rather than personal. His heart drifted not suddenly but slowly, through a thousand small compromises. By 1 Kings 11, he was no longer fully the man God had called him to be. Busyness hadn't destroyed his throne; it had hollowed out his soul first.`,
    id_biblical_body: `Salomo memulai dengan doa yang begitu rendah hati dan benar sehingga Allah menampakkan diri kepadanya dua kali. Tetapi seiring kerajaannya berkembang — jalur perdagangan, aliansi, bait suci yang megah — tuntutan administratif berlipat ganda. Secara bertahap, ibadah menjadi institusional daripada pribadi. Hatinya hanyut bukan secara tiba-tiba melainkan perlahan, melalui seribu kompromi kecil. Pada 1 Raja-raja 11, ia bukan lagi sepenuhnya pria yang dipanggil Allah. Kesibukan tidak menghancurkan takhtanya; itu pertama-tama telah mengosongkan jiwanya.`,
    nl_biblical_body: `Salomo begon met een gebed zo bescheiden en juist dat God tweemaal aan hem verscheen. Maar naarmate zijn koninkrijk uitbreidde — handelsroutes, allianties, een prachtige tempel — vermenigvuldigden de administratieve eisen zich. Geleidelijk werd de aanbidding institutioneel in plaats van persoonlijk. Zijn hart dreef niet plotseling maar langzaam, door duizend kleine compromissen. In 1 Koningen 11 was hij niet meer volledig de man die God had geroepen. Drukte had zijn troon niet vernietigd; het had eerst zijn ziel uitgehold.`,
    en_verse_display: `"As Solomon grew old, his wives turned his heart after other gods, and his heart was not fully devoted to the LORD his God."`,
    id_verse_display: `"Sebab pada waktu Salomo sudah tua, isteri-isterinya itu mencondongkan hatinya kepada allah-allah lain, sehingga ia tidak dengan sepenuh hati bersama dengan TUHAN, Allahnya."`,
    nl_verse_display: `"Maar toen Salomo oud was geworden, verleidden zijn vrouwen zijn hart tot de verering van andere goden. Zijn hart was niet langer onverdeeld trouw aan de HEER, zijn God."`,
    en_soul_question: "When did work last feel like worship — and when did worship last feel like rest?",
    id_soul_question: "Kapan terakhir kali pekerjaan terasa seperti ibadah — dan kapan terakhir kali ibadah terasa seperti istirahat?",
    nl_soul_question: "Wanneer voelde het werk voor het laatste aan als aanbidding — en wanneer voelde aanbidding voor het laatste aan als rust?",
    en_practice: "Schedule a 30-minute 'slow read' of a Psalm this week — not to prepare anything, not to extract content. Simply to receive. Leave your phone in another room. Let God speak before you speak.",
    id_practice: "Jadwalkan 'membaca lambat' selama 30 menit dari sebuah Mazmur minggu ini — bukan untuk mempersiapkan apa pun, bukan untuk mengekstrak konten. Cukup untuk menerima. Tinggalkan ponsel Anda di ruangan lain. Biarkan Tuhan berbicara sebelum Anda berbicara.",
    nl_practice: "Plan een 30 minuten 'langzame lezing' van een Psalm deze week — niet om iets voor te bereiden, niet om inhoud te extraheren. Gewoon om te ontvangen. Laat je telefoon in een andere kamer. Laat God spreken voordat jij spreekt.",
  },
  {
    number: "02",
    en_title: "The Drift of Disillusionment",
    id_title: "Hanyut karena Kekecewaan",
    nl_title: "De Afdrijving van Desillusie",
    en_subtitle: "When the gap between vision and reality breaks you",
    id_subtitle: "Ketika kesenjangan antara visi dan realitas menghancurkanmu",
    nl_subtitle: "Wanneer de kloof tussen visie en werkelijkheid je breekt",
    en_narrative: `She had arrived with a clear vision: a flourishing community, transformed lives, a team that shared her values. Three years later, the key leader she mentored had betrayed her trust. The church that once cheered her on had turned political. The person she poured the most into had walked away. She still showed up. She still led. But privately, she had stopped believing it would ever work — and she hadn't told anyone, including God.`,
    id_narrative: `Ia datang dengan visi yang jelas: komunitas yang berkembang, kehidupan yang diubah, tim yang berbagi nilai-nilainya. Tiga tahun kemudian, pemimpin kunci yang ia bimbing telah mengkhianati kepercayaannya. Gereja yang pernah mendukungnya telah menjadi politis. Orang yang paling ia curahkan telah pergi. Ia masih datang. Ia masih memimpin. Tetapi secara pribadi, ia telah berhenti percaya bahwa itu akan pernah berhasil — dan ia belum memberitahu siapa pun, termasuk Tuhan.`,
    nl_narrative: `Ze was aangekomen met een heldere visie: een bloeiende gemeenschap, getransformeerde levens, een team dat haar waarden deelde. Drie jaar later had de sleutelleider die ze mentorde haar vertrouwen verraden. De kerk die haar vroeger aanmoedigde was politiek geworden. De persoon in wie ze het meest had geïnvesteerd was weggelopen. Ze bleef opdagen. Ze bleef leidinggeven. Maar privé was ze gestopt met geloven dat het ooit zou werken — en ze had het aan niemand verteld, inclusief God.`,
    en_signs: [
      "You still do the work, but you've stopped expecting God to show up in it",
      "You've stopped praying for specific people or outcomes — it feels pointless",
      "Your inner monologue has shifted from faith-language to management-language",
    ],
    id_signs: [
      "Anda masih melakukan pekerjaan, tetapi Anda telah berhenti mengharapkan Tuhan hadir di dalamnya",
      "Anda telah berhenti berdoa untuk orang atau hasil tertentu — rasanya sia-sia",
      "Monolog internal Anda telah beralih dari bahasa iman ke bahasa manajemen",
    ],
    nl_signs: [
      "Je doet het werk nog steeds, maar je bent gestopt met verwachten dat God erin verschijnt",
      "Je bent gestopt met bidden voor specifieke mensen of uitkomsten — het voelt zinloos",
      "Je innerlijke monoloog is verschoven van geloofstaal naar managementtaal",
    ],
    verse_key: "1-kings-19-4",
    en_biblical: "Elijah",
    id_biblical: "Elia",
    nl_biblical: "Elia",
    en_biblical_body: `After the triumph on Mount Carmel, Elijah collapsed under a broom tree and asked God to let him die. He had poured everything out — and the results hadn't held. Jezebel's threats were as real as ever. He felt alone, spent, finished. God's response was not a rebuke for his lack of faith. It was an angel with food, rest, and a gentle question: 'What are you doing here, Elijah?' Disillusionment is not the end of the story. It is often the place where God meets the leader most tenderly.`,
    id_biblical_body: `Setelah kemenangan di Gunung Karmel, Elia jatuh di bawah pohon arar dan meminta Allah untuk membiarkannya mati. Ia telah mencurahkan segalanya — dan hasilnya tidak bertahan. Ancaman Izebel nyata seperti sebelumnya. Ia merasa sendirian, habis, selesai. Respons Allah bukan teguran karena kurangnya iman. Itu adalah malaikat dengan makanan, istirahat, dan pertanyaan lembut: 'Apa yang kamu lakukan di sini, Elia?' Kekecewaan bukan akhir dari cerita. Ini sering kali tempat di mana Allah menemui pemimpin dengan paling penuh kasih.`,
    nl_biblical_body: `Na de triomf op de Karmel stortte Elia in onder een bremstruik en vroeg God hem te laten sterven. Hij had alles gegeven — en de resultaten hadden niet standgehouden. Izebels bedreigingen waren net zo reëel als altijd. Hij voelde zich alleen, uitgeput, klaar. Gods antwoord was geen berisping voor zijn gebrek aan geloof. Het was een engel met voedsel, rust en een zachte vraag: 'Wat doe je hier, Elia?' Desillusie is niet het einde van het verhaal. Het is vaak de plek waar God de leider het tederst ontmoet.`,
    en_verse_display: `"He came to a broom bush, sat down under it and prayed that he might die. 'I have had enough, LORD,' he said."`,
    id_verse_display: `"Tetapi ia sendiri masuk ke padang gurun sehari perjalanan jauhnya, lalu duduk di bawah sebuah pohon arar. Kemudian ia ingin mati, katanya: 'Cukuplah itu! Sekarang, ya TUHAN, ambillah nyawaku.'"`,
    nl_verse_display: `"Zelf trok hij de woestijn in, een dagreis ver, en ging onder een bremstruik zitten. Hij wenste te sterven. 'Het is genoeg, HEER,' zei hij."`,
    en_soul_question: "What specific hope have you quietly stopped holding — and have you brought that grief honestly before God?",
    id_soul_question: "Harapan spesifik apa yang diam-diam telah Anda hentikan — dan apakah Anda telah membawa kesedihan itu secara jujur di hadapan Tuhan?",
    nl_soul_question: "Welke specifieke hoop ben je stilletjes gestopt met vasthouden — en heb je dat verdriet eerlijk voor God gebracht?",
    en_practice: "Write an honest lament to God this week — not a polished prayer, but a raw one. Name what hasn't gone the way you hoped. Name who has hurt you. Name what you don't understand. The Psalms give you permission. God can handle it.",
    id_practice: "Tulis ratapan jujur kepada Tuhan minggu ini — bukan doa yang dipoles, tetapi yang mentah. Sebutkan apa yang tidak berjalan seperti yang Anda harapkan. Sebutkan siapa yang menyakiti Anda. Sebutkan apa yang tidak Anda mengerti. Mazmur memberi Anda izin. Tuhan dapat menanganinya.",
    nl_practice: "Schrijf deze week een eerlijke klacht aan God — geen gepolijst gebed, maar een rauw. Benoem wat niet is gegaan zoals je hoopte. Benoem wie je pijn heeft gedaan. Benoem wat je niet begrijpt. De Psalmen geven je toestemming. God kan het aan.",
  },
  {
    number: "03",
    en_title: "The Drift of Pride",
    id_title: "Hanyut karena Kesombongan",
    nl_title: "De Afdrijving van Trots",
    en_subtitle: "When success whispers that you did this",
    id_subtitle: "Ketika keberhasilan berbisik bahwa kamulah yang melakukannya",
    nl_subtitle: "Wanneer succes fluistert dat jij dit hebt gedaan",
    en_narrative: `The organisation he led had doubled in three years. He was being invited to speak internationally. His methods were studied and replicated. And slowly, almost imperceptibly, his prayers changed. They became shorter. More informational than receptive. He still thanked God publicly — but privately, the dependence had faded. He had once led from a posture of desperation. Now he led from a posture of competence. Both looked similar from the outside. They were not the same.`,
    id_narrative: `Organisasi yang ia pimpin telah berlipat ganda dalam tiga tahun. Ia diundang untuk berbicara secara internasional. Metode-metodenya dipelajari dan direplikasi. Dan perlahan, hampir tidak terasa, doa-doanya berubah. Mereka menjadi lebih pendek. Lebih informatif daripada reseptif. Ia masih berterima kasih kepada Tuhan secara publik — tetapi secara pribadi, ketergantungan itu telah memudar. Ia pernah memimpin dari postur keputusasaan. Kini ia memimpin dari postur kompetensi. Keduanya terlihat serupa dari luar. Mereka tidak sama.`,
    nl_narrative: `De organisatie die hij leidde was in drie jaar verdubbeld. Hij werd internationaal uitgenodigd om te spreken. Zijn methoden werden bestudeerd en gerepliceerd. En langzaam, bijna onmerkbaar, veranderden zijn gebeden. Ze werden korter. Meer informatief dan ontvangend. Hij dankte God nog steeds publiekelijk — maar privé was de afhankelijkheid vervaagd. Hij had ooit geleid vanuit een houding van wanhoop. Nu leidde hij vanuit een houding van bekwaamheid. Beide zagen er van buitenaf vergelijkbaar uit. Ze waren niet hetzelfde.`,
    en_signs: [
      "You've become less teachable — feedback feels like a threat rather than a gift",
      "Your prayer life has become monologue — you tell God, you don't ask him",
      "You feel vaguely irritated when others receive the credit you feel you deserve",
    ],
    id_signs: [
      "Anda menjadi kurang dapat diajar — umpan balik terasa seperti ancaman daripada hadiah",
      "Kehidupan doa Anda telah menjadi monolog — Anda memberi tahu Tuhan, Anda tidak meminta-Nya",
      "Anda merasa samar-samar kesal ketika orang lain mendapat kredit yang menurut Anda layak Anda dapatkan",
    ],
    nl_signs: [
      "Je bent minder leerbaar geworden — feedback voelt als een bedreiging in plaats van een geschenk",
      "Je gebedsleven is een monoloog geworden — je vertelt God, je vraagt hem niet",
      "Je voelt je vaag geïrriteerd wanneer anderen de eer krijgen die jij vindt te verdienen",
    ],
    verse_key: "1-sam-15-17",
    en_biblical: "Saul",
    id_biblical: "Saul",
    nl_biblical: "Saul",
    en_biblical_body: `When Samuel anointed Saul, he was small in his own eyes — hiding among the baggage, reluctant, genuinely humble. God could work with that. But success changed Saul. Victory by victory, his dependence on God eroded. By 1 Samuel 15, he was rationalising disobedience, protecting his image, and blaming others. Samuel's haunting words cut to the core: 'When you were small in your own eyes...' The tragedy of Saul is not that he was unqualified. It is that he forgot where he came from — and who had brought him there.`,
    id_biblical_body: `Ketika Samuel mengurapi Saul, ia kecil di matanya sendiri — bersembunyi di antara barang-barang, ragu-ragu, benar-benar rendah hati. Allah dapat bekerja dengan itu. Tetapi keberhasilan mengubah Saul. Kemenangan demi kemenangan, ketergantungannya pada Allah terkikis. Pada 1 Samuel 15, ia sedang merasionalisasi ketidaktaatan, melindungi citranya, dan menyalahkan orang lain. Kata-kata Samuel yang menghantui memotong inti: 'Ketika engkau kecil di matamu sendiri...' Tragedi Saul bukan bahwa ia tidak memenuhi syarat. Ini adalah bahwa ia melupakan dari mana ia berasal — dan siapa yang telah membawanya ke sana.`,
    nl_biblical_body: `Toen Samuel Saul zalfde was hij klein in zijn eigen ogen — verstopt tussen de bagage, terughoudend, oprecht bescheiden. God kon daarmee werken. Maar succes veranderde Saul. Overwinning na overwinning eroedeerde zijn afhankelijkheid van God. In 1 Samuël 15 rationaliseerde hij ongehoorzaamheid, beschermde hij zijn imago en gaf hij anderen de schuld. Samuëls treffende woorden sneden tot de kern: 'Toen u klein was in uw eigen ogen...' De tragedie van Saul is niet dat hij onbekwaam was. Het is dat hij vergat waar hij vandaan kwam — en wie hem daarheen had gebracht.`,
    en_verse_display: `"Although you were once small in your own eyes, did you not become the head of the tribes of Israel? The LORD anointed you king over Israel."`,
    id_verse_display: `"Bukankah engkau, meskipun engkau kecil pada pemandanganmu sendiri, menjadi kepala suku-suku Israel? Dan TUHAN telah mengurapi engkau menjadi raja atas Israel."`,
    nl_verse_display: `"Was u niet ooit klein in uw eigen ogen en hoofd geworden van de stammen van Israël? De HEER heeft u tot koning van Israël gezalfd."`,
    en_soul_question: "When did you last lead from a place of genuine need — and is there anything in your current season you are refusing to ask God for?",
    id_soul_question: "Kapan terakhir kali Anda memimpin dari tempat kebutuhan yang tulus — dan apakah ada sesuatu dalam musim Anda saat ini yang Anda tolak untuk dimintakan kepada Tuhan?",
    nl_soul_question: "Wanneer heb je voor het laatste geleid vanuit een plek van echte behoefte — en is er iets in je huidige seizoen dat je weigert aan God te vragen?",
    en_practice: "This week, begin every meeting, every decision, and every significant conversation with a private 60-second prayer of dependence. Not a long one — just an honest one: 'I don't have what this requires. You do. Lead through me.'",
    id_practice: "Minggu ini, mulailah setiap rapat, setiap keputusan, dan setiap percakapan penting dengan doa ketergantungan pribadi 60 detik. Bukan yang panjang — hanya yang jujur: 'Aku tidak memiliki apa yang ini butuhkan. Engkau memilikinya. Pimpin melalui aku.'",
    nl_practice: "Begin deze week elke vergadering, elke beslissing en elk betekenisvol gesprek met een privégebed van 60 seconden van afhankelijkheid. Niet een lang gebed — gewoon een eerlijk: 'Ik heb niet wat dit vereist. U wel. Leid door mij.'",
  },
  {
    number: "04",
    en_title: "The Drift of Isolation",
    id_title: "Hanyut karena Isolasi",
    nl_title: "De Afdrijving van Isolatie",
    en_subtitle: "When leadership loneliness cuts you off from God and others",
    id_subtitle: "Ketika kesepian kepemimpinan memutusmu dari Tuhan dan sesama",
    nl_subtitle: "Wanneer de eenzaamheid van leiderschap je afsnijdt van God en anderen",
    en_narrative: `He was seen by hundreds as strong, clear, and spiritually grounded. In reality, he hadn't had a real spiritual conversation with anyone in over a year. His accountability group had drifted. His mentor had moved on. He told himself he was fine — the evidence was his continued output. But alone at night, he knew something was wrong. He had no one he could tell the truth to. Leadership had made him an island, and the island was slowly sinking.`,
    id_narrative: `Ia dipandang oleh ratusan orang sebagai kuat, jelas, dan berakar secara rohani. Kenyataannya, ia belum memiliki percakapan rohani yang nyata dengan siapa pun selama lebih dari setahun. Kelompok akuntabilitasnya telah hanyut. Mentornya telah pindah. Ia berkata pada dirinya sendiri bahwa ia baik-baik saja — buktinya adalah output-nya yang terus berlanjut. Tetapi sendirian di malam hari, ia tahu ada yang salah. Ia tidak punya siapa pun yang bisa ia ceritakan kebenaran. Kepemimpinan telah menjadikannya sebuah pulau, dan pulau itu perlahan-lahan tenggelam.`,
    nl_narrative: `Honderden mensen zagen hem als sterk, helder en geestelijk gegrond. In werkelijkheid had hij al meer dan een jaar geen echte spirituele gesprek met iemand gehad. Zijn verantwoordelijkheidsgroep was weggegleden. Zijn mentor was doorgegaan. Hij zei zichzelf dat het goed ging — het bewijs was zijn aanhoudende output. Maar alleen in de nacht wist hij dat er iets mis was. Hij had niemand aan wie hij de waarheid kon vertellen. Leiderschap had hem een eiland gemaakt, en het eiland zonk langzaam.`,
    en_signs: [
      "You have no one in your life who knows what you are actually struggling with spiritually",
      "You process everything alone — or not at all",
      "The persona you project has become more real to you than your actual interior life",
    ],
    id_signs: [
      "Tidak ada seorang pun dalam hidup Anda yang tahu apa yang sebenarnya Anda perjuangkan secara rohani",
      "Anda memproses segalanya sendirian — atau tidak sama sekali",
      "Persona yang Anda proyeksikan telah menjadi lebih nyata bagi Anda daripada kehidupan batin Anda yang sebenarnya",
    ],
    nl_signs: [
      "Er is niemand in je leven die weet waar je daadwerkelijk geestelijk mee worstelt",
      "Je verwerkt alles alleen — of helemaal niet",
      "De persona die je projecteert is voor jou echter geworden dan je werkelijke innerlijke leven",
    ],
    verse_key: "ps-46-10",
    en_biblical: "Elijah (again) and the still small voice",
    id_biblical: "Elia (lagi) dan suara yang lirih",
    nl_biblical: "Elia (opnieuw) en de zachte, stille stem",
    en_biblical_body: `After fleeing, after sleeping, after eating — God didn't lecture Elijah. He asked a question: 'What are you doing here, Elijah?' And then again, a second time. God didn't fill the silence with noise. He came in a still small voice. Isolation is often a symptom of a leader who has stopped believing anyone could actually understand. The antidote is not forcing connection, but learning to receive it — first from God, then from the two or three he places near you.`,
    id_biblical_body: `Setelah melarikan diri, setelah tidur, setelah makan — Allah tidak mengkhotbahi Elia. Ia mengajukan pertanyaan: 'Apa yang kamu lakukan di sini, Elia?' Dan kemudian lagi, untuk kedua kalinya. Allah tidak mengisi keheningan dengan kebisingan. Ia datang dalam suara yang lirih dan halus. Isolasi sering kali merupakan gejala dari seorang pemimpin yang telah berhenti percaya bahwa ada seseorang yang benar-benar dapat memahami. Penawarnya bukan memaksakan koneksi, tetapi belajar untuk menerimanya — pertama dari Allah, kemudian dari dua atau tiga orang yang Ia tempatkan di dekat Anda.`,
    nl_biblical_body: `Na het vluchten, na het slapen, na het eten — God preekte niet tegen Elia. Hij stelde een vraag: 'Wat doe je hier, Elia?' En toen opnieuw, een tweede keer. God vulde de stilte niet met lawaai. Hij kwam in een zachte, stille stem. Isolatie is vaak een symptoom van een leider die gestopt is met geloven dat iemand het werkelijk zou kunnen begrijpen. Het tegengif is niet het forceren van verbinding, maar het leren om het te ontvangen — eerst van God, dan van de twee of drie die Hij dichtbij je plaatst.`,
    en_verse_display: `"Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth."`,
    id_verse_display: `"Diamlah dan ketahuilah, bahwa Akulah Allah! Aku ditinggikan di antara bangsa-bangsa, ditinggikan di bumi."`,
    nl_verse_display: `"Staak uw strijd, en weet dat ik God ben, verheven boven de volken, verheven boven de aarde."`,
    en_soul_question: "Who actually knows you — not your role, not your output, but the interior state of your soul right now?",
    id_soul_question: "Siapa yang benar-benar mengenal Anda — bukan peran Anda, bukan output Anda, tetapi keadaan batin jiwa Anda saat ini?",
    nl_soul_question: "Wie kent jou werkelijk — niet je rol, niet je output, maar de innerlijke toestand van je ziel op dit moment?",
    en_practice: "Identify one person — not a subordinate, not a fan, but a spiritual peer — and reach out to them this week. Not to network. Not to update them on your work. Simply to say: I need someone who can pray with me. Then let them.",
    id_practice: "Identifikasi satu orang — bukan bawahan, bukan penggemar, tetapi rekan rohani — dan hubungi mereka minggu ini. Bukan untuk jaringan. Bukan untuk memperbarui mereka tentang pekerjaan Anda. Cukup untuk mengatakan: Saya butuh seseorang yang bisa berdoa bersama saya. Kemudian biarkan mereka.",
    nl_practice: "Identificeer één persoon — geen ondergeschikte, geen bewonderaar, maar een geestelijke gelijke — en neem deze week contact met hen op. Niet om te netwerken. Niet om hen bij te praten over je werk. Gewoon om te zeggen: ik heb iemand nodig die met mij kan bidden. Laat hen dan.",
  },
  {
    number: "05",
    en_title: "The Drift of Syncretism",
    id_title: "Hanyut karena Sinkretisme",
    nl_title: "De Afdrijving van Syncretisme",
    en_subtitle: "When you slowly absorb the values of the culture you lead in",
    id_subtitle: "Ketika kamu perlahan menyerap nilai-nilai budaya yang kamu pimpin",
    nl_subtitle: "Wanneer je langzaam de waarden absorbeert van de cultuur waarin je leidt",
    en_narrative: `She had been in Southeast Asia for seven years. She had learned the language, adapted her communication style, eaten the food, celebrated the festivals. All of that was good. But somewhere in the process, she had also absorbed other things: an ethic of saving face that made her avoid hard truths; a hierarchy of honour that made her reluctant to challenge those above her; a prosperity theology that had slowly seeped into her preaching. She hadn't chosen any of it consciously. It had seeped in through the cracks of unexamined living.`,
    id_narrative: `Ia telah berada di Asia Tenggara selama tujuh tahun. Ia telah mempelajari bahasa, mengadaptasi gaya komunikasinya, makan makanan, merayakan festival. Semua itu baik. Tetapi di suatu tempat dalam prosesnya, ia juga telah menyerap hal-hal lain: etika menjaga muka yang membuatnya menghindari kebenaran yang sulit; hierarki kehormatan yang membuatnya enggan menantang mereka yang di atasnya; teologi kemakmuran yang perlahan meresap ke dalam khotbahnya. Ia tidak memilih satu pun dari itu secara sadar. Itu telah meresap melalui celah-celah kehidupan yang tidak diperiksa.`,
    nl_narrative: `Ze was zeven jaar in Zuidoost-Azië. Ze had de taal geleerd, haar communicatiestijl aangepast, het eten gegeten, de festivals gevierd. Dat was allemaal goed. Maar ergens in het proces had ze ook andere dingen geabsorbeerd: een ethiek van gezicht bewaren die haar harde waarheden liet vermijden; een hiërarchie van eer die haar terughoudend maakte om degenen boven haar te challengen; een voorspoedstheologie die langzaam in haar prediking was doorgedrongen. Ze had niets van dit alles bewust gekozen. Het was door de kieren van ononderzocht leven geslopen.`,
    en_signs: [
      "You find yourself adjusting your theology — not to communicate it better, but to make it less offensive",
      "The values driving your decisions have shifted from Scripture to context, without you noticing",
      "You haven't had a serious theological conversation in months — it feels too risky",
    ],
    id_signs: [
      "Anda mendapati diri Anda menyesuaikan teologi Anda — bukan untuk mengomunikasikannya dengan lebih baik, tetapi untuk membuatnya kurang menyinggung",
      "Nilai-nilai yang mendorong keputusan Anda telah bergeser dari Kitab Suci ke konteks, tanpa Anda sadari",
      "Anda belum memiliki percakapan teologis serius selama berbulan-bulan — rasanya terlalu berisiko",
    ],
    nl_signs: [
      "Je bevindt je dat je je theologie aanpast — niet om haar beter te communiceren, maar om haar minder aanstootgevend te maken",
      "De waarden die je beslissingen sturen zijn van de Schrift naar de context verschoven, zonder dat je het merkte",
      "Je hebt maandenlang geen serieus theologisch gesprek gehad — het voelt te riskant",
    ],
    verse_key: "col-2-8",
    en_biblical: "Daniel",
    id_biblical: "Daniel",
    nl_biblical: "Daniël",
    en_biblical_body: `Daniel lived as a foreigner in Babylon — probably the most aggressively syncretistic empire in the ancient world. He learned Babylonian language, literature, and culture. He served faithfully in a pagan court. And yet there were lines he would not cross. The food he would not eat. The prayers he would not stop. Not because he was rigid — he was demonstrably flexible. But because he had done the work of knowing which hills were worth dying on. His cultural adaptation was deep and genuine. His theological core was uncompromised.`,
    id_biblical_body: `Daniel tinggal sebagai orang asing di Babel — mungkin kekaisaran yang paling agresif sinkretis di dunia kuno. Ia mempelajari bahasa, sastra, dan budaya Babilonia. Ia melayani dengan setia di istana kafir. Namun ada garis-garis yang tidak akan ia lewati. Makanan yang tidak akan ia makan. Doa yang tidak akan ia hentikan. Bukan karena ia kaku — ia terbukti fleksibel. Tetapi karena ia telah melakukan pekerjaan mengetahui bukit mana yang layak untuk mati di atasnya. Adaptasi budayanya mendalam dan tulus. Inti teologisnya tidak dikompromikan.`,
    nl_biblical_body: `Daniël leefde als buitenlander in Babylon — waarschijnlijk het meest agressief syncretistische rijk in de oude wereld. Hij leerde de Babylonische taal, literatuur en cultuur. Hij diende trouw in een heids hof. Toch waren er lijnen die hij niet zou overschrijden. Het voedsel dat hij niet zou eten. De gebeden die hij niet zou stoppen. Niet omdat hij rigide was — hij was aantoonbaar flexibel. Maar omdat hij het werk had gedaan van weten welke heuvels het waard waren om op te sterven. Zijn culturele aanpassing was diep en oprecht. Zijn theologische kern was ongecompromitteerd.`,
    en_verse_display: `"See to it that no one takes you captive through hollow and deceptive philosophy, which depends on human tradition and the elemental spiritual forces of this world rather than on Christ."`,
    id_verse_display: `"Hati-hatilah, supaya jangan ada yang menawan kamu dengan filsafatnya yang kosong dan palsu menurut ajaran turun-temurun dan roh-roh dunia, tetapi tidak menurut Kristus."`,
    nl_verse_display: `"Pas op dat niemand u meesleurt door zijn filosofie en door bedrieglijke leugens die op menselijke tradities zijn gebaseerd, op de machten die de wereld beheersen, en niet op Christus."`,
    en_soul_question: "What belief or practice in your current context are you afraid to examine — because you might find it has already shaped you more than Scripture has?",
    id_soul_question: "Keyakinan atau praktik apa dalam konteks Anda saat ini yang Anda takut periksa — karena Anda mungkin menemukan bahwa itu telah membentuk Anda lebih dari Kitab Suci?",
    nl_soul_question: "Welke overtuiging of praktijk in je huidige context durf je niet te onderzoeken — omdat je zou kunnen ontdekken dat het je al meer heeft gevormd dan de Schrift dat heeft?",
    en_practice: "Take one hour this week to examine the values behind three recent decisions. For each, ask: Was this shaped more by the culture I'm in, or by Scripture? No self-condemnation — just honest seeing. Then bring what you find to God.",
    id_practice: "Luangkan satu jam minggu ini untuk memeriksa nilai-nilai di balik tiga keputusan terkini. Untuk masing-masing, tanyakan: Apakah ini dibentuk lebih oleh budaya di mana saya berada, atau oleh Kitab Suci? Tidak ada penghukuman diri — hanya melihat dengan jujur. Kemudian bawa apa yang Anda temukan kepada Tuhan.",
    nl_practice: "Neem deze week een uur om de waarden achter drie recente beslissingen te onderzoeken. Vraag voor elke: Werd dit meer gevormd door de cultuur waarin ik ben, of door de Schrift? Geen zelfveroordeling — gewoon eerlijk zien. Breng dan wat je vindt naar God.",
  },
];

// ─── TYPES & PROPS ────────────────────────────────────────────────────────────

type Props = { userPathway: string | null; isSaved: boolean };

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function LeadingWithoutLosingFaithClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [activeVerse, setActiveVerse] = useState<string | null>(null);

  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  const navy = "oklch(22% 0.10 260)";
  const orange = "oklch(65% 0.15 45)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const bodyText = "oklch(38% 0.05 260)";
  const serif = "var(--font-cormorant, Cormorant Garamond, Georgia, serif)";

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("leading-without-losing-faith");
      setSaved(true);
    });
  }

  function VerseRef({ id, children }: { id: string; children: React.ReactNode }) {
    return (
      <button
        onClick={() => setActiveVerse(id)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: orange, fontWeight: 700, fontFamily: "Montserrat, sans-serif",
          fontSize: "inherit", padding: 0, textDecoration: "underline dotted",
          textUnderlineOffset: 3,
        }}
      >
        {children}
      </button>
    );
  }

  const verseData = activeVerse ? VERSES[activeVerse as keyof typeof VERSES] : null;

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>

      {/* Language bar */}
      <div style={{ background: lightGray, borderBottom: "1px solid oklch(90% 0.01 80)", padding: "10px 24px", display: "flex", gap: 8, justifyContent: "flex-end", position: "sticky", top: 0, zIndex: 100 }}>
        {(["en", "id", "nl"] as Lang[]).map((l) => (
          <button key={l} onClick={() => setLang(l)} style={{ padding: "4px 14px", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, background: lang === l ? navy : "transparent", color: lang === l ? offWhite : bodyText, borderRadius: 3 }}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Slow reading notice */}
      <div style={{ background: "oklch(94% 0.012 65)", borderBottom: "1px solid oklch(88% 0.02 65)", padding: "12px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "oklch(42% 0.08 50)", fontStyle: "italic", margin: 0, fontFamily: serif }}>
          {t(
            "This is a contemplative module. Set aside 20 minutes. Read slowly — and honestly.",
            "Ini adalah modul kontemplatif. Sisihkan 20 menit. Baca dengan lambat — dan jujur.",
            "Dit is een contemplatieve module. Neem 20 minuten de tijd. Lees langzaam — en eerlijk."
          )}
        </p>
      </div>

      {/* Hero */}
      <div style={{ background: navy, padding: "88px 24px 80px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {t("Faith & Calling · Lectio-Style Exploration", "Iman & Panggilan · Eksplorasi Gaya Lectio", "Geloof & Roeping · Lectio-Stijl Verkenning")}
          </p>
          <h1 style={{ fontFamily: serif, fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: 700, color: offWhite, margin: "0 auto 32px", lineHeight: 1.15, fontStyle: "italic" }}>
            {t("Leading Without Losing Your Faith", "Memimpin Tanpa Kehilangan Imanmu", "Leidinggeven Zonder Je Geloof te Verliezen")}
          </h1>
          <div style={{ width: 48, height: 1, background: orange, margin: "0 auto 32px" }} />
          <p style={{ fontFamily: serif, fontSize: "clamp(18px, 2.4vw, 22px)", color: "oklch(82% 0.025 80)", lineHeight: 1.8, marginBottom: 40, fontStyle: "italic", maxWidth: 580, marginLeft: "auto", marginRight: "auto" }}>
            {t(
              "Leadership has a way of slowly eroding the very thing that gave it meaning. Five drift threats — and the practices that protect the leader's soul.",
              "Kepemimpinan memiliki cara untuk perlahan mengikis hal yang justru memberinya makna. Lima ancaman hanyut — dan praktik-praktik yang melindungi jiwa pemimpin.",
              "Leiderschap heeft een manier om langzaam te eroderen wat het betekenis gaf. Vijf afdrijvingsbedreigingen — en de praktijken die de ziel van de leider beschermen."
            )}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={handleSave} disabled={saved || isPending} style={{ padding: "12px 28px", border: "none", cursor: saved ? "default" : "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, background: saved ? "oklch(35% 0.05 260)" : orange, color: offWhite, letterSpacing: "0.04em", borderRadius: 4 }}>
              {saved ? t("✓ Saved to Dashboard", "✓ Tersimpan di Dashboard", "✓ Opgeslagen in Dashboard") : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
            </button>
            <Link href="/resources" style={{ padding: "12px 28px", border: "1px solid oklch(45% 0.05 260)", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, color: "oklch(78% 0.03 80)", textDecoration: "none", borderRadius: 4 }}>
              {t("All Resources", "Semua Sumber", "Alle Bronnen")}
            </Link>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div style={{ padding: "80px 24px 64px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9, marginBottom: 28 }}>
          {t(
            "Faith rarely disappears in a single dramatic moment. It drifts. Quietly. Through seasons of high demand, complex relationships, repeated disappointments, and the slow absorption of the culture around us. Most leaders who lose their faith don't choose to — they simply stop noticing it happening.",
            "Iman jarang menghilang dalam satu momen dramatis. Ia hanyut. Diam-diam. Melalui musim permintaan tinggi, hubungan yang kompleks, kekecewaan berulang, dan penyerapan lambat budaya di sekitar kita. Kebanyakan pemimpin yang kehilangan iman mereka tidak memilihnya — mereka hanya berhenti memperhatikan itu terjadi.",
            "Geloof verdwijnt zelden in één dramatisch moment. Het drijft af. Stilletjes. Door seizoenen van hoge eisen, complexe relaties, herhaalde teleurstellingen en de langzame absorptie van de omringende cultuur. De meeste leiders die hun geloof verliezen kiezen er niet voor — ze stoppen gewoon met opmerken dat het gebeurt."
          )}
        </p>
        <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9, marginBottom: 0 }}>
          {t(
            "What follows are five of the most common drift threats for cross-cultural leaders. Each one is real, slow-moving, and dangerous precisely because it masquerades as faithfulness. Read each section with your own story in mind.",
            "Berikut ini adalah lima ancaman hanyut paling umum bagi pemimpin lintas budaya. Masing-masing nyata, bergerak lambat, dan berbahaya justru karena menyamar sebagai kesetiaan. Baca setiap bagian dengan cerita Anda sendiri di benak Anda.",
            "Hieronder staan vijf van de meest voorkomende afdrijvingsbedreigingen voor interculturele leiders. Elk is echt, traag bewegend, en gevaarlijk juist omdat het zich vermomt als trouw. Lees elk gedeelte met je eigen verhaal in gedachten."
          )}
        </p>
      </div>

      {/* Five Drift Threats */}
      {DRIFTS.map((drift, idx) => {
        const isEven = idx % 2 === 0;
        const bg = isEven ? offWhite : lightGray;
        return (
          <div key={drift.number} style={{ background: bg }}>
            {/* Divider line */}
            <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
              <div style={{ height: 1, background: "oklch(88% 0.008 80)" }} />
            </div>

            <div style={{ padding: "96px 24px", maxWidth: 720, margin: "0 auto" }}>
              {/* Number + title */}
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>
                {drift.number}
              </p>
              <h2 style={{ fontFamily: serif, fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 700, color: navy, marginBottom: 12, lineHeight: 1.15, fontStyle: "italic" }}>
                {lang === "en" ? drift.en_title : lang === "id" ? drift.id_title : drift.nl_title}
              </h2>
              <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.9vw, 20px)", color: orange, fontStyle: "italic", marginBottom: 48, lineHeight: 1.4 }}>
                {lang === "en" ? drift.en_subtitle : lang === "id" ? drift.id_subtitle : drift.nl_subtitle}
              </p>

              {/* Opening narrative */}
              <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9, marginBottom: 56, padding: "0 0 0 24px", borderLeft: `3px solid ${orange}` }}>
                {lang === "en" ? drift.en_narrative : lang === "id" ? drift.id_narrative : drift.nl_narrative}
              </p>

              {/* How it shows up */}
              <div style={{ marginBottom: 56 }}>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: bodyText, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 24 }}>
                  {t("How it shows up", "Bagaimana ini muncul", "Hoe het zich manifesteert")}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {(lang === "en" ? drift.en_signs : lang === "id" ? drift.id_signs : drift.nl_signs).map((sign, si) => (
                    <div key={si} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: orange, marginTop: 8, flexShrink: 0 }} />
                      <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: bodyText, lineHeight: 1.85, margin: 0 }}>
                        {sign}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Biblical counter */}
              <div style={{ background: navy, padding: "48px 40px", borderRadius: 4, marginBottom: 48 }}>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>
                  {t("Biblical counter", "Tandingan Alkitabiah", "Bijbels tegenwicht")} — {lang === "en" ? drift.en_biblical : lang === "id" ? drift.id_biblical : drift.nl_biblical}
                </p>
                <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: "oklch(80% 0.025 80)", lineHeight: 1.9, marginBottom: 0 }}>
                  {lang === "en" ? drift.en_biblical_body : lang === "id" ? drift.id_biblical_body : drift.nl_biblical_body}
                </p>
              </div>

              {/* Full verse inline — large Cormorant Garamond */}
              <div style={{ marginBottom: 48 }}>
                <p style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontSize: "clamp(20px, 2.5vw, 26px)",
                  fontStyle: "italic",
                  color: navy,
                  lineHeight: 1.7,
                  marginBottom: 16,
                }}>
                  {lang === "en" ? drift.en_verse_display : lang === "id" ? drift.id_verse_display : drift.nl_verse_display}
                </p>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em", margin: 0 }}>
                  — <VerseRef id={drift.verse_key}>
                    {lang === "en"
                      ? VERSES[drift.verse_key as keyof typeof VERSES].en_ref
                      : lang === "id"
                      ? VERSES[drift.verse_key as keyof typeof VERSES].id_ref
                      : VERSES[drift.verse_key as keyof typeof VERSES].nl_ref}
                  </VerseRef>{" "}
                  {lang === "en" ? "(NIV)" : lang === "id" ? "(TB)" : "(NBV)"}
                </p>
              </div>

              {/* Soul question */}
              <div style={{ background: "oklch(93% 0.012 65)", padding: "32px 36px", borderRadius: 4, marginBottom: 40 }}>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: "oklch(42% 0.08 50)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>
                  {t("Soul question", "Pertanyaan jiwa", "Zielsvraag")}
                </p>
                <p style={{ fontFamily: serif, fontSize: "clamp(18px, 2.2vw, 22px)", color: "oklch(28% 0.07 50)", lineHeight: 1.75, fontStyle: "italic", margin: 0 }}>
                  {lang === "en" ? drift.en_soul_question : lang === "id" ? drift.id_soul_question : drift.nl_soul_question}
                </p>
              </div>

              {/* Returning practice */}
              <div>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: bodyText, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>
                  {t("Returning practice", "Praktik kembali", "Terugkeerpraktijk")}
                </p>
                <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: bodyText, lineHeight: 1.9, padding: "20px 24px", background: offWhite, borderLeft: `3px solid ${navy}`, margin: 0, borderRadius: "0 4px 4px 0" }}>
                  {lang === "en" ? drift.en_practice : lang === "id" ? drift.id_practice : drift.nl_practice}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      {/* ── Remaining in the Vine — John 15 Closing ── */}
      <div style={{ background: navy, padding: "104px 24px 96px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>

          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 32, textAlign: "center" }}>
            {t("Remaining in the Vine", "Tinggal dalam Pokok Anggur", "Blijven in de Wijnstok")}
          </p>

          <h2 style={{ fontFamily: serif, fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 700, color: offWhite, marginBottom: 48, lineHeight: 1.2, fontStyle: "italic", textAlign: "center" }}>
            {t("What Abiding Looks Like While Leading", "Seperti Apa Tinggal dalam Kristus Selagi Memimpin", "Hoe Blijven Eruitziet Terwijl Je Leidt")}
          </h2>

          {/* John 15:4–5 inline — the integrating verse */}
          <div style={{ marginBottom: 56, textAlign: "center" }}>
            <p style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontSize: "clamp(20px, 2.6vw, 26px)",
              fontStyle: "italic",
              color: "oklch(92% 0.015 80)",
              lineHeight: 1.75,
              marginBottom: 20,
              maxWidth: 640,
              marginLeft: "auto",
              marginRight: "auto",
            }}>
              {t(
                `"Abide in me, as I also abide in you. No branch can bear fruit by itself; it must remain in the vine. Neither can you bear fruit unless you remain in me. I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing."`,
                `"Tinggallah di dalam Aku dan Aku di dalam kamu. Sama seperti ranting tidak dapat berbuah dari dirinya sendiri, kalau ia tidak tinggal pada pokok anggur, demikian juga kamu tidak berbuah, jikalau kamu tidak tinggal di dalam Aku. Akulah pokok anggur dan kamulah ranting-rantingnya. Barangsiapa tinggal di dalam Aku dan Aku di dalam dia, ia berbuah banyak, sebab di luar Aku kamu tidak dapat berbuat apa-apa."`,
                `"Blijf in mij, dan blijf ik in u. Een rank kan geen vrucht dragen als hij niet aan de wijnstok blijft; zo kunnen jullie geen vrucht dragen als jullie niet in mij blijven. Ik ben de wijnstok en jullie zijn de ranken. Als iemand in mij blijft en ik in hem, zal hij veel vrucht dragen. Maar zonder mij kun je niets doen."`
              )}
            </p>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em" }}>
              — <VerseRef id="john-15-4-5">{t("John 15:4–5", "Yohanes 15:4–5", "Johannes 15:4–5")}</VerseRef> (NIV)
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: "oklch(80% 0.025 80)", lineHeight: 1.9, margin: 0 }}>
              {t(
                "Jesus spoke these words in the upper room, hours before the cross — knowing exactly what kind of demands lay ahead of his disciples. He did not give them a strategy. He gave them a metaphor. Stay connected. The branch doesn't produce fruit by trying harder. It produces fruit by staying in the vine.",
                "Yesus mengucapkan kata-kata ini di ruang atas, beberapa jam sebelum salib — mengetahui dengan pasti tuntutan seperti apa yang akan dihadapi murid-murid-Nya. Ia tidak memberi mereka strategi. Ia memberi mereka metafora. Tetaplah terhubung. Ranting tidak menghasilkan buah dengan berusaha lebih keras. Ia menghasilkan buah dengan tinggal di pokok anggur.",
                "Jezus sprak deze woorden in de bovenzaal, uren voor het kruis — precies wetend wat voor eisen op zijn leerlingen lagen te wachten. Hij gaf hen geen strategie. Hij gaf hen een metafoor. Blijf verbonden. De rank produceert geen vrucht door harder te proberen. Ze produceert vrucht door in de wijnstok te blijven."
              )}
            </p>
            <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: "oklch(80% 0.025 80)", lineHeight: 1.9, margin: 0 }}>
              {t(
                "Abiding while leading does not mean withdrawing from the work. It means bringing the work back into the presence of the One who called you to it. It means letting your prayer life be shaped by what is actually happening — the fear, the frustration, the hope, the weariness. It means refusing to let leadership become the thing that replaces God.",
                "Tinggal dalam Kristus selagi memimpin tidak berarti menarik diri dari pekerjaan. Ini berarti membawa pekerjaan kembali ke hadirat Dia yang memanggil Anda untuk itu. Ini berarti membiarkan kehidupan doa Anda dibentuk oleh apa yang sebenarnya terjadi — ketakutan, frustrasi, harapan, kelelahan. Ini berarti menolak membiarkan kepemimpinan menjadi hal yang menggantikan Tuhan.",
                "Blijven terwijl je leidt betekent niet terugtrekken van het werk. Het betekent het werk terugbrengen in de aanwezigheid van Hem die je ertoe heeft geroepen. Het betekent je gebedsleven laten vormen door wat er werkelijk gebeurt — de angst, de frustratie, de hoop, de vermoeidheid. Het betekent weigeren leiderschap het ding te laten worden dat God vervangt."
              )}
            </p>
            <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: "oklch(80% 0.025 80)", lineHeight: 1.9, margin: 0 }}>
              {t(
                "The five drifts described in this module are not character flaws. They are the natural gravitational pull of every demanding leadership role. What protects you is not greater willpower. It is a daily, honest, returning. Back to the vine. Back to the One who holds you — and the work — in his hands.",
                "Lima hanyut yang dijelaskan dalam modul ini bukan cacat karakter. Mereka adalah tarikan gravitasi alami dari setiap peran kepemimpinan yang menuntut. Yang melindungi Anda bukan kemauan yang lebih besar. Ini adalah kembali yang sehari-hari, jujur. Kembali ke pokok anggur. Kembali kepada Dia yang memegang Anda — dan pekerjaan — di tangan-Nya.",
                "De vijf afdrijvingen beschreven in deze module zijn geen karaktergebreken. Ze zijn de natuurlijke zwaartekrachtaantrekking van elke veeleisende leiderschapsrol. Wat je beschermt is geen grotere wilskracht. Het is een dagelijks, eerlijk terugkeren. Terug naar de wijnstok. Terug naar Hem die jou — en het werk — in zijn handen houdt."
              )}
            </p>
          </div>

          {/* Paul as witness */}
          <div style={{ background: "oklch(18% 0.09 260)", padding: "48px 44px", borderRadius: 4, marginTop: 64 }}>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 20 }}>
              {t("A final witness — Paul", "Satu saksi terakhir — Paulus", "Een laatste getuige — Paulus")}
            </p>
            <p style={{ fontFamily: serif, fontSize: "clamp(20px, 2.4vw, 24px)", fontStyle: "italic", color: offWhite, lineHeight: 1.75, marginBottom: 20 }}>
              {t(
                `"I have fought the good fight, I have finished the race, I have kept the faith."`,
                `"Aku telah mengakhiri pertandingan yang baik, aku telah mencapai garis akhir dan aku telah memelihara iman."`,
                `"Ik heb de goede strijd gestreden, ik heb de wedloop volbracht, ik heb het geloof bewaard."`
              )}
            </p>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em", marginBottom: 28 }}>
              — <VerseRef id="2-tim-4-7">{t("2 Timothy 4:7", "2 Timotius 4:7", "2 Timotheüs 4:7")}</VerseRef> (NIV)
            </p>
            <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: "oklch(76% 0.03 80)", lineHeight: 1.9, margin: 0 }}>
              {t(
                "Paul wrote these words from prison, near the end of his life. He had been shipwrecked, beaten, imprisoned, abandoned. He had led through more difficulty than most of us will ever know. And this is what he said mattered: not the size of the churches, not the number of converts, not the influence he'd built. He kept the faith. That is the goal. Not just to lead well — but to finish with your soul intact.",
                "Paulus menulis kata-kata ini dari penjara, menjelang akhir hidupnya. Ia pernah karam, dipukuli, dipenjara, ditinggalkan. Ia telah memimpin melalui lebih banyak kesulitan dari yang pernah diketahui kebanyakan dari kita. Dan inilah yang ia katakan penting: bukan ukuran gereja-gereja, bukan jumlah petobat, bukan pengaruh yang telah ia bangun. Ia memelihara iman. Itulah tujuannya. Bukan hanya memimpin dengan baik — tetapi menyelesaikan dengan jiwa yang utuh.",
                "Paulus schreef deze woorden uit de gevangenis, tegen het einde van zijn leven. Hij was schipbreuk geleden, geslagen, gevangen gezet, verlaten. Hij had geleid door meer moeilijkheden dan de meesten van ons ooit zullen kennen. En dit is wat hij zei dat telde: niet de grootte van de kerken, niet het aantal bekeerlingen, niet de invloed die hij had opgebouwd. Hij bewaarde het geloof. Dat is het doel. Niet alleen goed leidinggeven — maar eindigen met je ziel intact."
              )}
            </p>
          </div>

          {/* Prayer of surrender */}
          <div style={{ marginTop: 72, textAlign: "center" }}>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 32 }}>
              {t("A prayer of surrender", "Doa penyerahan diri", "Een gebed van overgave")}
            </p>
            <div style={{ background: "oklch(18% 0.09 260)", padding: "52px 48px", borderRadius: 4, textAlign: "left" }}>
              <p style={{ fontFamily: serif, fontSize: "clamp(18px, 2.2vw, 22px)", fontStyle: "italic", color: "oklch(90% 0.02 80)", lineHeight: 1.9, margin: 0 }}>
                {t(
                  `Lord, I am more tired than I have admitted. More discouraged than I have let on. More proud, at times, than I have recognised. I have drifted in ways I did not notice until now.\n\nI return. Not with great strength — just with the little I have. I bring the work to you. I bring the people to you. I bring the gaps between my vision and my reality — and I lay them in your hands.\n\nKeep me rooted. Not in my platform, not in my performance, not in what people think of me — but in you. Remind me, today, why I said yes in the first place. And give me one more day of faithfulness in the vine.\n\nAmen.`,
                  `Tuhan, saya lebih lelah dari yang telah saya akui. Lebih patah semangat dari yang telah saya biarkan terlihat. Lebih sombong, terkadang, dari yang telah saya sadari. Saya telah hanyut dengan cara yang tidak saya sadari hingga sekarang.\n\nSaya kembali. Bukan dengan kekuatan yang besar — hanya dengan sedikit yang saya miliki. Saya membawa pekerjaan kepada-Mu. Saya membawa orang-orang kepada-Mu. Saya membawa kesenjangan antara visi saya dan realitas saya — dan saya meletakkannya di tangan-Mu.\n\nJagalah saya berakar. Bukan dalam platform saya, bukan dalam kinerja saya, bukan dalam apa yang orang pikirkan tentang saya — tetapi dalam-Mu. Ingatkan saya, hari ini, mengapa saya berkata ya pada awalnya. Dan beri saya satu hari lagi kesetiaan dalam pokok anggur.\n\nAmin.`,
                  `Heer, ik ben vermoeider dan ik heb toegegeven. Meer ontmoedigd dan ik heb laten zien. Soms trotser dan ik heb erkend. Ik ben afgedreven op manieren die ik niet opmerkte tot nu.\n\nIk keer terug. Niet met grote kracht — alleen met het weinige dat ik heb. Ik breng het werk bij U. Ik breng de mensen bij U. Ik breng de kloof tussen mijn visie en mijn werkelijkheid — en ik leg ze in Uw handen.\n\nHoud mij geworteld. Niet in mijn platform, niet in mijn prestaties, niet in wat mensen van mij denken — maar in U. Herinner mij, vandaag, waarom ik oorspronkelijk ja heb gezegd. En geef mij nog één dag van trouw in de wijnstok.\n\nAmen.`
                ).split("\n\n").map((para, pi) => (
                  <span key={pi}>
                    {pi > 0 && <><br /><br /></>}
                    {para}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: "oklch(19% 0.09 260)", padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 700, color: offWhite, marginBottom: 16, fontStyle: "italic" }}>
          {t("Keep Growing", "Terus Bertumbuh", "Blijf Groeien")}
        </h2>
        <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: "oklch(76% 0.03 80)", lineHeight: 1.75, maxWidth: 520, margin: "0 auto 40px" }}>
          {t(
            "Explore more resources to deepen your cross-cultural leadership.",
            "Jelajahi lebih banyak sumber untuk memperdalam kepemimpinan lintas budaya Anda.",
            "Verken meer bronnen om je intercultureel leiderschap te verdiepen."
          )}
        </p>
        <Link href="/resources" style={{ display: "inline-block", padding: "14px 36px", background: orange, color: offWhite, fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, textDecoration: "none", borderRadius: 4, letterSpacing: "0.04em" }}>
          {t("← Content Library", "← Perpustakaan Konten", "← Contentbibliotheek")}
        </Link>
      </div>

      {/* Verse Popup */}
      {activeVerse && verseData && (
        <div
          onClick={() => setActiveVerse(null)}
          style={{ position: "fixed", inset: 0, background: "oklch(10% 0.05 260 / 0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: offWhite, borderRadius: 12, padding: "44px 40px", maxWidth: 540, width: "100%" }}
          >
            <p style={{ fontFamily: serif, fontSize: 22, lineHeight: 1.7, color: navy, fontStyle: "italic", marginBottom: 20 }}>
              "{lang === "en" ? verseData.en : lang === "id" ? verseData.id : verseData.nl}"
            </p>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em", marginBottom: 28 }}>
              — {lang === "en" ? verseData.en_ref : lang === "id" ? verseData.id_ref : verseData.nl_ref}{" "}
              {lang === "en" ? "(NIV)" : lang === "id" ? "(TB)" : "(NBV)"}
            </p>
            <button
              onClick={() => setActiveVerse(null)}
              style={{ padding: "10px 24px", background: navy, color: offWhite, border: "none", borderRadius: 6, fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
            >
              {t("Close", "Tutup", "Sluiten")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
