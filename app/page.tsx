import Image from "next/image";
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
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />

        {/* Large compass watermark — right side */}
        <div aria-hidden="true" style={{
          position: "absolute",
          right: "-8%",
          top: "50%",
          transform: "translateY(-50%)",
          width: "clamp(280px, 45vw, 560px)",
          aspectRatio: "1",
          pointerEvents: "none",
          opacity: 0.08,
        }}>
          <Image
            src="/logo-icon.png"
            alt=""
            fill
            style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }}
            priority
          />
        </div>

        {/* Dot grid */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, oklch(97% 0.005 80 / 0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }} />

        {/* Concentric arcs — bottom right accent */}
        <div aria-hidden="true" style={{
          position: "absolute", bottom: "-180px", right: "-180px",
          width: "520px", height: "520px", borderRadius: "50%",
          border: "1px solid oklch(97% 0.005 80 / 0.06)", pointerEvents: "none",
        }}>
          <div style={{ position: "absolute", top: "70px", left: "70px", right: "70px", bottom: "70px", borderRadius: "50%", border: "1px solid oklch(97% 0.005 80 / 0.06)" }}>
            <div style={{ position: "absolute", top: "70px", left: "70px", right: "70px", bottom: "70px", borderRadius: "50%", border: "1px solid oklch(65% 0.15 45 / 0.2)" }} />
          </div>
        </div>

        <div className="container-wide" style={{ position: "relative" }}>
          <div style={{ maxWidth: "680px" }}>
            <p className="t-label animate-fade-up" style={{ color: "oklch(65% 0.15 45)", marginBottom: "1.75rem", fontSize: "0.65rem" }}>
              Raising leaders that cross cultures
            </p>

            <h1 className="t-hero animate-fade-up animate-delay-1" style={{ color: "oklch(97% 0.005 80)", marginBottom: "1.5rem" }}>
              Lead across<br />cultures.<br />
              <span style={{ color: "oklch(65% 0.15 45)" }}>Grounded<br />in faith.</span>
            </h1>

            <p className="t-tagline animate-fade-up animate-delay-2" style={{ color: "oklch(78% 0.04 260)", marginBottom: "2.75rem", maxWidth: "52ch" }}>
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
            <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>Two Pathways</p>
            <h2 className="t-section">Choose your<br />leadership journey.</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1px", background: "oklch(88% 0.008 80)" }}>
            {/* Personal */}
            <div style={{ background: "oklch(97% 0.005 80)", padding: "clamp(2rem, 4vw, 3rem)", display: "flex", flexDirection: "column", gap: "2rem" }}>
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
            <div style={{ background: "oklch(30% 0.12 260)", padding: "clamp(2rem, 4vw, 3rem)", display: "flex", flexDirection: "column", gap: "2rem", position: "relative", overflow: "hidden" }}>
              <div aria-hidden="true" style={{ position: "absolute", bottom: "-80px", right: "-80px", width: "240px", height: "240px", borderRadius: "50%", border: "1px solid oklch(97% 0.005 80 / 0.08)", pointerEvents: "none" }}>
                <div style={{ position: "absolute", top: "40px", left: "40px", right: "40px", bottom: "40px", borderRadius: "50%", border: "1px solid oklch(65% 0.15 45 / 0.2)" }} />
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

      {/* ── PLATFORM PREVIEW ── */}
      <section style={{ background: "oklch(22% 0.10 260)", paddingBlock: "clamp(4rem, 6vw, 6rem)", overflow: "hidden" }}>
        <div className="container-wide">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem, 5vw, 5rem)", alignItems: "center" }}>

            {/* Copy */}
            <div>
              <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "1rem", fontSize: "0.62rem" }}>Inside the platform</p>
              <h2 className="t-section" style={{ color: "oklch(97% 0.005 80)", marginBottom: "1.5rem" }}>Your library.<br />Your pace.</h2>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7, color: "oklch(72% 0.04 260)", maxWidth: "44ch", marginBottom: "2rem" }}>
                Eight structured resources, each built for leaders who navigate between cultures every day.
                Track your progress, revisit what matters, and go deeper on your own timeline.
              </p>
              <Link href="/resources" className="btn-primary">Browse Free Resources <span style={{ fontSize: "0.9em" }}>→</span></Link>
            </div>

            {/* Dashboard mockup */}
            <div style={{ position: "relative" }}>
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ── ORANGE RULE DIVIDER ── */}
      <div style={{ height: "3px", background: "oklch(65% 0.15 45)" }} />

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

      {/* ── FINAL CTA ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(97% 0.005 80)", position: "relative" }}>
        <div style={{ position: "absolute", left: "clamp(1.5rem, 5vw, 4rem)", top: "clamp(4rem, 7vw, 7rem)", bottom: "clamp(4rem, 7vw, 7rem)", width: "3px", background: "oklch(65% 0.15 45)" }} />
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

/* ── Dashboard mockup UI ── */
function DashboardMockup() {
  const items = [
    { title: "The Cross-Cultural Leader's Field Guide", done: true },
    { title: "Understanding High-Context Cultures", done: false, active: true },
    { title: "Identity Under Pressure", done: false },
    { title: "Building Trust Across Cultures", done: false },
  ];
  return (
    <div style={{ background: "oklch(97% 0.005 80)", border: "1px solid oklch(52% 0.008 260 / 0.3)", overflow: "hidden", boxShadow: "0 32px 64px oklch(10% 0.08 260 / 0.5)" }}>
      {/* Mockup header */}
      <div style={{ background: "oklch(30% 0.12 260)", padding: "0.875rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.2rem" }}>Personal Pathway</p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 700, color: "oklch(97% 0.005 80)" }}>Your content library</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "oklch(65% 0.15 45)" }} />
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "oklch(52% 0.008 260 / 0.4)" }} />
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "oklch(52% 0.008 260 / 0.2)" }} />
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ padding: "0.75rem 1.25rem", background: "oklch(93% 0.006 80)", borderBottom: "1px solid oklch(88% 0.008 80)", display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ flex: 1, height: "3px", background: "oklch(88% 0.008 80)" }}>
          <div style={{ height: "100%", width: "12.5%", background: "oklch(65% 0.15 45)" }} />
        </div>
        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, color: "oklch(42% 0.008 260)", whiteSpace: "nowrap" }}>1 / 8 completed</span>
      </div>

      {/* Content items */}
      <div>
        {items.map((item, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: "0.875rem",
            padding: "0.75rem 1.25rem",
            borderTop: i === 0 ? "none" : "1px solid oklch(88% 0.008 80)",
            background: item.active ? "oklch(65% 0.15 45 / 0.05)" : "transparent",
          }}>
            <div style={{
              width: "24px", height: "24px", flexShrink: 0,
              background: item.done ? "oklch(65% 0.15 45)" : "oklch(88% 0.008 80)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {item.done
                ? <span style={{ color: "white", fontSize: "0.6rem", fontWeight: 700 }}>✓</span>
                : <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, color: "oklch(62% 0.006 260)" }}>{String(i + 1).padStart(2, "0")}</span>
              }
            </div>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.78rem",
              fontWeight: item.active ? 700 : 500,
              color: item.done ? "oklch(62% 0.006 260)" : "oklch(22% 0.005 260)",
              flex: 1, lineHeight: 1.3,
            }}>
              {item.title}
            </p>
            {item.active && (
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, color: "oklch(65% 0.15 45)", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>Read →</span>
            )}
          </div>
        ))}
        <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid oklch(88% 0.008 80)" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: "oklch(72% 0.006 260)", letterSpacing: "0.06em" }}>+ 4 more resources</p>
        </div>
      </div>
    </div>
  );
}

const freeResources = [
  { id: 1, label: "PDF Resource", title: "The Cross-Cultural Leader's Field Guide", description: "Practical principles for navigating cultural differences in ministry and leadership contexts.", readTime: "12 min read" },
  { id: 2, label: "PDF Resource", title: "Understanding High-Context Cultures", description: "How communication styles shape relationships — and what that means for cross-cultural teams.", readTime: "9 min read" },
  { id: 3, label: "PDF Resource", title: "Identity Under Pressure", description: "Maintaining a grounded sense of self when living and leading between worlds.", readTime: "10 min read" },
];

function ResourceCard({ resource, index }: { resource: typeof freeResources[0]; index: number }) {
  const accents = ["oklch(65% 0.15 45)", "oklch(30% 0.12 260)", "oklch(45% 0.09 260)"];
  return (
    <div className="resource-card" style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: accents[index % accents.length] }} />
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
