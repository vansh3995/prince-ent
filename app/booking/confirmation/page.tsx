"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, MapPin, Calendar, Phone, Mail, Download } from "lucide-react"

export default function BookingConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("id")
  const [bookingData, setBookingData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (bookingId) {
      // Load booking data from localStorage (in production, fetch from API)
      const savedBooking = localStorage.getItem(`booking_${bookingId}`)
      if (savedBooking) {
        setBookingData(JSON.parse(savedBooking))
      }
      setIsLoading(false)
    }
  }, [bookingId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
          <Button onClick={() => router.push("/booking")}>
            Create New Booking
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600">
            Your shipment has been successfully booked. Here are your booking details:
          </p>
        </div>

        {/* Booking Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Booking Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Booking ID</p>
                  <p className="font-medium">{bookingData.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {bookingData.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Service Type</p>
                  <p className="font-medium capitalize">{bookingData.serviceType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Package Type</p>
                  <p className="font-medium capitalize">{bookingData.packageType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Weight</p>
                  <p className="font-medium">{bookingData.weight} kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimated Cost</p>
                  <p className="font-medium text-green-600">₹{bookingData.estimatedCost?.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipment Route */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Shipment Route</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">From</p>
                <p className="font-medium">{bookingData.from}</p>
                <p className="text-sm text-gray-500 mt-1">{bookingData.pickupAddress}</p>
              </div>
              <div className="border-l-2 border-gray-300 ml-2 pl-4">
                <p className="text-sm text-gray-600">To</p>
                <p className="font-medium">{bookingData.to}</p>
                <p className="text-sm text-gray-500 mt-1">{bookingData.deliveryAddress}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pickup Date</p>
                <p className="font-medium flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(bookingData.pickupDate).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{bookingData.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  {bookingData.customerEmail}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  {bookingData.customerPhone}
                </p>
              </div>
              {bookingData.specialInstructions && (
                <div>
                  <p className="text-sm text-gray-600">Special Instructions</p>
                  <p className="font-medium">{bookingData.specialInstructions}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Confirmation Email</p>
                  <p className="text-sm text-gray-600">You will receive a confirmation email shortly</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Package Pickup</p>
                  <p className="text-sm text-gray-600">Our team will contact you for pickup scheduling</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Track Your Shipment</p>
                  <p className="text-sm text-gray-600">Use booking ID to track your shipment status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button
            variant="outline"
            onClick={() => router.push(`/track?awb=${bookingData.id}`)}
          >
            Track Shipment
          </Button>
          <Button
            onClick={() => router.push("/booking")}
          >
            Book Another Shipment
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}