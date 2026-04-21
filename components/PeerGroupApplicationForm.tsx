"use client";

import { useActionState } from "react";
import { submitPeerGroupApplication } from "@/app/auth/actions";

type State = { error?: string; success?: boolean } | null;

const TIMEZONES = [
  "UTC-12 (Baker Island)", "UTC-11 (Samoa)", "UTC-10 (Hawaii)", "UTC-9 (Alaska)",
  "UTC-8 (Pacific US)", "UTC-7 (Mountain US)", "UTC-6 (Central US)", "UTC-5 (Eastern US)",
  "UTC-4 (Atlantic)", "UTC-3 (Brazil/Argentina)", "UTC-2", "UTC-1 (Azores)",
  "UTC+0 (London/Lisbon)", "UTC+1 (Amsterdam/Paris/Lagos)", "UTC+2 (Cairo/Johannesburg/Istanbul)",
  "UTC+3 (Nairobi/Riyadh/Moscow)", "UTC+4 (Dubai/Baku)", "UTC+4:30 (Kabul)", "UTC+5 (Karachi/Islamabad)",
  "UTC+5:30 (India)", "UTC+5:45 (Nepal)", "UTC+6 (Dhaka/Almaty)", "UTC+6:30 (Myanmar)",
  "UTC+7 (Bangkok/Jakarta)", "UTC+8 (Singapore/Manila/Beijing)", "UTC+8:45 (Eucla)",
  "UTC+9 (Tokyo/Seoul)", "UTC+9:30 (Darwin/Adelaide)", "UTC+10 (Sydney/Papua New Guinea)",
  "UTC+11 (Solomon Islands)", "UTC+12 (Auckland/Fiji)",
];

export default function PeerGroupApplicationForm() {
  const [state, action, pending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      return await submitPeerGroupApplication(formData) ?? null;
    },
    null,
  );

  if (state?.success) {
    return (
      <div style={{ background: "oklch(97% 0.005 80)", border: "1px solid oklch(88% 0.008 80)", padding: "3rem 2.5rem", maxWidth: "640px" }}>
        <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.75rem", fontSize: "0.62rem" }}>Application Received</p>
        <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.5rem", color: "oklch(22% 0.005 260)", marginBottom: "1rem", lineHeight: 1.2 }}>
          You&apos;re on the list.
        </h2>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7, color: "oklch(48% 0.008 260)" }}>
          Chris will review your application and be in touch. If approved, you&apos;ll receive everything you need to launch your peer group.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "640px" }}>
      <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem", fontSize: "0.62rem" }}>Peer Group Initiator</p>
      <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.75rem", color: "oklch(22% 0.005 260)", marginBottom: "0.75rem", lineHeight: 1.15 }}>
        Initiate a Peer Group.
      </h2>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7, color: "oklch(48% 0.008 260)", marginBottom: "2.5rem" }}>
        As an initiator you&apos;ll set the tone, the rhythm, and the welcome for your group. Tell us about your context — Chris reviews each application personally.
      </p>

      <form action={action} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        <div>
          <label htmlFor="region" style={labelStyle}>What region are you in?</label>
          <input id="region" name="region" type="text" required maxLength={100}
            placeholder="e.g. Southeast Asia, West Africa, Latin America…"
            style={inputStyle} />
        </div>

        <div>
          <label htmlFor="timezone" style={labelStyle}>Your timezone</label>
          <select id="timezone" name="timezone" required style={inputStyle}>
            <option value="">Select a timezone…</option>
            {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="groupSizePref" style={labelStyle}>Preferred group size <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
          <select id="groupSizePref" name="groupSizePref" style={inputStyle}>
            <option value="">No preference</option>
            <option value="3–6">3–6 (intimate)</option>
            <option value="7–12">7–12 (medium)</option>
            <option value="13–25">13–25 (larger)</option>
          </select>
        </div>

        <div>
          <label htmlFor="reason" style={labelStyle}>Why do you want to initiate a group?</label>
          <textarea id="reason" name="reason" required rows={5} maxLength={1000}
            placeholder="Tell us what drives you to start this — your context, your community, your hope for the group…"
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
        </div>

        {state?.error && (
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(45% 0.18 25)" }}>
            {state.error}
          </p>
        )}

        <div>
          <button type="submit" disabled={pending} style={{
            fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem",
            letterSpacing: "0.08em", textTransform: "uppercase",
            color: "oklch(97% 0.005 80)",
            background: pending ? "oklch(55% 0.008 260)" : "oklch(30% 0.12 260)",
            border: "none", padding: "0.875rem 2.5rem",
            cursor: pending ? "not-allowed" : "pointer",
            transition: "background 0.15s ease",
          }}>
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
