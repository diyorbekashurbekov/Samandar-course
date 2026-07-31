"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormField, fieldInputClass } from "@/components/admin/form-field";
import { Switch } from "@/components/ui/switch";
import type { LessonType } from "@/lib/types";
import type { CreateLessonResult, MutationResult } from "@/lib/actions/lessons";

export type LessonFormValues = {
  title: string;
  durationMinutes: number;
  type: LessonType;
  isFreePreview: boolean;
};

export function LessonForm({
  mode,
  courseId,
  defaultValues,
  onSubmit,
}: {
  mode: "create" | "edit";
  /** Required for "create" mode so the form can redirect back to this course's lesson list. */
  courseId?: string;
  defaultValues?: Partial<LessonFormValues>;
  onSubmit: (values: LessonFormValues) => Promise<CreateLessonResult | MutationResult>;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [durationMinutes, setDurationMinutes] = useState(defaultValues?.durationMinutes ?? 10);
  const [type, setType] = useState<LessonType>(defaultValues?.type ?? "video");
  const [isFreePreview, setIsFreePreview] = useState(defaultValues?.isFreePreview ?? false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const result = await onSubmit({ title, durationMinutes, type, isFreePreview });
    setPending(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(mode === "create" ? "Lesson created" : "Lesson updated");
    if (mode === "create" && courseId) {
      router.push(`/admin/courses/${courseId}/lessons`);
    } else {
      router.refresh();
    }
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
          disabled={pending}
          className="flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-medium text-white transition hover:bg-brand/90 disabled:opacity-60"
        >
          {pending ? "Saving..." : mode === "create" ? "Create lesson" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
