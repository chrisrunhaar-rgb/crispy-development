import Link from "next/link";

export const metadata = {
  title: "Team Pathway — Crispy Development",
  description: "Equip your entire cross-cultural team. A shared dashboard, member management, and curated content — all in one place.",
};

export default function TeamPathwayPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section style={{
        background: "oklch(22% 0.10 260)",
        paddingTop: "clamp(4rem, 7vw, 7rem)",
        paddingBottom: "clamp(4rem, 7vw, 7rem)",
        position: "relative",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
        <div className="container-wide">
          <span className="pathway-badge team" style={{ background: "oklch(97% 0.005 80 / 0.1)", color: "oklch(88% 0.008 80)", marginBottom: "1.5rem", display: "inline-flex" }}>Team Pathway</span>
          <h1 className="t-hero" style={{ color: "oklch(97% 0.005 80)", marginBottom: "1.25rem", maxWidth: "14ch" }}>
            One team.<br />One direction.<br />
            <span style={{ color: "oklch(65% 0.15 45)" }}>Growing together.</span>
          </h1>
          <p className="t-tagline" style={{ color: "oklch(78% 0.04 260)", maxWidth: "52ch", marginBottom: "2.5rem" }}>
            For team leaders managing cross-cultural groups. Add members, select
            content, and track collective growth in a shared team dashboard.
          </p>
          <Link href="/signup?pathway=team" className="btn-primary">
            Set Up Your Team →
          </Link>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>How It Works</p>
          <h2 className="t-section" style={{ marginBottom: "3.5rem", maxWidth: "420px" }}>Three steps to equip your team.</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1px", background: "oklch(88% 0.008 80)" }}>
            {[
              { step: "01", title: "Create your team", description: "Sign up as a team leader. Name your team and set it up in under two minutes." },
              { step: "02", title: "Add members", description: "Invite team members via email or share a link. They create their own accounts and join your team." },
              { step: "03", title: "Select content", description: "Browse the content library and choose what your team needs. Members see exactly what you've selected." },
            ].map(item => (
              <div key={item.step} style={{ background: "oklch(97% 0.005 80)", padding: "2.5rem 2rem" }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "3rem", color: "oklch(92% 0.005 260)", lineHeight: 1, marginBottom: "1.5rem" }}>{item.step}</p>
                <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1.0625rem", color: "oklch(22% 0.005 260)", marginBottom: "0.625rem" }}>{item.title}</h3>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.65, color: "oklch(48% 0.008 260)" }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── DASHBOARD PREVIEW ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(3rem, 6vw, 6rem)", alignItems: "start" }}>
            <div>
              <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>Team Dashboard</p>
              <h2 className="t-section" style={{ marginBottom: "1.5rem" }}>Everything you<br />need, in one place.</h2>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(42% 0.008 260)", maxWidth: "48ch", marginBottom: "2rem" }}>
                Your team dashboard shows you who's in your team, what content
                you've selected for them, and how the group is engaging. No
                complexity — just clarity.
              </p>
              <Link href="/signup?pathway=team" className="btn-primary">
                Create Your Team →
              </Link>
            </div>

            {/* Mock dashboard preview */}
            <div style={{
              background: "oklch(30% 0.12 260)",
              padding: "1.5rem",
              fontFamily: "var(--font-montserrat)",
            }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "1.25rem" }}>Team Dashboard</p>
              <h4 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "oklch(97% 0.005 80)", marginBottom: "1.5rem" }}>Your Team Name</h4>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "oklch(97% 0.005 80 / 0.1)", marginBottom: "1.5rem" }}>
                {[{ n: "4", label: "Members" }, { n: "3", label: "Content items" }].map(s => (
                  <div key={s.label} style={{ background: "oklch(30% 0.12 260)", padding: "1rem" }}>
                    <p style={{ fontWeight: 800, fontSize: "1.75rem", color: "oklch(97% 0.005 80)", lineHeight: 1 }}>{s.n}</p>
                    <p style={{ fontSize: "0.75rem", color: "oklch(72% 0.04 260)", marginTop: "0.25rem" }}>{s.label}</p>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(72% 0.04 260)", marginBottom: "0.75rem" }}>Members</p>
              {["Maria S.", "James K.", "Priya M.", "David L."].map(name => (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingBlock: "0.5rem", borderBottom: "1px solid oklch(97% 0.005 80 / 0.06)" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "oklch(65% 0.15 45 / 0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, color: "oklch(65% 0.15 45)" }}>
                    {name[0]}
                  </div>
                  <span style={{ fontSize: "0.875rem", color: "oklch(88% 0.008 80)" }}>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ paddingBlock: "clamp(4rem, 6vw, 6rem)", background: "oklch(30% 0.12 260)" }}>
        <div className="container-wide">
          <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>What's Included</p>
          <h2 className="t-section" style={{ color: "oklch(97% 0.005 80)", marginBottom: "3rem", maxWidth: "420px" }}>Everything in Personal,<br />plus team tools.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem 3rem" }}>
            {teamFeatures.map(f => (
              <div key={f.title}>
                <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9375rem", color: "oklch(97% 0.005 80)", marginBottom: "0.5rem" }}>{f.title}</h3>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.65, color: "oklch(72% 0.04 260)" }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>Pricing</p>
          <h2 className="t-section" style={{ marginBottom: "0.75rem" }}>Team pricing.</h2>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: "oklch(52% 0.008 260)", marginBottom: "3rem", maxWidth: "48ch" }}>
            Pricing for teams is being finalised. Join the waitlist and we'll notify you
            when the Team Pathway launches.
          </p>
          <Link href="/signup?pathway=team" className="btn-primary">
            Join Team Waitlist →
          </Link>
        </div>
      </section>
    </>
  );
}

const teamFeatures = [
  { title: "Team Dashboard", description: "A shared view of your team — members, selected content, and group activity." },
  { title: "Member Management", description: "Invite team members via email or shareable link. Remove or manage access at any time." },
  { title: "Content Selection", description: "Browse the full content library and choose what your team sees. You're in control." },
  { title: "Personal Pathway Included", description: "Every team member also gets full access to the Personal Pathway features." },
  { title: "Team Discussion Space", description: "A dedicated space for your team to discuss content and share insights." },
  { title: "Leader Tools", description: "Additional resources and guides specifically for team leaders in cross-cultural contexts." },
];
