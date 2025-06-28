"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AdminHome() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if admin token exists
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push("/admin/login")
      return
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-16">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          className="border rounded-lg p-8 shadow hover:shadow-lg cursor-pointer bg-white"
          onClick={() => router.push("/admin/bookings")}
        >
          <h2 className="text-xl font-semibold mb-2">All Bookings</h2>
          <p>View and manage all parcel bookings.</p>
        </div>
        <div
          className="border rounded-lg p-8 shadow hover:shadow-lg cursor-pointer bg-white"
          onClick={() => router.push("/admin/quotes")}
        >
          <h2 className="text-xl font-semibold mb-2">All Quotes</h2>
          <p>View all quote requests from users.</p>
        </div>
        <div
          className="border rounded-lg p-8 shadow hover:shadow-lg cursor-pointer bg-white"
          onClick={() => router.push("/admin/analytics")}
        >
          <h2 className="text-xl font-semibold mb-2">Analytics</h2>
          <p>See booking trends and city-wise stats.</p>
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push("/admin/analytics/live")}
        >
          <h2 className="text-xl font-semibold mb-2">🔴 Live Analytics</h2>
          <p className="text-gray-600">Real-time monitoring</p>
        </div>
      </div>
    </div>
  )
}