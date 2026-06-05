"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import type { Lang } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import AccountMenu from "@/components/AccountMenu";

const LANGUAGES: { code: Lang; flag: string; label: string; available: boolean }[] = [
  { code: "en", flag: "🌐", label: "English", available: true },
  { code: "id", flag: "🇮🇩", label: "Indonesia", available: true },
  { code: "nl", flag: "🇳🇱", label: "Nederlands", available: false },
  { code: "es", flag: "🇪🇸", label: "Español", available: false },
  { code: "fr", flag: "🇫🇷", label: "Français", available: false },
  { code: "pt", flag: "🇵🇹", label: "Português", available: false },
];

export default function Nav({ initialFirstName = null }: { initialFirstName?: string | null }) {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [pathwaysOpen, setPathwaysOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const pathwaysRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [contentLang, setContentLang] = useState<"en" | "id">("en");
  const { lang, setLang, t } = useLanguage();
  const [firstName, setFirstName] = useState<string | null>(initialFirstName);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
      if (pathwaysRef.current && !pathwaysRef.current.contains(e.target as Node)) {
        setPathwaysOpen(false);
      }
      if (resourcesRef.current && !resourcesRef.current.contains(e.target as Node)) {
        setResourcesOpen(false);
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
        setLastName(user.user_metadata?.last_name ?? null);
        setEmail(user.email ?? "");
        setContentLang((user.user_metadata?.language_preference as "en" | "id") ?? "en");
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setFirstName(session.user.user_metadata?.first_name ?? session.user.email?.split("@")[0] ?? "Me");
        setLastName(session.user.user_metadata?.last_name ?? null);
        setEmail(session.user.email ?? "");
        setContentLang((session.user.user_metadata?.language_preference as "en" | "id") ?? "en");
      } else {
        setFirstName(null);
        setLastName(null);
        setEmail("");
        setContentLang("en");
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const pathname = usePathname();

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
          <nav style={{ display: "flex", alignItems: "center", gap: "2rem" }} className="hidden-mobile">

            {/* Pathways dropdown */}
            <div ref={pathwaysRef} style={{ position: "relative" }}>
              <button
                onClick={() => { setPathwaysOpen(o => !o); setResourcesOpen(false); }}
                style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "none", border: "none", borderBottom: (pathname === "/personal" || pathname === "/team") ? "2px solid oklch(65% 0.15 45)" : "2px solid transparent", cursor: "pointer", padding: 0, paddingBottom: "2px", fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.8125rem", letterSpacing: "0.03em", color: (pathname === "/personal" || pathname === "/team") ? "oklch(65% 0.15 45)" : "oklch(30% 0.12 260)" }}
                className="nav-link"
              >
                Pathways
                <span style={{ fontSize: "0.45rem", opacity: 0.5 }}>▼</span>
              </button>
              {pathwaysOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 10px)", left: 0, background: "oklch(99% 0.002 80)", border: "1px solid oklch(88% 0.008 80)", boxShadow: "0 8px 24px oklch(30% 0.12 260 / 0.12)", minWidth: "180px", zIndex: 100 }}>
                  {[
                    { label: "Personal", href: "/personal" },
                    { label: "Team", href: "/team" },
                  ].map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setPathwaysOpen(false)} style={{ display: "block", fontFamily: "var(--font-montserrat)", fontWeight: 500, fontSize: "0.8125rem", color: "oklch(30% 0.12 260)", textDecoration: "none", padding: "0.625rem 1rem", borderBottom: "1px solid oklch(92% 0.004 80)" }}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* WayPoint link */}
            <Link
              href="/waypoint"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.8125rem", letterSpacing: "0.03em", color: pathname === "/waypoint" ? "oklch(65% 0.15 45)" : "oklch(30% 0.12 260)", textDecoration: "none", borderBottom: pathname === "/waypoint" ? "2px solid oklch(65% 0.15 45)" : "2px solid transparent", paddingBottom: "2px" }}
              className="nav-link"
            >
              WayPoint Coaching
            </Link>

            {/* Resources dropdown */}
            <div ref={resourcesRef} style={{ position: "relative" }}>
              <button
                onClick={() => { setResourcesOpen(o => !o); setPathwaysOpen(false); }}
                style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "none", border: "none", borderBottom: (pathname === "/resources" || pathname === "/courses" || pathname === "/articles" || pathname.startsWith("/resources/") || pathname.startsWith("/courses/")) ? "2px solid oklch(65% 0.15 45)" : "2px solid transparent", cursor: "pointer", padding: 0, paddingBottom: "2px", fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.8125rem", letterSpacing: "0.03em", color: (pathname === "/resources" || pathname === "/courses" || pathname === "/articles" || pathname.startsWith("/resources/") || pathname.startsWith("/courses/")) ? "oklch(65% 0.15 45)" : "oklch(30% 0.12 260)" }}
                className="nav-link"
              >
                Resources
                <span style={{ fontSize: "0.45rem", opacity: 0.5 }}>▼</span>
              </button>
              {resourcesOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 10px)", left: 0, background: "oklch(99% 0.002 80)", border: "1px solid oklch(88% 0.008 80)", boxShadow: "0 8px 24px oklch(30% 0.12 260 / 0.12)", minWidth: "180px", zIndex: 100 }}>
                  {[
                    { label: "Training", href: "/resources" },
                    { label: "Courses", href: "/courses" },
                    { label: "Worth Reading", href: "/articles" },
                  ].map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setResourcesOpen(false)} style={{ display: "block", fontFamily: "var(--font-montserrat)", fontWeight: 500, fontSize: "0.8125rem", color: "oklch(30% 0.12 260)", textDecoration: "none", padding: "0.625rem 1rem", borderBottom: "1px solid oklch(92% 0.004 80)" }}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </nav>

          {/* Right section */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>

            {firstName ? (
              /* Logged in: Dashboard button + avatar */
              <>
                <Link href="/dashboard" className="btn-primary hidden-mobile" style={{ padding: "0.5rem 1.25rem", fontSize: "0.75rem" }}>
                  My Dashboard
                </Link>

                {/* Profile avatar with dropdown */}
                <div className="hidden-mobile">
                  <AccountMenu firstName={firstName!} lastName={lastName ?? undefined} email={email} currentLanguage={contentLang} />
                </div>
              </>
            ) : (
              /* Not logged in: lang toggle + login + signup */
              <>
                <div style={{ display: "inline-flex", background: "oklch(22% 0.10 260)", borderRadius: 999, padding: "4px", gap: "2px", boxShadow: "inset 0 1px 3px oklch(10% 0.05 260 / 0.4)" }} className="hidden-mobile">
                  {LANGUAGES.filter(l => l.available).map(l => (
                    <button
                      key={l.code}
                      onClick={() => setLang(l.code)}
                      style={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.62rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        padding: "0.25rem 0.625rem",
                        background: l.code === lang ? "oklch(65% 0.15 45)" : "transparent",
                        color: l.code === lang ? "oklch(97% 0.005 80)" : "oklch(62% 0.06 260)",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: 999,
                        transition: "background 0.15s, color 0.15s",
                      }}
                    >
                      {l.code.toUpperCase()}
                    </button>
                  ))}
                </div>

                <Link href="/login" className="t-label hidden-mobile" style={{ color: "oklch(52% 0.008 260)", textDecoration: "none", fontSize: "0.7rem" }}>
                  {t.nav.login}
                </Link>
                <Link href="/membership" className="btn-primary hidden-mobile" style={{ padding: "0.5rem 1.25rem", fontSize: "0.75rem" }}>
                  {t.nav.cta}
                </Link>
              </>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className="show-mobile"
              style={{ background: "none", border: "none", cursor: "pointer", padding: "0.5rem", flexDirection: "column", gap: "5px" }}
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
            <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", margin: "0 0 0.25rem" }}>Pathways</p>
            <Link href="/personal" onClick={() => setOpen(false)} style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.9rem", letterSpacing: "0.04em", color: "oklch(30% 0.12 260)", textDecoration: "none", padding: "0.5rem 0 0.5rem 0.75rem" }}>
              Personal
            </Link>
            <Link href="/team" onClick={() => setOpen(false)} style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.9rem", letterSpacing: "0.04em", color: "oklch(30% 0.12 260)", textDecoration: "none", padding: "0.5rem 0 0.5rem 0.75rem" }}>
              Team
            </Link>
            <div style={{ height: "1px", background: "oklch(88% 0.008 80)", margin: "0.5rem 0" }} />
            <Link href="/waypoint" onClick={() => setOpen(false)} style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.9rem", letterSpacing: "0.04em", color: "oklch(65% 0.15 45)", textDecoration: "none", padding: "0.5rem 0 0.5rem 0.75rem" }}>
              WayPoint Coaching
            </Link>
            <div style={{ height: "1px", background: "oklch(88% 0.008 80)", margin: "0.5rem 0" }} />
            <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", margin: "0 0 0.25rem" }}>Resources</p>
            <Link href="/resources" onClick={() => setOpen(false)} style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.9rem", letterSpacing: "0.04em", color: "oklch(30% 0.12 260)", textDecoration: "none", padding: "0.5rem 0 0.5rem 0.75rem" }}>
              Training
            </Link>
            <Link href="/courses" onClick={() => setOpen(false)} style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.9rem", letterSpacing: "0.04em", color: "oklch(30% 0.12 260)", textDecoration: "none", padding: "0.5rem 0 0.5rem 0.75rem" }}>
              Courses
            </Link>
            <Link href="/articles" onClick={() => setOpen(false)} style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.9rem", letterSpacing: "0.04em", color: "oklch(30% 0.12 260)", textDecoration: "none", padding: "0.5rem 0 0.5rem 0.75rem" }}>
              Worth Reading
            </Link>
            <div style={{ height: "1px", background: "oklch(88% 0.008 80)", margin: "0.75rem 0" }} />

            {/* Language toggle in mobile menu */}
            <div style={{ paddingBottom: "0.75rem" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", marginBottom: "0.5rem" }}>Language</p>
              <div style={{ display: "inline-flex", background: "oklch(22% 0.10 260)", borderRadius: 999, padding: "4px", gap: "2px", boxShadow: "inset 0 1px 3px oklch(10% 0.05 260 / 0.4)" }}>
                {LANGUAGES.filter(l => l.available).map(l => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setOpen(false); }}
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      padding: "0.3rem 0.75rem",
                      background: l.code === lang ? "oklch(65% 0.15 45)" : "transparent",
                      color: l.code === lang ? "oklch(97% 0.005 80)" : "oklch(62% 0.06 260)",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: 999,
                      transition: "background 0.15s, color 0.15s",
                    }}
                  >
                    {l.code.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {firstName ? (
              <Link href="/dashboard" className="btn-primary" style={{ marginTop: "0.5rem", justifyContent: "center" }} onClick={() => setOpen(false)}>
                My Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.9rem", letterSpacing: "0.04em", color: "oklch(30% 0.12 260)", textDecoration: "none", padding: "0.625rem 0" }}>
                  {t.nav.login}
                </Link>
                <Link href="/membership" className="btn-primary" style={{ marginTop: "0.5rem", justifyContent: "center" }} onClick={() => setOpen(false)}>
                  {t.nav.cta}
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
