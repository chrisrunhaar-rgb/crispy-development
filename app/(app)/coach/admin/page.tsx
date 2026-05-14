import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import AssignmentManager from "./AssignmentManager";

export const metadata = {
  title: "WayPoint Admin",
};

export default async function CoachAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Check admin
  const { data: membership } = await supabase
    .from("memberships")
    .select("is_admin")
    .eq("user_id", user.id)
    .single();

  if (!membership?.is_admin) redirect("/coach");

  const admin = createAdminClient();

  // All users with worker profiles
  const { data: profiles } = await admin
    .from("wp_worker_profiles")
    .select("user_id, name, organisation");

  // All existing assignments
  const { data: assignments } = await admin
    .from("wp_leader_assignments")
    .select("id, leader_user_id, worker_user_id, assigned_at");

  // Auth users list for name lookup
  const { data: authData } = await admin.auth.admin.listUsers();
  const allUsers = (authData?.users ?? []).map(u => ({
    id: u.id,
    email: u.email ?? "",
    name: (`${u.user_metadata?.first_name ?? ""} ${u.user_metadata?.last_name ?? ""}`.trim() || u.email) ?? u.id,
  }));

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "calc(100dvh - 80px)" }}>

      <div style={{ background: "oklch(30% 0.12 260)", paddingBlock: "2rem", borderBottom: "1px solid oklch(22% 0.10 260)" }}>
        <div className="container-wide" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.375rem", fontSize: "0.62rem" }}>WayPoint · Admin</p>
            <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.375rem", color: "oklch(97% 0.005 80)" }}>
              Leader Assignments
            </h1>
          </div>
          <Link href="/coach" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", color: "oklch(88% 0.008 80)", textDecoration: "none" }}>
            ← Back to Coach
          </Link>
        </div>
      </div>

      <div className="container-wide" style={{ paddingBlock: "3rem" }}>
        <AssignmentManager
          profiles={profiles ?? []}
          assignments={assignments ?? []}
          allUsers={allUsers}
        />
      </div>
    </div>
  );
}
