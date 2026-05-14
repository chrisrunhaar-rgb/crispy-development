"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
  userId: string;
  onComplete: () => void;
};

export default function OnboardingIntro({ userId, onComplete }: Props) {
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
          <p style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontSize: "1.0625rem",
            color: "oklch(65% 0.15 45)",
            marginBottom: "0.625rem",
          }}>
            WayPoint
          </p>
          <h1 style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: "2.25rem",
            color: "white",
            lineHeight: 1.15,
          }}>
            Welcome to WayPoint.
          </h1>
        </div>
      </div>

      {/* Body */}
      <div className="container-wide" style={{ paddingBlock: "3rem" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2.5rem" }}>

          {/* Section 1 — What is WayPoint? */}
          <section>
            <SectionLabel>What is WayPoint?</SectionLabel>
            <p style={bodyText}>
              WayPoint is a private coaching space — available whenever you need it. Your coach is an AI companion trained in professional coaching methods for people navigating cross-cultural life and work. It&rsquo;s not a chatbot. It listens, asks good questions, and helps you find your own clarity.
            </p>
          </section>

          <Divider />

          {/* Section 2 — What happens in a session? */}
          <section>
            <SectionLabel>What happens in a session?</SectionLabel>
            <p style={bodyText}>
              Sessions are voice-based — you speak, your coach responds. As you talk, notes build automatically: your focus, insights, values, and action steps. After each session, your notes are saved and your coach remembers them next time.
            </p>
          </section>

          <Divider />

          {/* Section 3 — What WayPoint is not */}
          <section>
            <SectionLabel>What WayPoint is not</SectionLabel>
            <p style={bodyText}>
              WayPoint is not therapy, counselling, or a substitute for a pastor, friend, or mental health professional. If you are in crisis, please reach out to a real person you trust.
            </p>
          </section>

          <Divider />

          {/* Section 4 — Your privacy */}
          <section>
            <SectionLabel>Your privacy</SectionLabel>
            <p style={bodyText}>
              Your session transcripts are private to you. If a leader is assigned to you in WayPoint, they can only see session notes you choose to share — never the full conversation. You are always in control.
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
                I understand that WayPoint is a coaching tool, not a mental health service. I agree that my voice will be processed by Google&rsquo;s AI to enable the coaching experience. I have read the{" "}
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
                  confidentiality policy
                </Link>
                .
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
            {saving ? "Saving…" : "Begin my first session →"}
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
