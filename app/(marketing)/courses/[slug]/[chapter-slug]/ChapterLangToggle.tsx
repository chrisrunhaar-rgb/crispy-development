"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setPersonalLanguage } from "@/app/(app)/dashboard/actions";

type Props = {
  isId: boolean;
  hasIdContent: boolean;
  isLoggedIn: boolean;
  slug: string;
  chapterSlug: string;
};

export default function ChapterLangToggle({ isId, hasIdContent, isLoggedIn, slug, chapterSlug }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (!hasIdContent) return null;

  function switchLang(lang: "en" | "id") {
    if (isLoggedIn) {
      const formData = new FormData();
      formData.set("language", lang);
      startTransition(async () => {
        await setPersonalLanguage(formData);
        router.refresh();
      });
    } else {
      const url = lang === "id"
        ? `/courses/${slug}/${chapterSlug}?lang=id`
        : `/courses/${slug}/${chapterSlug}`;
      router.push(url);
    }
  }

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.375rem",
      marginTop: "1rem",
      opacity: isPending ? 0.6 : 1,
      transition: "opacity 0.15s",
    }}>
      {(["en", "id"] as const).map((l) => {
        const isActive = l === "id" ? isId : !isId;
        return (
          <button
            key={l}
            onClick={() => switchLang(l)}
            disabled={isPending || isActive}
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "0.63rem",
              letterSpacing: "0.1em",
              padding: "0.2rem 0.6rem",
              background: isActive ? "oklch(65% 0.15 45)" : "oklch(35% 0.06 260)",
              color: "oklch(97% 0.005 80)",
              border: "none",
              cursor: isActive || isPending ? "default" : "pointer",
              transition: "background 0.15s",
            }}
          >
            {l.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
