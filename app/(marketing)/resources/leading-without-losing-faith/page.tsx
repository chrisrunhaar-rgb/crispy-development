import { Metadata } from "next";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { generateResourceArticleSchema, generateResourceBreadcrumbSchema, generateResourceMetadata, generateFAQSchema } from "@/lib/seo-utils";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedResources from "@/components/RelatedResources";
import ModuleComments from "@/components/ModuleComments";
import LeadingWithoutLosingFaithClient from "./LeadingWithoutLosingFaithClient";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "leading-without-losing-faith";

export const metadata = generateResourceMetadata(RESOURCE_SLUG);

export default async function ResourcePage(props: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
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
          __html: JSON.stringify(generateFAQSchema([
            {
              question: "What causes faith to drift in cross-cultural leadership?",
              answer: "Faith drift happens gradually through five common threats: busyness (when the work replaces the worship), disillusionment (when repeated disappointments erode expectation), pride (when success displaces dependence), isolation (when leadership loneliness cuts a leader off from God and others), and syncretism (when the values of the surrounding culture seep in unchecked). Each drift masquerades as faithfulness while slowly eroding the leader's spiritual core.",
            },
            {
              question: "How common is burnout among ministry and cross-cultural leaders?",
              answer: "Research shows 42% of Protestant pastors seriously considered leaving ministry in 2022, up from 29% the prior year. Peer and mentor support among pastors declined from 37% to 22% over seven years. Studies on cross-cultural workers found that approximately 5.1% leave annually, with 71% of those departures preventable through better spiritual preparation and relational support.",
            },
            {
              question: "What is the difference between burnout and spiritual dryness?",
              answer: "Burnout relates to emotional exhaustion from overwork, while spiritual dryness is the specific experience of feeling disconnected from God in prayer and Scripture. Research by Büssing et al. (2013) found that workload did not predict spiritual dryness — meaning structural relief alone cannot resolve it. Spiritual dryness requires targeted spiritual responses, not just reduced responsibilities.",
            },
            {
              question: "What practices protect cross-cultural leaders from spiritual drift?",
              answer: "Six evidence-based foundations protect against burnout: private spiritual practice, clarity of calling, a sense of self independent of role or approval, alignment between gifting and task, supportive close relationships, and clear boundaries. Clarity of calling consistently reduces emotional exhaustion. Healthy peer relationships are among the top retention factors for cross-cultural workers — the antidote to drift is relational and communal, not purely individual.",
            },
            {
              question: "What does Elijah's story in 1 Kings 19 teach about leadership recovery?",
              answer: "Elijah's collapse after Mount Carmel shows three causes of leadership crisis: unrelenting pressure, despair from perceived ministry failure, and profound isolation. God's restoration followed a deliberate three-phase sequence: physical care (food and rest) before spiritual instruction, compassionate presence rather than rebuke, and renewed commission with succession arrangements. Recovery begins with receiving care, not trying harder.",
            },
            {
              question: "How can a leader maintain their faith while leading demanding cross-cultural work?",
              answer: "Jesus modelled rhythms of engagement and withdrawal as a non-negotiable leadership discipline — he withdrew before major decisions, during intense ministry, and to process grief. The core principle is abiding: bringing the actual work — the fear, fatigue, and hope — back into God's presence rather than performing for him. Structured practices like lament, the Examen, a rule of life, and intentional spiritual community provide the ongoing architecture for sustainable faith.",
            },
          ])),
        }}
      />
      <Script
        id="lwlf-ga-tracking"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.gtag?.('event', 'resource_viewed', { resource: '${RESOURCE_SLUG}', category: 'personal-growth' });`,
        }}
      />

      <div className="bg-gray-50 border-b border-gray-200 py-3 sticky top-0 z-10">
        <div className="container-wide">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Resources", href: "/resources" },
              { label: "Leading with Faith" },
            ]}
          />
        </div>
      </div>

      <LeadingWithoutLosingFaithClient {...props} isSaved={isSaved} />
      <div className="border-t border-gray-100 py-10">
        <div className="container-wide">
          <ModuleComments slug="leading-without-losing-faith" />
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-wide">
          <RelatedResources slug="leading-without-losing-faith" />
        </div>
      </div>
    </>
  );
}
