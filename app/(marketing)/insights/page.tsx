import type { Metadata } from "next";
import { insights } from "@/lib/insights";
import InsightsClient from "./InsightsClient";

export const metadata: Metadata = {
  title: "Leadership Bytes — Insights | Crispy Development",
  description: "Short, practical articles on cross-cultural leadership. Timely topics, real-world examples, linked to deeper resources.",
  robots: { index: false, follow: false },
};

export default function InsightsPage() {
  return <InsightsClient insights={insights} />;
}
