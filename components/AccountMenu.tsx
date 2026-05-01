"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "@/app/auth/actions";
import PersonalLanguageSelector from "@/components/PersonalLanguageSelector";
import PushNotificationToggle from "@/components/PushNotificationToggle";

interface Props {
  firstName: string;
  lastName?: string;
  email: string;
  currentLanguage?: "en" | "id" | "nl";
}

export default function AccountMenu({ firstName, lastName, email, currentLanguage = "en" }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const initials = [firstName[0], lastName?.[0]].filter(Boolean).join("").toUpperCase() || "?";
  const displayName = lastName ? `${firstName} ${lastName}` : firstName;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display: "flex", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: 0 }}
        aria-label="Profile menu"
      >
        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "oklch(65% 0.15 45)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.65rem", color: "oklch(97% 0.005 80)", letterSpacing: "0.02em" }}>{initials}</span>
        </div>
      </button>

      {open && (
        <div style={{ position: "absolute", right: 0, top: "calc(100% + 0.625rem)", background: "oklch(26% 0.11 260)", border: "1px solid oklch(38% 0.06 260)", minWidth: "230px", zIndex: 100, boxShadow: "0 8px 28px oklch(10% 0.05 260 / 0.5)" }}>
          {/* User info */}
          <div style={{ padding: "0.875rem 1rem", borderBottom: "1px solid oklch(38% 0.06 260)" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 700, color: "oklch(97% 0.005 80)", margin: 0 }}>{displayName}</p>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: "oklch(50% 0.008 260)", margin: "0.2rem 0 0" }}>{email}</p>
          </div>

          {/* Language selector */}
          <div style={{ padding: "0.875rem 1rem", borderBottom: "1px solid oklch(38% 0.06 260)" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(50% 0.008 260)", marginBottom: "0.5rem" }}>Content Language</p>
            <PersonalLanguageSelector currentLanguage={currentLanguage} compact />
          </div>

          {/* Notifications */}
          <div style={{ padding: "0.875rem 1rem", borderBottom: "1px solid oklch(38% 0.06 260)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(72% 0.04 260)", margin: 0 }}>Notifications</p>
            <PushNotificationToggle />
          </div>

          {/* Change password */}
          <a
            href="/account/password"
            onClick={() => setOpen(false)}
            style={{ display: "block", padding: "0.625rem 1rem", fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(72% 0.04 260)", textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.background = "oklch(32% 0.11 260)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            Change password
          </a>

          {/* Sign out */}
          <div style={{ borderTop: "1px solid oklch(38% 0.06 260)", padding: "0.5rem" }}>
            <form action={signOut}>
              <button
                type="submit"
                style={{ width: "100%", textAlign: "left", padding: "0.5rem 0.5rem", fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 600, color: "oklch(65% 0.15 45)", background: "none", border: "none", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.parentElement!.style.background = "oklch(30% 0.11 260)")}
                onMouseLeave={e => (e.currentTarget.parentElement!.style.background = "transparent")}
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
