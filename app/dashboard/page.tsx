"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import type { TodoStats, Todo } from "@/lib/types"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { format } from "date-fns"
import { Clock, AlertTriangle } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<TodoStats | null>(null)
  const [recentTodos, setRecentTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, todosData] = await Promise.all([
          api.getTodoStats(),
          api.getTodos(),
        ])
        setStats(statsData)
        setRecentTodos(todosData.slice(0, 5))
      } catch {
        // Backend may not be running - show empty state
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const statusColor: Record<string, string> = {
    PENDING:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
    IN_PROGRESS:
      "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
    DONE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  }

  const priorityIcon: Record<string, string> = {
    HIGH: "text-red-500",
    MEDIUM: "text-amber-500",
    LOW: "text-emerald-500",
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          {"Here's an overview of your task activity, "}
          {user?.name?.split(" ")[0]}.
        </p>
      </div>

      <StatsCards stats={stats} isLoading={isLoading} />

      <div className="rounded-xl border bg-card">
        <div className="border-b px-5 py-4">
          <h2 className="text-base font-semibold text-card-foreground">
            Recent Tasks
          </h2>
        </div>
        {isLoading ? (
          <div className="flex flex-col gap-3 p-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        ) : recentTodos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">
              No tasks yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Create your first task from the Todos page.
            </p>
          </div>
        ) : (
          <ul className="divide-y">
            {recentTodos.map((todo) => (
              <li key={todo.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-card-foreground">
                    {todo.title}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${statusColor[todo.status]}`}
                    >
                      {todo.status.replace("_", " ")}
                    </span>
                    {todo.dueDate && (
                      <span className="text-xs text-muted-foreground">
                        Due {format(new Date(todo.dueDate), "MMM d")}
                      </span>
                    )}
                  </div>
                </div>
                <AlertTriangle
                  className={`h-4 w-4 shrink-0 ${priorityIcon[todo.priority]}`}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
