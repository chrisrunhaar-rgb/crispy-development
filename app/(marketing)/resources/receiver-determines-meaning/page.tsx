import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { requireModuleAccess } from "@/lib/require-module-access";
import Breadcrumb from "@/components/Breadcrumb";
import ModuleComments from "@/components/ModuleComments";
import ModuleConnector from "@/components/ModuleConnector";
import ReceiverMeaningClient from "./ReceiverMeaningClient";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "receiver-determines-meaning";

// Hidden module: not in resources-data, seo-metadata or the sitemap.
export const metadata: Metadata = {
  title: "The Receiver Determines the Meaning",
  description:
    "Why listeners build meaning from their own language, culture, experience and relationship with the speaker, and simple practices leaders can use to check what was understood.",
  robots: { index: false, follow: false },
};

export default async function ResourcePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
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
              { label: "The Receiver Determines the Meaning" },
            ]}
          />
        </div>
      </div>

      <ReceiverMeaningClient isSaved={isSaved} />

      <ModuleConnector currentSlug={RESOURCE_SLUG} savedResources={savedResources} isLoggedIn={!!user} />

      <div className="border-t border-gray-100 py-10">
        <div className="container-wide">
          <ModuleComments slug={RESOURCE_SLUG} />
        </div>
      </div>
    </>
  );
}
