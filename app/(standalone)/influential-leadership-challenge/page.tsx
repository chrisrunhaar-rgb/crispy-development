import { Metadata } from "next";
import ChallengeContent from "./ChallengeContent";

export const metadata: Metadata = {
  title: "The Influential Leadership Challenge — Crispy Leaders",
  description: "A free 60-day guided journey through Deep Influence by T.J. Addington. Daily content, personal reflection, and group discussion for leaders and teams.",
  other: { "theme-color": "#1a2d4a" },
};

export default function ChallengePage() {
  return <ChallengeContent />;
}
