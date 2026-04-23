import { Metadata } from "next";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { getResourceMetadata } from "@/config/seo-metadata";
import { generateBreadcrumbSchema, generateCanonicalUrl } from "@/lib/seo-utils";
import RelationalLongevityClient from "./RelationalLongevityClient";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "relational-longevity";
const resourceMeta = getResourceMetadata(RESOURCE_SLUG);

export const metadata: Metadata = {
  title: resourceMeta.title,
  description: resourceMeta.description,
  canonical: generateCanonicalUrl(`/resources/${RESOURCE_SLUG}`),
};

export default async function ResourcePage(props: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes(RESOURCE_SLUG);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://crispyleaders.com" },
    { name: "Resources", url: "https://crispyleaders.com/resources" },
    { name: resourceMeta.title.split(" — ")[0], url: generateCanonicalUrl(`/resources/${RESOURCE_SLUG}`) },
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
      <RelationalLongevityClient {...props} isSaved={isSaved} />
    </>
  );
}
