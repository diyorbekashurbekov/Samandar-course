import Link from "next/link";
import { CourseForm } from "@/components/admin/course-form";

export default function NewCoursePage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Link
          href="/admin/courses"
          className="text-xs font-medium text-zinc-500 hover:text-brand dark:text-zinc-400"
        >
          ← Back to courses
        </Link>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">New course</h1>
      </div>
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <CourseForm mode="create" />
      </div>
    </div>
  );
}
