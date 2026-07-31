"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { questionFormSchema, type QuestionFormInput } from "@/lib/validations/question";

export type CreateQuestionResult =
  | { success: true; questionId: string }
  | { success: false; error: string };
export type MutationResult = { success: true } | { success: false; error: string };

export async function createQuestion(
  quizId: string,
  input: QuestionFormInput,
): Promise<CreateQuestionResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "You must be signed in." };
  }

  const parsed = questionFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const quiz = await prisma.quiz.findUnique({ where: { id: quizId }, select: { id: true } });
  if (!quiz) {
    return { success: false, error: "Quiz not found." };
  }

  const lastQuestion = await prisma.question.findFirst({
    where: { quizId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const question = await prisma.question.create({
    data: {
      quizId,
      text: parsed.data.text,
      order: (lastQuestion?.order ?? 0) + 1,
      answers: {
        create: parsed.data.answers.map((text, index) => ({
          text,
          isCorrect: index === parsed.data.correctAnswerIndex,
        })),
      },
    },
  });

  return { success: true, questionId: question.id };
}

export async function updateQuestion(
  questionId: string,
  input: QuestionFormInput,
): Promise<MutationResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "You must be signed in." };
  }

  const parsed = questionFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  // Replacing all 4 answers atomically is simpler and safer than diffing
  // against the previous set, and keeps the "exactly 4, exactly 1 correct"
  // invariant trivially true after every edit.
  await prisma.$transaction([
    prisma.answer.deleteMany({ where: { questionId } }),
    prisma.question.update({ where: { id: questionId }, data: { text: parsed.data.text } }),
    ...parsed.data.answers.map((text, index) =>
      prisma.answer.create({
        data: { questionId, text, isCorrect: index === parsed.data.correctAnswerIndex },
      }),
    ),
  ]);

  return { success: true };
}

export async function deleteQuestion(questionId: string): Promise<MutationResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "You must be signed in." };
  }

  await prisma.question.delete({ where: { id: questionId } });
  return { success: true };
}
