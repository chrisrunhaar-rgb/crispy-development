"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/app/auth/actions";
import { useLanguage } from "@/lib/LanguageContext";

export const dynamic = "force-dynamic";

const COPY = {
  en: {
    label: "Password reset",
    h1: "Forgot your password?",
    intro: "Enter your email and we'll send you a reset link.",
    emailLabel: "Email address",
    sending: "Sending…",
    submit: "Send reset link →",
    backToLogin: "← Back to log in",
    sentLabel: "Check your email",
    sentH1: "Reset link sent.",
    sentBody: "If an account exists for that email, you'll receive a password reset link shortly. Check your spam folder if it doesn't arrive within a few minutes.",
  },
  id: {
    label: "Atur ulang kata sandi",
    h1: "Lupa kata sandi?",
    intro: "Masukkan email Anda dan kami akan mengirimkan tautan pengaturan ulang.",
    emailLabel: "Alamat email",
    sending: "Mengirim…",
    submit: "Kirim tautan pengaturan ulang →",
    backToLogin: "← Kembali ke halaman masuk",
    sentLabel: "Periksa email Anda",
    sentH1: "Tautan pengaturan ulang terkirim.",
    sentBody: "Jika ada akun dengan email tersebut, Anda akan menerima tautan pengaturan ulang kata sandi segera. Periksa folder spam jika tidak tiba dalam beberapa menit.",
  },
};

const initialState = { error: "", sent: false };

export default function ForgotPasswordPage() {
  const { lang } = useLanguage();
  const c = lang === "id" ? COPY.id : COPY.en;

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
            {c.sentLabel}
          </p>
          <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.75rem", color: "oklch(22% 0.005 260)", lineHeight: 1.15, marginBottom: "0.875rem" }}>
            {c.sentH1}
          </h1>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(48% 0.008 260)", marginBottom: "2rem" }}>
            {c.sentBody}
          </p>
          <Link href="/login" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", fontWeight: 600, color: "oklch(30% 0.12 260)", textDecoration: "none" }}>
            {c.backToLogin}
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
            {c.label}
          </p>
          <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.75rem", color: "oklch(22% 0.005 260)", lineHeight: 1.15, marginBottom: "0.625rem" }}>
            {c.h1}
          </h1>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(52% 0.008 260)" }}>
            {c.intro}
          </p>
        </div>

        <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {state.error && (
            <div style={{ background: "oklch(95% 0.02 25)", border: "1px solid oklch(75% 0.08 25)", padding: "0.875rem 1rem", fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(35% 0.1 25)" }}>
              {state.error}
            </div>
          )}

          <div className="form-field">
            <label className="form-label" htmlFor="email">{c.emailLabel}</label>
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
            {pending ? c.sending : c.submit}
          </button>
        </form>

        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(62% 0.006 260)", marginTop: "1.5rem", textAlign: "center" }}>
          <Link href="/login" style={{ color: "oklch(42% 0.008 260)", textDecoration: "none" }}>
            {c.backToLogin}
          </Link>
        </p>
      </div>
    </div>
  );
}
