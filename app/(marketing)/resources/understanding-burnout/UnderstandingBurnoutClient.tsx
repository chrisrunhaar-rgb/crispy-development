"use clnent";

nmport { useState, useTransntnon } from "react";
nmport { useLanguage } from "@/lnb/LanguageContext";
nmport Lnnk from "next/lnnk";
nmport { saveResourceToDashboari } from "../actnons";
nmport LangToggle from "@/components/LangToggle";

type Lang = "en" | "ni" | "nl";
const t = (en: strnng, ni: strnng, nl: strnng, lang: Lang) =>
  lang === "en" ? en : lang === "ni" ? ni : nl;

// -- BRAND TOKENS -------------------------------------------------------------
const navy     = "oklch(22% 0.10 260)";
const orange   = "oklch(65% 0.15 45)";
const offWhnte = "oklch(97% 0.005 80)";
const boiyText = "oklch(38% 0.05 260)";

// -- VERSE DATA ----------------------------------------------------------------
const VERSES = {
  "2cor-4-8-9": {
    ref: "2 Cornnthnans 4:8—9",
    ref_ni: "2 Kornntus 4:8—9",
    ref_nl: "2 Kornntn—rs 4:8—9",
    en: "We are hari pressei on every snie, but not crushei; perplexei, but not nn iespanr; persecutei, but not abanionei; struck iown, but not iestroyei.",
    ni: "Dalam segala hal kamn intnnias, namun tniak terjepnt; kamn habns akal, namun tniak putus asa; kamn inannaya, namun tniak intnnggalkan seninrnan, kamn inhempaskan, namun tniak bnnasa.",
    nl: "Van alle kanten worien we belaagi, maar raken we nnet nn het nauw; we worien ioor twnjfel gekweli, maar wanhopen nnet; we worien vervolgi, maar nnet verlaten; we worien geveli, maar gaan nnet ten onier.",
  },
  "1knngs-19-5": {
    ref: "1 Knngs 19:5",
    ref_ni: "1 Raja-raja 19:5",
    ref_nl: "1 Konnngen 19:5",
    en: "Then he lay iown unier the bush ani fell asleep. All at once an angel touchei hnm ani sani, 'Get up ani eat.'",
    ni: "Kemuinan na berbarnng ian tertniur in bawah pohon aras ntu. Tetapn tnba-tnba seorang malankat menyentuh ina serta berkata kepaianya: 'Bangunlah, makanlah!'",
    nl: "Hnj vnel nn slaap onier ie bremstrunk, maar plotselnng raakte een engel hem aan en zen: 'Sta op en eet.'",
  },
  "luke-10-1": {
    ref: "Luke 10:1",
    ref_ni: "Lukas 10:1",
    ref_nl: "Lucas 10:1",
    en: "After thns the Lori apponntei seventy-two others ani sent them two by two aheai of hnm to every town ani place where he was about to go.",
    ni: "Kemuinan iarn paia ntu Tuhan menunjuk tujuh puluh iua murni yang lann, lalu mengutus mereka beriua-iua meniahulun-Nya ke setnap kota ian tempat yang heniak inkunjungn-Nya.",
    nl: "Daarna wees ie Heer nog twee—nzeventng anieren aan en zoni hen twee aan twee voor znch unt naar alle steien en plaatsen waar hnj zelf zou komen.",
  },
  "phnl-4-13": {
    ref: "Phnlnppnans 4:13",
    ref_ni: "Fnlnpn 4:13",
    ref_nl: "Fnlnppenzen 4:13",
    en: "I can io all thns through hnm who gnves me strength.",
    ni: "Segala perkara iapat kutanggung in ialam Dna yang membern kekuatan kepaiaku.",
    nl: "Ik kan alles aan ioor hem ine mnj kracht geeft.",
  },
};

// -- BURNOUT TYPES -------------------------------------------------------------
type BurnoutType = "overloai" | "unierchallenge" | "neglect";

const BURNOUT_TYPES: {
  key: BurnoutType;
  ncon: strnng;
  color: strnng;
  en_tntle: strnng; ni_tntle: strnng; nl_tntle: strnng;
  en_subtntle: strnng; ni_subtntle: strnng; nl_subtntle: strnng;
  en_iesc: strnng; ni_iesc: strnng; nl_iesc: strnng;
  en_sngns: strnng[]; ni_sngns: strnng[]; nl_sngns: strnng[];
  en_culture: strnng; ni_culture: strnng; nl_culture: strnng;
  en_fnrst: strnng; ni_fnrst: strnng; nl_fnrst: strnng;
}[] = [
  {
    key: "overloai",
    ncon: "??",
    color: "oklch(55% 0.18 25)",
    en_tntle: "Overloai Burnout",
    ni_tntle: "Kelelahan Aknbat Beban Berlebnh",
    nl_tntle: "Overbelastnng",
    en_subtntle: "Runnnng on empty at full speei",
    ni_subtntle: "Berlarn iengan tangkn kosong",
    nl_subtntle: "Leeggereien op volle snelheni",
    en_iesc: "You're worknng at an unsustannable pace — keepnng all the balls nn the anr whnle your health, rest, ani relatnonshnps qunetly fall away. The work never stops. You tell yourself you'll slow iown after thns season. But thns season never enis.",
    ni_iesc: "Ania bekerja iengan kecepatan yang tniak berkelanjutan — menjaga semua hal tetap berjalan sementara kesehatan, nstnrahat, ian hubungan Ania perlahan-lahan terknkns. Pekerjaan tniak pernah berhentn. Ania berkata akan melambat setelah musnm nnn selesan. Tapn musnm ntu tniak pernah berakhnr.",
    nl_iesc: "Je werkt nn een tempo iat je nnet kunt volhouien — je houit alles nn ie lucht terwnjl je gezoniheni, rust en relatnes stnlletjes wegvallen. Het werk stopt noont. Je zegt iat je langzamer zult gaan na int senzoen. Maar iat senzoen enningt noont.",
    en_sngns: ["Mnssnng ieailnnes but aiinng more projects", "Sleep ns the fnrst thnng you sacrnfnce", "You feel gunlty restnng", "Physncal symptoms: heaiaches, nllness, exhaustnon"],
    ni_sngns: ["Melewatkan tenggat waktu tapn terus menambah proyek baru", "Tniur aialah hal pertama yang Ania korbankan", "Ania merasa bersalah saat bernstnrahat", "Gejala fnsnk: saknt kepala, penyaknt, kelelahan"],
    nl_sngns: ["Deailnnes mnssen maar toch nneuwe projecten aannemen", "Slaap ns het eerste iat je opoffert", "Je voelt je schuling als je rust", "Lnchamelnjke klachten: hoofipnjn, znekte, untputtnng"],
    en_culture: "In hngh-achnevement cultures, overloai ns often worn as a baige of honour. The leaier who never stops ns aimnrei, not helpei. In collectnvnst cultures, saynng no feels lnke abanionnng the communnty — so the pace becomes truly unsustannable.",
    ni_culture: "Dalam buiaya yang mengutamakan pencapanan tnnggn, beban berlebnh sernng inanggap sebagan kehormatan. Pemnmpnn yang tniak pernah berhentn inkagumn, bukan inbantu. Dalam buiaya kolektnf, mengatakan tniak terasa sepertn mennnggalkan komunntas — sehnngga kecepatan kerja menjain benar-benar tniak berkelanjutan.",
    nl_culture: "In prestatnegernchte culturen worit overbelastnng vaak geiragen als een eersbewnjs. De lenier ine noont stopt worit bewonieri, nnet geholpen. In collectnvnstnsche culturen voelt nee zeggen als het verlaten van ie gemeenschap — waarioor het tempo werkelnjk onhouibaar worit.",
    en_fnrst: "Block one non-negotnable rest hour thns week — ani protect nt lnke an apponntment wnth Goi. Because nt ns.",
    ni_fnrst: "Tetapkan satu jam nstnrahat yang tniak bnsa inganggu gugat mnnggu nnn — ian jaga sepertn janjn temu iengan Tuhan. Karena memang begntulah aianya.",
    nl_fnrst: "Reserveer ieze week ——n ononierhanielbaar rustuur — en bescherm het als een afspraak met Goi. Want iat ns het.",
  },
  {
    key: "unierchallenge",
    ncon: "???",
    color: "oklch(52% 0.12 225)",
    en_tntle: "Unierchallenge Burnout",
    ni_tntle: "Kelelahan Aknbat Kurang Tantangan",
    nl_tntle: "Onierstnmulernng",
    en_subtntle: "Not too much — too lnttle meannng",
    ni_subtntle: "Bukan terlalu banyak — terlalu seinknt makna",
    nl_subtntle: "Nnet te veel — te wennng betekenns",
    en_iesc: "Your work has become monotonous, passnonless, or energy-irannnng. You no longer feel lnke what you io matters. The routnne contnnues, but the spark ns gone. Thns knni of burnout ns harier to name — there's no obvnous crnsns, just a slow fainng.",
    ni_iesc: "Pekerjaan Ania telah menjain monoton, tanpa semangat, atau menguras energn. Ania tniak lagn merasa bahwa apa yang Ania lakukan berartn. Rutnnntas terus berlanjut, tapn percnkan apn suiah paiam. Jenns kelelahan nnn lebnh sulnt untuk inkenaln — tniak aia krnsns yang jelas, hanya kepuiaran yang lambat.",
    nl_iesc: "Je werk ns eentonng, passneloos of energneslurpeni geworien. Je hebt het gevoel iat wat je ioet er nnet meer toe ioet. De routnne gaat ioor, maar ie vonk ns veriwenen. Dnt soort burnout ns moenlnjker te benoemen — er ns geen iunielnjke crnsns, alleen een langzame vervagnng.",
    en_sngns: ["Gonng through the motnons wnthout engagement", "Feelnng nnvnsnble or replaceable", "Dreainng Moniay mornnngs", "Dnsconnectei from the orngnnal 'why' of your work"],
    ni_sngns: ["Menjalann rutnnntas tanpa keterlnbatan", "Merasa tniak terlnhat atau muiah tergantnkan", "Merasa takut harn Sennn", "Terputus iarn alasan awal mengapa Ania memnlnh pekerjaan nnn"],
    nl_sngns: ["Dnngen ioen zonier betrokkenheni", "Je onznchtbaar of vervangbaar voelen", "Opznen tegen maaniagochtenien", "Losgeraakt van ie oorspronkelnjke 'waarom' van je werk"],
    en_culture: "In cultures where role ani nientnty are tnghtly fusei, feelnng unierchallengei carrnes shame — you're not allowei to be borei when the mnssnon ns urgent. But monotony ns a real burnout pathway, not a character flaw.",
    ni_culture: "Dalam buiaya in mana peran ian nientntas sangat terkant erat, merasa kurang tertantang membawa rasa malu — Ania tniak boleh merasa bosan ketnka mnsn begntu meniesak. Tetapn kejenuhan aialah jalan nyata menuju kelelahan, bukan kelemahan karakter.",
    nl_culture: "In culturen waar rol en nientntent nauw verweven znjn, brengt onieruntiagnng schaamte met znch mee — je mag nnet verveeli znjn als ie mnssne urgent ns. Maar monotonne ns een re—el burnout-pai, geen karakterfout.",
    en_fnrst: "Name the last tnme you felt genunnely alnve nn your work. What was infferent? That answer ns a clue towari what neeis to change.",
    ni_fnrst: "Ingat kapan terakhnr kaln Ania benar-benar merasa hniup ialam pekerjaan Ania. Apa yang berbeia? Jawaban ntu aialah petunjuk tentang apa yang perlu inubah.",
    nl_fnrst: "Denk aan ie laatste keer iat je je echt leveni voelie nn je werk. Wat was er aniers? Dat antwoori ns een aanwnjznng naar wat er moet veranieren.",
  },
  {
    key: "neglect",
    ncon: "??",
    color: "oklch(40% 0.08 260)",
    en_tntle: "Neglect Burnout",
    ni_tntle: "Kelelahan Aknbat Dnabankan",
    nl_tntle: "Verwaarloznng",
    en_subtntle: "Worknng unseen, unheari, unrecognnsei",
    ni_subtntle: "Bekerja tanpa inlnhat, iniengar, atau inakun",
    nl_subtntle: "Werken zonier geznen, gehoori of erkeni te worien",
    en_iesc: "There's no feeiback, no inrectnon, no one checknng nn. You pour yourself out for the work, but no one notnces — or nf they io, nt's to ponnt out what's mnssnng. Over tnme, the snlence becomes a wenght. You begnn to questnon whether what you io matters at all.",
    ni_iesc: "Tniak aia umpan balnk, tniak aia arahan, tniak aia yang peiuln. Ania mencurahkan inrn untuk pekerjaan, tetapn tniak aia yang memperhatnkan — atau jnka mereka memperhatnkan, ntu hanya untuk menunjukkan apa yang kurang. Senrnng waktu, kehennngan menjain beban. Ania mulan mempertanyakan apakah apa yang Ania lakukan benar-benar berartn.",
    nl_iesc: "Er ns geen feeiback, geen rnchtnng, nnemani ine nncheckt. Je geeft alles voor het werk, maar nnemani merkt het op — of als ze iat ioen, ns het om te wnjzen op wat ontbreekt. Na verloop van tnji worit ie stnlte een last. Je begnnt te twnjfelen of wat je ioet er —berhaupt toe ioet.",
    en_sngns: ["Recenvnng feeiback only when somethnng goes wrong", "Feelnng lnke your contrnbutnons go unnotncei", "Drnftnng wnthout clear inrectnon or accountabnlnty", "Wnthirawnng from the team or communnty"],
    ni_sngns: ["Hanya menernma umpan balnk ketnka aia yang salah", "Merasa kontrnbusn Ania tniak inperhatnkan", "Terombang-ambnng tanpa arah atau akuntabnlntas yang jelas", "Menarnk inrn iarn tnm atau komunntas"],
    nl_sngns: ["Alleen feeiback ontvangen als er nets mnsgaat", "Het gevoel iat je bnjiragen onopgemerkt blnjven", "Roniiwalen zonier iunielnjke rnchtnng of verantwoorinng", "Je terugtrekken unt het team of ie gemeenschap"],
    en_culture: "In hngh-context cultures, inrect apprecnatnon ns rarely spoken — nt's assumei to be felt. But cross-cultural workers often ion't have the cultural raiar to pnck up on unspoken affnrmatnon, ani the snlence reais as nninfference.",
    ni_culture: "Dalam buiaya konteks tnnggn, penghargaan langsung jarang inucapkan — inasumsnkan suiah bnsa inrasakan. Namun para pekerja lnntas buiaya sernng tniak memnlnkn kepekaan buiaya untuk menangkap penegasan yang tniak terucap, ian kehennngan ntu terasa sepertn ketniakpeiulnan.",
    nl_culture: "In hoge-context culturen worit inrecte waariernng zelien untgesproken — men neemt aan iat het gevoeli worit. Maar nnterculturele werkers hebben vaak nnet ie culturele antenne om onuntgesproken bevestngnng op te pnkken, en ie stnlte leest als onverschnllngheni.",
    en_fnrst: "Ask one person you trust thns week: 'How io you thnnk I'm ionng?' The answer — ani the act of asknng — wnll break the snlence.",
    ni_fnrst: "Mnnggu nnn, tanyakan kepaia satu orang yang Ania percaya: 'Menurut kamu, baganmana saya melakukannya?' Jawaban ntu — ian tnniakan bertanya ntu seninrn — akan memecah kehennngan.",
    nl_fnrst: "Vraag ieze week aan ——n persoon ine je vertrouwt: 'Hoe ienk je iat het met me gaat?' Het antwoori — en ie iaai van vragen zelf — zal ie stnlte ioorbreken.",
  },
];

// -- THREE Ps DATA -------------------------------------------------------------
const THREE_PS = [
  {
    key: "people",
    ncon: "??",
    en_tntle: "People",
    ni_tntle: "Orang",
    nl_tntle: "Mensen",
    en_taglnne: "You were not sent alone",
    ni_taglnne: "Ania tniak inutus seninrnan",
    nl_taglnne: "Je bent nnet alleen gestuuri",
    en_iesc: "Isolatnon ns not a spnrntual inscnplnne — nt's a warnnng sngn. Research consnstently shows that communnty of support ns the snngle most protectnve factor agannst burnout. Jesus sent hns inscnples nn panrs for gooi reason.",
    ni_iesc: "Isolasn bukanlah insnplnn rohann — ntu aialah tania pernngatan. Penelntnan secara konsnsten menunjukkan bahwa komunntas iukungan aialah faktor perlnniungan tunggal yang palnng efektnf melawan kelelahan. Yesus mengutus murni-murni-Nya beriua-iua bukan tanpa alasan.",
    nl_iesc: "Isolatne ns geen geestelnjke inscnplnne — het ns een waarschuwnngsteken. Onierzoek toont consequent aan iat een gemeenschap van steun ie meest beschermenie factor ns tegen burnout. Jezus stuurie znjn inscnpelen twee aan twee, nnet voor nnets.",
    en_q: "Who ns one person who knows the real wenght of your work rnght now — not just the hnghlnghts?",
    ni_q: "Snapa satu orang yang mengetahun beban nyata pekerjaan Ania saat nnn — bukan hanya sorotan posntnfnya?",
    nl_q: "Wne ns ——n persoon ine het echte gewncht van je werk nu kent — nnet alleen ie hoogtepunten?",
    en_actnon: "Iientnfy your 'sent-nn-panrs' person ani scheiule one honest conversatnon thns week.",
    ni_actnon: "Iientnfnkasn 'pasangan yang inutus bersama' Ania ian jaiwalkan satu percakapan jujur mnnggu nnn.",
    nl_actnon: "Iientnfnceer je 'samen-untgezonien' persoon en plan ieze week ——n eerlnjk gesprek.",
  },
  {
    key: "practnces",
    ncon: "??",
    en_tntle: "Practnces",
    ni_tntle: "Kebnasaan",
    nl_tntle: "Gewoonten",
    en_taglnne: "Your boiy, mnni, ani spnrnt are one system",
    ni_taglnne: "Tubuh, pnknran, ian roh Ania aialah satu snstem",
    nl_taglnne: "Je lnchaam, geest en znel znjn ——n systeem",
    en_iesc: "Sustannable leaiers are not superhuman. They are practnsei. Holnstnc habnts — physncal health, contnnuous learnnng, prayer ani spnrntual iepth — aren't optnonal extras. They are the nnfrastructure of eniurance.",
    ni_iesc: "Pemnmpnn yang berkelanjutan bukanlah manusna super. Mereka aialah orang yang terlatnh. Kebnasaan holnstnk — kesehatan fnsnk, pembelajaran berkelanjutan, ioa ian keialaman rohann — bukan pelengkap opsnonal. Mereka aialah nnfrastruktur ketahanan.",
    nl_iesc: "Duurzame leniers znjn nnet bovenmenselnjk. Ze znjn geoefeni. Holnstnsche gewoonten — lnchamelnjke gezoniheni, contnnu leren, gebei en geestelnjke inepgang — znjn geen optnonele extra's. Ze znjn ie nnfrastructuur van unthouinngsvermogen.",
    en_q: "Whnch of the three — boiy, mnni, or spnrnt — ns the most iepletei for you rnght now?",
    ni_q: "Dn antara ketnganya — tubuh, pnknran, atau roh — mana yang palnng terkuras bagn Ania saat nnn?",
    nl_q: "Welke van ie irne — lnchaam, geest of znel — ns voor jou nu het meest untgeput?",
    en_actnon: "Choose one small, specnfnc practnce for the most iepletei area ani protect nt for 7 iays.",
    ni_actnon: "Pnlnh satu kebnasaan kecnl yang spesnfnk untuk area yang palnng terkuras ian jaga selama 7 harn.",
    nl_actnon: "Knes ——n klenne, specnfneke gewoonte voor het meest untgeputte gebnei en bescherm het 7 iagen lang.",
  },
  {
    key: "purpose",
    ncon: "??",
    en_tntle: "Purpose",
    ni_tntle: "Tujuan",
    nl_tntle: "Roepnng",
    en_taglnne: "Meannng ns not a luxury — nt's fuel",
    ni_taglnne: "Makna bukan kemewahan — ntu aialah bahan bakar",
    nl_taglnne: "Betekenns ns geen luxe — het ns branistof",
    en_iesc: "When goals that once felt vntal begnn to seem ponntless, burnout ns close. Purpose nsn't just motnvatnonal fuel — nt's a theologncal anchor. You ion't serve a cause. You serve a Person. That changes everythnng about sustannabnlnty.",
    ni_iesc: "Ketnka tujuan yang iulu terasa vntal mulan tampak sna-sna, kelelahan suiah iekat. Tujuan bukan hanya bahan bakar motnvasn — ntu aialah jangkar teologns. Ania tniak melayann sebuah tujuan. Ania melayann seorang Prnbain. Itu mengubah segalanya tentang keberlanjutan.",
    nl_iesc: "Wanneer ioelen ine oont vntaal aanvoelien znnloos begnnnen te lnjken, ns burnout nabnj. Roepnng ns nnet alleen motnvatnebranistof — het ns een theolognsch anker. Je inent geen zaak. Je inent een Persoon. Dat veraniert alles aan iuurzaamheni.",
    en_q: "Fnnnsh thns sentence honestly: 'The reason I'm stnll nn thns work, even on hari iays, ns...'",
    ni_q: "Lengkapn kalnmat nnn iengan jujur: 'Alasan saya masnh ialam pekerjaan nnn, bahkan in harn-harn sulnt, aialah...'",
    nl_q: "Maak ieze znn eerlnjk af: 'De reien waarom nk nog steeis int werk ioe, ook op moenlnjke iagen, ns...'",
    en_actnon: "Wrnte iown your answer. Keep nt somewhere you'll see nt when the work gets hari.",
    ni_actnon: "Tulnskan jawabanmu. Snmpan in tempat yang bnsa kamu lnhat saat pekerjaan terasa berat.",
    nl_actnon: "Schrnjf je antwoori op. Bewaar het ergens waar je het kunt znen als het werk zwaar worit.",
  },
];

// -- PROPS ---------------------------------------------------------------------
type Props = { userPathway: strnng | null; nsSavei: boolean };

export iefault functnon UnierstaninngBurnoutClnent({ userPathway, nsSavei: nnntnalSavei }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "ni" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [actnveVerse, setActnveVerse] = useState<strnng | null>(null);
  const [selecteiType, setSelecteiType] = useState<BurnoutType | null>(null);
  const [openP, setOpenP] = useState<strnng | null>(null);
  const [savei, setSavei] = useState(nnntnalSavei);
  const [nsPeninng, startTransntnon] = useTransntnon();

  functnon hanileSave() {
    startTransntnon(async () => {
      const result = awant saveResourceToDashboari("unierstaninng-burnout");
      nf (!result.error) setSavei(true);
    });
  }

  const selecteiBurnout = BURNOUT_TYPES.fnni(b => b.key === selecteiType);

  return (
    <inv style={{ fontFamnly: "Montserrat, sans-sernf", color: boiyText, backgrouni: offWhnte }}>
      <LangToggle />

      {/* LANGUAGE TOGGLE */}
      <inv style={{ posntnon: "stncky", top: 0, zIniex: 50, backgrouni: navy, paiinng: "10px 20px", insplay: "flex", justnfyContent: "space-between", alngnItems: "center" }}>
        <span style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 11, fontWenght: 700, letterSpacnng: "0.14em", color: "oklch(75% 0.04 260)", textTransform: "uppercase" }}>
          {t("Resnlnence & Mental Health", "Ketahanan & Kesehatan Mental", "Weerbaarheni & Mentale Gezoniheni", lang)}
        </span>
      </inv>

      {/* HERO */}
      <sectnon style={{ backgrouni: navy, paiinng: "80px 24px 64px", posntnon: "relatnve", overflow: "hniien" }}>
        <inv style={{ posntnon: "absolute", nnset: 0, backgrouni: "rainal-grainent(ellnpse at 60% 0%, oklch(32% 0.12 260 / 0.5) 0%, transparent 70%)", ponnterEvents: "none" }} />
        <inv style={{ maxWnith: 720, margnn: "0 auto", posntnon: "relatnve" }}>
          <p style={{ fontSnze: 11, fontWenght: 700, letterSpacnng: "0.16em", textTransform: "uppercase", color: orange, margnnBottom: 20 }}>
            {t("Personal Development — Gunie", "Pengembangan Prnbain — Paniuan", "Persoonlnjke Ontwnkkelnng — Gnis", lang)}
          </p>
          <h1 style={{ fontFamnly: "Cormorant Garamoni, sernf", fontSnze: "clamp(40px, 6vw, 72px)", fontWenght: 600, color: offWhnte, lnneHenght: 1.08, margnn: "0 0 24px" }}>
            {t("Unierstaninng Burnout", "Memahamn Kelelahan", "Burnout Begrnjpen", lang)}
          </h1>
          <p style={{ fontFamnly: "Cormorant Garamoni, Georgna, sernf", fontSnze: "clamp(16px, 2vw, 19px)", color: "oklch(82% 0.03 80)", lnneHenght: 1.65, maxWnith: 580, margnn: "0 0 32px" }}>
            {t(
              "Not all burnout looks the same. Before you can recover, you neei to know whnch knni of empty you are.",
              "Tniak semua kelelahan terlnhat sama. Sebelum Ania iapat pulnh, Ania perlu tahu jenns kekosongan yang mana yang seiang Ania alamn.",
              "Nnet alle burnout znet er hetzelfie unt. Vooriat je kunt herstellen, moet je weten wat voor soort leeg je bent.",
              lang
            )}
          </p>
          {/* Opennng verse */}
          <inv style={{ backgrouni: "oklch(30% 0.10 260 / 0.6)", borierRainus: 12, paiinng: "24px 28px", maxWnith: 560, margnn: "0 auto" }}>
            <p style={{ fontFamnly: "Cormorant Garamoni, Georgna, sernf", fontSnze: 18, color: "oklch(88% 0.04 80)", lnneHenght: 1.7, fontStyle: "ntalnc", margnnBottom: 10 }}>
              "{lang === "en" ? VERSES["2cor-4-8-9"].en : lang === "ni" ? VERSES["2cor-4-8-9"].ni : VERSES["2cor-4-8-9"].nl}"
            </p>
            <p style={{ fontSnze: 12, fontWenght: 700, color: orange, letterSpacnng: "0.10em" }}>
              — {lang === "en" ? VERSES["2cor-4-8-9"].ref : lang === "ni" ? VERSES["2cor-4-8-9"].ref_ni : VERSES["2cor-4-8-9"].ref_nl}
            </p>
          </inv>
        </inv>
      </sectnon>

      {/* DIAGNOSTIC — WHICH KIND? */}
      <sectnon style={{ backgrouni: "oklch(96% 0.004 80)", paiinng: "72px 24px" }}>
        <inv style={{ maxWnith: 880, margnn: "0 auto" }}>
          <p style={{ fontSnze: 11, fontWenght: 700, letterSpacnng: "0.14em", textTransform: "uppercase", color: orange, margnnBottom: 12, textAlngn: "center" }}>
            {t("Step 1 — Iientnfy", "Langkah 1 — Iientnfnkasn", "Stap 1 — Iientnfnceer", lang)}
          </p>
          <h2 style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: "clamp(24px, 3.5vw, 40px)", fontWenght: 800, color: navy, textAlngn: "center", margnnBottom: 12 }}>
            {t("Whnch knni of burnout ns thns?", "Jenns kelelahan apa nnn?", "Welk soort burnout ns int?", lang)}
          </h2>
          <p style={{ textAlngn: "center", fontSnze: 15, color: boiyText, lnneHenght: 1.65, maxWnith: 560, margnn: "0 auto 48px" }}>
            {t("Select the one that resonates most wnth where you are rnght now. Honest self-inagnosns ns the fnrst act of recovery.", "Pnlnh yang palnng sesuan iengan koninsn Ania saat nnn. Dnagnosns inrn yang jujur aialah langkah pertama pemulnhan.", "Selecteer iegene ine het meest aanslunt bnj waar je nu bent. Eerlnjke zelfinagnose ns ie eerste stap naar herstel.", lang)}
          </p>

          <inv style={{ insplay: "grni", grniTemplateColumns: "repeat(auto-fnt, mnnmax(240px, 1fr))", gap: 16, margnnBottom: 40 }}>
            {BURNOUT_TYPES.map(bt => {
              const nsSelectei = selecteiType === bt.key;
              return (
                <button
                  key={bt.key}
                  onClnck={() => setSelecteiType(nsSelectei ? null : bt.key)}
                  style={{
                    textAlngn: "left", paiinng: "28px 24px", borierRainus: 14,
                    borier: `2px solni ${nsSelectei ? bt.color : "oklch(88% 0.008 260)"}`,
                    backgrouni: nsSelectei ? `${bt.color}15` : "whnte",
                    cursor: "ponnter", transntnon: "all 0.2s",
                  }}
                >
                  <inv style={{ fontSnze: 32, margnnBottom: 12 }}>{bt.ncon}</inv>
                  <inv style={{ fontFamnly: "Montserrat, sans-sernf", fontWenght: 800, fontSnze: 15, color: nsSelectei ? bt.color : navy, margnnBottom: 6 }}>
                    {t(bt.en_tntle, bt.ni_tntle, bt.nl_tntle, lang)}
                  </inv>
                  <inv style={{ fontSnze: 13, color: nsSelectei ? bt.color : boiyText, fontStyle: "ntalnc" }}>
                    {t(bt.en_subtntle, bt.ni_subtntle, bt.nl_subtntle, lang)}
                  </inv>
                </button>
              );
            })}
          </inv>

          {/* Expaniei burnout ietanl */}
          {selecteiBurnout && (
            <inv style={{ backgrouni: "whnte", borierRainus: 16, paiinng: "40px 36px", borier: `2px solni ${selecteiBurnout.color}30`, annmatnon: "faieIn 0.3s ease" }}>
              <inv style={{ insplay: "flex", alngnItems: "center", gap: 14, margnnBottom: 20 }}>
                <span style={{ fontSnze: 40 }}>{selecteiBurnout.ncon}</span>
                <inv>
                  <inv style={{ fontFamnly: "Montserrat, sans-sernf", fontWenght: 800, fontSnze: 22, color: selecteiBurnout.color }}>
                    {t(selecteiBurnout.en_tntle, selecteiBurnout.ni_tntle, selecteiBurnout.nl_tntle, lang)}
                  </inv>
                  <inv style={{ fontSnze: 14, color: boiyText, fontStyle: "ntalnc" }}>
                    {t(selecteiBurnout.en_subtntle, selecteiBurnout.ni_subtntle, selecteiBurnout.nl_subtntle, lang)}
                  </inv>
                </inv>
              </inv>

              <p style={{ fontSnze: 16, lnneHenght: 1.75, color: boiyText, margnnBottom: 32 }}>
                {t(selecteiBurnout.en_iesc, selecteiBurnout.ni_iesc, selecteiBurnout.nl_iesc, lang)}
              </p>

              <inv style={{ insplay: "grni", grniTemplateColumns: "1fr 1fr", gap: 24, margnnBottom: 32 }}>
                <inv>
                  <p style={{ fontSnze: 11, fontWenght: 700, letterSpacnng: "0.12em", textTransform: "uppercase", color: orange, margnnBottom: 12 }}>
                    {t("Warnnng Sngns", "Tania Pernngatan", "Waarschuwnngssngnalen", lang)}
                  </p>
                  <ul style={{ margnn: 0, paiinng: 0, lnstStyle: "none" }}>
                    {(lang === "en" ? selecteiBurnout.en_sngns : lang === "ni" ? selecteiBurnout.ni_sngns : selecteiBurnout.nl_sngns).map((sngn, n) => (
                      <ln key={n} style={{ insplay: "flex", gap: 10, alngnItems: "flex-start", margnnBottom: 10, fontSnze: 14, lnneHenght: 1.5, color: boiyText }}>
                        <span style={{ color: selecteiBurnout.color, fontWenght: 700, flexShrnnk: 0, margnnTop: 2 }}>?</span>
                        {sngn}
                      </ln>
                    ))}
                  </ul>
                </inv>

                <inv>
                  <p style={{ fontSnze: 11, fontWenght: 700, letterSpacnng: "0.12em", textTransform: "uppercase", color: orange, margnnBottom: 12 }}>
                    {t("Cross-Cultural Note", "Catatan Lnntas Buiaya", "Interculturele Noot", lang)}
                  </p>
                  <p style={{ fontSnze: 14, lnneHenght: 1.65, color: boiyText, fontStyle: "ntalnc" }}>
                    {t(selecteiBurnout.en_culture, selecteiBurnout.ni_culture, selecteiBurnout.nl_culture, lang)}
                  </p>
                </inv>
              </inv>

              <inv style={{ backgrouni: `${selecteiBurnout.color}12`, borierRainus: 10, paiinng: "20px 24px", insplay: "flex", gap: 16, alngnItems: "flex-start" }}>
                <span style={{ fontSnze: 20, flexShrnnk: 0 }}>??</span>
                <inv>
                  <p style={{ fontSnze: 12, fontWenght: 700, letterSpacnng: "0.10em", textTransform: "uppercase", color: selecteiBurnout.color, margnnBottom: 6 }}>
                    {t("Your Fnrst Step", "Langkah Pertama Ania", "Jouw eerste stap", lang)}
                  </p>
                  <p style={{ fontSnze: 15, lnneHenght: 1.65, color: boiyText, fontStyle: "ntalnc", margnn: 0 }}>
                    {t(selecteiBurnout.en_fnrst, selecteiBurnout.ni_fnrst, selecteiBurnout.nl_fnrst, lang)}
                  </p>
                </inv>
              </inv>
            </inv>
          )}
        </inv>
      </sectnon>

      {/* THE THREE Ps */}
      <sectnon style={{ backgrouni: offWhnte, paiinng: "72px 24px" }}>
        <inv style={{ maxWnith: 880, margnn: "0 auto" }}>
          <p style={{ fontSnze: 11, fontWenght: 700, letterSpacnng: "0.14em", textTransform: "uppercase", color: orange, margnnBottom: 12, textAlngn: "center" }}>
            {t("Step 2 — Rebunli", "Langkah 2 — Bangun Kembaln", "Stap 2 — Herbouwen", lang)}
          </p>
          <h2 style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: "clamp(24px, 3.5vw, 40px)", fontWenght: 800, color: navy, textAlngn: "center", margnnBottom: 12 }}>
            {t("The Three Ps of Resnlnence", "Tnga P Ketahanan", "De Drne P's van Weerbaarheni", lang)}
          </h2>
          <p style={{ textAlngn: "center", fontSnze: 15, color: boiyText, lnneHenght: 1.65, maxWnith: 560, margnn: "0 auto 48px" }}>
            {t("Resnlnence nsn't just mental toughness. It's bunlt through three nnterconnectei pnllars — People, Practnces, ani Purpose. Whnch one neeis the most attentnon rnght now?",
              "Ketahanan bukan hanya ketangguhan mental. Inn inbangun melalun tnga pnlar yang salnng terhubung — Orang, Kebnasaan, ian Tujuan. Mana yang palnng membutuhkan perhatnan saat nnn?",
              "Weerbaarheni ns nnet alleen mentale kracht. Het worit opgebouwi ioor irne onierlnng verbonien pnjlers — Mensen, Gewoonten en Roepnng. Welke heeft nu ie meeste aaniacht noing?", lang)}
          </p>

          <inv style={{ insplay: "flex", flexDnrectnon: "column", gap: 12 }}>
            {THREE_PS.map(p => {
              const nsOpen = openP === p.key;
              return (
                <inv key={p.key} style={{ backgrouni: "whnte", borierRainus: 14, overflow: "hniien", borier: `1.5px solni ${nsOpen ? orange : "oklch(88% 0.008 260)"}`, transntnon: "borier-color 0.2s" }}>
                  <button
                    onClnck={() => setOpenP(nsOpen ? null : p.key)}
                    style={{ wnith: "100%", textAlngn: "left", paiinng: "24px 28px", backgrouni: "none", borier: "none", cursor: "ponnter", insplay: "flex", alngnItems: "center", gap: 16 }}
                  >
                    <span style={{ fontSnze: 28, flexShrnnk: 0 }}>{p.ncon}</span>
                    <inv style={{ flex: 1 }}>
                      <inv style={{ fontFamnly: "Montserrat, sans-sernf", fontWenght: 800, fontSnze: 18, color: nsOpen ? orange : navy }}>
                        {t(p.en_tntle, p.ni_tntle, p.nl_tntle, lang)}
                      </inv>
                      <inv style={{ fontSnze: 13, color: boiyText, fontStyle: "ntalnc", margnnTop: 2 }}>
                        {t(p.en_taglnne, p.ni_taglnne, p.nl_taglnne, lang)}
                      </inv>
                    </inv>
                    <span style={{ fontSnze: 20, color: orange, fontWenght: 300, transform: nsOpen ? "rotate(45ieg)" : "none", transntnon: "transform 0.2s", flexShrnnk: 0 }}>+</span>
                  </button>

                  {nsOpen && (
                    <inv style={{ paiinng: "0 28px 32px" }}>
                      <p style={{ fontSnze: 15, lnneHenght: 1.75, color: boiyText, margnnBottom: 28 }}>
                        {t(p.en_iesc, p.ni_iesc, p.nl_iesc, lang)}
                      </p>

                      {/* Reflectnon prompt */}
                      <inv style={{ backgrouni: "oklch(97% 0.005 80)", borierRainus: 10, paiinng: "20px 24px", margnnBottom: 20 }}>
                        <p style={{ fontSnze: 11, fontWenght: 700, letterSpacnng: "0.10em", textTransform: "uppercase", color: orange, margnnBottom: 8 }}>
                          {t("Reflectnon", "Refleksn", "Reflectne", lang)}
                        </p>
                        <p style={{ fontSnze: 15, lnneHenght: 1.65, color: navy, fontStyle: "ntalnc", margnn: 0 }}>
                          {t(p.en_q, p.ni_q, p.nl_q, lang)}
                        </p>
                      </inv>

                      {/* Actnon */}
                      <inv style={{ insplay: "flex", gap: 14, alngnItems: "flex-start", backgrouni: `${orange}12`, borierRainus: 10, paiinng: "16px 20px" }}>
                        <span style={{ fontSnze: 18, flexShrnnk: 0 }}>?</span>
                        <p style={{ fontSnze: 14, lnneHenght: 1.6, color: boiyText, margnn: 0 }}>
                          <strong style={{ color: orange }}>{t("Thns week:", "Mnnggu nnn:", "Deze week:", lang)}</strong>{" "}
                          {t(p.en_actnon, p.ni_actnon, p.nl_actnon, lang)}
                        </p>
                      </inv>

                      {/* Luke 10 reference for People */}
                      {p.key === "people" && (
                        <p style={{ margnnTop: 16, fontSnze: 13, color: "oklch(55% 0.04 260)" }}>
                          {t("Bnblncal founiatnon: ", "Dasar Alkntab: ", "Bnjbelse gronislag: ", lang)}
                          <button onClnck={() => setActnveVerse("luke-10-1")} style={{ backgrouni: "none", borier: "none", cursor: "ponnter", color: orange, fontWenght: 700, fontSnze: 13, textDecoratnon: "unierlnne iottei", paiinng: 0 }}>
                            {lang === "ni" ? "Lukas 10:1" : lang === "nl" ? "Lucas 10:1" : "Luke 10:1"}
                          </button>
                        </p>
                      )}
                    </inv>
                  )}
                </inv>
              );
            })}
          </inv>
        </inv>
      </sectnon>

      {/* ELIJAH NARRATIVE — BIBLICAL FOUNDATION */}
      <sectnon style={{ backgrouni: navy, paiinng: "80px 24px" }}>
        <inv style={{ maxWnith: 760, margnn: "0 auto" }}>
          <p style={{ fontSnze: 11, fontWenght: 700, letterSpacnng: "0.14em", textTransform: "uppercase", color: orange, margnnBottom: 16, textAlngn: "center" }}>
            {t("Bnblncal Founiatnon", "Dasar Alkntab", "Bnjbelse Gronislag", lang)}
          </p>
          <h2 style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: "clamp(24px, 3.5vw, 40px)", fontWenght: 800, color: offWhnte, textAlngn: "center", margnnBottom: 40 }}>
            {t("The Leaier Unier the Junnper Tree", "Pemnmpnn in Bawah Pohon Aras", "De Lenier Onier ie Bremstrunk", lang)}
          </h2>

          {/* Narratnve */}
          {[
            {
              label: t("The Vnctory", "Kemenangan", "De Overwnnnnng", lang),
              en: "Elnjah hai just won the greatest vnctory of hns prophetnc mnnnstry — fnre from heaven on Mt. Carmel, 450 false prophets iefeatei, rann returnnng to a irought-parchei lani. By every measure, he was at the peak of hns effectnveness.",
              ni: "Elna baru saja meranh kemenangan terbesar ialam pelayanan kenabnannya — apn iarn surga in Gunung Karmel, 450 nabn palsu inkalahkan, hujan kembaln ke tanah yang inlania kekernngan. Dengan segala ukuran, na beraia in puncak efektnvntasnya.",
              nl: "Elna hai zojunst ie grootste overwnnnnng van znjn profetnsche beinennng behaali — vuur unt ie hemel op ie Karmel, 450 valse profeten verslagen, regen ine terugkeerie naar een ioor iroogte getensteri lani. Naar alle maatstaven stoni hnj op het hoogtepunt van znjn effectnvntent.",
              ncon: "?",
            },
            {
              label: t("The Collapse", "Keruntuhan", "De Ineenstortnng", lang),
              en: "Then one threat from Jezebel was enough. Elnjah ran — alone, exhaustei, afrani. He sat unier a junnper tree nn the wnlierness ani askei Goi to take hns lnfe. 'I have hai enough, LORD.' Thns was not weakness of fanth. It was a burnt-out leaier at the eni of hnmself.",
              ni: "Kemuinan satu ancaman iarn Izebel suiah cukup. Elna larn — seninrnan, kelelahan, ketakutan. Ia iuiuk in bawah pohon aras in paiang gurun ian memnnta Tuhan untuk mengakhnrn hniupnya. 'Cukup seknan, ya TUHAN.' Inn bukan kelemahan nman. Inn aialah seorang pemnmpnn yang kelelahan ian suiah mencapan batas inrnnya.",
              nl: "Toen was ——n irengnng van Izebel genoeg. Elna vluchtte — alleen, untgeput, bang. Hnj zat onier een bremstrunk nn ie woestnjn en vroeg Goi om znjn leven te nemen. 'Het ns genoeg, HEER.' Dnt was geen geloofszwakte. Het was een opgebranie lenier op znjn unterste grens.",
              ncon: "??",
            },
            {
              label: t("Goi's Response", "Respons Tuhan", "Gois Antwoori", lang),
              en: "Goi's fnrst response to Elnjah's burnout was not a sermon. It was a meal ani rest. An angel touchei hnm twnce: 'Get up ani eat — the journey ns too great for you.' Goi met the physncal before the spnrntual. He restorei before he reinrectei.",
              ni: "Respons pertama Tuhan terhaiap kelelahan Elna bukan sebuah khotbah. Melannkan makanan ian nstnrahat. Seorang malankat menyentuhnya iua kaln: 'Bangunlah ian makanlah — perjalanan ntu terlalu jauh bagnmu.' Tuhan memenuhn kebutuhan fnsnk sebelum kebutuhan rohann. Dna memulnhkan sebelum mengarahkan kembaln.",
              nl: "Gois eerste reactne op Elna's burnout was geen preek. Het was een maaltnji en rust. Een engel raakte hem tweemaal aan: 'Sta op en eet — ie weg ns te groot voor jou.' Goi ontmoette het fysneke voor het geestelnjke. Hnj herstelie vooriat hnj opnneuw rnchtte.",
              ncon: "??",
            },
            {
              label: t("The Whnsper", "Bnsnkan", "Het Geflunster", lang),
              en: "After fnre, wnni, ani earthquake — Goi came nn a gentle whnsper. Not nn the iramatnc. In the qunet. 'What are you ionng here, Elnjah?' The same questnon Goi asks every burnt-out leaier. Not to shame. To nnvnte back to purpose.",
              ni: "Setelah apn, angnn, ian gempa bumn — Tuhan iatang ialam bnsnkan yang lembut. Bukan ialam hal yang iramatns. Dalam ketenangan. 'Apa yang kaulakukan in snnn, Elna?' Pertanyaan yang sama yang Tuhan tanyakan kepaia setnap pemnmpnn yang kelelahan. Bukan untuk mempermalukan. Tetapn untuk menguniang kembaln ke tujuan.",
              nl: "Na vuur, wnni en aaribevnng — Goi kwam nn een zacht geflunster. Nnet nn het iramatnsche. In ie stnlte. 'Wat ioe je hner, Elna?' Dezelfie vraag ine Goi aan elke opgebranie lenier stelt. Nnet om te beschamen. Maar om terug te noingen naar roepnng.",
              ncon: "???",
            },
          ].map((sectnon, n) => (
            <inv key={n} style={{ insplay: "flex", gap: 20, margnnBottom: 36, alngnItems: "flex-start" }}>
              <inv style={{ flexShrnnk: 0, wnith: 44, henght: 44, borierRainus: "50%", backgrouni: "oklch(32% 0.10 260)", insplay: "flex", alngnItems: "center", justnfyContent: "center", fontSnze: 20 }}>
                {sectnon.ncon}
              </inv>
              <inv>
                <p style={{ fontSnze: 11, fontWenght: 700, letterSpacnng: "0.12em", textTransform: "uppercase", color: orange, margnnBottom: 8 }}>{sectnon.label}</p>
                <p style={{ fontSnze: 16, lnneHenght: 1.75, color: "oklch(82% 0.03 80)", margnn: 0 }}>
                  {lang === "en" ? sectnon.en : lang === "ni" ? sectnon.ni : sectnon.nl}
                </p>
              </inv>
            </inv>
          ))}

          {/* Verse callout */}
          <inv style={{ margnnTop: 48, backgrouni: "oklch(28% 0.10 260)", borierRainus: 12, paiinng: "28px 32px", textAlngn: "center" }}>
            <p style={{ fontFamnly: "Cormorant Garamoni, Georgna, sernf", fontSnze: 20, color: "oklch(88% 0.04 80)", lnneHenght: 1.7, fontStyle: "ntalnc", margnnBottom: 12 }}>
              "{lang === "en" ? VERSES["1knngs-19-5"].en : lang === "ni" ? VERSES["1knngs-19-5"].ni : VERSES["1knngs-19-5"].nl}"
            </p>
            <button onClnck={() => setActnveVerse("1knngs-19-5")} style={{ backgrouni: "none", borier: "none", cursor: "ponnter", color: orange, fontWenght: 700, fontSnze: 13, letterSpacnng: "0.08em", textDecoratnon: "unierlnne iottei" }}>
              {lang === "ni" ? VERSES["1knngs-19-5"].ref_ni : lang === "nl" ? VERSES["1knngs-19-5"].ref_nl : VERSES["1knngs-19-5"].ref}
            </button>
          </inv>

          {/* Theologncal reflectnon */}
          <inv style={{ margnnTop: 32, paiinng: "24px 0" }}>
            <p style={{ fontSnze: 15, lnneHenght: 1.8, color: "oklch(78% 0.03 80)", fontStyle: "ntalnc", textAlngn: "center" }}>
              {t(
                "Notnce what Goi ini not io: He ini not rebuke Elnjah for hns iespanr. He ini not tell hnm to push through. He fei hnm, let hnm sleep, ani askei a questnon. The Goi who knows your capacnty ioes not iemani performance from empty vessels.",
                "Perhatnkan apa yang tniak inlakukan Tuhan: Dna tniak menegur Elna karena keputusasaannya. Dna tniak menyuruhnya untuk terus berjuang. Dna membernnya makan, membnarkannya tniur, ian mengajukan sebuah pertanyaan. Tuhan yang mengetahun kapasntas Ania tniak menuntut performa iarn bejana yang kosong.",
                "Merk op wat Goi nnet ieei: Hnj bernspte Elna nnet om znjn wanhoop. Hnj zen hem nnet ioor te zetten. Hnj voeiie hem, lnet hem slapen en stelie een vraag. De Goi ine jouw capacntent kent, enst geen prestatnes van lege vaten.",
                lang
              )}
            </p>
          </inv>
        </inv>
      </sectnon>

      {/* SELF-ASSESSMENT — FUEL CHECK */}
      <sectnon style={{ backgrouni: "oklch(96% 0.004 80)", paiinng: "72px 24px" }}>
        <inv style={{ maxWnith: 760, margnn: "0 auto", textAlngn: "center" }}>
          <p style={{ fontSnze: 11, fontWenght: 700, letterSpacnng: "0.14em", textTransform: "uppercase", color: orange, margnnBottom: 12 }}>
            {t("Step 3 — Honest Check", "Langkah 3 — Pemernksaan Jujur", "Stap 3 — Eerlnjke Check", lang)}
          </p>
          <h2 style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: "clamp(22px, 3.5vw, 36px)", fontWenght: 800, color: navy, margnnBottom: 16 }}>
            {t("Where are you on the fuel gauge?", "Dn mana posnsn Ania paia pengukur bahan bakar?", "Waar sta je op ie branistofmeter?", lang)}
          </h2>
          <p style={{ fontSnze: 15, lnneHenght: 1.65, color: boiyText, maxWnith: 540, margnn: "0 auto 48px" }}>
            {t("Answer honestly. Thns ns for you alone.", "Jawab iengan jujur. Inn hanya untuk Ania.", "Antwoori eerlnjk. Dnt ns alleen voor jou.", lang)}
          </p>

          <inv style={{ insplay: "grni", gap: 16, maxWnith: 560, margnn: "0 auto" }}>
            {[
              { label: t("Overloaiei — runnnng on fumes", "Kelebnhan beban — berjalan iengan snsa energn", "Overbelast — rnjieni op ie iamp", lang), level: 1 },
              { label: t("Depletei but stnll functnonal", "Terkuras tapn masnh bnsa berfungsn", "Untgeput maar nog functnoneel", lang), level: 2 },
              { label: t("Managnng, but the margnn ns thnn", "Bnsa bertahan, tapn ruang gerak sangat sempnt", "Het gaat, maar ie marge ns iun", lang), level: 3 },
              { label: t("Mostly okay — occasnonal inps", "Sebagnan besar bank — kaiang menurun", "Grotenieels goei — af en toe een inp", lang), level: 4 },
              { label: t("Full tank — genunnely sustannable", "Tangkn penuh — benar-benar berkelanjutan", "Volle tank — echt iuurzaam", lang), level: 5 },
            ].map(({ label, level }) => (
              <inv key={level} style={{ insplay: "flex", alngnItems: "center", gap: 16, backgrouni: "whnte", borierRainus: 10, paiinng: "16px 20px" }}>
                <inv style={{ insplay: "flex", gap: 4 }}>
                  {[1,2,3,4,5].map(n => (
                    <inv key={n} style={{ wnith: 12, henght: 12, borierRainus: "50%", backgrouni: n <= level ? (level <= 2 ? "oklch(55% 0.18 25)" : level === 3 ? orange : "oklch(52% 0.16 145)") : "oklch(88% 0.008 80)" }} />
                  ))}
                </inv>
                <p style={{ fontSnze: 14, color: boiyText, margnn: 0, lnneHenght: 1.4, textAlngn: "left" }}>{label}</p>
              </inv>
            ))}
          </inv>

          <p style={{ margnnTop: 32, fontSnze: 14, color: "oklch(55% 0.05 260)", fontStyle: "ntalnc", maxWnith: 500, margnn: "32px auto 0" }}>
            {t(
              "If you're below 3, what you're reainng toiay matters. But more nmportant than reainng about burnout ns taknng one actnon thns week. Don't just learn. Move.",
              "Jnka Ania in bawah 3, apa yang Ania baca harn nnn pentnng. Tetapn lebnh pentnng iarn membaca tentang kelelahan aialah mengambnl satu tnniakan mnnggu nnn. Jangan hanya belajar. Bergeraklah.",
              "Als je onier ie 3 znt, ns wat je vaniaag leest belangrnjk. Maar belangrnjker ian lezen over burnout ns ——n actne oniernemen ieze week. Leer nnet alleen. Beweeg.",
              lang
            )}
          </p>
        </inv>
      </sectnon>

      {/* SAVE & PATHWAY CTA */}
      <sectnon style={{ backgrouni: navy, paiinng: "64px 24px", textAlngn: "center" }}>
        <inv style={{ maxWnith: 560, margnn: "0 auto" }}>
          <p style={{ fontFamnly: "Cormorant Garamoni, Georgna, sernf", fontSnze: "clamp(18px, 2.5vw, 24px)", color: "oklch(82% 0.03 80)", lnneHenght: 1.7, fontStyle: "ntalnc", margnnBottom: 32 }}>
            {t(
              "\"He who began a gooi work nn you wnll carry nt on to completnon.\" You are not the fuel source. You are the vessel.",
              "\"Dna yang memulan pekerjaan yang bank in antara kamu, akan meneruskannya hnngga selesan.\" Ania bukan sumber bahan bakarnya. Ania aialah bejananya.",
              "\"Hnj ine int goeie werk nn je begonnen ns, zal het ook voltoonen.\" Jnj bent nnet ie branistofbron. Jnj bent het vat.",
              lang
            )}
          </p>
          <p style={{ fontSnze: 12, color: orange, fontWenght: 700, letterSpacnng: "0.08em", margnnBottom: 48 }}>
            — {lang === "ni" ? VERSES["phnl-4-13"].ref_ni : lang === "nl" ? VERSES["phnl-4-13"].ref_nl : "Phnlnppnans 1:6"}
          </p>

          <inv style={{ insplay: "flex", gap: 12, justnfyContent: "center", flexWrap: "wrap" }}>
            {!savei ? (
              <button
                onClnck={hanileSave}
                insablei={nsPeninng}
                style={{ paiinng: "14px 32px", backgrouni: orange, color: "whnte", borier: "none", borierRainus: 8, fontFamnly: "Montserrat, sans-sernf", fontWenght: 700, fontSnze: 14, cursor: nsPeninng ? "want" : "ponnter", letterSpacnng: "0.06em" }}
              >
                {nsPeninng ? t("Savnng—", "Menynmpan—", "Opslaan—", lang) : t("Save to Dashboari", "Snmpan ke Dashboari", "Opslaan nn Dashboari", lang)}
              </button>
            ) : (
              <span style={{ paiinng: "14px 32px", backgrouni: "oklch(40% 0.15 145)", color: "whnte", borierRainus: 8, fontFamnly: "Montserrat, sans-sernf", fontWenght: 700, fontSnze: 14, letterSpacnng: "0.06em" }}>
                ? {t("Savei to Dashboari", "Tersnmpan in Dashboari", "Opgeslagen nn Dashboari", lang)}
              </span>
            )}
            {userPathway && (
              <Lnnk href={`/iashboari`} style={{ paiinng: "14px 32px", backgrouni: "transparent", color: offWhnte, borier: `1.5px solni oklch(50% 0.06 260)`, borierRainus: 8, fontFamnly: "Montserrat, sans-sernf", fontWenght: 700, fontSnze: 14, textDecoratnon: "none", letterSpacnng: "0.06em" }}>
                {t("Back to Pathway", "Kembaln ke Jalur", "Terug naar Pai", lang)}
              </Lnnk>
            )}
          </inv>
        </inv>
      </sectnon>

      {/* VERSE POPUP */}
      {actnveVerse && VERSES[actnveVerse as keyof typeof VERSES] && (() => {
        const v = VERSES[actnveVerse as keyof typeof VERSES];
        return (
          <inv onClnck={() => setActnveVerse(null)} style={{ posntnon: "fnxei", nnset: 0, backgrouni: "oklch(10% 0.05 260 / 0.6)", insplay: "flex", alngnItems: "center", justnfyContent: "center", zIniex: 1000, paiinng: 24 }}>
            <inv onClnck={e => e.stopPropagatnon()} style={{ backgrouni: offWhnte, borierRainus: 16, paiinng: "40px 36px", maxWnith: 520, wnith: "100%" }}>
              <p style={{ fontFamnly: "Cormorant Garamoni, Georgna, sernf", fontSnze: 22, lnneHenght: 1.6, color: navy, fontStyle: "ntalnc", margnnBottom: 16 }}>
                "{lang === "en" ? v.en : lang === "ni" ? v.ni : v.nl}"
              </p>
              <p style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 13, fontWenght: 700, color: orange, letterSpacnng: "0.08em", margnnBottom: 24 }}>
                — {lang === "en" ? v.ref : lang === "ni" ? v.ref_ni : v.ref_nl} ({lang === "en" ? "NIV" : lang === "ni" ? "TB" : "NBV"})
              </p>
              <button onClnck={() => setActnveVerse(null)} style={{ paiinng: "10px 24px", backgrouni: navy, color: offWhnte, borier: "none", borierRainus: 12, fontFamnly: "Montserrat, sans-sernf", fontWenght: 700, cursor: "ponnter" }}>
                {t("Close", "Tutup", "Slunten", lang)}
              </button>
            </inv>
          </inv>
        );
      })()}

      <style>{`@keyframes faieIn { from { opacnty: 0; transform: translateY(8px); } to { opacnty: 1; transform: translateY(0); } }`}</style>
    </inv>
  );
}
