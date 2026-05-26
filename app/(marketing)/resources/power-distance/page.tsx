import { Metadata } from "next";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { generateResourceArticleSchema, generateResourceBreadcrumbSchema, generateResourceMetadata, generateFAQSchema } from "@/lib/seo-utils";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedResources from "@/components/RelatedResources";
import ModuleComments from "@/components/ModuleComments";
import PowerDistanceClient from "./PowerDistanceClient";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "power-distance";

const POWER_DISTANCE_FAQS = [
  {
    question: "What is power distance in cross-cultural leadership?",
    answer: "Power distance is a cultural dimension first described by organizational sociologist Geert Hofstede. It measures the degree to which less powerful members of a society, organization, or group accept and expect unequal distribution of power. In high power distance cultures, hierarchy is expected and respected. In low power distance cultures, challenge, flat structures, and peer-level dialogue are the norm. For cross-cultural leaders, understanding where your team sits on this spectrum changes almost everything about how you communicate, make decisions, and receive feedback.",
  },
  {
    question: "What are the Hofstede Power Distance Index (PDI) scores for common countries?",
    answer: "Hofstede's Power Distance Index runs from 0 (very low, highly egalitarian) to 100 (very high, strong deference to authority). Selected scores: Malaysia 100, Philippines 94, China 80, Indonesia 78, France 68, USA 40, Netherlands 38, Germany 35, Denmark 18. These scores reflect cultural tendencies, not fixed individual behavior — but they provide a useful orientation for leaders entering unfamiliar cultural contexts.",
  },
  {
    question: "How does high power distance affect team communication?",
    answer: "In high power distance cultures, team members typically do not challenge a leader's decision openly, even when they disagree. Disagreement is more likely to surface indirectly — through a trusted intermediary, through delay or passive non-compliance, or through feedback given only in private settings. A leader from a low power distance background who asks \"does anyone have concerns about this plan?\" in a group meeting may receive silence that they interpret as agreement, when the room actually holds significant reservations that were not safe to voice publicly.",
  },
  {
    question: "What mistakes do low power distance leaders commonly make in high power distance contexts?",
    answer: "The most common mistake is interpreting silence as consent. Related patterns include: asking for open group feedback and receiving none, being surprised when decisions made collaboratively are not followed through, and assuming that giving team members \"voice\" in meetings means they feel free to use it. A second common mistake is reading deference as disengagement or lack of initiative — when in fact the team member may be highly capable and motivated but operating under a different set of norms about when and how input is appropriate.",
  },
  {
    question: "How should a leader from a low power distance background adapt when leading a high power distance team?",
    answer: "Several adjustments help. Build explicit private channels for feedback alongside formal group meetings — one-on-ones, written feedback options, or trusted intermediaries. Make decisions clearly rather than leaving ambiguity, because in high power distance cultures, ambiguity is often read as the leader being indecisive or uncertain. Understand that your positional authority carries more social weight than you may expect or want, and use it carefully. When you do want genuine input, ask specific questions of specific people rather than opening the floor generally.",
  },
  {
    question: "Does power distance mean that some cultures are less democratic or participatory?",
    answer: "No — this is an important nuance. High power distance cultures have their own forms of participation, consultation, and communal decision-making. They are simply structured differently. In many high power distance contexts, significant consultation happens before a formal meeting, through elder networks, informal conversations, or trusted relationships — and the meeting itself is often a ratification of something already discussed. A leader who only looks for participation in Western-style open discussion may miss the genuine consultative processes already operating in the culture.",
  },
];

export const metadata = generateResourceMetadata(RESOURCE_SLUG);

export default async function ResourcePage(props: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes(RESOURCE_SLUG);

  const { data: countryData } = await supabase
    .from("country_hofstede_scores")
    .select("*")
    .order("country_en");

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
          __html: JSON.stringify(generateFAQSchema(POWER_DISTANCE_FAQS)),
        }}
      />
      <Script
        id="pd-ga-tracking"
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
              { label: "Power Distance" },
            ]}
          />
        </div>
      </div>

      <PowerDistanceClient {...props} isSaved={isSaved} countryData={countryData ?? []} />
      <div className="border-t border-gray-100 py-10">
        <div className="container-wide">
          <ModuleComments slug="power-distance" />
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-wide">
          <RelatedResources slug="power-distance" />
        </div>
      </div>
    </>
  );
}
