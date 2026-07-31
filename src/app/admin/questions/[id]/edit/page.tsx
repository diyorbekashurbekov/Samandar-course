import Link from "next/link";
import { notFound } from "next/navigation";
import { QuestionForm } from "@/components/admin/question-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteQuestion, updateQuestion } from "@/lib/actions/questions";
import { getQuestionById } from "@/lib/data/quizzes";

export default async function EditQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const question = await getQuestionById(id);

  if (!question) {
    notFound();
  }

  const quizHref = `/admin/lessons/${question.lessonId}/quiz`;
  const correctAnswerIndex = question.answers.findIndex((answer) => answer.isCorrect);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Link
            href={quizHref}
            className="text-xs font-medium text-zinc-500 hover:text-brand dark:text-zinc-400"
          >
            ← Back to quiz
          </Link>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Edit question</h1>
        </div>
        <DeleteButton
          itemName={question.text}
          itemType="question"
          redirectTo={quizHref}
          onConfirm={deleteQuestion.bind(null, question.id)}
        />
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <QuestionForm
          mode="edit"
          defaultValues={{
            text: question.text,
            answers: question.answers.map((answer) => answer.text),
            correctAnswerIndex: correctAnswerIndex === -1 ? 0 : correctAnswerIndex,
          }}
          onSubmit={updateQuestion.bind(null, question.id)}
        />
      </div>
    </div>
  );
}
