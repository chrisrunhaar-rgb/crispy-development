"use client";

import { useActionState } from "react";
import { saveProfile } from "./actions";

const navy = "oklch(30% 0.12 260)";
const orange = "oklch(65% 0.15 45)";
const mid = "oklch(52% 0.008 260)";

interface Props {
  firstName: string;
  lastName: string;
  email: string;
}

export default function ProfileForm({ firstName, lastName, email }: Props) {
  const [state, action, pending] = useActionState(saveProfile, null);

  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <div>
          <label style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: mid, display: "block", marginBottom: "0.4rem" }}>
            First name
          </label>
          <input
            name="first_name"
            defaultValue={firstName}
            required
            style={{ width: "100%", fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", fontWeight: 500, color: navy, background: "white", border: "1.5px solid oklch(82% 0.008 260)", borderRadius: "8px", padding: "0.6rem 0.875rem", outline: "none", boxSizing: "border-box" }}
          />
        </div>
        <div>
          <label style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: mid, display: "block", marginBottom: "0.4rem" }}>
            Last name
          </label>
          <input
            name="last_name"
            defaultValue={lastName}
            style={{ width: "100%", fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", fontWeight: 500, color: navy, background: "white", border: "1.5px solid oklch(82% 0.008 260)", borderRadius: "8px", padding: "0.6rem 0.875rem", outline: "none", boxSizing: "border-box" }}
          />
        </div>
      </div>

      <div>
        <label style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: mid, display: "block", marginBottom: "0.4rem" }}>
          Email
        </label>
        <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(58% 0.008 260)", background: "oklch(94% 0.004 80)", border: "1.5px solid oklch(87% 0.006 80)", borderRadius: "8px", padding: "0.6rem 0.875rem" }}>
          {email}
        </div>
      </div>

      {state?.error && (
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(52% 0.2 25)", margin: 0 }}>
          {state.error}
        </p>
      )}

      {state?.success && (
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(52% 0.18 150)", margin: 0 }}>
          Profile saved.
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={pending}
          style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 700, color: "white", background: pending ? "oklch(62% 0.06 260)" : navy, border: "none", borderRadius: "8px", padding: "0.6rem 1.375rem", cursor: pending ? "not-allowed" : "pointer" }}
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
