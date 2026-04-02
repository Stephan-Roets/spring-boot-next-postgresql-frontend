"use client"

import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Menu, Moon, Sun, LogOut } from "lucide-react"

interface HeaderProps {
  onMenuClick: () => void
}

export function DashboardHeader({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Welcome back, {user?.name?.split(" ")[0]}
          </h2>
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Toggle theme"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </button>
        <div className="hidden items-center gap-2 rounded-lg border bg-muted/50 px-3 py-1.5 sm:flex">
          <span className="text-xs font-medium text-foreground">
            {user?.name}
          </span>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-semibold text-primary">
            {user?.role}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          aria-label="Logout"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden text-sm sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}
