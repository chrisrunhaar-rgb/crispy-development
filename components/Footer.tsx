"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

function IgIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer style={{ borderTop: "1px solid oklch(88% 0.008 80)", background: "oklch(97% 0.005 80)", paddingBlock: "clamp(1.75rem, 4vw, 3rem) clamp(1.25rem, 3vw, 2rem)" }}>
      <style>{`
        .footer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-bottom: 2.5rem; }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr 1fr 1fr; gap: 1.25rem 1rem; margin-bottom: 2rem; }
          .footer-brand { grid-column: 1 / -1; margin-bottom: 0.25rem; }
        }
      `}</style>
      <div className="container-wide">
        <div className="footer-grid">

          {/* Brand column */}
          <div className="footer-brand">
            <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <Image src="/logo-icon.png" alt="Crispy Development" width={28} height={28} style={{ flexShrink: 0 }} />
              <div>
                <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.875rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(30% 0.12 260)", display: "block" }}>Crispy</span>
                <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 300, fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "oklch(52% 0.008 260)", display: "block" }}>Development</span>
              </div>
            </div>
            <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 300, fontSize: "0.95rem", color: "oklch(52% 0.008 260)", maxWidth: "22ch", lineHeight: 1.5 }}>
              {t.footer.tagline}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", marginTop: "1.1rem" }}>
              <a href="https://instagram.com/crispy.dev_" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(52% 0.008 260)", textDecoration: "none" }} className="footer-link">
                <IgIcon />
                @crispy.dev_
              </a>
              <a href="https://instagram.com/crispy.dev_ind" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(52% 0.008 260)", textDecoration: "none" }} className="footer-link">
                <IgIcon />
                @crispy.dev_ind
              </a>
            </div>
          </div>

          {/* Pathways */}
          <div>
            <p className="t-label" style={{ color: "oklch(52% 0.008 260)", marginBottom: "1rem", fontSize: "0.62rem" }}>{t.footer.pathways}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <Link href="/personal" className="footer-link">{t.footer.personal}</Link>
              <Link href="/team" className="footer-link">{t.footer.team}</Link>
              <Link href="/resources" className="footer-link">{t.footer.freeResources}</Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <p className="t-label" style={{ color: "oklch(52% 0.008 260)", marginBottom: "1rem", fontSize: "0.62rem" }}>{t.footer.account}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <Link href="/signup" className="footer-link">{t.footer.getStarted}</Link>
              <Link href="/login" className="footer-link">{t.footer.login}</Link>
              <Link href="/dashboard" className="footer-link">{t.footer.dashboard}</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="t-label" style={{ color: "oklch(52% 0.008 260)", marginBottom: "1rem", fontSize: "0.62rem" }}>{t.footer.legal}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <Link href="/privacy" className="footer-link">{t.footer.privacy}</Link>
              <Link href="/terms" className="footer-link">{t.footer.terms}</Link>
              <Link href="/contact" className="footer-link">{t.footer.contact}</Link>
            </div>
          </div>
        </div>{/* /footer-grid */}

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid oklch(88% 0.008 80)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(62% 0.006 260)" }}>
            © {new Date().getFullYear()} {t.footer.copyright}
          </span>
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", letterSpacing: "0.06em", color: "oklch(72% 0.006 260)" }}>
            crispyleaders.com
          </span>
        </div>
      </div>
    </footer>
  );
}
