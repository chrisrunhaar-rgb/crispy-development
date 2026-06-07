import { createClient } from "@/lib/supabase/server";
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
    const [{ data: membership }, { data: teamMember }, { data: teamLeader }] = await Promise.all([
      supabase.from("memberships").select("id").eq("user_id", user.id).maybeSingle(),
      supabase.from("team_memberships").select("id").eq("user_id", user.id).maybeSingle(),
      supabase.from("teams").select("id").eq("leader_id", user.id).maybeSingle(),
    ]);
    ctaHref = (membership || teamMember || teamLeader) ? "/dashboard" : "/membership";
  }

  return <PersonalContent ctaHref={ctaHref} />;
}
