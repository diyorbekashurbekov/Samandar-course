import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { EnrollButton } from "@/components/course/enroll-button";
import { getCourseBySlug } from "@/lib/data/courses";
import { listLessonsForCourse } from "@/lib/data/lessons";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const lessons = await listLessonsForCourse(course.id);

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Badge variant="brand">{course.level}</Badge>
          <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
            {course.title}
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">{course.description}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Taught by{" "}
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {course.instructor}
            </span>{" "}
            · {course.enrolledCount.toLocaleString()} students enrolled
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Curriculum</h2>
          <ul className="flex flex-col divide-y divide-zinc-200 rounded-2xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {lessons.map((lesson) => (
              <li key={lesson.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-zinc-400">
                    {String(lesson.order).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {lesson.title}
                  </span>
                  {lesson.type === "test" && <Badge>Test</Badge>}
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                  <span>{lesson.durationMinutes} min</span>
                  {lesson.locked ? (
                    <Badge variant="locked">🔒 Locked</Badge>
                  ) : lesson.completed ? (
                    <Badge variant="success">✅ Completed</Badge>
                  ) : lesson.isCurrent ? (
                    <Badge variant="brand">▶ Current</Badge>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <aside>
        <EnrollButton priceKzt={course.priceKzt} />
      </aside>
    </div>
  );
}
