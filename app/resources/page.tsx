import Link from "next/link";

export const metadata = {
  title: "Resources — Crispy Development",
  description: "Free and premium leadership resources for cross-cultural leaders, missionaries, and multicultural team managers.",
};

export default function ResourcesPage() {
  return (
    <>
      {/* ── HEADER ── */}
      <section style={{
        borderBottom: "1px solid oklch(88% 0.008 80)",
        paddingTop: "clamp(3rem, 5vw, 5rem)",
        paddingBottom: "clamp(2.5rem, 4vw, 4rem)",
        background: "oklch(97% 0.005 80)",
      }}>
        <div className="container-wide">
          <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>Resources</p>
          <h1 className="t-section" style={{ marginBottom: "1rem", maxWidth: "500px" }}>Tools for cross-cultural leadership.</h1>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: "oklch(52% 0.008 260)", maxWidth: "52ch", lineHeight: 1.7 }}>
            Free resources for everyone. Full library access for members.
          </p>
        </div>
      </section>

      {/* ── FREE RESOURCES ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <p className="t-label" style={{ color: "oklch(52% 0.008 260)", marginBottom: "2rem", fontSize: "0.62rem" }}>
            Free — No sign-up required
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "4rem" }}>
            {allResources.filter(r => !r.gated).map(r => (
              <ResourceItem key={r.id} resource={r} />
            ))}
          </div>

          {/* Members section */}
          <div style={{ borderTop: "1px solid oklch(88% 0.008 80)", paddingTop: "3rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1.5rem", marginBottom: "2rem" }}>
              <div>
                <p className="t-label" style={{ color: "oklch(30% 0.12 260)", marginBottom: "0.75rem", fontSize: "0.62rem" }}>Members Only</p>
                <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1.375rem", color: "oklch(22% 0.005 260)" }}>
                  5 more resources in the full library.
                </h2>
              </div>
              <Link href="/signup?pathway=personal" className="btn-primary">
                Unlock All Resources →
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {allResources.filter(r => r.gated).map(r => (
                <ResourceItem key={r.id} resource={r} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ResourceItem({ resource }: { resource: typeof allResources[0] }) {
  return (
    <div className={`resource-card${resource.gated ? " gated" : ""}`} style={{
      opacity: resource.gated ? 0.7 : 1,
    }}>
      <p className="t-label" style={{ color: resource.gated ? "oklch(52% 0.008 260)" : "oklch(65% 0.15 45)", marginBottom: "1rem", fontSize: "0.6rem" }}>
        PDF Resource
      </p>
      <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", lineHeight: 1.3, color: "oklch(22% 0.005 260)", marginBottom: "0.625rem" }}>
        {resource.title}
      </h3>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.6, color: "oklch(48% 0.008 260)", marginBottom: "1.5rem" }}>
        {resource.description}
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(62% 0.006 260)", fontWeight: 300 }}>
          {resource.readTime}
        </span>
        {resource.gated ? (
          <Link href="/signup?pathway=personal" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", color: "oklch(52% 0.008 260)", textDecoration: "none" }}>
            Join to access
          </Link>
        ) : (
          <Link href={`/resources/${resource.id}`} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", color: "oklch(30% 0.12 260)", textDecoration: "none" }}>
            Download →
          </Link>
        )}
      </div>
    </div>
  );
}

const allResources = [
  { id: 1, title: "The Cross-Cultural Leader's Field Guide", description: "Practical principles for navigating cultural differences in ministry and leadership contexts.", readTime: "12 min read", gated: false },
  { id: 2, title: "Understanding High-Context Cultures", description: "How communication styles shape relationships — and what that means for cross-cultural teams.", readTime: "9 min read", gated: false },
  { id: 3, title: "Identity Under Pressure", description: "Maintaining a grounded sense of self when living and leading between worlds.", readTime: "10 min read", gated: false },
  { id: 4, title: "Building Trust Across Cultures", description: "How trust is formed, earned, and lost differently in high- and low-context cultures.", readTime: "11 min read", gated: true },
  { id: 5, title: "Conflict Resolution in Multicultural Teams", description: "Why conflict looks different across cultures — and how to navigate it constructively.", readTime: "14 min read", gated: true },
  { id: 6, title: "The Missionary Re-Entry Guide", description: "Processing the transition back to your home culture after long-term cross-cultural ministry.", readTime: "15 min read", gated: true },
  { id: 7, title: "Leading Without Losing Your Faith", description: "Maintaining spiritual rootedness when leadership demands are high and cultural confusion is real.", readTime: "10 min read", gated: true },
  { id: 8, title: "The Influential Leadership Framework", description: "A systematic approach to leading with influence across cultural boundaries.", readTime: "18 min read", gated: true },
];
