import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import InvitePage from "./InvitePage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Invite Members — Crispy Development",
};

export default async function DashboardInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ team?: string }>;
}) {
  const supabase = await createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { team: teamIdParam } = await searchParams;

  // Use admin client to bypass RLS — same pattern as dashboard
  const { data: team } = await admin
    .from("teams")
    .select("id, name")
    .eq("leader_user_id", user.id)
    .maybeSingle();

  if (!team) redirect("/dashboard");

  // Fetch existing invite links
  // Note: team_invites.team_id FK references auth.users(id) — use leader's user ID
  const { data: invites } = await admin
    .from("team_invites")
    .select("id, token, created_at, expires_at, used_at")
    .eq("team_id", user.id)
    .order("created_at", { ascending: false });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://crispyleaders.com";

  return (
    <InvitePage
      team={team}
      invites={invites ?? []}
      siteUrl={siteUrl}
    />
  );
}
