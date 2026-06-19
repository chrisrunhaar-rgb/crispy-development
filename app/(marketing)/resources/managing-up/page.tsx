import { Metadata } from "next";
import Script from "next/script";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireModuleAccess } from "@/lib/require-module-access";
import { generateResourceArticleSchema, generateResourceBreadcrumbSchema, generateResourceMetadata, generateFAQSchema } from "@/lib/seo-utils";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedResources from "@/components/RelatedResources";
import ModuleComments from "@/components/ModuleComments";
import ManagingUpClient from "./ManagingUpClient";
import ModuleConnector from "@/components/ModuleConnector";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "managing-up";

const MANAGING_UP_FAQS = [
  {
    question: "What does managing up mean?",
    answer: "Managing up is the deliberate practice of improving your working relationship with your direct manager or senior leader. It means taking proactive responsibility for how you communicate, deliver results, and build trust upward — rather than leaving the quality of that relationship to chance.",
  },
  {
    question: "Is managing up manipulative?",
    answer: "No. Managing up done well is about honesty, reliability, and intentional communication — not flattery or political maneuvering. Harvard Business School research by Gabarro and Kotter established that managing up is a legitimate leadership discipline. The goal is genuine trust, not artificial perception management.",
  },
  {
    question: "How does culture affect managing up?",
    answer: "Culture significantly shapes how managing up is expressed. In high power-distance cultures (common across much of Asia, Africa, and Latin America), approaching a senior leader with unsolicited feedback can feel disrespectful — silence signals respect. In lower power-distance cultures (Northern Europe, North America), silence is read as disengagement. Cross-cultural leaders must understand their leader's cultural frame, not just default to their own.",
  },
  {
    question: "What is the SCARF model and how does it relate to managing up?",
    answer: "The SCARF model (Status, Certainty, Autonomy, Relatedness, Fairness) identifies five social domains the brain monitors as threats or rewards. In the context of managing up, understanding this model helps direct reports communicate in ways that reduce their manager's sense of uncertainty and increase trust — which creates greater latitude and opportunity for the direct report.",
  },
  {
    question: "How does a Christian leader think about managing up?",
    answer: "Scripture takes authority seriously without treating it as absolute. Romans 13 and 1 Peter 2 establish the legitimacy of institutional authority structures. But the New Testament also holds space for principled dissent and faithful confrontation. Managing up in a Christian framework means investing in the authority relationship honestly and courageously — in service of a shared mission that is larger than either party.",
  },
  {
    question: "What are the most common managing-up mistakes?",
    answer: "The most common failures include delivering bad news late, communicating in a style that doesn't suit your manager, raising concerns publicly rather than privately, and failing to close the loop after conversations or decisions. In cross-cultural settings, a particularly common error is assuming that your communication preferences — around directness, formality, or frequency — are universal when they may be culturally specific.",
  },
  {
    question: "Can you manage up when your leader is difficult or toxic?",
    answer: "Yes, though limits matter. Managing up means taking responsibility for your side of the relationship regardless of how your leader behaves — being reliable, clear, and honest. But it does not mean enabling dysfunction, absorbing abuse, or staying silent about genuine ethical failures. The skill is knowing the difference between a difficult personality and a legitimately harmful situation.",
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
          __html: JSON.stringify(generateFAQSchema(MANAGING_UP_FAQS)),
        }}
      />
      <Script
        id="mu-ga-tracking"
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
              { label: "Managing Up" },
            ]}
          />
        </div>
      </div>

      <ManagingUpClient {...props} isSaved={isSaved} />
      <ModuleConnector currentSlug={RESOURCE_SLUG} savedResources={savedResources} isLoggedIn={!!user} />
      <div className="border-t border-gray-100 py-10">
        <div className="container-wide">
          <ModuleComments slug="managing-up" />
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-wide">
          <RelatedResources slug="managing-up" />
        </div>
      </div>
    </>
  );
}
