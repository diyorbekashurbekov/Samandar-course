"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormField, fieldInputClass } from "@/components/admin/form-field";
import type { CreateQuizResult, MutationResult } from "@/lib/actions/quizzes";

export type QuizFormValues = {
  title: string;
  passingScore: number;
};

export function QuizForm({
  mode,
  defaultValues,
  onSubmit,
}: {
  mode: "create" | "edit";
  defaultValues?: Partial<QuizFormValues>;
  onSubmit: (values: QuizFormValues) => Promise<CreateQuizResult | MutationResult>;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [passingScore, setPassingScore] = useState(defaultValues?.passingScore ?? 50);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const result = await onSubmit({ title, passingScore });
    setPending(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(mode === "create" ? "Quiz created" : "Quiz updated");
    // Create and edit both happen on the same lesson quiz page (there's no
    // separate "new quiz" route), so always refresh in place rather than
    // redirecting like CourseForm/LessonForm do.
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FormField label="Quiz title" htmlFor="title">
        <input
          id="title"
          className={fieldInputClass}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </FormField>

      <FormField
        label="Passing score (%)"
        htmlFor="passingScore"
        hint="Minimum percentage a student needs to pass this quiz."
      >
        <input
          id="passingScore"
          type="number"
          min={0}
          max={100}
          className={fieldInputClass}
          value={passingScore}
          onChange={(event) => setPassingScore(Number(event.target.value))}
        />
      </FormField>

      <div className="flex items-center gap-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <button
          type="submit"
          disabled={pending}
          className="flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-medium text-white transition hover:bg-brand/90 disabled:opacity-60"
        >
          {pending ? "Saving..." : mode === "create" ? "Create quiz" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
