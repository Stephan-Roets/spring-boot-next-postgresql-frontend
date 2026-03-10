"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { api } from "@/lib/api"
import Link from "next/link"
import { CheckCircle2, XCircle, Loader2, ListTodo } from "lucide-react"
import { Suspense } from "react"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  )
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("No verification token provided.")
      return
    }

    api
      .verifyEmail(token)
      .then((res) => {
        setStatus("success")
        setMessage(res.message)
      })
      .catch((err) => {
        setStatus("error")
        setMessage(err.message || "Verification failed. The link may have expired.")
      })
  }, [token])

  return (
    <div className="w-full max-w-md rounded-xl border bg-card p-8 text-center">
      {status === "loading" && (
        <>
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <h1 className="mt-4 text-xl font-bold text-card-foreground">
            Verifying your email...
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Please wait while we confirm your email address.
          </p>
        </>
      )}
      {status === "success" && (
        <>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-card-foreground">
            Email verified
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Continue to sign in
          </Link>
        </>
      )}
      {status === "error" && (
        <>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/20">
            <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-card-foreground">
            Verification failed
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
          <Link
            href="/signup"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Sign up again
          </Link>
        </>
      )}
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <ListTodo className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-foreground">TaskFlow</span>
      </div>
      <Suspense
        fallback={
          <div className="w-full max-w-md rounded-xl border bg-card p-8 text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </div>
  )
}
