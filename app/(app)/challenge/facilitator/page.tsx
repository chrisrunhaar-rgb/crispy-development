import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import FacilitatorDashboard from "./FacilitatorDashboard";

export const metadata = { title: "Facilitator Dashboard — Influential Leadership Challenge" };

export default async function FacilitatorPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; code?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/challenge/facilitator");

  const { created, code } = await searchParams;
  const admin = createAdminClient();

  const [{ data: groups }, { data: enrollmentData }] = await Promise.all([
    admin
      .from("challenge_groups")
      .select("id, name, description, group_code, is_public, max_members, schedule_days, notify_time, notify_timezone, start_date, language, created_at")
      .eq("facilitator_id", user.id)
      .order("created_at", { ascending: false }),
    admin
      .from("challenge_enrollments")
      .select("current_day, notification_time, notification_days, timezone")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);
  type EnrollRow = { current_day: number | null; notification_time: string | null; notification_days: number[] | null; timezone: string | null };
  const enroll = enrollmentData as EnrollRow | null;
  const currentDay = enroll?.current_day ?? 1;
  const personalTime = enroll?.notification_time?.slice(0, 5) ?? "08:00";
  const personalDays = (enroll?.notification_days as number[] | null) ?? [1, 2, 3, 4, 5];
  const lang = (user.user_metadata?.language_preference === "id" ? "id" : "en") as "en" | "id";

  const groupIds = (groups ?? []).map(g => g.id);

  type MemberRow = { group_id: string; role: string; user_id: string };
  type AppRow = { id: string; group_id: string; status: string; answer_1: string | null; answer_2: string | null; user_id: string };

  const [{ data: members }, { data: applications }] = await Promise.all([
    groupIds.length > 0
      ? admin.from("challenge_group_members").select("group_id, role, user_id").in("group_id", groupIds)
      : Promise.resolve({ data: [] as MemberRow[] }),
    groupIds.length > 0
      ? admin.from("challenge_group_applications").select("id, group_id, status, answer_1, answer_2, user_id").in("group_id", groupIds).eq("status", "pending")
      : Promise.resolve({ data: [] as AppRow[] }),
  ]);

  // Build member counts per group
  const memberCounts: Record<string, number> = {};
  (members as MemberRow[] ?? []).forEach(m => {
    memberCounts[m.group_id] = (memberCounts[m.group_id] ?? 0) + 1;
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://crispyleaders.com";
  const firstName = (user.user_metadata?.first_name as string | undefined) ?? "";

  return (
    <FacilitatorDashboard
      groups={(groups ?? []).map(g => ({
        ...g,
        memberCount: memberCounts[g.id] ?? 0,
        inviteUrl: `${siteUrl}/challenge/join/${g.group_code}`,
        notify_time: g.notify_time ?? null,
        notify_timezone: g.notify_timezone ?? "Asia/Kuala_Lumpur",
        start_date: (g as { start_date?: string | null }).start_date ?? null,
        language: (g as { language?: string | null }).language ?? "en",
        currentDay,
      }))}
      pendingApplications={applications as AppRow[] ?? []}
      newlyCreatedId={created ?? null}
      newGroupCode={code ?? null}
      firstName={firstName}
      personalTime={personalTime}
      personalDays={personalDays}
      lang={lang}
    />
  );
}
