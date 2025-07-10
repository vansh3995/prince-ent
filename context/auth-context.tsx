"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface LoginResult {
  success: boolean
  message?: string
  user?: User
  token?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<LoginResult>
  register: (name: string, email: string, password: string) => Promise<LoginResult>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = async (email: string, password: string): Promise<LoginResult> => {
    setIsLoading(true)
    try {
      // Demo credentials for testing
      if (email === "user@test.com" && password === "password") {
        const mockUser: User = {
          id: "1",
          name: "Test User",
          email: email,
          role: "user"
        }
        const mockToken = "demo-token-" + Date.now()
        
        setUser(mockUser)
        setToken(mockToken)
        
        // Store in localStorage for persistence
        localStorage.setItem("authToken", mockToken)
        localStorage.setItem("user", JSON.stringify(mockUser))
        
        return { success: true, message: "Logged in successfully", user: mockUser, token: mockToken }
      } else {
        return { success: false, message: "Invalid email or password" }
      }
    } catch (error) {
      return { success: false, message: "Login failed" }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string): Promise<LoginResult> => {
    setIsLoading(true)
    try {
      // Mock registration
      const mockUser: User = {
        id: Date.now().toString(),
        name: name,
        email: email,
        role: "user"
      }
      const mockToken = "demo-token-" + Date.now()
      
      setUser(mockUser)
      setToken(mockToken)
      
      // Store in localStorage for persistence
      localStorage.setItem("authToken", mockToken)
      localStorage.setItem("user", JSON.stringify(mockUser))
      
      return { success: true, message: "Registered successfully", user: mockUser, token: mockToken }
    } catch (error) {
      return { success: false, message: "Registration failed" }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    console.log("Logged out")
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}