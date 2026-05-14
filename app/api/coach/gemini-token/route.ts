import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildWorkerContext } from "@/lib/coach/buildContext";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({})) as { coachName?: string };
    const coachName = typeof body.coachName === "string" && body.coachName.trim() ? body.coachName.trim() : "Tara";

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Gemini not configured" }, { status: 500 });

    const { data: profile, error: profileError } = await supabase
      .from("wp_worker_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();
    if (profileError && profileError.code !== "PGRST116") console.error("Profile fetch error:", profileError);

    const { data: recentSessions, error: sessionsError } = await supabase
      .from("wp_sessions")
      .select("session_number, started_at, wp_whiteboards(focus_today, key_insights, action_steps, carrying_forward)")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .order("started_at", { ascending: false })
      .limit(3);
    if (sessionsError) console.error("Sessions fetch error:", sessionsError);

    const systemPrompt = buildWorkerContext(profile, recentSessions ?? [], user, coachName);

    return NextResponse.json({ apiKey, systemPrompt });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("gemini-token error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
