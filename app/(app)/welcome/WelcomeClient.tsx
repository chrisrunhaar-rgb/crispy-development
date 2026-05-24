"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { markOnboardingComplete, setWelcomeLanguage, markGdprConsent } from "./actions";
import { changePassword } from "@/app/(app)/account/password/actions";

const navy = "oklch(30% 0.12 260)";
const orange = "oklch(65% 0.15 45)";

type Step = 0 | 1 | 2 | 3 | 4 | 5;
const TOTAL = 6;

const STEP_LABELS = ["Password", "Language", "Privacy", "Install", "Notifications", "Ready"];

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

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

function PrimaryBtn({ onClick, disabled, children }: { onClick?: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", letterSpacing: "0.04em", color: "white", background: disabled ? "oklch(62% 0.008 260)" : orange, border: "none", padding: "0.875rem 2rem", cursor: disabled ? "not-allowed" : "pointer", transition: "background 0.15s" }}
    >
      {children}
    </button>
  );
}

function SkipBtn({ onClick, label = "Skip for now →" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(52% 0.008 260)", background: "none", border: "none", cursor: "pointer", padding: "0.5rem 0", textDecoration: "underline" }}
    >
      {label}
    </button>
  );
}

export default function WelcomeClient({ firstName, currentLanguage, preview = false }: { firstName: string; currentLanguage: string; preview?: boolean }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [lang, setLang] = useState<"en" | "id">(currentLanguage as "en" | "id");

  // Password step state
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwPending, startPwTransition] = useTransition();

  // PWA install
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // GDPR consent (step 2)
  const [gdprConsent, setGdprConsent] = useState(false);
  const [gdprPending, startGdprTransition] = useTransition();

  // Notifications
  const [notifState, setNotifState] = useState<"idle" | "granted" | "denied" | "unavailable">("idle");

  // Completion
  const [completing, startCompleting] = useTransition();

  useEffect(() => {
    // Capture PWA install prompt (Android Chrome)
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Check existing notification permission
    if (!("Notification" in window)) {
      setNotifState("unavailable");
    } else if (Notification.permission === "granted") {
      setNotifState("granted");
    } else if (Notification.permission === "denied") {
      setNotifState("denied");
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function next() {
    if (step < (TOTAL - 1)) {
      setStep((s) => (s + 1) as Step);
    }
  }

  function handleGdprContinue() {
    startGdprTransition(async () => {
      if (!preview) await markGdprConsent();
      next();
    });
  }

  function finish() {
    startCompleting(async () => {
      if (!preview) {
        await setWelcomeLanguage(lang);
        await markOnboardingComplete();
      }
      router.push(preview ? "/dashboard" : "/dashboard?tour=1");
    });
  }

  function handlePwSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPwError(null);
    const formData = new FormData(e.currentTarget);
    if (preview) {
      setPwSuccess(true);
      setTimeout(() => next(), 1500);
      return;
    }
    startPwTransition(async () => {
      const result = await changePassword(formData);
      if (result?.error) {
        setPwError(result.error);
      } else {
        setPwSuccess(true);
        setTimeout(() => next(), 1500);
      }
    });
  }

  async function handleInstall() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
      setTimeout(() => next(), 1000);
    }
  }

  async function handleNotifications() {
    if (!("Notification" in window)) {
      setNotifState("unavailable");
      return;
    }
    const result = await Notification.requestPermission();
    setNotifState(result === "granted" ? "granted" : "denied");
    if (result === "granted") setTimeout(() => next(), 1000);
  }

  const isIOS = typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent);

  return (
    <div style={{ minHeight: "calc(100dvh - 140px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "2.5rem" }}>
        {Array.from({ length: TOTAL }).map((_, i) => (
          <div
            key={i}
            style={{
              height: "6px",
              width: i === step ? "2.5rem" : "0.5rem",
              borderRadius: "3px",
              background: i < step ? orange : i === step ? orange : "oklch(82% 0.008 80)",
              transition: "all 0.25s ease",
            }}
          />
        ))}
      </div>

      {/* Step label */}
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: orange, marginBottom: "1.5rem" }}>
        Step {step + 1} of {TOTAL} — {STEP_LABELS[step]}
      </p>

      {/* Step cards */}
      <div style={{ width: "100%", maxWidth: "460px" }}>

        {/* ── Step 0: Password ── */}
        {step === 0 && (
          <div>
            <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.625rem", color: navy, marginBottom: "0.75rem", lineHeight: 1.2 }}>
              Set your password
            </h2>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(52% 0.008 260)", lineHeight: 1.65, marginBottom: "2rem" }}>
              If you joined via an invite link, create a password now so you can always log back in.
            </p>

            {pwSuccess ? (
              <div style={{ background: "oklch(96% 0.04 145)", border: "1px solid oklch(72% 0.12 145)", padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "1.25rem" }}>✓</span>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(32% 0.12 145)", fontWeight: 600, margin: 0 }}>Password saved. Moving on…</p>
              </div>
            ) : (
              <form onSubmit={handlePwSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "1.25rem" }}>
                <div>
                  <label htmlFor="pw-new" style={labelStyle}>New Password *</label>
                  <input id="pw-new" name="password" type="password" required minLength={8} style={inputStyle} placeholder="At least 8 characters" />
                </div>
                <div>
                  <label htmlFor="pw-confirm" style={labelStyle}>Confirm Password *</label>
                  <input id="pw-confirm" name="confirm" type="password" required minLength={8} style={inputStyle} placeholder="Repeat your password" />
                </div>
                {pwError && (
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", color: "oklch(45% 0.12 25)", background: "oklch(97% 0.04 25)", padding: "0.75rem 1rem", borderLeft: "3px solid oklch(55% 0.15 25)", margin: 0 }}>
                    {pwError}
                  </p>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                  <button
                    type="submit"
                    disabled={pwPending}
                    style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", letterSpacing: "0.04em", color: "white", background: pwPending ? "oklch(62% 0.008 260)" : orange, border: "none", padding: "0.875rem 2rem", cursor: pwPending ? "not-allowed" : "pointer" }}
                  >
                    {pwPending ? "Saving…" : "Set Password"}
                  </button>
                  <SkipBtn onClick={next} label="I already have one →" />
                </div>
              </form>
            )}
          </div>
        )}

        {/* ── Step 1: Language ── */}
        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.625rem", color: navy, marginBottom: "0.75rem", lineHeight: 1.2 }}>
              Choose your language
            </h2>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(52% 0.008 260)", lineHeight: 1.65, marginBottom: "2rem" }}>
              This sets how module titles and content are displayed throughout the platform.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem", flexWrap: "wrap" }}>
              {(["en", "id"] as const).map((l) => {
                const label = l === "en" ? "English" : "Indonesia";
                return (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLang(l)}
                    style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", fontWeight: 700, padding: "0.75rem 1.5rem", border: `2px solid ${lang === l ? orange : "oklch(82% 0.008 80)"}`, background: lang === l ? orange : "white", color: lang === l ? "white" : "oklch(42% 0.008 260)", cursor: "pointer", transition: "all 0.15s" }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <PrimaryBtn onClick={next}>Continue →</PrimaryBtn>
          </div>
        )}

        {/* ── Step 2: Privacy & data consent ── */}
        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.625rem", color: navy, marginBottom: "0.75rem", lineHeight: 1.2 }}>
              Your data, your control
            </h2>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(52% 0.008 260)", lineHeight: 1.65, marginBottom: "2rem" }}>
              Crispy Development Ltd stores your name, email, and learning progress to run your membership. Your data is handled per our Privacy Policy and never sold.
            </p>

            <label style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem", cursor: "pointer", marginBottom: "1.5rem", background: "oklch(97% 0.005 80)", border: "1px solid oklch(88% 0.008 80)", padding: "1.125rem 1.25rem" }}>
              <input
                type="checkbox"
                checked={gdprConsent}
                onChange={e => setGdprConsent(e.target.checked)}
                style={{ marginTop: "0.2rem", flexShrink: 0, accentColor: navy, width: "17px", height: "17px" }}
              />
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(32% 0.008 260)", lineHeight: 1.6 }}>
                I have read and agree to the{" "}
                <a href="/terms" target="_blank" rel="noopener" style={{ color: navy, fontWeight: 700, textDecoration: "none" }}>Terms of Service</a>
                {" "}and{" "}
                <a href="/privacy" target="_blank" rel="noopener" style={{ color: navy, fontWeight: 700, textDecoration: "none" }}>Privacy Policy</a>. *
              </span>
            </label>

            <PrimaryBtn onClick={handleGdprContinue} disabled={!gdprConsent || gdprPending}>
              {gdprPending ? "Saving…" : "Continue →"}
            </PrimaryBtn>
          </div>
        )}

        {/* ── Step 3: Install as app ── */}
        {step === 3 && (
          <div>
            <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.625rem", color: navy, marginBottom: "0.75rem", lineHeight: 1.2 }}>
              Add to your home screen
            </h2>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(52% 0.008 260)", lineHeight: 1.65, marginBottom: "2rem" }}>
              Install the app for fast, offline access — no app store needed.
            </p>

            {isInstalled ? (
              <div style={{ background: "oklch(96% 0.04 145)", border: "1px solid oklch(72% 0.12 145)", padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "1.25rem" }}>✓</span>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(32% 0.12 145)", fontWeight: 600, margin: 0 }}>App already installed!</p>
              </div>
            ) : installPrompt ? (
              <div style={{ marginBottom: "1.5rem" }}>
                <PrimaryBtn onClick={handleInstall}>Install App</PrimaryBtn>
              </div>
            ) : isIOS ? (
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ background: "oklch(97% 0.005 80)", border: "1px solid oklch(88% 0.008 80)", padding: "1.25rem", marginBottom: "1.25rem" }}>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "oklch(45% 0.008 260)", margin: "0 0 0.5rem" }}>On iPhone (Safari)</p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", color: "oklch(38% 0.008 260)", lineHeight: 1.7, margin: 0 }}>
                    Tap the <strong>Share</strong> button (square with arrow) → <strong>"Add to Home Screen"</strong>
                  </p>
                </div>
                <PrimaryBtn onClick={next}>I've added it →</PrimaryBtn>
              </div>
            ) : (
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ background: "oklch(97% 0.005 80)", border: "1px solid oklch(88% 0.008 80)", padding: "1.25rem", marginBottom: "1.25rem" }}>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "oklch(45% 0.008 260)", margin: "0 0 0.5rem" }}>On Android (Chrome)</p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", color: "oklch(38% 0.008 260)", lineHeight: 1.7, margin: 0 }}>
                    Tap the <strong>⋮ menu</strong> in the top right → <strong>"Add to Home Screen"</strong>
                  </p>
                </div>
                <PrimaryBtn onClick={next}>I've added it →</PrimaryBtn>
              </div>
            )}

            <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
              {isInstalled && <PrimaryBtn onClick={next}>Continue →</PrimaryBtn>}
              {!isInstalled && <SkipBtn onClick={next} label="Skip for now →" />}
            </div>
          </div>
        )}

        {/* ── Step 4: Notifications ── */}
        {step === 4 && (
          <div>
            <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.625rem", color: navy, marginBottom: "0.75rem", lineHeight: 1.2 }}>
              Stay in the loop
            </h2>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(52% 0.008 260)", lineHeight: 1.65, marginBottom: "2rem" }}>
              Get notified when new modules unlock, your coach replies, or your team progresses.
            </p>

            {notifState === "granted" ? (
              <div style={{ background: "oklch(96% 0.04 145)", border: "1px solid oklch(72% 0.12 145)", padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "1.25rem" }}>✓</span>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(32% 0.12 145)", fontWeight: 600, margin: 0 }}>Notifications enabled!</p>
              </div>
            ) : notifState === "denied" ? (
              <div style={{ background: "oklch(97% 0.005 80)", border: "1px solid oklch(88% 0.008 80)", padding: "1.25rem", marginBottom: "1.5rem" }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", color: "oklch(38% 0.008 260)", lineHeight: 1.7, margin: 0 }}>
                  Notifications are blocked in your browser settings. You can change this in your browser&apos;s site permissions for crispyleaders.com.
                </p>
              </div>
            ) : notifState === "unavailable" ? (
              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", color: "oklch(52% 0.008 260)", margin: 0 }}>
                  Notifications are not available in this browser.
                </p>
              </div>
            ) : (
              <div style={{ marginBottom: "1.5rem" }}>
                <PrimaryBtn onClick={handleNotifications}>Enable Notifications</PrimaryBtn>
              </div>
            )}

            <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
              {(notifState === "granted" || notifState === "denied" || notifState === "unavailable") && (
                <PrimaryBtn onClick={next}>Continue →</PrimaryBtn>
              )}
              {notifState === "idle" && <SkipBtn onClick={next} />}
            </div>
          </div>
        )}

        {/* ── Step 5: All set ── */}
        {step === 5 && (
          <div>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "2rem", marginBottom: "0.75rem" }}>🎉</p>
            <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.625rem", color: navy, marginBottom: "0.75rem", lineHeight: 1.2 }}>
              Welcome, {firstName}.
            </h2>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(52% 0.008 260)", lineHeight: 1.65, marginBottom: "2rem" }}>
              Here&apos;s what&apos;s waiting for you:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2.5rem" }}>
              {[
                { icon: "📚", title: "Resource Library", desc: "Assessments, frameworks, and tools for cross-cultural leaders." },
                { icon: "🧭", title: "Personal Dashboard", desc: "Track your progress, save resources, and see your assessment results." },
                { icon: "🗺️", title: "Your Learning Path", desc: "Work through modules at your own pace and build your leadership toolkit." },
              ].map(({ icon, title, desc }) => (
                <div key={title} style={{ display: "flex", gap: "1rem", padding: "1rem", background: "white", border: "1px solid oklch(90% 0.005 80)" }}>
                  <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>{icon}</span>
                  <div>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: navy, margin: "0 0 0.2rem" }}>{title}</p>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(52% 0.008 260)", margin: 0, lineHeight: 1.55 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <PrimaryBtn onClick={finish} disabled={completing}>
              {completing ? "Setting up…" : "Go to Dashboard →"}
            </PrimaryBtn>
          </div>
        )}
      </div>
    </div>
  );
}
