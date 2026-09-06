"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useT, type CoachLang } from "../i18n";

type Props = {
  userId: string;
  lang: CoachLang;
  onComplete: () => void;
};

export default function OnboardingIntro({ userId, lang, onComplete }: Props) {
  const t = useT(lang);
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleBegin() {
    if (!agreed) return;
    setSaving(true);
    try {
      await fetch("/api/coach/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          terms_accepted_at: new Date().toISOString(),
        }),
      });
      onComplete();
    } catch {
      setSaving(false);
    }
  }

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "calc(100dvh - 80px)" }}>

      {/* Header */}
      <div style={{
        background: "oklch(18% 0.08 260)",
        paddingBlock: "2.5rem",
        borderBottom: "1px solid oklch(14% 0.06 260)",
      }}>
        <div className="container-wide">
          <Image
            src="/images/waypoint/waypoint-banner-blue.png"
            alt="WayPoint"
            height={32}
            width={0}
            style={{ width: "auto", height: "32px", marginBottom: "1rem" }}
          />
          <h1 style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: "2.25rem",
            color: "white",
            lineHeight: 1.15,
          }}>
            {t.onboardingWelcome}
          </h1>
        </div>
      </div>

      {/* Body */}
      <div className="container-wide" style={{ paddingBlock: "3rem" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2.5rem" }}>

          {/* Section 1 — What is WayPoint? */}
          <section>
            <SectionLabel>{t.onboardingWhatIsLabel}</SectionLabel>
            <p style={bodyText}>
              {t.onboardingWhatIsBody}
            </p>
          </section>

          <Divider />

          {/* Section — The mark */}
          <section style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem", textAlign: "center" }}>
            <Image
              src="/images/waypoint/waypoint-logo-transp.png"
              alt="WayPoint mark"
              width={64}
              height={64}
              style={{ width: "64px", height: "64px" }}
            />
            <div style={{ maxWidth: "400px" }}>
              <SectionLabel>{t.onboardingMarkLabel}</SectionLabel>
              <p style={{ ...bodyText, marginBottom: "0.5rem" }}>
                {t.onboardingMarkCompass}
              </p>
              <p style={{ ...bodyText, marginBottom: "0.75rem" }}>
                {t.onboardingMarkPin}
              </p>
              <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 600, fontSize: "1.1rem", color: "oklch(30% 0.12 260)", margin: 0 }}>
                {t.onboardingMarkTagline}
              </p>
            </div>
          </section>

          <Divider />

          {/* Section 2 — What happens in a session? */}
          <section>
            <SectionLabel>{t.onboardingSessionLabel}</SectionLabel>
            <p style={bodyText}>
              {t.onboardingSessionBody}
            </p>
          </section>

          <Divider />

          {/* Section 3 — What WayPoint is not */}
          <section>
            <SectionLabel>{t.onboardingNotLabel}</SectionLabel>
            <p style={bodyText}>
              {t.onboardingNotBody}
            </p>
          </section>

          <Divider />

          {/* Section 4 — Your privacy */}
          <section>
            <SectionLabel>{t.onboardingPrivacyLabel}</SectionLabel>
            <p style={bodyText}>
              {t.onboardingPrivacyBody}
            </p>
          </section>

          {/* Consent */}
          <div style={{
            background: "oklch(96% 0.006 260)",
            border: "1px solid oklch(88% 0.008 80)",
            padding: "1.75rem",
          }}>
            <label style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.875rem",
              cursor: "pointer",
            }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={{
                  marginTop: "2px",
                  accentColor: "oklch(45% 0.12 260)",
                  width: "16px",
                  height: "16px",
                  flexShrink: 0,
                  cursor: "pointer",
                }}
              />
              <span style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.8125rem",
                color: "oklch(30% 0.008 260)",
                lineHeight: 1.7,
              }}>
                {t.onboardingConsentPart1}{" "}
                <Link
                  href="/coach/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "oklch(45% 0.12 260)",
                    textDecoration: "underline",
                    textUnderlineOffset: "2px",
                  }}
                >
                  {t.onboardingTermsOfUseLabel}
                </Link>
                {" "}{t.onboardingConsentPart2}{" "}
                <Link
                  href="/coach/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "oklch(45% 0.12 260)",
                    textDecoration: "underline",
                    textUnderlineOffset: "2px",
                  }}
                >
                  {t.onboardingConfidentialityLabel}
                </Link>
                {t.onboardingConsentPart3}
              </span>
            </label>
          </div>

          {/* Submit button */}
          <button
            type="button"
            disabled={!agreed || saving}
            onClick={handleBegin}
            style={{
              width: "100%",
              background: !agreed || saving ? "oklch(70% 0.05 260)" : "oklch(30% 0.12 260)",
              color: "white",
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "0.875rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "1.125rem",
              border: "none",
              cursor: !agreed || saving ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {saving ? t.onboardingSaving : t.onboardingBeginBtn}
          </button>

        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "var(--font-montserrat)",
      fontWeight: 700,
      fontSize: "0.65rem",
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "oklch(45% 0.12 260)",
      marginBottom: "0.875rem",
      paddingBottom: "0.5rem",
      borderBottom: "1px solid oklch(88% 0.008 80)",
    }}>
      {children}
    </p>
  );
}

function Divider() {
  return (
    <hr style={{
      border: "none",
      borderTop: "1px solid oklch(90% 0.005 80)",
      margin: 0,
    }} />
  );
}

const bodyText: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.9375rem",
  color: "oklch(30% 0.008 260)",
  lineHeight: 1.8,
  margin: 0,
};
