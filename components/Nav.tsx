"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        borderBottom: "1px solid oklch(88% 0.008 80)",
        background: "oklch(97% 0.005 80)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div className="container-wide" style={{ paddingBlock: "1.125rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Wordmark */}
          <Link
            href="/"
            style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <Image src="/logo-icon.png" alt="Crispy Development" width={36} height={36} style={{ flexShrink: 0 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
              <span style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 800,
                fontSize: "0.875rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "oklch(30% 0.12 260)",
              }}>
                Crispy
              </span>
              <span style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 300,
                fontSize: "0.65rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "oklch(52% 0.008 260)",
              }}>
                Development
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: "2.5rem" }} className="hidden-mobile">
            <NavLink href="/personal">Personal</NavLink>
            <NavLink href="/team">Team</NavLink>
            <NavLink href="/resources">Resources</NavLink>
          </nav>

          {/* CTA + mobile toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link href="/login" className="t-label hidden-mobile" style={{
              color: "oklch(52% 0.008 260)",
              textDecoration: "none",
              fontSize: "0.7rem",
            }}>
              Log in
            </Link>
            <Link href="/signup" className="btn-primary hidden-mobile" style={{ padding: "0.5rem 1.25rem", fontSize: "0.75rem" }}>
              Get Started
            </Link>
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.5rem",
                display: "none",
                flexDirection: "column",
                gap: "5px",
              }}
              className="show-mobile"
            >
              <span style={{ display: "block", width: "22px", height: "1.5px", background: "oklch(30% 0.12 260)", transition: "all 0.2s", transform: open ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
              <span style={{ display: "block", width: "22px", height: "1.5px", background: "oklch(30% 0.12 260)", opacity: open ? 0 : 1 }} />
              <span style={{ display: "block", width: "22px", height: "1.5px", background: "oklch(30% 0.12 260)", transition: "all 0.2s", transform: open ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <nav style={{
            paddingTop: "1.5rem",
            paddingBottom: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
            borderTop: "1px solid oklch(88% 0.008 80)",
            marginTop: "1rem",
          }}>
            <MobileNavLink href="/personal" onClick={() => setOpen(false)}>Personal Pathway</MobileNavLink>
            <MobileNavLink href="/team" onClick={() => setOpen(false)}>Team Pathway</MobileNavLink>
            <MobileNavLink href="/resources" onClick={() => setOpen(false)}>Resources</MobileNavLink>
            <div style={{ height: "1px", background: "oklch(88% 0.008 80)", margin: "0.75rem 0" }} />
            <MobileNavLink href="/login" onClick={() => setOpen(false)}>Log in</MobileNavLink>
            <Link href="/signup" className="btn-primary" style={{ marginTop: "0.5rem", justifyContent: "center" }} onClick={() => setOpen(false)}>
              Get Started
            </Link>
          </nav>
        )}
      </div>

    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="nav-link">
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        fontFamily: "var(--font-montserrat)",
        fontWeight: 600,
        fontSize: "0.9rem",
        letterSpacing: "0.04em",
        color: "oklch(30% 0.12 260)",
        textDecoration: "none",
        padding: "0.625rem 0",
      }}
    >
      {children}
    </Link>
  );
}
