import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonReorderList } from "@/components/admin/lesson-reorder-list";
import { getCourseById, getLessonsForCourse } from "@/lib/mock-data";

export default async function CourseLessonsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getCourseById(id);

  if (!course) {
    notFound();
  }

  const lessons = getLessonsForCourse(course.id);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Link
            href={`/admin/courses/${course.id}/edit`}
            className="text-xs font-medium text-zinc-500 hover:text-brand dark:text-zinc-400"
          >
            ← Back to {course.title}
          </Link>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Lessons</h1>
        </div>
        <Link
          href={`/admin/courses/${course.id}/lessons/new`}
          className="flex h-11 items-center justify-center rounded-full bg-brand px-5 text-sm font-medium text-white transition hover:bg-brand/90"
        >
          New lesson
        </Link>
      </div>

      {lessons.length > 0 ? (
        <LessonReorderList lessons={lessons} />
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          No lessons yet. Create the first one to get started.
        </div>
      )}
    </div>
  );
}
