"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// ── Create a group (facilitator) ──────────────────────────────────────────────
export async function createGroup(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/challenge/group/create");

  const name = (formData.get("name") as string).trim();
  const description = (formData.get("description") as string | null)?.trim() || null;
  const scheduleDays = formData.getAll("schedule_days").map(Number).filter(n => n >= 0 && n <= 6);
  const isPublic = formData.get("is_public") === "true";
  const maxMembers = parseInt(formData.get("max_members") as string) || 12;

  if (!name) return { error: "Group name is required" };

  const admin = createAdminClient();

  const { data: group, error } = await admin
    .from("challenge_groups")
    .insert({
      facilitator_id: user.id,
      name,
      description,
      schedule_days: scheduleDays.length > 0 ? scheduleDays : [1, 2, 3, 4, 5],
      is_public: isPublic,
      max_members: maxMembers,
    })
    .select("id, group_code")
    .single();

  if (error) return { error: error.message };

  // Add facilitator as member with facilitator role
  await admin.from("challenge_group_members").insert({
    group_id: group.id,
    user_id: user.id,
    role: "facilitator",
  });

  // Enroll facilitator if not yet enrolled
  const { data: existing } = await admin
    .from("challenge_enrollments")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existing) {
    await admin.from("challenge_enrollments").insert({
      user_id: user.id,
      path: "facilitator",
      group_id: group.id,
      current_day: 1,
      status: "active",
    });
    await supabase.auth.updateUser({ data: { challenge_enrolled: true } });
  }

  revalidatePath("/challenge/facilitator");
  redirect(`/challenge/facilitator?created=${group.id}&code=${group.group_code}`);
}

// ── Join via invite link ──────────────────────────────────────────────────────
export async function joinGroupByCode(code: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/challenge/join/${code}`);

  const admin = createAdminClient();

  const { data: group } = await admin
    .from("challenge_groups")
    .select("id, name, facilitator_id, max_members")
    .eq("group_code", code.toUpperCase())
    .maybeSingle();

  if (!group) return { error: "Invalid invite code" };

  // Check member count
  const { count } = await admin
    .from("challenge_group_members")
    .select("id", { count: "exact", head: true })
    .eq("group_id", group.id);

  if ((count ?? 0) >= group.max_members) return { error: "This group is full" };

  // Check already a member
  const { data: already } = await admin
    .from("challenge_group_members")
    .select("id")
    .eq("group_id", group.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (already) redirect(`/challenge/day/1`);

  await admin.from("challenge_group_members").insert({
    group_id: group.id,
    user_id: user.id,
    role: "member",
  });

  // Enroll if not yet enrolled
  const { data: existing } = await admin
    .from("challenge_enrollments")
    .select("id, current_day")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existing) {
    await admin.from("challenge_enrollments").insert({
      user_id: user.id,
      path: "member",
      group_id: group.id,
      current_day: 1,
      status: "active",
    });
    await supabase.auth.updateUser({ data: { challenge_enrolled: true } });
    redirect("/challenge/day/1");
  }

  revalidatePath("/dashboard");
  redirect(`/challenge/day/${existing.current_day}`);
}

// ── Apply to open group ───────────────────────────────────────────────────────
export async function applyToGroup(groupId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/challenge/group/${groupId}/apply`);

  const answer1 = (formData.get("answer_1") as string).trim();
  const answer2 = (formData.get("answer_2") as string | null)?.trim() || null;

  const admin = createAdminClient();

  const { error } = await admin.from("challenge_group_applications").upsert({
    group_id: groupId,
    user_id: user.id,
    answer_1: answer1,
    answer_2: answer2,
    status: "pending",
  }, { onConflict: "group_id,user_id" });

  if (error) return { error: error.message };
  return { success: true };
}

// ── Approve / reject application ──────────────────────────────────────────────
export async function reviewApplication(applicationId: string, action: "approve" | "reject") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();

  const { data: app } = await admin
    .from("challenge_group_applications")
    .select("user_id, group_id")
    .eq("id", applicationId)
    .maybeSingle();

  if (!app) return { error: "Application not found" };

  await admin.from("challenge_group_applications")
    .update({ status: action === "approve" ? "approved" : "rejected" })
    .eq("id", applicationId);

  if (action === "approve") {
    await admin.from("challenge_group_members").upsert({
      group_id: app.group_id,
      user_id: app.user_id,
      role: "member",
    }, { onConflict: "group_id,user_id" });

    // Enroll them if not yet enrolled
    const { data: existing } = await admin
      .from("challenge_enrollments")
      .select("id")
      .eq("user_id", app.user_id)
      .maybeSingle();

    if (!existing) {
      await admin.from("challenge_enrollments").insert({
        user_id: app.user_id,
        path: "member",
        group_id: app.group_id,
        current_day: 1,
        status: "active",
      });
    }
  }

  revalidatePath("/challenge/facilitator");
  return { success: true };
}

// ── Toggle group public/private ───────────────────────────────────────────────
export async function toggleGroupPublic(groupId: string, isPublic: boolean) {
  const admin = createAdminClient();
  await admin.from("challenge_groups").update({ is_public: isPublic }).eq("id", groupId);
  revalidatePath("/challenge/facilitator");
  return { success: true };
}
