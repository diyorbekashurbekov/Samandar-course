import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { grantEnrollment } from "@/lib/data/enrollment";
import type { TransactionStatus } from "@/generated/prisma/client";

export type PaymentSummary = {
  id: string;
  courseId: string;
  amountKzt: number;
  status: TransactionStatus;
  provider: string;
  createdAt: Date;
  confirmedAt: Date | null;
};

// The most recent checkout attempt for this user+course, regardless of
// status — drives the course page's Not purchased / Pending / Paid state.
// A course can have many Payment rows over time (retries after a failure or
// cancellation); only the latest one is relevant for what to show.
export const getLatestPaymentForCourse = cache(async (courseId: string): Promise<PaymentSummary | null> => {
  const session = await auth();
  if (!session?.user) return null;

  return prisma.payment.findFirst({
    where: { userId: session.user.id, courseId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      courseId: true,
      amountKzt: true,
      status: true,
      provider: true,
      createdAt: true,
      confirmedAt: true,
    },
  });
});

// Ownership-checked lookup for the payment return page — a user can only
// ever see their own payment's status, never anyone else's by guessing an id.
export async function getPaymentForUser(paymentId: string): Promise<PaymentSummary | null> {
  const session = await auth();
  if (!session?.user) return null;

  return prisma.payment.findFirst({
    where: { id: paymentId, userId: session.user.id },
    select: {
      id: true,
      courseId: true,
      amountKzt: true,
      status: true,
      provider: true,
      createdAt: true,
      confirmedAt: true,
    },
  });
}

export type ApplyPaymentStatusResult =
  | { applied: true; status: "PAID" | "FAILED" | "CANCELLED" }
  | { applied: false; reason: "still_pending" | "not_found" | "already_processed" };

// The one place a verified payment status result (from the Kaspi webhook, or
// the return-page's reconciliation check) turns into a Payment update and —
// only on PAID — a call to grantEnrollment. Not a Server Action (no "use
// server" anywhere in this file, same reasoning as grantEnrollment in
// data/enrollment.ts): both callers (the webhook route handler and the
// checkPaymentStatus action) are already-trusted server code, and this must
// never become directly reachable from the client.
//
// The status write is a conditional `updateMany` scoped to status=PENDING,
// so this is safe to call twice for the same providerReference (webhook
// retries, or a return-page reconciliation racing the real webhook) — only
// the first call that observes PENDING does anything; every later call sees
// `applied: false, reason: "already_processed"` and grantEnrollment never
// runs twice for the same Payment.
export async function applyPaymentStatus(
  providerReference: string,
  status: "PENDING" | "PAID" | "FAILED" | "CANCELLED",
): Promise<ApplyPaymentStatusResult> {
  if (status === "PENDING") {
    return { applied: false, reason: "still_pending" };
  }

  const payment = await prisma.payment.findUnique({
    where: { providerReference },
    select: { id: true, userId: true, courseId: true },
  });
  if (!payment) {
    return { applied: false, reason: "not_found" };
  }

  const { count } = await prisma.payment.updateMany({
    where: { id: payment.id, status: "PENDING" },
    data: { status, confirmedAt: status === "PAID" ? new Date() : null },
  });
  if (count === 0) {
    return { applied: false, reason: "already_processed" };
  }

  if (status === "PAID") {
    await grantEnrollment(payment.userId, payment.courseId, {
      paymentProvider: "kaspi",
      paymentReference: providerReference,
    });
  }

  return { applied: true, status };
}
