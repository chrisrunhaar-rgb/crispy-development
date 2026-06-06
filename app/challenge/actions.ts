"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function signUpChallenge(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://crispyleaders.com";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?type=signup&next=/challenge/day/1`,
      data: {
        first_name: firstName,
        last_name: lastName,
        pathway: "personal",
        challenge_enrolled: true,
        onboarding_complete: true,
        language_preference: "en",
      },
    },
  });

  if (error) return { error: error.message };

  if (data.user) {
    const admin = createAdminClient();
    await admin.from("challenge_enrollments").upsert({
      user_id: data.user.id,
      path: "solo",
      current_day: 1,
      status: "active",
    }, { onConflict: "user_id" });
  }

  if (!data.session) {
    redirect("/signup/confirm");
  }

  revalidatePath("/", "layout");
  redirect("/challenge/day/1");
}

export async function enrollExistingUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/challenge/solo");

  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("challenge_enrollments")
    .select("id, current_day")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    redirect(`/challenge/day/${existing.current_day}`);
  }

  await supabase.auth.updateUser({
    data: { challenge_enrolled: true },
  });

  await admin.from("challenge_enrollments").insert({
    user_id: user.id,
    path: "solo",
    current_day: 1,
    status: "active",
  });

  revalidatePath("/", "layout");
  redirect("/challenge/day/1");
}

export async function saveJournalEntry(dayNumber: number, answer1: string, answer2: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("challenge_journal_entries")
    .upsert({
      user_id: user.id,
      day_number: dayNumber,
      answer_1: answer1,
      answer_2: answer2,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,day_number" });

  if (error) return { error: error.message };
  return { success: true };
}

export async function saveTeamAnswer(dayNumber: number, peerAnswer: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("challenge_journal_entries")
    .upsert({
      user_id: user.id,
      day_number: dayNumber,
      peer_answer: peerAnswer,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,day_number" });

  if (error) return { error: error.message };
  return { success: true };
}

export async function advanceToNextDay(currentDay: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const nextDay = Math.min(currentDay + 1, 62);

  await supabase
    .from("challenge_enrollments")
    .update({ current_day: nextDay })
    .eq("user_id", user.id)
    .lt("current_day", nextDay);

  revalidatePath("/challenge/day/[n]", "page");
  revalidatePath("/dashboard");
  return { success: true, nextDay };
}
