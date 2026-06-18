import { Metadata } from "next";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { requireModuleAccess } from "@/lib/require-module-access";
import { generateResourceArticleSchema, generateResourceBreadcrumbSchema, generateResourceMetadata, generateFAQSchema } from "@/lib/seo-utils";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedResources from "@/components/RelatedResources";
import ModuleComments from "@/components/ModuleComments";
import DisciplineOfSilenceClient from "./DisciplineOfSilenceClient";
import ModuleConnector from "@/components/ModuleConnector";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "discipline-of-silence";

const faqItems = [
  {
    question: "What is the discipline of silence in leadership?",
    answer: "The discipline of silence is the intentional practice of creating regular space for quiet as part of your leadership rhythm. It goes beyond simply not speaking. It means protecting time where you are not consuming information, not being reached, and not filling every moment with content or noise. For leaders, this is less a spiritual luxury and more a formative practice that shapes the quality of listening, discernment, and presence a person brings to their role.",
  },
  {
    question: "Is silence an effective leadership practice?",
    answer: "Research increasingly suggests it is. A 2023 peer-reviewed study found that 45 minutes of smartphone use significantly impaired vigilance and inhibition, both of which are core capacities for patient, discerning leadership. A separate meta-analysis confirmed that even the presence of a smartphone on the desk reduces memory and attention. Leaders who protect silence report greater clarity, less reactivity, and a deeper capacity to listen before responding. The evidence points in one direction: silence is not wasted time. It is a necessary condition for the kind of unhurried, attentive leadership that earns trust.",
  },
  {
    question: "How does culture affect the practice of silence?",
    answer: "Culture shapes both the experience of silence and its meaning. In many Western contexts, silence in conversation signals awkwardness or disapproval, which makes it feel like something to be filled. In a number of Asian, African, and Indigenous contexts, silence carries weight and communicates respect, thoughtfulness, or deference. For cross-cultural leaders, understanding this means recognising that your team members may be comfortable with silence in ways you are not, or uncomfortable in ways you would not expect. It also means that the discipline of silence as a personal practice may be more intuitive for people from certain cultural backgrounds and more countercultural for others.",
  },
  {
    question: "How can cross-cultural leaders use silence in their teams?",
    answer: "There are practical entry points that require no special resources. Starting team meetings with two minutes of silence before agenda items begin is one of the most consistently reported practices for improving meeting quality. Introducing a shared team norm around communication-free time once a week creates a culture of rest that benefits the whole group, not just individuals. Opening debriefs after significant events or difficult seasons with five minutes of silence before anyone speaks creates conditions for honest reflection that polished reporting rarely allows. These are structural decisions, not soft suggestions, and they have measurable effects on team culture over time.",
  },
  {
    question: "What is the most common misunderstanding about silence as a discipline?",
    answer: "Most leaders assume that silence means doing nothing, and that doing nothing is a waste of time they cannot afford. In practice, the opposite tends to be true. The leaders who guard silence consistently report that more clarity comes from a morning of intentional quiet than from a full day of back-to-back meetings. The misunderstanding also shows up in scale. Many people assume the discipline requires long, extended blocks of time they do not have. The research and the contemplative tradition both suggest that five consistent minutes is more formative than an occasional hour. The starting point is almost always smaller than what feels like it counts.",
  },
  {
    question: "What does faith say about silence as a leadership practice?",
    answer: "Scripture treats silence not as passive withdrawal but as the condition in which God most clearly speaks. The story of Elijah at Horeb in 1 Kings 19 is the paradigmatic example: after wind, earthquake, and fire, God's presence came in what the Hebrew text calls qol demamah daqqah, often translated as the still small voice or the sound of sheer silence. The message of the passage is that God's most intimate communication arrived not in the spectacular but in the quiet. Psalm 46:10 makes the same claim directly: 'Be still, and know that I am God.' For Christian leaders, silence is not a productivity tool borrowed from secular mindfulness. It is a theological posture, a confession that hearing God requires creating the conditions where his voice is not drowned out by our own.",
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
        id="faq-discipline-of-silence"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema(faqItems)),
        }}
      />
      <Script
        id="sl-discipline-of-silence-ga-tracking"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.gtag?.('event', 'resource_viewed', { resource: '${RESOURCE_SLUG}', category: 'faith-calling' });`,
        }}
      />

      <div className="bg-gray-50 border-b border-gray-200 py-3 sticky top-0 z-10">
        <div className="container-wide">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Resources", href: "/resources" },
              { label: "The Discipline of Silence" },
            ]}
          />
        </div>
      </div>

      <DisciplineOfSilenceClient isSaved={isSaved} isLoggedIn={!!user} />
      <ModuleConnector currentSlug={RESOURCE_SLUG} savedResources={savedResources} isLoggedIn={!!user} />
      <div className="border-t border-gray-100 py-10">
        <div className="container-wide">
          <ModuleComments slug="discipline-of-silence" />
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-wide">
          <RelatedResources slug="discipline-of-silence" />
        </div>
      </div>
    </>
  );
}
