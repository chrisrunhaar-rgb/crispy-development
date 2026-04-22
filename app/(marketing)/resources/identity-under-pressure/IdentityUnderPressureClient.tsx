"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const t = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

// ── BRAND TOKENS ─────────────────────────────────────────────────────────────
const navy     = "oklch(22% 0.10 260)";
const orange   = "oklch(65% 0.15 45)";
const offWhite = "oklch(97% 0.005 80)";
const lightGray = "oklch(95% 0.008 80)";
const bodyText = "oklch(38% 0.05 260)";

// ── VERSE DATA ────────────────────────────────────────────────────────────────
const VERSES = {
  "matt-4-3-4": {
    ref: "Matthew 4:3–4",
    ref_id: "Matius 4:3–4",
    ref_nl: "Matteüs 4:3–4",
    en: "The tempter came to him and said, 'If you are the Son of God, tell these stones to become bread.' Jesus answered, 'It is written: Man shall not live on bread alone, but on every word that comes from the mouth of God.'",
    id: "Lalu datanglah si pencoba itu dan berkata kepada-Nya: 'Jika Engkau Anak Allah, perintahkanlah supaya batu-batu ini menjadi roti.' Tetapi Yesus menjawab: 'Ada tertulis: Manusia hidup bukan dari roti saja, tetapi dari setiap firman yang keluar dari mulut Allah.'",
    nl: "De verzoeker kwam naar hem toe en zei: 'Als u de Zoon van God bent, geef dan opdracht aan deze stenen om brood te worden.' Maar Jezus gaf hem ten antwoord: 'Er staat geschreven: Een mens leeft niet van brood alleen, maar van ieder woord dat klinkt uit de mond van God.'",
  },
  "psalm-46-1-2": {
    ref: "Psalm 46:1–2",
    ref_id: "Mazmur 46:1–2",
    ref_nl: "Psalm 46:1–2",
    en: "God is our refuge and strength, an ever-present help in trouble. Therefore we will not fear, though the earth give way and the mountains fall into the heart of the sea.",
    id: "Allah itu bagi kita tempat perlindungan dan kekuatan, sebagai penolong dalam kesesakan sangat terbukti. Sebab itu kita tidak akan takut, sekalipun bumi berubah, sekalipun gunung-gunung goncang di dalam laut.",
    nl: "God is voor ons een veilige vesting, een betrouwbare hulp in nood. Daarom vrezen wij niet, al wankelt de aarde en storten de bergen in het diepst van de zee.",
  },
  "col-3-3": {
    ref: "Colossians 3:3",
    ref_id: "Kolose 3:3",
    ref_nl: "Kolossenzen 3:3",
    en: "For you died, and your life is now hidden with Christ in God.",
    id: "Sebab kamu telah mati dan hidupmu tersembunyi bersama dengan Kristus di dalam Allah.",
    nl: "U bent immers gestorven, en uw leven ligt met Christus verborgen in God.",
  },
  "isa-49-16": {
    ref: "Isaiah 49:16",
    ref_id: "Yesaya 49:16",
    ref_nl: "Jesaja 49:16",
    en: "See, I have engraved you on the palms of my hands.",
    id: "Lihat, Aku telah melukiskan engkau di telapak tangan-Ku.",
    nl: "Maar zie, Ik heb u in mijn handpalmen gegrift.",
  },
};

// ── ANCHOR DATA ───────────────────────────────────────────────────────────────
type AnchorKey = "calling" | "values" | "community" | "faith" | "story" | "body";

const ANCHORS: {
  key: AnchorKey;
  icon: string;
  color: string;
  en_title: string; id_title: string; nl_title: string;
  en_tagline: string; id_tagline: string; nl_tagline: string;
  en_strength: string; id_strength: string; nl_strength: string;
  en_threat: string; id_threat: string; nl_threat: string;
  en_scenario: string; id_scenario: string; nl_scenario: string;
  en_practice: string; id_practice: string; nl_practice: string;
  en_question: string; id_question: string; nl_question: string;
}[] = [
  {
    key: "calling",
    icon: "🧭",
    color: "oklch(52% 0.16 260)",
    en_title: "Calling",
    id_title: "Panggilan",
    nl_title: "Roeping",
    en_tagline: "Knowing why you are here",
    id_tagline: "Mengetahui mengapa Anda ada di sini",
    nl_tagline: "Weten waarom je hier bent",
    en_strength: "When your sense of calling is clear, external pressure loses much of its power to define you. You know what you came to do — and that knowledge insulates you from the noise of comparison, criticism, and cultural confusion. Calling gives you a 'why' strong enough to carry almost any 'how.'",
    id_strength: "Ketika rasa panggilan Anda jelas, tekanan eksternal kehilangan banyak kekuatannya untuk mendefinisikan Anda. Anda tahu apa yang Anda datangi untuk dilakukan — dan pengetahuan itu melindungi Anda dari kebisingan perbandingan, kritik, dan kebingungan budaya. Panggilan memberi Anda 'mengapa' yang cukup kuat untuk menanggung hampir semua 'bagaimana.'",
    nl_strength: "Wanneer uw roepingsbesef helder is, verliest externe druk veel van zijn kracht om u te definiëren. U weet waarvoor u gekomen bent — en die kennis beschermt u tegen het lawaai van vergelijkingen, kritiek en culturele verwarring. Roeping geeft u een 'waarom' dat sterk genoeg is om bijna elk 'hoe' te dragen.",
    en_threat: "Pressure attacks calling through chronic fruitlessness — when the work produces nothing visible for so long that you begin to wonder if you misheard God. It attacks through comparison with leaders who appear more successful. It attacks through people who question your motives or competence, planting seeds of self-doubt that slowly erode the original conviction that brought you here.",
    id_threat: "Tekanan menyerang panggilan melalui ketidakberbuahan yang kronis — ketika pekerjaan tidak menghasilkan sesuatu yang terlihat begitu lama sehingga Anda mulai bertanya-tanya apakah Anda salah mendengar Tuhan. Tekanan menyerang melalui perbandingan dengan pemimpin yang tampak lebih sukses. Tekanan menyerang melalui orang-orang yang mempertanyakan motif atau kompetensi Anda, menanam benih keraguan diri yang perlahan mengikis keyakinan awal yang membawa Anda ke sini.",
    nl_threat: "Druk valt roeping aan via chronische vruchteloosheid — wanneer het werk zo lang niets zichtbaars oplevert dat u zich begint af te vragen of u God verkeerd begrepen hebt. Het valt aan via vergelijking met leiders die succesvoller lijken. Het valt aan via mensen die uw motieven of competentie in twijfel trekken, waardoor zaaien van twijfel geleidelijk de oorspronkelijke overtuiging die u hier bracht, uithollen.",
    en_scenario: "You've been in your role for two years. A colleague who started at the same time has planted three new groups and is being celebrated across the network. You've invested deeply in two relationships that just walked away. You sit down to prepare another session for the same small, unchanged group — and wonder if you ever actually heard God correctly.",
    id_scenario: "Anda telah berada dalam peran Anda selama dua tahun. Seorang rekan yang mulai pada waktu yang sama telah mendirikan tiga kelompok baru dan dirayakan di seluruh jaringan. Anda telah berinvestasi dalam dua hubungan yang baru saja pergi. Anda duduk untuk mempersiapkan sesi lain untuk kelompok kecil yang sama yang tidak berubah — dan bertanya-tanya apakah Anda pernah benar-benar mendengar Tuhan dengan benar.",
    nl_scenario: "U bent al twee jaar in uw rol. Een collega die op hetzelfde moment begon, heeft drie nieuwe groepen geplant en wordt door het hele netwerk gevierd. U hebt diep geïnvesteerd in twee relaties die net zijn weggegaan. U gaat zitten om een nieuwe sessie voor te bereiden voor dezelfde kleine, onveranderde groep — en vraagt zich af of u God ooit echt juist gehoord hebt.",
    en_practice: "Write your 'calling statement' — three sentences maximum. When did you first sense this was what you were made for? What would be unfinished if you walked away today? Read it aloud once a week, especially in dry seasons.",
    id_practice: "Tuliskan 'pernyataan panggilan' Anda — maksimal tiga kalimat. Kapan Anda pertama kali merasakan bahwa inilah yang Anda diciptakan? Apa yang akan tetap tidak selesai jika Anda pergi hari ini? Baca dengan suara keras seminggu sekali, terutama di musim-musim kering.",
    nl_practice: "Schrijf uw 'roepingsverklaring' — maximaal drie zinnen. Wanneer voelde u voor het eerst dat dit was waarvoor u gemaakt bent? Wat zou onafgewerkt blijven als u vandaag wegging? Lees het één keer per week hardop, vooral in droge seizoenen.",
    en_question: "If your work produced nothing measurable for twelve months, would you still know you are in the right place? What does your answer reveal?",
    id_question: "Jika pekerjaan Anda tidak menghasilkan sesuatu yang terukur selama dua belas bulan, apakah Anda masih tahu bahwa Anda berada di tempat yang tepat? Apa yang diungkapkan jawaban Anda?",
    nl_question: "Als uw werk twaalf maanden lang niets meetbaars opleverde, zou u dan nog steeds weten dat u op de juiste plek bent? Wat openbaart uw antwoord?",
  },
  {
    key: "values",
    icon: "⚖️",
    color: "oklch(58% 0.17 35)",
    en_title: "Values",
    id_title: "Nilai-nilai",
    nl_title: "Waarden",
    en_tagline: "What you will and won't compromise",
    id_tagline: "Apa yang akan dan tidak akan Anda kompromikan",
    nl_tagline: "Wat u wel en niet compromitteert",
    en_strength: "Clearly named values function as an internal compass — they tell you which decisions are yours to make and which are not, regardless of what the surrounding culture expects. In cross-cultural environments where almost everything is negotiable, knowing what is non-negotiable gives you a reliable centre. Values are the skeleton that keeps identity upright when external pressure tries to reshape you.",
    id_strength: "Nilai-nilai yang dinamai dengan jelas berfungsi sebagai kompas internal — nilai-nilai itu memberi tahu Anda keputusan mana yang menjadi milik Anda dan mana yang tidak, terlepas dari apa yang diharapkan budaya sekitar. Dalam lingkungan lintas budaya di mana hampir semua hal dapat dinegosiasikan, mengetahui apa yang tidak dapat dinegosiasikan memberi Anda pusat yang andal. Nilai-nilai adalah kerangka yang membuat identitas tetap tegak ketika tekanan eksternal mencoba membentuk kembali Anda.",
    nl_strength: "Duidelijk benoemde waarden fungeren als een intern kompas — ze vertellen u welke beslissingen van u zijn en welke niet, ongeacht wat de omringende cultuur verwacht. In interculturele omgevingen waar bijna alles onderhandelbaar is, geeft het weten wat niet onderhandelbaar is u een betrouwbaar centrum. Waarden zijn het skelet dat de identiteit overeind houdt wanneer externe druk probeert u te hervormen.",
    en_threat: "Cultural immersion applies constant pressure to blend — to adopt local norms, local communication styles, local definitions of success. This is appropriate in many ways. But slow, unexamined accommodation can gradually shift your values without your noticing. By the time you realise what has happened, you have been making decisions from a value set that is no longer quite yours.",
    id_threat: "Imersi budaya menerapkan tekanan konstan untuk berbaur — untuk mengadopsi norma lokal, gaya komunikasi lokal, definisi kesuksesan lokal. Ini sesuai dalam banyak hal. Tetapi akomodasi yang lambat dan tidak diperiksa dapat secara bertahap menggeser nilai-nilai Anda tanpa Anda sadari. Pada saat Anda menyadari apa yang telah terjadi, Anda telah membuat keputusan dari seperangkat nilai yang bukan sepenuhnya milik Anda lagi.",
    nl_threat: "Culturele onderdompeling oefent constante druk uit om te mengen — om lokale normen, lokale communicatiestijlen en lokale definities van succes over te nemen. Dat is op veel manieren passend. Maar langzame, ononderzochte aanpassing kan uw waarden geleidelijk verschuiven zonder dat u het merkt. Tegen de tijd dat u realiseert wat er is gebeurd, neemt u beslissingen vanuit een waardenstelsel dat niet langer helemaal het uwe is.",
    en_scenario: "Your team culture has quietly shifted over eighteen months toward avoiding difficult conversations. You notice you've stopped naming concerns in meetings because the cost of disruption feels too high. One day you realise you've become someone who prioritises peace over truth — and you're not sure when that became your approach.",
    id_scenario: "Budaya tim Anda telah bergeser secara diam-diam selama delapan belas bulan ke arah menghindari percakapan sulit. Anda perhatikan bahwa Anda telah berhenti menyebutkan kekhawatiran dalam rapat karena biaya gangguan terasa terlalu tinggi. Suatu hari Anda menyadari bahwa Anda telah menjadi seseorang yang memprioritaskan perdamaian daripada kebenaran — dan Anda tidak yakin kapan itu menjadi pendekatan Anda.",
    nl_scenario: "De teamcultuur is de afgelopen achttien maanden stilletjes verschoven naar het vermijden van moeilijke gesprekken. U merkt dat u gestopt bent met het benoemen van zorgen in vergaderingen omdat de kosten van verstoring te hoog aanvoelen. Op een dag realiseert u zich dat u iemand bent geworden die vrede boven waarheid stelt — en u weet niet meer wanneer dat uw aanpak werd.",
    en_practice: "Name your three core values — one word each. For each, write one behaviour that would demonstrate it is active in your life. Review quarterly and ask honestly: did my decisions this season reflect these values?",
    id_practice: "Sebutkan tiga nilai inti Anda — satu kata masing-masing. Untuk masing-masing, tuliskan satu perilaku yang akan menunjukkan bahwa nilai itu aktif dalam hidup Anda. Tinjau setiap kuartal dan tanyakan dengan jujur: apakah keputusan saya musim ini mencerminkan nilai-nilai ini?",
    nl_practice: "Noem uw drie kernwaarden — elk één woord. Schrijf voor elk één gedrag dat aantoont dat het actief is in uw leven. Evalueer elk kwartaal en vraag eerlijk: weerspiegelden mijn beslissingen dit seizoen deze waarden?",
    en_question: "Where in the last six months have you acted against something you believe — and told yourself it was unavoidable? Was it?",
    id_question: "Di mana dalam enam bulan terakhir Anda bertindak melawan sesuatu yang Anda percaya — dan meyakinkan diri sendiri bahwa itu tidak dapat dihindari? Benarkah demikian?",
    nl_question: "Waar hebt u de afgelopen zes maanden gehandeld tegen iets wat u gelooft — en uzelf verteld dat het onvermijdelijk was? Was het dat ook?",
  },
  {
    key: "community",
    icon: "👥",
    color: "oklch(50% 0.16 170)",
    en_title: "Community",
    id_title: "Komunitas",
    nl_title: "Gemeenschap",
    en_tagline: "Who knows and loves you",
    id_tagline: "Siapa yang mengenal dan mencintai Anda",
    nl_tagline: "Wie u kent en liefheeft",
    en_strength: "We know ourselves partly through the eyes of people who know us well. A trusted community acts as a mirror that reflects who we actually are — not who pressure is trying to turn us into. When your sense of self becomes blurred under sustained pressure, community is what names you back to yourself. It says: 'This is who you are. We've seen it for years. The pressure is lying.'",
    id_strength: "Kita mengenal diri kita sendiri sebagian melalui mata orang-orang yang mengenal kita dengan baik. Komunitas yang dipercaya bertindak sebagai cermin yang mencerminkan siapa kita sebenarnya — bukan siapa yang tekanan coba ubah kita menjadi. Ketika rasa diri Anda menjadi kabur di bawah tekanan yang berkelanjutan, komunitas adalah apa yang menamai Anda kembali kepada diri sendiri. Komunitas berkata: 'Inilah dirimu. Kami telah melihatnya selama bertahun-tahun. Tekanan itu berbohong.'",
    nl_strength: "We kennen onszelf deels door de ogen van mensen die ons goed kennen. Een vertrouwde gemeenschap fungeert als een spiegel die weerspiegelt wie we werkelijk zijn — niet wie druk ons probeert te maken. Wanneer uw zelfgevoel vervaagt onder aanhoudende druk, is gemeenschap wat u weer bij uzelf terugnoemt. Ze zegt: 'Dit is wie u bent. We hebben het jarenlang gezien. De druk liegt.'",
    en_threat: "Cross-cultural ministry and leadership work are among the loneliest professions on earth. Role expectations, cultural distance, frequent relocation, language barriers, and the weight of being 'the outsider' all work against deep community. Over time, the isolation is not just socially painful — it strips the leader of the external witnesses to their own identity, leaving only pressure's voice in the room.",
    id_threat: "Pelayanan dan kepemimpinan lintas budaya adalah salah satu profesi paling kesepian di bumi. Harapan peran, jarak budaya, perpindahan yang sering, hambatan bahasa, dan beban menjadi 'orang luar' semuanya melawan komunitas yang dalam. Seiring waktu, isolasi tidak hanya menyakitkan secara sosial — itu melepas pemimpin dari saksi-saksi eksternal untuk identitas mereka sendiri, hanya menyisakan suara tekanan di ruangan itu.",
    nl_threat: "Intercultureel werk behoort tot de eenzaamste beroepen op aarde. Rolverplichtingen, culturele afstand, frequent verhuizen, taalbarrières en de last van 'de buitenstaander' zijn allemaal werkzaam tégen diepe gemeenschap. Na verloop van tijd is de isolatie niet alleen sociaal pijnlijk — het ontneemt de leider de externe getuigen van zijn eigen identiteit, zodat alleen de stem van de druk in de kamer overblijft.",
    en_scenario: "You've just come through a public failure — a project collapse, a team conflict that went wrong, a decision that cost credibility. In the aftermath, most people in your network treat you differently. But one person calls you by name, sits with you in it, and says nothing except: 'I know who you are. This doesn't change that.' That person is doing more for your identity than any strategy.",
    id_scenario: "Anda baru saja melewati kegagalan publik — runtuhnya proyek, konflik tim yang salah, keputusan yang menghabiskan kredibilitas. Setelah itu, sebagian besar orang dalam jaringan Anda memperlakukan Anda secara berbeda. Tetapi satu orang memanggil Anda dengan nama, duduk bersama Anda di dalamnya, dan tidak berkata apa-apa kecuali: 'Saya tahu siapa Anda. Ini tidak mengubah itu.' Orang itu melakukan lebih banyak untuk identitas Anda daripada strategi apa pun.",
    nl_scenario: "U hebt zojuist een publieke mislukking doorgemaakt — een projectineenstorting, een teamconflict dat fout liep, een beslissing die geloofwaardigheid kostte. Daarna behandelen de meeste mensen in uw netwerk u anders. Maar één persoon noemt u bij naam, zit bij u daarin, en zegt niets behalve: 'Ik weet wie u bent. Dit verandert dat niet.' Die persoon doet meer voor uw identiteit dan welke strategie ook.",
    en_practice: "Identify two to three people who knew you before this role and still know you now. Schedule a non-agenda conversation with one of them this month. Share something real — not just progress updates. Ask them: 'Do I seem like myself to you lately?'",
    id_practice: "Identifikasi dua hingga tiga orang yang mengenal Anda sebelum peran ini dan masih mengenal Anda sekarang. Jadwalkan percakapan tanpa agenda dengan salah satu dari mereka bulan ini. Bagikan sesuatu yang nyata — bukan hanya pembaruan kemajuan. Tanyakan kepada mereka: 'Apakah saya tampak seperti diri saya sendiri bagimu akhir-akhir ini?'",
    nl_practice: "Identificeer twee tot drie mensen die u kenden vóór deze rol en u nu nog steeds kennen. Plan deze maand een gesprek zonder agenda met één van hen. Deel iets echts — niet alleen voortgangsrapportages. Vraag hen: 'Lijk ik de laatste tijd op mijzelf?'",
    en_question: "Who in your life currently has both the access and the freedom to tell you the truth about yourself? If no one comes to mind, what needs to change?",
    id_question: "Siapa dalam hidup Anda yang saat ini memiliki akses dan kebebasan untuk menceritakan kebenaran tentang diri Anda? Jika tidak ada yang terlintas di benak, apa yang perlu diubah?",
    nl_question: "Wie in uw leven heeft momenteel zowel de toegang als de vrijheid om u de waarheid over uzelf te vertellen? Als er niemand bij u opkomt, wat moet er dan veranderen?",
  },
  {
    key: "faith",
    icon: "✝️",
    color: "oklch(55% 0.18 305)",
    en_title: "Faith",
    id_title: "Iman",
    nl_title: "Geloof",
    en_tagline: "Who God says you are",
    id_tagline: "Siapa Anda menurut Allah",
    nl_tagline: "Wie God zegt dat u bent",
    en_strength: "In the wilderness, Jesus was tempted three times. Every temptation was fundamentally an identity temptation: 'If you are the Son of God...' The enemy's strategy was not to make Jesus do something wrong — it was to make him act as if he needed to prove who he was. Jesus' identity was secure because it had been spoken at his baptism: 'This is my beloved Son, in whom I am well pleased.' He did not need to perform. He already knew. Faith works the same way — it holds the identity God has declared over us as more authoritative than anything circumstances or culture can say.",
    id_strength: "Di padang gurun, Yesus dicobai tiga kali. Setiap godaan pada dasarnya adalah godaan identitas: 'Jika Engkau Anak Allah...' Strategi musuh bukan untuk membuat Yesus melakukan sesuatu yang salah — itu adalah untuk membuatnya bertindak seolah-olah dia perlu membuktikan siapa dirinya. Identitas Yesus aman karena telah diucapkan pada pembaptisan-Nya: 'Inilah Anak-Ku yang Kukasihi, kepada-Nyalah Aku berkenan.' Dia tidak perlu menunjukkan. Dia sudah tahu. Iman bekerja dengan cara yang sama — iman memegang identitas yang telah dinyatakan Allah atas kita sebagai lebih otoritatif daripada apa pun yang dapat dikatakan oleh keadaan atau budaya.",
    nl_strength: "In de woestijn werd Jezus driemaal beproefd. Elke verleiding was in de kern een identiteitsverleiding: 'Als u de Zoon van God bent...' De strategie van de vijand was niet om Jezus iets verkeerds te laten doen — het was om hem te laten handelen alsof hij moest bewijzen wie hij was. Jezus' identiteit was veilig omdat die bij zijn doop was uitgesproken: 'Dit is mijn geliefde Zoon, in hem vind ik vreugde.' Hij hoefde niet te presteren. Hij wist het al. Geloof werkt op dezelfde manier — het houdt de identiteit die God over ons heeft verklaard als gezaghebbender dan wat omstandigheden of cultuur ook kunnen zeggen.",
    en_threat: "Spiritual drought is the most dangerous faith attack. When prayer feels hollow, Scripture feels abstract, and God feels distant — often precisely because of the sustained stress of cross-cultural life — the faith anchor begins to drag. A leader in spiritual drought is no longer drawing identity from God's voice. They are left to draw it from performance, approval, and comparison instead. The container empties and pressure rushes in.",
    id_threat: "Kekeringan rohani adalah serangan iman yang paling berbahaya. Ketika doa terasa hampa, Kitab Suci terasa abstrak, dan Allah terasa jauh — seringkali justru karena tekanan berkelanjutan dari kehidupan lintas budaya — jangkar iman mulai terseret. Seorang pemimpin dalam kekeringan rohani tidak lagi mengambil identitas dari suara Allah. Mereka dibiarkan mengambilnya dari kinerja, persetujuan, dan perbandingan. Wadah kosong dan tekanan mengalir masuk.",
    nl_threat: "Geestelijke droogte is de gevaarlijkste geloofaanval. Wanneer gebed hol voelt, de Schrift abstract aanvoelt, en God ver weg lijkt — vaak juist vanwege de aanhoudende stress van het interculturele leven — begint het geloofsanker te slepen. Een leider in geestelijke droogte put zijn identiteit niet langer uit Gods stem. Ze zijn aangewezen op prestaties, goedkeuring en vergelijking in plaats daarvan. De container leegt en druk stroomt binnen.",
    en_scenario: "It is month seven of a difficult season. You haven't felt anything in prayer for weeks. You read your Bible because you're supposed to, but it lands flat. A leader you respect tells you that a true person of faith wouldn't be struggling this much. You begin to wonder if you were ever really rooted in God at all — or just performing faith well enough to fool yourself.",
    id_scenario: "Ini adalah bulan ketujuh dari musim yang sulit. Anda tidak merasakan apa pun dalam doa selama berminggu-minggu. Anda membaca Alkitab karena Anda seharusnya, tetapi terasa datar. Seorang pemimpin yang Anda hormati mengatakan bahwa orang beriman yang sejati tidak akan berjuang sebanyak ini. Anda mulai bertanya-tanya apakah Anda pernah benar-benar berakar dalam Allah sama sekali — atau hanya menampilkan iman dengan cukup baik untuk menipu diri sendiri.",
    nl_scenario: "Het is maand zeven van een moeilijk seizoen. U hebt weken niets gevoeld in gebed. U leest uw Bijbel omdat het hoort, maar het landt vlak. Een leider die u respecteert, vertelt u dat een echte gelovige zo niet zou worstelen. U begint zich af te vragen of u ooit echt geworteld was in God — of alleen geloof goed genoeg uitvoerde om uzelf te bedriegen.",
    en_practice: "Spend fifteen minutes with Psalm 46 this week. Not studying it — sitting with it. Let the language of fortress and refuge sink in below the level of analysis. Your identity in Christ is not a feeling you maintain. It is a truth you return to. Come back to it.",
    id_practice: "Habiskan lima belas menit bersama Mazmur 46 minggu ini. Bukan mempelajarinya — duduk bersamanya. Biarkan bahasa benteng dan perlindungan meresap di bawah level analisis. Identitas Anda dalam Kristus bukan perasaan yang Anda pertahankan. Itu adalah kebenaran yang Anda kembalikan. Kembalilah padanya.",
    nl_practice: "Besteed deze week vijftien minuten aan Psalm 46. Niet bestuderend — erbij zittend. Laat de taal van vesting en toevlucht doordringen onder het niveau van analyse. Uw identiteit in Christus is geen gevoel dat u onderhoudt. Het is een waarheid waar u naar terugkeert. Keer er naar terug.",
    en_question: "When the feelings are gone — when prayer is dry and Scripture is flat — what do you believe about who you are to God? Is that belief strong enough to hold you?",
    id_question: "Ketika perasaan sudah pergi — ketika doa kering dan Kitab Suci terasa datar — apa yang Anda percaya tentang siapa Anda bagi Allah? Apakah keyakinan itu cukup kuat untuk menopang Anda?",
    nl_question: "Als de gevoelens weg zijn — wanneer gebed droog is en de Schrift vlak — wat gelooft u dan over wie u bent voor God? Is dat geloof sterk genoeg om u vast te houden?",
  },
  {
    key: "story",
    icon: "📖",
    color: "oklch(56% 0.15 50)",
    en_title: "Story",
    id_title: "Cerita",
    nl_title: "Verhaal",
    en_tagline: "The through-line of your life",
    id_tagline: "Benang merah kehidupan Anda",
    nl_tagline: "De rode draad van uw leven",
    en_strength: "Your story — the accumulation of experiences, transitions, failures, and graces that have formed you — is a source of stable identity that the present moment cannot overwrite. When you know your story, you have evidence: you have been here before, God was faithful before, you are not who you were ten years ago. Story provides continuity. It situates the current pressure inside a larger arc that has meaning and direction.",
    id_strength: "Cerita Anda — akumulasi pengalaman, transisi, kegagalan, dan anugerah yang telah membentuk Anda — adalah sumber identitas yang stabil yang tidak dapat ditimpa oleh momen saat ini. Ketika Anda mengetahui cerita Anda, Anda memiliki bukti: Anda pernah ada di sini sebelumnya, Allah setia sebelumnya, Anda bukan siapa yang Anda dulu sepuluh tahun lalu. Cerita memberikan kesinambungan. Cerita menempatkan tekanan saat ini di dalam busur yang lebih besar yang memiliki makna dan arah.",
    nl_strength: "Uw verhaal — de opeenstapeling van ervaringen, overgangen, mislukkingen en genaden die u gevormd hebben — is een bron van stabiele identiteit die het huidige moment niet kan overschrijven. Wanneer u uw verhaal kent, heeft u bewijs: u bent hier eerder geweest, God was eerder trouw, u bent niet wie u tien jaar geleden was. Verhaal biedt continuïteit. Het plaatst de huidige druk in een grotere boog die betekenis en richting heeft.",
    en_threat: "Sustained pressure in a foreign cultural context can sever you from your own narrative. When you are immersed in a culture that doesn't share your reference points, the stories that formed you become untellable — no one here knows the context. Over time, you can lose your sense of the thread. The person who left your home country three years ago and the person sitting here now — who connects them? If you cannot answer that, your story anchor has gone slack.",
    id_threat: "Tekanan berkelanjutan dalam konteks budaya asing dapat memutus Anda dari narasi Anda sendiri. Ketika Anda terbenam dalam budaya yang tidak berbagi titik referensi Anda, cerita-cerita yang membentuk Anda menjadi tidak dapat diceritakan — tidak ada yang di sini yang mengetahui konteksnya. Seiring waktu, Anda dapat kehilangan rasa benang itu. Orang yang meninggalkan negara asal Anda tiga tahun lalu dan orang yang duduk di sini sekarang — siapa yang menghubungkan mereka? Jika Anda tidak dapat menjawab itu, jangkar cerita Anda telah mengendur.",
    nl_threat: "Aanhoudende druk in een vreemde culturele context kan u losmaken van uw eigen verhaal. Wanneer u ondergedompeld bent in een cultuur die uw referentiepunten niet deelt, worden de verhalen die u gevormd hebben onverteerbaar — niemand hier kent de context. Na verloop van tijd kunt u het gevoel voor de draad verliezen. De persoon die drie jaar geleden uw thuisland verliet en de persoon die hier nu zit — wie verbindt hen? Als u dat niet kunt beantwoorden, is uw verhaalanker losgeraakt.",
    en_scenario: "Someone in your sending church asks how you're doing. You open your mouth and realise you have no idea how to tell the story of the last eighteen months in a way that makes sense to someone who wasn't there. The gap between your experience and their frame of reference is so wide that you close down, say 'it's been hard,' and move on. But the untold story is accumulating.",
    id_scenario: "Seseorang di gereja pengutus Anda bertanya bagaimana keadaan Anda. Anda membuka mulut dan menyadari bahwa Anda tidak tahu bagaimana menceritakan kisah delapan belas bulan terakhir dengan cara yang masuk akal bagi seseorang yang tidak ada di sana. Kesenjangan antara pengalaman Anda dan kerangka referensi mereka begitu lebar sehingga Anda menutup diri, berkata 'itu sulit,' dan melanjutkan. Tetapi cerita yang tidak terceritakan terus terakumulasi.",
    nl_scenario: "Iemand in uw zendingsgemeente vraagt hoe het met u gaat. U opent uw mond en realiseert zich dat u geen idee heeft hoe u het verhaal van de afgelopen achttien maanden moet vertellen op een manier die klopt voor iemand die er niet bij was. De kloof tussen uw ervaring en hun referentiekader is zo groot dat u zich afsluit, zegt 'het was moeilijk,' en verdergaat. Maar het onvertelde verhaal stapelt zich op.",
    en_practice: "Write the last five years of your life as a series of chapters — each chapter with a title and two or three sentences. Look for the pattern: What has been consistent? What has changed? What has God been doing across the whole arc? Share it with one person who will listen.",
    id_practice: "Tulis lima tahun terakhir kehidupan Anda sebagai serangkaian bab — setiap bab dengan judul dan dua atau tiga kalimat. Cari polanya: Apa yang konsisten? Apa yang telah berubah? Apa yang telah Allah lakukan di seluruh busur itu? Bagikan kepada satu orang yang akan mendengarkan.",
    nl_practice: "Schrijf de afgelopen vijf jaar van uw leven als een reeks hoofdstukken — elk hoofdstuk met een titel en twee of drie zinnen. Zoek het patroon: Wat is consistent geweest? Wat is er veranderd? Wat heeft God gedaan door de hele boog heen? Deel het met één persoon die zal luisteren.",
    en_question: "What is the one thread — a theme, a conviction, a wound that became a gift — that runs through every chapter of your story? Can you name it?",
    id_question: "Apa satu benang merah — sebuah tema, sebuah keyakinan, sebuah luka yang menjadi hadiah — yang membentang melalui setiap bab dalam cerita Anda? Bisakah Anda menamakannya?",
    nl_question: "Wat is de één draad — een thema, een overtuiging, een wond die een geschenk werd — die door elk hoofdstuk van uw verhaal loopt? Kunt u het benoemen?",
  },
  {
    key: "body",
    icon: "🌿",
    color: "oklch(52% 0.17 155)",
    en_title: "Body",
    id_title: "Tubuh",
    nl_title: "Lichaam",
    en_tagline: "The physical self as identity carrier",
    id_tagline: "Diri fisik sebagai pembawa identitas",
    nl_tagline: "Het fysieke zelf als identiteitsdrager",
    en_strength: "The body knows what the mind edits. Sleep patterns, appetite, posture, physical presence — these are identity signals that the body is carrying honestly even when the leader is performing fine on the surface. When the body is cared for, it becomes a stable platform for clear thinking and grounded presence. A leader who is physically rested and resourced is harder to destabilise than one who is running on three hours of sleep and two cups of coffee.",
    id_strength: "Tubuh tahu apa yang diedit oleh pikiran. Pola tidur, nafsu makan, postur, kehadiran fisik — ini adalah sinyal identitas yang dibawa tubuh dengan jujur bahkan ketika pemimpin tampil baik di permukaan. Ketika tubuh dirawat, itu menjadi platform yang stabil untuk berpikir jernih dan kehadiran yang membumi. Seorang pemimpin yang beristirahat secara fisik dan terpenuhi lebih sulit untuk tidak stabil daripada seseorang yang berjalan dengan tiga jam tidur dan dua cangkir kopi.",
    nl_strength: "Het lichaam weet wat de geest redigeert. Slaappatronen, eetlust, houding, fysieke aanwezigheid — dit zijn identiteitssignalen die het lichaam eerlijk draagt, zelfs wanneer de leider aan de oppervlakte goed presteert. Wanneer het lichaam verzorgd wordt, wordt het een stabiel platform voor helder denken en gegronde aanwezigheid. Een leider die lichamelijk uitgerust en toegerust is, is moeilijker te destabiliseren dan iemand die op drie uur slaap en twee koppen koffie loopt.",
    en_threat: "Cross-cultural environments expose the body to accumulated stress: climate, diet change, unfamiliar physical environments, the neurological load of processing a second language constantly, the stress hormones of chronic low-grade uncertainty. Over time, these compound. The body becomes a liability instead of a resource. And when physical depletion reaches a threshold, emotional regulation collapses — making every identity threat feel catastrophic.",
    id_threat: "Lingkungan lintas budaya mengekspos tubuh pada tekanan yang terakumulasi: iklim, perubahan pola makan, lingkungan fisik yang tidak familiar, beban neurologis dari terus-menerus memproses bahasa kedua, hormon stres dari ketidakpastian kronis tingkat rendah. Seiring waktu, ini menjadi semakin besar. Tubuh menjadi beban alih-alih sumber daya. Dan ketika penipisan fisik mencapai ambang batas, regulasi emosi runtuh — membuat setiap ancaman identitas terasa bencana.",
    nl_threat: "Interculturele omgevingen stellen het lichaam bloot aan geaccumuleerde stress: klimaat, verandering van dieet, onvertrouwde fysieke omgevingen, de neurologische belasting van het voortdurend verwerken van een tweede taal, de stresshormonen van chronische lage onzekerheid. Na verloop van tijd stapelt dit op. Het lichaam wordt een aansprakelijkheid in plaats van een hulpbron. En wanneer lichamelijke uitputting een drempel bereikt, stort emotionele regulatie in — waardoor elke identiteitsbedreiging catastrofaal aanvoelt.",
    en_scenario: "It's week three of a high-stakes conflict within your team. You haven't slept well in a fortnight. During a leadership meeting, a criticism you would normally receive with composure triggers a disproportionate reaction — you feel exposed, ashamed, and convinced the criticism defines you. Later, after sleep and food, the same criticism looks manageable. Your reaction was not a character flaw. It was a depleted body failing to regulate.",
    id_scenario: "Ini adalah minggu ketiga dari konflik berisiko tinggi dalam tim Anda. Anda tidak tidur dengan baik selama dua minggu. Selama pertemuan kepemimpinan, kritik yang biasanya Anda terima dengan tenang memicu reaksi yang tidak proporsional — Anda merasa terekspos, malu, dan yakin bahwa kritik itu mendefinisikan Anda. Kemudian, setelah tidur dan makan, kritik yang sama tampak dapat ditangani. Reaksi Anda bukan cacat karakter. Itu adalah tubuh yang habis yang gagal mengatur.",
    nl_scenario: "Het is week drie van een hoogrisico conflict binnen uw team. U hebt twee weken niet goed geslapen. Tijdens een leiderschapsvergadering triggert een kritiek die u normaal gesproken kalm zou ontvangen een onevenredige reactie — u voelt zich blootgesteld, beschaamd en ervan overtuigd dat de kritiek u definieert. Later, na slaap en eten, ziet dezelfde kritiek er hanteerbaar uit. Uw reactie was geen karakterfout. Het was een uitgeput lichaam dat niet kon reguleren.",
    en_practice: "For the next two weeks, track three physical markers daily: hours of sleep, one form of movement (even a 20-minute walk), and one moment of intentional stillness. Notice the correlation between physical care and emotional stability. Your body is data about your soul.",
    id_practice: "Selama dua minggu ke depan, lacak tiga penanda fisik setiap hari: jam tidur, satu bentuk gerakan (bahkan jalan kaki 20 menit), dan satu momen ketenangan yang disengaja. Perhatikan korelasi antara perawatan fisik dan stabilitas emosional. Tubuh Anda adalah data tentang jiwa Anda.",
    nl_practice: "Volg de komende twee weken dagelijks drie fysieke markers: uren slaap, één vorm van beweging (zelfs een wandeling van 20 minuten), en één moment van intentionele stilte. Merk de correlatie op tussen lichamelijke zorg en emotionele stabiliteit. Uw lichaam is data over uw ziel.",
    en_question: "If your body could speak right now, what would it say it needs most? And what is stopping you from giving it that?",
    id_question: "Jika tubuh Anda bisa berbicara sekarang, apa yang akan dikatakannya paling dibutuhkan? Dan apa yang menghalangi Anda untuk memberikan itu?",
    nl_question: "Als uw lichaam nu zou kunnen spreken, wat zou het dan zeggen dat het het meest nodig heeft? En wat weerhoudt u ervan om het dat te geven?",
  },
];

// ── SELF-ASSESSMENT RECOMMENDATIONS ──────────────────────────────────────────
const RECOMMENDATIONS: Record<AnchorKey, { en: string; id: string; nl: string }> = {
  calling: {
    en: "Your calling anchor needs attention first. Start by writing your calling statement this week — even if it feels impossible right now. The act of writing it is itself a grounding practice. Don't wait until you feel certain. Write what you knew when you said yes.",
    id: "Jangkar panggilan Anda perlu perhatian pertama. Mulailah dengan menulis pernyataan panggilan Anda minggu ini — meskipun terasa mustahil sekarang. Tindakan menulisnya sendiri sudah merupakan praktik pemantapan. Jangan tunggu sampai Anda merasa yakin. Tuliskan apa yang Anda ketahui ketika Anda berkata ya.",
    nl: "Uw roepingsanker heeft als eerste aandacht nodig. Begin deze week met het schrijven van uw roepingsverklaring — ook al lijkt dat nu onmogelijk. De daad van schrijven is zelf al een grondingspraktijk. Wacht niet tot u zeker bent. Schrijf op wat u wist toen u ja zei.",
  },
  values: {
    en: "Your values anchor needs strengthening. Before you do anything else, name three non-negotiables — things you would not compromise even under significant pressure. Write them somewhere visible. Values that aren't named can't be defended.",
    id: "Jangkar nilai-nilai Anda perlu diperkuat. Sebelum Anda melakukan hal lain, sebutkan tiga hal yang tidak dapat dikompromikan — hal-hal yang tidak akan Anda kompromikan bahkan di bawah tekanan yang signifikan. Tuliskan di tempat yang terlihat. Nilai-nilai yang tidak dinamai tidak dapat dipertahankan.",
    nl: "Uw waardenanker heeft versterking nodig. Noem voordat u iets anders doet drie niet-onderhandelbare zaken — dingen die u zelfs onder aanzienlijke druk niet zou compromitteren. Schrijf ze op een zichtbare plek. Waarden die niet benoemd zijn, kunnen niet verdedigd worden.",
  },
  community: {
    en: "Your community anchor is your most urgent need. Isolation is not humility — it is danger. This week, reach out to one person who knew you before this role. Not to report. Just to be known. That one conversation may do more for your identity than six months of personal development work.",
    id: "Jangkar komunitas Anda adalah kebutuhan paling mendesak Anda. Isolasi bukan kerendahan hati — itu adalah bahaya. Minggu ini, hubungi satu orang yang mengenal Anda sebelum peran ini. Bukan untuk melapor. Hanya untuk dikenal. Satu percakapan itu mungkin akan lebih banyak dilakukan untuk identitas Anda daripada enam bulan pekerjaan pengembangan pribadi.",
    nl: "Uw gemeenschapsanker is uw meest urgente behoefte. Isolatie is geen nederigheid — het is gevaar. Neem deze week contact op met één persoon die u kende vóór deze rol. Niet om te rapporteren. Gewoon om gekend te zijn. Dat ene gesprek doet misschien meer voor uw identiteit dan zes maanden persoonlijk ontwikkelingswerk.",
  },
  faith: {
    en: "Your faith anchor is where to start. Not with a new discipline or a longer quiet time — but with honesty. Tell God exactly where you are. Bring the drought, the distance, the flatness. Colossians 3:3 is not a feeling you achieve — it is a reality you return to: your life is hidden with Christ in God. That has not changed.",
    id: "Jangkar iman Anda adalah tempat untuk memulai. Bukan dengan disiplin baru atau waktu hening yang lebih lama — tetapi dengan kejujuran. Ceritakan kepada Allah tepat di mana Anda berada. Bawa kekeringan, jarak, kerataan. Kolose 3:3 bukan perasaan yang Anda capai — itu adalah realitas yang Anda kembalikan: hidup Anda tersembunyi bersama Kristus di dalam Allah. Itu tidak berubah.",
    nl: "Uw geloofsanker is waar u moet beginnen. Niet met een nieuwe discipline of een langere stille tijd — maar met eerlijkheid. Vertel God precies waar u bent. Breng de droogte, de afstand, de vlakheid. Kolossenzen 3:3 is geen gevoel dat u bereikt — het is een werkelijkheid waarnaar u terugkeert: uw leven is verborgen met Christus in God. Dat is niet veranderd.",
  },
  story: {
    en: "Your story anchor needs re-engagement. Set aside one hour this week with no agenda except to write. Start with: 'The chapter I am in right now is called...' Then go back five years and name each chapter before it. The pattern you find will be more grounding than any strategy.",
    id: "Jangkar cerita Anda membutuhkan keterlibatan kembali. Sisihkan satu jam minggu ini tanpa agenda kecuali untuk menulis. Mulailah dengan: 'Bab yang saya jalani sekarang disebut...' Kemudian kembali lima tahun dan namai setiap bab sebelumnya. Pola yang Anda temukan akan lebih menstabilkan daripada strategi apa pun.",
    nl: "Uw verhaalanker heeft herverbinding nodig. Reserveer deze week één uur zonder agenda behalve schrijven. Begin met: 'Het hoofdstuk waarin ik me nu bevind heet...' Ga dan vijf jaar terug en benoem elk voorgaand hoofdstuk. Het patroon dat u vindt, zal meer gronding bieden dan welke strategie ook.",
  },
  body: {
    en: "Your body anchor is telling you something you need to hear. Start with sleep — it is the most immediate lever. Protect seven to eight hours tonight. Not as a luxury. As a leadership decision. You cannot think clearly, lead well, or hold your identity steady from inside a depleted body.",
    id: "Jangkar tubuh Anda memberi tahu Anda sesuatu yang perlu Anda dengar. Mulailah dengan tidur — itu adalah tuas paling langsung. Lindungi tujuh hingga delapan jam malam ini. Bukan sebagai kemewahan. Sebagai keputusan kepemimpinan. Anda tidak dapat berpikir jernih, memimpin dengan baik, atau mempertahankan identitas Anda dengan stabil dari dalam tubuh yang habis.",
    nl: "Uw lichaamsanker vertelt u iets wat u moet horen. Begin met slaap — dat is de meest directe hefboom. Bescherm vanavond zeven tot acht uur. Niet als luxe. Als leiderschapsbeslissing. U kunt niet helder denken, goed leiding geven, of uw identiteit stabiel houden vanuit een uitgeput lichaam.",
  },
};

// ── PROPS ─────────────────────────────────────────────────────────────────────
type Props = { userPathway: string | null; isSaved: boolean };

export default function IdentityUnderPressureClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  const [openAnchor, setOpenAnchor] = useState<AnchorKey | null>(null);
  const [ratings, setRatings] = useState<Partial<Record<AnchorKey, number>>>({});
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      const result = await saveResourceToDashboard("identity-under-pressure");
      if (!result.error) setSaved(true);
    });
  }

  const allRated = ANCHORS.every(a => ratings[a.key] !== undefined);

  const lowestAnchor = allRated
    ? ANCHORS.reduce((lowest, a) => {
        const ratingA = ratings[a.key] ?? 5;
        const ratingLowest = ratings[lowest.key] ?? 5;
        return ratingA < ratingLowest ? a : lowest;
      }, ANCHORS[0])
    : null;

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", color: bodyText, background: offWhite }}>

      {/* LANGUAGE TOGGLE */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: navy, padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "oklch(75% 0.04 260)", textTransform: "uppercase" }}>
          {t("Faith & Calling", "Iman & Panggilan", "Geloof & Roeping", lang)}
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          {(["en", "id", "nl"] as Lang[]).map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ padding: "4px 12px", borderRadius: 4, border: "1px solid", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer", background: lang === l ? orange : "transparent", color: lang === l ? "white" : "oklch(65% 0.06 260)", borderColor: lang === l ? orange : "oklch(42% 0.08 260)", textTransform: "uppercase" }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section style={{ background: navy, padding: "80px 24px 64px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 40% 0%, oklch(32% 0.12 300 / 0.4) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: orange, marginBottom: 20 }}>
            {t("Faith & Calling", "Iman & Panggilan", "Geloof & Roeping", lang)}
          </p>
          <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, color: offWhite, lineHeight: 1.1, marginBottom: 20 }}>
            {t("Identity Under Pressure", "Identitas di Bawah Tekanan", "Identiteit Onder Druk", lang)}
          </h1>
          <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(82% 0.03 80)", lineHeight: 1.65, fontStyle: "italic", marginBottom: 32, maxWidth: 580, margin: "0 auto 32px" }}>
            {t(
              "Maintaining a grounded sense of self when living and leading between worlds.",
              "Mempertahankan rasa diri yang membumi ketika hidup dan memimpin di antara dua dunia.",
              "Een gegrond zelfgevoel bewaren terwijl u leeft en leidt tussen werelden.",
              lang
            )}
          </p>
          <div style={{ background: "oklch(30% 0.10 260 / 0.6)", borderRadius: 12, padding: "24px 28px", maxWidth: 580, margin: "0 auto" }}>
            <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 17, color: "oklch(88% 0.04 80)", lineHeight: 1.75, fontStyle: "italic", marginBottom: 10 }}>
              "{lang === "en" ? VERSES["col-3-3"].en : lang === "id" ? VERSES["col-3-3"].id : VERSES["col-3-3"].nl}"
            </p>
            <button onClick={() => setActiveVerse("col-3-3")} style={{ background: "none", border: "none", cursor: "pointer", color: orange, fontWeight: 700, fontSize: 12, letterSpacing: "0.08em", textDecoration: "underline dotted", padding: 0 }}>
              {lang === "id" ? VERSES["col-3-3"].ref_id : lang === "nl" ? VERSES["col-3-3"].ref_nl : VERSES["col-3-3"].ref}
            </button>
          </div>
        </div>
      </section>

      {/* INTRO — WHAT IS IDENTITY UNDER PRESSURE */}
      <section style={{ background: offWhite, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: orange, marginBottom: 12, textAlign: "center" }}>
            {t("The Challenge", "Tantangan", "De Uitdaging", lang)}
          </p>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 800, color: navy, textAlign: "center", marginBottom: 32 }}>
            {t("When pressure reshapes who you are", "Ketika tekanan membentuk kembali siapa Anda", "Wanneer druk u herschept", lang)}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 40 }}>
            <div>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: bodyText }}>
                {t(
                  "Cross-cultural leaders face a particular identity challenge: they are simultaneously too foreign and too familiar. Too foreign to be fully trusted by the community they serve. Too familiar with their home culture to explain the depth of what they've experienced away from it. The result is a kind of identity no-man's land — belonging fully to neither world.",
                  "Pemimpin lintas budaya menghadapi tantangan identitas tertentu: mereka sekaligus terlalu asing dan terlalu akrab. Terlalu asing untuk sepenuhnya dipercaya oleh komunitas yang mereka layani. Terlalu akrab dengan budaya asal mereka untuk menjelaskan kedalaman apa yang telah mereka alami jauh dari sana. Hasilnya adalah semacam tanah tak bertuan identitas — tidak sepenuhnya milik satu dunia mana pun.",
                  "Interculturele leiders staan voor een bijzondere identiteitsuitdaging: ze zijn tegelijk te vreemd en te vertrouwd. Te vreemd om volledig vertrouwd te worden door de gemeenschap die ze dienen. Te vertrouwd met hun thuiscultuur om de diepte te verklaren van wat ze erbuiten hebben meegemaakt. Het resultaat is een soort identiteits-niemandsland — volledig thuishorend in geen van beide werelden.",
                  lang
                )}
              </p>
            </div>
            <div>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: bodyText }}>
                {t(
                  "Pressure attacks identity through four primary channels: relentless role demands that leave no space for selfhood, cultural immersion that slowly redefines normal, public failure that becomes the loudest voice about who you are, and systemic criticism that wears away confidence from the outside in. Without conscious anchors, the self bends — or breaks.",
                  "Tekanan menyerang identitas melalui empat saluran utama: tuntutan peran yang tanpa henti yang tidak menyisakan ruang untuk diri sendiri, imersi budaya yang perlahan mendefinisikan ulang normalitas, kegagalan publik yang menjadi suara paling keras tentang siapa Anda, dan kritik sistemik yang mengikis kepercayaan diri dari luar ke dalam. Tanpa jangkar yang sadar, diri melengkung — atau patah.",
                  "Druk valt identiteit aan via vier primaire kanalen: meedogenloze rolverantwoordelijkheden die geen ruimte laten voor het zelf, culturele onderdompeling die langzaam normaliteit herdefiniëert, publieke mislukking die de luidste stem over wie u bent wordt, en systematische kritiek die vertrouwen van buitenaf uitholt. Zonder bewuste ankers buigt het zelf — of breekt het.",
                  lang
                )}
              </p>
            </div>
          </div>
          <div style={{ background: `${orange}12`, borderRadius: 12, padding: "24px 28px", borderLeft: `4px solid ${orange}` }}>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: bodyText, fontStyle: "italic", margin: 0 }}>
              {t(
                "The Six Anchors Identity Map below is not a personality model. It is a diagnostic framework — a way of identifying which of the six foundations that stabilise your identity under pressure is currently the most depleted, and what to do about it.",
                "Peta Identitas Enam Jangkar di bawah ini bukan model kepribadian. Ini adalah kerangka diagnostik — cara untuk mengidentifikasi mana dari enam fondasi yang menstabilkan identitas Anda di bawah tekanan yang saat ini paling habis, dan apa yang harus dilakukan tentang hal itu.",
                "De Zes Ankers Identiteitskaart hieronder is geen persoonlijkheidsmodel. Het is een diagnostisch kader — een manier om te identificeren welke van de zes fundamenten die uw identiteit onder druk stabiliseren momenteel het meest uitgeput is, en wat u eraan moet doen.",
                lang
              )}
            </p>
          </div>
        </div>
      </section>

      {/* THE SIX ANCHORS */}
      <section style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: orange, marginBottom: 12, textAlign: "center" }}>
            {t("The Six Anchors Identity Map", "Peta Identitas Enam Jangkar", "De Zes Ankers Identiteitskaart", lang)}
          </p>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 800, color: navy, textAlign: "center", marginBottom: 12 }}>
            {t("What keeps you grounded", "Apa yang membuat Anda tetap membumi", "Wat u gegrond houdt", lang)}
          </h2>
          <p style={{ textAlign: "center", fontSize: 15, color: bodyText, lineHeight: 1.65, maxWidth: 580, margin: "0 auto 48px" }}>
            {t(
              "Select each anchor to explore what it provides, how pressure attacks it, a realistic scenario, and a grounding practice.",
              "Pilih setiap jangkar untuk menjelajahi apa yang disediakannya, bagaimana tekanan menyerangnya, skenario yang realistis, dan praktik pemantapan.",
              "Selecteer elk anker om te verkennen wat het biedt, hoe druk het aanvalt, een realistisch scenario, en een gronding-praktijk.",
              lang
            )}
          </p>

          {/* Anchor grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 32 }}>
            {ANCHORS.map(anchor => {
              const isOpen = openAnchor === anchor.key;
              return (
                <button
                  key={anchor.key}
                  onClick={() => setOpenAnchor(isOpen ? null : anchor.key)}
                  style={{
                    textAlign: "left", padding: "22px 20px", borderRadius: 12,
                    border: `2px solid ${isOpen ? anchor.color : "oklch(88% 0.008 260)"}`,
                    background: isOpen ? `${anchor.color}18` : "white",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{anchor.icon}</div>
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 14, color: isOpen ? anchor.color : navy, marginBottom: 4 }}>
                    {t(anchor.en_title, anchor.id_title, anchor.nl_title, lang)}
                  </div>
                  <div style={{ fontSize: 12, color: isOpen ? anchor.color : bodyText, fontStyle: "italic", lineHeight: 1.4 }}>
                    {t(anchor.en_tagline, anchor.id_tagline, anchor.nl_tagline, lang)}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Anchor detail panel */}
          {openAnchor && (() => {
            const anchor = ANCHORS.find(a => a.key === openAnchor)!;
            return (
              <div style={{ background: "white", borderRadius: 16, padding: "40px 36px", border: `2px solid ${anchor.color}30`, animation: "fadeIn 0.3s ease" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
                  <span style={{ fontSize: 40 }}>{anchor.icon}</span>
                  <div>
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 22, color: anchor.color }}>
                      {t(anchor.en_title, anchor.id_title, anchor.nl_title, lang)}
                    </div>
                    <div style={{ fontSize: 14, color: bodyText, fontStyle: "italic" }}>
                      {t(anchor.en_tagline, anchor.id_tagline, anchor.nl_tagline, lang)}
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 28 }}>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: 10 }}>
                      {t("When strong, it provides…", "Ketika kuat, ini memberikan…", "Wanneer sterk, biedt het…", lang)}
                    </p>
                    <p style={{ fontSize: 14, lineHeight: 1.75, color: bodyText, margin: 0 }}>
                      {t(anchor.en_strength, anchor.id_strength, anchor.nl_strength, lang)}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(55% 0.18 25)", marginBottom: 10 }}>
                      {t("How pressure attacks it", "Bagaimana tekanan menyerangnya", "Hoe druk het aanvalt", lang)}
                    </p>
                    <p style={{ fontSize: 14, lineHeight: 1.75, color: bodyText, margin: 0 }}>
                      {t(anchor.en_threat, anchor.id_threat, anchor.nl_threat, lang)}
                    </p>
                  </div>
                </div>

                {/* Pressure test scenario */}
                <div style={{ background: "oklch(96% 0.008 260)", borderRadius: 10, padding: "20px 24px", marginBottom: 24, borderLeft: `4px solid ${anchor.color}` }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: anchor.color, marginBottom: 8 }}>
                    {t("Pressure Test", "Uji Tekanan", "Druktest", lang)}
                  </p>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: bodyText, fontStyle: "italic", margin: 0 }}>
                    {t(anchor.en_scenario, anchor.id_scenario, anchor.nl_scenario, lang)}
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  {/* Grounding practice */}
                  <div style={{ background: `${anchor.color}10`, borderRadius: 10, padding: "20px 20px" }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: anchor.color, marginBottom: 8 }}>
                      {t("Grounding Practice", "Praktik Pemantapan", "Gronding Praktijk", lang)}
                    </p>
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: bodyText, margin: 0 }}>
                      {t(anchor.en_practice, anchor.id_practice, anchor.nl_practice, lang)}
                    </p>
                  </div>
                  {/* Reflection question */}
                  <div style={{ background: offWhite, borderRadius: 10, padding: "20px 20px", border: `1px solid oklch(88% 0.008 260)` }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: orange, marginBottom: 8 }}>
                      {t("Reflection Question", "Pertanyaan Refleksi", "Reflectievraag", lang)}
                    </p>
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: navy, fontStyle: "italic", margin: 0 }}>
                      {t(anchor.en_question, anchor.id_question, anchor.nl_question, lang)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* SELF-ASSESSMENT */}
      <section style={{ background: offWhite, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: orange, marginBottom: 12, textAlign: "center" }}>
            {t("Self-Assessment", "Penilaian Diri", "Zelfbeoordeling", lang)}
          </p>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 800, color: navy, textAlign: "center", marginBottom: 16 }}>
            {t("How stable are your anchors?", "Seberapa stabil jangkar-jangkar Anda?", "Hoe stabiel zijn uw ankers?", lang)}
          </h2>
          <p style={{ textAlign: "center", fontSize: 15, color: bodyText, lineHeight: 1.65, maxWidth: 540, margin: "0 auto 40px" }}>
            {t(
              "Rate each anchor from 1 (very shaky) to 5 (very stable). Be honest — this is only for you.",
              "Nilai setiap jangkar dari 1 (sangat goyah) hingga 5 (sangat stabil). Jujurlah — ini hanya untuk Anda.",
              "Beoordeel elk anker van 1 (zeer wankelend) tot 5 (zeer stabiel). Wees eerlijk — dit is alleen voor u.",
              lang
            )}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
            {ANCHORS.map(anchor => {
              const rating = ratings[anchor.key];
              return (
                <div key={anchor.key} style={{ background: "white", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 160 }}>
                    <span style={{ fontSize: 22 }}>{anchor.icon}</span>
                    <div>
                      <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13, color: navy }}>
                        {t(anchor.en_title, anchor.id_title, anchor.nl_title, lang)}
                      </div>
                      <div style={{ fontSize: 11, color: bodyText, fontStyle: "italic" }}>
                        {t(anchor.en_tagline, anchor.id_tagline, anchor.nl_tagline, lang)}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flex: 1, justifyContent: "flex-end" }}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        onClick={() => setRatings(prev => ({ ...prev, [anchor.key]: n }))}
                        style={{
                          width: 40, height: 40, borderRadius: "50%", border: `2px solid`,
                          borderColor: rating === n ? anchor.color : "oklch(85% 0.01 260)",
                          background: rating !== undefined && n <= rating
                            ? rating <= 2 ? "oklch(55% 0.18 25)" : rating === 3 ? orange : anchor.color
                            : "transparent",
                          color: rating !== undefined && n <= rating ? "white" : bodyText,
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 700, fontSize: 13, cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  {rating && (
                    <span style={{ fontSize: 12, color: rating <= 2 ? "oklch(55% 0.18 25)" : rating === 3 ? orange : "oklch(45% 0.16 155)", fontWeight: 700, minWidth: 70 }}>
                      {rating <= 2
                        ? t("Shaky", "Goyah", "Wankelend", lang)
                        : rating === 3
                          ? t("Holding", "Bertahan", "Houdend", lang)
                          : t("Stable", "Stabil", "Stabiel", lang)
                      }
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {allRated && !showRecommendation && (
            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => setShowRecommendation(true)}
                style={{ padding: "14px 36px", background: orange, color: "white", border: "none", borderRadius: 8, fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer", letterSpacing: "0.06em" }}
              >
                {t("Show my starting point →", "Tunjukkan titik awal saya →", "Toon mijn startpunt →", lang)}
              </button>
            </div>
          )}

          {showRecommendation && lowestAnchor && (
            <div style={{ background: "white", borderRadius: 16, padding: "36px 32px", border: `2px solid ${lowestAnchor.color}40`, animation: "fadeIn 0.3s ease" }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: orange, marginBottom: 12 }}>
                {t("Start Here", "Mulai dari Sini", "Begin Hier", lang)}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <span style={{ fontSize: 36 }}>{lowestAnchor.icon}</span>
                <div>
                  <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 20, color: lowestAnchor.color, margin: 0 }}>
                    {t(lowestAnchor.en_title, lowestAnchor.id_title, lowestAnchor.nl_title, lang)} {t("Anchor", "Jangkar", "Anker", lang)}
                  </h3>
                  <p style={{ fontSize: 13, color: bodyText, fontStyle: "italic", margin: "4px 0 0" }}>
                    {t("Your lowest-rated anchor", "Jangkar Anda yang dinilai terendah", "Uw laagst beoordeelde anker", lang)}
                  </p>
                </div>
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: bodyText }}>
                {lang === "en"
                  ? RECOMMENDATIONS[lowestAnchor.key].en
                  : lang === "id"
                    ? RECOMMENDATIONS[lowestAnchor.key].id
                    : RECOMMENDATIONS[lowestAnchor.key].nl}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* THE UNSHAKEABLE CORE — BIBLICAL REFLECTION */}
      <section style={{ background: navy, padding: "80px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: orange, marginBottom: 16, textAlign: "center" }}>
            {t("The Unshakeable Core", "Inti yang Tidak Tergoyahkan", "De Onwankelbare Kern", lang)}
          </p>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 800, color: offWhite, textAlign: "center", marginBottom: 40 }}>
            {t("Identity in Christ", "Identitas di dalam Kristus", "Identiteit in Christus", lang)}
          </h2>

          {/* Matthew 4 — Jesus in the desert */}
          <div style={{ display: "flex", gap: 20, marginBottom: 36, alignItems: "flex-start" }}>
            <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: "50%", background: "oklch(32% 0.10 260)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
              🏜️
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: 8 }}>
                {t("Jesus in the Desert", "Yesus di Padang Gurun", "Jezus in de Woestijn", lang)}
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "oklch(82% 0.03 80)", margin: 0 }}>
                {t(
                  "In Matthew 4, every temptation began with the same challenge: 'If you are the Son of God...' The enemy's deepest strategy was never about bread or kingdoms. It was about identity. Satan wanted Jesus to act as though his identity required proving — to perform, to demonstrate, to secure. But Jesus had already heard his Father's voice at the Jordan: 'This is my Son, whom I love.' He did not need to prove anything. His identity was settled before the pressure began.",
                  "Dalam Matius 4, setiap godaan dimulai dengan tantangan yang sama: 'Jika Engkau Anak Allah...' Strategi terdalam musuh tidak pernah tentang roti atau kerajaan. Itu tentang identitas. Iblis ingin Yesus bertindak seolah-olah identitas-Nya membutuhkan pembuktian — untuk menunjukkan, untuk mendemonstrasikan, untuk mengamankan. Tetapi Yesus telah mendengar suara Bapa-Nya di Sungai Yordan: 'Inilah Anak-Ku yang Kukasihi.' Dia tidak perlu membuktikan apa pun. Identitas-Nya telah ditetapkan sebelum tekanan dimulai.",
                  "In Matteüs 4 begon elke verleiding met dezelfde uitdaging: 'Als u de Zoon van God bent...' De diepste strategie van de vijand was nooit over brood of koninkrijken. Het ging over identiteit. Satan wilde dat Jezus zou handelen alsof zijn identiteit bewijs vereiste — om te presteren, te demonstreren, te beveiligen. Maar Jezus had al zijn Vaders stem gehoord bij de Jordaan: 'Dit is mijn geliefde Zoon.' Hij hoefde niets te bewijzen. Zijn identiteit was gevestigd vóór de druk begon.",
                  lang
                )}
              </p>
              {/* Verse reference */}
              <p style={{ marginTop: 14, fontSize: 13, color: "oklch(60% 0.05 260)" }}>
                <button onClick={() => setActiveVerse("matt-4-3-4")} style={{ background: "none", border: "none", cursor: "pointer", color: orange, fontWeight: 700, fontSize: 13, textDecoration: "underline dotted", padding: 0 }}>
                  {lang === "id" ? VERSES["matt-4-3-4"].ref_id : lang === "nl" ? VERSES["matt-4-3-4"].ref_nl : VERSES["matt-4-3-4"].ref}
                </button>
              </p>
            </div>
          </div>

          {/* Paul — cross-cultural identity */}
          <div style={{ display: "flex", gap: 20, marginBottom: 36, alignItems: "flex-start" }}>
            <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: "50%", background: "oklch(32% 0.10 260)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
              ✉️
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: 8 }}>
                {t("Paul — The Cross-Cultural Leader", "Paulus — Pemimpin Lintas Budaya", "Paulus — De Interculturele Leider", lang)}
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "oklch(82% 0.03 80)", margin: 0 }}>
                {t(
                  "Paul was the archetypal cross-cultural leader: a Jew among Gentiles, a Roman citizen among the dispossessed, a theologian who worked with his hands, a missionary who was beaten, imprisoned, shipwrecked, and abandoned by colleagues. At every point, his identity was under siege. What held him? Not performance — he described himself as the worst of sinners. Not success — the churches he planted were frequently chaotic. What held him was the truth of Colossians 3:3: his life was hidden with Christ in God. That hiddenness was not obscurity. It was security.",
                  "Paulus adalah pemimpin lintas budaya yang arketipal: seorang Yahudi di antara orang-orang non-Yahudi, warga negara Romawi di antara orang-orang yang tidak berdaya, seorang teolog yang bekerja dengan tangannya, seorang misionaris yang dipukul, dipenjara, karam kapal, dan ditinggalkan oleh rekan-rekannya. Di setiap titik, identitasnya berada di bawah pengepungan. Apa yang menopangnya? Bukan kinerja — dia menggambarkan dirinya sebagai orang berdosa yang paling buruk. Bukan kesuksesan — gereja-gereja yang ia dirikan sering kali kacau. Yang menopangnya adalah kebenaran Kolose 3:3: hidupnya tersembunyi bersama Kristus di dalam Allah. Ketersembunyian itu bukan ketidakjelasan. Itu adalah keamanan.",
                  "Paulus was de archetypische interculturele leider: een Jood temidden van heidenen, een Romeins burger temidden van de ontheemden, een theoloog die met zijn handen werkte, een zendeling die geslagen, gevangengezet, schipbreuk geleden en door collega's verlaten werd. Op elk punt stond zijn identiteit onder beleg. Wat hield hem staande? Niet prestatie — hij beschreef zichzelf als de ergste zondaar. Niet succes — de kerken die hij plantte, waren vaak chaotisch. Wat hem hield was de waarheid van Kolossenzen 3:3: zijn leven was verborgen met Christus in God. Die verborgenheid was geen obscuriteit. Het was veiligheid.",
                  lang
                )}
              </p>
            </div>
          </div>

          {/* Psalm 46 */}
          <div style={{ marginTop: 40, background: "oklch(28% 0.10 260)", borderRadius: 12, padding: "28px 32px" }}>
            <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 20, color: "oklch(88% 0.04 80)", lineHeight: 1.75, fontStyle: "italic", marginBottom: 12, textAlign: "center" }}>
              "{lang === "en" ? VERSES["psalm-46-1-2"].en : lang === "id" ? VERSES["psalm-46-1-2"].id : VERSES["psalm-46-1-2"].nl}"
            </p>
            <div style={{ textAlign: "center" }}>
              <button onClick={() => setActiveVerse("psalm-46-1-2")} style={{ background: "none", border: "none", cursor: "pointer", color: orange, fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", textDecoration: "underline dotted" }}>
                {lang === "id" ? VERSES["psalm-46-1-2"].ref_id : lang === "nl" ? VERSES["psalm-46-1-2"].ref_nl : VERSES["psalm-46-1-2"].ref}
              </button>
            </div>
          </div>

          {/* Meditation paragraph */}
          <div style={{ marginTop: 32, padding: "0 0 8px" }}>
            <p style={{ fontSize: 16, lineHeight: 1.85, color: "oklch(78% 0.03 80)", fontStyle: "italic", textAlign: "center" }}>
              {t(
                "Psalm 46 was written for leaders in crisis — when the earth gives way, when mountains fall into the sea, when nations rage and kingdoms crumble. Its invitation is not to deny the pressure. It is to locate yourself inside an identity that the pressure cannot reach: the identity of a person known and kept by God. 'Therefore we will not fear' is not a denial of the circumstances. It is a declaration about who we are inside them.",
                "Mazmur 46 ditulis untuk pemimpin dalam krisis — ketika bumi bergerak, ketika gunung-gunung jatuh ke laut, ketika bangsa-bangsa bergemuruh dan kerajaan-kerajaan runtuh. Undangannya bukan untuk menyangkal tekanan. Itu adalah untuk menempatkan diri Anda di dalam identitas yang tidak dapat dijangkau oleh tekanan: identitas seseorang yang dikenal dan dijaga oleh Allah. 'Sebab itu kita tidak akan takut' bukan penyangkalan keadaan. Itu adalah deklarasi tentang siapa kita di dalamnya.",
                "Psalm 46 werd geschreven voor leiders in crisis — wanneer de aarde wankelt, wanneer bergen in zee storten, wanneer volkeren razen en koninkrijken instorten. De uitnodiging is niet om de druk te ontkennen. Het is om uzelf te plaatsen in een identiteit die de druk niet kan bereiken: de identiteit van een persoon die door God gekend en bewaard wordt. 'Daarom vrezen wij niet' is geen ontkenning van de omstandigheden. Het is een verklaring over wie we daarbinnen zijn.",
                lang
              )}
            </p>
          </div>

          {/* Closing prayer */}
          <div style={{ marginTop: 36, background: "oklch(26% 0.09 260)", borderRadius: 12, padding: "28px 32px", textAlign: "center" }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: orange, marginBottom: 16 }}>
              {t("A Prayer", "Sebuah Doa", "Een Gebed", lang)}
            </p>
            <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 18, color: "oklch(88% 0.04 80)", lineHeight: 1.85, fontStyle: "italic", margin: 0 }}>
              {t(
                "Lord, when the pressure tells me who I am, remind me who You say I am. When the work is fruitless and the season is long, let my identity rest not in what I produce but in what You have spoken. You have engraved my name on the palms of Your hands. That is enough. That is everything. Amen.",
                "Tuhan, ketika tekanan memberitahuku siapa aku, ingatkan aku tentang apa yang Engkau katakan tentang diriku. Ketika pekerjaan tidak menghasilkan buah dan musimnya panjang, biarkan identitasku tidak beristirahat dalam apa yang aku hasilkan tetapi dalam apa yang telah Engkau ucapkan. Engkau telah mengukir namaku di telapak tangan-Mu. Itu cukup. Itu segalanya. Amin.",
                "Heer, als de druk mij vertelt wie ik ben, herinner mij aan wie U zegt dat ik ben. Als het werk vruchteloos is en het seizoen lang, laat mijn identiteit rusten niet in wat ik produceer maar in wat U gesproken hebt. U hebt mijn naam in Uw handpalmen gegrift. Dat is genoeg. Dat is alles. Amen.",
                lang
              )}
            </p>
            <p style={{ marginTop: 16, fontSize: 12, color: orange, fontWeight: 700, letterSpacing: "0.08em" }}>
              <button onClick={() => setActiveVerse("isa-49-16")} style={{ background: "none", border: "none", cursor: "pointer", color: orange, fontWeight: 700, fontSize: 12, letterSpacing: "0.08em", textDecoration: "underline dotted", padding: 0 }}>
                {lang === "id" ? VERSES["isa-49-16"].ref_id : lang === "nl" ? VERSES["isa-49-16"].ref_nl : VERSES["isa-49-16"].ref}
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* SAVE & PATHWAY CTA */}
      <section style={{ background: lightGray, padding: "64px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: bodyText, lineHeight: 1.7, fontStyle: "italic", marginBottom: 12 }}>
            {t(
              "\"Your life is hidden with Christ in God.\"",
              "\"Hidupmu tersembunyi bersama dengan Kristus di dalam Allah.\"",
              "\"Uw leven ligt met Christus verborgen in God.\"",
              lang
            )}
          </p>
          <p style={{ fontSize: 12, color: orange, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 40 }}>
            — {lang === "id" ? VERSES["col-3-3"].ref_id : lang === "nl" ? VERSES["col-3-3"].ref_nl : VERSES["col-3-3"].ref}
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {!saved ? (
              <button
                onClick={handleSave}
                disabled={isPending}
                style={{ padding: "14px 32px", background: orange, color: "white", border: "none", borderRadius: 8, fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 14, cursor: isPending ? "wait" : "pointer", letterSpacing: "0.06em" }}
              >
                {isPending ? t("Saving…", "Menyimpan…", "Opslaan…", lang) : t("Save to Dashboard", "Simpan ke Dasbor", "Opslaan in Dashboard", lang)}
              </button>
            ) : (
              <span style={{ padding: "14px 32px", background: "oklch(40% 0.15 145)", color: "white", borderRadius: 8, fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "0.06em" }}>
                ✓ {t("Saved", "Tersimpan", "Opgeslagen", lang)}
              </span>
            )}
            {userPathway && (
              <Link href="/dashboard" style={{ padding: "14px 32px", background: "transparent", color: navy, border: `1.5px solid oklch(72% 0.03 260)`, borderRadius: 8, fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 14, textDecoration: "none", letterSpacing: "0.06em" }}>
                {t("Back to Pathway", "Kembali ke Jalur", "Terug naar Pad", lang)}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* VERSE POPUP */}
      {activeVerse && VERSES[activeVerse as keyof typeof VERSES] && (() => {
        const v = VERSES[activeVerse as keyof typeof VERSES];
        return (
          <div onClick={() => setActiveVerse(null)} style={{ position: "fixed", inset: 0, background: "oklch(10% 0.05 260 / 0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }}>
            <div onClick={e => e.stopPropagation()} style={{ background: offWhite, borderRadius: 16, padding: "40px 36px", maxWidth: 520, width: "100%" }}>
              <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 21, lineHeight: 1.65, color: navy, fontStyle: "italic", marginBottom: 16 }}>
                "{lang === "en" ? v.en : lang === "id" ? v.id : v.nl}"
              </p>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, color: orange, letterSpacing: "0.08em", marginBottom: 24 }}>
                — {lang === "en" ? v.ref : lang === "id" ? v.ref_id : v.ref_nl} ({lang === "en" ? "NIV" : lang === "id" ? "TB" : "NBV"})
              </p>
              <button onClick={() => setActiveVerse(null)} style={{ padding: "10px 24px", background: navy, color: offWhite, border: "none", borderRadius: 6, fontFamily: "Montserrat, sans-serif", fontWeight: 700, cursor: "pointer" }}>
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
