"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAdminAuth } from '@/context/admin-auth-context'
import { Bell, ChevronDown, User, LogOut, Menu, X } from 'lucide-react'

interface Notification {
  _id: string
  type: string
  message: string
  read: boolean
  createdAt: string
  bookingId?: string
  userId?: string
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()
  
  // Notification States
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [loadingNotifications, setLoadingNotifications] = useState(false)
  
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Auth check - moved to useEffect to avoid setState during render
  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [user, loading, pathname, router])

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true)
      const response = await fetch('/api/notifications')
      const data = await response.json()
      
      if (data.success) {
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoadingNotifications(false)
    }
  }

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId })
      })
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n._id === notificationId ? { ...n, read: true } : n
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true })
      })
      
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  // Initial fetch and polling
  useEffect(() => {
    if (user) {
      fetchNotifications()
      
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000)
      
      return () => clearInterval(interval)
    }
  }, [user])

  // Admin navigation items
  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '🏠' },
    { href: '/admin/bookings', label: 'Bookings', icon: '📦' },
    { href: '/admin/analytics', label: 'Analytics', icon: '📊' },
    { href: '/admin/quotes', label: 'Quotes', icon: '💰' },
    { href: '/admin/notifications', label: 'Notifications', icon: '🔔' },
    { href: '/admin/staff', label: 'Staff', icon: '👥' },
  ]

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  // Handle navigation click
  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false)
    setShowNotifications(false)
    router.push(href)
  }

  // Format time ago
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  // Show loading while auth is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render admin layout for login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Don't render if user is not authenticated
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <Link href="/admin" className="flex items-center ml-2 md:ml-0">
                <span className="text-xl font-bold text-blue-600">Prince Enterprise</span>
                <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Admin</span>
              </Link>
            </div>

            {/* Right side - Notifications & User Menu */}
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-400 hover:text-gray-500 relative"
                >
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {loadingNotifications ? (
                        <div className="p-4 text-center text-gray-500">
                          Loading notifications...
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification._id}
                            className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                              !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                            }`}
                            onClick={() => {
                              if (!notification.read) {
                                markAsRead(notification._id)
                              }
                              // Navigate to relevant page if needed
                              if (notification.bookingId) {
                                handleNavClick('/admin/bookings')
                              }
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium">
                                    {notification.type === 'booking' ? '📦' : 
                                     notification.type === 'quote' ? '💰' : 
                                     notification.type === 'payment' ? '💳' : '📢'}
                                  </span>
                                  <span className="text-sm font-medium capitalize">
                                    {notification.type}
                                  </span>
                                  {!notification.read && (
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-700 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {timeAgo(notification.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="p-4 border-t">
                        <button
                          onClick={() => handleNavClick('/admin/notifications')}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          View all notifications →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                  <User className="h-6 w-6" />
                  <span className="hidden md:block">{user?.username || 'Admin'}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:block">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <nav className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`w-full text-left flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.label === 'Notifications' && unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Sidebar for Desktop */}
      <div className="flex">
        <aside className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <nav className="flex-1 px-4 py-4 bg-white shadow">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <button
                      onClick={() => handleNavClick(item.href)}
                      className={`w-full text-left flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${
                        pathname === item.href
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                      {item.label === 'Notifications' && unreadCount > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Click outside to close notifications */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayoutContent>{children}</AdminLayoutContent>
}
