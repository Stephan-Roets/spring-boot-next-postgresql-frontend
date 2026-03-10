"use client"

import { useAuth } from "@/contexts/auth-context"
import type { User } from "@/lib/types"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: User["role"][]
  fallback?: React.ReactNode
}

export function RoleGuard({
  children,
  allowedRoles,
  fallback,
}: RoleGuardProps) {
  const { user } = useAuth()

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      fallback || (
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-xl font-bold text-foreground">Access Denied</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You do not have permission to view this page.
          </p>
        </div>
      )
    )
  }

  return <>{children}</>
}
