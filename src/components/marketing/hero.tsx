"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Decorative layer only — purely visual, never affects layout or content flow. */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-60 dark:opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(60% 50% at 50% 0%, color-mix(in oklab, var(--brand) 12%, transparent), transparent)",
          }}
        />
        <div className="animate-float absolute top-10 left-[8%] h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
        <div className="animate-float-delayed absolute top-24 right-[10%] h-80 w-80 rounded-full bg-accent-fuchsia/15 blur-3xl" />
        <div className="animate-float absolute -bottom-10 left-1/3 h-64 w-64 rounded-full bg-accent-violet/15 blur-3xl" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-28 text-center sm:py-36"
      >
        <motion.span
          variants={item}
          className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand ring-1 ring-inset ring-brand/15"
        >
          Learn without limits
        </motion.span>

        <motion.h1
          variants={item}
          className="max-w-3xl text-5xl leading-[1.05] font-semibold tracking-tight text-zinc-900 sm:text-6xl dark:text-zinc-50"
        >
          Master new skills with{" "}
          <span className="font-display text-brand italic">expert-led</span> courses
        </motion.h1>

        <motion.p
          variants={item}
          className="max-w-xl text-lg text-balance text-zinc-600 dark:text-zinc-400"
        >
          Video lessons, hands-on tests, and progress tracking — everything you need to go
          from beginner to job-ready.
        </motion.p>

        <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/courses"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_8px_24px_-8px_var(--brand)] transition hover:bg-brand/90 hover:shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_12px_32px_-8px_var(--brand)]"
          >
            Browse courses
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="#features"
            className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 transition hover:border-brand hover:text-brand dark:border-zinc-700 dark:text-zinc-300"
          >
            See how it works
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
