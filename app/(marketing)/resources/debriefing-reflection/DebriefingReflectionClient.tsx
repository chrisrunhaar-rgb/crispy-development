"use client";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id";
const tFn = (en: string, id: string, lang: Lang) =>
  lang === "en" ? en : id;

const VERSES = {
  "prov-4-7": {
    en_ref: "Proverbs 4:7", id_ref: "Amsal 4:7",
    en: "The beginning of wisdom is this: Get wisdom, and whatever you get, get insight.",
    id: "Permulaan hikmat ialah: perolehlah hikmat dan dengan segala yang kaupekatkan perolehlah pengertian.",
  },
  "james-1-19": {
    en_ref: "James 1:19", id_ref: "Yakobus 1:19",
    en: "My dear brothers and sisters, take note of this: Everyone should be quick to listen, slow to speak and slow to become angry.",
    id: "Hai saudara-saudara yang kukasihi, ingatlah hal ini: setiap orang hendaklah cepat untuk mendengar, tetapi lambat untuk berkata-kata, dan juga lambat untuk marah.",
  },
};

const ORID_STAGES = [
  {
    key: "O",
    letter: "O",
    color: "oklch(65% 0.15 45)",
    colorBg: "oklch(65% 0.15 45 / 0.08)",
    en_label: "Objective",
    id_label: "Objektif",
    en_sub: "What happened?",
    id_sub: "Apa yang terjadi?",
    en_guide: "Start with the observable facts — not what it meant, not how you felt. Just what actually happened. This stage protects the debrief from jumping to conclusions before the group has agreed on what the shared experience actually was.",
    id_guide: "Mulailah dengan fakta yang dapat diamati — bukan apa artinya, bukan bagaimana perasaan Anda. Hanya apa yang benar-benar terjadi. Tahap ini melindungi debrief dari melompat ke kesimpulan sebelum kelompok sepakat tentang apa pengalaman bersama sebenarnya.",
    en_questions: [
      "What did you observe happening? What did you see, hear, or notice?",
    ],
    id_questions: [
      "Apa yang Anda amati terjadi? Apa yang Anda lihat, dengar, atau perhatikan?",
    ],
    
    en_placeholder: "Describe what actually happened — the facts, events, and observations...",
    id_placeholder: "Ceritakan apa yang sebenarnya terjadi — fakta, kejadian, dan pengamatan...",
    en_cross: "In high-context cultures, the 'objective' facts may be interpreted relationally rather than logically. A missed deadline, for instance, may be less about time management and more about a relationship that needed tending first. Begin here without assuming your frame is the only frame.",
    id_cross: "Dalam budaya high-context, 'fakta objektif' mungkin ditafsirkan secara relasional daripada logis. Tenggat waktu yang terlewat, misalnya, mungkin kurang tentang manajemen waktu dan lebih tentang hubungan yang perlu dijaga lebih dulu.",
  },
  {
    key: "R",
    letter: "R",
    color: "oklch(58% 0.14 200)",
    colorBg: "oklch(58% 0.14 200 / 0.08)",
    en_label: "Reflective",
    id_label: "Reflektif",
    en_sub: "How did it feel?",
    id_sub: "Bagaimana rasanya?",
    en_guide: "Now bring in the emotional layer. This is often skipped — especially in cultures where naming feelings in a group setting is uncomfortable, or where showing emotion signals weakness. But the emotional data is real data. If it's not surfaced here, it will surface later as a conflict.",
    id_guide: "Sekarang masukkan lapisan emosional. Ini sering dilewati — terutama dalam budaya di mana menyebutkan perasaan dalam kelompok tidak nyaman, atau di mana menunjukkan emosi menandakan kelemahan. Tetapi data emosional adalah data nyata.",
    en_questions: [
      "What was the emotional atmosphere in the team during this experience?",
    ],
    id_questions: [
      "Bagaimana suasana emosional dalam tim selama pengalaman ini?",
    ],
    
    en_placeholder: "Describe the emotional experience — what the team was feeling, and when...",
    id_placeholder: "Ceritakan pengalaman emosional — apa yang dirasakan tim, dan kapan...",
    en_cross: "Some team members may express emotion through indirection — a story, a metaphor, or a reference to someone else's experience rather than their own. Create space for this. Not every reflective answer will be a direct personal statement, and that's still valid data.",
    id_cross: "Beberapa anggota tim mungkin mengungkapkan emosi melalui ketidaklangsungan — cerita, metafora, atau referensi pada pengalaman orang lain daripada milik sendiri. Buat ruang untuk ini.",
  },
  {
    key: "I",
    letter: "I",
    color: "oklch(52% 0.14 290)",
    colorBg: "oklch(52% 0.14 290 / 0.08)",
    en_label: "Interpretive",
    id_label: "Interpretatif",
    en_sub: "What does it mean?",
    id_sub: "Apa artinya?",
    en_guide: "Now the group makes meaning from the data and emotion. This is the stage that generates real insight — and where the most significant cross-cultural divergence often appears. People from different cultural backgrounds may draw radically different conclusions from the same set of facts and feelings. The debrief leader's job here is to hold the tension and draw out the multiple interpretations before landing on one.",
    id_guide: "Sekarang kelompok membuat makna dari data dan emosi. Ini adalah tahap yang menghasilkan wawasan nyata — dan di mana perbedaan lintas budaya paling signifikan sering muncul. Orang dari latar belakang budaya yang berbeda mungkin menarik kesimpulan yang sangat berbeda dari kumpulan fakta dan perasaan yang sama.",
    en_questions: [
      "Why do you think this happened the way it did?",
    ],
    id_questions: [
      "Mengapa menurut Anda ini terjadi seperti yang terjadi?",
    ],
    
    en_placeholder: "What does this experience reveal? What assumptions or patterns are you seeing?",
    id_placeholder: "Apa yang pengalaman ini ungkapkan? Asumsi atau pola apa yang Anda lihat?",
    en_cross: "This stage is where monocultural teams often converge too quickly — the dominant cultural voice provides an interpretation and everyone quietly agrees. In cross-cultural teams, slow this stage down deliberately. Ask: does anyone see it differently? That question alone can unlock the most valuable insight.",
    id_cross: "Tahap ini adalah di mana tim monobudaya sering berkonvergensi terlalu cepat — suara budaya dominan memberikan interpretasi dan semua orang diam-diam setuju. Dalam tim lintas budaya, perlambat tahap ini dengan sengaja.",
  },
  {
    key: "D",
    letter: "D",
    color: "oklch(45% 0.12 150)",
    colorBg: "oklch(45% 0.12 150 / 0.08)",
    en_label: "Decisional",
    id_label: "Keputusan",
    en_sub: "What will we do differently?",
    id_sub: "Apa yang akan kita lakukan berbeda?",
    en_guide: "The debrief earns its place here — when it produces decisions, not just reflections. Good debriefs always end with a concrete next step. Not a long list of lessons that no one will read again. One or two specific commitments that someone owns.",
    id_guide: "Debrief mendapatkan tempatnya di sini — ketika menghasilkan keputusan, bukan hanya refleksi. Debrief yang baik selalu berakhir dengan langkah selanjutnya yang konkret. Bukan daftar panjang pelajaran yang tidak akan dibaca lagi. Satu atau dua komitmen spesifik yang dimiliki seseorang.",
    en_questions: [
      "What is the one thing we will do differently next time?",
    ],
    id_questions: [
      "Apa satu hal yang akan kita lakukan berbeda lain kali?",
    ],
    
    en_placeholder: "What specific changes will you make? Who is responsible and by when?",
    id_placeholder: "Perubahan spesifik apa yang akan Anda buat? Siapa yang bertanggung jawab dan kapan?",
    en_cross: "In cultures with a strong hierarchy, the decisional stage may be uncomfortable — making a change implies criticism of what was done before, and that criticism may feel directed at the leader. Name this explicitly: reflection is not blame. A decision to do something differently is an act of respect for the mission, not a verdict on the past.",
    id_cross: "Dalam budaya dengan hierarki kuat, tahap keputusan mungkin tidak nyaman — membuat perubahan menyiratkan kritik terhadap apa yang dilakukan sebelumnya. Sebutkan ini secara eksplisit: refleksi bukanlah menyalahkan. Keputusan untuk melakukan sesuatu yang berbeda adalah tindakan menghormati misi.",
  },
];

const TOOLKIT_QUESTIONS = {
  O: {
    en: [
      "What did we set out to do?",
    ],
    id: [
      "Apa yang kita rencanakan untuk dilakukan?",
    ],
  },
  R: {
    en: [
      "What was the energy like in the team during this?",
    ],
    id: [
      "Bagaimana energi tim selama ini?",
    ],
  },
  I: {
    en: [
      "Why do you think it went the way it did?",
    ],
    id: [
      "Mengapa menurut Anda hal itu berjalan seperti itu?",
    ],
  },
  D: {
    en: [
      "What is the one thing we will do differently next time?",
    ],
    id: [
      "Apa satu hal yang akan kita lakukan berbeda lain kali?",
    ],
  },
};

const FACILITATION_TIPS = [
  {
    en_tip: "Start with O, not I.",
    en_body: "Inexperienced debrief leaders jump to interpretation immediately. Ground the conversation in shared facts first — even 5 minutes on the Objective stage changes the quality of everything that follows.",
    id_tip: "Mulai dengan O, bukan I.",
    id_body: "Pemimpin debrief yang tidak berpengalaman langsung melompat ke interpretasi. Dasarkan percakapan pada fakta bersama terlebih dahulu.",
  },
  {
    en_tip: "Name the level you're at.",
    en_body: "Say out loud: \"We're going to spend a few minutes just on what happened — no analysis yet.\" This gives permission to slow down and prevents the most vocal person from pulling everyone into interpretation before the facts are shared.",
    id_tip: "Sebutkan level di mana Anda berada.",
    id_body: "Katakan dengan lantang: \"Kita akan menghabiskan beberapa menit hanya pada apa yang terjadi — belum ada analisis.\" Ini memberi izin untuk memperlambat.",
  },
  {
    en_tip: "Silence is data.",
    en_body: "In cross-cultural settings, silence after a question is often processing, not reluctance. Wait longer than you're comfortable with. Count to 10 before rephrasing the question. The best insights often come from people who needed more space to speak.",
    id_tip: "Diam adalah data.",
    id_body: "Dalam lingkungan lintas budaya, keheningan setelah pertanyaan sering kali merupakan pemrosesan, bukan keengganan. Tunggu lebih lama dari yang Anda rasa nyaman.",
  },
  {
    en_tip: "End with one owner.",
    en_body: "A debrief that produces a list of 8 action items and assigns them to 'the team' will change nothing. End every debrief with one or two concrete actions, each with a named owner and a date. Everything else is insight — which has value, but it's not change.",
    id_tip: "Akhiri dengan satu pemilik.",
    id_body: "Debrief yang menghasilkan daftar 8 item tindakan dan menugaskannya kepada 'tim' tidak akan mengubah apapun. Akhiri setiap debrief dengan satu atau dua tindakan konkret, masing-masing dengan pemilik yang disebutkan namanya dan tanggal.",
  },
];

type ORIDKey = "O" | "R" | "I" | "D";

type Props = { userPathway: string | null; isSaved: boolean };

export default function DebriefingReflectionClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  const [activeStage, setActiveStage] = useState<ORIDKey>("O");
  const [answers, setAnswers] = useState<Record<ORIDKey, string>>({ O: "", R: "", I: "", D: "" });
  const [showToolkit, setShowToolkit] = useState(false);
  const t = (en: string, id: string) => tFn(en, id, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("debriefing-reflection");
      setSaved(true);
    });
  }

  const navy = "oklch(22% 0.10 260)";
  const orange = "oklch(65% 0.15 45)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const bodyText = "oklch(38% 0.05 260)";
  const serif = "var(--font-cormorant, Cormorant Garamond, Georgia, serif)";

  const currentStageIndex = ORID_STAGES.findIndex((s) => s.key === activeStage);
  const currentStage = ORID_STAGES[currentStageIndex];
  const canGoBack = currentStageIndex > 0;
  const canGoForward = currentStageIndex < ORID_STAGES.length - 1;

  const allComplete = ORID_STAGES.every((s) => answers[s.key as ORIDKey].trim().length > 0);

  const verseData = activeVerse ? VERSES[activeVerse as keyof typeof VERSES] : null;

  function VerseRef({ id, children }: { id: string; children: React.ReactNode }) {
    return (
      <button
        onClick={() => setActiveVerse(id)}
        style={{ background: "none", border: "none", cursor: "pointer", color: orange, fontWeight: 700, fontFamily: "Montserrat, sans-serif", fontSize: "inherit", padding: 0, textDecoration: "underline dotted", textUnderlineOffset: 3 }}
      >
        {children}
      </button>
    );
  }

  const toolkitKeys: ORIDKey[] = ["O", "R", "I", "D"];
  const toolkitColors = {
    O: "oklch(65% 0.15 45)",
    R: "oklch(58% 0.14 200)",
    I: "oklch(52% 0.14 290)",
    D: "oklch(45% 0.12 150)",
  };
  const toolkitLabels = {
    O: { en: "Objective — What happened?", id: "Objektif — Apa yang terjadi?" },
    R: { en: "Reflective — How did it feel?", id: "Reflektif — Bagaimana rasanya?" },
    I: { en: "Interpretive — What does it mean?", id: "Interpretatif — Apa artinya?" },
    D: { en: "Decisional — What will we do?", id: "Keputusan — Apa yang akan kita lakukan?" },
  };

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>
      <LangToggle />

      {/* Language bar */}

      {/* Hero */}
      <div style={{ background: navy, padding: "88px 24px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {t("Team & Facilitation — Guide", "Tim & Fasilitasi — Panduan", "Team & Facilitatie — Gids")}
          </p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, color: offWhite, margin: "0 0 24px", lineHeight: 1.08 }}>
            {t("Debriefing & Reflection", "Debriefing & Refleksi", "Debriefing & Reflectie")}
          </h1>
          <p style={{ fontFamily: serif, fontSize: "clamp(16px, 2vw, 19px)", color: "oklch(82% 0.025 80)", lineHeight: 1.65, maxWidth: 580, margin: "0 0 40px" }}>
            {t(
              "Leaders who don't debrief don't learn — they repeat. This module walks you through a real debrief of your own experience, then hands you the tool to run it with your team.",
            )}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={handleSave} disabled={saved || isPending} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: saved ? "oklch(35% 0.08 260)" : "transparent", color: "oklch(75% 0.04 260)", padding: "14px 28px", borderRadius: 12, fontWeight: 600, fontSize: 14, border: "1px solid oklch(42% 0.08 260)", cursor: saved ? "default" : "pointer" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
              {saved ? t("Saved to Dashboard", "Tersimpan di Dashboard", "Opgeslagen in Dashboard") : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
            </button>
          </div>
        </div>
      </div>

      {/* Why Debrief */}
      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: navy, marginBottom: 24 }}>
          {t("Why Most Teams Don't Learn", "Mengapa Sebagian Besar Tim Tidak Belajar", "Waarom de Meeste Teams Niet Leren")}
        </h2>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, marginBottom: 20 }}>
          {t(
            "Most leaders move from one experience to the next without ever processing what just happened. There isn't time. The next crisis is already on the horizon. The project is finished — what matters now is the next one.",
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, marginBottom: 20 }}>
          {t(
            "The result is that the experience becomes a data point, not a lesson. The team gains competence in doing the thing — but not in understanding why it worked or failed. Next time, they will do approximately the same thing again.",
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, marginBottom: 32 }}>
          {t(
            "The ORID method is one of the most effective structured debrief frameworks available. It moves a group through four levels of reflection in a sequence that builds meaning rather than generating noise: Objective ? Reflective ? Interpretive ? Decisional.",
          )}
        </p>

        {/* ORID overview strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, marginBottom: 12 }}>
          {ORID_STAGES.map((s) => (
            <div key={s.key} style={{ background: s.colorBg, padding: "16px 14px", textAlign: "center" }}>
              <div style={{ fontFamily: serif, fontSize: 36, fontWeight: 700, color: s.color, lineHeight: 1, marginBottom: 6 }}>{s.letter}</div>
              <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: navy, letterSpacing: "0.05em" }}>
                {lang === "en" ? s.en_label : s.id_label}
              </div>
              <div style={{ fontSize: 11, color: bodyText, marginTop: 4 }}>
                {lang === "en" ? s.en_sub : s.id_sub}
              </div>
            </div>
          ))}
        </div>

        {/* Faith anchor inline */}
        <div style={{ background: lightGray, padding: "24px 28px", marginTop: 32 }}>
          <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.75, margin: 0 }}>
            {t(
              "Structured reflection has deep roots in Scripture. ",
            )}
            <VerseRef id="prov-4-7">{t("Proverbs 4:7", "Amsal 4:7", "Spreuken 4:7")}</VerseRef>
            {t(
              " calls us to pursue both wisdom and insight — not just experience. And ",
            )}
            <VerseRef id="james-1-19">{t("James 1:19", "Yakobus 1:19", "Jakobus 1:19")}</VerseRef>
            {t(
              " is not just personal counsel — it is a description of good debrief leadership: quick to listen, slow to speak, slow to draw conclusions.",
            )}
          </p>
        </div>
      </div>

      {/* Live ORID section heading */}
      <div style={{ background: navy, padding: "48px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: offWhite, marginBottom: 12 }}>
            {t("Do Your Own Debrief Now", "Lakukan Debrief Anda Sendiri Sekarang", "Doe Nu Je Eigen Debrief")}
          </h2>
          <p style={{ fontSize: 15, color: "oklch(76% 0.03 80)", lineHeight: 1.75, maxWidth: 580 }}>
            {t(
              "Think of a recent experience — a project, meeting, event, or conversation that didn't go quite as expected. Work through all four ORID stages. Your responses stay in your browser only.",
            )}
          </p>
        </div>
      </div>

      {/* ORID Stage Navigator */}
      <div style={{ padding: "0 24px", maxWidth: 760, margin: "0 auto" }}>

        {/* Stage tab row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, marginTop: 0 }}>
          {ORID_STAGES.map((s, i) => {
            const isActive = s.key === activeStage;
            const isDone = answers[s.key as ORIDKey].trim().length > 0;
            return (
              <button
                key={s.key}
                onClick={() => setActiveStage(s.key as ORIDKey)}
                style={{
                  padding: "16px 12px", border: "none", cursor: "pointer", textAlign: "center",
                  background: isActive ? s.color : isDone ? s.colorBg : lightGray,
                  borderBottom: isActive ? "none" : `2px solid oklch(88% 0.01 80)`,
                  transition: "background 0.15s",
                }}
              >
                <div style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: isActive ? offWhite : s.color, lineHeight: 1, marginBottom: 4 }}>{s.letter}</div>
                <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, color: isActive ? "oklch(90% 0.03 80)" : navy, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {lang === "en" ? s.en_label : s.id_label}
                </div>
                {isDone && !isActive && (
                  <div style={{ fontSize: 10, color: s.color, marginTop: 3, fontWeight: 700 }}>?</div>
                )}
              </button>
            );
          })}
        </div>

        {/* Active stage content */}
        <div style={{ background: offWhite, border: `1px solid oklch(88% 0.01 80)`, borderTop: `3px solid ${currentStage.color}`, padding: "36px 32px 32px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 24 }}>
            <div style={{ fontFamily: serif, fontSize: 56, fontWeight: 700, color: currentStage.color, lineHeight: 1, flexShrink: 0, marginTop: -6 }}>
              {currentStage.letter}
            </div>
            <div>
              <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 20, fontWeight: 800, color: navy, marginBottom: 4 }}>
                {lang === "en" ? currentStage.en_label : currentStage.id_label}
                <span style={{ fontSize: 14, fontWeight: 400, color: bodyText, marginLeft: 12 }}>
                  — {lang === "en" ? currentStage.en_sub : currentStage.id_sub}
                </span>
              </h3>
              <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.7, margin: 0 }}>
                {lang === "en" ? currentStage.en_guide : currentStage.id_guide}
              </p>
            </div>
          </div>

          {/* Questions */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: currentStage.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
              {t("Prompting questions", "Pertanyaan pemandu", "Leidende vragen")}
            </p>
            <ul style={{ margin: 0, padding: "0 0 0 20px", display: "flex", flexDirection: "column", gap: 6 }}>
              {(lang === "en" ? currentStage.en_questions : currentStage.id_questions).map((q, i) => (
                <li key={i} style={{ fontSize: 14, color: bodyText, lineHeight: 1.65 }}>{q}</li>
              ))}
            </ul>
          </div>

          {/* Textarea */}
          <textarea
            value={answers[activeStage]}
            onChange={(e) => setAnswers((prev) => ({ ...prev, [activeStage]: e.target.value }))}
            placeholder={lang === "en" ? currentStage.en_placeholder : currentStage.id_placeholder}
            rows={5}
            style={{ width: "100%", padding: "16px 18px", fontFamily: serif, fontSize: 17, color: bodyText, background: lightGray, border: `1px solid oklch(88% 0.01 80)`, borderRadius: 4, resize: "vertical", lineHeight: 1.75, marginBottom: 20, boxSizing: "border-box" }}
          />

          {/* Cross-cultural note */}
          <div style={{ background: currentStage.colorBg, padding: "16px 20px", marginBottom: 24 }}>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: currentStage.color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
              {t("Cross-cultural note", "Catatan lintas budaya", "Interculturele noot")}
            </p>
            <p style={{ fontSize: 13, color: bodyText, lineHeight: 1.7, margin: 0 }}>
              {lang === "en" ? currentStage.en_cross : currentStage.id_cross}
            </p>
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              onClick={() => canGoBack && setActiveStage(ORID_STAGES[currentStageIndex - 1].key as ORIDKey)}
              disabled={!canGoBack}
              style={{ padding: "10px 24px", border: `1px solid ${canGoBack ? navy : "oklch(88% 0.01 80)"}`, background: "transparent", color: canGoBack ? navy : "oklch(80% 0.01 80)", cursor: canGoBack ? "pointer" : "default", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, borderRadius: 4 }}
            >
              ? {t("Back", "Kembali", "Terug")}
            </button>
            <span style={{ fontSize: 12, color: bodyText, fontWeight: 600 }}>
              {currentStageIndex + 1} / {ORID_STAGES.length}
            </span>
            {canGoForward ? (
              <button
                onClick={() => setActiveStage(ORID_STAGES[currentStageIndex + 1].key as ORIDKey)}
                style={{ padding: "10px 24px", border: "none", background: currentStage.color, color: offWhite, cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, borderRadius: 4 }}
              >
                {t("Next Stage", "Tahap Berikutnya", "Volgende Fase")} ?
              </button>
            ) : (
              <button
                onClick={() => setShowToolkit(true)}
                style={{ padding: "10px 24px", border: "none", background: allComplete ? orange : "oklch(88% 0.01 80)", color: allComplete ? offWhite : "oklch(70% 0.01 80)", cursor: allComplete ? "pointer" : "default", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, borderRadius: 4 }}
              >
                {t("See Debrief Toolkit", "Lihat Toolkit Debrief", "Zie Debrief Toolkit")}
              </button>
            )}
          </div>
        </div>

        {/* Shortcut to toolkit if not all done */}
        {!allComplete && (
          <p style={{ fontSize: 13, color: bodyText, textAlign: "center", marginTop: 12 }}>
            <button onClick={() => setShowToolkit(true)} style={{ background: "none", border: "none", cursor: "pointer", color: orange, fontWeight: 700, textDecoration: "underline dotted", fontSize: 13 }}>
              {t("Skip to the Leader's Debrief Toolkit", "Lewati ke Toolkit Debrief Pemimpin", "Ga naar de Debrief Toolkit voor Leiders")}
            </button>
          </p>
        )}
      </div>

      {/* DEBRIEF TOOLKIT */}
      {(showToolkit || allComplete) && (
        <div style={{ background: lightGray, padding: "80px 24px", marginTop: 64 }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>

            {/* Toolkit header */}
            <div style={{ background: navy, padding: "44px 40px", marginBottom: 48 }}>
              <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
                {t("For Leaders", "Untuk Pemimpin", "Voor Leiders")}
              </p>
              <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: offWhite, marginBottom: 16 }}>
                {t("The Leader's Debrief Toolkit", "Toolkit Debrief Pemimpin", "De Debrief Toolkit voor Leiders")}
              </h2>
              <p style={{ fontSize: 15, color: "oklch(76% 0.03 80)", lineHeight: 1.75, maxWidth: 560, margin: 0 }}>
                {t(
                  "Use this toolkit to run structured ORID debriefs with your own team. Recommended for: after any significant project, cross-cultural experience, conflict, or leadership decision. Time required: 45—75 minutes.",
                )}
              </p>
            </div>

            {/* ORID question banks */}
            <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 18, fontWeight: 800, color: navy, marginBottom: 32 }}>
              {t("Question Bank by Stage", "Kumpulan Pertanyaan per Tahap", "Vragenbank per Fase")}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 28, marginBottom: 56 }}>
              {toolkitKeys.map((key) => (
                <div key={key} style={{ background: offWhite, padding: "28px 32px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                    <div style={{ fontFamily: serif, fontSize: 40, fontWeight: 700, color: toolkitColors[key], lineHeight: 1, flexShrink: 0 }}>{key}</div>
                    <div>
                      <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 16, fontWeight: 800, color: navy }}>
                        {lang === "en" ? toolkitLabels[key].en : toolkitLabels[key].id}
                      </div>
                    </div>
                  </div>
                  <ul style={{ margin: 0, padding: "0 0 0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                    {(lang === "en" ? TOOLKIT_QUESTIONS[key].en : TOOLKIT_QUESTIONS[key].id).map((q, i) => (
                      <li key={i} style={{ fontSize: 15, color: bodyText, lineHeight: 1.65 }}>{q}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Facilitation tips */}
            <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 18, fontWeight: 800, color: navy, marginBottom: 32 }}>
              {t("Facilitation Tips", "Tips Fasilitasi", "Facilitatietips")}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, marginBottom: 56 }}>
              {FACILITATION_TIPS.map((tip, i) => (
                <div key={i} style={{ background: offWhite, padding: "24px 28px" }}>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 800, color: navy, marginBottom: 10 }}>
                    {lang === "en" ? tip.en_tip : tip.id_tip}
                  </p>
                  <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.7, margin: 0 }}>
                    {lang === "en" ? tip.en_body : tip.id_body}
                  </p>
                </div>
              ))}
            </div>

            {/* Run sheet */}
            <div style={{ background: offWhite, padding: "36px 40px" }}>
              <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 18, fontWeight: 800, color: navy, marginBottom: 24 }}>
                {t("Sample Run Sheet (60 minutes)", "Contoh Jadwal (60 menit)", "Voorbeeld Tijdschema (60 minuten)")}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  { time: "0—5", en: "Frame the debrief: name the experience being debriefed, set the purpose, and remind the team that reflection is not blame.", id: "Bingkai debrief: sebutkan pengalaman yang akan di-debrief, tetapkan tujuan, dan ingatkan tim bahwa refleksi bukanlah menyalahkan." },
                  { time: "5—15", en: "O — Objective: What happened? Establish the shared facts.", id: "O — Objektif: Apa yang terjadi? Tetapkan fakta bersama." },
                  { time: "15—25", en: "R — Reflective: How did it feel? Surface the emotional data.", id: "R — Reflektif: Bagaimana rasanya? Ungkapkan data emosional." },
                  { time: "25—45", en: "I — Interpretive: What does it mean? This is the longest stage — hold space for multiple perspectives.", id: "I — Interpretatif: Apa artinya? Ini adalah tahap terpanjang — berikan ruang untuk berbagai perspektif." },
                  { time: "45—55", en: "D — Decisional: What will we do? Land on 1—2 concrete actions with named owners.", id: "D — Keputusan: Apa yang akan kita lakukan? Landas pada 1—2 tindakan konkret dengan pemilik yang disebutkan." },
                  { time: "55—60", en: "Close: Brief gratitude round. What was useful about this conversation?", id: "Penutup: Putaran syukur singkat. Apa yang berguna dari percakapan ini?" },
                ].map((row, i) => (
                  <div key={i} style={{ display: "flex", gap: 20, padding: "12px 0", borderBottom: i < 5 ? "1px solid oklch(92% 0.008 80)" : "none", alignItems: "flex-start" }}>
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, minWidth: 52, flexShrink: 0, paddingTop: 2 }}>
                      {row.time} {t("min", "mnt", "min")}
                    </div>
                    <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.65, margin: 0 }}>
                      {lang === "en" ? row.en : row.id}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ background: navy, padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: offWhite, marginBottom: 16 }}>
          {t("Keep Growing", "Terus Bertumbuh", "Blijf Groeien")}
        </h2>
        <p style={{ fontSize: 16, color: "oklch(76% 0.03 80)", lineHeight: 1.75, maxWidth: 520, margin: "0 auto 40px" }}>
          {t("Explore more training modules to deepen your cross-cultural leadership.", "Jelajahi lebih banyak modul pelatihan untuk memperdalam kepemimpinan lintas budaya Anda.", "Verken meer bronnen om je intercultureel leiderschap te verdiepen.")}
        </p>
        <Link href="/resources" style={{ display: "inline-block", padding: "14px 36px", background: orange, color: offWhite, fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, textDecoration: "none", borderRadius: 4 }}>
          {t("Training", "Pelatihan", "Contentbibliotheek")}
        </Link>
      </div>

      {/* Verse Popup */}
      {activeVerse && verseData && (
        <div onClick={() => setActiveVerse(null)} style={{ position: "fixed", inset: 0, background: "oklch(10% 0.05 260 / 0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: offWhite, borderRadius: 12, padding: "44px 40px", maxWidth: 540, width: "100%" }}>
            <p style={{ fontFamily: serif, fontSize: 22, lineHeight: 1.7, color: navy, fontStyle: "italic", marginBottom: 20 }}>
              "{lang === "en" ? verseData.en : verseData.id}"
            </p>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em", marginBottom: 28 }}>
              — {lang === "en" ? verseData.en_ref : verseData.id_ref}{" "}
              {lang === "en" ? "(NIV)" : "(TB)"}
            </p>
            <button onClick={() => setActiveVerse(null)} style={{ padding: "10px 24px", background: navy, color: offWhite, border: "none", borderRadius: 12, fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              {t("Close", "Tutup", "Sluiten")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
