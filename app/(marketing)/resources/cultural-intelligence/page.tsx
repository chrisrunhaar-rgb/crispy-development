import { Metadata } from "next";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { generateResourceArticleSchema, generateResourceBreadcrumbSchema, generateResourceMetadata, generateFAQSchema } from "@/lib/seo-utils";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedResources from "@/components/RelatedResources";
import ModuleComments from "@/components/ModuleComments";
import CulturalIntelligenceClient from "./CulturalIntelligenceClient";
import ModuleConnector from "@/components/ModuleConnector";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "cultural-intelligence";

const CULTURAL_INTELLIGENCE_FAQS = [
  {
    question: "What is cultural intelligence and why does it matter for leaders?",
    answer: "Cultural intelligence (CQ) is the capability to function effectively across different cultural contexts. It was defined by researchers Earley and Ang in 2003 as a four-part capacity: knowing how to think about culture, having relevant cultural knowledge, being motivated to engage across differences, and adapting behaviour accordingly. For leaders working across cultures, CQ is not a soft skill — it is a core leadership competency that determines whether trust is built or quietly lost.",
  },
  {
    question: "What are the four dimensions of cultural intelligence?",
    answer: "The four CQ dimensions are: metacognitive CQ (mindfulness — how you process cultural information in real time), cognitive CQ (your knowledge of cultural norms, values, and practices), motivational CQ (your genuine drive to engage cross-culturally), and behavioural CQ (your ability to adjust verbal and non-verbal responses in different cultural settings). All four matter, but metacognitive CQ — catching your own assumptions in the moment — is where most leaders have the largest gap.",
  },
  {
    question: "How is cultural intelligence different from cultural knowledge?",
    answer: "Cultural knowledge (facts about a culture) is only one of the four CQ dimensions. Knowledge alone does not produce effectiveness. A leader can know that Asian colleagues tend to avoid direct disagreement and still manage meetings in ways that suppress honest input. CQ is the full capacity — including the mindset, the motivation, and the behavioural flexibility — to do something useful with what you know.",
  },
  {
    question: "Can cultural intelligence be developed, or is it a natural trait?",
    answer: "CQ is developable. Research consistently shows that targeted reflection, cross-cultural exposure with intentional debriefing, and specific skill practice all increase CQ over time. Simply being in a cross-cultural environment does not develop CQ automatically — leaders who live abroad for years without reflective practice often plateau. Structured tools like a CQ assessment followed by honest peer feedback accelerate the process considerably.",
  },
  {
    question: "Why do cross-cultural ministry and field work efforts frequently fail due to cultural factors?",
    answer: "Research on cross-cultural ministry specifically highlights metacognitive CQ as the most under-developed dimension in ministry leaders, particularly those from Western contexts. The problem is not bad intentions — it is unexamined assumptions about how leadership, communication, authority, and community are supposed to work. When those assumptions run the show undetected, they produce confusion, withdrawal, and relational breakdown on the other side of the table.",
  },
  {
    question: "How does cultural intelligence connect to Christian faith?",
    answer: "David Livermore, who has written the most significant Christian application of CQ research, argues that CQ is not primarily behaviour modification. It is inward transformation — a response to the Great Commandment applied across cultural distance. Loving your neighbour as yourself requires first understanding how your neighbour experiences the world. That is a theological imperative, not just a professional development goal.",
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
          __html: JSON.stringify(generateFAQSchema(CULTURAL_INTELLIGENCE_FAQS)),
        }}
      />
      <Script
        id="cq-ga-tracking"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.gtag?.('event', 'resource_viewed', { resource: '${RESOURCE_SLUG}', category: 'leadership' });`,
        }}
      />

      <div className="bg-gray-50 border-b border-gray-200 py-3 sticky top-0 z-10">
        <div className="container-wide">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Resources", href: "/resources" },
              { label: "Cultural Intelligence" },
            ]}
          />
        </div>
      </div>

      <CulturalIntelligenceClient {...props} isSaved={isSaved} />
      <ModuleConnector currentSlug={RESOURCE_SLUG} savedResources={savedResources} isLoggedIn={!!user} />
      <div className="border-t border-gray-100 py-10">
        <div className="container-wide">
          <ModuleComments slug="cultural-intelligence" />
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-wide">
          <RelatedResources slug="cultural-intelligence" />
        </div>
      </div>
    </>
  );
}
