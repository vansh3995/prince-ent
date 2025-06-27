"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/context/admin-auth-context"

export default function AdminQuotesPage() {
  const { user, isAuthenticated } = useAdminAuth()
  const router = useRouter()
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
    } else {
      fetchQuotes()
    }
    // eslint-disable-next-line
  }, [isAuthenticated])

  const fetchQuotes = async () => {
    setLoading(true)
    const res = await fetch("/api/quote")
    const data = await res.json()
    setQuotes(data.quotes || [])
    setLoading(false)
  }

  if (!isAuthenticated) return null

  if (user?.role !== "superadmin" && user?.role !== "admin") {
    return <p>Access denied. You do not have the necessary permissions to view this page.</p>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">All Quote Requests</h1>
      {user?.role === "superadmin" && (
        <button className="bg-green-600 text-white px-4 py-2 rounded mb-4">
          Export Quotes
        </button>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {quotes.length === 0 && <p>No quotes found.</p>}
          {quotes.map((q) => (
            <div key={q._id} className="border rounded p-4 bg-white shadow">
              <div className="font-semibold mb-2">{q.firstName} {q.lastName} ({q.email}, {q.phone})</div>
              <div><strong>From:</strong> {q.origin} <strong>To:</strong> {q.destination}</div>
              <div><strong>Service:</strong> {q.serviceType} | <strong>Shipment:</strong> {q.shipmentType}</div>
              <div><strong>Weight:</strong> {q.weight} | <strong>Packages:</strong> {q.packages}</div>
              <div><strong>Description:</strong> {q.description}</div>
              <div><strong>Company:</strong> {q.company}</div>
              <div><strong>Additional:</strong> {q.additional}</div>
              <div className="text-xs text-gray-500 mt-2">
                <strong>Requested At:</strong> {q.createdAt ? new Date(q.createdAt).toLocaleString() : ""}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
