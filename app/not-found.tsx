import Link from "next/link";

export default function NotFound() {
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
      <div style={{ width: "100%", maxWidth: "420px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>
          404
        </p>
        <h1 style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 600, fontSize: "clamp(2rem, 5vw, 3rem)", color: "oklch(22% 0.005 260)", lineHeight: 1.15, marginBottom: "1rem" }}>
          Page not found.
        </h1>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(52% 0.008 260)", lineHeight: 1.65, marginBottom: "2.5rem" }}>
          This page doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn-primary" style={{ display: "inline-flex" }}>
          Back to home →
        </Link>
      </div>
    </div>
  );
}
