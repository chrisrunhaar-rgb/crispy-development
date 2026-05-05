"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const SARI_MOMENTS = [
  {
    time: "08:40",
    en_action: "Arrives at the office. Notices Hendra at his desk — something tense in his posture. She changes course before reaching the meeting room.",
    id_action: "Tiba di kantor. Memperhatikan Hendra di mejanya — ada sesuatu yang tegang dalam posturnya. Dia mengubah arah sebelum mencapai ruang rapat.",
    nl_action: "Komt op kantoor aan. Ziet Hendra aan zijn bureau — er is iets gespannens in zijn houding. Ze verandert van richting voor ze de vergaderruimte bereikt.",
    en_thought: "Something's not right with him. A few minutes now will make him more present for the whole morning.",
    id_thought: "Ada yang tidak beres dengannya. Beberapa menit sekarang akan membuatnya lebih hadir untuk seluruh pagi ini.",
    nl_thought: "Er klopt iets niet. Een paar minuten nu maakt hem meer aanwezig voor de rest van de ochtend.",
  },
  {
    time: "08:47",
    en_action: "She learns Hendra's mother has been admitted to hospital. He was planning to push through the meeting without mentioning it.",
    id_action: "Dia mengetahui bahwa ibu Hendra dirawat di rumah sakit. Hendra berencana melewati rapat tanpa menyebutkannya.",
    nl_action: "Ze hoort dat Hendra's moeder is opgenomen in het ziekenhuis. Hij was van plan de vergadering door te zetten zonder het te noemen.",
    en_thought: "Good. Now he can actually be here. A team that doesn't show up for each other cannot do good work.",
    id_thought: "Bagus. Sekarang dia bisa benar-benar hadir. Tim yang tidak hadir untuk satu sama lain tidak bisa bekerja dengan baik.",
    nl_thought: "Goed. Nu kan hij er echt bij zijn. Een team dat er niet voor elkaar is, kan geen goed werk leveren.",
  },
  {
    time: "08:55",
    en_action: "Walking to the meeting room, she stops when Dewi calls from the printer area with a question about the report format.",
    id_action: "Berjalan menuju ruang rapat, dia berhenti ketika Dewi memanggil dari area printer dengan pertanyaan tentang format laporan.",
    nl_action: "Op weg naar de vergaderruimte stopt ze als Dewi roept vanuit het printergedeelte met een vraag over het rapportformat.",
    en_thought: "Two minutes now saves half an hour of confusion later. And she needed to know she could ask.",
    id_thought: "Dua menit sekarang menghemat setengah jam kebingungan nanti. Dan dia perlu tahu bahwa dia bisa bertanya.",
    nl_thought: "Twee minuten nu bespaart een half uur verwarring later. En ze moest weten dat ze mocht vragen.",
  },
  {
    time: "09:03",
    en_action: "Enters the meeting room. The team is settling in. Klaus looks up from his laptop.",
    id_action: "Memasuki ruang rapat. Tim sedang bersiap. Klaus mendongak dari laptopnya.",
    nl_action: "Betreedt de vergaderruimte. Het team gaat zitten. Klaus kijkt op van zijn laptop.",
    en_thought: "Good. Everyone's here. We're ready to work.",
    id_thought: "Bagus. Semua sudah ada. Kita siap bekerja.",
    nl_thought: "Goed. Iedereen is er. We zijn klaar om te werken.",
  },
];

const KLAUS_MOMENTS = [
  {
    time: "08:40",
    en_action: "Arrives at the office. Goes directly to the meeting room. Opens his laptop and reviews the agenda he prepared last Thursday.",
    id_action: "Tiba di kantor. Langsung menuju ruang rapat. Membuka laptop dan meninjau agenda yang disiapkannya Kamis lalu.",
    nl_action: "Komt op kantoor aan. Loopt direct naar de vergaderruimte. Opent zijn laptop en bekijkt de agenda die hij donderdag heeft voorbereid.",
    en_thought: "Good to be early. I can run through the Q3 milestones once more before the others arrive.",
    id_thought: "Bagus bisa datang lebih awal. Saya bisa meninjau target Q3 sekali lagi sebelum yang lain tiba.",
    nl_thought: "Goed om vroeg te zijn. Ik kan de Q3-mijlpalen nog eens doorlopen voordat de anderen komen.",
  },
  {
    time: "08:55",
    en_action: "Notes are ready. Agenda is clear. He looks up — the room is still empty.",
    id_action: "Catatan sudah siap. Agenda sudah jelas. Dia mendongak — ruangan masih kosong.",
    nl_action: "Aantekeningen zijn klaar. Agenda is helder. Hij kijkt op — de ruimte is nog leeg.",
    en_thought: "Five minutes. Fine. They'll be here shortly.",
    id_thought: "Lima menit lagi. Tidak apa-apa. Mereka akan segera datang.",
    nl_thought: "Vijf minuten. Prima. Ze komen zo.",
  },
  {
    time: "09:00",
    en_action: "He hears relaxed voices and laughter from the hallway. Checks his watch: exactly 9:00. No one has entered yet.",
    id_action: "Dia mendengar suara santai dan tawa dari lorong. Memeriksa jamnya: tepat pukul 09:00. Belum ada yang masuk.",
    nl_action: "Hij hoort ontspannen stemmen en gelach op de gang. Kijkt op zijn horloge: precies 9:00. Niemand is nog binnengekomen.",
    en_thought: "We have a scheduled meeting. Right now. Why is no one coming in?",
    id_thought: "Kita punya rapat yang sudah dijadwalkan. Sekarang. Mengapa tidak ada yang masuk?",
    nl_thought: "We hebben een geplande vergadering. Nu. Waarom komt er niemand naar binnen?",
  },
  {
    time: "09:03",
    en_action: "The team files in over two minutes. Sari is last. She's calm, unhurried, greeting each person as she takes her seat.",
    id_action: "Tim masuk satu per satu selama dua menit. Sari yang terakhir. Dia tenang, tidak terburu-buru, menyapa setiap orang saat duduk.",
    nl_action: "Het team druppelt binnen over twee minuten. Sari is de laatste. Ze is rustig, heeft geen haast, begroet iedereen terwijl ze gaat zitten.",
    en_thought: "She leads this team and she's the last one in. Three minutes late to her own meeting — and she seems completely unbothered.",
    id_thought: "Dia memimpin tim ini dan dia yang terakhir masuk. Tiga menit terlambat ke rapatnya sendiri — dan dia tampak sama sekali tidak terganggu.",
    nl_thought: "Ze leidt dit team en ze is de laatste die binnenkomt. Drie minuten te laat voor haar eigen vergadering — en ze lijkt er totaal niet door te zitten.",
  },
];

const FRAMEWORK_POINTS = [
  {
    number: "01",
    en_label: "Two visions of time",
    id_label: "Dua visi tentang waktu",
    nl_label: "Twee visies op tijd",
    en_body: "Sari is polychronic: time is relational. Being present for Hendra and Dewi was not distraction — it was preparation. Klaus is monochronic: time is a resource to be managed. 9:00 means 9:00 because the schedule is the shared commitment.",
    id_body: "Sari bersifat polychronic: waktu bersifat relasional. Hadir untuk Hendra dan Dewi bukan gangguan — itu adalah persiapan. Klaus bersifat monochronic: waktu adalah sumber daya yang harus dikelola. 09:00 berarti 09:00 karena jadwal adalah komitmen bersama.",
    nl_body: "Sari is polychronisch: tijd is relationeel. Aanwezig zijn voor Hendra en Dewi was geen afleiding — het was voorbereiding. Klaus is monochronisch: tijd is een middel om te beheren. 9:00 is 9:00 omdat het schema de gedeelde toezegging is.",
  },
  {
    number: "02",
    en_label: "Two kinds of preparation",
    id_label: "Dua jenis persiapan",
    nl_label: "Twee soorten voorbereiding",
    en_body: "Klaus prepared the task scaffolding — the agenda, the milestones, the plan. Sari prepared the relational scaffolding — the people, their readiness, their capacity to work. Both were doing real preparation. They simply had different definitions of what 'ready' means.",
    id_body: "Klaus menyiapkan kerangka tugas — agenda, target, rencana. Sari menyiapkan kerangka relasional — orang-orang, kesiapan mereka, kapasitas mereka untuk bekerja. Keduanya melakukan persiapan nyata. Mereka hanya memiliki definisi berbeda tentang apa artinya 'siap'.",
    nl_body: "Klaus bereidde het taakgeraamte voor — de agenda, de mijlpalen, het plan. Sari bereidde het relationele geraamte voor — de mensen, hun bereidheid, hun vermogen om te werken. Beiden deden echte voorbereiding. Ze hadden simpelweg verschillende definities van wat 'klaar' betekent.",
  },
  {
    number: "03",
    en_label: "Two reliability systems",
    id_label: "Dua sistem keandalan",
    nl_label: "Twee systemen van betrouwbaarheid",
    en_body: "Klaus measures reliability by keeping to schedules. Sari measures it by being present for people. When Klaus sees lateness, he reads unreliability. When Sari watches Klaus leave immediately after meetings, she reads coldness. Both readings are real. Both are incomplete.",
    id_body: "Klaus mengukur keandalan dengan mematuhi jadwal. Sari mengukurnya dengan hadir bagi orang-orang. Ketika Klaus melihat keterlambatan, dia membaca ketidakandalan. Ketika Sari melihat Klaus langsung pergi setelah rapat, dia membaca sikap dingin. Kedua pembacaan itu nyata. Keduanya tidak lengkap.",
    nl_body: "Klaus meet betrouwbaarheid aan het nakomen van schema's. Sari meet het door aanwezig te zijn voor mensen. Wanneer Klaus te-laat-zijn ziet, leest hij onbetrouwbaarheid. Wanneer Sari ziet dat Klaus direct na vergaderingen vertrekt, leest ze koudheid. Beide lezingen zijn reëel. Beide zijn onvolledig.",
  },
];

const BRIDGES = [
  {
    en: "Name your time orientation openly with your team. The invisible assumption — that everyone shares your definition of 'on time' — is the thing that keeps fracturing trust.",
    id: "Ungkapkan orientasi waktu Anda secara terbuka dengan tim. Asumsi tak terlihat — bahwa semua orang berbagi definisi Anda tentang 'tepat waktu' — adalah hal yang terus merusak kepercayaan.",
    nl: "Benoem je tijdoriëntatie openlijk met je team. De onzichtbare aanname — dat iedereen jouw definitie van 'op tijd' deelt — is wat het vertrouwen blijft ondermijnen.",
  },
  {
    en: "Build five minutes of relational time into the start of every meeting. It is not wasted time — it is the lubricant that makes everything else possible.",
    id: "Bangun lima menit waktu relasional di awal setiap rapat. Ini bukan waktu yang terbuang — ini adalah pelumas yang membuat segalanya menjadi mungkin.",
    nl: "Bouw vijf minuten relationele tijd in aan het begin van elke vergadering. Het is geen verspilde tijd — het is het smeermiddel dat alles mogelijk maakt.",
  },
  {
    en: "Agree explicitly on what 'on time' and 'deadline' mean in your specific context. Don't inherit someone's cultural default — negotiate your own shared definition.",
    id: "Sepakati secara eksplisit apa arti 'tepat waktu' dan 'tenggat waktu' dalam konteks spesifik Anda. Jangan mewarisi default budaya seseorang — negosiasikan definisi bersama Anda sendiri.",
    nl: "Spreek expliciet af wat 'op tijd' en 'deadline' in jouw specifieke context betekenen. Erf niet iemands culturele standaard — onderhandel je eigen gedeelde definitie.",
  },
  {
    en: "When timelines slip, ask before you conclude. The real reason is often relational, familial, or communal — not laziness or disorganisation.",
    id: "Ketika jadwal meleset, tanyakan sebelum menyimpulkan. Alasan sebenarnya sering bersifat relasional, keluarga, atau komunal — bukan kemalasan atau ketidakorganisasian.",
    nl: "Wanneer tijdlijnen verschuiven, vraag voordat je een conclusie trekt. De echte reden is vaak relationeel, familiaal of communaal — niet luiheid of desorganisatie.",
  },
  {
    en: "Protect the person when you enforce accountability. Accountability is necessary — but how you apply it reveals whether your system serves the task or the human being.",
    id: "Lindungi orang tersebut saat Anda menegakkan akuntabilitas. Akuntabilitas memang diperlukan — tetapi cara Anda menerapkannya mengungkapkan apakah sistem Anda melayani tugas atau manusia.",
    nl: "Bescherm de persoon als je verantwoording afdwingt. Verantwoording is noodzakelijk — maar hoe je het toepast onthult of je systeem de taak of de mens dient.",
  },
];

const VERSES = {
  "eccl-3-1": {
    en_ref: "Ecclesiastes 3:1",
    id_ref: "Pengkhotbah 3:1",
    nl_ref: "Prediker 3:1",
    en: "There is a time for everything, and a season for every activity under the heavens.",
    id: "Untuk segala sesuatu ada masanya, untuk apa pun di bawah langit ada waktunya.",
    nl: "Alles heeft zijn uur, voor alles onder de hemel is er een tijd.",
  },
  "gal-4-4": {
    en_ref: "Galatians 4:4",
    id_ref: "Galatia 4:4",
    nl_ref: "Galaten 4:4",
    en: "But when the set time had fully come, God sent his Son, born of a woman, born under the law.",
    id: "Tetapi setelah genap waktunya, maka Allah mengutus Anak-Nya, yang lahir dari seorang perempuan dan takluk kepada hukum Taurat.",
    nl: "Maar toen de tijd volledig gekomen was, zond God zijn Zoon, geboren uit een vrouw en onderworpen aan de wet.",
  },
};

const QUESTIONS = [
  {
    roman: "I",
    en: "If you are honest: which timeline felt more natural to you — Sari's or Klaus's? What does that tell you about your default?",
    id: "Jika Anda jujur: sisi mana dari timeline yang terasa lebih alami bagi Anda — Sari atau Klaus? Apa yang dikatakan itu tentang default Anda?",
    nl: "Als je eerlijk bent: welke tijdlijn voelde natuurlijker voor jou — die van Sari of van Klaus? Wat zegt dat over jouw standaard?",
  },
  {
    roman: "II",
    en: "Think of someone you have labelled 'unreliable' or 'always late'. What was probably happening from their cultural framework?",
    id: "Pikirkan seseorang yang pernah Anda beri label 'tidak dapat diandalkan' atau 'selalu terlambat'. Apa yang kemungkinan terjadi dari kerangka budaya mereka?",
    nl: "Denk aan iemand die je ooit 'onbetrouwbaar' of 'altijd te laat' hebt genoemd. Wat speelde er waarschijnlijk vanuit hun cultureel kader?",
  },
  {
    roman: "III",
    en: "The Bible speaks of Kairos — God's appointed moment, not clock-measured. How does that concept challenge your assumptions about what 'productive' time looks like?",
    id: "Alkitab berbicara tentang Kairos — momen yang ditetapkan Tuhan, bukan diukur jam. Bagaimana konsep itu menantang asumsi Anda tentang seperti apa waktu yang 'produktif'?",
    nl: "De Bijbel spreekt over Kairos — Gods aangewezen moment, niet klokgemeten. Hoe daagt dat concept jouw aannames uit over hoe 'productieve' tijd eruitziet?",
  },
  {
    roman: "IV",
    en: "Do the time agreements in your team reflect one person's cultural default — or have you genuinely negotiated them together?",
    id: "Apakah kesepakatan waktu dalam tim Anda mencerminkan default budaya satu orang — atau apakah Anda benar-benar telah merundingkannya bersama?",
    nl: "Weerspiegelen de tijdsafspraken in je team de culturele standaard van één persoon — of heb je ze echt samen onderhandeld?",
  },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function TimeAndCultureClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [activeVerse, setActiveVerse] = useState<keyof typeof VERSES | null>(null);
  const [showReflection, setShowReflection] = useState(false);
  const [reflection, setReflection] = useState("");
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);
  const showSave = userPathway !== null;
  const translation = lang === "id" ? "TB" : lang === "nl" ? "NBV" : "NIV";

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("time-and-culture");
      setSaved(true);
    });
  }

  return (
    <>
      <LangToggle />
      {/* ── HERO ── */}
      <section style={{ background: "oklch(22% 0.10 260)", paddingTop: "clamp(2.5rem, 4vw, 4rem)", paddingBottom: "clamp(2.5rem, 4vw, 4rem)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, oklch(97% 0.005 80 / 0.04) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div className="container-wide" style={{ position: "relative" }}>
          <p style={{ color: "oklch(65% 0.15 45)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {t("Cross-Cultural · Guide", "Lintas Budaya · Panduan", "Cross-Cultureel · Gids")}
          </p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 600, fontSize: "clamp(40px, 6vw, 72px)", color: "oklch(97% 0.005 80)", lineHeight: 1.08, margin: "0 0 24px" }}>
            {lang === "en" ? <>Time &amp;<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Culture.</span></> : lang === "id" ? <>Waktu &amp;<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Budaya.</span></> : <>Tijd &amp;<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Cultuur.</span></>}
          </h1>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "clamp(1rem, 1.5vw, 1.15rem)", color: "oklch(72% 0.04 260)", maxWidth: "50ch", marginBottom: "2rem", lineHeight: 1.65 }}>
            {t(
              "The same Monday morning. Two people. Completely different worlds.",
              "Senin pagi yang sama. Dua orang. Dunia yang sepenuhnya berbeda.",
              "Dezelfde maandagochtend. Twee mensen. Volkomen verschillende werelden.",
            )}
          </p>

          {showSave && (
            saved ? (
              <Link href="/dashboard" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", color: "oklch(72% 0.14 145)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
                ✓ {t("In your dashboard", "Di dashboard Anda", "In uw dashboard")}
              </Link>
            ) : (
              <button onClick={handleSave} disabled={isPending} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "oklch(75% 0.04 260)", padding: "14px 28px", borderRadius: 6, fontWeight: 600, fontSize: 14, border: "1px solid oklch(42% 0.08 260)", cursor: isPending ? "wait" : "pointer" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                {isPending ? t("Saving…", "Menyimpan…", "Opslaan…") : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
              </button>
            )
          )}
        </div>
      </section>

      {/* ── SETUP ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 4rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <div style={{ maxWidth: "64ch" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>
              {t("The Story", "Ceritanya", "Het verhaal")}
            </p>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.75, color: "oklch(38% 0.05 260)", marginBottom: "1rem" }}>
              {t(
                "Sari is an Indonesian team leader at a development organisation. Klaus is a German colleague who co-leads a six-month project with her. It is Monday. They have a planning meeting scheduled for 9:00 AM.",
                "Sari adalah pemimpin tim Indonesia di sebuah organisasi pembangunan. Klaus adalah rekan kerja Jerman yang memimpin bersama proyek enam bulan bersamanya. Hari ini Senin. Mereka memiliki rapat perencanaan yang dijadwalkan pukul 09:00.",
                "Sari is een Indonesische teamleider bij een ontwikkelingsorganisatie. Klaus is een Duitse collega die een project van zes maanden samen met haar leidt. Het is maandag. Ze hebben een planningsvergadering gepland om 9:00 uur.",
              )}
            </p>
            <p style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "1.2rem", fontStyle: "italic", color: "oklch(22% 0.10 260)", lineHeight: 1.6 }}>
              {t(
                "What follows is the same morning — from two completely different worlds.",
                "Yang berikut adalah pagi yang sama — dari dua dunia yang sepenuhnya berbeda.",
                "Wat volgt is dezelfde ochtend — vanuit twee volkomen verschillende werelden.",
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── TWO TIMELINES ── */}
      <section style={{ background: "oklch(93% 0.008 80)" }}>
        {/* Column headers */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <div style={{ background: "oklch(96% 0.018 65)", padding: "1.5rem clamp(1.5rem, 4vw, 3rem)", borderBottom: "2px solid oklch(65% 0.15 45)" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", margin: 0 }}>
              {t("Sari — Indonesian Leader", "Sari — Pemimpin Indonesia", "Sari — Indonesische leider")}
            </p>
          </div>
          <div style={{ background: "oklch(95% 0.005 260)", padding: "1.5rem clamp(1.5rem, 4vw, 3rem)", borderBottom: "2px solid oklch(42% 0.08 260)" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(42% 0.08 260)", margin: 0 }}>
              {t("Klaus — German Colleague", "Klaus — Rekan Kerja Jerman", "Klaus — Duitse collega")}
            </p>
          </div>
        </div>

        {/* Moment rows */}
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: i < 3 ? "1px solid oklch(88% 0.008 80)" : "none" }}>
            {/* Sari moment */}
            <div style={{ background: "oklch(96% 0.018 65)", padding: "2rem clamp(1.5rem, 4vw, 3rem)", borderRight: "1px solid oklch(88% 0.008 80)" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.12em", color: "oklch(65% 0.15 45)", marginBottom: "0.75rem" }}>
                {SARI_MOMENTS[i].time}
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.7, color: "oklch(38% 0.05 260)", marginBottom: "0.875rem" }}>
                {lang === "en" ? SARI_MOMENTS[i].en_action : lang === "id" ? SARI_MOMENTS[i].id_action : SARI_MOMENTS[i].nl_action}
              </p>
              <p style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "1rem", fontStyle: "italic", color: "oklch(52% 0.10 45)", lineHeight: 1.6, margin: 0 }}>
                "{lang === "en" ? SARI_MOMENTS[i].en_thought : lang === "id" ? SARI_MOMENTS[i].id_thought : SARI_MOMENTS[i].nl_thought}"
              </p>
            </div>
            {/* Klaus moment */}
            <div style={{ background: "oklch(95% 0.005 260)", padding: "2rem clamp(1.5rem, 4vw, 3rem)" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.12em", color: "oklch(42% 0.08 260)", marginBottom: "0.75rem" }}>
                {KLAUS_MOMENTS[i].time}
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.7, color: "oklch(38% 0.05 260)", marginBottom: "0.875rem" }}>
                {lang === "en" ? KLAUS_MOMENTS[i].en_action : lang === "id" ? KLAUS_MOMENTS[i].id_action : KLAUS_MOMENTS[i].nl_action}
              </p>
              <p style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "1rem", fontStyle: "italic", color: "oklch(40% 0.08 260)", lineHeight: 1.6, margin: 0 }}>
                "{lang === "en" ? KLAUS_MOMENTS[i].en_thought : lang === "id" ? KLAUS_MOMENTS[i].id_thought : KLAUS_MOMENTS[i].nl_thought}"
              </p>
            </div>
          </div>
        ))}

        {/* Convergence moment */}
        <div style={{ background: "oklch(22% 0.10 260)", padding: "2rem clamp(1.5rem, 4vw, 3rem)", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.16em", color: "oklch(65% 0.15 45)", marginBottom: "0.5rem" }}>09:05</p>
          <p style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "1.3rem", fontStyle: "italic", color: "oklch(88% 0.02 80)", lineHeight: 1.5, margin: 0 }}>
            {t(
              "The meeting begins. Same room. Same agenda. Two completely different stories about what just happened.",
              "Rapat dimulai. Ruangan yang sama. Agenda yang sama. Dua cerita yang sepenuhnya berbeda tentang apa yang baru saja terjadi.",
              "De vergadering begint. Dezelfde ruimte. Dezelfde agenda. Twee volkomen verschillende verhalen over wat er zojuist is gebeurd.",
            )}
          </p>
        </div>
      </section>

      {/* ── THE GAP ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(22% 0.10 260)" }}>
        <div className="container-wide">
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "1rem", textAlign: "center" }}>
            {t("What Each Concluded", "Apa yang Disimpulkan Masing-masing", "Wat ieder concludeerde")}
          </p>
          <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: "oklch(97% 0.005 80)", textAlign: "center", marginBottom: "3rem" }}>
            {t("By 9:10, the damage was already done.", "Pada pukul 09:10, kerusakannya sudah terjadi.", "Om 9:10 was de schade al aangericht.")}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", background: "oklch(35% 0.08 260)" }}>
            <div style={{ background: "oklch(28% 0.11 260)", padding: "2.5rem clamp(1.5rem, 4vw, 2.5rem)" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>
                {t("Sari's conclusion about Klaus", "Kesimpulan Sari tentang Klaus", "Sari's conclusie over Klaus")}
              </p>
              <p style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "1.15rem", fontStyle: "italic", color: "oklch(82% 0.03 80)", lineHeight: 1.65, margin: 0 }}>
                {t(
                  "\"He had everything prepared before anyone arrived — but he sat alone in that room for twenty minutes without thinking to check on anyone. He works hard, but I'm not sure he understands what it means to lead people.\"",
                  "\"Dia sudah menyiapkan segalanya sebelum siapapun tiba — tetapi dia duduk sendirian di ruangan itu selama dua puluh menit tanpa terpikirkan untuk memeriksa siapapun. Dia bekerja keras, tapi saya tidak yakin dia mengerti apa artinya memimpin orang.\"",
                  "\"Hij had alles klaar voordat iemand er was — maar hij zat twintig minuten alleen in die ruimte zonder eraan te denken om bij iemand in te checken. Hij werkt hard, maar ik weet niet zeker of hij begrijpt wat het betekent om mensen te leiden.\"",
                )}
              </p>
            </div>
            <div style={{ background: "oklch(28% 0.11 260)", padding: "2.5rem clamp(1.5rem, 4vw, 2.5rem)" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(55% 0.08 260)", marginBottom: "1rem" }}>
                {t("Klaus's conclusion about Sari", "Kesimpulan Klaus tentang Sari", "Klaus' conclusie over Sari")}
              </p>
              <p style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "1.15rem", fontStyle: "italic", color: "oklch(82% 0.03 80)", lineHeight: 1.65, margin: 0 }}>
                {t(
                  "\"She leads this team and she was three minutes late to her own meeting. If she can't keep to 9:00 AM, how do I trust her with a six-month project deadline? I need to know if I can rely on her.\"",
                  "\"Dia memimpin tim ini dan dia tiga menit terlambat ke rapatnya sendiri. Jika dia tidak bisa mempertahankan pukul 09:00, bagaimana saya mempercayainya dengan tenggat waktu proyek enam bulan? Saya perlu tahu apakah saya bisa mengandalkannya.\"",
                  "\"Ze leidt dit team en ze was drie minuten te laat voor haar eigen vergadering. Als ze 9:00 uur niet kan nakomen, hoe kan ik haar dan vertrouwen met een deadline van zes maanden? Ik moet weten of ik op haar kan rekenen.\"",
                )}
              </p>
            </div>
          </div>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.75, color: "oklch(62% 0.04 260)", textAlign: "center", maxWidth: "56ch", margin: "2.5rem auto 0" }}>
            {t(
              "Neither conclusion was malicious. Both were sincere. And both were wrong — because each person was reading the other through an invisible cultural lens they didn't know they were wearing.",
              "Tidak ada kesimpulan yang bersifat jahat. Keduanya tulus. Dan keduanya salah — karena setiap orang membaca yang lain melalui lensa budaya tak terlihat yang tidak mereka sadari sedang mereka kenakan.",
              "Geen van beide conclusies was kwaadwillig. Beide waren oprecht. En beide waren verkeerd — omdat ieder de ander las door een onzichtbare culturele lens die ze niet wisten dat ze droegen.",
            )}
          </p>
        </div>
      </section>

      {/* ── WHAT WAS OPERATING ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.75rem" }}>
            {t("What Was Operating", "Yang Sedang Beroperasi", "Wat er speelde")}
          </p>
          <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: "oklch(22% 0.10 260)", marginBottom: "3rem", maxWidth: "36ch" }}>
            {t("Three things happening under the surface", "Tiga hal yang terjadi di bawah permukaan", "Drie dingen die onder de oppervlakte speelden")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {FRAMEWORK_POINTS.map((p, i) => (
              <div key={p.number} style={{ display: "flex", gap: "2rem", alignItems: "flex-start", padding: "2rem 0", borderBottom: i < FRAMEWORK_POINTS.length - 1 ? "1px solid oklch(90% 0.008 80)" : "none" }}>
                <span style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "3rem", fontWeight: 700, color: "oklch(65% 0.15 45)", lineHeight: 1, flexShrink: 0, minWidth: "3.5rem", paddingTop: "0.1rem" }}>{p.number}</span>
                <div>
                  <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "oklch(22% 0.10 260)", marginBottom: "0.625rem" }}>
                    {lang === "en" ? p.en_label : lang === "id" ? p.id_label : p.nl_label}
                  </h3>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.75, color: "oklch(42% 0.05 260)", margin: 0, maxWidth: "64ch" }}>
                    {lang === "en" ? p.en_body : lang === "id" ? p.id_body : p.nl_body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRIDGES ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(95% 0.008 80)" }}>
        <div className="container-wide">
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.75rem" }}>
            {t("Practical Leadership", "Kepemimpinan Praktis", "Praktisch leiderschap")}
          </p>
          <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: "oklch(22% 0.10 260)", marginBottom: "3rem", maxWidth: "32ch" }}>
            {t("Five things you can do this week", "Lima hal yang bisa Anda lakukan minggu ini", "Vijf dingen die je deze week kunt doen")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(85% 0.008 80)" }}>
            {BRIDGES.map((b, i) => (
              <div key={i} style={{ background: "oklch(97% 0.005 80)", padding: "1.5rem 2rem", display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                <span style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "2rem", fontWeight: 700, color: "oklch(65% 0.15 45)", lineHeight: 1, flexShrink: 0, minWidth: "2rem", paddingTop: "0.1rem" }}>{i + 1}</span>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.75, color: "oklch(38% 0.05 260)", margin: 0, paddingTop: "0.35rem" }}>
                  {lang === "en" ? b.en : lang === "id" ? b.id : b.nl}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BIBLICAL FOUNDATION ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(22% 0.10 260)" }}>
        <div className="container-wide">
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.75rem" }}>
            {t("Biblical Foundation", "Landasan Alkitab", "Bijbelse basis")}
          </p>
          <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: "oklch(97% 0.005 80)", marginBottom: "1.25rem", maxWidth: "36ch" }}>
            {t("Chronos and Kairos", "Chronos dan Kairos", "Chronos en Kairos")}
          </h2>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(72% 0.04 260)", maxWidth: "62ch", marginBottom: "1rem" }}>
            {t(
              "The Bible uses two distinct Greek words for time. Chronos is clock time — minutes, schedules, deadlines. Kairos is the appointed moment — the right season, the opportune time, the moment God has prepared.",
              "Alkitab menggunakan dua kata Yunani yang berbeda untuk waktu. Chronos adalah waktu jam — menit, jadwal, tenggat waktu. Kairos adalah momen yang ditetapkan — musim yang tepat, waktu yang opportun, momen yang telah Tuhan siapkan.",
              "De Bijbel gebruikt twee verschillende Griekse woorden voor tijd. Chronos is kloktijd — minuten, schema's, deadlines. Kairos is het aangewezen moment — het juiste seizoen, de geschikte tijd, het moment dat God heeft bereid.",
            )}
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(72% 0.04 260)", maxWidth: "62ch", marginBottom: "2.5rem" }}>
            {t(
              "Klaus is deeply fluent in Chronos. Sari moves more naturally in Kairos. Neither is wrong — Scripture holds both. The most important leadership moments in the Bible rarely arrived on schedule: a burning bush, an encounter at a well, a tax collector in a tree. Cross-cultural leaders who can hold both orientations are better positioned to recognise when the Spirit is moving in what looks like an interruption.",
              "Klaus sangat fasih dalam Chronos. Sari bergerak lebih alami dalam Kairos. Tidak ada yang salah — Kitab Suci menampung keduanya. Momen kepemimpinan paling penting dalam Alkitab jarang tiba sesuai jadwal: semak yang terbakar, pertemuan di sumur, pemungut cukai di pohon. Pemimpin lintas budaya yang bisa memegang kedua orientasi lebih siap untuk mengenali ketika Roh bergerak dalam apa yang terlihat seperti gangguan.",
              "Klaus is diep vloeiend in Chronos. Sari beweegt natuurlijker in Kairos. Geen van beiden is verkeerd — de Schrift houdt beide vast. De belangrijkste leiderschapsmomenten in de Bijbel kwamen zelden op schema: een brandende struik, een ontmoeting bij een put, een tollenaar in een boom. Interculturele leiders die beide oriëntaties kunnen vasthouden zijn beter gepositioneerd om te herkennen wanneer de Geest beweegt in wat eruitziet als een onderbreking.",
            )}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", background: "oklch(35% 0.08 260)" }}>
            {(["eccl-3-1", "gal-4-4"] as const).map(key => {
              const v = VERSES[key];
              const ref = lang === "en" ? v.en_ref : lang === "id" ? v.id_ref : v.nl_ref;
              const text = lang === "en" ? v.en : lang === "id" ? v.id : v.nl;
              return (
                <div key={key} style={{ background: "oklch(28% 0.11 260)", padding: "2rem" }}>
                  <button onClick={() => setActiveVerse(key)} style={{ background: "none", border: "none", cursor: "pointer", color: "oklch(65% 0.15 45)", fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "underline dotted", padding: 0, marginBottom: "0.875rem", display: "block" }}>
                    {ref} ({translation})
                  </button>
                  <p style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "1.1rem", fontStyle: "italic", color: "oklch(85% 0.03 80)", lineHeight: 1.65, margin: 0 }}>
                    "{text}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── REFLECTION ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.75rem" }}>
            {t("Your Turn", "Giliran Anda", "Jouw beurt")}
          </p>
          <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: "oklch(22% 0.10 260)", marginBottom: "1.5rem", maxWidth: "36ch" }}>
            {t("Think of your own Klaus or Sari.", "Pikirkan Klaus atau Sari Anda sendiri.", "Denk aan je eigen Klaus of Sari.")}
          </h2>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(52% 0.05 260)", marginBottom: "1rem", maxWidth: "52ch", lineHeight: 1.7 }}>
            {t(
              "A specific person comes to mind — someone whose relationship with time has frustrated or confused you. Write a few sentences about them here.",
              "Seseorang terlintas di pikiran — seseorang yang hubungannya dengan waktu telah membuat Anda frustrasi atau bingung. Tuliskan beberapa kalimat tentang mereka di sini.",
              "Een specifiek persoon komt in gedachten — iemand wiens omgang met tijd je heeft gefrustreerd of verward. Schrijf hier een paar zinnen over hen.",
            )}
          </p>
          <textarea
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            placeholder={t(
              "Their name, your context, what happened…",
              "Nama mereka, konteks Anda, apa yang terjadi…",
              "Hun naam, jouw context, wat er gebeurde…",
            )}
            rows={4}
            style={{ width: "100%", maxWidth: "640px", fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.7, color: "oklch(30% 0.08 260)", background: "oklch(99% 0.003 80)", border: "1px solid oklch(80% 0.008 80)", padding: "1rem 1.25rem", resize: "vertical", outline: "none", boxSizing: "border-box", display: "block", marginBottom: "1.5rem" }}
          />

          <button
            onClick={() => setShowReflection(v => !v)}
            style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", color: "oklch(22% 0.10 260)", background: "none", border: "1px solid oklch(22% 0.10 260)", padding: "0.625rem 1.25rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
          >
            {showReflection
              ? t("Hide questions", "Sembunyikan pertanyaan", "Vragen verbergen")
              : t("Show reflection questions", "Tampilkan pertanyaan refleksi", "Reflectievragen tonen")}
            <span style={{ fontSize: "0.9rem" }}>{showReflection ? "↑" : "↓"}</span>
          </button>

          {showReflection && (
            <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1px", background: "oklch(85% 0.008 80)", maxWidth: "640px" }}>
              {QUESTIONS.map(q => (
                <div key={q.roman} style={{ background: "oklch(97% 0.005 80)", padding: "1.5rem 2rem", display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.65rem", color: "oklch(65% 0.15 45)", letterSpacing: "0.08em", flexShrink: 0, paddingTop: "0.2rem", minWidth: "1.5rem" }}>{q.roman}</span>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.7, color: "oklch(38% 0.05 260)", margin: 0 }}>
                    {lang === "en" ? q.en : lang === "id" ? q.id : q.nl}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(22% 0.10 260)" }}>
        <div className="container-wide" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>
              {t("More in the Library", "Lebih Banyak di Perpustakaan", "Meer in de Bibliotheek")}
            </p>
            <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", color: "oklch(97% 0.005 80)", marginBottom: "1rem" }}>
              {t("Part of the full content library.", "Bagian dari perpustakaan konten lengkap.", "Onderdeel van de volledige contentbibliotheek.")}
            </h2>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(65% 0.04 260)", marginBottom: "2rem", maxWidth: "48ch" }}>
              {t(
                "Time & Culture is one of many dimensions explored in the Crispy Development library — built for leaders navigating cross-cultural complexity.",
                "Waktu & Budaya adalah salah satu dari banyak dimensi yang dieksplorasi dalam perpustakaan Crispy Development — dibangun untuk pemimpin yang menavigasi kompleksitas lintas budaya.",
                "Tijd & Cultuur is een van de vele dimensies die worden onderzocht in de Crispy Development bibliotheek — gebouwd voor leiders die interculturele complexiteit navigeren.",
              )}
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {!userPathway ? (
                <Link href="/membership" className="btn-primary">{t("Join the Community →", "Bergabung →", "Word lid →")}</Link>
              ) : saved ? (
                <Link href="/dashboard" className="btn-primary">{t("Go to Dashboard →", "Ke Dashboard →", "Naar Dashboard →")}</Link>
              ) : (
                <button onClick={handleSave} disabled={isPending} className="btn-primary" style={{ border: "none", cursor: isPending ? "wait" : "pointer" }}>
                  {isPending ? t("Saving…", "Menyimpan…", "Opslaan…") : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
                </button>
              )}
              <Link href="/resources" className="btn-outline-navy">{t("Browse the Library", "Jelajahi Perpustakaan", "Verken de Bibliotheek")}</Link>
            </div>
          </div>
          <div style={{ background: "oklch(28% 0.11 260)", padding: "2.5rem" }}>
            <p style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "1.25rem", fontStyle: "italic", color: "oklch(80% 0.04 260)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
              {t(
                "\"The most disruptive cross-cultural tool is a question asked before a conclusion is drawn.\"",
                "\"Alat lintas budaya yang paling transformatif adalah pertanyaan yang diajukan sebelum kesimpulan ditarik.\"",
                "\"Het meest transformatieve interculturele instrument is een vraag die wordt gesteld voordat een conclusie wordt getrokken.\"",
              )}
            </p>
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", color: "oklch(65% 0.15 45)", textTransform: "uppercase" }}>Crispy Development</span>
          </div>
        </div>
      </section>

      {/* ── VERSE POPUP ── */}
      {activeVerse && (
        <div onClick={() => setActiveVerse(null)} style={{ position: "fixed", inset: 0, background: "oklch(10% 0.05 260 / 0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1.5rem" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "oklch(97% 0.005 80)", borderRadius: "12px", padding: "2.5rem clamp(1.5rem, 4vw, 2.5rem)", maxWidth: "520px", width: "100%" }}>
            <p style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "1.25rem", fontStyle: "italic", color: "oklch(22% 0.10 260)", lineHeight: 1.65, marginBottom: "1rem" }}>
              "{lang === "en" ? VERSES[activeVerse].en : lang === "id" ? VERSES[activeVerse].id : VERSES[activeVerse].nl}"
            </p>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, color: "oklch(65% 0.15 45)", letterSpacing: "0.08em", marginBottom: "1.5rem" }}>
              — {lang === "en" ? VERSES[activeVerse].en_ref : lang === "id" ? VERSES[activeVerse].id_ref : VERSES[activeVerse].nl_ref} ({translation})
            </p>
            <button onClick={() => setActiveVerse(null)} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, background: "oklch(22% 0.10 260)", color: "oklch(97% 0.005 80)", border: "none", padding: "0.625rem 1.5rem", cursor: "pointer", borderRadius: "4px" }}>
              {t("Close", "Tutup", "Sluiten")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
