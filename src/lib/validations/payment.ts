import { z } from "zod";

export const createPaymentOrderSchema = z.object({
  courseId: z.string().min(1, "Course is required."),
});

export const paymentIdSchema = z.string().min(1, "Payment is required.");

export type CreatePaymentOrderInput = z.infer<typeof createPaymentOrderSchema>;
