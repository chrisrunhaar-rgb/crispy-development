import type { Metadata } from "next";
import ArticlesContent from "./ArticlesContent";

export const metadata: Metadata = {
  title: "Worth Reading | Crispy Development",
  description: "Articles from the web worth reading, handpicked for cross-cultural leaders navigating life and work across cultures.",
};

export default function ArticlesPage() {
  return <ArticlesContent />;
}
