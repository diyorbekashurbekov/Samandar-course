"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { isUserEnrolled } from "@/lib/data/enrollment";
import { applyPaymentStatus } from "@/lib/data/payment";
import { paymentProvider } from "@/lib/payment";
import { createPaymentOrderSchema, paymentIdSchema } from "@/lib/validations/payment";

export type CreatePaymentOrderResult =
  | { success: true; paymentId: string; checkoutUrl: string }
  | { success: false; error: string };
export type CheckPaymentStatusResult =
  | { success: true; status: "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "EXPIRED" }
  | { success: false; error: string };

// Payment Layer entry point (Course Page "Buy Course" button). This file
// only ever talks to the Payment model and the payment provider — the only
// enrollment-shaped thing it does is indirectly, through applyPaymentStatus
// (src/lib/data/payment.ts) once a payment is actually confirmed PAID.
export async function createPaymentOrder(courseId: string): Promise<CreatePaymentOrderResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "You must be signed in." };
  }

  const parsed = createPaymentOrderSchema.safeParse({ courseId });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const course = await prisma.course.findUnique({
    where: { id: parsed.data.courseId },
    select: { id: true, title: true, status: true, priceKzt: true },
  });
  if (!course || course.status !== "PUBLISHED") {
    return { success: false, error: "Course not found." };
  }
  if (course.priceKzt <= 0) {
    return { success: false, error: "This course is free — no payment required." };
  }

  if (await isUserEnrolled(course.id)) {
    return { success: false, error: "You're already enrolled in this course." };
  }

  // Supersede any earlier unfinished attempt so at most one PENDING payment
  // ever exists per user+course — prevents duplicate/parallel payment
  // sessions for the same purchase. Safe even if the old checkout is still
  // open in another tab: its providerReference no longer matches a PENDING
  // row, so a late webhook for it becomes a no-op (applyPaymentStatus /
  // "already_processed" via the updateMany-where-PENDING guard).
  await prisma.payment.updateMany({
    where: { userId: session.user.id, courseId: course.id, status: "PENDING" },
    data: { status: "EXPIRED" },
  });

  const payment = await prisma.payment.create({
    data: {
      userId: session.user.id,
      courseId: course.id,
      amountKzt: course.priceKzt,
      status: "PENDING",
      provider: "kaspi",
    },
  });

  try {
    const { checkoutUrl, providerReference } = await paymentProvider.createPayment({
      orderId: payment.id,
      amountKzt: course.priceKzt,
      description: course.title,
    });

    await prisma.payment.update({
      where: { id: payment.id },
      data: { providerReference },
    });

    return { success: true, paymentId: payment.id, checkoutUrl };
  } catch {
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
    return { success: false, error: "Could not start payment. Please try again." };
  }
}

// Reconciliation fallback for the payment return page: if the webhook
// hasn't landed yet (or never will, e.g. local dev without a public
// callback URL), this asks Kaspi directly instead of leaving the student
// stuck on "Pending" forever. The webhook remains the primary path.
export async function checkPaymentStatus(paymentId: string): Promise<CheckPaymentStatusResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "You must be signed in." };
  }

  const parsed = paymentIdSchema.safeParse(paymentId);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const payment = await prisma.payment.findFirst({
    where: { id: parsed.data, userId: session.user.id },
    select: { status: true, providerReference: true },
  });
  if (!payment) {
    return { success: false, error: "Payment not found." };
  }
  if (payment.status !== "PENDING" || !payment.providerReference) {
    return { success: true, status: payment.status };
  }

  try {
    const result = await paymentProvider.checkPaymentStatus(payment.providerReference);
    const outcome = await applyPaymentStatus(result.providerReference, result.status);
    return { success: true, status: outcome.applied ? outcome.status : "PENDING" };
  } catch {
    return { success: true, status: "PENDING" };
  }
}
