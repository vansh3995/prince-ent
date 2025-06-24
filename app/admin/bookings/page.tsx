"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import toast, { Toaster } from "react-hot-toast"

// Extend the session user type to include 'role'
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      role?: string
    } & DefaultSession["user"]
  }
  interface User {
    role?: string
  }
}

const STATUS_OPTIONS = ["pending", "confirmed", "picked_up", "in_transit", "out_for_delivery", "delivered", "cancelled"]

interface Booking {
  _id: string
  awb: string
  bookingId: string
  serviceType: string
  packageType: string
  weight: string
  value: string
  description: string
  status: string
  pickup: {
    name: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
    email?: string
    date?: string
  }
  delivery: {
    name: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
    email?: string
  }
  dimensions?: {
    length: string
    width: string
    height: string
  }
  userId?: string
  createdAt: string
  updatedAt: string
}

export default function AdminBookingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
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
  }, [status, page, router])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/bookings?page=${page}&limit=${limit}`)
      const data = await res.json()
      
      if (data.success) {
        setBookings(data.bookings || [])
        setTotal(data.total || 0)
      } else {
        console.error('Failed to fetch bookings:', data.message)
        toast.error('Failed to fetch bookings')
      }
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error('Failed to fetch bookings')
    }
    setLoading(false)
  }

  // Filter and search logic
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      search === "" ||
      booking.pickup?.name?.toLowerCase().includes(search.toLowerCase()) ||
      booking.delivery?.name?.toLowerCase().includes(search.toLowerCase()) ||
      booking.pickup?.city?.toLowerCase().includes(search.toLowerCase()) ||
      booking.delivery?.city?.toLowerCase().includes(search.toLowerCase()) ||
      booking.awb?.toLowerCase().includes(search.toLowerCase()) ||
      booking.bookingId?.toLowerCase().includes(search.toLowerCase())
      
    const matchesStatus =
      !filterStatus || booking.status === filterStatus

    // Date filter logic
    const bookingDate = booking.createdAt ? new Date(booking.createdAt) : null
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
    try {
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
    } catch (error) {
      console.error('Status update error:', error)
      toast.error("Failed to update status.")
    }
  }

  // Delete handler
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Booking deleted!")
        fetchBookings()
      } else {
        toast.error("Failed to delete booking.")
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error("Failed to delete booking.")
    }
  }

  // CSV Export
  const exportCSV = () => {
    const headers = [
      "AWB,Pickup Name,Delivery Name,Service,Package,Pickup City,Delivery City,Date,Value,Status"
    ]
    const rows = filteredBookings.map(b =>
      [
        b.awb || b.bookingId || 'N/A',
        b.pickup?.name || 'N/A',
        b.delivery?.name || 'N/A',
        b.serviceType || 'N/A',
        b.packageType || 'N/A',
        b.pickup?.city || 'N/A',
        b.delivery?.city || 'N/A',
        b.pickup?.date || new Date(b.createdAt).toLocaleDateString(),
        b.value || 'N/A',
        b.status || "pending"
      ].join(",")
    )
    const csvContent = [headers, ...rows].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (status === "loading") return <p>Checking authentication...</p>
  if (status === "unauthenticated") return null

  return (
    <div className="container mx-auto py-8">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Bookings</h1>
        <div className="text-sm text-gray-600">
          Role: <span className="font-semibold capitalize">{role || 'admin'}</span>
        </div>
      </div>
      
      {/* Search and Filter Controls */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <input
          className="border px-3 py-2 rounded w-64"
          placeholder="Search by name, city, or AWB number"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border px-3 py-2 rounded"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          aria-label="Filter bookings by status"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(status => (
            <option key={status} value={status}>{status.replace('_', ' ').toUpperCase()}</option>
          ))}
        </select>
        <input
          type="date"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
          className="border px-3 py-2 rounded"
          placeholder="From Date"
        />
        <input
          type="date"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
          className="border px-3 py-2 rounded"
          placeholder="To Date"
        />
        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Export CSV
        </button>
        <button
          onClick={() => { 
            setSearch("")
            setFilterStatus("")
            setFromDate("")
            setToDate("")
            setPage(1)
          }}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Clear Filters
        </button>
      </div>

      {/* Bulk Actions */}
      <div className="flex gap-2 mb-4">
        <button
          disabled={selectedIds.length === 0}
          onClick={() => {
            const newStatus = prompt("Enter new status for selected bookings:")
            if (newStatus && STATUS_OPTIONS.includes(newStatus.toLowerCase())) {
              selectedIds.forEach(id => handleStatusChange(id, newStatus.toLowerCase()))
              setSelectedIds([])
            } else {
              toast.error("Invalid status")
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Update Status ({selectedIds.length})
        </button>
        {role === "superadmin" && (
          <button
            disabled={selectedIds.length === 0}
            onClick={async () => {
              if (!window.confirm(`Delete ${selectedIds.length} selected bookings?`)) return
              for (const id of selectedIds) {
                await fetch(`/api/bookings/${id}`, { method: "DELETE" })
              }
              toast.success("Selected bookings deleted!")
              setSelectedIds([])
              fetchBookings()
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            Delete Selected ({selectedIds.length})
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredBookings.length} of {total} bookings
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading bookings...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No bookings found matching your criteria.</p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <Card key={booking._id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(booking._id)}
                        onChange={e => {
                          e.stopPropagation()
                          setSelectedIds(ids =>
                            e.target.checked
                              ? [...ids, booking._id]
                              : ids.filter(id => id !== booking._id)
                          )
                        }}
                        className="mr-2"
                        title="Select booking"
                      />
                      <span className="font-bold text-blue-600">
                        AWB: {booking.awb || booking.bookingId || 'Not Generated'}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      booking.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      booking.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent
                  onClick={() => setSelectedBooking(booking)}
                  className="cursor-pointer"
                >
                  <p><strong>Service:</strong> {booking.serviceType}</p>
                  <p><strong>Package:</strong> {booking.packageType}</p>
                  <p><strong>Pickup:</strong> {booking.pickup?.name} - {booking.pickup?.city}</p>
                  <p><strong>Delivery:</strong> {booking.delivery?.name} - {booking.delivery?.city}</p>
                  <p><strong>Date:</strong> {booking.pickup?.date || new Date(booking.createdAt).toLocaleDateString()}</p>
                  <p><strong>Value:</strong> ₹{booking.value}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <strong>Status:</strong>
                    <select
                      className="border px-2 py-1 rounded"
                      value={booking.status || "pending"}
                      onClick={e => e.stopPropagation()}
                      onChange={e => {
                        e.stopPropagation()
                        handleStatusChange(booking._id, e.target.value)
                      }}
                      aria-label="Update booking status"
                    >
                      {STATUS_OPTIONS.map(status => (
                        <option key={status} value={status}>{status.replace('_', ' ').toUpperCase()}</option>
                      ))}
                    </select>
                    {role === "superadmin" && (
                      <button
                        onClick={e => {
                          e.stopPropagation()
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
            ))
          )}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-gray-600">
          Showing {filteredBookings.length} of {total} bookings
        </p>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">Page {page} of {Math.ceil(total / limit)}</span>
          <button
            disabled={page >= Math.ceil(total / limit)}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg relative">
            <button
              className="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedBooking(null)}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div><strong>AWB Number:</strong> {selectedBooking.awb || selectedBooking.bookingId}</div>
                <div><strong>Service Type:</strong> {selectedBooking.serviceType}</div>
                <div><strong>Package Type:</strong> {selectedBooking.packageType}</div>
                <div><strong>Weight:</strong> {selectedBooking.weight} kg</div>
                <div><strong>Value:</strong> ₹{selectedBooking.value}</div>
                <div><strong>Status:</strong> {selectedBooking.status || "Pending"}</div>
              </div>
              <div className="space-y-2">
                <div><strong>Created:</strong> {new Date(selectedBooking.createdAt).toLocaleString()}</div>
                <div><strong>Description:</strong> {selectedBooking.description}</div>
                {selectedBooking.dimensions && (
                  <div><strong>Dimensions:</strong> {selectedBooking.dimensions.length} × {selectedBooking.dimensions.width} × {selectedBooking.dimensions.height} cm</div>
                )}
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-green-700 mb-2">Pickup Details</h3>
                <div className="space-y-1 text-sm">
                  <div><strong>Name:</strong> {selectedBooking.pickup?.name}</div>
                  <div><strong>Phone:</strong> {selectedBooking.pickup?.phone}</div>
                  <div><strong>Email:</strong> {selectedBooking.pickup?.email || 'N/A'}</div>
                  <div><strong>Address:</strong> {selectedBooking.pickup?.address}</div>
                  <div><strong>City:</strong> {selectedBooking.pickup?.city}</div>
                  <div><strong>State:</strong> {selectedBooking.pickup?.state}</div>
                  <div><strong>Pincode:</strong> {selectedBooking.pickup?.pincode}</div>
                  {selectedBooking.pickup?.date && (
                    <div><strong>Date:</strong> {selectedBooking.pickup.date}</div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-blue-700 mb-2">Delivery Details</h3>
                <div className="space-y-1 text-sm">
                  <div><strong>Name:</strong> {selectedBooking.delivery?.name}</div>
                  <div><strong>Phone:</strong> {selectedBooking.delivery?.phone}</div>
                  <div><strong>Email:</strong> {selectedBooking.delivery?.email || 'N/A'}</div>
                  <div><strong>Address:</strong> {selectedBooking.delivery?.address}</div>
                  <div><strong>City:</strong> {selectedBooking.delivery?.city}</div>
                  <div><strong>State:</strong> {selectedBooking.delivery?.state}</div>
                  <div><strong>Pincode:</strong> {selectedBooking.delivery?.pincode}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}