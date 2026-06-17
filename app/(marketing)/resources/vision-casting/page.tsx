import { Metadata } from "next";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { generateResourceArticleSchema, generateResourceBreadcrumbSchema, generateResourceMetadata, generateFAQSchema } from "@/lib/seo-utils";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedResources from "@/components/RelatedResources";
import ModuleComments from "@/components/ModuleComments";
import VisionCastingClient from "./VisionCastingClient";
import ModuleConnector from "@/components/ModuleConnector";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "vision-casting";

const VISION_CASTING_FAQS = [
  {
    question: "What does it mean to communicate vision as a leader?",
    answer: "Vision communication is the process by which a leader moves people from current reality toward a preferred future — not through authority alone, but through shared understanding and motivation. It involves four elements: an honest account of where things are now, a clear picture of where things are heading, a compelling reason why the destination matters, and evidence that the movement has momentum. Without all four, vision tends to land as either wishful thinking or pressure.",
  },
  {
    question: "Why does vision communication work differently across cultures?",
    answer: "In high-individualism cultures, vision is often cast in terms of personal opportunity and individual contribution — what this means for you. In collectivist cultures, which make up the majority of the world, vision lands more powerfully when it is framed around community benefit, shared identity, and relational obligation. A vision statement designed for a Western board room may feel abstract, presumptuous, or even alienating to a team in Southeast Asia or East Africa — not because the vision is wrong, but because the frame does not match how meaning is made in that context.",
  },
  {
    question: "What is the Nehemiah model of vision casting?",
    answer: "Nehemiah's process in chapters 1-3 follows a clear sequence: burden before announcement, prayer before planning, private assessment before public declaration. When he does speak publicly (2:17-18), he covers present reality ('the trouble we are in'), future direction ('let us rebuild'), motivating why, and evidence of God's hand on the work. He does not cast vision from enthusiasm — he casts it from a weight he has carried for months, grounded in prayer and honest observation of the situation on the ground.",
  },
  {
    question: "How do you communicate vision to a team that is geographically scattered or cross-cultural?",
    answer: "Repeated, relational communication outperforms broadcast. In cross-cultural and distributed teams, a single vision announcement — even a well-crafted one — does not produce alignment. Vision needs to be repeated in different registers: in team meetings, in one-on-one conversations, through small wins that demonstrate the direction is real, through the stories of people who are already living it. Trust precedes message reception. In high-context cultures particularly, what the leader says matters far less than who the leader has shown themselves to be over time.",
  },
  {
    question: "What does Andy Stanley mean when he says vision begins as a concern?",
    answer: "Stanley's observation is that in Scripture and in practice, vision rarely begins with a strategy. It begins with a weight — something the leader cannot stop thinking about, a gap between what is and what should be that keeps returning. Nehemiah wept before he planned. The burden preceded the blueprint. Leaders who try to manufacture vision through strategic planning often produce a statement without a soul — the language is right but the weight behind it is not. Authentic vision, in Stanley's framework, is something the leader is carrying long before they announce it.",
  },
  {
    question: "How does Habakkuk 2:2-3 apply to vision communication?",
    answer: "Habakkuk 2:2-3 gives three practical instructions for communicating vision: write it plainly, make it legible, design it for action ('that he who reads it may run'). The passage also adds a fourth element that leaders often resist: trust the timing to God. The vision has its appointed time — it may be slow, but it will not fail. For leaders who feel urgency around their vision, this is both a structural discipline (write it clearly enough that others can act on it without you in the room) and a theological discipline (hold the timeline loosely).",
  },
];

export const metadata = generateResourceMetadata(RESOURCE_SLUG);

export default async function ResourcePage(props: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
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
          __html: JSON.stringify(generateFAQSchema(VISION_CASTING_FAQS)),
        }}
      />
      <Script
        id="vc-ga-tracking"
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
              { label: "Vision Casting" },
            ]}
          />
        </div>
      </div>

      <VisionCastingClient {...props} isSaved={isSaved} />
      <ModuleConnector currentSlug={RESOURCE_SLUG} savedResources={savedResources} isLoggedIn={!!user} />
      <div className="border-t border-gray-100 py-10">
        <div className="container-wide">
          <ModuleComments slug="vision-casting" />
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-wide">
          <RelatedResources slug="vision-casting" />
        </div>
      </div>
    </>
  );
}
