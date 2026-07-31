"use client";

import Link from "next/link";
import { useState } from "react";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteQuestion } from "@/lib/actions/questions";
import type { QuizQuestionAdmin } from "@/lib/types";

// Reordering is local to this session (no persistence) — mirrors the same
// pattern as LessonReorderList.
export function QuestionList({ questions: initialQuestions }: { questions: QuizQuestionAdmin[] }) {
  const [questions, setQuestions] = useState(initialQuestions);

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= questions.length) return;
    const next = [...questions];
    [next[index], next[target]] = [next[target], next[index]];
    setQuestions(next);
  }

  return (
    <div className="flex flex-col gap-2">
      {questions.map((question, index) => (
        <div
          key={question.id}
          className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <span
            className="cursor-grab select-none text-zinc-300 dark:text-zinc-700"
            title="Drag to reorder (coming soon)"
          >
            ⠿
          </span>

          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() => move(index, -1)}
              disabled={index === 0}
              className="text-xs text-zinc-400 transition hover:text-brand disabled:opacity-30"
              aria-label="Move question up"
            >
              ▲
            </button>
            <button
              type="button"
              onClick={() => move(index, 1)}
              disabled={index === questions.length - 1}
              className="text-xs text-zinc-400 transition hover:text-brand disabled:opacity-30"
              aria-label="Move question down"
            >
              ▼
            </button>
          </div>

          <span className="w-6 text-sm text-zinc-400">{String(index + 1).padStart(2, "0")}</span>

          <p className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {question.text}
          </p>
          <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
            {question.answers.length} answers
          </span>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href={`/admin/questions/${question.id}/edit`}
              className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-brand hover:text-brand dark:border-zinc-700 dark:text-zinc-400"
            >
              Edit
            </Link>
            <DeleteButton
              itemName={question.text}
              itemType="question"
              size="sm"
              onConfirm={deleteQuestion.bind(null, question.id)}
            />
          </div>
        </div>
      ))}
      <p className="pt-2 text-xs text-zinc-400 dark:text-zinc-600">
        Reordering here is local to this session — persisting order requires a Prisma action.
      </p>
    </div>
  );
}
