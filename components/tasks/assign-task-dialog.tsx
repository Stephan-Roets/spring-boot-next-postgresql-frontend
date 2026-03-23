"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { User } from "@/lib/types"
import { toast } from "sonner"
import { X, UserPlus, Calendar, Tag } from "lucide-react"

interface AssignTaskDialogProps {
  onClose: () => void
  onSuccess: () => void
}

export function AssignTaskDialog({ onClose, onSuccess }: AssignTaskDialogProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [formData, setFormData] = useState({
    assigneeId: "",
    title: "",
    description: "",
    priority: "MEDIUM",
    category: "",
    dueDate: "",
  })

  useEffect(() => {
    loadAssignableUsers()
  }, [])

  const loadAssignableUsers = async () => {
    try {
      const data = await api.getAssignableUsers()
      setUsers(data)
    } catch (error) {
      toast.error("Failed to load users. You may not have permission to assign tasks.")
      onClose()
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.assigneeId) {
      toast.error("Please select a user to assign the task to")
      return
    }

    setLoading(true)
    try {
      // Convert datetime-local to ISO string if dueDate is provided
      const payload = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
      }
      await api.assignTask(payload)
      toast.success("Task assigned successfully")
      onSuccess()
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to assign task")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl border bg-card shadow-lg">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-card-foreground">
              Assign Task
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
          <div className="space-y-4">
            {/* Assignee Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Assign to <span className="text-destructive">*</span>
              </label>
              {loadingUsers ? (
                <div className="h-10 animate-pulse rounded-lg bg-muted" />
              ) : (
                <select
                  value={formData.assigneeId}
                  onChange={(e) =>
                    setFormData({ ...formData, assigneeId: e.target.value })
                  }
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select a user...</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role}) - {user.email}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Task Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Complete quarterly report"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Provide details about the task..."
                rows={3}
              />
            </div>

            {/* Priority and Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5" />
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Finance"
                />
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Due Date
              </label>
              <input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
              disabled={loading || !formData.assigneeId || !formData.title}
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Assigning..." : "Assign Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
