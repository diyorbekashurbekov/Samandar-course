"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormField, fieldInputClass } from "@/components/admin/form-field";
import type { CreateQuestionResult, MutationResult } from "@/lib/actions/questions";

export type QuestionFormValues = {
  text: string;
  answers: string[];
  correctAnswerIndex: number;
};

export function QuestionForm({
  mode,
  lessonId,
  defaultValues,
  onSubmit,
}: {
  mode: "create" | "edit";
  /** Required for "create" mode so the form can redirect back to the quiz page. */
  lessonId?: string;
  defaultValues?: Partial<QuestionFormValues>;
  onSubmit: (values: QuestionFormValues) => Promise<CreateQuestionResult | MutationResult>;
}) {
  const router = useRouter();
  const [text, setText] = useState(defaultValues?.text ?? "");
  const [answers, setAnswers] = useState<string[]>(defaultValues?.answers ?? ["", "", "", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(defaultValues?.correctAnswerIndex ?? 0);
  const [pending, setPending] = useState(false);

  function updateAnswer(index: number, value: string) {
    setAnswers((prev) => prev.map((answer, i) => (i === index ? value : answer)));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const result = await onSubmit({ text, answers, correctAnswerIndex });
    setPending(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(mode === "create" ? "Question created" : "Question updated");
    if (mode === "create" && lessonId) {
      router.push(`/admin/lessons/${lessonId}/quiz`);
    } else {
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FormField label="Question" htmlFor="text">
        <textarea
          id="text"
          rows={3}
          className={fieldInputClass}
          value={text}
          onChange={(event) => setText(event.target.value)}
          required
        />
      </FormField>

      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Answer options — select the correct one
        </span>
        {answers.map((answer, index) => (
          <label key={index} className="flex items-center gap-3">
            <input
              type="radio"
              name="correctAnswer"
              checked={correctAnswerIndex === index}
              onChange={() => setCorrectAnswerIndex(index)}
              className="h-4 w-4 shrink-0 accent-brand"
            />
            <input
              className={`${fieldInputClass} flex-1`}
              value={answer}
              onChange={(event) => updateAnswer(index, event.target.value)}
              placeholder={`Answer ${index + 1}`}
              required
            />
          </label>
        ))}
      </div>

      <div className="flex items-center gap-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <button
          type="submit"
          disabled={pending}
          className="flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-medium text-white transition hover:bg-brand/90 disabled:opacity-60"
        >
          {pending ? "Saving..." : mode === "create" ? "Create question" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
