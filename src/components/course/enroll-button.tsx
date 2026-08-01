"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createEnrollment } from "@/lib/actions/enrollment";

export function EnrollButton({
  courseId,
  priceKzt,
  enrolled,
  continueLessonId,
}: {
  courseId: string;
  priceKzt: number;
  enrolled: boolean;
  continueLessonId: string | null;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  if (enrolled) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">You&apos;re enrolled</p>
        <Link
          href={continueLessonId ? `/lessons/${continueLessonId}` : "#"}
          className="flex h-11 items-center justify-center rounded-full bg-brand px-5 text-sm font-medium text-white transition hover:opacity-90"
        >
          Continue Learning
        </Link>
      </div>
    );
  }

  async function handleEnroll() {
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

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        {priceKzt.toLocaleString("ru-RU")} тг
      </p>
      <button
        type="button"
        disabled={submitting}
        onClick={handleEnroll}
        className="flex h-11 items-center justify-center rounded-full bg-brand px-5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? "Enrolling…" : "Enroll"}
      </button>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Payment processing (Kaspi Pay) isn&apos;t wired up yet — enrolling grants access directly.
      </p>
    </div>
  );
}
