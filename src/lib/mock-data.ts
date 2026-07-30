// Placeholder data shaped like the future Prisma models (see prisma/schema.prisma).
// Swap these for real Prisma queries once course/lesson business logic is built —
// keep the shapes here in sync with the schema so that swap is mechanical.

export type LessonType = "video" | "test";
export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";
export type CourseStatus = "DRAFT" | "PUBLISHED";

export type MockLesson = {
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

export type MockCourse = {
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

export const mockCourses: MockCourse[] = [
  {
    id: "1",
    slug: "javascript-fundamentals",
    title: "JavaScript Fundamentals",
    description:
      "Learn the core building blocks of JavaScript, from variables to async/await.",
    instructor: "Aziz Karimov",
    level: "Beginner",
    status: "PUBLISHED",
    priceKzt: 29900,
    thumbnailUrl: null,
    lessonCount: 24,
    enrolledCount: 1240,
    progress: 65,
  },
  {
    id: "2",
    slug: "react-in-depth",
    title: "React in Depth",
    description: "Build production-ready UIs with React, hooks, and modern patterns.",
    instructor: "Dilnoza Yusupova",
    level: "Intermediate",
    status: "PUBLISHED",
    priceKzt: 39900,
    thumbnailUrl: null,
    lessonCount: 32,
    enrolledCount: 860,
    progress: 20,
  },
  {
    id: "3",
    slug: "backend-with-nextjs",
    title: "Backend with Next.js",
    description: "Design APIs, auth, and databases using the Next.js App Router.",
    instructor: "Samandar Ashurbekov",
    level: "Advanced",
    status: "PUBLISHED",
    priceKzt: 49900,
    thumbnailUrl: null,
    lessonCount: 28,
    enrolledCount: 410,
  },
  {
    id: "4",
    slug: "typescript-for-teams",
    title: "TypeScript for Teams",
    description: "Adopt TypeScript across a codebase without slowing your team down.",
    instructor: "Samandar Ashurbekov",
    level: "Intermediate",
    status: "DRAFT",
    priceKzt: 34900,
    thumbnailUrl: null,
    lessonCount: 0,
    enrolledCount: 0,
  },
];

export const mockLessons: MockLesson[] = [
  {
    id: "1",
    courseId: "1",
    title: "Introduction & setup",
    order: 1,
    type: "video",
    durationMinutes: 8,
    videoUrl: "https://example.com/videos/js-fundamentals/1-intro.mp4",
    isFreePreview: true,
    locked: false,
    completed: true,
  },
  {
    id: "2",
    courseId: "1",
    title: "Variables and types",
    order: 2,
    type: "video",
    durationMinutes: 12,
    videoUrl: "https://example.com/videos/js-fundamentals/2-variables.mp4",
    isFreePreview: false,
    locked: false,
    completed: true,
  },
  {
    id: "3",
    courseId: "1",
    title: "Functions and scope",
    order: 3,
    type: "video",
    durationMinutes: 15,
    videoUrl: "https://example.com/videos/js-fundamentals/3-functions.mp4",
    isFreePreview: false,
    locked: false,
    completed: false,
  },
  {
    id: "4",
    courseId: "1",
    title: "Module quiz",
    order: 4,
    type: "test",
    durationMinutes: 10,
    videoUrl: "",
    isFreePreview: false,
    locked: false,
    completed: false,
  },
  {
    id: "5",
    courseId: "1",
    title: "Async/await deep dive",
    order: 5,
    type: "video",
    durationMinutes: 18,
    videoUrl: "https://example.com/videos/js-fundamentals/5-async-await.mp4",
    isFreePreview: false,
    locked: true,
    completed: false,
  },
];

export function getCourseBySlug(slug: string): MockCourse | undefined {
  return mockCourses.find((course) => course.slug === slug);
}

export function getCourseById(id: string): MockCourse | undefined {
  return mockCourses.find((course) => course.id === id);
}

export function getLessonsForCourse(courseId: string): MockLesson[] {
  return mockLessons
    .filter((lesson) => lesson.courseId === courseId)
    .sort((a, b) => a.order - b.order);
}

export function getLessonById(id: string): MockLesson | undefined {
  return mockLessons.find((lesson) => lesson.id === id);
}
