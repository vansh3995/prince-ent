"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Truck, FileText, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import PrivateRoute from "@/components/PrivateRoute"

export default function DashboardPage() {
  return (
    <PrivateRoute>
      <DashboardContent />
    </PrivateRoute>
  )
}

function DashboardContent() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
          <p className="text-gray-600">Manage your shipments and account details</p>
        </div>
        <Button variant="outline" onClick={logout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Active Shipments</p>
                <p className="text-3xl font-bold">3</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Delivered</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Truck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Pending Quotes</p>
                <p className="text-3xl font-bold">2</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Account Status</p>
                <p className="text-lg font-medium text-green-600">Active</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Shipments</CardTitle>
              <CardDescription>Track and manage your recent shipments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">PE123456789</p>
                      <p className="text-sm text-gray-500">Delhi to Mumbai</p>
                    </div>
                    <div className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">Delivered</div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Delivered on: June 12, 2024</p>
                  </div>
                  <div className="mt-2">
                    <Link href="/track?id=PE123456789">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">PE987654321</p>
                      <p className="text-sm text-gray-500">Bangalore to Chennai</p>
                    </div>
                    <div className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded">In Transit</div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Expected delivery: June 14, 2024</p>
                  </div>
                  <div className="mt-2">
                    <Link href="/track?id=PE987654321">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <Link href="/shipments">
                  <Button variant="link" className="text-red-600">
                    View All Shipments
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/booking">
                  <Button className="w-full bg-red-600 hover:bg-red-700 justify-start">
                    <Package className="mr-2 h-4 w-4" />
                    Book New Shipment
                  </Button>
                </Link>
                <Link href="/track">
                  <Button variant="outline" className="w-full justify-start">
                    <Truck className="mr-2 h-4 w-4" />
                    Track Shipment
                  </Button>
                </Link>
                <Link href="/quote">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Request Quote
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Account Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
