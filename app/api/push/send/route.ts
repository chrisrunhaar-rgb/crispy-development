import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  // Set VAPID details lazily (env vars not available at module evaluation during build)
  webpush.setVapidDetails(
    "mailto:chris.runhaar@gmail.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify caller is a team leader
  const { data: team } = await supabase
    .from("teams")
    .select("id")
    .eq("leader_user_id", user.id)
    .maybeSingle();

  if (!team) {
    return NextResponse.json({ error: "Only team leaders can send notifications" }, { status: 403 });
  }

  const body = await req.json();
  const { title, message, url, userIds } = body;

  if (!title || !message) {
    return NextResponse.json({ error: "title and message are required" }, { status: 400 });
  }

  // Get target user IDs — either provided list or all team members
  const admin = createAdminClient();
  let targetIds: string[] = userIds ?? [];

  if (targetIds.length === 0) {
    const { data: members } = await admin
      .from("team_members")
      .select("user_id")
      .eq("team_id", team.id);
    targetIds = (members ?? []).map((m: { user_id: string }) => m.user_id);
  }

  if (targetIds.length === 0) {
    return NextResponse.json({ sent: 0, errors: 0 });
  }

  // Get push subscriptions for all target users
  const { data: subscriptions } = await admin
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .in("user_id", targetIds);

  if (!subscriptions || subscriptions.length === 0) {
    return NextResponse.json({ sent: 0, errors: 0, note: "No subscribers" });
  }

  const payload = JSON.stringify({
    title,
    body: message,
    data: { url: url || "/dashboard" },
    tag: "team-notification",
  });

  let sent = 0;
  let errors = 0;

  await Promise.allSettled(
    subscriptions.map(async (sub: { endpoint: string; p256dh: string; auth: string }) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        );
        sent++;
      } catch {
        errors++;
      }
    })
  );

  return NextResponse.json({ sent, errors });
}
