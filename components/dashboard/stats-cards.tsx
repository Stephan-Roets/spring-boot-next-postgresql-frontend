"use client"

import type { TodoStats } from "@/lib/types"
import { ListTodo, Clock, Loader2, CheckCircle2 } from "lucide-react"

interface StatsCardsProps {
  stats: TodoStats | null
  isLoading: boolean
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const cards = [
    {
      label: "Total Tasks",
      value: stats?.total ?? 0,
      icon: ListTodo,
      color: "text-primary bg-primary/10",
    },
    {
      label: "Pending",
      value: stats?.pending ?? 0,
      icon: Clock,
      color: "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/20",
    },
    {
      label: "In Progress",
      value: stats?.inProgress ?? 0,
      icon: Loader2,
      color: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/20",
    },
    {
      label: "Completed",
      value: stats?.done ?? 0,
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/20",
    },
  ]

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl border bg-card"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              {card.label}
            </p>
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.color}`}
            >
              <card.icon className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold text-card-foreground">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  )
}
