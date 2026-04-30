"use client";

import { useState } from "react";
import Link from "next/link";
import TypeCard from "../../../app/(marketing)/resources/enneagram/TypeCard";
import { KaruniaRing, GIFT_CATEGORIES } from "@/components/charts/KaruniaRing";

// ── Brand tokens ─────────────────────────────────────────────────────────────
const navy     = "oklch(22% 0.10 260)";
const orange   = "oklch(65% 0.15 45)";
const offWhite = "oklch(97% 0.005 80)";

// ── Enneagram Types ───────────────────────────────────────────────────────────
const ENNEAGRAM_TYPES: Record<number, EnneagramTypeData> = {
  1: {
    number: 1,
    name: { en: "The Reformer", id: "Si Perfeksionis", nl: "De Hervormer" },
    tagline: { en: "The Principled Idealist", id: "Si Idealis Berprinsip", nl: "De Principiële Idealist" },
    color: "oklch(55% 0.12 260)",
    colorLight: "oklch(88% 0.02 260)",
    overview: { en: "Type 1s are driven by a strong inner sense of right and wrong. They are conscientious, focused on improvement, and hold themselves and others to high standards.", id: "Tipe 1 didorong oleh rasa kuat tentang benar dan salah. Mereka teliti, fokus pada peningkatan, dan memegang standar tinggi untuk diri sendiri dan orang lain.", nl: "Type 1 wordt gedreven door een sterk gevoel van goed en fout. Ze zijn consciëntieus, gericht op verbetering, en houden zichzelf en anderen aan hoge normen." },
    motivation: { en: "To be right, to improve themselves and the world, and to do things correctly.", id: "Menjadi benar, meningkatkan diri dan dunia, dan melakukan segala sesuatu dengan benar.", nl: "Om gelijk te hebben, zichzelf en de wereld te verbeteren, en dingen goed te doen." },
    fear: { en: "Being wrong, incompetent, or not doing enough to make things better.", id: "Menjadi salah, tidak kompeten, atau tidak melakukan cukup untuk membuat hal-hal lebih baik.", nl: "Fout zijn, incompetent zijn, of niet genoeg doen om dingen beter te maken." },
    strengths: { en: ["Principled", "Responsible", "Improvement-focused"], id: ["Berprinsip", "Bertanggung jawab", "Fokus pada peningkatan"], nl: ["Principieel", "Verantwoord", "Gericht op verbetering"] },
    blindspots: { en: ["Overly critical", "Rigid", "Perfectionist"], id: ["Terlalu kritikus", "Kaku", "Perfeksionis"], nl: ["Te kritisch", "Rigide", "Perfectionist"] },
    communication: { en: "Practice accepting imperfection in yourself and others. Learn to balance idealism with compassion and forgiveness.", id: "Praktikkan menerima ketidaksempurnaan dalam diri Anda dan orang lain. Pelajari cara menyeimbangkan idealisme dengan belas kasih dan pengampunan.", nl: "Oefen het accepteren van onvolmaaktheid in jezelf en anderen. Leer idealisme in evenwicht te brengen met medelijden en vergeving." },
    crossCultural: { en: "Your sense of justice is a strength, but be aware that different cultures have different standards. Listen to understand before correcting.", id: "Rasa keadilan Anda adalah kekuatan, tetapi sadari bahwa budaya yang berbeda memiliki standar yang berbeda. Dengarkan untuk memahami sebelum mengoreksi.", nl: "Je gevoel voor rechtvaardigheid is een sterkte, maar besef dat verschillende culturen andere normen hebben. Luister om te begrijpen voordat je corrigeert." },
  },
  2: {
    number: 2,
    name: { en: "The Helper", id: "Si Penolong", nl: "De Helper" },
    tagline: { en: "The Caring Supporter", id: "Si Pendukung Peduli", nl: "De Zorgzame Ondersteunaar" },
    color: "oklch(65% 0.20 25)",
    colorLight: "oklch(92% 0.02 25)",
    overview: { en: "Type 2s are warm, caring, and driven by a need to feel loved and appreciated. They are naturally attuned to others' emotions and are generous with their time and energy.", id: "Tipe 2 hangat, peduli, dan didorong oleh kebutuhan untuk merasa dicintai dan dihargai. Mereka secara alami menyadari emosi orang lain dan murah hati dengan waktu dan energi mereka.", nl: "Type 2 is warm, zorgzaam, en gedreven door de behoefte om zich bemind en gewaardeerd te voelen. Ze zijn van nature afgestemd op de emoties van anderen en geven vrijgevig van hun tijd en energie." },
    motivation: { en: "To be loved, appreciated, and needed; to help others and feel valued.", id: "Untuk dicintai, dihargai, dan dibutuhkan; untuk membantu orang lain dan merasa berharga.", nl: "Om bemind, gewaardeerd en nodig te zijn; anderen helpen en zich waardevol voelen." },
    fear: { en: "Being unloved, rejected, or of no value to others.", id: "Tidak dicintai, ditolak, atau tidak berharga bagi orang lain.", nl: "Niet bemind zijn, afgewezen worden, of geen waarde hebben voor anderen." },
    strengths: { en: ["Empathetic", "Generous", "Relationship-focused"], id: ["Empatik", "Murah hati", "Fokus pada hubungan"], nl: ["Empathisch", "Gul", "Gericht op relaties"] },
    blindspots: { en: ["Overly accommodating", "Codependent", "Passive-aggressive"], id: ["Terlalu mengakomodasi", "Codependent", "Pasif-agresif"], nl: ["Te meegaand", "Codependent", "Passief-agressief"] },
    communication: { en: "Learn to set healthy boundaries and prioritize your own needs. Your value isn't dependent on what you do for others.", id: "Pelajari cara menetapkan batas yang sehat dan prioritaskan kebutuhan Anda sendiri. Nilai Anda tidak bergantung pada apa yang Anda lakukan untuk orang lain.", nl: "Leer gezonde grenzen in te stellen en je eigen behoeften voorrang te geven. Je waarde hangt niet af van wat je voor anderen doet." },
    crossCultural: { en: "Your warmth translates well across cultures, but be aware that different cultures show appreciation differently. Ask directly what people need.", id: "Kehangatan Anda diterjemahkan dengan baik di berbagai budaya, tetapi sadari bahwa budaya yang berbeda menunjukkan apresiasi secara berbeda. Tanya secara langsung apa yang dibutuhkan orang.", nl: "Je warmte vertaalt goed over culturen heen, maar besef dat verschillende culturen waardering anders tonen. Vraag direct wat mensen nodig hebben." },
  },
  3: {
    number: 3,
    name: { en: "The Achiever", id: "Si Pencapai", nl: "De Bereiker" },
    tagline: { en: "The Goal-Oriented Performer", id: "Si Pemain yang Berorientasi pada Tujuan", nl: "De Doelgerichte Performer" },
    color: "oklch(65% 0.25 40)",
    colorLight: "oklch(92% 0.03 40)",
    overview: { en: "Type 3s are driven to succeed, excel, and be recognized for their accomplishments. They are energetic, efficient, and focused on results. They adapt easily to different environments.", id: "Tipe 3 didorong untuk sukses, unggul, dan diakui atas pencapaian mereka. Mereka energik, efisien, dan fokus pada hasil. Mereka mudah beradaptasi dengan lingkungan yang berbeda.", nl: "Type 3 wordt aangedreven om succesvol te zijn, uit te blinken en erkend te worden voor hun prestaties. Ze zijn energiek, efficiënt en gericht op resultaten. Ze passen zich gemakkelijk aan verschillende omgevingen aan." },
    motivation: { en: "To succeed, be recognized, and be valued for their achievements and effectiveness.", id: "Untuk sukses, diakui, dan dihargai atas prestasi dan efektivitas mereka.", nl: "Om succesvol te zijn, erkend te worden en gewaardeerd te worden voor hun prestaties en effectiviteit." },
    fear: { en: "Being worthless, ineffective, or unsuccessful; failure and being exposed as incompetent.", id: "Tidak berharga, tidak efektif, atau tidak berhasil; kegagalan dan terbukti tidak kompeten.", nl: "Waardeloos zijn, ineffectief zijn, of niet succesvol zijn; falen en als incompetent worden ontmaskerd." },
    strengths: { en: ["Ambitious", "Efficient", "Adaptable"], id: ["Ambisius", "Efisien", "Dapat beradaptasi"], nl: ["Ambitieus", "Efficiënt", "Aanpasbaar"] },
    blindspots: { en: ["Workaholic", "Image-focused", "Disconnected from emotions"], id: ["Workaholik", "Fokus pada citra", "Terputus dari emosi"], nl: ["Workaholic", "Gericht op imago", "Losgekoppeld van emoties"] },
    communication: { en: "Remember that your worth isn't tied to your accomplishments. Take time to connect with your authentic self and deeper relationships.", id: "Ingat bahwa nilai Anda tidak terikat pada pencapaian Anda. Ambil waktu untuk terhubung dengan diri autentik Anda dan hubungan yang lebih dalam.", nl: "Onthoud dat je waarde niet gekoppeld is aan je prestaties. Neem tijd om verbinding te maken met je authentieke zelf en diepere relaties." },
    crossCultural: { en: "Your drive for results is valuable, but different cultures define success differently. Build relationships before pushing for outcomes.", id: "Dorongan Anda untuk hasil berharga, tetapi budaya yang berbeda mendefinisikan kesuksesan secara berbeda. Bangun hubungan sebelum mendorong hasil.", nl: "Je drang om resultaten te behalen is waardevol, maar verschillende culturen definiëren succes anders. Bouw relaties op voordat je naar resultaten streeft." },
  },
  4: {
    number: 4,
    name: { en: "The Individualist", id: "Si Individualis", nl: "De Individualist" },
    tagline: { en: "The Authentic Expresser", id: "Si Pengekspresi Autentik", nl: "De Authentieke Expressionist" },
    color: "oklch(55% 0.20 310)",
    colorLight: "oklch(88% 0.03 310)",
    overview: { en: "Type 4s are creative, introspective, and driven by a need to understand themselves and express their unique identity. They are sensitive to emotions and often feel misunderstood.", id: "Tipe 4 kreatif, introspektif, dan didorong oleh kebutuhan untuk memahami diri mereka sendiri dan mengekspresikan identitas unik mereka. Mereka sensitif terhadap emosi dan sering merasa disalahpahami.", nl: "Type 4 is creatief, introspectief, en gedreven door de behoefte om zichzelf te begrijpen en hun unieke identiteit uit te drukken. Ze zijn gevoelig voor emoties en voelen zich vaak misbegrepenl." },
    motivation: { en: "To discover their true identity, express their uniqueness, and be understood in their depth and complexity.", id: "Untuk menemukan identitas sejati mereka, mengekspresikan keunikan mereka, dan dipahami dalam kedalaman dan kompleksitas mereka.", nl: "Om hun ware identiteit te ontdekken, hun uniekheid uit te drukken en begrepen te worden in hun diepte en complexiteit." },
    fear: { en: "Being ordinary, not having a unique identity, or being fundamentally flawed or defective.", id: "Menjadi biasa, tidak memiliki identitas unik, atau cacat atau rusak secara fundamental.", nl: "Gewoon zijn, geen unieke identiteit hebben, of fundamenteel gebrekkig of defect zijn." },
    strengths: { en: ["Creative", "Self-aware", "Emotionally expressive"], id: ["Kreatif", "Sadar diri", "Pengekspresi emosi"], nl: ["Creatief", "Zelfbewust", "Emotioneel expressief"] },
    blindspots: { en: ["Overly moody", "Self-absorbed", "Emotionally volatile"], id: ["Terlalu murung", "Berpusat pada diri", "Emosional bergejolak"], nl: ["Te humeurig", "Zelfzuchtig", "Emotioneel volatiel"] },
    communication: { en: "Your emotional depth is a gift, but try to move beyond self-focus to understand others. Find healthy outlets for your intensity.", id: "Kedalaman emosional Anda adalah hadiah, tetapi cobalah bergerak melampaui fokus diri untuk memahami orang lain. Temukan saluran sehat untuk intensitas Anda.", nl: "Je emotionele diepte is een gift, maar probeer voorbij zelfgerichtheid te gaan om anderen te begrijpen. Vind gezonde uitwegen voor je intensiteit." },
    crossCultural: { en: "Your authenticity is respected, but cultural norms around emotional expression vary. Honor both your needs and cultural context.", id: "Autentisitas Anda dihormati, tetapi norma budaya seputar ekspresi emosional bervariasi. Hormati kebutuhan Anda dan konteks budaya.", nl: "Je authenticiteit wordt gerespecteerd, maar culturele normen rond emotionele expressie variëren. Respect je behoeften en culturele context." },
  },
  5: {
    number: 5,
    name: { en: "The Investigator", id: "Si Peneliti", nl: "De Onderzoeker" },
    tagline: { en: "The Knowledge Seeker", id: "Si Pencari Pengetahuan", nl: "De Kenniszoeker" },
    color: "oklch(50% 0.15 260)",
    colorLight: "oklch(88% 0.03 260)",
    overview: { en: "Type 5s are curious, analytical, and driven by a need to understand how things work. They are independent thinkers who value knowledge and expertise.", id: "Tipe 5 penasaran, analitis, dan didorong oleh kebutuhan untuk memahami cara kerja hal-hal. Mereka adalah pemikir independen yang menghargai pengetahuan dan keahlian.", nl: "Type 5 is nieuwsgierig, analytisch, en gedreven door de behoefte om te begrijpen hoe dingen werken. Ze zijn onafhankelijke denkers die kennis en expertise waarderen." },
    motivation: { en: "To gain knowledge and understanding, to be competent and independent, and to explore ideas deeply.", id: "Untuk mendapatkan pengetahuan dan pemahaman, menjadi kompeten dan mandiri, dan mengeksplorasi ide secara mendalam.", nl: "Om kennis en begrip te verwerven, competent en onafhankelijk te zijn, en ideeën diep te verkennen." },
    fear: { en: "Being incompetent or useless; lacking knowledge or understanding; being perceived as ignorant.", id: "Menjadi tidak kompeten atau tidak berguna; kekurangan pengetahuan atau pemahaman; dianggap bodoh.", nl: "Incompetent of nutteloos zijn; gebrek aan kennis of begrip; als ignorant worden beschouwd." },
    strengths: { en: ["Analytical", "Independent", "Knowledge-focused"], id: ["Analitis", "Independen", "Fokus pengetahuan"], nl: ["Analytisch", "Onafhankelijk", "Kennisgeoriënteerd"] },
    blindspots: { en: ["Detached", "Isolated", "Overcomplicated thinking"], id: ["Terlepas", "Terisolasi", "Pemikiran rumit"], nl: ["Losgelaten", "Geïsoleerd", "Overcomplicated denken"] },
    communication: { en: "Balance your need for knowledge with connection. Share what you know in accessible ways. Engage emotionally even when uncomfortable.", id: "Seimbangkan kebutuhan Anda akan pengetahuan dengan koneksi. Bagikan apa yang Anda tahu dengan cara yang dapat diakses. Terlibat secara emosional bahkan saat tidak nyaman.", nl: "Balanceer je behoefte aan kennis met verbinding. Deel wat je weet op begrijpelijke manieren. Betrek je emotioneel, zelfs als het ongemakkelijk is." },
    crossCultural: { en: "Your analytical skills are valuable across cultures. However, remember that knowledge is interpreted differently in different contexts. Be humble.", id: "Keterampilan analitis Anda berharga di berbagai budaya. Namun, ingat bahwa pengetahuan ditafsirkan secara berbeda dalam konteks yang berbeda. Jadilah rendah hati.", nl: "Je analytische vaardigheden zijn waardevol in verschillende culturen. Onthoud echter dat kennis in verschillende contexten anders wordt geïnterpreteerd. Wees bescheiden." },
  },
  6: {
    number: 6,
    name: { en: "The Loyalist", id: "Si Setia", nl: "De Loyalist" },
    tagline: { en: "The Committed Team Member", id: "Si Anggota Tim yang Berkomitmen", nl: "De Toegewijd Teamlid" },
    color: "oklch(55% 0.18 45)",
    colorLight: "oklch(90% 0.02 45)",
    overview: { en: "Type 6s are loyal, responsible, and driven by a need for security and trust. They are team players who value belonging and are naturally cautious.", id: "Tipe 6 setia, bertanggung jawab, dan didorong oleh kebutuhan akan keamanan dan kepercayaan. Mereka adalah pemain tim yang menghargai rasa memiliki dan secara alami berhati-hati.", nl: "Type 6 is loyal, verantwoord, en gedreven door de behoefte naar veiligheid en vertrouwen. Ze zijn teamspelers die samenhorig waarderen en van nature voorzichtig zijn." },
    motivation: { en: "To be secure, to belong to a trusted group, to be dependable, and to prepare for potential risks.", id: "Untuk aman, menjadi bagian dari kelompok terpercaya, dapat diandalkan, dan mempersiapkan risiko potensial.", nl: "Om veilig te zijn, tot een vertrouwde groep te behoren, betrouwbaar te zijn en op potentiële risico's voor te bereiden." },
    fear: { en: "Being without support, betrayed, or facing danger without adequate protection or guidance.", id: "Tanpa dukungan, dikhianati, atau menghadapi bahaya tanpa perlindungan atau panduan yang memadai.", nl: "Zonder ondersteuning zijn, verraden worden, of gevaar onder ogen zien zonder adequate bescherming of begeleiding." },
    strengths: { en: ["Loyal", "Responsible", "Team-oriented"], id: ["Setia", "Bertanggung jawab", "Berorientasi tim"], nl: ["Loyal", "Verantwoord", "Teamgericht"] },
    blindspots: { en: ["Anxious", "Suspicious", "Overly cautious"], id: ["Cemas", "Curiga", "Terlalu berhati-hati"], nl: ["Bezorgd", "Achterdochtig", "Te voorzichtig"] },
    communication: { en: "Work on building trust in yourself and others. Not every scenario is a worst-case scenario. Practice risk-taking in safe environments.", id: "Kerjakan membangun kepercayaan pada diri sendiri dan orang lain. Tidak setiap skenario adalah skenario terburuk. Praktikkan pengambilan risiko di lingkungan yang aman.", nl: "Werken aan het opbouwen van vertrouwen in jezelf en anderen. Niet elk scenario is een worst-case scenario. Oefen risicopoging in veilige omgevingen." },
    crossCultural: { en: "Your reliability is valued everywhere. However, be aware that different cultures show trust differently. Give people time to earn trust.", id: "Keandalan Anda dihargai di mana saja. Namun, sadari bahwa budaya yang berbeda menunjukkan kepercayaan secara berbeda. Beri orang waktu untuk mendapatkan kepercayaan.", nl: "Je betrouwbaarheid wordt overal gewaardeerd. Wees echter bewust dat verschillende culturen vertrouwen anders tonen. Geef mensen tijd om vertrouwen te verdienen." },
  },
  7: {
    number: 7,
    name: { en: "The Enthusiast", id: "Si Antusias", nl: "De Enthousiasteling" },
    tagline: { en: "The Optimistic Adventurer", id: "Si Petualang Optimis", nl: "De Optimistische Avonturier" },
    color: "oklch(70% 0.20 80)",
    colorLight: "oklch(92% 0.03 80)",
    overview: { en: "Type 7s are upbeat, spontaneous, and driven by a need for excitement and new experiences. They are optimistic, creative, and hate feeling trapped or bored.", id: "Tipe 7 ceria, spontan, dan didorong oleh kebutuhan akan kegembiraan dan pengalaman baru. Mereka optimis, kreatif, dan benci merasa terjebak atau bosan.", nl: "Type 7 is opgewekt, spontaan, en gedreven door de behoefte naar opwinding en nieuwe ervaringen. Ze zijn optimistisch, creatief en haten het gevoel om vast te zitten of zich te vervelen." },
    motivation: { en: "To have fun, experience joy and stimulation, avoid pain and boredom, and keep options open.", id: "Untuk bersenang-senang, mengalami kegembiraan dan stimulasi, menghindari rasa sakit dan kebosanan, dan membuat pilihan tetap terbuka.", nl: "Om plezier te hebben, vreugde en stimulatie te beleven, pijn en verveling te vermijden, en opties open te houden." },
    fear: { en: "Missing out, being trapped, experiencing pain or suffering, or being bored and unfulfilled.", id: "Ketinggalan, merasa terjebak, mengalami rasa sakit atau penderitaan, atau bosan dan tidak puas.", nl: "Iets missen, vast zitten voelen, pijn of lijden ervaren, of zich vervelen en niet vervuld voelen." },
    strengths: { en: ["Enthusiastic", "Creative", "Optimistic"], id: ["Antusias", "Kreatif", "Optimis"], nl: ["Enthousiast", "Creatief", "Optimistisch"] },
    blindspots: { en: ["Scattered", "Superficial", "Avoidant of pain"], id: ["Tersebar", "Permukaan", "Menghindari rasa sakit"], nl: ["Verspreid", "Oppervlakkig", "Vermijdend van pijn"] },
    communication: { en: "Develop depth in your relationships and work. Facing discomfort leads to growth. Practice staying present with difficult emotions.", id: "Kembangkan kedalaman dalam hubungan dan pekerjaan Anda. Menghadapi ketidaknyamanan menghasilkan pertumbuhan. Praktikkan tetap hadir dengan emosi yang sulit.", nl: "Ontwikkel diepte in je relaties en werk. Ongemak onder ogen zien leidt tot groei. Oefen om aanwezig te blijven met moeilijke emoties." },
    crossCultural: { en: "Your enthusiasm for new experiences is infectious, but respect that some cultures value stability over novelty. Find balance.", id: "Antusiasme Anda untuk pengalaman baru menular, tetapi hormati bahwa beberapa budaya menghargai stabilitas daripada kebaruan. Temukan keseimbangan.", nl: "Je enthousiasme voor nieuwe ervaringen is aanstekelijk, maar respect dat sommige culturen stabiliteit boven nieuwheid waarderen. Vind balans." },
  },
  8: {
    number: 8,
    name: { en: "The Challenger", id: "Si Penegak", nl: "De Uitdager" },
    tagline: { en: "The Bold Protector", id: "Si Pelindung Berani", nl: "De Mutige Beschermer" },
    color: "oklch(50% 0.25 10)",
    colorLight: "oklch(88% 0.04 10)",
    overview: { en: "Type 8s are strong-willed, direct, and driven by a need to be powerful and independent. They are natural leaders who are protective of those they care about.", id: "Tipe 8 berkemauan kuat, langsung, dan didorong oleh kebutuhan untuk kuat dan mandiri. Mereka adalah pemimpin alami yang melindungi mereka yang mereka sayangi.", nl: "Type 8 is sterke-wilvast, direct, en gedreven door de behoefte om krachtig en onafhankelijk te zijn. Ze zijn natuurlijke leiders die degenen beschermen van wie ze houden." },
    motivation: { en: "To be strong and in control, to protect themselves and others, and to avoid being vulnerable or dependent.", id: "Untuk menjadi kuat dan mengendalikan, melindungi diri sendiri dan orang lain, dan menghindari kerentanan atau ketergantungan.", nl: "Om sterk en in controle te zijn, zichzelf en anderen te beschermen, en kwetsbaarheid of afhankelijkheid te vermijden." },
    fear: { en: "Being controlled, weak, or betrayed; being vulnerable or taken advantage of.", id: "Dikendalai, lemah, atau dikhianati; menjadi rentan atau dimanfaatkan.", nl: "Gecontroleerd, zwak of verraden worden; kwetsbaar zijn of misbruikt worden." },
    strengths: { en: ["Strong", "Direct", "Protective"], id: ["Kuat", "Langsung", "Melindungi"], nl: ["Sterk", "Direct", "Beschermend"] },
    blindspots: { en: ["Domineering", "Aggressive", "Insensitive"], id: ["Dominan", "Agresif", "Tidak sensitif"], nl: ["Overheersend", "Agressief", "Ongevoelig"] },
    communication: { en: "Soften your approach with those you care about. Vulnerability is strength, not weakness. Let people help you sometimes.", id: "Lunak pendekatan Anda dengan mereka yang Anda sayangi. Kerentanan adalah kekuatan, bukan kelemahan. Biarkan orang membantu Anda kadang-kadang.", nl: "Verzacht je benadering met degenen van wie je houdt. Kwetsbaarheid is kracht, niet zwakte. Laat mensen je soms helpen." },
    crossCultural: { en: "Your directness can be misinterpreted as rudeness in some cultures. Adapt your communication while maintaining your authenticity.", id: "Ketegasan Anda dapat disalahartikan sebagai kasar dalam beberapa budaya. Sesuaikan komunikasi Anda sambil mempertahankan autentisitas Anda.", nl: "Je directheid kan in sommige culturen als onbeschoftheid worden geïnterpreteerd. Pas je communicatie aan terwijl je je authenticiteit bewaart." },
  },
  9: {
    number: 9,
    name: { en: "The Peacemaker", id: "Si Pembuat Perdamaian", nl: "De Vredestichter" },
    tagline: { en: "The Harmonious Mediator", id: "Si Mediator Harmonis", nl: "De Harmonieuze Bemiddelaar" },
    color: "oklch(55% 0.12 140)",
    colorLight: "oklch(88% 0.02 140)",
    overview: { en: "Type 9s are easygoing, accommodating, and driven by a need for peace and harmony. They are natural mediators who seek to avoid conflict and create unity.", id: "Tipe 9 santai, akomodasi, dan didorong oleh kebutuhan untuk perdamaian dan harmoni. Mereka adalah mediator alami yang berusaha menghindari konflik dan menciptakan kesatuan.", nl: "Type 9 is relaxed, invoerend, en gedreven door de behoefte naar vrede en harmonie. Ze zijn natuurlijke bemiddelaars die conflict vermijden en eenheid creëren." },
    motivation: { en: "To maintain peace, avoid conflict, and ensure everyone feels heard and included.", id: "Untuk mempertahankan perdamaian, menghindari konflik, dan memastikan semua orang merasa didengar dan disertakan.", nl: "Om vrede te handhaven, conflict te vermijden, en iedereen gehoord en inbegrepen te voelen." },
    fear: { en: "Conflict, disruption, disconnection, or being forced to take sides.", id: "Konflik, gangguan, putus hubungan, atau dipaksa memilih pihak.", nl: "Conflict, verstoring, verbreking, of gedwongen worden om partij te kiezen." },
    strengths: { en: ["Peaceful", "Empathetic", "Inclusive"], id: ["Damai", "Empatik", "Inklusif"], nl: ["Vreedzaam", "Empathisch", "Inclusief"] },
    blindspots: { en: ["Passive", "Indecisive", "Self-neglecting"], id: ["Pasif", "Tidak tegas", "Mengabaikan diri"], nl: ["Passief", "Besluiteloos", "Zelfverzorgend"] },
    communication: { en: "Your voice matters. Express your own needs and preferences, not just go along with others. Take a stand when needed for important matters.", id: "Suara Anda penting. Ekspresikan kebutuhan dan preferensi Anda sendiri, jangan hanya ikut saja dengan orang lain. Ambil posisi tegas ketika diperlukan untuk hal-hal penting.", nl: "Je stem is belangrijk. Druk je eigen behoeften en voorkeuren uit, niet zomaar met anderen mee. Neem stelling wanneer dit nodig is voor belangrijke kwesties." },
    crossCultural: { en: "Your ability to bring people together is valuable across cultures. However, ensure you don't sacrifice your own needs for false peace.", id: "Kemampuan Anda untuk menyatukan orang adalah berharga di berbagai budaya. Namun, pastikan Anda tidak mengorbankan kebutuhan Anda sendiri untuk perdamaian palsu.", nl: "Je vermogen om mensen samen te brengen is waardevol in verschillende culturen. Zorg er echter voor dat je je eigen behoeften niet opgeeft voor valse vrede." },
  },
};


// ── DISC ─────────────────────────────────────────────────────────────────────
const DISC_SLICES = [
  { key: "D", label: "Dominance",        fill: "#C44A2A" },
  { key: "I", label: "Influence",         fill: "#C48A1A" },
  { key: "S", label: "Steadiness",        fill: "#2E7A40" },
  { key: "C", label: "Conscientiousness", fill: "#2B5FAC" },
] as const;

const DISC_RESULT_TEXT: Record<string, string> = {
  D:  "You lead with boldness and results. Your greatest strength is driving action and cutting through indecision. Growth edge: slow down enough to bring people with you — not just past them.",
  I:  "You lead with energy and relationships. Your greatest strength is inspiring others and creating momentum. Growth edge: follow through on commitments and develop your eye for detail.",
  S:  "You lead with patience and loyalty. Your greatest strength is creating environments where people feel safe and valued. Growth edge: practise taking initiative and speaking your concerns earlier.",
  C:  "You lead with precision and expertise. Your greatest strength is bringing rigour and quality to everything. Growth edge: learn to act with less-than-perfect information and share your insights more openly.",
  DI: "You combine boldness with people-energy — driving results while keeping others inspired. A powerful combination in leading diverse teams.",
  DS: "You balance directness with steadiness — goal-focused yet able to create stable, loyal teams. You lead with both force and consistency.",
  DC: "You combine drive with precision — results-oriented and quality-obsessed. Your challenge: don't let perfectionism slow momentum.",
  IS: "You blend enthusiasm with warmth — inspiring people while genuinely caring for them. A gift in relational and cross-cultural contexts.",
  IC: "You combine persuasion with precision — engaging communicator and careful thinker. Balance spontaneity with follow-through.",
  SC: "You bring steadiness and rigour together — reliable, patient, and quality-driven. A trusted anchor for any team.",
};

const DISC_NAMES: Record<string, string> = {
  D: "Dominant", I: "Influential", S: "Steady", C: "Conscientious",
};

function OceanRadarSVG({ scores, size = 160 }: { scores: Record<string, number>; size?: number }) {
  // scores are raw accumulated values (10-50 per trait), keys: O, C, E, A, N
  function calcPct(raw: number) { return Math.round(((raw - 10) / 40) * 100); }
  const pcts = {
    O: calcPct(scores.O ?? 30),
    C: calcPct(scores.C ?? 30),
    E: calcPct(scores.E ?? 30),
    A: calcPct(scores.A ?? 30),
    ES: 100 - calcPct(scores.N ?? 30), // inverted
  };
  const TRAIT_ORDER = ["O", "C", "E", "A", "ES"] as const;
  const COLORS: Record<string, string> = {
    O: "oklch(52% 0.22 280)",
    C: "oklch(50% 0.18 215)",
    E: "oklch(60% 0.20 52)",
    A: "oklch(52% 0.18 155)",
    ES: "oklch(50% 0.20 310)",
  };
  const cx = size / 2, cy = size / 2;
  const r = (size / 2) * 0.70;
  function ang(i: number) { return -Math.PI / 2 + (i * 2 * Math.PI) / 5; }
  function pt(i: number, pct: number): [number, number] {
    const d = (pct / 100) * r;
    return [cx + d * Math.cos(ang(i)), cy + d * Math.sin(ang(i))];
  }
  const userPts = TRAIT_ORDER.map((t, i) => pt(i, pcts[t]));
  const userPoly = userPts.map(p => p.join(",")).join(" ");
  function gridPoly(pct: number) { return TRAIT_ORDER.map((_, i) => pt(i, pct).join(",")).join(" "); }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[25, 50, 75, 100].map(p => (
        <polygon key={p} points={gridPoly(p)} fill="none" stroke="oklch(88% 0.006 260)" strokeWidth={0.75} />
      ))}
      {TRAIT_ORDER.map((_, i) => {
        const [x2, y2] = pt(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={x2} y2={y2} stroke="oklch(88% 0.006 260)" strokeWidth={0.75} />;
      })}
      <polygon points={userPoly} fill="oklch(52% 0.22 280 / 0.14)" stroke="oklch(52% 0.22 280)" strokeWidth={1.5} />
      {userPts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3} fill={COLORS[TRAIT_ORDER[i]]} />
      ))}
    </svg>
  );
}

function discPolarXY(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function discSlicePath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const span = endDeg - startDeg;
  if (span >= 359.9) return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.001} ${cy - r} Z`;
  const s = discPolarXY(cx, cy, r, startDeg);
  const e = discPolarXY(cx, cy, r, endDeg);
  const large = span > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)} Z`;
}

function DiscPieSVG({ scores, size, showCenter = true }: {
  scores: { D: number; I: number; S: number; C: number };
  size: number;
  result: string;
  showCenter?: boolean;
}) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 2, gap = 1.2;
  let angle = 0;
  const slices = DISC_SLICES.map(s => {
    const pct = scores[s.key as keyof typeof scores];
    const span = (pct / 100) * 360;
    const start = angle + gap / 2;
    const end = angle + span - gap / 2;
    angle += span;
    return { ...s, pct, start, end };
  });
  const innerR = size * 0.22;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices.map(s => (
        <path key={s.key} d={discSlicePath(cx, cy, r, s.start, s.end)} fill={s.fill} />
      ))}
      {showCenter && <circle cx={cx} cy={cy} r={innerR} fill="white" />}
    </svg>
  );
}

// ── Wheel of Life ─────────────────────────────────────────────────────────────
const WHEEL_SEGMENTS = [
  { key: "family",     label: "Family",      color: "#3b5fa0" },
  { key: "finance",    label: "Finance",     color: "#c4762a" },
  { key: "relaxation", label: "Relaxation",  color: "#2a8f8f" },
  { key: "ministry",   label: "Ministry",    color: "#b83820" },
  { key: "spiritual",  label: "Spiritual",   color: "#8a6415" },
  { key: "community",  label: "Community",   color: "#2a8a64" },
  { key: "learning",   label: "Learning",    color: "#6a3a9e" },
  { key: "health",     label: "Health",      color: "#2e8a40" },
];

function WheelSpiderSVG({ scores, size, showLabels = false }: {
  scores: Record<string, number>;
  size: number;
  showLabels?: boolean;
}) {
  const cx = size / 2, cy = size / 2;
  const maxR = size / 2 - (showLabels ? 26 : 5);
  const N = WHEEL_SEGMENTS.length;

  const getPoint = (i: number, score: number): [number, number] => {
    const angle = (i / N) * 2 * Math.PI - Math.PI / 2;
    const dist = (score / 10) * maxR;
    return [cx + dist * Math.cos(angle), cy + dist * Math.sin(angle)];
  };

  const axisEndPoints = WHEEL_SEGMENTS.map((_, i): [number, number] => {
    const angle = (i / N) * 2 * Math.PI - Math.PI / 2;
    return [cx + maxR * Math.cos(angle), cy + maxR * Math.sin(angle)];
  });

  const scorePoints = WHEEL_SEGMENTS.map((seg, i) => getPoint(i, scores[seg.key] ?? 0));
  const scorePolygon = scorePoints.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");

  const rings = [0.25, 0.5, 0.75, 1.0];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
      {/* Grid rings */}
      {rings.map((fraction, ri) => {
        const pts = WHEEL_SEGMENTS.map((_, i): [number, number] => {
          const angle = (i / N) * 2 * Math.PI - Math.PI / 2;
          return [cx + maxR * fraction * Math.cos(angle), cy + maxR * fraction * Math.sin(angle)];
        });
        return (
          <polygon
            key={ri}
            points={pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ")}
            fill="none"
            stroke="oklch(85% 0.006 260)"
            strokeWidth="0.75"
          />
        );
      })}

      {/* Axis lines */}
      {axisEndPoints.map(([ax, ay], i) => (
        <line key={i} x1={cx.toFixed(2)} y1={cy.toFixed(2)} x2={ax.toFixed(2)} y2={ay.toFixed(2)}
          stroke="oklch(85% 0.006 260)" strokeWidth="0.75" />
      ))}

      {/* Score polygon */}
      <polygon
        points={scorePolygon}
        fill={`${orange}2e`}
        stroke={orange}
        strokeWidth={showLabels ? 1.5 : 1}
      />

      {/* Score dots */}
      {scorePoints.map(([x, y], i) => (
        <circle key={i} cx={x.toFixed(2)} cy={y.toFixed(2)} r={showLabels ? 3 : 2}
          fill={WHEEL_SEGMENTS[i].color} />
      ))}

      {/* Labels (expanded only) */}
      {showLabels && axisEndPoints.map(([ax, ay], i) => {
        const angle = (i / N) * 2 * Math.PI - Math.PI / 2;
        const lx = cx + (maxR + 16) * Math.cos(angle);
        const ly = cy + (maxR + 16) * Math.sin(angle);
        return (
          <text key={i} x={lx.toFixed(2)} y={(ly + 4).toFixed(2)} textAnchor="middle"
            style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fill: WHEEL_SEGMENTS[i].color, fontWeight: 600 }}>
            {WHEEL_SEGMENTS[i].label}
          </text>
        );
      })}
    </svg>
  );
}

// ── Thinking Styles bar SVG ───────────────────────────────────────────────────
function ThinkingBarsSVG({ scores, size }: { scores: { C: number; H: number; I: number }; size: number }) {
  const bars = [
    { key: "C" as const, label: "C", color: "oklch(48% 0.18 250)" },
    { key: "H" as const, label: "H", color: "oklch(48% 0.18 145)" },
    { key: "I" as const, label: "I", color: "oklch(48% 0.18 300)" },
  ];
  const barH = (size - 16) / 3 - 4;
  return (
    <svg width={size} height={size * 0.55} viewBox={`0 0 ${size} ${size * 0.55}`}>
      {bars.map((b, i) => {
        const y = i * (barH + 6);
        const w = (scores[b.key] / 100) * (size - 4);
        return (
          <g key={b.key}>
            <rect x={0} y={y} width={size - 4} height={barH} rx={2} fill="oklch(92% 0.004 260)" />
            <rect x={0} y={y} width={w} height={barH} rx={2} fill={b.color} />
          </g>
        );
      })}
    </svg>
  );
}

// ── Spiritual Gifts mini visual ───────────────────────────────────────────────
const KARUNIA_LABELS_ID: Record<string, string> = {
  melayani: "Melayani", murah_hati: "Murah Hati", keramahan: "Keramahan",
  bahasa_roh: "Bahasa Roh", menyembuhkan: "Menyembuhkan", menguatkan: "Menguatkan",
  memberi: "Memberi", hikmat: "Hikmat", pengetahuan: "Pengetahuan",
  iman: "Iman", kerasulan: "Kerasulan", penginjilan: "Penginjilan",
  bernubuat: "Bernubuat", mengajar: "Mengajar", gembala: "Gembala",
  memimpin: "Memimpin", administrasi: "Administrasi", mukjizat: "Mukjizat",
  tafsir_bahasa_roh: "Tafsir",
};
const KARUNIA_LABELS_EN: Record<string, string> = {
  melayani: "Serving", murah_hati: "Mercy", keramahan: "Hospitality",
  bahasa_roh: "Tongues", menyembuhkan: "Healing", menguatkan: "Exhortation",
  memberi: "Giving", hikmat: "Wisdom", pengetahuan: "Knowledge",
  iman: "Faith", kerasulan: "Apostleship", penginjilan: "Evangelism",
  bernubuat: "Prophecy", mengajar: "Teaching", gembala: "Shepherding",
  memimpin: "Leadership", administrasi: "Administration", mukjizat: "Miracles",
  tafsir_bahasa_roh: "Interpretation",
};
const KARUNIA_LABELS_NL: Record<string, string> = {
  melayani: "Dienstbetoon", murah_hati: "Barmhartigheid", keramahan: "Gastvrijheid",
  bahasa_roh: "Tongen", menyembuhkan: "Genezing", menguatkan: "Bemoediging",
  memberi: "Vrijgevigheid", hikmat: "Wijsheid", pengetahuan: "Kennis",
  iman: "Geloof", kerasulan: "Apostelschap", penginjilan: "Evangelisatie",
  bernubuat: "Profetie", mengajar: "Onderwijs", gembala: "Herderschap",
  memimpin: "Leiderschap", administrasi: "Bestuur", mukjizat: "Wonderen",
  tafsir_bahasa_roh: "Uitleg",
};
function karuniaLabel(key: string, lang: string): string {
  if (lang === "id") return KARUNIA_LABELS_ID[key] ?? key;
  if (lang === "nl") return KARUNIA_LABELS_NL[key] ?? key;
  return KARUNIA_LABELS_EN[key] ?? key;
}

// ── Modal overlay ─────────────────────────────────────────────────────────────
type T3 = { en: string; id: string; nl: string };
type EnneagramTypeData = {
  number: number;
  name: T3;
  tagline: T3;
  color: string;
  colorLight: string;
  overview: T3;
  motivation: T3;
  fear: T3;
  strengths: { en: string[]; id: string[]; nl: string[] };
  blindspots: { en: string[]; id: string[]; nl: string[] };
  communication: T3;
  crossCultural: T3;
};

type ModalData =
  | { type: "disc"; result: string; scores: { D: number; I: number; S: number; C: number }; lang: "en" | "id" | "nl" }
  | { type: "wheel"; scores: Record<string, number>; reflections: Record<string, { gratitude: string; action: string }> | null; lang: "en" | "id" | "nl" }
  | { type: "wheelActionSteps"; reflections: Record<string, { gratitude: string; action: string }>; lang: "en" | "id" | "nl" }
  | { type: "thinking"; result: string; scores: { C: number; H: number; I: number }; lang: "en" | "id" | "nl" }
  | { type: "karunia"; topGifts: string[]; scores: Record<string, number>; lang: "en" | "id" | "nl" }
  | { type: "enneagram"; typeData: EnneagramTypeData; scores: Record<string, number>; lang: "en" | "id" | "nl" }

  | { type: "bigfive"; scores: Record<string, number>; lang: "en" | "id" | "nl" }
  | { type: "16personalities"; personalityType: string; scores: Record<string, number>; lang: "en" | "id" | "nl" };

function AssessmentModal({ data, onClose }: { data: ModalData; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "oklch(10% 0.05 260 / 0.65)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: "1.5rem",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: offWhite, borderRadius: 16,
          padding: "2rem 2rem 1.75rem",
          maxWidth: 480, width: "100%",
          maxHeight: "85vh", overflowY: "auto",
          boxShadow: "0 24px 64px oklch(10% 0.1 260 / 0.35)",
        }}
      >
        {data.type === "disc" && <DiscModal data={data} onClose={onClose} />}
        {data.type === "wheel" && <WheelModal data={data} onClose={onClose} />}
        {data.type === "wheelActionSteps" && <WheelActionStepsModal data={data} onClose={onClose} />}
        {data.type === "thinking" && <ThinkingModal data={data} onClose={onClose} />}
        {data.type === "karunia" && <KaruniaModal data={data} onClose={onClose} />}
        {data.type === "enneagram" && <EnneagramModal data={data} onClose={onClose} />}

        {data.type === "bigfive" && <BigFiveModal data={data} onClose={onClose} />}
        {data.type === "16personalities" && <PersonalitiesModal data={data} onClose={onClose} />}
      </div>
    </div>
  );
}

function DiscModal({ data, onClose }: { data: Extract<ModalData, { type: "disc" }>; onClose: () => void }) {
  const { result, scores, lang } = data;
  const resultLabel = result.split("").map(k => DISC_NAMES[k] ?? k).join(" · ");
  const description = DISC_RESULT_TEXT[result] ?? null;

  let angle = 0;
  const slicesWithPct = DISC_SLICES.map(s => {
    const pct = scores[s.key as keyof typeof scores];
    const span = (pct / 100) * 360;
    const start = angle + 1;
    const end = angle + span - 1;
    angle += span;
    return { ...s, pct, start, end };
  });

  const cx = 80, cy = 80, r = 72;

  return (
    <>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", marginBottom: "0.5rem" }}>
        DISC Personality Profile
      </p>
      <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.25rem", color: navy, marginBottom: "1.5rem" }}>
        {resultLabel}
      </h3>

      {/* Large pie + legend */}
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", marginBottom: "1.5rem" }}>
        <svg width="160" height="160" viewBox="0 0 160 160" style={{ flexShrink: 0 }}>
          {slicesWithPct.map(s => (
            <path key={s.key} d={discSlicePath(cx, cy, r, s.start, s.end)} fill={s.fill} />
          ))}
          <circle cx={cx} cy={cy} r={30} fill={offWhite} />
          <text x={cx} y={cy - 5} textAnchor="middle"
            style={{ fontFamily: "var(--font-montserrat)", fontWeight: 900, fontSize: "18px", fill: navy }}>
            {result}
          </text>
          <text x={cx} y={cy + 11} textAnchor="middle"
            style={{ fontFamily: "var(--font-montserrat)", fontSize: "8px", fill: "oklch(55% 0.008 260)", letterSpacing: "0.06em" }}>
            DISC
          </text>
        </svg>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", flex: 1 }}>
          {slicesWithPct.map(s => (
            <div key={s.key}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <div style={{ width: 9, height: 9, background: s.fill, flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(42% 0.008 260)" }}>{s.label}</span>
                </div>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, color: navy }}>{s.pct}%</span>
              </div>
              <div style={{ height: 4, background: "oklch(90% 0.004 260)", borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${s.pct}%`, background: s.fill, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {description && (
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", lineHeight: 1.7, color: "oklch(38% 0.05 260)", marginBottom: "1.5rem", padding: "1rem", background: "oklch(94% 0.006 260)", borderRadius: 8 }}>
          {description}
        </p>
      )}

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
        <Link href="/resources/disc#quiz-section" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, color: offWhite, background: navy, padding: "0.6rem 1.25rem", borderRadius: 6, textDecoration: "none" }}>
          {lang === "id" ? "Ulangi tes →" : lang === "nl" ? "Opnieuw doen →" : "Retake assessment →"}
        </Link>
        <Link href="/resources/disc" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 600, color: "oklch(38% 0.008 260)", border: "1px solid oklch(82% 0.006 260)", padding: "0.6rem 1.25rem", borderRadius: 6, textDecoration: "none", display: "inline-block" }}>
          {lang === "id" ? "Pelajari lebih" : lang === "nl" ? "Meer info" : "Learn more"}
        </Link>
        <button onClick={onClose} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 600, color: "oklch(52% 0.008 260)", background: "none", border: "none", padding: "0.6rem 0.75rem", cursor: "pointer" }}>
          {lang === "id" ? "Tutup" : lang === "nl" ? "Sluiten" : "Close"}
        </button>
      </div>
    </>
  );
}

function WheelModal({ data, onClose }: { data: Extract<ModalData, { type: "wheel" }>; onClose: () => void }) {
  const { scores, reflections, lang } = data;
  const [flipped, setFlipped] = useState(false);

  const values = Object.values(scores);
  const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  const sorted = WHEEL_SEGMENTS.slice().sort((a, b) => (scores[a.key] ?? 0) - (scores[b.key] ?? 0));
  const lowest = sorted[0];
  const highest = sorted[sorted.length - 1];

  const hasReflections = reflections && WHEEL_SEGMENTS.some(seg => reflections[seg.key]?.gratitude || reflections[seg.key]?.action);
  const actionLabel = lang === "id" ? "Langkah Aksi" : lang === "nl" ? "Actiestappen" : "Action Steps";

  return (
    <div style={{ perspective: "1000px", minHeight: 0 }}>
      <div style={{
        transformStyle: "preserve-3d",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        transition: "transform 0.4s ease",
        position: "relative",
      }}>

        {/* ── FRONT: scores ── */}
        <div style={{ WebkitBackfaceVisibility: "hidden", backfaceVisibility: "hidden" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", marginBottom: "0.5rem" }}>
            Life Balance Assessment
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.375rem" }}>
            <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.25rem", color: navy, margin: 0 }}>
              Wheel of Life
            </h3>
            {hasReflections && (
              <button
                onClick={() => setFlipped(true)}
                title={actionLabel}
                style={{ background: "none", border: `1px solid oklch(88% 0.006 80)`, borderRadius: 6, padding: "0.3rem 0.625rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem", flexShrink: 0 }}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8a6 6 0 1 1 1.5 4" stroke={navy} strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M2 12V8h4" stroke={navy} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, color: navy }}>{actionLabel}</span>
              </button>
            )}
          </div>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(50% 0.008 260)", marginBottom: "1.25rem" }}>
            Average score: <strong style={{ color: navy }}>{avg} / 10</strong>
          </p>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <WheelSpiderSVG scores={scores} size={220} showLabels />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem 1rem", marginBottom: "1.5rem" }}>
            {WHEEL_SEGMENTS.map(seg => (
              <div key={seg.key}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", color: seg.color, fontWeight: 600 }}>{seg.label}</span>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", fontWeight: 700, color: navy }}>{scores[seg.key] ?? 0}</span>
                </div>
                <div style={{ height: 4, background: "oklch(90% 0.004 260)", borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${((scores[seg.key] ?? 0) / 10) * 100}%`, background: seg.color, borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <div style={{ padding: "0.5rem 0.875rem", background: `${lowest.color}18`, borderRadius: 20, display: "flex", gap: "0.4rem", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: lowest.color, fontWeight: 700 }}>{lang === "id" ? "Area fokus" : lang === "nl" ? "Aandachtsgebied" : "Focus area"}</span>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: lowest.color }}>{lowest.label} ({scores[lowest.key]})</span>
            </div>
            <div style={{ padding: "0.5rem 0.875rem", background: `${highest.color}18`, borderRadius: 20, display: "flex", gap: "0.4rem", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: highest.color, fontWeight: 700 }}>{lang === "id" ? "Terkuat" : lang === "nl" ? "Sterkste" : "Strongest"}</span>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: highest.color }}>{highest.label} ({scores[highest.key]})</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <Link href="/resources/wheel-of-life" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, color: offWhite, background: navy, padding: "0.6rem 1.25rem", borderRadius: 6, textDecoration: "none" }}>
              {lang === "id" ? "Perbarui skor →" : lang === "nl" ? "Scores bijwerken →" : "Update scores →"}
            </Link>
            <button onClick={onClose} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 600, color: "oklch(52% 0.008 260)", background: "none", border: "none", padding: "0.6rem 0.75rem", cursor: "pointer" }}>
              {lang === "id" ? "Tutup" : lang === "nl" ? "Sluiten" : "Close"}
            </button>
          </div>
        </div>

        {/* ── BACK: action steps ── */}
        <div style={{
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          position: "absolute",
          inset: 0,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", margin: "0 0 0.25rem" }}>
                Wheel of Life
              </p>
              <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.25rem", color: navy, margin: 0 }}>
                {actionLabel}
              </h3>
            </div>
            <button
              onClick={() => setFlipped(false)}
              style={{ background: "none", border: `1px solid oklch(88% 0.006 80)`, borderRadius: 6, padding: "0.3rem 0.625rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem", flexShrink: 0 }}
            >
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, color: navy }}>↩ {lang === "id" ? "Skor" : lang === "nl" ? "Scores" : "Scores"}</span>
            </button>
          </div>

          {!hasReflections ? (
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", color: "oklch(52% 0.008 260)", lineHeight: 1.65, marginBottom: "1.5rem" }}>
              {lang === "id" ? "Belum ada langkah aksi tersimpan. Kunjungi Roda Kehidupan untuk menambahkannya." : lang === "nl" ? "Nog geen actiestappen opgeslagen. Bezoek het Levenswiel om ze toe te voegen." : "No action steps saved yet. Visit the Wheel of Life to add them."}
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
              {WHEEL_SEGMENTS.map(seg => {
                const r = reflections![seg.key];
                if (!r?.gratitude && !r?.action) return null;
                return (
                  <div key={seg.key} style={{ borderLeft: `3px solid ${seg.color}`, paddingLeft: "0.875rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: seg.color, flexShrink: 0 }} />
                      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, color: seg.color }}>{seg.label}</span>
                    </div>
                    {r.gratitude && (
                      <div style={{ marginBottom: r.action ? "0.5rem" : 0 }}>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "oklch(55% 0.008 260)", margin: "0 0 0.2rem" }}>
                          {lang === "id" ? "Syukur" : lang === "nl" ? "Dankbaarheid" : "Thankful for"}
                        </p>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", lineHeight: 1.6, color: "oklch(38% 0.008 260)", margin: 0 }}>{r.gratitude}</p>
                      </div>
                    )}
                    {r.action && (
                      <div>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "oklch(55% 0.008 260)", margin: "0 0 0.2rem" }}>
                          {lang === "id" ? "Tindakan" : lang === "nl" ? "Actie" : "God-honoring action"}
                        </p>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", lineHeight: 1.6, color: navy, margin: 0, fontWeight: 600 }}>{r.action}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <Link href="/resources/wheel-of-life" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, color: offWhite, background: navy, padding: "0.6rem 1.25rem", borderRadius: 6, textDecoration: "none" }}>
              {lang === "id" ? "Edit langkah aksi →" : lang === "nl" ? "Actiestappen bewerken →" : "Edit action steps →"}
            </Link>
            <button onClick={onClose} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 600, color: "oklch(52% 0.008 260)", background: "none", border: "none", padding: "0.6rem 0.75rem", cursor: "pointer" }}>
              {lang === "id" ? "Tutup" : lang === "nl" ? "Sluiten" : "Close"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function WheelActionStepsModal({ data, onClose }: { data: Extract<ModalData, { type: "wheelActionSteps" }>; onClose: () => void }) {
  const { reflections, lang } = data;
  const hasAny = WHEEL_SEGMENTS.some(seg => reflections[seg.key]?.gratitude || reflections[seg.key]?.action);

  return (
    <>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", marginBottom: "0.5rem" }}>
        Wheel of Life
      </p>
      <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.25rem", color: navy, marginBottom: "1.25rem" }}>
        {lang === "id" ? "Langkah Aksi" : lang === "nl" ? "Actiestappen" : "Action Steps"}
      </h3>

      {!hasAny ? (
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", color: "oklch(52% 0.008 260)", lineHeight: 1.65, marginBottom: "1.5rem" }}>
          {lang === "id" ? "Belum ada langkah aksi tersimpan. Kunjungi Roda Kehidupan untuk menambahkannya." : lang === "nl" ? "Nog geen actiestappen opgeslagen. Bezoek het Levenswiel om ze toe te voegen." : "No action steps saved yet. Visit the Wheel of Life to add them."}
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
          {WHEEL_SEGMENTS.map(seg => {
            const r = reflections[seg.key];
            if (!r?.gratitude && !r?.action) return null;
            return (
              <div key={seg.key} style={{ borderLeft: `3px solid ${seg.color}`, paddingLeft: "0.875rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: seg.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, color: seg.color }}>{seg.label}</span>
                </div>
                {r.gratitude && (
                  <div style={{ marginBottom: r.action ? "0.5rem" : 0 }}>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "oklch(55% 0.008 260)", margin: "0 0 0.2rem" }}>
                      {lang === "id" ? "Syukur" : lang === "nl" ? "Dankbaarheid" : "Thankful for"}
                    </p>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", lineHeight: 1.6, color: "oklch(38% 0.008 260)", margin: 0 }}>{r.gratitude}</p>
                  </div>
                )}
                {r.action && (
                  <div>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "oklch(55% 0.008 260)", margin: "0 0 0.2rem" }}>
                      {lang === "id" ? "Tindakan" : lang === "nl" ? "Actie" : "God-honoring action"}
                    </p>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", lineHeight: 1.6, color: navy, margin: 0, fontWeight: 600 }}>{r.action}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <Link href="/resources/wheel-of-life" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, color: offWhite, background: navy, padding: "0.6rem 1.25rem", borderRadius: 6, textDecoration: "none" }}>
          {lang === "id" ? "Edit langkah aksi →" : lang === "nl" ? "Actiestappen bewerken →" : "Edit action steps →"}
        </Link>
        <button onClick={onClose} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 600, color: "oklch(52% 0.008 260)", background: "none", border: "none", padding: "0.6rem 0.75rem", cursor: "pointer" }}>
          {lang === "id" ? "Tutup" : lang === "nl" ? "Sluiten" : "Close"}
        </button>
      </div>
    </>
  );
}

const THINKING_STYLE_LABELS: Record<string, string> = {
  C:  "Conceptual", H: "Holistic", I: "Intuitional",
  CH: "Conceptual-Holistic", CI: "Conceptual-Intuitional", HI: "Holistic-Intuitional",
  CHI: "Balanced",
};

const THINKING_STYLE_DESCRIPTIONS: Record<string, string> = {
  C:  "You lead with structure and analytical thinking. You see patterns, build frameworks, and solve problems systematically.",
  H:  "You lead with big-picture vision. You connect ideas across contexts and see how everything fits together.",
  I:  "You lead with instinct and insight. You read people and situations quickly, often knowing before you can explain why.",
  CH: "You blend structured thinking with broad vision — analytical yet able to see beyond the immediate.",
  CI: "You combine logical precision with sharp intuition — rigorous in your analysis but also attuned to what data can't capture.",
  HI: "You hold the big picture while staying tuned into people — visionary and relationally perceptive.",
  CHI: "You draw on all three dimensions. Your challenge is choosing which lens to lead with in each context.",
};

const THINKING_STYLE_COLORS: Record<string, string> = {
  C: "oklch(48% 0.18 250)",
  H: "oklch(48% 0.18 145)",
  I: "oklch(48% 0.18 300)",
};

function ThinkingModal({ data, onClose }: { data: Extract<ModalData, { type: "thinking" }>; onClose: () => void }) {
  const { result, scores, lang } = data;
  const bars = (["C", "H", "I"] as const).map(k => ({
    key: k,
    label: k === "C" ? "Conceptual" : k === "H" ? "Holistic" : "Intuitional",
    color: THINKING_STYLE_COLORS[k],
    pct: scores[k],
  }));

  return (
    <>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", marginBottom: "0.5rem" }}>
        Leadership Thinking Style
      </p>
      <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.25rem", color: navy, marginBottom: "1.5rem" }}>
        {THINKING_STYLE_LABELS[result] ?? result}
      </h3>

      {/* Three bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "1.5rem" }}>
        {bars.map(b => (
          <div key={b.key}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, color: b.color }}>{b.label}</span>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 800, color: navy }}>{b.pct}%</span>
            </div>
            <div style={{ height: 8, background: "oklch(90% 0.004 260)", borderRadius: 4 }}>
              <div style={{ height: "100%", width: `${b.pct}%`, background: b.color, borderRadius: 4, transition: "width 0.4s ease" }} />
            </div>
          </div>
        ))}
      </div>

      {(THINKING_STYLE_DESCRIPTIONS[result]) && (
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", lineHeight: 1.7, color: "oklch(38% 0.05 260)", marginBottom: "1.5rem", padding: "1rem", background: "oklch(94% 0.006 260)", borderRadius: 8 }}>
          {THINKING_STYLE_DESCRIPTIONS[result]}
        </p>
      )}

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <Link href="/resources/three-thinking-styles" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, color: offWhite, background: navy, padding: "0.6rem 1.25rem", borderRadius: 6, textDecoration: "none" }}>
          {lang === "id" ? "Ulangi tes →" : lang === "nl" ? "Opnieuw doen →" : "Retake quiz →"}
        </Link>
        <button onClick={onClose} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 600, color: "oklch(52% 0.008 260)", background: "none", border: "none", padding: "0.6rem 0.75rem", cursor: "pointer" }}>
          {lang === "id" ? "Tutup" : lang === "nl" ? "Sluiten" : "Close"}
        </button>
      </div>
    </>
  );
}

function KaruniaModal({ data, onClose }: { data: Extract<ModalData, { type: "karunia" }>; onClose: () => void }) {
  const { topGifts, scores, lang } = data;
  const title = lang === "id" ? "Karunia Rohani" : lang === "nl" ? "Geestelijke Gaven" : "Spiritual Gifts";

  const sortedGifts = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const retakeLabel = lang === "id" ? "Ulangi tes →" : lang === "nl" ? "Opnieuw doen →" : "Retake assessment →";
  const learnLabel = lang === "id" ? "Pelajari lebih" : lang === "nl" ? "Meer info" : "Learn more";

  return (
    <>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", marginBottom: "0.5rem" }}>
        Spiritual Assessment
      </p>
      <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.25rem", color: navy, marginBottom: "1.25rem" }}>
        {title}
      </h3>

      {/* Ring + top gifts side by side */}
      <div style={{ display: "flex", gap: "1.25rem", alignItems: "center", marginBottom: "1.5rem" }}>
        <KaruniaRing scores={scores} lang={lang as "en" | "id" | "nl"} size={120} showLegend={false} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {topGifts.slice(0, 3).map((gift, i) => (
            <div key={gift} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.72rem",
                fontWeight: 800,
                color: i === 0 ? orange : "oklch(62% 0.008 260)",
                minWidth: "1rem",
              }}>
                {i + 1}.
              </span>
              <span style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.75rem",
                fontWeight: i === 0 ? 700 : 500,
                color: i === 0 ? navy : "oklch(42% 0.008 260)",
                lineHeight: 1.3,
              }}>
                {karuniaLabel(gift, lang)}
              </span>
              <span style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.65rem",
                color: "oklch(58% 0.008 260)",
                marginLeft: "auto",
              }}>
                {scores[gift] ?? 0}/12
              </span>
            </div>
          ))}

          {/* Category legend */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem 0.625rem", marginTop: "0.25rem" }}>
            {GIFT_CATEGORIES.map(cat => (
              <div key={cat.key} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.58rem", color: "oklch(50% 0.008 260)" }}>
                  {cat.label[lang as "en" | "id" | "nl"]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Score bars — top 5 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", marginBottom: "1.5rem" }}>
        {sortedGifts.map(([key, score], i) => {
          const maxScore = sortedGifts[0][1] || 1;
          const catColor = GIFT_CATEGORIES.find(c => (c.gifts as readonly string[]).includes(key))?.color ?? orange;
          return (
            <div key={key}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.15rem" }}>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", color: i < 3 ? navy : "oklch(52% 0.008 260)", fontWeight: i < 3 ? 700 : 400 }}>
                  {karuniaLabel(key, lang)}
                </span>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", fontWeight: 700, color: navy }}>{score}</span>
              </div>
              <div style={{ height: 4, background: "oklch(90% 0.004 260)", borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${(score / maxScore) * 100}%`, background: i < 3 ? catColor : "oklch(78% 0.04 45)", borderRadius: 2 }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
        <Link
          href="/resources/karunia-rohani#quiz-section"
          style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, color: offWhite, background: navy, padding: "0.6rem 1.25rem", borderRadius: 6, textDecoration: "none" }}
        >
          {retakeLabel}
        </Link>
        <Link
          href="/resources/karunia-rohani"
          style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 600, color: "oklch(38% 0.008 260)", border: "1px solid oklch(82% 0.006 260)", padding: "0.6rem 1.25rem", borderRadius: 6, textDecoration: "none", display: "inline-block" }}
        >
          {learnLabel}
        </Link>
        <button onClick={onClose} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 600, color: "oklch(52% 0.008 260)", background: "none", border: "none", padding: "0.6rem 0.75rem", cursor: "pointer" }}>
          {lang === "id" ? "Tutup" : lang === "nl" ? "Sluiten" : "Close"}
        </button>
      </div>
    </>
  );
}

function EnneagramModal({ data, onClose }: { data: Extract<ModalData, { type: "enneagram" }>; onClose: () => void }) {
  const { typeData, scores, lang } = data;
  const [flipped, setFlipped] = useState(false);

  return (
    <>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", marginBottom: "0.5rem" }}>
        Personality Assessment
      </p>

      {/* Type Card */}
      <div style={{ height: "320px", marginBottom: "1.5rem" }}>
        <TypeCard
          type={typeData}
          lang={lang as "en" | "id" | "nl"}
          isFlipped={flipped}
          onClick={() => setFlipped(!flipped)}
        />
      </div>

      {/* Score bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {Object.entries(scores).sort(([, a], [, b]) => b - a).slice(0, 5).map(([key, score]) => (
          <div key={key}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: "oklch(42% 0.008 260)" }}>Type {key}</span>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, color: navy }}>{score.toFixed(1)}</span>
            </div>
            <div style={{ height: 4, background: "oklch(90% 0.004 260)", borderRadius: 2 }}>
              <div style={{ height: "100%", width: `${(score / 100) * 100}%`, background: orange, borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
        <Link href="/resources/enneagram" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, color: offWhite, background: navy, padding: "0.6rem 1.25rem", borderRadius: 6, textDecoration: "none" }}>
          {lang === "id" ? "Lebih lanjut →" : lang === "nl" ? "Meer info →" : "More info →"}
        </Link>
        <Link href="/resources/enneagram" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 600, color: navy, background: "none", border: `1px solid ${navy}`, padding: "0.6rem 1.25rem", borderRadius: 6, textDecoration: "none", opacity: 0.65 }}>
          {lang === "id" ? "Ulangi tes →" : lang === "nl" ? "Opnieuw doen →" : "Retake quiz →"}
        </Link>
        <button onClick={onClose} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 600, color: "oklch(52% 0.008 260)", background: "none", border: "none", padding: "0.6rem 0.75rem", cursor: "pointer" }}>
          {lang === "id" ? "Tutup" : lang === "nl" ? "Sluiten" : "Close"}
        </button>
      </div>
    </>
  );
}


function BigFiveModal({ data, onClose }: { data: Extract<ModalData, { type: "bigfive" }>; onClose: () => void }) {
  const { scores, lang } = data;

  function calcPct(raw: number) { return Math.round(((raw - 10) / 40) * 100); }

  const pcts = {
    O: calcPct(scores.O ?? 30),
    C: calcPct(scores.C ?? 30),
    E: calcPct(scores.E ?? 30),
    A: calcPct(scores.A ?? 30),
    ES: 100 - calcPct(scores.N ?? 30),
  };

  const TRAIT_INFO = [
    { key: "O", label: lang === "id" ? "Keterbukaan" : lang === "nl" ? "Openheid" : "Openness", color: "oklch(52% 0.22 280)" },
    { key: "C", label: lang === "id" ? "Kehati-hatian" : lang === "nl" ? "Zorgvuldigheid" : "Conscientiousness", color: "oklch(50% 0.18 215)" },
    { key: "E", label: lang === "id" ? "Ekstraversi" : lang === "nl" ? "Extraversie" : "Extraversion", color: "oklch(60% 0.20 52)" },
    { key: "A", label: lang === "id" ? "Keramahan" : lang === "nl" ? "Vriendelijkheid" : "Agreeableness", color: "oklch(52% 0.18 155)" },
    { key: "ES", label: lang === "id" ? "Stabilitas Emosional" : lang === "nl" ? "Emotionele Stabiliteit" : "Emotional Stability", color: "oklch(50% 0.20 310)" },
  ];

  // Find dominant trait (highest pct)
  const dominant = TRAIT_INFO.reduce((best, t) =>
    (pcts[t.key as keyof typeof pcts] ?? 0) > (pcts[best.key as keyof typeof pcts] ?? 0) ? t : best
  );

  return (
    <>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", marginBottom: "0.5rem" }}>
        {lang === "id" ? "Profil Kepribadian Big Five" : lang === "nl" ? "Big Five Persoonlijkheidsprofiel" : "Big Five Personality Profile"}
      </p>
      <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.25rem", color: navy, marginBottom: "1.5rem" }}>
        OCEAN Profile
      </h3>

      {/* Pentagon + bars side by side */}
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", marginBottom: "1.5rem" }}>
        <div style={{ flexShrink: 0 }}>
          <OceanRadarSVG scores={scores} size={200} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", flex: 1 }}>
          {TRAIT_INFO.map(t => {
            const pct = pcts[t.key as keyof typeof pcts] ?? 0;
            return (
              <div key={t.key}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <div style={{ width: 9, height: 9, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", color: "oklch(42% 0.008 260)" }}>{t.label}</span>
                  </div>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", fontWeight: 700, color: navy }}>{pct}%</span>
                </div>
                <div style={{ height: 4, background: "oklch(90% 0.004 260)", borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: t.color, borderRadius: 2 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dominant trait chip */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ padding: "0.5rem 0.875rem", background: `${dominant.color}18`, borderRadius: 20, display: "flex", gap: "0.4rem", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: dominant.color, fontWeight: 700 }}>
            {lang === "id" ? "Sifat paling menonjol" : lang === "nl" ? "Meest dominant" : "Most distinctive"}
          </span>
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: dominant.color }}>
            {dominant.label} ({pcts[dominant.key as keyof typeof pcts]}%)
          </span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
        <Link href="/resources/big-five?retake=1" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, color: offWhite, background: navy, padding: "0.6rem 1.25rem", borderRadius: 6, textDecoration: "none" }}>
          {lang === "id" ? "Ulangi tes →" : lang === "nl" ? "Opnieuw doen →" : "Retake assessment →"}
        </Link>
        <Link href="/resources/big-five" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 600, color: "oklch(38% 0.008 260)", border: "1px solid oklch(82% 0.006 260)", padding: "0.6rem 1.25rem", borderRadius: 6, textDecoration: "none", display: "inline-block" }}>
          {lang === "id" ? "Pelajari lebih" : lang === "nl" ? "Meer info" : "Learn more"}
        </Link>
        <button onClick={onClose} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 600, color: "oklch(52% 0.008 260)", background: "none", border: "none", padding: "0.6rem 0.75rem", cursor: "pointer" }}>
          {lang === "id" ? "Tutup" : lang === "nl" ? "Sluiten" : "Close"}
        </button>
      </div>
    </>
  );
}

// ── 16 Personalities type data for dashboard ─────────────────────────────────
const P16_COLORS: Record<string, string> = {
  INTJ: "oklch(48% 0.20 260)", INTP: "oklch(48% 0.18 240)",
  ENTJ: "oklch(50% 0.22 25)",  ENTP: "oklch(58% 0.20 45)",
  INFJ: "oklch(48% 0.22 295)", INFP: "oklch(52% 0.18 10)",
  ENFJ: "oklch(52% 0.18 155)", ENFP: "oklch(60% 0.18 65)",
  ISTJ: "oklch(45% 0.14 215)", ISFJ: "oklch(50% 0.16 185)",
  ESTJ: "oklch(48% 0.18 195)", ESFJ: "oklch(55% 0.18 35)",
  ISTP: "oklch(50% 0.15 145)", ISFP: "oklch(55% 0.18 150)",
  ESTP: "oklch(58% 0.20 55)",  ESFP: "oklch(62% 0.20 48)",
};
const P16_SUBTITLES: Record<string, string> = {
  INTJ: "The Architect",   INTP: "The Logician",
  ENTJ: "The Commander",  ENTP: "The Debater",
  INFJ: "The Advocate",   INFP: "The Mediator",
  ENFJ: "The Protagonist", ENFP: "The Campaigner",
  ISTJ: "The Logistician", ISFJ: "The Protector",
  ESTJ: "The Executive",  ESFJ: "The Consul",
  ISTP: "The Virtuoso",   ISFP: "The Adventurer",
  ESTP: "The Entrepreneur", ESFP: "The Entertainer",
};
const P16_SHORT: Record<string, string> = {
  INTJ: "Independent, strategic thinkers who see five steps ahead. Excellent strategists — invite them into pastoral conversations, don't assume they'll step forward.",
  INTP: "Curious, precise, and analytical. Strong at systems thinking, slower to commit. Pair with action-oriented teammates to translate insight into execution.",
  ENTJ: "Decisive, organised, results-driven. Rise to leadership quickly. Need to slow down and listen before deciding for everyone.",
  ENTP: "Energetic, idea-rich, challenge-loving. Best paired with someone who turns ideas into plans. Can wear out teammates who need stability.",
  INFJ: "Quiet, principled, deeply purposeful. Often the conscience of the team. Guard against burnout from carrying others' burdens silently.",
  INFP: "Gentle, values-driven, creative. Rarely volunteer their inner world — invite it. When given room, they bring depth others cannot.",
  ENFJ: "Warm, persuasive, people-focused. Skilled at calling out the best in others. Remember not everyone wants to be developed all the time.",
  ENFP: "Enthusiastic, imaginative, relational. Need help finishing what they start — pair well with a Judger who carries projects across the line.",
  ISTJ: "Reliable, thorough, loyal to systems. The backbone of many ministry teams — finances, logistics, follow-through. Tell them the why, not just the what.",
  ISFJ: "Quiet servants who notice what others miss. Often the unseen carers. Need to be invited into the spotlight, not assumed to be content in the shadows.",
  ESTJ: "Organised, direct, accountable. Make plans happen and hold others to commitments. Soften delivery in high-context cultures.",
  ESFJ: "Warm, sociable, devoted to group wellbeing. The team's host and connector. Can take criticism personally — need reassurance more than rebuke.",
  ISTP: "Practical, calm under pressure, competent. Fixes what's broken. Draw them into the relational layer — they won't push their way in.",
  ISFP: "Quiet, kind, aesthetically sensitive. Leads through example. Need to be asked — they rarely volunteer their thoughts.",
  ESTP: "Action-focused, bold, energising. Excellent in pioneer settings. Need to plan past the next twenty-four hours when others depend on them.",
  ESFP: "Warm, spontaneous, present-focused. Lifts the room when it's heavy. Need help with long-term follow-through on quiet commitments.",
};
const P16_DICHOTOMY_LABELS: Record<string, string> = {
  EI_A: "E — Extraversion", EI_B: "I — Introversion",
  SN_A: "S — Sensing",      SN_B: "N — Intuition",
  TF_A: "T — Thinking",     TF_B: "F — Feeling",
  JP_A: "J — Judging",      JP_B: "P — Perceiving",
};

function Personalities16Tile({
  personalityType,
  scores,
  lang,
  done,
}: {
  personalityType: string | null;
  scores: Record<string, number> | null;
  lang: "en" | "id" | "nl";
  done: boolean;
}) {
  const [flipped, setFlipped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const TILE_H = 165;
  const typeColor = personalityType ? (P16_COLORS[personalityType] ?? navy) : navy;
  const subtitle = personalityType ? (P16_SUBTITLES[personalityType] ?? "") : "";
  const shortOverview = personalityType ? (P16_SHORT[personalityType] ?? "") : "";

  const faceBase: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: 12,
    padding: "0.875rem",
    display: "flex",
    flexDirection: "column",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
  };

  if (!done) {
    return (
      <div style={{
        background: offWhite, border: "1px solid oklch(91% 0.006 80)", borderRadius: 12,
        padding: "0.875rem", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "space-between", gap: "0.5rem", minHeight: TILE_H,
      }}>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(58% 0.008 260)", width: "100%" }}>
          {lang === "id" ? "16 Kepribadian" : lang === "nl" ? "16 Persoonlijkheden" : "16 Personalities"}
        </p>
        <EmptyTileVisual />
        <Link href="/resources/16-personalities" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, color: "oklch(42% 0.08 260)", textDecoration: "none", alignSelf: "flex-end" }}>
          Take test →
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{ position: "relative", height: TILE_H, perspective: "800px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        position: "absolute", inset: 0,
        transformStyle: "preserve-3d",
        transition: "transform 0.45s cubic-bezier(0.4,0.2,0.2,1)",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
      }}>

        {/* FRONT */}
        <div style={{
          ...faceBase,
          background: "white",
          border: `1px solid oklch(88% 0.006 80)`,
          borderTop: `3px solid ${typeColor}`,
          boxShadow: hovered ? "0 8px 24px oklch(22% 0.10 260 / 0.12)" : "0 1px 4px oklch(0% 0 0 / 0.04)",
          transform: "rotateY(0deg)",
          cursor: "pointer",
          justifyContent: "space-between",
        }} onClick={() => setFlipped(true)}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: navy, width: "100%" }}>
            {lang === "id" ? "16 Kepribadian" : lang === "nl" ? "16 Persoonlijkheden" : "16 Personalities"}
          </p>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.25rem" }}>
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "1.75rem", fontWeight: 900, color: typeColor, lineHeight: 1 }}>
              {personalityType}
            </span>
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 500, color: "oklch(48% 0.008 260)" }}>
              {subtitle}
            </span>
          </div>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", color: "oklch(62% 0.008 260)", alignSelf: "flex-end" }}>
            Tap for details →
          </p>
        </div>

        {/* BACK */}
        <div style={{
          ...faceBase,
          background: offWhite,
          border: `1px solid oklch(88% 0.006 80)`,
          transform: "rotateY(180deg)",
          justifyContent: "space-between",
          overflow: "hidden",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: typeColor, marginBottom: "0.2rem" }}>
                {personalityType}
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 600, color: navy }}>
                {subtitle}
              </p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setFlipped(false); }}
              style={{ background: "none", border: "none", fontSize: "0.7rem", color: "oklch(55% 0.008 260)", cursor: "pointer", padding: "0 0.25rem", lineHeight: 1 }}>
              ×
            </button>
          </div>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", lineHeight: 1.55, color: "oklch(38% 0.008 260)", flex: 1, marginBlock: "0.5rem", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" }}>
            {shortOverview}
          </p>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <Link href="/resources/16-personalities"
              style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, color: offWhite, background: navy, padding: "0.35rem 0.75rem", borderRadius: 5, textDecoration: "none", whiteSpace: "nowrap" }}>
              {lang === "id" ? "Modul →" : lang === "nl" ? "Module →" : "More info →"}
            </Link>
            <Link href="/resources/16-personalities"
              style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 600, color: "oklch(48% 0.008 260)", textDecoration: "none", whiteSpace: "nowrap" }}>
              {lang === "id" ? "Ulangi →" : lang === "nl" ? "Opnieuw →" : "Retake →"}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

function PersonalitiesModal({ data, onClose }: { data: Extract<ModalData, { type: "16personalities" }>; onClose: () => void }) {
  const { personalityType, scores, lang } = data;
  const typeColor = P16_COLORS[personalityType] ?? navy;
  const subtitle = P16_SUBTITLES[personalityType] ?? "";
  const shortOverview = P16_SHORT[personalityType] ?? "";

  const DICHOTOMY_PAIRS = [
    { a: "EI_A", b: "EI_B", label: lang === "id" ? "Energi" : lang === "nl" ? "Energie" : "Energy" },
    { a: "SN_A", b: "SN_B", label: lang === "id" ? "Informasi" : lang === "nl" ? "Informatie" : "Information" },
    { a: "TF_A", b: "TF_B", label: lang === "id" ? "Keputusan" : lang === "nl" ? "Besluiten" : "Decisions" },
    { a: "JP_A", b: "JP_B", label: lang === "id" ? "Struktur" : lang === "nl" ? "Structuur" : "Structure" },
  ];

  return (
    <>
      {/* Header with type color */}
      <div style={{ background: typeColor, borderRadius: 10, padding: "1rem 1.25rem", marginBottom: "1.25rem" }}>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.52rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(85% 0.05 260)", marginBottom: "0.4rem" }}>
          16 Personalities
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
          <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 900, fontSize: "2rem", color: "white", lineHeight: 1 }}>{personalityType}</span>
          <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 500, fontSize: "0.85rem", color: "oklch(88% 0.05 260)" }}>{subtitle}</span>
        </div>
      </div>

      {/* Short overview */}
      {shortOverview && (
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", lineHeight: 1.65, color: "oklch(35% 0.008 260)", marginBottom: "1.25rem", padding: "0.875rem", background: "oklch(95% 0.006 260)", borderRadius: 8, borderLeft: `3px solid ${typeColor}` }}>
          {shortOverview}
        </p>
      )}

      {/* Dimension profile bars */}
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", marginBottom: "0.625rem" }}>
        {lang === "id" ? "Profil Dimensi" : lang === "nl" ? "Dimensieprofiel" : "Dimension Profile"}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.25rem" }}>
        {DICHOTOMY_PAIRS.map(({ a, b, label }) => {
          const scoreA = scores[a] ?? 0;
          const scoreB = scores[b] ?? 0;
          const total = scoreA + scoreB || 1;
          const pctA = Math.round((scoreA / total) * 100);
          const dominantKey = pctA >= 50 ? a : b;
          const dominantPct = pctA >= 50 ? pctA : 100 - pctA;
          const dominantLabel = P16_DICHOTOMY_LABELS[dominantKey] ?? dominantKey;
          return (
            <div key={label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: "oklch(42% 0.008 260)" }}>{label}</span>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, color: typeColor }}>{dominantLabel} — {dominantPct}%</span>
              </div>
              <div style={{ height: 5, background: "oklch(90% 0.004 260)", borderRadius: 3 }}>
                <div style={{ height: "100%", width: `${pctA}%`, background: typeColor, borderRadius: 3 }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
        <Link href="/resources/16-personalities" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, color: offWhite, background: navy, padding: "0.6rem 1.25rem", borderRadius: 6, textDecoration: "none" }}>
          {lang === "id" ? "Modul lengkap →" : lang === "nl" ? "Volledige module →" : "Full module →"}
        </Link>
        <Link href="/resources/16-personalities" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 600, color: navy, background: "none", border: `1px solid ${navy}`, padding: "0.6rem 1.25rem", borderRadius: 6, textDecoration: "none", opacity: 0.65 }}>
          {lang === "id" ? "Ulangi tes →" : lang === "nl" ? "Opnieuw doen →" : "Retake quiz →"}
        </Link>
        <button onClick={onClose} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 600, color: "oklch(52% 0.008 260)", background: "none", border: "none", padding: "0.6rem 0.75rem", cursor: "pointer" }}>
          {lang === "id" ? "Tutup" : lang === "nl" ? "Sluiten" : "Close"}
        </button>
      </div>
    </>
  );
}

// ── Assessment title translations ──────────────────────────────────────────

const ASSESSMENT_TITLES: Record<string, Record<"en" | "id" | "nl", string>> = {
  disc: { en: "DISC Profile", id: "Profil DISC", nl: "DISC-profiel" },
  wheel: { en: "Wheel of Life", id: "Roda Kehidupan", nl: "Levensrad" },
  thinking: { en: "Thinking Styles", id: "Gaya Berpikir", nl: "Denkstijlen" },
  enneagram: { en: "Enneagram", id: "Enneagram", nl: "Enneagram" },

  "16personalities": { en: "16 Personalities", id: "16 Kepribadian", nl: "16 Persoonlijkheden" },
  bigfive: { en: "Big Five", id: "Big Five", nl: "Big Five" },
};

function getTitle(key: string, lang: "en" | "id" | "nl"): string {
  return ASSESSMENT_TITLES[key]?.[lang] || ASSESSMENT_TITLES[key]?.en || key;
}

// ── Tile components ───────────────────────────────────────────────────────────

function CompactTile({
  title,
  visual,
  done,
  href,
  onClick,
  extraButton,
}: {
  title: string;
  visual: React.ReactNode;
  done: boolean;
  href?: string;
  onClick?: () => void;
  extraButton?: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  const baseStyle: React.CSSProperties = {
    background: done ? "white" : offWhite,
    border: `1px solid oklch(${done ? "88%" : "91%"} 0.006 80)`,
    borderRadius: 12,
    padding: "0.875rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.5rem",
    minHeight: 150,
    cursor: done ? "pointer" : "default",
    transition: "box-shadow 0.2s ease, transform 0.2s ease",
    boxShadow: done && hovered
      ? "0 8px 24px oklch(22% 0.10 260 / 0.12)"
      : "0 1px 4px oklch(0% 0 0 / 0.04)",
    transform: done && hovered ? "translateY(-2px)" : "none",
    position: "relative",
    overflow: "hidden",
  };

  const content = (
    <div
      style={baseStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={done ? onClick : undefined}
    >
      {/* Subtle orange accent when done + hovered */}
      {done && hovered && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: orange, borderRadius: "12px 12px 0 0",
        }} />
      )}

      <p style={{
        fontFamily: "var(--font-montserrat)",
        fontSize: "0.6rem",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: done ? navy : "oklch(58% 0.008 260)",
        textAlign: "center",
        lineHeight: 1.3,
        alignSelf: "flex-start",
        width: "100%",
      }}>
        {title}
      </p>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {visual}
      </div>

      {!done && href && (
        <Link
          href={href}
          style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.62rem",
            fontWeight: 700,
            color: "oklch(42% 0.08 260)",
            textDecoration: "none",
            alignSelf: "flex-end",
          }}
          onClick={e => e.stopPropagation()}
        >
          Take test →
        </Link>
      )}
      {extraButton && (
        <div style={{ alignSelf: "stretch" }} onClick={e => e.stopPropagation()}>
          {extraButton}
        </div>
      )}
    </div>
  );

  return content;
}

function WheelLifeTile({
  visual,
  done,
  lang,
  wheelReflections,
  onOpenScores,
}: {
  visual: React.ReactNode;
  done: boolean;
  lang: "en" | "id" | "nl";
  wheelReflections: Record<string, { gratitude: string; action: string }> | null;
  onOpenScores?: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const [hovered, setHovered] = useState(false);

  const title = lang === "id" ? "Roda Kehidupan" : lang === "nl" ? "Levensrad" : "Wheel of Life";
  const actionLabel = lang === "id" ? "Langkah Aksi" : lang === "nl" ? "Actiestappen" : "Action Steps";

  const segmentsWithActions = done
    ? WHEEL_SEGMENTS.filter(seg => wheelReflections?.[seg.key]?.action)
    : [];

  const TILE_H = 165;

  const faceBase: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: 12,
    overflow: "hidden",
    WebkitBackfaceVisibility: "hidden",
    backfaceVisibility: "hidden",
  };

  return (
    <div style={{ height: TILE_H, perspective: "800px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        width: "100%",
        height: "100%",
        position: "relative",
        transformStyle: "preserve-3d",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        transition: "transform 0.35s ease",
      }}>

        {/* ── FRONT ── */}
        <div
          style={{
            ...faceBase,
            background: done ? "white" : offWhite,
            border: `1px solid oklch(${done ? "88%" : "91%"} 0.006 80)`,
            boxShadow: done && hovered ? "0 8px 24px oklch(22% 0.10 260 / 0.12)" : "0 1px 4px oklch(0% 0 0 / 0.04)",
            transform: done && hovered && !flipped ? "translateY(-2px)" : "none",
            transition: "box-shadow 0.2s ease, transform 0.2s ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.5rem",
            padding: "0.875rem",
            cursor: done ? "pointer" : "default",
          }}
          onClick={done ? onOpenScores : undefined}
        >
          {done && hovered && !flipped && (
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: orange, borderRadius: "12px 12px 0 0" }} />
          )}

          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: done ? navy : "oklch(58% 0.008 260)", textAlign: "center", lineHeight: 1.3, alignSelf: "flex-start", width: "100%", margin: 0 }}>
            {title}
          </p>

          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {visual}
          </div>

          {!done && (
            <Link href="/resources/wheel-of-life" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, color: "oklch(42% 0.08 260)", textDecoration: "none", alignSelf: "flex-end" }} onClick={e => e.stopPropagation()}>
              Take test →
            </Link>
          )}

          {/* Tiny flip icon — bottom-right corner */}
          {done && (
            <button
              onClick={e => { e.stopPropagation(); setFlipped(true); }}
              title={actionLabel}
              style={{
                position: "absolute",
                bottom: "0.5rem",
                right: "0.5rem",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                opacity: hovered ? 0.7 : 0.3,
                transition: "opacity 0.15s",
                lineHeight: 1,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 8a6 6 0 1 1 1.5 4" stroke={navy} strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M2 12V8h4" stroke={navy} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* ── BACK ── */}
        <div style={{
          ...faceBase,
          transform: "rotateY(180deg)",
          background: navy,
          display: "flex",
          flexDirection: "column",
          padding: "0.875rem",
          gap: "0.375rem",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem", flexShrink: 0 }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: orange, margin: 0 }}>
              {actionLabel}
            </p>
            <button
              onClick={() => setFlipped(false)}
              style={{ background: "none", border: "none", color: offWhite, cursor: "pointer", fontSize: "0.85rem", lineHeight: 1, padding: "0 0.125rem", opacity: 0.7 }}
            >
              ↩
            </button>
          </div>

          {segmentsWithActions.length === 0 ? (
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: "oklch(65% 0.04 260)", lineHeight: 1.5, flex: 1, margin: 0 }}>
              {lang === "id" ? "Belum ada langkah aksi. Isi di halaman Roda Kehidupan." : lang === "nl" ? "Nog geen actiestappen. Vul ze in op het Levenswiel." : "No action steps yet. Fill them in on the Wheel of Life page."}
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", flex: 1, overflowY: "auto" }}>
              {segmentsWithActions.map(seg => (
                <div key={seg.key} style={{ display: "flex", gap: "0.35rem", alignItems: "flex-start" }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: seg.color, flexShrink: 0, marginTop: 4 }} />
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", color: offWhite, lineHeight: 1.4, margin: 0, flex: 1 }}>
                    {wheelReflections![seg.key].action}
                  </p>
                </div>
              ))}
            </div>
          )}

          <Link
            href="/resources/wheel-of-life"
            style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, color: orange, textDecoration: "none", alignSelf: "flex-end", flexShrink: 0 }}
            onClick={e => e.stopPropagation()}
          >
            {lang === "id" ? "Edit →" : lang === "nl" ? "Bewerken →" : "Edit →"}
          </Link>
        </div>

      </div>
    </div>
  );
}

function EmptyTileVisual() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="20" fill="oklch(91% 0.005 260)" />
      <circle cx="24" cy="24" r="20" fill="none" stroke="oklch(84% 0.008 260)" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="24" y="28" textAnchor="middle"
        style={{ fontFamily: "var(--font-montserrat)", fontSize: "16px", fill: "oklch(72% 0.008 260)" }}>
        ?
      </text>
    </svg>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function AssessmentTileGrid({
  discResult = null,
  discScores = null,
  wheelOfLifeScores = null,
  wheelReflections = null,
  thinkingStyleResult = null,
  thinkingStyleScores = null,
  karuniaTopGifts = null,
  karuniaScores = null,
  enneagramType = null,
  enneagramScores = null,
  bigFiveScores = null,

  personalities16Type = null,
  personalities16Scores = null,
  fivelaReceivingResult = null,
  fivelaGivingResult = null,
  fivelaReceivingScores = null,
  fivelaGivingScores = null,
  languagePreference = "en",
}: {
  discResult?: string | null;
  discScores?: { D: number; I: number; S: number; C: number } | null;
  wheelOfLifeScores?: Record<string, number> | null;
  wheelReflections?: Record<string, { gratitude: string; action: string }> | null;
  thinkingStyleResult?: string | null;
  thinkingStyleScores?: { C: number; H: number; I: number } | null;
  karuniaTopGifts?: string[] | null;
  karuniaScores?: Record<string, number> | null;
  enneagramType?: number | null;
  enneagramScores?: Record<string, number> | null;
  bigFiveScores?: Record<string, number> | null;

  personalities16Type?: string | null;
  personalities16Scores?: Record<string, number> | null;
  fivelaReceivingResult?: string | null;
  fivelaGivingResult?: string | null;
  fivelaReceivingScores?: { A: number; B: number; C: number; D: number; E: number } | null;
  fivelaGivingScores?: { A: number; B: number; C: number; D: number; E: number } | null;
  languagePreference?: "en" | "id" | "nl";
}) {
  const [modal, setModal] = useState<ModalData | null>(null);
  const [enneagramFlipped, setEnneagramFlipped] = useState(false);
  const lang = languagePreference;

  const karuniaTitle = lang === "id" ? "Karunia Rohani" : lang === "nl" ? "Geestelijke Gaven" : "Spiritual Gifts";

  // ── Compact visuals ──────────────────────────────────────────────────────────

  const discVisual = discScores ? (
    <div style={{ width: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <DiscPieSVG scores={discScores} size={80} result={discResult ?? ""} />
    </div>
  ) : <EmptyTileVisual />;

  const wheelVisual = wheelOfLifeScores ? (
    <div style={{ width: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <WheelSpiderSVG scores={wheelOfLifeScores} size={72} showLabels={false} />
    </div>
  ) : <EmptyTileVisual />;

  const thinkingVisual = thinkingStyleScores ? (
    <div style={{ width: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", paddingInline: "0.25rem" }}>
        {(["C", "H", "I"] as const).map(k => (
          <div key={k} style={{ marginBottom: "0.35rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.15rem" }}>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", color: THINKING_STYLE_COLORS[k], fontWeight: 700 }}>
                {k === "C" ? "Conceptual" : k === "H" ? "Holistic" : "Intuitional"}
              </span>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 800, color: navy }}>{thinkingStyleScores[k]}%</span>
            </div>
            <div style={{ height: 5, background: "oklch(90% 0.004 260)", borderRadius: 3 }}>
              <div style={{ height: "100%", width: `${thinkingStyleScores[k]}%`, background: THINKING_STYLE_COLORS[k], borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : <EmptyTileVisual />;

  const karuniaVisual = karuniaTopGifts && karuniaTopGifts.length > 0 ? (
    <div style={{ width: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "1.2rem", fontWeight: 800, color: orange, lineHeight: 1, marginBottom: "0.2rem" }}>
          {karuniaLabel(karuniaTopGifts[0], lang)}
        </p>
        {karuniaTopGifts[1] && (
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", color: "oklch(50% 0.008 260)" }}>
            + {karuniaLabel(karuniaTopGifts[1], lang)}
          </p>
        )}
      </div>
    </div>
  ) : <EmptyTileVisual />;

  const FIVELA_COLORS: Record<string, string> = {
    A: "oklch(72% 0.18 85)",
    B: "oklch(62% 0.14 235)",
    C: "oklch(52% 0.14 150)",
    D: "oklch(68% 0.15 10)",
    E: "oklch(70% 0.16 65)",
  };
  const FIVELA_NAMES: Record<string, string> = {
    A: "Words",
    B: "Quality Time",
    C: "Service",
    D: "Gifts",
    E: "Touch",
  };

  const fivelaVisual = fivelaReceivingResult && fivelaGivingResult && fivelaReceivingScores && fivelaGivingScores ? (
    <div style={{ width: 170, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {(["receiving", "giving"] as const).map(role => {
        const primary = role === "receiving" ? fivelaReceivingResult : fivelaGivingResult;
        const scores = role === "receiving" ? fivelaReceivingScores : fivelaGivingScores;
        return (
          <div key={role}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginBottom: "0.2rem" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: FIVELA_COLORS[primary] ?? navy, flexShrink: 0 }} />
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, color: navy, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {role === "receiving" ? "Receive" : "Give"}: {FIVELA_NAMES[primary] ?? primary}
              </span>
            </div>
            <div style={{ display: "flex", gap: "2px" }}>
              {(["A", "B", "C", "D", "E"] as const).map(key => {
                const val = scores[key] ?? 0;
                const isPrimary = key === primary;
                return (
                  <div key={key} style={{ flex: 1, height: 18, background: "oklch(90% 0.004 260)", borderRadius: 2, overflow: "hidden", position: "relative" }}>
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${Math.min(val, 100)}%`, background: FIVELA_COLORS[key], opacity: isPrimary ? 1 : 0.45, transition: "height 0.3s ease" }} />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.5rem", color: fivelaReceivingResult === fivelaGivingResult ? "oklch(52% 0.14 150)" : "oklch(62% 0.14 235)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "0.1rem" }}>
        {fivelaReceivingResult === fivelaGivingResult ? "Match" : "Mismatch"}
      </p>
    </div>
  ) : <EmptyTileVisual />;

  return (
    <>
      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .assessment-modal-card { animation: modal-in 0.18s ease-out both; }
      `}</style>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>

        {/* 1. DISC */}
        <CompactTile
          title={getTitle("disc", lang)}
          visual={discVisual}
          done={!!(discResult && discScores)}
          href="/resources/disc"
          onClick={discResult && discScores ? () => setModal({ type: "disc", result: discResult, scores: discScores, lang }) : undefined}
        />

        {/* 2. Wheel of Life */}
        <WheelLifeTile
          visual={wheelVisual}
          done={!!wheelOfLifeScores}
          lang={lang}
          wheelReflections={wheelReflections}
          onOpenScores={wheelOfLifeScores ? () => setModal({ type: "wheel", scores: wheelOfLifeScores, reflections: wheelReflections, lang }) : undefined}
        />

        {/* 3. Three Thinking Styles */}
        <CompactTile
          title={getTitle("thinking", lang)}
          visual={thinkingVisual}
          done={!!(thinkingStyleResult && thinkingStyleScores)}
          href="/resources/three-thinking-styles"
          onClick={thinkingStyleResult && thinkingStyleScores ? () => setModal({ type: "thinking", result: thinkingStyleResult, scores: thinkingStyleScores, lang }) : undefined}
        />

        {/* 4. Spiritual Gifts / Karunia Rohani */}
        <CompactTile
          title={karuniaTitle}
          visual={karuniaVisual}
          done={!!(karuniaTopGifts && karuniaTopGifts.length > 0)}
          href="/resources/karunia-rohani"
          onClick={karuniaTopGifts && karuniaScores && karuniaTopGifts.length > 0
            ? () => setModal({ type: "karunia", topGifts: karuniaTopGifts, scores: karuniaScores!, lang })
            : undefined}
        />

        {/* 5. Enneagram */}
        <CompactTile
          title={getTitle("enneagram", lang)}
          visual={enneagramScores && enneagramType && ENNEAGRAM_TYPES[enneagramType] ? <div style={{ width: 180, height: 110, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}><TypeCard type={ENNEAGRAM_TYPES[enneagramType]} lang={lang as "en" | "id" | "nl"} isFlipped={enneagramFlipped} onClick={() => setEnneagramFlipped(!enneagramFlipped)} /></div> : <EmptyTileVisual />}
          done={!!(enneagramType && enneagramScores)}
          href="/resources/enneagram"
          onClick={enneagramType && enneagramScores && ENNEAGRAM_TYPES[enneagramType] ? () => setModal({ type: "enneagram", typeData: ENNEAGRAM_TYPES[enneagramType], scores: enneagramScores, lang: lang as "en" | "id" | "nl" }) : undefined}
        />


        {/* 7. 16 Personalities */}
        <Personalities16Tile
          personalityType={personalities16Type}
          scores={personalities16Scores}
          lang={lang as "en" | "id" | "nl"}
          done={!!(personalities16Type && personalities16Scores)}
        />

        {/* 8. Big Five */}
        <CompactTile
          title={getTitle("bigfive", lang)}
          visual={bigFiveScores
            ? <OceanRadarSVG scores={bigFiveScores} size={90} />
            : <EmptyTileVisual />}
          done={!!bigFiveScores}
          href="/resources/big-five"
          onClick={bigFiveScores ? () => setModal({ type: "bigfive", scores: bigFiveScores, lang }) : undefined}
        />

        {/* 9. 5 Languages of Appreciation */}
        <CompactTile
          title="5 Languages of Appreciation"
          visual={fivelaVisual}
          done={!!(fivelaReceivingResult && fivelaGivingResult)}
          href="/resources/5languages"
        />

      </div>

      {/* Modal overlay */}
      {modal && (
        <AssessmentModal data={modal} onClose={() => setModal(null)} />
      )}
    </>
  );
}
