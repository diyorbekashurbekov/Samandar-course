import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <ScrollReveal>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-brand to-accent-violet px-8 py-16 text-center sm:py-20">
          <div
            className="animate-gradient pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(120deg, transparent, color-mix(in oklab, white 25%, transparent), transparent)",
              backgroundSize: "200% 200%",
            }}
            aria-hidden="true"
          />
          <div className="relative flex flex-col items-center gap-5">
            <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Ready to start learning something that sticks?
            </h2>
            <p className="max-w-md text-brand-foreground/90 text-white/85">
              Browse the catalog and try a free preview lesson — no payment required to get
              started.
            </p>
            <Link
              href="/courses"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-brand shadow-lg transition hover:bg-white/90"
            >
              Browse courses
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
