import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Crispy Development — Preview",
  robots: { index: false },
};

export default function HomeV2Page() {
  return (
    <>
      {/* ── HERO ── */}
      <section
        style={{
          background: "oklch(22% 0.10 260)",
          paddingTop: "clamp(5.5rem, 11vw, 11rem)",
          paddingBottom: "clamp(5.5rem, 11vw, 11rem)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Orange rule */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />

        {/* Dot grid */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, oklch(97% 0.005 80 / 0.05) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />

        {/* Compass ghost */}
        <div aria-hidden="true" style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: "min(56vw, 640px)", height: "min(56vw, 640px)", mixBlendMode: "screen", opacity: 0.07, pointerEvents: "none" }}>
          <Image src="/logo-icon.png" alt="" fill style={{ objectFit: "contain" }} priority />
        </div>

        <div className="container-wide" style={{ position: "relative" }}>
          <div style={{ maxWidth: "620px" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "2rem" }}>
              Leadership Development Platform
            </p>

            <h1
              style={{
                fontFamily: "var(--font-cormorant)",
                fontStyle: "italic",
                fontSize: "clamp(3.8rem, 7.5vw, 7.5rem)",
                lineHeight: 1.0,
                color: "oklch(97% 0.005 80)",
                marginBottom: "2rem",
                fontWeight: 400,
              }}
            >
              Grow where<br />it&rsquo;s hard.
            </h1>

            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "clamp(0.95rem, 1.8vw, 1.0625rem)", lineHeight: 1.75, color: "oklch(75% 0.04 260)", marginBottom: "2.75rem", maxWidth: "46ch" }}>
              A platform for cross-cultural workers, expat leaders, and multicultural team managers. Built around the realities you actually live in.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              <Link href="/membership" className="btn-primary">
                Apply for membership
              </Link>
              <Link
                href="/resources"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  padding: "0.75rem 1.5rem",
                  border: "1px solid oklch(97% 0.005 80 / 0.22)",
                  color: "oklch(97% 0.005 80)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  letterSpacing: "0.03em",
                }}
              >
                Explore for free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT'S HERE ── */}
      <section style={{ background: "oklch(97% 0.005 80)", paddingBlock: "clamp(4.5rem, 8vw, 8rem)" }}>
        <div className="container-wide">

          <div style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)", maxWidth: "520px" }}>
            <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", lineHeight: 1.15, color: "oklch(22% 0.10 260)", letterSpacing: "-0.02em" }}>
              Everything in one place.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2px", background: "oklch(88% 0.008 80)" }}>

            {/* Resources */}
            <div style={{ background: "oklch(97% 0.005 80)", padding: "clamp(2rem, 4vw, 3rem)" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "1.25rem" }}>
                Resources &amp; Pathways
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontStyle: "italic",
                  fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                  lineHeight: 1.15,
                  color: "oklch(22% 0.10 260)",
                  marginBottom: "1.25rem",
                  fontWeight: 400,
                }}
              >
                Content built<br />for your world.
              </h3>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.75, color: "oklch(42% 0.008 260)", marginBottom: "1.75rem" }}>
                Assessments, frameworks, and leadership resources designed specifically for the pressures of cross-cultural life. Not generic training with a global label on it.
              </p>
              <Link href="/resources" style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem", color: "oklch(65% 0.15 45)", textDecoration: "none", letterSpacing: "0.03em" }}>
                Browse free resources →
              </Link>
            </div>

            {/* Team Leaders */}
            <div style={{ background: "oklch(22% 0.10 260)", padding: "clamp(2rem, 4vw, 3rem)", position: "relative", overflow: "hidden" }}>
              <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, oklch(97% 0.005 80 / 0.04) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
              <div style={{ position: "relative" }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "1.25rem" }}>
                  Team Leaders
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontStyle: "italic",
                    fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                    lineHeight: 1.15,
                    color: "oklch(97% 0.005 80)",
                    marginBottom: "1.25rem",
                    fontWeight: 400,
                  }}
                >
                  Grow your team,<br />not just yourself.
                </h3>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.75, color: "oklch(72% 0.04 260)", marginBottom: "1.75rem" }}>
                  Assign content to your people, track their progress, and build a shared language across cultures. Your team gets a structured development pathway. You get visibility over all of it.
                </p>
                <Link href="/team" style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem", color: "oklch(65% 0.15 45)", textDecoration: "none", letterSpacing: "0.03em" }}>
                  Team Pathway →
                </Link>
              </div>
            </div>

            {/* WayPoint */}
            <div style={{ background: "oklch(18% 0.08 260)", padding: "clamp(2rem, 4vw, 3rem)", position: "relative", overflow: "hidden" }}>
              <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, oklch(97% 0.005 80 / 0.04) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.25rem" }}>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", margin: 0 }}>
                    WayPoint Coach
                  </p>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: "oklch(65% 0.15 45)", color: "white", padding: "0.18rem 0.4rem" }}>
                    BETA
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontStyle: "italic",
                    fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                    lineHeight: 1.15,
                    color: "oklch(97% 0.005 80)",
                    marginBottom: "1.25rem",
                    fontWeight: 400,
                  }}
                >
                  A private space<br />to think out loud.
                </h3>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.75, color: "oklch(68% 0.04 260)", marginBottom: "1.75rem" }}>
                  A voice coaching conversation whenever you need one. It does not give advice. It asks the right questions and helps you find your own clarity. Confidential. Free during the beta period.
                </p>
                <Link href="/waypoint" style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem", color: "oklch(65% 0.15 45)", textDecoration: "none", letterSpacing: "0.03em" }}>
                  Try WayPoint →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section
        style={{
          background: "oklch(22% 0.10 260)",
          paddingBlock: "clamp(5rem, 9vw, 9rem)",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />

        {/* Concentric arcs */}
        {[560, 480, 400].map((size) => (
          <div key={size} aria-hidden="true" style={{ position: "absolute", bottom: `-${size / 2 + 20}px`, left: "50%", transform: "translateX(-50%)", width: `${size}px`, height: `${size}px`, borderRadius: "50%", border: "1px solid oklch(97% 0.005 80 / 0.06)", pointerEvents: "none" }} />
        ))}

        <div className="container-wide" style={{ position: "relative" }}>
          <div style={{ maxWidth: "580px", margin: "0 auto" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "2rem" }}>
              Membership
            </p>

            <h2
              style={{
                fontFamily: "var(--font-cormorant)",
                fontStyle: "italic",
                fontSize: "clamp(3rem, 6vw, 5.5rem)",
                lineHeight: 1.0,
                color: "oklch(97% 0.005 80)",
                marginBottom: "1.75rem",
                fontWeight: 400,
              }}
            >
              Ready to start?
            </h2>

            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(72% 0.04 260)", marginBottom: "2.5rem", maxWidth: "42ch", marginLeft: "auto", marginRight: "auto" }}>
              Free during early access. Every application reviewed personally.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem", marginBottom: "2rem" }}>
              <Link href="/membership" className="btn-primary">
                Apply for membership →
              </Link>
              <Link
                href="/resources"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  padding: "0.75rem 1.5rem",
                  border: "1px solid oklch(97% 0.005 80 / 0.22)",
                  color: "oklch(97% 0.005 80)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  letterSpacing: "0.03em",
                }}
              >
                Explore for free
              </Link>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <Image src="/logo-icon.png" alt="" width={22} height={22} style={{ opacity: 0.4, filter: "brightness(0) saturate(100%) invert(55%) sepia(70%) saturate(500%) hue-rotate(10deg)" }} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
