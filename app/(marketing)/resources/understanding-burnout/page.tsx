import { Metadata } from "next";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { requireModuleAccess } from "@/lib/require-module-access";
import {
  generateResourceArticleSchema,
  generateResourceBreadcrumbSchema,
  generateResourceMetadata,
  generateFAQSchema,
} from "@/lib/seo-utils";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedResources from "@/components/RelatedResources";
import ModuleComments from "@/components/ModuleComments";
import UnderstandingBurnoutClient from "./UnderstandingBurnoutClient";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "understanding-burnout";

export const metadata: Metadata = generateResourceMetadata(RESOURCE_SLUG);

export default async function ResourcePage(props: any) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // MANDATORY: requireModuleAccess gate. Without this, the admin status toggle
  // (Development / Live Free / Live Paid) does nothing.
  await requireModuleAccess(
    supabase,
    user?.id ?? null,
    RESOURCE_SLUG,
    user?.email ?? null
  );

  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes(RESOURCE_SLUG);

  const breadcrumbSchema = generateResourceBreadcrumbSchema(RESOURCE_SLUG);

  const faqSchema = generateFAQSchema([
    {
      question: "What are the three subtypes of burnout identified by Montero-Marin?",
      answer:
        "Montero-Marin identifies three burnout subtypes: Frenetic (high drive, high ambition, keeps pushing through depletion -- the worker who cannot stop because stopping feels like faithlessness), Underchallenged (not overwhelmed but disengaged -- skills are underused and the work feels disconnected from calling), and Worn-Out (advanced disengagement and apathy -- effort no longer feels worth it and the person has stopped trying to change what is not changing).",
    },
    {
      question: "What is the identity root of burnout according to this module?",
      answer:
        "Most burnouts among ministry and cross-cultural workers happen when, gradually and often invisibly, the worker drifts from serving out of God's calling and wisdom to serving out of their own ambition, expectations, fears, or need for results. The distinction is not between effort and rest -- it is between identity and performance. Selfish ambition often wears ministry clothes: it sounds like vision, faithfulness, responsibility, even sacrifice.",
    },
    {
      question: "What does James 3 teach about the root causes of burnout?",
      answer:
        "James 3:13-17 distinguishes earthly wisdom (driven by zelos -- burning emotional energy, comparison, the need to produce and be seen) from wisdom from above (pure, peace-loving, willing to yield, full of mercy). James is not describing two categories of people but two modes of operating any person can inhabit. The diagnostic question for burnout is not how hard you are working -- it is from where.",
    },
    {
      question: "How did God respond to Elijah's burnout in 1 Kings 19?",
      answer:
        "In 1 Kings 19, Elijah collapsed under a broom tree after his greatest public victory. An angel arrived -- not with correction or theological challenge -- but with food and water twice. God's first response to burnout was physical: rest before duty, body before soul, no rebuke. When Elijah finally walked again, God met him not in the fire or the earthquake or the wind, but in the still small voice. Recovery from burnout is not spectacular -- it is slow, quiet, and arrives in the spaces where noise has finally stopped.",
    },
    {
      question: "How common is burnout among cross-cultural workers in Southeast Asia?",
      answer:
        "A 2024 study of 4,338 full-time workers across Malaysia, Singapore, the Philippines, and Indonesia found that 62.91% reported high or very high burnout levels. In the Philippines the figure was 70.71%. In cultures where admitting exhaustion means losing face or alarming supporters back home, the pressure to appear fine -- known in Indonesian as malu -- compounds the problem significantly.",
    },
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
          __html: JSON.stringify(faqSchema),
        }}
      />
      <Script
        id="ub-ga-tracking"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.gtag?.('event', 'resource_viewed', { resource: '${RESOURCE_SLUG}', category: 'burnout' });`,
        }}
      />

      <div className="bg-gray-50 border-b border-gray-200 py-3 sticky top-0 z-10">
        <div className="container-wide">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Resources", href: "/resources" },
              { label: "Understanding Burnout" },
            ]}
          />
        </div>
      </div>

      <UnderstandingBurnoutClient {...props} isSaved={isSaved} />

      <div className="border-t border-gray-100 py-10">
        <div className="container-wide">
          <ModuleComments slug="understanding-burnout" />
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-wide">
          <RelatedResources slug="understanding-burnout" />
        </div>
      </div>
    </>
  );
}
