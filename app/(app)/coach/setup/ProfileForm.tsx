"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    family_situation?: string | null;
    notes?: string | null;
    selected_coach?: string | null;
  } | null;
};

export default function ProfileForm({ userId, isFirstTime, existing }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: existing?.name ?? "",
    organisation: existing?.organisation ?? "",
    location: existing?.location ?? "",
    home_culture: existing?.home_culture ?? "",
    host_culture: existing?.host_culture ?? "",
    months_in_context: existing?.months_in_context?.toString() ?? "",
    role: existing?.role ?? "",
    family_situation: existing?.family_situation ?? "",
    notes: existing?.notes ?? "",
    selected_coach: existing?.selected_coach ?? "Tara",
  });

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
        family_situation: form.family_situation || null,
        notes: form.notes || null,
        selected_coach: form.selected_coach,
        onboarding_complete: true,
        updated_at: new Date().toISOString(),
      }),
    });

    setSaving(false);
    router.push("/coach");
  }

  return (
    <form onSubmit={handleSubmit} autoComplete="off">

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
          <Field label="Home culture" hint="Your own cultural background">
            <input style={inputStyle} value={form.home_culture} onChange={set("home_culture")} placeholder="e.g. Dutch" />
          </Field>
        </div>

        <Field label="Host culture" hint="The culture you currently work within">
          <input style={inputStyle} value={form.host_culture} onChange={set("host_culture")} placeholder="e.g. Swahili East African" />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <Field label="Months in context" hint="Roughly — even an estimate helps">
            <input style={inputStyle} type="number" min={0} max={600} value={form.months_in_context} onChange={set("months_in_context")} />
          </Field>
          <Field label="Family situation" hint="e.g. Married, 2 kids / Single">
            <input style={inputStyle} value={form.family_situation} onChange={set("family_situation")} />
          </Field>
        </div>

        <Field label="Anything else your coach should know?" hint="Current season, specific challenges, what you hope to get from coaching">
          <textarea
            style={{ ...inputStyle, minHeight: "96px", resize: "vertical" }}
            value={form.notes}
            onChange={set("notes")}
            placeholder="e.g. In a difficult transition season, team conflict, hoping to find clarity on next steps..."
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={saving}
        style={{
          width: "100%",
          background: saving ? "oklch(70% 0.05 260)" : "oklch(65% 0.15 45)",
          color: "white",
          fontFamily: "var(--font-montserrat)",
          fontWeight: 700,
          fontSize: "0.875rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          padding: "1.125rem",
          borderRadius: 12,
          border: "none",
          cursor: saving ? "not-allowed" : "pointer",
          transition: "background 0.2s",
        }}
      >
        {saving ? "Saving…" : isFirstTime ? "Start your first session" : "Save changes"}
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
