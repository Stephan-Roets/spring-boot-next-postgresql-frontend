"use client"

import { useState, useEffect } from "react"
import type { User } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"
import { X } from "lucide-react"

interface UserEditFormProps {
  user: User | null
  open: boolean
  onClose: () => void
  onSave: (id: string, data: Partial<User>) => Promise<void>
}

export function UserEditForm({ user, open, onClose, onSave }: UserEditFormProps) {
  const { isAdmin } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    department: "",
    bio: "",
    role: "USER" as User["role"],
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        department: user.department || "",
        bio: user.bio || "",
        role: user.role,
      })
    }
  }, [user])

  if (!open || !user) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSave(user.id, formData)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClassName =
    "w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 mx-4 w-full max-w-lg rounded-xl border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-card-foreground">
            Edit User
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="edit-name" className="mb-1.5 block text-sm font-medium text-foreground">
                  Full Name
                </label>
                <input
                  id="edit-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputClassName}
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-email" className="mb-1.5 block text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClassName}
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-phone" className="mb-1.5 block text-sm font-medium text-foreground">
                  Phone
                </label>
                <input
                  id="edit-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={inputClassName}
                  placeholder="e.g. +1 (555) 123-4567"
                />
              </div>
              <div>
                <label htmlFor="edit-address" className="mb-1.5 block text-sm font-medium text-foreground">
                  Address
                </label>
                <input
                  id="edit-address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={inputClassName}
                  placeholder="City, State"
                />
              </div>
              <div>
                <label htmlFor="edit-department" className="mb-1.5 block text-sm font-medium text-foreground">
                  Department
                </label>
                <input
                  id="edit-department"
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className={inputClassName}
                  placeholder="e.g. Engineering"
                />
              </div>
              <div>
                <label htmlFor="edit-bio" className="mb-1.5 block text-sm font-medium text-foreground">
                  Bio
                </label>
                <textarea
                  id="edit-bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className={`${inputClassName} min-h-[80px] resize-none`}
                  placeholder="A short bio..."
                />
              </div>
              {isAdmin && (
                <div>
                  <label htmlFor="edit-role" className="mb-1.5 block text-sm font-medium text-foreground">
                    Role
                  </label>
                  <select
                    id="edit-role"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as User["role"] })
                    }
                    className={inputClassName}
                  >
                    <option value="USER">User</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Only admins can change user roles.
                  </p>
                </div>
              )}
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
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
