import { Metadata } from "next";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { generateResourceArticleSchema, generateResourceBreadcrumbSchema, generateResourceMetadata, generateFAQSchema } from "@/lib/seo-utils";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedResources from "@/components/RelatedResources";
import FiveLanguagesClient from "./FiveLanguagesClient";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "5languages";

const FIVE_LANGUAGES_FAQS = [
  {
    question: "What are the 5 Languages of Appreciation in the Workplace?",
    answer: "Gary Chapman and Paul White adapted Chapman's original love languages framework for professional contexts, identifying five ways people feel genuinely valued: Words of Affirmation, Quality Time, Acts of Service, Tangible Gifts, and Physical Touch. In leadership teams, understanding which language your colleagues respond to changes how you offer care, recognition, and support — without guessing.",
  },
  {
    question: "How do love languages apply to cross-cultural leadership teams?",
    answer: "The five languages are consistent across cultures, but the way each language is expressed varies enormously. Public praise (a form of Words of Affirmation) is motivating in many Western team cultures and can cause shame or embarrassment in many East Asian and Southeast Asian settings. A leader who knows this distinction can offer affirmation privately and specifically, which lands far better than a well-meant public announcement.",
  },
  {
    question: "What is the difference between a giving language and a receiving language?",
    answer: "Your giving language is the way you naturally express care toward others — the default mode you fall back on when you want someone to feel valued. Your receiving language is the mode that actually lands with you and makes you feel genuinely appreciated. The gap between the two is where misunderstanding happens: you may be working hard to appreciate a colleague in a language they barely notice, while your own needs go unmet.",
  },
  {
    question: "Why do words of affirmation sometimes backfire in cross-cultural teams?",
    answer: "Research by Chapman and White found that Words of Affirmation is the most commonly expressed appreciation language, but in many Asian and Middle Eastern cultural contexts, public verbal praise draws attention to an individual in a way that feels uncomfortable rather than honoring. The intent is genuine; the impact is not what was hoped for. Knowing this helps leaders adjust the setting and specificity of affirmation rather than abandoning it altogether.",
  },
  {
    question: "Can this assessment be used for whole team development?",
    answer: "Yes, and it works best that way. When a team takes the assessment together and shares their results, the language of appreciation moves from individual insight to shared team vocabulary. Leaders can adapt how they affirm, assign work, schedule one-on-ones, and celebrate milestones in ways that reach each person rather than only those who share the leader's own default language.",
  },
  {
    question: "How is the 5 Languages of Appreciation different from the original 5 Love Languages?",
    answer: "Gary Chapman's original book focused on romantic relationships. The workplace adaptation by Chapman and Paul White shifted the framework to professional contexts, refined what each language looks like between colleagues rather than partners, and added research-backed tools for team application. Physical Touch in the workplace, for instance, is understood very narrowly — a handshake or a brief affirmation rather than anything more personal — and is the least universally applicable across cultures.",
  },
];

export const metadata = generateResourceMetadata(RESOURCE_SLUG);

export default async function ResourcePage(props: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes(RESOURCE_SLUG);

  const breadcrumbSchema = generateResourceBreadcrumbSchema(RESOURCE_SLUG);
  const receivingResult = (user?.user_metadata?.fivela_receiving_result ?? null) as string | null;
  const givingResult = (user?.user_metadata?.fivela_giving_result ?? null) as string | null;
  const receivingScores = (user?.user_metadata?.fivela_receiving_scores ?? null) as { A: number; B: number; C: number; D: number; E: number } | null;
  const givingScores = (user?.user_metadata?.fivela_giving_scores ?? null) as { A: number; B: number; C: number; D: number; E: number } | null;

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
          __html: JSON.stringify(generateFAQSchema(FIVE_LANGUAGES_FAQS)),
        }}
      />
      <Script
        id="5languages-ga-tracking"
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
              { label: "5 Languages of Appreciation" },
            ]}
          />
        </div>
      </div>

      {/* Assessment Content */}
      <FiveLanguagesClient
        isSaved={isSaved}
        receivingResult={receivingResult}
        givingResult={givingResult}
        receivingScores={receivingScores}
        givingScores={givingScores}
      />

      {/* Related Resources */}
      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-wide">
          <RelatedResources slug="5languages" />
        </div>
      </div>
    </>
  );
}
