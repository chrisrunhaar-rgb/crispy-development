"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpChallenge, enrollExistingUser } from "@/app/challenge/actions";

const navy     = "oklch(22% 0.10 260)";
const orange   = "oklch(65% 0.15 45)";
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

  const [enrollState, enrollAction, enrollPending] = useActionState(
    async (_prev: typeof initialState, _: FormData) => {
      await enrollExistingUser();
      return initialState;
    },
    initialState,
  );

  return (
    <div style={{ width: "100%", maxWidth: "480px" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <Link href="/challenge" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(52% 0.008 260)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem", marginBottom: "1.5rem" }}>
          ← Back to challenge
        </Link>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: "0.5rem" }}>
          Free · Solo path
        </p>
        <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.75rem", color: navy, lineHeight: 1.15, marginBottom: "0.625rem" }}>
          Start the Influential Leadership Challenge
        </h1>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(52% 0.008 260)", lineHeight: 1.6 }}>
          62 sessions. 10 minutes a day. Free access, no credit card required.
        </p>
      </div>

      {isLoggedIn ? (
        /* Existing user — just enroll */
        <div>
          <div style={{ background: "white", border: "1px solid oklch(88% 0.006 80)", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(48% 0.008 260)", marginBottom: "0.5rem" }}>
              Signed in as <strong style={{ color: navy }}>{userEmail}</strong>
            </p>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(52% 0.008 260)", lineHeight: 1.6 }}>
              Your challenge access will be added to your existing account.
            </p>
          </div>

          {enrollState.error && (
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(50% 0.22 15)", marginBottom: "1rem" }}>
              {enrollState.error}
            </p>
          )}

          <form action={enrollAction}>
            <button
              type="submit"
              disabled={enrollPending}
              style={{ width: "100%", fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9375rem", color: offWhite, background: navy, border: "none", borderRadius: "8px", padding: "0.9375rem", cursor: enrollPending ? "not-allowed" : "pointer", opacity: enrollPending ? 0.7 : 1 }}
            >
              {enrollPending ? "Enrolling..." : "Join the challenge →"}
            </button>
          </form>
        </div>
      ) : (
        /* New user — full sign-up */
        <form action={formAction}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div>
                <label style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, color: "oklch(42% 0.008 260)", display: "block", marginBottom: "0.375rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  First name
                </label>
                <input
                  name="firstName"
                  type="text"
                  required
                  autoComplete="given-name"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, color: "oklch(42% 0.008 260)", display: "block", marginBottom: "0.375rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  Last name
                </label>
                <input
                  name="lastName"
                  type="text"
                  required
                  autoComplete="family-name"
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, color: "oklch(42% 0.008 260)", display: "block", marginBottom: "0.375rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, color: "oklch(42% 0.008 260)", display: "block", marginBottom: "0.375rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                style={inputStyle}
              />
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: "oklch(55% 0.008 260)", marginTop: "0.25rem" }}>
                Minimum 8 characters
              </p>
            </div>
          </div>

          {state.error && (
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(50% 0.22 15)", marginBottom: "1rem" }}>
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            style={{ width: "100%", fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9375rem", color: offWhite, background: navy, border: "none", borderRadius: "8px", padding: "0.9375rem", cursor: pending ? "not-allowed" : "pointer", opacity: pending ? 0.7 : 1, marginBottom: "1rem" }}
          >
            {pending ? "Creating account..." : "Start the challenge →"}
          </button>

          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(52% 0.008 260)", textAlign: "center" }}>
            Already have an account?{" "}
            <Link href="/login?next=/challenge/solo" style={{ color: navy, fontWeight: 600, textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.9375rem",
  color: navy,
  background: "white",
  border: "1px solid oklch(82% 0.006 260)",
  borderRadius: "8px",
  padding: "0.75rem 1rem",
  outline: "none",
  boxSizing: "border-box",
};
