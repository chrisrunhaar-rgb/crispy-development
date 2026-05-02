"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/app/auth/actions";

export const dynamic = "force-dynamic";

const initialState = { error: "", sent: false };

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const result = await requestPasswordReset(formData);
      return { error: result.error ?? "", sent: result.sent ?? false };
    },
    initialState
  );

  if (state.sent) {
    return (
      <div style={{
        minHeight: "calc(100dvh - 120px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingBlock: "4rem",
        paddingInline: "1.5rem",
        background: "oklch(97% 0.005 80)",
      }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>
            Check your email
          </p>
          <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.75rem", color: "oklch(22% 0.005 260)", lineHeight: 1.15, marginBottom: "0.875rem" }}>
            Reset link sent.
          </h1>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(48% 0.008 260)", marginBottom: "2rem" }}>
            If an account exists for that email, you&apos;ll receive a password reset link shortly. Check your spam folder if it doesn&apos;t arrive within a few minutes.
          </p>
          <Link href="/login" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", fontWeight: 600, color: "oklch(30% 0.12 260)", textDecoration: "none" }}>
            ← Back to log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "calc(100dvh - 120px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      paddingBlock: "4rem",
      paddingInline: "1.5rem",
      background: "oklch(97% 0.005 80)",
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.75rem" }}>
            Password reset
          </p>
          <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.75rem", color: "oklch(22% 0.005 260)", lineHeight: 1.15, marginBottom: "0.625rem" }}>
            Forgot your password?
          </h1>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(52% 0.008 260)" }}>
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {state.error && (
            <div style={{ background: "oklch(95% 0.02 25)", border: "1px solid oklch(75% 0.08 25)", padding: "0.875rem 1rem", fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(35% 0.1 25)" }}>
              {state.error}
            </div>
          )}

          <div className="form-field">
            <label className="form-label" htmlFor="email">Email address</label>
            <input
              className="form-input"
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={pending}
            style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem", opacity: pending ? 0.7 : 1 }}
          >
            {pending ? "Sending…" : "Send reset link →"}
          </button>
        </form>

        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(62% 0.006 260)", marginTop: "1.5rem", textAlign: "center" }}>
          <Link href="/login" style={{ color: "oklch(42% 0.008 260)", textDecoration: "none" }}>
            ← Back to log in
          </Link>
        </p>
      </div>
    </div>
  );
}
