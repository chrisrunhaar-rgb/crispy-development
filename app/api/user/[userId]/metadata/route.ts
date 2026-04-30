import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only allow admin to fetch other users' data
  const isAdmin = currentUser.email === "chris.runhaar@world-outreach.com";
  const { userId } = await params;

  if (!isAdmin || userId === currentUser.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Fetch target user's auth record
  const admin = createAdminClient();
  const { data: { users } } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const targetAuthUser = users?.find((u) => u.id === userId);

  if (!targetAuthUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Extract metadata
  const metadata = targetAuthUser.user_metadata ?? {};
  const email = targetAuthUser.email;

  return NextResponse.json({
    id: userId,
    email,
    firstName: metadata.first_name ?? email?.split("@")[0] ?? "User",
    lastName: metadata.last_name,
    pathway: metadata.pathway ?? "personal",
    savedResources: metadata.saved_resources ?? [],
    resourceNotes: metadata.resource_notes ?? {},
    resourceRatings: metadata.resource_ratings ?? {},
    resourceRead: metadata.resource_read ?? [],
    completedAssessments: {
      mindsetCompletedAt: !!metadata.mindset_completed_at,
      rglCompletedAt: !!metadata.rlgl_completed_at,
      smartGoalSavedAt: !!metadata.smart_goal_saved_at,
      thinkingStyleCompletedAt: !!metadata.thinking_style_completed_at,
      wheelOfLifeSavedAt: !!metadata.wheel_of_life_saved_at,
      discCompletedAt: !!metadata.disc_completed_at,
      karuniaCompletedAt: !!metadata.karunia_completed_at,
      enneagramCompletedAt: !!metadata.enneagram_completed_at,
      bigFiveCompletedAt: !!metadata.big_five_completed_at,
      personalities16CompletedAt: !!metadata.personalities16_completed_at,
    },
    thinkingStyleResult: metadata.thinking_style_result ?? null,
    thinkingStyleScores: metadata.thinking_style_scores ?? null,
    discResult: metadata.disc_result ?? null,
    discScores: metadata.disc_scores ?? null,
    karuniaTopGifts: metadata.karunia_top_gifts ?? null,
    karuniaScores: metadata.karunia_scores ?? null,
    wheelOfLifeScores: metadata.wheel_of_life_scores ?? null,
    enneagramType: metadata.enneagram_type ?? null,
    enneagramScores: metadata.enneagram_scores ?? null,
    bigFiveScores: metadata.big_five_scores ?? null,
    personalities16Type: metadata.personalities16_type ?? null,
    personalities16Scores: metadata.personalities16_scores ?? null,
    peerGroupId: metadata.peer_group_id ?? undefined,
    timezone: metadata.timezone ?? undefined,
    commStyle: metadata.comm_style ?? null,
    commStyleScores: metadata.comm_style_scores ?? null,
    trustAvg: metadata.trust_avg ?? null,
    trustScores: metadata.trust_scores ?? null,
    contributionZone: metadata.contribution_zone ?? null,
    contributionScores: metadata.contribution_scores ?? null,
    conflictStyle: metadata.conflict_style ?? null,
    conflictScores: metadata.conflict_scores ?? null,
    languagePreference: metadata.language_preference ?? "en",
  });
}
