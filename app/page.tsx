"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import {
  CheckCircle2,
  Users,
  Shield,
  ArrowRight,
  ListTodo,
} from "lucide-react"

export default function LandingPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <ListTodo className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">TaskFlow</span>
        </div>
        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Get started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-primary" />
            Role-based access control built in
          </div>
          <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Manage tasks with your team, effortlessly
          </h1>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
            TaskFlow gives your team a powerful task management system with
            role-based permissions. Users manage their tasks, managers oversee
            profiles, and admins have full control.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
            >
              Start for free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="flex w-full items-center justify-center rounded-lg border bg-card px-8 py-3 text-base font-semibold text-foreground transition-colors hover:bg-muted sm:w-auto"
            >
              Sign in to your account
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-24 grid max-w-4xl gap-6 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-card-foreground">
              Task Management
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Create, organize, and track todos with priorities, categories, due
              dates, and status tracking.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-card-foreground">
              Team Roles
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Three distinct roles: Users manage tasks, Managers edit user
              profiles, Admins have full control.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-card-foreground">
              Secure Auth
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              JWT-based authentication with email verification. Tokens expire in
              30 minutes for maximum security.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t px-6 py-6 text-center text-sm text-muted-foreground">
        TaskFlow - Secure task management for teams
      </footer>
    </div>
  )
}
