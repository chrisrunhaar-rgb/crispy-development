import { Metadata } from "next";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { generateResourceArticleSchema, generateResourceBreadcrumbSchema, generateResourceMetadata, generateFAQSchema } from "@/lib/seo-utils";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedResources from "@/components/RelatedResources";
import ModuleComments from "@/components/ModuleComments";
import ThinkingStylesClient from "./ThinkingStylesClient";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "three-thinking-styles";

const THREE_THINKING_STYLES_FAQS = [
  {
    question: "What are the three thinking styles in Crispy's framework?",
    answer: "Crispy Development's Three Thinking Styles framework identifies three distinct modes of processing: Conceptual, Holistic, and Intuitional. Conceptual thinkers lead with ideas, frameworks, and possibilities — they start with the big picture and work toward specifics. Holistic thinkers lead with systems and connections — they see how things relate to each other and track second-order effects. Intuitional thinkers lead with gut feel, experience, and relational reading — they make sense of situations through lived knowledge rather than abstract reasoning.",
  },
  {
    question: "Why does thinking style matter in cross-cultural leadership teams?",
    answer: "Because different thinking styles produce different kinds of insight, and cross-cultural teams rarely have time to translate their differences into explicit conversation. A Conceptual thinker who wants to discuss the strategic vision can seem impractical and vague to an Intuitional thinker who needs to know what to do next Monday. An Intuitional thinker's read on a local community can seem anecdotal to a Holistic thinker building a systems model. When teams understand each other's default mode of processing, the frustration decreases and the collaboration improves.",
  },
  {
    question: "Is this the same as other thinking style frameworks?",
    answer: "No. The Three Thinking Styles framework is a proprietary model developed by Chris Runhaar through his work in cross-cultural leadership development. While other frameworks describe cognitive preferences (such as the Six Thinking Hats or various learning style models), the Conceptual-Holistic-Intuitional distinction was developed specifically for application in cross-cultural field and organizational contexts. It is not derived from existing academic typologies and should not be conflated with them.",
  },
  {
    question: "What does a Conceptual thinker look like in a team meeting?",
    answer: "Conceptual thinkers tend to lead with ideas and possibilities. In a team meeting, they often introduce new frameworks, reframe the question being asked, or propose ambitious approaches that have not been tried before. They can seem to jump ahead of where the team is in the conversation. Their frustration typically emerges when the team is stuck in implementation details before the overall direction is clear. They are at their best when given space to think out loud and then bring the team into the reasoning.",
  },
  {
    question: "What does an Intuitional thinker contribute that the other styles cannot?",
    answer: "Intuitional thinkers bring something that data and frameworks alone cannot produce: the read on the room. They often know before others do whether a plan will actually work in a specific community, whether a team relationship is under stress that is not yet visible, or whether the timing of a decision is off. In cross-cultural field work, this capacity is invaluable. Communities that are navigating significant power dynamics or social complexity are often not fully legible through conceptual frameworks alone. The Intuitional thinker who has built trust over time holds knowledge that no amount of analysis can replicate.",
  },
  {
    question: "How can a team with all three thinking styles work together more effectively?",
    answer: "The key is sequencing. In the early stages of a decision or planning process, Conceptual thinkers help the team see the full range of possibilities. Holistic thinkers then map out the implications and connections — what does choosing this direction mean for the other systems it touches? Intuitional thinkers apply the final filter: given who we are, where we are, and what we know from experience, what is actually workable here? Teams that learn to move through this sequence deliberately — rather than letting each style fight for dominance — produce decisions that are both more creative and more practically sound.",
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
          __html: JSON.stringify(generateFAQSchema(THREE_THINKING_STYLES_FAQS)),
        }}
      />
      <Script
        id="tts-ga-tracking"
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
              { label: "Three Thinking Styles" },
            ]}
          />
        </div>
      </div>

      <ThinkingStylesClient {...props} isSaved={isSaved} />
      <div className="border-t border-gray-100 py-10">
        <div className="container-wide">
          <ModuleComments slug="three-thinking-styles" />
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-wide">
          <RelatedResources slug="three-thinking-styles" />
        </div>
      </div>
    </>
  );
}
