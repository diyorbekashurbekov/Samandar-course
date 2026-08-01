import Link from "next/link";
import { CourseCard } from "@/components/course/course-card";
import { Hero } from "@/components/marketing/hero";
import { StatsSection } from "@/components/marketing/stats-section";
import { FeaturesSection } from "@/components/marketing/features-section";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { listPublishedCourses } from "@/lib/data/courses";

export default async function HomePage() {
  const courses = await listPublishedCourses();
  const featuredCourses = courses.slice(0, 3);

  const courseCount = courses.length;
  const lessonCount = courses.reduce((sum, course) => sum + course.lessonCount, 0);
  const learnerCount = courses.reduce((sum, course) => sum + course.enrolledCount, 0);

  return (
    <>
      <Hero />
      <StatsSection courseCount={courseCount} lessonCount={lessonCount} learnerCount={learnerCount} />
      <FeaturesSection />

      {featuredCourses.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-24 sm:py-28">
          <ScrollReveal className="mb-10 flex items-end justify-between">
            <div>
              <span className="text-xs font-medium tracking-wide text-brand uppercase">
                Catalog
              </span>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
                Featured courses
              </h2>
            </div>
            <Link
              href="/courses"
              className="hidden text-sm font-medium text-brand hover:underline sm:inline"
            >
              View all →
            </Link>
          </ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course, index) => (
              <ScrollReveal key={course.slug} delay={index * 0.08}>
                <CourseCard course={course} />
              </ScrollReveal>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/courses" className="text-sm font-medium text-brand hover:underline">
              View all courses →
            </Link>
          </div>
        </section>
      )}

      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
