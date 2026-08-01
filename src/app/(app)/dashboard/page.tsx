import Link from "next/link";
import { auth } from "@/auth";
import { CourseCard } from "@/components/course/course-card";
import { listEnrolledCoursesForUser } from "@/lib/data/courses";
import { loadStudentProgress } from "@/lib/data/progress";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const enrolledCourses = userId ? await listEnrolledCoursesForUser(userId) : [];

  const progressByCourse = userId
    ? await Promise.all(
        enrolledCourses.map((course) => loadStudentProgress(course.id, userId)),
      )
    : [];

  const totalCompletedLessons = progressByCourse.reduce(
    (sum, progress) => sum + progress.completedLessons,
    0,
  );
  const scoredCourses = progressByCourse.filter((progress) => progress.averageQuizScore !== null);
  const averageQuizScore =
    scoredCourses.length === 0
      ? null
      : Math.round(
          scoredCourses.reduce((sum, progress) => sum + (progress.averageQuizScore ?? 0), 0) /
            scoredCourses.length,
        );

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
        <StatCard label="Lessons completed" value={totalCompletedLessons} />
        <StatCard
          label="Avg. quiz score"
          value={averageQuizScore ?? 0}
          suffix={averageQuizScore !== null ? "%" : ""}
        />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Continue learning
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {enrolledCourses.map((course, index) => {
            const progress = progressByCourse[index];
            return (
              <div key={course.slug} className="flex flex-col gap-2">
                <CourseCard course={course} />
                {progress?.currentLessonId && (
                  <Link
                    href={`/lessons/${progress.currentLessonId}`}
                    className="text-sm font-medium text-brand hover:underline"
                  >
                    Continue lesson →
                  </Link>
                )}
                {progress?.lastActivityAt && (
                  <p className="text-xs text-zinc-400 dark:text-zinc-600">
                    Last activity: {new Date(progress.lastActivityAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  suffix = "",
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        {value}
        {suffix}
      </p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
    </div>
  );
}
