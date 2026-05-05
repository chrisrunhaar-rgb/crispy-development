"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/dashboard";
  const inviteToken = (formData.get("inviteToken") as string | null) ?? "";
  const memberInviteToken = (formData.get("memberInviteToken") as string | null) ?? "";

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  if (inviteToken && data.user) {
    const { acceptInvite } = await import("@/app/(app)/dashboard/actions");
    await acceptInvite(inviteToken, data.user.id);
  }
  if (memberInviteToken && data.user) {
    const { acceptMemberInvite } = await import("@/app/(app)/dashboard/actions");
    await acceptMemberInvite(memberInviteToken, data.user.id);
  }

  revalidatePath("/", "layout");
  redirect(inviteToken || memberInviteToken ? "/dashboard?joined=1" : redirectTo);
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const pathway = (formData.get("pathway") as string) || "personal";
  const inviteToken = (formData.get("inviteToken") as string | null) ?? "";
  const memberInviteToken = (formData.get("memberInviteToken") as string | null) ?? "";
  const marketingConsent = formData.get("marketingConsent") === "true";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://crispyleaders.com";
  const callbackExtra = inviteToken ? `?invite=${inviteToken}` : memberInviteToken ? `?member_invite=${memberInviteToken}` : "";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback${callbackExtra}`,
      data: { first_name: firstName, last_name: lastName, pathway, marketing_consent: marketingConsent },
    },
  });

  if (error) return { error: error.message };

  if (!data.session) {
    redirect(`/signup/confirm${callbackExtra}`);
  }

  if (inviteToken && data.user) {
    const { acceptInvite } = await import("@/app/(app)/dashboard/actions");
    await acceptInvite(inviteToken, data.user.id);
  }
  if (memberInviteToken && data.user) {
    const { acceptMemberInvite } = await import("@/app/(app)/dashboard/actions");
    await acceptMemberInvite(memberInviteToken, data.user.id);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function submitTeamApplication(formData: FormData) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Not authenticated." };

  const teamSize = (formData.get("teamSize") as string | null)?.trim() ?? "";
  const organisation = (formData.get("organisation") as string | null)?.trim() ?? "";
  const workType = (formData.get("workType") as string | null)?.trim() ?? "";
  const reason = (formData.get("reason") as string | null)?.trim() ?? "";

  if (!teamSize || !organisation || !workType || !reason) {
    return { error: "Please complete all fields." };
  }

  // Check if application already exists
  const { data: existing } = await supabase
    .from("team_applications")
    .select("id, status")
    .eq("user_id", user.id)
    .single();

  if (existing) {
    if (existing.status === "pending") return { error: "Your application is already under review." };
    if (existing.status === "approved") return { error: "Your application has already been approved." };
  }

  const { error } = await supabase.from("team_applications").insert({
    user_id: user.id,
    user_email: user.email!,
    first_name: user.user_metadata?.first_name ?? null,
    last_name: user.user_metadata?.last_name ?? null,
    team_size: teamSize,
    organisation,
    work_type: workType,
    reason,
    status: "pending",
  });

  if (error) return { error: "Something went wrong. Please try again." };

  return { success: true };
}

async function notifyTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_NOTIFY_CHAT_ID;
  if (!token || !chatId) return; // silently skip if not configured
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
  } catch {
    // non-blocking — message still saved even if notification fails
  }
}

export async function submitCoachMessage(formData: FormData) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Not authenticated." };

  const subject = (formData.get("subject") as string | null)?.trim() ?? "";
  const message = (formData.get("message") as string | null)?.trim() ?? "";
  const messageType = (formData.get("message_type") as string | null) ?? "leader";

  if (!message) return { error: "Please write a message before sending." };
  if (message.length > 2000) return { error: "Message is too long (max 2000 characters)." };

  const firstName = user.user_metadata?.first_name ?? null;
  const lastName = user.user_metadata?.last_name ?? null;

  const { error } = await supabase.from("coach_messages").insert({
    user_id: user.id,
    user_email: user.email,
    first_name: firstName,
    last_name: lastName,
    subject: subject || null,
    message,
    status: "new",
    message_type: messageType,
  });

  if (error) return { error: "Something went wrong. Please try again." };

  // Notify Telegram group (non-blocking)
  const name = [firstName, lastName].filter(Boolean).join(" ") || user.email;
  const typeLabel = messageType === "peer" ? "Peer Initiator Message" : "Coach Message";
  const subjectLine = subject ? `\n<b>Subject:</b> ${subject}` : "";
  await notifyTelegram(
    `📩 <b>New ${typeLabel}</b>\n<b>From:</b> ${name} (${user.email})${subjectLine}\n\n${message.slice(0, 400)}${message.length > 400 ? "…" : ""}\n\n<i>Reply at crispyleaders.com/admin</i>`
  );

  return { success: true };
}

export async function submitPeerGroupApplication(formData: FormData) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Not authenticated." };

  const region = (formData.get("region") as string | null)?.trim() ?? "";
  const timezone = (formData.get("timezone") as string | null)?.trim() ?? "";
  const pathway = (formData.get("pathway") as string | null)?.trim() ?? "both";
  const groupSizePref = (formData.get("groupSizePref") as string | null)?.trim() ?? "";
  const reason = (formData.get("reason") as string | null)?.trim() ?? "";

  if (!region) return { error: "Please enter your region." };
  if (!timezone) return { error: "Please select your timezone." };
  if (!reason) return { error: "Please tell us why you want to initiate a group." };

  const { data: existing } = await supabase
    .from("peer_group_applications")
    .select("id, status")
    .eq("user_id", user.id)
    .in("status", ["pending", "approved"])
    .maybeSingle();

  if (existing) {
    if (existing.status === "approved") return { error: "You already have an approved peer group." };
    return { error: "You already have a pending application. Chris will be in touch soon." };
  }

  const { error } = await supabase.from("peer_group_applications").insert({
    user_id: user.id,
    user_email: user.email,
    first_name: user.user_metadata?.first_name ?? null,
    last_name: user.user_metadata?.last_name ?? null,
    region,
    timezone,
    pathway,
    group_size_pref: groupSizePref || null,
    reason,
    status: "pending",
  });

  if (error) return { error: "Something went wrong. Please try again." };

  return { success: true };
}

export async function sendMagicLink(formData: FormData): Promise<{ error?: string; sent?: boolean }> {
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  if (!email) return { error: "Please enter your email address." };

  // Verify user exists before sending OTP — Supabase silently drops OTP for non-existent users
  // when shouldCreateUser is false, so we check explicitly to give a useful error message
  const admin = createAdminClient();
  const { data: { users } } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const userExists = users.some(u => u.email?.toLowerCase() === email.toLowerCase());
  if (!userExists) {
    return { error: "No account found for that email. You need an invite to join Crispy Leaders." };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.crispyleaders.com";

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${siteUrl}/auth/callback`, shouldCreateUser: false },
  });

  if (error) return { error: error.message };
  return { sent: true };
}

export async function requestPasswordReset(formData: FormData): Promise<{ error?: string; sent?: boolean }> {
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  if (!email) return { error: "Please enter your email address." };

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://crispyleaders.com";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
  });

  if (error) return { error: error.message };
  return { sent: true };
}

export async function saveUserTimezone(utcOffsetHours: number): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const sign = utcOffsetHours >= 0 ? "+" : "";
  const tzString = `UTC${sign}${utcOffsetHours}`;

  if (user.user_metadata?.timezone === tzString) return;

  await supabase.auth.updateUser({ data: { timezone: tzString } });
}
