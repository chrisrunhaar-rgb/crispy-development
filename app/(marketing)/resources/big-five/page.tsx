import { Metadata } from "next";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { generateResourceArticleSchema, generateResourceBreadcrumbSchema, generateResourceMetadata, generateFAQSchema } from "@/lib/seo-utils";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedResources from "@/components/RelatedResources";
import BigFiveClient from "./BigFiveClient";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "big-five";

const faqItems = [
  {
    question: "What are the Big Five personality traits?",
    answer: "The Big Five personality model, also known as OCEAN, identifies five broad dimensions of human personality: Openness to Experience, Conscientiousness, Extraversion, Agreeableness, and Neuroticism (sometimes reframed as Emotional Stability). Each trait exists on a spectrum, so a person is not simply 'agreeable' or 'not agreeable' but falls somewhere along a continuum. The model emerged from decades of factor-analytic research, most prominently developed by Robert McCrae and Paul Costa, and is widely regarded as the most empirically robust personality framework available. Unlike MBTI, which sorts people into discrete types, the Big Five measures where a person sits on each of five independent dimensions.",
  },
  {
    question: "Why is the Big Five considered more reliable than MBTI for cross-cultural research?",
    answer: "The Big Five has been validated across dozens of cultures and languages, making it the preferred instrument in cross-cultural personality research. McCrae and Costa's studies demonstrated that the five-factor structure holds with reasonable consistency across diverse populations, including cultures in East Asia, West Africa, Latin America, and the Middle East. This cross-cultural robustness is largely absent from MBTI, which was developed and normed primarily on Western samples. The Big Five provides a shared dimensional vocabulary that can be applied across contexts with appropriate cultural interpretation.",
  },
  {
    question: "How do the Big Five traits vary across cultures?",
    answer: "While the five-factor structure appears cross-culturally consistent, the average levels of each trait and how traits are expressed vary meaningfully across cultures. Agreeableness tends to score higher in more collectivist societies, partly because relational harmony is culturally valued and socially reinforced. Conscientiousness shows variation linked to cultural attitudes toward work, duty, and social obligation. Openness to Experience may be expressed very differently in cultures that prize tradition over novelty. Cultural-level values and individual-level personality traits are distinct dimensions that can easily be conflated — a methodological caution that serious practitioners must keep in view.",
  },
  {
    question: "Can the Big Five be used in leadership development for international teams?",
    answer: "Yes, and it is generally better suited to multicultural leadership contexts than type-based tools because it avoids binary labeling and works with dimensions that have cross-cultural empirical support. In international team settings, Big Five assessments can help leaders understand their tendencies around openness to new approaches, follow-through on commitments (Conscientiousness), team cohesion (Agreeableness), social energy (Extraversion), and emotional resilience (low Neuroticism). Practitioners should still apply cultural interpretation — a low Agreeableness score in a culture where directness is valued looks very different from the same score in a relational, high-context culture.",
  },
  {
    question: "What does the Big Five say about Agreeableness and Neuroticism across cultures?",
    answer: "Agreeableness and Neuroticism are the two Big Five dimensions that show the most meaningful cross-cultural variation. Agreeableness tends to be higher in cultures with strong collectivist values, where cooperation, deference, and relational harmony are socially reinforced. Neuroticism, or emotional reactivity, shows variation that some researchers link to cultural norms around emotional expression — cultures that permit open emotional display may produce different self-report scores than cultures where emotional restraint is expected. Raw Big Five scores should never be interpreted outside their cultural context.",
  },
  {
    question: "How does a faith perspective shape how a leader uses the Big Five?",
    answer: "A faith perspective invites leaders to use the Big Five as a tool for the kind of sober self-knowledge Paul commends in Romans 12: 'Do not think of yourself more highly than you ought, but rather think of yourself with sober judgment.' Understanding your genuine personality tendencies — your level of openness, your conscientiousness under pressure, your emotional reactivity — is an act of stewardship, not vanity. It allows you to lead from your actual strengths rather than a projected image, and to build teams that compensate for your genuine limitations.",
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
          __html: JSON.stringify(generateFAQSchema(faqItems)),
        }}
      />
      <Script
        id="bigfive-ga-tracking"
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
              { label: "Big Five" },
            ]}
          />
        </div>
      </div>

      <BigFiveClient {...props} isSaved={isSaved} startInQuiz={props.searchParams?.retake === "1"} />

      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-wide">
          <RelatedResources slug="big-five" />
        </div>
      </div>
    </>
  );
}
