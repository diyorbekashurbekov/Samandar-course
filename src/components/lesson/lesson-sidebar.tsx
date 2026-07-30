import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { LessonSummary } from "@/lib/types";

export function LessonSidebar({
  courseSlug,
  lessons,
  activeLessonId,
}: {
  courseSlug: string;
  lessons: LessonSummary[];
  activeLessonId: string;
}) {
  return (
    <aside className="hidden w-72 shrink-0 flex-col gap-1 overflow-y-auto border-r border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:flex">
      <Link
        href={`/courses/${courseSlug}`}
        className="mb-3 text-xs font-medium text-zinc-500 hover:text-brand dark:text-zinc-400"
      >
        ← Back to course
      </Link>
      {lessons.map((lesson) => {
        const isActive = lesson.id === activeLessonId;
        return (
          <Link
            key={lesson.id}
            href={lesson.locked ? "#" : `/lessons/${lesson.id}`}
            aria-disabled={lesson.locked}
            className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition ${
              isActive
                ? "bg-brand/10 text-brand"
                : lesson.locked
                  ? "cursor-not-allowed text-zinc-400 dark:text-zinc-600"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">
                {String(lesson.order).padStart(2, "0")}
              </span>
              {lesson.title}
            </span>
            {lesson.locked ? (
              <Badge variant="locked">Locked</Badge>
            ) : lesson.completed ? (
              <Badge variant="success">Done</Badge>
            ) : null}
          </Link>
        );
      })}
    </aside>
  );
}
