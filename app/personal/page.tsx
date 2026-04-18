import Link from "next/link";

export const metadata = {
  title: "Personal Pathway — Crispy Development",
  description: "A structured pathway for individual cross-cultural leaders. Grow, reflect, and lead with greater clarity.",
};

export default function PersonalPathwayPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section style={{
        background: "oklch(30% 0.12 260)",
        paddingTop: "clamp(4rem, 7vw, 7rem)",
        paddingBottom: "clamp(4rem, 7vw, 7rem)",
        position: "relative",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
        <div className="container-wide">
          <span className="pathway-badge" style={{ background: "oklch(97% 0.005 80 / 0.12)", color: "oklch(88% 0.008 80)", marginBottom: "1.5rem", display: "inline-flex" }}>Personal Pathway</span>
          <h1 className="t-hero" style={{ color: "oklch(97% 0.005 80)", marginBottom: "1.25rem", maxWidth: "14ch" }}>
            Your leadership.<br />
            <span style={{ color: "oklch(65% 0.15 45)" }}>Deepened.</span>
          </h1>
          <p className="t-tagline" style={{ color: "oklch(78% 0.04 260)", maxWidth: "52ch", marginBottom: "2.5rem" }}>
            A structured pathway for individual leaders navigating life, ministry,
            and work across cultures.
          </p>
          <Link href="/signup?pathway=personal" className="btn-primary">
            Start Personal Pathway →
          </Link>
        </div>
      </section>

      {/* ── WHAT IS IT ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(3rem, 6vw, 6rem)", alignItems: "start" }}>
            <div>
              <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>What You Get</p>
              <h2 className="t-section" style={{ marginBottom: "1.5rem" }}>Built for leaders<br />between worlds.</h2>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(42% 0.008 260)", maxWidth: "52ch" }}>
                The Personal Pathway gives you a curated collection of resources,
                reflection tools, and community — all designed for the particular
                challenges of cross-cultural leadership. Not generic leadership advice.
                The real thing.
              </p>
              <p className="t-tagline" style={{ color: "oklch(52% 0.008 260)", marginTop: "1.5rem", fontStyle: "italic" }}>
                "For those who lead in the spaces between cultures — this was made for you."
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {personalFeatures.map((f, i) => (
                <div key={f.title} style={{
                  paddingBlock: "1.5rem",
                  borderTop: i === 0 ? "none" : "1px solid oklch(88% 0.008 80)",
                  display: "flex", gap: "1.5rem", alignItems: "flex-start",
                }}>
                  <span style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 800,
                    fontSize: "1.5rem",
                    color: "oklch(88% 0.008 80)",
                    lineHeight: 1,
                    flexShrink: 0,
                    minWidth: "2.5rem",
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9375rem", color: "oklch(22% 0.005 260)", marginBottom: "0.375rem" }}>{f.title}</h3>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.6, color: "oklch(52% 0.008 260)" }}>{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── PRICING ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>Pricing</p>
          <h2 className="t-section" style={{ marginBottom: "3rem", maxWidth: "400px" }}>Start free.<br />Go deeper when ready.</h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1px",
            background: "oklch(88% 0.008 80)",
            maxWidth: "760px",
          }}>
            {/* Free tier */}
            <div style={{ background: "oklch(97% 0.005 80)", padding: "2rem" }}>
              <p className="t-label" style={{ color: "oklch(52% 0.008 260)", marginBottom: "0.75rem", fontSize: "0.62rem" }}>Free</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "2.5rem", color: "oklch(22% 0.005 260)", lineHeight: 1, marginBottom: "0.375rem" }}>$0</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(52% 0.008 260)", marginBottom: "2rem" }}>Always free</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {["3 free PDF resources", "Browse content library", "Community read access"].map(item => (
                  <li key={item} style={{ display: "flex", gap: "0.625rem", fontSize: "0.875rem", color: "oklch(38% 0.008 260)" }}>
                    <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/signup?pathway=personal&tier=free" className="btn-outline-navy" style={{ width: "100%", justifyContent: "center" }}>
                Start Free
              </Link>
            </div>

            {/* Paid tier */}
            <div style={{ background: "oklch(30% 0.12 260)", padding: "2rem" }}>
              <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.75rem", fontSize: "0.62rem" }}>Member</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "2.5rem", color: "oklch(97% 0.005 80)", lineHeight: 1, marginBottom: "0.375rem" }}>TBD</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(72% 0.04 260)", marginBottom: "2rem" }}>per month</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {["All 8 PDF resources", "Full content library access", "Community participation", "Progress tracking", "New resources as published"].map(item => (
                  <li key={item} style={{ display: "flex", gap: "0.625rem", fontSize: "0.875rem", color: "oklch(78% 0.04 260)" }}>
                    <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/signup?pathway=personal&tier=member" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                Join as Member →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "oklch(22% 0.10 260)", paddingBlock: "4rem" }}>
        <div className="container-wide" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "2rem" }}>
          <div>
            <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1.375rem", color: "oklch(97% 0.005 80)", marginBottom: "0.5rem" }}>Leading a team?</h3>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: "oklch(72% 0.04 260)" }}>The Team Pathway lets you bring your whole team along.</p>
          </div>
          <Link href="/team" className="btn-ghost">Explore Team Pathway</Link>
        </div>
      </section>
    </>
  );
}

const personalFeatures = [
  { title: "Curated Leadership Content", description: "Resources selected specifically for cross-cultural contexts — not generic leadership advice repurposed." },
  { title: "Reflection Tools", description: "Structured prompts and frameworks for processing the unique pressures of leading across cultures." },
  { title: "Progress Tracking", description: "See what you've completed, what's next, and how far you've come in your pathway." },
  { title: "Community Access", description: "Connect with other cross-cultural leaders who understand your context." },
  { title: "8 PDF Resources", description: "A foundational library covering culture, leadership, identity, and faith — yours to keep." },
];
