import Link from "next/link";
import { notFound } from "next/navigation";
import { QuestionForm } from "@/components/admin/question-form";
import { createQuestion } from "@/lib/actions/questions";
import { getLessonById } from "@/lib/data/lessons";
import { getQuizForAdmin } from "@/lib/data/quizzes";

export default async function NewQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = await getLessonById(id);
  if (!lesson) {
    notFound();
  }

  const quiz = await getQuizForAdmin(id);
  if (!quiz) {
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Link
          href={`/admin/lessons/${id}/quiz`}
          className="text-xs font-medium text-zinc-500 hover:text-brand dark:text-zinc-400"
        >
          ← Back to quiz
        </Link>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">New question</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">For {quiz.title}</p>
      </div>
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <QuestionForm mode="create" lessonId={id} onSubmit={createQuestion.bind(null, quiz.id)} />
      </div>
    </div>
  );
}
