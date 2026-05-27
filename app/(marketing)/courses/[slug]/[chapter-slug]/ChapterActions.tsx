"use client";

import { useState, useEffect } from "react";
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
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const check = () => {
      const scrollBottom = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      setVisible(pageHeight <= window.innerHeight || scrollBottom >= pageHeight - 160);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

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
      if (nextHref) {
        setTimeout(() => router.push(nextHref), 400);
      }
    }
    setLoading(false);
    router.refresh();
  }

  if (!visible) return null;

  return (
    <div style={{
      position: "sticky",
      bottom: 0,
      background: "oklch(22% 0.10 260)",
      borderTop: "1px solid oklch(30% 0.08 260)",
      padding: "0.5rem 0.75rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      zIndex: 10,
    }}>
      {prevHref ? (
        <a href={prevHref} style={{
          fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.72rem",
          color: "oklch(65% 0.04 260)",
          textDecoration: "none", padding: "0.4rem 0.75rem",
          border: "1px solid oklch(40% 0.08 260)",
          letterSpacing: "0.04em",
          flexShrink: 0,
        }}>
          ← Prev
        </a>
      ) : (
        <div style={{ flex: "0 0 auto", width: "60px" }} />
      )}

      <button
        onClick={toggleComplete}
        disabled={loading}
        style={{
          flex: 1,
          fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.72rem",
          letterSpacing: "0.04em", textTransform: "uppercase",
          background: completed ? "oklch(45% 0.10 155)" : "oklch(65% 0.15 45)",
          color: "oklch(97% 0.005 80)",
          border: "none",
          padding: "0.5rem 0.75rem",
          cursor: loading ? "wait" : "pointer",
          opacity: loading ? 0.7 : 1,
          transition: "background 0.15s, opacity 0.15s",
        }}
      >
        {loading ? "…" : completed ? "✓ Completed" : userId ? "Mark complete" : "Log in to track"}
      </button>

      {nextHref ? (
        <a href={nextHref} style={{
          fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.72rem",
          color: "oklch(72% 0.006 260)",
          textDecoration: "none", padding: "0.4rem 0.75rem",
          border: "1px solid oklch(40% 0.08 260)",
          letterSpacing: "0.04em",
          flexShrink: 0,
        }}>
          Next →
        </a>
      ) : (
        <div style={{ flex: "0 0 auto", width: "60px" }} />
      )}
    </div>
  );
}
