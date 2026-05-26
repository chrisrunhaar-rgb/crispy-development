"use server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { markStepCompleteByContentKey } from "@/app/(app)/dashboard/team-actions";

async function getUserTeamId(userId: string): Promise<string | null> {
  const admin = createAdminClient();
  const { data: leadTeam } = await admin.from("teams").select("id").eq("leader_user_id", userId).maybeSingle();
  if (leadTeam?.id) return leadTeam.id;
  const { data: memberRow } = await admin.from("team_members").select("team_id").eq("user_id", userId).maybeSingle();
  return memberRow?.team_id ?? null;
}

async function saveTeamResult(
  userId: string,
  resultType: string,
  resultKey: string,
  scores: Record<string, number>
): Promise<void> {
  const teamId = await getUserTeamId(userId);
  if (!teamId) return;
  const admin = createAdminClient();
  await admin.from("team_member_results").upsert(
    { team_id: teamId, user_id: userId, result_type: resultType, result_key: resultKey, scores, completed_at: new Date().toISOString() },
    { onConflict: "team_id,user_id,result_type" }
  );
}

export async function saveCommStyleResult(style: string, scores: Record<string, number>): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  await saveTeamResult(user.id, "comm_style", style, scores);
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
  await saveTeamResult(user.id, "trust", String(roundedAvg), scores);
  await markStepCompleteByContentKey("/team/trust-psychological-safety");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function saveContributionZone(zone: string, scores: Record<string, number>): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  await saveTeamResult(user.id, "contribution_zone", zone, scores);
  await markStepCompleteByContentKey("/team/roles-contribution");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function saveConflictStyle(style: string, scores: Record<string, number>): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  await saveTeamResult(user.id, "conflict_style", style, scores);
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
  const teamId = await getUserTeamId(user.id);
  if (!teamId) return { error: "No team found" };
  const admin = createAdminClient();
  const resultKey = purposeStatement.trim().slice(0, 500) || "—";
  await admin.from("team_member_results").upsert(
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
