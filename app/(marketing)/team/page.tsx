import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import TeamContent from "./TeamContent";

export const metadata = {
  title: "Team Pathway | Crispy Development",
  description: "Lead a team that actually knows each other. Up to eight people take the same assessments and modules on their own phones, and you see the whole team in one place.",
};

export default async function TeamPathwayPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Already in a team (leader or member) → team dashboard; otherwise → pricing.
  // Admin client: teams/team_members RLS policies recurse for user-client reads.
  let ctaHref = "/pricing";
  if (user) {
    const admin = createAdminClient();
    const [{ data: led }, { data: member }] = await Promise.all([
      admin.from("teams").select("id").eq("leader_user_id", user.id).limit(1).maybeSingle(),
      admin.from("team_members").select("team_id").eq("user_id", user.id).limit(1).maybeSingle(),
    ]);
    if (led || member) ctaHref = "/dashboard?tab=team";
  }

  return <TeamContent ctaHref={ctaHref} />;
}
