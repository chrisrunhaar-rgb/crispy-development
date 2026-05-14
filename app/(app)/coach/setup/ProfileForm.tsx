"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Props = {
  userId: string;
  isFirstTime: boolean;
  existing: {
    name?: string | null;
    organisation?: string | null;
    location?: string | null;
    host_culture?: string | null;
    months_in_context?: number | null;
    role?: string | null;
    preferred_language?: string | null;
    notes?: string | null;
    selected_coach?: string | null;
  } | null;
};

const COACHES = [
  {
    name: "Tara",
    image: "/images/coaches/tara-portrait.jpg",
    voice: "Female",
    description: "Warm, intuitive, draws you out gently.",
  },
  {
    name: "Ethan",
    image: "/images/coaches/ethan-portrait.jpg",
    voice: "Male",
    description: "Calm, grounded, holds space with steadiness.",
  },
];

export default function ProfileForm({ userId, isFirstTime, existing }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    name: existing?.name ?? "",
    organisation: existing?.organisation ?? "",
    location: existing?.location ?? "",
    host_culture: existing?.host_culture ?? "",
    months_in_context: existing?.months_in_context?.toString() ?? "",
    role: existing?.role ?? "",
    preferred_language: existing?.preferred_language ?? "en",
    notes: existing?.notes ?? "",
    selected_coach: existing?.selected_coach ?? "Tara",
  });

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isFirstTime && !agreed) return;
    setSaving(true);

    await fetch("/api/coach/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        name: form.name || null,
        organisation: form.organisation || null,
        location: form.location || null,
        host_culture: form.host_culture || null,
        months_in_context: form.months_in_context ? parseInt(form.months_in_context) : null,
        role: form.role || null,
        preferred_language: form.preferred_language || "en",
        notes: form.notes || null,
        selected_coach: form.selected_coach,
        onboarding_complete: true,
        updated_at: new Date().toISOString(),
      }),
    });

    setSaving(false);
    router.push(isFirstTime ? "/coach/session" : "/coach");
  }

  return (
    <form onSubmit={handleSubmit}>

      {isFirstTime && (
        <div style={{ marginBottom: "3rem" }}>
          <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.75rem", fontStyle: "italic", color: "oklch(28% 0.008 260)", lineHeight: 1.3, marginBottom: "1rem" }}>
            Welcome to WayPoint.
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(48% 0.008 260)", lineHeight: 1.8 }}>
            Before your first session, take a few minutes to introduce yourself to your coach. This context stays private to you and helps your coach know your world before you even start speaking.
          </p>
        </div>
      )}

      {/* Section: About you */}
      <SectionHeading>About you</SectionHeading>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2.5rem" }}>
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
          <Field label="Host culture" hint="Culture you work within">
            <input style={inputStyle} value={form.host_culture} onChange={set("host_culture")} placeholder="e.g. Swahili East African" />
          </Field>
        </div>

        <Field label="Months in this cross-cultural context" hint="Roughly — even an estimate helps">
          <input style={inputStyle} type="number" min={0} max={600} value={form.months_in_context} onChange={set("months_in_context")} placeholder="e.g. 18" />
        </Field>

        <Field label="Preferred language" hint="Language for coaching sessions">
          <select style={inputStyle} value={form.preferred_language} onChange={set("preferred_language")}>
            <option value="en">English</option>
            <option value="nl">Dutch</option>
            <option value="de">German</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="id">Indonesian</option>
          </select>
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

      {/* Section: Choose your coach */}
      <SectionHeading>Choose your coach</SectionHeading>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.775rem", color: "oklch(55% 0.008 260)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
        Both coaches use the same coaching approach and framework. The only difference is the voice.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2.5rem" }}>
        {COACHES.map(coach => {
          const selected = form.selected_coach === coach.name;
          return (
            <button
              key={coach.name}
              type="button"
              onClick={() => setForm(f => ({ ...f, selected_coach: coach.name }))}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "1.5rem 1rem",
                border: `2px solid ${selected ? "oklch(45% 0.12 260)" : "oklch(82% 0.008 80)"}`,
                background: selected ? "oklch(97% 0.008 260)" : "white",
                cursor: "pointer",
                transition: "all 0.2s",
                textAlign: "center",
              }}
            >
              <div style={{
                width: "140px", height: "140px", borderRadius: "50%",
                overflow: "hidden", marginBottom: "1rem",
                border: `3px solid ${selected ? "oklch(45% 0.12 260)" : "oklch(88% 0.008 80)"}`,
                flexShrink: 0,
              }}>
                <Image
                  src={coach.image}
                  alt={coach.name}
                  width={140}
                  height={140}
                  style={{ objectFit: "cover", objectPosition: "center top", width: "100%", height: "100%" }}
                />
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

      {/* Confidentiality (first time only) */}
      {isFirstTime && (
        <div style={{ background: "oklch(97% 0.005 260)", border: "1px solid oklch(88% 0.008 80)", padding: "1.5rem", marginBottom: "2rem" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(45% 0.008 260)", marginBottom: "0.75rem" }}>
            Confidentiality
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(42% 0.008 260)", lineHeight: 1.7, marginBottom: "1rem" }}>
            Your coaching sessions and transcripts are private to you. If a leader is assigned to you, they can only see the whiteboard themes you choose to share — never the full conversation. You are always in control of what is visible.
          </p>
          <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              style={{ marginTop: "2px", accentColor: "oklch(45% 0.12 260)", width: "16px", height: "16px", flexShrink: 0 }}
              required
            />
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(35% 0.008 260)", lineHeight: 1.6 }}>
              I understand that my sessions are confidential and I agree to use WayPoint as a coaching tool, not a substitute for professional mental health support.
            </span>
          </label>
        </div>
      )}

      <button
        type="submit"
        disabled={saving || (isFirstTime && !agreed)}
        style={{
          width: "100%",
          background: saving || (isFirstTime && !agreed) ? "oklch(70% 0.05 260)" : "oklch(30% 0.12 260)",
          color: "white",
          fontFamily: "var(--font-montserrat)",
          fontWeight: 700,
          fontSize: "0.875rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          padding: "1.125rem",
          border: "none",
          cursor: saving || (isFirstTime && !agreed) ? "not-allowed" : "pointer",
          transition: "background 0.2s",
        }}
      >
        {saving
          ? "Saving…"
          : isFirstTime
          ? `Start your first session with ${form.selected_coach}`
          : "Save changes"}
      </button>
    </form>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem",
      letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(45% 0.12 260)",
      marginBottom: "1.25rem", paddingBottom: "0.5rem",
      borderBottom: "1px solid oklch(88% 0.008 80)",
    }}>
      {children}
    </p>
  );
}

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
