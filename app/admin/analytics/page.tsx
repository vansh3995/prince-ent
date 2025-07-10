"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/context/admin-auth-context"
import { BarChart3, TrendingUp, Package, Users, Calendar, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminAnalyticsPage() {
  const { admin, isLoading } = useAdminAuth()
  const router = useRouter()
  const [analytics, setAnalytics] = useState({
    totalBookings: 1234,
    totalRevenue: 450000,
    deliveryRate: 95.2,
    avgDeliveryTime: 2.3,
    monthlyGrowth: 12.5,
    topRoutes: [
      { route: 'Mumbai  Delhi', count: 156, revenue: 78000 },
      { route: 'Bangalore  Chennai', count: 134, revenue: 67000 },
      { route: 'Pune  Mumbai', count: 98, revenue: 49000 }
    ],
    recentStats: [
      { month: 'Jan', bookings: 850, revenue: 34000 },
      { month: 'Feb', bookings: 920, revenue: 38000 },
      { month: 'Mar', bookings: 1100, revenue: 45000 },
      { month: 'Apr', bookings: 1050, revenue: 42000 },
      { month: 'May', bookings: 1200, revenue: 48000 },
      { month: 'Jun', bookings: 1350, revenue: 54000 }
    ]
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Business insights and performance metrics</p>
          </div>
          <Button className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalBookings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{analytics.monthlyGrowth}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{(analytics.totalRevenue / 1000).toFixed(0)}K</div>
              <p className="text-xs text-muted-foreground">
                +15.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.deliveryRate}%</div>
              <p className="text-xs text-muted-foreground">
                +2.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.avgDeliveryTime} days</div>
              <p className="text-xs text-muted-foreground">
                -0.3 days from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Top Routes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Top Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topRoutes.map((route, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium">{route.route}</div>
                      <div className="text-sm text-gray-500">{route.count} bookings</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₹{route.revenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Revenue</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.recentStats.map((stat, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-lg font-semibold text-blue-900">{stat.month}</div>
                  <div className="text-2xl font-bold text-blue-800">{stat.bookings}</div>
                  <div className="text-sm text-blue-600">Bookings</div>
                  <div className="text-lg font-medium text-blue-700 mt-2">₹{stat.revenue.toLocaleString()}</div>
                  <div className="text-sm text-blue-600">Revenue</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
