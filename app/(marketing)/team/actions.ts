"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function getUserTeamId(supabase: Awaited<ReturnType<typeof createClient>>, userId: string): Promise<string | null> {
  const { data: leadTeam } = await supabase.from("teams").select("id").eq("leader_user_id", userId).maybeSingle();
  if (leadTeam?.id) return leadTeam.id;
  const { data: memberRow } = await supabase.from("team_members").select("team_id").eq("user_id", userId).maybeSingle();
  return memberRow?.team_id ?? null;
}

async function saveTeamResult(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  resultType: string,
  resultKey: string,
  scores: Record<string, number>
): Promise<void> {
  const teamId = await getUserTeamId(supabase, userId);
  if (!teamId) return;
  await supabase.from("team_member_results").upsert(
    { team_id: teamId, user_id: userId, result_type: resultType, result_key: resultKey, scores, completed_at: new Date().toISOString() },
    { onConflict: "team_id,user_id,result_type" }
  );
}

export async function saveCommStyleResult(style: string, scores: Record<string, number>): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  await saveTeamResult(supabase, user.id, "comm_style", style, scores);
  revalidatePath("/dashboard");
  return { error: null };
}

export async function saveTrustScores(scores: Record<string, number>): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  const avg = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;
  const roundedAvg = Math.round(avg * 10) / 10;
  await saveTeamResult(supabase, user.id, "trust", String(roundedAvg), scores);
  revalidatePath("/dashboard");
  return { error: null };
}

export async function saveContributionZone(zone: string, scores: Record<string, number>): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  await saveTeamResult(supabase, user.id, "contribution_zone", zone, scores);
  revalidatePath("/dashboard");
  return { error: null };
}

export async function saveConflictStyle(style: string, scores: Record<string, number>): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  await saveTeamResult(supabase, user.id, "conflict_style", style, scores);
  revalidatePath("/dashboard");
  return { error: null };
}
