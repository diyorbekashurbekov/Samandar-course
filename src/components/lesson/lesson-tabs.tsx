"use client";

import { useState } from "react";
import type { LessonType } from "@/lib/mock-data";

const tabs = ["Overview", "Test", "Resources"] as const;

export function LessonTabs({ lessonType }: { lessonType: LessonType }) {
  const [active, setActive] = useState<(typeof tabs)[number]>("Overview");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1 border-b border-zinc-200 dark:border-zinc-800">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
              active === tab
                ? "border-brand text-brand"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {active === "Overview" && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Lesson notes and description will appear here.
        </p>
      )}
      {active === "Test" && (
        <div className="rounded-xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          {lessonType === "test"
            ? "Lesson test placeholder — quiz questions will render here."
            : "This lesson has no test."}
        </div>
      )}
      {active === "Resources" && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Downloadable resources will appear here.
        </p>
      )}
    </div>
  );
}
