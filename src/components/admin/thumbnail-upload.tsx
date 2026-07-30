"use client";

import { useState } from "react";

// File storage isn't wired up yet — this only previews the picked image
// locally via an object URL. Swap the onChange handler for a real upload
// once storage (e.g. Supabase Storage) is implemented.
export function ThumbnailUpload({ defaultImageUrl }: { defaultImageUrl?: string | null }) {
  const [preview, setPreview] = useState<string | null>(defaultImageUrl ?? null);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Thumbnail</span>
      <label
        htmlFor="thumbnail"
        className="flex aspect-video w-full max-w-xs cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-dashed border-zinc-300 bg-zinc-50 text-zinc-400 transition hover:border-brand hover:text-brand dark:border-zinc-700 dark:bg-zinc-900"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- local object URL preview, not an optimizable remote image
          <img src={preview} alt="Course thumbnail preview" className="h-full w-full object-cover" />
        ) : (
          <>
            <span className="text-2xl">🖼️</span>
            <span className="text-sm">Click to upload an image</span>
          </>
        )}
      </label>
      <input
        id="thumbnail"
        name="thumbnail"
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            setPreview(URL.createObjectURL(file));
          }
        }}
      />
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Upload storage is not wired up yet — this preview is local only.
      </p>
    </div>
  );
}
