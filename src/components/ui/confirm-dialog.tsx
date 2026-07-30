"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";

export type ConfirmDialogHandle = {
  open: () => void;
  close: () => void;
};

export const ConfirmDialog = forwardRef<
  ConfirmDialogHandle,
  {
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
    onConfirm: () => void | Promise<void>;
  }
>(function ConfirmDialog(
  { title, description, confirmLabel = "Confirm", cancelLabel = "Cancel", destructive = true, onConfirm },
  ref,
) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
  }));

  return (
    <dialog
      ref={dialogRef}
      className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 text-left shadow-xl backdrop:bg-zinc-950/50 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={async () => {
            await onConfirm();
            dialogRef.current?.close();
          }}
          className={`rounded-full px-4 py-2 text-sm font-medium text-white transition ${
            destructive ? "bg-red-600 hover:bg-red-700" : "bg-brand hover:bg-brand/90"
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
});
