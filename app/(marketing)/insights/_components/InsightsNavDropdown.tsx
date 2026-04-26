"use client";
import Link from "next/link";

type ArticleOption = {
  slug: string;
  title: string;
};

export function InsightsNavDropdown({
  articles,
  basePath = "/insights",
}: {
  articles: ArticleOption[];
  basePath?: string;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
      {articles.map((a) => (
        <Link
          key={a.slug}
          href={`${basePath}/${a.slug}`}
          style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.8rem",
            fontWeight: 500,
            color: "oklch(38% 0.007 260)",
            textDecoration: "none",
            padding: "0.35rem 0.875rem",
            border: "1px solid oklch(82% 0.008 80)",
            background: "oklch(100% 0 0)",
            transition: "border-color 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "oklch(65% 0.15 45)";
            (e.currentTarget as HTMLAnchorElement).style.color = "oklch(22% 0.10 260)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "oklch(82% 0.008 80)";
            (e.currentTarget as HTMLAnchorElement).style.color = "oklch(38% 0.007 260)";
          }}
        >
          {a.title}
        </Link>
      ))}
    </div>
  );
}
