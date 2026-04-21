import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ZOOM_PARTS } from "@/lib/zoom-training-data";
import TrainingPartView from "@/components/Training/TrainingPartView";

interface Props {
  params: Promise<{ part: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { part } = await params;
  const num = parseInt(part, 10);
  const partData = ZOOM_PARTS.find((p) => p.number === num);
  if (!partData) return { title: "Zoom Training — Crispy Development" };
  return {
    title: `Part ${partData.number}: ${partData.title} — Zoom Training`,
    description: `${partData.title}: ${partData.subtitle}. Part of the Crispy Development Zoom training guide.`,
  };
}

export function generateStaticParams() {
  return ZOOM_PARTS.map((p) => ({ part: String(p.number) }));
}

export default async function ZoomTrainingPartPage({ params }: Props) {
  const { part } = await params;
  const num = parseInt(part, 10);
  const partData = ZOOM_PARTS.find((p) => p.number === num);
  if (!partData) notFound();

  return (
    <TrainingPartView
      part={partData}
      allParts={ZOOM_PARTS}
      tool="zoom"
      baseUrl="/resources/zoom-training"
      altLangUrl="/resources/zoom-training-id"
      currentLang="EN"
      altLang="ID"
    />
  );
}
