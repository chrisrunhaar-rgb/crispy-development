import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function requireSubscription(supabase: SupabaseClient, userId: string) {
  const [{ data: membership }, { data: teamMember }, { data: teamLeader }] = await Promise.all([
    supabase.from("memberships").select("id").eq("user_id", userId).maybeSingle(),
    supabase.from("team_memberships").select("id").eq("user_id", userId).maybeSingle(),
    supabase.from("teams").select("id").eq("leader_id", userId).maybeSingle(),
  ]);

  if (!membership && !teamMember && !teamLeader) {
    redirect("/membership");
  }
}
