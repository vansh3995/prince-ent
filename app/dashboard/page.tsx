"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Truck, MapPin, Bell } from "lucide-react"

export default function DashboardPage() {
  const { user, logout, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log("🏠 Dashboard - Auth state:", { 
      user: user?.email, 
      isLoading, 
      isAuthenticated 
    })
    
    // Only redirect if loading is complete and user is not authenticated
    if (!isLoading && !isAuthenticated) {
      console.log("🚪 Dashboard - Redirecting to login")
      router.push("/login?redirect=/dashboard")
    }
  }, [isLoading, isAuthenticated, router])

  // Show loading while auth is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Show loading while redirecting
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}! 👋</p>
          </div>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Transit</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Currently shipping</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">9</div>
              <p className="text-xs text-muted-foreground">Successfully delivered</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">New updates</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full" onClick={() => router.push("/booking")}>
                  New Booking
                </Button>
                <Button variant="outline" className="w-full">
                  View All Bookings
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push("/track")}>
                  Track Shipment
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your profile details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Name:</span>
                  <span className="text-sm">{user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Email:</span>
                  <span className="text-sm">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Phone:</span>
                  <span className="text-sm">{user?.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Role:</span>
                  <span className="text-sm capitalize">{user?.role || 'User'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  <span className="text-sm text-green-600">✅ Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
