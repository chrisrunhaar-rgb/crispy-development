export const metadata = {
  title: "Check Your Email — Crispy Development",
};

export default function ConfirmPage() {
  return (
    <div style={{
      minHeight: "calc(100dvh - 120px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      paddingBlock: "4rem",
      paddingInline: "1.5rem",
      background: "oklch(97% 0.005 80)",
    }}>
      <div style={{ width: "100%", maxWidth: "440px", textAlign: "center" }}>
        <div style={{ width: "56px", height: "56px", background: "oklch(65% 0.15 45 / 0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
          <span style={{ fontSize: "1.5rem" }}>✉</span>
        </div>
        <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.75rem" }}>Almost there</p>
        <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.75rem", color: "oklch(22% 0.005 260)", lineHeight: 1.15, marginBottom: "1rem" }}>
          Check your email.
        </h1>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7, color: "oklch(48% 0.008 260)", marginBottom: "2rem" }}>
          We sent a confirmation link to your email address. Click it to activate your account, then come back to log in.
        </p>
        <a href="/login" className="btn-primary" style={{ display: "inline-flex", justifyContent: "center" }}>
          Go to Log In
        </a>
      </div>
    </div>
  );
}
