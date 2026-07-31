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
    videoPublicId: lesson.videoPublicId,
    videoDurationSeconds: lesson.videoDurationSeconds,
    videoSizeBytes: lesson.videoSizeBytes === null ? null : Number(lesson.videoSizeBytes),
    videoUploadedAt: lesson.videoUploadedAt,
    videoUploadStatus: lesson.videoUploadStatus,
    isFreePreview: lesson.isFreePreview,
    // No lesson-completion tracking exists yet.
    locked,
    completed: false,
  };
}

export async function listLessonsForCourse(courseId: string): Promise<LessonSummary[]> {
  const [course, lessons, enrolled] = await Promise.all([
    prisma.course.findUnique({ where: { id: courseId }, select: { status: true } }),
    prisma.lesson.findMany({ where: { courseId }, orderBy: { order: "asc" } }),
    isEnrolledInCourse(courseId),
  ]);

  const coursePublished = course?.status === "PUBLISHED";
  return lessons.map((lesson) =>
    toLessonSummary(lesson, !coursePublished || (!lesson.isFreePreview && !enrolled)),
  );
}

export async function getLessonById(id: string): Promise<LessonSummary | null> {
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: { course: { select: { status: true } } },
  });
  if (!lesson) return null;

  const enrolled = await isEnrolledInCourse(lesson.courseId);
  const coursePublished = lesson.course.status === "PUBLISHED";
  return toLessonSummary(lesson, !coursePublished || (!lesson.isFreePreview && !enrolled));
}
