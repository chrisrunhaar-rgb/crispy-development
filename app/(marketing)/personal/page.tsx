import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import PersonalContent from "./PersonalContent";

export const metadata = {
  title: "Personal Pathway — Crispy Development",
  description: "A structured pathway for individual cross-cultural leaders. Grow, reflect, and lead with greater clarity.",
};

export default async function PersonalPathwayPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let ctaHref = "/membership";
  if (user) {
    // Admin client: teams/team_members RLS policies recurse for user-client reads.
    const admin = createAdminClient();
    const [{ data: membership }, { data: teamMember }, { data: teamLeader }] = await Promise.all([
      supabase.from("memberships").select("id").eq("user_id", user.id).maybeSingle(),
      admin.from("team_members").select("team_id").eq("user_id", user.id).limit(1).maybeSingle(),
      admin.from("teams").select("id").eq("leader_user_id", user.id).limit(1).maybeSingle(),
    ]);
    ctaHref = (membership || teamMember || teamLeader) ? "/dashboard" : "/membership";
  }

  return <PersonalContent ctaHref={ctaHref} />;
}
