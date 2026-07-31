"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { lessonFormSchema, type LessonFormInput } from "@/lib/validations/lesson";

export type CreateLessonResult = { success: true; lessonId: string } | { success: false; error: string };
export type MutationResult = { success: true } | { success: false; error: string };

export async function createLesson(courseId: string, input: LessonFormInput): Promise<CreateLessonResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "You must be signed in." };
  }

  const parsed = lessonFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const course = await prisma.course.findUnique({ where: { id: courseId }, select: { id: true } });
  if (!course) {
    return { success: false, error: "Course not found." };
  }

  const lastLesson = await prisma.lesson.findFirst({
    where: { courseId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const lesson = await prisma.lesson.create({
    data: {
      courseId,
      title: parsed.data.title,
      durationMinutes: parsed.data.durationMinutes,
      type: parsed.data.type,
      isFreePreview: parsed.data.isFreePreview,
      order: (lastLesson?.order ?? 0) + 1,
    },
  });

  return { success: true, lessonId: lesson.id };
}

export async function updateLesson(id: string, input: LessonFormInput): Promise<MutationResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "You must be signed in." };
  }

  const parsed = lessonFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await prisma.lesson.update({
    where: { id },
    data: {
      title: parsed.data.title,
      durationMinutes: parsed.data.durationMinutes,
      type: parsed.data.type,
      isFreePreview: parsed.data.isFreePreview,
    },
  });

  return { success: true };
}

export async function deleteLesson(id: string): Promise<MutationResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "You must be signed in." };
  }

  await prisma.lesson.delete({ where: { id } });
  return { success: true };
}
