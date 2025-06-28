"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface AdminUser {
  id: string
  username: string
  email: string
  role: string
}

interface AdminAuthContextType {
  user: AdminUser | null
  loading: boolean
  login: (credentials: { username: string; password: string }) => Promise<boolean>
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check authentication status on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('admin-token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch('/api/admin/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        localStorage.removeItem('admin-token')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('admin-token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials: { username: string; password: string }): Promise<boolean> => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        localStorage.setItem('admin-token', data.token)
        setUser(data.user)
        return true
      } else {
        console.error('Login failed:', data.message)
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('admin-token')
    setUser(null)
    // Don't call router.push here to avoid setState in render
  }

  return (
    <AdminAuthContext.Provider value={{
      user,
      loading,
      login,
      logout
    }}>
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
