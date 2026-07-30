import Link from "next/link";
import { CourseCard } from "@/components/course/course-card";
import { mockCourses } from "@/lib/mock-data";

export default function HomePage() {
  const featuredCourses = mockCourses
    .filter((course) => course.status === "PUBLISHED")
    .slice(0, 3);

  return (
    <>
      <section className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-24 text-center">
        <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
          Learn without limits
        </span>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
          Master new skills with expert-led courses
        </h1>
        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Video lessons, hands-on tests, and progress tracking — everything you need to go
          from beginner to job-ready.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/courses"
            className="rounded-full bg-brand px-6 py-3 text-sm font-medium text-white transition hover:bg-brand/90"
          >
            Browse courses
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 transition hover:border-brand hover:text-brand dark:border-zinc-700 dark:text-zinc-300"
          >
            Sign in
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Featured courses
          </h2>
          <Link href="/courses" className="text-sm font-medium text-brand hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCourses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </section>
    </>
  );
}
