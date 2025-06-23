"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function AdminHome() {
  const { status } = useSession()
  const router = useRouter()

  if (status === "loading") return <p>Loading...</p>
  if (status === "unauthenticated") {
    router.push("/admin/login")
    return null
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
      </div>
    </div>
  )
}