"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {session?.user?.name}!</p>
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
            <p className="text-green-800">✅ Login successful!</p>
            <p className="text-sm text-green-600 mt-1">
              Role: {session?.user?.role} | Email: {session?.user?.email}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div 
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push("/admin/bookings")}
          >
            <h2 className="text-xl font-semibold mb-2">All Bookings</h2>
            <p className="text-gray-600">View and manage all parcel bookings.</p>
          </div>
          
          <div 
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push("/admin/quotes")}
          >
            <h2 className="text-xl font-semibold mb-2">All Quotes</h2>
            <p className="text-gray-600">View all quote requests from users.</p>
          </div>
          
          <div 
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push("/admin/analytics")}
          >
            <h2 className="text-xl font-semibold mb-2">Analytics</h2>
            <p className="text-gray-600">See booking trends and city-wise stats.</p>
          </div>
        </div>
      </div>
    </div>
  )
}