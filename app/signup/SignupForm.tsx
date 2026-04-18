"use client";

import { useState } from "react";
import Link from "next/link";

type Pathway = "personal" | "team";

export default function SignupForm({ defaultPathway = "personal" }: { defaultPathway?: Pathway }) {
  const [pathway, setPathway] = useState<Pathway>(defaultPathway);

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

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.75rem" }}>Create account</p>
          <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.75rem", color: "oklch(22% 0.005 260)", lineHeight: 1.15, marginBottom: "0.625rem" }}>
            Start your pathway.
          </h1>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(52% 0.008 260)" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "oklch(30% 0.12 260)", fontWeight: 600, textDecoration: "none" }}>
              Log in →
            </Link>
          </p>
        </div>

        {/* Pathway selection */}
        <div style={{ marginBottom: "2rem" }}>
          <p className="form-label" style={{ marginBottom: "0.75rem" }}>Choose your pathway</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <label
              className={`pathway-option${pathway === "personal" ? " selected" : ""}`}
              style={{ cursor: "pointer" }}
              onClick={() => setPathway("personal")}
            >
              <input
                type="radio"
                name="pathway"
                value="personal"
                checked={pathway === "personal"}
                onChange={() => setPathway("personal")}
                style={{ marginTop: "0.125rem", accentColor: "oklch(30% 0.12 260)", flexShrink: 0 }}
              />
              <div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9375rem", color: "oklch(22% 0.005 260)", marginBottom: "0.25rem" }}>
                  Personal Pathway
                </p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(52% 0.008 260)", lineHeight: 1.5 }}>
                  Individual access — grow as a cross-cultural leader at your own pace.
                </p>
              </div>
            </label>
            <label
              className={`pathway-option${pathway === "team" ? " selected" : ""}`}
              style={{ cursor: "pointer" }}
              onClick={() => setPathway("team")}
            >
              <input
                type="radio"
                name="pathway"
                value="team"
                checked={pathway === "team"}
                onChange={() => setPathway("team")}
                style={{ marginTop: "0.125rem", accentColor: "oklch(30% 0.12 260)", flexShrink: 0 }}
              />
              <div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9375rem", color: "oklch(22% 0.005 260)", marginBottom: "0.25rem" }}>
                  Team Pathway
                </p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(52% 0.008 260)", lineHeight: 1.5 }}>
                  For team leaders — manage members, select content, and grow together.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Form */}
        <form style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <input type="hidden" name="pathway" value={pathway} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-field">
              <label className="form-label" htmlFor="first-name">First name</label>
              <input className="form-input" type="text" id="first-name" name="firstName" placeholder="Chris" autoComplete="given-name" required />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="last-name">Last name</label>
              <input className="form-input" type="text" id="last-name" name="lastName" placeholder="Runhaar" autoComplete="family-name" required />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="email">Email</label>
            <input className="form-input" type="email" id="email" name="email" placeholder="you@example.com" autoComplete="email" required />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="password">Password</label>
            <input className="form-input" type="password" id="password" name="password" placeholder="Minimum 8 characters" autoComplete="new-password" minLength={8} required />
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }}>
            Create Account →
          </button>
        </form>

        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(62% 0.006 260)", marginTop: "1.5rem", textAlign: "center", lineHeight: 1.6 }}>
          By creating an account you agree to our{" "}
          <Link href="/terms" style={{ color: "oklch(42% 0.008 260)", textDecoration: "none" }}>Terms of Service</Link>
          {" "}and{" "}
          <Link href="/privacy" style={{ color: "oklch(42% 0.008 260)", textDecoration: "none" }}>Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
