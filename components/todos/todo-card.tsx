"use client"

import type { Todo } from "@/lib/types"
import { format } from "date-fns"
import { Pencil, Trash2, Calendar, Tag } from "lucide-react"

interface TodoCardProps {
  todo: Todo
  onEdit: (todo: Todo) => void
  onDelete: (id: string) => void
}

const statusStyles: Record<string, string> = {
  PENDING:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
  IN_PROGRESS:
    "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  DONE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
}

const priorityStyles: Record<string, string> = {
  HIGH: "border-l-red-500",
  MEDIUM: "border-l-amber-500",
  LOW: "border-l-emerald-500",
}

export function TodoCard({ todo, onEdit, onDelete }: TodoCardProps) {
  return (
    <div
      className={`rounded-xl border border-l-4 bg-card p-4 transition-shadow hover:shadow-md ${priorityStyles[todo.priority]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3
            className={`text-sm font-semibold text-card-foreground ${
              todo.status === "DONE" ? "line-through opacity-60" : ""
            }`}
          >
            {todo.title}
          </h3>
          {todo.description && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {todo.description}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${statusStyles[todo.status]}`}
            >
              {todo.status.replace("_", " ")}
            </span>
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {todo.priority}
            </span>
            {todo.category && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Tag className="h-3 w-3" />
                {todo.category}
              </span>
            )}
            {todo.dueDate && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {format(new Date(todo.dueDate), "MMM d, yyyy")}
              </span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => onEdit(todo)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Edit task"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            aria-label="Delete task"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
