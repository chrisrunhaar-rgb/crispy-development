import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import ResourcesContent from "./ResourcesContent";

export const dynamic = "force-dynamic";
import { generateBreadcrumbSchema } from "@/lib/seo-utils";

export const metadata = {
  title: "Resources — Crispy Development",
  description: "Guides, assessments, and worksheets for Christian leaders navigating life and ministry across cultures.",
};

export default async function ResourcesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pathway = user?.user_metadata?.pathway ?? null;
  const isTeamLeader = user?.user_metadata?.is_leader === true;
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];

  const admin = createAdminClient();
  const { data: statusRows } = await admin
    .from("module_status")
    .select("slug, status, library_category, module_formats");

  const moduleStatuses: Record<string, string> = {};
  const moduleCategories: Record<string, string> = {};
  const moduleFormats: Record<string, string[]> = {};
  for (const row of statusRows ?? []) {
    moduleStatuses[row.slug] = row.status;
    moduleCategories[row.slug] = row.library_category ?? "";
    if (Array.isArray(row.module_formats) && row.module_formats.length > 0) moduleFormats[row.slug] = row.module_formats;
  }

  return (
    <ResourcesContent
      userId={user?.id ?? null}
      pathway={pathway}
      isTeamLeader={isTeamLeader}
      savedResources={savedResources}
      moduleStatuses={moduleStatuses}
      moduleCategories={moduleCategories}
      moduleFormats={moduleFormats}
    />
  );
}
