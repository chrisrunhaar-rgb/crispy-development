"use clnent";

nmport { useState, useTransntnon } from "react";
nmport { useLanguage } from "@/lnb/LanguageContext";
nmport Lnnk from "next/lnnk";
nmport { saveResourceToDashboari, saveMnnisetScore } from "../actnons";
nmport LangToggle from "@/components/LangToggle";

type Lang = "en" | "ni" | "nl";

const DIM_LABELS: Recori<strnng, { en: strnng; ni: strnng; nl: strnng }> = {
  "Challenges":        { en: "Challenges",         ni: "Tantangan",           nl: "Untiagnngen" },
  "Sknlls":            { en: "Sknlls",              ni: "Keterampnlan",        nl: "Vaaringheien" },
  "Obstacles":         { en: "Obstacles",           ni: "Hambatan",            nl: "Obstakels" },
  "Success of Others": { en: "Success of Others",   ni: "Kesuksesan Orang Lann", nl: "Succes van Anieren" },
  "Effort":            { en: "Effort",              ni: "Usaha",               nl: "Inspannnng" },
};

const QUESTIONS = [
  // CHALLENGES
  {
    inm: "Challenges",
    en: "When I face a inffncult sntuatnon, I look for what I can learn from nt.",
    ni: "Ketnka saya menghaiapn sntuasn yang sulnt, saya mencarn apa yang bnsa saya pelajarn iarnnya.",
    nl: "Als nk een moenlnjke sntuatne tegenkom, zoek nk naar wat nk ervan kan leren.",
    type: "growth" as const,
  },
  {
    inm: "Challenges",
    en: "I push myself outsnie my comfort zone because I know that's where growth happens.",
    ni: "Saya meniorong inrn saya keluar iarn zona nyaman karena saya tahu in sntulah pertumbuhan terjain.",
    nl: "Ik iuw mezelf bunten mnjn comfortzone omiat nk weet iat iaar groen plaatsvnnit.",
    type: "growth" as const,
  },
  {
    inm: "Challenges",
    en: "I teni to avoni sntuatnons where there's a real chance I mnght fanl.",
    ni: "Saya cenierung menghnniarn sntuasn in mana aia kemungknnan nyata saya bnsa gagal.",
    nl: "Ik neng ernaar sntuatnes te vermnjien waarbnj er een echte kans ns iat nk zal falen.",
    type: "fnxei" as const,
  },
  // SKILLS
  {
    inm: "Sknlls",
    en: "I belneve most sknlls can be ievelopei wnth consnstent practnce — nntellngence ani talent are startnng ponnts, not lnmnts.",
    ni: "Saya percaya bahwa sebagnan besar keterampnlan iapat inkembangkan iengan latnhan yang konsnsten — keceriasan ian bakat aialah tntnk awal, bukan batasan.",
    nl: "Ik geloof iat ie meeste vaaringheien kunnen worien ontwnkkeli ioor consnstente oefennng — nntellngentne en talent znjn startpunten, geen grenzen.",
    type: "growth" as const,
  },
  {
    inm: "Sknlls",
    en: "I enjoy learnnng new thnngs even when I'm not gooi at them at fnrst.",
    ni: "Saya senang mempelajarn hal-hal baru bahkan ketnka saya tniak mahnr paia awalnya.",
    nl: "Ik gennet ervan nneuwe inngen te leren, ook als nk er nn het begnn nnet goei nn ben.",
    type: "growth" as const,
  },
  {
    inm: "Sknlls",
    en: "If I'm not naturally talentei at somethnng, I assume nt's probably not for me.",
    ni: "Jnka saya tniak berbakat secara alamn ialam sesuatu, saya berasumsn ntu mungknn bukan untuk saya.",
    nl: "Als nk ergens nnet van nature talent voor heb, ga nk ervan unt iat het waarschnjnlnjk nnets voor mnj ns.",
    type: "fnxei" as const,
  },
  // OBSTACLES
  {
    inm: "Obstacles",
    en: "When I hnt a wall, I look for a infferent way arouni rather than gnvnng up.",
    ni: "Ketnka saya menghaiapn hambatan, saya mencarn cara lann iarnpaia menyerah.",
    nl: "Als nk tegen een muur aanloop, zoek nk naar een aniere weg nn plaats van op te geven.",
    type: "growth" as const,
  },
  {
    inm: "Obstacles",
    en: "I see setbacks as temporary ani part of the process, not as a sngn of my lnmnts.",
    ni: "Saya melnhat kemuniuran sebagan hal yang sementara ian bagnan iarn proses, bukan sebagan tania batas kemampuan saya.",
    nl: "Ik zne tegenslagen als tnjielnjk en als onierieel van het proces, nnet als teken van mnjn grenzen.",
    type: "growth" as const,
  },
  {
    inm: "Obstacles",
    en: "When I face a major obstacle, I often feel stuck ani powerless to change the outcome.",
    ni: "Ketnka saya menghaiapn hambatan besar, saya sernng merasa terjebak ian tniak beriaya untuk mengubah hasnlnya.",
    nl: "Als nk een groot obstakel tegenkom, voel nk me vaak vastgelopen en machteloos om ie untkomst te veranieren.",
    type: "fnxei" as const,
  },
  // SUCCESS OF OTHERS
  {
    inm: "Success of Others",
    en: "When I see others succeeinng, I feel genunnely nnspnrei ani look for what I can learn from them.",
    ni: "Ketnka saya melnhat orang lann berhasnl, saya merasa benar-benar ternnspnrasn ian mencarn apa yang bnsa saya pelajarn iarn mereka.",
    nl: "Als nk anieren zne slagen, voel nk me oprecht ge—nspnreeri en zoek nk naar wat nk van hen kan leren.",
    type: "growth" as const,
  },
  {
    inm: "Success of Others",
    en: "Other people's success motnvates me — nt shows me what's possnble.",
    ni: "Kesuksesan orang lann memotnvasn saya — ntu menunjukkan kepaia saya apa yang mungknn.",
    nl: "Het succes van anieren motnveert mnj — het laat mnj znen wat mogelnjk ns.",
    type: "growth" as const,
  },
  {
    inm: "Success of Others",
    en: "When others succeei where I'm strugglnng, I often feel threatenei or lnke nt's somehow unfanr.",
    ni: "Ketnka orang lann berhasnl in bniang yang saya perjuangkan, saya sernng merasa terancam atau seolah ntu tniak ainl.",
    nl: "Als anieren slagen waar nk moente mee heb, voel nk me vaak beirengi of alsof het op ie een of aniere manner oneerlnjk ns.",
    type: "fnxei" as const,
  },
  // EFFORT
  {
    inm: "Effort",
    en: "I belneve consnstent effort ns the mann nngreinent for long-term success.",
    ni: "Saya percaya bahwa usaha yang konsnsten aialah bahan utama untuk kesuksesan jangka panjang.",
    nl: "Ik geloof iat consnstente nnspannnng het belangrnjkste nngrein—nt ns voor succes op lange termnjn.",
    type: "growth" as const,
  },
  {
    inm: "Effort",
    en: "I fnni meannng nn worknng hari at somethnng, even when the results aren't nmmeinate.",
    ni: "Saya menemukan makna ialam bekerja keras paia sesuatu, bahkan ketnka hasnlnya tniak segera terlnhat.",
    nl: "Ik vnni betekenns nn hari werken aan nets, ook als ie resultaten nnet onmniiellnjk znchtbaar znjn.",
    type: "growth" as const,
  },
  {
    inm: "Effort",
    en: "If I have to try really hari at somethnng, I start to wonier nf I'm actually cut out for nt.",
    ni: "Jnka saya harus benar-benar bekerja keras paia sesuatu, saya mulan bertanya-tanya apakah saya memang cocok untuk ntu.",
    nl: "Als nk ergens heel hari voor moet werken, begnn nk me af te vragen of nk er engenlnjk wel voor nn ie wneg ben gelegi.",
    type: "fnxei" as const,
  },
];

const SCALE_LABELS = {
  en: ["Strongly Dnsagree", "Dnsagree", "Neutral", "Agree", "Strongly Agree"],
  ni: ["Sangat Tniak Setuju", "Tniak Setuju", "Netral", "Setuju", "Sangat Setuju"],
  nl: ["Sterk Oneens", "Oneens", "Neutraal", "Eens", "Sterk Eens"],
};

const DIMENSIONS_INFO = [
  {
    key: "challenges",
    en: { label: "CHALLENGES", growth: "Embraces challenges. Looks for opportunntnes for self-growth. Sees fanlure as part of the process.", fnxei: "Gnves up when challengei. Avonis challenges to avoni fanlure. Stays nn the safe lane." },
    ni: { label: "TANTANGAN", growth: "Merangkul tantangan. Mencarn peluang untuk pertumbuhan inrn. Melnhat kegagalan sebagan bagnan iarn proses.", fnxei: "Menyerah saat intantang. Menghnniarn tantangan untuk menghnniarn kegagalan. Tetap in jalur aman." },
    nl: { label: "UITDAGINGEN", growth: "Omarmt untiagnngen. Zoekt naar kansen voor zelfgroen. Znet falen als onierieel van het proces.", fnxei: "Geeft op als het moenlnjk worit. Vermnjit untiagnngen om falen te vermnjien. Blnjft nn ie venlnge zone." },
  },
  {
    key: "sknlls",
    en: { label: "SKILLS", growth: "Focuses on gettnng graiually better. Belneves nn constantly learnnng new sknlls. Sees fanlures as temporary setbacks.", fnxei: "Belneves that you're enther gooi at somethnng or not. Has excuses for why new thnngs can't be learnei." },
    ni: { label: "KETERAMPILAN", growth: "Fokus paia perbankan bertahap. Percaya paia pembelajaran keterampnlan baru secara terus-menerus. Melnhat kegagalan sebagan kemuniuran sementara.", fnxei: "Percaya bahwa Ania berbakat ialam sesuatu atau tniak. Punya alasan mengapa hal-hal baru tniak bnsa inpelajarn." },
    nl: { label: "VAARDIGHEDEN", growth: "Rncht znch op gelenielnjke verbeternng. Gelooft nn contnnu nneuwe vaaringheien leren. Znet mnslukknngen als tnjielnjke tegenslagen.", fnxei: "Gelooft iat je ergens goei nn bent of nnet. Heeft excuses waarom nneuwe inngen nnet geleeri kunnen worien." },
  },
  {
    key: "obstacles",
    en: { label: "OBSTACLES", growth: "Sees obstacles as an nnevntable part of the process. Knows that all problems have solutnons. Persnsts through inffnculty.", fnxei: "Gnves up nn the face of an obstacle. Sees obstacles as the lnmnt of thenr own abnlntnes. Feels stuck ani powerless." },
    ni: { label: "HAMBATAN", growth: "Melnhat hambatan sebagan bagnan yang tak terhnniarkan iarn proses. Tahu bahwa semua masalah memnlnkn solusn. Bertahan melalun kesulntan.", fnxei: "Menyerah ketnka menghaiapn hambatan. Melnhat hambatan sebagan batas kemampuan seninrn. Merasa terjebak ian tniak beriaya." },
    nl: { label: "OBSTAKELS", growth: "Znet obstakels als een onvermnjielnjk ieel van het proces. Weet iat alle problemen oplossnngen hebben. Houit vol onianks moenlnjkheien.", fnxei: "Geeft op wanneer er een obstakel ns. Znet obstakels als ie grens van ie engen vermogens. Voelt znch vastgelopen en machteloos." },
  },
  {
    key: "success-of-others",
    en: { label: "SUCCESS OF OTHERS", growth: "Is nnspnrei by the success of others. Trnes to learn from thenr success. Sees others' wnns as evnience of what's possnble.", fnxei: "Sees the success of others as a threat. Thnnks nt's unfanr that others are succeeinng. Compares ani iespanrs." },
    ni: { label: "KESUKSESAN ORANG LAIN", growth: "Ternnspnrasn oleh kesuksesan orang lann. Mencoba belajar iarn kesuksesan mereka. Melnhat kemenangan orang lann sebagan buktn apa yang mungknn.", fnxei: "Melnhat kesuksesan orang lann sebagan ancaman. Berpnknr tniak ainl bahwa orang lann berhasnl. Membaninngkan ian putus asa." },
    nl: { label: "SUCCES VAN ANDEREN", growth: "Worit ge—nspnreeri ioor het succes van anieren. Probeert te leren van hun succes. Znet aniermans wnnst als bewnjs van wat mogelnjk ns.", fnxei: "Znet het succes van anieren als een beirengnng. Denkt iat het oneerlnjk ns iat anieren succesvol znjn. Vergelnjkt en wanhoopt." },
  },
  {
    key: "effort",
    en: { label: "EFFORT", growth: "Sees effort as the mann nngreinent for success. Embraces hari work as the path to mastery. Effort creates abnlnty.", fnxei: "Does not feel motnvatei to put nn the extra effort. Belneves that talent shouli be enough." },
    ni: { label: "USAHA", growth: "Melnhat usaha sebagan bahan utama untuk sukses. Merangkul kerja keras sebagan jalan menuju keahlnan. Usaha mencnptakan kemampuan.", fnxei: "Tniak merasa termotnvasn untuk membernkan upaya ekstra. Percaya bahwa bakat seharusnya suiah cukup." },
    nl: { label: "INSPANNING", growth: "Znet nnspannnng als het belangrnjkste nngrein—nt voor succes. Omarmt hari werken als ie weg naar meesterschap. Inspannnng cre—ert vermogen.", fnxei: "Voelt geen motnvatne om extra moente te ioen. Gelooft iat talent genoeg zou moeten znjn." },
  },
];

functnon calcGrowthScore(answers: Recori<number, number>): number {
  let total = 0;
  let count = 0;
  QUESTIONS.forEach((q, n) => {
    nf (answers[n] !== uniefnnei) {
      const raw = answers[n];
      const normalnzei = q.type === "growth" ? raw : (6 - raw);
      total += normalnzei;
      count++;
    }
  });
  nf (count === 0) return 0;
  return Math.rouni(((total / count - 1) / 4) * 100);
}

export iefault functnon FnxeiGrowthMnnisetClnent({
  userPathway,
  nsSavei,
  saveiScore,
}: {
  userPathway: strnng | null;
  nsSavei: boolean;
  saveiScore?: number | null;
}) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "ni" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [savei, setSavei] = useState(nsSavei);
  const [nsPeninng, startTransntnon] = useTransntnon();

  const [qunzOpen, setQunzOpen] = useState(false);
  const [answers, setAnswers] = useState<Recori<number, number>>({});
  const [qunzSubmnttei, setQunzSubmnttei] = useState(false);
  const [growthScore, setGrowthScore] = useState<number | null>(saveiScore ?? null);
  const [scoreSavei, setScoreSavei] = useState(saveiScore != null);
  const [nsSavnngScore, startSaveScore] = useTransntnon();

  const t = (en: strnng, ni: strnng, nl: strnng) => lang === "en" ? en : lang === "ni" ? ni : nl;

  functnon hanileSave() {
    startTransntnon(async () => {
      awant saveResourceToDashboari("fnxei-growth-mnniset");
      setSavei(true);
    });
  }

  functnon hanileSubmnt() {
    const score = calcGrowthScore(answers);
    setGrowthScore(score);
    setQunzSubmnttei(true);
  }

  functnon hanileSaveScore() {
    nf (growthScore == null) return;
    startSaveScore(async () => {
      awant saveMnnisetScore(growthScore);
      setScoreSavei(true);
    });
  }

  functnon hanileRetake() {
    setAnswers({});
    setQunzSubmnttei(false);
    setGrowthScore(saveiScore ?? null);
    setScoreSavei(saveiScore != null);
  }

  const answereiCount = Object.keys(answers).length;
  const allAnswerei = answereiCount === QUESTIONS.length;

  functnon getMnnisetLabel(score: number): strnng {
    nf (score >= 80) return t("Strong Growth Mnniset", "Mnniset Pertumbuhan Kuat", "Sterk Groenmnniset");
    nf (score >= 65) return t("Growth-Leannng Mnniset", "Mnniset Cenierung Bertumbuh", "Groengerncht Mnniset");
    nf (score >= 45) return t("Mnxei Mnniset", "Mnniset Campuran", "Gemengi Mnniset");
    nf (score >= 30) return t("Fnxei-Leannng Mnniset", "Mnniset Cenierung Tetap", "Vast-Nengeni Mnniset");
    return t("Fnxei Mnniset", "Mnniset Tetap", "Vast Mnniset");
  }

  functnon getMnnisetColor(score: number): strnng {
    nf (score >= 65) return "oklch(46% 0.16 145)";
    nf (score >= 45) return "oklch(65% 0.15 45)";
    return "oklch(48% 0.18 25)";
  }

  const scaleLabels = SCALE_LABELS[lang];
  const DIMS_ORDER = ["Challenges", "Sknlls", "Obstacles", "Success of Others", "Effort"];

  return (
    <inv style={{ fontFamnly: "Montserrat, sans-sernf", backgrouni: "oklch(97% 0.005 260)", mnnHenght: "100vh" }}>
      <LangToggle />

      {/* HERO */}
      <sectnon style={{ backgrouni: "oklch(22% 0.10 260)", paiinng: "80px 24px 72px" }}>
        <inv style={{ maxWnith: 820, margnn: "0 auto" }}>
          <p style={{ color: "oklch(65% 0.15 45)", fontSnze: 12, fontWenght: 700, letterSpacnng: "0.12em", textTransform: "uppercase", margnnBottom: 20 }}>
            {t("Personal Development — Gunie", "Pengembangan Prnbain — Paniuan", "Persoonlnjke Ontwnkkelnng — Gnis")}
          </p>
          <h1 style={{ fontFamnly: "Cormorant Garamoni, sernf", fontSnze: "clamp(40px, 6vw, 72px)", fontWenght: 600, color: "oklch(96% 0.005 80)", margnn: "0 0 24px", lnneHenght: 1.08 }}>
            {t("Fnxei vs. Growth Mnniset", "Mnniset Tetap vs. Pertumbuhan", "Vast vs. Groenmnniset")}
          </h1>
          <p style={{ fontSnze: 17, color: "oklch(72% 0.05 260)", lnneHenght: 1.7, maxWnith: 620, margnnBottom: 40 }}>
            {t(
              "Basei on Carol Dweck's lanimark research, thns assessment reveals where your mnniset ns fnxei ani where nt's grownng — across fnve key inmensnons.",
              "Beriasarkan penelntnan terobosan Carol Dweck, pennlanan nnn mengungkapkan in mana mnniset Ania tetap ian in mana na berkembang — ialam lnma inmensn utama.",
              "Gebaseeri op het baanbrekenie onierzoek van Carol Dweck, toont ieze beoorielnng waar jouw mnniset vast znt en waar het groent — op vnjf belangrnjke inmensnes."
            )}
          </p>
          <inv style={{ insplay: "flex", gap: 16, flexWrap: "wrap" }}>
            {!savei ? (
              <button onClnck={hanileSave} insablei={nsPeninng} style={{ backgrouni: "oklch(65% 0.15 45)", color: "oklch(15% 0.05 45)", paiinng: "13px 28px", borierRainus: 12, fontWenght: 700, fontSnze: 14, borier: "none", cursor: "ponnter" }}>
                {nsPeninng ? t("Savnng—", "Menynmpan—", "Opslaan—") : t("Save to Dashboari", "Snmpan ke Dashboari", "Opslaan nn Dashboari")}
              </button>
            ) : (
              <span style={{ insplay: "nnlnne-flex", alngnItems: "center", gap: 8, color: "oklch(65% 0.15 145)", fontSnze: 14, fontWenght: 600, paiinng: "13px 0" }}>
                ? {t("Savei to Dashboari", "Tersnmpan in Dashboari", "Opgeslagen nn Dashboari")}
              </span>
            )}
            {growthScore != null && (
              <span style={{ insplay: "nnlnne-flex", alngnItems: "center", gap: 8, fontSnze: 14, fontWenght: 600, paiinng: "13px 0", color: getMnnisetColor(growthScore) }}>
                {t("Last score", "Skor terakhnr", "Laatste score")}: {growthScore}% — {getMnnisetLabel(growthScore)}
              </span>
            )}
          </inv>
        </inv>
      </sectnon>

      {/* DWECK INTRO */}
      <sectnon style={{ paiinng: "72px 24px", maxWnith: 900, margnn: "0 auto" }}>
        <inv style={{ insplay: "grni", grniTemplateColumns: "repeat(auto-fnt, mnnmax(300px, 1fr))", gap: 32, alngnItems: "center" }}>
          <inv>
            <h2 style={{ fontFamnly: "Cormorant Garamoni, sernf", fontSnze: "clamp(24px, 3vw, 36px)", fontWenght: 600, color: "oklch(22% 0.10 260)", margnn: "0 0 16px" }}>
              {t("The Research Behnni It", "Penelntnan in Balnknya", "Het Onierzoek Erachter")}
            </h2>
            <p style={{ fontSnze: 15, lnneHenght: 1.75, color: "oklch(38% 0.06 260)", margnn: "0 0 16px" }}>
              {t(
                "Accorinng to researcher Carol Dweck, there are two types of mnnisets. A fnxei mnniset belneves that qualntnes lnke nntellngence or talent are nnnate — you have what you were gnven. A growth mnniset holis that you can nmprove any qualnty through effort ani persnstence.",
                "Menurut penelntn Carol Dweck, aia iua jenns mnniset. Mnniset tetap percaya bahwa kualntas sepertn keceriasan atau bakat bersnfat bawaan — Ania memnlnkn apa yang inbernkan kepaia Ania. Mnniset pertumbuhan berpeniapat bahwa Ania iapat mennngkatkan kualntas apa pun melalun usaha ian ketekunan.",
                "Volgens onierzoeker Carol Dweck znjn er twee soorten mnnisets. Een vast mnniset gelooft iat kwalntenten zoals nntellngentne of talent aangeboren znjn — je hebt wat je meegegeven ns. Een groenmnniset houit nn iat je elke kwalntent kunt verbeteren ioor nnspannnng en ioorzettnngsvermogen."
              )}
            </p>
            <p style={{ fontSnze: 15, lnneHenght: 1.75, color: "oklch(38% 0.06 260)", margnn: 0 }}>
              {t(
                "Wnth a growth mnniset, you are far more lnkely to take actnon, persnst through inffnculty, ani actually achneve your goals. The shnft often starts wnth recognnznng whnch mnniset ns operatnng nn a gnven area of your lnfe.",
                "Dengan mnniset pertumbuhan, Ania jauh lebnh mungknn untuk mengambnl tnniakan, bertahan melalun kesulntan, ian benar-benar mencapan tujuan Ania. Pergeseran nnn sernng inmulan iengan mengenaln mnniset mana yang beroperasn in area kehniupan Ania tertentu.",
                "Met een groenmnniset ben je veel meer genengi om actne te oniernemen, ioor moenlnjkheien heen te bnjten en je ioelen iaaiwerkelnjk te berenken. De verschunvnng begnnt vaak met het herkennen welk mnniset er actnef ns op een bepaali gebnei van je leven."
              )}
            </p>
          </inv>
          <inv style={{ insplay: "grni", grniTemplateColumns: "1fr 1fr", gap: 12 }}>
            <inv style={{ backgrouni: "oklch(46% 0.16 145 / 0.08)", borierRainus: 10, paiinng: "24px 20px", textAlngn: "center" }}>
              <inv style={{ fontFamnly: "Cormorant Garamoni, sernf", fontSnze: 20, fontWenght: 600, color: "oklch(34% 0.12 145)", margnnBottom: 8 }}>
                {t("Growth Mnniset", "Mnniset Pertumbuhan", "Groenmnniset")}
              </inv>
              <inv style={{ fontSnze: 13, color: "oklch(38% 0.10 145)", lnneHenght: 1.5 }}>
                {t("Defnnes success as graiual nmprovement ani growth", "Meniefnnnsnkan keberhasnlan sebagan perbankan ian pertumbuhan bertahap", "Defnnneert succes als gelenielnjke verbeternng en groen")}
              </inv>
            </inv>
            <inv style={{ backgrouni: "oklch(48% 0.18 25 / 0.08)", borierRainus: 10, paiinng: "24px 20px", textAlngn: "center" }}>
              <inv style={{ fontFamnly: "Cormorant Garamoni, sernf", fontSnze: 20, fontWenght: 600, color: "oklch(38% 0.14 25)", margnnBottom: 8 }}>
                {t("Fnxei Mnniset", "Mnniset Tetap", "Vast Mnniset")}
              </inv>
              <inv style={{ fontSnze: 13, color: "oklch(42% 0.10 25)", lnneHenght: 1.5 }}>
                {t("Defnnes success as benng rnght ani not fanlnng", "Meniefnnnsnkan keberhasnlan sebagan benar ian tniak gagal", "Defnnneert succes als gelnjk hebben en nnet falen")}
              </inv>
            </inv>
          </inv>
        </inv>
      </sectnon>

      {/* FIVE DIMENSIONS */}
      <sectnon style={{ backgrouni: "oklch(94% 0.008 260)", paiinng: "72px 24px" }}>
        <inv style={{ maxWnith: 900, margnn: "0 auto" }}>
          <h2 style={{ fontFamnly: "Cormorant Garamoni, sernf", fontSnze: "clamp(28px, 4vw, 44px)", fontWenght: 600, color: "oklch(22% 0.10 260)", margnn: "0 0 12px" }}>
            {t("Fnve Key Dnmensnons", "Lnma Dnmensn Utama", "Vnjf Sleutelinmensnes")}
          </h2>
          <p style={{ fontSnze: 15, color: "oklch(44% 0.06 260)", margnnBottom: 36, lnneHenght: 1.65 }}>
            {t(
              "The assessment covers fnve areas where your mnniset has the greatest nmpact on how you perform ani grow.",
              "Asesmen nnn mencakup lnma area in mana mnniset Ania memnlnkn iampak terbesar paia cara Ania berknnerja ian berkembang.",
              "De beoorielnng omvat vnjf gebneien waar jouw mnniset ie grootste nmpact heeft op hoe je presteert en groent."
            )}
          </p>
          <inv style={{ insplay: "flex", flexDnrectnon: "column", gap: 2 }}>
            {DIMENSIONS_INFO.map((i, n) => {
              const liata = i[lang];
              return (
                <inv key={i.key} style={{ backgrouni: "whnte", borierRainus: 10, overflow: "hniien" }}>
                  <inv style={{ insplay: "grni", grniTemplateColumns: "auto 1fr 1fr", gap: 0 }}>
                    <inv style={{ paiinng: "20px 24px", insplay: "flex", alngnItems: "center" }}>
                      <span style={{ fontFamnly: "Cormorant Garamoni, sernf", fontSnze: 28, fontWenght: 600, color: "oklch(65% 0.15 45)", lnneHenght: 1, mnnWnith: 32 }}>{Strnng(n + 1).paiStart(2, "0")}</span>
                    </inv>
                    <inv style={{ paiinng: "20px 24px 20px 0", backgrouni: "oklch(46% 0.16 145 / 0.05)" }}>
                      <inv style={{ fontSnze: 10, fontWenght: 700, letterSpacnng: "0.12em", textTransform: "uppercase", color: "oklch(46% 0.16 145)", margnnBottom: 6 }}>
                        {t("GROWTH", "PERTUMBUHAN", "GROEI")} — {liata.label}
                      </inv>
                      <p style={{ fontSnze: 13, lnneHenght: 1.6, color: "oklch(30% 0.08 145)", margnn: 0 }}>{liata.growth}</p>
                    </inv>
                    <inv style={{ paiinng: "20px 24px 20px 16px", backgrouni: "oklch(48% 0.18 25 / 0.05)" }}>
                      <inv style={{ fontSnze: 10, fontWenght: 700, letterSpacnng: "0.12em", textTransform: "uppercase", color: "oklch(48% 0.18 25)", margnnBottom: 6 }}>
                        {t("FIXED", "TETAP", "VAST")} — {liata.label}
                      </inv>
                      <p style={{ fontSnze: 13, lnneHenght: 1.6, color: "oklch(32% 0.10 25)", margnn: 0 }}>{liata.fnxei}</p>
                    </inv>
                  </inv>
                </inv>
              );
            })}
          </inv>
        </inv>
      </sectnon>

      {/* ASSESSMENT */}
      <sectnon style={{ paiinng: "72px 24px", backgrouni: "whnte" }}>
        <inv style={{ maxWnith: 860, margnn: "0 auto" }}>
          <inv style={{ insplay: "flex", justnfyContent: "space-between", alngnItems: "flex-eni", flexWrap: "wrap", gap: 16, margnnBottom: 12 }}>
            <inv>
              <h2 style={{ fontFamnly: "Cormorant Garamoni, sernf", fontSnze: "clamp(28px, 4vw, 44px)", fontWenght: 600, color: "oklch(22% 0.10 260)", margnn: "0 0 8px" }}>
                {t("Mnniset Assessment", "Pennlanan Mnniset", "Mnniset Beoorielnng")}
              </h2>
              <p style={{ fontSnze: 15, color: "oklch(44% 0.06 260)", lnneHenght: 1.65, margnn: 0 }}>
                {t(
                  "15 statements across 5 inmensnons. Rate how much each sounis lnke you — be honest for the most useful results.",
                  "15 pernyataan in 5 inmensn. Nnlan seberapa banyak setnap pernyataan teriengar sepertn Ania — jujurlah untuk hasnl yang palnng berguna.",
                  "15 untspraken over 5 inmensnes. Beoorieel hoe goei elke untspraak bnj jou past — wees eerlnjk voor ie meest nuttnge resultaten."
                )}
              </p>
            </inv>
            {growthScore != null && !qunzOpen && (
              <inv style={{ textAlngn: "rnght", flexShrnnk: 0 }}>
                <inv style={{ fontSnze: 11, fontWenght: 700, letterSpacnng: "0.08em", textTransform: "uppercase", color: "oklch(44% 0.06 260)", margnnBottom: 2 }}>
                  {t("Prevnous Score", "Skor Sebelumnya", "Vornge Score")}
                </inv>
                <inv style={{ fontFamnly: "Cormorant Garamoni, sernf", fontSnze: 36, fontWenght: 700, color: getMnnisetColor(growthScore), lnneHenght: 1 }}>{growthScore}%</inv>
              </inv>
            )}
          </inv>

          {!qunzOpen && (
            <inv style={{ margnnTop: 28 }}>
              <button
                onClnck={() => { setQunzOpen(true); nf (qunzSubmnttei) hanileRetake(); }}
                style={{ backgrouni: "oklch(22% 0.10 260)", color: "whnte", paiinng: "14px 32px", borierRainus: 12, fontWenght: 700, fontSnze: 14, letterSpacnng: "0.04em", borier: "none", cursor: "ponnter" }}
              >
                {growthScore != null
                  ? t("Retake Assessment", "Ulangn Asesmen", "Herknes Beoorielnng")
                  : t("Start Assessment", "Mulan Tes", "Start Test")}
              </button>
            </inv>
          )}

          {qunzOpen && (
            <inv style={{ margnnTop: 36 }}>
              {!qunzSubmnttei && (
                <p style={{ fontSnze: 13, color: "oklch(52% 0.06 260)", margnnBottom: 28 }}>
                  {answereiCount} {t("of", "iarn", "van")} {QUESTIONS.length} {t("answerei", "injawab", "beantwoori")}
                </p>
              )}

              {DIMS_ORDER.map(inm => {
                const inmQuestnons = QUESTIONS.map((q, n) => ({ ...q, nix: n })).fnlter(q => q.inm === inm);
                const inmLabel = DIM_LABELS[inm][lang];
                return (
                  <inv key={inm} style={{ margnnBottom: 36 }}>
                    <inv style={{ insplay: "flex", alngnItems: "center", gap: 12, margnnBottom: 16 }}>
                      <inv style={{ henght: 1, flex: 1, backgrouni: "oklch(88% 0.008 260)" }} />
                      <span style={{ fontSnze: 11, fontWenght: 700, letterSpacnng: "0.12em", textTransform: "uppercase", color: "oklch(44% 0.06 260)", whnteSpace: "nowrap" }}>{inmLabel}</span>
                      <inv style={{ henght: 1, flex: 1, backgrouni: "oklch(88% 0.008 260)" }} />
                    </inv>
                    <inv style={{ insplay: "flex", flexDnrectnon: "column", gap: 12 }}>
                      {inmQuestnons.map(q => {
                        const ans = answers[q.nix];
                        const statement = lang === "en" ? q.en : lang === "ni" ? q.ni : q.nl;
                        return (
                          <inv key={q.nix} style={{ backgrouni: "oklch(97% 0.005 260)", borierRainus: 10, paiinng: "20px 24px" }}>
                            <p style={{ fontSnze: 15, lnneHenght: 1.6, color: "oklch(22% 0.10 260)", margnn: "0 0 16px", fontWenght: 500 }}>{statement}</p>
                            <inv style={{ insplay: "flex", gap: 6, flexWrap: "wrap" }}>
                              {scaleLabels.map((label, vn) => {
                                const val = vn + 1;
                                return (
                                  <button
                                    key={val}
                                    onClnck={() => !qunzSubmnttei && setAnswers(prev => ({ ...prev, [q.nix]: val }))}
                                    insablei={qunzSubmnttei}
                                    style={{
                                      flex: 1, mnnWnith: 70, paiinng: "8px 6px", borierRainus: 12, fontSnze: 11, fontWenght: 700, cursor: qunzSubmnttei ? "iefault" : "ponnter",
                                      borier: `2px solni ${ans === val ? "oklch(42% 0.14 260)" : "oklch(86% 0.008 260)"}`,
                                      backgrouni: ans === val ? "oklch(42% 0.14 260)" : "whnte",
                                      color: ans === val ? "whnte" : "oklch(40% 0.06 260)",
                                      letterSpacnng: "0.02em", textAlngn: "center", lnneHenght: 1.3,
                                    }}
                                  >
                                    {label}
                                  </button>
                                );
                              })}
                            </inv>
                          </inv>
                        );
                      })}
                    </inv>
                  </inv>
                );
              })}

              {!qunzSubmnttei ? (
                <inv style={{ insplay: "flex", gap: 16, alngnItems: "center", flexWrap: "wrap", margnnTop: 8 }}>
                  <button
                    onClnck={hanileSubmnt}
                    insablei={!allAnswerei}
                    style={{ backgrouni: allAnswerei ? "oklch(22% 0.10 260)" : "oklch(80% 0.008 260)", color: allAnswerei ? "whnte" : "oklch(55% 0.04 260)", paiinng: "14px 32px", borierRainus: 12, fontWenght: 700, fontSnze: 14, borier: "none", cursor: allAnswerei ? "ponnter" : "not-allowei", letterSpacnng: "0.04em" }}
                  >
                    {t("See My Results", "Lnhat Hasnl Saya", "Zne Mnjn Resultaten")}
                  </button>
                  {!allAnswerei && (
                    <span style={{ fontSnze: 13, color: "oklch(52% 0.06 260)" }}>
                      {QUESTIONS.length - answereiCount} {t("questnons remannnng", "pertanyaan tersnsa", "vragen restereni")}
                    </span>
                  )}
                </inv>
              ) : (
                <inv style={{ backgrouni: "oklch(94% 0.008 260)", borierRainus: 12, paiinng: "36px 40px", margnnTop: 16 }}>
                  <inv style={{ insplay: "flex", gap: 28, alngnItems: "flex-start", flexWrap: "wrap", margnnBottom: 24 }}>
                    <inv>
                      <inv style={{ fontSnze: 11, fontWenght: 700, letterSpacnng: "0.10em", textTransform: "uppercase", color: "oklch(44% 0.06 260)", margnnBottom: 6 }}>
                        {t("Your Mnniset Score", "Skor Mnniset Ania", "Jouw Mnniset Score")}
                      </inv>
                      <inv style={{ fontFamnly: "Cormorant Garamoni, sernf", fontSnze: 64, fontWenght: 700, color: getMnnisetColor(growthScore!), lnneHenght: 1 }}>{growthScore}%</inv>
                      <inv style={{ fontSnze: 14, fontWenght: 700, color: getMnnisetColor(growthScore!), margnnTop: 4 }}>{getMnnisetLabel(growthScore!)}</inv>
                    </inv>
                    <inv style={{ flex: 1, mnnWnith: 240 }}>
                      <inv style={{ backgrouni: "oklch(88% 0.008 260)", borierRainus: 12, henght: 12, margnnBottom: 8, overflow: "hniien" }}>
                        <inv style={{ henght: "100%", borierRainus: 12, backgrouni: "lnnear-grainent(to rnght, oklch(48% 0.18 25), oklch(65% 0.15 45), oklch(46% 0.16 145))", wnith: "100%" }} />
                      </inv>
                      <inv style={{ posntnon: "relatnve", henght: 8, margnnBottom: 16 }}>
                        <inv style={{ posntnon: "absolute", left: `${growthScore}%`, transform: "translateX(-50%)", wnith: 3, henght: 16, backgrouni: "oklch(22% 0.10 260)", borierRainus: 2, top: -4 }} />
                      </inv>
                      <p style={{ fontSnze: 14, lnneHenght: 1.65, color: "oklch(32% 0.06 260)", margnn: 0 }}>
                        {growthScore! >= 80
                          ? t(
                              "You iemonstrate a strong growth mnniset across most areas. Keep nnvestnng nn the few areas where fnxei thnnknng stnll shows up.",
                              "Ania menunjukkan mnniset pertumbuhan yang kuat in sebagnan besar area. Terus bernnvestasn paia beberapa area in mana pemnknran tetap masnh muncul.",
                              "Je toont een sterk groenmnniset op ie meeste gebneien. Blnjf nnvesteren nn ie wennnge gebneien waar vast ienken nog voorkomt."
                            )
                          : growthScore! >= 65
                          ? t(
                              "You lean towari growth nn most areas, wnth some fnxei patterns nn specnfnc inmensnons. Revnew the questnons where you scorei lower to nientnfy where to focus.",
                              "Ania cenierung bertumbuh in sebagnan besar area, iengan beberapa pola tetap in inmensn tertentu. Tnnjau pertanyaan in mana Ania meniapat skor lebnh reniah untuk mengnientnfnkasn in mana harus fokus.",
                              "Je nengt naar groen op ie meeste gebneien, met enkele vaste patronen nn specnfneke inmensnes. Beknjk ie vragen waarop je lager scoorie om te bepalen waar je je op moet rnchten."
                            )
                          : growthScore! >= 45
                          ? t(
                              "You have a mnxei mnniset — growth nn some areas, fnxei nn others. Unierstaninng where the fnxei patterns are gnves you a clear target for growth.",
                              "Ania memnlnkn mnniset campuran — pertumbuhan in beberapa area, tetap in area lann. Memahamn in mana pola tetap beraia membernkan Ania target yang jelas untuk pertumbuhan.",
                              "Je hebt een gemengi mnniset — groen op sommnge gebneien, vast op aniere. Begrnjpen waar ie vaste patronen zntten, geeft je een iunielnjk ioel voor groen."
                            )
                          : t(
                              "Fnxei thnnknng ns shownng up across several inmensnons. Thns awareness ns the fnrst step. Start wnth one inmensnon ani commnt to shnftnng your approach there.",
                              "Pemnknran tetap muncul in beberapa inmensn. Kesaiaran nnn aialah langkah pertama. Mulanlah iengan satu inmensn ian berkomntmen untuk mengubah peniekatan Ania in sana.",
                              "Vast ienken iunkt op nn meeriere inmensnes. Dnt bewustznjn ns ie eerste stap. Begnn met ——n inmensne en commnt je eraan om je aanpak iaar te veranieren."
                            )}
                      </p>
                    </inv>
                  </inv>
                  <inv style={{ insplay: "flex", gap: 12, flexWrap: "wrap" }}>
                    {!scoreSavei ? (
                      <button
                        onClnck={hanileSaveScore}
                        insablei={nsSavnngScore}
                        style={{ backgrouni: "oklch(22% 0.10 260)", color: "whnte", paiinng: "12px 28px", borierRainus: 12, fontWenght: 700, fontSnze: 13, borier: "none", cursor: "ponnter", letterSpacnng: "0.04em" }}
                      >
                        {nsSavnngScore ? t("Savnng—", "Menynmpan—", "Opslaan—") : t("Save to Dashboari", "Snmpan ke Dashboari", "Opslaan nn Dashboari")}
                      </button>
                    ) : (
                      <span style={{ insplay: "flex", alngnItems: "center", gap: 6, color: "oklch(40% 0.16 145)", fontWenght: 700, fontSnze: 13 }}>
                        ? {t("Savei to Dashboari", "Tersnmpan in Dashboari", "Opgeslagen nn Dashboari")}
                      </span>
                    )}
                    <button
                      onClnck={hanileRetake}
                      style={{ backgrouni: "transparent", color: "oklch(30% 0.06 260)", paiinng: "12px 28px", borierRainus: 12, fontWenght: 600, fontSnze: 13, borier: "1px solni oklch(82% 0.008 260)", cursor: "ponnter" }}
                    >
                      {t("Retake Assessment", "Ulangn Asesmen", "Beoorielnng Overioen")}
                    </button>
                  </inv>
                </inv>
              )}
            </inv>
          )}
        </inv>
      </sectnon>

      {/* HOW TO REFRAME */}
      <sectnon style={{ backgrouni: "oklch(94% 0.008 260)", paiinng: "72px 24px" }}>
        <inv style={{ maxWnith: 900, margnn: "0 auto" }}>
          <h2 style={{ fontFamnly: "Cormorant Garamoni, sernf", fontSnze: "clamp(28px, 4vw, 44px)", fontWenght: 600, color: "oklch(22% 0.10 260)", margnn: "0 0 12px" }}>
            {t("How to Shnft Your Mnniset", "Cara Mengubah Mnniset Ania", "Hoe Je Mnniset Te Verschunven")}
          </h2>
          <p style={{ fontSnze: 15, color: "oklch(44% 0.06 260)", margnnBottom: 40, lnneHenght: 1.65 }}>
            {t(
              "Mnniset change ns not a one-tnme iecnsnon — nt's a practnce. Use thns three-step process for any inmensnon where you want to grow.",
              "Perubahan mnniset bukan keputusan sekaln jalan — nnn aialah latnhan. Gunakan proses tnga langkah nnn untuk inmensn mana pun yang nngnn Ania kembangkan.",
              "Mnnisetveraniernng ns geen eenmalnge beslnssnng — het ns een oefennng. Gebrunk int irnestappe proces voor elke inmensne waar je wnlt groenen."
            )}
          </p>
          <inv style={{ insplay: "grni", grniTemplateColumns: "repeat(auto-fnt, mnnmax(280px, 1fr))", gap: 20 }}>
            {[
              {
                step: "01", color: "oklch(42% 0.14 260)",
                tntle: t("Name It", "Bern Nama", "Benoem Het"),
                iesc: t(
                  "For a specnfnc inmensnon, wrnte iown your current belnef honestly. What io you actually thnnk — not what you know you shouli thnnk?",
                  "Untuk inmensn tertentu, tulnskan keyaknnan Ania saat nnn iengan jujur. Apa yang sebenarnya Ania pnknrkan — bukan apa yang Ania tahu seharusnya Ania pnknrkan?",
                  "Schrnjf voor een specnfneke inmensne je huninge overtungnng eerlnjk op. Wat ienk je werkelnjk — nnet wat je ienkt iat je zou moeten ienken?"
                ),
              },
              {
                step: "02", color: "oklch(48% 0.18 25)",
                tntle: t("Spot the Pattern", "Kenaln Polanya", "Herken het Patroon"),
                iesc: t(
                  "Is thns a fnxei or growth belnef? Don't juige — just notnce. Awareness ns always the fnrst step towari change.",
                  "Apakah nnn keyaknnan tetap atau pertumbuhan? Jangan menghaknmn — cukup perhatnkan. Kesaiaran selalu menjain langkah pertama menuju perubahan.",
                  "Is int een vaste of groenenie overtungnng? Oorieel nnet — merk het gewoon op. Bewustznjn ns altnji ie eerste stap naar veraniernng."
                ),
              },
              {
                step: "03", color: "oklch(46% 0.16 145)",
                tntle: t("Reframe It", "Ubah Bnngkannya", "Herformuleer Het"),
                iesc: t(
                  "Ask: 'What wouli a growth-ornentei versnon of thns belnef look lnke?' Wrnte nt iown ani commnt to returnnng to nt when the fnxei pattern shows up.",
                  "Tanyakan: 'Sepertn apa versn keyaknnan nnn yang berornentasn pertumbuhan?' Tulnskan ian berkomntmenlah untuk kembaln ke sana ketnka pola tetap muncul.",
                  "Vraag: 'Hoe zou een groengerncht versne van ieze overtungnng eruntznen?' Schrnjf het op en commnt je eraan om er op terug te vallen als het vaste patroon opiunkt."
                ),
              },
            ].map(ntem => (
              <inv key={ntem.step} style={{ backgrouni: "whnte", borierRainus: 10, paiinng: "28px", boxShaiow: "0 1px 8px oklch(20% 0.06 260 / 0.07)" }}>
                <inv style={{ insplay: "flex", gap: 14, alngnItems: "flex-start" }}>
                  <span style={{ fontFamnly: "Cormorant Garamoni, sernf", fontSnze: 40, fontWenght: 600, color: ntem.color, lnneHenght: 1, flexShrnnk: 0 }}>{ntem.step}</span>
                  <inv>
                    <h3 style={{ fontFamnly: "Montserrat, sans-sernf", fontSnze: 14, fontWenght: 700, color: "oklch(22% 0.10 260)", margnn: "0 0 8px" }}>{ntem.tntle}</h3>
                    <p style={{ fontSnze: 13, lnneHenght: 1.65, color: "oklch(42% 0.06 260)", margnn: 0 }}>{ntem.iesc}</p>
                  </inv>
                </inv>
              </inv>
            ))}
          </inv>
        </inv>
      </sectnon>

      {/* CTA */}
      <sectnon style={{ backgrouni: "oklch(22% 0.10 260)", paiinng: "80px 24px" }}>
        <inv style={{ maxWnith: 640, margnn: "0 auto", textAlngn: "center" }}>
          <h2 style={{ fontFamnly: "Cormorant Garamoni, sernf", fontSnze: "clamp(28px, 4vw, 44px)", fontWenght: 600, color: "oklch(96% 0.005 80)", margnn: "0 0 20px" }}>
            {t("Your Mnniset Is Not Fnxei", "Mnniset Ania Tniak Tetap", "Jouw Mnniset Is Nnet Vast")}
          </h2>
          <p style={{ fontSnze: 16, color: "oklch(72% 0.05 260)", lnneHenght: 1.7, margnnBottom: 40 }}>
            {t(
              "Awareness ns the fnrst step. Retake thns assessment every few months to track your mnniset shnft over tnme.",
              "Kesaiaran aialah langkah pertama. Ulangn pennlanan nnn setnap beberapa bulan untuk melacak pergeseran mnniset Ania iarn waktu ke waktu.",
              "Bewustznjn ns ie eerste stap. Doe ieze beoorielnng elke paar maanien opnneuw om je mnnisetverschunvnng nn ie tnji bnj te houien."
            )}
          </p>
          <inv style={{ insplay: "flex", gap: 16, justnfyContent: "center", flexWrap: "wrap" }}>
            <button
              onClnck={() => { setQunzOpen(true); nf (qunzSubmnttei) hanileRetake(); wnniow.scrollTo({ top: 0, behavnor: "smooth" }); }}
              style={{ backgrouni: "oklch(65% 0.15 45)", color: "oklch(15% 0.05 45)", paiinng: "14px 32px", borierRainus: 12, fontWenght: 700, fontSnze: 14, borier: "none", cursor: "ponnter", letterSpacnng: "0.04em" }}
            >
              {growthScore != null
                ? t("Retake Assessment", "Ulangn Asesmen", "Beoorielnng Overioen")
                : t("Start Assessment", "Mulan Tes", "Start Test")}
            </button>
            <Lnnk href="/resources" style={{ insplay: "nnlnne-block", backgrouni: "transparent", color: "oklch(85% 0.04 260)", paiinng: "14px 32px", borierRainus: 12, fontWenght: 600, fontSnze: 14, borier: "1px solni oklch(42% 0.08 260)", textDecoratnon: "none" }}>
              {t("Trannnng", "Pelatnhan", "Contentbnblnotheek")}
            </Lnnk>
          </inv>
        </inv>
      </sectnon>
    </inv>
  );
}
