"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createEnrollment } from "@/lib/actions/enrollment";
import { createPaymentOrder } from "@/lib/actions/payment";

export function EnrollButton({
  courseId,
  priceKzt,
  enrolled,
  continueLessonId,
  pendingPaymentId,
}: {
  courseId: string;
  priceKzt: number;
  enrolled: boolean;
  continueLessonId: string | null;
  /** Id of this user's still-open (PENDING) payment for this course, if any — "Pending payment" state. */
  pendingPaymentId: string | null;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  if (enrolled) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">You&apos;re enrolled — Paid</p>
        <Link
          href={continueLessonId ? `/lessons/${continueLessonId}` : "#"}
          className="flex h-11 items-center justify-center rounded-full bg-brand px-5 text-sm font-medium text-white transition hover:opacity-90"
        >
          Continue Learning
        </Link>
      </div>
    );
  }

  if (priceKzt > 0 && pendingPaymentId) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Payment pending</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          We haven&apos;t received confirmation from Kaspi yet.
        </p>
        <Link
          href={`/payments/${pendingPaymentId}`}
          className="flex h-11 items-center justify-center rounded-full border border-zinc-300 px-5 text-sm font-medium text-zinc-700 transition hover:border-brand hover:text-brand dark:border-zinc-700 dark:text-zinc-300"
        >
          Check payment status
        </Link>
      </div>
    );
  }

  async function handleFreeEnroll() {
    setSubmitting(true);
    const result = await createEnrollment(courseId);
    setSubmitting(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("You're enrolled!");
    router.refresh();
  }

  async function handleBuy() {
    setSubmitting(true);
    const result = await createPaymentOrder(courseId);
    setSubmitting(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    window.location.href = result.checkoutUrl;
  }

  if (priceKzt <= 0) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Free</p>
        <button
          type="button"
          disabled={submitting}
          onClick={handleFreeEnroll}
          className="flex h-11 items-center justify-center rounded-full bg-brand px-5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Enrolling…" : "Enroll"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        {priceKzt.toLocaleString("ru-RU")} тг
      </p>
      <button
        type="button"
        disabled={submitting}
        onClick={handleBuy}
        className="flex h-11 items-center justify-center rounded-full bg-brand px-5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? "Redirecting…" : "Buy Course"}
      </button>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">You&apos;ll be redirected to Kaspi to pay.</p>
    </div>
  );
}
