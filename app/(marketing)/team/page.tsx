import { createClient } from "@/lib/supabase/server";
import TeamContent from "./TeamContent";
import { getGeoInfo } from "@/lib/geo";

export const metadata = {
  title: "Team Pathway — Crispy Development",
  description: "Equip your entire cross-cultural team. A shared dashboard, member management, and curated content — all in one place.",
};

export default async function TeamPathwayPage() {
  const [supabase, geo] = await Promise.all([createClient(), getGeoInfo()]);
  const { data: { user } } = await supabase.auth.getUser();
  const ctaHref = user ? "/apply" : "/signup?pathway=personal";
  return <TeamContent ctaHref={ctaHref} geo={geo} />;
}
