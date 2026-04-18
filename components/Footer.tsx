import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid oklch(88% 0.008 80)",
      background: "oklch(97% 0.005 80)",
      paddingBlock: "3rem 2rem",
    }}>
      <div className="container-wide">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "2.5rem",
          marginBottom: "3rem",
        }}>

          {/* Brand column */}
          <div style={{ gridColumn: "span 1" }}>
            <div style={{ marginBottom: "1rem" }}>
              <span style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 800,
                fontSize: "0.875rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "oklch(30% 0.12 260)",
                display: "block",
              }}>Crispy</span>
              <span style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 300,
                fontSize: "0.65rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "oklch(52% 0.008 260)",
                display: "block",
              }}>Development</span>
            </div>
            <p style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "0.95rem",
              color: "oklch(52% 0.008 260)",
              maxWidth: "22ch",
              lineHeight: 1.5,
            }}>
              Cross-Cultural Leadership.<br />Grounded in Faith.
            </p>
          </div>

          {/* Pathways */}
          <div>
            <p className="t-label" style={{ color: "oklch(52% 0.008 260)", marginBottom: "1rem", fontSize: "0.62rem" }}>Pathways</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <FooterLink href="/personal">Personal Pathway</FooterLink>
              <FooterLink href="/team">Team Pathway</FooterLink>
              <FooterLink href="/resources">Free Resources</FooterLink>
            </div>
          </div>

          {/* Account */}
          <div>
            <p className="t-label" style={{ color: "oklch(52% 0.008 260)", marginBottom: "1rem", fontSize: "0.62rem" }}>Account</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <FooterLink href="/signup">Get Started</FooterLink>
              <FooterLink href="/login">Log In</FooterLink>
              <FooterLink href="/dashboard">Dashboard</FooterLink>
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="t-label" style={{ color: "oklch(52% 0.008 260)", marginBottom: "1rem", fontSize: "0.62rem" }}>Legal</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid oklch(88% 0.008 80)",
          paddingTop: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}>
          <span style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.75rem",
            color: "oklch(62% 0.006 260)",
          }}>
            © {new Date().getFullYear()} Crispy Development. All rights reserved.
          </span>
          <span style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.7rem",
            letterSpacing: "0.06em",
            color: "oklch(72% 0.006 260)",
          }}>
            crispyleaders.com
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="footer-link">
      {children}
    </Link>
  );
}
