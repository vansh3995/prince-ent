"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'user'
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string, type: string) => Promise<{ success: boolean; message?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      if (typeof window === 'undefined') {
        setIsLoading(false)
        return
      }

      const token = localStorage.getItem('userToken')
      if (!token) {
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.user) {
          setUser(data.user)
        } else {
          localStorage.removeItem('userToken')
        }
      } else {
        localStorage.removeItem('userToken')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userToken')
      }
    }
    
    setIsLoading(false)
  }

  const login = async (email: string, password: string, type: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, type }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        localStorage.setItem('userToken', data.token)
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, message: data.message || 'Login failed' }
      }
    } catch (error) {
      return { success: false, message: 'Login failed' }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        localStorage.setItem('userToken', data.token)
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, message: data.message || 'Registration failed' }
      }
    } catch (error) {
      return { success: false, message: 'Registration failed' }
    }
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userToken')
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
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
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
