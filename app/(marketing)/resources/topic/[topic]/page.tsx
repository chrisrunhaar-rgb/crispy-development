import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTopicBySlug, getTopicResources } from "@/lib/resources-data";
import TopicContent from "./TopicContent";
import { generateBreadcrumbSchema } from "@/lib/seo-utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: topicSlug } = await params;
  const topic = getTopicBySlug(topicSlug);
  if (!topic) return {};
  return {
    title: `${topic.title} — Resources — Crispy Development`,
    description: topic.description,
  };
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: topicSlug } = await params;
  const topic = getTopicBySlug(topicSlug);
  if (!topic) notFound();

  const resources = getTopicResources(topicSlug);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];

  return (
    <TopicContent
      topic={topic}
      resources={resources}
      userId={user?.id ?? null}
      savedResources={savedResources}
    />
  );
}
