import Image from "next/image";
import MembershipForm from "./MembershipForm";

export const metadata = {
  title: "Apply for Membership — Crispy Development",
  description: "Apply to join the Crispy Development platform — a curated community for Christian cross-cultural leaders.",
};

export default function MembershipPage() {
  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "calc(100dvh - 120px)" }}>

      {/* Header */}
      <div style={{
        background: "oklch(30% 0.12 260)",
        paddingBlock: "clamp(2.5rem, 5vw, 4rem)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Orange accent bar */}
        <div style={{
          position: "absolute",
          left: "clamp(1.5rem, 5vw, 4rem)",
          top: 0,
          bottom: 0,
          width: "3px",
          background: "oklch(65% 0.15 45)",
        }} />

        <div className="container-wide" style={{ paddingLeft: "calc(clamp(1.5rem, 5vw, 4rem) + 1.75rem)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1rem" }}>
            <Image src="/logo-icon.png" alt="" width={20} height={20} style={{ filter: "brightness(0) invert(1)", opacity: 0.7, flexShrink: 0 }} />
            <p className="t-label" style={{ color: "oklch(65% 0.15 45)", margin: 0 }}>Membership</p>
          </div>

          <h1 className="t-section" style={{ color: "oklch(97% 0.005 80)", marginBottom: "1rem", maxWidth: "520px" }}>
            Apply to join
          </h1>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            color: "oklch(72% 0.04 260)",
            maxWidth: "50ch",
          }}>
            This platform is for Christian leaders navigating life and leadership across cultures.
            We review every application personally — not everyone will be accepted.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="container-wide" style={{ paddingBlock: "clamp(2.5rem, 5vw, 4rem)", maxWidth: "680px" }}>
        <MembershipForm />
      </div>
    </div>
  );
}
