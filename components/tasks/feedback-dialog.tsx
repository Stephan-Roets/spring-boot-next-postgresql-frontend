"use client"

import { useState } from "react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { X, MessageSquare } from "lucide-react"

interface FeedbackDialogProps {
  reportId: string
  reportMessage: string
  reporterName: string
  onClose: () => void
  onSuccess: () => void
}

export function FeedbackDialog({
  reportId,
  reportMessage,
  reporterName,
  onClose,
  onSuccess,
}: FeedbackDialogProps) {
  const [loading, setLoading] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!feedbackMessage.trim()) {
      toast.error("Please provide feedback")
      return
    }

    setLoading(true)
    try {
      await api.provideFeedback(reportId, feedbackMessage)
      toast.success("Feedback provided successfully")
      onSuccess()
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to provide feedback")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl border bg-card shadow-lg">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-card-foreground">
              Provide Feedback
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
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Report from {reporterName}:
            </p>
            <p className="text-sm text-foreground">{reportMessage}</p>
          </div>

          <div className="space-y-4">
            {/* Feedback Message */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Your Feedback <span className="text-destructive">*</span>
              </label>
              <textarea
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Provide guidance, suggestions, or acknowledgment..."
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
              disabled={loading || !feedbackMessage.trim()}
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
