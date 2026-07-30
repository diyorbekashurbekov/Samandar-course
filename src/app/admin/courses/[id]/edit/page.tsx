import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseForm } from "@/components/admin/course-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { getCourseById } from "@/lib/mock-data";

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = getCourseById(id);

  if (!course) {
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Link
            href="/admin/courses"
            className="text-xs font-medium text-zinc-500 hover:text-brand dark:text-zinc-400"
          >
            ← Back to courses
          </Link>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Edit course</h1>
        </div>
        <DeleteButton itemName={course.title} itemType="course" />
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <CourseForm
          mode="edit"
          defaultValues={{
            title: course.title,
            slug: course.slug,
            description: course.description,
            level: course.level,
            priceKzt: course.priceKzt,
            status: course.status,
            thumbnailUrl: course.thumbnailUrl,
          }}
        />
      </div>

      <Link
        href={`/admin/courses/${course.id}/lessons`}
        className="text-sm font-medium text-brand hover:underline"
      >
        Manage lessons →
      </Link>
    </div>
  );
}
