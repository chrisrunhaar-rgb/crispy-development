import { Metadata } from "next";
import { notFound } from "next/navigation";
import { TEAMS_PARTS } from "@/lib/teams-training-data";
import TrainingPartView from "@/components/Training/TrainingPartView";

interface Props {
  params: Promise<{ chapter: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chapter } = await params;
  const num = parseInt(chapter, 10);
  const part = TEAMS_PARTS.find((p) => p.number === num);
  if (!part) return { title: "Microsoft Teams Training — Crispy Development" };
  return {
    title: `Part ${part.number}: ${part.title} — Microsoft Teams Training`,
    description: `${part.title}: ${part.subtitle}. Part of the Crispy Development Microsoft Teams training guide.`,
  };
}

export function generateStaticParams() {
  return TEAMS_PARTS.map((p) => ({ chapter: String(p.number) }));
}

export default async function TeamsTrainingPartPage({ params }: Props) {
  const { chapter } = await params;
  const num = parseInt(chapter, 10);
  const partData = TEAMS_PARTS.find((p) => p.number === num);
  if (!partData) notFound();

  return (
    <TrainingPartView
      part={partData}
      allParts={TEAMS_PARTS}
      tool="teams"
      baseUrl="/resources/teams-training"
      altLangUrl="/resources/teams-training-id"
      currentLang="EN"
      altLang="ID"
    />
  );
}
