"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import type { Lang } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";

const LANGUAGES: { code: Lang; flag: string; label: string; available: boolean }[] = [
  { code: "en", flag: "🌐", label: "English", available: true },
  { code: "id", flag: "🇮🇩", label: "Indonesia", available: true },
  { code: "nl", flag: "🇳🇱", label: "Nederlands", available: true },
  { code: "es", flag: "🇪🇸", label: "Español", available: false },
  { code: "fr", flag: "🇫🇷", label: "Français", available: false },
  { code: "pt", flag: "🇵🇹", label: "Português", available: false },
];

export default function Nav({ initialFirstName = null }: { initialFirstName?: string | null }) {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { lang, setLang, t } = useLanguage();
  const [firstName, setFirstName] = useState<string | null>(initialFirstName);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setFirstName(user.user_metadata?.first_name ?? user.email?.split("@")[0] ?? "Me");
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setFirstName(session.user.user_metadata?.first_name ?? session.user.email?.split("@")[0] ?? "Me");
      } else {
        setFirstName(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const currentLang = LANGUAGES.find(l => l.code === lang) ?? LANGUAGES[0];

  return (
    <header style={{
      borderBottom: "1px solid oklch(88% 0.008 80)",
      background: "oklch(97% 0.005 80)",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <div className="container-wide" style={{ paddingBlock: "1.125rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Wordmark */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Image src="/logo-icon.png" alt="Crispy Development" width={36} height={36} style={{ flexShrink: 0 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
              <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.875rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(30% 0.12 260)" }}>
                Crispy
              </span>
              <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 300, fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "oklch(52% 0.008 260)" }}>
                Development
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: "2.5rem" }} className="hidden-mobile">
            <Link href="/personal" className="nav-link">{t.nav.personal}</Link>
            <Link href="/team" className="nav-link">{t.nav.team}</Link>
            <Link href="/peer-groups" className="nav-link">Peer Groups</Link>
            <Link href="/resources" className="nav-link">{t.nav.resources}</Link>
          </nav>

          {/* CTA + language dropdown + mobile toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Language dropdown */}
            <div ref={langRef} style={{ position: "relative" }}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: "oklch(42% 0.008 260)",
                  background: "none",
                  border: "1px solid oklch(82% 0.008 80)",
                  padding: "0.3rem 0.6rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  transition: "border-color 0.15s",
                }}
                aria-label="Select language"
              >
                <span style={{ fontSize: "1rem", lineHeight: 1 }}>{currentLang.flag}</span>
                <span>{currentLang.code.toUpperCase()}</span>
                <span style={{ fontSize: "0.5rem", opacity: 0.5, marginLeft: "0.1rem" }}>▼</span>
              </button>
              {langOpen && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  right: 0,
                  background: "oklch(99% 0.002 80)",
                  border: "1px solid oklch(88% 0.008 80)",
                  boxShadow: "0 8px 24px oklch(30% 0.12 260 / 0.12)",
                  minWidth: "160px",
                  zIndex: 100,
                }}>
                  {LANGUAGES.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { if (l.available) { setLang(l.code); setLangOpen(false); } }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.625rem",
                        width: "100%",
                        padding: "0.625rem 0.875rem",
                        background: l.code === lang ? "oklch(95% 0.006 80)" : "none",
                        border: "none",
                        cursor: l.available ? "pointer" : "default",
                        opacity: l.available ? 1 : 0.45,
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.8rem",
                        fontWeight: l.code === lang ? 700 : 500,
                        color: "oklch(30% 0.12 260)",
                        textAlign: "left",
                        borderBottom: "1px solid oklch(92% 0.004 80)",
                      }}
                    >
                      <span style={{ fontSize: "1rem" }}>{l.flag}</span>
                      <span style={{ flex: 1 }}>{l.label}</span>
                      {!l.available && <span style={{ fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.06em", color: "oklch(65% 0.15 45)", background: "oklch(65% 0.15 45 / 0.1)", padding: "0.1rem 0.35rem" }}>SOON</span>}
                      {l.code === lang && <span style={{ fontSize: "0.65rem", color: "oklch(65% 0.15 45)", fontWeight: 700 }}>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {firstName ? (
              <Link href="/dashboard" className="t-label hidden-mobile" style={{ color: "oklch(52% 0.008 260)", textDecoration: "none", fontSize: "0.7rem" }}>
                {firstName}
              </Link>
            ) : (
              <Link href="/login" className="t-label hidden-mobile" style={{ color: "oklch(52% 0.008 260)", textDecoration: "none", fontSize: "0.7rem" }}>
                {t.nav.login}
              </Link>
            )}
            {firstName ? (
              <Link href="/dashboard" className="btn-primary hidden-mobile" style={{ padding: "0.5rem 1.25rem", fontSize: "0.75rem" }}>
                My Dashboard
              </Link>
            ) : (
              <Link href="/signup" className="btn-primary hidden-mobile" style={{ padding: "0.5rem 1.25rem", fontSize: "0.75rem" }}>
                {t.nav.cta}
              </Link>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className="show-mobile"
              style={{ background: "none", border: "none", cursor: "pointer", padding: "0.5rem", flexDirection: "column", gap: "5px", display: "none" }}
            >
              <span style={{ display: "block", width: "22px", height: "1.5px", background: "oklch(30% 0.12 260)", transition: "all 0.2s", transform: open ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
              <span style={{ display: "block", width: "22px", height: "1.5px", background: "oklch(30% 0.12 260)", opacity: open ? 0 : 1 }} />
              <span style={{ display: "block", width: "22px", height: "1.5px", background: "oklch(30% 0.12 260)", transition: "all 0.2s", transform: open ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <nav style={{ paddingTop: "1.5rem", paddingBottom: "1rem", display: "flex", flexDirection: "column", gap: "0.25rem", borderTop: "1px solid oklch(88% 0.008 80)", marginTop: "1rem" }}>
            <Link href="/personal" onClick={() => setOpen(false)} style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.9rem", letterSpacing: "0.04em", color: "oklch(30% 0.12 260)", textDecoration: "none", padding: "0.625rem 0" }}>
              {t.nav.personalFull}
            </Link>
            <Link href="/team" onClick={() => setOpen(false)} style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.9rem", letterSpacing: "0.04em", color: "oklch(30% 0.12 260)", textDecoration: "none", padding: "0.625rem 0" }}>
              {t.nav.teamFull}
            </Link>
            <Link href="/peer-groups" onClick={() => setOpen(false)} style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.9rem", letterSpacing: "0.04em", color: "oklch(30% 0.12 260)", textDecoration: "none", padding: "0.625rem 0" }}>
              Peer Groups
            </Link>
            <Link href="/resources" onClick={() => setOpen(false)} style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.9rem", letterSpacing: "0.04em", color: "oklch(30% 0.12 260)", textDecoration: "none", padding: "0.625rem 0" }}>
              {t.nav.resources}
            </Link>
            <div style={{ height: "1px", background: "oklch(88% 0.008 80)", margin: "0.75rem 0" }} />
            {firstName ? (
              <Link href="/dashboard" onClick={() => setOpen(false)} style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.9rem", letterSpacing: "0.04em", color: "oklch(30% 0.12 260)", textDecoration: "none", padding: "0.625rem 0" }}>
                {firstName}
              </Link>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)} style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.9rem", letterSpacing: "0.04em", color: "oklch(30% 0.12 260)", textDecoration: "none", padding: "0.625rem 0" }}>
                {t.nav.login}
              </Link>
            )}
            {firstName ? (
              <Link href="/dashboard" className="btn-primary" style={{ marginTop: "0.5rem", justifyContent: "center" }} onClick={() => setOpen(false)}>
                My Dashboard
              </Link>
            ) : (
              <Link href="/signup" className="btn-primary" style={{ marginTop: "0.5rem", justifyContent: "center" }} onClick={() => setOpen(false)}>
                {t.nav.cta}
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
