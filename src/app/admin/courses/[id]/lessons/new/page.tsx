import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonForm } from "@/components/admin/lesson-form";
import { createLesson } from "@/lib/actions/lessons";
import { getCourseById } from "@/lib/data/courses";

export default async function NewLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await getCourseById(id);

  if (!course) {
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Link
          href={`/admin/courses/${course.id}/lessons`}
          className="text-xs font-medium text-zinc-500 hover:text-brand dark:text-zinc-400"
        >
          ← Back to lessons
        </Link>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">New lesson</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">For {course.title}</p>
      </div>
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <LessonForm mode="create" courseId={course.id} onSubmit={createLesson.bind(null, course.id)} />
      </div>
    </div>
  );
}
