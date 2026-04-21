import { createClient } from "@/lib/supabase/server";
import ResourcesContent from "./ResourcesContent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Resources — Crispy Development",
  description: "Free and premium leadership resources for Christian leaders, expat professionals, and multicultural team managers.",
};

export default async function ResourcesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = user?.user_metadata?.pathway ?? null;
  const isTeamLeader = user?.user_metadata?.is_leader === true;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];

  return (
    <ResourcesContent
      userId={user?.id ?? null}
      pathway={pathway}
      isTeamLeader={isTeamLeader}
      savedResources={savedResources}
    />
  );
}
