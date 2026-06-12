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

  const { data: reminders, error } = await admin
    .from("commitment_reminders")
    .select("id, task, endpoint, p256dh, auth_key")
    .eq("sent", false)
    .lte("remind_at", new Date().toISOString());

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!reminders || reminders.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  let sent = 0;
  const sentIds: string[] = [];

  await Promise.allSettled(
    reminders.map(async (r: { id: string; task: string; endpoint: string; p256dh: string; auth_key: string }) => {
      const payload = JSON.stringify({
        title: "Time to start",
        body: r.task,
        data: { url: "/resources/overcoming-procrastination" },
        tag: "commitment-reminder",
      });

      try {
        await webpush.sendNotification(
          { endpoint: r.endpoint, keys: { p256dh: r.p256dh, auth: r.auth_key } },
          payload,
          { urgency: "high", TTL: 60 }
        );
        sent++;
        sentIds.push(r.id);
      } catch (err) {
        const e = err as { statusCode?: number };
        if (e?.statusCode === 410) {
          await admin.from("commitment_reminders").update({ sent: true }).eq("id", r.id);
        }
      }
    })
  );

  if (sentIds.length > 0) {
    await admin.from("commitment_reminders").update({ sent: true }).in("id", sentIds);
  }

  return NextResponse.json({ sent, total: reminders.length });
}
