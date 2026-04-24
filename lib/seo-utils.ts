// SEO utilities for schema markup and canonical tags
import type { Metadata } from "next";
import { getResourceMetadata } from "@/config/seo-metadata";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateCanonicalUrl(path: string) {
  return `https://crispyleaders.com${path}`;
}

const OG_IMAGE = "https://crispyleaders.com/logo-full.png";

export function generateResourceMetadata(slug: string): Metadata {
  const meta = getResourceMetadata(slug);
  const url = generateCanonicalUrl(`/resources/${slug}`);
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      siteName: "Crispy Development",
      images: [{ url: OG_IMAGE, width: 1200, height: 1200, alt: meta.title }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [OG_IMAGE],
    },
  };
}
