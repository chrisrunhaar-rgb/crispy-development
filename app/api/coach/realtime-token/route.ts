import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildWorkerContext } from "@/lib/coach/buildContext";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const apiKey = (process.env.OPENAI_API_KEY ?? "").replace(/^﻿/, "");
    if (!apiKey) return NextResponse.json({ error: "OpenAI not configured" }, { status: 500 });

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

    const workerContext = buildWorkerContext(profile, recentSessions ?? [], user);

    const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview",
        voice: "alloy",
        instructions: workerContext,
        input_audio_transcription: { model: "whisper-1" },
        turn_detection: {
          type: "server_vad",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500,
        },
        tools: [
          {
            type: "function",
            name: "update_whiteboard",
            description: "Update the coaching whiteboard. Call throughout the session whenever something meaningful surfaces — don't wait for the end.",
            parameters: {
              type: "object",
              properties: {
                section: {
                  type: "string",
                  enum: ["focus_today", "key_insight", "value_named", "action_step", "carrying_forward"],
                  description: "Which whiteboard section to update",
                },
                content: {
                  type: "string",
                  description: "Concise text — one sentence max.",
                },
              },
              required: ["section", "content"],
            },
          },
          {
            type: "function",
            name: "advance_phase",
            description: "Signal the session is moving to the next phase.",
            parameters: {
              type: "object",
              properties: {
                phase: {
                  type: "string",
                  enum: ["LAND", "SEEK", "EXPLORE", "COMMIT", "CARRY", "COMPLETE"],
                },
              },
              required: ["phase"],
            },
          },
        ],
        tool_choice: "auto",
      }),
    });

    if (!r.ok) {
      const err = await r.text();
      console.error("realtime-token OpenAI error:", err);
      return NextResponse.json({ error: `OpenAI ${r.status}: ${err}` }, { status: r.status });
    }

    const session = await r.json();
    return NextResponse.json({ client_secret: session.client_secret });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("realtime-token error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
