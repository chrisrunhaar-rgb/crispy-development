import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import TeamSettings, { type SlotMember, type PendingInvite } from "./TeamSettings";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Team Settings — Crispy Development",
};

export default async function TeamSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const supabase = await createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { checkout } = await searchParams;

  // Admin client bypasses RLS — same pattern as the dashboard. Only the
  // team's leader gets this page; everyone else goes back to the dashboard.
  const { data: team } = await admin
    .from("teams")
    .select("id, name, language, max_seats, selected_assessments, invite_intro_seen")
    .eq("leader_user_id", user.id)
    .maybeSingle();

  if (!team) redirect("/dashboard");

  // team_invites.team_id FK references auth.users(id) — use leader's user ID
  const [{ data: memberRows }, { data: inviteRows }] = await Promise.all([
    admin
      .from("team_members")
      .select("user_id, title, tenure_label, joined_at")
      .eq("team_id", team.id)
      .order("joined_at", { ascending: true }),
    admin
      .from("team_invites")
      .select("id, token, created_at, expires_at, recipient_email, recipient_name")
      .eq("team_id", user.id)
      .is("used_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: true }),
  ]);

  type MemberRow = { user_id: string; title: string | null; tenure_label: string | null };
  const memberIds = (memberRows ?? []).map((m: MemberRow) => m.user_id);
  let members: SlotMember[] = [];
  if (memberIds.length > 0) {
    const { data: profiles } = await admin
      .from("profiles")
      .select("id, email, first_name, last_name")
      .in("id", memberIds);
    type Profile = { id: string; email: string | null; first_name: string | null; last_name: string | null };
    const byId = new Map((profiles ?? []).map((p: Profile) => [p.id, p]));
    members = (memberRows ?? []).map((m: MemberRow) => {
      const p = byId.get(m.user_id);
      return {
        id: m.user_id,
        name: p ? `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || (p.email ?? "Member") : "Member",
        email: p?.email ?? "",
        title: m.title,
        tenureLabel: m.tenure_label,
      };
    });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://crispyleaders.com";
  const leaderName = `${user.user_metadata?.first_name ?? ""} ${user.user_metadata?.last_name ?? ""}`.trim()
    || (user.email?.split("@")[0] ?? "Team leader");

  // One-time leader explainer, gated on teams.invite_intro_seen (moved here
  // from the old /dashboard/invite page).
  const showIntro = !team.invite_intro_seen;
  if (showIntro) {
    await admin.from("teams").update({ invite_intro_seen: true }).eq("id", team.id);
  }

  return (
    <TeamSettings
      team={{ id: team.id, name: team.name, selectedAssessments: team.selected_assessments ?? [] }}
      teamLanguage={team.language === "id" ? "id" : "en"}
      memberSeats={team.max_seats ?? 7}
      members={members}
      invites={(inviteRows ?? []) as PendingInvite[]}
      leaderName={leaderName}
      siteUrl={siteUrl}
      showIntro={showIntro}
      checkoutSuccess={checkout === "success"}
    />
  );
}
