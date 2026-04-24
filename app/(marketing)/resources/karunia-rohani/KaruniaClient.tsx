"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { saveKaruniaResult } from "../actions";
import VerseChip from "@/components/VerseChip";
import { VERSES } from "@/lib/verses";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id" | "nl";

const PRIMARY = "oklch(65% 0.15 45)";
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

type GiftData = {
  label: string;
  en: string;
  nl: string;
  desc: string;
  descEn: string;
  descNl: string;
  realLife: string;
  realLifeEn: string;
  realLifeNl: string;
  longDesc: string;
  longDescEn: string;
  longDescNl: string;
};

const GIFTS: Record<string, GiftData> = {
  melayani: {
    label: "Melayani", en: "Serving", nl: "Dienst",
    desc: "Kamu memiliki kemampuan untuk melihat dan memenuhi kebutuhan praktis orang lain dengan sukacita.",
    descEn: "The ability to see and joyfully meet the practical needs of others.",
    descNl: "Het vermogen om de praktische behoeften van anderen vrolijk te zien en te vervullen.",
    realLife: "Dalam kehidupan nyata: Kamu adalah orang yang datang lebih awal untuk menyiapkan ruangan, memperhatikan ketika seseorang perlu bantuan, dan tinggal lebih lama untuk membereskan — tanpa diminta.",
    realLifeEn: "In real life: You're the person who arrives early to set up the room, notices when someone needs a hand, and stays late to clean up — without being asked.",
    realLifeNl: "In het dagelijks leven: Jij bent de persoon die vroeg arriveert om de ruimte in te richten, opmerkt wanneer iemand hulp nodig heeft, en langer blijft om op te ruimen — zonder dat je het gevraagd wordt.",
    longDesc: "Karunia Melayani (diakonia) adalah salah satu karunia paling mendasar dalam Tubuh Kristus. Mereka yang memiliki karunia ini melihat kebutuhan yang orang lain lewati begitu saja — tugas yang belum selesai, beban yang terlalu berat, detail yang bisa membuat atau menghancurkan sebuah acara — dan mereka bergerak untuk melakukannya dengan sukacita tulus. Pelayanan mereka tidak mencari pengakuan; ini adalah ungkapan kasih yang mengalir secara alami. Dalam konteks lintas budaya, karunia ini sangat berharga karena melampaui hambatan bahasa dan budaya, membangun kepercayaan melalui tindakan sebelum kata-kata bisa.",
    longDescEn: "The gift of Serving (diakonia) is one of the most foundational gifts in the Body of Christ. Those who carry it notice needs others walk past — the unfinished task, the burden that's too heavy, the detail that could make or break a gathering — and they move toward it with genuine joy. Their service doesn't seek recognition; it is simply love expressed naturally. In cross-cultural contexts, this gift is especially powerful because it crosses language and cultural barriers, building trust through action before words can.",
    longDescNl: "De gave van Dienst (diakonia) is een van de meest fundamentele gaven in het Lichaam van Christus. Mensen met deze gave zien behoeften die anderen voorbijlopen — de onvoltooide taak, de last die te zwaar is, het detail dat een bijeenkomst kan maken of breken — en zij gaan er met oprechte vreugde op af. Hun dienst zoekt geen erkenning; het is eenvoudigweg liefde die natuurlijk tot uitdrukking komt. In een interculturele context is deze gave bijzonder krachtig, omdat ze taal- en cultuurbarrières overstijgt en vertrouwen opbouwt door daden voordat woorden dat kunnen.",
  },
  murah_hati: {
    label: "Murah Hati", en: "Mercy", nl: "Barmhartigheid",
    desc: "Kamu peka terhadap penderitaan orang lain dan dipanggil untuk hadir bersama mereka dalam kesulitan.",
    descEn: "Deep sensitivity to the suffering of others, with a calling to be present in their pain.",
    descNl: "Diepe gevoeligheid voor het lijden van anderen, met een roeping om aanwezig te zijn in hun pijn.",
    realLife: "Dalam kehidupan nyata: Ketika seseorang berbagi rasa sakit mereka, kamu tidak langsung mencari solusi — kamu duduk bersama mereka, sungguh merasakan kesedihan mereka, dan hadir hingga mereka merasa benar-benar dipahami.",
    realLifeEn: "In real life: When someone shares their pain, you don't immediately reach for solutions — you sit with them, genuinely feel their sadness, and stay present until they feel truly understood.",
    realLifeNl: "In het dagelijks leven: Wanneer iemand zijn of haar pijn deelt, ga jij niet meteen op zoek naar oplossingen — jij zit bij hen, voelt hun verdriet oprecht aan, en blijft aanwezig totdat ze zich echt begrepen voelen.",
    longDesc: "Karunia Murah Hati (eleos) adalah kemampuan yang diberikan Roh untuk merasakan dan merespons rasa sakit emosional dan rohani orang lain. Mereka yang memilikinya ditarik secara naluriah kepada orang-orang yang terluka, terbuang, atau berduka. Mereka tidak terintimidasi oleh kesedihan atau kesulitan — sebaliknya, mereka menemukannya sebagai tempat di mana mereka paling efektif. Kehadiran mereka sendiri membawa penghiburan. Dalam pelayanan lintas budaya, karunia ini sangat berharga dalam situasi trauma, perpindahan, dan kehilangan budaya, di mana kata-kata sering kali tidak mencukupi.",
    longDescEn: "The gift of Mercy (eleos) is a Spirit-given ability to feel and respond to the emotional and spiritual pain of others. Those who carry it are drawn instinctively toward the wounded, the outcast, and the grieving. They are not intimidated by sadness or hardship — rather, they find it the place where they are most effective. Their very presence brings comfort. In cross-cultural ministry, this gift is especially vital in situations of trauma, displacement, and cultural loss, where words often fall short.",
    longDescNl: "De gave van Barmhartigheid (eleos) is een door de Geest gegeven vermogen om de emotionele en geestelijke pijn van anderen te voelen en daarop te reageren. Mensen met deze gave worden instinctief aangetrokken tot degenen die gewond, buitengesloten of rouwend zijn. Ze worden niet ontmoedigd door verdriet of tegenspoed — integendeel, ze ontdekken dat ze daar het meest effectief zijn. Hun aanwezigheid brengt op zichzelf al troost. In interculturele dienst is deze gave bijzonder waardevol in situaties van trauma, ontheemding en cultureel verlies, waar woorden vaak tekortschieten.",
  },
  keramahan: {
    label: "Keramahan", en: "Hospitality", nl: "Gastvrijheid",
    desc: "Kamu memiliki kemampuan untuk membuat orang merasa disambut, aman, dan diperhatikan.",
    descEn: "The ability to create environments where people feel genuinely welcomed and safe.",
    descNl: "Het vermogen om omgevingen te creëren waarin mensen zich oprecht welkom en veilig voelen.",
    realLife: "Dalam kehidupan nyata: Orang asing merasa nyaman di sekitarmu dalam hitungan menit. Kamu memperhatikan ketika seseorang berdiri sendiri di sebuah acara, dan kamu bergerak untuk menyambut mereka — bukan karena tugas, tetapi karena kamu benar-benar ingin mereka merasa diterima.",
    realLifeEn: "In real life: Strangers feel at ease around you within minutes. You notice when someone is standing alone at a gathering, and you move toward them — not out of duty, but because you genuinely want them to feel they belong.",
    realLifeNl: "In het dagelijks leven: Vreemden voelen zich binnen enkele minuten op hun gemak in jouw aanwezigheid. Je merkt het op wanneer iemand alleen staat op een bijeenkomst, en je beweegt naar hen toe — niet uit plichtsgevoel, maar omdat je oprecht wilt dat ze het gevoel hebben erbij te horen.",
    longDesc: "Karunia Keramahan (philoxenia — secara harfiah 'kasih kepada orang asing') melampaui sekadar menjadi tuan rumah yang baik. Ini adalah kemampuan ilahi untuk menciptakan ruang aman di mana orang merasa terlihat, diterima, dan dihargai. Mereka yang memiliki karunia ini mengubah rumah, meja, atau bahkan percakapan biasa menjadi tempat perjumpaan yang berarti. Dalam konteks lintas budaya, keramahan adalah fondasi dari semua pembangunan hubungan, membuka pintu untuk kepercayaan, berbagi iman, dan komunitas yang sejati.",
    longDescEn: "The gift of Hospitality (philoxenia — literally 'love of strangers') goes far beyond being a good host. It is a divine capacity to create safe spaces where people feel seen, accepted, and valued. Those with this gift transform homes, tables, or even ordinary conversations into places of meaningful encounter. In cross-cultural contexts, hospitality is the foundation of all relationship-building, opening doors for trust, faith-sharing, and genuine community.",
    longDescNl: "De gave van Gastvrijheid (philoxenia — letterlijk 'liefde voor vreemdelingen') gaat veel verder dan een goede gastheer of gastvrouw zijn. Het is een goddelijke gave om veilige ruimten te creëren waar mensen zich gezien, aanvaard en gewaardeerd voelen. Mensen met deze gave transformeren huizen, tafels of zelfs gewone gesprekken tot plaatsen van betekenisvolle ontmoeting. In interculturele contexten is gastvrijheid het fundament van alle relatieopbouw en opent ze deuren voor vertrouwen, geloofsuitwisseling en echte gemeenschap.",
  },
  bahasa_roh: {
    label: "Bahasa Roh", en: "Tongues", nl: "Tongen",
    desc: "Kamu telah menerima karunia untuk berkomunikasi dalam bahasa rohani yang belum pernah dipelajari.",
    descEn: "The Spirit-given ability to communicate in a spiritual language not previously learned.",
    descNl: "Het door de Geest gegeven vermogen om te communiceren in een geestelijke taal die niet eerder is geleerd.",
    realLife: "Dalam kehidupan nyata: Saat berdoa atau menyembah, kamu mengungkapkan dirimu dalam bahasa yang tidak kamu pelajari, merasakan komunikasi yang lebih dalam dengan Allah yang melampaui kata-kata yang kamu pahami.",
    realLifeEn: "In real life: During prayer or worship, you express yourself in a language you have not learned, experiencing a depth of communication with God that transcends words you understand.",
    realLifeNl: "In het dagelijks leven: Tijdens gebed of aanbidding uit jij jezelf in een taal die je niet hebt geleerd, en ervaar je een diepere communicatie met God die het begripsvermogen te boven gaat.",
    longDesc: "Karunia Bahasa Roh (glossolalia) disebutkan dalam 1 Korintus 12-14 sebagai salah satu manifestasi Roh. Ini adalah kemampuan untuk berdoa atau berbicara kepada Allah dalam bahasa yang tidak dipelajari — baik untuk penggunaan pribadi dalam berdoa, atau untuk pesan kepada jemaat (yang kemudian membutuhkan tafsiran). Rasul Paulus menghargai karunia ini sambil menekankan bahwa kasih harus memandu ekspresinya, dan bahwa tafsiran diperlukan bila digunakan di depan umum. Karunia ini mempertajam kehidupan doa dan keintiman dengan Roh.",
    longDescEn: "The gift of Tongues (glossolalia) is mentioned in 1 Corinthians 12-14 as one of the Spirit's manifestations. It is the ability to pray or speak to God in a language not learned — either for personal prayer use, or as a message to the congregation (which then requires interpretation). Paul valued this gift while emphasising that love must guide its expression, and that interpretation is required when used publicly. This gift sharpens prayer life and intimacy with the Spirit.",
    longDescNl: "De gave van Tongen (glossolalia) wordt genoemd in 1 Korintiërs 12-14 als een van de uitingen van de Geest. Het is het vermogen om tot God te bidden of te spreken in een niet-geleerde taal — voor persoonlijk gebed, of als boodschap voor de gemeente (wat dan uitleg vereist). Paulus waardeerde deze gave, maar benadrukte dat liefde de uitdrukking ervan moet sturen en dat uitleg nodig is bij openbaar gebruik. Deze gave verdiept het gebedsleven en de intimiteit met de Geest.",
  },
  menyembuhkan: {
    label: "Menyembuhkan", en: "Healing", nl: "Genezing",
    desc: "Allah memakai doa-doamu sebagai sarana untuk kesembuhan fisik, emosi, atau rohani bagi orang lain.",
    descEn: "God uses your prayers as a channel for physical, emotional, or spiritual healing.",
    descNl: "God gebruikt jouw gebeden als kanaal voor fysieke, emotionele of geestelijke genezing.",
    realLife: "Dalam kehidupan nyata: Kamu mendapati dirimu berdoa untuk orang yang sakit dengan keyakinan yang tulus — dan kamu telah menyaksikan Allah bekerja melalui doa-doa itu dengan cara yang tidak dapat dijelaskan secara medis.",
    realLifeEn: "In real life: You find yourself praying for the sick with genuine conviction — and you have witnessed God work through those prayers in ways that cannot be medically explained.",
    realLifeNl: "In het dagelijks leven: Je bidt voor zieken met oprechte overtuiging — en je hebt gezien hoe God door die gebeden werkte op manieren die medisch niet verklaarbaar zijn.",
    longDesc: "Karunia Menyembuhkan (iama) adalah karunia di mana Allah bekerja melalui seseorang sebagai saluran kesembuhan — fisik, emosional, atau rohani. Kesembuhan selalu merupakan tindakan Allah; orang yang memiliki karunia ini adalah alat, bukan sumber. Karunia ini dinyatakan dalam 1 Korintus 12 dan dilakukan dalam pelayanan Yesus dan para rasul. Dalam konteks budaya yang beragam, karunia ini sering menjadi kesaksian yang kuat tentang kuasa dan belas kasihan Allah yang melampaui batas.",
    longDescEn: "The gift of Healing (iama) is a gift in which God works through a person as a channel of healing — physical, emotional, or spiritual. Healing is always God's act; the person with this gift is the instrument, not the source. This gift is listed in 1 Corinthians 12 and demonstrated throughout Jesus's ministry and the apostles'. In diverse cultural contexts, this gift often becomes a powerful testimony to God's power and compassion that transcends boundaries.",
    longDescNl: "De gave van Genezing (iama) is een gave waarbij God door een persoon werkt als kanaal van genezing — fysiek, emotioneel of geestelijk. Genezing is altijd Gods handelen; de persoon met deze gave is het instrument, niet de bron. Deze gave wordt vermeld in 1 Korintiërs 12 en is zichtbaar in de bediening van Jezus en de apostelen. In diverse culturele contexten wordt deze gave vaak een krachtig getuigenis van Gods macht en mededogen dat grenzen overstijgt.",
  },
  menguatkan: {
    label: "Menguatkan", en: "Exhortation", nl: "Bemoediging",
    desc: "Kamu mampu mendorong, menguatkan, dan membimbing orang lain untuk bertumbuh dan tidak menyerah.",
    descEn: "The ability to encourage, strengthen, and guide others to grow and not give up.",
    descNl: "Het vermogen om anderen aan te moedigen, te versterken en te begeleiden zodat ze groeien en niet opgeven.",
    realLife: "Dalam kehidupan nyata: Orang meninggalkan percakapan denganmu merasa lebih kuat dari sebelumnya. Kamu tahu persis kapan seseorang membutuhkan dorongan dan kata-kata yang tepat untuk dikatakan — bukan klise, tetapi sesuatu yang tepat sasaran.",
    realLifeEn: "In real life: People leave conversations with you feeling stronger than when they came. You know exactly when someone needs a push and the precise words to say — not clichés, but something that lands with pinpoint accuracy.",
    realLifeNl: "In het dagelijks leven: Mensen verlaten gesprekken met jou sterker dan ze kwamen. Je weet precies wanneer iemand een aanmoediging nodig heeft en welke woorden je moet zeggen — geen clichés, maar iets dat raak is.",
    longDesc: "Karunia Menguatkan (paraklesis — kata yang sama dengan 'Penghibur' yang digunakan untuk Roh Kudus) adalah kemampuan untuk datang di samping seseorang dan mendukung mereka melalui kesulitan. Ini bukan sekedar optimisme; ini adalah bimbingan rohani yang berakar pada kebenaran. Mereka yang memiliki karunia ini melihat potensi dalam orang lain bahkan ketika orang lain tidak melihatnya dalam diri mereka sendiri, dan mereka berbicara dengan cara yang memobilisasi orang menuju pertumbuhan dan tindakan.",
    longDescEn: "The gift of Exhortation (paraklesis — the same word used for the 'Comforter' or Holy Spirit) is the ability to come alongside someone and support them through difficulty. It is not mere optimism; it is Spirit-grounded guidance rooted in truth. Those with this gift see potential in others even when those people cannot see it themselves, and they speak in ways that mobilise people toward growth and action.",
    longDescNl: "De gave van Bemoediging (paraklesis — hetzelfde woord dat gebruikt wordt voor de 'Trooster', de Heilige Geest) is het vermogen om naast iemand te gaan staan en hem of haar door moeilijkheden heen te ondersteunen. Het is niet louter optimisme; het is door de Geest gegronde begeleiding geworteld in de waarheid. Mensen met deze gave zien potentieel in anderen, zelfs wanneer die het zelf niet zien, en ze spreken op een manier die mensen aanzet tot groei en handelen.",
  },
  memberi: {
    label: "Memberi", en: "Giving", nl: "Geven",
    desc: "Kamu dengan senang hati dan sukarela menggunakan sumber daya yang kamu miliki untuk kebutuhan pelayanan.",
    descEn: "A wholehearted willingness to use personal resources generously for ministry needs.",
    descNl: "Een oprechte bereidheid om persoonlijke middelen royaal in te zetten voor behoeften in de dienst.",
    realLife: "Dalam kehidupan nyata: Ketika kamu mendengar tentang kebutuhan nyata, responmu pertama adalah berpikir tentang bagaimana kamu bisa membantu secara finansial atau material — dan kamu melakukannya dengan sukacita, bukan dengan berat hati.",
    realLifeEn: "In real life: When you hear about a genuine need, your first response is to think about how you can help financially or materially — and you do so with joy, not reluctance.",
    realLifeNl: "In het dagelijks leven: Als je hoort over een echte nood, is je eerste reactie nadenken hoe je financieel of materieel kunt helpen — en je doet dit met vreugde, niet met tegenzin.",
    longDesc: "Karunia Memberi (metadidomi) disebutkan dalam Roma 12:8 dengan arahan untuk melakukannya 'dengan kemurahan hati'. Ini bukan hanya tentang kemampuan finansial — ini adalah kesiapan hati untuk menggunakan apa yang Allah percayakan dengan kemurahan hati demi memajukan Kerajaan-Nya. Mereka yang memiliki karunia ini sering memiliki kemampuan khusus untuk menghasilkan, mengelola, dan mendistribusikan sumber daya dengan bijaksana. Mereka memberi dengan cara yang tidak menarik perhatian kepada diri mereka sendiri tetapi kepada kebutuhan yang dipenuhi.",
    longDescEn: "The gift of Giving (metadidomi) is listed in Romans 12:8 with the direction to do it 'with generosity'. It is not merely about financial capacity — it is a heart readiness to use what God has entrusted generously for the advance of His Kingdom. Those with this gift often have a special ability to generate, manage, and distribute resources wisely. They give in ways that draw attention not to themselves but to the need being met.",
    longDescNl: "De gave van Geven (metadidomi) wordt in Romeinen 12:8 vermeld met de aanwijzing om dit 'met vrijgevigheid' te doen. Het gaat niet alleen om financiële mogelijkheden — het is een hartsgesteldheid om wat God heeft toevertrouwd royaal in te zetten voor de uitbreiding van Zijn Koninkrijk. Mensen met deze gave hebben vaak een bijzonder vermogen om middelen wijs te genereren, te beheren en te verdelen. Ze geven op een manier die de aandacht niet op henzelf vestigt, maar op de nood die wordt vervuld.",
  },
  hikmat: {
    label: "Hikmat", en: "Wisdom", nl: "Wijsheid",
    desc: "Kamu mampu melihat situasi dengan sudut pandang Allah dan memberikan arah yang bijak kepada orang lain.",
    descEn: "The ability to see situations from God's perspective and give wise, God-centred direction.",
    descNl: "Het vermogen om situaties vanuit Gods perspectief te zien en anderen een wijs, op God gericht richting te geven.",
    realLife: "Dalam kehidupan nyata: Orang datang kepadamu ketika mereka menghadapi keputusan besar karena saran-saranmu cenderung memotong kerumitan dan menemukan apa yang benar-benar penting — secara praktis dan rohani.",
    realLifeEn: "In real life: People seek you out when facing big decisions because your counsel tends to cut through complexity and find what truly matters — practically and spiritually.",
    realLifeNl: "In het dagelijks leven: Mensen zoeken jou op wanneer ze voor grote beslissingen staan, omdat jouw raad de complexiteit doorsnijdt en vindt wat er werkelijk toe doet — praktisch én geestelijk.",
    longDesc: "Karunia Hikmat (sophia) adalah kemampuan yang diberikan Roh untuk menerapkan kebenaran Alkitab secara tepat pada situasi kehidupan nyata. Berbeda dengan pengetahuan (yang mengumpulkan kebenaran), hikmat tahu apa yang harus dilakukan dengan kebenaran itu. Ini adalah karunia yang membantu komunitas menavigasi konflik, membuat keputusan sulit, dan menemukan jalan maju ketika situasinya tidak jelas. Yakobus 1:5 menjanjikan bahwa hikmat tersedia bagi siapa saja yang memintanya — tetapi bagi mereka yang memiliki karunia ini, hikmat mengalir dengan cara yang luar biasa.",
    longDescEn: "The gift of Wisdom (sophia) is a Spirit-given ability to apply biblical truth accurately to real-life situations. Unlike knowledge (which accumulates truth), wisdom knows what to do with that truth. It is the gift that helps communities navigate conflict, make difficult decisions, and find a way forward when situations are unclear. James 1:5 promises wisdom is available to all who ask — but for those with this gift, wisdom flows in an extraordinary way.",
    longDescNl: "De gave van Wijsheid (sophia) is een door de Geest gegeven vermogen om bijbelse waarheid nauwkeurig toe te passen op concrete levenssituaties. Anders dan kennis (die waarheid verzamelt), weet wijsheid wat men met die waarheid moet doen. Het is de gave die gemeenschappen helpt conflicten te navigeren, moeilijke beslissingen te nemen en een weg vooruit te vinden wanneer de situatie onduidelijk is. Jakobus 1:5 belooft dat wijsheid beschikbaar is voor iedereen die erom vraagt — maar voor mensen met deze gave stroomt wijsheid op een buitengewone manier.",
  },
  pengetahuan: {
    label: "Pengetahuan", en: "Knowledge", nl: "Kennis",
    desc: "Kamu menerima pemahaman supranatural tentang firman Allah atau situasi tertentu yang relevan bagi pelayanan.",
    descEn: "Supernatural understanding of God's word or specific situations relevant to ministry.",
    descNl: "Bovennatuurlijk inzicht in Gods Woord of specifieke situaties die relevant zijn voor de dienst.",
    realLife: "Dalam kehidupan nyata: Kamu memiliki pemahaman mendalam tentang Alkitab yang datang dari studi serius — dan terkadang kamu menerima wawasan tentang seseorang atau situasi yang tidak dapat kamu jelaskan secara rasional, yang kemudian terbukti tepat.",
    realLifeEn: "In real life: You have a deep grasp of Scripture that comes from serious study — and sometimes you receive insight about a person or situation you cannot rationally explain, which later proves accurate.",
    realLifeNl: "In het dagelijks leven: Je hebt een diep begrip van de Bijbel dat voortkomt uit serieuze studie — en soms ontvang je inzicht over een persoon of situatie dat je niet rationeel kunt verklaren, maar dat later accuraat blijkt.",
    longDesc: "Karunia Pengetahuan (gnosis) disebutkan dalam 1 Korintus 12 sebagai 'perkataan pengetahuan' — wawasan yang datang secara supranatural tentang situasi atau kebutuhan yang tidak bisa diketahui secara alami. Ini berbeda dari belajar keras yang baik (meskipun mereka yang memiliki karunia ini sering juga merupakan pelajar yang setia). Karunia ini berguna khusus dalam doa syafaat, konseling pastoral, dan konteks di mana kebutuhan tersembunyi seseorang perlu disingkapkan untuk pelayanan yang efektif.",
    longDescEn: "The gift of Knowledge (gnosis) is listed in 1 Corinthians 12 as a 'word of knowledge' — supernaturally given insight about a situation or need that could not be known naturally. This is distinct from diligent study (though those with this gift are often also faithful learners). The gift is especially useful in intercessory prayer, pastoral counselling, and contexts where a person's hidden need must be uncovered for effective ministry.",
    longDescNl: "De gave van Kennis (gnosis) wordt in 1 Korintiërs 12 vermeld als een 'woord van kennis' — bovennatuurlijk gegeven inzicht over een situatie of nood die op natuurlijke wijze niet gekend kon worden. Dit is iets anders dan ijverige studie (hoewel mensen met deze gave vaak ook trouwe leerlingen zijn). De gave is bijzonder bruikbaar bij voorbede, pastorale begeleiding en contexten waar de verborgen nood van iemand moet worden onthuld voor een effectieve dienst.",
  },
  iman: {
    label: "Iman", en: "Faith", nl: "Geloof",
    desc: "Kamu memiliki keyakinan yang kuat bahwa Allah akan bekerja bahkan dalam situasi yang tampaknya mustahil.",
    descEn: "An extraordinary conviction that God will act even when circumstances seem impossible.",
    descNl: "Een buitengewone overtuiging dat God handelt, zelfs wanneer omstandigheden onmogelijk lijken.",
    realLife: "Dalam kehidupan nyata: Ketika orang lain melihat hambatan, kamu melihat peluang. Kehadiranmu dalam sebuah tim mengubah atmosfer dari ketakutan menjadi kepercayaan — bukan karena kamu mengabaikan realita, tetapi karena kamu sungguh percaya Allah lebih besar dari realita.",
    realLifeEn: "In real life: When others see obstacles, you see opportunities. Your presence in a team shifts the atmosphere from fear to trust — not because you ignore reality, but because you genuinely believe God is bigger than the reality.",
    realLifeNl: "In het dagelijks leven: Waar anderen obstakels zien, zie jij kansen. Jouw aanwezigheid in een team verschuift de atmosfeer van angst naar vertrouwen — niet omdat je de realiteit negeert, maar omdat je oprecht gelooft dat God groter is dan de realiteit.",
    longDesc: "Karunia Iman (pistis) yang disebutkan dalam 1 Korintus 12 bukan sekedar iman penyelamatan yang dimiliki semua orang Kristen — ini adalah manifestasi khusus dari Roh di mana seseorang menerima keyakinan yang luar biasa bahwa Allah akan bertindak dalam cara tertentu. Ini adalah iman yang menggerakkan gunung. Mereka yang memiliki karunia ini menjadi jangkar komunitas di saat krisis, ketidakpastian, atau saat proyek besar tampaknya tidak mungkin. Iman mereka menular dan memobilisasi orang lain untuk bertindak.",
    longDescEn: "The gift of Faith (pistis) listed in 1 Corinthians 12 is not merely the saving faith every Christian has — it is a specific Spirit manifestation in which a person receives extraordinary conviction that God will act in a specific way. This is the faith that moves mountains. Those with this gift become anchors for community in crisis, uncertainty, or when a large vision seems impossible. Their faith is contagious and mobilises others to act.",
    longDescNl: "De gave van Geloof (pistis) uit 1 Korintiërs 12 is niet louter het reddend geloof dat elke christen heeft — het is een specifieke uiting van de Geest waarbij iemand een buitengewone overtuiging ontvangt dat God op een bepaalde manier zal handelen. Dit is het geloof dat bergen verzet. Mensen met deze gave worden ankerpunten voor de gemeenschap in tijden van crisis, onzekerheid of wanneer een grote visie onmogelijk lijkt. Hun geloof is aanstekelijk en zet anderen in beweging.",
  },
  kerasulan: {
    label: "Kerasulan", en: "Apostleship", nl: "Apostelschap",
    desc: "Kamu dipanggil untuk merintis dan mengembangkan pelayanan di wilayah atau konteks budaya yang baru.",
    descEn: "A calling to pioneer and develop ministry in new regions or cross-cultural contexts.",
    descNl: "Een roeping om bediening te pionieren en te ontwikkelen in nieuwe regio's of interculturele contexten.",
    realLife: "Dalam kehidupan nyata: Kamu tertarik pada tempat-tempat di mana tidak ada gereja atau pelayanan yang ada — wilayah baru, budaya yang belum dijangkau, konteks perkotaan yang sulit. Kamu tidak menunggu seseorang membuka jalan; kamu adalah orang yang membuka jalan.",
    realLifeEn: "In real life: You are drawn to places where there is no existing church or ministry — new territories, unreached cultures, difficult urban contexts. You don't wait for someone to open the way; you are the person who opens the way.",
    realLifeNl: "In het dagelijks leven: Jij wordt aangetrokken door plaatsen waar geen kerk of bediening bestaat — nieuwe gebieden, onbereikte culturen, moeilijke stedelijke contexten. Je wacht niet tot iemand de weg opent; jij bent degene die de weg opent.",
    longDesc: "Karunia Kerasulan (apostolos — 'yang diutus') dalam pengertian fungsional mengacu pada mereka yang dipanggil untuk merintis dan meletakkan fondasi pelayanan di wilayah atau konteks baru. Paulus menggambarkan dirinya sebagai 'tukang bangunan yang ahli' yang meletakkan fondasi (1 Kor 3:10). Dalam era misi modern, karunia ini terlihat dalam mereka yang dipanggil untuk masuk ke konteks yang belum diinjili, membangun komunitas iman dari awal, dan kemudian mempercayakannya kepada pemimpin lokal. Karunia ini sangat cocok untuk kepemimpinan lintas budaya.",
    longDescEn: "The gift of Apostleship (apostolos — 'sent one') in its functional sense refers to those called to pioneer and lay foundations for ministry in new territories or contexts. Paul describes himself as a 'skilled master builder' who lays foundations (1 Cor 3:10). In modern missions, this gift shows in those called to enter unevangelised contexts, build faith communities from scratch, and then entrust them to local leaders. This gift is especially fitted for cross-cultural leadership.",
    longDescNl: "De gave van Apostelschap (apostolos — 'gezondene') verwijst in functionele zin naar mensen die geroepen zijn om bediening te pionieren en fundamenten te leggen in nieuwe gebieden of contexten. Paulus beschrijft zichzelf als een 'bekwame bouwmeester' die fundamenten legt (1 Kor. 3:10). In moderne zending is deze gave zichtbaar bij hen die geroepen zijn om niet-geëvangeliseerde contexten te betreden, geloofsgemeenschappen van de grond af op te bouwen en ze vervolgens aan lokale leiders toe te vertrouwen. Deze gave past bijzonder goed bij intercultureel leiderschap.",
  },
  penginjilan: {
    label: "Penginjilan", en: "Evangelism", nl: "Evangelisatie",
    desc: "Kamu memiliki kerinduan yang mendalam dan kemampuan untuk membagikan Injil kepada orang yang belum percaya.",
    descEn: "A deep longing and Spirit-empowered ability to share the Gospel with unbelievers.",
    descNl: "Een diep verlangen en een door de Geest gegeven vermogen om het Evangelie te delen met niet-gelovigen.",
    realLife: "Dalam kehidupan nyata: Percakapan dengan orang yang belum percaya terasa alami bagimu, bukan canggung. Kamu menemukan cara organik untuk berbagi tentang iman — melalui cerita, pertanyaan, atau momen yang tepat — dan kamu melihat orang merespons.",
    realLifeEn: "In real life: Conversations with unbelievers feel natural to you, not awkward. You find organic ways to share about faith — through stories, questions, or timely moments — and you see people respond.",
    realLifeNl: "In het dagelijks leven: Gesprekken met niet-gelovigen voelen voor jou natuurlijk aan, niet ongemakkelijk. Je vindt organische manieren om over het geloof te spreken — via verhalen, vragen of op het juiste moment — en je ziet mensen reageren.",
    longDesc: "Karunia Penginjilan (euangelistes) adalah karunia yang diberikan Roh untuk memberitakan Injil Yesus Kristus dengan cara yang efektif dan mengundang respons iman. Meskipun semua orang Kristen dipanggil untuk menjadi saksi, mereka yang memiliki karunia ini memiliki kemampuan yang luar biasa untuk menjelaskan Injil dengan jelas, menjawab pertanyaan dengan bijaksana, dan membuat percakapan rohani terasa aman bagi orang yang belum percaya. Efesus 4:11 mencantumkan penginjil sebagai hadiah Kristus bagi Gereja.",
    longDescEn: "The gift of Evangelism (euangelistes) is a Spirit-given gift to proclaim the Gospel of Jesus Christ in ways that effectively invite a faith response. While all Christians are called to be witnesses, those with this gift have an extraordinary ability to explain the Gospel clearly, answer questions wisely, and make spiritual conversations feel safe for unbelievers. Ephesians 4:11 lists the evangelist as one of Christ's gifts to the Church.",
    longDescNl: "De gave van Evangelisatie (euangelistes) is een door de Geest gegeven gave om het Evangelie van Jezus Christus te verkondigen op een manier die effectief uitnodigt tot een reactie van geloof. Hoewel alle christenen geroepen zijn om getuigen te zijn, hebben mensen met deze gave een buitengewoon vermogen om het Evangelie helder uit te leggen, vragen wijs te beantwoorden en geestelijke gesprekken veilig te laten voelen voor niet-gelovigen. Efeziërs 4:11 noemt de evangelist als een van Christus' gaven aan de Kerk.",
  },
  bernubuat: {
    label: "Bernubuat", en: "Prophecy", nl: "Profetie",
    desc: "Kamu menerima dan menyampaikan pesan dari Allah yang menguatkan, mengingatkan, atau menantang jemaat.",
    descEn: "Receiving and delivering messages from God that strengthen, warn, or challenge the community.",
    descNl: "Het ontvangen en overbrengen van berichten van God die de gemeenschap versterken, waarschuwen of uitdagen.",
    realLife: "Dalam kehidupan nyata: Kamu sering merasakan dorongan untuk menyampaikan sesuatu kepada komunitas atau individu — dan ketika kamu melakukannya dalam kerendahan hati, pesanmu beresonansi dengan cara yang melampaui apa yang bisa kamu ketahui sendiri.",
    realLifeEn: "In real life: You often sense an urge to speak something to a community or individual — and when you do so in humility, your message resonates in ways that go beyond what you could have known on your own.",
    realLifeNl: "In het dagelijks leven: Je voelt regelmatig de drang iets te zeggen tot een gemeenschap of individu — en wanneer je dat in nederigheid doet, resoneert jouw boodschap op een manier die verder gaat dan wat jij zelf had kunnen weten.",
    longDesc: "Karunia Bernubuat (propheteia) dalam Perjanjian Baru terutama bersifat forthtelling (menyampaikan) daripada foretelling (meramalkan). Paulus menggambarkannya sebagai membawa 'penguatan, dorongan, dan penghiburan' (1 Kor 14:3). Mereka yang memiliki karunia ini menerima pesan dari Allah yang relevan dengan kebutuhan saat ini komunitas dan menyampaikannya dengan otoritas yang direndahkan. Karunia ini bukan tentang membuat prediksi pribadi; ini tentang menjadi mulut Allah bagi umat-Nya. Semua nubuat harus diuji terhadap Kitab Suci dan komunitas.",
    longDescEn: "The gift of Prophecy (propheteia) in the New Testament is primarily forthtelling rather than foretelling. Paul describes it as bringing 'strengthening, encouragement, and comfort' (1 Cor 14:3). Those with this gift receive messages from God relevant to the present needs of the community and deliver them with humble authority. This gift is not about making personal predictions; it is about being God's voice to His people. All prophecy should be tested against Scripture and community.",
    longDescNl: "De gave van Profetie (propheteia) in het Nieuwe Testament is voornamelijk forthtelling (proclameren) in plaats van foretelling (voorspellen). Paulus beschrijft het als het brengen van 'opbouw, aansporing en troost' (1 Kor. 14:3). Mensen met deze gave ontvangen berichten van God die relevant zijn voor de huidige behoeften van de gemeenschap en brengen die over met bescheiden autoriteit. Deze gave gaat niet over het doen van persoonlijke voorspellingen; het gaat om Gods stem te zijn voor Zijn volk. Alle profetie dient getoetst te worden aan de Schrift en aan de gemeenschap.",
  },
  mengajar: {
    label: "Mengajar", en: "Teaching", nl: "Onderwijs",
    desc: "Kamu mampu menjelaskan kebenaran Alkitab dengan cara yang jelas, menarik, dan mudah dipahami orang lain.",
    descEn: "The ability to explain biblical truth in a clear, engaging, and understandable way.",
    descNl: "Het vermogen om bijbelse waarheid op een heldere, boeiende en begrijpelijke manier uit te leggen.",
    realLife: "Dalam kehidupan nyata: Orang berkata bahwa konsep-konsep sulit menjadi masuk akal ketika kamu menjelaskannya. Kamu menikmati menggali Alkitab dalam kedalaman dan secara alami menemukan cara untuk membuat kebenaran itu dapat diterapkan dan mudah diingat.",
    realLifeEn: "In real life: People say that difficult concepts make sense when you explain them. You enjoy digging deep into Scripture and naturally find ways to make that truth applicable and memorable.",
    realLifeNl: "In het dagelijks leven: Mensen zeggen dat moeilijke concepten begrijpelijk worden wanneer jij ze uitlegt. Je geniet ervan de Bijbel diepgaand te bestuderen en vindt op een natuurlijke manier manieren om die waarheid toepasbaar en gedenkwaardig te maken.",
    longDesc: "Karunia Mengajar (didaskalos) adalah kemampuan yang diberikan Roh untuk menyampaikan kebenaran Alkitab dengan cara yang jelas, sistematis, dan transformatif. Guru-guru sejati tidak hanya mentransfer informasi — mereka membantu orang memahami Alkitab dengan cara yang mengubah cara mereka berpikir dan hidup. Yesus adalah guru terbesar; Paulus, Apolos, dan lainnya meneladani karunia ini. Efesus 4:11 mencantumkan pengajar sebagai hadiah Kristus bagi Gereja untuk kedewasaan jemaat.",
    longDescEn: "The gift of Teaching (didaskalos) is a Spirit-given ability to deliver biblical truth in ways that are clear, systematic, and transformative. True teachers don't merely transfer information — they help people understand Scripture in ways that reshape how they think and live. Jesus was the supreme teacher; Paul, Apollos, and others modelled this gift. Ephesians 4:11 lists the teacher as one of Christ's gifts to the Church for the maturity of the congregation.",
    longDescNl: "De gave van Onderwijs (didaskalos) is een door de Geest gegeven vermogen om bijbelse waarheid over te brengen op een manier die helder, systematisch en transformerend is. Echte leraren dragen niet louter informatie over — ze helpen mensen de Bijbel te begrijpen op manieren die hun denken en leven veranderen. Jezus was de grootste leraar; Paulus, Apollos en anderen toonden deze gave. Efeziërs 4:11 noemt de leraar als een van Christus' gaven aan de Kerk voor de rijpheid van de gemeente.",
  },
  gembala: {
    label: "Gembala", en: "Shepherding", nl: "Herderschap",
    desc: "Kamu dipanggil untuk memelihara, membimbing, dan bertanggung jawab atas pertumbuhan rohani sekelompok orang.",
    descEn: "A calling to nurture, guide, and take responsibility for the spiritual growth of a group.",
    descNl: "Een roeping om de geestelijke groei van een groep mensen te koesteren, te begeleiden en daarvoor verantwoordelijkheid te nemen.",
    realLife: "Dalam kehidupan nyata: Kamu secara alami melacak bagaimana orang-orang dalam komunitasmu — secara rohani, emosional, dan relasional. Kamu merasakan tanggung jawab yang mendalam ketika seseorang mulai menjauh, dan kamu bergerak menuju mereka.",
    realLifeEn: "In real life: You naturally track how people in your community are doing — spiritually, emotionally, and relationally. You feel a deep sense of responsibility when someone starts drifting away, and you move toward them.",
    realLifeNl: "In het dagelijks leven: Je houdt op een natuurlijke manier bij hoe het gaat met mensen in jouw gemeenschap — geestelijk, emotioneel en relationeel. Je voelt een diepe verantwoordelijkheid wanneer iemand begint af te dwalen, en je beweegt naar hen toe.",
    longDesc: "Karunia Gembala (poimen) adalah panggilan untuk memelihara dan melindungi pertumbuhan rohani sekelompok orang secara terus-menerus. Berbeda dengan pengajar yang dapat mengajar banyak orang sekaligus, gembala berkomitmen pada seseorang jangka panjang — mengenal mereka secara mendalam, berjalan bersama mereka dalam kesulitan, dan menjaga mereka agar tetap di jalan. 1 Petrus 5:2-4 menggambarkan gembala sebagai yang memimpin bukan dengan paksaan tetapi rela, bukan dengan motif keuntungan tetapi semangat.",
    longDescEn: "The gift of Shepherding (poimen) is a calling to nurture and protect the spiritual growth of a group of people over time. Unlike teaching which can reach many at once, the shepherd commits to a group long-term — knowing them deeply, walking with them through difficulty, and keeping them on the path. 1 Peter 5:2-4 describes the shepherd as one who leads not by compulsion but willingly, not for dishonest gain but eagerly.",
    longDescNl: "De gave van Herderschap (poimen) is een roeping om de geestelijke groei van een groep mensen te koesteren en te beschermen gedurende langere tijd. Anders dan een leraar die velen tegelijk kan bereiken, verbindt de herder zich op lange termijn aan een groep — kent hen diepgaand, loopt met hen mee door moeilijkheden en houdt hen op het pad. 1 Petrus 5:2-4 beschrijft de herder als iemand die niet door dwang leidt, maar vrijwillig, niet voor eigen gewin maar met toewijding.",
  },
  memimpin: {
    label: "Memimpin", en: "Leadership", nl: "Leiderschap",
    desc: "Kamu mampu menggerakkan, menginspirasi, dan membawa orang lain bersama-sama menuju tujuan yang Allah tetapkan.",
    descEn: "The ability to mobilize, inspire, and unite people toward God-appointed goals.",
    descNl: "Het vermogen om mensen te mobiliseren, te inspireren en te verenigen rondom door God gestelde doelen.",
    realLife: "Dalam kehidupan nyata: Ketika ada kekosongan kepemimpinan dalam sebuah kelompok, orang-orang secara alami melihat ke arahmu. Kamu menemukan cara untuk menyatukan orang dengan latar belakang berbeda di belakang tujuan bersama.",
    realLifeEn: "In real life: When there is a leadership vacuum in a group, people naturally look to you. You find ways to unite people from different backgrounds behind a shared goal.",
    realLifeNl: "In het dagelijks leven: Wanneer er een leiderschapsvacuüm is in een groep, kijken mensen van nature naar jou. Je vindt manieren om mensen met verschillende achtergronden te verenigen achter een gemeenschappelijk doel.",
    longDesc: "Karunia Memimpin (proistemi — 'berdiri di depan') dalam Roma 12:8 diarahkan untuk dilakukan 'dengan rajin'. Pemimpin rohani tidak memimpin untuk kekuasaan tetapi untuk melayani tujuan Allah. Mereka memiliki kemampuan untuk memvisionkan ke mana komunitas perlu pergi, menyelaraskan sumber daya dan orang, dan memotivasi orang lain untuk bergerak bersama. Dalam konteks lintas budaya, pemimpin yang efektif belajar bagaimana memimpin dengan cara yang menghormati nilai-nilai budaya yang beragam sambil tetap setia pada misi.",
    longDescEn: "The gift of Leadership (proistemi — 'to stand before') in Romans 12:8 is directed to be done 'with diligence'. Spiritual leaders lead not for power but to serve God's purposes. They have the ability to vision where the community needs to go, align resources and people, and motivate others to move together. In cross-cultural contexts, effective leaders learn to lead in ways that honour diverse cultural values while remaining faithful to the mission.",
    longDescNl: "De gave van Leiderschap (proistemi — 'voor iemand staan') in Romeinen 12:8 is gericht op 'met ijver' te worden gedaan. Geestelijke leiders leiden niet om macht te verwerven, maar om Gods doelen te dienen. Ze hebben het vermogen een visie te ontwikkelen voor waar de gemeenschap naartoe moet, middelen en mensen te aligneren en anderen te motiveren om samen in beweging te komen. In interculturele contexten leren effectieve leiders op een manier te leiden die diverse culturele waarden respecteert en tegelijkertijd trouw blijft aan de missie.",
  },
  administrasi: {
    label: "Administrasi", en: "Administration", nl: "Administratie",
    desc: "Kamu mampu merencanakan, mengorganisasi, dan mengkoordinasikan sumber daya untuk mencapai tujuan pelayanan.",
    descEn: "The ability to plan, organize, and coordinate resources to achieve ministry goals effectively.",
    descNl: "Het vermogen om middelen te plannen, te organiseren en te coördineren om bedieningen effectief te bereiken.",
    realLife: "Dalam kehidupan nyata: Kamu secara alami melihat bagaimana bagian-bagian yang berbeda dari sebuah proyek saling berhubungan, siapa yang perlu melakukan apa, dan apa yang bisa salah — lalu kamu menciptakan sistem yang membuat semuanya berjalan lancar.",
    realLifeEn: "In real life: You naturally see how the different parts of a project connect, who needs to do what, and what could go wrong — then you create systems that make everything run smoothly.",
    realLifeNl: "In het dagelijks leven: Je ziet van nature hoe de verschillende onderdelen van een project met elkaar verbonden zijn, wie wat moet doen en wat er mis kan gaan — en dan maak je systemen die alles soepel laten verlopen.",
    longDesc: "Karunia Administrasi (kubernesis — istilah Yunani untuk 'mengemudikan kapal') adalah kemampuan untuk mengatur, mengelola, dan mengarahkan program dan sumber daya untuk mencapai tujuan. Sementara pemimpin menentukan ke mana tujuan, administrator memastikan kapal tetap di jalur. Mereka unggul dalam perencanaan proyek, manajemen sumber daya, dan koordinasi orang. Tanpa karunia ini, bahkan visi terbaik pun gagal dalam pelaksanaan. Dalam pelayanan multikultural, karunia ini membantu komunitas yang beragam bekerja bersama secara efektif.",
    longDescEn: "The gift of Administration (kubernesis — the Greek term for 'steering a ship') is the ability to organise, manage, and steer programmes and resources toward goals. While leaders determine the destination, administrators ensure the ship stays on course. They excel in project planning, resource management, and coordinating people. Without this gift, even the best vision fails in execution. In multicultural ministry, this gift helps diverse communities work together effectively.",
    longDescNl: "De gave van Administratie (kubernesis — de Griekse term voor 'een schip sturen') is het vermogen om programma's en middelen te organiseren, beheren en sturen naar doelen. Terwijl leiders de bestemming bepalen, zorgen administrateurs ervoor dat het schip op koers blijft. Ze zijn bedreven in projectplanning, middelenbeheer en het coördineren van mensen. Zonder deze gave mislukt zelfs de beste visie in de uitvoering. In multiculturele dienst helpt deze gave diverse gemeenschappen effectief samen te werken.",
  },
  mukjizat: {
    label: "Mukjizat", en: "Miracles", nl: "Wonderen",
    desc: "Allah menyatakan kuasa-Nya melalui hidupmu dalam cara-cara yang melampaui penjelasan manusia.",
    descEn: "God reveals His power through your life in ways that surpass natural explanation.",
    descNl: "God openbaart Zijn kracht door jouw leven op manieren die de menselijke verklaring te boven gaan.",
    realLife: "Dalam kehidupan nyata: Kamu telah menyaksikan atau menjadi bagian dari situasi di mana Allah bertindak dengan cara yang tidak dapat dijelaskan secara alami — jawaban doa yang dramatis, pemulihan yang tidak terduga, atau kejadian yang terlalu tepat waktu untuk menjadi kebetulan.",
    realLifeEn: "In real life: You have witnessed or been part of situations where God acted in ways that cannot be naturally explained — dramatic answers to prayer, unexpected restorations, or events too perfectly timed to be coincidence.",
    realLifeNl: "In het dagelijks leven: Je hebt situaties meegemaakt of er deel van uitgemaakt waarbij God handelde op manieren die niet op natuurlijke wijze verklaard kunnen worden — dramatische gebedsverhoring, onverwacht herstel, of gebeurtenissen die te perfect getimed zijn om toeval te zijn.",
    longDesc: "Karunia Mukjizat (dunamis — 'kuasa') adalah karunia di mana Allah bekerja melalui seseorang untuk melakukan hal-hal yang melampaui hukum alam. Disebutkan dalam 1 Korintus 12, karunia ini berfungsi sebagai tanda yang menunjuk kepada realitas Kerajaan Allah. Mereka yang memiliki karunia ini bukanlah penampil mukjizat — mereka adalah saluran yang rendah hati melalui mana kuasa Allah mengalir. Dalam konteks di mana Injil sedang disampaikan untuk pertama kalinya, mukjizat sering menjadi sarana utama melalui mana hati dibuka.",
    longDescEn: "The gift of Miracles (dunamis — 'power') is a gift in which God works through a person to do things beyond natural law. Listed in 1 Corinthians 12, this gift functions as a sign pointing to the reality of God's Kingdom. Those with this gift are not performers of miracles — they are humble channels through which God's power flows. In contexts where the Gospel is being presented for the first time, miracles often become a primary means through which hearts are opened.",
    longDescNl: "De gave van Wonderen (dunamis — 'kracht') is een gave waarbij God door een persoon werkt om dingen te doen die de natuurwetten overstijgen. Vermeld in 1 Korintiërs 12 fungeert deze gave als een teken dat wijst naar de realiteit van Gods Koninkrijk. Mensen met deze gave zijn geen uitvoerders van wonderen — zij zijn bescheiden kanalen waardoor Gods kracht stroomt. In contexten waar het Evangelie voor het eerst wordt verkondigd, worden wonderen vaak het voornaamste middel waardoor harten worden geopend.",
  },
  tafsir_bahasa_roh: {
    label: "Tafsir Bahasa Roh", en: "Interpretation of Tongues", nl: "Uitleg van Tongen",
    desc: "Kamu menerima kemampuan untuk menyampaikan makna dari pesan bahasa roh kepada jemaat.",
    descEn: "The ability to convey the meaning of tongue messages to the gathered community.",
    descNl: "Het vermogen om de betekenis van een tongenboodschap over te brengen aan de verzamelde gemeenschap.",
    realLife: "Dalam kehidupan nyata: Ketika seseorang berbicara dalam bahasa roh dalam lingkungan ibadah, kamu menerima pemahaman tentang apa yang sedang dikomunikasikan dan merasa terdorong untuk menyampaikannya kepada jemaat.",
    realLifeEn: "In real life: When someone speaks in tongues in a worship setting, you receive understanding of what is being communicated and feel compelled to convey it to the gathered community.",
    realLifeNl: "In het dagelijks leven: Wanneer iemand in tongen spreekt in een aanbiddingssetting, ontvang jij begrip van wat er gecommuniceerd wordt en voel je de drang dit aan de gemeenschap mee te delen.",
    longDesc: "Karunia Tafsir Bahasa Roh (hermenia glosson) adalah pasangan karunia bahasa roh. Paulus menjelaskan dalam 1 Korintus 14 bahwa ketika bahasa roh digunakan dalam pertemuan umum, harus ada penafsiran sehingga seluruh jemaat dapat mendapat manfaat. Mereka yang memiliki karunia ini menerima makna dari pesan yang disampaikan dalam bahasa roh dan menyampaikannya dalam bahasa yang dapat dimengerti. Ini bukan terjemahan kata per kata tetapi penyampaian makna dan maksud rohani.",
    longDescEn: "The gift of Interpretation of Tongues (hermenia glosson) is the companion gift to tongues. Paul explains in 1 Corinthians 14 that when tongues are used in a public gathering, there must be interpretation so the whole community can benefit. Those with this gift receive the meaning of a tongue message and convey it in an understandable language. This is not word-for-word translation but the conveyance of spiritual meaning and intent.",
    longDescNl: "De gave van Uitleg van Tongen (hermenia glosson) is de complementaire gave bij tongen. Paulus legt in 1 Korintiërs 14 uit dat wanneer tongen in een openbare bijeenkomst worden gebruikt, er uitleg moet zijn zodat de hele gemeenschap ervan kan profiteren. Mensen met deze gave ontvangen de betekenis van een tongenboodschap en brengen die over in een begrijpelijke taal. Dit is geen woord-voor-woord vertaling, maar het overbrengen van geestelijke betekenis en intentie.",
  },
};

const GIFT_ICONS: Record<string, React.ReactElement> = {
  melayani: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>,
  murah_hati: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  keramahan: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  bahasa_roh: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M12 7v2m0 4h.01"/></svg>,
  menyembuhkan: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/></svg>,
  menguatkan: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  memberi: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-4 0v2"/><path d="M12 7v14M8 7v0a4 4 0 0 1 4-4v0a4 4 0 0 1 4 4v0"/></svg>,
  hikmat: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
  pengetahuan: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  iman: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  kerasulan: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  penginjilan: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.89 12 19.79 19.79 0 0 1 1.85 3.5 2 2 0 0 1 3.82 1.5h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.4a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  bernubuat: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  mengajar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  gembala: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  memimpin: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
  administrasi: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  mukjizat: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  tafsir_bahasa_roh: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M7 8h10M7 12h6"/></svg>,
};

const QUESTIONS: { id: string; en: string; nl: string }[] = [
  { id: "Aku bisa digambarkan sebagai orang yang berbelas kasih pada orang lain.", en: "I can be described as a compassionate person toward others.", nl: "Ik kan beschreven worden als een medelevend persoon." },
  { id: "Aku sering menemukan diri berkomunikasi dengan orang yang paling sulit di dalam kelompokku.", en: "I often find myself communicating with the most difficult people in my group.", nl: "Ik kom vaak in gesprek met de moeilijkste mensen in mijn groep." },
  { id: "Aku selalu mengundang orang-orang ke rumahku.", en: "I always invite people to my home.", nl: "Ik nodig mensen altijd uit bij mij thuis." },
  { id: "Aku percaya bahwa aku mempunyai kemampuan supranatural dalam berdoa.", en: "I believe I have a supernatural ability in prayer.", nl: "Ik geloof dat ik een bovennatuurlijk vermogen heb om te bidden." },
  { id: "Aku pernah berdoa memohon kesembuhan seseorang, dan orang itu menjadi sembuh.", en: "I have prayed for someone's healing, and that person was healed.", nl: "Ik heb voor iemands genezing gebeden en die persoon werd genezen." },
  { id: "Aku senang mendorong orang-orang yang putus asa agar mereka bisa melihat betapa Allah mengasihi mereka.", en: "I enjoy encouraging discouraged people so they can see how much God loves them.", nl: "Ik vind het fijn om ontmoedigde mensen te bemoedigen zodat ze zien hoeveel God van hen houdt." },
  { id: "Aku merasa terpanggil untuk memberikan sebagian besar yang kumiliki demi kebutuhan pelayanan.", en: "I feel called to give most of what I have to ministry needs.", nl: "Ik voel me geroepen om het grootste deel van wat ik heb te geven voor de behoeften van de bediening." },
  { id: "Aku punya kemampuan untuk melihat situasi-situasi sulit dengan sudut pandang Allah.", en: "I have the ability to view difficult situations from God's perspective.", nl: "Ik heb het vermogen om moeilijke situaties vanuit Gods perspectief te bekijken." },
  { id: "Aku dapat mendengar firman Tuhan secara langsung yang bisa diterapkan pada situasi-situasi tertentu.", en: "I can hear God's word directly and apply it to specific situations.", nl: "Ik kan Gods woord rechtstreeks ontvangen en toepassen op specifieke situaties." },
  { id: "Aku percaya bahwa hal-hal mustahil menjadi mungkin karena iman.", en: "I believe impossible things become possible through faith.", nl: "Ik geloof dat onmogelijke dingen mogelijk worden door geloof." },
  { id: "Aku membaktikan diri untuk memimpin pertumbuhan pelayanan dalam komunitas yang berbeda-beda atau negara lain.", en: "I dedicate myself to leading ministry growth in different communities or other countries.", nl: "Ik zet mij in om de groei van de bediening te leiden in verschillende gemeenschappen of andere landen." },
  { id: "Aku merasakan kerinduan untuk memberitakan Injil kepada mereka yang belum mengenal Kristus.", en: "I feel a longing to share the Gospel with those who don't know Christ.", nl: "Ik voel een verlangen om het Evangelie te delen met hen die Christus nog niet kennen." },
  { id: "Aku mendapat kesan-kesan dari Tuhan tentang situasi-situasi yang terjadi dalam kehidupan orang lain.", en: "I receive impressions from God about situations in other people's lives.", nl: "Ik ontvang impressies van God over situaties in het leven van anderen." },
  { id: "Aku senang mempersiapkan dan menyampaikan pesan-pesan Alkitab.", en: "I enjoy preparing and delivering biblical messages.", nl: "Ik vind het fijn om bijbelse boodschappen voor te bereiden en te verkondigen." },
  { id: "Aku merasa bertanggung jawab dan peduli terhadap pertumbuhan spiritual orang lain.", en: "I feel responsible and care about the spiritual growth of others.", nl: "Ik voel me verantwoordelijk voor en betrokken bij de geestelijke groei van anderen." },
  { id: "Aku suka mengambil tanggung jawab dan memimpin orang-orang supaya tujuan yang ditetapkan oleh Allah bisa tercapai.", en: "I like to take responsibility and lead people so that God's purpose can be achieved.", nl: "Ik neem graag verantwoordelijkheid en leid mensen zodat Gods doel bereikt kan worden." },
  { id: "Aku lebih suka merencanakan, mengorganisasi dan menargetkan sesuatu sebelum memulai sebuah proyek.", en: "I prefer to plan, organise, and set targets before starting a project.", nl: "Ik plan, organiseer en stel doelen liever voordat ik een project begin." },
  { id: "Aku percaya Allah bermaksud untuk memakaiku untuk melakukan mukjizat.", en: "I believe God intends to use me to perform miracles.", nl: "Ik geloof dat God van plan is mij te gebruiken om wonderen te doen." },
  { id: "Aku merasa bahwa Allah telah menunjukku untuk menafsirkan pesan-pesan yang disampaikan dalam Bahasa Roh.", en: "I feel that God has appointed me to interpret messages spoken in Tongues.", nl: "Ik voel dat God mij heeft aangesteld om berichten te vertolken die in Tongen worden gesproken." },
  { id: "Aku melayani orang lain melalui perbuatan-perbuatan yang sederhana dan praktis.", en: "I serve others through simple and practical deeds.", nl: "Ik dien anderen door eenvoudige en praktische daden." },
  { id: "Aku merasakan kebutuhan untuk memperhatikan orang-orang yang sakit dan yang terluka secara emosi.", en: "I feel the need to care for people who are sick or emotionally wounded.", nl: "Ik voel de behoefte voor mensen te zorgen die ziek zijn of emotioneel gewond." },
  { id: "Aku merasa tidak nyaman ketika orang asing atau pendatang baru tidak mendapatkan sambutan yang baik.", en: "I feel uncomfortable when strangers or newcomers don't receive a warm welcome.", nl: "Ik voel me ongemakkelijk wanneer vreemdelingen of nieuwelingen geen hartelijk welkom ontvangen." },
  { id: "Aku percaya Allah memakaiku untuk berbicara dalam Bahasa Roh.", en: "I believe God uses me to speak in Tongues.", nl: "Ik geloof dat God mij gebruikt om in Tongen te spreken." },
  { id: "Aku memiliki kerinduan yang mendalam untuk mendoakan orang-orang yang sakit agar mereka menjadi sembuh.", en: "I have a deep longing to pray for sick people so they will be healed.", nl: "Ik heb een diep verlangen om voor zieke mensen te bidden zodat zij genezen." },
  { id: "Aku merasa terdorong untuk memberikan semangat kepada mereka yang kecil hati.", en: "I feel compelled to give encouragement to those who are discouraged.", nl: "Ik voel me gedrongen bemoediging te geven aan hen die ontmoedigd zijn." },
  { id: "Aku sering memberikan lebih dari persepuluhan dalam pengeluaran anggaranku.", en: "I often give more than a tithe in my financial budget.", nl: "Ik geef vaak meer dan een tiende in mijn financiële budget." },
  { id: "Orang sering meminta nasihatku ketika mereka menghadapi keputusan-keputusan penting.", en: "People often ask for my advice when facing important decisions.", nl: "Mensen vragen me vaak om advies bij belangrijke beslissingen." },
  { id: "Aku percaya Tuhan memberiku pengetahuan secara supranatural tentang seseorang atau situasi tertentu.", en: "I believe God gives me supernatural knowledge about a person or specific situation.", nl: "Ik geloof dat God mij bovennatuurlijke kennis geeft over een persoon of specifieke situatie." },
  { id: "Aku percaya kepada Allah karena sering mengalami kejadian-kejadian supranatural.", en: "I believe in God because I often experience supernatural events.", nl: "Ik geloof in God omdat ik vaak bovennatuurlijke ervaringen meemaak." },
  { id: "Aku merasa nyaman saat berada di antara orang-orang yang berbeda ras, bahasa, dan budaya.", en: "I feel comfortable among people of different races, languages, and cultures.", nl: "Ik voel me op mijn gemak bij mensen van verschillende rassen, talen en culturen." },
  { id: "Aku sering memikirkan cara-cara kreatif untuk menceritakan tentang Yesus kepada orang yang tidak percaya.", en: "I often think of creative ways to tell others about Jesus.", nl: "Ik denk vaak na over creatieve manieren om anderen over Jezus te vertellen." },
  { id: "Aku percaya Allah kadang-kadang memakaiku untuk menyampaikan pesan-pesan profetis bagi komunitasku.", en: "I believe God sometimes uses me to deliver prophetic messages to my community.", nl: "Ik geloof dat God mij soms gebruikt om profetische boodschappen aan mijn gemeenschap te brengen." },
  { id: "Aku suka menjelaskan kebenaran-kebenaran alkitabiah dengan cara yang mudah dimengerti orang lain.", en: "I enjoy explaining biblical truths in ways that others can easily understand.", nl: "Ik leg graag bijbelse waarheden uit op een manier die anderen makkelijk begrijpen." },
  { id: "Aku senang membimbing dan memelihara sekelompok orang dalam perjalanan iman mereka.", en: "I enjoy guiding and nurturing a group of people in their faith journey.", nl: "Ik begeleid en koester graag een groep mensen op hun geloofstocht." },
  { id: "Aku bisa menetapkan tujuan dan merencanakan cara paling efektif untuk mencapainya.", en: "I can set goals and plan the most effective way to achieve them.", nl: "Ik kan doelen stellen en de meest effectieve manier plannen om ze te bereiken." },
  { id: "Aku senang mengatur detail-detail proyek agar berjalan dengan lancar dan efisien.", en: "I enjoy organising project details so they run smoothly and efficiently.", nl: "Ik regel projectdetails graag zodat alles soepel en efficiënt verloopt." },
  { id: "Aku telah menyaksikan kekuatan Allah yang ajaib dalam kehidupan seseorang sebagai jawaban atas doaku.", en: "I have witnessed God's amazing power in someone's life as an answer to my prayer.", nl: "Ik heb Gods verbazingwekkende kracht gezien in iemands leven als antwoord op mijn gebed." },
  { id: "Aku pernah menafsirkan pesan bahasa roh dalam sebuah pertemuan ibadah.", en: "I have interpreted a tongue message in a worship gathering.", nl: "Ik heb een tongenboodschap vertolkt in een aanbiddingsbijeenkomst." },
  { id: "Aku merasa terpanggil untuk membantu orang lain dalam pekerjaan dan kebutuhan mereka sehari-hari.", en: "I feel called to help others in their work and daily needs.", nl: "Ik voel me geroepen om anderen te helpen bij hun dagelijkse werk en behoeften." },
  { id: "Aku biasanya meluangkan waktu untuk menunjukkan kepedulian kepada orang yang sedang berduka.", en: "I usually take time to show care to someone who is grieving.", nl: "Ik neem gewoonlijk de tijd om zorg te tonen aan iemand die treurt." },
  { id: "Aku senang membuat orang lain merasa nyaman dan diterima di rumahku atau di lingkunganku.", en: "I enjoy making others feel comfortable and accepted in my home or environment.", nl: "Ik maak anderen graag comfortabel en welkom bij mij thuis of in mijn omgeving." },
  { id: "Aku pernah berbicara dalam bahasa yang tidak kupelajari ketika sedang berdoa atau beribadah.", en: "I have spoken in a language I did not learn while praying or worshipping.", nl: "Ik heb in een taal gesproken die ik niet heb geleerd tijdens gebed of aanbidding." },
  { id: "Aku percaya Allah bermaksud untuk menggunakan doa-doaku untuk menyembuhkan orang yang sakit.", en: "I believe God intends to use my prayers to heal the sick.", nl: "Ik geloof dat God van plan is mijn gebeden te gebruiken om zieken te genezen." },
  { id: "Aku senang menolong orang melihat kebaikan Allah dalam situasi sulit yang mereka hadapi.", en: "I enjoy helping people see God's goodness in difficult situations.", nl: "Ik help mensen graag Gods goedheid te zien in moeilijke situaties." },
  { id: "Aku dengan senang hati memberikan uang atau waktuku ketika melihat kebutuhan nyata di sekelilingku.", en: "I willingly give my money or time when I see a real need around me.", nl: "Ik geef graag mijn geld of tijd wanneer ik een echte nood om mij heen zie." },
  { id: "Aku biasanya dapat memberi saran yang tepat dan berwawasan jauh ketika diminta.", en: "I can usually give accurate and insightful advice when asked.", nl: "Ik kan gewoonlijk nauwkeurig en inzichtelijk advies geven wanneer gevraagd." },
  { id: "Aku sering mendapatkan pemahaman baru tentang firman Tuhan yang terasa langsung dari Allah.", en: "I often receive new understanding of God's word that feels directly from Him.", nl: "Ik ontvang vaak nieuwe inzichten over Gods woord die direct van Hem afkomstig lijken." },
  { id: "Aku memiliki keyakinan teguh bahwa doa yang sungguh-sungguh dapat mengubah situasi yang tampak mustahil.", en: "I have a firm conviction that sincere prayer can change seemingly impossible situations.", nl: "Ik heb de vaste overtuiging dat oprecht gebed ogenschijnlijk onmogelijke situaties kan veranderen." },
  { id: "Aku beradaptasi dengan mudah terhadap hal-hal baru.", en: "I adapt easily to new things.", nl: "Ik pas mij makkelijk aan nieuwe dingen aan." },
  { id: "Aku berbagi dengan orang lain saat mereka telah menerima Kristus.", en: "I share with others when they have received Christ.", nl: "Ik deel met anderen wanneer ze Christus hebben aangenomen." },
  { id: "Aku mendapat pesan penting dari Tuhan.", en: "I receive important messages from God.", nl: "Ik ontvang belangrijke boodschappen van de Heer." },
  { id: "Aku mau menghabiskan waktu luang untuk mempelajari prinsip-prinsip alkitabiah agar bisa menjelaskannya kepada orang lain.", en: "I am willing to spend free time studying biblical principles so I can explain them to others.", nl: "Ik besteed graag vrije tijd aan het bestuderen van bijbelse principes om ze aan anderen uit te kunnen leggen." },
  { id: "Aku ingin menjadi pendeta atau gembala jemaat.", en: "I want to become a pastor or shepherd of a congregation.", nl: "Ik wil predikant of herder van een gemeente worden." },
  { id: "Aku telah mempengaruhi orang lain untuk menyelesaikan tugas atau menemukan jawaban alkitabiah yang membantu hidup mereka.", en: "I have influenced others to complete tasks or find biblical answers that helped their lives.", nl: "Ik heb anderen beïnvloed om taken te voltooien of bijbelse antwoorden te vinden die hun leven hielpen." },
  { id: "Aku senang mempelajari masalah-masalah manajemen dan cara berorganisasi.", en: "I enjoy studying management problems and organisational methods.", nl: "Ik bestudeer graag management- en organisatiemethoden." },
  { id: "Tuhan telah melakukan keajaiban dalam hidupku.", en: "God has performed miracles in my life.", nl: "God heeft wonderen in mijn leven gedaan." },
  { id: "Aku telah menafsirkan bahasa roh sehingga memberkati orang lain.", en: "I have interpreted tongues in a way that blessed others.", nl: "Ik heb tongen vertolkt op een manier die anderen zegende." },
  { id: "Aku tipe orang yang suka menjangkau orang-orang yang tidak beruntung.", en: "I am the type of person who likes to reach out to the less fortunate.", nl: "Ik ben het type persoon dat graag de hand uitreikt naar minder bedeelden." },
  { id: "Aku suka mengunjungi rumah peristirahatan dan panti-panti lainnya tempat orang-orang kesepian dan membutuhkan kunjungan.", en: "I like to visit rest homes and other places where lonely people need a visit.", nl: "Ik bezoek graag verpleegtehuizen en andere plaatsen waar eenzame mensen een bezoek nodig hebben." },
  { id: "Aku suka menyiapkan makanan dan menyediakan tempat tinggal bagi mereka yang membutuhkan.", en: "I enjoy preparing food and providing shelter for those in need.", nl: "Ik bereid graag maaltijden voor en bied onderdak aan hen die het nodig hebben." },
  { id: "Orang lain telah menafsirkan bahasa rohku.", en: "Others have interpreted my tongue message.", nl: "Anderen hebben mijn tongenboodschap vertolkt." },
  { id: "Allah menyembuhkan orang lain melalui aku.", en: "God heals others through me.", nl: "God geneest anderen door mij." },
  { id: "Aku dikenal karena sering memberi dorongan kepada orang lain.", en: "I am known for often encouraging others.", nl: "Ik sta bekend om het regelmatig aanmoedigen van anderen." },
  { id: "Aku senang memberikan uangku.", en: "I enjoy giving my money.", nl: "Ik geef graag mijn geld." },
  { id: "Allah telah memberikan kemampuan kepadaku untuk memberi bimbingan dan nasihat kepada orang lain.", en: "God has given me the ability to guide and counsel others.", nl: "God heeft mij het vermogen gegeven anderen te begeleiden en te counselen." },
  { id: "Aku cenderung memakai wawasan alkitabiah ketika sedang berdiskusi dengan orang lain.", en: "I tend to use biblical insights when discussing with others.", nl: "Ik gebruik graag bijbelse inzichten in gesprekken met anderen." },
  { id: "Cukup mudah bagiku untuk berdoa dengan cara yang luar biasa.", en: "It is fairly easy for me to pray in an extraordinary way.", nl: "Het is voor mij tamelijk eenvoudig om op een buitengewone manier te bidden." },
  { id: "Aku memiliki kerinduan yang mendalam untuk melihat orang-orang di negara lain untuk menjadi pengikut Kristus.", en: "I have a deep longing to see people in other countries become followers of Christ.", nl: "Ik heb een diep verlangen om mensen in andere landen tot volgelingen van Christus te zien worden." },
  { id: "Aku selalu memikirkan cara-cara baru supaya aku bisa berbagi dengan teman-teman non Kristen.", en: "I am always thinking of new ways I can share with my non-Christian friends.", nl: "Ik denk voortdurend na over nieuwe manieren waarop ik met mijn niet-christelijke vrienden kan delen." },
  { id: "Aku ingin menyampaikan firman Allah yang akan menantang orang untuk berubah.", en: "I want to deliver God's word that will challenge people to change.", nl: "Ik wil Gods woord overbrengen dat mensen uitdaagt te veranderen." },
  { id: "Allah memakaiku untuk membantu orang lain agar lebih paham makna menjadi orang Kristen.", en: "God uses me to help others better understand what it means to be a Christian.", nl: "God gebruikt mij om anderen beter te begrijpen wat het betekent christen te zijn." },
  { id: "Aku bisa melihat diriku bertanggung jawab atas perkembangan spiritual orang lain.", en: "I can see myself being responsible for the spiritual development of others.", nl: "Ik zie mezelf verantwoordelijk voor de geestelijke ontwikkeling van anderen." },
  { id: "Saat berada dalam sebuah kelompok, aku biasanya menjadi pemimpin atau mengambil alih kepemimpinan.", en: "When in a group, I usually become the leader or take over leadership.", nl: "In een groep word ik gewoonlijk leider of neem ik de leiding over." },
  { id: "Meskipun aku cukup mampu melakukan sesuatu sendirian, aku suka mengajak orang lain untuk membantu mengatur pekerjaan kami.", en: "Although capable alone, I prefer to involve others in organising our work.", nl: "Hoewel ik best alleen iets kan doen, betrek ik anderen liever bij het organiseren van ons werk." },
  { id: "Aku sudah menyaksikan kekuatan Allah yang ajaib dan dalam melalui hidupku.", en: "I have witnessed the deep and amazing power of God through my life.", nl: "Ik heb de diepe en verbazingwekkende kracht van God door mijn leven heen meegemaakt." },
  { id: "Allah memakai karuniaku dalam menafsirkan bahasa roh untuk menyampaikan firman kepada orang lain.", en: "God uses my gift of interpretation of tongues to deliver His word to others.", nl: "God gebruikt mijn gave van tongvertolking om Zijn woord aan anderen over te brengen." },
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
  isLoggedIn: boolean;
  karuniaTopGifts: string[] | null;
  karuniaScores: Record<string, number> | null;
}

const GIFT_OVERVIEW_ORDER = [
  "melayani", "murah_hati", "keramahan", "bahasa_roh", "menyembuhkan",
  "menguatkan", "memberi", "hikmat", "pengetahuan", "iman",
  "kerasulan", "penginjilan", "bernubuat", "mengajar", "gembala",
  "memimpin", "administrasi", "mukjizat", "tafsir_bahasa_roh",
];

export default function KaruniaClient({ isSaved, isLoggedIn, karuniaTopGifts, karuniaScores }: Props) {
  const { lang: _ctxLang, setLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
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
    if (!isLoggedIn) {
      window.location.href = "/signup?redirect=/resources/karunia-rohani";
      return;
    }
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

  function handlePrint() {
    window.print();
  }

  const ratingLabels = lang === "id"
    ? ["Sangat tidak sesuai", "Sedikit sesuai", "Agak sesuai", "Sangat sesuai"]
    : lang === "nl"
    ? ["Helemaal niet", "Zelden", "Soms", "Vaak"]
    : ["Not at all", "Rarely", "Sometimes", "Often"];

  const KaruniaLangToggle = () => (
    <div style={{ display: "flex", gap: "0", border: `1px solid ${BORDER}`, overflow: "hidden", flexShrink: 0 }}>
      {(["id", "nl", "en"] as Lang[]).map(l => (
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
      <>
        <LangToggle />
        {/* Print styles */}
        <style>{`
          @media print {
            body * { visibility: hidden !important; }
            #print-results { display: block !important; visibility: visible !important; position: absolute; left: 0; top: 0; width: 100%; }
            #print-results * { visibility: visible !important; }
            .no-print { display: none !important; }
          }
        `}</style>

        <div style={{ fontFamily: "var(--font-montserrat)" }}>
          {/* ── RESULTS HERO ── */}
          <div style={{ background: BG_DARK, padding: "4rem 1.5rem 3rem" }} className="no-print">
            <div style={{ maxWidth: "720px", margin: "0 auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", color: PRIMARY, textTransform: "uppercase", margin: 0 }}>
                  {lang === "id" ? "Hasil Tes" : lang === "nl" ? "Testresultaten" : "Test Results"}
                </p>
                <KaruniaLangToggle />
              </div>
              <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: "1rem" }}>
                {lang === "id" ? "Karunia Rohani Kamu" : lang === "nl" ? "Jouw Geestelijke Gaven" : "Your Spiritual Gifts"}
              </h1>
              <p style={{ fontSize: "0.9375rem", color: "oklch(78% 0.008 80)", lineHeight: 1.7, margin: 0 }}>
                {lang === "id"
                  ? "Berdasarkan jawabanmu, berikut adalah karunia rohani utama yang Allah berikan kepadamu."
                  : lang === "nl" ? "Op basis van jouw antwoorden zijn dit de primaire geestelijke gaven die God jou heeft gegeven."
                  : "Based on your answers, here are the primary spiritual gifts God has given you."}
              </p>
            </div>
          </div>

          {/* ── TOP 3 + ALL GIFTS ── */}
          <div style={{ background: BG_LIGHT, padding: "3rem 1.5rem" }} className="no-print">
            <div style={{ maxWidth: "720px", margin: "0 auto" }}>

              {/* Top 3 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "3rem" }}>
                {resultTopGifts.slice(0, 3).map((key, idx) => {
                  const gift = GIFTS[key];
                  const score = resultScores[key] ?? 0;
                  if (!gift) return null;
                  const icon = GIFT_ICONS[key];
                  return (
                    <div key={key} style={{
                      background: "white",
                      border: `2px solid ${idx === 0 ? PRIMARY : BORDER}`,
                      padding: "1.75rem",
                      display: "flex",
                      gap: "1.25rem",
                      alignItems: "flex-start",
                    }}>
                      <div style={{
                        flexShrink: 0,
                        width: "3rem",
                        height: "3rem",
                        background: idx === 0 ? PRIMARY : "oklch(93% 0.04 45)",
                        color: idx === 0 ? "white" : PRIMARY,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0.625rem",
                      }}>
                        {icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.25rem" }}>
                          <p style={{ fontWeight: 800, fontSize: "1.0625rem", color: "oklch(18% 0.05 260)", margin: 0 }}>
                            {lang === "id" ? gift.label : lang === "nl" ? gift.nl : gift.en}
                          </p>
                          <p style={{ fontSize: "0.72rem", fontWeight: 700, color: PRIMARY, margin: 0 }}>
                            {score}/12
                          </p>
                        </div>
                        <p style={{ fontSize: "0.8125rem", lineHeight: 1.65, color: "oklch(38% 0.008 260)", marginBottom: "0.75rem" }}>
                          {lang === "id" ? gift.longDesc : lang === "nl" ? gift.longDescNl : gift.longDescEn}
                        </p>
                        <p style={{ fontSize: "0.8125rem", fontStyle: "italic", color: PRIMARY, margin: 0, lineHeight: 1.6, borderLeft: `3px solid ${PRIMARY}`, paddingLeft: "0.75rem" }}>
                          {lang === "id" ? gift.realLife : lang === "nl" ? gift.realLifeNl : gift.realLifeEn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* All gifts bar chart */}
              <div style={{ marginBottom: "2.5rem" }}>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", color: "oklch(52% 0.008 260)", textTransform: "uppercase", marginBottom: "1.25rem" }}>
                  {lang === "id" ? "Semua Karunia" : lang === "nl" ? "Alle Gaven" : "All Gifts"}
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
                            {lang === "id" ? gift.label : lang === "nl" ? gift.nl : gift.en}
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

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", marginBottom: "2rem" }}>
                {saved ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", fontWeight: 700, color: PRIMARY }}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {lang === "id" ? "✓ Tersimpan di Dashboard" : lang === "nl" ? "✓ Opgeslagen in Dashboard" : "✓ Saved to Dashboard"}
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
                      ? (lang === "id" ? "Menyimpan..." : lang === "nl" ? "Opslaan..." : "Saving...")
                      : (lang === "id" ? "Simpan ke Dashboard →" : lang === "nl" ? "Opslaan in Dashboard →" : "Save to Dashboard →")}
                  </button>
                )}
                <button
                  onClick={handlePrint}
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
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
                  </svg>
                  {lang === "id" ? "Unduh PDF" : lang === "nl" ? "PDF Downloaden" : "Download PDF"}
                </button>
                <button
                  onClick={handleRetake}
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    background: "transparent",
                    color: "oklch(52% 0.008 260)",
                    border: `1px solid ${BORDER}`,
                    padding: "0.65rem 1.375rem",
                    cursor: "pointer",
                  }}
                >
                  {lang === "id" ? "Ulangi Tes" : lang === "nl" ? "Test Herhalen" : "Retake Test"}
                </button>
              </div>

              {saveError && (
                <p style={{ fontSize: "0.8rem", color: "oklch(52% 0.18 25)", marginBottom: "1rem" }}>
                  {lang === "id" ? "Terjadi kesalahan. Silakan coba lagi." : lang === "nl" ? "Er is iets misgegaan. Probeer het opnieuw." : "Something went wrong. Please try again."}
                </p>
              )}

              <p style={{ fontSize: "0.72rem", color: "oklch(62% 0.008 260)", lineHeight: 1.6, borderTop: `1px solid ${BORDER}`, paddingTop: "1.5rem" }}>
                {lang === "id"
                  ? <>Diadaptasi dari Jim Burns &amp; Doug Fields, &ldquo;The Word on Finding and Using Your Spiritual Gifts&rdquo;</>
                  : <>Adapted from Jim Burns &amp; Doug Fields, &ldquo;The Word on Finding and Using Your Spiritual Gifts&rdquo;</>}
              </p>
            </div>
          </div>


          {/* ── PRINT VIEW (hidden on screen, visible on print) ── */}
          <div id="print-results" style={{ display: "none", fontFamily: "var(--font-montserrat)", padding: "2rem", maxWidth: "800px" }}>
            {/* Print header */}
            <div style={{ borderBottom: "3px solid #c27a2e", paddingBottom: "1.25rem", marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c27a2e", margin: "0 0 0.25rem" }}>Crispy Development</p>
                <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1a1a2e", margin: "0 0 0.25rem" }}>
                  {lang === "id" ? "Hasil Tes Karunia Rohani" : lang === "nl" ? "Resultaten Geestelijke Gaven Test" : "Spiritual Gifts Test Results"}
                </h1>
                <p style={{ fontSize: "0.8rem", color: "#666", margin: 0 }}>crispyleaders.com</p>
              </div>
              {/* QR */}
              <div style={{ textAlign: "center" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=https://crispyleaders.com" alt="QR crispyleaders.com" width={70} height={70} />
                <p style={{ fontSize: "0.55rem", color: "#999", margin: "0.2rem 0 0", textAlign: "center" }}>crispyleaders.com</p>
              </div>
            </div>

            {/* Print top 3 */}
            <h2 style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c27a2e", marginBottom: "1rem" }}>
              {lang === "id" ? "Tiga Karunia Utama" : lang === "nl" ? "Jouw Drie Hoofdgaven" : "Your Top Three Gifts"}
            </h2>
            {resultTopGifts.slice(0, 3).map((key, idx) => {
              const gift = GIFTS[key];
              const score = resultScores[key] ?? 0;
              if (!gift) return null;
              return (
                <div key={key} style={{ borderLeft: `3px solid ${idx === 0 ? "#c27a2e" : "#ddd"}`, paddingLeft: "1rem", marginBottom: "1.25rem" }}>
                  <p style={{ fontWeight: 800, fontSize: "1rem", color: "#1a1a2e", margin: "0 0 0.2rem" }}>
                    {idx + 1}. {lang === "id" ? gift.label : lang === "nl" ? gift.nl : gift.en}
                    <span style={{ fontWeight: 500, fontSize: "0.78rem", color: "#c27a2e", marginLeft: "0.5rem" }}>{score}/12</span>
                  </p>
                  <p style={{ fontSize: "0.78rem", color: "#444", lineHeight: 1.6, margin: "0 0 0.4rem" }}>
                    {lang === "id" ? gift.desc : lang === "nl" ? gift.descNl : gift.descEn}
                  </p>
                  <p style={{ fontSize: "0.75rem", fontStyle: "italic", color: "#888", margin: 0 }}>
                    {lang === "id" ? gift.realLife : lang === "nl" ? gift.realLifeNl : gift.realLifeEn}
                  </p>
                </div>
              );
            })}

            {/* Print promo */}
            <div style={{ borderTop: "1px solid #eee", marginTop: "2rem", background: "#f9f7f4", padding: "1.25rem" }}>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c27a2e", margin: "0 0 0.5rem" }}>
                {lang === "id" ? "Lebih Banyak di Crispy Development" : lang === "nl" ? "Meer bij Crispy Development" : "More at Crispy Development"}
              </p>
              <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1a1a2e", margin: "0 0 0.5rem" }}>
                {lang === "id" ? "Temukan lebih banyak alat untuk pemimpin lintas budaya" : lang === "nl" ? "Ontdek meer tools voor interculturele leiders" : "Discover more tools for cross-cultural leaders"}
              </p>
              <p style={{ fontSize: "0.75rem", color: "#555", margin: "0 0 0.75rem", lineHeight: 1.6 }}>
                {lang === "id"
                  ? "Gaya Kepemimpinan · Ketinggian Kepemimpinan · Tiga Gaya Berpikir · Zona Nyaman · dan lebih banyak lagi"
                  : lang === "nl" ? "Leiderschapsstijl · Leiderschapshoogten · Drie Denkstijlen · Comfortzone · en meer"
                  : "Leadership Style · Leadership Altitudes · Three Thinking Styles · Comfort Zone · and more"}
              </p>
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#c27a2e", margin: 0 }}>→ crispyleaders.com/resources</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const progressPct = Math.round((Object.keys(answers).length / TOTAL_QUESTIONS) * 100);
  const isQuizStarted = Object.keys(answers).length > 0 || page > 0;

  return (
    <div style={{ fontFamily: "var(--font-montserrat)" }}>
      <LangToggle />
      {/* ── HERO ── */}
      <div style={{ background: BG_DARK, padding: "4rem 1.5rem 3rem" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", color: PRIMARY, textTransform: "uppercase", margin: 0 }}>
              {lang === "id" ? "Assessment · 20 menit" : lang === "nl" ? "Assessment · 20 minuten" : "Assessment · 20 minutes"}
            </p>
            <KaruniaLangToggle />
          </div>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, color: "white", lineHeight: 1.08, margin: "0 0 24px" }}>
            {lang === "id" ? "Tes Karunia Rohani" : lang === "nl" ? "Geestelijke Gaven Test" : "Spiritual Gifts Test"}
          </h1>
          <p style={{ fontSize: "0.9375rem", color: "oklch(78% 0.008 80)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            {lang === "id"
              ? "Temukan karunia rohani yang Allah berikan kepadamu — dan bagaimana karunia itu bisa dimaksimalkan dalam pelayanan dan kepemimpinan."
              : lang === "nl" ? "Ontdek de geestelijke gaven die God jou heeft gegeven — en hoe je die kunt maximaliseren in dienst en leiderschap."
              : "Discover the spiritual gifts God has given you — and how they can be maximised in service and leadership."}
          </p>
          {/* "This test will help you to..." */}
          <div style={{ background: "oklch(97% 0.005 80 / 0.08)", border: "1px solid oklch(97% 0.005 80 / 0.15)", padding: "1.25rem 1.5rem" }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", color: PRIMARY, textTransform: "uppercase", margin: "0 0 0.625rem" }}>
              {lang === "id" ? "Tes ini akan membantumu untuk:" : lang === "nl" ? "Deze test helpt je om:" : "This test will help you to:"}
            </p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {(lang === "id" ? [
                "Mengidentifikasi karunia rohani yang Allah berikan secara unik kepadamu",
                "Memahami bagaimana karunia-karuniamu terhubung dengan gaya kepemimpinanmu",
                "Menemukan tempat di mana kamu bisa melayani dengan penuh sukacita dan efektivitas",
                "Memulai percakapan dengan tim atau komunitasmu tentang karunia bersama",
              ] : lang === "nl" ? [
                "De geestelijke gaven identificeren die God jou op unieke wijze heeft gegeven",
                "Begrijpen hoe jouw gaven verbonden zijn met jouw leiderschapsstijl",
                "Ontdekken waar jij kunt dienen met de meeste vreugde en effectiviteit",
                "Een gesprek starten met jouw team of gemeenschap over gedeelde gaven",
              ] : [
                "Identify the spiritual gifts God has uniquely given you",
                "Understand how your gifts connect to your leadership style",
                "Discover the places you can serve with the most joy and effectiveness",
                "Start a conversation with your team or community about shared gifts",
              ]).map((item, i) => (
                <li key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.875rem", color: "oklch(85% 0.008 80)", lineHeight: 1.55 }}>
                  <span style={{ color: PRIMARY, fontWeight: 700, flexShrink: 0 }}>→</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {!isQuizStarted && (
        <div style={{ background: "white", padding: "4rem 1.5rem" }}>
          <div style={{ maxWidth: "720px", margin: "0 auto" }}>
            {/* Biblical foundation */}
            <div style={{ marginBottom: "3.5rem" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", color: PRIMARY, textTransform: "uppercase", marginBottom: "0.75rem" }}>
                {lang === "id" ? "Dasar Alkitab" : lang === "nl" ? "Bijbelse Grondslag" : "Biblical Foundation"}
              </p>
              <h2 style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)", fontWeight: 800, color: "oklch(18% 0.05 260)", lineHeight: 1.2, marginBottom: "1.25rem" }}>
                {lang === "id"
                  ? "Setiap orang percaya memiliki karunia. Kebanyakan belum pernah menemukannya."
                  : lang === "nl" ? "Elke gelovige heeft een gave. De meesten hebben hem nooit ontdekt."
                  : "Every believer has a gift. Most have never discovered it."}
              </h2>
              <p style={{ fontSize: "0.9375rem", color: "oklch(38% 0.008 260)", lineHeight: 1.8, marginBottom: "1.25rem" }}>
                {lang === "id"
                  ? "Perjanjian Baru mengajarkan dengan jelas bahwa setiap pengikut Kristus telah diberikan setidaknya satu karunia rohani — kemampuan yang diberdayakan oleh Roh, dirancang bukan untuk keuntungan pribadi, tetapi untuk membangun Tubuh Kristus dan memajukan Kerajaan-Nya."
                  : lang === "nl" ? "Het Nieuwe Testament leert duidelijk dat elke volgeling van Christus ten minste één geestelijke gave heeft ontvangen — een door de Geest gegeven vermogen, ontworpen niet voor persoonlijk gewin, maar om het Lichaam van Christus op te bouwen en Zijn Koninkrijk vooruit te brengen."
                  : "The New Testament teaches clearly that every follower of Christ has been given at least one spiritual gift — a Spirit-empowered ability designed not for personal gain, but to build up the Body of Christ and advance His Kingdom."}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem", marginBottom: "1.25rem" }}>
                {[
                  VERSES.find(v => v.ref === "1 Corinthians 12 (key verses)")!,
                  VERSES.find(v => v.ref === "Romans 12:6–8")!,
                  VERSES.find(v => v.ref === "Ephesians 4:11–12")!,
                ].map(verse => verse && (
                  <VerseChip key={verse.ref} verse={verse} lang={lang} variant="tile" />
                ))}
              </div>
              <p style={{ fontSize: "0.9375rem", color: "oklch(38% 0.008 260)", lineHeight: 1.8, margin: 0 }}>
                {lang === "id"
                  ? "Namun kebanyakan orang percaya melayani dari kebiasaan atau kewajiban, bukan dari kesadaran mendalam tentang bagaimana Allah secara unik merancang mereka. Penilaian ini membantumu mengidentifikasi bagaimana Allah telah merancangmu untuk melayani — sehingga kamu bisa memimpin dan memberi dengan lebih jelas, sukacita, dan berbuah."
                  : lang === "nl" ? "Toch dienen de meeste gelovigen vanuit gewoonte of plicht, in plaats van vanuit een diep besef van hoe God hen uniek heeft bedraad. Deze assessment helpt je te identificeren hoe God je heeft ontworpen om te dienen — zodat je kunt leiden en geven met meer helderheid, vreugde en vrucht."
                  : "Yet most believers serve from habit or obligation rather than from a deep awareness of how God has uniquely wired them. This assessment helps you identify how God has designed you to serve — so you can lead and give with greater clarity, joy, and fruitfulness."}
              </p>
            </div>

            {/* 19 gifts overview */}
            <div>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", color: PRIMARY, textTransform: "uppercase", marginBottom: "1.5rem" }}>
                {lang === "id" ? "19 Karunia yang Diukur" : lang === "nl" ? "19 Gaven Beoordeeld" : "19 Gifts Assessed"}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                {GIFT_OVERVIEW_ORDER.map(key => {
                  const gift = GIFTS[key];
                  const icon = GIFT_ICONS[key];
                  if (!gift) return null;
                  return (
                    <div key={key} style={{ border: `1px solid ${BORDER}`, padding: "1.125rem 1.25rem", background: BG_LIGHT, display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                      <div style={{ width: "2rem", height: "2rem", color: PRIMARY, flexShrink: 0 }}>
                        {icon}
                      </div>
                      <div>
                        <p style={{ fontWeight: 800, fontSize: "0.875rem", color: "oklch(18% 0.05 260)", marginBottom: "0.25rem" }}>
                          {lang === "id" ? gift.label : lang === "nl" ? gift.nl : gift.en}
                        </p>
                        <p style={{ fontSize: "0.8125rem", color: "oklch(45% 0.008 260)", lineHeight: 1.65, margin: "0 0 0.4rem" }}>
                          {lang === "id" ? gift.desc : lang === "nl" ? gift.descNl : gift.descEn}
                        </p>
                        <p style={{ fontSize: "0.75rem", fontStyle: "italic", color: "oklch(55% 0.008 260)", margin: 0, lineHeight: 1.55 }}>
                          {lang === "id" ? gift.realLife : lang === "nl" ? gift.realLifeNl : gift.realLifeEn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── QUESTIONS ── */}
      <div style={{ background: BG_LIGHT, padding: "3rem 1.5rem" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "oklch(52% 0.008 260)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {lang === "id" ? `Pernyataan ${pageStart}–${pageEnd} dari ${TOTAL_QUESTIONS}` : lang === "nl" ? `Uitspraken ${pageStart}–${pageEnd} van ${TOTAL_QUESTIONS}` : `Statements ${pageStart}–${pageEnd} of ${TOTAL_QUESTIONS}`}
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
                    {lang === "id" ? q.id : lang === "nl" ? q.nl : q.en}
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
                            border: `1.5px solid ${PRIMARY}`,
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
                {lang === "id" ? "← Kembali" : lang === "nl" ? "← Terug" : "← Back"}
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
                ? (lang === "id" ? "Lanjut →" : lang === "nl" ? "Volgende →" : "Next →")
                : (lang === "id" ? "Lihat Hasil →" : lang === "nl" ? "Zie Resultaten →" : "See Results →")}
            </button>
          </div>

          {!allPageAnswered && (
            <p style={{ fontSize: "0.72rem", color: "oklch(62% 0.008 260)", marginTop: "0.875rem", textAlign: "right" }}>
              {lang === "id"
                ? "Jawab semua pernyataan di halaman ini untuk melanjutkan."
                : lang === "nl" ? "Beantwoord alle uitspraken op deze pagina om verder te gaan."
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
