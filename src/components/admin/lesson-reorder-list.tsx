"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteLesson } from "@/lib/actions/lessons";
import type { LessonSummary } from "@/lib/types";

// Reordering is local to this session (no persistence) — deleting a lesson
// refreshes the page, which re-fetches the canonical order from Prisma.
export function LessonReorderList({ lessons: initialLessons }: { lessons: LessonSummary[] }) {
  const [lessons, setLessons] = useState(initialLessons);

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= lessons.length) return;
    const next = [...lessons];
    [next[index], next[target]] = [next[target], next[index]];
    setLessons(next);
  }

  return (
    <div className="flex flex-col gap-2">
      {lessons.map((lesson, index) => (
        <div
          key={lesson.id}
          className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <span
            className="cursor-grab select-none text-zinc-300 dark:text-zinc-700"
            title="Drag to reorder (coming soon)"
          >
            ⠿
          </span>

          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() => move(index, -1)}
              disabled={index === 0}
              className="text-xs text-zinc-400 transition hover:text-brand disabled:opacity-30"
              aria-label="Move lesson up"
            >
              ▲
            </button>
            <button
              type="button"
              onClick={() => move(index, 1)}
              disabled={index === lessons.length - 1}
              className="text-xs text-zinc-400 transition hover:text-brand disabled:opacity-30"
              aria-label="Move lesson down"
            >
              ▼
            </button>
          </div>

          <span className="w-6 text-sm text-zinc-400">{String(index + 1).padStart(2, "0")}</span>

          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {lesson.title}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span>{lesson.durationMinutes} min</span>
              {lesson.type === "test" && <Badge>Test</Badge>}
              {lesson.isFreePreview && <Badge variant="brand">Free preview</Badge>}
              {lesson.locked && <Badge variant="locked">Locked</Badge>}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href={`/admin/lessons/${lesson.id}/edit`}
              className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-brand hover:text-brand dark:border-zinc-700 dark:text-zinc-400"
            >
              Edit
            </Link>
            <DeleteButton
              itemName={lesson.title}
              itemType="lesson"
              size="sm"
              onConfirm={deleteLesson.bind(null, lesson.id)}
            />
          </div>
        </div>
      ))}
      <p className="pt-2 text-xs text-zinc-400 dark:text-zinc-600">
        Reordering here is local to this session — persisting order requires a Prisma action.
      </p>
    </div>
  );
}
