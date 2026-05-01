"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function setPersonalLanguage(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const language = formData.get("language") as string;
  if (!["en", "id", "nl"].includes(language)) throw new Error("Invalid language");

  const admin = createAdminClient();
  await admin.auth.admin.updateUserById(user.id, {
    user_metadata: { language_preference: language },
  });
  revalidatePath("/dashboard");
}

export async function setTeamLanguage(formData: FormData) {
  const supabase = await createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const language = formData.get("language") as string;
  if (!["en", "id", "nl"].includes(language)) throw new Error("Invalid language");

  await admin
    .from("teams")
    .update({ language })
    .eq("leader_user_id", user.id);

  revalidatePath("/dashboard");
}

export async function addTeamContent(formData: FormData) {
  const supabase = await createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const teamId = formData.get("teamId") as string;
  const moduleId = formData.get("moduleId") as string;

  const { data: team } = await admin
    .from("teams")
    .select("id")
    .eq("id", teamId)
    .eq("leader_user_id", user.id)
    .maybeSingle();
  if (!team) throw new Error("Unauthorized");

  await admin
    .from("team_content")
    .upsert({ team_id: teamId, module_id: moduleId }, { onConflict: "team_id,module_id" });

  revalidatePath("/dashboard");
}

export async function removeTeamContent(formData: FormData) {
  const supabase = await createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const teamId = formData.get("teamId") as string;
  const moduleId = formData.get("moduleId") as string;

  const { data: team } = await admin
    .from("teams")
    .select("id")
    .eq("id", teamId)
    .eq("leader_user_id", user.id)
    .maybeSingle();
  if (!team) throw new Error("Unauthorized");

  await admin
    .from("team_content")
    .delete()
    .eq("team_id", teamId)
    .eq("module_id", moduleId);

  revalidatePath("/dashboard");
}

// ── Team Invite Actions ────────────────────────────────────────────────────

export async function generateInviteLink(formData: FormData) {
  const supabase = await createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Verify this user is actually a team leader
  const { data: team } = await admin
    .from("teams")
    .select("id")
    .eq("leader_user_id", user.id)
    .maybeSingle();
  if (!team) throw new Error("Unauthorized");

  // Generate a secure token and set expiry 7 days from now
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  // team_invites.team_id FK references auth.users(id) — must use the leader's user ID
  const { error } = await admin
    .from("team_invites")
    .insert({ team_id: user.id, token, expires_at: expiresAt });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/invite");
  return { error: null };
}

export async function generateInviteAndGetUrl(): Promise<{ url: string | null; error: string | null }> {
  const supabase = await createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { url: null, error: "Unauthorized" };

  const { data: team } = await admin
    .from("teams")
    .select("id")
    .eq("leader_user_id", user.id)
    .maybeSingle();
  if (!team) return { url: null, error: "No team found" };

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const { error } = await admin
    .from("team_invites")
    .insert({ team_id: user.id, token, expires_at: expiresAt });

  if (error) return { url: null, error: error.message };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://crispyleaders.com";
  return { url: `${siteUrl}/invite/${token}`, error: null };
}

export async function deleteInviteLink(formData: FormData) {
  const supabase = await createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const inviteId = formData.get("inviteId") as string;

  const { data: invite } = await admin
    .from("team_invites")
    .select("team_id")
    .eq("id", inviteId)
    .maybeSingle();
  if (!invite) return;

  // team_invites.team_id = leader's auth user ID — compare directly
  if (invite.team_id !== user.id) throw new Error("Unauthorized");

  await admin.from("team_invites").delete().eq("id", inviteId);
  revalidatePath("/dashboard/invite");
}

export async function acceptInvite(token: string, userId: string): Promise<{ error: string | null }> {
  const admin = createAdminClient();

  // Look up invite
  const { data: invite } = await admin
    .from("team_invites")
    .select("id, team_id, expires_at, used_at")
    .eq("token", token)
    .maybeSingle();

  if (!invite) return { error: "Invite link is invalid." };
  if (invite.used_at) return { error: "This invite link has already been used." };
  if (new Date(invite.expires_at) < new Date()) return { error: "This invite link has expired." };

  // invite.team_id = leader's auth user ID — look up the actual teams row
  const { data: team } = await admin
    .from("teams")
    .select("id")
    .eq("leader_user_id", invite.team_id)
    .maybeSingle();

  if (!team) return { error: "This team no longer exists." };

  // Add to team_members using teams.id (which is what team_members.team_id FK requires)
  await admin
    .from("team_members")
    .upsert({ team_id: team.id, user_id: userId }, { onConflict: "team_id,user_id" });

  // Mark invite as used
  await admin
    .from("team_invites")
    .update({ used_at: new Date().toISOString(), used_by: userId })
    .eq("id", invite.id);

  // Grant member access
  await admin.auth.admin.updateUserById(userId, {
    user_metadata: { is_member: true },
  });

  return { error: null };
}

export async function acceptMemberInvite(token: string, userId: string): Promise<{ error: string | null }> {
  const admin = createAdminClient();

  const { data: invite } = await admin
    .from("member_invites")
    .select("id, expires_at, used_at, pathway")
    .eq("token", token)
    .maybeSingle();

  if (!invite) return { error: "Invite link is invalid." };
  if (invite.used_at) return { error: "This invite link has already been used." };
  if (new Date(invite.expires_at) < new Date()) return { error: "This invite link has expired." };

  await admin.auth.admin.updateUserById(userId, {
    user_metadata: { is_member: true, pathway: invite.pathway ?? "personal" },
  });

  await admin
    .from("member_invites")
    .update({ used_at: new Date().toISOString(), used_by_user_id: userId })
    .eq("id", invite.id);

  return { error: null };
}

export async function markModuleComplete(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const moduleId = formData.get("moduleId") as string;

  await supabase
    .from("user_progress")
    .upsert(
      { user_id: user.id, module_id: moduleId, status: "completed", completed_at: new Date().toISOString() },
      { onConflict: "user_id,module_id" }
    );

  revalidatePath("/dashboard");
}
