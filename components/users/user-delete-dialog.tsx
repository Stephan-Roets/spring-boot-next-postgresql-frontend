"use client"

import { useState } from "react"
import type { User } from "@/lib/types"
import { AlertTriangle, X } from "lucide-react"

interface UserDeleteDialogProps {
  user: User | null
  open: boolean
  onClose: () => void
  onConfirm: (id: string) => Promise<void>
}

export function UserDeleteDialog({
  user,
  open,
  onClose,
  onConfirm,
}: UserDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  if (!open || !user) return null

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onConfirm(user.id)
      onClose()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 mx-4 w-full max-w-md rounded-xl border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-card-foreground">
            Delete User
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-foreground">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{user.name}</span>? This action
                cannot be undone. All their tasks and data will be permanently
                removed.
              </p>
              <div className="mt-3 rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{user.email}</span>
                  {" / "}
                  {user.role}
                  {user.department ? ` / ${user.department}` : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete User"}
          </button>
        </div>
      </div>
    </div>
  )
}
