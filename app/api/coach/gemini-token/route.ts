import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildWorkerContext } from "@/lib/coach/buildContext";
import { GoogleGenAI } from "@google/genai";

// In-memory per-user rate limit: max 20 calls per 60 minutes
const rateLimitMap = new Map<string, number[]>();

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({})) as { coachName?: string; sessionType?: string };
    const coachName = typeof body.coachName === "string" && body.coachName.trim() ? body.coachName.trim() : "Tara";
    const sessionType = body.sessionType === "quick" ? "quick" as const : "deep" as const;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Rate limit check: max 20 calls per user per 60 minutes
    const now = Date.now();
    const windowMs = 3600000; // 60 minutes
    const maxCalls = 20;
    const userId = user.id;
    const timestamps = (rateLimitMap.get(userId) ?? []).filter(t => now - t < windowMs);
    if (timestamps.length >= maxCalls) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }
    timestamps.push(now);
    rateLimitMap.set(userId, timestamps);

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

    const coachingStyle = profile?.coaching_style === "direct" ? "direct" as const : "relational" as const;
    const systemPrompt = buildWorkerContext(profile, recentSessions ?? [], user, coachName, sessionType, coachingStyle);

    // Create short-lived ephemeral token — never expose raw API key to browser
    const serverAi = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: "v1alpha" } });
    const expireTime = new Date(Date.now() + 20 * 60 * 1000).toISOString();
    const token = await serverAi.authTokens.create({ config: { uses: 2, expireTime } });

    return NextResponse.json({ ephemeralToken: token.name, systemPrompt });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("gemini-token error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
