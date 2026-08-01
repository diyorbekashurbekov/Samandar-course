import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getUnlockedLessonOrder, getLessonProgressForUser } from "@/lib/data/progress";
import { isUserEnrolled } from "@/lib/data/enrollment";
import type { LessonSummary } from "@/lib/types";
import type { Lesson } from "@/generated/prisma/client";

function toLessonSummary(
  lesson: Lesson,
  options: { locked: boolean; completed: boolean; isCurrent: boolean; enrolled: boolean },
): LessonSummary {
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
    locked: options.locked,
    completed: options.completed,
    isCurrent: options.isCurrent,
    enrolled: options.enrolled,
  };
}

// Student can access: completed lessons, free-preview lessons, and the
// current unlocked lesson — everything else stays locked. See
// src/lib/data/progress.ts for how "unlocked" is derived.
export async function listLessonsForCourse(courseId: string): Promise<LessonSummary[]> {
  const [course, lessons, enrolled] = await Promise.all([
    prisma.course.findUnique({ where: { id: courseId }, select: { status: true } }),
    prisma.lesson.findMany({ where: { courseId }, orderBy: { order: "asc" } }),
    isUserEnrolled(courseId),
  ]);

  const coursePublished = course?.status === "PUBLISHED";
  const session = await auth();

  let unlockedOrder = 0;
  let progressMap = new Map<string, { completed: boolean }>();
  if (session?.user) {
    [unlockedOrder, progressMap] = await Promise.all([
      getUnlockedLessonOrder(courseId, session.user.id),
      getLessonProgressForUser(
        session.user.id,
        lessons.map((lesson) => lesson.id),
      ),
    ]);
  }

  return lessons.map((lesson) => {
    const completed = progressMap.get(lesson.id)?.completed ?? false;
    const locked =
      !coursePublished || (!lesson.isFreePreview && (!enrolled || lesson.order > unlockedOrder));
    const isCurrent = !completed && lesson.order === unlockedOrder;
    return toLessonSummary(lesson, { locked, completed, isCurrent, enrolled });
  });
}

export async function getLessonById(id: string): Promise<LessonSummary | null> {
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: { course: { select: { status: true } } },
  });
  if (!lesson) return null;

  const enrolled = await isUserEnrolled(lesson.courseId);
  const coursePublished = lesson.course.status === "PUBLISHED";

  const session = await auth();
  let unlockedOrder = 0;
  let completed = false;
  if (session?.user) {
    const [order, progressMap] = await Promise.all([
      getUnlockedLessonOrder(lesson.courseId, session.user.id),
      getLessonProgressForUser(session.user.id, [lesson.id]),
    ]);
    unlockedOrder = order;
    completed = progressMap.get(lesson.id)?.completed ?? false;
  }

  const locked =
    !coursePublished || (!lesson.isFreePreview && (!enrolled || lesson.order > unlockedOrder));
  const isCurrent = !completed && lesson.order === unlockedOrder;

  return toLessonSummary(lesson, { locked, completed, isCurrent, enrolled });
}
