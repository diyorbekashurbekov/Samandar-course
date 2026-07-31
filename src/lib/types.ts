// Shared shapes for course/lesson data used across marketing, dashboard, and
// admin UI. These mirror the Prisma models (see prisma/schema.prisma) but
// stay decoupled from Prisma's exact select/include shape so UI components
// don't need to know how the data was fetched.

import type {
  CourseLevel,
  CourseStatus,
  LessonType,
  VideoUploadStatus,
} from "@/generated/prisma/client";

export type { CourseLevel, CourseStatus, LessonType, VideoUploadStatus };

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
  videoPublicId: string | null;
  videoDurationSeconds: number | null;
  videoSizeBytes: number | null;
  videoUploadedAt: Date | null;
  videoUploadStatus: VideoUploadStatus;
  isFreePreview: boolean;
  locked: boolean;
  completed: boolean;
};

// --- Quiz (admin shape includes isCorrect; student shape never does — see
// src/lib/data/quizzes.ts, which doesn't even select isCorrect from the DB
// for the student path) ---

export type QuizAnswerAdmin = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type QuizQuestionAdmin = {
  id: string;
  quizId: string;
  text: string;
  order: number;
  answers: QuizAnswerAdmin[];
};

export type QuizAdmin = {
  id: string;
  lessonId: string;
  title: string;
  passingScore: number;
  questions: QuizQuestionAdmin[];
};

export type QuizQuestionWithContext = QuizQuestionAdmin & { lessonId: string };

export type QuizAnswerOption = {
  id: string;
  text: string;
};

export type QuizQuestionStudent = {
  id: string;
  text: string;
  order: number;
  answers: QuizAnswerOption[];
};

export type QuizStudent = {
  id: string;
  lessonId: string;
  title: string;
  passingScore: number;
  questions: QuizQuestionStudent[];
};
