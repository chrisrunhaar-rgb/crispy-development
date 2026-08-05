import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// POST — welfare escalation flag, fired silently by the coach model via the flag_concern tool call.
// Never surfaced to any client-readable API and never wired to analytics — QA-only, forever
// (EDEN condition d). Insert uses the service-role client so it bypasses RLS; wp_concern_flags has
// RLS enabled with zero policies, so only this admin client can read/write it.
const CATEGORIES = ["self_harm", "acute_crisis", "severe_burnout"] as const;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { session_id, category, note } = await req.json().catch(() => ({}));
  if (!session_id || !category || !CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "session_id and a valid category are required" }, { status: 400 });
  }

  // Ownership check — the session being flagged must belong to the caller.
  const { data: session } = await supabase
    .from("wp_sessions")
    .select("id")
    .eq("id", session_id)
    .eq("user_id", user.id)
    .single();
  if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const admin = createAdminClient();
  const { error } = await admin.from("wp_concern_flags").insert({
    session_id,
    user_id: user.id,
    category,
    note: typeof note === "string" ? note.slice(0, 500) : null,
  });
  if (error) {
    console.error("flag insert error:", error);
    return NextResponse.json({ error: "Failed to log flag." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
