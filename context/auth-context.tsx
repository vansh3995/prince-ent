"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  role?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        console.log("🔄 Initializing auth state...")
        
        const savedToken = localStorage.getItem("authToken")
        const savedUser = localStorage.getItem("authUser")
        
        console.log("📦 Saved data:", { savedToken, savedUser })
        
        if (savedToken && savedUser) {
          const userData = JSON.parse(savedUser)
          setToken(savedToken)
          setUser(userData)
          console.log("✅ Auth restored:", userData)
        } else {
          console.log("❌ No saved auth data found")
        }
      } catch (error) {
        console.error("❌ Auth initialization error:", error)
        // Clear corrupted data
        localStorage.removeItem("authToken")
        localStorage.removeItem("authUser")
      } finally {
        setIsLoading(false)
        console.log("🎯 Auth initialization complete")
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      console.log("🔐 Attempting login:", { email })
      
      // Demo credentials - replace with actual API call
      const DEMO_CREDENTIALS = {
        email: "demo@example.com",
        password: "demo123"
      }

      if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
        const userData: User = {
          id: "1",
          name: "Demo User",
          email: email,
          phone: "+91 9876543210",
          role: "user"
        }
        
        const authToken = "demo-token-" + Date.now()
        
        // Save to localStorage
        localStorage.setItem("authToken", authToken)
        localStorage.setItem("authUser", JSON.stringify(userData))

        // Set authToken cookie for middleware
        const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        document.cookie = `authToken=${authToken}; path=/; max-age=86400; samesite=lax${isLocalhost ? "" : "; secure"}`
        
        // Update state
        setToken(authToken)
        setUser(userData)
        
        console.log("✅ Login successful:", userData)
        return { success: true, message: "Login successful" }
      } else {
        console.log("❌ Invalid credentials")
        return { success: false, message: "Invalid email or password" }
      }
    } catch (error) {
      console.error("❌ Login error:", error)
      return { success: false, message: "Login failed. Please try again." }
    }
  }

  const logout = () => {
    console.log("🚪 Logging out...")
    localStorage.removeItem("authToken")
    localStorage.removeItem("authUser")

    // Clear authToken cookie
    document.cookie = "authToken=; path=/; max-age=0; secure; samesite=lax"

    setUser(null)
    setToken(null)
    console.log("✅ Logout complete")
  }

  const isAuthenticated = !!user && !!token

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated
  }

  console.log("📊 Auth context state:", { user: user?.email, isLoading, isAuthenticated })

  return (
    <AuthContext.Provider value={value}>
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