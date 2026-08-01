import { PlayCircle, ListChecks, Lock, LineChart, Eye, ShieldCheck } from "lucide-react";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";

const features = [
  {
    icon: PlayCircle,
    title: "Structured video lessons",
    description: "Securely hosted, signed playback — every lesson streams reliably, no re-uploads.",
  },
  {
    icon: ListChecks,
    title: "Auto-graded quizzes",
    description: "Instant feedback after every attempt, with correct answers explained on the spot.",
  },
  {
    icon: Lock,
    title: "Sequential unlocking",
    description: "Lessons unlock as you actually pass each quiz — no skipping ahead unprepared.",
  },
  {
    icon: LineChart,
    title: "Real progress tracking",
    description: "Every completed lesson and quiz score is saved, so you always know where you left off.",
  },
  {
    icon: Eye,
    title: "Free previews",
    description: "Try the first lesson of any course before enrolling — no surprises.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Kaspi payments",
    description: "Enrollment unlocks automatically the moment your Kaspi payment is confirmed.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24 sm:py-28">
      <ScrollReveal className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-medium tracking-wide text-brand uppercase">
          Why CourseHub
        </span>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          Everything you need to actually{" "}
          <span className="font-display text-brand italic">finish</span> a course
        </h2>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Not just a video library — a system built around finishing what you start.
        </p>
      </ScrollReveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <ScrollReveal key={feature.title} delay={(index % 3) * 0.08}>
            <div className="group premium-shadow hover:premium-shadow-lg h-full rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                {feature.title}
              </h3>
              <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
