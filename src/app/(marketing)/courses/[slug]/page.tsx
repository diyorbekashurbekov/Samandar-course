import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { EnrollButton } from "@/components/course/enroll-button";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { auth } from "@/auth";
import { getCourseBySlug } from "@/lib/data/courses";
import { listLessonsForCourse } from "@/lib/data/lessons";
import { isUserEnrolled } from "@/lib/data/enrollment";
import { loadStudentProgress } from "@/lib/data/progress";
import { getLatestPaymentForCourse } from "@/lib/data/payment";

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

  const [lessons, enrolled, session, latestPayment] = await Promise.all([
    listLessonsForCourse(course.id),
    isUserEnrolled(course.id),
    auth(),
    getLatestPaymentForCourse(course.id),
  ]);

  const continueLessonId =
    enrolled && session?.user
      ? (await loadStudentProgress(course.id, session.user.id)).currentLessonId
      : null;
  const pendingPaymentId = latestPayment?.status === "PENDING" ? latestPayment.id : null;

  return (
    <div>
      <div className="border-b border-zinc-200 bg-surface-muted dark:border-zinc-800">
        <ScrollReveal className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-16">
          <Badge variant="brand">{course.level}</Badge>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {course.title}
          </h1>
          <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            {course.description}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Taught by{" "}
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {course.instructor}
            </span>{" "}
            · {course.enrolledCount.toLocaleString()} students enrolled
          </p>
        </ScrollReveal>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1fr_320px]">
        <ScrollReveal delay={0.05} className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Curriculum</h2>
          <ul className="premium-shadow flex flex-col divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
            {lessons.map((lesson) => (
              <li
                key={lesson.id}
                className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      lesson.completed
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : lesson.locked
                          ? "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                          : "bg-brand/10 text-brand"
                    }`}
                  >
                    {String(lesson.order).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {lesson.title}
                  </span>
                  {lesson.type === "test" && <Badge>Test</Badge>}
                  {lesson.isFreePreview && <Badge variant="success">Free preview</Badge>}
                </div>
                <div className="flex shrink-0 items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
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
        </ScrollReveal>

        <ScrollReveal delay={0.12}>
          <aside className="lg:sticky lg:top-24">
            <EnrollButton
              courseId={course.id}
              priceKzt={course.priceKzt}
              enrolled={enrolled}
              continueLessonId={continueLessonId}
              pendingPaymentId={pendingPaymentId}
            />
          </aside>
        </ScrollReveal>
      </div>
    </div>
  );
}
