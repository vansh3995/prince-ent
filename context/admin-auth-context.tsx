"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Admin {
  id: string
  username: string
  email?: string
  role: 'admin' | 'superadmin'
}

interface AdminAuthContextType {
  admin: Admin | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
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

      const token = localStorage.getItem('adminToken')
      if (!token) {
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/admin/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.admin) {
          setAdmin(data.admin)
        } else {
          localStorage.removeItem('adminToken')
        }
      } else {
        localStorage.removeItem('adminToken')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken')
      }
    }
    
    setIsLoading(false)
  }

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      if (data.success && data.admin && data.token) {
        localStorage.setItem('adminToken', data.token)
        setAdmin(data.admin)
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken')
    }
    setAdmin(null)
  }

  return (
    <AdminAuthContext.Provider value={{
      admin,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}
