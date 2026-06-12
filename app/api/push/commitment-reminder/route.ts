import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { task, remindAt, subscription } = body as {
    task: string;
    remindAt: string;
    subscription: { endpoint: string; keys: { p256dh: string; auth: string } };
  };

  if (!task || !remindAt || !subscription?.endpoint) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Upsert push subscription
  await supabase
    .from("push_subscriptions")
    .upsert(
      {
        user_id: user.id,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
      { onConflict: "user_id,endpoint" }
    );

  // Save commitment reminder
  const { error } = await supabase.from("commitment_reminders").insert({
    user_id: user.id,
    task,
    remind_at: remindAt,
    endpoint: subscription.endpoint,
    p256dh: subscription.keys.p256dh,
    auth_key: subscription.keys.auth,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
