import { z } from "zod";

export const questionFormSchema = z.object({
  text: z.string().trim().min(3, "Question text must be at least 3 characters").max(500),
  answers: z
    .array(z.string().trim().min(1, "Answer text is required").max(300))
    .length(4, "Exactly 4 answer options are required"),
  // A single index (not 4 independent booleans) makes "more than one correct
  // answer" structurally impossible rather than something to validate against.
  correctAnswerIndex: z.coerce.number().int().min(0).max(3),
});

export type QuestionFormInput = z.infer<typeof questionFormSchema>;
