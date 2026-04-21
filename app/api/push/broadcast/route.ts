import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_USER_ID = "e04e4310-075a-4df5-9113-4fe7f993afe6";

export async function POST(req: NextRequest) {
  webpush.setVapidDetails(
    "mailto:chris.runhaar@gmail.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.id !== ADMIN_USER_ID) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, message, url } = body;

  if (!title || !message) {
    return NextResponse.json({ error: "title and message are required" }, { status: 400 });
  }

  // Fetch ALL push subscriptions across the platform
  const admin = createAdminClient();
  const { data: subscriptions } = await admin
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth");

  if (!subscriptions || subscriptions.length === 0) {
    return NextResponse.json({ sent: 0, errors: 0, note: "No subscribers" });
  }

  const payload = JSON.stringify({
    title,
    body: message,
    data: { url: url || "/resources" },
    tag: "new-resource",
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

  return NextResponse.json({ sent, errors, total: subscriptions.length });
}
