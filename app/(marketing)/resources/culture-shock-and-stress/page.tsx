import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { requireModuleAccess } from "@/lib/require-module-access";
import Breadcrumb from "@/components/Breadcrumb";
import ModuleComments from "@/components/ModuleComments";
import ModuleConnector from "@/components/ModuleConnector";
import CultureShockStressClient from "./CultureShockStressClient";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "culture-shock-and-stress";

// Hidden module: not listed in resources-data, seo-metadata or the sitemap.
// Static metadata with noindex; no JSON-LD, no GA script, no RelatedResources.
export const metadata: Metadata = {
  title: "Culture Shock and Culture Stress",
  description:
    "Why ordinary life can feel harder in a culture that is not your own: the difference between culture shock and culture stress, where the strain comes from, how it shows, and what helps.",
  robots: { index: false, follow: false },
};

export default async function ResourcePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await requireModuleAccess(supabase, user?.id ?? null, RESOURCE_SLUG, user?.email ?? null);

  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes(RESOURCE_SLUG);

  return (
    <>
      <div className="bg-gray-50 border-b border-gray-200 py-3 sticky top-0 z-10">
        <div className="container-wide">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Resources", href: "/resources" },
              { label: "Culture Shock and Culture Stress" },
            ]}
          />
        </div>
      </div>
      <CultureShockStressClient isSaved={isSaved} />
      <ModuleConnector currentSlug={RESOURCE_SLUG} savedResources={savedResources} isLoggedIn={!!user} />
      <div className="border-t border-gray-100 py-10">
        <div className="container-wide">
          <ModuleComments slug={RESOURCE_SLUG} />
        </div>
      </div>
    </>
  );
}
