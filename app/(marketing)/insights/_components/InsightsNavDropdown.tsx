"use client";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  return (
    <select
      defaultValue=""
      onChange={(e) => {
        if (e.target.value) router.push(`${basePath}/${e.target.value}`);
      }}
      style={{
        fontFamily: "var(--font-montserrat)",
        fontSize: "0.875rem",
        color: "oklch(30% 0.008 260)",
        background: "oklch(100% 0 0)",
        border: "1px solid oklch(80% 0.008 80)",
        padding: "0.65rem 2.75rem 0.65rem 1rem",
        cursor: "pointer",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='7' viewBox='0 0 11 7'%3E%3Cpath d='M1 1l4.5 4.5L10 1' stroke='%23888' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 0.875rem center",
        minWidth: "260px",
        maxWidth: "100%",
        outline: "none",
      }}
    >
      <option value="" disabled>Browse previous bytes...</option>
      {articles.map((a) => (
        <option key={a.slug} value={a.slug}>
          {a.title}
        </option>
      ))}
    </select>
  );
}
