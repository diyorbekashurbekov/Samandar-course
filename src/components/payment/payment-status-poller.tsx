"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { checkPaymentStatus } from "@/lib/actions/payment";

const POLL_INTERVAL_MS = 4000;
const MAX_POLLS = 15; // ~1 minute, then the student can still hit "Check now" manually

// Webhooks are the primary path (see src/app/api/payments/kaspi/webhook/route.ts)
// but a browser sitting on the return page has no way to know one arrived —
// this polls checkPaymentStatus (which reconciles with Kaspi directly) and
// does a full server refresh the moment status leaves PENDING, so the page
// picks up the newly-unlocked course without the student doing anything.
export function PaymentStatusPoller({ paymentId }: { paymentId: string }) {
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const pollsRef = useRef(0);
  const stoppedRef = useRef(false);

  const check = useCallback(async () => {
    setChecking(true);
    const result = await checkPaymentStatus(paymentId);
    setChecking(false);

    if (result.success && result.status !== "PENDING") {
      stoppedRef.current = true;
      router.refresh();
    }
  }, [paymentId, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (stoppedRef.current || pollsRef.current >= MAX_POLLS) {
        clearInterval(interval);
        return;
      }
      pollsRef.current += 1;
      check();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [check]);

  return (
    <button
      type="button"
      onClick={check}
      disabled={checking}
      className="flex h-11 items-center justify-center rounded-full border border-zinc-300 px-5 text-sm font-medium text-zinc-700 transition hover:border-brand hover:text-brand disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-300"
    >
      {checking ? "Checking…" : "Check now"}
    </button>
  );
}
