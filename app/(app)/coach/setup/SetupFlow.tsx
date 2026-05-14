"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProfileForm from "./ProfileForm";

type Props = {
  userId: string;
  isFirstTime: boolean;
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
};

const COACHES = [
  { name: "Tara", image: "/images/coaches/tara-portrait.jpg", voice: "Female", description: "Warm, intuitive, draws you out gently." },
  { name: "Ethan", image: "/images/coaches/ethan-portrait.jpg", voice: "Male", description: "Calm, grounded, holds space with steadiness." },
];

export default function SetupFlow({ userId, isFirstTime, existing, showIntroFirst }: Props) {
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

  const displayName = form.name || "friend";

  // ── Step 1: Welcome ──────────────────────────────────────────────────────
  if (step === 1) {
    return (
      <Shell step={1} title="Welcome to WayPoint." subtitle="What you need to know before your first session.">
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          <InfoCard label="What is WayPoint?">
            WayPoint is a private coaching space — available whenever you need it. Your coach is an AI companion trained in professional coaching methods for people navigating cross-cultural life and work. It&rsquo;s not a chatbot. It listens, asks good questions, and helps you find your own clarity. For Christian workers, it understands the place of spirituality and the influence of the Holy Spirit in your context.
          </InfoCard>

          <InfoCard label="What happens in a session?">
            Sessions are voice-based — you speak, your coach responds. As you talk, notes build automatically: your focus, insights, values, and action steps. After each session, your notes are saved to your dashboard and your coach remembers them for next time.
          </InfoCard>

          <InfoCard label="What WayPoint is not">
            WayPoint is not therapy, counselling, or a substitute for a pastor, friend, or mental health professional. If you are in crisis, please reach out to a real person you trust.
          </InfoCard>

          <NavRow onNext={() => setStep(2)} nextLabel="Next: Privacy & Terms" />
        </div>
      </Shell>
    );
  }

  // ── Step 2: Consent ──────────────────────────────────────────────────────
  if (step === 2) {
    return (
      <Shell step={2} title="Privacy & Confidentiality" subtitle="How your data and voice are handled.">
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          <InfoCard label="Your voice is processed by Google">
            WayPoint uses Google&rsquo;s Gemini Live AI for voice sessions. Your voice is transmitted to and processed by Google&rsquo;s servers in real time. By using WayPoint, Google&rsquo;s terms of use also apply to your use of the AI features. We do not store your raw audio.
          </InfoCard>

          <InfoCard label="Your transcripts are private to you">
            Everything you say in a session is private to you. If a leader is assigned to you, they can only see session notes you choose to share — never the full conversation. You are always in control.
          </InfoCard>

          <InfoCard label="We do not read your sessions">
            Crispy Development stores your notes and account data to make the product work. We do not access, review, or analyse your individual session content.
          </InfoCard>

          <div style={{ display: "flex", gap: "1rem" }}>
            <Link href="/coach/terms" target="_blank" rel="noopener noreferrer" style={policyLinkStyle}>
              Full terms of use →
            </Link>
            <Link href="/coach/privacy" target="_blank" rel="noopener noreferrer" style={policyLinkStyle}>
              Confidentiality policy →
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
                I understand that WayPoint is a coaching tool, not a mental health service. I consent to my voice being processed by Google&rsquo;s Gemini AI. I agree to the{" "}
                <Link href="/coach/terms" target="_blank" rel="noopener noreferrer" style={{ color: "oklch(45% 0.12 260)", textDecoration: "underline", textUnderlineOffset: "2px" }}>
                  terms of use
                </Link>
                {" "}and{" "}
                <Link href="/coach/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "oklch(45% 0.12 260)", textDecoration: "underline", textUnderlineOffset: "2px" }}>
                  confidentiality policy
                </Link>
                .
              </span>
            </label>
          </div>

          <NavRow onBack={() => setStep(1)} onNext={() => setStep(3)} nextLabel="Next: About You" nextDisabled={!agreed} />
        </div>
      </Shell>
    );
  }

  // ── Step 3: Profile ──────────────────────────────────────────────────────
  if (step === 3) {
    return (
      <Shell step={3} title="About you" subtitle="Your coach reads this before your first session. Helps them know your world before you start speaking.">
        <form autoComplete="off" onSubmit={e => { e.preventDefault(); setStep(4); }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2rem" }}>

            <Field label="Your name" hint="What your coach will call you">
              <input style={inputStyle} value={form.name} onChange={set("name")} placeholder="e.g. Sarah" required />
            </Field>

            <Field label="Your role" hint="What you do — in your own words">
              <input style={inputStyle} value={form.role} onChange={set("role")} placeholder="e.g. Church planter, team leader, field worker" required />
            </Field>

            <Field label="Organisation" hint="The mission agency or church you serve with">
              <input style={inputStyle} value={form.organisation} onChange={set("organisation")} placeholder="e.g. World Outreach" />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Field label="Current location" hint="Country or city">
                <input style={inputStyle} value={form.location} onChange={set("location")} placeholder="e.g. Nairobi, Kenya" />
              </Field>
              <Field label="Home culture" hint="Your own cultural background">
                <input style={inputStyle} value={form.home_culture} onChange={set("home_culture")} placeholder="e.g. Dutch" />
              </Field>
            </div>

            <Field label="Host culture" hint="The culture you currently work within">
              <input style={inputStyle} value={form.host_culture} onChange={set("host_culture")} placeholder="e.g. Swahili East African" />
            </Field>

            <Field label="Months in this cross-cultural context" hint="Roughly — even an estimate helps">
              <input style={inputStyle} type="number" min={0} max={600} value={form.months_in_context} onChange={set("months_in_context")} placeholder="e.g. 18" />
            </Field>

            <Field label="Anything else your coach should know?" hint="Current season, specific challenges, what you hope to get from coaching">
              <textarea
                style={{ ...inputStyle, minHeight: "96px", resize: "vertical" }}
                value={form.notes}
                onChange={set("notes")}
                placeholder="e.g. In a difficult transition season, team conflict, hoping to find clarity on next steps..."
              />
            </Field>
          </div>

          <NavRow onBack={() => setStep(2)} nextLabel="Next: Choose Your Coach" isSubmit />
        </form>
      </Shell>
    );
  }

  // ── Step 4: Coach selection ──────────────────────────────────────────────
  if (step === 4) {
    return (
      <Shell step={4} title="Choose your coach" subtitle="Both coaches use the same framework. The only difference is the voice.">
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {COACHES.map(coach => {
              const selected = form.selected_coach === coach.name;
              return (
                <button
                  key={coach.name}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, selected_coach: coach.name }))}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    padding: "1.5rem 1rem",
                    border: `2px solid ${selected ? "oklch(45% 0.12 260)" : "oklch(82% 0.008 80)"}`,
                    background: selected ? "oklch(97% 0.008 260)" : "white",
                    cursor: "pointer", transition: "all 0.2s", textAlign: "center",
                  }}
                >
                  <div style={{
                    width: "140px", height: "140px", borderRadius: "50%",
                    overflow: "hidden", marginBottom: "1rem",
                    border: `3px solid ${selected ? "oklch(45% 0.12 260)" : "oklch(88% 0.008 80)"}`,
                  }}>
                    <Image src={coach.image} alt={coach.name} width={140} height={140}
                      style={{ objectFit: "cover", objectPosition: "center top", width: "100%", height: "100%" }} />
                  </div>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "oklch(22% 0.008 260)", marginBottom: "0.25rem" }}>
                    {coach.name}
                  </p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: selected ? "oklch(45% 0.12 260)" : "oklch(60% 0.008 260)", marginBottom: "0.5rem" }}>
                    {coach.voice} voice
                  </p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(50% 0.008 260)", lineHeight: 1.5 }}>
                    {coach.description}
                  </p>
                  {selected && (
                    <div style={{ marginTop: "0.75rem", width: "20px", height: "20px", borderRadius: "50%", background: "oklch(45% 0.12 260)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <NavRow
            onBack={() => setStep(3)}
            onNext={async () => { await saveProfile(); setStep(5); }}
            nextLabel={saving ? "Saving…" : "Complete Setup"}
            nextDisabled={saving}
          />
        </div>
      </Shell>
    );
  }

  // ── Step 5: Complete ─────────────────────────────────────────────────────
  return (
    <Shell step={5} title={`You're all set, ${displayName}.`} subtitle="Your coach is ready. Your first session is waiting.">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        <div style={{ background: "white", border: "1px solid oklch(88% 0.008 80)", padding: "2.5rem", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: "1.625rem", color: "oklch(28% 0.008 260)", marginBottom: "1rem", lineHeight: 1.4 }}>
            &ldquo;{form.selected_coach} is ready for you.&rdquo;
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(50% 0.008 260)", lineHeight: 1.7 }}>
            Speak naturally. Your notes will build as you go. Everything stays private to you.
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
          Go to WayPoint →
        </a>

      </div>
    </Shell>
  );
}

// ── Shell ────────────────────────────────────────────────────────────────────

function Shell({ step, title, subtitle, children }: { step: number; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "calc(100dvh - 80px)" }}>

      <div style={{ background: "oklch(18% 0.08 260)", paddingBlock: "2rem", borderBottom: "1px solid oklch(14% 0.06 260)" }}>
        <div className="container-wide">

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <span style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: "1.0625rem", color: "oklch(65% 0.15 45)" }}>
              WayPoint
            </span>
            <div style={{ display: "flex", gap: "0.375rem", alignItems: "center" }}>
              {[1, 2, 3, 4, 5].map(s => (
                <div key={s} style={{
                  height: "6px",
                  borderRadius: "3px",
                  width: s === step ? "28px" : "8px",
                  background: s < step ? "oklch(60% 0.15 150)" : s === step ? "oklch(65% 0.15 45)" : "rgba(255,255,255,0.18)",
                  transition: "all 0.3s ease",
                }} />
              ))}
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.32)", marginLeft: "0.5rem" }}>
                {step} / 5
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

function NavRow({ onBack, onNext, nextLabel = "Next", nextDisabled = false, isSubmit = false }: {
  onBack?: () => void;
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
          ← Back
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
