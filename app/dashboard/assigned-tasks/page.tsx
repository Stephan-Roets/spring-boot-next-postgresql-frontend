"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { Todo } from "@/lib/types"
import { TodoCard } from "@/components/todos/todo-card"
import { ProgressReportDialog } from "@/components/tasks/progress-report-dialog"
import { Inbox, FileText } from "lucide-react"
import { toast } from "sonner"

export default function AssignedTasksPage() {
  const [tasks, setTasks] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [reportingTask, setReportingTask] = useState<Todo | null>(null)

  const loadTasks = async () => {
    try {
      const data = await api.getAssignedToMe()
      setTasks(data)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load assigned tasks"
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return
    try {
      await api.deleteTodo(id)
      toast.success("Task deleted")
      setTasks(tasks.filter((t) => t.id !== id))
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete task")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Assigned to Me</h1>
          <p className="text-sm text-muted-foreground">
            Tasks that have been assigned to you by managers or admins
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl border bg-card"
            />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-16">
          <Inbox className="mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm font-medium text-muted-foreground">
            No tasks assigned to you
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            When someone assigns you a task, it will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <div key={task.id} className="space-y-2">
              <TodoCard
                todo={task}
                onEdit={() => {}}
                onDelete={handleDelete}
              />
              <button
                onClick={() => setReportingTask(task)}
                className="w-full flex items-center justify-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                <FileText className="h-4 w-4" />
                Submit Report
              </button>
            </div>
          ))}
        </div>
      )}

      {reportingTask && (
        <ProgressReportDialog
          todoId={reportingTask.id}
          todoTitle={reportingTask.title}
          onClose={() => setReportingTask(null)}
          onSuccess={loadTasks}
        />
      )}
    </div>
  )
}
