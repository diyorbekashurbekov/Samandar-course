import { z } from "zod";

export const submitQuizSchema = z.object({
  // questionId -> answerId
  answers: z.record(z.string(), z.string()),
});

export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;
