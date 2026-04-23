import { Metadata } from "next";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { getResourceMetadata } from "@/config/seo-metadata";
import { generateBreadcrumbSchema } from "@/lib/seo-utils";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedResources from "@/components/RelatedResources";
import BuildingTrustClient from "./BuildingTrustClient";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "building-trust-across-cultures";
const resourceMeta = getResourceMetadata(RESOURCE_SLUG);

export const metadata: Metadata = {
  title: resourceMeta.title,
  description: resourceMeta.description,
};

export default async function ResourcePage(props: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes(RESOURCE_SLUG);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://crispyleaders.com" },
    { name: "Resources", url: "https://crispyleaders.com/resources" },
  ]);

  return (
    <>
      <Script
        id={`breadcrumb-${RESOURCE_SLUG}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <Script
        id="btac-ga-tracking"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.gtag?.('event', 'resource_viewed', { resource: '${RESOURCE_SLUG}', category: 'cross-cultural' });`,
        }}
      />

      <div className="bg-gray-50 border-b border-gray-200 py-3 sticky top-0 z-10">
        <div className="container-wide">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Resources", href: "/resources" },
              { label: "Building Trust" },
            ]}
          />
        </div>
      </div>

      <BuildingTrustClient {...props} isSaved={isSaved} />

      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-wide">
          <RelatedResources slug="building-trust-across-cultures" />
        </div>
      </div>
    </>
  );
}
