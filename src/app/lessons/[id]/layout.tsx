import { notFound } from "next/navigation";
import { LessonSidebar } from "@/components/lesson/lesson-sidebar";
import { getCourseById } from "@/lib/data/courses";
import { getLessonById, listLessonsForCourse } from "@/lib/data/lessons";

export default async function LessonLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lesson = await getLessonById(id);

  if (!lesson) {
    notFound();
  }

  const course = await getCourseById(lesson.courseId);

  if (!course) {
    notFound();
  }

  const lessons = await listLessonsForCourse(course.id);

  return (
    <div className="flex min-h-screen">
      <LessonSidebar courseSlug={course.slug} lessons={lessons} activeLessonId={id} />
      <main className="flex-1 bg-zinc-50 p-6 dark:bg-zinc-950">{children}</main>
    </div>
  );
}
