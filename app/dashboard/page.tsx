import Link from "next/link";
import PwaInstall from "@/components/PwaInstall";

export const metadata = {
  title: "Dashboard — Crispy Development",
};

// This is a UI shell — authentication and data will be wired via Supabase
export default function DashboardPage() {
  // Placeholder: in production, session/user data comes from Supabase
  const user = { name: "Chris", pathway: "personal", teamName: null as string | null };
  const isTeamLeader = false; // Toggle to preview team leader view

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "calc(100dvh - 120px)" }}>

      {/* ── DASHBOARD HEADER ── */}
      <div style={{
        background: "oklch(30% 0.12 260)",
        paddingBlock: "2rem",
        borderBottom: "1px solid oklch(22% 0.10 260)",
      }}>
        <div className="container-wide" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.375rem", fontSize: "0.62rem" }}>
              {isTeamLeader ? "Team Pathway" : "Personal Pathway"}
            </p>
            <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.375rem", color: "oklch(97% 0.005 80)" }}>
              Welcome back, {user.name}.
            </h1>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {isTeamLeader && (
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(72% 0.04 260)" }}>
                Team: {user.teamName ?? "Your Team"}
              </span>
            )}
            <PwaInstall />
            <Link href="/resources" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", color: "oklch(88% 0.008 80)", textDecoration: "none" }}>
              Resources →
            </Link>
          </div>
        </div>
      </div>

      <div className="container-wide" style={{ paddingBlock: "3rem" }}>

        {isTeamLeader ? (
          /* ── TEAM LEADER VIEW ── */
          <TeamLeaderDashboard />
        ) : (
          /* ── PERSONAL VIEW ── */
          <PersonalDashboard />
        )}
      </div>
    </div>
  );
}

function PersonalDashboard() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem", alignItems: "start" }}>

      {/* Main content */}
      <div>
        <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1.125rem", color: "oklch(22% 0.005 260)", marginBottom: "1.5rem" }}>
          Your content library
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {contentItems.map((item, i) => (
            <div key={item.id} style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              paddingBlock: "1.25rem",
              borderTop: i === 0 ? "none" : "1px solid oklch(88% 0.008 80)",
            }}>
              <div style={{
                width: "36px", height: "36px", flexShrink: 0,
                background: item.completed ? "oklch(65% 0.15 45)" : "oklch(88% 0.008 80)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {item.completed ? (
                  <span style={{ color: "white", fontSize: "0.75rem", fontWeight: 700 }}>✓</span>
                ) : (
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, color: "oklch(52% 0.008 260)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.9375rem", color: "oklch(22% 0.005 260)", marginBottom: "0.2rem" }}>
                  {item.title}
                </p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(55% 0.008 260)" }}>{item.type} · {item.readTime}</p>
              </div>
              <Link href={`/resources/${item.id}`} style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: item.completed ? "oklch(55% 0.008 260)" : "oklch(30% 0.12 260)",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}>
                {item.completed ? "Review" : "Read →"}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div className="stat-block">
          <p className="t-label" style={{ color: "oklch(52% 0.008 260)", marginBottom: "0.75rem", fontSize: "0.62rem" }}>Progress</p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "2.5rem", color: "oklch(30% 0.12 260)", lineHeight: 1 }}>
            1<span style={{ fontSize: "1.5rem", color: "oklch(72% 0.006 260)", fontWeight: 300 }}>/8</span>
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(52% 0.008 260)", marginTop: "0.375rem" }}>resources completed</p>
          <div style={{ height: "4px", background: "oklch(88% 0.008 80)", marginTop: "1rem" }}>
            <div style={{ height: "100%", width: "12.5%", background: "oklch(65% 0.15 45)" }} />
          </div>
        </div>

        <div className="stat-block">
          <p className="t-label" style={{ color: "oklch(52% 0.008 260)", marginBottom: "0.75rem", fontSize: "0.62rem" }}>Your Pathway</p>
          <span className="pathway-badge">Personal</span>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(52% 0.008 260)", marginTop: "0.75rem", lineHeight: 1.5 }}>
            Leading a team? Upgrade to Team Pathway.
          </p>
          <Link href="/team" style={{ display: "inline-block", fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, color: "oklch(30% 0.12 260)", textDecoration: "none", marginTop: "0.625rem" }}>
            Learn more →
          </Link>
        </div>
      </div>
    </div>
  );
}

function TeamLeaderDashboard() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
      {/* Members */}
      <div style={{ background: "oklch(97% 0.005 80)", border: "1px solid oklch(88% 0.008 80)", padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <p className="t-label" style={{ color: "oklch(52% 0.008 260)", fontSize: "0.62rem" }}>Team Members</p>
          <button style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, color: "oklch(65% 0.15 45)", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.06em" }}>
            + Invite
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {teamMembers.map((m, i) => (
            <div key={m.name} style={{ display: "flex", alignItems: "center", gap: "0.875rem", paddingBlock: "0.75rem", borderTop: i === 0 ? "none" : "1px solid oklch(88% 0.008 80)" }}>
              <div style={{ width: "32px", height: "32px", background: "oklch(30% 0.12 260)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.75rem", color: "oklch(97% 0.005 80)" }}>{m.name[0]}</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.875rem", color: "oklch(22% 0.005 260)" }}>{m.name}</p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(55% 0.008 260)" }}>{m.progress} completed</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected content */}
      <div style={{ background: "oklch(97% 0.005 80)", border: "1px solid oklch(88% 0.008 80)", padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <p className="t-label" style={{ color: "oklch(52% 0.008 260)", fontSize: "0.62rem" }}>Selected Content</p>
          <Link href="/resources" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, color: "oklch(65% 0.15 45)", textDecoration: "none", letterSpacing: "0.06em" }}>
            + Add
          </Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {contentItems.slice(0, 3).map((item, i) => (
            <div key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", paddingBlock: "0.875rem", borderTop: i === 0 ? "none" : "1px solid oklch(88% 0.008 80)" }}>
              <div style={{ width: "28px", height: "28px", background: "oklch(65% 0.15 45)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.7rem", color: "white" }}>{i + 1}</span>
              </div>
              <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.875rem", color: "oklch(22% 0.005 260)", lineHeight: 1.3 }}>{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const contentItems = [
  { id: 1, title: "The Cross-Cultural Leader's Field Guide", type: "PDF", readTime: "12 min", completed: true },
  { id: 2, title: "Understanding High-Context Cultures", type: "PDF", readTime: "9 min", completed: false },
  { id: 3, title: "Identity Under Pressure", type: "PDF", readTime: "10 min", completed: false },
  { id: 4, title: "Building Trust Across Cultures", type: "PDF", readTime: "11 min", completed: false },
  { id: 5, title: "Conflict Resolution in Multicultural Teams", type: "PDF", readTime: "14 min", completed: false },
  { id: 6, title: "The Missionary Re-Entry Guide", type: "PDF", readTime: "15 min", completed: false },
  { id: 7, title: "Leading Without Losing Your Faith", type: "PDF", readTime: "10 min", completed: false },
  { id: 8, title: "The Influential Leadership Framework", type: "PDF", readTime: "18 min", completed: false },
];

const teamMembers = [
  { name: "Maria Santos", progress: "3/8" },
  { name: "James Kimani", progress: "1/8" },
  { name: "Priya Mehta", progress: "2/8" },
  { name: "David Lim", progress: "0/8" },
];
