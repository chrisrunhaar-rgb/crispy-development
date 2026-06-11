import { Metadata } from "next";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { requireModuleAccess } from "@/lib/require-module-access";
import { generateResourceArticleSchema, generateResourceBreadcrumbSchema, generateResourceMetadata, generateFAQSchema } from "@/lib/seo-utils";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedResources from "@/components/RelatedResources";
import ModuleComments from "@/components/ModuleComments";
import UnderstandingHighContextClient from "./UnderstandingHighContextClient";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "understanding-high-context";

export const metadata = generateResourceMetadata(RESOURCE_SLUG);

export default async function ResourcePage(props: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  await requireModuleAccess(supabase, user?.id ?? null, RESOURCE_SLUG, user?.email ?? null);

  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes(RESOURCE_SLUG);

  const breadcrumbSchema = generateResourceBreadcrumbSchema(RESOURCE_SLUG);

  const faqSchema = generateFAQSchema([
    {
      question: "What is a high-context culture?",
      answer:
        "A high-context culture is one where meaning is carried largely through shared relationships, setting, and nonverbal signals — not only through explicit words. People who grow up in high-context cultures learn to read meaning between the lines. Most cultures in Asia, the Middle East, Latin America, and sub-Saharan Africa lean high-context.",
    },
    {
      question: "What is the difference between high-context and low-context communication?",
      answer:
        "In low-context communication, the message is in the words — direct, explicit, written down. In high-context communication, the message is in everything around the words: the relationship, the pause, the tone, what is not said. Neither is better. They are different systems, and the gap between them is where most cross-cultural misunderstandings happen.",
    },
    {
      question: "Is the high-context/low-context framework scientifically proven?",
      answer:
        "Not rigorously. Edward T. Hall, who introduced the concept, never published systematic data supporting his country classifications. Academic reviews (Cardon 2008, Kittler et al. 2011) found the framework empirically weak. However, the communication tendencies it describes — indirect refusal, silence as communication, face-saving — are well documented across many independent research traditions. Use it as a practical lens, not a scientific rulebook.",
    },
    {
      question: "What does 'saving face' mean in cross-cultural communication?",
      answer:
        "Face refers to a person's social dignity and standing. In many cultures — Chinese (mianzi), Arabic (wajh), Spanish-speaking (dignidad), Indonesian/Malay (malu) — public criticism or direct refusal is experienced as an attack on face. Indirect communication is often a relational gift: it delivers a difficult message without damaging the other person's dignity. Leaders who correct people publicly in these contexts often lose the relationship they were trying to improve.",
    },
    {
      question: "How do I know if someone is saying yes but meaning no?",
      answer:
        "Watch for hedging language: 'we will try,' 'it may be possible,' 'we will consider it.' Watch for silence after a confirmed deadline. Watch for enthusiasm that drops when a specific commitment is asked for. One reliable follow-up question: 'What would make this harder than expected?' The hesitation in the answer often carries the real message.",
    },
    {
      question: "Why do some cultures take longer to make decisions?",
      answer:
        "In many cultures, consensus must be built before a decision is announced — not during the meeting, but through informal consultation beforehand. Japanese organisations call this nemawashi; Indonesian culture calls it musyawarah mufakat; Zulu and Xhosa traditions call it indaba. A decision made without this pre-work is fragile and often quietly reversed. The process is not slower — it is different, and it produces a more durable outcome.",
    },
  ]);

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
          __html: JSON.stringify(faqSchema),
        }}
      />
      <Script
        id="uhc-ga-tracking"
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
              { label: "Understanding High Context" },
            ]}
          />
        </div>
      </div>

      <UnderstandingHighContextClient {...props} isSaved={isSaved} />
      <div className="border-t border-gray-100 py-10">
        <div className="container-wide">
          <ModuleComments slug="understanding-high-context" />
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-wide">
          <RelatedResources slug="understanding-high-context" />
        </div>
      </div>
    </>
  );
}
