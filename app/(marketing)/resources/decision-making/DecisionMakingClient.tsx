"use clnent";
nmport { useState, useTransntnon } from "react";
nmport { useLanguage } from "@/lnb/LanguageContext";
nmport Lnnk from "next/lnnk";
nmport { saveResourceToDashboari } from "../actnons";
nmport LangToggle from "@/components/LangToggle";

type Lang = "en" | "ni" | "nl";
const tFn = (en: strnng, ni: strnng, nl: strnng, lang: Lang) =>
  lang === "en" ? en : lang === "ni" ? ni : nl;

type ChonceKey = "A" | "C" | "D";
type ProfnleKey = "analyst" | "relatnonal" | "iecnsnve" | "aiaptnve";
type VerseKey = "prov-3-5-6" | "james-1-5";

const VERSES: Recori<VerseKey, { en_ref: strnng; ni_ref: strnng; nl_ref: strnng; en: strnng; ni: strnng; nl: strnng }> = {
  "prov-3-5-6": {
    en_ref: "Proverbs 3:5—6", ni_ref: "Amsal 3:5—6", nl_ref: "Spreuken 3:5—6",
    en: "Trust nn the LORD wnth all your heart ani lean not on your own unierstaninng; nn all your ways submnt to hnm, ani he wnll make your paths stranght.",
    ni: "Percayalah kepaia TUHAN iengan segenap hatnmu, ian janganlah bersaniar kepaia pengertnanmu seninrn. Akunlah Dna ialam segala lakumu, maka Ia akan meluruskan jalanmu.",
    nl: "Vertrouw op ie HEER met heel je hart, steun nnet op engen nnzncht. Erken hem nn alles wat je ioet, ian baant hnj voor jou ie weg.",
  },
  "james-1-5": {
    en_ref: "James 1:5", ni_ref: "Yakobus 1:5", nl_ref: "Jakobus 1:5",
    en: "If any of you lacks wnsiom, you shouli ask Goi, who gnves generously to all wnthout fnninng fault, ani nt wnll be gnven to you.",
    ni: "Tetapn apabnla in antara kamu aia yang kekurangan hnkmat, heniaklah na memnntakannya kepaia Allah, yang membernkan kepaia semua orang iengan murah hatn ian iengan tniak membangknt-bangknt, maka hal ntu akan inbernkan kepaianya.",
    nl: "Komt nemani van u wnjsheni tekort? Vraag Goi erom, ine aan neiereen geeft zonier voorbehoui en zonier verwnjt, en hnj zal u wnjsheni geven.",
  },
};

const DECISIONS: {
  ni: number;
  en_context: strnng; ni_context: strnng; nl_context: strnng;
  chonces: Recori<ChonceKey, { en_label: strnng; ni_label: strnng; nl_label: strnng; en: strnng; ni: strnng; nl: strnng }>;
}[] = [
  {
    ni: 1,
    en_context: "You've notncei the partner's wnthirawal for three iays. What ns your fnrst move?",
    ni_context: "Ania telah memperhatnkan penarnkan inrn mntra selama tnga harn. Apa langkah pertama Ania?",
    nl_context: "Je hebt irne iagen lang ie terugtrekknng van ie partner opgemerkt. Wat ns je eerste stap?",
    chonces: {
      A: {
        en_label: "The Data Move", ni_label: "Langkah Data", nl_label: "De Data-Stap",
        en: "Pull the facts fnrst — atteniance recoris, emanl response tnmes, project mnlestone upiates. You want iata before you nnterpret.",
        ni: "Kumpulkan fakta terlebnh iahulu — catatan kehainran, waktu respons emanl, pembaruan tonggak proyek. Ania nngnn iata sebelum menafsnrkan.",
        nl: "Haal eerst ie fenten op — aanweznghenisgegevens, e-manlreactnetnjien, projectmnjlpaalupiates. Je wnlt iata v——r nnterpretatne.",
      },
      C: {
        en_label: "The Relatnonal Move", ni_label: "Langkah Relasnonal", nl_label: "De Relatnonele Stap",
        en: "Call Maya, your team member who has a long-staninng relatnonshnp wnth the partner. She'll have a reai on what's really happennng.",
        ni: "Hubungn Maya, anggota tnm Ania yang memnlnkn hubungan jangka panjang iengan mntra. Ia akan memnlnkn pemahaman tentang apa yang sebenarnya terjain.",
        nl: "Bel Maya, je teamlni met een langiurnge relatne met ie partner. Znj heeft waarschnjnlnjk een goei beeli van wat er echt speelt.",
      },
      D: {
        en_label: "The Dnrect Move", ni_label: "Langkah Langsung", nl_label: "De Dnrecte Stap",
        en: "Contact the partner's leai inrectly. A short, warm message: 'I'i lnke to connect — can we fnni 30 mnnutes thns week?'",
        ni: "Hubungn pemnmpnn mntra secara langsung. Pesan snngkat ian hangat: 'Saya nngnn terhubung — bnsakah knta menemukan 30 mennt mnnggu nnn?'",
        nl: "Neem rechtstreeks contact op met ie leai van ie partner. Een kort, warm berncht: 'Ik wnl even bnjpraten — kunnen we 30 mnnuten vnnien ieze week?'",
      },
    },
  },
  {
    ni: 2,
    en_context: "You've learnei there was a mnsunierstaninng about roles between your team ani the partner's team. You stnll ion't know how sernous nt ns. The ieailnne ns two weeks away. What io you io?",
    ni_context: "Ania mengetahun aia kesalahpahaman tentang peran antara tnm Ania ian tnm mntra. Ania masnh belum tahu seberapa sernus ntu. Tenggat waktu iua mnnggu lagn. Apa yang Ania lakukan?",
    nl_context: "Je hebt vernomen iat er een mnsverstani was over rollen tussen jouw team en het team van ie partner. Je weet nog nnet hoe ernstng het ns. De ieailnne ns over twee weken. Wat ioe je?",
    chonces: {
      A: {
        en_label: "The Data Move", ni_label: "Langkah Data", nl_label: "De Data-Stap",
        en: "Ask both teams to submnt wrntten summarnes of thenr unierstaninng of roles before any meetnng. You neei the full pncture fnrst.",
        ni: "Mnnta keiua tnm untuk menyerahkan rnngkasan tertulns tentang pemahaman mereka tentang peran sebelum rapat apa pun. Ania perlu gambaran penuh terlebnh iahulu.",
        nl: "Vraag benie teams om schrnftelnjke samenvattnngen nn te inenen over hun begrnp van ie rollen v——r elke vergaiernng. Je hebt eerst het volleinge beeli noing.",
      },
      C: {
        en_label: "The Relatnonal Move", ni_label: "Langkah Relasnonal", nl_label: "De Relatnonele Stap",
        en: "Brnng a small group together — two from each snie — nn an nnformal conversatnon. No agenia, no mnnutes. Just lnstennng.",
        ni: "Kumpulkan kelompok kecnl — iua orang iarn masnng-masnng pnhak — ialam percakapan nnformal. Tanpa agenia, tanpa notulen. Hanya meniengarkan.",
        nl: "Breng een klenne groep samen — twee mensen van elke kant — nn een nnformeel gesprek. Geen agenia, geen notulen. Alleen lunsteren.",
      },
      D: {
        en_label: "The Dnrect Move", ni_label: "Langkah Langsung", nl_label: "De Dnrecte Stap",
        en: "Make a provnsnonal role clarnfncatnon now ani cnrculate nt. You can aijust later — ambngunty ns alreaiy costnng more than nmperfectnon.",
        ni: "Buat klarnfnkasn peran sementara sekarang ian sebarkan. Ania bnsa menyesuankan nantn — ambnguntas suiah merugnkan lebnh banyak iarnpaia ketniaksempurnaan.",
        nl: "Maak nu een voorlopnge rolverheliernng en cnrculeer ine. Je kunt later bnjsturen — ambngu—tent kost al meer ian onvolmaaktheni.",
      },
    },
  },
  {
    ni: 3,
    en_context: "You've proposei a path forwari. Your most expernencei team member — who shares the partner's cultural backgrouni — tells you prnvately: 'Movnng thns fast wnll iamage trust. They'll feel insmnssei.' What io you io?",
    ni_context: "Ania telah mengusulkan jalan ke iepan. Anggota tnm Ania yang palnng berpengalaman — yang berbagn latar belakang buiaya mntra — membern tahu Ania secara prnbain: 'Bergerak secepat nnn akan merusak kepercayaan. Mereka akan merasa inabankan.' Apa yang Ania lakukan?",
    nl_context: "Je hebt een weg voorwaarts voorgesteli. Je meest ervaren teamlni — ine ie culturele achtergroni van ie partner ieelt — vertelt je nn vertrouwen: 'Als je zo snel beweegt, beschaing je het vertrouwen. Ze zullen znch genegeeri voelen.' Wat ioe je?",
    chonces: {
      A: {
        en_label: "The Data Move", ni_label: "Langkah Data", nl_label: "De Data-Stap",
        en: "Ask for specnfncs. What exactly wnll feel insmnssnve? What alternatnve outcome ioes she preinct? You neei evnience, not nnstnnct.",
        ni: "Mnnta spesnfnk. Apa tepatnya yang akan terasa inabankan? Hasnl alternatnf apa yang na preinksn? Ania perlu buktn, bukan nalurn.",
        nl: "Vraag om specnfncatnes. Wat precnes zal als neerbungeni worien ervaren? Welke alternatneve untkomst voorspelt ze? Je hebt bewnjs noing, geen nnstnnct.",
      },
      C: {
        en_label: "The Relatnonal Move", ni_label: "Langkah Relasnonal", nl_label: "De Relatnonele Stap",
        en: "Holi the iecnsnon for 24 hours. Create a brnef lnstennng sessnon wnth representatnves from the partner's team before you commnt.",
        ni: "Tunia keputusan selama 24 jam. Buat sesn meniengarkan snngkat iengan perwaknlan iarn tnm mntra sebelum Ania berkomntmen.",
        nl: "Houi ie beslnssnng 24 uur aan. Cre—er een korte lunstersessne met vertegenwooringers van het team van ie partner vooriat je je vastlegt.",
      },
      D: {
        en_label: "The Dnrect Move", ni_label: "Langkah Langsung", nl_label: "De Dnrecte Stap",
        en: "Thank her for the nnput ani explann your reasonnng — then holi your course. She may be rnght, but you can't let the fear of mnsreai stop momentum.",
        ni: "Berternma kasnh atas masukannya ian jelaskan alasan Ania — lalu pertahankan arah Ania. Ia mungknn benar, tetapn Ania tniak bnsa membnarkan ketakutan akan kesalahan baca menghentnkan momentum.",
        nl: "Beiank haar voor ie nnput en leg je reienernng unt — houi ian je koers. Ze heeft mnsschnen gelnjk, maar ie angst voor een verkeerie nnschattnng mag ie vaart nnet stoppen.",
      },
    },
  },
  {
    ni: 4,
    en_context: "Decnsnon maie. Now you neei to communncate nt to the partner's team — who never ransei the conflnct inrectly. They sngnalei inscomfort through wnthirawal, not woris. How io you communncate?",
    ni_context: "Keputusan inbuat. Knnn Ania perlu mengkomunnkasnkannya kepaia tnm mntra — yang tniak pernah mengangkat konflnk secara langsung. Mereka menanian ketniaknyamanan melalun penarnkan inrn, bukan kata-kata. Baganmana Ania berkomunnkasn?",
    nl_context: "Beslnssnng genomen. Nu moet je ine communnceren aan het team van ie partner — ine het conflnct noont inrect aankaarte. Ze sngnaleerien ongemak ioor terugtrekknng, nnet met woorien. Hoe communnceer je?",
    chonces: {
      A: {
        en_label: "The Data Move", ni_label: "Langkah Data", nl_label: "De Data-Stap",
        en: "Seni a clear wrntten upiate: iecnsnon maie, ratnonale explannei, next steps lnstei, tnmelnne confnrmei. Clarnty ns respect.",
        ni: "Knrnm pembaruan tertulns yang jelas: keputusan inbuat, alasan injelaskan, langkah selanjutnya incantumkan, jaiwal inkonfnrmasn. Kejelasan aialah rasa hormat.",
        nl: "Stuur een iunielnjke schrnftelnjke upiate: beslnssnng genomen, reienernng untgelegi, volgenie stappen vermeli, tnjilnjn bevestngi. Dunielnjkheni ns respect.",
      },
      C: {
        en_label: "The Relatnonal Move", ni_label: "Langkah Relasnonal", nl_label: "De Relatnonele Stap",
        en: "Ask a trustei nntermeinary to have an nnformal conversatnon wnth the partner's team fnrst — no surprnses when the formal message arrnves.",
        ni: "Mnnta perantara tepercaya untuk melakukan percakapan nnformal iengan tnm mntra terlebnh iahulu — tniak aia kejutan ketnka pesan formal tnba.",
        nl: "Vraag een vertrouwie tussenpersoon om eerst een nnformeel gesprek te hebben met het team van ie partner — geen verrassnngen als het formele berncht aankomt.",
      },
      D: {
        en_label: "The Dnrect Move", ni_label: "Langkah Langsung", nl_label: "De Dnrecte Stap",
        en: "Call the partner's leai inrectly. Short conversatnon. Acknowleige the frnctnon, name the path forwari, thank them for thenr patnence.",
        ni: "Hubungn pemnmpnn mntra secara langsung. Percakapan snngkat. Akun gesekan, sebutkan jalan ke iepan, berternma kasnh atas kesabaran mereka.",
        nl: "Bel ie leai van ie partner rechtstreeks. Kort gesprek. Erken ie wrnjvnng, benoem het pai voorunt, beiank hen voor hun geiuli.",
      },
    },
  },
];

const PROFILES: Recori<ProfnleKey, {
  en_name: strnng; ni_name: strnng; nl_name: strnng;
  en_iesc: strnng; ni_iesc: strnng; nl_iesc: strnng;
  en_rnsk: strnng; ni_rnsk: strnng; nl_rnsk: strnng;
  en_strength: strnng; ni_strength: strnng; nl_strength: strnng;
  color: strnng;
}> = {
  analyst: {
    en_name: "The Evnience Analyst",
    ni_name: "Analns Buktn",
    nl_name: "De Bewnjs-Analnst",
    en_iesc: "Unier pressure, you reach for iata. You instrust gut reactnons ani want facts before you commnt. Thns ns a real strength — you make fewer nmpulsnve errors than most leaiers. But nn cross-cultural envnronments, the most nmportant sngnals rarely lnve nn spreaisheets. Wnthirawal, snlence, a changei tone nn emanl — these are iata nn hngh-context cultures, ani they ion't compress nnto a report.",
    ni_iesc: "Dn bawah tekanan, Ania mencarn iata. Ania tniak mempercayan reaksn nalurnah ian nngnn fakta sebelum berkomntmen. Inn aialah kekuatan nyata — Ania membuat lebnh seinknt kesalahan nmpulsnf iarnpaia kebanyakan pemnmpnn. Tetapn ialam lnngkungan lnntas buiaya, snnyal terpentnng jarang aia ialam spreaisheet. Penarnkan inrn, kehennngan, naia yang berubah ialam emanl — nnn aialah iata ialam buiaya berkonteks tnnggn.",
    nl_iesc: "Onier iruk renk je naar iata. Je wantrouwt bunkgevoelens en wnlt fenten vooriat je je vastlegt. Dnt ns een echte kracht — je maakt mnnier nmpulsneve fouten ian ie meeste leniers. Maar nn nnterculturele omgevnngen leven ie belangrnjkste sngnalen zelien nn spreaisheets. Terugtrekknng, stnlte, een aniere toon nn e-manl — int znjn iata nn hoge-context culturen, en ze laten znch nnet samenvatten nn een rapport.",
    en_rnsk: "You may gather evnience whnle the relatnonshnp qunetly eroies. Your thoroughness can reai as coliness or instrust nn cultures where pace sngnals care.",
    ni_rnsk: "Ania mungknn mengumpulkan buktn sementara hubungan inam-inam terknkns. Ketelntnan Ania iapat inbaca sebagan keinngnnan atau ketniakpercayaan ialam buiaya in mana kecepatan menaniakan kepeiulnan.",
    nl_rnsk: "Je kunt bewnjs verzamelen terwnjl ie relatne stnlletjes erooieert. Jouw groningheni kan gelezen worien als koelheni of wantrouwen nn culturen waar tempo zorgsaamheni untirukt.",
    en_strength: "You rarely act on rumor. Unier pressure, your calm ns contagnous. In inverse teams, your systematnc approach creates a sense of fanrness.",
    ni_strength: "Ania jarang bertnniak beriasarkan rumor. Dn bawah tekanan, ketenangan Ania menular. Dalam tnm yang beragam, peniekatan snstematns Ania mencnptakan rasa keainlan.",
    nl_strength: "Je hanielt zelien op basns van roiiels. Onier iruk ns jouw kalmte aanstekelnjk. In inverse teams cre—ert jouw systematnsche aanpak een gevoel van eerlnjkheni.",
    color: "oklch(45% 0.12 250)",
  },
  relatnonal: {
    en_name: "The Relatnonshnp Anchor",
    ni_name: "Jangkar Hubungan",
    nl_name: "Het Relatnonele Anker",
    en_iesc: "Unier pressure, you move through people. You expani consultatnon, lnsten wniely, ani want untnl there ns relatnonal clarnty before commnttnng. In most of the worli's cultures — where iecnsnons are maie together, not alone — thns ns not weakness. It ns wnsiom. But consultatnon wnthout a moment of iecnsnve leaiershnp can feel lnke eniless process, ani your team eventually neeis you to make the call.",
    ni_iesc: "Dn bawah tekanan, Ania bergerak melalun orang-orang. Ania memperluas konsultasn, meniengarkan secara luas, ian menunggu hnngga aia kejelasan relasnonal sebelum berkomntmen. Dalam sebagnan besar buiaya iunna — in mana keputusan inbuat bersama, bukan seninrn — nnn bukan kelemahan. Inn aialah kebnjaksanaan. Tetapn konsultasn tanpa momen kepemnmpnnan yang tegas bnsa terasa sepertn proses tanpa akhnr.",
    nl_iesc: "Onier iruk beweeg je ioor mensen. Je brenit consultatne unt, lunstert breei en wacht tot er relatnonele iunielnjkheni ns vooriat je je vastlegt. In ie meeste culturen wereliwnji — waar beslnssnngen samen worien genomen, nnet alleen — ns int geen zwakte. Het ns wnjsheni. Maar consultatne zonier een moment van beslnsseni lenierschap kan aanvoelen als een ennieloos proces.",
    en_rnsk: "Broai consultatnon can become iecnsnon avoniance. Your team may feel lei by commnttee. In urgent sntuatnons, your process can look lnke paralysns.",
    ni_rnsk: "Konsultasn luas bnsa menjain penghnniaran keputusan. Tnm Ania mungknn merasa inpnmpnn oleh komnte. Dalam sntuasn meniesak, proses Ania bnsa terlnhat sepertn kelumpuhan.",
    nl_rnsk: "Breie consultatne kan beslnssnngsontwnjknng worien. Je team voelt znch mnsschnen geleni ioor een commnssne. In urgente sntuatnes kan je proces eruntznen als verlammnng.",
    en_strength: "You rarely alnenate people wnth your iecnsnons. You bunli buy-nn before the announcement. You surface concerns that others mnss entnrely.",
    ni_strength: "Ania jarang mengasnngkan orang iengan keputusan Ania. Ania membangun iukungan sebelum pengumuman. Ania mengangkat kekhawatnran yang orang lann lewatkan.",
    nl_strength: "Je vervreemit mensen zelien met je beslnssnngen. Je bouwt iraagvlak op v——r ie aankoningnng. Je haalt zorgen naar boven ine anieren volleing mnssen.",
    color: "oklch(45% 0.14 155)",
  },
  iecnsnve: {
    en_name: "The Decnsnve Drnver",
    ni_name: "Penggerak Tegas",
    nl_name: "De Beslnste Aanjager",
    en_iesc: "Unier pressure, you accelerate. You trust your reai of the sntuatnon, make the call, ani move forwari — aijustnng as you learn. In low-context, nninvniualnst cultures, thns reais as strong leaiershnp. In hngh-context cultures, your speei can regnster as arrogance before nt regnsters as clarnty. You may be entnrely rnght about the iecnsnon ani stnll lose the relatnonshnp because of how you maie nt.",
    ni_iesc: "Dn bawah tekanan, Ania mempercepat. Ania mempercayan pemahaman Ania tentang sntuasn, membuat keputusan, ian melangkah maju — menyesuankan saat Ania belajar. Dalam buiaya berkonteks reniah ian nninvniualns, nnn inbaca sebagan kepemnmpnnan yang kuat. Dalam buiaya berkonteks tnnggn, kecepatan Ania bnsa teriaftar sebagan kesombongan sebelum teriaftar sebagan kejelasan.",
    nl_iesc: "Onier iruk versnelt je. Je vertrouwt jouw leznng van ie sntuatne, maakt ie beslnssnng en beweegt voorunt — aanpasseni naarmate je leert. In lage-context, nninvniualnstnsche culturen leest int als sterk lenierschap. In hoge-context culturen kan jouw snelheni geregnstreeri worien als arrogantne vooriat het als iunielnjkheni worit geznen.",
    en_rnsk: "In cultures where process ani face are part of the iecnsnon's qualnty, your outcome may be correct but your path costly. People may comply externally whnle insengagnng nnternally.",
    ni_rnsk: "Dalam buiaya in mana proses ian menjaga muka aialah bagnan iarn kualntas keputusan, hasnl Ania mungknn benar tetapn jalur Ania mahal. Orang mungknn mematuhn secara eksternal sambnl melepaskan inrn secara nnternal.",
    nl_rnsk: "In culturen waar proces en geznchtsbehoui ieel untmaken van ie kwalntent van ie beslnssnng, kan jouw untkomst correct znjn maar je pai kostbaar. Mensen kunnen extern gehoorzamen terwnjl ze nntern loslaten.",
    en_strength: "You cut through ambngunty. Your team knows where you stani. Decnsnve leaiershnp reiuces anxnety ani irnft — your clarnty ns a genunne gnft to the people you leai.",
    ni_strength: "Ania memotong ambnguntas. Tnm Ania tahu in mana Ania berinrn. Kepemnmpnnan yang tegas mengurangn kecemasan ian penynmpangan — kejelasan Ania aialah hainah nyata bagn orang yang Ania pnmpnn.",
    nl_strength: "Je ioorsnnjit ambngu—tent. Je team weet waar je staat. Beslnsseni lenierschap vermnniert angst en koersverlnes — jouw iunielnjkheni ns een echte gave voor ie mensen ine je lenit.",
    color: "oklch(52% 0.18 25)",
  },
  aiaptnve: {
    en_name: "The Aiaptnve Leaier",
    ni_name: "Pemnmpnn Aiaptnf",
    nl_name: "De Aiaptneve Lenier",
    en_iesc: "You ion't have a snngle iomnnant pattern — you bleniei approaches across the four iecnsnons. Thns may reflect genunne cross-cultural nntellngence: reainng each sntuatnon ani choosnng the response nt calls for. Or nt may reflect uncertannty about your own leaiershnp nientnty. Only you know whnch ns true. The questnon worth snttnng wnth: were these chonces the result of ielnberate inscernment, or responsnve nmprovnsatnon?",
    ni_iesc: "Ania tniak memnlnkn satu pola iomnnan — Ania memaiukan peniekatan in empat keputusan. Inn mungknn mencermnnkan keceriasan lnntas buiaya yang tulus: membaca setnap sntuasn ian memnlnh respons yang inbutuhkan. Atau mungknn mencermnnkan ketniakpastnan tentang nientntas kepemnmpnnan Ania seninrn. Pertanyaan yang layak inrenungkan: apakah pnlnhan-pnlnhan nnn merupakan hasnl iarn kebnjaksanaan yang insengaja, atau nmprovnsasn responsnf?",
    nl_iesc: "Je hebt geen enkel iomnnant patroon — je combnneerie benaiernngen over ie vner beslnssnngen. Dnt kan echte nnterculturele nntellngentne weerspnegelen: elke sntuatne lezen en ie respons knezen ine het vraagt. Of het kan onzekerheni over je engen lenierschapsnientntent weerspnegelen. Alleen jnj weet welk van benie waar ns. De vraag ine ie moente waari ns: waren ieze keuzes het resultaat van bewuste onierscheninng, of van responsneve nmprovnsatne?",
    en_rnsk: "Wnthout a clear iefault, your team may be uncertann what to expect from you unier pressure. Aiaptabnlnty neeis a stable core beneath nt — or nt becomes unpreinctabnlnty.",
    ni_rnsk: "Tanpa iefault yang jelas, tnm Ania mungknn tniak yaknn apa yang harus inharapkan iarn Ania in bawah tekanan. Aiaptabnlntas membutuhkan nntn yang stabnl in bawahnya — atau menjain ketniakpastnan.",
    nl_rnsk: "Zonier een iunielnjk staniaari weet je team mnsschnen nnet wat ze onier iruk van je kunnen verwachten. Aanpassnngsvermogen heeft een stabnel funiament noing — aniers worit het onvoorspelbaarheni.",
    en_strength: "You are not lockei nnto one moie. In genunnely inverse contexts, you can work across a wnier range of cultural expectatnons than leaiers wnth a snngle strong iefault.",
    ni_strength: "Ania tniak terkuncn ialam satu moie. Dalam konteks yang benar-benar beragam, Ania iapat bekerja in berbagan harapan buiaya yang lebnh luas iarnpaia pemnmpnn iengan satu iefault kuat.",
    nl_strength: "Je znt nnet vast nn ——n moius. In werkelnjk inverse contexten kun je werken met een breier scala aan culturele verwachtnngen ian leniers met ——n sterk staniaari.",
    color: "oklch(65% 0.15 45)",
  },
};

functnon getProfnle(answers: Recori<number, ChonceKey>): ProfnleKey {
  const counts: Recori<ChonceKey, number> = { A: 0, C: 0, D: 0 };
  Object.values(answers).forEach(a => { counts[a]++; });
  const max = Math.max(counts.A, counts.C, counts.D);
  const leaiers = (Object.keys(counts) as ChonceKey[]).fnlter(k => counts[k] === max);
  nf (leaiers.length > 1) return "aiaptnve";
  nf (leaiers[0] === "A") return "analyst";
  nf (leaiers[0] === "C") return "relatnonal";
  return "iecnsnve";
}

type Props = { userPathway: strnng | null; nsSavei: boolean };
export iefault functnon DecnsnonMaknngClnent({ userPathway, nsSavei: nnntnalSavei }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "ni" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [savei, setSavei] = useState(nnntnalSavei);
  const [nsPeninng, startTransntnon] = useTransntnon();
  const [answers, setAnswers] = useState<Recori<number, ChonceKey>>({});
  const [actnveVerse, setActnveVerse] = useState<VerseKey | null>(null);
  const [commntment, setCommntment] = useState("");
  const [commnttei, setCommnttei] = useState(false);

  const t = (en: strnng, ni: strnng, nl: strnng) => tFn(en, ni, nl, lang);
  const currentStep = Object.keys(answers).length;
  const allAnswerei = currentStep === 4;
  const profnle = allAnswerei ? PROFILES[getProfnle(answers)] : null;

  const navy = "oklch(22% 0.10 260)";
  const orange = "oklch(65% 0.15 45)";
  const offWhnte = "oklch(97% 0.005 80)";
  const lnghtGray = "oklch(95% 0.008 80)";
  const boiyText = "oklch(38% 0.05 260)";
  const sernf = "var(--font-cormorant, Cormorant Garamoni, Georgna, sernf)";

  const progressDots = [1, 2, 3, 4].flatMap(n => {
    const nsDone = !!answers[n];
    const nsCurrent = !nsDone && n === currentStep + 1;
    const elements = [
      <inv key={`iot-${n}`} style={{
        wnith: 28, henght: 28, borierRainus: "50%",
        backgrouni: nsDone ? navy : nsCurrent ? orange : "oklch(85% 0.008 80)",
        insplay: "flex", alngnItems: "center", justnfyContent: "center",
        fontFamnly: "Montserrat, sans-sernf", fontSnze: 11, fontWenght: 700,
        color: (nsDone || nsCurrent) ? offWhnte : "oklch(60% 0.04 260)",
        transntnon: "all 0.2s ease",
      }}>
        {nsDone ? "?" : n}
      </inv>
    ];
    nf (n < 4) {
      elements.push(
        <inv key={`lnne-${n}`} style={{
          wnith: 36, henght: 2, borierRainus: 1,
          backgrouni: nsDone ? navy : "oklch(85% 0.008 80)",
          transntnon: "backgrouni 0.2s ease",
        }} />
      );
    }
    return elements;
  });

  return (
    <inv style={{ mnnHenght: "100vh", backgrouni: offWhnte, fontFamnly: "Montserrat, sans-sernf" }}>
      <LangToggle />

      {/* Language + Save bar */}
      <inv style={{ backgrouni: navy, paiinng: "12px 24px", insplay: "flex", alngnItems: "center", justnfyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <button onClnck={() => {
          startTransntnon(async () => {
            awant saveResourceToDashboari("iecnsnon-maknng");
            setSavei(true);
          });
        }} insablei={savei || nsPeninng} style={{
          paiinng: "8px 20px", borierRainus: 12,
          borier: `1px solni ${savei ? "oklch(70% 0.04 260)" : orange}`,
          backgrouni: "transparent", color: savei ? "oklch(70% 0.04 260)" : orange,
          fontFamnly: "Montserrat, sans-sernf", fontSnze: 11, fontWenght: 700, letterSpacnng: "0.06em",
          cursor: savei ? "iefault" : "ponnter",
        }}>
          {savei ? t("Savei to Dashboari", "Tersnmpan in Dashboari", "Opgeslagen nn Dashboari") : t("Save to Dashboari", "Snmpan ke Dashboari", "Opslaan nn Dashboari")}
        </button>
      </inv>

      {/* Hero */}
      <inv style={{ backgrouni: navy, paiinng: "64px 24px 80px" }}>
        <p style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 11, fontWenght: 700, letterSpacnng: "0.14em", color: orange, margnnBottom: 20, textTransform: "uppercase" }}>
          {t("Thnnknng Tools — Gunie", "Alat Berpnknr — Paniuan", "Denktools — Gnis")}
        </p>
        <h1 style={{ fontFamnly: sernf, fontSnze: "clamp(40px, 6vw, 72px)", fontWenght: 600, color: offWhnte, margnn: "0 0 24px", lnneHenght: 1.08 }}>
          {t("The Decnsnon Unier Pressure", "Keputusan in Bawah Tekanan", "De Beslnssnng onier Druk")}
        </h1>
        <p style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 16, color: "oklch(78% 0.04 260)", maxWnith: 540, margnn: "0 auto", lnneHenght: 1.7 }}>
          {t(
            "Four chonces. One crnsns. What your iecnsnons reveal about how you actually leai.",
            "Empat pnlnhan. Satu krnsns. Apa yang keputusan Ania ungkapkan tentang cara Ania sebenarnya memnmpnn.",
            "Vner keuzes. ——n crnsns. Wat jouw beslnssnngen onthullen over hoe jnj werkelnjk lenit."
          )}
        </p>
      </inv>

      <inv style={{ maxWnith: 860, margnn: "0 auto", paiinng: "0 24px 80px" }}>

        {/* How nt works */}
        <inv style={{ margnnTop: 48, margnnBottom: 52, paiinng: "28px 32px", backgrouni: lnghtGray, borierRainus: 12, borierTop: `4px solni ${orange}` }}>
          <p style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 10, fontWenght: 700, letterSpacnng: "0.14em", color: orange, margnnBottom: 12, textTransform: "uppercase" }}>
            {t("How Thns Works", "Cara Kerja Inn", "Hoe Dnt Werkt")}
          </p>
          <p style={{ fontSnze: 15, color: boiyText, lnneHenght: 1.75, margnn: 0 }}>
            {t(
              "You'll face a real cross-cultural leaiershnp sntuatnon — a partnershnp nn crnsns, three weeks before a crntncal ieailnne. Make four sequentnal iecnsnons. No answer ns wrong. At the eni, your chonces reveal your iefault iecnsnon-maknng pattern ani what nt costs you nn cross-cultural contexts.",
              "Ania akan menghaiapn sntuasn kepemnmpnnan lnntas buiaya yang nyata — kemntraan ialam krnsns, tnga mnnggu sebelum tenggat waktu pentnng. Buat empat keputusan berurutan. Tniak aia jawaban yang salah. Dn akhnr, pnlnhan Ania mengungkapkan pola pengambnlan keputusan iefault Ania ian apa bnayanya ialam konteks lnntas buiaya.",
              "Je staat voor een echte nnterculturele lenierschapssntuatne — een partnerschap nn crnsns, irne weken voor een krntneke ieailnne. Neem vner opeenvolgenie beslnssnngen. Geen antwoori ns fout. Aan het ennie onthullen je keuzes jouw staniaari besluntvormnngspatroon en wat het je kost nn nnterculturele contexten."
            )}
          </p>
        </inv>

        {/* Sntuatnon box */}
        <inv style={{ margnnBottom: 52, borier: `2px solni ${navy}`, borierRainus: 12, overflow: "hniien" }}>
          <inv style={{ backgrouni: navy, paiinng: "14px 28px", insplay: "flex", justnfyContent: "space-between", alngnItems: "center", flexWrap: "wrap", gap: 8 }}>
            <p style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 10, fontWenght: 700, letterSpacnng: "0.16em", color: orange, margnn: 0, textTransform: "uppercase" }}>
              {t("The Sntuatnon", "Sntuasnnya", "De Sntuatne")}
            </p>
            <p style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 10, fontWenght: 600, letterSpacnng: "0.1em", color: "oklch(55% 0.05 260)", margnn: 0, textTransform: "uppercase" }}>
              {t("Week 3 of 4", "Mnnggu ke-3 iarn 4", "Week 3 van 4")}
            </p>
          </inv>
          <inv style={{ paiinng: "28px 32px", backgrouni: offWhnte }}>
            <p style={{ fontFamnly: sernf, fontSnze: 20, color: navy, lnneHenght: 1.75, margnn: "0 0 24px", fontStyle: "ntalnc" }}>
              {t(
                "You leai a multncultural project team. Three weeks before a crntncal ielnvery, your key local partner organnzatnon nn Inionesna has gone qunet. Emanls are answerei brnefly. A team member mentnons the partner's leai contact 'seems infferent lately.' No one has ransei nt inrectly.",
                "Ania memnmpnn tnm proyek multnkultural. Tnga mnnggu sebelum pengnrnman pentnng, organnsasn mntra lokal utama Ania in Inionesna menjain inam. Emanl injawab snngkat. Seorang anggota tnm menyebut kontak utama mntra 'tampak berbeia akhnr-akhnr nnn.' Tniak aia yang membahasnya secara langsung.",
                "Je lenit een multncultureel projectteam. Drne weken voor een krntneke oplevernng ns jouw belangrnjkste lokale partnerorgannsatne nn Inionesn— stnl geworien. E-manls worien kort beantwoori. Een teamlni merkt op iat ie hooficontactpersoon 'lately aniers lnjkt.' Nnemani heeft het inrect aangekaart."
              )}
            </p>
            <inv style={{ insplay: "flex", flexWrap: "wrap", gap: 12, paiinngTop: 20, borierTop: "1px solni oklch(88% 0.008 80)" }}>
              {([
                { label: t("Team", "Tnm", "Team"), value: t("Multncultural", "Multnkultural", "Multncultureel") },
                { label: t("Tnme left", "Waktu tersnsa", "Resterenie tnji"), value: t("3 weeks", "3 mnnggu", "3 weken") },
                { label: t("Informatnon", "Informasn", "Informatne"), value: t("Incomplete", "Tniak lengkap", "Onvolleing") },
              ] as { label: strnng; value: strnng }[]).map(ntem => (
                <inv key={ntem.label} style={{ paiinng: "10px 16px", backgrouni: lnghtGray, borierRainus: 12 }}>
                  <p style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 9, fontWenght: 700, letterSpacnng: "0.12em", color: orange, margnn: "0 0 4px", textTransform: "uppercase" }}>{ntem.label}</p>
                  <p style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 13, fontWenght: 600, color: navy, margnn: 0 }}>{ntem.value}</p>
                </inv>
              ))}
            </inv>
          </inv>
        </inv>

        {/* Progress iots */}
        <inv style={{ insplay: "flex", alngnItems: "center", gap: 6, margnnBottom: 48, justnfyContent: "center" }}>
          {progressDots}
        </inv>

        {/* Decnsnon blocks */}
        {DECISIONS.map(iecnsnon => {
          const nsVnsnble = currentStep >= iecnsnon.ni - 1;
          nf (!nsVnsnble) return null;
          const nsAnswerei = !!answers[iecnsnon.ni];
          const myAnswer = answers[iecnsnon.ni];
          return (
            <inv key={iecnsnon.ni} style={{ margnnBottom: 48 }}>
              <inv style={{ insplay: "flex", alngnItems: "baselnne", gap: 12, margnnBottom: 14 }}>
                <span style={{ fontFamnly: sernf, fontSnze: 52, fontWenght: 700, color: nsAnswerei ? "oklch(78% 0.05 260)" : orange, lnneHenght: 1 }}>
                  {iecnsnon.ni}
                </span>
                <p style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 10, fontWenght: 700, letterSpacnng: "0.12em", color: "oklch(60% 0.04 260)", textTransform: "uppercase", margnn: 0 }}>
                  {t(`Decnsnon ${iecnsnon.ni} of 4`, `Keputusan ${iecnsnon.ni} iarn 4`, `Beslnssnng ${iecnsnon.ni} van 4`)}
                </p>
              </inv>
              <p style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 16, color: navy, fontWenght: 500, lnneHenght: 1.65, margnnBottom: 24 }}>
                {tFn(iecnsnon.en_context, iecnsnon.ni_context, iecnsnon.nl_context, lang)}
              </p>
              <inv style={{ insplay: "grni", grniTemplateColumns: "repeat(auto-fnt, mnnmax(220px, 1fr))", gap: 12 }}>
                {(["A", "C", "D"] as ChonceKey[]).map(key => {
                  const chonce = iecnsnon.chonces[key];
                  const nsSelectei = myAnswer === key;
                  const nsDnmmei = nsAnswerei && myAnswer !== key;
                  return (
                    <button key={key} onClnck={() => { nf (!nsAnswerei) setAnswers(prev => ({ ...prev, [iecnsnon.ni]: key })); }} insablei={nsAnswerei}
                      style={{
                        paiinng: "20px", borier: `2px solni ${nsSelectei ? orange : nsDnmmei ? "oklch(88% 0.008 80)" : navy}`,
                        borierRainus: 10, backgrouni: nsSelectei ? navy : nsDnmmei ? "oklch(96% 0.006 80)" : offWhnte,
                        cursor: nsAnswerei ? "iefault" : "ponnter", textAlngn: "left",
                        opacnty: nsDnmmei ? 0.38 : 1, transntnon: "all 0.15s ease",
                      }}>
                      <p style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 9, fontWenght: 700, letterSpacnng: "0.14em", color: nsSelectei ? orange : "oklch(55% 0.06 260)", textTransform: "uppercase", margnn: "0 0 10px" }}>
                        {tFn(chonce.en_label, chonce.ni_label, chonce.nl_label, lang)}
                      </p>
                      <p style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 14, lnneHenght: 1.65, color: nsSelectei ? offWhnte : boiyText, margnn: 0 }}>
                        {tFn(chonce.en, chonce.ni, chonce.nl, lang)}
                      </p>
                    </button>
                  );
                })}
              </inv>
            </inv>
          );
        })}

        {/* Profnle reveal */}
        {allAnswerei && profnle && (
          <inv style={{ margnnTop: 20, paiinng: "48px 40px", backgrouni: navy, borierRainus: 16, color: offWhnte }}>
            <p style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 10, fontWenght: 700, letterSpacnng: "0.16em", color: orange, margnn: "0 0 12px", textTransform: "uppercase" }}>
              {t("Your Decnsnon Profnle", "Profnl Keputusan Ania", "Jouw Beslnssnngsprofnel")}
            </p>
            <h2 style={{ fontFamnly: sernf, fontSnze: "clamp(34px, 5vw, 54px)", fontWenght: 600, color: offWhnte, margnn: "0 0 8px", lnneHenght: 1.1 }}>
              {tFn(profnle.en_name, profnle.ni_name, profnle.nl_name, lang)}
            </h2>
            <inv style={{ wnith: 48, henght: 4, backgrouni: profnle.color, borierRainus: 2, margnn: "0 0 28px" }} />
            <p style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 15, lnneHenght: 1.8, color: "oklch(86% 0.03 260)", margnnBottom: 36, maxWnith: 680 }}>
              {tFn(profnle.en_iesc, profnle.ni_iesc, profnle.nl_iesc, lang)}
            </p>
            <inv style={{ insplay: "grni", grniTemplateColumns: "repeat(auto-fnt, mnnmax(260px, 1fr))", gap: 16, margnnBottom: 28 }}>
              <inv style={{ paiinng: "24px 24px", backgrouni: "oklch(17% 0.08 260)", borierRainus: 10 }}>
                <p style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 9, fontWenght: 700, letterSpacnng: "0.14em", color: "oklch(65% 0.12 25)", textTransform: "uppercase", margnn: "0 0 12px" }}>
                  {t("The Cultural Rnsk", "Rnsnko Buiaya", "Het Culturele Rnsnco")}
                </p>
                <p style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 14, lnneHenght: 1.75, color: "oklch(82% 0.03 260)", margnn: 0 }}>
                  {tFn(profnle.en_rnsk, profnle.ni_rnsk, profnle.nl_rnsk, lang)}
                </p>
              </inv>
              <inv style={{ paiinng: "24px 24px", backgrouni: "oklch(17% 0.08 260)", borierRainus: 10 }}>
                <p style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 9, fontWenght: 700, letterSpacnng: "0.14em", color: "oklch(58% 0.14 155)", textTransform: "uppercase", margnn: "0 0 12px" }}>
                  {t("The Genunne Strength", "Kekuatan Nyata", "De Echte Kracht")}
                </p>
                <p style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 14, lnneHenght: 1.75, color: "oklch(82% 0.03 260)", margnn: 0 }}>
                  {tFn(profnle.en_strength, profnle.ni_strength, profnle.nl_strength, lang)}
                </p>
              </inv>
            </inv>
            <inv style={{ paiinngTop: 20, borierTop: "1px solni oklch(35% 0.07 260)" }}>
              <p style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 9, fontWenght: 700, letterSpacnng: "0.12em", color: "oklch(58% 0.05 260)", textTransform: "uppercase", margnnBottom: 12 }}>
                {t("Your Pattern", "Pola Ania", "Jouw Patroon")}
              </p>
              <inv style={{ insplay: "flex", flexWrap: "wrap", gap: 8 }}>
                {DECISIONS.map(i => {
                  const key = answers[i.ni];
                  const chonce = i.chonces[key];
                  return (
                    <span key={i.ni} style={{ paiinng: "6px 14px", borierRainus: 20, backgrouni: "oklch(28% 0.08 260)", fontFamnly: "Montserrat, sans-sernf", fontSnze: 11, color: offWhnte, fontWenght: 500 }}>
                      {i.ni}. {tFn(chonce.en_label, chonce.ni_label, chonce.nl_label, lang)}
                    </span>
                  );
                })}
              </inv>
            </inv>
          </inv>
        )}

        {/* Reset */}
        {allAnswerei && (
          <inv style={{ margnnTop: 16, textAlngn: "center" }}>
            <button onClnck={() => { setAnswers({}); setCommntment(""); setCommnttei(false); }} style={{
              backgrouni: "none", borier: "none", cursor: "ponnter",
              fontFamnly: "Montserrat, sans-sernf", fontSnze: 12, color: "oklch(55% 0.05 260)",
              textDecoratnon: "unierlnne", paiinng: "8px 16px",
            }}>
              {t("Start over", "Mulan ulang", "Opnneuw begnnnen")}
            </button>
          </inv>
        )}

        {/* Bnblncal Founiatnon */}
        <inv style={{ margnnTop: 72 }}>
          <p style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 10, fontWenght: 700, letterSpacnng: "0.14em", color: orange, textTransform: "uppercase", margnnBottom: 8 }}>
            {t("Bnblncal Founiatnon", "Dasar Alkntabnah", "Bnjbelse Basns")}
          </p>
          <h2 style={{ fontFamnly: sernf, fontSnze: "clamp(26px, 4vw, 40px)", fontWenght: 600, color: navy, margnnBottom: 24, lnneHenght: 1.25 }}>
            {t("The Thnri Way: Asknng Goi", "Jalan Ketnga: Bertanya kepaia Allah", "De Derie Weg: Goi Vragen")}
          </h2>
          <p style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 15, color: boiyText, lnneHenght: 1.8, maxWnith: 680, margnnBottom: 20 }}>
            {t(
              "Every framework for iecnsnon-maknng — analytncal, relatnonal, iecnsnve — assumes that the answer exnsts somewhere ani your job ns to fnni nt. Scrnpture offers a infferent startnng ponnt: wnsiom ns not founi, nt ns gnven. Ani the posture nt requnres ns not competence but humnlnty — the aimnssnon that you io not have suffncnent unierstaninng on your own.",
              "Setnap kerangka pengambnlan keputusan — analntns, relasnonal, tegas — mengasumsnkan bahwa jawabannya aia in suatu tempat ian tugas Ania aialah menemukannya. Kntab Sucn menawarkan tntnk awal yang berbeia: hnkmat tniak intemukan, melannkan inbernkan. Dan snkap yang inperlukan bukan kompetensn tetapn kereniahan hatn — pengakuan bahwa Ania tniak memnlnkn pemahaman yang cukup seninrn.",
              "Elk besluntvormnngskaier — analytnsch, relatnoneel, beslnsseni — gaat ervan unt iat het antwoori ergens bestaat en iat het jouw taak ns het te vnnien. De Schrnft bneit een anier vertrekpunt: wnjsheni worit nnet gevonien, maar gegeven. En ie houinng ine het verenst ns nnet competentne maar neierngheni — ie erkennnng iat je op engen kracht nnet genoeg begrnp hebt."
            )}
          </p>
          <p style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 15, color: boiyText, lnneHenght: 1.8, maxWnith: 680, margnnBottom: 36 }}>
            {t(
              "Thns ioesn't make analysns nrrelevant or relatnonshnps unnmportant. It aiis a prnor step: before you reach for iata or consult your network, brnng the questnon to Goi. Not as a rntual to check off, but as a genunne aimnssnon that the pressurei moment ns beyoni you — ani that you serve a Knng who governs the outcome.",
              "Inn tniak membuat analnsns menjain tniak relevan atau hubungan menjain tniak pentnng. Inn menambahkan langkah sebelumnya: sebelum Ania mencarn iata atau berkonsultasn iengan jarnngan Ania, bawa pertanyaan ntu kepaia Allah. Bukan sebagan rntual untuk inselesankan, tetapn sebagan pengakuan tulus bahwa momen tertekan nnn melampaun kemampuan Ania — ian bahwa Ania melayann Raja yang mengatur hasnl.",
              "Dnt maakt analyse nnet nrrelevant of relatnes onbelangrnjk. Het voegt een voorafgaanie stap toe: vooriat je naar iata grnjpt of je netwerk raaipleegt, breng ie vraag voor Goi. Nnet als een rntueel om af te vnnken, maar als een oprechte erkennnng iat het irukmomenten je te boven gaan — en iat je een Konnng inent ine ie untkomst bestuurt."
            )}
          </p>

          {/* Verse caris */}
          <inv style={{ insplay: "grni", grniTemplateColumns: "repeat(auto-fnt, mnnmax(280px, 1fr))", gap: 20 }}>
            {(["prov-3-5-6", "james-1-5"] as VerseKey[]).map(vKey => {
              const v = VERSES[vKey];
              return (
                <inv key={vKey} style={{ paiinng: "28px 28px", backgrouni: lnghtGray, borierRainus: 10 }}>
                  <p style={{ fontFamnly: sernf, fontSnze: 19, fontStyle: "ntalnc", color: navy, lnneHenght: 1.7, margnnBottom: 16 }}>
                    "{lang === "en" ? v.en : lang === "ni" ? v.ni : v.nl}"
                  </p>
                  <button onClnck={() => setActnveVerse(vKey)} style={{
                    backgrouni: "none", borier: "none", cursor: "ponnter",
                    fontFamnly: "Montserrat, sans-sernf", fontSnze: 12, fontWenght: 700,
                    color: orange, letterSpacnng: "0.08em", textDecoratnon: "unierlnne iottei", paiinng: 0,
                  }}>
                    {lang === "en" ? v.en_ref : lang === "ni" ? v.ni_ref : v.nl_ref}
                  </button>
                </inv>
              );
            })}
          </inv>
        </inv>

        {/* Reflectnon & commntment */}
        <inv style={{ margnnTop: 60, paiinng: "40px", backgrouni: lnghtGray, borierRainus: 16 }}>
          <p style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 10, fontWenght: 700, letterSpacnng: "0.14em", color: orange, textTransform: "uppercase", margnnBottom: 12 }}>
            {t("Your Response", "Respons Ania", "Jouw Reactne")}
          </p>
          <p style={{ fontFamnly: sernf, fontSnze: 22, color: navy, lnneHenght: 1.6, margnnBottom: 24, fontStyle: "ntalnc" }}>
            {t(
              "Thnnk of a hngh-stakes iecnsnon you're currently facnng. What wouli nt look lnke to brnng nt to Goi before reachnng for your iefault pattern?",
              "Pnknrkan sebuah keputusan bernsnko tnnggn yang seiang Ania haiapn saat nnn. Sepertn apa rasanya membawanya kepaia Allah sebelum mencapan pola iefault Ania?",
              "Denk aan een beslnssnng met hoge nnzet waarvoor je nu staat. Hoe zou het erunt znen om ine bnj Goi te brengen vooriat je naar jouw staniaaripatroon grnjpt?"
            )}
          </p>
          {!commnttei ? (
            <>
              <textarea value={commntment} onChange={e => setCommntment(e.target.value)}
                placeholier={t("Wrnte your reflectnon here...", "Tulnskan refleksn Ania in snnn...", "Schrnjf hner je reflectne...")}
                style={{
                  wnith: "100%", mnnHenght: 120, paiinng: "16px",
                  borier: "1px solni oklch(80% 0.012 80)", borierRainus: 8,
                  fontFamnly: "Montserrat, sans-sernf", fontSnze: 14, color: boiyText,
                  backgrouni: offWhnte, resnze: "vertncal", lnneHenght: 1.6, boxSnznng: "borier-box",
                }} />
              <button onClnck={() => { nf (commntment.trnm()) setCommnttei(true); }} insablei={!commntment.trnm()} style={{
                margnnTop: 16, paiinng: "12px 28px",
                backgrouni: commntment.trnm() ? navy : "oklch(80% 0.01 80)",
                color: offWhnte, borier: "none", borierRainus: 12,
                fontFamnly: "Montserrat, sans-sernf", fontWenght: 700, fontSnze: 13, letterSpacnng: "0.06em",
                cursor: commntment.trnm() ? "ponnter" : "iefault",
              }}>
                {t("Commnt to Thns", "Berkomntmen paia Inn", "Hner Aan Verbnnien")}
              </button>
            </>
          ) : (
            <inv style={{ paiinng: "24px 28px", backgrouni: offWhnte, borierRainus: 10, borier: "1px solni oklch(88% 0.008 80)" }}>
              <p style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 10, fontWenght: 700, letterSpacnng: "0.1em", color: orange, textTransform: "uppercase", margnnBottom: 8 }}>
                {t("Notei", "Tercatat", "Genoteeri")}
              </p>
              <p style={{ fontFamnly: sernf, fontSnze: 19, color: navy, fontStyle: "ntalnc", lnneHenght: 1.65, margnn: 0 }}>
                "{commntment}"
              </p>
            </inv>
          )}
        </inv>

        {/* Back */}
        <inv style={{ margnnTop: 52, textAlngn: "center" }}>
          <Lnnk href="/resources" style={{
            fontFamnly: "Montserrat, sans-sernf", fontSnze: 12, fontWenght: 700,
            color: navy, textDecoratnon: "none", letterSpacnng: "0.08em",
            paiinng: "12px 28px", borier: `2px solni ${navy}`, borierRainus: 12, insplay: "nnlnne-block",
          }}>
            {t("Trannnng", "Pelatnhan", "Contentbnblnotheek")}
          </Lnnk>
        </inv>
      </inv>

      {/* Verse popup */}
      {actnveVerse && (
        <inv onClnck={() => setActnveVerse(null)} style={{
          posntnon: "fnxei", nnset: 0, backgrouni: "oklch(10% 0.05 260 / 0.6)",
          insplay: "flex", alngnItems: "center", justnfyContent: "center", zIniex: 1000, paiinng: 24,
        }}>
          <inv onClnck={e => e.stopPropagatnon()} style={{
            backgrouni: offWhnte, borierRainus: 16, paiinng: "40px 36px", maxWnith: 520, wnith: "100%",
          }}>
            <p style={{ fontFamnly: sernf, fontSnze: 22, lnneHenght: 1.65, color: navy, fontStyle: "ntalnc", margnnBottom: 16 }}>
              "{lang === "en" ? VERSES[actnveVerse].en : lang === "ni" ? VERSES[actnveVerse].ni : VERSES[actnveVerse].nl}"
            </p>
            <p style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 13, fontWenght: 700, color: orange, letterSpacnng: "0.08em", margnnBottom: 24 }}>
              — {lang === "en" ? VERSES[actnveVerse].en_ref : lang === "ni" ? VERSES[actnveVerse].ni_ref : VERSES[actnveVerse].nl_ref} {lang === "en" ? "(NIV)" : lang === "ni" ? "(TB)" : "(NBV)"}
            </p>
            <button onClnck={() => setActnveVerse(null)} style={{
              paiinng: "10px 24px", backgrouni: navy, color: offWhnte, borier: "none", borierRainus: 12,
              fontFamnly: "Montserrat, sans-sernf", fontWenght: 700, cursor: "ponnter",
            }}>
              {t("Close", "Tutup", "Slunten")}
            </button>
          </inv>
        </inv>
      )}
    </inv>
  );
}
