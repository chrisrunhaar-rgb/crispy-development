import { createClient } from "@/lib/supabase/server";
import PersonalContent from "./PersonalContent";
import { getGeoInfo } from "@/lib/geo";

export const metadata = {
  title: "Personal Pathway — Crispy Development",
  description: "A structured pathway for individual cross-cultural leaders. Grow, reflect, and lead with greater clarity.",
};

export default async function PersonalPathwayPage() {
  const [supabase, geo] = await Promise.all([createClient(), getGeoInfo()]);
  const { data: { user } } = await supabase.auth.getUser();
  const ctaHref = user ? "/dashboard" : "/signup?pathway=personal";
  return <PersonalContent ctaHref={ctaHref} geo={geo} />;
}
