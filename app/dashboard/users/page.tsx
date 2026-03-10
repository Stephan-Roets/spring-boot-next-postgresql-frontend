"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import type { User } from "@/lib/types"
import { RoleGuard } from "@/components/shared/role-guard"
import { UserTable } from "@/components/users/user-table"
import { UserEditForm } from "@/components/users/user-edit-form"
import { UserDeleteDialog } from "@/components/users/user-delete-dialog"
import { toast } from "sonner"
import { Users, Search, Filter } from "lucide-react"

export default function UsersPage() {
  return (
    <RoleGuard allowedRoles={["MANAGER", "ADMIN"]}>
      <UsersContent />
    </RoleGuard>
  )
}

function UsersContent() {
  const { isAdmin } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("ALL")

  // Edit modal state
  const [editUser, setEditUser] = useState<User | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  // Delete modal state
  const [deleteUser, setDeleteUser] = useState<User | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const fetchUsers = useCallback(async () => {
    try {
      const data = await api.getAllUsers()
      setUsers(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to fetch users")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    let result = users
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.department && u.department.toLowerCase().includes(q))
      )
    }
    if (roleFilter !== "ALL") {
      result = result.filter((u) => u.role === roleFilter)
    }
    setFilteredUsers(result)
  }, [users, search, roleFilter])

  const handleEdit = (user: User) => {
    setEditUser(user)
    setEditOpen(true)
  }

  const handleDelete = (user: User) => {
    setDeleteUser(user)
    setDeleteOpen(true)
  }

  const handleSave = async (id: string, data: Partial<User>) => {
    try {
      await api.updateUser(id, data)
      toast.success("User updated successfully")
      fetchUsers()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update user")
      throw err
    }
  }

  const handleConfirmDelete = async (id: string) => {
    try {
      await api.deleteUser(id)
      toast.success("User deleted successfully")
      fetchUsers()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete user")
      throw err
    }
  }

  const roleCounts = {
    ALL: users.length,
    USER: users.filter((u) => u.role === "USER").length,
    MANAGER: users.filter((u) => u.role === "MANAGER").length,
    ADMIN: users.filter((u) => u.role === "ADMIN").length,
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isAdmin
            ? "View, edit, and manage all users in the system."
            : "View and edit user information."}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["ALL", "USER", "MANAGER", "ADMIN"] as const).map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`flex flex-col items-center rounded-xl border p-3 transition-colors ${
              roleFilter === role
                ? "border-primary bg-primary/5"
                : "bg-card hover:bg-muted/50"
            }`}
          >
            <span className="text-xl font-bold text-foreground">
              {roleCounts[role]}
            </span>
            <span className="text-xs text-muted-foreground">
              {role === "ALL" ? "All Users" : `${role.charAt(0)}${role.slice(1).toLowerCase()}s`}
            </span>
          </button>
        ))}
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border bg-background py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="ALL">All Roles</option>
            <option value="USER">User</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

      {/* User table */}
      <UserTable
        users={filteredUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Edit modal */}
      <UserEditForm
        user={editUser}
        open={editOpen}
        onClose={() => {
          setEditOpen(false)
          setEditUser(null)
        }}
        onSave={handleSave}
      />

      {/* Delete modal */}
      <UserDeleteDialog
        user={deleteUser}
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false)
          setDeleteUser(null)
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
