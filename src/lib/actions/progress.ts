"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getUnlockedLessonOrder } from "@/lib/data/progress";
import { submitQuiz, type QuizSubmissionResult } from "@/lib/actions/quizzes";
import type { SubmitQuizInput } from "@/lib/validations/quiz-submission";

export type MutationResult = { success: true } | { success: false; error: string };
export type UnlockResult =
  | { success: true; currentLessonOrder: number }
  | { success: false; error: string };

export async function markLessonCompleted(
  lessonId: string,
  data: { score: number; percentage: number; passed: boolean },
): Promise<MutationResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "You must be signed in." };
  }

  const userId = session.user.id;
  const existing = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });

  // Always keep the highest score/percentage ever achieved, even across a
  // later failed retry — and never revoke completion once passed.
  const keepHigher = !existing || data.percentage > (existing.percentage ?? -1);

  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    create: {
      userId,
      lessonId,
      completed: data.passed,
      score: data.score,
      percentage: data.percentage,
      attempts: 1,
      completedAt: data.passed ? new Date() : null,
    },
    update: {
      completed: existing ? existing.completed || data.passed : data.passed,
      score: keepHigher ? data.score : existing?.score,
      percentage: keepHigher ? data.percentage : existing?.percentage,
      attempts: { increment: 1 },
      completedAt: existing?.completedAt ?? (data.passed ? new Date() : null),
    },
  });

  return { success: true };
}

export async function unlockNextLesson(courseId: string): Promise<UnlockResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "You must be signed in." };
  }

  const userId = session.user.id;
  const unlockedOrder = await getUnlockedLessonOrder(courseId, userId);

  const lesson = await prisma.lesson.findFirst({
    where: { courseId, order: unlockedOrder },
    select: { id: true },
  });

  const existing = await prisma.courseProgress.findUnique({
    where: { userId_courseId: { userId, courseId } },
    include: { currentLesson: { select: { order: true } } },
  });

  // Advance-only: the stored pointer never moves backwards, so retaking an
  // earlier lesson's quiz can't regress a student who's already moved on.
  if (!existing || (existing.currentLesson?.order ?? 0) < unlockedOrder) {
    await prisma.courseProgress.upsert({
      where: { userId_courseId: { userId, courseId } },
      create: { userId, courseId, currentLessonId: lesson?.id ?? null },
      update: { currentLessonId: lesson?.id ?? null, lastActivityAt: new Date() },
    });
  } else {
    // Still record the attempt as activity even when the pointer doesn't move.
    await prisma.courseProgress.update({
      where: { userId_courseId: { userId, courseId } },
      data: { lastActivityAt: new Date() },
    });
  }

  return { success: true, currentLessonOrder: unlockedOrder };
}

// Wraps the existing submitQuiz (src/lib/actions/quizzes.ts) — scoring
// behavior is untouched — and additionally persists progress from the
// result. lessonId/courseId are resolved from quizId internally so the
// public signature matches submitQuiz exactly and QuizPlayer only needs to
// change which action it calls, not what it passes.
export async function submitQuizResult(
  quizId: string,
  input: SubmitQuizInput,
): Promise<QuizSubmissionResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "You must be signed in." };
  }

  const result = await submitQuiz(quizId, input);
  if (!result.success) {
    return result;
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: { lessonId: true, lesson: { select: { courseId: true } } },
  });

  if (quiz) {
    await markLessonCompleted(quiz.lessonId, {
      score: result.score,
      percentage: result.percentage,
      passed: result.passed,
    });
    await unlockNextLesson(quiz.lesson.courseId);
  }

  return result;
}
