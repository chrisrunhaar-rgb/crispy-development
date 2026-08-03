import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import ExploreShell from "./ExploreShell";

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

  // Local dev boxes often have no service-role key. Rather than 500 the whole
  // page, fall back to the anon client and let getModuleAccess use its defaults.
  let statusRows: {
    slug: string;
    status: string;
    library_category: string | null;
    module_formats: string[] | null;
  }[] | null = null;
  try {
    const admin = createAdminClient();
    ({ data: statusRows } = await admin
      .from("module_status")
      .select("slug, status, library_category, module_formats"));
  } catch {
    ({ data: statusRows } = await supabase
      .from("module_status")
      .select("slug, status, library_category, module_formats"));
  }

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
    <ExploreShell
      userId={user?.id ?? null}
      moduleStatuses={moduleStatuses}
      moduleCategories={moduleCategories}
      moduleFormats={moduleFormats}
    />
  );
}
