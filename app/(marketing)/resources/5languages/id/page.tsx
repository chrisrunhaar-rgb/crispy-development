import type { Metadata } from "next";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { generateResourceBreadcrumbSchema, generateResourceArticleSchema } from "@/lib/seo-utils";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedResources from "@/components/RelatedResources";
import FiveLanguagesClient from "../FiveLanguagesClient";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "5languages";

export const metadata: Metadata = {
  title: "5 Bahasa Penghargaan — Asesmen Bahasa Indonesia | Crispy Development",
  description: "Temukan bahasa kepedulianmu — cara kamu menerima dan memberikan apresiasi dalam tim lintas budaya. Asesmen dua arah pertama berbasis 5 Languages untuk pemimpin.",
  alternates: {
    canonical: "/resources/5languages/id",
  },
};

export default async function ResourcePageID(props: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes(RESOURCE_SLUG);

  const breadcrumbSchema = generateResourceBreadcrumbSchema(RESOURCE_SLUG);
  const receivingResult = (user?.user_metadata?.fivela_receiving_result ?? null) as string | null;
  const givingResult = (user?.user_metadata?.fivela_giving_result ?? null) as string | null;
  const receivingScores = (user?.user_metadata?.fivela_receiving_scores ?? null) as { A: number; B: number; C: number; D: number; E: number } | null;
  const givingScores = (user?.user_metadata?.fivela_giving_scores ?? null) as { A: number; B: number; C: number; D: number; E: number } | null;

  return (
    <>
      <Script
        id={`breadcrumb-${RESOURCE_SLUG}-id`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <Script
        id={`article-${RESOURCE_SLUG}-id`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateResourceArticleSchema(RESOURCE_SLUG)),
        }}
      />
      <Script
        id="5languages-id-ga-tracking"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.gtag?.('event', 'resource_viewed', { resource: '${RESOURCE_SLUG}', category: 'assessments', lang: 'id' });`,
        }}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 border-b border-gray-200 py-3 sticky top-0 z-10">
        <div className="container-wide">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Resources", href: "/resources" },
              { label: "5 Bahasa Penghargaan" },
            ]}
          />
        </div>
      </div>

      {/* Assessment Content */}
      <FiveLanguagesClient
        isSaved={isSaved}
        receivingResult={receivingResult}
        givingResult={givingResult}
        receivingScores={receivingScores}
        givingScores={givingScores}
        lang="id"
      />

      {/* Related Resources */}
      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-wide">
          <RelatedResources slug="5languages" />
        </div>
      </div>
    </>
  );
}
