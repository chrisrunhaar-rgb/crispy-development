import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// PATCH — update whiteboard section
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { session_id, section, content } = await req.json();
  if (!session_id || !section || !content) {
    return NextResponse.json({ error: "session_id, section, content required" }, { status: 400 });
  }

  // Verify ownership
  const { data: wb } = await supabase
    .from("wp_whiteboards")
    .select("*")
    .eq("session_id", session_id)
    .eq("user_id", user.id)
    .single();

  if (!wb) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let update: Record<string, unknown> = { updated_at: new Date().toISOString() };

  switch (section) {
    case "focus_today":
      update.focus_today = content;
      break;
    case "key_insight":
      update.key_insights = [...((wb.key_insights as string[]) ?? []), content];
      break;
    case "value_named":
      update.values_named = [...((wb.values_named as string[]) ?? []), content];
      break;
    case "action_step":
      update.action_steps = [...((wb.action_steps as string[]) ?? []), content];
      break;
    case "carrying_forward":
      update.carrying_forward = content;
      break;
    default:
      return NextResponse.json({ error: "Unknown section" }, { status: 400 });
  }

  const { error } = await supabase
    .from("wp_whiteboards")
    .update(update)
    .eq("session_id", session_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
