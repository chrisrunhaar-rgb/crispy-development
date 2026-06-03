import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  webpush.setVapidDetails(
    "mailto:chris.runhaar@gmail.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { groupId, title, message, url } = await req.json();
  if (!groupId || !title || !message) {
    return NextResponse.json({ error: "groupId, title and message required" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Verify caller is facilitator of this group
  const { data: group } = await admin
    .from("challenge_groups")
    .select("id, facilitator_id")
    .eq("id", groupId)
    .maybeSingle();

  if (!group || group.facilitator_id !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Get all group member user IDs
  const { data: members } = await admin
    .from("challenge_group_members")
    .select("user_id")
    .eq("group_id", groupId);

  if (!members || members.length === 0) {
    return NextResponse.json({ sent: 0, total: 0, note: "No members" });
  }

  const memberIds = members.map((m: { user_id: string }) => m.user_id);

  // Get their push subscriptions
  const { data: subscriptions } = await admin
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth, user_id")
    .in("user_id", memberIds);

  if (!subscriptions || subscriptions.length === 0) {
    return NextResponse.json({ sent: 0, total: memberIds.length, note: "No push subscriptions found" });
  }

  const payload = JSON.stringify({
    title,
    body: message,
    data: { url: url || "/challenge/day/1" },
    tag: "challenge-nudge",
  });

  let sent = 0;
  await Promise.allSettled(
    subscriptions.map(async (sub: { endpoint: string; p256dh: string; auth: string }) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        );
        sent++;
      } catch { /* expired subscription — ignore */ }
    })
  );

  return NextResponse.json({ sent, total: memberIds.length });
}
