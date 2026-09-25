import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import PersonalContent from "./PersonalContent";

export const metadata = {
  title: "Personal Pathway | Crispy Development",
  description: "Eight assessments, 50+ short modules on cross-cultural leadership, and a personal dashboard that keeps your results, notes and progress together.",
};

export default async function PersonalPathwayPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Visitors without access go to pricing; anyone with access goes to their dashboard.
  let ctaHref = "/pricing";
  if (user) {
    // Admin client: teams/team_members RLS policies recurse for user-client reads.
    const admin = createAdminClient();
    const [{ data: membership }, { data: teamMember }, { data: teamLeader }] = await Promise.all([
      supabase.from("memberships").select("id").eq("user_id", user.id).limit(1).maybeSingle(),
      admin.from("team_members").select("team_id").eq("user_id", user.id).limit(1).maybeSingle(),
      admin.from("teams").select("id").eq("leader_user_id", user.id).limit(1).maybeSingle(),
    ]);
    if (membership || teamMember || teamLeader) ctaHref = "/dashboard";
  }

  return <PersonalContent ctaHref={ctaHref} />;
}
