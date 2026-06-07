"use client";

import { useState } from "react";
import Link from "next/link";
import ProfileForm from "./ProfileForm";

type Lang = "en" | "id";

type Props = {
  userId: string;
  isFirstTime: boolean;
  lang: Lang;
  existing: {
    name?: string | null;
    organisation?: string | null;
    location?: string | null;
    home_culture?: string | null;
    host_culture?: string | null;
    months_in_context?: number | null;
    role?: string | null;
    notes?: string | null;
    selected_coach?: string | null;
  } | null;
  showIntroFirst: boolean;
};

type FormData = {
  name: string;
  role: string;
  organisation: string;
  location: string;
  home_culture: string;
  host_culture: string;
  months_in_context: string;
  notes: string;
  selected_coach: string;
  family_situation: string;
};

const strings = {
  en: {
    step1Title: "Welcome to WayPoint.",
    step1Subtitle: "What you need to know before your first session.",
    whatIsLabel: "What is WayPoint?",
    whatIsBody: "WayPoint is a private coaching space — available whenever you need it. Your coach is an AI companion trained in professional coaching methods for people navigating cross-cultural life and work. It’s not a chatbot. It listens, asks good questions, and helps you find your own clarity. For Christian workers, it understands the place of spirituality and the influence of the Holy Spirit in your context.",
    sessionLabel: "What happens in a session?",
    sessionBody: "Sessions are voice-based — you speak, your coach responds. As you talk, notes build automatically: your focus, insights, values, and action steps. After each session, your notes are saved to your dashboard and your coach remembers them for next time.",
    notLabel: "What WayPoint is not",
    notBody: "WayPoint is not therapy, counselling, or a substitute for a pastor, friend, or mental health professional. If you are in crisis, please reach out to a real person you trust.",
    nextPrivacy: "Next: Privacy & Terms",
    step2Title: "Privacy & Confidentiality",
    step2Subtitle: "How your data and voice are handled.",
    voiceLabel: "Your voice is processed by Google",
    voiceBody: "During a session, your voice is streamed live to Google’s Gemini AI — this is how your coach hears and understands you in real time. Google processes the audio on their servers; we do not store your raw voice recordings. What we do store are the notes and transcript generated from your session, which remain private to you. Because Google’s infrastructure powers the voice feature, their terms of use apply alongside ours.",
    transcriptLabel: "Your transcripts are private to you",
    transcriptBody: "Everything you say in a session is private to you. Your transcripts and notes are never shared with your organisation or anyone else. You are always in control.",
    noReadLabel: "We do not read your sessions",
    noReadBody: "Crispy Development stores your notes and account data to make the product work. We do not access, review, or analyse your individual session content.",
    termsLink: "Full terms of use →",
    privacyLink: "Confidentiality policy →",
    consentText: "I understand that WayPoint is a coaching tool, not a mental health service. I consent to my voice being processed by Google’s Gemini AI. I agree to the",
    consentTerms: "terms of use",
    consentAnd: "and",
    consentPrivacy: "confidentiality policy",
    consentEnd: ".",
    nextAbout: "Next: About You",
    step3Title: "About you",
    step3Subtitle: "Your coach reads this before your first session. Helps them know your world before you start speaking.",
    fieldName: "Your name",
    fieldNameHint: "What your coach will call you",
    fieldRole: "Your role",
    fieldRoleHint: "What you do — in your own words",
    fieldOrg: "Agency",
    fieldOrgHint: "",
    fieldLocation: "Current location",
    fieldLocationHint: "Country or city",
    fieldHomeCulture: "Home culture",
    fieldHomeCultureHint: "Your own cultural background",
    fieldHostCulture: "Host culture",
    fieldHostCultureHint: "The culture you currently work within",
    fieldMonths: "Months in context",
    fieldMonthsHint: "Roughly — even an estimate helps",
    fieldFamily: "Family situation",
    fieldFamilyHint: "Married, single, kids",
    fieldSeason: "Current season",
    fieldSeasonHint: "Specific challenges, what you hope to get from coaching",
    saving: "Saving…",
    completeSetup: "Complete Setup",
    step4Subtitle: "Your coach is ready. Your first session is waiting.",
    step4Quote: "“Your coach is ready for you.”",
    step4Body: "Speak naturally. Your notes will build as you go. Everything stays private to you.",
    goToWaypoint: "Go to WayPoint →",
    back: "← Back",
    youreAllSet: "You’re all set,",
  },
  id: {
    step1Title: "Selamat datang di WayPoint.",
    step1Subtitle: "Yang perlu kamu ketahui sebelum sesi pertamamu.",
    whatIsLabel: "Apa itu WayPoint?",
    whatIsBody: "WayPoint adalah ruang coaching pribadi yang bisa kamu akses kapan saja. Coachmu adalah AI yang dilatih dengan metode coaching profesional untuk orang-orang yang menjalani kehidupan dan pekerjaan lintas budaya. Ini bukan sekadar chatbot. WayPoint mendengarkan, mengajukan pertanyaan yang tepat, dan membantumu menemukan kejelasan sendiri. Bagi pekerja Kristen, WayPoint memahami peran spiritualitas dan pengaruh Roh Kudus dalam konteksmu.",
    sessionLabel: "Apa yang terjadi dalam satu sesi?",
    sessionBody: "Sesi berlangsung melalui suara, kamu berbicara dan coachmu merespons. Saat kamu berbicara, catatan akan terbentuk secara otomatis: fokusmu, wawasan, nilai, dan langkah tindakan. Setelah setiap sesi, catatanmu tersimpan di dashboard dan coachmu akan mengingatnya untuk sesi berikutnya.",
    notLabel: "Apa yang WayPoint bukan",
    notBody: "WayPoint bukan terapi, konseling, atau pengganti gembala, sahabat, atau tenaga profesional kesehatan mental. Jika kamu sedang dalam krisis, tolong hubungi seseorang yang kamu percaya.",
    nextPrivacy: "Lanjut: Privasi & Ketentuan",
    step2Title: "Privasi & Kerahasiaan",
    step2Subtitle: "Bagaimana data dan suaramu dikelola.",
    voiceLabel: "Suaramu diproses oleh Google",
    voiceBody: "Selama sesi berlangsung, suaramu dikirim secara langsung ke Gemini AI milik Google, itulah cara coachmu mendengar dan memahami kamu secara real time. Google memproses audio di server mereka; kami tidak menyimpan rekaman suara mentahmu. Yang kami simpan adalah catatan dan transkrip yang dihasilkan dari sesimu, dan itu tetap bersifat pribadi untukmu. Karena infrastruktur Google mendukung fitur suara ini, ketentuan penggunaan mereka berlaku bersama dengan ketentuan kami.",
    transcriptLabel: "Transkrip kamu bersifat pribadi",
    transcriptBody: "Semua yang kamu katakan dalam sesi bersifat pribadi untukmu. Transkrip dan catatanmu tidak pernah dibagikan ke organisasimu atau siapa pun. Kamu selalu memegang kendali.",
    noReadLabel: "Kami tidak membaca sesimu",
    noReadBody: "Crispy Development menyimpan catatan dan data akun untuk menjalankan layanan ini. Kami tidak mengakses, meninjau, atau menganalisis konten sesi pribadimu.",
    termsLink: "Ketentuan penggunaan lengkap →",
    privacyLink: "Kebijakan kerahasiaan →",
    consentText: "Saya memahami bahwa WayPoint adalah alat coaching, bukan layanan kesehatan mental. Saya setuju bahwa suara saya diproses oleh Gemini AI milik Google. Saya menyetujui",
    consentTerms: "ketentuan penggunaan",
    consentAnd: "dan",
    consentPrivacy: "kebijakan kerahasiaan",
    consentEnd: ".",
    nextAbout: "Lanjut: Tentang Kamu",
    step3Title: "Tentang kamu",
    step3Subtitle: "Coachmu akan membaca ini sebelum sesi pertama. Agar mereka mengenal duniamu sebelum kamu mulai berbicara.",
    fieldName: "Namamu",
    fieldNameHint: "Nama yang akan digunakan coachmu",
    fieldRole: "Peranmu",
    fieldRoleHint: "Apa yang kamu lakukan, dengan kata-katamu sendiri",
    fieldOrg: "Organisasi",
    fieldOrgHint: "",
    fieldLocation: "Lokasi saat ini",
    fieldLocationHint: "Negara atau kota",
    fieldHomeCulture: "Budaya asal",
    fieldHomeCultureHint: "Latar budaya asalmu",
    fieldHostCulture: "Budaya setempat",
    fieldHostCultureHint: "Budaya tempat kamu bekerja saat ini",
    fieldMonths: "Bulan di konteks ini",
    fieldMonthsHint: "Perkiraan saja, tidak perlu tepat",
    fieldFamily: "Situasi keluarga",
    fieldFamilyHint: "Menikah, lajang, punya anak",
    fieldSeason: "Musim ini",
    fieldSeasonHint: "Tantangan yang kamu hadapi, apa yang ingin kamu dapatkan dari coaching",
    saving: "Menyimpan…",
    completeSetup: "Selesaikan Pengaturan",
    step4Subtitle: "Coachmu siap. Sesi pertamamu sudah menunggu.",
    step4Quote: "“Coachmu siap untukmu.”",
    step4Body: "Bicaralah dengan natural. Catatanmu akan terbentuk seiring waktu. Semuanya bersifat pribadi untukmu.",
    goToWaypoint: "Pergi ke WayPoint →",
    back: "← Kembali",
    youreAllSet: "Kamu siap,",
  },
};

export default function SetupFlow({ userId, isFirstTime, lang, existing, showIntroFirst }: Props) {
  const s = strings[lang];
  const [step, setStep] = useState(showIntroFirst ? 1 : 0);
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: existing?.name ?? "",
    role: existing?.role ?? "",
    organisation: existing?.organisation ?? "",
    location: existing?.location ?? "",
    home_culture: existing?.home_culture ?? "",
    host_culture: existing?.host_culture ?? "",
    months_in_context: existing?.months_in_context?.toString() ?? "",
    notes: existing?.notes ?? "",
    selected_coach: existing?.selected_coach ?? "Tara",
    family_situation: "",
  });

  const set = (k: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  async function saveProfile() {
    setSaving(true);
    await fetch("/api/coach/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        name: form.name || null,
        organisation: form.organisation || null,
        location: form.location || null,
        home_culture: form.home_culture || null,
        host_culture: form.host_culture || null,
        months_in_context: form.months_in_context ? parseInt(form.months_in_context) : null,
        role: form.role || null,
        notes: form.notes || null,
        family_situation: form.family_situation || null,
        selected_coach: form.selected_coach,
        onboarding_complete: true,
        ...(showIntroFirst ? { terms_accepted_at: new Date().toISOString() } : {}),
        updated_at: new Date().toISOString(),
      }),
    });
    setSaving(false);
  }

  // Returning user editing profile — skip the onboarding flow
  if (!showIntroFirst) {
    return <ProfileForm userId={userId} isFirstTime={isFirstTime} existing={existing} />;
  }

  const displayName = form.name || (lang === "id" ? "teman" : "friend");

  // ── Step 1: Welcome ──────────────────────────────────────────────────────
  if (step === 1) {
    return (
      <Shell step={1} title={s.step1Title} subtitle={s.step1Subtitle}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          <InfoCard label={s.whatIsLabel}>
            {s.whatIsBody}
          </InfoCard>

          <InfoCard label={s.sessionLabel}>
            {s.sessionBody}
          </InfoCard>

          <InfoCard label={s.notLabel}>
            {s.notBody}
          </InfoCard>

          <NavRow onNext={() => setStep(2)} nextLabel={s.nextPrivacy} />
        </div>
      </Shell>
    );
  }

  // ── Step 2: Consent ──────────────────────────────────────────────────────
  if (step === 2) {
    return (
      <Shell step={2} title={s.step2Title} subtitle={s.step2Subtitle}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          <InfoCard label={s.voiceLabel}>
            {s.voiceBody}
          </InfoCard>

          <InfoCard label={s.transcriptLabel}>
            {s.transcriptBody}
          </InfoCard>

          <InfoCard label={s.noReadLabel}>
            {s.noReadBody}
          </InfoCard>

          <div style={{ display: "flex", gap: "1rem" }}>
            <Link href="/coach/terms" target="_blank" rel="noopener noreferrer" style={policyLinkStyle}>
              {s.termsLink}
            </Link>
            <Link href="/coach/privacy" target="_blank" rel="noopener noreferrer" style={policyLinkStyle}>
              {s.privacyLink}
            </Link>
          </div>

          {/* Consent checkbox */}
          <div style={{ background: "oklch(96% 0.006 260)", border: "1px solid oklch(88% 0.008 80)", padding: "1.75rem" }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={{ marginTop: "3px", accentColor: "oklch(45% 0.12 260)", width: "16px", height: "16px", flexShrink: 0, cursor: "pointer" }}
              />
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(30% 0.008 260)", lineHeight: 1.7 }}>
                {s.consentText}{" "}
                <Link href="/coach/terms" target="_blank" rel="noopener noreferrer" style={{ color: "oklch(45% 0.12 260)", textDecoration: "underline", textUnderlineOffset: "2px" }}>
                  {s.consentTerms}
                </Link>
                {" "}{s.consentAnd}{" "}
                <Link href="/coach/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "oklch(45% 0.12 260)", textDecoration: "underline", textUnderlineOffset: "2px" }}>
                  {s.consentPrivacy}
                </Link>
                {s.consentEnd}
              </span>
            </label>
          </div>

          <NavRow onBack={() => setStep(1)} backLabel={s.back} onNext={() => setStep(3)} nextLabel={s.nextAbout} nextDisabled={!agreed} />
        </div>
      </Shell>
    );
  }

  // ── Step 3: Profile ──────────────────────────────────────────────────────
  if (step === 3) {
    return (
      <Shell step={3} title={s.step3Title} subtitle={s.step3Subtitle}>
        <form autoComplete="off" onSubmit={e => { e.preventDefault(); setStep(4); }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2rem" }}>

            <Field label={s.fieldName} hint={s.fieldNameHint}>
              <input style={inputStyle} value={form.name} onChange={set("name")} required />
            </Field>

            <Field label={s.fieldRole} hint={s.fieldRoleHint}>
              <input style={inputStyle} value={form.role} onChange={set("role")} />
            </Field>

            <Field label={s.fieldOrg} hint={s.fieldOrgHint}>
              <input style={inputStyle} value={form.organisation} onChange={set("organisation")} />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Field label={s.fieldLocation} hint={s.fieldLocationHint}>
                <input style={inputStyle} value={form.location} onChange={set("location")} />
              </Field>
              <Field label={s.fieldHomeCulture} hint={s.fieldHomeCultureHint}>
                <input style={inputStyle} value={form.home_culture} onChange={set("home_culture")} />
              </Field>
            </div>

            <Field label={s.fieldHostCulture} hint={s.fieldHostCultureHint}>
              <input style={inputStyle} value={form.host_culture} onChange={set("host_culture")} />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Field label={s.fieldMonths} hint={s.fieldMonthsHint}>
                <input style={inputStyle} type="number" min={0} max={600} value={form.months_in_context} onChange={set("months_in_context")} />
              </Field>
              <Field label={s.fieldFamily} hint={s.fieldFamilyHint}>
                <input style={inputStyle} value={form.family_situation} onChange={set("family_situation")} />
              </Field>
            </div>

            <Field label={s.fieldSeason} hint={s.fieldSeasonHint}>
              <textarea
                style={{ ...inputStyle, minHeight: "96px", resize: "vertical" }}
                value={form.notes}
                onChange={set("notes")}
              />
            </Field>
          </div>

          <NavRow onBack={() => setStep(2)} backLabel={s.back} onNext={async () => { await saveProfile(); setStep(4); }} nextLabel={saving ? s.saving : s.completeSetup} nextDisabled={saving} />
        </form>
      </Shell>
    );
  }

  // ── Step 4: Complete ─────────────────────────────────────────────────────
  return (
    <Shell step={4} title={`${s.youreAllSet} ${displayName}.`} subtitle={s.step4Subtitle}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        <div style={{ background: "white", border: "1px solid oklch(88% 0.008 80)", padding: "2.5rem", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: "1.625rem", color: "oklch(28% 0.008 260)", marginBottom: "1rem", lineHeight: 1.4 }}>
            {s.step4Quote}
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(50% 0.008 260)", lineHeight: 1.7 }}>
            {s.step4Body}
          </p>
        </div>

        <a
          href="/coach"
          style={{
            display: "block", textAlign: "center", textDecoration: "none",
            background: "oklch(30% 0.12 260)", color: "white",
            fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem",
            letterSpacing: "0.08em", textTransform: "uppercase",
            padding: "1.25rem",
          }}
        >
          {s.goToWaypoint}
        </a>

      </div>
    </Shell>
  );
}

// ── Shell ────────────────────────────────────────────────────────────────────

function Shell({ step, title, subtitle, children }: { step: number; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "calc(100dvh - 80px)" }}>

      <div style={{ background: "#1B3A6B", paddingBlock: "2rem", borderBottom: "1px solid oklch(14% 0.06 260)" }}>
        <div className="container-wide">

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/waypoint/waypoint-banner-blue.png" alt="WayPoint" style={{ height: "44px", width: "auto" }} />
            <div style={{ display: "flex", gap: "0.375rem", alignItems: "center" }}>
              {[1, 2, 3, 4].map(s => (
                <div key={s} style={{
                  height: "6px",
                  borderRadius: "3px",
                  width: s === step ? "28px" : "8px",
                  background: s < step ? "oklch(60% 0.15 150)" : s === step ? "oklch(65% 0.15 45)" : "rgba(255,255,255,0.18)",
                  transition: "all 0.3s ease",
                }} />
              ))}
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.32)", marginLeft: "0.5rem" }}>
                {step} / 4
              </span>
            </div>
          </div>

          <h1 style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 600, fontSize: "2rem", color: "white", lineHeight: 1.2, marginBottom: "0.375rem" }}>
            {title}
          </h1>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.775rem", color: "oklch(62% 0.008 260)" }}>
            {subtitle}
          </p>

        </div>
      </div>

      <div className="container-wide" style={{ paddingBlock: "3rem" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── NavRow ───────────────────────────────────────────────────────────────────

function NavRow({ onBack, backLabel = "← Back", onNext, nextLabel = "Next", nextDisabled = false, isSubmit = false }: {
  onBack?: () => void;
  backLabel?: string;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  isSubmit?: boolean;
}) {
  return (
    <div style={{ display: "flex", gap: "0.875rem", marginTop: "0.5rem" }}>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          style={{
            fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem",
            letterSpacing: "0.08em", textTransform: "uppercase",
            padding: "1rem 1.5rem",
            border: "1px solid oklch(82% 0.008 80)",
            background: "white", color: "oklch(55% 0.008 260)", cursor: "pointer",
          }}
        >
          {backLabel}
        </button>
      )}
      <button
        type={isSubmit ? "submit" : "button"}
        onClick={!isSubmit ? onNext : undefined}
        disabled={nextDisabled}
        style={{
          flex: 1,
          fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem",
          letterSpacing: "0.08em", textTransform: "uppercase",
          padding: "1rem",
          border: "none",
          background: nextDisabled ? "oklch(75% 0.04 260)" : "oklch(30% 0.12 260)",
          color: "white",
          cursor: nextDisabled ? "not-allowed" : "pointer",
          transition: "background 0.2s",
        }}
      >
        {nextLabel} →
      </button>
    </div>
  );
}

// ── InfoCard ─────────────────────────────────────────────────────────────────

function InfoCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "white", border: "1px solid oklch(88% 0.008 80)", padding: "1.75rem" }}>
      <p style={{
        fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700,
        letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.15 45)",
        marginBottom: "0.875rem",
      }}>
        {label}
      </p>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: "oklch(32% 0.008 260)", lineHeight: 1.75, margin: 0 }}>
        {children}
      </p>
    </div>
  );
}

// ── Field ────────────────────────────────────────────────────────────────────

function Field({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8125rem", color: "oklch(28% 0.008 260)", marginBottom: "0.2rem" }}>
        {label}
      </label>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: "oklch(60% 0.008 260)", marginBottom: "0.4rem" }}>
        {hint}
      </p>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.875rem",
  color: "oklch(22% 0.008 260)",
  background: "white",
  border: "1px solid oklch(82% 0.008 80)",
  padding: "0.75rem 1rem",
  outline: "none",
  boxSizing: "border-box",
};

const policyLinkStyle: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.75rem",
  fontWeight: 600,
  letterSpacing: "0.05em",
  color: "oklch(45% 0.12 260)",
  textDecoration: "underline",
  textUnderlineOffset: "2px",
};
