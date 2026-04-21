import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import RolesContributionClient from "./RolesContributionClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Roles & Contribution — Crispy Development",
  description: "Discover the four contribution zones, understand how every gift is necessary, and find your primary zone with the Contribution Zone Finder quiz.",
};

export default async function RolesContributionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return <RolesContributionClient user={user} />;
}
