import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import LeaderDashboardClient from "./LeaderDashboardClient";

export const metadata = {
  title: "Leader View — WayPoint",
};

export default async function LeaderDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/coach/leader");

  const admin = createAdminClient();

  // Check if this user is a leader
  const { data: assignments, count } = await admin
    .from("wp_leader_assignments")
    .select("worker_user_id", { count: "exact" })
    .eq("leader_user_id", user.id);

  if (!count || count === 0) {
    return (
      <div style={{ background: "oklch(97% 0.005 80)", minHeight: "calc(100dvh - 80px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.25rem", fontStyle: "italic", color: "oklch(52% 0.008 260)", marginBottom: "0.75rem" }}>
            No users assigned yet.
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(60% 0.008 260)" }}>
            Ask your admin to assign users to your leader view.
          </p>
          <Link href="/coach" style={{ display: "inline-block", marginTop: "1.5rem", fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 600, color: "oklch(30% 0.12 260)", textDecoration: "none" }}>
            ← Back to Coach
          </Link>
        </div>
      </div>
    );
  }

  const workerIds = (assignments ?? []).map(a => a.worker_user_id);

  // Org-wide stats
  const { count: totalSessions } = await admin
    .from("wp_sessions")
    .select("*", { count: "exact", head: true })
    .in("user_id", workerIds)
    .eq("status", "completed");

  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
  const { count: sessionsThisMonth } = await admin
    .from("wp_sessions")
    .select("*", { count: "exact", head: true })
    .in("user_id", workerIds)
    .eq("status", "completed")
    .gte("started_at", thirtyDaysAgo);

  const firstName = user.user_metadata?.first_name ?? user.email?.split("@")[0] ?? "there";

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "calc(100dvh - 80px)" }}>

      {/* Header */}
      <div style={{ background: "oklch(30% 0.12 260)", paddingBlock: "2rem", borderBottom: "1px solid oklch(22% 0.10 260)" }}>
        <div className="container-wide" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.375rem", fontSize: "0.62rem" }}>WayPoint · Leader View</p>
            <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.375rem", color: "oklch(97% 0.005 80)" }}>
              {firstName}&rsquo;s Users
            </h1>
          </div>
          <Link href="/coach" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", color: "oklch(88% 0.008 80)", textDecoration: "none" }}>
            ← My Coach
          </Link>
        </div>
      </div>

      <div className="container-wide" style={{ paddingBlock: "3rem" }}>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "oklch(88% 0.008 80)", marginBottom: "2.5rem" }}>
          {[
            { label: "Users", value: workerIds.length },
            { label: "Total Sessions", value: totalSessions ?? 0 },
            { label: "Sessions This Month", value: sessionsThisMonth ?? 0 },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: "white", padding: "1.5rem", textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "2rem", color: "oklch(30% 0.12 260)" }}>{value}</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(60% 0.008 260)", marginTop: "0.25rem" }}>{label}</p>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: "oklch(70% 0.008 260)", marginBottom: "1.5rem", fontStyle: "italic" }}>
          You see session frequency and themes only. Transcripts are private to each user.
        </p>

        <LeaderDashboardClient />
      </div>
    </div>
  );
}
