import { z } from "zod";

export const courseFormSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(120),
  slug: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers, and hyphens"),
  description: z.string().trim().max(2000).optional().default(""),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  priceKzt: z.coerce.number().int().min(0, "Price must be zero or more"),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type CourseFormInput = z.infer<typeof courseFormSchema>;
