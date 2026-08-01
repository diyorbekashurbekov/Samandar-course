import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { VideoPlayer } from "@/components/lesson/video-player";
import { LessonTabs } from "@/components/lesson/lesson-tabs";
import { QuizPlayer } from "@/components/lesson/quiz-player";
import { getLessonById } from "@/lib/data/lessons";
import { getQuizForStudent } from "@/lib/data/quizzes";
import { videoProvider } from "@/lib/video";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lesson = await getLessonById(id);

  if (!lesson) {
    notFound();
  }

  if (lesson.locked) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 py-24 text-center">
        <Badge variant="locked">Locked</Badge>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          {lesson.enrolled ? "Complete the previous lesson to unlock this one" : "Enroll in this course to unlock this lesson"}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {lesson.enrolled
            ? "Pass the previous lesson's quiz (if it has one) to move forward."
            : "This lesson isn't a free preview, and enrollment/payment isn't implemented yet."}
        </p>
      </div>
    );
  }

  const videoSrc =
    lesson.videoUploadStatus === "READY" && lesson.videoPublicId
      ? await videoProvider.getPlaybackUrl(lesson.videoPublicId)
      : null;

  const quiz = await getQuizForStudent(id);
  const hasQuiz = !!quiz && quiz.questions.length > 0;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          {lesson.title}
        </h1>
        {lesson.completed && <Badge variant="success">Completed</Badge>}
      </div>
      {videoSrc ? (
        <VideoPlayer src={videoSrc} title={lesson.title} lessonId={lesson.id} />
      ) : (
        <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-2xl bg-zinc-900 text-center">
          <span className="text-2xl">🎬</span>
          <p className="text-sm font-medium text-zinc-200">Video coming soon</p>
          <p className="text-xs text-zinc-500">
            The instructor hasn&apos;t uploaded a video for this lesson yet.
          </p>
        </div>
      )}
      {hasQuiz && quiz && <QuizPlayer quiz={quiz} />}
      <LessonTabs lessonType={lesson.type} />
    </div>
  );
}
