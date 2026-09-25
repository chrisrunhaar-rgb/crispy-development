"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import PersonalLanguageSelector from "@/components/PersonalLanguageSelector";
import PushNotificationToggle from "@/components/PushNotificationToggle";

/* Light panel everywhere the menu appears (site nav, dashboard header, account pages). */
const PANEL = {
  bg: "oklch(99% 0.003 80)",
  head: "oklch(95.5% 0.008 80)",
  rule: "oklch(88% 0.008 80)",
  hover: "oklch(94% 0.01 80)",
  navy: "oklch(30% 0.12 260)",
  body: "oklch(38% 0.007 260)",
  muted: "oklch(48% 0.04 260)",
  orange: "oklch(65% 0.15 45)",
};
const SANS = "var(--font-montserrat)";

const LINKS = [
  { href: "/account/subscription", en: "Subscription", id: "Langganan" },
  { href: "/account", en: "Account settings", id: "Pengaturan akun" },
  { href: "/account/password", en: "Change password", id: "Ubah kata sandi" },
];

interface Props {
  firstName: string;
  lastName?: string;
  email: string;
  currentLanguage?: "en" | "id";
  pathway?: string;
  /** Set when the trigger button sits on a light background instead of the navy dashboard header. */
  onLight?: boolean;
}

export default function AccountMenu({ firstName, lastName, email, currentLanguage = "en", pathway, onLight = false }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const initials = [firstName[0], lastName?.[0]].filter(Boolean).join("").toUpperCase() || "?";
  const displayName = lastName ? `${firstName} ${lastName}` : firstName;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: onLight ? "oklch(30% 0.12 260 / 0.06)" : "oklch(97% 0.005 80 / 0.08)", border: onLight ? "1px solid oklch(30% 0.12 260 / 0.2)" : "1px solid oklch(97% 0.005 80 / 0.18)", borderRadius: "999px", cursor: "pointer", padding: "3px 0.875rem 3px 3px" }}
        aria-label="Profile menu"
        aria-expanded={open}
      >
        <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "oklch(65% 0.15 45)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: "0.65rem", color: "oklch(97% 0.005 80)", letterSpacing: "0.02em" }}>{initials}</span>
        </div>
        <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.04em", color: onLight ? "oklch(30% 0.12 260)" : "oklch(97% 0.005 80)", whiteSpace: "nowrap" }}>
          {currentLanguage === "id" ? "Profil Saya" : "My Profile"} <span aria-hidden style={{ fontSize: "0.6rem", opacity: 0.7 }}>▾</span>
        </span>
      </button>

      {open && (
        <div style={{ position: "absolute", right: 0, top: "calc(100% + 0.625rem)", background: PANEL.bg, border: `1px solid ${PANEL.rule}`, borderRadius: 6, overflow: "hidden", minWidth: "240px", zIndex: 100, boxShadow: "0 18px 40px -18px oklch(30% 0.12 260 / 0.35), 0 2px 6px oklch(30% 0.12 260 / 0.06)" }}>
          {/* User info */}
          <div style={{ padding: "0.875rem 1rem", borderBottom: `1px solid ${PANEL.rule}`, background: PANEL.head }}>
            <p style={{ fontFamily: SANS, fontSize: "0.8rem", fontWeight: 700, color: PANEL.navy, margin: 0 }}>{displayName}</p>
            <p style={{ fontFamily: SANS, fontSize: "0.7rem", color: PANEL.muted, margin: "0.2rem 0 0", wordBreak: "break-all" }}>{email}</p>
            {pathway && pathway !== "free" && (
              <span style={{ display: "inline-block", marginTop: "0.45rem", fontFamily: SANS, fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.2rem 0.5rem", borderRadius: 2, background: pathway === "team" ? "oklch(65% 0.15 45 / 0.12)" : "oklch(30% 0.12 260 / 0.08)", color: pathway === "team" ? "oklch(50% 0.15 45)" : PANEL.navy, border: `1px solid ${pathway === "team" ? "oklch(65% 0.15 45 / 0.35)" : "oklch(30% 0.12 260 / 0.2)"}` }}>
                {pathway === "team" ? "Team" : "Personal"}
              </span>
            )}
          </div>

          {/* Language selector */}
          <div style={{ padding: "0.875rem 1rem", borderBottom: `1px solid ${PANEL.rule}` }}>
            <p style={{ fontFamily: SANS, fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: PANEL.muted, marginBottom: "0.5rem" }}>Content Language</p>
            <PersonalLanguageSelector currentLanguage={currentLanguage} compact onLight />
          </div>

          {/* Notifications */}
          <div style={{ padding: "0.875rem 1rem", borderBottom: `1px solid ${PANEL.rule}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontFamily: SANS, fontSize: "0.8rem", color: PANEL.body, margin: 0 }}>Notifications</p>
            <PushNotificationToggle />
          </div>

          {/* Account pages */}
          <div style={{ padding: "0.375rem 0" }}>
            {LINKS.map(link => {
              const active = pathname === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  style={{ display: "block", padding: "0.625rem 1rem 0.625rem calc(1rem - 2px)", fontFamily: SANS, fontSize: "0.8rem", fontWeight: active ? 700 : 500, color: PANEL.navy, textDecoration: "none", borderLeft: `2px solid ${active ? PANEL.orange : "transparent"}`, background: active ? PANEL.hover : "transparent" }}
                  onMouseEnter={e => (e.currentTarget.style.background = PANEL.hover)}
                  onMouseLeave={e => (e.currentTarget.style.background = active ? PANEL.hover : "transparent")}
                >
                  {currentLanguage === "id" ? link.id : link.en}
                </a>
              );
            })}
          </div>

          {/* Sign out */}
          <div style={{ borderTop: `1px solid ${PANEL.rule}`, padding: "0.375rem" }}>
            <form action={signOut}>
              <button
                type="submit"
                style={{ width: "100%", textAlign: "left", padding: "0.5rem 0.625rem", fontFamily: SANS, fontSize: "0.8rem", fontWeight: 700, color: "oklch(52% 0.15 45)", background: "none", border: "none", borderRadius: 4, cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background = PANEL.hover)}
                onMouseLeave={e => (e.currentTarget.style.background = "none")}
              >
                {currentLanguage === "id" ? "Keluar" : "Sign out"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
