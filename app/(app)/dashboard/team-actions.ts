"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import webpush from "web-push";

export async function unlockNextTeamStep(
  teamId: string,
  nextStep: number
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();

  // Verify this user is the team leader
  const { data: team } = await admin
    .from("teams")
    .select("id, leader_user_id, name")
    .eq("id", teamId)
    .maybeSingle();
  if (!team || team.leader_user_id !== user.id) return { error: "Not authorized" };

  // Update current_step
  const { error } = await admin
    .from("teams")
    .update({ current_step: nextStep })
    .eq("id", teamId);
  if (error) return { error: error.message };

  // Send push notifications to all team members
  try {
    webpush.setVapidDetails(
      "mailto:chris.runhaar@gmail.com",
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!
    );

    const { data: memberRows } = await admin
      .from("team_members")
      .select("user_id")
      .eq("team_id", teamId);
    const memberIds = (memberRows ?? []).map((m: { user_id: string }) => m.user_id);

    if (memberIds.length > 0) {
      const { data: subs } = await admin
        .from("push_subscriptions")
        .select("endpoint, p256dh, auth")
        .in("user_id", memberIds);

      if (subs && subs.length > 0) {
        const payload = JSON.stringify({
          title: `Step ${nextStep} unlocked — ${team.name}`,
          body: "Your team leader has unlocked the next step in your journey. Open the app to continue.",
          data: { url: "/dashboard?tab=team" },
          tag: "team-step-unlock",
        });

        await Promise.allSettled(
          subs.map(async (sub: { endpoint: string; p256dh: string; auth: string }) => {
            try {
              await webpush.sendNotification(
                { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
                payload
              );
            } catch {
              // Subscription expired — ignore
            }
          })
        );
      }
    }
  } catch {
    // Push notification failure is non-fatal — step was already unlocked
  }

  revalidatePath("/dashboard");
  return { error: null };
}

export async function updateTeamMemberProfile(
  teamId: string,
  memberId: string,
  title: string | null,
  tenureLabel: string | null
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();

  const { data: team } = await admin
    .from("teams")
    .select("id, leader_user_id")
    .eq("id", teamId)
    .maybeSingle();
  if (!team || team.leader_user_id !== user.id) return { error: "Not authorized" };

  const { error } = await admin
    .from("team_members")
    .update({ title: title || null, tenure_label: tenureLabel || null })
    .eq("team_id", teamId)
    .eq("user_id", memberId);
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { error: null };
}

export async function updateTeamAssessments(
  teamId: string,
  assessments: string[]
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();
  const { data: teamRow } = await admin
    .from("teams")
    .select("id, leader_user_id")
    .eq("id", teamId)
    .maybeSingle();
  if (!teamRow || teamRow.leader_user_id !== user.id) return { error: "Not authorized" };

  const { error } = await admin
    .from("teams")
    .update({ selected_assessments: assessments })
    .eq("id", teamId);
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { error: null };
}

export async function addTeamMemberByEmail(
  teamId: string,
  email: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();

  const { data: team } = await admin
    .from("teams")
    .select("id, leader_user_id")
    .eq("id", teamId)
    .maybeSingle();
  if (!team || team.leader_user_id !== user.id) return { error: "Not authorized" };

  // Look up user by email in profiles
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();
  if (!profile) return { error: "No account found with that email. They must sign up first." };

  // Check not already a member
  const { data: existing } = await admin
    .from("team_members")
    .select("user_id")
    .eq("team_id", teamId)
    .eq("user_id", profile.id)
    .maybeSingle();
  if (existing) return { error: "This person is already in the team." };

  const { error } = await admin
    .from("team_members")
    .insert({ team_id: teamId, user_id: profile.id });
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { error: null };
}

export async function removeTeamMember(
  teamId: string,
  memberId: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();

  // Verify this user is the team leader
  const { data: team } = await admin
    .from("teams")
    .select("id, leader_user_id")
    .eq("id", teamId)
    .maybeSingle();
  if (!team || team.leader_user_id !== user.id) return { error: "Not authorized" };

  const { error } = await admin
    .from("team_members")
    .delete()
    .eq("team_id", teamId)
    .eq("user_id", memberId);
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { error: null };
}

export async function markTeamStepComplete(
  teamId: string,
  stepNumber: number,
  complete: boolean
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();

  if (complete) {
    await admin
      .from("team_step_data")
      .upsert(
        { team_id: teamId, step_number: stepNumber, user_id: user.id, completed_at: new Date().toISOString() },
        { onConflict: "team_id,step_number,user_id" }
      );
  } else {
    await admin
      .from("team_step_data")
      .delete()
      .eq("team_id", teamId)
      .eq("step_number", stepNumber)
      .eq("user_id", user.id);
  }

  revalidatePath("/dashboard");
  return { error: null };
}

// Resolve step number from a contentUrl slug given selected assessments, then mark complete
const BASE_STEP_URLS = [
  "/team/team-foundations",
  "/team/team-purpose-vision",
  "/team/know-each-other",
  "/team/communication-culture",
  "/team/trust-psychological-safety",
  "/team/roles-contribution",
  "/team/navigating-conflict",
  "/team/decision-making",
  "/team/accountability",
  "/team/forward-together",
];
const ASSESSMENT_INSERT_AFTER: Record<string, { insertAfter: number; url: string; order: number }> = {
  "5languages":           { insertAfter: 3, url: "/team/5languages",            order: 1 },
  "wheel-of-life":        { insertAfter: 3, url: "/team/wheel-of-life",         order: 2 },
  "enneagram":            { insertAfter: 3, url: "/team/enneagram",             order: 3 },
  "disc":                 { insertAfter: 4, url: "/team/disc",                  order: 1 },
  "three-thinking-styles":{ insertAfter: 4, url: "/team/three-thinking-styles", order: 2 },
  "16-personalities":     { insertAfter: 4, url: "/team/16-personalities",      order: 3 },
  "big-five":             { insertAfter: 4, url: "/team/big-five",              order: 4 },
  "karunia-rohani":       { insertAfter: 5, url: "/team/karunia-rohani",        order: 1 },
};
function resolveStepNumber(selectedAssessments: string[], targetUrl: string): number | null {
  const urls: string[] = [];
  BASE_STEP_URLS.forEach((url, idx) => {
    urls.push(url);
    const baseNum = idx + 1;
    selectedAssessments
      .filter(id => ASSESSMENT_INSERT_AFTER[id]?.insertAfter === baseNum)
      .sort((a, b) => (ASSESSMENT_INSERT_AFTER[a].order ?? 99) - (ASSESSMENT_INSERT_AFTER[b].order ?? 99))
      .forEach(id => urls.push(ASSESSMENT_INSERT_AFTER[id].url));
  });
  const idx = urls.indexOf(targetUrl);
  return idx >= 0 ? idx + 1 : null;
}

export async function markStepCompleteByContentKey(contentUrl: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();
  const { data: leadTeam } = await admin.from("teams").select("id, selected_assessments").eq("leader_user_id", user.id).maybeSingle();
  const teamId = leadTeam?.id ?? (await admin.from("team_members").select("team_id, teams(id, selected_assessments)").eq("user_id", user.id).maybeSingle()).data?.team_id;
  const selectedAssessments: string[] = leadTeam?.selected_assessments ?? (await admin.from("team_members").select("teams(selected_assessments)").eq("user_id", user.id).maybeSingle()).data?.teams?.selected_assessments ?? [];

  if (!teamId) return { error: "Not in a team" };

  const stepNumber = resolveStepNumber(selectedAssessments, contentUrl);
  if (!stepNumber) return { error: "Step not found" };

  await admin.from("team_step_data").upsert(
    { team_id: teamId, step_number: stepNumber, user_id: user.id, completed_at: new Date().toISOString() },
    { onConflict: "team_id,step_number,user_id" }
  );
  revalidatePath("/dashboard");
  return { error: null };
}

export async function finalizeTeamStep(
  teamId: string,
  stepNumber: number,
  finalize: boolean
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();

  const { data: team } = await admin
    .from("teams")
    .select("id, leader_user_id, finalized_steps")
    .eq("id", teamId)
    .maybeSingle();
  if (!team || team.leader_user_id !== user.id) return { error: "Not authorized" };

  const current: number[] = team.finalized_steps ?? [];
  const updated = finalize
    ? [...new Set([...current, stepNumber])]
    : current.filter((n: number) => n !== stepNumber);

  const { error } = await admin
    .from("teams")
    .update({ finalized_steps: updated })
    .eq("id", teamId);
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { error: null };
}

export async function lockTeamStep(
  teamId: string,
  toStep: number
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();

  const { data: team } = await admin
    .from("teams")
    .select("id, leader_user_id")
    .eq("id", teamId)
    .maybeSingle();
  if (!team || team.leader_user_id !== user.id) return { error: "Not authorized" };
  if (toStep < 1) return { error: "Cannot go below step 1" };

  const { error } = await admin
    .from("teams")
    .update({ current_step: toStep })
    .eq("id", teamId);
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { error: null };
}

export async function sendTeamBroadcast(
  teamId: string,
  message: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();

  // Verify leader
  const { data: team } = await admin
    .from("teams")
    .select("id, leader_user_id, name")
    .eq("id", teamId)
    .maybeSingle();
  if (!team || team.leader_user_id !== user.id) return { error: "Not authorized" };

  // Save to history
  await admin.from("team_broadcasts").insert({
    team_id: teamId,
    leader_user_id: user.id,
    message,
  });

  // Send push notifications
  try {
    webpush.setVapidDetails(
      "mailto:chris.runhaar@gmail.com",
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!
    );

    const { data: memberRows } = await admin
      .from("team_members")
      .select("user_id")
      .eq("team_id", teamId);
    const memberIds = (memberRows ?? []).map((m: { user_id: string }) => m.user_id);

    if (memberIds.length > 0) {
      const { data: subs } = await admin
        .from("push_subscriptions")
        .select("endpoint, p256dh, auth")
        .in("user_id", memberIds);

      if (subs && subs.length > 0) {
        const payload = JSON.stringify({
          title: `Message from ${team.name}`,
          body: message,
          data: { url: "/dashboard?tab=team" },
          tag: "team-message",
        });

        await Promise.allSettled(
          subs.map(async (sub: { endpoint: string; p256dh: string; auth: string }) => {
            try {
              await webpush.sendNotification(
                { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
                payload
              );
            } catch { /* expired subscription */ }
          })
        );
      }
    }
  } catch { /* push failure is non-fatal */ }

  revalidatePath("/dashboard");
  return { error: null };
}

export async function submitStepFeedback(
  teamId: string,
  stepNumber: number,
  comment: string,
  rating: number | null
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  if (!comment.trim()) return { error: "Comment cannot be empty" };
  if (rating !== null && (rating < 1 || rating > 5)) return { error: "Invalid rating" };

  const admin = createAdminClient();

  const { error } = await admin
    .from("team_step_feedback")
    .upsert(
      {
        team_id: teamId,
        step_number: stepNumber,
        user_id: user.id,
        comment: comment.trim(),
        rating,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "team_id,step_number,user_id" }
    );

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { error: null };
}

export async function renameTeam(
  teamId: string,
  newName: string
): Promise<{ error: string | null }> {
  const name = newName.trim();
  if (!name) return { error: "Name cannot be empty" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();
  const { data: team } = await admin
    .from("teams")
    .select("id, leader_user_id")
    .eq("id", teamId)
    .maybeSingle();
  if (!team || team.leader_user_id !== user.id) return { error: "Not authorized" };

  const { error } = await admin
    .from("teams")
    .update({ name })
    .eq("id", teamId);
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { error: null };
}
