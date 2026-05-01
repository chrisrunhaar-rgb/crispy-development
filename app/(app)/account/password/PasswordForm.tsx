"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { changePassword } from "./actions";

const navy = "oklch(30% 0.12 260)";
const orange = "oklch(65% 0.15 45)";

const inputStyle: React.CSSProperties = {
  width: "100%",
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.9rem",
  color: navy,
  background: "white",
  border: "1px solid oklch(82% 0.008 80)",
  padding: "0.75rem 1rem",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "oklch(45% 0.008 260)",
  display: "block",
  marginBottom: "0.5rem",
};

export default function PasswordForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await changePassword(formData);
      if (result?.error) setError(result.error);
      else setSuccess(true);
    });
  }

  if (success) {
    return (
      <div style={{ textAlign: "center", padding: "2rem 0" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✓</div>
        <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1.125rem", color: navy, marginBottom: "0.5rem" }}>
          Password updated
        </p>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(52% 0.008 260)", marginBottom: "2rem" }}>
          You can now log in with your new password.
        </p>
        <Link
          href="/dashboard"
          style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: "white", background: orange, padding: "0.875rem 2rem", textDecoration: "none", display: "inline-block" }}
        >
          Back to Dashboard →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <label htmlFor="password" style={labelStyle}>New Password *</label>
        <input id="password" name="password" type="password" required minLength={8} style={inputStyle} placeholder="At least 8 characters" />
      </div>

      <div>
        <label htmlFor="confirm" style={labelStyle}>Confirm Password *</label>
        <input id="confirm" name="confirm" type="password" required minLength={8} style={inputStyle} placeholder="Repeat your new password" />
      </div>

      {error && (
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", color: "oklch(45% 0.12 25)", background: "oklch(97% 0.04 25)", padding: "0.75rem 1rem", borderLeft: "3px solid oklch(55% 0.15 25)" }}>
          {error}
        </p>
      )}

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <button
          type="submit"
          disabled={pending}
          style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", letterSpacing: "0.06em", color: "white", background: pending ? "oklch(52% 0.008 260)" : orange, border: "none", padding: "0.875rem 2rem", cursor: pending ? "not-allowed" : "pointer" }}
        >
          {pending ? "Saving…" : "Update Password"}
        </button>
        <Link href="/dashboard" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(52% 0.008 260)", textDecoration: "none" }}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
