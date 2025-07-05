"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Admin {
  id: string
  email: string
  username: string
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
    const token = localStorage.getItem('adminToken')
    const adminData = localStorage.getItem('adminData')
    
    if (token && adminData) {
      try {
        setAdmin(JSON.parse(adminData))
      } catch (error) {
        console.error('Failed to parse admin data:', error)
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminData')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    try {
      // Ensure parameters are strings and not empty
      const usernameStr = String(username || '').trim()
      const passwordStr = String(password || '').trim()
      
      console.log(' Attempting login with:', { username: usernameStr, password: '***' })
      
      if (!usernameStr || !passwordStr) {
        throw new Error('Username and password are required')
      }
      
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: usernameStr, 
          password: passwordStr 
        }),
      })

      const data = await response.json()
      console.log(' Login response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      if (data.success && data.user && data.token) {
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('adminData', JSON.stringify(data.user))
        setAdmin(data.user)
        router.push('/admin/dashboard')
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminData')
    setAdmin(null)
    router.push('/admin/login')
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

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}
