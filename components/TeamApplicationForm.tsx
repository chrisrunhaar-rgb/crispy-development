"use client";

import { useActionState } from "react";
import { submitTeamApplication } from "@/app/auth/actions";

type State = { error?: string; success?: boolean } | null;

export default function TeamApplicationForm() {
  const [state, action, pending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      return await submitTeamApplication(formData) ?? null;
    },
    null,
  );

  if (state?.success) {
    return (
      <div style={{
        background: "oklch(97% 0.005 80)",
        border: "1px solid oklch(88% 0.008 80)",
        padding: "3rem 2.5rem",
        maxWidth: "640px",
      }}>
        <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.75rem", fontSize: "0.62rem" }}>Application Submitted</p>
        <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.5rem", color: "oklch(22% 0.005 260)", marginBottom: "1rem", lineHeight: 1.2 }}>
          You're on the list.
        </h2>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7, color: "oklch(48% 0.008 260)" }}>
          Chris will review your application and be in touch. In the meantime, your personal pathway is fully available.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "640px" }}>
      <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem", fontSize: "0.62rem" }}>Team Leader Access</p>
      <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.75rem", color: "oklch(22% 0.005 260)", marginBottom: "0.75rem", lineHeight: 1.15 }}>
        Apply for Team Leader access.
      </h2>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7, color: "oklch(48% 0.008 260)", marginBottom: "2.5rem" }}>
        The Team Leader dashboard is for those actively leading cross-cultural groups. Tell us a little about your context — Chris reviews each application personally.
      </p>

      <form action={action} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* Team size */}
        <div>
          <label htmlFor="teamSize" style={labelStyle}>How many people are in your team?</label>
          <select id="teamSize" name="teamSize" required style={inputStyle}>
            <option value="">Select a range…</option>
            <option value="1–5">1–5 people</option>
            <option value="6–15">6–15 people</option>
            <option value="16–30">16–30 people</option>
            <option value="31–50">31–50 people</option>
            <option value="50+">More than 50</option>
          </select>
        </div>

        {/* Organisation */}
        <div>
          <label htmlFor="organisation" style={labelStyle}>What organisation or movement are you part of?</label>
          <input
            id="organisation"
            name="organisation"
            type="text"
            required
            maxLength={200}
            placeholder="e.g. organisation, church, NGO…"
            style={inputStyle}
          />
        </div>

        {/* Work type */}
        <div>
          <label htmlFor="workType" style={labelStyle}>What kind of cross-cultural work does your team do?</label>
          <input
            id="workType"
            name="workType"
            type="text"
            required
            maxLength={200}
            placeholder="e.g. community development in Southeast Asia, NGO in the Middle East…"
            style={inputStyle}
          />
        </div>

        {/* Reason */}
        <div>
          <label htmlFor="reason" style={labelStyle}>Why do you want to use this tool with your team?</label>
          <textarea
            id="reason"
            name="reason"
            required
            rows={5}
            maxLength={1000}
            placeholder="Tell us about your team and what you're hoping to build together…"
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
          />
        </div>

        {state?.error && (
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(45% 0.18 25)" }}>
            {state.error}
          </p>
        )}

        <div>
          <button
            type="submit"
            disabled={pending}
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "0.8rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "oklch(97% 0.005 80)",
              background: pending ? "oklch(55% 0.008 260)" : "oklch(30% 0.12 260)",
              border: "none",
              padding: "0.875rem 2.5rem",
              cursor: pending ? "not-allowed" : "pointer",
              transition: "background 0.15s ease",
            }}
          >
            {pending ? "Submitting…" : "Submit Application →"}
          </button>
        </div>

      </form>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "oklch(52% 0.008 260)",
  marginBottom: "0.5rem",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.9375rem",
  color: "oklch(22% 0.005 260)",
  background: "oklch(99% 0.002 80)",
  border: "1px solid oklch(82% 0.008 80)",
  padding: "0.75rem 1rem",
  outline: "none",
  boxSizing: "border-box",
};
