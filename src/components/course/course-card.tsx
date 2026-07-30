import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/progress/progress-bar";
import type { CourseSummary } from "@/lib/types";

export function CourseCard({ course }: { course: CourseSummary }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-brand/15 to-brand/5 text-sm font-medium text-brand">
        Course thumbnail
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="brand">{course.level}</Badge>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {course.lessonCount} lessons
          </span>
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-brand dark:text-zinc-50">
          {course.title}
        </h3>
        <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
          {course.description}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">By {course.instructor}</p>
      </div>
      {typeof course.progress === "number" ? (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <ProgressBar value={course.progress} />
        </div>
      ) : (
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          {course.priceKzt.toLocaleString("ru-RU")} тг
        </p>
      )}
    </Link>
  );
}
