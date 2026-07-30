// Placeholder purchase card. Kaspi Pay checkout will replace the disabled
// button below once payment integration is implemented.
export function EnrollButton({ priceKzt }: { priceKzt: number }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        {priceKzt.toLocaleString("ru-RU")} тг
      </p>
      <button
        type="button"
        disabled
        title="Kaspi payment integration coming soon"
        className="flex h-11 items-center justify-center rounded-full bg-brand px-5 text-sm font-medium text-white opacity-60"
      >
        Enroll with Kaspi Pay
      </button>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Payment processing via Kaspi is not wired up yet — this is a placeholder.
      </p>
    </div>
  );
}
