import { z } from "zod";

export const ALLOWED_VIDEO_MIME_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
export const ALLOWED_VIDEO_EXTENSIONS = [".mp4", ".mov", ".webm"];
export const MAX_VIDEO_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB

export const confirmVideoUploadSchema = z.object({
  videoUrl: z.string().trim().url(),
  videoPublicId: z.string().trim().min(1),
  durationSeconds: z.coerce.number().int().min(0),
  sizeBytes: z.coerce.number().int().min(1).max(MAX_VIDEO_BYTES, "Video is too large — the maximum size is 2 GB."),
});

export type ConfirmVideoUploadInput = z.infer<typeof confirmVideoUploadSchema>;
