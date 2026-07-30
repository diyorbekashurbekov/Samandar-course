import { CourseCard } from "@/components/course/course-card";
import { mockCourses } from "@/lib/mock-data";

export default function CoursesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">All courses</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          {mockCourses.length} courses available
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockCourses.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    </div>
  );
}
