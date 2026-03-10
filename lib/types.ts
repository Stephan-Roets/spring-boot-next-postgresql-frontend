export interface User {
  id: string
  email: string
  name: string
  phone: string | null
  address: string | null
  department: string | null
  role: "USER" | "MANAGER" | "ADMIN"
  profilePictureUrl: string | null
  bio: string | null
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface Todo {
  id: string
  userId: string
  userName: string
  title: string
  description: string | null
  status: "PENDING" | "IN_PROGRESS" | "DONE"
  priority: "LOW" | "MEDIUM" | "HIGH"
  category: string | null
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export interface LoginResponse {
  accessToken: string
  tokenType: string
  user: User
}

export interface TodoStats {
  total: number
  pending: number
  inProgress: number
  done: number
}

export interface ApiError {
  timestamp: string
  status: number
  error: string
  message: string
  details?: Record<string, string>
}
