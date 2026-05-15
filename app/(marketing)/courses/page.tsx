import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import CoursesClient from "./CoursesClient";

export const metadata: Metadata = {
  title: "Courses — Crispy Development",
  description: "Free, practical courses for cross-cultural leaders. Master the digital tools your team uses every day.",
};

type CourseRow = {
  id: string;
  slug: string;
  title: string;
  title_id: string | null;
  description: string | null;
  description_id: string | null;
  is_free: boolean;
  order_index: number;
  course_chapters: { count: number }[];
};

export default async function CoursesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: courses } = await supabase
    .from("courses")
    .select("*, course_chapters(count)")
    .order("order_index") as { data: CourseRow[] | null };

  const courseList = courses ?? [];

  let progressMap: Record<string, number> = {};
  if (user && courseList.length > 0) {
    const { data: chapters } = await supabase
      .from("course_chapters")
      .select("id, course_id")
      .in("course_id", courseList.map((c) => c.id));

    if (chapters && chapters.length > 0) {
      const chapterToCourse: Record<string, string> = {};
      for (const ch of chapters) chapterToCourse[ch.id] = ch.course_id;

      const { data: progress } = await supabase
        .from("course_progress")
        .select("chapter_id")
        .eq("user_id", user.id)
        .in("chapter_id", chapters.map((ch) => ch.id));

      if (progress) {
        for (const row of progress) {
          const courseId = chapterToCourse[row.chapter_id];
          if (courseId) progressMap[courseId] = (progressMap[courseId] ?? 0) + 1;
        }
      }
    }
  }

  return (
    <CoursesClient
      courses={courseList}
      progressMap={progressMap}
      isLoggedIn={!!user}
    />
  );
}
