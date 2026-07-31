"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { quizFormSchema, type QuizFormInput } from "@/lib/validations/quiz";
import { submitQuizSchema, type SubmitQuizInput } from "@/lib/validations/quiz-submission";

export type CreateQuizResult = { success: true; quizId: string } | { success: false; error: string };
export type MutationResult = { success: true } | { success: false; error: string };

export async function createQuiz(lessonId: string, input: QuizFormInput): Promise<CreateQuizResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "You must be signed in." };
  }

  const parsed = quizFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, select: { id: true } });
  if (!lesson) {
    return { success: false, error: "Lesson not found." };
  }

  const existing = await prisma.quiz.findUnique({ where: { lessonId }, select: { id: true } });
  if (existing) {
    return { success: false, error: "This lesson already has a quiz." };
  }

  const quiz = await prisma.quiz.create({
    data: {
      lessonId,
      title: parsed.data.title,
      passingScore: parsed.data.passingScore,
    },
  });

  return { success: true, quizId: quiz.id };
}

export async function updateQuiz(quizId: string, input: QuizFormInput): Promise<MutationResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "You must be signed in." };
  }

  const parsed = quizFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await prisma.quiz.update({
    where: { id: quizId },
    data: { title: parsed.data.title, passingScore: parsed.data.passingScore },
  });

  return { success: true };
}

export async function deleteQuiz(quizId: string): Promise<MutationResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "You must be signed in." };
  }

  await prisma.quiz.delete({ where: { id: quizId } });
  return { success: true };
}

export type QuizSubmissionResult =
  | {
      success: true;
      score: number;
      total: number;
      percentage: number;
      passed: boolean;
      results: Array<{
        questionId: string;
        questionText: string;
        selectedAnswerId: string | null;
        correctAnswerId: string | null;
        isCorrect: boolean;
        answers: Array<{ id: string; text: string }>;
      }>;
    }
  | { success: false; error: string };

export async function submitQuiz(quizId: string, input: SubmitQuizInput): Promise<QuizSubmissionResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "You must be signed in." };
  }

  const parsed = submitQuizSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid submission." };
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: { orderBy: { order: "asc" }, include: { answers: true } } },
  });

  if (!quiz) {
    return { success: false, error: "Quiz not found." };
  }

  if (quiz.questions.length === 0) {
    return { success: false, error: "This quiz has no questions." };
  }

  let correctCount = 0;
  const results = quiz.questions.map((question) => {
    const selectedAnswerId = parsed.data.answers[question.id] ?? null;
    const correctAnswer = question.answers.find((answer) => answer.isCorrect);
    const isCorrect = !!selectedAnswerId && selectedAnswerId === correctAnswer?.id;
    if (isCorrect) correctCount += 1;

    return {
      questionId: question.id,
      questionText: question.text,
      selectedAnswerId,
      correctAnswerId: correctAnswer?.id ?? null,
      isCorrect,
      answers: question.answers.map((answer) => ({ id: answer.id, text: answer.text })),
    };
  });

  const total = quiz.questions.length;
  const percentage = Math.round((correctCount / total) * 100);

  return {
    success: true,
    score: correctCount,
    total,
    percentage,
    passed: percentage >= quiz.passingScore,
    results,
  };
}
