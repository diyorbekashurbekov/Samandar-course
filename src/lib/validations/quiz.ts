import { z } from "zod";

export const quizFormSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(160),
  passingScore: z.coerce
    .number()
    .int()
    .min(0, "Passing score must be at least 0")
    .max(100, "Passing score can't exceed 100"),
});

export type QuizFormInput = z.infer<typeof quizFormSchema>;
