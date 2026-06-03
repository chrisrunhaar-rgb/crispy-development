"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpChallenge, enrollExistingUser } from "@/app/challenge/actions";

const navy     = "oklch(22% 0.10 260)";
const offWhite = "oklch(97% 0.005 80)";

const initialState = { error: "" };

export default function SoloSignupForm({ isLoggedIn, userEmail }: { isLoggedIn: boolean; userEmail: string | null }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const result = await signUpChallenge(formData);
      return result ?? initialState;
    },
    initialState,
  );

  const [, enrollAction, enrollPending] = useActionState(
    async (_prev: typeof initialState, _: FormData) => {
      await enrollExistingUser();
      return initialState;
    },
    initialState,
  );

  if (isLoggedIn) {
    return (
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.5rem", color: navy, marginBottom: "0.5rem" }}>
          Ready to start?
        </h1>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(52% 0.008 260)", marginBottom: "2rem" }}>
          Signed in as {userEmail}
        </p>
        <form action={enrollAction}>
          <button
            type="submit"
            disabled={enrollPending}
            style={btnStyle(enrollPending)}
          >
            {enrollPending ? "Starting..." : "Start Day 1 →"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: "400px" }}>
      <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.5rem", color: navy, marginBottom: "2rem" }}>
        Create your account
      </h1>

      <form action={formAction}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "1.25rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <input name="firstName" type="text" required placeholder="First name" autoComplete="given-name" style={inputStyle} />
            <input name="lastName" type="text" required placeholder="Last name" autoComplete="family-name" style={inputStyle} />
          </div>
          <input name="email" type="email" required placeholder="Email address" autoComplete="email" style={inputStyle} />
          <input name="password" type="password" required minLength={8} placeholder="Password (8+ characters)" autoComplete="new-password" style={inputStyle} />
        </div>

        {state.error && (
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(50% 0.22 15)", marginBottom: "0.875rem" }}>
            {state.error}
          </p>
        )}

        <button type="submit" disabled={pending} style={btnStyle(pending)}>
          {pending ? "Creating account..." : "Start Day 1 →"}
        </button>

        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", color: "oklch(52% 0.008 260)", textAlign: "center", marginTop: "1rem" }}>
          Have an account?{" "}
          <Link href="/login?next=/challenge/solo" style={{ color: navy, fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
        </p>
      </form>
    </div>
  );
}

function btnStyle(disabled: boolean): React.CSSProperties {
  return {
    width: "100%", fontFamily: "var(--font-montserrat)", fontWeight: 700,
    fontSize: "1rem", color: offWhite, background: navy, border: "none",
    borderRadius: "8px", padding: "0.9375rem", cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.7 : 1,
  };
}

const inputStyle: React.CSSProperties = {
  width: "100%", fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem",
  color: navy, background: "white", border: "1px solid oklch(82% 0.006 260)",
  borderRadius: "8px", padding: "0.75rem 1rem", outline: "none", boxSizing: "border-box",
};
