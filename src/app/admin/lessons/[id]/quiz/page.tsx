import Link from "next/link";
import { notFound } from "next/navigation";
import { QuizForm } from "@/components/admin/quiz-form";
import { QuestionList } from "@/components/admin/question-list";
import { DeleteButton } from "@/components/admin/delete-button";
import { createQuiz, deleteQuiz, updateQuiz } from "@/lib/actions/quizzes";
import { getLessonById } from "@/lib/data/lessons";
import { getQuizForAdmin } from "@/lib/data/quizzes";

export default async function LessonQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = await getLessonById(id);

  if (!lesson) {
    notFound();
  }

  const quiz = await getQuizForAdmin(id);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Link
            href={`/admin/lessons/${id}/edit`}
            className="text-xs font-medium text-zinc-500 hover:text-brand dark:text-zinc-400"
          >
            ← Back to lesson
          </Link>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Quiz</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">For {lesson.title}</p>
        </div>
        {quiz && (
          <DeleteButton itemName={quiz.title} itemType="quiz" onConfirm={deleteQuiz.bind(null, quiz.id)} />
        )}
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        {quiz ? (
          <QuizForm
            mode="edit"
            defaultValues={{ title: quiz.title, passingScore: quiz.passingScore }}
            onSubmit={updateQuiz.bind(null, quiz.id)}
          />
        ) : (
          <QuizForm mode="create" onSubmit={createQuiz.bind(null, id)} />
        )}
      </div>

      {quiz && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Questions</h2>
            <Link
              href={`/admin/lessons/${id}/quiz/questions/new`}
              className="flex h-10 items-center justify-center rounded-full bg-brand px-4 text-sm font-medium text-white transition hover:bg-brand/90"
            >
              Add question
            </Link>
          </div>

          {quiz.questions.length > 0 ? (
            <QuestionList questions={quiz.questions} />
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              No questions yet. Add the first one to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
