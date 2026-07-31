import { z } from "zod";

export const lessonFormSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(160),
  durationMinutes: z.coerce.number().int().min(0, "Duration must be zero or more"),
  type: z.enum(["video", "test"]),
  isFreePreview: z.boolean(),
});

export type LessonFormInput = z.infer<typeof lessonFormSchema>;
