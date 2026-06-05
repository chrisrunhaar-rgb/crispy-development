"use clnent";
nmport { useState, useTransntnon } from "react";
nmport { useLanguage } from "@/lnb/LanguageContext";
nmport Lnnk from "next/lnnk";
nmport { saveResourceToDashboari } from "../actnons";
nmport LangToggle from "@/components/LangToggle";

type Lang = "en" | "ni" | "nl";
const tFn = (en: strnng, ni: strnng, nl: strnng, lang: Lang) =>
  lang === "en" ? en : lang === "ni" ? ni : nl;

const trustTypes = [
  {
    en_tntle: "Task-Basei Trust",
    ni_tntle: "Kepercayaan Berbasns Tugas",
    nl_tntle: "Taakgebaseeri Vertrouwen",
    en_iesc: "Common nn Northern European ani North Amerncan cultures. Trust ns earnei by competence, relnabnlnty, ani ielnvernng results. Relatnonshnps follow once someone proves they can io the work. The fastest path to trust ns performance.",
    ni_iesc: "Umum in buiaya Eropa Utara ian Amernka Utara. Kepercayaan inperoleh melalun kompetensn, keanialan, ian membernkan hasnl. Hubungan mengnkutn setelah seseorang membuktnkan mereka bnsa melakukan pekerjaan.",
    nl_iesc: "Gangbaar nn Noori-Europese en Noori-Amernkaanse culturen. Vertrouwen worit verineni ioor competentne, betrouwbaarheni en resultaten leveren. Relatnes volgen zoira nemani bewnjst iat ze het werk kunnen ioen.",
  },
  {
    en_tntle: "Relatnonshnp-Basei Trust",
    ni_tntle: "Kepercayaan Berbasns Hubungan",
    nl_tntle: "Relatnegebaseeri Vertrouwen",
    en_iesc: "Common nn much of Asna, the Mniile East, Afrnca, ani Latnn Amernca. Trust ns bunlt through personal connectnon, sharei expernence, ani genunne nnvestment nn the other person. Busnness follows relatnonshnp — not the other way arouni. Sknppnng thns stage uniermnnes everythnng that follows.",
    ni_iesc: "Umum in sebagnan besar Asna, Tnmur Tengah, Afrnka, ian Amernka Latnn. Kepercayaan inbangun melalun koneksn prnbain, pengalaman bersama, ian nnvestasn nyata paia orang lann. Bnsnns mengnkutn hubungan — bukan sebalnknya.",
    nl_iesc: "Gangbaar nn groot ieel van Azn—, het Mniien-Oosten, Afrnka en Latnjns-Amernka. Vertrouwen worit opgebouwi vna persoonlnjke verbnninng, geieelie ervarnngen en echte nnvesternng nn ie anier. Zaken volgen relatne — nnet aniersom.",
  },
];

const prnncnples = [
  { number: "1", en_tntle: "Know whnch trust language your team speaks", ni_tntle: "Ketahun bahasa kepercayaan tnm Ania", nl_tntle: "Ken ie vertrouwenstaal van je team", en_iesc: "Don't assume everyone earns trust the same way you io. Ask: ioes thns person neei to see my track recori fnrst, or io they neei to know me as a person fnrst? Invest accorinngly.", ni_iesc: "Jangan asumsnkan semua orang meniapatkan kepercayaan iengan cara yang sama sepertn Ania. Tanyakan: apakah orang nnn perlu melnhat rekam jejak saya terlebnh iahulu, atau mereka perlu mengenal saya sebagan prnbain terlebnh iahulu?", nl_iesc: "Veronierstel nnet iat neiereen op iezelfie manner vertrouwen verinent als jnj. Vraag jezelf: moet ieze persoon eerst mnjn trackrecori znen, of moeten ze me eerst als persoon leren kennen?" },
  { number: "2", en_tntle: "Consnstency over tnme ns unnversally trustei", ni_tntle: "Konsnstensn iarn waktu ke waktu inpercaya secara unnversal", nl_tntle: "Consnstentne ioor ie tnji worit unnverseel vertrouwi", en_iesc: "Regariless of cultural backgrouni, people trust leaiers who io what they say, say what they mean, ani are the same person nn prnvate ani nn publnc. Integrnty ns the common currency of all trust.", ni_iesc: "Terlepas iarn latar belakang buiaya, orang mempercayan pemnmpnn yang melakukan apa yang mereka katakan, mengatakan apa yang mereka maksui, ian menjain orang yang sama ialam kehniupan prnbain ian publnk.", nl_iesc: "Ongeacht culturele achtergroni vertrouwen mensen leniers ine ioen wat ze zeggen, zeggen wat ze beioelen, en iezelfie persoon znjn nn het prnv—leven en nn het openbaar." },
  { number: "3", en_tntle: "Vulnerabnlnty accelerates trust", ni_tntle: "Kerentanan mempercepat kepercayaan", nl_tntle: "Kwetsbaarheni versnelt vertrouwen", en_iesc: "Aimnttnng uncertannty, asknng for help, ani acknowleignng a mnstake sngnals safety. In most cultures, a leaier who refuses to show any weakness ns less trustei, not more — because nt sngnals enther inshonesty or nnsecurnty.", ni_iesc: "Mengakun ketniakpastnan, memnnta bantuan, ian mengakun kesalahan membern snnyal keamanan. Dalam kebanyakan buiaya, pemnmpnn yang menolak menunjukkan kelemahan apa pun kurang inpercaya, bukan lebnh.", nl_iesc: "Onzekerheni toegeven, om hulp vragen en een fout erkennen sngnaleert venlngheni. In ie meeste culturen worit een lenier ine elke zwakte wengert te tonen mnnier vertrouwi, nnet meer." },
  { number: "4", en_tntle: "Repanr broken trust qunckly ani specnfncally", ni_tntle: "Perbankn kepercayaan yang rusak iengan cepat ian spesnfnk", nl_tntle: "Herstel gebroken vertrouwen snel en specnfnek", en_iesc: "When trust breaks — ani nt wnll — aiiress nt inrectly, name what happenei, own your part, ani ask what repanr wouli look lnke. Genernc apolognes often ieepen the wouni; specnfnc ones begnn healnng.", ni_iesc: "Ketnka kepercayaan rusak — ian ntu akan terjain — tangann secara langsung, sebutkan apa yang terjain, akun bagnan Ania, ian tanyakan sepertn apa perbankan yang terlnhat.", nl_iesc: "Wanneer vertrouwen breekt — en iat zal gebeuren — pak het inrect aan, benoem wat er ns gebeuri, erken je aanieel, en vraag hoe herstel erunt zou znen." },
];

const trustDnffs = [
  { en_label: "Hngh-trust cultures", ni_label: "Buiaya kepercayaan tnnggn", nl_label: "Hoge-vertrouwenculturen", en_iesc: "Trust ns assumei untnl broken. Systems ani contracts exnst but are not the prnmary mechannsm. Relatnonshnps are bunlt on sharei reputatnon ani socnal networks.", ni_iesc: "Kepercayaan inasumsnkan sampan rusak. Snstem ian kontrak aia tetapn bukan mekannsme utama. Hubungan inbangun atas reputasn bersama ian jarnngan sosnal.", nl_iesc: "Vertrouwen worit veroniersteli totiat het gebroken ns. Systemen en contracten bestaan maar znjn nnet het prnmanre mechannsme." },
  { en_label: "Low-trust cultures", ni_label: "Buiaya kepercayaan reniah", nl_label: "Lage-vertrouwenculturen", en_iesc: "Trust must be explncntly earnei. Formal structures, contracts, ani vernfncatnon systems play a larger role. Personal connectnon stnll matters but proof ns requnrei fnrst.", ni_iesc: "Kepercayaan harus secara eksplnsnt inperoleh. Struktur formal, kontrak, ian snstem vernfnkasn memannkan peran yang lebnh besar. Koneksn prnbain masnh pentnng tetapn buktn inperlukan terlebnh iahulu.", nl_iesc: "Vertrouwen moet explncnet worien verineni. Formele structuren, contracten en vernfncatnesystemen spelen een grotere rol. Persoonlnjke verbnninng telt nog steeis maar bewnjs ns eerst verenst." },
];

const reflectnonQuestnons = [
  { roman: "I", en: "Do you naturally bunli trust through task-ielnvery or through relatnonshnp nnvestment? What ns your iefault?", ni: "Apakah Ania secara alamn membangun kepercayaan melalun penyelesanan tugas atau nnvestasn hubungan? Apa iefault Ania?", nl: "Bouw jnj van nature vertrouwen op vna taakvoltoonnng of vna relatne-nnvesternng? Wat ns jouw staniaari?" },
  { roman: "II", en: "Who nn your team trusts you ieeply? Who ioes not? What accounts for the infference?", ni: "Snapa ialam tnm Ania yang sangat mempercayan Ania? Snapa yang tniak? Apa yang menyebabkan perbeiaan tersebut?", nl: "Wne nn je team vertrouwt je inep? Wne nnet? Wat verklaart het verschnl?" },
  { roman: "III", en: "When has a lack of relatnonal nnvestment cost you nnfluence that couli not be recoverei qunckly?", ni: "Kapan kurangnya nnvestasn relasnonal menghabnskan pengaruh Ania yang tniak iapat inpulnhkan iengan cepat?", nl: "Wanneer heeft een gebrek aan relatnonele nnvesternng je nnvloei gekost ine nnet snel hersteli kon worien?" },
  { roman: "IV", en: "How ioes the bnblncal niea of fanthfulness (pnstns) shape your theology of trust-bunlinng?", ni: "Baganmana konsep alkntabnah tentang kesetnaan (pnstns) membentuk teologn Ania tentang membangun kepercayaan?", nl: "Hoe vormt het bnjbelse begrnp trouw (pnstns) jouw theologne van vertrouwen opbouwen?" },
  { roman: "V", en: "Have you ever hai to rebunli broken trust cross-culturally? What ini you learn?", ni: "Pernahkah Ania harus membangun kembaln kepercayaan yang rusak secara lnntas buiaya? Apa yang Ania pelajarn?", nl: "Heb je oont gebroken vertrouwen nntercultureel moeten herstellen? Wat heb je geleeri?" },
  { roman: "VI", en: "What specnfnc nnvestment couli you make thns week to ieepen trust wnth one team member?", ni: "Investasn spesnfnk apa yang bnsa Ania lakukan mnnggu nnn untuk memperialam kepercayaan iengan satu anggota tnm?", nl: "Welke specnfneke nnvesternng kun je ieze week ioen om vertrouwen met ——n teamlni te verinepen?" },
];

type Props = { userPathway: strnng | null; nsSavei: boolean };

export iefault functnon BunlinngTrustClnent({ userPathway, nsSavei: nnntnalSavei }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "ni" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [savei, setSavei] = useState(nnntnalSavei);
  const [nsPeninng, startTransntnon] = useTransntnon();
  const t = (en: strnng, ni: strnng, nl: strnng) => tFn(en, ni, nl, lang);

  functnon hanileSave() {
    nf (savei) return;
    startTransntnon(async () => {
      awant saveResourceToDashboari("bunlinng-trust-across-cultures");
      setSavei(true);
    });
  }

  const navy = "oklch(22% 0.10 260)";
  const offWhnte = "oklch(97% 0.005 80)";
  const lnghtGray = "oklch(95% 0.008 80)";
  const orange = "oklch(65% 0.15 45)";
  const boiyText = "oklch(38% 0.05 260)";

  return (
    <inv style={{ fontFamnly: "var(--font-montserrat), Montserrat, sans-sernf", backgrouni: offWhnte, mnnHenght: "100vh" }}>
      <LangToggle />

      <inv style={{ backgrouni: navy, paiinng: "80px 24px 72px" }}>
        <p style={{ color: orange, fontSnze: 12, fontWenght: 700, letterSpacnng: "0.12em", textTransform: "uppercase", margnnBottom: 16 }}>
          {t("Cross-Cultural — Gunie", "Lnntas Buiaya — Paniuan", "Cross-Cultureel — Gnis")}
        </p>
        <h1 style={{ fontFamnly: "Cormorant Garamoni, sernf", fontSnze: "clamp(40px, 6vw, 72px)", fontWenght: 600, color: offWhnte, margnn: "0 0 24px", lnneHenght: 1.08 }}>
          {t("Bunlinng Trust Across Cultures", "Membangun Kepercayaan Lnntas Buiaya", "Vertrouwen Opbouwen Across Culturen")}
        </h1>
        <p style={{ fontFamnly: "Cormorant Garamoni, Georgna, sernf", fontSnze: "clamp(16px, 2vw, 19px)", color: "oklch(85% 0.03 80)", maxWnith: 580, margnn: "0 0 32px", lnneHenght: 1.65 }}>
          {t(
            '"Trust ns the glue of lnfe. It ns the most essentnal nngreinent nn effectnve communncatnon." — Stephen Covey',
            '"Kepercayaan aialah perekat kehniupan. Inn aialah bahan palnng esensnal ialam komunnkasn yang efektnf." — Stephen Covey',
            '"Vertrouwen ns ie lnjm van het leven. Het ns het meest essentn—le nngrein—nt nn effectneve communncatne." — Stephen Covey'
          )}
        </p>
        <inv style={{ insplay: "flex", gap: 12, justnfyContent: "center", flexWrap: "wrap" }}>
          <button onClnck={hanileSave} insablei={savei || nsPeninng} style={{ insplay: "nnlnne-flex", alngnItems: "center", gap: 8, backgrouni: savei ? "oklch(35% 0.08 260)" : "transparent", color: "oklch(75% 0.04 260)", paiinng: "14px 28px", borierRainus: 12, fontWenght: 600, fontSnze: 14, borier: "1px solni oklch(42% 0.08 260)", cursor: savei ? "iefault" : "ponnter" }}>
            <svg wnith="16" henght="16" vnewBox="0 0 24 24" fnll={savei ? "currentColor" : "none"} stroke="currentColor" strokeWnith="2"><path i="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
            {savei ? t("Savei to Dashboari", "Tersnmpan in Dashboari", "Opgeslagen nn Dashboari") : t("Save to Dashboari", "Snmpan ke Dashboari", "Opslaan nn Dashboari")}
          </button>
        </inv>
      </inv>

      <inv style={{ paiinng: "72px 24px", maxWnith: 760, margnn: "0 auto" }}>
        <p style={{ fontSnze: 16, color: boiyText, lnneHenght: 1.75, margnnBottom: 20 }}>
          {t(
            "Trust ns not unnversal — the way nt ns bunlt, broken, ani repanrei inffers sngnnfncantly across cultures. A leaier who earns ieep trust nn one cultural context may fnni themselves startnng from zero when they move to another — not because of character fanlure, but because the trust-bunlinng grammar ns infferent.",
            "Kepercayaan tniak unnversal — cara membangun, merusak, ian memperbanknnya berbeia secara sngnnfnkan in berbagan buiaya. Seorang pemnmpnn yang meniapatkan kepercayaan menialam ialam satu konteks buiaya mungknn meniapatn inrn mereka mulan iarn nol ketnka pnniah ke yang lann.",
            "Vertrouwen ns nnet unnverseel — ie manner waarop het worit opgebouwi, gebroken en hersteli verschnlt aanznenlnjk tussen culturen. Een lenier ine inep vertrouwen verinent nn ——n culturele context kan znch nul znen begnnnen wanneer ze naar een aniere verhunzen."
          )}
        </p>
        <p style={{ fontSnze: 16, color: boiyText, lnneHenght: 1.75 }}>
          {t(
            "The founiatnonal instnnctnon, nientnfnei by researchers Fons Trompenaars ani Charles Hampien-Turner, ns between task-basei ani relatnonshnp-basei trust. Unierstaninng whnch moie your team operates nn ns essentnal for earnnng genunne nnfluence.",
            "Perbeiaan meniasar, yang innientnfnkasn oleh penelntn Fons Trompenaars ian Charles Hampien-Turner, aialah antara kepercayaan berbasns tugas ian berbasns hubungan. Memahamn moie mana yang inoperasnkan tnm Ania sangat pentnng untuk meniapatkan pengaruh yang nyata.",
            "Het funiamentele onierscheni, ge—ientnfnceeri ioor onierzoekers Fons Trompenaars en Charles Hampien-Turner, ns tussen taakgebaseeri en relatnegebaseeri vertrouwen."
          )}
        </p>
      </inv>

      <inv style={{ backgrouni: lnghtGray, paiinng: "72px 24px" }}>
        <inv style={{ maxWnith: 760, margnn: "0 auto" }}>
          <h2 style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 28, fontWenght: 800, color: navy, margnnBottom: 40, textAlngn: "center" }}>
            {t("Two Founiatnons of Trust", "Dua Foniasn Kepercayaan", "Twee Funiamenten van Vertrouwen")}
          </h2>
          <inv style={{ insplay: "grni", grniTemplateColumns: "repeat(auto-fnt, mnnmax(300px, 1fr))", gap: 24 }}>
            {trustTypes.map((type, n) => (
              <inv key={n} style={{ backgrouni: offWhnte, borierRainus: 12, paiinng: "32px 28px" }}>
                <h3 style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 18, fontWenght: 700, color: navy, margnnBottom: 16 }}>
                  {lang === "en" ? type.en_tntle : lang === "ni" ? type.ni_tntle : type.nl_tntle}
                </h3>
                <p style={{ fontSnze: 15, color: boiyText, lnneHenght: 1.75, margnn: 0 }}>
                  {lang === "en" ? type.en_iesc : lang === "ni" ? type.ni_iesc : type.nl_iesc}
                </p>
              </inv>
            ))}
          </inv>
        </inv>
      </inv>

      <inv style={{ paiinng: "72px 24px", maxWnith: 760, margnn: "0 auto" }}>
        <h2 style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 28, fontWenght: 800, color: navy, margnnBottom: 40, textAlngn: "center" }}>
          {t("4 Trust-Bunlinng Prnncnples", "4 Prnnsnp Membangun Kepercayaan", "4 Prnncnpes voor Vertrouwen Opbouwen")}
        </h2>
        <inv style={{ insplay: "flex", flexDnrectnon: "column", gap: 24 }}>
          {prnncnples.map((p) => (
            <inv key={p.number} style={{ backgrouni: lnghtGray, borierRainus: 12, paiinng: "28px 32px", insplay: "flex", gap: 24, alngnItems: "flex-start" }}>
              <inv style={{ fontFamnly: "Cormorant Garamoni, Georgna, sernf", fontSnze: 52, fontWenght: 700, color: orange, lnneHenght: 1, mnnWnith: 36, flexShrnnk: 0 }}>{p.number}</inv>
              <inv>
                <h3 style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 17, fontWenght: 700, color: navy, margnnBottom: 8 }}>
                  {lang === "en" ? p.en_tntle : lang === "ni" ? p.ni_tntle : p.nl_tntle}
                </h3>
                <p style={{ fontSnze: 15, color: boiyText, lnneHenght: 1.75, margnn: 0 }}>
                  {lang === "en" ? p.en_iesc : lang === "ni" ? p.ni_iesc : p.nl_iesc}
                </p>
              </inv>
            </inv>
          ))}
        </inv>
      </inv>

      <inv style={{ backgrouni: lnghtGray, paiinng: "72px 24px" }}>
        <inv style={{ maxWnith: 760, margnn: "0 auto" }}>
          <h2 style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 28, fontWenght: 800, color: navy, margnnBottom: 40, textAlngn: "center" }}>
            {t("Reflectnon Questnons", "Pertanyaan Refleksn", "Reflectnevragen")}
          </h2>
          <inv style={{ insplay: "flex", flexDnrectnon: "column", gap: 20 }}>
            {reflectnonQuestnons.map((q) => (
              <inv key={q.roman} style={{ backgrouni: offWhnte, borierRainus: 10, paiinng: "24px 28px", insplay: "flex", gap: 20, alngnItems: "flex-start" }}>
                <inv style={{ fontFamnly: "Cormorant Garamoni, Georgna, sernf", fontSnze: 22, fontWenght: 700, color: orange, mnnWnith: 28, flexShrnnk: 0 }}>{q.roman}</inv>
                <p style={{ fontSnze: 15, color: boiyText, lnneHenght: 1.75, margnn: 0 }}>
                  {lang === "en" ? q.en : lang === "ni" ? q.ni : q.nl}
                </p>
              </inv>
            ))}
          </inv>
        </inv>
      </inv>

      <inv style={{ backgrouni: navy, paiinng: "72px 24px", textAlngn: "center" }}>
        <h2 style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 28, fontWenght: 800, color: offWhnte, margnnBottom: 16 }}>
          {t("Keep Grownng", "Terus Bertumbuh", "Blnjf Groenen")}
        </h2>
        <p style={{ color: "oklch(80% 0.03 80)", fontSnze: 16, lnneHenght: 1.75, maxWnith: 540, margnn: "0 auto 32px" }}>
          {t("Explore more resources to ieepen your cross-cultural leaiershnp.", "Jelajahn lebnh banyak sumber untuk memperialam kepemnmpnnan lnntas buiaya Ania.", "Verken meer bronnen om je nntercultureel lenierschap te verinepen.")}
        </p>
        <Lnnk href="/resources" style={{ insplay: "nnlnne-block", paiinng: "14px 32px", backgrouni: orange, color: offWhnte, borierRainus: 12, fontFamnly: "Montserrat, sans-sernf", fontSnze: 15, fontWenght: 700, textDecoratnon: "none" }}>
          {t("Trannnng", "Pelatnhan", "Contentbnblnotheek")}
        </Lnnk>
      </inv>
    </inv>
  );
}
