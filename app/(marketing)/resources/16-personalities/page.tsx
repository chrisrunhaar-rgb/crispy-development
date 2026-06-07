import { Metadata } from "next";
import Script from "next/script";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireSubscription } from "@/lib/require-subscription";
import { generateResourceArticleSchema, generateResourceBreadcrumbSchema, generateResourceMetadata, generateFAQSchema } from "@/lib/seo-utils";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedResources from "@/components/RelatedResources";
import ModuleComments from "@/components/ModuleComments";
import Personalities16Client from "./Personalities16Client";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "16-personalities";

const faqItems = [
  {
    question: "What is the Myers-Briggs Type Indicator and how does it work?",
    answer: "The Myers-Briggs Type Indicator (MBTI) is a personality assessment built on Carl Jung's theory of psychological types, developed by Isabel Briggs Myers and her mother Katharine Cook Briggs in the mid-20th century. It sorts people into one of 16 types based on four dimensions: Introversion/Extraversion, Sensing/Intuition, Thinking/Feeling, and Judging/Perceiving. Each combination produces a four-letter type (e.g., INTJ, ENFP) that describes how a person tends to take in information and make decisions. It is widely used in leadership development, team building, and personal growth contexts worldwide.",
  },
  {
    question: "Is MBTI scientifically valid and reliable?",
    answer: "MBTI remains popular in organizational settings, but the scientific community has raised concerns about its test-retest reliability — studies show that a significant percentage of people receive a different type when retested weeks later. Critics note that the forced binary categories oversimplify what are actually continuous traits. This does not mean MBTI is useless — many leaders find it sparks valuable self-reflection and conversation — but it should be used as a starting-point dialogue tool rather than a definitive psychological profile. Pair it with other frameworks for a more rounded picture.",
  },
  {
    question: "How does culture affect how MBTI types show up?",
    answer: "MBTI was developed primarily in a Western, individualist cultural context, which shapes what 'introversion' or 'extraversion' looks like in practice. In collectivist cultures across East Asia, Southeast Asia, or West Africa, speaking less in group settings or deferring to elders may be a cultural norm rather than a personality trait — making an individual appear introverted on an MBTI scale when they are not. Cross-cultural workers should interpret MBTI results with this cultural filter in mind.",
  },
  {
    question: "Can MBTI be used effectively in international or multicultural teams?",
    answer: "Yes, with appropriate cultural calibration. MBTI can still generate useful conversation in multicultural teams — particularly around communication styles, decision-making preferences, and how people recharge — as long as facilitators acknowledge that the framework carries cultural assumptions. Teams benefit most when MBTI is used to open dialogue ('Here is how I tend to work — what about you?') rather than to assign fixed labels. Facilitators with cross-cultural competence should lead these sessions.",
  },
  {
    question: "What is the difference between MBTI and the 16 Personalities test?",
    answer: "The 16 Personalities test (16personalities.com) is a popular free online tool inspired by MBTI theory but not the official Myers-Briggs assessment. The 16 Personalities test adds a fifth dimension, Assertive/Turbulent (A/T), producing 32 possible profiles, and uses its own scoring methodology. It is broadly accessible and widely shared, especially among younger adults. While it shares MBTI's type language and Jungian roots, the two assessments are not identical. For professional leadership development or coaching contexts, the official MBTI instrument administered by a certified practitioner is more appropriate.",
  },
  {
    question: "How should a Christian leader think about personality typing tools like MBTI?",
    answer: "Personality typing tools can be a useful gift, approached with humility. The biblical image of the body of Christ (1 Corinthians 12) affirms that different people are genuinely wired differently, and exploring that wiring can help leaders build teams with complementary strengths. At the same time, no four-letter code captures the full mystery of a person made in God's image — Psalm 139 reminds us that we are fearfully and wonderfully made. The healthy posture is to use tools like MBTI as a conversation starter, not a final verdict, and to remain open to the Holy Spirit's ongoing work of transformation.",
  },
];

export const metadata = generateResourceMetadata(RESOURCE_SLUG);

export default async function ResourcePage(props: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  await requireSubscription(supabase, user.id);

  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes(RESOURCE_SLUG);
  const savedType = (user?.user_metadata?.personalities16_type ?? null) as string | null;
  const savedScores = (user?.user_metadata?.personalities16_scores ?? null) as Record<string, number> | null;

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
        id="16p-ga-tracking"
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
              { label: "16 Personalities" },
            ]}
          />
        </div>
      </div>

      <Personalities16Client {...props} isSaved={isSaved} savedType={savedType} savedScores={savedScores} />
      <div className="border-t border-gray-100 py-10">
        <div className="container-wide">
          <ModuleComments slug="16-personalities" />
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-wide">
          <RelatedResources slug="16-personalities" />
        </div>
      </div>
    </>
  );
}
