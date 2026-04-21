"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function getUserTeamId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<string | null> {
  const { data: leadTeam } = await supabase
    .from("teams")
    .select("id")
    .eq("leader_user_id", userId)
    .maybeSingle();
  if (leadTeam?.id) return leadTeam.id;
  const { data: memberRow } = await supabase
    .from("team_members")
    .select("team_id")
    .eq("user_id", userId)
    .maybeSingle();
  return memberRow?.team_id ?? null;
}

export async function saveDISCTeamResult(
  primaryType: string,
  scores: { D: number; I: number; S: number; C: number }
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  const teamId = await getUserTeamId(supabase, user.id);
  if (!teamId) return { error: "Not part of a team" };
  const { error } = await supabase.from("team_member_results").upsert(
    {
      team_id: teamId,
      user_id: user.id,
      result_type: "disc",
      result_key: primaryType,
      scores,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "team_id,user_id,result_type" }
  );
  if (!error) revalidatePath("/dashboard?tab=team");
  return { error: error?.message ?? null };
}
