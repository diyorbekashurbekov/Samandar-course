import type { ReactNode } from "react";

const variants = {
  neutral: "bg-zinc-100 text-zinc-700 ring-1 ring-inset ring-zinc-900/5 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-white/10",
  brand: "bg-brand/10 text-brand ring-1 ring-inset ring-brand/15",
  success:
    "bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-600/15 dark:bg-emerald-900/40 dark:text-emerald-300 dark:ring-emerald-400/15",
  locked: "bg-zinc-100 text-zinc-500 ring-1 ring-inset ring-zinc-900/5 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-white/10",
  danger: "bg-red-100 text-red-700 ring-1 ring-inset ring-red-600/15 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-400/15",
};

export function Badge({
  children,
  variant = "neutral",
}: {
  children: ReactNode;
  variant?: keyof typeof variants;
}) {
  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center self-start rounded-full px-2.5 py-0.5 text-xs font-medium tracking-tight ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
