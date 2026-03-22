"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { Todo, TaskReport } from "@/lib/types"
import { AssignTaskDialog } from "@/components/tasks/assign-task-dialog"
import { FeedbackDialog } from "@/components/tasks/feedback-dialog"
import { UserPlus, MessageSquare, Calendar, User } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

export default function MyAssignmentsPage() {
  const [tasks, setTasks] = useState<Todo[]>([])
  const [selectedTask, setSelectedTask] = useState<Todo | null>(null)
  const [reports, setReports] = useState<TaskReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [feedbackReport, setFeedbackReport] = useState<TaskReport | null>(null)

  const loadTasks = async () => {
    try {
      const data = await api.getAssignedByMe()
      setTasks(data)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load assignments"
      )
    } finally {
      setIsLoading(false)
    }
  }

  const loadReports = async (todoId: string) => {
    try {
      const data = await api.getTaskReports(todoId)
      setReports(data)
    } catch (error) {
      toast.error("Failed to load reports")
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  useEffect(() => {
    if (selectedTask) {
      loadReports(selectedTask.id)
    }
  }, [selectedTask])

  const statusColor: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
    IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
    DONE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  }

  const reportTypeColor: Record<string, string> = {
    PROGRESS_UPDATE: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
    COMPLETION_REPORT: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
    ISSUE_REPORT: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Assignments</h1>
          <p className="text-sm text-muted-foreground">
            Tasks you've assigned to others and their progress
          </p>
        </div>
        <button
          onClick={() => setShowAssignDialog(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <UserPlus className="h-4 w-4" />
          Assign Task
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Tasks List */}
        <div className="rounded-xl border bg-card">
          <div className="border-b px-5 py-4">
            <h2 className="text-base font-semibold text-card-foreground">
              Assigned Tasks
            </h2>
          </div>
          {isLoading ? (
            <div className="flex flex-col gap-3 p-5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <UserPlus className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">
                No assignments yet
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Click "Assign Task" to delegate work to your team.
              </p>
            </div>
          ) : (
            <ul className="divide-y">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className={`cursor-pointer px-5 py-4 hover:bg-muted/50 ${
                    selectedTask?.id === task.id ? "bg-muted/50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-card-foreground">
                        {task.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${statusColor[task.status]}`}
                        >
                          {task.status.replace("_", " ")}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          {task.assignedToName}
                        </span>
                        {task.dueDate && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(task.dueDate), "MMM d")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Reports Panel */}
        <div className="rounded-xl border bg-card">
          <div className="border-b px-5 py-4">
            <h2 className="text-base font-semibold text-card-foreground">
              Progress Reports
            </h2>
          </div>
          {!selectedTask ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">
                Select a task to view reports
              </p>
            </div>
          ) : reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">
                No reports yet
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                The assignee hasn't submitted any progress reports.
              </p>
            </div>
          ) : (
            <ul className="divide-y max-h-[600px] overflow-y-auto">
              {reports.map((report) => (
                <li key={report.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span
                      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${reportTypeColor[report.reportType]}`}
                    >
                      {report.reportType.replace("_", " ")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(report.createdAt), "MMM d, h:mm a")}
                    </span>
                  </div>
                  <p className="text-sm text-foreground mb-2">{report.message}</p>
                  {report.feedbackMessage ? (
                    <div className="mt-3 rounded-lg bg-muted p-3">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Your Feedback:
                      </p>
                      <p className="text-sm text-foreground">{report.feedbackMessage}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => setFeedbackReport(report)}
                      className="mt-2 flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <MessageSquare className="h-3 w-3" />
                      Provide Feedback
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {showAssignDialog && (
        <AssignTaskDialog
          onClose={() => setShowAssignDialog(false)}
          onSuccess={loadTasks}
        />
      )}

      {feedbackReport && (
        <FeedbackDialog
          reportId={feedbackReport.id}
          reportMessage={feedbackReport.message}
          reporterName={feedbackReport.reporterName}
          onClose={() => setFeedbackReport(null)}
          onSuccess={() => {
            if (selectedTask) {
              loadReports(selectedTask.id)
            }
          }}
        />
      )}
    </div>
  )
}
