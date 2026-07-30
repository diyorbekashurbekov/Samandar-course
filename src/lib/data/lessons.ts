import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import type { LessonSummary } from "@/lib/types";
import type { Lesson } from "@/generated/prisma/client";

// Memoized per-request so layout.tsx and page.tsx can both check enrollment
// for the same course without issuing duplicate queries.
export const isEnrolledInCourse = cache(async (courseId: string): Promise<boolean> => {
  const session = await auth();
  if (!session?.user) return false;

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId } },
    select: { id: true },
  });

  return !!enrollment;
});

function toLessonSummary(lesson: Lesson, locked: boolean): LessonSummary {
  return {
    id: lesson.id,
    courseId: lesson.courseId,
    title: lesson.title,
    order: lesson.order,
    type: lesson.type,
    durationMinutes: lesson.durationMinutes,
    videoUrl: lesson.videoUrl ?? "",
    isFreePreview: lesson.isFreePreview,
    // No lesson-completion tracking exists yet.
    locked,
    completed: false,
  };
}

export async function listLessonsForCourse(courseId: string): Promise<LessonSummary[]> {
  const [lessons, enrolled] = await Promise.all([
    prisma.lesson.findMany({ where: { courseId }, orderBy: { order: "asc" } }),
    isEnrolledInCourse(courseId),
  ]);

  return lessons.map((lesson) => toLessonSummary(lesson, !lesson.isFreePreview && !enrolled));
}

export async function getLessonById(id: string): Promise<LessonSummary | null> {
  const lesson = await prisma.lesson.findUnique({ where: { id } });
  if (!lesson) return null;

  const enrolled = await isEnrolledInCourse(lesson.courseId);
  return toLessonSummary(lesson, !lesson.isFreePreview && !enrolled);
}
