import { Metadata } from "next";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { getResourceMetadata } from "@/config/seo-metadata";
import { generateBreadcrumbSchema, generateCanonicalUrl } from "@/lib/seo-utils";
import DiscClient from "./DiscClient";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "disc";
const resourceMeta = getResourceMetadata(RESOURCE_SLUG);

export const metadata: Metadata = {
  title: resourceMeta.title,
  description: resourceMeta.description,
  canonical: generateCanonicalUrl(`/resources/${RESOURCE_SLUG}`),
};

export default async function DiscPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes("disc");
  const discResult = (user?.user_metadata?.disc_result ?? null) as string | null;
  const discScores = (user?.user_metadata?.disc_scores ?? null) as { D: number; I: number; S: number; C: number } | null;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://crispyleaders.com" },
    { name: "Resources", url: "https://crispyleaders.com/resources" },
    { name: "DISC Profile", url: generateCanonicalUrl(`/resources/${RESOURCE_SLUG}`) },
  ]);

  return (
    <>
      <Script
        id="breadcrumb-disc"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <DiscClient isSaved={isSaved} discResult={discResult} discScores={discScores} />
    </>
  );
}
