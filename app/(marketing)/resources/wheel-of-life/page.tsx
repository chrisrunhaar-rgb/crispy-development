import { Metadata } from "next";
import Script from "next/script";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireModuleAccess } from "@/lib/require-module-access";
import { generateResourceArticleSchema, generateResourceBreadcrumbSchema, generateResourceMetadata, generateFAQSchema } from "@/lib/seo-utils";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedResources from "@/components/RelatedResources";
import ModuleComments from "@/components/ModuleComments";
import WheelOfLifeClient from "./WheelOfLifeClient";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "wheel-of-life";

const faqItems = [
  {
    question: "What is the Wheel of Life and how does it work?",
    answer: "The Wheel of Life is a self-assessment tool that invites you to rate your current level of satisfaction across several key life domains, typically including career, finances, health, relationships, personal growth, recreation, family, and spiritual life. Each domain is represented as a segment of a circle, and you score yourself from 0 (center) to 10 (outer edge) in each area. The resulting shape reveals which areas feel full and which feel neglected, producing a visual snapshot of where life feels in balance and where attention may be needed. The concept is most commonly attributed to Paul Meyer and remains one of the most widely used starting-point assessments in personal development coaching.",
  },
  {
    question: "What are the limitations of the Wheel of Life for people from non-Western cultures?",
    answer: "The standard Wheel of Life model carries assumptions that reflect individualist, Western values. The domain categories assume a person experiences career, family, and personal growth as separate, distinct areas of life, which is less true in collectivist cultures where work, family, community, and spiritual life are deeply interwoven. In many Asian, African, and Middle Eastern contexts, separating 'self' from 'family' or 'work' from 'community' may feel disrespectful of the relational and communal nature of life. Adapting the Wheel to include communally defined domains produces more honest and useful results than applying the standard Western model without modification.",
  },
  {
    question: "How does the Wheel of Life apply to cross-cultural workers and field workers?",
    answer: "Cross-cultural workers, including those serving in long-term field assignments, often experience a collapse of the domains the Wheel treats as separate. Their home is their workplace, their colleagues are their community, their ministry is their family life. Applying a standard Wheel of Life to this reality may produce scores that mean little. Research on cross-cultural worker wellbeing consistently shows that physical health, marriage health, and sense of calling are the three most critical factors in long-term field sustainability. A Wheel adapted for field workers might foreground rest rhythms, team relational health, identity outside of role, and connection to home community.",
  },
  {
    question: "Is the 'balance' concept in the Wheel of Life valid across cultures?",
    answer: "'Balance' as a life goal is a concept that travels unevenly across cultures. In many Western individualist frameworks, balance implies a roughly equal distribution of energy and attention across life domains, framed as a personal achievement to be managed. In many other cultural contexts, life is understood as seasonal, communal, and rhythmic rather than balanced — seasons of intense focus followed by seasons of rest, responsibilities determined by communal roles rather than personal preference. The Wheel of Life works best when treated not as a prescription for equal slices but as a diagnostic map that reveals where energy is concentrated and where it is depleted.",
  },
  {
    question: "What does the Bible say about life balance and whole-person flourishing?",
    answer: "The Bible does not use the language of balance, but it offers a rich picture of whole-person flourishing through the Hebrew concept of shalom — not simply the absence of conflict but the presence of comprehensive wellbeing, right relationships with God, with others, with oneself, and with the created world. Luke 2:52 describes Jesus growing 'in wisdom and stature, and in favor with God and man,' a four-dimensional description of human development. The practice of Sabbath challenges any version of life assessment that treats rest as optional rather than a creation ordinance built into weekly rhythm.",
  },
  {
    question: "How often should a leader use the Wheel of Life assessment?",
    answer: "Most practitioners recommend completing the Wheel of Life two to four times per year, or at the beginning of significant transitions such as a new role, a new season of ministry, or a major life change. The value of the tool is not in a single snapshot but in tracking shifts over time: which domains consistently score low, which areas improve when others receive attention, and what patterns emerge across seasons. For cross-cultural workers in particular, completing the Wheel before and after major field assignments can surface patterns of depletion that might otherwise go unnoticed until they become crises.",
  },
];

export const metadata = generateResourceMetadata(RESOURCE_SLUG);

export default async function ResourcePage(props: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  await requireModuleAccess(supabase, user?.id ?? null, RESOURCE_SLUG);

  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes(RESOURCE_SLUG);
  const savedScores = (user?.user_metadata?.wheel_of_life_scores ?? null) as Record<string, number> | null;
  const savedReflections = (user?.user_metadata?.wheel_reflections ?? null) as Record<string, { gratitude: string; action: string }> | null;

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
        id="wol-ga-tracking"
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
              { label: "Wheel of Life" },
            ]}
          />
        </div>
      </div>

      <WheelOfLifeClient {...props} isSaved={isSaved} savedScores={savedScores} savedReflections={savedReflections} />
      <div className="border-t border-gray-100 py-10">
        <div className="container-wide">
          <ModuleComments slug="wheel-of-life" />
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-wide">
          <RelatedResources slug="wheel-of-life" />
        </div>
      </div>
    </>
  );
}
