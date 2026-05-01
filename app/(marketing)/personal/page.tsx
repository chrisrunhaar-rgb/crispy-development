import { createClient } from "@/lib/supabase/server";
import PersonalContent from "./PersonalContent";

export const metadata = {
  title: "Personal Pathway — Crispy Development",
  description: "A structured pathway for individual cross-cultural leaders. Grow, reflect, and lead with greater clarity.",
};

export default async function PersonalPathwayPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const ctaHref = user ? "/dashboard" : "/membership";
  return <PersonalContent ctaHref={ctaHref} />;
}
