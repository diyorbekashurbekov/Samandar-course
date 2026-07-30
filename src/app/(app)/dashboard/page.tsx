import { auth } from "@/auth";
import { CourseCard } from "@/components/course/course-card";
import { mockCourses } from "@/lib/mock-data";

export default async function DashboardPage() {
  const session = await auth();
  const enrolledCourses = mockCourses.filter((course) => typeof course.progress === "number");

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">Pick up where you left off.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Enrolled courses" value={enrolledCourses.length} />
        <StatCard label="Lessons completed" value={12} />
        <StatCard label="Hours learned" value={6} />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Continue learning
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {enrolledCourses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{value}</p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
    </div>
  );
}
