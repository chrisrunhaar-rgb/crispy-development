import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST — create new session
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get next session number
  const { count } = await supabase
    .from("wp_sessions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "completed");

  const sessionNumber = (count ?? 0) + 1;

  const { data: session, error } = await supabase
    .from("wp_sessions")
    .insert({ user_id: user.id, session_number: sessionNumber, phase: "LAND" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Create blank whiteboard
  await supabase.from("wp_whiteboards").insert({
    session_id: session.id,
    user_id: user.id,
    key_insights: [],
    values_named: [],
    action_steps: [],
  });

  return NextResponse.json({ session });
}

// DELETE — permanently remove whiteboard notes for a session
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("id");
  if (!sessionId) return NextResponse.json({ error: "Missing session id" }, { status: 400 });

  // Verify session belongs to this user
  const { data: session } = await supabase
    .from("wp_sessions")
    .select("id")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single();

  if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { error } = await supabase
    .from("wp_whiteboards")
    .delete()
    .eq("session_id", sessionId)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

// PATCH — update session (phase, transcript, complete)
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { session_id, phase, transcript_entry, complete, duration_seconds, clarity_score, alliance_score, value_score, checkin_note } = body;

  if (!session_id) return NextResponse.json({ error: "session_id required" }, { status: 400 });

  // Verify ownership
  const { data: session } = await supabase
    .from("wp_sessions")
    .select("id, transcript")
    .eq("id", session_id)
    .eq("user_id", user.id)
    .single();

  if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updates: Record<string, unknown> = {};
  if (phase) updates.phase = phase;
  if (complete) {
    updates.status = "completed";
    updates.completed_at = new Date().toISOString();
  }
  if (duration_seconds) updates.duration_seconds = duration_seconds;
  if (transcript_entry) {
    const existing = (session.transcript as unknown[]) ?? [];
    updates.transcript = [...existing, transcript_entry];
  }
  // Post-session check-in — 3-question modal (clarity, felt understood, session value), each 1-5, + optional note.
  const score1to5 = (v: unknown) => {
    const n = Number(v);
    return Number.isInteger(n) && n >= 1 && n <= 5 ? n : null;
  };
  if (clarity_score !== undefined && clarity_score !== null) {
    const n = score1to5(clarity_score);
    if (n !== null) updates.clarity_score = n;
  }
  if (alliance_score !== undefined && alliance_score !== null) {
    const n = score1to5(alliance_score);
    if (n !== null) updates.alliance_score = n;
  }
  if (value_score !== undefined && value_score !== null) {
    const n = score1to5(value_score);
    if (n !== null) updates.value_score = n;
  }
  if (typeof checkin_note === "string") updates.checkin_note = checkin_note.slice(0, 280) || null;

  const { error } = await supabase
    .from("wp_sessions")
    .update(updates)
    .eq("id", session_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
