import { NextResponse } from "next/server";
import webpush from "web-push";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  webpush.setVapidDetails(
    "mailto:chris.runhaar@gmail.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  const admin = createAdminClient();

  // Find users whose notification time matches NOW() in their timezone,
  // today's day of week is in their reading days, and they haven't been nudged today yet.
  const { data: enrollments, error } = await admin.rpc("get_due_challenge_nudges");

  if (error) {
    console.error("challenge-nudge cron error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!enrollments || enrollments.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  let sent = 0;
  const userIds: string[] = [];

  await Promise.allSettled(
    (enrollments as Array<{ user_id: string; current_day: number }>) .map(async (enrollment) => {
      const { data: subs } = await admin
        .from("push_subscriptions")
        .select("endpoint, p256dh, auth")
        .eq("user_id", enrollment.user_id);

      if (!subs || subs.length === 0) return;

      const day = enrollment.current_day;
      const payload = JSON.stringify({
        title: `Day ${day} is ready 📖`,
        body: "Your daily leadership reading is waiting.",
        data: { url: `/challenge/day/${day}` },
        tag: "challenge-nudge",
      });

      const results = await Promise.allSettled(
        subs.map((sub: { endpoint: string; p256dh: string; auth: string }) =>
          webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            payload
          )
        )
      );

      // Remove expired subscriptions (410 Gone = endpoint permanently invalid)
      const staleEndpoints: string[] = [];
      results.forEach((result, i) => {
        if (result.status === "rejected") {
          const err = result.reason as { statusCode?: number };
          if (err?.statusCode === 410) {
            staleEndpoints.push(subs[i].endpoint);
          }
        }
      });
      if (staleEndpoints.length > 0) {
        await admin
          .from("push_subscriptions")
          .delete()
          .eq("user_id", enrollment.user_id)
          .in("endpoint", staleEndpoints);
      }

      const didSend = results.some(r => r.status === "fulfilled");
      if (didSend) {
        sent++;
        userIds.push(enrollment.user_id);
      }
    })
  );

  // Mark nudge sent for today
  if (userIds.length > 0) {
    await admin
      .from("challenge_enrollments")
      .update({ last_nudge_sent_at: new Date().toISOString() })
      .in("user_id", userIds);
  }

  return NextResponse.json({ sent, total: enrollments.length });
}
