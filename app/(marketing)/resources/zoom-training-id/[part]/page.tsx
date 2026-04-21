import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ZOOM_PARTS_ID } from "@/lib/zoom-training-data-id";
import TrainingPartView from "@/components/Training/TrainingPartView";

interface Props {
  params: Promise<{ part: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { part } = await params;
  const num = parseInt(part, 10);
  const partData = ZOOM_PARTS_ID.find((p) => p.number === num);
  if (!partData) return { title: "Pelatihan Zoom — Crispy Development" };
  return {
    title: `Bagian ${partData.number}: ${partData.title} — Pelatihan Zoom`,
    description: `${partData.title}: ${partData.subtitle}. Bagian dari panduan pelatihan Zoom Crispy Development.`,
  };
}

export function generateStaticParams() {
  return ZOOM_PARTS_ID.map((p) => ({ part: String(p.number) }));
}

export default async function ZoomTrainingIdPartPage({ params }: Props) {
  const { part } = await params;
  const num = parseInt(part, 10);
  const partData = ZOOM_PARTS_ID.find((p) => p.number === num);
  if (!partData) notFound();

  return (
    <TrainingPartView
      part={partData}
      allParts={ZOOM_PARTS_ID}
      tool="zoom"
      baseUrl="/resources/zoom-training-id"
      altLangUrl="/resources/zoom-training"
      currentLang="ID"
      altLang="EN"
      lang="id"
    />
  );
}
