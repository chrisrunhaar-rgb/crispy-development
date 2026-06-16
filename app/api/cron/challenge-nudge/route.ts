import { NextResponse } from "next/server";
import webpush from "web-push";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const NUDGE_BODIES: Record<number, string> = {
  1:  "Your first insight is ready. Start strong.",
  2:  "Session 2 is ready. The habit begins here.",
  3:  "Three sessions in. Something worth reading today.",
  4:  "Session 4 is ready. Your insight is waiting.",
  5:  "Five sessions in. Keep building.",
  6:  "Session 6 is ready. Your reading is waiting.",
  7:  "Seven sessions in. You are building momentum.",
  8:  "Session 8 is ready. Your insight is waiting.",
  9:  "Nine sessions in. Keep going.",
  10: "Ten sessions in. Your reading is ready.",
  11: "Session 11 is ready. Eleven sessions of leadership thinking.",
  12: "Twelve sessions in. Your insight is waiting.",
  13: "Session 13 is ready. Keep building.",
  14: "Fourteen sessions in. Your reading is waiting.",
  15: "Session 15 is ready. A quarter of the way there.",
  16: "Sixteen sessions in. Your insight is waiting.",
  17: "Session 17 is ready. Keep going.",
  18: "Eighteen sessions in. Your reading is waiting.",
  19: "Session 19 is ready. Your insight is waiting.",
  20: "Twenty sessions in. One third of the way there.",
  21: "Session 21 is ready. Keep building.",
  22: "Twenty-two sessions in. Your reading is waiting.",
  23: "Session 23 is ready. Your insight is waiting.",
  24: "Twenty-four sessions in. Keep going.",
  25: "Session 25 is ready. Approaching the halfway point.",
  26: "Twenty-six sessions in. Your reading is waiting.",
  27: "Session 27 is ready. Your insight is waiting.",
  28: "Twenty-eight sessions in. Keep building.",
  29: "Session 29 is ready. One away from halfway.",
  30: "Thirty sessions in. Halfway there. Your reading is ready.",
  31: "Session 31 is ready. Past the halfway point.",
  32: "Thirty-two sessions in. Your insight is waiting.",
  33: "Session 33 is ready. Keep going.",
  34: "Thirty-four sessions in. Your reading is waiting.",
  35: "Session 35 is ready. Your insight is waiting.",
  36: "Thirty-six sessions in. Keep building.",
  37: "Session 37 is ready. Your reading is waiting.",
  38: "Thirty-eight sessions in. Your insight is waiting.",
  39: "Session 39 is ready. Keep going.",
  40: "Forty sessions in. Two thirds of the way there.",
  41: "Session 41 is ready. Your insight is waiting.",
  42: "Forty-two sessions in. Keep building.",
  43: "Session 43 is ready. Your reading is waiting.",
  44: "Forty-four sessions in. Your insight is waiting.",
  45: "Session 45 is ready. Forty-five sessions of leadership growth.",
  46: "Fourteen sessions to go. Your reading is ready.",
  47: "Thirteen sessions to go. Your insight is waiting.",
  48: "Twelve sessions to go. Keep going.",
  49: "Eleven sessions to go. Your reading is ready.",
  50: "Ten sessions to go. Your insight is waiting.",
  51: "Nine sessions to go. Your reading is ready.",
  52: "Eight sessions to go. Keep building.",
  53: "Seven sessions to go. Your insight is waiting.",
  54: "Six sessions to go. Your reading is ready.",
  55: "Five sessions to go. Almost there.",
  56: "Four sessions to go. Your insight is waiting.",
  57: "Three sessions to go. Your reading is ready.",
  58: "Two sessions to go. Keep going.",
  59: "One session left after this. Your insight is waiting.",
  60: "Final session. Your last insight is ready. Finish strong.",
};

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
      const body = NUDGE_BODIES[day] ?? "Your insight is waiting.";
      const payload = JSON.stringify({
        title: `Influential Leadership Challenge - Day ${day}`,
        body,
        data: { url: `/challenge/day/${day}` },
        tag: "challenge-nudge",
      });

      const results = await Promise.allSettled(
        subs.map((sub: { endpoint: string; p256dh: string; auth: string }) =>
          webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            payload,
            { urgency: "high", TTL: 60 }
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
