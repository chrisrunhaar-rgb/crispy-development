"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  userId: string;
  existing: {
    name?: string | null;
    organisation?: string | null;
    location?: string | null;
    host_culture?: string | null;
    months_in_context?: number | null;
    role?: string | null;
    preferred_language?: string | null;
    notes?: string | null;
  } | null;
};

export default function ProfileForm({ userId, existing }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: existing?.name ?? "",
    organisation: existing?.organisation ?? "",
    location: existing?.location ?? "",
    host_culture: existing?.host_culture ?? "",
    months_in_context: existing?.months_in_context?.toString() ?? "",
    role: existing?.role ?? "",
    preferred_language: existing?.preferred_language ?? "en",
    notes: existing?.notes ?? "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      user_id: userId,
      name: form.name || null,
      organisation: form.organisation || null,
      location: form.location || null,
      host_culture: form.host_culture || null,
      months_in_context: form.months_in_context ? parseInt(form.months_in_context) : null,
      role: form.role || null,
      preferred_language: form.preferred_language || "en",
      notes: form.notes || null,
      updated_at: new Date().toISOString(),
    };

    await fetch("/api/coach/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => router.push("/coach"), 800);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      <Field label="Your Name" hint="What WayPoint will call you">
        <input style={inputStyle} value={form.name} onChange={set("name")} placeholder="e.g. Sarah" />
      </Field>

      <Field label="Organisation" hint="The mission agency or church you serve with">
        <input style={inputStyle} value={form.organisation} onChange={set("organisation")} placeholder="e.g. World Outreach" />
      </Field>

      <Field label="Current Location" hint="Country or city you're based in">
        <input style={inputStyle} value={form.location} onChange={set("location")} placeholder="e.g. Nairobi, Kenya" />
      </Field>

      <Field label="Host Culture" hint="The culture you're working in (if different from your own)">
        <input style={inputStyle} value={form.host_culture} onChange={set("host_culture")} placeholder="e.g. Swahili East African" />
      </Field>

      <Field label="Months in Cross-Cultural Context" hint="Roughly how long you've been in this role">
        <input style={inputStyle} type="number" min={0} max={600} value={form.months_in_context} onChange={set("months_in_context")} placeholder="e.g. 18" />
      </Field>

      <Field label="Your Role" hint="What you do">
        <input style={inputStyle} value={form.role} onChange={set("role")} placeholder="e.g. Church planter, team leader, field worker" />
      </Field>

      <Field label="Preferred Language" hint="Language for coaching sessions">
        <select style={inputStyle} value={form.preferred_language} onChange={set("preferred_language")}>
          <option value="en">English</option>
          <option value="nl">Dutch</option>
          <option value="de">German</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          <option value="id">Indonesian</option>
        </select>
      </Field>

      <Field label="Anything else WayPoint should know?" hint="Optional — current season, specific challenges, prayer focus">
        <textarea
          style={{ ...inputStyle, minHeight: "96px", resize: "vertical" }}
          value={form.notes}
          onChange={set("notes")}
          placeholder="e.g. In a difficult transition season, team conflict..."
        />
      </Field>

      <button
        type="submit"
        disabled={saving || saved}
        style={{
          background: saved ? "oklch(55% 0.15 150)" : "oklch(30% 0.12 260)",
          color: "oklch(97% 0.005 80)",
          fontFamily: "var(--font-montserrat)",
          fontWeight: 700,
          fontSize: "0.875rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          padding: "1rem",
          border: "none",
          cursor: saving ? "wait" : "pointer",
          opacity: saving ? 0.7 : 1,
        }}
      >
        {saved ? "Saved ✓" : saving ? "Saving…" : existing ? "Save Changes" : "Save & Start Coaching"}
      </button>
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8125rem", color: "oklch(28% 0.008 260)", marginBottom: "0.25rem" }}>
        {label}
      </label>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(60% 0.008 260)", marginBottom: "0.5rem" }}>
        {hint}
      </p>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.9rem",
  color: "oklch(22% 0.008 260)",
  background: "white",
  border: "1px solid oklch(82% 0.008 80)",
  padding: "0.75rem 1rem",
  outline: "none",
  boxSizing: "border-box",
};
