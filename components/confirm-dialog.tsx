"use client"

import { Button } from "@/components/ui/button"

interface ConfirmationDialogProps {
  open: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  isProcessing?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmationDialog({
  open,
  title = "Confirm action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isProcessing = false,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-xl">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{title}</p>
          <h2 className="text-2xl font-semibold">Are you sure?</h2>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
            {cancelText}
          </Button>
          <Button
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? "Deleting..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
