"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  id: string
  name: string
  email: string
  role: "customer" | "admin" | "staff"
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Failed to parse saved user", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  // Mock users for demo
  const mockUsers = [
    {
      id: "1",
      name: "Demo User",
      email: "user@example.com",
      password: "password123",
      role: "customer" as const,
    },
    {
      id: "2",
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      role: "admin" as const,
    },
  ]

  const login = async (email: string, password: string) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      return { success: true, message: "Login successful" }
    }

    return { success: false, message: "Invalid email or password" }
  }

  const register = async (name: string, email: string, password: string) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    if (mockUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: "Email already in use" }
    }

    // In a real app, you would send this to your backend
    const newUser = {
      id: `${mockUsers.length + 1}`,
      name,
      email,
      role: "customer" as const,
    }

    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
    return { success: true, message: "Registration successful" }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
