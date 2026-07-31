"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { videoProvider } from "@/lib/video";
import { confirmVideoUploadSchema, type ConfirmVideoUploadInput } from "@/lib/validations/video";

export type MutationResult = { success: true } | { success: false; error: string };
export type UploadTicketResult =
  | { success: true; uploadUrl: string; fields: Record<string, string | number> }
  | { success: false; error: string };

export async function createVideoUploadTicket(lessonId: string): Promise<UploadTicketResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "You must be signed in." };
  }

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, select: { id: true } });
  if (!lesson) {
    return { success: false, error: "Lesson not found." };
  }

  const ticket = await videoProvider.createUploadTicket({ folder: `coursehub/lessons/${lessonId}` });
  return { success: true, uploadUrl: ticket.uploadUrl, fields: ticket.fields };
}

export async function confirmVideoUpload(
  lessonId: string,
  input: ConfirmVideoUploadInput,
): Promise<MutationResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "You must be signed in." };
  }

  const parsed = confirmVideoUploadSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid upload data." };
  }

  const existing = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { videoPublicId: true },
  });
  if (!existing) {
    return { success: false, error: "Lesson not found." };
  }

  await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      videoUrl: parsed.data.videoUrl,
      videoPublicId: parsed.data.videoPublicId,
      videoDurationSeconds: parsed.data.durationSeconds,
      videoSizeBytes: BigInt(parsed.data.sizeBytes),
      videoUploadedAt: new Date(),
      videoUploadStatus: "READY",
    },
  });

  // The new video is already saved above, so if this replace cleanup fails
  // the lesson is still left with a fully working (new) video — only the
  // old Cloudinary asset is orphaned, never lesson data.
  if (existing.videoPublicId && existing.videoPublicId !== parsed.data.videoPublicId) {
    try {
      await videoProvider.deleteVideo(existing.videoPublicId);
    } catch {
      // Best-effort: the old asset is orphaned in Cloudinary but harmless.
    }
  }

  return { success: true };
}

export async function markVideoUploadFailed(lessonId: string): Promise<MutationResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "You must be signed in." };
  }

  await prisma.lesson.update({
    where: { id: lessonId },
    data: { videoUploadStatus: "FAILED" },
  });

  return { success: true };
}

export async function deleteVideo(lessonId: string): Promise<MutationResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "You must be signed in." };
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { videoPublicId: true },
  });
  if (!lesson) {
    return { success: false, error: "Lesson not found." };
  }

  if (lesson.videoPublicId) {
    try {
      await videoProvider.deleteVideo(lesson.videoPublicId);
    } catch {
      // Continue clearing the DB record even if the remote asset is already gone.
    }
  }

  await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      videoUrl: null,
      videoPublicId: null,
      videoDurationSeconds: null,
      videoSizeBytes: null,
      videoUploadedAt: null,
      videoUploadStatus: "NONE",
    },
  });

  return { success: true };
}
