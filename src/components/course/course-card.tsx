"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/progress/progress-bar";
import type { CourseSummary } from "@/lib/types";

export function CourseCard({ course }: { course: CourseSummary }) {
  const initial = course.instructor.trim().charAt(0).toUpperCase() || "?";

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="h-full"
    >
      <Link
        href={`/courses/${course.slug}`}
        className="group premium-shadow hover:premium-shadow-lg flex h-full flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 transition-shadow duration-300 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-brand/15 via-accent-violet/10 to-accent-fuchsia/10">
          {course.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- thumbnail storage isn't wired to a configured remote-image domain yet
            <img
              src={course.thumbnailUrl}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <>
              <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-brand/10 blur-2xl" />
              <div className="absolute -bottom-8 -left-4 h-20 w-20 rounded-full bg-accent-fuchsia/10 blur-2xl" />
              <span className="font-display text-6xl text-brand/25 select-none">
                {course.title.trim().charAt(0).toUpperCase() || "C"}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="brand">{course.level}</Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {course.lessonCount} lessons
            </span>
          </div>
          <h3 className="text-lg font-semibold tracking-tight text-zinc-900 transition-colors group-hover:text-brand dark:text-zinc-50">
            {course.title}
          </h3>
          <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
            {course.description}
          </p>
          <div className="mt-auto flex items-center gap-2 pt-1 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-[10px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              {initial}
            </span>
            {course.instructor}
          </div>
        </div>

        {typeof course.progress === "number" ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            <ProgressBar value={course.progress} />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {course.priceKzt > 0 ? `${course.priceKzt.toLocaleString("ru-RU")} тг` : "Free"}
            </p>
            <span className="flex items-center gap-1 text-xs font-medium text-brand opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100">
              View course
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M2.5 6h7m0 0L6 2.5M9.5 6L6 9.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        )}
      </Link>
    </motion.div>
  );
}
