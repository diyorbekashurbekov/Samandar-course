// Placeholder data shaped like the future Prisma models (see prisma/schema.prisma).
// Swap these for real Prisma queries once course/lesson business logic is built —
// keep the shapes here in sync with the schema so that swap is mechanical.

export type LessonType = "video" | "test";

export type MockLesson = {
  id: string;
  courseSlug: string;
  title: string;
  order: number;
  type: LessonType;
  durationMinutes: number;
  locked: boolean;
  completed: boolean;
};

export type MockCourse = {
  slug: string;
  title: string;
  description: string;
  instructor: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  priceKzt: number;
  lessonCount: number;
  enrolledCount: number;
  /** 0-100, only set for courses the current user is enrolled in. */
  progress?: number;
};

export const mockCourses: MockCourse[] = [
  {
    slug: "javascript-fundamentals",
    title: "JavaScript Fundamentals",
    description:
      "Learn the core building blocks of JavaScript, from variables to async/await.",
    instructor: "Aziz Karimov",
    level: "Beginner",
    priceKzt: 29900,
    lessonCount: 24,
    enrolledCount: 1240,
    progress: 65,
  },
  {
    slug: "react-in-depth",
    title: "React in Depth",
    description: "Build production-ready UIs with React, hooks, and modern patterns.",
    instructor: "Dilnoza Yusupova",
    level: "Intermediate",
    priceKzt: 39900,
    lessonCount: 32,
    enrolledCount: 860,
    progress: 20,
  },
  {
    slug: "backend-with-nextjs",
    title: "Backend with Next.js",
    description: "Design APIs, auth, and databases using the Next.js App Router.",
    instructor: "Samandar Ashurbekov",
    level: "Advanced",
    priceKzt: 49900,
    lessonCount: 28,
    enrolledCount: 410,
  },
];

export const mockLessons: MockLesson[] = [
  {
    id: "1",
    courseSlug: "javascript-fundamentals",
    title: "Introduction & setup",
    order: 1,
    type: "video",
    durationMinutes: 8,
    locked: false,
    completed: true,
  },
  {
    id: "2",
    courseSlug: "javascript-fundamentals",
    title: "Variables and types",
    order: 2,
    type: "video",
    durationMinutes: 12,
    locked: false,
    completed: true,
  },
  {
    id: "3",
    courseSlug: "javascript-fundamentals",
    title: "Functions and scope",
    order: 3,
    type: "video",
    durationMinutes: 15,
    locked: false,
    completed: false,
  },
  {
    id: "4",
    courseSlug: "javascript-fundamentals",
    title: "Module quiz",
    order: 4,
    type: "test",
    durationMinutes: 10,
    locked: false,
    completed: false,
  },
  {
    id: "5",
    courseSlug: "javascript-fundamentals",
    title: "Async/await deep dive",
    order: 5,
    type: "video",
    durationMinutes: 18,
    locked: true,
    completed: false,
  },
];

export function getCourseBySlug(slug: string): MockCourse | undefined {
  return mockCourses.find((course) => course.slug === slug);
}

export function getLessonsForCourse(slug: string): MockLesson[] {
  return mockLessons
    .filter((lesson) => lesson.courseSlug === slug)
    .sort((a, b) => a.order - b.order);
}

export function getLessonById(id: string): MockLesson | undefined {
  return mockLessons.find((lesson) => lesson.id === id);
}
