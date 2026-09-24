"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { signUp } from "@/app/auth/actions";
import { useLanguage } from "@/lib/LanguageContext";
import { trackPathwayStarted } from "@/lib/ga-events";

type Pathway = "personal" | "team";
const initialState = { error: "" };

// Same icons as the dashboard's Personal/Team tab toggle (app/(app)/dashboard/page.tsx)
// — identical viewBox and path/circle data, just scaled up for the larger tile. Kept
// in sync deliberately so a user sees the same glyph on signup and inside the app.
function PersonalPathIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TeamPathIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 14c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="3.5" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1 14c0-2.2 1.1-3.5 2.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12.5" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15 14c0-2.2-1.1-3.5-2.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function SignupForm({ defaultPathway = "personal", inviteToken = "", memberInviteToken = "", initialLanguage, redirectTo = "" }: { defaultPathway?: Pathway; inviteToken?: string; memberInviteToken?: string; initialLanguage?: "en" | "id"; redirectTo?: string }) {
  const [pathway, setPathway] = useState<Pathway>(defaultPathway);
  const [showPassword, setShowPassword] = useState(false);
  const { t, lang, setLang } = useLanguage();
  const s = t.signup;

  // Force the UI into the invite's own language the instant it's known — an invite
  // sent in Indonesian must land on an Indonesian signup screen, not whatever the
  // visitor's browser/cookie happened to have.
  useEffect(() => {
    if (initialLanguage && initialLanguage !== lang) setLang(initialLanguage);
    // Only run when the resolved initialLanguage changes — not on every `lang` change,
    // otherwise this would fight the user's own manual language toggle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLanguage]);
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

        {/* ── FORM — public self-serve signup, invite tokens still supported for the challenge/team flows ── */}
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

            {/* Pathway selection — shown for public signup and the Influential Leadership
                Challenge's team-invite flow. A member invite already carries its own fixed
                pathway (set when the invite was created), so it's hidden there. */}
            {!memberInviteToken && (
              <div style={{ marginBottom: "2rem" }}>
                <p className="form-label" style={{ marginBottom: "0.75rem" }}>{s.choosePathway}</p>
                <div className="pathway-grid">
                  {(["personal", "team"] as const).map((p) => {
                    const isSelected = pathway === p;
                    return (
                      <label
                        key={p}
                        className={`pathway-option${isSelected ? " selected" : ""}`}
                        onClick={() => { setPathway(p); trackPathwayStarted(p); }}
                      >
                        {/* Visually hidden, not removed — keeps native radio-group keyboard
                            and screen-reader semantics. The dot Chris flagged was the input's
                            default browser-drawn appearance, not this element itself. */}
                        <input
                          type="radio"
                          name="pathway-visual"
                          value={p}
                          checked={isSelected}
                          onChange={() => setPathway(p)}
                          aria-label={p === "personal" ? s.personalTitle : s.teamTitle}
                          className="pathway-radio-sr"
                        />
                        <span className="pathway-icon" style={{ color: isSelected ? "white" : "oklch(30% 0.12 260)" }}>
                          {p === "personal" ? <PersonalPathIcon /> : <TeamPathIcon />}
                        </span>
                        <div style={{ textAlign: "center" }}>
                          <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9375rem", color: isSelected ? "white" : "oklch(22% 0.005 260)", marginBottom: "0.25rem" }}>
                            {p === "personal" ? s.personalTitle : s.teamTitle}
                          </p>
                          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: isSelected ? "white" : "oklch(52% 0.008 260)", lineHeight: 1.5 }}>
                            {p === "personal" ? s.personalDesc : s.teamDesc}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Form */}
            <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <input type="hidden" name="pathway" value={pathway} />
              <input type="hidden" name="inviteToken" value={inviteToken} />
              <input type="hidden" name="memberInviteToken" value={memberInviteToken} />
              <input type="hidden" name="language" value={lang} />
              <input type="hidden" name="redirectTo" value={redirectTo} />

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
                  <input className="form-input" type="text" id="firstName" name="firstName" autoComplete="given-name" required />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="lastName">{s.lastName}</label>
                  <input className="form-input" type="text" id="lastName" name="lastName" autoComplete="family-name" />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="email">{s.email}</label>
                <input className="form-input" type="email" id="email" name="email" placeholder="you@example.com" autoComplete="email" required />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="password">{s.password}</label>
                <div style={{ position: "relative" }}>
                  <input
                    className="form-input"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder={s.passwordPlaceholder}
                    autoComplete="new-password"
                    minLength={8}
                    required
                    style={{ paddingRight: "2.75rem" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "0.75rem",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      padding: "0.25rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      color: "oklch(52% 0.008 260)",
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* ToS acceptance — required, affirmative consent */}
              <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="tosAccepted"
                  required
                  style={{ marginTop: "0.2rem", flexShrink: 0, accentColor: "oklch(30% 0.12 260)", width: "16px", height: "16px" }}
                />
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(48% 0.008 260)", lineHeight: 1.5 }}>
                  {s.tosAccepted}{" "}
                  <Link href="/terms" style={{ color: "oklch(30% 0.12 260)", fontWeight: 600, textDecoration: "none" }}>{s.termsLink}</Link>
                  {" "}{s.and}{" "}
                  <Link href="/privacy" style={{ color: "oklch(30% 0.12 260)", fontWeight: 600, textDecoration: "none" }}>{s.privacyLink}</Link>. *
                </span>
              </label>

              {/* Marketing consent — optional opt-in */}
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
          </>

      </div>
    </div>
  );
}
