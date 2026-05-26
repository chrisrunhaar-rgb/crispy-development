import { Metadata } from "next";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { generateResourceArticleSchema, generateResourceBreadcrumbSchema, generateResourceMetadata, generateFAQSchema } from "@/lib/seo-utils";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedResources from "@/components/RelatedResources";
import ModuleComments from "@/components/ModuleComments";
import DiscClient from "./DiscClient";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "disc";

const DISC_FAQS = [
  {
    question: "What is the DISC personality assessment?",
    answer: "DISC is a behavioural assessment tool that categorises leadership and communication styles into four types: Dominance (D), Influence (I), Steadiness (S), and Conscientiousness (C). Developed in 1928, DISC helps leaders understand how they naturally approach tasks, relationships, and decision-making — and how their default style lands with others.",
  },
  {
    question: "How long does the DISC assessment take?",
    answer: "The DISC assessment takes about 10–12 minutes. You'll answer 24 scenario-based questions and receive a personalised result showing your score breakdown across all four DISC styles — plus a combined profile if two styles are closely matched.",
  },
  {
    question: "What do the four DISC types mean?",
    answer: "D (Dominance) types are direct, results-driven, and decisive. I (Influence) types are enthusiastic, relational, and persuasive. S (Steadiness) types are patient, loyal, and supportive. C (Conscientiousness) types are analytical, precise, and quality-focused. Most people lead with one primary style and balance it with a secondary.",
  },
  {
    question: "Is DISC accurate for cross-cultural leadership?",
    answer: "DISC is a useful starting point, but it was developed in the United States in 1928 and reflects mainstream American behavioural norms. Cross-cultural validity varies significantly. Use DISC to start team conversations, then let your team's actual cultural backgrounds fill in the nuance.",
  },
  {
    question: "Can I use DISC with my team?",
    answer: "Yes — DISC is most powerful as a shared team vocabulary. When a whole team knows their styles, communication improves, roles can be assigned more intentionally, and conflicts are easier to name without personal judgement.",
  },
  {
    question: "What is the difference between DISC and Myers-Briggs (MBTI)?",
    answer: "DISC focuses on observable behaviour — how you act in specific workplace situations. Myers-Briggs focuses on personality preferences — how you think and perceive the world. DISC is more directly actionable for communication and leadership dynamics.",
  },
];

export const metadata = generateResourceMetadata(RESOURCE_SLUG);

export default async function ResourcePage(props: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes(RESOURCE_SLUG);

  const breadcrumbSchema = generateResourceBreadcrumbSchema(RESOURCE_SLUG);
  const discResult = (user?.user_metadata?.disc_result ?? null) as string | null;
  const discScores = (user?.user_metadata?.disc_scores ?? null) as { D: number; I: number; S: number; C: number } | null;

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
          __html: JSON.stringify(generateFAQSchema(DISC_FAQS)),
        }}
      />
      <Script
        id="disc-ga-tracking"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.gtag?.('event', 'resource_viewed', { resource: '${RESOURCE_SLUG}', category: 'assessments' });`,
        }}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 border-b border-gray-200 py-3 sticky top-0 z-10">
        <div className="container-wide">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Resources", href: "/resources" },
              { label: "DISC Profile" },
            ]}
          />
        </div>
      </div>

      {/* Assessment Content */}
      <DiscClient isSaved={isSaved} discResult={discResult} discScores={discScores} />

      {/* Related Resources */}
      <div className="border-t border-gray-100 py-10">
        <div className="container-wide">
          <ModuleComments slug="disc" />
        </div>
      </div>
      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-wide">
          <RelatedResources slug="disc" />
        </div>
      </div>
    </>
  );
}
