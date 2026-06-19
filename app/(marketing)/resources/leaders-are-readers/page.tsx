import { Metadata } from "next";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { requireModuleAccess } from "@/lib/require-module-access";
import { generateResourceArticleSchema, generateResourceBreadcrumbSchema, generateResourceMetadata, generateFAQSchema } from "@/lib/seo-utils";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedResources from "@/components/RelatedResources";
import ModuleComments from "@/components/ModuleComments";
import ModuleConnector from "@/components/ModuleConnector";
import LeadersReadersClient from "./LeadersReadersClient";

const faqItems = [
  {
    question: "What does 'leaders are readers' mean?",
    answer: "It is a simple but serious claim: the leaders who keep growing are almost always the ones who keep reading. The phrase captures the idea that leadership is not a destination you arrive at but a discipline you maintain. Reading is one of the primary ways a leader stays curious, stays humble, and stays sharp. It is not about how many books you finish; it is about whether you are still learning.",
  },
  {
    question: "Does reading really make you a better leader?",
    answer: "Research consistently shows that leaders who read regularly develop stronger critical thinking, clearer communication, and greater ability to understand how other people think and feel. Studies on reading and theory of mind suggest that engaging seriously with another person's perspective on the page builds the same mental muscles needed to lead people well. That said, the reading has to be active; the goal is not information collected, but insight applied.",
  },
  {
    question: "How does reading help cross-cultural leaders specifically?",
    answer: "Cross-cultural leaders must understand contexts that are not their own and make judgment calls in situations their background never prepared them for. Books are one of the most accessible ways to enter another world without physically being there. Reading voices from different cultures, traditions, and centuries gives a cross-cultural leader a wider frame of reference, and that wider frame is often exactly what a difficult situation requires.",
  },
  {
    question: "What kinds of books should a leader read?",
    answer: "A well-rounded reading diet includes practical books on leadership challenges, biographies and memoirs showing how real people navigated real difficulty, and fiction or narrative writing from authors within the cultures you serve. That last category is often neglected but may be the most valuable: a novel written from inside a culture teaches you things a textbook about that culture never quite can.",
  },
  {
    question: "What is the most common mistake leaders make with reading?",
    answer: "Treating it as something they will get to when things slow down. Things do not slow down. The leaders who read consistently are the ones who have stopped waiting for a quiet season and started protecting a small amount of time now, even fifteen or twenty minutes a day. The second most common mistake is reading only for information, collecting ideas without asking what will actually change in how they lead.",
  },
  {
    question: "What does the Bible say about reading and learning?",
    answer: "Scripture takes the pursuit of wisdom seriously enough to dedicate entire books to it. Proverbs 1:5 says the wise person keeps listening and adds to their learning. The apostle Paul, writing from prison shortly before his death, asked Timothy to bring his books and parchments (2 Timothy 4:13); even at the end of his life, under those circumstances, Paul wanted his books. The Christian intellectual tradition has always held that loving God with your mind is a command, not an option.",
  },
];

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "leaders-are-readers";

export const metadata = generateResourceMetadata(RESOURCE_SLUG);

export default async function ResourcePage(props: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  await requireModuleAccess(supabase, user?.id ?? null, RESOURCE_SLUG, user?.email ?? null);
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
        id="faq-leaders-are-readers"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema(faqItems)),
        }}
      />
      <Script
        id="lar-ga-tracking"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.gtag?.('event', 'resource_viewed', { resource: '${RESOURCE_SLUG}', category: 'personal-growth' });`,
        }}
      />

      <div className="bg-gray-50 border-b border-gray-200 py-3 sticky top-0 z-10">
        <div className="container-wide">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Resources", href: "/resources" },
              { label: "Leaders Are Readers" },
            ]}
          />
        </div>
      </div>

      <LeadersReadersClient isSaved={isSaved} isLoggedIn={!!user} />
      <ModuleConnector currentSlug={RESOURCE_SLUG} savedResources={savedResources} isLoggedIn={!!user} />
      <div className="border-t border-gray-100 py-10">
        <div className="container-wide">
          <ModuleComments slug="leaders-are-readers" />
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-wide">
          <RelatedResources slug="leaders-are-readers" />
        </div>
      </div>
    </>
  );
}
