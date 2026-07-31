import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonForm } from "@/components/admin/lesson-form";
import { LessonVideoManager } from "@/components/admin/lesson-video-manager";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteLesson, updateLesson } from "@/lib/actions/lessons";
import { getCourseById } from "@/lib/data/courses";
import { getLessonById } from "@/lib/data/lessons";
import { videoProvider } from "@/lib/video";

export default async function EditLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = await getLessonById(id);

  if (!lesson) {
    notFound();
  }

  const course = await getCourseById(lesson.courseId);
  const lessonsHref = course ? `/admin/courses/${course.id}/lessons` : "/admin/courses";

  // Admin routes are already auth-gated, so the preview always resolves a
  // signed URL here regardless of the viewer-relative `locked` flag (which
  // only applies to the student-facing player).
  const previewUrl =
    lesson.videoUploadStatus === "READY" && lesson.videoPublicId
      ? await videoProvider.getPlaybackUrl(lesson.videoPublicId)
      : null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Link
            href={lessonsHref}
            className="text-xs font-medium text-zinc-500 hover:text-brand dark:text-zinc-400"
          >
            ← Back to lessons
          </Link>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Edit lesson</h1>
          {course && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">For {course.title}</p>
          )}
        </div>
        <DeleteButton
          itemName={lesson.title}
          itemType="lesson"
          redirectTo={lessonsHref}
          onConfirm={deleteLesson.bind(null, lesson.id)}
        />
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <LessonForm
          mode="edit"
          defaultValues={{
            title: lesson.title,
            durationMinutes: lesson.durationMinutes,
            type: lesson.type,
            isFreePreview: lesson.isFreePreview,
          }}
          onSubmit={updateLesson.bind(null, lesson.id)}
        />
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Video</h2>
        <LessonVideoManager
          lessonId={lesson.id}
          title={lesson.title}
          uploadStatus={lesson.videoUploadStatus}
          durationSeconds={lesson.videoDurationSeconds}
          sizeBytes={lesson.videoSizeBytes}
          uploadedAt={lesson.videoUploadedAt}
          previewUrl={previewUrl}
        />
      </div>

      <Link
        href={`/admin/lessons/${lesson.id}/quiz`}
        className="text-sm font-medium text-brand hover:underline"
      >
        Manage quiz →
      </Link>
    </div>
  );
}
