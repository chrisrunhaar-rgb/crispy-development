"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

// Save Wheel of Life scores to user profile
export async function saveWheelScores(scores: Record<string, number>): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.auth.updateUser({
    data: { wheel_of_life_scores: scores, wheel_of_life_saved_at: new Date().toISOString() },
  });

  if (!error) {
    revalidatePath("/dashboard");
    revalidatePath("/resources/wheel-of-life");
  }
  return { error: error?.message ?? null };
}
