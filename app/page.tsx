import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* ── HERO ── */}
      <section style={{
        background: "oklch(30% 0.12 260)",
        paddingTop: "clamp(4rem, 8vw, 8rem)",
        paddingBottom: "clamp(4rem, 8vw, 8rem)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Top orange rule */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "3px",
          background: "oklch(65% 0.15 45)",
        }} />

        {/* Decorative concentric arcs — bottom right */}
        <div aria-hidden="true" style={{
          position: "absolute",
          bottom: "-220px",
          right: "-220px",
          width: "640px",
          height: "640px",
          borderRadius: "50%",
          border: "1px solid oklch(97% 0.005 80 / 0.07)",
          pointerEvents: "none",
        }}>
          <div style={{
            position: "absolute",
            top: "80px", left: "80px", right: "80px", bottom: "80px",
            borderRadius: "50%",
            border: "1px solid oklch(97% 0.005 80 / 0.07)",
          }}>
            <div style={{
              position: "absolute",
              top: "80px", left: "80px", right: "80px", bottom: "80px",
              borderRadius: "50%",
              border: "1px solid oklch(65% 0.15 45 / 0.25)",
            }} />
          </div>
        </div>

        {/* Dot grid */}
        <div aria-hidden="true" style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, oklch(97% 0.005 80 / 0.07) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }} />

        <div className="container-wide" style={{ position: "relative" }}>
          <div style={{ maxWidth: "800px" }}>
            <p className="t-label animate-fade-up" style={{
              color: "oklch(65% 0.15 45)",
              marginBottom: "1.75rem",
              fontSize: "0.65rem",
            }}>
              Cross-Cultural Leadership Platform
            </p>

            <h1 className="t-hero animate-fade-up animate-delay-1" style={{
              color: "oklch(97% 0.005 80)",
              marginBottom: "1.5rem",
            }}>
              Lead across<br />cultures.<br />
              <span style={{ color: "oklch(65% 0.15 45)" }}>Grounded<br />in faith.</span>
            </h1>

            <p className="t-tagline animate-fade-up animate-delay-2" style={{
              color: "oklch(78% 0.04 260)",
              marginBottom: "2.75rem",
              maxWidth: "52ch",
            }}>
              Resources, pathways, and community for missionaries, expat leaders,
              and multicultural team managers.
            </p>

            <div className="animate-fade-up animate-delay-3" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/signup?pathway=personal" className="btn-primary">
                Personal Pathway <span style={{ fontSize: "0.9em" }}>→</span>
              </Link>
              <Link href="/signup?pathway=team" className="btn-ghost">
                Team Pathway
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── PATHWAYS ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <div style={{ marginBottom: "3.5rem", maxWidth: "560px" }}>
            <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>
              Two Pathways
            </p>
            <h2 className="t-section">Choose your<br />leadership journey.</h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1px",
            background: "oklch(88% 0.008 80)",
          }}>
            {/* Personal */}
            <div style={{
              background: "oklch(97% 0.005 80)",
              padding: "clamp(2rem, 4vw, 3rem)",
              display: "flex", flexDirection: "column", gap: "2rem",
            }}>
              <div>
                <span className="pathway-badge" style={{ marginBottom: "1.5rem", display: "inline-flex" }}>Personal</span>
                <h3 className="t-card-heading" style={{ marginBottom: "1rem" }}>Grow as a cross-cultural leader.</h3>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7, color: "oklch(42% 0.008 260)", maxWidth: "48ch" }}>
                  A structured pathway for individual leaders navigating life and ministry
                  across cultures. Resources, reflection tools, and a community that
                  understands your world.
                </p>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {["Curated leadership content", "Cross-cultural reflection tools", "Personal progress tracking", "Community discussion access", "8 PDF resources included"].map(item => (
                  <li key={item} style={{ display: "flex", gap: "0.75rem", fontSize: "0.875rem", color: "oklch(38% 0.008 260)", alignItems: "flex-start" }}>
                    <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700, flexShrink: 0, marginTop: "0.1em" }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: "auto" }}>
                <Link href="/personal" className="btn-outline-navy">Explore Personal Pathway</Link>
              </div>
            </div>

            {/* Team */}
            <div style={{
              background: "oklch(30% 0.12 260)",
              padding: "clamp(2rem, 4vw, 3rem)",
              display: "flex", flexDirection: "column", gap: "2rem",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Subtle arc decoration on team card */}
              <div aria-hidden="true" style={{
                position: "absolute",
                bottom: "-80px",
                right: "-80px",
                width: "240px",
                height: "240px",
                borderRadius: "50%",
                border: "1px solid oklch(97% 0.005 80 / 0.08)",
                pointerEvents: "none",
              }}>
                <div style={{
                  position: "absolute",
                  top: "40px", left: "40px", right: "40px", bottom: "40px",
                  borderRadius: "50%",
                  border: "1px solid oklch(65% 0.15 45 / 0.2)",
                }} />
              </div>
              <div style={{ position: "relative" }}>
                <span className="pathway-badge team" style={{ marginBottom: "1.5rem", display: "inline-flex", background: "oklch(97% 0.005 80 / 0.12)", color: "oklch(88% 0.008 80)" }}>Team</span>
                <h3 className="t-card-heading" style={{ color: "oklch(97% 0.005 80)", marginBottom: "1rem" }}>Equip your entire team.</h3>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7, color: "oklch(78% 0.04 260)", maxWidth: "48ch" }}>
                  For team leaders managing cross-cultural groups. Add members, select
                  the content your team needs, and track collective growth in a shared dashboard.
                </p>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem", position: "relative" }}>
                {["Team dashboard with member overview", "Leader-curated content selection", "Invite members via link or email", "Everything in Personal, for your whole team", "Dedicated team discussion space"].map(item => (
                  <li key={item} style={{ display: "flex", gap: "0.75rem", fontSize: "0.875rem", color: "oklch(78% 0.04 260)", alignItems: "flex-start" }}>
                    <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700, flexShrink: 0, marginTop: "0.1em" }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: "auto", position: "relative" }}>
                <Link href="/team" className="btn-primary">Explore Team Pathway <span style={{ fontSize: "0.9em" }}>→</span></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ORANGE RULE DIVIDER ── */}
      <div style={{ height: "3px", background: "oklch(65% 0.15 45)", margin: 0 }} />

      {/* ── FREE RESOURCES ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1.5rem", marginBottom: "3rem" }}>
            <div>
              <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>Free Resources</p>
              <h2 className="t-section" style={{ maxWidth: "380px" }}>Start here.<br />No sign-up required.</h2>
            </div>
            <Link href="/resources" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", color: "oklch(30% 0.12 260)", textDecoration: "none", whiteSpace: "nowrap" }}>
              All resources →
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
            {freeResources.map((r, i) => <ResourceCard key={r.id} resource={r} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section style={{ background: "oklch(22% 0.10 260)", paddingBlock: "3.5rem", position: "relative", overflow: "hidden" }}>
        {/* Subtle background arc */}
        <div aria-hidden="true" style={{
          position: "absolute",
          top: "-120px",
          left: "-120px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          border: "1px solid oklch(97% 0.005 80 / 0.05)",
          pointerEvents: "none",
        }} />
        <div className="container-wide" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2.5rem" }}>
            {[
              { label: "Platform", value: "8 Resources", sub: "Curated for cross-cultural leaders" },
              { label: "Audience", value: "Cross-cultural leaders", sub: "Missionaries, expats, multicultural teams" },
              { label: "Foundation", value: "Faith-rooted", sub: "Grounded in biblical values, globally minded" },
              { label: "Location", value: "Penang, Malaysia", sub: "Built from the field, for the field" },
            ].map(item => (
              <div key={item.label}>
                <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.625rem", fontSize: "0.62rem" }}>{item.label}</p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1.125rem", color: "oklch(97% 0.005 80)", lineHeight: 1.2, marginBottom: "0.375rem" }}>{item.value}</p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(72% 0.04 260)", lineHeight: 1.5 }}>{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(97% 0.005 80)", position: "relative" }}>
        {/* Vertical rule accent */}
        <div style={{
          position: "absolute",
          left: "clamp(1.5rem, 5vw, 4rem)",
          top: "clamp(4rem, 7vw, 7rem)",
          bottom: "clamp(4rem, 7vw, 7rem)",
          width: "3px",
          background: "oklch(65% 0.15 45)",
        }} />
        <div className="container-wide">
          <div style={{ maxWidth: "600px", paddingLeft: "2.5rem" }}>
            <p className="t-tagline" style={{ color: "oklch(65% 0.15 45)", marginBottom: "1.25rem" }}>
              "Leadership that endures is leadership that is grounded."
            </p>
            <h2 className="t-section" style={{ marginBottom: "1.75rem" }}>Ready to start<br />your pathway?</h2>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/signup?pathway=personal" className="btn-primary">Personal Pathway</Link>
              <Link href="/signup?pathway=team" className="btn-outline-navy">Team Pathway</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const freeResources = [
  { id: 1, label: "PDF Resource", title: "The Cross-Cultural Leader's Field Guide", description: "Practical principles for navigating cultural differences in ministry and leadership contexts.", readTime: "12 min read" },
  { id: 2, label: "PDF Resource", title: "Understanding High-Context Cultures", description: "How communication styles shape relationships — and what that means for cross-cultural teams.", readTime: "9 min read" },
  { id: 3, label: "PDF Resource", title: "Identity Under Pressure", description: "Maintaining a grounded sense of self when living and leading between worlds.", readTime: "10 min read" },
];

function ResourceCard({ resource, index }: { resource: typeof freeResources[0]; index: number }) {
  const accentColors = [
    "oklch(65% 0.15 45)",
    "oklch(30% 0.12 260)",
    "oklch(45% 0.09 260)",
  ];
  return (
    <div className="resource-card" style={{ position: "relative", overflow: "hidden" }}>
      {/* Top color accent per card */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "3px",
        background: accentColors[index % accentColors.length],
      }} />
      <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "1rem", fontSize: "0.6rem", marginTop: "0.5rem" }}>{resource.label}</p>
      <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1.0625rem", lineHeight: 1.3, color: "oklch(22% 0.005 260)", marginBottom: "0.75rem" }}>{resource.title}</h3>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.6, color: "oklch(48% 0.008 260)", marginBottom: "1.5rem" }}>{resource.description}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(62% 0.006 260)", fontWeight: 300 }}>{resource.readTime}</span>
        <Link href="/resources" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", color: "oklch(30% 0.12 260)", textDecoration: "none" }}>Download →</Link>
      </div>
    </div>
  );
}
