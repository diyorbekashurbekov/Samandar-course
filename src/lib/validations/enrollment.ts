import { z } from "zod";

export const courseIdSchema = z.string().min(1, "Course is required.");

export const createEnrollmentSchema = z.object({
  courseId: courseIdSchema,
  paymentProvider: z.string().trim().min(1).max(50).default("manual"),
  paymentReference: z.string().trim().max(255).nullable().optional(),
});

export type CreateEnrollmentInput = z.infer<typeof createEnrollmentSchema>;
