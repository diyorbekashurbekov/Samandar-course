"use client";

import { useState, type FormEvent } from "react";
import { FormField, fieldInputClass } from "@/components/admin/form-field";
import { Switch } from "@/components/ui/switch";
import type { LessonType } from "@/lib/mock-data";

export type LessonFormValues = {
  title: string;
  videoUrl: string;
  durationMinutes: number;
  type: LessonType;
  isFreePreview: boolean;
};

export function LessonForm({
  mode,
  defaultValues,
  onSubmit,
}: {
  mode: "create" | "edit";
  defaultValues?: Partial<LessonFormValues>;
  /** Wire up a Prisma server action here once lesson mutations are implemented. */
  onSubmit?: (values: LessonFormValues) => void | Promise<void>;
}) {
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [videoUrl, setVideoUrl] = useState(defaultValues?.videoUrl ?? "");
  const [durationMinutes, setDurationMinutes] = useState(defaultValues?.durationMinutes ?? 10);
  const [type, setType] = useState<LessonType>(defaultValues?.type ?? "video");
  const [isFreePreview, setIsFreePreview] = useState(defaultValues?.isFreePreview ?? false);
  const [justSaved, setJustSaved] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setJustSaved(false);
    await onSubmit?.({ title, videoUrl, durationMinutes, type, isFreePreview });
    setJustSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FormField label="Lesson title" htmlFor="title">
        <input
          id="title"
          className={fieldInputClass}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </FormField>

      <FormField
        label="Video URL"
        htmlFor="videoUrl"
        hint="Paste a hosted video link (YouTube, Vimeo, or storage URL)."
      >
        <input
          id="videoUrl"
          type="url"
          placeholder="https://"
          className={fieldInputClass}
          value={videoUrl}
          onChange={(event) => setVideoUrl(event.target.value)}
        />
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Type" htmlFor="type">
          <select
            id="type"
            className={fieldInputClass}
            value={type}
            onChange={(event) => setType(event.target.value as LessonType)}
          >
            <option value="video">Video</option>
            <option value="test">Test</option>
          </select>
        </FormField>
        <FormField label="Duration (minutes)" htmlFor="duration">
          <input
            id="duration"
            type="number"
            min={0}
            className={fieldInputClass}
            value={durationMinutes}
            onChange={(event) => setDurationMinutes(Number(event.target.value))}
          />
        </FormField>
      </div>

      <Switch
        checked={isFreePreview}
        onChange={setIsFreePreview}
        label="Allow free preview (accessible without enrollment)"
      />

      <div className="flex items-center gap-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <button
          type="submit"
          className="flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-medium text-white transition hover:bg-brand/90"
        >
          {mode === "create" ? "Create lesson" : "Save changes"}
        </button>
        {justSaved && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Saved locally — connect a Prisma action to persist this.
          </p>
        )}
      </div>
    </form>
  );
}
