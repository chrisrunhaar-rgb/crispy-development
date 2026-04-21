"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const FRAMEWORKS = [
  {
    en_title: "Reflection-on-Action",
    id_title: "Refleksi Setelah Tindakan",
    nl_title: "Reflectie na Actie",
    en_subtitle: "Schön — after the event",
    id_subtitle: "Schön — setelah kejadian",
    nl_subtitle: "Schön — na de gebeurtenis",
    en_desc: "Deliberate reflection after an event has concluded. You consider what happened, what worked, what didn't, and why. This is the foundation of the debrief — the structured conversation held after any significant experience.",
    id_desc: "Refleksi yang disengaja setelah suatu kejadian berakhir. Anda mempertimbangkan apa yang terjadi, apa yang berhasil, apa yang tidak, dan mengapa. Ini adalah fondasi debrief.",
    nl_desc: "Doelbewuste reflectie nadat een gebeurtenis is afgerond. Je overweegt wat er gebeurde, wat werkte, wat niet, en waarom. Dit is de basis van de debrief.",
  },
  {
    en_title: "Reflection-in-Action",
    id_title: "Refleksi dalam Tindakan",
    nl_title: "Reflectie tijdens Actie",
    en_subtitle: "Schön — during the event",
    id_subtitle: "Schön — selama kejadian",
    nl_subtitle: "Schön — tijdens de gebeurtenis",
    en_desc: "Real-time adjustment as events unfold — noticing what's happening, reading the room, and improvising based on what you observe. High-competence leaders do this instinctively. It can be deliberately developed.",
    id_desc: "Penyesuaian real-time saat kejadian berlangsung — memperhatikan apa yang terjadi, membaca ruangan, dan berimprovisasi berdasarkan apa yang Anda amati.",
    nl_desc: "Aanpassing in real-time terwijl gebeurtenissen zich ontvouwen — opmerken wat er gebeurt, de sfeer lezen, en improviseren op basis van wat je ziet.",
  },
  {
    en_title: "Experiential Learning Cycle",
    id_title: "Siklus Pembelajaran Eksperiensial",
    nl_title: "Ervaringsleerscyclus",
    en_subtitle: "Kolb — experience → reflect → generalise → test",
    id_subtitle: "Kolb — pengalaman → refleksi → generalisasi → uji",
    nl_subtitle: "Kolb — ervaring → reflectie → generaliseren → testen",
    en_desc: "Learning only becomes lasting when experience is processed through reflection, generalised into a principle, and then tested in a new situation. Without deliberate reflection, leaders repeat the same mistakes dressed in different circumstances.",
    id_desc: "Pembelajaran hanya menjadi abadi ketika pengalaman diproses melalui refleksi, digeneralisasi menjadi prinsip, kemudian diuji dalam situasi baru. Tanpa refleksi yang disengaja, pemimpin mengulangi kesalahan yang sama.",
    nl_desc: "Leren wordt pas blijvend wanneer ervaring verwerkt wordt door reflectie, gegeneraliseerd naar een principe, en vervolgens getest in een nieuwe situatie.",
  },
];

const DEBRIEF_QUESTIONS = [
  {
    num: "01",
    en: "What were we trying to accomplish? (Establish the original intent before evaluating the outcome.)",
    id: "Apa yang ingin kita capai? (Tetapkan niat asli sebelum mengevaluasi hasil.)",
    nl: "Wat probeerden we te bereiken? (Stel de oorspronkelijke bedoeling vast voor je de uitkomst evalueert.)",
  },
  {
    num: "02",
    en: "Where did we hit or miss our objectives? (Name both — not just the failures.)",
    id: "Di mana kita mencapai atau melewatkan tujuan kita? (Sebutkan keduanya — bukan hanya kegagalan.)",
    nl: "Waar troffen we onze doelstellingen wel of niet? (Benoem beide — niet alleen de mislukkingen.)",
  },
  {
    num: "03",
    en: "What caused those results? (Go below the surface — seek underlying reasons, not just descriptions.)",
    id: "Apa yang menyebabkan hasil tersebut? (Pergi di bawah permukaan — cari alasan yang mendasari, bukan hanya deskripsi.)",
    nl: "Wat veroorzaakte die resultaten? (Ga onder de oppervlakte — zoek onderliggende redenen, niet alleen beschrijvingen.)",
  },
  {
    num: "04",
    en: "What did we learn about ourselves, our team, and our context? (The personal and systemic, not just the tactical.)",
    id: "Apa yang kita pelajari tentang diri kita, tim kita, dan konteks kita? (Yang personal dan sistemik, bukan hanya taktis.)",
    nl: "Wat hebben we geleerd over onszelf, ons team en onze context? (Het persoonlijke en systemische, niet alleen het tactische.)",
  },
  {
    num: "05",
    en: "What will we start, stop, or continue? (Convert reflection into concrete next action.)",
    id: "Apa yang akan kita mulai, hentikan, atau lanjutkan? (Ubah refleksi menjadi tindakan konkret berikutnya.)",
    nl: "Wat zullen we starten, stoppen of doorzetten? (Zet reflectie om in concrete volgende actie.)",
  },
];

const SCENARIOS = [
  {
    title: { en: "The Face-Saving Silence", id: "Keheningan Menyelamatkan Muka", nl: "De Gezichtsbesparende Stilte" },
    setup: {
      en: "A Western leader runs a direct post-project debrief with a Malaysian team — open questions, honest analysis, naming what went wrong. He frames it as normal accountability and healthy learning culture.",
      id: "Seorang pemimpin Barat menjalankan debrief pasca-proyek langsung dengan tim Malaysia — pertanyaan terbuka, analisis jujur, menyebutkan apa yang salah.",
      nl: "Een Westerse leider houdt een directe post-project debrief met een Maleisisch team — open vragen, eerlijke analyse, benoemen wat misging.",
    },
    breakdown: {
      en: "The team stays silent or gives vague, positive answers. No one names failures. The conversation reinforces the status quo. The leader concludes the team is unengaged. The team concludes the leader wants blame, not learning.",
      id: "Tim tetap diam atau memberikan jawaban yang samar dan positif. Tidak ada yang menyebutkan kegagalan. Pemimpin menyimpulkan tim tidak terlibat. Tim menyimpulkan pemimpin menginginkan kesalahan, bukan pembelajaran.",
      nl: "Het team blijft stil of geeft vage, positieve antwoorden. Niemand benoemt mislukkingen. De leider concludeert dat het team niet betrokken is. Het team concludeert dat de leider schuld wil, geen leren.",
    },
    response: {
      en: "Shift from public to private reflection. Collect honest input through written responses or 1-1 conversations first. In the group debrief, frame learning as collective — 'What did we learn together?' not 'Who got this wrong?'",
      id: "Beralih dari refleksi publik ke privat. Kumpulkan masukan jujur melalui respons tertulis atau percakapan 1-1 terlebih dahulu. Dalam debrief kelompok, bingkai pembelajaran sebagai kolektif.",
      nl: "Verschuif van publieke naar privéreflectie. Verzamel eerlijke input via schriftelijke reacties of 1-op-1 gesprekken eerst. Kader leren als collectief in de groepsdebrief.",
    },
  },
  {
    title: { en: "Collective vs. Individual Accountability", id: "Akuntabilitas Kolektif vs. Individual", nl: "Collectieve vs. Individuele Verantwoording" },
    setup: {
      en: "After a failed outreach event, a Dutch leader asks each team member to reflect individually: 'What did YOU do that contributed to this?' He distributes accountability widely, expecting honest self-assessment.",
      id: "Setelah acara penjangkauan yang gagal, seorang pemimpin Belanda meminta setiap anggota tim untuk merefleksikan secara individual: 'Apa yang ANDA lakukan yang berkontribusi pada ini?'",
      nl: "Na een mislukt outreach-evenement vraagt een Nederlandse leider elk teamlid individueel te reflecteren: 'Wat heb JIJ gedaan dat hieraan bijdroeg?'",
    },
    breakdown: {
      en: "In an Indonesian team accustomed to collective responsibility, individual attribution feels like targeting and blame. Team members become defensive, not reflective. The exercise damages relationships rather than building learning culture.",
      id: "Dalam tim Indonesia yang terbiasa dengan tanggung jawab kolektif, atribusi individual terasa seperti penargetan dan kesalahan.",
      nl: "In een Indonesisch team gewend aan collectieve verantwoordelijkheid, voelt individuele attributie aan als targeten en beschuldigen.",
    },
    response: {
      en: "Begin debriefs with 'What did we learn as a team?' before 'What did each of us contribute?' In collectivist cultures, shared reflection comes first — individual accountability emerges from within it, not imposed from outside.",
      id: "Mulai debrief dengan 'Apa yang kita pelajari sebagai tim?' sebelum 'Apa yang masing-masing dari kita kontribusikan?' Dalam budaya kolektivis, refleksi bersama datang pertama.",
      nl: "Begin debriefs met 'Wat hebben we als team geleerd?' voor 'Wat heeft elk van ons bijgedragen?' In collectivistische culturen komt gedeelde reflectie eerst.",
    },
  },
  {
    title: { en: "The Leader Who Never Reflects", id: "Pemimpin yang Tidak Pernah Merefleksikan", nl: "De Leider die Nooit Reflecteert" },
    setup: {
      en: "A high-activity leader moves from event to event with no structured debrief. He's always onto the next thing. His team is capable, but three years in, they keep making the same strategic errors in new forms.",
      id: "Seorang pemimpin aktif tinggi berpindah dari satu acara ke acara lainnya tanpa debrief terstruktur. Timnya mampu, tetapi tiga tahun kemudian mereka terus membuat kesalahan strategis yang sama dalam bentuk baru.",
      nl: "Een high-activity leider gaat van evenement naar evenement zonder gestructureerde debrief. Drie jaar later maken ze steeds dezelfde strategische fouten in nieuwe vormen.",
    },
    breakdown: {
      en: "Activity without reflection produces repetition without learning. Experience becomes habit, not wisdom. The team improves tactically but not strategically. The leader's instincts remain unexamined — some helpful, some harmful.",
      id: "Aktivitas tanpa refleksi menghasilkan pengulangan tanpa pembelajaran. Pengalaman menjadi kebiasaan, bukan kebijaksanaan.",
      nl: "Activiteit zonder reflectie produceert herhaling zonder leren. Ervaring wordt gewoonte, niet wijsheid.",
    },
    response: {
      en: "Schedule a 30-minute debrief immediately after every significant event — before the team disperses, while the experience is still alive. The question 'What did we just learn?' is worth more than a week of planning meetings.",
      id: "Jadwalkan debrief 30 menit segera setelah setiap acara signifikan — sebelum tim bubar, sementara pengalaman masih hidup.",
      nl: "Plan een debrief van 30 minuten onmiddellijk na elk significant evenement — voor het team uiteengaat, terwijl de ervaring nog levendig is.",
    },
  },
];

const PRACTICES = [
  {
    en: "Schedule a 30-minute debrief immediately after every significant event — before the team disperses.",
    id: "Jadwalkan debrief 30 menit segera setelah setiap acara signifikan — sebelum tim bubar.",
    nl: "Plan een debrief van 30 minuten direct na elk significant evenement — voor het team uiteengaat.",
  },
  {
    en: "In high-context cultures, collect written reflections before the group debrief so everyone has processed privately first.",
    id: "Dalam budaya konteks tinggi, kumpulkan refleksi tertulis sebelum debrief kelompok sehingga semua orang telah memproses secara pribadi terlebih dahulu.",
    nl: "Verzamel in hoge-context culturen schriftelijke reflecties voor de groepsdebrief zodat iedereen eerst privé heeft nagedacht.",
  },
  {
    en: "Use the 5 questions (What? Where? What caused? What did we learn? What next?) as a consistent debrief structure every time.",
    id: "Gunakan 5 pertanyaan (Apa? Di mana? Apa penyebabnya? Apa yang kita pelajari? Apa selanjutnya?) sebagai struktur debrief yang konsisten setiap saat.",
    nl: "Gebruik de 5 vragen (Wat? Waar? Wat veroorzaakte? Wat leerden we? Wat nu?) als consistente debriefstructuur elke keer.",
  },
  {
    en: "Keep a personal learning journal — not a task log, but a place where you capture what you're noticing about yourself as a leader.",
    id: "Simpan jurnal pembelajaran pribadi — bukan log tugas, tetapi tempat Anda menangkap apa yang Anda perhatikan tentang diri Anda sebagai pemimpin.",
    nl: "Houd een persoonlijk leerlogboek bij — niet een takenlog, maar een plek waar je vastlegt wat je opmerkt over jezelf als leider.",
  },
  {
    en: "Frame failures collectively in group debriefs: 'What did we learn?' not 'Who got this wrong?' — especially in collectivist cultures.",
    id: "Bingkai kegagalan secara kolektif dalam debrief kelompok: 'Apa yang kita pelajari?' bukan 'Siapa yang salah?' — terutama dalam budaya kolektivis.",
    nl: "Kader mislukkingen collectief in groepsdebriefs: 'Wat hebben we geleerd?' niet 'Wie had het fout?' — vooral in collectivistische culturen.",
  },
];

const REFLECTION = [
  {
    roman: "I",
    en: "When did you last conduct a genuine debrief — not a task review, but an honest 'what did we learn?' conversation?",
    id: "Kapan terakhir kali Anda melakukan debrief yang tulus — bukan tinjauan tugas, tetapi percakapan 'apa yang kita pelajari?' yang jujur?",
    nl: "Wanneer heb je voor het laatst een echte debrief gehouden — niet een takenevaluatie, maar een eerlijk 'wat hebben we geleerd?' gesprek?",
  },
  {
    roman: "II",
    en: "What pattern of mistake have you repeated more than once as a leader? What would reflection have interrupted?",
    id: "Pola kesalahan apa yang telah Anda ulangi lebih dari sekali sebagai pemimpin? Apa yang akan refleksi ganggu?",
    nl: "Welk patroon van fouten heb je meer dan eens herhaald als leider? Wat had reflectie onderbroken?",
  },
  {
    roman: "III",
    en: "How does your cultural context shape what can and cannot be said in a debrief — and how do you create space for honesty within those constraints?",
    id: "Bagaimana konteks budaya Anda membentuk apa yang bisa dan tidak bisa dikatakan dalam debrief — dan bagaimana Anda menciptakan ruang untuk kejujuran dalam batasan tersebut?",
    nl: "Hoe vormt jouw culturele context wat wel en niet gezegd kan worden in een debrief — en hoe creëer je ruimte voor eerlijkheid binnen die beperkingen?",
  },
  {
    roman: "IV",
    en: "What significant experience from the last 6 months have you never fully processed? What would change if you did?",
    id: "Pengalaman signifikan apa dari 6 bulan terakhir yang belum pernah Anda proses sepenuhnya? Apa yang akan berubah jika Anda melakukannya?",
    nl: "Welke significante ervaring van de afgelopen 6 maanden heb je nooit volledig verwerkt? Wat zou er veranderen als je dat deed?",
  },
  {
    roman: "V",
    en: "Lamentations 3:40 says 'Let us examine our ways.' What ways are you currently unexamined?",
    id: "Ratapan 3:40 berkata 'Marilah kita menyelidiki dan memeriksa hidup kita.' Cara apa yang saat ini belum Anda periksa?",
    nl: "Klaagliederen 3:40 zegt 'Laten wij onze wegen onderzoeken.' Welke wegen zijn momenteel ononderzocht bij jou?",
  },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function DebriefingReflectionClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [openScenario, setOpenScenario] = useState<number | null>(null);
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("debriefing-reflection");
      setSaved(true);
    });
  }

  const navy = "oklch(22% 0.10 260)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const orange = "oklch(65% 0.15 45)";
  const bodyText = "oklch(38% 0.05 260)";

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>
      <div style={{ background: lightGray, borderBottom: "1px solid oklch(90% 0.01 80)", padding: "10px 24px", display: "flex", gap: 8, justifyContent: "flex-end" }}>
        {(["en", "id", "nl"] as Lang[]).map((l) => (
          <button key={l} onClick={() => setLang(l)} style={{ padding: "4px 14px", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, background: lang === l ? navy : "transparent", color: lang === l ? offWhite : bodyText }}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ background: navy, padding: "80px 24px 72px", textAlign: "center" }}>
        <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
          {t("Leadership Practice", "Praktik Kepemimpinan", "Leiderschapspraktijk")}
        </p>
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: offWhite, margin: "0 auto 20px", maxWidth: 760, lineHeight: 1.15 }}>
          {t("Debriefing & Reflection", "Debriefing & Refleksi", "Debriefing & Reflectie")}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(85% 0.03 80)", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.6, fontStyle: "italic" }}>
          {t(
            '"We do not learn from experience — we learn from reflecting on experience." — John Dewey',
            '"Kita tidak belajar dari pengalaman — kita belajar dari merefleksikan pengalaman." — John Dewey',
            '"We leren niet van ervaring — we leren van het reflecteren op ervaring." — John Dewey'
          )}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={handleSave} disabled={saved || isPending} style={{ padding: "12px 28px", border: "none", cursor: saved ? "default" : "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, background: saved ? "oklch(55% 0.08 260)" : orange, color: offWhite }}>
            {saved ? t("Saved", "Tersimpan", "Opgeslagen") : t("Save to Dashboard", "Simpan ke Dasbor", "Opslaan in Dashboard")}
          </button>
          <Link href="/resources" style={{ padding: "12px 28px", border: "1px solid oklch(50% 0.05 260)", fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 600, color: offWhite, textDecoration: "none" }}>
            {t("All Resources", "Semua Sumber", "Alle Bronnen")}
          </Link>
        </div>
      </div>

      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, marginBottom: 20 }}>
          {t(
            "High-activity leaders in cross-cultural ministry rarely lack experience. They lack reflection. They move from event to event, decision to decision, crisis to crisis — learning very little because no one has scheduled the 30-minute conversation that would turn experience into wisdom.",
            "Pemimpin aktif tinggi dalam pelayanan lintas budaya jarang kekurangan pengalaman. Mereka kekurangan refleksi. Mereka bergerak dari satu acara ke acara lainnya — belajar sangat sedikit karena tidak ada yang menjadwalkan percakapan 30 menit yang akan mengubah pengalaman menjadi kebijaksanaan.",
            "High-activity leiders in interculturele bediening missen zelden ervaring. Ze missen reflectie. Ze bewegen van evenement naar evenement — leren heel weinig omdat niemand het 30-minuten gesprek heeft ingepland dat ervaring in wijsheid zou omzetten."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75 }}>
          {t(
            "Debriefing is the structured practice of extracting learning from experience. In cross-cultural contexts, it requires cultural intelligence — what unlocks honest reflection in Amsterdam may shut it down in Manila. The leader who masters cross-cultural debriefing builds a team that genuinely learns together.",
            "Debriefing adalah praktik terstruktur mengekstrak pembelajaran dari pengalaman. Dalam konteks lintas budaya, itu membutuhkan kecerdasan budaya — apa yang membuka refleksi jujur di Amsterdam mungkin menutupnya di Manila.",
            "Debriefing is de gestructureerde praktijk van het extraheren van leren uit ervaring. In interculturele contexten vereist het culturele intelligentie — wat eerlijke reflectie opent in Amsterdam kan het sluiten in Manila."
          )}
        </p>
      </div>

      {/* 3 frameworks */}
      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 48, textAlign: "center" }}>
            {t("3 Frameworks for Reflective Practice", "3 Kerangka untuk Praktik Reflektif", "3 Raamwerken voor Reflectieve Praktijk")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {FRAMEWORKS.map((f, i) => (
              <div key={i} style={{ background: offWhite, padding: "28px 32px" }}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 44, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 36, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</div>
                  <div>
                    <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 17, fontWeight: 700, color: navy, marginBottom: 4 }}>
                      {lang === "en" ? f.en_title : lang === "id" ? f.id_title : f.nl_title}
                    </h3>
                    <p style={{ fontSize: 13, color: orange, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
                      {lang === "en" ? f.en_subtitle : lang === "id" ? f.id_subtitle : f.nl_subtitle}
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: "0 0 0 52px" }}>
                  {lang === "en" ? f.en_desc : lang === "id" ? f.id_desc : f.nl_desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5 debrief questions */}
      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 12, textAlign: "center" }}>
          {t("5 Questions for Every Debrief", "5 Pertanyaan untuk Setiap Debrief", "5 Vragen voor Elke Debrief")}
        </h2>
        <p style={{ textAlign: "center", color: bodyText, fontSize: 15, marginBottom: 40 }}>
          {t("Use these consistently after any significant event or decision", "Gunakan ini secara konsisten setelah setiap acara atau keputusan signifikan", "Gebruik deze consistent na elk significant evenement of beslissing")}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {DEBRIEF_QUESTIONS.map((q) => (
            <div key={q.num} style={{ background: lightGray, padding: "20px 24px", display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 36, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 32, flexShrink: 0 }}>{q.num}</div>
              <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0, paddingTop: 4 }}>
                {lang === "en" ? q.en : lang === "id" ? q.id : q.nl}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scenarios */}
      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 12, textAlign: "center" }}>
            {t("When Debriefing Breaks Down", "Ketika Debriefing Gagal", "Wanneer Debriefing Mislukt")}
          </h2>
          <p style={{ textAlign: "center", color: bodyText, fontSize: 15, marginBottom: 40 }}>
            {t("Three cross-cultural scenarios — and what genuine reflection looks like", "Tiga skenario lintas budaya — dan seperti apa refleksi yang tulus", "Drie interculturele scenario's — en hoe echte reflectie eruitziet")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {SCENARIOS.map((s, i) => {
              const isOpen = openScenario === i;
              return (
                <div key={i} style={{ border: `1px solid ${isOpen ? orange : "oklch(88% 0.01 80)"}`, overflow: "hidden" }}>
                  <button onClick={() => setOpenScenario(isOpen ? null : i)} style={{ width: "100%", padding: "20px 28px", background: isOpen ? navy : offWhite, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, textAlign: "left" }}>
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 16, fontWeight: 700, color: isOpen ? offWhite : navy }}>{s.title[lang]}</span>
                    <span style={{ color: isOpen ? orange : bodyText, fontSize: 20, flexShrink: 0, lineHeight: 1 }}>{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: "28px 28px 32px", background: offWhite }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: orange, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{t("The Situation", "Situasinya", "De Situatie")}</p>
                      <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, marginBottom: 24 }}>{s.setup[lang]}</p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "oklch(45% 0.15 20)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{t("What Went Wrong", "Yang Salah", "Wat Misging")}</p>
                      <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, marginBottom: 24 }}>{s.breakdown[lang]}</p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "oklch(40% 0.12 160)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{t("Reflective Response", "Respons Reflektif", "Reflectieve Respons")}</p>
                      <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>{s.response[lang]}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Biblical anchor */}
      <div style={{ background: navy, padding: "72px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
            {t("Faith Anchor", "Jangkar Iman", "Geloofsanker")}
          </p>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: offWhite, marginBottom: 48 }}>
            {t("The Biblical Call to Reflection", "Panggilan Alkitabiah untuk Refleksi", "De Bijbelse Oproep tot Reflectie")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {[
              {
                ref: "Lamentations 3:40",
                verse: {
                  en: '"Let us search out and examine our ways, and turn back to the Lord."',
                  id: '"Marilah kita menyelidiki dan memeriksa hidup kita, dan berbalik kepada TUHAN."',
                  nl: '"Laten wij onze wegen onderzoeken en doorvorsen, en ons tot de Heer bekeren."',
                },
                comment: {
                  en: "Reflection is not optional for the person of faith — it is the practice that precedes turning. Before any course correction, there must be an honest examination of the path being walked. This is the theological foundation of the debrief.",
                  id: "Refleksi tidak opsional bagi orang yang beriman — itu adalah praktik yang mendahului pertobatan. Sebelum koreksi arah apa pun, harus ada pemeriksaan jujur tentang jalan yang sedang ditempuh.",
                  nl: "Reflectie is niet optioneel voor de gelovige — het is de praktijk die voorafgaat aan bekering. Voor elke koerscorrectie moet er een eerlijk onderzoek zijn van het pad dat bewandeld wordt.",
                },
              },
              {
                ref: "Proverbs 4:26",
                verse: {
                  en: '"Give careful thought to the paths for your feet and be steadfast in all your ways."',
                  id: '"Perhatikanlah jalan kakimu, maka selamatlah segala jalanmu."',
                  nl: '"Let op het pad voor uw voeten, dan liggen al uw wegen vast."',
                },
                comment: {
                  en: "The reflective leader is not passive about their direction. 'Give careful thought' is an active, ongoing discipline — not a once-per-year exercise. The path is examined continuously so that steadfastness becomes possible.",
                  id: "Pemimpin yang reflektif tidak pasif tentang arah mereka. 'Perhatikanlah' adalah disiplin aktif dan berkelanjutan — bukan latihan sekali setahun.",
                  nl: "De reflectieve leider is niet passief over hun richting. 'Let op' is een actieve, voortdurende discipline — geen eenmalige jaarlijkse oefening.",
                },
              },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: "left" }}>
                <p style={{ color: orange, fontSize: 13, fontWeight: 700, marginBottom: 10 }}>{item.ref}</p>
                <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 20, fontStyle: "italic", color: offWhite, lineHeight: 1.6, marginBottom: 16 }}>{item.verse[lang]}</p>
                <p style={{ fontSize: 15, color: "oklch(78% 0.03 80)", lineHeight: 1.75, margin: 0 }}>{item.comment[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Practices */}
      <div style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 48, textAlign: "center" }}>
            {t("5 Practices", "5 Praktik", "5 Praktijken")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {PRACTICES.map((p, i) => (
              <div key={i} style={{ background: lightGray, padding: "24px 28px", display: "flex", gap: 24, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 44, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 36, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</div>
                <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0, paddingTop: 6 }}>{lang === "en" ? p.en : lang === "id" ? p.id : p.nl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reflection */}
      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
            {t("Reflection Questions", "Pertanyaan Refleksi", "Reflectievragen")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {REFLECTION.map((q) => (
              <div key={q.roman} style={{ background: offWhite, padding: "24px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 22, fontWeight: 700, color: orange, minWidth: 28, flexShrink: 0 }}>{q.roman}</div>
                <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>{lang === "en" ? q.en : lang === "id" ? q.id : q.nl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: navy, padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: offWhite, marginBottom: 16 }}>
          {t("Keep Growing", "Terus Bertumbuh", "Blijf Groeien")}
        </h2>
        <p style={{ color: "oklch(80% 0.03 80)", fontSize: 16, lineHeight: 1.75, maxWidth: 540, margin: "0 auto 32px" }}>
          {t("Explore more resources to deepen your cross-cultural leadership.", "Jelajahi lebih banyak sumber untuk memperdalam kepemimpinan lintas budaya Anda.", "Verken meer bronnen om je intercultureel leiderschap te verdiepen.")}
        </p>
        <Link href="/resources" style={{ display: "inline-block", padding: "14px 32px", background: orange, color: offWhite, fontFamily: "Montserrat, sans-serif", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
          {t("Browse All Resources", "Jelajahi Semua Sumber", "Bekijk Alle Bronnen")}
        </Link>
      </div>
    </div>
  );
}
