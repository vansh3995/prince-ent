"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AdminAuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (token: string, userData: User) => void
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const login = async (login: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      })
      const data = await res.json()
      if (res.ok && data.token) {
        localStorage.setItem('adminToken', data.token)
        setUser(data.user)
        setIsAuthenticated(true)
        router.push('/admin')
      } else {
        throw new Error(data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setIsAuthenticated(false)
      setUser(null)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setUser(null)
    setIsAuthenticated(false)
    router.push('/admin/login')
  }

  useEffect(() => {
    const checkAuth = () => {
      console.log('🔍 AdminAuthProvider checking auth for path:', pathname)
      
      // Skip auth check for login page
      if (pathname === '/admin/login') {
        setIsLoading(false)
        return
      }

      const token = localStorage.getItem('adminToken')
      console.log('🎫 Token exists:', !!token)

      if (!token) {
        console.log('❌ No token found')
        setIsAuthenticated(false)
        setUser(null)
        setIsLoading(false)
        // Only redirect if we're not already on login page
        if (pathname !== '/admin/login') {
          router.push('/admin/login')
        }
        return
      }

      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        console.log('🔓 Token payload:', payload)

        // Check if token has expiration and if it's expired
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          console.log('⏰ Token expired')
          logout()
          return
        }

        // Check if user has admin role
        if (payload.role !== 'admin' && payload.role !== 'superadmin') {
          console.log('🚫 User does not have admin role:', payload.role)
          logout()
          return
        }

        // Set user data from token
        const userData: User = {
          id: payload.userId,
          email: payload.email,
          name: payload.name,
          role: payload.role
        }

        setUser(userData)
        setIsAuthenticated(true)
        console.log('✅ Token valid, user authenticated:', userData)
      } catch (error) {
        console.log('❌ Invalid token format:', error)
        logout()
        return
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  // Additional check on initial mount to restore auth state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('adminToken')
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          if (payload.exp && payload.exp * 1000 > Date.now()) {
            const userData: User = {
              id: payload.userId,
              email: payload.email,
              name: payload.name,
              role: payload.role
            }
            setUser(userData)
            setIsAuthenticated(true)
            setIsLoading(false)
            console.log('✅ Token valid on initial mount, user authenticated:', userData)
            return
          }
        } catch {
          // ignore errors
        }
      }
      setIsAuthenticated(false)
      setUser(null)
      setIsLoading(false)
      console.log('❌ No valid token on initial mount, user not authenticated')
    }
  }, [])

  return (
    <AdminAuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated,
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
