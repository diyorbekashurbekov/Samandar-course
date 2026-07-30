"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormField, fieldInputClass } from "@/components/admin/form-field";
import { StatusToggle } from "@/components/admin/status-toggle";
import { ThumbnailUpload } from "@/components/admin/thumbnail-upload";
import type { CourseLevel, CourseStatus } from "@/lib/types";
import type { CreateCourseResult, MutationResult } from "@/lib/actions/courses";

export type CourseFormValues = {
  title: string;
  slug: string;
  description: string;
  level: CourseLevel;
  priceKzt: number;
  status: CourseStatus;
};

type CourseFormDefaultValues = Partial<CourseFormValues> & { thumbnailUrl?: string | null };

const levels: CourseLevel[] = ["Beginner", "Intermediate", "Advanced"];

export function CourseForm({
  mode,
  defaultValues,
  onSubmit,
}: {
  mode: "create" | "edit";
  defaultValues?: CourseFormDefaultValues;
  onSubmit: (values: CourseFormValues) => Promise<CreateCourseResult | MutationResult>;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [description, setDescription] = useState(defaultValues?.description ?? "");
  const [level, setLevel] = useState<CourseLevel>(defaultValues?.level ?? "Beginner");
  const [priceKzt, setPriceKzt] = useState(defaultValues?.priceKzt ?? 0);
  const [status, setStatus] = useState<CourseStatus>(defaultValues?.status ?? "DRAFT");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const result = await onSubmit({ title, slug, description, level, priceKzt, status });
    setPending(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(mode === "create" ? "Course created" : "Course updated");
    if (mode === "create" && "courseId" in result) {
      router.push(`/admin/courses/${result.courseId}/edit`);
    } else {
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Title" htmlFor="title">
          <input
            id="title"
            className={fieldInputClass}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </FormField>
        <FormField label="Slug" htmlFor="slug" hint="Used in the public course URL.">
          <input
            id="slug"
            className={fieldInputClass}
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            required
          />
        </FormField>
      </div>

      <FormField label="Description" htmlFor="description">
        <textarea
          id="description"
          rows={4}
          className={fieldInputClass}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Level" htmlFor="level">
          <select
            id="level"
            className={fieldInputClass}
            value={level}
            onChange={(event) => setLevel(event.target.value as CourseLevel)}
          >
            {levels.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Price (KZT)" htmlFor="price">
          <input
            id="price"
            type="number"
            min={0}
            step={100}
            className={fieldInputClass}
            value={priceKzt}
            onChange={(event) => setPriceKzt(Number(event.target.value))}
          />
        </FormField>
      </div>

      <ThumbnailUpload defaultImageUrl={defaultValues?.thumbnailUrl} />

      <FormField label="Status">
        <StatusToggle value={status} onChange={setStatus} />
      </FormField>

      <div className="flex items-center gap-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <button
          type="submit"
          disabled={pending}
          className="flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-medium text-white transition hover:bg-brand/90 disabled:opacity-60"
        >
          {pending ? "Saving..." : mode === "create" ? "Create course" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
