import { ScrollReveal } from "@/components/marketing/scroll-reveal";

// Placeholder quotes for a pre-launch catalog — generic first name + role,
// no fabricated companies or photos standing in for real people.
const testimonials = [
  {
    initial: "A",
    name: "Aigerim K.",
    role: "Frontend track student",
    quote:
      "The sequential unlocking actually kept me honest — I couldn't skip ahead and pretend I understood something I didn't.",
  },
  {
    initial: "D",
    name: "Daniyar S.",
    role: "Backend track student",
    quote:
      "Being able to preview the first lesson before paying made the decision easy. Knew exactly what I was getting.",
  },
  {
    initial: "M",
    name: "Madina T.",
    role: "Design track student",
    quote:
      "Quiz feedback is instant and actually explains the right answer — small thing, but it's why I kept coming back.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 sm:py-28">
      <ScrollReveal className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-medium tracking-wide text-brand uppercase">
          Learners say
        </span>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          What it feels like to learn here
        </h2>
      </ScrollReveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-3">
        {testimonials.map((t, index) => (
          <ScrollReveal key={t.name} delay={index * 0.1}>
            <figure className="premium-shadow flex h-full flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <blockquote className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand to-accent-violet text-sm font-semibold text-white">
                  {t.initial}
                </span>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{t.name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
