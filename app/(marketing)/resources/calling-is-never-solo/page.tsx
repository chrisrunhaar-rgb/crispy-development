import { Metadata } from "next";
import Script from "next/script";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireModuleAccess } from "@/lib/require-module-access";
import { generateResourceArticleSchema, generateResourceBreadcrumbSchema, generateResourceMetadata, generateFAQSchema } from "@/lib/seo-utils";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedResources from "@/components/RelatedResources";
import ModuleComments from "@/components/ModuleComments";
import CallingIsNeverSoloClient from "./CallingIsNeverSoloClient";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "calling-is-never-solo";

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
          __html: JSON.stringify(generateFAQSchema([
            {
              question: "Is calling individual or communal?",
              answer: "Both — but the communal dimension is often underweighted. The biblical pattern shows calling flows through community: Israel was called as a people, the Twelve were chosen as a group and sent in pairs, and Antioch commissioned Paul and Barnabas through fasting, prayer, and communal confirmation. The internal sense of calling is real — but the external confirmation of community is what makes it complete.",
            },
            {
              question: "Why do cross-cultural leaders struggle with isolation?",
              answer: "Leadership isolation is structural, not personal. Research shows 50% of senior leaders experience significant loneliness, with 61% reporting it hinders their effectiveness. For cross-cultural workers, the problem compounds: physical distance from sending communities, unfamiliar cultural contexts, and high-demand environments combine to create chronic separation from the relationships that sustain calling. Studies estimate approximately 1,500 ministry workers leave their positions monthly in North America alone.",
            },
            {
              question: "What is the external call and why does it matter?",
              answer: "The external call is community recognition and confirmation of vocation. The Reformation tradition established that the internal call alone is insufficient — individuals can be mistaken about their own discernment. The external call provides structural accountability that the internal call cannot supply on its own. Fuller Seminary's framework describes this as the 'locus' of calling: the calling emerges from within a community, not in isolation from it.",
            },
            {
              question: "What is the Messiah Complex in leadership?",
              answer: "The Messiah Complex describes a pattern where a leader gradually withdraws from accountability and begins to believe the mission depends entirely on them. It begins with isolation, deepens through unchecked autonomy, and results in rigid vision, hidden blind spots, and thinner fruit than collaborative leadership would have produced. It can look like devotion from the inside — but from the outside, and in honest moments, it looks more like control.",
            },
            {
              question: "How do collectivist cultures understand calling?",
              answer: "In collectivist cultures — across much of Southeast Asia, sub-Saharan Africa, the Middle East, and Latin America — calling is relational by default. Cultural research scores Indonesia's individualism at 14 and Malaysia's at 26, among the most collectivist globally. In these contexts, calling is something the community sees in a person, names publicly, and sends them into. A calling that lacks communal confirmation is, in many cultures, not yet a complete calling — and cross-cultural workers who carry an individualist model often encounter invisible friction they cannot explain.",
            },
            {
              question: "What does passing on a calling look like practically?",
              answer: "The 2 Timothy 2:2 pattern — Paul to Timothy to reliable people to others yet beyond — describes four generations of investment in one verse. Passing on a calling means actively identifying and forming the next person: someone who is learning something from proximity to you that they could not learn from a book or a course. A calling that is received but never passed on has quietly become a possession rather than a stewardship.",
            },
          ])),
        }}
      />
      <Script
        id="sl-calling-ga-tracking"
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
              { label: "Calling Is Never Solo" },
            ]}
          />
        </div>
      </div>

      <CallingIsNeverSoloClient {...props} isSaved={isSaved} />
      <div className="border-t border-gray-100 py-10">
        <div className="container-wide">
          <ModuleComments slug="calling-is-never-solo" />
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-wide">
          <RelatedResources slug="calling-is-never-solo" />
        </div>
      </div>
    </>
  );
}
