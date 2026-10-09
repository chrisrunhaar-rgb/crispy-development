import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { requireModuleAccess } from "@/lib/require-module-access";
import Breadcrumb from "@/components/Breadcrumb";
import ModuleComments from "@/components/ModuleComments";
import ModuleConnector from "@/components/ModuleConnector";
import PatronClientClient from "./PatronClientClient";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "patron-client-relationships";

export const metadata: Metadata = {
  title: "Patron-Client Relationships | Crispy Leaders",
  description:
    "How the unwritten give-and-take between people of unequal power works, why it meets real needs, and where a leader seen as a patron should draw the line.",
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
              { label: "Patron-Client Relationships" },
            ]}
          />
        </div>
      </div>

      <PatronClientClient isSaved={isSaved} />
      <ModuleConnector currentSlug={RESOURCE_SLUG} savedResources={savedResources} isLoggedIn={!!user} />
      <div className="border-t border-gray-100 py-10">
        <div className="container-wide">
          <ModuleComments slug={RESOURCE_SLUG} />
        </div>
      </div>
    </>
  );
}
