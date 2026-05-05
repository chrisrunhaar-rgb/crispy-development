"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_USER_ID = "e04e4310-075a-4df5-9113-4fe7f993afe6";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== ADMIN_USER_ID) throw new Error("Unauthorized");
  return supabase;
}

export async function approveApplication(formData: FormData) {
  await assertAdmin();
  const applicationId = formData.get("applicationId") as string;
  const userId = formData.get("userId") as string;

  const adminClient = createAdminClient();

  // Update application status
  await adminClient
    .from("team_applications")
    .update({ status: "approved", reviewed_at: new Date().toISOString() })
    .eq("id", applicationId);

  // Update user metadata to grant team leader access
  await adminClient.auth.admin.updateUserById(userId, {
    user_metadata: { pathway: "team" },
  });

  revalidatePath("/admin");
}

export async function declineApplication(formData: FormData) {
  await assertAdmin();
  const applicationId = formData.get("applicationId") as string;
  const adminClient = createAdminClient();

  await adminClient
    .from("team_applications")
    .update({ status: "declined", reviewed_at: new Date().toISOString() })
    .eq("id", applicationId);

  revalidatePath("/admin");
}

export async function approvePeerApplication(formData: FormData) {
  await assertAdmin();
  const applicationId = formData.get("applicationId") as string;
  const userId = formData.get("userId") as string;

  const adminClient = createAdminClient();

  // Fetch application details to create the group
  const { data: app } = await adminClient
    .from("peer_group_applications")
    .select("region, timezone, pathway, first_name, last_name")
    .eq("id", applicationId)
    .single();

  // Update application status
  await adminClient
    .from("peer_group_applications")
    .update({ status: "approved", reviewed_at: new Date().toISOString() })
    .eq("id", applicationId);

  // Create the peer group from application data
  const groupName = app
    ? `${app.region} — ${app.first_name ?? "Leader"}'s Group`
    : "New Peer Group";
  const { data: newGroup } = await adminClient
    .from("peer_groups")
    .insert({
      initiator_user_id: userId,
      application_id: applicationId,
      name: groupName,
      region: app?.region ?? "Global",
      timezone: app?.timezone ?? "UTC+0",
      pathway: app?.pathway ?? "both",
      max_size: 8,
      is_open: true,
    })
    .select("id")
    .single();

  // Add initiator as first member
  if (newGroup?.id) {
    await adminClient
      .from("peer_group_members")
      .insert({ group_id: newGroup.id, user_id: userId });
  }

  // Update user metadata
  await adminClient.auth.admin.updateUserById(userId, {
    user_metadata: { pathway: "peer", peer_group_id: newGroup?.id ?? null },
  });

  revalidatePath("/admin");
}

export async function declinePeerApplication(formData: FormData) {
  await assertAdmin();
  const applicationId = formData.get("applicationId") as string;
  const adminClient = createAdminClient();

  await adminClient
    .from("peer_group_applications")
    .update({ status: "declined", reviewed_at: new Date().toISOString() })
    .eq("id", applicationId);

  revalidatePath("/admin");
}

export async function adminDeletePeerGroup(formData: FormData) {
  await assertAdmin();
  const groupId = formData.get("groupId") as string;
  const adminClient = createAdminClient();
  await adminClient.from("peer_groups").delete().eq("id", groupId);
  revalidatePath("/admin");
}

export async function adminSetPeerGroupOpen(formData: FormData) {
  await assertAdmin();
  const groupId = formData.get("groupId") as string;
  const isOpen = formData.get("isOpen") === "true";
  const adminClient = createAdminClient();
  await adminClient.from("peer_groups").update({ is_open: isOpen }).eq("id", groupId);
  revalidatePath("/admin");
}

export async function adminSetPeerGroupName(formData: FormData) {
  await assertAdmin();
  const groupId = formData.get("groupId") as string;
  const name = (formData.get("name") as string)?.trim();
  if (!name) return;
  const adminClient = createAdminClient();
  await adminClient.from("peer_groups").update({ name }).eq("id", groupId);
  revalidatePath("/admin");
}

export async function markMessageRead(formData: FormData) {
  await assertAdmin();
  const messageId = formData.get("messageId") as string;
  const adminClient = createAdminClient();

  await adminClient
    .from("coach_messages")
    .update({ status: "read" })
    .eq("id", messageId);

  revalidatePath("/admin");
}

export async function replyToCoachMessage(formData: FormData): Promise<{ error: string | null }> {
  await assertAdmin();
  const messageId = formData.get("messageId") as string;
  const reply = (formData.get("reply") as string | null)?.trim() ?? "";
  if (!reply) return { error: "Reply cannot be empty." };

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("coach_messages")
    .update({
      reply,
      replied_at: new Date().toISOString(),
      status: "replied",
    })
    .eq("id", messageId);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  return { error: null };
}

/**
 * Admin action: Delete a user and all their related data
 */
export async function adminDeleteMember(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();
    const adminClient = createAdminClient();

    // Delete user and cascade delete related records
    const { error } = await adminClient.auth.admin.deleteUser(userId);
    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete member";
    return { success: false, error: message };
  }
}

/**
 * Admin action: Archive content (soft delete)
 */
export async function adminArchiveContent(contentSlug: string): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();
    const adminClient = createAdminClient();

    // Mark content as archived in user_metadata if stored there
    // For now, we'll just return success as content is hard-coded
    // In a full implementation, you'd update a content table

    revalidatePath("/admin");
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to archive content";
    return { success: false, error: message };
  }
}

/**
 * Admin action: Bulk delete members
 */
export async function adminBulkDeleteMembers(userIds: string[]): Promise<{ success: boolean; error?: string; deletedCount?: number }> {
  try {
    await assertAdmin();
    const adminClient = createAdminClient();

    let deletedCount = 0;
    for (const userId of userIds) {
      const { error } = await adminClient.auth.admin.deleteUser(userId);
      if (!error) {
        deletedCount++;
      }
    }

    revalidatePath("/admin");
    return { success: true, deletedCount };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete members";
    return { success: false, error: message };
  }
}

export async function approveMembershipApplication(formData: FormData): Promise<{ error?: string }> {
  await assertAdmin();
  const applicationId = formData.get("applicationId") as string;
  const adminClient = createAdminClient();

  await adminClient
    .from("membership_applications")
    .update({ status: "approved", reviewed_at: new Date().toISOString() })
    .eq("id", applicationId);

  revalidatePath("/admin");
  return {};
}

export async function rejectMembershipApplication(formData: FormData) {
  await assertAdmin();
  const applicationId = formData.get("applicationId") as string;
  const adminClient = createAdminClient();

  await adminClient
    .from("membership_applications")
    .update({ status: "rejected", reviewed_at: new Date().toISOString() })
    .eq("id", applicationId);

  revalidatePath("/admin");
}

export async function generateMemberInvite(formData: FormData): Promise<{ error?: string; url?: string; emailSent?: boolean }> {
  await assertAdmin();
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const recipientName = (formData.get("recipientName") as string | null)?.trim() ?? "";
  const pathway = (formData.get("pathway") as string | null) === "team" ? "team" : "personal";

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("member_invites")
    .insert({
      email: email || null,
      pathway,
    })
    .select("token")
    .single();

  if (error || !data) return { error: "Failed to generate invite." };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.crispyleaders.com";
  const inviteUrl = `${siteUrl}/join/${data.token}`;

  let emailSent = false;
  if (email) {
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const greeting = recipientName ? `Hi ${recipientName},` : "Hi there,";
      const pathwayLabel = pathway === "team" ? "a team leader" : "a community member";
      const html = `<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:40px 24px;background:#ffffff;"><div style="width:3px;height:36px;background:#E07540;margin-bottom:24px;"></div><p style="font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#E07540;margin:0 0 12px 0;">You're Invited</p><h1 style="font-size:24px;font-weight:800;color:#1B3A6B;line-height:1.15;margin:0 0 16px 0;">Join Crispy Leaders.</h1><p style="font-size:15px;line-height:1.75;color:#555555;margin:0 0 8px 0;">${greeting}</p><p style="font-size:15px;line-height:1.75;color:#555555;margin:0 0 32px 0;">You have been personally invited to join Crispy Leaders as ${pathwayLabel}. Click the button below to create your account and get started.</p><a href="${inviteUrl}" style="display:inline-block;background:#1B3A6B;color:#ffffff;font-size:14px;font-weight:700;letter-spacing:0.04em;text-decoration:none;padding:14px 28px;margin-bottom:32px;">Accept Invitation &rarr;</a><p style="font-size:12px;line-height:1.6;color:#9b9b9b;margin:0 0 24px 0;">This invitation expires in 7 days. If you were not expecting this, you can safely ignore it.</p><p style="font-size:12px;color:#9b9b9b;margin:0 0 20px 0;">With you on the journey,<br/><strong style="color:#1B3A6B;">The Crispy Leaders Team</strong></p><div style="border-top:1px solid #e8e4df;padding-top:24px;margin-top:8px;"><img src="https://www.crispyleaders.com/logo-icon-dark-badge.png" alt="Crispy Leaders" width="48" height="48" style="display:block;margin-bottom:8px;" /><p style="font-size:12px;color:#9b9b9b;margin:0;">crispyleaders.com</p></div></div>`;
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Crispy Leaders <noreply@crispyleaders.com>",
          to: email,
          subject: "You're invited to join Crispy Leaders",
          html,
        }),
      });
      if (res.ok) emailSent = true;
    }
  }

  revalidatePath("/admin");
  return { url: inviteUrl, emailSent };
}

export async function revokeMemberInvite(formData: FormData) {
  await assertAdmin();
  const inviteId = formData.get("inviteId") as string;
  const adminClient = createAdminClient();
  await adminClient.from("member_invites").delete().eq("id", inviteId);
  revalidatePath("/admin");
}

export async function markContactMessageRead(formData: FormData) {
  await assertAdmin();
  const id = formData.get("id") as string;
  const admin = createAdminClient();
  await admin.from("contact_messages").update({ read: true }).eq("id", id);
  revalidatePath("/admin");
}
