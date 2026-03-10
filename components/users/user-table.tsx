"use client"

import type { User } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"
import { format } from "date-fns"
import { Pencil, Trash2, Shield, ShieldCheck, UserIcon } from "lucide-react"

interface UserTableProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

const roleIcons: Record<string, typeof UserIcon> = {
  USER: UserIcon,
  MANAGER: Shield,
  ADMIN: ShieldCheck,
}

const roleStyles: Record<string, string> = {
  USER: "bg-muted text-muted-foreground",
  MANAGER: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  ADMIN: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
}

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  const { isAdmin, user: currentUser } = useAuth()

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                User
              </th>
              <th className="hidden px-4 py-3 text-left font-semibold text-foreground md:table-cell">
                Email
              </th>
              <th className="hidden px-4 py-3 text-left font-semibold text-foreground lg:table-cell">
                Department
              </th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                Role
              </th>
              <th className="hidden px-4 py-3 text-left font-semibold text-foreground sm:table-cell">
                Status
              </th>
              <th className="hidden px-4 py-3 text-left font-semibold text-foreground lg:table-cell">
                Joined
              </th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((u) => {
              const RoleIcon = roleIcons[u.role]
              const isSelf = u.id === currentUser?.id
              return (
                <tr
                  key={u.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {u.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">
                          {u.name}
                          {isSelf && (
                            <span className="ml-1.5 text-xs text-muted-foreground">
                              (you)
                            </span>
                          )}
                        </p>
                        <p className="truncate text-xs text-muted-foreground md:hidden">
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <span className="text-muted-foreground">{u.email}</span>
                  </td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <span className="text-muted-foreground">
                      {u.department || "--"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${roleStyles[u.role]}`}
                    >
                      <RoleIcon className="h-3 w-3" />
                      {u.role}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span
                      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${
                        u.emailVerified
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                      }`}
                    >
                      {u.emailVerified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                    {format(new Date(u.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(u)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label={`Edit ${u.name}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      {isAdmin && !isSelf && (
                        <button
                          onClick={() => onDelete(u)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          aria-label={`Delete ${u.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {users.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <UserIcon className="h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            No users found
          </p>
        </div>
      )}
    </div>
  )
}
