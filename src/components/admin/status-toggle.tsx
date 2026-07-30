"use client";

import type { CourseStatus } from "@/lib/mock-data";

const statuses: CourseStatus[] = ["DRAFT", "PUBLISHED"];

export function StatusToggle({
  value,
  onChange,
}: {
  value: CourseStatus;
  onChange: (status: CourseStatus) => void;
}) {
  return (
    <div className="inline-flex w-fit rounded-full border border-zinc-200 p-1 dark:border-zinc-800">
      {statuses.map((status) => (
        <button
          key={status}
          type="button"
          onClick={() => onChange(status)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            value === status
              ? status === "PUBLISHED"
                ? "bg-emerald-600 text-white"
                : "bg-zinc-700 text-white dark:bg-zinc-200 dark:text-zinc-900"
              : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          }`}
        >
          {status === "DRAFT" ? "Draft" : "Published"}
        </button>
      ))}
    </div>
  );
}
