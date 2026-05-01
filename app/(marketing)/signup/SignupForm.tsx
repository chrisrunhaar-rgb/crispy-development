"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUp } from "@/app/auth/actions";
import { useLanguage } from "@/lib/LanguageContext";

type Pathway = "personal" | "team";
const initialState = { error: "" };

export default function SignupForm({ defaultPathway = "personal", inviteToken = "", memberInviteToken = "" }: { defaultPathway?: Pathway; inviteToken?: string; memberInviteToken?: string }) {
  const [pathway, setPathway] = useState<Pathway>(defaultPathway);
  const { t } = useLanguage();
  const s = t.signup;
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const result = await signUp(formData);
      return result ?? initialState;
    },
    initialState
  );

  return (
    <div style={{
      minHeight: "calc(100dvh - 120px)",
      background: "oklch(97% 0.005 80)",
      paddingBlock: "4rem",
      paddingInline: "1.5rem",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
    }}>
      <div style={{ width: "100%", maxWidth: "520px" }}>

        {/* ── COMING SOON BANNER ── always visible */}
        <div style={{ marginBottom: (inviteToken || memberInviteToken) ? "2.5rem" : 0, background: "oklch(22% 0.10 260)", padding: "clamp(1.75rem, 4vw, 2.5rem)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
          <div style={{ position: "absolute", bottom: "-40px", right: "-40px", width: "160px", height: "160px", borderRadius: "50%", border: "1px solid oklch(97% 0.005 80 / 0.05)", pointerEvents: "none" }}>
            <div style={{ position: "absolute", top: "30px", left: "30px", right: "30px", bottom: "30px", borderRadius: "50%", border: "1px solid oklch(65% 0.15 45 / 0.1)" }} />
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "oklch(65% 0.15 45 / 0.15)", border: "1px solid oklch(65% 0.15 45 / 0.4)", padding: "0.25rem 0.75rem", marginBottom: "1rem" }}>
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.15 45)" }}>
              Coming Soon
            </span>
          </div>
          <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(1.25rem, 3vw, 1.625rem)", color: "oklch(97% 0.005 80)", lineHeight: 1.2, marginBottom: "0.75rem" }}>
            Registration opens soon
          </h2>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(72% 0.04 260)", lineHeight: 1.65, marginBottom: "1.25rem", maxWidth: "38ch" }}>
            We&apos;re finalising membership plans. In the meantime, explore the 4 free modules — no account needed.
          </p>
          <Link href="/resources" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "oklch(97% 0.005 80)", textDecoration: "none", border: "1px solid oklch(55% 0.008 260)", padding: "0.5rem 1rem", display: "inline-block" }}>
            Browse free resources →
          </Link>
        </div>

        {/* ── FORM — only shown when a valid invite token is present ── */}
        {(inviteToken || memberInviteToken) && (
          <>
            {/* Header */}
            <div style={{ marginBottom: "2.5rem" }}>
              <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.75rem" }}>{s.label}</p>
              <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.75rem", color: "oklch(22% 0.005 260)", lineHeight: 1.15, marginBottom: "0.625rem" }}>
                {s.h1}
              </h1>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(52% 0.008 260)" }}>
                {s.hasAccount}{" "}
                <Link href="/login" style={{ color: "oklch(30% 0.12 260)", fontWeight: 600, textDecoration: "none" }}>
                  {s.loginLink}
                </Link>
              </p>
            </div>

            {/* Pathway selection */}
            <div style={{ marginBottom: "2rem" }}>
              <p className="form-label" style={{ marginBottom: "0.75rem" }}>{s.choosePathway}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {(["personal", "team"] as const).map((p) => (
                  <label
                    key={p}
                    className={`pathway-option${pathway === p ? " selected" : ""}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setPathway(p)}
                  >
                    <input
                      type="radio"
                      name="pathway-visual"
                      value={p}
                      checked={pathway === p}
                      onChange={() => setPathway(p)}
                      style={{ marginTop: "0.125rem", accentColor: "oklch(30% 0.12 260)", flexShrink: 0 }}
                    />
                    <div>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9375rem", color: "oklch(22% 0.005 260)", marginBottom: "0.25rem" }}>
                        {p === "personal" ? s.personalTitle : s.teamTitle}
                      </p>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(52% 0.008 260)", lineHeight: 1.5 }}>
                        {p === "personal" ? s.personalDesc : s.teamDesc}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Form */}
            <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <input type="hidden" name="pathway" value={pathway} />
              <input type="hidden" name="inviteToken" value={inviteToken} />
              <input type="hidden" name="memberInviteToken" value={memberInviteToken} />

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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-field">
                  <label className="form-label" htmlFor="firstName">{s.firstName}</label>
                  <input className="form-input" type="text" id="firstName" name="firstName" placeholder="Chris" autoComplete="given-name" required />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="lastName">{s.lastName}</label>
                  <input className="form-input" type="text" id="lastName" name="lastName" placeholder="Runhaar" autoComplete="family-name" required />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="email">{s.email}</label>
                <input className="form-input" type="email" id="email" name="email" placeholder="you@example.com" autoComplete="email" required />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="password">{s.password}</label>
                <input className="form-input" type="password" id="password" name="password" placeholder={s.passwordPlaceholder} autoComplete="new-password" minLength={8} required />
              </div>

              {/* Marketing consent — optional opt-in, GDPR compliant */}
              <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="marketingConsent"
                  value="true"
                  style={{ marginTop: "0.2rem", flexShrink: 0, accentColor: "oklch(30% 0.12 260)", width: "16px", height: "16px" }}
                />
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(48% 0.008 260)", lineHeight: 1.5 }}>
                  {s.marketingConsent}
                </span>
              </label>

              <button
                type="submit"
                className="btn-primary"
                disabled={pending}
                style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem", opacity: pending ? 0.7 : 1 }}
              >
                {pending ? "…" : s.cta}
              </button>
            </form>

            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(62% 0.006 260)", marginTop: "1.5rem", textAlign: "center", lineHeight: 1.6 }}>
              {s.termsNote}{" "}
              <Link href="/terms" style={{ color: "oklch(42% 0.008 260)", textDecoration: "none" }}>{s.termsLink}</Link>
              {" "}{s.and}{" "}
              <Link href="/privacy" style={{ color: "oklch(42% 0.008 260)", textDecoration: "none" }}>{s.privacyLink}</Link>.
            </p>
          </>
        )}

      </div>
    </div>
  );
}
