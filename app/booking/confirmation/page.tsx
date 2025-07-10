"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, Package, MapPin, Calendar, Truck, Copy, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const bookingId = searchParams.get("id")
    if (bookingId) {
      const bookingData = localStorage.getItem(`booking_${bookingId}`)
      if (bookingData) {
        setBooking(JSON.parse(bookingData))
      }
    }
    setLoading(false)
  }, [searchParams])

  const copyBookingId = () => {
    if (booking?.id) {
      navigator.clipboard.writeText(booking.id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
          <Button onClick={() => router.push("/booking")}>Create New Booking</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">
            Your shipment has been successfully booked. We will contact you soon.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Booking Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">Booking ID</p>
                  <p className="text-blue-600 font-mono">{booking.id}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyBookingId}
                  className="flex items-center space-x-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium capitalize">{booking.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Service Type</p>
                  <p className="font-medium capitalize">{booking.serviceType}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Shipment Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Route</p>
                <p className="font-medium">{booking.from}  {booking.to}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Package Type</p>
                  <p className="font-medium capitalize">{booking.packageType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Weight</p>
                  <p className="font-medium">{booking.weight} kg</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Pickup Date</p>
                <p className="font-medium">{new Date(booking.pickupDate).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{booking.customerName}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{booking.customerEmail}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{booking.customerPhone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Cost Details */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 mb-2">
                ?{booking.estimatedCost?.toLocaleString() || "TBD"}
              </div>
              <p className="text-sm text-gray-600">
                *Final cost will be confirmed after pickup
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push(`/track?id=${booking.id}`)}
            className="flex items-center space-x-2"
          >
            <Package className="w-4 h-4" />
            <span>Track Shipment</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => router.push("/booking")}
            className="flex items-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Another Shipment</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Print Booking</span>
          </Button>
        </div>

        {/* Next Steps */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>What happens next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Confirmation Call</p>
                  <p className="text-sm text-gray-600">
                    Our team will call you within 30 minutes to confirm pickup details
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Pickup Scheduled</p>
                  <p className="text-sm text-gray-600">
                    We will schedule pickup at your preferred date and time
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Real-time Tracking</p>
                  <p className="text-sm text-gray-600">
                    Track your shipment in real-time using your booking ID
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
