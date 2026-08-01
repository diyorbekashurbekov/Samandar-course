import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import type { EnrollmentStatus, PaymentStatus } from "@/generated/prisma/client";

export type EnrollmentSummary = {
  id: string;
  status: EnrollmentStatus;
  paymentStatus: PaymentStatus;
  paymentProvider: string;
  paymentReference: string | null;
  enrolledAt: Date;
};

export type GrantEnrollmentResult =
  | { success: true; enrollmentId: string }
  | { success: false; error: string };

// The Enrollment Engine's one real entrypoint for granting access — everything
// else (the createEnrollment Server Action for client-initiated/free
// enrollment, and the Kaspi webhook handler for paid enrollment) calls this
// rather than touching prisma.enrollment directly, so there is exactly one
// place that decides what "enrolled" means in the database.
//
// Deliberately NOT a Server Action (no "use server", this file has none) —
// it takes a caller-supplied userId with no auth check of its own, so it must
// only ever be reachable from trusted server code that has already
// authenticated the request itself (a session in createEnrollment, our own
// Payment row in the webhook), never directly from the client.
export async function grantEnrollment(
  userId: string,
  courseId: string,
  options: { paymentProvider: string; paymentReference?: string | null },
): Promise<GrantEnrollmentResult> {
  const course = await prisma.course.findUnique({ where: { id: courseId }, select: { id: true } });
  if (!course) {
    return { success: false, error: "Course not found." };
  }

  const enrollment = await prisma.enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: {
      userId,
      courseId,
      status: "ACTIVE",
      paymentStatus: "PAID",
      paymentProvider: options.paymentProvider,
      paymentReference: options.paymentReference ?? null,
    },
    update: {
      status: "ACTIVE",
      paymentStatus: "PAID",
      paymentProvider: options.paymentProvider,
      paymentReference: options.paymentReference ?? null,
    },
  });

  return { success: true, enrollmentId: enrollment.id };
}

// Memoized per-request — course detail and lesson pages both need this for
// the same course/user without issuing duplicate queries (same pattern as
// getUnlockedLessonOrder in src/lib/data/progress.ts). Access is gated on
// status === "ACTIVE", not just row existence, so a cancelled enrollment
// locks the course again without deleting the payment history row.
export const isUserEnrolled = cache(async (courseId: string): Promise<boolean> => {
  const session = await auth();
  if (!session?.user) return false;

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId } },
    select: { status: true },
  });

  return enrollment?.status === "ACTIVE";
});

export async function getEnrollment(courseId: string): Promise<EnrollmentSummary | null> {
  const session = await auth();
  if (!session?.user) return null;

  return prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId } },
    select: {
      id: true,
      status: true,
      paymentStatus: true,
      paymentProvider: true,
      paymentReference: true,
      enrolledAt: true,
    },
  });
}
