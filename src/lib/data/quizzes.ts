import { prisma } from "@/lib/prisma";
import type { QuizAdmin, QuizQuestionWithContext, QuizStudent } from "@/lib/types";

export async function getQuizForAdmin(lessonId: string): Promise<QuizAdmin | null> {
  const quiz = await prisma.quiz.findUnique({
    where: { lessonId },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: { answers: true },
      },
    },
  });
  if (!quiz) return null;

  return {
    id: quiz.id,
    lessonId: quiz.lessonId,
    title: quiz.title,
    passingScore: quiz.passingScore,
    questions: quiz.questions.map((question) => ({
      id: question.id,
      quizId: question.quizId,
      text: question.text,
      order: question.order,
      answers: question.answers.map((answer) => ({
        id: answer.id,
        text: answer.text,
        isCorrect: answer.isCorrect,
      })),
    })),
  };
}

export async function getQuizForStudent(lessonId: string): Promise<QuizStudent | null> {
  const quiz = await prisma.quiz.findUnique({
    where: { lessonId },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: {
          // isCorrect is never selected here — it's not just stripped
          // afterwards, it never leaves the database for this query.
          answers: { select: { id: true, text: true } },
        },
      },
    },
  });
  if (!quiz) return null;

  return {
    id: quiz.id,
    lessonId: quiz.lessonId,
    title: quiz.title,
    passingScore: quiz.passingScore,
    questions: quiz.questions.map((question) => ({
      id: question.id,
      text: question.text,
      order: question.order,
      answers: question.answers.map((answer) => ({ id: answer.id, text: answer.text })),
    })),
  };
}

export async function getQuestionById(id: string): Promise<QuizQuestionWithContext | null> {
  const question = await prisma.question.findUnique({
    where: { id },
    include: { answers: true, quiz: { select: { lessonId: true } } },
  });
  if (!question) return null;

  return {
    id: question.id,
    quizId: question.quizId,
    text: question.text,
    order: question.order,
    answers: question.answers.map((answer) => ({
      id: answer.id,
      text: answer.text,
      isCorrect: answer.isCorrect,
    })),
    lessonId: question.quiz.lessonId,
  };
}
