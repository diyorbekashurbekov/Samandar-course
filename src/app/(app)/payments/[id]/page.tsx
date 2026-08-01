import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { PaymentStatusPoller } from "@/components/payment/payment-status-poller";
import { getPaymentForUser } from "@/lib/data/payment";
import { getCourseById } from "@/lib/data/courses";

const STATUS_COPY: Record<string, { label: string; variant: "success" | "danger" | "locked" | "brand"; message: string }> = {
  PAID: {
    label: "Paid",
    variant: "success",
    message: "Payment confirmed — the course is unlocked.",
  },
  PENDING: {
    label: "Pending",
    variant: "brand",
    message: "Waiting for Kaspi to confirm your payment. This page updates automatically.",
  },
  FAILED: {
    label: "Failed",
    variant: "danger",
    message: "The payment didn't go through. You can try again from the course page.",
  },
  CANCELLED: {
    label: "Cancelled",
    variant: "locked",
    message: "This payment was cancelled. You can try again from the course page.",
  },
  EXPIRED: {
    label: "Expired",
    variant: "locked",
    message: "This payment attempt expired. You can start a new one from the course page.",
  },
};

export default async function PaymentReturnPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payment = await getPaymentForUser(id);
  if (!payment) {
    notFound();
  }

  const course = await getCourseById(payment.courseId);
  const copy = STATUS_COPY[payment.status] ?? STATUS_COPY.PENDING;

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-16 text-center">
      <Badge variant={copy.variant}>{copy.label}</Badge>
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        {course?.title ?? "Course payment"}
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {payment.amountKzt.toLocaleString("ru-RU")} тг · {copy.message}
      </p>

      {payment.status === "PENDING" && <PaymentStatusPoller paymentId={payment.id} />}

      {payment.status === "PAID" && course && (
        <Link
          href={`/courses/${course.slug}`}
          className="flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-medium text-white transition hover:opacity-90"
        >
          Continue Learning
        </Link>
      )}

      {(payment.status === "FAILED" || payment.status === "CANCELLED" || payment.status === "EXPIRED") &&
        course && (
          <Link
            href={`/courses/${course.slug}`}
            className="flex h-11 items-center justify-center rounded-full border border-zinc-300 px-6 text-sm font-medium text-zinc-700 transition hover:border-brand hover:text-brand dark:border-zinc-700 dark:text-zinc-300"
          >
            Back to course
          </Link>
        )}
    </div>
  );
}
