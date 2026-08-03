import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import ExploreContent from "./ExploreContent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Explore the Library — Crispy Development",
  description:
    "54 guides, assessments, and worksheets for Christian leaders navigating life and ministry across cultures — browse the full library by topic.",
};

export default async function ExplorePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
    if (Array.isArray(row.module_formats) && row.module_formats.length > 0) {
      moduleFormats[row.slug] = row.module_formats;
    }
  }

  return (
    <ExploreContent
      userId={user?.id ?? null}
      moduleStatuses={moduleStatuses}
      moduleCategories={moduleCategories}
      moduleFormats={moduleFormats}
    />
  );
}
