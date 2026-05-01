import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Application Received — Crispy Development",
};

export default function ApplicationReceivedPage() {
  return (
    <div style={{
      minHeight: "calc(100dvh - 120px)",
      background: "oklch(30% 0.12 260)",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      paddingBlock: "clamp(4rem, 8vw, 7rem)",
      paddingInline: "1.5rem",
    }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <Image src="/logo-icon-dark-badge.png" alt="Crispy Development" width={40} height={40} />
        </div>

        <div style={{ width: "3px", height: "36px", background: "oklch(65% 0.15 45)", marginBottom: "1.75rem" }} />

        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "oklch(65% 0.15 45)",
          marginBottom: "0.875rem",
        }}>
          Application Received
        </p>

        <h1 style={{
          fontFamily: "var(--font-montserrat)",
          fontWeight: 800,
          fontSize: "clamp(1.75rem, 5vw, 2.25rem)",
          color: "oklch(97% 0.005 80)",
          lineHeight: 1.1,
          marginBottom: "1.25rem",
        }}>
          Thank you for applying.
        </h1>

        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.9375rem",
          lineHeight: 1.75,
          color: "oklch(72% 0.04 260)",
          marginBottom: "2.5rem",
          maxWidth: "42ch",
        }}>
          Chris reviews every application personally. You&apos;ll hear back within a few days.
          If accepted, you&apos;ll receive a link to create your account and access the full platform.
        </p>

        <Link
          href="/resources"
          style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "oklch(72% 0.04 260)",
            textDecoration: "none",
          }}
        >
          ← Browse free resources while you wait
        </Link>
      </div>
    </div>
  );
}
