import { notFound } from "next/navigation";
import { LessonSidebar } from "@/components/lesson/lesson-sidebar";
import { getLessonById, getLessonsForCourse } from "@/lib/mock-data";

export default async function LessonLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lesson = getLessonById(id);

  if (!lesson) {
    notFound();
  }

  const lessons = getLessonsForCourse(lesson.courseSlug);

  return (
    <div className="flex min-h-screen">
      <LessonSidebar courseSlug={lesson.courseSlug} lessons={lessons} activeLessonId={id} />
      <main className="flex-1 bg-zinc-50 p-6 dark:bg-zinc-950">{children}</main>
    </div>
  );
}
