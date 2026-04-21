import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import PeerGroupsContent from "./PeerGroupsContent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Peer Groups — Crispy Development",
  description: "Find or start a peer group of cross-cultural leaders. Grow, reflect, and support each other across time zones and contexts.",
};

async function getActiveGroups() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("peer_groups")
    .select("id, name, region, timezone, pathway, max_size, is_open, created_at")
    .eq("is_open", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function PeerGroupsPage() {
  const [groups, supabase] = await Promise.all([
    getActiveGroups(),
    createClient(),
  ]);
  const { data: { user } } = await supabase.auth.getUser();
  const ctaHref = user ? "/peer-groups/apply" : "/signup?pathway=personal";
  return <PeerGroupsContent groups={groups} ctaHref={ctaHref} />;
}
