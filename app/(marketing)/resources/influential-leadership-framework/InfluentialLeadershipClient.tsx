"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

// ─── VERSE DATA ──────────────────────────────────────────────────────────────

const VERSES: Record<string, { ref: string; en: string; id: string; nl: string }> = {
  "mark-10-42-45": {
    ref: "Mark 10:42–45",
    en: "Jesus called them together and said, 'You know that those who are regarded as rulers of the Gentiles lord it over them, and their high officials exercise authority over them. Not so with you. Instead, whoever wants to become great among you must be your servant, and whoever wants to be first must be slave of all. For even the Son of Man did not come to be served, but to serve, and to give his life as a ransom for many.'",
    id: "Yesus memanggil mereka dan berkata: 'Kamu tahu, bahwa mereka yang disebut pemerintah bangsa-bangsa memerintah rakyatnya dengan tangan besi, dan pembesar-pembesarnya menjalankan kuasanya dengan keras atas mereka. Tidaklah demikian di antara kamu. Barangsiapa ingin menjadi besar di antara kamu, hendaklah ia menjadi pelayanmu, dan barangsiapa ingin menjadi yang terkemuka di antara kamu, hendaklah ia menjadi hamba untuk semuanya. Karena Anak Manusia juga datang bukan untuk dilayani, melainkan untuk melayani dan untuk memberikan nyawa-Nya menjadi tebusan bagi banyak orang.'",
    nl: "Jezus riep hen bij zich en zei: 'Jullie weten dat de volken geregeerd worden door mensen die macht over hen uitoefenen, en dat leiders hen laten voelen wie de baas is. Zo mag het bij jullie niet gaan. Wie van jullie de belangrijkste wil zijn, moet de anderen dienen, en wie van jullie de eerste wil zijn, moet de slaaf van allen zijn. Want ook de Mensenzoon is niet gekomen om gediend te worden, maar om te dienen en zijn leven te geven als losgeld voor velen.'",
  },
  "luke-16-10": {
    ref: "Luke 16:10",
    en: "Whoever can be trusted with very little can also be trusted with much, and whoever is dishonest with very little will also be dishonest with much.",
    id: "Barangsiapa setia dalam perkara-perkara kecil, ia setia juga dalam perkara-perkara besar. Dan barangsiapa tidak benar dalam perkara-perkara kecil, ia tidak benar juga dalam perkara-perkara besar.",
    nl: "Wie betrouwbaar is in het kleinste, is ook betrouwbaar als het om veel gaat, en wie oneerlijk is in het kleinste, is ook oneerlijk als het om veel gaat.",
  },
};

// ─── PILLAR DATA ─────────────────────────────────────────────────────────────

type Pillar = {
  num: number;
  en_title: string;
  id_title: string;
  nl_title: string;
  en_desc: string;
  id_desc: string;
  nl_desc: string;
  en_strong: string[];
  id_strong: string[];
  nl_strong: string[];
  en_depletes: string[];
  id_depletes: string[];
  nl_depletes: string[];
  en_nextstep: string;
  id_nextstep: string;
  nl_nextstep: string;
};

const PILLARS: Pillar[] = [
  {
    num: 1,
    en_title: "Credibility",
    id_title: "Kredibilitas",
    nl_title: "Geloofwaardigheid",
    en_desc:
      "Credibility is the foundation of all influence. It is built from the intersection of expertise, integrity, and track record — and it cannot be declared, only earned. In cross-cultural contexts, credibility must be re-established in each new setting, because what signals trustworthiness in one culture may be invisible or even counterproductive in another.",
    id_desc:
      "Kredibilitas adalah fondasi dari semua pengaruh. Kredibilitas dibangun dari perpaduan keahlian, integritas, dan rekam jejak — dan tidak dapat dinyatakan, hanya dapat diraih. Dalam konteks lintas budaya, kredibilitas harus dibangun kembali di setiap lingkungan baru, karena apa yang menandakan kepercayaan dalam satu budaya mungkin tidak terlihat atau bahkan kontraproduktif di budaya lain.",
    nl_desc:
      "Geloofwaardigheid is het fundament van alle invloed. Het wordt opgebouwd uit de combinatie van expertise, integriteit en staat van dienst — en het kan niet worden opgeëist, alleen worden verdiend. In interculturele contexten moet geloofwaardigheid in elke nieuwe omgeving opnieuw worden opgebouwd, omdat wat vertrouwen signaleert in de ene cultuur onzichtbaar of zelfs contraproductief kan zijn in een andere.",
    en_strong: [
      "You follow through on every commitment, no matter how small — and people have noticed.",
      "You acknowledge mistakes openly and correct course without defensiveness.",
      "Your expertise is visible not through title but through the quality of your thinking and questions.",
    ],
    id_strong: [
      "Anda menindaklanjuti setiap komitmen, sekecil apapun — dan orang-orang telah memperhatikannya.",
      "Anda mengakui kesalahan secara terbuka dan mengoreksi arah tanpa bersikap defensif.",
      "Keahlian Anda terlihat bukan melalui jabatan tetapi melalui kualitas pemikiran dan pertanyaan Anda.",
    ],
    nl_strong: [
      "Je komt elke afspraak na, hoe klein ook — en mensen hebben dat opgemerkt.",
      "Je erkent fouten openlijk en corrigeert koers zonder defensief te worden.",
      "Je expertise is zichtbaar niet via titel maar via de kwaliteit van je denken en vragen.",
    ],
    en_depletes: [
      "Over-promising to seem capable — then under-delivering. Every gap between word and action erodes the account.",
      "Hiding uncertainty behind authority. In cross-cultural teams, people can tell when a leader is bluffing — they just may not say so to your face.",
    ],
    id_depletes: [
      "Berjanji terlalu banyak untuk terlihat mampu — kemudian tidak memenuhi janji. Setiap kesenjangan antara kata dan tindakan menguras rekening.",
      "Menyembunyikan ketidakpastian di balik otoritas. Dalam tim lintas budaya, orang dapat mengetahui ketika seorang pemimpin menggertak — mereka mungkin hanya tidak mengatakannya langsung kepada Anda.",
    ],
    nl_depletes: [
      "Te veel beloven om bekwaam over te komen — en dan onder de maat presteren. Elke kloof tussen woord en daad sloopt de rekening.",
      "Onzekerheid verbergen achter autoriteit. In interculturele teams merken mensen wanneer een leider bluft — ze zeggen het alleen misschien niet in je gezicht.",
    ],
    en_nextstep:
      "Identify one commitment you made this week that you haven't yet completed. Complete it — or renegotiate it honestly before the deadline passes.",
    id_nextstep:
      "Identifikasi satu komitmen yang Anda buat minggu ini yang belum Anda selesaikan. Selesaikan — atau negosiasikan ulang dengan jujur sebelum batas waktu berlalu.",
    nl_nextstep:
      "Identificeer één afspraak die je deze week hebt gemaakt maar nog niet bent nagekomen. Kom die na — of heronderhandel eerlijk voordat de deadline verstrijkt.",
  },
  {
    num: 2,
    en_title: "Connection",
    id_title: "Koneksi",
    nl_title: "Verbinding",
    en_desc:
      "People follow leaders who know them — not just their job titles, but their stories, pressures, and hopes. Connection is the willingness to see a person as a person, not merely as a function. In high-context cultures especially, influence is impossible without relationship first. You cannot lead a person you don't know.",
    id_desc:
      "Orang mengikuti pemimpin yang mengenal mereka — bukan hanya jabatan mereka, tetapi cerita, tekanan, dan harapan mereka. Koneksi adalah kesediaan untuk melihat seseorang sebagai pribadi, bukan sekadar fungsi. Terutama dalam budaya konteks tinggi, pengaruh tidak mungkin terjadi tanpa hubungan terlebih dahulu. Anda tidak dapat memimpin seseorang yang tidak Anda kenal.",
    nl_desc:
      "Mensen volgen leiders die hen kennen — niet alleen hun functietitels, maar hun verhalen, druk en hoop. Verbinding is de bereidheid om iemand als persoon te zien, niet louter als een functie. Met name in hoge-contextculturen is invloed onmogelijk zonder eerst een relatie. Je kunt geen persoon leiden die je niet kent.",
    en_strong: [
      "You remember personal details people have shared and refer back to them — not as a technique, but because you genuinely care.",
      "People on your team feel safe enough to bring you the real news, not just the polished version.",
      "You invest time in relationship outside the agenda — meals, informal conversation, genuine interest.",
    ],
    id_strong: [
      "Anda mengingat detail pribadi yang telah dibagikan orang dan merujuknya kembali — bukan sebagai teknik, tetapi karena Anda benar-benar peduli.",
      "Orang-orang dalam tim Anda merasa cukup aman untuk membawa Anda berita yang sebenarnya, bukan hanya versi yang dipoles.",
      "Anda menginvestasikan waktu dalam hubungan di luar agenda — makan bersama, percakapan informal, ketertarikan tulus.",
    ],
    nl_strong: [
      "Je onthoudt persoonlijke details die mensen hebben gedeeld en verwijst daarnaar terug — niet als techniek, maar omdat je oprecht geeft.",
      "Mensen in je team voelen zich veilig genoeg om je het echte nieuws te brengen, niet alleen de gepolijste versie.",
      "Je investeert tijd in relatie buiten de agenda — maaltijden, informeel gesprek, oprechte interesse.",
    ],
    en_depletes: [
      "Treating relational investment as inefficient. Leaders who are 'too busy for people' discover that people become too indifferent to follow.",
      "Connecting only with people who are similar to you — same background, same language, same style. This leaves most of a cross-cultural team relationally outside.",
    ],
    id_depletes: [
      "Memperlakukan investasi relasional sebagai tidak efisien. Pemimpin yang 'terlalu sibuk untuk orang' menemukan bahwa orang menjadi terlalu acuh untuk mengikuti.",
      "Terhubung hanya dengan orang yang mirip dengan Anda — latar belakang, bahasa, gaya yang sama. Ini membuat sebagian besar tim lintas budaya berada di luar secara relasional.",
    ],
    nl_depletes: [
      "Relationele investering als inefficiënt behandelen. Leiders die 'te druk zijn voor mensen' ontdekken dat mensen te onverschillig worden om te volgen.",
      "Alleen verbinding maken met mensen die op jou lijken — zelfde achtergrond, taal, stijl. Dit laat het grootste deel van een intercultureel team relationeel buiten staan.",
    ],
    en_nextstep:
      "Choose one team member you know the least about as a person. Ask them one genuine question this week — not about work.",
    id_nextstep:
      "Pilih satu anggota tim yang paling sedikit Anda kenal sebagai pribadi. Ajukan satu pertanyaan tulus kepada mereka minggu ini — bukan tentang pekerjaan.",
    nl_nextstep:
      "Kies één teamlid dat je het minst kent als persoon. Stel hen deze week één oprechte vraag — niet over werk.",
  },
  {
    num: 3,
    en_title: "Communication",
    id_title: "Komunikasi",
    nl_title: "Communicatie",
    en_desc:
      "Influence depends entirely on whether your message lands. Communication across cultures is not just translation — it is understanding how directness, tone, silence, hierarchy, and context shape whether people hear what you actually mean. The most technically correct message can fail completely if the delivery misreads the room.",
    id_desc:
      "Pengaruh sepenuhnya bergantung pada apakah pesan Anda diterima dengan baik. Komunikasi lintas budaya bukan sekadar terjemahan — ini adalah memahami bagaimana kejujuran, nada, keheningan, hierarki, dan konteks membentuk apakah orang mendengar apa yang Anda maksud. Pesan yang paling tepat secara teknis bisa gagal total jika penyampaiannya salah membaca situasi.",
    nl_desc:
      "Invloed hangt volledig af van of je boodschap aankomt. Communiceren over culturen heen is niet alleen vertalen — het is begrijpen hoe directheid, toon, stilte, hiërarchie en context bepalen of mensen horen wat je werkelijk bedoelt. De technisch meest correcte boodschap kan volledig falen als de levering de kamer verkeerd leest.",
    en_strong: [
      "You adapt your register — when to be direct, when to be indirect — depending on what the person and culture can receive.",
      "You ask for comprehension without shame: 'What did you understand from what I just said?' rather than 'Did you understand?'",
      "You leave space for silence and don't rush to fill it — especially with team members from high-context cultures where silence carries meaning.",
    ],
    id_strong: [
      "Anda menyesuaikan register Anda — kapan harus langsung, kapan tidak langsung — tergantung pada apa yang dapat diterima oleh orang dan budaya tersebut.",
      "Anda meminta pemahaman tanpa rasa malu: 'Apa yang Anda pahami dari apa yang baru saya katakan?' daripada 'Apakah Anda mengerti?'",
      "Anda memberi ruang untuk keheningan dan tidak terburu-buru mengisinya — terutama dengan anggota tim dari budaya konteks tinggi di mana keheningan membawa makna.",
    ],
    nl_strong: [
      "Je past je register aan — wanneer direct te zijn, wanneer indirect — afhankelijk van wat de persoon en cultuur kan ontvangen.",
      "Je vraagt om begrip zonder schaamte: 'Wat heb je begrepen van wat ik net zei?' in plaats van 'Begreep je het?'",
      "Je laat ruimte voor stilte en haast je niet om die te vullen — met name bij teamleden uit hoge-contextculturen waar stilte betekenis draagt.",
    ],
    en_depletes: [
      "Assuming shared meaning. Words like 'soon', 'flexible', 'respect', 'honest', and 'efficient' carry very different weights across cultures.",
      "Communicating primarily in the style that works for you — because it's comfortable — rather than in the style that lands for them.",
    ],
    id_depletes: [
      "Mengasumsikan makna yang sama. Kata-kata seperti 'segera', 'fleksibel', 'hormat', 'jujur', dan 'efisien' membawa bobot yang sangat berbeda di berbagai budaya.",
      "Berkomunikasi terutama dalam gaya yang berhasil untuk Anda — karena nyaman — daripada dalam gaya yang efektif bagi mereka.",
    ],
    nl_depletes: [
      "Gedeelde betekenis aannemen. Woorden als 'snel', 'flexibel', 'respect', 'eerlijk' en 'efficiënt' dragen in culturen sterk verschillende gewichten.",
      "Voornamelijk communiceren in de stijl die voor jou werkt — omdat het comfortabel is — in plaats van in de stijl die bij hen aankomt.",
    ],
    en_nextstep:
      "In your next key conversation, check understanding explicitly by asking: 'What did you hear me say?' Note any gap between what you said and what they received.",
    id_nextstep:
      "Dalam percakapan penting berikutnya, periksa pemahaman secara eksplisit dengan bertanya: 'Apa yang Anda dengar saya katakan?' Catat setiap kesenjangan antara apa yang Anda katakan dan apa yang mereka terima.",
    nl_nextstep:
      "Controleer in je volgende belangrijke gesprek begrip expliciet door te vragen: 'Wat hoorde je mij zeggen?' Noteer elke kloof tussen wat jij zei en wat zij ontvingen.",
  },
  {
    num: 4,
    en_title: "Consistency",
    id_title: "Konsistensi",
    nl_title: "Consistentie",
    en_desc:
      "Influence is not built in one great moment — it is built in ten thousand small ones. Consistency is showing up the same way over time: the same values under pressure, the same respect across power levels, the same standards whether observed or not. In cross-cultural contexts, consistency is especially powerful because it communicates safety — people can predict you, and that trust is the soil of influence.",
    id_desc:
      "Pengaruh tidak dibangun dalam satu momen besar — melainkan dalam sepuluh ribu momen kecil. Konsistensi adalah menampilkan diri dengan cara yang sama dari waktu ke waktu: nilai-nilai yang sama di bawah tekanan, rasa hormat yang sama di semua tingkat kekuasaan, standar yang sama baik diamati maupun tidak. Dalam konteks lintas budaya, konsistensi sangat kuat karena mengkomunikasikan keamanan — orang dapat memprediksi Anda, dan kepercayaan itu adalah tanah subur pengaruh.",
    nl_desc:
      "Invloed wordt niet gebouwd in één groot moment — maar in tienduizend kleine. Consistentie is op dezelfde manier verschijnen door de tijd: dezelfde waarden onder druk, hetzelfde respect op alle machtsniveaus, dezelfde normen of je nu geobserveerd wordt of niet. In interculturele contexten is consistentie bijzonder krachtig omdat het veiligheid communiceert — mensen kunnen je voorspellen, en dat vertrouwen is de bodem van invloed.",
    en_strong: [
      "Your team members know how you will respond before you respond — not because you're predictable in a boring way, but because you're trustworthy.",
      "You treat the cleaner with the same warmth you give the director.",
      "Your private behaviour and public behaviour are the same. What you say in the meeting is what you say outside it.",
    ],
    id_strong: [
      "Anggota tim Anda tahu bagaimana Anda akan merespons sebelum Anda merespons — bukan karena Anda dapat diprediksi dengan cara yang membosankan, tetapi karena Anda dapat dipercaya.",
      "Anda memperlakukan petugas kebersihan dengan kehangatan yang sama yang Anda berikan kepada direktur.",
      "Perilaku pribadi dan perilaku publik Anda sama. Apa yang Anda katakan dalam rapat adalah apa yang Anda katakan di luar rapat.",
    ],
    nl_strong: [
      "Je teamleden weten hoe je zal reageren voordat je reageert — niet omdat je voorspelbaar bent op een saaie manier, maar omdat je betrouwbaar bent.",
      "Je behandelt de schoonmaker met dezelfde warmte die je de directeur geeft.",
      "Je privégedrag en je publieke gedrag zijn hetzelfde. Wat je in de vergadering zegt, is wat je erbuiten zegt.",
    ],
    en_depletes: [
      "Changing your standards based on who is watching. This is immediately sensed — and it destroys trust faster than almost anything else.",
      "Being consistent in vision but inconsistent in tone. How you say things under pressure matters as much as what you say when calm.",
    ],
    id_depletes: [
      "Mengubah standar Anda berdasarkan siapa yang sedang mengamati. Ini segera dirasakan — dan menghancurkan kepercayaan lebih cepat dari hampir semua hal lainnya.",
      "Konsisten dalam visi tetapi tidak konsisten dalam nada. Bagaimana Anda mengatakan sesuatu di bawah tekanan sama pentingnya dengan apa yang Anda katakan saat tenang.",
    ],
    nl_depletes: [
      "Je normen aanpassen afhankelijk van wie er kijkt. Dit wordt onmiddellijk gevoeld — en het vernietigt vertrouwen sneller dan bijna alles.",
      "Consistent zijn in visie maar inconsistent in toon. Hoe je dingen zegt onder druk is even belangrijk als wat je zegt als het rustig is.",
    ],
    en_nextstep:
      "Ask yourself: Is there anyone on my team I treat differently depending on their status or their proximity to me? Name them — and change that this week.",
    id_nextstep:
      "Tanyakan pada diri sendiri: Apakah ada seseorang dalam tim saya yang saya perlakukan berbeda tergantung pada status atau kedekatan mereka dengan saya? Sebutkan mereka — dan ubah itu minggu ini.",
    nl_nextstep:
      "Vraag jezelf af: Is er iemand in mijn team die ik anders behandel afhankelijk van hun status of nabijheid tot mij? Noem hen — en verander dat deze week.",
  },
  {
    num: 5,
    en_title: "Cultural Intelligence",
    id_title: "Kecerdasan Budaya",
    nl_title: "Culturele Intelligentie",
    en_desc:
      "Cultural Intelligence (CQ) is the ability to adapt effectively to new cultural settings without losing your own grounded identity. It is the difference between a leader who is genuinely cross-cultural and one who simply exports their home-culture style wherever they go. High CQ does not mean becoming all things to all people — it means being secure enough in who you are to flex how you show up.",
    id_desc:
      "Kecerdasan Budaya (CQ) adalah kemampuan untuk beradaptasi secara efektif dengan pengaturan budaya baru tanpa kehilangan identitas dasar Anda sendiri. Ini adalah perbedaan antara pemimpin yang benar-benar lintas budaya dan yang hanya mengekspor gaya budaya asalnya ke mana pun mereka pergi. CQ tinggi tidak berarti menjadi semua hal bagi semua orang — itu berarti cukup aman dalam diri Anda untuk bisa fleksibel dalam cara Anda tampil.",
    nl_desc:
      "Culturele Intelligentie (CQ) is het vermogen om effectief te adapteren aan nieuwe culturele omgevingen zonder je eigen gewortelde identiteit te verliezen. Het is het verschil tussen een leider die oprecht intercultureel is en iemand die simpelweg zijn thuiscultuurstijl exporteert waar hij ook naartoe gaat. Hoge CQ betekent niet alles voor iedereen worden — het betekent voldoende veiligheid in wie je bent om te flexen hoe je verschijnt.",
    en_strong: [
      "You adjust your approach in different cultural settings — not because you are performing, but because you have genuinely learned what each setting requires.",
      "You can sit with ambiguity and cultural confusion without defaulting to judgement or withdrawal.",
      "You actively seek to understand before you seek to be understood — especially in new cross-cultural contexts.",
    ],
    id_strong: [
      "Anda menyesuaikan pendekatan Anda dalam pengaturan budaya yang berbeda — bukan karena Anda sedang berpura-pura, tetapi karena Anda benar-benar telah belajar apa yang dibutuhkan setiap pengaturan.",
      "Anda dapat duduk dengan ambiguitas dan kebingungan budaya tanpa langsung melakukan penilaian atau penarikan diri.",
      "Anda secara aktif berusaha memahami sebelum berusaha untuk dipahami — terutama dalam konteks lintas budaya yang baru.",
    ],
    nl_strong: [
      "Je past je aanpak aan in verschillende culturele settings — niet omdat je een voorstelling geeft, maar omdat je oprecht hebt geleerd wat elke setting vereist.",
      "Je kunt zitten met ambiguïteit en culturele verwarring zonder te vervallen in oordelen of terugtrekken.",
      "Je zoekt actief te begrijpen voordat je probeert begrepen te worden — met name in nieuwe interculturele contexten.",
    ],
    en_depletes: [
      "Interpreting difference as deficiency. When another culture's approach feels wrong rather than different, CQ collapses into cultural imperialism.",
      "Adapting your style but not your assumptions. You can speak slowly and make eye contact while still operating from entirely Western frameworks of time, hierarchy, and decision-making.",
    ],
    id_depletes: [
      "Menafsirkan perbedaan sebagai kekurangan. Ketika pendekatan budaya lain terasa salah daripada berbeda, CQ runtuh menjadi imperialisme budaya.",
      "Mengadaptasi gaya Anda tetapi tidak asumsi Anda. Anda dapat berbicara perlahan dan melakukan kontak mata sambil tetap beroperasi dari kerangka Barat yang sepenuhnya tentang waktu, hierarki, dan pengambilan keputusan.",
    ],
    nl_depletes: [
      "Verschil interpreteren als gebrek. Wanneer een andere cultuur's aanpak verkeerd aanvoelt in plaats van anders, klapt CQ in op cultureel imperialisme.",
      "Je stijl aanpassen maar niet je aannames. Je kunt langzaam spreken en oogcontact maken terwijl je nog steeds volledig vanuit Westerse frameworks van tijd, hiërarchie en besluitvorming opereert.",
    ],
    en_nextstep:
      "Identify one assumption you are currently making about how your team works best. Ask yourself: Is this a universal principle or a cultural preference? Then check it.",
    id_nextstep:
      "Identifikasi satu asumsi yang saat ini Anda buat tentang bagaimana tim Anda bekerja paling baik. Tanyakan pada diri sendiri: Apakah ini prinsip universal atau preferensi budaya? Kemudian periksalah.",
    nl_nextstep:
      "Identificeer één aanname die je momenteel maakt over hoe je team het beste werkt. Vraag jezelf af: Is dit een universeel principe of een culturele voorkeur? Controleer het dan.",
  },
];

// ─── KINGDOM LENS CONTENT ────────────────────────────────────────────────────

const KINGDOM_CONTENT = {
  en_heading: "The Kingdom Lens",
  id_heading: "Lensa Kerajaan",
  nl_heading: "Het Koninkrijksperspectief",
  en_intro:
    "In most organisational systems, influence is a means to an end — you build it so you can get things done, move faster, or secure your own position. The Kingdom turns this upside down. Influence is not a strategy; it is the inevitable fruit of a life poured out for others. The most influential leaders in Scripture were not influential because they sought it — they were influential because they served faithfully, suffered honestly, and held their identity in God rather than in their role.",
  id_intro:
    "Dalam kebanyakan sistem organisasi, pengaruh adalah sarana untuk mencapai tujuan — Anda membangunnya agar dapat menyelesaikan sesuatu, bergerak lebih cepat, atau mengamankan posisi Anda sendiri. Kerajaan membalikkan ini. Pengaruh bukan strategi; itu adalah buah yang tak terhindarkan dari hidup yang dicurahkan untuk orang lain. Pemimpin yang paling berpengaruh dalam Kitab Suci tidak berpengaruh karena mereka mencarinya — mereka berpengaruh karena mereka melayani dengan setia, menderita dengan jujur, dan memegang identitas mereka dalam Allah daripada dalam peran mereka.",
  nl_intro:
    "In de meeste organisatiesystemen is invloed een middel tot een doel — je bouwt het op zodat je dingen gedaan kunt krijgen, sneller kunt bewegen, of je eigen positie kunt veiligstellen. Het Koninkrijk keert dit om. Invloed is geen strategie; het is de onvermijdelijke vrucht van een leven dat voor anderen is uitgestort. De meest invloedrijke leiders in de Schrift waren niet invloedrijk omdat ze het zochten — ze waren invloedrijk omdat ze trouw dienden, eerlijk leden, en hun identiteit in God hielden in plaats van in hun rol.",
  en_body:
    "Joseph rose to influence not through political maneuvering but through consistent faithfulness in obscure, difficult assignments. Esther's influence at a Persian court came not from position alone but from the courage to sacrifice that position for her people. Daniel maintained influence across multiple empires not by adapting his convictions but by holding them with extraordinary grace. Paul's influence in Athens came from understanding the culture deeply enough to find the connecting point — not abandoning the gospel, but presenting it in a language the audience could hear.\n\nThe five pillars of this framework — Credibility, Connection, Communication, Consistency, and Cultural Intelligence — are not techniques for accumulating power. They are the natural characteristics of a person shaped by the Spirit: someone who tells the truth, sees people, speaks clearly, shows up reliably, and genuinely loves across difference. Influence built this way is durable. It does not depend on your title, your budget, or your charisma. It depends on your character — and character is formed in the small, unseen moments.",
  id_body:
    "Yusuf naik ke posisi berpengaruh bukan melalui manuver politik tetapi melalui kesetiaan yang konsisten dalam tugas-tugas yang samar dan sulit. Pengaruh Ester di istana Persia datang bukan dari posisi semata tetapi dari keberanian untuk mengorbankan posisi itu bagi bangsanya. Daniel mempertahankan pengaruh di berbagai kekaisaran bukan dengan mengadaptasi keyakinannya tetapi dengan memegang keyakinan itu dengan kasih karunia yang luar biasa. Pengaruh Paulus di Athena datang dari memahami budaya secara mendalam hingga cukup untuk menemukan titik penghubung — bukan meninggalkan Injil, tetapi menyajikannya dalam bahasa yang dapat didengar oleh pendengarnya.\n\nLima pilar kerangka ini — Kredibilitas, Koneksi, Komunikasi, Konsistensi, dan Kecerdasan Budaya — bukanlah teknik untuk mengumpulkan kekuasaan. Itu adalah karakteristik alami dari seseorang yang dibentuk oleh Roh: seseorang yang mengatakan kebenaran, melihat orang, berbicara dengan jelas, muncul dengan andal, dan sungguh-sungguh mengasihi melewati perbedaan. Pengaruh yang dibangun dengan cara ini tahan lama. Itu tidak bergantung pada jabatan, anggaran, atau karisma Anda. Itu bergantung pada karakter Anda — dan karakter dibentuk dalam momen-momen kecil yang tidak terlihat.",
  nl_body:
    "Jozef steeg naar invloed niet door politiek manoeuvreren maar door consistente trouw in obscure, moeilijke opdrachten. Ester's invloed aan een Perzisch hof kwam niet van positie alleen maar van de moed om die positie op te offeren voor haar volk. Daniël handhaafde invloed door meerdere rijken niet door zijn overtuigingen aan te passen maar door ze te houden met buitengewone genade. Paulus' invloed in Athene kwam van de cultuur diep genoeg begrijpen om het verbindingspunt te vinden — niet het evangelie verlaten, maar het presenteren in een taal die het publiek kon horen.\n\nDe vijf pijlers van dit kader — Geloofwaardigheid, Verbinding, Communicatie, Consistentie en Culturele Intelligentie — zijn geen technieken voor het vergaren van macht. Het zijn de natuurlijke kenmerken van een persoon gevormd door de Geest: iemand die de waarheid vertelt, mensen ziet, duidelijk spreekt, betrouwbaar verschijnt en oprecht liefheeft over verschil heen. Invloed die zo gebouwd is, is duurzaam. Het hangt niet af van je titel, je budget of je charisma. Het hangt af van je karakter — en karakter wordt gevormd in de kleine, ongeziene momenten.",
  en_prayer:
    "Lord, I want to lead with influence, not control. Shape in me the credibility that comes from faithfulness, not self-promotion. Deepen my connection to the people I lead. Give me words that land. Make me consistent — the same leader in the hard moments as in the easy ones. And grow in me the cultural intelligence to meet people where they actually are, not where I expect them to be. May my influence always serve Your purposes, not my own. Amen.",
  id_prayer:
    "Tuhan, saya ingin memimpin dengan pengaruh, bukan kendali. Bentuklah dalam diri saya kredibilitas yang datang dari kesetiaan, bukan promosi diri. Perdalam koneksi saya dengan orang-orang yang saya pimpin. Berikan saya kata-kata yang tepat sasaran. Jadikan saya konsisten — pemimpin yang sama dalam momen-momen sulit seperti dalam momen yang mudah. Dan tumbuhkanlah dalam diri saya kecerdasan budaya untuk menemui orang-orang di mana mereka sebenarnya berada, bukan di mana saya harapkan mereka berada. Semoga pengaruh saya selalu melayani tujuan-Mu, bukan tujuan saya sendiri. Amin.",
  nl_prayer:
    "Heer, ik wil leiden met invloed, niet met controle. Vorm in mij de geloofwaardigheid die voortkomt uit trouw, niet zelfpromotie. Verdiep mijn verbinding met de mensen die ik leid. Geef mij woorden die landen. Maak mij consistent — dezelfde leider in de moeilijke momenten als in de gemakkelijke. En laat groeien in mij de culturele intelligentie om mensen te ontmoeten waar ze werkelijk zijn, niet waar ik verwacht dat ze zijn. Moge mijn invloed altijd Uw doeleinden dienen, niet de mijne. Amen.",
};

// ─── PROPS ───────────────────────────────────────────────────────────────────

type Props = { userPathway: string | null; isSaved: boolean };

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function InfluentialLeadershipClient({
  userPathway,
  isSaved: initialSaved,
}: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [ratings, setRatings] = useState<number[]>([3, 3, 3, 3, 3]);
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  const [showPrayer, setShowPrayer] = useState(false);

  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("influential-leadership-framework");
      setSaved(true);
    });
  }

  function handleRating(pillarIndex: number, value: number) {
    setRatings((prev) => {
      const next = [...prev];
      next[pillarIndex] = value;
      return next;
    });
  }

  const navy = "oklch(22% 0.10 260)";
  const orange = "oklch(65% 0.15 45)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const bodyText = "oklch(38% 0.05 260)";

  const pillarLabels = [
    t("Credibility", "Kredibilitas", "Geloofwaardigheid"),
    t("Connection", "Koneksi", "Verbinding"),
    t("Communication", "Komunikasi", "Communicatie"),
    t("Consistency", "Konsistensi", "Consistentie"),
    t("Cultural Intelligence", "Kecerdasan Budaya", "Culturele Intelligentie"),
  ];

  const totalScore = ratings.reduce((a, b) => a + b, 0);
  const maxScore = 25;

  function profileLabel(total: number): { en: string; id: string; nl: string } {
    if (total <= 10) return { en: "Early Stage", id: "Tahap Awal", nl: "Beginfase" };
    if (total <= 15) return { en: "Developing", id: "Berkembang", nl: "Groeiend" };
    if (total <= 20) return { en: "Established", id: "Mapan", nl: "Gevestigd" };
    return { en: "Influential", id: "Berpengaruh", nl: "Invloedrijk" };
  }

  const label = profileLabel(totalScore);
  const profileLabelText = lang === "en" ? label.en : lang === "id" ? label.id : label.nl;

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>

      {/* ── LANGUAGE TOGGLE ──────────────────────────────────────────────── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: lightGray,
          borderBottom: "1px solid oklch(90% 0.01 80)",
          padding: "10px 24px",
          display: "flex",
          gap: 8,
          justifyContent: "flex-end",
        }}
      >
        {(["en", "id", "nl"] as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={{
              padding: "4px 14px",
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              background: lang === l ? navy : "transparent",
              color: lang === l ? offWhite : bodyText,
            }}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{ background: navy, padding: "80px 24px 72px", textAlign: "center" }}>
        <p
          style={{
            color: orange,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          {t("Leadership", "Kepemimpinan", "Leiderschap")}
        </p>
        <h1
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "clamp(28px, 5vw, 52px)",
            fontWeight: 800,
            color: offWhite,
            margin: "0 auto 20px",
            maxWidth: 780,
            lineHeight: 1.15,
          }}
        >
          {t(
            "The Influential Leadership Framework",
            "Kerangka Kepemimpinan Berpengaruh",
            "Het Invloedrijk Leiderschapsraamwerk"
          )}
        </h1>
        <p
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: "clamp(17px, 2.5vw, 22px)",
            color: "oklch(85% 0.03 80)",
            maxWidth: 640,
            margin: "0 auto 12px",
            lineHeight: 1.65,
            fontStyle: "italic",
          }}
        >
          {t(
            "Authority is a position. Influence is a relationship. One is given; the other is grown.",
            "Otoritas adalah posisi. Pengaruh adalah hubungan. Satu diberikan; yang lain ditumbuhkan.",
            "Autoriteit is een positie. Invloed is een relatie. De één wordt gegeven; de ander wordt gekweekt."
          )}
        </p>
        <p
          style={{
            color: "oklch(72% 0.04 80)",
            fontSize: 14,
            maxWidth: 580,
            margin: "0 auto 36px",
            lineHeight: 1.7,
          }}
        >
          {t(
            "Five pillars that determine whether people follow you because they have to — or because they choose to. Assess where you stand, identify what to strengthen, and build influence that outlasts any title.",
            "Lima pilar yang menentukan apakah orang mengikuti Anda karena harus — atau karena mereka memilih. Nilai posisi Anda, identifikasi apa yang perlu diperkuat, dan bangun pengaruh yang melampaui jabatan apapun.",
            "Vijf pijlers die bepalen of mensen je volgen omdat ze moeten — of omdat ze kiezen. Beoordeel waar je staat, identificeer wat je moet versterken, en bouw invloed die elke titel overleeft."
          )}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={handleSave}
            disabled={saved || isPending}
            style={{
              padding: "12px 28px",
              borderRadius: 6,
              border: "none",
              cursor: saved ? "default" : "pointer",
              fontFamily: "Montserrat, sans-serif",
              fontSize: 14,
              fontWeight: 700,
              background: saved ? "oklch(55% 0.08 260)" : orange,
              color: offWhite,
            }}
          >
            {saved
              ? t("Saved", "Tersimpan", "Opgeslagen")
              : t("Save to Dashboard", "Simpan ke Dasbor", "Opslaan in Dashboard")}
          </button>
          <Link
            href="/resources"
            style={{
              padding: "12px 28px",
              borderRadius: 6,
              border: "1px solid oklch(50% 0.05 260)",
              fontFamily: "Montserrat, sans-serif",
              fontSize: 14,
              fontWeight: 600,
              color: offWhite,
              textDecoration: "none",
            }}
          >
            {t("All Resources", "Semua Sumber", "Alle Bronnen")}
          </Link>
        </div>
      </div>

      {/* ── INTRO: INFLUENCE VS AUTHORITY ────────────────────────────────── */}
      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 26,
            fontWeight: 800,
            color: navy,
            marginBottom: 24,
          }}
        >
          {t("Influence is not authority.", "Pengaruh bukan otoritas.", "Invloed is geen autoriteit.")}
        </h2>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.8, marginBottom: 20 }}>
          {t(
            "Positional authority tells people what to do. Influence moves people to want to do it. Authority is assigned by an organisation chart. Influence is built in the daily texture of how you treat people, whether you do what you say, whether you understand their world, and whether they trust that you have their interests at heart — not just your own agenda.",
            "Otoritas posisional memberi tahu orang apa yang harus dilakukan. Pengaruh menggerakkan orang untuk ingin melakukannya. Otoritas ditugaskan oleh bagan organisasi. Pengaruh dibangun dalam tekstur keseharian tentang bagaimana Anda memperlakukan orang, apakah Anda melakukan apa yang Anda katakan, apakah Anda memahami dunia mereka, dan apakah mereka percaya bahwa Anda memiliki kepentingan mereka di hati — bukan hanya agenda Anda sendiri.",
            "Positionele autoriteit vertelt mensen wat ze moeten doen. Invloed beweegt mensen om het te willen doen. Autoriteit wordt toegewezen door een organisatieschema. Invloed wordt gebouwd in de dagelijkse textuur van hoe je mensen behandelt, of je doet wat je zegt, of je hun wereld begrijpt, en of ze vertrouwen dat je hun belangen op het hart draagt — niet alleen je eigen agenda."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.8, marginBottom: 20 }}>
          {t(
            "In cross-cultural contexts, this distinction is even sharper. Authority can cross a border in a document. Influence cannot. You have to build it from scratch in every cultural context — and the five pillars below are what that building looks like.",
            "Dalam konteks lintas budaya, perbedaan ini bahkan lebih tajam. Otoritas dapat melewati batas dalam sebuah dokumen. Pengaruh tidak bisa. Anda harus membangunnya dari awal dalam setiap konteks budaya — dan lima pilar di bawah ini adalah seperti apa pembangunan itu.",
            "In interculturele contexten is dit onderscheid nog scherper. Autoriteit kan een grens passeren in een document. Invloed niet. Je moet het opnieuw opbouwen in elke culturele context — en de vijf pijlers hieronder laten zien hoe dat eruit ziet."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.8 }}>
          {t(
            "Use this framework as a self-assessment tool. For each pillar, read the description, review what strong looks like, note what depletes it — then rate yourself honestly on a scale of 1 to 5. At the end, your Influence Profile will show you where to focus your growth.",
            "Gunakan kerangka ini sebagai alat penilaian diri. Untuk setiap pilar, baca deskripsinya, tinjau seperti apa tampilannya ketika kuat, catat apa yang menguras — kemudian nilai diri Anda dengan jujur pada skala 1 hingga 5. Di akhir, Profil Pengaruh Anda akan menunjukkan di mana harus memfokuskan pertumbuhan Anda.",
            "Gebruik dit kader als zelfevaluatie-instrument. Lees voor elke pijler de beschrijving, bekijk hoe kracht eruitziet, noteer wat het uitput — beoordeelr jezelf dan eerlijk op een schaal van 1 tot 5. Aan het einde toont je Invloedprofiel je waar je groei op te richten."
          )}
        </p>
      </div>

      {/* ── FIVE PILLARS ─────────────────────────────────────────────────── */}
      {PILLARS.map((pillar, idx) => {
        const isEven = idx % 2 === 0;
        const bg = isEven ? lightGray : offWhite;
        const title = lang === "en" ? pillar.en_title : lang === "id" ? pillar.id_title : pillar.nl_title;
        const desc = lang === "en" ? pillar.en_desc : lang === "id" ? pillar.id_desc : pillar.nl_desc;
        const strong = lang === "en" ? pillar.en_strong : lang === "id" ? pillar.id_strong : pillar.nl_strong;
        const depletes = lang === "en" ? pillar.en_depletes : lang === "id" ? pillar.id_depletes : pillar.nl_depletes;
        const nextstep = lang === "en" ? pillar.en_nextstep : lang === "id" ? pillar.id_nextstep : pillar.nl_nextstep;
        const currentRating = ratings[idx];

        return (
          <div key={pillar.num} style={{ background: bg, padding: "72px 24px" }}>
            <div style={{ maxWidth: 760, margin: "0 auto" }}>

              {/* Pillar header */}
              <div style={{ display: "flex", gap: 24, alignItems: "flex-start", marginBottom: 28 }}>
                <div
                  style={{
                    fontFamily: "Cormorant Garamond, Georgia, serif",
                    fontSize: "clamp(44px, 8vw, 60px)",
                    fontWeight: 700,
                    color: orange,
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  {pillar.num}
                </div>
                <div style={{ paddingTop: 8 }}>
                  <p
                    style={{
                      color: orange,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    {t(
                      `Pillar ${pillar.num} of 5`,
                      `Pilar ${pillar.num} dari 5`,
                      `Pijler ${pillar.num} van 5`
                    )}
                  </p>
                  <h2
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "clamp(22px, 4vw, 32px)",
                      fontWeight: 800,
                      color: navy,
                      margin: 0,
                    }}
                  >
                    {title}
                  </h2>
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.8, marginBottom: 36 }}>
                {desc}
              </p>

              {/* When it's strong */}
              <div
                style={{
                  background: navy,
                  borderRadius: 12,
                  padding: "28px 32px",
                  marginBottom: 24,
                }}
              >
                <h3
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: orange,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 16,
                  }}
                >
                  {t("When it's strong", "Ketika kuat", "Wanneer het sterk is")}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {strong.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span
                        style={{
                          color: orange,
                          fontWeight: 700,
                          fontSize: 16,
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        ✓
                      </span>
                      <p style={{ fontSize: 15, color: "oklch(88% 0.03 80)", lineHeight: 1.7, margin: 0 }}>
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* What depletes it */}
              <div
                style={{
                  border: `2px solid oklch(88% 0.01 80)`,
                  borderRadius: 12,
                  padding: "28px 32px",
                  marginBottom: 32,
                }}
              >
                <h3
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: bodyText,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 16,
                  }}
                >
                  {t("What depletes it", "Apa yang menguras", "Wat het uitput")}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {depletes.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span
                        style={{
                          color: "oklch(55% 0.12 20)",
                          fontWeight: 700,
                          fontSize: 16,
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        ✕
                      </span>
                      <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.7, margin: 0 }}>
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Self-rating slider */}
              <div
                style={{
                  background: offWhite,
                  borderRadius: 12,
                  padding: "28px 32px",
                  marginBottom: 24,
                  border: isEven ? "1px solid oklch(90% 0.01 80)" : "none",
                  boxShadow: "0 2px 12px oklch(22% 0.10 260 / 0.06)",
                }}
              >
                <h3
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 15,
                    fontWeight: 700,
                    color: navy,
                    marginBottom: 8,
                  }}
                >
                  {t("Rate yourself on", "Nilai diri Anda pada", "Beoordeel jezelf op")}{" "}
                  <span style={{ color: orange }}>{title}</span>
                </h3>
                <p style={{ fontSize: 13, color: bodyText, marginBottom: 20 }}>
                  {t(
                    "1 = Not yet developed · 5 = Consistently strong",
                    "1 = Belum berkembang · 5 = Konsisten kuat",
                    "1 = Nog niet ontwikkeld · 5 = Consequent sterk"
                  )}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={currentRating}
                    onChange={(e) => handleRating(idx, Number(e.target.value))}
                    style={{
                      flex: 1,
                      height: 6,
                      accentColor: orange,
                      cursor: "pointer",
                    }}
                  />
                  <div
                    style={{
                      fontFamily: "Cormorant Garamond, Georgia, serif",
                      fontSize: 36,
                      fontWeight: 700,
                      color: orange,
                      minWidth: 32,
                      textAlign: "center",
                      lineHeight: 1,
                    }}
                  >
                    {currentRating}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 6,
                  }}
                >
                  <span style={{ fontSize: 11, color: bodyText, fontWeight: 600 }}>
                    1
                  </span>
                  <span style={{ fontSize: 11, color: bodyText, fontWeight: 600 }}>
                    2
                  </span>
                  <span style={{ fontSize: 11, color: bodyText, fontWeight: 600 }}>
                    3
                  </span>
                  <span style={{ fontSize: 11, color: bodyText, fontWeight: 600 }}>
                    4
                  </span>
                  <span style={{ fontSize: 11, color: bodyText, fontWeight: 600 }}>
                    5
                  </span>
                </div>
              </div>

              {/* One next step */}
              <div
                style={{
                  background: `oklch(65% 0.15 45 / 0.08)`,
                  borderLeft: `4px solid ${orange}`,
                  borderRadius: "0 8px 8px 0",
                  padding: "20px 24px",
                }}
              >
                <p
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    color: orange,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  {t("One next step", "Satu langkah berikutnya", "Één volgende stap")}
                </p>
                <p style={{ fontSize: 15, color: navy, lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
                  {nextstep}
                </p>
              </div>

            </div>
          </div>
        );
      })}

      {/* ── INFLUENCE PROFILE ────────────────────────────────────────────── */}
      <div style={{ background: navy, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p
            style={{
              color: orange,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            {t("Your Results", "Hasil Anda", "Jouw Resultaten")}
          </p>
          <h2
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 800,
              color: offWhite,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            {t("Your Influence Profile", "Profil Pengaruh Anda", "Jouw Invloedprofiel")}
          </h2>
          <p
            style={{
              color: "oklch(80% 0.03 80)",
              fontSize: 15,
              textAlign: "center",
              maxWidth: 520,
              margin: "0 auto 48px",
              lineHeight: 1.7,
            }}
          >
            {t(
              "Based on your self-assessment across the five pillars.",
              "Berdasarkan penilaian diri Anda di lima pilar.",
              "Gebaseerd op jouw zelfevaluatie over de vijf pijlers."
            )}
          </p>

          {/* Bar chart */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 48 }}>
            {PILLARS.map((pillar, idx) => {
              const label = lang === "en" ? pillar.en_title : lang === "id" ? pillar.id_title : pillar.nl_title;
              const score = ratings[idx];
              const pct = (score / 5) * 100;
              return (
                <div key={pillar.num}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: 14,
                        fontWeight: 600,
                        color: offWhite,
                      }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        fontFamily: "Cormorant Garamond, Georgia, serif",
                        fontSize: 22,
                        fontWeight: 700,
                        color: orange,
                      }}
                    >
                      {score}/5
                    </span>
                  </div>
                  <div
                    style={{
                      height: 10,
                      background: "oklch(35% 0.08 260)",
                      borderRadius: 5,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: score >= 4 ? orange : score >= 3 ? "oklch(70% 0.12 60)" : "oklch(60% 0.10 240)",
                        borderRadius: 5,
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary score */}
          <div
            style={{
              background: "oklch(28% 0.08 260)",
              borderRadius: 16,
              padding: "32px 36px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "oklch(72% 0.04 80)",
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              {t("Total Score", "Skor Total", "Totaalscore")}
            </p>
            <div
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontSize: 64,
                fontWeight: 700,
                color: orange,
                lineHeight: 1,
                marginBottom: 8,
              }}
            >
              {totalScore}
              <span
                style={{
                  fontSize: 28,
                  color: "oklch(60% 0.05 260)",
                }}
              >
                /{maxScore}
              </span>
            </div>
            <div
              style={{
                display: "inline-block",
                background: orange,
                color: offWhite,
                fontFamily: "Montserrat, sans-serif",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "6px 18px",
                borderRadius: 20,
                marginBottom: 20,
              }}
            >
              {profileLabelText}
            </div>
            <p
              style={{
                color: "oklch(75% 0.04 80)",
                fontSize: 14,
                lineHeight: 1.7,
                maxWidth: 500,
                margin: "0 auto",
              }}
            >
              {totalScore <= 10 &&
                t(
                  "You're at the beginning of building your influence toolkit. Pick the lowest-scoring pillar and focus there first — one deliberate practice at a time.",
                  "Anda berada di awal membangun perangkat pengaruh Anda. Pilih pilar dengan skor terendah dan fokus di sana terlebih dahulu — satu praktik yang disengaja pada satu waktu.",
                  "Je staat aan het begin van het opbouwen van je invloedstoolkit. Kies de pijler met de laagste score en focus daar eerst — één doelbewuste oefening tegelijk."
                )}
              {totalScore > 10 &&
                totalScore <= 15 &&
                t(
                  "You have real foundations in some pillars but visible gaps in others. The bars above show you exactly where to direct your energy.",
                  "Anda memiliki fondasi nyata di beberapa pilar tetapi kesenjangan yang terlihat di pilar lainnya. Batang-batang di atas menunjukkan kepada Anda dengan tepat di mana harus mengarahkan energi Anda.",
                  "Je hebt echte fundamenten in sommige pijlers maar zichtbare lacunes in andere. De staven hierboven laten je precies zien waar je energie op te richten."
                )}
              {totalScore > 15 &&
                totalScore <= 20 &&
                t(
                  "You're an established influence-builder. The next level is not doing more of what's already strong — it's elevating your weakest pillar to match.",
                  "Anda adalah pembangun pengaruh yang mapan. Level berikutnya bukan melakukan lebih banyak dari yang sudah kuat — melainkan meningkatkan pilar terlemah Anda untuk menyeimbangi.",
                  "Je bent een gevestigde invloedsbouwer. Het volgende niveau is niet meer doen van wat al sterk is — maar je zwakste pijler optillen om te matchen."
                )}
              {totalScore > 20 &&
                t(
                  "You're operating with mature, consistent influence. The question now is: who are you developing to build the same kind of influence in the next generation?",
                  "Anda beroperasi dengan pengaruh yang matang dan konsisten. Pertanyaan sekarang adalah: siapa yang Anda kembangkan untuk membangun jenis pengaruh yang sama di generasi berikutnya?",
                  "Je opereert met volwassen, consistente invloed. De vraag nu is: wie ontwikkel je om dezelfde invloed op te bouwen in de volgende generatie?"
                )}
            </p>
          </div>
        </div>
      </div>

      {/* ── KINGDOM LENS ─────────────────────────────────────────────────── */}
      <div style={{ padding: "80px 24px", maxWidth: 760, margin: "0 auto" }}>
        <p
          style={{
            color: orange,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          {t("Faith & Leadership", "Iman & Kepemimpinan", "Geloof & Leiderschap")}
        </p>
        <h2
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "clamp(24px, 4vw, 34px)",
            fontWeight: 800,
            color: navy,
            marginBottom: 32,
            textAlign: "center",
          }}
        >
          {lang === "en"
            ? KINGDOM_CONTENT.en_heading
            : lang === "id"
            ? KINGDOM_CONTENT.id_heading
            : KINGDOM_CONTENT.nl_heading}
        </h2>

        {/* Verse 1 */}
        <div
          style={{
            background: lightGray,
            borderRadius: 12,
            padding: "28px 32px",
            marginBottom: 28,
          }}
        >
          <p
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontSize: 20,
              lineHeight: 1.7,
              color: navy,
              fontStyle: "italic",
              marginBottom: 12,
            }}
          >
            {lang === "en"
              ? `"${VERSES["mark-10-42-45"].en.slice(0, 200)}…"`
              : lang === "id"
              ? `"${VERSES["mark-10-42-45"].id.slice(0, 220)}…"`
              : `"${VERSES["mark-10-42-45"].nl.slice(0, 210)}…"`}
          </p>
          <button
            onClick={() => setActiveVerse("mark-10-42-45")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: orange,
              fontWeight: 700,
              fontSize: 14,
              fontFamily: "Montserrat, sans-serif",
              textDecoration: "underline dotted",
              padding: 0,
            }}
          >
            {t("Mark 10:42–45 (NIV)", "Markus 10:42–45 (TB)", "Marcus 10:42–45 (NBV)")}
          </button>
        </div>

        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.8, marginBottom: 24 }}>
          {lang === "en"
            ? KINGDOM_CONTENT.en_intro
            : lang === "id"
            ? KINGDOM_CONTENT.id_intro
            : KINGDOM_CONTENT.nl_intro}
        </p>

        {/* Body — split on \n\n */}
        {(lang === "en"
          ? KINGDOM_CONTENT.en_body
          : lang === "id"
          ? KINGDOM_CONTENT.id_body
          : KINGDOM_CONTENT.nl_body
        )
          .split("\n\n")
          .map((para, i) => (
            <p key={i} style={{ fontSize: 16, color: bodyText, lineHeight: 1.8, marginBottom: 20 }}>
              {para}
            </p>
          ))}

        {/* Verse 2 */}
        <div
          style={{
            background: lightGray,
            borderRadius: 12,
            padding: "28px 32px",
            marginBottom: 36,
          }}
        >
          <p
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontSize: 20,
              lineHeight: 1.7,
              color: navy,
              fontStyle: "italic",
              marginBottom: 12,
            }}
          >
            {lang === "en"
              ? `"${VERSES["luke-16-10"].en}"`
              : lang === "id"
              ? `"${VERSES["luke-16-10"].id}"`
              : `"${VERSES["luke-16-10"].nl}"`}
          </p>
          <button
            onClick={() => setActiveVerse("luke-16-10")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: orange,
              fontWeight: 700,
              fontSize: 14,
              fontFamily: "Montserrat, sans-serif",
              textDecoration: "underline dotted",
              padding: 0,
            }}
          >
            {t("Luke 16:10 (NIV)", "Lukas 16:10 (TB)", "Lucas 16:10 (NBV)")}
          </button>
        </div>

        {/* Prayer prompt */}
        <div
          style={{
            border: `2px solid ${orange}`,
            borderRadius: 12,
            padding: "32px 36px",
          }}
        >
          <button
            onClick={() => setShowPrayer(!showPrayer)}
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <span
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 16,
                fontWeight: 700,
                color: navy,
              }}
            >
              {t("A prayer for influential leadership", "Sebuah doa untuk kepemimpinan berpengaruh", "Een gebed voor invloedrijk leiderschap")}
            </span>
            <span
              style={{
                color: orange,
                fontSize: 20,
                fontWeight: 700,
                transition: "transform 0.2s",
                transform: showPrayer ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              ↓
            </span>
          </button>
          {showPrayer && (
            <p
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontSize: 18,
                lineHeight: 1.8,
                color: bodyText,
                fontStyle: "italic",
                marginTop: 24,
                marginBottom: 0,
              }}
            >
              {lang === "en"
                ? KINGDOM_CONTENT.en_prayer
                : lang === "id"
                ? KINGDOM_CONTENT.id_prayer
                : KINGDOM_CONTENT.nl_prayer}
            </p>
          )}
        </div>
      </div>

      {/* ── FOOTER CTA ───────────────────────────────────────────────────── */}
      <div
        style={{
          background: navy,
          padding: "72px 24px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 28,
            fontWeight: 800,
            color: offWhite,
            marginBottom: 16,
          }}
        >
          {t("Keep Growing", "Terus Bertumbuh", "Blijf Groeien")}
        </h2>
        <p
          style={{
            color: "oklch(80% 0.03 80)",
            fontSize: 16,
            lineHeight: 1.75,
            maxWidth: 540,
            margin: "0 auto 32px",
          }}
        >
          {t(
            "Explore more frameworks for leading with depth across cultural boundaries.",
            "Jelajahi lebih banyak kerangka untuk memimpin dengan kedalaman melintasi batas budaya.",
            "Verken meer kaders voor leidinggeven met diepgang over culturele grenzen heen."
          )}
        </p>
        <Link
          href="/resources"
          style={{
            display: "inline-block",
            padding: "14px 32px",
            background: orange,
            color: offWhite,
            borderRadius: 6,
            fontFamily: "Montserrat, sans-serif",
            fontSize: 15,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          {t("Browse All Resources", "Jelajahi Semua Sumber", "Bekijk Alle Bronnen")}
        </Link>
      </div>

      {/* ── VERSE POPUP ──────────────────────────────────────────────────── */}
      {activeVerse && VERSES[activeVerse] && (
        <div
          onClick={() => setActiveVerse(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "oklch(10% 0.05 260 / 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: offWhite,
              borderRadius: 16,
              padding: "40px 36px",
              maxWidth: 560,
              width: "100%",
            }}
          >
            <p
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontSize: 20,
                lineHeight: 1.7,
                color: navy,
                fontStyle: "italic",
                marginBottom: 16,
              }}
            >
              "
              {lang === "en"
                ? VERSES[activeVerse].en
                : lang === "id"
                ? VERSES[activeVerse].id
                : VERSES[activeVerse].nl}
              "
            </p>
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 13,
                fontWeight: 700,
                color: orange,
                letterSpacing: "0.08em",
                marginBottom: 24,
              }}
            >
              — {VERSES[activeVerse].ref}{" "}
              {lang === "en" ? "(NIV)" : lang === "id" ? "(TB)" : "(NBV)"}
            </p>
            <button
              onClick={() => setActiveVerse(null)}
              style={{
                padding: "10px 24px",
                background: navy,
                color: offWhite,
                border: "none",
                borderRadius: 6,
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              {t("Close", "Tutup", "Sluiten")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
