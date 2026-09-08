import SignupForm from "./SignupForm";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = {
  title: "Create Account — Crispy Development",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ pathway?: string; invite?: string; member_invite?: string }>;
}) {
  const { pathway, invite, member_invite } = await searchParams;

  let initialLanguage: "en" | "id" | undefined;
  let resolvedPathway: "personal" | "team" = pathway === "team" ? "team" : "personal";

  if (member_invite) {
    const admin = createAdminClient();
    const { data } = await admin
      .from("member_invites")
      .select("language, pathway")
      .eq("token", member_invite)
      .maybeSingle();
    if (data) {
      initialLanguage = data.language === "id" ? "id" : "en";
      resolvedPathway = data.pathway === "team" ? "team" : "personal";
    }
  } else if (invite) {
    const admin = createAdminClient();
    const { data: teamInvite } = await admin
      .from("team_invites")
      .select("team_id")
      .eq("token", invite)
      .maybeSingle();
    if (teamInvite) {
      const { data: team } = await admin
        .from("teams")
        .select("language")
        .eq("leader_user_id", teamInvite.team_id)
        .maybeSingle();
      if (team?.language === "id") initialLanguage = "id";
    }
  }

  return (
    <SignupForm
      defaultPathway={resolvedPathway}
      inviteToken={invite ?? ""}
      memberInviteToken={member_invite ?? ""}
      initialLanguage={initialLanguage}
    />
  );
}
