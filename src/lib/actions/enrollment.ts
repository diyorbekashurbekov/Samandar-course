"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { createEnrollmentSchema, courseIdSchema } from "@/lib/validations/enrollment";

export type CreateEnrollmentResult =
  | { success: true; enrollmentId: string }
  | { success: false; error: string };
export type MutationResult = { success: true } | { success: false; error: string };

// The only entry point that grants course access. A payment provider (Kaspi,
// Stripe, ...) confirms payment on its own, then calls this with its name
// and a reference — it never decides who gets access, this does. Upserts
// rather than plain-creates so re-enrolling after a cancellation reactivates
// the existing row instead of hitting the (userId, courseId) unique
// constraint.
export async function createEnrollment(
  courseId: string,
  options?: { paymentProvider?: string; paymentReference?: string | null },
): Promise<CreateEnrollmentResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "You must be signed in." };
  }

  const parsed = createEnrollmentSchema.safeParse({
    courseId,
    paymentProvider: options?.paymentProvider,
    paymentReference: options?.paymentReference,
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const course = await prisma.course.findUnique({
    where: { id: parsed.data.courseId },
    select: { id: true },
  });
  if (!course) {
    return { success: false, error: "Course not found." };
  }

  const enrollment = await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: session.user.id, courseId: parsed.data.courseId } },
    create: {
      userId: session.user.id,
      courseId: parsed.data.courseId,
      status: "ACTIVE",
      paymentStatus: "PAID",
      paymentProvider: parsed.data.paymentProvider,
      paymentReference: parsed.data.paymentReference ?? null,
    },
    update: {
      status: "ACTIVE",
      paymentStatus: "PAID",
      paymentProvider: parsed.data.paymentProvider,
      paymentReference: parsed.data.paymentReference ?? null,
    },
  });

  return { success: true, enrollmentId: enrollment.id };
}

export async function cancelEnrollment(courseId: string): Promise<MutationResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "You must be signed in." };
  }

  const parsed = courseIdSchema.safeParse(courseId);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: parsed.data } },
    select: { status: true },
  });
  if (!existing || existing.status === "CANCELLED") {
    return { success: false, error: "You are not enrolled in this course." };
  }

  await prisma.enrollment.update({
    where: { userId_courseId: { userId: session.user.id, courseId: parsed.data } },
    data: { status: "CANCELLED" },
  });

  return { success: true };
}
