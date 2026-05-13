import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Worth Reading | Crispy Development",
  description: "Articles from the web worth reading — handpicked for cross-cultural leaders navigating life and work across cultures.",
};

export default function ArticlesPage() {
  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "100vh" }}>
      {/* ── PAGE HEADER ── */}
      <section style={{ background: "oklch(30% 0.12 260)", paddingTop: "clamp(4rem, 7vw, 7rem)", paddingBottom: "clamp(4rem, 7vw, 7rem)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "url('/pathway-articles.jpg')", backgroundSize: "cover", backgroundPosition: "center 40%", opacity: 0.22, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />

        <div className="container-wide" style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1rem" }}>
            <img src="/logo-icon.png" alt="" width={22} height={22} style={{ filter: "brightness(0) invert(1)", opacity: 0.75, flexShrink: 0 }} />
            <p className="t-label" style={{ color: "oklch(65% 0.15 45)", margin: 0 }}>From the Web</p>
          </div>

          <h1 className="t-section" style={{ marginBottom: "1rem", maxWidth: "560px", color: "oklch(97% 0.005 80)" }}>
            Worth<br />Reading.
          </h1>

          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: "oklch(72% 0.04 260)", maxWidth: "52ch", lineHeight: 1.7 }}>
            The best writing on cross-cultural leadership, faith in the workplace, and leading across difference — handpicked from the web.
          </p>
        </div>
      </section>

      {/* ── PLACEHOLDER ── */}
      <section style={{ padding: "clamp(4rem, 8vw, 7rem) 0" }}>
        <div className="container-wide" style={{ maxWidth: "720px" }}>
          <p style={{
            fontFamily: "var(--font-cormorant)", fontStyle: "italic",
            fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)", lineHeight: 1.6,
            color: "oklch(52% 0.008 260)",
          }}>
            Articles coming soon. Check back here for a growing collection of links to great writing on cross-cultural leadership.
          </p>
        </div>
      </section>
    </div>
  );
}
