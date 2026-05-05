"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, sendMagicLink } from "@/app/auth/actions";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";

const initialState = { error: "" };

function LoginFormInner() {
  const { t } = useLanguage();
  const l = t.login;
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const result = await signIn(formData);
      return result ?? initialState;
    },
    initialState
  );
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  const inviteToken = searchParams.get("invite") || "";
  const memberInviteToken = searchParams.get("member_invite") || "";

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <input type="hidden" name="redirectTo" value={redirectTo} />
      {inviteToken && <input type="hidden" name="inviteToken" value={inviteToken} />}
      {memberInviteToken && <input type="hidden" name="memberInviteToken" value={memberInviteToken} />}

      {state.error && (
        <div style={{
          background: "oklch(95% 0.02 25)",
          border: "1px solid oklch(75% 0.08 25)",
          padding: "0.875rem 1rem",
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.875rem",
          color: "oklch(35% 0.1 25)",
        }}>
          {state.error}
        </div>
      )}

      <div className="form-field">
        <label className="form-label" htmlFor="email">{l.emailLabel}</label>
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

      <div className="form-field">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label className="form-label" htmlFor="password">{l.passwordLabel}</label>
          <Link href="/forgot-password" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(52% 0.008 260)", textDecoration: "none" }}>
            {l.forgotPassword}
          </Link>
        </div>
        <input
          className="form-input"
          type="password"
          id="password"
          name="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </div>

      <button
        type="submit"
        className="btn-primary"
        disabled={pending}
        style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem", opacity: pending ? 0.7 : 1 }}
      >
        {pending ? "…" : l.cta}
      </button>
    </form>
  );
}

function MagicLinkForm() {
  const { t } = useLanguage();
  const l = t.login;
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; sent?: boolean }, formData: FormData) => {
      const result = await sendMagicLink(formData);
      return result ?? {};
    },
    {}
  );

  if (state.sent) {
    return (
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(40% 0.12 145)", textAlign: "center", padding: "1rem", background: "oklch(95% 0.03 145)", border: "1px solid oklch(80% 0.06 145)" }}>
        {l.magicLinkSent}
      </p>
    );
  }

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {state.error && (
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(35% 0.1 25)" }}>{state.error}</p>
      )}
      <input
        className="form-input"
        type="email"
        name="email"
        placeholder="you@example.com"
        autoComplete="email"
        required
      />
      <button
        type="submit"
        className="btn-secondary"
        disabled={pending}
        style={{ width: "100%", justifyContent: "center", opacity: pending ? 0.7 : 1 }}
      >
        {pending ? "…" : l.magicLinkCta}
      </button>
    </form>
  );
}

export default function LoginForm() {
  const { t } = useLanguage();
  const l = t.login;

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
          <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.75rem" }}>{l.label}</p>
          <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.75rem", color: "oklch(22% 0.005 260)", lineHeight: 1.15, marginBottom: "0.625rem" }}>
            {l.h1}
          </h1>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(52% 0.008 260)" }}>
            {l.noAccount}{" "}
            <Link href="/membership" style={{ color: "oklch(30% 0.12 260)", fontWeight: 600, textDecoration: "none" }}>
              {l.signupLink}
            </Link>
          </p>
        </div>

        <LoginFormInner />

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBlock: "1.75rem" }}>
          <div style={{ flex: 1, height: "1px", background: "oklch(88% 0.008 80)" }} />
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(62% 0.006 260)", fontWeight: 300 }}>{l.magicLinkOr}</span>
          <div style={{ flex: 1, height: "1px", background: "oklch(88% 0.008 80)" }} />
        </div>

        <MagicLinkForm />

        <div style={{ height: "1.5rem" }} />

        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(62% 0.006 260)", textAlign: "center", lineHeight: 1.6 }}>
          By logging in you agree to our{" "}
          <Link href="/terms" style={{ color: "oklch(42% 0.008 260)", textDecoration: "none" }}>Terms of Service</Link>
          {" "}and{" "}
          <Link href="/privacy" style={{ color: "oklch(42% 0.008 260)", textDecoration: "none" }}>Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
