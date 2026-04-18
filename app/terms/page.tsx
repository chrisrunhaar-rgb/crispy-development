export const metadata = { title: "Terms of Service — Crispy Development" };

export default function TermsPage() {
  return (
    <div style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
      <div className="container-text">
        <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>Legal</p>
        <h1 className="t-section" style={{ marginBottom: "2rem" }}>Terms of Service</h1>
        <div style={{ background: "oklch(88% 0.008 80)", padding: "1.5rem 2rem", marginBottom: "2rem" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(38% 0.008 260)" }}>
            These Terms of Service are currently under review by our legal team. They will be published here before the site goes live.
          </p>
        </div>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(52% 0.008 260)" }}>
          For questions: <a href="mailto:chris@crispydevelopment.com" style={{ color: "oklch(30% 0.12 260)" }}>chris@crispydevelopment.com</a>
        </p>
      </div>
    </div>
  );
}
