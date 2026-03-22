import type { User, Todo, LoginResponse, TodoStats } from "./types"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

class ApiClient {
  private getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("auth_token")
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken()
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "An unexpected error occurred",
      }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Auth
  async signup(data: {
    name: string
    email: string
    password: string
    phone?: string
    address?: string
    department?: string
    bio?: string
  }) {
    return this.request<{ message: string; user: User }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async login(email: string, password: string) {
    return this.request<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async verifyEmail(token: string) {
    return this.request<{ message: string }>(
      `/api/auth/verify-email?token=${token}`
    )
  }

  async resendVerification(email: string) {
    return this.request<{ message: string }>("/api/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  }

  // Users
  async getCurrentUser() {
    return this.request<User>("/api/users/me")
  }

  async updateCurrentUser(data: Partial<User>) {
    return this.request<User>("/api/users/me", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async getAllUsers() {
    return this.request<User[]>("/api/users")
  }

  async getUserById(id: string) {
    return this.request<User>(`/api/users/${id}`)
  }

  async updateUser(id: string, data: Partial<User>) {
    return this.request<User>(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteUser(id: string) {
    return this.request<{ message: string }>(`/api/users/${id}`, {
      method: "DELETE",
    })
  }

  // Todos
  async getTodos() {
    return this.request<Todo[]>("/api/todos")
  }

  async getAllTodos() {
    return this.request<Todo[]>("/api/todos/all")
  }

  async createTodo(data: {
    title: string
    description?: string
    status?: string
    priority?: string
    category?: string
    dueDate?: string
  }) {
    return this.request<Todo>("/api/todos", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateTodo(
    id: string,
    data: {
      title?: string
      description?: string
      status?: string
      priority?: string
      category?: string
      dueDate?: string
    }
  ) {
    return this.request<Todo>(`/api/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteTodo(id: string) {
    return this.request<{ message: string }>(`/api/todos/${id}`, {
      method: "DELETE",
    })
  }

  async getTodoStats() {
    return this.request<TodoStats>("/api/todos/stats")
  }

  // Task Assignment
  async assignTask(data: {
    assigneeId: string
    title: string
    description?: string
    category?: string
    priority?: string
    dueDate?: string
  }) {
    return this.request<Todo>("/api/tasks/assign", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getAssignedToMe() {
    return this.request<Todo[]>("/api/tasks/assigned-to-me")
  }

  async getAssignedByMe() {
    return this.request<Todo[]>("/api/tasks/assigned-by-me")
  }

  async submitTaskReport(todoId: string, data: {
    reportType: string
    message: string
  }) {
    return this.request<TaskReport>(`/api/tasks/${todoId}/report`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async provideFeedback(reportId: string, feedbackMessage: string) {
    return this.request<TaskReport>(`/api/tasks/reports/${reportId}/feedback`, {
      method: "POST",
      body: JSON.stringify({ feedbackMessage }),
    })
  }

  async extendDeadline(todoId: string, data: {
    newDueDate: string
    reason?: string
  }) {
    return this.request<Todo>(`/api/tasks/${todoId}/extend-deadline`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async getTaskReports(todoId: string) {
    return this.request<TaskReport[]>(`/api/tasks/${todoId}/reports`)
  }

  async getAssignableUsers() {
    return this.request<User[]>("/api/tasks/assignable-users")
  }
}

export const api = new ApiClient()
