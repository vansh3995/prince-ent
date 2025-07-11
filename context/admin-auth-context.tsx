"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Admin {
  id: string
  username: string
  email: string
  role: string
}

interface AdminAuthContextType {
  admin: Admin | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('admin-token')
      if (!token) {
        setIsLoading(false)
        return
      }

      // Verify token with API route (Node.js runtime)
      const response = await fetch('/api/admin/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })

      if (response.ok) {
        const { payload } = await response.json()
        setAdmin(payload)
      } else {
        localStorage.removeItem('admin-token')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('admin-token')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Login failed')
      }

      const data = await response.json()
      const { token, admin } = data
      localStorage.setItem('admin-token', token)
      
      // Set cookie for middleware
      const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      document.cookie = `admin-token=${token}; path=/; max-age=86400; samesite=lax${isLocalhost ? "" : "; secure"}`
      
      setAdmin(admin)
      // Redirect to admin dashboard after login
      window.location.href = "/admin/dashboard"
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('admin-token')
    document.cookie = 'admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    setAdmin(null)
    router.push('/admin/login')
  }

  return (
    <AdminAuthContext.Provider value={{ admin, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}
