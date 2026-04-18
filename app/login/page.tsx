import Link from "next/link";

export const metadata = {
  title: "Log In — Crispy Development",
};

export default function LoginPage() {
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
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.75rem" }}>Welcome back</p>
          <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.75rem", color: "oklch(22% 0.005 260)", lineHeight: 1.15, marginBottom: "0.625rem" }}>
            Log in to your account.
          </h1>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(52% 0.008 260)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" style={{ color: "oklch(30% 0.12 260)", fontWeight: 600, textDecoration: "none" }}>
              Sign up free →
            </Link>
          </p>
        </div>

        {/* Form */}
        <form style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="form-field">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              className="form-input"
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-field">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label className="form-label" htmlFor="password">Password</label>
              <Link href="/forgot-password" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(52% 0.008 260)", textDecoration: "none" }}>
                Forgot password?
              </Link>
            </div>
            <input
              className="form-input"
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }}>
            Log In
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBlock: "1.75rem" }}>
          <div style={{ flex: 1, height: "1px", background: "oklch(88% 0.008 80)" }} />
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(62% 0.006 260)", fontWeight: 300 }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "oklch(88% 0.008 80)" }} />
        </div>

        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(62% 0.006 260)", textAlign: "center", lineHeight: 1.6 }}>
          By logging in you agree to our{" "}
          <Link href="/terms" style={{ color: "oklch(42% 0.008 260)", textDecoration: "none" }}>Terms of Service</Link>
          {" "}and{" "}
          <Link href="/privacy" style={{ color: "oklch(42% 0.008 260)", textDecoration: "none" }}>Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
