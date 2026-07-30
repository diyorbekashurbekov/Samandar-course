"use client";

import { useRef } from "react";
import { ConfirmDialog, type ConfirmDialogHandle } from "@/components/ui/confirm-dialog";

export function DeleteButton({
  itemName,
  itemType,
  onConfirm,
  size = "md",
}: {
  itemName: string;
  itemType: string;
  onConfirm?: () => void | Promise<void>;
  size?: "sm" | "md";
}) {
  const dialogRef = useRef<ConfirmDialogHandle>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.open()}
        className={`rounded-full border border-red-200 font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30 ${
          size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
        }`}
      >
        Delete
      </button>
      <ConfirmDialog
        ref={dialogRef}
        title={`Delete this ${itemType}?`}
        description={`This will permanently delete "${itemName}". This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={async () => {
          // TODO: call the Prisma delete action once mutations are implemented
          await onConfirm?.();
        }}
      />
    </>
  );
}
