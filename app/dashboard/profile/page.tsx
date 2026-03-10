"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { format } from "date-fns"
import {
  UserIcon,
  Mail,
  Phone,
  MapPin,
  Building2,
  Shield,
  Calendar,
  Save,
  Pencil,
  X,
} from "lucide-react"

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    department: user?.department || "",
    bio: user?.bio || "",
  })

  if (!user) return null

  const handleEdit = () => {
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || "",
      department: user.department || "",
      bio: user.bio || "",
    })
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await api.updateCurrentUser(formData)
      await refreshUser()
      toast.success("Profile updated successfully")
      setIsEditing(false)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update profile"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClassName =
    "w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"

  const infoItems = [
    {
      icon: Mail,
      label: "Email",
      value: user.email,
      editable: false,
    },
    {
      icon: Phone,
      label: "Phone",
      value: user.phone,
      field: "phone",
      placeholder: "+1 (555) 123-4567",
    },
    {
      icon: MapPin,
      label: "Address",
      value: user.address,
      field: "address",
      placeholder: "City, State",
    },
    {
      icon: Building2,
      label: "Department",
      value: user.department,
      field: "department",
      placeholder: "e.g. Engineering",
    },
    {
      icon: Shield,
      label: "Role",
      value: user.role,
      editable: false,
    },
    {
      icon: Calendar,
      label: "Member Since",
      value: format(new Date(user.createdAt), "MMMM d, yyyy"),
      editable: false,
    },
  ]

  return (
    <div className="mx-auto max-w-3xl">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your personal information and preferences.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            <Pencil className="h-4 w-4" />
            Edit Profile
          </button>
        )}
      </div>

      <form onSubmit={handleSave}>
        {/* Avatar / Name section */}
        <div className="mt-6 rounded-xl border bg-card p-6">
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 text-center sm:text-left">
              {isEditing ? (
                <div>
                  <label
                    htmlFor="profile-name"
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    Full Name
                  </label>
                  <input
                    id="profile-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={inputClassName}
                    required
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-card-foreground">
                    {user.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                      {user.role}
                    </span>
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                        user.emailVerified
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                      }`}
                    >
                      {user.emailVerified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Details section */}
        <div className="mt-4 rounded-xl border bg-card p-6">
          <h3 className="mb-4 text-base font-semibold text-card-foreground">
            Personal Information
          </h3>
          <div className="flex flex-col gap-5">
            {infoItems.map((item) => {
              const isFieldEditable = isEditing && item.editable !== false && item.field
              return (
                <div
                  key={item.label}
                  className="flex items-start gap-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">
                      {item.label}
                    </p>
                    {isFieldEditable ? (
                      <input
                        type="text"
                        value={
                          formData[item.field as keyof typeof formData] || ""
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [item.field as string]: e.target.value,
                          })
                        }
                        placeholder={item.placeholder}
                        className={`mt-1 ${inputClassName}`}
                      />
                    ) : (
                      <p className="mt-0.5 text-sm text-foreground">
                        {item.value || (
                          <span className="text-muted-foreground">
                            Not set
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bio section */}
        <div className="mt-4 rounded-xl border bg-card p-6">
          <h3 className="mb-3 text-base font-semibold text-card-foreground">
            Bio
          </h3>
          {isEditing ? (
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              placeholder="Tell us a bit about yourself..."
              className={`${inputClassName} min-h-[100px] resize-none`}
            />
          ) : (
            <p className="text-sm text-foreground leading-relaxed">
              {user.bio || (
                <span className="text-muted-foreground">
                  No bio yet. Edit your profile to add one.
                </span>
              )}
            </p>
          )}
        </div>

        {/* Save/Cancel buttons */}
        {isEditing && (
          <div className="mt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
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
        )}
      </form>
    </div>
  )
}
