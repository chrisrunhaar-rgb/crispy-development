import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { generateResourceArticleSchema, generateResourceBreadcrumbSchema, generateResourceMetadata, generateFAQSchema } from "@/lib/seo-utils";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedResources from "@/components/RelatedResources";
import HealthyConflictClient from "./HealthyConflictClient";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "healthy-conflict";

const HEALTHY_CONFLICT_FAQS = [
  {
    question: "What is healthy conflict in a team context?",
    answer: "Healthy conflict is the productive surfacing of real differences — in perspective, priority, or approach — so that a team can resolve them and move forward together. It is not argument for its own sake. It is the opposite of the quiet, unresolved tension that accumulates when conflict is avoided: misalignment that goes underground, surfaces later as passive resistance, and eventually fractures trust. A team that never disagrees openly is not a harmonious team — it is a team where honest input has become unsafe.",
  },
  {
    question: "Why is conflict avoidance particularly damaging in multicultural teams?",
    answer: "In high-context cultures across Asia, the Middle East, and much of Africa, direct disagreement is socially costly. Team members will often signal concern through silence, vague agreement, or withdrawal rather than direct pushback. A leader who reads silence as consensus will consistently make decisions without the information they need. Conflict avoidance in these settings does not protect relationships — it protects appearances while the actual relationship erodes underneath.",
  },
  {
    question: "How do I raise a difficult issue with someone from a high-context, face-saving culture?",
    answer: "Raise it privately first, before any group setting. Frame the issue around the task or outcome, not the person. Ask questions rather than making statements — 'I want to understand what happened in that meeting' rather than 'I think you undermined the decision.' Give the other person room to explain without putting them in a position where agreeing with you requires publicly admitting fault. Private conversation protects dignity while still opening the issue for resolution.",
  },
  {
    question: "What does Matthew 18 say about conflict, and how does it apply cross-culturally?",
    answer: "Matthew 18:15-17 gives a three-step escalation model: address directly and privately first, then involve a witness if unresolved, then escalate to the broader community. The principle is sound. The cross-cultural application requires care: what counts as 'direct' varies significantly. In low-context cultures, directness is verbal and explicit. In many high-context cultures, directness can be conveyed through trusted intermediaries without losing any of its clarity or seriousness. The goal of the Matthew 18 process — restoration of relationship and clarity — remains constant. The path there adapts.",
  },
  {
    question: "What are the five principles from the Acts 6 conflict for multicultural teams?",
    answer: "The first recorded cross-cultural conflict in the early church (Acts 6:1-7) was resolved through five moves: Discovery (the complaint was heard, not dismissed), Mediation (the apostles called the community together rather than deciding unilaterally), Participation (the affected group chose their own representatives), Agreement (a solution was formally agreed and implemented), and Reaffirmation (the work continued with renewed unity). These five principles remain a practical model for cross-cultural conflict resolution — because they were forged in an actual cross-cultural community, not developed as theory.",
  },
  {
    question: "What does Lingenfelter mean by 'wicked problems' in team conflict?",
    answer: "Sherwood Lingenfelter uses 'wicked problems' to describe cross-cultural conflicts that cannot be solved through management technique alone, because the root issue is not procedural — it is identity. When two people from different cultures are in genuine conflict, they are often not just disagreeing about a decision. They are operating from different assumptions about authority, fairness, community, and what resolution even looks like. Lingenfelter's argument is that only a shared identity — in-Christ identity that transcends cultural loyalty — provides the foundation stable enough to hold that kind of conflict and still move through it.",
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
              { label: "Creating Healthy Conflict" },
            ]}
          />
        </div>
      </div>

      <HealthyConflictClient userId={user?.id ?? null} isSaved={isSaved} />

      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-wide">
          <RelatedResources slug={RESOURCE_SLUG} />
        </div>
      </div>
    </>
  );
}
