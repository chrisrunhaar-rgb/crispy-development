"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "@/app/auth/actions";

interface Props {
  firstName: string;
  lastName?: string;
  email: string;
}

export default function AccountMenu({ firstName, lastName, email }: Props) {
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
        style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "oklch(65% 0.15 45)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.65rem", color: "oklch(97% 0.005 80)", letterSpacing: "0.02em" }}>{initials}</span>
        </div>
        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 600, color: "oklch(78% 0.04 260)" }}>{firstName}</span>
        <svg
          width="10" height="6" viewBox="0 0 10 6" fill="none"
          style={{ color: "oklch(52% 0.008 260)", transition: "transform 0.15s", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div style={{ position: "absolute", right: 0, top: "calc(100% + 0.625rem)", background: "oklch(26% 0.11 260)", border: "1px solid oklch(38% 0.06 260)", minWidth: "210px", zIndex: 100, boxShadow: "0 8px 28px oklch(10% 0.05 260 / 0.5)" }}>
          {/* User info */}
          <div style={{ padding: "0.875rem 1rem", borderBottom: "1px solid oklch(38% 0.06 260)" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 700, color: "oklch(97% 0.005 80)", margin: 0 }}>{displayName}</p>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: "oklch(50% 0.008 260)", margin: "0.2rem 0 0" }}>{email}</p>
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

          {/* Subscription — coming soon */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.625rem 1rem", fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(42% 0.008 260)", cursor: "default" }}>
            Subscription
            <span style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(52% 0.008 260)", background: "oklch(30% 0.09 260)", border: "1px solid oklch(42% 0.06 260)", padding: "0.1rem 0.45rem" }}>Soon</span>
          </div>

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
