import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";

// Checks real subscription status (not just row existence) across all three
// paths a user can have paid access: personal membership, team membership
// (seat on someone else's team), or team leadership. Table/column names below
// are the real ones — team_members (not team_memberships), teams.leader_user_id
// (not leader_id) — confirmed against dashboard/page.tsx and dashboard/actions.ts.
export async function requireSubscription(supabase: SupabaseClient, userId: string) {
  const [{ data: membership }, { data: teamMemberRow }, { data: teamLeaderRow }] = await Promise.all([
    supabase.from("memberships").select("subscription_active").eq("user_id", userId).maybeSingle(),
    supabase.from("team_members").select("team_id").eq("user_id", userId).maybeSingle(),
    supabase.from("teams").select("subscription_active").eq("leader_user_id", userId).maybeSingle(),
  ]);

  let hasActiveTeamMembership = false;
  if (teamMemberRow?.team_id) {
    const { data: team } = await supabase
      .from("teams")
      .select("subscription_active")
      .eq("id", teamMemberRow.team_id)
      .maybeSingle();
    hasActiveTeamMembership = team?.subscription_active === true;
  }

  const hasActiveMembership = membership?.subscription_active === true;
  const hasActiveTeamLeadership = teamLeaderRow?.subscription_active === true;

  if (!hasActiveMembership && !hasActiveTeamMembership && !hasActiveTeamLeadership) {
    redirect("/membership");
  }
}
