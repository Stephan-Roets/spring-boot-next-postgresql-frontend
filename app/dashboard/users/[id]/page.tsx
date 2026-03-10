"use client"

import { useState, useEffect, useCallback, use } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import type { User } from "@/lib/types"
import { RoleGuard } from "@/components/shared/role-guard"
import { toast } from "sonner"
import { format } from "date-fns"
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building2,
  Shield,
  Calendar,
  Save,
  Trash2,
} from "lucide-react"

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  return (
    <RoleGuard allowedRoles={["MANAGER", "ADMIN"]}>
      <UserDetailContent userId={id} />
    </RoleGuard>
  )
}

function UserDetailContent({ userId }: { userId: string }) {
  const router = useRouter()
  const { isAdmin } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
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

  const fetchUser = useCallback(async () => {
    try {
      const data = await api.getUserById(userId)
      setUser(data)
      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        department: data.department || "",
        bio: data.bio || "",
        role: data.role,
      })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load user")
      router.push("/dashboard/users")
    } finally {
      setIsLoading(false)
    }
  }, [userId, router])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await api.updateUser(userId, formData)
      toast.success("User updated successfully")
      router.push("/dashboard/users")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update user")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return
    try {
      await api.deleteUser(userId)
      toast.success("User deleted")
      router.push("/dashboard/users")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete user")
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) return null

  const inputClassName =
    "w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/users")}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Edit User
            </h1>
            <p className="text-sm text-muted-foreground">
              Editing profile for {user.name}
            </p>
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 rounded-lg border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="mt-6">
        {/* User card */}
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-4 pb-5 border-b">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <p className="font-semibold text-card-foreground">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {user.role}
                </span>
                <span className="text-xs text-muted-foreground">
                  Joined {format(new Date(user.createdAt), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="detail-name" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
                <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                Full Name
              </label>
              <input
                id="detail-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputClassName}
                required
              />
            </div>
            <div>
              <label htmlFor="detail-email" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                Email
              </label>
              <input
                id="detail-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputClassName}
                required
              />
            </div>
            <div>
              <label htmlFor="detail-phone" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                Phone
              </label>
              <input
                id="detail-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={inputClassName}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label htmlFor="detail-department" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                Department
              </label>
              <input
                id="detail-department"
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className={inputClassName}
                placeholder="e.g. Engineering"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="detail-address" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                Address
              </label>
              <input
                id="detail-address"
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={inputClassName}
                placeholder="City, State"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="detail-bio" className="mb-1.5 text-sm font-medium text-foreground block">
                Bio
              </label>
              <textarea
                id="detail-bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className={`${inputClassName} min-h-[80px] resize-none`}
                placeholder="A short bio..."
              />
            </div>
            {isAdmin && (
              <div>
                <label htmlFor="detail-role" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  Role
                </label>
                <select
                  id="detail-role"
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
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard/users")}
            className="rounded-lg border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  )
}
