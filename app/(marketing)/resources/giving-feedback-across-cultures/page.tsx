import { Metadata } from "next";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { requireModuleAccess } from "@/lib/require-module-access";
import {
  generateResourceArticleSchema,
  generateResourceBreadcrumbSchema,
  generateResourceMetadata,
  generateFAQSchema,
} from "@/lib/seo-utils";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedResources from "@/components/RelatedResources";
import ModuleComments from "@/components/ModuleComments";
import GivingFeedbackClient from "./GivingFeedbackClient";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "giving-feedback-across-cultures";

export const metadata: Metadata = generateResourceMetadata(RESOURCE_SLUG);

export default async function ResourcePage(props: any) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // MANDATORY: requireModuleAccess gate. Without this, the admin status toggle
  // (Development / Live Free / Live Paid) does nothing. Pattern from UHC page.tsx.
  await requireModuleAccess(
    supabase,
    user?.id ?? null,
    RESOURCE_SLUG,
    user?.email ?? null
  );

  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes(RESOURCE_SLUG);

  const breadcrumbSchema = generateResourceBreadcrumbSchema(RESOURCE_SLUG);

  const faqSchema = generateFAQSchema([
    {
      question: "What are upgraders and downgraders in cross-cultural feedback?",
      answer:
        "Upgraders are language tools that intensify a critical message -- words like 'completely', 'absolutely', and declarative finality. Downgraders soften critical messages with tentativeness and hedging. Direct-feedback cultures rely on upgraders; indirect-feedback cultures use downgraders. Neither is dishonest -- both encode the same underlying assessment in different cultural registers.",
    },
    {
      question: "What is the difference between the Communicating scale and the Evaluating scale?",
      answer:
        "Erin Meyer's Culture Map distinguishes two separate scales that move independently. The Communicating scale measures how much meaning is carried implicitly versus explicitly. The Evaluating scale measures how directly negative feedback is delivered. A country can be high-context on the Communicating scale while being direct on the Evaluating scale -- France is the classic example.",
    },
    {
      question: "What is the Nathan Principle in cross-cultural feedback?",
      answer:
        "The Nathan Principle is drawn from 2 Samuel 12, where the prophet Nathan confronted King David using a parable first, then a direct declaration. The principle is that the indirect approach is not evasion -- it is preparation that makes the direct truth receivable. Nathan built David's moral comprehension from inside the story before naming him as the subject.",
    },
    {
      question: "What is malu and why does it matter for giving feedback?",
      answer:
        "Malu is an Indonesian and Malay concept that encompasses the fear of public loss of face, social shame, and the experience of diminished standing in others' eyes. In Indonesian workplace contexts, causing malu through public criticism can trigger withdrawal, disengagement, or departure. A leader who reads maintained outward harmony as genuine agreement will consistently misread the room.",
    },
    {
      question: "How do I give honest feedback without losing the relationship?",
      answer:
        "The key is translate, not dilute. The content of the feedback does not change -- the form does. In indirect-feedback cultures, open with relational groundwork before the critique, use downgraders rather than upgraders, frame the issue as a shared problem rather than a verdict, and build in a face-preserving pathway to restoration. Plan for follow-up: in many indirect cultures, the follow-up conversation carries more weight than the initial one.",
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
        id="gfac-ga-tracking"
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
              { label: "Giving Feedback Across Cultures" },
            ]}
          />
        </div>
      </div>

      <GivingFeedbackClient {...props} isSaved={isSaved} />

      <div className="border-t border-gray-100 py-10">
        <div className="container-wide">
          <ModuleComments slug="giving-feedback-across-cultures" />
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-wide">
          <RelatedResources slug="giving-feedback-across-cultures" />
        </div>
      </div>
    </>
  );
}
