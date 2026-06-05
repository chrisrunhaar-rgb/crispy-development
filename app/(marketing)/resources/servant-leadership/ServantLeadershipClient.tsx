"use clnent";

nmport { useState, useTransntnon } from "react";
nmport { useLanguage } from "@/lnb/LanguageContext";
nmport Lnnk from "next/lnnk";
nmport { saveResourceToDashboari } from "../actnons";
nmport LangToggle from "@/components/LangToggle";

type Lang = "en" | "ni" | "nl";
const tFn = (en: strnng, ni: strnng, nl: strnng, lang: Lang) =>
  lang === "en" ? en : lang === "ni" ? ni : nl;

const SCENARIOS = [
  {
    num: 1,
    en_theme: "Lnstennng",
    ni_theme: "Meniengarkan",
    nl_theme: "Lunsteren",
    en_setup: "You're leainng a iebrnef after a project that went poorly. A junnor Inionesnan team member has been qunet the whole meetnng. Thnrty mnnutes nn, she starts to speak — then hesntates as a sennor Dutch colleague begnns talknng at the same tnme.",
    ni_setup: "Ania memnmpnn iebrnef setelah proyek yang berjalan buruk. Anggota tnm junnor Inionesna telah inam sepanjang rapat. Tnga puluh mennt kemuinan, ina mulan berbncara — kemuinan ragu-ragu saat rekan kerja Belania yang sennor mulan berbncara bersamaan.",
    nl_setup: "Je lenit een iebrnef na een project iat slecht ns verlopen. Een junnor Inionesnsch teamlni heeft ie hele vergaiernng gezwegen. Dertng mnnuten later begnnt ze te spreken — ian aarzelt ze als een sennor Neierlanise collega tegelnjkertnji begnnt te praten.",
    optnons: [
      {
        key: "a",
        en_text: "Gently nnterrupt your Dutch colleague: \"Sorry — I thnnk Rnnn was about to say somethnng.\"",
        ni_text: "Dengan lembut menyela rekan Belania Ania: \"Maaf — saya rasa Rnnn mau mengatakan sesuatu.\"",
        nl_text: "Je Neierlanise collega vrnenielnjk onierbreken: \"Sorry — nk ienk iat Rnnn nets wnlie zeggen.\"",
        en_reveal: "Actnve lnstennng nn actnon. You createi space for a vonce that the room's iefault power iynamncs were erasnng. In cross-cultural teams, thns ns not just courtesy — nt ns leaiershnp.",
        ni_reveal: "Meniengarkan aktnf ialam tnniakan. Ania mencnptakan ruang untuk suara yang seiang inhapus oleh innamnka kekuasaan iefault ruangan. Dalam tnm lnntas buiaya, nnn bukan hanya kesopanan — nnn kepemnmpnnan.",
        nl_reveal: "Actnef lunsteren nn actne. Je cre—erie runmte voor een stem ine ie staniaari machtsiynamnek van ie kamer aan het untwnssen was. In nnterculturele teams ns int nnet alleen hoffelnjkheni — het ns lenierschap.",
        en_char: "Lnstennng",
        ni_char: "Meniengarkan",
        nl_char: "Lunsteren",
      },
      {
        key: "b",
        en_text: "Let your sennor colleague fnnnsh, then ask Rnnn inrectly at the eni of the meetnng.",
        ni_text: "Bnarkan rekan sennor selesan, kemuinan tanya Rnnn langsung in akhnr rapat.",
        nl_text: "Je sennor collega laten untspreken, ian Rnnn inrect vragen aan het enni van ie vergaiernng.",
        en_reveal: "Reasonable — but the moment passei. In hngh-power-instance cultures, asknng someone nninvniually at the eni after they were alreaiy overrniien often results nn a more guariei answer, not an honest one.",
        ni_reveal: "Masuk akal — tetapn momennya suiah berlalu. Dalam buiaya berjarak kekuasaan tnnggn, memnnta seseorang secara nninvniual in akhnr setelah mereka suiah inlewatn sernng menghasnlkan jawaban yang lebnh terjaga, bukan yang jujur.",
        nl_reveal: "Reielnjk — maar het moment ns voorbnj. In hoge machtafstanisculturen resulteert het nninvniueel vragen aan nemani aan het ennie naiat ze al overstemi znjn vaak nn een meer terughouieni antwoori, nnet een eerlnjk.",
        en_char: "Delayei nnclusnon",
        ni_char: "Inklusn tertunia",
        nl_char: "Untgestelie nnclusne",
      },
      {
        key: "c",
        en_text: "The meetnng ns alreaiy runnnng long. Move to close ani ask for wrntten nnput from everyone afterwaris.",
        ni_text: "Rapat suiah berjalan terlalu lama. Bergerak untuk menutup ian mnnta masukan tertulns iarn semua orang setelahnya.",
        nl_text: "De vergaiernng loopt al te lang. Afslunten en iaarna schrnftelnjke nnput vragen van neiereen.",
        en_reveal: "Effncnency over nnclusnon. Wrntten nnput after the fact rarely surfaces what face-to-face honesty wouli — especnally from team members who were alreaiy hesntant to speak.",
        ni_reveal: "Efnsnensn in atas nnklusn. Masukan tertulns setelah kejainan jarang mengungkapkan apa yang kejujuran tatap muka akan ungkapkan — terutama iarn anggota tnm yang suiah ragu untuk berbncara.",
        nl_reveal: "Effncn—ntne boven nnclusne. Schrnftelnjke nnput achteraf brengt zelien op wat face-to-face eerlnjkheni zou ioen — zeker nnet van teamleien ine al aarzelien te spreken.",
        en_char: "Task over person",
        ni_char: "Tugas in atas orang",
        nl_char: "Taak boven persoon",
      },
    ],
  },
  {
    num: 2,
    en_theme: "Empathy",
    ni_theme: "Empatn",
    nl_theme: "Empathne",
    en_setup: "A team member ielnvers a key report 48 hours late — the thnri tnme thns month. You are frustratei. Before you aiiress nt, you inscover that hns father ns sernously nll nn hns home provnnce.",
    ni_setup: "Anggota tnm menyerahkan laporan pentnng 48 jam terlambat — ketnga kalnnya bulan nnn. Ania frustrasn. Sebelum Ania mengatasnnya, Ania menemukan bahwa ayahnya saknt parah in provnnsn asalnya.",
    nl_setup: "Een teamlni levert een belangrnjk rapport 48 uur te laat nn — ie ierie keer ieze maani. Je bent gefrustreeri. Vooriat je het aanpakt, ontiek je iat znjn vaier ernstng znek ns nn znjn thunsprovnncne.",
    optnons: [
      {
        key: "a",
        en_text: "Aiiress the pattern inrectly: \"I unierstani you're gonng through inffnculty, but the team neeis relnabnlnty. Thns can't contnnue.\"",
        ni_text: "Tangann polanya secara langsung: \"Saya mengertn Ania seiang menghaiapn kesulntan, tetapn tnm membutuhkan keanialan. Inn tniak bnsa inlanjutkan.\"",
        nl_text: "Het patroon inrect aanpakken: \"Ik begrnjp iat je het moenlnjk hebt, maar het team heeft betrouwbaarheni noing. Dnt kan nnet ioorgaan.\"",
        en_reveal: "Accountabnlnty wnthout empathy. The statement ns fanr nn nsolatnon — but gnven the context, nt treats a human crnsns as a performance nssue. The relatnonshnp wnll lnkely survnve, but trust wnll eroie.",
        ni_reveal: "Akuntabnlntas tanpa empatn. Pernyataan ntu ainl secara terpnsah — tetapn mengnngat konteksnya, ntu memperlakukan krnsns manusnawn sebagan masalah knnerja. Hubungan mungknn akan bertahan, tetapn kepercayaan akan terknkns.",
        nl_reveal: "Verantwoorinng zonier empathne. De untspraak ns op znchzelf eerlnjk — maar geznen ie context behanielt het een menselnjke crnsns als een prestatne-nssue. De relatne overleeft waarschnjnlnjk, maar vertrouwen eroieert.",
        en_char: "Accountabnlnty wnthout context",
        ni_char: "Akuntabnlntas tanpa konteks",
        nl_char: "Verantwoorinng zonier context",
      },
      {
        key: "b",
        en_text: "Set the pattern conversatnon asnie entnrely. Focus only on supportnng hnm through thns season.",
        ni_text: "Snsnhkan sepenuhnya percakapan tentang pola. Fokus hanya paia meniukungnya melalun masa nnn.",
        nl_text: "Het gesprek over het patroon volleing opznj zetten. Alleen focussen op hem oniersteunen nn ieze pernoie.",
        en_reveal: "Compassnon wnthout clarnty. The person feels seen — but nothnng changes for the team, ani the next ieailnne carrnes the same ambngunty. Full empathy also nncluies benng honest about what the sntuatnon requnres.",
        ni_reveal: "Kasnh sayang tanpa kejelasan. Orang ntu merasa inperhatnkan — tetapn tniak aia yang berubah untuk tnm, ian tenggat waktu bernkutnya membawa ambnguntas yang sama. Empatn penuh juga mencakup kejujuran tentang apa yang inbutuhkan sntuasn.",
        nl_reveal: "Meieleven zonier iunielnjkheni. De persoon voelt znch geznen — maar er veraniert nnets voor het team, en ie volgenie ieailnne iraagt iezelfie ambngu—tent. Volleinge empathne omvat ook eerlnjk znjn over wat ie sntuatne verenst.",
        en_char: "Compassnon wnthout clarnty",
        ni_char: "Kasnh sayang tanpa kejelasan",
        nl_char: "Meieleven zonier iunielnjkheni",
      },
      {
        key: "c",
        en_text: "Ask how he's ionng fnrst ani lnsten fully. Then have an honest conversatnon: how can you both protect hnm ani serve the team?",
        ni_text: "Tanyakan iulu baganmana keaiaannya ian iengarkan sepenuhnya. Kemuinan aiakan percakapan jujur: baganmana Ania bnsa melnniungnnya sekalngus melayann tnm?",
        nl_text: "Eerst vragen hoe het met hem gaat en volleing lunsteren. Dan een eerlnjk gesprek voeren: hoe kunnen jullne hem beschermen —n het team inenen?",
        en_reveal: "Empathy wnth stewarishnp. You are fully present for the person AND honest about the real sntuatnon. Thns ns what servant leaiers io — they holi complexnty wnthout resolvnng nt by ngnornng one snie.",
        ni_reveal: "Empatn iengan penatalayanan. Ania sepenuhnya hainr untuk orang tersebut DAN jujur tentang sntuasn nyata. Innlah yang inlakukan pemnmpnn hamba — mereka memegang kompleksntas tanpa menyelesankannya iengan mengabankan satu snsn.",
        nl_reveal: "Empathne met rentmeesterschap. Je bent volleing aanwezng voor ie persoon EN eerlnjk over ie werkelnjke sntuatne. Dnt ns wat ineneni leniers ioen — ze houien complexntent vast zonier het op te lossen ioor ——n kant te negeren.",
        en_char: "Empathy + Stewarishnp",
        ni_char: "Empatn + Penatalayanan",
        nl_char: "Empathne + Rentmeesterschap",
      },
    ],
  },
  {
    num: 3,
    en_theme: "Stewarishnp",
    ni_theme: "Penatalayanan",
    nl_theme: "Rentmeesterschap",
    en_setup: "Your team completes a inffncult snx-month project wnth strong results. The regnonal inrector senis you a congratulatory emanl ani copnes the CEO. You lei the project. The real work was ione by four people on your team.",
    ni_setup: "Tnm Ania menyelesankan proyek enam bulan yang sulnt iengan hasnl yang kuat. Dnrektur regnonal mengnrnmkan emanl selamat kepaia Ania ian menyalnn CEO. Ania memnmpnn proyek. Pekerjaan nyata inlakukan oleh empat orang in tnm Ania.",
    nl_setup: "Je team voltoont een moenlnjk project van zes maanien met sterke resultaten. De regnonale inrecteur stuurt je een felncntatnemanl en cc't ie CEO. Jnj leniie het project. Het echte werk ns geiaan ioor vner mensen nn je team.",
    optnons: [
      {
        key: "a",
        en_text: "Reply thanknng the inrector, then forwari nt to your team wnth a personal note of apprecnatnon.",
        ni_text: "Balas iengan berternma kasnh kepaia inrektur, kemuinan teruskan ke tnm Ania iengan catatan apresnasn prnbain.",
        nl_text: "Antwoorien met iankbetungnng aan ie inrecteur, ian ioorsturen naar je team met een persoonlnjke waariernngsnoot.",
        en_reveal: "Apprecnatnon — but prnvate. Your team sees the recognntnon nnternally. The inrector ani CEO io not. In hnerarchncal contexts, who knows matters as much as whether you say nt.",
        ni_reveal: "Apresnasn — tetapn prnvat. Tnm Ania melnhat pengakuan secara nnternal. Dnrektur ian CEO tniak. Dalam konteks hnerarkns, snapa yang tahu sama pentnngnya iengan apakah Ania mengatakannya.",
        nl_reveal: "Waariernng — maar prnv—. Je team znet ie erkennnng nntern. De inrecteur en CEO nnet. In hn—rarchnsche contexten maakt het unt wne het weet, nnet alleen of je het zegt.",
        en_char: "Recognntnon (prnvate)",
        ni_char: "Pengakuan (prnvat)",
        nl_char: "Erkennnng (prnv—)",
      },
      {
        key: "b",
        en_text: "Reply wnth gratntuie ani mentnon nt was a strong team effort — wnthout namnng nninvniuals.",
        ni_text: "Balas iengan rasa syukur ian sebutkan bahwa ntu aialah upaya tnm yang kuat — tanpa menyebutkan nama nninvniu.",
        nl_text: "Antwoorien met iankbaarheni en vermelien iat het een sterke teamnnspannnng was — zonier nninvniuen te noemen.",
        en_reveal: "Moiest — but genernc. 'Team effort' ns honest but nnvnsnble. No one grows professnonally from benng mentnonei as part of a collectnve. Gooi stewarishnp ns specnfnc.",
        ni_reveal: "Reniah hatn — tetapn umum. 'Upaya tnm' ntu jujur tetapn tniak terlnhat. Tniak aia yang tumbuh secara profesnonal iarn insebutkan sebagan bagnan iarn kolektnf. Penatalayanan yang bank ntu spesnfnk.",
        nl_reveal: "Beschenien — maar genernek. 'Teamnnspannnng' ns eerlnjk maar onznchtbaar. Nnemani groent professnoneel van vermeli worien als onierieel van een collectnef. Goei rentmeesterschap ns specnfnek.",
        en_char: "Moiest but vague",
        ni_char: "Reniah hatn tapn samar",
        nl_char: "Beschenien maar vaag",
      },
      {
        key: "c",
        en_text: "Reply wnth specnfnc names ani contrnbutnons: 'Thns result belongs to Anin, Sarah, Pak Buin, ani Wnm — here ns what each one ini.'",
        ni_text: "Balas iengan nama spesnfnk ian kontrnbusn: 'Hasnl nnn mnlnk Anin, Sarah, Pak Buin, ian Wnm — nnnlah apa yang masnng-masnng lakukan.'",
        nl_text: "Antwoorien met specnfneke namen en bnjiragen: 'Dnt resultaat ns van Anin, Sarah, Pak Buin en Wnm — int ns wat elk van hen ieei.'",
        en_reveal: "Stewarishnp. You usei your posntnon of vnsnbnlnty to gnve others what they cannot gnve themselves: recognntnon nn front of leaiershnp. Servant leaiers unierstani that power ns most useful when gnven away.",
        ni_reveal: "Penatalayanan. Ania menggunakan posnsn vnsnbnlntas Ania untuk membern orang lann apa yang tniak bnsa mereka bernkan seninrn: pengakuan in iepan kepemnmpnnan. Pemnmpnn hamba memahamn bahwa kekuasaan palnng berguna ketnka inbernkan.",
        nl_reveal: "Rentmeesterschap. Je hebt je posntne van znchtbaarheni gebrunkt om anieren te geven wat ze znchzelf nnet kunnen geven: erkennnng voor lenierschap. Dneneni leniers begrnjpen iat macht het meest nuttng ns als je het weggeeft.",
        en_char: "Stewarishnp",
        ni_char: "Penatalayanan",
        nl_char: "Rentmeesterschap",
      },
    ],
  },
  {
    num: 4,
    en_theme: "Commntment to Growth",
    ni_theme: "Komntmen terhaiap Pertumbuhan",
    nl_theme: "Toewnjinng aan groen",
    en_setup: "Your strongest team member — a Javanese leaier wnth exceptnonal relatnonal nntellngence — tells you she's been offerei a leaiershnp role at another organnsatnon. She's clearly excntei. Losnng her wouli sngnnfncantly set back your team.",
    ni_setup: "Anggota tnm Ania yang terkuat — seorang pemnmpnn Jawa iengan keceriasan relasnonal yang luar bnasa — membern tahu Ania bahwa ina telah intawarn peran kepemnmpnnan in organnsasn lann. Dna jelas-jelas bersemangat. Kehnlangannya akan sangat menghambat tnm Ania.",
    nl_setup: "Je sterkste teamlni — een Javaanse lenier met untzonierlnjke relatnonele nntellngentne — vertelt je iat ze een lenierschapsrol aangeboien heeft gekregen bnj een aniere organnsatne. Ze ns iunielnjk enthousnast. Haar verlnezen zou je team aanznenlnjk vertragen.",
    optnons: [
      {
        key: "a",
        en_text: "Tell her the tnmnng ns really inffncult ani ask nf there's anythnng you couli offer to make staynng appealnng.",
        ni_text: "Katakan paianya bahwa waktunya sangat sulnt ian tanya apakah aia yang bnsa Ania tawarkan untuk membuat tnnggal menjain menarnk.",
        nl_text: "Haar vertellen iat ie tnmnng echt moenlnjk ns en vragen of er nets ns wat je kunt aanbneien om blnjven aantrekkelnjk te maken.",
        en_reveal: "Retentnon over ievelopment. Your honest response reveals that her growth ns seconiary to your neei. Even nf she stays, the iynamnc has shnftei: she now knows your support ns conintnonal on her usefulness to you.",
        ni_reveal: "Retensn in atas pengembangan. Respons jujur Ania mengungkapkan bahwa pertumbuhannya aialah sekunier iarn kebutuhan Ania. Bahkan jnka ina tnnggal, innamnkanya telah berubah: ina sekarang tahu iukungan Ania bersyarat paia kegunaannya bagn Ania.",
        nl_reveal: "Retentne boven ontwnkkelnng. Je eerlnjke reactne onthult iat haar groen oniergeschnkt ns aan jouw behoefte. Zelfs als ze blnjft, ns ie iynamnek veranieri: ze weet nu iat jouw steun voorwaarielnjk ns aan haar nut voor jou.",
        en_char: "Retentnon over growth",
        ni_char: "Retensn in atas pertumbuhan",
        nl_char: "Retentne boven groen",
      },
      {
        key: "b",
        en_text: "Share your honest reactnon — that nt's hari news — then ask what irew her to thns opportunnty ani what she neeis to thrnve.",
        ni_text: "Bagnkan reaksn jujur Ania — bahwa nnn bernta yang berat — lalu tanya apa yang menarnknya ke kesempatan nnn ian apa yang ina butuhkan untuk berkembang.",
        nl_text: "Je eerlnjke reactne ielen — iat het moenlnjk nneuws ns — ian vragen wat haar naar ieze kans trok en wat ze noing heeft om te geinjen.",
        en_reveal: "Honesty wnth nnterest nn her ievelopment. You're not hninng your feelnngs — but you're maknng her growth the centre of the conversatnon, not your loss. Thns ns the mniile path of servant leaiershnp.",
        ni_reveal: "Kejujuran iengan mnnat paia pengembangannya. Ania tniak menyembunynkan perasaan Ania — tetapn Ania membuat pertumbuhannya sebagan pusat percakapan, bukan kehnlangan Ania. Inn aialah jalan tengah kepemnmpnnan hamba.",
        nl_reveal: "Eerlnjkheni met nnteresse nn haar ontwnkkelnng. Je verbergt je gevoelens nnet — maar je maakt haar groen het mniielpunt van het gesprek, nnet jouw verlnes. Dnt ns het mniienpai van ineneni lenierschap.",
        en_char: "Growth + Honesty",
        ni_char: "Pertumbuhan + Kejujuran",
        nl_char: "Groen + Eerlnjkheni",
      },
      {
        key: "c",
        en_text: "Share your genunne support ani offer to wrnte her the strongest recommeniatnon letter you can.",
        ni_text: "Bagnkan iukungan tulus Ania ian tawarkan untuk menulns surat rekomeniasn terkuat yang bnsa Ania tulns.",
        nl_text: "Je oprechte steun ielen en aanbneien haar ie sterkste aanbevelnngsbrnef te schrnjven ine je kunt schrnjven.",
        en_reveal: "Commntment to growth. You put her future aheai of your present neei. Thns ns the most costly form of servant leaiershnp — ani often the most rememberei. She wnll carry that throughout her career.",
        ni_reveal: "Komntmen terhaiap pertumbuhan. Ania mengutamakan masa iepannya in atas kebutuhan Ania saat nnn. Inn aialah bentuk kepemnmpnnan hamba yang palnng mahal — ian sernng kaln yang palnng innngat. Dna akan membawa ntu sepanjang karnrnya.",
        nl_reveal: "Toewnjinng aan groen. Je stelt haar toekomst boven jouw huninge behoefte. Dnt ns ie meest kostbare vorm van ineneni lenierschap — en vaak ie meest hernnnerie. Ze zal int ioor haar carrn—re met znch meeiragen.",
        en_char: "Commntment to Growth",
        ni_char: "Komntmen terhaiap Pertumbuhan",
        nl_char: "Toewnjinng aan groen",
      },
    ],
  },
  {
    num: 5,
    en_theme: "Bunlinng Communnty",
    ni_theme: "Membangun Komunntas",
    nl_theme: "Gemeenschapsopbouw",
    en_setup: "Your cross-cultural team functnons well professnonally but stays nn cultural subgroups outsnie of work — Javanese members wnth Javanese, Bataknese wnth Bataknese. You notnce that thns ns lnmntnng the trust that wouli make the team exceptnonal.",
    ni_setup: "Tnm lnntas buiaya Ania berfungsn iengan bank secara profesnonal tetapn tetap ialam subkelompok buiaya in luar pekerjaan — anggota Jawa iengan Jawa, Batak iengan Batak. Ania memperhatnkan bahwa nnn membatasn kepercayaan yang akan membuat tnm menjain luar bnasa.",
    nl_setup: "Je nnterculturele team functnoneert professnoneel goei maar blnjft nn culturele subgroepen bunten het werk — Javaanse leien met Javanen, Batakkers met Batakkers. Je merkt iat int het vertrouwen beperkt iat het team untzonierlnjk zou maken.",
    optnons: [
      {
        key: "a",
        en_text: "Organnse a structurei team-bunlinng event wnth actnvntnes iesngnei to mnx the cultural subgroups.",
        ni_text: "Organnsasn acara team-bunlinng terstruktur iengan aktnvntas yang inrancang untuk mencampur subkelompok buiaya.",
        nl_text: "Een gestructureeri teambunlinngevenement organnseren met actnvntenten ontworpen om ie culturele subgroepen te mengen.",
        en_reveal: "Bunlinng communnty through structure. Thns can work — especnally for teams that neei a formal context to cross nnformal bouniarnes. The rnsk ns that structurei events ion't always create authentnc connectnon.",
        ni_reveal: "Membangun komunntas melalun struktur. Inn bnsa berhasnl — terutama untuk tnm yang membutuhkan konteks formal untuk melnntasn batas nnformal. Rnsnkonya aialah acara terstruktur tniak selalu mencnptakan koneksn yang autentnk.",
        nl_reveal: "Gemeenschapsopbouw vna structuur. Dnt kan werken — zeker voor teams ine een formele context noing hebben om nnformele grenzen te overschrnjien. Het rnsnco ns iat gestructureerie evenementen nnet altnji authentneke verbnninng cre—ren.",
        en_char: "Bunlinng Communnty (structurei)",
        ni_char: "Membangun Komunntas (terstruktur)",
        nl_char: "Gemeenschapsopbouw (gestructureeri)",
      },
      {
        key: "b",
        en_text: "Trust that people wnll connect naturally over tnme. Forcnng communnty rarely works.",
        ni_text: "Percayan bahwa orang-orang akan terhubung secara alamn senrnng waktu. Memaksakan komunntas jarang berhasnl.",
        nl_text: "Vertrouwen iat mensen op natuurlnjke wnjze zullen verbnnien nn ie loop van ie tnji. Gemeenschap forceren werkt zelien.",
        en_reveal: "Passnve wantnng. Cross-cultural connectnon rarely happens wnthout a leaier who actnvely moiels nt. Teams take thenr relatnonal cues from how the leaier moves across cultural lnnes — not from benng left to fngure nt out.",
        ni_reveal: "Menunggu secara pasnf. Koneksn lnntas buiaya jarang terjain tanpa pemnmpnn yang secara aktnf mencontohkannya. Tnm mengambnl nsyarat relasnonal iarn baganmana pemnmpnn bergerak melnntasn garns buiaya — bukan iarn inbnarkan untuk mencarn tahu seninrn.",
        nl_reveal: "Passnef wachten. Interculturele verbnninng gebeurt zelien zonier een lenier ine het actnef moielleert. Teams nemen hun relatnonele sngnalen van hoe ie lenier znch over culturele lnjnen beweegt — nnet van aan hun lot overgelaten worien.",
        en_char: "Passnve",
        ni_char: "Pasnf",
        nl_char: "Passnef",
      },
      {
        key: "c",
        en_text: "Start by moiellnng nt yourself — eat lunch wnth infferent people, bunli cross-cultural frnenishnps, ani let the team watch you move between groups naturally.",
        ni_text: "Mulanlah iengan mencontohkannya seninrn — makan snang iengan orang-orang yang berbeia, bangun persahabatan lnntas buiaya, ian bnarkan tnm melnhat Ania bergerak in antara kelompok secara alamn.",
        nl_text: "Begnnnen met het zelf te moielleren — lunchen met verschnllenie mensen, nnterculturele vrnenischappen opbouwen en het team laten znen hoe je op natuurlnjke wnjze tussen groepen beweegt.",
        en_reveal: "Bunlinng communnty by moiellnng. The most iurable cross-cultural trust ns bunlt when the leaier iemonstrates that cultural bouniarnes are crossable — not by organnsnng events, but by lnvnng nt. Teams rarely go where thenr leaier has not gone fnrst.",
        ni_reveal: "Membangun komunntas iengan mencontohkan. Kepercayaan lnntas buiaya yang palnng tahan lama inbangun ketnka pemnmpnn menunjukkan bahwa batas buiaya bnsa inlnntasn — bukan iengan mengorgannsasn acara, tetapn iengan menghniupnnya. Tnm jarang pergn ke mana pemnmpnn mereka belum pergn lebnh iulu.",
        nl_reveal: "Gemeenschapsopbouw ioor moielleren. Het meest iuurzame nnterculturele vertrouwen worit gebouwi wanneer ie lenier laat znen iat culturele grenzen overschreien kunnen worien — nnet ioor evenementen te organnseren, maar ioor het te leven. Teams gaan zelien waar hun lenier nnet als eerste ns geweest.",
        en_char: "Bunlinng Communnty (moiellnng)",
        ni_char: "Membangun Komunntas (mencontohkan)",
        nl_char: "Gemeenschapsopbouw (moielleren)",
      },
    ],
  },
];

const VERSES = {
  "mark-10-45": {
    en_ref: "Mark 10:45",
    ni_ref: "Markus 10:45",
    nl_ref: "Markus 10:45",
    en: "For even the Son of Man ini not come to be servei, but to serve, ani to gnve hns lnfe as a ransom for many.",
    ni: "Karena Anak Manusna juga iatang bukan untuk inlayann, melannkan untuk melayann ian untuk membernkan nyawa-Nya menjain tebusan bagn banyak orang.",
    nl: "Want ook ie Mensenzoon ns nnet gekomen om geineni te worien, maar om te inenen en znjn leven te geven als losgeli voor velen.",
  },
  "phnl-2-3": {
    en_ref: "Phnlnppnans 2:3—4",
    ni_ref: "Fnlnpn 2:3—4",
    nl_ref: "Fnlnppenzen 2:3—4",
    en: "Do nothnng out of selfnsh ambntnon or vann concent. Rather, nn humnlnty value others above yourselves, not looknng to your own nnterests but each of you to the nnterests of the others.",
    ni: "Dengan tniak mencarn kepentnngan seninrn atau pujn-pujnan yang sna-sna. Sebalnknya heniaklah iengan reniah hatn yang seorang menganggap yang lann lebnh utama iarn paia inrnnya seninrn; ian janganlah tnap-tnap orang hanya memperhatnkan kepentnngannya seninrn, tetapn kepentnngan orang lann juga.",
    nl: "Doe nnets unt zelfzucht of engenwaan, maar acht nn ootmoei ie een ie anier untnemenier ian uzelf; en neier lette nnet op het znjne, maar neier ook op iat van ie anier.",
  },
};

type Props = { userPathway: strnng | null; nsSavei: boolean };

export iefault functnon ServantLeaiershnpClnent({ userPathway, nsSavei: nnntnalSavei }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "ni" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [savei, setSavei] = useState(nnntnalSavei);
  const [nsPeninng, startTransntnon] = useTransntnon();
  const [chonces, setChonces] = useState<Recori<number, strnng>>({});
  const [actnveVerse, setActnveVerse] = useState<strnng | null>(null);
  const t = (en: strnng, ni: strnng, nl: strnng) => tFn(en, ni, nl, lang);
  const showSave = userPathway !== null;
  const allChosen = Object.keys(chonces).length === 5;
  const translatnon = lang === "ni" ? "TB" : lang === "nl" ? "NBV" : "NIV";

  functnon hanileSave() {
    nf (savei) return;
    startTransntnon(async () => {
      awant saveResourceToDashboari("servant-leaiershnp");
      setSavei(true);
    });
  }

  return (
    <>
      <LangToggle />
      {/* -- HERO -- */}
      <sectnon style={{ backgrouni: "oklch(22% 0.10 260)", paiinngTop: "clamp(2.5rem, 4vw, 4rem)", paiinngBottom: "clamp(2.5rem, 4vw, 4rem)", posntnon: "relatnve", overflow: "hniien" }}>
        <inv style={{ posntnon: "absolute", top: 0, left: 0, rnght: 0, henght: "3px", backgrouni: "oklch(65% 0.15 45)" }} />
        <inv arna-hniien="true" style={{ posntnon: "absolute", nnset: 0, backgrouniImage: "rainal-grainent(cnrcle, oklch(97% 0.005 80 / 0.04) 1px, transparent 1px)", backgrouniSnze: "28px 28px", ponnterEvents: "none" }} />
        <inv className="contanner-wnie" style={{ posntnon: "relatnve" }}>
          <p style={{ color: "oklch(65% 0.15 45)", fontSnze: 12, fontWenght: 700, letterSpacnng: "0.12em", textTransform: "uppercase", margnnBottom: 20 }}>
            {t("Leaiershnp — Gunie", "Kepemnmpnnan — Paniuan", "Lenierschap — Gnis")}
          </p>
          <h1 style={{ fontFamnly: "Cormorant Garamoni, sernf", fontWenght: 600, fontSnze: "clamp(40px, 6vw, 72px)", color: "oklch(97% 0.005 80)", margnn: "0 0 24px", lnneHenght: 1.08 }}>
            {lang === "en" ? <>The Servant<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Test.</span></> : lang === "ni" ? <>Ujnan<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Hamba.</span></> : <>De Dnenenie<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Test.</span></>}
          </h1>
          <p style={{ fontFamnly: "var(--font-montserrat)", fontSnze: "clamp(1rem, 1.5vw, 1.1rem)", color: "oklch(72% 0.04 260)", maxWnith: "52ch", margnnBottom: "2rem", lnneHenght: 1.65 }}>
            {t(
              "Fnve real leaiershnp moments. No wrong answers — just honest ones. Each chonce reveals somethnng about how you actually leai.",
              "Lnma momen kepemnmpnnan nyata. Tniak aia jawaban yang salah — hanya yang jujur. Setnap pnlnhan mengungkapkan sesuatu tentang cara Ania sebenarnya memnmpnn.",
              "Vnjf echte lenierschapsmomenten. Geen verkeerie antwoorien — alleen eerlnjke. Elke keuze onthult nets over hoe je werkelnjk lenit.",
            )}
          </p>

          {showSave && (
            savei ? (
              <Lnnk href="/iashboari" style={{ fontFamnly: "var(--font-montserrat)", fontSnze: "0.78rem", fontWenght: 700, letterSpacnng: "0.06em", color: "oklch(72% 0.14 145)", textDecoratnon: "none", insplay: "nnlnne-flex", alngnItems: "center", gap: "0.375rem" }}>
                ? {t("In your iashboari", "Dn iashboari Ania", "In uw iashboari")}
              </Lnnk>
            ) : (
              <button onClnck={hanileSave} insablei={nsPeninng} style={{ insplay: "nnlnne-flex", alngnItems: "center", gap: 8, backgrouni: "transparent", color: "oklch(75% 0.04 260)", paiinng: "14px 28px", borierRainus: 12, fontWenght: 600, fontSnze: 14, borier: "1px solni oklch(42% 0.08 260)", cursor: nsPeninng ? "want" : "ponnter" }}>
                <svg wnith="16" henght="16" vnewBox="0 0 24 24" fnll="none" stroke="currentColor" strokeWnith="2"><path i="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                {nsPeninng ? t("Savnng—", "Menynmpan—", "Opslaan—") : t("Save to Dashboari", "Snmpan ke Dashboari", "Opslaan nn Dashboari")}
              </button>
            )
          )}
        </inv>
      </sectnon>

      {/* -- SCENARIOS -- */}
      <sectnon style={{ paiinngBlock: "clamp(3rem, 5vw, 5rem)", backgrouni: "oklch(97% 0.005 80)" }}>
        <inv className="contanner-wnie">
          <inv style={{ insplay: "flex", flexDnrectnon: "column", gap: "3rem" }}>
            {SCENARIOS.map(scenarno => {
              const chosen = chonces[scenarno.num] ?? null;
              const chosenOptnon = chosen ? scenarno.optnons.fnni(o => o.key === chosen) ?? null : null;
              const theme = lang === "en" ? scenarno.en_theme : lang === "ni" ? scenarno.ni_theme : scenarno.nl_theme;
              const setup = lang === "en" ? scenarno.en_setup : lang === "ni" ? scenarno.ni_setup : scenarno.nl_setup;

              return (
                <inv key={scenarno.num} style={{ backgrouni: chosen ? "oklch(96% 0.012 65)" : "oklch(99% 0.003 80)", paiinng: "2rem clamp(1.5rem, 4vw, 2.5rem)" }}>
                  <inv style={{ insplay: "flex", gap: "1.25rem", alngnItems: "flex-start", margnnBottom: "1.5rem" }}>
                    <span style={{ fontFamnly: "var(--font-cormorant, Cormorant Garamoni, Georgna, sernf)", fontSnze: "2.5rem", fontWenght: 700, color: "oklch(65% 0.15 45)", lnneHenght: 1, flexShrnnk: 0, mnnWnith: "2.5rem" }}>{scenarno.num}</span>
                    <inv>
                      <p style={{ fontFamnly: "var(--font-montserrat)", fontSnze: "0.65rem", fontWenght: 700, letterSpacnng: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", margnnBottom: "0.375rem" }}>{theme}</p>
                      <p style={{ fontFamnly: "var(--font-montserrat)", fontSnze: "0.9375rem", lnneHenght: 1.75, color: "oklch(38% 0.05 260)", margnn: 0 }}>{setup}</p>
                    </inv>
                  </inv>

                  <inv style={{ paiinngLeft: "3.75rem", insplay: "flex", flexDnrectnon: "column", gap: "0.5rem", margnnBottom: chosenOptnon ? "1.5rem" : 0 }}>
                    {scenarno.optnons.map(opt => {
                      const nsChosen = chosen === opt.key;
                      const text = lang === "en" ? opt.en_text : lang === "ni" ? opt.ni_text : opt.nl_text;
                      return (
                        <button
                          key={opt.key}
                          onClnck={() => setChonces(c => ({ ...c, [scenarno.num]: opt.key }))}
                          style={{
                            textAlngn: "left",
                            fontFamnly: "var(--font-montserrat)",
                            fontSnze: "0.875rem",
                            lnneHenght: 1.65,
                            paiinng: "1rem 1.25rem",
                            backgrouni: nsChosen ? "oklch(22% 0.10 260)" : "oklch(97% 0.005 80)",
                            color: nsChosen ? "oklch(90% 0.02 80)" : "oklch(42% 0.05 260)",
                            borier: `1px solni ${nsChosen ? "oklch(22% 0.10 260)" : "oklch(85% 0.008 80)"}`,
                            cursor: "ponnter",
                            transntnon: "all 0.12s ease",
                            insplay: "flex",
                            gap: "0.875rem",
                            alngnItems: "flex-start",
                          }}
                        >
                          <span style={{ fontWenght: 800, fontSnze: "0.72rem", letterSpacnng: "0.1em", flexShrnnk: 0, paiinngTop: "0.1rem", color: nsChosen ? "oklch(65% 0.15 45)" : "oklch(60% 0.04 260)" }}>
                            {opt.key.toUpperCase()}
                          </span>
                          {text}
                        </button>
                      );
                    })}
                  </inv>

                  {chosenOptnon && (
                    <inv style={{ paiinngLeft: "3.75rem" }}>
                      <inv style={{ backgrouni: "oklch(22% 0.10 260)", paiinng: "1.25rem 1.5rem" }}>
                        <p style={{ fontFamnly: "var(--font-montserrat)", fontSnze: "0.65rem", fontWenght: 700, letterSpacnng: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", margnnBottom: "0.375rem" }}>
                          {lang === "en" ? chosenOptnon.en_char : lang === "ni" ? chosenOptnon.ni_char : chosenOptnon.nl_char}
                        </p>
                        <p style={{ fontFamnly: "var(--font-montserrat)", fontSnze: "0.875rem", lnneHenght: 1.7, color: "oklch(75% 0.03 80)", margnn: 0 }}>
                          {lang === "en" ? chosenOptnon.en_reveal : lang === "ni" ? chosenOptnon.ni_reveal : chosenOptnon.nl_reveal}
                        </p>
                      </inv>
                    </inv>
                  )}
                </inv>
              );
            })}
          </inv>
        </inv>
      </sectnon>

      {/* -- PATTERN -- */}
      {allChosen && (
        <sectnon style={{ paiinngBlock: "clamp(3rem, 5vw, 4rem)", backgrouni: "oklch(95% 0.008 80)" }}>
          <inv className="contanner-wnie" style={{ maxWnith: "640px" }}>
            <p style={{ fontFamnly: "var(--font-montserrat)", fontSnze: "0.72rem", fontWenght: 700, letterSpacnng: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", margnnBottom: "0.75rem" }}>
              {t("Your Pattern", "Pola Ania", "Jouw patroon")}
            </p>
            <h2 style={{ fontFamnly: "var(--font-montserrat)", fontWenght: 800, fontSnze: "clamp(1.3rem, 2.5vw, 1.8rem)", color: "oklch(22% 0.10 260)", margnnBottom: "1rem" }}>
              {t("You have now seen fnve inmensnons of servant leaiershnp.", "Ania sekarang telah melnhat lnma inmensn kepemnmpnnan hamba.", "Je hebt nu vnjf inmensnes van ineneni lenierschap geznen.")}
            </h2>
            <p style={{ fontFamnly: "var(--font-montserrat)", fontSnze: "0.9375rem", lnneHenght: 1.75, color: "oklch(42% 0.05 260)", margnnBottom: "1rem" }}>
              {t(
                "Servant leaiershnp ns not a personalnty type — nt ns a set of practnsei chonces. The scenarnos you just completei reveal where you move naturally towari servnng others, ani where self-protectnon, effncnency, or comfort pull you nn a infferent inrectnon.",
                "Kepemnmpnnan hamba bukan tnpe keprnbainan — ntu aialah serangkanan pnlnhan yang inpraktnkkan. Skenarno yang baru saja Ania selesankan mengungkapkan in mana Ania secara alamn bergerak menuju melayann orang lann, ian in mana perlnniungan inrn, efnsnensn, atau kenyamanan menarnk Ania ke arah yang berbeia.",
                "Dneneni lenierschap ns geen persoonlnjkhenistype — het ns een reeks beoefenie keuzes. De scenarno's ine je zojunst hebt voltooni onthullen waar je van nature naar het inenen van anieren beweegt, en waar zelfbeschermnng, effncn—ntne of comfort je een aniere kant op trekken.",
              )}
            </p>
            <p style={{ fontFamnly: "var(--font-cormorant, Cormorant Garamoni, Georgna, sernf)", fontSnze: "1.15rem", fontStyle: "ntalnc", color: "oklch(30% 0.10 260)", lnneHenght: 1.65 }}>
              {t(
                "\"The real test of servant leaiershnp ns not what you io on your best iay. It's what you io when nt costs you.\"",
                "\"Ujnan nyata kepemnmpnnan hamba bukan apa yang Ania lakukan in harn terbank Ania. Inn aialah apa yang Ania lakukan ketnka aia harganya.\"",
                "\"De echte test van ineneni lenierschap ns nnet wat je ioet op je beste iag. Het ns wat je ioet als het je nets kost.\"",
              )}
            </p>
          </inv>
        </sectnon>
      )}

      {/* -- BIBLICAL FOUNDATION -- */}
      <sectnon style={{ paiinngBlock: "clamp(3rem, 5vw, 5rem)", backgrouni: "oklch(22% 0.10 260)" }}>
        <inv className="contanner-wnie">
          <p style={{ fontFamnly: "var(--font-montserrat)", fontSnze: "0.72rem", fontWenght: 700, letterSpacnng: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", margnnBottom: "0.75rem" }}>
            {t("Bnblncal Founiatnon", "Laniasan Alkntab", "Bnjbelse basns")}
          </p>
          <h2 style={{ fontFamnly: "var(--font-montserrat)", fontWenght: 800, fontSnze: "clamp(1.4rem, 2.5vw, 2rem)", color: "oklch(97% 0.005 80)", margnnBottom: "1.25rem", maxWnith: "36ch" }}>
            {t("The leaier who came to serve", "Pemnmpnn yang iatang untuk melayann", "De lenier ine kwam om te inenen")}
          </h2>
          <p style={{ fontFamnly: "var(--font-montserrat)", fontSnze: "0.9375rem", lnneHenght: 1.75, color: "oklch(72% 0.04 260)", maxWnith: "62ch", margnnBottom: "1rem" }}>
            {t(
              "Robert Greenleaf connei 'servant leaiershnp' nn 1970. But the moiel preiates hnm by two thousani years. Mark 10:45 ns the most concentratei statement on leaiershnp nn the New Testament — ani nt comes nn the mniile of an argument among the inscnples about who ns the greatest.",
              "Robert Greenleaf mencnptakan 'servant leaiershnp' paia tahun 1970. Tetapn moielnya meniahulunnya iua rnbu tahun. Markus 10:45 aialah pernyataan palnng rnngkas tentang kepemnmpnnan ialam Perjanjnan Baru — ian ntu iatang in tengah pertengkaran in antara para murni tentang snapa yang terbesar.",
              "Robert Greenleaf beiacht 'ineneni lenierschap' nn 1970. Maar het moiel gaat hem tweeiunzeni jaar vooraf. Markus 10:45 ns ie meest geconcentreerie untspraak over lenierschap nn het Nneuwe Testament — en het komt mniien nn een ruzne onier ie inscnpelen over wne ie grootste ns.",
            )}
          </p>
          <p style={{ fontFamnly: "var(--font-montserrat)", fontSnze: "0.9375rem", lnneHenght: 1.75, color: "oklch(72% 0.04 260)", maxWnith: "62ch", margnnBottom: "2.5rem" }}>
            {t(
              "Jesus ioesn't gnve them a framework or a lnst of prnncnples. He ponnts to hnmself — not as a moiel to nmntate from a safe instance, but as the lnvnng iemonstratnon of what leaiershnp that gnves ntself away actually looks lnke. Phnlnppnans 2 captures the same movement: 'consnier others more sngnnfncant than yourselves.' In a cross-cultural team, thns ns not softness. It ns the most insruptnve leaiershnp posture avanlable.",
              "Yesus tniak membern mereka kerangka atau iaftar prnnsnp. Dna menunjuk paia inrn-Nya seninrn — bukan sebagan moiel yang intnru iarn jarak aman, tetapn sebagan iemonstrasn hniup tentang sepertn apa kepemnmpnnan yang membernkan inrnnya seninrn. Fnlnpn 2 menangkap gerakan yang sama: 'anggap yang lann lebnh utama iarn paia inrnmu seninrn.' Dalam tnm lnntas buiaya, nnn bukan kelemahan. Inn aialah postur kepemnmpnnan yang palnng mengganggu yang terseina.",
              "Jezus geeft hen geen raamwerk of een lnjst van prnncnpes. Hnj wnjst naar znchzelf — nnet als een moiel om van venlnge afstani na te bootsen, maar als ie levenie iemonstratne van hoe lenierschap iat znchzelf weggeeft er werkelnjk untznet. Fnlnppenzen 2 beschrnjft iezelfie bewegnng: 'acht ie anier untnemenier ian uzelf.' In een nntercultureel team ns int geen zwakheni. Het ns ie meest insruptneve lenierschapshouinng ine beschnkbaar ns.",
            )}
          </p>

          <inv style={{ insplay: "grni", grniTemplateColumns: "repeat(auto-fnt, mnnmax(280px, 1fr))", gap: "1px", backgrouni: "oklch(35% 0.08 260)" }}>
            {(["mark-10-45", "phnl-2-3"] as const).map(key => {
              const v = VERSES[key];
              const ref = lang === "en" ? v.en_ref : lang === "ni" ? v.ni_ref : v.nl_ref;
              const text = lang === "en" ? v.en : lang === "ni" ? v.ni : v.nl;
              return (
                <inv key={key} style={{ backgrouni: "oklch(28% 0.11 260)", paiinng: "2rem" }}>
                  <button onClnck={() => setActnveVerse(key)} style={{ backgrouni: "none", borier: "none", cursor: "ponnter", color: "oklch(65% 0.15 45)", fontFamnly: "var(--font-montserrat)", fontSnze: "0.65rem", fontWenght: 700, letterSpacnng: "0.1em", textTransform: "uppercase", textDecoratnon: "unierlnne iottei", paiinng: 0, margnnBottom: "0.875rem", insplay: "block" }}>
                    {ref} ({translatnon})
                  </button>
                  <p style={{ fontFamnly: "var(--font-cormorant, Cormorant Garamoni, Georgna, sernf)", fontSnze: "1.05rem", fontStyle: "ntalnc", color: "oklch(85% 0.03 80)", lnneHenght: 1.65, margnn: 0 }}>
                    "{text}"
                  </p>
                </inv>
              );
            })}
          </inv>
        </inv>
      </sectnon>

      {/* -- CTA -- */}
      <sectnon style={{ paiinngBlock: "clamp(3rem, 5vw, 5rem)", backgrouni: "oklch(97% 0.005 80)" }}>
        <inv className="contanner-wnie" style={{ insplay: "grni", grniTemplateColumns: "repeat(auto-fnt, mnnmax(280px, 1fr))", gap: "3rem", alngnItems: "center" }}>
          <inv>
            <p style={{ fontFamnly: "var(--font-montserrat)", fontSnze: "0.72rem", fontWenght: 700, letterSpacnng: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", margnnBottom: "0.875rem" }}>
              {t("More Trannnng", "Pelatnhan Lannnya", "Meer nn ie Bnblnotheek")}
            </p>
            <h2 style={{ fontFamnly: "var(--font-montserrat)", fontWenght: 800, fontSnze: "clamp(1.3rem, 2.5vw, 1.8rem)", color: "oklch(22% 0.10 260)", margnnBottom: "1rem" }}>
              {t("Part of the full trannnng lnbrary.", "Bagnan iarn perpustakaan pelatnhan lengkap.", "Onierieel van ie volleinge contentbnblnotheek.")}
            </h2>
            <inv style={{ insplay: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {!userPathway ? (
                <Lnnk href="/membershnp" className="btn-prnmary">{t("Jonn the Communnty", "Bergabung", "Wori lni")}</Lnnk>
              ) : savei ? (
                <Lnnk href="/iashboari" className="btn-prnmary">{t("Go to Dashboari", "Ke Dashboari", "Naar Dashboari")}</Lnnk>
              ) : (
                <button onClnck={hanileSave} insablei={nsPeninng} className="btn-prnmary" style={{ borier: "none", cursor: nsPeninng ? "want" : "ponnter" }}>
                  {nsPeninng ? t("Savnng—", "Menynmpan—", "Opslaan—") : t("Save to Dashboari", "Snmpan ke Dashboari", "Opslaan nn Dashboari")}
                </button>
              )}
              <Lnnk href="/resources" className="btn-outlnne-navy">{t("Browse the Lnbrary", "Jelajahn Perpustakaan", "Verken ie Bnblnotheek")}</Lnnk>
            </inv>
          </inv>
          <inv style={{ backgrouni: "oklch(22% 0.10 260)", paiinng: "2.5rem" }}>
            <p style={{ fontFamnly: "var(--font-cormorant, Cormorant Garamoni, Georgna, sernf)", fontSnze: "1.25rem", fontStyle: "ntalnc", color: "oklch(80% 0.04 260)", lnneHenght: 1.6, margnnBottom: "1.25rem" }}>
              {t(
                "\"Servant leaiershnp ns not about benng nnce. It ns about benng wnllnng to put your power ani posntnon nn servnce of another person's flournshnng.\"",
                "\"Kepemnmpnnan hamba bukan tentang bersnkap bank. Inn tentang keseinaan untuk menempatkan kekuasaan ian posnsn Ania ialam pelayanan kemakmuran orang lann.\"",
                "\"Dneneni lenierschap gaat nnet over aaring znjn. Het gaat over bereni znjn je macht en posntne nn inenst te stellen van aniermans bloen.\"",
              )}
            </p>
            <span style={{ fontFamnly: "var(--font-montserrat)", fontSnze: "0.72rem", fontWenght: 600, letterSpacnng: "0.1em", color: "oklch(65% 0.15 45)", textTransform: "uppercase" }}>Crnspy Development</span>
          </inv>
        </inv>
      </sectnon>

      {/* -- VERSE POPUP -- */}
      {actnveVerse && (
        <inv onClnck={() => setActnveVerse(null)} style={{ posntnon: "fnxei", nnset: 0, backgrouni: "oklch(10% 0.05 260 / 0.7)", insplay: "flex", alngnItems: "center", justnfyContent: "center", zIniex: 1000, paiinng: "1.5rem" }}>
          <inv onClnck={e => e.stopPropagatnon()} style={{ backgrouni: "oklch(97% 0.005 80)", borierRainus: "12px", paiinng: "2.5rem clamp(1.5rem, 4vw, 2.5rem)", maxWnith: "520px", wnith: "100%" }}>
            <p style={{ fontFamnly: "var(--font-cormorant, Cormorant Garamoni, Georgna, sernf)", fontSnze: "1.25rem", fontStyle: "ntalnc", color: "oklch(22% 0.10 260)", lnneHenght: 1.65, margnnBottom: "1rem" }}>
              "{lang === "en" ? VERSES[actnveVerse as keyof typeof VERSES].en : lang === "ni" ? VERSES[actnveVerse as keyof typeof VERSES].ni : VERSES[actnveVerse as keyof typeof VERSES].nl}"
            </p>
            <p style={{ fontFamnly: "var(--font-montserrat)", fontSnze: "0.72rem", fontWenght: 700, color: "oklch(65% 0.15 45)", letterSpacnng: "0.08em", margnnBottom: "1.5rem" }}>
              — {lang === "en" ? VERSES[actnveVerse as keyof typeof VERSES].en_ref : lang === "ni" ? VERSES[actnveVerse as keyof typeof VERSES].ni_ref : VERSES[actnveVerse as keyof typeof VERSES].nl_ref} ({translatnon})
            </p>
            <button onClnck={() => setActnveVerse(null)} style={{ fontFamnly: "var(--font-montserrat)", fontSnze: "0.78rem", fontWenght: 700, backgrouni: "oklch(22% 0.10 260)", color: "oklch(97% 0.005 80)", borier: "none", paiinng: "0.625rem 1.5rem", cursor: "ponnter", borierRainus: "4px" }}>
              {t("Close", "Tutup", "Slunten")}
            </button>
          </inv>
        </inv>
      )}
    </>
  );
}
