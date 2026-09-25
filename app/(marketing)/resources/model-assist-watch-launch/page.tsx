import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { requireModuleAccess } from "@/lib/require-module-access";
import { generateResourceArticleSchema, generateResourceBreadcrumbSchema, generateResourceMetadata, generateFAQSchema } from "@/lib/seo-utils";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedResources from "@/components/RelatedResources";
import ModuleComments from "@/components/ModuleComments";
import ModuleConnector from "@/components/ModuleConnector";
import ModelAssistWatchLaunchClient from "./ModelAssistWatchLaunchClient";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "model-assist-watch-launch";

export const metadata = generateResourceMetadata(RESOURCE_SLUG);

export default async function ResourcePage() {
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
        id="faq-model-assist-watch-launch"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema([
            {
              question: "What is the Model, Assist, Watch, Launch cycle?",
              answer: "It is a four-phase way to train leaders. In Model you do the task while they watch. In Assist they do it with you right beside them. In Watch they lead while you check in from a distance. In Launch the role is fully theirs and you become a friend who prays for them. Your involvement shrinks in each phase.",
            },
            {
              question: "How long should each phase take?",
              answer: "The phases are very different in length. Model is short, often only a few demonstrations. Assist takes weeks or months. Watch is the longest phase and can last months or years. Launch has no end point, because the relationship continues as friendship.",
            },
            {
              question: "Can one person be in different phases at the same time?",
              answer: "Yes. Readiness belongs to the task, not the person. A new leader can run meetings on their own (Launch) while still needing you beside them for difficult conversations (Assist). Plan the cycle skill by skill instead of for the whole role at once.",
            },
            {
              question: "What are the most common mistakes leaders make with this cycle?",
              answer: "Skipping Assist, staying in Assist too long, never leaving Watch, launching before the whole skill set has been checked, and stopping at one generation. Each one either leaves the learner unsupported or keeps them dependent on the leader.",
            },
            {
              question: "Where does this pattern come from?",
              answer: "Jesus trained his disciples this way: they were first with him, then sent out, then entrusted with the mission. Paul followed the same shape in cities like Ephesus and wrote about four generations of training in 2 Timothy 2:2. Research on scaffolding, cognitive apprenticeship and the gradual release of responsibility describes the same movement.",
            },
          ])),
        }}
      />
      <Script
        id="mawl-ga-tracking"
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
              { label: "Model, Assist, Watch, Launch" },
            ]}
          />
        </div>
      </div>

      <ModuleConnector
        currentSlug={RESOURCE_SLUG}
        savedResources={savedResources}
        isLoggedIn={!!user}
      />
      <ModelAssistWatchLaunchClient isSaved={isSaved} />

      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-wide">
          <RelatedResources slug={RESOURCE_SLUG} />
        </div>
      </div>

      <div className="border-t border-gray-100 py-10">
        <div className="container-wide">
          <ModuleComments slug={RESOURCE_SLUG} />
        </div>
      </div>
    </>
  );
}
