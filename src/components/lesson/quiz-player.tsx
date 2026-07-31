"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ProgressBar } from "@/components/progress/progress-bar";
import { Badge } from "@/components/ui/badge";
import { submitQuiz, type QuizSubmissionResult } from "@/lib/actions/quizzes";
import type { QuizStudent } from "@/lib/types";

type Phase = "answering" | "review" | "result";
type SuccessResult = Extract<QuizSubmissionResult, { success: true }>;

export function QuizPlayer({ quiz }: { quiz: QuizStudent }) {
  const [phase, setPhase] = useState<Phase>("answering");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SuccessResult | null>(null);

  const totalQuestions = quiz.questions.length;
  const currentQuestion = quiz.questions[currentIndex];
  const answeredCount = Object.keys(selected).length;
  const allAnswered = answeredCount === totalQuestions;

  function selectAnswer(questionId: string, answerId: string) {
    setSelected((prev) => ({ ...prev, [questionId]: answerId }));
  }

  function goTo(index: number) {
    setCurrentIndex(index);
    setPhase("answering");
  }

  async function handleSubmit() {
    setSubmitting(true);
    const response = await submitQuiz(quiz.id, { answers: selected });
    setSubmitting(false);

    if (!response.success) {
      toast.error(response.error);
      return;
    }

    setResult(response);
    setPhase("result");
  }

  function handleRetake() {
    setPhase("answering");
    setCurrentIndex(0);
    setSelected({});
    setResult(null);
  }

  if (phase === "result" && result) {
    return (
      <div className="flex flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col items-center gap-2 text-center">
          <Badge variant={result.passed ? "success" : "danger"}>
            {result.passed ? "Passed" : "Not passed"}
          </Badge>
          <p className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
            {result.score} / {result.total}
          </p>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">{result.percentage}%</p>
        </div>

        <div className="flex flex-col gap-4">
          {result.results.map((item, index) => (
            <div
              key={item.questionId}
              className="flex flex-col gap-2 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {index + 1}. {item.questionText}
                </p>
                <Badge variant={item.isCorrect ? "success" : "danger"}>
                  {item.isCorrect ? "Correct" : "Wrong"}
                </Badge>
              </div>
              <div className="flex flex-col gap-1">
                {item.answers.map((answer) => {
                  const isSelected = answer.id === item.selectedAnswerId;
                  const isCorrectAnswer = answer.id === item.correctAnswerId;
                  return (
                    <div
                      key={answer.id}
                      className={`rounded-lg border px-3 py-2 text-sm ${
                        isCorrectAnswer
                          ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : isSelected
                            ? "border-red-300 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                            : "border-zinc-200 text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {answer.text}
                      {isCorrectAnswer && " ✓"}
                      {isSelected && !isCorrectAnswer && " (your answer)"}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleRetake}
          className="self-start rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-brand hover:text-brand dark:border-zinc-700 dark:text-zinc-300"
        >
          Retake quiz
        </button>
      </div>
    );
  }

  if (phase === "review") {
    return (
      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Review your answers</h3>
        <div className="flex flex-col gap-2">
          {quiz.questions.map((question, index) => {
            const answerId = selected[question.id];
            const answerText = question.answers.find((answer) => answer.id === answerId)?.text;
            return (
              <button
                key={question.id}
                type="button"
                onClick={() => goTo(index)}
                className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 px-4 py-3 text-left text-sm transition hover:border-brand dark:border-zinc-800"
              >
                <span className="text-zinc-900 dark:text-zinc-50">
                  {index + 1}. {question.text}
                </span>
                <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                  {answerText ?? "Not answered"}
                </span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-medium text-white transition hover:bg-brand/90 disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit quiz"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span>{answeredCount} answered</span>
        </div>
        <ProgressBar value={((currentIndex + 1) / totalQuestions) * 100} />
      </div>

      <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50">{currentQuestion.text}</p>

      <div className="flex flex-col gap-2">
        {currentQuestion.answers.map((answer) => (
          <label
            key={answer.id}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition ${
              selected[currentQuestion.id] === answer.id
                ? "border-brand bg-brand/5 text-zinc-900 dark:text-zinc-50"
                : "border-zinc-200 text-zinc-700 hover:border-brand dark:border-zinc-800 dark:text-zinc-300"
            }`}
          >
            <input
              type="radio"
              name={currentQuestion.id}
              checked={selected[currentQuestion.id] === answer.id}
              onChange={() => selectAnswer(currentQuestion.id, answer.id)}
              className="h-4 w-4 shrink-0 accent-brand"
            />
            {answer.text}
          </label>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => goTo(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-brand hover:text-brand disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300"
        >
          Previous
        </button>
        {currentIndex < totalQuestions - 1 ? (
          <button
            type="button"
            onClick={() => goTo(currentIndex + 1)}
            className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand/90"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setPhase("review")}
            disabled={!allAnswered}
            className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand/90 disabled:opacity-40"
          >
            Review answers
          </button>
        )}
      </div>
      {!allAnswered && currentIndex === totalQuestions - 1 && (
        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
          Answer all questions to continue to review.
        </p>
      )}
    </div>
  );
}
