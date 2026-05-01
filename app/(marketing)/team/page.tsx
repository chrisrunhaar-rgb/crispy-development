import { createClient } from "@/lib/supabase/server";
import TeamContent from "./TeamContent";

export const metadata = {
  title: "Team Pathway — Crispy Development",
  description: "Equip your entire cross-cultural team. A shared dashboard, member management, and curated content — all in one place.",
};

export default async function TeamPathwayPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const ctaHref = user ? "/apply" : "/membership";
  return <TeamContent ctaHref={ctaHref} />;
}
