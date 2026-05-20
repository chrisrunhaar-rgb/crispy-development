import { Metadata } from "next";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { generateResourceArticleSchema, generateResourceBreadcrumbSchema, generateResourceMetadata, generateFAQSchema } from "@/lib/seo-utils";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedResources from "@/components/RelatedResources";
import EnneagramClient from "./EnneagramClient";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "enneagram";

const ENNEAGRAM_FAQS = [
  {
    question: "What is the Enneagram and how does it work?",
    answer: "The Enneagram is a personality system that describes nine distinct types, each defined by a core motivation, a deep fear, and characteristic patterns of thinking and behavior. Unlike assessments that focus primarily on observable behavior, the Enneagram attempts to describe the internal logic behind why people act the way they do — the driving concern underneath the surface. Each type has particular growth edges and characteristic responses to stress and security.",
  },
  {
    question: "Is the Enneagram compatible with Christian faith?",
    answer: "Many Christian leaders find the Enneagram a useful tool for self-awareness and honest reflection, and several well-regarded authors have written from an explicitly Christian perspective — including Ian Morgan Cron and Suzanne Stabile in The Road Back to You, and Christopher Heuertz in The Sacred Enneagram. Some in evangelical circles raise concerns about certain historical and spiritual associations of the system. Our position is that the Enneagram is a useful observational framework for understanding motivation and behavior, and that discernment about its broader claims rests with each person and their community.",
  },
  {
    question: "What are the nine Enneagram types?",
    answer: "The nine types are commonly described as: Type 1 (The Reformer), Type 2 (The Helper), Type 3 (The Achiever), Type 4 (The Individualist), Type 5 (The Investigator), Type 6 (The Loyalist), Type 7 (The Enthusiast), Type 8 (The Challenger), and Type 9 (The Peacemaker). Each type includes a characteristic strength and a characteristic shadow — the pattern that shows up most clearly under pressure or when a person is functioning at their least healthy.",
  },
  {
    question: "Do Enneagram types express themselves differently across cultures?",
    answer: "Yes, and this is an important nuance often missing from Enneagram resources. A Type 8 (Challenger) in a Dutch or German professional context may express directness and confrontation openly, which fits cultural norms. The same Type 8 in an Indonesian or Kenyan context may express the same core energy very differently — channeling assertiveness through influence, quiet authority, or strategic positioning rather than direct challenge. The core motivation is the same; the expression is shaped by cultural context. Current research on cross-cultural Enneagram expression is still limited, so caution is warranted before making strong generalizations.",
  },
  {
    question: "How can I use the Enneagram with a cross-cultural leadership team?",
    answer: "Use it as a starting point for conversation rather than a label. Share types within the team, discuss how each person recognizes themselves in the description, and then explicitly invite the cultural layer: \"Does this type description fully fit how you experience yourself in this cultural setting?\" That question opens rich dialogue about the difference between personality and cultural conditioning — and helps the team avoid assuming that a type description is universal in its expression.",
  },
  {
    question: "What is the difference between Enneagram wings and stress/security lines?",
    answer: "Wings refer to the two types adjacent to your primary type on the Enneagram circle. Most people lean toward one wing, and it adds texture and nuance to the primary type. Stress and security lines describe how your type tends to shift under pressure (stress line) or in a season of genuine health and growth (security line). These dynamics are particularly useful in leadership development because they show not just who someone is now, but what they move toward when the conditions change.",
  },
];

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
          __html: JSON.stringify(generateFAQSchema(ENNEAGRAM_FAQS)),
        }}
      />
      <Script
        id="enneagram-ga-tracking"
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
              { label: "Enneagram" },
            ]}
          />
        </div>
      </div>

      <EnneagramClient {...props} isSaved={isSaved} />

      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-wide">
          <RelatedResources slug="enneagram" />
        </div>
      </div>
    </>
  );
}
