import { Metadata } from "next";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { requireModuleAccess } from "@/lib/require-module-access";
import { generateResourceArticleSchema, generateResourceBreadcrumbSchema, generateResourceMetadata, generateFAQSchema } from "@/lib/seo-utils";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedResources from "@/components/RelatedResources";
import ModuleComments from "@/components/ModuleComments";
import SustainablePaceClient from "./SustainablePaceClient";
import ModuleConnector from "@/components/ModuleConnector";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "sustainable-pace";

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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateResourceBreadcrumbSchema(RESOURCE_SLUG)),
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
        id="faq-sustainable-pace"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema([
            {
              question: "What are the five spheres of member care?",
              answer: "The five spheres of member care, from Kelly O'Donnell's framework, are: Master Care (God's care for you), Self-Care (your personal health architecture), Mutual Care (teammates who know the real weight), Sender Care (your agency, church, or organisation), and Specialist Care (professional support when you need it). Sustainable pace requires attention to all five.",
            },
            {
              question: "What is sustainable pace for cross-cultural leaders?",
              answer: "Sustainable pace is the architecture of personal health -- the systems, habits, and support structures that determine whether you remain effective over the long term. It is not about doing less. It is about building the rhythms that make exhaustion rare rather than chronic.",
            },
            {
              question: "Why is Sabbath rest important for leaders?",
              answer: "Research among cross-cultural field workers identifies Sabbath neglect as a primary contributing factor to burnout. Theologically, the Sabbath command in Deuteronomy 5 is grounded in liberation: rest is the mark of freedom. Leaders who practise psychological detachment during rest also improve their team's recovery outcomes.",
            },
            {
              question: "What is the O'Donnell model of member care?",
              answer: "Kelly O'Donnell's member care framework identifies five concentric levels of care that every long-term cross-cultural leader needs: divine care, self-care, peer care, organisational support, and professional specialist care. The model is foundational in global member care practice.",
            },
            {
              question: "How do I build a sustainable leadership rhythm?",
              answer: "Start with the Stress Audit to identify your lowest-scoring area. Then select one habit from the Body, Mind, or Spirit categories that addresses that area directly. Protect that one investment for a week. Sustainable pace is built in cycles of small, consistent commitments -- not single acts of willpower.",
            },
            {
              question: "What does research say about burnout among cross-cultural workers?",
              answer: "A 2024 public health study of 4,338 full-time workers across Malaysia, Singapore, the Philippines, and Indonesia found 62.91% reporting high or very high burnout levels. Research among cross-cultural field workers consistently identifies Sabbath neglect, relational isolation, and inadequate support structures as the primary contributing factors.",
            },
          ])),
        }}
      />
      <Script
        id="sp-ga-tracking"
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
              { label: "Sustainable Pace" },
            ]}
          />
        </div>
      </div>

      <SustainablePaceClient {...props} isSaved={isSaved} />
      <ModuleConnector currentSlug={RESOURCE_SLUG} savedResources={savedResources} isLoggedIn={!!user} />
      <div className="border-t border-gray-100 py-10">
        <div className="container-wide">
          <ModuleComments slug="sustainable-pace" />
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-wide">
          <RelatedResources slug="sustainable-pace" />
        </div>
      </div>
    </>
  );
}
