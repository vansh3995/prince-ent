"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/context/admin-auth-context"
import { Package, Search, Filter, Eye, Edit } from "lucide-react"

interface Booking {
  id: string
  awb: string
  customerName: string
  customerEmail: string
  from: string
  to: string
  serviceType: string
  packageType: string
  weight: number
  status: string
  createdAt: string
  value: number
}

export default function AdminBookingsPage() {
  const { admin, isLoading } = useAdminAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    if (!isLoading && !admin) {
      router.push("/admin/login")
    }
  }, [admin, isLoading, router])

  useEffect(() => {
    if (admin) {
      fetchBookings()
    }
  }, [admin])

  const fetchBookings = async () => {
    try {
      const mockBookings: Booking[] = [
        {
          id: '1',
          awb: 'AWB123456789',
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          from: 'Mumbai',
          to: 'Delhi',
          serviceType: 'Express',
          packageType: 'Document',
          weight: 0.5,
          status: 'delivered',
          createdAt: '2024-12-15T10:30:00Z',
          value: 1000
        },
        {
          id: '2',
          awb: 'AWB987654321',
          customerName: 'Jane Smith',
          customerEmail: 'jane@example.com',
          from: 'Bangalore',
          to: 'Chennai',
          serviceType: 'Standard',
          packageType: 'Package',
          weight: 2.0,
          status: 'in_transit',
          createdAt: '2024-12-14T14:15:00Z',
          value: 2500
        }
      ]
      setBookings(mockBookings)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'in_transit':
        return 'bg-blue-100 text-blue-800'
      case 'picked_up':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.awb?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || booking.status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  if (isLoading || loading) {
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings Management</h1>
          <p className="text-gray-600">Manage all customer bookings and shipments</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="Search by AWB, name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="picked_up">Picked Up</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">All Bookings ({filteredBookings.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">AWB</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Route</th>
                  <th className="px-6 py-3">Service</th>
                  <th className="px-6 py-3">Weight</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Value</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {booking.awb}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">{booking.customerName}</div>
                        <div className="text-gray-500">{booking.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {booking.from}  {booking.to}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div>{booking.serviceType}</div>
                        <div className="text-gray-500">{booking.packageType}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {booking.weight} kg
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      ?{booking.value}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => console.log('View', booking.id)}
                        >
                          View
                        </button>
                        <button
                          className="text-green-600 hover:text-green-800"
                          onClick={() => console.log('Edit', booking.id)}
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
