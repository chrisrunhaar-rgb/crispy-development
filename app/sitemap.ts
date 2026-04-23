import type { MetadataRoute } from "next";
import { resourceMetadata } from "@/config/seo-metadata";

/**
 * Dynamic sitemap generation from SEO metadata
 * Automatically includes all resources in seo-metadata.ts
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://crispyleaders.com";
  const now = new Date();

  // Generate entries for all resources in seo-metadata
  const resourceSlugs = Object.keys(resourceMetadata).filter((slug) => slug !== "resources");
  const resourceEntries: MetadataRoute.Sitemap = resourceSlugs.map((slug) => ({
    url: `${base}/resources/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    { url: base, lastModified: now, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${base}/personal`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${base}/team`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${base}/resources`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    ...resourceEntries,
    { url: `${base}/login`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.5 },
    { url: `${base}/signup`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.6 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 },
  ];
}
