import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { generateResourceArticleSchema, generateResourceBreadcrumbSchema, generateResourceMetadata, generateFAQSchema } from "@/lib/seo-utils";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedResources from "@/components/RelatedResources";
import ModuleComments from "@/components/ModuleComments";
import HealthyConflictClient from "./HealthyConflictClient";
import FreeModuleSignupBanner from "@/components/FreeModuleSignupBanner";
import ModuleConnector from "@/components/ModuleConnector";
import { requireModuleAccess } from "@/lib/require-module-access";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "healthy-conflict";

const HEALTHY_CONFLICT_FAQS = [
  {
    question: "What is healthy conflict?",
    answer: "Healthy conflict is when people face a conflict openly and with respect. Through it they gain unity, clarity and trust, and they continue together afterwards.",
  },
  {
    question: "Why does conflict feel unsafe?",
    answer: "Many people have lived through unhealthy conflict, such as shouting, blame or silence. The old fear comes back when a new conflict starts. The fear is real, even when the new team is safe.",
  },
  {
    question: "What is the difference between giving way and avoiding conflict?",
    answer: "Giving way comes from care for the other person, and the matter is finished for you. Avoiding comes from fear, and the matter keeps coming back. If it keeps coming back, it still needs to be named.",
  },
  {
    question: "What are the five rules for healthy conflict?",
    answer: "Trust is a decision, not a feeling. There is no winner and no loser. Talk about the problem, not the person. Listen until you can repeat the other person's view. Talk first, then adjust.",
  },
  {
    question: "How can a leader create a safe place for conflict?",
    answer: "Say that conflict is normal. Explain the rules before the conversation starts. Choose a calm and private time and place, and invite a neutral third person when needed.",
  },
  {
    question: "Can I name a conflict if I am not the leader?",
    answer: "Yes. You do not need a title. Start by raising it privately with the other person, and use the same five rules. If that does not feel safe, ask a trusted third person to help.",
  },
];

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
        id={`faq-${RESOURCE_SLUG}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema(HEALTHY_CONFLICT_FAQS)),
        }}
      />
      <Script
        id="hc-ga-tracking"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.gtag?.('event', 'resource_viewed', { resource: '${RESOURCE_SLUG}', category: 'team-facilitation' });`,
        }}
      />

      <div className="bg-gray-50 border-b border-gray-200 py-3 sticky top-0 z-10">
        <div className="container-wide">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Resources", href: "/resources" },
              { label: "Healthy Conflict" },
            ]}
          />
        </div>
      </div>

      <HealthyConflictClient userId={user?.id ?? null} isSaved={isSaved} signupBanner={<FreeModuleSignupBanner slug="healthy-conflict" isLoggedIn={!!user} />} />
      <FreeModuleSignupBanner slug="healthy-conflict" isLoggedIn={!!user} variant="end" />
      <ModuleConnector currentSlug={RESOURCE_SLUG} savedResources={savedResources} isLoggedIn={!!user} />

      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-wide">
          <RelatedResources slug={RESOURCE_SLUG} />
        </div>
      </div>
    </>
  );
}
