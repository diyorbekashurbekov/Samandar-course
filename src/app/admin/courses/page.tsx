import Link from "next/link";
import { CourseStatusBadge } from "@/components/admin/course-status-badge";
import { DeleteButton } from "@/components/admin/delete-button";
import { mockCourses } from "@/lib/mock-data";

export default function AdminCoursesPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Courses</h1>
          <p className="text-zinc-600 dark:text-zinc-400">{mockCourses.length} total courses</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="flex h-11 items-center justify-center rounded-full bg-brand px-5 text-sm font-medium text-white transition hover:bg-brand/90"
        >
          New course
        </Link>
      </div>

      <div className="flex flex-col divide-y divide-zinc-200 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
        {mockCourses.map((course) => (
          <div key={course.id} className="flex flex-wrap items-center gap-4 p-5">
            <div className="flex h-14 w-24 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand/15 to-brand/5 text-xs font-medium text-brand">
              Thumbnail
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {course.title}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                /{course.slug} · {course.lessonCount} lessons
              </p>
            </div>
            <CourseStatusBadge status={course.status} />
            <p className="w-28 shrink-0 text-right text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {course.priceKzt.toLocaleString("ru-RU")} тг
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={`/admin/courses/${course.id}/lessons`}
                className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-brand hover:text-brand dark:border-zinc-700 dark:text-zinc-400"
              >
                Lessons
              </Link>
              <Link
                href={`/admin/courses/${course.id}/edit`}
                className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-brand hover:text-brand dark:border-zinc-700 dark:text-zinc-400"
              >
                Edit
              </Link>
              <DeleteButton itemName={course.title} itemType="course" size="sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
