import { prisma } from "@/lib/prisma";
import type { CourseSummary } from "@/lib/types";
import type { Prisma } from "@/generated/prisma/client";

const courseWithCounts = {
  include: {
    instructor: { select: { name: true, email: true } },
    _count: { select: { lessons: true, enrollments: true } },
  },
} satisfies Prisma.CourseDefaultArgs;

type CourseWithCounts = Prisma.CourseGetPayload<typeof courseWithCounts>;

function toCourseSummary(course: CourseWithCounts, progress?: number): CourseSummary {
  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description ?? "",
    instructor: course.instructor.name ?? course.instructor.email,
    level: course.level,
    status: course.status,
    priceKzt: course.priceKzt,
    thumbnailUrl: course.thumbnailUrl,
    lessonCount: course._count.lessons,
    enrolledCount: course._count.enrollments,
    progress,
  };
}

export async function listAllCourses(): Promise<CourseSummary[]> {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    ...courseWithCounts,
  });
  return courses.map((course) => toCourseSummary(course));
}

export async function listPublishedCourses(): Promise<CourseSummary[]> {
  const courses = await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    ...courseWithCounts,
  });
  return courses.map((course) => toCourseSummary(course));
}

export async function listEnrolledCoursesForUser(userId: string): Promise<CourseSummary[]> {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    orderBy: { enrolledAt: "desc" },
    include: { course: courseWithCounts },
  });
  // No lesson-progress tracking exists yet, so enrolled courses simply start at 0%.
  return enrollments.map((enrollment) => toCourseSummary(enrollment.course, 0));
}

export async function getCourseBySlug(slug: string): Promise<CourseSummary | null> {
  const course = await prisma.course.findUnique({ where: { slug }, ...courseWithCounts });
  return course ? toCourseSummary(course) : null;
}

export async function getCourseById(id: string): Promise<CourseSummary | null> {
  const course = await prisma.course.findUnique({ where: { id }, ...courseWithCounts });
  return course ? toCourseSummary(course) : null;
}
