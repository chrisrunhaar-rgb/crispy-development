import { Metadata } from "next";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { generateResourceArticleSchema, generateResourceBreadcrumbSchema, generateResourceMetadata, generateFAQSchema } from "@/lib/seo-utils";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedResources from "@/components/RelatedResources";
import ModuleComments from "@/components/ModuleComments";
import TimeAndCultureClient from "./TimeAndCultureClient";

const faqItems = [
  {
    question: "What is time orientation in cross-cultural leadership?",
    answer: "Time orientation refers to the cultural assumptions that shape how people experience and use time — whether they see it as a resource to manage, a relational space, a contextual signal, or a communal rhythm. Researchers like Edward T. Hall identified these patterns as monochronic and polychronic time. Cross-cultural leaders who understand time orientation can prevent team friction and build more effective partnerships."
  },
  {
    question: "Why do cross-cultural teams struggle with time and deadlines?",
    answer: "Cross-cultural teams often struggle with time because each member is operating from a different unspoken set of assumptions about what time means. A deadline might be a firm commitment to one person and a rough horizon to another. A late arrival might signal disrespect in one culture and simply mean the meeting hasn't started yet in another. These clashes become personal when they should be treated as logic differences."
  },
  {
    question: "What are the four cultural orientations to time?",
    answer: "The four major orientations are: the Clock Keeper (monochronic time — time as a resource), the Relationship Weaver (polychronic time — time as relational), the Harmony Follower (reactive time — time as contextual), and the Community Keeper (communal time — time as constituted by people). Each has academic roots in the work of researchers like Edward T. Hall, Richard Lewis, and John Mbiti."
  },
  {
    question: "What is the difference between chronos and kairos?",
    answer: "Chronos refers to sequential, measurable clock time — the kind tracked by schedules, deadlines, and calendars. Kairos refers to appointed or significant time — the right moment, as described in Galatians 4:4 when 'the time had fully come.' Both appear in Scripture. Cross-cultural leaders benefit from understanding both: chronos for operational clarity, kairos for sensitivity to moments that matter more than schedules."
  },
  {
    question: "How can I use time orientation awareness in my team?",
    answer: "Start by naming your own orientation, which this module helps you discover through a self-assessment. Then observe the orientation of the culture you work with. The gap between the two is where friction forms. Leaders who can see that gap forming in real time — a meeting running over, a deadline missed without alarm — can name it, open a brief team conversation, and prevent the friction from becoming a conflict."
  },
  {
    question: "Is this module relevant if I work within my own culture?",
    answer: "Yes. Even within a single cultural setting, teams often contain individuals with different time orientations shaped by family background, professional training, or personal wiring. The framework in this module helps any leader understand the unspoken time assumptions their team is operating from — and create a shared language where there was only unspoken friction before."
  }
];

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "time-and-culture";

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
          __html: JSON.stringify(generateFAQSchema(faqItems)),
        }}
      />
      <Script
        id="tac-ga-tracking"
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
              { label: "Time & Culture" },
            ]}
          />
        </div>
      </div>

      <TimeAndCultureClient {...props} isSaved={isSaved} />
      <div className="border-t border-gray-100 py-10">
        <div className="container-wide">
          <ModuleComments slug="time-and-culture" />
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-wide">
          <RelatedResources slug="time-and-culture" />
        </div>
      </div>
    </>
  );
}
