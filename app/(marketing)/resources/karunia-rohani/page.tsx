import { Metadata } from "next";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { generateResourceArticleSchema, generateResourceBreadcrumbSchema, generateResourceMetadata } from "@/lib/seo-utils";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedResources from "@/components/RelatedResources";
import KaruniaClient from "./KaruniaClient";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "karunia-rohani";

export const metadata = generateResourceMetadata(RESOURCE_SLUG);

export default async function ResourcePage(props: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes(RESOURCE_SLUG);
  const isLoggedIn = !!user;
  const karuniaTopGifts = (user?.user_metadata?.karunia_top_gifts ?? null) as string[] | null;
  const karuniaScores = (user?.user_metadata?.karunia_scores ?? null) as Record<string, number> | null;

  const breadcrumbSchema = generateResourceBreadcrumbSchema(RESOURCE_SLUG);

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
        id={`article-${RESOURCE_SLUG}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateResourceArticleSchema(RESOURCE_SLUG)),
        }}
      />
      <Script
        id="kr-ga-tracking"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.gtag?.('event', 'resource_viewed', { resource: '${RESOURCE_SLUG}', category: 'assessments' });`,
        }}
      />

      <div className="bg-gray-50 border-b border-gray-200 py-3 sticky top-0 z-10">
        <div className="container-wide">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Resources", href: "/resources" },
              { label: "Spiritual Gifts" },
            ]}
          />
        </div>
      </div>

      <KaruniaClient
        isSaved={isSaved}
        isLoggedIn={isLoggedIn}
        karuniaTopGifts={karuniaTopGifts}
        karuniaScores={karuniaScores}
      />

      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-wide">
          <RelatedResources slug="karunia-rohani" />
        </div>
      </div>
    </>
  );
}
