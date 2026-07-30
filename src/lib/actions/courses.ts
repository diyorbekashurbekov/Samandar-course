"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { courseFormSchema, type CourseFormInput } from "@/lib/validations/course";

export type CreateCourseResult = { success: true; courseId: string } | { success: false; error: string };
export type MutationResult = { success: true } | { success: false; error: string };

export async function createCourse(input: CourseFormInput): Promise<CreateCourseResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "You must be signed in." };
  }

  const parsed = courseFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const slugTaken = await prisma.course.findUnique({
    where: { slug: parsed.data.slug },
    select: { id: true },
  });
  if (slugTaken) {
    return { success: false, error: "That slug is already taken." };
  }

  const course = await prisma.course.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      level: parsed.data.level,
      status: parsed.data.status,
      priceKzt: parsed.data.priceKzt,
      instructorId: session.user.id,
    },
  });

  return { success: true, courseId: course.id };
}

export async function updateCourse(id: string, input: CourseFormInput): Promise<MutationResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "You must be signed in." };
  }

  const parsed = courseFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const slugOwner = await prisma.course.findUnique({
    where: { slug: parsed.data.slug },
    select: { id: true },
  });
  if (slugOwner && slugOwner.id !== id) {
    return { success: false, error: "That slug is already taken." };
  }

  await prisma.course.update({
    where: { id },
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      level: parsed.data.level,
      status: parsed.data.status,
      priceKzt: parsed.data.priceKzt,
    },
  });

  return { success: true };
}

export async function deleteCourse(id: string): Promise<MutationResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "You must be signed in." };
  }

  await prisma.course.delete({ where: { id } });
  return { success: true };
}
