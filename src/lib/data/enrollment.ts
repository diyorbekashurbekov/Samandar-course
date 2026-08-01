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
