"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart3, Users, Package, DollarSign, TrendingUp, Truck } from 'lucide-react'
import { useAdminAuth } from '@/context/admin-auth-context'

export default function AdminDashboard() {
  const router = useRouter()
  const { admin, isLoading } = useAdminAuth()
  const [dashboardLoading, setDashboardLoading] = useState(true)
  
  useEffect(() => {
    if (!isLoading) {
      if (!admin) {
        router.push('/admin/login')
      } else {
        setDashboardLoading(false)
      }
    }
  }, [admin, isLoading, router])

  if (isLoading || dashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return null // Will redirect to login
  }

  const stats = [
    { title: 'Total Bookings', value: '1,234', icon: Package, color: 'bg-blue-500', change: '+12%' },
    { title: 'Active Shipments', value: '89', icon: Truck, color: 'bg-green-500', change: '+8%' },
    { title: 'Revenue Today', value: '₹2,45,000', icon: DollarSign, color: 'bg-yellow-500', change: '+15%' },
    { title: 'Growth Rate', value: '+12%', icon: TrendingUp, color: 'bg-purple-500', change: '+3%' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {admin.username}!</p>
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
            <p className="text-green-800">✅ Login successful!</p>
            <p className="text-sm text-green-600 mt-1">
              Role: {admin.role} | Email: {admin.email}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <div 
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-blue-500"
            onClick={() => router.push("/admin/bookings")}
          >
            <div className="flex items-center mb-4">
              <Package className="h-8 w-8 text-blue-500 mr-3" />
              <h2 className="text-xl font-semibold">All Bookings</h2>
            </div>
            <p className="text-gray-600">View and manage all parcel bookings.</p>
            <div className="mt-4 text-blue-600 text-sm font-medium">
              View Details →
            </div>
          </div>
          
          <div 
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-green-500"
            onClick={() => router.push("/admin/quotes")}
          >
            <div className="flex items-center mb-4">
              <DollarSign className="h-8 w-8 text-green-500 mr-3" />
              <h2 className="text-xl font-semibold">All Quotes</h2>
            </div>
            <p className="text-gray-600">View all quote requests from users.</p>
            <div className="mt-4 text-green-600 text-sm font-medium">
              View Details →
            </div>
          </div>
          
          <div 
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-purple-500"
            onClick={() => router.push("/admin/analytics")}
          >
            <div className="flex items-center mb-4">
              <BarChart3 className="h-8 w-8 text-purple-500 mr-3" />
              <h2 className="text-xl font-semibold">Analytics</h2>
            </div>
            <p className="text-gray-600">See booking trends and city-wise stats.</p>
            <div className="mt-4 text-purple-600 text-sm font-medium">
              View Details →
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">New booking received from Mumbai to Delhi</span>
                <span className="text-xs text-gray-400">2 mins ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Shipment BK001 delivered successfully</span>
                <span className="text-xs text-gray-400">5 mins ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Payment received for booking BK002</span>
                <span className="text-xs text-gray-400">10 mins ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}