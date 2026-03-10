"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import type { User } from "@/lib/types"
import { api } from "@/lib/api"

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  isAdmin: boolean
  isManager: boolean
  isManagerOrAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const userData = await api.getCurrentUser()
      setUser(userData)
      localStorage.setItem("auth_user", JSON.stringify(userData))
    } catch {
      logout()
    }
  }, [logout])

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token")
    const storedUser = localStorage.getItem("auth_user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      // Validate token by fetching user
      api
        .getCurrentUser()
        .then((userData) => {
          setUser(userData)
          localStorage.setItem("auth_user", JSON.stringify(userData))
        })
        .catch(() => {
          logout()
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [logout])

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password)
    setToken(response.accessToken)
    setUser(response.user)
    localStorage.setItem("auth_token", response.accessToken)
    localStorage.setItem("auth_user", JSON.stringify(response.user))
  }

  const isAdmin = user?.role === "ADMIN"
  const isManager = user?.role === "MANAGER"
  const isManagerOrAdmin = isAdmin || isManager

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        refreshUser,
        isAdmin,
        isManager,
        isManagerOrAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
