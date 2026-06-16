import { Metadata } from "next";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { requireModuleAccess } from "@/lib/require-module-access";
import { generateResourceArticleSchema, generateResourceBreadcrumbSchema, generateResourceMetadata, generateFAQSchema } from "@/lib/seo-utils";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedResources from "@/components/RelatedResources";
import ModuleComments from "@/components/ModuleComments";
import FourStagesClient from "./FourStagesClient";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "four-stages-competence";

export const metadata = generateResourceMetadata(RESOURCE_SLUG);

export default async function ResourcePage(props: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  await requireModuleAccess(supabase, user?.id ?? null, RESOURCE_SLUG, user?.email ?? null);

  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes(RESOURCE_SLUG);

  return (
    <>
      <Script
        id={`breadcrumb-${RESOURCE_SLUG}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateResourceBreadcrumbSchema(RESOURCE_SLUG)) }}
      />
      <Script
        id={`article-${RESOURCE_SLUG}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateResourceArticleSchema(RESOURCE_SLUG)) }}
      />
      <Script
        id="faq-four-stages"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema([
            {
              question: "Who created the Four Stages of Competence model?",
              answer: "The model is most commonly attributed to Noel Burch of Gordon Training International, who popularized it through their training programs in the early 1970s. However, Martin M. Broadwell published it in 1969, a 1960 NYU management textbook contains the same structure, and T. Earl Pardoe described a comparable model as far back as 1923. The attribution to Abraham Maslow is a documented error.",
            },
            {
              question: "What is the most important stage in the Four Stages of Competence?",
              answer: "Stage 2 — Conscious Incompetence — is the most pivotal. It is where learning actually becomes possible. Research on cross-cultural development consistently identifies this as the highest dropout point: the discomfort of knowing you are incompetent is hard to sustain, and many leaders retreat before crossing it.",
            },
            {
              question: "Why is Stage 4 a leadership challenge?",
              answer: "Stage 4 — Unconscious Competence — creates the Curse of Knowledge: when a skill becomes automatic, you lose access to the memory of not knowing it. For leaders who want to develop others, this is a significant problem. Several researchers have proposed a fifth stage called reflective competence to describe the capacity to unpack and teach one's own unconscious competence.",
            },
            {
              question: "How does the Four Stages model apply to cross-cultural leadership?",
              answer: "William Howell's 1982 work provides the canonical cross-cultural application: at Stage 1, leaders assume their own cultural norms are universal; at Stage 4, they move between cultures with natural fluency. Every new cultural context resets a leader to Stage 1. In high-context Southeast Asian cultures, the Stage 1-to-2 transition often requires a trusted cultural interpreter.",
            },
            {
              question: "Is there a Stage 5 in the Four Stages of Competence model?",
              answer: "Several researchers have proposed fifth-stage extensions. David Baume proposed Reflective Competence; Linda Gilbert called it Re-conscious Competence; Lorgene Mata described Enlightened Competence. All point to the same need: the ability to access and articulate one's own Stage 4 knowing for the benefit of those still developing.",
            },
            {
              question: "How long does it take to move through all four stages?",
              answer: "There is no fixed timeline. Duration depends on skill complexity, quality of deliberate practice, frequency of feedback, and available support structures. Anders Ericsson's research shows that quality of Stage 3 practice matters far more than time spent. In cross-cultural leadership, genuine Stage 4 fluency in a new cultural context typically takes years.",
            },
          ])),
        }}
      />
      <Script
        id="fsc-ga-tracking"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.gtag?.('event', 'resource_viewed', { resource: '${RESOURCE_SLUG}', category: 'personal-development' });`,
        }}
      />

      <div className="bg-gray-50 border-b border-gray-200 py-3 sticky top-0 z-10">
        <div className="container-wide">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Resources", href: "/resources" },
              { label: "Four Stages of Competence" },
            ]}
          />
        </div>
      </div>

      <FourStagesClient {...props} isSaved={isSaved} />

      <div className="border-t border-gray-100 py-10">
        <div className="container-wide">
          <ModuleComments slug={RESOURCE_SLUG} />
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-wide">
          <RelatedResources slug={RESOURCE_SLUG} />
        </div>
      </div>
    </>
  );
}
