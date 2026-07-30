// Shared shapes for course/lesson data used across marketing, dashboard, and
// admin UI. These mirror the Prisma models (see prisma/schema.prisma) but
// stay decoupled from Prisma's exact select/include shape so UI components
// don't need to know how the data was fetched.

import type { CourseLevel, CourseStatus, LessonType } from "@/generated/prisma/client";

export type { CourseLevel, CourseStatus, LessonType };

export type CourseSummary = {
  id: string;
  slug: string;
  title: string;
  description: string;
  instructor: string;
  level: CourseLevel;
  status: CourseStatus;
  priceKzt: number;
  thumbnailUrl: string | null;
  lessonCount: number;
  enrolledCount: number;
  /** 0-100, only set for courses the current user is enrolled in. */
  progress?: number;
};

export type LessonSummary = {
  id: string;
  courseId: string;
  title: string;
  order: number;
  type: LessonType;
  durationMinutes: number;
  videoUrl: string;
  isFreePreview: boolean;
  locked: boolean;
  completed: boolean;
};
