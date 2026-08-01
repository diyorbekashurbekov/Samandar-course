import { CountUp } from "@/components/marketing/count-up";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";

export function StatsSection({
  courseCount,
  lessonCount,
  learnerCount,
}: {
  courseCount: number;
  lessonCount: number;
  learnerCount: number;
}) {
  const stats = [
    { label: "Courses available", value: courseCount },
    { label: "Lessons to learn from", value: lessonCount },
    { label: "Active learners", value: learnerCount },
  ];

  return (
    <section className="border-y border-zinc-200 bg-surface-muted dark:border-zinc-800">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-14 sm:grid-cols-3">
        {stats.map((stat, index) => (
          <ScrollReveal key={stat.label} delay={index * 0.08} className="text-center">
            <p className="font-display text-4xl text-zinc-900 sm:text-5xl dark:text-zinc-50">
              <CountUp value={stat.value} />
            </p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
