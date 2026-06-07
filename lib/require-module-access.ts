import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Gates access to a resource module based on its status in the module_status table.
 * - live_free  → accessible to anyone (logged in or not)
 * - live_paid  → requires login + active subscription / team membership
 * - development → redirect to /resources (not live)
 * - no row in DB → treated as live_paid (safe default)
 */
export async function requireModuleAccess(
  supabase: SupabaseClient,
  userId: string | null,
  slug: string
) {
  const admin = createAdminClient();
  const { data: ms } = await admin
    .from("module_status")
    .select("status")
    .eq("slug", slug)
    .maybeSingle();

  const status = ms?.status ?? "live_paid";

  if (status === "development") {
    redirect("/resources");
  }

  if (status === "live_free") {
    return;
  }

  // live_paid: must be logged in with an active subscription
  if (!userId) redirect("/login");

  const [{ data: membership }, { data: teamMember }, { data: teamLeader }] = await Promise.all([
    supabase.from("memberships").select("id").eq("user_id", userId).maybeSingle(),
    supabase.from("team_memberships").select("id").eq("user_id", userId).maybeSingle(),
    supabase.from("teams").select("id").eq("leader_id", userId).maybeSingle(),
  ]);

  if (!membership && !teamMember && !teamLeader) {
    redirect("/membership");
  }
}
