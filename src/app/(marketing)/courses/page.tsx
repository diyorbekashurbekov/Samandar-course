import { CourseCard } from "@/components/course/course-card";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { listPublishedCourses } from "@/lib/data/courses";

export default async function CoursesPage() {
  const publishedCourses = await listPublishedCourses();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <ScrollReveal className="mb-12 flex flex-col gap-3">
        <span className="text-xs font-medium tracking-wide text-brand uppercase">Catalog</span>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          All courses
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          {publishedCourses.length} course{publishedCourses.length === 1 ? "" : "s"} available
        </p>
      </ScrollReveal>

      {publishedCourses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 py-20 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          No courses published yet — check back soon.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {publishedCourses.map((course, index) => (
            <ScrollReveal key={course.slug} delay={(index % 3) * 0.06}>
              <CourseCard course={course} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
