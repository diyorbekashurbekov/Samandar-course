"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { grantEnrollment, type GrantEnrollmentResult } from "@/lib/data/enrollment";
import { createEnrollmentSchema, courseIdSchema } from "@/lib/validations/enrollment";

export type CreateEnrollmentResult = GrantEnrollmentResult;
export type MutationResult = { success: true } | { success: false; error: string };

// grantEnrollment (src/lib/data/enrollment.ts) — the plain function that
// actually does the enrolling — is deliberately NOT defined in this file: a
// file-level "use server" directive turns every export here into a
// client-callable Server Action, so the function with no auth check of its
// own must live somewhere that directive doesn't reach.

// Client-facing entry point for free/manual enrollment (a session is
// required). A payment provider (Kaspi, ...) does NOT call this — it can't
// authenticate as the buyer from a server-to-server webhook — it calls
// grantEnrollment directly once its own payment verification has succeeded
// (see src/app/api/payments/kaspi/webhook/route.ts). Both paths converge on
// the same grantEnrollment logic, so there's still exactly one place that
// decides what "enrolled" means.
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

  return grantEnrollment(session.user.id, parsed.data.courseId, {
    paymentProvider: parsed.data.paymentProvider,
    paymentReference: parsed.data.paymentReference,
  });
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
