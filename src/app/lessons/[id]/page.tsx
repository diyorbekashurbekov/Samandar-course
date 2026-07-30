import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { VideoPlayer } from "@/components/lesson/video-player";
import { LessonTabs } from "@/components/lesson/lesson-tabs";
import { getLessonById } from "@/lib/mock-data";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lesson = getLessonById(id);

  if (!lesson) {
    notFound();
  }

  if (lesson.locked) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 py-24 text-center">
        <Badge variant="locked">Locked</Badge>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Complete previous lessons to unlock this one
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Lesson locking will be enforced by enrollment/progress rules once implemented.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          {lesson.title}
        </h1>
        {lesson.completed && <Badge variant="success">Completed</Badge>}
      </div>
      <VideoPlayer title={lesson.title} />
      <LessonTabs lessonType={lesson.type} />
    </div>
  );
}
