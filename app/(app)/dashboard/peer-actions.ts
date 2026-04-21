"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import webpush from "web-push";

async function verifyInitiator(admin: ReturnType<typeof createAdminClient>, groupId: string, userId: string) {
  const { data: group } = await admin
    .from("peer_groups")
    .select("id, initiator_user_id, name, current_topic")
    .eq("id", groupId)
    .maybeSingle();
  if (!group || group.initiator_user_id !== userId) return null;
  return group;
}

export async function setPeerGroupTopic(
  groupId: string,
  topic: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();
  const group = await verifyInitiator(admin, groupId, user.id);
  if (!group) return { error: "Not authorized" };

  const { error } = await admin
    .from("peer_groups")
    .update({ current_topic: topic.trim() || null })
    .eq("id", groupId);
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { error: null };
}

export async function setPeerGroupLanguage(
  groupId: string,
  language: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();
  const group = await verifyInitiator(admin, groupId, user.id);
  if (!group) return { error: "Not authorized" };

  const { error } = await admin
    .from("peer_groups")
    .update({ language })
    .eq("id", groupId);
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { error: null };
}

export async function setPeerGroupOpen(
  groupId: string,
  isOpen: boolean
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();
  const group = await verifyInitiator(admin, groupId, user.id);
  if (!group) return { error: "Not authorized" };

  const { error } = await admin
    .from("peer_groups")
    .update({ is_open: isOpen })
    .eq("id", groupId);
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { error: null };
}

export async function setPeerGroupName(
  groupId: string,
  name: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const trimmed = name.trim();
  if (!trimmed) return { error: "Name cannot be empty" };

  const admin = createAdminClient();
  const group = await verifyInitiator(admin, groupId, user.id);
  if (!group) return { error: "Not authorized" };

  const { error } = await admin
    .from("peer_groups")
    .update({ name: trimmed })
    .eq("id", groupId);
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { error: null };
}

export async function approvePeerMember(
  groupId: string,
  memberId: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();
  const group = await verifyInitiator(admin, groupId, user.id);
  if (!group) return { error: "Not authorized" };

  const { error } = await admin
    .from("peer_group_members")
    .update({ status: "active" })
    .eq("group_id", groupId)
    .eq("user_id", memberId);
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { error: null };
}

export async function removePeerMember(
  groupId: string,
  memberId: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();
  const group = await verifyInitiator(admin, groupId, user.id);
  if (!group) return { error: "Not authorized" };

  const { error } = await admin
    .from("peer_group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", memberId);
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { error: null };
}

export async function sendPeerBroadcast(
  groupId: string,
  message: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();
  const group = await verifyInitiator(admin, groupId, user.id);
  if (!group) return { error: "Not authorized" };

  await admin.from("peer_broadcasts").insert({
    group_id: groupId,
    initiator_user_id: user.id,
    message,
  });

  try {
    webpush.setVapidDetails(
      "mailto:chris.runhaar@gmail.com",
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!
    );

    const { data: memberRows } = await admin
      .from("peer_group_members")
      .select("user_id")
      .eq("group_id", groupId)
      .eq("status", "active");
    const memberIds = (memberRows ?? []).map((m: { user_id: string }) => m.user_id);

    if (memberIds.length > 0) {
      const { data: subs } = await admin
        .from("push_subscriptions")
        .select("endpoint, p256dh, auth")
        .in("user_id", memberIds);

      if (subs && subs.length > 0) {
        const payload = JSON.stringify({
          title: `Message from ${group.name}`,
          body: message,
          data: { url: "/dashboard?tab=peer" },
          tag: "peer-message",
        });

        await Promise.allSettled(
          subs.map(async (sub: { endpoint: string; p256dh: string; auth: string }) => {
            try {
              await webpush.sendNotification(
                { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
                payload
              );
            } catch { /* expired */ }
          })
        );
      }
    }
  } catch { /* non-fatal */ }

  revalidatePath("/dashboard");
  return { error: null };
}

export async function applyToJoinPeerGroup(
  groupId: string,
  answers: { location: string; experience: string; contribution: string }
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();

  const { data: group } = await admin
    .from("peer_groups")
    .select("id, is_open, initiator_user_id")
    .eq("id", groupId)
    .maybeSingle();
  if (!group) return { error: "Group not found." };
  if (!group.is_open) return { error: "This group is no longer accepting applications." };
  if (group.initiator_user_id === user.id) return { error: "You are the initiator of this group." };

  const { data: existing } = await admin
    .from("peer_group_members")
    .select("user_id, status")
    .eq("group_id", groupId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    if (existing.status === "pending") return { error: "Your application is already pending review." };
    return { error: "You are already a member of this group." };
  }

  const { error } = await admin
    .from("peer_group_members")
    .insert({
      group_id: groupId,
      user_id: user.id,
      status: "pending",
      questionnaire_answers: answers,
    });
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { error: null };
}

export async function getOpenPeerGroups(): Promise<{
  groups: { id: string; name: string; region: string; current_topic: string | null; language: string; memberCount: number }[];
  error: string | null;
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { groups: [], error: "Not authenticated" };

  const admin = createAdminClient();

  const { data: groups, error } = await admin
    .from("peer_groups")
    .select("id, name, region, current_topic, language")
    .eq("is_open", true)
    .order("created_at", { ascending: true });

  if (error) return { groups: [], error: error.message };
  if (!groups || groups.length === 0) return { groups: [], error: null };

  const groupIds = groups.map((g: { id: string }) => g.id);
  const { data: memberRows } = await admin
    .from("peer_group_members")
    .select("group_id")
    .in("group_id", groupIds)
    .eq("status", "active");

  const countMap = new Map<string, number>();
  (memberRows ?? []).forEach((m: { group_id: string }) => {
    countMap.set(m.group_id, (countMap.get(m.group_id) ?? 0) + 1);
  });

  return {
    groups: groups.map((g: { id: string; name: string; region: string; current_topic: string | null; language: string }) => ({
      ...g,
      memberCount: countMap.get(g.id) ?? 0,
    })),
    error: null,
  };
}
