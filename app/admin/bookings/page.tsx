"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

// Extend the session user type to include 'role'
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & { role?: string }
  }
  interface User {
    role?: string
  }
}
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import toast, { Toaster } from "react-hot-toast"

const STATUS_OPTIONS = ["Pending", "In Transit", "Delivered", "Cancelled"]

export default function AdminBookingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const limit = 10
  const role = session?.user?.role

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login")
    }
    if (status === "authenticated") {
      fetchBookings()
    }
    // eslint-disable-next-line
  }, [status, page])

  const fetchBookings = async () => {
    setLoading(true)
    const res = await fetch(`/api/bookings?page=${page}&limit=${limit}`)
    const data = await res.json()
    setBookings(data.bookings || [])
    setTotal(data.total || 0)
    setLoading(false)
  }

  // Filter and search logic
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      search === "" ||
      booking.pickup?.name?.toLowerCase().includes(search.toLowerCase()) ||
      booking.delivery?.name?.toLowerCase().includes(search.toLowerCase()) ||
      booking.pickup?.city?.toLowerCase().includes(search.toLowerCase()) ||
      booking.delivery?.city?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      !filterStatus || booking.status === filterStatus

    // Date filter logic
    const bookingDate = booking.pickup?.date ? new Date(booking.pickup.date) : null
    const from = fromDate ? new Date(fromDate) : null
    const to = toDate ? new Date(toDate) : null
    const matchesDate =
      (!from || (bookingDate && bookingDate >= from)) &&
      (!to || (bookingDate && bookingDate <= to))

    return matchesSearch && matchesStatus && matchesDate
  })

  // Status update handler
  const handleStatusChange = async (id: string, newStatus: string) => {
    if (!window.confirm(`Change status to "${newStatus}"?`)) return
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      toast.success("Status updated!")
      fetchBookings()
    } else {
      toast.error("Failed to update status.")
    }
  }

  // Delete handler
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return
    const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" })
    if (res.ok) {
      toast.success("Booking deleted!")
      fetchBookings()
    } else {
      toast.error("Failed to delete booking.")
    }
  }

  // CSV Export
  const exportCSV = () => {
    const headers = [
      "Pickup Name,Delivery Name,Service,Package,Pickup City,Delivery City,Date,Value,Status"
    ]
    const rows = bookings.map(b =>
      [
        b.pickup?.name,
        b.delivery?.name,
        b.serviceType,
        b.packageType,
        b.pickup?.city,
        b.delivery?.city,
        b.pickup?.date || "",
        b.value,
        b.status || "Pending"
      ].join(",")
    )
    const csvContent = [headers, ...rows].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "bookings.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  if (status === "loading") return <p>Checking authentication...</p>
  if (status === "unauthenticated") return null

  return (
    <div className="container mx-auto py-8">
      <Toaster />
      <h1 className="text-2xl font-bold mb-6">All Bookings</h1>
      <div className="flex gap-4 mb-4">
        <input
          className="border px-3 py-2 rounded w-64"
          placeholder="Search by name or city"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border px-3 py-2 rounded"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <input
          type="date"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="date"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Export as CSV
        </button>
        <button
          onClick={() => { setSearch(""); setFilterStatus(""); setPage(1); }}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Clear
        </button>
        <button
          disabled={selectedIds.length === 0}
          onClick={async () => {
            if (!window.confirm("Delete selected bookings?")) return
            for (const id of selectedIds) {
              await fetch(`/api/bookings/${id}`, { method: "DELETE" })
            }
            toast.success("Selected bookings deleted!")
            setSelectedIds([])
            fetchBookings()
          }}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          Delete Selected
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {filteredBookings.length === 0 && <p>No bookings found.</p>}
          {filteredBookings.map((booking) => (
            <Card key={booking._id} className="cursor-pointer">
              <CardHeader>
                <CardTitle>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(booking._id)}
                    onChange={e => {
                      e.stopPropagation();
                      setSelectedIds(ids =>
                        e.target.checked
                          ? [...ids, booking._id]
                          : ids.filter(id => id !== booking._id)
                      )
                    }}
                    className="mr-2"
                  />
                  {booking.pickup?.name} → {booking.delivery?.name}
                </CardTitle>
              </CardHeader>
              <CardContent
                onClick={() => setSelectedBooking(booking)}
                className="cursor-pointer"
              >
                <p><strong>Service:</strong> {booking.serviceType}</p>
                <p><strong>Package:</strong> {booking.packageType}</p>
                <p><strong>Pickup City:</strong> {booking.pickup?.city}</p>
                <p><strong>Delivery City:</strong> {booking.delivery?.city}</p>
                <p><strong>Date:</strong> {booking.pickup?.date || "N/A"}</p>
                <p><strong>Value:</strong> ₹{booking.value}</p>
                <div className="flex items-center gap-2 mt-2">
                  <strong>Status:</strong>
                  <select
                    className="border px-2 py-1 rounded"
                    value={booking.status || "Pending"}
                    onClick={e => e.stopPropagation()}
                    onChange={e => {
                      e.stopPropagation();
                      handleStatusChange(booking._id, e.target.value)
                    }}
                  >
                    {STATUS_OPTIONS.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  {role === "superadmin" && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleDelete(booking._id)
                      }}
                      className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <p className="mb-2 text-gray-600">
        Showing {filteredBookings.length} of {total} bookings
      </p>
      {/* Pagination Controls */}
      <div className="flex gap-2 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page} of {Math.ceil(total / limit)}</span>
        <button
          disabled={page >= Math.ceil(total / limit)}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-xl"
              onClick={() => setSelectedBooking(null)}
            >×</button>
            <h2 className="text-xl font-bold mb-4">Booking Details</h2>
            <div className="space-y-2 text-sm">
              <div><strong>Booking ID:</strong> {selectedBooking._id}</div>
              <div><strong>Reference ID:</strong> {selectedBooking.referenceId}</div>
              <div><strong>User ID:</strong> {selectedBooking.userId}</div>
              <div><strong>Service Type:</strong> {selectedBooking.serviceType}</div>
              <div><strong>Package Type:</strong> {selectedBooking.packageType}</div>
              <div><strong>Weight:</strong> {selectedBooking.weight}</div>
              <div><strong>Dimensions:</strong> {selectedBooking.dimensions?.length} x {selectedBooking.dimensions?.width} x {selectedBooking.dimensions?.height}</div>
              <div><strong>Description:</strong> {selectedBooking.description}</div>
              <div><strong>Status:</strong> {selectedBooking.status || "Pending"}</div>
              <div><strong>Created At:</strong> {selectedBooking.createdAt ? new Date(selectedBooking.createdAt).toLocaleString() : ""}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}