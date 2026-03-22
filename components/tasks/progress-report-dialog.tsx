"use client"

import { useState } from "react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { X, FileText, CheckCircle, AlertCircle } from "lucide-react"

interface ProgressReportDialogProps {
  todoId: string
  todoTitle: string
  onClose: () => void
  onSuccess: () => void
}

export function ProgressReportDialog({
  todoId,
  todoTitle,
  onClose,
  onSuccess,
}: ProgressReportDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    reportType: "PROGRESS_UPDATE",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.message.trim()) {
      toast.error("Please provide a message")
      return
    }

    setLoading(true)
    try {
      await api.submitTaskReport(todoId, formData)
      toast.success(
        formData.reportType === "COMPLETION_REPORT"
          ? "Task marked as complete!"
          : "Progress report submitted"
      )
      onSuccess()
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit report")
    } finally {
      setLoading(false)
    }
  }

  const reportTypeIcons = {
    PROGRESS_UPDATE: FileText,
    COMPLETION_REPORT: CheckCircle,
    ISSUE_REPORT: AlertCircle,
  }

  const Icon = reportTypeIcons[formData.reportType as keyof typeof reportTypeIcons]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl border bg-card shadow-lg">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-card-foreground">
              Submit Progress Report
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-muted"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4 rounded-lg bg-muted p-3">
            <p className="text-sm font-medium text-foreground">Task:</p>
            <p className="text-sm text-muted-foreground">{todoTitle}</p>
          </div>

          <div className="space-y-4">
            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Report Type <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.reportType}
                onChange={(e) =>
                  setFormData({ ...formData, reportType: e.target.value })
                }
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="PROGRESS_UPDATE">Progress Update</option>
                <option value="COMPLETION_REPORT">Task Completed</option>
                <option value="ISSUE_REPORT">Report Issue</option>
              </select>
              <p className="mt-1 text-xs text-muted-foreground">
                {formData.reportType === "PROGRESS_UPDATE" &&
                  "Share your current progress on this task"}
                {formData.reportType === "COMPLETION_REPORT" &&
                  "Mark this task as complete and provide a summary"}
                {formData.reportType === "ISSUE_REPORT" &&
                  "Report a problem or blocker you're facing"}
              </p>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Message <span className="text-destructive">*</span>
              </label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={
                  formData.reportType === "PROGRESS_UPDATE"
                    ? "Describe what you've accomplished and what's next..."
                    : formData.reportType === "COMPLETION_REPORT"
                    ? "Summarize what was completed..."
                    : "Describe the issue or blocker..."
                }
                rows={5}
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.message.trim()}
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
