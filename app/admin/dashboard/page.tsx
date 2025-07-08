"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/context/admin-auth-context"
import { 
  BarChart3, 
  Package, 
  Users, 
  TrendingUp, 
  Bell, 
  Settings,
  Calendar,
  Activity
} from "lucide-react"

export default function AdminDashboardPage() {
  const { admin, isLoading } = useAdminAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalBookings: 1234,
    activeShipments: 89,
    totalRevenue: 250000,
    completedDeliveries: 1089
  })

  useEffect(() => {
    if (!isLoading && !admin) {
      router.push("/admin/login")
    }
  }, [admin, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!admin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {admin.username}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => router.push('/admin/notifications')}
                className="relative p-2 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
                aria-label="View notifications (3 unread)"
                title="View notifications"
              >
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/settings')}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
                aria-label="Open settings"
                title="Settings"
              >
                <Settings className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Shipments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeShipments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{(stats.totalRevenue / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedDeliveries.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            type="button"
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow text-left"
            onClick={() => router.push("/admin/bookings")}
            aria-label="Manage bookings - View and manage all parcel bookings"
          >
            <div className="flex items-center space-x-3">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold">Manage Bookings</h3>
                <p className="text-gray-600">View and manage all parcel bookings</p>
              </div>
            </div>
          </button>

          <button
            type="button"
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow text-left"
            onClick={() => router.push("/admin/quotes")}
            aria-label="Quote requests - Review and respond to quotes"
          >
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold">Quote Requests</h3>
                <p className="text-gray-600">Review and respond to quotes</p>
              </div>
            </div>
          </button>

          <button
            type="button"
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow text-left"
            onClick={() => router.push("/admin/analytics")}
            aria-label="Analytics - View business insights and metrics"
          >
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div>
                <h3 className="text-lg font-semibold">Analytics</h3>
                <p className="text-gray-600">View business insights and metrics</p>
              </div>
            </div>
          </button>

          <button
            type="button"
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow text-left"
            onClick={() => router.push("/admin/analytics/live")}
            aria-label="Live analytics - Real-time monitoring dashboard"
          >
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold">Live Analytics</h3>
                <p className="text-gray-600">Real-time monitoring dashboard</p>
              </div>
            </div>
          </button>

          <button
            type="button"
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow text-left"
            onClick={() => router.push("/admin/notifications")}
            aria-label="Notifications - View system notifications"
          >
            <div className="flex items-center space-x-3">
              <Bell className="h-8 w-8 text-yellow-600" />
              <div>
                <h3 className="text-lg font-semibold">Notifications</h3>
                <p className="text-gray-600">View system notifications</p>
              </div>
            </div>
          </button>

          <button
            type="button"
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow text-left"
            onClick={() => router.push("/admin/staff")}
            aria-label="Staff management - Manage admin users and roles"
          >
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-indigo-600" />
              <div>
                <h3 className="text-lg font-semibold">Staff Management</h3>
                <p className="text-gray-600">Manage admin users and roles</p>
              </div>
            </div>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true"></div>
              <span className="text-sm text-gray-600">New booking from Mumbai to Delhi - 2 min ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full" aria-hidden="true"></div>
              <span className="text-sm text-gray-600">Shipment delivered in Bangalore - 5 min ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" aria-hidden="true"></div>
              <span className="text-sm text-gray-600">Quote request received - 8 min ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
