"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog, type ConfirmDialogHandle } from "@/components/ui/confirm-dialog";
import { ProgressBar } from "@/components/progress/progress-bar";
import { VideoPlayer } from "@/components/lesson/video-player";
import {
  confirmVideoUpload,
  createVideoUploadTicket,
  deleteVideo,
  markVideoUploadFailed,
} from "@/lib/actions/video";
import { ALLOWED_VIDEO_EXTENSIONS, ALLOWED_VIDEO_MIME_TYPES, MAX_VIDEO_BYTES } from "@/lib/validations/video";
import { formatBytes, formatDuration } from "@/lib/format";
import type { VideoUploadStatus } from "@/lib/types";

type Phase = "idle" | "uploading" | "error";

type CloudinaryUploadResponse = {
  secure_url: string;
  public_id: string;
  duration?: number;
  bytes: number;
};

export function LessonVideoManager({
  lessonId,
  title,
  uploadStatus,
  durationSeconds,
  sizeBytes,
  uploadedAt,
  previewUrl,
}: {
  lessonId: string;
  title: string;
  uploadStatus: VideoUploadStatus;
  durationSeconds: number | null;
  sizeBytes: number | null;
  uploadedAt: Date | null;
  previewUrl: string | null;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const deleteDialogRef = useRef<ConfirmDialogHandle>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasVideo = uploadStatus === "READY" && !!previewUrl;

  function validateFile(file: File): string | null {
    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    const typeOk =
      ALLOWED_VIDEO_MIME_TYPES.includes(file.type) || ALLOWED_VIDEO_EXTENSIONS.includes(extension);
    if (!typeOk) {
      return "Only MP4, MOV, and WEBM videos are supported.";
    }
    if (file.size > MAX_VIDEO_BYTES) {
      return "Video is too large — the maximum size is 2 GB.";
    }
    return null;
  }

  function handlePickFile() {
    fileInputRef.current?.click();
  }

  async function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setPhase("uploading");
    setProgress(0);
    setErrorMessage(null);

    const ticket = await createVideoUploadTicket(lessonId);
    if (!ticket.success) {
      setPhase("error");
      setErrorMessage(ticket.error);
      toast.error(ticket.error);
      if (!hasVideo) await markVideoUploadFailed(lessonId);
      return;
    }

    const formData = new FormData();
    for (const [key, value] of Object.entries(ticket.fields)) {
      formData.append(key, String(value));
    }
    formData.append("file", file);

    try {
      const response = await uploadWithProgress(ticket.uploadUrl, formData, setProgress);
      const result = await confirmVideoUpload(lessonId, {
        videoUrl: response.secure_url,
        videoPublicId: response.public_id,
        durationSeconds: Math.round(response.duration ?? 0),
        sizeBytes: response.bytes,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success(hasVideo ? "Video replaced" : "Video uploaded");
      setPhase("idle");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed. Please try again.";
      setPhase("error");
      setErrorMessage(message);
      toast.error(message);
      if (!hasVideo) await markVideoUploadFailed(lessonId);
    }
  }

  async function handleDelete() {
    const result = await deleteVideo(lessonId);
    if (result.success) {
      toast.success("Video deleted");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
        className="sr-only"
        onChange={handleFileSelected}
      />

      {hasVideo && previewUrl && <VideoPlayer src={previewUrl} title={title} lessonId={lessonId} />}

      {phase === "uploading" && (
        <div className="flex flex-col gap-2">
          <ProgressBar value={progress} />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Uploading… {progress}%</p>
        </div>
      )}

      {phase === "error" && errorMessage && (
        <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
      )}

      {hasVideo ? (
        <>
          <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-xs text-zinc-500 dark:text-zinc-400">Duration</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                {formatDuration(durationSeconds)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500 dark:text-zinc-400">File size</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-50">{formatBytes(sizeBytes)}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs text-zinc-500 dark:text-zinc-400">Uploaded</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                {uploadedAt ? new Date(uploadedAt).toLocaleString() : "—"}
              </dd>
            </div>
          </dl>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePickFile}
              disabled={phase === "uploading"}
              className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-brand hover:text-brand disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-300"
            >
              Replace video
            </button>
            <button
              type="button"
              onClick={() => deleteDialogRef.current?.open()}
              disabled={phase === "uploading"}
              className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-900/50 dark:hover:bg-red-950/30"
            >
              Delete video
            </button>
          </div>
          <ConfirmDialog
            ref={deleteDialogRef}
            title="Delete this video?"
            description="This removes the uploaded video from the lesson. This action cannot be undone."
            confirmLabel="Delete"
            onConfirm={handleDelete}
          />
        </>
      ) : (
        <button
          type="button"
          onClick={handlePickFile}
          disabled={phase === "uploading"}
          className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 text-zinc-500 transition hover:border-brand hover:text-brand disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
        >
          <span className="text-2xl">🎬</span>
          <span className="text-sm font-medium">
            {phase === "uploading" ? "Uploading…" : "Click to upload a video"}
          </span>
          <span className="text-xs">MP4, MOV, or WEBM — up to 2 GB</span>
        </button>
      )}
    </div>
  );
}

function uploadWithProgress(
  url: string,
  formData: FormData,
  onProgress: (percent: number) => void,
): Promise<CloudinaryUploadResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new Error("Upload succeeded but the response couldn't be read."));
        }
      } else {
        reject(new Error(`Upload failed (${xhr.status}).`));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed. Check your connection and try again."));
    xhr.onabort = () => reject(new Error("Upload was cancelled."));

    xhr.send(formData);
  });
}
