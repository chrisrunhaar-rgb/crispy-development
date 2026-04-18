"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer style={{ borderTop: "1px solid oklch(88% 0.008 80)", background: "oklch(97% 0.005 80)", paddingBlock: "3rem 2rem" }}>
      <div className="container-wide">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2.5rem", marginBottom: "3rem" }}>

          {/* Brand column */}
          <div style={{ gridColumn: "span 1" }}>
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
            </div>
          </div>
        </div>

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
