import { cache } from "react";
import { prisma } from "@/lib/prisma";

type LessonForUnlockCheck = { id: string; order: number; hasQuiz: boolean };

// A lesson only blocks further progress if it has a quiz that hasn't been
// passed yet — lessons without a quiz never gate. Pure function so both
// getUnlockedLessonOrder (fresh fetch) and loadStudentProgress (reusing data
// it already fetched) can share the exact same rule.
function computeUnlockedOrder(
  lessons: LessonForUnlockCheck[],
  completedLessonIds: Set<string>,
): number {
  let unlockedOrder = 0;
  for (const lesson of lessons) {
    unlockedOrder = lesson.order;
    if (lesson.hasQuiz && !completedLessonIds.has(lesson.id)) break;
  }
  return unlockedOrder;
}

// Memoized per-request — layout.tsx (curriculum sidebar) and page.tsx (the
// lesson itself) both need this for the same course/user, same pattern as
// isUserEnrolled in src/lib/data/enrollment.ts.
export const getUnlockedLessonOrder = cache(
  async (courseId: string, userId: string): Promise<number> => {
    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: "asc" },
      select: { id: true, order: true, quiz: { select: { id: true } } },
    });
    if (lessons.length === 0) return 0;

    const progressRows = await prisma.lessonProgress.findMany({
      where: { userId, lessonId: { in: lessons.map((lesson) => lesson.id) } },
      select: { lessonId: true, completed: true },
    });
    const completedLessonIds = new Set(
      progressRows.filter((row) => row.completed).map((row) => row.lessonId),
    );

    return computeUnlockedOrder(
      lessons.map((lesson) => ({ id: lesson.id, order: lesson.order, hasQuiz: !!lesson.quiz })),
      completedLessonIds,
    );
  },
);

export async function getLessonProgressForUser(
  userId: string,
  lessonIds: string[],
): Promise<Map<string, { completed: boolean }>> {
  if (lessonIds.length === 0) return new Map();
  const rows = await prisma.lessonProgress.findMany({
    where: { userId, lessonId: { in: lessonIds } },
    select: { lessonId: true, completed: true },
  });
  return new Map(rows.map((row) => [row.lessonId, { completed: row.completed }]));
}

export type StudentCourseProgress = {
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
  averageQuizScore: number | null;
  lastActivityAt: Date | null;
  currentLessonId: string | null;
  currentLessonOrder: number;
};

export async function loadStudentProgress(
  courseId: string,
  userId: string,
): Promise<StudentCourseProgress> {
  const lessons = await prisma.lesson.findMany({
    where: { courseId },
    orderBy: { order: "asc" },
    select: { id: true, order: true, quiz: { select: { id: true } } },
  });

  const progressRows = await prisma.lessonProgress.findMany({
    where: { userId, lessonId: { in: lessons.map((lesson) => lesson.id) } },
  });

  const completedLessonIds = new Set(
    progressRows.filter((row) => row.completed).map((row) => row.lessonId),
  );
  const totalLessons = lessons.length;
  const completedLessons = completedLessonIds.size;
  const progressPercent =
    totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

  const scored = progressRows.filter((row) => row.percentage !== null);
  const averageQuizScore =
    scored.length === 0
      ? null
      : Math.round(scored.reduce((sum, row) => sum + (row.percentage ?? 0), 0) / scored.length);

  const lastActivityAt = progressRows.reduce<Date | null>((latest, row) => {
    if (!latest || row.updatedAt > latest) return row.updatedAt;
    return latest;
  }, null);

  const currentLessonOrder = computeUnlockedOrder(
    lessons.map((lesson) => ({ id: lesson.id, order: lesson.order, hasQuiz: !!lesson.quiz })),
    completedLessonIds,
  );
  const currentLesson = lessons.find((lesson) => lesson.order === currentLessonOrder);

  return {
    completedLessons,
    totalLessons,
    progressPercent,
    averageQuizScore,
    lastActivityAt,
    currentLessonId: currentLesson?.id ?? null,
    currentLessonOrder,
  };
}
