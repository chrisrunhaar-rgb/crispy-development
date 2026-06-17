import { Metadata } from "next";
import Script from "next/script";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireModuleAccess } from "@/lib/require-module-access";
import { generateResourceArticleSchema, generateResourceBreadcrumbSchema, generateResourceMetadata } from "@/lib/seo-utils";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedResources from "@/components/RelatedResources";
import ModuleComments from "@/components/ModuleComments";
import CognitiveBiasesClient from "./CognitiveBiasesClient";
import ModuleConnector from "@/components/ModuleConnector";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "cognitive-biases";

export const metadata = generateResourceMetadata(RESOURCE_SLUG);

export default async function ResourcePage(props: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  await requireModuleAccess(supabase, user?.id ?? null, RESOURCE_SLUG, user?.email ?? null);

  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes(RESOURCE_SLUG);

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
        id={`faq-${RESOURCE_SLUG}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is a cognitive bias?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A cognitive bias is a systematic pattern of deviation from rational judgment. These are mental shortcuts the brain uses to process information quickly. While often helpful in daily life, they can lead to flawed decisions — especially in cross-cultural leadership contexts where the brain is working with incomplete or unfamiliar cultural data."
                }
              },
              {
                "@type": "Question",
                "name": "How do cognitive biases affect cross-cultural leaders?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Cross-cultural leaders are especially vulnerable to cognitive biases because they operate in environments where their familiar pattern-recognition shortcuts don't apply. Biases like in-group favoritism, confirmation bias, and the fundamental attribution error are particularly damaging in multicultural teams, leading to poor hiring decisions, misreading of local team behaviour, and strategic blind spots."
                }
              },
              {
                "@type": "Question",
                "name": "Can cognitive biases be eliminated?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Cognitive biases cannot be fully eliminated — they are built into how the human brain processes information. However, they can be interrupted and mitigated through practices such as naming biases before high-stakes decisions, building cross-cultural accountability structures, delaying judgment, and actively seeking disconfirming evidence."
                }
              },
              {
                "@type": "Question",
                "name": "Which cognitive biases are most common in cross-cultural leadership?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The biases most commonly damaging in cross-cultural leadership include: Fundamental Attribution Error (assuming local team behaviour reflects character rather than context), In-Group Favoritism (giving disproportionate trust and opportunity to culturally similar people), Confirmation Bias (filtering out evidence that challenges existing cultural assumptions), Anchoring Bias (being disproportionately influenced by the first information received), and Groupthink (expat teams that suppress honest dissent to maintain harmony)."
                }
              },
              {
                "@type": "Question",
                "name": "How many cognitive biases are there?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Researchers have identified over 200 named cognitive biases. This resource focuses on 50 of the most relevant biases for cross-cultural leaders, organised across six categories: Social, Memory, Learning, Belief, Money, and Politics."
                }
              }
            ]
          }),
        }}
      />
      <Script
        id="cb-ga-tracking"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.gtag?.('event', 'resource_viewed', { resource: '${RESOURCE_SLUG}', category: 'thinking' });`,
        }}
      />

      <div className="bg-gray-50 border-b border-gray-200 py-3 sticky top-0 z-10">
        <div className="container-wide">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Resources", href: "/resources" },
              { label: "Cognitive Biases" },
            ]}
          />
        </div>
      </div>

      <CognitiveBiasesClient {...props} isSaved={isSaved} />
      <ModuleConnector currentSlug={RESOURCE_SLUG} savedResources={savedResources} isLoggedIn={!!user} />
      <div className="border-t border-gray-100 py-10">
        <div className="container-wide">
          <ModuleComments slug="cognitive-biases" />
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-wide">
          <RelatedResources slug="cognitive-biases" />
        </div>
      </div>
    </>
  );
}
