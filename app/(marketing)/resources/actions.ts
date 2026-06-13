"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { GoogleGenAI } from "@google/genai";

async function saveToTeamIfMember(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  resultType: string,
  resultKey: string,
  scores: Record<string, number>
): Promise<void> {
  const { data: leadTeam } = await supabase.from("teams").select("id").eq("leader_user_id", userId).maybeSingle();
  const teamId = leadTeam?.id ?? (await supabase.from("team_members").select("team_id").eq("user_id", userId).maybeSingle()).data?.team_id;
  if (!teamId) return;
  await supabase.from("team_member_results").upsert(
    { team_id: teamId, user_id: userId, result_type: resultType, result_key: resultKey, scores, completed_at: new Date().toISOString() },
    { onConflict: "team_id,user_id,result_type" }
  );
}

// Called directly from client components (returns result)
export async function saveResourceToDashboard(slug: string): Promise<{ error: string | null; already?: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const current = (user.user_metadata?.saved_resources ?? []) as string[];
  if (current.includes(slug)) return { error: null, already: true };

  const { error } = await supabase.auth.updateUser({
    data: { saved_resources: [...current, slug] },
  });

  if (!error) {
    revalidatePath("/dashboard");
    revalidatePath("/resources");
    revalidatePath(`/resources/${slug}`);
  }
  return { error: error?.message ?? null };
}

export async function removeResourceFromDashboard(slug: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const current = (user.user_metadata?.saved_resources ?? []) as string[];
  const updated = current.filter((s: string) => s !== slug);

  await supabase.auth.updateUser({ data: { saved_resources: updated } });
  revalidatePath("/dashboard");
}

// Used as a form action in server components
export async function saveResourceFormAction(formData: FormData): Promise<void> {
  const slug = formData.get("slug") as string | null;
  if (!slug) return;
  await saveResourceToDashboard(slug);
}

// Save Fixed vs Growth Mindset assessment score
export async function saveMindsetScore(percentage: number): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.auth.updateUser({
    data: { mindset_score: percentage, mindset_completed_at: new Date().toISOString() },
  });

  if (!error) {
    revalidatePath("/dashboard");
    revalidatePath("/resources/fixed-growth-mindset");
  }
  return { error: error?.message ?? null };
}

// Save Red Light / Green Light quiz score
export async function saveRLGLScore(percentage: number): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.auth.updateUser({
    data: { rlgl_score: percentage, rlgl_completed_at: new Date().toISOString() },
  });

  if (!error) {
    revalidatePath("/dashboard");
    revalidatePath("/resources/red-light-green-light");
  }
  return { error: error?.message ?? null };
}

// Save SMART Goals worksheet data
export async function saveSmartGoal(goalData: Record<string, string>): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.auth.updateUser({
    data: { smart_goal: goalData, smart_goal_saved_at: new Date().toISOString() },
  });

  if (!error) {
    revalidatePath("/dashboard");
    revalidatePath("/resources/smart-goals");
  }
  return { error: error?.message ?? null };
}

// Save Three Thinking Styles quiz result
export async function saveThinkingStyleResult(
  resultKey: string,
  scores: { C: number; H: number; I: number }
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.auth.updateUser({
    data: {
      thinking_style_result: resultKey,
      thinking_style_scores: scores,
      thinking_style_completed_at: new Date().toISOString(),
    },
  });

  if (!error) {
    await saveToTeamIfMember(supabase, user.id, "thinking_style", resultKey, scores);
    revalidatePath("/dashboard");
    revalidatePath("/resources/three-thinking-styles");
  }
  return { error: error?.message ?? null };
}

// Save DISC Personality Profile result
export async function saveDISCResult(
  primaryType: string,
  scores: { D: number; I: number; S: number; C: number }
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  const { error } = await supabase.auth.updateUser({
    data: {
      disc_result: primaryType,
      disc_scores: scores,
      disc_completed_at: new Date().toISOString(),
    },
  });
  if (!error) {
    await saveToTeamIfMember(supabase, user.id, "disc", primaryType, scores);
    revalidatePath("/dashboard");
    revalidatePath("/resources/disc");
  }
  return { error: error?.message ?? null };
}

// Save Karunia Rohani (Spiritual Gifts) assessment result
export async function saveKaruniaResult(
  topGifts: string[],
  scores: Record<string, number>
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  const { error } = await supabase.auth.updateUser({
    data: {
      karunia_top_gifts: topGifts,
      karunia_scores: scores,
      karunia_completed_at: new Date().toISOString(),
    },
  });
  if (!error) {
    await saveToTeamIfMember(supabase, user.id, "karunia", topGifts[0] ?? "unknown", scores);
    revalidatePath("/dashboard");
    revalidatePath("/resources/karunia-rohani");
  }
  return { error: error?.message ?? null };
}

// Save Enneagram result
export async function saveEnneagramResult(
  primaryType: number,
  scores: Record<string, number>
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  const { error } = await supabase.auth.updateUser({
    data: {
      enneagram_type: primaryType,
      enneagram_scores: scores,
      enneagram_completed_at: new Date().toISOString(),
    },
  });
  if (!error) {
    await saveToTeamIfMember(supabase, user.id, "enneagram", String(primaryType), scores);
    revalidatePath("/dashboard");
    revalidatePath("/resources/enneagram");
  }
  return { error: error?.message ?? null };
}

// Save Big Five (OCEAN) result
export async function saveBigFiveResult(
  scores: Record<string, number>
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  const { error } = await supabase.auth.updateUser({
    data: {
      big_five_scores: scores,
      big_five_completed_at: new Date().toISOString(),
    },
  });
  if (!error) {
    const topTrait = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "O";
    await saveToTeamIfMember(supabase, user.id, "big_five", topTrait, scores);
    revalidatePath("/dashboard");
    revalidatePath("/resources/big-five");
  }
  return { error: error?.message ?? null };
}

// Save 16 Personalities result
export async function save16PersonalitiesResult(
  type: string,
  scores: Record<string, number>
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  const { error } = await supabase.auth.updateUser({
    data: {
      personalities16_type: type,
      personalities16_scores: scores,
      personalities16_completed_at: new Date().toISOString(),
    },
  });
  if (!error) {
    await saveToTeamIfMember(supabase, user.id, "personalities16", type, scores);
    revalidatePath("/dashboard");
    revalidatePath("/resources/16-personalities");
  }
  return { error: error?.message ?? null };
}


// Save 5 Languages of Appreciation result
export async function saveFiveLanguagesResult(
  receivingPrimary: string,
  givingPrimary: string,
  receivingScores: { A: number; B: number; C: number; D: number; E: number },
  givingScores: { A: number; B: number; C: number; D: number; E: number }
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  const { error } = await supabase.auth.updateUser({
    data: {
      fivela_receiving_result: receivingPrimary,
      fivela_giving_result: givingPrimary,
      fivela_receiving_scores: receivingScores,
      fivela_giving_scores: givingScores,
      fivela_completed_at: new Date().toISOString(),
    },
  });
  if (!error) {
    await saveToTeamIfMember(supabase, user.id, "5languages", receivingPrimary, { ...receivingScores });
    revalidatePath("/dashboard");
    revalidatePath("/resources/5languages");
  }
  return { error: error?.message ?? null };
}

// Save a personal note on a resource
export async function saveResourceNote(slug: string, note: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const current = (user.user_metadata?.resource_notes ?? {}) as Record<string, string>;
  const updated = { ...current, [slug]: note };
  await supabase.auth.updateUser({ data: { resource_notes: updated } });
  revalidatePath("/dashboard");
}

// ── Module Comments ──────────────────────────────────────────────────────────

async function sendTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: "8799746124", text, parse_mode: "HTML" }),
    });
  } catch {
    // silent — never block the user action
  }
}

export async function submitModuleComment(
  slug: string,
  comment: string,
  visibility: "private" | "public_pending"
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const firstName = user.user_metadata?.first_name as string | undefined;
  const lastName = user.user_metadata?.last_name as string | undefined;
  const displayName = [firstName, lastName].filter(Boolean).join(" ") || user.email?.split("@")[0] || "Anonymous";

  const { error } = await supabase.from("module_comments").insert({
    user_id: user.id,
    module_slug: slug,
    comment: comment.trim(),
    visibility,
    display_name: displayName,
  });

  if (error) return { error: error.message };

  const visLabel = visibility === "private" ? "🔒 Private (to Crispy only)" : "🌐 Public pending approval";
  const resourceName = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const msg = `💬 <b>FROM THE FIELD</b> — ${resourceName}\n\n${visLabel}\n<b>From:</b> ${displayName}\n\n"${comment.trim().slice(0, 300)}${comment.length > 300 ? "…" : ""}"`;
  await sendTelegram(msg);

  revalidatePath(`/resources/${slug}`);
  return { error: null };
}

export async function deleteModuleComment(commentId: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("module_comments")
    .update({ status: "deleted" })
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  return { error: null };
}

export async function markCommentReplySeen(commentId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from("module_comments")
    .update({ reply_seen: true })
    .eq("id", commentId)
    .eq("user_id", user.id);
}

// ── Impact Rating ─────────────────────────────────────────────────────────────

// Save an impact rating (1–5) on a resource
export async function saveResourceRating(slug: string, rating: number): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const current = (user.user_metadata?.resource_ratings ?? {}) as Record<string, number>;
  const updated = { ...current, [slug]: rating };
  await supabase.auth.updateUser({ data: { resource_ratings: updated } });
  revalidatePath("/dashboard");
}

// Mark a resource as read
export async function markResourceRead(slug: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const current = (user.user_metadata?.resource_read ?? []) as string[];
  if (current.includes(slug)) return;

  await supabase.auth.updateUser({ data: { resource_read: [...current, slug] } });
  revalidatePath("/dashboard");
}

// Save Wheel of Life reflections (gratitude + action per segment)
export async function saveWheelReflections(
  reflections: Record<string, { gratitude: string; action: string }>
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.auth.updateUser({
    data: {
      wheel_reflections: reflections,
      wheel_reflections_saved_at: new Date().toISOString(),
    },
  });

  if (!error) {
    revalidatePath("/dashboard");
    revalidatePath("/resources/wheel-of-life");
  }
  return { error: error?.message ?? null };
}

// Save RAFT / RPPP plan answers
export async function saveRaftPlan(
  answers: { R: string; A: string; F: string; T: string },
  lang: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.auth.updateUser({
    data: {
      raft_plan: { ...answers, lang, saved_at: new Date().toISOString() },
    },
  });

  if (!error) {
    revalidatePath("/dashboard");
    revalidatePath("/resources/healthy-transitions");
  }
  return { error: error?.message ?? null };
}

// Save Wheel of Life scores to user profile
export async function saveWheelScores(scores: Record<string, number>): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.auth.updateUser({
    data: { wheel_of_life_scores: scores, wheel_of_life_saved_at: new Date().toISOString() },
  });

  if (!error) {
    const vals = Object.values(scores);
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    await saveToTeamIfMember(supabase, user.id, "wheel_of_life", String(Math.round(avg * 10) / 10), scores);
    revalidatePath("/dashboard");
    revalidatePath("/resources/wheel-of-life");
  }
  return { error: error?.message ?? null };
}

export async function saveSmartGoalToTable(data: {
  goal: string;
  answers: Record<string, string>;
  overallScore: number;
}): Promise<{ error: string | null; id?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: row, error } = await supabase
    .from("smart_goals")
    .insert({ user_id: user.id, goal: data.goal, answers: data.answers, overall_score: data.overallScore })
    .select("id")
    .single();

  if (!error) {
    revalidatePath("/dashboard");
    revalidatePath("/resources/smart-goals");
  }
  return { error: error?.message ?? null, id: row?.id };
}

export async function getSmartGoalAiSuggestion(
  goalText: string,
  letter: string,
  word: string,
  weakQuestions: string[]
): Promise<{ suggestion: string | null; error: string | null }> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const weakContext = weakQuestions.length > 0
      ? `\n\nThe user answered "partly" or "not yet" on these questions:\n${weakQuestions.map(q => `- ${q}`).join("\n")}`
      : "";
    const prompt = `You are a cross-cultural leadership coach helping a leader refine their goal. Your audience includes field workers, cross-cultural workers, ministry leaders, and NGO staff — not corporate executives. Use warm, practical, mission-oriented language. Avoid business jargon like "department", "KPIs", "onboarding", "stakeholders", or "ROI".

The leader is working on making their goal more ${word}.

Their current goal: "${goalText}"${weakContext}

List 2–3 concrete elements they should ADD to make this goal more ${word}. Do not rewrite the goal. Give short, practical bullet points — each starting with "Add", "Include", or "Specify". Keep the language personal and grounded, as if coaching a person, not writing a business plan.

Return only the bullet points. No intro, no explanation, no labels.`;

    const result = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
    const text = result.text?.trim() ?? "";
    if (!text) return { suggestion: null, error: "No suggestion returned." };
    return { suggestion: text, error: null };
  } catch {
    return { suggestion: null, error: "Could not generate suggestion." };
  }
}

export async function getSmartGoalAiScore(
  goalText: string
): Promise<{ score: number | null; reason: string | null; error: string | null }> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const prompt = `You are a cross-cultural leadership coach. Score this SMART goal from 1 to 5 based on how well it meets the SMART criteria (Specific, Measurable/Trackable, Achievable, Relevant, Time-bound). Consider that the writer may be a field worker, missionary, or cross-cultural ministry leader — not a corporate employee. Avoid penalising faith-based or ministry language.

Return ONLY a valid JSON object on a single line with no other text:
{"score": N, "reason": "one short sentence explaining the score"}

Where N is an integer from 1 (very weak SMART goal) to 5 (excellent SMART goal).

Goal: "${goalText}"`;
    const result = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
    const text = result.text?.trim() ?? "";
    if (!text) return { score: null, reason: null, error: "No response returned." };
    const jsonMatch = text.match(/\{[^}]+\}/);
    if (!jsonMatch) return { score: null, reason: null, error: "Could not parse score." };
    const parsed = JSON.parse(jsonMatch[0]);
    const score = Math.min(5, Math.max(1, Math.round(Number(parsed.score))));
    return { score, reason: String(parsed.reason ?? ""), error: null };
  } catch {
    return { score: null, reason: null, error: "Could not score goal." };
  }
}

export async function getSmartGoalCoachingResponse(
  goalText: string,
  action: "clarify" | "reframe" | "negotiate"
): Promise<{ response: string | null; error: string | null }> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const prompts = {
      clarify: `You are a cross-cultural leadership coach. A leader has written this goal:\n\n"${goalText}"\n\nAsk ONE short question that surfaces something genuinely unclear or missing in this goal — something not answered by what they have written. Focus on real-world clarity. Warm and direct. One sentence only. No preamble, no label, no dash at the start.`,
      reframe: `You are a cross-cultural leadership coach. A leader has written this goal:\n\n"${goalText}"\n\nAsk ONE reflective question that invites this leader to connect their goal to a deeper value, calling, or conviction — something that would fuel their commitment when things get hard. Audience: cross-cultural workers, ministry leaders, field workers. Warm, spiritually aware, direct. One sentence only. No preamble.`,
      negotiate: `You are a cross-cultural leadership coach. A leader has written this goal:\n\n"${goalText}"\n\nGive ONE concrete suggestion to adjust the scope, timeline, or approach so this goal is more achievable without losing its meaning. Consider they may work in a cross-cultural, low-resource, or complex environment. Use "Consider..." or "What if you..." framing. 1–2 sentences. No preamble.`,
    };
    const result = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompts[action] });
    const text = result.text?.trim() ?? "";
    if (!text) return { response: null, error: "No response returned." };
    return { response: text, error: null };
  } catch {
    return { response: null, error: "Could not generate response." };
  }
}
