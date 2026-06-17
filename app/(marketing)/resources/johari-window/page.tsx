import { Metadata } from "next";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { generateResourceArticleSchema, generateResourceBreadcrumbSchema, generateResourceMetadata, generateFAQSchema } from "@/lib/seo-utils";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedResources from "@/components/RelatedResources";
import ModuleComments from "@/components/ModuleComments";
import JohariWindowClient from "./JohariWindowClient";
import ModuleConnector from "@/components/ModuleConnector";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "johari-window";

const JOHARI_WINDOW_FAQS = [
  {
    question: "What is the Johari Window and who created it?",
    answer: "The Johari Window is a self-awareness framework developed in 1955 by psychologists Joseph Luft and Harry Ingham — the name combines their first names. It maps awareness across two axes: what is known to you about yourself, and what is known to others. The result is four quadrants: Open (known to self and others), Hidden (known to self but not others), Blind Spot (known to others but not to self), and Unknown (known to neither). It remains one of the most practically useful tools for leaders working on self-awareness and team trust.",
  },
  {
    question: "What is the Blind Spot quadrant and why is it the most important for leaders?",
    answer: "The Blind Spot contains things others observe about you that you do not see in yourself — communication patterns, emotional reactions, the way your presence affects a room. For leaders, blind spots are high-stakes: your team is navigating around things you do not know you are doing. The Blind Spot only shrinks when others feel safe enough to give you honest feedback. That means a leader's Blind Spot is, in practice, a measure of psychological safety — not just a measure of self-knowledge.",
  },
  {
    question: "How does the Johari Window work differently in cross-cultural teams?",
    answer: "What counts as appropriate self-disclosure is not universal. In high-context cultures — much of East Asia, Southeast Asia, and the Middle East — more personal information stays in the Hidden quadrant by default. This is not deception. It is a different understanding of what belongs in professional versus personal space, and what disclosure to someone of different status means relationally. A leader who assumes their Asian colleague's Hidden quadrant is the same size as their own will misread relational distance as disengagement. The Johari Window is useful cross-culturally precisely because it names this variation without judging it.",
  },
  {
    question: "How do you give feedback across cultures in a way that actually shrinks the Blind Spot?",
    answer: "Begin by building the relational context in which feedback can be received. In cultures with strong face-saving norms, direct feedback in a group setting will often be rejected — not because the content is wrong, but because receiving it publicly is socially costly. Move feedback to one-on-one settings. Frame it as your observation, not as truth. Ask permission: 'Can I share something I noticed?' Give the person room to respond without needing to immediately agree. Consistency and relationship over time matter more than any single technique.",
  },
  {
    question: "What does the Unknown quadrant represent in a Christian leadership framework?",
    answer: "The Unknown quadrant — what is known to neither you nor the people around you — is the space that only God fully knows. Psalm 139:23-24 ('Search me, God, and know my heart') is a direct address into this quadrant: an invitation for God to reveal what is hidden even from the self. Christian leaders can engage the Unknown quadrant not only through peer feedback but through prayer, spiritual direction, and the honest community that the Christian tradition has always associated with spiritual formation. What the Johari Window labels Unknown, Christian practice calls the territory of sanctification.",
  },
  {
    question: "How does expanding the Open quadrant connect to Christian community?",
    answer: "The Open quadrant grows through two mechanisms: self-disclosure (sharing from your Hidden quadrant) and feedback (receiving input about your Blind Spot). Both require trust. The early church practiced regular confession, accountability, and honest community — not as vulnerability performance but as the practical structure of sanctification. Expanding the Open quadrant is, in Christian terms, participating in the kind of community that forms people. It is why Hebrews 10:24-25 connects gathering together with the work of encouragement and growth.",
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
          __html: JSON.stringify(generateFAQSchema(JOHARI_WINDOW_FAQS)),
        }}
      />
      <Script
        id="jw-ga-tracking"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.gtag?.('event', 'resource_viewed', { resource: '${RESOURCE_SLUG}', category: 'thinking' });`,
        }}
      />

      <div className="bg-gray-50 border-b border-gray-200 py-3 sticky top-0 z-10">
        <div className="container-wide">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Resources", href: "/resources" },
              { label: "Johari Window" },
            ]}
          />
        </div>
      </div>

      <JohariWindowClient {...props} isSaved={isSaved} />
      <ModuleConnector currentSlug={RESOURCE_SLUG} savedResources={savedResources} isLoggedIn={!!user} />
      <div className="border-t border-gray-100 py-10">
        <div className="container-wide">
          <ModuleComments slug="johari-window" />
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-wide">
          <RelatedResources slug="johari-window" />
        </div>
      </div>
    </>
  );
}
