"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = {
  chapterId: string;
  isCompleted: boolean;
  prevHref: string | null;
  nextHref: string | null;
  userId: string | null;
};

export default function ChapterActions({ chapterId, isCompleted, prevHref, nextHref, userId }: Props) {
  const [completed, setCompleted] = useState(isCompleted);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function toggleComplete() {
    if (!userId) {
      router.push("/login");
      return;
    }
    setLoading(true);
    if (completed) {
      await supabase
        .from("course_progress")
        .delete()
        .eq("user_id", userId)
        .eq("chapter_id", chapterId);
      setCompleted(false);
    } else {
      await supabase
        .from("course_progress")
        .upsert({ user_id: userId, chapter_id: chapterId }, { onConflict: "user_id,chapter_id" });
      setCompleted(true);
      // Auto-advance to next if available
      if (nextHref) {
        setTimeout(() => router.push(nextHref), 400);
      }
    }
    setLoading(false);
    router.refresh();
  }

  return (
    <div style={{
      position: "sticky",
      bottom: 0,
      background: "oklch(22% 0.10 260)",
      borderTop: "1px solid oklch(30% 0.08 260)",
      padding: "1rem",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      zIndex: 10,
    }}>
      {prevHref ? (
        <a href={prevHref} style={{
          fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.78rem",
          color: "oklch(65% 0.04 260)",
          textDecoration: "none", padding: "0.625rem 1rem",
          border: "1px solid oklch(40% 0.08 260)",
          letterSpacing: "0.04em",
          flexShrink: 0,
        }}>
          ← Prev
        </a>
      ) : (
        <div style={{ flex: "0 0 auto", width: "70px" }} />
      )}

      <button
        onClick={toggleComplete}
        disabled={loading}
        style={{
          flex: 1,
          fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem",
          letterSpacing: "0.04em", textTransform: "uppercase",
          background: completed ? "oklch(45% 0.10 155)" : "oklch(65% 0.15 45)",
          color: "oklch(97% 0.005 80)",
          border: "none",
          padding: "0.75rem 1rem",
          cursor: loading ? "wait" : "pointer",
          opacity: loading ? 0.7 : 1,
          transition: "background 0.15s, opacity 0.15s",
        }}
      >
        {loading ? "…" : completed ? "✓ Completed" : userId ? "Mark complete" : "Log in to track"}
      </button>

      {nextHref ? (
        <a href={nextHref} style={{
          fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.78rem",
          color: "oklch(72% 0.006 260)",
          textDecoration: "none", padding: "0.625rem 1rem",
          border: "1px solid oklch(40% 0.08 260)",
          letterSpacing: "0.04em",
          flexShrink: 0,
        }}>
          Next →
        </a>
      ) : (
        <div style={{ flex: "0 0 auto", width: "70px" }} />
      )}
    </div>
  );
}
