"use client";

import { useState } from "react";
import type { Todo } from "@/lib/types";
import { X, Loader2 } from "lucide-react";

interface TodoFormProps {
  todo?: Todo | null;
  onSubmit: (data: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    category?: string;
    dueDate?: string;
  }) => Promise<void>;
  onClose: () => void;
}

/**
 * Convert a UTC ISO string from the backend into a value suitable for a
 * datetime-local input, which always works in the browser's LOCAL timezone.
 *
 * e.g. "2026-03-14T12:00:00Z" in UTC+2  →  "2026-03-14T14:00"
 */
function utcToLocalInput(utcString: string): string {
  const d = new Date(utcString);
  // Subtract the timezone offset to shift from UTC to local
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export function TodoForm({ todo, onSubmit, onClose }: TodoFormProps) {
  const [title, setTitle] = useState(todo?.title ?? "");
  const [description, setDescription] = useState(todo?.description ?? "");
  const [status, setStatus] = useState<"PENDING" | "IN_PROGRESS" | "DONE">(
    todo?.status ?? "PENDING",
  );
  const [priority, setPriority] = useState<"HIGH" | "MEDIUM" | "LOW">(
    todo?.priority ?? "MEDIUM",
  );
  const [category, setCategory] = useState(todo?.category ?? "");
  const [dueDate, setDueDate] = useState(
    todo?.dueDate ? utcToLocalInput(todo.dueDate) : "",
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({
        title,
        description: description || undefined,
        status,
        priority,
        category: category || undefined,
        // datetime-local value has no timezone → browser treats it as local →
        // toISOString() correctly converts local → UTC before sending to backend
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      });
      // onClose() will unmount this component, so we must NOT call setIsLoading
      // afterwards — simply close and let the component disappear.
      onClose();
    } catch {
      // Error toast is shown by the parent; just re-enable the button here.
      setIsLoading(false);
    }
  };

  /** Close only when the user clicks the dark backdrop itself, not the card. */
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-lg rounded-xl border bg-card shadow-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4 shrink-0">
          <h2 className="text-lg font-semibold text-card-foreground">
            {todo ? "Edit Task" : "New Task"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 p-5 overflow-y-auto"
        >
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="todo-title"
              className="text-sm font-medium text-card-foreground"
            >
              Title <span className="text-destructive">*</span>
            </label>
            <input
              id="todo-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="todo-description"
              className="text-sm font-medium text-card-foreground"
            >
              Description
            </label>
            <textarea
              id="todo-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              rows={3}
              className="rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="todo-status"
                className="text-sm font-medium text-card-foreground"
              >
                Status
              </label>
              <select
                id="todo-status"
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as "PENDING" | "IN_PROGRESS" | "DONE",
                  )
                }
                className="rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="todo-priority"
                className="text-sm font-medium text-card-foreground"
              >
                Priority
              </label>
              <select
                id="todo-priority"
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as "HIGH" | "MEDIUM" | "LOW")
                }
                className="rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          {/* Category + Due date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="todo-category"
                className="text-sm font-medium text-card-foreground"
              >
                Category
              </label>
              <input
                id="todo-category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Work, Personal"
                className="rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="todo-due"
                className="text-sm font-medium text-card-foreground"
              >
                Due date
              </label>
              <input
                id="todo-due"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-2 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {todo ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
