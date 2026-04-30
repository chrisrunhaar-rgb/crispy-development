import type { MetadataRoute } from "next";
import { resourceMetadata } from "@/config/seo-metadata";

const ASSESSMENT_SLUGS = new Set([
  "disc", "wheel-of-life", "three-thinking-styles", "karunia-rohani",
  "enneagram", "big-five", "16-personalities", "5languages",
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://crispyleaders.com";
  const now = new Date();

  const resourceSlugs = Object.keys(resourceMetadata).filter((slug) => slug !== "resources");
  const resourceEntries: MetadataRoute.Sitemap = resourceSlugs.map((slug) => ({
    url: `${base}/resources/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: ASSESSMENT_SLUGS.has(slug) ? 0.8 : 0.7,
  }));

  return [
    { url: base, lastModified: now, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${base}/resources`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${base}/personal`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${base}/team`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${base}/peer-groups`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    ...resourceEntries,
    { url: `${base}/signup`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.6 },
    { url: `${base}/login`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.5 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 },
  ];
}
