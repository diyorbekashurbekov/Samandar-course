import Link from "next/link";
import { listAllCourses } from "@/lib/data/courses";

export default async function AdminOverviewPage() {
  const courses = await listAllCourses();
  const publishedCount = courses.filter((course) => course.status === "PUBLISHED").length;
  const draftCount = courses.length - publishedCount;

  const stats = [
    { label: "Total courses", value: String(courses.length) },
    { label: "Published", value: String(publishedCount) },
    { label: "Drafts", value: String(draftCount) },
    { label: "Pending Kaspi payments", value: "0" },
  ];

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Admin overview
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Manage courses, students, and payments.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              {stat.value}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Courses</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Create and edit courses, manage lessons, and control publish status.
            </p>
          </div>
          <Link
            href="/admin/courses"
            className="flex h-10 items-center justify-center rounded-full bg-brand px-5 text-sm font-medium text-white transition hover:bg-brand/90"
          >
            Manage courses
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        User management and Kaspi payment reconciliation tools will live here.
      </div>
    </div>
  );
}
