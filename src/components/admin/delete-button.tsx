"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog, type ConfirmDialogHandle } from "@/components/ui/confirm-dialog";

type DeleteResult = { success: true } | { success: false; error: string };

export function DeleteButton({
  itemName,
  itemType,
  onConfirm,
  redirectTo,
  size = "md",
}: {
  itemName: string;
  itemType: string;
  onConfirm: () => Promise<DeleteResult>;
  /** Navigate here after a successful delete; otherwise the current page is refreshed. */
  redirectTo?: string;
  size?: "sm" | "md";
}) {
  const dialogRef = useRef<ConfirmDialogHandle>(null);
  const router = useRouter();

  async function handleConfirm() {
    const result = await onConfirm();
    if (result.success) {
      toast.success(`${itemType.charAt(0).toUpperCase()}${itemType.slice(1)} deleted`);
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.refresh();
      }
    } else {
      toast.error(result.error);
    }
  }

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
        onConfirm={handleConfirm}
      />
    </>
  );
}
