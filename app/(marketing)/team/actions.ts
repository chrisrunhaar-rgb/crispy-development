"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { markStepCompleteByContentKey } from "@/app/(app)/dashboard/team-actions";

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
  await markStepCompleteByContentKey("/team/communication-culture");
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
  await markStepCompleteByContentKey("/team/trust-psychological-safety");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function saveContributionZone(zone: string, scores: Record<string, number>): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  await saveTeamResult(supabase, user.id, "contribution_zone", zone, scores);
  await markStepCompleteByContentKey("/team/roles-contribution");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function saveConflictStyle(style: string, scores: Record<string, number>): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  await saveTeamResult(supabase, user.id, "conflict_style", style, scores);
  await markStepCompleteByContentKey("/team/navigating-conflict");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function savePurposeVisionResult(
  purposeStatement: string,
  why: string,
  what: string,
  how: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  const scores = { why: 1, what: 1, how: 1 } as Record<string, number>;
  // Store full texts in a separate jsonb field via scores (adapter) — store as string-keyed dummy scores
  // Actual text stored as result_key (truncated to 500 chars for DB safety)
  const teamId = await getUserTeamId(supabase, user.id);
  if (!teamId) return { error: "No team found" };
  const resultKey = purposeStatement.trim().slice(0, 500) || "—";
  await supabase.from("team_member_results").upsert(
    {
      team_id: teamId,
      user_id: user.id,
      result_type: "purpose_vision",
      result_key: resultKey,
      scores,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "team_id,user_id,result_type" }
  );
  await markStepCompleteByContentKey("/team/team-purpose-vision");
  revalidatePath("/dashboard");
  return { error: null };
}
