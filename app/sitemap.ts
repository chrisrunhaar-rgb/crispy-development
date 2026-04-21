import type { MetadataRoute } from "next";

const resourceSlugs = [
  "above-below-the-line",
  "attention-retention",
  "comfort-zone",
  "fixed-growth-mindset",
  "ladder-of-inference",
  "leaders-are-readers",
  "leadership-altitudes",
  "overcoming-procrastination",
  "red-light-green-light",
  "six-thinking-hats",
  "smart-goals",
  "three-thinking-styles",
  "wheel-of-life",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://crispyleaders.com";
  const now = new Date();

  const resourceEntries: MetadataRoute.Sitemap = resourceSlugs.map((slug) => ({
    url: `${base}/resources/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/personal`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/team`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/peer-groups`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/resources`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...resourceEntries,
    { url: `${base}/login`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/signup`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
