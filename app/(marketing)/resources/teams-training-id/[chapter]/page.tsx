import { Metadata } from "next";
import { notFound } from "next/navigation";
import { TEAMS_PARTS_ID } from "@/lib/teams-training-data-id";
import TrainingPartView from "@/components/Training/TrainingPartView";

interface Props {
  params: Promise<{ chapter: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chapter } = await params;
  const num = parseInt(chapter, 10);
  const part = TEAMS_PARTS_ID.find((p) => p.number === num);
  if (!part) return { title: "Pelatihan Microsoft Teams — Crispy Development" };
  return {
    title: `Bagian ${part.number}: ${part.title} — Pelatihan Microsoft Teams`,
    description: `${part.title}: ${part.subtitle}. Bagian dari panduan pelatihan Microsoft Teams Crispy Development.`,
  };
}

export function generateStaticParams() {
  return TEAMS_PARTS_ID.map((p) => ({ chapter: String(p.number) }));
}

export default async function TeamsTrainingIdPartPage({ params }: Props) {
  const { chapter } = await params;
  const num = parseInt(chapter, 10);
  const partData = TEAMS_PARTS_ID.find((p) => p.number === num);
  if (!partData) notFound();

  return (
    <TrainingPartView
      part={partData}
      allParts={TEAMS_PARTS_ID}
      tool="teams"
      baseUrl="/resources/teams-training-id"
      altLangUrl="/resources/teams-training"
      currentLang="ID"
      altLang="EN"
      lang="id"
    />
  );
}
