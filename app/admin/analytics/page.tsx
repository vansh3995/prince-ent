"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/context/admin-auth-context"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend,
} from "recharts"

export default function AdminAnalyticsPage() {
  const { isAuthenticated } = useAdminAuth()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) router.push("/admin/login")
    if (isAuthenticated) fetchStats()
    // eslint-disable-next-line
  }, [isAuthenticated])

  const fetchStats = async () => {
    setLoading(true)
    const res = await fetch("/api/analytics")
    const data = await res.json()
    setStats(data)
    setLoading(false)
  }

  if (!isAuthenticated) return null

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Booking Analytics</h1>
      {loading || !stats ? (
        <p>Loading analytics...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Total Bookings */}
          <div className="bg-white rounded shadow p-6">
            <h2 className="font-semibold mb-2">Total Bookings</h2>
            <div className="text-4xl font-bold text-red-600">{stats.totalBookings}</div>
          </div>
          {/* City-wise Bookings */}
          <div className="bg-white rounded shadow p-6">
            <h2 className="font-semibold mb-2">Bookings by City</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.cityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="city" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Monthly Bookings */}
          <div className="bg-white rounded shadow p-6 col-span-2">
            <h2 className="font-semibold mb-2">Monthly Bookings</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e42" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
